import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.avfethiguzel.com';
const idxPath = join(root, 'lib/ders-notlari/generated/index.json');
if (!existsSync(idxPath)) {
  console.warn('[ders-notlari-sitemap] no index — run generate-ders-notlari first');
  process.exit(0);
}
const idx = JSON.parse(readFileSync(idxPath, 'utf8'));
const urls = [
  { loc: `${SITE}/ders-notlari`, prio: '0.9' },
  ...idx.universities.map((u) => ({
    loc: `${SITE}/ders-notlari/${u.slug}`,
    prio: u.priority === 1 ? '0.92' : '0.85',
  })),
  ...idx.notes.map((n) => ({
    loc: `${SITE}${n.href}`,
    prio: '0.88',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${u.prio}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
writeFileSync(join(root, 'public', 'ders-notlari-sitemap.xml'), xml, 'utf8');
console.log(`[ders-notlari-sitemap] ${urls.length} URLs`);
