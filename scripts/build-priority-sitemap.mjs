/**
 * Küçük öncelikli sitemap — Google önce bunları tarasın.
 * public/priority-sitemap.xml
 * Run: node scripts/build-priority-sitemap.mjs
 * prebuild'e de eklenebilir.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CORE_KANUN_ORDER,
  PRIORITY_MADDE_BY_KANUN,
} from './lib/kanun-seo-order.mjs';
import { auditCommentary } from '../lib/content-quality.mjs';
import { readPublished } from './lib/read-guides.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.avfethiguzel.com';
const urls = [];
let skipped = 0;

/**
 * Bir maddenin şerhi yayınlanabilir mi?
 *
 * Öncelikli site haritası, Google'a "önce şunları tara" der. noindex bir
 * sayfayı oraya koymak, tarama bütçesinin en değerli kısmını hiç indekse
 * girmeyecek adreslere harcamak demektir.
 */
const packCache = new Map();
function loadPack(kanunId) {
  if (packCache.has(kanunId)) return packCache.get(kanunId);
  const file = join(root, 'content-packs', `${kanunId}.json.gz`);
  let pack = null;
  if (existsSync(file)) {
    try {
      pack = JSON.parse(gunzipSync(readFileSync(file)));
    } catch {
      pack = null;
    }
  }
  packCache.set(kanunId, pack);
  return pack;
}

function maddePublishable(kanunId, maddeNo) {
  const pack = loadPack(kanunId);
  if (!pack) return false;
  const art = pack[`madde-${maddeNo}`];
  if (!art) return false;
  return auditCommentary(kanunId, art.commentary || '').publishable;
}

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
  // Fakülte sayfaları çıkarıldı: notların tamamı kalıp metin olduğu için
  // hepsi noindex; öncelikli haritada yerleri yok.
].forEach((p) => add(p, p === '/' ? '1.0' : '0.95'));

// Core kanun hubs (order = SEO queue)
for (const kid of CORE_KANUN_ORDER) {
  add(`/mevzuat/${kid}`, '0.96');
}

// High-intent madde set per core kanun (kanun-seo-order)
for (const kid of CORE_KANUN_ORDER) {
  const nums = PRIORITY_MADDE_BY_KANUN[kid] || [];
  nums.forEach((n, i) => {
    if (!maddePublishable(kid, n)) {
      skipped += 1;
      return;
    }
    const prio = i < 15 ? '0.93' : '0.9';
    add(`/mevzuat/${kid}/madde-${n}`, prio);
  });
}

// Vatandaş pillar (data.ts'den)
// Elle yazılanlar + denetimden geçen üretilmişler. Site haritalarının
// hepsi aynı listeden beslensin diye ortak okuyucu kullanılır.
try {
  const { published, authored, withdrawn } = readPublished(root);
  skipped += withdrawn;

  // Elle yazılan rehberler en yüksek öncelikte — kaynağı doğrulanmış tek küme
  for (const a of authored) add(`/bilgi/${a.slug}`, '0.96');

  const authoredSlugs = new Set(authored.map((a) => a.slug));
  const generated = published.filter((a) => !authoredSlugs.has(a.slug));

  for (const a of generated) {
    if (a.role === 'pillar') add(`/bilgi/${a.slug}`, '0.94');
  }
  let spoke = 0;
  for (const a of generated) {
    if (a.role === 'spoke' && spoke < 40) {
      add(`/bilgi/${a.slug}`, '0.75');
      spoke += 1;
    }
  }
} catch (e) {
  console.warn('[priority-sitemap] rehberler okunamadı:', e.message);
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
console.log(`[priority-sitemap] ${unique.length} URL → ${out}`);
if (skipped > 0) {
  console.log(`[priority-sitemap] ${skipped} adres kalıp metin nedeniyle atlandı`);
}
