import { test } from 'node:test';
import assert from 'node:assert/strict';
import { baslikSirasi, isaretBolgeleri, odakGorunur } from '../erisilebilirlik.mjs';

/*
  G24 adım 1: Erişilebilirlik yapı kuralları. Tarayıcı yalnız veri toplar (başlık düzeyleri, işaret bölgesi sayıları, odak öncesi ve
  sonrası hesaplanmış stil), karar buradaki saf işlevlerdedir. Bulgu listesi boşsa sayfa kuralı geçer.
*/
const b = (...duzeyler) => duzeyler.map((duzey, i) => ({ duzey, metin: `başlık ${i + 1}` }));

test('tek h1 ve düzey atlamayan başlık sırası bulgu üretmez', () => {
  assert.deepEqual(baslikSirasi(b(1, 2, 3, 3, 2, 3, 4, 2)), []);
  // Derinden sığa inmek atlama değildir.
  assert.deepEqual(baslikSirasi(b(1, 2, 3, 4, 2)), []);
});

test('h1 yoksa ya da birden çoksa bulgu üretir', () => {
  assert.deepEqual(baslikSirasi(b(2, 3)), [{ kural: 'h1-yok' }]);
  assert.deepEqual(baslikSirasi([]), [{ kural: 'h1-yok' }]);
  assert.deepEqual(baslikSirasi(b(1, 2, 1)), [{ kural: 'h1-coklu', sayi: 2 }]);
});

test('bir düzeyden fazla derinleşen başlık atlama bulgusudur', () => {
  assert.deepEqual(baslikSirasi(b(1, 3)), [{ kural: 'duzey-atlama', sira: 1, onceki: 1, sonraki: 3, metin: 'başlık 2' }]);
  assert.deepEqual(baslikSirasi(b(1, 2, 4, 2, 5)), [
    { kural: 'duzey-atlama', sira: 2, onceki: 2, sonraki: 4, metin: 'başlık 3' },
    { kural: 'duzey-atlama', sira: 4, onceki: 2, sonraki: 5, metin: 'başlık 5' },
  ]);
});

test('h1 öncesindeki başlık da sıraya girer, ilk başlığın düzeyi serbesttir', () => {
  // Üst bilgideki görünmez h2'den sonra gelen h1 atlama değildir; h1'in ardından h3 atlamadır.
  assert.deepEqual(baslikSirasi(b(2, 1, 2)), []);
  assert.deepEqual(baslikSirasi(b(2, 1, 3)), [{ kural: 'duzey-atlama', sira: 2, onceki: 1, sonraki: 3, metin: 'başlık 3' }]);
});

test('işaret bölgeleri: tek main, en az bir nav, header ve footer', () => {
  assert.deepEqual(isaretBolgeleri({ main: 1, nav: 2, header: 1, footer: 1 }), []);
  assert.deepEqual(isaretBolgeleri({ main: 0, nav: 1, header: 1, footer: 1 }), [{ kural: 'main-yok' }]);
  assert.deepEqual(isaretBolgeleri({ main: 2, nav: 1, header: 1, footer: 1 }), [{ kural: 'main-coklu', sayi: 2 }]);
  assert.deepEqual(isaretBolgeleri({ main: 1, nav: 0, header: 0, footer: 0 }), [
    { kural: 'nav-yok' },
    { kural: 'header-yok' },
    { kural: 'footer-yok' },
  ]);
  // Eksik alan sıfır sayılır.
  assert.deepEqual(isaretBolgeleri({ main: 1, nav: 1 }), [{ kural: 'header-yok' }, { kural: 'footer-yok' }]);
});

const yok = { outlineStyle: 'none', outlineWidth: '0px', outlineColor: 'rgb(0, 0, 0)', boxShadow: 'none' };

test('odakta beliren dış çizgi görünür halkadır', () => {
  const sonra = { ...yok, outlineStyle: 'solid', outlineWidth: '2px', outlineColor: 'rgb(161, 98, 7)' };
  assert.equal(odakGorunur(yok, sonra), true);
});

test('odakta beliren gölge görünür halkadır', () => {
  const sonra = { ...yok, boxShadow: 'rgb(161, 98, 7) 0px 0px 0px 3px' };
  assert.equal(odakGorunur(yok, sonra), true);
});

test('değişmeyen, sıfır kalınlıklı ya da saydam çizgi görünür sayılmaz', () => {
  assert.equal(odakGorunur(yok, yok), false);
  assert.equal(odakGorunur(yok, { ...yok, outlineStyle: 'solid', outlineWidth: '0px', outlineColor: 'rgb(1, 2, 3)' }), false);
  assert.equal(odakGorunur(yok, { ...yok, outlineStyle: 'solid', outlineWidth: '2px', outlineColor: 'transparent' }), false);
  assert.equal(odakGorunur(yok, { ...yok, outlineStyle: 'solid', outlineWidth: '2px', outlineColor: 'rgba(0, 0, 0, 0)' }), false);
  // Odaktan önce de aynı çizgi varsa odak görsel olarak ayırt edilmez.
  const cizgili = { ...yok, outlineStyle: 'solid', outlineWidth: '2px', outlineColor: 'rgb(161, 98, 7)' };
  assert.equal(odakGorunur(cizgili, cizgili), false);
  const golgeli = { ...yok, boxShadow: 'rgb(0, 0, 0) 0px 1px 2px 0px' };
  assert.equal(odakGorunur(golgeli, golgeli), false);
});

test('ayırt edilebilir başka bir odak halkası da görünür sayılır', () => {
  const once = { ...yok, outlineStyle: 'solid', outlineWidth: '1px', outlineColor: 'rgb(200, 200, 200)' };
  const sonra = { ...once, outlineWidth: '3px', outlineColor: 'rgb(161, 98, 7)' };
  assert.equal(odakGorunur(once, sonra), true);
});
