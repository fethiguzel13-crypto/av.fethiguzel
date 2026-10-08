import { test } from 'node:test';
import assert from 'node:assert/strict';
import { yargiDagilimi, EN_COK_BIRIM } from '../yargi-dagilim.mjs';

/*
  G17 adım 1: Karar arşivi istatistik sayfasının verisi. Dağılım sitede yayımlanan web indeksinden (`data/yayin/yargi-index.json.gz`,
  G14) sayılır, arşiv ve süzülen toplamı aynı anlık görüntünün `yargi-stats.json` dosyasından gelir. Canlı hasat indeksi
  kullanılmaz: Hasat sürdükçe büyür ve sitedeki "yayında" sayısıyla çelişir. Çıktı yalnız sayım taşır.
*/
const satir = (r, y, ek = {}) => ({ i: 'gizli-kimlik', k: 'gizli künye', e: 'gizli özet', r, y, ...ek });
const ETIKETLER = { hgk: 'Hukuk Genel Kurulu', cgk: 'Ceza Genel Kurulu', yibk: 'İçtihadı birleştirme kararları' };

const ornek = () => ({
  satirlar: [satir('hgk', '2019'), satir('hgk', '2020'), satir('cgk', '2020'), satir('yibk', '2015'), satir('hgk', '')],
  istatistik: { total: 5, arsivToplam: 12, suzulen: 7 },
  etiketler: ETIKETLER,
});

test('yayındaki sayı indeksten, arşiv ve süzülen sayısı aynı anlık görüntüden gelir', () => {
  const d = yargiDagilimi(ornek());
  assert.equal(d.yayinda, 5);
  assert.equal(d.arsiv, 12);
  assert.equal(d.suzulen, 7);
});

test('indeks ile istatistik dosyası çelişirse hata verir', () => {
  assert.throws(() => yargiDagilimi({ ...ornek(), istatistik: { total: 6, arsivToplam: 12, suzulen: 6 } }), /çelişir/);
  assert.throws(() => yargiDagilimi({ ...ornek(), istatistik: { total: 5, arsivToplam: 12, suzulen: 3 } }), /çelişir/);
});

test('birim dağılımı etiketiyle ve büyükten küçüğe verilir, toplam korunur', () => {
  const d = yargiDagilimi(ornek());
  assert.deepEqual(d.birimler, [
    { anahtar: 'hgk', ad: 'Hukuk Genel Kurulu', sayi: 3 },
    { anahtar: 'cgk', ad: 'Ceza Genel Kurulu', sayi: 1 },
    { anahtar: 'yibk', ad: 'İçtihadı birleştirme kararları', sayi: 1 },
  ]);
  assert.equal(d.birimler.reduce((a, b) => a + b.sayi, 0), d.yayinda);
});

test('yıl dağılımı artan sırayla, tarihsiz kararlar ayrıca sayılır', () => {
  const d = yargiDagilimi(ornek());
  assert.deepEqual(d.yillar, [
    { yil: 2015, sayi: 1 },
    { yil: 2019, sayi: 1 },
    { yil: 2020, sayi: 2 },
  ]);
  assert.equal(d.tarihsiz, 1);
});

test(`en çok ${EN_COK_BIRIM} birim çizilir, kalanı "Diğer"de toplanır`, () => {
  const satirlar = [];
  for (let b = 0; b < 11; b++) for (let k = 0; k <= b; k++) satirlar.push(satir(`b${b}`, '2020'));
  const d = yargiDagilimi({ satirlar, istatistik: { total: satirlar.length, arsivToplam: 100, suzulen: 100 - satirlar.length }, etiketler: {} });
  assert.equal(d.birimler.length, EN_COK_BIRIM);
  assert.deepEqual(d.birimler.at(-1), { anahtar: 'diger', ad: 'Diğer', sayi: 1 + 2 + 3 + 4 });
  assert.equal(d.birimler[0].ad, 'b10', 'etiketi olmayan birim anahtarıyla yazılır');
  // Tablo görünümü "Diğer"in içeriğini gösterir (yayındaki İBK kararları bu gruba düşebilir).
  assert.deepEqual(d.digerDetay.map((b) => [b.anahtar, b.sayi]), [['b3', 4], ['b2', 3], ['b1', 2], ['b0', 1]]);
  assert.deepEqual(yargiDagilimi(ornek()).digerDetay, []);
  assert.equal(d.birimler.reduce((a, b) => a + b.sayi, 0), d.yayinda);
});

test('çıktı künye, kimlik ya da özet taşımaz', () => {
  assert.doesNotMatch(JSON.stringify(yargiDagilimi(ornek())), /gizli/);
});

test('yayımlanan dağılım dosyası yargi-stats.json ile aynı anlık görüntüdendir', async () => {
  // Web indeksi yenilendiğinde (build-icthat-data) dağılım da yeniden üretilir: node scripts/yargi-dagilim-uret.mjs --cikti=…
  const { readFileSync } = await import('node:fs');
  const oku = (y) => JSON.parse(readFileSync(new URL(`../../public/data/${y}`, import.meta.url), 'utf8'));
  const d = oku('yargi-dagilim.json');
  const s = oku('yargi-stats.json');
  assert.equal(d.yayinda, s.total);
  assert.equal(d.arsiv, s.arsivToplam);
  assert.equal(d.kaynakTarihi, String(s.generatedAt).slice(0, 10));
  assert.deepEqual(Object.keys(d).sort(), ['arsiv', 'birimler', 'digerDetay', 'kaynakTarihi', 'suzulen', 'tarihsiz', 'yayinda', 'yillar']);
});
