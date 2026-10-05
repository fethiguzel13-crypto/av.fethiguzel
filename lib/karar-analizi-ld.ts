/**
 * Karar analizi sayfası (`/icthat/[id]`) başlığı ve JSON-LD'si (Aylık plan G10 adım 3). Veride olmayan alan
 * yazılmaz: tarih ISO değilse `datePublished`, künye yoksa `citation`, konu yoksa `about` çıkar.
 */
import type { AnalysisData } from './analysis';
import { SITE_URL } from './profile';
import { yazarRef } from './yazar';
import { kirintiLd } from './kirinti.mjs';

const ISO = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

export function kararAnaliziBasligi(data: AnalysisData): string {
  const { source, kunye } = data.highlight;
  return `${source || ''} ${kunye || data.id} Analizi`.trim();
}

export function kararAnaliziJsonLd(data: AnalysisData) {
  const url = `${SITE_URL}/icthat/${data.id}`;
  const baslik = kararAnaliziBasligi(data);
  const { kunye, konu, url: kaynak } = data.highlight;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: baslik,
        author: yazarRef(),
        inLanguage: 'tr-TR',
        url,
        mainEntityOfPage: url,
        ...(ISO.test(data.generatedAt || '') ? { datePublished: data.generatedAt } : {}),
        ...(konu ? { about: konu } : {}),
        ...(kunye ? { citation: { '@type': 'CreativeWork', name: kunye, ...(kaynak ? { url: kaynak } : {}) } } : {}),
      },
      kirintiLd([
        { ad: 'Güncel İçtihat', yol: '/icthat' },
        { ad: baslik, yol: `/icthat/${data.id}` },
      ]),
    ],
  };
}
