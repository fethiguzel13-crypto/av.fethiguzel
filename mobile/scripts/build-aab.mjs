#!/usr/bin/env node
/**
 * Yerel AAB üretimi — tek uygulama veya dördü birden.
 *
 *   node scripts/build-aab.mjs --app=hesap
 *   node scripts/build-aab.mjs --app=all
 *
 * Her uygulama için sırayla: flavor etkinleştir → cap sync → doğrula →
 * gradle bundleRelease → çıktıyı dist/ altına adıyla taşı.
 *
 * Gereken: JDK 21, Android SDK (ANDROID_HOME) ve android/keystore.properties.
 * Bunlar yoksa GitHub Actions iş akışı aynı adımları çalıştırır.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const isWin = process.platform === 'win32';
const catalog = JSON.parse(readFileSync(join(root, 'galaxy', 'catalog.json'), 'utf8'));

const appArg = (process.argv.find((a) => a.startsWith('--app=')) || '--app=all').split('=')[1];
const targets =
  appArg === 'all' ? catalog.apps : catalog.apps.filter((a) => a.id === appArg);

if (!targets.length) {
  console.error(`Bilinmeyen uygulama: ${appArg}`);
  process.exit(1);
}

// ── Ön koşullar ─────────────────────────────────────────────────────────────
const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
if (!sdk || !existsSync(sdk)) {
  console.error('Android SDK bulunamadı (ANDROID_HOME / ANDROID_SDK_ROOT).');
  console.error('Yerel derleme için Android Studio kurun ya da GitHub Actions kullanın:');
  console.error('  Actions → Build Android AAB → Run workflow');
  process.exit(1);
}

const javaVersion = detectJava();
if (javaVersion && javaVersion < 21) {
  console.error(`JDK ${javaVersion} bulundu; Capacitor 7 için JDK 21 gerekir.`);
  console.error('JAVA_HOME değerini JDK 21 kurulumuna ayarlayın.');
  process.exit(1);
}

const dist = join(root, 'dist');
mkdirSync(dist, { recursive: true });

const built = [];

for (const app of targets) {
  console.log(`\n${'═'.repeat(60)}\n  ${app.id} — ${app.packageId} v${app.versionName}\n${'═'.repeat(60)}`);

  run('node', ['scripts/build-app.mjs', `--app=${app.id}`]);
  run('node', ['scripts/build-flavor.mjs', `--app=${app.id}`]);
  run('npx', ['cap', 'sync', 'android']);
  run('node', ['scripts/verify-release.mjs', `--app=${app.id}`]);

  const gradlew = isWin ? 'gradlew.bat' : './gradlew';
  run(gradlew, ['bundleRelease', '--no-daemon'], join(root, 'android'));

  const outDir = join(root, 'android', 'app', 'build', 'outputs', 'bundle', 'release');
  const aab = existsSync(outDir)
    ? readdirSync(outDir).find((f) => f.endsWith('.aab'))
    : null;
  if (!aab) {
    console.error(`${app.id}: AAB üretilmedi`);
    process.exit(1);
  }

  const target = join(dist, `${app.id}-${app.versionName}-${app.versionCode}.aab`);
  copyFileSync(join(outDir, aab), target);
  const size = statSync(target).size;
  built.push({ id: app.id, file: target, size });
  console.log(`  ✓ ${target} (${(size / 1048576).toFixed(1)} MB)`);
}

console.log(`\n${built.length} AAB üretildi → mobile/dist/`);
for (const b of built) {
  console.log(`  ${b.id.padEnd(8)} ${(b.size / 1048576).toFixed(1)} MB`);
}
console.log('\nPlay Console → Üretim → Yeni sürüm → bu dosyaları yükleyin.');

function run(cmd, args, cwd = root) {
  execFileSync(cmd, args, { cwd, stdio: 'inherit', shell: isWin });
}

function detectJava() {
  try {
    const out = execFileSync('java', ['-version'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: isWin,
    });
    const m = /version "(\d+)/.exec(out);
    return m ? Number(m[1]) : null;
  } catch {
    try {
      // java -version stderr'a yazar
      const out = execFileSync('java', ['-version'], { encoding: 'utf8', shell: isWin });
      const m = /version "(?:1\.)?(\d+)/.exec(out);
      return m ? Number(m[1]) : null;
    } catch {
      return null;
    }
  }
}
