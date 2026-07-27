/**
 * Haftalık forum / grup cevap taslakları (otomatik paylaşım YOK).
 *
 * Kaynak: lib/kavramlar miniCevap + daily highlights + hesaplama linkleri
 * Çıktı: logs/forum-drafts/YYYY-MM-DD.md + .json
 *
 * Usage: node scripts/forum-draft.js [--count 5]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'logs', 'forum-drafts');
const SITE = 'https://avfethiguzel.com';

function parseCount() {
    const i = process.argv.indexOf('--count');
    if (i >= 0 && process.argv[i + 1]) return Math.max(1, Math.min(12, Number(process.argv[i + 1]) || 5));
    return Number(process.env.FORUM_DRAFT_COUNT || 5);
}

function loadKavramlar() {
    const src = readFileSync(join(ROOT, 'lib', 'kavramlar.ts'), 'utf8');
    const blocks = src.split(/slug:\s*'/).slice(1);
    const list = [];
    for (const b of blocks) {
        const slug = b.match(/^([^']+)'/)?.[1];
        const baslik = b.match(/baslik:\s*'((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'");
        const mini = b.match(/miniCevap:\s*'((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'")?.replace(/\\n/g, '\n');
        if (slug && baslik && mini) list.push({ slug, baslik, miniCevap: mini });
    }
    return list;
}

function loadDailyTitles() {
    const p = join(ROOT, 'public/data/daily.json');
    if (!existsSync(p)) return [];
    try {
        const j = JSON.parse(readFileSync(p, 'utf8'));
        const pool = [];
        const arr = (v) => (Array.isArray(v) ? v : v && typeof v === 'object' ? Object.values(v) : []);
        for (const x of [...arr(j.highlights), ...arr(j.items)]) {
            if (x?.title) pool.push(String(x.title));
        }
        return pool.slice(0, 8);
    } catch {
        return [];
    }
}

function pick(arr, n, seed) {
    if (!arr.length) return [];
    const out = [];
    const used = new Set();
    let s = seed;
    for (let i = 0; i < n && used.size < arr.length; i++) {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        const idx = s % arr.length;
        if (used.has(idx)) {
            i--;
            continue;
        }
        used.add(idx);
        out.push(arr[idx]);
    }
    return out;
}

function main() {
    const count = parseCount();
    const date = new Date().toISOString().slice(0, 10);
    const kavramlar = loadKavramlar();
    const daily = loadDailyTitles();
    const seed = Number(date.replace(/-/g, '')) || Date.now();
    const selected = pick(kavramlar, count, seed);

    const items = selected.map((k, i) => {
        const platformHint =
            i % 3 === 0 ? 'Ekşi / uzun forum' : i % 3 === 1 ? 'LinkedIn / meslek grubu' : 'Facebook / yerel grup';
        return {
            id: i + 1,
            platformHint,
            topic: k.baslik,
            kavramSlug: k.slug,
            kavramUrl: `${SITE}/kavram/${k.slug}`,
            body: k.miniCevap,
            tips: [
                'Spam yapmayın; soruya özel 1 cümle ekleyin.',
                'Sonuç vaadi / “en iyi avukat” ifadesi kullanmayın.',
                'Gerekirse sadece kavram veya madde linkini bırakın.',
            ],
        };
    });

    // Bonus: günlük içtihattan 1 “tartışma konusu” satırı
    if (daily[0]) {
        items.push({
            id: items.length + 1,
            platformHint: 'İçtihat tartışması (dikkatli)',
            topic: `Güncel: ${daily[0].slice(0, 80)}`,
            kavramSlug: null,
            kavramUrl: `${SITE}/icthat`,
            body: `Bugünkü taramada öne çıkan bir gelişme var; somut dosyaya uygulamadan önce karar metnini okumak gerekir.\n\nÖzet başlık: ${daily[0]}\nGünlük içtihat: ${SITE}/icthat\nHaftalık özet: ${SITE}/icthat/haftalik\n\n— Av. Fethi Güzel · bilgilendirme (sonuç vaadi yok)`,
            tips: ['Karar metnini okumadan yorum yapmayın.', 'Müvekkil sırrı ifşa etmeyin.'],
        });
    }

    mkdirSync(OUT, { recursive: true });
    const jsonPath = join(OUT, `${date}.json`);
    const mdPath = join(OUT, `${date}.md`);

    const payload = {
        date,
        generatedAt: new Date().toISOString(),
        status: 'pending_review',
        note: 'Otomatik paylaşım yok. Onaylayıp forum/gruplara elle yapıştırın.',
        items,
    };
    writeFileSync(jsonPath, JSON.stringify(payload, null, 2), 'utf8');

    let md = `# Forum / grup taslakları — ${date}\n\n`;
    md += `> Otomatik üretim. **Yayın yok.** Gözden geçirip elle paylaşın.\n\n`;
    md += `Durum: \`${payload.status}\`\n\n---\n\n`;
    for (const it of items) {
        md += `## ${it.id}. ${it.topic}\n\n`;
        md += `- Platform önerisi: **${it.platformHint}**\n`;
        if (it.kavramUrl) md += `- Sayfa: ${it.kavramUrl}\n`;
        md += `\n### Metin\n\n\`\`\`\n${it.body}\n\`\`\`\n\n`;
        md += `### İpuçları\n${it.tips.map((t) => `- ${t}`).join('\n')}\n\n---\n\n`;
    }
    md += `Kavram listesi: ${SITE}/kavram\n`;
    writeFileSync(mdPath, md, 'utf8');

    console.log(`[forum-draft] ${items.length} items → ${mdPath}`);
    console.log('[forum-draft] OTOMATİK PAYLAŞIM YOK — logs/forum-drafts/ klasörünü okuyun.');
}

main();
