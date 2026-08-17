#!/usr/bin/env node
/**
 * Galaxy flavor etkinleştirici — tek Android modülünden dört Play uygulaması.
 *
 *   node scripts/build-flavor.mjs --app=hesap
 *   node scripts/build-flavor.mjs --app=all      # hepsinin config'ini yaz, portal'ı etkinleştir
 *
 * Bir flavor "etkinleştirmek" şu dosyaları yazmak demektir:
 *
 *   flavors/<id>/capacitor.config.json    flavor'ın kendi ayarı
 *   flavors/<id>/meta.json                sürüm ve kimlik kaydı
 *   capacitor.config.json                 aktif flavor (cap sync bunu okur)
 *   www/                                  aktif flavor'ın derlenmiş arayüzü
 *   android/app/flavor.properties         applicationId, sürüm, ad, renk
 *   android/app/src/main/AndroidManifest.xml   derin bağlantı blokları
 *
 * ── Neden böyle ─────────────────────────────────────────────────────────────
 * Önceki sürüm yalnız capacitor.config.json'u değiştiriyor, Android kimliğini
 * yorum satırından ibaret bir .gradle parçacığına bırakıyordu. Sonuç: dört
 * flavor tanımlıydı ama gradle her zaman `com.avfethiguzel.hukuk` üretiyordu;
 * diğer üç uygulamanın AAB'sini almanın hiçbir yolu yoktu. Kimlik artık
 * build.gradle'ın okuduğu flavor.properties'ten gelir.
 *
 * server.url BİLİNÇLİ OLARAK YOK: uygulama kendi paketlediği arayüzü yükler.
 * Uzak URL'ye bağlanan Capacitor kabuğu, Play'in asgari işlevsellik
 * politikasında saf WebView sarmalayıcı sayılıyor.
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  cpSync,
  rmSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const catalog = JSON.parse(readFileSync(join(root, 'galaxy', 'catalog.json'), 'utf8'));

const args = process.argv.slice(2);
const appArg = (args.find((a) => a.startsWith('--app=')) || '--app=all').split('=')[1];
const langArg = (args.find((a) => a.startsWith('--lang=')) || '--lang=tr').split('=')[1];

const SITE = catalog.site || 'https://www.avfethiguzel.com';
const SCHEME = catalog.scheme || 'avfethiguzel';

/**
 * Her uygulamanın doğruladığı yol önekleri.
 *
 * Dört uygulama aynı alan adını paylaşıyor. Hepsi tüm siteyi sahiplenirse
 * Android bir bağlantıya tıklandığında hangi uygulamanın açılacağını
 * kullanıcıya sorar — kötü bir deneyim. Her uygulama yalnız kendi
 * bölümünü doğrular.
 */
const LINK_PATHS = {
  // Birleşik uygulama dört bölümün de yollarını sahiplenir. Artık tek
  // uygulama olduğu için "hangi uygulama açılsın?" sorusu doğmaz.
  asistan: [
    '/mevzuat',
    '/ara',
    '/kavram',
    '/hesaplama',
    '/icthat',
    '/yargi-kararlari',
    '/bilgi',
    '/rehber',
  ],
  portal: ['/mevzuat', '/ara', '/kavram'],
  hesap: ['/hesaplama'],
  icthat: ['/icthat', '/yargi-kararlari'],
  rehber: ['/bilgi', '/rehber'],
};

const HOSTS = ['www.avfethiguzel.com', 'avfethiguzel.com'];

function nameOf(app, lang) {
  return app.name[lang] || app.name.en || app.name.tr;
}

// ─── flavors/<id>/ ───────────────────────────────────────────────────────────

