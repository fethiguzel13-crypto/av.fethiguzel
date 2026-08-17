import type { VatandasArticle } from '../types';

/**
 * Kaynak doğrulaması — content-packs/arabuluculuk.json.gz resmî metninden:
 *   6325 m.18  anlaşma belgesi · icra edilebilirlik şerhi · şerhli anlaşmanın
 *              ilam niteliğinde belge sayılması · şerhin çekişmesiz yargı işi
 *              olması ve dosya üzerinden inceleme
 *
 * Ayrıca doğrulanan bağlantılı hükümler:
 *   4857 m.20  işe iadede bir ay + iki hafta (is-kanunu paketi)
 *
 * Doğrulama: node scripts/madde.mjs arabuluculuk 18
 *
 * NOT: Dava şartı arabuluculuğun kapsamı (6325 m.18/A ve ilgili özel kanun
 * hükümleri) bu metne HENÜZ tam alınmadı; maddeler okunup doğrulanınca
 * genişletilecek. Bu yüzden metin, kapsamın somut listesini vermek yerine
 * belirlenmiş uyuşmazlıklarda zorunlu olduğunu söyler.
 */
export const arabuluculuk: VatandasArticle = {
  slug: 'arabuluculuk-nasil-isler',
  title: 'Arabuluculuk: Anlaşma Belgesi ve İcra Edilebilirlik Şerhi',
  description:
    'Arabuluculukta anlaşma nasıl bağlayıcı olur, icra edilebilirlik şerhi nereden alınır, şerhli anlaşma ilam niteliğinde midir? 6325 sayılı Kanun m.18 çerçevesinde.',
  h1: 'Arabuluculuk nasıl işler?',
  keywords: [
    'arabuluculuk',
    'arabuluculuk anlaşma belgesi',
    'icra edilebilirlik şerhi',
    'dava şartı arabuluculuk',
    'arabulucu son tutanak',
  ],
  category: 'Usul',
  role: 'pillar',
  related: ['ise-iade-davasi-nasil-acilir', 'icra-takibi-nasil-baslatilir'],
  links: [
    { label: '6325 s.K. m.18 — Anlaşma ve icra edilebilirlik', href: '/mevzuat/arabuluculuk/madde-18' },
    { label: 'İş K. m.20 — İşe iadede arabuluculuk', href: '/mevzuat/is-kanunu/madde-20' },
    { label: 'Arabuluculuk ücreti hesaplama aracı', href: '/hesaplama/arabuluculuk' },
  ],
  lead:
    'Arabuluculuk sonunda varılan anlaşmanın kapsamı taraflarca belirlenir. Anlaşma belgesine icra edilebilirlik şerhi verildiğinde bu belge ilam niteliğinde belge sayılır ve doğrudan icraya konulabilir.',
  keyInsight:
    'Şerh alınmamış bir anlaşma belgesi de taraflar arasında sözleşme gibi bağlayıcıdır; ne var ki icraya koyabilmek için önce dava açmak gerekir.',
  sections: [
    {
      heading: 'Anlaşma belgesi nasıl düzenlenir?',
      paragraphs: [
        '6325 sayılı Kanun m.18 kapsamı taraflara bırakır: Arabuluculuk faaliyeti sonunda varılan anlaşmanın kapsamı taraflarca belirlenir; anlaşma belgesi düzenlenmesi hâlinde bu belge taraflar ve arabulucu tarafından imzalanır.',
        'Kapsamın taraflarca belirlenmesi, anlaşmanın uyuşmazlığın tamamını ya da bir kısmını kapsayabileceği anlamına gelir. Anlaşılan konular dışında kalan talepler için dava yolu açık kalır.',
        'Bu esneklik bir risk de barındırır. Belgede yer almayan bir alacak, sonradan feragat edilmiş sayılmasa bile ayrı bir uyuşmazlık olarak sürüncemede kalır; bu nedenle nelerin kapsam içinde, nelerin dışında olduğu belgede açıkça yazılmalıdır.',
      ],
    },
    {
      heading: 'İcra edilebilirlik şerhi',
      paragraphs: [
        'Anlaşma belgesinin doğrudan icraya konulabilmesi için bir adım daha gerekir. Taraflar arabuluculuk faaliyeti sonunda bir anlaşmaya varırlarsa, bu anlaşma belgesinin icra edilebilirliğine ilişkin şerh verilmesini talep edebilirler.',
        'Şerhin nereden isteneceği, arabuluculuğa ne zaman başvurulduğuna bağlıdır. Dava açılmadan önce arabuluculuğa başvurulmuşsa şerh, arabulucunun görev yaptığı yer sulh hukuk mahkemesinden talep edilir.',
        'Dava görülürken arabuluculuğa gidilmişse muhatap değişir: Anlaşmanın icra edilebilirliğine ilişkin şerh, davanın görüldüğü mahkemeden talep edilir.',
        'Şerhin sonucu belirleyicidir: Bu şerhi içeren anlaşma, ilam niteliğinde belge sayılır. Yani mahkeme kararı gibi doğrudan ilamlı icra yoluyla takibe konulabilir.',
      ],
    },
    {
      heading: 'Şerh nasıl verilir?',
      paragraphs: [
        'İnceleme dar ve hızlıdır. Kanun bunu açıkça düzenler: İcra edilebilirlik şerhinin verilmesi çekişmesiz yargı işidir ve buna ilişkin inceleme dosya üzerinden yapılır.',
        'Dosya üzerinden inceleme, duruşma açılmayacağı anlamına gelir. Bu, şerh alma sürecini birkaç güne indirir.',
        'Aile hukukuna ilişkin arabuluculuğa elverişli uyuşmazlıklarda ise Kanun ayrı bir usul öngörür; bu alanda inceleme farklı işler.',
      ],
    },
    {
      heading: 'Dava şartı arabuluculuk',
      paragraphs: [
        'Bazı uyuşmazlıklarda arabuluculuk bir tercih değil, dava açmanın ön koşuludur. İş uyuşmazlıkları bunun en bilinen örneğidir: 4857 m.20 uyarınca işe iade talebiyle önce arabulucuya başvurulması zorunludur.',
        'Bu tür uyuşmazlıklarda arabulucuya gidilmeden açılan dava usulden reddedilir. Süre kaybı ciddi olabildiğinden, dava dilekçesi hazırlanmadan önce uyuşmazlığın dava şartı kapsamında olup olmadığı belirlenmelidir.',
        'Sürelerin nasıl işleyeceği de özel olarak düzenlenir. İşe iadede fesih bildiriminin tebliğinden itibaren bir ay içinde arabulucuya başvurulur; anlaşma sağlanamazsa son tutanağın düzenlendiği tarihten itibaren iki hafta içinde dava açılır.',
        'Son tutanak bu nedenle sıradan bir evrak değildir. Tarihinin doğru yazılması, dava süresinin başlangıcını belirler.',
      ],
    },
    {
      heading: 'Anlaşamama hâli',
      paragraphs: [
        'Arabuluculuk anlaşmayla bitmek zorunda değildir. Taraflar uzlaşamazsa arabulucu son tutanağı düzenler ve süreç sona erer; bundan sonra dava yolu açılır.',
        'Anlaşmama, arabuluculuğun başarısızlığı değil sürecin doğal sonuçlarından biridir. Görüşmeler sırasında yapılan beyanlar ve sunulan belgeler, kural olarak sonraki yargılamada delil olarak kullanılamaz.',
        'Bu gizlilik, tarafların rahat konuşabilmesi içindir. Uzlaşma için yapılan bir teklifin sonradan aleyhe kullanılamayacağını bilmek, tarafları gerçekçi öneriler sunmaya iter.',
      ],
    },
    {
      heading: 'Anlaşırken nelere dikkat edilmeli?',
      paragraphs: [
        'Belgede yer alacak her kalem ayrı ayrı yazılmalıdır. İş uyuşmazlıklarında kıdem, ihbar, yıllık izin ve fazla mesai gibi alacakların hangisinin kapsamda olduğu belirtilmezse, sonradan tartışma çıkar.',
        'Ödeme takvimi ve ödememe hâlinde ne olacağı da belgeye girmelidir. Şerh alınmışsa gecikme hâlinde doğrudan icra takibi yapılabilir.',
        'Şerh almak için beklemek gerekmez. Anlaşma belgesi imzalandıktan sonra şerh talebi ayrı bir aşamadır ve ihmal edilirse anlaşmanın icra gücü zayıflar.',
      ],
    },
  ],
  steps: [
    'Uyuşmazlığınızın dava şartı arabuluculuk kapsamında olup olmadığını belirleyin.',
    'Kapsamdaysa süresi içinde arabulucuya başvurun — iş uyuşmazlıklarında süre kısadır.',
    'Görüşmelere hazırlıklı gidin: alacak kalemlerini ve tutarlarını önceden çıkarın.',
    'Anlaşma sağlanırsa hangi taleplerin kapsamda olduğunu belgede tek tek yazdırın.',
    'Ödeme takvimini ve gecikme hâlinde uygulanacak sonucu belgeye ekletin.',
    'Anlaşma belgesini taraflar ve arabulucu olarak imzalayın.',
    'İcra edilebilirlik şerhi için ilgili mahkemeye başvurun.',
    'Anlaşma olmazsa son tutanağın tarihini kontrol edin; dava süresi oradan işler.',
  ],
  checklist: [
    'Uyuşmazlığın konusunu gösteren belgeler',
    'Alacak kalemlerinin dökümü',
    'Kimlik ve varsa vekâletname',
    'Arabuluculuk anlaşma belgesi',
    'Son tutanak — anlaşılamadıysa',
    'İcra edilebilirlik şerhi talebi',
  ],
  faq: [
    {
      q: 'Arabuluculuk anlaşması bağlayıcı mı?',
      a: 'Anlaşma belgesi taraflar arasında bağlayıcıdır. İcra edilebilirlik şerhi verildiğinde ise ilam niteliğinde belge sayılır ve doğrudan icraya konulabilir.',
    },
    {
      q: 'İcra edilebilirlik şerhini nereden alırım?',
      a: 'Dava açılmadan önce arabuluculuğa başvurulmuşsa arabulucunun görev yaptığı yer sulh hukuk mahkemesinden; dava görülürken başvurulmuşsa davanın görüldüğü mahkemeden.',
    },
    {
      q: 'Şerh için duruşma olur mu?',
      a: 'Hayır. İcra edilebilirlik şerhinin verilmesi çekişmesiz yargı işidir ve inceleme dosya üzerinden yapılır.',
    },
    {
      q: 'Arabulucuya gitmeden dava açabilir miyim?',
      a: 'Dava şartı arabuluculuk kapsamındaki uyuşmazlıklarda açamazsınız; dava usulden reddedilir. İşe iade bunun tipik örneğidir.',
    },
    {
      q: 'Anlaşamazsak görüşmelerde söylediklerim aleyhime kullanılır mı?',
      a: 'Arabuluculukta gizlilik esastır; görüşmeler sırasındaki beyan ve belgeler kural olarak sonraki yargılamada delil olarak kullanılamaz.',
    },
    {
      q: 'Anlaşma bütün alacaklarımı kapsar mı?',
      a: 'Kapsamı taraflar belirler. Belgede yer almayan talepler için dava yolu açık kalır; bu nedenle kalemler tek tek yazılmalıdır.',
    },
  ],
  updated: '2026-08-16',
  sitemapPriority: 0.92,
};
