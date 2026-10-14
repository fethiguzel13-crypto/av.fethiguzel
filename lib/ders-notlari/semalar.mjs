/**
 * Ders notu şemaları (Aylık plan G18). Her adım bir kanun maddesine bağlıdır: `dayanak.ifade`, depodaki
 * `content/mevzuat/<kanun>/madde-<madde>.md` dosyasının kanun metninde aynen geçer (`lib/__tests__/ders-semalari.test.mjs`).
 * Açıklamalar da yalnız aynı madde metninden kurulur; doktrin görüşü ya da içtihat yazılmaz.
 *
 * `tur`: `akis` sıralı adımdır (önceki adım sonrakinin koşuludur), `dal` ortak bir kökten ayrılan eş düzey kalemdir.
 * `dersler`: ders kodunun dönem ve yıllık eki atılmış hâli (`tabanKod`); şema dersin bütün fakülte ve sürümlerine gider.
 */

/** @typedef {{ kanun: string, madde: string, ifade: string }} Dayanak */
/** @typedef {{ etiket: string, aciklama?: string, dayanak: Dayanak }} Adim */
/** @typedef {{ id: string, tur: 'akis' | 'dal', baslik: string, ozet: string, dersler: string[], adimlar: Adim[] }} Sema */

/** @type {Sema[]} */
export const SEMALAR = [
  {
    id: 'medeni-yargilama',
    tur: 'akis',
    baslik: 'Yazılı yargılama usulünde davanın evreleri',
    ozet:
      'Dava dilekçesiyle açılan dava, dilekçelerin karşılıklı verilmesi, ön inceleme, tahkikat ve sözlü yargılamadan geçerek hükümle sona erer.',
    dersler: ['medeni-usul'],
    adimlar: [
      {
        etiket: 'Dava dilekçesi',
        aciklama: 'Dava, dava dilekçesinin kaydedildiği tarihte açılmış sayılır.',
        dayanak: { kanun: 'hmk', madde: '118', ifade: 'Dava, dava dilekçesinin kaydedildiği tarihte açılmış sayılır' },
      },
      {
        etiket: 'Cevap ve ikinci dilekçeler',
        aciklama: 'Davacı cevaba cevap, davalı ikinci cevap dilekçesini tebliğden itibaren iki hafta içinde verebilir.',
        dayanak: { kanun: 'hmk', madde: '136', ifade: 'iki hafta içinde cevaba cevap dilekçesi' },
      },
      {
        etiket: 'Ön inceleme',
        aciklama: 'Dava şartları ve ilk itirazlar incelenir, uyuşmazlık konuları tam olarak belirlenir.',
        dayanak: { kanun: 'hmk', madde: '137', ifade: 'Dilekçelerin karşılıklı verilmesinden sonra ön inceleme yapılır' },
      },
      {
        etiket: 'Tahkikat',
        aciklama: 'Tarafların ileri sürdüğü bütün iddia ve savunmalar birlikte incelenir.',
        dayanak: { kanun: 'hmk', madde: '143', ifade: 'Tarafların davada ileri sürdükleri bütün iddia ve savunmalar birlikte incelenir' },
      },
      {
        etiket: 'Sözlü yargılama',
        aciklama: 'Tahkikatın bittiği tefhim edildikten sonra mahkeme taraflara son sözlerini sorar.',
        dayanak: { kanun: 'hmk', madde: '186', ifade: 'sözlü yargılama aşamasına geçer' },
      },
      {
        etiket: 'Hüküm',
        aciklama: 'Uyuşmazlığın esası hakkında verilen nihai karar, yargılamanın sona erdiği duruşmada tefhim olunur.',
        dayanak: { kanun: 'hmk', madde: '294', ifade: 'Yargılama sonunda uyuşmazlığın esası hakkında verilen nihai karar, hükümdür' },
      },
    ],
  },
  {
    id: 'ilamsiz-icra',
    tur: 'akis',
    baslik: 'İlamsız icra takibinin akışı',
    ozet:
      'Takip talebiyle başlayan ilamsız takip, ödeme emri ve itiraz süresinden sonra haciz, satış ve paraların paylaştırılmasıyla ilerler.',
    dersler: ['icra-iflas', 'icra'],
    adimlar: [
      {
        etiket: 'Takip talebi',
        aciklama: 'İcra dairesine yazılı, sözlü ya da elektronik ortamda yapılır.',
        dayanak: { kanun: 'iik', madde: '58', ifade: 'Takip talebi icra dairesine yazılı veya sözlü olarak ya da elektronik ortamda yapılır' },
      },
      {
        etiket: 'Ödeme emri',
        aciklama: 'Talep kanundaki şartları içeriyorsa icra müdürü ödeme emri düzenler.',
        dayanak: { kanun: 'iik', madde: '60', ifade: 'ödeme emri düzenler' },
      },
      {
        etiket: 'İtiraz',
        aciklama: 'Borçlu, ödeme emrinin tebliğinden itibaren yedi gün içinde icra dairesine itiraz eder.',
        dayanak: { kanun: 'iik', madde: '62', ifade: 'ödeme emrinin tebliği tarihinden itibaren yedi gün içinde' },
      },
      {
        etiket: 'İtirazın hükmü',
        aciklama: 'Süresinde yapılan itiraz takibi durdurur.',
        dayanak: { kanun: 'iik', madde: '66', ifade: 'Müddeti içinde yapılan itiraz takibi durdurur' },
      },
      {
        etiket: 'Haciz',
        aciklama: 'Ödeme emrindeki süre geçtikten, itiraz edilmişse itiraz kaldırıldıktan sonra istenir.',
        dayanak: { kanun: 'iik', madde: '78', ifade: 'haciz konmasını isteyebilir' },
      },
      {
        etiket: 'Satış',
        aciklama: 'Alacaklı veya borçlu, hacizden itibaren bir yıl içinde satış isteyebilir.',
        dayanak: { kanun: 'iik', madde: '106', ifade: 'hacizden itibaren bir yıl içinde haczolunan malın satışını isteyebilir' },
      },
      {
        etiket: 'Paraların paylaştırılması',
        aciklama: 'Satış bedeli alakadarlara hisselerine göre paylaştırılır.',
        dayanak: { kanun: 'iik', madde: '138', ifade: 'bedelleri alakadarlara hisselerine göre paylaştırılır' },
      },
    ],
  },
  {
    id: 'ceza-muhakemesi-evreleri',
    tur: 'akis',
    baslik: 'Ceza muhakemesinin evreleri',
    ozet:
      'Soruşturma evresi iddianameyle kapanır; iddianamenin kabulüyle kovuşturma evresi başlar, duruşma hükümle sona erer.',
    dersler: ['ceza-muhakemesi'],
    adimlar: [
      {
        etiket: 'Soruşturma',
        aciklama: 'Cumhuriyet savcısı kamu davasını açmaya yer olup olmadığına karar vermek üzere işin gerçeğini araştırır.',
        dayanak: { kanun: 'cmk', madde: '160', ifade: 'hemen işin gerçeğini araştırmaya başlar' },
      },
      {
        etiket: 'İddianame',
        aciklama: 'Toplanan deliller yeterli şüphe oluşturuyorsa Cumhuriyet savcısı iddianame düzenler.',
        dayanak: { kanun: 'cmk', madde: '170', ifade: 'Cumhuriyet savcısı, bir iddianame düzenler' },
      },
      {
        etiket: 'İddianamenin incelenmesi',
        aciklama: 'Mahkeme on beş gün içinde inceler, eksik veya hatalı iddianameyi iade edebilir.',
        dayanak: { kanun: 'cmk', madde: '174', ifade: 'onbeş gün içinde' },
      },
      {
        etiket: 'Kabul ve duruşma hazırlığı',
        aciklama: 'İddianamenin kabulüyle kamu davası açılmış olur, mahkeme duruşma gününü belirler.',
        dayanak: { kanun: 'cmk', madde: '175', ifade: 'İddianamenin kabulüyle, kamu davası açılmış olur ve kovuşturma evresi başlar' },
      },
      {
        etiket: 'Duruşma',
        aciklama: 'Hükme katılacak hâkimler, Cumhuriyet savcısı ve zabıt kâtibi hazır bulunur.',
        dayanak: { kanun: 'cmk', madde: '188', ifade: 'hükme katılacak hâkimler ve Cumhuriyet savcısı ile zabıt kâtibinin' },
      },
      {
        etiket: 'Hüküm',
        aciklama: 'Beraat, mahkûmiyet, davanın reddi ve düşmesi gibi kararlar hükümdür.',
        dayanak: { kanun: 'cmk', madde: '223', ifade: 'Duruşmanın sona erdiği açıklandıktan sonra hüküm verilir' },
      },
    ],
  },
  {
    id: 'yasal-mirascilar',
    tur: 'akis',
    baslik: 'Yasal mirasçılar ve sağ kalan eşin payı',
    ozet:
      'Kan hısımları zümre sırasıyla mirasçı olur, önceki zümre yoksa sonraki gelir; sağ kalan eşin payı birlikte bulunduğu zümreye göre değişir.',
    dersler: ['miras-hukuku'],
    adimlar: [
      {
        etiket: 'Birinci zümre: altsoy',
        aciklama: 'Çocuklar eşit olarak mirasçıdır, önce ölen çocuğun yerini halefiyet yoluyla kendi altsoyu alır.',
        dayanak: { kanun: 'tmk', madde: '495', ifade: 'Mirasbırakanın birinci derece mirasçıları, onun altsoyudur' },
      },
      {
        etiket: 'İkinci zümre: ana ve baba',
        aciklama: 'Altsoyu bulunmayan mirasbırakanın mirasçıları ana ve babasıdır.',
        dayanak: { kanun: 'tmk', madde: '496', ifade: 'Altsoyu bulunmayan mirasbırakanın mirasçıları, ana ve babasıdır' },
      },
      {
        etiket: 'Üçüncü zümre: büyük ana ve büyük baba',
        aciklama: 'Önceki iki zümre bulunmuyorsa büyük ana ve büyük babalar eşit olarak mirasçıdır.',
        dayanak: { kanun: 'tmk', madde: '497', ifade: 'mirasçıları, büyük ana ve büyük babalarıdır' },
      },
      {
        etiket: 'Sağ kalan eş',
        aciklama:
          'Altsoyla birlikte dörtte bir, ana ve baba zümresiyle yarı, büyük ana ve büyük babalar ile çocuklarıyla dörtte üç; bunlar da yoksa mirasın tamamı.',
        dayanak: { kanun: 'tmk', madde: '499', ifade: 'bunlar da yoksa mirasın tamamı eşe kalır' },
      },
    ],
  },
  {
    id: 'borc-kaynaklari',
    tur: 'dal',
    baslik: 'Borç ilişkisinin kaynakları',
    ozet:
      'Türk Borçlar Kanunu genel hükümleri borç ilişkilerini sözleşmeden, haksız fiilden ve sebepsiz zenginleşmeden doğanlar olarak üç ayırımda düzenler.',
    dersler: ['borclar-genel'],
    adimlar: [
      {
        etiket: 'Sözleşme',
        aciklama: 'Tarafların iradelerini karşılıklı ve birbirine uygun olarak açıklamalarıyla kurulur.',
        dayanak: { kanun: 'tbk', madde: '1', ifade: 'Sözleşme, tarafların iradelerini karşılıklı ve birbirine uygun olarak açıklamalarıyla kurulur' },
      },
      {
        etiket: 'Haksız fiil',
        aciklama: 'Kusurlu ve hukuka aykırı bir fiille başkasına zarar veren, zararı gidermekle yükümlüdür.',
        dayanak: { kanun: 'tbk', madde: '49', ifade: 'Kusurlu ve hukuka aykırı bir fiille başkasına zarar veren, bu zararı gidermekle yükümlüdür' },
      },
      {
        etiket: 'Sebepsiz zenginleşme',
        aciklama: 'Haklı bir sebep olmaksızın başkasının malvarlığından veya emeğinden zenginleşen, zenginleşmeyi geri verir.',
        dayanak: { kanun: 'tbk', madde: '77', ifade: 'bu zenginleşmeyi geri vermekle yükümlüdür' },
      },
    ],
  },
  {
    id: 'dava-sarti-arabuluculuk',
    tur: 'akis',
    baslik: 'Dava şartı olarak arabuluculuk',
    ozet:
      'Kanunun dava şartı saydığı uyuşmazlıklarda, örneğin tüketici mahkemelerinde görülenlerde, dava açılmadan önce arabuluculuk bürosuna başvurulur.',
    dersler: ['arabuluculuk', 'tuketici-hukuku'],
    adimlar: [
      {
        etiket: 'Dava şartı',
        aciklama: 'Tüketici mahkemelerinde görülen uyuşmazlıklarda dava açılmadan önce arabulucuya başvurulmuş olması dava şartıdır.',
        dayanak: { kanun: 'tkhk', madde: '73A', ifade: 'dava açılmadan önce arabulucuya başvurulmuş olması dava şartıdır' },
      },
      {
        etiket: 'Büroya başvuru',
        aciklama: 'Başvuru, yetkili mahkemenin bulunduğu yerdeki arabuluculuk bürosuna yapılır.',
        dayanak: { kanun: 'arabuluculuk', madde: '18A', ifade: 'yetkili mahkemenin bulunduğu yer arabuluculuk bürosuna' },
      },
      {
        etiket: 'Arabulucunun belirlenmesi',
        aciklama: 'Büro, listeden arabulucuyu belirler; taraflar listedeki bir arabulucuda anlaşabilir.',
        dayanak: { kanun: 'arabuluculuk', madde: '18A', ifade: 'listeden büro tarafından belirlenir' },
      },
      {
        etiket: 'İlk toplantı',
        aciklama: 'Arabulucu tarafları görevlendirme konusunda bilgilendirir ve ilk toplantıya davet eder.',
        dayanak: { kanun: 'arabuluculuk', madde: '18A', ifade: 'ilk toplantıya davet eder' },
      },
      {
        etiket: 'Son tutanak ve dava',
        aciklama: 'Anlaşma olmazsa son tutanak dava dilekçesine eklenir; başvurusuz dava usulden reddedilir.',
        dayanak: { kanun: 'arabuluculuk', madde: '18A', ifade: 'dava dilekçesine eklemek zorundadır' },
      },
    ],
  },
  {
    id: 'ise-iade',
    tur: 'akis',
    baslik: 'Geçerli sebeple fesih ve işe iade',
    ozet:
      'Feshin geçerli sebebe dayanması gereken işçi, yazılı fesih bildiriminden sonra önce arabulucuya, anlaşma olmazsa iş mahkemesine başvurur.',
    dersler: ['is-hukuku'],
    adimlar: [
      {
        etiket: 'Geçerli sebep',
        aciklama: 'Otuz veya daha fazla işçili işyerinde, en az altı aylık kıdemli işçinin belirsiz süreli sözleşmesi için aranır.',
        dayanak: { kanun: 'is-kanunu', madde: '18', ifade: 'geçerli bir sebebe dayanmak zorundadır' },
      },
      {
        etiket: 'Yazılı fesih bildirimi',
        aciklama: 'Fesih sebebi açık ve kesin olarak belirtilir; davranış veya verim nedeniyle fesihte savunma alınır.',
        dayanak: { kanun: 'is-kanunu', madde: '19', ifade: 'fesih bildirimini yazılı olarak yapmak' },
      },
      {
        etiket: 'Bir ay içinde arabulucu',
        aciklama: 'İşçi, fesih bildiriminin tebliğinden itibaren bir ay içinde işe iade talebiyle arabulucuya başvurur.',
        dayanak: { kanun: 'is-kanunu', madde: '20', ifade: 'bir ay içinde işe iade talebiyle' },
      },
      {
        etiket: 'İki hafta içinde dava',
        aciklama: 'Anlaşma olmazsa son tutanaktan itibaren iki hafta içinde iş mahkemesinde dava açılabilir.',
        dayanak: { kanun: 'is-kanunu', madde: '20', ifade: 'iki hafta içinde iş mahkemesinde dava açılabilir' },
      },
      {
        etiket: 'İşe başlatma',
        aciklama: 'Fesih geçersiz sayılırsa işveren işçiyi bir ay içinde işe başlatır; başlatmazsa tazminat öder.',
        dayanak: { kanun: 'is-kanunu', madde: '21', ifade: 'işçiyi bir ay içinde işe başlatmak zorundadır' },
      },
    ],
  },
  {
    id: 'tasinmaz-mulkiyeti',
    tur: 'dal',
    baslik: 'Taşınmaz mülkiyetinin kazanılması ve tescil',
    ozet:
      'Taşınmaz mülkiyeti kural olarak tescille kazanılır; kanunun saydığı hâllerde tescilden önce kazanılsa da tasarruf için tescil gerekir.',
    dersler: ['esya-hukuku'],
    adimlar: [
      {
        etiket: 'Kural: tescil',
        aciklama: 'Taşınmaz mülkiyetinin kazanılması tescille olur.',
        dayanak: { kanun: 'tmk', madde: '705', ifade: 'Taşınmaz mülkiyetinin kazanılması, tescille olur' },
      },
      {
        etiket: 'Tescilden önce kazanma',
        aciklama: 'Miras, mahkeme kararı, cebrî icra, işgal, kamulaştırma ve kanundaki diğer hâller.',
        dayanak: { kanun: 'tmk', madde: '705', ifade: 'mülkiyet tescilden önce kazanılır' },
      },
      {
        etiket: 'Tasarruf için tescil',
        aciklama: 'Bu hâllerde malikin tasarruf işlemi yapabilmesi tapu kütüğüne tescile bağlıdır.',
        dayanak: { kanun: 'tmk', madde: '705', ifade: 'mülkiyetin tapu kütüğüne tescil edilmiş olmasına bağlıdır' },
      },
      {
        etiket: 'Aynî hakkın doğumu',
        aciklama: 'Aynî haklar kütüğe tescil ile doğar, sırasını ve tarihini tescile göre alır.',
        dayanak: { kanun: 'tmk', madde: '1022', ifade: 'Aynî haklar, kütüğe tescil ile doğar' },
      },
    ],
  },
  {
    id: 'suc-inceleme-sirasi',
    tur: 'akis',
    baslik: 'Bir fiilin cezalandırılabilirliğinin inceleme sırası',
    ozet:
      'Kanunilik, kast ya da taksir, hukuka uygunluk nedenleri ve kusur sırasıyla aranır; teşebbüs ve iştirak bu incelemeden sonra gelir.',
    dersler: ['ceza-genel'],
    adimlar: [
      {
        etiket: 'Kanunilik',
        aciklama: 'Kanunun açıkça suç saymadığı bir fiil için ceza verilemez ve güvenlik tedbiri uygulanamaz.',
        dayanak: { kanun: 'tck', madde: '2', ifade: 'Kanunun açıkça suç saymadığı bir fiil için kimseye ceza verilemez' },
      },
      {
        etiket: 'Kast ya da taksir',
        aciklama: 'Suçun oluşması kastın varlığına bağlıdır; taksirle işlenen fiil yalnız kanunun açıkça belirttiği hâllerde cezalandırılır.',
        dayanak: { kanun: 'tck', madde: '21', ifade: 'Suçun oluşması kastın varlığına bağlıdır' },
      },
      {
        etiket: 'Hukuka uygunluk nedenleri',
        aciklama: 'Kanunun hükmünü yerine getiren, meşru savunmada bulunan ya da hakkını kullanan kimseye ceza verilmez.',
        dayanak: { kanun: 'tck', madde: '24', ifade: 'Kanunun hükmünü yerine getiren kimseye ceza verilmez' },
      },
      {
        etiket: 'Kusur',
        aciklama: 'Akıl hastalığı nedeniyle fiilin hukuki anlam ve sonuçlarını algılayamayan kişiye ceza verilmez, güvenlik tedbirine hükmolunur.',
        dayanak: { kanun: 'tck', madde: '32', ifade: 'işlediği fiilin hukuki anlam ve sonuçlarını algılayamayan' },
      },
      {
        etiket: 'Teşebbüs',
        aciklama: 'Elverişli hareketlerle icraya başlanıp elde olmayan nedenlerle tamamlanamayan suçtan teşebbüs hükmüyle sorumlu olunur.',
        dayanak: { kanun: 'tck', madde: '35', ifade: 'elverişli hareketlerle doğrudan doğruya icraya başlayıp' },
      },
      {
        etiket: 'İştirak',
        aciklama: 'Suçun kanuni tanımındaki fiili birlikte gerçekleştirenlerden her biri fail olarak sorumludur.',
        dayanak: { kanun: 'tck', madde: '37', ifade: 'fiili birlikte gerçekleştiren kişilerden her biri, fail olarak sorumlu olur' },
      },
    ],
  },
  {
    id: 'tacir-hukumleri',
    tur: 'dal',
    baslik: 'Tacir olmanın başlıca sonuçları',
    ozet:
      'Tacir sıfatı iflasa tabi olmayı, unvan ve tescil yükümlülüğünü, basiretli iş adamı özenini, ihtarların şekline uymayı ve sözleşme cezasının indirilmemesini birlikte getirir.',
    dersler: ['ticari-isletme'],
    adimlar: [
      {
        etiket: 'İflasa tabi olma',
        aciklama: 'Tacir her türlü borcu için iflasa tabidir.',
        dayanak: { kanun: 'ttk', madde: '18', ifade: 'tacir, her türlü borcu için iflasa tabidir' },
      },
      {
        etiket: 'Unvan ve tescil',
        aciklama: 'Tacir işletmesini ve unvanını açılıştan itibaren on beş gün içinde tescil ve ilan ettirir.',
        dayanak: { kanun: 'ttk', madde: '40', ifade: 'ticari işletmenin açıldığı günden itibaren onbeş gün içinde' },
      },
      {
        etiket: 'Basiretli iş adamı özeni',
        aciklama: 'Tacir ticaretine ait bütün faaliyetlerinde basiretli bir iş adamı gibi hareket eder.',
        dayanak: { kanun: 'ttk', madde: '18', ifade: 'basiretli bir iş adamı gibi hareket etmesi gerekir' },
      },
      {
        etiket: 'İhtarların şekli',
        aciklama: 'Tacirler arasında temerrüt, fesih ve dönme ihtarları noter, taahhütlü mektup, telgraf ya da KEP ile yapılır.',
        dayanak: { kanun: 'ttk', madde: '18', ifade: 'tacirler arasında, diğer tarafı temerrüde düşürmeye' },
      },
      {
        etiket: 'Ücret ve faiz',
        aciklama: 'Ticari işletmesiyle ilgili iş gören tacir uygun bir ücret ve avansları için faiz isteyebilir.',
        dayanak: { kanun: 'ttk', madde: '20', ifade: 'uygun bir ücret isteyebilir' },
      },
      {
        etiket: 'Cezanın indirilmemesi',
        aciklama: 'Tacir borçlu aşırı olduğu iddiasıyla sözleşme cezasının indirilmesini isteyemez.',
        dayanak: { kanun: 'ttk', madde: '22', ifade: 'ücret veya sözleşme cezasının indirilmesini mahkemeden isteyemez' },
      },
    ],
  },
  {
    id: 'anonim-sirket-kurulusu',
    tur: 'akis',
    baslik: 'Anonim şirketin kuruluşu ve organları',
    ozet:
      'Esas sözleşme şekline uygun imzalanır, kurucular sermayenin tamamını taahhüt eder, şirket tescille tüzel kişilik kazanır ve yönetim kurulu ile genel kurul üzerinden işler.',
    dersler: ['ticaret-sirketler'],
    adimlar: [
      {
        etiket: 'Esas sözleşme',
        aciklama: 'Esas sözleşme yazılı yapılır, kurucuların imzaları noterce onaylanır ya da sicil müdürü huzurunda imzalanır.',
        dayanak: { kanun: 'ttk', madde: '339', ifade: 'esas sözleşmenin yazılı şekilde yapılması' },
      },
      {
        etiket: 'Kurucu işlem',
        aciklama: 'Kurucular sermayenin tamamını ödemeyi şartsız taahhüt ederek şirket kurma iradelerini açıklar.',
        dayanak: { kanun: 'ttk', madde: '335', ifade: 'sermayenin tamamını ödemeyi, şartsız taahhüt ettikleri' },
      },
      {
        etiket: 'Tescil ve tüzel kişilik',
        aciklama: 'Şirket ticaret siciline tescil ile tüzel kişilik kazanır.',
        dayanak: { kanun: 'ttk', madde: '355', ifade: 'şirket ticaret siciline tescil ile tüzel kişilik kazanır' },
      },
      {
        etiket: 'Tescil öncesi işlemler',
        aciklama: 'Tescilden önce şirket adına işlem yapanlar şahsen ve müteselsilen sorumludur; şirket üç ay içinde kabul ederse yalnız şirket sorumlu olur.',
        dayanak: { kanun: 'ttk', madde: '355', ifade: 'şahsen ve müteselsilen sorumludurlar' },
      },
      {
        etiket: 'Yönetim kurulu',
        aciklama: 'Şirketin esas sözleşmeyle atanmış ya da genel kurulca seçilmiş, bir veya daha fazla kişiden oluşan yönetim kurulu bulunur.',
        dayanak: { kanun: 'ttk', madde: '359', ifade: 'bir veya daha fazla kişiden oluşan bir yönetim kurulu bulunur' },
      },
      {
        etiket: 'Genel kurul',
        aciklama: 'Esas sözleşme değişikliği ve yönetim kurulu seçimi gibi yetkiler genel kurula aittir ve devredilemez.',
        dayanak: { kanun: 'ttk', madde: '408', ifade: 'genel kurula ait aşağıdaki görevler ve yetkiler devredilemez' },
      },
    ],
  },
  {
    id: 'kamulastirma-sureci',
    tur: 'akis',
    baslik: 'Kamulaştırma süreci',
    ozet:
      'Kamu yararı kararından sonra taşınmaz tespit edilip sicile şerh verilir, önce satın alma denenir, uzlaşma olmazsa bedel mahkemece tespit edilir ve mülkiyet tescil kararıyla idareye geçer.',
    dersler: ['idare-hukuku'],
    adimlar: [
      {
        etiket: 'Kamu yararı kararı',
        aciklama: 'Kamu yararı kararını kanunda sayılan merci verir; belediye yararına kamulaştırmada bu merci belediye encümenidir.',
        dayanak: { kanun: 'kamulastirma', madde: '5', ifade: 'kamu yararı kararı verecek merciler şunlardır' },
      },
      {
        etiket: 'Tespit ve şerh',
        aciklama: 'İdare taşınmazı ve maliklerini tespit eder, kamulaştırmanın tapu siciline şerh verilmesini bildirir.',
        dayanak: { kanun: 'kamulastirma', madde: '7', ifade: 'kamulaştırmanın tapu siciline şerh verilmesini' },
      },
      {
        etiket: 'Satın alma usulü',
        aciklama: 'Tapulu taşınmazlarda önce kıymet takdiri yapılır ve pazarlıkla satın alma ya da trampa denenir.',
        dayanak: { kanun: 'kamulastirma', madde: '8', ifade: 'satın alma usulünü öncelikle uygulamaları esastır' },
      },
      {
        etiket: 'Bedel tespiti ve tescil davası',
        aciklama: 'Uzlaşma olmazsa idare asliye hukuk mahkemesinden bedelin tespitini ve tescili ister.',
        dayanak: { kanun: 'kamulastirma', madde: '10', ifade: 'taşınmaz malın bulunduğu yer asliye hukuk mahkemesine müracaat eder' },
      },
      {
        etiket: 'İptal ve düzeltim davası',
        aciklama: 'Malik, mahkemenin tebligatından itibaren otuz gün içinde idari yargıda iptal, adli yargıda düzeltim davası açabilir.',
        dayanak: { kanun: 'kamulastirma', madde: '14', ifade: 'otuz gün içinde, kamulaştırma işlemine karşı idari yargıda iptal' },
      },
      {
        etiket: 'Mülkiyetin geçmesi',
        aciklama: 'Mülkiyet idareye mahkemece verilen tescil kararıyla geçer.',
        dayanak: { kanun: 'kamulastirma', madde: '25', ifade: 'mülkiyetin idareye geçmesi, mahkemece verilen tescil kararı ile olur' },
      },
    ],
  },
  {
    id: 'edinilmis-mallara-katilma-tasfiyesi',
    tur: 'akis',
    baslik: 'Edinilmiş mallara katılma rejiminin tasfiyesi',
    ozet:
      'Rejimin sona erdiği an belirlenir, mallar edinilmiş ve kişisel olarak ayrılır, eklenecek değerler katılır, her eşin artık değeri bulunur ve eşler birbirinin artık değerinin yarısını alır.',
    dersler: ['aile-hukuku'],
    adimlar: [
      {
        etiket: 'Sona erme anı',
        aciklama: 'Boşanma, iptal ya da mal ayrılığı kararında rejim dava tarihinden geçerli olmak üzere sona erer.',
        dayanak: { kanun: 'tmk', madde: '225', ifade: 'mal rejimi dava tarihinden geçerli olmak üzere sona erer' },
      },
      {
        etiket: 'Edinilmiş mallar',
        aciklama: 'Rejim süresince karşılık verilerek edinilen değerler, özellikle çalışmanın karşılığı ve kişisel malların gelirleri.',
        dayanak: { kanun: 'tmk', madde: '219', ifade: 'karşılığını vererek elde ettiği malvarlığı değerleridir' },
      },
      {
        etiket: 'Kişisel mallar',
        aciklama: 'Kişisel kullanım eşyası, rejim başındaki mallar, miras ve karşılıksız kazanımlar ile manevî tazminat alacakları.',
        dayanak: { kanun: 'tmk', madde: '220', ifade: 'Aşağıda sayılanlar, kanun gereğince kişisel maldır' },
      },
      {
        etiket: 'Eklenecek değerler',
        aciklama: 'Son bir yıldaki rızasız karşılıksız kazandırmalar ve katılma alacağını azaltma kastıyla yapılan devirler eklenir.',
        dayanak: { kanun: 'tmk', madde: '229', ifade: 'edinilmiş mallara değer olarak eklenir' },
      },
      {
        etiket: 'Artık değer',
        aciklama: 'Edinilmiş malların toplam değerinden bu mallara ilişkin borçlar çıkarılır, değer eksilmesi hesaba katılmaz.',
        dayanak: { kanun: 'tmk', madde: '231', ifade: 'bu mallara ilişkin borçlar çıkarıldıktan sonra kalan miktardır' },
      },
      {
        etiket: 'Katılma alacağı',
        aciklama: 'Her eş diğerinin artık değerinin yarısını alır ve karşılıklı alacaklar takas edilir.',
        dayanak: { kanun: 'tmk', madde: '236', ifade: 'diğer eşe ait artık değerin yarısı üzerinde hak sahibi olurlar' },
      },
    ],
  },
  {
    id: 'satista-ayip',
    tur: 'akis',
    baslik: 'Satışta ayıptan sorumluluk',
    ozet:
      'Satılanda ayıp varsa alıcı satılanı gözden geçirip ayıbı bildirir, ardından seçimlik haklarından birini kullanır; dava hakkı devirden başlayarak iki yılda zamanaşımına uğrar.',
    dersler: ['borclar-ozel'],
    adimlar: [
      {
        etiket: 'Ayıbın varlığı',
        aciklama: 'Bildirilen niteliğin yokluğu ya da değeri ve beklenen faydayı önemli ölçüde azaltan maddi, hukuki veya ekonomik ayıp.',
        dayanak: { kanun: 'tbk', madde: '219', ifade: 'maddi, hukuki ya da ekonomik ayıpların bulunmasından' },
      },
      {
        etiket: 'Alıcının bilgisi',
        aciklama: 'Satıcı, sözleşme kurulurken alıcının bildiği ayıplardan sorumlu değildir.',
        dayanak: { kanun: 'tbk', madde: '222', ifade: 'alıcı tarafından bilinen ayıplardan sorumlu değildir' },
      },
      {
        etiket: 'Gözden geçirme ve bildirim',
        aciklama: 'Alıcı satılanı imkân bulur bulmaz gözden geçirir ve ayıbı uygun sürede bildirir, gizli ayıbı ise hemen bildirir.',
        dayanak: { kanun: 'tbk', madde: '223', ifade: 'bunu uygun bir süre içinde ona bildirmek zorundadır' },
      },
      {
        etiket: 'Seçimlik haklar',
        aciklama: 'Sözleşmeden dönme, bedelden indirim, ücretsiz onarım ya da ayıpsız benzeriyle değiştirme.',
        dayanak: { kanun: 'tbk', madde: '227', ifade: 'aşağıdaki seçimlik haklardan birini kullanabilir' },
      },
      {
        etiket: 'Zamanaşımı',
        aciklama: 'Satıcı ağır kusurlu değilse dava devirden başlayarak iki yılda zamanaşımına uğrar.',
        dayanak: { kanun: 'tbk', madde: '231', ifade: 'devrinden başlayarak iki yıl geçmekle zamanaşımına uğrar' },
      },
    ],
  },
  {
    id: 'kisilik-hakkinin-korunmasi',
    tur: 'akis',
    baslik: 'Kişilik hakkının korunması',
    ozet:
      'Kişilik hakkına saldırı, haklı kılan bir sebep yoksa hukuka aykırıdır; davacı önleme, durdurma ya da tespit ister, yanında düzeltme ve tazminat isteyebilir.',
    dersler: ['medeni-baslangic'],
    adimlar: [
      {
        etiket: 'Kişilik hakkına saldırı',
        aciklama: 'Hukuka aykırı olarak kişilik hakkına saldırılan kimse hâkimden korunma ister.',
        dayanak: { kanun: 'tmk', madde: '24', ifade: 'Hukuka aykırı olarak kişilik hakkına saldırılan kimse' },
      },
      {
        etiket: 'Hukuka uygunluk sebepleri',
        aciklama: 'Zedelenenin rızası, daha üstün özel veya kamusal yarar ya da kanunun verdiği yetki saldırıyı haklı kılar.',
        dayanak: { kanun: 'tmk', madde: '24', ifade: 'kanunun verdiği yetkinin kullanılması sebeplerinden biriyle haklı kılınmadıkça' },
      },
      {
        etiket: 'Önleme, durdurma, tespit',
        aciklama: 'Saldırı tehlikesinin önlenmesi, süren saldırıya son verilmesi ya da etkisi süren saldırının tespiti istenir.',
        dayanak: { kanun: 'tmk', madde: '25', ifade: 'saldırı tehlikesinin önlenmesini' },
      },
      {
        etiket: 'Düzeltme ve tazminat',
        aciklama: 'Düzeltmenin veya kararın yayımlanması ile maddî ve manevî tazminat istemleri birlikte ileri sürülebilir.',
        dayanak: { kanun: 'tmk', madde: '25', ifade: 'maddî ve manevî tazminat istemleri' },
      },
      {
        etiket: 'Yetkili mahkeme',
        aciklama: 'Davacı kendi yerleşim yeri ile davalının yerleşim yeri mahkemesi arasında seçim yapar.',
        dayanak: { kanun: 'tmk', madde: '25', ifade: 'kendi yerleşim yeri veya davalının yerleşim yeri mahkemesinde' },
      },
    ],
  },
];

/** `medeni-usul-donem-2` → `medeni-usul` */
export const tabanKod = (kod) => kod.replace(/-(donem-[12]|yillik)$/, '');

/** Ders koduna bağlı şemalar, `SEMALAR` sırasıyla. */
export const dersSemalari = (kod) => {
  const taban = tabanKod(kod);
  return SEMALAR.filter((s) => s.dersler.includes(taban));
};
