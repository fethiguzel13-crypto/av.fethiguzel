import type { VatandasArticle } from '../types';

/**
 * Kaynak doğrulaması — content-packs/vuk.json.gz resmî metninden:
 *   VUK m.376  cezada indirim · otuz gün içinde başvuru · cezanın yarısı
 *              · teminat gösterip vadeden itibaren üç ay · dava açılırsa
 *                indirimden yararlanılamaması (7194 s.K. ile değişik)
 *              · 2. bendin 7524 s.K. ile mülga olması
 *   VUK m.377  vergi mahkemesinde dava açma hakkı
 *
 * Doğrulama: node scripts/madde.mjs vuk 376 · 377
 *
 * NOT: Dava açma süresi (2577 s. İYUK m.7 — otuz gün) ve uzlaşma hükümleri
 * (VUK Ek m.1 vd.) bu metne HENÜZ alınmadı; İYUK külliyatta yok, uzlaşma
 * maddeleri okunup doğrulanınca eklenecek. Metin bu yüzden dava süresi için
 * sayı vermez.
 */
export const vergiCezasiItiraz: VatandasArticle = {
  slug: 'vergi-cezasina-itiraz',
  title: 'Vergi Cezası: İndirim, Dava ve Otuz Günlük Süre',
  description:
    'Vergi ceza ihbarnamesi geldi ne yapmalı, cezada indirim nasıl alınır, dava açarsam indirim hakkım gider mi? VUK m.376 ve m.377 çerçevesinde.',
  h1: 'Vergi cezasına nasıl itiraz edilir?',
  keywords: [
    'vergi cezası',
    'vergi ceza ihbarnamesi',
    'cezada indirim',
    'vergi ziyaı cezası',
    'usulsüzlük cezası',
    'vergi mahkemesi',
  ],
  category: 'Vergi',
  role: 'pillar',
  related: ['zamanasimi-sureleri'],
  links: [
    { label: 'VUK m.376 — Cezalarda indirim', href: '/mevzuat/vuk/madde-376' },
    { label: 'VUK m.377 — Dava açma hakkı', href: '/mevzuat/vuk/madde-377' },
    { label: 'Gecikme zammı hesaplama aracı', href: '/hesaplama/gecikme-zammi' },
  ],
  lead:
    'İhbarnamenin tebliğinden itibaren otuz gün içinde vergi dairesine başvurup ödeme taahhüdünde bulunan mükellef, kesilen cezanın yarısı kadar indirimden yararlanır. Aynı süre içinde dava açma yolu da açıktır.',
  keyInsight:
    'İki yol birbirini dışlar: İndirimden yararlanmak için verilen taahhüde rağmen dava açılırsa, madde hükmünden faydalanılamaz.',
  sections: [
    {
      heading: 'İhbarname geldiğinde ne oluyor?',
      paragraphs: [
        'Vergi ceza ihbarnamesi, hem tarh edilen vergiyi hem kesilen cezayı bildirir. Tebliğ tarihi bu belgenin en kritik bilgisidir; hem indirim hem dava süreleri o tarihten işler.',
        'Mükellefin önünde kural olarak üç yol bulunur: ödeme, indirimden yararlanarak ödeme ve dava. Bu yollar aynı süre içinde değerlendirilmek zorundadır.',
        'İhbarnamenin dayanağını incelemeden karar vermek pahalıya mal olur. Tarhiyatın sebebi, hangi dönemi kapsadığı ve hangi ceza türünün kesildiği önce netleştirilmelidir.',
      ],
    },
    {
      heading: 'Cezada indirim: yarısı siliniyor',
      paragraphs: [
        'VUK m.376 bir teşvik mekanizması kurar. Mükellef veya vergi sorumlusu; ikmalen, resen veya idarece tarh edilen vergiyi veya vergi farkını ve vergi ziyaı, usulsüzlük ve özel usulsüzlük cezalarının yarısını, ihbarnamelerin tebliğ tarihinden itibaren otuz gün içinde ilgili vergi dairesine başvurarak vadesinde ödeyeceğini bildirirse kesilen cezanın yarısı indirilir.',
        'Ödeme zamanı bakımından ikinci bir seçenek daha vardır: 6183 sayılı Kanunda belirtilen türden teminat göstererek vadenin bitmesinden itibaren üç ay içinde ödeyeceğini bildirmek de aynı indirimi sağlar.',
        'Maddenin 2. bendi 2024 yılında 7524 sayılı Kanunla yürürlükten kaldırılmıştır; bugün geçerli olan indirim mekanizması yukarıdaki tek bentten ibarettir.',
        'İndirim yalnız vergi aslına bağlı cezalarla sınırlı değildir. Yukarıdaki hükümler vergi aslına tabi olmaksızın kesilen usulsüzlük cezaları hakkında da uygulanır.',
      ],
      bullets: [
        'Süre: ihbarnamenin tebliğinden itibaren otuz gün',
        'Başvuru yeri: ilgili vergi dairesi',
        'İndirim: kesilen cezanın yarısı',
        'Ödeme: vadesinde ya da teminatla vadeden itibaren üç ay içinde',
        'Kapsam: vergi ziyaı, usulsüzlük ve özel usulsüzlük cezaları',
      ],
    },
    {
      heading: 'İndirim hakkı ne zaman kaybedilir?',
      paragraphs: [
        'Kanun iki hâlde indirimi geri alır. Mükellef veya vergi sorumlusu, ödeyeceğini bildirdiği vergi ve vergi cezasını yazılı süre içinde ödemezse bu madde hükmünden faydalandırılmaz.',
        'İkinci hâl daha kritiktir: Ödeyeceğini bildirdiği hâlde dava konusu yaparsa yine indirimden yararlanamaz.',
        'Bu, iki yolun aynı anda denenemeyeceği anlamına gelir. Önce indirim taahhüdü verip sonra dava açmak, indirimi ortadan kaldırır ve mükellef tam ceza ile karşı karşıya kalır.',
        'Karar bu yüzden otuz gün içinde ve bilinçli verilmelidir: Tarhiyatın hukuka aykırılığı güçlü görünüyorsa dava, tartışmalı ama zayıfsa indirim yolu tercih edilir.',
      ],
    },
    {
      heading: 'Dava yolu',
      paragraphs: [
        'VUK m.377 dava hakkını açıkça tanır: Mükellefler ve kendilerine vergi cezası kesilenler, tarh edilen vergilere ve kesilen cezalara karşı vergi mahkemesinde dava açabilirler.',
        'Karşı yönde bir yetki de vardır. Vergi dairesi, tadilat ve takdir komisyonlarınca tahmin ve takdir olunan matrahlara karşı vergi mahkemesinde dava açabilir.',
        'Dava açma süresi ve usulü idari yargılama mevzuatında düzenlenir; ihbarnamede bu süre ayrıca belirtilir. Süre kaçırıldığında tarhiyat kesinleşir ve tahsil aşamasına geçilir.',
        'Dava açılması tahsili kural olarak durdurur; ne var ki bu, borcun ortadan kalkması demek değildir. Dava kaybedilirse gecikme faiziyle birlikte ödeme gündeme gelir.',
      ],
    },
    {
      heading: 'Hangi yolu seçmeli?',
      paragraphs: [
        'Karar üç soruya bakılarak verilir: Tarhiyatın hukuki dayanağı ne kadar sağlam, ceza tutarı ne kadar büyük ve mükellefin ödeme gücü nedir.',
        'Dayanak zayıfsa, örneğin usule aykırı bir inceleme ya da hatalı matrah söz konusuysa dava yolu değerlidir. Bu değerlendirme, ihbarname ekindeki inceleme raporu okunmadan yapılamaz.',
        'Dayanak güçlü ve tartışma dar ise indirim yolu çoğu zaman daha akılcıdır; cezanın yarısı silinir ve süreç kısa sürede kapanır.',
        'Uzlaşma da ayrı bir yoldur ve kendi şartları ile süreleri vardır. Uzlaşma talebinin indirim ve dava yollarıyla ilişkisi somut duruma göre değerlendirilmelidir.',
      ],
    },
    {
      heading: 'Sık yapılan hatalar',
      paragraphs: [
        'Birinci hata, otuz günlük süreyi ödeme vadesi sanmaktır. Süre başvuru ve tercih içindir; kaçırıldığında hem indirim hem dava hakkı bakımından sorun doğar.',
        'İkincisi, indirim taahhüdünden sonra dava açmaktır. Kanun bu ihtimalde indirimi tümüyle ortadan kaldırır.',
        'Üçüncüsü, inceleme raporunu istemeden karar vermektir. Tarhiyatın gerekçesini görmeden yapılan tercih, çoğu zaman yanlış tarafa düşer.',
      ],
    },
  ],
  steps: [
    'İhbarnamenin tebliğ tarihini belirleyin; bütün süreler oradan işler.',
    'İhbarnamenin dayanağını ve varsa inceleme raporunu isteyin.',
    'Tarhiyatın hukuki dayanağını değerlendirin.',
    'İndirim yolunu seçerseniz otuz gün içinde vergi dairesine başvurup ödeme taahhüdünde bulunun.',
    'Vadesinde ödeyin ya da teminat göstererek vadeden itibaren üç ay içinde ödeyin.',
    'Dava yolunu seçerseniz indirim taahhüdü vermeyin — ikisi bir arada yürümez.',
    'Dava süresini ihbarnameden kontrol edin ve süresinde vergi mahkemesine başvurun.',
  ],
  checklist: [
    'Vergi ceza ihbarnamesi ve tebliğ belgesi',
    'Vergi inceleme raporu veya takdir komisyonu kararı',
    'İlgili döneme ait defter ve belgeler',
    'Beyanname ve ödeme kayıtları',
    'Teminat gösterilecekse teminat belgesi',
  ],
  faq: [
    {
      q: 'Vergi cezasında indirim ne kadar?',
      a: 'Kesilen cezanın yarısı. İhbarnamenin tebliğinden itibaren otuz gün içinde vergi dairesine başvurup ödeme taahhüdünde bulunmak gerekir.',
    },
    {
      q: 'İndirim için ne kadar sürem var?',
      a: 'Otuz gün. Süre ihbarnamelerin tebliğ tarihinden işler.',
    },
    {
      q: 'Hemen ödeyemiyorum, indirimden yararlanabilir miyim?',
      a: 'Evet. 6183 sayılı Kanunda belirtilen türden teminat göstererek vadenin bitmesinden itibaren üç ay içinde ödeyeceğinizi bildirirseniz indirim uygulanır.',
    },
    {
      q: 'Hem indirim alıp hem dava açabilir miyim?',
      a: 'Hayır. Ödeyeceğini bildirdiği hâlde dava konusu yapan mükellef, bu madde hükmünden faydalandırılmaz.',
    },
    {
      q: 'Usulsüzlük cezasında da indirim var mı?',
      a: 'Evet. Hükümler, vergi aslına tabi olmaksızın kesilen usulsüzlük cezaları hakkında da uygulanır.',
    },
    {
      q: 'Davayı hangi mahkemede açarım?',
      a: 'Vergi mahkemesinde. VUK m.377, mükellefler ve kendilerine ceza kesilenlere bu hakkı tanır.',
    },
    {
      q: 'Taahhüt verdim ama ödeyemedim, ne olur?',
      a: 'Ödeyeceğini bildirdiği tutarı süresinde ödemeyen mükellef indirim hükmünden faydalandırılmaz.',
    },
  ],
  updated: '2026-08-16',
  sitemapPriority: 0.9,
};
