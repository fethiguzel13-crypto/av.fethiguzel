#!/usr/bin/env node
/**
 * 554 vatandaş rehberini Gemini ile anlatı olarak yeniden yazar.
 *
 *   node scripts/rewrite-vatandas-gemini.mjs
 *   node scripts/rewrite-vatandas-gemini.mjs --slug kidem-tazminati-nasil-alinir
 *   node scripts/rewrite-vatandas-gemini.mjs --limit 5
 *   node scripts/rewrite-vatandas-gemini.mjs --force
 *   node scripts/rewrite-vatandas-gemini.mjs --concurrency 2
 *
 * Çıktı: lib/vatandas-rehberi/rewritten/<slug>.json
 * Durum: logs/vatandas-gemini-progress.json
 *
 * Yarıda kesilirse aynı komut kaldığı yerden devam eder.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readAuthored, readGenerated } from './lib/read-guides.mjs';
import {
    loadDotenv,
    collectSources,
    formatKaynak,
    SYSTEM_PROMPT,
    buildUserPrompt,
    validateDraft,
    assembleArticle,
    callGeminiJson,
    readSkeleton,
    listRewrittenSlugs,
    draftText,
} from './lib/vatandas-gemini-rewrite.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
loadDotenv(ROOT);

const OUT_DIR = join(ROOT, 'lib', 'vatandas-rehberi', 'rewritten');
const LOG_DIR = join(ROOT, 'logs');
const PROGRESS = join(LOG_DIR, 'vatandas-gemini-progress.json');
const TODAY = new Date().toISOString().slice(0, 10);

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(LOG_DIR, { recursive: true });

function argValue(flag) {
    const i = process.argv.indexOf(flag);
    if (i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')) return process.argv[i + 1];
    return null;
}

const FORCE = process.argv.includes('--force');
const ONLY = argValue('--slug');
const LIMIT = Number(argValue('--limit') || 0) || 0;
const CONCURRENCY = Math.max(1, Math.min(4, Number(argValue('--concurrency') || 2) || 2));

function loadProgress() {
    if (!existsSync(PROGRESS)) return { done: {}, failed: {}, startedAt: new Date().toISOString() };
    try {
        return JSON.parse(readFileSync(PROGRESS, 'utf8'));
    } catch {
        return { done: {}, failed: {}, startedAt: new Date().toISOString() };
    }
}

function saveProgress(p) {
    p.updatedAt = new Date().toISOString();
    writeFileSync(PROGRESS, JSON.stringify(p, null, 2));
}

function authoredBlob(a) {
    return [
        a.lead,
        a.keyInsight,
        ...(a.sections || []).flatMap((s) => [
            `## ${s.heading}`,
            ...(s.paragraphs || []),
            ...(s.bullets || []).map((b) => `- ${b}`),
        ]),
        ...(a.steps || []).map((s, i) => `${i + 1}. ${s}`),
        ...(a.faq || []).map((f) => `S: ${f.q}\nC: ${f.a}`),
    ]
        .filter(Boolean)
        .join('\n')
        .slice(0, 9000);
}

async function rewriteOne(base, authoredMap, progress) {
    const slug = base.slug;
    const authored = authoredMap.get(slug);
    const skeleton = readSkeleton(ROOT, slug);
    const sources = collectSources(ROOT, authored || base, {
        authoredText: authored ? authoredBlob(authored) : '',
        skeleton,
    });
    const kaynak = formatKaynak(sources);
    const user = buildUserPrompt({
        article: authored || base,
        kaynak,
        isAuthored: Boolean(authored),
    });

    let draft;
    let errors = ['henüz yok'];
    for (let round = 0; round < 5; round++) {
        const prompt =
            round === 0
                ? user
                : user +
                `\n\nÖnceki çıktı reddedildi: ${errors.join('; ')}.\nEksiksiz JSON üret: 4-7 bölüm, 4-6 adım, 3-6 belge, 3-5 SSS. Yasak başlık yok.`;
        draft = await callGeminiJson({ system: SYSTEM_PROMPT, user: prompt, maxTokens: 8192 });
        errors = validateDraft(draft, { kaynak, requireSourceMaddes: Boolean(authored) });
        if (!errors.length) break;
        await new Promise((r) => setTimeout(r, 600 * (round + 1)));
    }
    if (errors.length) {
        throw new Error(errors.join('; '));
    }

    const article = assembleArticle(authored || base, draft, { today: TODAY });
    const path = join(OUT_DIR, `${slug}.json`);
    writeFileSync(path, `${JSON.stringify(article, null, 2)}\n`);

    const words = draftText(draft).split(/\s+/).filter(Boolean).length;
    progress.done[slug] = {
        ok: true,
        words,
        sections: article.sections.length,
        at: new Date().toISOString(),
        authored: Boolean(authored),
        kaynakMaddes: sources.articles.map((a) => `${a.kanunId}/${a.key}`),
    };
    delete progress.failed[slug];
    saveProgress(progress);
    return { slug, words };
}

async function pool(items, n, worker) {
    let i = 0;
    const runners = Array.from({ length: Math.min(n, items.length) }, async () => {
        while (i < items.length) {
            const item = items[i++];
            await worker(item);
        }
    });
    await Promise.all(runners);
}

async function main() {
    if (!process.env.GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY yok (.env)');
        process.exit(1);
    }

    const generated = readGenerated(ROOT);
    const authoredList = readAuthored(ROOT);
    const authoredMap = new Map(authoredList.map((a) => [a.slug, a]));
    const bySlug = new Map();
    for (const a of generated) bySlug.set(a.slug, a);
    for (const a of authoredList) {
        const g = bySlug.get(a.slug);
        bySlug.set(a.slug, g ? { ...g, ...a, links: a.links?.length ? a.links : g.links } : a);
    }

    const total = bySlug.size;
    const progress = loadProgress();
    const t0 = Date.now();
    let round = 0;

    while (true) {
        const already = new Set(listRewrittenSlugs(ROOT));
        let queue = [...bySlug.values()];
        if (ONLY) queue = queue.filter((a) => a.slug === ONLY);
        if (!FORCE) {
            queue = queue.filter((a) => !already.has(a.slug) && !progress.done[a.slug]);
        }
        if (LIMIT > 0) queue = queue.slice(0, LIMIT);

        if (!queue.length) {
            console.log(`[vatandas-gemini] bitti ${already.size}/${total}`);
            break;
        }

        round += 1;
        console.log(`[vatandas-gemini] tur=${round} kuyruk=${queue.length} toplam=${total} eşzamanlı=${CONCURRENCY}`);

        let ok = 0;
        let fail = 0;
        await pool(queue, CONCURRENCY, async (base) => {
            const label = base.slug;
            try {
                const r = await rewriteOne(base, authoredMap, progress);
                ok += 1;
                const elapsed = Math.round((Date.now() - t0) / 1000);
                console.log(`  ✓ ${r.slug}  ${r.words} kelime  (${already.size + ok}/${total}, ${elapsed}s)`);
            } catch (e) {
                fail += 1;
                progress.failed[label] = {
                    error: String(e.message || e).slice(0, 400),
                    at: new Date().toISOString(),
                    round,
                };
                saveProgress(progress);
                console.warn(`  ✗ ${label}: ${e.message}`);
            }
        });

        if (ONLY || LIMIT > 0) break;
        if (fail > 0) {
            const pause = ok === 0 ? 180000 : 90000;
            console.warn(`[vatandas-gemini] kota/hata, ${Math.round(pause / 1000)}s bekleniyor`);
            await new Promise((r) => setTimeout(r, pause));
        }
    }

    const finalFiles = listRewrittenSlugs(ROOT).length;
    if (!ONLY && !LIMIT && finalFiles < total) {
        console.error(`[vatandas-gemini] eksik ${total - finalFiles}`);
        process.exit(1);
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
