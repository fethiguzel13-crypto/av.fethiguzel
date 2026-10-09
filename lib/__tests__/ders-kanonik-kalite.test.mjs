import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kanonikKalite, OLCUTLER, ortakDizi } from '../ders-notlari/kanonik-kalite.mjs';

/*
  G19 adım 1: Temsilci ders notunun `KALITE-VE-ARASTIRMA.md` §4 ölçütleri. Dayanak doğrulaması dışarıdan verilen `maddeMetni`
  ile yapılır; burada sahte bir mevzuat sözlüğü kullanılır, gerçek dosyalar katman testinde (`ders-kanonik-katman.test.mjs`) okunur.
*/
const MEVZUAT = {
  'tbk/1': 'madde 1- sözleşme, tarafların iradelerini karşılıklı ve birbirine uygun olarak açıklamalarıyla kurulur.',
  'tbk/49': 'madde 49- kusurlu ve hukuka aykırı bir fiille başkasına zarar veren, bu zararı gidermekle yükümlüdür.',
};
const maddeMetni = (kanun, madde) => MEVZUAT[`${kanun}/${madde}`] ?? null;
const d1 = { kanun: 'tbk', madde: '1', ifade: 'birbirine uygun olarak açıklamalarıyla kurulur' };
const d49 = { kanun: 'tbk', madde: '49', ifade: 'bu zararı gidermekle yükümlüdür' };

function iyiNot() {
  return {
    courseCode: 'borclar-genel-yillik',
    sections: [
      { heading: 'Borç ilişkisi', paragraphs: ['Birinci paragraf.', 'İkinci paragraf.'] },
      { heading: 'Haksız fiil', paragraphs: ['Üçüncü paragraf.', 'Dördüncü paragraf.'] },
      { heading: 'Sınav iskeleti ve kaynakça disiplini', paragraphs: ['Tek paragraf.'] },
    ],
    examples: [
      { title: 'a', facts: 'Ahmet Bursa’daki aracını Ayşe’ye yüz bin liraya satmak için mektup gönderir.', analysis: 'x', takeaway: 'y', dayanaklar: [d1] },
      { title: 'b', facts: 'Komşunun çatısından düşen kiremit park hâlindeki otomobilin camını kırar.', analysis: 'x', takeaway: 'y', dayanaklar: [d49] },
      { title: 'c', facts: 'Bir yayınevi, yazarla görüşmeleri sürerken kitabın kapak tasarımını bastırır.', analysis: 'x', takeaway: 'y', dayanaklar: [d1] },
    ],
    sinavIskeleti: [
      { adim: 'Borcun kaynağı', aciklama: 'a' },
      { adim: 'Unsurlar', aciklama: 'b' },
      { adim: 'Olaya uygulama', aciklama: 'c' },
      { adim: 'Sonuç', aciklama: 'd' },
    ],
    tuzakDefteri: Array.from({ length: 5 }, (_, i) => ({ tuzak: `t${i}`, dogrusu: `d${i}`, dayanak: i % 2 ? d1 : d49 })),
    kisaTest: Array.from({ length: 5 }, (_, i) => ({
      q: `Soru ${i}`,
      choices: ['A', 'B', 'C', 'D'],
      answer: 1,
      reason: 'Çünkü.',
      dayanak: d1,
    })),
    sources: [{ title: 'Kaynak', url: 'https://example.org' }],
  };
}

test('ölçüt listesi KALITE-VE-ARASTIRMA §4 ile yedi kalemdir', () => {
  assert.deepEqual(OLCUTLER, ['paragraf', 'ornekOlay', 'sinavIskeleti', 'tuzakDefteri', 'kaynak', 'sema', 'kisaTest']);
});

test('bütün ölçütleri karşılayan not yedi ölçütten geçer', () => {
  const k = kanonikKalite(iyiNot(), { maddeMetni });
  for (const o of OLCUTLER) assert.equal(k[o].gecti, true, `${o}: ${k[o].ayrinti}`);
  assert.equal(k.gecen, 7);
});

test('paragrafta ham kanun başlığı artığı ölçütü düşürür', () => {
  const n = iyiNot();
  n.sections[0].paragraphs.push('Lafız şöyledir: «**Genel olarak** --- MADDE 1- Sözleşme …»');
  const k = kanonikKalite(n, { maddeMetni });
  assert.equal(k.paragraf.gecti, false);
  assert.equal(k.paragraf.deger, 1);
});

