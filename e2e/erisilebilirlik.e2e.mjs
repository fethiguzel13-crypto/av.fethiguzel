/**
 * Klavye ve odak (G24 adım 3). Koşucu: `npm run test:e2e -- --sadece=erisilebilirlik`.
 *
 * Atlama bağlantısı ilk odaktır ve odağı ana içeriğe taşır (WCAG 2.4.1). Mobil menü klavyeyle açılır, `Escape` ile kapanır ve odak
 * açma düğmesine döner. Ders notu, madde ve hesaplama sayfalarında ilk on `Tab` adımının her birinde odak görünürdür (WCAG 2.4.7);
 * karar `lib/erisilebilirlik.mjs` içindeki `odakGorunur`'dadır.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { odakGorunur } from '../lib/erisilebilirlik.mjs';

const TABAN = process.env.E2E_TABAN || 'http://localhost:3123';
let tarayici;

before(async () => {
  tarayici = await chromium.launch();
});
after(async () => {
  await tarayici?.close();
});

async function ac(yol, genislik = 1280) {
  const sayfa = await tarayici.newPage({ viewport: { width: genislik, height: 844 } });
  const hatalar = [];
  sayfa.on('pageerror', (e) => hatalar.push(String(e.message).slice(0, 200)));
  const yanit = await sayfa.goto(TABAN + yol, { waitUntil: 'networkidle', timeout: 60_000 });
  return { sayfa, yanit, hatalar };
}

test('ilk Tab atlama bağlantısına gelir, Enter sonraki odağı ana içeriğe taşır', async () => {
  const { sayfa, yanit, hatalar } = await ac('/');
  try {
    assert.equal(yanit.status(), 200);
    await sayfa.keyboard.press('Tab');
    const ilk = await sayfa.evaluate(() => {
      const el = document.activeElement;
      const k = el.getBoundingClientRect();
      return { href: el.getAttribute('href'), metin: el.textContent.trim(), w: k.width, h: k.height };
    });
    assert.equal(ilk.href, '#main-content');
    assert.equal(ilk.metin, 'İçeriğe atla');
    assert.ok(ilk.w > 1 && ilk.h > 1, `odaktaki atlama bağlantısı görünmüyor (${ilk.w}×${ilk.h})`);
    await sayfa.keyboard.press('Enter');
    await sayfa.waitForFunction(() => location.hash === '#main-content', null, { timeout: 5_000 });
    await sayfa.keyboard.press('Tab');
    const icerde = await sayfa.evaluate(() => Boolean(document.activeElement.closest('#main-content')));
    assert.ok(icerde, 'atlamadan sonraki odak ana içerikte değil');
    assert.deepEqual(hatalar, []);
  } finally {
    await sayfa.close();
  }
});

test('mobil menü klavyeyle açılır, Escape ile kapanır ve odak açma düğmesine döner', async () => {
  const { sayfa, hatalar } = await ac('/', 390);
  try {
    const dugme = sayfa.locator('nav button[aria-label="Menü"]');
    await dugme.focus();
    assert.equal(await dugme.getAttribute('aria-expanded'), 'false');
    await sayfa.keyboard.press('Enter');
    assert.equal(await dugme.getAttribute('aria-expanded'), 'true');
    const panel = sayfa.locator(`#${await dugme.getAttribute('aria-controls')}`);
    await panel.waitFor({ state: 'visible', timeout: 5_000 });
    await sayfa.keyboard.press('Tab');
    assert.ok(await panel.evaluate((p) => p.contains(document.activeElement)), 'Tab açık panele girmiyor');
    await sayfa.keyboard.press('Escape');
    await panel.waitFor({ state: 'detached', timeout: 5_000 });
    assert.equal(await dugme.getAttribute('aria-expanded'), 'false');
    assert.ok(await dugme.evaluate((d) => d === document.activeElement), 'Escape sonrası odak düğmeye dönmedi');
    assert.deepEqual(hatalar, []);
  } finally {
    await sayfa.close();
  }
});

const ODAK_SAYFALARI = [
  { ad: 'ders notu', yol: '/ders-notlari/ankara/aile-hukuku-yillik' },
  { ad: 'madde', yol: '/mevzuat/tbk/madde-1' },
  { ad: 'hesaplama', yol: '/hesaplama/kidem' },
];

const stil = (el) => {
  const s = getComputedStyle(el);
  return { outlineStyle: s.outlineStyle, outlineWidth: s.outlineWidth, outlineColor: s.outlineColor, boxShadow: s.boxShadow };
};

for (const { ad, yol } of ODAK_SAYFALARI) {
  test(`${ad}: ilk on Tab adımında odak görünürdür`, async () => {
    const { sayfa, yanit, hatalar } = await ac(yol);
    try {
      assert.equal(yanit.status(), 200);
      const gorunmeyen = [];
      for (let i = 0; i < 10; i++) {
        await sayfa.keyboard.press('Tab');
        await sayfa.waitForTimeout(400);
        const el = await sayfa.evaluateHandle(() => document.activeElement);
        const sonra = await el.evaluate(stil);
        const tanim = await el.evaluate((e) => `${e.tagName.toLowerCase()} ${(e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 30)}`);
        // Önceki öğeye dönülünce bu öğenin odaksız stili okunur, sonra aynı öğeye geri gelinir.
        await sayfa.keyboard.press('Shift+Tab');
        await sayfa.waitForTimeout(400);
        const once = await el.evaluate(stil);
        await sayfa.keyboard.press('Tab');
        if (!odakGorunur(once, sonra)) gorunmeyen.push(`${i + 1}. ${tanim}`);
      }
      assert.deepEqual(gorunmeyen, []);
      assert.deepEqual(hatalar, []);
    } finally {
      await sayfa.close();
    }
  });
}
