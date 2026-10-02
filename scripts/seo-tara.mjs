/**
 * SEO taraması — derlenmiş site üzerinde (Aylık plan G06; G25 karşılaştırması aynı betikle).
 *
 * robots.txt → site haritaları (dizinler dahil) → içerik grubu başına deterministik örnek → her sayfa:
 * durum kodu, yönlendirme, HTML boyutu, süre, başlık/açıklama/canonical/noindex/JSON-LD/h1. Örnek
 * sayfaların iç bağlantılarından üst sınırlı kırık bağlantı taraması. Siteyi değiştirmez.
 *
 *   npx next start -p 3123   (ayrı terminalde, derlemeden sonra)
 *   node scripts/seo-tara.mjs [--taban=http://localhost:3123] [--ornek=25] [--baglanti=600]
 *                             [--cikti=docs/aylik-plan/raporlar/seo-baslangic.json]
 */
import { mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";
import { sitemapAyristir, sayfaOzeti, grupAdi, ornekle, tekrarlar } from "./lib/seo-analiz.mjs";

const arg = (n, d) => (process.argv.find((a) => a.startsWith(`--${n}=`)) || "").split("=").slice(1).join("=") || d;
const TABAN = arg("taban", "http://localhost:3123");
const ORNEK = Number(arg("ornek", "25"));
const BAG_SINIR = Number(arg("baglanti", "600"));
const CIKTI = arg("cikti", "docs/aylik-plan/raporlar/seo-baslangic.json");
const SITE = "https://www.avfethiguzel.com";

/** Canlı alan adındaki adresi yerel tabana çevirir; başka alan adı null. */
function yerel(adres) {
  const u = new URL(adres, SITE);
  if (u.hostname.replace(/^www\./, "") !== "avfethiguzel.com" && u.origin !== TABAN) return null;
  return `${TABAN}${u.pathname}${u.search}`;
}

async function getir(adres, govdeOku = true) {
  const t0 = Date.now();
  try {
    const r = await fetch(adres, { redirect: "manual", signal: AbortSignal.timeout(60_000) });
    const metin = govdeOku ? await r.text() : (await r.body?.cancel(), "");
    return { durum: r.status, basliklar: r.headers, metin, ms: Date.now() - t0 };
  } catch (e) {
    return { durum: 0, basliklar: new Headers(), metin: "", ms: Date.now() - t0, hata: String(e.message || e) };
  }
}

async function havuz(dizi, n, fn) {
  const sonuc = new Array(dizi.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, dizi.length) }, async () => {
      while (i < dizi.length) {
        const k = i++;
        sonuc[k] = await fn(dizi[k], k);
      }
    })
  );
  return sonuc;
}

const yuzdelik = (d, p) => {
  if (!d.length) return 0;
  const s = [...d].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
};

