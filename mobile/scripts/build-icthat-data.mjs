#!/usr/bin/env node
/**
 * İçtihat + Yargı arşivi gömülü verisi.
 *
 * Üretir:
 *   data-src/icthat/seed.json              — son günlük özet
 *   data-src/icthat/archive.json.gz        — zengin indeks (künye + özet + kademe)
 *   data-src/icthat/fulltext/sNN.json.gz   — tam metin parçaları
 *   data-src/icthat/fulltext/manifest.json — parça sayısı
 *   public/data/yargi-stats.json           — web ana sayfa sayaçları
 *   public/data/yargi-featured.json        — vitrin kararlar (YİBK + yeni HGK)
 *   public/data/yargi-index.json.gz        — web arama indeksi
 *
 * Tam metinler uygulamaya gömülür: kullanıcı boyut kısıtı koymadı,
 * kalite ve çevrimdışı araştırma kütüphanesi öncelikli.
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
  rmSync,
} from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const mobile = join(here, '..');
const portal = join(mobile, '..');
const yargiRoot = join(portal, 'data', 'yargi-kararlari');
const outDir = join(mobile, 'data-src', 'icthat');
const fullDir = join(outDir, 'fulltext');
const publicData = join(portal, 'public', 'data');

mkdirSync(outDir, { recursive: true });
mkdirSync(publicData, { recursive: true });

const SHARD_COUNT = 80;

function shardOf(id) {
  let h = 0;
  const s = String(id);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % SHARD_COUNT;
}

function shardName(n) {
  return `s${String(n).padStart(2, '0')}.json.gz`;
}

function toIso(tr) {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(tr || ''));
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '0000-00-00';
}

function yearFromDate(tr) {
  const m = /(\d{4})$/.exec(String(tr || ''));
  return m ? m[1] : '';
}

function inferTier(row) {
  if (row.tierId) return String(row.tierId);
  const d = `${row.daire || ''} ${row.kunye || ''}`.toLocaleLowerCase('tr-TR');
  if (d.includes('büyük genel')) return 'yibk';
  if (d.includes('hukuk genel')) return 'hgk';
  if (d.includes('ceza genel')) return 'cgk';
  if (d.includes('başkanlar')) return 'hdbk';
  if (row.alan) return String(row.alan);
  return 'diger';
}

function makeExcerpt(text) {
  let t = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  t = t.replace(/^.*?İçtihat Metni"?\s*/i, '');
  const u = t.match(/Uyuşmazlık[,:\s]+(.{70,240}?)(?:\.\s|[A-ZÇĞİÖŞÜ])/);
  if (u) return `${u[1].trim().replace(/[.,;:\s]+$/, '')}.`;
  const g = t.match(/Değerlendirme ve Gerekçe\s+(.{70,240}?)(?:\.\s)/);
  if (g) return `${g[1].trim().replace(/[.,;:\s]+$/, '')}.`;
  if (t.length <= 220) return t;
  return `${t.slice(0, 220).replace(/\s+\S*$/, '')}…`;
}

function resolveDecisionFile(row) {
  const id = String(row.id);
  const year = yearFromDate(row.tarih);
  const candidates = [];
  if (row.file) candidates.push(join(yargiRoot, row.file));
  if (year) candidates.push(join(yargiRoot, 'decisions', year, `${id}.json`));
  candidates.push(join(yargiRoot, 'decisions', `${id}.json`));
  const tier = inferTier(row);
  if (tier) candidates.push(join(yargiRoot, 'by-tier', tier, `${id}.json`));
  if (row.alan) candidates.push(join(yargiRoot, 'by-alan', row.alan, `${id}.json`));
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

function extractText(raw) {
  // html alanını parse etmeden text'i çek — 20k dosyada ciddi hız kazancı
  const m = raw.match(/"text"\s*:\s*"((?:\\.|[^"\\])*)"/);
  if (!m) {
    try {
      const j = JSON.parse(raw);
      return String(j.text || '');
    } catch {
      return '';
    }
  }
  try {
    return JSON.parse(`"${m[1]}"`);
  } catch {
    return m[1]
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }
}

// ─── Günlük özet tohumu ─────────────────────────────────────────────────────
const dailyPath = join(portal, 'public', 'data', 'daily.json');
if (existsSync(dailyPath)) {
  const daily = JSON.parse(readFileSync(dailyPath, 'utf8'));
  const slim = {
    generatedAt: daily.generatedAt,
    dateLabel: daily.dateLabel,
    items: daily.items,
    highlights: daily.highlights ?? [],
    stats: daily.stats,
  };
  writeFileSync(join(outDir, 'seed.json'), JSON.stringify(slim));
  console.log(`[icthat] tohum: ${daily.stats?.totalItems ?? 0} kayıt (${daily.dateLabel})`);
} else {
  writeFileSync(
    join(outDir, 'seed.json'),
    JSON.stringify({
      generatedAt: '',
      dateLabel: '',
      items: { resmigazete: [], yargitay: [], aym: [], hudoc: [], mevzuat: [] },
      highlights: [],
      stats: { totalItems: 0, perSource: {} },
    })
  );
  console.warn('[icthat] public/data/daily.json yok — boş tohum yazıldı');
}

