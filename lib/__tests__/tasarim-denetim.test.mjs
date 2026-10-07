import { test } from 'node:test';
import assert from 'node:assert/strict';

import { DENETIM_SAYFALARI, hedefIhlalleri, kucukHedefler, ozetle } from '../tasarim-denetim.mjs';

test('DENETIM_SAYFALARI: G15 alt planındaki sayfa türlerini kapsar, adlar benzersizdir', () => {
  const adlar = DENETIM_SAYFALARI.map((s) => s.ad);
  assert.equal(new Set(adlar).size, adlar.length);
  for (const ad of ['anasayfa', 'makale', 'mevzuat', 'madde', 'ders-notu', 'yargi-arsivi', 'karar', 'rehber', 'hesaplama',
    'yazar', 'bolge', 'uyelik']) {
    assert.ok(adlar.includes(ad), ad);
  }
  for (const s of DENETIM_SAYFALARI) assert.match(s.yol, /^\//, s.ad);
});

test('kucukHedefler: 24 px altındaki görünür hedefleri döndürür, gizli olanı atlar', () => {
  const kutular = [
    { metin: 'büyük', w: 44, h: 44 },
    { metin: 'dar', w: 18, h: 40 },
    { metin: 'alçak', w: 80, h: 20 },
    { metin: 'gizli', w: 0, h: 0 },
    { metin: 'sınırda', w: 24, h: 24 },
  ];
  assert.deepEqual(
    kucukHedefler(kutular).map((k) => k.metin),
    ['dar', 'alçak']
  );
  assert.deepEqual(kucukHedefler(kutular, 44).map((k) => k.metin), ['dar', 'alçak', 'sınırda']);
});

test('hedefIhlalleri: aralık istisnası (24 px daire komşuya değmiyorsa geçer), 1 px sr-only atlanır', () => {
  const kutular = [
    // Alt alta 20 px yüksek iki bağlantı, merkezler arası 22 px: daireler kesişir, ikisi de ihlal.
    { metin: 'sık-1', x: 0, y: 0, w: 100, h: 20 },
    { metin: 'sık-2', x: 0, y: 22, w: 100, h: 20 },
    // Tek başına küçük düğme, en yakın hedef uzakta: geçer.
    { metin: 'yalnız', x: 300, y: 300, w: 22, h: 22 },
    // Büyük hedefin hemen yanındaki küçük hedef: dairesi büyük hedefe değer, ihlal.
    { metin: 'büyük', x: 500, y: 0, w: 44, h: 44 },
    { metin: 'bitişik', x: 546, y: 10, w: 16, h: 16 },
    // Odakta görünen atlama bağlantısı (1×1, sr-only): ölçülmez.
    { metin: 'atla', x: 0, y: 0, w: 1, h: 1 },
  ];
  assert.deepEqual(
    hedefIhlalleri(kutular).map((k) => k.metin),
    ['sık-1', 'sık-2', 'bitişik']
  );
});

test('ozetle: kural başına düğüm ve sayfa sayısı, en çok düğümden aza sıralı', () => {
  const sonuclar = [
    { sayfa: 'a', genislik: 1280, ihlaller: [{ id: 'color-contrast', etki: 'serious', dugum: 5 }], hedef: [{}], tasma: false },
    { sayfa: 'a', genislik: 390, ihlaller: [{ id: 'color-contrast', etki: 'serious', dugum: 3 }], hedef: [], tasma: true },
    { sayfa: 'b', genislik: 1280, ihlaller: [{ id: 'link-name', etki: 'serious', dugum: 1 }, { id: 'color-contrast', etki: 'serious', dugum: 2 }], hedef: [{}, {}], tasma: false },
  ];
  const o = ozetle(sonuclar);
  assert.deepEqual(o.kurallar, [
    { id: 'color-contrast', etki: 'serious', dugum: 10, sayfa: 2 },
    { id: 'link-name', etki: 'serious', dugum: 1, sayfa: 1 },
  ]);
  assert.equal(o.kucukHedef, 3);
  assert.deepEqual(o.tasan, ['a@390']);
});
