/**
 * Küçük öncelikli sitemap — Google önce bunları tarasın.
 * public/priority-sitemap.xml
 * Run: node scripts/build-priority-sitemap.mjs
 * prebuild'e de eklenebilir.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CORE_KANUN_ORDER,
  PRIORITY_MADDE_BY_KANUN,
} from './lib/kanun-seo-order.mjs';

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
  '/bolge-yazi',
  '/bolge-yazi/van-golu-havzasi-tasinmaz-ve-miras-hukuku',
  '/bolge-yazi/ahlat-vakif-miras-ve-tarihi-tasinmazlar',
  '/bolge-yazi/caldiran-tarimsal-tasinmaz-kadastro-ve-nufus',
  '/bolge-yazi/dogu-anadolu-el-birligi-mulkiyet-ve-miras-pratikleri',
  '/ders-notlari/ankara-yildirim-beyazit',
  '/ders-notlari/marmara',
  '/ders-notlari/ankara',
].forEach((p) => add(p, p === '/' ? '1.0' : '0.95'));

// Core kanun hubs (order = SEO queue)
for (const kid of CORE_KANUN_ORDER) {
  add(`/mevzuat/${kid}`, '0.96');
}

// High-intent madde set per core kanun (kanun-seo-order)
for (const kid of CORE_KANUN_ORDER) {
  const nums = PRIORITY_MADDE_BY_KANUN[kid] || [];
  nums.forEach((n, i) => {
    const prio = i < 15 ? '0.93' : '0.9';
    add(`/mevzuat/${kid}/madde-${n}`, prio);
  });
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
