/**
 * Sigorta Hukuku (TTK Sigorta + 5684 çerçevesi) —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 */

function baseMeta(variant) {
  const labels = {
    'sigorta-hukuku-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'TTK Sigorta · 1. yarı (sözleşme, menfaat, riziko, prim, poliçe, beyan, mal sigortası girişi)',
    },
    'sigorta-hukuku-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'TTK Sigorta · 2. yarı (can/sorumluluk sigortası, zorunlu sigortalar, rücu, tazminat, tahkim, sona erme)',
    },
    'sigorta-hukuku-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope: 'Sigorta hukuku tam omurga · sözleşme + branşlar + uyuşmazlık · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Sigorta sözleşmesi. Kim, hangi riziko için, ne primle, hangi menfaatle güvence alır?',
    promise:
      'Sigorta sözleşmesinin kuruluşu, menfaat, riziko, prim, poliçe, beyan yükümlülüğü, mal sigortası girişi. Güz finalinde sözleşme iskeleti bozulmadan yazarsınız.',
    sixtySecond: [
      'Sigorta: prim karşılığı riziko teminatı.',
      'Menfaat yoksa sözleşme geçersiz/sonuçsuz kalabilir.',
      'Riziko: belirsiz, geleceğe ilişkin, hukuka uygun olmalı.',
      'Beyan yükümlülüğü: bilinen önemli olgular açıklanır.',
      'Poliçe ispat aracıdır; sözleşme poliçeden önce de kurulabilir.',
      'Mal sigortası: hasar + menfaat + tazminat ilkesi.',
    ],
    pillars: [
      'Sigorta hukukunun kaynakları ve kapsamı',
      'Sigorta sözleşmesinin kuruluşu',
      'Taraflar ve sigorta ettiren / lehtar / sigortalı',
      'Sigorta menfaati',
      'Riziko',
      'Prim',
      'Beyan ve ihbar yükümlülükleri',
      'Mal sigortası girişi',
    ],
    definitions: [
      {
        baslik: 'Sigorta sözleşmesi',
        govde:
          'Sigortacının bir prim karşılığında, kişinin para ile ölçülebilir bir menfaatini zarara uğratan tehlikenin (rizikonun) gerçekleşmesi hâlinde tazminat ödemeyi veya edimde bulunmayı üstlendiği sözleşmedir.',
      },
      {
        baslik: 'Sigorta menfaati',
        govde:
          'Sigorta ettirenin veya sigortalının, rizikonun gerçekleşmemesinde para ile ölçülebilir hukuki yararıdır. Menfaat yokluğu sözleşmeyi etkiler.',
      },
      {
        baslik: 'Riziko',
        govde:
          'Sigorta teminatının konusu olan belirsiz tehlikedir. Gerçekleşmesi tarafların iradesine bağlı olmamalı; hukuka aykırı amaçla sigortalanamaz.',
      },
      {
        baslik: 'Prim',
        govde:
          'Sigorta ettirenin teminat karşılığında ödediği bedeldir. Ödenmemesi teminat ve fesih sonuçları doğurur (çerçeve).',
      },
      {
        baslik: 'Beyan yükümlülüğü',
        govde:
          'Sözleşme kurulurken ve bazı hâllerde devamında, riziko değerlendirmesini etkileyecek önemli olguların dürüstçe açıklanması borcudur.',
      },
    ],
    traps: [
      'Poliçeyi sözleşmenin tek kuruluş şartı sanmak.',
      'Menfaati yok sayıp “herkes her şeyi sigortalar” yazmak.',
      'Beyan ihlalini otomatik butlan sanmak — yaptırım kademeli olabilir.',
      'Prim ödenmemesini her zaman “hiç teminat yok” sanmak — süre ve ihtar.',
      'Mal ve can sigortası ilkelerini aynı potada eritmek.',
    ],
    keyMadde: [
      'TTK m.1401 vd. — sigorta sözleşmesi genel (çerçeve)',
      'TTK m.1408 vd. — beyan yükümlülüğü (çerçeve)',
      'TTK m.1417 vd. — prim (çerçeve)',
      'TTK m.1421 vd. — riziko / ihbar (çerçeve)',
      'TTK m.1453 vd. — mal sigortası (çerçeve)',
      '5684 sayılı Sigortacılık Kanunu — çerçeve (piyasa/denetim)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Sigorta hukuku nedir?',
        paragraphs: [
          'Sigorta hukuku, özel sigorta sözleşmesi ve sigortacılık faaliyetinin kurallarını bir araya getirir. Çekirdek TTK Altıncı Kitap’tadır; 5684 ve branş yönetmelikleri çevreyi tamamlar.',
          '1. dönem sözleşme omurgasını taşır. Can, sorumluluk, zorunlu sigortalar ve uyuşmazlık 2. döneme kalır.',
        ],
        hapBilgi: 'Sözleşme + menfaat + riziko + prim = temel dörtgen.',
      },
      {
        heading: 'B. Kuruluş ve taraflar',
        paragraphs: [
          'Teklif–kabul ile sözleşme kurulur; poliçe çoğunlukla ispat ve içerik belgesidir. Sigortacı, sigorta ettiren, sigortalı ve lehtar rolleri ayrılır.',
          'Başkasının menfaati hesabına sigorta ve lehtar ataması sınavda sık sorulur.',
        ],
        bullets: [
          'Kuruluş anı',
          'Poliçenin işlevi',
          'Sigortalı / lehtar',
          'Temsil / acente girişi',
        ],
      },
      {
        heading: 'C. Menfaat',
        paragraphs: [
          'Menfaat, rizikonun gerçekleşmemesinde hukuki ve parasal yarardır. Menfaat yoksa sözleşme amacına aykırı düşer; sonuçlar TTK’da düzenlenir.',
          'Mal sigortasında menfaat ile sigorta bedeli ilişkisi aşkın sigorta / eksik sigorta tartışmasına bağlanır (giriş).',
        ],
        uyari: 'Menfaat yoksa “tazminat alırım” genellemesi yanlıştır.',
      },
      {
        heading: 'D. Riziko ve prim',
        paragraphs: [
          'Riziko belirsiz ve teminat kapsamına uygun olmalıdır. Riziko artışı ihbarı, prim ayarlaması ve teminatın askıya alınması çerçevede bilinir.',
          'Prim ödeme borcu teminatın karşılığıdır. Gecikme ve ihtar usulü tazminat hakkını etkiler.',
        ],
        kartlar: [
          { baslik: 'Riziko', govde: 'Belirsiz tehlike.' },
          { baslik: 'Prim', govde: 'Teminat bedeli.' },
          { baslik: 'İhbar', govde: 'Değişiklik / hasar.' },
          { baslik: 'Teminat', govde: 'Kapsam + istisna.' },
        ],
      },
      {
        heading: 'E. Beyan yükümlülüğü',
        paragraphs: [
          'Sözleşme kurulurken bilinen, riziko ve prim hesabını etkileyen olgular açıklanır. Yanlış/eksik beyanın yaptırımı (cayma, prim farkı, tazminattan indirme vb.) kademeli okunur.',
          'Sınavda “otomatik geçersizlik” yerine kanuni sonuç tablosu yazın.',
        ],
        hapBilgi: 'Beyan = dürüst açıklama. Yaptırım olguya göre kademeli.',
      },
      {
        heading: 'F. Mal sigortası girişi',
        paragraphs: [
          'Hasar sigortası mantığı: menfaat + hasar + tazminat. Aşkın/eksik sigorta, birden fazla sigorta, halefiyet (rücu) girişi tanınır.',
          '2. dönemde sorumluluk ve zorunlu branşlar bu iskeletin üzerine biner.',
        ],
      },
      {
        heading: 'G. Sınav iskeleti (1. dönem)',
        paragraphs: [
          '(1) sözleşme kuruldu mu (2) menfaat var mı (3) riziko teminat içi mi (4) beyan/prim sorunu var mı (5) sonuç.',
        ],
      },
    ],
    examples: [
      {
        title: 'Menfaat yokluğu',
        facts:
          'Kişi, hukuken ilgisi olmayan bir malı “benimmiş gibi” sigortalatır; hasar olunca tazminat ister.',
        analysis:
          'Menfaat şartı. Sözleşmenin akıbeti. Tazminat talebi.',
        takeaway: 'Menfaat yoksa teminat tartışılır.',
      },
      {
        title: 'Beyan ihlali',
        facts:
          'Sigorta ettiren, riziko ağırlaştıran hastalığı / önceki hasarı gizler; sonra hasar olur.',
        analysis:
          'Beyan yükümlülüğü. Önemli olgu. Yaptırım kademesi. Nedensellik.',
        takeaway: 'Gizleme = kademeli yaptırım kutusu.',
      },
      {
        title: 'Prim gecikmesi',
        facts:
          'Prim süresinde ödenmez; bu sırada hasar gerçekleşir.',
        analysis:
          'Prim borcu. İhtar / teminatın askısı. Hasar anındaki durum.',
        takeaway: 'Prim takvimi teminatı etkiler.',
      },
      {
        title: 'Poliçe–sözleşme',
        facts:
          'Taraflar anlaşmıştır ama poliçe henüz düzenlenmemiştir; hasar çıkar.',
        analysis:
          'Kuruluş anı. Poliçenin ispat işlevi. Teminat başlangıcı.',
        takeaway: 'Poliçe ≠ her zaman kuruluş şartı.',
      },
    ],
    mindmap: {
      center: 'Sigorta · 1. dönem',
      branches: [
        { label: 'Sözleşme', items: ['Kuruluş', 'Taraflar', 'Poliçe'] },
        { label: 'Öz', items: ['Menfaat', 'Riziko', 'Prim'] },
        { label: 'Yüküm', items: ['Beyan', 'İhbar'] },
        { label: 'Branş', items: ['Mal sigortası'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Can ve sorumluluk sigortası, zorunlu branşlar, rücu, tazminat, tahkim. Hasar sonrası hukuk.',
    promise:
      'Can sigortası, sorumluluk/zorunlu sigortalar (trafik), rücu, tazminat hesabı, Sigorta Tahkim, sözleşmenin sona ermesi. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Can sigortası: menfaat ve lehtar rejimi mal sigortasından farklılaşır.',
      'Sorumluluk sigortası: üçüncü kişi zararı teminatı.',
      'Zorunlu trafik: mağdur koruması + rücu ihtimali.',
      'Rücu (halefiyet): ödeyen sigortacının sorumlusuna gitmesi.',
      'Tazminat: kapsam, muafiyet, eksper, ispat.',
      'Uyuşmazlık: tahkim / dava; süreler kritik.',
    ],
    pillars: [
      'Can sigortası',
      'Sorumluluk sigortası',
      'Zorunlu sigortalar (trafik odaklı)',
      'Rücu / halefiyet',
      'Hasar ihbarı ve tazminat',
      'Sigorta Tahkim Komisyonu',
      'Sözleşmenin sona ermesi ve cayma',
      'Acente / broker girişi',
    ],
    definitions: [
      {
        baslik: 'Can sigortası',
        govde:
          'Kişinin hayatı, sağlık veya vücut bütünlüğüne ilişkin rizikolara karşı teminat sağlayan sigorta türüdür. Lehtar ve menfaat kuralları mal sigortasından ayrılır.',
      },
      {
        baslik: 'Sorumluluk sigortası',
        govde:
          'Sigortalının üçüncü kişilere verebileceği zararlar nedeniyle doğacak sorumluluğunu teminat altına alan sigortadır.',
      },
      {
        baslik: 'Rücu (halefiyet)',
        govde:
          'Sigortacının tazminatı ödedikten sonra, sigortalının sorumlu üçüncü kişiye karşı haklarına kanunen geçmesidir.',
      },
      {
        baslik: 'Sigorta tahkimi',
        govde:
          'Sigorta uyuşmazlıklarında Sigorta Tahkim Komisyonu nezdinde görülen, belirli şart ve miktarlara bağlı uyuşmazlık çözüm yoludur.',
      },
      {
        baslik: 'Zorunlu mali sorumluluk sigortası',
        govde:
          'Kanunun belirli faaliyetler için zorunlu kıldığı sorumluluk sigortasıdır. Trafik sigortası en bilinen örnektir.',
      },
    ],
    traps: [
      'Trafik sigortası ile kaskoyu aynı teminat sanmak.',
      'Rücuyu “sigortacı her zaman herkese döner” sanmak — kusur/istisna.',
      'Tahkim süre ve miktar şartını yok saymak.',
      'Can sigortasında mal sigortası menfaat formülünü aynen kopyalamak.',
      'Hasar ihbar gecikmesini her zaman red sebebi yazmak — nedensellik/ihlal ölçüsü.',
    ],
    keyMadde: [
      'TTK m.1487 vd. — can sigortası (çerçeve)',
      'TTK m.1473 vd. — sorumluluk sigortası (çerçeve)',
      'TTK m.1472 — halefiyet / rücu (çerçeve)',
      'TTK m.1446 vd. — hasar ihbarı (çerçeve)',
      '5684 s.K. — sigortacılık ve tahkim çerçevesi',
      'KTK / zorunlu trafik mevzuatı — çerçeve',
    ],
    sectionsExtra: [
      {
        heading: 'A. Can sigortası',
        paragraphs: [
          'Hayat, hastalık, ferdi kaza gibi branşlar can sigortası şemsiyesindedir. Lehtar ataması, menfaat ve cayma/ayrılma değerleri mal sigortasından farklı okunur.',
          'Sınavda “kim lehtar, prim kim ödüyor, riziko ne?” üçlüsü yazılır.',
        ],
        hapBilgi: 'Can sigortası = lehtar + özel menfaat rejimi.',
      },
      {
        heading: 'B. Sorumluluk ve zorunlu sigortalar',
        paragraphs: [
          'Sorumluluk sigortası üçüncü kişi zararını temin eder. Zorunlu trafik sigortası mağduru korur; kasko kendi aracın hasarını (isteğe bağlı) karşılar.',
          'Teminat limitleri, kusur ve rücu sebepleri olayda ayrılır.',
        ],
        bullets: [
          'Sorumluluk teminatı',
          'Zorunlu trafik',
          'Kasko farkı',
          'Limit / muafiyet',
        ],
        uyari: 'Trafik ≠ kasko. Mağdur / kendi araç ayrımı.',
      },
      {
        heading: 'C. Rücu (halefiyet)',
        paragraphs: [
          'Sigortacı ödeme yaptıktan sonra sorumlu üçüncü kişiye rücu edebilir. Sigortalının kusuru, kasten hareketi veya sözleşme istisnaları rücuyu etkiler.',
          'Rücu alacağının kapsamı ödenen tazminatla sınırlıdır (çerçeve).',
        ],
        kartlar: [
          { baslik: 'Ödeme', govde: 'Önce sigortacı öder.' },
          { baslik: 'Geçiş', govde: 'Haklar sigortacıya geçer.' },
          { baslik: 'Sorumlu', govde: 'Üçüncü kişi / sürücü vb.' },
          { baslik: 'Sınır', govde: 'Ödenen kadar.' },
        ],
      },
      {
        heading: 'D. Hasar, ihbar, tazminat',
        paragraphs: [
          'Hasar ihbarı süre ve şekle bağlıdır; gecikmenin sonucu ihlalin niteliğine göre yazılır. Eksper raporu ispat aracıdır, tek başına hüküm değildir.',
          'Tazminat: teminat kapsamı, istisna, muafiyet, eksik/aşkın sigorta etkileri. Red hâlinde gerekçe ve itiraz yolu açılır.',
        ],
      },
      {
        heading: 'E. Sigorta Tahkim',
        paragraphs: [
          'Sigorta Tahkim Komisyonu, kanundaki şartlarla uyuşmazlık çözer. Başvuru süresi, miktar, evrak ve kararın icrası bilinir.',
          'Tahkim–mahkeme ilişkisi ve itiraz imkânı sınavda “hangi yol?” diye sorulur.',
        ],
        hapBilgi: 'Tahkim = özel yol; süre ve miktar şartı unutulmaz.',
      },
      {
        heading: 'F. Sona erme, cayma, fesih',
        paragraphs: [
          'Süre bitimi, rizikonun ortadan kalkması, prim ödenmemesi, beyan ihlali ve kanuni cayma/fesih sebepleri sözleşmeyi bitirir veya etkiler.',
          'Tüketici/lehe hükümler ve süreler branşa göre değişebilir; genel iskelet yeterlidir.',
        ],
      },
      {
        heading: 'G. Acente ve broker girişi',
        paragraphs: [
          'Acente sigortacıyı; broker kural olarak sigorta ettireni temsil eder (çerçeve). Bilgilendirme ve kayıt yükümlülükleri uyuşmazlıkta delil üretir.',
        ],
      },
    ],
    examples: [
      {
        title: 'Trafik vs kasko',
        facts:
          'Kazada karşı araç ve kendi araç zarar görür; sürücü “hepsini trafik öder” der.',
        analysis:
          'Zorunlu trafik = üçüncü kişi. Kasko = kendi araç (varsa). Limit ve kusur.',
        takeaway: 'Teminat öznesini ayır.',
      },
      {
        title: 'Rücu',
        facts:
          'Sigortacı hasarı öder; alkollü sürücüye rücu etmek ister.',
        analysis:
          'Halefiyet. Rücu sebepleri. İspat. Kapsam.',
        takeaway: 'Ödeyen sigortacı → sorumlu kişi.',
      },
      {
        title: 'Tazminat reddi',
        facts:
          'Şirket “istisna maddesi” diyerek ödeme yapmaz; sigortalı itiraz eder.',
        analysis:
          'Teminat–istisna yorumu. İspat. Tahkim/dava. Süre.',
        takeaway: 'Red = gerekçe + yol seçimi.',
      },
      {
        title: 'Tahkim başvurusu',
        facts:
          'Sigortalı uzun süre bekler; sonra hem dava hem tahkim düşünür.',
        analysis:
          'Başvuru şartları ve süre. Mükerrer yol. Kararın etkisi.',
        takeaway: 'Tahkim takvimini tut.',
      },
    ],
    mindmap: {
      center: 'Sigorta · 2. dönem',
      branches: [
        { label: 'Branş', items: ['Can', 'Sorumluluk', 'Zorunlu'] },
        { label: 'Hasar', items: ['İhbar', 'Tazminat', 'Red'] },
        { label: 'Rücu', items: ['Halefiyet', 'Sorumlu'] },
        { label: 'Uyuşmazlık', items: ['Tahkim', 'Dava'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Sigorta sözleşmesinden branşlar, rücu ve tahkime kadar tek omurga.',
    promise:
      '1. + 2. dönem birleşik; sigorta hukuku için “tek cilt” not.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: sözleşme/menfaat mi, branş/hasar/rücu mu?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: sözleşme–menfaat–beyan → deneme → branş–rücu–tahkim → karma.',
          'Her soruda etiket: “Sözleşme sorunu mu, teminat/hasar mı, uyuşmazlık yolu mu?”',
        ],
        hapBilgi: 'Yıllık başarı = doğru menfaat + doğru teminat + doğru yol.',
        bullets: [
          'Hafta 1–4: kuruluş + menfaat + riziko + prim',
          'Hafta 5–7: beyan + mal sigortası',
          'Hafta 8–11: can/sorumluluk + zorunlu + rücu',
          'Hafta 12–14: tazminat + tahkim + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Beyan ihlali. Tip 2 — Menfaat. Tip 3 — Prim gecikmesi. Tip 4 — Trafik/kasko. Tip 5 — Rücu. Tip 6 — Tahkim.',
          'Karma olayda beyan + hasar red + tahkim üst üste binebilir. Sıra: sözleşme geçerli mi → teminat → red gerekçesi → yol.',
        ],
        uyari: 'Tek cevapta tüm sigorta hukukunu özetlemeyin; kapıyı seçin.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Sigorta · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Sözleşme', 'Menfaat', 'Beyan'] },
        { label: '2. yarı', items: ['Branş', 'Rücu', 'Tahkim'] },
        { label: 'Hasar', items: ['İhbar', 'Tazminat'] },
        { label: 'Yöntem', items: ['Kapı seç', 'Süre tut'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'sigorta-hukuku-donem-1': d1Content,
  'sigorta-hukuku-donem-2': d2Content,
  'sigorta-hukuku-yillik': yillikContent,
};

export const SIGORTA_HUKUKU_VARIANTS = [
  'sigorta-hukuku-donem-1',
  'sigorta-hukuku-donem-2',
  'sigorta-hukuku-yillik',
];

export function buildSigortaHukukuVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Sigorta Hukuku ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Sigorta Hukuku ${meta.h1Extra}`;
  const description = `${uni.name} için Sigorta Hukuku ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Sigorta Hukuku ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: sözleşme, menfaat, teminat ve uyuşmazlık yolunu doğru yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Dönemlik program kendi yarısını; yıllık veya bütüncül tekrar yıllık paketi kullanır.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek olay → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda: menfaat var mı? teminat içi mi?',
        'Trafik / kasko ayrımını ilk satırda yaz',
      ],
      hapBilgi: bank.oneLiner,
    },
    {
      heading: '2. 60 saniyede omurga',
      paragraphs: ['Sesli oku, kapat, yaz.'],
      bullets: bank.sixtySecond,
    },
    {
      heading: '3. Kavram haritası ve omurga',
      paragraphs: [`Omurga: ${bank.pillars.join('; ')}.`],
      bullets: bank.pillars.map((p, i) => `${i + 1}) ${p}`),
      hapBilgi: bank.promise,
    },
    {
      heading: '4. Tanım kartları',
      paragraphs: ['İşler tanım = unsur fısıldayan cümle.'],
      kartlar: bank.definitions,
    },
    {
      heading: '5. Pusula maddeler',
      paragraphs: ['Soru tipine göre dayanaklar. Güncel metin: TTK Sigorta + 5684.'],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma madde no yazmayın; TTK/5684 metninden doğrulayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Sigorta Hukuku)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık şart. 60 dk / 3 soruda soru başı ~18 dk.`,
        'İskelet: (1) sözleşme/menfaat (2) teminat (3) yükümlülük ihlali (4) hasar/tazminat (5) yol (tahkim/dava/rücu).',
      ],
      bullets: [
        'Menfaat kutusunu aç',
        'Beyan/prim ihlalini kademeli yaz',
        'Branşı (mal/can/sorumluluk) seç',
        'Tahkim süresini unutma',
      ],
      hapBilgi: 'Doğru menfaat + doğru teminat = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Sigorta Hukuku ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Sözleşme / menfaat',
        'Riziko teminat içi mi?',
        'Beyan–prim–ihbar',
        'Hasar ve ispat',
        'Tazminat / red / rücu',
        'Tahkim veya dava',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'sigorta-hukuku-donem-2'
          ? [
              ['Trafik sigortası', 'Kasko', 'Üçüncü kişi mi kendi araç mı?'],
              ['Rücu', 'Tazminat', 'Geri alma mı ilk ödeme mi?'],
              ['Tahkim', 'Dava', 'Komisyon mu mahkeme mi?'],
              ['Can sigortası', 'Mal sigortası', 'Kişi mi mal menfaati mi?'],
            ]
          : variantCode === 'sigorta-hukuku-donem-1'
            ? [
                ['Poliçe', 'Sözleşme', 'İspat belgesi mi kuruluş mu?'],
                ['Menfaat', 'Teminat bedeli', 'Yarar mı sigorta tutarı mı?'],
                ['Beyan ihlali', 'Butlan', 'Kademeli yaptırım mı otomatik yokluk mu?'],
                ['Prim', 'Riziko', 'Bedel mi tehlike mi?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Sözleşme mi branş/hasar mı?'],
                ['Trafik', 'Kasko', 'Mağdur mu kendi araç mı?'],
                ['Mal', 'Can', 'Hasar mı lehtar mı?'],
                ['Rücu', 'Tahkim', 'Geri alma mı uyuşmazlık yolu mu?'],
              ],
    },
    {
      kind: 'ladder',
      title: 'Öğrenme merdiveni',
      levels: [
        'Tanım kartları',
        'Zihin haritası çiz',
        'Tuzak listesi',
        '4 örnek olay süreyle',
        'Karma deneme + yanlış defteri',
      ],
    },
    {
      kind: 'fork',
      title: 'Soru tipi',
      leftTitle: 'Sözleşme',
      rightTitle: 'Hasar / uyuşmazlık',
      left: 'Menfaat + beyan + prim + riziko',
      right: 'Branş + tazminat + rücu + tahkim',
    },
    {
      kind: 'cycle',
      title: 'Haftalık döngü',
      steps: ['Madde', 'Şema', 'Örnek', 'Quiz', 'Yanlış defteri'],
    },
  ];

  const faq = [
    {
      q: '1. dönem / 2. dönem / yıllık farkı ne?',
      a: '1. dönem sözleşme–menfaat–beyan–mal sigortası girişi; 2. dönem can/sorumluluk–zorunlu–rücu–tahkim; yıllık ikisini birleştirir.',
    },
    {
      q: 'PDF nasıl indirilir?',
      a: '“PDF indir / Yazdır” veya …/pdf → Ctrl+P → PDF olarak kaydet.',
    },
    {
      q: 'Borçlar / tüketici notlarıyla birlikte mi?',
      a: 'Evet. Sözleşme genel hükümleri ve tüketici kesişimlerinde ilgili paketleri açık tutun.',
    },
    {
      q: 'Ücretli mi?',
      a: 'Hayır. Av. Fethi Güzel Hukuk Portalı üzerinden ücretsizdir.',
    },
  ];

  const checklist = [
    '60 sn omurgayı kapalı yazdım',
    'Tanım kartlarını ezberden yazdım',
    'Zihin haritasını çizdim',
    'Tuzak listesinden 5 madde işaretledim',
    'En az 3 örnek olayı süreyle çözdüm',
    'Pusula maddeleri TTK/5684’ten doğruladım',
    'PDF’i arşivledim',
    variantCode === 'sigorta-hukuku-yillik'
      ? '1. ve 2. dönem notlarıyla çapraz tekrar yaptım'
      : 'Diğer yarı / yıllık notla bağlantıyı kontrol ettim',
  ];

  return {
    uniSlug: uni.slug,
    courseCode: variantCode,
    slug: `${uni.slug}__${variantCode}`,
    title,
    description,
    h1,
    keywords: [
      `${uni.shortName} sigorta hukuku ${meta.short}`,
      `${uni.shortName} sigorta ders notu`,
      `sigorta hukuku ${meta.short} not pdf`,
      'sigorta sözleşmesi riziko prim poliçe ders notu',
      'sigorta tahkim rücu yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} sigorta hukuku`),
      'ücretsiz hukuk ders notu',
    ],
    lead,
    promise: bank.promise,
    sixtySecond: bank.sixtySecond,
    examBox: {
      calendar: uni.calendar,
      typicalWeights: 'Ara sınav ~%30–40 · Final ~%50–60 (yönetmeliğe göre)',
      format: uni.type === 'vakif' ? 'Klasik + ara; ödev olabilir' : 'Klasik yazılı ağırlıklı',
      tips: [
        'Menfaat kutusunu aç',
        'Teminat / istisna ayır',
        'Trafik ≠ kasko',
        'Tahkim süresini yaz',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Sigorta Hukuku ${meta.short} kapsamındaki kurumları ayırır`,
      'Sözleşme–menfaat–riziko iskeletini kurar',
      'Branş ve rücu rejimini uygular',
      'Tazminat ve tahkim yolunu seçer',
      'PDF notla düzenli tekrar yapar',
    ],
    sections,
    examples: bank.examples.map((e, i) => ({
      ...e,
      title: `Örnek ${i + 1} — ${e.title}`,
    })),
    diagrams,
    faq,
    checklist,
    relatedCourses: SIGORTA_HUKUKU_VARIANTS.filter((c) => c !== variantCode).concat([
      'sigorta-hukuku',
      'borclar-genel-yillik',
      'tuketici-hukuku',
    ]),
    relatedBilgi: [],
    updated: '2026-07-29',
    wordTarget: variantCode === 'sigorta-hukuku-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'sigorta-hukuku',
    variantLabel: meta.label,
  };
}
