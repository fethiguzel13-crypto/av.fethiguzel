/**
 * Unified maintenance orchestrator (tarife + weekly digest + link check offline).
 * Scheduled: weekly Monday 09:00 + monthly 1st 09:30
 */
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { appendFileSync, mkdirSync } from 'fs';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');
const logDir = join(ROOT, 'logs/maintenance');
mkdirSync(logDir, { recursive: true });
const logPath = join(logDir, 'startup-maintenance.log');

function log(msg) {
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    process.stdout.write(line);
    appendFileSync(logPath, line);
}

function run(script, args = []) {
    return new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [join(__dir, script), ...args], {
            cwd: ROOT,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: process.env,
        });
        let out = '';
        child.stdout.on('data', (d) => {
            out += d;
            process.stdout.write(d);
        });
        child.stderr.on('data', (d) => {
            out += d;
            process.stderr.write(d);
        });
        child.on('close', (code) => {
            if (code === 0) resolve(out);
            else reject(new Error(`${script} exit ${code}`));
        });
    });
}

async function main() {
    log('maintenance start');
    await run('check-tarifeler.js');
    await run('weekly-icthat-digest.js');
    try {
        await run('forum-draft.js', ['--count', process.env.FORUM_DRAFT_COUNT || '5']);
    } catch (e) {
        log('forum-draft soft-fail: ' + e.message);
    }
    try {
        await run('link-check.js');
    } catch (e) {
        log('link-check soft-fail: ' + e.message);
    }
    // Optional live probe if site is up
    if (process.env.LINK_CHECK_BASE || process.env.MAINTENANCE_LIVE === '1') {
        try {
            await run('link-check.js', [
                '--base',
                process.env.LINK_CHECK_BASE || 'https://avfethiguzel.com',
            ]);
        } catch (e) {
            log('live link-check: ' + e.message);
        }
    }
    log('maintenance done');
}

main().catch((e) => {
    log('fatal: ' + e.message);
    process.exit(1);
});
