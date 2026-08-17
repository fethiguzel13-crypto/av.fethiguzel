/**
 * İçerik bütünlüğü denetimi — kalıp (boilerplate) metin tespiti.
 *
 * ─── Neden var ───────────────────────────────────────────────────────────────
 * 14.08.2026 denetiminde 8.087 madde şerhinin 1,48 milyon cümlesinin %93,1'i
 * beş veya daha fazla ayrı kanunda tekrar ediyordu. Tek bir kaynak dosya —
 * 5941 sayılı Çek Kanunu şerhi — madde numarası değiştirilerek 45 kanuna
 * kopyalanmıştı. Somut örnek: TMK m. 166 (evlilik birliğinin sarsılması)
 * şerhi, çekin tedavül kabiliyetini ve muhatap bankanın yükümlülüklerini
 * anlatıyordu. Aynı ölçüm vatandaş rehberinde %91,5, ders notlarında %96,0
 * verdi; her iki kümede de kalıp oranı %20'nin altındaki belge sayısı sıfırdı.
 *
 * ─── Nasıl çalışır ───────────────────────────────────────────────────────────
 * Çalışma anında metnin içinde kalıba özgü ayırt edici ifadelerin kaçının
 * geçtiğine bakılır. Önceden üretilmiş bir liste tutulmaz; böylece bir metin
 * yeniden yazıldığında hiçbir yeri güncellemeden kendiliğinden temize çıkar.
 *
 * Bu modül metni SİLMEZ; yalnız hüküm verir. Ne yapılacağına çağıran karar
 * verir (şerhi gizle, noindex ver, uygulamaya alma).
 *
 * Saf JS: hem Next.js (TS) tarafı hem `node --test` betikleri aynı mantığı
 * kullansın diye. Tip yüzeyi için bkz. content-quality.d.ts
 */

/**
 * Çek Kanunu şablonuna özgü ifadeler.
 *
 * Seçim ölçütü: 45 ayrı kanunun şerhinde birebir geçmesi, buna karşılık
 * konusu gerçekten çek olan bir metinde doğal görünmesi. Bu yüzden tek
 * eşleşme hüküm için yetmez — çek maddelerinde bu ifadeler meşrudur.
 */
export const TEMPLATE_FINGERPRINTS = [
  'kanunun koruma amacını ve uygulama mimarisini somutlaştıran temel hükümlerden biridir',
  'piyasa güveni, alacaklının (hamilin) korunması, kayıt düzeni ve dürüst işlem ilkeleri arasında denge kuran',
  'sonraki maddelerle birlikte okunduğunda koruma zincirinin sürekliliği sağlanır',
  'çek ve benzeri ödeme araçlarının tedavül kabiliyetinin korunması',
  'modern bankacılık–risk merkezi altyapısıyla uyumlu bir rejim kurmak üzere ihdas edilmiştir',
  'çek hesabı sahibi, düzenleyen, hamil, muhatap banka ve ilgili kamu mercileri',
  'aksi kararlaştırılamayan yükümler, piyasa güveninin kolektif menfaatini korur',
  'maddenin lafzında bir araya gelerek operasyonel bir rejim kurar',
  'süre ve şekil koşulları şeklinde gruplanabilir',
  'şekle bağlı işlemlerde şekle aykırılık ile esasa aykırılık birbirine karıştırılmamalı',
  'çekin ödeme aracı olarak güvenilirliği ve kayıt dışı ekonomiyle mücadele gibi kamusal menfaatlerdir',
  'kanuni güven mekanizmasının işleticisi',
  'arasında salınabileceği şeklinde değerlendirilmektedir',
  'doğrulanabilir biçimde işletmektir',
  'keşide ettiği çekin karşılıksız çıkması üzerine',
];

/**
 * İkinci nesil şablon.
 *
 * Birinci şablonu ayıkladıktan sonra "temiz" kalan 336 maddede yapılan ikinci
 * ölçüm, 27-30 kanunda tekrar eden ayrı bir kalıp daha ortaya çıkardı. Bu
 * sürüm kanuna göre renklendirilmiş olduğu için çek izleri taşımıyor; yine de
 * madde ile ilgisi yok. Örnek: TMK m. 177 (nafaka davalarında yetki) şerhinde
 * ratio legis, "kişilik hakları ve ehliyet, aile düzeni ve çocuk yararı,
 * mirasın geçmesi ve saklı pay" ekseninde toplanıyor — yetki kuralıyla
 * hiçbiri ilgili değil.
 *
 * Metnin kendisi de itiraf ediyor: "Bu maddeye ilişkin bu metinde somut
 * Yargıtay/Danıştay/AYM künyesi uydurulmamıştır."
 */
