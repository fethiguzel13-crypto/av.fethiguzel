/**
 * Ceza Hukuku Genel Hükümler — kanonik katman (G19). Dayanaklar 5237 sayılı Türk Ceza Kanunu metnine bağlıdır
 * (`content/mevzuat/tck`). Olaylar kurmacadır; kişi, yer ve tarih örnek içindir. Ceza miktarı hesaplanmaz, yalnız uygulanacak
 * kurum ve indirim ya da artırım hükmü gösterilir.
 */
const katman = {
  ders: 'ceza-genel',
  temsilci: { uni: 'ankara', ders: 'ceza-genel-yillik' },
  guncelleme: '2026-10-09',
  ornekOlaylar: [
    {
      baslik: 'Yumrukla saldırana bıçakla karşılık verme',
      olay:
        'Gece yarısı bir otoparkta Burak, park yeri tartışması sonrasında Cem’e yumrukla saldırmış ve ikinci yumruğu atmak için ' +
        'yeniden yaklaşmıştır. Cem korkuyla cebindeki çakıyı çıkarmış ve Burak’ın koluna saplamış, Burak’ın kolunda tendon kesisi ' +
        'oluşmuştur. Cem hakkında kasten yaralama suçundan kovuşturma başlamıştır.',
      cozum:
        'Türk Ceza Kanunu (TCK) m.25/1 uyarınca kendisine yönelmiş, gerçekleşen ya da tekrarı muhakkak olan haksız bir saldırıyı o anda ' +
        'saldırı ile orantılı biçimde defetmek zorunluluğuyla işlenen fiilden dolayı faile ceza verilmez. Burak’ın ikinci yumruk için ' +
        'yaklaşması saldırının tekrarının muhakkak olduğunu gösterir ve savunma o anda yapılmıştır. Yumruğa karşı çakı kullanılması ise ' +
        'orantı koşulunu tartışmalı kılar, dolayısıyla olay sınırın aşılması hükmüne gider. Sınır kast olmaksızın aşılmışsa ve fiil ' +
        'taksirle de cezalandırılıyorsa taksirli suçun cezası indirilerek uygulanır (TCK m.27/1). Sınırın aşılması mazur görülebilecek ' +
        'bir heyecan, korku veya telaştan ileri gelmişse faile hiç ceza verilmez (TCK m.27/2). Gece, ani ve tekrarlanan saldırı ve Cem’in ' +
        'korkusu bu son hükmün tartışılmasını gerektiren vakıalardır.',
      sonuc:
        'Önce meşru savunmanın koşulları sırayla denetlenir; orantı aşılmışsa sınırın aşılması ve korku ya da telaşın mazur görülüp görülmediği tartışılır.',
      dayanaklar: [
        { kanun: 'tck', madde: '25', ifade: 'saldırı ile orantılı biçimde defetmek zorunluluğu ile işlenen fiillerden dolayı faile ceza verilmez' },
        { kanun: 'tck', madde: '27', ifade: 'mazur görülebilecek bir heyecan, korku veya telaştan ileri gelmiş ise faile ceza verilmez' },
      ],
    },
    {
      baslik: 'Kilidi kırdıktan sonra kasaya dokunmadan ayrılan fail',
      olay:
        'Ozan, gece kapalı olan bir kırtasiyenin kapı kilidini levyeyle kırarak içeri girmiş ve tezgâhtaki kasayı açmaya çalışmıştır. ' +
        'Bu sırada kimse gelmemiş, alarm da çalmamıştır. Ozan vazgeçerek hiçbir şey almadan dükkândan çıkmış, ertesi gün dükkân sahibi ' +
        'kırık kilidi fark edip şikâyetçi olmuştur.',
      cozum:
        'Ozan hırsızlık suçunu işlemeyi kastetmiş ve elverişli hareketlerle doğrudan doğruya icraya başlamıştır. Teşebbüs hükmü, ' +
        'suçun failin elinde olmayan nedenlerle tamamlanamadığı hâllere uygulanır (TCK m.35/1), oysa olayda bir engel bulunmamakta ' +
        've fail kendi iradesiyle durmaktadır. TCK m.36 uyarınca suçun icra hareketlerinden gönüllü vazgeçen fail teşebbüsten dolayı cezalandırılmaz, ' +
        'ancak tamam olan kısım esasen bir suç oluşturuyorsa o suçun cezasıyla cezalandırılır. Kırılan kilit bakımından mala zarar verme ' +
        '(TCK m.151/1) ve kapalı işyerine rızaya aykırı giriş bakımından işyeri dokunulmazlığının ihlali (TCK m.116/2) tamamlanmış ' +
        'suçlardır. Her ikisi de şikâyete bağlı olduğundan dükkân sahibinin şikâyeti kovuşturmanın koşuludur.',
      sonuc: 'Gönüllü vazgeçme teşebbüsün cezasını kaldırır, icra sırasında tamamlanmış ayrı suçların cezasını kaldırmaz.',
      dayanaklar: [
        { kanun: 'tck', madde: '35', ifade: 'elinde olmayan nedenlerle tamamlayamaz ise teşebbüsten dolayı sorumlu tutulur' },
        { kanun: 'tck', madde: '36', ifade: 'tamam olan kısım esasen bir suç oluşturduğu takdirde, sadece o suça ait ceza ile cezalandırılır' },
        { kanun: 'tck', madde: '151', ifade: 'mağdurun şikayeti üzerine' },
        { kanun: 'tck', madde: '116', ifade: 'açık bir rızaya gerek duyulmaksızın girilmesi mutat olan yerler dışında kalan işyerleri' },
      ],
    },
    {
      baslik: 'Okul önünde aşırı hızla yayaya çarpan sürücü',
      olay:
        'Deniz, öğle saatinde bir ilkokulun önündeki 30 km sınırlı yolda 110 km hızla ilerlerken yaya geçidinden geçen bir velinin ' +
        'ağır yaralanmasına neden olmuştur. Deniz ifadesinde okul çıkışı olduğunu ve yolda yayalar bulunabileceğini bildiğini, ancak ' +
        'aracını ustalıkla kullandığı için kimseye çarpmayacağına güvendiğini söylemiştir.',
      cozum:
        'Manevi unsurun belirlenmesi olayın merkezindedir. Kast suçun kanuni tanımındaki unsurların bilerek ve istenerek ' +
        'gerçekleştirilmesidir (TCK m.21/1). Olası kastta fail unsurların gerçekleşebileceğini öngörmesine rağmen fiili işler ' +
        '(TCK m.21/2), bilinçli taksirde ise öngördüğü neticeyi istememektedir (TCK m.22/3). Deniz neticeyi öngörmüştür ve ayrım, ' +
        'neticenin gerçekleşmesini göze alıp almadığına dayanır. Neticeyi önleyeceğine güvendiğini söylemesi bilinçli taksiri ' +
        'destekler, okul önünde 110 km hız ise bu güvenin dayanaksız olduğunu ve neticenin göze alındığını gösterebilir. Kâğıtta iki ' +
        'ihtimal de kanun hükmüyle tartışılır ve hangisinin seçildiği vakıalarla gerekçelendirilir. Bilinçli taksir kabul edilirse ' +
        'taksirli suçun cezası artırılır, olası kast kabul edilirse kasten işlenen suçun cezası indirilir.',
      sonuc: 'Öngörme her iki hâlde de vardır; olası kast ile bilinçli taksiri ayıran, failin neticeyi göze alıp almadığıdır.',
      dayanaklar: [
        { kanun: 'tck', madde: '21', ifade: 'gerçekleşebileceğini öngörmesine rağmen, fiili işlemesi halinde olası kast vardır' },
        { kanun: 'tck', madde: '22', ifade: 'öngördüğü neticeyi istememesine karşın, neticenin meydana gelmesi halinde bilinçli taksir vardır' },
      ],
    },
  ],
  sinavIskeleti: [
    {
      adim: 'Kanunilik ve uygulama alanı',
      aciklama: 'Fiilin işlendiği zaman yürürlükteki kanunda suç olup olmadığı ve sonradan lehe bir kanun çıkıp çıkmadığı yazılır.',
    },
    {
      adim: 'Maddi unsurlar',
      aciklama: 'Fail, mağdur, konu, hareket, netice ve nedensellik bağı suçun kanuni tanımıyla eşlenir.',
    },
    {
      adim: 'Manevi unsur',
      aciklama: 'Kast, olası kast, bilinçli taksir ve taksir ayrılır; taksirle işlenen fiilin kanunda cezalandırılıp cezalandırılmadığı denetlenir.',
    },
    {
      adim: 'Hukuka uygunluk',
      aciklama: 'Kanunun hükmü, meşru savunma, hakkın kullanılması ve rıza koşulları sırasıyla incelenir.',
    },
    {
      adim: 'Kusur',
      aciklama: 'Yaş küçüklüğü, akıl hastalığı, hata ve haksız tahrik gibi sorumluluğu kaldıran ya da azaltan nedenler tartışılır.',
    },
    {
      adim: 'Özel görünüş biçimleri',
      aciklama: 'Teşebbüs, gönüllü vazgeçme, iştirak ve içtima hükümleri olayın gerektirdiği ölçüde uygulanır; ceza hesabı en sona bırakılır.',
    },
  ],
  tuzakDefteri: [
    {
      tuzak: 'Taksirle işlenen her fiil, kasten işlenen hâlinin cezası indirilerek cezalandırılır.',
      dogrusu: 'Taksirle işlenen fiiller yalnız kanunun açıkça belirttiği hâllerde cezalandırılır.',
      dayanak: { kanun: 'tck', madde: '22', ifade: 'taksirle işlenen fiiller, kanunun açıkça belirttiği hallerde cezalandırılır' },
    },
    {
      tuzak: 'Suç ve ceza içeren hükümlerde kanunun amacına uygun kıyas yapılabilir.',
      dogrusu: 'Suç ve ceza içeren hükümlerde kıyas yapılamaz ve bu hükümler kıyasa yol açacak biçimde geniş yorumlanamaz.',
      dayanak: { kanun: 'tck', madde: '2', ifade: 'kıyas yapılamaz' },
    },
    {
      tuzak: 'Suç tarihinden sonra yürürlüğe giren kanun her durumda uygulanır.',
      dogrusu: 'Suç tarihindeki kanun ile sonraki kanunlar farklıysa failin lehine olan kanun uygulanır.',
      dayanak: { kanun: 'tck', madde: '7', ifade: 'failin lehine olan kanun uygulanır' },
    },
    {
      tuzak: 'On iki yaşını doldurmamış çocuk hakkında kovuşturma yapılır, ceza indirilir.',
      dogrusu: 'Bu çocukların ceza sorumluluğu yoktur ve haklarında kovuşturma yapılamaz; yalnız çocuklara özgü güvenlik tedbiri uygulanabilir.',
      dayanak: { kanun: 'tck', madde: '31', ifade: 'bu kişiler hakkında, ceza kovuşturması yapılamaz' },
    },
    {
      tuzak: 'Aynı kişiye farklı zamanlarda yapılan kasten yaralamalar zincirleme suç sayılır.',
      dogrusu: 'Kasten öldürme, kasten yaralama, işkence ve yağma suçlarında zincirleme suç hükmü uygulanmaz.',
      dayanak: { kanun: 'tck', madde: '43', ifade: 'kasten öldürme, kasten yaralama, işkence ve yağma suçlarında bu madde hükümleri uygulanmaz' },
    },
    {
      tuzak: 'Tek fiille birden fazla farklı suç oluşursa cezalar toplanır.',
      dogrusu: 'Fikri içtimada fail, oluşan suçlardan en ağır cezayı gerektiren suçtan dolayı cezalandırılır.',
      dayanak: { kanun: 'tck', madde: '44', ifade: 'en ağır cezayı gerektiren suçtan dolayı cezalandırılır' },
    },
    {
      tuzak: 'Konusu suç olan bir emri yerine getiren memur, emir aldığı için sorumlu olmaz.',
      dogrusu: 'Konusu suç teşkil eden emir hiçbir surette yerine getirilemez; yerine getiren ile emri veren birlikte sorumlu olur.',
      dayanak: { kanun: 'tck', madde: '24', ifade: 'konusu suç teşkil eden emir hiçbir surette yerine getirilemez' },
    },
  ],
  kisaTest: [
    {
      q: 'TCK’ya göre kastın tanımı hangisidir?',
      choices: [
        'Neticenin öngörülebilir olması',
        'Suçun kanuni tanımındaki unsurların bilerek ve istenerek gerçekleştirilmesi',
        'Dikkat ve özen yükümlülüğüne aykırı davranılması',
        'Fiilin haksızlık oluşturduğunun bilinmesi',
      ],
      answer: 1,
      reason: 'TCK m.21/1 kastı kanuni tanımdaki unsurların bilerek ve istenerek gerçekleştirilmesi olarak tanımlar.',
      dayanak: { kanun: 'tck', madde: '21', ifade: 'kast, suçun kanuni tanımındaki unsurların bilerek ve istenerek gerçekleştirilmesidir' },
    },
    {
      q: 'Suçun işlenmesinde kusur yeteneği olmayan birini araç olarak kullanan kişinin durumu nedir?',
      choices: [
        'Azmettiren olarak işlenen suçun cezasıyla cezalandırılır.',
        'Yardım eden olarak cezası indirilir.',
        'Fail olarak sorumludur ve cezası üçte birden yarısına kadar artırılır.',
        'Araç olarak kullanılan kişinin sorumsuzluğu nedeniyle sorumlu tutulmaz.',
      ],
      answer: 2,
      reason: 'TCK m.37/2 dolaylı faili fail sayar; araç kusur yeteneği olmayan biriyse ceza üçte birden yarısına kadar artırılır.',
      dayanak: { kanun: 'tck', madde: '37', ifade: 'kusur yeteneği olmayanları suçun işlenmesinde araç olarak kullanan kişinin cezası' },
    },
    {
      q: 'Haksız tahrik, müebbet hapis dışındaki hâllerde cezayı nasıl etkiler?',
      choices: [
        'Ceza verilmez.',
        'Ceza dörtte birinden dörtte üçüne kadar indirilir.',
        'Ceza yarı oranında indirilir.',
        'Ceza altıda bir oranında indirilir.',
      ],
      answer: 1,
      reason: 'TCK m.29 diğer hâllerde verilecek cezanın dörtte birinden dörtte üçüne kadarının indirilmesini öngörür.',
      dayanak: { kanun: 'tck', madde: '29', ifade: 'diğer hallerde verilecek cezanın dörtte birinden dörtte üçüne kadarı indirilir' },
    },
    {
      q: 'Fiilinin haksızlık oluşturduğu konusunda kaçınılmaz bir hataya düşen kişi hakkında hangisi doğrudur?',
      choices: [
        'Cezası yarı oranında indirilir.',
        'Taksirli suçtan sorumlu tutulur.',
        'Cezalandırılmaz.',
        'Hata ceza sorumluluğunu etkilemez.',
      ],
      answer: 2,
      reason: 'TCK m.30/4 haksızlık yanılgısı kaçınılmaz ise kişinin cezalandırılmayacağını öngörür.',
      dayanak: { kanun: 'tck', madde: '30', ifade: 'haksızlık oluşturduğu hususunda kaçınılmaz bir hataya düşen kişi, cezalandırılmaz' },
    },
    {
      q: 'İlgilinin rızası hangi hâlde ceza verilmesini engeller?',
      choices: [
        'Her suçta mağdurun rızası varsa',
        'Kişinin üzerinde mutlak surette tasarruf edebileceği bir hakkına ilişkin olarak açıkladığı rıza çerçevesinde',
        'Rıza fiilden sonra açıklanmışsa',
        'Rıza bir yakın tarafından verilmişse',
      ],
      answer: 1,
      reason: 'TCK m.26/2 rızayı, kişinin mutlak surette tasarruf edebileceği haklarla ve açıklanan rızanın çerçevesiyle sınırlar.',
      dayanak: { kanun: 'tck', madde: '26', ifade: 'mutlak surette tasarruf edebileceği bir hakkına ilişkin olmak üzere' },
    },
    {
      q: 'Suç işleme kararını kuvvetlendiren kişi hangi sıfatla sorumludur?',
      choices: ['Müşterek fail', 'Azmettiren', 'Yardım eden', 'Dolaylı fail'],
      answer: 2,
      reason: 'TCK m.39/2-a suç işleme kararını kuvvetlendirmeyi yardım etme hâlleri arasında sayar.',
      dayanak: { kanun: 'tck', madde: '39', ifade: 'suç işleme kararını kuvvetlendirmek' },
    },
  ],
  kaynaklar: [
    {
      title: '5237 sayılı Türk Ceza Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.5237.pdf',
      note: 'Örnek olay, tuzak ve test dayanaklarının resmî metni',
    },
  ],
};

export default katman;
