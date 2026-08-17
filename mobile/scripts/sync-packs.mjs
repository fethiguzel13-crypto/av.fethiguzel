#!/usr/bin/env node
/**
 * Portalın ürettiği uygulama paketlerini uygulama kaynağına kopyalar.
 *
 *   portal/public/app-packs/*.json.gz  →  mobile/app-src/public/packs/
 *
 * Paketler portal tarafında üretilir (scripts/build-app-packs.mjs) çünkü
 * kaynak külliyat ve kalite denetimi orada. Mobil taraf yalnız tüketir.
 */
import { readdirSync, copyFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const mobile = join(here, '..');
const src = join(mobile, '..', 'public', 'app-packs');
// data-src: uygulamaya göre seçilerek kopyalanan ham varlık deposu.
// Doğrudan app-src/public'e koymak, paketleri dört uygulamaya birden
// gömüyordu.
const dst = join(mobile, 'data-src', 'packs');

if (!existsSync(src)) {
  console.error('[packs] kaynak yok:', src);
  console.error('[packs] önce portal kökünde çalıştırın: node scripts/build-app-packs.mjs');
  process.exit(1);
}

mkdirSync(dst, { recursive: true });

let files = 0;
let bytes = 0;
for (const f of readdirSync(src)) {
  if (!f.endsWith('.json.gz') && f !== 'manifest.json') continue;
  const from = join(src, f);
  copyFileSync(from, join(dst, f));
  files += 1;
  bytes += statSync(from).size;
}

console.log(`[packs] ${files} dosya · ${(bytes / 1048576).toFixed(1)} MB → data-src/packs`);

if (files < 2) {
  console.error('[packs] beklenenden az dosya kopyalandı — paketler eksik olabilir');
  process.exit(1);
}
