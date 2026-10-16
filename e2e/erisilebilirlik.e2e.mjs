/**
 * Klavye ve odak (G24 adım 3). Koşucu: `npm run test:e2e -- --sadece=erisilebilirlik`.
 *
 * Atlama bağlantısı ilk odaktır ve odağı ana içeriğe taşır (WCAG 2.4.1). Mobil menü klavyeyle açılır, `Escape` ile kapanır ve odak
 * açma düğmesine döner. Ders notu, madde ve hesaplama sayfalarında ilk on `Tab` adımının her birinde odak görünürdür (WCAG 2.4.7);
 * karar `lib/erisilebilirlik.mjs` içindeki `odakGorunur`'dadır.
 *
 * Etkileşim sonrası axe (G24 adım 4): Menü açıkken, arama sonuçları gelince, kıdem aracında geçersiz tarih girilince ve kısa testte
 * şık seçilip cevaplar kontrol edilince axe yeniden koşulur; ciddi ve kritik ihlal 0 olmalıdır. Aynı durumlarda yalnız renkle
 * verilen bilgi (seçili şık, doğru ve yanlış cevap) ile duyurulmayan durum iletisi ayrıca sınanır (WCAG 1.4.1, 4.1.2, 4.1.3).
 *
 * Yeniden akış ve hareket (G24 adım 5): On yedi sayfa türü 320 px'te yatay taşmaz (WCAG 1.4.10); azaltılmış hareket tercihinde ana
 * sayfa giriş canlandırması kapanır.
 *
 * Yapı (G24 adım 6): On yedi sayfa türünde `yapiDenetimi` bulgusuzdur (tek `h1`, atlamasız başlık sırası, `banner`, `main`,
 * `contentinfo`, atlama bağlantısı ve hedefi). Kök yerleşimi kullanmayan madde sayfasında da atlama bağlantısı ilk odaktır.
 * Fareyle tıklanan mevzuat açılır menüsü açık kalır.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';
import { odakGorunur, yapiDenetimi, yapiTopla } from '../lib/erisilebilirlik.mjs';

const TABAN = process.env.E2E_TABAN || 'http://localhost:3123';
const axeKaynak = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
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

/** axe'yi o anki DOM'da koşar; ciddi ve kritik ihlalleri `kural: hedef` biçiminde döner. */
async function ciddiIhlaller(sayfa) {
  // Giriş ve açılış canlandırmaları bitsin, yoksa saydam ara karede kontrast yanlış ölçülür (tasarim-denetim ile aynı bekleme).
  await sayfa.waitForTimeout(1500);
  await sayfa.addScriptTag({ content: axeKaynak });
  return sayfa.evaluate(async () => {
    const r = await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
      resultTypes: ['violations'],
    });
    return r.violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .flatMap((v) => v.nodes.slice(0, 5).map((n) => `${v.id}: ${n.target.join(' ')}`));
  });
}

/** React olay dinleyicisini bağlayınca düğüme `__reactProps…` anahtarını ekler; hidrasyon o ana kadar beklenir. */
async function hidrasyonBekle(sayfa, secici) {
  await sayfa.waitForFunction(
    (s) => {
      const el = document.querySelector(s);
      return !!el && Object.keys(el).some((k) => k.startsWith('__reactProps'));
    },
    secici,
    { timeout: 60_000 },
  );
}

test('axe: mobil menü açıkken ciddi ve kritik ihlal yoktur', async () => {
  const { sayfa, hatalar } = await ac('/', 390);
  try {
    await hidrasyonBekle(sayfa, 'nav button[aria-label="Menü"]');
    const dugme = sayfa.locator('nav button[aria-label="Menü"]');
    await dugme.click();
    await sayfa.locator(`#${await dugme.getAttribute('aria-controls')}`).waitFor({ state: 'visible', timeout: 5_000 });
    assert.deepEqual(await ciddiIhlaller(sayfa), []);
    assert.deepEqual(hatalar, []);
  } finally {
    await sayfa.close();
  }
});

