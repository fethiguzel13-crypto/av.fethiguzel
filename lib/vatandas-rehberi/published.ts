import { VATANDAS_ARTICLES } from './data';
import { AUTHORED_ARTICLES, AUTHORED_SLUGS } from './authored';
import type { VatandasArticle } from './types';
import { auditGuide } from '@/lib/content-quality.mjs';
import {
  rehberleriSec,
  rehberSayfaDurumu,
  rehberSayfaSluglari,
  ilgiliRehberler,
  rehberBaglantilariniSuz,
} from './sec.mjs';
import { categories } from '@/lib/categories';

/**
 * Yayınlanabilir rehberler.
 *
 * Üç kaynak, öncelik sırasıyla:
 *
 *   1. `authored/`  — elle yazılan, madde göndermesi doğrulanmış metinler.
 *   2. `rewritten/` — Gemini anlatı; yalnız denetimden geçenler.
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

// Seçim kuralı site haritası ve aramayla aynı işlevden (G11): burada sıra bir dönem tersti (makine çıktısı
// elle yazılan 33 rehberin 33'ünü eziyordu) ve yeniden yazımlar denetlenmiyordu (23 ince rehber dizine açıktı).
const KOVALAR = { authored: AUTHORED_ARTICLES, rewritten: loadRewritten(), generated: VATANDAS_ARTICLES };
const SECIM = rehberleriSec(KOVALAR, (a) => auditGuide(a).publishable);

export const PUBLISHED_ARTICLES: VatandasArticle[] = SECIM.published;

export const AUTHORED_COUNT = AUTHORED_ARTICLES.length;
export const REWRITTEN_COUNT = SECIM.rewritten.length;

export const WITHDRAWN_COUNT = SECIM.withdrawn;

export function isPublished(slug: string): boolean {
  return PUBLISHED_ARTICLES.some((a) => a.slug === slug);
}

/** Elle yazılan sürüm varsa onu, yoksa üretilmiş sürümü döndürür. */
export function getPublishedBySlug(slug: string): VatandasArticle | undefined {
  return PUBLISHED_ARTICLES.find((a) => a.slug === slug);
}

/**
 * Rehber sayfasının tek kararı: yayındaysa dizine açık sürüm, değilse gösterilmeyen sürüm ve yayından düşme
 * gerekçesi (noindex). Harita aynı seçimi kullanır; sayfa ayrıca denetim yapmaz. Slug yoksa `null`.
 */
export function getGuidePageState(slug: string) {
  return rehberSayfaDurumu(slug, PUBLISHED_ARTICLES, KOVALAR, (a) => auditGuide(a).reason);
}

/** Rehber sayfasının statik üretimi: elle yazılan, yeniden yazılan ve üretilmiş bütün slug'lar (G13). */
export function getGuidePageSlugs(): string[] {
  return rehberSayfaSluglari(KOVALAR);
}

/** Rehber sayfasındaki ilgili rehberler: yalnız yayındakiler (G12); slug yoksa boş. */
export function getRelatedPublished(slug: string, limit = 5): VatandasArticle[] {
  const durum = getGuidePageState(slug);
  return durum ? ilgiliRehberler(durum.article, PUBLISHED_ARTICLES, limit) : [];
}

const ACIK_HEDEFLER = {
  rehberler: new Set(PUBLISHED_ARTICLES.map((a) => a.slug)),
  kategoriler: new Set(categories.map((c) => c.slug)),
};

/** Sayfada çizilecek sürüm: iç bağlantılar ve ana rehber göndermesi yalnız açık hedefe (G12). */
export function getGuideView(article: VatandasArticle): VatandasArticle {
  return rehberBaglantilariniSuz(article, ACIK_HEDEFLER);
}

/** Başka sayfaların rehber ve kategori bağlantıları için aynı süzgeç (ör. hesaplama sayfasının rehber listesi). */
export function yayindakiBaglantilar<T extends { label: string; href: string }>(links: T[]): T[] {
  return rehberBaglantilariniSuz({ links }, ACIK_HEDEFLER).links;
}

export function getPublishedSlugs(): string[] {
  return PUBLISHED_ARTICLES.map((a) => a.slug);
}

export function getPublishedCategories(): string[] {
  return Array.from(new Set(PUBLISHED_ARTICLES.map((a) => a.category))).sort((a, b) =>
    a.localeCompare(b, 'tr')
  );
}
