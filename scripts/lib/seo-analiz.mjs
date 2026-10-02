/**
 * SEO taraması saf işlevleri (Aylık plan G06; G25 aynı işlevlerle karşılaştırır).
 *
 * HTML düzenli ifadeyle okunur: taranan sayfalar sitenin kendi çıktısıdır ve
 * yalnız <head> etiketleri, JSON-LD ve bağlantılar gerekir. Tam ayrıştırıcı
 * bağımlılığı eklemeye değmez.
 */

const VARLIK = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", "#39": "'", nbsp: " " };

function varlikCoz(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z0-9#]+);/gi, (m, ad) => VARLIK[ad.toLowerCase()] ?? m);
}

/** Bir etiketin öznitelikleri → { ad: değer } (küçük harf adlar). */
function oznitelikler(etiket) {
  const o = {};
  for (const m of etiket.matchAll(/([a-zA-Z:-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    o[m[1].toLowerCase()] = varlikCoz(m[3] ?? m[4] ?? m[5] ?? "");
  }
  return o;
}

/** Site haritası XML → { tur: 'index' | 'urlset', adresler } */
export function sitemapAyristir(xml) {
  const tur = /<sitemapindex\b/i.test(xml) ? "index" : "urlset";
  const adresler = [...xml.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)].map((m) => varlikCoz(m[1].trim()));
  return { tur, adresler };
}

/**
 * Sayfa HTML'inden SEO özeti.
 * @param {string} html
 * @param {string} siteKoku iç bağlantı sayılacak köken (ör. https://www.avfethiguzel.com)
 */
export function sayfaOzeti(html, siteKoku) {
  const bas = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  const metalar = [...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => oznitelikler(m[0]));
  const linkler = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => oznitelikler(m[0]));

  const aciklama = metalar.find((m) => m.name?.toLowerCase() === "description")?.content ?? null;
  const robots = metalar
    .filter((m) => ["robots", "googlebot"].includes(m.name?.toLowerCase()))
    .map((m) => (m.content || "").toLowerCase())
    .join(",");
  const canonical = linkler.find((l) => (l.rel || "").toLowerCase().split(/\s+/).includes("canonical"))?.href ?? null;

  const jsonLd = { toplam: 0, gecersiz: 0, turler: [] };
  for (const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    jsonLd.toplam += 1;
    try {
      const veri = JSON.parse(m[1]);
      const ogeler = Array.isArray(veri) ? veri : veri["@graph"] ? veri["@graph"] : [veri];
      for (const o of ogeler) {
        const t = o?.["@type"];
        for (const x of Array.isArray(t) ? t : t ? [t] : []) if (!jsonLd.turler.includes(x)) jsonLd.turler.push(x);
      }
    } catch {
      jsonLd.gecersiz += 1;
    }
  }

  const kok = new URL(siteKoku);
  const ic = new Set();
  for (const m of html.matchAll(/<a\b[^>]*\shref=("([^"]*)"|'([^']*)')/gi)) {
    const href = varlikCoz(m[2] ?? m[3] ?? "").trim();
    if (!href || href.startsWith("#") || /^(mailto|tel|javascript|data):/i.test(href)) continue;
    let u;
    try {
      u = new URL(href, kok);
    } catch {
      continue;
    }
    if (u.hostname.replace(/^www\./, "") !== kok.hostname.replace(/^www\./, "")) continue;
    ic.add(u.pathname);
  }

  return {
    baslik: bas ? varlikCoz(bas[1].trim()) || null : null,
    aciklama: aciklama || null,
    canonical: canonical || null,
    noindex: /\bnoindex\b/.test(robots),
    jsonLd,
    h1: (html.match(/<h1\b/gi) || []).length,
    icBaglantilar: [...ic],
  };
}

/** URL ya da yol → içerik grubu: "<ilk bölüm>/<derinlik>"; *-avukat sayfaları "bolge". */
export function grupAdi(adres) {
  const yol = adres.startsWith("/") ? adres.split(/[?#]/)[0] : new URL(adres).pathname;
  const parcalar = yol.split("/").filter(Boolean);
  if (!parcalar.length) return "/";
  const ilk = /-avukat$/.test(parcalar[0]) ? "bolge" : parcalar[0];
  return `${ilk}/${parcalar.length}`;
}

/** Eşit aralıklı deterministik örnek (ilk ve son öğe dahil). */
export function ornekle(dizi, n) {
  if (dizi.length <= n) return [...dizi];
  if (n <= 1) return dizi.slice(0, n);
  const adim = (dizi.length - 1) / (n - 1);
  return Array.from({ length: n }, (_, i) => dizi[Math.round(i * adim)]);
}

/** Aynı alan değerini taşıyan sayfa kümeleri (boş değerler hariç), büyükten küçüğe. */
export function tekrarlar(sayfalar, alan) {
  const harita = new Map();
  for (const s of sayfalar) {
    const d = s[alan];
    if (!d) continue;
    if (!harita.has(d)) harita.set(d, []);
    harita.get(d).push(s.yol);
  }
  return [...harita]
    .filter(([, yollar]) => yollar.length > 1)
    .map(([deger, yollar]) => ({ deger, yollar }))
    .sort((a, b) => b.yollar.length - a.yollar.length);
}
