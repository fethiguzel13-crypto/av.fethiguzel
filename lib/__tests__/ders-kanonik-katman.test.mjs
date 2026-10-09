import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KATMANLAR, kanonikKatmanUygula, alintiTemizle, bolumTemizle } from '../ders-notlari/kanonik-katman.mjs';
import { kanonikKalite, OLCUTLER } from '../ders-notlari/kanonik-kalite.mjs';
import { maddeMetni, kucuk } from '../ders-notlari/mevzuat-metni.mjs';

/*
  G19 adım 2: Temsilci ders notuna elle yazılmış kanonik katman uygulanır. Katmandaki her hukuki önerme (örnek olay çözümü,
  tuzak, test sorusu) bir dayanak taşır ve dayanak ifadesi depodaki kanun metninde aynen geçer. Doktrin görüşü, yazar adı ve içtihat
  künyesi katmana yazılmaz.
*/
const kok = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const kanonik = JSON.parse(readFileSync(join(kok, 'lib/ders-notlari/dizin-kanonik.json'), 'utf8'));
const temsilciNot = (ders) => {
  const t = kanonik.dersler[ders];
  return JSON.parse(readFileSync(join(kok, 'lib/ders-notlari/generated/notes', `${t.uni}__${t.ders}.json`), 'utf8'));
};
const dayanaklar = (k) => [
  ...k.ornekOlaylar.flatMap((o) => o.dayanaklar),
  ...k.tuzakDefteri.map((t) => t.dayanak),
  ...k.kisaTest.map((q) => q.dayanak),
];
/** Katmanda olmaması gereken içtihat künyesi ve doktrin atfı biçimleri. */
const KUNYE = /\b[EK]\.\s*\d{4}\s*\/\s*\d+|\b\d+\.\s*(HD|CD)\b|\bHGK\b|\bİBK\b|\bYargıtay\b|\bDanıştay\b/;

test('katmanlar temsilcisi olan derslere bağlıdır ve her ders bir kez geçer', () => {
  assert.ok(KATMANLAR.length >= 1);
  const dersler = KATMANLAR.map((k) => k.ders);
  assert.equal(new Set(dersler).size, dersler.length);
  for (const k of KATMANLAR) assert.deepEqual(k.temsilci, kanonik.dersler[k.ders], `${k.ders}: temsilci dizin-kanonik.json ile aynı değil`);
});

