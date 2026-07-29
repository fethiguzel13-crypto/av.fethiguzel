/**
 * Tüm /bilgi sayfaları için ayrı sitemap (Google crawl budget).
 * public/bilgi-sitemap.xml
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.avfethiguzel.com';
const src = readFileSync(join(root, 'lib/vatandas-rehberi/data.ts'), 'utf8');
const m = src.match(
  /export const VATANDAS_ARTICLES: VatandasArticle\[\] = (\[[\s\S]*?\n\]);\r?\n\r?\nexport function/
);
if (!m) throw new Error('Cannot parse VATANDAS_ARTICLES');
const articles = JSON.parse(m[1]);

// pillar önce
articles.sort((a, b) => {
  const ra = a.role === 'pillar' ? 0 : a.role === 'spoke' ? 1 : a.role === 'bridge' ? 2 : 3;
  const rb = b.role === 'pillar' ? 0 : b.role === 'spoke' ? 1 : b.role === 'bridge' ? 2 : 3;
  return ra - rb || a.slug.localeCompare(b.slug);
});

const urls = [
  {
    loc: `${SITE}/bilgi`,
    prio: '0.96',
    freq: 'weekly',
    last: new Date().toISOString().slice(0, 10),
  },
  ...articles.map((a) => ({
    loc: `${SITE}/bilgi/${a.slug}`,
    prio: String(
      a.sitemapPriority ??
        (a.role === 'pillar' ? 0.95 : a.role === 'spoke' ? 0.72 : a.role === 'bridge' ? 0.55 : 0.85)
    ),
    freq: a.role === 'pillar' ? 'weekly' : 'monthly',
    last: a.updated || '2026-07-29',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.last}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.prio}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const out = join(root, 'public', 'bilgi-sitemap.xml');
writeFileSync(out, xml, 'utf8');
console.log(`[bilgi-sitemap] ${urls.length} URLs → ${out}`);
