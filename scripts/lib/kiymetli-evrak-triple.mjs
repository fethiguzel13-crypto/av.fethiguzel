/**
 * Kıymetli Evrak Hukuku (TTK kambiyo senetleri) —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * kiymetli-evrak dersiyle hizalı.
 */

function baseMeta(variant) {
  const labels = {
    'kiymetli-evrak-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'TTK Kıymetli Evrak · 1. yarı (kavram, poliçe, bono, zorunlu unsurlar, ciro, aval, hamil koruması girişi)',
    },
    'kiymetli-evrak-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'TTK Kıymetli Evrak · 2. yarı (çek, ibraz–protesto, başvuru hakkı, zamanaşımı, sahtecilik, kambiyo icrası girişi)',
    },
    'kiymetli-evrak-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope: 'Kıymetli evrak / kambiyo senetleri tam omurga · poliçe–bono–çek · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Poliçe ve bono. Zorunlu unsur + ciro + aval. Senet ne ise o kadar güçlüdür.',
    promise:
      'Kıymetli evrak kavramı, poliçe ve bono, zorunlu unsurlar, ciro türleri, aval, iyiniyetli hamil. Güz finalinde unsur listesi bozulmadan yazarsınız.',
    sixtySecond: [
      'Kıymetli evrak: hakkın senette cisimleşmesi; devir senede bağlı.',
      'Poliçe: üçlü ilişki (keşideci–muhatap–lehtar).',
      'Bono (emre muharrer senet): keşideci = borçlu iskeleti.',
      'Zorunlu unsur eksikse kambiyo niteliği düşer (istisnalar dikkatli).',
      'Ciro: devir + başvuru zinciri; beyaz / tam / teminat cirosu.',
      'Aval: kambiyo kefaleti; kim için verildiği yazılır.',
    ],
    pillars: [
      'Kıymetli evrak kavramı ve ilkeleri',
      'Poliçe',
      'Bono (senet)',
      'Zorunlu şekil unsurları',
      'Ciro ve devir',
      'Aval',
      'Kabul (poliçede)',
      'Hamil ve iyiniyet koruması girişi',
    ],
    definitions: [
      {
        baslik: 'Kıymetli evrak',
        govde:
          'Bir hakkın senette cisimleştiği ve hakkın senedin devriyle devredildiği evraktır. Kambiyo senetleri (poliçe, bono, çek) tipik örneklerdir.',
      },
      {
        baslik: 'Poliçe',
        govde:
          'Keşidecinin, muhataba, lehtara veya emrine belli bir bedeli ödemesi için verdiği kambiyo senedidir. Üçlü ilişki esastır.',
      },
      {
        baslik: 'Bono',
        govde:
          'Keşidecinin, lehtara veya emrine belli bir bedeli bizzat ödemeyi taahhüt ettiği emre muharrer senettir. Uygulamada “senet” denir.',
      },
      {
        baslik: 'Ciro',
        govde:
          'Kambiyo senedinin devri ve başvuru zincirinin kurulması işlemidir. Tam, beyaz, tahsil ve teminat cirosu ayrılır.',
      },
      {
        baslik: 'Aval',
        govde:
          'Kambiyo senedinde bir imzanın teminat altına alınmasıdır. Avalist, kimin için aval verdiyse o kişi gibi sorumlu olur (çerçeve).',
      },
    ],
    traps: [
      'Zorunlu unsuru “isteğe bağlı ibare” sanmak.',
      'Bono ile poliçeyi rol dağılımında karıştırmak.',
      'Ciroyu “sadece imza” sanmak — yer ve tür önemli.',
      'Aval’i TBK kefaletiyle aynı yazmak — kambiyo rejimi farklı.',
      'Eksik unsurda hâlâ “tam kambiyo” iddia etmek.',
    ],
    keyMadde: [
      'TTK m.645 vd. — kıymetli evrak genel (çerçeve)',
      'TTK m.671 vd. — poliçe (çerçeve)',
      'TTK m.776 vd. — bono (çerçeve)',
      'TTK m.681 vd. — ciro (çerçeve)',
      'TTK m.700 vd. — aval (çerçeve)',
      'TTK m.695 vd. — kabul (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Kıymetli evrak nedir?',
        paragraphs: [
          'Hak senette somutlaşır; senetsiz hak iddiası kambiyo yolunda zayıftır. Devir, ispat ve takip senedin şekline bağlıdır.',
          '1. dönem poliçe–bono omurgasını taşır. Çek, ibraz–protesto ve başvuru hakkı 2. döneme kalır; ciro/aval ortak köprüdür.',
        ],
        hapBilgi: 'Senet = hak + şekil. Eksik şekil = zayıf kambiyo.',
      },
      {
        heading: 'B. Poliçe',
        paragraphs: [
          'Keşideci muhataba “öde” der; lehtar alacaklıdır. Kabul ile muhatap kambiyo borçlusu olur. Vade, bedel, keşide yeri/tarihi zorunlu unsurlardandır (güncel liste).',
          'Poliçede üçlü yapı bono ile karıştırılmaz: bonoda keşideci doğrudan borçludur.',
        ],
        kartlar: [
          { baslik: 'Keşideci', govde: 'Düzenleyen.' },
          { baslik: 'Muhatap', govde: 'Ödemesi istenen.' },
          { baslik: 'Lehtar', govde: 'Alacaklı.' },
          { baslik: 'Kabul', govde: 'Muhatabın bağlanması.' },
        ],
      },
      {
        heading: 'C. Bono (senet)',
        paragraphs: [
          'Keşideci “ödeyeceğim” taahhüdü verir. Zorunlu unsurlar (bedel, vade/ibraz, lehtar, keşide tarihi/yeri, imza vb.) güncel TTK’dan doğrulanır.',
          'Uygulamada en sık sınav ve icra konusu budur. “Senet yazdım” yetmez; unsur listesi yazılır.',
        ],
        uyari: 'Eksik unsur = kambiyo niteliği tartışması. Listeyi ezberden yazın.',
      },
      {
        heading: 'D. Zorunlu unsurlar',
        paragraphs: [
          'Her senet tipi için kanuni asgari içerik vardır. Eksiklikte senedin kambiyo senedi sayılıp sayılmayacağı ve adi senet/borç ikrarı tartışması açılır.',
          'Sınavda önce “hangi senet?”, sonra “hangi unsur eksik?”, en sonda “sonuç ne?” yazın.',
        ],
        bullets: [
          'Senet tipi',
          'Unsur listesi',
          'Eksikliğin sonucu',
          'İstisna / tamamlayıcı yorum (dikkatli)',
        ],
      },
      {
        heading: 'E. Ciro',
        paragraphs: [
          'Ciro senedi devreder ve ciro zinciri başvuru sorumluluğunu kurar. Beyaz ciro, tam ciro, tahsil cirosu, teminat cirosu ayrılır.',
          'Ciro yeri (senedin arkası / alonj) ve silsile bozulması iyiniyetli hamili etkiler.',
        ],
        hapBilgi: 'Ciro = devir + başvuru halkası.',
      },
      {
        heading: 'F. Aval',
        paragraphs: [
          'Aval, kambiyo imzasını güçlendirir. “Kimin için?” sorusu zorunludur; belirtilmezse karine vardır (çerçeve). Avalist başvuru ve ödemede kambiyo sorumlusu gibi davranır.',
          'TBK kefaletiyle karıştırılmaz: şekil, takip ve def’i rejimi kambiyoya özgüdür.',
        ],
      },
      {
        heading: 'G. Hamil ve iyiniyet',
        paragraphs: [
          'Usulüne göre hamil olan kişi senede dayanır. İyiniyetli hamil, önceki ilişkideki bazı def’ilerden korunabilir (çerçeve). Sahte ciro ve eksik zincir 2. dönemde derinleşir.',
        ],
      },
    ],
    examples: [
      {
        title: 'Eksik unsur',
        facts:
          'Bonoda keşide tarihi yoktur; alacaklı kambiyo takibi açmak ister.',
        analysis:
          'Zorunlu unsur listesi. Eksikliğin sonucu. Adi senet / borç ikrarı ihtimali.',
        takeaway: 'Önce unsur, sonra takip yolu.',
      },
      {
        title: 'Poliçe vs bono',
        facts:
          'Öğrenci “üç imza var, bu bono” der; muhatap ve kabul de vardır.',
        analysis:
          'Rol dağılımı. Poliçe üçlüsü. Bono keşideci borçluluğu.',
        takeaway: 'Rol yazmadan tür yazılmaz.',
      },
      {
        title: 'Ciro zinciri',
        facts:
          'Senedin arkasında kopuk ciro silsilesi vardır; son hamil icra ister.',
        analysis:
          'Hamil sıfatı. Zincir. İyiniyet. Def’iler.',
        takeaway: 'Zincir + hamil sıfatı.',
      },
      {
        title: 'Aval',
        facts:
          'Üçüncü kişi senede “aval” yazar; kimin için olduğu belirsizdir.',
        analysis:
          'Aval karinesi. Sorumluluğun kapsamı. Kefaletle fark.',
        takeaway: 'Aval ≠ sıradan kefalet.',
      },
    ],
    mindmap: {
      center: 'Kıymetli Evrak · 1. dönem',
      branches: [
        { label: 'Tür', items: ['Poliçe', 'Bono'] },
        { label: 'Şekil', items: ['Unsur', 'İmza'] },
        { label: 'Devir', items: ['Ciro', 'Zincir'] },
        { label: 'Teminat', items: ['Aval', 'Kabul'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Çek, ibraz–protesto, başvuru, zamanaşımı, sahtecilik. Senedi paraya çevirme ve savunma.',
    promise:
      'Çek hukuku, ibraz ve protesto, başvuru hakkı, zamanaşımı, sahte/değiştirilmiş senet, kambiyo senetlerine özgü icra girişi. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Çek: banka muhatap; ibraz süreleri kritik.',
      'Karşılıksız çek: özel yaptırım çerçevesi (güncel metin).',
      'İbraz + protesto: başvuru hakkının kapısı.',
      'Başvuru: önceki imza sahiplerine rücu.',
      'Zamanaşımı: kambiyo alacağı süreleri ayrı.',
      'Sahtecilik / eksik unsur: def’i ve ispat.',
    ],
    pillars: [
      'Çek: unsurlar ve ibraz',
      'Karşılıksız çek çerçevesi',
      'İbraz ve protesto',
      'Başvuru (rücu) hakkı',
      'Zamanaşımı',
      'Sahtecilik, tahrifat, yetkisiz imza',
      'Def’iler (kişisel / nesnel)',
      'Kambiyo senetlerine özgü icra girişi',
    ],
    definitions: [
      {
        baslik: 'Çek',
        govde:
          'Keşidecinin bir bankaya, lehtara veya emrine belli bir bedeli ödemesi için verdiği kambiyo senedidir. Muhatap bankadır; kabul poliçedeki gibi işlemez.',
      },
      {
        baslik: 'Protesto',
        govde:
          'Ödememe veya kabul etmemenin resmî belgelenmesidir. Başvuru hakkının kullanılabilmesi için kural olarak şarttır (istisnalar yazılır).',
      },
      {
        baslik: 'Başvuru hakkı',
        govde:
          'Hamilin, senedi ödemeyen asıl borçlu dışında önceki ciro ve keşideci gibi imza sahiplerine rücu edebilmesidir.',
      },
      {
        baslik: 'Kambiyo def’ileri',
        govde:
          'Senede karşı ileri sürülebilen savunmalardır. Nesnel def’iler herkese; kişisel def’iler kural olarak yalnız ilgili tarafa karşı ileri sürülür (çerçeve).',
      },
      {
        baslik: 'Kambiyo takibi',
        govde:
          'İİK’da poliçe, bono ve çek için öngörülen özel icra yoludur. Ödeme emri ve itiraz rejimi genel ilamsızdan farklılaşır.',
      },
    ],
    traps: [
      'Çek ibraz süresini bono vadesiyle karıştırmak.',
      'Protestosuz her zaman başvuru sanmak — kural + istisna.',
      'Sahteciliği “her imza geçerli” sanmak.',
      'Kişisel def’iyi iyiniyetli hamile karşı serbest yazmak.',
      'Kambiyo icrasını genel ilamsızla aynı süre sanmak.',
    ],
    keyMadde: [
      'TTK m.780 vd. — çek (çerçeve)',
      'TTK m.708 vd. — ibraz / ödememe (çerçeve)',
      'TTK m.714 vd. — protesto (çerçeve)',
      'TTK m.721 vd. — başvuru (çerçeve)',
      'TTK m.749 vd. — zamanaşımı (çerçeve)',
      'İİK m.167 vd. — kambiyo senetlerine özgü takip (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Çek',
        paragraphs: [
          'Çekin zorunlu unsurları, keşide ve ibraz süreleri, bankanın rolü bilinir. Vadeli çek tartışması ve ibraz rejimi sınav klasikidir.',
          'Karşılıksız çekin özel hukuk ve yaptırım boyutu güncel mevzuattan doğrulanır; uydurma ceza yazılmaz.',
        ],
        hapBilgi: 'Çek = banka muhatap + ibraz süresi.',
        bullets: [
          'Unsurlar',
          'İbraz süreleri',
          'Karşılıksız çek çerçevesi',
          'Hamil hakları',
        ],
      },
      {
        heading: 'B. İbraz ve protesto',
        paragraphs: [
          'Ödeme için ibraz, vade ve süre kurallarına bağlıdır. Ödememe/protesto başvuru hakkını açar. Protestosuz başvuru imkânı istisnai hâllerde tartışılır.',
          'Süre kaçırılırsa başvuru hakkı düşebilir; asıl borçluya başvuru ayrı rejimde kalabilir (çerçeve).',
        ],
        uyari: 'İbraz–protesto takvimi = başvuru anahtarı.',
      },
      {
        heading: 'C. Başvuru (rücu)',
        paragraphs: [
          'Hamil, zincirdeki imza sahiplerine rücu edebilir. Bildirim süreleri ve müteselsil sorumluluk yazılır. Avalist de bu tabloda yer alır.',
          'Kim kime rücu eder sorusu rol şemasıyla çözülür.',
        ],
        kartlar: [
          { baslik: 'Hamil', govde: 'Başvuruyu açan.' },
          { baslik: 'Ciro zinciri', govde: 'Rücu halkaları.' },
          { baslik: 'Keşideci', govde: 'Son halkalardan.' },
          { baslik: 'Avalist', govde: 'Teminat imzası.' },
        ],
      },
      {
        heading: 'D. Zamanaşımı',
        paragraphs: [
          'Kambiyo alacaklarında zamanaşımı süreleri genel TBK sürelerinden ayrı düzenlenir. Hangi alacak (asıl / başvuru) için hangi süre — güncel maddeden doğrulanır.',
          'Süre başlangıcı (vade, protesto tarihi vb.) olayda işaretlenir.',
        ],
      },
      {
        heading: 'E. Sahtecilik, tahrifat, yetkisiz imza',
        paragraphs: [
          'Sahte imza bağlanmaz; tahrifat bedeli/vadeyi değiştirirse kim etkilenir sorusu çıkar. Yetkisiz temsil ve ekleme def’i/iyiniyet dengesinde yazılır.',
          'İspat yükü ve bilirkişi pratikte devreye girer; sınavda hukuki sonuç iskeleti yeterlidir.',
        ],
      },
      {
        heading: 'F. Def’iler',
        paragraphs: [
          'Nesnel def’iler (şekil eksikliği, zamanaşımı vb.) genelde herkese karşı; kişisel def’iler (sebepsiz zenginleşme, ilişki def’i) kural olarak ilgili tarafa karşı ileri sürülür.',
          'İyiniyetli hamil koruması kişisel def’iyi sınırlar. Sınavda “def’i türü + kime karşı?” yazın.',
        ],
        hapBilgi: 'Def’i türü = kime ileri sürülebilir?',
      },
      {
        heading: 'G. Kambiyo icrası girişi',
        paragraphs: [
          'İİK’da kambiyo senetlerine özgü takip, ödeme emri ve itirazın kaldırılması rejimi icra dersiyle kesişir. Bu notta senet geçerliliği + takip kapısı yazılır; haciz detayı icra triple’ındadır.',
          'Takibe konu senette unsur ve ciro zinciri ilk bakışta kontrol edilir.',
        ],
      },
    ],
    examples: [
      {
        title: 'Çek ibrazı',
        facts:
          'Lehtar çeki geç ibraz eder; banka ödemez. Keşideciye başvurmak ister.',
        analysis:
          'İbraz süresi. Hak düşümü. Başvuru şartları. Güncel çek rejimi.',
        takeaway: 'Çekte takvim tut.',
      },
      {
        title: 'Protestosuz başvuru',
        facts:
          'Hamil protesto yaptırmadan önceki cirantaya gider.',
        analysis:
          'Protesto kuralı. İstisna var mı? Süre. Sonuç.',
        takeaway: 'Protesto kural; istisna yaz.',
      },
      {
        title: 'Sahte ciro',
        facts:
          'Zincirde bir ciro sahtedir; son hamil iyiniyet iddiasındadır.',
        analysis:
          'Sahte imza. Zincir kırılması. İyiniyet sınırları. Kim sorumlu?',
        takeaway: 'Sahte halka = zincir tartışması.',
      },
      {
        title: 'Kambiyo takibi',
        facts:
          'Alacaklı bono ile kambiyo takibi açar; borçlu “asıl ilişki ifa edildi” der.',
        analysis:
          'Kambiyo yolu. İtiraz/def’i. Kişisel def’inin hamile karşı sınırı. İcra kesişimi.',
        takeaway: 'Senet güçlü; def’i türünü seç.',
      },
    ],
    mindmap: {
      center: 'Kıymetli Evrak · 2. dönem',
      branches: [
        { label: 'Çek', items: ['İbraz', 'Karşılık'] },
        { label: 'Başvuru', items: ['Protesto', 'Rücu'] },
        { label: 'Savunma', items: ['Def’i', 'Sahte'] },
        { label: 'Takip', items: ['Kambiyo icra', 'Süre'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Poliçe–bonodan çek, başvuru ve kambiyo takibine kadar tek omurga.',
    promise:
      '1. + 2. dönem birleşik; kıymetli evrak / kambiyo senetleri için “tek cilt” not.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: unsur/ciro mu, çek/başvuru/def’i mi?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: unsur–poliçe–bono–ciro → deneme → çek–protesto–başvuru–def’i → karma.',
          'Her soruda etiket: “Hangi senet? Unsur tam mı? Hamil kim? Def’i mi başvuru mu?”',
        ],
        hapBilgi: 'Yıllık başarı = doğru senet + doğru unsur + doğru yol.',
        bullets: [
          'Hafta 1–3: kavram + poliçe + bono unsurları',
          'Hafta 4–7: ciro + aval + hamil',
          'Hafta 8–11: çek + ibraz + protesto + başvuru',
          'Hafta 12–14: def’i + zamanaşımı + kambiyo icra + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Eksik unsur. Tip 2 — Ciro zinciri. Tip 3 — Aval. Tip 4 — Çek ibrazı. Tip 5 — Protesto/başvuru. Tip 6 — Kişisel def’i.',
          'Karma olayda bono + sahte ciro + kambiyo takibi üst üste binebilir. Sıra: senet geçerli mi → hamil → def’i/başvuru → takip.',
        ],
        uyari: 'Tek cevapta tüm kambiyo hukukunu özetlemeyin; senet tipini seçin.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Kıymetli Evrak · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Poliçe', 'Bono', 'Ciro'] },
        { label: '2. yarı', items: ['Çek', 'Başvuru', 'Def’i'] },
        { label: 'Şekil', items: ['Unsur', 'İmza'] },
        { label: 'Yöntem', items: ['Tür seç', 'Takvim tut'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'kiymetli-evrak-donem-1': d1Content,
  'kiymetli-evrak-donem-2': d2Content,
  'kiymetli-evrak-yillik': yillikContent,
};

export const KIYMETLI_EVRAK_VARIANTS = [
  'kiymetli-evrak-donem-1',
  'kiymetli-evrak-donem-2',
  'kiymetli-evrak-yillik',
];

export function buildKiymetliEvrakVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Kıymetli Evrak ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Kıymetli Evrak Hukuku ${meta.h1Extra}`;
  const description = `${uni.name} için Kıymetli Evrak ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Kıymetli Evrak Hukuku (kambiyo senetleri) ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: senet tipini, zorunlu unsuru ve başvuru/def’i yolunu doğru yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Dönemlik program kendi yarısını; yıllık veya bütüncül tekrar yıllık paketi kullanır.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek olay → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda: poliçe mi bono mu çek mi?',
        'Unsur listesini ilk yaz',
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
      paragraphs: ['Soru tipine göre dayanaklar. Güncel metin: TTK kıymetli evrak + İİK kambiyo.'],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma madde no yazmayın; TTK/İİK metninden doğrulayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Kıymetli Evrak)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık şart. 60 dk / 3 soruda soru başı ~18 dk.`,
        'İskelet: (1) senet tipi (2) unsur (3) ciro/aval (4) ibraz/başvuru veya def’i (5) sonuç.',
      ],
      bullets: [
        'Senet tipini ilk cümlede yaz',
        'Unsur listesini numarala',
        'Ciro zincirini çiz',
        'Def’i türünü (kişisel/nesnel) seç',
      ],
      hapBilgi: 'Doğru senet + doğru unsur = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Kıymetli Evrak ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Senet tipini seç',
        'Zorunlu unsurları kontrol et',
        'Ciro / aval / hamil',
        'İbraz–protesto veya def’i',
        'Başvuru / takip sonucu',
        'Süre kapat',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'kiymetli-evrak-donem-2'
          ? [
              ['Çek', 'Bono', 'Muhatap banka mı keşideci borçlu mu?'],
              ['Protesto', 'İbraz', 'Belgeleme mi sunma mı?'],
              ['Nesnel def’i', 'Kişisel def’i', 'Herkese karşı mı sadece tarafa mı?'],
              ['Başvuru', 'Asıl borçluya talep', 'Rücu mu doğrudan borç mu?'],
            ]
          : variantCode === 'kiymetli-evrak-donem-1'
            ? [
                ['Poliçe', 'Bono', 'Üçlü ilişki mi keşideci borçlu mu?'],
                ['Ciro', 'Temlik', 'Kambiyo devri mi alacak temliki mi?'],
                ['Aval', 'Kefalet', 'Kambiyo imzası mı TBK kefaleti mi?'],
                ['Zorunlu unsur', 'İhtiyari ibare', 'Eksikse kambiyo düşer mi?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Unsur/ciro mu çek/başvuru mu?'],
                ['Poliçe', 'Bono', 'Rol dağılımı?'],
                ['Çek', 'Bono', 'Banka muhatap mı?'],
                ['Def’i', 'Başvuru', 'Savunma mı rücu mu?'],
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
      leftTitle: 'Şekil / devir',
      rightTitle: 'Başvuru / savunma',
      left: 'Tür + unsur + ciro + aval',
      right: 'Çek + protesto + def’i + kambiyo icra',
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
      a: '1. dönem kavram–poliçe–bono–ciro–aval; 2. dönem çek–ibraz–protesto–başvuru–def’i–kambiyo icra girişi; yıllık ikisini birleştirir.',
    },
    {
      q: 'İcra notuyla birlikte mi?',
      a: 'Evet. Kambiyo senetlerine özgü takip için icra triple notuyla çapraz okuyun.',
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
    'Pusula maddeleri TTK’dan doğruladım',
    'PDF’i arşivledim',
    variantCode === 'kiymetli-evrak-yillik'
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
      `${uni.shortName} kıymetli evrak ${meta.short}`,
      `${uni.shortName} kambiyo senetleri ders notu`,
      `kıymetli evrak ${meta.short} not pdf`,
      'çek bono poliçe ciro aval ders notu',
      'kıymetli evrak yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} kıymetli evrak`),
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
        'Senet tipini ilk yaz',
        'Unsur listesini numarala',
        'Ciro zincirini çiz',
        'Def’i / başvuru kapısını seç',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Kıymetli Evrak ${meta.short} kapsamındaki senetleri ayırır`,
      'Zorunlu unsur ve ciro rejimini uygular',
      'Çek, başvuru ve def’i yolunu seçer',
      'Kambiyo takibi kapısını tanır',
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
    relatedCourses: KIYMETLI_EVRAK_VARIANTS.filter((c) => c !== variantCode).concat([
      'kiymetli-evrak',
      'icra-donem-1',
      'ticari-isletme',
    ]),
    relatedBilgi: [],
    updated: '2026-07-29',
    wordTarget: variantCode === 'kiymetli-evrak-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'kiymetli-evrak',
    variantLabel: meta.label,
  };
}
