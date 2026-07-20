/**
 * Minimal local web shell (fallback if server.url is offline).
 * Primary experience is https://avfethiguzel.com via Capacitor server.url.
 */
import { mkdirSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const www = join(root, 'www');
mkdirSync(www, { recursive: true });

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#2E4036" />
  <title>Av. Fethi Güzel Hukuk Portalı</title>
  <style>
    html,body{margin:0;height:100%;background:#2E4036;color:#F2F0E9;font-family:system-ui,sans-serif}
    .c{min-height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;text-align:center}
    h1{font-size:1.35rem;margin:0 0 .5rem}
    p{opacity:.85;margin:0 0 1.25rem;max-width:20rem;line-height:1.5}
    a{display:inline-block;background:#CC5833;color:#fff;text-decoration:none;font-weight:700;padding:.85rem 1.4rem;border-radius:999px}
  </style>
  <script>
    // Prefer live site even if Capacitor server.url is not applied
    location.replace('https://avfethiguzel.com/');
  </script>
</head>
<body>
  <div class="c">
    <h1>Av. Fethi Güzel</h1>
    <p>Hukuk portalı açılıyor…</p>
    <a href="https://avfethiguzel.com/">Siteyi aç</a>
  </div>
</body>
</html>
`;

writeFileSync(join(www, 'index.html'), html);

const iconSrc = join(root, 'assets', 'icon-512.png');
if (existsSync(iconSrc)) {
    copyFileSync(iconSrc, join(www, 'icon-512.png'));
}

console.log('www prepared →', www);
