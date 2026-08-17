import type { VatandasArticle } from '../types';

/**
 * Kaynak doğrulaması — hepsi content-packs/tmk.json.gz resmî metninden:
 *   TMK m.169  boşanma davasında hâkimin resen aldığı geçici önlemler
 *   TMK m.175  yoksulluk nafakası · kusuru daha ağır olmamak · süresiz
 *              · yükümlünün kusuru aranmaz
 *   TMK m.176  toptan veya irat · kendiliğinden kalkma ve kaldırma hâlleri
 *   TMK m.182  iştirak nafakası · gücü oranında katılma · gelecek yıllar
 *   TMK m.197  birlikte yaşamaya ara verilmesinde parasal katkı
 *   TMK m.328  bakım borcunun süresi · ergin olma · eğitim devam ediyorsa
 *
 * Doğrulama: node scripts/madde.mjs tmk 175-176 · 182 · 197 · 328
 *
 * NOT: Nafaka miktarı somut olaya göre hâkim takdiridir; metinde tutar veya
 * oran verilmez, ölçütler anlatılır.
 */
export const nafakaTurleri: VatandasArticle = {
  slug: 'nafaka-turleri-ve-sartlari',
  title: 'Nafaka Türleri: Tedbir, Yoksulluk ve İştirak Nafakası',
  description:
    'Tedbir, yoksulluk ve iştirak nafakası arasındaki fark nedir, kim hangi şartlarla isteyebilir, nafaka ne zaman kalkar? TMK m.169, 175, 176, 182 ve 328 çerçevesinde.',
  h1: 'Nafaka türleri ve şartları',
  keywords: [
    'nafaka',
    'yoksulluk nafakası',
    'iştirak nafakası',
    'tedbir nafakası',
    'nafaka şartları',
    'nafaka ne zaman kalkar',
  ],
  category: 'Aile',
  role: 'pillar',
  related: ['bosanma-davasi-nasil-acilir'],
  links: [
    { label: 'TMK m.169 — Geçici önlemler', href: '/mevzuat/tmk/madde-169' },
    { label: 'TMK m.175 — Yoksulluk nafakası', href: '/mevzuat/tmk/madde-175' },
    { label: 'TMK m.176 — Ödeme biçimi ve kalkması', href: '/mevzuat/tmk/madde-176' },
    { label: 'TMK m.182 — Çocuğun giderlerine katılma', href: '/mevzuat/tmk/madde-182' },
    { label: 'TMK m.328 — Bakım borcunun süresi', href: '/mevzuat/tmk/madde-328' },
    { label: 'Nafaka hesaplama aracı', href: '/hesaplama/nafaka' },
  ],
  lead:
    'Üç ayrı nafaka vardır: dava sürerken hâkimin resen aldığı tedbir nafakası, boşanma sonrası yoksulluğa düşecek eş için yoksulluk nafakası ve çocuğun giderleri için iştirak nafakası. Şartları ve süreleri birbirinden farklıdır.',
  keyInsight:
    'Yoksulluk nafakasında istemde bulunan tarafın kusurunun daha ağır olmaması aranır; buna karşılık nafaka yükümlüsünün kusuru hiç aranmaz.',
  sections: [
    {
      heading: 'Tedbir nafakası: dava sürerken',
      paragraphs: [
        'Boşanma davası açıldığında taraflar kararı beklerken de yaşamak zorundadır. TMK m.169 bu boşluğu doldurur: Boşanma veya ayrılık davası açılınca hâkim, davanın devamı süresince gerekli olan, özellikle eşlerin barınmasına, geçimine, eşlerin mallarının yönetimine ve çocukların bakım ve korunmasına ilişkin geçici önlemleri resen alır.',
        'Buradaki resen ifadesi belirleyicidir. Hâkim bu önlemleri taraflardan biri istemese dahi almakla yükümlüdür; talep edilmemiş olması engel değildir.',
        'Henüz boşanma davası açılmamışsa da bir yol vardır. TMK m.197 uyarınca eşlerden biri, ortak hayat sebebiyle kişiliği, ekonomik güvenliği veya ailenin huzuru ciddî biçimde tehlikeye düştüğü sürece ayrı yaşama hakkına sahiptir; ayrılık haklı bir sebebe dayanıyorsa hâkim, eşlerden birinin istemi üzerine birinin diğerine yapacağı parasal katkıya ilişkin önlemleri alır.',
      ],
    },
    {
      heading: 'Yoksulluk nafakası: boşanmadan sonra',
      paragraphs: [
        'Boşanma kararı kesinleştikten sonra devreye giren nafaka budur. TMK m.175 uyarınca boşanma yüzünden yoksulluğa düşecek taraf, kusuru daha ağır olmamak koşuluyla geçimi için diğer taraftan malî gücü oranında süresiz olarak nafaka isteyebilir.',
        'Maddenin son cümlesi çoğu zaman gözden kaçar ama dosyanın seyrini değiştirir: Nafaka yükümlüsünün kusuru aranmaz. Yani hiç kusuru bulunmayan eş de nafaka ödemekle yükümlü tutulabilir; aranan tek kusur ölçütü, isteyen tarafın kusurunun daha ağır olmamasıdır.',
        'İki koşul birlikte gerçekleşmelidir. Birincisi boşanma yüzünden yoksulluğa düşmek, ikincisi kusurun daha ağır olmaması. Süresiz ifadesi ise nafakanın ömür boyu sürmesi anlamına gelmez; m.176 kalkma hâllerini ayrıca düzenler.',
        'Miktarın ölçüsü kanunda tek bir cümleyle verilir: diğer tarafın malî gücü oranında. Somut tutar hâkimin takdirindedir ve tarafların gelirleri, yaşam düzeyi, ihtiyaçlar ile ekonomik koşullar birlikte değerlendirilir.',
      ],
    },
    {
      heading: 'İştirak nafakası: çocuk için',
      paragraphs: [
        'Çocuğun giderlerine katılma yükümlülüğü velayetten bağımsızdır. TMK m.182 uyarınca velayetin kullanılması kendisine verilmeyen eş, çocuğun bakım ve eğitim giderlerine gücü oranında katılmak zorundadır.',
        'Hâkim yalnız bugünü değil geleceği de düzenleyebilir: İstem hâlinde, irat biçiminde ödenmesine karar verilen bu giderlerin gelecek yıllarda tarafların sosyal ve ekonomik durumlarına göre ne miktarda ödeneceğini karara bağlayabilir. Bu, her yıl yeniden dava açma yükünü ortadan kaldırır.',
        'Sürenin sınırı m.328de çizilir. Ana ve babanın bakım borcu çocuğun ergin olmasına kadar devam eder; çocuk ergin olduğu hâlde eğitimi sürüyorsa ana ve baba, durum ve koşullara göre kendilerinden beklenebilecek ölçüde olmak üzere eğitimi sona erinceye kadar çocuğa bakmakla yükümlüdür.',
        'Bu nedenle on sekiz yaşın dolması iştirak nafakasını kendiliğinden bitirmez. Üniversite öğrenimi süren çocuk bakımından yükümlülük, beklenebilirlik ölçütü içinde devam eder.',
      ],
    },
    {
      heading: 'Nafaka nasıl ödenir, ne zaman kalkar?',
      paragraphs: [
        'Ödeme biçimi TMK m.176da düzenlenir. Maddî tazminat ve yoksulluk nafakasının toptan veya durumun gereklerine göre irat biçiminde ödenmesine karar verilebilir; buna karşılık manevî tazminatın irat biçiminde ödenmesine karar verilemez.',
        'Kanun iki farklı sona erme mekanizması kurar. Bazı hâllerde nafaka kendiliğinden kalkar: İrat biçiminde ödenmesine karar verilen maddî tazminat veya nafaka, alacaklı tarafın yeniden evlenmesi ya da taraflardan birinin ölümü hâlinde kendiliğinden sona erer.',
        'Bazı hâllerde ise mahkeme kararı gerekir. Alacaklı tarafın evlenme olmaksızın fiilen evliymiş gibi yaşaması, yoksulluğunun ortadan kalkması ya da haysiyetsiz hayat sürmesi hâllerinde nafaka mahkeme kararıyla kaldırılır.',
        'Ayrım pratikte önemlidir: Kendiliğinden kalkan hâllerde ödeme durdurulabilirken, diğerlerinde dava açılmadan tek taraflı olarak ödemeyi kesmek icra takibi riskini doğurur.',
      ],
      bullets: [
        'Kendiliğinden kalkar: alacaklının yeniden evlenmesi, taraflardan birinin ölümü',
        'Mahkeme kararıyla kalkar: fiilen evli gibi yaşama, yoksulluğun sona ermesi, haysiyetsiz hayat sürme',
      ],
    },
    {
      heading: 'Artırım ve azaltım',
      paragraphs: [
        'Nafaka miktarı dondurulmuş bir rakam değildir. Tarafların ekonomik durumu esaslı biçimde değiştiğinde miktarın yeniden belirlenmesi istenebilir; bu, ayrı bir dava konusudur.',
        'Kararda gelecek yıllara ilişkin artış öngörülmüşse ayrıca dava açmaya gerek kalmaz. m.182 hâkime bu yetkiyi tanır ve uygulamada çoğu kararda enflasyona bağlı bir artış ölçütü belirlenir.',
        'Ödenmeyen nafaka için icra takibi yapılabilir. Nafaka alacağı, diğer alacaklardan farklı bir korumaya sahiptir ve ödenmemesi ayrıca yaptırıma bağlanmıştır.',
      ],
    },
  ],
  steps: [
    'Hangi nafakayı istediğinizi belirleyin: dava sürerken tedbir, boşanma sonrası yoksulluk, çocuk için iştirak.',
    'Boşanma davası açıldıysa tedbir nafakası için ayrıca talep şart değildir; hâkim resen karar verir.',
    'Yoksulluk nafakası için boşanma yüzünden yoksulluğa düşeceğinizi ve kusurunuzun daha ağır olmadığını ortaya koyun.',
    'Gelir ve gider belgelerinizi hazırlayın; miktar malî güç oranında belirlenir.',
    'İştirak nafakasında çocuğun eğitim, sağlık ve bakım giderlerini belgeleyin.',
    'Kararda gelecek yıllar için artış öngörülmesini talep edin — her yıl dava açmaktan kurtulursunuz.',
    'Ödeme yapılmazsa icra takibi başlatın.',
  ],
  checklist: [
    'Nüfus kayıt örneği',
    'Gelir belgesi ve banka hesap dökümü',
    'Kira, fatura, okul ve sağlık giderlerine ilişkin belgeler',
    'Çocuğun öğrenim durumunu gösteren belge',
    'Varsa mahkeme kararı ve icra dosyası bilgileri',
  ],
  faq: [
    {
      q: 'Kusurluysam nafaka alabilir miyim?',
      a: 'Yoksulluk nafakası için kusurunuzun daha ağır olmaması gerekir. Eşit kusur hâlinde talep mümkündür; daha ağır kusurlu olan taraf ise isteyemez.',
    },
    {
      q: 'Nafaka ödeyecek eşin kusurlu olması şart mı?',
      a: 'Hayır. TMK m.175 açıkça nafaka yükümlüsünün kusurunun aranmayacağını söyler.',
    },
    {
      q: 'Yoksulluk nafakası ömür boyu mu sürer?',
      a: 'Kanun süresiz demekle birlikte m.176 sona erme hâllerini düzenler: alacaklının yeniden evlenmesi veya taraflardan birinin ölümüyle kendiliğinden kalkar; fiilen evli gibi yaşama, yoksulluğun sona ermesi ya da haysiyetsiz hayat sürme hâllerinde mahkeme kararıyla kaldırılır.',
    },
    {
      q: 'Çocuk 18 yaşına girince nafaka biter mi?',
      a: 'Zorunlu olarak bitmez. TMK m.328 uyarınca çocuk ergin olduğu hâlde eğitimi sürüyorsa, ana ve baba kendilerinden beklenebilecek ölçüde eğitim sona erinceye kadar bakmakla yükümlüdür.',
    },
    {
      q: 'Tedbir nafakası için ayrıca talepte bulunmam gerekir mi?',
      a: 'Gerekmez. Boşanma veya ayrılık davası açılınca hâkim geçici önlemleri resen alır.',
    },
    {
      q: 'Nafaka toptan ödenebilir mi?',
      a: 'Maddî tazminat ve yoksulluk nafakası toptan veya irat biçiminde ödenebilir. Manevî tazminatın irat biçiminde ödenmesine ise karar verilemez.',
    },
    {
      q: 'Henüz boşanma davası açmadım, nafaka isteyebilir miyim?',
      a: 'TMK m.197 uyarınca ayrı yaşama haklı bir sebebe dayanıyorsa hâkim, eşlerden birinin istemi üzerine parasal katkıya ilişkin önlemleri alabilir.',
    },
  ],
  updated: '2026-08-16',
  sitemapPriority: 0.95,
};
