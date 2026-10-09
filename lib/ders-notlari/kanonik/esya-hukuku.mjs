/**
 * Eşya Hukuku — kanonik katman (G19). Dayanaklar 4721 sayılı Türk Medenî Kanunu ve 6098 sayılı Türk Borçlar Kanunu metnine
 * bağlıdır (`content/mevzuat/tmk`, `content/mevzuat/tbk`). Olaylar kurmacadır; kişi, tarih ve tutar örnek içindir.
 */
const katman = {
  ders: 'esya-hukuku',
  temsilci: { uni: 'ankara', ders: 'esya-hukuku-yillik' },
  guncelleme: '2026-10-09',
  ornekOlaylar: [
    {
      baslik: 'Harici satışla alınan arsa için tescil talebi',
      olay:
        'Recep, köyündeki bir arsayı 2019’da komşusu Fikret’ten muhtar ve iki tanığın imzaladığı adi yazılı bir “harici satış ' +
        'senedi”yle 300.000 TL’ye satın almış, bedeli ödemiş ve arsayı kullanmaya başlamıştır. Fikret tapuda devir yapmadan ölmüş, ' +
        'mirasçıları devre yanaşmamaktadır. Recep arsanın adına tescilini istemektedir.',
      cozum:
        'Taşınmaz mülkiyeti kural olarak tescille kazanılır (Türk Medenî Kanunu (TMK) m.705/1). Taşınmaz mülkiyetinin devrini amaçlayan ' +
        'sözleşmenin geçerliliği resmî şekilde düzenlenmesine bağlıdır (TMK m.706/1). Adi yazılı harici satış resmî şekil koşulunu ' +
        'karşılamadığından geçersizdir ve Recep’e tescil isteme hakkı veren bir hukuki sebep oluşturmaz, zira TMK m.716 malikten tescil ' +
        'istenmesini mülkiyetin kazanılmasına esas olacak bir hukuki sebebe bağlar. Recep’in yolu, geçersiz sözleşmeye dayanarak ödediği ' +
        'bedeli sebepsiz zenginleşme hükümleriyle geri istemektir, çünkü zenginleşme geçerli olmayan bir sebebe dayanmaktadır (Türk ' +
        'Borçlar Kanunu (TBK) m.77). Bu istem, geri isteme hakkının öğrenilmesinden başlayarak iki yıllık süreye tâbidir (TBK m.82).',
      sonuc: 'Resmî şekle uyulmadan yapılan taşınmaz satışı tescil hakkı doğurmaz; ödenen bedel sebepsiz zenginleşmeyle geri istenir.',
      dayanaklar: [
        { kanun: 'tmk', madde: '705', ifade: 'taşınmaz mülkiyetinin kazanılması, tescille olur' },
        { kanun: 'tmk', madde: '706', ifade: 'resmî şekilde düzenlenmiş bulunmalarına bağlıdır' },
        { kanun: 'tmk', madde: '716', ifade: 'mülkiyetin kazanılmasına esas olacak bir hukukî sebebe dayanarak' },
        { kanun: 'tbk', madde: '77', ifade: 'zenginleşmenin geçerli olmayan veya gerçekleşmemiş ya da sona ermiş bir sebebe dayanması' },
      ],
    },
    {
      baslik: 'Sahte vekâletnameyle satılan daire ve iyiniyetli alıcı',
      olay:
        'Gülay’ın İzmir’deki dairesi, sahte vekâletname düzenleyen Tarık tarafından 2024’te kendi adına tescil ettirilmiş, Tarık da daireyi ' +
        'iki ay sonra tapu kaydını inceleyerek alan Ebru’ya satmıştır. Ebru sahteciliği bilmemekte ve bilmesini gerektiren bir durum ' +
        'bulunmamaktadır. Gülay hem Tarık’a hem Ebru’ya karşı tapunun kendi adına düzeltilmesini istemektedir.',
      cozum:
        'Sahte vekâletnameye dayanan tescil, bağlayıcı olmayan bir hukuki işleme dayandığından yolsuzdur (TMK m.1024). Gülay, yolsuz ' +
        'tescili bilen Tarık’a karşı tapu sicilinin düzeltilmesini dava edebilir (TMK m.1025). Ebru yönünden ise tapu kütüğündeki tescile ' +
        'iyiniyetle dayanarak mülkiyet kazanan üçüncü kişinin kazanımı korunur (TMK m.1023). Kanunun iyiniyete sonuç bağladığı durumlarda ' +
        'asıl olan iyiniyetin varlığıdır (TMK m.3/1), dolayısıyla Ebru’nun kötüniyetini Gülay ispat etmelidir. Ebru’nun kazanımı ' +
        'korunursa Gülay’ın zararı tapu sicilinin tutulmasından doğmuştur ve bu zarardan Devlet sorumludur (TMK m.1007/1). Devlet, ' +
        'kusurlu görevlilere rücu eder, Tarık’ın haksız fiilden doğan sorumluluğu ise ayrıca sürer.',
      sonuc:
        'Yolsuz tescil kötüniyetli kişiye karşı düzeltilir; iyiniyetli üçüncü kişinin kazanımı korunur ve malikin zararı Devletten istenir.',
      dayanaklar: [
        { kanun: 'tmk', madde: '1024', ifade: 'bağlayıcı olmayan bir hukukî işleme dayanan veya hukukî sebepten yoksun bulunan tescil yolsuzdur' },
        { kanun: 'tmk', madde: '1025', ifade: 'tapu sicilinin düzeltilmesini dava edebilir' },
        { kanun: 'tmk', madde: '1023', ifade: 'tapu kütüğündeki tescile iyiniyetle dayanarak mülkiyet veya bir başka aynî hak kazanan üçüncü kişinin bu kazanımı korunur' },
        { kanun: 'tmk', madde: '3', ifade: 'asıl olan iyiniyetin varlığıdır' },
        { kanun: 'tmk', madde: '1007', ifade: 'tapu sicilinin tutulmasından doğan bütün zararlardan devlet sorumludur' },
      ],
    },
    {
      baslik: 'Tamirciye bırakılan dizüstü bilgisayar ile çalınan bisiklet',
      olay:
        'Aslı dizüstü bilgisayarını tamir için bir servise bırakmış, servis sahibi bilgisayarı kendi malıymış gibi Okan’a satmıştır. ' +
        'Aynı hafta Aslı’nın bisikleti apartman girişinden çalınmış ve bir ikinci el pazarında iyiniyetli Pınar’a 9.000 TL’ye ' +
        'satılmıştır. Aslı iki malı da geri istemektedir.',
      cozum:
        'Taşınır mülkiyetinin nakli zilyetliğin devrini gerektirir ve iyiniyetle, malik olmak üzere devralan kişi, devredenin yetkisi ' +
        'olmasa bile zilyetlik hükümlerinin koruduğu hâllerde malik olur (TMK m.763). Servis sahibi bilgisayarın emin sıfatıyla zilyedidir. ' +
        'Emin sıfatıyla zilyetten iyiniyetle mülkiyet edinen Okan’ın edinimi korunduğundan Aslı bilgisayarı ondan geri isteyemez ' +
        '(TMK m.988) ve zararını servis sahibinden ister. Bisiklet ise Aslı’nın iradesi dışında elinden çıkmıştır. Çalınan taşınırın ' +
        'zilyedi onu elinde bulunduran herkese karşı beş yıl içinde taşınır davası açabilir, ne var ki taşınır pazardan iyiniyetle ' +
        'edinilmişse dava ancak ödenen bedelin geri verilmesi koşuluyla açılabilir (TMK m.989). Aslı bisikleti Pınar’dan, ona 9.000 TL’yi ' +
        'ödeyerek geri alabilir.',
      sonuc:
        'Emanet edilen malda iyiniyetli edinen korunur; çalınan malda malik beş yıl içinde geri ister, pazardan alana bedeli öder.',
      dayanaklar: [
        { kanun: 'tmk', madde: '763', ifade: 'taşınır mülkiyetinin nakli için zilyetliğin devri gerekir' },
        { kanun: 'tmk', madde: '988', ifade: 'emin sıfatıyla zilyedinden o şey üzerinde iyiniyetle mülkiyet' },
        { kanun: 'tmk', madde: '989', ifade: 'ancak ödenen bedelin geri verilmesi koşuluyla açılabilir' },
      ],
    },
  ],
  sinavIskeleti: [
    {
      adim: 'Hakkın ve eşyanın niteliği',
      aciklama: 'Uyuşmazlığın taşınır mı taşınmaz mı olduğu ve hangi aynî hakka ilişkin bulunduğu ilk cümlede belirlenir.',
    },
    {
      adim: 'Kazanma yolu',
      aciklama: 'Taşınmazda tescil ile tescilden önce kazanma, taşınırda zilyetliğin devri ve zamanaşımı ayrılır.',
    },
    {
      adim: 'Hukuki sebebin geçerliliği',
      aciklama: 'Kazanmaya esas işlemin şekli ve geçerliliği denetlenir; geçersiz işlem yolsuz tescile ya da sebepsiz zenginleşmeye götürür.',
    },
    {
      adim: 'İyiniyetli üçüncü kişi',
      aciklama: 'Tapu siciline ya da zilyetliğe güvenin koruduğu kişi ve iyiniyet karinesinin kime ispat yükü yüklediği yazılır.',
    },
    {
      adim: 'Dava ve süre',
      aciklama: 'İstihkak, elatmanın önlenmesi, sicilin düzeltilmesi, taşınır davası ve tescil davası ayrılır; süreler olaya uygulanır.',
    },
    {
      adim: 'Tazminat',
      aciklama: 'Hakkını kaybeden malikin kimden, hangi sorumluluk hükmüne dayanarak tazminat isteyeceği belirtilir.',
    },
  ],
  tuzakDefteri: [
    {
      tuzak: 'Taşınmaz mülkiyeti her durumda tapuya tescil anında kazanılır.',
      dogrusu: 'Miras, mahkeme kararı, cebrî icra, işgal ve kamulaştırmada mülkiyet tescilden önce kazanılır; tasarruf için ise tescil gerekir.',
      dayanak: { kanun: 'tmk', madde: '705', ifade: 'mülkiyet tescilden önce kazanılır' },
    },
    {
      tuzak: 'Tapuda kayıtlı olmayan taşınmazı on yıl zilyetlikte bulunduran kişi tescil isteyebilir.',
      dogrusu: 'Olağanüstü zamanaşımı davasız ve aralıksız yirmi yıl, malik sıfatıyla zilyetlik gerektirir.',
      dayanak: { kanun: 'tmk', madde: '713', ifade: 'davasız ve aralıksız olarak yirmi yıl süreyle ve malik sıfatıyla' },
    },
    {
      tuzak: 'Taşınırda kazandırıcı zamanaşımı süresi on yıldır.',
      dogrusu: 'Başkasının taşınırını davasız ve aralıksız beş yıl iyiniyetle ve malik sıfatıyla zilyetliğinde bulunduran kişi malik olur.',
      dayanak: { kanun: 'tmk', madde: '777', ifade: 'davasız ve aralıksız beş yıl iyiniyetle ve malik sıfatıyla' },
    },
    {
      tuzak: 'Zilyet, malını almaya çalışana karşı kuvvet kullanamaz, yalnız dava açabilir.',
      dogrusu: 'Zilyet her türlü gasp veya saldırıyı kuvvet kullanarak defedebilir, ancak durumun haklı göstermediği derecede kuvvetten kaçınır.',
      dayanak: { kanun: 'tmk', madde: '981', ifade: 'her türlü gasp veya saldırıyı kuvvet kullanarak defedebilir' },
    },
    {
      tuzak: 'Komşuya her türlü gürültü ve koku yasaktır.',
      dogrusu: 'Yasak olan, taşınmazın durumu, niteliği ve yerel âdete göre komşular arasında hoş görülebilecek dereceyi aşan taşkınlıktır.',
      dayanak: { kanun: 'tmk', madde: '737', ifade: 'hoş görülebilecek dereceyi aşan' },
    },
    {
      tuzak: 'Bütünleyici parça asıl şeyden ayrı olarak başka birinin mülkiyetinde kalabilir.',
      dogrusu: 'Bir şeye malik olan kimse, o şeyin bütünleyici parçalarına da malik olur.',
      dayanak: { kanun: 'tmk', madde: '684', ifade: 'bütünleyici parçalarına da malik olur' },
    },
  ],
  kisaTest: [
    {
      q: 'Malik, malını haksız olarak elinde bulunduran kişiye karşı hangi davayı açar?',
      choices: ['Tapu iptali ve tescil davası', 'İstihkak davası', 'Zilyetliğin gasbı davası', 'Tenkis davası'],
      answer: 1,
      reason: 'TMK m.683/2 malike, malını haksız olarak elinde bulunduran kişiye karşı istihkak davası açma hakkı tanır.',
      dayanak: { kanun: 'tmk', madde: '683', ifade: 'istihkak davası açabileceği gibi' },
    },
    {
      q: 'TMK’ya göre zilyet kimdir?',
      choices: [
        'Tapuda malik görünen kişi',
        'Bir şey üzerinde fiilî hâkimiyeti bulunan kişi',
        'Şeyi iyiniyetle satın alan kişi',
        'Şeyin bedelini ödeyen kişi',
      ],
      answer: 1,
      reason: 'TMK m.973/1 bir şey üzerinde fiilî hâkimiyeti bulunan kimseyi zilyet sayar.',
      dayanak: { kanun: 'tmk', madde: '973', ifade: 'bir şey üzerinde fiilî hâkimiyeti bulunan kimse onun zilyedidir' },
    },
    {
      q: 'Tapu sicilindeki bir kaydı bilmediğini ileri süren kişi hakkında hangisi doğrudur?',
      choices: [
        'İyiniyetli sayılır ve korunur.',
        'Kaydı bilmediğini ileri süremez.',
        'Kaydı bilmediğini ispat ederse korunur.',
        'Yalnız tapu memuruna karşı ileri sürebilir.',
      ],
      answer: 1,
      reason: 'TMK m.1020/3 kimsenin tapu sicilindeki bir kaydı bilmediğini ileri süremeyeceğini öngörür.',
      dayanak: { kanun: 'tmk', madde: '1020', ifade: 'kimse tapu sicilindeki bir kaydı bilmediğini ileri süremez' },
    },
    {
      q: 'Başkasının zilyetliğindeki şeyi gasbeden kişi, üstün hakkı olduğunu ileri sürerse ne olur?',
      choices: [
        'Üstün hakkını iddia etmesi geri vermekten kurtulmasına yeter.',
        'Kural olarak yine geri vermekle yükümlüdür; üstün hakkını derhâl ispat ederse kaçınabilir.',
        'Şey hâkim kararıyla satılır.',
        'Zilyetlik davası zamanaşımına uğrar.',
      ],
      answer: 1,
      reason: 'TMK m.982 gasbedenin üstün hak iddiasına rağmen geri verme yükümlülüğünü, derhâl ispat hâli dışında korur.',
      dayanak: { kanun: 'tmk', madde: '982', ifade: 'o şey üzerinde üstün bir hakka sahip olduğunu iddia etse bile onu geri vermekle yükümlüdür' },
    },
    {
      q: 'Taşınmazı miras yoluyla kazanan mirasçı tescili nasıl yaptırır?',
      choices: [
        'Ancak tescil davası açarak',
        'Diğer mirasçıların noter onaylı muvafakatiyle',
        'Tescili doğrudan doğruya yaptırabilir',
        'Tescil yaptıramaz, mülkiyet zaten tapu dışında kalır',
      ],
      answer: 2,
      reason: 'TMK m.716/2 işgal, miras, kamulaştırma, cebrî icra veya mahkeme kararıyla kazanan kişinin tescili doğrudan yaptırabileceğini öngörür.',
      dayanak: { kanun: 'tmk', madde: '716', ifade: 'tescili doğrudan doğruya yaptırabilir' },
    },
  ],
  kaynaklar: [
    {
      title: '4721 sayılı Türk Medenî Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.4721.pdf',
      note: 'Örnek olay, tuzak ve test dayanaklarının resmî metni',
    },
    {
      title: '6098 sayılı Türk Borçlar Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6098.pdf',
      note: 'Geçersiz satışta sebepsiz zenginleşme dayanağı',
    },
  ],
};

export default katman;
