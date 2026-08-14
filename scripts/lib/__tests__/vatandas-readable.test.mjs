import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const src = readFileSync(join(root, 'lib/vatandas-rehberi/data.ts'), 'utf8');
const MARKER = 'export const VATANDAS_ARTICLES: VatandasArticle[] = ';
const start = src.indexOf(MARKER);
assert.ok(start >= 0, 'VATANDAS_ARTICLES marker');
const fn = src.indexOf('\nexport function', start);
assert.ok(fn > start, 'VATANDAS_ARTICLES end');
let json = src.slice(start + MARKER.length, fn).trim();
if (json.endsWith(';')) json = json.slice(0, -1);
const ARTICLES = JSON.parse(json);
const ALL = JSON.parse(readFileSync(join(root, 'lib/vatandas-rehberi/guides/all.json'), 'utf8'));
const { inferGuide } = await import(
  pathToFileURL(join(root, 'lib/vatandas-rehberi/guides/infer.ts')).href
);

function stepsOf(a) {
  return (ALL[a.slug] || inferGuide(a)).steps;
}

test('kıdem: somut adım ve belge, şablon yok', () => {
  const g = ALL['kidem-tazminati-nasil-alinir'];
  assert.ok(g.steps.some((s) => /arabuluculu/i.test(s)));
  assert.ok(g.docs.includes('SGK hizmet dökümü'));
  assert.ok(g.notes.some((s) => s.heading === 'Şartlar'));
});

test('emlak: taksit ve muafiyet anlatılır', () => {
  const g = ALL['emlak-vergisi-nedir'];
  assert.ok(g.steps.some((s) => /taksit/i.test(s)));
  assert.ok(g.docs.includes('tapu'));
});

test('ödeme emri: 7 gün korunur', () => {
  const g = ALL['odeme-emrine-itiraz'];
  assert.ok(g.steps.some((s) => /7 gün/i.test(s)));
});

test('554 rehberin hepsinde somut adım var', () => {
  let generic = 0;
  let short = 0;
  for (const a of ARTICLES) {
    const steps = stepsOf(a);
    if (steps.length < 4) short++;
    if (steps.some((s) => /konuya özgü olgular/i.test(s))) generic++;
  }
  assert.equal(short, 0);
  assert.equal(generic, 0);
});

function fold(s) {
  return String(s || '')
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/ı/g, 'i')
    .toLowerCase();
}

function visible(a) {
  return [
    a.lead,
    a.keyInsight,
    ...(a.sections || []).flatMap((s) => [s.heading, ...(s.paragraphs || []), ...(s.bullets || [])]),
    ...(a.faq || []).flatMap((f) => [f.q, f.a]),
    ...(a.steps || []),
  ].join('\n');
}

const ATELIER =
  /slug ve niyet|niyet ipuc|yamyam|pillar|spoke|anahtarlar[iı] bilerek|arama motorunda|kapsamini sinirlar|kapsamını sınırlar/;

test('mesafeli satış: atölye/SEO iç konuşması yok', () => {
  const a = ARTICLES.find((x) => x.slug === 'mesafeli-satis-cayma');
  assert.ok(a);
  const blob = fold(visible(a));
  assert.equal(ATELIER.test(blob), false, visible(a).slice(0, 400));
});

test('hiçbir rehberde slug/yamyam/pillar-spoke atölyesi yok', () => {
  const dirty = ARTICLES.filter((a) => ATELIER.test(fold(visible(a)))).map((a) => a.slug);
  assert.deepEqual(dirty, []);
});
