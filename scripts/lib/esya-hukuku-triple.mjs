/**
 * Eşya Hukuku — 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * TMK Eşya; pedagojik yarıyıl bölünmesi.
 */

function baseMeta(variant) {
  const labels = {
    'esya-hukuku-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'TMK Eşya · 1. yarı (zilyetlik, tapu sicili, mülkiyet, paylı/el birliği, kazanmaya giriş)',
    },
    'esya-hukuku-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'TMK Eşya · 2. yarı (sınırlı ayni haklar, irtifak, rehin, taşınmaz yükü, koruma davaları, kat mülkiyeti girişi)',
    },
    'esya-hukuku-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope: 'TMK eşya hukuku tam omurga · dönemlik + yıllık programlar için tek cilt',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Zilyetlik–sicil–mülkiyet. Kim, hangi eşya üzerinde, hangi yetkiyle?',
    promise:
      'Zilyetlik koruması, sicile güven, mülkiyet (paylı/el birliği), kazanmaya giriş. Güz finalinde dağılmadan yazarsınız.',
    sixtySecond: [
      'Zilyetlik ≠ mülkiyet: fiilî hâkimiyet vs tam yetki.',
      'Tapu siciline güven: iyiniyetli üçüncü kişi korunabilir.',
      'Mülkiyet: kullanma, yararlanma, tasarruf (sınırlarla).',
      'Paylı mülkiyet: pay üzerinde tasarruf esnek; el birliği: birlikte tasarruf.',
      'Kazanma: asli / fer’i; tescil kurucu olabilir.',
      'Cevap: tanım → unsur → olgu → sonuç → istisna (iyiniyet/süre).',
    ],
    pillars: [
      'Eşya kavramı ve ayni hak',
      'Zilyetlik: kazanma, kaybetme, koruma',
      'Tapu sicili ve sicile güven',
      'Mülkiyetin içeriği ve sınırları',
      'Paylı mülkiyet',
      'El birliği mülkiyet',
      'Taşınır–taşınmaz ayrımı',
      'Mülkiyetin kazanılmasına giriş',
    ],
    definitions: [
      {
        baslik: 'Ayni hak',
        govde:
          'Eşya üzerinde doğrudan hâkimiyet sağlayan ve herkese karşı ileri sürülebilen haktır. Mülkiyet ve sınırlı ayni haklar bu gruptadır.',
      },
      {
        baslik: 'Zilyetlik',
        govde:
          'Eşya üzerinde fiilî hâkimiyettir. Mülkiyetten farklıdır; ispat ve koruma işlevi vardır.',
      },
      {
        baslik: 'Sicile güven',
        govde:
          'Tapu sicilindeki kayda iyiniyetle güvenen üçüncü kişinin korunması ilkesidir. İstisnalar unutulmamalıdır.',
      },
      {
        baslik: 'Paylı mülkiyet',
        govde:
          'Birden fazla kişinin, payları belirlenmiş şekilde aynı eşyaya malik olmasıdır. Kural olarak payda tasarruf serbesttir.',
      },
      {
        baslik: 'El birliği mülkiyet',
        govde:
          'Paylar ayrılmadan ortakların birlikte malik olmasıdır. Kural: birlikte tasarruf (miras ortaklığı tipik örnektir).',
      },
    ],
    traps: [
      'Zilyetliği mülkiyet sanmak.',
      'Fiilî kullanımı otomatik kazandırıcı zamanaşımı sanmak.',
      'Paylı ile el birliğini karıştırmak.',
      'Sicile güveni “her tescil kutsaldır” diye abartmak — iyiniyet şart.',
      'El birliğinde tek paydaşın tek başına satışını geçerli sanmak.',
    ],
    keyMadde: [
      'TMK m.683 vd. — mülkiyet',
      'TMK m.688 vd. — paylı mülkiyet',
      'TMK m.701 vd. — el birliği mülkiyet',
      'TMK m.973 vd. — zilyetlik',
      'TMK m.1007 / sicil hükümleri — tapu sicili çerçevesi',
      'TMK m.1023 — sicile güven (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Eşya ve ayni hak',
        paragraphs: [
          'Eşya hukuku “kim, hangi eşya üzerinde, hangi yetkiyi, nasıl kazandı?” sorusuna cevap arar. Ayni hak herkese karşı ileri sürülebilir; şahsi haktan bu yönüyle ayrılır.',
          'Taşınır–taşınmaz ayrımı kazanma, rehin ve sicil rejimini değiştirir. Sınavda ilk cümlede eşyanın niteliğini yazın.',
        ],
        hapBilgi: 'Ayni hak = eşya + herkese karşı ileri sürülebilirlik.',
      },
      {
        heading: 'B. Zilyetlik',
        paragraphs: [
          'Zilyetlik fiilî hâkimiyettir. Asli / fer’i, malik / malik olmayan zilyetlik ayrımları ispat ve davaları etkiler.',
          'Zilyetliğin korunması (gasp, saldırı) ile istihkak / el atmanın önlenmesi karıştırılmamalıdır. Süre ve ispat farklıdır.',
        ],
        kartlar: [
          { baslik: 'Kazanma', govde: 'Teslim, haksız zilyetliğin devri vb.' },
          { baslik: 'Koruma', govde: 'Gasp ve saldırıya karşı davalar.' },
          { baslik: 'İspat', govde: 'Zilyetlik karinesi; ispat yükü kayar.' },
        ],
        uyari: 'Zilyetlik davası ≠ mülkiyet davası. Hangisini istediğinizi yazın.',
      },
      {
        heading: 'C. Tapu sicili ve sicile güven',
        paragraphs: [
          'Taşınmazda tescil çoğu ayni hakkın görünürlük ve bazen kurucu unsurudur. Sicil aleniyeti üçüncü kişilerin bilgisini etkiler.',
          'Sicile güven: kayda iyiniyetle dayanan kazanan korunabilir. Ağır ihmal / bilmesi gereken durum iyiniyeti kırar. “Sicilde yazıyor = her zaman malikim” genellemesi yanlıştır.',
        ],
        hapBilgi: 'Sicil fotoğrafı + iyiniyet = güven ilkesi. İyiniyet yoksa koruma zayıflar.',
        bullets: [
          'Tescil / terkin / şerh / beyan ayrımı (giriş)',
          'İyiniyet testi',
          'Yolsuz tescil ve düzeltme yolları (çerçeve)',
        ],
      },
      {
        heading: 'D. Mülkiyetin içeriği',
        paragraphs: [
          'Malik; hukuk düzeninin sınırları içinde kullanma, yararlanma ve tasarruf yetkilerine sahiptir. Komşuluk, imar, kamu yararı sınırları unutulmamalıdır.',
          'Taşınır ve taşınmazda kazanma yolları farklı işler; fer’i kazanmada devredenin yetkisi kritiktir.',
        ],
      },
      {
        heading: 'E. Paylı mülkiyet',
        paragraphs: [
          'Pay oranları bellidir. Paydaş kendi payı üzerinde kural olarak serbestçe tasarruf edebilir; bütün üzerinde tasarruf ve yönetim kararları kanuni çoğunluk/oy birliği kurallarına bağlıdır.',
          'Ortaklığın giderilmesi (izale-i şüyu) paydaşlar anlaşamazsa devreye girer. Ecrimisil, fiilî kullanım dengesizse gündeme gelebilir.',
        ],
        bullets: [
          'Payda tasarruf',
          'Yönetim ve önemli işler',
          'Giderlere katılma',
          'Ortaklığın giderilmesi',
        ],
      },
      {
        heading: 'F. El birliği mülkiyet',
        paragraphs: [
          'Pay ayrılmamıştır; kural birlikte hareket etmektir. Miras ortaklığı en tipik örnektir. Tek mirasçının “ben ektim, ben satarım” refleksi hukuken sık kilitlenir.',
          'Paylıya geçiş / paylaşım / izale yolları 1. dönem finalinde sık sorulur. Fiilî kullanım, tek başına mülkiyet kazandırmaz.',
        ],
        uyari: 'El birliği + tek taraflı satış = kırmızı alarm. Yetki ve birlikte tasarruf yazın.',
      },
      {
        heading: 'G. Kazanmaya giriş',
        paragraphs: [
          'Asli kazanma (işgal, zamanaşımı vb.) ile fer’i kazanma (devir) ayrılır. Taşınmazda tescil, taşınırda teslim iskeleti temeldir. Detaylı sınırlı ayni haklar 2. döneme kalır; isimleri tanınır.',
        ],
      },
    ],
    examples: [
      {
        title: 'Sicile güven',
        facts:
          'Üçüncü kişi tapuya bakarak satın alır; sonra sicilin yolsuz olduğu, asıl malikin farklı olduğu iddia edilir.',
        analysis:
          'Tescile güven şartları + iyiniyet. Ağır ihmal var mı? Koruma kapsamı. Yolsuz tescilin düzeltilmesi ayrı kutu.',
        takeaway: 'Sicil + iyiniyet birlikte.',
      },
      {
        title: 'El birliği kilitlenmesi',
        facts:
          'Mirasçılardan biri tarlayı eker ve satmak ister; diğerleri karşı çıkar.',
        analysis:
          'El birliği = birlikte tasarruf. Satış yetkisi. İzale / paylaşım. Ecrimisil ihtimali.',
        takeaway: 'Fiilî ekim ≠ tek başına satım yetkisi.',
      },
      {
        title: 'Zilyetlik koruması',
        facts:
          'Zilyet, gasbedilen bisikleti geri ister; gasıp “ben de malikim” der.',
        analysis:
          'Zilyetlik davası ile istihkak ayrımı. Kim ispatlar? Süre.',
        takeaway: 'Hangi dava? Zilyetlik mi mülkiyet mi?',
      },
      {
        title: 'Paylı mülkiyette yönetim',
        facts:
          'Paydaşlardan biri binayı tek başına kiraya verir; diğerleri itiraz eder.',
        analysis:
          'Önemli iş / olağan yönetim ayrımı. Yetki ve sonuç. İyi niyetli kiracı senaryosu dikkatli.',
        takeaway: 'Bütün üzerinde tek başına tasarruf sınırlıdır.',
      },
    ],
    mindmap: {
      center: 'Eşya · 1. dönem',
      branches: [
        { label: 'Zilyetlik', items: ['Kazanma', 'Koruma', 'İspat'] },
        { label: 'Sicil', items: ['Tescil', 'Güven', 'Şerh'] },
        { label: 'Mülkiyet', items: ['İçerik', 'Sınır'] },
        { label: 'Birlikte', items: ['Paylı', 'El birliği'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: İrtifak–rehin–taşınmaz yükü + koruma davaları. Sınırlı ayni haklar ve dava yolları.',
    promise:
      'İrtifak, rehin, taşınmaz yükü, istihkak, el atmanın önlenmesi, kat mülkiyeti girişi. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Sınırlı ayni hak = mülkiyetten bir yetki dilimi.',
      'İrtifak: başkasının taşınmazı üzerinde kullanma/yararlanma.',
      'Rehin: alacağı güvence; taşınır rehin / ipotek ayrımı.',
      'Taşınmaz yükü: malike edim yükü (nadir ama bilin).',
      'Koruma: istihkak, el atmanın önlenmesi, zilyetlik davaları.',
      'Kat mülkiyeti: bağımsız bölüm + arsa payı (giriş).',
    ],
    pillars: [
      'Sınırlı ayni haklar genel',
      'İrtifak hakları',
      'Taşınmaz yükü',
      'Taşınır rehni',
      'İpotek ve taşınmaz rehni',
      'Mülkiyet ve zilyetlik davaları (koruma)',
      'Kat mülkiyeti girişi',
      'Kazanma zamanaşımı ve diğer özel yollar (derinleştirme)',
    ],
    definitions: [
      {
        baslik: 'İrtifak',
        govde:
          'Bir eşya üzerinde, mülkiyete ait kimi yetkilerin başkasına ait olduğu sınırlı ayni haktır (intifa, oturma, geçit vb.).',
      },
      {
        baslik: 'İpotek',
        govde:
          'Taşınmaz üzerinde, alacağı güvence altına alan rehin hakkıdır. Paraya çevirme yolu icra ile işler.',
      },
      {
        baslik: 'İstihkak davası',
        govde:
          'Malikin, zilyet olmayan veya haksız zilyede karşı mülkiyete dayalı iade talebidir.',
      },
      {
        baslik: 'El atmanın önlenmesi',
        govde:
          'Mülkiyete haksız müdahalenin men’i talebidir. İstihkaktan farklı olarak “geri alma” değil “müdahaleyi durdurma” ağırlıklıdır.',
      },
      {
        baslik: 'Kat mülkiyeti',
        govde:
          'Ana taşınmazdaki bağımsız bölümler üzerinde kurulan mülkiyet + arsa payı rejimidir (KMK).',
      },
    ],
    traps: [
      'İrtifak ile kira hakkını aynı sanmak (ayni vs şahsi).',
      'İpoteği “malik değişince biter” sanmak.',
      'İstihkak ile zilyetlik davasını karıştırmak.',
      'Rehin türlerini (teslimli / ipotek) tek potada eritmek.',
      'Kat mülkiyetinde arsa payını yok saymak.',
    ],
    keyMadde: [
      'TMK m.779 vd. — irtifaklar',
      'TMK m.839 vd. — taşınmaz yükü',
      'TMK m.939 vd. — taşınır rehni',
      'TMK m.881 vd. — ipotek',
      'TMK m.683 / koruma davaları çerçevesi',
      'KMK — kat mülkiyeti temel hükümler',
    ],
    sectionsExtra: [
      {
        heading: 'A. Sınırlı ayni haklar genel',
        paragraphs: [
          'Sınırlı ayni hak, mülkiyetin bazı yetkilerini başkasına verir. Herkese karşı ileri sürülebilirlik ayni karakteri korur. Kuruluşta tescil / teslim şartları tipe göre değişir.',
          'Sıra (öncelik) birden fazla sınırlı hak çakışınca önem kazanır. Sicil tarihi ve kanuni sıra yazılır.',
        ],
        hapBilgi: 'Sınırlı ayni hak = mülkiyetten dilim + herkese karşı etki.',
      },
      {
        heading: 'B. İrtifak hakları',
        paragraphs: [
          'İntifa, oturma, geçit, kaynak gibi türler sınavda ayırt edilir. İçerik, süre, devredilebilirlik ve sona erme sebepleri tipe özgüdür.',
          'İrtifak ile kişisel hak (kira) karıştırılmaz: irtifak ayni, kira kural olarak şahsidir (şerh ile güçlenebilir).',
        ],
        bullets: [
          'Kuruluş (sözleşme + tescil vb.)',
          'İçerik ve sınırlar',
          'Sona erme',
          'Koruma',
        ],
      },
      {
        heading: 'C. Rehin: taşınır ve ipotek',
        paragraphs: [
          'Taşınır rehninde teslim kural olarak merkezidir (istisnalar öğretide/kanunda). İpotekte tescil merkezidir; alacak ile bağlılık ilkesi unutulmaz.',
          'Paraya çevirme icra yoluyla olur. Sıra, teminat kapsamı ve artan değer paydaşları final klasikidir.',
        ],
        kartlar: [
          { baslik: 'Taşınır rehin', govde: 'Teslim + alacak bağlantısı.' },
          { baslik: 'İpotek', govde: 'Tescil + taşınmaz teminatı.' },
          { baslik: 'Sıra', govde: 'Birden fazla rehin / alacaklı.' },
          { baslik: 'Paraya çevirme', govde: 'İcra satışı çerçevesi.' },
        ],
        uyari: 'İpotek, borcun ödenmesiyle sona erer; “malik değişti” tek başına bitirmez.',
      },
      {
        heading: 'D. Taşınmaz yükü',
        paragraphs: [
          'Malike, lehine olan kişi için edimde bulunma yükü yükler. Uygulamada irtifak/rehine göre daha az sorulur ama tanımı ve ayni karakteri bilinmelidir.',
        ],
      },
      {
        heading: 'E. Koruma davaları',
        paragraphs: [
          'İstihkak: mülkiyete dayalı iade. El atmanın önlenmesi: haksız müdahalenin men’i. Zilyetlik davaları: fiilî hâkimiyetin korunması. Hangisini istediğinizi ilk cümlede yazın.',
          'İspat yükü ve davalı sıfatı davaya göre değişir. Ecrimisil, haksız kullanım bedeli olarak yan talep olabilir.',
        ],
        hapBilgi: 'Dava seçimi = netice talebiniz. Yanlış dava = yanlış ispat.',
        bullets: [
          'İstihkak',
          'El atmanın önlenmesi',
          'Zilyetliğin korunması',
          'Ecrimisil (yan)',
        ],
      },
      {
        heading: 'F. Kat mülkiyeti girişi',
        paragraphs: [
          'Bağımsız bölüm mülkiyeti + arsa payı + ortak yerler. Yönetim planı ve kat malikleri kurulu kararları uyuşmazlık üretir. 2. dönemde en azından kavram iskeleti bilinir.',
          'Ortak gider, yenilik, kullanım anlaşmazlıkları KMK + TMK kesişiminde yürür.',
        ],
      },
      {
        heading: 'G. Kazanmanın derinleştirilmesi',
        paragraphs: [
          'Kazandırıcı zamanaşımı, işgal, birleşme/karışma gibi yollar 1. dönem girişinin üzerine eklenir. Şart listesi ve iyiniyet/kötüniyet ayrımı yazılır; uydurma süre yazmaktan kaçının.',
        ],
      },
    ],
    examples: [
      {
        title: 'Geçit irtifakı',
        facts:
          'Komşu, yıllardır tarlasına yoldan geçtiğini iddia eder; malik yolu kapatır.',
        analysis:
          'İrtifak var mı (tescil/kazanma)? Yoksa zilyetlik/komşuluk mu? Talep: irtifak tespiti mi, el atmanın önlenmesi mi?',
        takeaway: 'Ayni hak mı fiilî kullanım mı?',
      },
      {
        title: 'İpotek ve satış',
        facts:
          'İpotekli taşınmaz satılır; alıcı “ipotek beni bağlamaz” der.',
        analysis:
          'İpoteğin ayni etkisi, sicil, iyiniyet. Borç ödenmeden ipotek kural olarak devam eder.',
        takeaway: 'İpotek malikle değil alacakla bağlıdır (iskelet).',
      },
      {
        title: 'İstihkak',
        facts:
          'Malik, çalınan tablonun yeni zilyedinden iade ister.',
        analysis:
          'Mülkiyet ispatı + zilyedin def’ileri (iyiniyetli edinme istisnaları dikkatli). Dava türü istihkak.',
        takeaway: 'Mülkiyet + iade talebi.',
      },
      {
        title: 'El atmanın önlenmesi',
        facts:
          'Komşu duvarı malikin arsasına taşırır.',
        analysis:
          'Haksız müdahale + men talebi. Yıkım / eski hale getirme. Ecrimisil yan talep.',
        takeaway: 'Müdahaleyi durdur + varsa bedel.',
      },
    ],
    mindmap: {
      center: 'Eşya · 2. dönem',
      branches: [
        { label: 'İrtifak', items: ['İntifa', 'Geçit', 'Oturma'] },
        { label: 'Rehin', items: ['Taşınır', 'İpotek'] },
        { label: 'Dava', items: ['İstihkak', 'El atma', 'Zilyetlik'] },
        { label: 'Özel', items: ['KMK', 'Yük'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Zilyetlik ve mülkiyetten irtifak, rehin ve koruma davalarına kadar tek omurga.',
    promise:
      '1. + 2. dönem birleşik; yıllık program ve bütüncül tekrar için “tek cilt” eşya notu.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: önce hak türü (mülkiyet/sınırlı ayni/zilyetlik), sonra dava/kazanma yolu.',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: zilyetlik+sicil+mülkiyet → deneme → sınırlı ayni haklar+davalar → karma deneme.',
          'Her soruda etiket: “Bu zilyetlik mi, mülkiyet mi, irtifak/rehin mi, hangi dava?”',
        ],
        hapBilgi: 'Yıllık başarı = doğru hak + doğru dava/kazanma yolu.',
        bullets: [
          'Hafta 1–4: zilyetlik + sicil',
          'Hafta 5–8: mülkiyet + paylı/el birliği',
          'Hafta 9–12: irtifak + rehin',
          'Hafta 13–14: davalar + KMK giriş + karma deneme',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon: sık soru tipleri',
        paragraphs: [
          'Tip 1 — Sicile güven. Tip 2 — El birliği satış. Tip 3 — İstihkak. Tip 4 — İpotek. Tip 5 — İrtifak. Tip 6 — Paylı mülkiyette yönetim.',
          'Karma olayda birden fazla hak üst üste binebilir (mülkiyet + irtifak + ipotek). Sıra ve etkiyi yazın.',
        ],
        uyari: 'Tek cevapta tüm eşya hukukunu özetlemeyin; sorunun kapısını seçin.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Eşya · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Zilyetlik', 'Sicil', 'Mülkiyet'] },
        { label: '2. yarı', items: ['İrtifak', 'Rehin', 'Davalar'] },
        { label: 'Birlikte', items: ['Paylı', 'El birliği'] },
        { label: 'Yöntem', items: ['Hak seç', 'Dava seç'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'esya-hukuku-donem-1': d1Content,
  'esya-hukuku-donem-2': d2Content,
  'esya-hukuku-yillik': yillikContent,
};

export const ESYA_HUKUKU_VARIANTS = [
  'esya-hukuku-donem-1',
  'esya-hukuku-donem-2',
  'esya-hukuku-yillik',
];

export function buildEsyaHukukuVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Eşya Hukuku ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Eşya Hukuku ${meta.h1Extra}`;
  const description = `${uni.name} için Eşya Hukuku ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Eşya Hukuku ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: hak türünü ve dava/kazanma yolunu doğru seçip unsurlarıyla yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Dönemlik program kendi yarısını; yıllık veya bütüncül tekrar yıllık paketi kullanır.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek olay → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda: hangi hak? hangi dava?',
        'Paylı / el birliği ayrımını ilk 2 satırda yaz',
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
      paragraphs: ['Soru tipine göre dayanaklar. Güncel metin: TMK / KMK.'],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma madde no yazmayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Eşya Hukuku)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık şart. 60 dk / 3 soruda soru başı ~18 dk.`,
        'İskelet: (1) hak türü (2) tanım (3) unsur (4) olgu (5) dava/kazanma yolu (6) sonuç + iyiniyet/süre.',
      ],
      bullets: [
        'Zilyetlik mi mülkiyet mi? İlk cümlede ayır',
        'Sicil + iyiniyet kutusunu aç',
        'Paylı / el birliği yaz',
        'Dava adını doğru seç (istihkak / el atma / zilyetlik)',
      ],
      hapBilgi: 'Doğru hak + doğru dava = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Eşya Hukuku ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Hak türünü seç',
        'Tanım (1 cümle)',
        'Unsurları numarala',
        'Olayı unsura yedir',
        'Dava / kazanma yolu',
        'Sonuç + iyiniyet/süre',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'esya-hukuku-donem-2'
          ? [
              ['İrtifak', 'Kira', 'Ayni mi şahsi mi?'],
              ['İstihkak', 'Zilyetlik davası', 'Mülkiyet mi fiilî hâkimiyet mi?'],
              ['İpotek', 'Taşınır rehin', 'Eşya türü + kuruluş'],
              ['El atmanın önlenmesi', 'İstihkak', 'Men mi iade mi?'],
            ]
          : variantCode === 'esya-hukuku-donem-1'
            ? [
                ['Zilyetlik', 'Mülkiyet', 'Fiilî hâkimiyet mi tam yetki mi?'],
                ['Paylı', 'El birliği', 'Pay ayrılmış mı?'],
                ['Sicile güven', 'Yolsuz tescil', 'İyiniyet var mı?'],
                ['Taşınır', 'Taşınmaz', 'Teslim mi tescil mi?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Mülkiyet/zilyetlik mi sınırlı ayni/dava mı?'],
                ['Paylı', 'El birliği', 'Pay var mı?'],
                ['İstihkak', 'El atma', 'İade mi men mi?'],
                ['İrtifak', 'İpotek', 'Kullanma mı teminat mı?'],
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
      leftTitle: 'Tanım / karşılaştırma',
      rightTitle: 'Olay',
      left: 'Tanım + ayırıcı tablo + mini örnek',
      right: 'Hak seç → unsur → dava/kazanma → hüküm',
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
      a: '1. dönem zilyetlik–sicil–mülkiyet–paylı/el birliği; 2. dönem sınırlı ayni haklar ve koruma davaları; yıllık ikisini birleştirir.',
    },
    {
      q: 'PDF nasıl indirilir?',
      a: '“PDF indir / Yazdır” veya …/pdf → Ctrl+P → PDF olarak kaydet. Kişisel kullanım.',
    },
    {
      q: 'Borçlar notlarıyla birlikte mi?',
      a: 'Evet. Temlik, satış vaadi, ecrimisil gibi kesişimlerde borçlar genel/özel paketleri de açık tutun.',
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
    'Pusula maddeleri TMK’dan doğruladım',
    'PDF’i arşivledim',
    variantCode === 'esya-hukuku-yillik'
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
      `${uni.shortName} eşya hukuku ${meta.short}`,
      `${uni.shortName} eşya hukuku ders notu`,
      `eşya hukuku ${meta.short} not pdf`,
      'zilyetlik mülkiyet irtifak ipotek ders notu',
      'eşya hukuku yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} eşya hukuku`),
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
        'Hak türünü ilk yaz',
        'Unsurları numarala',
        'Dava adını doğru seç',
        'İyiniyet/sicil kutusunu kapat',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Eşya Hukuku ${meta.short} kapsamındaki hakları ayırır`,
      'Zilyetlik / mülkiyet / sınırlı ayni hak seçer',
      'Koruma davasını doğru adlandırır',
      'Paylı ve el birliği rejimini uygular',
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
    relatedCourses: ESYA_HUKUKU_VARIANTS.filter((c) => c !== variantCode).concat([
      'esya-hukuku',
      'medeni-baslangic',
      'borclar-genel-yillik',
    ]),
    relatedBilgi: [],
    updated: '2026-07-29',
    wordTarget: variantCode === 'esya-hukuku-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'esya-hukuku',
    variantLabel: meta.label,
  };
}
