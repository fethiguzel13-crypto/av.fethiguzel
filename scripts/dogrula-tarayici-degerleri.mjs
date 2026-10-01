#!/usr/bin/env node
/**
 * Yalnız tarayıcıda okunan değerlerin (useTarayiciDegeri) derlenmiş sitede doğru çalıştığını denetler
 * (Aylık plan G01b): Navbar üyelik çerezi → bağlantı metni/hedefi; hydration hatası yok.
 *
 *   npx next start -p 3123   # ayrı uçbirimde
 *   node scripts/dogrula-tarayici-degerleri.mjs [http://localhost:3123]
 *
 * Yalnız okur; dosya yazmaz.
 */
import { chromium } from "playwright";

const KOK = process.argv[2] || "http://localhost:3123";
const DURUMLAR = [
  { cerez: null, metin: "Üye ol", hedef: "/uyelik" },
  { cerez: "0", metin: "Üyelik", hedef: "/uyelik/odeme" },
  { cerez: "1", metin: "Hesabım", hedef: "/yargi-kararlari" },
];

const tarayici = await chromium.launch();
let basarisiz = 0;
try {
  for (const d of DURUMLAR) {
    const baglam = await tarayici.newContext({ viewport: { width: 1366, height: 900 } });
    if (d.cerez !== null) {
      await baglam.addCookies([{ name: "fg_arsiv_ui", value: d.cerez, url: KOK }]);
    }
    const sayfa = await baglam.newPage();
    const hatalar = [];
    sayfa.on("pageerror", (e) => hatalar.push(String(e.message || e).slice(0, 200)));
    await sayfa.goto(`${KOK}/avukat-fethi-guzel`, { waitUntil: "networkidle" });
    const baglanti = sayfa.locator(`nav a[href="${d.hedef}"]`, { hasText: d.metin }).first();
    const gorunur = (await baglanti.count()) > 0;
    const tamam = gorunur && hatalar.length === 0;
    if (!tamam) basarisiz++;
    console.log(
      `${tamam ? "✔" : "✘"} çerez=${d.cerez ?? "yok"} → «${d.metin}» ${d.hedef}` +
        `${gorunur ? "" : " | bağlantı bulunamadı"}${hatalar.length ? ` | hata: ${hatalar.join(" ; ")}` : ""}`,
    );
    await baglam.close();
  }
} finally {
  await tarayici.close();
}
console.log(basarisiz ? `\n${basarisiz} durum başarısız` : "\nTüm durumlar geçti");
process.exit(basarisiz ? 1 : 0);
