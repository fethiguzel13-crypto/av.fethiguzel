#!/usr/bin/env node
/**
 * Yayınlanabilir içerik listesi → public/data/publishable.json
 *
 * Neden manifest: site haritası derleme anında 46 paketi açıp 300 MB metni
 * belleğe almak zorunda kalmasın. Ağır analiz burada bir kez yapılır, çıktı
 * birkaç kilobayttır.
 *
 * Manifest ile çalışma anındaki davranış AYNI fonksiyondan
 * (lib/content-quality.mjs) beslenir; sapma olmaz. Bu betik prebuild'de
 * çalışır, böylece içerik yeniden yazıldığında liste kendiliğinden büyür.
 */
import { gunzipSync } from 'node:zlib';
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { auditCommentary, auditLectureNote } from '../lib/content-quality.mjs';
import { readPublished } from './lib/read-guides.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// ─── Mevzuat ────────────────────────────────────────────────────────────────
const mevzuat = [];
const packsDir = existsSync(join(root, 'content-packs'))
  ? join(root, 'content-packs')
  : join(root, 'public', 'content-packs');

if (existsSync(packsDir)) {
  for (const file of readdirSync(packsDir).filter((f) => f.endsWith('.json.gz'))) {
    const kanunId = file.replace('.json.gz', '');
    let pack;
    try {
      pack = JSON.parse(gunzipSync(readFileSync(join(packsDir, file))));
    } catch {
      console.warn(`[publishable] ${file} okunamadı, atlandı`);
      continue;
    }
    for (const [key, art] of Object.entries(pack)) {
      if (auditCommentary(kanunId, art?.commentary || '').publishable) {
        mevzuat.push(`${kanunId}/${key}`);
      }
    }
  }
} else {
  console.warn('[publishable] content-packs bulunamadı');
}

// ─── Vatandaş rehberi ───────────────────────────────────────────────────────
// Elle yazılanlar koşulsuz, üretilmişler denetimden geçerse listeye girer.
const { published: liveGuides, authored } = readPublished(root);
const rehber = liveGuides.map((a) => a.slug);

// ─── Ders notları ───────────────────────────────────────────────────────────
const dersNotlari = [];
const notesDir = join(root, 'lib', 'ders-notlari', 'generated', 'notes');
if (existsSync(notesDir)) {
  for (const f of readdirSync(notesDir).filter((x) => x.endsWith('.json'))) {
    try {
      const note = JSON.parse(readFileSync(join(notesDir, f), 'utf8'));
      if (auditLectureNote(note).publishable) dersNotlari.push(f.replace('.json', ''));
    } catch {
      /* bozuk dosya — yayınlanamaz sayılır */
    }
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  counts: {
    mevzuat: mevzuat.length,
    rehber: rehber.length,
    rehberAuthored: authored.length,
    dersNotlari: dersNotlari.length,
  },
  mevzuat: mevzuat.sort(),
  rehber: rehber.sort(),
  dersNotlari: dersNotlari.sort(),
};

const outDir = join(root, 'public', 'data');
mkdirSync(outDir, { recursive: true });
const out = join(outDir, 'publishable.json');
writeFileSync(out, JSON.stringify(manifest));

console.log(
  `[publishable] mevzuat ${mevzuat.length} · rehber ${rehber.length} ` +
    `(${authored.length} elle yazılan) · ders notu ${dersNotlari.length} → ${out}`
);
