import { inferGuide } from './infer';
import type { VatandasGuide } from './types';
import ALL_JSON from './all.json';

/**
 * Elle yazılmış rehber kartları.
 *
 * Daha önce `createRequire(import.meta.url)` ile yükleniyordu; bu Node'a özgü
 * bir yol ve tarayıcı paketinde `"createRequire" is not exported by
 * "__vite-browser-external"` hatası veriyor. Mobil uygulama aynı modülü
 * kullandığı için düz ESM içe aktarımına çevrildi — Next.js tarafında da
 * `resolveJsonModule` açık olduğundan davranış değişmiyor.
 */
const ALL = ALL_JSON as unknown as Record<string, VatandasGuide>;

export function getGuide(article: { slug: string; h1: string; category: string }): VatandasGuide {
  return ALL[article.slug] || inferGuide(article);
}

export function handGuideCount() {
  return Object.keys(ALL).length;
}
