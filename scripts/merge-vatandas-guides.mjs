/**
 * parts/*.json → all.json
 * Run: node scripts/merge-vatandas-guides.mjs
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'lib/vatandas-rehberi/guides');
const partsDir = join(dir, 'parts');
const meta = JSON.parse(readFileSync(join(dir, '_meta.json'), 'utf8'));

const merged = {};
if (existsSync(partsDir)) {
  for (const f of readdirSync(partsDir).filter((x) => x.endsWith('.json')).sort()) {
    const chunk = JSON.parse(readFileSync(join(partsDir, f), 'utf8'));
    Object.assign(merged, chunk);
  }
}

const missing = meta.items.filter((a) => !merged[a.slug]).map((a) => a.slug);
const weak = [];
for (const [slug, g] of Object.entries(merged)) {
  const steps = g.steps || [];
  if (steps.length < 4) weak.push(slug + ':few-steps');
  if (steps.some((s) => /konuya özgü olgular|doğru mercie yazılı başvuru, dava veya takip/i.test(s))) {
    weak.push(slug + ':generic');
  }
}

writeFileSync(join(dir, 'all.json'), JSON.stringify(merged));
console.log(
  JSON.stringify(
    {
      guides: Object.keys(merged).length,
      expected: meta.items.length,
      missing: missing.length,
      missingSample: missing.slice(0, 12),
      weak: weak.length,
      weakSample: weak.slice(0, 12),
    },
    null,
    2
  )
);
if (missing.length) process.exitCode = 2;
