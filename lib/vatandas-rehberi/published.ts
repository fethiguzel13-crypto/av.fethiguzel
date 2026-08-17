import { VATANDAS_ARTICLES } from './data';
import { AUTHORED_ARTICLES, AUTHORED_SLUGS } from './authored';
import type { VatandasArticle } from './types';
import { auditGuide } from '@/lib/content-quality.mjs';

/**
 * Yayınlanabilir rehberler.
 *
 * İki kaynak birleşir:
 *
 *   1. `authored/`  — elle yazılan metinler. Her madde göndermesi resmî
 *      metinden doğrulanmıştır; koşulsuz yayınlanır.
 *   2. `data.ts`    — otomatik üretilen 554 rehber. 14.08.2026 denetiminde
 *      487'sinin kalıptan üretildiği ve somut hukuki bilgi içermediği
 *      ölçüldü; yalnız denetimden geçenler alınır.
 *
 * Aynı slug her ikisinde de varsa elle yazılan kazanır — yeniden yazılan bir
 * konu, eski otomatik sürümünü kendiliğinden değiştirir.
 *
 * Tek tek sayfalar hâlâ erişilebilir kalır (dışarıdan verilmiş bağlantılar
 * kırılmasın diye) ama denetimden geçmeyen sayfa noindex'tir.
 */
const generated = VATANDAS_ARTICLES.filter(
  (a) => !AUTHORED_SLUGS.has(a.slug) && auditGuide(a).publishable
);

export const PUBLISHED_ARTICLES: VatandasArticle[] = [...AUTHORED_ARTICLES, ...generated];

export const AUTHORED_COUNT = AUTHORED_ARTICLES.length;

export const WITHDRAWN_COUNT =
  VATANDAS_ARTICLES.filter((a) => !AUTHORED_SLUGS.has(a.slug)).length - generated.length;

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
