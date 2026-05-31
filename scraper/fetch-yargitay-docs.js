// Yargıtay karar TAM METİN çekici — id listesi ile getDokuman endpoint'ini çağırır.
// Şerh üretiminde künyeye içerik atfetmeden önce kararın gerçek konusunu doğrulamak için.
//
// Kullanım:
//   node fetch-yargitay-docs.js --ids="1207463700,1207472700"
//   node fetch-yargitay-docs.js --ids="..." --chars=1200   (her karardan kaç karakter özet)

import { chromium } from "playwright";
import { shortDelay, humanDelay } from "./lib/rate-limiter.js";

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { ids: [], chars: 1500, debug: false };
  for (const a of args) {
    if (a === "--debug") opts.debug = true;
    else if (a.startsWith("--ids=")) opts.ids = a.split("=")[1].split(",").map((s) => s.trim()).filter(Boolean);
    else if (a.startsWith("--chars=")) opts.chars = parseInt(a.split("=")[1], 10);
  }
  return opts;
}

function stripHtml(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>(?=)/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#305;/g, "ı")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

async function run() {
  const opts = parseArgs();
  const log = opts.debug ? (...a) => console.error("[fetch]", ...a) : () => {};
  if (!opts.ids.length) {
    console.error("ids gerekli");
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
    locale: "tr-TR",
    ignoreHTTPSErrors: true,
  });
  const page = await ctx.newPage();
  const out = [];
  try {
    await page.goto("https://karararama.yargitay.gov.tr/", { waitUntil: "domcontentloaded", timeout: 60000 });
    await shortDelay(1500, 2500);

    for (const id of opts.ids) {
      try {
        const resp = await page.request.get(`https://karararama.yargitay.gov.tr/getDokuman?id=${id}`, {
          headers: {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "X-Requested-With": "XMLHttpRequest",
            "Referer": "https://karararama.yargitay.gov.tr/",
          },
          timeout: 30000,
        });
        if (!resp.ok()) {
          out.push({ id, error: `HTTP ${resp.status()}` });
        } else {
          const json = await resp.json().catch(() => null);
          const html = json && json.data ? json.data : "";
          const text = stripHtml(html);
          out.push({ id, len: text.length, text: text.slice(0, opts.chars) });
        }
      } catch (e) {
        out.push({ id, error: String(e.message || e) });
      }
      await humanDelay(2500, 4500);
    }
    await browser.close();
    console.log(JSON.stringify({ ok: true, docs: out }, null, 2));
  } catch (err) {
    await browser.close().catch(() => {});
    console.log(JSON.stringify({ ok: false, error: String(err.message || err), docs: out }, null, 2));
    process.exit(1);
  }
}

run();
