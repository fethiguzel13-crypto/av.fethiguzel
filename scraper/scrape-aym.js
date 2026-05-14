// AYM Bireysel Başvuru Kararları scraper
// Strateji: kararlarbilgibankasi.anayasa.gov.tr GET tabanlı arama, Playwright ile sayfa yüklenir,
// sonuç listesi div'lerden parse edilir
//
// Kullanım:
//   node scrape-aym.js                         # son 90 gün, tüm karar türleri
//   node scrape-aym.js --days=30 --max=50
//   node scrape-aym.js --tur=ihlal             # sadece ihlal kararları
//   node scrape-aym.js --tur=ihlal --keyword="mülkiyet"
//   node scrape-aym.js --debug

import { chromium } from "playwright";
import { shortDelay } from "./lib/rate-limiter.js";
import { makeOutput, printJSON, printError } from "./lib/output-formatter.js";

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    // AYM sistemine kararlar ~30-60 gün gecikmeli yansıyor; default 90 gün
    days: 90,
    max: 50,
    tur: null, // null = tümü; "ihlal", "ihlal-degil", "kabul-edilemez"
    keyword: "",
    birim: null, // null = tümü; "birinci", "ikinci", "genel-kurul"
    debug: false,
    headless: true,
  };
  for (const a of args) {
    if (a === "--debug") opts.debug = true;
    else if (a === "--headed") opts.headless = false;
    else if (a.startsWith("--days=")) opts.days = parseInt(a.split("=")[1], 10);
    else if (a.startsWith("--max=")) opts.max = parseInt(a.split("=")[1], 10);
    else if (a.startsWith("--tur=")) opts.tur = a.split("=")[1];
    else if (a.startsWith("--keyword=")) opts.keyword = a.split("=")[1];
    else if (a.startsWith("--birim=")) opts.birim = a.split("=")[1];
  }
  return opts;
}

