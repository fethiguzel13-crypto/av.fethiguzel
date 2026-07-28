/**
 * Hard gate: EVERY /bilgi page must meet depth thresholds.
 * Exit 1 if any page is thin. Writes full inventory CSV + JSON.
 *
 * Run: node scripts/vatandas-depth-gate.mjs
 * Also invoked at end of generate-vatandas-rehberi.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(root, 'lib/vatandas-rehberi/data.ts');
const OUT_DIR = join(root, 'logs/maintenance');

/** Minimum words by role — fail build if any page below */
const MIN = {
  pillar: 1000,
  spoke: 700,
  bridge: 250,
  standard: 650,
};

function wordCount(a) {
  const parts = [a.lead || ''];
  for (const s of a.sections || []) {
    parts.push(s.heading || '');
    parts.push(...(s.paragraphs || []));
    parts.push(...(s.bullets || []));
  }
  parts.push(...(a.steps || []));
  for (const f of a.faq || []) {
    parts.push(f.q || '', f.a || '');
  }
  return parts.join(' ').split(/\s+/).filter(Boolean).length;
}

function loadArticles() {
  const src = readFileSync(DATA, 'utf8');
  const m = src.match(
    /export const VATANDAS_ARTICLES: VatandasArticle\[\] = (\[[\s\S]*?\n\]);\r?\n\r?\nexport function/
  );
  if (!m) throw new Error('Cannot parse VATANDAS_ARTICLES from data.ts');
  return JSON.parse(m[1]);
}

const articles = loadArticles();
const rows = articles.map((a) => {
  const role = a.role || 'standard';
  const w = wordCount(a);
  const min = MIN[role] ?? MIN.standard;
  const ok = w >= min;
  return {
    slug: a.slug,
    role,
    words: w,
    sections: (a.sections || []).length,
    faq: (a.faq || []).length,
    min,
    ok,
    title: a.title || '',
  };
});

const fail = rows.filter((r) => !r.ok);
const byRole = {};
for (const r of rows) {
  if (!byRole[r.role]) byRole[r.role] = { n: 0, minW: Infinity, maxW: 0, sum: 0, fail: 0 };
  const b = byRole[r.role];
  b.n++;
  b.sum += r.words;
  b.minW = Math.min(b.minW, r.words);
  b.maxW = Math.max(b.maxW, r.words);
  if (!r.ok) b.fail++;
}

mkdirSync(OUT_DIR, { recursive: true });
const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
const jsonPath = join(OUT_DIR, `vatandas-depth-inventory-${stamp}.json`);
const csvPath = join(OUT_DIR, `vatandas-depth-inventory-${stamp}.csv`);
const latestJson = join(OUT_DIR, 'vatandas-depth-inventory-latest.json');
const latestCsv = join(OUT_DIR, 'vatandas-depth-inventory-latest.csv');

const report = {
  generatedAt: new Date().toISOString(),
  total: rows.length,
  thresholds: MIN,
  failCount: fail.length,
  byRole: Object.fromEntries(
    Object.entries(byRole).map(([k, v]) => [
      k,
      {
        n: v.n,
        avg: Math.round(v.sum / v.n),
        min: v.minW,
        max: v.maxW,
        fail: v.fail,
      },
    ])
  ),
  failures: fail.map((r) => ({
    slug: r.slug,
    role: r.role,
    words: r.words,
    min: r.min,
  })),
  all: rows,
};

const csv =
  'slug,role,words,sections,faq,min,ok,title\n' +
  rows
    .map(
      (r) =>
        `${r.slug},${r.role},${r.words},${r.sections},${r.faq},${r.min},${r.ok},"${String(r.title).replace(/"/g, '""')}"`
    )
    .join('\n');

writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');
writeFileSync(csvPath, csv, 'utf8');
writeFileSync(latestJson, JSON.stringify(report, null, 2), 'utf8');
writeFileSync(latestCsv, csv, 'utf8');

console.log('=== VATANDAS DEPTH GATE ===');
console.log('total', rows.length);
console.log('thresholds', MIN);
for (const [role, v] of Object.entries(report.byRole)) {
  console.log(
    `  ${role}: n=${v.n} min=${v.min} avg=${v.avg} max=${v.max} fail=${v.fail}`
  );
}
console.log('failCount', fail.length);
console.log('inventory', latestCsv);

if (fail.length) {
  console.error('DEPTH GATE FAILED — thin pages:');
  for (const f of fail.slice(0, 40)) {
    console.error(`  ${f.words}/${f.min} ${f.role} ${f.slug}`);
  }
  if (fail.length > 40) console.error(`  ... +${fail.length - 40} more`);
  process.exit(1);
}

console.log('DEPTH GATE OK — all', rows.length, 'pages meet thresholds');
process.exit(0);
