import { test } from 'node:test';
import assert from 'node:assert/strict';

/**
 * G04/B6 — Üye deposu (tek Upstash anahtarı) her sunucu örneğinde bir kez okunup bellekte tutuluyordu.
 * Vercel aynı anda birden çok örnek çalıştırır: A örneği bayat kopyasıyla yazınca B örneğinin eklediği
 * üye ya da ödeme siliniyor, B'de kaydolan üye A'da giriş yapamıyordu. KV'ye ulaşılamayan soğuk
 * başlangıçta ise boş depo yazılıp bütün üyeler siliniyordu.
 *
 * Upstash REST uç noktası sahte `fetch` ile taklit edilir; depo modülü gerçektir.
 */

process.env.UPSTASH_REDIS_REST_URL = 'https://kv.test';
process.env.UPSTASH_REDIS_REST_TOKEN = 'deneme';

const ANAHTAR = 'fg:uyelik:v1';
const kv = new Map();
let okumaHatasi = false;

globalThis.fetch = async (url, init) => {
  if (String(url) !== 'https://kv.test') throw new Error(`beklenmeyen istek: ${url}`);
  const [komut, anahtar, deger] = JSON.parse(init.body);
  if (komut === 'GET') {
    if (okumaHatasi) return new Response('hata', { status: 500 });
    return Response.json({ result: kv.has(anahtar) ? kv.get(anahtar) : null });
  }
  if (komut === 'SET') {
    kv.set(anahtar, deger);
    return Response.json({ result: 'OK' });
  }
  return new Response('bilinmeyen komut', { status: 400 });
};

const { getUserByEmail, upsertUser } = await import('../store.ts');

function uye(id) {
  return {
    id,
    email: `${id}@ornek.test`,
    name: 'Deneme',
    passwordHash: 'x',
    createdAt: new Date().toISOString(),
    membershipUntil: null,
    pendingRef: null,
    pendingAt: null,
    lastPaymentAt: null,
    lastPaymentKind: null,
  };
}

function depo() {
  return JSON.parse(kv.get(ANAHTAR));
}

/** Başka bir sunucu örneğinin KV'ye doğrudan yazması. */
function baskaOrnekEkler(kayit) {
  const d = depo();
  d.users.push(kayit);
  kv.set(ANAHTAR, JSON.stringify(d));
}

test('başka örneğin eklediği üye bu örneğin sonraki yazısında silinmez', async () => {
  await upsertUser(uye('u_a'));
  baskaOrnekEkler(uye('u_b'));
  await upsertUser(uye('u_c'));
  assert.deepEqual(depo().users.map((u) => u.id).sort(), ['u_a', 'u_b', 'u_c']);
});

test('başka örnekte kaydolan üye bu örnekte bulunur', async () => {
  baskaOrnekEkler(uye('u_d'));
  assert.ok(await getUserByEmail('u_d@ornek.test'));
});

test('KV okunamazken yazı reddedilir ve depo ezilmez', async () => {
  const once = kv.get(ANAHTAR);
  okumaHatasi = true;
  try {
    await assert.rejects(upsertUser(uye('u_e')));
  } finally {
    okumaHatasi = false;
  }
  assert.equal(kv.get(ANAHTAR), once);
});

test('KV okunamazken okuma son bilinen hâle düşer', async () => {
  okumaHatasi = true;
  try {
    assert.ok(await getUserByEmail('u_a@ornek.test'));
  } finally {
    okumaHatasi = false;
  }
});
