/**
 * Clean rebuild: longform batches (strip pad) + unique expansions once + honest okumaDk.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { UNIQUE_EXPANSIONS } from './lib/bolge-unique-expansions.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const dataPath = join(root, 'lib/bolge-makaleler/data.ts');

const PAD_MARKERS = [
  'Bu coğrafyada anlatı ile sicil arasındaki mesafe',
  'hattında bu sıra bozulduğunda tartışma büyür',
  'Bu gözlem van',
  'Bu gözlem ahlat',
  'Genel bilgilendirme sınırında kalmak, sonuç vaadi üretmemek için de bu ayrımı korumak gerekir',
];

function isPad(p) {
  return typeof p === 'string' && PAD_MARKERS.some((m) => p.includes(m));
}

function finger(p) {
  return p
    .toLocaleLowerCase('tr')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter((w) => w.length > 3)
    .join(' ');
}

function stripPadsFromSections(sections) {
  const globalSeen = new Set();
  return (sections || [])
    .map((s) => {
      const paragraphs = [];
      for (const p of s.paragraphs || []) {
        if (isPad(p)) continue;
        const f = finger(p);
        if (globalSeen.has(f)) continue; // drop near-dup across essay
        globalSeen.add(f);
        paragraphs.push(p);
      }
      return { ...s, paragraphs };
    })
    .filter((s) => (s.paragraphs || []).length > 0);
}

function uniqueWordCount(m) {
  const paras = [
    m.lead,
    ...(m.sections || []).flatMap((s) => [...(s.paragraphs || []), ...(s.bullets || []), s.callout?.body].filter(Boolean)),
    ...(m.faq || []).flatMap((f) => [f.q, f.a]),
  ].filter(Boolean);
  const seen = new Set();
  let n = 0;
  for (const p of paras) {
    const key = p
      .toLocaleLowerCase('tr')
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (seen.has(key)) continue;
    seen.add(key);
    n += p.split(/\s+/).filter(Boolean).length;
  }
  return n;
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
    return `{\n${Object.keys(value)
      .map((k) => {
        let v = value[k];
        if (k === 'updated') v = 'UPDATED_TOKEN';
        return `${pad1}${k}: ${toTs(v, depth + 1)}`;
      })
      .join(',\n')}\n${pad}}`;
  }
  return 'undefined';
}

function loadCurrentMeta() {
  const src = readFileSync(dataPath, 'utf8');
  const re = /export const BOLGE_MAKALELER(?::[^=]+)?=\s*(\[[\s\S]*?\n\]);/;
  const m = src.match(re);
  const updatedMatch = src.match(/const UPDATED\s*=\s*['"]([^'"]+)['"]/);
  const UPDATED = updatedMatch ? updatedMatch[1] : '2026-08-05';
  const arr = new Function('UPDATED', `return (${m[1]});`)(UPDATED);
  // meta only: slug, photos, graphics, related, theme, etc.
  return { UPDATED, meta: Object.fromEntries(arr.map((x) => [x.slug, x])) };
}

const { UPDATED, meta } = loadCurrentMeta();
const A = (await import(pathToFileURL(join(__dir, 'lib/longform-batch-a.mjs')).href + `?t=${Date.now()}`)).BATCH_A;
const B = (await import(pathToFileURL(join(__dir, 'lib/longform-batch-b.mjs')).href + `?t=${Date.now()}`)).BATCH_B;
const C = (await import(pathToFileURL(join(__dir, 'lib/longform-batch-c.mjs')).href + `?t=${Date.now()}`)).BATCH_C;
const packs = { ...A, ...B, ...C };

const QUEUE = Object.keys(meta);
const next = [];

for (const slug of QUEUE) {
  const baseMeta = meta[slug];
  const pack = packs[slug];
  if (!pack) throw new Error('missing pack ' + slug);

  let lead = pack.lead;
  let sections = stripPadsFromSections(pack.sections);
  let faq = [...(pack.faq || [])];

  const exp = UNIQUE_EXPANSIONS[slug];
  if (exp) {
    if (exp.leadAppend) lead = `${lead}\n\n${exp.leadAppend}`;
    for (const [si, paras] of Object.entries(exp.sectionParas || {})) {
      const i = Number(si);
      if (sections[i]) {
        sections[i] = {
          ...sections[i],
          paragraphs: [...sections[i].paragraphs, ...paras],
        };
      }
    }
    if (exp.extraSections?.length) sections = [...sections, ...exp.extraSections];
    if (exp.extraFaq?.length) faq = [...faq, ...exp.extraFaq];
  }

  // restore photos from meta on a mid section if pack lost them
  const oldPhoto = (baseMeta.sections || []).find((s) => s.photo)?.photo;
  if (oldPhoto && sections[2] && !sections[2].photo) {
    sections[2] = { ...sections[2], photo: oldPhoto };
  }

  const m = {
    ...baseMeta,
    lead,
    sections,
    faq,
    // keep hero/photos/graphics/related/theme from meta (stable)
    heroPhoto: baseMeta.heroPhoto,
    photos: baseMeta.photos,
    graphics: baseMeta.graphics,
    related: baseMeta.related,
    updated: UPDATED,
  };

  const w = uniqueWordCount(m);
  let dk = Math.floor(w / 120);
  if (dk < 16) dk = 16;
  if (dk > 20) dk = 20;
  while (dk > 16 && w < dk * 120) dk -= 1;
  m.okumaDk = dk;

  console.log(slug, 'secs', sections.length, 'unique', w, 'okumaDk', dk);
  next.push(m);
}

const header = `import type { BolgeMakale } from './types';

const UPDATED = '${UPDATED}';

/**
 * Yerleşim ruhu + tarih + hukuki iz — deneme formatı.
 * Soft-CTA yok; pad/boilerplate yok; unique prose.
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
console.log('wrote clean rebuild', next.length);
