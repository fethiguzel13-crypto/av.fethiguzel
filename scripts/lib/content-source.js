/**
 * Social content source: daily highlights → items → archive → curated court topics.
 * Priority: yargı kararı (Yargıtay / AYM / AİHM TR) > mevzuat (only last resort).
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

/** Curated court decisions when daily/archive feed is thin or weak */
const COURT_TOPICS = [
    {
        id: 'aym-2021-61490',
        source: 'AYM',
        category: 'Bireysel Başvuru',
        title: 'İşçi alacağı davasında talep artırım dilekçesi',
        konu: 'Başvuru, işçilik alacaklarının tazmini talebiyle açılan davada talep artırım dilekçesinin dikkate alınmaması nedeniyle mahkemeye erişim hakkının ihlal edildiği iddiasına ilişkindir.',
        publicSummary:
            'İşçi, alacakları için dava açtıktan sonra istem miktarını artırmak istemiş; mahkeme bu dilekçeyi yok saymış. Anayasa Mahkemesi, mahkemeye erişim hakkının ihlal edildiğine karar vermiştir. Sıradan vatandaş için anlamı: dosyaya yazdığınız ek talep de dosyanın parçasıdır; mahkeme bunu görmezden gelemez.',
        url: `${SITE}/icthat`,
        kunye: 'AYM, B. No: 2021/61490, 06.05.2026',
    },
    {
        id: 'aym-2023-107440',
        source: 'AYM',
        category: 'Bireysel Başvuru',
        title: 'Fazladan hapis süresi ve savcılık mütalaasının tebliği',
        konu: 'Başvuru, mahsup edilecek sürenin hatalı hesaplanması sonucu fazladan hapis yatıldığı gerekçesiyle kişi hürriyeti ve güvenliği hakkının, savcılık mütalaasının tebliğ edilmediği gerekçesiyle adil yargılanma hakkının ihlal edildiği iddialarına ilişkindir.',
        publicSummary:
            'Kişi, ceza hesabındaki hatadan dolayı olması gerekenden fazla hapiste kalmış; ayrıca savcılığın görüşü kendisine zamanında bildirilmemiş. Anayasa Mahkemesi, kişi hürriyeti ve adil yargılanma haklarının ihlal edildiğine hükmetmiştir. Süre hesabı ve “karşı tarafa bildirim” sıradan bir formalite değildir.',
        url: `${SITE}/icthat`,
        kunye: 'AYM, B. No: 2023/107440, 04.03.2026',
    },
    {
        id: 'aym-2023-59775',
        source: 'AYM',
        category: 'Bireysel Başvuru',
        title: 'Gerekçeli karar hakkı — esaslı savunma iddiaları',
        konu: 'Başvuru, terör örgütüne üye olma suçundan verilen mahkûmiyet kararlarında karar sonucunu değiştirebilecek nitelikteki esaslı iddiaların karşılanmaması nedeniyle gerekçeli karar hakkının ihlal edildiği iddiasına ilişkindir.',
        publicSummary:
            'Mahkeme, savunmanın sonucu değiştirebilecek önemli iddialarına hiç cevap vermeden mahkûmiyet vermiş. Anayasa Mahkemesi, gerekçeli karar hakkının ihlal edildiğine karar vermiştir. Mahkeme “neden” demek zorundadır; sessiz kalmak yetmez.',
        url: `${SITE}/icthat`,
        kunye: 'AYM, B. No: 2023/59775, 04.03.2026',
    },
    {
        id: 'aym-2023-68802',
        source: 'AYM',
        category: 'Bireysel Başvuru',
        title: 'AİHM ihlalinden sonra yargılamanın yenilenmesi',
        konu: 'Başvuru, Avrupa İnsan Hakları Mahkemesi tarafından verilen ihlal kararı sonrası yargılamanın yenilenmesi talebinin reddedilerek infazın devamına karar verilmesi nedeniyle kişi hürriyeti ve güvenliği hakkının ihlal edildiği iddiasına ilişkindir.',
        publicSummary:
            'AİHM hak ihlali bulmasına rağmen, yerel mahkeme yargılamayı yenilemeyi reddetmiş ve ceza infazı sürmüş. Anayasa Mahkemesi, kişi hürriyeti hakkının ihlal edildiği iddiasını incelemiştir. Uluslararası ihlal kararı “kağıt üstünde kalmamalı” mesajı taşır.',
        url: `${SITE}/icthat`,
        kunye: 'AYM, B. No: 2023/68802, 06.05.2026',
    },
];

/** Last-resort mevzuat only if SOCIAL_ALLOW_MEVZUAT=1 */
const MEVZUAT_TOPICS = [
    {
        id: 'mevzuat-tbk-112',
        source: 'TBK',
        category: 'Borçlar',
        title: 'TBK m. 112 — Borçlunun temerrüdü',
        konu: 'Borçlu, ifa için belirlenmiş vadeyi geçirirse alacaklı temerrüt hükümlerine başvurabilir.',
        publicSummary:
            'Vadesi gelen borç ödenmezse temerrüt doğabilir. Alacaklı ödemeyi isteme, gecikme zararını talep etme ve şartları varsa sözleşmeden dönme yollarını düşünebilir.',
        url: `${SITE}/mevzuat/tbk/madde-112`,
        kunye: 'TBK m. 112',
    },
];

const COURT_SOURCES = /Yargıtay|Yargitay|AYM|AİHM|Danıştay|YİBK/i;
const BAD_SUMMARY =
    /Maalesef|yardımcı olmaya hazırım|hukuki konu yazılmamış|anlayamadım|Açıklaması gereken|Lütfen hangi|AFFAIRE|Violation de|CASE OF|Violation of|ikinci derece mahkemesi.*numarası budur/i;

