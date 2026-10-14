/**
 * Üyelik akışı (G22 adım 4). Koşucu: `npm run test:e2e -- --sadece=uyelik`.
 *
 * Kayıt, giriş ve ödeme başlatma yanıtları `page.route` ile taklit edilir: Gerçek kullanıcı kaydı yazılmaz, iyzico'ya
 * (sandbox dahil) istek gitmez, `.env` gerektirmez. Son test taklitsizdir ve oturumsuz ziyaretçinin ücretli içeriğe
 * erişemediğini gerçek sunucuda iddia eder.
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

const PLAN = { name: 'Arşiv', priceTl: 1, kart: true, kartTest: true, iyzico: true, havale: false };
const OTURUMSUZ = { ok: true, user: null, member: false, plan: PLAN };
const OTURUMLU = {
  ok: true,
  user: { email: 'deneme@example.com', name: 'Deneme', pendingRef: null },
  member: false,
  plan: PLAN,
};

/** `/api/uyelik/ben` yanıtını değiştirilebilir biçimde taklit eder; çağrı sayısı ve gövdeler `kayit` dizisinde tutulur. */
async function sayfaAc(yol, { ben = OTURUMSUZ, yanitlar = {} } = {}) {
  const sayfa = await tarayici.newPage();
  const hatalar = [];
  const kayit = [];
  const durum = { ben };
  sayfa.on('pageerror', (e) => hatalar.push(String(e.message).slice(0, 200)));
  await sayfa.route('**/api/uyelik/**', async (route) => {
    const istek = route.request();
    const yolAdi = new URL(istek.url()).pathname.replace('/api/uyelik/', '');
    kayit.push({ yol: yolAdi, yontem: istek.method(), govde: istek.postData() });
    if (yolAdi === 'ben') return route.fulfill({ json: durum.ben });
    const yanit = yanitlar[yolAdi];
    if (!yanit) return route.fulfill({ status: 404, json: { ok: false, error: 'Bulunamadı.' } });
    if (yanit.sonra) durum.ben = yanit.sonra;
    return route.fulfill({ status: yanit.status ?? 200, json: yanit.json });
  });
  const yanit = await sayfa.goto(TABAN + yol, { waitUntil: 'networkidle', timeout: 60_000 });
  assert.equal(yanit.status(), 200);
  return { sayfa, hatalar, kayit };
}

const istekSayisi = (kayit, yol) => kayit.filter((k) => k.yol === yol).length;

test('kayıt: boş alan ve 8 karakterden kısa şifre tarayıcıda durdurulur, sunucuya istek gitmez', async () => {
  const { sayfa, hatalar, kayit } = await sayfaAc('/uyelik/kayit');
  try {
    const gonder = sayfa.getByRole('button', { name: /^Üye ol/ });
    await gonder.click();
    const ad = sayfa.getByLabel('Ad soyad', { exact: true });
    assert.equal(await ad.evaluate((el) => el.validity.valueMissing), true);

    await ad.fill('Deneme Kullanıcı');
    await sayfa.getByLabel('E-posta', { exact: true }).fill('deneme@example.com');
    await sayfa.getByLabel('Şifre', { exact: true }).fill('1234567');
    await gonder.click();
    assert.equal(await sayfa.getByLabel('Şifre', { exact: true }).evaluate((el) => el.validity.tooShort), true);
    assert.equal(istekSayisi(kayit, 'kayit'), 0);
    assert.deepEqual(hatalar, []);
  } finally {
    await sayfa.close();
  }
});

test('kayıt: sunucu reddederse ileti formda görünür; onaylar gövdeye girer, başarıda ödeme sayfasına geçilir', async () => {
  const yanitlar = {
    kayit: { status: 400, json: { ok: false, error: 'KVKK aydınlatmasını onaylamanız gerekir.' } },
  };
  const { sayfa, hatalar, kayit } = await sayfaAc('/uyelik/kayit', { yanitlar });
  try {
    await sayfa.getByLabel('Ad soyad', { exact: true }).fill('Deneme Kullanıcı');
    await sayfa.getByLabel('E-posta', { exact: true }).fill('deneme@example.com');
    await sayfa.getByLabel('Şifre', { exact: true }).fill('guclu-sifre-123');
    await sayfa.getByRole('button', { name: /^Üye ol/ }).click();
    await sayfa.getByText('KVKK aydınlatmasını onaylamanız gerekir.').waitFor({ timeout: 15_000 });
    assert.equal(new URL(sayfa.url()).pathname, '/uyelik/kayit');
    const ilk = JSON.parse(kayit.find((k) => k.yol === 'kayit').govde);
    assert.deepEqual([ilk.kvkk, ilk.dijitalIfa], [false, false]);

    yanitlar.kayit = { json: { ok: true, next: '/uyelik/odeme' }, sonra: OTURUMLU };
    await sayfa.getByRole('checkbox', { name: /Gizlilik \/ KVKK/ }).check();
    await sayfa.getByRole('checkbox', { name: /anında ifasını kabul/ }).check();
    await sayfa.getByRole('button', { name: /^Üye ol/ }).click();
    await sayfa.waitForURL('**/uyelik/odeme', { timeout: 30_000 });
    await sayfa.getByText('deneme@example.com').waitFor({ timeout: 30_000 });
    const ikinci = JSON.parse(kayit.filter((k) => k.yol === 'kayit')[1].govde);
    assert.deepEqual([ikinci.kvkk, ikinci.dijitalIfa], [true, true]);
    assert.deepEqual(hatalar, []);
  } finally {
    await sayfa.close();
  }
});

