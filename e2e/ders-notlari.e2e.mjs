/**
 * Ders notu gezinmesi (G22 adım 6). Koşucu: `npm run test:e2e -- --sadece=ders-notlari`.
 *
 * Temsilci not `lib/ders-notlari/dizin-kanonik.json`'dan alınır (G11: her ders kökünde dizine açık tek not). Aynı dersin başka
 * fakültedeki kopyası okunur ama `noindex`'tir ve canonical kendi adresinde kalır. Not görünümünde önceki/sonraki bağlantısı
 * yoktur; gezinme kırıntı ve fakülte sayfasındaki ders listesi üzerinden yapılır.
 *
 * Arama motoru her adresi baştan yükler. Bu yüzden robots, canonical ve şema iddiaları sunucunun döndürdüğü HTML'den okunur,
 * gezinme ise tarayıcıda tıklanarak sınanır.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const TABAN = process.env.E2E_TABAN || 'http://localhost:3123';
const SITE = 'https://www.avfethiguzel.com';
const kanonik = JSON.parse(readFileSync(new URL('../lib/ders-notlari/dizin-kanonik.json', import.meta.url), 'utf8'));
const TEMSILCI = kanonik.dersler['aile-hukuku'];
let tarayici;

before(async () => {
  assert.ok(TEMSILCI?.uni && TEMSILCI?.ders, 'dizin-kanonik.json aile-hukuku temsilcisi yok');
  tarayici = await chromium.launch();
});
after(async () => {
  await tarayici?.close();
});

/** Sunucu HTML'indeki robots, canonical ve BreadcrumbList listeleri (her biri tüm geçişleriyle). */
async function sunucuBas(sayfa, yol) {
  const r = await sayfa.request.get(TABAN + yol, { maxRedirects: 0 });
  assert.equal(r.status(), 200, yol);
  const html = await r.text();
  const robots = [...html.matchAll(/<meta name="robots" content="([^"]*)"/g)].map((m) => m[1]);
  const canonical = [...html.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map((m) => m[1]);
  const kirintilar = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    const veri = JSON.parse(m[1]);
    for (const dugum of [veri, ...(veri['@graph'] || [])].flat()) {
      if (dugum?.['@type'] === 'BreadcrumbList') kirintilar.push(dugum.itemListElement.map((o) => o.item?.['@id'] || o.item));
    }
  }
  return { robots, canonical, kirintilar };
}

/**
 * İstemci gezinmesinde adres yeni sayfa çizilmeden değişir. `waitForURL`'den sonra yeni sayfanın kırıntı şeması (son öğesi
 * hedef adres) DOM'a girene kadar beklenir.
 */
async function gecisBekle(sayfa, yol) {
  await sayfa.waitForURL(`**${yol}`, { timeout: 60_000 });
  await sayfa.waitForFunction(
    (son) =>
      [...document.querySelectorAll('script[type="application/ld+json"]')].some(
        (s) => s.textContent.includes('BreadcrumbList') && s.textContent.includes(son),
      ),
    `"item":"${SITE + yol}"}]`,
    { timeout: 60_000 },
  );
}

async function gorunurKirinti(sayfa) {
  const kirinti = sayfa.locator('main nav[aria-label="Konum"]:visible');
  assert.equal(await kirinti.count(), 1);
  return kirinti;
}

