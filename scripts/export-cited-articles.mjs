#!/usr/bin/env node
/**
 * Elle yazılan rehberlerin ATIF YAPTIĞI maddelerin resmî metinlerini
 * tek bir markdown dosyasına çıkarır.
 *
 *   data/rehber-kaynaklar.md
 *
 * ── Ne işe yarar ─────────────────────────────────────────────────────────────
 * Bu dosya NotebookLM'e KAYNAK olarak yüklenir ve rehberlerdeki iddiaların
 * kaynakta gerçekten karşılığı olup olmadığı bağımsız biçimde sorgulanır.
 *
 * NotebookLM burada METİN ÜRETMEK için kullanılmaz — bu oturumun tamamı,
 * üretilmiş metnin doğurduğu zararı temizlemekle geçti. Yalnızca kaynağa
 * bağlı soru sorma yeteneği kullanılır: "Bu kaynakta üç aylık süre yazıyor
 * mu?" gibi. Cevap kaynağa atıfla geldiği için ikinci bir okuyucu işlevi
 * görür; yeni içerik değil, doğrulama üretir.
 *
 *   node scripts/export-cited-articles.mjs
 */
import { gunzipSync } from 'node:zlib';
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readAuthored } from './lib/read-guides.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const packsDir = existsSync(join(root, 'content-packs'))
  ? join(root, 'content-packs')
  : join(root, 'public', 'content-packs');

const guides = readAuthored(root);
if (guides.length === 0) {
  console.error('Elle yazılan rehber bulunamadı');
  process.exit(1);
}

// ── Rehberlerin atıf yaptığı maddeleri topla ────────────────────────────────
// links[].href biçimi: /mevzuat/<kanunId>/madde-<no>
const cited = new Map(); // kanunId -> Set(maddeKey)
const byGuide = new Map(); // slug -> [{kanunId, key, label}]

for (const g of guides) {
  const list = [];
  for (const l of g.links || []) {
    const m = /^\/mevzuat\/([a-z0-9-]+)\/(madde-[\w]+)$/i.exec(l.href || '');
    if (!m) continue;
    const [, kanunId, key] = m;
    if (!cited.has(kanunId)) cited.set(kanunId, new Set());
    cited.get(kanunId).add(key);
    list.push({ kanunId, key, label: l.label });
  }
  byGuide.set(g.slug, list);
}

// ── Resmî metinleri çıkar ───────────────────────────────────────────────────
const packCache = new Map();
function loadPack(kanunId) {
  if (packCache.has(kanunId)) return packCache.get(kanunId);
  const p = join(packsDir, `${kanunId}.json.gz`);
  let pack = null;
  if (existsSync(p)) {
    try {
      pack = JSON.parse(gunzipSync(readFileSync(p)));
    } catch {
      pack = null;
    }
  }
  packCache.set(kanunId, pack);
  return pack;
}

const out = [];
out.push('# Rehberlerde atıf yapılan kanun maddeleri — resmî metinler');
out.push('');
out.push(
  'Bu dosya, elle yazılan vatandaş rehberlerinin atıf yaptığı maddelerin ' +
    'Resmî Gazete metinlerini içerir. Doğrulama amacıyla üretilmiştir; ' +
    'yorum, şerh veya açıklama içermez.'
);
out.push('');

let found = 0;
let missing = 0;
const missingList = [];

for (const kanunId of [...cited.keys()].sort()) {
  const pack = loadPack(kanunId);
  const keys = [...cited.get(kanunId)].sort(
    (a, b) => (parseInt(a.replace(/\D/g, ''), 10) || 0) - (parseInt(b.replace(/\D/g, ''), 10) || 0)
  );

  out.push(`\n## ${kanunId.toUpperCase()}\n`);

  for (const key of keys) {
    const art = pack?.[key];
    if (!art) {
      missing += 1;
      missingList.push(`${kanunId}/${key}`);
      out.push(`### ${kanunId.toUpperCase()} ${key} — METİN BULUNAMADI\n`);
      continue;
    }
    found += 1;
    const body = String(art.official || '')
      .replace(/\r/g, '')
      .replace(/^\*\*(.+?)\*\*\s*\n+---\s*\n+/, '$1\n\n')
      .replace(/\*\*/g, '')
      .trim();
    out.push(`### ${kanunId.toUpperCase()} m.${art.maddeNo}\n`);
    out.push(body);
    out.push('');
  }
}

// ── Hangi rehber hangi maddeye dayanıyor ────────────────────────────────────
out.push('\n## Rehber — madde eşlemesi\n');
for (const [slug, list] of byGuide) {
  if (!list.length) continue;
  const refs = list.map((r) => `${r.kanunId.toUpperCase()} ${r.key.replace('madde-', 'm.')}`);
  out.push(`- **${slug}**: ${refs.join(' · ')}`);
}
out.push('');

mkdirSync(join(root, 'data'), { recursive: true });
const outPath = join(root, 'data', 'rehber-kaynaklar.md');
writeFileSync(outPath, out.join('\n'));

console.log(`[kaynaklar] ${guides.length} rehber · ${found} madde metni → ${outPath}`);
console.log(`[kaynaklar] boyut: ${(out.join('\n').length / 1024).toFixed(0)} KB`);
if (missing > 0) {
  console.log(`[kaynaklar] BULUNAMAYAN ${missing} madde: ${missingList.join(', ')}`);
  console.log('[kaynaklar] Bu maddelere atıf yapan rehberler kaynaksız kalıyor — kontrol edin.');
  process.exitCode = 1;
}
