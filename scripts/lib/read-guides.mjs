/**
 * Vatandaş rehberi kaynaklarını tek yerden okur.
 *
 * İki kaynak vardır ve karıştırılmamalıdır:
 *
 *   authored/*.json  elle yazılan metinler. Her madde göndermesi resmî
 *                    metinden doğrulanmıştır; koşulsuz yayınlanır.
 *   data.ts          otomatik üretilen 554 rehber. 14.08.2026 denetiminde
 *                    487'sinin kalıptan üretildiği ölçüldü; yalnız
 *                    denetimden geçenler alınır.
 *
 * Aynı slug her ikisinde de varsa elle yazılan kazanır. Bu kural
 * lib/vatandas-rehberi/published.ts ile birebir aynıdır; site ve uygulama
 * aynı listeyi görsün diye.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

import { auditGuide } from '../../lib/content-quality.mjs';

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
 * Yayınlanabilir rehberler: elle yazılanlar + denetimden geçen üretilmişler.
 * @returns {{ published: any[], authored: any[], withdrawn: number }}
 */
export function readPublished(root) {
  const authored = readAuthored(root);
  const authoredSlugs = new Set(authored.map((a) => a.slug));
  const generated = readGenerated(root).filter((a) => !authoredSlugs.has(a.slug));

  const kept = generated.filter((a) => auditGuide(a).publishable);

  return {
    published: [...authored, ...kept],
    authored,
    withdrawn: generated.length - kept.length,
  };
}
