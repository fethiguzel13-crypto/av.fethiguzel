import type { VatandasArticle } from '../types';

/**
 * Kaynak doğrulaması — content-packs/hmk.json.gz resmî metninden:
 *   HMK m.119  dava dilekçesinin zorunlu unsurları (a-h bentleri)
 *              · eksiklikte bir haftalık kesin süre · (a,d,e,f,g) bentleri
 *                dışındaki eksiklikler tamamlanmazsa dava açılmamış sayılır
 *   HMK m.120  harç ve gider avansının dava açarken yatırılması
 *              · yetersizlikte iki haftalık kesin süre
 *
 * Doğrulama: node scripts/madde.mjs hmk 119 · 120
 *
 * NOT: Görev ve yetki kuralları (HMK m.2 vd., m.5 vd.) ile dava şartları
 * (m.114) bu metne HENÜZ alınmadı; maddeler okunup doğrulanınca eklenecek.
 * Gider avansı tutarı her yıl tarifeyle belirlendiğinden SAYI VERİLMEZ.
 */
export const davaNasilAcilir: VatandasArticle = {
  slug: 'dava-nasil-acilir',
  title: 'Dava Nasıl Açılır? Dilekçenin Zorunlu Unsurları ve Avans',
  description:
    'Dava dilekçesinde neler bulunmak zorunda, eksik olursa ne olur, harç ve gider avansı ne zaman yatırılır? HMK m.119 ve m.120 çerçevesinde.',
  h1: 'Dava nasıl açılır?',
  keywords: [
    'dava nasıl açılır',
    'dava dilekçesi',
    'dava dilekçesinde bulunması gerekenler',
    'gider avansı',
    'dava açılmamış sayılması',
    'yargılama harcı',
  ],
  category: 'Usul',
  role: 'pillar',
  related: ['arabuluculuk-nasil-isler', 'usulsuz-tebligat-ve-itiraz'],
  links: [
    { label: 'HMK m.119 — Dava dilekçesinin içeriği', href: '/mevzuat/hmk/madde-119' },
    { label: 'HMK m.120 — Harç ve avans ödenmesi', href: '/mevzuat/hmk/madde-120' },
    { label: 'Dava harcı hesaplama aracı', href: '/hesaplama/dava-harci' },
  ],
  lead:
    'Dava dilekçesinde kanunun saydığı sekiz unsur bulunmak zorundadır. Bunlardan bir kısmının eksikliği bir haftalık kesin süre içinde tamamlanmazsa dava açılmamış sayılır; harç ve gider avansı ise dava açarken yatırılır.',
  keyInsight:
    'Eksiklikler eşit ağırlıkta değil: Mahkemenin adı, dava konusu ve değeri, vakıalar, deliller ve hukuki sebepler tamamlanabilir eksiklik listesinin DIŞINDA tutulmuştur.',
  sections: [
    {
      heading: 'Dilekçede ne bulunmak zorunda?',
      paragraphs: [
        'HMK m.119 zorunlu unsurları tek tek sayar ve bunlar tercihe bırakılmış değildir.',
        'Kimlik ve muhatap bilgileri ilk sırada gelir: Mahkemenin adı; davacı ile davalının adı, soyadı ve adresleri; davacının Türkiye Cumhuriyeti kimlik numarası; varsa tarafların kanuni temsilcilerinin ve davacı vekilinin adı, soyadı ve adresleri.',
        'Ardından davanın çerçevesi çizilir: Davanın konusu ve malvarlığı haklarına ilişkin davalarda dava konusunun değeri.',
        'Asıl yükü taşıyan üç bent bunlardan sonra gelir. Davacının iddiasının dayanağı olan bütün vakıaların sıra numarası altında açık özetleri; iddia edilen her bir vakıanın hangi delillerle ispat edileceği; dayanılan hukuki sebepler.',
        'Dilekçe, açık bir şekilde talep sonucu ve davacının, varsa kanuni temsilcisinin veya vekilinin imzasıyla tamamlanır.',
      ],
      bullets: [
        'a) Mahkemenin adı',
        'b) Tarafların adı, soyadı ve adresleri',
        'c) Davacının T.C. kimlik numarası',
        'ç) Kanuni temsilci ve vekil bilgileri',
        'd) Davanın konusu ve malvarlığı davalarında değeri',
        'e) Vakıaların sıra numarası altında açık özetleri',
        'f) Her vakıanın hangi delille ispat edileceği',
        'g) Dayanılan hukuki sebepler',
        'ğ) Açık talep sonucu',
        'h) İmza',
      ],
    },
    {
      heading: 'Eksiklik varsa ne olur?',
      paragraphs: [
        'Kanun eksiklikleri ikiye ayırır ve bu ayrım davanın kaderini belirler.',
        'Tamamlanabilir olanlar için hâkim süre verir: Birinci fıkranın (a), (d), (e), (f) ve (g) bentleri dışında kalan hususların eksik olması hâlinde, hâkim davacıya eksikliği tamamlaması için bir haftalık kesin süre verir.',
        'Süre içinde tamamlanmazsa sonuç ağırdır: Dava açılmamış sayılır. Bu, dosyanın hiç açılmamış gibi kabul edilmesi demektir ve zamanaşımı bakımından ciddi sonuç doğurur.',
        'Listenin dışında bırakılan bentler ise dilekçenin özünü oluşturur: mahkemenin adı, dava konusu ve değeri, vakıalar, deliller ve hukuki sebepler. Bunların eksikliği için tamamlama süresi öngörülmemiştir.',
        'Pratik anlamı şudur: Kimlik numarasını yazmayı unutmak düzeltilebilir bir eksikliktir; vakıaları ve delilleri göstermemek düzeltilebilir bir eksiklik değildir.',
      ],
    },
    {
      heading: 'Vakıa, delil ve hukuki sebep',
      paragraphs: [
        'Kanunun istediği anlatım biçimi belirlidir. Vakıalar sıra numarası altında ve açık özetler hâlinde yazılır; serbest anlatım yerine numaralandırılmış bir olay dizisi beklenir.',
        'Her vakıanın karşısına delili yazılmalıdır. Kanun bunu ayrı bir bent olarak arar: İddia edilen her bir vakıanın hangi delillerle ispat edileceği. Toplu bir delil listesi bu şartı tam olarak karşılamaz.',
        'Hukuki sebepler ise iddiayı hangi kurala dayandırdığınızı gösterir. Nitelendirmede hâkim bağlı değildir; yine de dayanağın gösterilmesi zorunludur.',
        'Bu yapı bir işe daha yarar: Vakıa–delil eşlemesi yapılırken hangi iddianın delilsiz kaldığı görülür. Dilekçeyi yazarken fark edilen boşluk, duruşmada fark edilenden çok daha ucuza kapanır.',
      ],
    },
    {
      heading: 'Harç ve gider avansı',
      paragraphs: [
        'Dava açmak bir ödeme yükümlülüğü de doğurur. HMK m.120 uyarınca davacı, yargılama harçları ile her yıl Adalet Bakanlığınca çıkarılacak gider avansı tarifesinde belirlenecek tutarı, dava açarken mahkeme veznesine yatırmak zorundadır.',
        'Tarife her yıl yenilendiğinden burada rakam vermek doğru olmaz; dava açmadan önce ilgili yılın tarifesine bakılmalıdır.',
        'Avans yargılama sırasında yetersiz kalabilir. Bu ihtimalde mahkemece eksikliğin tamamlanması için davacıya iki haftalık kesin süre verilir.',
        'Kesin süre ifadesi hafife alınmamalıdır. Süre içinde tamamlanmayan avans, davanın işlemden kaldırılmasına kadar giden sonuçlar doğurabilir.',
      ],
    },
    {
      heading: 'Dava açmadan önce',
      paragraphs: [
        'Bazı uyuşmazlıklarda doğrudan dava açılamaz. İş uyuşmazlıkları ve ticari davalar gibi alanlarda arabuluculuk dava şartıdır; bu aşama tamamlanmadan açılan dava usulden reddedilir.',
        'Görevli ve yetkili mahkemenin belirlenmesi de dilekçe yazılmadan önceki iştir. Yanlış mahkemede açılan dava görevsizlik ya da yetkisizlik kararıyla sonuçlanır ve zaman kaybettirir.',
        'Zamanaşımı ve hak düşürücü süreler ayrıca kontrol edilmelidir. Dava açılmamış sayılma hâlinde, sürenin korunmadığı unutulmamalıdır.',
      ],
    },
  ],
  steps: [
    'Uyuşmazlığınızın arabuluculuk dava şartı kapsamında olup olmadığını kontrol edin.',
    'Görevli ve yetkili mahkemeyi belirleyin.',
    'Vakıaları sıra numarası altında, açık özetler hâlinde yazın.',
    'Her vakıanın karşısına onu ispatlayacak delili yazın.',
    'Dayandığınız hukuki sebepleri gösterin.',
    'Talep sonucunu açık ve tereddütsüz biçimde yazın.',
    'Kimlik numarası, adresler ve imza gibi unsurları eksiksiz doldurun.',
    'İlgili yılın tarifesine göre harç ve gider avansını dava açarken yatırın.',
  ],
  checklist: [
    'Kimlik ve adres bilgileri',
    'Varsa vekâletname',
    'Vakıa–delil eşlemesi listesi',
    'Belge delilleri — sözleşme, fatura, yazışma',
    'Tanık ad ve adresleri',
    'Arabuluculuk son tutanağı — dava şartıysa',
    'Harç ve gider avansı ödemesi',
  ],
  faq: [
    {
      q: 'Dava dilekçesinde neler bulunmak zorunda?',
      a: 'Mahkemenin adı, tarafların bilgileri, davacının kimlik numarası, temsilci ve vekil bilgileri, davanın konusu ve değeri, vakıaların sıra numaralı özetleri, her vakıanın delili, hukuki sebepler, açık talep sonucu ve imza.',
    },
    {
      q: 'Bir unsuru unutursam dava reddedilir mi?',
      a: '(a), (d), (e), (f) ve (g) bentleri dışındaki eksiklikler için hâkim bir haftalık kesin süre verir. Bu süre içinde tamamlanmazsa dava açılmamış sayılır.',
    },
    {
      q: 'Hangi eksiklikler için süre verilmez?',
      a: 'Mahkemenin adı, dava konusu ve değeri, vakıalar, deliller ve hukuki sebepler tamamlama listesinin dışında tutulmuştur.',
    },
    {
      q: 'Delilleri sonradan bildirebilir miyim?',
      a: 'Kanun, iddia edilen her bir vakıanın hangi delillerle ispat edileceğinin dilekçede gösterilmesini arar. Sonradan delil bildirme imkânı usul kurallarına tabidir ve sınırlıdır.',
    },
    {
      q: 'Gider avansı ne zaman yatırılır?',
      a: 'Dava açarken. Davacı, yargılama harçları ile o yılın gider avansı tarifesindeki tutarı mahkeme veznesine yatırmak zorundadır.',
    },
    {
      q: 'Avans yetmezse ne olur?',
      a: 'Mahkeme, eksikliğin tamamlanması için davacıya iki haftalık kesin süre verir.',
    },
    {
      q: 'Dava açılmamış sayılırsa zamanaşımı korunur mu?',
      a: 'Dava açılmamış sayılma, dosyanın hiç açılmamış gibi kabul edilmesi anlamına gelir. Bu nedenle süre bakımından ciddi risk doğurur; eksikliğin verilen kesin süre içinde tamamlanması esastır.',
    },
  ],
  updated: '2026-08-16',
  sitemapPriority: 0.94,
};
