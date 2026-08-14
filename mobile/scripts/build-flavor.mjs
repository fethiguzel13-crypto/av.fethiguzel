/**
 * Galaxy flavor üretici — tek Capacitor projesinden 4 uygulama kabuğu.
 *
 * Kullanım:
 *   node scripts/build-flavor.mjs --app=portal
 *   node scripts/build-flavor.mjs --app=hesap
 *   node scripts/build-flavor.mjs --app=all
 *
 * Çıktı: flavors/<id>/  (capacitor.config.json + www + package meta)
 * Android applicationId değişimi: flavors/<id>/android-app.gradle snippet
 */

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, cpSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const catalog = JSON.parse(readFileSync(join(root, 'galaxy', 'catalog.json'), 'utf8'));
const localesRoot = join(root, '..', 'locales');

const args = process.argv.slice(2);
const appArg = (args.find((a) => a.startsWith('--app=')) || '--app=all').split('=')[1];
const localeArg = (args.find((a) => a.startsWith('--lang=')) || '--lang=tr').split('=')[1];

const SITE = catalog.site || 'https://www.avfethiguzel.com';

function loadLocale(lang) {
  try {
    return JSON.parse(readFileSync(join(localesRoot, `${lang}.json`), 'utf8'));
  } catch {
    return {};
  }
}

