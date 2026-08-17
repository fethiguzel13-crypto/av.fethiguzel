import type { VatandasArticle } from '../types';

/**
 * Kaynak doğrulaması — hepsi content-packs/tmk.json.gz resmî metninden:
 *   TMK m.166  evlilik birliğinin temelinden sarsılması · davacının daha ağır
 *              kusuru ve itiraz hakkı · anlaşmalı boşanmada bir yıllık evlilik
 *              ve hâkimin bizzat dinlemesi · red kararından bir yıl sonra
 *              (7532 s.K. ile değişik dördüncü fıkra)
 *   TMK m.169  geçici önlemler — resen
 *   TMK m.184  boşanmada yargılama usulü · hâkimin vicdanî kanaati
 *
 * Doğrulama: node scripts/madde.mjs tmk 166 --tam · 169 · 184
 *
 * NOT: Yetkili ve görevli mahkemeye ilişkin ayrıntı (TMK m.168) bu metne
 * HENÜZ alınmadı; madde okunup doğrulanınca eklenecek.
 */
export const bosanmaDavasi: VatandasArticle = {
  slug: 'bosanma-davasi-nasil-acilir',
  title: 'Boşanma Davası: Anlaşmalı ve Çekişmeli Yol Arasındaki Fark',
  description:
    'Anlaşmalı boşanmanın şartları nelerdir, çekişmeli boşanmada neye dayanılır, kusur nasıl değerlendirilir? TMK m.166, 169 ve 184 çerçevesinde.',
  h1: 'Boşanma davası nasıl açılır?',
  keywords: [
    'boşanma davası',
    'anlaşmalı boşanma',
    'çekişmeli boşanma',
    'evlilik birliğinin sarsılması',
    'boşanmada kusur',
    'boşanma protokolü',
  ],
  category: 'Aile',
  role: 'pillar',
  related: ['nafaka-turleri-ve-sartlari', 'mal-rejimi-tasfiyesi'],
  links: [
    { label: 'TMK m.166 — Evlilik birliğinin sarsılması', href: '/mevzuat/tmk/madde-166' },
    { label: 'TMK m.169 — Geçici önlemler', href: '/mevzuat/tmk/madde-169' },
    { label: 'TMK m.184 — Yargılama usulü', href: '/mevzuat/tmk/madde-184' },
    { label: 'Nafaka hesaplama aracı', href: '/hesaplama/nafaka' },
    { label: 'Mal rejimi hesaplama aracı', href: '/hesaplama/mal-rejimi' },
  ],
  lead:
    'Evlilik birliği, ortak hayatı sürdürmeleri kendilerinden beklenmeyecek derecede temelinden sarsılmışsa eşlerden her biri boşanma davası açabilir. Evlilik en az bir yıl sürmüşse ve taraflar birlikte başvurmuşsa birlik temelinden sarsılmış sayılır.',
  keyInsight:
    'Anlaşmalı boşanmada hâkim protokolü aynen onaylamak zorunda değildir: Tarafların ve çocukların menfaatini gözeterek gerekli gördüğü değişiklikleri yapabilir.',
  sections: [
    {
      heading: 'Genel boşanma sebebi: birliğin temelinden sarsılması',
      paragraphs: [
        'Uygulamadaki boşanmaların büyük kısmı tek bir maddeye dayanır. TMK m.166 uyarınca evlilik birliği, ortak hayatı sürdürmeleri kendilerinden beklenmeyecek derecede temelinden sarsılmış olursa eşlerden her biri boşanma davası açabilir.',
        'Ölçüt sübjektiftir ve somut olaya göre değerlendirilir. Kanun belirli davranışları saymak yerine sonucu tarif eder: Ortak hayatın sürdürülmesinin beklenemez hâle gelmesi.',
        'Kusur bu sebepte tümüyle devre dışı kalmaz. Davacının kusuru daha ağırsa davalının açılan davaya itiraz hakkı vardır; ne var ki bu itiraz hakkın kötüye kullanılması niteliğindeyse ve evlilik birliğinin devamında davalı ve çocuklar bakımından korunmaya değer bir yarar kalmamışsa yine de boşanmaya karar verilebilir.',
      ],
    },
    {
      heading: 'Anlaşmalı boşanmanın üç şartı',
      paragraphs: [
        'Anlaşmalı boşanma ayrı bir sebep değil, aynı maddenin özel bir uygulanış biçimidir. Evlilik en az bir yıl sürmüşse, eşlerin birlikte başvurması ya da bir eşin diğerinin davasını kabul etmesi hâlinde evlilik birliği temelinden sarsılmış sayılır.',
        'Birinci şart süredir: Evliliğin en az bir yıl sürmüş olması gerekir. Bir yıldan kısa evliliklerde anlaşmalı yol kapalıdır ve çekişmeli dava açılması gerekir.',
        'İkinci şart hâkimin bizzat dinlemesidir. Boşanma kararı verilebilmesi için hâkimin tarafları bizzat dinleyerek iradelerinin serbestçe açıklandığına kanaat getirmesi şarttır; duruşmaya katılmamak ya da yalnız vekille temsil edilmek bu şartı karşılamaz.',
        'Üçüncü şart protokolün uygun bulunmasıdır. Hâkimin, boşanmanın malî sonuçları ile çocukların durumu hususunda taraflarca kabul edilecek düzenlemeyi uygun bulması gerekir.',
        'Hâkim protokolü olduğu gibi kabul etmek zorunda değildir: Tarafların ve çocukların menfaatlerini göz önünde tutarak bu anlaşmada gerekli gördüğü değişiklikleri yapabilir; bu değişikliklerin taraflarca da kabulü hâlinde boşanmaya hükmolunur.',
        'Anlaşmalı boşanmanın bir usul sonucu daha vardır: Bu hâlde tarafların ikrarlarının hâkimi bağlamayacağı hükmü uygulanmaz.',
      ],
      bullets: [
        'Evliliğin en az bir yıl sürmüş olması',
        'Tarafların birlikte başvurması veya birinin diğerinin davasını kabul etmesi',
        'Hâkimin tarafları bizzat dinlemesi',
        'Malî sonuçlar ve çocukların durumuna ilişkin düzenlemenin hâkimce uygun bulunması',
      ],
    },
    {
      heading: 'Fiilî ayrılık: bir yıl sonra yeniden dava',
      paragraphs: [
        'Reddedilen bir boşanma davası yolun sonu değildir. 7532 sayılı Kanunla değiştirilen dördüncü fıkra uyarınca, boşanma sebeplerinden herhangi biriyle açılmış bulunan davanın reddine karar verilmesi ve bu kararın kesinleştiği tarihten başlayarak bir yıl geçmesi hâlinde, her ne sebeple olursa olsun ortak hayat yeniden kurulamamışsa evlilik birliği temelden sarsılmış sayılır ve eşlerden birinin istemi üzerine boşanmaya karar verilir.',
        'Bu hüküm kusur tartışmasını arka plana iter. Ret kararının kesinleşmesinden itibaren bir yıl geçmiş ve ortak hayat kurulamamışsa, isteyen eşin talebi üzerine boşanmaya karar verilir.',
        'İki tarih kritiktir: Ret kararının kesinleşme tarihi ve o tarihten sonra bir yılın dolması. Kesinleşme şerhini almak, bu yolu kullanacak eş için ilk adımdır.',
      ],
    },
    {
      heading: 'Dava sürerken alınan önlemler',
      paragraphs: [
        'Boşanma davaları uzun sürebildiğinden kanun ara dönemi düzenler. TMK m.169 uyarınca boşanma veya ayrılık davası açılınca hâkim, davanın devamı süresince gerekli olan, özellikle eşlerin barınmasına, geçimine, eşlerin mallarının yönetimine ve çocukların bakım ve korunmasına ilişkin geçici önlemleri resen alır.',
        'Resen alınması, talep beklenmeksizin karar verileceği anlamına gelir. Buna karşılık ihtiyaçlarınızı ortaya koyan belgeleri dosyaya sunmak, önlemin isabetli belirlenmesini sağlar.',
        'Bu önlemler geçicidir ve kesin hükümle birlikte yerini nihai düzenlemeye bırakır.',
      ],
    },
    {
      heading: 'İspat ve hâkimin takdiri',
      paragraphs: [
        'Boşanma yargılamasında ispat rejimi genel hukuk yargılamasından ayrılır. TMK m.184 uyarınca hâkim, boşanma veya ayrılık davasının dayandığı olguların varlığına vicdanen kanaat getirmedikçe bunları ispatlanmış sayamaz.',
        'Bu kural tarafların anlaşmasıyla olgu yaratılmasını engeller. Karşı tarafın kabul etmesi tek başına yeterli değildir; hâkimin kendi vicdanî kanaati aranır.',
        'Pratik sonucu şudur: Tanık, yazışma, rapor ve benzeri deliller çekişmeli boşanmada belirleyicidir. Yalnız iddiaya dayanan bir dosya, karşı taraf sessiz kalsa dahi kolayca sonuç vermez.',
      ],
    },
    {
      heading: 'Hangi yolu seçmelisiniz?',
      paragraphs: [
        'Anlaşmalı boşanma hızlıdır ve çoğu zaman tek duruşmada sonuçlanır. Ne var ki protokolde eksik bırakılan bir konu sonradan ayrı bir dava doğurur; özellikle mal rejimi tasfiyesi ve nafaka artırımı bu bakımdan risklidir.',
        'Çekişmeli boşanma uzundur ama kusur tespiti gerektiren taleplerin, örneğin maddî ve manevî tazminatın, tartışılmasına imkân verir.',
        'Seçim çoğu zaman ekonomik sonuçlara göre yapılır. Protokolü imzalamadan önce mal rejimi tasfiyesinin ne getireceğini hesaplamak, sonradan telafisi güç kayıpları önler.',
      ],
    },
  ],
  steps: [
    'Hangi yolu izleyeceğinize karar verin: anlaşmalı mı, çekişmeli mi.',
    'Anlaşmalı yolda evliliğin en az bir yıl sürmüş olduğunu doğrulayın.',
    'Protokolü hazırlayın: velayet, kişisel ilişki, nafaka, tazminat ve mal rejimi tasfiyesi.',
    'Mal rejimi tasfiyesini protokole dâhil edin; dışarıda bırakılan konu ayrı dava doğurur.',
    'Dava dilekçenizi ve delillerinizi hazırlayın; çekişmeli davada ispat belirleyicidir.',
    'Duruşmaya bizzat katılın — anlaşmalı boşanmada hâkimin tarafları bizzat dinlemesi şarttır.',
    'Karar kesinleştikten sonra nüfusa tescil ve gerekiyorsa tapu işlemlerini tamamlayın.',
  ],
  checklist: [
    'Nüfus kayıt örneği ve evlenme cüzdanı',
    'Anlaşmalı boşanma protokolü — imzalı',
    'Gelir belgeleri ve banka dökümleri',
    'Tapu, araç ve banka kayıtları — mal rejimi için',
    'Delil listesi ve tanık bilgileri',
    'Varsa önceki dava dosyası ve kesinleşme şerhi',
  ],
  faq: [
    {
      q: 'Anlaşmalı boşanma için ne kadar evli olmak gerekir?',
      a: 'En az bir yıl. Evlilik bir yıl sürmüşse ve taraflar birlikte başvurmuşsa ya da biri diğerinin davasını kabul etmişse evlilik birliği temelinden sarsılmış sayılır.',
    },
    {
      q: 'Duruşmaya katılmak zorunda mıyım?',
      a: 'Anlaşmalı boşanmada evet. Hâkimin tarafları bizzat dinleyerek iradelerinin serbestçe açıklandığına kanaat getirmesi şarttır.',
    },
    {
      q: 'Hâkim protokolü değiştirebilir mi?',
      a: 'Evet. Tarafların ve çocukların menfaatlerini göz önünde tutarak gerekli gördüğü değişiklikleri yapabilir; değişiklikler taraflarca da kabul edilirse boşanmaya hükmolunur.',
    },
    {
      q: 'Daha çok kusurlu olan eş boşanma davası açabilir mi?',
      a: 'Açabilir. Ancak davacının kusuru daha ağırsa davalının itiraz hakkı vardır. Bu itiraz hakkın kötüye kullanılması niteliğindeyse ve evliliğin devamında korunmaya değer yarar kalmamışsa yine boşanmaya karar verilebilir.',
    },
    {
      q: 'Davam reddedildi, tekrar açabilir miyim?',
      a: 'Ret kararının kesinleştiği tarihten başlayarak bir yıl geçmiş ve ortak hayat yeniden kurulamamışsa, eşlerden birinin istemi üzerine boşanmaya karar verilir.',
    },
    {
      q: 'Dava sürerken nafaka alabilir miyim?',
      a: 'Evet. Hâkim, davanın devamı süresince barınma, geçim ve çocukların bakımına ilişkin geçici önlemleri resen alır.',
    },
    {
      q: 'Eşim kabul ederse boşanma kesinleşir mi?',
      a: 'Kabul tek başına yetmez. Hâkim, davanın dayandığı olguların varlığına vicdanen kanaat getirmedikçe bunları ispatlanmış sayamaz.',
    },
  ],
  updated: '2026-08-16',
  sitemapPriority: 0.96,
};
