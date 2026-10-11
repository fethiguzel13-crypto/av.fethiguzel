/**
 * Paylaşım meta verisi tek kaynak — Aylık plan G20.
 *
 * Next sayfanın `openGraph` nesnesini kök yerleşiminkiyle birleştirmez, bütünüyle değiştirir
 * (`next/dist/lib/metadata/resolve-metadata.js` `mergeMetadata`). 2026-10-09 derlemesinde dizine açık 827 sayfanın 745'inde
 * bu yüzden `og:image` yoktu; site adı ve dil de düşüyordu. Sayfalar `openGraph` ve `twitter` alanlarını buradan alır.
 *
 * Görseller `app/og/[tur]/[anahtar]/route.tsx` tarafından derlemede üretilen kapalı bir kümedir (`lib/paylasim-kayit.ts`).
 */
import type { Metadata } from 'next';

export const SITE = 'https://www.avfethiguzel.com';
export const SITE_ADI = 'Av. Fethi Güzel Hukuk Portalı';

/** Kartın üstündeki tür etiketi. */
export const PAYLASIM_TURLERI = {
  site: 'Hukuk portalı',
  bolum: 'Hukuk portalı',
  rehber: 'Vatandaş rehberi',
  kavram: 'Hukuk kavramı',
  hesaplama: 'Hesaplama aracı',
  kanun: 'Mevzuat ve şerh',
  alan: 'Hukuk alanı',
  'ders-notu': 'Ders notu',
  karar: 'Yargı kararları',
  yazi: 'Bölge yazısı',
  yazar: 'Yazar',
} as const;

export type PaylasimTuru = keyof typeof PAYLASIM_TURLERI;

const HARF: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' };

/** Görsel adresindeki anahtar: küçük harf, Türkçe harfler katlanmış, yalnız `a-z0-9-`. */
export function paylasimAnahtari(deger: string): string {
  return deger
    .toLocaleLowerCase('tr')
    .replace(/[çğıöşü]/g, (h) => HARF[h])
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function paylasimGorselYolu(tur: PaylasimTuru, anahtar: string): string {
  return `/og/${tur}/${paylasimAnahtari(anahtar)}`;
}

type Girdi = {
  baslik: string;
  aciklama?: string;
  /** Sayfanın mutlak ya da kökten göreli adresi. */
  adres: string;
  tur: PaylasimTuru;
  /** Görsel anahtarı; verilmezse türün genel kartı (`genel`). */
  anahtar?: string;
  ogTuru?: 'website' | 'article' | 'profile';
  dil?: string;
};

/** Sayfanın `openGraph` ve `twitter` alanları; görsel, site adı, dil ve tür her zaman doludur. */
export function paylasimMeta({ baslik, aciklama, adres, tur, anahtar = 'genel', ogTuru = 'website', dil = 'tr_TR' }: Girdi) {
  const url = adres.startsWith('http') ? adres : `${SITE}${adres.startsWith('/') ? '' : '/'}${adres}`;
  const gorsel = `${SITE}${paylasimGorselYolu(tur, anahtar)}`;
  const openGraph = {
    type: ogTuru,
    locale: dil,
    siteName: SITE_ADI,
    url,
    title: baslik,
    ...(aciklama ? { description: aciklama } : {}),
    images: [{ url: gorsel, width: 1200, height: 630, alt: baslik, type: 'image/png' }],
  } satisfies Metadata['openGraph'];
  const twitter = {
    card: 'summary_large_image',
    site: '@avfethiguzel',
    creator: '@avfethiguzel',
    title: baslik,
    ...(aciklama ? { description: aciklama } : {}),
    images: [{ url: gorsel, alt: baslik }],
  } satisfies Metadata['twitter'];
  return { openGraph, twitter };
}
