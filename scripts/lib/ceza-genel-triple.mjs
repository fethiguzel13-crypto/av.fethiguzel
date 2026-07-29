/**
 * Ceza Hukuku Genel Hükümler (TCK I. Kitap) —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 */

function baseMeta(variant) {
  const labels = {
    'ceza-genel-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'TCK Genel · 1. yarı (suç teorisi, tipiklik, hukuka aykırılık, kast–taksir, hata girişi)',
    },
    'ceza-genel-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'TCK Genel · 2. yarı (teşebbüs, iştirak, içtima, yaptırım, güvenlik tedbirleri, zamanaşımı girişi)',
    },
    'ceza-genel-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope: 'Ceza genel hükümler tam omurga · suç teorisi + yaptırım · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Suç = tipiklik + hukuka aykırılık + kusur. Kutuları ayrı yaz, birbirine karıştırma.',
    promise:
      'Suç teorisi iskeleti, tipiklik, hukuka uygunluk sebepleri, kast–olası kast–taksir, hata. Güz finalinde unsur şeması bozulmadan yazarsınız.',
    sixtySecond: [
      'Kanunsuz suç ve ceza olmaz (TCK m.2).',
      'Tipiklik: fiil kanuni tanıma uyar mı?',
      'Hukuka aykırılık: meşru savunma, zorunluluk vb. kırar mı?',
      'Kusur: kast / taksir; ayırt etme gücü.',
      'Olası kast ≠ bilinçli taksir — irade farkı yaz.',
      'Cevap: her kutuyu ayrı başlıkla kapat.',
    ],
    pillars: [
      'Ceza hukukunun ilkeleri',
      'Suç teorisi (üçlü yapı)',
      'Tipiklik (objektif + sübjektif)',
      'Hukuka aykırılık ve hukuka uygunluk sebepleri',
      'Kast ve olası kast',
      'Taksir ve bilinçli taksir',
      'Hata (fiili / hukuki) girişi',
      'Kusur yeteneği girişi',
    ],
    definitions: [
      {
        baslik: 'Tipiklik',
        govde:
          'Fiilin kanundaki suç tanımındaki objektif ve sübjektif unsurlara uymasıdır. Kanunsuz suç olmaz ilkesinin somutudur.',
      },
      {
        baslik: 'Kast',
        govde:
          'Suçun kanuni tanımındaki unsurların bilerek ve isteyerek gerçekleştirilmesidir. Olası kast, neticenin öngörülüp göze alınmasıdır.',
      },
      {
        baslik: 'Taksir',
        govde:
          'Dikkat ve özen yükümlülüğüne aykırılıkla bir neticenin öngörülmeyerek gerçekleştirilmesidir. Bilinçli taksirde netice öngörülür ama istenmez.',
      },
      {
        baslik: 'Meşru savunma',
        govde:
          'Gerek kendisine gerek başkasına ait bir hakka yönelmiş, gerçekleşen, gerçekleşmesi veya tekrarı muhakkak olan haksız bir saldırıyı o anda hal ve koşullara göre saldırı ile orantılı biçimde defetmektir.',
      },
      {
        baslik: 'Hukuka aykırılık',
        govde:
          'Tipik fiilin hukuk düzenince yasaklanmış olmasıdır. Hukuka uygunluk sebepleri bu yasaklığı kaldırır.',
      },
    ],
    traps: [
      'Olası kast ile bilinçli taksiri aynı cümlede eritmek.',
      'Meşru savunmayı “öfke” ile karıştırmak — saldırı + oran + an.',
      'Tipikliği atlayıp doğrudan kusur yazmak.',
      'Hukuki hatayı her zaman mazeret sanmak.',
      'Hazırlık hareketini teşebbüs sanmak (2. dönem köprüsü).',
    ],
    keyMadde: [
      'TCK m.1–2 — amaç / kanunsuz suç ve ceza',
      'TCK m.21 — kast / olası kast',
      'TCK m.22 — taksir / bilinçli taksir',
      'TCK m.25 — meşru savunma',
      'TCK m.24–28 — hukuka uygunluk / hata çerçevesi',
      'TCK m.31 vd. — yaş küçüklüğü / akıl hastalığı (kusur yeteneği)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Ceza genel nedir?',
        paragraphs: [
          'Genel hükümler tüm suç tiplerine uygulanan ortak teoridir. Özel hükümler (ceza özel) somut suçları tarif eder; sınavda önce genel iskelet, sonra tipe inilir.',
          '1. dönem suçun kuruluş kutularını; 2. dönem genişleme (teşebbüs–iştirak–içtima) ve yaptırımı taşır.',
        ],
        hapBilgi: 'Suç = tipiklik + hukuka aykırılık + kusur.',
      },
      {
        heading: 'B. İlkeler',
        paragraphs: [
          'Kanunilik, kusur, insanilik, ölçülülük iskeleti bilinir. Kıyas yasağı ve lehe kanun uygulaması (TCK m.7) olayda yazılır.',
        ],
        bullets: ['Kanunilik', 'Kusur ilkesi', 'Lehe kanun', 'Zaman bakımından uygulama'],
      },
      {
        heading: 'C. Tipiklik',
        paragraphs: [
          'Objektif: fiil, netice, nedensellik, objektif isnadiyet. Sübjektif: kast/taksir tipi. Eksik tipiklik = suç yok.',
          'Sınavda her unsuru numaralayın; “genel olarak suçtur” yazmayın.',
        ],
      },
      {
        heading: 'D. Hukuka aykırılık',
        paragraphs: [
          'Tipik fiil kural olarak hukuka aykırıdır. Meşru savunma, zorunluluk hali, kanunun hükmü, meşru savunmada sınırın aşılması (ayrı rejim), ilgilinin rızası vb. kutuları açılır.',
          'Oran, an ve saldırının haksızlığı meşru savunmada kritiktir.',
        ],
        kartlar: [
          { baslik: 'Meşru savunma', govde: 'Saldırı + oran + an.' },
          { baslik: 'Zorunluluk', govde: 'Tehlike + oran.' },
          { baslik: 'Kanun hükmü', govde: 'Yetkili fiil.' },
          { baslik: 'Rıza', govde: 'Sınırlı etki.' },
        ],
      },
      {
        heading: 'E. Kast ve taksir',
        paragraphs: [
          'Kast: bilme + isteme. Olası kast: öngörme + göze alma. Taksir: özen ihlali + öngörmeme. Bilinçli taksir: öngörme + istememe.',
          'Ayırıcı soru: netice isteniyor mu, göze mi alınıyor, yoksa sadece öngörülüp istenmiyor mu?',
        ],
        uyari: 'Olası kast / bilinçli taksir sınavın en sık tuzağıdır.',
      },
      {
        heading: 'F. Hata ve kusur yeteneği girişi',
        paragraphs: [
          'Fiili hata kastı kaldırabilir; hukuki hata kural olarak engel değildir (istisnalar/çerçeve). Yaş ve akıl hastalığı kusur yeteneğini etkiler.',
          '2. dönemde yaptırım ve güvenlik tedbirleriyle bağ kurulur.',
        ],
      },
      {
        heading: 'G. Sınav iskeleti (1. dönem)',
        paragraphs: [
          '(1) tipiklik (2) hukuka aykırılık (3) kusur formu (4) hata/mazeret (5) sonuç: suç var/yok.',
        ],
      },
    ],
    examples: [
      {
        title: 'Olası kast',
        facts:
          'Sanık kalabalığa ateş eder; “ölürse ölsün” demese de neticeyi göze aldığı anlaşılır.',
        analysis:
          'Öngörme + kabullenme. Bilinçli taksirden ayırım. Delil görünümü.',
        takeaway: 'İrade: göze alma mı istememe mi?',
      },
      {
        title: 'Meşru savunma',
        facts:
          'Saldırı bitmişken ağır misilleme yapılır.',
        analysis:
          'Saldırının devamı. Oran. An. Sınırın aşılması.',
        takeaway: 'Saldırı bittiyse savunma biter.',
      },
      {
        title: 'Taksir',
        facts:
          'Sürücü kırmızıda geçer; yaya ölür. “Şaka yaptım” der.',
        analysis:
          'Özen yükümlülüğü. Öngörülebilirlik. Bilinçli taksir ihtimali.',
        takeaway: 'Özen ihlali + netice.',
      },
      {
        title: 'Tipiklik eksik',
        facts:
          'Fiil kanundaki tanıma uymayan bir yolla işlenir; savcılık suç isnat eder.',
        analysis:
          'Kanuni tanım. Unsur kontrolü. Kıyas yasağı.',
        takeaway: 'Tanıma uymazsa tipiklik yok.',
      },
    ],
    mindmap: {
      center: 'Ceza Genel · 1. dönem',
      branches: [
        { label: 'Tipiklik', items: ['Fiil', 'Netice', 'Kast/taksir'] },
        { label: 'Hukuka aykırılık', items: ['Meşru savunma', 'Zorunluluk'] },
        { label: 'Kusur', items: ['Kast', 'Taksir', 'Hata'] },
        { label: 'İlke', items: ['Kanunilik', 'Kusur'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Teşebbüs, iştirak, içtima, ceza ve güvenlik tedbirleri. Suçun genişlemesi ve yaptırım.',
    promise:
      'Teşebbüs ve gönüllü vazgeçme, faillik–azmettirme–yardım, içtima, ceza türleri, indirme/artırım, güvenlik tedbirleri, dava/ceza zamanaşımı girişi. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Teşebbüs: icraya elverişli başlama + tamamlanmama.',
      'Gönüllü vazgeçme / etkin pişmanlık ayrı kutular.',
      'İştirak: faillik, azmettirme, yardım — rol rol yaz.',
      'İçtima: tek fiil / çok fiil; zincirleme suç.',
      'Yaptırım: hapis, adli para, seçenekler, erteleme girişi.',
      'Güvenlik tedbirleri kusurdan bağımsız amaç taşıyabilir.',
    ],
    pillars: [
      'Teşebbüs',
      'Gönüllü vazgeçme ve etkin pişmanlık girişi',
      'İştirak (faillik, azmettirme, yardım)',
      'İçtima ve zincirleme suç',
      'Cezalar ve güvenlik tedbirleri',
      'Takdiri indirim / nitelikli hâller girişi',
      'Erteleme, hükmün açıklanmasının geri bırakılması girişi',
      'Dava ve ceza zamanaşımı girişi',
    ],
    definitions: [
      {
        baslik: 'Teşebbüs',
        govde:
          'Kişi, işlemeyi kastettiği bir suçu elverişli hareketlerle doğrudan icraya başlayıp elinde olmayan nedenlerle tamamlayamazsa teşebbüsten sorumlu olur.',
      },
      {
        baslik: 'Azmettirme',
        govde:
          'Başkasını bir suçu işlemeye sevk etmektir. Azmettiren, işlenen suçun cezası ile cezalandırılır (çerçeve).',
      },
      {
        baslik: 'Yardım',
        govde:
          'Suçun işlenmesini kolaylaştıran maddi veya manevi destektir. Ceza, faile göre indirimli uygulanır (çerçeve).',
      },
      {
        baslik: 'İçtima',
        govde:
          'Birden fazla suç tipinin tek veya birden fazla fiille gerçekleşmesi hâlinde uygulanacak ceza rejimidir. Fikri içtima, gerçek içtima, zincirleme suç ayrılır.',
      },
      {
        baslik: 'Güvenlik tedbiri',
        govde:
          'Ceza yanında veya yerine, tehlikeliliği azaltmaya yönelik tedbirlerdir (çocuklara özgü, hak yoksunluğu, müsadere vb. çerçeve).',
      },
    ],
    traps: [
      'Hazırlık hareketini teşebbüs yazmak.',
      'Her iştirakçiyi “asli fail” sanmak.',
      'Zincirleme suçu gerçek içtima sanmak.',
      'Gönüllü vazgeçmeyi “pişman oldum”a indirgemek — tamamlamama iradesi.',
      'Yaptırım hesabını tek cümlede geçiştirmek.',
    ],
    keyMadde: [
      'TCK m.35 — teşebbüs',
      'TCK m.36 — gönüllü vazgeçme',
      'TCK m.37–39 — faillik, azmettirme, yardım',
      'TCK m.42–44 — içtima',
      'TCK m.43 — zincirleme suç',
      'TCK m.45 vd. — cezalar / güvenlik tedbirleri (çerçeve)',
      'TCK m.66–68 — zamanaşımı (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Teşebbüs',
        paragraphs: [
          'İcraya elverişli hareket + doğrudan başlama + tamamlanmama + elinde olmayan neden. Hazırlık teşebbüs değildir.',
          'Ceza, tamamlanmış suça göre indirilir. Gönüllü vazgeçme teşebbüs cezasını kaldırabilir (şartlar).',
        ],
        hapBilgi: 'İcra çizgisi = teşebbüs eşiği.',
      },
      {
        heading: 'B. Gönüllü vazgeçme ve etkin pişmanlık',
        paragraphs: [
          'Gönüllü vazgeçme: icraya başladıktan sonra kendi iradesiyle tamamlamama / neticeyi önleme. Etkin pişmanlık özel hükümlerde (hırsızlık vb.) ayrıca düzenlenir; genel/özel ayrımı yazılır.',
        ],
      },
      {
        heading: 'C. İştirak',
        paragraphs: [
          'Her fail için rol cümlesi zorunludur: müşterek faillik, dolaylı faillik, azmettirme, yardım. Bağlılık kuralı ve iştirak hâlinde nitelikli unsurlar dikkat ister.',
          '“Hepsini fail yazdım” puan kaybettirir.',
        ],
        kartlar: [
          { baslik: 'Fail', govde: 'Tipik fiili işler.' },
          { baslik: 'Azmettiren', govde: 'Suça sevk eder.' },
          { baslik: 'Yardım eden', govde: 'Kolaylaştırır.' },
          { baslik: 'Bağlılık', govde: 'Asıl fiile bağ.' },
        ],
        uyari: 'Rol rol yaz; tek torba yapma.',
      },
      {
        heading: 'D. İçtima',
        paragraphs: [
          'Fikri içtima: tek fiil birden fazla suça; gerçek içtima: birden fazla fiil. Zincirleme suç: aynı suçun birden fazla kez işlenmesi (şartlar).',
          'Hangi rejim hangi ceza hesabını doğurur — tabloyu kurun.',
        ],
      },
      {
        heading: 'E. Yaptırım',
        paragraphs: [
          'Hapis, adli para cezası, seçenek yaptırımlar, erteleme ve HAGB girişi bilinir. Alt/üst sınır, nitelikli hâller ve takdiri indirim zinciri yazılır.',
          'Güvenlik tedbirleri (müsadere, hak yoksunluğu, çocuklara özgü tedbirler) ayrı kutudur.',
        ],
      },
      {
        heading: 'F. Zamanaşımı girişi',
        paragraphs: [
          'Dava zamanaşımı soruşturma/kovuşturmayı; ceza zamanaşımı infazı etkiler. Süreler suçun ağırlığına göre değişir — güncel maddeden doğrulanır.',
        ],
      },
      {
        heading: 'G. Özel hükümlerle köprü',
        paragraphs: [
          'Genel iskelet kurulduktan sonra ceza özel notunda somut tipe inilir. “Kasten öldürme teşebbüsü” = genel teşebbüs + özel tip unsurları.',
        ],
      },
    ],
    examples: [
      {
        title: 'Teşebbüs',
        facts:
          'Fail silahı doğrultur, tetik boşa gelir; yakalanır.',
        analysis:
          'İcra başlangıcı. Elverişlilik. Tamamlanmama. Gönüllü vazgeçme yok.',
        takeaway: 'İcra + tamamlanmama = teşebbüs.',
      },
      {
        title: 'İştirak rolleri',
        facts:
          'A planlar, B silah verir, C fiili işler.',
        analysis:
          'Azmettirme / yardım / faillik. Her biri ayrı ceza iskeleti.',
        takeaway: 'Rol rol yaz.',
      },
      {
        title: 'Zincirleme suç',
        facts:
          'Aynı mağdura kısa aralıklarla aynı suç birden fazla kez işlenir.',
        analysis:
          'Zincirleme şartları. Gerçek içtima farkı. Ceza artışı.',
        takeaway: 'Aynı suç + birden fazla = zincirleme kutusu.',
      },
      {
        title: 'Gönüllü vazgeçme',
        facts:
          'Fail icraya başlar, pişman olup kendisi engeller; netice oluşmaz.',
        analysis:
          'Kendi iradesi. Tamamlamama / önleme. Etkin pişmanlıkla karıştırma.',
        takeaway: 'İrade ile vazgeçme ayrı rejim.',
      },
    ],
    mindmap: {
      center: 'Ceza Genel · 2. dönem',
      branches: [
        { label: 'Genişleme', items: ['Teşebbüs', 'İştirak', 'İçtima'] },
        { label: 'Yaptırım', items: ['Hapis', 'Para', 'Tedbir'] },
        { label: 'Süre', items: ['Dava ZA', 'Ceza ZA'] },
        { label: 'Özel bağ', items: ['Tipe in'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Suç teorisinden teşebbüs, iştirak ve yaptırıma kadar tek omurga.',
    promise:
      '1. + 2. dönem birleşik; ceza genel hükümler için “tek cilt” not. Somut suç tipleri için ceza özel triple’ına bakın.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: kuruluş kutuları mı, genişleme/yaptırım mı?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: tipiklik–hukuka aykırılık–kusur → deneme → teşebbüs–iştirak–yaptırım → karma.',
          'Her soruda etiket: “Kuruluş mu, genişleme mi, ceza hesabı mı?”',
        ],
        hapBilgi: 'Yıllık başarı = kutu kutu yazmak.',
        bullets: [
          'Hafta 1–4: ilkeler + tipiklik + hukuka aykırılık',
          'Hafta 5–7: kast/taksir + hata',
          'Hafta 8–11: teşebbüs + iştirak + içtima',
          'Hafta 12–14: yaptırım + zamanaşımı + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Olası kast. Tip 2 — Meşru savunma. Tip 3 — Teşebbüs. Tip 4 — İştirak. Tip 5 — Zincirleme. Tip 6 — Yaptırım hesabı.',
          'Karma olayda kast + teşebbüs + yardım üst üste binebilir. Sıra: tipiklik → hukuka aykırılık → kusur → genişleme → ceza.',
        ],
        uyari: 'Somut suç tanımı için ceza özel notunu açın.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Ceza Genel · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Tipiklik', 'Hukuka aykırılık', 'Kusur'] },
        { label: '2. yarı', items: ['Teşebbüs', 'İştirak', 'Yaptırım'] },
        { label: 'İlke', items: ['Kanunilik'] },
        { label: 'Yöntem', items: ['Kutu kutu'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'ceza-genel-donem-1': d1Content,
  'ceza-genel-donem-2': d2Content,
  'ceza-genel-yillik': yillikContent,
};

export const CEZA_GENEL_VARIANTS = [
  'ceza-genel-donem-1',
  'ceza-genel-donem-2',
  'ceza-genel-yillik',
];

export function buildCezaGenelVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Ceza Genel ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Ceza Hukuku Genel Hükümler ${meta.h1Extra}`;
  const description = `${uni.name} için Ceza Genel ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Ceza Hukuku Genel Hükümler ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: suç kutularını ve yaptırım iskeletini doğru yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Somut suç tipleri için Ceza Özel triple notlarını kullanın.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek olay → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda: tipiklik → hukuka aykırılık → kusur',
        'Olası kast / bilinçli taksir ayır',
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
      paragraphs: ['Soru tipine göre dayanaklar. Güncel metin: TCK Genel.'],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma madde no yazmayın; TCK metninden doğrulayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Ceza Genel)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık şart. 60 dk / 3 soruda soru başı ~18 dk.`,
        'İskelet: (1) tipiklik (2) hukuka aykırılık (3) kusur (4) genişleme (5) yaptırım.',
      ],
      bullets: [
        'Kutuları karıştırma',
        'Kast formunu adlandır',
        'İştirakte rol yaz',
        'Ceza hesabını adımla',
      ],
      hapBilgi: 'Kutu kutu yaz = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Ceza Genel ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Tipiklik',
        'Hukuka aykırılık',
        'Kusur (kast/taksir)',
        'Teşebbüs / iştirak / içtima',
        'Yaptırım',
        'Sonuç',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'ceza-genel-donem-2'
          ? [
              ['Teşebbüs', 'Hazırlık', 'İcraya başlandı mı?'],
              ['Azmettirme', 'Yardım', 'Suça sevk mi kolaylaştırma mı?'],
              ['Zincirleme', 'Gerçek içtima', 'Aynı suç mu farklı suçlar mı?'],
              ['Gönüllü vazgeçme', 'Etkin pişmanlık', 'Genel mi özel hüküm mü?'],
            ]
          : variantCode === 'ceza-genel-donem-1'
            ? [
                ['Olası kast', 'Bilinçli taksir', 'Netice göze mi alındı istenmedi mi?'],
                ['Meşru savunma', 'Zorunluluk', 'Saldırı mı tehlike mi?'],
                ['Tipiklik', 'Hukuka aykırılık', 'Tanıma uyma mı yasaklık mı?'],
                ['Kast', 'Taksir', 'İsteme var mı?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Kuruluş mu genişleme mi?'],
                ['Olası kast', 'Bilinçli taksir', 'Göze alma mı istememe mi?'],
                ['Teşebbüs', 'İştirak', 'Tamamlanmama mı çok kişi mi?'],
                ['Ceza', 'Güvenlik tedbiri', 'Cezalandırma mı tehlike önleme mi?'],
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
      leftTitle: 'Suç kuruluşu',
      rightTitle: 'Genişleme / yaptırım',
      left: 'Tipiklik + hukuka aykırılık + kusur',
      right: 'Teşebbüs + iştirak + içtima + ceza',
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
      a: '1. dönem suç kuruluşu (tipiklik–hukuka aykırılık–kusur); 2. dönem teşebbüs–iştirak–içtima–yaptırım; yıllık ikisini birleştirir.',
    },
    {
      q: 'Ceza özel ile birlikte mi?',
      a: 'Evet. Genel iskeletten sonra ceza özel triple notunda somut tipe inin.',
    },
    {
      q: 'PDF nasıl indirilir?',
      a: '“PDF indir / Yazdır” veya …/pdf → Ctrl+P → PDF olarak kaydet.',
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
    'Pusula maddeleri TCK’dan doğruladım',
    'PDF’i arşivledim',
    variantCode === 'ceza-genel-yillik'
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
      `${uni.shortName} ceza genel ${meta.short}`,
      `${uni.shortName} ceza hukuku ders notu`,
      `ceza genel ${meta.short} not pdf`,
      'tipiklik kast taksir teşebbüs iştirak ders notu',
      'ceza genel yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} ceza hukuku`),
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
        'Kutuları ayrı yaz',
        'Kast formunu adlandır',
        'İştirakte rol yaz',
        'Ceza hesabını adımla',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Ceza Genel ${meta.short} kapsamındaki kurumları ayırır`,
      'Suç kuruluş kutularını uygular',
      'Teşebbüs ve iştirak rejimini kurar',
      'Yaptırım iskeletini yazar',
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
    relatedCourses: CEZA_GENEL_VARIANTS.filter((c) => c !== variantCode).concat([
      'ceza-genel',
      'ceza-ozel-yillik',
      'ceza-muhakemesi',
    ]),
    relatedBilgi: [],
    updated: '2026-07-29',
    wordTarget: variantCode === 'ceza-genel-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'ceza-genel',
    variantLabel: meta.label,
  };
}
