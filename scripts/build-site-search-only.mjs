/**
 * site-search-index.json üretir (mevzuat full rebuild olmadan).
 * Usage: node scripts/build-site-search-only.mjs
 */
import {
    readdirSync,
    readFileSync,
    writeFileSync,
    existsSync,
    mkdirSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'data');
const siteOutFile = join(outDir, 'site-search-index.json');

const pages = [
    { type: 'sayfa', title: 'Ana sayfa', href: '/', keywords: 'avukat fethi güzel hukuk portalı kanun maddesi arama' },
    { type: 'sayfa', title: 'Mevzuat ara', href: '/ara', keywords: 'arama kanun madde şerh tbk 13' },
    { type: 'sayfa', title: 'Mevzuat arşivi', href: '/mevzuat', keywords: 'kanun listesi mevzuat bankası' },
    { type: 'sayfa', title: 'Günlük içtihat', href: '/icthat', keywords: 'yargıtay aym içtihat karar' },
    { type: 'sayfa', title: 'Haftalık içtihat özeti', href: '/icthat/haftalik', keywords: 'haftalık karar özet' },
    { type: 'sayfa', title: 'Hukuki hesaplama araçları', href: '/hesaplama', keywords: 'kıdem faiz miras harç vekalet hesaplama' },
    { type: 'sayfa', title: 'Tarife güncellemeleri', href: '/tarife-guncellemeleri', keywords: 'aaüt kıdem tavanı harç tarife' },
    { type: 'sayfa', title: 'Ön değerlendirme formu', href: '/on-form', keywords: 'iletişim randevu form' },
    { type: 'sayfa', title: 'e-Duruşma', href: '/e-durusma', keywords: 'e duruşma ses görüntü usul monografi' },
    { type: 'sayfa', title: 'Eserlerim', href: '/eserlerim', keywords: 'kitap seckin e-duruşma' },
    { type: 'sayfa', title: 'Akademik profil', href: '/akademik-profil', keywords: 'doktora özel hukuk' },
    { type: 'sayfa', title: 'Avukat Fethi Güzel', href: '/avukat-fethi-guzel', keywords: 'avukat profili arabulucu' },
    { type: 'sayfa', title: 'English-speaking lawyer', href: '/english-speaking-lawyer', keywords: 'english lawyer turkey' },
    { type: 'sayfa', title: 'Bölgesel hukuki bilgilendirme', href: '/hizmet-bolgeleri', keywords: 'miras tapu aile icra bilgilendirme' },
    { type: 'sayfa', title: 'Hizmet alanları', href: '/hizmetler', keywords: 'ceza aile miras iş icra' },
    { type: 'sayfa', title: 'Rehberler', href: '/rehber', keywords: 'miras kıdem arabuluculuk rehber' },
    { type: 'sayfa', title: 'Hukuki kavramlar', href: '/kavram', keywords: 'satım kıdem nafaka faiz miras kavram sözlük' },
    { type: 'sayfa', title: 'Miras paylaşımı rehberi', href: '/rehber/miras-paylasimi', keywords: 'miras zümre saklı pay' },
    { type: 'sayfa', title: 'Kıdem tazminatı rehberi', href: '/rehber/kidem-tazminati', keywords: 'kıdem ihbar iş hukuku' },
    { type: 'sayfa', title: 'Arabuluculuk rehberi', href: '/rehber/arabuluculuk', keywords: 'arabuluculuk dava şartı' },
    { type: 'sayfa', title: 'Makaleler', href: '/makaleler', keywords: 'akademik makale' },
    { type: 'sayfa', title: 'Site haritası', href: '/site-haritasi', keywords: 'harita sitemap' },
    { type: 'sayfa', title: 'Gizlilik / KVKK', href: '/gizlilik', keywords: 'kvkk gizlilik' },
    { type: 'sayfa', title: 'Yasal uyarı', href: '/yasal-uyari', keywords: 'yasal uyarı bilgilendirme' },
    { type: 'sayfa', title: 'Mevzuat yer imi aracı', href: '/bookmarklet', keywords: 'bookmarklet arama eklenti' },
    { type: 'sayfa', title: 'Vatandaş bilgi rehberi', href: '/bilgi', keywords: 'vatandaş rehber emlak kıdem icra boşanma' },
    { type: 'sayfa', title: 'Hukuk fakültesi ders notları', href: '/ders-notlari', keywords: 'hukuk ders notu ücretsiz pdf fakülte' },
    { type: 'sayfa', title: 'Bölgesel hukuki makaleler', href: '/bolge-yazi', keywords: 'van bitlis ağrı tatvan ahlat miras tapu nüfus makale' },
];

