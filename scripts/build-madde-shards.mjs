/**
 * Builds per-madde JSON shards for Edge SEO HTML:
 *   public/data/m/{kanunId}/{id}.json
 *
 * Why: Edge cannot gunzip+parse full TBK pack (~25MB) — OOM → 500.
 * Each shard is small; route handler fetches only one madde.
 *
 * Run: node scripts/build-madde-shards.mjs
 * Hooked from prebuild (Vercel + local).
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  rmSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'public', 'data', 'm');
/** Tam şerh — kesilmez (portalın kendisi tam metni sunar) */
const MAX_COMMENTARY = Number.MAX_SAFE_INTEGER;

function loadPack(kanunId) {
  const candidates = [
    join(root, 'public', 'content-packs', `${kanunId}.json.gz`),
    join(root, 'content-packs', `${kanunId}.json.gz`),
    join(root, 'public', 'content-packs', `${kanunId}.json`),
    join(root, 'content-packs', `${kanunId}.json`),
  ];
  for (const p of candidates) {
    if (!existsSync(p)) continue;
    const buf = readFileSync(p);
    if (buf[0] === 0x1f && buf[1] === 0x8b) {
      return JSON.parse(gunzipSync(buf).toString('utf8'));
    }
    return JSON.parse(buf.toString('utf8'));
  }
  return null;
}

function listKanunIds() {
  const dirs = [
    join(root, 'public', 'content-packs'),
    join(root, 'content-packs'),
  ];
  const ids = new Set();
  for (const d of dirs) {
    if (!existsSync(d)) continue;
    for (const f of readdirSync(d)) {
      const m = f.match(/^(.+)\.json(\.gz)?$/);
      if (m && m[1] !== 'manifest') ids.add(m[1]);
    }
  }
  return [...ids].sort();
}

function clip(s, max) {
  const t = String(s || '');
  if (t.length <= max) return t;
  // Yalnız aşırı büyük edge-case: cümle sınırında kes, “arşivde” deme
  return t.slice(0, max).replace(/\s+\S*$/, '').trimEnd();
}

if (existsSync(OUT)) {
  rmSync(OUT, { recursive: true, force: true });
}
mkdirSync(OUT, { recursive: true });

const kanunIds = listKanunIds();
let pages = 0;
let failed = 0;
const t0 = Date.now();

for (const kanunId of kanunIds) {
  let pack;
  try {
    pack = loadPack(kanunId);
  } catch (e) {
    console.warn('[madde-shards] pack fail', kanunId, e?.message || e);
    failed++;
    continue;
  }
  if (!pack) {
    console.warn('[madde-shards] missing pack', kanunId);
    failed++;
    continue;
  }
  const dir = join(OUT, kanunId);
  mkdirSync(dir, { recursive: true });
  for (const [id, article] of Object.entries(pack)) {
    if (!article || typeof article.maddeNo !== 'number') continue;
    const shard = {
      id,
      kanunId,
      title: article.title || '',
      kanun: article.kanun || kanunId.toUpperCase(),
      maddeNo: article.maddeNo,
      official: String(article.official || ''),
      commentary: clip(article.commentary, MAX_COMMENTARY),
    };
    writeFileSync(join(dir, `${id}.json`), JSON.stringify(shard), 'utf8');
    pages++;
  }
  pack = null;
}

const sec = ((Date.now() - t0) / 1000).toFixed(1);
console.log(
  `[madde-shards] wrote ${pages} shards for ${kanunIds.length} kanun in ${sec}s (fail packs: ${failed})`
);
console.log(`[madde-shards] out=${OUT}`);
if (pages < 100) {
  console.error('[madde-shards] too few shards — aborting');
  process.exit(1);
}
