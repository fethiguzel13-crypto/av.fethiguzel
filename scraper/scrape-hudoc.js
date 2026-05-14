// HUDOC (AİHM) Türkiye kararları scraper — v2
// Strateji: Playwright ile sayfayı aç, ALT YATAN API ÇAĞRILARINI intercept et.
// HUDOC kendi JSON API'sini çağırır (/app/query/results) — bu response'u yakalarız.
//
// Kullanım:
//   node scrape-hudoc.js --days=30 --max=50
//   node scrape-hudoc.js --debug --headed   (sorun olursa)

import { chromium } from "playwright";
import { shortDelay } from "./lib/rate-limiter.js";
import { makeOutput, printJSON, printError } from "./lib/output-formatter.js";

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { days: 30, max: 50, debug: false, headless: true };
  for (const a of args) {
    if (a === "--debug") opts.debug = true;
    else if (a === "--headed") opts.headless = false;
    else if (a.startsWith("--days=")) opts.days = parseInt(a.split("=")[1], 10);
    else if (a.startsWith("--max=")) opts.max = parseInt(a.split("=")[1], 10);
  }
  return opts;
}

function isoDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

async function scrape() {
  const opts = parseArgs();
  const log = opts.debug ? (...a) => console.error("[hudoc]", ...a) : () => {};

  const dateFrom = isoDaysAgo(opts.days);
  const dateTo = isoDaysAgo(0);

  const filter = {
    respondent: ["TUR"],
    documentcollectionid2: ["JUDGMENTS", "DECISIONS"],
    kpdate: [`${dateFrom}T00:00:00.0Z`, `${dateTo}T23:59:59.0Z`],
    sort: ["kpdate Descending"],
  };
  const url = `https://hudoc.echr.coe.int/eng#${JSON.stringify(filter)}`;
  log("URL:", url);
  log("Date range:", dateFrom, "→", dateTo);

  const browser = await chromium.launch({ headless: opts.headless });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 900 },
    locale: "en-GB",
  });
  const page = await context.newPage();

  // Network response intercept
  const captured = [];
  page.on("response", async (response) => {
    const u = response.url();
    if (u.includes("/app/query") || u.includes("/results") || u.includes("/api/")) {
      log("API response:", response.status(), u.slice(0, 120));
      try {
        const ct = response.headers()["content-type"] || "";
        if (ct.includes("json")) {
          const body = await response.json().catch(() => null);
          if (body) {
            captured.push({ url: u, status: response.status(), body });
          }
        }
      } catch (e) {
        log("intercept error:", e.message);
      }
    }
  });

  try {
    log("Navigating...");
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await shortDelay(2500, 4000);

    log("API responses captured:", captured.length);

    // En büyük JSON'u veri olarak kabul et (results genelde en büyük)
    let bestData = null;
    let bestUrl = null;
    for (const c of captured) {
      const b = c.body;
      // HUDOC API genelde { resultcount, results: [...] } şeklinde
      if (b && (Array.isArray(b.results) || Array.isArray(b.Documents) || Array.isArray(b))) {
        if (!bestData) {
          bestData = b;
          bestUrl = c.url;
        }
      }
    }

    let items = [];
    let resultCount = null;

    if (bestData) {
      log("Best response URL:", bestUrl);
      const arr =
        bestData.results || bestData.Documents || (Array.isArray(bestData) ? bestData : []);
      resultCount = bestData.resultcount ?? bestData.ResultCount ?? arr.length;
      log("Result count from API:", resultCount, "Returned:", arr.length);

      items = arr.slice(0, opts.max).map((r) => {
        const cols = r.columns || r.Columns || r;
        return {
          itemId: cols.itemid || cols.ItemId || cols.itemId || null,
          appNo: cols.appno || cols.AppNo || cols.applicationNumber || null,
          caseName: cols.docname || cols.DocName || cols.caseName || cols.title || null,
          articles: cols.article || cols.Article || cols.articles || null,
          date: cols.kpdate || cols.judgementdate || cols.date || null,
          respondent: cols.respondent || cols.Respondent || null,
          conclusion: cols.conclusion || cols.Conclusion || null,
          importance: cols.importance || cols.Importance || null,
          rawColumns: opts.debug ? cols : undefined,
        };
      });
    }

    // Fallback: DOM'dan a11y label'larını oku — Result count'u sayalım en azından
    let bodySnippet = "";
    if (items.length === 0) {
      bodySnippet = await page
        .evaluate(() => document.body.innerText.slice(0, 1500))
        .catch(() => "");
      const m = bodySnippet.match(/Result count is (\d+)/);
      if (m) resultCount = parseInt(m[1], 10);
      log("DOM result count:", resultCount);
    }

    await browser.close();

    printJSON(
      makeOutput({
        source: "HUDOC",
        ok: true,
        items,
        meta: {
          dateRange: { from: dateFrom, to: dateTo },
          requestedMax: opts.max,
          resultCount,
          apiResponsesCaptured: captured.length,
          apiUrlUsed: bestUrl,
          bodySnippetIfEmpty: items.length === 0 ? bodySnippet : undefined,
          url,
        },
      })
    );
  } catch (err) {
    await browser.close().catch(() => {});
    printError("HUDOC", err, { url });
    process.exit(1);
  }
}

scrape();