// ─── Karar arşivi + tam metin ───────────────────────────────────────────────
const idxPath = join(yargiRoot, 'index.jsonl');
if (!existsSync(idxPath)) {
  writeFileSync(join(outDir, 'archive.json.gz'), gzipSync(Buffer.from('[]', 'utf8')));
  console.warn('[icthat] yargi-kararlari/index.jsonl yok — boş arşiv yazıldı');
  process.exit(0);
}

const lines = readFileSync(idxPath, 'utf8').split('\n').filter(Boolean);
const rows = [];
const seen = new Set();
const shards = Array.from({ length: SHARD_COUNT }, () => ({}));
const featured = [];
const byTier = {};

let filesRead = 0;
let textsKept = 0;
let missing = 0;
const t0 = Date.now();

for (const line of lines) {
  let r;
  try {
    r = JSON.parse(line);
  } catch {
    continue;
  }
  if (!r?.id || seen.has(String(r.id))) continue;
  seen.add(String(r.id));

  const tier = inferTier(r);
  byTier[tier] = (byTier[tier] || 0) + 1;

  let excerpt = '';
  let text = '';
  const file = resolveDecisionFile(r);
  if (file) {
    try {
      const raw = readFileSync(file, 'utf8');
      text = extractText(raw);
      filesRead += 1;
    } catch {
      missing += 1;
    }
  } else {
    missing += 1;
  }

  if (text) {
    excerpt = makeExcerpt(text);
    shards[shardOf(r.id)][String(r.id)] = text;
    textsKept += 1;
  }

  const row = {
    i: String(r.id),
    k: r.kunye || '',
    a: r.alan || '',
    t: r.tarih || '',
    d: r.daire || '',
    w: Array.isArray(r.keywords) ? r.keywords.slice(0, 8) : [],
    s: r.slug || '',
    r: tier,
    e: excerpt,
    y: yearFromDate(r.tarih),
  };
  rows.push(row);

  if (excerpt) {
    featured.push({
      id: row.i,
      kunye: row.k,
      daire: row.d,
      tarih: row.t,
      alan: row.a,
      tier,
      excerpt,
      slug: row.s,
      keywords: row.w,
    });
  }
}

rows.sort((a, b) => toIso(b.t).localeCompare(toIso(a.t)));
const usable = featured.filter(
  (f) => f.excerpt && f.excerpt.length > 80 && !/^MAHKEMES[Iİ]/i.test(f.excerpt)
);
const yibkPick = usable.filter((f) => f.tier === 'yibk').slice(0, 8);
const hgkPick = usable
  .filter((f) => f.tier === 'hgk')
  .sort((a, b) => toIso(b.tarih).localeCompare(toIso(a.tarih)))
  .slice(0, 8);
const featuredFinal = [...yibkPick, ...hgkPick];

const archiveGz = gzipSync(Buffer.from(JSON.stringify(rows), 'utf8'), { level: 9 });
writeFileSync(join(outDir, 'archive.json.gz'), archiveGz);

if (existsSync(fullDir)) rmSync(fullDir, { recursive: true, force: true });
mkdirSync(fullDir, { recursive: true });

let shardBytes = 0;
let shardFiles = 0;
for (let n = 0; n < SHARD_COUNT; n++) {
  const bag = shards[n];
  if (!Object.keys(bag).length) continue;
  const gz = gzipSync(Buffer.from(JSON.stringify(bag), 'utf8'), { level: 9 });
  writeFileSync(join(fullDir, shardName(n)), gz);
  shardBytes += gz.length;
  shardFiles += 1;
}

writeFileSync(
  join(fullDir, 'manifest.json'),
  JSON.stringify({
    version: 1,
    shards: SHARD_COUNT,
    decisions: textsKept,
    generatedAt: new Date().toISOString(),
  })
);

const stats = {
  generatedAt: new Date().toISOString(),
  total: rows.length,
  withText: textsKept,
  byTier,
};

writeFileSync(join(publicData, 'yargi-stats.json'), JSON.stringify(stats));
writeFileSync(
  join(publicData, 'yargi-featured.json'),
  JSON.stringify({ generatedAt: stats.generatedAt, items: featuredFinal })
);

const webIndex = rows.map((r) => ({
  i: r.i,
  k: r.k,
  a: r.a,
  t: r.t,
  d: r.d,
  w: r.w,
  r: r.r,
  e: r.e,
  s: r.s,
  y: r.y,
}));
const webGz = gzipSync(Buffer.from(JSON.stringify(webIndex), 'utf8'), { level: 9 });
writeFileSync(join(publicData, 'yargi-index.json.gz'), webGz);

const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
console.log(
  `[icthat] arşiv: ${rows.length} karar · indeks ${(archiveGz.length / 1024).toFixed(0)} KB`
);
console.log(
  `[icthat] tam metin: ${textsKept} karar / ${shardFiles} parça · ${(shardBytes / 1024 / 1024).toFixed(1)} MB · eksik ${missing}`
);
console.log(
  `[icthat] web indeks: ${(webGz.length / 1024).toFixed(0)} KB · vitrin ${Math.min(featured.length, 20)}`
);
console.log(`[icthat] dosya okuma: ${filesRead} · ${elapsed}s`);
console.log(`[icthat] kademe: ${JSON.stringify(byTier)}`);