function fmtSlash(date) {
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

function buildUrl(opts) {
  const today = new Date();
  const start = new Date();
  start.setDate(today.getDate() - opts.days);

  const params = new URLSearchParams();
  params.append("KararTarihiBaslangic", fmtSlash(start));
  params.append("KararTarihiBitis", fmtSlash(today));

  if (opts.keyword) {
    params.append("KelimeAra[]", opts.keyword);
  }
  if (opts.tur === "ihlal") {
    params.append("KararTuru[]", "1"); // Esas (İhlal) — değer tahmini, gerekirse düzelt
  } else if (opts.tur === "ihlal-degil") {
    params.append("KararTuru[]", "2");
  } else if (opts.tur === "kabul-edilemez") {
    params.append("KararTuru[]", "3");
  }
  if (opts.birim === "birinci") params.append("KarariVerenKurum", "1");
  else if (opts.birim === "ikinci") params.append("KarariVerenKurum", "2");
  else if (opts.birim === "genel-kurul") params.append("KarariVerenKurum", "3");

  return `https://kararlarbilgibankasi.anayasa.gov.tr/Ara?${params.toString()}`;
}

// Sayfa metnindeki karar listesini parse et
// Her karar tipik formatta:
// "İSİM Başvurusuna İlişkin Karar"
// "YIL/SAYI | Esas (İhlal/Kabul Edilemezlik vd.)| Birinci/İkinci Bölüm/Genel Kurul | Başvuru Tarihi : DD/MM/YYYY | Karar Tarihi : DD/MM/YYYY"
// "BAŞVURU KONUSU: ..."
function parseCardsFromText(text, max) {
  // Karar bloklarını ayır — "X Başvurusuna İlişkin Karar" başlığıyla başlar
  // Sonraki satır: başvuru no, tür, bölüm, tarihler
  // Sonraki: BAŞVURU KONUSU
  const lines = text.split("\n").map((l) => l.trim());
  const items = [];
  for (let i = 0; i < lines.length && items.length < max; i++) {
    const line = lines[i];
    // "ERDEM KARAMANOĞLU VE DİĞERLERİ Başvurusuna İlişkin Karar"
    const titleMatch = line.match(/^(.+?)\s+Başvurusuna İlişkin Karar$/);
    if (!titleMatch) continue;

    const basvuran = titleMatch[1].trim();

    // Sonraki satırdaki meta bilgisi
    const metaLine = lines[i + 1] || "";
    // Örn: "2024/47620 | Esas (İhlal)| İkinci Bölüm | Başvuru Tarihi : 08/08/2024 | Karar Tarihi : 29/01/2026"
    const metaParts = metaLine.split("|").map((p) => p.trim());
    if (metaParts.length < 4) continue;

    const basvuruNo = metaParts[0];
    const tur = metaParts[1] || null;
    const birim = metaParts[2] || null;
    let basvuruTarihi = null;
    let kararTarihi = null;
    for (const p of metaParts.slice(3)) {
      const bm = p.match(/Başvuru Tarihi\s*:\s*(\S+)/);
      if (bm) basvuruTarihi = bm[1];
      const km = p.match(/Karar Tarihi\s*:\s*(\S+)/);
      if (km) kararTarihi = km[1];
    }

    // Konu (BAŞVURU KONUSU: ile başlayan satır)
    let konu = null;
    for (let j = i + 2; j < Math.min(i + 6, lines.length); j++) {
      const m = lines[j].match(/BAŞVURU KONUSU:\s*(.+)/);
      if (m) {
        konu = m[1];
        // Sonraki satırlarda devam ediyor mu kontrol et (eğer "X Başvurusuna" başlamıyorsa)
        for (let k = j + 1; k < Math.min(j + 3, lines.length); k++) {
          if (/Başvurusuna İlişkin Karar$/.test(lines[k])) break;
          if (lines[k] && lines[k].length > 20) konu += " " + lines[k];
          else break;
        }
        break;
      }
    }

    items.push({
      basvuran,
      basvuruNo,
      tur,
      birim,
      basvuruTarihi,
      kararTarihi,
      konu,
      kunye: `AYM, B. No: ${basvuruNo}, K.T. ${kararTarihi || "?"}, ${birim || "?"}`,
    });
  }
  return items;
}

async function scrape() {
  const opts = parseArgs();
  const log = opts.debug ? (...a) => console.error("[aym]", ...a) : () => {};

  const url = buildUrl(opts);
  log("URL:", url);

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
    log("Navigating...");
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await shortDelay(3000, 5000);

    log("Final URL:", page.url());

    // Sayfa içeriğinden parse et
    const bodyText = await page.evaluate(() => document.body.innerText);

    // Toplam karar sayısını bul
    const totalMatch = bodyText.match(/(\d+)\s+Karar Bulundu/);
    const totalCount = totalMatch ? parseInt(totalMatch[1], 10) : null;
    log("Total found:", totalCount);

    // Tarih format hatası kontrolü
    const formatErrors = [];
    if (/Karar Tarihi.*Formatına Uymuyor/.test(bodyText)) {
      formatErrors.push("Karar Tarihi format hatası");
    }
    if (/Başvuru Tarihi.*Formatına Uymuyor/.test(bodyText)) {
      formatErrors.push("Başvuru Tarihi format hatası");
    }

    const items = parseCardsFromText(bodyText, opts.max);
    log(`Parsed ${items.length} items`);

    await browser.close();

    printJSON(
      makeOutput({
        source: "AYM-BireyselBasvuru",
        ok: true,
        items,
        meta: {
          dateRange: { days: opts.days },
          tur: opts.tur,
          keyword: opts.keyword || null,
          birim: opts.birim,
          totalResultsAtSource: totalCount,
          returnedCount: items.length,
          formatErrors: formatErrors.length ? formatErrors : null,
          url,
        },
      })
    );
  } catch (err) {
    await browser.close().catch(() => {});
    printError("AYM-BireyselBasvuru", err, { url });
    process.exit(1);
  }
}

scrape();