function normalizeItem(item, sourceFallback = '') {
    const source = item.source || item.sourceLabel || sourceFallback || 'Hukuk';
    const summary = (item.publicSummary || item.konu || item.caseName || item.title || '').trim();
    if (!summary || summary.length < 40) return null;
    return {
        id: item.id || `${source}-${Date.now()}`,
        source,
        category: item.category || '',
        title: item.title || item.caseName || item.kunye || source,
        konu: item.konu || summary.slice(0, 200),
        publicSummary: summary.slice(0, 900),
        kunye: item.kunye || item.appNo || '',
        url: item.url || `${SITE}/icthat`,
        date: item.date || '',
    };
}

function isWeakTopic(p) {
    if (!p?.publicSummary || p.publicSummary.length < 80) return true;
    if (BAD_SUMMARY.test(p.publicSummary)) return true;
    if (BAD_SUMMARY.test(p.konu || '')) return true;
    if (BAD_SUMMARY.test(p.title || '')) return true;
    if (/AFFAIRE|c\. TÜRKİYE/i.test(p.title || '')) return true;
    return false;
}

function isCourtTopic(p) {
    return COURT_SOURCES.test(p?.source || '') || COURT_SOURCES.test(p?.category || '');
}

function isMevzuatTopic(p) {
    return /TBK|TMK|İşK|HMK|İİK|TCK|RG|mevzuat/i.test(p?.source || '') || /mevzuat-/i.test(p?.id || '');
}

function fromHighlights(list) {
    return (list || []).map((h) => normalizeItem(h)).filter(Boolean);
}

function fromItemsBucket(items) {
    if (!items || typeof items !== 'object') return [];
    const out = [];
    // Prefer court buckets first
    const order = ['yargitay', 'aym', 'hudoc', 'resmigazete', 'mevzuat'];
    const keys = [...new Set([...order, ...Object.keys(items)])];
    for (const key of keys) {
        const arr = items[key];
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

async function loadArchiveCourtPool() {
    if (!existsSync(ARCHIVE_DIR)) return [];
    const files = (await readdir(ARCHIVE_DIR))
        .filter((f) => f.endsWith('.json'))
        .sort()
        .reverse();
    const out = [];
    const seen = new Set();
    for (const f of files.slice(0, 60)) {
        const data = await loadJson(join(ARCHIVE_DIR, f));
        if (!data) continue;
        let pool = fromHighlights(data.highlights);
        pool = pool.concat(fromItemsBucket(data.items));
        for (const p of pool) {
            if (!p || seen.has(p.id) || isWeakTopic(p) || !isCourtTopic(p)) continue;
            // Prefer konu (official) over broken publicSummary when available
            if ((p.konu || '').length > 80 && isWeakTopic({ ...p, publicSummary: p.publicSummary })) {
                p.publicSummary = p.konu;
            }
            if (isWeakTopic(p)) continue;
            seen.add(p.id);
            out.push(p);
        }
        if (out.length >= 20) break;
    }
    return out;
}

function rotated(list) {
    if (!list.length) return [];
    const day = new Date().getUTCDate();
    const i = day % list.length;
    return [...list.slice(i), ...list.slice(0, i)];
}

/**
 * @param {number} count
 * @returns {Promise<object[]>}
 */
export async function getSocialTopics(count = 2) {
    // Explicit override: only mevzuat (legacy)
    if (process.env.SOCIAL_PREFER_MEVZUAT === '1') {
        return rotated(MEVZUAT_TOPICS).map(normalizeItem).filter(Boolean).slice(0, count);
    }

    // Force curated court seeds
    if (process.env.SOCIAL_PREFER_COURT === '1') {
        return rotated(COURT_TOPICS).map(normalizeItem).filter(Boolean).slice(0, count);
    }

    const daily = await loadJson(DAILY_PATH);
    let pool = [];

    if (daily) {
        pool = fromHighlights(daily.highlights);
        if (pool.length < count) pool = pool.concat(fromItemsBucket(daily.items));
    }

    const arch = await loadArchiveCourtPool();
    pool = pool.concat(arch);

    // Prefer official konu text when publicSummary is weak
    pool = pool.map((p) => {
        if (isWeakTopic(p) && (p.konu || '').length >= 80) {
            return { ...p, publicSummary: p.konu };
        }
        return p;
    });

    const seen = new Set();
    const courts = [];
    const other = [];
    for (const p of pool) {
        if (!p || isWeakTopic(p) || seen.has(p.id)) continue;
        if (isMevzuatTopic(p) && process.env.SOCIAL_ALLOW_MEVZUAT !== '1') continue;
        seen.add(p.id);
        if (isCourtTopic(p)) courts.push(p);
        else other.push(p);
    }

    let result = courts.slice(0, count);

    if (result.length < count) {
        for (const c of rotated(COURT_TOPICS).map(normalizeItem).filter(Boolean)) {
            if (seen.has(c.id)) continue;
            result.push(c);
            seen.add(c.id);
            if (result.length >= count) break;
        }
    }

    // Last resort: non-court (if any) or mevzuat when allowed
    if (result.length < count) {
        for (const o of other) {
            result.push(o);
            if (result.length >= count) break;
        }
    }
    if (result.length < count && process.env.SOCIAL_ALLOW_MEVZUAT === '1') {
        for (const m of rotated(MEVZUAT_TOPICS).map(normalizeItem).filter(Boolean)) {
            if (seen.has(m.id)) continue;
            result.push(m);
            if (result.length >= count) break;
        }
    }

    return result.slice(0, count);
}

export { SITE, COURT_TOPICS, MEVZUAT_TOPICS };
