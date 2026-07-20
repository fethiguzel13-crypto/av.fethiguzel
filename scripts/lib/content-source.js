/**
 * Social content source: daily highlights → items → archive → mevzuat topics.
 */
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..', '..');
const DAILY_PATH = join(ROOT, 'public', 'data', 'daily.json');
const ARCHIVE_DIR = join(ROOT, 'public', 'data', 'archive');
const SITE = 'https://avfethiguzel.com';

/** Curated high-quality mevzuat topics when daily feed is thin */
const MEVZUAT_TOPICS = [
    {
        id: 'mevzuat-tbk-112',
        source: 'TBK',
        category: 'Borçlar',
        title: 'TBK m. 112 — Borçlunun temerrüdü',
        konu: 'Borçlu, ifa için belirlenmiş vadeyi geçirirse alacaklı temerrüt hükümlerine başvurabilir; zarar, temerrüt faizi ve sözleşmeden dönme seçenekleri gündeme gelir.',
        publicSummary:
            'Türk Borçlar Kanunu m. 112 uyarınca borçlu, muaccel borcunu ifa etmezse temerrüde düşer. Alacaklı, ifayı isteme, gecikme zararını talep etme ve şartları varsa sözleşmeden dönme haklarını kullanabilir.',
        url: `${SITE}/mevzuat/tbk/madde-112`,
        kunye: 'TBK m. 112',
    },
    {
        id: 'mevzuat-tmk-166',
        source: 'TMK',
        category: 'Aile',
        title: 'TMK m. 166 — Boşanma sebepleri',
        konu: 'Evlilik birliğinin sarsılması ve özel boşanma sebepleri; ispat ve sonuçlar.',
        publicSummary:
            'TMK m. 166, evlilik birliğinin temelinden sarsılması hâlinde boşanmayı düzenler. Şiddetli geçimsizlik iddiasında ispat yükü ve ortak hayatın çekilmezliği ölçütü uygulamada belirleyicidir.',
        url: `${SITE}/mevzuat/tmk/madde-166`,
        kunye: 'TMK m. 166',
    },
    {
        id: 'mevzuat-is-17',
        source: 'İşK',
        category: 'İş',
        title: 'İş Kanunu m. 17 — Bildirimli fesih',
        konu: 'Belirsiz süreli iş sözleşmesinde bildirim süreleri ve ihbar tazminatı.',
        publicSummary:
            'İş Kanunu m. 17, belirsiz süreli iş sözleşmesinin feshinde bildirim sürelerini öngörür. Süreye uyulmaması hâlinde ihbar tazminatı gündeme gelir; haklı nedenle derhal fesih rejiminden ayrılır.',
        url: `${SITE}/mevzuat/is-kanunu/madde-17`,
        kunye: 'İşK m. 17',
    },
    {
        id: 'mevzuat-hmk-119',
        source: 'HMK',
        category: 'Usul',
        title: 'HMK m. 119 — Dava dilekçesinin içeriği',
        konu: 'Dava dilekçesinde bulunması zorunlu unsurlar ve eksikliğin sonuçları.',
        publicSummary:
            'HMK m. 119, dava dilekçesinde yer alması gereken unsurları sayar. Eksik unsurlar hâlinde tamamlanması için süre verilir; usul ekonomisi ve savunma hakkı dengesi gözetilir.',
        url: `${SITE}/mevzuat/hmk/madde-119`,
        kunye: 'HMK m. 119',
    },
    {
        id: 'mevzuat-iik-67',
        source: 'İİK',
        category: 'İcra',
        title: 'İİK m. 67 — İtirazın iptali',
        konu: 'İcra takibine itirazın iptali davası ve ispat.',
        publicSummary:
            'İİK m. 67, itirazın iptali davasını düzenler. Alacaklı, itirazın haksızlığını ispatlayarak takibin devamını sağlar; haksız itirazda tazminat da gündeme gelebilir.',
        url: `${SITE}/mevzuat/iik/madde-67`,
        kunye: 'İİK m. 67',
    },
    {
        id: 'mevzuat-tck-86',
        source: 'TCK',
        category: 'Ceza',
        title: 'TCK m. 86 — Kasten yaralama',
        konu: 'Kasten yaralama suçu, neticesi sebebiyle ağırlaşmış hâller ve ceza.',
        publicSummary:
            'TCK m. 86 kasten yaralamayı düzenler. Fiilin basit tıbbi müdahale ile giderilebilecek ölçüde olup olmadığı ve silah kullanılması gibi nitelikli hâller cezayı etkiler.',
        url: `${SITE}/mevzuat/tck/madde-86`,
        kunye: 'TCK m. 86',
    },
];

