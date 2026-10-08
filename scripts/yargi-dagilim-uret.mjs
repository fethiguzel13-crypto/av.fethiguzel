#!/usr/bin/env node
/**
 * Karar arşivi dağılımını üretir (Aylık plan G17) — `/yargi-kararlari/istatistik` sayfası bu dosyayı okur.
 *
 *   node scripts/yargi-dagilim-uret.mjs --cikti=public/data/yargi-dagilim.json
 *
 * `--cikti` zorunludur; betik argümansız çalıştırıldığında hiçbir dosya yazmaz. Girdi, sitede yayımlanan web indeksi
 * (`data/yayin/yargi-index.json.gz`) ile aynı üretimin `public/data/yargi-stats.json` dosyasıdır; ikisi
 * `mobile/scripts/build-icthat-data.mjs` ile birlikte yenilenir. Birim adları `scripts/yargi-kararlari/config.json`
 * `tiers[].label`'dan okunur. Çıktı yalnız sayım taşır (bkz. `lib/yargi-dagilim.mjs`).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { yargiDagilimi } from '../lib/yargi-dagilim.mjs';

const kok = join(dirname(fileURLToPath(import.meta.url)), '..');
const cikti = process.argv.find((a) => a.startsWith('--cikti='))?.slice('--cikti='.length);
if (!cikti) {
  console.error('kullanım: node scripts/yargi-dagilim-uret.mjs --cikti=<dosya.json>');
  process.exit(1);
}

const config = JSON.parse(readFileSync(join(kok, 'scripts', 'yargi-kararlari', 'config.json'), 'utf8'));
// Okura dönük ad: Hasat etiketindeki parantezli iç not ("ilke anahtar kelime", "Büyük Genel Kurulu") atılır.
const etiketler = Object.fromEntries(
  (config.tiers || []).filter((t) => t.id && t.label).map((t) => [t.id, t.label.replace(/\s*\(.*\)\s*$/, '')])
);
// `hukuk-daire`, birim seçimi olmadan hukuk dairelerinden inen kararlardır; hasat yapılandırmasında ayrı bir birim değildir.
etiketler['hukuk-daire'] ??= 'Diğer hukuk daireleri';

const satirlar = JSON.parse(gunzipSync(readFileSync(join(kok, 'data', 'yayin', 'yargi-index.json.gz'))).toString('utf8')).map(
  (s) => ({ r: s.r, y: s.y })
);
const istatistik = JSON.parse(readFileSync(join(kok, 'public', 'data', 'yargi-stats.json'), 'utf8'));

const dagilim = yargiDagilimi({ satirlar, istatistik, etiketler });
writeFileSync(cikti, `${JSON.stringify({ kaynakTarihi: String(istatistik.generatedAt || '').slice(0, 10), ...dagilim }, null, 1)}\n`);
console.log(
  `[yargi-dagilim] arşiv ${dagilim.arsiv}, yayında ${dagilim.yayinda}, ${dagilim.birimler.length} birim, ${dagilim.yillar.length} yıl → ${cikti}`
);
