/**
 * Miras Hukuku — 1. dönem / 2. dönem / yıllık premium not üreticisi.
 * TMK Miras; pedagojik yarıyıl bölünmesi.
 */

function baseMeta(variant) {
  const labels = {
    'miras-hukuku-donem-1': {
      label: '1. Dönem (Güz)',
      short: '1. dönem',
      h1Extra: '— 1. Dönem Notu',
      scope:
        'TMK Miras · 1. yarı (yasal mirasçılık, zümre, eş, saklı pay, mirasın geçmesi, ret, ortaklık girişi)',
    },
    'miras-hukuku-donem-2': {
      label: '2. Dönem (Bahar)',
      short: '2. dönem',
      h1Extra: '— 2. Dönem Notu',
      scope:
        'TMK Miras · 2. yarı (ölüme bağlı tasarruflar, tenkis, denkleştirme, paylaşma, istihkak, iptal/yorum)',
    },
    'miras-hukuku-yillik': {
      label: 'Yıllık (Tam paket)',
      short: 'yıllık',
      h1Extra: '— Yıllık Tam Not',
      scope: 'TMK miras hukuku tam omurga · dönemlik + yıllık programlar için tek cilt',
    },
  };
  return labels[variant];
}

function d1Content() {
  return {
    oneLiner:
      '1. dönem: Kim mirasçı, ne kadar pay, saklı pay var mı, miras geçti mi / reddedildi mi?',
    promise:
      'Zümre sistemi, eşin mirasçılığı, saklı pay hesabı, mirasın geçmesi ve ret. Güz finalinde tabloyu bozmadan yazarsınız.',
    sixtySecond: [
      'Önce yasal mirasçılar: zümre + eş (varsa).',
      'Önceki zümre varken sonraki zümre kural olarak mirasçı olmaz.',
      'Eşin payı zümreye göre değişir; tek başına “yarısı” genellemesi yanlıştır.',
      'Saklı pay ≠ yasal pay: iradeyle kaldırılamayan minimum.',
      'Miras ölümle geçer; ret süre ve şekle bağlıdır.',
      'Cevap: kim? pay? saklı pay? geçiş/ret?',
    ],
    pillars: [
      'Miras hukukunun konusu ve ilkeleri',
      'Yasal mirasçılık ve zümre sistemi',
      'Eşin yasal mirasçılığı',
      'Devletin mirasçılığı (çerçeve)',
      'Saklı pay ve saklı paylı mirasçılar',
      'Mirasın geçmesi (külli halefiyet girişi)',
      'Mirasın reddi ve hükmi ret',
      'Miras ortaklığı / el birliği girişi',
    ],
    definitions: [
      {
        baslik: 'Zümre sistemi',
        govde:
          'Yasal mirasçılar zümreler hâlinde belirlenir. Birinci zümre (altsoy) varken ikinci zümre (ana-baba ve altsoyu) kural olarak mirasçı olmaz; aynı mantık sonraki zümreler için de işler.',
      },
      {
        baslik: 'Eşin yasal miras payı',
        govde:
          'Sağ kalan eş, birlikte mirasçı olduğu zümreye göre farklı pay alır. Pay, zümre tablosuyla birlikte yazılır; ezber “her zaman 1/2” yanlış yola götürür.',
      },
      {
        baslik: 'Saklı pay',
        govde:
          'Belirli mirasçıların, miras bırakanın iradesiyle tamamen yok edilemeyen minimum payıdır. İhlalde tenkis yolu 2. dönemde derinleşir; 1. dönemde oran ve kişi listesi bilinir.',
      },
      {
        baslik: 'Mirasın reddi',
        govde:
          'Mirasçının mirası kabul etmeme beyanıdır. Süre ve şekil şartları vardır; gerçek ret ile hükmi ret ayrımı sınavda puan taşır.',
      },
      {
        baslik: 'Külli halefiyet (giriş)',
        govde:
          'Mirasın, ölümle bir bütün olarak mirasçılara geçmesi ilkesidir. Haklar ve borçlar birlikte düşünülür; ret kararı bu yüzden kritiktir.',
      },
    ],
    traps: [
      'Eşin payını zümreyle yanlış birleştirmek.',
      'Saklı payı yasal pay sanmak.',
      'Zümre atlayıp “herkes mirasçı” yazmak.',
      'Ret süresini kaçırıp hâlâ ret iddia etmek.',
      'Miras ortaklığında tek mirasçının tek başına satımını geçerli sanmak.',
    ],
    keyMadde: [
      'TMK m.495 vd. — yasal mirasçılar / zümre çerçevesi',
      'TMK m.499 vd. — eşin mirasçılığı (çerçeve)',
      'TMK m.505 vd. — saklı pay (oranlar güncel metinden)',
      'TMK m.599 vd. — mirasın geçmesi',
      'TMK m.605 vd. — mirasın reddi',
      'TMK m.640 vd. — miras ortaklığı (el birliği bağlantısı)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Miras hukukuna giriş',
        paragraphs: [
          'Miras hukuku “kim, hangi payla, hangi irade sınırları içinde terekeye hak kazanır?” sorusuna cevap arar. Ölümle malvarlığı hakları ve borçları bir bütün olarak ele alınır.',
          'Sınavda ilk iş: vasiyet/miras sözleşmesi var mı yok mu? Yoksa yasal tablo; varsa yasal + ölüme bağlı tasarruf dengesi (2. dönem). 1. dönemde yasal omurga sağlam kurulur.',
        ],
        hapBilgi: 'Önce kim mirasçı → sonra pay → sonra saklı pay.',
      },
      {
        heading: 'B. Zümre sistemi',
        paragraphs: [
          'Birinci zümre altsoydur (çocuklar, torunlar…). İkinci zümre ana-baba ve onların altsoyudur. Üçüncü zümre büyük ana-baba ve altsoyudur. Önceki zümrede mirasçı varken sonraki zümre kural olarak devreye girmez.',
          'Temsil (yerine geçme) ve zümre içi paylaşma kuralları olay sorusunda tabloyu bozar. “Çocuk ölmüş, torun var” senaryosunda temsil kutusunu açın.',
        ],
        kartlar: [
          { baslik: '1. zümre', govde: 'Altsoy (çocuk, torun…).' },
          { baslik: '2. zümre', govde: 'Ana-baba ve altsoyları.' },
          { baslik: '3. zümre', govde: 'Büyük ana-baba ve altsoyları.' },
          { baslik: 'Kural', govde: 'Önceki zümre varken sonraki yok.' },
        ],
        uyari: 'Zümre atlama = otomatik sıfır riski. Önce zümreyi sabitleyin.',
      },
      {
        heading: 'C. Eşin yasal mirasçılığı',
        paragraphs: [
          'Sağ kalan eş yasal mirasçıdır; payı birlikte mirasçı olduğu zümreye göre değişir. Altsoyla, ana-babayla veya büyük ana-babayla mirasçılık farklı oranlar doğurur.',
          'Eş + çocuklar en sık sınav tablosudur. Mal rejimi tasfiyesi miras payından önce düşünülebilir; “hepsi miras” karıştırmayın (aile hukuku kesişimi).',
        ],
        bullets: [
          'Eş + altsoy',
          'Eş + ana-baba zümresi',
          'Eş + daha uzak zümre / yalnız eş',
          'Mal rejimi tasfiyesi notu (ayrı kutu)',
        ],
        hapBilgi: 'Eş payı = zümreye bağlı oran. Ezber formülü olayda yazıp kontrol edin.',
      },
      {
        heading: 'D. Saklı pay (1. dönem omurgası)',
        paragraphs: [
          'Saklı pay, belirli mirasçıların iradeyle tamamen yok edilemeyen minimum hakkıdır. Yasal paydan farklıdır: yasal pay “varsayılan tablo”, saklı pay “korunan taban”dır.',
          'Kimlerin saklı paylı olduğu ve oranların hangi maddede olduğu güncel TMK metninden doğrulanır. 1. dönemde oran + kişi listesi; tenkis davasının ayrıntısı 2. dönemde.',
        ],
        uyari: 'Saklı payı “yasal payın tamamı” sanmayın. Tenkis hesabı ayrı iskelettir.',
      },
      {
        heading: 'E. Mirasın geçmesi',
        paragraphs: [
          'Ölümle miras açılır; külli halefiyet ilkesiyle hak ve borçlar mirasçılara geçer (giriş düzeyi). Veraset belgesi ispat ve işlem kolaylığı sağlar; mülkiyetin “belgeden doğduğu” sanılmamalıdır.',
          'Tereke aktif–pasif dengesi ret kararını etkiler. Borçlu mirasta süre takvimi tutulur.',
        ],
      },
      {
        heading: 'F. Mirasın reddi',
        paragraphs: [
          'Gerçek ret: süresi içinde yetkili mercie beyan. Hükmi ret: belirli davranış/varsayımlarla ret sayılma (öğreti-kanun çerçevesi). Kaçırılan süre sonra “ben reddecektim” demek yetmez.',
          'Ret, ret edenin altsoyuna ve diğer mirasçılara etki eder. Kim pay alır sorusu yeniden kurulur.',
        ],
        bullets: [
          'Süre',
          'Şekil / merci',
          'Gerçek ret vs hükmi ret',
          'Ret sonrası pay tablosu',
        ],
      },
      {
        heading: 'G. Miras ortaklığı girişi',
        paragraphs: [
          'Birden fazla mirasçı el birliği mülkiyeti benzeri bir ortaklık içinde terekede hak sahibi olur. Tek mirasçının “ben satarım” refleksi kural olarak kilitlenir; paylaşma veya izale yolları devreye girer.',
          '2. dönemde paylaşma ve denkleştirme derinleşir; 1. dönemde rejim tanınır ve eşya hukuku el birliği notuyla bağ kurulur.',
        ],
        uyari: 'El birliği + tek taraflı satış = kırmızı alarm (miras + eşya kesişimi).',
      },
    ],
    examples: [
      {
        title: 'Eş + iki çocuk',
        facts:
          'Miras bırakanın eşi ve iki çocuğu vardır; vasiyet yoktur. Mal rejimi tasfiyesi olayda ayrıca verilmemiştir.',
        analysis:
          '1. zümre + eş. Yasal pay tablosu. Saklı pay ayrıca (oranlar TMK). Mal rejimi yoksa sadece miras payı yazılır.',
        takeaway: 'Önce yasal tablo, sonra saklı pay.',
      },
      {
        title: 'Zümre ve temsil',
        facts:
          'Miras bırakanın bir çocuğu kendisinden önce ölmüş; ölen çocuğun iki çocuğu (torunlar) hayattadır. Eş yoktur.',
        analysis:
          '1. zümre devam eder. Temsil: torunlar ölen çocuğun yerini alır. Pay bölünmesi yazılır.',
        takeaway: 'Ölen çocuk = otomatik 2. zümre demek değildir.',
      },
      {
        title: 'Borçlu miras — ret',
        facts:
          'Tereke ağır borçludur. Mirasçı reddetmek ister; süre dolmak üzeredir.',
        analysis:
          'Ret süresi ve merci. Gerçek ret. Ret etmezse külli halefiyetle borç riski. Hükmi ret var mı?',
        takeaway: 'Borçlu mirasta takvim tut.',
      },
      {
        title: 'Miras ortaklığı kilidi',
        facts:
          'Üç mirasçıdan biri tarlayı tek başına satmak ister; diğerleri karşı çıkar. Paylaşma yapılmamıştır.',
        analysis:
          'El birliği / miras ortaklığı. Birlikte tasarruf. Paylaşma veya ortaklığın giderilmesi. Tek başına satış geçersiz/riskli.',
        takeaway: 'Fiilî kullanım ≠ tek başına satım yetkisi.',
      },
    ],
    mindmap: {
      center: 'Miras · 1. dönem',
      branches: [
        { label: 'Kim?', items: ['Zümre', 'Eş', 'Devlet'] },
        { label: 'Pay', items: ['Yasal', 'Saklı'] },
        { label: 'Geçiş', items: ['Ölüm', 'Halefiyet'] },
        { label: 'Ret', items: ['Süre', 'Şekil', 'Sonuç'] },
      ],
    },
  };
}

