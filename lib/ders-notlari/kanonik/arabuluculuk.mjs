/**
 * Arabuluculuk — kanonik katman (G23). Dayanaklar 6325 sayılı Hukuk Uyuşmazlıklarında Arabuluculuk Kanunu metnine bağlıdır
 * (`content/mevzuat/arabuluculuk`). Olaylar kurmacadır; kişi, tarih ve tutar örnek içindir. Ücret tarifesindeki tutarlar ve
 * yönetmelik hükümleri katmana alınmamıştır.
 */
const katman = {
  ders: 'arabuluculuk',
  temsilci: { uni: 'ankara', ders: 'arabuluculuk-yillik' },
  guncelleme: '2026-10-15',
  ornekOlaylar: [
    {
      baslik: 'İlk toplantıya gelmeyen kiracı',
      olay:
        'Kiraya veren Hakan, kiracısı Leyla’nın ödemediği üç aylık kira bedeli için dava açmadan önce arabuluculuk bürosuna ' +
        'başvurmuştur. Arabulucunun usulüne uygun davetine rağmen Leyla geçerli bir mazeret göstermeden ilk toplantıya ' +
        'katılmamış, arabulucu da faaliyeti sona erdirmiştir. Hakan’ın sonradan açtığı alacak davasında Leyla, kira bedelinin ' +
        'bir kısmını ödediğini ispatlayarak davada kısmen haklı çıkmıştır.',
      cozum:
        'Kira ilişkisinden kaynaklanan uyuşmazlıklarda, ilamsız icra yoluyla tahliyeye ilişkin hükümler dışında, dava açılmadan ' +
        'önce arabulucuya başvurulmuş olması dava şartıdır (Hukuk Uyuşmazlıklarında Arabuluculuk Kanunu (HUAK) m.18/B-1-a). ' +
        'Geçerli mazereti olmadan ilk toplantıya katılmayan taraf son tutanakta belirtilir ve davada kısmen veya tamamen haklı ' +
        'çıksa bile karşı tarafın ödemekle yükümlü olduğu yargılama giderlerinin yarısından sorumlu tutulur (HUAK m.18/A-11). ' +
        'Leyla’nın kısmen haklı çıkması bu sonucu değiştirmediği gibi Leyla lehine hükmedilecek vekâlet ücreti de tarifeye göre ' +
        'belirlenen tutarın yarısıdır.',
      sonuc: 'Kira uyuşmazlığında arabuluculuk dava şartıdır; ilk toplantıya mazeretsiz gelmeyen taraf haklı çıksa da giderde yük taşır.',
      dayanaklar: [
        { kanun: 'arabuluculuk', madde: '18B', ifade: 'kira ilişkisinden kaynaklanan uyuşmazlıklar' },
        { kanun: 'arabuluculuk', madde: '18A', ifade: 'geçerli bir mazeret göstermeksizin ilk toplantıya katılmaması' },
        { kanun: 'arabuluculuk', madde: '18A', ifade: 'davada kısmen veya tamamen haklı çıksa bile' },
        { kanun: 'arabuluculuk', madde: '18A', ifade: 'vekâlet ücretinin yarısına hükmedilir' },
      ],
    },
    {
      baslik: 'Ortaklığın giderilmesinde anlaşma ve sonradan açılan dava',
      olay:
        'Murat ile Zeynep’in yarı yarıya paylı malik oldukları arsa için başlattıkları arabuluculuk, arsanın Zeynep’e devredilmesi ' +
        've Zeynep’in Murat’a bedel ödemesi yönünde anlaşmayla sonuçlanmıştır. Belgeyi taraflar, avukatları ve arabulucu birlikte ' +
        'imzalamıştır. Zeynep belgeyle doğrudan tapu müdürlüğüne gitmiş, Murat ise birkaç ay sonra fikrini değiştirerek aynı arsa ' +
        'için ortaklığın giderilmesi davası açmıştır.',
      cozum:
        'Taşınmazların paylaştırılmasına ve ortaklığın giderilmesine ilişkin uyuşmazlıklarda arabulucuya başvuru dava şartıdır ' +
        '(HUAK m.18/B-1-b). Taraflar ve avukatları ile arabulucunun birlikte imzaladığı belge kural olarak şerh aranmaksızın ilam ' +
        'niteliğinde sayılmakla birlikte bu kural, kanunda şerhin zorunlu kılındığı hâlleri kapsamaz (HUAK m.18/4). Ortaklığın ' +
        'giderilmesine ilişkin anlaşma belgesi için icra edilebilirlik şerhi zorunlu olup taşınmazla ilgili belgede şerh, taşınmazın ' +
        'bulunduğu yer sulh hukuk mahkemesinden alınır (HUAK m.18/B-3). Taşınmazın devrine ilişkin belgede tescil talebi de şerh ' +
        'verildikten sonra yapılabilir (HUAK m.18/B-5). Murat’ın davası ise anlaşılan hususa ilişkin olup arabuluculuk sonunda ' +
        'üzerinde anlaşılan hususlar hakkında taraflarca dava açılamaz (HUAK m.18/5).',
      sonuc: 'Ortaklığın giderilmesindeki anlaşma belgesi şerhsiz tescile esas olmaz; anlaşılan konuda yeniden dava açılamaz.',
      dayanaklar: [
        { kanun: 'arabuluculuk', madde: '18B', ifade: 'ortaklığın giderilmesine ilişkin uyuşmazlıklar' },
        { kanun: 'arabuluculuk', madde: '18', ifade: 'icra edilebilirlik şerhi aranmaksızın ilam niteliğinde belge sayılır' },
        { kanun: 'arabuluculuk', madde: '18B', ifade: 'icra edilebilirliğine ilişkin şerhin alınması zorunlu' },
        { kanun: 'arabuluculuk', madde: '18B', ifade: 'icra edilebilirlik şerhi verilmesinden sonra tapu müdürlüğünden tescil talebinde bulunabilir' },
        { kanun: 'arabuluculuk', madde: '18', ifade: 'üzerinde anlaşılan hususlar hakkında taraflarca dava açılamaz' },
      ],
    },
    {
      baslik: 'Arabuluculukta kabul edilen borç ve arabulucunun tanıklığı',
      olay:
        'Selim, arkadaşı Burcu’ya verdiği borç para için dava açmadan önce Burcu ile birlikte ihtiyari olarak arabulucuya ' +
        'başvurmuştur. Görüşmede Burcu borcun yarısını kabul ettiğini, ancak hemen ödeyemeyeceğini söylemiş, taraflar ' +
        'anlaşamamıştır. Selim açacağı davada Burcu’nun bu kabulünü delil göstermek, arabulucuyu tanık olarak dinletmek ve ' +
        'arabulucuyu kendi avukatı olarak görevlendirmek istemektedir. Zamanaşımının dolmak üzere olmasından da endişe etmektedir.',
      cozum:
        'Arabuluculuk sırasında ileri sürülen öneriler ve bir vakıanın kabulü, sonradan açılan hukuk davasında delil olarak ' +
        'ileri sürülemez ve arabulucu dahil hiç kimse bunlar hakkında tanıklık yapamaz (HUAK m.5/1-c). Böyle bir beyan delil ' +
        'olarak sunulsa bile hükme esas alınamaz (HUAK m.5/3). Arabulucu, bu sıfatla görev yaptığı uyuşmazlıkla ilgili davada ' +
        'sonradan taraflardan birinin avukatı olarak görev üstlenemez (HUAK m.9/4). Arabuluculuk sürecinin başlamasından sona ' +
        'ermesine kadar geçen süre ise zamanaşımı ve hak düşürücü sürelerin hesabında dikkate alınmadığından Selim’in endişesi ' +
        'bu süre bakımından yersizdir (HUAK m.16/2).',
      sonuc: 'Arabuluculuktaki kabul sonraki davada delil değildir; arabulucu tanık ya da taraf avukatı olamaz, süreç zamanaşımına sayılmaz.',
      dayanaklar: [
        { kanun: 'arabuluculuk', madde: '5', ifade: 'herhangi bir vakıa veya iddianın kabulü' },
        { kanun: 'arabuluculuk', madde: '5', ifade: 'delil olarak sunulmuş olsa dahi hükme esas alınamaz' },
        { kanun: 'arabuluculuk', madde: '9', ifade: 'daha sonra taraflardan birinin avukatı olarak görev üstlenemez' },
        { kanun: 'arabuluculuk', madde: '16', ifade: 'zamanaşımı ve hak düşürücü sürelerin hesaplanmasında dikkate alınmaz' },
      ],
    },
    {
      baslik: 'Aile içi şiddet iddiası taşıyan tazminat uyuşmazlığı',
      olay:
        'Ece, eşi Tolga’nın kendisine şiddet uyguladığını ileri sürerek uğradığı zararın tazmini için dava açmaya hazırlanmaktadır. ' +
        'Tolga’nın teklifi üzerine taraflar birlikte bir arabulucu seçmiş, arabulucu ilk görüşmede şiddet iddiasını öğrenmiştir. ' +
        'Ece ise bu görüşmeden sonra süreçten çekilmek istemektedir.',
      cozum:
        'Kanun, tarafların serbestçe tasarruf edebilecekleri iş veya işlemlerden doğan özel hukuk uyuşmazlıklarına uygulanmakla ' +
        'birlikte aile içi şiddet iddiasını içeren uyuşmazlıkları arabuluculuğa elverişli saymaz (HUAK m.1/2). Uyuşmazlığın ' +
        'arabuluculuğa elverişli olmadığı tespit edilince faaliyet sona erer ve sonuç bir tutanakla belgelendirilir (HUAK m.17/1-d, ' +
        '17/2). Arabuluculuk bu uyuşmazlıkta dava şartı olmadığından taraflar süreci devam ettirmek ya da süreçten vazgeçmek ' +
        'konusunda da serbesttir (HUAK m.3/1). Ece’nin karşı tarafa veya arabulucuya faaliyetten çekildiğini bildirmesi de ' +
        'arabuluculuğu ayrıca sona erdirir (HUAK m.17/1-c).',
      sonuc: 'Aile içi şiddet iddiası içeren uyuşmazlık arabuluculuğa elverişli değildir; tespit edilince süreç tutanakla sona erer.',
      dayanaklar: [
        { kanun: 'arabuluculuk', madde: '1', ifade: 'aile içi şiddet iddiasını içeren uyuşmazlıklar arabuluculuğa elverişli değildir' },
        { kanun: 'arabuluculuk', madde: '17', ifade: 'Uyuşmazlığın arabuluculuğa elverişli olmadığının tespit edilmesi' },
        { kanun: 'arabuluculuk', madde: '3', ifade: 'bu süreçten vazgeçmek konusunda serbesttirler' },
        { kanun: 'arabuluculuk', madde: '17', ifade: 'arabuluculuk faaliyetinden çekildiğini bildirmesi' },
      ],
    },
  ],
  sinavIskeleti: [
    {
      adim: 'Elverişlilik',
      aciklama: 'Uyuşmazlığın tarafların serbestçe tasarruf edebileceği bir özel hukuk uyuşmazlığı olup olmadığı ve aile içi şiddet iddiası taşıyıp taşımadığı belirlenir.',
    },
    {
      adim: 'Dava şartı ya da ihtiyari başvuru',
      aciklama: 'Uyuşmazlığın kanunda dava şartı arabuluculuğa bağlanıp bağlanmadığı, bağlanmışsa bir istisnaya girip girmediği incelenir.',
    },
    {
      adim: 'Başvuru ve görevlendirme',
      aciklama: 'Başvurunun yetkili büroya yapılıp yapılmadığı, arabulucunun nasıl belirlendiği ve yetki itirazının zamanı denetlenir.',
    },
    {
      adim: 'Süreler',
      aciklama: 'Üç haftalık süre ve uzatması, zamanaşımının durması ile ilk toplantıya katılmamanın gider sonuçları hesaplanır.',
    },
    {
      adim: 'Gizlilik',
      aciklama: 'Arabuluculukta yapılan öneri, beyan ve kabullerin sonraki davada delil ya da tanıklık konusu olup olamayacağı değerlendirilir.',
    },
    {
      adim: 'Sonuç belgesi',
      aciklama: 'Anlaşma belgesinin ilam niteliği, icra edilebilirlik şerhinin zorunlu olup olmadığı ve anlaşılan hususlarda dava yasağı açıklanır.',
    },
  ],
  tuzakDefteri: [
    {
      tuzak: 'Taraflar anlaşamazsa arabulucu uyuşmazlık hakkında bağlayıcı bir karar verir.',
      dogrusu: 'Yalnız hâkimin yapabileceği yargısal işlemleri arabulucu yapamaz; taraflar çözüm üretemezse yalnız çözüm önerisinde bulunabilir.',
      dayanak: { kanun: 'arabuluculuk', madde: '15', ifade: 'sadece hâkim tarafından yapılabilecek işlemler arabulucu tarafından yapılamaz' },
    },
    {
      tuzak: 'Arabulucu, kendisini görevlendiren büronun yetkisizliğini kendiliğinden dikkate alır.',
      dogrusu: 'Arabulucu büronun yetkisini kendiliğinden dikkate alamaz; karşı taraf yetki itirazını en geç ilk toplantıda yapar.',
      dayanak: { kanun: 'arabuluculuk', madde: '18A', ifade: 'büronun yetkili olup olmadığını kendiliğinden dikkate alamaz' },
    },
    {
      tuzak: 'Dava şartı arabuluculukta arabulucu, süreci gerekli gördüğü kadar uzatabilir.',
      dogrusu: 'Arabulucu başvuruyu görevlendirildiği tarihten itibaren üç hafta içinde sonuçlandırır; süre zorunlu hâllerde en fazla bir hafta uzar.',
      dayanak: { kanun: 'arabuluculuk', madde: '18A', ifade: 'zorunlu hâllerde arabulucu tarafından en fazla bir hafta uzatılabilir' },
    },
    {
      tuzak: 'Dava açıldıktan sonra artık arabulucuya başvurulamaz.',
      dogrusu: 'Taraflar dava açılmadan önce olduğu gibi davanın görülmesi sırasında da arabulucuya başvurmayı kararlaştırabilir.',
      dayanak: { kanun: 'arabuluculuk', madde: '13', ifade: 'davanın görülmesi sırasında arabulucuya başvurma konusunda anlaşabilirler' },
    },
    {
      tuzak: 'Dava şartı arabuluculuk sürerken zamanaşımı işlemeye devam eder.',
      dogrusu: 'Büroya başvurudan son tutanağın düzenlendiği tarihe kadar zamanaşımı durur ve hak düşürücü süre işlemez.',
      dayanak: { kanun: 'arabuluculuk', madde: '18A', ifade: 'zamanaşımı durur ve hak düşürücü süre işlemez' },
    },
    {
      tuzak: 'Tahkim sözleşmesi bulunsa da kira uyuşmazlığında önce arabulucuya gidilmesi dava şartıdır.',
      dogrusu: 'Tahkim sözleşmesinin bulunduğu hâllerde dava şartı olarak arabuluculuğa ilişkin hükümler uygulanmaz.',
      dayanak: { kanun: 'arabuluculuk', madde: '18A', ifade: 'tahkim sözleşmesinin bulunduğu hâllerde, dava şartı olarak arabuluculuğa ilişkin hükümler uygulanmaz' },
    },
  ],
  kisaTest: [
    {
      q: 'Dava şartı arabuluculukta arabulucu başvuruyu görevlendirildiği tarihten itibaren kural olarak hangi süre içinde sonuçlandırır?',
      choices: ['Bir hafta', 'İki hafta', 'Üç hafta', 'Dört hafta'],
      answer: 2,
      reason: 'HUAK m.18/A-9 başvurunun üç hafta içinde sonuçlandırılacağını, sürenin zorunlu hâllerde en fazla bir hafta uzatılabileceğini öngörür.',
      dayanak: { kanun: 'arabuluculuk', madde: '18A', ifade: 'görevlendirildiği tarihten itibaren üç hafta içinde sonuçlandırır' },
    },
    {
      q: 'İhtiyari arabuluculukta başvuru teklifine hangi süre içinde olumlu cevap verilmezse teklif reddedilmiş sayılır?',
      choices: ['On beş gün', 'Otuz gün', 'Altmış gün', 'Doksan gün'],
      answer: 1,
      reason: 'HUAK m.13/2 aksi kararlaştırılmadıkça otuz gün içinde olumlu cevap verilmeyen teklifin reddedilmiş sayılacağını öngörür.',
      dayanak: { kanun: 'arabuluculuk', madde: '13', ifade: 'otuz gün içinde olumlu cevap verilmez ise' },
    },
    {
      q: 'Dava açıldıktan sonra taraflar birlikte arabulucuya başvuracaklarını beyan ederse yargılama ilk aşamada en çok ne kadar ertelenir?',
      choices: ['Bir ay', 'İki ay', 'Üç ay', 'Altı ay'],
      answer: 2,
      reason: 'HUAK m.15/5 yargılamanın üç ayı geçmemek üzere erteleneceğini, sürenin birlikte başvuruyla üç aya kadar uzatılabileceğini öngörür.',
      dayanak: { kanun: 'arabuluculuk', madde: '15', ifade: 'yargılama, mahkemece üç ayı geçmemek üzere ertelenir' },
    },
    {
      q: 'Arabulucu, faaliyete ilişkin belgeleri ve düzenlediği tutanağı ne kadar süre saklamak zorundadır?',
      choices: ['Bir yıl', 'İki yıl', 'Beş yıl', 'On yıl'],
      answer: 2,
      reason: 'HUAK m.17/4 arabulucunun bildirimi, belgeleri ve tutanağı beş yıl süre ile saklamak zorunda olduğunu öngörür.',
      dayanak: { kanun: 'arabuluculuk', madde: '17', ifade: 'beş yıl süre ile saklamak zorundadır' },
    },
    {
      q: 'Aşağıdakilerden hangisinde dava açılmadan önce arabulucuya başvurulmuş olması dava şartıdır?',
      choices: [
        'Kat mülkiyetinden kaynaklanan uyuşmazlık',
        'Aile içi şiddet iddiasını içeren tazminat uyuşmazlığı',
        'Tahkim sözleşmesi bulunan kira uyuşmazlığı',
        'Kiralananın ilamsız icra yoluyla tahliyesi',
      ],
      answer: 0,
      reason: 'HUAK m.18/B-1-c Kat Mülkiyeti Kanunundan kaynaklanan uyuşmazlıkları dava şartı arabuluculuğa bağlar; diğer üç durum kanunda ayrıca dışarıda bırakılmıştır.',
      dayanak: { kanun: 'arabuluculuk', madde: '18B', ifade: 'Kat Mülkiyeti Kanunundan kaynaklanan uyuşmazlıklar' },
    },
    {
      q: 'Arabuluculuk sonunda anlaşılan hususlar için taraflardan biri sonradan dava açmak isterse hangisi doğrudur?',
      choices: ['Dava açılamaz', 'Bir yıl içinde dava açılabilir', 'Arabulucunun onayıyla dava açılabilir', 'Yalnız tespit davası açılabilir'],
      answer: 0,
      reason: 'HUAK m.18/5 arabuluculuk sonunda anlaşmaya varılan hususlar hakkında taraflarca dava açılamayacağını öngörür.',
      dayanak: { kanun: 'arabuluculuk', madde: '18', ifade: 'anlaşmaya varılması hâlinde, üzerinde anlaşılan hususlar' },
    },
  ],
  kaynaklar: [
    {
      title: '6325 sayılı Hukuk Uyuşmazlıklarında Arabuluculuk Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6325.pdf',
      note: 'Örnek olay, tuzak ve test dayanaklarının resmî metni',
    },
  ],
};

export default katman;
