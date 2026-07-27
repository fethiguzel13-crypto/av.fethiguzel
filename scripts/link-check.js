/**
 * İç link sağlığı: sitemap rotaları + bilinen statik sayfalar.
 * Usage: node scripts/link-check.js [--base https://avfethiguzel.com]
 * Default base: http://127.0.0.1:3000 if REACHABLE else only offline path checks
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const STATIC = [
    '/',
    '/hesaplama',
    '/hesaplama/kidem',
    '/hesaplama/miras',
    '/hesaplama/faiz',
    '/mevzuat',
    '/ara',
    '/icthat',
    '/icthat/haftalik',
    '/tarife-guncellemeleri',
    '/on-form',
    '/e-durusma',
    '/bookmarklet',
    '/ar',
    '/avukat-fethi-guzel',
    '/akademik-profil',
    '/english-speaking-lawyer',
    '/gizlilik',
    '/yasal-uyari',
    '/site-haritasi',
    '/rehber',
    '/hizmet-bolgeleri',
];

function parseArgs() {
    const a = process.argv.slice(2);
    let base = process.env.LINK_CHECK_BASE || '';
    for (let i = 0; i < a.length; i++) {
        if (a[i] === '--base' && a[i + 1]) base = a[++i];
    }
    return { base };
}

async function probe(base, path) {
    const url = base.replace(/\/$/, '') + path;
    try {
        const res = await fetch(url, { method: 'GET', redirect: 'follow' });
        return { path, status: res.status, ok: res.status >= 200 && res.status < 400 };
    } catch (e) {
        return { path, status: 0, ok: false, error: e.message };
    }
}

async function main() {
    const { base } = parseArgs();
    const logDir = join(ROOT, 'logs/maintenance');
    mkdirSync(logDir, { recursive: true });

    // Offline: ensure meta ids have tool pages in registry
    let metaIds = [];
    try {
        const metaSrc = readFileSync(join(ROOT, 'lib/hesaplama-meta.ts'), 'utf8');
        metaIds = [...metaSrc.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1]);
    } catch {
        /* ignore */
    }

    const offline = {
        generatedAt: new Date().toISOString(),
        metaToolCount: metaIds.length,
        staticPaths: STATIC.length,
    };

    if (!base) {
        const report = {
            ...offline,
            mode: 'offline',
            note: 'HTTP kontrolü için: node scripts/link-check.js --base https://avfethiguzel.com',
            sampleToolIds: metaIds.slice(0, 10),
        };
        writeFileSync(join(logDir, 'link-check-latest.json'), JSON.stringify(report, null, 2));
        console.log('[link-check] offline mode — meta tools:', metaIds.length);
        return;
    }

    const results = [];
    for (const path of STATIC) {
        results.push(await probe(base, path));
    }
    // Sample tool pages from meta
    for (const id of metaIds.slice(0, 15)) {
        results.push(await probe(base, `/hesaplama/${id}`));
    }

    const bad = results.filter((r) => !r.ok);
    const report = {
        ...offline,
        mode: 'http',
        base,
        checked: results.length,
        failed: bad.length,
        bad,
        results,
    };
    writeFileSync(join(logDir, 'link-check-latest.json'), JSON.stringify(report, null, 2));
    const md = [
        `# Link check ${report.generatedAt}`,
        `Base: ${base}`,
        `OK: ${results.length - bad.length} / ${results.length}`,
        '',
        bad.length ? '## Failures\n' + bad.map((b) => `- ${b.path} → ${b.status} ${b.error || ''}`).join('\n') : 'All sampled paths OK.',
        '',
    ].join('\n');
    writeFileSync(join(logDir, 'link-check-latest.md'), md);
    console.log(`[link-check] ${results.length - bad.length}/${results.length} OK`);
    if (bad.length) {
        console.log('[link-check] failures:', bad.map((b) => b.path).join(', '));
        process.exitCode = 1;
    }
}

main();
