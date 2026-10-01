/**
 * Mevzuat araması — tembel indeks doğrulaması (Aylık plan G00/G13).
 * 8,9 MB'lık mevzuat-index.json yalnız arama yapılınca inmeli; sayfayı açan herkes ve botlar indirmemeli.
 *
 *   npx next start -p 3123   (derlenmiş site)
 *   node scripts/dogrula-arama.mjs [--taban=http://localhost:3123]
 */
import { chromium } from "playwright";

const TABAN = (process.argv.find((a) => a.startsWith("--taban=")) || "").slice(8) || "http://localhost:3123";
let kotu = 0;
const kontrol = (ok, mesaj) => {
  console.log(`${ok ? "✔" : "✖"} ${mesaj}`);
  if (!ok) kotu++;
};

async function sayfa(browser, yol) {
  const page = await browser.newPage();
  const indeksIstekleri = [];
  const hatalar = [];
  page.on("request", (r) => r.url().includes("/data/mevzuat-index.json") && indeksIstekleri.push(r.url()));
  page.on("pageerror", (e) => hatalar.push(String(e.message).slice(0, 200)));
  await page.goto(TABAN + yol, { waitUntil: "networkidle", timeout: 60_000 });
  return { page, indeksIstekleri, hatalar };
}

const sonucSayisi = (page) => page.locator('a[href^="/mevzuat/"][href*="/madde-"]').count();

const browser = await chromium.launch();
try {
  // 1) /mevzuat: açılışta indeks inmez; yazınca iner ve sonuç gelir.
  const m = await sayfa(browser, "/mevzuat");
  await m.page.waitForTimeout(2000);
  kontrol(m.indeksIstekleri.length === 0, `/mevzuat açılışında indeks inmedi (${m.indeksIstekleri.length} istek)`);
  const kutu = m.page.locator('input[aria-label="Site ve mevzuat ara"]').filter({ visible: true }).first();
  await kutu.click();
  await kutu.fill("kira");
  await m.page.waitForResponse((r) => r.url().includes("/data/mevzuat-index.json"), { timeout: 30_000 }).catch(() => null);
  await m.page.waitForTimeout(1500);
  kontrol(m.indeksIstekleri.length >= 1, "kutuya yazınca indeks indi");
  const once = await sonucSayisi(m.page);
  kontrol(once > 0, `"kira" için madde sonuçları göründü (${once} bağlantı)`);
  kontrol(m.hatalar.length === 0, `/mevzuat sayfa hatası yok ${m.hatalar.join(" | ")}`);
  await m.page.close();

  // 2) /ara?q=kira: sorgu URL'de → indeks hemen iner, sonuçlar gelir.
  const a = await sayfa(browser, "/ara?q=kira");
  await a.page.waitForTimeout(2500);
  kontrol(a.indeksIstekleri.length >= 1, "/ara?q=kira indeksi hemen yükledi");
  kontrol((await sonucSayisi(a.page)) > 0, "/ara?q=kira sonuç gösterdi");
  kontrol(a.hatalar.length === 0, `/ara?q=kira sayfa hatası yok ${a.hatalar.join(" | ")}`);
  await a.page.close();
} finally {
  await browser.close();
}
console.log(kotu ? `\n${kotu} kontrol başarısız` : "\nTüm kontroller geçti");
process.exit(kotu ? 1 : 0);
