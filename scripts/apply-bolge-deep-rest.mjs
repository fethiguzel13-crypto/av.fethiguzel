/**
 * Merge deep essays from bolge-deep-queue-rest.mjs into data.ts by slug.
 * Run: node scripts/apply-bolge-deep-rest.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEEP_REST } from './lib/bolge-deep-queue-rest.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dir, '../lib/bolge-makaleler/data.ts');

function loadMakaleler(src) {
  const re = /export const BOLGE_MAKALELER(?::[^=]+)?=\s*(\[[\s\S]*?\n\]);/;
  const m = src.match(re);
  if (!m) throw new Error('parse fail');
  const updatedMatch = src.match(/const UPDATED\s*=\s*['"]([^'"]+)['"]/);
  const UPDATED = updatedMatch ? updatedMatch[1] : '2026-08-05';
  return { arr: new Function('UPDATED', `return (${m[1]});`)(UPDATED), UPDATED, re, m };
}

function serialize(obj, indent = 2) {
  // JSON then convert to TS-ish with single quotes for simple strings — use JSON for safety
  return JSON.stringify(obj, null, indent)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, "'")
    .replace(/'UPDATED'/g, 'UPDATED');
}

const src = readFileSync(dataPath, 'utf8');
const { arr, UPDATED } = loadMakaleler(src);
const byDeep = Object.fromEntries(DEEP_REST.map((d) => [d.slug, d]));

let n = 0;
const next = arr.map((m) => {
  if (byDeep[m.slug]) {
    n++;
    const d = { ...byDeep[m.slug], updated: UPDATED };
    // restore UPDATED token for file write via marker
    return d;
  }
  return m;
});

// Rebuild file
const header = `import type { BolgeMakale } from './types';

const UPDATED = '${UPDATED}';

/**
 * Yerleşim ruhu + tarih + hukuki iz — deneme formatı.
 * “X avukat / X avukatı” SEO yok; soft CTA yok; fotoğraflı uzun okuma.
 */
export const BOLGE_MAKALELER: BolgeMakale[] = `;

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

const body = toTs(next, 0);
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

writeFileSync(dataPath, header + body + footer, 'utf8');
console.log(`merged ${n} deep essays into data.ts; total ${next.length}`);
