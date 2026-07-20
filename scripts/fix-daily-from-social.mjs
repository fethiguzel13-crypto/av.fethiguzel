/**
 * Rebuild public/data/daily.json highlights from today's social draft topics
 * so the homepage "Güncel" section and /icthat show content when scrape is empty.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');
const date = process.argv[2] || new Date().toISOString().slice(0, 10);

const dailyPath = join(ROOT, 'public', 'data', 'daily.json');
const draftPath = join(ROOT, 'logs', 'social-drafts', `${date}.json`);

const daily = JSON.parse(await readFile(dailyPath, 'utf8'));
const draft = JSON.parse(await readFile(draftPath, 'utf8'));

const TR_MONTHS = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];
const d = new Date(`${date}T12:00:00Z`);
const dateLabel = `${d.getUTCDate()} ${TR_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;

function toAymItem(topic) {
    const basvuruNo = (topic.kunye || '').match(/B\.\s*No:\s*([\d/]+)/)?.[1] || '';
    return {
        id: topic.id,
        source: 'AYM',
        sourceLabel: 'Anayasa Mahkemesi',
        category: topic.category || 'Bireysel Başvuru',
        icon: 'landmark',
        title: topic.title,
        kunye: topic.kunye || '',
        basvuruNo,
        konu: topic.konu || '',
        publicSummary: topic.publicSummary || '',
        date,
        url: topic.url || 'https://avfethiguzel.com/icthat',
    };
}

const extras = [
    {
        id: 'aym-2023-59775',
        source: 'AYM',
        sourceLabel: 'Anayasa Mahkemesi',
        category: 'Bireysel Başvuru',
        icon: 'landmark',
        title: 'Gerekçeli karar hakkı — esaslı savunma iddiaları',
        kunye: 'AYM, B. No: 2023/59775, 04.03.2026',
        basvuruNo: '2023/59775',
        konu:
            'Başvuru, terör örgütüne üye olma suçundan verilen mahkûmiyet kararlarında karar sonucunu değiştirebilecek nitelikteki esaslı iddiaların karşılanmaması nedeniyle gerekçeli karar hakkının ihlal edildiği iddiasına ilişkindir.',
        publicSummary:
            'Mahkeme, savunmanın sonucu değiştirebilecek önemli iddialarına hiç cevap vermeden mahkûmiyet vermiş. Anayasa Mahkemesi, gerekçeli karar hakkının ihlal edildiğine karar vermiştir. Mahkeme "neden" demek zorundadır; sessiz kalmak yetmez.',
        date,
        url: 'https://avfethiguzel.com/icthat',
    },
    {
        id: 'aym-2023-68802',
        source: 'AYM',
        sourceLabel: 'Anayasa Mahkemesi',
        category: 'Bireysel Başvuru',
        icon: 'landmark',
        title: 'AİHM ihlalinden sonra yargılamanın yenilenmesi',
        kunye: 'AYM, B. No: 2023/68802, 06.05.2026',
        basvuruNo: '2023/68802',
        konu:
            'Başvuru, Avrupa İnsan Hakları Mahkemesi tarafından verilen ihlal kararı sonrası yargılamanın yenilenmesi talebinin reddedilerek infazın devamına karar verilmesi nedeniyle kişi hürriyeti ve güvenliği hakkının ihlal edildiği iddiasına ilişkindir.',
        publicSummary:
            'AİHM hak ihlali bulmasına rağmen, yerel mahkeme yargılamayı yenilemeyi reddetmiş ve ceza infazı sürmüş. Anayasa Mahkemesi, kişi hürriyeti hakkının ihlal edildiği iddiasını incelemiştir. Uluslararası ihlal kararı "kağıt üstünde kalmamalı" mesajı taşır.',
        date,
        url: 'https://avfethiguzel.com/icthat',
    },
];

const aym = draft.items.map((it) => toAymItem(it.topic));
for (const e of extras) {
    if (!aym.find((x) => x.id === e.id)) aym.push(e);
}

const now = new Date();
daily.generatedAt = now.toISOString();
daily.dateLabel = dateLabel;
daily.items = daily.items || {};
daily.items.aym = aym;
daily.items.resmigazete = daily.items.resmigazete || [];
daily.items.yargitay = daily.items.yargitay || [];
daily.items.hudoc = daily.items.hudoc || [];
daily.items.mevzuat = daily.items.mevzuat || [];
daily.highlights = aym.slice(0, 4);
daily.stats = {
    totalItems: Object.values(daily.items).flat().length,
    perSource: Object.fromEntries(
        Object.entries(daily.items).map(([k, v]) => [k, Array.isArray(v) ? v.length : 0])
    ),
};
// Keep non-yargitay errors if any; scrape timeout noise is expected
daily.errors = Array.isArray(daily.errors)
    ? daily.errors.filter((e) => e?.source !== 'yargitay')
    : [];

await writeFile(dailyPath, JSON.stringify(daily, null, 2), 'utf8');
const archiveDir = join(ROOT, 'public', 'data', 'archive');
await mkdir(archiveDir, { recursive: true });
await writeFile(join(archiveDir, `${date}.json`), JSON.stringify(daily, null, 2), 'utf8');

console.log(
    `[fix-daily] ${dateLabel} highlights=${daily.highlights.length} aym=${aym.length} total=${daily.stats.totalItems}`
);
console.log('[fix-daily] highlights:', daily.highlights.map((h) => h.id).join(', '));
