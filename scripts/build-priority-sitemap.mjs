/**
 * Küçük öncelikli sitemap — Google önce bunları tarasın.
 * public/priority-sitemap.xml
 * Run: node scripts/build-priority-sitemap.mjs
 * prebuild'e de eklenebilir.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.avfethiguzel.com';
const urls = [];

function add(path, prio = '0.9', freq = 'weekly') {
  urls.push({ loc: `${SITE}${path}`, prio, freq });
}

// Ana yüzey
[
  '/',
  '/mevzuat',
  '/ara',
  '/bilgi',
  '/hesaplama',
  '/icthat',
  '/avukat-fethi-guzel',
  '/ders-notlari',
  '/mevzuat/tbk',
  '/mevzuat/tmk',
  '/mevzuat/tck',
  '/mevzuat/hmk',
  '/mevzuat/iik',
  '/mevzuat/ttk',
  '/mevzuat/is-kanunu',
  '/ders-notlari/ankara-yildirim-beyazit',
  '/ders-notlari/marmara',
  '/ders-notlari/van-yyu',
].forEach((p) => add(p, p === '/' ? '1.0' : '0.95'));

// TBK 1–50 (Google «TBK 13» niyeti)
for (let n = 1; n <= 50; n++) {
  add(`/mevzuat/tbk/madde-${n}`, n <= 20 ? '0.93' : '0.9');
}
// Diğer sık maddeler
for (const [k, n] of [
  ['tmk', 1],
  ['tmk', 166],
  ['tmk', 499],
  ['tck', 86],
  ['tck', 106],
  ['tck', 125],
  ['hmk', 119],
  ['hmk', 389],
  ['iik', 62],
  ['tbk', 49],
  ['tbk', 112],
  ['tbk', 125],
  ['is-kanunu', 17],
  ['is-kanunu', 25],
]) {
  add(`/mevzuat/${k}/madde-${n}`, '0.92');
}

// Vatandaş pillar (data.ts'den)
const dataPath = join(root, 'lib/vatandas-rehberi/data.ts');
if (existsSync(dataPath)) {
  const src = readFileSync(dataPath, 'utf8');
  const m = src.match(
    /export const VATANDAS_ARTICLES: VatandasArticle\[\] = (\[[\s\S]*?\n\]);\r?\n\r?\nexport function/
  );
  if (m) {
    try {
      const articles = JSON.parse(m[1]);
      for (const a of articles) {
        if (a.role === 'pillar') add(`/bilgi/${a.slug}`, '0.94');
      }
      // ilk 40 spoke da (keşif)
      let spoke = 0;
      for (const a of articles) {
        if (a.role === 'spoke' && spoke < 40) {
          add(`/bilgi/${a.slug}`, '0.75');
          spoke++;
        }
      }
    } catch {
      /* ignore */
    }
  }
}

// Hesaplama
for (const id of [
  'kidem',
  'miras',
  'faiz',
  'kira',
  'nafaka',
  'icra-kapak',
  'arabuluculuk',
  'vekalet',
]) {
  add(`/hesaplama/${id}`, '0.85');
}

const seen = new Set();
const unique = urls.filter((u) => {
  if (seen.has(u.loc)) return false;
  seen.add(u.loc);
  return true;
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.prio}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const out = join(root, 'public', 'priority-sitemap.xml');
writeFileSync(out, xml, 'utf8');
console.log(`[priority-sitemap] ${unique.length} URLs → ${out}`);
