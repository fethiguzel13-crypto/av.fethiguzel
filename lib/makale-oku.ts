/**
 * Makale okuma sayfası (`/makale-oku/*`): dosya yolu ve JSON-LD (Aylık plan G10 adım 3).
 *
 * Adres parçaları çözülmüş hâlde gelir; `..%2F` gibi kodlu ayraçlar tek parçada "../" olur. Yol yalnız
 * `public/makaleler` içindeki gerçek bir dosyaya çıkıyorsa döner. JSON-LD'de yayın tarihi yazılmaz: dosya
 * değişiklik zamanı yayın tarihi değildir ve makalelerin künyesi veride yok.
 */
import fs from 'fs';
import path from 'path';
import { SITE_URL } from './profile';
import { yazarRef } from './yazar';

const KOK = path.join(process.cwd(), 'public', 'makaleler');

const BICIM: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export function makaleBasligi(dosyaAdi: string): string {
  return dosyaAdi.replace(/\.(pdf|docx|udf)$/i, '');
}

export function makaleDosyaYolu(parcalar: string[]): string | null {
  if (!parcalar.length) return null;
  if (parcalar.some((p) => !p || p === '.' || p === '..' || /[\\/\0]/.test(p) || path.isAbsolute(p))) return null;
  const yol = path.join(KOK, ...parcalar);
  const goreli = path.relative(KOK, yol);
  if (!goreli || goreli.startsWith('..') || path.isAbsolute(goreli)) return null;
  try {
    return fs.statSync(yol).isFile() ? yol : null;
  } catch {
    return null;
  }
}

export function makaleOkuJsonLd(parcalar: string[]) {
  const kodlu = parcalar.map(encodeURIComponent).join('/');
  const url = `${SITE_URL}/makale-oku/${kodlu}`;
  const baslik = makaleBasligi(parcalar[parcalar.length - 1]);
  const bicim = BICIM[path.extname(parcalar[parcalar.length - 1]).toLowerCase()];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ScholarlyArticle',
        headline: baslik,
        author: yazarRef(),
        inLanguage: 'tr-TR',
        url,
        mainEntityOfPage: url,
        encoding: {
          '@type': 'MediaObject',
          contentUrl: `${SITE_URL}/makaleler/${kodlu}`,
          ...(bicim ? { encodingFormat: bicim } : {}),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Makaleler', item: `${SITE_URL}/makaleler` },
          { '@type': 'ListItem', position: 3, name: baslik, item: url },
        ],
      },
    ],
  };
}
