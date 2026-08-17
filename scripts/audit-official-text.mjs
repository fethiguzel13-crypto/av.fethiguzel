#!/usr/bin/env node
/**
 * Resmî metin bütünlüğü denetimi.
 *
 * Mevzuat uygulamasının tek vaadi, gösterdiği metnin Resmî Gazete'deki
 * hâliyle aynı olmasıdır. Bu betik, `official` alanında ÖZET veya
 * yer tutucu bulunan maddeleri bulur.
 *
 * Tespit edilen desen — İSG paketinde fark edildi:
 *   *(Tüm alt bentler resmi madde metninde sırasıyla a ve b bentleri
 *     olarak verilmiştir. …)*
 *   *(Fıkra 2, 3, 4 ve 5 resmi madde metninde sırasıyla verilmiştir. …)*
 *   *(Metin yukarıda verilmiştir. …)*
 *
 * Bu metinler kanun metni değil, kanun metni HAKKINDA cümlelerdir.
 * Kullanıcı maddeyi okuduğunu sanırken özet okur.
 *
 *   node scripts/audit-official-text.mjs
 *   node scripts/audit-official-text.mjs --list=isg
 */
import { gunzipSync } from 'node:zlib';
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SUMMARY_MARKERS } from './lib/summary-markers.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = existsSync(join(root, 'content-packs'))
  ? join(root, 'content-packs')
  : join(root, 'public', 'content-packs');

const listArg = (process.argv.find((a) => a.startsWith('--list=')) || '').split('=')[1];


const rows = [];
let total = 0;
let flagged = 0;

for (const file of readdirSync(dir).filter((f) => f.endsWith('.json.gz'))) {
  const kanunId = file.replace('.json.gz', '');
  let pack;
  try {
    pack = JSON.parse(gunzipSync(readFileSync(join(dir, file))));
  } catch {
    console.warn(`  ! ${file} okunamadı`);
    continue;
  }

  const bad = [];
  for (const [key, art] of Object.entries(pack)) {
    total += 1;
    const text = String(art?.official || '');
    if (!text.trim()) {
      bad.push({ key, why: 'boş' });
      continue;
    }
    const hit = SUMMARY_MARKERS.find((re) => re.test(text));
    if (hit) bad.push({ key, why: 'özet' });
  }

  if (bad.length) {
    flagged += bad.length;
    rows.push({ kanunId, articles: Object.keys(pack).length, bad });
  }

  if (listArg === kanunId) {
    console.log(`\n── ${kanunId} — özet veya boş resmî metin ──`);
    for (const b of bad.slice(0, 60)) console.log(`  ${b.why.padEnd(6)} ${b.key}`);
    if (bad.length > 60) console.log(`  … ve ${bad.length - 60} madde daha`);
  }
}

rows.sort((a, b) => b.bad.length - a.bad.length);

console.log(`\nToplam madde: ${total}`);
console.log(`Resmî metni özet veya boş olan: ${flagged} (%${((flagged / total) * 100).toFixed(2)})\n`);

if (rows.length === 0) {
  console.log('Tüm resmî metinler tam görünüyor.');
} else {
  console.log(`${'kanun'.padEnd(26)}${'madde'.padStart(7)}${'sorunlu'.padStart(9)}`);
  for (const r of rows) {
    console.log(`${r.kanunId.padEnd(26)}${String(r.articles).padStart(7)}${String(r.bad.length).padStart(9)}`);
  }
  console.log('\nBu maddelerde kullanıcı, kanun metni yerine kanun metni HAKKINDA');
  console.log('bir cümle okuyor. Kaynaktan yeniden alınmaları gerekir.');
}

mkdirSync(join(root, 'data'), { recursive: true });
writeFileSync(
  join(root, 'data', 'official-text-audit.json'),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      total,
      flagged,
      byKanun: rows.map((r) => ({
        kanunId: r.kanunId,
        articles: r.articles,
        flagged: r.bad.length,
        keys: r.bad.map((b) => b.key),
      })),
    },
    null,
    2
  )
);

process.exitCode = flagged > 0 ? 1 : 0;
