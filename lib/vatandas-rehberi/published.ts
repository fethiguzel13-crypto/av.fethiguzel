import { VATANDAS_ARTICLES } from './data';
import { AUTHORED_ARTICLES, AUTHORED_SLUGS } from './authored';
import type { VatandasArticle } from './types';
import { auditGuide } from '@/lib/content-quality.mjs';

/**
 * Yayınlanabilir rehberler.
 *
 * Üç kaynak, öncelik sırasıyla:
 *
 *   1. `rewritten/` — Gemini anlatı (kalıp iskelet yok).
 *   2. `authored/`  — elle yazılan, madde göndermesi doğrulanmış metinler.
 *   3. `data.ts`    — otomatik üretilen 554 rehber; yalnız denetimden geçenler.
 *
 * Aynı slug birden fazla yerde varsa üstteki kazanır.
 *
 * Tek tek sayfalar hâlâ erişilebilir kalır (dışarıdan verilmiş bağlantılar
 * kırılmasın diye) ama denetimden geçmeyen sayfa noindex'tir.
 */
function loadRewritten(): VatandasArticle[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs') as typeof import('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path') as typeof import('path');
    const dir = path.join(process.cwd(), 'lib', 'vatandas-rehberi', 'rewritten');
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f: string) => f.endsWith('.json') && !f.startsWith('_'))
      .map((f: string) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as VatandasArticle)
      .filter((a: VatandasArticle) => a?.slug && a.voice === 'narrative');
  } catch {
    return [];
  }
}

const REWRITTEN_ARTICLES = loadRewritten();
const REWRITTEN_SLUGS = new Set(REWRITTEN_ARTICLES.map((a) => a.slug));

const authoredLive = AUTHORED_ARTICLES.filter((a) => !REWRITTEN_SLUGS.has(a.slug));
const taken = new Set([...REWRITTEN_SLUGS, ...authoredLive.map((a) => a.slug)]);

const generated = VATANDAS_ARTICLES.filter((a) => !taken.has(a.slug) && auditGuide(a).publishable);

export const PUBLISHED_ARTICLES: VatandasArticle[] = [
  ...REWRITTEN_ARTICLES,
  ...authoredLive,
  ...generated,
];

export const AUTHORED_COUNT = AUTHORED_ARTICLES.length;
export const REWRITTEN_COUNT = REWRITTEN_ARTICLES.length;

export const WITHDRAWN_COUNT = VATANDAS_ARTICLES.filter((a) => !taken.has(a.slug)).length - generated.length;

export function isPublished(slug: string): boolean {
  return PUBLISHED_ARTICLES.some((a) => a.slug === slug);
}

/** Elle yazılan sürüm varsa onu, yoksa üretilmiş sürümü döndürür. */
export function getPublishedBySlug(slug: string): VatandasArticle | undefined {
  return PUBLISHED_ARTICLES.find((a) => a.slug === slug);
}

export function getPublishedSlugs(): string[] {
  return PUBLISHED_ARTICLES.map((a) => a.slug);
}

export function getPublishedCategories(): string[] {
  return Array.from(new Set(PUBLISHED_ARTICLES.map((a) => a.category))).sort((a, b) =>
    a.localeCompare(b, 'tr')
  );
}
