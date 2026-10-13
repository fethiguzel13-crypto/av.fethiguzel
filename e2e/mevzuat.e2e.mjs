/**
 * Mevzuat madde akışı (G22 adım 2). Madde sayfası rota işleyicisidir (`app/mevzuat/[kanunId]/[id]/route.ts`); bağlantıları
 * ve yönlendirmesi mutlak site adresini taşıdığından yerelde tıklanmaz, adresi iddia edilir.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium, request } from 'playwright';

const TABAN = process.env.E2E_TABAN || 'http://localhost:3123';
const SITE = 'https://www.avfethiguzel.com';
let tarayici;
let istek;

before(async () => {
  tarayici = await chromium.launch();
  istek = await request.newContext({ baseURL: TABAN });
});
after(async () => {
  await istek?.dispose();
  await tarayici?.close();
});

test('madde sayfası resmî metni, başlığı, kırıntıyı ve kendi canonical adresini verir', async () => {
  const sayfa = await tarayici.newPage();
  try {
    const yanit = await sayfa.goto(`${TABAN}/mevzuat/tbk/madde-1`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    assert.equal(yanit.status(), 200);
    assert.equal(await sayfa.locator('h1').first().innerText(), 'TBK 1 — TBK Madde 1 (TBK m. 1)');
    assert.match(await sayfa.locator('main').innerText(), /tarafların iradelerini karşılıklı ve birbirine uygun olarak/);
    assert.equal(await sayfa.locator('link[rel="canonical"]').getAttribute('href'), `${SITE}/mevzuat/tbk/madde-1`);
    const kirinti = sayfa.locator('nav[aria-label="Konum"] a');
    assert.deepEqual(await kirinti.evaluateAll((a) => a.map((x) => x.getAttribute('href'))), [
      `${SITE}/`,
      `${SITE}/mevzuat`,
      `${SITE}/mevzuat/tbk`,
    ]);
  } finally {
    await sayfa.close();
  }
});

test('kanun sayfasından madde bağlantısıyla maddeye gidilir', async () => {
  const sayfa = await tarayici.newPage();
  try {
    await sayfa.goto(`${TABAN}/mevzuat/tbk`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    const baglanti = sayfa.locator('a[href="/mevzuat/tbk/madde-1"]').filter({ visible: true }).first();
    await Promise.all([sayfa.waitForURL('**/mevzuat/tbk/madde-1', { timeout: 30_000 }), baglanti.click()]);
    assert.match(await sayfa.locator('h1').first().innerText(), /TBK 1/);
  } finally {
    await sayfa.close();
  }
});

test('olmayan madde 404 ve noindex döner', async () => {
  const yanit = await istek.get('/mevzuat/tbk/madde-9999', { maxRedirects: 0 });
  assert.equal(yanit.status(), 404);
  assert.match(await yanit.text(), /<meta name="robots" content="noindex"\/>/);
});

test('kısa madde adresi kalıcı olarak kanonik adrese yönlenir', async () => {
  const yanit = await istek.get('/mevzuat/tbk/1', { maxRedirects: 0 });
  assert.equal(yanit.status(), 308);
  assert.equal(yanit.headers().location, `${SITE}/mevzuat/tbk/madde-1`);
});
