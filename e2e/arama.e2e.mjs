/**
 * Arama akışı (G22 adım 1). Koşucu: `npm run test:e2e -- --sadece=arama`.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const TABAN = process.env.E2E_TABAN || 'http://localhost:3123';
let tarayici;

before(async () => {
  tarayici = await chromium.launch();
});
after(async () => {
  await tarayici?.close();
});

async function ac(yol) {
  const sayfa = await tarayici.newPage();
  const hatalar = [];
  sayfa.on('pageerror', (e) => hatalar.push(String(e.message).slice(0, 200)));
  const yanit = await sayfa.goto(TABAN + yol, { waitUntil: 'networkidle', timeout: 60_000 });
  return { sayfa, yanit, hatalar };
}

test('sorgu adreste gelince hem hesaplama aracı hem madde sonucu listelenir', async () => {
  const { sayfa, yanit, hatalar } = await ac(`/ara?q=${encodeURIComponent('kıdem tazminatı')}`);
  try {
    assert.equal(yanit.status(), 200);
    await sayfa.locator('a[href="/hesaplama/kidem"]').first().waitFor({ timeout: 30_000 });
    const madde = await sayfa.locator('main a[href^="/mevzuat/"][href*="/madde-"]').count();
    assert.ok(madde > 0, `madde sonucu yok (${madde})`);
    assert.deepEqual(hatalar, []);
  } finally {
    await sayfa.close();
  }
});

test('kanun kısaltması ve madde numarası sunucuda doğrudan maddeye yönlenir (proxy.ts)', async () => {
  const { sayfa, yanit, hatalar } = await ac('/ara?q=TBK%2049');
  try {
    assert.equal(yanit.status(), 200);
    assert.equal(new URL(sayfa.url()).pathname, '/mevzuat/tbk/madde-49');
    assert.equal(yanit.request().redirectedFrom()?.url().includes('/ara?q='), true);
    assert.match(await sayfa.locator('h1').first().innerText(), /49/);
    assert.deepEqual(hatalar, []);
  } finally {
    await sayfa.close();
  }
});

test('kutuya yazılan sorgu adrese işlenir ve sonuç getirir', async () => {
  const { sayfa, hatalar } = await ac('/ara');
  try {
    const kutu = sayfa.locator('main input[aria-label="Site ve mevzuat ara"]').filter({ visible: true }).first();
    await kutu.fill('kira');
    await sayfa.waitForURL(/[?&]q=kira/, { timeout: 30_000 });
    await sayfa.locator('main a[href^="/mevzuat/"][href*="/madde-"]').first().waitFor({ timeout: 30_000 });
    assert.deepEqual(hatalar, []);
  } finally {
    await sayfa.close();
  }
});
