/**
 * Ceza Muhakemesi Hukuku — kanonik katman (G23). Dayanaklar 5271 sayılı Ceza Muhakemesi Kanunu metnine bağlıdır
 * (`content/mevzuat/cmk`); uzlaştırma olayında suçun nitelendirilmesi için TCK m.155'e de dayanılır. Olaylar kurmacadır; kişi, yer ve saat örnek içindir. Son değişikliği doğrulanamayan hükümler
 * (hükmün açıklanmasının geri bırakılması) katmana alınmamıştır.
 */
const katman = {
  ders: 'ceza-muhakemesi',
  temsilci: { uni: 'ankara', ders: 'ceza-muhakemesi-yillik' },
  guncelleme: '2026-10-15',
  ornekOlaylar: [
    {
      baslik: 'Otuz iki saat sonra hâkim önüne çıkarılan şüpheli',
      olay:
        'Tarık, tek başına işlediği ileri sürülen bir dolandırıcılık nedeniyle Pazartesi saat 10.00’da kolluk tarafından ' +
        'yakalanmış, Cumhuriyet savcısı gözaltına alınmasına karar vermiştir. Sulh ceza hâkimliği aynı adliye binasında ' +
        'bulunmaktadır. Tarık, Salı saat 18.00’de tutuklama istemiyle hâkim önüne çıkarılmıştır.',
      cozum:
        'Gözaltı süresi, en yakın hâkime gönderilme için zorunlu süre hariç, yakalama anından itibaren yirmi dört saati geçemez ' +
        've gönderilme için zorunlu süre de on iki saati aşamaz (Ceza Muhakemesi Kanunu (CMK) m.91/1). Hâkimlik aynı binada ' +
        'olduğundan zorunlu yol süresi bulunmamakta olup süre Salı saat 10.00’da dolmuştur. Süre uzatımı yalnız toplu olarak ' +
        'işlenen suçlarda mümkün olduğundan tek şüpheli bakımından Cumhuriyet savcısının uzatma emri de verilemezdi (CMK m.91/3). ' +
        'Kanuni gözaltı süresi içinde hâkim önüne çıkarılmayan Tarık, uğradığı zararı Devletten isteyebilir (CMK m.141/1-b).',
      sonuc: 'Bireysel suçta gözaltı yakalamadan itibaren yirmi dört saatle sınırlıdır; aşım tazminat sebebidir.',
      dayanaklar: [
        { kanun: 'cmk', madde: '91', ifade: 'yakalama anından itibaren yirmidört saati geçemez' },
        { kanun: 'cmk', madde: '91', ifade: 'Toplu olarak işlenen suçlarda' },
        { kanun: 'cmk', madde: '141', ifade: 'Kanunî gözaltı süresi içinde hâkim önüne çıkarılmayan' },
      ],
    },
    {
      baslik: 'Serbest bırakılma vaadiyle alınan ikrar',
      olay:
        'Serkan, hırsızlık şüphesiyle gözaltına alınmış ve müdafi istememiştir. Kolluk görevlisi, suçu kabul ederse o gün ' +
        'serbest bırakılacağını söylemiş, Serkan da müdafi bulunmadan alınan ifadesinde suçu ikrar etmiştir. Duruşmada Serkan ' +
        'ikrarını reddetmiş, dosyada başka delil bulunmamaktadır.',
      cozum:
        'Şüphelinin beyanı özgür iradesine dayanmalı olup kanuna aykırı bir yarar vaat edilemez (CMK m.148/1-2). Serbest bırakılma ' +
        'vaadi bu yasağa girdiğinden ifade, Serkan rıza göstermiş olsa da delil olarak değerlendirilemez (CMK m.148/3). Yasak ' +
        'usul bulunmasaydı bile sonuç değişmezdi, zira müdafi hazır bulunmaksızın kollukça alınan ifade hâkim ya da mahkeme ' +
        'huzurunda doğrulanmadıkça hükme esas alınamaz (CMK m.148/4). Başka delil bulunmadığından suçun işlendiği sabit olmamış ' +
        'olup beraat kararı verilir (CMK m.223/2-e).',
      sonuc: 'Yasak usulle alınan ikrar rızaya rağmen delil değildir; müdafisiz kolluk ifadesi duruşmada doğrulanmadıkça hükme esas alınmaz.',
      dayanaklar: [
        { kanun: 'cmk', madde: '148', ifade: 'Kanuna aykırı bir yarar vaat edilemez' },
        { kanun: 'cmk', madde: '148', ifade: 'rıza ile verilmiş olsa da delil olarak değerlendirilemez' },
        { kanun: 'cmk', madde: '148', ifade: 'Müdafi hazır bulunmaksızın kollukça alınan ifade' },
        { kanun: 'cmk', madde: '223', ifade: 'Yüklenen suçun sanık tarafından işlendiğinin sabit olmaması' },
      ],
    },
    {
      baslik: 'Katalog suç şüphelisi için tutuklama istemi',
      olay:
        'Ece, bir mağazadan hırsızlık yaptığı şüphesiyle gözaltına alınmıştır. Sabit bir adresi ve işi vardır, kaçacağına ' +
        'ya da delilleri karartacağına dair somut bir olgu yoktur. Cumhuriyet savcısı, suçun kanunda sayılan suçlardan olduğunu ' +
        'belirterek yalnızca bu gerekçeyle tutuklama istemiştir.',
      cozum:
        'Tutuklama için kuvvetli suç şüphesini gösteren somut delillerin yanında bir tutuklama nedeni bulunmalı, tedbir işin ' +
        'önemi ve beklenen ceza ile ölçülü olmalıdır (CMK m.100/1). Hırsızlık, tutuklama nedeninin var sayılabileceği suçlar ' +
        'arasında yer almakla birlikte kanun bu karineyi takdire bırakmıştır (CMK m.100/3). İstemde adli kontrolün yetersiz ' +
        'kalacağını gösteren hukuki ve fiilî nedenlere de yer verilmesi gerekir (CMK m.101/1). Somut olay ölçülülüğü ' +
        'desteklemediğinden sulh ceza hâkimi tutuklama yerine adli kontrole karar verebilir (CMK m.109/1). Tutuklama istemi ' +
        'üzerine verilen karara itiraz edilebilir (CMK m.101/5).',
      sonuc: 'Katalog suç tutuklamayı zorunlu kılmaz; ölçülülük ve adli kontrolün yetersizliği ayrıca gerekçelendirilir.',
      dayanaklar: [
        { kanun: 'cmk', madde: '100', ifade: 'ölçülü olmaması halinde, tutuklama kararı verilemez' },
        { kanun: 'cmk', madde: '100', ifade: 'tutuklama nedeni var sayılabilir' },
        { kanun: 'cmk', madde: '101', ifade: 'adlî kontrol uygulamasının yetersiz kalacağını belirten hukukî ve fiilî nedenlere yer verilir' },
        { kanun: 'cmk', madde: '109', ifade: 'şüphelinin tutuklanması yerine adlî kontrol altına alınmasına karar verilebilir' },
      ],
    },
    {
      baslik: 'Uzlaştırma yapılmadan düzenlenen iddianame',
      olay:
        'Hakan, komşusunun bir haftalığına ödünç verdiği bisikleti geri vermeyip başkasına sattığı ileri sürülerek şikâyet ' +
        'edilmiştir. Cumhuriyet savcısı fiili hırsızlık olarak nitelendirip iddianame düzenlemiş, uzlaştırma girişiminde ' +
        'bulunmamıştır. İddianameyi alan asliye ceza mahkemesi ise fiilin güveni kötüye kullanma suçunu oluşturduğunu düşünmektedir.',
      cozum:
        'Hırsızlık da, üçüncü fıkra dışında kalan güveni kötüye kullanma da şikâyete bağlı olup olmadığına bakılmaksızın ' +
        'uzlaştırma kapsamındadır (CMK m.253/1-b). Zilyetliği kendisine devredilen mal üzerinde devir amacı dışında tasarruf ' +
        'eden kişinin işlediği güveni kötüye kullanma suçu ayrıca şikâyete bağlıdır (Türk Ceza Kanunu (TCK) m.155/1, CMK ' +
        'm.253/1-a). Hangi nitelendirme benimsenirse benimsensin uzlaştırmaya tabi olduğu dosyadan açıkça anlaşılan bu işte ' +
        'uzlaştırma uygulanmadan düzenlenen iddianame, verildiği tarihten itibaren on beş gün içinde eksiklik gösterilerek iade ' +
        'edilir (CMK m.174/1-c). Mahkeme ise suçun nitelendirilmesine ilişkin görüşünü iade sebebi yapamaz (CMK m.174/2). ' +
        'Süresinde iade edilmeyen iddianame kabul edilmiş sayılır ve kamu davası açılmış olur (CMK m.174/3, m.175/1).',
      sonuc: 'Uzlaştırma atlanmışsa iddianame on beş gün içinde iade edilir; mahkemenin farklı nitelendirmesi iade sebebi değildir.',
      dayanaklar: [
        { kanun: 'cmk', madde: '253', ifade: 'Şikâyete bağlı olup olmadığına bakılmaksızın' },
        { kanun: 'cmk', madde: '253', ifade: 'Güveni kötüye kullanma (üçüncü fıkra hariç, madde 155)' },
        { kanun: 'tck', madde: '155', ifade: 'zilyedliğin devri amacı dışında tasarrufta bulunan' },
        { kanun: 'cmk', madde: '174', ifade: 'uzlaştırma ya da seri muhakeme usulü uygulanmaksızın düzenlenen' },
        { kanun: 'cmk', madde: '174', ifade: 'Suçun hukukî nitelendirilmesi sebebiyle iddianame iade edilemez' },
        { kanun: 'cmk', madde: '174', ifade: 'iade edilmeyen iddianame kabul edilmiş sayılır' },
      ],
    },
  ],
  sinavIskeleti: [
    {
      adim: 'Evrenin belirlenmesi',
      aciklama: 'İşlemin soruşturma mı kovuşturma mı evresinde yapıldığı ve yetkili makamın kim olduğu belirlenir.',
    },
    {
      adim: 'Koruma tedbiri',
      aciklama: 'Yakalama, gözaltı, tutuklama ya da adli kontrolün koşulları, süresi ve ölçülülüğü olaya uygulanır.',
    },
    {
      adim: 'Şüphelinin hakları',
      aciklama: 'Haklarının bildirilmesi, müdafi yardımı ve susma hakkı ile ifadenin alınma biçimi denetlenir.',
    },
    {
      adim: 'Delilin hukuka uygunluğu',
      aciklama: 'Delilin yasak usulle elde edilip edilmediği ve duruşmada tartışılıp tartışılmadığı incelenir.',
    },
    {
      adim: 'Soruşturma sonu kararı',
      aciklama: 'Yeterli şüphe, kovuşturmaya yer olmadığı, kamu davasının ertelenmesi, uzlaştırma ve iddianamenin iadesi sırayla değerlendirilir.',
    },
    {
      adim: 'Hüküm ve kanun yolu',
      aciklama: 'Hükmün türü belirlenir, itiraz, istinaf ya da temyiz yolunun açık olup olmadığı ve süresi hesaplanır.',
    },
  ],
  tuzakDefteri: [
    {
      tuzak: 'Hâkim dosyadaki her belgeye dayanarak hüküm kurabilir.',
      dogrusu: 'Hâkim kararını yalnız duruşmaya getirilmiş ve huzurunda tartışılmış delillere dayandırabilir.',
      dayanak: { kanun: 'cmk', madde: '217', ifade: 'duruşmaya getirilmiş ve huzurunda tartışılmış delillere' },
    },
    {
      tuzak: 'Cumhuriyet savcısı yalnız şüphelinin aleyhine olan delilleri toplar.',
      dogrusu: 'Cumhuriyet savcısı şüphelinin lehine ve aleyhine olan delilleri toplamak ve haklarını korumakla yükümlüdür.',
      dayanak: { kanun: 'cmk', madde: '160', ifade: 'şüphelinin lehine ve aleyhine olan delilleri toplayarak' },
    },
    {
      tuzak: 'Kovuşturmaya yer olmadığı kararından sonra aynı fiil için her zaman yeniden dava açılabilir.',
      dogrusu: 'Yeni delil elde edilmedikçe ve sulh ceza hâkimliği bu yönde karar vermedikçe aynı fiilden dolayı kamu davası açılamaz.',
      dayanak: { kanun: 'cmk', madde: '172', ifade: 'aynı fiilden dolayı kamu davası açılamaz' },
    },
    {
      tuzak: 'Çocuk şüpheliye müdafi ancak kendisi isterse atanır.',
      dogrusu: 'Müdafii bulunmayan çocuk şüpheliye istemi aranmaksızın müdafi görevlendirilir.',
      dayanak: { kanun: 'cmk', madde: '150', ifade: 'istemi aranmaksızın bir müdafi görevlendirilir' },
    },
    {
      tuzak: 'Tutuklama istemi reddedilen şüpheli, itiraz sonuçlanıncaya kadar gözaltında tutulur.',
      dogrusu: 'Tutuklama kararı verilmezse şüpheli ya da sanık beklemeksizin, derhâl serbest bırakılır.',
      dayanak: { kanun: 'cmk', madde: '101', ifade: 'Tutuklama kararı verilmezse, şüpheli veya sanık derhâl serbest bırakılır' },
    },
    {
      tuzak: 'Delil yetersizse beraat kararı verilemez, dosya yeni delil gelene kadar bekletilir.',
      dogrusu: 'Yüklenen suçun sanık tarafından işlendiğinin sabit olmaması beraat sebebidir.',
      dayanak: { kanun: 'cmk', madde: '223', ifade: 'Yüklenen suçun sanık tarafından işlendiğinin sabit olmaması' },
    },
  ],
  kisaTest: [
    {
      q: 'Bireysel suçta gözaltı süresi, hâkime gönderilme için zorunlu süre hariç, en çok ne kadardır?',
      choices: ['Yirmi dört saat', 'Kırk sekiz saat', 'Üç gün', 'Dört gün'],
      answer: 0,
      reason: 'CMK m.91/1 gözaltı süresinin yakalama anından itibaren yirmi dört saati geçemeyeceğini öngörür; uzatma toplu suçlara özgüdür.',
      dayanak: { kanun: 'cmk', madde: '91', ifade: 'yakalama anından itibaren yirmidört saati geçemez' },
    },
    {
      q: 'Ağır ceza mahkemesinin görevine girmeyen işlerde tutukluluk süresi, uzatma hariç, en çok ne kadardır?',
      choices: ['Altı ay', 'Bir yıl', 'İki yıl', 'Üç yıl'],
      answer: 1,
      reason: 'CMK m.102/1 bu işlerde tutukluluğun en çok bir yıl olduğunu, zorunlu hâllerde altı ay uzatılabileceğini öngörür.',
      dayanak: { kanun: 'cmk', madde: '102', ifade: 'Ağır ceza mahkemesinin görevine girmeyen işlerde tutukluluk süresi en çok bir yıldır' },
    },
    {
      q: 'İstinaf istemi, hükmün gerekçesiyle birlikte tebliğinden itibaren hangi süre içinde yapılır?',
      choices: ['Yedi gün', 'İki hafta', 'Bir ay', 'Üç ay'],
      answer: 1,
      reason: 'CMK m.273/1 istinaf isteminin gerekçeli hükmün tebliğinden itibaren iki hafta içinde yapılacağını öngörür.',
      dayanak: { kanun: 'cmk', madde: '273', ifade: 'tebliğ edildiği tarihten itibaren iki hafta içinde' },
    },
    {
      q: 'Kamu davasının açılmasının ertelenmesine karar verilirse erteleme süresi ne kadardır?',
      choices: ['Bir yıl', 'Üç yıl', 'Beş yıl', 'On yıl'],
      answer: 2,
      reason: 'CMK m.171/2 Cumhuriyet savcısının kamu davasının açılmasını beş yıl süreyle erteleyebileceğini öngörür.',
      dayanak: { kanun: 'cmk', madde: '171', ifade: 'beş yıl süre ile ertelenmesine karar verebilir' },
    },
    {
      q: 'Aşağıdakilerden hangisinde temyizde hukuka kesin aykırılık var sayılır?',
      choices: ['Hükmün gerekçeyi içermemesi', 'Duruşmanın bir kez ertelenmesi', 'Tanığın ikinci celsede dinlenmesi', 'Bilirkişi raporunun geç verilmesi'],
      answer: 0,
      reason: 'CMK m.289/1-g hükmün gerekçeyi içermemesini, dilekçede gösterilmese de hukuka kesin aykırılık sayar.',
      dayanak: { kanun: 'cmk', madde: '289', ifade: 'Hükmün 230 uncu madde gereğince gerekçeyi içermemesi' },
    },
    {
      q: 'Hâkim veya mahkeme kararına karşı itiraz, kanunda ayrık hüküm yoksa hangi süre içinde yapılır?',
      choices: ['Üç gün', 'Yedi gün', 'İki hafta', 'Bir ay'],
      answer: 2,
      reason: 'CMK m.268/1 itirazın kararın öğrenildiği günden itibaren iki hafta içinde yapılacağını öngörür.',
      dayanak: { kanun: 'cmk', madde: '268', ifade: 'kararı öğrendiği günden itibaren iki hafta içinde' },
    },
  ],
  kaynaklar: [
    {
      title: '5271 sayılı Ceza Muhakemesi Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.5271.pdf',
      note: 'Örnek olay, tuzak ve test dayanaklarının resmî metni',
    },
  ],
};

export default katman;
