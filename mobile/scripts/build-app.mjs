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
import { existsSync, readdirSync, readFileSync, statSync, rmSync, mkdirSync, cpSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const mobile = join(here, '..');
const isWin = process.platform === 'win32';

const args = process.argv.slice(2);
const appArg = (args.find((a) => a.startsWith('--app=')) || '--app=all').split('=')[1];
const devPrepare = args.includes('--dev-prepare');

const catalog = JSON.parse(readFileSync(join(mobile, 'galaxy', 'catalog.json'), 'utf8'));

/**
 * Derlenebilir tüm uygulamalar ve `--app=all`'ın anlamı.
 *
 * Dört ayrı uygulama `asistan` içinde birleştirildi. Eskiler katalogda
 * `published:false` ile duruyor: adıyla istenirse hâlâ derlenirler (geçmişi
 * kurtarmak ya da karşılaştırmak için), ama `all` yalnız YAYINDA olanları
 * derler — yoksa CI her seferinde yayınlanmayacak dört arayüzü de üretirdi.
 */
const APPS = catalog.apps.map((a) => a.id);
const PUBLISHED = catalog.apps.filter((a) => a.published === true).map((a) => a.id);
const targets = appArg === 'all' ? PUBLISHED : [appArg];

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
/**
 * Hangi uygulama hangi varlığı taşır — KATALOGDAN okunur.
 *
 * Mevzuat paketi 2,9 MB; eski `hesap` uygulamasının ona ihtiyacı yoktu.
 * Birleşik uygulama üçünü de taşır. Liste burada değil katalogda durur,
 * çünkü verify-release.mjs da aynı listeden beklenen dosyaları türetiyor.
 */
const ASSETS = Object.fromEntries(catalog.apps.map((a) => [a.id, a.assets ?? []]));

/**
 * Giriş ekranındaki sayılar — derleme anında GERÇEK veriden okunur.
 *
 * Elle yazılan sayı kaçınılmaz olarak kayar: külliyat büyür, rehber eklenir,
 * arşiv her gün genişler. Burada üretilen değerler `__GALAXY_STATS__` olarak
 * arayüze enjekte edilir, böylece ekrandaki rakam her derlemede kendini
 * günceller ve hiçbir zaman uydurma olmaz.
 */
function computeStats(staged) {
  const stats = {};

  const manifest = join(dataSrc, 'packs', 'manifest.json');
  if (staged.includes('packs') && existsSync(manifest)) {
    const m = JSON.parse(readFileSync(manifest, 'utf8'));
    stats.laws = Array.isArray(m.packs) ? m.packs.length : 0;
    stats.articles = m.totalArticles ?? 0;
  }

  const guides = join(dataSrc, 'rehber', 'guides.json.gz');
  if (staged.includes('rehber') && existsSync(guides)) {
    const list = JSON.parse(gunzipSync(readFileSync(guides)).toString());
    stats.guides = Array.isArray(list) ? list.length : 0;
  }

  const archive = join(dataSrc, 'icthat', 'archive.json.gz');
  if (staged.includes('icthat') && existsSync(archive)) {
    const list = JSON.parse(gunzipSync(readFileSync(archive)).toString());
    stats.decisions = Array.isArray(list) ? list.length : 0;
  }

  // Hesaplama araçları portalın kaynağında tanımlı; sayı oradan sayılır.
  const meta = join(portal, 'lib', 'hesaplama-meta.ts');
  if (existsSync(meta)) {
    stats.tools = (readFileSync(meta, 'utf8').match(/^\s{8}id: '/gm) || []).length;
  }

  return stats;
}

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
    GALAXY_STATS: JSON.stringify(computeStats(ASSETS[app] ?? [])),
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
