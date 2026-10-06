/**
 * Lighthouse (mobil) — anahtar sayfalar (Aylık plan G06 başlangıç; G13 ve G25 aynı listeyle karşılaştırır).
 *
 * Derlenmiş siteye karşı çalışır; Lighthouse'un varsayılan mobil öykünmesi ve benzetimli kısıtlaması.
 * Chromium olarak Playwright'ınki kullanılır. Sayfalar sırayla ölçülür (paralel ölçüm puanları bozar).
 *
 *   npx next start -p 3123   (ayrı terminalde)
 *   node scripts/lighthouse-olc.mjs [--taban=http://localhost:3123]
 *                                   [--cikti=docs/aylik-plan/raporlar/lighthouse-baslangic.json]
 *                                   [--sadece=tür1,tür2]  (yalnız bu türleri ölçer, çıktıdaki kaydı günceller)
 *                                   [--tekrar=3]  (sayfa başına başarılı koşu; her ölçü ortancayla özetlenir, G13)
 *                                   [--karsi=http://localhost:3124]  (önce derlemesini sunan ikinci sunucu; her sayfada
 *                                    önce ve taban dönüşümlü ölçülür, kayıtta `karsi` ve `gerileme` alanları; G13)
 */
import { spawnSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { tmpdir } from "os";
import { chromium } from "playwright";
import { donusumluTopla, gerilemeVar, kosulariOzetle, kosulariTopla } from "./lib/lighthouse-ortanca.mjs";

const arg = (n, d) => (process.argv.find((a) => a.startsWith(`--${n}=`)) || "").split("=").slice(1).join("=") || d;
const TABAN = arg("taban", "http://localhost:3123");
const CIKTI = arg("cikti", "docs/aylik-plan/raporlar/lighthouse-baslangic.json");
const SADECE = arg("sadece", "").split(",").filter(Boolean);
const TEKRAR = Math.max(1, Number(arg("tekrar", "1")) || 1);
const KARSI = arg("karsi", "");

export const ANAHTAR_SAYFALAR = [
  { tur: "ana sayfa", yol: "/" },
  { tur: "makale", yol: "/makale-oku/ARABULUCULUK/arabuluculuk%20anla%C5%9Fma%20belgesi.docx" },
  { tur: "mevzuat madde", yol: "/mevzuat/tck/madde-81" },
  { tur: "şerhli madde", yol: "/mevzuat/tbk/madde-49" },
  { tur: "rehber", yol: "/rehber/kidem-tazminati" },
  { tur: "ders notu hub", yol: "/ders-notlari" },
  { tur: "ders notu", yol: "/ders-notlari/afyon/borclar-genel-donem-1" },
  { tur: "hesaplama", yol: "/hesaplama/kidem" },
  { tur: "yargı arşivi", yol: "/yargi-kararlari" },
  { tur: "kavram", yol: "/kavram/kidem-tazminati" },
  { tur: "bölge", yol: "/ercis-avukat" },
  { tur: "yazar", yol: "/avukat-fethi-guzel" },
];

const KATEGORILER = ["performance", "accessibility", "best-practices", "seo"];

function olc(sayfa, taban = TABAN) {
  const gecici = join(tmpdir(), `lh-${Date.now()}.json`);
  const r = spawnSync(
    "npx",
    [
      "-y", "lighthouse@12", `${taban}${sayfa.yol}`,
      "--output=json", `--output-path=${gecici}`, "--quiet",
      `--only-categories=${KATEGORILER.join(",")}`,
      `--chrome-path=${chromium.executablePath()}`,
      '--chrome-flags="--headless=new --no-sandbox"',
    ],
    { shell: true, encoding: "utf8", timeout: 240_000 }
  );
  try {
    const lh = JSON.parse(readFileSync(gecici, "utf8"));
    // Çalışma hatasında (yönlendirme, boş sayfa) puanlar 0 gelir; ortalamaya girmesin.
    if (lh.runtimeError) return { ...sayfa, hata: `${lh.runtimeError.code}: ${lh.runtimeError.message}`.slice(0, 300) };
    const a = lh.audits;
    return {
      ...sayfa,
      puan: Object.fromEntries(KATEGORILER.map((k) => [k, Math.round((lh.categories[k]?.score ?? 0) * 100)])),
      lcpMs: Math.round(a["largest-contentful-paint"]?.numericValue ?? 0),
      fcpMs: Math.round(a["first-contentful-paint"]?.numericValue ?? 0),
      tbtMs: Math.round(a["total-blocking-time"]?.numericValue ?? 0),
      cls: Number((a["cumulative-layout-shift"]?.numericValue ?? 0).toFixed(3)),
      siMs: Math.round(a["speed-index"]?.numericValue ?? 0),
      // TBT yalnız FCP'den sonraki görevleri sayar; FCP öne çekilince artabilir. Toplam ana iş parçacığı süresi bundan bağımsız.
      anaIsMs: Math.round(a["mainthread-work-breakdown"]?.numericValue ?? 0),
      aktarimKb: Math.round((a["total-byte-weight"]?.numericValue ?? 0) / 1024),
      seoBasarisiz: Object.values(lh.categories.seo?.auditRefs ?? [])
        .map((x) => a[x.id])
        .filter((x) => x && x.score === 0)
        .map((x) => x.id),
      erisilebilirlikBasarisiz: Object.values(lh.categories.accessibility?.auditRefs ?? [])
        .map((x) => a[x.id])
        .filter((x) => x && x.score === 0)
        .map((x) => x.id),
      hata: lh.runtimeError?.message,
    };
  } catch {
    return { ...sayfa, hata: (r.stderr || r.error?.message || "lighthouse çıktısı yok").slice(-400) };
  } finally {
    rmSync(gecici, { force: true });
  }
}

const onceki = SADECE.length && existsSync(CIKTI) ? JSON.parse(readFileSync(CIKTI, "utf8")).sayfalar : [];
const sonuc = [];
for (const s of ANAHTAR_SAYFALAR) {
  if (SADECE.length && !SADECE.includes(s.tur)) {
    const eski = onceki.find((x) => x.tur === s.tur);
    if (eski) sonuc.push(eski);
    continue;
  }
  // Koşu hatası (NO_NAVSTART) tekrar sayısının iki katına dek yeniden denenir.
  const ozetle = ({ basarili, hatalar }) =>
    basarili.length ? { ...kosulariOzetle(basarili), ...(hatalar.length && { kosuHatalari: hatalar }) } : { ...s, hata: hatalar.at(-1) };
  let r;
  if (KARSI) {
    const { a, b } = donusumluTopla(() => olc(s, KARSI), () => olc(s, TABAN), TEKRAR, TEKRAR * 2);
    r = { ...ozetle(b), karsi: ozetle(a) };
    if (a.basarili.length && b.basarili.length) {
      const dizi = (t, m) => t.basarili.map((k) => k[m]);
      r.gerileme = Object.fromEntries(["tbtMs", "lcpMs"].map((m) => [m, gerilemeVar(dizi(a, m), dizi(b, m))]));
    }
  } else r = ozetle(kosulariTopla(() => olc(s), TEKRAR, TEKRAR * 2));
  sonuc.push(r);
  const satir = (x) =>
    x.puan
      ? `P${String(x.puan.performance).padStart(3)} E${String(x.puan.accessibility).padStart(3)} İ${String(x.puan["best-practices"]).padStart(3)} S${String(x.puan.seo).padStart(3)}  LCP ${(x.lcpMs / 1000).toFixed(1)} sn  TBT ${x.tbtMs} ms${x.kosu > 1 ? ` (${x.tbtAralik.join('–')})` : ''}  CLS ${x.cls}  ${x.aktarimKb} KB`
      : `HATA ${x.hata}`;
  if (r.karsi) console.log(`${r.tur.padEnd(14)} önce  ${satir(r.karsi)}`);
  console.log(`${r.tur.padEnd(14)} ${r.karsi ? "sonra " : ""}${satir(r)}${r.gerileme ? `  gerileme ${JSON.stringify(r.gerileme)}` : ""}`);
}
const tamam = sonuc.filter((r) => r.puan);
const ort = (k) => Math.round(tamam.reduce((t, r) => t + r.puan[k], 0) / Math.max(1, tamam.length));
const ozet = { tarih: new Date().toISOString(), taban: TABAN, ...(KARSI && { karsi: KARSI }), tekrar: TEKRAR, ortalama: Object.fromEntries(KATEGORILER.map((k) => [k, ort(k)])), sayfalar: sonuc };
mkdirSync(dirname(CIKTI), { recursive: true });
writeFileSync(CIKTI, JSON.stringify(ozet, null, 2) + "\n", "utf8");
console.log(`\nOrtalama: ${JSON.stringify(ozet.ortalama)} → ${CIKTI}`);