test('giriş: hatalı bilgide sunucu iletisi görünür, sayfa değişmez', async () => {
  const yanitlar = { giris: { status: 401, json: { ok: false, error: 'E-posta veya şifre hatalı.' } } };
  const { sayfa, hatalar, kayit } = await sayfaAc('/uyelik/giris', { yanitlar });
  try {
    await sayfa.getByLabel('E-posta', { exact: true }).fill('deneme@example.com');
    await sayfa.getByLabel('Şifre', { exact: true }).fill('yanlis');
    await sayfa.getByRole('button', { name: 'Giriş yap' }).click();
    await sayfa.getByText('E-posta veya şifre hatalı.').waitFor({ timeout: 15_000 });
    assert.equal(new URL(sayfa.url()).pathname, '/uyelik/giris');
    assert.equal(istekSayisi(kayit, 'giris'), 1);
    assert.deepEqual(hatalar, []);
  } finally {
    await sayfa.close();
  }
});

test('ödeme: sözleşme onayı olmadan düğme kapalıdır; iyzico formu yanıttaki içerikle açılır', async () => {
  const yanitlar = {
    'odeme/baslat': { json: { ok: true, checkoutFormContent: '<p id="sahte-iyzico">iyzico ödeme formu</p>' } },
  };
  const { sayfa, hatalar, kayit } = await sayfaAc('/uyelik/odeme', { ben: OTURUMLU, yanitlar });
  try {
    const ode = sayfa.getByRole('button', { name: /^Kart ile öde/ });
    await ode.waitFor({ timeout: 30_000 });
    assert.equal(await ode.isDisabled(), true);
    await sayfa.getByRole('checkbox', { name: /Mesafeli satış sözleşmesini/ }).check();
    assert.equal(await ode.isEnabled(), true);
    await ode.click();
    const form = sayfa.locator('#iyzipay-checkout-form #sahte-iyzico');
    await form.waitFor({ timeout: 15_000 });
    assert.equal(await form.innerText(), 'iyzico ödeme formu');
    assert.deepEqual(
      kayit.filter((k) => k.yol === 'odeme/baslat').map((k) => k.yontem),
      ['POST'],
    );
    assert.deepEqual(hatalar, []);
  } finally {
    await sayfa.close();
  }
});

test('ödeme: reddedilen başlatmada hata iletisi görünür, form açılmaz; dönüşte durum=hata bildirilir', async () => {
  const yanitlar = { 'odeme/baslat': { status: 502, json: { ok: false, error: 'Kart reddedildi.' } } };
  const { sayfa, hatalar } = await sayfaAc('/uyelik/odeme', { ben: OTURUMLU, yanitlar });
  try {
    await sayfa.getByRole('checkbox', { name: /Mesafeli satış sözleşmesini/ }).check();
    await sayfa.getByRole('button', { name: /^Kart ile öde/ }).click();
    await sayfa.getByText('Kart reddedildi.').waitFor({ timeout: 15_000 });
    assert.equal(await sayfa.locator('#iyzipay-checkout-form').count(), 0);

    await sayfa.goto(`${TABAN}/uyelik/odeme?durum=hata`, { waitUntil: 'networkidle', timeout: 60_000 });
    await sayfa.getByText('Ödeme tamamlanamadı. Yeniden deneyin.').waitFor({ timeout: 30_000 });
    assert.deepEqual(hatalar, []);
  } finally {
    await sayfa.close();
  }
});

test('oturumsuz ziyaretçi (taklitsiz): ödeme sayfası girişe yönlenir, arşiv API 401, başka siteden POST 403', async () => {
  const sayfa = await tarayici.newPage();
  try {
    await sayfa.goto(`${TABAN}/uyelik/odeme`, { waitUntil: 'networkidle', timeout: 60_000 });
    await sayfa.waitForURL((u) => u.pathname === '/uyelik/giris', { timeout: 30_000 });
    assert.equal(new URL(sayfa.url()).searchParams.get('next'), '/uyelik/odeme');

    const ben = await sayfa.request.get(`${TABAN}/api/uyelik/ben`);
    const benJson = await ben.json();
    assert.deepEqual([benJson.user, benJson.member], [null, false]);

    for (const yol of ['/api/yargi/index', '/api/yargi/karar/deneme-123']) {
      const r = await sayfa.request.get(TABAN + yol);
      assert.equal(r.status(), 401, yol);
      assert.equal((await r.json()).next, '/uyelik');
    }

    const csrf = await sayfa.request.post(`${TABAN}/api/uyelik/giris`, {
      headers: { Origin: 'https://kotu-site.example', 'Content-Type': 'application/json' },
      data: { email: 'deneme@example.com', password: 'x' },
    });
    assert.equal(csrf.status(), 403);
  } finally {
    await sayfa.close();
  }
});
