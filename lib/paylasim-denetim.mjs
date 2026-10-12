/**
 * Paylaşım (Open Graph / Twitter) etiketlerinin denetimi — Aylık plan G20.
 * Derlenmiş bir HTML sayfasından paylaşım alanlarını okur ve eksikleri listeler. Saf işlevdir; dosya okumaz.
 * `scripts/derleme-og-tara.mjs` bütün derlenmiş sayfalara uygular, `lib/__tests__/paylasim-denetim.test.mjs` sınar.
 */

const ZORUNLU_OG = ['og:title', 'og:description', 'og:url', 'og:type', 'og:site_name', 'og:locale', 'og:image'];

function metaDegerleri(html) {
  const sonuc = new Map();
  for (const m of html.matchAll(/<meta\s+([^>]*?)\/?>/g)) {
    const nitelik = m[1];
    const ad = /(?:property|name)="([^"]+)"/.exec(nitelik)?.[1];
    const icerik = /content="([^"]*)"/.exec(nitelik)?.[1];
    if (!ad || icerik === undefined) continue;
    if (!sonuc.has(ad)) sonuc.set(ad, []);
    sonuc.get(ad).push(icerik.replace(/&amp;/g, '&'));
  }
  return sonuc;
}

/** Sayfa `noindex` taşıyorsa false. */
export function dizinde(html) {
  const robots = metaDegerleri(html).get('robots') || [];
  return !robots.some((r) => /noindex/i.test(r));
}

/**
 * Sayfanın paylaşım alanlarını denetler.
 * @returns {{ eksik: string[], gorseller: string[], twitterKart: string | null }}
 */
export function paylasimDenetle(html) {
  const m = metaDegerleri(html);
  const eksik = ZORUNLU_OG.filter((ad) => !(m.get(ad) || []).some((d) => d.trim()));
  const gorseller = m.get('og:image') || [];
  if (gorseller.length) {
    if (!(m.get('og:image:width') || []).length) eksik.push('og:image:width');
    if (!(m.get('og:image:height') || []).length) eksik.push('og:image:height');
    if (!(m.get('og:image:alt') || []).length) eksik.push('og:image:alt');
  }
  // Kendi openGraph'ını vermeyen sayfa kökün ana sayfa adresini miras alır; paylaşım ana sayfaya düşer.
  const kanonik = /<link\s+rel="canonical"\s+href="([^"]+)"/.exec(html)?.[1];
  const ogUrl = m.get('og:url')?.[0];
  const sade = (u) => u.replace(/&amp;/g, '&').replace(/\/+$/, '');
  if (kanonik && ogUrl && sade(kanonik) !== sade(ogUrl)) eksik.push('og:url=canonical');
  if (!(m.get('twitter:image') || []).length) eksik.push('twitter:image');
  const twitterKart = m.get('twitter:card')?.[0] ?? null;
  if (twitterKart !== 'summary_large_image') eksik.push('twitter:card=summary_large_image');
  return { eksik, gorseller, twitterKart };
}

/** Görsel adresinin site içindeki yolunu verir (`/og/...`); başka alan adındaysa null. */
export function siteIciYol(adres, site = 'https://www.avfethiguzel.com') {
  if (adres.startsWith('/')) return adres.split('?')[0];
  if (adres.startsWith(site + '/')) return adres.slice(site.length).split('?')[0];
  return null;
}
