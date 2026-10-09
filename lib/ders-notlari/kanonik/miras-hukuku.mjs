/**
 * Miras Hukuku — kanonik katman (G19). Dayanaklar 4721 sayılı Türk Medenî Kanunu metnine bağlıdır (`content/mevzuat/tmk`).
 * Olaylar kurmacadır; kişi, tarih ve tutar örnek içindir. Pay hesapları yalnız kanundaki oranlarla yapılmıştır.
 */
const katman = {
  ders: 'miras-hukuku',
  temsilci: { uni: 'ankara', ders: 'miras-hukuku-yillik' },
  guncelleme: '2026-10-09',
  ornekOlaylar: [
    {
      baslik: 'Bütün terekeyi derneğe bırakan vasiyetname ve saklı paylar',
      olay:
        'Hasan, geride eşi Leyla ile iki çocuğu Ali ve Zeynep’i bırakarak ölmüştür. Terekenin net değeri 2.400.000 TL olup Hasan, ' +
        'resmî vasiyetnameyle terekenin tamamını bir kültür derneğine bırakmıştır. Vasiyetname 5 Şubat’ta açılmış ve mirasçılara ' +
        'bildirilmiştir. Mirasçılar neyi, hangi süre içinde isteyebileceklerini sormaktadır.',
      cozum:
        'Hesap yasal paylarla başlar. Sağ kalan eş altsoyla birlikte mirasın dörtte birini alır (Türk Medenî Kanunu (TMK) m.499/1), bu da ' +
        '600.000 TL’dir. Kalan 1.800.000 TL çocuklar arasında eşit bölünür (TMK m.495), her çocuğun yasal payı 900.000 TL’dir. Saklı ' +
        'pay altsoy için yasal payın yarısı, altsoyla birlikte mirasçı olan eş için yasal payın tamamıdır (TMK m.506). Buna göre Ali ve ' +
        'Zeynep’in saklı payı 450.000’er TL, Leyla’nınki 600.000 TL olup saklı paylar toplamı 1.500.000 TL’dir. Hasan yalnız saklı paylar ' +
        'dışında kalan 900.000 TL’lik kısımda tasarruf edebilir (TMK m.505). Vasiyetname bu sınırı aştığından mirasçılar tasarrufun ' +
        'tenkisini dava eder (TMK m.560). Dava hakkı saklı payın zedelendiğinin öğrenildiği tarihten başlayarak bir yıl ve her hâlde ' +
        'vasiyetnamenin açılmasından başlayarak on yıl geçmekle düşer (TMK m.571).',
      sonuc:
        'Tasarruf edilebilir kısım yasal paylardan saklı paylar çıkarılarak bulunur; aşan tasarruf geçersiz değildir, tenkis davasıyla indirilir.',
      dayanaklar: [
        { kanun: 'tmk', madde: '499', ifade: 'mirasbırakanın altsoyu ile birlikte mirasçı olursa, mirasın dörtte biri' },
        { kanun: 'tmk', madde: '495', ifade: 'çocuklar eşit olarak mirasçıdırlar' },
        { kanun: 'tmk', madde: '506', ifade: 'altsoy için yasal miras payının yarısı' },
        { kanun: 'tmk', madde: '506', ifade: 'altsoy veya ana ve baba zümresiyle birlikte mirasçı olması hâlinde yasal miras payının tamamı' },
        { kanun: 'tmk', madde: '505', ifade: 'mirasının saklı paylar dışında kalan kısmında ölüme bağlı tasarrufta bulunabilir' },
        { kanun: 'tmk', madde: '571', ifade: 'saklı paylarının zedelendiğini öğrendikleri tarihten başlayarak bir yıl' },
      ],
    },
    {
      baslik: 'Bilgisayarda yazılıp imzalanan tarihsiz vasiyetname',
      olay:
        'Nermin ölmeden önce evini yeğeni Selim’e bıraktığını bildiren bir metni bilgisayarda yazdırmış, çıktının altını kendi eliyle ' +
        'imzalamış, ancak tarih koymamıştır. Metin ölümden sonra Selim tarafından sulh mahkemesine sunulmuş ve açılmıştır. Yasal ' +
        'mirasçı olan kardeşler vasiyetnamenin geçersiz olduğunu ileri sürmektedir.',
      cozum:
        'Vasiyet resmî şekilde, mirasbırakanın el yazısıyla ya da sözlü olarak yapılabilir (TMK m.531). El yazılı vasiyetnamenin ' +
        'yapıldığı yıl, ay ve gün gösterilerek başından sonuna kadar mirasbırakanın el yazısıyla yazılmış ve imzalanmış olması ' +
        'zorunludur (TMK m.538). Bilgisayar çıktısı el yazısı değildir ve tarih de bulunmamaktadır, dolayısıyla tasarruf kanunda ' +
        'öngörülen şekle uyulmadan yapılmıştır. Şekle aykırılık kendiliğinden hükümsüzlük doğurmaz, bir iptal sebebidir ' +
        '(TMK m.557/4). Kardeşler iptal davasını tasarrufu, iptal sebebini ve hak sahibi olduklarını öğrendikleri tarihten başlayarak ' +
        'bir yıl içinde açmalıdır. Vasiyetnamenin açılmasından başlayarak iyiniyetli davalıya karşı on yıl geçmekle de hak düşer, ' +
        'hükümsüzlük ise def’i yoluyla her zaman ileri sürülebilir (TMK m.559).',
      sonuc: 'Şekle aykırı vasiyetname iptal edilebilir bir tasarruftur; iptal davası açılmazsa hüküm doğurmaya devam eder.',
      dayanaklar: [
        { kanun: 'tmk', madde: '531', ifade: 'resmî şekilde veya mirasbırakanın el yazısı ile ya da sözlü olarak yapılabilir' },
        { kanun: 'tmk', madde: '538', ifade: 'başından sonuna kadar mirasbırakanın el yazısıyla yazılmış ve imzalanmış olması zorunludur' },
        { kanun: 'tmk', madde: '557', ifade: 'tasarruf kanunda öngörülen şekillere uyulmadan yapılmışsa' },
        { kanun: 'tmk', madde: '559', ifade: 'iyiniyetli davalılara karşı on yıl' },
      ],
    },
    {
      baslik: 'Borçlu ölen babanın mirasını dört ay sonra reddetmek',
      olay:
        'Murat’ın babası 3 Ocak’ta ölmüş, Murat ölümü aynı gün öğrenmiştir. Babanın bankalara yaklaşık 3.000.000 TL borcu bulunmakta, ' +
        'malvarlığı ise eski bir otomobilden ibarettir. Banka Murat’a karşı takip başlatınca Murat 10 Mayıs’ta mirası reddetmek ' +
        'istemiş, başka bir mirasçı yoktur.',
      cozum:
        'Mirasçılar mirasbırakanın ölümüyle mirası bir bütün olarak kanun gereğince kazanır ve onun borçlarından kişisel olarak ' +
        'sorumlu olur (TMK m.599). Bu sorumluluktan kurtulmanın yolu mirasın reddidir (TMK m.605/1). Ret süresi üç ay olup yasal ' +
        'mirasçı için mirasbırakanın ölümünün öğrenildiği tarihten işler (TMK m.606). Süre 3 Nisan’da dolduğundan 10 Mayıs’taki ret ' +
        'beyanı süre dışında kalmaktadır. Murat’ın dayanabileceği hüküm TMK m.605/2’dir: Ölüm tarihinde mirasbırakanın ödemeden aczi ' +
        'açıkça belli veya resmen tespit edilmişse miras reddedilmiş sayılır. Murat, ölüm tarihinde borçların malvarlığını açıkça ' +
        'aştığını ispat ederek mirasın hükmen reddedilmiş sayıldığının tespitini ister.',
      sonuc: 'Üç aylık ret süresi kaçırılmışsa yol, ölüm anında terekenin borca batık olduğunun ispatıyla hükmen reddin tespitidir.',
      dayanaklar: [
        { kanun: 'tmk', madde: '599', ifade: 'mirasbırakanın borçlarından kişisel olarak sorumlu olurlar' },
        { kanun: 'tmk', madde: '606', ifade: 'miras, üç ay içinde reddolunabilir' },
        { kanun: 'tmk', madde: '605', ifade: 'ödemeden aczi açıkça belli veya resmen tespit edilmiş ise, miras reddedilmiş sayılır' },
      ],
    },
  ],
  sinavIskeleti: [
    {
      adim: 'Mirasçıların belirlenmesi',
      aciklama: 'Zümre sistemiyle yasal mirasçılar ve sağ kalan eş belirlenir; halefiyet ve evlilik dışı soybağı ayrıca denetlenir.',
    },
    {
      adim: 'Yasal paylar',
      aciklama: 'Eşin payı birlikte bulunduğu zümreye göre ayrılır, kalan kısım zümre içinde eşit bölünür ve her pay tutar olarak yazılır.',
    },
    {
      adim: 'Saklı pay ve tasarruf edilebilir kısım',
      aciklama: 'Her saklı paylı mirasçının oranı uygulanır; tasarruf edilebilir kısım terekeden saklı paylar toplamı çıkarılarak bulunur.',
    },
    {
      adim: 'Tasarrufun geçerliliği',
      aciklama: 'Ölüme bağlı tasarrufun şekli, ehliyet ve irade sakatlığı incelenir; iptal ile tenkis birbirinden ayrılır.',
    },
    {
      adim: 'Dava ve süreler',
      aciklama: 'İptal ve tenkis davalarının hak düşürücü süreleri öğrenme ve açılma tarihlerinden ayrı ayrı hesaplanır.',
    },
    {
      adim: 'Mirasın kazanılması ve reddi',
      aciklama: 'Mirasçının borçlardan sorumluluğu, üç aylık ret süresi ve hükmen ret olayın tarihlerine uygulanır.',
    },
  ],
  tuzakDefteri: [
    {
      tuzak: 'Sağ kalan eşin yasal payı her durumda mirasın dörtte biridir.',
      dogrusu: 'Eşin payı altsoyla dörtte bir, ana ve baba zümresiyle yarı, büyük ana ve büyük baba zümresiyle dörtte üçtür; bunlar yoksa mirasın tamamıdır.',
      dayanak: { kanun: 'tmk', madde: '499', ifade: 'bunlar da yoksa mirasın tamamı eşe kalır' },
    },
    {
      tuzak: 'Kardeşler saklı paylı mirasçıdır.',
      dogrusu: 'Saklı pay yalnız altsoy, ana ve baba ile sağ kalan eş için öngörülmüştür; kardeşlere ilişkin bent yürürlükten kaldırılmıştır.',
      dayanak: { kanun: 'tmk', madde: '506', ifade: 'ana ve babadan her biri için yasal miras payının dörtte biri' },
    },
    {
      tuzak: 'Evlilik dışında doğan çocuk babasına mirasçı olamaz.',
      dogrusu: 'Soybağı tanıma veya hâkim hükmüyle kurulmuşsa çocuk baba yönünden evlilik içi hısımlar gibi mirasçı olur.',
      dayanak: { kanun: 'tmk', madde: '498', ifade: 'baba yönünden evlilik içi hısımlar gibi mirasçı olurlar' },
    },
    {
      tuzak: 'Mirasbırakan saklı paylı mirasçısını dilediği sebeple mirasçılıktan çıkarabilir.',
      dogrusu: 'Çıkarma yalnız ağır suç ve aile hukukundan doğan yükümlülüklerin önemli ölçüde yerine getirilmemesi sebebiyle yapılabilir.',
      dayanak: { kanun: 'tmk', madde: '510', ifade: 'aile hukukundan doğan yükümlülüklerini önemli ölçüde yerine getirmemişse' },
    },
    {
      tuzak: 'Miras sözleşmesi adi yazılı şekilde yapılabilir.',
      dogrusu: 'Miras sözleşmesi resmî vasiyetname şeklinde düzenlenir ve taraflarca memurun ve iki tanığın önünde imzalanır.',
      dayanak: { kanun: 'tmk', madde: '545', ifade: 'resmî vasiyetname şeklinde düzenlenmesi gerekir' },
    },
    {
      tuzak: 'Mirasçı terekedeki haklara ancak paylaşmadan sonra sahip olur.',
      dogrusu: 'Mirasın geçmesiyle paylaşmaya kadar mirasçılar arasında bir ortaklık doğar ve mirasçılar terekeye elbirliğiyle sahip olur.',
      dayanak: { kanun: 'tmk', madde: '640', ifade: 'mirasçılar terekeye elbirliğiyle sahip olurlar' },
    },
  ],
  kisaTest: [
    {
      q: 'Altsoyu bulunmayan mirasbırakanın yasal mirasçıları kimlerdir?',
      choices: ['Kardeşleri', 'Ana ve babası', 'Büyük ana ve büyük babası', 'Yalnız sağ kalan eşi'],
      answer: 1,
      reason: 'TMK m.496 altsoyu bulunmayan mirasbırakanın mirasçılarını ana ve baba olarak belirler; kardeşler onların yerine halefiyet yoluyla geçer.',
      dayanak: { kanun: 'tmk', madde: '496', ifade: 'altsoyu bulunmayan mirasbırakanın mirasçıları, ana ve babasıdır' },
    },
    {
      q: 'Mirasbırakandan önce ölmüş çocuğun yerini kim alır?',
      choices: ['Sağ kalan eş', 'Diğer çocuklar', 'Kendi altsoyu', 'Hazine'],
      answer: 2,
      reason: 'TMK m.495 önce ölen çocuğun yerini her derecede halefiyet yoluyla kendi altsoyunun alacağını öngörür.',
      dayanak: { kanun: 'tmk', madde: '495', ifade: 'her derecede halefiyet yoluyla kendi altsoyları alır' },
    },
    {
      q: 'Aşağıdakilerden hangisi kanunda sayılan vasiyet şekillerinden biri değildir?',
      choices: ['Resmî vasiyetname', 'El yazılı vasiyetname', 'Sözlü vasiyet', 'Noterce onaylanmış bilgisayar çıktısı'],
      answer: 3,
      reason: 'TMK m.531 vasiyetin yalnız resmî, el yazılı ve sözlü şekillerde yapılabileceğini öngörür.',
      dayanak: { kanun: 'tmk', madde: '531', ifade: 'vasiyet, resmî şekilde veya mirasbırakanın el yazısı ile ya da sözlü olarak yapılabilir' },
    },
    {
      q: 'Mirasbırakanın saklı pay kurallarını etkisiz kılmak amacıyla yaptığı açık kazandırma hakkında hangisi doğrudur?',
      choices: [
        'Sağlararası olduğu için tenkise tâbi değildir.',
        'Ölüme bağlı tasarruflar gibi tenkise tâbidir.',
        'Kesin hükümsüzdür.',
        'Yalnız ölümden önceki bir yıl içinde yapılmışsa tenkis edilir.',
      ],
      answer: 1,
      reason: 'TMK m.565/1-4 bu kazandırmaları ölüme bağlı tasarruflar gibi tenkise tâbi tutar.',
      dayanak: { kanun: 'tmk', madde: '565', ifade: 'saklı pay kurallarını etkisiz kılmak amacıyla yaptığı açık olan kazandırmalar' },
    },
    {
      q: 'Vasiyetname ile atanmış mirasçı için ret süresi ne zaman işlemeye başlar?',
      choices: [
        'Mirasbırakanın ölümüyle',
        'Tasarrufun kendisine resmen bildirildiği tarihten',
        'Vasiyetnamenin yazıldığı tarihten',
        'Tereke tespitinin tamamlandığı tarihten',
      ],
      answer: 1,
      reason: 'TMK m.606 atanmış mirasçılar için üç aylık sürenin tasarrufun resmen bildirildiği tarihten işleyeceğini öngörür.',
      dayanak: { kanun: 'tmk', madde: '606', ifade: 'mirasbırakanın tasarrufunun kendilerine resmen bildirildiği tarihten işlemeye başlar' },
    },
    {
      q: 'Tenkis iddiası, dava süresi geçtikten sonra nasıl ileri sürülebilir?',
      choices: ['Hiçbir şekilde ileri sürülemez.', 'Def’i yoluyla her zaman', 'Yalnız Hazineye karşı', 'Ancak yeni bir tasarruf bulunursa'],
      answer: 1,
      reason: 'TMK m.571 son cümlesi tenkis iddiasının def’i yoluyla her zaman ileri sürülebileceğini öngörür.',
      dayanak: { kanun: 'tmk', madde: '571', ifade: 'yoluyla her zaman ileri sürülebilir' },
    },
  ],
  kaynaklar: [
    {
      title: '4721 sayılı Türk Medenî Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.4721.pdf',
      note: 'Örnek olay, tuzak ve test dayanaklarının resmî metni',
    },
  ],
};

export default katman;
