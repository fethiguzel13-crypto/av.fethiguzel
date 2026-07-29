/**
 * Tüm aktif fakülteler için Borçlar Genel 1. dönem / 2. dönem / yıllık notları.
 * Run: node scripts/generate-borclar-genel-triple.mjs
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BORCLAR_GENEL_VARIANTS,
  buildBorclarGenelVariantNote,
} from './lib/borclar-genel-triple.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const OUT_DIR = join(root, 'lib', 'ders-notlari', 'generated');
const NOTES_DIR = join(OUT_DIR, 'notes');

function loadTsArrayExport(filePath, exportName) {
  const src = readFileSync(filePath, 'utf8');
  const re = new RegExp(
    `export const ${exportName}(?::[^=]+)?=\\s*(\\[[\\s\\S]*?\\n\\]);`
  );
  const m = src.match(re);
  if (!m) throw new Error(`Cannot parse ${exportName}`);
  return new Function(`return (${m[1]});`)();
}

const LAW_UNIVERSITIES = loadTsArrayExport(
  join(root, 'lib/ders-notlari/universiteler.ts'),
  'LAW_UNIVERSITIES'
);
const activeUnis = LAW_UNIVERSITIES.filter((u) => u.active);

mkdirSync(NOTES_DIR, { recursive: true });

const newNotes = [];
for (const uni of activeUnis) {
  for (const v of BORCLAR_GENEL_VARIANTS) {
    const note = buildBorclarGenelVariantNote(uni, v);
    newNotes.push(note);
    writeFileSync(join(NOTES_DIR, `${note.slug}.json`), JSON.stringify(note), 'utf8');
  }
}

// index.json güncelle
const indexPath = join(OUT_DIR, 'index.json');
const index = existsSync(indexPath)
  ? JSON.parse(readFileSync(indexPath, 'utf8'))
  : { notes: [], universities: [], noteCount: 0 };

const dropCodes = new Set(BORCLAR_GENEL_VARIANTS);
const kept = (index.notes || []).filter((n) => !dropCodes.has(n.courseCode));
const added = newNotes.map((n) => ({
  uniSlug: n.uniSlug,
  courseCode: n.courseCode,
  slug: n.slug,
  title: n.title,
  href: `/ders-notlari/${n.uniSlug}/${n.courseCode}`,
  variantOf: 'borclar-genel',
  variantLabel: n.variantLabel,
}));

index.notes = [...kept, ...added];
index.noteCount = index.notes.length;
index.borclarGenelTripleAt = new Date().toISOString();
index.generatedAt = index.generatedAt || new Date().toISOString();
writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8');

// hubs.json — her uniye borçlar genel üçlü linkleri
const hubsPath = join(OUT_DIR, 'hubs.json');
if (existsSync(hubsPath)) {
  const hubs = JSON.parse(readFileSync(hubsPath, 'utf8'));
  for (const hub of hubs) {
    const uniSlug = hub.uni?.slug;
    if (!uniSlug) continue;
    // mevcut borclar-genel satırını koru; yanına üçlüyü ekle (yoksa)
    const codes = new Set((hub.courses || []).map((c) => c.code));
    const extras = [
      {
        code: 'borclar-genel-donem-1',
        title: 'Borçlar Genel — 1. Dönem (Güz)',
        year: 2,
        href: `/ders-notlari/${uniSlug}/borclar-genel-donem-1`,
        ready: true,
        variantOf: 'borclar-genel',
      },
      {
        code: 'borclar-genel-donem-2',
        title: 'Borçlar Genel — 2. Dönem (Bahar)',
        year: 2,
        href: `/ders-notlari/${uniSlug}/borclar-genel-donem-2`,
        ready: true,
        variantOf: 'borclar-genel',
      },
      {
        code: 'borclar-genel-yillik',
        title: 'Borçlar Genel — Yıllık Tam Not',
        year: 2,
        href: `/ders-notlari/${uniSlug}/borclar-genel-yillik`,
        ready: true,
        variantOf: 'borclar-genel',
      },
    ];
    for (const e of extras) {
      if (!codes.has(e.code)) hub.courses.push(e);
      else {
        const i = hub.courses.findIndex((c) => c.code === e.code);
        hub.courses[i] = { ...hub.courses[i], ...e };
      }
    }
  }
  writeFileSync(hubsPath, JSON.stringify(hubs, null, 2), 'utf8');
}

console.log(
  `[borclar-triple] unis=${activeUnis.length} notes=${newNotes.length} variants=${BORCLAR_GENEL_VARIANTS.join(',')}`
);
console.log(`[borclar-triple] index notes now=${index.noteCount}`);
