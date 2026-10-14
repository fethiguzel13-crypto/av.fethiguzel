/**
 * Medeni Hukuka Giriş ve Başlangıç Hükümleri — kanonik katman (G23). Dayanaklar 4721 sayılı Türk Medenî Kanunu metnine
 * bağlıdır (`content/mevzuat/tmk`, m.1-35). Olaylar kurmacadır; kişi, tarih ve tutar örnek içindir.
 */
const katman = {
  ders: 'medeni-baslangic',
  temsilci: { uni: 'ankara', ders: 'medeni-baslangic-yillik' },
  guncelleme: '2026-10-14',
  ornekOlaylar: [
    {
      baslik: 'On altı yaşındaki Efe: taksitli telefon, teyzeden dizüstü bilgisayar ve kırılan cam',
      olay:
        'On altı yaşındaki Efe, ana ve babasına sormadan bir mağazadan 60.000 TL’lik bir telefonu on iki taksitle satın almıştır. ' +
        'Aynı ay teyzesi ona bir dizüstü bilgisayar hediye etmiştir. Efe bir hafta sonra sokakta top oynarken komşusunun camını ' +
        'kırmıştır. Ana ve baba telefon sözleşmesini onaylamadıklarını mağazaya bildirmiş, komşu ise camın bedelini Efe’den ' +
        'istemektedir.',
      cozum:
        'Erginlik on sekiz yaşın doldurulmasıyla başladığından Efe küçüktür (Türk Medenî Kanunu (TMK) m.11) ve küçüklerin fiil ' +
        'ehliyeti yoktur (TMK m.14). Efe ayırt etme gücüne sahip olup yasal temsilcilerinin rızası olmadıkça kendi işlemleriyle ' +
        'borç altına giremez (TMK m.16/1). Ana ve baba rıza vermediğinden Efe taksitli satıştan doğan borçla bağlı değildir. ' +
        'Teyzenin bağışı ise karşılıksız bir kazanmadır ve bu durumda yasal temsilcinin rızası aranmaz. Camın kırılması bir ' +
        'hukuki işlem değil haksız fiildir. Ayırt etme gücüne sahip küçükler haksız fiillerinden sorumlu olduğundan komşu ' +
        'zararını Efe’den isteyebilir (TMK m.16/2).',
      sonuc:
        'Ayırt etme gücü olan küçükte üç ayrı rejim vardır: Borç doğuran işlemde rıza aranır, karşılıksız kazanmada aranmaz, haksız fiilde sorumluluk doğar.',
      dayanaklar: [
        { kanun: 'tmk', madde: '11', ifade: 'Erginlik onsekiz yaşın doldurulmasıyla başlar' },
        { kanun: 'tmk', madde: '14', ifade: 'küçüklerin ve kısıtlıların fiil ehliyeti yoktur' },
        { kanun: 'tmk', madde: '16', ifade: 'Karşılıksız kazanmada ve kişiye sıkı sıkıya bağlı hakları kullanmada bu rıza gerekli değildir' },
        { kanun: 'tmk', madde: '16', ifade: 'haksız fiillerinden sorumludurlar' },
      ],
    },
    {
      baslik: 'Haber sitesinde fotoğrafla yayımlanan asılsız iddia',
      olay:
        'İzmir’de oturan eczacı Selma’nın fotoğrafı, merkezi Ankara’da bulunan bir haber sitesinde “son kullanma tarihi geçmiş ' +
        'ilaç satıyor” başlığıyla yayımlanmıştır. İddia gerçeğe aykırıdır ve Selma’nın eczanesine gelen hasta sayısı belirgin ' +
        'biçimde azalmıştır. Haber yayında kalmaktadır. Selma hangi istemlerde bulunabileceğini ve davayı nerede açabileceğini ' +
        'sormaktadır.',
      cozum:
        'Hukuka aykırı olarak kişilik hakkına saldırılan kimse hâkimden korunma isteyebilir (TMK m.24/1). Saldırı, zedelenen ' +
        'kişinin rızası, daha üstün nitelikte özel veya kamusal yarar ya da kanunun verdiği yetki ile haklı kılınmadıkça hukuka ' +
        'aykırıdır (TMK m.24/2). Bir hukuka uygunluk sebebi ileri süren site, buna dayanak olguları ispatla yükümlüdür (TMK m.6). ' +
        'Haber yayında kaldığı için Selma sürmekte olan saldırıya son verilmesini, ayrıca düzeltmenin yayımlanmasını isteyebilir ' +
        '(TMK m.25/1-2). Hasta kaybından doğan maddî zarar ile manevî tazminat istemleri saklıdır (TMK m.25/3). Selma davayı ' +
        'kendi yerleşim yeri olan İzmir’de ya da davalının yerleşim yeri mahkemesinde açabilir (TMK m.25/son).',
      sonuc:
        'Kişilik hakkı davasında saldırıya son verme, tespit, düzeltme ve tazminat istemleri birlikte açılabilir; yetkide davacıya seçimlik hak tanınmıştır.',
      dayanaklar: [
        { kanun: 'tmk', madde: '24', ifade: 'saldırıda bulunanlara karşı korunmasını isteyebilir' },
        { kanun: 'tmk', madde: '24', ifade: 'daha üstün nitelikte özel veya kamusal yarar' },
        { kanun: 'tmk', madde: '6', ifade: 'hakkını dayandırdığı olguların varlığını ispatla yükümlüdür' },
        { kanun: 'tmk', madde: '25', ifade: 'sürmekte olan saldırıya son verilmesini' },
        { kanun: 'tmk', madde: '25', ifade: 'kendi yerleşim yeri veya davalının yerleşim yeri mahkemesinde dava açabilir' },
      ],
    },
    {
      baslik: 'Fırtınada batan teknede kaybolan balıkçı',
      olay:
        'Balıkçı Kaan’ın teknesi 10 Mart 2024’te fırtınada batmış, iki tayfa kurtarılmış, Kaan’ın cesedi ise bulunamamıştır. ' +
        'Kaan’ın son yerleşim yeri Sinop’tur. Eşi Elif, mirasın paylaşılabilmesi ve bankadaki hesapların kullanılabilmesi için ' +
        'ne yapması gerektiğini sormaktadır. Elif başvurunun Haziran 2024’te yapılmasını istemektedir.',
      cozum:
        'Kişi ölümüne kesin gözle bakılmayı gerektiren durumlar içinde kaybolmuşsa cesedi bulunamasa bile ölmüş sayılır (TMK ' +
        'm.31). Olayda iki kişinin kurtulmuş olması bu kesinliği tartışmalı kılarsa yol gaipliktir. Ölüm tehlikesi içinde ' +
        'kaybolan kişinin gaipliğine, hakları bu ölüme bağlı olanların başvurusu üzerine son yerleşim yeri olan Sinop mahkemesi ' +
        'karar verir (TMK m.32). Gaiplik ölüm tehlikesinin üzerinden en az bir yıl geçtikten sonra istenebildiğinden Haziran ' +
        '2024’teki başvuru erkendir ve en erken tarih 10 Mart 2025’tir. Mahkeme, ilk ilandan başlayarak en az altı aylık süre ' +
        'verir (TMK m.33). Karar ölüm tehlikesinin gerçekleştiği günden başlayarak hüküm doğurur ve mirasçılar hakları gaibin ' +
        'ölümü ispatlanmış gibi kullanır (TMK m.35).',
      sonuc: 'Ölüm karinesi kesinlik ister, gaiplik ise süreye bağlıdır; gaiplik kararı geriye, ölüm tehlikesi gününe yürür.',
      dayanaklar: [
        { kanun: 'tmk', madde: '31', ifade: 'cesedi bulunamamış olsa bile gerçekten ölmüş sayılır' },
        { kanun: 'tmk', madde: '32', ifade: 'kişinin Türkiye\'deki son yerleşim yeri' },
        { kanun: 'tmk', madde: '33', ifade: 'ölüm tehlikesinin üzerinden en az bir yıl' },
        { kanun: 'tmk', madde: '35', ifade: 'son haberin alındığı günden başlayarak hüküm doğurur' },
      ],
    },
    {
      baslik: 'Çevresinde başka adla tanınan kişinin ad değiştirme istemi',
      olay:
        'Nüfusta “Fadime” adıyla kayıtlı olan bir öğretmen, okulda, ailesinde ve sosyal çevresinde yıllardır “Defne” adıyla ' +
        'tanınmaktadır. Resmî işlemlerde iki ad arasındaki fark sürekli açıklama gerektirmektedir. Öğretmen nüfus müdürlüğüne ' +
        'giderek adının değiştirilmesini istemiş, müdürlük ise yetkisi olmadığını bildirmiştir. Bir alacaklısı da ad değişirse ' +
        'borcun takibinin zorlaşacağını söylemektedir.',
      cozum:
        'Adın değiştirilmesi ancak haklı sebeplere dayanılarak hâkimden istenebilir (TMK m.27/1), bu yüzden nüfus müdürlüğünün ' +
        'cevabı yerindedir. Haklı sebebin varlığını hâkim hukuka ve hakkaniyete göre takdir eder (TMK m.4). Değişiklik nüfus ' +
        'siciline kaydedilir ve Basın İlan Kurumunun ilan portalında ilan olunur (TMK m.27/2). Alacaklının kaygısı yersizdir, zira ' +
        'ad değişmekle kişisel durum değişmez ve borç aynı kişiye ait kalır. Değişiklikten zarar gören kimse, bunu öğrendiği ' +
        'günden başlayarak bir yıl içinde kararın kaldırılmasını dava edebilir (TMK m.27/son).',
      sonuc: 'Ad değişikliği idari bir işlem değil, haklı sebebe dayanan bir mahkeme kararıdır ve kişinin hak ve borçlarını değiştirmez.',
      dayanaklar: [
        { kanun: 'tmk', madde: '27', ifade: 'ancak haklı sebeplere dayanılarak hâkimden istenebilir' },
        { kanun: 'tmk', madde: '4', ifade: 'hâkim, hukuka ve hakkaniyete göre karar verir' },
        { kanun: 'tmk', madde: '27', ifade: 'Ad değişmekle kişisel durum değişmez' },
      ],
    },
  ],
  sinavIskeleti: [
    {
      adim: 'Uygulanacak kuralın bulunması',
      aciklama: 'Önce kanunun sözü ve özü yoklanır; hüküm yoksa örf ve âdet, o da yoksa hâkimin koyacağı kural sırası izlenir.',
    },
    {
      adim: 'Kişi ve ehliyet',
      aciklama: 'Hak ehliyeti, ayırt etme gücü, erginlik ve kısıtlılık belirlenir; kişinin hangi ehliyet grubunda olduğu yazılır.',
    },
    {
      adim: 'Hakkın kullanılması',
      aciklama: 'Dürüstlük kuralı, hakkın açıkça kötüye kullanılması ve iyiniyet karinesinin sınırı olaya uygulanır.',
    },
    {
      adim: 'İspat ve takdir',
      aciklama: 'İspat yükünün kimde olduğu, resmî sicil ve senetlerin kanıt gücü ve hâkimin takdir yetkisinin ölçüsü gösterilir.',
    },
    {
      adim: 'Kişiliğin korunması',
      aciklama: 'Saldırının hukuka aykırılığı, uygunluk sebepleri ve davacının seçebileceği istemler sırayla incelenir.',
    },
    {
      adim: 'Sonuç ve yetkili mahkeme',
      aciklama: 'İstem, dayanak maddesi ve kanunun öngördüğü yetkili mahkeme ile birlikte tek cümlede kurulur.',
    },
  ],
  tuzakDefteri: [
    {
      tuzak: 'Kanunda hüküm yoksa hâkim doğrudan hakkaniyete göre karar verir.',
      dogrusu: 'Hâkim önce örf ve âdet hukukuna, o da yoksa kanun koyucu olsaydı koyacağı kurala göre karar verir.',
      dayanak: { kanun: 'tmk', madde: '1', ifade: 'hâkim, örf ve âdet hukukuna göre' },
    },
    {
      tuzak: 'İyiniyet iddia eden kişi iyiniyetini ispat etmek zorundadır.',
      dogrusu: 'Kanunun iyiniyete sonuç bağladığı durumlarda asıl olan iyiniyetin varlığıdır, ancak beklenen özeni göstermeyen iyiniyet iddia edemez.',
      dayanak: { kanun: 'tmk', madde: '3', ifade: 'asıl olan iyiniyetin varlığıdır' },
    },
    {
      tuzak: 'Bir kişinin aynı anda iki yerleşim yeri olabilir.',
      dogrusu: 'Bir kimsenin aynı zamanda birden çok yerleşim yeri olamaz; bu kural ticari ve sınai kuruluşlara uygulanmaz.',
      dayanak: { kanun: 'tmk', madde: '19', ifade: 'aynı zamanda birden çok yerleşim yeri olamaz' },
    },
    {
      tuzak: 'Küçük on altı yaşında kendi başvurusuyla ergin kılınabilir.',
      dogrusu: 'Ergin kılınma için on beş yaşın doldurulması, küçüğün isteği, velinin rızası ve mahkeme kararı gerekir.',
      dayanak: { kanun: 'tmk', madde: '12', ifade: 'kendi isteği ve velisinin rızasıyla mahkemece ergin kılınabilir' },
    },
    {
      tuzak: 'Ana rahmindeki çocuğun hiçbir hak ehliyeti yoktur.',
      dogrusu: 'Çocuk, sağ doğmak koşuluyla hak ehliyetini ana rahmine düştüğü andan başlayarak elde eder.',
      dayanak: { kanun: 'tmk', madde: '28', ifade: 'sağ doğmak koşuluyla, ana rahmine düştüğü andan başlayarak' },
    },
    {
      tuzak: 'Kayın hısımlığı, onu doğuran evlilik boşanmayla sona erince kalkar.',
      dogrusu: 'Kayın hısımlığı kendisini meydana getiren evliliğin sona ermesiyle ortadan kalkmaz.',
      dayanak: { kanun: 'tmk', madde: '18', ifade: 'evliliğin sona ermesiyle ortadan kalkmaz' },
    },
    {
      tuzak: 'Manevî tazminat istemi her durumda mirasçılara geçer.',
      dogrusu: 'Manevî tazminat istemi mirasbırakan tarafından ileri sürülmüş olmadıkça mirasçılara geçmez.',
      dayanak: { kanun: 'tmk', madde: '25', ifade: 'miras bırakan tarafından ileri sürülmüş olmadıkça mirasçılara geçmez' },
    },
  ],
  kisaTest: [
    {
      q: 'Kanuna göre erginlik hangi yaşın doldurulmasıyla başlar?',
      choices: ['On beş', 'On altı', 'On yedi', 'On sekiz'],
      answer: 3,
      reason: 'TMK m.11 erginliğin on sekiz yaşın doldurulmasıyla başladığını, evlenmenin de kişiyi ergin kıldığını öngörür.',
      dayanak: { kanun: 'tmk', madde: '11', ifade: 'Evlenme kişiyi ergin kılar' },
    },
    {
      q: 'Birden fazla kişiden hangisinin önce öldüğü ispat edilemezse ne olur?',
      choices: ['Yaşça büyük olan önce ölmüş sayılır.', 'Hepsi aynı anda ölmüş sayılır.', 'Hâkim hakkaniyete göre sıra belirler.', 'Yaşça küçük olan önce ölmüş sayılır.'],
      answer: 1,
      reason: 'TMK m.29/2 hangisinin önce öldüğü ispat edilemeyen kişilerin hepsinin aynı anda ölmüş sayılacağını öngörür.',
      dayanak: { kanun: 'tmk', madde: '29', ifade: 'hepsi aynı anda ölmüş sayılır' },
    },
    {
      q: 'Uzun zamandan beri haber alınamayan kişinin gaipliği, son haberden en az ne kadar süre sonra istenebilir?',
      choices: ['Bir yıl', 'Üç yıl', 'Beş yıl', 'On yıl'],
      answer: 2,
      reason: 'TMK m.33/1 gaipliğin ölüm tehlikesinden en az bir yıl, son haber tarihinden en az beş yıl sonra istenebileceğini öngörür.',
      dayanak: { kanun: 'tmk', madde: '33', ifade: 'son haber tarihinin üzerinden en az beş yıl' },
    },
    {
      q: 'Resmî sicil kaydının içeriğinin doğru olmadığı hangi yolla ispat edilebilir?',
      choices: ['Yalnız resmî senetle', 'Yalnız yemin ile', 'Kanunda başka hüküm yoksa her türlü delille', 'İspat edilemez'],
      answer: 2,
      reason: 'TMK m.7/2 kanunlarda başka hüküm bulunmadıkça bu ispatın herhangi bir şekle bağlı olmadığını öngörür.',
      dayanak: { kanun: 'tmk', madde: '7', ifade: 'her hangi bir şekle bağlı değildir' },
    },
    {
      q: 'Kanunun hâkime takdir yetkisi tanıdığı konularda hâkim neye göre karar verir?',
      choices: ['Yalnız örf ve âdete göre', 'Hukuka ve hakkaniyete göre', 'Tarafların anlaşmasına göre', 'Bilirkişi görüşüne göre'],
      answer: 1,
      reason: 'TMK m.4 takdir yetkisi tanınan ya da haklı sebeplerin gözetileceği konularda hâkimin hukuka ve hakkaniyete göre karar vereceğini öngörür.',
      dayanak: { kanun: 'tmk', madde: '4', ifade: 'durumun gereklerini ya da haklı sebepleri' },
    },
    {
      q: 'Kişi hak ve fiil ehliyetinden sözleşmeyle kısmen vazgeçebilir mi?',
      choices: ['Evet, yazılı şekilde', 'Evet, noter onayıyla', 'Hayır, kısmen de olsa vazgeçemez', 'Yalnız ergin kişi vazgeçebilir'],
      answer: 2,
      reason: 'TMK m.23/1 kimsenin hak ve fiil ehliyetlerinden kısmen de olsa vazgeçemeyeceğini öngörür.',
      dayanak: { kanun: 'tmk', madde: '23', ifade: 'Kimse, hak ve fiil ehliyetlerinden kısmen de olsa vazgeçemez' },
    },
  ],
  kaynaklar: [
    {
      title: '4721 sayılı Türk Medenî Kanunu (mevzuat.gov.tr)',
      url: 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.4721.pdf',
      note: 'Örnek olay, tuzak ve test dayanaklarının resmî metni',
    },
  ],
};

export default katman;
