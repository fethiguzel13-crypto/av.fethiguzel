/**
 * Ticari İşletme Hukuku (TTK I. Kitap) —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * ticari-isletme dersiyle hizalı.
 */

function baseMeta(variant) {
  const labels = {
    'ticari-isletme-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'TTK Ticari İşletme · 1. yarı (işletme, tacir, unvan, sicil, ticari iş, haksız rekabet girişi)',
    },
    'ticari-isletme-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'TTK Ticari İşletme · 2. yarı (defterler, cari hesap, acente–komisyoncu, ticari vekil, devir, faiz)',
    },
    'ticari-isletme-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope: 'Ticari işletme hukuku tam omurga · tacir + sicil + yardımcı kişiler · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Ticari işletme ve tacir. Kim tacirdir, unvanı nedir, sicile ne yazılır?',
    promise:
      'Ticari işletme kavramı, tacir sıfatı, ticaret unvanı, işletme adı, ticaret sicili, ticari iş ve hükümler, haksız rekabet girişi. Güz finalinde tacir/işletme ayrımı bozulmadan yazarsınız.',
    sixtySecond: [
      'Ticari işletme: gelir sağlamak amacıyla yürütülen faaliyetler bütünü.',
      'Tacir: ticari işletmeyi kısmen de olsa kendi adına işleten.',
      'Tacir sıfatı hak ve borç (defter, unvan, iflasa tabi olma) doğurur.',
      'Ticaret unvanı sicile tescil edilir; koruma tescille güçlenir.',
      'Ticari iş karinesi ve ticari hükümler uyuşmazlıkta uygulanır.',
      'Haksız rekabet: dürüstlük dışı rekabet fiilleri (giriş).',
    ],
    pillars: [
      'Ticaret hukukunun kapsamı',
      'Ticari işletme',
      'Tacir ve tacir sayılanlar',
      'Tacir olmanın sonuçları',
      'Ticaret unvanı ve işletme adı',
      'Ticaret sicili',
      'Ticari iş ve ticari hükümler',
      'Haksız rekabet girişi',
    ],
    definitions: [
      {
        baslik: 'Ticari işletme',
        govde:
          'Esnaf işletmesi için öngörülen sınırı aşan düzeyde gelir sağlamayı hedefleyen faaliyetlerin devamlı ve bağımsız şekilde yürütüldüğü işletmedir (TTK çerçevesi).',
      },
      {
        baslik: 'Tacir',
        govde:
          'Bir ticari işletmeyi, kısmen de olsa, kendi adına işleten kişidir. Gerçek ve tüzel kişi tacir ayrımı vardır.',
      },
      {
        baslik: 'Ticaret unvanı',
        govde:
          'Tacirin ticari işletmesiyle ilgili iş ve işlemlerinde kullandığı addır. Tescil ve koruma rejimine tabidir.',
      },
      {
        baslik: 'Ticaret sicili',
        govde:
          'Ticari işletme ve tacire ilişkin hukuki durumların aleniyet kazandığı resmî kayıttır. Tescil ve ilanın üçüncü kişilere etkisi kritiktir.',
      },
      {
        baslik: 'Ticari iş',
        govde:
          'TTK’da ticari sayılan veya tacirler arasındaki karineyle ticari kabul edilen işlerdir. Faiz, ispat ve zamanaşımı sonuçları doğurabilir.',
      },
    ],
    traps: [
      'Esnaf ile taciri karıştırmak.',
      'Unvan ile işletme adını aynı sanmak.',
      'Tescili “sadece formalite” yazmak — aleniyet ve iyiniyet etkisi.',
      'Tacir sıfatını yalnız “dükkân sahibi”ne indirgemek.',
      'Haksız rekabeti sadece “marka taklidi” sanmak — daha geniştir.',
    ],
    keyMadde: [
      'TTK m.11 vd. — ticari işletme (çerçeve)',
      'TTK m.12 vd. — tacir (çerçeve)',
      'TTK m.18 vd. — tacir olmanın sonuçları (çerçeve)',
      'TTK m.39 vd. — ticaret unvanı (çerçeve)',
      'TTK m.24 vd. — ticaret sicili (çerçeve)',
      'TTK m.19 — ticari iş (çerçeve)',
      'TTK m.54 vd. — haksız rekabet (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Ticari işletme hukuku nedir?',
        paragraphs: [
          'TTK’nın birinci kitabı ticari işletmeyi, taciri ve ticari hayata özgü kurumları düzenler. Şirketler ve kıymetli evrak ayrı kitaplardadır; burası “kim tacir, işletme nasıl görünür?” sorusunun yeridir.',
          '1. dönem kavram ve sicil omurgasını taşır. Defterler, yardımcı kişiler ve cari hesap 2. döneme kalır.',
        ],
        hapBilgi: 'İşletme + tacir + unvan/sicil = 1. dönem üçgeni.',
      },
      {
        heading: 'B. Ticari işletme',
        paragraphs: [
          'Devamlılık, bağımsızlık ve gelir amacı unsurları tartışılır. Esnaf işletmesi sınırı, tacir sıfatının kapısını açar veya kapatır.',
          'İşletmenin devri 2. dönemde derinleşir; 1. dönemde kavram ve unsur bilinir.',
        ],
        bullets: ['Tanım unsurları', 'Esnaf sınırı', 'Bağımsızlık', 'Devamlılık'],
      },
      {
        heading: 'C. Tacir sıfatı',
        paragraphs: [
          'Kendi adına işletme işleten gerçek kişi, ticaret şirketleri ve bazı tüzel kişiler tacirdir. Tacir gibi sorumlu olanlar (işletmeyi kendi adına işleten izlenimi) sınav klasikidir.',
          'Küçük, kısıtlı ve evli kişilerde temsil/izin kuralları bağlanır (kişiler/aile köprüsü).',
        ],
        kartlar: [
          { baslik: 'Gerçek kişi', govde: 'Kendi adına işletir.' },
          { baslik: 'Tüzel kişi', govde: 'Ticaret şirketleri vb.' },
          { baslik: 'Tacir gibi', govde: 'Görünüş sorumluluğu.' },
          { baslik: 'Sonuç', govde: 'Defter, unvan, iflas…' },
        ],
        uyari: 'Tacir sıfatı = hak + yükümlülük paketi.',
      },
      {
        heading: 'D. Tacir olmanın sonuçları',
        paragraphs: [
          'Basiretli iş adamı gibi davranma, ticaret unvanı kullanma, defter tutma, basiret ve özen, iflasa tabi olma (işletme/tür çerçevesinde), ticari örf gibi sonuçlar yazılır.',
          'Sınavda “hangi sonuç bu olaya bağlanır?” diye seçici olun.',
        ],
      },
      {
        heading: 'E. Unvan, işletme adı, sicil',
        paragraphs: [
          'Ticaret unvanı taciri; işletme adı işletmeyi tanıtır. Tescil ve ilan aleniyet sağlar; iyiniyetli üçüncü kişi koruması sicil hukukuyla bağlanır.',
          'Unvanın devri ve korunması haksız rekabetle kesişir.',
        ],
        hapBilgi: 'Unvan = tacir kimliği. Sicil = aleniyet.',
      },
      {
        heading: 'F. Ticari iş ve ticari hükümler',
        paragraphs: [
          'Bir işin ticari sayılması faiz, ispat ve bazı zamanaşımı/uygulama kurallarını etkiler. Tacirler arası karine ve istisnalar yazılır.',
          'TBK ile TTK çatışmasında ticari hükümlerin önceliği olay tipine göre tartışılır.',
        ],
      },
      {
        heading: 'G. Haksız rekabet girişi',
        paragraphs: [
          'Dürüstlük kuralına aykırı rekabet fiilleri haksız rekabettir. Aldatıcı reklam, karıştırma, sır ihlali tipik örneklerdir. Dava ve tedbir 2. dönemle bağlanır; 1. dönemde tanım + tipoloji yeterlidir.',
        ],
      },
    ],
    examples: [
      {
        title: 'Tacir mi esnaf mı?',
        facts:
          'Küçük bir atölye işleten kişi “esnaftım, defter tutmam” der; alacaklı tacir sonuçları ister.',
        analysis:
          'Ticari işletme eşiği. Esnaf sınırı. Tacir sıfatı ve sonuçları.',
        takeaway: 'Eşik = tacir paketi açılır mı?',
      },
      {
        title: 'Unvan–işletme adı',
        facts:
          'İşletme “Yıldız Market” tabelası kullanır; unvan farklıdır. Üçüncü kişi karışır.',
        analysis:
          'Unvan vs işletme adı. Tescil. Haksız rekabet / karıştırma.',
        takeaway: 'İki ad, iki işlev.',
      },
      {
        title: 'Sicile güven',
        facts:
          'Sicilde yetkili görünen kişiyle sözleşme yapılır; yetki sonradan tartışılır.',
        analysis:
          'Tescil ve ilan. İyiniyet. Temsil yetkisi (2. dönem köprüsü).',
        takeaway: 'Sicil aleniyeti + iyiniyet.',
      },
      {
        title: 'Ticari iş',
        facts:
          'İki tacir arasındaki satışta faiz ve ispat kuralları tartışılır.',
        analysis:
          'Ticari iş karinesi. Ticari hükümler. TBK ilişkisi.',
        takeaway: 'İş ticari mi? Sonuç yaz.',
      },
    ],
    mindmap: {
      center: 'Ticari İşletme · 1. dönem',
      branches: [
        { label: 'İşletme', items: ['Tanım', 'Esnaf sınırı'] },
        { label: 'Tacir', items: ['Sıfat', 'Sonuçlar'] },
        { label: 'Kimlik', items: ['Unvan', 'Sicil'] },
        { label: 'İş', items: ['Ticari iş', 'Haksız rekabet'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Defterler, cari hesap, acente–komisyoncu, ticari vekil, işletme devri. İşletmenin işleyişi.',
    promise:
      'Ticari defterler, cari hesap, acentelik, komisyonculuk, tellallık, ticari mümessil/vekil, işletmenin devri, ticari faiz. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Defter tutma tacirin borcudur; ispat ve cezaî/idarî sonuçlar bağlanır.',
      'Cari hesap: karşılıklı alacakların tek hesapta birleşmesi.',
      'Acente: sürekli aracılık / sözleşme yapma yetkisi (çerçeve).',
      'Komisyoncu: kendi adına başkası hesabına.',
      'Ticari vekil / mümessil: temsil yetkisi ve sınırları.',
      'İşletme devri: aktif–pasif geçişi ve alacaklı koruması.',
    ],
    pillars: [
      'Ticari defterler',
      'Cari hesap',
      'Acentelik',
      'Komisyonculuk ve tellallık',
      'Ticari mümessil ve ticari vekil',
      'Ticari işletmenin devri',
      'Ticari faiz',
      'Haksız rekabet derinleştirme (dava/yaptırım)',
    ],
    definitions: [
      {
        baslik: 'Ticari defterler',
        govde:
          'Tacirin tutmakla yükümlü olduğu yevmiye, envanter ve defter-i kebir gibi kayıtlardır. Usulüne uygunluk ispat gücünü etkiler.',
      },
      {
        baslik: 'Cari hesap',
        govde:
          'İki kişinin para, mal, hizmet ve diğer hususlardan doğan alacaklarını devre sonlarında mahsup ederek bakiyeyi belirledikleri sözleşmedir.',
      },
      {
        baslik: 'Acente',
        govde:
          'Bir sözleşmeyi sürekli olarak bir tacir hesabına yapmayı veya aracılığı meslek edinen kişidir. Yetki ve ücret rejimi TTK’da özeldir.',
      },
      {
        baslik: 'Komisyoncu',
        govde:
          'Ücret karşılığında kendi adına ve müvekkili hesabına kıymetli evrak ve taşınır alım satımıyla uğraşan kişidir (çerçeve).',
      },
      {
        baslik: 'Ticari işletmenin devri',
        govde:
          'İşletmenin malvarlığı unsurlarıyla bir bütün olarak devridir. Borçların geçişi ve alacaklılara karşı sorumluluk özel kurallara tabidir.',
      },
    ],
    traps: [
      'Acente ile komisyoncu rolünü karıştırmak (kimin adına?).',
      'Ticari vekilin yetkisini “her şeyi yapar” sanmak — sınırlar vardır.',
      'İşletme devrinde alacaklı korumasını unutmak.',
      'Defterleri yalnız “vergi belgesi” sanmak — ispat etkisi de vardır.',
      'Cari hesabı basit alacak listesi sanmak — mahsup ve bakiye rejimi.',
    ],
    keyMadde: [
      'TTK m.64 vd. — ticari defterler (çerçeve)',
      'TTK m.89 vd. — cari hesap (çerçeve)',
      'TTK m.102 vd. — acentelik (çerçeve)',
      'TTK m.532 vd. civarı / komisyon (çerçeve — güncel başlık)',
      'TTK m.547 vd. — ticari vekil / mümessil (çerçeve)',
      'TTK m.11/3, m.202 vd. bağlantılı — işletme devri (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Ticari defterler',
        paragraphs: [
          'Defter tutma borcu, açılış/kapanış onayları ve saklama süreleri bilinir. Usulüne uygun defterlerin ispat gücü yüksektir; aykırılık ispat ve yaptırım doğurur.',
          'Elektronik defter uygulaması giriş düzeyinde tanınır.',
        ],
        hapBilgi: 'Defter = yükümlülük + ispat aracı.',
      },
      {
        heading: 'B. Cari hesap',
        paragraphs: [
          'Karşılıklı alacaklar devre sonunda mahsup edilir; bakiye tek alacak/borç hâline gelir. Faiz, haciz ve devir özel kurallara bağlanabilir.',
          'Sınavda “tek tek alacak mı bakiye mi?” sorusu cevap iskeletini belirler.',
        ],
        bullets: ['Kuruluş', 'Devre', 'Mahsup', 'Bakiye'],
      },
      {
        heading: 'C. Acente',
        paragraphs: [
          'Sürekli aracılık veya sözleşme yapma yetkisi acenteliğin omurgasıdır. Ücret, rekabet yasağı, denkleştirme (portföy tazminatı) ve sona erme bilinir.',
          'Acentenin temsili, müvekkili bağlar; yetki aşımı iyiniyet kurallarıyla tartılır.',
        ],
        kartlar: [
          { baslik: 'Yetki', govde: 'Aracılık / yapma.' },
          { baslik: 'Ücret', govde: 'Komisyon.' },
          { baslik: 'Rekabet', govde: 'Yasak / sınır.' },
          { baslik: 'Denkleştirme', govde: 'Sona ermede.' },
        ],
      },
      {
        heading: 'D. Komisyoncu ve tellal',
        paragraphs: [
          'Komisyoncu kendi adına müvekkil hesabına hareket eder; tellal aracılıkla sınırlıdır. Ücret ve sorumluluk farkı yazılır.',
          'Kıymetli evrak dersiyle kesişim: komisyon konusu sıklıkla senet/mal alım satımıdır.',
        ],
        uyari: 'Kimin adına? Acente/komisyoncu ayrımının anahtarı.',
      },
      {
        heading: 'E. Ticari mümessil ve ticari vekil',
        paragraphs: [
          'Ticari mümessil geniş temsil yetkisine; ticari vekil daha sınırlı yetkiye sahiptir (çerçeve). Yetki sınırının üçüncü kişilere etkisi sicil/ilan ve bilinebilirlikle bağlanır.',
          'Sınavda “bu işlem yetki içinde mi?” diye sorun.',
        ],
      },
      {
        heading: 'F. Ticari işletmenin devri',
        paragraphs: [
          'Devirle aktif ve kural olarak işletmeye bağlı pasifler geçer; alacaklılara karşı müteselsil sorumluluk süreleri vardır (güncel madde).',
          'Unvanın devri, rekabet yasağı ve işçi hakları kesişim kutularıdır.',
        ],
        hapBilgi: 'Devir = bütün + alacaklı koruması.',
      },
      {
        heading: 'G. Ticari faiz ve haksız rekabet derinliği',
        paragraphs: [
          'Ticari işlerde faiz oranı ve işlemiş faiz kuralları TBK’dan farklılaşabilir. Haksız rekabette men, maddi-manevi tazminat ve tedbir iskeleti tamamlanır.',
        ],
      },
    ],
    examples: [
      {
        title: 'Acente denkleştirme',
        facts:
          'Uzun yıllar portföy oluşturan acentenin sözleşmesi feshedilir; denkleştirme ister.',
        analysis:
          'Acentelik sona erme. Denkleştirme şartları. Hesap iskeleti.',
        takeaway: 'Portföy emeği = denkleştirme kutusu.',
      },
      {
        title: 'Yetki aşımı',
        facts:
          'Ticari vekil, yetki belgesinde olmayan büyük bir satışı imzalar; karşı taraf sicile güvenmiştir.',
        analysis:
          'Yetki türü. Sınır. Üçüncü kişi iyiniyeti. Bağlanma.',
        takeaway: 'Yetki + görünüş + iyiniyet.',
      },
      {
        title: 'İşletme devri – borç',
        facts:
          'İşletme devredilir; eski borç için alacaklı yeni işletmeciyi de takip eder.',
        analysis:
          'Pasiflerin geçişi. Müteselsil sorumluluk süresi. İhbar.',
        takeaway: 'Devir alacaklıyı korur.',
      },
      {
        title: 'Cari hesap bakiyesi',
        facts:
          'Taraflar tek tek faturaları dava konusu eder; karşı taraf cari hesap savunması yapar.',
        analysis:
          'Cari hesap var mı? Mahsup. Bakiye alacağı. Haciz/devir.',
        takeaway: 'Bakiye mi tek alacak mı?',
      },
    ],
    mindmap: {
      center: 'Ticari İşletme · 2. dönem',
      branches: [
        { label: 'Kayıt', items: ['Defter', 'Cari hesap'] },
        { label: 'Yardımcı', items: ['Acente', 'Komisyon', 'Vekil'] },
        { label: 'Devir', items: ['Aktif', 'Pasif'] },
        { label: 'Sonuç', items: ['Faiz', 'Haksız rekabet'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Tacir ve sicilden acente, defter ve işletme devrine kadar tek omurga.',
    promise:
      '1. + 2. dönem birleşik; ticari işletme hukuku için “tek cilt” not.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: tacir/sicil mi, yardımcı kişi/devir mi?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 4), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: işletme–tacir–unvan–sicil → deneme → defter–acente–devir → karma.',
          'Her soruda etiket: “Tacir sıfatı mı, temsil mi, devir mi?”',
        ],
        hapBilgi: 'Yıllık başarı = doğru sıfat + doğru kurum.',
        bullets: [
          'Hafta 1–3: işletme + tacir + sonuçlar',
          'Hafta 4–6: unvan + sicil + ticari iş',
          'Hafta 7–10: defter + cari hesap + acente/vekil',
          'Hafta 11–14: devir + faiz + haksız rekabet + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon',
        paragraphs: [
          'Tip 1 — Tacir/esnaf. Tip 2 — Unvan. Tip 3 — Sicil. Tip 4 — Acente. Tip 5 — Yetki aşımı. Tip 6 — İşletme devri.',
          'Karma olayda tacir sıfatı + acente yetkisi üst üste binebilir. Sıra: kim tacir → kim temsilci → işlem bağlar mı?',
        ],
        uyari: 'Şirketler hukuku organ sorusunu bu notta zorlamayın; şirketler triple’ına geçin.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Ticari İşletme · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Tacir', 'Unvan', 'Sicil'] },
        { label: '2. yarı', items: ['Defter', 'Acente', 'Devir'] },
        { label: 'İş', items: ['Ticari iş', 'Faiz'] },
        { label: 'Yöntem', items: ['Sıfat seç', 'Yetki yaz'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'ticari-isletme-donem-1': d1Content,
  'ticari-isletme-donem-2': d2Content,
  'ticari-isletme-yillik': yillikContent,
};

export const TICARI_ISLETME_VARIANTS = [
  'ticari-isletme-donem-1',
  'ticari-isletme-donem-2',
  'ticari-isletme-yillik',
];

export function buildTicariIsletmeVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Ticari İşletme ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Ticari İşletme Hukuku ${meta.h1Extra}`;
  const description = `${uni.name} için Ticari İşletme Hukuku ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Ticari İşletme Hukuku ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: tacir sıfatını, sicil/unvanı ve yardımcı kişi–devir rejimini doğru yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Şirket organları için şirketler triple notuna bakın.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek olay → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda: tacir mi, esnaf mı?',
        'Acente / komisyoncu: kimin adına?',
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
      paragraphs: ['Soru tipine göre dayanaklar. Güncel metin: TTK I. Kitap.'],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma madde no yazmayın; TTK metninden doğrulayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Ticari İşletme)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık şart. 60 dk / 3 soruda soru başı ~18 dk.`,
        'İskelet: (1) sıfat (tacir/işletme) (2) kurum (unvan/sicil/acente…) (3) şart (4) olgu (5) sonuç.',
      ],
      bullets: [
        'Tacir sıfatını ilk yaz',
        'Unvan ≠ işletme adı',
        'Temsilde kimin adına?',
        'Devirde alacaklı korumasını aç',
      ],
      hapBilgi: 'Doğru sıfat + doğru kurum = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Ticari İşletme ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Tacir / işletme sıfatı',
        'Kurumu seç',
        'Kanuni şart listesi',
        'Olayı yedir',
        'Üçüncü kişi / sicil notu',
        'Sonuç',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'ticari-isletme-donem-2'
          ? [
              ['Acente', 'Komisyoncu', 'Başkası adına mı kendi adına mı?'],
              ['Ticari mümessil', 'Ticari vekil', 'Yetki geniş mi dar mı?'],
              ['Cari hesap bakiyesi', 'Tek alacak', 'Mahsup sonrası mı ayrı mı?'],
              ['İşletme devri', 'Mal satışı', 'Bütün mü tek mal mı?'],
            ]
          : variantCode === 'ticari-isletme-donem-1'
            ? [
                ['Tacir', 'Esnaf', 'Ticari işletme eşiği aşıldı mı?'],
                ['Ticaret unvanı', 'İşletme adı', 'Taciri mi işletmeyi mi tanıtır?'],
                ['Tescil', 'İlan', 'Kayıt mı duyuru mu?'],
                ['Ticari iş', 'Adi iş', 'Ticari hüküm uygulanır mı?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Sıfat/sicil mi yardımcı/devir mi?'],
                ['Tacir', 'Esnaf', 'Eşik aşıldı mı?'],
                ['Acente', 'Vekil', 'Sürekli aracılık mı sınırlı temsil mi?'],
                ['Unvan', 'Sicil', 'Ad mı aleniyet kaydı mı?'],
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
      leftTitle: 'Sıfat / sicil',
      rightTitle: 'İşleyiş / devir',
      left: 'İşletme + tacir + unvan + sicil + ticari iş',
      right: 'Defter + acente/vekil + cari hesap + devir',
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
      a: '1. dönem işletme–tacir–unvan–sicil–ticari iş; 2. dönem defter–cari hesap–acente/vekil–devir; yıllık ikisini birleştirir.',
    },
    {
      q: 'Şirketler hukukuyla farkı ne?',
      a: 'Bu not ticari işletme ve tacir omurgasıdır. AŞ/limited organları için şirketler triple notunu kullanın.',
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
    variantCode === 'ticari-isletme-yillik'
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
      `${uni.shortName} ticari işletme ${meta.short}`,
      `${uni.shortName} ticari işletme hukuku ders notu`,
      `ticari işletme ${meta.short} not pdf`,
      'tacir ticaret unvanı sicil acente ders notu',
      'ticari işletme yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} ticari işletme`),
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
        'Tacir sıfatını ilk yaz',
        'Unvan / işletme adı ayır',
        'Temsilde kimin adına sor',
        'Devirde alacaklıyı unutma',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Ticari İşletme ${meta.short} kapsamındaki kurumları ayırır`,
      'Tacir sıfatı ve sonuçlarını uygular',
      'Sicil, unvan ve ticari iş rejimini kurar',
      'Acente/vekil ve işletme devri iskeletini yazar',
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
    relatedCourses: TICARI_ISLETME_VARIANTS.filter((c) => c !== variantCode).concat([
      'ticari-isletme',
      'sirketler-yillik',
      'kiymetli-evrak-donem-1',
    ]),
    relatedBilgi: [],
    updated: '2026-07-29',
    wordTarget: variantCode === 'ticari-isletme-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'ticari-isletme',
    variantLabel: meta.label,
  };
}
