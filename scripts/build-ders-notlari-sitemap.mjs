/**
 * /ders-notlari site haritası.
 *
 * Kalıp metin içeren notlar haritaya GİRMEZ. Sayfa noindex olduğu hâlde
 * haritada durursa Google'a çelişkili sinyal verilir ve tarama bütçesi
 * boşa harcanır — 7.999 URL için bu ciddi bir israftır.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditLectureNote } from '../lib/content-quality.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.avfethiguzel.com';
const idxPath = join(root, 'lib/ders-notlari/generated/index.json');
if (!existsSync(idxPath)) {
  console.warn('[ders-notlari-sitemap] no index — run generate-ders-notlari first');
  process.exit(0);
}

const idx = JSON.parse(readFileSync(idxPath, 'utf8'));
const notesDir = join(root, 'lib/ders-notlari/generated/notes');

function isPublishable(n) {
  const file = join(notesDir, `${n.uniSlug}__${n.courseCode}.json`);
  if (!existsSync(file)) return false;
  try {
    return auditLectureNote(JSON.parse(readFileSync(file, 'utf8'))).publishable;
  } catch {
    return false;
  }
}

const publishableNotes = idx.notes.filter(isPublishable);
const withdrawn = idx.notes.length - publishableNotes.length;

// Yayınlanabilir notu olan fakülteler haritada kalır
const liveUniSlugs = new Set(publishableNotes.map((n) => n.uniSlug));

const urls = [
  { loc: `${SITE}/ders-notlari`, prio: '0.9' },
  ...idx.universities
    .filter((u) => liveUniSlugs.has(u.slug))
    .map((u) => ({
      loc: `${SITE}/ders-notlari/${u.slug}`,
      prio: u.priority === 1 ? '0.92' : '0.85',
    })),
  ...publishableNotes.map((n) => ({ loc: `${SITE}${n.href}`, prio: '0.88' })),
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
console.log(`[ders-notlari-sitemap] ${urls.length} URL`);
if (withdrawn > 0) {
  console.log(`[ders-notlari-sitemap] ${withdrawn} not kalıp metin nedeniyle haritaya alınmadı`);
}
