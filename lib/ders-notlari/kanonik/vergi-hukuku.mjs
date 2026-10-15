/**
 * Vergi hukuku — kanonik katman (G23). Dayanaklar 213 sayılı Vergi Usul Kanunu (`content/mevzuat/vuk`) ve 193 sayılı Gelir Vergisi
 * Kanunu (`content/mevzuat/gvk`) metnine bağlıdır. Olaylar kurmacadır; kişi, tarih ve tutar örnek içindir. Her yıl yeniden değerlenen
 * parasal sınırlar ve uzlaşma hükümleri katmana alınmamıştır.
 */
const katman = {
  ders: 'vergi-hukuku',
  temsilci: { uni: 'ankara', ders: 'vergi-hukuku-yillik' },
  guncelleme: '2026-10-15',
  ornekOlaylar: [
    {
      baslik: 'Kesilmeyen kira stopajı ve “vergiler kiraya verene aittir” kaydı',
      olay:
        'Yıldız Lojistik Anonim Şirketi, Hakan’a ait bir depoyu aylık kira bedeliyle kiralamıştır. Sözleşmeye kira bedelinin net ' +
        'olduğu ve kiraya ilişkin bütün vergileri kiraya verenin ödeyeceği yazılmış, şirket de iki yıl boyunca kira ödemelerinden ' +
        'vergi kesmemiştir. Vergi dairesi kesilmeyen vergiyi şirketten istemiş, şirket ise sözleşme gereği borçlunun Hakan olduğunu ' +
        'ileri sürmüştür.',
      cozum:
        'Ticaret şirketleri, Gelir Vergisi Kanunu (GVK) m.70’te yazılı mal ve hakların kiralanması karşılığında yaptıkları ' +
        'ödemelerden istihkak sahibinin gelir vergisine mahsuben tevkifat yapmaya mecburdur (GVK m.94/1-5-a). Kiraya verilen bina ' +
        'bu mallar arasında sayıldığından Hakan mükellef, şirket ise alacaklı vergi dairesine karşı muhatap olan vergi sorumlusudur ' +
        '(Vergi Usul Kanunu (VUK) m.8/1-2). Vergi kesmeye mecbur olan şirket, verginin tam olarak kesilip ödenmesinden sorumludur ' +
        '(VUK m.11/1). Vergi sorumluluğuna ilişkin özel sözleşmeler vergi dairesini bağlamadığından şirketin savunması vergi dairesine ' +
        'karşı sonuç doğurmaz (VUK m.8/3). Şirket ödediği vergi için asıl mükellef Hakan’a rücu edebilir, sözleşme kaydı da ancak bu ' +
        'iç ilişkide anlam taşır (VUK m.11/2).',
      sonuc: 'Kiracı şirket kesmediği stopajdan vergi dairesine karşı sorumludur; sözleşme kaydı yalnız Hakan’a rücuda önem taşır.',
      dayanaklar: [
        { kanun: 'gvk', madde: '94', ifade: '70 inci maddede yazılı mal ve hakların kiralanması karşılığı yapılan' },
        { kanun: 'gvk', madde: '70', ifade: 'Arazi, bina' },
        { kanun: 'vuk', madde: '8', ifade: 'alacaklı vergi dairesine karşı muhatap olan kişidir' },
        { kanun: 'vuk', madde: '11', ifade: 'verginin tam olarak kesilip ödenmesinden ve bununla ilgili diğer ödevleri yerine getirmekten sorumludurlar' },
        { kanun: 'vuk', madde: '8', ifade: 'özel mukaveleler vergi dairelerini bağlamaz' },
        { kanun: 'vuk', madde: '11', ifade: 'asıl mükelleflere rücu etmek hakkını kaldırmaz' },
      ],
    },
    {
      baslik: 'Ticaret sicilinden silinen limited şirketin vergi borcu',
      olay:
        'Ali ile Banu’nun sırasıyla yüzde altmış ve yüzde kırk payla ortak oldukları limited şirketi Ali müdür olarak yönetmiştir. ' +
        'Şirket 2023 yılında tasfiyeye girmiş, tasfiye memuru olarak atanan Banu tasfiye sonunda kalan malvarlığını ortaklara ' +
        'dağıtmış ve şirket ticaret sicilinden silinmiştir. 2025 yılındaki incelemede şirketin hem tasfiyeden önceki 2022 yılına ' +
        'hem de tasfiye dönemine ait vergi farkları tespit edilmiştir.',
      cozum:
        'Tasfiye edilerek tüzel kişiliği sicilden silinmiş mükellefin tasfiye öncesi dönemlerine ilişkin vergi tarhiyatı ve ceza ' +
        'kesme işlemi, müteselsilen sorumlu olmak üzere kanuni temsilcilerden herhangi biri adına, tasfiye dönemine ilişkin ' +
        'işlemler ise tasfiye memurlarından herhangi biri adına yapılır (VUK m.10/5). Buna göre 2022 yılına ait tarhiyat müdür ' +
        'Ali, tasfiye dönemine ait tarhiyat ise Banu adına yapılmaktadır. Limited şirket ortağı olarak Banu, tasfiye öncesi ' +
        'dönemlere ait alacaklardan ayrıca şirkete koyduğu sermaye hissesi oranında sorumlu olmakla birlikte tasfiye memuru ' +
        'sıfatıyla sorumluluğu tasfiye sonucu dağıtılan tutarla sınırlıdır. Tasfiye, kanuni temsilcinin tasfiyeye giriş ' +
        'tarihinden önceki zamanlara ait sorumluluğunu da kaldırmaz (VUK m.10/4).',
      sonuc: 'Tasfiye öncesi dönemde kanuni temsilci, tasfiye döneminde tasfiye memuru muhataptır; ortak sermaye payı oranında sorumludur.',
      dayanaklar: [
        { kanun: 'vuk', madde: '10', ifade: 'tasfiye öncesi dönemler için kanuni temsilcilerden, tasfiye dönemi için tasfiye memurlarından herhangi biri adına yapılır' },
        { kanun: 'vuk', madde: '10', ifade: 'şirkete koydukları sermaye hisseleri oranında sorumlu olurlar' },
        { kanun: 'vuk', madde: '10', ifade: 'tasfiye sonucu dağıtılan tutarla sınırlıdır' },
        { kanun: 'vuk', madde: '10', ifade: 'tasfiyeye giriş tarihinden önceki zamanlara ait sorumluluklarını da kaldırmaz' },
      ],
    },
    {
      baslik: 'Takdir komisyonuna sevk ve tarh zamanaşımı',
      olay:
        'Deniz, 2020 yılında kiraya verdiği dairesinden elde ettiği geliri içeren yıllık beyannameyi kanuni süresinde vermemiştir. ' +
        'Vergi dairesi matrahın takdiri için 2 Haziran 2025’te takdir komisyonuna başvurmuş, komisyon kararı 1 Ekim 2025’te vergi ' +
        'dairesine tevdi edilmiştir. Re’sen tarh edilen vergiye ilişkin ihbarname Deniz’e 10 Mart 2026’da tebliğ edilmiş, Deniz de ' +
        'verginin 2025 yılı sonunda zamanaşımına uğradığını ileri sürmüştür.',
      cozum:
        'Vergi beyannamesi kanuni süresi geçtiği hâlde verilmemişse matrahın defter, kayıt ve belgelere dayanılarak tespiti mümkün ' +
        'sayılmaz ve vergi re’sen tarh edilir (VUK m.30/2-1). Vergi alacağının doğduğu takvim yılını takip eden yılın başından ' +
        'başlayarak beş yıl içinde tarh ve tebliğ edilmeyen vergi zamanaşımına uğradığından süre kural olarak 31 Aralık 2025’te ' +
        'dolmaktadır (VUK m.114/1). Takdir komisyonuna başvurulması zamanaşımını durdurur ve süre, komisyon kararının vergi ' +
        'dairesine tevdiini takip eden günden kaldığı yerden işler (VUK m.114/2). İşlemeyen dört aylık süre kanundaki bir yıllık ' +
        'üst sınırın altında kaldığından zamanaşımı aynı süre kadar uzayarak Mayıs 2026 başında dolmakta, 10 Mart 2026’daki tebliğ de süresinde ' +
        'yapılmıştır. Deniz hakkında ziyaa uğratılan verginin bir katı tutarında vergi ziyaı cezası da kesilir (VUK m.344/1).',
      sonuc: 'Takdir komisyonuna sevk zamanaşımını en çok bir yıl durdurur; dört aylık durma tebliği süre içine almıştır.',
      dayanaklar: [
        { kanun: 'vuk', madde: '30', ifade: 'Vergi beyannamesi kanuni süresi geçtiği halde verilmemişse' },
        { kanun: 'vuk', madde: '114', ifade: 'beş yıl içinde tarh ve mükellefe tebliğ edilmiyen vergiler zamanaşımına uğrar' },
        { kanun: 'vuk', madde: '114', ifade: 'takdir komisyonuna başvurulması, zamanaşımını durdurur' },
        { kanun: 'vuk', madde: '114', ifade: 'işlemeyen süre her hâl ve takdirde bir yıldan fazla olamaz' },
        { kanun: 'vuk', madde: '344', ifade: 'ziyaa uğratılan verginin bir katı tutarında vergi ziyaı cezası kesilir' },
      ],
    },
    {
      baslik: 'Kendiliğinden düzeltme ile inceleme sonrası düzeltme',
      olay:
        'Mobilya satıcısı Kemal, verdiği beyannamede bir satışını eksik gösterdiğini fark etmiş ve hakkında herhangi bir ihbar ya ' +
        'da inceleme yokken durumu vergi dairesine dilekçeyle bildirmiştir. Kemal on gün içinde düzeltme beyannamesi vermiş, ' +
        'ödeme süresi geçmiş vergiyi de kanundaki zamla birlikte aynı süre içinde ödemiştir. Aynı hatayı yapan komşusu Selin ise ' +
        'durumu nezdinde vergi incelemesi başladıktan sonra bildirmiş, ardından vergi ve ceza ihbarnamesi kendisine tebliğ edilmiştir.',
      cozum:
        'Beyana dayanan vergilerde vergi ziyaı cezasını gerektiren fiili kendiliğinden dilekçeyle haber veren mükellef hakkında, ' +
        'kanundaki koşullar gerçekleşirse vergi ziyaı cezası kesilmez (VUK m.371/1). Kemal’in dilekçesi inceleme başlamadan ' +
        'verilmiş, eksik beyan haber verme tarihinden başlayarak on beş gün içinde düzeltilmiş ve vergi zammıyla birlikte aynı ' +
        'sürede ödenmiştir (VUK m.371/1-2, 4, 5). Selin’in bildirimi inceleme başladıktan sonra yapıldığından pişmanlıktan ' +
        'yararlanamamaktadır. Selin, ihbarnamenin tebliğinden itibaren otuz gün içinde vergi dairesine başvurup vergiyi ve cezanın ' +
        'yarısını vadesinde ödeyeceğini bildirirse kesilen cezanın yarısı indirilir (VUK m.376/1-1). Bildirdiği tutarı süresinde ' +
        'ödemez ya da dava konusu yaparsa indirimden yararlanamaz (VUK m.376/2).',
      sonuc: 'İncelemeden önce kendiliğinden haber veren cezadan kurtulur; inceleme sonrası mükellef ancak ceza indirimine başvurabilir.',
      dayanaklar: [
        { kanun: 'vuk', madde: '371', ifade: 'kanuna aykırı hareketlerini ilgili makamlara kendiliğinden dilekçe ile haber vermesi' },
        { kanun: 'vuk', madde: '371', ifade: 'vergi incelemesine başlandığı' },
        { kanun: 'vuk', madde: '371', ifade: 'haber verme tarihinden başlayarak onbeş gün içinde tamamlanması veya düzeltilmesi' },
        { kanun: 'vuk', madde: '376', ifade: 'otuz gün içinde ilgili vergi dairesine başvurarak' },
        { kanun: 'vuk', madde: '376', ifade: 'dava konusu yaparsa bu madde hükmünden faydalandırılmaz' },
      ],
    },
  ],
  sinavIskeleti: [
    {
      adim: 'Vergiyi doğuran olay',
      aciklama: 'Vergi kanununun vergiyi bağladığı olayın gerçekleşip gerçekleşmediği ve olayın gerçek mahiyeti belirlenir.',
    },
    {
      adim: 'Mükellef ve sorumlu',
      aciklama: 'Vergi borcunun kime terettüp ettiği, vergi sorumlusu, kanuni temsilci ya da vergi kesen bulunup bulunmadığı ayrılır.',
    },
    {
      adim: 'Tarh türü',
      aciklama: 'Verginin beyan üzerine mi, ikmalen mi, re’sen mi yoksa idarece mi tarh edileceği gerekçesiyle saptanır.',
    },
    {
      adim: 'Tebliğ ve zamanaşımı',
      aciklama: 'Tebliğin bilinen adrese ya da ilanla usulüne uygun yapılıp yapılmadığı ve beş yıllık tarh zamanaşımının durup durmadığı hesaplanır.',
    },
    {
      adim: 'Ceza ve indirim yolları',
      aciklama: 'Fiilin vergi ziyaı mı usulsüzlük mü olduğu, cezanın katı ile pişmanlık ve ceza indirimi koşulları sırasıyla değerlendirilir.',
    },
  ],
  tuzakDefteri: [
    {
      tuzak: 'Vergi kanunları yalnız lafzıyla uygulanır, kanunun amacına bakılmaz.',
      dogrusu: 'Vergi kanunları lafzı ve ruhu ile hüküm ifade eder; lafız açık değilse konuluş amacı, sistematik yeri ve bağlantısı gözetilir.',
      dayanak: { kanun: 'vuk', madde: '3', ifade: 'Vergi kanunları lafzı ve ruhu ile hüküm ifade eder' },
    },
    {
      tuzak: 'Vergiyi doğuran olay yalnız yazılı belgeyle ispatlanabilir.',
      dogrusu: 'Vergiyi doğuran olay yemin hariç her türlü delille ispatlanabilir; olayla ilgisi tabii ve açık olmayan tanık beyanı ise kullanılamaz.',
      dayanak: { kanun: 'vuk', madde: '3', ifade: 'yemin hariç her türlü delille ispatlanabilir' },
    },
    {
      tuzak: 'Olağan dışı bir durumun varlığını ispat yükü her durumda idareye aittir.',
      dogrusu: 'İktisadi, ticari ve teknik icaplara uymayan ya da olağan olmayan bir durumu iddia eden taraf bunu ispat eder.',
      dayanak: { kanun: 'vuk', madde: '3', ifade: 'ispat külfeti bunu iddia eden tarafa aittir' },
    },
    {
      tuzak: 'Tarh ile tahakkuk aynı işlemdir.',
      dogrusu: 'Tarh vergi alacağını miktar olarak tespit eden idari işlemdir; tahakkuk tarh ve tebliğ edilen verginin ödenmesi gereken safhaya gelmesidir.',
      dayanak: { kanun: 'vuk', madde: '22', ifade: 'tarh ve tebliğ edilen bir verginin ödenmesi gereken' },
    },
    {
      tuzak: 'Eksik vergi sonradan tahakkuk ettirilip ödenirse vergi ziyaı cezası kesilemez.',
      dogrusu: 'Verginin sonradan tahakkuk ettirilmesi veya tamamlanması ceza uygulanmasına engel değildir.',
      dayanak: { kanun: 'vuk', madde: '341', ifade: 'ceza uygulanmasına mani teşkil etmez' },
    },
    {
      tuzak: 'Pişmanlık hükümleri emlak vergisi dahil bütün vergilerde uygulanır.',
      dogrusu: 'Pişmanlık beyana dayanan vergilerde uygulanır ve kanun emlak vergisini açıkça dışarıda bırakır.',
      dayanak: { kanun: 'vuk', madde: '371', ifade: 'emlak vergisi ile ilgili olarak uygulanmaz' },
    },
    {
      tuzak: 'Usulsüzlük, verginin eksik tahakkuk etmesi demektir.',
      dogrusu: 'Usulsüzlük vergi kanunlarının şekle ve usule ilişkin hükümlerine uyulmamasıdır; eksik tahakkuk vergi ziyaıdır.',
      dayanak: { kanun: 'vuk', madde: '351', ifade: 'şekle ve usule mütaallik hükümlerine riayet edilmemesidir' },
    },
  ],
  kisaTest: [
    {
      q: 'Tarh zamanaşımı süresi hangi tarihten başlar ve kaç yıldır?',
      choices: [
        'Vergiyi doğuran olay tarihinden itibaren beş yıl',
        'Vergi alacağının doğduğu takvim yılını takip eden yılın başından itibaren beş yıl',
        'Beyannamenin verilmesi gereken tarihten itibaren on yıl',
        'Vergi alacağının doğduğu yılın başından itibaren üç yıl',
      ],
      answer: 1,
      reason: 'VUK m.114/1 vergi alacağının doğduğu takvim yılını takip eden yılın başından başlayarak beş yıllık süreyi öngörür.',
      dayanak: { kanun: 'vuk', madde: '114', ifade: 'takip eden yılın başından başlıyarak beş yıl içinde' },
    },
    {
      q: 'Takdir komisyonuna başvurulması nedeniyle işlemeyen zamanaşımı süresi en çok ne kadar olabilir?',
      choices: ['Üç ay', 'Altı ay', 'Bir yıl', 'İki yıl'],
      answer: 2,
      reason: 'VUK m.114/2 takdir komisyonuna başvuru nedeniyle işlemeyen sürenin her hâlde bir yıldan fazla olamayacağını öngörür.',
      dayanak: { kanun: 'vuk', madde: '114', ifade: 'bir yıldan fazla olamaz' },
    },
    {
      q: 'Vergi ziyaına VUK m.359’da yazılı fiillerle sebebiyet verilirse vergi ziyaı cezası kaç kat uygulanır?',
      choices: ['Bir kat', 'İki kat', 'Üç kat', 'Dört kat'],
      answer: 2,
      reason: 'VUK m.344/2 bu hâlde cezanın üç kat, fiillere iştirak edenlere ise bir kat uygulanacağını öngörür.',
      dayanak: { kanun: 'vuk', madde: '344', ifade: 'bu ceza üç kat' },
    },
    {
      q: 'İnceleme ya da takdire sevkten önce kanuni süresi geçtikten sonra verilen beyanname için vergi ziyaı cezası hangi oranda uygulanır?',
      choices: ['Yüzde yirmi beş', 'Yüzde elli', 'Yüzde yetmiş beş', 'Tam olarak'],
      answer: 1,
      reason: 'VUK m.344/3 kanuni süresi geçtikten sonra kendiliğinden verilen beyannameler için cezanın yüzde elli oranında uygulanacağını öngörür.',
      dayanak: { kanun: 'vuk', madde: '344', ifade: 'kesilecek ceza yüzde elli oranında uygulanır' },
    },
    {
      q: 'Pişmanlıkla haber verilen eksik beyan, haber verme tarihinden itibaren hangi süre içinde düzeltilmelidir?',
      choices: ['Yedi gün', 'On beş gün', 'Otuz gün', 'Bir ay'],
      answer: 1,
      reason: 'VUK m.371/1-4 eksik veya yanlış beyanın haber verme tarihinden başlayarak on beş gün içinde tamamlanmasını ya da düzeltilmesini arar.',
      dayanak: { kanun: 'vuk', madde: '371', ifade: 'onbeş gün içinde tamamlanması veya düzeltilmesi' },
    },
    {
      q: 'Yerleşim yeri adresinde iki kez bulunamayan muhataba pusula yapıştırılarak yapılan tebliğ, evrak alınmazsa hangi gün yapılmış sayılır?',
      choices: ['Pusulanın yapıştırıldığı gün', 'Yedinci gün', 'On beşinci gün', 'Otuzuncu gün'],
      answer: 2,
      reason: 'VUK m.102/5 evrak pusulanın yapıştırıldığı tarihten itibaren on beş gün içinde alınmazsa tebliğin on beşinci günde yapılmış sayılacağını öngörür.',
      dayanak: { kanun: 'vuk', madde: '102', ifade: 'on beşinci günde tebliğ yapılmış sayılır' },
    },
  ],
  kaynaklar: [
    {
      title: '213 sayılı Vergi Usul Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.4.213.pdf',
      note: 'Örnek olay, tuzak ve test dayanaklarının resmî metni',
    },
    {
      title: '193 sayılı Gelir Vergisi Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.4.193.pdf',
      note: 'Kira ödemelerinde tevkifat ve gayrimenkul sermaye iradı dayanakları',
    },
  ],
};

export default katman;