function normalizeItem(item, sourceFallback = '') {
    const source = item.source || item.sourceLabel || sourceFallback || 'Hukuk';
    const summary =
        (item.publicSummary || item.konu || item.caseName || item.title || '').trim();
    if (!summary || summary.length < 40) return null;
    return {
        id: item.id || `${source}-${Date.now()}`,
        source,
        category: item.category || '',
        title: item.title || item.caseName || item.kunye || source,
        konu: item.konu || summary.slice(0, 200),
        publicSummary: summary.slice(0, 800),
        kunye: item.kunye || item.appNo || '',
        url: item.url || `${SITE}/icthat`,
        date: item.date || '',
    };
}

function fromHighlights(list) {
    return (list || []).map((h) => normalizeItem(h)).filter(Boolean);
}

function fromItemsBucket(items) {
    if (!items || typeof items !== 'object') return [];
    const out = [];
    for (const [key, arr] of Object.entries(items)) {
        if (!Array.isArray(arr)) continue;
        for (const it of arr) {
            const n = normalizeItem(it, key);
            if (n) out.push(n);
        }
    }
    return out;
}

async function loadJson(path) {
    if (!existsSync(path)) return null;
    try {
        return JSON.parse(await readFile(path, 'utf-8'));
    } catch {
        return null;
    }
}

async function loadLatestArchiveWithContent() {
    if (!existsSync(ARCHIVE_DIR)) return [];
    const files = (await readdir(ARCHIVE_DIR))
        .filter((f) => f.endsWith('.json'))
        .sort()
        .reverse();
    for (const f of files.slice(0, 30)) {
        const data = await loadJson(join(ARCHIVE_DIR, f));
        if (!data) continue;
        let pool = fromHighlights(data.highlights);
        if (pool.length === 0) pool = fromItemsBucket(data.items);
        // Prefer Turkish courts over French-only HUDOC labels when possible
        const tr = pool.filter((p) => !/AFFAIRE|Violation de/i.test(p.publicSummary));
        if (tr.length >= 1) return tr;
        if (pool.length >= 1) return pool;
    }
    return [];
}

function isWeakTopic(p) {
    if (!p?.publicSummary || p.publicSummary.length < 80) return true;
    if (/AFFAIRE|Violation de l'|Article 8-1|Procédure pénale/i.test(p.publicSummary)) return true;
    if (/AFFAIRE|c\. TÜRKİYE/i.test(p.title || '')) return true;
    return false;
}

/**
 * @param {number} count
 * @returns {Promise<object[]>}
 */
export async function getSocialTopics(count = 2) {
    const day = new Date().getUTCDate();
    const rotatedMevzuat = [
        ...MEVZUAT_TOPICS.slice(day % MEVZUAT_TOPICS.length),
        ...MEVZUAT_TOPICS.slice(0, day % MEVZUAT_TOPICS.length),
    ]
        .map(normalizeItem)
        .filter(Boolean);

    // Quality-first: curated mevzuat when daily feed is empty/weak
    if (process.env.SOCIAL_PREFER_MEVZUAT === '1') {
        return rotatedMevzuat.slice(0, count);
    }

    const daily = await loadJson(DAILY_PATH);
    let pool = [];

    if (daily) {
        pool = fromHighlights(daily.highlights);
        if (pool.length < count) pool = pool.concat(fromItemsBucket(daily.items));
    }

    if (pool.filter((p) => !isWeakTopic(p)).length < count) {
        const arch = await loadLatestArchiveWithContent();
        pool = pool.concat(arch);
    }

    const seen = new Set();
    pool = pool.filter((p) => {
        if (!p || isWeakTopic(p) || seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
    });

    if (pool.length < count) {
        for (const m of rotatedMevzuat) {
            if (!seen.has(m.id)) {
                pool.push(m);
                seen.add(m.id);
            }
        }
    }

    return pool.slice(0, count);
}

export { SITE, MEVZUAT_TOPICS };