async function main() {
  // 1. robots.txt
  const robots = await getir(`${TABAN}/robots.txt`);
  const haritaAdresleri = [...robots.metin.matchAll(/^sitemap:\s*(\S+)/gim)].map((m) => m[1]);
  console.log(`robots.txt ${robots.durum} · ${haritaAdresleri.length} site haritası`);

  // 2. Site haritaları (dizin dosyaları dahil)
  const haritalar = [];
  const sayfaAdresleri = new Set();
  const kuyruk = [...haritaAdresleri, `${SITE}/sitemap-index.xml`];
  const gorulen = new Set();
  while (kuyruk.length) {
    const adres = kuyruk.shift();
    if (gorulen.has(adres)) continue;
    gorulen.add(adres);
    const y = yerel(adres);
    if (!y) continue;
    const r = await getir(y);
    const a = r.durum === 200 ? sitemapAyristir(r.metin) : { tur: "?", adresler: [] };
    haritalar.push({ adres: new URL(adres).pathname, durum: r.durum, tur: a.tur, sayi: a.adresler.length, robotsta: haritaAdresleri.includes(adres) });
    if (a.tur === "index") kuyruk.push(...a.adresler);
    else for (const s of a.adresler) sayfaAdresleri.add(new URL(s).pathname + new URL(s).search);
  }
  for (const h of haritalar) console.log(`  ${String(h.durum).padEnd(3)} ${h.adres} (${h.tur}, ${h.sayi})${h.robotsta ? "" : " · robots.txt'de yok"}`);

  // 3. Grup başına örnek
  const gruplar = new Map();
  for (const yol of sayfaAdresleri) {
    const g = grupAdi(yol);
    if (!gruplar.has(g)) gruplar.set(g, []);
    gruplar.get(g).push(yol);
  }
  const grupSayilari = Object.fromEntries([...gruplar].map(([g, d]) => [g, d.length]).sort((a, b) => b[1] - a[1]));
  const ornekYollar = [...gruplar.values()].flatMap((d) => ornekle([...d].sort(), ORNEK));
  console.log(`\n${sayfaAdresleri.size} tekil adres, ${gruplar.size} grup → ${ornekYollar.length} örnek sayfa taranıyor…`);

  // 4. Sayfalar
  const sayfalar = await havuz(ornekYollar, 6, async (yol) => {
    const r = await getir(`${TABAN}${yol}`);
    const kayit = {
      yol,
      grup: grupAdi(yol),
      durum: r.durum,
      konum: r.basliklar.get("location"),
      bayt: Buffer.byteLength(r.metin),
      ms: r.ms,
      xRobots: r.basliklar.get("x-robots-tag"),
      hata: r.hata,
    };
    if (r.durum === 200 && /html/.test(r.basliklar.get("content-type") || "")) {
      const o = sayfaOzeti(r.metin, SITE);
      const kendisi = `${SITE}${new URL(yol, SITE).pathname}`.replace(/\/$/, "");
      Object.assign(kayit, o, {
        canonicalUyumsuz: !!o.canonical && o.canonical.split("?")[0].replace(/\/$/, "") !== kendisi,
        noindex: o.noindex || /noindex/i.test(kayit.xRobots || ""),
      });
    }
    return kayit;
  });

  // 5. Kırık iç bağlantılar (örnek sayfalardan, üst sınırlı)
  const taranan = new Set(sayfalar.map((s) => s.yol));
  const kaynak = new Map();
  for (const s of sayfalar) for (const b of s.icBaglantilar || []) if (!taranan.has(b) && !kaynak.has(b)) kaynak.set(b, s.yol);
  const denenecek = ornekle([...kaynak.keys()].sort(), BAG_SINIR);
  console.log(`${kaynak.size} tekil iç bağlantı; ${denenecek.length} tanesi denetleniyor…`);
  const bag = await havuz(denenecek, 8, async (yol) => ({ yol, ...(await getir(`${TABAN}${yol}`, false)) }));
  const kirik = bag
    .filter((b) => b.durum === 0 || b.durum >= 400)
    .map((b) => ({ yol: b.yol, durum: b.durum, kaynak: kaynak.get(b.yol) }));
  const bagYonlendirme = bag.filter((b) => b.durum >= 300 && b.durum < 400).length;

  // 6. Özet
  const html = sayfalar.filter((s) => s.baslik !== undefined);
  const durumlar = {};
  for (const s of sayfalar) durumlar[s.durum] = (durumlar[s.durum] || 0) + 1;
  const grupAgirlik = {};
  for (const [g] of gruplar) {
    const d = html.filter((s) => s.grup === g);
    if (d.length) {
      grupAgirlik[g] = {
        ornek: d.length,
        htmlKbMedyan: Math.round(yuzdelik(d.map((s) => s.bayt), 50) / 1024),
        htmlKbMaks: Math.round(Math.max(...d.map((s) => s.bayt)) / 1024),
        msMedyan: yuzdelik(d.map((s) => s.ms), 50),
      };
    }
  }
  const ozet = {
    tarih: new Date().toISOString(),
    taban: TABAN,
    ornekGrupBasina: ORNEK,
    robots: { durum: robots.durum, haritalar: haritaAdresleri.map((a) => new URL(a).pathname) },
    haritalar,
    tekilAdres: sayfaAdresleri.size,
    grupSayilari,
    taranan: sayfalar.length,
    durumlar,
    haritadaYonlendirmeVeHata: sayfalar.filter((s) => s.durum !== 200).map(({ yol, durum, konum }) => ({ yol, durum, konum })),
    haritadaNoindex: html.filter((s) => s.noindex).map((s) => s.yol),
    eksikBaslik: html.filter((s) => !s.baslik).map((s) => s.yol),
    eksikAciklama: html.filter((s) => !s.aciklama).map((s) => s.yol),
    uzunBaslik: html.filter((s) => (s.baslik || "").length > 65).length,
    uzunAciklama: html.filter((s) => (s.aciklama || "").length > 165).length,
    kisaAciklama: html.filter((s) => s.aciklama && s.aciklama.length < 70).length,
    tekrarBaslik: tekrarlar(html, "baslik").slice(0, 15),
    tekrarAciklama: tekrarlar(html, "aciklama").slice(0, 15),
    canonicalEksik: html.filter((s) => !s.canonical).map((s) => s.yol),
    canonicalUyumsuz: html.filter((s) => s.canonicalUyumsuz).map((s) => ({ yol: s.yol, canonical: s.canonical })),
    jsonLd: {
      yok: html.filter((s) => !s.jsonLd?.toplam).map((s) => s.yol),
      gecersizBlok: html.reduce((t, s) => t + (s.jsonLd?.gecersiz || 0), 0),
      turler: Object.fromEntries(
        Object.entries(
          html.flatMap((s) => s.jsonLd?.turler || []).reduce((m, t) => ((m[t] = (m[t] || 0) + 1), m), {})
        ).sort((a, b) => b[1] - a[1])
      ),
    },
    h1Yok: html.filter((s) => s.h1 === 0).map((s) => s.yol),
    h1Coklu: html.filter((s) => s.h1 > 1).map((s) => s.yol),
    agirlik: {
      htmlKbMedyan: Math.round(yuzdelik(html.map((s) => s.bayt), 50) / 1024),
      htmlKbP90: Math.round(yuzdelik(html.map((s) => s.bayt), 90) / 1024),
      msMedyan: yuzdelik(html.map((s) => s.ms), 50),
      msP90: yuzdelik(html.map((s) => s.ms), 90),
      gruplar: grupAgirlik,
    },
    baglanti: { tekil: kaynak.size, denetlenen: denenecek.length, yonlendirme: bagYonlendirme, kirik },
    sayfalar: sayfalar.map(({ icBaglantilar, ...s }) => ({ ...s, icBaglantiSayisi: icBaglantilar?.length })),
  };

  mkdirSync(dirname(CIKTI), { recursive: true });
  writeFileSync(CIKTI, JSON.stringify(ozet, null, 2) + "\n", "utf8");

  console.log(`\nDurum kodları: ${JSON.stringify(durumlar)}`);
  console.log(`Haritada 200 olmayan: ${ozet.haritadaYonlendirmeVeHata.length} · haritada noindex: ${ozet.haritadaNoindex.length}`);
  console.log(`Başlık eksik/uzun: ${ozet.eksikBaslik.length}/${ozet.uzunBaslik} · açıklama eksik/uzun/kısa: ${ozet.eksikAciklama.length}/${ozet.uzunAciklama}/${ozet.kisaAciklama}`);
  console.log(`Tekrar eden başlık kümesi: ${ozet.tekrarBaslik.length} · açıklama kümesi: ${ozet.tekrarAciklama.length}`);
  console.log(`Canonical eksik/uyumsuz: ${ozet.canonicalEksik.length}/${ozet.canonicalUyumsuz.length}`);
  console.log(`JSON-LD yok: ${ozet.jsonLd.yok.length} · geçersiz blok: ${ozet.jsonLd.gecersizBlok}`);
  console.log(`h1 yok/çoklu: ${ozet.h1Yok.length}/${ozet.h1Coklu.length}`);
  console.log(`HTML medyan ${ozet.agirlik.htmlKbMedyan} KB, p90 ${ozet.agirlik.htmlKbP90} KB · yanıt medyan ${ozet.agirlik.msMedyan} ms`);
  console.log(`Kırık iç bağlantı: ${kirik.length}/${denenecek.length} (yönlendirme ${bagYonlendirme})`);
  console.log(`→ ${CIKTI}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
