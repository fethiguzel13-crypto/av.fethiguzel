/**
 * CSP ve güvenlik başlıkları canlı doğrulaması (Aylık plan G03).
 * Derlenmiş siteyi (next start) gerçek Chromium ile gezer; CSP ihlali, sayfa hatası,
 * eksik başlık ve 4xx/5xx yanıtları toplar.
 *
 *   npm run build && npx next start -p 3123   (ayrı terminalde)
 *   node scripts/csp-dogrula.mjs [--taban=http://localhost:3123]
 *
 * Çıkış kodu: ihlal ya da hata varsa 1.
 */
import { chromium } from "playwright";

const arg = (n, d) => (process.argv.find((a) => a.startsWith(`--${n}=`)) || "").split("=").slice(1).join("=") || d;
const TABAN = arg("taban", "http://localhost:3123");

export const SAYFALAR = [
  "/",
  "/mevzuat",
  "/mevzuat/tbk",
  "/hesaplama",
  "/bilgi",
  "/ders-notlari",
  "/icthat",
  "/yargi-kararlari",
  "/makaleler",
  "/eserlerim",
  "/akademik-profil",
  "/avukat-fethi-guzel",
  "/ercis-avukat",
  "/uyelik",
  "/ara?q=kira",
];

async function main() {
  const browser = await chromium.launch();
  const sonuc = [];
  for (const yol of SAYFALAR) {
    const page = await browser.newPage();
    const ihlaller = [];
    const hatalar = [];
    page.on("console", (m) => {
      const t = m.text();
      if (/Content Security Policy|Refused to (load|execute|apply|connect|frame)/i.test(t)) ihlaller.push(t.slice(0, 300));
    });
    page.on("pageerror", (e) => hatalar.push(String(e.message || e).slice(0, 300)));
    let durum = 0;
    let csp = null;
    try {
      const r = await page.goto(TABAN + yol, { waitUntil: "networkidle", timeout: 60_000 });
      durum = r?.status() ?? 0;
      csp = r?.headers()["content-security-policy"] || null;
      await page.mouse.wheel(0, 2500); // tembel yüklenen bölümler de çalışsın
      await page.waitForTimeout(1500);
    } catch (e) {
      hatalar.push(`gezinme: ${e.message}`);
    }
    sonuc.push({ yol, durum, csp: !!csp, ihlaller, hatalar });
    const isaret = durum >= 400 || !csp || ihlaller.length || hatalar.length ? "✖" : "✔";
    console.log(`${isaret} ${String(durum).padEnd(3)} ${yol}${ihlaller.length ? ` | CSP ihlali ${ihlaller.length}` : ""}${hatalar.length ? ` | hata ${hatalar.length}` : ""}${csp ? "" : " | CSP başlığı yok"}`);
    for (const x of [...ihlaller, ...hatalar].slice(0, 3)) console.log(`     ${x}`);
    await page.close();
  }
  await browser.close();
  const kotu = sonuc.filter((s) => s.durum >= 400 || !s.csp || s.ihlaller.length || s.hatalar.length);
  console.log(`\n${sonuc.length - kotu.length}/${sonuc.length} sayfa temiz`);
  process.exit(kotu.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
