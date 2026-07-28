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

/** Minimum words by role — fail build if any page below (profesyonel katman sonrası) */
const MIN = {
  pillar: 1500,
  spoke: 1100,
  bridge: 450,
  standard: 1200,
};

function wordCount(a) {
  const parts = [a.lead || '', a.keyInsight || ''];
  for (const s of a.sections || []) {
    parts.push(s.heading || '');
    parts.push(...(s.paragraphs || []));
    parts.push(...(s.bullets || []));
  }
  parts.push(...(a.steps || []));
  parts.push(...(a.checklist || []));
  for (const f of a.faq || []) {
    parts.push(f.q || '', f.a || '');
  }
  for (const e of a.examples || []) {
    parts.push(e.title || '', e.body || '', e.takeaway || '');
  }
  for (const s of a.scenarios || []) {
    parts.push(s.title || '', s.facts || '', s.outcome || '');
  }
  if (a.table) {
    parts.push(a.table.caption || '');
    parts.push(...(a.table.headers || []));
    for (const row of a.table.rows || []) parts.push(...row);
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

// Yapısal zorunluluklar (hap bilgi + adımlar + görsel iskelet)
const structureFails = [];
for (const a of articles) {
  const problems = [];
  if (!a.keyInsight || String(a.keyInsight).length < 12) problems.push('no-keyInsight');
  if (!a.steps || a.steps.length < 4) problems.push('steps<4');
  if (!a.examples || a.examples.length < 1) problems.push('no-examples');
  if (!a.scenarios || a.scenarios.length < 1) problems.push('no-scenarios');
  if (!a.table || !a.table.rows?.length) problems.push('no-table');
  if (!a.checklist || a.checklist.length < 4) problems.push('no-checklist');
  if (!a.visual) problems.push('no-visual');
  if (!a.lead || String(a.lead).length < 40) problems.push('short-lead');
  // yan yana (1)(2)(3) akış yasağı
  for (const s of a.sections || []) {
    for (const p of s.paragraphs || []) {
      if (/\(\s*1\s*\).{0,40}\(\s*2\s*\).{0,40}\(\s*3\s*\)/.test(p)) {
        problems.push('inline-numbered-flow');
        break;
      }
    }
  }
  if (problems.length) {
    structureFails.push({ slug: a.slug, role: a.role || 'standard', problems });
  }
}

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
  failCount: fail.length + structureFails.length,
  structureFailCount: structureFails.length,
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
  structureFailures: structureFails.slice(0, 50),
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
console.log('structureFailCount', structureFails.length);
console.log('inventory', latestCsv);

if (fail.length || structureFails.length) {
  if (fail.length) {
    console.error('DEPTH GATE FAILED — thin pages:');
    for (const f of fail.slice(0, 40)) {
      console.error(`  ${f.words}/${f.min} ${f.role} ${f.slug}`);
    }
  }
  if (structureFails.length) {
    console.error('STRUCTURE GATE FAILED — missing hap/steps/visual:');
    for (const f of structureFails.slice(0, 40)) {
      console.error(`  ${f.role} ${f.slug}: ${f.problems.join(', ')}`);
    }
  }
  process.exit(1);
}

console.log('DEPTH+STRUCTURE GATE OK — all', rows.length, 'pages complete');
process.exit(0);
