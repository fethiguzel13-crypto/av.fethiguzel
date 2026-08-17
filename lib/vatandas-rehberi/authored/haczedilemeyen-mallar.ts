import type { VatandasArticle } from '../types';

/**
 * Kaynak doğrulaması — hepsi content-packs/iik.json.gz resmî metninden:
 *   İİK m.82   haczi caiz olmayan mallar · ev eşyası (6352 s.K. değişikliği)
 *              · bedenî çalışmaya dayanan meslek eşyası · iki aylık yiyecek
 *   İİK m.83   kısmen haczi caiz olanlar · maaşta dörtte bir alt sınırı
 *              · birden fazla hacizde sıra
 *   İİK m.106  hacizden itibaren bir yıl içinde satış isteme (7343 s.K.)
 *
 * Doğrulama: node scripts/madde.mjs iik 82-83 · 106
 */
export const haczedilemeyenMallar: VatandasArticle = {
  slug: 'haczedilemeyen-mallar',
  title: 'Haczedilemeyen Mallar: Ev Eşyası, Maaş ve Meslek Aletleri',
  description:
    'Hangi mallar haczedilemez, maaşın ne kadarı haczedilebilir, ev eşyası haczi mümkün mü? İİK m.82 ve m.83 çerçevesinde borçlunun korunan hakları.',
  h1: 'Hangi mallar haczedilemez?',
  keywords: [
    'haczedilemeyen mallar',
    'ev eşyası haczi',
    'maaş haczi oranı',
    'maaşın dörtte biri',
    'haciz nelere yapılamaz',
  ],
  category: 'İcra',
  role: 'pillar',
  related: ['odeme-emrine-itiraz'],
  links: [
    { label: 'İİK m.82 — Haczi caiz olmayan mallar', href: '/mevzuat/iik/madde-82' },
    { label: 'İİK m.83 — Kısmen haczi caiz olanlar', href: '/mevzuat/iik/madde-83' },
    { label: 'İİK m.106 — Satış isteme süresi', href: '/mevzuat/iik/madde-106' },
    { label: 'İcra kapak hesabı aracı', href: '/hesaplama/icra-kapak' },
  ],
  lead:
    'Borçlunun ve aynı çatı altında yaşayan aile bireylerinin kişisel eşyası ile ailenin ortak kullanımına hizmet eden tüm ev eşyası haczedilemez. Maaş ve ücretler ise ancak geçim için gerekli miktar düşüldükten sonra, dörtte birinden az olmamak üzere haczedilebilir.',
  keyInsight:
    'Ev eşyası haczi 2012 değişikliğiyle kural olarak sona erdi; para, kıymetli evrak, altın ve süs eşyası gibi kıymetli şeyler ise bu korumanın dışındadır.',
  sections: [
    {
      heading: 'Ev eşyası artık haczedilemez',
      paragraphs: [
        'Uygulamada en çok merak edilen başlık budur ve 2012de köklü biçimde değişmiştir. 6352 sayılı Kanunla yeniden yazılan İİK m.82nin üçüncü bendi uyarınca, borçlu ve aynı çatı altında yaşayan aile bireylerine ait kişisel eşya ile ailenin ortak kullanımına hizmet eden tüm ev eşyası haczedilemez.',
        'Buzdolabı, çamaşır makinesi, televizyon, koltuk takımı gibi eşyalar bu kapsamdadır. Değişiklik öncesinde bu eşyaların bir kısmı haczedilebiliyordu; bugün ailenin ortak kullanımına hizmet ettiği sürece koruma altındadır.',
        'Korumanın bir sınırı vardır. Madde açıkça istisna koyar: Para, kıymetli evrak, altın, gümüş, değerli taş, antika veya süs eşyası gibi kıymetli şeyler bu korumanın dışındadır ve haczedilebilir.',
      ],
    },
    {
      heading: 'Mesleğini sürdürebilmesi için gerekli eşya',
      paragraphs: [
        'Kanun borçlunun kazanma kapasitesini de korur. Yine 6352 sayılı Kanunla değiştirilen ikinci bent uyarınca, ekonomik faaliyeti sermayesinden ziyade bedenî çalışmasına dayanan borçlunun mesleğini sürdürebilmesi için gerekli olan her türlü eşya haczedilemez.',
        'Ölçüt işin niteliğidir. Emeğiyle geçinen bir terzinin dikiş makinesi ya da bir marangozun tezgâhı bu kapsamdayken, sermaye yoğun bir işletmenin makine parkı aynı korumadan yararlanmaz.',
        'Dördüncü bent bu korumayı meslek gruplarına göre somutlaştırır. Borçlu çiftçi ise kendisinin ve ailesinin geçimi için zaruri olan arazi, çift hayvanları, nakil vasıtaları ve ziraat aletleri; değilse sanat ve mesleği için lüzumlu alet, edevat ve kitaplar ile arabacı, kayıkçı, hamal gibi küçük nakliye erbabının geçimlerini temin eden nakil vasıtaları haczedilemez.',
      ],
      bullets: [
        'Devlet malları ve özel kanunlarında haczi yasaklanan mallar',
        'Bedenî çalışmaya dayanan meslek için gerekli her türlü eşya',
        'Kişisel eşya ve ailenin ortak ev eşyası',
        'Çiftçinin geçimi için zaruri arazi, hayvan ve aletler',
        'Borçlu ve ailesinin iki aylık yiyecek ve yakacakları',
      ],
    },
    {
      heading: 'Geçim için asgari koruma',
      paragraphs: [
        'Kanun yalnız üretim araçlarını değil, günlük yaşamı da güvenceye alır. Altıncı bent uyarınca borçlunun ve ailesinin iki aylık yiyecek ve yakacakları haczedilemez; borçlu çiftçi ise gelecek mahsul için lazım olan tohumluğu da bu kapsamdadır.',
        'Hayvancılıkla geçinenler için ayrı bir ölçü vardır. Borçlu ve ailesinin idareleri için lüzumlu ise borçlunun tercih edeceği bir süt veren mandası veya ineği yahut üç keçi veya koyunu ile bunların üç aylık yem ve yataklıkları haczedilemez.',
        'Bu hükümler eski tarihli bir dili korumakla birlikte işlevi bellidir: İcra takibi borçluyu ödeyemez hâle getirmemeli, geçim ve üretim kapasitesi ayakta kalmalıdır.',
      ],
    },
    {
      heading: 'Maaş haczi: dörtte bir alt sınırı',
      paragraphs: [
        'Maaş tümüyle korunmaz ama tümüyle de haczedilemez. İİK m.83 bunları kısmen haczi caiz şeyler arasında sayar: Maaşlar, tahsisat ve her nevi ücretler, intifa hakları ve hasılatı, ilama müstenit olmayan nafakalar, emekli maaşları ile sigortalar veya emekli sandıkları tarafından tahsis edilen iratlar.',
        'Yöntem iki aşamalıdır. Önce borçlu ve ailesinin geçinmeleri için icra memurunca lüzumlu olarak takdir edilen miktar düşülür, kalan kısım haczolunabilir.',
        'Ne var ki bu takdir sınırsız değildir: Haczolunacak miktar bunların dörtte birinden az olamaz. Yani geçim takdiri ne kadar geniş tutulursa tutulsun, maaşın en az dörtte biri hacze konu olur.',
        'Birden fazla alacaklı varsa sıra kuralı işler. Birden fazla haciz varsa sıraya konur ve sırada önde olan haczin kesintisi bitmedikçe sonraki haciz için kesintiye geçilemez. Bu, maaştan aynı anda birden çok kesinti yapılmasını önler.',
      ],
    },
    {
      heading: 'Haciz sonrası: satış isteme süresi',
      paragraphs: [
        'Haciz konulması tek başına sonuç doğurmaz; alacaklının süresi içinde harekete geçmesi gerekir. 7343 sayılı Kanunla yeniden yazılan İİK m.106 uyarınca alacaklı veya borçlu, hacizden itibaren bir yıl içinde haczolunan malın satışını isteyebilir. Borçlunun üçüncü şahıslardaki alacağı da bu hükme tabidir.',
        'Süre içinde satış istenip de artırma sonucu satış gerçekleştirilemezse ek bir imkân doğar: Satış isteme süresi, satış isteyen alacaklı bakımından birinci fıkradaki sürenin sona ermesinden itibaren bir yıl daha uzar.',
        'Satış talebiyle birlikte kıymet takdiri ve satış giderlerinin tamamının peşin olarak yatırılması gerekir. Gider yatırılmadan yapılan talep sonuç doğurmaz.',
        'Süresi içinde satış istenmezse haciz kalkar. Borçlu açısından bu, dosyayı takip etmenin ne kadar önemli olduğunu gösterir.',
      ],
    },
    {
      heading: 'Haciz sırasında ne yapmalısınız?',
      paragraphs: [
        'Haciz tutanağı en kritik belgedir. Haczedilemeyecek bir eşya listeye alınmışsa itirazınızın tutanağa geçirilmesini isteyin; sonradan yapılacak itirazda bu kayıt belirleyici olur.',
        'Haczedilmezlik iddiası icra mahkemesine şikâyet yoluyla ileri sürülür. Süre kısadır ve kaçırılması hâlinde haciz geçerli hâle gelebilir.',
        'Maaş haczinde kesinti oranının doğru uygulanıp uygulanmadığını bordronuzdan takip edin. Dörtte birin üzerinde kesinti yapılıyorsa ya geçim takdiri hatalıdır ya da birden fazla haciz sırasız işletilmektedir.',
      ],
    },
  ],
  steps: [
    'Haciz tutanağının bir örneğini isteyin ve saklayın.',
    'Listedeki eşyaları İİK m.82 kapsamında değerlendirin: kişisel eşya, ortak ev eşyası, meslek aletleri.',
    'Haczedilemeyecek bir mal listeye alınmışsa itirazınızı tutanağa geçirtin.',
    'Süresi içinde icra mahkemesine haczedilmezlik şikâyetinde bulunun.',
    'Maaş haczinde kesinti oranını bordronuzdan kontrol edin; dörtte birin altına inilemez, üzerine çıkılması da tartışmalıdır.',
    'Birden fazla haciz varsa sıraya uyulup uyulmadığını inceleyin.',
    'Dosyayı takip edin: hacizden itibaren bir yıl içinde satış istenmezse haciz kalkar.',
  ],
  checklist: [
    'Haciz tutanağı örneği',
    'İcra dosyası esas numarası',
    'Maaş bordroları ve kesinti dökümü',
    'Eşyanın kime ait olduğunu gösteren belgeler',
    'Meslek faaliyetini belgeleyen kayıtlar',
  ],
  faq: [
    {
      q: 'Evimdeki eşyalar haczedilebilir mi?',
      a: 'Kural olarak hayır. Borçlu ve aynı çatı altında yaşayan aile bireylerine ait kişisel eşya ile ailenin ortak kullanımına hizmet eden tüm ev eşyası haczedilemez. Para, altın, kıymetli evrak ve süs eşyası gibi kıymetli şeyler bunun dışındadır.',
    },
    {
      q: 'Maaşın ne kadarı haczedilir?',
      a: 'Borçlu ve ailesinin geçimi için icra memurunca takdir edilen miktar düşüldükten sonra kalan kısım haczedilir; ancak haczolunacak miktar maaşın dörtte birinden az olamaz.',
    },
    {
      q: 'İki farklı alacaklı maaşıma haciz koyabilir mi?',
      a: 'Hacizler sıraya konur. Sırada önde olan haczin kesintisi bitmedikçe sonraki haciz için kesintiye geçilemez.',
    },
    {
      q: 'Emekli maaşı haczedilebilir mi?',
      a: 'İİK m.83 emekli maaşlarını kısmen haczi caiz şeyler arasında sayar. Bununla birlikte özel kanunlarda haczi yasaklayan hükümler bulunabilir; somut durumda dayanak kanuna bakmak gerekir.',
    },
    {
      q: 'Mesleğimi yaptığım aletler haczedilir mi?',
      a: 'Ekonomik faaliyeti sermayesinden ziyade bedenî çalışmasına dayanan borçlunun mesleğini sürdürebilmesi için gerekli her türlü eşya haczedilemez.',
    },
    {
      q: 'Haciz konuldu ama satış yapılmıyor, ne olur?',
      a: 'Alacaklı hacizden itibaren bir yıl içinde satış istemelidir. Süresi içinde satış istenmezse haciz kalkar.',
    },
    {
      q: 'Haczedilemeyecek mal haczedildi, ne yapmalıyım?',
      a: 'İcra mahkemesine haczedilmezlik şikâyetinde bulunmalısınız. İtirazınızın haciz tutanağına geçirilmesini istemek, sonraki aşamada işinizi kolaylaştırır.',
    },
  ],
  updated: '2026-08-16',
  sitemapPriority: 0.94,
};