function d2Content() {
  return {
    oneLiner:
      '2. dönem: Vasiyet ve miras sözleşmesi, tenkis, denkleştirme, paylaşma, istihkak. İrade + denge.',
    promise:
      'Ölüme bağlı tasarruflar, tenkis, denkleştirme, paylaşma ve miras sebebiyle istihkak. Bahar finalinin ağır topu.',
    sixtySecond: [
      'Ölüme bağlı tasarruf: vasiyetname / miras sözleşmesi.',
      'Şekil şartı ihlali = geçersizlik riski (türe göre).',
      'Saklı pay ihlali → tenkis (sıra ve süre).',
      'Denkleştirme: sağlararası kazandırmaların denkleştirilmesi.',
      'Paylaşma: ortaklığın sona erdirilmesi / taksim.',
      'İstihkak: miras hakkına dayalı talep (giriş+uygulama).',
    ],
    pillars: [
      'Ölüme bağlı tasarruflar genel',
      'Vasiyetname türleri ve şekil',
      'Miras sözleşmesi',
      'Atama, yoksunluk, çıkarma (çerçeve)',
      'Tenkis',
      'Denkleştirme',
      'Paylaşma ve taksim',
      'Miras sebebiyle istihkak ve iptal/yorum girişi',
    ],
    definitions: [
      {
        baslik: 'Vasiyetname',
        govde:
          'Miras bırakanın tek taraflı ölüme bağlı tasarrufudur. Resmî, el yazılı ve (sınırlı) sözlü türleri şekil rejimine bağlıdır.',
      },
      {
        baslik: 'Miras sözleşmesi',
        govde:
          'Miras bırakan ile karşı taraf arasında, ölüme bağlı sonuç doğuran iki taraflı işlemdir. Şekil ve bağlayıcılık vasiyetten farklıdır.',
      },
      {
        baslik: 'Tenkis',
        govde:
          'Saklı payın ihlal edilmesi hâlinde, saklı paylı mirasçının kazandırmaların indirilmesini istediği yoldur. Sıra ve süre kritiktir.',
      },
      {
        baslik: 'Denkleştirme',
        govde:
          'Miras bırakanın sağlığında bazı mirasçılara yaptığı kazandırmaların, paylaşma hesabında dikkate alınması rejimidir.',
      },
      {
        baslik: 'Paylaşma',
        govde:
          'Miras ortaklığının sona erdirilerek mirasçılara özgül payların verilmesi sürecidir. Anlaşma veya dava yolu.',
      },
    ],
    traps: [
      'Şekil şartını yok sayıp vasiyeti geçerli sanmak.',
      'Tenkis ile iptali aynı dava sanmak.',
      'Denkleştirmeyi tenkis ile karıştırmak.',
      'Saklı pay oranını uydurmak.',
      'Paylaşmayı “otomatik eşit nakit” sanmak — tereke niteliği önemli.',
    ],
    keyMadde: [
      'TMK m.531 vd. — vasiyetname türleri / şekil (çerçeve)',
      'TMK m.545 vd. — miras sözleşmesi (çerçeve)',
      'TMK m.560 vd. — tenkis',
      'TMK m.669 vd. — denkleştirme (çerçeve)',
      'TMK m.642 vd. — paylaşma',
      'TMK m.577 vd. — miras sebebiyle istihkak (çerçeve)',
    ],
    sectionsExtra: [
      {
        heading: 'A. Ölüme bağlı tasarruflar genel',
        paragraphs: [
          'Miras bırakan, yasal mirasçılığı belli sınırlar içinde iradesiyle şekillendirebilir. Araçlar: vasiyetname ve miras sözleşmesi. Sınır: saklı pay ve emredici kurallar.',
          'Sınavda önce tasarruf türünü adlandırın; sonra şekil; sonra içerik (atanma, belirli mal vasiyeti, yoksun bırakma, çıkarma); en sonda saklı pay/tenkis.',
        ],
        hapBilgi: 'Tür → şekil → içerik → saklı pay sınırı.',
      },
      {
        heading: 'B. Vasiyetname',
        paragraphs: [
          'Resmî vasiyetname noter/resmî memur önünde; el yazılı vasiyetname bizzat yazı, tarih ve imza unsurlarıyla; sözlü vasiyetname istisnai ve sıkı şartlıdır.',
          'Şekil eksikliği çoğu zaman geçersizlik tartışması açar. Yorumda miras bırakanın iradesi aranır; ama şekil önce gelir.',
        ],
        bullets: [
          'Resmî vasiyetname',
          'El yazılı vasiyetname',
          'Sözlü vasiyetname (istisna)',
          'İptal sebepleri (şekil, irade sakatlığı, ehliyet — çerçeve)',
        ],
        uyari: '“Bana söyledi” tek başına vasiyet değildir. Şekil yazın.',
      },
      {
        heading: 'C. Miras sözleşmesi',
        paragraphs: [
          'İki taraflı bağlayıcılık vasiyetten ayrılır. Feragat, atama veya diğer ölüme bağlı düzenlemeler sözleşmeyle yapılabilir. Şekil ve sona erme/bozma imkânı ayrı incelenir.',
          'Sınavda “vasiyet mi sözleşme mi?” ayrımı ilk satırda yapılmalıdır.',
        ],
      },
      {
        heading: 'D. Tenkis',
        paragraphs: [
          'Saklı pay ihlal edildiyse tenkis kutusu açılır. Hangi kazandırmalar tenkise tabi, hangi sırayla indirilir, süre ne — güncel madde ve öğreti iskeletiyle yazılır.',
          'Tenkis ≠ vasiyetin tamamen iptali. İptal ayrı sebeplere dayanır. Sınavda dava adını karıştırmayın.',
        ],
        kartlar: [
          { baslik: 'Koşul', govde: 'Saklı pay ihlali.' },
          { baslik: 'Amaç', govde: 'Saklı payı tamamlamak (indirme).' },
          { baslik: 'Sıra', govde: 'Kanuni tenkis sırası.' },
          { baslik: 'Süre', govde: 'Hak düşürücü / zamanaşımı çerçevesi.' },
        ],
        hapBilgi: 'Tenkis = saklı pay koruması. İptal = geçersizlik yolu.',
      },
      {
        heading: 'E. Denkleştirme',
        paragraphs: [
          'Sağlararası bazı kazandırmalar paylaşma hesabına iade/denkleştirme konusu olabilir. Amaç: mirasçılar arası adalet. Tenkisten farklıdır: tenkis saklı pay, denkleştirme paylaşım hesabıdır.',
          'Hangi kazandırmaların denkleştirmeye tabi olduğu olayda belirtilen niteliklere göre tartışılır.',
        ],
        uyari: 'Denkleştirme ≠ tenkis. İki ayrı kutu açın.',
      },
      {
        heading: 'F. Paylaşma',
        paragraphs: [
          'Mirasçılar anlaşarak veya dava yoluyla terekedeki malları paylaşır. El birliği sona erer; özgül paylar oluşur. Taşınmaz, taşınır, alacak farklı teknikler ister.',
          'İzale-i şüyu / ortaklığın giderilmesi eşya hukukuyla kesişir. Miras payı ile fiilî kullanım karıştırılmaz.',
        ],
        bullets: [
          'Anlaşmalı paylaşma',
          'Dava yolu paylaşma',
          'Özgül pay / bedel',
          'Eşya hukuku kesişimi',
        ],
      },
      {
        heading: 'G. İstihkak, iptal ve yorum',
        paragraphs: [
          'Miras sebebiyle istihkak: miras hakkına dayanan talep. Vasiyetnamenin iptali: ehliyet, irade sakatlığı, şekil vb. Yorum: belirsiz metinde iradenin ortaya çıkarılması.',
          '2. dönem finalinde sıkça “önce geçerli mi, yoksa tenkis mi, yoksa pay mı?” dallanması istenir. Kapıyı seçin.',
        ],
      },
    ],
    examples: [
      {
        title: 'El yazılı vasiyet — şekil',
        facts:
          'Miras bırakan bilgisayarda yazıp imzaladığı metni “vasiyetim” diye bırakır. Tarih el yazısı değildir.',
        analysis:
          'El yazılı vasiyet unsurları (bizzat yazı, tarih, imza). Eksik unsur → geçersizlik tartışması. Yasal miras devreye girer mi?',
        takeaway: 'Şekil önce; içerik sonra.',
      },
      {
        title: 'Tenkis',
        facts:
          'Miras bırakan tüm malvarlığını üçüncü kişiye bağışlar/vasiyet eder; saklı paylı çocuklar itiraz eder.',
        analysis:
          'Saklı pay ihlali. Tenkis şartları, sıra, süre. Kazandırmanın türü (sağlararası / ölüme bağlı).',
        takeaway: 'Saklı pay ihlali → tenkis kutusu.',
      },
      {
        title: 'Denkleştirme',
        facts:
          'Miras bırakan sağlığında bir çocuğa büyük bağış yapmış; diğer çocuk paylaşmada denkleştirme ister.',
        analysis:
          'Denkleştirmeye tabi kazandırma mı? Hesap nasıl kurulur? Tenkis ayrı mı?',
        takeaway: 'Denkleştirme = pay hesabı adaleti.',
      },
      {
        title: 'Paylaşma kilidi',
        facts:
          'Mirasçılar terekedeki ev ve tarla üzerinde anlaşamaz; biri satım ister, diğeri oturmak ister.',
        analysis:
          'Paylaşma davası / ortaklığın giderilmesi. Özgül pay veya bedel. El birliği sona erme.',
        takeaway: 'Anlaşma yoksa dava yolu; tek başına satış değil.',
      },
    ],
    mindmap: {
      center: 'Miras · 2. dönem',
      branches: [
        { label: 'İrade', items: ['Vasiyet', 'Sözleşme'] },
        { label: 'Koruma', items: ['Saklı pay', 'Tenkis'] },
        { label: 'Hesap', items: ['Denkleştirme', 'Pay'] },
        { label: 'Son', items: ['Paylaşma', 'İstihkak'] },
      ],
    },
  };
}

