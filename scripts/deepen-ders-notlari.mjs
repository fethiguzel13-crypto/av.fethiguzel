/**
 * Ders notlarını tek hatlı anlatıya çevirir.
 * İkişer üniversite, acele etmeden.
 *
 *   node scripts/deepen-ders-notlari.mjs --unis=ankara,istanbul
 *   node scripts/deepen-ders-notlari.mjs --all --pause=45
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { composeLecture } from './lib/ders-lecture-compose.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const NOTES = join(root, 'lib/ders-notlari/generated/notes');

function arg(name, def = '') {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : def;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadUnis() {
  const src = readFileSync(join(root, 'lib/ders-notlari/universiteler.ts'), 'utf8');
  const m = src.match(/export const LAW_UNIVERSITIES(?::[^=]+)?=\s*(\[[\s\S]*?\n\]);/);
  const U = new Function(`return (${m[1]});`)();
  return U.filter((u) => u.active).sort(
    (a, b) => a.priority - b.priority || a.slug.localeCompare(b.slug)
  );
}

function filesForUni(slug) {
  return readdirSync(NOTES).filter((f) => f.startsWith(`${slug}__`) && f.endsWith('.json'));
}

function processUni(uni) {
  const files = filesForUni(uni.slug);
  let n = 0;
  let words = 0;
  for (const f of files) {
    const path = join(NOTES, f);
    let note;
    try {
      note = JSON.parse(readFileSync(path, 'utf8'));
    } catch {
      continue;
    }
    const next = composeLecture(note, uni);
    writeFileSync(path, JSON.stringify(next));
    n += 1;
    words += (next.lead || '').split(/\s+/).length;
    for (const s of next.sections || []) {
      words += (s.paragraphs || []).join(' ').split(/\s+/).filter(Boolean).length;
    }
  }
  return { n, words };
}

const pauseSec = Number(arg('pause', '0')) || 0;
const all = process.argv.includes('--all');
const uniArg = arg('unis');
const unis = loadUnis();
const wanted = all
  ? unis
  : uniArg
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((slug) => unis.find((u) => u.slug === slug) || { slug, shortName: slug, city: '' });

if (!wanted.length) {
  console.error('Usage: --unis=a,b  or  --all --pause=45');
  process.exit(1);
}

const pairs = [];
for (let i = 0; i < wanted.length; i += 2) pairs.push(wanted.slice(i, i + 2));

for (let i = 0; i < pairs.length; i++) {
  const pair = pairs[i];
  const t0 = Date.now();
  const bits = pair.map((u) => {
    const { n, words } = processUni(u);
    return `${u.slug}:${n}n/~${Math.round(words / Math.max(n, 1))}w`;
  });
  console.log(`[${i + 1}/${pairs.length}] ${bits.join(' + ')}  (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  if (pauseSec && i < pairs.length - 1) {
    console.log(`  mola ${pauseSec}s`);
    await sleep(pauseSec * 1000);
  }
}

console.log('DONE', wanted.length, 'üniversite');
