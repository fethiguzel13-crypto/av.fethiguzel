/**
 * Yerel WebView kabuğu + çevrimdışı yedek.
 * Asıl deneyim: Capacitor server.url → https://www.avfethiguzel.com
 */
import { mkdirSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const www = join(root, 'www');
mkdirSync(www, { recursive: true });

const LIVE = 'https://www.avfethiguzel.com';

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#2E4036" />
  <meta name="color-scheme" content="light" />
  <title>Av. Fethi Güzel Hukuk Portalı</title>
  <style>
    :root { --bg:#2E4036; --cream:#F2F0E9; --accent:#CC5833; --ink:#1a1a1a; }
    *{box-sizing:border-box}
    html,body{margin:0;min-height:100%;background:var(--bg);color:var(--cream);
      font-family:system-ui,-apple-system,"Segoe UI",sans-serif;
      padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)}
    .shell{min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;
      padding:2rem 1.25rem;text-align:center}
    .mark{width:64px;height:64px;border-radius:16px;background:rgba(242,240,233,.12);
      display:grid;place-items:center;margin:0 auto 1.25rem;font-size:1.6rem}
    h1{font-size:1.4rem;margin:0 0 .4rem;font-weight:700;letter-spacing:-.02em}
    .sub{opacity:.8;margin:0 0 1.5rem;max-width:18rem;line-height:1.55;font-size:.95rem}
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:.4rem;
      background:var(--accent);color:#fff;text-decoration:none;font-weight:700;
      padding:.9rem 1.5rem;border-radius:999px;border:0;font-size:.95rem;cursor:pointer}
    .btn:active{transform:scale(.98)}
    .btn-ghost{background:transparent;border:1px solid rgba(242,240,233,.35);color:var(--cream);margin-top:.75rem}
    .links{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin-top:1.75rem;max-width:20rem}
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
    <h1>Av. Fethi Güzel</h1>
    <p class="sub" id="msg">Hukuk portalı açılıyor…</p>
    <button type="button" class="btn" id="retry"><span class="spin" id="spin"></span>Yeniden dene</button>
    <a class="btn btn-ghost hidden" id="open" href="${LIVE}/">Tarayıcıda aç</a>
    <div class="links" id="shortcuts">
      <a href="${LIVE}/ara">Ara</a>
      <a href="${LIVE}/bilgi">Rehber</a>
      <a href="${LIVE}/hesaplama">Hesaplama</a>
      <a href="${LIVE}/icthat">İçtihat</a>
      <a href="${LIVE}/mevzuat/tbk">TBK</a>
    </div>
    <p class="status" id="status"></p>
  </div>
  <script>
    (function () {
      var LIVE = ${JSON.stringify(LIVE)};
      var msg = document.getElementById('msg');
      var status = document.getElementById('status');
      var spin = document.getElementById('spin');
      var retry = document.getElementById('retry');
      var open = document.getElementById('open');
      var tries = 0;

      function setLoading(on) {
        spin.classList.toggle('hidden', !on);
        retry.disabled = on;
      }

      function goLive() {
        tries += 1;
        setLoading(true);
        status.textContent = tries > 1 ? 'Bağlantı deneniyor (' + tries + ')…' : '';
        // Capacitor server.url zaten canlı siteyi yükler; bu kabuk yalnızca yedektir
        window.location.replace(LIVE + '/?utm_source=android_app&utm_medium=app');
      }

      function showOffline() {
        setLoading(false);
        msg.textContent = 'İnternet bağlantısı yok veya siteye ulaşılamıyor. Bağlanınca yeniden deneyin.';
        open.classList.remove('hidden');
        status.textContent = navigator.onLine === false ? 'Cihaz çevrimdışı' : 'Sunucuya erişilemedi';
      }

      function probe() {
        if (navigator.onLine === false) {
          showOffline();
          return;
        }
        setLoading(true);
        var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
        var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, 8000);
        fetch(LIVE + '/deploy-check', { method: 'GET', mode: 'no-cors', cache: 'no-store', signal: ctrl && ctrl.signal })
          .then(function () { clearTimeout(t); goLive(); })
          .catch(function () {
            clearTimeout(t);
            // no-cors opaque de başarılı sayılabilir; yine de dene
            if (navigator.onLine !== false) goLive();
            else showOffline();
          });
      }

      retry.addEventListener('click', function () {
        if (navigator.onLine === false) showOffline();
        else goLive();
      });
      window.addEventListener('online', goLive);

      // Hemen canlıya geç (normal yol)
      setTimeout(probe, 120);
    })();
  </script>
</body>
</html>
`;

writeFileSync(join(www, 'index.html'), html);

const iconSrc = join(root, 'assets', 'icon-512.png');
if (existsSync(iconSrc)) {
  copyFileSync(iconSrc, join(www, 'icon-512.png'));
}

console.log('www prepared →', www);
