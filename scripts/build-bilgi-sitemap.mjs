/**
 * Tüm /bilgi sayfaları için ayrı sitemap (Google crawl budget).
 * public/bilgi-sitemap.xml
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPublished } from './lib/read-guides.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.avfethiguzel.com';

// Kalıp metin içeren rehberler site haritasına GİRMEZ. Sayfa noindex olduğu
// hâlde sitemap'te durursa Google'a çelişkili sinyal verilir ve tarama
// bütçesi boşa harcanır. Elle yazılanlar koşulsuz girer.
const { published: articles, authored, withdrawn } = readPublished(root);

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
console.log(`[bilgi-sitemap] ${urls.length} URL → ${out}`);
console.log(`[bilgi-sitemap]   ${authored.length} elle yazılan · ${articles.length - authored.length} denetimden geçen`);
if (withdrawn > 0) {
  console.log(`[bilgi-sitemap] ${withdrawn} rehber kalıp metin nedeniyle haritaya alınmadı`);
}
