/**
 * Ticari İşletme Hukuku — kanonik katman (G19). Dayanaklar 6102 sayılı Türk Ticaret Kanunu metnine bağlıdır
 * (`content/mevzuat/ttk`). Olaylar kurmacadır; kişi, tarih ve tutar örnek içindir. Yerel metinde dipnot sızıntısı bulunan
 * fıkralar (m.3, m.5/2, m.371/2) dayanak ifadesi olarak kullanılmamıştır.
 */
const katman = {
  ders: 'ticari-isletme',
  temsilci: { uni: 'ankara', ders: 'ticari-isletme-yillik' },
  guncelleme: '2026-10-09',
  ornekOlaylar: [
    {
      baslik: 'Tacirler arasında mesajla yapılan temerrüt ihtarı',
      olay:
        'Konya’da hırdavat toptancılığı yapan Yavuz, bir inşaat şirketine 640.000 TL’lik malzeme satmış, vade kararlaştırılmamıştır. ' +
        'Bedel ödenmeyince Yavuz şirketin yetkilisine anlık mesajla “bir hafta içinde ödemezseniz sözleşmeden dönüyorum” yazmış, bir ' +
        'hafta sonra da yine mesajla dönme bildiriminde bulunmuştur. Şirket ihtarın ve dönmenin geçersiz olduğunu ileri sürmektedir.',
      cozum:
        'Yavuz bir ticari işletmeyi kendi adına işlettiğinden tacirdir (Türk Ticaret Kanunu (TTK) m.12/1), şirket de ticaret şirketi ' +
        'olarak tacir sayılır (TTK m.16/1). Tacirler arasında diğer tarafı temerrüde düşürmeye ve sözleşmeden dönmeye ilişkin ihbar ve ' +
        'ihtarlar noter aracılığıyla, taahhütlü mektupla, telgrafla veya güvenli elektronik imzalı kayıtlı elektronik postayla yapılır ' +
        '(TTK m.18/3). Vade kararlaştırılmadığından borçlunun temerrüdü ihtara bağlıdır (TBK m.117/1), anlık mesaj ise kanundaki ' +
        'yollardan biri değildir. Bu nedenle mesajla yapılan ihtar ve dönme bildirimi tacirler arasında öngörülen şekle uymamaktadır. ' +
        'Yavuz’un ihtarı kanundaki yollardan biriyle yenilemesi gerekir. Uyuşmazlık her iki tarafın ticari işletmesiyle ilgili ' +
        'olduğundan ticari davadır (TTK m.4/1) ve değerine bakılmaksızın asliye ticaret mahkemesinde görülür (TTK m.5/1).',
      sonuc: 'Tacirler arasında temerrüt ihtarı ve dönme bildirimi kanunda sayılan yollarla yapılır; anlık mesaj bu yollardan değildir.',
      dayanaklar: [
        { kanun: 'ttk', madde: '12', ifade: 'bir ticari işletmeyi, kısmen de olsa, kendi adına işleten kişiye tacir denir' },
        { kanun: 'ttk', madde: '18', ifade: 'noter aracılığıyla, taahhütlü mektupla, telgrafla veya güvenli elektronik imza kullanılarak kayıtlı elektronik posta sistemi ile yapılır' },
        { kanun: 'tbk', madde: '117', ifade: 'muaccel bir borcun borçlusu, alacaklının ihtarıyla temerrüde düşer' },
        { kanun: 'ttk', madde: '4', ifade: 'her iki tarafın da ticari işletmesiyle ilgili hususlardan doğan hukuk davaları' },
      ],
    },
    {
      baslik: 'Tek başına çalışan tacirin şirket izlenimi veren unvanı',
      olay:
        'Ayşe Demir, Bursa’da tek başına işlettiği tekstil atölyesini 1 Şubat’ta açmış, ticaret siciline 10 Mart’ta “Demir Tekstil ' +
        've Ortakları” unvanıyla başvurmuştur. Aynı şehirde “Demir Tekstil” unvanı başka bir tacir adına tescilli ve ilan edilmiştir. ' +
        'Sicil müdürlüğü başvuruyu incelemektedir.',
      cozum:
        'Her tacir ticari işletmesini ve seçtiği unvanı işletmenin açıldığı günden itibaren on beş gün içinde tescil ve ilan ettirir ' +
        '(TTK m.40/1), dolayısıyla 10 Mart’taki başvuru süre dışındadır. Gerçek kişi tacirin unvanı kısaltılmadan yazılan adı ve ' +
        'soyadından oluşur (TTK m.41). Unvana ek yapılabilmekle birlikte tek başına ticaret yapan gerçek kişi, bir şirketin var olduğu ' +
        'izlenimini uyandıracak ek yapamaz (TTK m.46/2). “ve Ortakları” eki bu nedenle kullanılamaz. Usulen tescil ve ilan edilmiş ' +
        'unvanı kullanma hakkı yalnız sahibine ait olduğundan (TTK m.50) Ayşe Demir’in unvanı, adını ve soyadını kısaltmadan içerecek ' +
        've tescilli unvandan ayırt edilecek biçimde düzenlenmelidir.',
      sonuc: 'Gerçek kişi tacirin unvanı ad ve soyadıyla kurulur, şirket izlenimi veren ek taşıyamaz ve on beş gün içinde tescil edilir.',
      dayanaklar: [
        { kanun: 'ttk', madde: '40', ifade: 'ticari işletmenin açıldığı günden itibaren onbeş gün içinde' },
        { kanun: 'ttk', madde: '41', ifade: 'kısaltılmadan yazılacak adı ve soyadından oluşur' },
        { kanun: 'ttk', madde: '46', ifade: 'bir şirketin var olduğu izlenimini uyandıracak ekler yapamazlar' },
        { kanun: 'ttk', madde: '50', ifade: 'usulen tescil ve ilan edilmiş olan ticaret unvanını kullanma hakkı sadece sahibine aittir' },
      ],
    },
    {
      baslik: 'Tacir yüklenicinin yüksek gecikme cezasına itirazı',
      olay:
        'Bir otel şirketi ile mutfak ekipmanı kuran tacir yüklenici arasındaki sözleşmede, teslimde her gecikme günü için 20.000 TL ' +
        'ceza kararlaştırılmıştır. Yüklenici teslimi 30 gün geciktirmiş, otel 600.000 TL ceza istemiştir. Yüklenici cezanın aşırı ' +
        'olduğunu ve hâkimin indirmesi gerektiğini savunmaktadır.',
      cozum:
        'Tacirin borçlarının ticari olması asıldır (TTK m.19/1) ve her tacir ticaretine ait bütün faaliyetlerinde basiretli bir iş adamı ' +
        'gibi hareket etmek zorundadır (TTK m.18/2). Tacir sıfatını taşıyan borçlu, aşırı sözleşme cezası kararlaştırıldığı iddiasıyla ' +
        'Türk Borçlar Kanunu m.182/3’teki indirimi mahkemeden isteyemez (TTK m.22). Yüklenicinin savunması bu nedenle sonuç doğurmaz. ' +
        'Borçlunun esnaf olduğu bir olayda ise esnafa uygulanan tacir hükümleri TTK m.20 ve m.53 ile sınırlı olduğundan (TTK m.15) ' +
        'indirim istemi incelenir.',
      sonuc: 'Tacir borçlu sözleşme cezasının indirilmesini isteyemez; esnaf için bu yasak uygulanmaz.',
      dayanaklar: [
        { kanun: 'ttk', madde: '18', ifade: 'basiretli bir iş adamı gibi hareket etmesi gerekir' },
        { kanun: 'ttk', madde: '22', ifade: 'ücret veya sözleşme cezasının indirilmesini mahkemeden isteyemez' },
        { kanun: 'ttk', madde: '15', ifade: 'tacirlere özgü 20 ve 53 üncü maddeler' },
      ],
    },
  ],
  sinavIskeleti: [
    {
      adim: 'Ticari işletme ve tacir',
      aciklama: 'Faaliyetin esnaf sınırını aşıp aşmadığı ve işletmenin kimin adına işletildiği belirlenir; gerçek ve tüzel kişi tacir ayrılır.',
    },
    {
      adim: 'Ticari iş',
      aciklama: 'İşlemin ticari işletmeyle ilgisi ve ticari iş karinesi denetlenir; tek taraflı ticari işin diğer taraf için sonucu yazılır.',
    },
    {
      adim: 'Tacir olmanın hükümleri',
      aciklama: 'Unvan, tescil, defter, basiretli iş adamı özeni, ihbarların şekli ve sözleşme cezasının indirilmemesi olaya uygulanır.',
    },
    {
      adim: 'Unvan ve işletme adı',
      aciklama: 'Unvanın şekli, ekler ve tescilli unvanın korunması sırasıyla incelenir.',
    },
    {
      adim: 'Ticari dava ve görev',
      aciklama: 'Uyuşmazlığın ticari dava olup olmadığı ve asliye ticaret mahkemesinin görevi gerekçesiyle yazılır.',
    },
  ],
  tuzakDefteri: [
    {
      tuzak: 'Tacir sayılmak için işletmenin fiilen faaliyete geçmesi şarttır.',
      dogrusu: 'İşletmenin açıldığını ilan araçlarıyla halka bildiren ya da sicile tescil ettirip ilan eden kişi fiilen başlamamış olsa da tacir sayılır.',
      dayanak: { kanun: 'ttk', madde: '12', ifade: 'fiilen işletmeye başlamamış olsa bile tacir sayılır' },
    },
    {
      tuzak: 'Esnaf da tacir hükümlerine tâbidir.',
      dogrusu: 'Esnafa tacirlere özgü hükümlerden yalnız TTK m.20 ile m.53 ve TMK m.950/2 uygulanır.',
      dayanak: { kanun: 'ttk', madde: '15', ifade: 'ekonomik faaliyeti sermayesinden fazla bedenî çalışmasına dayanan' },
    },
    {
      tuzak: 'Ticari işletme devredilirken her malvarlığı unsuru ayrı ayrı devredilmek zorundadır.',
      dogrusu: 'Ticari işletme, unsurların ayrı ayrı devrine gerek olmaksızın bir bütün hâlinde devredilebilir.',
      dayanak: { kanun: 'ttk', madde: '11', ifade: 'ayrı ayrı yapılmasına gerek olmaksızın bir bütün hâlinde devredilebilir' },
    },
    {
      tuzak: 'Tacirler arasında temerrüt ihtarı e-postayla da yapılabilir.',
      dogrusu: 'İhtar noter, taahhütlü mektup, telgraf ya da güvenli elektronik imzalı kayıtlı elektronik postayla yapılır.',
      dayanak: { kanun: 'ttk', madde: '18', ifade: 'diğer tarafı temerrüde düşürmeye, sözleşmeyi feshe, sözleşmeden dönmeye ilişkin ihbarlar veya ihtarlar' },
    },
    {
      tuzak: 'Tacirin yaptığı her işlem ticari iştir ve aksi ispat edilemez.',
      dogrusu: 'Gerçek kişi tacir, işlemin ticari işletmesiyle ilgili olmadığını işlem anında açıkça bildirmişse ya da durum elverişli değilse borç adi sayılır.',
      dayanak: { kanun: 'ttk', madde: '19', ifade: 'işlemi yaptığı anda bunun ticari işletmesiyle ilgili olmadığını diğer tarafa açıkça bildirdiği' },
    },
    {
      tuzak: 'Tacir, ticari işletmesini açtıktan sonra bir ay içinde tescil ettirir.',
      dogrusu: 'Tescil ve ilan süresi işletmenin açıldığı günden itibaren on beş gündür.',
      dayanak: { kanun: 'ttk', madde: '40', ifade: 'onbeş gün içinde' },
    },
  ],
  kisaTest: [
    {
      q: 'Aşağıdakilerden hangisi kanunen tacir sayılır?',
      choices: ['Kamu yararına çalışan dernek', 'Ticaret şirketi', 'Bir dükkânda bedenî çalışmasıyla geçinen esnaf', 'Belediye'],
      answer: 1,
      reason: 'TTK m.16/1 ticaret şirketlerini tacir sayar; esnaf m.15 ile ayrı tutulmuştur.',
      dayanak: { kanun: 'ttk', madde: '16', ifade: 'ticaret şirketleriyle' },
    },
    {
      q: 'Taraflardan yalnız biri için ticari iş niteliğinde olan sözleşme, kanunda aksine hüküm yoksa diğer taraf için nasıl sayılır?',
      choices: ['Adi iş', 'Ticari iş', 'Tüketici işlemi', 'Hükümsüz işlem'],
      answer: 1,
      reason: 'TTK m.19/2 böyle sözleşmeleri diğer taraf için de ticari iş sayar.',
      dayanak: { kanun: 'ttk', madde: '19', ifade: 'diğeri için de ticari iş sayılır' },
    },
    {
      q: 'Ticari işletmesiyle ilgili bir iş gören tacirin ücret hakkı hakkında hangisi doğrudur?',
      choices: [
        'Ücret ancak yazılı sözleşme varsa istenebilir.',
        'Karşı taraf tacir olsun ya da olmasın uygun bir ücret isteyebilir.',
        'Yalnız karşı taraf da tacirse ücret isteyebilir.',
        'Ücret istenemez, yalnız giderler istenebilir.',
      ],
      answer: 1,
      reason: 'TTK m.20/1 tacire, tacir olan veya olmayan kişiye gördüğü iş için uygun bir ücret isteme hakkı tanır.',
      dayanak: { kanun: 'ttk', madde: '20', ifade: 'tacir olan veya olmayan bir kişiye' },
    },
    {
      q: 'Ticari davalarda görevli mahkeme hangisidir?',
      choices: [
        'Dava değeri yüksekse asliye ticaret, düşükse sulh hukuk mahkemesi',
        'Değerine bakılmaksızın asliye ticaret mahkemesi',
        'Her durumda asliye hukuk mahkemesi',
        'Tüketici mahkemesi',
      ],
      answer: 1,
      reason: 'TTK m.5/1 aksine hüküm yoksa ticari davaları değerine bakılmaksızın asliye ticaret mahkemesine verir.',
      dayanak: { kanun: 'ttk', madde: '5', ifade: 'dava olunan şeyin değerine veya tutarına bakılmaksızın asliye ticaret mahkemesi tüm ticari davalar' },
    },
    {
      q: '“Türk” veya “Türkiye” kelimesi bir ticaret unvanına nasıl konabilir?',
      choices: ['Serbestçe', 'Ticaret sicili müdürünün onayıyla', 'Cumhurbaşkanı kararıyla', 'Hiçbir şekilde konamaz'],
      answer: 2,
      reason: 'TTK m.46/3 bu kelimelerin unvana ancak Cumhurbaşkanı kararıyla konabileceğini öngörür.',
      dayanak: { kanun: 'ttk', madde: '46', ifade: 'bir ticaret unvanına ancak cumhurbaşkanı kararıyla konabilir' },
    },
  ],
  kaynaklar: [
    {
      title: '6102 sayılı Türk Ticaret Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6102.pdf',
      note: 'Örnek olay, tuzak ve test dayanaklarının resmî metni',
    },
  ],
};

export default katman;
