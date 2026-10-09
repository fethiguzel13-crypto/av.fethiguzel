/**
 * İdare Hukuku — kanonik katman (G19). Depoda İdari Yargılama Usulü Kanunu ve Anayasa metni bulunmadığından katman, yerelde
 * metni bulunan 2942 sayılı Kamulaştırma Kanunu, 5393 sayılı Belediye Kanunu ve 3194 sayılı İmar Kanunu üzerine kuruludur
 * (`content/mevzuat/kamulastirma`, `belediye`, `imar`). Olaylar kurmacadır; kişi, tarih ve tutar örnek içindir. Genel idari dava
 * süresi gibi İYUK’a dayanan önermeler yazılmamıştır.
 */
const katman = {
  ders: 'idare-hukuku',
  temsilci: { uni: 'ankara', ders: 'idare-hukuku-yillik' },
  guncelleme: '2026-10-09',
  ornekOlaylar: [
    {
      baslik: 'Park alanı için belediyenin arsa kamulaştırması',
      olay:
        'Bir ilçe belediyesi, imar planında park alanında kalan Ahmet’e ait tapulu arsayı kamulaştırmaya karar vermiştir. Uzlaşma ' +
        'görüşmesinde belediyenin önerdiği bedel Ahmet tarafından kabul edilmemiş, belediye asliye hukuk mahkemesine başvurmuştur. ' +
        'Mahkemenin tebligatı Ahmet’e 4 Ekim’de ulaşmış, Ahmet hem kamulaştırmanın hukuka aykırı olduğunu hem de bedelin düşük ' +
        'belirlendiğini ileri sürmek istemektedir.',
      cozum:
        'Belediye yararına kamulaştırmalarda kamu yararı kararını belediye encümeni verir (Kamulaştırma Kanunu (KK) m.5/a-3), ' +
        'yıllık çalışma programındaki işlere ilişkin kamulaştırma kararlarını almak da encümenin görevidir (Belediye Kanunu m.34/b). ' +
        'Tapuda kayıtlı taşınmazlarda idare satın alma usulünü öncelikle uygulamak zorundadır (KK m.8). Uzlaşma sağlanamadığından ' +
        'idare taşınmazın bulunduğu yer asliye hukuk mahkemesine başvurarak bedelin tespitini ve taşınmazın idare adına tescilini ' +
        'ister (KK m.10). Ahmet, mahkemenin tebligatından itibaren otuz gün içinde kamulaştırma işlemine karşı idari yargıda iptal ' +
        'davası, maddi hatalara karşı adli yargıda düzeltim davası açabilir (KK m.14). Bedele ilişkin itirazlarını ise asliye hukuk ' +
        'mahkemesindeki bedel tespiti davasında ileri sürer. Mülkiyet idareye bedelin ödenmesiyle değil mahkemenin tescil kararıyla ' +
        'geçer (KK m.25).',
      sonuc: 'Kamulaştırmanın hukuka uygunluğu idari yargıda, bedel adli yargıda tartışılır; iptal davası tebligattan itibaren otuz gündür.',
      dayanaklar: [
        { kanun: 'kamulastirma', madde: '5', ifade: 'belediye yararına kamulaştırmalarda belediye encümeni' },
        { kanun: 'belediye', madde: '34', ifade: 'kamulaştırma kararlarını almak ve uygulamak' },
        { kanun: 'kamulastirma', madde: '8', ifade: 'satın alma usulünü öncelikle uygulamaları esastır' },
        { kanun: 'kamulastirma', madde: '10', ifade: 'taşınmaz malın bulunduğu yer asliye hukuk mahkemesine müracaat eder' },
        { kanun: 'kamulastirma', madde: '14', ifade: 'otuz gün içinde, kamulaştırma işlemine karşı idari yargıda iptal' },
        { kanun: 'kamulastirma', madde: '25', ifade: 'mülkiyetin idareye geçmesi, mahkemece verilen tescil kararı ile olur' },
      ],
    },
    {
      baslik: 'Kamulaştırılıp boş bırakılan taşınmazın geri istenmesi',
      olay:
        'Bir belediye, okul yapımı için Fatma’nın tarlasını kamulaştırmış, bedel 1 Mart 2018’de kesinleşmiştir. Aradan geçen sürede ' +
        'taşınmaz üzerinde hiçbir işlem ve tesisat yapılmamış, taşınmaz başka bir kamu ihtiyacına da tahsis edilmemiştir. Fatma ' +
        '10 Haziran 2025’te kamulaştırma bedelini faiziyle ödeyerek tarlasını geri almak için belediyeye başvurmuştur.',
      cozum:
        'Kamulaştırma bedelinin kesinleşmesinden itibaren beş yıl içinde kamulaştırma amacına uygun hiçbir işlem yapılmaz ve taşınmaz ' +
        'kamu yararına bir ihtiyaca tahsis edilmeden bırakılırsa mal sahibi, aldığı bedeli kanuni faiziyle ödeyerek taşınmazı geri ' +
        'alabilir (KK m.23/1). Bu hak 1 Mart 2023’te doğmuştur. Doğmasından itibaren bir yıl içinde kullanılmayan geri alma hakkı ' +
        'düştüğünden hak 1 Mart 2024’te sona ermiştir. KK m.23/3 uyarınca bu süreler geçtikten sonra eski malik idareden herhangi bir ' +
        'sebeple hak, bedel veya tazminat talebinde de bulunamaz. Fatma’nın 2025’teki başvurusu bu nedenle reddedilir.',
      sonuc: 'Geri alma hakkı beş yıllık hareketsizlikle doğar ve doğumundan itibaren bir yıl içinde kullanılmazsa düşer.',
      dayanaklar: [
        { kanun: 'kamulastirma', madde: '23', ifade: 'kamulaştırma bedelinin kesinleşmesi tarihinden itibaren beş yıl içinde' },
        { kanun: 'kamulastirma', madde: '23', ifade: 'doğmasından itibaren bir yıl içinde kullanılmayan geri alma hakkı düşer' },
        { kanun: 'kamulastirma', madde: '23', ifade: 'idareden herhangi bir sebeple hak, bedel veya tazminat talebinde bulunulama' },
      ],
    },
    {
      baslik: 'Ruhsatsız kat ilavesi ve belediyenin yaptırımları',
      olay:
        'Kerem, ruhsatlı iki katlı evinin üzerine ruhsat almadan üçüncü bir kat çıkmaya başlamış, aynı dönemde evin dış cephesini ' +
        'boyatmıştır. Belediye zabıtası 3 Temmuz’da inşaatı tespit etmiştir. Kerem, boya işi için de ruhsat gerekip gerekmediğini ve ' +
        'belediyenin hangi işlemleri yapabileceğini sormaktadır.',
      cozum:
        'İmar Kanunu kapsamındaki bütün yapılar için yapı ruhsatı zorunludur ve ruhsatlı yapıda değişiklik de yeniden ruhsata bağlıdır ' +
        '(İmar Kanunu m.21). Dış sıva, boya ve badana ise ruhsata tâbi değildir, dolayısıyla cephe boyası için ruhsat gerekmez. Ruhsatsız ' +
        'kat ilavesi tespit edilince belediye o andaki inşaat durumunu tespit eder, yapıyı mühürleyerek inşaatı derhal durdurur. Kerem ' +
        'tebliğden itibaren en çok bir ay içinde yapısını ruhsata uygun hâle getirmez ya da ruhsat almazsa ruhsata aykırı kısım belediye ' +
        'encümeni kararıyla yıktırılır ve masrafı kendisinden tahsil edilir (İmar Kanunu m.32). Bunun yanında encümen, aykırılığın ' +
        'tespitinden itibaren on iş günü içinde idari para cezası uygular (İmar Kanunu m.42).',
      sonuc: 'Ruhsatsız yapıda sıra tespit, mühürleme, bir aylık süre ve encümen kararıyla yıkımdır; para cezası ayrıca uygulanır.',
      dayanaklar: [
        { kanun: 'imar', madde: '21', ifade: 'yapı ruhsatiyesi alınması mecburidir' },
        { kanun: 'imar', madde: '21', ifade: 'iç ve dış sıva, boya, badana' },
        { kanun: 'imar', madde: '32', ifade: 'yapı mühürlenerek inşaat derhal durdurulur' },
        { kanun: 'imar', madde: '32', ifade: 'belediye encümeni veya il idare kurulu kararını müteakip, belediye veya valilikçe yıktırılır' },
        { kanun: 'imar', madde: '42', ifade: 'tespit edildiği tarihten itibaren on iş günü içinde ilgili idare encümenince' },
      ],
    },
  ],
  sinavIskeleti: [
    {
      adim: 'İdarenin ve işlemin belirlenmesi',
      aciklama: 'İşlemi yapan idare ve organ, işlemin türü ve dayandığı kanun maddesi ilk cümlede yazılır.',
    },
    {
      adim: 'Yetki',
      aciklama: 'Kararı kanunun hangi organa verdiği denetlenir; meclis, encümen ve başkan yetkileri birbirinden ayrılır.',
    },
    {
      adim: 'Usul ve şekil',
      aciklama: 'Kanunun öngördüğü ön işlemler, tebligat, süre ve şekil koşulları olaydaki tarihlerle kontrol edilir.',
    },
    {
      adim: 'Konu ve amaç',
      aciklama: 'İşlemin kamu yararı amacına ve kanundaki koşullara uygun olup olmadığı somut vakıalarla tartışılır.',
    },
    {
      adim: 'Yargı yolu ve süre',
      aciklama: 'İdari yargı ile adli yargının görev alanı ayrılır ve özel kanundaki dava süresi gösterilir.',
    },
    {
      adim: 'Sonuç ve haklar',
      aciklama: 'İptal, bedel, geri alma ya da tazminat yollarından hangisinin hangi süre içinde kullanılacağı yazılır.',
    },
  ],
  tuzakDefteri: [
    {
      tuzak: 'İdare kamulaştırmada uzlaşma aramadan doğrudan mahkemeye başvurabilir.',
      dogrusu: 'Tapuda kayıtlı taşınmazlarda satın alma usulünün öncelikle uygulanması esastır.',
      dayanak: { kanun: 'kamulastirma', madde: '8', ifade: 'satın alma usulünü öncelikle uygulamaları esastır' },
    },
    {
      tuzak: 'Kamulaştırılan taşınmazın mülkiyeti bedelin bankaya yatırılmasıyla idareye geçer.',
      dogrusu: 'Mülkiyet idareye mahkemece verilen tescil kararıyla geçer.',
      dayanak: { kanun: 'kamulastirma', madde: '25', ifade: 'mahkemece verilen tescil kararı ile olur' },
    },
    {
      tuzak: 'Belediyede kamulaştırma kararını belediye meclisi alır.',
      dogrusu: 'Yıllık çalışma programına alınan işlerle ilgili kamulaştırma kararlarını belediye encümeni alır ve uygular.',
      dayanak: { kanun: 'belediye', madde: '34', ifade: 'yıllık çalışma programına alınan işlerle ilgili kamulaştırma kararlarını almak' },
    },
    {
      tuzak: 'Belediye meclisi kararları başkanın onayıyla kesinleşir; başkan onaylamazsa karar hüküm doğurmaz.',
      dogrusu: 'Başkan hukuka aykırı gördüğü kararı beş gün içinde meclise iade edebilir; meclis üye tam sayısının salt çoğunluğuyla ısrar ederse karar kesinleşir ve başkan on gün içinde idari yargıya başvurabilir.',
      dayanak: { kanun: 'belediye', madde: '23', ifade: 'belediye başkanı, meclisin ısrarı ile kesinleşen kararlar aleyhine on gün içinde idarî yargıya başvurabilir' },
    },
    {
      tuzak: 'Çatı onarımı ve kiremit aktarılması yapı ruhsatı gerektirir.',
      dogrusu: 'Çatı onarımı, kiremit aktarılması, boya ve badana gibi taşıyıcı unsuru etkilemeyen işler ruhsata tâbi değildir.',
      dayanak: { kanun: 'imar', madde: '21', ifade: 'çatı onarımı ve kiremit aktarılması' },
    },
    {
      tuzak: 'Geri alma hakkı kamulaştırmadan sonra süresiz olarak kullanılabilir.',
      dogrusu: 'Hak, bedelin kesinleşmesinden itibaren beş yıllık hareketsizlikle doğar ve doğmasından itibaren bir yıl içinde kullanılmazsa düşer.',
      dayanak: { kanun: 'kamulastirma', madde: '23', ifade: 'doğmasından itibaren bir yıl içinde kullanılmayan geri alma hakkı düşer' },
    },
  ],
  kisaTest: [
    {
      q: 'Belediye yararına yapılacak kamulaştırmada kamu yararı kararını hangi merci verir?',
      choices: ['Belediye meclisi', 'Belediye encümeni', 'Belediye başkanı', 'Vali'],
      answer: 1,
      reason: 'KK m.5/a-3 belediye yararına kamulaştırmalarda kamu yararı kararını belediye encümenine bırakır.',
      dayanak: { kanun: 'kamulastirma', madde: '5', ifade: 'belediye yararına kamulaştırmalarda belediye encümeni' },
    },
    {
      q: 'Belediyenin imar planlarını görüşmek ve onaylamak hangi organın görevidir?',
      choices: ['Belediye encümeni', 'Belediye başkanı', 'Belediye meclisi', 'Mülki idare amiri'],
      answer: 2,
      reason: 'Belediye Kanunu m.18/c imar planlarını görüşüp onaylamayı belediye meclisine verir.',
      dayanak: { kanun: 'belediye', madde: '18', ifade: 'belediyenin imar plânlarını görüşmek ve onaylamak' },
    },
    {
      q: 'Belediyeyi yargı yerlerinde davacı veya davalı olarak kim temsil eder?',
      choices: ['Belediye başkanı', 'Belediye meclisi başkanvekili', 'Encümenin en yaşlı üyesi', 'Hazine avukatı'],
      answer: 0,
      reason: 'Belediye Kanunu m.38/c belediyeyi yargı yerlerinde temsil etmeyi başkanın görevleri arasında sayar.',
      dayanak: { kanun: 'belediye', madde: '38', ifade: 'davacı veya davalı olarak da yargı yerlerinde temsil etmek' },
    },
    {
      q: 'Ruhsatsız başlanan yapı mühürlendikten sonra yapı sahibine ruhsat almak için ne kadar süre tanınır?',
      choices: ['Yedi gün', 'On beş gün', 'En çok bir ay', 'Altı ay'],
      answer: 2,
      reason: 'İmar Kanunu m.32 yapı sahibine en çok bir ay içinde yapıyı ruhsata uygun hâle getirme veya ruhsat alma imkânı tanır.',
      dayanak: { kanun: 'imar', madde: '32', ifade: 'bu tarihten itibaren en çok bir ay içinde yapı sahibi' },
    },
    {
      q: 'Kamulaştırma işlemine karşı malikin iptal davası açma süresi ne zaman başlar?',
      choices: [
        'Kamu yararı kararının alındığı tarihten',
        'Asliye hukuk mahkemesince yapılan tebligat gününden',
        'Tescil kararının kesinleşmesinden',
        'Bedelin bankaya yatırıldığı tarihten',
      ],
      answer: 1,
      reason: 'KK m.14/1 otuz günlük süreyi mahkemece yapılan tebligat gününden, tebligat yapılamayanlar için ilan tarihinden başlatır.',
      dayanak: { kanun: 'kamulastirma', madde: '14', ifade: '10 uncu madde gereğince mahkemece yapılan tebligat gününden' },
    },
    {
      q: 'Belediyenin yetkileri arasında hangisi yer alır?',
      choices: [
        'Kanunların verdiği yetki çerçevesinde yönetmelik çıkarmak ve belediye yasakları koymak',
        'Kanunla öngörülmemiş vergi koymak',
        'Ceza mahkemesi kararlarını kaldırmak',
        'İl çevre düzeni planını her belediyede tek başına onaylamak',
      ],
      answer: 0,
      reason: 'Belediye Kanunu m.15/b yönetmelik çıkarma, belediye yasakları koyma ve kanunlarda belirtilen cezaları verme yetkisini tanır.',
      dayanak: { kanun: 'belediye', madde: '15', ifade: 'kanunların belediyeye verdiği yetki çerçevesinde yönetmelik çıkarmak' },
    },
  ],
  kaynaklar: [
    {
      title: '2942 sayılı Kamulaştırma Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.2942.pdf',
      note: 'Kamulaştırma olayları ve test dayanaklarının resmî metni',
    },
    {
      title: '5393 sayılı Belediye Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.5393.pdf',
      note: 'Belediye organlarının görev ve yetkileri',
    },
    {
      title: '3194 sayılı İmar Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.3194.pdf',
      note: 'Yapı ruhsatı ve ruhsatsız yapıya ilişkin yaptırımlar',
    },
  ],
};

export default katman;
