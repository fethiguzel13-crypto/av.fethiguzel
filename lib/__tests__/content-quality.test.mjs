import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gunzipSync } from 'node:zlib';
import { readFileSync, existsSync } from 'node:fs';

import {
  auditCommentary,
  auditGuide,
  auditLectureNote,
  hasRealCaseLaw,
  isOfficialTextComplete,
} from '../content-quality.mjs';

// ─── Birinci şablon: çek metninin başka kanuna kopyalanmış hâli ──────────────

const CEK_TEMPLATE = `
#### 1. Maddenin Sistematiği ve Genel Açıklama
Türk Medeni Kanunu m. 166, «VI. Evlilik birliğinin sarsılması» başlığı altında,
kanunun koruma amacını ve uygulama mimarisini somutlaştıran temel hükümlerden biridir.
Madde, salt teknik bir usul kuralı olmanın ötesinde; piyasa güveni, alacaklının
(hamilin) korunması, kayıt düzeni ve dürüst işlem ilkeleri arasında denge kuran bir
normatif düğüm noktasıdır. Ratio legis, çek ve benzeri ödeme araçlarının tedavül
kabiliyetinin korunması, karşılıksızlık riskinin yönetilmesidir.
`;

test('çek şablonu başka kanunda kalıp sayılır', () => {
  const r = auditCommentary('tmk', CEK_TEMPLATE);
  assert.equal(r.verdict, 'template');
  assert.equal(r.publishable, false);
  assert.ok(r.hits >= 2, `en az iki parmak izi bekleniyordu, ${r.hits} bulundu`);
});

test('aynı metin çek kanununda tek başına kalıp sayılmaz', () => {
  // Çek kanununda bu ifadeler yerinde; eşik 9'a çıkar.
  const r = auditCommentary('cek', CEK_TEMPLATE + 'x'.repeat(900));
  assert.notEqual(r.verdict, 'template');
});

// ─── İkinci şablon: kanuna göre renklendirilmiş genel kalıp ─────────────────

const GENERIC_TEMPLATE = `
#### 1. Maddenin Sistematiği ve Genel Açıklama
Madde, salt lafzî bir emir olmaktan öte; kanunun koruduğu menfaat dengesini somut
uyuşmazlığa taşıyan bir uygulama aracıdır. Sistematik açıdan hüküm, önceki maddelerde
kurulan kavramsal zemin ile sonraki maddelerin usul ve sonuç rejimini birbirine bağlar.
Bu maddeye ilişkin bu metinde somut Yargıtay/Danıştay/AYM künyesi uydurulmamıştır.
`;

test('ikinci nesil şablon da yakalanır', () => {
  const r = auditCommentary('hmk', GENERIC_TEMPLATE);
  assert.equal(r.verdict, 'template');
  assert.equal(r.publishable, false);
});

test('ikinci nesil şablon çek kanununda da yakalanır (muafiyet yok)', () => {
  const r = auditCommentary('cek', GENERIC_TEMPLATE);
  assert.equal(r.verdict, 'template');
});

// ─── Gerçek şerh geçer ──────────────────────────────────────────────────────

const REAL = `
#### 1. Maddenin Sistematiği ve Genel Açıklama
Türk Medeni Kanunu'nun 2. maddesi, özel hukukun en temel etik-hukuki normu ve tüm
hukuki ilişkileri kapsayan emredici bir genel hükümdür. Madde, Başlangıç Hükümleri
kısmında, m. 1'in yorum metodolojisinin hemen ardından yer alarak, hakları kullanma
ve borçları ifa etme süreçlerinin dürüstlük ekseninde işlemesi gerektiğini emreder.
Tarihsel olarak 4721 sayılı yeni TMK 1 Ocak 2002'de yürürlüğe girmiş olup, m. 2
esasen eski 743 sayılı Türk Kanunu Medenisi'nin aynı numaralı maddesinin yeniden
yazımıdır. Hakkın kötüye kullanılması yasağı, hakkın sınırını dürüstlük ölçütüyle
çizer; sınırı aşan kullanım hukuk düzeninin korumasından yararlanamaz. Öğretide
subjektif ve objektif ölçüt tartışması bu noktada yoğunlaşır.
`.repeat(2);

