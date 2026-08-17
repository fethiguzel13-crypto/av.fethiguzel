#!/usr/bin/env node
/**
 * Çevrimdışı uygulama derleyici.
 *
 *   node scripts/build-app.mjs                 # dört uygulama
 *   node scripts/build-app.mjs --app=hesap     # tek uygulama
 *   node scripts/build-app.mjs --dev-prepare   # yalnız veriyi hazırla
 *
 * Her flavor için Vite'i GALAXY_APP ile çalıştırır; çıktı
 * flavors/<id>/www klasörüne yazılır. Aynı kaynak ağacından dört farklı
 * uygulama çıkar — her biri kendi içeriğini ve rengini taşır.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, statSync, rmSync, mkdirSync, cpSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const mobile = join(here, '..');
const isWin = process.platform === 'win32';

const args = process.argv.slice(2);
const appArg = (args.find((a) => a.startsWith('--app=')) || '--app=all').split('=')[1];
const devPrepare = args.includes('--dev-prepare');

const APPS = ['portal', 'hesap', 'icthat', 'rehber'];
const targets = appArg === 'all' ? APPS : [appArg];

for (const t of targets) {
  if (!APPS.includes(t)) {
    console.error(`Bilinmeyen uygulama: ${t}`);
    console.error(`Geçerli: ${APPS.join(', ')} veya all`);
    process.exit(1);
  }
}

function run(cmd, cmdArgs, env = {}, cwd = mobile) {
  execFileSync(cmd, cmdArgs, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, ...env },
    shell: isWin,
  });
}

// ── 1. Veri hazırlığı ───────────────────────────────────────────────────────
console.log('── veri hazırlanıyor');
run('node', ['scripts/build-icthat-data.mjs']);
run('node', ['scripts/build-rehber-data.mjs']);

const portal = join(mobile, '..');
const dataSrc = join(mobile, 'data-src');
const publicDir = join(mobile, 'app-src', 'public');

const portalPacks = join(portal, 'public', 'app-packs');
if (!existsSync(join(portalPacks, 'manifest.json'))) {
  console.log('   uygulama paketleri yok, portalda üretiliyor…');
  run('node', ['scripts/build-app-packs.mjs'], {}, portal);
}
run('node', ['scripts/sync-packs.mjs']);

if (!existsSync(join(dataSrc, 'packs', 'manifest.json'))) {
  console.error('paket manifesti üretilemedi — derleme durduruldu');
  process.exit(1);
}

/**
 * Hangi uygulama hangi varlığı taşır.
 *
 * Mevzuat paketi 2,9 MB; hesap ve rehber uygulamalarının ona ihtiyacı yok.
 * İçtihat tohumu da yalnız içtihat uygulamasına girer.
 */
const ASSETS = {
  portal: ['packs'],
  icthat: ['icthat'],
  rehber: ['rehber'],
  hesap: [],
};

/** Seçilen uygulamanın varlıklarını app-src/public'e yerleştirir. */
function stageAssets(app) {
  rmSync(publicDir, { recursive: true, force: true });
  mkdirSync(publicDir, { recursive: true });
  for (const name of ASSETS[app] ?? []) {
    const from = join(dataSrc, name);
    if (!existsSync(from)) {
      console.error(`  ! ${app}: ${name} varlığı yok (${from})`);
      process.exit(1);
    }
    cpSync(from, join(publicDir, name), { recursive: true });
  }
}

if (devPrepare) {
  stageAssets(targets[0] ?? 'portal');
  console.log(`── veri hazır (dev · ${targets[0] ?? 'portal'})`);
  process.exit(0);
}

// ── 2. Flavor derlemeleri ───────────────────────────────────────────────────
const builtAt = new Date().toISOString();
const results = [];

for (const app of targets) {
  console.log(`\n── ${app} derleniyor`);
  const out = join(mobile, 'flavors', app, 'www');
  if (existsSync(out)) rmSync(out, { recursive: true, force: true });

  stageAssets(app);

  run('npx', ['vite', 'build', '--config', 'vite.config.mjs'], {
    GALAXY_APP: app,
    GALAXY_BUILT_AT: builtAt,
    NODE_ENV: 'production',
  });

  if (!existsSync(join(out, 'index.html'))) {
    console.error(`${app}: index.html üretilmedi`);
    process.exit(1);
  }
  results.push({ app, bytes: dirSize(out), files: countFiles(out) });
}

console.log('\n── özet');
for (const r of results) {
  console.log(
    `  ${r.app.padEnd(8)} ${String(r.files).padStart(4)} dosya  ${(r.bytes / 1048576).toFixed(2)} MB`
  );
}
console.log('\nSonraki adım:  node scripts/build-flavor.mjs --app=<id> && npx cap sync android');

function dirSize(dir) {
  let total = 0;
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name);
    total += f.isDirectory() ? dirSize(p) : statSync(p).size;
  }
  return total;
}

function countFiles(dir) {
  let n = 0;
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    n += f.isDirectory() ? countFiles(join(dir, f.name)) : 1;
  }
  return n;
}
