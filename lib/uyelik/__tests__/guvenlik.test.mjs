import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * G04 güvenlik denetiminin bulguları (docs/aylik-plan/gorevler/G04.md). Her test bir açığı sabitler;
 * açıklama satırı açığın nasıl kullanılabildiğini anlatır.
 */

import { readSession, signSession } from '../crypto.ts';
import { activateMembership } from '../membership.ts';
import { getUserById, upsertUser } from '../store.ts';
import {
  adminCerezDegeri,
  girisGirdisiDenetle,
  guvenliEsit,
  kayitGirdisiDenetle,
  kokenGuvenilir,
} from '../guvenlik.ts';

const GUN = 24 * 60 * 60 * 1000;

function uye(id) {
  return {
    id,
    email: `${id}@ornek.test`,
    name: 'Deneme Üye',
    passwordHash: 'x',
    createdAt: new Date().toISOString(),
    membershipUntil: null,
    pendingRef: null,
    pendingAt: null,
    lastPaymentAt: null,
    lastPaymentKind: null,
  };
}

function kaynak(dosya) {
  return readFileSync(join(process.cwd(), dosya), 'utf8');
}

// B1 — Ödeme dönüşü `GET /api/uyelik/odeme/sonuc?token=…` tekrar çağrılınca her seferinde 30 gün
// ekleniyordu: tek ödemeyle sınırsız üyelik.

test('B1: aynı ödeme ikinci kez işlenince üyelik uzamaz', async () => {
  const u = uye('u_tekrar1');
  await upsertUser(u);
  const ilk = await activateMembership(u, 'iyzico', 'odeme-1');
  const ikinci = await activateMembership(ilk, 'iyzico', 'odeme-1');
  assert.equal(ikinci.membershipUntil, ilk.membershipUntil);
});

test('B1: bayat kullanıcı nesnesiyle tekrar da üyeliği uzatmaz (denetim depoda)', async () => {
  const u = uye('u_tekrar2');
  await upsertUser(u);
  const ilk = await activateMembership(u, 'iyzico', 'odeme-2');
  await new Promise((r) => setTimeout(r, 5));
  await activateMembership(u, 'iyzico', 'odeme-2');
  const son = await getUserById(u.id);
  assert.equal(son.membershipUntil, ilk.membershipUntil);
});

test('B1: yeni ödeme üyeliği 30 gün uzatır', async () => {
  const u = uye('u_tekrar3');
  await upsertUser(u);
  const ilk = await activateMembership(u, 'iyzico', 'odeme-3a');
  const ikinci = await activateMembership(ilk, 'iyzico', 'odeme-3b');
  const fark = Date.parse(ikinci.membershipUntil) - Date.parse(ilk.membershipUntil);
  assert.ok(Math.abs(fark - 30 * GUN) < 1000, `fark ${fark}`);
});

test('B1: ödeme dönüşü etkinleştirmeye ödeme kimliğini geçiriyor', () => {
  const src = kaynak('lib/uyelik/http.ts');
  assert.ok(/activateMembership\(\s*found\s*,\s*'iyzico'\s*,\s*[^)]+\)/.test(src), 'odeme/sonuc ödeme kimliği geçirmiyor');
});

// B2 — Üretimde UYELIK_SESSION_SECRET yoksa imza anahtarı kaynakta yazılı sabit bir metne düşüyordu;
// o metinle imzalanan `until` değeri ileri tarihli bir çerez ücretli arşivi açıyordu.

test('B2: üretimde oturum sırrı yokken hiçbir çerez kabul edilmez', async () => {
  const eskiNode = process.env.NODE_ENV;
  const eskiSir = process.env.UYELIK_SESSION_SECRET;
  try {
    process.env.NODE_ENV = 'production';
    delete process.env.UYELIK_SESSION_SECRET;
    const now = Math.floor(Date.now() / 1000);
    const sahte = await signSession({ uid: 'u_x', em: 'x@y.z', until: Date.now() + 365 * GUN, exp: now + 3600 });
    assert.equal(await readSession(sahte), null);
  } finally {
    process.env.NODE_ENV = eskiNode;
    if (eskiSir === undefined) delete process.env.UYELIK_SESSION_SECRET;
    else process.env.UYELIK_SESSION_SECRET = eskiSir;
  }
});