test('katman biçimi: en az 3 olay, 4 iskelet adımı, 5 tuzak, 5 soru ve https kaynak', () => {
  for (const k of KATMANLAR) {
    assert.match(k.guncelleme, /^\d{4}-\d{2}-\d{2}$/, k.ders);
    assert.ok(k.ornekOlaylar.length >= 3, `${k.ders}: olay`);
    for (const o of k.ornekOlaylar) {
      for (const alan of ['baslik', 'olay', 'cozum', 'sonuc']) assert.ok(o[alan]?.trim(), `${k.ders} / ${o.baslik}: ${alan}`);
      assert.ok(o.dayanaklar.length >= 1, `${k.ders} / ${o.baslik}: dayanak`);
    }
    assert.ok(k.sinavIskeleti.length >= 4, `${k.ders}: iskelet`);
    for (const s of k.sinavIskeleti) assert.ok(s.adim?.trim() && s.aciklama?.trim(), `${k.ders}: iskelet adımı`);
    assert.ok(k.tuzakDefteri.length >= 5, `${k.ders}: tuzak`);
    for (const t of k.tuzakDefteri) assert.ok(t.tuzak?.trim() && t.dogrusu?.trim() && t.dayanak, `${k.ders}: tuzak kalemi`);
    assert.ok(k.kisaTest.length >= 5, `${k.ders}: test`);
    for (const q of k.kisaTest) {
      assert.equal(q.choices.length, 4, `${k.ders} / ${q.q}`);
      assert.equal(new Set(q.choices).size, 4, `${k.ders} / ${q.q}: şıklar farklı`);
      assert.ok([0, 1, 2, 3].includes(q.answer) && q.reason?.trim(), `${k.ders} / ${q.q}`);
      // Görünüm gerekçeyi olduğu gibi gösterir; dayanak maddesi gerekçede anılmalıdır (`m.28/2`, `m.18/A` gibi).
      const no = String(q.dayanak.madde).replace(/^(\d+)([A-Z])$/, '$1/$2');
      assert.ok(q.reason.includes(`m.${no}`), `${k.ders} / ${q.q}: gerekçe m.${no} maddesini anmıyor`);
    }
    const sorular = k.kisaTest.map((q) => q.q);
    assert.equal(new Set(sorular).size, sorular.length, `${k.ders}: soru kökü yinelenmez`);
    assert.ok(k.kaynaklar.length >= 1 && k.kaynaklar.every((s) => /^https:\/\//.test(s.url) && s.title), `${k.ders}: kaynak`);
  }
});

test('her dayanağın madde dosyası vardır ve ifade kanun metninde aynen geçer', () => {
  for (const k of KATMANLAR) {
    for (const d of dayanaklar(k)) {
      const metin = maddeMetni(d.kanun, String(d.madde));
      assert.ok(metin, `${k.ders}: ${d.kanun} m.${d.madde} dosyası yok`);
      assert.ok(metin.includes(kucuk(d.ifade)), `${k.ders}: "${d.ifade}" ${d.kanun} m.${d.madde} metninde geçmiyor`);
    }
  }
});

test('katman içtihat künyesi ya da yüksek mahkeme adı taşımaz (doğrulanmamış atıf yazılmaz)', () => {
  for (const k of KATMANLAR) {
    const metin = JSON.stringify({ ...k, kaynaklar: [] });
    assert.doesNotMatch(metin, KUNYE, k.ders);
  }
});

test('katman yalnız temsilci nota uygulanır; ad değiştirmeli kopya değişmez', () => {
  const k = KATMANLAR[0];
  const t = kanonik.dersler[k.ders];
  const not = temsilciNot(k.ders);
  const uygulanan = kanonikKatmanUygula(not);
  assert.notEqual(uygulanan, not);
  assert.equal(uygulanan.examples.length, k.ornekOlaylar.length);
  assert.equal(uygulanan.examples[0].facts, k.ornekOlaylar[0].olay);
  assert.deepEqual(uygulanan.sinavIskeleti, k.sinavIskeleti);
  assert.deepEqual(uygulanan.tuzakDefteri, k.tuzakDefteri);
  assert.equal(uygulanan.kisaTest.length, k.kisaTest.length);
  assert.equal(uygulanan.updated, k.guncelleme);
  for (const s of k.kaynaklar) assert.ok(uygulanan.sources.some((x) => x.url === s.url));
  assert.equal(new Set(uygulanan.sources.map((s) => s.url)).size, uygulanan.sources.length, 'kaynak yinelenmez');

  const kopya = { ...not, uniSlug: 'ankara-bilim', slug: `ankara-bilim__${t.ders}` };
  assert.equal(kanonikKatmanUygula(kopya), kopya);
  const donem = { ...not, courseCode: `${k.ders}-donem-1` };
  assert.equal(kanonikKatmanUygula(donem), donem);
});

test('katman uygulanmış temsilci not yedi ölçütün tamamını geçer', () => {
  for (const k of KATMANLAR) {
    const q = kanonikKalite(kanonikKatmanUygula(temsilciNot(k.ders)));
    for (const o of OLCUTLER) {
      assert.equal(q[o].gecti, true, `${k.ders} / ${o}: ${q[o].ayrinti}`);
    }
  }
});

test('getNote katmanı uygular, ders notu görünümü üç yeni bloğu çizer', () => {
  const index = readFileSync(join(kok, 'lib/ders-notlari/index.ts'), 'utf8');
  assert.match(index, /kanonikKatmanUygula\(/);
  const view = readFileSync(join(kok, 'components/DersNotuView.tsx'), 'utf8');
  for (const s of ['note.sinavIskeleti', 'note.tuzakDefteri', 'note.kisaTest', 'Sınav iskeleti', 'Tuzak defteri', 'Kısa test']) {
    assert.ok(view.includes(s), `DersNotuView: ${s}`);
  }
});

/*
  G19 adım 13: Üretilmiş paragraflarda kanun alıntısı ham başlık artığıyla gelir («**Genel olarak** --- MADDE 1- Sözleşme…»).
  Temsilci notta alıntı yalnız madde metnini taşır; aynı alıntıyı yineleyen "ikinci katman" ve "üçüncü okuma" paragrafları düşer.
*/
test('alintiTemizle başlık artığını ve MADDE önekini atar, metne dokunmaz', () => {
  assert.equal(
    alintiTemizle('okur: «**II. Öneri ve kabul 1. Süreli öneri** --- MADDE 3- Kabul için süre belirleyerek.» Bu cümle'),
    'okur: «Kabul için süre belirleyerek.» Bu cümle',
  );
  assert.equal(alintiTemizle('şöyledir: «Genel olarak** --- MADDE 1- Sözleşme kurulur.»'), 'şöyledir: «Sözleşme kurulur.»');
  assert.equal(alintiTemizle('«**b) Ekler** --- MADDE 18/A – Metin.»'), '«Metin.»');
  assert.equal(alintiTemizle('«**Tanımlar** --- Madde 2 - Bir iş sözleşmesine.»'), '«Bir iş sözleşmesine.»');
  assert.equal(alintiTemizle('Lafız TBK m.1 üzerindedir.'), 'Lafız TBK m.1 üzerindedir.');
});

test('bolumTemizle önceki alıntıyı yineleyen katman paragrafını düşürür, en az iki paragraf bırakır', () => {
  const sec = {
    heading: 'Borç ilişkisi',
    paragraphs: [
      'Giriş paragrafı.',
      'Yürürlük cümlesi TBK m. 1 üzerindedir: «**Genel** --- MADDE 1- Sözleşme kurulur. İrade açık veya örtülü olabilir.» Not.',
      'Aynı maddenin ikinci katmanı şöyledir: «Genel** --- MADDE 1- Sözleşme kurulur.» Bu katman sırayı taşır.',
      'Üçüncü okuma, lafzın istisna veya usul cümlesinedir: «İrade açık veya örtülü olabilir.» İstisna yazılmadan genel kural her olaya çekilir.',
      'Son paragraf.',
    ],
  };
  const t = bolumTemizle(sec);
  assert.deepEqual(t.paragraphs, [
    'Giriş paragrafı.',
    'Yürürlük cümlesi TBK m. 1 üzerindedir: «Sözleşme kurulur. İrade açık veya örtülü olabilir.» Not.',
    'Son paragraf.',
  ]);
  const iki = bolumTemizle({ heading: 'x', paragraphs: [sec.paragraphs[1], sec.paragraphs[2]] });
  assert.equal(iki.paragraphs.length, 2, 'bölüm tek paragrafa düşürülmez');
});
