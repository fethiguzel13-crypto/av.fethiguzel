/**
 * Aile Hukuku — kanonik katman (G23). Dayanaklar 4721 sayılı Türk Medenî Kanunu metnine bağlıdır (`content/mevzuat/tmk`).
 * Olaylar kurmacadır; kişi, tarih ve tutar örnek içindir. Mal rejimi hesabı yalnız kanundaki oranla yapılmıştır.
 */
const katman = {
  ders: 'aile-hukuku',
  temsilci: { uni: 'ankara', ders: 'aile-hukuku-yillik' },
  guncelleme: '2026-10-14',
  ornekOlaylar: [
    {
      baslik: 'Düğünden iki hafta önce bozulan nişan ve geri istenen altın takı',
      olay:
        'Kerem ile Ayşe 2025 yazında nişanlanmıştır. Ayşe’nin ana ve babası düğün salonu için 150.000 TL kapora ödemiş, Kerem de ' +
        'nişanda Ayşe’ye 300.000 TL değerinde bir altın takı seti takmıştır. Kerem düğüne iki hafta kala hiçbir gerekçe göstermeden ' +
        'nişanı bozmuş, ardından takının geri verilmesini istemiştir. Ayşe ise kaporanın ödenmesini ve çevresinde uğradığı küçük ' +
        'düşürülme için para istemektedir.',
      cozum:
        'Nişanlılık evlenmeye zorlamak için dava hakkı vermediğinden Ayşe evlenmenin gerçekleşmesini isteyemez (Türk Medenî Kanunu ' +
        '(TMK) m.119). Kerem nişanı haklı bir sebep olmaksızın bozmuş olup evlenme amacıyla yapılan harcamalar karşılığında uygun bir ' +
        'tazminat vermekle yükümlüdür. Kaporayı ödeyen Ayşe değil ana ve babası olduğundan bu kalemi onlar, aynı koşullar altında ' +
        'kendi adlarına ister (TMK m.120/2). Ayşe’nin para istemi manevî tazminattır ve kişilik hakkının saldırıya uğradığının ' +
        'ispatına bağlıdır (TMK m.121). Kerem’in takıyı geri istemesi ise kusuruna bağlı değildir, zira nişanlılık evlenme dışındaki bir ' +
        'sebeple sona erdiğinde alışılmışın dışındaki hediyeler verenler tarafından geri istenebilir (TMK m.122). Bütün bu dava ' +
        'hakları nişanın bozulmasının üzerinden bir yıl geçmekle zamanaşımına uğrar (TMK m.123).',
      sonuc:
        'Nişanı bozanın kusuru tazminatı belirler, hediyenin geri istenmesini belirlemez; ana ve babanın harcaması onların kendi alacağıdır.',
      dayanaklar: [
        { kanun: 'tmk', madde: '119', ifade: 'Nişanlılık, evlenmeye zorlamak için dava hakkı vermez' },
        { kanun: 'tmk', madde: '120', ifade: 'aynı koşullar altında yaptıkları harcamalar için uygun bir tazminat isteyebilirler' },
        { kanun: 'tmk', madde: '121', ifade: 'kişilik hakkı saldırıya uğrayan taraf' },
        { kanun: 'tmk', madde: '122', ifade: 'alışılmışın dışındaki hediyeler, verenler tarafından geri istenebilir' },
        { kanun: 'tmk', madde: '123', ifade: 'sona ermenin üzerinden bir yıl geçmekle zamanaşımına uğrar' },
      ],
    },
    {
      baslik: 'Kredili daire, miras arsa ve kira geliri: katılma alacağının hesabı',
      olay:
        'Mehmet ile Selin 2010’da evlenmiş, mal rejimi sözleşmesi yapmamışlardır. Mehmet evlilik içinde maaşıyla ve konut ' +
        'kredisiyle bir daire almış olup dairenin tasfiye anındaki değeri 4.000.000 TL, kalan kredi borcu 1.000.000 TL’dir. Selin ' +
        'babasından miras kalan bir arsanın sahibidir. Selin’in maaşından biriktirdiği 400.000 TL ile arsanın kira gelirlerinden ' +
        'biriken 200.000 TL ayrı hesaplarda durmaktadır. Selin 2025’te boşanma davası açmıştır.',
      cozum:
        'Sözleşme yapılmadığından yasal rejim olan edinilmiş mallara katılma uygulanır (TMK m.202). Mahkeme boşanmaya karar ' +
        'verdiğinde rejim dava tarihinden geçerli olmak üzere sona erer (TMK m.225/2), mallar ise tasfiye anındaki değerleriyle ' +
        'hesaba katılır (TMK m.235). Miras yoluyla edinilen arsa kişisel maldır (TMK m.220/2), ne var ki Selin bunu ispat etmelidir, ' +
        'zira bir eşin bütün malları aksi ispat edilinceye kadar edinilmiş mal kabul edilir (TMK m.222). Maaş birikimi ' +
        'çalışmanın karşılığı, kira birikimi de kişisel malın geliri olduğundan ikisi de edinilmiş maldır (TMK m.219). Mehmet’in ' +
        'artık değeri, daireden ona ilişkin kredi borcu çıkarılarak 3.000.000 TL bulunur (TMK m.231). Selin’in artık değeri ' +
        '600.000 TL’dir. Her eş diğerinin artık değerinin yarısı üzerinde hak sahibi olup alacaklar takas edilir (TMK m.236). ' +
        'Selin’in 1.500.000 TL’lik alacağından Mehmet’in 300.000 TL’lik alacağı düşülünce Selin’e 1.200.000 TL katılma alacağı kalır.',
      sonuc:
        'Hesap sınıflandırma, artık değer ve takas sırasıyla kurulur; kişisel malın kendisi hesaba girmez ama geliri edinilmiş maldır.',
      dayanaklar: [
        { kanun: 'tmk', madde: '202', ifade: 'Eşler arasında edinilmiş mallara katılma rejiminin uygulanması asıldır' },
        { kanun: 'tmk', madde: '225', ifade: 'mal rejimi dava tarihinden geçerli olmak üzere sona erer' },
        { kanun: 'tmk', madde: '220', ifade: 'sonradan miras yoluyla ya da herhangi bir şekilde karşılıksız kazanma yoluyla' },
        { kanun: 'tmk', madde: '222', ifade: 'Bir eşin bütün malları, aksi ispat edilinceye kadar edinilmiş mal kabul edilir' },
        { kanun: 'tmk', madde: '219', ifade: 'Kişisel mallarının gelirleri' },
        { kanun: 'tmk', madde: '231', ifade: 'bu mallara ilişkin borçlar çıkarıldıktan sonra kalan miktardır' },
        { kanun: 'tmk', madde: '236', ifade: 'diğer eşe ait artık değerin yarısı üzerinde hak sahibi olurlar. Alacaklar takas edilir' },
      ],
    },
    {
      baslik: 'Ortak konutu terk eden eş ve ihtarın takvimi',
      olay:
        'Eda 1 Mart’ta eşyalarını toplayarak ortak konuttan ayrılmış ve annesinin yanına yerleşmiştir. Eşi Can, Eda’nın evden ' +
        'kendisi tarafından çıkarılmadığını, dönmesi için birkaç kez aradığını söylemektedir. Can 10 Nisan’da noterden ihtar ' +
        'çekilmesini istemiş, noter ise talebi reddetmiştir. Can boşanma davasını en erken ne zaman açabileceğini sormaktadır.',
      cozum:
        'Terk sebebiyle boşanma için ayrılığın en az altı ay sürmesi, devam etmesi ve hâkim veya noter tarafından yapılan ihtarın ' +
        'sonuçsuz kalması gerekir (TMK m.164/1). İhtar, sürenin dördüncü ayı bitmedikçe istenemez. Ayrılık 1 Mart’ta başladığından ' +
        'dördüncü ay 1 Temmuz’da dolmakta olup 10 Nisan’daki istem erkendir ve noterin reddi yerindedir. Can 1 Temmuz’dan sonra ' +
        'yeniden başvurabilir. İhtar Eda’ya iki ay içinde ortak konuta dönmesi gerektiğini ve dönmezse doğacak sonuçları bildirir. ' +
        'İhtardan sonra iki ay geçmedikçe dava açılamaz (TMK m.164/2), yani ihtar 5 Temmuz’da yapılırsa dava 5 Eylül’den önce ' +
        'açılamaz. Eda dönmezse o tarihte altı aylık ayrılık da dolmuş olur. Eda’nın Can tarafından evden çıkarıldığı ispat edilirse ' +
        'terk etmiş sayılan Can olur, çünkü diğerini ortak konutu terk etmeye zorlayan eş de terk etmiş sayılır.',
      sonuc:
        'Terk davasında üç süre ayrı hesaplanır: ihtar istemi için dört ay, ihtardan sonra iki ay ve toplamda en az altı ay ayrılık.',
      dayanaklar: [
        { kanun: 'tmk', madde: '164', ifade: 'ayrılık, en az altı ay sürmüş ve bu durum devam etmekte' },
        { kanun: 'tmk', madde: '164', ifade: 'belirli sürenin dördüncü ayı bitmedikçe ihtar isteminde bulunulamaz' },
        { kanun: 'tmk', madde: '164', ifade: 'ihtardan sonra iki ay geçmedikçe dava açılamaz' },
        { kanun: 'tmk', madde: '164', ifade: 'ortak konutu terk etmeye zorlayan' },
      ],
    },
    {
      baslik: 'Boşanmadan sonra doğan çocuk, soybağının reddi ve babalık davası',
      olay:
        'Deniz ile Okan’ın boşanma kararı 10 Ocak’ta kesinleşmiştir. Deniz 20 Haziran’da bir çocuk doğurmuş, çocuk nüfusa Okan’ın ' +
        'çocuğu olarak yazılmıştır. Okan ertesi yılın Mart ayında yaptırdığı genetik incelemeyle çocuğun babası olmadığını ' +
        'öğrenmiştir. Deniz, çocuğun gerçek babasının Burak olduğunu belirtmekte ve Burak’a dava açmak istemektedir.',
      cozum:
        'Çocuk evliliğin sona ermesinden başlayarak üç yüz gün içinde doğduğundan babası kocadır (TMK m.285/1). Bu karine ancak ' +
        'soybağının reddi davasıyla çürütülebilir (TMK m.286). Okan davayı doğumu ve baba olmadığını öğrendiği tarihten başlayarak ' +
        'bir yıl içinde açmalıdır (TMK m.289/1), yani süre Mart ayındaki öğrenmeden işler. Okan ile çocuk arasındaki soybağı ' +
        'sürdükçe Deniz Burak’a karşı babalık hükmü elde edemez. Ananın dava hakkı doğumdan başlayarak bir yılda düşer, ancak ' +
        'çocuk ile başka bir erkek arasında soybağı varsa bu bir yıllık süre o ilişkinin ortadan kalktığı tarihte işlemeye ' +
        'başlar (TMK m.303). Red kararı kesinleşince Deniz babalık davasını Burak’a karşı açar (TMK m.301).',
      sonuc:
        'Karine çürütülmeden babalık davası sonuç vermez; ananın bir yıllık süresi önceki soybağının kalktığı tarihten işler.',
      dayanaklar: [
        { kanun: 'tmk', madde: '285', ifade: 'evliliğin sona ermesinden başlayarak üçyüz gün içinde doğan çocuğun babası kocadır' },
        { kanun: 'tmk', madde: '286', ifade: 'soybağının reddi davasını açarak babalık karinesini çürütebilir' },
        { kanun: 'tmk', madde: '289', ifade: 'doğumu ve baba olmadığını' },
        { kanun: 'tmk', madde: '303', ifade: 'bir yıllık süre bu ilişkinin ortadan kalktığı tarihte işlemeye başlar' },
        { kanun: 'tmk', madde: '301', ifade: 'Dava babaya, baba ölmüşse mirasçılarına karşı açılır' },
      ],
    },
  ],
  sinavIskeleti: [
    {
      adim: 'Hukuki durumun tespiti',
      aciklama: 'Taraflar arasındaki ilişki nişanlılık, geçerli evlilik, batıl evlilik ya da sona ermiş evlilik olarak belirlenir ve olay tarihleri sıralanır.',
    },
    {
      adim: 'Sebep, dava hakkı ve süre',
      aciklama: 'Butlan ya da boşanma sebebi seçilir; davayı kimin açabileceği ve hak düşürücü süreler öğrenme ve olay tarihlerinden ayrı ayrı hesaplanır.',
    },
    {
      adim: 'Fer’î sonuçlar',
      aciklama: 'Maddî ve manevî tazminat, yoksulluk nafakası, velayet, kişisel ilişki ve çocuğun giderlerine katılma ayrı başlıklar altında incelenir.',
    },
    {
      adim: 'Mal rejiminin tasfiyesi',
      aciklama: 'Rejimin sona erdiği an, malların edinilmiş ya da kişisel olarak ayrılması, artık değer ve katılma alacağı tutar olarak yazılır.',
    },
    {
      adim: 'Çocuğa ilişkin soybağı',
      aciklama: 'Babalık karinesinin uygulanıp uygulanmadığı, reddi ve babalık davası arasındaki sıra ve süreler denetlenir.',
    },
    {
      adim: 'Usul kuralları',
      aciklama: 'Hâkimin vicdanî kanaati, ikrarın bağlayıcı olmaması ve fer’î sonuçlara ilişkin anlaşmanın onayı cevaba eklenir.',
    },
  ],
  tuzakDefteri: [
    {
      tuzak: 'Mutlak butlanla batıl bir evlilik baştan hiç doğmamış sayılır.',
      dogrusu: 'Batıl evlilik ancak hâkim kararıyla sona erer ve mutlak butlanda bile karara kadar geçerli bir evliliğin bütün sonuçlarını doğurur.',
      dayanak: { kanun: 'tmk', madde: '156', ifade: 'hâkimin kararına kadar geçerli bir evliliğin bütün sonuçlarını doğurur' },
    },
    {
      tuzak: 'Yoksulluk nafakası ancak kusurlu eşten istenebilir.',
      dogrusu: 'Yoksulluğa düşecek tarafın kusuru daha ağır olmamalıdır, nafaka yükümlüsünün kusuru ise aranmaz.',
      dayanak: { kanun: 'tmk', madde: '175', ifade: 'Nafaka yükümlüsünün kusuru aranmaz' },
    },
    {
      tuzak: 'Mal rejimi boşanma kararının kesinleştiği gün sona erer.',
      dogrusu: 'Boşanma ya da iptal kararı verilirse mal rejimi dava tarihinden geçerli olmak üzere sona erer.',
      dayanak: { kanun: 'tmk', madde: '225', ifade: 'dava tarihinden geçerli olmak üzere sona erer' },
    },
    {
      tuzak: 'Evliliğin süresi ne olursa olsun eşler anlaşmalı boşanabilir.',
      dogrusu: 'Birlikte başvuru ya da davanın kabulü ile evlilik birliğinin sarsılmış sayılması için evliliğin en az bir yıl sürmesi gerekir.',
      dayanak: { kanun: 'tmk', madde: '166', ifade: 'Evlilik en az bir yıl sürmüş ise' },
    },
    {
      tuzak: 'Manevî tazminat da nafaka gibi aylık irat olarak ödetilebilir.',
      dogrusu: 'Maddî tazminat ve yoksulluk nafakası irat biçiminde ödenebilir, manevî tazminat ise irat biçiminde ödetilemez.',
      dayanak: { kanun: 'tmk', madde: '176', ifade: 'Manevî tazminatın irat biçiminde ödenmesine karar verilemez' },
    },
    {
      tuzak: 'Aile konutu kendi adına kayıtlı olan eş onu dilediği gibi satabilir.',
      dogrusu: 'Malik eş, diğer eşin açık rızası olmadıkça aile konutunu devredemez ve üzerindeki hakları sınırlayamaz.',
      dayanak: { kanun: 'tmk', madde: '194', ifade: 'diğer eşin açık rızası bulunmadıkça' },
    },
    {
      tuzak: 'Zina sebebiyle boşanma davası süresiz açılabilir.',
      dogrusu: 'Dava hakkı öğrenmeden başlayarak altı ay ve her hâlde zinanın üzerinden beş yıl geçmekle düşer, affeden eşin dava hakkı yoktur.',
      dayanak: { kanun: 'tmk', madde: '161', ifade: 'Affeden tarafın dava hakkı yoktur' },
    },
  ],
  kisaTest: [
    {
      q: 'Olağan durumda evlenebilmek için kaç yaşın doldurulması gerekir?',
      choices: ['On beş', 'On altı', 'On yedi', 'On sekiz'],
      answer: 2,
      reason: 'TMK m.124 erkek veya kadının on yedi yaşını doldurmadıkça evlenemeyeceğini, on altı yaşın ancak hâkim izniyle yeterli olduğunu öngörür.',
      dayanak: { kanun: 'tmk', madde: '124', ifade: 'onyedi yaşını doldurmadıkça evlenemez' },
    },
    {
      q: 'Devam eden bir evliliğin mutlak butlanı davasını re’sen kim açar?',
      choices: ['Evlendirme memuru', 'Cumhuriyet savcısı', 'Nüfus müdürlüğü', 'Aile mahkemesi hâkimi'],
      answer: 1,
      reason: 'TMK m.146 mutlak butlan davasının Cumhuriyet savcısı tarafından re’sen açılacağını, ilgisi olan herkesin de açabileceğini öngörür.',
      dayanak: { kanun: 'tmk', madde: '146', ifade: "Mutlak butlan davası, Cumhuriyet savcısı tarafından re'sen açılır" },
    },
    {
      q: 'Eşlerden birine sonradan miras yoluyla kalan taşınmaz hangi mal grubundadır?',
      choices: ['Edinilmiş mal', 'Kişisel mal', 'Paylı mülkiyetteki ortak mal', 'Eklenecek değer'],
      answer: 1,
      reason: 'TMK m.220/2 miras yoluyla ya da karşılıksız kazanma yoluyla sonradan elde edilen değerleri kanun gereğince kişisel mal sayar.',
      dayanak: { kanun: 'tmk', madde: '220', ifade: 'Aşağıda sayılanlar, kanun gereğince kişisel maldır' },
    },
    {
      q: 'Eşin mal rejiminin sona ermesinden önceki bir yıl içinde rızası alınmadan yaptığı olağan dışı bağış tasfiyede nasıl değerlendirilir?',
      choices: [
        'Hesaba katılmaz.',
        'Edinilmiş mallara değer olarak eklenir.',
        'Kişisel mallara eklenir.',
        'Yalnız bağışlanan üçüncü kişiden istenebilir.',
      ],
      answer: 1,
      reason: 'TMK m.229/1-1 bu karşılıksız kazandırmaların edinilmiş mallara değer olarak ekleneceğini öngörür.',
      dayanak: { kanun: 'tmk', madde: '229', ifade: 'edinilmiş mallara değer olarak eklenir' },
    },
    {
      q: 'Evliliğin boşanma sebebiyle sona ermesinden doğan dava hakları ne kadar sürede zamanaşımına uğrar?',
      choices: ['Altı ay', 'Bir yıl', 'Beş yıl', 'On yıl'],
      answer: 1,
      reason: 'TMK m.178 bu dava haklarının boşanma hükmünün kesinleşmesinin üzerinden bir yıl geçmekle zamanaşımına uğrayacağını öngörür.',
      dayanak: { kanun: 'tmk', madde: '178', ifade: 'boşanma hükmünün kesinleşmesinin üzerinden bir yıl geçmekle zamanaşımına uğrar' },
    },
    {
      q: 'Boşanma davasında tarafların boşanma sebebine ilişkin ikrarı hakkında hangisi doğrudur?',
      choices: ['Hâkimi bağlar.', 'Yalnız yazılıysa hâkimi bağlar.', 'Hâkimi bağlamaz.', 'Yeminle desteklenirse hâkimi bağlar.'],
      answer: 2,
      reason: 'TMK m.184/3 tarafların boşanma ve ayrılık davasının dayandığı olgulara ilişkin her türlü ikrarının hâkimi bağlamayacağını öngörür.',
      dayanak: { kanun: 'tmk', madde: '184', ifade: 'Tarafların bu konudaki her türlü ikrarları hâkimi bağlamaz' },
    },
  ],
  kaynaklar: [
    {
      title: '4721 sayılı Türk Medenî Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.4721.pdf',
      note: 'Örnek olay, tuzak ve test dayanaklarının resmî metni',
    },
  ],
};

export default katman;
