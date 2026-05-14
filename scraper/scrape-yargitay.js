// Yargıtay Karar Arama scraper
// Strateji: Playwright ile session başlat, sonra /aramadetaylist API'sini doğrudan POST ile çağır
// Daire başına ayrı arama (rate-limited)
//
// Kullanım:
//   node scrape-yargitay.js                          # default: kullanıcının izleme alanları, son 30 gün
//   node scrape-yargitay.js --days=14
//   node scrape-yargitay.js --daireler="11,13,15" --keyword="kefalet"
//   node scrape-yargitay.js --hgk                    # sadece HGK
//   node scrape-yargitay.js --debug

import { chromium } from "playwright";
import { shortDelay, humanDelay } from "./lib/rate-limiter.js";
import { makeOutput, printJSON, printError } from "./lib/output-formatter.js";

// Kullanıcının takip alanları (default daire seti)
const DEFAULT_DAIRELER = {
  "Borçlar/Tüketici/Ticaret": ["3. Hukuk Dairesi", "11. Hukuk Dairesi", "13. Hukuk Dairesi", "15. Hukuk Dairesi"],
  "Aile/Miras/Şahıs": ["2. Hukuk Dairesi", "8. Hukuk Dairesi", "14. Hukuk Dairesi"],
  "İş/SGK": ["9. Hukuk Dairesi", "10. Hukuk Dairesi", "21. Hukuk Dairesi", "22. Hukuk Dairesi"],
};

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    // Yargıtay sistemi kararları ~2-3 ay gecikmeli yayımlar; default 90 gün
    days: 90,
    maxPerDaire: 50,
    keyword: "",
    daireler: null, // CSV (örn. "11,13") veya null = default set
    hgk: false,
    debug: false,
    headless: true,
  };
  for (const a of args) {
    if (a === "--debug") opts.debug = true;
    else if (a === "--headed") opts.headless = false;
    else if (a === "--hgk") opts.hgk = true;
    else if (a.startsWith("--days=")) opts.days = parseInt(a.split("=")[1], 10);
    else if (a.startsWith("--max=")) opts.maxPerDaire = parseInt(a.split("=")[1], 10);
    else if (a.startsWith("--keyword=")) opts.keyword = a.split("=")[1];
    else if (a.startsWith("--daireler=")) opts.daireler = a.split("=")[1];
  }
  return opts;
}

function fmtTr(date) {
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
}

function buildDaireList(opts) {
  if (opts.hgk) return [{ category: "HGK", daire: "Hukuk Genel Kurulu", isKurul: true }];
  if (opts.daireler) {
    return opts.daireler.split(",").map((n) => {
      const num = n.trim();
      return {
        category: "Özel",
        daire: `${num}. Hukuk Dairesi`,
        isKurul: false,
      };
    });
  }
  const out = [];
  for (const [cat, ds] of Object.entries(DEFAULT_DAIRELER)) {
    for (const d of ds) out.push({ category: cat, daire: d, isKurul: false });
  }
  return out;
}

async function searchOneDaire({ page, daireInfo, keyword, startTr, endTr, maxRes, log }) {
  const body = {
    data: {
      arananKelime: keyword || "",
      esasYil: "",
      esasIlkSiraNo: "",
      esasSonSiraNo: "",
      kararYil: "",
      kararIlkSiraNo: "",
      kararSonSiraNo: "",
      baslangicTarihi: startTr,
      bitisTarihi: endTr,
      siralama: "3", // 3 = Karar Tarihi'ne göre
      siralamaDirection: "desc",
      birimYrgKurulDaire: daireInfo.isKurul ? daireInfo.daire : "",
      birimYrgHukukDaire: daireInfo.isKurul ? "" : daireInfo.daire,
      birimYrgCezaDaire: "",
      hukuk: daireInfo.isKurul ? "" : daireInfo.daire,
      pageSize: Math.min(maxRes, 100),
      pageNumber: 1,
    },
  };

  log(`POST /aramadetaylist | ${daireInfo.daire} | ${startTr}-${endTr}`);

  // Playwright'ın page.request API'siyle direkt POST yap (UI ile uğraşma)
  const resp = await page.request.post("https://karararama.yargitay.gov.tr/aramadetaylist", {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Accept": "application/json, text/javascript, */*; q=0.01",
      "X-Requested-With": "XMLHttpRequest",
      "Origin": "https://karararama.yargitay.gov.tr",
      "Referer": "https://karararama.yargitay.gov.tr/",
    },
    data: body,
    timeout: 30000,
  });

  if (!resp.ok()) {
    log(`HTTP ${resp.status()}`);
    return { error: `HTTP ${resp.status()}`, items: [], total: null };
  }

  const json = await resp.json().catch(() => null);
  if (!json || !json.data || !Array.isArray(json.data.data)) {
    log("Geçersiz JSON yapısı");
    return { error: "Invalid JSON", items: [], total: null };
  }

  const items = json.data.data.map((r) => ({
    id: r.id,
    daire: r.daire,
    esas: r.esasNo,
    karar: r.kararNo,
    tarih: r.kararTarihi,
    kunye: `Y. ${r.daire}, E. ${r.esasNo}, K. ${r.kararNo}, T. ${r.kararTarihi}`,
  }));

  return {
    error: null,
    items,
    total: json.data.recordsTotal ?? items.length,
  };
}

async function scrape() {
  const opts = parseArgs();
  const log = opts.debug ? (...a) => console.error("[yargitay]", ...a) : () => {};

  const today = new Date();
  const start = new Date();
  start.setDate(today.getDate() - opts.days);
  const startTr = fmtTr(start);
  const endTr = fmtTr(today);

  const daireList = buildDaireList(opts);
  log(`Aranacak: ${daireList.length} daire | Tarih: ${startTr} → ${endTr} | Anahtar: "${opts.keyword || "(boş)"}"`);

  const browser = await chromium.launch({ headless: opts.headless });
  const ctx = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 900 },
    locale: "tr-TR",
    ignoreHTTPSErrors: true,
  });
  const page = await ctx.newPage();

  try {
    // Session başlat — ana sayfayı aç, jsessionid cookie al
    log("Session başlatılıyor...");
    await page.goto("https://karararama.yargitay.gov.tr/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await shortDelay(2000, 3000);

    const allResults = [];
    for (const d of daireList) {
      const res = await searchOneDaire({
        page,
        daireInfo: d,
        keyword: opts.keyword,
        startTr,
        endTr,
        maxRes: opts.maxPerDaire,
        log,
      });

      allResults.push({
        category: d.category,
        daire: d.daire,
        total: res.total,
        items: res.items,
        error: res.error,
      });

      // İnsan benzeri bekleme — siteyi yormamak için
      log(`Daire bitti: ${d.daire} (${res.items.length} sonuç). Bekleniyor...`);
      await humanDelay(8000, 14000);
    }

    await browser.close();

    const flatItems = [];
    for (const r of allResults) {
      for (const it of r.items) {
        flatItems.push({ category: r.category, ...it });
      }
    }

    printJSON(
      makeOutput({
        source: "Yargıtay",
        ok: true,
        items: flatItems,
        meta: {
          dateRange: { startTr, endTr, days: opts.days },
          keyword: opts.keyword || null,
          daireler: daireList.map((d) => d.daire),
          perDaireResults: allResults.map((r) => ({
            category: r.category,
            daire: r.daire,
            count: r.items.length,
            total: r.total,
            error: r.error,
          })),
          totalItems: flatItems.length,
        },
      })
    );
  } catch (err) {
    await browser.close().catch(() => {});
    printError("Yargıtay", err);
    process.exit(1);
  }
}

scrape();