// Bölge makaleleri
try {
  const makaleSrc = readFileSync(join(root, 'lib/bolge-makaleler/data.ts'), 'utf8');
  const start = makaleSrc.indexOf('export const BOLGE_MAKALELER');
  const chunk = start >= 0 ? makaleSrc.slice(start) : makaleSrc;
  const mSlugs = [...chunk.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
  const mH1s = [...chunk.matchAll(/h1:\s*'((?:\\'|[^'])*)'/g)].map((m) => m[1].replace(/\\'/g, "'"));
  const n = Math.min(mSlugs.length, mH1s.length);
  for (let i = 0; i < n; i++) {
    pages.push({
      type: 'bolge-yazi',
      title: mH1s[i],
      href: `/bolge-yazi/${mSlugs[i]}`,
      keywords: `${mSlugs[i].replace(/-/g, ' ')} hukuki makale bilgilendirme`,
    });
  }
} catch (e) {
  console.warn('bolge-makale index skip', e.message);
}

// Bölgesel bilgilendirme
try {
  const bolgeSrc = readFileSync(join(root, 'lib/bolge-bilgi.ts'), 'utf8');
  const blocks = bolgeSrc.split(/slug:\s*'/).slice(1);
  for (const b of blocks) {
    const slug = b.match(/^([^']+)'/)?.[1];
    const h1 = b.match(/h1:\s*'((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'");
    const yer = b.match(/yerlesim:\s*'((?:\\'|[^'])*)'/)?.[1];
    if (!slug || !h1) continue;
    pages.push({
      type: 'bolge',
      title: h1,
      href: `/${slug}`,
      keywords: `${yer || ''} hukuki bilgilendirme miras tapu aile icra`,
    });
  }
} catch {
  /* optional */
}

function parseBlocks(path, splitRe, mapFn) {
    if (!existsSync(path)) return;
    const src = readFileSync(path, 'utf8');
    const blocks = src.split(splitRe).slice(1);
    for (const b of blocks) mapFn(b);
}

parseBlocks(join(root, 'lib/hesaplama-meta.ts'), /\{\s*id:\s*'/, (b) => {
    const id = b.match(/^([^']+)'/)?.[1];
    const baslik = b.match(/baslik:\s*'((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'");
    const aciklama = b.match(/aciklama:\s*'((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'");
    const tag = b.match(/tag:\s*'((?:\\'|[^'])*)'/)?.[1];
    if (!id || !baslik || id.includes('/') || id.includes('http')) return;
    pages.push({
        type: 'hesaplama',
        title: baslik,
        href: `/hesaplama/${id}`,
        keywords: `${tag || ''} ${aciklama || ''} hesaplama araç`,
    });
});

parseBlocks(join(root, 'lib/kavramlar.ts'), /slug:\s*'/, (b) => {
    const slug = b.match(/^([^']+)'/)?.[1];
    const baslik = b.match(/baslik:\s*'((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'");
    const ozet = b.match(/ozet:\s*'((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'");
    if (!slug || !baslik) return;
    pages.push({
        type: 'kavram',
        title: baslik,
        href: `/kavram/${slug}`,
        keywords: `${ozet || ''} kavram bilgilendirme forum`,
    });
});

// Vatandaş rehberi (data.ts JSON)
try {
  const dataPath = join(root, 'lib/vatandas-rehberi/data.ts');
  const src = readFileSync(dataPath, 'utf8');
  const slugRe = /"slug":\s*"([^"]+)"/g;
  const h1Re = /"h1":\s*"([^"]+)"/g;
  const slugs = [...src.matchAll(slugRe)].map((m) => m[1]);
  const h1s = [...src.matchAll(h1Re)].map((m) => m[1]);
  const n = Math.min(slugs.length, h1s.length);
  for (let i = 0; i < n; i++) {
    pages.push({
      type: 'bilgi',
      title: h1s[i],
      href: `/bilgi/${slugs[i]}`,
      keywords: `${slugs[i].replace(/-/g, ' ')} vatandaş rehber`,
    });
  }
} catch (e) {
  console.warn('vatandas index skip', e.message);
}

// Ders notları — index.json hafif
try {
  const idx = JSON.parse(readFileSync(join(root, 'lib/ders-notlari/generated/index.json'), 'utf8'));
  for (const u of idx.universities || []) {
    pages.push({
      type: 'ders-hub',
      title: `${u.shortName} hukuk ders notları`,
      href: `/ders-notlari/${u.slug}`,
      keywords: `${u.name} ${u.city} hukuk fakültesi ders notu ücretsiz`,
    });
  }
  // Öncelikli not örnekleri (tüm 3360'ı arama indexine basma)
  for (const n of (idx.notes || []).slice(0, 400)) {
    pages.push({
      type: 'ders-not',
      title: n.title,
      href: n.href,
      keywords: `${n.uniSlug} ${n.courseCode} hukuk ders notu`,
    });
  }
} catch (e) {
  console.warn('ders-notlari index skip', e.message);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(
    siteOutFile,
    JSON.stringify({ generatedAt: new Date().toISOString(), count: pages.length, items: pages })
);
console.log(`site-search-index: ${pages.length} → ${siteOutFile}`);