test('öğretim bölümünde tek paragraf ölçütü düşürür, sınav tekniği bölümü sayılmaz', () => {
  const n = iyiNot();
  n.sections[1].paragraphs = ['Yalnız bir paragraf.'];
  assert.equal(kanonikKalite(n, { maddeMetni }).paragraf.gecti, false);
});

test('kalıptan üretilmiş örnek olaylar birbirinin kopyası sayılır', () => {
  const n = iyiNot();
  const kalip = (kurum) =>
    `Kızılay'daki bir kira ve kefalet uyuşmazlığı içinde taraf, ${kurum} rejimine dayanarak talep yöneltir. Karşı taraf unsurların oluşmadığını ileri sürer.`;
  n.examples = ['borç ilişkisi', 'temsil', 'ifa'].map((k) => ({ title: k, facts: kalip(k), analysis: 'x', takeaway: 'y', dayanaklar: [d1] }));
  const k = kanonikKalite(n, { maddeMetni });
  assert.equal(k.ornekOlay.gecti, false);
  assert.match(k.ornekOlay.ayrinti, /ortak/);
});

test('dayanaksız ya da üçten az örnek olay ölçütü düşürür', () => {
  const n = iyiNot();
  n.examples[2].dayanaklar = [];
  assert.equal(kanonikKalite(n, { maddeMetni }).ornekOlay.gecti, false);
  const m = iyiNot();
  m.examples.pop();
  assert.equal(kanonikKalite(m, { maddeMetni }).ornekOlay.gecti, false);
});

test('sınav iskeleti dört adımdan az ise düşer', () => {
  const n = iyiNot();
  n.sinavIskeleti.pop();
  assert.equal(kanonikKalite(n, { maddeMetni }).sinavIskeleti.gecti, false);
  delete n.sinavIskeleti;
  assert.equal(kanonikKalite(n, { maddeMetni }).sinavIskeleti.gecti, false);
});

test('tuzak defteri beş kalemden az ya da dayanaksız ise düşer', () => {
  const n = iyiNot();
  n.tuzakDefteri.pop();
  assert.equal(kanonikKalite(n, { maddeMetni }).tuzakDefteri.gecti, false);
  const m = iyiNot();
  delete m.tuzakDefteri[0].dayanak;
  assert.equal(kanonikKalite(m, { maddeMetni }).tuzakDefteri.gecti, false);
});

test('kanun metninde geçmeyen ya da dosyası olmayan dayanak kaynak ölçütünü düşürür', () => {
  const n = iyiNot();
  n.tuzakDefteri[0].dayanak = { kanun: 'tbk', madde: '1', ifade: 'uydurma ifade' };
  const k = kanonikKalite(n, { maddeMetni });
  assert.equal(k.kaynak.gecti, false);
  assert.match(k.kaynak.ayrinti, /tbk m\.1/);
  const m = iyiNot();
  m.kisaTest[0].dayanak = { kanun: 'tbk', madde: '999', ifade: 'x' };
  assert.equal(kanonikKalite(m, { maddeMetni }).kaynak.gecti, false);
});

test('adressiz kaynak listesi kaynak ölçütünü düşürür', () => {
  const n = iyiNot();
  n.sources = [];
  assert.equal(kanonikKalite(n, { maddeMetni }).kaynak.gecti, false);
});

test('şeması olmayan ders şema ölçütünden kalır', () => {
  const n = iyiNot();
  n.courseCode = 'vergi-hukuku-yillik';
  assert.equal(kanonikKalite(n, { maddeMetni }).sema.gecti, false);
});

test('kısa test beş sorudan az, şıkları yinelenen ya da cevabı geçersiz ise düşer', () => {
  const n = iyiNot();
  n.kisaTest.pop();
  assert.equal(kanonikKalite(n, { maddeMetni }).kisaTest.gecti, false);
  const m = iyiNot();
  m.kisaTest[0].choices = ['A', 'A', 'C', 'D'];
  assert.equal(kanonikKalite(m, { maddeMetni }).kisaTest.gecti, false);
  const r = iyiNot();
  r.kisaTest[0].answer = 4;
  assert.equal(kanonikKalite(r, { maddeMetni }).kisaTest.gecti, false);
});

test('ortakDizi iki metindeki en uzun ortak sözcük dizisini verir', () => {
  assert.equal(ortakDizi('a b c d e', 'x b c d y'), 3);
  assert.equal(ortakDizi('a b', 'c d'), 0);
});
