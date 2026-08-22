/**
 * Vatandaş rehberi kaynaklarını tek yerden okur.
 *
 * Üç kaynak, öncelik sırasıyla:
 *
 *   rewritten/*.json  Gemini anlatı. Kalıp iskelet yok.
 *   authored/*.json   elle yazılan, madde göndermesi doğrulanmış metinler.
 *   data.ts           otomatik üretilen 554 rehber; yalnız denetimden geçenler.
 *
 * Aynı slug birden fazla yerde varsa üstteki kazanır. Bu kural
 * lib/vatandas-rehberi/published.ts ile birebir aynıdır.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

import { auditGuide } from '../../lib/content-quality.mjs';

/** Gemini ile yeniden yazılan anlatı rehberleri. */
export function readRewritten(root) {
  const dir = join(root, 'lib', 'vatandas-rehberi', 'rewritten');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
    .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')))
    .filter((a) => a && a.slug && a.voice === 'narrative')
    .sort((a, b) => a.slug.localeCompare(b.slug, 'tr'));
}

/** Elle yazılan rehberler. */
export function readAuthored(root) {
  const dir = join(root, 'lib', 'vatandas-rehberi', 'authored');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')))
    .sort((a, b) => a.slug.localeCompare(b.slug, 'tr'));
}

/** Otomatik üretilen rehberlerin tamamı (denetimsiz). */
export function readGenerated(root) {
  const file = join(root, 'lib', 'vatandas-rehberi', 'data.ts');
  if (!existsSync(file)) return [];
  const src = readFileSync(file, 'utf8');
  const decl = src.indexOf('VATANDAS_ARTICLES');
  const start = src.indexOf('= [', decl) + 2;
  const end = src.indexOf('\n];', start);
  if (decl < 0 || start < 2 || end < 0) {
    throw new Error('data.ts ayrıştırılamadı — VATANDAS_ARTICLES bulunamadı');
  }
  return JSON.parse(src.slice(start, end + 2));
}

/**
 * Yayınlanabilir rehberler: rewritten > authored > denetimden geçen üretilmiş.
 * @returns {{ published: any[], authored: any[], rewritten: any[], withdrawn: number }}
 */
export function readPublished(root) {
  const rewritten = readRewritten(root);
  const rewrittenSlugs = new Set(rewritten.map((a) => a.slug));
  const authored = readAuthored(root).filter((a) => !rewrittenSlugs.has(a.slug));
  const taken = new Set([...rewrittenSlugs, ...authored.map((a) => a.slug)]);
  const generated = readGenerated(root).filter((a) => !taken.has(a.slug));
  const kept = generated.filter((a) => auditGuide(a).publishable);

  return {
    published: [...rewritten, ...authored, ...kept],
    authored,
    rewritten,
    withdrawn: generated.length - kept.length,
  };
}
