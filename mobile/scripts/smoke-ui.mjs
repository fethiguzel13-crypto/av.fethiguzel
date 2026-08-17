/**
 * Birleşik uygulamanın gerçekten AÇILDIĞINI ve bölümler arasında
 * gezinebildiğini doğrular.
 *
 * Neden var: bu depoda 'derleme geçti' ile 'uygulama çalışıyor' bir kez
 * ayrıştı. Vite hatasız derleyip Play'e imzasız/boş bir paket gönderebilir;
 * bölüm yönlendirmesi bozulduğunda da derleme yine yeşil kalır. Bu betik
 * derlenmiş www'yi gerçek bir tarayıcıda açar ve dört bölümü tek tek gezer.
 *
 * Çalıştırma (playwright PORTAL kökünün bağımlılığıdır, mobile'ın değil):
 *   cd fethiguzel-portal && node mobile/scripts/smoke-ui.mjs
 *
 * Önce derlenmiş olmalı:  cd mobile && node scripts/build-app.mjs --app=asistan
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const WWW = 'mobile/flavors/asistan/www';
const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.gz': 'application/gzip',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = join(WWW, url === '/' ? 'index.html' : url);
  if (!existsSync(file)) file = join(WWW, 'index.html');
  const body = readFileSync(file);
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
  res.end(body);
});

await new Promise((r) => server.listen(4599, r));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

const errors = [];
page.on('pageerror', (e) => errors.push(`SAYFA HATASI: ${e.message}`));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`KONSOL: ${m.text()}`);
});

const results = [];
async function step(name, fn) {
  try {
    await fn();
    results.push(`  ✓ ${name}`);
  } catch (e) {
    results.push(`  ✗ ${name} — ${e.message.split('\n')[0]}`);
  }
}

await page.goto('http://localhost:4599/', { waitUntil: 'networkidle' });

await step('giriş ekranı açılıyor', async () => {
  await page.waitForSelector('text=Hukuk Asistanı', { timeout: 8000 });
});

await step('dört bölüm kartı görünüyor', async () => {
  for (const label of ['Mevzuat', 'Hesaplama', 'İçtihat', 'Vatandaş rehberi']) {
    await page.waitForSelector(`text=${label}`, { timeout: 5000 });
  }
});

await step('gerçek sayılar ekranda', async () => {
  const body = await page.textContent('body');
  if (!/8\.088 madde/.test(body)) throw new Error('madde sayısı yok');
  if (!/33 araç/.test(body)) throw new Error('araç sayısı yok');
});

await step('alt gezinme 5 sekme', async () => {
  const n = await page.locator('nav[aria-label], footer nav, [role="tablist"]').count();
  const tabs = await page.locator('button, a').filter({ hasText: /Mevzuat|Hesap|İçtihat|Rehber|Ana/ }).count();
  if (tabs < 5) throw new Error(`sekme/kart sayısı ${tabs} (nav ${n})`);
});

for (const [path, expect] of [
  ['/mevzuat', /kanun|Mevzuat/i],
  ['/hesap', /hesap|araç/i],
  ['/icthat', /içtihat|karar|bugün/i],
  ['/rehber', /rehber|konu/i],
  ['/diger', /gizlilik|ayarlar|bilgi/i],
]) {
  await step(`bölüm açılıyor: ${path}`, async () => {
    await page.goto(`http://localhost:4599/#${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    const body = await page.textContent('body');
    if (!expect.test(body)) throw new Error(`beklenen içerik yok (${body.slice(0, 70)}…)`);
  });
}

await step('giriş ekranına dönülüyor', async () => {
  await page.goto('http://localhost:4599/#/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.waitForSelector('text=Hukuk Asistanı', { timeout: 5000 });
});

console.log('\n── duman testi ──');
for (const r of results) console.log(r);
if (errors.length) {
  console.log('\n── tarayıcı hataları ──');
  for (const e of [...new Set(errors)].slice(0, 12)) console.log(`  ! ${e}`);
}

await browser.close();
server.close();

const failed = results.filter((r) => r.includes('✗')).length;
console.log(`\n${failed ? `${failed} adım BAŞARISIZ` : 'tüm adımlar geçti'}${errors.length ? ` · ${errors.length} tarayıcı hatası` : ''}`);
process.exit(failed || errors.length ? 1 : 0);
