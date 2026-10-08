import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tikler, yuzde, sayi, oranMetni } from '../grafik-olcek.mjs';

/*
  G17 adım 3: Grafik ölçeği. Eksen tikleri yuvarlak sayılardır (0 / 5.000 / 10.000), en üst tik en büyük değeri kapsar.
  Çubuk uzunluğu ölçeğin üst sınırına göre yüzdedir; sayılar Türkçe binlik ayraçla yazılır.
*/
test('tikler sıfırdan başlar, yuvarlak adımla en büyük değeri kapsar', () => {
  assert.deepEqual(tikler(16309), [0, 5000, 10000, 15000, 20000]);
  assert.deepEqual(tikler(12199), [0, 5000, 10000, 15000]);
  assert.deepEqual(tikler(738), [0, 200, 400, 600, 800]);
  assert.deepEqual(tikler(40), [0, 10, 20, 30, 40]);
  assert.deepEqual(tikler(0), [0, 1]);
});

test('tik sayısı ikiden az, altıdan çok değildir', () => {
  for (const m of [1, 7, 99, 101, 999, 1001, 4321, 39718, 114625]) {
    const t = tikler(m);
    assert.ok(t.length >= 2 && t.length <= 6, `${m}: ${t}`);
    assert.ok(t.at(-1) >= m, `${m}: üst tik ${t.at(-1)}`);
  }
});

test('yüzde üst sınıra göre iki basamakla yuvarlanır, sınır dışı değer kırpılır', () => {
  assert.equal(yuzde(7444, 16309), 45.64);
  assert.equal(yuzde(5676, 6000), 94.6);
  assert.equal(yuzde(0, 100), 0);
  assert.equal(yuzde(120, 100), 100);
  assert.equal(yuzde(5, 0), 0);
});

test('sayı Türkçe binlik ayraçla yazılır', () => {
  assert.equal(sayi(16309), '16.309');
  assert.equal(sayi(114625), '114.625');
  assert.equal(sayi(738), '738');
});

test('pay Türkçe yüzde yazımıyla, en çok bir ondalıkla yazılır', () => {
  assert.equal(oranMetni(992.41, 1400), '%70,9');
  assert.equal(oranMetni(70, 1400), '%5');
  assert.equal(oranMetni(1, 0), '%0');
});
