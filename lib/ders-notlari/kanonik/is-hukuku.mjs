/**
 * İş Hukuku — kanonik katman (G19). Dayanaklar 4857 sayılı İş Kanunu ve kıdem tazminatı için yürürlükteki 1475 sayılı İş Kanunu
 * m.14 metnine bağlıdır (`content/mevzuat/is-kanunu`, `content/mevzuat/is-kanunu-1475`). Olaylar kurmacadır; kişi, tarih ve tutar
 * örnek içindir. Kıdem tazminatı tavanı her dönem ayrıca ilan edildiğinden tutar olarak yazılmamıştır.
 */
const katman = {
  ders: 'is-hukuku',
  temsilci: { uni: 'ankara', ders: 'is-hukuku-yillik' },
  guncelleme: '2026-10-09',
  ornekOlaylar: [
    {
      baslik: 'Savunma alınmadan performans gerekçesiyle fesih',
      olay:
        'Kırk işçinin çalıştığı bir lojistik firmasında iki yıldır belirsiz süreli sözleşmeyle çalışan Emre’ye 3 Mart’ta “performansınız ' +
        'beklentileri karşılamamaktadır” yazılı bir fesih bildirimi tebliğ edilmiştir. Bildirimde hangi işte, hangi dönemde düşük ' +
        'performans görüldüğü yazılmamış, Emre’nin savunması da alınmamıştır.',
      cozum:
        'Otuz veya daha fazla işçi çalıştıran işyerinde en az altı aylık kıdemi olan işçinin belirsiz süreli sözleşmesini fesheden ' +
        'işveren geçerli bir sebebe dayanmak zorundadır (İş Kanunu (İş K.) m.18/1). Emre bu koşulları taşıdığından iş güvencesinden ' +
        'yararlanır. İşveren fesih sebebini yazılı olarak, açık ve kesin biçimde belirtmek zorundadır ve işçinin davranışı ya da verimi ' +
        'ile ilgili nedenlerle savunması alınmadan sözleşme feshedilemez (İş K. m.19). Belirsiz performans gerekçesi ve savunma ' +
        'alınmaması feshi geçersiz kılar. Emre fesih bildiriminin tebliğinden itibaren bir ay içinde işe iade talebiyle arabulucuya ' +
        'başvurmak zorundadır, anlaşma olmazsa son tutanaktan itibaren iki hafta içinde iş mahkemesinde dava açar (İş K. m.20/1). ' +
        'Feshin geçersizliğine karar verilir ve işveren başvuru üzerine Emre’yi bir ay içinde işe başlatmazsa en az dört, en çok sekiz ' +
        'aylık ücret tutarında tazminat öder, boşta geçen süre için de en çok dört aylık ücret ve diğer haklar ödenir (İş K. m.21).',
      sonuc: 'İş güvencesinde fesih sebebi yazılı, açık ve kesin olmalıdır; verim ve davranış nedenli fesihten önce savunma alınır.',
      dayanaklar: [
        { kanun: 'is-kanunu', madde: '18', ifade: 'otuz veya daha fazla işçi çalıştıran işyerlerinde en az altı aylık kıdemi olan işçinin' },
        { kanun: 'is-kanunu', madde: '19', ifade: 'fesih sebebini açık ve kesin bir şekilde belirtmek zorundadır' },
        { kanun: 'is-kanunu', madde: '20', ifade: 'fesih bildiriminin tebliği tarihinden itibaren bir ay içinde işe iade talebiyle' },
        { kanun: 'is-kanunu', madde: '21', ifade: 'en az dört aylık ve en çok sekiz aylık ücreti tutarında tazminat' },
      ],
    },
    {
      baslik: 'Kasadan para alan işçinin geç feshedilen sözleşmesi',
      olay:
        'Bir mağazada beş yıldır çalışan kasiyer Sevgi’nin kasadan 18.000 TL aldığı, işverenin 2 Mayıs’ta incelediği kamera kayıtlarıyla ' +
        'ortaya çıkmıştır. İşveren sözleşmeyi 20 Mayıs’ta, aradan on iki iş günü geçtikten sonra, ahlak ve iyiniyet kurallarına aykırılık ' +
        'gerekçesiyle bildirimsiz feshetmiştir. Sevgi bildirim ve kıdem tazminatı istemektedir.',
      cozum:
        'İşçinin hırsızlık yapması ve işverenin güvenini kötüye kullanması, işverene bildirim süresini beklemeksizin fesih hakkı veren ' +
        'ahlak ve iyiniyet kurallarına aykırı hâllerdendir (İş K. m.25/II-e). Bu yetki, işverenin davranışı öğrendiği günden başlayarak ' +
        'altı iş günü geçtikten sonra kullanılamaz (İş K. m.26/1). İşçinin maddi çıkar sağlaması yalnız fiilden itibaren işleyen bir ' +
        'yıllık üst sınırı ortadan kaldırır, altı iş günlük süreyi kaldırmaz. İşveren 2 Mayıs’ta öğrendiği hâlde on iki iş günü sonra ' +
        'feshettiğinden haklı nedenle derhal fesih yetkisi düşmüştür. Bu durumda fesih bildirimsiz bir fesih olarak sonuç doğurur ve ' +
        'işveren beş yılı aşan kıdem için öngörülen sekiz haftalık bildirim süresine ilişkin ücret tutarında tazminat öder (İş K. m.17). ' +
        'Kıdem tazminatı yönünden ise işçinin her tam hizmet yılı için otuz günlük ücreti esas alınır (1475 sayılı Kanun m.14).',
      sonuc: 'Haklı nedenle derhal fesih öğrenmeden itibaren altı iş günü içinde yapılmalıdır; süre kaçarsa işveren bildirim ve kıdem yükünü taşır.',
      dayanaklar: [
        { kanun: 'is-kanunu', madde: '25', ifade: 'işverenin güvenini kötüye kullanmak, hırsızlık yapmak' },
        { kanun: 'is-kanunu', madde: '26', ifade: 'diğer tarafın öğrendiği günden başlayarak altı iş günü geçtikten' },
        { kanun: 'is-kanunu', madde: '26', ifade: 'işçinin olayda maddi çıkar sağlaması halinde bir yıllık süre uygulanmaz' },
        { kanun: 'is-kanunu', madde: '17', ifade: 'işi üç yıldan fazla sürmüş işçi için, bildirim yapılmasından başlayarak sekiz hafta sonra' },
        { kanun: 'is-kanunu-1475', madde: '14', ifade: 'her geçen tam yıl için işverence işçiye 30 günlük ücreti tutarında kıdem tazminatı ödenir' },
      ],
    },
    {
      baslik: 'Ödenmeyen ücret ve fazla çalışma',
      olay:
        'Bir atölyede çalışan Hakan’a ayın 1’inde ödenmesi gereken ücreti 25 gündür ödenmemiştir. Hakan son iki ayda haftada 52 saat ' +
        'çalışmış, kendisine fazla çalışma ücreti verilmemiştir. Hakan iş görmekten kaçınmaya başlamış, işveren de bunun üzerine ' +
        '“devamsızlık” gerekçesiyle sözleşmeyi feshedeceğini bildirmiştir.',
      cozum:
        'Ücreti ödeme gününden itibaren yirmi gün içinde mücbir bir neden dışında ödenmeyen işçi iş görme borcunu yerine getirmekten ' +
        'kaçınabilir ve bu nedenle iş sözleşmesi feshedilemez (İş K. m.34). Hakan’ın çalışmaması devamsızlık sayılamaz. Fazla çalışma ' +
        'haftalık kırk beş saati aşan çalışmadır ve her saati normal saat ücretinin yüzde elli yükseltilmesiyle ödenir (İş K. m.41). ' +
        'Hakan’ın haftalık yedi saatlik fazla çalışması bu oranla hesaplanır. Hakan ayrıca ücretin kanun ve sözleşmeye uygun ödenmemesi ' +
        'gerekçesiyle sözleşmeyi bildirim süresini beklemeden haklı nedenle feshedebilir (İş K. m.24/II-e), gününde ödenmeyen ücret için ' +
        'de mevduata uygulanan en yüksek faiz istenir.',
      sonuc: 'Yirmi gün ödenmeyen ücret işçiye çalışmaktan kaçınma hakkı verir; bu kaçınma devamsızlık sayılmaz ve fesih sebebi olamaz.',
      dayanaklar: [
        { kanun: 'is-kanunu', madde: '34', ifade: 'ücreti ödeme gününden itibaren yirmi gün içinde mücbir bir neden dışında ödenmeyen işçi' },
        { kanun: 'is-kanunu', madde: '41', ifade: 'normal çalışma ücretinin saat başına düşen miktarının yüzde elli yükseltilmesi suretiyle ödenir' },
        { kanun: 'is-kanunu', madde: '24', ifade: 'işçinin ücreti kanun hükümleri veya sözleşme şartlarına uygun olarak hesap edilmez veya ödenmezse' },
      ],
    },
  ],
  sinavIskeleti: [
    {
      adim: 'Kapsam ve taraflar',
      aciklama: 'Kişinin işçi, karşı tarafın işveren sayılıp sayılmadığı ve sözleşmenin belirli ya da belirsiz süreli olduğu yazılır.',
    },
    {
      adim: 'Feshin türü',
      aciklama: 'Bildirimli fesih, geçerli sebeple fesih ve haklı nedenle derhal fesih birbirinden ayrılır; fesih tarafı ve tarihi belirtilir.',
    },
    {
      adim: 'Usul ve süreler',
      aciklama: 'Yazılılık, savunma alma, altı iş günlük hak düşürücü süre ve bildirim süreleri olayın tarihleriyle hesaplanır.',
    },
    {
      adim: 'İş güvencesi',
      aciklama: 'Otuz işçi, altı ay kıdem ve belirsiz süre koşulları denetlenir; işe iade için arabuluculuk ve dava süreleri yazılır.',
    },
    {
      adim: 'Alacaklar',
      aciklama: 'Bildirim tazminatı, kıdem tazminatı, ücret, fazla çalışma ve izin alacakları dayanak maddeleriyle ayrı ayrı hesaplanır.',
    },
    {
      adim: 'Sonuç',
      aciklama: 'Kimin hangi alacağı, hangi süre içinde ve hangi yolla isteyebileceği tek paragrafta toplanır.',
    },
  ],
  tuzakDefteri: [
    {
      tuzak: 'İşe iade davası fesihten sonra doğrudan iş mahkemesinde açılır.',
      dogrusu: 'İşçi önce fesih bildiriminin tebliğinden itibaren bir ay içinde arabulucuya başvurmak zorundadır.',
      dayanak: { kanun: 'is-kanunu', madde: '20', ifade: 'arabulucuya başvurmak zorundadır' },
    },
    {
      tuzak: 'Her işyerinde çalışan her işçi iş güvencesinden yararlanır.',
      dogrusu: 'İş güvencesi otuz veya daha fazla işçi çalıştıran işyerinde en az altı aylık kıdemi olan, belirsiz süreli sözleşmeli işçiyi kapsar.',
      dayanak: { kanun: 'is-kanunu', madde: '18', ifade: 'belirsiz süreli iş sözleşmesini fesheden işveren' },
    },
    {
      tuzak: 'İki yıllık belirli süreli iş sözleşmesi sözlü yapılabilir.',
      dogrusu: 'Süresi bir yıl ve daha fazla olan iş sözleşmelerinin yazılı şekilde yapılması zorunludur.',
      dayanak: { kanun: 'is-kanunu', madde: '8', ifade: 'süresi bir yıl ve daha fazla olan iş sözleşmelerinin yazılı şekilde yapılması zorunludur' },
    },
    {
      tuzak: 'Haftalık normal çalışma süresi en çok kırk sekiz saattir.',
      dogrusu: 'Genel bakımdan çalışma süresi haftada en çok kırk beş saattir.',
      dayanak: { kanun: 'is-kanunu', madde: '63', ifade: 'genel bakımdan çalışma süresi haftada en çok kırkbeş saattir' },
    },
    {
      tuzak: 'İşçi yıllık ücretli izin hakkından yazılı olarak vazgeçebilir.',
      dogrusu: 'Yıllık ücretli izin hakkından vazgeçilemez.',
      dayanak: { kanun: 'is-kanunu', madde: '53', ifade: 'yıllık ücretli izin hakkından vazgeçilemez' },
    },
    {
      tuzak: 'Fazla çalışmanın her saati normal ücretin yüzde yirmi beş fazlasıyla ödenir.',
      dogrusu: 'Haftalık kırk beş saati aşan fazla çalışmanın her saati yüzde elli yükseltilmiş ücretle ödenir.',
      dayanak: { kanun: 'is-kanunu', madde: '41', ifade: 'yüzde elli yükseltilmesi suretiyle ödenir' },
    },
  ],
  kisaTest: [
    {
      q: 'Kıdemi bir buçuk yıldan üç yıla kadar olan işçinin belirsiz süreli sözleşmesi bildirimden kaç hafta sonra sona erer?',
      choices: ['İki hafta', 'Dört hafta', 'Altı hafta', 'Sekiz hafta'],
      answer: 2,
      reason: 'İş K. m.17/2-c bir buçuk yıldan üç yıla kadar kıdemde bildirim süresini altı hafta olarak belirler.',
      dayanak: { kanun: 'is-kanunu', madde: '17', ifade: 'işi birbuçuk yıldan üç yıla kadar sürmüş olan işçi için, bildirimin diğer tarafa yapılmasından başlayarak altı hafta sonra' },
    },
    {
      q: 'Feshin geçersizliğine karar verilen işçiyi işveren işe başlatmazsa ödeyeceği tazminat ne kadardır?',
      choices: [
        'En az iki, en çok dört aylık ücret',
        'En az dört, en çok sekiz aylık ücret',
        'Her tam yıl için otuz günlük ücret',
        'Bildirim süresine ilişkin ücret',
      ],
      answer: 1,
      reason: 'İş K. m.21/1 işe başlatmama tazminatını en az dört, en çok sekiz aylık ücret olarak belirler.',
      dayanak: { kanun: 'is-kanunu', madde: '21', ifade: 'en az dört aylık ve en çok sekiz aylık ücreti tutarında tazminat' },
    },
    {
      q: 'Ahlak ve iyiniyet kurallarına aykırılığa dayanan derhal fesih hakkı hangi süre geçince kullanılamaz?',
      choices: [
        'Öğrenmeden başlayarak altı iş günü ve her hâlde fiilden itibaren bir yıl',
        'Öğrenmeden başlayarak bir ay',
        'Fiilden başlayarak altı ay',
        'Süreye bağlı değildir',
      ],
      answer: 0,
      reason: 'İş K. m.26/1 altı iş günlük ve fiilden itibaren bir yıllık süreleri öngörür.',
      dayanak: { kanun: 'is-kanunu', madde: '26', ifade: 'her halde fiilin gerçekleşmesinden itibaren bir yıl sonra kullanılamaz' },
    },
    {
      q: 'Hizmet süresi üç yıl olan işçinin yıllık ücretli izni en az kaç gündür?',
      choices: ['On gün', 'On dört gün', 'Yirmi gün', 'Yirmi altı gün'],
      answer: 1,
      reason: 'İş K. m.53/3-a bir yıldan beş yıla kadar hizmet süresinde izni on dört günden az olamaz kabul eder.',
      dayanak: { kanun: 'is-kanunu', madde: '53', ifade: 'bir yıldan beş yıla kadar (beş yıl dahil) olanlara ondört günden' },
    },
    {
      q: 'İş Kanunu’na göre işçi kimdir?',
      choices: [
        'Bir iş sözleşmesine dayanarak çalışan gerçek kişi',
        'Ücret alan herkes',
        'İşyerinde bulunan her gerçek veya tüzel kişi',
        'Sosyal güvenlik kurumuna kayıtlı kişi',
      ],
      answer: 0,
      reason: 'İş K. m.2/1 işçiyi bir iş sözleşmesine dayanarak çalışan gerçek kişi olarak tanımlar.',
      dayanak: { kanun: 'is-kanunu', madde: '2', ifade: 'bir iş sözleşmesine dayanarak çalışan gerçek kişiye işçi' },
    },
  ],
  kaynaklar: [
    {
      title: '4857 sayılı İş Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.4857.pdf',
      note: 'Örnek olay, tuzak ve test dayanaklarının resmî metni',
    },
    {
      title: '1475 sayılı İş Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.1475.pdf',
      note: 'Yürürlükteki kıdem tazminatı hükmü (m.14)',
    },
  ],
};

export default katman;
