/**
 * Sadece site-search-index.json üretir (mevzuat full rebuild olmadan).
 * Usage: node scripts/build-site-search-only.mjs
 */
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Reuse build-mevzuat-index's site index by importing logic — simplest: run partial
// by reading the site builder from a duplicated minimal path.
import {
    readdirSync,
    readFileSync,
    writeFileSync,
    existsSync,
    mkdirSync,
} from 'node:fs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'data');
const siteOutFile = join(outDir, 'site-search-index.json');

const pages = [
    { type: 'sayfa', title: 'Ana sayfa', href: '/', keywords: 'avukat fethi güzel van erciş hukuk portalı' },
    { type: 'sayfa', title: 'Mevzuat ara', href: '/ara', keywords: 'arama kanun madde şerh' },
    { type: 'sayfa', title: 'Mevzuat arşivi', href: '/mevzuat', keywords: 'kanun listesi mevzuat bankası' },
    { type: 'sayfa', title: 'Günlük içtihat', href: '/icthat', keywords: 'yargıtay aym içtihat karar' },
    { type: 'sayfa', title: 'Haftalık içtihat özeti', href: '/icthat/haftalik', keywords: 'haftalık karar özet' },
    { type: 'sayfa', title: 'Hukuki hesaplama araçları', href: '/hesaplama', keywords: 'kıdem faiz miras harç vekalet hesaplama' },
    { type: 'sayfa', title: 'Tarife güncellemeleri', href: '/tarife-guncellemeleri', keywords: 'aaüt kıdem tavanı harç tarife' },
    { type: 'sayfa', title: 'Ön değerlendirme formu', href: '/on-form', keywords: 'iletişim randevu form' },
    { type: 'sayfa', title: 'e-Duruşma', href: '/e-durusma', keywords: 'e duruşma ses görüntü usul monografi' },
    { type: 'sayfa', title: 'Eserlerim', href: '/eserlerim', keywords: 'kitap seckin e-duruşma' },
    { type: 'sayfa', title: 'Akademik profil', href: '/akademik-profil', keywords: 'doktora özel hukuk' },
    { type: 'sayfa', title: 'Avukat Fethi Güzel', href: '/avukat-fethi-guzel', keywords: 'avukat profili erciş van' },
    { type: 'sayfa', title: 'English-speaking lawyer', href: '/english-speaking-lawyer', keywords: 'english lawyer turkey' },
    { type: 'sayfa', title: 'Hizmet bölgeleri', href: '/hizmet-bolgeleri', keywords: 'van erciş bitlis ağrı ankara' },
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
];

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

mkdirSync(outDir, { recursive: true });
writeFileSync(
    siteOutFile,
    JSON.stringify({ generatedAt: new Date().toISOString(), count: pages.length, items: pages })
);
console.log(`site-search-index: ${pages.length} → ${siteOutFile}`);
