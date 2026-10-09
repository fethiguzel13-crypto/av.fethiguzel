/**
 * Borçlar Hukuku Genel Hükümler — kanonik katman (G19). Dayanaklar 6098 sayılı Türk Borçlar Kanunu metnine bağlıdır
 * (`content/mevzuat/tbk`). Olaylar kurmacadır; kişi, tarih ve tutar örnek içindir.
 */
const katman = {
  ders: 'borclar-genel',
  temsilci: { uni: 'ankara', ders: 'borclar-genel-yillik' },
  guncelleme: '2026-10-09',
  ornekOlaylar: [
    {
      baslik: 'Vitrindeki fiyat etiketi ve yanlış yazılan bedel',
      olay:
        'Eskişehir’de sahaf işleten Selin, vitrine bir ilk baskı kitabı 1.200 TL etiketiyle koymuştur. Mert dükkâna girip kitabı ' +
        'etiketteki bedelle almak istediğini söylemiş, Selin ise etiketin yanlış yazıldığını, kendisinin 12.000 TL istediğini ileri ' +
        'sürerek kitabı vermekten kaçınmıştır.',
      cozum:
        'İlk soru sözleşmenin kurulup kurulmadığıdır. Türk Borçlar Kanunu (TBK) m.8/2 uyarınca fiyatını göstererek mal sergilenmesi, ' +
        'aksi açıkça ve kolaylıkla anlaşılmadıkça öneri sayılır. Vitrinde satılık olmadığına dair bir kayıt bulunmadığından etiket ' +
        'öneridir ve Mert’in kabulüyle sözleşme TBK m.1 uyarınca kurulmuştur. İkinci soru Selin’in sözleşmeyle bağlı olup olmadığıdır. ' +
        'Selin gerçekte istediğinden önemli ölçüde az bir karşı edim için iradesini açıkladığını ispat ederse yanılması TBK m.31’in beşinci ' +
        'bendi uyarınca esaslıdır ve TBK m.30 gereği sözleşmeyle bağlı olmaz. Bunun için yanılmayı öğrendiği andan başlayarak bir yıl içinde ' +
        'bağlı olmadığını bildirmesi gerekir (TBK m.39). Yanılmasında kusurlu olduğundan Mert’in sözleşmenin hükümsüzlüğünden doğan ' +
        'zararını gidermekle yükümlüdür, ne var ki Mert yanılmayı biliyor ya da bilmesi gerekiyorsa tazminat isteyemez (TBK m.35).',
      sonuc:
        'Etiket öneridir ve sözleşme kurulmuştur; satıcı ancak esaslı yanılmayı ispat edip bir yıl içinde bildirirse bağlılıktan kurtulur.',
      dayanaklar: [
        { kanun: 'tbk', madde: '8', ifade: 'fiyatını göstererek mal sergilenmesi' },
        { kanun: 'tbk', madde: '31', ifade: 'gerçekte istediğinden önemli ölçüde az bir karşı edim için iradesini açıklamışsa' },
        { kanun: 'tbk', madde: '39', ifade: 'öğrendiği ya da korkutmanın etkisinin ortadan kalktığı andan başlayarak bir yıl içinde' },
        { kanun: 'tbk', madde: '35', ifade: 'diğer taraf yanılmayı biliyor veya bilmesi gerekiyorsa, tazminat istenemez' },
      ],
    },
    {
      baslik: 'Süreli öneriye geç ulaşan kabul',
      olay:
        'Ankara’daki bir matbaa 3 Mart’ta İzmir’deki kâğıt tedarikçisine 20 ton kâğıt için yazılı öneride bulunmuş ve kabul için ' +
        '10 Mart’a kadar süre vermiştir. Tedarikçinin kabul yazısı matbaaya 12 Mart’ta ulaşmış, matbaa ise 11 Mart’ta başka bir ' +
        'firmayla anlaşmıştır. Tedarikçi, 20 tonluk satışın kurulduğunu ileri sürerek bedel istemektedir.',
      cozum:
        'Öneride kabul için süre belirlendiğinden olay TBK m.3 kapsamında çözülür ve tarafların hazır olup olmadığı ayrımına ' +
        '(TBK m.4 ve m.5) girmeye gerek kalmaz, zira bu iki madde süre belirlenmeksizin yapılan öneriye ilişkindir. TBK m.3 uyarınca ' +
        'öneren sürenin sonuna kadar önerisiyle bağlıdır ve kabul bu süre içinde kendisine ulaşmazsa bağlılıktan kurtulur. Kabul süre ' +
        'bittikten sonra ulaştığından sözleşme kurulmamıştır ve matbaanın başka firmayla anlaşması bir ihlal oluşturmaz. Önerinin ' +
        'süresiz olduğu farklı bir olayda TBK m.5/3 devreye girer: Zamanında gönderilen kabul önerene geç ulaşırsa ve öneren onunla ' +
        'bağlı olmak istemezse durumu hemen kabul edene bildirmek zorundadır.',
      sonuc: 'Süreli öneride ölçüt kabulün gönderildiği gün değil önerene ulaştığı gündür; süreden sonra ulaşan kabul sözleşmeyi kurmaz.',
      dayanaklar: [
        { kanun: 'tbk', madde: '3', ifade: 'kabul bu süre içinde kendisine ulaşmazsa; öneren, önerisiyle bağlılıktan kurtulur' },
        { kanun: 'tbk', madde: '5', ifade: 'durumu hemen kabul edene bildirmek zorundadır' },
      ],
    },
    {
      baslik: 'Kararlaştırılan teslim gününde ifa edilmeyen satım',
      olay:
        'Bir mobilya atölyesi, Bodrum’daki bir otelin işletmecisine 40 sandalyeyi 15 Mayıs’ta teslim etmeyi sözleşmeyle üstlenmiştir. ' +
        'Sandalyeler 15 Mayıs’ta teslim edilmemiştir. İşletmeci 20 Mayıs’ta yazılı bildirimle on gün süre vermiş, süre de sonuçsuz ' +
        'geçmiştir. İşletmeci sandalyeleri başka bir üreticiden daha yüksek bedelle almak ve aradaki farkı atölyeden istemek niyetindedir.',
      cozum:
        'Temerrüt için kural alacaklının ihtarıdır, ne var ki ifa günü birlikte belirlenmişse bu günün geçmesiyle borçlu ihtara gerek ' +
        'olmaksızın temerrüde düşer (TBK m.117/2). Atölye 15 Mayıs’ın geçmesiyle temerrüde düşmüştür. Sözleşme karşılıklı borç ' +
        'yüklediğinden işletmeci uygun bir süre vermiş (TBK m.123), süre de sonuçsuz kalmıştır. TBK m.125 alacaklıya üç yol tanır: ' +
        'ifa ve gecikme tazminatı istemek, ifadan vazgeçtiğini hemen bildirerek ifa edilmemeden doğan zararın giderilmesini istemek ya da ' +
        'sözleşmeden dönmek. İşletmecinin amacı fark bedelini almak olduğundan ikinci yol seçilmeli ve vazgeçme hemen bildirilmelidir. ' +
        'Dönme yolunda ise taraflar ifa yükümlülüğünden kurtulur ve alacaklı, borçlu kusursuzluğunu ispat edemedikçe sözleşmenin ' +
        'hükümsüz kalması sebebiyle uğradığı zararı isteyebilir.',
      sonuc:
        'Belirli günde ifa kararlaştırılmışsa ihtar aranmaz; süre sonuçsuz geçince alacaklı seçimlik haklardan birini hemen bildirerek kullanır.',
      dayanaklar: [
        { kanun: 'tbk', madde: '117', ifade: 'borcun ifa edileceği gün, birlikte belirlenmiş' },
        { kanun: 'tbk', madde: '123', ifade: 'borcun ifa edilmesi için uygun bir süre verebilir' },
        { kanun: 'tbk', madde: '125', ifade: 'vazgeçtiğini hemen bildirerek' },
      ],
    },
    {
      baslik: 'Kaldırımdaki çarpışma ve iki yıllık süre',
      olay:
        'Motorlu olmayan bisikletle teslimat yapan bir kurye, 10 Ocak 2023’te yaya kaldırımında hızla ilerlerken bir yayaya çarpmış ' +
        've yayanın kolu kırılmıştır. Yaya kuryenin kimliğini ve tedavi giderlerini aynı ay içinde öğrenmiştir. Tazminat davası ' +
        '1 Mart 2025’te açılmış, davalı ise ilk cevap dilekçesinde zamanaşımı savunmasında bulunmuştur.',
      cozum:
        'Borcun kaynağı sözleşme değil haksız fiildir. TBK m.49/1 uyarınca kusurlu ve hukuka aykırı bir fiille başkasına zarar veren bu ' +
        'zararı gidermekle yükümlüdür ve TBK m.50 gereği zararı ve kusuru zarar gören ispat eder. Kaldırımda hızla ilerleme kusuru, ' +
        'kırık kol ve tedavi giderleri bu unsurları karşılar. Savunma yönünden TBK m.72/1 tazminat istemini zararın ve tazminat ' +
        'yükümlüsünün öğrenildiği tarihten başlayarak iki yıla ve her hâlde fiilden başlayarak on yıla bağlar. Öğrenme Ocak 2023’te ' +
        'gerçekleştiğinden iki yıllık süre dava tarihinden önce dolmuştur. Fiil ceza kanunlarının daha uzun zamanaşımı öngördüğü bir ' +
        'suç oluşturuyorsa o süre uygulanacağından kâğıtta fiilin suç niteliği ayrıca tartışılır. Davalı zamanaşımını ileri sürdüğü ' +
        'için hâkim bu savunmayı inceler, zira zamanaşımı ileri sürülmedikçe hâkim onu kendiliğinden göz önüne alamaz (TBK m.161). Faiz bakımından haksız fiilde ' +
        'borçlu fiilin işlendiği tarihte temerrüde düşer (TBK m.117/2).',
      sonuc:
        'Haksız fiilde süre öğrenmeden başlar ve iki yıldır; ceza zamanaşımı daha uzunsa o uygulanır, savunma ileri sürülmedikçe dikkate alınmaz.',
      dayanaklar: [
        { kanun: 'tbk', madde: '49', ifade: 'kusurlu ve hukuka aykırı bir fiille başkasına zarar veren' },
        { kanun: 'tbk', madde: '50', ifade: 'zarar gören, zararını ve zarar verenin kusurunu ispat yükü altındadır' },
        { kanun: 'tbk', madde: '72', ifade: 'tazminat ceza kanunlarının daha uzun bir zamanaşımı öngördüğü cezayı gerektiren bir fiilden doğmuşsa' },
        { kanun: 'tbk', madde: '161', ifade: 'zamanaşımı ileri sürülmedikçe, hâkim bunu kendiliğinden göz önüne alamaz' },
        { kanun: 'tbk', madde: '117', ifade: 'haksız fiilde fiilin işlendiği' },
      ],
    },
  ],
  sinavIskeleti: [
    {
      adim: 'Borcun kaynağı',
      aciklama: 'İlk cümle borcun sözleşmeden, haksız fiilden ya da sebepsiz zenginleşmeden doğduğunu ve dayanak maddesini söyler.',
    },
    {
      adim: 'Kurulma ve geçerlilik',
      aciklama: 'Öneri ve kabulün uyuşması, şekil, kesin hükümsüzlük ve irade bozukluğu sırasıyla denetlenir; geçersiz sözleşmeye ifa talebi kurulmaz.',
    },
    {
      adim: 'İhlalin türü',
      aciklama: 'Borcun muaccel olup olmadığı, temerrüdün ihtarla mı belirli günle mi doğduğu ve ifanın imkânsızlaşıp imkânsızlaşmadığı ayrılır.',
    },
    {
      adim: 'Talep ve hesap',
      aciklama: 'Seçilen talep maddesiyle yazılır, zarar kalemleri ayrılır ve faizin başlangıç günü temerrüt anına bağlanır.',
    },
    {
      adim: 'Savunmalar',
      aciklama: 'Zamanaşımı ve hak düşürücü süreler en sonda hesaplanır; zamanaşımının ileri sürülüp sürülmediği ayrıca yazılır.',
    },
    {
      adim: 'Sonuç cümlesi',
      aciklama: 'Kimin kimden neyi hangi maddeye dayanarak isteyebileceği tek cümlede verilir.',
    },
  ],
  tuzakDefteri: [
    {
      tuzak: 'Vitrinde fiyatıyla sergilenen mal icaba davettir.',
      dogrusu: 'TBK m.8/2’ye göre fiyatını göstererek mal sergilenmesi, aksi açıkça ve kolaylıkla anlaşılmadıkça öneri sayılır.',
      dayanak: { kanun: 'tbk', madde: '8', ifade: 'aksi açıkça ve kolaylıkla anlaşılmadıkça öneri sayılır' },
    },
    {
      tuzak: 'Temerrüt için her durumda ihtar gerekir.',
      dogrusu: 'İfa günü birlikte belirlenmişse bu günün geçmesiyle, haksız fiilde ise fiilin işlendiği tarihte borçlu ihtarsız temerrüde düşer.',
      dayanak: { kanun: 'tbk', madde: '117', ifade: 'bu günün geçmesiyle' },
    },
    {
      tuzak: 'Haksız fiilden doğan tazminat istemi on yılda zamanaşımına uğrar.',
      dogrusu: 'Süre, zararın ve tazminat yükümlüsünün öğrenilmesinden başlayarak iki yıl, her hâlde fiilden başlayarak on yıldır.',
      dayanak: { kanun: 'tbk', madde: '72', ifade: 'iki yılın ve her hâlde fiilin işlendiği tarihten başlayarak on yılın geçmesiyle' },
    },
    {
      tuzak: 'Sözleşmenin bir hükmü kesin hükümsüzse sözleşmenin tamamı hükümsüz olur.',
      dogrusu: 'Kısmi hükümsüzlük diğer hükümleri etkilemez; o hükümler olmaksızın sözleşmenin yapılmayacağı açıkça anlaşılırsa tamamı hükümsüz olur.',
      dayanak: { kanun: 'tbk', madde: '27', ifade: 'diğerlerinin geçerliliğini etkilemez' },
    },
    {
      tuzak: 'Aldatmaya dayanmak için yanılmanın esaslı olması gerekir.',
      dogrusu: 'Aldatılan taraf, yanılması esaslı olmasa bile sözleşmeyle bağlı değildir.',
      dayanak: { kanun: 'tbk', madde: '36', ifade: 'yanılması esaslı olmasa bile' },
    },
    {
      tuzak: 'Saikte yanılma her zaman esaslı yanılmadır.',
      dogrusu: 'Saikte yanılma kural olarak esaslı sayılmaz; saik dürüstlük kurallarına göre sözleşmenin temeli sayılıyor ve karşı tarafça bilinebilir ise esaslıdır.',
      dayanak: { kanun: 'tbk', madde: '32', ifade: 'saikte yanılma, esaslı yanılma sayılmaz' },
    },
    {
      tuzak: 'Kira bedeli alacağı genel kural gereği on yıllık zamanaşımına tabidir.',
      dogrusu: 'Kira bedelleri, anapara faizleri ve ücret gibi dönemsel edimler beş yıllık zamanaşımına tabidir.',
      dayanak: { kanun: 'tbk', madde: '147', ifade: 'kira bedelleri, anapara faizleri ve ücret gibi diğer dönemsel edimler' },
    },
    {
      tuzak: 'Hâkim zamanaşımının dolduğunu dosyadan görürse davayı kendiliğinden reddeder.',
      dogrusu: 'Zamanaşımı bir savunmadır; ileri sürülmedikçe hâkim onu kendiliğinden göz önüne alamaz.',
      dayanak: { kanun: 'tbk', madde: '161', ifade: 'hâkim bunu kendiliğinden göz önüne alamaz' },
    },
  ],
  kisaTest: [
    {
      q: 'Kabul için süre belirlenerek yapılan öneride kabul, süre bittikten sonra önerene ulaşmıştır. Sonuç nedir?',
      choices: [
        'Kabul gönderildiği gün geçerli olduğundan sözleşme kurulmuştur.',
        'Öneren önerisiyle bağlılıktan kurtulmuştur, sözleşme kurulmamıştır.',
        'Öneren geç ulaşmayı hemen bildirmezse sözleşme kurulmuş sayılır.',
        'Sözleşme kurulmuş, ancak öneren bir yıl içinde dönebilir.',
      ],
      answer: 1,
      reason: 'TBK m.3 uyarınca kabul süre içinde ulaşmazsa öneren bağlılıktan kurtulur. Hemen bildirme yükü süresiz öneriye ilişkin TBK m.5/3’tedir.',
      dayanak: { kanun: 'tbk', madde: '3', ifade: 'bu sürenin sona ermesine kadar önerisiyle bağlıdır' },
    },
    {
      q: 'Aşırı yararlanmada zarar gören, zor durumda kalma hâlinde hakkını hangi süre içinde kullanmalıdır?',
      choices: [
        'Durumun ortadan kalktığı tarihten başlayarak bir yıl ve her hâlde sözleşmeden başlayarak beş yıl içinde',
        'Sözleşmenin kurulduğu tarihten başlayarak iki yıl içinde',
        'Durumun ortadan kalktığı tarihten başlayarak on yıl içinde',
        'Süreye bağlı olmaksızın her zaman',
      ],
      answer: 0,
      reason: 'TBK m.28/2 zor durumda kalmada süreyi durumun ortadan kalkmasından başlayan bir yıl ve sözleşmeden başlayan beş yıl olarak belirler.',
      dayanak: { kanun: 'tbk', madde: '28', ifade: 'bu durumun ortadan kalktığı tarihten başlayarak bir yıl' },
    },
    {
      q: 'Haksız fiil sorumluluğunda zararı ve kusuru kim ispat eder?',
      choices: ['Zarar veren', 'Zarar gören', 'Hâkim kendiliğinden araştırır', 'Kusuru zarar veren, zararı zarar gören'],
      answer: 1,
      reason: 'TBK m.50/1 zararı ve zarar verenin kusurunu ispat yükünü zarar görene bırakır.',
      dayanak: { kanun: 'tbk', madde: '50', ifade: 'zarar gören, zararını ve zarar verenin kusurunu ispat yükü altındadır' },
    },
    {
      q: 'Sebepsiz zenginleşmeden doğan geri isteme hakkı hangi sürede zamanaşımına uğrar?',
      choices: [
        'Zenginleşmeden başlayarak beş yıl',
        'Her hâlde on yıllık genel süreyle',
        'Geri isteme hakkının öğrenilmesinden başlayarak iki yıl, her hâlde zenginleşmeden başlayarak on yıl',
        'Öğrenmeden başlayarak bir yıl',
      ],
      answer: 2,
      reason: 'TBK m.82 öğrenmeden başlayan iki yıllık ve zenginleşmeden başlayan on yıllık süreyi öngörür.',
      dayanak: { kanun: 'tbk', madde: '82', ifade: 'geri isteme hakkı olduğunu öğrendiği tarihten başlayarak iki yılın' },
    },
    {
      q: 'Borç hiç veya gereği gibi ifa edilmediğinde borçlu tazminattan nasıl kurtulur?',
      choices: [
        'Alacaklının kusurunu ispat ederek',
        'Kendisine hiçbir kusurun yüklenemeyeceğini ispat ederek',
        'Borcun muaccel olmadığını bildirerek',
        'Zararın miktarının belirsiz olduğunu ileri sürerek',
      ],
      answer: 1,
      reason: 'TBK m.112 sözleşmeye aykırılıkta kusuru karine olarak kabul eder; borçlu kusursuzluğunu ispat etmedikçe zararı giderir.',
      dayanak: { kanun: 'tbk', madde: '112', ifade: 'kendisine hiçbir kusurun yüklenemeyeceğini ispat etmedikçe' },
    },
    {
      q: 'Hazır olan bir kişiye kabul süresi belirlenmeden yapılan öneri hemen kabul edilmezse ne olur?',
      choices: [
        'Öneri makul bir süre bağlayıcı kalır.',
        'Öneri, karşı tarafın yanıtının ulaşması beklenebilecek ana kadar bağlar.',
        'Öneren önerisiyle bağlılıktan kurtulur.',
        'Öneri, geri alınıncaya kadar bağlayıcıdır.',
      ],
      answer: 2,
      reason: 'TBK m.4/1 uyarınca hazır olanlar arasında süresiz öneri hemen kabul edilmezse öneren bağlılıktan kurtulur.',
      dayanak: { kanun: 'tbk', madde: '4', ifade: 'hemen kabul edilmezse; öneren, önerisiyle bağlılıktan kurtulur' },
    },
  ],
  kaynaklar: [
    {
      title: '6098 sayılı Türk Borçlar Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6098.pdf',
      note: 'Örnek olay, tuzak ve test dayanaklarının resmî metni',
    },
  ],
};

export default katman;