function prepareWww(app, lang) {
  const loc = loadLocale(lang);
  const locEn = loadLocale('en');
  const shell = loc.shell || {};
  const shellEn = locEn.shell || {};
  const common = loc.common || {};
  const commonEn = locEn.common || {};
  const s = (k, fb) => shell[k] || shellEn[k] || fb;
  const c = (k, fb) => common[k] || commonEn[k] || fb;

  const name = app.name[lang] || app.name.en || app.name.tr;
  const pathPart = app.path === '/' ? '/' : app.path;
  const entry = `${SITE}${pathPart === '/' ? '/' : pathPart}?app=${app.id}&lang=${lang}&utm_source=android_app&utm_medium=${app.id}`;

  const html = `<!DOCTYPE html>
<html lang="${lang}" ${lang === 'ar' ? 'dir="rtl"' : 'dir="ltr"'}>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="${app.accent}" />
  <meta name="color-scheme" content="light" />
  <title>${name}</title>
  <style>
    :root { --bg:${app.accent}; --cream:#F2F0E9; --accent:#CC5833; }
    *{box-sizing:border-box}
    html,body{margin:0;min-height:100%;background:var(--bg);color:var(--cream);
      font-family:system-ui,-apple-system,"Segoe UI",sans-serif;
      padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)}
    .shell{min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;
      padding:2rem 1.25rem;text-align:center}
    .mark{width:64px;height:64px;border-radius:16px;background:rgba(242,240,233,.12);
      display:grid;place-items:center;margin:0 auto 1.25rem;font-size:1.6rem}
    h1{font-size:1.35rem;margin:0 0 .4rem;font-weight:700;letter-spacing:-.02em}
    .sub{opacity:.8;margin:0 0 1.5rem;max-width:18rem;line-height:1.55;font-size:.95rem}
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:.4rem;
      background:var(--accent);color:#fff;text-decoration:none;font-weight:700;
      padding:.9rem 1.5rem;border-radius:999px;border:0;font-size:.95rem;cursor:pointer}
    .btn-ghost{background:transparent;border:1px solid rgba(242,240,233,.35);color:var(--cream);margin-top:.75rem}
    .links{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin-top:1.75rem;max-width:22rem}
    .links a{font-size:.75rem;color:rgba(242,240,233,.75);text-decoration:none;
      border:1px solid rgba(242,240,233,.2);padding:.4rem .7rem;border-radius:999px}
    .status{font-size:.8rem;opacity:.65;margin-top:1.5rem;min-height:1.2em}
    .spin{width:1.1rem;height:1.1rem;border:2px solid rgba(255,255,255,.25);border-top-color:#fff;
      border-radius:50%;animation:r .7s linear infinite;display:inline-block;vertical-align:middle;margin-right:.4rem}
    @keyframes r{to{transform:rotate(360deg)}}
    .hidden{display:none!important}
  </style>
</head>
<body>
  <div class="shell" id="shell">
    <div class="mark" aria-hidden="true">§</div>
    <h1>${name}</h1>
    <p class="sub" id="msg">${s('opening', 'Opening…')}</p>
    <button type="button" class="btn" id="retry"><span class="spin" id="spin"></span>${c('retry', 'Retry')}</button>
    <a class="btn btn-ghost hidden" id="open" href="${entry}">${c('openInBrowser', 'Open in browser')}</a>
    <div class="links" id="shortcuts">
      ${catalog.apps
        .filter((a) => a.id !== app.id)
        .map(
          (a) =>
            `<a href="${SITE}${a.path === '/' ? '/' : a.path}?app=${a.id}&lang=${lang}">${(a.name[lang] || a.name.en || a.name.tr).replace(/</g, '')}</a>`
        )
        .join('\n      ')}
    </div>
    <p class="status" id="status"></p>
  </div>
  <script>
    (function () {
      var LIVE = ${JSON.stringify(entry)};
      var PROBE = ${JSON.stringify(SITE + '/deploy-check')};
      var msg = document.getElementById('msg');
      var status = document.getElementById('status');
      var spin = document.getElementById('spin');
      var retry = document.getElementById('retry');
      var open = document.getElementById('open');
      var tries = 0;
      var STR = {
        noNetwork: ${JSON.stringify(s('noNetwork', 'No network'))},
        deviceOffline: ${JSON.stringify(s('deviceOffline', 'Offline'))},
        serverUnreachable: ${JSON.stringify(s('serverUnreachable', 'Unreachable'))},
        retrying: ${JSON.stringify(s('retrying', 'Connecting ({n})…'))}
      };
      function setLoading(on) {
        spin.classList.toggle('hidden', !on);
        retry.disabled = on;
      }
      function goLive() {
        tries += 1;
        setLoading(true);
        status.textContent = tries > 1 ? STR.retrying.replace('{n}', String(tries)) : '';
        window.location.replace(LIVE);
      }
      function showOffline() {
        setLoading(false);
        msg.textContent = STR.noNetwork;
        open.classList.remove('hidden');
        status.textContent = navigator.onLine === false ? STR.deviceOffline : STR.serverUnreachable;
      }
      function probe() {
        if (navigator.onLine === false) { showOffline(); return; }
        setLoading(true);
        var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
        var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, 8000);
        fetch(PROBE, { method: 'GET', mode: 'no-cors', cache: 'no-store', signal: ctrl && ctrl.signal })
          .then(function () { clearTimeout(t); goLive(); })
          .catch(function () {
            clearTimeout(t);
            if (navigator.onLine !== false) goLive();
            else showOffline();
          });
      }
      retry.addEventListener('click', function () {
        if (navigator.onLine === false) showOffline();
        else goLive();
      });
      window.addEventListener('online', goLive);
      setTimeout(probe, 120);
    })();
  </script>
</body>
</html>
`;

  return { html, entry, name };
}

