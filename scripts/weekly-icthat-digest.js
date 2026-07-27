/**
 * Haftalık içtihat özeti: daily.json + arşivden son 7 gün / öne çıkanlar.
 * Usage: node scripts/weekly-icthat-digest.js
 * Output: public/data/weekly-digests/YYYY-Www.json + logs/maintenance/
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function weekKey(d = new Date()) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
    return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function loadDaily() {
    const p = join(ROOT, 'public/data/daily.json');
    if (!existsSync(p)) return { highlights: [], items: [] };
    try {
        return JSON.parse(readFileSync(p, 'utf8'));
    } catch {
        return { highlights: [], items: [] };
    }
}

function asArray(v) {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (typeof v === 'object') return Object.values(v);
    return [];
}

function main() {
    const daily = loadDaily();
    const pool = [];
    for (const x of asArray(daily.highlights)) pool.push(x);
    for (const x of asArray(daily.items)) {
        if (pool.length >= 12) break;
        if (!pool.some((p) => p.id && p.id === x.id)) pool.push(x);
    }

    // Optional archive folder
    const arch = join(ROOT, 'public/data/daily-archive');
    if (existsSync(arch)) {
        const files = readdirSync(arch)
            .filter((f) => f.endsWith('.json'))
            .sort()
            .reverse()
            .slice(0, 7);
        for (const f of files) {
            try {
                const j = JSON.parse(readFileSync(join(arch, f), 'utf8'));
                for (const x of j.highlights || j.items || []) {
                    if (pool.length >= 20) break;
                    if (!pool.some((p) => p.id && x.id && p.id === x.id)) pool.push(x);
                }
            } catch {
                /* skip */
            }
        }
    }

    const items = pool.slice(0, 8).map((x) => ({
        title: x.title || x.headline || 'Gelişme',
        summary: x.summary || x.citizenSummary || x.snippet || '',
        source: x.source || x.court || x.origin || 'İçtihat taraması',
        href: x.id ? `/icthat/${x.id}` : x.href || '/icthat',
    }));

    const weekOf = weekKey();
    const digest = {
        weekOf,
        generatedAt: new Date().toISOString(),
        items,
    };

    const outDir = join(ROOT, 'public/data/weekly-digests');
    mkdirSync(outDir, { recursive: true });
    const outPath = join(outDir, `${weekOf}.json`);
    writeFileSync(outPath, JSON.stringify(digest, null, 2), 'utf8');

    const logDir = join(ROOT, 'logs/maintenance');
    mkdirSync(logDir, { recursive: true });
    const md = [
        `# Haftalık içtihat — ${weekOf}`,
        '',
        `Üretim: ${digest.generatedAt}`,
        '',
        ...items.map((it, i) => `## ${i + 1}. ${it.title}\n\n${it.summary || '_özet yok_'}\n\n- ${it.source}\n- ${it.href}\n`),
        '',
        'Site: /icthat/haftalik',
        '',
    ].join('\n');
    writeFileSync(join(logDir, `weekly-${weekOf}.md`), md, 'utf8');

    console.log(`[weekly-digest] ${items.length} items → ${outPath}`);
}

main();
