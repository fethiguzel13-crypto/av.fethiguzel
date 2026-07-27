/**
 * Mevzuat arama indeksi → public/data/mevzuat-index.json
 * title + snippet (gösterim) + body (tam resmî metin + şerh özeti — arama)
 */
import {
    readdirSync,
    readFileSync,
    writeFileSync,
    existsSync,
    mkdirSync,
    statSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const contentDir = join(root, 'content', 'mevzuat');
const packsDir = join(root, 'content-packs');
const outDir = join(root, 'public', 'data');
const outFile = join(outDir, 'mevzuat-index.json');
const siteOutFile = join(outDir, 'site-search-index.json');

/** Markdown/HTML gürültüsünü temizle; arama için düz metin */
function cleanText(s, max = 0) {
    let t = String(s || '')
        .replace(/\r\n/g, '\n')
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/[#>*_`|]/g, ' ')
        .replace(/\*\*/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    if (max > 0 && t.length > max) t = t.slice(0, max);
    return t;
}

function writeIndex(items) {
    items.sort((a, b) => {
        if (a.kanunId !== b.kanunId) return a.kanunId.localeCompare(b.kanunId, 'tr');
        return a.maddeNo - b.maddeNo;
    });
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
    const payload = {
        generatedAt: new Date().toISOString(),
        count: items.length,
        version: 2,
        /** body alanı: tam resmî metin + şerh özeti (arama motoru) */
        items,
    };
    writeFileSync(outFile, JSON.stringify(payload));
    const mb = (Buffer.byteLength(JSON.stringify(payload)) / (1024 * 1024)).toFixed(2);
    console.log(`mevzuat-index: ${items.length} items, ~${mb} MB → ${outFile}`);
    if (items.length === 0) {
        console.error('FATAL: empty mevzuat index');
        process.exit(1);
    }
}

function buildSiteSearchIndex() {
    /** Statik sayfalar + hesaplama araçları — site geneli arama */
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

    // Hesaplama meta — lib dosyasından id/başlık çek
    const metaPath = join(root, 'lib', 'hesaplama-meta.ts');
    if (existsSync(metaPath)) {
        const src = readFileSync(metaPath, 'utf8');
        const blocks = src.split(/\{\s*id:\s*'/).slice(1);
        for (const b of blocks) {
            const id = b.match(/^([^']+)'/)?.[1];
            const baslik = b.match(/baslik:\s*'((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'");
            const aciklama = b.match(/aciklama:\s*'((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'");
            const tag = b.match(/tag:\s*'((?:\\'|[^'])*)'/)?.[1];
            const keywords = [...b.matchAll(/'([^']+)'/g)]
                .map((m) => m[1])
                .filter((k) => k.length > 3)
                .slice(0, 12)
                .join(' ');
            if (!id || !baslik) continue;
            if (id.includes('/') || id.includes('http')) continue;
            pages.push({
                type: 'hesaplama',
                title: baslik,
                href: `/hesaplama/${id}`,
                keywords: `${tag || ''} ${aciklama || ''} ${keywords} hesaplama araç`,
            });
        }
    }

    // Kavram sayfaları
    const kavramPath = join(root, 'lib', 'kavramlar.ts');
    if (existsSync(kavramPath)) {
        const src = readFileSync(kavramPath, 'utf8');
        const blocks = src.split(/slug:\s*'/).slice(1);
        for (const b of blocks) {
            const slug = b.match(/^([^']+)'/)?.[1];
            const baslik = b.match(/baslik:\s*'((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'");
            const ozet = b.match(/ozet:\s*'((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'");
            if (!slug || !baslik) continue;
            pages.push({
                type: 'kavram',
                title: baslik,
                href: `/kavram/${slug}`,
                keywords: `${ozet || ''} kavram bilgilendirme`,
            });
        }
    }

    const payload = {
        generatedAt: new Date().toISOString(),
        count: pages.length,
        items: pages,
    };
    writeFileSync(siteOutFile, JSON.stringify(payload, null, 0));
    console.log(`site-search-index: ${pages.length} items → ${siteOutFile}`);
}

function buildFromMarkdown() {
    const items = [];
    for (const kanunId of readdirSync(contentDir)) {
        const dir = join(contentDir, kanunId);
        if (!statSync(dir).isDirectory()) continue;
        for (const file of readdirSync(dir)) {
            if (!file.endsWith('.md') || file.startsWith('_')) continue;
            const id = file.replace(/\.md$/, '');
            const raw = readFileSync(join(dir, file), 'utf8');
            const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
            const data = {};
            let body = raw;
            if (fm) {
                for (const line of fm[1].split(/\r?\n/)) {
                    const kv = line.match(/^(\w+):\s*(.+)$/);
                    if (!kv) continue;
                    let v = kv[2].trim();
                    if (
                        (v.startsWith('"') && v.endsWith('"')) ||
                        (v.startsWith("'") && v.endsWith("'"))
                    ) {
                        v = v.slice(1, -1);
                    }
                    data[kv[1]] = v;
                }
                body = raw.slice(fm[0].length);
            }
            // Split official vs commentary if markers exist
            const parts = body.split(/(?:^|\n)##\s*Akademik|^---\s*$/m);
            const official = cleanText(parts[0] || body, 0);
            const commentary = cleanText(parts.slice(1).join(' '), 800);
            const fullBody = cleanText(`${official} ${commentary}`, 12000);
            const snippet = official.slice(0, 280);
            items.push({
                kanunId,
                id,
                title: data.title || id,
                kanun: data.kanun || kanunId,
                maddeNo: parseInt(data.maddeNo || '0', 10) || 0,
                status: data.commentaryStatus || 'unknown',
                href: `/mevzuat/${kanunId}/${id}`,
                snippet,
                body: fullBody,
            });
        }
    }
    writeIndex(items);
}

function buildFromPacks() {
    if (!existsSync(packsDir)) {
        if (existsSync(outFile)) {
            const prev = JSON.parse(readFileSync(outFile, 'utf8'));
            console.warn(
                `content missing; keeping existing index (${prev.count || prev.items?.length || 0} items)`
            );
            return;
        }
        console.error('No content/ and no packs/ for index');
        process.exit(1);
    }
    const items = [];
    for (const f of readdirSync(packsDir).filter((x) => x.endsWith('.json.gz'))) {
        const kanunId = f.replace(/\.json\.gz$/, '');
        let pack;
        try {
            pack = JSON.parse(gunzipSync(readFileSync(join(packsDir, f))).toString('utf8'));
        } catch (e) {
            console.warn('skip pack', f, e.message);
            continue;
        }
        for (const [id, a] of Object.entries(pack)) {
            const official = cleanText(a.official || '', 0);
            const commentary = cleanText(a.commentary || '', 800);
            // Tam resmî metin + şerh özeti — "satım" gibi kelimeler resmî metinde yakalanır
            const body = cleanText(`${official} ${commentary}`, 12000);
            const snippet = official.slice(0, 280) || commentary.slice(0, 280);
            items.push({
                kanunId,
                id,
                title: a.title || id,
                kanun: a.kanun || kanunId,
                maddeNo: Number(a.maddeNo) || 0,
                status: a.commentary ? 'completed' : 'unknown',
                href: `/mevzuat/${kanunId}/${id}`,
                snippet,
                body,
            });
        }
    }
    writeIndex(items);
}

if (existsSync(contentDir)) {
    buildFromMarkdown();
} else {
    console.warn('content/mevzuat missing — building index from content-packs/');
    buildFromPacks();
}

buildSiteSearchIndex();