test('B2: sır tanımlıyken imzalı çerez okunur', async () => {
  const eskiNode = process.env.NODE_ENV;
  const eskiSir = process.env.UYELIK_SESSION_SECRET;
  try {
    process.env.NODE_ENV = 'production';
    process.env.UYELIK_SESSION_SECRET = 'test-session-secret-32chars-min';
    const now = Math.floor(Date.now() / 1000);
    const gercek = await signSession({ uid: 'u_y', em: 'y@y.z', until: 0, exp: now + 3600 });
    assert.equal((await readSession(gercek))?.uid, 'u_y');
  } finally {
    process.env.NODE_ENV = eskiNode;
    if (eskiSir === undefined) delete process.env.UYELIK_SESSION_SECRET;
    else process.env.UYELIK_SESSION_SECRET = eskiSir;
  }
});

// B3 — Girdilerde üst sınır yoktu. Tüm üyeler tek KV anahtarında tutulduğu için megabaytlık bir ad
// deposu şişiriyor; uzun şifre scrypt öncesi PBKDF2'yi yoruyordu.

const GECERLI = { email: 'Ali@Ornek.com', password: 'gizli-sifre-1', name: 'Ali Veli', kvkk: true, dijitalIfa: true };

test('B3: geçerli kayıt girdisi normalleştirilerek kabul edilir', () => {
  const r = kayitGirdisiDenetle(GECERLI);
  assert.equal(r.ok, true);
  assert.equal(r.email, 'ali@ornek.com');
  assert.equal(r.name, 'Ali Veli');
});

test('B3: aşırı uzun ad, e-posta ve şifre reddedilir', () => {
  assert.equal(kayitGirdisiDenetle({ ...GECERLI, name: 'a'.repeat(101) }).ok, false);
  assert.equal(kayitGirdisiDenetle({ ...GECERLI, email: `${'a'.repeat(250)}@b.co` }).ok, false);
  assert.equal(kayitGirdisiDenetle({ ...GECERLI, password: 'p'.repeat(129) }).ok, false);
});

test('B3: eski kurallar korunur (kısa şifre, KVKK, dijital ifa)', () => {
  assert.equal(kayitGirdisiDenetle({ ...GECERLI, password: 'kisa' }).ok, false);
  assert.equal(kayitGirdisiDenetle({ ...GECERLI, kvkk: false }).ok, false);
  assert.equal(kayitGirdisiDenetle({ ...GECERLI, dijitalIfa: false }).ok, false);
  assert.equal(kayitGirdisiDenetle({ ...GECERLI, email: 'gecersiz' }).ok, false);
  assert.equal(kayitGirdisiDenetle(null).ok, false);
});

test('B3: girişte aşırı uzun şifre scrypt çalışmadan reddedilir', () => {
  assert.equal(girisGirdisiDenetle({ email: 'a@b.co', password: 'p'.repeat(129) }).ok, false);
  assert.equal(girisGirdisiDenetle({ email: 'a@b.co', password: 'p'.repeat(20) }).ok, true);
});

// B4 — Yönetici sırrı çereze düz metin yazılıyor ve `===` ile karşılaştırılıyordu.

test('B4: yönetici çerezi sırrın kendisini taşımaz', () => {
  const sir = 'cok-gizli-yonetici-sirri';
  const deger = adminCerezDegeri(sir);
  assert.ok(deger.length >= 32);
  assert.ok(!deger.includes(sir));
  assert.equal(adminCerezDegeri(sir), deger, 'aynı sır aynı değeri üretir');
  assert.notEqual(adminCerezDegeri(`${sir}x`), deger);
});

test('B4: sabit süreli karşılaştırma', () => {
  assert.equal(guvenliEsit('Bearer abc', 'Bearer abc'), true);
  assert.equal(guvenliEsit('Bearer abc', 'Bearer abd'), false);
  assert.equal(guvenliEsit('Bearer ab', 'Bearer abc'), false);
  assert.equal(guvenliEsit('', ''), false, 'boş sır hiçbir zaman eşleşmez');
});

test('B4: yönetici sırrı çereze düz yazılmıyor', () => {
  const src = kaynak('lib/uyelik/http.ts');
  assert.ok(!/adminCookie\s*,\s*secret\s*,/.test(src), 'yönetici sırrı çereze düz yazılıyor');
});

// B5 — Durum değiştiren POST'larda köken denetimi yoktu. `text/plain` form gövdesi de `req.json()` ile
// okunduğu için başka bir site ziyaretçiyi saldırganın hesabına giriş yaptırabiliyordu.

