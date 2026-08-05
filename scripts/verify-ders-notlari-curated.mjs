/**
 * Gating checks for ders-notlari cleanup + AÜHF curated notes.
 * Run: node scripts/verify-ders-notlari-curated.mjs
 * Exit 0 = pass. Writes optional evidence path via env VERIFY_OUT.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const notesDir = join(root, 'lib/ders-notlari/generated/notes');
const indexPath = join(root, 'lib/ders-notlari/generated/index.json');
const uniPath = join(root, 'lib/ders-notlari/universiteler.ts');
const viewPath = join(root, 'components/DersNotuView.tsx');
const researchPath = join(root, 'docs/ders-notlari/research/ankara.md');

const failures = [];
const lines = [];

function ok(msg) {
  lines.push(`OK  ${msg}`);
}
function fail(msg) {
  failures.push(msg);
  lines.push(`FAIL ${msg}`);
}

// —— 1) Active list ——
const uniSrc = readFileSync(uniPath, 'utf8');
const re = /export const LAW_UNIVERSITIES(?::[^=]+)?=\s*(\[[\s\S]*?\n\]);/;
const m = uniSrc.match(re);
if (!m) fail('cannot parse LAW_UNIVERSITIES');
const unis = m ? new Function(`return (${m[1]});`)() : [];
const active = unis.filter((u) => u.active);
const bySlug = Object.fromEntries(unis.map((u) => [u.slug, u]));

if (active.length < 70 || active.length > 100) {
  fail(`active count out of band: ${active.length}`);
} else ok(`active universities = ${active.length}`);

if (bySlug.agri?.active) fail('agri must not be active');
else ok('agri inactive or absent from active set');

if (bySlug['van-yyu']?.active) fail('van-yyu must not be active');
else ok('van-yyu inactive');

const idx = JSON.parse(readFileSync(indexPath, 'utf8'));
const idxSlugs = new Set(idx.universities.map((u) => u.slug));
if (idxSlugs.has('agri') || idxSlugs.has('van-yyu')) {
  fail('index still lists agri or van-yyu');
} else ok(`index universityCount=${idx.universityCount} (no agri/van)`);

// —— 2) Curated AÜHF notes ——
const curatedPaths = [
  join(notesDir, 'ankara__borclar-genel.json'),
  join(notesDir, 'ankara__hukuka-giris.json'),
];

const templateSamplePath = join(notesDir, 'afyon__borclar-genel.json');
let templateLead = '';
if (existsSync(templateSamplePath)) {
  templateLead = JSON.parse(readFileSync(templateSamplePath, 'utf8')).lead || '';
}

for (const p of curatedPaths) {
  if (!existsSync(p)) {
    fail(`missing ${p}`);
    continue;
  }
  const n = JSON.parse(readFileSync(p, 'utf8'));
  const name = p.split(/[/\\]/).pop();
  if (n.qualityTier !== 'curated') fail(`${name} qualityTier !== curated (${n.qualityTier})`);
  else ok(`${name} qualityTier=curated`);

  if (!Array.isArray(n.sections) || n.sections.length < 8) {
    fail(`${name} sections < 8`);
  } else ok(`${name} sections=${n.sections.length}`);

  if (!Array.isArray(n.examples) || n.examples.length < 3) {
    fail(`${name} examples < 3`);
  } else ok(`${name} examples=${n.examples.length}`);

  if (!Array.isArray(n.sources) || n.sources.length < 1) {
    fail(`${name} sources empty`);
  } else ok(`${name} sources=${n.sources.length}`);

  // Not a trivial shortName swap of template: lead must mention AÜHF/Cebeci/Ankara Üniversitesi specifics
  const lead = (n.lead || '') + (n.sections?.[0]?.paragraphs?.join(' ') || '');
  const facultyMarkers = /Cebeci|AÜHF|Ankara Üniversitesi|açık ders|HKZ|Hukuk Başlangıcı/i;
  if (!facultyMarkers.test(lead)) fail(`${name} missing faculty-specific markers`);
  else ok(`${name} faculty-specific prose markers present`);

  if (templateLead && lead === templateLead) fail(`${name} lead identical to template sample`);
  if (templateLead && n.lead && n.lead.includes('AİÇÜ')) fail(`${name} still has wrong uni token`);

  // sources must be public http(s)
  for (const s of n.sources) {
    if (!/^https?:\/\//.test(s.url)) fail(`${name} bad source url ${s.url}`);
  }
}

// —— 3) Research doc ——
if (!existsSync(researchPath)) fail('missing research/ankara.md');
else {
  const r = readFileSync(researchPath, 'utf8');
  if (!/acikders\.ankara\.edu\.tr/.test(r)) fail('research missing acikders URL');
  else ok('research/ankara.md has acikders');
  if (!/law\.ankara\.edu\.tr/.test(r)) fail('research missing law.ankara.edu.tr');
  else ok('research/ankara.md has law.ankara.edu.tr');
  if (!/borclar-genel|hukuka-giris/.test(r)) fail('research missing curated course map');
  else ok('research lists curated courses');
}

// —— 4) UI tiers ——
const view = readFileSync(viewPath, 'utf8');
if (!/qualityTier === 'curated'/.test(view)) fail('DersNotuView missing curated branch');
else ok('DersNotuView has curated branch');
if (!/taslak iskelet/.test(view)) fail('DersNotuView missing taslak label');
else ok('DersNotuView has taslak iskelet label');
// Draft warning must not apply to curated
if (!/qualityTier === 'template'/.test(view) || !/premium/.test(view)) {
  fail('draft banner conditions incomplete');
} else ok('draft banner tied to non-curated tiers');
if (!/note\.sources/.test(view)) fail('sources UI missing');
else ok('sources block present in DersNotuView');

// —— evidence dump ——
const evidence = [
  ...lines,
  '',
  `active=${active.length}`,
  `index.universityCount=${idx.universityCount}`,
  `index.noteCount=${idx.noteCount}`,
  `curated=${curatedPaths.map((p) => p.split(/[/\\]/).pop()).join(', ')}`,
  `noteFiles=${existsSync(notesDir) ? readdirSync(notesDir).length : 0}`,
  `failures=${failures.length}`,
].join('\n');

const outEnv = process.env.VERIFY_OUT;
if (outEnv) {
  writeFileSync(outEnv, evidence + '\n', 'utf8');
  lines.push(`wrote evidence ${outEnv}`);
}

console.log(evidence);
if (failures.length) {
  console.error(`\n${failures.length} failure(s)`);
  process.exit(1);
}
console.log('\nALL GATES PASSED');
process.exit(0);
