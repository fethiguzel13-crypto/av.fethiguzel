/**
 * Borçlar Hukuku Özel Hükümler — kanonik katman (G23). Dayanaklar 6098 sayılı Türk Borçlar Kanunu metnine bağlıdır
 * (`content/mevzuat/tbk`). Olaylar kurmacadır; kişi, tarih ve tutar örnek içindir.
 */
const katman = {
  ders: 'borclar-ozel',
  temsilci: { uni: 'ankara', ders: 'borclar-ozel-yillik' },
  guncelleme: '2026-10-14',
  ornekOlaylar: [
    {
      baslik: 'İkinci el otomobilde teslimden üç ay sonra ortaya çıkan şanzıman arızası',
      olay:
        'Zeynep, otomobil ticaretiyle uğraşmayan Tolga’dan 1 Şubat 2025’te ikinci el bir otomobili 900.000 TL’ye satın almış ve aynı ' +
        'gün teslim almıştır. Teslimde yapılan bakımda bir sorun görülmemiştir. Şanzıman 20 Mayıs’ta arızalanmış, bilirkişi arızanın ' +
        'satış anında var olduğunu ve olağan bir incelemeyle anlaşılamayacağını bildirmiştir. Zeynep durumu 22 Mayıs’ta Tolga’ya ' +
        'yazıyla bildirmiş, Tolga ise arızadan haberi olmadığını söylemektedir.',
      cozum:
        'Satılanın kullanım amacı bakımından değerini önemli ölçüde azaltan maddi bir ayıp bulunmaktadır (Türk Borçlar Kanunu (TBK) ' +
        'm.219/1). Tolga’nın ayıbı bilmemesi sonucu değiştirmez, zira satıcı ayıpların varlığını bilmese bile onlardan sorumludur ' +
        '(TBK m.219/2). Alıcı satılanı imkân bulur bulmaz gözden geçirmek ve ayıbı uygun sürede bildirmekle yükümlü olup olağan bir ' +
        'gözden geçirmeyle ortaya çıkarılamayacak ayıp sonradan anlaşılırsa hemen bildirilmelidir (TBK m.223). Zeynep’in iki gün ' +
        'sonraki bildirimi bu koşulu karşılar. Zeynep sözleşmeden dönme, bedelden indirim, ücretsiz onarım ve imkân varsa ayıpsız ' +
        'benzeriyle değiştirme haklarından birini seçer (TBK m.227/1). Belirli bir ikinci el araçta ayıpsız benzeri çoğu zaman ' +
        'bulunmadığından pratikte dönme, indirim ya da onarım kalır. Dava hakkı devirden başlayarak iki yıl, yani 1 Şubat 2027’de ' +
        'zamanaşımına uğrar (TBK m.231).',
      sonuc: 'Gizli ayıpta satıcının bilgisizliği sorumluluğu kaldırmaz; alıcının görevi ayıbı fark eder etmez bildirmektir.',
      dayanaklar: [
        { kanun: 'tbk', madde: '219', ifade: 'Satıcı, bu ayıpların varlığını bilmese bile onlardan sorumludur' },
        { kanun: 'tbk', madde: '223', ifade: 'olağan bir gözden geçirmeyle ortaya çıkarılamayacak bir ayıp' },
        { kanun: 'tbk', madde: '227', ifade: 'aşağıdaki seçimlik haklardan birini kullanabilir' },
        { kanun: 'tbk', madde: '231', ifade: 'satılanın alıcıya devrinden başlayarak iki yıl geçmekle zamanaşımına uğrar' },
      ],
    },
    {
      baslik: 'Süre bitti diye tahliye, yüzde altmış artış ve ödenmeyen bir aylık kira',
      olay:
        'Nur, dairesini 1 Eylül 2023’te bir yıl süreli sözleşmeyle Ali’ye kiraya vermiştir. Nur Ağustos 2025’te Ali’ye sözleşme ' +
        'süresinin dolduğunu yazmış ve evi boşaltmasını istemiştir. Ali ayrılmayınca Nur yeni kira yılı için yüzde altmış artış ' +
        'önermiştir. Ali ekim kirasını da ödememiştir. Nur hangi yolla sözleşmeyi sona erdirebileceğini sormaktadır.',
      cozum:
        'Konut kiralarında kiracı süre bitiminden en az on beş gün önce bildirimde bulunmadıkça sözleşme aynı koşullarla bir yıl ' +
        'uzar, kiraya veren de süre bitimine dayanarak sözleşmeyi sona erdiremez (TBK m.347/1). Nur’un Ağustos’taki yazısı bu ' +
        'nedenle sonuç doğurmaz. Yenilenen dönemin kirası için yapılacak anlaşma bir önceki kira yılında tüketici fiyat endeksinin ' +
        'on iki aylık ortalamalarına göre değişim oranını geçmemek koşuluyla geçerlidir (TBK m.344/1). Ödenmeyen ekim kirası ise ' +
        'ayrı bir yol açar. Nur, Ali’ye yazılı olarak en az otuz günlük süre verip bu sürede ödeme yapılmazsa sözleşmeyi ' +
        'feshedeceğini bildirebilir (TBK m.315). Süre bildirimin yapıldığı tarihi izleyen günden işlemeye başlar.',
      sonuc:
        'Konut kirasında kiraya veren süre bitimini sona erme sebebi yapamaz; kiracının temerrüdünde ise yazılı otuz günlük süre şarttır.',
      dayanaklar: [
        { kanun: 'tbk', madde: '347', ifade: 'Kiraya veren, sözleşme süresinin bitimine dayanarak sözleşmeyi sona erdiremez' },
        { kanun: 'tbk', madde: '344', ifade: 'oniki aylık ortalamalara göre değişim oranını geçmemek koşuluyla geçerlidir' },
        { kanun: 'tbk', madde: '315', ifade: 'konut ve çatılı işyeri kiralarında ise en az otuz gündür' },
      ],
    },
    {
      baslik: 'Tarihi el yazısıyla yazılmamış ve eşin rızası alınmamış kefalet',
      olay:
        'Evli olan Emre, arkadaşı Barış’ın Serkan’a olan 500.000 TL’lik borcu için bilgisayarda hazırlanmış bir kefalet metnini ' +
        'imzalamıştır. Emre metne “500.000 TL” ve “müteselsil kefil” ifadelerini kendi eliyle eklemiş, tarih ise yalnız daktilo ' +
        'yazısıyla yer almıştır. Emre’nin eşi Aslı’dan yazılı rıza alınmamıştır. Barış ödeme yapmayınca Serkan doğrudan Emre’ye ' +
        'başvurmak istemektedir.',
      cozum:
        'Kefalet sözleşmesi yazılı yapılmadıkça ve kefilin sorumlu olacağı azami miktar ile kefalet tarihi belirtilmedikçe geçerli ' +
        'olmaz. Kefil azami miktarı, kefalet tarihini ve müteselsil kefil olduğunu kendi el yazısıyla belirtmelidir (TBK m.583/1). ' +
        'Tarih Emre’nin el yazısıyla yazılmadığından sözleşme şekil bakımından geçersizdir. Ayrıca evli bir kişi ancak eşinin yazılı ' +
        'rızasıyla kefil olabilir ve bu rıza en geç sözleşmenin kurulması anında verilmelidir (TBK m.584/1). Emre bir ticari ' +
        'işletme ya da şirketle ilgili kefalet vermediğinden kanundaki istisnalar da uygulanmaz. Sözleşme geçerli olsaydı bile ' +
        'Serkan’ın borçluyu takip etmeden Emre’ye gidebilmesi, Barış’ın ifada gecikmesine ve ihtarın sonuçsuz kalmasına bağlı ' +
        'olurdu (TBK m.586/1).',
      sonuc: 'Kefalette el yazısı şartı miktar, tarih ve müteselsillik için ayrı ayrı aranır; eşin rızası bunlardan bağımsız bir koşuldur.',
      dayanaklar: [
        { kanun: 'tbk', madde: '583', ifade: 'kefalet sözleşmesinde kendi el yazısıyla belirtmesi şarttır' },
        { kanun: 'tbk', madde: '584', ifade: 'ancak diğerinin yazılı rızasıyla kefil olabilir' },
        { kanun: 'tbk', madde: '586', ifade: 'borçlunun, ifada gecikmesi ve ihtarın sonuçsuz kalması' },
      ],
    },
    {
      baslik: 'Teslimden üç yıl sonra su sızdıran teras çatı',
      olay:
        'Hakan evinin üstüne teras çatı yapılması için bir yükleniciyle anlaşmış, çatı 15 Haziran 2022’de teslim edilmiştir. Kasım ' +
        '2025’te tavandan su sızmaya başlamış, bilirkişi yalıtımın eksik yapıldığını ve bunun teslimde görülemeyeceğini ' +
        'belirlemiştir. Hakan sızıntıyı gördüğü hafta yükleniciye bildirmiştir. Hakan sözleşmeden dönüp ödediği bedeli geri ' +
        'almak istemektedir.',
      cozum:
        'Teslimden sonra sonradan ortaya çıkan ayıp gecikmeksizin bildirilmelidir, aksi hâlde eser kabul edilmiş sayılır (TBK ' +
        'm.477/3). Hakan’ın aynı haftaki bildirimi bu yükümlülüğü karşılar. Ayıp sebebiyle işsahibi sözleşmeden dönme, bedelden ' +
        'indirim ve ücretsiz onarım haklarından birini kullanabilir (TBK m.475/1). Ne var ki eser işsahibinin taşınmazı üzerinde ' +
        'yapılmış olup sökülüp kaldırılması aşırı zarar doğuracaksa işsahibi sözleşmeden dönemez (TBK m.475/son). Evin üstündeki ' +
        'çatının sökülmesi bu niteliktedir, Hakan’a indirim ya da onarım kalır. Taşınmaz yapılarda dava teslimden başlayarak beş ' +
        'yılda zamanaşımına uğradığından süre 15 Haziran 2027’de dolar (TBK m.478).',
      sonuc: 'Taşınmaz üzerindeki eserde dönme hakkı sınırlıdır; zamanaşımı taşınmaz yapılar için teslimden beş yıldır.',
      dayanaklar: [
        { kanun: 'tbk', madde: '477', ifade: 'gecikmeksizin durumu yükleniciye bildirmek zorundadır' },
        { kanun: 'tbk', madde: '475', ifade: 'sökülüp kaldırılması aşırı zarar doğuracaksa işsahibi, sözleşmeden dönme hakkını kullanamaz' },
        { kanun: 'tbk', madde: '478', ifade: 'taşınmaz yapılarda ise beş yılın' },
      ],
    },
  ],
  sinavIskeleti: [
    {
      adim: 'Sözleşmenin nitelendirilmesi',
      aciklama: 'Edimler tanım maddeleriyle karşılaştırılır ve sözleşmenin satış, kira, eser, vekâlet ya da kefalet olup olmadığı belirlenir.',
    },
    {
      adim: 'Şekil ve geçerlilik',
      aciklama: 'Taşınmaz satışı, bağışlama sözü ve kefalet gibi şekle bağlı sözleşmelerde aranan şekil ve ek koşullar tek tek denetlenir.',
    },
    {
      adim: 'Borca aykırılığın türü',
      aciklama: 'Ayıp, temerrüt ya da sözleşmeye aykırı kullanım ayrılır; her biri kendi özel hükmüne bağlanır.',
    },
    {
      adim: 'Bildirim külfeti ve süreler',
      aciklama: 'Gözden geçirme ve bildirim, ihtar ve fesih bildirimi süreleri olay tarihlerine uygulanır.',
    },
    {
      adim: 'Seçimlik haklar ve tazminat',
      aciklama: 'Alıcının ya da işsahibinin seçimlik hakları ve bunları sınırlayan istisnalar yazılır, tazminat hakkı ayrıca anılır.',
    },
    {
      adim: 'Zamanaşımı ve sona erme',
      aciklama: 'Davanın zamanaşımı ve sözleşmenin sona erme yolları teslim, devir ya da bildirim tarihlerinden hesaplanır.',
    },
  ],
  tuzakDefteri: [
    {
      tuzak: 'Ayıbı bilmeyen satıcı ayıptan sorumlu tutulamaz.',
      dogrusu: 'Satıcı ayıpların varlığını bilmese bile onlardan sorumludur ve alıcı seçimlik haklarını yine kullanabilir.',
      dayanak: { kanun: 'tbk', madde: '219', ifade: 'bilmese bile onlardan sorumludur' },
    },
    {
      tuzak: 'Taşınmaz satış vaadi noterde düzenlenmese de yazılı yapılmışsa geçerlidir.',
      dogrusu: 'Taşınmaz satışı vaadi, geri alım ve alım sözleşmeleri resmî şekilde düzenlenmedikçe geçerli olmaz.',
      dayanak: { kanun: 'tbk', madde: '237', ifade: 'resmî şekilde düzenlenmedikçe geçerli olmaz' },
    },
    {
      tuzak: 'Bağışlama sözü sözlü olarak da geçerli biçimde verilebilir.',
      dogrusu: 'Bağışlama sözü yazılı, taşınmazlarda resmî şekle bağlıdır; şekilsiz söz yerine getirilirse elden bağışlama hükmündedir.',
      dayanak: { kanun: 'tbk', madde: '288', ifade: 'bu sözleşmenin yazılı şekilde yapılmasına bağlıdır' },
    },
    {
      tuzak: 'Henüz edinilmemiş bir haktan karşılıksız feragat bağışlamadır.',
      dogrusu: 'Henüz edinilmemiş bir haktan feragat etmek ya da mirası reddetmek bağışlama sayılmaz.',
      dayanak: { kanun: 'tbk', madde: '285', ifade: 'Henüz edinilmemiş olan bir haktan feragat etmek veya bir mirası reddetmek, bağışlama değildir' },
    },
    {
      tuzak: 'Vekâlet sözleşmesi ancak haklı sebeple sona erdirilebilir.',
      dogrusu: 'Vekâlet veren ve vekil sözleşmeyi her zaman sona erdirebilir; uygun olmayan zamanda sona erdiren taraf zararı giderir.',
      dayanak: { kanun: 'tbk', madde: '512', ifade: 'her zaman sözleşmeyi tek taraflı olarak sona erdirebilir' },
    },
    {
      tuzak: 'Satılanda alıcının sözleşme anında bildiği ayıplar için de satıcı sorumludur.',
      dogrusu: 'Satıcı, sözleşmenin kurulduğu sırada alıcının bildiği ayıplardan sorumlu değildir.',
      dayanak: { kanun: 'tbk', madde: '222', ifade: 'alıcı tarafından bilinen ayıplardan sorumlu değildir' },
    },
    {
      tuzak: 'Ağır kusurlu satıcı da sözleşmedeki sorumsuzluk kaydına dayanabilir.',
      dogrusu: 'Satıcı satılanı ayıplı devretmekte ağır kusurluysa ayıp sorumluluğunu kaldıran ya da sınırlayan anlaşma kesin hükümsüzdür.',
      dayanak: { kanun: 'tbk', madde: '221', ifade: 'sınırlayan her anlaşma kesin olarak hükümsüzdür' },
    },
  ],
  kisaTest: [
    {
      q: 'Satılanın ayıbından doğan dava, satıcı daha uzun süre üstlenmemişse ne zaman zamanaşımına uğrar?',
      choices: ['Ayıbın öğrenilmesinden bir yıl', 'Devirden iki yıl', 'Sözleşmeden beş yıl', 'Devirden on yıl'],
      answer: 1,
      reason: 'TBK m.231/1 bu davaların ayıp sonradan ortaya çıksa bile satılanın devrinden başlayarak iki yılda zamanaşımına uğrayacağını öngörür.',
      dayanak: { kanun: 'tbk', madde: '231', ifade: 'satılandaki ayıp daha sonra ortaya çıksa bile' },
    },
    {
      q: 'Belirli süreli konut kirasında kiracı, sözleşmenin uzamasını önlemek için en geç ne zaman bildirimde bulunmalıdır?',
      choices: ['Süre bitiminden en az on beş gün önce', 'Süre bitiminden en az üç ay önce', 'Süre bitiminden en az altı ay önce', 'Süre bitiminden sonraki bir ay içinde'],
      answer: 0,
      reason: 'TBK m.347/1 kiracı süre bitiminden en az on beş gün önce bildirimde bulunmazsa sözleşmenin aynı koşullarla bir yıl uzayacağını öngörür.',
      dayanak: { kanun: 'tbk', madde: '347', ifade: 'süresinin bitiminden en az onbeş gün önce bildirimde bulunmadıkça' },
    },
    {
      q: 'Taşınmaz yapılardaki ayıp sebebiyle yükleniciye karşı açılacak dava, ağır kusur yoksa ne zaman zamanaşımına uğrar?',
      choices: ['Tesliminden iki yıl', 'Tesliminden beş yıl', 'Tesliminden on yıl', 'Tesliminden yirmi yıl'],
      answer: 1,
      reason: 'TBK m.478 taşınmaz yapılarda zamanaşımının teslimden başlayarak beş yıl, ağır kusurda yirmi yıl olduğunu öngörür.',
      dayanak: { kanun: 'tbk', madde: '478', ifade: 'teslim tarihinden başlayarak' },
    },
    {
      q: 'Kefalet sözleşmesinin geçerliliği için aşağıdakilerden hangisi yeterli değildir?',
      choices: [
        'Yazılı şekil',
        'Azami miktarın kefilin el yazısıyla belirtilmesi',
        'Kefalet tarihinin kefilin el yazısıyla belirtilmesi',
        'Kefilin yalnız matbu metni imzalaması',
      ],
      answer: 3,
      reason: 'TBK m.583/1 yazılı şeklin yanında azami miktar, kefalet tarihi ve müteselsillik iradesinin kefilin el yazısıyla belirtilmesini arar.',
      dayanak: { kanun: 'tbk', madde: '583', ifade: 'yazılı şekilde yapılmadıkça ve kefilin sorumlu olacağı azamî miktar ile kefalet tarihi belirtilmedikçe geçerli olmaz' },
    },
    {
      q: 'Vekil hangi durumda ücrete hak kazanır?',
      choices: ['Her durumda', 'Sözleşme veya teamül varsa', 'Yalnız iş sonuçlanırsa', 'Yalnız vekil tacirse'],
      answer: 1,
      reason: 'TBK m.502/3 vekilin ücrete ancak sözleşme veya teamül varsa hak kazanacağını öngörür.',
      dayanak: { kanun: 'tbk', madde: '502', ifade: 'Sözleşme veya teamül varsa vekil, ücrete hak kazanır' },
    },
    {
      q: 'Adi kefalette alacaklı, borçluya başvurmadan kefile hangi durumda doğrudan gidebilir?',
      choices: [
        'Borç muaccel olduğunda',
        'Borçlunun iflasına karar verildiğinde',
        'Borçlu bir kez ödemeyi geciktirdiğinde',
        'Kefil başka bir borca da kefil olduğunda',
      ],
      answer: 1,
      reason: 'TBK m.585/1 adi kefalette borçlunun iflasına karar verilmesini doğrudan kefile başvurma hâlleri arasında sayar.',
      dayanak: { kanun: 'tbk', madde: '585', ifade: 'Borçlunun iflasına karar verilmesi' },
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
