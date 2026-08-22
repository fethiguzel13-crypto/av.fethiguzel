#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const script = join(ROOT, 'scripts', 'rewrite-serh-gemini.mjs');
const PROGRESS = join(ROOT, 'logs', 'serh-gemini-progress.json');
const PENDING = join(ROOT, 'logs', 'serh-gemini-pending.json');
let round = 0;

function remaining() {
    if (!existsSync(PENDING) || !existsSync(PROGRESS)) return -1;
    try {
        const pending = JSON.parse(readFileSync(PENDING, 'utf8'));
        const progress = JSON.parse(readFileSync(PROGRESS, 'utf8'));
        return pending.filter((it) => !progress.done[`${it.kanunId}/${it.maddeNo}`]).length;
    } catch {
        return -1;
    }
}

function run(args) {
    return new Promise((resolve) => {
        const child = spawn(process.execPath, [script, ...args], {
            cwd: ROOT,
            stdio: 'inherit',
            env: process.env,
        });
        child.on('close', (code) => resolve(code ?? 1));
    });
}

const hasPending = existsSync(PENDING);
const first = hasPending ? ['--concurrency', '3'] : ['--refresh-pending', '--concurrency', '3'];
const next = ['--concurrency', '3'];

while (true) {
    round += 1;
    console.log(`[serh-until-done] round ${round} remaining=${remaining()}`);
    const code = await run(round === 1 ? first : next);
    const left = remaining();
    if (left === 0) break;
    console.log(`[serh-until-done] child=${code} remaining=${left} — 12s`);
    await new Promise((r) => setTimeout(r, 12000));
}
writeFileSync(join(ROOT, 'logs', 'serh-until-done.FINISHED'), new Date().toISOString() + '\n');
console.log('[serh-until-done] bitti');
