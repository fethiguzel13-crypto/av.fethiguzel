import type { VatandasArticle } from '../types';

/**
 * Kaynak doğrulaması — hepsi content-packs/tbk.json.gz resmî metninden:
 *   TBK m.344  artış tavanı: TÜFE oniki aylık ortalamalara göre değişim oranı
 *   TBK m.345  kira tespit davası her zaman açılabilir · otuz gün kuralı
 *   TBK m.346  kira ve yan gider dışında ödeme yükümlülüğü getirilemez
 *   TBK m.347  bir yıl uzama · on yıllık uzama süresi sonunda fesih
 *
 * Doğrulama: node scripts/madde.mjs tbk 344-347
 *
 * NOT: TÜFE oranı her ay değişir; metinde sayı verilmez, yöntem anlatılır.
 */
export const kiraArtisOrani: VatandasArticle = {
  slug: 'kira-artis-orani-nasil-hesaplanir',
  title: 'Kira Artış Oranı: TÜFE Tavanı ve Kira Tespit Davası',
  description:
    'Kira artışı en fazla ne kadar olabilir, TÜFE oniki aylık ortalama nasıl hesaplanır, tavan aşılırsa ne olur? TBK m.344-347 çerçevesinde kiracı ve kiraya veren için.',
  h1: 'Kira artış oranı nasıl hesaplanır?',
  keywords: [
    'kira artış oranı',
    'kira artışı tüfe',
    'kira zammı hesaplama',
    'kira tespit davası',
    'kira artışı yasal sınır',
  ],
  category: 'Kira',
  role: 'pillar',
  related: ['kiraci-nasil-tahliye-edilir'],
  links: [
    { label: 'TBK m.344 — Kira bedelinin belirlenmesi', href: '/mevzuat/tbk/madde-344' },
    { label: 'TBK m.345 — Dava açma süresi', href: '/mevzuat/tbk/madde-345' },
    { label: 'TBK m.346 — Yasak ödemeler', href: '/mevzuat/tbk/madde-346' },
    { label: 'TBK m.347 — Sözleşmenin sona ermesi', href: '/mevzuat/tbk/madde-347' },
    { label: 'Kira artışı hesaplama aracı', href: '/hesaplama/kira' },
  ],
  lead:
    'Yenilenen kira dönemlerinde uygulanacak artış, bir önceki kira yılındaki tüketici fiyat endeksinin oniki aylık ortalamalara göre değişim oranını geçemez. Taraflar bunun üzerinde anlaşsa bile fazlası geçersizdir.',
  keyInsight:
    'Tavan bir üst sınırdır, otomatik hak değildir: Sözleşmede artış kararlaştırılmamışsa kiraya veren kendiliğinden zam yapamaz, kira tespit davası açması gerekir.',
  sections: [
    {
      heading: 'Yasal tavan neye göre belirlenir?',
      paragraphs: [
        'TBK m.344 ölçütü açıkça koyar: Tarafların yenilenen kira dönemlerinde uygulanacak kira bedeline ilişkin anlaşmaları, bir önceki kira yılında tüketici fiyat endeksindeki oniki aylık ortalamalara göre değişim oranını geçmemek koşuluyla geçerlidir. Aynı kural bir yıldan uzun süreli sözleşmelerde de uygulanır.',
        'Buradaki ölçüt, günlük konuşmada sanıldığı gibi yıllık enflasyon değildir. Aranan veri, tüketici fiyat endeksinin oniki aylık ortalamalara göre değişim oranıdır; bu iki rakam çoğu ay birbirinden belirgin biçimde ayrılır.',
        'Sözleşmede tavanın üzerinde bir oran yazması hükmü tümüyle geçersiz kılmaz. Anlaşma tavana kadar geçerli sayılır, aşan kısım uygulanmaz; kiracı fazladan ödediği tutarı geri isteyebilir.',
        'Ölçütün 2019 öncesindeki hâli üretici fiyat endeksiydi. 7161 sayılı Kanunun 56. maddesiyle ibare, tüketici fiyat endeksindeki oniki aylık ortalamalara göre değişim biçiminde değiştirilmiştir; eski tarihli sözleşmelerde bu geçişe dikkat edilmelidir.',
      ],
    },
    {
      heading: 'Hesap nasıl yapılır?',
      paragraphs: [
        'İşlem üç adımdan ibarettir. Önce kira yılının başlangıç ayı belirlenir, ardından o aya ait tüketici fiyat endeksi oniki aylık ortalama değişim oranı okunur, son olarak mevcut kira bu oranla çarpılır.',
        'Kira yılı, sözleşmenin başlangıç tarihine göre işler. Ocak ayında imzalanmış bir sözleşmede ölçüt Ocak verisidir; Temmuz ayında imzalanmışsa Temmuz verisi esas alınır. Yanlış ayın verisini kullanmak, uygulamada en sık görülen hesap hatasıdır.',
        'Sonucu doğrulamak isteyen kiracı ile kiraya veren aynı veriye baktığında aynı rakama ulaşır. Anlaşmazlık çoğu zaman oranın kendisinde değil, hangi ayın verisinin kullanılacağında çıkar.',
      ],
      bullets: [
        'Kira yılının başladığı ayı belirleyin',
        'O aya ait TÜFE oniki aylık ortalama değişim oranını alın',
        'Mevcut kirayı bu oranla artırın',
        'Sözleşmedeki oran daha düşükse sözleşmedeki geçerlidir',
      ],
    },
    {
      heading: 'Sözleşmede artış yazmıyorsa ne olur?',
      paragraphs: [
        'Taraflar artış konusunda bir anlaşma yapmamışsa kiraya veren tek taraflı olarak zam yapamaz. TBK m.344 bu ihtimalde kira bedelinin bir önceki kira yılının değerleri esas alınarak belirlenmesini öngörür ve nihai kararı hâkime bırakır.',
        'Bu yolun adı kira bedelinin tespiti davasıdır. m.345 davanın her zaman açılabileceğini söylemekle birlikte, kararın hangi dönemden itibaren bağlayıcı olacağını bir süre koşuluna bağlar.',
        'Buna göre dava, yeni dönemin başlangıcından en geç otuz gün önce açılmış ya da kiraya veren bu süre içinde kiracıya artırım yapılacağını yazılı olarak bildirmişse, izleyen yeni kira dönemi sonuna kadar açılan davada belirlenecek bedel yeni dönemin başından itibaren kiracıyı bağlar.',
        'Sözleşmede yeni dönemde artış yapılacağına dair bir hüküm bulunuyorsa ayrıca bildirim şartı aranmaz; yeni kira döneminin sonuna kadar açılacak davada belirlenen bedel de dönemin başından geçerli olur.',
      ],
    },
    {
      heading: 'Kiraya veren neleri isteyemez?',
      paragraphs: [
        'TBK m.346 kiracıyı ek yüklerden korur: Kiracıya, kira bedeli ve yan giderler dışında başka bir ödeme yükümlülüğü getirilemez.',
        'Madde iki uygulamayı özellikle sayarak geçersiz kılar. Kira bedelinin zamanında ödenmemesi hâlinde ceza koşulu ödeneceğine ilişkin anlaşmalar ile sonraki kira bedellerinin muaccel olacağına dair anlaşmalar geçerli değildir.',
        'Sözleşmeye bu tür maddeler konulmuş olması onları yürürlüğe sokmaz. Kiracı, imzalamış olsa dahi bu hükümlere dayanılarak talep edilen tutarları ödemek zorunda değildir.',
      ],
    },
    {
      heading: 'On yıllık uzama ve sözleşmenin sonu',
      paragraphs: [
        'Kira ilişkisinin süresi konusunda yaygın bir yanlış bilgi dolaşır. TBK m.347 uyarınca konut ve çatılı işyeri kiralarında kiracı, belirli süreli sözleşmenin bitiminden en az on beş gün önce bildirimde bulunmadıkça sözleşme aynı koşullarla bir yıl için uzatılmış sayılır.',
        'Kiraya veren ise sözleşme süresinin bitimine dayanarak sözleşmeyi sona erdiremez. Ancak on yıllık uzama süresi sonunda, bu süreyi izleyen her uzama yılının bitiminden en az üç ay önce bildirimde bulunmak koşuluyla, herhangi bir sebep göstermeksizin sözleşmeye son verebilir.',
        'Belirsiz süreli sözleşmelerde denge farklıdır: Kiracı her zaman, kiraya veren ise kiranın başlangıcından on yıl geçtikten sonra genel hükümlere göre fesih bildirimiyle sözleşmeyi sona erdirebilir.',
      ],
    },
  ],
  steps: [
    'Sözleşmenizin başlangıç tarihini ve kira yılının hangi ayda döndüğünü belirleyin.',
    'İlgili aya ait TÜFE oniki aylık ortalama değişim oranını alın.',
    'Mevcut kirayı bu oranla artırarak yasal tavanı bulun.',
    'Sözleşmedeki oranla karşılaştırın; hangisi düşükse o uygulanır.',
    'Talep edilen artış tavanı aşıyorsa yazılı olarak itiraz edin ve tavana kadar olan kısmı ödeyin.',
    'Sözleşmede artış hükmü yoksa ve anlaşma sağlanamıyorsa kira tespit davası gündeme gelir; otuz günlük bildirim kuralına dikkat edin.',
  ],
  checklist: [
    'Kira sözleşmesinin aslı veya örneği',
    'Kira yılının başlangıç tarihi',
    'İlgili aya ait TÜFE verisi',
    'Son bir yılın ödeme dekontları',
    'Varsa artış bildirimi ve yazışmalar',
  ],
  faq: [
    {
      q: 'Kira artışı en fazla ne kadar olabilir?',
      a: 'Bir önceki kira yılındaki tüketici fiyat endeksinin oniki aylık ortalamalara göre değişim oranını geçemez. TBK m.344 bu sınırı hem bir yıllık hem daha uzun süreli sözleşmeler için koyar.',
    },
    {
      q: 'Sözleşmede daha yüksek oran yazıyor, geçerli mi?',
      a: 'Tavanı aşan kısım geçerli değildir. Anlaşma tavana kadar uygulanır; fazladan ödenen tutar geri istenebilir.',
    },
    {
      q: 'Yıllık enflasyon ile aynı şey mi?',
      a: 'Hayır. Ölçüt, oniki aylık ortalamalara göre değişim oranıdır; yıllık enflasyon rakamından farklıdır ve çoğu ay daha düşük çıkar.',
    },
    {
      q: 'Sözleşmede artış maddesi yok, kiraya veren zam yapabilir mi?',
      a: 'Tek taraflı yapamaz. Anlaşma sağlanamazsa kira bedelinin tespiti davası açılması gerekir; TBK m.345 kararın hangi dönemden itibaren bağlayacağını süre koşuluna bağlar.',
    },
    {
      q: 'Kirayı geç ödersem cezai şart öder miyim?',
      a: 'TBK m.346 uyarınca kira bedelinin geç ödenmesi hâlinde ceza koşulu ödeneceğine ilişkin anlaşmalar geçersizdir. Sözleşmede yazması sonucu değiştirmez.',
    },
    {
      q: 'Kiraya veren süre bitti diye çıkarabilir mi?',
      a: 'Hayır. Kiraya veren sözleşme süresinin bitimine dayanarak sözleşmeyi sona erdiremez. On yıllık uzama süresi dolduktan sonra, her uzama yılının bitiminden en az üç ay önce bildirimde bulunarak sebep göstermeksizin sona erdirebilir.',
    },
  ],
  updated: '2026-08-15',
  sitemapPriority: 0.95,
};
