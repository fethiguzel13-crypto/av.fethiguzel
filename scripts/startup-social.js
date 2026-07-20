/**
 * Daily social orchestrator (draft-first by default).
 *
 * SOCIAL_AUTO_POST=1 → publish after draft (NOT recommended until you approve quality)
 * Default → only generate drafts under logs/social-drafts/
 *
 * Windows Task Scheduler: daily 10:00
 */
import { spawn } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');

function run(script, args = []) {
    return new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [join(__dir, script), ...args], {
            cwd: ROOT,
            env: process.env,
            stdio: 'inherit',
        });
        child.on('exit', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`${script} exited ${code}`));
        });
    });
}

async function alreadyDraftedToday() {
    const date = new Date().toISOString().slice(0, 10);
    const p = join(ROOT, 'logs', 'social-drafts', `${date}.json`);
    if (!existsSync(p)) return false;
    try {
        const d = JSON.parse(await readFile(p, 'utf-8'));
        return Boolean(d.generatedAt);
    } catch {
        return false;
    }
}

async function main() {
    console.log(`[startup-social] ${new Date().toISOString()}`);
    if (await alreadyDraftedToday()) {
        console.log('[startup-social] draft already exists today');
    } else {
        await run('social-draft.js', ['--count', process.env.SOCIAL_COUNT || '2']);
    }

    if (process.env.SOCIAL_AUTO_POST === '1') {
        console.log('[startup-social] SOCIAL_AUTO_POST=1 — publishing with --force');
        await run('social-publish.js', ['--force']);
    } else {
        console.log(
            '[startup-social] draft-only mode. Review logs/social-drafts/ then run social-publish.js'
        );
    }
}

main().catch((err) => {
    console.error('[startup-social] fatal:', err.message);
    process.exit(1);
});