test('axe: masaüstünde mevzuat açılır menüsü açıkken ciddi ve kritik ihlal yoktur', async () => {
  const { sayfa, hatalar } = await ac('/');
  try {
    const dugme = sayfa.locator('nav button[aria-expanded]', { hasText: 'Mevzuat' });
    await hidrasyonBekle(sayfa, 'nav button[aria-expanded]');
    // Klavye yolu: Fareyle açılış ayrı testtedir.
    await dugme.focus();
    await sayfa.keyboard.press('Enter');
    assert.equal(await dugme.getAttribute('aria-expanded'), 'true');
    await sayfa.locator('nav a[href="/mevzuat"]', { hasText: 'Tüm Kanunlar' }).waitFor({ state: 'visible', timeout: 5_000 });
    const kimlik = await dugme.getAttribute('aria-controls');
    assert.ok(kimlik, 'açılır menü düğmesi aria-controls taşımıyor');
    const kutu = await sayfa.locator(`#${kimlik}`).evaluate((p) => {
      const k = p.getBoundingClientRect();
      return { sol: Math.round(k.left), sag: Math.round(k.right), en: innerWidth };
    });
    assert.ok(kutu.sol >= 0 && kutu.sag <= kutu.en, `açılır menü görünüm alanından taşıyor: ${JSON.stringify(kutu)}`);
    assert.deepEqual(await ciddiIhlaller(sayfa), []);
    assert.deepEqual(hatalar, []);
  } finally {
    await sayfa.close();
  }
});

test('masaüstünde fareyle tıklanan mevzuat menüsü açık kalır, ikinci tıklama kapatır', async () => {
  const { sayfa, hatalar } = await ac('/');
  try {
    const dugme = sayfa.locator('nav button[aria-expanded]', { hasText: 'Mevzuat' });
    await hidrasyonBekle(sayfa, 'nav button[aria-expanded]');
    // Fare düğmeye gelince `mouseenter` menüyü açar; ardından gelen tıklama onu kapatmamalıdır.
    await dugme.click();
    assert.equal(await dugme.getAttribute('aria-expanded'), 'true', 'fareyle tıklama menüyü açık bırakmadı');
    await sayfa.locator('nav a[href="/mevzuat"]', { hasText: 'Tüm Kanunlar' }).waitFor({ state: 'visible', timeout: 5_000 });
    await dugme.click();
    assert.equal(await dugme.getAttribute('aria-expanded'), 'false', 'ikinci tıklama menüyü kapatmadı');
    assert.deepEqual(hatalar, []);
  } finally {
    await sayfa.close();
  }
});

test('yapı: on yedi sayfa türünde başlık sırası, işaret bölgeleri ve atlama bağlantısı bulgusuzdur (G24 adım 6)', async () => {
  const { DENETIM_SAYFALARI } = await import('../lib/tasarim-denetim.mjs');
  const ctx = await tarayici.newContext({ viewport: { width: 1280, height: 844 } });
  const bulgulu = [];
  try {
    const sayfa = await ctx.newPage();
    for (const s of DENETIM_SAYFALARI) {
      let yanit = await sayfa.goto(TABAN + s.yol, { waitUntil: 'networkidle', timeout: 60_000 });
      if (s.izle) {
        const href = await sayfa.getAttribute(s.izle, 'href');
        yanit = await sayfa.goto(TABAN + href, { waitUntil: 'networkidle', timeout: 60_000 });
      }
      assert.equal(yanit.status(), 200, s.ad);
      const bulgular = yapiDenetimi(await sayfa.evaluate(yapiTopla));
      if (bulgular.length) bulgulu.push(`${s.ad}: ${JSON.stringify(bulgular)}`);
    }
  } finally {
    await ctx.close();
  }
  assert.deepEqual(bulgulu, []);
});

test('madde: ilk Tab atlama bağlantısına gelir, hedef ana içeriktir', async () => {
  const { sayfa, yanit } = await ac('/mevzuat/tbk/madde-1');
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
    await sayfa.keyboard.press('Tab');
    assert.ok(await sayfa.evaluate(() => Boolean(document.activeElement.closest('#main-content'))), 'atlamadan sonraki odak ana içerikte değil');
  } finally {
    await sayfa.close();
  }
});

test('axe: arama sonuçları gelince ciddi ve kritik ihlal yoktur', async () => {
  const { sayfa, yanit, hatalar } = await ac(`/ara?q=${encodeURIComponent('kıdem')}`);
  try {
    assert.equal(yanit.status(), 200);
    await sayfa.locator('main a[href="/hesaplama/kidem"]').first().waitFor({ timeout: 30_000 });
    assert.deepEqual(await ciddiIhlaller(sayfa), []);
    assert.deepEqual(hatalar, []);
  } finally {
    await sayfa.close();
  }
});

test('kıdem: ayrılış girişten önceyse hata iletisi durum bölgesinde duyurulur; axe ciddi ve kritik ihlal yoktur', async () => {
  const { sayfa, yanit, hatalar } = await ac('/hesaplama/kidem');
  try {
    assert.equal(yanit.status(), 200);
    await hidrasyonBekle(sayfa, 'main input');
    await sayfa.getByLabel('İşe Giriş Tarihi', { exact: true }).fill('2026-07-01');
    await sayfa.getByLabel('İşten Ayrılış Tarihi', { exact: true }).fill('2016-07-03');
    const ileti = sayfa.getByRole('status').filter({ hasText: 'İşten ayrılış tarihi işe giriş tarihinden sonra olmalıdır' });
    await ileti.waitFor({ state: 'visible', timeout: 10_000 });
    assert.deepEqual(await ciddiIhlaller(sayfa), []);
    assert.deepEqual(hatalar, []);
  } finally {
    await sayfa.close();
  }
});

