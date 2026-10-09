/**
 * Şirketler Hukuku — kanonik katman (G19). Dayanaklar 6102 sayılı Türk Ticaret Kanunu metnine bağlıdır (`content/mevzuat/ttk`).
 * Olaylar kurmacadır; kişi, tarih ve tutar örnek içindir. Asgari sermaye tutarları ayrıca değiştirilebildiğinden yazılmamıştır.
 */
const katman = {
  ders: 'ticaret-sirketler',
  temsilci: { uni: 'ankara', ders: 'ticaret-sirketler-yillik' },
  guncelleme: '2026-10-09',
  ornekOlaylar: [
    {
      baslik: 'Tescilden önce şirket adına kiralanan depo',
      olay:
        'Üç kurucu, kuracakları anonim şirketin esas sözleşmesini imzaladıktan sonra, şirket henüz ticaret siciline tescil edilmeden ' +
        '“kurulmakta olan şirket adına” bir depo kiralamıştır. Şirket 1 Nisan’da tescil edilmiş, yönetim kurulu kira sözleşmesini ' +
        'kabul edip etmeme konusunda karar almamıştır. Kiraya veren, ödenmeyen kira bedelleri için kuruculara başvurmaktadır.',
      cozum:
        'Esas sözleşme yazılı yapılır ve kurucuların imzaları noterce onaylanır ya da sözleşme ticaret sicili müdürü veya yardımcısı ' +
        'huzurunda imzalanır (Türk Ticaret Kanunu (TTK) m.339/1). Şirket ancak ticaret siciline tescil ile tüzel kişilik kazanır ' +
        '(TTK m.355/1). Tescilden önce şirket adına işlem yapanlar bu işlemlerden şahsen ve müteselsilen sorumludur. İşlemin ileride ' +
        'kurulacak şirket adına yapıldığı açıkça bildirilmiş ve şirket tescilden sonra üç ay içinde taahhüdü kabul etmişse yalnız şirket ' +
        'sorumlu olur (TTK m.355/2). Kira sözleşmesinde bildirim yapılmıştır, ne var ki şirket 1 Temmuz’a kadar kabul kararı almazsa ' +
        'kurucuların şahsi ve müteselsil sorumluluğu devam eder. Kabul olunmayan kuruluş giderlerini kurucular karşılar ve pay ' +
        'sahiplerine rücu edemez (TTK m.355/3).',
      sonuc: 'Tescil öncesi işlemden kurucular müteselsilen sorumludur; şirketin üç ay içindeki kabulü sorumluluğu şirkete geçirir.',
      dayanaklar: [
        { kanun: 'ttk', madde: '339', ifade: 'bütün kurucuların imzalarının noterce onaylanması' },
        { kanun: 'ttk', madde: '355', ifade: 'şirket ticaret siciline tescil ile tüzel kişilik kazanır' },
        { kanun: 'ttk', madde: '355', ifade: 'üç aylık süre içinde bu taahhütler şirket tarafından kabul olunmuşsa, yalnız şirket sorumlu olur' },
      ],
    },
    {
      baslik: 'Genel kurul kararına geç açılan iptal davası ve bilgi alma hakkı',
      olay:
        'Bir anonim şirketin 1 Mart’taki genel kurulunda yönetim kurulu üyeleri ibra edilmiş, ayrıca pay sahiplerinin şirket defterlerini ' +
        'incelemesini tamamen yasaklayan bir karar alınmıştır. Yüzde beş pay sahibi Nazlı toplantıda olumsuz oy vermiş, ancak ' +
        'muhalefetini tutanağa geçirtmemiştir. Nazlı 15 Haziran’da iki karara karşı birlikte dava açmıştır.',
      cozum:
        'Kanuna, esas sözleşmeye ve dürüstlük kuralına aykırı genel kurul kararlarına karşı iptal davası karar tarihinden itibaren üç ay ' +
        'içinde şirket merkezindeki asliye ticaret mahkemesinde açılır (TTK m.445). Toplantıda bulunan pay sahibinin dava açabilmesi ' +
        'için olumsuz oy vermesi ve muhalefetini tutanağa geçirtmesi gerekir (TTK m.446/1-a). İbra kararı yönünden üç aylık süre 1 Haziran’da ' +
        'dolmuştur ve Nazlı muhalefetini tutanağa geçirtmemiştir. Bu kararın iptali istenemez. Defter incelemesini tamamen yasaklayan ' +
        'karar ise pay sahibinin bilgi alma, inceleme ve denetleme haklarını kanunen izin verilen ölçü dışında sınırlandırdığından ' +
        'batıldır (TTK m.447/1-b). Kanun butlan hâlleri için m.445’teki gibi bir dava süresi öngörmediğinden Nazlı bu kararın butlanının ' +
        'tespitini isteyebilir.',
      sonuc: 'İptal davası üç ay ve tutanağa geçirilmiş muhalefet ister; pay sahibinin vazgeçilmez haklarını ortadan kaldıran karar batıldır.',
      dayanaklar: [
        { kanun: 'ttk', madde: '445', ifade: 'karar tarihinden itibaren üç ay içinde' },
        { kanun: 'ttk', madde: '446', ifade: 'karara olumsuz oy veren ve bu muhalefetini tutanağa geçirten' },
        { kanun: 'ttk', madde: '447', ifade: 'bilgi alma, inceleme ve denetleme haklarını, kanunen izin verilen ölçü dışında sınırlandıran' },
      ],
    },
    {
      baslik: 'Adi yazılı sözleşmeyle devredilen limited şirket payı',
      olay:
        'İki ortaklı bir limited şirketin ortağı Barış, esas sermaye payını kardeşi Deniz’e adi yazılı bir sözleşmeyle devretmiş ve ' +
        'bedeli almıştır. Şirket sözleşmesinde pay devrine ilişkin özel bir hüküm bulunmamakta, diğer ortak ise devre onay ' +
        'vermemektedir. Deniz ortaklar defterine kaydedilmesini istemektedir.',
      cozum:
        'Esas sermaye payının devri ve devir borcunu doğuran işlemler yazılı yapılır ve tarafların imzaları noterce onanır ' +
        '(TTK m.595/1). Barış ile Deniz arasındaki sözleşme noter onayı taşımadığından şekil koşulunu karşılamamaktadır. Şirket ' +
        'sözleşmesinde aksi öngörülmemişse devir için ortaklar genel kurulunun onayı da şarttır ve devir bu onayla geçerli olur ' +
        '(TTK m.595/2). Pay devirlerinin onaylanması genel kurulun devredilemez yetkilerindendir (TTK m.616/1-g). Şekil eksikliği ve ' +
        'onayın yokluğu nedeniyle Deniz ortak sıfatını kazanmamıştır, Barış ise aldığı bedeli sebepsiz zenginleşme hükümleriyle iade ' +
        'yükümlülüğü altındadır (Türk Borçlar Kanunu m.77).',
      sonuc: 'Limited şirkette pay devri yazılı ve noter onaylı imza ile yapılır, sözleşmede aksi yoksa genel kurul onayıyla geçerli olur.',
      dayanaklar: [
        { kanun: 'ttk', madde: '595', ifade: 'yazılı şekilde yapılır ve tarafların imzaları noterce onanır' },
        { kanun: 'ttk', madde: '595', ifade: 'devir bu onayla geçerli olur' },
        { kanun: 'ttk', madde: '616', ifade: 'esas sermaye paylarının devirlerinin onaylanması' },
        { kanun: 'tbk', madde: '77', ifade: 'haklı bir sebep olmaksızın, bir başkasının malvarlığından veya emeğinden zenginleşen' },
      ],
    },
  ],
  sinavIskeleti: [
    {
      adim: 'Şirket türü',
      aciklama: 'Şirketin şahıs mı sermaye şirketi mi olduğu ve hangi türe girdiği belirlenir; sorumluluk rejimi buna göre seçilir.',
    },
    {
      adim: 'Kuruluş ve tüzel kişilik',
      aciklama: 'Esas sözleşmenin şekli, sermaye taahhüdü, tescil tarihi ve tescil öncesi işlemlerin sorumluluğu incelenir.',
    },
    {
      adim: 'Organ ve yetki',
      aciklama: 'İşlemi yapan organın yetkisi, toplantı ve karar yeter sayıları, devredilemez yetkiler denetlenir.',
    },
    {
      adim: 'Kararın sakatlığı',
      aciklama: 'İptal edilebilirlik ile butlan ayrılır; dava açabilecek kişi, süre ve görevli mahkeme yazılır.',
    },
    {
      adim: 'Pay ve ortaklık hakları',
      aciklama: 'Pay devrinin şekli ve onayı, bilgi alma ve inceleme hakları olayın tarafları yönünden ayrı ayrı uygulanır.',
    },
    {
      adim: 'Sorumluluk',
      aciklama: 'Şirketin, ortakların ve yöneticilerin kime karşı ve hangi ölçüde sorumlu olduğu sonuç olarak yazılır.',
    },
  ],
  tuzakDefteri: [
    {
      tuzak: 'Adi ortaklık bir ticaret şirketidir.',
      dogrusu: 'Ticaret şirketleri kollektif, komandit, anonim, limited ve kooperatif şirketlerden ibarettir.',
      dayanak: { kanun: 'ttk', madde: '124', ifade: 'kollektif, komandit, anonim, limited ve kooperatif şirketlerden ibarettir' },
    },
    {
      tuzak: 'Anonim şirket pay sahibi şirket borçlarından alacaklılara karşı kişisel olarak sorumludur.',
      dogrusu: 'Şirket borçlarından yalnız malvarlığıyla sorumludur; pay sahipleri yalnız taahhüt ettikleri sermaye payıyla ve şirkete karşı sorumludur.',
      dayanak: { kanun: 'ttk', madde: '329', ifade: 'sadece taahhüt etmiş oldukları sermaye payları ile ve şirkete karşı sorumludur' },
    },
    {
      tuzak: 'Limited şirket ortakları şirket borçlarından sınırsız sorumludur.',
      dogrusu: 'TTK’ya göre ortaklar şirket borçlarından sorumlu olmayıp yalnız sermaye payını ödemek ve öngörülmüşse ek ödeme ile yan edimleri yerine getirmekle yükümlüdür; kamu alacaklarına ilişkin özel kanun hükümleri ayrıca incelenir.',
      dayanak: { kanun: 'ttk', madde: '573', ifade: 'ortaklar, şirket borçlarından sorumlu olmayıp' },
    },
    {
      tuzak: 'Yönetim kurulu üyesi toplantıya vekil göndererek oy kullanabilir.',
      dogrusu: 'Yönetim kurulu üyeleri birbirlerini temsilen oy veremez ve toplantılara vekil aracılığıyla katılamaz.',
      dayanak: { kanun: 'ttk', madde: '390', ifade: 'toplantılara vekil aracılığıyla da katılamazlar' },
    },
    {
      tuzak: 'Genel kurul yönetim kurulu üyelerinin seçimini yönetim kuruluna bırakabilir.',
      dogrusu: 'Yönetim kurulu üyelerinin seçimi ve görevden alınması genel kurulun devredilemez yetkilerindendir.',
      dayanak: { kanun: 'ttk', madde: '408', ifade: 'yönetim kurulu üyelerinin seçimi' },
    },
    {
      tuzak: 'Genel kurul kararlarının iptali davası bir yıl içinde açılır.',
      dogrusu: 'İptal davası karar tarihinden itibaren üç ay içinde açılır.',
      dayanak: { kanun: 'ttk', madde: '445', ifade: 'karar tarihinden itibaren üç ay içinde' },
    },
  ],
  kisaTest: [
    {
      q: 'TTK’ya göre aşağıdakilerden hangisi sermaye şirketidir?',
      choices: ['Kollektif şirket', 'Adi komandit şirket', 'Limited şirket', 'Adi ortaklık'],
      answer: 2,
      reason: 'TTK m.124/2 anonim, limited ve sermayesi paylara bölünmüş komandit şirketi sermaye şirketi sayar.',
      dayanak: { kanun: 'ttk', madde: '124', ifade: 'anonim, limited ve sermayesi paylara bölünmüş komandit şirket sermaye şirketi sayılır' },
    },
    {
      q: 'Anonim şirket tüzel kişiliği ne zaman kazanır?',
      choices: [
        'Esas sözleşmenin imzalanmasıyla',
        'Sermayenin tamamının ödenmesiyle',
        'Ticaret siciline tescil ile',
        'İlk genel kurul toplantısıyla',
      ],
      answer: 2,
      reason: 'TTK m.355/1 şirketin ticaret siciline tescil ile tüzel kişilik kazanacağını öngörür.',
      dayanak: { kanun: 'ttk', madde: '355', ifade: 'şirket ticaret siciline tescil ile tüzel kişilik kazanır' },
    },
    {
      q: 'Esas sözleşmede ağırlaştırıcı hüküm yoksa anonim şirket yönetim kurulu nasıl toplanır ve karar alır?',
      choices: [
        'Üye tam sayısının çoğunluğuyla toplanır, hazır bulunanların çoğunluğuyla karar alır.',
        'Bütün üyelerle toplanır, oybirliğiyle karar alır.',
        'Üçte iki çoğunlukla toplanır, salt çoğunlukla karar alır.',
        'Toplantı nisabı aranmaz, başkanın oyu belirleyicidir.',
      ],
      answer: 0,
      reason: 'TTK m.390/1 üye tam sayısının çoğunluğuyla toplanmayı ve hazır bulunanların çoğunluğuyla karar almayı öngörür.',
      dayanak: { kanun: 'ttk', madde: '390', ifade: 'üye tam sayısının çoğunluğu ile toplanır ve kararlarını toplantıda hazır bulunan üyelerin çoğunluğu ile alır' },
    },
    {
      q: 'Limited şirkette yönetim ve temsil hakkında hangisi doğrudur?',
      choices: [
        'Yönetim yalnız üçüncü kişilere bırakılabilir.',
        'En azından bir ortağın yönetim hakkı ve temsil yetkisi bulunmalıdır.',
        'Yönetim zorunlu olarak bütün ortaklara aittir.',
        'Temsil yetkisi yalnız genel kurula aittir.',
      ],
      answer: 1,
      reason: 'TTK m.623/1 en azından bir ortağın şirketi yönetim hakkının ve temsil yetkisinin bulunmasını şart koşar.',
      dayanak: { kanun: 'ttk', madde: '623', ifade: 'en azından bir ortağın, şirketi yönetim hakkının ve temsil yetkisinin bulunması gerekir' },
    },
    {
      q: 'Yönetim kurulunda oyların eşit çıkması hâlinde ne olur?',
      choices: [
        'Başkanın oyu üstün sayılır.',
        'Konu gelecek toplantıya bırakılır; orada da eşitlik olursa öneri reddedilmiş sayılır.',
        'Karar genel kurula bırakılır.',
        'Öneri kabul edilmiş sayılır.',
      ],
      answer: 1,
      reason: 'TTK m.390/3 eşitlikte konunun gelecek toplantıya bırakılmasını ve ikinci eşitlikte önerinin reddedilmiş sayılmasını öngörür.',
      dayanak: { kanun: 'ttk', madde: '390', ifade: 'ikinci toplantıda da eşitlik olursa söz konusu öneri reddedilmiş sayılır' },
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