function istek(headers = {}) {
  return new Request('https://www.avfethiguzel.com/api/uyelik/giris', { method: 'POST', headers });
}
const SITE = 'https://www.avfethiguzel.com';

test('B5: aynı kökenden gelen istek geçer', () => {
  assert.equal(kokenGuvenilir(istek({ origin: SITE, 'sec-fetch-site': 'same-origin' }), SITE), true);
});

test('B5: başka siteden gelen istek reddedilir', () => {
  assert.equal(kokenGuvenilir(istek({ origin: 'https://saldirgan.example' }), SITE), false);
  assert.equal(kokenGuvenilir(istek({ 'sec-fetch-site': 'cross-site' }), SITE), false);
  assert.equal(kokenGuvenilir(istek({ origin: 'null' }), SITE), false);
});

test('B5: tarayıcı dışı istemci (Origin yok) geçer', () => {
  assert.equal(kokenGuvenilir(istek(), SITE), true);
});

test('B5: alan adının www ve çıplak hâli birbirine güvenir', () => {
  const r = new Request('https://avfethiguzel.com/api/uyelik/giris', {
    method: 'POST',
    headers: { origin: 'https://www.avfethiguzel.com', 'sec-fetch-site': 'same-site' },
  });
  assert.equal(kokenGuvenilir(r, SITE), true);
});

test('B5: dağıtıcı köken denetimini uyguluyor', () => {
  const src = kaynak('lib/uyelik/http.ts');
  assert.ok(/kokenGuvenilir\(/.test(src), 'dağıtıcıda köken denetimi yok');
});

// B4 — Yönetici ucunda deneme sınırı yoktu; yalnız başarısız denemeler sayılır, panel kullanımı engellenmez.

test('B4: başarısız deneme sınırı dolunca kapı kapanır, pencere bitince açılır', async () => {
  const { rateLimit, rateLimitDolu } = await import('../rate-limit.ts');
  const k = `admin-test:${Date.now()}`;
  assert.equal(rateLimitDolu(k, 3), false);
  rateLimit(k, 3, 50);
  rateLimit(k, 3, 50);
  assert.equal(rateLimitDolu(k, 3), false);
  rateLimit(k, 3, 50);
  assert.equal(rateLimitDolu(k, 3), true);
  await new Promise((r) => setTimeout(r, 60));
  assert.equal(rateLimitDolu(k, 3), false);
});

// B6 — Depo artık KV okunamayınca yazıyı reddediyor. Ödeme dönüşünde bu, parası alınmış üyeyi
// 500 hatasıyla bırakmamalı: çerez dönem sonunu taşır, olay yönetici için loglanır.

test('B6: ödeme dönüşü depo hatasında üyeyi çerezle içeri alır', () => {
  const src = kaynak('lib/uyelik/http.ts').replace(/\r\n/g, '\n');
  const blok = src.slice(src.indexOf("key === 'odeme/sonuc'"), src.indexOf("key === 'admin/aktifle'"));
  assert.ok(/try\s*\{[^}]*activateMembership\(/.test(blok), 'etkinleştirme try içinde değil');
  assert.ok(/catch[\s\S]*extendUntil\(\s*found\.membershipUntil\s*\)/.test(blok), 'yedek dönem sonu yok');
});

// B6 ek (güvenlik incelemesi notu) — Depo kesintisinde ödeme kimliği kaydedilemiyor; yönetici elle
// etkinleştirirken logdaki kimliği girebilmeli, yoksa token'ın sonradan tekrar çağrılması bir dönem daha ekler.

test('B6: yönetici etkinleştirmesi ödeme kimliğini iletebiliyor', () => {
  const src = kaynak('lib/uyelik/http.ts');
  assert.ok(/activateMembership\(\s*user\s*,\s*'admin'\s*,\s*[^)]+\)/.test(src), 'yönetici yolu ödeme kimliği geçirmiyor');
});

test('B6: yönetici ödeme kimliğiyle etkinleştirince aynı ödeme ikinci kez işlenmez', async () => {
  const u = uye('u_yonetici1');
  await upsertUser(u);
  const elle = await activateMembership(u, 'admin', 'odeme-kesinti');
  const tekrar = await activateMembership(elle, 'iyzico', 'odeme-kesinti');
  assert.equal(tekrar.membershipUntil, elle.membershipUntil);
});
