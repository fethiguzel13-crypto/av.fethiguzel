/**
 * Medenî Usul Hukuku — kanonik katman (G19). Dayanaklar 6100 sayılı Hukuk Muhakemeleri Kanunu metnine bağlıdır
 * (`content/mevzuat/hmk`). Olaylar kurmacadır; kişi, tarih ve tutar örnek içindir. Senetle ispat sınırı (HMK m.200) her yıl
 * yeniden değerlendiğinden ve yerel metin yalnız ilk tutarı taşıdığından katmana alınmamıştır.
 */
const katman = {
  ders: 'medeni-usul',
  temsilci: { uni: 'ankara', ders: 'medeni-usul-yillik' },
  guncelleme: '2026-10-09',
  ornekOlaylar: [
    {
      baslik: 'Antalya’daki taşınmaz için Ankara’da açılan tapu iptali davası',
      olay:
        'Ankara’da oturan Kemal, İzmir’de oturan kardeşi Ayşe adına tescilli Antalya’daki bir villanın tapusunun iptali ve kendi adına ' +
        'tescili için Ankara Asliye Hukuk Mahkemesinde dava açmıştır. Ayşe cevap dilekçesinde yetki itirazında bulunmamış, yalnız ' +
        'esasa ilişkin savunma yapmıştır. Kemal, itiraz olmadığı için Ankara mahkemesinin yetkili hâle geldiğini ileri sürmektedir.',
      cozum:
        'Görev yönünden dava bir malvarlığı hakkına ilişkin olduğundan Hukuk Muhakemeleri Kanunu (HMK) m.2 uyarınca asliye hukuk ' +
        'mahkemesinde görülür. Yetki yönünden ise taşınmaz üzerindeki ayni hakka ilişkin davalarda taşınmazın bulunduğu yer mahkemesi ' +
        'kesin yetkilidir (HMK m.12/1), dolayısıyla yetkili mahkeme Antalya mahkemesidir. Kesin yetkide mahkeme yetkili olup olmadığını ' +
        'davanın sonuna kadar kendiliğinden araştırmak zorundadır (HMK m.19/1). Davalının süresinde itiraz etmemesiyle mahkemenin yetkili ' +
        'hâle gelmesi yalnız yetkinin kesin olmadığı davalara özgüdür (HMK m.19/4). Kesin yetki HMK m.114/1-ç uyarınca dava şartı ' +
        'olduğundan Ankara mahkemesi yetkisizlik kararı verir ve kararında yetkili mahkemeyi gösterir (HMK m.19/3).',
      sonuc: 'Kesin yetkide davalının susması mahkemeyi yetkili kılmaz; taşınmazın aynına ilişkin dava bulunduğu yerde görülür.',
      dayanaklar: [
        { kanun: 'hmk', madde: '12', ifade: 'taşınmazın bulunduğu yer mahkemesi kesin yetkilidir' },
        { kanun: 'hmk', madde: '19', ifade: 'davanın sonuna kadar kendiliğinden araştırmak zorundadır' },
        { kanun: 'hmk', madde: '114', ifade: 'yetkinin kesin olduğu hâllerde, mahkemenin yetkili bulunması' },
      ],
    },
    {
      baslik: 'Süresinde cevap vermeyen davalının sonradan öne sürdüğü ödeme',
      olay:
        'Bir inşaat malzemesi satıcısı, 480.000 TL’lik fatura bedeli için alıcı aleyhine dava açmıştır. Dava dilekçesi alıcıya ' +
        '2 Şubat’ta tebliğ edilmiş, alıcı iki hafta içinde cevap dilekçesi vermemiştir. Dilekçeler aşaması ve ön inceleme bittikten ' +
        'sonra alıcı, bedelin 200.000 TL’sini banka havalesiyle ödediğini ileri sürerek dekont sunmak istemektedir.',
      cozum:
        'Cevap süresi dava dilekçesinin tebliğinden itibaren iki haftadır (HMK m.127). Süresinde cevap vermeyen davalı, davacının dava ' +
        'dilekçesinde ileri sürdüğü vakıaların tamamını inkâr etmiş sayılır (HMK m.128), yani satıcı satımı ve teslimi yine ispat eder. ' +
        'Ödeme ise davacının vakıalarını inkârdan ibaret olmayıp alıcının kendi lehine ileri sürdüğü yeni bir vakıadır ve ispat yükü ' +
        'ondan hak çıkaran alıcıdadır (HMK m.190/1). Dilekçelerin karşılıklı verilmesinden sonra savunma genişletilemeyeceğinden ' +
        '(HMK m.141/1) alıcı bu vakıayı ancak ıslah yoluyla ya da davacının açık muvafakatiyle ileri sürebilir (HMK m.141/2).',
      sonuc:
        'Cevap vermemek inkâr sayılır, kabul sayılmaz; ne var ki ödeme gibi yeni bir vakıa dilekçeler aşamasından sonra ıslah ya da açık muvafakat ister.',
      dayanaklar: [
        { kanun: 'hmk', madde: '127', ifade: 'dava dilekçesinin davalıya tebliğinden itibaren iki haftadır' },
        { kanun: 'hmk', madde: '128', ifade: 'vakıaların tamamını inkâr etmiş sayılır' },
        { kanun: 'hmk', madde: '190', ifade: 'iddia edilen vakıaya bağlanan hukuki sonuçtan kendi lehine hak çıkaran tarafa aittir' },
        { kanun: 'hmk', madde: '141', ifade: 'ıslah ve karşı tarafın açık muvafakati hükümleri saklıdır' },
      ],
    },
    {
      baslik: 'Aynı alacak için ikinci dava ve tahkim şartı',
      olay:
        'İki şirket arasındaki dağıtım sözleşmesinde uyuşmazlıkların tahkim yoluyla çözüleceği kararlaştırılmıştır. Dağıtıcı şirket, ' +
        'prim alacağı için Mart ayında İstanbul’da dava açmış, dava sürerken aynı alacak için Mayıs ayında Bursa’da ikinci bir dava ' +
        'açmıştır. Davalı şirket İstanbul’daki davada cevap dilekçesinde tahkim itirazında bulunmuş, Bursa’daki davada ise derdestlik ' +
        'savunması yapmıştır.',
      cozum:
        'Bursa’daki dava yönünden aynı davanın daha önce açılmış ve hâlen görülmekte olmaması bir dava şartıdır (HMK m.114/1-ı). ' +
        'Mahkeme dava şartlarını davanın her aşamasında kendiliğinden araştırır ve noksanlığı tespit ederse davayı usulden reddeder ' +
        '(HMK m.115). İstanbul’daki dava yönünden ise uyuşmazlığın tahkim yoluyla çözülmesi gerektiği itirazı bir ilk itirazdır ' +
        '(HMK m.116/1-b). Dava şartından farklı olarak ilk itiraz mahkemece kendiliğinden gözetilmez, bütün ilk itirazlar cevap ' +
        'dilekçesinde ileri sürülmek zorundadır ve aksi hâlde dinlenemez (HMK m.117/1). Davalı itirazı cevap dilekçesinde yaptığından ' +
        'mahkeme, dava şartlarını inceledikten sonra tahkim sözleşmesinin varlığını inceler (HMK m.117/2).',
      sonuc: 'Derdestlik dava şartıdır ve kendiliğinden gözetilir; tahkim ise ilk itirazdır ve davalının süresinde ileri sürmesine bağlıdır.',
      dayanaklar: [
        { kanun: 'hmk', madde: '114', ifade: 'aynı davanın, daha önceden açılmış ve hâlen görülmekte olmaması' },
        { kanun: 'hmk', madde: '115', ifade: 'davanın her aşamasında kendiliğinden araştırır' },
        { kanun: 'hmk', madde: '116', ifade: 'uyuşmazlığın tahkim yoluyla çözümlenmesi gerektiği itirazı' },
        { kanun: 'hmk', madde: '117', ifade: 'ilk itirazların hepsi cevap dilekçesinde ileri sürülmek zorundadır' },
      ],
    },
  ],
  sinavIskeleti: [
    {
      adim: 'Yargı yolu ve görev',
      aciklama: 'Uyuşmazlığın adli yargıda hangi mahkemede görüleceği kanuna dayanarak yazılır; görev kamu düzenindendir ve kendiliğinden incelenir.',
    },
    {
      adim: 'Yetki',
      aciklama: 'Önce genel yetki, sonra özel ve kesin yetki kuralı aranır; kesin yetkide itiraz yokluğu sonucu değiştirmez.',
    },
    {
      adim: 'Dava şartları ve ilk itirazlar',
      aciklama: 'Ehliyet, hukuki yarar, derdestlik ve kesin hüküm dava şartı olarak, yetki ve tahkim itirazı ilk itiraz olarak ayrı başlıklarda incelenir.',
    },
    {
      adim: 'Dilekçeler ve süreler',
      aciklama: 'Cevap süresi, cevap verilmemesinin sonucu ve iddia ile savunmanın genişletilmesi yasağı olaydaki tarihlerle hesaplanır.',
    },
    {
      adim: 'İspat',
      aciklama: 'Her vakıa için ispat yükünün kimde olduğu ve hangi delille ispatlanacağı ayrı ayrı yazılır.',
    },
    {
      adim: 'Karar ve kanun yolu',
      aciklama: 'Usulden ret, yetkisizlik ya da esas hakkında hüküm ayrılır ve kanun yolu süresinin başlangıcı belirtilir.',
    },
  ],
  tuzakDefteri: [
    {
      tuzak: 'Görevsizlik itirazı cevap dilekçesinde yapılmazsa mahkeme görevli hâle gelir.',
      dogrusu: 'Göreve ilişkin kurallar kamu düzenindendir; görev dava şartıdır ve her aşamada kendiliğinden gözetilir.',
      dayanak: { kanun: 'hmk', madde: '1', ifade: 'göreve ilişkin kurallar, kamu düzenindendir' },
    },
    {
      tuzak: 'Yetki itirazı ön inceleme duruşmasında da ilk kez ileri sürülebilir.',
      dogrusu: 'Kesin olmayan yetkide itiraz cevap dilekçesinde ve yetkili mahkeme gösterilerek yapılır, aksi takdirde dikkate alınmaz.',
      dayanak: { kanun: 'hmk', madde: '19', ifade: 'yetki itirazının, cevap dilekçesinde ileri sürülmesi gerekir' },
    },
    {
      tuzak: 'Süresinde cevap vermeyen davalı, davacının iddialarını kabul etmiş sayılır.',
      dogrusu: 'Davalı, dava dilekçesindeki vakıaların tamamını inkâr etmiş sayılır; davacının ispat yükü sürer.',
      dayanak: { kanun: 'hmk', madde: '128', ifade: 'vakıaların tamamını inkâr etmiş sayılır' },
    },
    {
      tuzak: 'Her sözleşmeye yetki şartı konularak dava belirli bir mahkemeye bağlanabilir.',
      dogrusu: 'Yetki sözleşmesini yalnız tacirler veya kamu tüzel kişileri yapabilir.',
      dayanak: { kanun: 'hmk', madde: '17', ifade: 'tacirler veya kamu tüzel kişileri' },
    },
    {
      tuzak: 'İstinaf süresi kararın tefhim edildiği duruşmadan başlar.',
      dogrusu: 'İstinaf süresi iki hafta olup ilamın taraflardan her birine usulen tebliğiyle işlemeye başlar.',
      dayanak: { kanun: 'hmk', madde: '345', ifade: 'ilamın usulen taraflardan her birine tebliğiyle işlemeye başlar' },
    },
    {
      tuzak: 'İspat yükü her durumda davacıya aittir.',
      dogrusu: 'İspat yükü, vakıaya bağlanan hukuki sonuçtan kendi lehine hak çıkaran tarafa aittir; ödeme vakıasını davalı ispat eder.',
      dayanak: { kanun: 'hmk', madde: '190', ifade: 'kendi lehine hak çıkaran tarafa aittir' },
    },
  ],
  kisaTest: [
    {
      q: 'Malvarlığı haklarına ilişkin bir davada, aksine düzenleme yoksa görevli mahkeme hangisidir?',
      choices: [
        'Dava değerine göre sulh hukuk ya da asliye hukuk mahkemesi',
        'Dava konusunun değerine bakılmaksızın asliye hukuk mahkemesi',
        'Davalının yerleşim yerindeki sulh hukuk mahkemesi',
        'Asliye ticaret mahkemesi',
      ],
      answer: 1,
      reason: 'HMK m.2/1 malvarlığı haklarına ilişkin davalarda değer ve miktara bakılmaksızın asliye hukuk mahkemesini görevli kılar.',
      dayanak: { kanun: 'hmk', madde: '2', ifade: 'dava konusunun değer ve miktarına bakılmaksızın malvarlığı haklarına ilişkin davalarla' },
    },
    {
      q: 'Genel yetkili mahkeme hangisidir?',
      choices: [
        'Davacının yerleşim yeri mahkemesi',
        'Sözleşmenin yapıldığı yer mahkemesi',
        'Davalının davanın açıldığı tarihteki yerleşim yeri mahkemesi',
        'Davalının hüküm tarihindeki yerleşim yeri mahkemesi',
      ],
      answer: 2,
      reason: 'HMK m.6/1 genel yetkiyi davalının davanın açıldığı tarihteki yerleşim yerine bağlar.',
      dayanak: { kanun: 'hmk', madde: '6', ifade: 'davalı gerçek veya tüzel kişinin davanın açıldığı tarihteki yerleşim yeri mahkemesidir' },
    },
    {
      q: 'Aşağıdakilerden hangisi HMK’ya göre ilk itirazdır?',
      choices: ['Görevsizlik itirazı', 'Derdestlik itirazı', 'Kesin hüküm itirazı', 'Uyuşmazlığın tahkimde çözülmesi gerektiği itirazı'],
      answer: 3,
      reason: 'HMK m.116/1 ilk itirazları kesin olmayan yetki itirazı ve tahkim itirazıyla sınırlar; diğerleri dava şartıdır.',
      dayanak: { kanun: 'hmk', madde: '116', ifade: 'ilk itirazlar aşağıdakilerden ibarettir' },
    },
    {
      q: 'Cevap dilekçesi için ek süre hangi koşulla verilebilir?',
      choices: [
        'Davalı süre bittikten sonra başvurursa, bir ayı geçmemek üzere',
        'Davalı iki haftalık süre içinde başvurursa, bir defaya mahsus ve bir ayı geçmemek üzere',
        'Davacının muvafakatiyle, iki ayı geçmemek üzere',
        'Hâkim kendiliğinden, her seferinde iki hafta',
      ],
      answer: 1,
      reason: 'HMK m.127/1 ek süreyi süre içinde başvuran davalıya, bir defaya mahsus ve bir ayı geçmemek üzere tanır.',
      dayanak: { kanun: 'hmk', madde: '127', ifade: 'bir defaya mahsus olmak ve bir ayı geçmemek üzere ek bir süre verilebilir' },
    },
    {
      q: 'Dava dilekçesinde davalının adresi eksikse hâkim ne yapar?',
      choices: [
        'Davayı hemen usulden reddeder.',
        'Eksikliği kendisi araştırıp tamamlar.',
        'Bir haftalık kesin süre verir; tamamlanmazsa dava açılmamış sayılır.',
        'Davayı dosya üzerinden esastan inceler.',
      ],
      answer: 2,
      reason: 'HMK m.119/2 sayılan bentler dışındaki eksiklikler için bir haftalık kesin süre öngörür; adres bu eksikliklerdendir.',
      dayanak: { kanun: 'hmk', madde: '119', ifade: 'bir haftalık kesin süre verir' },
    },
    {
      q: 'Kanuni bir karineye dayanan taraf neyi ispat etmek zorundadır?',
      choices: [
        'Yalnız karinenin temelini oluşturan vakıayı',
        'Karinenin sonucu olan vakıayı',
        'Karşı tarafın karinenin aksini ispat edemeyeceğini',
        'Hiçbir vakıayı',
      ],
      answer: 0,
      reason: 'HMK m.190/2 kanuni karineye dayanan tarafı yalnız temel vakıanın ispatıyla yükümlü tutar; karşı taraf aksini ispat edebilir.',
      dayanak: { kanun: 'hmk', madde: '190', ifade: 'sadece karinenin temelini oluşturan vakıaya ilişkin ispat yükü altındadır' },
    },
  ],
  kaynaklar: [
    {
      title: '6100 sayılı Hukuk Muhakemeleri Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6100.pdf',
      note: 'Örnek olay, tuzak ve test dayanaklarının resmî metni',
    },
  ],
};

export default katman;