function writeFlavor(app, lang) {
  const outDir = join(root, 'flavors', app.id);
  const wwwDir = join(outDir, 'www');
  mkdirSync(wwwDir, { recursive: true });

  const { html, entry, name } = prepareWww(app, lang);
  writeFileSync(join(wwwDir, 'index.html'), html);

  const iconSrc = join(root, 'assets', 'icon-512.png');
  if (existsSync(iconSrc)) copyFileSync(iconSrc, join(wwwDir, 'icon-512.png'));

  const pathPart = app.path === '/' ? '/' : app.path;
  const serverUrl = `${SITE}${pathPart === '/' ? '/' : pathPart}?app=${app.id}&lang=${lang}&utm_source=android_app&utm_medium=${app.id}`;

  const capConfig = {
    appId: app.packageId,
    appName: name,
    webDir: 'www',
    server: {
      url: serverUrl,
      cleartext: false,
      allowNavigation: [
        'avfethiguzel.com',
        '*.avfethiguzel.com',
        'www.avfethiguzel.com',
        'maps.google.com',
        '*.google.com',
        'play.google.com',
      ],
    },
    plugins: {
      SplashScreen: {
        launchShowDuration: 900,
        launchAutoHide: true,
        backgroundColor: app.accent,
        showSpinner: false,
        androidSplashResourceName: 'splash',
        splashFullScreen: true,
        splashImmersive: true,
      },
      StatusBar: {
        style: 'DARK',
        backgroundColor: app.accent,
      },
    },
    android: {
      allowMixedContent: false,
      backgroundColor: '#F2F0E9',
      webContentsDebuggingEnabled: false,
    },
  };

  writeFileSync(join(outDir, 'capacitor.config.json'), JSON.stringify(capConfig, null, 2));

  // Gradle snippet — applicationId / version
  const gradle = `// Galaxy flavor: ${app.id}
// android/app/build.gradle defaultConfig içine veya productFlavors'a kopyalayın
// applicationId "${app.packageId}"
// versionCode ${app.versionCode}
// versionName "${app.versionName}"
android {
    defaultConfig {
        applicationId "${app.packageId}"
        versionCode ${app.versionCode}
        versionName "${app.versionName}"
        resValue "string", "app_name", "${name.replace(/"/g, '\\"')}"
    }
}
`;
  writeFileSync(join(outDir, 'android-app.gradle'), gradle);

  const meta = {
    id: app.id,
    packageId: app.packageId,
    versionName: app.versionName,
    versionCode: app.versionCode,
    name,
    lang,
    entry,
    builtAt: new Date().toISOString(),
  };
  writeFileSync(join(outDir, 'meta.json'), JSON.stringify(meta, null, 2));

  console.log(`✓ flavor ${app.id} → ${outDir}`);
  console.log(`  package ${app.packageId}  v${app.versionName} (${app.versionCode})`);
  console.log(`  entry   ${entry}`);
  return outDir;
}

function activateFlavor(appId) {
  // Aktif android projesine portal veya seçilen flavor'un config + www'sini kopyala
  const flavorDir = join(root, 'flavors', appId);
  if (!existsSync(flavorDir)) throw new Error(`Flavor yok: ${appId}`);
  copyFileSync(join(flavorDir, 'capacitor.config.json'), join(root, 'capacitor.config.json'));
  // TS config da yaz (IDE için)
  const json = JSON.parse(readFileSync(join(flavorDir, 'capacitor.config.json'), 'utf8'));
  const ts = `/**
 * AUTO-GENERATED by scripts/build-flavor.mjs — flavor: ${appId}
 * Do not edit by hand; re-run: node scripts/build-flavor.mjs --app=${appId}
 */
const config = ${JSON.stringify(json, null, 2)} as const;
export default config;
`;
  writeFileSync(join(root, 'capacitor.config.ts'), ts);
  // www
  const wwwSrc = join(flavorDir, 'www');
  const wwwDst = join(root, 'www');
  mkdirSync(wwwDst, { recursive: true });
  cpSync(wwwSrc, wwwDst, { recursive: true });
  console.log(`→ activated flavor "${appId}" as mobile/capacitor.config + www`);
}

const targets =
  appArg === 'all' ? catalog.apps : catalog.apps.filter((a) => a.id === appArg);

if (!targets.length) {
  console.error('Bilinmeyen app:', appArg);
  console.error('Geçerli:', catalog.apps.map((a) => a.id).join(', '), 'veya all');
  process.exit(1);
}

for (const app of targets) {
  writeFlavor(app, localeArg);
}

// Varsayılan: son üretilen veya portal'ı aktif et
const activate = appArg === 'all' ? 'portal' : appArg;
activateFlavor(activate);

console.log('\nSonraki adımlar:');
console.log('  cd mobile && npx cap sync android');
console.log('  # Her flavor için: node scripts/build-flavor.mjs --app=hesap && npx cap sync android');
console.log('  # packageId değişince Android Studio / clean gerekir');