function yillikContent() {
  const a = d1Content();
  const b = d2Content();
  return {
    oneLiner:
      'Yıllık paket: Yasal mirasçılıktan vasiyet, tenkis ve paylaşıma kadar tek omurga.',
    promise:
      '1. + 2. dönem birleşik; yıllık program ve bütüncül tekrar için “tek cilt” miras notu.',
    sixtySecond: [
      ...a.sixtySecond.slice(0, 3),
      ...b.sixtySecond.slice(0, 3),
      'Yıllık sınavda: önce kim/pay, sonra irade/şekil, en sonda tenkis–paylaşma.',
    ],
    pillars: [...a.pillars.slice(0, 4), ...b.pillars.slice(0, 4)],
    definitions: [...a.definitions.slice(0, 3), ...b.definitions.slice(0, 3)],
    traps: [...a.traps.slice(0, 3), ...b.traps.slice(0, 3)],
    keyMadde: [...a.keyMadde.slice(0, 3), ...b.keyMadde.slice(0, 3)],
    sectionsExtra: [
      {
        heading: 'Yıllık kullanım kılavuzu',
        paragraphs: [
          'Dönemlik okuyan kendi yarısını, yıllık okuyan bu tam paketi kullanır. Öneri: zümre+eş+saklı pay → deneme → vasiyet+tenkis+paylaşma → karma deneme.',
          'Her soruda etiket: “Yasal tablo mu, ölüme bağlı tasarruf mu, tenkis/denkleştirme mi, paylaşma mı?”',
        ],
        hapBilgi: 'Yıllık başarı = doğru mirasçı + doğru pay + doğru irade/koruma yolu.',
        bullets: [
          'Hafta 1–4: zümre + eş + yasal pay',
          'Hafta 5–7: saklı pay + geçiş + ret',
          'Hafta 8–11: vasiyet + miras sözleşmesi + tenkis',
          'Hafta 12–14: denkleştirme + paylaşma + karma deneme',
        ],
      },
      ...a.sectionsExtra,
      ...b.sectionsExtra,
      {
        heading: 'Yıllık entegrasyon: sık soru tipleri',
        paragraphs: [
          'Tip 1 — Eş + çocuk yasal pay. Tip 2 — Temsil / zümre. Tip 3 — Ret. Tip 4 — El yazılı vasiyet şekli. Tip 5 — Tenkis. Tip 6 — Paylaşma.',
          'Karma olayda yasal tablo + vasiyet + saklı pay üst üste binebilir. Sıra: kim mirasçı → yasal pay → tasarruf geçerli mi → saklı pay/tenkis → paylaşma.',
        ],
        uyari: 'Tek cevapta tüm miras hukukunu özetlemeyin; sorunun kapısını seçin.',
      },
    ],
    examples: [...a.examples.slice(0, 2), ...b.examples.slice(0, 2), a.examples[2], b.examples[2]],
    mindmap: {
      center: 'Miras · Yıllık',
      branches: [
        { label: '1. yarı', items: ['Zümre', 'Eş', 'Saklı pay', 'Ret'] },
        { label: '2. yarı', items: ['Vasiyet', 'Tenkis', 'Paylaşma'] },
        { label: 'Hesap', items: ['Yasal pay', 'Denkleştirme'] },
        { label: 'Yöntem', items: ['Kim?', 'Pay?', 'İrade?'] },
      ],
    },
  };
}

