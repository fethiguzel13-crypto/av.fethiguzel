/**
 * Tüketici Hukuku — kanonik katman (G23). Dayanaklar 6502 sayılı Tüketicinin Korunması Hakkında Kanun metnine bağlıdır
 * (`content/mevzuat/tkhk`); dava şartı olayında 6325 sayılı Kanunun 18/A maddesine de dayanılır. Olaylar kurmacadır; kişi, tarih
 * ve mal örnek içindir. Her yıl yeniden değerlenen parasal sınırlar (TKHK m.68/4) tutar olarak yazılmamıştır.
 */
const katman = {
  ders: 'tuketici-hukuku',
  temsilci: { uni: 'ankara', ders: 'tuketici-hukuku-yillik' },
  guncelleme: '2026-10-15',
  ornekOlaylar: [
    {
      baslik: 'Dördüncü ayda arızalanan çamaşır makinesi',
      olay:
        'Elif, bir mağazadan aldığı çamaşır makinesinin teslimden dört ay sonra sıkma sırasında durduğunu fark etmiştir. Satıcı, ' +
        'arızanın Elif’in kullanımından kaynaklandığını ve kendisinin yalnız malı sattığını ileri sürerek Elif’i üreticinin ' +
        'servisine yönlendirmiştir. Elif ise makinenin ayıpsız bir misli ile değiştirilmesini istemektedir.',
      cozum:
        'Teslim tarihinden itibaren altı ay içinde ortaya çıkan ayıbın teslim anında var olduğu kabul edildiğinden, malın ayıplı ' +
        'olmadığını ispat yükü satıcıdadır (Tüketicinin Korunması Hakkında Kanun (TKHK) m.10/1). Satıcı kullanım hatasını ispat ' +
        'edemedikçe Elif seçimlik haklarından değiştirmeyi seçebilir ve satıcı bu tercihi yerine getirmekle yükümlüdür (TKHK ' +
        'm.11/1). Değiştirme hakkı üreticiye karşı da kullanılabilmekle birlikte bu konuda satıcı, üretici ve ithalatçı ' +
        'müteselsilen sorumlu olduğundan satıcı, Elif’i servise göndererek sorumluluktan kurtulamaz (TKHK m.11/2). Talep, ' +
        'yöneltildiği andan itibaren en çok otuz iş günü içinde yerine getirilmelidir (TKHK m.11/4).',
      sonuc: 'Altı ay içinde çıkan ayıpta ispat yükü satıcıdadır; değiştirme talebinde satıcı ile üretici birlikte sorumludur.',
      dayanaklar: [
        { kanun: 'tkhk', madde: '10', ifade: 'Teslim tarihinden itibaren altı ay içinde ortaya çıkan ayıpların, teslim tarihinde var olduğu kabul edilir' },
        { kanun: 'tkhk', madde: '11', ifade: 'İmkân varsa, satılanın ayıpsız bir misli ile değiştirilmesini isteme' },
        { kanun: 'tkhk', madde: '11', ifade: 'satıcı, üretici ve ithalatçı müteselsilen sorumludur' },
        { kanun: 'tkhk', madde: '11', ifade: 'azami otuz iş günü' },
      ],
    },
    {
      baslik: 'Cayma hakkı bildirilmeden satılan masa lambası',
      olay:
        'Burak, bir internet sitesinden sipariş ettiği masa lambasını 3 Mart’ta teslim almış, kutuyu açıp lambayı bir akşam ' +
        'denemiştir. Satıcı, sipariş öncesinde ve sonrasında cayma hakkına ilişkin hiçbir bilgi vermemiştir. Burak 25 Mart’ta ' +
        'gerekçe göstermeden lambayı iade etmek istediğini satıcıya e-postayla bildirmiş, satıcı ise on dört günün geçtiğini ve ' +
        'ambalajın açıldığını ileri sürerek talebi reddetmiştir.',
      cozum:
        'Mesafeli sözleşmede tüketici, on dört gün içinde gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkına sahip ' +
        'olup satıcı tüketicinin bu hak konusunda bilgilendirildiğini ispat etmekle yükümlüdür (TKHK m.48/4). Gerektiği şekilde ' +
        'bilgilendirilmeyen Burak on dört günlük süreyle bağlı değildir, cayma süresi ise her hâlükârda olağan sürenin bittiği ' +
        'tarihten itibaren bir yıl sonra sona erer. Bildirimin bu süre içinde e-postayla satıcıya yöneltilmesi yeterlidir. ' +
        'Lambanın bir akşam denenmesi mutat kullanım olduğundan Burak bundan doğan değişiklikten de sorumlu tutulamaz (TKHK m.48/4).',
      sonuc: 'Cayma hakkı bildirilmemişse on dört günlük süre işlemez; tüketici mutat kullanımdan doğan değişiklikten sorumlu değildir.',
      dayanaklar: [
        { kanun: 'tkhk', madde: '48', ifade: 'on dört gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir' },
        { kanun: 'tkhk', madde: '48', ifade: 'cayma hakkı konusunda tüketicinin bilgilendirildiğini ispat etmekle yükümlüdür' },
        { kanun: 'tkhk', madde: '48', ifade: 'cayma hakkını kullanmak için on dört günlük süreyle bağlı değildir' },
        { kanun: 'tkhk', madde: '48', ifade: 'malın mutat kullanımı sebebiyle meydana gelen değişiklik ve bozulmalardan sorumlu değildir' },
      ],
    },
    {
      baslik: 'Tek taksit gecikmesi üzerine muaccel kılınan kredi',
      olay:
        'Can, otuz altı ay vadeli bir tüketici kredisi kullanmış, sözleşmede bankanın borcun tamamını isteme hakkını saklı tuttuğu ' +
        'yazılmıştır. Can onuncu taksiti ödememiş, on birinci taksiti ise vadesinde yatırmıştır. Banka, ertesi hafta hiçbir süre ' +
        'vermeden kalan borcun tamamını bütün vade faizi ve komisyonuyla birlikte muaccel kıldığını bildirmiştir.',
      cozum:
        'Belirli süreli kredi sözleşmesinde saklı tutulan muacceliyet hakkı, ancak kredi veren bütün edimlerini ifa etmişse ve ' +
        'tüketici birbirini izleyen en az iki taksidi ödemede temerrüde düşmüşse kullanılabilir (TKHK m.28/1). Can yalnız bir ' +
        'taksidi ödemediğinden koşul gerçekleşmemiş olup banka borcun tamamını isteyemez. Koşul gerçekleşmiş olsa bile bankanın, Can’a en az otuz gün ' +
        'süre vererek muacceliyet uyarısında bulunması zorunludur (TKHK m.28/1). Muaccel kılınan taksitlerin hesabında faiz, komisyon ve benzeri ' +
        'masraflar dikkate alınmaz (TKHK m.28/2). Can kalan borcu erken öderse banka, erken ödenen miktara göre faiz ve diğer ' +
        'maliyet unsurlarından indirim yapmakla yükümlüdür (TKHK m.27/1).',
      sonuc: 'Muacceliyet için birbirini izleyen iki taksitte temerrüt ve otuz günlük uyarı gerekir; vade faizi muaccel borca eklenmez.',
      dayanaklar: [
        { kanun: 'tkhk', madde: '28', ifade: 'birbirini izleyen en az iki taksidi ödemede temerrüde düşmesi' },
        { kanun: 'tkhk', madde: '28', ifade: 'en az otuz gün süre vererek muacceliyet uyarısında bulunması zorunludur' },
        { kanun: 'tkhk', madde: '28', ifade: 'Muaccel kılınan taksitlerin hesaplanmasında faiz, komisyon ve benzeri masraflar dikkate alınmaz' },
        { kanun: 'tkhk', madde: '27', ifade: 'erken ödenen miktara göre gerekli tüm faiz ve diğer maliyet unsurlarına ilişkin indirim yapmakla yükümlüdür' },
      ],
    },
    {
      baslik: 'Arabulucuya gidilmeden açılan bedel iadesi davası',
      olay:
        'Deniz, bir mobilya firmasından aldığı ve teslimde ayıplı çıkan yemek odası takımı için sözleşmeden dönmüş, ödediği bedelin ' +
        'iadesini istemektedir. Uyuşmazlığın değeri, o yıl için ilan edilen tüketici hakem heyeti başvuru sınırının üzerindedir. ' +
        'Deniz, arabulucuya başvurmadan kendi yerleşim yerindeki tüketici mahkemesinde dava açmıştır.',
      cozum:
        'Değeri parasal sınırın altında kalan uyuşmazlıklarda tüketici hakem heyetine başvuru zorunlu olup sınırın üzerindeki ' +
        'uyuşmazlıklar için heyete başvuru yapılamaz (TKHK m.68/1). Sınır her takvim yılı başında yeniden değerleme oranında ' +
        'artırıldığından uyuşmazlığın değeri o yılın tutarıyla karşılaştırılır (TKHK m.68/4). Davada tüketici mahkemesi görevli ' +
        'olup dava tüketicinin yerleşim yerindeki mahkemede de açılabilir (TKHK m.73/1, 5). Ne var ki tüketici mahkemelerinde ' +
        'görülen uyuşmazlıklarda dava açılmadan önce arabulucuya başvurulmuş olması dava şartıdır ve Deniz’in uyuşmazlığı ' +
        'istisnalar arasında yer almamaktadır (TKHK m.73/A-1). Arabulucuya başvurulmadan açılan dava, herhangi bir işlem ' +
        'yapılmaksızın dava şartı yokluğundan usulden reddedilir (Hukuk Uyuşmazlıklarında Arabuluculuk Kanunu (HUAK) m.18/A-2).',
      sonuc: 'Sınırın üzerindeki tüketici uyuşmazlığında önce arabulucuya gidilir; gidilmeden açılan dava usulden reddedilir.',
      dayanaklar: [
        { kanun: 'tkhk', madde: '68', ifade: 'tüketici hakem heyetlerine başvuru zorunludur' },
        { kanun: 'tkhk', madde: '68', ifade: 'Bu değerlerin üzerindeki uyuşmazlıklar için tüketici hakem heyetlerine başvuru yapılamaz' },
        { kanun: 'tkhk', madde: '73', ifade: 'tüketicinin yerleşim yerinin bulunduğu yerdeki tüketici mahkemesinde de açılabilir' },
        { kanun: 'tkhk', madde: '73A', ifade: 'dava açılmadan önce arabulucuya başvurulmuş olması dava şartıdır' },
        { kanun: 'arabuluculuk', madde: '18A', ifade: 'dava şartı yokluğu sebebiyle usulden reddine karar verilir' },
      ],
    },
  ],
  sinavIskeleti: [
    {
      adim: 'Tüketici işleminin varlığı',
      aciklama: 'Bir tarafın ticari veya mesleki amaçla, diğerinin ticari veya mesleki olmayan amaçla hareket edip etmediği belirlenir.',
    },
    {
      adim: 'Sözleşme türü',
      aciklama: 'İşlemin satış, hizmet, tüketici kredisi, mesafeli ya da iş yeri dışında kurulan sözleşme olup olmadığı saptanır.',
    },
    {
      adim: 'Şekil ve bilgilendirme',
      aciklama: 'Yazılı şekil, ön bilgilendirme ve sözleşme örneğinin verilmesi yükümlülükleri ile ispat yükünün kimde olduğu denetlenir.',
    },
    {
      adim: 'Haksız şart',
      aciklama: 'Müzakere edilmeden konan şartların dürüstlük kuralına aykırı biçimde tüketici aleyhine dengesizlik yaratıp yaratmadığı incelenir.',
    },
    {
      adim: 'Talep ve süre',
      aciklama: 'Cayma, seçimlik haklar, erken ödeme ya da tazminat talebinin koşulları ile cayma ve zamanaşımı süreleri hesaplanır.',
    },
    {
      adim: 'Uyuşmazlık yolu',
      aciklama: 'Uyuşmazlığın değerine göre tüketici hakem heyeti ya da arabuluculuk ve tüketici mahkemesi yolu belirlenir.',
    },
  ],
  tuzakDefteri: [
    {
      tuzak: 'Haksız şart içeren tüketici sözleşmesi bütünüyle hükümsüz olur.',
      dogrusu: 'Haksız şartlar kesin olarak hükümsüz olup sözleşmenin bu şartlar dışındaki hükümleri geçerliliğini korur.',
      dayanak: { kanun: 'tkhk', madde: '5', ifade: 'Sözleşmenin haksız şartlar dışındaki hükümleri geçerliliğini korur' },
    },
    {
      tuzak: 'Tüketicinin borcu için alınan kefalet, sözleşmede öyle yazılmışsa müteselsil kefalettir.',
      dogrusu: 'Tüketicinin edimlerine karşılık alınan şahsi teminatlar, adı ne olursa olsun adi kefalet sayılır.',
      dayanak: { kanun: 'tkhk', madde: '4', ifade: 'her ne isim altında olursa olsun adi kefalet sayılır' },
    },
    {
      tuzak: 'Tüketici temerrüde düşerse ödenmeyen faize de faiz yürütülebilir.',
      dogrusu: 'Temerrüt hâli de dâhil olmak üzere tüketici işlemlerinde bileşik faiz uygulanmaz.',
      dayanak: { kanun: 'tkhk', madde: '4', ifade: 'tüketici işlemlerinde bileşik faiz uygulanmaz' },
    },
    {
      tuzak: 'Ayıplı maldan sorumluluğun zamanaşımı ayıbın ortaya çıktığı gün başlar.',
      dogrusu: 'Zamanaşımı, ayıp sonradan ortaya çıksa bile malın teslim tarihinden başlar; ayıp ağır kusur ya da hileyle gizlenmişse uygulanmaz.',
      dayanak: { kanun: 'tkhk', madde: '12', ifade: 'ayıp daha sonra ortaya çıkmış olsa bile' },
    },
    {
      tuzak: 'Kredi sözleşmesinden cayan tüketici, kullandığı parayı geri ödemeden borçtan kurtulur.',
      dogrusu: 'Krediden yararlanan tüketici anaparayı ve faizi cayma bildiriminden sonra otuz gün içinde öder, ödemezse cayılmamış sayılır.',
      dayanak: { kanun: 'tkhk', madde: '24', ifade: 'tüketici kredisinden cayılmamış sayılır' },
    },
    {
      tuzak: 'Tüketici hakem heyeti kararı tavsiye niteliğinde olup karşı tarafı bağlamaz.',
      dogrusu: 'Tüketici hakem heyeti kararları tarafları bağlar ve ilamlar gibi yerine getirilir; itiraz icrayı kendiliğinden durdurmaz.',
      dayanak: { kanun: 'tkhk', madde: '70', ifade: 'Tüketici hakem heyeti kararları tarafları bağlar' },
    },
    {
      tuzak: 'Taksitli tüketici satışında bütün borç için tek bir bono düzenlenebilir.',
      dogrusu: 'Yalnız nama yazılı ve her taksit için ayrı senet düzenlenebilir, aykırı senet tüketici yönünden geçersizdir.',
      dayanak: { kanun: 'tkhk', madde: '4', ifade: 'sadece nama yazılı ve her bir taksit ödemesi için ayrı ayrı olacak şekilde senet düzenlenebilir' },
    },
  ],
  kisaTest: [
    {
      q: 'Teslimden itibaren hangi süre içinde ortaya çıkan ayıbın teslim anında var olduğu kabul edilir?',
      choices: ['Altı ay', 'Bir yıl', 'İki yıl', 'Üç ay'],
      answer: 0,
      reason: 'TKHK m.10/1 teslimden itibaren altı ay içinde ortaya çıkan ayıpların teslim tarihinde var olduğunu kabul eder; aksini satıcı ispat eder.',
      dayanak: { kanun: 'tkhk', madde: '10', ifade: 'Teslim tarihinden itibaren altı ay içinde ortaya çıkan ayıpların' },
    },
    {
      q: 'Mesafeli sözleşmede tüketicinin gerekçe göstermeden cayma süresi kaç gündür?',
      choices: ['Yedi gün', 'On gün', 'On dört gün', 'Otuz gün'],
      answer: 2,
      reason: 'TKHK m.48/4 tüketiciye on dört gün içinde gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkı tanır.',
      dayanak: { kanun: 'tkhk', madde: '48', ifade: 'on dört gün içinde herhangi bir gerekçe göstermeksizin' },
    },
    {
      q: 'Garanti süresi, malın teslim tarihinden itibaren en az ne kadardır?',
      choices: ['Altı ay', 'Bir yıl', 'İki yıl', 'Beş yıl'],
      answer: 2,
      reason: 'TKHK m.56/2 garanti süresinin malın teslim tarihinden başlamak üzere asgari iki yıl olduğunu öngörür.',
      dayanak: { kanun: 'tkhk', madde: '56', ifade: 'Garanti süresi malın teslim tarihinden itibaren başlamak üzere asgari iki yıldır' },
    },
    {
      q: 'Konut veya tatil amaçlı taşınmazda ayıplı maldan sorumluluk teslimden itibaren hangi sürede zamanaşımına uğrar?',
      choices: ['İki yıl', 'Üç yıl', 'Beş yıl', 'On yıl'],
      answer: 2,
      reason: 'TKHK m.12/1 konut veya tatil amaçlı taşınmazlarda zamanaşımı süresini taşınmazın tesliminden itibaren beş yıl olarak belirler.',
      dayanak: { kanun: 'tkhk', madde: '12', ifade: 'Bu süre konut veya tatil amaçlı taşınmaz mallarda taşınmazın teslim tarihinden itibaren beş yıldır' },
    },
    {
      q: 'Tüketici hakem heyeti kararına karşı tüketici mahkemesine hangi süre içinde itiraz edilir?',
      choices: ['Yedi gün', 'On gün', 'İki hafta', 'Bir ay'],
      answer: 2,
      reason: 'TKHK m.70/3 itirazın kararın tebliğinden itibaren iki hafta içinde yapılacağını öngörür.',
      dayanak: { kanun: 'tkhk', madde: '70', ifade: 'tebliğ tarihinden itibaren iki hafta içinde' },
    },
    {
      q: 'Aşağıdaki uyuşmazlıklardan hangisinde dava şartı olarak arabuluculuk hükümleri uygulanmaz?',
      choices: [
        'Tüketici hakem heyeti kararına itiraz',
        'Heyet sınırını aşan ayıplı mal bedelinin iadesi',
        'Heyet sınırını aşan ayıplı hizmet bedelinin iadesi',
        'Heyet sınırını aşan bağlı kredi ödemelerinin iadesi',
      ],
      answer: 0,
      reason: 'TKHK m.73/A-1-b tüketici hakem heyeti kararlarına yapılan itirazları dava şartı olarak arabuluculuğun dışında tutar.',
      dayanak: { kanun: 'tkhk', madde: '73A', ifade: 'Tüketici hakem heyeti kararlarına yapılan itirazlar' },
    },
  ],
  kaynaklar: [
    {
      title: '6502 sayılı Tüketicinin Korunması Hakkında Kanun (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6502.pdf',
      note: 'Örnek olay, tuzak ve test dayanaklarının resmî metni',
    },
    {
      title: '6325 sayılı Hukuk Uyuşmazlıklarında Arabuluculuk Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6325.pdf',
      note: 'Dava şartı olarak arabuluculukta usulden ret hükmü (m.18/A)',
    },
  ],
};

export default katman;
