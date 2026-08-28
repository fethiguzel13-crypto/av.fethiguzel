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
 * Yayınlanabilir rehberler: rewritten > authored > üretilmiş.
 *
 * ─── Kalite kapısı hangi kovaya uygulanır ──────────────────────────────────
 *
 * `authored` ELLE yazılmıştır; insanın yazdığı metin denetimden muaftır.
 *
 * `rewritten` ise MAKİNE çıktısıdır (bkz. scripts/rewrite-vatandas-gemini.mjs)
 * ve bir dönem yanlışlıkla elle yazılmış gibi muaf tutuluyordu. Ölçüldü: 579
 * yeniden yazılmış rehberin 23'ü projenin kendi kapısından geçmiyor —
 * «thin», yani yeterli derinlikte değil. O 23 rehber yine de canlıda
 * yayınlanıyordu.
 *
 * Bu, projenin 2 numaralı ilkesiyle çelişiyordu: doğrulanmamış içerik
 * yayınlanmaz. Üstelik sayaçlar da onları sayıyor, yani site 570'ten fazla
 * rehber olduğunu söylerken 23'ü eşiğin altındaydı — mağaza metnine de aynı
 * sayı geçiyor.
 *
 * Artık makine çıktısının üç kovası da aynı kapıdan geçer. Elenen rehber
 * silinmez; yalnız yayından ve sayaçtan düşer, derinleştirilince geri gelir.
 *
 * @returns {{ published: any[], authored: any[], rewritten: any[], withdrawn: number }}
 */
export function readPublished(root) {
  /*
    ─── Öncelik sırası: ELLE YAZILAN > yeniden yazılan > üretilen ───────────

    Sıra bir dönem tersti: `rewritten` önce alınıyor, `authored` ise aynı
    slug'a sahipse ELENİYORDU. Sonuç, elle yazılmış 33 rehberin — kıdem
    tazminatı, boşanma davası, işe iade, miras paylaşımı gibi en çok okunan
    başlıkların — TAMAMININ makine çıktısıyla ezilmesiydi. Depodaki
    `authored-guides` testi bunu yakalıyordu ve kırmızı duruyordu.

    İnsanın yazdığı metin her zaman kazanır; makine sürümü yalnız insan
    yazmadığı yerde devreye girer.
  */
  const authored = readAuthored(root);
  const authoredSlugs = new Set(authored.map((a) => a.slug));

  const rewrittenHam = readRewritten(root).filter((a) => !authoredSlugs.has(a.slug));
  const rewritten = rewrittenHam.filter((a) => auditGuide(a).publishable);

  const taken = new Set([...authoredSlugs, ...rewrittenHam.map((a) => a.slug)]);
  const generated = readGenerated(root).filter((a) => !taken.has(a.slug));
  const kept = generated.filter((a) => auditGuide(a).publishable);

  return {
    published: [...authored, ...rewritten, ...kept],
    authored,
    rewritten,
    withdrawn: rewrittenHam.length - rewritten.length + (generated.length - kept.length),
  };
}