const VARIANT_BUILDERS = {
  'miras-hukuku-donem-1': d1Content,
  'miras-hukuku-donem-2': d2Content,
  'miras-hukuku-yillik': yillikContent,
};

export const MIRAS_HUKUKU_VARIANTS = [
  'miras-hukuku-donem-1',
  'miras-hukuku-donem-2',
  'miras-hukuku-yillik',
];

export function buildMirasHukukuVariantNote(uni, variantCode) {
  const meta = baseMeta(variantCode);
  const bank = VARIANT_BUILDERS[variantCode]();
  const calLabel =
    uni.calendar === 'yillik'
      ? 'yıllık program'
      : uni.calendar === 'karma'
        ? 'karma program'
        : 'dönemlik program';

  const title = `${uni.shortName} Miras Hukuku ${meta.label} Ders Notu | ${uni.city}`;
  const h1 = `${uni.shortName} Miras Hukuku ${meta.h1Extra}`;
  const description = `${uni.name} için Miras Hukuku ${meta.short} notu: ${meta.scope}. Şematik, örnekli, PDF. Ücretsiz — Av. Fethi Güzel.`;

  const lead = `${uni.shortName} (${uni.city}) öğrencileri için Miras Hukuku ${meta.label.toLocaleLowerCase('tr-TR')} notudur. ${meta.scope}. Amaç: mirasçıyı, payı ve irade/koruma yolunu doğru seçip unsurlarıyla yazmak. Fakülte ${calLabel} kullansa da üçlü set esnek kullanılır.`;

  const sections = [
    {
      heading: '1. Bu notu nasıl kullanacaksın?',
      paragraphs: [
        `Bu dosya ${meta.label} kapsamına göre kesilmiştir. Dönemlik program kendi yarısını; yıllık veya bütüncül tekrar yıllık paketi kullanır.`,
        'Sıra: 60 sn omurga → tanım kartları → tuzaklar → bölümler → örnek olay → PDF.',
      ],
      bullets: [
        'PDF: “PDF indir / Yazdır” → Ctrl+P → PDF olarak kaydet',
        'Her olayda: kim mirasçı? pay? saklı pay?',
        'Vasiyet varsa önce şekil, sonra içerik',
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
      paragraphs: ['Soru tipine göre dayanaklar. Güncel metin: TMK Miras kitabı.'],
      bullets: bank.keyMadde.map((m, i) => `${i + 1}) ${m}`),
      uyari: 'Uydurma madde no / saklı pay oranı yazmayın; TMK’dan doğrulayın.',
    },
    {
      heading: '6. Sınav tuzağı defteri',
      paragraphs: ['Finalde puanı bu liste taşır.'],
      bullets: bank.traps,
    },
    ...bank.sectionsExtra,
    {
      heading: 'Sınav tekniği (Miras Hukuku)',
      paragraphs: [
        `${uni.shortName} klasiklerinde I-II-III başlık şart. 60 dk / 3 soruda soru başı ~18 dk.`,
        'İskelet: (1) kim mirasçı (2) yasal pay (3) saklı pay (4) ölüme bağlı tasarruf var mı (5) tenkis/denkleştirme/paylaşma (6) sonuç.',
      ],
      bullets: [
        'Zümre + eşi ilk 3 satırda yaz',
        'Saklı pay ≠ yasal pay ayrımını aç',
        'Vasiyette şekli atlama',
        'Tenkis / denkleştirme / iptal kapısını seç',
      ],
      hapBilgi: 'Doğru mirasçı + doğru pay + doğru yol = yüksek not.',
    },
  ];

  const diagrams = [
    {
      kind: 'mindmap',
      title: `Miras Hukuku ${meta.short} — zihin haritası`,
      center: bank.mindmap.center,
      branches: bank.mindmap.branches,
    },
    {
      kind: 'process',
      title: 'Klasik cevap iskeleti',
      steps: [
        'Kim mirasçı? (zümre + eş)',
        'Yasal pay tablosu',
        'Saklı pay var mı?',
        'Ölüme bağlı tasarruf? (şekil)',
        'Tenkis / denkleştirme / paylaşma',
        'Sonuç + süre',
      ],
    },
    {
      kind: 'compare',
      title: 'Sık karıştırılanlar',
      headers: ['A', 'B', 'Ayırıcı soru'],
      rows:
        variantCode === 'miras-hukuku-donem-2'
          ? [
              ['Vasiyetname', 'Miras sözleşmesi', 'Tek taraflı mı iki taraflı mı?'],
              ['Tenkis', 'İptal', 'Saklı pay indirme mi geçersizlik mi?'],
              ['Tenkis', 'Denkleştirme', 'Saklı pay mı pay hesabı mı?'],
              ['Paylaşma', 'Ret', 'Ortaklık bitirme mi mirası reddetme mi?'],
            ]
          : variantCode === 'miras-hukuku-donem-1'
            ? [
                ['Yasal pay', 'Saklı pay', 'Varsayılan tablo mu korunan taban mı?'],
                ['1. zümre', '2. zümre', 'Altsoy var mı?'],
                ['Gerçek ret', 'Hükmi ret', 'Açık beyan mı varsayım mı?'],
                ['Miras payı', 'Mal rejimi payı', 'Ölüm mirası mı evlilik tasfiyesi mi?'],
              ]
            : [
                ['1. yarı', '2. yarı', 'Yasal tablo mu irade/tenkis mi?'],
                ['Yasal pay', 'Saklı pay', 'Tablo mu taban mı?'],
                ['Tenkis', 'Denkleştirme', 'Saklı pay mı hesap mı?'],
                ['Vasiyet', 'Sözleşme', 'Tek taraf mı iki taraf mı?'],
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
      leftTitle: 'Tablo / oran',
      rightTitle: 'Olay',
      left: 'Zümre + eş payı + saklı pay oranı',
      right: 'Kim? pay? tasarruf? tenkis/paylaşma → hüküm',
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
      a: '1. dönem yasal mirasçılık–saklı pay–geçiş–ret; 2. dönem ölüme bağlı tasarruflar–tenkis–denkleştirme–paylaşma; yıllık ikisini birleştirir.',
    },
    {
      q: 'PDF nasıl indirilir?',
      a: '“PDF indir / Yazdır” veya …/pdf → Ctrl+P → PDF olarak kaydet. Kişisel kullanım.',
    },
    {
      q: 'Aile ve eşya notlarıyla birlikte mi?',
      a: 'Evet. Mal rejimi tasfiyesi aile; miras ortaklığı/el birliği eşya paketleriyle kesişir.',
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
    'Pusula maddeleri ve saklı pay oranlarını TMK’dan doğruladım',
    'PDF’i arşivledim',
    variantCode === 'miras-hukuku-yillik'
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
      `${uni.shortName} miras hukuku ${meta.short}`,
      `${uni.shortName} miras hukuku ders notu`,
      `miras hukuku ${meta.short} not pdf`,
      'yasal mirasçılık saklı pay tenkis ders notu',
      'miras hukuku yıllık not',
      ...uni.aliases.slice(0, 2).map((a) => `${a} miras hukuku`),
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
        'Zümre + eşi ilk yaz',
        'Yasal pay / saklı pay ayır',
        'Vasiyette şekli kontrol et',
        'Tenkis / denkleştirme kapısını seç',
        'PDF alıp basılı çalış',
      ],
    },
    learningOutcomes: [
      `Miras Hukuku ${meta.short} kapsamındaki kurumları ayırır`,
      'Yasal mirasçı ve pay tablosunu kurar',
      'Saklı pay ve tenkis yolunu seçer',
      'Ölüme bağlı tasarrufun şekil ve sonucunu uygular',
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
    relatedCourses: MIRAS_HUKUKU_VARIANTS.filter((c) => c !== variantCode).concat([
      'miras-hukuku',
      'aile-hukuku',
      'esya-hukuku-yillik',
    ]),
    relatedBilgi: [],
    updated: '2026-07-29',
    wordTarget: variantCode === 'miras-hukuku-yillik' ? 8000 : 5500,
    qualityTier: 'premium',
    variantOf: 'miras-hukuku',
    variantLabel: meta.label,
  };
}
