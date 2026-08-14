/**
 * Vatandaş sayfalarındaki atölye / SEO iç konuşmasını siler.
 * Sayfada slug, niyet, pillar/spoke, yamyamlık anlatılmaz.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILE = join(ROOT, 'lib/vatandas-rehberi/data.ts');

const MARKER = 'export const VATANDAS_ARTICLES: VatandasArticle[] = ';

function fold(s) {
  return String(s || '')
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/ı/g, 'i')
    .toLowerCase();
}

const WORKSHOP =
  /slug|niyet ipucu|niyet ipuc|yamyam|pillar|spoke|hub[–-]spoke|canonical|\bseo\b|kumenin merkezi|yan niyet|dar tutulmu[ss]|url tek niyet|arama niyeti|arama motoru|anahtarlar[iı] bilerek|kapsamini sinirlar|kapsamını sınırlar|ayni genel anahtar|anahtar kelimelerle doldur|her url|tek niyete|geri link verir|kumesinin yan|spoke sayfa|bilerek dar|hem pillar hem|ranking sinyali|kral url|google.a kral|ic konusma|diye arayan kisi|diye arayan kişi|dar niyet|dilime ozel|dilime özel/;

const WORKSHOP_HEADING =
  /arama niyeti|bu sayfanin odagi|bu sayfanın odağı|ne zaman bu sayfa|ic linkler|iç linkler|karsilastirmali not|karşılaştırmalı not|canonical|pratik uyari ve canonical|hukuki cerceve ve arama|mini senaryo/;

const WORKSHOP_FAQ =
  /neden ayri sayfa|neden ayrı sayfa|ana rehberi okumadan|bu rehber baglayici|bu rehber bağlayıcı|bu metin baglayici|bu metin bağlayıcı|tek cumlelik formul|tek cümlelik formül|gercek dosya midir|gerçek dosya mıdır|tablo ve checklist|e-devlet veya uyap yeterli/;

function isWorkshop(s) {
  return typeof s === 'string' && WORKSHOP.test(fold(s));
}

function splitSentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function scrubText(text) {
  if (!text || typeof text !== 'string') return text;
  const kept = splitSentences(text).filter((s) => !isWorkshop(s) && !/^\/bilgi\/[a-z0-9-]+$/i.test(s));
  return kept.join(' ').trim();
}

function scrubList(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map(scrubText).filter((s) => s && s.length > 2 && !isWorkshop(s));
}

function scrubArticle(a) {
  const next = { ...a };
  next.lead = scrubText(a.lead || '');
  next.keyInsight = scrubText(a.keyInsight || '');
  if (isWorkshop(next.keyInsight)) next.keyInsight = '';

  next.sections = (a.sections || [])
    .filter((sec) => !WORKSHOP_HEADING.test(fold(sec.heading || '')) && !isWorkshop(sec.heading || ''))
    .map((sec) => ({
      heading: sec.heading,
      paragraphs: (sec.paragraphs || []).map(scrubText).filter((p) => p && p.length > 20 && !isWorkshop(p)),
      bullets: scrubList(sec.bullets || []),
    }))
    .filter((sec) => sec.paragraphs.length || (sec.bullets && sec.bullets.length));

  next.faq = (a.faq || [])
    .filter(
      (f) =>
        !WORKSHOP_FAQ.test(fold(f.q || '')) &&
        !WORKSHOP_FAQ.test(fold(f.a || '')) &&
        !isWorkshop(f.q) &&
        !isWorkshop(f.a)
    )
    .map((f) => ({ q: scrubText(f.q), a: scrubText(f.a) }))
    .filter((f) => f.q && f.a && !isWorkshop(f.q) && !isWorkshop(f.a));

  next.steps = scrubList(a.steps || []);
  next.checklist = scrubList(a.checklist || []);

  if (a.examples) {
    next.examples = a.examples
      .map((e) => ({
        ...e,
        title: scrubText(e.title),
        body: scrubText(e.body),
        takeaway: scrubText(e.takeaway),
      }))
      .filter((e) => e.body && !isWorkshop(e.body));
  }
  if (a.scenarios) {
    next.scenarios = a.scenarios
      .map((s) => ({
        ...s,
        title: scrubText(s.title),
        facts: scrubText(s.facts),
        outcome: scrubText(s.outcome),
      }))
      .filter((s) => s.facts && s.outcome && !isWorkshop(s.facts) && !isWorkshop(s.outcome));
  }

  if (!next.lead) {
    const first = (next.sections || []).flatMap((s) => s.paragraphs || []).find((p) => p.length > 60);
    if (first) next.lead = first;
  }

  return next;
}

const src = readFileSync(FILE, 'utf8');
const i = src.indexOf(MARKER);
if (i < 0) throw new Error('marker not found');
const start = i + MARKER.length;
const fn = src.indexOf('\nexport function', start);
let json = src.slice(start, fn).trim();
if (json.endsWith(';')) json = json.slice(0, -1);
const articles = JSON.parse(json);
function visibleBlob(a) {
  return [
    a.lead,
    a.keyInsight,
    ...(a.sections || []).flatMap((s) => [s.heading, ...(s.paragraphs || []), ...(s.bullets || [])]),
    ...(a.faq || []).flatMap((f) => [f.q, f.a]),
    ...(a.steps || []),
  ].join('\n');
}

const before = articles.filter((a) => WORKSHOP.test(fold(visibleBlob(a)))).length;
const cleaned = articles.map(scrubArticle);
const after = cleaned.filter((a) => WORKSHOP.test(fold(visibleBlob(a)))).length;

const prefix = src.slice(0, start);
const suffix = src.slice(fn);
writeFileSync(FILE, `${prefix}${JSON.stringify(cleaned, null, 2)};\n${suffix.replace(/^\n/, '')}`, 'utf8');

const sample = cleaned.find((a) => a.slug === 'mesafeli-satis-cayma');
const blob = fold(visibleBlob(sample));
console.log('scrubbed', articles.length, 'before', before, 'after', after);
console.log(
  'mesafeli still dirty?',
  /slug ve niyet|yamyam|niyet ipu|pillar|spoke|anahtarlar[iı] bilerek|ic linkler|dar niyet/.test(blob)
);