test('elle yazılmış gerçek şerh yayınlanabilir', () => {
  const r = auditCommentary('tmk', REAL);
  assert.equal(r.verdict, 'ok');
  assert.equal(r.publishable, true);
});

test('boş şerh yayınlanamaz', () => {
  const r = auditCommentary('tmk', '');
  assert.equal(r.verdict, 'empty');
  assert.equal(r.publishable, false);
});

test('çok kısa şerh yayınlanamaz', () => {
  const r = auditCommentary('tmk', 'Bu madde önemlidir.');
  assert.equal(r.verdict, 'thin');
  assert.equal(r.publishable, false);
});

// ─── Emsal karar tespiti ────────────────────────────────────────────────────

test('«karar tespit edilemedi» kalıbı emsal sayılmaz', () => {
  assert.equal(
    hasRealCaseLaw(
      'Bu maddeye ilişkin son dönemde emsal karar tespit edilemedi; E. 2020/1 K. 2021/2'
    ),
    false
  );
});

test('gerçek künye emsal sayılır', () => {
  assert.equal(
    hasRealCaseLaw('Yargıtay 2. HD, E. 2021/3322, K. 2022/6178 sayılı kararında…'),
    true
  );
});

test('künye yoksa emsal sayılmaz', () => {
  assert.equal(hasRealCaseLaw('Öğretide baskın görüş bu yöndedir.'), false);
});

// ─── Rehber ve ders notu ────────────────────────────────────────────────────

test('kalıp rehber metni yayınlanamaz', () => {
  const r = auditGuide({
    lead: '«mirasın reddi» — kısa cevap: Red.',
    sections: [
      {
        paragraphs: [
          'Somut madde numarası, fıkra ve bent dosyaya ve yürürlük tarihine göre değişir; /ara ve /mevzuat ile doğrulanmalıdır.',
          'Portal hesaplama araçları kabaca fikir verir; bağlayıcı değildir.',
        ],
      },
    ],
    faq: [],
  });
  assert.equal(r.verdict, 'template');
});

test('kalıp ders notu yayınlanamaz', () => {
  const r = auditLectureNote({
    body: 'Omurga bozulduğunda unsurlar boşlukta asılı kalır. Bu halka gevşek kalırsa sonuç cümlesi boşlukta asılı durur.',
  });
  assert.equal(r.verdict, 'template');
});

// ─── Resmî metin bütünlüğü ──────────────────────────────────────────────────

test('resmî metin yerine özet konulmuşsa yakalanır', () => {
  const summarized =
    'MADDE 14 – (1) İşveren;\n' +
    '*(Tüm alt bentler resmi madde metninde sırasıyla a ve b bentleri olarak verilmiştir.)*';
  assert.equal(isOfficialTextComplete(summarized), false);
});

test('«metin yukarıda verilmiştir» kalıbı yakalanır', () => {
  assert.equal(
    isOfficialTextComplete('Ek Madde 3- *(Metin yukarıda verilmiştir. Beş yıl olarak belirler.)*'),
    false
  );
});

test('gerçek kanun metni tam sayılır', () => {
  assert.equal(
    isOfficialTextComplete(
      'Madde 606 - Miras, üç ay içinde reddolunabilir. Bu süre, yasal mirasçılar için…'
    ),
    true
  );
});

test('boş resmî metin tam sayılmaz', () => {
  assert.equal(isOfficialTextComplete(''), false);
  assert.equal(isOfficialTextComplete('   '), false);
});

// ─── Gerçek külliyata karşı regresyon ───────────────────────────────────────

test('gerçek paketlerde bilinen sonuçlar korunur', { skip: !existsSync('content-packs/tmk.json.gz') }, () => {
  const tmk = JSON.parse(gunzipSync(readFileSync('content-packs/tmk.json.gz')));

  // Elle yazılmış pilotlar geçmeli
  for (const id of ['madde-1', 'madde-2', 'madde-3']) {
    const r = auditCommentary('tmk', tmk[id]?.commentary || '');
    assert.equal(r.publishable, true, `${id} yayınlanabilir olmalıydı (${r.verdict})`);
  }

  // Çek şablonu yapıştırılmış madde reddedilmeli
  const r166 = auditCommentary('tmk', tmk['madde-166']?.commentary || '');
  assert.equal(r166.verdict, 'template', 'TMK 166 kalıp olarak işaretlenmeliydi');
});
