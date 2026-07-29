/**
 * Türk Hukuk Tarihi —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * turk-hukuk-tarihi dersiyle hizalı (mufredat: year 1, genel).
 */

function baseMeta(variant) {
  const labels = {
    'turk-hukuk-tarihi-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'Türk hukuk tarihi · 1. yarı (yöntem, İslam öncesi, İslam hukuku, klasik Osmanlı: şer’i–örfi, kadı, kanunname)',
    },
    'turk-hukuk-tarihi-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'Türk hukuk tarihi · 2. yarı (Tanzimat, Mecelle, Nizamiye, Meşrutiyet, Cumhuriyet hukuki devrimi, resepsiyon)',
    },
    'turk-hukuk-tarihi-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope:
        'Türk hukuk tarihi tam omurga · İslam öncesi + Osmanlı klasik + reform + Cumhuriyet · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Töre ve şeriat’tan klasik Osmanlı düzenine. Kaynak + kurum + mahkeme iskeleti burada kurulur.',
    promise:
      'Hukuk tarihi yöntemi, İslam öncesi Türk hukuku, İslam hukukunun temel kavramları, Osmanlı’da şer’i–örfi ikiliği, kanunname, kadı ve şer’iye mahkemeleri, toprak ve vakıf girişi. Güz finalinde “kaynak + dönem + kurum” bozulmadan yazarsınız.',
    sixtySecond: [
      'Türk hukuk tarihi: Türk toplumlarında hukukun kaynak, kurum ve uygulama tarihini inceler; dogmatik “madde ezberi” değildir.',
      'İslam öncesi: töre / örf; kağanlık ve boy düzeni çerçevesi.',
      'İslam hukuku: fıkıh, şeriat, mezhep, fetva; kaynak teorisi (Kitap, sünnet, icma, kıyas) giriş düzeyinde.',
      'Klasik Osmanlı: şer’i hukuk + örfi (sultanî) hukuk ikiliği.',
      'Kanunname ve ferman: örfi alanın yazılı ifadesi; şeriatla gerilim ve uzlaşma.',
      'Kadı ve şer’iye mahkemesi: yargı ve yerel yönetim işlevi; sicil defterleri kaynak değeri taşır.',
    ],
    pillars: [
      'Hukuk tarihi nedir, nasıl çalışılır?',
      'İslam öncesi Türk hukuku (töre, örf)',
      'İslam hukuku: kavram ve kaynak girişi',
      'Osmanlı klasik düzeni: şer’i–örfi ikilik',
      'Kanunname, ferman, fetva',
      'Kadı, şer’iye mahkemesi, sicil',
      'Toprak (miri, mülk, vakıf) girişi',
      'Tanzimat eşiğine kadar süreklilik haritası',
    ],
    definitions: [
      {
        baslik: 'Örfi hukuk',
        govde:
          'Osmanlı’da sultanın kamu düzeni, vergi, ceza ve idare alanındaki düzenleme yetkisinden doğan hukuktur. Şer’i alandan ayrılır; kanunname ve fermanlarla somutlaşır.',
      },
      {
        baslik: 'Şer’i hukuk',
        govde:
          'İslam hukukuna dayanan kurallar bütünüdür. Aile, miras, ibadet ve birçok özel hukuk alanında klasik dönemde ağır basar; kadı yargılamasının temel referansıdır.',
      },
      {
        baslik: 'Kanunname',
        govde:
          'Sultanın örfi alandaki yazılı düzenlemeleridir. Genel veya bölgeye özgü olabilir; vergi, toprak, ceza ve askerî düzenlemelerde görülür.',
      },
      {
        baslik: 'Kadı',
        govde:
          'Şer’iye mahkemesinde yargıçtır. Yargı yanında noterlik, vesayet, vakıf denetimi gibi yerel işlevler üstlenir; karar ve işlemler sicile işlenir.',
      },
      {
        baslik: 'Fetva',
        govde:
          'Müftü veya şeyhülislamın hukuki soruya verdiği görüştür. Yargı kararından farklıdır; bağlayıcılık tartışması ve uygulama etkisi bilinir.',
      },
    ],
    traps: [
      'Örfi hukuku “laik hukuk” sanmak — modern laiklikten farklıdır.',
      'Osmanlı’yı yalnız şeriat veya yalnız kanunname ile açıklamak — ikilik unutulur.',
      'Kadıyı yalnızca “hâkim” sanıp idari/noter işlevini atlamak.',
      'Fetvayı mahkeme kararıyla eşitlemek.',
      'Uydurma tarih, padişah adı ve madde numarası yazmak.',
    ],
    keyMadde: [
      'Osmanlı kanunnameleri — örfi düzenleme (çerçeve; metin adı olaya göre)',
      'Şer’iye sicilleri — uygulama kaynağı (çerçeve)',
      'Fıkıh / mezhep geleneği — Hanefi çizgisi (Osmanlı çerçevesi)',
      'Miri arazi – mülk – vakıf üçlüsü (giriş)',
      'Şeyhülislamlık / fetva usulü (çerçeve)',
      'Tanzimat Fermanı 1839 — 2. dönem eşiği (köprü)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Hukuk tarihi ne işe yarar?',
        paragraphs: [
          'Bugünkü kurumların kökenini ve kırılmalarını gösterir. Sınavda “hikâye anlatmak” değil; dönem + kaynak + kurum + süreklilik/kopuş cümlesi puan getirir.',
          '1. dönem klasik iskeleti taşır; reform ve Cumhuriyet 2. döneme kalır.',
        ],
        hapBilgi: 'Tarih = kaynak + kurum + dönem; roman değil.',
      },
      {
        heading: 'B. İslam öncesi Türk hukuku',
        paragraphs: [
          'Töre / yasak kavramı, kağan ve boy düzeni, ceza ve aileye dair genel çizgiler. Kaynak sorunu (yazılı metin azlığı) bilinçli yazılır.',
          'İslamlaşma ile süreklilik ve dönüşüm tartışması giriş düzeyinde bırakılır.',
        ],
        bullets: [
          'Töre / örf',
          'Kağanlık ve boy',
          'Yazılı kaynak sorunu',
          'İslam’a geçişte dönüşüm',
        ],
      },
      {
        heading: 'C. İslam hukuku girişi',
        paragraphs: [
          'Şeriat ve fıkıh ayrımı (geniş çerçeve). Kaynak teorisi: Kitap, sünnet, icma, kıyas. Mezhep olgusu; Osmanlı’da Hanefi çizgisinin ağırlığı.',
          'Fetva, içtihat, taklit tartışması sınav dilinde sade tutulur; teoloji dersi yapılmaz.',
        ],
        kartlar: [
          { baslik: 'Şeriat', govde: 'Dini-hukuki norm alanı.' },
          { baslik: 'Fıkıh', govde: 'Hukuk bilimi / içtihat.' },
          { baslik: 'Fetva', govde: 'Görüş; karar değil.' },
          { baslik: 'Mezhep', govde: 'Okul / yöntem geleneği.' },
        ],
      },
      {
        heading: 'D. Osmanlı şer’i–örfi ikiliği',
        paragraphs: [
          'Klasik model: özel hukuk ve ailede şer’i ağırlık; vergi, toprak, kamu düzeni ve bir kısım cezada örfi düzenleme. İki alanın gerilimi ve pratikte iç içe geçmesi yazılır.',
          'Sultan “şeriatı çiğneyen kanun koyucu” karikatürüne düşülmez; meşruiyet dili ve sınır tartışması çerçevede kalır.',
        ],
        uyari: 'Tek kutuplu Osmanlı anlatısı tuzak.',
      },
      {
        heading: 'E. Kanunname, ferman, fetva',
        paragraphs: [
          'Kanunname: genel veya mahallî örfi metin. Ferman: emir / irade. Fetva: dinî-hukuki görüş. Üçünün işlev farkı sınav klasiğidir.',
        ],
        hapBilgi: 'Kaynak türü = işlev; isim yığmak yetmez.',
      },
      {
        heading: 'F. Kadı ve şer’iye mahkemesi',
        paragraphs: [
          'Yargılama, ispat, sicil tutma. Kadının çok işlevliliği: nikâh, boşanma, miras, borç, vakıf, nafaka. Siciller tarihçinin birincil kaynağıdır.',
          'Mahkeme hiyerarşisi ve temyiz (divan) girişi fakülte programına göre sınırlı tutulur.',
        ],
      },
      {
        heading: 'G. Toprak ve vakıf girişi',
        paragraphs: [
          'Miri arazi (devlet mülkiyeti + kullanım hakları), mülk, vakıf. Timar sistemine kısa değini. Toprak rejimi örfi alanın omurgasıdır; 2. dönemde reformlarla bağlanır.',
        ],
      },
    ],
    examples: [
      {
        title: 'Şer’i–örfi',
        facts:
          'Öğrenci Osmanlı’yı “tamamen şeriat devleti” yazar.',
        analysis:
          'Klasik ikilik atlanır. Vergi/toprak/kamu düzeninde örfi katman.',
        takeaway: 'İkiliği ilk cümlede kur.',
      },
      {
        title: 'Fetva ≠ karar',
        facts:
          'Fetva “mahkeme kararı gibi bağlayıcı” denir.',
        analysis:
          'Görüş–yargı ayrımı. Uygulama etkisi ayrı tartışılır.',
        takeaway: 'Fetva işlevini ayır.',
      },
      {
        title: 'Kadı',
        facts:
          'Kadı yalnız ceza hâkimi sanılır.',
        analysis:
          'Aile, borç, vakıf, noterlik işlevleri. Sicil.',
        takeaway: 'Çok işlev yaz.',
      },
      {
        title: 'Kanunname',
        facts:
          'Kanunname modern TBMM yasası gibi anlatılır.',
        analysis:
          'Sultanî örfi düzenleme. Meclis yasası değil. Dönem dili.',
        takeaway: 'Anakronizmden kaçın.',
      },
    ],
    mindmap: {
      center: 'Türk Hukuk Tarihi · 1. dönem',
      branches: [
        { label: 'Yöntem', items: ['Kaynak', 'Dönem', 'Kurum'] },
        { label: 'Öncesi', items: ['Töre', 'Örf'] },
        { label: 'İslam', items: ['Fıkıh', 'Fetva'] },
        { label: 'Osmanlı', items: ['Şer’i', 'Örfi', 'Kadı'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Tanzimat’tan Cumhuriyet resepsiyonuna. Reform, kodifikasyon ve hukuki devrim.',
    promise:
      'Tanzimat ve Islahat, Mecelle ve modern kanunlar, Nizamiye mahkemeleri, Kanun-ı Esasi ve Meşrutiyet, millî mücadele dönemi, 1923–1926 hukuki devrim ve resepsiyon, laik hukuk düzeni. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Tanzimat (1839): Gülhane; güvenlik, vergi, yargı vaatleri; modernleşme eşiği.',
      'Kodifikasyon: ceza, ticaret, arazi; Mecelle (1869–1876) — medeni hukuk derlemesi.',
      'Nizamiye mahkemeleri: şer’iye yanında modern yargı örgütü.',
      'Kanun-ı Esasi 1876 / Meşrutiyet: anayasal deneme ve meclis.',
      'Cumhuriyet: 1924 Anayasası çizgisi; 1926’da TMK vb. resepsiyon.',
      'Laiklik: hukukun dinî referanstan ayrılması; süreklilik/kopuş tartışması.',
    ],
    pillars: [
      'Tanzimat ve reform mantığı',
      'Kodifikasyon dalgası ve Mecelle',
      'Mahkeme ikiliği: şer’iye–nizamiye',
      'Anayasal gelişmeler (1876, Meşrutiyet)',
      'II. Meşrutiyet ve geç dönem reform',
      'Millî mücadele ve hukukî süreklilik',
      'Cumhuriyet hukuki devrimi ve resepsiyon',
      'Laiklik ve modern Türk hukuk düzeni',
    ],
    definitions: [
      {
        baslik: 'Tanzimat',
        govde:
          '1839 Gülhane Hatt-ı Hümayunu ile açılan reform dönemidir. Can, ırz, mal güvencesi, vergi ve yargı vaatleriyle modern devlet hukukuna geçiş eşiği sayılır.',
      },
      {
        baslik: 'Mecelle',
        govde:
          'Ahmet Cevdet Paşa başkanlığında hazırlanan, İslam hukukuna dayanan medeni hukuk derlemesidir (1869–1876). Borçlar ve yargılama hükümleri öne çıkar; aile–miras kapsamı sınırlıdır.',
      },
      {
        baslik: 'Nizamiye mahkemeleri',
        govde:
          'Tanzimat sonrası kurulan, modern usul ve kanunlara göre işleyen mahkemelerdir. Şer’iye mahkemeleriyle yargı ikiliği doğurur.',
      },
      {
        baslik: 'Resepsiyon',
        govde:
          'Yabancı bir hukuk sisteminin (çoğunlukla İsviçre/İtalya/Almanya modelleri) bilinçli aktarımıdır. 1926 TMK başta olmak üzere Cumhuriyet devriminin yöntemi.',
      },
      {
        baslik: 'Kanun-ı Esasi',
        govde:
          '1876 Osmanlı Anayasasıdır. Meşrutî monarşi denemesini belgeler; askıya alınma ve II. Meşrutiyet’le yeniden yürürlük anlatısı bilinir.',
      },
    ],
    traps: [
      'Tanzimat’ı “bir günde Batılılaşma” sanmak — süreç ve sınırlar.',
      'Mecelle’yi tam İsviçre Medenî Kanunu sanmak — fıkıh temelli derleme.',
      'Nizamiye’yi şer’iye’nin hemen kaldırılması sanmak — ikilik uzun sürer.',
      '1926’yı “hiçbir süreklilik yok” veya “hiçbir kopuş yok” diye tek cümlede bitirmek.',
      'Uydurma madde, yanlış yıl ve uydurma yazar atfetmek.',
    ],
    keyMadde: [
      'Gülhane Hatt-ı Hümayunu — 1839 (çerçeve)',
      'Islahat Fermanı — 1856 (çerçeve)',
      'Mecelle-i Ahkâm-ı Adliye — 1869–1876 (çerçeve)',
      'Kanun-ı Esasi — 1876 (çerçeve)',
      '1924 Anayasası — Cumhuriyet (çerçeve)',
      '1926 TMK (ve eşzamanlı kodlar) — resepsiyon (çerçeve; güncel metin ayrı)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Tanzimat mantığı',
        paragraphs: [
          'Merkezîleşme, tebaa güvencesi, maliye ve yargı reformu. Avrupa baskısı ve iç ihtiyaç birlikte okunur. Reform “tek ferman” değildir; uzun süreçtir.',
        ],
        hapBilgi: 'Tanzimat = vaat + kurum + süreç.',
      },
      {
        heading: 'B. Kodifikasyon ve Mecelle',
        paragraphs: [
          'Ceza, ticaret, arazi kanunları modern kod fikrini getirir. Mecelle: fıkha dayalı, sistematik medeni derleme; Avrupa tipi tam medeni kanundan farkı yazılır.',
          'Mecelle’nin yürürlükten kalkışı ve 1926 resepsiyonu 2. dönem kapanışına bağlanır.',
        ],
        kartlar: [
          { baslik: 'Mecelle', govde: 'Fıkıh temelli medeni derleme.' },
          { baslik: 'Ceza / ticaret', govde: 'Modern kod denemeleri.' },
          { baslik: 'Arazi', govde: 'Toprak rejimi reformu.' },
          { baslik: '1926', govde: 'Resepsiyon kopuşu.' },
        ],
      },
      {
        heading: 'C. Yargı ikiliği',
        paragraphs: [
          'Şer’iye ve Nizamiye yan yana. Yetki çatışması, usul farkı, temyiz. Cumhuriyet’te birleştirme / laik yargı hattı.',
        ],
        uyari: '“Hemen tek mahkeme” anlatısı anakronik olabilir.',
      },
      {
        heading: 'D. Anayasal hat',
        paragraphs: [
          '1876 Kanun-ı Esasi, meclis, padişah yetkileri. I. Meşrutiyet’in kısa ömrü, istibdat anlatısı (çerçeve), 1908 II. Meşrutiyet. Anayasa hukuku dersiyle köprü; bu notta tarihsel iskelet yeter.',
        ],
      },
      {
        heading: 'E. Geç dönem ve millî mücadele',
        paragraphs: [
          'II. Meşrutiyet reformları, I. Dünya Savaşı, mütareke. TBMM’nin oluşumu ve hukuki süreklilik/meşruiyet tartışması giriş düzeyinde.',
        ],
      },
      {
        heading: 'F. Cumhuriyet hukuki devrimi',
        paragraphs: [
          'Saltanat ve hilafetin kaldırılması çizgisi (tarihsel çerçeve). 1924 Anayasası. 1926: TMK (İsviçre modeli), ceza ve usul kodlarında resepsiyon. Aile, miras, eşitlik ve laiklik etkileri.',
          'Sınav cümlesi: “Ne koptu, ne dönüşerek sürdü?”',
        ],
        hapBilgi: 'Resepsiyon = bilinçli aktarım + yerel uyarlama iddiası.',
      },
      {
        heading: 'G. Laiklik ve miras tartışması',
        paragraphs: [
          'Hukukun dinî referanstan ayrılması. Mecelle sonrası boşluk ve yeni kodlar. Doktrinde süreklilik–kopuş tartışması: kurum adları benzer kalsa da kaynak ve meşruiyet değişebilir.',
        ],
      },
    ],
    examples: [
      {
        title: 'Mecelle',
        facts:
          'Mecelle “İsviçre’den alındı” denir.',
        analysis:
          'Yanlış. Fıkıh derlemesi. 1926 TMK resepsiyondur.',
        takeaway: 'Mecelle ≠ 1926 TMK.',
      },
      {
        title: 'Nizamiye',
        facts:
          'Tanzimat’la şer’iye kalktı sanılır.',
        analysis:
          'İkilik. Yetki paylaşımı. Süreç uzun.',
        takeaway: 'Yan yana model.',
      },
      {
        title: 'Resepsiyon',
        facts:
          '1926 “çevir-yapıştır, hiç uyarlama yok” denir.',
        analysis:
          'Model aktarımı + yerel tercih. Tartışma alanı.',
        takeaway: 'Yöntemi adlandır, abartma.',
      },
      {
        title: 'Tanzimat',
        facts:
          'Tek fermanla hukuk modernleşti anlatısı.',
        analysis:
          'Süreç, kodlar, mahkemeler, direnç. Katmanlı.',
        takeaway: 'Süreç yaz.',
      },
    ],
    mindmap: {
      center: 'Türk Hukuk Tarihi · 2. dönem',
      branches: [
        { label: 'Reform', items: ['Tanzimat', 'Islahat'] },
        { label: 'Kod', items: ['Mecelle', 'Kanunlar'] },
        { label: 'Anayasa', items: ['1876', 'Meşrutiyet'] },
        { label: 'Cumhuriyet', items: ['Resepsiyon', 'Laiklik'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Töre ve şeriattan Tanzimat’a, Mecelle’den 1926 resepsiyonuna tek omurga.',
    promise:
      '1. + 2. dönem birleşik; Türk hukuk tarihi için “tek cilt” not. Dönem + kaynak + kurum + süreklilik/kopuş.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: klasik Osmanlı mı, reform/Cumhuriyet mi?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: yöntem → İslam öncesi/İslam hukuku → Osmanlı ikilik → kadı/kanunname → Tanzimat/Mecelle → anayasa → Cumhuriyet resepsiyon → karma.',
          'Her soruda: “Hangi dönem? Hangi kaynak? Hangi kurum? Süreklilik mi kopuş mu?”',
        ],
        hapBilgi: 'Yıllık başarı = dönem + kurum + kopuş/süreklilik.',
        bullets: [
          'Hafta 1–3: yöntem + İslam öncesi + İslam hukuku girişi',
          'Hafta 4–6: Osmanlı şer’i–örfi + kadı + toprak',
          'Hafta 7–10: Tanzimat + kodifikasyon + Nizamiye + anayasa',
          'Hafta 11–14: Cumhuriyet + resepsiyon + laiklik + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Şer’i/örfi. Tip 2 — Kadı/fetva. Tip 3 — Kanunname. Tip 4 — Mecelle. Tip 5 — Nizamiye. Tip 6 — 1926 resepsiyon.',
          'Yıl ve kurum adını doğru yaz; uydurma ferman metni ve uydurma madde numarası yazma.',
        ],
        uyari: 'Ezber kronoloji yetmez; kurumsal işlev yaz.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Türk Hukuk Tarihi · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Töre', 'Şer’i–örfi', 'Kadı'] },
        { label: '2. yarı', items: ['Tanzimat', 'Mecelle', '1926'] },
        { label: 'Yöntem', items: ['Dönem', 'Kaynak', 'Kurum'] },
        { label: 'Tartışma', items: ['Süreklilik', 'Kopuş'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'turk-hukuk-tarihi-donem-1': d1Content,
  'turk-hukuk-tarihi-donem-2': d2Content,
  'turk-hukuk-tarihi-yillik': yillikContent,
};

export const TURK_HUKUK_TARIHI_VARIANTS = [
  'turk-hukuk-tarihi-donem-1',
  'turk-hukuk-tarihi-donem-2',
  'turk-hukuk-tarihi-yillik',
];

export function buildTurkHukukTarihiVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Türk Hukuk Tarihi ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Türk Hukuk Tarihi ${meta.h1Extra}`;
  const description = `${uni.name} için Türk Hukuk Tarihi ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Türk Hukuk Tarihi ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: dönem, kaynak ve kurumları bağlamak; anakronizmden kaçınarak süreklilik/kopuş yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Dönem + kaynak türü + kurum + (mümkünse) süreklilik/kopuş dörtlüsü hedeflenir.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her kurum: ad | dönem | işlev | bağ',
        'Ezber yıldan çok kurum haritası',
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
      paragraphs: ['İşler tanım = işlev fısıldayan cümle.'],
      kartlar: bank.definitions,
    },
    {
      heading: '5. Pusula dayanaklar / anahtarlar',
      paragraphs: [
        'Birincil metinler ferman, kanunname, sicil ve kodlardır. Yıl ve kurum adını doğru yazın; uydurma alıntı ve uydurma madde yasaktır.',
      ],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma ferman metni / yanlış yıl yazmayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Türk Hukuk Tarihi)',
      paragraphs: [
        `${uni.shortName} klasiklerinde dönem + kurum + ayrım + süreklilik/kopuş puan getirir. 60 dk / 2–3 soruda planlı yazın.`,
        'İskelet: (1) dönem (2) kurum/kaynak (3) işlev (4) ayrım (5) modern bağ veya kopuş.',
      ],
      bullets: [
        'Dönemi net yaz',
        'Kaynak türünü adlandır',
        'Karşıt kurumu ayır',
        'Anakronizmden kaçın',
      ],
      hapBilgi: 'Dönem + kurum + kopuş/süreklilik = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Türk Hukuk Tarihi ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Dönemi yaz',
        'Kurumu adlandır',
        'Kaynak türü',
        'İşlevi yaz',
        'Ayrımı kur',
        'Kopuş/süreklilik',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'turk-hukuk-tarihi-donem-2'
          ? [
              ['Mecelle', '1926 TMK', 'Fıkıh derlemesi mi resepsiyon mu?'],
              ['Şer’iye', 'Nizamiye', 'Hangi yargı kolu?'],
              ['Tanzimat', 'Cumhuriyet devrimi', 'Reform mu kopuş mu?'],
              ['Kanun-ı Esasi', '1924 AY', 'Hangi anayasal metin?'],
            ]
          : variantCode === 'turk-hukuk-tarihi-donem-1'
            ? [
                ['Şer’i', 'Örfi', 'Dinî referans mı sultanî düzen mi?'],
                ['Fetva', 'Mahkeme kararı', 'Görüş mü hüküm mü?'],
                ['Kanunname', 'Modern yasa', 'Sultanî metin mi meclis yasası mı?'],
                ['Kadı', 'Modern hâkim', 'Çok işlev mi salt yargı mı?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Klasik mi reform/Cumhuriyet mi?'],
                ['Örfi', 'Laik', 'Osmanlı örfisi mi modern laiklik mi?'],
                ['Mecelle', 'TMK', 'Derleme mi resepsiyon mu?'],
                ['Süreklilik', 'Kopuş', 'Ne dönüştü, ne koptu?'],
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
        'Süreklilik/kopuş denemesi',
      ],
    },
    {
      kind: 'fork',
      title: 'Soru tipi',
      leftTitle: 'Klasik Osmanlı',
      rightTitle: 'Reform / Cumhuriyet',
      left: 'Şer’i–örfi–kadı–kanunname',
      right: 'Tanzimat–Mecelle–Nizamiye–resepsiyon',
    },
    {
      kind: 'cycle',
      title: 'Haftalık döngü',
      steps: ['Dönem', 'Kurum', 'Şema', 'Örnek', 'Quiz'],
    },
  ];

  const faq = [
    {
      q: '1. dönem / 2. dönem / yıllık farkı ne?',
      a: '1. dönem yöntem–İslam öncesi–İslam hukuku–klasik Osmanlı (şer’i–örfi, kadı, kanunname); 2. dönem Tanzimat–Mecelle–Nizamiye–Meşrutiyet–Cumhuriyet resepsiyonu; yıllık ikisini birleştirir.',
    },
    {
      q: 'Yıl ezberi şart mı?',
      a: 'Eşik yıllar (1839, 1876, 1926 vb.) evet; fakat puan kurum işlevi ve ayrım cümlesindedir. Salt kronoloji yetmez.',
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
    '5 eşik yılı kurumla eşleştirdim',
    'PDF’i arşivledim',
    variantCode === 'turk-hukuk-tarihi-yillik'
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
      `${uni.shortName} türk hukuk tarihi ${meta.short}`,
      `${uni.shortName} hukuk tarihi ders notu`,
      `türk hukuk tarihi ${meta.short} not pdf`,
      'mecelle tanzimat resepsiyon osmanlı hukuku',
      'türk hukuk tarihi yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} türk hukuk tarihi`),
      'ücretsiz hukuk ders notu',
    ],
    lead,
    promise: bank.promise,
    sixtySecond: bank.sixtySecond,
    examBox: {
      calendar: uni.calendar,
      typicalWeights: 'Ara sınav ~%30–40 · Final ~%50–60 (yönetmeliğe göre)',
      format:
        uni.type === 'vakif'
          ? 'Kısa tanım + klasik; dönem/kurum sorusu olabilir'
          : 'Klasik yazılı + tanım/ayrım',
      tips: [
        'Dönemi net yaz',
        'Kaynak türünü adlandır',
        'Karşıt kurumu ayır',
        'Anakronizmden kaçın',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Türk hukuk tarihi ${meta.short} dönemlerini ayırır`,
      'Şer’i–örfi ve reform kurumlarını kurar',
      'Mecelle–resepsiyon ayrımını kullanır',
      'Süreklilik ve kopuş tartışmasını çerçeveler',
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
    relatedCourses: TURK_HUKUK_TARIHI_VARIANTS.filter((c) => c !== variantCode).concat([
      'turk-hukuk-tarihi',
      'roma-hukuku-yillik',
      'hukuka-giris-yillik',
      'anayasa-yillik',
      'hukuk-sosyolojisi-yillik',
    ]),
    relatedBilgi: [],
    updated: '2026-07-30',
    wordTarget: variantCode === 'turk-hukuk-tarihi-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'turk-hukuk-tarihi',
    variantLabel: meta.label,
  };
}
