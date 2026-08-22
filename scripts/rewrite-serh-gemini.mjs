#!/usr/bin/env node
/**
 * Kalıp/boş şerhleri Gemini ile maddeye özgü yeniden yazar. Kesilirse kaldığı yerden devam.
 *
 *   node scripts/rewrite-serh-gemini.mjs
 *   node scripts/rewrite-serh-gemini.mjs --limit 3
 *   node scripts/rewrite-serh-gemini.mjs --only tmk/194
 *   node scripts/rewrite-serh-gemini.mjs --concurrency 2
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadDotenv, listPending, rewriteOne } from './lib/serh-gemini.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
loadDotenv(ROOT);

const LOG_DIR = join(ROOT, 'logs');
mkdirSync(LOG_DIR, { recursive: true });
const PROGRESS = join(LOG_DIR, 'serh-gemini-progress.json');
const PENDING = join(LOG_DIR, 'serh-gemini-pending.json');

function argValue(flag) {
    const i = process.argv.indexOf(flag);
    if (i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')) return process.argv[i + 1];
    return null;
}

const LIMIT = Number(argValue('--limit') || 0) || 0;
const ONLY = argValue('--only');
const CONCURRENCY = Math.max(1, Math.min(6, Number(argValue('--concurrency') || 3) || 3));
const REFRESH = process.argv.includes('--refresh-pending');

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

function keyOf(it) {
    return `${it.kanunId}/${it.maddeNo}`;
}

let pending;
if (!REFRESH && existsSync(PENDING) && !ONLY) {
    pending = JSON.parse(readFileSync(PENDING, 'utf8'));
    console.log(`[serh-gemini] pending dosyası ${pending.length} madde`);
} else {
    console.log('[serh-gemini] pending taranıyor…');
    pending = listPending(ROOT);
    writeFileSync(PENDING, JSON.stringify(pending));
    console.log(`[serh-gemini] pending ${pending.length} madde yazıldı`);
}

if (ONLY) {
    const [kanunId, no] = ONLY.split('/');
    pending = [{ kanunId, maddeNo: Number(no), file: join(ROOT, 'content', 'mevzuat', kanunId, `madde-${no}.md`) }];
}

const progress = loadProgress();
progress.failed = {};
saveProgress(progress);
let queue = pending.filter((it) => {
    const k = keyOf(it);
    if (progress.done[k]) return false;
    const fails = progress.failed[k] || 0;
    return fails < 6;
});
if (LIMIT) queue = queue.slice(0, LIMIT);
console.log(`[serh-gemini] kuyruk ${queue.length}  concurrency ${CONCURRENCY}`);

async function worker(name) {
    while (queue.length) {
        const it = queue.shift();
        if (!it) return;
        const k = keyOf(it);
        try {
            const { next, words } = await rewriteOne(ROOT, it);
            writeFileSync(it.file, next);
            progress.done[k] = { words, at: new Date().toISOString() };
            delete progress.failed[k];
            saveProgress(progress);
            const leftNow = pending.filter((x) => !progress.done[keyOf(x)]).length;
            const doneN = Object.keys(progress.done).length;
            writeFileSync(join(LOG_DIR, 'serh-heartbeat.txt'), `${new Date().toISOString()} ok ${k} ${words} done=${doneN} left=${leftNow}\n`);
            console.log(`[ok] ${k} ${words} kelime  (${name})  done=${doneN} left=${leftNow}`);
        } catch (e) {
            const msg = String(e.message || e).slice(0, 180);
            const quota = /429|quota|soğuk|Gemini başarısız|HTTP 429/i.test(msg);
            if (quota) {
                console.warn(`[quota] ${k} — 50s, kuyruk başa`);
                queue.unshift(it);
                await new Promise((r) => setTimeout(r, 50000));
                continue;
            }
            progress.failed[k] = (progress.failed[k] || 0) + 1;
            saveProgress(progress);
            console.warn(`[fail] ${k} ${msg}`);
            if (progress.failed[k] < 8 && /kalite|JSON|empty|fetch/i.test(msg)) {
                queue.push(it);
                await new Promise((r) => setTimeout(r, 1200));
            }
        }
    }
}

const n = Math.min(CONCURRENCY, Math.max(1, queue.length));
await Promise.all(Array.from({ length: n }, (_, i) => worker(`w${i + 1}`)));
saveProgress(progress);
const left = pending.filter((it) => !progress.done[keyOf(it)]).length;
console.log(`[serh-gemini] done ${Object.keys(progress.done).length}  left ${left}`);
if (left && !LIMIT && !ONLY) process.exitCode = 1;
