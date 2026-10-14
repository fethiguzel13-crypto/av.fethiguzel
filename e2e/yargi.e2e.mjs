/**
 * Yargı arşivi erişimi (G22 adım 5). Koşucu: `npm run test:e2e -- --sadece=yargi`.
 *
 * Örnek karar yayın indeksinden (`data/yayin/yargi-index.json.gz`) seçilir: Kararın başı dolu ve yerel tam metni kararın
 * başından en az 1.500 karakter uzun olan ilk satır. Tam metin yalnız "sayfada yok" iddiası için okunur, test çıktısına yazılmaz.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { chromium } from 'playwright';
import { kararSayfaBilgisi } from '../lib/yargi-karar-sayfa.mjs';

const TABAN = process.env.E2E_TABAN || 'http://localhost:3123';
const KOK = process.cwd();
let tarayici;
let ornek;

/** `lib/uyelik/karar-text.ts` `readKararText` ile aynı yıl adayları. */
function tamMetin(satir) {
  const yillar = new Set([satir.y, String(satir.t || '').match(/(\d{4})/)?.[1], 'unknown'].filter(Boolean));
  for (const y of yillar) {
    const yol = join(KOK, 'data', 'yargi-kararlari', 'decisions', y, `${satir.i}.json`);
    if (existsSync(yol)) return String(JSON.parse(readFileSync(yol, 'utf8')).text || '').trim();
  }
  return '';
}

const sade = (s) => s.replace(/\s+/g, ' ').trim();

/** Tam metnin ikinci yarısından, yalnız harf ve boşluktan oluşan 50 karakterlik bir parça (HTML kaçışından etkilenmez). */
function ortaParca(metin) {
  const duz = sade(metin);
  for (let i = Math.floor(duz.length / 2); i < duz.length - 50; i += 7) {
    const parca = duz.slice(i, i + 50);
    if (/^[A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû ]+$/.test(parca) && parca.split(' ').length >= 6) return parca;
  }
  return null;
}

before(async () => {
  const satirlar = JSON.parse(gunzipSync(readFileSync(join(KOK, 'data', 'yayin', 'yargi-index.json.gz'))).toString('utf8'));
  for (const satir of satirlar) {
    if (!satir.e || !/^[0-9A-Za-z._-]{3,64}$/.test(String(satir.i))) continue;
    const metin = tamMetin(satir);
    const bilgi = kararSayfaBilgisi(satir);
    if (metin.length < bilgi.ozet.length + 1500) continue;
    const parca = ortaParca(metin);
    if (parca) {
      ornek = { bilgi, parca };
      break;
    }
  }
  assert.ok(ornek, 'yayın indeksinde yerel tam metni olan örnek karar bulunamadı');
  tarayici = await chromium.launch();
});
after(async () => {
  await tarayici?.close();
});

test('üyeliksiz: karar sayfası künyeyi ve kararın başını gösterir, tam metni basmaz, üyelik duvarı çıkar', async () => {
  const sayfa = await tarayici.newPage();
  const hatalar = [];
  const yargiIstekleri = [];
  sayfa.on('pageerror', (e) => hatalar.push(String(e.message).slice(0, 200)));
  sayfa.on('request', (r) => {
    if (r.url().includes('/api/yargi/')) yargiIstekleri.push(r.url());
  });
  try {
    const yanit = await sayfa.goto(`${TABAN}/yargi-kararlari/${ornek.bilgi.id}`, { waitUntil: 'networkidle', timeout: 90_000 });
    assert.equal(yanit.status(), 200);
    const sunucuHtml = sade(await yanit.text());

    assert.equal(sade(await sayfa.locator('h1').first().innerText()), ornek.bilgi.kunye);
    const bas = sayfa.locator('section', { has: sayfa.getByRole('heading', { name: 'Kararın başı' }) }).locator('p');
    assert.equal(sade(await bas.innerText()), sade(ornek.bilgi.ozet));

    await sayfa.getByText('Kararın tam metni üyelere açıktır.', { exact: false }).waitFor({ timeout: 30_000 });
    assert.equal(await sayfa.locator('main a[href="/uyelik/kayit"]').count() > 0, true);

    const istemciHtml = sade(await sayfa.content());
    assert.equal(sunucuHtml.includes(ornek.parca), false, 'tam metin parçası sunucu HTML’inde');
    assert.equal(istemciHtml.includes(ornek.parca), false, 'tam metin parçası çizilmiş sayfada');
    assert.deepEqual(yargiIstekleri, [], 'üyeliksiz ziyaretçi tam metin ucunu çağırmamalı');
    assert.deepEqual(hatalar, []);
  } finally {
    await sayfa.close();
  }
});

test('üye (taklit): tam metin üyelik denetimli uçtan gelir ve sayfada okunur', async () => {
  const sayfa = await tarayici.newPage();
  const hatalar = [];
  sayfa.on('pageerror', (e) => hatalar.push(String(e.message).slice(0, 200)));
  await sayfa.route('**/api/uyelik/ben', (r) =>
    r.fulfill({ json: { ok: true, user: { email: 'uye@example.com', pendingRef: null }, member: true, plan: {} } }),
  );
  const istenen = [];
  await sayfa.route('**/api/yargi/karar/**', (r) => {
    istenen.push(new URL(r.request().url()).pathname);
    return r.fulfill({ json: { ok: true, text: 'SAHTE TAM METİN. Davacı vekili dava dilekçesinde özetle...' } });
  });
  try {
    await sayfa.goto(`${TABAN}/yargi-kararlari/${ornek.bilgi.id}`, { waitUntil: 'networkidle', timeout: 90_000 });
    await sayfa.getByText('SAHTE TAM METİN.', { exact: false }).waitFor({ timeout: 30_000 });
    assert.deepEqual(istenen, [`/api/yargi/karar/${ornek.bilgi.id}`]);
    assert.equal(await sayfa.getByText('Kararın tam metni üyelere açıktır.', { exact: false }).count(), 0);
    assert.deepEqual(hatalar, []);
  } finally {
    await sayfa.close();
  }
});

test('indekste olmayan ya da biçimsiz kimlik 404; ücretli indeksin eski public adresi 401', async () => {
  const sayfa = await tarayici.newPage();
  try {
    for (const id of ['00000000000000000', 'gecersiz%20kimlik']) {
      const r = await sayfa.request.get(`${TABAN}/yargi-kararlari/${id}`, { maxRedirects: 0 });
      assert.equal(r.status(), 404, id);
    }
    const eski = await sayfa.request.get(`${TABAN}/data/yargi-index.json.gz`, { maxRedirects: 0 });
    assert.equal(eski.status(), 401);
    assert.equal((await eski.json()).next, '/uyelik');
  } finally {
    await sayfa.close();
  }
});
