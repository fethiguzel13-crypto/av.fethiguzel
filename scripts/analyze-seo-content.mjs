/**
 * Deep SEO / content quality analysis for vatandaş rehberi + site surface.
 * Run: node scripts/analyze-seo-content.mjs
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');

// Dynamic import of generated data via path rewrite — use require on compiled? It's TS.
// Read data.ts as text and eval JSON portion instead.
const dataTs = readFileSync(join(root, 'lib/vatandas-rehberi/data.ts'), 'utf8');
const start = dataTs.indexOf('[');
const endMarker = /\]\r?\n\r?\nexport function getAllVatandasSlugs/;
const endMatch = dataTs.slice(start).match(endMarker);
if (start < 0 || !endMatch) {
  console.error('Could not parse VATANDAS_ARTICLES from data.ts');
  process.exit(1);
}
const json = dataTs.slice(start, start + endMatch.index + 1);
const ARTICLES = JSON.parse(json);

const report = [];
const log = (...a) => {
  const line = a.map(String).join(' ');
  report.push(line);
  console.log(line);
};

log('# SEO / İçerik Derin Analiz Raporu');
log('Tarih:', new Date().toISOString());
log('Toplam /bilgi sayfası:', ARTICLES.length);
log('');

// --- 1. Template spam detection ---
log('## 1. Şablon / ince içerik riski');
const spamPhrase = 'Türkiye’de arama motorlarında';
const spamCount = ARTICLES.filter((a) => a.lead.includes(spamPhrase)).length;
log('- Lead içinde şablon cümle sayısı:', spamCount, `(${((spamCount / ARTICLES.length) * 100).toFixed(1)}%)`);

const leadTail = new Map();
for (const a of ARTICLES) {
  const tail = a.lead.slice(100, 280);
  leadTail.set(tail, (leadTail.get(tail) || 0) + 1);
}
const maxTail = Math.max(...leadTail.values());
log('- Aynı lead kuyruğu max tekrar:', maxTail);

const section0 = new Map();
for (const a of ARTICLES) {
  const p = (a.sections[0]?.paragraphs[0] || '')
    .replace(/«[^»]+»/g, 'X')
    .replace(a.h1, 'H1')
    .slice(0, 90);
  section0.set(p, (section0.get(p) || 0) + 1);
}
log('- Section0 paragraf şablon max tekrar:', Math.max(...section0.values()));

const faq0 = new Map();
for (const a of ARTICLES) {
  const q = (a.faq[0]?.q || '').replace(/«[^»]+»/g, 'X');
  faq0.set(q, (faq0.get(q) || 0) + 1);
}
log('- FAQ0 şablon max tekrar:', Math.max(...faq0.values()));
log(
  '- «avukat zorunlu mu» içeren FAQ sayısı:',
  ARTICLES.filter((a) => a.faq.some((f) => /avukat zorunlu/i.test(f.q))).length
);

// word counts
const words = ARTICLES.map((a) => {
  const text = [
    a.lead,
    ...a.sections.flatMap((s) => s.paragraphs),
    ...(a.steps || []),
    ...a.faq.map((f) => f.q + ' ' + f.a),
  ].join(' ');
  return { slug: a.slug, n: text.split(/\s+/).filter(Boolean).length, cat: a.category };
});
const avg = words.reduce((s, w) => s + w.n, 0) / words.length;
log('- Ortalama kelime:', Math.round(avg));
log('- Min/Max kelime:', Math.min(...words.map((w) => w.n)), Math.max(...words.map((w) => w.n)));
log('- <450 kelime:', words.filter((w) => w.n < 450).length);
log('- 450–700:', words.filter((w) => w.n >= 450 && w.n < 700).length);
log('- ≥700:', words.filter((w) => w.n >= 700).length);

// substance: kanun codes
const codeRe = /TBK|TMK|TCK|HMK|İİK|CMK|4857|6098|6100|5237|6502|6698|İYUK|2577|KVKK|VUK/;
const withCodes = ARTICLES.filter((a) =>
  codeRe.test(a.lead + a.sections.map((s) => s.paragraphs.join(' ')).join(' '))
).length;
log('- Gövde metninde kanun kodu geçen sayfa:', withCodes, `(${((withCodes / ARTICLES.length) * 100).toFixed(1)}%)`);

const customSections = ARTICLES.filter((a) => a.sections.length <= 3).length;
const generic6 = ARTICLES.filter((a) => a.sections.length === 6).length;
log('- Özel seed (≤3 section):', customSections);
log('- Generic 6-section şablon:', generic6);

log('');
log('## 2. Title / meta uzunluk');
const titleOver = ARTICLES.filter((a) => a.title.length > 60).length;
const titleUnder = ARTICLES.filter((a) => a.title.length < 25).length;
const descOver = ARTICLES.filter((a) => a.description.length > 165).length;
const descUnder = ARTICLES.filter((a) => a.description.length < 70).length;
log('- Title >60 karakter:', titleOver);
log('- Title <25:', titleUnder);
log('- Description >165:', descOver);
log('- Description <70:', descUnder);

log('');
log('## 3. İç link sağlığı');
const slugSet = new Set(ARTICLES.map((a) => a.slug));
let brokenRel = 0;
const inbound = new Map(ARTICLES.map((a) => [a.slug, 0]));
for (const a of ARTICLES) {
  for (const r of a.related) {
    if (!slugSet.has(r)) brokenRel++;
    else inbound.set(r, (inbound.get(r) || 0) + 1);
  }
}
const orphans = ARTICLES.filter((a) => (inbound.get(a.slug) || 0) === 0).length;
const lowIn = ARTICLES.filter((a) => (inbound.get(a.slug) || 0) < 2).length;
log('- Kırık related:', brokenRel);
log('- Hiç inbound related olmayan:', orphans);
log('- <2 inbound:', lowIn);
log(
  '- Mevzuat/ara/kategori linki olan:',
  ARTICLES.filter((a) => a.links.some((l) => /mevzuat|kategori|\/ara|hesaplama|rehber/.test(l.href))).length
);

log('');
log('## 4. Kategori dağılımı');
const byCat = {};
for (const a of ARTICLES) byCat[a.category] = (byCat[a.category] || 0) + 1;
Object.entries(byCat)
  .sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => log(`- ${k}: ${v}`));

log('');
log('## 5. Slug / keyword riskleri');
const dupKeywords = new Map();
for (const a of ARTICLES) {
  for (const k of a.keywords) {
    const key = k.toLocaleLowerCase('tr-TR');
    if (!dupKeywords.has(key)) dupKeywords.set(key, []);
    dupKeywords.get(key).push(a.slug);
  }
}
const keywordCollisions = [...dupKeywords.entries()].filter(([, v]) => v.length > 1);
log('- Aynı keyword birden fazla sayfada:', keywordCollisions.length);
keywordCollisions
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 15)
  .forEach(([k, v]) => log(`  · «${k}» → ${v.length} sayfa: ${v.slice(0, 3).join(', ')}`));

// cannibalization clusters: similar titles
log('');
log('## 6. Konu yamyamlığı (benzer slug kökleri)');
const roots = new Map();
for (const a of ARTICLES) {
  const rootKey = a.slug.split('-').slice(0, 2).join('-');
  if (!roots.has(rootKey)) roots.set(rootKey, []);
  roots.get(rootKey).push(a.slug);
}
[...roots.entries()]
  .filter(([, v]) => v.length >= 4)
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 12)
  .forEach(([k, v]) => log(`- ${k}*: ${v.length} → ${v.slice(0, 5).join(', ')}`));

log('');
log('## 7. Mevzuat madde landing kalitesi');
const maddePages = ARTICLES.filter((a) => /madde-\d+|m-\d+/.test(a.slug) || /Madde \d+/.test(a.title));
log('- Madde odaklı landing sayısı:', maddePages.length);
for (const a of maddePages.slice(0, 8)) {
  const hasRealLaw = /Madde\s+\d+|m\.\s*\d+|fıkra|zamanaşımı süresi|yıl/.test(
    a.lead + a.sections.map((s) => s.paragraphs.join(' ')).join(' ')
  );
  log(`  · ${a.slug}: substantive? ${hasRealLaw} sections=${a.sections.length}`);
}

log('');
log('## 8. Site dosya / indeks boyutu');
const paths = [
  'public/data/mevzuat-index.json',
  'public/data/site-search-index.json',
  'lib/vatandas-rehberi/data.ts',
  'content-packs/manifest.json',
];
for (const p of paths) {
  const full = join(root, p);
  if (existsSync(full)) {
    const st = statSync(full);
    log(`- ${p}: ${(st.size / 1024 / 1024).toFixed(2)} MB`);
  } else log(`- ${p}: YOK`);
}

// content-packs count
const packs = join(root, 'content-packs');
if (existsSync(packs)) {
  const gz = readdirSync(packs).filter((f) => f.endsWith('.gz'));
  log('- content-packs .gz:', gz.length);
}

log('');
log('## 9. Risk skoru (0–100, yüksek = kötü)');
let risk = 0;
if (spamCount / ARTICLES.length > 0.7) risk += 35;
else if (spamCount / ARTICLES.length > 0.4) risk += 20;
if (withCodes / ARTICLES.length < 0.3) risk += 20;
if (avg < 550) risk += 10;
if (keywordCollisions.length > 30) risk += 10;
if (maddePages.some((a) => a.sections.length === 6 && !/fıkra|yıl|süre/.test(a.lead))) risk += 15;
log('- Template spam riski skoru:', Math.min(100, risk));
log(
  '- Yorum:',
  risk >= 50
    ? 'KRİTİK — Google helpful content / scaled content abuse riski yüksek. Özel içerik derinleştirilmeli.'
    : risk >= 30
      ? 'ORTA — İyileştirme şart, indeks kaybı mümkün.'
      : 'DÜŞÜK-ORTA'
);

log('');
log('## 10. Öncelikli aksiyonlar');
log('1. Generic body motorunu madde/konuya özel hukuki içerikle değiştir (kanun metni + süre + merci).');
log('2. Top 80 arama niyeti için elle/seed BODIES yaz (kıdem, kira, icra, boşanma, TBK 125…).');
log('3. Madde landing’leri /mevzuat/{kanun}/{id} ile canonical veya güçlü iç link + özet metin.');
log('4. FAQ’ları konuya göre çeşitlendir; saçma «avukat zorunlu mu» şablonunu kır.');
log('5. Deploy sonrası GSC sitemap ping; thin page crawl budget izle.');
log('6. Kanun maddesi niyeti için /ara ve /mevzuat H1/meta (yapıldı) + core web vitals.');

const out = join(root, 'logs/maintenance/seo-deep-analysis-2026-07-28.md');
writeFileSync(out, report.join('\n') + '\n', 'utf8');
console.log('\nWrote', out);
