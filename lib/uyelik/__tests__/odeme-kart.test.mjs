import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  havaleEnabled,
  iyzicoBaseUrl,
  iyzicoMode,
  kartCanli,
  kartEnabled,
} from '../config.ts';
import { paymentOk, basketIdFor, userIdFromResponse } from '../iyzico.ts';

const ODEME_ENV = [
  'IYZICO_API_KEY',
  'IYZICO_SECRET_KEY',
  'IYZICO_MODE',
  'UYELIK_KART',
  'UYELIK_HAVALE',
  'UYELIK_IBAN',
];

function temizle() {
  for (const k of ODEME_ENV) delete process.env[k];
  process.env.NODE_ENV = 'production';
}

function canliAnahtar() {
  process.env.IYZICO_API_KEY = 'live-abc123';
  process.env.IYZICO_SECRET_KEY = 'live-secret';
}

beforeEach(temizle);

test('anahtar yokken kart ödemesi kapalıdır', () => {
  assert.equal(kartEnabled(), false);
  assert.equal(kartCanli(), false);
});

test('anahtar girilince kart ödemesi kendiliğinden açılır', () => {
  canliAnahtar();
  assert.equal(kartEnabled(), true);
  assert.equal(kartCanli(), true);
});

test('UYELIK_KART=0 kart ödemesini acil olarak kapatır', () => {
  canliAnahtar();
  process.env.UYELIK_KART = '0';
  assert.equal(kartEnabled(), false);
});

test('kart açıkken IBAN gösterilmez', () => {
  canliAnahtar();
  process.env.UYELIK_IBAN = 'TR000000000000000000000000';
  assert.equal(havaleEnabled(), false);
});

test('kart kapalıyken IBAN yedeğe düşer', () => {
  process.env.UYELIK_IBAN = 'TR000000000000000000000000';
  assert.equal(kartEnabled(), false);
  assert.equal(havaleEnabled(), true);
});

test('IBAN yokken havale de kapalıdır — site ödemesiz kalmaz demek değil', () => {
  assert.equal(havaleEnabled(), false);
});

test('UYELIK_HAVALE=1 ikisini birlikte açar', () => {
  canliAnahtar();
  process.env.UYELIK_IBAN = 'TR000000000000000000000000';
  process.env.UYELIK_HAVALE = '1';
  assert.equal(kartEnabled(), true);
  assert.equal(havaleEnabled(), true);
});

test('UYELIK_HAVALE=0, IBAN tanımlı olsa da havaleyi kapatır', () => {
  process.env.UYELIK_IBAN = 'TR000000000000000000000000';
  process.env.UYELIK_HAVALE = '0';
  assert.equal(havaleEnabled(), false);
});

test('sandbox öneki ortamı kendiliğinden anlar', () => {
  process.env.IYZICO_API_KEY = 'sandbox-abc';
  process.env.IYZICO_SECRET_KEY = 'sandbox-def';
  assert.equal(iyzicoMode(), 'sandbox');
  assert.equal(iyzicoBaseUrl(), 'https://sandbox-api.iyzipay.com');
  assert.equal(kartEnabled(), true);
  assert.equal(kartCanli(), false, 'sandbox anahtarı canlı sayılmaz');
});

test('canlı anahtar üretimde live uca gider', () => {
  canliAnahtar();
  assert.equal(iyzicoMode(), 'live');
  assert.equal(iyzicoBaseUrl(), 'https://api.iyzipay.com');
});

test('açık IYZICO_MODE her şeyin önüne geçer', () => {
  process.env.IYZICO_API_KEY = 'sandbox-abc';
  process.env.IYZICO_SECRET_KEY = 'sandbox-def';
  process.env.IYZICO_MODE = 'live';
  assert.equal(iyzicoMode(), 'live');
});

const BASARILI = {
  status: 'success',
  paymentStatus: 'SUCCESS',
  currency: 'TRY',
  paidPrice: '500.00',
  fraudStatus: 1,
};

test('tam ve doğru tahsilat kabul edilir', () => {
  assert.equal(paymentOk(BASARILI), true);
});

test('yarım kalan 3D akışı üyelik açmaz', () => {
  assert.equal(paymentOk({ ...BASARILI, paymentStatus: 'INIT_THREEDS' }), false);
  assert.equal(paymentOk({ ...BASARILI, paymentStatus: undefined }), false);
});

test('eksik tutar üyelik açmaz', () => {
  assert.equal(paymentOk({ ...BASARILI, paidPrice: '1.00' }), false);
  assert.equal(paymentOk({ ...BASARILI, paidPrice: undefined, price: undefined }), false);
});

test('başka para birimi üyelik açmaz', () => {
  assert.equal(paymentOk({ ...BASARILI, currency: 'USD' }), false);
});

test('fraud reddi üyelik açmaz', () => {
  assert.equal(paymentOk({ ...BASARILI, fraudStatus: -1 }), false);
  assert.equal(paymentOk({ ...BASARILI, fraudStatus: 0 }), true, 'incelemedeki ödeme kabul edilir');
});

test('başarısız yanıt üyelik açmaz', () => {
  assert.equal(paymentOk({ status: 'failure', errorMessage: 'x' }), false);
  assert.equal(paymentOk({}), false);
});

test('üye kimliği önce basketId üzerinden çözülür', () => {
  const id = 'u_9f2c1ab34de5';
  assert.equal(userIdFromResponse({ basketId: basketIdFor(id) }), id);
});

test('basketId yoksa conversationId zaman damgasından arındırılır', () => {
  const id = 'u_9f2c1ab34de5';
  assert.equal(userIdFromResponse({ conversationId: `uyelik-${id}-1756500000000` }), id);
});

test('tanınmayan yanıttan kimlik uydurulmaz', () => {
  assert.equal(userIdFromResponse({}), '');
  assert.equal(userIdFromResponse({ basketId: 'baska-sey' }), '');
});
