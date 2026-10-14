/**
 * Kıymetli Evrak — kanonik katman (G23). Dayanaklar 6102 sayılı Türk Ticaret Kanunu metnine bağlıdır (`content/mevzuat/ttk`,
 * m.645-823). Olaylar kurmacadır; kişi, tarih ve tutar örnek içindir.
 */
const katman = {
  ders: 'kiymetli-evrak',
  temsilci: { uni: 'ankara', ders: 'kiymetli-evrak-yillik' },
  guncelleme: '2026-10-14',
  ornekOlaylar: [
    {
      baslik: 'Biri vadesiz, öteki tarihsiz iki senet',
      olay:
        'Mobilyacı Hasan, toptancı Levent’e iki senet vermiştir. Birincisinde “bono” kelimesi, 200.000 TL ödeme vaadi, Levent’in ' +
        'adı, “Konya, 3 Mart 2025” düzenleme yeri ve tarihi ile Hasan’ın imzası bulunmakta, vade ve ödeme yeri ise boş ' +
        'bırakılmıştır. İkinci senette 150.000 TL için aynı bilgiler ve vade yazılı olup düzenlenme tarihi yoktur. Levent iki ' +
        'senedi de bono olarak tahsil etmek istemektedir.',
      cozum:
        'Bono, kanunda sayılan yedi unsuru içermelidir. Bunlar arasında vade, ödeme yeri ve düzenlenme tarihi de bulunmaktadır ' +
        '(Türk Ticaret Kanunu (TTK) m.776). Unsurlardan birini içermeyen senet bono sayılmaz, ancak kanun bazı eksikleri ' +
        'tamamlamaktadır (TTK m.777/1). Vadesi gösterilmemiş bono görüldüğünde ödenmesi şart olan bir bono sayılır ve açıklık ' +
        'yoksa düzenlendiği yer ödeme yeridir (TTK m.777/2-3). Birinci senet bu iki tamamlayıcı hükümle Konya’da görüldüğünde ' +
        'ödenecek geçerli bir bonodur. Düzenlenme tarihi için böyle bir tamamlayıcı hüküm bulunmadığından ikinci senet bono ' +
        'sayılmaz. Levent bu senedi kambiyo senedi olarak kullanamaz, alacağını temel ilişkiye dayanarak ister.',
      sonuc:
        'Eksik unsurda önce kanunun tamamlayıcı hükmü aranır; vade ve ödeme yeri tamamlanır, düzenlenme tarihi tamamlanmaz.',
      dayanaklar: [
        { kanun: 'ttk', madde: '776', ifade: 'Düzenlenme tarihini ve yerini' },
        { kanun: 'ttk', madde: '777', ifade: 'unsurlardan birini içermeyen bir senet bono sayılmaz' },
        { kanun: 'ttk', madde: '777', ifade: 'görüldüğünde ödenmesi şart olan bir bono sayılır' },
        { kanun: 'ttk', madde: '777', ifade: 'senedin düzenlendiği yer, ödeme yeri' },
      ],
    },
    {
      baslik: 'Ayıplı mal için verilen bononun iyiniyetli üçüncü kişiye cirosu',
      olay:
        'Ayşe, Berk’ten aldığı tezgâhlar için Berk’in emrine 500.000 TL’lik bir bono düzenlemiştir. Tezgâhlar ayıplı çıkınca ' +
        'Ayşe ödemeyi durdurmuş, Berk ise bonoyu satış ilişkisinden habersiz olan Cem’e ciro edip teslim etmiştir. Vade gelince ' +
        'Cem bonoyu Ayşe’ye ibraz etmiş, Ayşe tezgâhların ayıbını ileri sürerek ödemeyi reddetmiştir.',
      cozum:
        'Poliçenin ciroya ilişkin hükümleri bonolara da uygulanır (TTK m.778/1-a). Bono ciro ve zilyetliğin geçirilmesi yoluyla ' +
        'devredildiğinden Cem’e geçmiştir (TTK m.681/1). Cem, hakkı birbirine bağlı cirolardan anlaşıldığı için yetkili hamildir ' +
        '(TTK m.686/1). Ayşe’nin ayıp itirazı yalnız Berk ile arasındaki satış ilişkisine dayanan kişisel bir def’idir. Kendisine ' +
        'başvurulan kişi bu def’ileri hamile karşı ileri süremez, meğer ki hamil senedi iktisap ederken bile bile borçlunun zararına ' +
        'hareket etmiş olsun (TTK m.687/1). Cem satış ilişkisini bilmediğinden Ayşe bonoyu ödemek zorundadır. Ayşe, ayıptan doğan ' +
        'haklarını Berk’e karşı satış sözleşmesine göre kullanır.',
      sonuc: 'Ciroyla devirde temel ilişkiden doğan def’iler kesilir; istisna, hamilin bile bile borçlunun zararına hareket etmesidir.',
      dayanaklar: [
        { kanun: 'ttk', madde: '778', ifade: 'Poliçelerin cirosuna ilişkin 681 ilâ 690' },
        { kanun: 'ttk', madde: '681', ifade: 'ciro ve zilyetliğin geçirilmesi yoluyla devredilebilir' },
        { kanun: 'ttk', madde: '686', ifade: 'müteselsil ve birbirine bağlı cirolardan anlaşıldığı takdirde, yetkili hamil sayılır' },
        { kanun: 'ttk', madde: '687', ifade: 'bile bile borçlunun zararına hareket etmiş olsun' },
      ],
    },
    {
      baslik: 'Üzerine bir ay sonrasının tarihi yazılan çek',
      olay:
        'Kuyumcu Tuna, 1 Mart’ta Ankara’daki bir müşterisine verdiği ödeme için düzenlenme tarihi olarak 1 Nisan yazdığı bir çeki ' +
        'teslim etmiştir. Çekin ödeneceği banka şubesi de Ankara’dadır. Hamil 5 Mart’ta çeki bankaya ibraz etmiş, Tuna ise çekin ' +
        'Nisan’dan önce ödenemeyeceğini söylemektedir. Hamil ayrıca çeki 20 Nisan’da ibraz etseydi sonucun ne olacağını ' +
        'sormaktadır.',
      cozum:
        'Çek görüldüğünde ödenir ve buna aykırı kayıt yazılmamış hükmündedir. Düzenlenme günü olarak gösterilen günden önce ' +
        'ödenmek için ibraz olunan çek ibraz günü ödenir (TTK m.795). Bu nedenle 5 Mart’taki ibraz geçerlidir. Düzenlendiği yerde ' +
        'ödenecek çek on gün içinde ibraz edilmeli olup bu süre çekte yazılı düzenlenme tarihinin ertesi günü başlar (TTK m.796/1, ' +
        '796/3). Süre 2 Nisan’da başlar ve 11 Nisan’da biter. Hamilin cirantalar, düzenleyen ve diğer çek borçlularına başvurması ' +
        'zamanında ibraz edilmiş ve ödenmemiş bir çeke bağlıdır (TTK m.808). 20 Nisan’daki ibraz geç kaldığından hamil bu ' +
        'başvurma haklarını kaybeder. Kambiyo hukuku bakımından düzenleyene karşı, onun hamilin zararına zenginleştiği ölçüde ' +
        'sebepsiz zenginleşme istemi kalır (TTK m.732, m.818/1-m).',
      sonuc: 'İleri tarihli çek hemen ibraz edilebilir, ama ibraz süresi yazılı tarihe göre işler ve süre kaçırılırsa başvurma hakkı düşer.',
      dayanaklar: [
        { kanun: 'ttk', madde: '795', ifade: 'Düzenlenme günü olarak gösterilen günden önce ödenmek için ibraz olunan çek, ibraz günü ödenir' },
        { kanun: 'ttk', madde: '796', ifade: 'çekte yazılı olan düzenlenme tarihinin ertesi günü başlar' },
        { kanun: 'ttk', madde: '808', ifade: 'Zamanında ibraz edilmiş olan çekin ödenmemiş olduğu' },
        { kanun: 'ttk', madde: '732', ifade: 'onun zararına zenginleşmiş olabilecekleri kadar borçlu kalırlar' },
      ],
    },
    {
      baslik: 'On yedi yaşındaki düzenleyen ve bonoya aval veren arkadaşı',
      olay:
        'On yedi yaşındaki Murat, velisinin rızası olmadan bir motosiklet için 120.000 TL’lik bir bono düzenlemiştir. Arkadaşı ' +
        'Okan senedin ön yüzüne “aval içindir” yazıp imzalamış, kimin için imzaladığını belirtmemiştir. Vade gelince Murat’ın ' +
        'ana ve babası borcu tanımadıklarını bildirmiş, alacaklı ise Okan’a başvurmuştur. Okan, Murat’ın borcu geçersizse kendi ' +
        'borcunun da geçersiz olduğunu savunmaktadır.',
      cozum:
        'Avale ilişkin hükümler bonolara da uygulanır (TTK m.778/3). Okan’ın şerhi “aval içindir” ibaresi ve imza taşıdığından ' +
        'aval şeklindedir (TTK m.701/2). Kimin için verildiği belirtilmeyen aval bonoyu düzenleyen için verilmiş sayılır ' +
        '(TTK m.778/4). Aval veren, kimin için taahhüt altına girmişse aynen onun gibi sorumludur (TTK m.702/1). Teminat altına ' +
        'alınan borç şekle ait noksandan başka bir sebeple batıl olsa da aval verenin taahhüdü geçerlidir (TTK m.702/2). Murat’ın ' +
        'borcundaki sakatlık şekle değil ehliyete ilişkin olduğundan Okan’ın savunması sonuç vermez ve alacaklı bono bedelini ' +
        'Okan’dan isteyebilir.',
      sonuc: 'Aval asıl borçtan bağımsızdır; yalnız şekil eksikliği aval verenin taahhüdünü de düşürür.',
      dayanaklar: [
        { kanun: 'ttk', madde: '778', ifade: 'Avale ilişkin 700 ilâ 702 nci maddeler de bonolar hakkında uygulanır' },
        { kanun: 'ttk', madde: '701', ifade: 'aval veren kişi tarafından imzalanır' },
        { kanun: 'ttk', madde: '778', ifade: 'bonoyu düzenleyen kimse hesabına verilmiş sayılır' },
        { kanun: 'ttk', madde: '702', ifade: 'şekle ait noksandan başka bir sebepten dolayı batıl olsa da aval verenin taahhüdü geçerlidir' },
      ],
    },
  ],
  sinavIskeleti: [
    {
      adim: 'Senedin türü',
      aciklama: 'Senet metnindeki kelime ve zorunlu unsurlarla senedin poliçe, bono ya da çek olup olmadığı belirlenir.',
    },
    {
      adim: 'Şekil eksiği ve tamamlama',
      aciklama: 'Eksik unsur varsa kanunun tamamlayıcı hükmü aranır; tamamlanamayan eksikte senet kambiyo senedi sayılmaz.',
    },
    {
      adim: 'Devir zinciri ve yetkili hamil',
      aciklama: 'Ciro ve teslim, beyaz ciro ve çizilmiş cirolar incelenir; hamilin hakkı birbirine bağlı cirolardan çıkarılır.',
    },
    {
      adim: 'Borçlular ve def’iler',
      aciklama: 'Düzenleyen, ciranta ve aval verenin sorumluluğu ile hamile karşı ileri sürülebilecek ve sürülemeyecek def’iler ayrılır.',
    },
    {
      adim: 'İbraz ve başvurma',
      aciklama: 'İbraz süresi, protesto ya da eş değer beyan ve başvurma haklarının korunması olay tarihlerine uygulanır.',
    },
    {
      adim: 'Zamanaşımı ve zenginleşme',
      aciklama: 'Senetten doğan istemlerin zamanaşımı hesaplanır, haklar düşmüşse sebepsiz zenginleşme istemi denetlenir.',
    },
  ],
  tuzakDefteri: [
    {
      tuzak: 'Açıkça emre yazılı olmayan poliçe ciro edilemez.',
      dogrusu: 'Her poliçe açıkça emre yazılı olmasa da ciroyla devredilebilir; “emre yazılı değildir” kaydı varsa yalnız alacağın temliki yoluyla devredilir.',
      dayanak: { kanun: 'ttk', madde: '681', ifade: 'Her poliçe açıkça emre yazılı olmasa da' },
    },
    {
      tuzak: 'Kıymetli evrakın borçlusu, senet kendisine verilmeden de ödemeye zorlanabilir.',
      dogrusu: 'Kıymetli evrakın borçlusu ancak senedin teslimi karşılığında ödemekle yükümlüdür.',
      dayanak: { kanun: 'ttk', madde: '646', ifade: 'ancak senedin teslimi karşılığında ödeme ile yükümlüdür' },
    },
    {
      tuzak: 'Çeke yazılan vade kaydı geçerlidir ve çek o tarihten önce ödenmez.',
      dogrusu: 'Çek görüldüğünde ödenir, buna aykırı kayıt yazılmamış hükmündedir.',
      dayanak: { kanun: 'ttk', madde: '795', ifade: 'Buna aykırı herhangi bir kayıt yazılmamış hükmündedir' },
    },
    {
      tuzak: 'Tahsil cirosuyla senedi alan hamil onu tam ciroyla başkasına devredebilir.',
      dogrusu: 'Tahsil cirosu alan hamil senetten doğan bütün hakları kullanır, ama senedi ancak tahsil cirosuyla yeniden ciro edebilir.',
      dayanak: { kanun: 'ttk', madde: '688', ifade: 'o poliçeyi ancak tahsil cirosu ile tekrar ciro edebilir' },
    },
    {
      tuzak: 'Nama yazılı senet de emre yazılı senet gibi ciroyla devredilir.',
      dogrusu: 'Nama yazılı senedin devri için zilyetliğin devri yanında yazılı bir devir beyanı gerekir.',
      dayanak: { kanun: 'ttk', madde: '647', ifade: 'nama yazılı senetlerde yazılı bir devir beyanına da gerek vardır' },
    },
    {
      tuzak: 'Açık bırakılan senedin anlaşmaya aykırı doldurulması her hamile karşı ileri sürülebilir.',
      dogrusu: 'Bu iddia hamile karşı ileri sürülemez; hamil kötüniyetli ya da iktisapta ağır kusurluysa sürülebilir.',
      dayanak: { kanun: 'ttk', madde: '680', ifade: 'bu anlaşmalara uyulmadığı iddiası, hamile karşı ileri sürülemez' },
    },
  ],
  kisaTest: [
    {
      q: 'Kıymetli evrakı diğer senetlerden ayıran özellik nedir?',
      choices: [
        'Mutlaka bir bankaca düzenlenmesi',
        'İçerdiği hakkın senetten ayrı ileri sürülememesi ve devredilememesi',
        'Yalnız tacirler arasında kullanılması',
        'Noterce onaylanması',
      ],
      answer: 1,
      reason: 'TTK m.645 kıymetli evrakı, içerdiği hak senetten ayrı olarak ileri sürülemeyen ve devredilemeyen senet olarak tanımlar.',
      dayanak: { kanun: 'ttk', madde: '645', ifade: 'senetten ayrı olarak ileri sürülemediği gibi başkalarına da devredilemez' },
    },
    {
      q: 'Aşağıdakilerden hangisi bononun zorunlu unsurlarından biri değildir?',
      choices: ['Vade', 'Ödeme yeri', 'Muhatabın adı', 'Düzenleyenin imzası'],
      answer: 2,
      reason: 'TTK m.776 bononun unsurlarını sayar ve muhatap bu sayımda yer almaz; muhatap poliçe ve çekin unsurudur.',
      dayanak: { kanun: 'ttk', madde: '776', ifade: 'Kayıtsız ve şartsız belirli bir bedeli ödemek vaadini' },
    },
    {
      q: 'Düzenlendiği yerde ödenecek bir çek hangi süre içinde muhataba ibraz edilmelidir?',
      choices: ['Üç gün', 'On gün', 'Bir ay', 'Üç ay'],
      answer: 1,
      reason: 'TTK m.796/1 düzenlendiği yerde ödenecek çekin on gün, başka yerde ödenecekse bir ay içinde ibraz edilmesini öngörür.',
      dayanak: { kanun: 'ttk', madde: '796', ifade: 'düzenlendiği yerde ödenecekse on gün' },
    },
    {
      q: 'Poliçeyi kabul edene karşı poliçeden doğan istemler ne zaman zamanaşımına uğrar?',
      choices: ['Vadeden altı ay', 'Vadeden bir yıl', 'Vadeden üç yıl', 'Vadeden on yıl'],
      answer: 2,
      reason: 'TTK m.749/1 kabul edene karşı istemlerin vadenin geldiği tarihten itibaren üç yılda zamanaşımına uğrayacağını öngörür.',
      dayanak: { kanun: 'ttk', madde: '749', ifade: 'vadenin geldiği tarihten itibaren üç yıl geçmekle zamanaşımına uğrar' },
    },
    {
      q: 'Kimin için verildiği belirtilmeyen poliçe avali kimin için verilmiş sayılır?',
      choices: ['Muhatap', 'Son ciranta', 'Düzenleyen', 'İlk hamil'],
      answer: 2,
      reason: 'TTK m.701/4 kimin için verildiği belirtilmemiş avalin düzenleyici için verilmiş sayılacağını öngörür.',
      dayanak: { kanun: 'ttk', madde: '701', ifade: 'Kimin için verildiği belirtilmemişse aval, düzenleyici için verilmiş sayılır' },
    },
    {
      q: 'Hamilin çek borçlularına karşı başvurma hakları ne zaman zamanaşımına uğrar?',
      choices: ['İbraz süresinin bitiminden altı ay', 'İbraz süresinin bitiminden bir yıl', 'İbraz süresinin bitiminden üç yıl', 'Düzenlenme tarihinden beş yıl'],
      answer: 2,
      reason: 'TTK m.814/1 hamilin başvurma haklarının ibraz süresinin bitiminden itibaren üç yılda zamanaşımına uğrayacağını öngörür.',
      dayanak: { kanun: 'ttk', madde: '814', ifade: 'ibraz süresinin bitiminden itibaren üç yıl geçmekle zamanaşımına uğrar' },
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
