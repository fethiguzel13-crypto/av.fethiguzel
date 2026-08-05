/**
 * Merge longform batch A/B/C into BOLGE_MAKALELER (keeps photos/graphics/related).
 * Recomputes okumaDk from prose words / 120 (min 16).
 * Run: node scripts/apply-bolge-longform.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const dataPath = join(root, 'lib/bolge-makaleler/data.ts');

async function loadBatch(name, exp) {
  const p = join(__dir, 'lib', name);
  if (!existsSync(p)) throw new Error(`missing ${p}`);
  const mod = await import(`file:///${p.replace(/\\/g, '/')}`);
  return mod[exp];
}

function loadMakaleler(src) {
  const re = /export const BOLGE_MAKALELER(?::[^=]+)?=\s*(\[[\s\S]*?\n\]);/;
  const m = src.match(re);
  if (!m) throw new Error('parse fail');
  const updatedMatch = src.match(/const UPDATED\s*=\s*['"]([^'"]+)['"]/);
  const UPDATED = updatedMatch ? updatedMatch[1] : '2026-08-05';
  return { arr: new Function('UPDATED', `return (${m[1]});`)(UPDATED), UPDATED };
}

function proseWords(m) {
  const body = [
    m.lead,
    ...(m.sections || []).flatMap((s) => [s.heading, ...(s.paragraphs || []), ...(s.bullets || []), s.callout?.body || '']),
    ...(m.faq || []).flatMap((f) => [f.q, f.a]),
  ].join(' ');
  return body.split(/\s+/).filter(Boolean).length;
}

function toTs(value, depth = 0) {
  const pad = '  '.repeat(depth);
  const pad1 = '  '.repeat(depth + 1);
  if (value === null) return 'null';
  if (typeof value === 'string') {
    if (value === 'UPDATED_TOKEN') return 'UPDATED';
    return JSON.stringify(value);
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    return `[\n${value.map((v) => pad1 + toTs(v, depth + 1)).join(',\n')}\n${pad}]`;
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    return `{\n${keys
      .map((k) => {
        let v = value[k];
        if (k === 'updated') v = 'UPDATED_TOKEN';
        return `${pad1}${k}: ${toTs(v, depth + 1)}`;
      })
      .join(',\n')}\n${pad}}`;
  }
  return 'undefined';
}

const BATCH_A = await loadBatch('longform-batch-a.mjs', 'BATCH_A');
const BATCH_B = await loadBatch('longform-batch-b.mjs', 'BATCH_B');
const BATCH_C = await loadBatch('longform-batch-c.mjs', 'BATCH_C');
const packs = { ...BATCH_A, ...BATCH_B, ...BATCH_C };

const src = readFileSync(dataPath, 'utf8');
const { arr, UPDATED } = loadMakaleler(src);

const next = arr.map((m) => {
  const pack = packs[m.slug];
  if (!pack) {
    console.warn('no pack for', m.slug);
    return m;
  }
  // preserve photos on sections if pack section has no photo but old had matching heading — skip
  const merged = {
    ...m,
    lead: pack.lead,
    sections: pack.sections,
    faq: pack.faq,
    updated: UPDATED,
  };
  // keep first section photo from old if pack omitted photos
  const oldPhoto = (m.sections || []).find((s) => s.photo)?.photo;
  if (oldPhoto && merged.sections[2] && !merged.sections[2].photo) {
    merged.sections[2] = { ...merged.sections[2], photo: oldPhoto };
  }
  const w = proseWords(merged);
  // Honest minutes: ~125 words/min careful longform; keep minWords (okuma*120) satisfied
  let dk = Math.floor(w / 125);
  if (dk < 16) dk = 16;
  if (dk > 22) dk = 22;
  // If words can't support claimed dk under verifier (okuma*120), step down
  while (dk > 16 && w < dk * 120) dk -= 1;
  merged.okumaDk = dk;
  console.log(m.slug, 'words', w, 'okumaDk', merged.okumaDk, 'sections', merged.sections.length);
  return merged;
});

const header = `import type { BolgeMakale } from './types';

const UPDATED = '${UPDATED}';

/**
 * Yerleşim ruhu + tarih + hukuki iz — deneme formatı.
 * “X avukat / X avukatı” SEO yok; soft CTA yok; fotoğraflı uzun okuma.
 */
export const BOLGE_MAKALELER: BolgeMakale[] = `;

const footer = `;

export function getBolgeMakale(slug: string): BolgeMakale | undefined {
  return BOLGE_MAKALELER.find((m) => m.slug === slug);
}

export function getAllBolgeMakaleSlugs(): string[] {
  return BOLGE_MAKALELER.map((m) => m.slug);
}

export function getMakalelerByYerlesim(yerlesim: string): BolgeMakale[] {
  return BOLGE_MAKALELER.filter((m) => m.yerlesim === yerlesim);
}

export function getYerlesimList(): string[] {
  return [...new Set(BOLGE_MAKALELER.map((m) => m.yerlesim))];
}
`;

writeFileSync(dataPath, header + toTs(next, 0) + footer, 'utf8');
console.log('wrote', dataPath, 'n=', next.length, 'packs=', Object.keys(packs).length);
