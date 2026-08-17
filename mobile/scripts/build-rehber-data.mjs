#!/usr/bin/env node
/**
 * Vatandaş Hukuku uygulaması için rehber verisi.
 *
 *   data-src/rehber/guides.json.gz
 *
 * İki iş yapar:
 *
 *  1. KALİTE KAPISI — 554 rehberin yalnız denetimden geçenleri alınır.
 *     Kalıp metinden üretilmiş 487 rehber uygulamaya girmez. Bir hukuk
 *     uygulamasında "yasal süre vardır" deyip süreyi söylemeyen metin,
 *     hiç metin olmamasından kötüdür.
 *
 *  2. BOYUT — data.ts'i doğrudan paketlemek 5,4 MB'lık bir JS dosyası
 *     üretiyordu; düşük donanımlı telefonda açılış saniyeler sürüyor.
 *     Sıkıştırılmış varlık olarak yüklenince hem küçülüyor hem de ilk
 *     boyama JavaScript'i beklemiyor.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readPublished } from '../../scripts/lib/read-guides.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const mobile = join(here, '..');
const portal = join(mobile, '..');
const outDir = join(mobile, 'data-src', 'rehber');
mkdirSync(outDir, { recursive: true });

// Elle yazılanlar + denetimden geçen üretilmişler. Site ile aynı liste.
const { published, authored, withdrawn: dropped } = readPublished(portal);
const kept = [];

for (const a of published) {
  // Uygulamada kullanılmayan SEO alanları atılır
  kept.push({
    slug: a.slug,
    h1: a.h1,
    category: a.category,
    lead: a.lead,
    keywords: a.keywords ?? [],
    sections: a.sections ?? [],
    steps: a.steps ?? [],
    faq: a.faq ?? [],
    checklist: a.checklist ?? [],
    table: a.table ?? null,
    examples: a.examples ?? [],
    scenarios: a.scenarios ?? [],
    keyInsight: a.keyInsight ?? '',
    links: a.links ?? [],
    related: a.related ?? [],
    updated: a.updated ?? '',
    role: a.role ?? 'standard',
  });
}

// İlgili başlıklar yalnız yayında olanlara işaret etsin
const live = new Set(kept.map((k) => k.slug));
for (const k of kept) k.related = k.related.filter((s) => live.has(s)).slice(0, 6);

const gz = gzipSync(Buffer.from(JSON.stringify(kept), 'utf8'), { level: 9 });
writeFileSync(join(outDir, 'guides.json.gz'), gz);

const cats = new Set(kept.map((k) => k.category));
console.log(
  `[rehber] ${kept.length} rehber · ${cats.size} konu · ${(gz.length / 1024).toFixed(0)} KB`
);
console.log(`[rehber]   ${authored.length} elle yazılan · ${kept.length - authored.length} denetimden geçen`);
console.log(`[rehber] ${dropped} rehber kalıp metin nedeniyle uygulamaya alınmadı`);

if (kept.length === 0) {
  console.error('[rehber] hiçbir rehber denetimden geçmedi — uygulama boş kalır');
  process.exit(1);
}
