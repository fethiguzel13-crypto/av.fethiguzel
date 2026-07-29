/**
 * Deniz Ticareti Hukuku (TTK Beşinci Kitap omurgası) —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * deniz-ticareti dersiyle hizalı.
 */

function baseMeta(variant) {
  const labels = {
    'deniz-ticareti-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'Deniz ticareti · 1. yarı (gemi, donatan, gemi sicili, rehin, donatma iştiraki, gemi adamları girişi)',
    },
    'deniz-ticareti-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'Deniz ticareti · 2. yarı (navlun, çarter, konişmento, avarya, çatma, kurtarma, sınırlı sorumluluk)',
    },
    'deniz-ticareti-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope:
        'Deniz ticareti tam omurga · gemi + sözleşmeler + deniz kazaları · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Gemi nedir, kim donatan, sicil ve rehin nasıl işler? Deniz ticareti iskeleti burada kurulur.',
    promise:
      'Gemi ve gemi türleri, donatan ve gemi adamları, gemi sicili, gemi rehni, donatma iştiraki, deniz ticareti kaynakları. Güz finalinde “mal + kişi + sicil” bozulmadan yazarsınız.',
    sixtySecond: [
      'Deniz ticareti hukuku: gemi ve deniz yolu ile taşıma/ticaret ilişkileri (TTK V. Kitap omurgası).',
      'Gemi: denizde yüzmeye elverişli, kendi itişiyle hareket edebilen araç (çerçeve tanım).',
      'Donatan: gemiyi deniz ticaretinde kullanan kişi; gemi malikinden ayrılabilir.',
      'Gemi sicili: mülkiyet ve rehin için aleniyet / tescil sistemi.',
      'Gemi rehni: özel rehin rejimi; alacak güvencesi.',
      'Donatma iştiraki: birden fazla kişinin gemi işletmesine katılımı.',
    ],
    pillars: [
      'Deniz ticareti hukukunun konusu ve kaynakları',
      'Gemi kavramı ve sınıflandırma',
      'Donatan ve gemi maliki',
      'Gemi adamları ve kaptan girişi',
      'Gemi sicili',
      'Gemi mülkiyeti ve devri',
      'Gemi rehni ve gemi alacakları girişi',
      'Donatma iştiraki',
    ],
    definitions: [
      {
        baslik: 'Gemi',
        govde:
          'Denizde yüzmeye elverişli ve kendi itme gücüyle hareket edebilen araçtır (TTK çerçevesi). Yüzme yeteneği ve itiş unsurları ayırıcıdır; her deniz aracı gemi sayılmaz.',
      },
      {
        baslik: 'Donatan',
        govde:
          'Gemiyi kendi adına deniz ticaretinde kullanan kişidir. Malik ile donatan farklı kişiler olabilir; sorumluluk ve yetki bu sıfata bağlanır.',
      },
      {
        baslik: 'Gemi sicili',
        govde:
          'Geminin kimlik, mülkiyet ve rehin gibi hukuki durumunun tescil edildiği resmî sicildir. Aleniyet ve ispat işlevi görür.',
      },
      {
        baslik: 'Gemi rehni',
        govde:
          'Gemi üzerinde, kanunun öngördüğü biçimde kurulan rehin hakkıdır. Alacaklının öncelikli tatminini sağlar; devir ve sicil kuralları özeldir.',
      },
      {
        baslik: 'Donatma iştiraki',
        govde:
          'Birden fazla kişinin, bir gemiyi ortak işletmek üzere kurduğu özel ortaklık benzeri ilişkidir. Pay ve yönetim kuralları TTK’da düzenlenir.',
      },
    ],
    traps: [
      'Donatan ile gemi malikini her zaman aynı sanmak.',
      'Her deniz aracını gemi saymak — tanım unsurları.',
      'Gemi rehnini taşınır rehniyle eşitlemek — sicil rejimi.',
      'Kaptanı sıradan vekil sanmak — özel yetki ve temsil.',
      'TTK dışı teamül/uluslararası kuralı yok saymak — çerçeve bilin.',
    ],
    keyMadde: [
      'TTK Beşinci Kitap — deniz ticareti (çerçeve; güncel metin)',
      'TTK — gemi tanımı ve sicil (çerçeve)',
      'TTK — donatan, kaptan, gemi adamları (çerçeve)',
      'TTK — gemi rehni (çerçeve)',
      'TTK — donatma iştiraki (çerçeve)',
      'Uluslararası sözleşmeler / teamül (Lahey–Visby vb. — 2. dönem bağ)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Deniz ticareti hukuku nedir?',
        paragraphs: [
          'Gemi, donatan ve deniz yolu taşıma ilişkilerini düzenler. TTK V. Kitap omurgadır; uluslararası sözleşmeler ve teamül tamamlar. 1. dönem “mal ve kişi” iskeletini, 2. dönem “sözleşme ve kaza”yı taşır.',
        ],
        hapBilgi: 'Gemi + donatan + sicil = 1. dönem omurgası.',
      },
      {
        heading: 'B. Gemi',
        paragraphs: [
          'Tanım unsurları, gemi türleri (yük, yolcu, balıkçı…), bayrak ve milliyet. Gemi ile deniz aracı ayrımı sınavda puan getirir.',
        ],
        bullets: [
          'Yüzme elverişliliği',
          'İtiş gücü',
          'Bayrak / milliyet',
          'Sınıflandırma (işlev)',
        ],
      },
      {
        heading: 'C. Donatan ve malik',
        paragraphs: [
          'Malik mülkiyet; donatan işletme sıfatıdır. Donatanın gemi adamı seçimi, emir ve sorumluluk alanı. İşletme devri senaryoları.',
        ],
        kartlar: [
          { baslik: 'Malik', govde: 'Mülkiyet.' },
          { baslik: 'Donatan', govde: 'İşletme / ticaret.' },
          { baslik: 'Kaptan', govde: 'Gemide yönetim.' },
          { baslik: 'Gemi adamı', govde: 'Mürettebat.' },
        ],
      },
      {
        heading: 'D. Kaptan ve gemi adamları',
        paragraphs: [
          'Kaptanın temsil yetkisi, gemi ve yük üzerindeki sorumluluk, acil kararlar. Gemi adamı sözleşmesi / iş hukuku köprüsü sınırlı çerçevede.',
        ],
        uyari: 'Kaptan yetkisini “sıradan müdür” diye küçümseme.',
      },
      {
        heading: 'E. Gemi sicili ve mülkiyet',
        paragraphs: [
          'Tescil, terkin, düzeltme. Mülkiyet kazanma ve devir. İyi niyetle sicile güven. Yabancı bayrak / tescil gerilimi giriş düzeyinde.',
        ],
        hapBilgi: 'Sicil = aleniyet + rehin/mülkiyet güveni.',
      },
      {
        heading: 'F. Gemi rehni ve gemi alacakları',
        paragraphs: [
          'Rehinin kuruluşu, sıra, paraya çevirme. Kanunî gemi alacakları (imtiyazlı alacaklar) girişi — 2. dönemde avarya/çatma ile bağlanır.',
        ],
      },
      {
        heading: 'G. Donatma iştiraki',
        paragraphs: [
          'Pay, yönetim, temsil, sorumluluk. Ortaklık hukukundan farkları. Sona erme.',
        ],
      },
    ],
    examples: [
      {
        title: 'Donatan ≠ malik',
        facts:
          'Gemi A’ya ait; B deniz ticaretinde kullanıyor.',
        analysis:
          'Malik A, donatan B. Sorumluluk ve yetki donatana bağlanır (olay tipine göre).',
        takeaway: 'Sıfatı ayır.',
      },
      {
        title: 'Gemi tanımı',
        facts:
          'Motoru olmayan yüzer depo “gemi” sayılır mı?',
        analysis:
          'İtiş / yüzme unsurları. Tanım testi.',
        takeaway: 'Unsurları yaz.',
      },
      {
        title: 'Sicil',
        facts:
          'Rehin tescilsiz kurulmak istenir.',
        analysis:
          'Gemi rehni sicil rejimi. Geçerlilik / üçüncü kişi.',
        takeaway: 'Sicili unutma.',
      },
      {
        title: 'Kaptan yetkisi',
        facts:
          'Limanda acil tamir; kaptan sözleşme yapar, donatan “yetkisiz” der.',
        analysis:
          'Kaptanın kanuni temsil alanı. Acil ihtiyaç.',
        takeaway: 'Kaptan yetkisini çerçevele.',
      },
    ],
    mindmap: {
      center: 'Deniz Ticareti · 1. dönem',
      branches: [
        { label: 'Mal', items: ['Gemi', 'Sicil', 'Rehin'] },
        { label: 'Kişi', items: ['Donatan', 'Kaptan'] },
        { label: 'Ortaklık', items: ['Donatma iştiraki'] },
        { label: 'Kaynak', items: ['TTK', 'Teamül'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Navlun, çarter, konişmento, avarya ve çatma. Deniz sözleşmeleri ve kazalar.',
    promise:
      'Deniz ticareti sözleşmeleri, navlun, çarter tipleri, konişmento, genel/özel avarya, çatma, kurtarma, yardım, donatanın sınırlı sorumluluğu. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Navlun sözleşmesi: yükün deniz yoluyla taşınması.',
      'Çarter: gemi veya gemi alanının kiralanması (zaman / sefer).',
      'Konişmento: taşıma belgesi; ispat, temsil, devir işlevleri.',
      'Genel avarya: ortak tehlike için bilerek yapılan fedakârlık / masraf paylaşımı.',
      'Çatma: gemilerin çarpışması; kusur ve zarar.',
      'Sınırlı sorumluluk: donatanın kanuni sınırlarla sorumlu tutulması (çerçeve).',
    ],
    pillars: [
      'Deniz ticareti sözleşmeleri haritası',
      'Navlun (yük taşıma) sözleşmesi',
      'Çarter sözleşmeleri',
      'Konişmento',
      'Genel ve özel avarya',
      'Çatma',
      'Kurtarma ve yardım',
      'Sınırlı sorumluluk ve zamanaşımı girişi',
    ],
    definitions: [
      {
        baslik: 'Navlun sözleşmesi',
        govde:
          'Taşıyanın yükü deniz yoluyla bir limandan diğerine taşımayı, taşıtanın da navlun ödemeyi üstlendiği sözleşmedir. Taşıyan özeni ve teslim borcu merkezdedir.',
      },
      {
        baslik: 'Çarter',
        govde:
          'Geminin tamamının veya bir bölümünün, belirli bir süre veya sefer için kullanıma bırakıldığı sözleşmedir. Zaman çarteri / sefer çarteri ayrımı bilinir.',
      },
      {
        baslik: 'Konişmento',
        govde:
          'Taşıyanın yükü teslim aldığını gösteren, taşıma sözleşmesini ispatlayan ve (çoğu durumda) yük üzerindeki hakkı temsil eden kıymetli evrak niteliğindeki belgedir.',
      },
      {
        baslik: 'Genel avarya',
        govde:
          'Ortak deniz serüvenini tehdit eden tehlikede, ortak menfaat için bilerek ve makul biçimde yapılan olağanüstü fedakârlık veya masrafın paylaştırılması rejimidir.',
      },
      {
        baslik: 'Çatma',
        govde:
          'Gemilerin birbirine çarpmasıdır. Kusur, zarar ve tazminat TTK ve uluslararası kurallarla (COLREG köprüsü) çözülür.',
      },
    ],
    traps: [
      'Çarter ile navlunu her zaman aynı sanmak.',
      'Konişmentoyu “sadece makbuz” sanmak — devir/temsil işlevi.',
      'Genel avaryayı her hasara yaymak — ortak tehlike + bilerek fedakârlık.',
      'Sınırlı sorumluluğu “hiç sorumlu değil” okumak.',
      'Uluslararası sözleşme rejimini yok sayıp yalnız TTK yazmak (olay tipine göre).',
    ],
    keyMadde: [
      'TTK — navlun / taşıma (çerçeve; güncel metin)',
      'TTK — çarter (çerçeve)',
      'TTK — konişmento (çerçeve)',
      'TTK — avarya, çatma, kurtarma (çerçeve)',
      'TTK — donatanın sınırlı sorumluluğu (çerçeve)',
      'Lahey–Visby / Hamburg / Rotterdam tartışması (giriş; hangi rejim uygulanır?)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Sözleşme haritası',
        paragraphs: [
          'Navlun, çarter, yolcu taşıma, römorkaj. Taraflar: taşıyan, taşıtan, yükleten, alıcı, çarterer. Sınavda önce sözleşme tipini seç.',
        ],
        hapBilgi: 'Tip seç → borçlar → belge → sorumluluk.',
      },
      {
        heading: 'B. Navlun sözleşmesi',
        paragraphs: [
          'Kuruluş, taşıyanın özen borcu, yükleme–boşaltma, gecikme, hasar ve zıya. Sorumluluktan kurtulma sebepleri ve ispat. Navlun alacağı ve rehin.',
        ],
        kartlar: [
          { baslik: 'Taşıyan', govde: 'Taşıma + özen.' },
          { baslik: 'Taşıtan', govde: 'Navlun + yük bilgisi.' },
          { baslik: 'Hasar', govde: 'Sorumluluk / istisna.' },
          { baslik: 'Teslim', govde: 'Alıcı + konişmento.' },
        ],
      },
      {
        heading: 'C. Çarter',
        paragraphs: [
          'Sefer çarteri: belirli sefer. Zaman çarteri: süre. Bareboat (çıplak gemi) girişi. Off-hire, demurrage (sürastarya) kavramları çerçevede.',
        ],
        uyari: 'Çarter tipini yazmadan sorumluluk dağıtma.',
      },
      {
        heading: 'D. Konişmento',
        paragraphs: [
          'İşlev üçlüsü: makbuz, ispat, (çoğu halde) kıymetli evrak / temsil. Nama / emre / hamile. Temiz / kirli konişmento. Sahtecilik ve çelişki.',
        ],
        hapBilgi: 'Konişmento = belge + hak + ispat.',
      },
      {
        heading: 'E. Avarya',
        paragraphs: [
          'Genel avarya şartları: ortak tehlike, bilerek fedakârlık/masraf, makullük, başarı (çerçeve). Özel avarya: tek tarafa ait hasar. York–Antwerp kuralları girişi.',
        ],
      },
      {
        heading: 'F. Çatma, kurtarma, yardım',
        paragraphs: [
          'Çatmada kusur ve zarar paylaşımı. Kurtarma ücreti; gönüllülük ve başarı. Yardım ile kurtarma ayrımı çerçevede.',
        ],
      },
      {
        heading: 'G. Sınırlı sorumluluk',
        paragraphs: [
          'Donatanın belirli alacaklarda sorumluluğunu sınırlama imkânı (TTK / uluslararası rejim çerçevesi). Kasten / ağır kusurda sınırın kalkması. Zamanaşımı ve yetki notu.',
        ],
      },
    ],
    examples: [
      {
        title: 'Konişmento',
        facts:
          'Alıcı konişmento olmadan yük ister; banka finansmanı var.',
        analysis:
          'Temsil / teslim işlevi. Hamil / hak. Banka teminatı.',
        takeaway: 'Belgeyi kim tutuyor?',
      },
      {
        title: 'Genel avarya',
        facts:
          'Fırtınada yükün bir kısmı denize atılır; masraf paylaşımı istenir.',
        analysis:
          'Ortak tehlike + bilerek fedakârlık. Genel avarya mı?',
        takeaway: 'Şartları tek tek yaz.',
      },
      {
        title: 'Çarter tipi',
        facts:
          'Zaman çarterinde yük hasarı; kim sorumlu?',
        analysis:
          'İşletme / navigasyon ayrımı. Sözleşme hükümleri. Taşıyan sıfatı.',
        takeaway: 'Önce çarter tipi.',
      },
      {
        title: 'Sınırlı sorumluluk',
        facts:
          'Donatan her zarar için “sınırlıyım” der; kasten hareket iddiası var.',
        analysis:
          'Sınır kalkar mı? Kusur derecesi. Rejim.',
        takeaway: 'Sınır + istisna.',
      },
    ],
    mindmap: {
      center: 'Deniz Ticareti · 2. dönem',
      branches: [
        { label: 'Sözleşme', items: ['Navlun', 'Çarter'] },
        { label: 'Belge', items: ['Konişmento'] },
        { label: 'Kaza', items: ['Avarya', 'Çatma', 'Kurtarma'] },
        { label: 'Sorumluluk', items: ['Sınır', 'Zamanaşımı'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Gemiden konişmentoya, donatandan avarya ve çatmaya tek omurga.',
    promise:
      '1. + 2. dönem birleşik; deniz ticareti hukuku için “tek cilt” not. Mal–kişi + sözleşme–kaza.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: gemi/donatan mı, navlun/avarya/çatma mı?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: gemi–donatan–sicil → rehin → navlun–çarter–konişmento → avarya–çatma–sınırlı sorumluluk → karma.',
          'Her soruda: “Gemi/sıfat? Sözleşme tipi? Belge? Kaza mı sorumluluk mu?”',
        ],
        hapBilgi: 'Yıllık başarı = doğru sıfat + doğru sözleşme + doğru belge.',
        bullets: [
          'Hafta 1–3: gemi + donatan + kaptan',
          'Hafta 4–6: sicil + rehin + donatma iştiraki',
          'Hafta 7–10: navlun + çarter + konişmento',
          'Hafta 11–14: avarya + çatma + sınırlı sorumluluk + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Gemi/donatan. Tip 2 — Sicil/rehin. Tip 3 — Navlun hasarı. Tip 4 — Konişmento. Tip 5 — Genel avarya. Tip 6 — Çatma/sınırlı sorumluluk.',
          'Uydurma madde ve uluslararası rejim adı yazma; TTK omurgası + “hangi sözleşme uygulanır?” sorusu.',
        ],
        uyari: 'Sigorta hukuku notuyla karıştırma; deniz sigortası ayrı köprü.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Deniz Ticareti · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Gemi', 'Donatan', 'Sicil'] },
        { label: '2. yarı', items: ['Navlun', 'Konişmento', 'Avarya'] },
        { label: 'Yöntem', items: ['Sıfat seç', 'Sözleşme seç'] },
        { label: 'Köprü', items: ['TTK', 'Uluslararası'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'deniz-ticareti-donem-1': d1Content,
  'deniz-ticareti-donem-2': d2Content,
  'deniz-ticareti-yillik': yillikContent,
};

export const DENIZ_TICARETI_VARIANTS = [
  'deniz-ticareti-donem-1',
  'deniz-ticareti-donem-2',
  'deniz-ticareti-yillik',
];

export function buildDenizTicaretiVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Deniz Ticareti ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Deniz Ticareti Hukuku ${meta.h1Extra}`;
  const description = `${uni.name} için Deniz Ticareti Hukuku ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Deniz Ticareti Hukuku ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: gemi–donatan iskeleti ile navlun–konişmento–avarya dilini sınavda bozmadan yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. TTK Beşinci Kitap omurgadır; uluslararası taşıma rejimleri olay tipine göre eklenir.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda: gemi/sıfat + sözleşme tipi',
        'Konişmento ve avarya şartlarını ayrı yaz',
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
      heading: '5. Pusula dayanaklar',
      paragraphs: [
        'TTK deniz ticareti hükümleri ana kaynaktır. Madde numarası yazacaksanız güncel metinden doğrulayın.',
      ],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma madde / uluslararası rejim adı yazmayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Deniz Ticareti)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık işe yarar. Önce sıfat ve sözleşme tipi, sonra belge ve sorumluluk.`,
        'İskelet: (1) gemi/donatan (2) sözleşme tipi (3) belge (4) hasar/kaza (5) sorumluluk/sınır.',
      ],
      bullets: [
        'Donatan / malik ayır',
        'Navlun / çarter ayır',
        'Konişmento işlevini yaz',
        'Genel avarya şartlarını sırala',
      ],
      hapBilgi: 'Doğru sıfat + doğru sözleşme = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Deniz Ticareti ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Gemi / sıfat',
        'Sözleşme tipi',
        'Belge (konişmento)',
        'Hasar veya kaza',
        'Sorumluluk / sınır',
        'Sonuç',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'deniz-ticareti-donem-2'
          ? [
              ['Navlun', 'Çarter', 'Yük taşıma mı gemi kullanımı mı?'],
              ['Genel avarya', 'Özel avarya', 'Ortak tehlike + bilerek fedakârlık?'],
              ['Konişmento', 'Taşıma sözleşmesi', 'Belge mi borç ilişkisi mi?'],
              ['Sınırlı sorumluluk', 'Tam sorumluluk', 'Sınır kalkıyor mu?'],
            ]
          : variantCode === 'deniz-ticareti-donem-1'
            ? [
                ['Donatan', 'Gemi maliki', 'İşleten mi malik mi?'],
                ['Gemi', 'Deniz aracı', 'Tanım unsurları var mı?'],
                ['Gemi rehni', 'Taşınır rehni', 'Sicil rejimi?'],
                ['Kaptan', 'Vekil', 'Kanuni özel yetki?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Gemi/sıfat mı sözleşme/kaza mı?'],
                ['Sicil', 'Konişmento', 'Gemi kaydı mı yük belgesi mi?'],
                ['Rehin', 'Navlun alacağı', 'Güvence mi taşıma ücreti mi?'],
                ['Çatma', 'Avarya', 'Çarpışma mı ortak fedakârlık mı?'],
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
      leftTitle: 'Gemi / donatan / sicil',
      rightTitle: 'Navlun / avarya / çatma',
      left: 'Mal–kişi–rehin–iştirak',
      right: 'Sözleşme–belge–kaza–sınır',
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
      a: '1. dönem gemi–donatan–sicil–rehin–donatma iştiraki; 2. dönem navlun–çarter–konişmento–avarya–çatma–sınırlı sorumluluk; yıllık ikisini birleştirir.',
    },
    {
      q: 'Sigorta hukuku notuyla birlikte mi?',
      a: 'Deniz sigortası kesişir ama ayrı derstir. Bu not TTK deniz ticareti omurgasını taşır; sigorta için sigorta hukuku triple’ına bakın.',
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
    'Donatan/navlun/konişmento ayrımını denedim',
    'PDF’i arşivledim',
    variantCode === 'deniz-ticareti-yillik'
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
      `${uni.shortName} deniz ticareti ${meta.short}`,
      `${uni.shortName} gemi navlun konişmento ders notu`,
      `deniz ticareti hukuku ${meta.short} not pdf`,
      'çarter avarya çatma donatan',
      'deniz ticareti yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} deniz ticareti`),
      'ücretsiz hukuk ders notu',
    ],
    lead,
    promise: bank.promise,
    sixtySecond: bank.sixtySecond,
    examBox: {
      calendar: uni.calendar,
      typicalWeights: 'Ara sınav ~%30–40 · Final ~%50–60 (yönetmeliğe göre)',
      format: uni.type === 'vakif' ? 'Klasik + ara; vaka olabilir' : 'Klasik yazılı + vaka analizi',
      tips: [
        'Donatan / malik ayır',
        'Sözleşme tipini seç',
        'Konişmento işlevini yaz',
        'Avarya şartlarını sırala',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Deniz ticareti ${meta.short} kurumlarını ayırır`,
      'Gemi–donatan–sicil omurgasını kurar',
      'Navlun–çarter–konişmento dilini uygular',
      'Avarya–çatma–sınırlı sorumluluğu yazar',
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
    relatedCourses: DENIZ_TICARETI_VARIANTS.filter((c) => c !== variantCode).concat([
      'deniz-ticareti',
      'sigorta-hukuku-yillik',
      'ticari-isletme-yillik',
      'borclar-ozel-yillik',
    ]),
    relatedBilgi: [],
    updated: '2026-07-30',
    wordTarget: variantCode === 'deniz-ticareti-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'deniz-ticareti',
    variantLabel: meta.label,
  };
}
