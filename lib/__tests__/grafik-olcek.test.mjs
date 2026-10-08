import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tikler, sutunYolu } from '../grafik-olcek.mjs';

/*
  G17 adım 3: Grafik ölçeği. Eksen tikleri yuvarlak sayılardır (0 / 5.000 / 10.000), en üst tik en büyük değeri kapsar.
  Sütun tabanda kare, veri ucunda 4 px yuvarlatılmıştır (dataviz işaret kuralı); kısa sütunda yarıçap yüksekliği aşmaz.
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

test('sütun yolu tabanda kare, uçta yuvarlaktır', () => {
  // x=10, taban y=100, genişlik 20, yükseklik 50: tepe y=50, köşe yarıçapı 4.
  assert.equal(sutunYolu(10, 100, 20, 50), 'M10 100V54Q10 50 14 50H26Q30 50 30 54V100Z');
});

test('kısa sütunda yarıçap yüksekliği ve yarı genişliği aşmaz, sıfır yükseklik çizilmez', () => {
  assert.equal(sutunYolu(0, 10, 20, 2), 'M0 10V10Q0 8 2 8H18Q20 8 20 10V10Z');
  assert.equal(sutunYolu(0, 10, 20, 0), '');
});
