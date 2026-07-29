/**
 * TMK 1. Kitap (Başlangıç Hükümleri + Kişiler Hukuku) —
 * 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * Pedagojik yarıyıl bölünmesi; medeni-baslangic dersiyle hizalı.
 */

function baseMeta(variant) {
  const labels = {
    'tmk-1-kitap-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'TMK Başlangıç + Gerçek kişiler · 1. yarı (m.1–7, kişilik, hak/fiil ehliyeti, hısımlık, yerleşim yeri)',
    },
    'tmk-1-kitap-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'TMK Kişiler · 2. yarı (kişilik hakkı, ad, sicil, koruma, vesayet/kayyım girişi, tüzel kişiler: dernek–vakıf)',
    },
    'tmk-1-kitap-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope:
        'TMK 1. Kitap tam omurga · başlangıç hükümleri + gerçek/tüzel kişiler · dönemlik + yıllık program',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Hukuku uygula, dürüst ol, iyiniyeti koru; kim hak öznesi, kim fiilen işlem yapabilir?',
    promise:
      'TMK m.1–7, kişilik, hak ehliyeti, fiil ehliyeti basamakları, hısımlık ve yerleşim yeri. Güz finalinde matris bozulmadan yazarsınız.',
    sixtySecond: [
      'TMK m.1: kanun → örf → hâkim hukuku yaratır (sınırlı).',
      'm.2: dürüstlük + hakkın kötüye kullanılması yasağı.',
      'm.3: iyiniyet — bilmeme + bilmesi gerekmeme; ağır ihmal kırar.',
      'm.6: iddia eden ispatlar (kural).',
      'Hak ehliyeti herkese; fiil ehliyeti basamaklı (ayırt etme + erginlik + kısıtlı olmama).',
      'Cevap: kural → istisna → olaya yedir → sonuç.',
    ],
    pillars: [
      'Hukukun uygulanması ve yorum (TMK m.1)',
      'Dürüstlük kuralı ve hakkın kötüye kullanılması (m.2)',
      'İyiniyet (m.3) ve ispat (m.6)',
      'Kişi ve kişilik kavramı',
      'Hak ehliyeti',
      'Fiil ehliyeti basamakları',
      'Hısımlık',
      'Yerleşim yeri',
    ],
    definitions: [
      {
        baslik: 'Dürüstlük kuralı',
        govde:
          'Haklar kullanılırken ve borçlar ifa edilirken dürüstlük kuralına uyulur (TMK m.2/1). Hakkın açıkça kötüye kullanılması hukuk düzenince korunmaz (m.2/2).',
      },
      {
        baslik: 'İyiniyet',
        govde:
          'Durumun gerektirdiği özeni gösteren kişinin bir olguyu bilmemesi veya bilmesinin gerekmemesidir. Karine lehine işler; ağır ihmal iyiniyeti düşürebilir.',
      },
      {
        baslik: 'Hak ehliyeti',
        govde:
          'Haklara ve borçlara sahip olabilme iktidarıdır. Herkes hak ehliyetine sahiptir; başlangıç ve sona erme kişilikle bağlıdır.',
      },
      {
        baslik: 'Fiil ehliyeti',
        govde:
          'Kişinin bizzat haklarını kullanıp borç altına girebilme iktidarıdır. Ayırt etme gücü, erginlik ve kısıtlı olmama basamakları birlikte okunur.',
      },
      {
        baslik: 'Yerleşim yeri',
        govde:
          'Bir kimsenin sürekli kalma niyetiyle oturduğu yerdir. Hukuki ilişkilerde yetki, tebligat ve bağlama noktası işlevi görür.',
      },
    ],
    traps: [
      'Şekil geçerliğini “her zaman hukuki koruma” sanmak (m.2).',
      'İyiniyeti “hiç bilmemek” sanmak — bilmesi gerekirdi mi?',
      'Küçüğün yaptığı her işlemi otomatik yok saymak — işlem türü ve onay matrisi.',
      'Hak ehliyeti ile fiil ehliyetini karıştırmak.',
      'Yerleşim yerini “şu an neredeyse orası” sanmak — niyet + süreklilik.',
    ],
    keyMadde: [
      'TMK m.1 — hukukun uygulanması',
      'TMK m.2 — dürüstlük / hakkın kötüye kullanılması',
      'TMK m.3 — iyiniyet',
      'TMK m.6 — ispat yükü',
      'TMK m.8 vd. — hak ehliyeti / kişilik çerçevesi',
      'TMK m.9–16 — fiil ehliyeti basamakları (çerçeve)',
      'TMK m.19 vd. — yerleşim yeri',
      'TMK m.17 vd. — hısımlık (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. TMK 1. Kitap nedir?',
        paragraphs: [
          'Türk Medenî Kanunu’nun birinci kitabı kişiler hukukudur; başında başlangıç hükümleri (m.1–7) tüm medeni hukuka ışık tutar. Sınav ve uygulamada “önce başlangıç, sonra ehliyet” sırası çoğu soruyu çözer.',
          'Bu 1. dönem notu başlangıç + gerçek kişilerin ehliyet omurgasını taşır. Kişilik hakkı derinliği, sicil, vesayet girişi ve tüzel kişiler 2. döneme kalır.',
        ],
        hapBilgi: 'Başlangıç = her medeni sorunun arka planı; ehliyet = işlem geçerliliğinin kapısı.',
      },
      {
        heading: 'B. Hukukun uygulanması (m.1)',
        paragraphs: [
          'Hâkim, kanunu sözü ve özüyle uygular. Kanunda hüküm yoksa örf ve âdet; o da yoksa kendisi kanun koyucu gibi kural koyar — ama bu serbest icat değil, hukuk yaratma disiplinidir.',
          'Yorumda lafzî, sistematik, amaca uygun okuma birlikte kullanılır. Sınavda “m.1’i ezber slogan” yerine somut boşluğu nasıl doldurduğunuzu yazın.',
        ],
        bullets: [
          'Kanun (söz + öz)',
          'Örf ve âdet',
          'Hâkimin hukuk yaratması (sınırlı)',
          'Yorum yöntemleri',
        ],
      },
      {
        heading: 'C. Dürüstlük ve hakkın kötüye kullanılması (m.2)',
        paragraphs: [
          'm.2/1 olumlu ödevdir: hak kullanılırken dürüst davran. m.2/2 olumsuz sınırdır: hakkın açıkça kötüye kullanılması korunmaz. Şeklen geçerli bir işlem veya dava yolu, amaca aykırı ve oransızsa m.2 devreye girebilir.',
          'Klasik sınav tuzağı: “Şekil tamam, o hâlde her şey serbest.” Hayır — m.2 şeklin üstünde güvenlik vanasıdır.',
        ],
        kartlar: [
          { baslik: 'm.2/1', govde: 'Dürüstlük ödevi.' },
          { baslik: 'm.2/2', govde: 'Açık kötüye kullanma → koruma yok.' },
          { baslik: 'Ölçüt', govde: 'Amaç, oran, dürüstlük.' },
        ],
        uyari: 'Şekil geçerliği ≠ mutlak hukuki koruma.',
      },
      {
        heading: 'D. İyiniyet (m.3) ve ispat (m.6)',
        paragraphs: [
          'İyiniyet, gereken özeni gösteren kişinin bilmemesi / bilmesi gerekmemesidir. Karine iyiniyet lehinedir; iddia eden aksini ispatlar. Ağır ihmal iyiniyeti kırar.',
          'm.6: kural olarak iddia eden ispat eder. Karine ve ispat yükü kaydıran özel hükümler (sicile güven vb.) olayda ayrıca yazılır.',
        ],
        hapBilgi: 'İyiniyet = bilmeme + bilmesi gerekmeme. İspat = iddia eden (kural).',
      },
      {
        heading: 'E. Kişi, kişilik, hak ehliyeti',
        paragraphs: [
          'Kişi hak öznesidir. Kişilik, hak ehliyetinin taşıyıcısıdır; başlangıç ve sona erme (doğum–ölüm, gaiplik çerçevesi) ayrı incelenir.',
          'Hak ehliyeti herkese aittir. “Hak ehliyeti yok” demek ile “fiil ehliyeti kısıtlı” demek tamamen farklıdır — sınavda kelimeyi seçin.',
        ],
      },
      {
        heading: 'F. Fiil ehliyeti basamakları',
        paragraphs: [
          'Fiil ehliyeti için kural olarak: ayırt etme gücü + erginlik + kısıtlı olmama. Ayırt etme gücünden yoksun olanın fiil ehliyeti yoktur. Ayırt etme gücüne sahip küçük ve kısıtlıların işlemleri türe göre geçerlilik / onay rejimine girer.',
          'İşlem türü matrisi zorunludur: sırf hak kazandıran, karşılıksız kazandırma, önemli tasarruf, bizzat yapılabilecek işlemler… Otomatik “küçük = her şey batıl” yazmayın.',
        ],
        bullets: [
          'Ayırt etme gücü',
          'Erginlik / yasal erginlik',
          'Kısıtlı olmama',
          'İşlem türüne göre sonuç',
          'Yasal temsilci onayı',
        ],
        uyari: 'Ehliyet matrisi çizilmeden cevap yazılmaz.',
      },
      {
        heading: 'G. Hısımlık ve yerleşim yeri',
        paragraphs: [
          'Hısımlık (kan hısımlığı, kayın hısımlığı) aile ve miras bağlantılarında bağlama noktasıdır. Derece hesabı olay sorusunda istenir.',
          'Yerleşim yeri sürekli kalma niyetiyle oturulan yerdir. Birden fazla oturma yeri / işyeri senaryolarında kanuni karineler ve niyet yazılır. Tebligat ve yetki ile karıştırılmamalı; bağlantı kurulabilir.',
        ],
      },
    ],
    examples: [
      {
        title: 'Dürüstlük kuralı',
        facts:
          'Alacaklı, borçlunun zayıf anını bilerek şeklen geçerli fakat hakkın amacına aykırı bir yola başvurur.',
        analysis:
          'TMK m.2: şekil geçerliği tek başına yetmez; açık kötüye kullanma korunmaz. Amaç–araç oransızlığı yazılır.',
        takeaway: 'Şekil ≠ her zaman koruma.',
      },
      {
        title: 'İyiniyet',
        facts:
          'Üçüncü kişi, kolayca öğrenilebilecek bir engeli araştırmadan işlem yapar; “iyiniyetliyim” der.',
        analysis:
          'm.3: bilmeme yetmez; bilmesi gerekir miydi? Ağır ihmal. Karine ve ispat.',
        takeaway: '“Bilmeme + bilmesi gerekmeme”.',
      },
      {
        title: 'Fiil ehliyeti — küçük',
        facts:
          '15 yaşındaki ayırt etme gücüne sahip küçük, tek başına önemli bir taşınmaz satım vaadi imzalar.',
        analysis:
          'Ehliyet basamağı + işlem türü + yasal temsilci onayı. Sonuç türe göre değişir.',
        takeaway: 'Matris: ehliyet × işlem türü.',
      },
      {
        title: 'Yerleşim yeri',
        facts:
          'Kişi hafta içi A şehrinde çalışır, hafta sonu B’de ailesiyle kalır; tebligat ve yetki tartışılır.',
        analysis:
          'Sürekli kalma niyeti, kanuni karineler, fiilî durum. “Şu an neredeyse orası” yetmez.',
        takeaway: 'Niyet + süreklilik.',
      },
    ],
    mindmap: {
      center: 'TMK 1. Kitap · 1. dönem',
      branches: [
        { label: 'Başlangıç', items: ['m.1', 'm.2', 'm.3', 'm.6'] },
        { label: 'Ehliyet', items: ['Hak', 'Fiil', 'Basamak'] },
        { label: 'Kişi', items: ['Kişilik', 'Doğum', 'Ölüm'] },
        { label: 'Bağ', items: ['Hısımlık', 'Yerleşim'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Kişilik hakkı, ad, sicil, koruma yolları; vesayet/kayyım girişi; dernek ve vakıf.',
    promise:
      'Kişilik hakkının korunması, ad, kişisel durum sicili, kısıtlama/vesayet girişi, tüzel kişiler (dernek–vakıf). Bahar finalinin ağır topu.',
    sixtySecond: [
      'Kişilik hakkı mutlak haktır; saldırıya karşı koruma (önleme, durdurma, maddi/manevi).',
      'Ad, kimlik ve sicil: düzeltme ve itiraz yolları bilinir.',
      'Kısıtlanma sebepleri + vesayet / kayyımlık ayrımı (giriş).',
      'Tüzel kişi = hak ehliyeti olan kişi topluluğu / mal topluluğu.',
      'Dernek: kişi topluluğu; vakıf: amaca özgülenmiş malvarlığı.',
      'Cevap: gerçek mi tüzel mi? hangi koruma / organ / sonuç?',
    ],
    pillars: [
      'Kişilik hakkı ve korunması',
      'Ad (soyadı) hukuku girişi',
      'Kişisel durum sicili',
      'Gaiplik / ölüm karinesi çerçevesi',
      'Kısıtlanma sebepleri',
      'Vesayet ve kayyımlık girişi',
      'Tüzel kişiler genel',
      'Dernek ve vakıf',
    ],
    definitions: [
      {
        baslik: 'Kişilik hakkı',
        govde:
          'Kişinin maddi ve manevi bütünlüğünü, onurunu, özel yaşamını ve benzeri değerlerini koruyan mutlak haktır. Saldırıya karşı önleme, durdurma ve tazminat talepleri gündeme gelir.',
      },
      {
        baslik: 'Kişisel durum sicili',
        govde:
          'Doğum, ölüm, evlilik gibi kişisel durum olaylarının tutulduğu resmî kayıttır. İspat ve aleniyet işlevi görür; düzeltme usulü vardır.',
      },
      {
        baslik: 'Vesayet',
        govde:
          'Küçükler ve kısıtlılar için kanunun öngördüğü koruma rejimidir. Vasi, vesayet makamı ve denetim makamı üçgeni temel iskelettir (giriş düzeyi).',
      },
      {
        baslik: 'Kayyımlık',
        govde:
          'Belirli işler veya belirli malvarlığı için atanan temsil / yönetim rejimidir. Vesayetten daha dar ve işe özgüdür.',
      },
      {
        baslik: 'Vakıf',
        govde:
          'Belirli bir amaca özgülenen malvarlığının tüzel kişilik kazanmasıdır. Dernekten farkı: kişi topluluğu değil, mal + amaç merkezlidir.',
      },
    ],
    traps: [
      'Kişilik hakkı ihlalinde yalnız “manevi tazminat” yazıp önleme/durdurmayı unutmak.',
      'Vasi ile kayyımı aynı sanmak.',
      'Dernek ile vakfı organ ve kuruluşta karıştırmak.',
      'Sicil kaydını “değiştirilemez gerçektir” sanmak — düzeltme yolu vardır.',
      'Tüzel kişinin organı olmayan kişinin tek başına her işlemi bağladığını sanmak.',
    ],
    keyMadde: [
      'TMK m.23–25 — kişiliğin korunması (çerçeve)',
      'TMK m.26–27 — ad (çerçeve)',
      'TMK m.35 vd. — kişisel durum sicili (çerçeve)',
      'TMK m.404 vd. — kısıtlama sebepleri (çerçeve)',
      'TMK m.413 vd. — vesayet (çerçeve)',
      'TMK m.426 vd. — kayyımlık (çerçeve)',
      'TMK m.47 vd. — tüzel kişiler genel',
      'TMK m.56 vd. / m.101 vd. — dernek / vakıf (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Kişilik hakkının korunması',
        paragraphs: [
          'Kişilik hakkı mutlaktır; herkese karşı ileri sürülebilir. Saldırı veya saldırı tehlikesi varsa önleme ve durdurma; zarar varsa maddi ve manevi tazminat gündeme gelir. Rıza, üstün kamu yararı, haber alma gibi hukuka uygunluk sebepleri olayda tartılır.',
          'Sınav iskeleti: (1) kişilik değeri (2) saldırı (3) hukuka aykırılık (4) talep (önleme/durdurma/tazminat).',
        ],
        hapBilgi: 'Koruma = önleme + durdurma + tazminat (ihtiyaca göre).',
        bullets: [
          'Maddi–manevi bütünlük',
          'Özel yaşam / onur',
          'Rıza ve sınırları',
          'Talep çeşitleri',
        ],
      },
      {
        heading: 'B. Ad ve kişisel durum sicili',
        paragraphs: [
          'Ad, kimliğin görünür parçasıdır. Değiştirme ve korunma şartları kanunda düzenlenir. Soyadı rejimi aile hukukuyla kesişir; 2. dönemde en azından çerçeve bilinir.',
          'Kişisel durum sicili doğum, ölüm, evlilik gibi olayları belgeler. Yanlış kayıtta düzeltme davası / idari yol ayrımı olay tipine göre yazılır. Sicil “kutsal ve değiştirilemez” değildir.',
        ],
        uyari: 'Sicil ispat kolaylığı sağlar; yanlışsa düzeltme kutusu açılır.',
      },
      {
        heading: 'C. Gaiplik ve ölüm çerçevesi',
        paragraphs: [
          'Ölümle kişilik sona erer. Gaiplik, uzun süredir haber alınamayan veya ölüm tehlikesi içinde kaybolan kişi için mahkeme kararıyla kişisel durumun tasfiyesine yönelik bir rejimdir (giriş). Miras ve aile sonuçları bağlıdır.',
          'Sınavda gaiplik şartlarını uydurmayın; “çerçeve + sonuç” yazın, süreleri TMK’dan doğrulayın.',
        ],
      },
      {
        heading: 'D. Kısıtlama, vesayet, kayyımlık',
        paragraphs: [
          'Kısıtlama sebepleri (akıl hastalığı/zayıflığı, savurganlık, alkol/uyuşturucu, cezaevi, istek üzerine vb. — güncel madde listesi) fiil ehliyetini etkiler. Vasi genel koruma; kayyım belirli iş/mal için atanır.',
          'Organ üçgeni: vesayet makamı, denetim makamı, vasi. Yetki ve onay gerektiren işlemler listesi final klasikidir. Aile hukuku ve usul ile kesişir.',
        ],
        kartlar: [
          { baslik: 'Kısıtlama', govde: 'Fiil ehliyetini daraltan karar.' },
          { baslik: 'Vasi', govde: 'Genel koruma ve temsil.' },
          { baslik: 'Kayyım', govde: 'Belirli iş / mal için.' },
          { baslik: 'Makamlar', govde: 'Vesayet + denetim.' },
        ],
      },
      {
        heading: 'E. Tüzel kişiler genel',
        paragraphs: [
          'Tüzel kişi, hukuk düzeninin hak ehliyeti tanıdığı kişi veya mal topluluğudur. Organları aracılığıyla fiil ehliyetini kullanır. Kuruluş, ehliyet sınırı (amaç), organ ve sorumluluk iskeleti yazılır.',
          'Kamu tüzel kişileri ile özel hukuk tüzel kişileri ayrımı sınavda ilk cümlede yapılmalıdır.',
        ],
        hapBilgi: 'Tüzel kişi = hak öznesi + organ + amaç sınırı.',
      },
      {
        heading: 'F. Dernek',
        paragraphs: [
          'Dernek, en az yedi gerçek kişinin kazanç paylaşma dışında belirli bir amacı gerçekleştirmek üzere kurduğu kişi topluluğudur (çerçeve). Tüzük, organlar (genel kurul, yönetim, denetim), üyelik ve sona erme bilinir.',
          'Kazanılmamış hak / tescil–beyan rejimleri ve idari denetim 2. dönem derinliğindedir; sınavda kuruluş + organ + karar geçerliliği sık sorulur.',
        ],
        bullets: [
          'Kuruluş şartları',
          'Organlar',
          'Üyelik',
          'Sona erme',
        ],
      },
      {
        heading: 'G. Vakıf',
        paragraphs: [
          'Vakıf, yeterli malvarlığının belirli ve sürekli bir amaca özgülenmesiyle oluşan tüzel kişidir. Kuruluş (resmî senet / vasiyet), tescil, organlar ve amaca bağlılık merkezi kavramlardır.',
          'Dernekten ayırıcı soru: kişi topluluğu mu, mal + amaç mı? Vakıflar Kanunu ile TMK birlikte okunur (giriş).',
        ],
        uyari: 'Vakıf ≠ dernek. Malvarlığı + amaç vs kişi birliği.',
      },
    ],
    examples: [
      {
        title: 'Kişilik hakkı — yayın',
        facts:
          'Haber sitesi, rıza olmadan özel yaşam görüntüsü yayınlar; kişi hem yayını durdurmak hem tazminat ister.',
        analysis:
          'Kişilik değeri + saldırı + hukuka aykırılık. Talep: durdurma + maddi/manevi. Haber/kamu yararı def’i tartılır.',
        takeaway: 'Önleme/durdurma + tazminat birlikte düşünülür.',
      },
      {
        title: 'Sicil düzeltme',
        facts:
          'Nüfus kaydında doğum tarihi yanlış yazılmıştır; kişi işlemlerde mağdur olur.',
        analysis:
          'Kişisel durum sicili işlevi. Düzeltme yolu (mahkeme/idari). İspat.',
        takeaway: 'Yanlış sicil = düzeltme kutusu.',
      },
      {
        title: 'Vasi / kayyım',
        facts:
          'Kısıtlı adına taşınmaz satılacaktır; işlem için kimin onayı gerekir?',
        analysis:
          'Vesayet mi kayyımlık mı? Vesayet/denetim makamı onayı. İşlem türü (önemli tasarruf).',
        takeaway: 'Organ + onay + işlem türü.',
      },
      {
        title: 'Dernek mi vakıf mı?',
        facts:
          'Bir grup, eğitim amacına mal bağışlayarak “dernek” kurmak ister; avukat vakıf önerir.',
        analysis:
          'Kişi topluluğu (dernek) vs amaca özgü mal (vakıf). Kuruluş şekli, organ, süreklilik.',
        takeaway: 'Amaç + mal mı, üye birliği mi?',
      },
    ],
    mindmap: {
      center: 'TMK 1. Kitap · 2. dönem',
      branches: [
        { label: 'Koruma', items: ['Kişilik', 'Ad', 'Sicil'] },
        { label: 'Koruma rejimi', items: ['Kısıt', 'Vasi', 'Kayyım'] },
        { label: 'Tüzel', items: ['Genel', 'Dernek', 'Vakıf'] },
        { label: 'Yöntem', items: ['Organ', 'Onay', 'Amaç'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Başlangıç hükümlerinden ehliyet, kişilik koruması ve tüzel kişilere kadar tek omurga.',
    promise:
      '1. + 2. dönem birleşik; TMK 1. Kitap ve medeni başlangıç dersi için “tek cilt” not.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: önce başlangıç/ehliyet mi, yoksa koruma/tüzel kişi mi?',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 4), ...b.keyMadde.slice(0, 4)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: m.1–7 + ehliyet → deneme → kişilik koruması + vesayet girişi + dernek/vakıf → karma deneme.',
          'Her soruda etiket: “Başlangıç kuralı mı, ehliyet mi, kişilik koruması mı, tüzel kişi/organ mı?”',
        ],
        hapBilgi: 'Yıllık başarı = doğru kapı (başlangıç/ehliyet/koruma/tüzel) + unsur.',
        bullets: [
          'Hafta 1–3: m.1–2–3–6',
          'Hafta 4–7: hak/fiil ehliyeti + hısımlık + yerleşim',
          'Hafta 8–11: kişilik hakkı + ad + sicil',
          'Hafta 12–14: vesayet/kayyım girişi + dernek/vakıf + karma',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon: sık soru tipleri',
        paragraphs: [
          'Tip 1 — m.2 kötüye kullanma. Tip 2 — iyiniyet. Tip 3 — fiil ehliyeti matrisi. Tip 4 — kişilik hakkı talepleri. Tip 5 — vasi onayı. Tip 6 — dernek/vakıf ayrımı.',
          'Karma olayda başlangıç kuralı + ehliyet + tüzel organ üst üste binebilir. Sıra: hangi kişi? ehliyet? organ yetkisi? dürüstlük/iyiniyet?',
        ],
        uyari: 'Tek cevapta tüm 1. kitabı özetlemeyin; sorunun kapısını seçin.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'TMK 1. Kitap · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Başlangıç', 'Ehliyet', 'Yerleşim'] },
        { label: '2. yarı', items: ['Kişilik', 'Vesayet', 'Tüzel'] },
        { label: 'Kurum', items: ['Dernek', 'Vakıf'] },
        { label: 'Yöntem', items: ['Kapı seç', 'Unsur yaz'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'tmk-1-kitap-donem-1': d1Content,
  'tmk-1-kitap-donem-2': d2Content,
  'tmk-1-kitap-yillik': yillikContent,
};

export const TMK_1_KITAP_VARIANTS = [
  'tmk-1-kitap-donem-1',
  'tmk-1-kitap-donem-2',
  'tmk-1-kitap-yillik',
];

export function buildTmk1KitapVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} TMK 1. Kitap ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} TMK 1. Kitap (Kişiler Hukuku) ${meta.h1Extra}`;
  const description = `${uni.name} için TMK 1. Kitap ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Türk Medenî Kanunu 1. Kitap — başlangıç hükümleri ve kişiler hukuku — ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: doğru kapıyı (başlangıç / ehliyet / koruma / tüzel kişi) seçip unsurlarıyla yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır; medeni başlangıç dersiyle hizalıdır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Dönemlik program kendi yarısını; yıllık veya bütüncül tekrar yıllık paketi kullanır.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek olay → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda: başlangıç kuralı mı, ehliyet mi, koruma/tüzel mi?',
        'Fiil ehliyetinde işlem türü matrisini çiz',
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
      paragraphs: ['Soru tipine göre dayanaklar. Güncel metin: TMK Başlangıç + 1. Kitap.'],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma madde no yazmayın; TMK metninden doğrulayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (TMK 1. Kitap)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık şart. 60 dk / 3 soruda soru başı ~18 dk.`,
        'İskelet: (1) kapı seç (başlangıç/ehliyet/koruma/tüzel) (2) tanım (3) unsur (4) olgu (5) sonuç + istisna.',
      ],
      bullets: [
        'm.2 / m.3 kutusunu gerektiğinde aç',
        'Hak ehliyeti ≠ fiil ehliyeti',
        'Küçük/kısıtlıda işlem türü matrisi',
        'Tüzel kişide organ + amaç sınırı',
      ],
      hapBilgi: 'Doğru kapı + doğru unsur = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `TMK 1. Kitap ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Kapıyı seç (başlangıç / ehliyet / koruma / tüzel)',
        'Tanım (1 cümle)',
        'Unsurları numarala',
        'Olayı unsura yedir',
        'İstisna (m.2, m.3, onay…)',
        'Sonuç',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'tmk-1-kitap-donem-2'
          ? [
              ['Vasi', 'Kayyım', 'Genel koruma mı belirli iş mi?'],
              ['Dernek', 'Vakıf', 'Kişi topluluğu mu mal+amaç mı?'],
              ['Önleme/durdurma', 'Tazminat', 'Tehlike/saldırı mı zarar mı?'],
              ['Sicil', 'Gerçek durum', 'Kayıt yanlışsa düzeltme var mı?'],
            ]
          : variantCode === 'tmk-1-kitap-donem-1'
            ? [
                ['Hak ehliyeti', 'Fiil ehliyeti', 'Sahip olma mı işlem yapma mı?'],
                ['m.2/1', 'm.2/2', 'Dürüstlük ödevi mi kötüye kullanma yasağı mı?'],
                ['İyiniyet', 'Bilmeme', 'Bilmesi gerekir miydi?'],
                ['Yerleşim yeri', 'Bulunulan yer', 'Sürekli kalma niyeti var mı?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Başlangıç/ehliyet mi koruma/tüzel mi?'],
                ['Hak ehliyeti', 'Fiil ehliyeti', 'Sahip mi işlem mi?'],
                ['Dernek', 'Vakıf', 'Üye mi mal+amaç mı?'],
                ['Vasi', 'Kayyım', 'Genel mi özel iş mi?'],
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
      leftTitle: 'Başlangıç / ehliyet',
      rightTitle: 'Koruma / tüzel',
      left: 'm.1–7 + ehliyet matrisi + hısımlık/yerleşim',
      right: 'Kişilik talepleri + vesayet girişi + dernek/vakıf',
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
      a: '1. dönem başlangıç hükümleri + hak/fiil ehliyeti + hısımlık/yerleşim; 2. dönem kişilik koruması, sicil, vesayet/kayyım girişi, dernek–vakıf; yıllık ikisini birleştirir.',
    },
    {
      q: 'Medeni başlangıç dersiyle aynı mı?',
      a: 'Evet, hizalıdır. Fakültede “Medeni Hukuka Giriş / Başlangıç / Kişiler” adlarıyla okutulan TMK 1. Kitap omurgasıdır.',
    },
    {
      q: 'PDF nasıl indirilir?',
      a: '“PDF indir / Yazdır” veya …/pdf → Ctrl+P → PDF olarak kaydet. Kişisel kullanım.',
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
    variantCode === 'tmk-1-kitap-yillik'
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
      `${uni.shortName} tmk 1. kitap ${meta.short}`,
      `${uni.shortName} kişiler hukuku ders notu`,
      `tmk 1. kitap ${meta.short} not pdf`,
      'medeni başlangıç dürüstlük iyiniyet ehliyet ders notu',
      'kişiler hukuku yıllık not',
      'dernek vakıf fiil ehliyeti not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} tmk 1. kitap`),
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
        'Kapıyı ilk cümlede seç',
        'm.2 / m.3 gerektiğinde aç',
        'Ehliyet × işlem türü matrisi',
        'Tüzel kişide organ yaz',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `TMK 1. Kitap ${meta.short} kapsamındaki kurumları ayırır`,
      'Başlangıç hükümlerini olaya uygular',
      'Hak ve fiil ehliyeti matrisini kurar',
      'Kişilik koruması veya tüzel kişi/organ yolunu seçer',
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
    relatedCourses: TMK_1_KITAP_VARIANTS.filter((c) => c !== variantCode).concat([
      'medeni-baslangic',
      'aile-hukuku',
      'borclar-genel-donem-1',
    ]),
    relatedBilgi: [],
    updated: '2026-07-29',
    wordTarget: variantCode === 'tmk-1-kitap-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'tmk-1-kitap',
    variantLabel: meta.label,
  };
}
