/**
 * Ceza Hukuku Özel Hükümler — kanonik katman (G23). Dayanaklar 5237 sayılı Türk Ceza Kanunu metnine bağlıdır
 * (`content/mevzuat/tck`). Olaylar kurmacadır; kişi, yer ve tutar örnek içindir. Ceza miktarı hesaplanmaz, yalnız uygulanacak
 * suç tipi, kovuşturma şartı ve indirim ya da cezasızlık hükmü gösterilir.
 */
const katman = {
  ders: 'ceza-ozel',
  temsilci: { uni: 'ankara', ders: 'ceza-ozel-yillik' },
  guncelleme: '2026-10-14',
  ornekOlaylar: [
    {
      baslik: 'Düğünde kullanıp geri vermek üzere alınan fotoğraf makinesi',
      olay:
        'Can, arkadaşı Mert’le gittiği piknikte Mert yüzerken battaniyenin üzerindeki fotoğraf makinesini, ertesi gün bir ' +
        'düğünde kullanıp geri getirmek üzere izin almadan çantasına koymuştur. Makineyi düğünde kullanmış ve iki gün sonra ' +
        'Mert’e iade etmiştir. Mert bu arada şikâyetçi olmuştur.',
      cozum:
        'Can, zilyedin rızası olmadan başkasına ait taşınır bir malı, makineyi kullanma yararı sağlamak maksadıyla bulunduğu ' +
        'yerden aldığından hırsızlık suçunun unsurları gerçekleşmiştir (Türk Ceza Kanunu (TCK) m.141). Ne var ki suç, malın ' +
        'geçici bir süre kullanılıp zilyedine iade edilmesi amacıyla işlenmiştir. Bu durumda Mert’in şikâyeti üzerine verilecek ' +
        'ceza yarı oranına kadar indirilir (TCK m.146). Makine bir suç işlemek için kullanılmadığından indirimi engelleyen ' +
        'istisna da gerçekleşmemiştir.',
      sonuc: 'Kullanma amacıyla alma hırsızlığı ortadan kaldırmaz; şikâyet varsa ve mal suçta kullanılmamışsa cezada indirim yapılır.',
      dayanaklar: [
        { kanun: 'tck', madde: '141', ifade: 'Zilyedinin rızası olmadan başkasına ait taşınır bir malı' },
        { kanun: 'tck', madde: '146', ifade: 'malın geçici bir süre kullanılıp zilyedine iade edilmek üzere işlenmesi halinde' },
        { kanun: 'tck', madde: '146', ifade: 'malın suç işlemek için kullanılmış olması halinde bu hüküm uygulanmaz' },
      ],
    },
    {
      baslik: 'Depozitosunu geri almak için ev sahibini iten kiracı',
      olay:
        'Ayşe’nin kira sözleşmesi sona ermiş, ev sahibi Bora ise 20.000 TL’lik depozitoyu iade etmemiştir. Ayşe, Bora’yı ' +
        'sokakta görünce iterek yere düşürmüş ve cüzdanından 20.000 TL alıp uzaklaşmıştır. Adli rapora göre Bora’nın ' +
        'dirseğindeki morluk basit bir tıbbî müdahaleyle giderilebilecek ölçüdedir.',
      cozum:
        'Cebir kullanılarak bir malın alınmasına karşı koymamaya mecbur bırakma, ilk bakışta yağma suçunun tipine uymaktadır ' +
        '(TCK m.148/1). Bununla birlikte kişinin hukuki bir ilişkiye dayanan alacağını tahsil amacıyla tehdit veya cebir ' +
        'kullanması hâlinde yalnız tehdit ya da kasten yaralama hükümleri uygulanır (TCK m.150/1). Ayşe’nin alacağı kira ' +
        'sözleşmesinden doğduğundan fiil yağma değil, kasten yaralamadır. Yaralamanın etkisi basit bir tıbbî müdahaleyle ' +
        'giderilebilecek ölçüde hafif kaldığından soruşturma Bora’nın şikâyetine bağlıdır (TCK m.86/2).',
      sonuc: 'Hukuki ilişkiye dayanan alacağın zorla tahsili yağma sayılmaz; fail kullandığı cebir ya da tehdit oranında sorumlu olur.',
      dayanaklar: [
        { kanun: 'tck', madde: '148', ifade: 'bir malı teslime veya malın alınmasına karşı koymamaya mecbur kılan kişi' },
        { kanun: 'tck', madde: '150', ifade: 'ancak tehdit veya kasten yaralama suçuna ilişkin hükümler uygulanır' },
        { kanun: 'tck', madde: '86', ifade: 'basit bir tıbbî müdahaleyle giderilebilecek ölçüde hafif olması hâlinde, mağdurun şikâyeti üzerine' },
      ],
    },
    {
      baslik: 'Babasının cüzdanından ve ağabeyinin evinden alınan para',
      olay:
        'Deniz, birlikte yaşadığı babasının cüzdanından izinsiz olarak 5.000 TL almıştır. Aynı hafta başka bir şehirde ' +
        'yaşayan ağabeyi Efe’yi ziyaret etmiş ve onun masasında duran 3.000 TL’yi de habersiz alıp dönmüştür. Durumu öğrenen ' +
        'babası şikâyette bulunmamış, Efe ise şikâyetçi olmuştur.',
      cozum:
        'Yağma ve nitelikli yağma dışında malvarlığına karşı suçlar üstsoyun zararına işlendiğinde ilgili akraba hakkında cezaya ' +
        'hükmolunmaz (TCK m.167/1-b). Deniz’in babasından aldığı para bakımından fiil hırsızlık olarak kalmakla birlikte ' +
        'Deniz’e ceza verilmez. Efe ise aynı konutta yaşamayan bir kardeştir. Bu ilişkide ceza tamamen kalkmaz ve Efe’nin ' +
        'şikâyeti üzerine verilecek ceza yarısı oranında indirilir (TCK m.167/2). Deniz parayı babasından bıçakla tehdit ederek ' +
        'alsaydı fiil yağma olacağından 167. madde hiç uygulanmazdı.',
      sonuc: 'Akrabalık, yağma dışındaki malvarlığı suçlarında yakınlığın derecesine göre cezasızlık ya da şikâyete bağlı indirim sağlar.',
      dayanaklar: [
        { kanun: 'tck', madde: '167', ifade: 'Yağma ve nitelikli yağma hariç' },
        { kanun: 'tck', madde: '167', ifade: 'ilgili akraba hakkında cezaya hükmolunmaz' },
        { kanun: 'tck', madde: '167', ifade: 'aynı konutta beraber yaşamayan kardeşlerden birinin' },
      ],
    },
    {
      baslik: 'Onarım için bırakılan bilgisayarı satan tamirci',
      olay:
        'Levent’in bilgisayar tamir dükkânı vardır. Müşterisi Selin, ekranı kırılan dizüstü bilgisayarını onarılmak üzere ' +
        'Levent’e bırakmıştır. Levent, bilgisayarı onarmış, sonra da ikinci el ilan sitesinde üçüncü bir kişiye satmıştır. ' +
        'Selin bilgisayarı almaya geldiğinde Levent bilgisayarın çalındığını söylemiştir.',
      cozum:
        'Hırsızlık, malın zilyedin rızası olmadan bulunduğu yerden alınmasını gerektirir (TCK m.141). Selin bilgisayarın ' +
        'zilyetliğini Levent’e kendi rızasıyla devrettiğinden hırsızlık oluşmaz. Levent, muhafaza etmek ve onarmak üzere ' +
        'zilyetliği kendisine devredilen mal üzerinde devir amacı dışında tasarrufta bulunmuştur (TCK m.155/1). Bilgisayar, ' +
        'Levent’e ticaret ve hizmet ilişkisinin gereği olarak teslim edildiğinden suçun nitelikli hâli gerçekleşmiş olup bir ' +
        'yıldan yedi yıla kadar hapis ve adlî para cezası öngörülmüştür (TCK m.155/2).',
      sonuc: 'Rızayla devredilen zilyetliğin kötüye kullanılması hırsızlık değil güveni kötüye kullanmadır; meslek ilişkisi suçu niteliklileştirir.',
      dayanaklar: [
        { kanun: 'tck', madde: '141', ifade: 'Zilyedinin rızası olmadan' },
        { kanun: 'tck', madde: '155', ifade: 'zilyedliğin devri amacı dışında tasarrufta bulunan' },
        { kanun: 'tck', madde: '155', ifade: 'ticaret veya hizmet ilişkisinin' },
      ],
    },
  ],
  sinavIskeleti: [
    {
      adim: 'Korunan hukuki değer ve suç tipinin seçimi',
      aciklama: 'Fiilin hangi bölümdeki suça girdiği, korunan değer ve yakın tiplerle sınır (hırsızlık, yağma, güveni kötüye kullanma) belirlenir.',
    },
    {
      adim: 'Maddi unsurlar',
      aciklama: 'Fail, mağdur, suçun konusu ve tipik fiil olaydaki karşılıklarıyla tek tek eşlenir.',
    },
    {
      adim: 'Manevi unsur ve özel maksat',
      aciklama: 'Kastın yanında tipin aradığı yarar sağlama ya da alacak tahsili gibi maksadın bulunup bulunmadığı incelenir.',
    },
    {
      adim: 'Nitelikli hâller ve netice',
      aciklama: 'Ağırlaştırıcı ve hafifletici nitelikli hâller ile neticesi sebebiyle ağırlaşmış hâller ayrı ayrı denetlenir.',
    },
    {
      adim: 'Kovuşturma şartı',
      aciklama: 'Suçun ya da somut hâlin şikâyete bağlı olup olmadığı ve şikâyetin bulunup bulunmadığı belirlenir.',
    },
    {
      adim: 'Cezasızlık ve indirim',
      aciklama: 'Şahsi cezasızlık sebebi, etkin pişmanlık, haksız tahrik ya da değer azlığına bağlı indirim hükümleri uygulanır.',
    },
  ],
  tuzakDefteri: [
    {
      tuzak: 'Kasten yaralamanın her türü şikâyete bağlıdır.',
      dogrusu: 'Yalnız etkisi basit bir tıbbî müdahaleyle giderilebilecek ölçüde hafif olan yaralama şikâyete bağlıdır; nitelikli hâllerde şikâyet aranmaz.',
      dayanak: { kanun: 'tck', madde: '86', ifade: 'basit bir tıbbî müdahaleyle giderilebilecek ölçüde hafif olması hâlinde, mağdurun şikâyeti üzerine' },
    },
    {
      tuzak: 'Taksirle yaralama istisnasız şikâyete bağlıdır.',
      dogrusu: 'Birinci fıkradaki basit hâl dışında, suç bilinçli taksirle işlenmişse şikâyet aranmaz.',
      dayanak: { kanun: 'tck', madde: '89', ifade: 'suçun bilinçli taksirle işlenmesi halinde şikâyet aranmaz' },
    },
    {
      tuzak: 'Mağdurun bulunmadığı ortamda söylenen her hakaret sözü cezalandırılır.',
      dogrusu: 'Mağdurun gıyabındaki hakaretin cezalandırılması için fiilin en az üç kişiyle ihtilat edilerek işlenmesi gerekir.',
      dayanak: { kanun: 'tck', madde: '125', ifade: 'fiilin en az üç kişiyle ihtilat ederek işlenmesi gerekir' },
    },
    {
      tuzak: 'Kasten yaralamaya tepki olarak hakaret eden kişinin cezası yalnız indirilebilir.',
      dogrusu: 'Hakaret kasten yaralama suçuna tepki olarak işlenmişse faile ceza verilmez; başka bir haksız fiile tepkide ise ceza indirilebilir ya da cezadan vazgeçilebilir.',
      dayanak: { kanun: 'tck', madde: '129', ifade: 'kasten yaralama suçuna tepki olarak işlenmesi halinde, kişiye ceza verilmez' },
    },
    {
      tuzak: 'Bayıltılan mağdurun malını alan kişi cebir kullanmadığından hırsızlıktan sorumludur.',
      dogrusu: 'Mağdurun herhangi bir vasıtayla kendisini bilmeyecek ve savunamayacak hâle getirilmesi yağma suçunda cebir sayılır.',
      dayanak: { kanun: 'tck', madde: '148', ifade: 'kendisini bilmeyecek ve savunamayacak hale getirilmesi de, yağma suçunda cebir sayılır' },
    },
    {
      tuzak: 'Kovuşturma başladıktan sonra zararı gideren faile etkin pişmanlık indirimi uygulanmaz.',
      dogrusu: 'Etkin pişmanlık hüküm verilmeden önce gösterilirse cezanın yarısına kadarı indirilir.',
      dayanak: { kanun: 'tck', madde: '168', ifade: 'hüküm verilmezden önce gösterilmesi halinde, verilecek cezanın yarısına kadarı indirilir' },
    },
    {
      tuzak: 'Konutu ortak kullanan kişilerden birinin rızası, girişi her durumda hukuka uygun kılar.',
      dogrusu: 'Ortak kullanıcılardan birinin rızası ancak rıza açıklaması meşru bir amaca yönelikse suçu ortadan kaldırır.',
      dayanak: { kanun: 'tck', madde: '116', ifade: 'rıza açıklamasının meşru bir amaca yönelik olması gerekir' },
    },
  ],
  kisaTest: [
    {
      q: 'Bir insanı kasten öldüren kişiye temel hâlde hangi ceza verilir?',
      choices: ['On beş yıl hapis', 'Yirmi beş yıl hapis', 'Müebbet hapis', 'Ağırlaştırılmış müebbet hapis'],
      answer: 2,
      reason: 'TCK m.81/1 temel hâlde müebbet hapis öngörür; ağırlaştırılmış müebbet hapis m.82’deki nitelikli hâllere özgüdür.',
      dayanak: { kanun: 'tck', madde: '81', ifade: 'Bir insanı kasten öldüren kişi, müebbet hapis cezası ile cezalandırılır' },
    },
    {
      q: 'Hırsızlık gece vakti işlenirse ceza hangi oranda artırılır?',
      choices: ['Üçte bir oranında', 'Yarı oranında', 'Bir kat', 'İki kat'],
      answer: 1,
      reason: 'TCK m.143/1 hırsızlığın gece vakti işlenmesi hâlinde cezanın yarı oranında artırılacağını öngörür.',
      dayanak: { kanun: 'tck', madde: '143', ifade: 'gece vakti işlenmesi halinde, verilecek ceza yarı oranında artırılır' },
    },
    {
      q: 'Hırsızlıkta zarar kovuşturma başlamadan önce tamamen giderilirse ceza en çok ne kadar indirilir?',
      choices: ['Üçte birine kadarı', 'Yarısına kadarı', 'Üçte ikisine kadarı', 'Tamamı'],
      answer: 2,
      reason: 'TCK m.168/1 kovuşturmadan önce zararın tamamen giderilmesi hâlinde cezanın üçte ikisine kadarının indirileceğini öngörür.',
      dayanak: { kanun: 'tck', madde: '168', ifade: 'verilecek cezanın üçte ikisine kadarı indirilir' },
    },
    {
      q: 'Zarar kısmen giderilmişse etkin pişmanlık hükümlerinin uygulanması için ayrıca ne aranır?',
      choices: ['Cumhuriyet savcısının onayı', 'Mağdurun rızası', 'Bilirkişi raporu', 'Teminat gösterilmesi'],
      answer: 1,
      reason: 'TCK m.168/4 kısmen geri verme veya tazmin hâlinde mağdurun rızasını ayrıca arar.',
      dayanak: { kanun: 'tck', madde: '168', ifade: 'ayrıca mağdurun rızası aranır' },
    },
    {
      q: 'Kasten yaralama mağdurun yüzünde sabit ize neden olmuşsa temel cezaya ne olur?',
      choices: ['Yarı oranında artırılır', 'Bir kat artırılır', 'İki kat artırılır', 'Değişmez'],
      answer: 1,
      reason: 'TCK m.87/1-c yüzde sabit iz hâlinde 86. maddeye göre belirlenen cezanın bir kat artırılacağını öngörür.',
      dayanak: { kanun: 'tck', madde: '87', ifade: 'belirlenen ceza, bir kat artırılır' },
    },
    {
      q: 'Yağma suçunun konusu olan malın değeri az ise ceza ne ölçüde indirilebilir?',
      choices: ['Altıda bir oranında', 'Üçte birden yarıya kadar', 'Yarıdan üçte ikiye kadar', 'Ceza verilmez'],
      answer: 1,
      reason: 'TCK m.150/2 değer azlığı nedeniyle yağmada cezanın üçte birden yarıya kadar indirilebileceğini öngörür.',
      dayanak: { kanun: 'tck', madde: '150', ifade: 'verilecek ceza üçte birden yarıya kadar indirilebilir' },
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
