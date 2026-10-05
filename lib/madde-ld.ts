/**
 * Mevzuat madde sayfası JSON-LD'si (Aylık plan G10 adım 4). Rota işleyicisi (`app/mevzuat/[kanunId]/[id]/route.ts`)
 * HTML'i elle kurar; blok `jsonLdHtml()` ile basılır.
 *
 * Şerh yokken sayfa bir makale değil, kanun metni alıntısıdır: tür WebPage olur ve yazar yazılmaz (olmayan
 * yazarlık iddiası). Legislation düğümüne kanun numarası, Resmî Gazete künyesi ya da resmî tanımlayıcı
 * yazılmaz; içerik paketinde bu alanlar yok.
 */
import { SITE_URL } from './profile';
import { yazarRef } from './yazar';
import { kirintiLd } from './kirinti.mjs';

export type MaddeLdGirdi = {
  kanunId: string;
  id: string;
  kanun: string;
  maddeNo: number;
  aciklama: string;
  serhVar: boolean;
};

export function maddeJsonLd({ kanunId, id, kanun, maddeNo: n, aciklama, serhVar }: MaddeLdGirdi) {
  const code = kanunId.toUpperCase();
  const canonical = `${SITE_URL}/mevzuat/${kanunId}/${id}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': serhVar ? 'Article' : 'WebPage',
        headline: `${code} ${n} | ${code} Madde ${n}`,
        name: `${code} Madde ${n}`,
        alternateName: [`${code} ${n}`, `${code} m. ${n}`, `${code} m ${n}`, `${code} madde ${n}`, `${code} Madde ${n}`],
        description: aciklama,
        inLanguage: 'tr-TR',
        isAccessibleForFree: true,
        ...(serhVar ? { author: yazarRef() } : {}),
        publisher: { '@type': 'Organization', name: 'Av. Fethi Güzel Hukuk Portalı', url: SITE_URL },
        mainEntityOfPage: canonical,
        about: { '@type': 'Legislation', name: `${kanun} Madde ${n}`, legislationJurisdiction: 'TR' },
        keywords: `${code} madde ${n}, ${code} m. ${n}, Av. Fethi Güzel, Fethi Güzel, kanun maddesi`,
      },
      kirintiLd([
        { ad: 'Mevzuat', yol: '/mevzuat' },
        { ad: code, yol: `/mevzuat/${kanunId}` },
        { ad: `${code} Madde ${n}`, yol: `/mevzuat/${kanunId}/${id}` },
      ]),
    ],
  };
}