test('kısa test: seçili şık aria-pressed taşır, kontrolden sonra doğru ve yanlış cevap metinle belirtilir; axe ciddi ve kritik ihlal yoktur', async () => {
  const { sayfa, yanit, hatalar } = await ac('/ders-notlari/ankara/aile-hukuku-yillik');
  try {
    assert.equal(yanit.status(), 200);
    const blok = sayfa.locator('section', { has: sayfa.getByRole('heading', { name: 'Kısa test', level: 2 }) });
    const ilkSoru = blok.locator('ol > li').first();
    const siklar = ilkSoru.locator('button');
    await siklar.first().scrollIntoViewIfNeeded();
    await hidrasyonBekle(sayfa, 'section ol > li button');
    const n = await siklar.count();
    assert.ok(n >= 2, `ilk soruda şık yok (${n})`);
    await siklar.nth(0).click();
    const basili = await siklar.evaluateAll((d) => d.map((b) => b.getAttribute('aria-pressed')));
    assert.deepEqual(basili, ['true', ...Array(n - 1).fill('false')]);
    assert.deepEqual(await ciddiIhlaller(sayfa), []);

    await blok.getByRole('button', { name: 'Kontrol et' }).click();
    await blok.getByRole('status').filter({ hasText: /Sonuç: \d+ \/ \d+/ }).waitFor({ timeout: 5_000 });
    const metinler = await siklar.allInnerTexts();
    assert.equal(metinler.filter((m) => m.includes('Doğru cevap')).length, 1, `doğru cevap metinle belirtilmiyor: ${metinler.join(' | ')}`);
    assert.ok(metinler[0].includes('Doğru cevap') || metinler[0].includes('Yanlış seçim'), `seçilen şıkkın sonucu metinle belirtilmiyor: ${metinler[0]}`);
    assert.deepEqual(await ciddiIhlaller(sayfa), []);
    assert.deepEqual(hatalar, []);
  } finally {
    await sayfa.close();
  }
});

test('azaltılmış hareket: ana sayfa giriş canlandırması kapanır, normal bağlamda süresi vardır (WCAG 2.3.3)', async () => {
  const sure = async (reducedMotion) => {
    const ctx = await tarayici.newContext({ reducedMotion, viewport: { width: 1280, height: 800 } });
    try {
      const sayfa = await ctx.newPage();
      const yanit = await sayfa.goto(TABAN + '/', { waitUntil: 'domcontentloaded', timeout: 60_000 });
      assert.equal(yanit.status(), 200);
      return await sayfa.locator('.hero-fade').first().evaluate((el) => {
        const s = getComputedStyle(el);
        return { ad: s.animationName, sure: parseFloat(s.animationDuration) };
      });
    } finally {
      await ctx.close();
    }
  };
  const normal = await sure('no-preference');
  assert.ok(normal.ad !== 'none' && normal.sure > 0.1, `normal bağlamda canlandırma yok: ${JSON.stringify(normal)}`);
  const azaltilmis = await sure('reduce');
  assert.ok(azaltilmis.ad === 'none' || azaltilmis.sure <= 0.01, `azaltılmış harekette canlandırma sürüyor: ${JSON.stringify(azaltilmis)}`);
});

test('yeniden akış: on yedi sayfa türü 320 px genişlikte yatay taşmaz (WCAG 1.4.10)', async () => {
  const { DENETIM_SAYFALARI } = await import('../lib/tasarim-denetim.mjs');
  const ctx = await tarayici.newContext({ viewport: { width: 320, height: 720 } });
  const tasan = [];
  try {
    const sayfa = await ctx.newPage();
    for (const s of DENETIM_SAYFALARI) {
      let yanit = await sayfa.goto(TABAN + s.yol, { waitUntil: 'networkidle', timeout: 60_000 });
      if (s.izle) {
        const href = await sayfa.getAttribute(s.izle, 'href');
        yanit = await sayfa.goto(TABAN + href, { waitUntil: 'networkidle', timeout: 60_000 });
      }
      assert.equal(yanit.status(), 200, s.ad);
      const genislik = await sayfa.evaluate(() => document.documentElement.scrollWidth);
      if (genislik > 321) tasan.push(`${s.ad} ${genislik} px`);
    }
  } finally {
    await ctx.close();
  }
  assert.deepEqual(tasan, []);
});