function writeFlavor(app, lang) {
  const outDir = join(root, 'flavors', app.id);
  mkdirSync(outDir, { recursive: true });
  const name = nameOf(app, lang);

  const capConfig = {
    appId: app.packageId,
    appName: name,
    webDir: 'www',
    // server.url yok — arayüz uygulamanın içinden yüklenir.
    plugins: {
      SplashScreen: {
        launchShowDuration: 600,
        launchAutoHide: false, // React monte olunca main.tsx gizler
        backgroundColor: app.accent,
        showSpinner: false,
        androidSplashResourceName: 'splash',
        splashFullScreen: false,
        splashImmersive: false,
      },
      StatusBar: {
        style: 'DARK',
        backgroundColor: app.accent,
        overlaysWebView: false,
      },
      LocalNotifications: {
        smallIcon: 'ic_stat_notify',
        iconColor: app.accent,
      },
    },
    android: {
      allowMixedContent: false,
      backgroundColor: '#F2F0E9',
      webContentsDebuggingEnabled: false,
      // Yalnız kendi sitesine ve Play'e gidilebilir; harici adresler
      // Browser eklentisiyle sistem tarayıcısında açılır.
      allowNavigation: ['avfethiguzel.com', '*.avfethiguzel.com', 'play.google.com'],
    },
  };

  writeFileSync(
    join(outDir, 'capacitor.config.json'),
    `${JSON.stringify(capConfig, null, 2)}\n`
  );

  const meta = {
    id: app.id,
    packageId: app.packageId,
    versionName: app.versionName,
    versionCode: app.versionCode,
    name,
    lang,
    accent: app.accent,
    linkPaths: LINK_PATHS[app.id] ?? [],
    scheme: `${SCHEME}-${app.id}`,
    builtAt: new Date().toISOString(),
  };
  writeFileSync(join(outDir, 'meta.json'), `${JSON.stringify(meta, null, 2)}\n`);

  // Eski sürümden kalan yanıltıcı parçacığı temizle
  const stale = join(outDir, 'android-app.gradle');
  if (existsSync(stale)) rmSync(stale);

  console.log(`  ✓ ${app.id.padEnd(8)} ${app.packageId}  v${app.versionName} (${app.versionCode})`);
  return outDir;
}

// ─── Android kimliği ─────────────────────────────────────────────────────────

