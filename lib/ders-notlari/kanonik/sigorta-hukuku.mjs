/**
 * Sigorta Hukuku — kanonik katman (G23). Dayanaklar 6102 sayılı Türk Ticaret Kanunu metnine bağlıdır (`content/mevzuat/ttk`,
 * m.1401 vd.). Olaylar kurmacadır; kişi, tarih ve tutar örnek içindir. Tazminat hesabı yalnız kanundaki oranla yapılmıştır.
 */
const katman = {
  ders: 'sigorta-hukuku',
  temsilci: { uni: 'ankara', ders: 'sigorta-hukuku-yillik' },
  guncelleme: '2026-10-14',
  ornekOlaylar: [
    {
      baslik: 'Değerinin yarısına sigortalanan ev ve komşudan çıkan yangın',
      olay:
        'Derya, değeri 4.000.000 TL olan evini 2.000.000 TL sigorta bedeliyle yangına karşı sigortalamıştır. Komşusu Ferhat’ın ' +
        'balkonda dikkatsizce yaktığı mangaldan sıçrayan ateş evin bir bölümünü yakmış, bilirkişi zararı 1.000.000 TL olarak ' +
        'belirlemiştir. Derya yangını ertesi sabah sigortacıya bildirmiştir. Sigortacının ne kadar ödeyeceği ve Ferhat’a kimin ' +
        'başvurabileceği sorulmaktadır.',
      cozum:
        'Sigorta bedeli sigorta değerinin altında kaldığından eksik sigorta vardır. Menfaatin bir kısmı zarar gördüğünde sigortacı, ' +
        'aksine sözleşme yoksa, sigorta bedelinin sigorta değerine oranına göre öder (Türk Ticaret Kanunu (TTK) m.1462). Oran ' +
        'yarıdır, sigortacı 1.000.000 TL’lik zararın 500.000 TL’sini öder. Derya’nın ertesi sabahki bildirimi gecikmeksizin ' +
        'bildirim yükümlülüğünü karşılar (TTK m.1446/1). Sigortacı ödediğinde hukuken Derya’nın yerine geçer ve Derya’nın Ferhat’a ' +
        'karşı dava hakkı ödediği 500.000 TL kadar sigortacıya intikal eder. Sigortacı zararı kısmen tazmin ettiğinden Derya kalan ' +
        '500.000 TL için Ferhat’a başvurma hakkını korur (TTK m.1472).',
      sonuc: 'Eksik sigortada tazminat oranla bulunur; halefiyet ödenen tutarla sınırlıdır ve kalan zarar sigortalıda kalır.',
      dayanaklar: [
        { kanun: 'ttk', madde: '1462', ifade: 'sigorta bedelinin sigorta değerine olan oranına göre tazminat öder' },
        { kanun: 'ttk', madde: '1446', ifade: 'durumu gecikmeksizin sigortacıya bildirir' },
        { kanun: 'ttk', madde: '1472', ifade: 'tazmin ettiği bedel kadar, sigortacıya intikal eder' },
        { kanun: 'ttk', madde: '1472', ifade: 'kalan kısımdan dolayı sorumlulara karşı sahip olduğu başvurma hakkını korur' },
      ],
    },
    {
      baslik: 'Konut diye sigortalanan binanın zemin katındaki restoran mutfağı',
      olay:
        'Kerem, üç katlı binasını yangın sigortasına konut olarak bildirmiştir. Sigortacının verdiği soru listesinde “binada ' +
        'ticari faaliyet var mı” sorusuna “hayır” cevabını vermiştir. Oysa zemin katta kiracı olarak bir restoran çalışmaktadır ve ' +
        'Kerem bunu bilmektedir. Yangın restoranın mutfağından çıkmış, sigortacı da durumu ancak ekspertiz sırasında öğrenmiştir.',
      cozum:
        'Sigorta ettiren, sözleşme yapılırken bildiği bütün önemli hususları bildirmekle yükümlüdür ve sigortacının sorduğu ' +
        'hususlar aksi ispat edilinceye kadar önemli sayılır (TTK m.1435). Ticari faaliyet sorusu listede yer aldığından Kerem bu ' +
        'sorudan sorumludur (TTK m.1436). Riziko gerçekleştikten sonra ortaya çıkan ihlalde sonuç kusurun derecesine göre ' +
        'değişir. Kerem’in kusuru kast derecesindedir ve yangın gizlenen restorandan çıktığından ihlal ile riziko arasında ' +
        'bağlantı vardır. Bu nedenle sigortacının tazminat ödeme borcu ortadan kalkar (TTK m.1439/2). Yangın binanın başka bir ' +
        'yerinden çıksaydı sigortacı, ödenen primle ödenmesi gereken prim arasındaki orana göre öderdi.',
      sonuc: 'Beyan yükümlülüğünün ihlalinde ihmal indirime, kast ve bağlantı borcun düşmesine, bağlantısız kast oranlı ödemeye götürür.',
      dayanaklar: [
        { kanun: 'ttk', madde: '1435', ifade: 'aksi ispat edilinceye kadar önemli sayılır' },
        { kanun: 'ttk', madde: '1436', ifade: 'sunulan listede yer alan sorular dışında kalan hususlara ilişkin' },
        { kanun: 'ttk', madde: '1439', ifade: 'sigortacının tazminat veya bedel ödeme borcu ortadan kalkar' },
      ],
    },
    {
      baslik: 'İlk primi ödenmeden çalınan otomobil',
      olay:
        'Ozan otomobili için 1 Mayıs başlangıçlı bir kasko poliçesi yaptırmış, primin tamamını poliçe tarihinde peşin ödemeyi ' +
        'kabul etmiş, ancak ödememiştir. Poliçede sorumluluğun başlangıcına ilişkin özel bir kayıt bulunmamaktadır. Otomobil 20 ' +
        'Mayıs’ta çalınmıştır. Ozan primi 21 Mayıs’ta yatırıp tazminat istemiştir.',
      cozum:
        'Aksine sözleşme yoksa sigortacının sorumluluğu primin ya da ilk taksidinin ödenmesiyle başlar (TTK m.1421/1). Poliçede ' +
        'aksine bir kayıt bulunmadığından 20 Mayıs’taki hırsızlık anında sigortacının sorumluluğu henüz başlamamıştır ve sonradan ' +
        'yapılan ödeme bu sonucu değiştirmez. Bir defada ödenmesi gereken primin zamanında ödenmemesi hâlinde sigortacı, ödeme ' +
        'yapılmadığı sürece vadeden başlayarak üç ay içinde sözleşmeden cayabilir. Prim alacağı muacceliyetten itibaren üç ay ' +
        'içinde dava veya takip yoluyla istenmezse sözleşmeden cayılmış olunur (TTK m.1434/2).',
      sonuc: 'Kural olarak prim ödenmeden sigorta koruması başlamaz; geç ödeme önceki rizikoyu teminata almaz.',
      dayanaklar: [
        { kanun: 'ttk', madde: '1421', ifade: 'sigortacının sorumluluğu primin veya ilk taksidinin ödenmesi ile başlar' },
        { kanun: 'ttk', madde: '1434', ifade: 'sözleşmeden üç ay içinde cayabilir' },
        { kanun: 'ttk', madde: '1434', ifade: 'dava veya takip yoluyla istenmemiş olması hâlinde, sözleşmeden cayılmış olunur' },
      ],
    },
    {
      baslik: 'Eşinin hayatı üzerine izinsiz yapılan ölüm sigortası',
      olay:
        'Sevgi, eşi Burak’ın hayatı üzerine kendisini lehtar gösteren 3.000.000 TL bedelli bir ölüm sigortası yaptırmıştır. ' +
        'Burak’ın yazılı izni alınmamış, Burak sözleşmeden haberdar da edilmemiştir. Burak iki yıl sonra bir trafik kazasında ' +
        'ölmüş, sigortacı sözleşmenin geçersiz olduğunu ileri sürerek ödemeyi reddetmiştir.',
      cozum:
        'Başkasının hayatı üzerine sigorta yapılabilmesi için lehtarın o kişinin hayatının devamında menfaati bulunmalıdır. Eşin ' +
        'bu menfaati taşıdığı kabul edilse bile ayrı bir koşul daha vardır. Ölüm ihtimaline karşı yapılan sigortada bedel mutat ' +
        'cenaze giderlerini aşıyorsa sigortalının yazılı izni gerekir, izin olmadan yapılan sözleşme icazet verilmediği takdirde ' +
        'geçersizdir (TTK m.1490/2). 3.000.000 TL’lik bedel cenaze giderlerini açıkça aşmaktadır. Burak hayattayken icazet ' +
        'vermediğinden sözleşme geçersizdir ve sigortacının reddi yerindedir.',
      sonuc: 'Başkasının hayatı üzerine ölüm sigortasında menfaat şartı tek başına yetmez; sigortalının yazılı izni ayrıca aranır.',
      dayanaklar: [
        { kanun: 'ttk', madde: '1490', ifade: 'o kişinin hayatının devamında lehtarın menfaatinin bulunması şarttır' },
        { kanun: 'ttk', madde: '1490', ifade: 'İzin olmadan yapılan sözleşme, icazet verilmediği takdirde geçersizdir' },
      ],
    },
  ],
  sinavIskeleti: [
    {
      adim: 'Sözleşmenin ve sigorta türünün belirlenmesi',
      aciklama: 'Zarar sigortası mı can sigortası mı olduğu, sigortalanan menfaat ve riziko belirlenir.',
    },
    {
      adim: 'Sorumluluğun başlaması',
      aciklama: 'Primin ödenip ödenmediği ve sorumluluğun başlangıcına ilişkin özel kayıt riziko tarihine göre denetlenir.',
    },
    {
      adim: 'Sigorta ettirenin yükümlülükleri',
      aciklama: 'Beyan yükümlülüğü, rizikonun ağırlaşmasının bildirilmesi ve rizikonun gerçekleştiğinin ihbarı ayrı ayrı incelenir.',
    },
    {
      adim: 'İhlalin sonucu',
      aciklama: 'İhlalin ihmal mi kast mı olduğu, riziko ile bağlantısı ve sigortacının cayma ya da indirim hakkı belirlenir.',
    },
    {
      adim: 'Tazminatın hesabı ve muacceliyeti',
      aciklama: 'Sigorta değeri ve bedeli karşılaştırılır, eksik ya da aşkın sigorta varsa oran uygulanır ve muacceliyet günü bulunur.',
    },
    {
      adim: 'Halefiyet ve zamanaşımı',
      aciklama: 'Sigortacının sorumlu üçüncü kişiye halefiyeti ve istemlerin zamanaşımı süreleri olay tarihlerine uygulanır.',
    },
  ],
  tuzakDefteri: [
    {
      tuzak: 'Sigortalının ihmaliyle gerçekleşen riziko teminat dışındadır.',
      dogrusu: 'Aksine sözleşme yoksa sigortacı ihmalden kaynaklanan zararları tazmin eder; yalnız kasten sebep olunan rizikoda borçtan kurtulur.',
      dayanak: { kanun: 'ttk', madde: '1429', ifade: 'ihmallerinden kaynaklanan zararları tazmin ile yükümlüdür' },
    },
    {
      tuzak: 'Sigortacı tazminatı geç öderse temerrüt için ayrıca ihtar gerekir.',
      dogrusu: 'Borç muaccel olunca sigortacı ihtara gerek kalmaksızın temerrüde düşer.',
      dayanak: { kanun: 'ttk', madde: '1427', ifade: 'sigortacı ihtara gerek kalmaksızın temerrüde düşer' },
    },
    {
      tuzak: 'Rizikonun geç ihbar edilmesi sigortacıyı tazminat borcundan tamamen kurtarır.',
      dogrusu: 'Geç ihbar tazminatta artışa yol açmışsa kusurun ağırlığına göre indirim yapılır; sigortacı rizikoyu fiilen öğrenmişse indirim de yapılmaz.',
      dayanak: { kanun: 'ttk', madde: '1446', ifade: 'kusurun ağırlığına göre, tazminattan veya bedelden indirim yoluna gidilir' },
    },
    {
      tuzak: 'Sigorta ettiren önemli saymadığı bir hususu bildirmemişse sigortacı cayamaz.',
      dogrusu: 'Önemli hususun sigorta ettiren tarafından önemli sayılmaması ya da kusuruyla öğrenilememesi cayma hakkını etkilemez.',
      dayanak: { kanun: 'ttk', madde: '1439', ifade: 'sigorta ettiren tarafından önemli sayılmaması durumu değiştirmez' },
    },
    {
      tuzak: 'Aşkın sigortada sözleşme her durumda bütünüyle geçersizdir.',
      dogrusu: 'Sigorta bedelinin menfaatin değerini aşan kısmı geçersizdir; sözleşme yalnız mali çıkar amacıyla kötüniyetle yapılmışsa bütünüyle geçersizdir.',
      dayanak: { kanun: 'ttk', madde: '1463', ifade: 'aşan kısım geçersizdir' },
    },
    {
      tuzak: 'Sigortacı tazminatı ancak aynen, yani onarım ya da yenileme yoluyla öder.',
      dogrusu: 'Aynen tazmine ilişkin sözleşme yoksa sigorta tazminatı nakden ödenir.',
      dayanak: { kanun: 'ttk', madde: '1427', ifade: 'Aynen tazmine ilişkin sözleşme yoksa sigorta tazminatı nakden ödenir' },
    },
  ],
  kisaTest: [
    {
      q: 'Sigorta tazminatına ilişkin istemler, rizikonun gerçekleşmesinden itibaren en geç ne zaman zamanaşımına uğrar?',
      choices: ['İki yıl', 'Üç yıl', 'Altı yıl', 'On yıl'],
      answer: 2,
      reason: 'TTK m.1420/1 istemlerin muacceliyetten iki yılda, tazminat ve bedel istemlerinin her hâlde rizikodan itibaren altı yılda zamanaşımına uğrayacağını öngörür.',
      dayanak: { kanun: 'ttk', madde: '1420', ifade: 'rizikonun gerçekleştiği tarihten itibaren altı yıl geçmekle zamanaşımına uğrar' },
    },
    {
      q: 'Zarar sigortasında tazminat, rizikonun ihbarından en geç kaç gün sonra muaccel olur?',
      choices: ['On beş', 'Otuz', 'Kırk beş', 'Doksan'],
      answer: 2,
      reason: 'TTK m.1427/2 tazminatın ihbardan kırk beş gün sonra, can sigortalarında on beş gün sonra muaccel olacağını öngörür.',
      dayanak: { kanun: 'ttk', madde: '1427', ifade: 'ihbardan kırkbeş gün sonra muaccel olur' },
    },
    {
      q: 'İzleyen primlerden biri ödenmezse sigortacı sigorta ettirene kaç günlük süre vererek ihtarda bulunur?',
      choices: ['Yedi', 'On', 'On beş', 'Otuz'],
      answer: 1,
      reason: 'TTK m.1434/3 sigortacının noter ya da iadeli taahhütlü mektupla on günlük süre vererek ihtar edeceğini öngörür.',
      dayanak: { kanun: 'ttk', madde: '1434', ifade: 'on günlük süre vererek borcunu yerine getirmesini' },
    },
    {
      q: 'Sigortacı tazminatı ödediğinde sorumlu üçüncü kişiye karşı hangi sıfatla başvurur?',
      choices: ['Temlik alan sıfatıyla', 'Halef sıfatıyla', 'Kefil sıfatıyla', 'Vekâletsiz iş gören sıfatıyla'],
      answer: 1,
      reason: 'TTK m.1472/1 sigortacının ödediği tutar kadar hukuken sigortalının yerine geçeceğini, yani halefiyeti öngörür.',
      dayanak: { kanun: 'ttk', madde: '1472', ifade: 'Sigortacı, sigorta tazminatını ödediğinde, hukuken sigortalının yerine geçer' },
    },
    {
      q: 'Sigorta ettirenin bilgisi dışında riziko ağırlaşmışsa bunu sigortacıya en geç ne zaman bildirmelidir?',
      choices: ['Derhâl', 'Öğrendiği tarihten itibaren on gün içinde', 'Öğrendiği tarihten itibaren otuz gün içinde', 'Sigorta döneminin sonunda'],
      answer: 1,
      reason: 'TTK m.1444/2 bilgisi dışında yapılan işlemlerde bildirimin öğrenmeden itibaren en geç on gün içinde yapılacağını öngörür.',
      dayanak: { kanun: 'ttk', madde: '1444', ifade: 'öğrendiği tarihten itibaren en geç on gün içinde' },
    },
    {
      q: 'Beyan yükümlülüğünün ihlalini öğrenen sigortacı caymayı hangi süre içinde bildirmelidir?',
      choices: ['On gün', 'On beş gün', 'Otuz gün', 'Üç ay'],
      answer: 1,
      reason: 'TTK m.1440/2 caymanın, sigortacının ihlali öğrendiği tarihten başlayarak on beş gün içinde bildirileceğini öngörür.',
      dayanak: { kanun: 'ttk', madde: '1440', ifade: 'Cayma, onbeş gün içinde sigorta ettirene bildirilir' },
    },
  ],
  kaynaklar: [
    {
      title: '6102 sayılı Türk Ticaret Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6102.pdf',
      note: 'Örnek olay, tuzak ve test dayanaklarının resmî metni',
    },
  ],
};

export default katman;
