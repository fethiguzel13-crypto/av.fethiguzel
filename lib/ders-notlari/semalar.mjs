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
];

/** `medeni-usul-donem-2` → `medeni-usul` */
export const tabanKod = (kod) => kod.replace(/-(donem-[12]|yillik)$/, '');

/** Ders koduna bağlı şemalar, `SEMALAR` sırasıyla. */
export const dersSemalari = (kod) => {
  const taban = tabanKod(kod);
  return SEMALAR.filter((s) => s.dersler.includes(taban));
};
