import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GRAFIK, KATEGORIK } from '../grafik-palet.mjs';
import { RENKLER } from '../tasarim-jetonlari.mjs';

/*
  G17 adım 2: Grafik paleti. Tek serili çubuk ve sütun grafiği tek renkle çizilir (dataviz: adlandırılmış kategoriler
  değerine göre boyanmaz). Kategorik palet yalnız yığılmış dökümde kullanılır; sırası doğrulayıcıdan geçen sıradır
  (`raporlar/g17-grafikler.md`) ve değiştirilmez.
*/
test('tek serili işaret rengi sitenin vurgu rengidir', () => {
  assert.equal(GRAFIK.isaret, RENKLER.accent.DEFAULT);
  assert.equal(KATEGORIK[0], RENKLER.accent.DEFAULT);
});

test('kategorik palet doğrulanan sırayla ve en çok üç renktir', () => {
  assert.deepEqual(KATEGORIK, ['#CC5833', '#2a78d6', '#1baf7a']);
});

test('metin, eksen ve ızgara seri renginde değildir', () => {
  for (const anahtar of ['metin', 'ikincilMetin', 'eksen', 'izgara']) {
    assert.ok(!KATEGORIK.map((r) => r.toLowerCase()).includes(GRAFIK[anahtar].toLowerCase()), anahtar);
  }
  assert.equal(GRAFIK.metin, RENKLER.charcoal);
  assert.equal(GRAFIK.ikincilMetin, RENKLER.ink.muted);
});