export const TEMPLATE_FINGERPRINTS_V2 = [
  'salt lafzî bir emir olmaktan öte; kanunun koruduğu menfaat dengesini somut uyuşmazlığa taşıyan',
  'önceki maddelerde kurulan kavramsal zemin ile sonraki maddelerin usul ve sonuç rejimini birbirine bağlar',
  'hem emredici çekirdek hem de (varsa) tamamlayıcı hareket alanı bakımından iki katmanlı bir okumayı',
  'önce maddenin hangi hukuki ilişkiyi düzenlediğini, sonra hangi şart ve sonuçları bağladığını',
  'kişi/ehliyet ve taraf sıfatı, (iii) şekil–süre–bildirim koşulları',
  'unsur eksikliği, hakkın doğmaması, işlemin sakatlığı veya yaptırımın uygulanamaması sonucunu doğurabilir',
  'sonuç teşhisi yanlış yapılırsa, sonraki dava veya icra adımları da hatalı kurulur',
  'hakkın varlığı maddi hukuktan, ileri sürülmesi ve ispatı usul hukukundan beslenir',
  'sihirli formül» olmadığını; dosyanın somut vakıalarına göre komşu normlarla',
  'somut yargıtay/danıştay/aym künyesi uydurulmamıştır',
  'madde lafzı, sistematik ve öğretideki genel kabuller çerçevesindedir',
  'madde metnini fıkra fıkra ayırmak, (b) her unsur için dosyadaki vakıa–belge eşlemesini kurmak',
  'akademik dürüstlük ilkeleri çerçevesinde hazırlanmıştır',
];

/**
 * Konusu gerçekten çek/kambiyo olan kanunlar. Orada birinci şablonun
 * ifadeleri yerindedir; ikinci şablon için böyle bir muafiyet yoktur.
 */
export const CHEQUE_LAWS = new Set(['cek', 'ttk']);

/** Emsal karar bulunamadığını söyleyen kalıp — 46 kanunun tamamında var. */
export const NO_CASELAW_MARKER =
  'bu maddeye ilişkin son dönemde emsal karar tespit edilemedi';

/** Vatandaş rehberi şablonuna özgü ifadeler. */
export const GUIDE_FINGERPRINTS = [
  'somut madde numarası, fıkra ve bent dosyaya ve yürürlük tarihine göre değişir',
  'benzer ama farklı kurumlar: haklı/geçerli fesih, zamanaşımı/hak düşürücü süre',
  'uygunsa barkodlu çıktıyı saklayın',
  'parasal sınır veya tarife içeren sorularda dönemsel güncellemeyi',
  'portal hesaplama araçları kabaca fikir verir; bağlayıcı değildir',
  'usulsüz tebligat iddiasında öğrenme tarihi kanıtlanmalıdır',
  'tutanak, ekran görüntüsü zinciri ve resmî kayıt',
  'somut dosyanızın tebliğ tarihini, mercisini ve delilini bilmez',
  'kesin oran / herkes böyle yapıyor',
];

/** Ders notu şablonuna özgü ifadeler — 7.999 belgenin tamamında geçenler. */
export const LECTURE_FINGERPRINTS = [
  'omurga bozulduğunda unsurlar boşlukta asılı kalır',
  'tür seçilmeden ayıp yazmak',
  'unsurların olay cümlelerine yedirilmesi',
  'bu halka gevşek kalırsa sonuç cümlesi boşlukta asılı durur',
  'hat orada duruyor; şimdi aynı hat üzerinde bir adım ilerliyoruz',
  'kısa kalıplar ezberlenir, unsurlar yazılmazsa puan kırılır',
];

export function fold(s) {
  return String(s || '')
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('tr-TR');
}

function countHits(haystack, needles) {
  const found = [];
  for (const n of needles) if (haystack.includes(n)) found.push(n);
  return found;
}

/**
 * Kanun maddesi şerhini denetler.
 * @param {string} kanunId  `tmk`, `tbk`, `cek` … — çek kanunlarında eşik yükselir
 * @param {string} commentary
 */
