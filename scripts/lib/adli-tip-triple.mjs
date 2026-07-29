/**
 * Adli Tıp —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * adli-tip dersiyle hizalı (hukuk fakültesi seçmeli / zorunlu çerçeve).
 */

function baseMeta(variant) {
  const labels = {
    'adli-tip-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'Adli tıp · 1. yarı (tanım, ölüm, otopsi, kimliklendirme, yaralanma, adli rapor girişi)',
    },
    'adli-tip-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'Adli tıp · 2. yarı (toksikoloji, cinsel suçlar, adli psikiyatri, delil–DNA, bilirkişilik, CMK köprüsü)',
    },
    'adli-tip-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope:
        'Adli tıp tam omurga · ölüm–yaralanma + delil–bilirkişi · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Ölüm, otopsi, yaralanma. Adli tıbbın ceza ve hukuk yargılamasındaki kapısı burada açılır.',
    promise:
      'Adli tıbbın konusu, ölüm türleri ve postmortem değişiklikler, otopsi, kimliklendirme, yaralanma ve adli rapor. Güz finalinde “olgu + bulgu + hukuki soru” bozulmadan yazarsınız.',
    sixtySecond: [
      'Adli tıp: tıp bilgisinin adalet hizmetine uygulanması.',
      'Ölüm: doğal / şiddet / şüpheli; ölüm zamanı tahmini sınırlıdır.',
      'Otopsi: adli / tıbbi; CMK çerçevesinde savcı–hâkim kararı.',
      'Kimliklendirme: parmak izi, diş, DNA, antropometri.',
      'Yaralanma: kesi, ezilme, ateşli silah; yaşamı tehlikeye sokma değerlendirmesi (TCK köprüsü).',
      'Rapor: objektif bulgu + sonuç; hukuki nitelendirme hâkimindir.',
    ],
    pillars: [
      'Adli tıbbın tanımı ve yargılama işlevi',
      'Ölüm ve postmortem değişiklikler',
      'Adli otopsi',
      'Kimliklendirme yöntemleri',
      'Yaralanma ve travmatoloji girişi',
      'Zehirlenme / ani ölüm girişi',
      'Adli rapor ve belge',
      'Hekim–yargı ilişkisi ve etik',
    ],
    definitions: [
      {
        baslik: 'Adli tıp',
        govde:
          'Tıp biliminin, suç ve uyuşmazlıkların aydınlatılmasında yargı organlarına bilimsel destek verdiği disiplindir. Delil üretimi ve bilirkişilikle kesişir.',
      },
      {
        baslik: 'Adli otopsi',
        govde:
          'Ölüm nedeni, şekli ve zamanına ilişkin bulguları ortaya koymak için yasal usulle yapılan ceset muayenesidir. Tıbbi otopsiden amaç ve usul bakımından ayrılır.',
      },
      {
        baslik: 'Ölüm zamanı tahmini',
        govde:
          'Postmortem değişikliklere (ölüm sertliği, lekesi, soğuma vb.) dayanarak yaklaşık ölüm anının belirlenmesidir. Aralık verilir; kesin saat iddiası risklidir.',
      },
      {
        baslik: 'Adli rapor',
        govde:
          'Muayene veya otopsi bulgularının, sorulan hukuki sorulara cevap verecek biçimde düzenlendiği belgedir. Objektiflik ve gerekçe şarttır.',
      },
      {
        baslik: 'Kimliklendirme',
        govde:
          'Canlı veya ölü bireyin kimliğinin bilimsel yöntemlerle belirlenmesidir. Görsel tanı yetersiz kaldığında teknik yöntemler devreye girer.',
      },
    ],
    traps: [
      'Ölüm zamanını kesin saat gibi yazmak — aralık ver.',
      'Raporun hukuki niteliğini (suç tipi) hekime yıkmak — hâkim karar verir.',
      'Her ölümü adli otopsi sanmak — şüpheli/şiddet ölçütü.',
      'Yaralanmayı yalnız “hafif/ağır” etiketlemek — bulgu + sonuç yaz.',
      'Uydurma otopsi prosedürü / madde yazmak.',
    ],
    keyMadde: [
      'CMK — keşif, bilirkişi, otopsi, muayene (çerçeve; güncel metin)',
      'TCK — kasten/taksirle öldürme, yaralama, yaşamı tehlikeye sokma (köprü)',
      'Adli Tıp Kurumu mevzuatı (çerçeve)',
      'Hekimlik Meslek Etiği / sır saklama (çerçeve)',
      'Nüfus / defin işlemleri köprüsü (çerçeve)',
      'Sağlık hukuku — onam ve rapor (köprü)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Adli tıp ne işe yarar?',
        paragraphs: [
          'Yargıya bilimsel delil ve uzman görüşü sunar. 1. dönem ölüm–otopsi–yaralanma omurgasını taşır; toksikoloji, cinsel suçlar, adli psikiyatri ve bilirkişilik derinliği 2. döneme kalır.',
        ],
        hapBilgi: 'Adli tıp = bulgu + rapor + yargıya destek.',
      },
      {
        heading: 'B. Ölüm ve postmortem',
        paragraphs: [
          'Ölümün tanımı (beyin ölümü tartışması çerçeve), ölüm şekilleri, postmortem lezyonlar ile antemortem ayrımı. Ası, boğulma, ateşli silah, künt travma girişi.',
        ],
        bullets: [
          'Doğal ölüm',
          'Şiddet ölümü',
          'Şüpheli ölüm',
          'Postmortem değişiklikler',
        ],
      },
      {
        heading: 'C. Otopsi',
        paragraphs: [
          'Kim ister, kim yapar, hangi usul? Dış muayene, iç muayene, örnek alma. Aile itirazı ve kamu yararı gerilimi. Zincirleme delil koruması.',
        ],
        kartlar: [
          { baslik: 'Adli otopsi', govde: 'Yasal usul + savcı/hâkim.' },
          { baslik: 'Tıbbi otopsi', govde: 'Klinik amaç.' },
          { baslik: 'Bulgu', govde: 'Objektif tespit.' },
          { baslik: 'Sonuç', govde: 'Ölüm nedeni/şekli.' },
        ],
        uyari: 'Usul eksikliği delili zayıflatır.',
      },
      {
        heading: 'D. Kimliklendirme',
        paragraphs: [
          'Görsel, eşya, parmak izi, diş hekimliği, DNA, radyolojik yöntemler. Toplu felaket ve kimliği belirsiz ceset senaryoları.',
        ],
      },
      {
        heading: 'E. Yaralanma',
        paragraphs: [
          'Lezyon türleri, yaş tahmini (sınırlı), yaşamı tehlikeye sokma, basit tıbbi müdahale ile giderilebilirlik (TCK ceza hukuku köprüsü; güncel içtihat dili).',
          'Hukukçu: hekim bulgusunu okur, suç tipini kendisi kurar.',
        ],
        hapBilgi: 'Bulgu hekimden; nitelendirme yargıdan.',
      },
      {
        heading: 'F. Adli rapor',
        paragraphs: [
          'Soru–cevap formatı, netlik, spekülasyondan kaçınma. Geçici / kesin rapor. Çelişkili raporlarda ek bilirkişi.',
        ],
      },
      {
        heading: 'G. Etik ve sır',
        paragraphs: [
          'Meslek sırrı, adli görev istisnası, mağdur mahremiyeti. Fotoğraf ve veri güvenliği.',
        ],
      },
    ],
    examples: [
      {
        title: 'Ölüm zamanı',
        facts:
          'Öğrenci “ölüm tam 03:15’te” yazar; bulgu aralıklıdır.',
        analysis:
          'Tahmin aralığı. Belirsizlik. Aşırı kesinlik hatası.',
        takeaway: 'Aralık ve yöntem yaz.',
      },
      {
        title: 'Yaralanma–TCK',
        facts:
          'Rapor “kesi var” der; öğrenci doğrudan “kasten yaralama” yazar, unsur yok.',
        analysis:
          'Bulgu + kast + netice. Hukuki nitelendirme ayrı.',
        takeaway: 'Rapor suç tipi demez.',
      },
      {
        title: 'Otopsi usulü',
        facts:
          'Aile rızası yok diye adli otopsi yapılmaz sanılır.',
        analysis:
          'Adli otopside kamu usulü. Rıza kuralı tıbbi otopsidedir (çerçeve).',
        takeaway: 'Adli / tıbbi ayır.',
      },
      {
        title: 'Kimlik',
        facts:
          'Görsel tanı ile yetinilir; çelişki vardır.',
        analysis:
          'Teknik kimliklendirme. DNA / diş.',
        takeaway: 'Şüphede teknik yöntem.',
      },
    ],
    mindmap: {
      center: 'Adli Tıp · 1. dönem',
      branches: [
        { label: 'Ölüm', items: ['Şekil', 'Zaman', 'Otopsi'] },
        { label: 'Kimlik', items: ['DNA', 'Diş', 'İz'] },
        { label: 'Yara', items: ['Tür', 'Ağırlık'] },
        { label: 'Belge', items: ['Rapor', 'Etik'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Zehir, cinsel suç, ruhsal durum, delil ve bilirkişi. Adli tıbbın ileri sahası.',
    promise:
      'Adli toksikoloji, cinsel suçlarda muayene, adli psikiyatri girişi, biyolojik delil ve DNA, bilirkişilik, CMK usulü, malpraktis köprüsü. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Toksikoloji: alkol, uyuşturucu, zehir; örnek alma zinciri kritik.',
      'Cinsel suç: rıza, muayene onamı, delil kiti, mahremiyet.',
      'Adli psikiyatri: ceza ehliyeti, fiil ehliyeti, tedbir (giriş).',
      'DNA ve biyolojik delil: kontaminasyon ve zincirleme koruma.',
      'Bilirkişi: görev, ret, rapor, duruşmada açıklama.',
      'CMK: muayene, otopsi, örnek alma usulleri.',
    ],
    pillars: [
      'Adli toksikoloji',
      'Cinsel suçlar ve adli muayene',
      'Çocuk ve kırılgan mağdur',
      'Adli psikiyatri girişi',
      'Biyolojik delil ve DNA',
      'Bilirkişilik hukuku',
      'CMK usul köprüsü',
      'Malpraktis ve adli tıp kesişimi',
    ],
    definitions: [
      {
        baslik: 'Adli toksikoloji',
        govde:
          'Zehir, alkol ve uyuşturucu maddelerin ölüm veya suçla ilişkisini laboratuvar ve klinik yöntemlerle inceleyen alandır. Örnek alma ve saklama usulü sonucu belirler.',
      },
      {
        baslik: 'Bilirkişi',
        govde:
          'Çözümü özel veya teknik bilgiyi gerektiren konularda oy ve görüşünü bildirmek üzere görevlendirilen kişidir. Hâkim hukuki değerlendirmeyi bırakmaz.',
      },
      {
        baslik: 'Ceza ehliyeti (adli psikiyatri girişi)',
        govde:
          'Fiili işlediği sırada işlediği fiilin hukuki anlam ve sonuçlarını algılama ve bu fiille ilgili olarak davranışlarını yönlendirme yeteneğidir (TCK çerçevesi).',
      },
      {
        baslik: 'Delil zinciri',
        govde:
          'Örnek veya eserin toplandığı andan mahkemeye sunulana kadar kimde, nasıl, ne zaman bulunduğunun belgelenmesidir. Kopukluk ispat gücünü zayıflatır.',
      },
      {
        baslik: 'Adli muayene',
        govde:
          'Suç şüphesi veya uyuşmazlık nedeniyle, yasal usulle yapılan tıbbi muayenedir. Onam, mahremiyet ve belgeleme esastır.',
      },
    ],
    traps: [
      'Bilirkişi raporunu hüküm sanmak — takdir hâkimindir.',
      'DNA eşleşmesini “otomatik mahkûmiyet” sanmak — bağlam + zincir.',
      'Cinsel suç muayenesinde onamı yok saymak.',
      'Akıl hastalığı etiketini her savunmaya yapıştırmak — rapor + zaman.',
      'Laboratuvar sonucunu usulsüz örnekle savunmak.',
    ],
    keyMadde: [
      'CMK — bilirkişi, muayene, otopsi, örnek alma (çerçeve)',
      'TCK — ceza ehliyeti, cinsel suçlar, zehirleme (köprü)',
      'HMK — bilirkişi (hukuk yargılaması köprüsü)',
      'Çocuk koruma / mağdur hakları (çerçeve)',
      'KVKK — sağlık ve genetik veri (çerçeve)',
      'Sağlık hukuku — malpraktis bilirkişiliği (köprü)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Adli toksikoloji',
        paragraphs: [
          'Kan, idrar, doku örnekleri; alkol konsantrasyonu ve geriye dönük hesap sınırları. Uyuşturucu ve ilaç etkileşimi. Negatif sonuç usulsüz alımı dışlamaz.',
        ],
        hapBilgi: 'Örnek usulü = sonucun yarısı.',
      },
      {
        heading: 'B. Cinsel suçlar',
        paragraphs: [
          'Erken muayene, delil toplama, yaralanma bulgusu yokluğu suçun yokluğu demek değildir. Rıza ve tehdit hukuki değerlendirmedir; hekim bulgu yazar.',
          'Mağdur odaklı yaklaşım, tekrar travmatizasyonu önleme.',
        ],
        kartlar: [
          { baslik: 'Onam', govde: 'Muayene rızası.' },
          { baslik: 'Delil', govde: 'Kit + zincir.' },
          { baslik: 'Bulgu', govde: 'Var / yok + anlam.' },
          { baslik: 'Mahremiyet', govde: 'Veri + ortam.' },
        ],
        uyari: 'Bulgu yokluğu ≠ fiil yokluğu.',
      },
      {
        heading: 'C. Adli psikiyatri girişi',
        paragraphs: [
          'Ceza ehliyeti, fiil ehliyeti, zorunlu tedavi, tehlikelilik değerlendirmesi (çerçeve). Gözlem altına alma usulü CMK ile bağlanır.',
          'Sınavda TCK m.32 omurgası (güncel metin) + rapor dili yeter; klinik teşhis uydurma.',
        ],
      },
      {
        heading: 'D. DNA ve biyolojik delil',
        paragraphs: [
          'Toplama, saklama, laboratuvar, istatistiksel yorum. Kontaminasyon ve karışık profiller. KVKK / genetik veri duyarlılığı.',
        ],
      },
      {
        heading: 'E. Bilirkişilik',
        paragraphs: [
          'Görevlendirme, yemin, süre, ek rapor, çelişki giderme, ret sebepleri. Bilirkişi hukuki sonuç bağlamaz; teknik soruya cevap verir.',
        ],
        hapBilgi: 'Bilirkişi aydınlatır; hüküm vermez.',
      },
      {
        heading: 'F. CMK usul köprüsü',
        paragraphs: [
          'İç beden muayenesi, moleküler genetik incelemeler, otopsi, keşif. Zorla muayene ve oranlılık. Savunma hakkı ve itiraz.',
        ],
      },
      {
        heading: 'G. Malpraktis köprüsü',
        paragraphs: [
          'Sağlık hukuku notundaki özen–zarar–illiyet burada adli rapor ve bilirkişi ile kesişir. Komplikasyon / malpraktis ayrımı tıbbi standart sorusudur.',
        ],
      },
    ],
    examples: [
      {
        title: 'Bilirkişi sınırı',
        facts:
          'Rapor “sanık suçludur” der.',
        analysis:
          'Yetki aşımı. Teknik soru dışına çıkma. Takdir hâkimde.',
        takeaway: 'Bilirkişi hüküm yazmaz.',
      },
      {
        title: 'DNA',
        facts:
          'Eşleşme var; toplama usulü belgesiz.',
        analysis:
          'Delil zinciri. İspat gücü zayıflar.',
        takeaway: 'Zinciri kur.',
      },
      {
        title: 'Ceza ehliyeti',
        facts:
          'Savunma “psikiyatrik sorun” der; rapor yok, zaman belirsiz.',
        analysis:
          'Fiil anı. Rapor. TCK ehliyet unsuru.',
        takeaway: 'Zaman + rapor.',
      },
      {
        title: 'Cinsel suç muayenesi',
        facts:
          'Mağdur rızası yokken zorla muayene (rutin varsayım).',
        analysis:
          'Onam / kanuni zorunluluk ayrımı. Oranlılık. CMK.',
        takeaway: 'Usul ve onamı yaz.',
      },
    ],
    mindmap: {
      center: 'Adli Tıp · 2. dönem',
      branches: [
        { label: 'Lab', items: ['Toksikoloji', 'DNA'] },
        { label: 'Özel', items: ['Cinsel', 'Psikiyatri'] },
        { label: 'Usul', items: ['Bilirkişi', 'CMK'] },
        { label: 'Köprü', items: ['Malpraktis', 'TCK'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Ölüm ve yaralanmadan toksikoloji, delil ve bilirkişiliğe tek omurga.',
    promise:
      '1. + 2. dönem birleşik; adli tıp için “tek cilt” not. Bulgu + rapor + yargı köprüsü.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: otopsi/yara mı, delil/bilirkişi mi?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: ölüm–otopsi → yaralanma–rapor → toksikoloji–cinsel–psikiyatri → DNA–bilirkişi–CMK → karma.',
          'Her soruda: “Bulgu ne? Usul ne? Hukuki soru ne? Kim nitelendirir?”',
        ],
        hapBilgi: 'Yıllık başarı = objektif bulgu + usul + hukuki sınır.',
        bullets: [
          'Hafta 1–3: adli tıp işlevi + ölüm + otopsi',
          'Hafta 4–6: kimlik + yaralanma + rapor',
          'Hafta 7–10: toksikoloji + cinsel + psikiyatri',
          'Hafta 11–14: DNA + bilirkişi + CMK + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Ölüm şekli. Tip 2 — Otopsi usulü. Tip 3 — Yaralanma–TCK. Tip 4 — Delil zinciri. Tip 5 — Bilirkişi sınırı. Tip 6 — Ceza ehliyeti.',
          'Uydurma klinik teşhis ve kesin saat yazma. CMK ve TCK köprülerini güncel metinden doğrula.',
        ],
        uyari: 'Hekim bulgusu ≠ mahkeme hükmü.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Adli Tıp · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Ölüm', 'Otopsi', 'Yara'] },
        { label: '2. yarı', items: ['Lab', 'Bilirkişi', 'CMK'] },
        { label: 'Yöntem', items: ['Bulgu', 'Rapor', 'Sınır'] },
        { label: 'Köprü', items: ['TCK', 'Sağlık hukuku'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'adli-tip-donem-1': d1Content,
  'adli-tip-donem-2': d2Content,
  'adli-tip-yillik': yillikContent,
};

export const ADLI_TIP_VARIANTS = [
  'adli-tip-donem-1',
  'adli-tip-donem-2',
  'adli-tip-yillik',
];

export function buildAdliTipVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Adli Tıp ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Adli Tıp ${meta.h1Extra}`;
  const description = `${uni.name} için Adli Tıp ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Adli Tıp ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: tıbbi bulguyu okumak, usulü bilmek ve hukuki niteliği yargıya bırakarak sınavda bozmadan yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Hukukçu adli tıp notunda hekim gibi teşhis koymaz; bulgu–usul–hukuki soru üçlüsünü kurar.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda: bulgu / usul / hukuki soru',
        'Nitelendirmeyi hâkime bırak',
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
      heading: '5. Pusula dayanaklar',
      paragraphs: [
        'CMK ve TCK köprü dayanaklardır. Klinik ayrıntı uydurulmaz; usul ve sınır yazılır.',
      ],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma otopsi adımı / kesin ölüm saati / laboratuvar değeri yazmayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Adli Tıp)',
      paragraphs: [
        `${uni.shortName} klasiklerinde olgu → bulgu → usul → hukuki köprü puan getirir.`,
        'İskelet: (1) olay tipi (2) tıbbi soru (3) yöntem/usul (4) rapor dili (5) TCK/CMK köprüsü.',
      ],
      bullets: [
        'Kesin saat iddiasından kaçın',
        'Bulgu ile suç tipini ayır',
        'Delil zincirini yaz',
        'Bilirkişi sınırını bil',
      ],
      hapBilgi: 'Bulgu + usul + sınır = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Adli Tıp ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Olay tipini seç',
        'Tıbbi soruyu yaz',
        'Usul / yöntem',
        'Bulgu dili',
        'Hukuki köprü',
        'Sınır / belirsizlik',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'adli-tip-donem-2'
          ? [
              ['Bilirkişi raporu', 'Mahkeme hükmü', 'Teknik mi hukuki sonuç mu?'],
              ['DNA eşleşmesi', 'Suç ispatı', 'Zincir ve bağlam var mı?'],
              ['Ceza ehliyeti', 'Teşhis etiketi', 'Fiil anı + yasal ölçü?'],
              ['Onamlı muayene', 'Zorunlu usul', 'CMK dayanağı var mı?'],
            ]
          : variantCode === 'adli-tip-donem-1'
            ? [
                ['Adli otopsi', 'Tıbbi otopsi', 'Yasal usul mü klinik amaç mı?'],
                ['Bulgu', 'Suç tipi', 'Hekim mi hâkim mi söyler?'],
                ['Ölüm zamanı aralığı', 'Kesin saat', 'Yöntem ne kadar kesin?'],
                ['Kimliklendirme', 'Görsel tanı', 'Teknik yöntem gerekti mi?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Ölüm/yara mı delil/bilirkişi mi?'],
                ['Bulgu', 'Nitelendirme', 'Tıp mı hukuk mu?'],
                ['Rapor', 'Hüküm', 'Aydınlatma mı karar mı?'],
                ['Otopsi', 'Muayene', 'Ölü mü canlı mı?'],
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
      leftTitle: 'Ölüm / yara / otopsi',
      rightTitle: 'Delil / bilirkişi / CMK',
      left: 'Postmortem–kimlik–travma–rapor',
      right: 'Toksikoloji–DNA–ehliyet–bilirkişi',
    },
    {
      kind: 'cycle',
      title: 'Haftalık döngü',
      steps: ['Kavram', 'Olgu', 'Usul', 'Quiz', 'Yanlış defteri'],
    },
  ];

  const faq = [
    {
      q: '1. dönem / 2. dönem / yıllık farkı ne?',
      a: '1. dönem ölüm–otopsi–kimlik–yaralanma–rapor; 2. dönem toksikoloji–cinsel–psikiyatri–DNA–bilirkişi–CMK; yıllık ikisini birleştirir.',
    },
    {
      q: 'Hukukçu adli tıpta ne kadar tıp bilmeli?',
      a: 'Teşhis koymak değil; bulguyu okumak, usulü bilmek ve hukuki soruyu doğru sormak. Aşırı klinik iddia risklidir.',
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
    'Bulgu / nitelendirme ayrımını denedim',
    'PDF’i arşivledim',
    variantCode === 'adli-tip-yillik'
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
      `${uni.shortName} adli tıp ${meta.short}`,
      `${uni.shortName} otopsi bilirkişi ders notu`,
      `adli tıp ${meta.short} not pdf`,
      'adli otopsi yaralanma DNA bilirkişilik',
      'adli tıp yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} adli tıp`),
      'ücretsiz hukuk ders notu',
    ],
    lead,
    promise: bank.promise,
    sixtySecond: bank.sixtySecond,
    examBox: {
      calendar: uni.calendar,
      typicalWeights: 'Ara sınav ~%30–40 · Final ~%50–60 (yönetmeliğe göre)',
      format: uni.type === 'vakif' ? 'Klasik + olgu; laboratuvar gezisi olabilir' : 'Klasik yazılı + olgu analizi',
      tips: [
        'Bulgu ve usulü ayır',
        'Kesin saat iddiasından kaçın',
        'Bilirkişi sınırını yaz',
        'TCK/CMK köprüsünü kur',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Adli tıp ${meta.short} kurumlarını ayırır`,
      'Ölüm–otopsi–yaralanma dilini kurar',
      'Delil ve bilirkişilik usulünü uygular',
      'Hukuki nitelendirme sınırını korur',
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
    relatedCourses: ADLI_TIP_VARIANTS.filter((c) => c !== variantCode).concat([
      'adli-tip',
      'ceza-genel-yillik',
      'cmk-yillik',
      'saglik-hukuku-yillik',
    ]),
    relatedBilgi: [],
    updated: '2026-07-30',
    wordTarget: variantCode === 'adli-tip-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'adli-tip',
    variantLabel: meta.label,
  };
}
