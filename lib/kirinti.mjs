/**
 * Kırıntı yolu — görünür kırıntı (`components/Kirinti.tsx`) ve BreadcrumbList şeması için tek öğe listesi
 * (Aylık plan G12). Öğeler ana sayfadan sonrasını, sayfanın kendisiyle biten sırayla verir; ana sayfa başa eklenir.
 */

export const SITE = 'https://www.avfethiguzel.com';
export const ANA_SAYFA = 'Ana sayfa';

/**
 * @param {{ ad: string, yol: string }[]} ogeler  site içi yollar ("/" ile başlar)
 * @param {string} [anaSayfa]  ilk basamağın adı; yabancı dildeki sayfa kendi dilinde verir
 * @returns {{ ad: string, yol: string }[]} ana sayfa eklenmiş, denetlenmiş liste
 */
export function kirintiOgeleri(ogeler, anaSayfa = ANA_SAYFA) {
  if (typeof anaSayfa !== 'string' || !anaSayfa.trim()) throw new Error('kırıntının ana sayfa adı boş');
  for (const o of ogeler) {
    if (typeof o?.ad !== 'string' || !o.ad.trim()) throw new Error(`kırıntı öğesinin adı boş: ${JSON.stringify(o)}`);
    if (typeof o.yol !== 'string' || !o.yol.startsWith('/') || o.yol.startsWith('//')) {
      throw new Error(`kırıntı yolu site içi olmalı: ${JSON.stringify(o)}`);
    }
  }
  return [{ ad: anaSayfa, yol: '/' }, ...ogeler];
}

/**
 * BreadcrumbList düğümü (`@context`'siz; sayfanın grafiğine ya da tek başına bir bloğa konur).
 * @param {{ ad: string, yol: string }[]} ogeler
 * @param {string} [anaSayfa]
 */
export function kirintiLd(ogeler, anaSayfa = ANA_SAYFA) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: kirintiOgeleri(ogeler, anaSayfa).map((o, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: o.ad,
      item: new URL(o.yol, SITE).href,
    })),
  };
}