function shade(hex, amount) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, '$1$1') : h, 16);
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(((n >> 16) & 255) * (1 + amount));
  const g = clamp(((n >> 8) & 255) * (1 + amount));
  const b = clamp((n & 255) * (1 + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function writeAndroidIdentity(app, lang) {
  const androidApp = join(root, 'android', 'app');
  if (!existsSync(androidApp)) {
    console.warn('  ! android/app yok — Capacitor projesi eklenmemiş, kimlik yazılmadı');
    return;
  }

  const name = nameOf(app, lang);
  // Android string kaynağında tek tırnak kaçırılmalı; aksi hâlde AAPT
  // "unescaped apostrophe" ile derlemeyi kırar.
  const safeName = name.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');

  const props = [
    '# OTOMATİK ÜRETİLDİ — scripts/build-flavor.mjs',
    '# Elle düzenlemeyin; kaynak: galaxy/catalog.json',
    `id=${app.id}`,
    `applicationId=${app.packageId}`,
    `appName=${safeName}`,
    `versionCode=${app.versionCode}`,
    `versionName=${app.versionName}`,
    `accent=${app.accent}`,
    `accentDark=${shade(app.accent, -0.28)}`,
    `scheme=${SCHEME}-${app.id}`,
    `linkHost=${HOSTS[0]}`,
    '',
  ].join('\n');

  writeFileSync(join(androidApp, 'flavor.properties'), props);

  writeManifestDeepLinks(app);
  console.log(`  → android/app/flavor.properties  (${app.packageId})`);
}

/**
 * Uygulamanın simgesini Android kaynak ağacına yazar.
 *
 * Dört uygulamanın simgesi eskiden aynı dosyaydı; mağaza listesinde
 * ayırt edilemiyorlardı. Burada her yoğunluk için flavor'ın kendi işareti
 * üretilir: başlatıcı simgesi, uyarlanabilir ön plan, bildirim simgesi ve
 * açılış görseli.
 */
const LAUNCHER = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
const FOREGROUND = { mdpi: 108, hdpi: 162, xhdpi: 216, xxhdpi: 324, xxxhdpi: 432 };
const NOTIFY = { mdpi: 24, hdpi: 36, xhdpi: 48, xxhdpi: 72, xxxhdpi: 96 };

async function installIcons(app) {
  const res = join(root, 'android', 'app', 'src', 'main', 'res');
  if (!existsSync(res)) return;

  const icons = join(root, 'assets', 'icons');
  const square = join(icons, `${app.id}-1024.png`);
  const fg = join(icons, `${app.id}-fg.png`);
  const notify = join(icons, `${app.id}-notify.png`);
  const splash = join(icons, `${app.id}-splash.png`);

  if (!existsSync(square)) {
    console.warn(`  ! ${app.id} simgesi yok — önce: node scripts/generate-icons.mjs`);
    return;
  }

  for (const [density, size] of Object.entries(LAUNCHER)) {
    const dir = join(res, `mipmap-${density}`);
    mkdirSync(dir, { recursive: true });
    await sharp(square).resize(size, size).png().toFile(join(dir, 'ic_launcher.png'));
    // Yuvarlak varyant: Android kendisi maskeler, aynı kare kaynak yeterli
    await sharp(square).resize(size, size).png().toFile(join(dir, 'ic_launcher_round.png'));
  }

  for (const [density, size] of Object.entries(FOREGROUND)) {
    const dir = join(res, `mipmap-${density}`);
    mkdirSync(dir, { recursive: true });
    await sharp(fg).resize(size, size).png().toFile(join(dir, 'ic_launcher_foreground.png'));
  }

  // Bildirim simgesi: Android yalnız alfa kanalını kullanır
  for (const [density, size] of Object.entries(NOTIFY)) {
    const dir = join(res, `drawable-${density}`);
    mkdirSync(dir, { recursive: true });
    await sharp(notify).resize(size, size).png().toFile(join(dir, 'ic_stat_notify.png'));
  }

  // Uyarlanabilir simge zemini flavor rengiyle
  const values = join(res, 'values');
  mkdirSync(values, { recursive: true });
  writeFileSync(
    join(values, 'ic_launcher_background.xml'),
    `<?xml version="1.0" encoding="utf-8"?>\n<!-- ÜRETİLDİ: ${app.id} -->\n<resources>\n    <color name="ic_launcher_background">${app.accent}</color>\n</resources>\n`
  );

  // Açılış görseli — Capacitor SplashScreen eklentisi drawable/splash arar
  if (existsSync(splash)) {
    for (const orient of ['port', 'land']) {
      for (const density of Object.keys(LAUNCHER)) {
        const dir = join(res, `drawable-${orient}-${density}`);
        mkdirSync(dir, { recursive: true });
        const w = orient === 'port' ? 1080 : 1920;
        const h = orient === 'port' ? 1920 : 1080;
        await sharp(splash)
          .resize(w, h, { fit: 'cover', position: 'centre' })
          .png()
          .toFile(join(dir, 'splash.png'));
      }
    }
    const base = join(res, 'drawable');
    mkdirSync(base, { recursive: true });
    await sharp(splash).resize(1080, 1920).png().toFile(join(base, 'splash.png'));
  }

  console.log(`  → simgeler yazıldı (${app.accent})`);
}

/**
 * AndroidManifest.xml içindeki derin bağlantı bloğunu flavor'a göre yeniden
 * yazar. İşaretler arasındaki her şey üretilir; dışarısına dokunulmaz.
 */
function writeManifestDeepLinks(app) {
  const file = join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
  if (!existsSync(file)) return;

  const START = '<!-- GALAXY:DEEPLINKS:START -->';
  const END = '<!-- GALAXY:DEEPLINKS:END -->';
  const src = readFileSync(file, 'utf8');
  const a = src.indexOf(START);
  const b = src.indexOf(END);
  if (a < 0 || b < 0) {
    console.warn('  ! manifestte GALAXY:DEEPLINKS işaretleri yok — derin bağlantı yazılmadı');
    return;
  }

  const paths = LINK_PATHS[app.id] ?? [];
  const dataLines = [];
  for (const host of HOSTS) {
    for (const p of paths) {
      dataLines.push(
        `                <data android:scheme="https" android:host="${host}" android:pathPrefix="${p}" />`
      );
    }
  }

  const block = [
    START,
    `            <!-- ÜRETİLDİ: ${app.id} — sahiplenilen yollar: ${paths.join(', ') || 'yok'} -->`,
    ...(dataLines.length
      ? [
          '            <intent-filter android:autoVerify="true">',
          '                <action android:name="android.intent.action.VIEW" />',
          '                <category android:name="android.intent.category.DEFAULT" />',
          '                <category android:name="android.intent.category.BROWSABLE" />',
          ...dataLines,
          '            </intent-filter>',
          '',
        ]
      : []),
    `            <!-- Uygulamaya özel şema: ${SCHEME}-${app.id}://… -->`,
    '            <intent-filter>',
    '                <action android:name="android.intent.action.VIEW" />',
    '                <category android:name="android.intent.category.DEFAULT" />',
    '                <category android:name="android.intent.category.BROWSABLE" />',
    `                <data android:scheme="${SCHEME}-${app.id}" />`,
    '            </intent-filter>',
    `            ${END}`,
  ].join('\n');

  writeFileSync(file, src.slice(0, a) + block + src.slice(b + END.length));
}

// ─── Aktif flavor ────────────────────────────────────────────────────────────

async function activate(appId, lang) {
  const flavorDir = join(root, 'flavors', appId);
  const cfg = join(flavorDir, 'capacitor.config.json');
  if (!existsSync(cfg)) throw new Error(`Flavor yapılandırması yok: ${appId}`);

  // Kök capacitor.config.json — `npx cap sync` bunu okur
  const json = JSON.parse(readFileSync(cfg, 'utf8'));
  writeFileSync(join(root, 'capacitor.config.json'), `${JSON.stringify(json, null, 2)}\n`);
  writeFileSync(
    join(root, 'capacitor.config.ts'),
    `/**\n * OTOMATİK ÜRETİLDİ — scripts/build-flavor.mjs (flavor: ${appId})\n` +
      ` * Elle düzenlemeyin; yeniden üretmek için:\n` +
      ` *   node scripts/build-flavor.mjs --app=${appId}\n */\n` +
      `const config = ${JSON.stringify(json, null, 2)} as const;\nexport default config;\n`
  );

  // Derlenmiş arayüz
  const wwwSrc = join(flavorDir, 'www');
  const wwwDst = join(root, 'www');
  if (!existsSync(join(wwwSrc, 'index.html'))) {
    throw new Error(
      `${appId} arayüzü derlenmemiş. Önce: node scripts/build-app.mjs --app=${appId}`
    );
  }
  rmSync(wwwDst, { recursive: true, force: true });
  mkdirSync(wwwDst, { recursive: true });
  cpSync(wwwSrc, wwwDst, { recursive: true });

  const app = catalog.apps.find((a) => a.id === appId);
  writeAndroidIdentity(app, lang);
  await installIcons(app);

  console.log(`\n→ etkin flavor: ${appId} (${app.packageId})`);
}

// ─── Çalıştır ────────────────────────────────────────────────────────────────

const targets =
  appArg === 'all' ? catalog.apps : catalog.apps.filter((a) => a.id === appArg);

if (!targets.length) {
  console.error('Bilinmeyen uygulama:', appArg);
  console.error('Geçerli:', catalog.apps.map((a) => a.id).join(', '), 'veya all');
  process.exit(1);
}

console.log('flavor yapılandırmaları yazılıyor:');
for (const app of targets) writeFlavor(app, langArg);

await activate(appArg === 'all' ? 'portal' : appArg, langArg);

console.log('\nSonraki adımlar:');
console.log('  npx cap sync android');
console.log('  node scripts/verify-release.mjs');
console.log('  cd android && gradlew.bat bundleRelease');
