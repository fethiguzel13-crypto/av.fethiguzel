/**
 * Borçlar Genel — 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * TBK m.1–206 iskeleti; pedagojik bölünme (dönemlik fakülteler için).
 */

function baseMeta(uni, variant) {
  const labels = {
    'borclar-genel-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope: 'TBK Genel Hükümler · 1. yarı (kaynaklar, kuruluş, irade, temsil, ifaya giriş)',
    },
    'borclar-genel-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope: 'TBK Genel Hükümler · 2. yarı (ifa engelleri, temerrüt, haksız fiil, sebepsiz zenginleşme, zamanaşımı, sona erme)',
    },
    'borclar-genel-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope: 'TBK m.1–206 tam omurga · dönemlik + yıllık programlar için tek cilt',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Borç nereden doğar, sözleşme nasıl kurulur, irade sakat mı, kim temsil eder?',
    promise:
      'Kaynak → kuruluş → geçerlilik → temsil → ifaya sağlam giriş. Güz finalinde dağılmadan yazarsınız.',
    sixtySecond: [
      'Borç ilişkisi = alacaklı–borçlu bağı (hak + borç demeti).',
      'Kaynaklar: sözleşme · haksız fiil · sebepsiz zenginleşme (+ kanunî borçlar).',
      'Sözleşme: icap + kabul (+ şekil varsa şekil).',
      'İrade sakatlıkları: hata · hile · korkutma (süre + seçimlik hak).',
      'Temsil: yetki var mı, aşım var mı, iyiniyetli üçüncü kişi?',
      'Cevap iskeleti: tanım → madde → unsur → olaya yedir → sonuç → istisna.',
    ],
    pillars: [
      'Borç ilişkisi ve edim',
      'Borcun kaynakları',
      'Sözleşmenin kurulması (icap–kabul)',
      'Sözleşmede şekil',
      'Genel işlem koşulları (giriş)',
      'İrade sakatlıkları',
      'Temsil',
      'İfanın genel ilkeleri (giriş)',
    ],
    definitions: [
      {
        baslik: 'Borç ilişkisi',
        govde:
          'Alacaklının borçludan bir edim talep edebildiği hukuki bağdır. Tek “borç” değil; haklar ve borçlar demetidir.',
      },
      {
        baslik: 'Edim',
        govde:
          'Borçlunun yapmak / yapmamak / vermekle yükümlü olduğu davranıştır. Konusu mümkün, belirli veya belirlenebilir olmalıdır.',
      },
      {
        baslik: 'İcap',
        govde:
          'Sözleşme kurmaya yönelik, yeterince belirli ve bağlanma iradesi taşıyan tekliftir. Ön görüşme ve şaka icap değildir.',
      },
      {
        baslik: 'Kabul',
        govde:
          'İcaba uygun, bağlanma iradesi taşıyan irade beyanıdır. Kural olarak sessizlik kabul sayılmaz.',
      },
      {
        baslik: 'Temsil',
        govde:
          'Bir kimsenin, başkası adına ve hesabına hukuki işlem yapma yetkisidir. Yetki, aşım ve iyiniyet ayrı kutulardır.',
      },
    ],
    traps: [
      'Sessizliği kabul sanmak.',
      'İcabı geri almayı “hiç söylemedim” ile karıştırmak — ulaşma anı kritiktir.',
      'Şekil eksikliğini her zaman “yokluk” yazmak — yaptırım tipine bak.',
      'Temsilde iç talimatı dış yetki sanmak.',
      'Gabin’de yalnızca “ucuz satış” yazıp subjektif unsuru atlamak.',
    ],
    keyMadde: [
      'TBK m.1 vd. — borç ilişkisinin kaynakları',
      'TBK m.1–11 civarı — icap–kabul iskeleti',
      'TBK m.12 vd. — şekil',
      'TBK m.20 vd. — genel işlem koşulları (giriş)',
      'TBK m.28 — aşırı yararlanma',
      'TBK m.30 vd. — irade sakatlıkları',
      'TBK m.40 vd. — temsil',
      'TBK m.83 vd. — ifaya giriş',
    ],
    sectionsExtra: [
      {
        heading: 'A. Borç ilişkisi ve kaynaklar',
        paragraphs: [
          'Sınavda ilk cümle çoğu zaman “borç ilişkisi nedir?” ile açılır. Tanımı yazıp hemen kaynağa geçin: bu borç sözleşmeden mi, haksız fiilden mi, sebepsiz zenginleşmeden mi doğdu? Kaynak yanlış seçilirse tüm unsur listesi kayar.',
          'Sözleşme iradi, haksız fiil ve sebepsiz zenginleşme ise daha çok kanunî/olaysal doğumludur. “Sözleşme gibi davranmışlar” cümlesi, irade ve edim karşılığı netleşmeden sözleşme kurmaz.',
        ],
        hapBilgi: 'Önce kaynak, sonra unsur. Kaynak seçmeden subsumption yapılmaz.',
        bullets: [
          'Sözleşme: icap + kabul (+ şekil)',
          'Haksız fiil: fiil + hukuka aykırılık + zarar + illiyet + kusur (kural)',
          'Sebepsiz zenginleşme: zenginleşme + fakirleşme + illiyet + haklı sebep yokluğu',
        ],
      },
      {
        heading: 'B. Sözleşmenin kuruluşu (icap–kabul)',
        paragraphs: [
          'İcap; belirli, ciddî ve bağlanma iradesi taşımalıdır. “Pazarlık edelim” genelde icap değildir. Kabul, icabın içeriğine uygun olmalı; yeni şart önerisi karşı icap olabilir.',
          'İletişim kanalı (yüz yüze, telefon, e-posta) geri alma ve ulaşma anını değiştirir. Süreli icapta süre dolunca bağlayıcılık biter; süresizde makul süre devreye girer.',
        ],
        kartlar: [
          {
            baslik: 'İcap testi',
            govde: 'Belirlilik + bağlanma iradesi + muhatap. Eksikse ön görüşme.',
          },
          {
            baslik: 'Kabul testi',
            govde: 'İcaba uygunluk + bağlanma iradesi. Sessizlik kural olarak yetmez.',
          },
          {
            baslik: 'Geri alma',
            govde: 'Geri alma, icaptan önce veya en geç aynı anda ulaşmalı (kural çerçevesi).',
          },
        ],
        uyari: '“Kabul sayılır” yazmadan önce kanuni karine veya teamül var mı bakın.',
      },
      {
        heading: 'C. Şekil ve genel işlem koşulları',
        paragraphs: [
          'Şekil, geçerlilik veya ispat için öngörülmüş olabilir. Yaptırım farklıdır: geçersizlik ile ispat güçlüğü aynı şey değildir. Kanuni şekil ile iradi şekil ayrımını yazın.',
          'Genel işlem koşulları (GİK) tüketici ve tacir ilişkilerinde ayrı denetim katmanları taşır. Şaşırtıcı / dürüstlüğe aykırı klozlar yazılmamış sayılabilir. 1. dönemde en azından “denetim var, kör imza yetmez” bilinci şarttır.',
        ],
        hapBilgi: 'Şekil sorusunda: hangi şekil? niçin? yaptırımı ne?',
      },
      {
        heading: 'D. İrade sakatlıkları ve gabin',
        paragraphs: [
          'Hata, hile ve korkutmada ortak iskelet: sakatlık tipi → şartlar → süre → seçimlik hak (iptal vb.) → iyiniyetli üçüncü kişi. Her sakatlığı aynı cümleyle bitirmeyin.',
          'Aşırı yararlanma (gabin): subjektif unsur (zaruret, tecrübesizlik, düşüncesizlik) + objektif bariz oransızlık. Tek başına “pahalı/ucuz” yetmez.',
        ],
        bullets: [
          'Hata: esaslılık',
          'Hile: aldatma + illiyet',
          'Korkutma: ağır ve yakın tehlike',
          'Gabin: subjektif + objektif birlikte',
        ],
        uyari: 'Süre kutusunu kapatmayan cevap yarıda kalır.',
      },
      {
        heading: 'E. Temsil',
        paragraphs: [
          'Yetkili temsilde işlem doğrudan temsil olunana bağlanır. Yetkisiz temsilde kural olarak temsil olunan bağlanmaz; onay ve iyiniyetli üçüncü kişi istisnaları ayrı yazılır.',
          'İç talimat (temsilciye “şunu yapma”) ile dış yetki (üçüncü kişinin gördüğü yetki) karıştırılmamalıdır. Tescilli yetki / ticaret sicili görünümü ticari dosyalarda devreye girer.',
        ],
        hapBilgi: 'Temsil sorusu = yetki fotoğrafı + aşım + üçüncü kişinin iyiniyeti.',
      },
      {
        heading: 'F. İfaya giriş (1. dönem kapanışı)',
        paragraphs: [
          'İfa; doğru edimin, doğru zamanda, doğru yerde, doğru kişiye sunulmasıdır. 1. dönemde “ifa nedir / nasıl olur” bilinir; temerrüt ve imkânsızlığın derin rejimleri 2. döneme bırakılır ama isimleri tanınır.',
          'Kısmi ifa, ifa yerine edim, ifa uğruna edim gibi ayrımlar finalde çıkar. En azından tanımlarını ayırt edin.',
        ],
      },
    ],
    examples: [
      {
        title: 'İcap mı pazarlık mı?',
        facts:
          'A, B’ye “aracı 400.000’e satabilirim, düşün” yazar. B ertesi gün “tamam alıyorum, yarın noter” der. A vazgeçtiğini söyler.',
        analysis:
          'Önce metnin icap olup olmadığı (bağlanma iradesi + belirlilik). “Düşün” ifadesi zayıflatır. Kabul, geçerli icaba dayanmalıdır. Sonuç: çoğu senaryoda henüz sözleşme kurulmamış olabilir; olgu diline göre yazın.',
        takeaway: 'Bağlanma iradesi yoksa icap yoktur.',
      },
      {
        title: 'Yetkisiz temsil',
        facts:
          'C, D adına D’nin haberi olmadan kira sözleşmesi imzalar. Kiraya veren iyiniyetle teslim eder.',
        analysis:
          'Yetki var mı? Yoksa yetkisiz temsil. Onay gelirse bağlanma. Onay yoksa kim sorumlu? İyiniyetli üçüncü kişinin korunma imkânı ayrı kutu.',
        takeaway: 'Yetki → aşım → onay → iyiniyet sırası.',
      },
      {
        title: 'Gabin iddiası',
        facts:
          'Acil borç baskısı altındaki satıcı, rayicin çok altında taşınır satar; 3 ay sonra iptal ister.',
        analysis:
          'Subjektif unsur + objektif oransızlık + süre. Yalnızca fiyat farkı yetmez. Seçimlik hak ve iyiniyetli devralan senaryosu.',
        takeaway: 'İki unsur + süre.',
      },
      {
        title: 'Şekil',
        facts:
          'Kanunen yazılı şekle bağlı bir taahhüt sözlü yapılır; taraflar ifaya başlar.',
        analysis:
          'Şekil türü ve yaptırım. Geçersizlik kuralı ile ifaya başlamanın sonuçları öğreti/içtihatla dikkatli yazılır; uydurma istisna yazmayın.',
        takeaway: 'Şekil + yaptırım kutusunu ayır.',
      },
    ],
    mindmap: {
      center: 'Borçlar Genel · 1. dönem',
      branches: [
        { label: 'Kaynak', items: ['Sözleşme', 'Haksız fiil', 'Sebepsiz z.'] },
        { label: 'Kuruluş', items: ['İcap', 'Kabul', 'Şekil'] },
        { label: 'Sakatlık', items: ['Hata', 'Hile', 'Korkutma', 'Gabin'] },
        { label: 'Temsil', items: ['Yetki', 'Aşım', 'Onay'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: İfa bozulursa ne olur? Temerrüt, imkânsızlık, haksız fiil, sebepsiz zenginleşme, zamanaşımı.',
    promise:
      'İfa engelleri + haksız fiil + sebepsiz zenginleşme + zamanaşımı + sona erme. Bahar finalinin ağır topu.',
    sixtySecond: [
      'İfa engeli: temerrüt mü, imkânsızlık mı, ayıp/kötü ifa mı?',
      'Temerrüt: muacceliyet + ifa edilmeme + (kural) ihtar + borçluya yüklenebilirlik.',
      'Haksız fiil: fiil + hukuka aykırılık + zarar + illiyet + kusur.',
      'Sebepsiz zenginleşme: denkleştirme; sözleşme/haksız fiil yolu varsa sıraya dikkat.',
      'Zamanaşımı ≠ hak düşürücü süre.',
      'Sona erme: ifa, ibra, takas, yenileme, birleşme…',
    ],
    pillars: [
      'İfanın bozulması: temerrüt',
      'İmkânsızlık ve aşırı ifa güçlüğü',
      'Kötü ifa / ayıba yaklaşan genel çerçeve',
      'Tazminat (maddi–manevi girişi)',
      'Haksız fiil',
      'Sebepsiz zenginleşme',
      'Zamanaşımı',
      'Borcun sona ermesi ve taraf değişiklikleri (temlik, üstlenme girişi)',
    ],
    definitions: [
      {
        baslik: 'Temerrüt',
        govde:
          'Muaccel borcun, borçluya yüklenebilir sebeple zamanında ifa edilmemesidir. Alacaklı ve borçlu temerrüdü ayrı rejimdir.',
      },
      {
        baslik: 'İmkânsızlık',
        govde:
          'Edimin objektif olarak yerine getirilememesidir. Başlangıçtaki / sonradan; sürekli / geçici ayrımları sonucu değiştirir.',
      },
      {
        baslik: 'Haksız fiil',
        govde:
          'Hukuka aykırı ve kusurlu bir fiille başkasına zarar vermektir (TBK m.49 vd.). Kusursuz sorumluluk istisnaları ayrıca işaretlenir.',
      },
      {
        baslik: 'Sebepsiz zenginleşme',
        govde:
          'Haklı bir sebep olmaksızın bir malvarlığının başka bir malvarlığı aleyhine artmasıdır. İade borcu doğurur.',
      },
      {
        baslik: 'Zamanaşımı',
        govde:
          'Alacağın dava edilebilirliğinin süreyle zayıflamasıdır. Hak düşürücü süreden farklıdır; def’i olarak ileri sürülür (kural).',
      },
    ],
    traps: [
      'Temerrüt ile imkânsızlığı aynı yazmak.',
      'İhtarı hiç tartışmamak (veya hiç aranmayan yerde aramak).',
      'Haksız fiilde zarar ve illiyeti atlamak.',
      'Sebepsiz zenginleşmeyi her uyuşmazlığın “yedek kapısı” sanmak.',
      'Zamanaşımını re’sen dikkate alınır sanmak (kural: def’i).',
    ],
    keyMadde: [
      'TBK m.112 vd. — borçlunun sorumluğu / ifa engelleri iskeleti',
      'TBK m.117 vd. — temerrüt',
      'TBK m.136 vd. — imkânsızlık (çerçeve)',
      'TBK m.49 vd. — haksız fiil',
      'TBK m.77 vd. — sebepsiz zenginleşme',
      'TBK m.146 vd. — zamanaşımı',
      'TBK m.183 vd. — alacağın devri (temlik) girişi',
    ],
    sectionsExtra: [
      {
        heading: 'A. İfa engelleri haritası',
        paragraphs: [
          '2. dönemin ilk sorusu: edim hâlâ mümkün mü? Mümkün ama gecikmişse temerrüt hattı; imkânsızsa imkânsızlık hattı. Kötü ifa / ayıp özel tiplerde (satım, eser) ayrıca açılır; genel hükümlerle köprü kurun.',
          'Seçimlik haklar (ifa + gecikme tazminatı, aynen ifadan vazgeçip olumlu/olumsuz zarar vb.) olayın tipine göre yazılır. “Tazminat ister” deyip hangi zarar kalemini açmamak puan kaybettirir.',
        ],
        hapBilgi: 'Mümkün + gecikme = temerrüt hattı. Mümkün değil = imkânsızlık hattı.',
      },
      {
        heading: 'B. Temerrüt (alacaklı–borçlu)',
        paragraphs: [
          'Borçlu temerrüdünde klasik iskelet: muacceliyet, ifa edilmeme, ihtar (kural), borçluya yüklenebilirlik. İhtarın aranmadığı hâller (vade, ihtarın faydasızlığı vb.) ayrıca kutulanır.',
          'Alacaklı temerrüdü (alacaklının ifayı kabulden kaçınması) ayrı rejimdir; karıştırmayın. Temerrüt faizleri ve ticari iş karinesi ticari dosyada devreye girer.',
        ],
        bullets: [
          'Muaccel mi?',
          'İhtar gerekli mi / yapıldı mı?',
          'Seçimlik haklar neler?',
          'Zarar ve illiyet yazıldı mı?',
        ],
        uyari: 'İhtar kutusunu boş bırakmak 2. dönem finalinin en sık hatasıdır.',
      },
      {
        heading: 'C. İmkânsızlık ve aşırı ifa güçlüğü',
        paragraphs: [
          'Objektif imkânsızlıkta borç sona erebilir; kusur tazminatı etkiler. Kısmi imkânsızlık ve geçici imkânsızlık ayrı sonuçlar doğurur.',
          'Aşırı ifa güçlüğü (denge bozulması) uyarlama / dönme tartışmasına açılır. “Zorlaştı” tek başına yetmez; işlem temelinin çökmesi ölçütleri yazılır.',
        ],
        hapBilgi: 'İmkânsızlık ≠ güçlük. İkisini aynı cümlede eritmeyin.',
      },
      {
        heading: 'D. Haksız fiil',
        paragraphs: [
          'TBK m.49 iskeleti: hukuka aykırı fiil, zarar, illiyet bağı, kusur. Kusursuz sorumluluk hâlleri (adam çalıştıran, hayvan tutucu, yapı maliki vb.) ayrı kapıdır; “hep kusur” yazmayın.',
          'Maddi zarar kalemleri ve manevi tazminat şartları ayrılır. Müterafik kusur indirim sebebidir.',
        ],
        kartlar: [
          { baslik: 'Fiil + hukuka aykırılık', govde: 'Davranış ve norm ihlali.' },
          { baslik: 'Zarar', govde: 'Malvarlığı / kişilik değeri eksilmesi.' },
          { baslik: 'İlliyet', govde: 'Uygun illiyet; kesen nedenler.' },
          { baslik: 'Kusur', govde: 'Kast / taksir; kusursuz sorumluluk istisnası.' },
        ],
      },
      {
        heading: 'E. Sebepsiz zenginleşme',
        paragraphs: [
          'Zenginleşme, fakirleşme, aradaki illiyet ve haklı sebebin yokluğu. İade kapsamı (iyiniyet / kötüniyet) değişir.',
          'Sözleşme veya haksız fiil yolu açıksa, sebepsiz zenginleşmenin yedek / yarışan niteliği dikkatle yazılır; her olaya “m.77” yapıştırmayın.',
        ],
      },
      {
        heading: 'F. Zamanaşımı ve sona erme',
        paragraphs: [
          'Zamanaşımı süreleri borcun niteliğine göre değişir (genel süre / özel süreler). Kesilme ve durma sebepleri ayrı ezberlenir. Def’i olarak ileri sürülmesi kuraldır.',
          'Sona erme sebepleri: ifa, ibra, birleşme, takas, yenileme, konkordato vb. Alacağın devri (temlik) ve borcun üstlenilmesi taraf değişikliğidir; sona erme ile karıştırılmaz.',
        ],
        uyari: 'Zamanaşımı sürelerini uydurmayın; genel çerçeveyi yazıp “somut süre kanuna bakılmalı” demek, yanlış sayı yazmaktan iyidir.',
      },
    ],
    examples: [
      {
        title: 'Temerrüt ve seçimlik hak',
        facts:
          'Satıcı ayıpsız malı vadesinde teslim etmez. Alıcı ihtar gönderir; 10 gün sonra hâlâ ifa yoktur. Alıcı dönmek ve zarar istemek ister.',
        analysis:
          'Temerrüt şartları + ihtar. Seçimlik haklar: aynen ifa + gecikme tazminatı veya ifadan vazgeçip olumlu zarar. Zarar kalemi ve illiyet yazılır.',
        takeaway: 'İhtar + seçim + zarar üçlüsü.',
      },
      {
        title: 'İmkânsızlık',
        facts:
          'Kiralanacak salon yangında yok olur; sözleşme ifa gününden önce.',
        analysis:
          'Objektif imkânsızlık. Kusur var mı? Risk dağılımı / sona erme / tazminat. Geçici-sürekli ayrımı.',
        takeaway: 'Mümkün değilse temerrüt hattına sapma.',
      },
      {
        title: 'Haksız fiil',
        facts:
          'Trafikte kırmızı ışık ihlaliyle çarpışma; araç hasarı ve yaralanma.',
        analysis:
          'Hukuka aykırı fiil, zarar (maddi/manevi), illiyet, kusur. Müterafik kusur. Sigorta ilişkisi ayrı katman olabilir.',
        takeaway: 'Beşli iskeleti numarala.',
      },
      {
        title: 'Zamanaşımı def’i',
        facts:
          'Alacaklı 12 yıl sonra dava açar; borçlu “süre doldu” der.',
        analysis:
          'Hangi süre? Kesilme oldu mu? Def’i olarak ileri sürülmeli mi? Mahkemenin re’sen davranıp davranmayacağı.',
        takeaway: 'Süre + kesilme + def’i.',
      },
    ],
    mindmap: {
      center: 'Borçlar Genel · 2. dönem',
      branches: [
        { label: 'İfa engeli', items: ['Temerrüt', 'İmkânsızlık', 'Kötü ifa'] },
        { label: 'Tazminat', items: ['Maddi', 'Manevi'] },
        { label: 'Kanunî borç', items: ['Haksız fiil', 'Sebepsiz z.'] },
        { label: 'Zaman', items: ['Zamanaşımı', 'Sona erme'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Kaynak ve kuruluştan temerrüt, haksız fiil ve zamanaşımına kadar tek omurga.',
    promise:
      'Dönem 1 + dönem 2 birleşik; yıllık program ve bütüncül tekrar için “tek cilt” borçlar genel notu.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: soru hangi yarıya ait? Önce yarıyı seç, sonra unsur yaz.',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 4), ...b.keyMadde.slice(0, 4)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Bu not hem yıllık programlar hem de dönemlik okuyup bütüncül tekrar yapanlar içindir. Çalışma önerisi: önce 1. dönem bloklarını bitirin, bir deneme yazın; sonra 2. dönem bloklarına geçin; en sonda karma 3 soruluk deneme çözün.',
          'Yıllık finalde sorular karışık gelir. Her soruda zihinsel etiket yapın: “bu kuruluş mu, temerrüt mü, haksız fiil mi?” Yanlış etikette en güzel unsur listesi bile puan getirmez.',
        ],
        hapBilgi: 'Yıllık başarı = doğru kapıyı seçmek + o kapının unsurlarını eksiksiz yazmak.',
        bullets: [
          'Hafta 1–7: 1. dönem omurgası',
          'Hafta 8: ara deneme (kuruluş + irade + temsil)',
          'Hafta 9–14: 2. dönem omurgası',
          'Hafta 15: karma deneme + yanlış defteri',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon: sık soru tipleri',
        paragraphs: [
          'Tip 1 — Kuruluş + sakatlık: “Sözleşme kuruldu mu, kurulduysa ayakta mı?” Tip 2 — Temerrüt seçimlik hakları. Tip 3 — Haksız fiil unsurları. Tip 4 — Zamanaşımı def’i. Tip 5 — Kaynak yarışması (sözleşme mi haksız fiil mi).',
          'Karma sorularda paragraf paragraf etiketleyin. Tek uzun metinde boğulmayın.',
        ],
        uyari: 'Tek cevapta hem icap hem temerrüt hem haksız fiil anlatmaya çalışmayın; sorunun istediği kapıyı seçin.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Borçlar Genel · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Kaynak', 'Kuruluş', 'İrade', 'Temsil'] },
        { label: '2. yarı', items: ['Temerrüt', 'İmkânsızlık', 'Haksız fiil'] },
        { label: 'Zaman', items: ['Zamanaşımı', 'Sona erme'] },
        { label: 'Yöntem', items: ['Subsumption', 'Seçimlik hak'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'borclar-genel-donem-1': d1Content,
  'borclar-genel-donem-2': d2Content,
  'borclar-genel-yillik': yillikContent,
};

export const BORCLAR_GENEL_VARIANTS = [
  'borclar-genel-donem-1',
  'borclar-genel-donem-2',
  'borclar-genel-yillik',
];

export function buildBorclarGenelVariantNote(uni, variantCode) {
  const meta = baseMeta(uni, variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Borçlar Genel ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Borçlar Hukuku Genel Hükümler ${meta.h1Extra}`;
  const description = `${uni.name} için Borçlar Genel ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Borçlar Genel ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: ezber yığını değil; sınavda işleyen iskelet, tanım kartı, tuzak defteri ve işlenmiş örnek. Fakülte ${calLabel} kullansa da bu üçlü set (1. dönem / 2. dönem / yıllık) esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya özellikle ${meta.label} kapsamına göre kesilmiştir. Dönemlik okuyanlar kendi yarılarını; yıllık okuyanlar veya bütüncül tekrar yapanlar yıllık paketi tercih eder. Üç not birbirini tamamlar; çelişmez.`,
        'Okuma sırası: 60 sn omurga → tanım kartları → tuzaklar → bölüm metinleri → örnek olay (süre tutarak) → kontrol listesi.',
      ],
      bullets: [
        'PDF: sayfadaki “PDF / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Kendi defterine şema çiz (ekrana bakarak ezberleme)',
        'Her örnek olayı 12–15 dakikada yeniden yaz',
      ],
      hapBilgi: bank.oneLiner,
    },
    {
      heading: '2. 60 saniyede omurga',
      paragraphs: ['Sesli okuyun; sonra kapatıp yazın.'],
      bullets: bank.sixtySecond,
    },
    {
      heading: '3. Kavram haritası ve omurga başlıkları',
      paragraphs: [
        `Bu paketin omurgası: ${bank.pillars.join('; ')}.`,
      ],
      bullets: bank.pillars.map((p, i) => `${i + 1}) ${p}`),
      hapBilgi: bank.promise,
    },
    {
      heading: '4. Tanım kartları',
      paragraphs: ['Her kart tek cümlelik işler tanımdır; unsur fısıldar.'],
      kartlar: bank.definitions,
    },
    {
      heading: '5. Pusula maddeler',
      paragraphs: [
        'Ezber listesi değil; soru tipine göre işaretlenecek dayanaklar. Güncel metin için mevzuat bankasına bakın.',
      ],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Yanlış/ uydurma madde numarası yazmaktansa doğru kurum adını + “TBK ilgili hüküm” demek daha güvenlidir; yine de ana maddeleri bilin.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste kurtarır.'],
      bullets: bank.traps,
      uyari: 'Genel kuralı yazıp istisna/süre/ihitar kutusunu unutmak yarı puandır.',
    },
    ...bank.sectionsExtra.map((s, i) => ({
      ...s,
      heading: s.heading.startsWith('A') || s.heading.startsWith('Yıllık') || s.heading.match(/^\d/)
        ? s.heading
        : s.heading,
    })),
    {
      heading: 'Sınav tekniği (Borçlar Genel)',
      paragraphs: [
        `${uni.shortName} klasiklerinde okunabilir I-II-III başlık şarttır. 60 dk / 3 soru varsayımında soru başı ~18 dk.`,
        'Her soruda: (1) istenen sonuç (2) kurum (3) tanım (4) unsur no (5) olgu eşlemesi (6) sonuç + istisna.',
      ],
      bullets: [
        'Kaynak seçimini ilk 2 satırda yaz',
        'İhtar / süre / şekil kutusunu sona bırakma',
        'Zarar diyorsan kalem ve illiyet yaz',
        'Uydurma içtihat numarası yazma',
      ],
      hapBilgi: 'Doğru kapı + eksiksiz unsur = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Borçlar Genel ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'İstenen hukuki sonuç',
        'Kurumu seç (kaynak/temerrüt/haksız fiil…)',
        'Tanım (1 cümle)',
        'Unsurları numarala',
        'Olayı unsura yedir',
        'Sonuç + istisna/süre/ihitar',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'borclar-genel-donem-2'
          ? [
              ['Temerrüt', 'İmkânsızlık', 'Edim hâlâ mümkün mü?'],
              ['Haksız fiil', 'Sözleşme ihlali', 'Borç ilişkisi önceden var mıydı?'],
              ['Zamanaşımı', 'Hak düşürücü süre', 'Def’i mi, re’sen mi?'],
              ['Sebepsiz zenginleşme', 'Sözleşme talebi', 'Haklı sebep / asıl yol var mı?'],
            ]
          : variantCode === 'borclar-genel-donem-1'
            ? [
                ['İcap', 'Ön görüşme', 'Bağlanma iradesi var mı?'],
                ['Kabul', 'Karşı icap', 'İcaba uygun mu?'],
                ['Yetkili temsil', 'Yetkisiz temsil', 'Yetki fotoğrafı?'],
                ['Şekil geçersizliğe', 'İspat şekli', 'Yaptırım ne?'],
              ]
            : [
                ['1. yarı sorusu', '2. yarı sorusu', 'Kuruluş mu ifa engeli mi?'],
                ['Temerrüt', 'İmkânsızlık', 'Mümkün mü?'],
                ['Haksız fiil', 'Sözleşme', 'Önceki borç ilişkisi?'],
                ['Gabin', 'Hile', 'Aldatma var mı, yoksa denge mi?'],
              ],
    },
    {
      kind: 'ladder',
      title: 'Öğrenme merdiveni',
      levels: [
        'Tanım kartlarını yaz',
        'Zihin haritasını çiz',
        'Tuzak listesini ezberle',
        '4 örnek olayı süreyle çöz',
        'Karma deneme + yanlış defteri',
      ],
    },
    {
      kind: 'fork',
      title: 'Soru tipi',
      leftTitle: 'Tanım / unsur',
      rightTitle: 'Olay',
      left: 'Kısa tanım + numaralı unsur + 1 mini örnek cümle',
      right: 'Kaynak/kurum seç → subsumption → net hüküm + istisna',
    },
    {
      kind: 'cycle',
      title: 'Haftalık döngü',
      steps: ['Madde', 'Şema', 'Örnek', 'Quiz', 'Yanlış defteri'],
    },
  ];

  const faq = [
    {
      q: '1. dönem / 2. dönem / yıllık notların farkı ne?',
      a: '1. dönem kuruluş ve geçerlilik ağırlıklıdır; 2. dönem ifa engelleri, haksız fiil ve zamanaşımı ağırlıklıdır; yıllık ikisini birleştirir. Dönemlik fakülte kendi yarısını, yıllık program tam paketi kullanır.',
    },
    {
      q: 'PDF nasıl indirilir?',
      a: 'Not sayfasında “PDF / Yazdır”a tıklayın veya /pdf adresine gidin; Ctrl+P (Cmd+P) → “PDF olarak kaydet”. Kişisel kullanım içindir.',
    },
    {
      q: 'Hocanın slaydı ile çakışırsa?',
      a: 'Duyuru ve sorumlu öğretim elemanı bağlayıcıdır. Bu not ücretsiz destektir; telifli slayt kopyası değildir.',
    },
    {
      q: 'Yalnızca yıllık okuyan ne yapsın?',
      a: 'Önce yıllık notu bitirin; zayıf kaldığınız yarı için dönem notuna dönün.',
    },
    {
      q: 'Ücretli mi?',
      a: 'Hayır. Av. Fethi Güzel Hukuk Portalı üzerinden ücretsizdir.',
    },
  ];

  const checklist = [
    '60 sn omurgayı kapalı deftere yazdım',
    'Tüm tanım kartlarını ezberden yazdım',
    'Zihin haritasını bir sayfada çizdim',
    'Tuzak listesinden 5 madde işaretledim',
    'En az 3 örnek olayı süre tutarak çözdüm',
    'Pusula maddeleri mevzuattan doğruladım',
    'PDF’i kişisel arşive kaydettim',
    variantCode === 'borclar-genel-yillik'
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
      `${uni.shortName} borçlar genel ${meta.short}`,
      `${uni.shortName} borçlar hukuku ders notu`,
      `borçlar genel ${meta.short} not`,
      'TBK genel hükümler ders notu',
      'borçlar genel dönem notu pdf',
      'borçlar genel yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} borçlar genel`),
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
        'Kaynak/kurum seçimini ilk yaz',
        'Unsurları numarala',
        'İhtar–süre–şekil kutusunu kapat',
        'Zarar kalemi yaz',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Borçlar Genel ${meta.short} kapsamındaki kurumları tanımlar`,
      'Doğru hukuki kapıyı (kaynak / temerrüt / haksız fiil…) seçer',
      'Unsurları numaralayıp olaya yedirir',
      'Tuzakları (ihitar, süre, şekil, def’i) kontrol eder',
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
    relatedCourses: BORCLAR_GENEL_VARIANTS.filter((c) => c !== variantCode).concat([
      'borclar-ozel',
      'medeni-baslangic',
    ]),
    relatedBilgi: [
      'zamanaşimi-nedir',
      'haksız-fiil',
    ],
    updated: '2026-07-29',
    wordTarget: variantCode === 'borclar-genel-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'borclar-genel',
    variantLabel: meta.label,
  };
}
