import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  baslikDuzeyleriniDuzle,
  baslikSirasi,
  isaretBolgeleri,
  odakGorunur,
  yapiDenetimi,
  yapiOzeti,
} from '../erisilebilirlik.mjs';

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

/*
  G24 adım 2: Yapı taraması. `scripts/tasarim-denetim.mjs --yapi` her sayfada dili, başlıkları, işaret bölgelerini, alt metni olmayan
  görselleri, adı olmayan grafikleri ve atlama hedefini toplar; değerlendirme `yapiDenetimi`'ndedir.
*/
const temiz = {
  lang: 'tr',
  basliklar: b(1, 2, 3),
  bolgeler: { main: 1, nav: 1, header: 1, footer: 1 },
  altsizGorsel: [],
  adsizGrafik: [],
  atlama: { baglanti: true, hedef: true },
};

test('kurallara uyan sayfa yapı bulgusu üretmez', () => {
  assert.deepEqual(yapiDenetimi(temiz), []);
  assert.deepEqual(yapiDenetimi({ ...temiz, lang: 'tr-TR' }), []);
});

test('atlama bağlantısı olmayan sayfa bulgudur, hedef ayrıca aranmaz (G24 adım 6)', () => {
  // Madde sayfası kök yerleşimi kullanmayan bağımsız HTML'dir; bağlantı yoksa önceki kural boş geçiyordu.
  assert.deepEqual(yapiDenetimi({ ...temiz, atlama: { baglanti: false, hedef: false } }), [{ kural: 'atlama-yok' }]);
  assert.deepEqual(yapiDenetimi({ ...temiz, atlama: { baglanti: false, hedef: true } }), [{ kural: 'atlama-yok' }]);
});

test('belge dili Türkçe değilse ya da yoksa bulgu üretir', () => {
  assert.deepEqual(yapiDenetimi({ ...temiz, lang: 'en' }), [{ kural: 'lang-tr-degil', deger: 'en' }]);
  assert.deepEqual(yapiDenetimi({ ...temiz, lang: '' }), [{ kural: 'lang-tr-degil', deger: null }]);
  assert.deepEqual(yapiDenetimi({ ...temiz, lang: 'trk' }), [{ kural: 'lang-tr-degil', deger: 'trk' }]);
});

test('başlık ve işaret bölgesi bulguları yapı bulgusuna katılır', () => {
  assert.deepEqual(yapiDenetimi({ ...temiz, basliklar: b(2), bolgeler: { main: 2, nav: 1, header: 1, footer: 1 } }), [
    { kural: 'h1-yok' },
    { kural: 'main-coklu', sayi: 2 },
  ]);
});

test('alt metni olmayan görsel, adı olmayan grafik ve hedefsiz atlama bağlantısı bulgudur', () => {
  assert.deepEqual(
    yapiDenetimi({
      ...temiz,
      altsizGorsel: ['/img/a.jpg'],
      adsizGrafik: ['svg.sema'],
      atlama: { baglanti: true, hedef: false },
    }),
    [{ kural: 'gorsel-altsiz', ornek: '/img/a.jpg' }, { kural: 'grafik-adsiz', ornek: 'svg.sema' }, { kural: 'atlama-hedefi-yok' }]
  );
});

test('yapı özeti kuralları sayfa sayısına göre sıralar', () => {
  const ozet = yapiOzeti([
    { sayfa: 'ara', genislik: 1280, bulgular: [{ kural: 'atlama-hedefi-yok' }] },
    { sayfa: 'ara', genislik: 390, bulgular: [{ kural: 'atlama-hedefi-yok' }] },
    { sayfa: 'ders-notu', genislik: 1280, bulgular: [{ kural: 'atlama-hedefi-yok' }, { kural: 'gorsel-altsiz', ornek: 'x' }] },
    { sayfa: 'madde', genislik: 1280, bulgular: [] },
  ]);
  assert.deepEqual(ozet, [
    { kural: 'atlama-hedefi-yok', bulgu: 3, sayfalar: ['ara', 'ders-notu'] },
    { kural: 'gorsel-altsiz', bulgu: 1, sayfalar: ['ders-notu'] },
  ]);
});

/*
  G24 adım 6: Madde sayfasındaki şerh `##` bölüm başlığının altında durur, ama şerh dosyaları başlıklarını `####`'ten başlatır
  (TBK 1'de h2'den h4'e atlama). `baslikDuzeyleriniDuzle` Markdown başlıklarını iç içelik korunarak tabandan başlatır ve hiçbir
  başlığın bir öncekinden birden fazla derinleşmesine izin vermez.
*/
const duzeyler = (md) => [...md.matchAll(/^(#{1,6}) /gm)].map((m) => m[1].length);

test('şerh başlıkları tabandan başlar, iç içelik korunur', () => {
  const md = '#### 1. Giriş\nmetin\n#### 2. Kavramlar\n##### 2.1. Sözleşme\n##### 2.2. İrade\n#### 3. Sonuç\n### Metodolojik Not\n';
  assert.deepEqual(duzeyler(baslikDuzeyleriniDuzle(md, 3)), [3, 3, 4, 4, 3, 3]);
  // Başlık metni ve gövde değişmez.
  assert.match(baslikDuzeyleriniDuzle(md, 3), /^### 1\. Giriş\nmetin\n### 2\. Kavramlar\n#### 2\.1\. Sözleşme$/m);
});

test('başlık düzeltme atlamayı kapatır, sığa inişi korur', () => {
  // h3 → h6 atlaması bir düzeye iner; sonraki h4 kardeş düzeyine döner.
  assert.deepEqual(duzeyler(baslikDuzeyleriniDuzle('### A\n###### B\n#### C\n', 2)), [2, 3, 3]);
  // Taban altındaki h1 de tabana çekilir; sayfada ikinci h1 doğmaz.
  assert.deepEqual(duzeyler(baslikDuzeyleriniDuzle('# A\n## B\n', 3)), [3, 4]);
  // Derinlik 6'yı aşmaz.
  assert.deepEqual(duzeyler(baslikDuzeyleriniDuzle('# A\n## B\n### C\n#### D\n', 4)), [4, 5, 6, 6]);
});

test('başlıksız metin ve satır sonları olduğu gibi kalır', () => {
  assert.equal(baslikDuzeyleriniDuzle('Madde 1 - metin\r\n\r\n**kalın**', 3), 'Madde 1 - metin\r\n\r\n**kalın**');
  assert.equal(baslikDuzeyleriniDuzle('#### A\r\nmetin', 3), '### A\r\nmetin');
  assert.equal(baslikDuzeyleriniDuzle('', 3), '');
});
