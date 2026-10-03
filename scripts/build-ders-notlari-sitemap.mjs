/**
 * /ders-notlari site haritası.
 *
 * Kalıp metin içeren notlar haritaya GİRMEZ. Sayfa noindex olduğu hâlde
 * haritada durursa Google'a çelişkili sinyal verilir ve tarama bütçesi
 * boşa harcanır — 7.999 URL için bu ciddi bir israftır.
 *
 * G11 (2026-10-03): kalıptan geçen notlar da 26 dersin 84 üniversiteye ad değiştirilerek çoğaltılmış
 * kopyalarıdır. Haritaya yalnız her dersin temsilci notu ve onu barındıran fakülte sayfası girer; karar
 * sayfanın robots'uyla aynı işlevden gelir (lib/ders-notlari/dizin.mjs).
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dersKoku, notDizinKarari, hubDizinde } from '../lib/ders-notlari/dizin.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.avfethiguzel.com';

/**
 * @param {{ universities: { slug: string, priority?: number }[], notes: { uniSlug: string, courseCode: string, href: string }[] }} idx
 * @param {{ dersler: Record<string, { uni: string, ders: string }> }} kanonik
 * @param {(n: { uniSlug: string, courseCode: string }) => object | undefined} notOku
 */
export function dersNotuHaritaAdresleri(idx, kanonik, notOku) {
  const notlar = idx.notes.filter((n) => {
    const t = kanonik.dersler[dersKoku(n)];
    if (!t || t.uni !== n.uniSlug || t.ders !== n.courseCode) return false;
    const note = notOku(n);
    return Boolean(note) && notDizinKarari(note, kanonik).index;
  });
  return [
    { loc: `${SITE}/ders-notlari`, prio: '0.9' },
    ...idx.universities
      .filter((u) => hubDizinde(u.slug, kanonik))
      .map((u) => ({ loc: `${SITE}/ders-notlari/${u.slug}`, prio: u.priority === 1 ? '0.92' : '0.85' })),
    ...notlar.map((n) => ({ loc: `${SITE}${n.href}`, prio: '0.88' })),
  ];
}

function main() {
  const idxPath = join(root, 'lib/ders-notlari/generated/index.json');
  if (!existsSync(idxPath)) {
    console.warn('[ders-notlari-sitemap] no index — run generate-ders-notlari first');
    return;
  }
  const idx = JSON.parse(readFileSync(idxPath, 'utf8'));
  const kanonik = JSON.parse(readFileSync(join(root, 'lib/ders-notlari/dizin-kanonik.json'), 'utf8'));
  const notesDir = join(root, 'lib/ders-notlari/generated/notes');
  const notOku = (n) => {
    const file = join(notesDir, `${n.uniSlug}__${n.courseCode}.json`);
    if (!existsSync(file)) return undefined;
    try {
      return JSON.parse(readFileSync(file, 'utf8'));
    } catch {
      return undefined;
    }
  };

  const urls = dersNotuHaritaAdresleri(idx, kanonik, notOku);
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
  const notSayisi = urls.filter((u) => u.prio === '0.88').length;
  console.log(`[ders-notlari-sitemap] ${urls.length} URL (${notSayisi} temsilci not; ${idx.notes.length - notSayisi} not dizin dışı)`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
