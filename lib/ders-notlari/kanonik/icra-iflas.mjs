/**
 * İcra ve İflas Hukuku — kanonik katman (G19). Dayanaklar 2004 sayılı İcra ve İflas Kanunu metnine bağlıdır
 * (`content/mevzuat/iik`). Olaylar kurmacadır; kişi, tarih ve tutar örnek içindir.
 */
const katman = {
  ders: 'icra-iflas',
  temsilci: { uni: 'ankara', ders: 'icra-iflas-yillik' },
  guncelleme: '2026-10-09',
  ornekOlaylar: [
    {
      baslik: 'Faturaya dayanan ilamsız takibe süresinde itiraz',
      olay:
        'Bir toptancı, perakendeci müşterisine kestiği 260.000 TL’lik faturaya dayanarak genel haciz yoluyla ilamsız takip başlatmıştır. ' +
        'Ödeme emri 4 Mart’ta tebliğ edilmiş, borçlu 9 Mart’ta icra dairesine verdiği dilekçeyle borcun tamamına itiraz etmiştir. ' +
        'Faturada borçlunun imzası bulunmamakta, alacaklı ise takibin hızla sürmesini istemektedir.',
      cozum:
        'İcra ve İflas Kanunu (İİK) m.62 uyarınca borçlu itirazını ödeme emrinin tebliğinden itibaren yedi gün içinde icra dairesine ' +
        'bildirir. İtiraz 9 Mart’ta, yani süresinde yapıldığından takip durur (İİK m.66). Alacaklının önünde iki yol vardır. İtirazın ' +
        'kaldırılması, takip imzası ikrar ya da noterce tasdik edilen bir borç ikrarı senedine veya resmî bir belgeye dayanıyorsa altı ay ' +
        'içinde istenebilir (İİK m.68), oysa borçlunun imzasını taşımayan fatura bu nitelikte değildir. Bu nedenle alacaklı, itirazın ' +
        'tebliğinden itibaren bir yıl içinde genel mahkemede alacağın varlığını ispat ederek itirazın iptalini dava eder (İİK m.67). ' +
        'Davada borçlunun itirazının haksız bulunması hâlinde alacaklının talebi üzerine borçlu, hükmolunan miktarın yüzde yirmisinden ' +
        'aşağı olmamak üzere tazminata mahkûm edilir.',
      sonuc: 'Süresinde itiraz takibi durdurur; imzasız fatura itirazın kaldırılmasına elverişli olmadığından yol bir yıllık itirazın iptali davasıdır.',
      dayanaklar: [
        { kanun: 'iik', madde: '62', ifade: 'ödeme emrinin tebliği tarihinden itibaren yedi gün içinde' },
        { kanun: 'iik', madde: '66', ifade: 'müddeti içinde yapılan itiraz takibi durdurur' },
        { kanun: 'iik', madde: '68', ifade: 'imzası ikrar veya noterlikçe tasdik edilen borç ikrarını içeren bir senede' },
        { kanun: 'iik', madde: '67', ifade: 'itirazın tebliği tarihinden itibaren bir sene içinde mahkemeye başvurarak' },
      ],
    },
    {
      baslik: 'Süresi geçmiş itiraz, ev eşyasının haczi ve menfi tespit',
      olay:
        'Bir kredi kartı alacağı için başlatılan ilamsız takipte ödeme emri borçluya 2 Nisan’da tebliğ edilmiş, borçlu 15 Nisan’da ' +
        'itiraz etmiştir. İcra müdürü alacaklının talebiyle takibe devam etmiş, haciz sırasında evdeki buzdolabı, çamaşır makinesi ve ' +
        'bir altın bileziği haczetmiştir. Borçlu, kartı kendisinin kullanmadığını ve borçlu olmadığını ileri sürmektedir.',
      cozum:
        'İtiraz tebliğden itibaren yedi günlük süre geçtikten sonra yapıldığından takibi durdurmaz ve icra müdürü alacaklının talebiyle ' +
        'takibe alacağın tamamı için devam eder (İİK m.66). Haciz yönünden ailenin ortak kullanımına hizmet eden ev eşyası haczedilemez, ' +
        'ancak para, altın ve süs eşyası gibi kıymetli şeyler bu korumanın dışındadır (İİK m.82/1-3). Buzdolabı ve çamaşır makinesinin ' +
        'haczine karşı borçlu, işlemi öğrendiği tarihten itibaren yedi gün içinde icra mahkemesine şikâyet yoluna gider (İİK m.16), ' +
        'bilezik ise haczedilebilir. Borçlu olmadığını ileri süren borçlu takip sırasında menfi tespit davası açabilir. Takipten sonra ' +
        'açılan bu davada ihtiyati tedbirle takip durdurulamaz, yalnız alacağın yüzde on beşinden aşağı olmamak üzere teminat göstererek ' +
        'icra veznesindeki paranın alacaklıya verilmemesi istenebilir (İİK m.72).',
      sonuc:
        'Süresi geçmiş itiraz takibi durdurmaz; ev eşyasının haczi şikâyetle, borcun yokluğu ise takibi durdurmayan menfi tespit davasıyla ileri sürülür.',
      dayanaklar: [
        { kanun: 'iik', madde: '66', ifade: 'itiraz müddetinde değilse alacaklının talebi üzerine icra memuru takip muamelelerine alacağın tamamı için devam eder' },
        { kanun: 'iik', madde: '82', ifade: 'ailenin ortak kullanımına hizmet eden tüm ev eşyası' },
        { kanun: 'iik', madde: '16', ifade: 'şikayet bu muamelelerin öğrenildiği tarihten yedi gün içinde yapılır' },
        { kanun: 'iik', madde: '72', ifade: 'icra takibinden sonra açılan menfi tesbit davasında ihtiyati tedbir yolu ile takibin durdurulmasına karar verilemez' },
      ],
    },
    {
      baslik: 'Bonoya dayanan kambiyo takibinde imza inkârı',
      olay:
        'Bir otomobil galerisi, vadesi 1 Haziran olan 150.000 TL’lik bonoya dayanarak kambiyo senetlerine özgü haciz yoluyla takip ' +
        'başlatmıştır. Ödeme emri 10 Haziran’da tebliğ edilmiştir. Borçlu bonodaki imzanın kendisine ait olmadığını ileri sürmekte ve ' +
        'itirazını hangi mercie, hangi sürede yapacağını sormaktadır.',
      cozum:
        'İcra müdürü senedin kambiyo senedi olduğunu ve vadesinin geldiğini görünce borçluya ödeme emri gönderir ve ödeme için on gün ' +
        'süre verir (İİK m.168). İmzanın borçluya ait olmadığı itirazı, ilamsız takipten farklı olarak icra dairesine değil beş gün içinde ' +
        'dilekçeyle icra mahkemesine yapılır (İİK m.168/1-4, m.170). Süresinde yapılmazsa imza takipte borçludan sadır sayılır. İmza ' +
        'itirazı satıştan başka takip işlemlerini durdurmaz, ne var ki icra mahkemesi itirazı ciddi görürse takibin geçici olarak ' +
        'durdurulmasına evrak üzerinde karar verebilir (İİK m.170/2). Mahkeme imzanın borçluya ait olmadığı kanaatine varırsa itirazı ' +
        'kabul eder ve takip durur, alacaklının genel hükümlere göre dava açma hakkı ise saklı kalır.',
      sonuc: 'Kambiyo takibinde imza itirazı beş gün içinde icra mahkemesine yapılır ve kural olarak takibi durdurmaz.',
      dayanaklar: [
        { kanun: 'iik', madde: '168', ifade: 'borcun ve takip masraflarının on gün içinde' },
        { kanun: 'iik', madde: '168', ifade: 'bunu beş gün içinde açıkça bir dilekçe ile icra mahkemesine bildirmesi' },
        { kanun: 'iik', madde: '170', ifade: 'bu itiraz satıştan başka icra takip muamelelerini durdurmaz' },
        { kanun: 'iik', madde: '170', ifade: 'alacaklının genel hükümlere göre dava açma hakkı saklıdır' },
      ],
    },
  ],
  sinavIskeleti: [
    {
      adim: 'Takip yolunun seçimi',
      aciklama: 'Alacağın ilama, kambiyo senedine ya da rehne dayanıp dayanmadığına göre ilamlı, ilamsız, kambiyo ya da rehnin paraya çevrilmesi yolu belirlenir.',
    },
    {
      adim: 'Ödeme emri ve süreler',
      aciklama: 'Ödeme emrinin tebliğ tarihi esas alınarak ödeme ve itiraz süreleri gün olarak hesaplanır.',
    },
    {
      adim: 'İtiraz ve sonucu',
      aciklama: 'İtirazın hangi mercie, süresinde yapılıp yapılmadığı ve takibi durdurup durdurmadığı yazılır.',
    },
    {
      adim: 'Alacaklının yolları',
      aciklama: 'İtirazın kaldırılması ile itirazın iptali davası belge türüne ve süresine göre ayrılır, icra inkâr tazminatı ayrıca değerlendirilir.',
    },
    {
      adim: 'Haciz ve paraya çevirme',
      aciklama: 'Haczedilemeyen mallar, haciz ihbarnamesi ve satış isteme süresi olaydaki mallara uygulanır.',
    },
    {
      adim: 'Borçlunun korunma yolları',
      aciklama: 'Şikâyet, menfi tespit ve istirdat davası ayrılır; her birinin süresi ve takibi durdurup durdurmadığı belirtilir.',
    },
  ],
  tuzakDefteri: [
    {
      tuzak: 'İlamsız takipte ödeme emrine itiraz süresi on beş gündür.',
      dogrusu: 'Borçlu itirazını ödeme emrinin tebliğinden itibaren yedi gün içinde icra dairesine bildirir.',
      dayanak: { kanun: 'iik', madde: '62', ifade: 'ödeme emrinin tebliği tarihinden itibaren yedi gün içinde' },
    },
    {
      tuzak: 'Kambiyo takibinde borca itiraz icra dairesine yapılır ve takibi durdurur.',
      dogrusu: 'Borca itiraz dilekçeyle icra mahkemesine bildirilir ve satıştan başka takip işlemlerini durdurmaz.',
      dayanak: { kanun: 'iik', madde: '169', ifade: 'bu itiraz satıştan başka icra takip muamelelerini durdurmaz' },
    },
    {
      tuzak: 'Alacaklı elindeki her yazılı belgeyle itirazın kaldırılmasını isteyebilir.',
      dogrusu: 'İtirazın kaldırılması imzası ikrar ya da noterce tasdik edilen borç ikrarı senedi veya resmî belge gerektirir ve altı ay içinde istenir.',
      dayanak: { kanun: 'iik', madde: '68', ifade: 'altı ay içinde itirazın kaldırılmasını isteyebilir' },
    },
    {
      tuzak: 'İcra dairesinin işlemlerine karşı şikâyet süreye bağlı değildir.',
      dogrusu: 'Şikâyet işlemin öğrenilmesinden itibaren yedi gün içinde yapılır; yalnız hakkın yerine getirilmemesi ve sürüncemede bırakılması her zaman şikâyet edilebilir.',
      dayanak: { kanun: 'iik', madde: '16', ifade: 'sebepsiz sürüncemede bırakılmasından dolayı her zaman şikayet olunabilir' },
    },
    {
      tuzak: 'Haczedilen malın satışı süre sınırı olmaksızın istenebilir.',
      dogrusu: 'Alacaklı veya borçlu haczolunan malın satışını hacizden itibaren bir yıl içinde isteyebilir.',
      dayanak: { kanun: 'iik', madde: '106', ifade: 'hacizden itibaren bir yıl içinde haczolunan malın satışını isteyebilir' },
    },
    {
      tuzak: 'Takipten sonra açılan menfi tespit davasında teminat karşılığı ihtiyati tedbirle takip durdurulur.',
      dogrusu: 'Takipten sonra açılan menfi tespit davasında ihtiyati tedbirle takip durdurulamaz; yalnız paranın alacaklıya verilmemesi istenebilir.',
      dayanak: { kanun: 'iik', madde: '72', ifade: 'icra veznesindeki paranın alacaklıya verilmemesini istiyebilir' },
    },
  ],
  kisaTest: [
    {
      q: 'Genel haciz yoluyla ilamsız takipte ödeme emri borçluya ödeme için hangi süreyi verir?',
      choices: ['Üç gün', 'Yedi gün', 'On gün', 'On beş gün'],
      answer: 1,
      reason: 'İİK m.60/1-2 uyarınca ödeme emri borcun ve masrafların yedi gün içinde ödenmesi ihtarını içerir.',
      dayanak: { kanun: 'iik', madde: '60', ifade: 'borcun ve masrafların yedi gün içinde' },
    },
    {
      q: 'Takibe itiraz edilen alacaklı itirazın iptali davasını hangi süre içinde açmalıdır?',
      choices: [
        'Ödeme emrinin tebliğinden itibaren altı ay',
        'İtirazın tebliğinden itibaren bir yıl',
        'Takip talebinden itibaren iki yıl',
        'İtirazın tebliğinden itibaren yedi gün',
      ],
      answer: 1,
      reason: 'İİK m.67/1 itirazın iptali davası için itirazın tebliğinden başlayan bir yıllık süre öngörür.',
      dayanak: { kanun: 'iik', madde: '67', ifade: 'itirazın tebliği tarihinden itibaren bir sene içinde' },
    },
    {
      q: 'İlamsız takipte alacaklı haciz talebini en erken ne zaman yapabilir?',
      choices: [
        'Takip talebiyle birlikte',
        'Ödeme emrinin tebliği anında',
        'Ödeme emrindeki süre geçtikten ve itiraz varsa kaldırıldıktan sonra',
        'Mal beyanında bulunulduktan sonra',
      ],
      answer: 2,
      reason: 'İİK m.78/1 haciz talebini ödeme emrindeki sürenin geçmesine ve itiraz varsa kaldırılmasına bağlar; mal beyanı beklenmez.',
      dayanak: { kanun: 'iik', madde: '78', ifade: 'ödeme emrindeki müddet geçtikten ve borçlu itiraz etmiş ise itirazı kaldırıldıktan sonra' },
    },
    {
      q: 'Borçlunun üçüncü kişideki alacağı haczedildiğinde icra müdürü üçüncü kişiye ne bildirir?',
      choices: [
        'Borcunu doğrudan alacaklıya ödemesini',
        'Borcunu ancak icra dairesine ödeyebileceğini',
        'Borcunu takip borçlusuna ödeyebileceğini',
        'Borcun zamanaşımına uğradığını',
      ],
      answer: 1,
      reason: 'İİK m.89/1 haciz ihbarnamesiyle üçüncü kişiye borcunu ancak icra dairesine ödeyebileceğini bildirir.',
      dayanak: { kanun: 'iik', madde: '89', ifade: 'borcunu ancak icra dairesine ödiyebileceğini' },
    },
    {
      q: 'Aşağıdakilerden hangisi alacaklıya önceden takibe gerek kalmaksızın iflas isteme imkânı verir?',
      choices: [
        'Borçlunun bir kez gecikmeli ödeme yapması',
        'Borçlunun ödemelerini tatil etmesi',
        'Borçlunun ödeme emrine itiraz etmesi',
        'Borçlunun ticaret unvanını değiştirmesi',
      ],
      answer: 1,
      reason: 'İİK m.177/2 ödemelerin tatil edilmesini doğrudan iflas hâlleri arasında sayar.',
      dayanak: { kanun: 'iik', madde: '177', ifade: 'borçlu ödemelerini tatil eylemiş bulunursa' },
    },
  ],
  kaynaklar: [
    {
      title: '2004 sayılı İcra ve İflas Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.3.2004.pdf',
      note: 'Örnek olay, tuzak ve test dayanaklarının resmî metni',
    },
  ],
};

export default katman;
