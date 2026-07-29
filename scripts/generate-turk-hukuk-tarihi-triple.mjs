/**
 * Tüm aktif fakülteler için Türk Hukuk Tarihi 1. dönem / 2. dönem / yıllık.
 * Run: node scripts/generate-turk-hukuk-tarihi-triple.mjs
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  TURK_HUKUK_TARIHI_VARIANTS,
  buildTurkHukukTarihiVariantNote,
} from './lib/turk-hukuk-tarihi-triple.mjs';

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
  for (const v of TURK_HUKUK_TARIHI_VARIANTS) {
    const note = buildTurkHukukTarihiVariantNote(uni, v);
    newNotes.push(note);
    writeFileSync(join(NOTES_DIR, `${note.slug}.json`), JSON.stringify(note), 'utf8');
  }
}

const indexPath = join(OUT_DIR, 'index.json');
const index = existsSync(indexPath)
  ? JSON.parse(readFileSync(indexPath, 'utf8'))
  : { notes: [], noteCount: 0 };

const dropCodes = new Set(TURK_HUKUK_TARIHI_VARIANTS);
const kept = (index.notes || []).filter((n) => !dropCodes.has(n.courseCode));
const added = newNotes.map((n) => ({
  uniSlug: n.uniSlug,
  courseCode: n.courseCode,
  slug: n.slug,
  title: n.title,
  href: `/ders-notlari/${n.uniSlug}/${n.courseCode}`,
  variantOf: 'turk-hukuk-tarihi',
  variantLabel: n.variantLabel,
}));

index.notes = [...kept, ...added];
index.noteCount = index.notes.length;
index.turkHukukTarihiTripleAt = new Date().toISOString();
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
        code: 'turk-hukuk-tarihi-donem-1',
        title: 'Türk Hukuk Tarihi — 1. Dönem (Güz)',
        year: 1,
        href: `/ders-notlari/${uniSlug}/turk-hukuk-tarihi-donem-1`,
        ready: true,
        variantOf: 'turk-hukuk-tarihi',
      },
      {
        code: 'turk-hukuk-tarihi-donem-2',
        title: 'Türk Hukuk Tarihi — 2. Dönem (Bahar)',
        year: 1,
        href: `/ders-notlari/${uniSlug}/turk-hukuk-tarihi-donem-2`,
        ready: true,
        variantOf: 'turk-hukuk-tarihi',
      },
      {
        code: 'turk-hukuk-tarihi-yillik',
        title: 'Türk Hukuk Tarihi — Yıllık Tam Not',
        year: 1,
        href: `/ders-notlari/${uniSlug}/turk-hukuk-tarihi-yillik`,
        ready: true,
        variantOf: 'turk-hukuk-tarihi',
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
  `[turk-hukuk-tarihi-triple] unis=${activeUnis.length} notes=${newNotes.length} variants=${TURK_HUKUK_TARIHI_VARIANTS.join(',')}`
);
console.log(`[turk-hukuk-tarihi-triple] index notes now=${index.noteCount}`);
