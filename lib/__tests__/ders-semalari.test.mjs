import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEMALAR, tabanKod, dersSemalari } from '../ders-notlari/semalar.mjs';

/*
  G18 adım 1: Ders notu şemalarının verisi. Her adım `content/mevzuat/<kanun>/madde-<n>.md` dosyasındaki kanun metnine bağlıdır;
  dayanak ifadesi madde metninde (dosyada "### Akademik Yorum" başlığından önceki kısım) aynen geçmelidir. Yorum kısmı ve model
  bilgisi dayanak sayılmaz.
*/
const kok = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const kucuk = (s) => s.replace(/\s+/g, ' ').toLocaleLowerCase('tr');

function maddeMetni(kanun, madde) {
  const dosya = join(kok, 'content', 'mevzuat', kanun, `madde-${madde}.md`);
  if (!existsSync(dosya)) return null;
  const s = readFileSync(dosya, 'utf8').replace(/^---[\s\S]*?---/, '');
  const i = s.indexOf('### Akademik');
  return kucuk(i >= 0 ? s.slice(0, i) : s);
}

test('her adımın dayanağı mevzuat dosyasında vardır ve ifade kanun metninde aynen geçer', () => {
  for (const sema of SEMALAR) {
    for (const adim of sema.adimlar) {
      const { kanun, madde, ifade } = adim.dayanak;
      const metin = maddeMetni(kanun, madde);
      assert.ok(metin, `${sema.id}: ${kanun} m.${madde} dosyası yok`);
      assert.ok(metin.includes(kucuk(ifade)), `${sema.id} / ${adim.etiket}: "${ifade}" ${kanun} m.${madde} metninde geçmiyor`);
    }
  }
});

test('kimlikler tekildir, tür bilinir, adım sayısı 3-8, özet ve başlık doludur', () => {
  const kimlikler = SEMALAR.map((s) => s.id);
  assert.equal(new Set(kimlikler).size, kimlikler.length);
  for (const s of SEMALAR) {
    assert.ok(['akis', 'dal'].includes(s.tur), s.id);
    assert.ok(s.adimlar.length >= 3 && s.adimlar.length <= 8, `${s.id}: ${s.adimlar.length} adım`);
    assert.ok(s.baslik.trim() && s.ozet.trim().length >= 40, s.id);
    for (const a of s.adimlar) assert.ok(a.etiket.trim() && a.etiket.length <= 40, `${s.id}: "${a.etiket}" boş ya da uzun`);
  }
});

test('şemalar en az 10 ayrı derse bağlanır ve her ders kodu notlarda vardır', () => {
  const index = JSON.parse(readFileSync(join(kok, 'lib', 'ders-notlari', 'generated', 'index.json'), 'utf8'));
  const tabanlar = new Set(index.notes.map((n) => tabanKod(n.courseCode)));
  const dersler = new Set(SEMALAR.flatMap((s) => s.dersler));
  assert.ok(dersler.size >= 10, `${dersler.size} ders`);
  for (const d of dersler) assert.ok(tabanlar.has(d), `${d} ders kodu notlarda yok`);
});

test('ders kodunun dönem ve yıllık eki atılır, şema taban koda göre bulunur', () => {
  assert.equal(tabanKod('medeni-usul-donem-2'), 'medeni-usul');
  assert.equal(tabanKod('icra-iflas-yillik'), 'icra-iflas');
  assert.equal(tabanKod('miras-hukuku'), 'miras-hukuku');
  assert.ok(dersSemalari('medeni-usul-donem-1').length >= 1);
  assert.deepEqual(dersSemalari('adli-tip-donem-1'), []);
});