test('dizin → fakülte → temsilci not: tıklayarak gezinilir; kırıntı bağlantıları doğru, geri dönüş çalışır', async () => {
  const sayfa = await tarayici.newPage();
  const hatalar = [];
  sayfa.on('pageerror', (e) => hatalar.push(String(e.message).slice(0, 200)));
  const notYolu = `/ders-notlari/${TEMSILCI.uni}/${TEMSILCI.ders}`;
  try {
    const yanit = await sayfa.goto(`${TABAN}/ders-notlari`, { waitUntil: 'networkidle', timeout: 90_000 });
    assert.equal(yanit.status(), 200);

    await sayfa.locator(`main a[href="/ders-notlari/${TEMSILCI.uni}"]:visible`).first().click();
    await gecisBekle(sayfa, `/ders-notlari/${TEMSILCI.uni}`);

    await sayfa.locator(`main a[href="${notYolu}"]:visible`).first().click();
    await gecisBekle(sayfa, notYolu);
    const kirinti = await gorunurKirinti(sayfa);
    const hrefler = await kirinti.locator('a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    assert.deepEqual(hrefler, ['/', '/ders-notlari', `/ders-notlari/${TEMSILCI.uni}`]);

    await kirinti.locator(`a[href="/ders-notlari/${TEMSILCI.uni}"]`).click();
    await gecisBekle(sayfa, `/ders-notlari/${TEMSILCI.uni}`);
    assert.deepEqual(hatalar, []);
  } finally {
    await sayfa.close();
  }
});

test('sunucu HTML: dizin, temsilci fakülte ve temsilci not dizinde; tek canonical ve tek kırıntı şeması', async () => {
  const sayfa = await tarayici.newPage();
  const notYolu = `/ders-notlari/${TEMSILCI.uni}/${TEMSILCI.ders}`;
  try {
    for (const yol of ['/ders-notlari', `/ders-notlari/${TEMSILCI.uni}`]) {
      const bas = await sunucuBas(sayfa, yol);
      assert.deepEqual(bas.robots, ['index, follow'], yol);
      assert.deepEqual(bas.canonical, [SITE + yol], yol);
    }
    const bas = await sunucuBas(sayfa, notYolu);
    assert.deepEqual(bas.robots, ['index, follow']);
    assert.deepEqual(bas.canonical, [SITE + notYolu]);
    assert.deepEqual(bas.kirintilar, [
      [`${SITE}/`, `${SITE}/ders-notlari`, `${SITE}/ders-notlari/${TEMSILCI.uni}`, SITE + notYolu],
    ]);
  } finally {
    await sayfa.close();
  }
});

test('temsilci olmayan kopya: okunur, noindex, canonical kendi adresinde; fakültesine kırıntıdan dönülür', async () => {
  const uni = TEMSILCI.uni === 'istanbul' ? 'marmara' : 'istanbul';
  const yol = `/ders-notlari/${uni}/${TEMSILCI.ders}`;
  const sayfa = await tarayici.newPage();
  const hatalar = [];
  sayfa.on('pageerror', (e) => hatalar.push(String(e.message).slice(0, 200)));
  try {
    const bas = await sunucuBas(sayfa, yol);
    assert.deepEqual(bas.robots, ['noindex, follow']);
    assert.deepEqual(bas.canonical, [SITE + yol]);
    const hub = await sunucuBas(sayfa, `/ders-notlari/${uni}`);
    assert.deepEqual(hub.robots, ['noindex, follow']);

    const yanit = await sayfa.goto(TABAN + yol, { waitUntil: 'networkidle', timeout: 90_000 });
    assert.equal(yanit.status(), 200);
    assert.ok((await sayfa.locator('h1').first().innerText()).trim().length > 0);
    await (await gorunurKirinti(sayfa)).locator(`a[href="/ders-notlari/${uni}"]`).click();
    await gecisBekle(sayfa, `/ders-notlari/${uni}`);
    assert.deepEqual(hatalar, []);
  } finally {
    await sayfa.close();
  }
});

test('olmayan not ve olmayan fakülte 404', async () => {
  const sayfa = await tarayici.newPage();
  try {
    for (const yol of [`/ders-notlari/${TEMSILCI.uni}/olmayan-ders-xyz`, '/ders-notlari/olmayan-fakulte-xyz']) {
      const r = await sayfa.request.get(TABAN + yol, { maxRedirects: 0 });
      assert.equal(r.status(), 404, yol);
    }
  } finally {
    await sayfa.close();
  }
});
