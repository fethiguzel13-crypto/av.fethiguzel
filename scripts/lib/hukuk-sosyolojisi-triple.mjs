/**
 * Hukuk Sosyolojisi —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * hukuk-sosyolojisi dersiyle hizalı; hukuk felsefesiyle köprü.
 */

function baseMeta(variant) {
  const labels = {
    'hukuk-sosyolojisi-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'Hukuk sosyolojisi · 1. yarı (konu–yöntem, normatif/fiili hukuk, yaşayan hukuk, hukuk bilinci, kurumlar)',
    },
    'hukuk-sosyolojisi-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'Hukuk sosyolojisi · 2. yarı (uygulama, sapma, meslekler, meşruiyet, hukuki çoğulluk, eleştirel yaklaşımlar)',
    },
    'hukuk-sosyolojisi-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope:
        'Hukuk sosyolojisi tam omurga · toplumda hukuk + uygulama + meşruiyet · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Hukuk toplumda nasıl yaşar? Metin ile pratik arasındaki boşluk burada açılır.',
    promise:
      'Hukuk sosyolojisinin konusu ve yöntemi, normatif–fiili hukuk, yaşayan hukuk, hukuk bilinci, kurumlar ve aktörler. Güz finalinde “metin / pratik / etki” bozulmadan yazarsınız.',
    sixtySecond: [
      'Hukuk sosyolojisi: hukuku toplumsal olgu olarak inceler.',
      'Normatif hukuk ≠ fiili hukuk; sapma ve boşluk konuşulur.',
      'Yaşayan hukuk: kâğıttaki kural + toplumsal pratik.',
      'Hukuk bilinci: bilme, güven, kullanma.',
      'Kurumlar: mahkeme, polis, idare, meslekler.',
      'Felsefe “olması gerekeni”; sosyoloji “olanı ve etkisini” sorar.',
    ],
    pillars: [
      'Hukuk sosyolojisinin tanımı ve alanı',
      'Yöntem: nitel / nicel / karma (giriş)',
      'Normatif hukuk ve fiili hukuk',
      'Yaşayan hukuk',
      'Hukuk bilinci ve erişim',
      'Hukuki kurumlar ve aktörler',
      'Hukuk ve toplumsal değişme girişi',
      'Felsefe ile ilişki ve ayrım',
    ],
    definitions: [
      {
        baslik: 'Hukuk sosyolojisi',
        govde:
          'Hukuku toplumsal yapı, davranış, kurum ve meşruiyet bağlamında inceleyen disiplindir. Dogmatik hukuk kuralı yorumlar; sosyoloji kuralın toplumsal hayatını sorar.',
      },
      {
        baslik: 'Yaşayan hukuk',
        govde:
          'Resmî metnin ötesinde, toplumsal ilişkilerde fiilen uygulanan ve hissedilen hukuk pratiğidir. Ehrlich çizgisinde “kâğıt hukuku” ile gerilim kurulur.',
      },
      {
        baslik: 'Hukuk bilinci',
        govde:
          'Birey ve grupların hukuku bilme, değerlendirme, güvenme ve kullanma biçimleridir. Erişim, maliyet, dil ve güç asimetriisi etki eder.',
      },
      {
        baslik: 'Fiili hukuk',
        govde:
          'Normun sahadaki işleyişi, seçici uygulama ve enformel pratiklerdir. Normatif metinden sapabilir.',
      },
      {
        baslik: 'Hukuki erişim',
        govde:
          'Kişilerin hukuki bilgiye, danışmana, mercie ve adil çözüme ulaşabilme imkânıdır. Biçimsel eşitlik fiili erişimi garanti etmez.',
      },
    ],
    traps: [
      'Sosyolojeyi “istatistik dersi” sanmak — kavram + kurum + etki.',
      'Fiili hukuku “hukuk yok” diye okumak — hangi hukuk, kimin pratiği?',
      'Felsefe ile sosyolojiyi aynı torbaya atmak.',
      'Yaşayan hukuku “kanunsuzluk övmek” sanmak — betimleme ≠ savunma.',
      'Tek anket sonucunu evrensel yasa gibi yazmak.',
    ],
    keyMadde: [
      'Anayasa m.2 — hukuk devleti (meşruiyet köprüsü)',
      'Anayasa m.36 / AİHS m.6 — adil yargılanma / erişim köprüsü',
      'KVKK / açık veri (araştırma etiği girişi, çerçeve)',
      'TMK m.1–2 — uygulama ve dürüstlük (pratik köprü)',
      'HMK — usul ve erişim (çerçeve)',
      'Doktrin: Ehrlich, Weber, Durkheim çizgisi (tez dili; uydurma alıntı yok)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Hukuk sosyolojisi ne işe yarar?',
        paragraphs: [
          'Kuralın “kitapta ne dediği” yetmez; toplumda nasıl üretildiği, uygulandığı ve sapıldığı sorulur. Sınavda betimleme + kavram + örnek beklenir.',
          '1. dönem yöntem ve temel kavram omurgasını taşır. Uygulama, meslek, çoğulluk ve eleştiri 2. döneme kalır.',
        ],
        hapBilgi: 'Sosyoloji = metin + pratik + etki.',
      },
      {
        heading: 'B. Yöntem girişi',
        paragraphs: [
          'Gözlem, mülakat, anket, dosya incelemesi, istatistik, karşılaştırmalı kurum analizi. Etik: rıza, anonimlik, veri koruma.',
          'Sınavda “yöntem adı + ne ölçer?” yeter; uydurma veri yazılmaz.',
        ],
        bullets: [
          'Nitel yöntem',
          'Nicel yöntem',
          'Karma desen',
          'Araştırma etiği',
        ],
      },
      {
        heading: 'C. Normatif ve fiili hukuk',
        paragraphs: [
          'Yürürlükteki kural ile fiili uygulama ayrılır. Seçici uygulama, enformel norm, “kitapta var sahada yok” senaryoları sınav klasiğidir.',
        ],
        kartlar: [
          { baslik: 'Normatif', govde: 'Metin / kaynak.' },
          { baslik: 'Fiili', govde: 'Uygulama / alışkanlık.' },
          { baslik: 'Sapma', govde: 'Boşluk / seçicilik.' },
          { baslik: 'Sonuç', govde: 'Meşruiyet / güven.' },
        ],
      },
      {
        heading: 'D. Yaşayan hukuk',
        paragraphs: [
          'Toplumsal ilişkilerde fiilen işleyen normlar. Resmî hukuk ile rekabet, tamamlayıcılık veya çatışma. Köy, çarşı, dijital platform pratikleri örnek olabilir.',
        ],
        uyari: 'Yaşayan hukuk betimlemesi, hukuka aykırılığı meşrulaştırma değildir.',
      },
      {
        heading: 'E. Hukuk bilinci ve erişim',
        paragraphs: [
          'Bilgi düzeyi, adalet algısı, mercie başvurma cesareti. Maliyet, dil, coğrafya, statü engelleri. “Hukuk var ama kim kullanıyor?” sorusu.',
        ],
        hapBilgi: 'Erişim yoksa kural kâğıtta kalır.',
      },
      {
        heading: 'F. Kurumlar ve aktörler',
        paragraphs: [
          'Mahkeme, savcılık, baro, noter, idare, kolluk, arabulucu. Kurumsal kültür ve rol çatışması giriş düzeyinde yazılır.',
        ],
      },
      {
        heading: 'G. Felsefe köprüsü',
        paragraphs: [
          'Felsefe meşruiyet ve adalet ölçütü sorar; sosyoloji ölçütün sahadaki karşılığını test eder. İkisi birlikte okunur, birbirinin yerine geçmez.',
        ],
      },
    ],
    examples: [
      {
        title: 'Metin–pratik',
        facts:
          'Kanun eşitlik der; uygulama seçicidir. Öğrenci yalnız maddeyi yazar.',
        analysis:
          'Normatif + fiili. Sosyolojik bakış. Meşruiyet gerilimi.',
        takeaway: 'Metin ile pratik ayrı satır.',
      },
      {
        title: 'Erişim',
        facts:
          'Köyde adli yardım yok; hak var ama kullanılmıyor.',
        analysis:
          'Hukuk bilinci + erişim. Biçimsel eşitlik yetmez.',
        takeaway: 'Erişimi yaz.',
      },
      {
        title: 'Yaşayan hukuk',
        facts:
          'Semt esnafı anlaşmazlığı “kendi usulüyle” çözer.',
        analysis:
          'Enformel norm. Resmî mercie gitmeme. Çoğulluk girişi.',
        takeaway: 'Pratik de norm üretebilir.',
      },
      {
        title: 'Yöntem',
        facts:
          'Öğrenci “halk böyle düşünüyor” der; dayanak yok.',
        analysis:
          'Betimleme iddiası. Yöntem / örnek eksik.',
        takeaway: 'Nasıl biliyoruz sorusunu aç.',
      },
    ],
    mindmap: {
      center: 'Hukuk Sosyolojisi · 1. dönem',
      branches: [
        { label: 'Alan', items: ['Konu', 'Yöntem'] },
        { label: 'Hukuk', items: ['Normatif', 'Fiili'] },
        { label: 'Toplum', items: ['Bilinç', 'Erişim'] },
        { label: 'Kurum', items: ['Mahkeme', 'Aktör'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Uygulama, meslek, meşruiyet ve eleştiri. Hukukun toplumsal sahası.',
    promise:
      'Hukukun uygulanması ve sapma, yargısal davranış, hukuk meslekleri, meşruiyet, hukuki çoğulluk, eleştirel ve çağdaş yaklaşımlar. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Uygulama: takdir, seçicilik, kaynak kısıtı.',
      'Sapma ve suç sosyolojisi girişi: etiketleme, fırsat, kontrol.',
      'Meslekler: avukat, hâkim, savcı — rol ve çıkar.',
      'Meşruiyet: usul, rıza, performans.',
      'Hukuki çoğulluk: birden fazla norm düzeni.',
      'Eleştirel bakış: sınıf, cinsiyet, kültür, güç.',
    ],
    pillars: [
      'Hukukun uygulanması ve sapma',
      'Yargısal karar ve davranış girişi',
      'Hukuk meslekleri sosyolojisi',
      'Meşruiyet ve itaat',
      'Hukuki çoğulluk',
      'Hukuk ve iktisat / siyaset kesişimi (giriş)',
      'Eleştirel yaklaşımlar',
      'Araştırma ve sınav sentezi',
    ],
    definitions: [
      {
        baslik: 'Meşruiyet',
        govde:
          'İktidarın ve hukukun “haklı / kabul edilebilir” görülmesidir. Usulî, rızaya dayalı ve performans temelli boyutları vardır.',
      },
      {
        baslik: 'Hukuki çoğulluk',
        govde:
          'Aynı toplumsal alanda birden fazla normatif düzenin (devlet hukuku, örf, dinî norm, kurumsal kural) birlikte var olmasıdır.',
      },
      {
        baslik: 'Seçici uygulama',
        govde:
          'Normun herkese ve her olaya eşit uygulanmaması; kaynak, öncelik veya güç ilişkilerine göre ayrışmasıdır.',
      },
      {
        baslik: 'Etiketleme',
        govde:
          'Sapma sosyolojisinde, davranışın “suç / sapma” olarak toplumsal olarak işaretlenmesi sürecidir. Yalnız fiil değil, tepki de incelenir.',
      },
      {
        baslik: 'Hukuk mesleği',
        govde:
          'Hukuki bilgi ve yetkiyi mesleki rol olarak taşıyan aktörler bütünüdür. Meslek etiği, çıkar ve kurumsal baskı birlikte okunur.',
      },
    ],
    traps: [
      'Eleştirel yaklaşımı “hukuka düşmanlık” diye karikatürize etmek.',
      'Meşruiyeti yalnız “oy çokluğu”na indirgemek.',
      'Çoğulluğu “devlet hukuku bitti” sanmak.',
      'Meslek eleştirisini kişiselleştirmek — kurumsal analiz yaz.',
      'Suç sosyolojisini tüm hukuk sosyolojisine indirgemek.',
    ],
    keyMadde: [
      'Anayasa m.2 — demokratik hukuk devleti (meşruiyet)',
      'AY m.10 — eşitlik (fiili eşitsizlik tartışması)',
      'CMK / HMK — usul güvenceleri (erişim ve meşruiyet köprüsü)',
      'Avukatlık K. / hâkimlik teminatı (meslek çerçevesi)',
      'İş / ceza / aile özel alanları — uygulama örnekleri (giriş)',
      'Eleştirel hukuk çalışmaları — tez dili (uydurma alıntı yok)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Uygulama ve sapma',
        paragraphs: [
          'Takdir yetkisi, iş yükü, kaynak, siyasi/idari baskı uygulama farkı doğurur. Sapma: norm ihlali + toplumsal tepki.',
          'Sınavda “neden bu kural burada işlemiyor?” sorusuna kurumsal cevap aranır.',
        ],
        hapBilgi: 'Uygulama = kural + kapasite + tercih.',
      },
      {
        heading: 'B. Yargısal davranış girişi',
        paragraphs: [
          'Karar yalnız madde değildir; delil, içtihat, iş yükü, kurum kültürü etki eder. “Hâkim neye bakar?” sosyolojik sorudur; dogmatik gerekçe ayrıdır.',
        ],
        kartlar: [
          { baslik: 'Metin', govde: 'Norm / içtihat.' },
          { baslik: 'Kurum', govde: 'İş yükü / kültür.' },
          { baslik: 'Aktör', govde: 'Rol / çıkar.' },
          { baslik: 'Sonuç', govde: 'Karar dağılımı.' },
        ],
      },
      {
        heading: 'C. Hukuk meslekleri',
        paragraphs: [
          'Avukat–müvekkil, savcı–kamu, hâkim–tarafsızlık idealleri ve gerilimleri. Meslek odaları, disiplin, piyasa baskısı.',
        ],
      },
      {
        heading: 'D. Meşruiyet ve itaat',
        paragraphs: [
          'Neden uyulur? Korku, çıkar, alışkanlık, inanç. Usul adaleti algısı itaati etkiler. Kriz anlarında meşruiyet test edilir.',
        ],
        uyari: 'İtaat ≠ meşruiyet. İkisini ayır.',
      },
      {
        heading: 'E. Hukuki çoğulluk',
        paragraphs: [
          'Devlet hukuku yanında örf, dinî norm, şirket içi regülasyon, dijital platform kuralları. Çatışma, uyum, forum shopping benzeri pratikler.',
        ],
      },
      {
        heading: 'F. Eleştirel yaklaşımlar',
        paragraphs: [
          'Sınıf, cinsiyet, etnisite, sömürgecilik, dil ve güç eleştirileri. Amaç: kör nokta göstermek. Karikatür ve slogan yok; tez + örnek.',
        ],
        hapBilgi: 'Eleştiri = kör nokta + gerekçe, küfür değil.',
      },
      {
        heading: 'G. Sentez ve sınav',
        paragraphs: [
          '1. dönem kavramları 2. dönem örneklerine bağlanır. Her cevapta: olgu → kavram → kurumsal sonuç.',
        ],
      },
    ],
    examples: [
      {
        title: 'Seçici uygulama',
        facts:
          'Aynı kabahat farklı semtlerde farklı sonuç doğurur.',
        analysis:
          'Seçicilik. Kaynak / öncelik / güç. Meşruiyet.',
        takeaway: 'Eşit norm, eşitsiz pratik.',
      },
      {
        title: 'Meslek gerilimi',
        facts:
          'Avukat “kazanmak” ile “doğruyu söylemek” arasında sıkışır.',
        analysis:
          'Rol çatışması. Etik / piyasa. Kurumsal baskı.',
        takeaway: 'Meslek = rol + gerilim.',
      },
      {
        title: 'Çoğulluk',
        facts:
          'Aile uyuşmazlığı hem mahkemede hem cemaat usulünde yürür.',
        analysis:
          'Hukuki çoğulluk. Forum seçimi. Devlet hukuku ilişkisi.',
        takeaway: 'Tek norm varsayma.',
      },
      {
        title: 'Meşruiyet',
        facts:
          'Karar hukuka uygun ama halk “adil değil” der.',
        analysis:
          'Biçimsel geçerlilik ≠ algılanan adalet. Usul adaleti.',
        takeaway: 'İki meşruiyet katmanı.',
      },
    ],
    mindmap: {
      center: 'Hukuk Sosyolojisi · 2. dönem',
      branches: [
        { label: 'Uygulama', items: ['Sapma', 'Seçicilik'] },
        { label: 'Aktör', items: ['Meslek', 'Yargı'] },
        { label: 'Toplum', items: ['Meşruiyet', 'Çoğulluk'] },
        { label: 'Eleştiri', items: ['Güç', 'Eşitsizlik'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Metin–pratik geriliminden meslek, meşruiyet ve eleştiriye tek omurga.',
    promise:
      '1. + 2. dönem birleşik; hukuk sosyolojisi için “tek cilt” not. Toplumda hukukun hayatı.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: kavram/metin-pratik mi, uygulama/meşruiyet mi?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: alan–yöntem → normatif/fiili → bilinç/erişim → uygulama/meslek → çoğulluk/eleştiri → karma.',
          'Her soruda: “Metin mi pratik mi? Kim uyguluyor? Kim erişiyor?”',
        ],
        hapBilgi: 'Yıllık başarı = kavram + olgu + kurumsal sonuç.',
        bullets: [
          'Hafta 1–3: alan + yöntem + normatif/fiili',
          'Hafta 4–6: yaşayan hukuk + bilinç + erişim',
          'Hafta 7–10: uygulama + meslek + meşruiyet',
          'Hafta 11–14: çoğulluk + eleştiri + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Metin/pratik. Tip 2 — Erişim. Tip 3 — Yaşayan hukuk. Tip 4 — Seçici uygulama. Tip 5 — Meslek gerilimi. Tip 6 — Meşruiyet/çoğulluk.',
          'Felsefe notu ölçüt sorar; bu not sahayı yazar. Uydurma istatistik ve alıntı yasak.',
        ],
        uyari: 'Betimlemeyi normatif emir gibi yazma.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Hukuk Sosyolojisi · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Yöntem', 'Fiili hukuk', 'Erişim'] },
        { label: '2. yarı', items: ['Uygulama', 'Meslek', 'Meşruiyet'] },
        { label: 'Yöntem', items: ['Olgu', 'Kavram', 'Sonuç'] },
        { label: 'Köprü', items: ['Felsefe', 'Dogmatik'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'hukuk-sosyolojisi-donem-1': d1Content,
  'hukuk-sosyolojisi-donem-2': d2Content,
  'hukuk-sosyolojisi-yillik': yillikContent,
};

export const HUKUK_SOSYOLOJISI_VARIANTS = [
  'hukuk-sosyolojisi-donem-1',
  'hukuk-sosyolojisi-donem-2',
  'hukuk-sosyolojisi-yillik',
];

export function buildHukukSosyolojisiVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Hukuk Sosyolojisi ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Hukuk Sosyolojisi ${meta.h1Extra}`;
  const description = `${uni.name} için Hukuk Sosyolojisi ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Hukuk Sosyolojisi ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: metin–pratik gerilimini, erişimi ve meşruiyeti sınavda bozmadan yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Hukuk felsefesi ölçüt sorar; bu not sahadaki işleyişi yazar.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her soruda: metin mi pratik mi?',
        'Olgu → kavram → kurumsal sonuç',
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
      paragraphs: ['İşler tanım = kullanım fısıldayan cümle.'],
      kartlar: bank.definitions,
    },
    {
      heading: '5. Pusula dayanaklar / köprüler',
      paragraphs: [
        'Anayasa ve usul metinleri köprüdür; sosyoloji sınavı madde yarışı değildir. Uydurma alıntı ve istatistik yasak.',
      ],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma veri / alıntı yazmayın; tez dilini kullanın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Hukuk Sosyolojisi)',
      paragraphs: [
        `${uni.shortName} klasiklerinde olgu + kavram + sonuç puan getirir. 60 dk / 2–3 soruda planlı yazın.`,
        'İskelet: (1) olgu (2) kavram kutusu (3) kurumsal açıklama (4) meşruiyet/erişim notu (5) sonuç.',
      ],
      bullets: [
        'Metin–pratik ayrımını yaz',
        'Erişim ve seçiciliği unutma',
        'Eleştiriyi karikatürleştirme',
        'Felsefe ile karıştırma',
      ],
      hapBilgi: 'Olgu + kavram = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Hukuk Sosyolojisi ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Olguyu tanımla',
        'Kavram kutusunu seç',
        'Metin / pratik ayır',
        'Kurumsal açıklama',
        'Meşruiyet / erişim',
        'Kısa sonuç',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'hukuk-sosyolojisi-donem-2'
          ? [
              ['Seçici uygulama', 'Yasal istisna', 'Norm mu pratik tercih mi?'],
              ['Meşruiyet', 'Yasal geçerlilik', 'Kabul mü metin mi?'],
              ['Hukuki çoğulluk', 'Kanunsuzluk', 'Başka norm düzeni var mı?'],
              ['Meslek gerilimi', 'Kişisel ahlak', 'Rol / kurum mu birey mi?'],
            ]
          : variantCode === 'hukuk-sosyolojisi-donem-1'
            ? [
                ['Normatif hukuk', 'Fiili hukuk', 'Metin mi sahadaki işleyiş mi?'],
                ['Hukuk sosyolojisi', 'Hukuk felsefesi', 'Olan mı olması gereken mi?'],
                ['Yaşayan hukuk', 'Resmî hukuk', 'Pratik mi kâğıt mı?'],
                ['Hukuk bilinci', 'Hukuk bilgisi', 'Algı/kullanım mı salt bilgi mi?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Kavram mı uygulama/meşruiyet mi?'],
                ['Metin', 'Pratik', 'Ne yazıyor mu ne oluyor mu?'],
                ['Erişim', 'Hak', 'Kullanabilme mi tanınma mı?'],
                ['Felsefe', 'Sosyoloji', 'Ölçüt mü saha mı?'],
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
      leftTitle: 'Kavram / metin–pratik',
      rightTitle: 'Uygulama / meşruiyet',
      left: 'Yöntem–yaşayan hukuk–erişim',
      right: 'Seçicilik–meslek–çoğulluk–eleştiri',
    },
    {
      kind: 'cycle',
      title: 'Haftalık döngü',
      steps: ['Kavram', 'Örnek', 'Kurum', 'Quiz', 'Yanlış defteri'],
    },
  ];

  const faq = [
    {
      q: '1. dönem / 2. dönem / yıllık farkı ne?',
      a: '1. dönem alan–yöntem–normatif/fiili–yaşayan hukuk–bilinç/erişim; 2. dönem uygulama–meslek–meşruiyet–çoğulluk–eleştiri; yıllık ikisini birleştirir.',
    },
    {
      q: 'Hukuk felsefesi notuyla birlikte mi?',
      a: 'Evet. Felsefe ölçüt ve akım dili; sosyoloji saha ve etki dili. Çapraz okuma önerilir.',
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
    'Metin–pratik ayrımını denedim',
    'PDF’i arşivledim',
    variantCode === 'hukuk-sosyolojisi-yillik'
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
      `${uni.shortName} hukuk sosyolojisi ${meta.short}`,
      `${uni.shortName} yaşayan hukuk ders notu`,
      `hukuk sosyolojisi ${meta.short} not pdf`,
      'normatif fiili hukuk hukuk bilinci meşruiyet',
      'hukuk sosyolojisi yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} hukuk sosyolojisi`),
      'ücretsiz hukuk ders notu',
    ],
    lead,
    promise: bank.promise,
    sixtySecond: bank.sixtySecond,
    examBox: {
      calendar: uni.calendar,
      typicalWeights: 'Ara sınav ~%30–40 · Final ~%50–60 (yönetmeliğe göre)',
      format: uni.type === 'vakif' ? 'Klasik + ara; ödev/anket olabilir' : 'Klasik yazılı + vaka analizi',
      tips: [
        'Metin–pratik ayrımını yaz',
        'Olguya kavram bağla',
        'Erişim ve seçiciliği unutma',
        'Eleştiriyi gerekçeli yaz',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Hukuk sosyolojisi ${meta.short} kavramlarını ayırır`,
      'Normatif–fiili hukuk gerilimini kurar',
      'Erişim, uygulama ve meşruiyeti yazar',
      'Meslek ve çoğulluk dilini kullanır',
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
    relatedCourses: HUKUK_SOSYOLOJISI_VARIANTS.filter((c) => c !== variantCode).concat([
      'hukuk-sosyolojisi',
      'hukuk-felsefesi-yillik',
      'hukuka-giris-yillik',
      'anayasa-yillik',
    ]),
    relatedBilgi: [],
    updated: '2026-07-30',
    wordTarget: variantCode === 'hukuk-sosyolojisi-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'hukuk-sosyolojisi',
    variantLabel: meta.label,
  };
}
