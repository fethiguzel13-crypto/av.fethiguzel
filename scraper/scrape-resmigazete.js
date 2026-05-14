// Resmî Gazete günlük scraper
// Strateji: belirli tarih için RG indeks sayfasını çek, kategorilere göre parse et
// (Yürütme/İdare, Yasama, Yönetmelikler, Tebliğler, AYM Kararları, YİBK, Yargı İlanları vb.)
//
// Kullanım:
//   node scrape-resmigazete.js                       # bugün
//   node scrape-resmigazete.js --date=2026-05-13
//   node scrape-resmigazete.js --days=7              # son 7 günü tara
//   node scrape-resmigazete.js --debug

import { chromium } from "playwright";
import { shortDelay, humanDelay } from "./lib/rate-limiter.js";
import { makeOutput, printJSON, printError } from "./lib/output-formatter.js";

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    date: null, // YYYY-MM-DD; null = bugün
    days: 1,
    debug: false,
    headless: true,
  };
  for (const a of args) {
    if (a === "--debug") opts.debug = true;
    else if (a === "--headed") opts.headless = false;
    else if (a.startsWith("--date=")) opts.date = a.split("=")[1];
    else if (a.startsWith("--days=")) opts.days = parseInt(a.split("=")[1], 10);
  }
  return opts;
}

function rgUrl(date) {
  // https://www.resmigazete.gov.tr/eskiler/YYYY/MM/YYYYMMDD.htm
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `https://www.resmigazete.gov.tr/eskiler/${y}/${m}/${y}${m}${d}.htm`;
}

function isoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// Bir RG sayfasını parse et — kategoriler ve maddeler
async function fetchOneDay(page, date, log) {
  const url = rgUrl(date);
  log(`Fetching: ${url}`);

  try {
    const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    if (!resp || !resp.ok()) {
      // 404: o tarihte RG yayımlanmamış olabilir (resmi tatil, vs.)
      log(`HTTP ${resp ? resp.status() : "no response"} for ${isoDate(date)}`);
      return { date: isoDate(date), url, ok: false, error: `HTTP ${resp ? resp.status() : "fail"}`, sections: [], totalSayi: null };
    }
    await shortDelay(1000, 2000);

    const result = await page.evaluate(() => {
      // RG sayfasında kategoriler genelde <h1>, <h2>, <h3> veya class içeren başlıklarla ayrılır
      // Her kategori altında <ul>/<li> veya <a> listesi var
      // Sayı bilgisi sayfa başında

      const out = {
        sayi: null,
        sections: [],
        rawText: document.body.innerText.slice(0, 100),
      };

      // "Sayı : XXXXX" desenini ara
      const sayiMatch = document.body.innerText.match(/Say[ıi]\s*[:：]?\s*(\d{4,6})/);
      if (sayiMatch) out.sayi = sayiMatch[1];

      // Kategorileri tespit et — RG'de tipik kategoriler:
      const categoryRegex = /^(YÜRÜTME\s*VE\s*İDARE|YASAMA|YARGI|İLAN|YÖNETMELİKLER?|TEBLİĞLER?|CUMHURBAŞKANI|KANUNLAR?|KARARLAR?|KARAR|GENELGE)/i;

      // Tüm linkleri ve yakın metin başlıklarını topla
      const allElems = Array.from(document.querySelectorAll("h1, h2, h3, h4, p, b, strong, a, td"));
      let currentSection = null;
      const sections = [];

      for (const el of allElems) {
        const text = (el.innerText || "").trim();
        if (!text) continue;

        // Kategori başlığı mı?
        if (categoryRegex.test(text) && text.length < 80) {
          currentSection = {
            name: text.slice(0, 80),
            items: [],
          };
          sections.push(currentSection);
          continue;
        }

        // Link mi?
        if (el.tagName === "A" && el.href && currentSection) {
          const href = el.href;
          // İçerik linklerini tut: .htm, .pdf, /eskiler/
          if (/(\.htm|\.pdf|eskiler|MevzuatMetin)/i.test(href)) {
            if (text.length > 5 && text.length < 500) {
              currentSection.items.push({
                title: text.slice(0, 400),
                href,
              });
            }
          }
        }
      }

      // Eğer hiç section bulunamadıysa, sadece tüm linkleri liste halinde dök
      if (sections.length === 0) {
        const linkList = Array.from(document.querySelectorAll("a[href]"))
          .filter((a) => /(\.htm|\.pdf|eskiler|MevzuatMetin)/i.test(a.href))
          .filter((a) => {
            const t = a.innerText || "";
            return t.length > 10 && t.length < 500;
          })
          .slice(0, 50)
          .map((a) => ({
            title: a.innerText.trim().slice(0, 400),
            href: a.href,
          }));
        if (linkList.length > 0) {
          sections.push({ name: "(Kategorisiz)", items: linkList });
        }
      }

      out.sections = sections;
      return out;
    });

    return { date: isoDate(date), url, ok: true, ...result };
  } catch (e) {
    log(`Error: ${e.message}`);
    return { date: isoDate(date), url, ok: false, error: e.message, sections: [], sayi: null };
  }
}

async function scrape() {
  const opts = parseArgs();
  const log = opts.debug ? (...a) => console.error("[rg]", ...a) : () => {};

  // Hedef tarihleri belirle
  const targets = [];
  if (opts.date) {
    const d = new Date(opts.date + "T12:00:00");
    targets.push(d);
  } else {
    // Bugünden geriye N gün
    for (let i = 0; i < opts.days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      targets.push(d);
    }
  }

  log(`Fetching ${targets.length} day(s)`);

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
    const days = [];
    for (const d of targets) {
      const result = await fetchOneDay(page, d, log);
      days.push(result);
      if (targets.length > 1) await humanDelay(3000, 6000);
    }
    await browser.close();

    // Düzleştirilmiş items: her gün için her madde
    const flat = [];
    for (const day of days) {
      if (!day.ok) continue;
      for (const sec of day.sections || []) {
        for (const it of sec.items) {
          flat.push({
            date: day.date,
            sayi: day.sayi,
            category: sec.name,
            title: it.title,
            href: it.href,
          });
        }
      }
    }

    printJSON(
      makeOutput({
        source: "ResmiGazete",
        ok: true,
        items: flat,
        meta: {
          daysFetched: days.map((d) => ({
            date: d.date,
            sayi: d.sayi,
            ok: d.ok,
            error: d.error,
            sectionCount: (d.sections || []).length,
            itemCount: (d.sections || []).reduce((acc, s) => acc + s.items.length, 0),
          })),
          totalItems: flat.length,
        },
      })
    );
  } catch (err) {
    await browser.close().catch(() => {});
    printError("ResmiGazete", err);
    process.exit(1);
  }
}

scrape();
