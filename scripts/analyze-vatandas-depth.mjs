/**
 * Analyze vatandaş rehberi depth from lib/vatandas-rehberi/data.ts
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'lib/vatandas-rehberi/data.ts'), 'utf8');

// Extract array body between = [ and ];\n\nexport function getAll
const m = src.match(
  /export const VATANDAS_ARTICLES: VatandasArticle\[\] = (\[[\s\S]*?\n\]);\r?\n\r?\nexport function/
);
if (!m) {
  console.error('Could not parse VATANDAS_ARTICLES');
  process.exit(1);
}

const articles = JSON.parse(m[1]);

function wordCount(a) {
  const parts = [a.lead || ''];
  for (const s of a.sections || []) {
    parts.push(s.heading || '');
    parts.push(...(s.paragraphs || []));
    parts.push(...(s.bullets || []));
  }
  for (const st of a.steps || []) parts.push(st);
  for (const f of a.faq || []) {
    parts.push(f.q || '', f.a || '');
  }
  return parts.join(' ').split(/\s+/).filter(Boolean).length;
}

const byRole = {};
const byCat = {};
const rows = [];
for (const a of articles) {
  const role = a.role || 'standard';
  byRole[role] = (byRole[role] || 0) + 1;
  byCat[a.category] = (byCat[a.category] || 0) + 1;
  const w = wordCount(a);
  const sec = (a.sections || []).length;
  const faq = (a.faq || []).length;
  rows.push({
    slug: a.slug,
    role,
    w,
    sec,
    faq,
    lead: (a.lead || '').length,
    hasPillar: !!a.pillar,
    hasAngle: !!a.angle,
    canon: a.canonicalPath || '',
  });
}

rows.sort((x, y) => x.w - y.w);
const words = rows.map((r) => r.w);
const avg = Math.round(words.reduce((a, b) => a + b, 0) / words.length);
const p = (q) => words[Math.min(words.length - 1, Math.floor(words.length * q))];

console.log('=== VATANDAS REHBERI DEPTH ===');
console.log('total', articles.length);
console.log('byRole', byRole);
console.log('categories', Object.keys(byCat).length, byCat);
console.log(
  'words min',
  words[0],
  'p25',
  p(0.25),
  'p50',
  p(0.5),
  'avg',
  avg,
  'p75',
  p(0.75),
  'max',
  words[words.length - 1]
);
console.log(
  'buckets',
  {
    under250: rows.filter((r) => r.w < 250).length,
    w250_400: rows.filter((r) => r.w >= 250 && r.w < 400).length,
    w400_600: rows.filter((r) => r.w >= 400 && r.w < 600).length,
    w600_800: rows.filter((r) => r.w >= 600 && r.w < 800).length,
    over800: rows.filter((r) => r.w >= 800).length,
  }
);
console.log(
  'sections avg',
  (rows.reduce((a, r) => a + r.sec, 0) / rows.length).toFixed(1),
  'faq avg',
  (rows.reduce((a, r) => a + r.faq, 0) / rows.length).toFixed(1)
);

const pillars = rows.filter((r) => r.role === 'pillar');
const spokes = rows.filter((r) => r.role === 'spoke');
const bridges = rows.filter((r) => r.role === 'bridge');
const standards = rows.filter((r) => r.role === 'standard');

function summary(label, list) {
  if (!list.length) return console.log(label, 'none');
  const ws = list.map((r) => r.w).sort((a, b) => a - b);
  const a = Math.round(ws.reduce((x, y) => x + y, 0) / ws.length);
  console.log(
    label,
    'n=' + list.length,
    'words min/avg/max',
    ws[0],
    a,
    ws[ws.length - 1],
    'sec~',
    (list.reduce((x, r) => x + r.sec, 0) / list.length).toFixed(1)
  );
}
summary('PILLAR', pillars);
summary('SPOKE', spokes);
summary('BRIDGE', bridges);
summary('STANDARD', standards);

console.log('\n--- 15 shortest ---');
for (const r of rows.slice(0, 15)) {
  console.log(r.w, r.role, r.slug, 'sec=' + r.sec, 'faq=' + r.faq);
}
console.log('\n--- 10 longest ---');
for (const r of rows.slice(-10).reverse()) {
  console.log(r.w, r.role, r.slug, 'sec=' + r.sec);
}

// Lead uniqueness (spam detection)
const leads = articles.map((a) => (a.lead || '').slice(0, 80));
const leadFreq = {};
for (const l of leads) leadFreq[l] = (leadFreq[l] || 0) + 1;
const dupLeads = Object.entries(leadFreq)
  .filter(([, n]) => n > 2)
  .sort((a, b) => b[1] - a[1]);
console.log('\nduplicate lead prefixes (>2 same):', dupLeads.length);
if (dupLeads[0]) console.log(' top', dupLeads[0][1], dupLeads[0][0].slice(0, 60));

// pillars without deep sections
const thinPillars = pillars.filter((r) => r.w < 500 || r.sec < 4);
console.log('\nthin pillars (<500w or <4 sec):', thinPillars.length);
for (const r of thinPillars.slice(0, 20)) {
  console.log(' ', r.w, 'sec=' + r.sec, r.slug);
}