export function auditCommentary(kanunId, commentary) {
  const text = fold(commentary);

  if (!text.trim()) {
    return {
      verdict: 'empty',
      hits: 0,
      matched: [],
      publishable: false,
      reason: 'Bu madde için şerh henüz yazılmadı.',
    };
  }

  // Birinci şablon — çek metninin diğer kanunlara kopyalanmış hâli
  const matchedV1 = countHits(text, TEMPLATE_FINGERPRINTS);
  const thresholdV1 = CHEQUE_LAWS.has(String(kanunId).toLowerCase()) ? 9 : 2;

  if (matchedV1.length >= thresholdV1) {
    return {
      verdict: 'template',
      hits: matchedV1.length,
      matched: matchedV1,
      publishable: false,
      reason:
        'Bu maddenin şerhi, başka bir kanun için yazılmış metnin kopyalanmasıyla üretilmiş; ' +
        'maddeyle ilgisiz olduğu için yayından kaldırıldı. Yeniden yazım sürüyor.',
    };
  }

  // İkinci şablon — kanuna göre renklendirilmiş genel kalıp
  const matchedV2 = countHits(text, TEMPLATE_FINGERPRINTS_V2);
  if (matchedV2.length >= 2) {
    return {
      verdict: 'template',
      hits: matchedV2.length,
      matched: matchedV2,
      publishable: false,
      reason:
        'Bu maddenin şerhi otomatik kalıptan üretilmiş ve maddeye özgü hiçbir değerlendirme ' +
        'içermiyor; yayından kaldırıldı. Yeniden yazım sürüyor.',
    };
  }

  const matched = [...matchedV1, ...matchedV2];

  if (text.length < 800) {
    return {
      verdict: 'thin',
      hits: matched.length,
      matched,
      publishable: false,
      reason: 'Bu maddenin şerhi henüz yeterli derinlikte değil.',
    };
  }

  return { verdict: 'ok', hits: matched.length, matched, publishable: true };
}

/** Vatandaş rehberi makalesini denetler. */
export function auditGuide(parts) {
  const text = fold(
    [
      parts?.lead || '',
      ...(parts?.sections || []).flatMap((s) => [
        ...(s?.paragraphs || []),
        ...(s?.bullets || []),
      ]),
      ...(parts?.faq || []).map((f) => f?.a || ''),
    ].join(' ')
  );

  if (!text.trim()) {
    return { verdict: 'empty', hits: 0, matched: [], publishable: false, reason: 'Metin yok.' };
  }

  const matched = countHits(text, GUIDE_FINGERPRINTS);
  if (matched.length >= 2) {
    return {
      verdict: 'template',
      hits: matched.length,
      matched,
      publishable: false,
      reason:
        'Bu rehber otomatik üretilmiş kalıp metin içeriyor ve somut hukuki bilgi vermiyor; ' +
        'yeniden yazılana kadar yayından kaldırıldı.',
    };
  }

  if (text.length < 1500) {
    return {
      verdict: 'thin',
      hits: matched.length,
      matched,
      publishable: false,
      reason: 'Bu rehber henüz yeterli derinlikte değil.',
    };
  }

  return { verdict: 'ok', hits: matched.length, matched, publishable: true };
}

/** Ders notunu denetler. */
export function auditLectureNote(note) {
  const text = fold(typeof note === 'string' ? note : JSON.stringify(note ?? ''));
  const matched = countHits(text, LECTURE_FINGERPRINTS);

  if (matched.length >= 2) {
    return {
      verdict: 'template',
      hits: matched.length,
      matched,
      publishable: false,
      reason:
        'Bu ders notu, tüm üniversite ve ders kombinasyonlarına çoğaltılmış kalıp metindir; ' +
        'yayından kaldırıldı.',
    };
  }

  return { verdict: 'ok', hits: matched.length, matched, publishable: true };
}

/**
 * Resmî metin yerine ÖZET konulduğunu gösteren desenler.
 *
 * 8.088 maddenin 23'ünde (%0,28) `official` alanı kanun metni değil, kanun
 * metni HAKKINDA bir cümle taşıyor — çoğu İSG paketinde:
 *
 *   *(Fıkra 2, 3, 4 ve 5 resmi madde metninde sırasıyla verilmiştir. …)*
 *
 * Kullanıcı maddeyi okuduğunu sanırken özet okur. Mevzuat uygulamasının tek
 * vaadi metnin Resmî Gazete'deki hâliyle aynı olmasıdır; bu yüzden böyle
 * maddeler sessizce gösterilmez, uyarı şeridiyle işaretlenir.
 *
 * Denetim: node scripts/audit-official-text.mjs
 */
const OFFICIAL_SUMMARY_MARKERS = [
  /resm[iî] madde metninde/i,
  /metin yukar[ıi]da verilmi[şs]tir/i,
  /\*\([^)]*verilmi[şs]tir\.[^)]*\)\*/i,
  /ilgili f[ıi]kralar[ıi] [öo]zetlenmi[şs]/i,
];

/**
 * Resmî metin tam mı, yoksa yerine özet mi konulmuş?
 * @param {string} official
 * @returns {boolean} true = tam görünüyor
 */
export function isOfficialTextComplete(official) {
  const text = String(official || '');
  if (!text.trim()) return false;
  return !OFFICIAL_SUMMARY_MARKERS.some((re) => re.test(text));
}

/** Metinde gerçek emsal karar künyesi var mı? */
export function hasRealCaseLaw(commentary) {
  const text = fold(commentary);
  if (text.includes(NO_CASELAW_MARKER)) return false;
  return /\be\.?\s*\d{4}\s*\/\s*\d+/i.test(text) && /\bk\.?\s*\d{4}\s*\/\s*\d+/i.test(text);
}
