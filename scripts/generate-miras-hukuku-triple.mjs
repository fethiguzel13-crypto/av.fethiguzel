/**
 * Tüm aktif fakülteler için Miras Hukuku 1. dönem / 2. dönem / yıllık.
 * Run: node scripts/generate-miras-hukuku-triple.mjs
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  MIRAS_HUKUKU_VARIANTS,
  buildMirasHukukuVariantNote,
} from './lib/miras-hukuku-triple.mjs';

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
  for (const v of MIRAS_HUKUKU_VARIANTS) {
    const note = buildMirasHukukuVariantNote(uni, v);
    newNotes.push(note);
    writeFileSync(join(NOTES_DIR, `${note.slug}.json`), JSON.stringify(note), 'utf8');
  }
}

const indexPath = join(OUT_DIR, 'index.json');
const index = existsSync(indexPath)
  ? JSON.parse(readFileSync(indexPath, 'utf8'))
  : { notes: [], noteCount: 0 };

const dropCodes = new Set(MIRAS_HUKUKU_VARIANTS);
const kept = (index.notes || []).filter((n) => !dropCodes.has(n.courseCode));
const added = newNotes.map((n) => ({
  uniSlug: n.uniSlug,
  courseCode: n.courseCode,
  slug: n.slug,
  title: n.title,
  href: `/ders-notlari/${n.uniSlug}/${n.courseCode}`,
  variantOf: 'miras-hukuku',
  variantLabel: n.variantLabel,
}));

index.notes = [...kept, ...added];
index.noteCount = index.notes.length;
index.mirasHukukuTripleAt = new Date().toISOString();
writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8');

const hubsPath = join(OUT_DIR, 'hubs.json');
if (existsSync(hubsPath)) {
  const hubs = JSON.parse(readFileSync(hubsPath, 'utf8'));
  for (const hub of hubs) {
    const uniSlug = hub.uni?.slug;
    if (!uniSlug) continue;
    const codes = new Set((hub.courses || []).map((c) => c.code));
    const extras = [
      {
        code: 'miras-hukuku-donem-1',
        title: 'Miras Hukuku — 1. Dönem (Güz)',
        year: 4,
        href: `/ders-notlari/${uniSlug}/miras-hukuku-donem-1`,
        ready: true,
        variantOf: 'miras-hukuku',
      },
      {
        code: 'miras-hukuku-donem-2',
        title: 'Miras Hukuku — 2. Dönem (Bahar)',
        year: 4,
        href: `/ders-notlari/${uniSlug}/miras-hukuku-donem-2`,
        ready: true,
        variantOf: 'miras-hukuku',
      },
      {
        code: 'miras-hukuku-yillik',
        title: 'Miras Hukuku — Yıllık Tam Not',
        year: 4,
        href: `/ders-notlari/${uniSlug}/miras-hukuku-yillik`,
        ready: true,
        variantOf: 'miras-hukuku',
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
  `[miras-triple] unis=${activeUnis.length} notes=${newNotes.length} variants=${MIRAS_HUKUKU_VARIANTS.join(',')}`
);
console.log(`[miras-triple] index notes now=${index.noteCount}`);
