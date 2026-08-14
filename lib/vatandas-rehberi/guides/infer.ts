import type { VatandasGuide } from './types';

type Mini = { slug: string; h1: string; category: string };

function topic(h1: string) {
  return h1.replace(/\?+$/, '').replace(/\s+/g, ' ').trim();
}

function g(steps: string[], docs: string[], heading: string, note: string): VatandasGuide {
  return { steps, docs, notes: [{ heading, paragraphs: [note] }] };
}

/** Slug/kategoriye göre somut iskelet — all.json’da yoksa kullanılır. */
export function inferGuide(a: Mini): VatandasGuide {
  const s = a.slug;
  const t = topic(a.h1);

  if (/cekismeli-bosanma/.test(s))
    return g(
      ['Çekişmeli boşanmada kusur ve delil listesini yazın.', 'Tedbir nafakası ve velayet talebini dilekçeye koyun.', 'Aile mahkemesinde davayı açın; tebligatı izleyin.', 'Tanık ve mali belgeleri süresinde sunun.', 'Karar sonrası nafaka / mal tasfiyesini ayrı yürütün.'],
      ['dilekçe', 'delil listesi', 'nüfus kayıt', 'gelir belgesi'],
      'Süreç',
      'Çekişmelide anlaşma yoktur; duruşma ve delil esastır. Anlaşmalı 1 yıl şartı aranmaz. Dava uzayabilir.'
    );
  if (/bosanma-protokol/.test(s))
    return g(
      ['Nafaka, velayet, kişisel ilişki, mal ve ziyneti madde madde yazın.', 'Belirsiz ‘ileride konuşulur’ cümleleri çıkarın.', 'İkisinin de imzasını alın.', 'Hâkime sunun; duruşmada iradeyi açıklayın.', 'Onaylanan protokolü nüfus ve icrada kullanın.'],
      ['protokol taslağı', 'nüfus kayıt', 'mal listesi'],
      'İçerik',
      'Eksik protokol onanmaz. Çocuk yararına aykırı madde düzeltilir. Onaydan sonra değiştirmek yeni dava ister.'
    );
  if (/tedbir-nafakasi/.test(s))
    return g(
      ['Dava sürerken geçim ihtiyacını belgelendirin.', 'Dilekçede tedbir nafakası isteyin.', 'Gelir-gider dengesini gösterin.', 'Ara kararı icraya koyun.', 'Esas hükümle yoksulluk / iştirake geçişi izleyin.'],
      ['gelir belgesi', 'kira / fatura', 'dilekçe'],
      'Geçici',
      'Tedbir nafakası yargılama bitince kural olarak sona erer veya asıl nafakaya dönüşür. Geçmişe dönük sınırlıdır.'
    );
  if (/yoksulluk-nafakasi/.test(s))
    return g(
      ['Boşanmayla yoksulluğa düşeceğinizi somutlaştırın.', 'Kusur durumunun nafakayı etkileyebileceğini bilin.', 'Süresiz mi süreli mi talep edeceğinizi yazın.', 'Kararı icraya koyun.', 'Durum değişirse indirme / kaldırma davası açın.'],
      ['gelir belgesi', 'boşanma kararı', 'gider fişleri'],
      'Şart',
      'Yoksulluk nafakası eş içindir. Ağır kusurlu tarafın talebi reddedilebilir. Çalışıp gelir elde edince indirilir.'
    );
  if (/istirak-nafakasi/.test(s))
    return g(
      ['Çocuğun giderini (okul, sağlık, barınma) yazın.', 'Velayet kendisinde olmayan ebeveynden isteyin.', 'Oranı gelir gücüne göre talep edin.', 'Kararı icraya koyun.', 'İhtiyaç artınca artırım davası açın.'],
      ['nüfus kayıt', 'okul / sağlık belgesi', 'gelir belgesi'],
      'Çocuk',
      'İştirak nafakası çocuğundur, velayet sahibine ödenir. Erginlikte kural olarak biter; eğitim istisnası ayrıca istenir.'
    );
  if (/velayet-degisikligi/.test(s))
    return g(
      ['Eski velayet kararını alın.', 'Esaslı değişiklik (ihmal, taşınma, şiddet, çocuğun yararı) yazın.', 'Aile mahkemesinde değişiklik davası açın.', 'Çocuğun görüşünü (yaşı uygunsa) hazırlayın.', 'Kişisel ilişkiyi yeni karara göre düzenleyin.'],
      ['eski karar', 'okul / sağlık', 'tanık', 'dilekçe'],
      'Eşik',
      'Her memnuniyetsizlik değişiklik sebebi değildir. Üstün yarar değişmiş olmalıdır. İcra ile çocuğu almak ayrı usuldür.'
    );
  if (/kisisel-iliski/.test(s))
    return g(
      ['Gün, saat ve teslim yerini somut yazın.', 'Velayet davasında veya ayrıca talep edin.', 'İhlalde icra / çocuk teslimi yolunu kullanın.', 'Yarara aykırı görüşmeyi kısıtlatın.', 'Yeni kararı tebliğ ettirin.'],
      ['eski karar', 'ihlal tutanağı', 'dilekçe'],
      'Ayrı hak',
      'Kişisel ilişki velayetten bağımsızdır. Velayet kendisinde olmayan ebeveynin çocuğu görme hakkıdır. İhlal disiplin / icra doğurur.'
    );
  if (/evlilik-sozlesmesi/.test(s))
    return g(
      ['Mal rejimini (edinilmiş mallara katılma, paylaşmalı, mal ayrılığı) seçin.', 'Noterde evlilik sözleşmesi yapın.', 'Evlilikten önce veya sonra olabileceğini bilin.', 'Tapu ve bankaya gerektiğinde bildirin.', 'Boşanmada tasfiye bu sözleşmeye göre yürür.'],
      ['noter sözleşmesi', 'kimlik', 'mal listesi'],
      'Şekil',
      'Sözleşme noter resmi şeklindedir. Evlilik cüzdanındaki rejim kaydı ayrıca işlenir. Yoksa yasal rejim uygulanır.'
    );
  if (/nisan-bozulmasi/.test(s))
    return g(
      ['Nişan hediyesi ve masrafları listeleyin.', 'Bozulmanın haklı sebebini yazın.', 'Hediyelerin iadesini isteyin.', 'Manevi tazminat şartı varsa belgelendirin.', 'Zamanaşımını kaçırmayın.'],
      ['hediye listesi', 'yazışma', 'tanık'],
      'Nişan ≠ evlilik',
      'Nişan evlendirmez. Olağan hediyeler kural olarak iade edilir. Manevi tazminat ağır kusur ister.'
    );
  if (/ayrilik-karari/.test(s))
    return g(
      ['Boşanma yerine ayrılık mı istediğinizi netleştirin.', 'Aile mahkemesinde ayrılık talep edin.', 'Süre (1–3 yıl) ve tedbirleri yazın.', 'Süre bitince boşanmaya geçiş şartını sorun.', 'Nüfus kaydının evli kaldığını bilin.'],
      ['dilekçe', 'nüfus kayıt', 'gerekçe'],
      'Ayrılık',
      'Ayrılık evliliği bitirmez; birlikte yaşamayı durdurur. Uygulamada az istenir. Süre sonunda boşanma ayrıca karara bağlanır.'
    );
  if (/aile-konutu-serhi/.test(s))
    return g(
      ['Konutun aile konutu olduğunu belgelendirin.', 'Tapuya aile konutu şerhi koydurun.', 'Eşin açık rızası olmadan satış / ipoteği durdurun.', 'Şerhsiz işlemde iptal davasını değerlendirin.', 'Boşanma sonrası şerhin kalkmasını izleyin.'],
      ['tapu', 'nüfus / evlilik', 'şerh talebi'],
      'Koruma',
      'Aile konutu, ailenin yaşadığı evdir. Şerh, rızasız tasarrufu üçüncü kişilere karşı da etkiler. Kiralanan konutta da bildirim vardır.'
    );
  if (/hayata-kast-bosanma/.test(s))
    return g(
      ['Olayı ve delili (savcılık, rapor) toplayın.', 'Özel boşanma sebebini dilekçede yazın.', 'Süre (öğrenme) şartını kontrol edin.', 'Tedbir ve 6284’ü birlikte isteyin.', 'Kusur ve nafaka etkisini ayırın.'],
      ['şikâyet', 'tıbbi rapor', 'dilekçe'],
      'Özel sebep',
      'Hayata kast ve kötü/onur kırıcı davranış özel boşanma sebepleridir. Genel çekişmeli yoldan daha dar ve ispatı ağırdır.'
    );
  if (/terk-sebebiyle-bosanma/.test(s))
    return g(
      ['Terk tarihini yazın.', 'Hâkimden ihtar isteyin; süre dolsun.', 'İhtara rağmen dönülmezse boşanma davası açın.', 'Haklı sebep yoksa özel terk sebebini kullanın.', 'Ortak hayatın fiilen bittiğini belgelendirin.'],
      ['ihtar kararı', 'tebliğ', 'adres delili'],
      'İhtar',
      'Terk sebebiyle boşanma, ihtar ve kanuni süre olmadan çoğu kez kabul edilmez. Kendisi terk eden bu yola dayanamaz.'
    );
  if (/zina-sebebiyle-bosanma/.test(s))
    return g(
      ['Öğrenme tarihinden itibaren hak düşürücü süreyi hesaplayın.', 'Delili hukuka uygun toplayın.', 'Aile mahkemesinde özel sebep olarak açın.', 'Affetme iddiasına karşı duruşunuzu yazın.', 'Kusur ve nafaka sonucunu izleyin.'],
      ['delil', 'öğrenme tarihi', 'dilekçe'],
      'Süre ve af',
      'Zina özel sebeptir; öğrenmeden itibaren süre kaçarsa bu sebep düşer. Af, davayı düşürür. Hukuka aykırı delil sorunludur.'
    );
  if (/cocuk-teslimi/.test(s))
    return g(
      ['Velayet veya kişisel ilişki kararını alın.', 'İcra / çocuk teslimi bürosu yolunu kullanın.', 'Uzman eşliğinde teslim isteyin.', 'Direnmede disiplin / tazyik seçeneklerini sorun.', 'Yarara aykırı teslimi mahkemeye bildirin.'],
      ['mahkeme kararı', 'icra evrakı', 'tutanak'],
      'İcra',
      'Çocuk teslimi adi haciz gibi zorlanmaz; özel usul ve uzman vardır. Karar yoksa icra olmaz. 6284 ile çatışırsa mahkeme önceliği netleştirmelidir.'
    );
  if (/uzaklastirma-karari-ihlal/.test(s))
    return g(
      ['6284 kararını ve ihlal anını belgelendirin.', 'Kolluğa hemen bildirin.', 'Savcılığa suç duyurusu yapın.', 'Kararın uzatılmasını isteyin.', 'Boşanma / nafaka dosyasını ayrıca yürütün.'],
      ['6284 kararı', 'ihlal delili', 'şikâyet'],
      'İhlal suçtur',
      'Uzaklaştırma ihlali ayrıca cezayı gerektirir. Sessiz kalmak sonraki talebi zayıflatır. Karar bitmeden ihlal de suçtur.'
    );
  if (/babalik-davasi/.test(s))
    return g(
      ['Çocuk ve anne bakımından süreyi kontrol edin.', 'Asliye hukuk / aile mahkemesinde babalık davası açın.', 'DNA incelemesi isteyin.', 'Nafaka ve soyadı talebini ekleyin.', 'Kesinleşen kararı nüfusa işletin.'],
      ['nüfus kayıt', 'dilekçe', 'DNA kararı'],
      'Soybağı',
      'Babalık davası soybağını kurar. Süreler kaçırılırsa hak düşer. Tanıma ayrı, dava ayrı yoldur.'
    );
  if (/nafaka-artirim-davasi/.test(s))
    return g(
      ['Eski nafaka kararını alın.', 'İhtiyaç veya gelir değişimini belgelendirin.', 'Aile mahkemesinde artırım isteyin.', 'Geçmişe yürütme sınırını sorun.', 'Yeni kararı icraya koyun.'],
      ['eski karar', 'gider belgeleri', 'gelir belgesi'],
      'Değişiklik',
      'Artırım, yeni dava ister; icra müdürü nafakayı kendiliğinden artırmaz. Enflasyon tek başına yetmeyebilir.'
    );
  if (/nafaka-indirim/.test(s))
    return g(
      ['Gelir kaybı veya karşı tarafın iyileşmesini belgelendirin.', 'İndirme veya kaldırma davası açın.', 'İcranın durması için tedbir isteyip istemediğinizi sorun.', 'Karara kadar eski miktarın işlediğini bilin.', 'Yeni kararı icra dairesine verin.'],
      ['eski karar', 'işten çıkış / gelir', 'dilekçe'],
      'Kendiliğinden olmaz',
      'İşsiz kalmak tek başına nafakayı sıfırlamaz. Mahkeme kararına kadar birikim işlemeye devam eder.'
    );

  if (/istifa/.test(s))
    return g(
      ['İstifayı yazılı verin; tebliği alın.', 'Kıdem doğuran istisna (emeklilik, askerlik, evlilik, haklı fesih) var mı bakın.', 'İhbar süresine uyun veya karşılığını hesaplayın.', 'İbranameyi imzalamadan kalemleri kontrol edin.', 'Alacak varsa arabuluculuğa gidin.'],
      ['istifa yazısı', 'bordro', 'kıdem hesabı'],
      'Kıdem',
      'Düz istifa kural olarak kıdem vermez. Haklı nedenle istifa kıdem doğurabilir. Sözlü ‘bıraktım’ ispatta zayıftır.'
    );
  if (/hakli-fesih-isci/.test(s))
    return g(
      ['İş K. m. 24 sebebini (sağlık, ahlak, zorlayıcı) somut yazın.', 'Olayı hemen belgelendirin.', 'Derhal fesih beyanını yazılı yapın.', 'Kıdem ve diğer alacakları listeleyin.', 'Arabuluculuk + dava yolunu izleyin.'],
      ['fesih yazısı', 'delil', 'bordro'],
      'Süre',
      'Ahlak ve iyiniyet ihlalinde öğrenmeden itibaren hak düşürücü süre vardır. Geç kalan fesih haklılığını yitirebilir.'
    );
  if (/isveren-hakli-fesih/.test(s))
    return g(
      ['İş K. m. 25 sebebini ve delili yazın.', 'Savunma alınmasının gerekip gerekmediğini kontrol edin.', 'Yazılı fesih yapın; tebliğ edin.', 'Kıdem ve işsizlik etkisini bilin.', 'İşe iade riskini değerlendirin.'],
      ['savunma', 'tutanak', 'fesih yazısı'],
      'İspat',
      'İşveren haklı fesihi ispatlamalıdır. Savunma alınmadan verilen disiplin feshi çoğu kez geçersiz sayılır. Kıdem kural olarak doğmaz.'
    );
  if (/yillik-izin/.test(s))
    return g(
      ['Kıdeme göre izin gününü (14/20/26) bulun.', 'Kullanılmayan izni ücret alacağı olarak hesaplayın.', 'İzin defteri / yazışmayı toplayın.', 'Fesihte ücrete dönüştüğünü bilin.', 'Arabuluculukla talep edin.'],
      ['izin defteri', 'bordro', 'yazışma'],
      'Kullanılmayan izin',
      'Yıllık izin para ile çalışırken kural olarak ödenmez; fesihte ücrete dönüşür. Zamanaşımı fesihte başlar.'
    );
  if (/ubgt|hafta-tatili/.test(s))
    return g(
      ['Ulusal bayram / genel tatil veya hafta tatilinde çalışmayı gösterin.', 'Zamlı ücreti hesaplayın.', 'Denkleştirici izin verilmiş mi bakın.', 'Bordrodaki ‘dahil’ ibaresini sorgulayın.', '5 yıl zamanaşımı ile talep edin.'],
      ['puantaj', 'bordro', 'takvim'],
      'Zamlı ücret',
      'Hafta tatili ve UBGT çalışması ayrı zamlı rejimleredir. Fazla mesai ile karıştırmayın. İspat işçidedir.'
    );
  if (/deneme-suresi/.test(s))
    return g(
      ['Sözleşmedeki deneme süresinin 2 ayı aşıp aşmadığına bakın.', 'Süre içinde feshin ihbarsız olabileceğini bilin.', 'Kıdem ve işe iade şartlarını kontrol edin.', 'Süre bitince belirsiz süreliye döndüğünü yazın.', 'Toplu iş sözleşmesi uzatma var mı bakın.'],
      ['iş sözleşmesi', 'fesih yazısı'],
      'Azami 2 ay',
      'Deneme en çok 2 aydır (TİS ile 4). Bu sürede kıdem doğmaz. Süre bitince normal fesih kuralları işler.'
    );
  if (/belirli-sureli-is/.test(s))
    return g(
      ['Belirli sürenin esaslı bir nedene dayanıp dayanmadığını kontrol edin.', 'Zincirleme sözleşmenin belirsiz sayılabileceğini bilin.', 'Süre sonunda ihbar gerekmez kuralını yazın.', 'Erken haksız feshin sonuçlarını hesaplayın.', 'İşe iade yolunun çoğu kez kapalı olduğunu bilin.'],
      ['sözleşme', 'işin süresi belgesi'],
      'Esaslı neden',
      'Objektif neden yoksa belirli süreli sözleşme belirsiz sayılır. Zincirleme yenileme bu riski artırır.'
    );
  if (/belirsiz-sureli-is/.test(s))
    return g(
      ['Sözleşmenin süreye bağlı olmadığını doğrulayın.', 'Fesihte ihbar ve geçerli neden rejimini uygulayın.', 'İşe iade şartlarını kontrol edin.', 'Kıdem ve diğer kalemleri listeleyin.', 'Yazılı fesih kullanın.'],
      ['sözleşme', 'fesih', 'bordro'],
      'Kural',
      'İş hukukunda asıl olan belirsiz sürelidir. İhbar, kıdem ve işe iade bu türde işler.'
    );
  if (/ibraname/.test(s))
    return g(
      ['İbranameyi fesih tarihinden sonra ve somut tutarlı okuyun.', 'Eksik kalem varsa imzalamayın veya çekince yazın.', 'Banka ödemesi ile ibranın uyumunu kontrol edin.', 'Geçersiz ibrada alacağı yine talep edin.', 'Arabuluculuk tutanağı ile karıştırmayın.'],
      ['ibraname', 'dekont', 'bordro'],
      'Şekil',
      'İbraname, fesih tarihinden en az bir ay sonra, somut tutar ve ibra kelimesiyle geçerlidir. Peşin imzalatılan feragat çoğu kez geçersizdir.'
    );
  if (/ise-iade-tazminati|bos-ta-gecen/.test(s))
    return g(
      ['İşe iade kararının kesinleşmesini bekleyin.', '10 iş günü içinde işe başlama iradesini bildirin.', 'İşveren başlatmazsa işe başlatmama tazminatını isteyin.', 'Boşta geçen süre ücretini ayrıca hesaplayın.', 'Kıdem ve ihbarın nasıl etkilendiğini yazın.'],
      ['işe iade kararı', 'başlama bildirimi', 'bordro'],
      'İki kalem',
      'İşe başlatmama tazminatı ile boşta geçen süre ücreti ayrıdır. Bildirim yapılmazsa haklar düşebilir.'
    );
  if (/iscilik-alacaklari-davasi|is-mahkemesi/.test(s))
    return g(
      ['Kalemleri (kıdem, ihbar, izin, mesai) tek tek yazın.', 'Arabuluculuk dava şartını tamamlayın.', 'İş mahkemesinde dava açın.', 'Islah ve zamanaşımını izleyin.', 'Kararı icraya koyun.'],
      ['arabuluculuk tutanağı', 'dilekçe', 'bordro'],
      'Dava şartı',
      'İşçilik alacağında arabuluculuk olmadan dava reddedilir. Görevli mahkeme iş mahkemesidir.'
    );
  if (/iscilik-alacaklari-zamansimi/.test(s))
    return g(
      ['Her kalemin zamanaşımını ayrı bakın (çoğu 5 yıl).', 'Başlangıç anını (fesih / muacceliyet) yazın.', 'Kesilme (arabuluculuk, icra, dava) var mı bakın.', 'Eski kalemleri düşürün.', 'Güncel kalemleri hemen talep edin.'],
      ['fesih belgesi', 'bordro', 'başvuru tarihi'],
      '5 yıl',
      'İşçilik alacaklarında kural 5 yıldır. Yıllık izin ücreti fesihte muaccel olur. Mahkeme re’sen bakmaz; def’i gerekir.'
    );

  if (/maas-haczi|ucret-haczi|memur-maas|emekli-maas|kidem-tazminati-haczi/.test(s))
    return g(
      ['Haciz ihbarnamesini alın.', 'Yasal kesinti oranını (nafaka ayrı) kontrol edin.', 'Asgari ücret / istisna dilimini hesaplayın.', 'Fazla kesintiyi icra mahkemesine şikâyet edin.', 'Birden fazla hacizde sıra cetvelini sorun.'],
      ['ihbarname', 'maaş bordrosu', 'şikâyet'],
      'Oran',
      'Maaş haczinde yasal tavan vardır; nafaka istisnadır. Emekli aylığında da sınır vardır. Kıdem tazminatı haczinde ayrı kurallar uygulanır.'
    );
  if (/banka-hesabi-haczi|banka-hesap-haczi/.test(s))
    return g(
      ['Haciz ihbarnamesinin bankaya tebliğini öğrenin.', 'Maaş niteliğindeki hesabı belgelendirin.', 'İstisna ve şikâyet süresini kullanın.', 'Haksız bloke için icra mahkemesine gidin.', 'Ödeme planı ile fek isteyin.'],
      ['ihbarname', 'hesap dökümü', 'maaş yazısı'],
      'Bloke',
      'Banka hesabı haczi hızlıdır. Maaşın yattığı hesapta oran aşımı şikâyet konusudur. Sessiz kalmak paranın gönderilmesine yol açar.'
    );
  if (/arac-haczi/.test(s))
    return g(
      ['Trafik tesciline haciz şerhini kontrol edin.', 'Yakalama / muhafaza olup olmadığına bakın.', 'Kıymet takdiri ve satış ilanını izleyin.', 'İstihkak veya ödeme ile fek yolunu seçin.', 'İhale feshi süresini yazın.'],
      ['tescil', 'haciz şerhi', 'kıymet takdiri'],
      'Şerh',
      'Araç haczinde fiilî yakalama olmayabilir; şerh devri kilitler. Üçüncü kişi malıysa istihkak davası açılır.'
    );
  if (/tapu-haczi/.test(s))
    return g(
      ['Tapu kaydındaki haciz şerhini alın.', 'Satış ve kıymet takdirini izleyin.', 'Öncelikli rehin / ipotek var mı bakın.', 'Ödeme veya şikâyet ile fek isteyin.', 'İhale sonrası tahliye riskini bilin.'],
      ['tapu kaydı', 'haciz yazısı', 'kıymet takdiri'],
      'Şerh yeter',
      'Taşınmazda haciz şerhi devri ve ipoteği etkiler. Satış ilanı tebliğ edilmeden ihale çoğu kez bozulur.'
    );
  if (/itirazin-iptali/.test(s))
    return g(
      ['İtirazın takibi durdurduğunu bilin.', '1 yıllık sürede itirazın iptali davası açın.', 'Alacağı ve fer’ilerini ispatlayın.', 'İnkâr tazminatı talep edip etmeyeceğinizi yazın.', 'Kararı icraya koyun; takip kaldığı yerden devam eder.'],
      ['ödeme emri', 'itiraz', 'alacak belgesi', 'dilekçe'],
      '1 yıl',
      'İtirazın iptali genel mahkemededir. Süre kaçarsa ilamsız takip düşer. İtirazın kaldırılması icra mahkemesinde ayrı ve daha dardır.'
    );
  if (/itirazin-kaldirilmasi/.test(s))
    return g(
      ['İtirazın imzaya mı borca mı olduğunu ayırın.', 'İcra mahkemesinde kaldırma isteyin.', 'Belgeye bağlı alacaklarda bu yolun uygun olduğunu bilin.', 'Süreleri (kısa) kaçırmayın.', 'Redde iptal davasına geçin.'],
      ['senet / belge', 'itiraz', 'dilekçe'],
      'Dar yol',
      'Kaldırma, belgesiz alacakta işlemez. İmzaya itirazda ayrı usul vardır. Süreler itirazın iptalinden kısadır.'
    );
  if (/menfi-tespit|borclu-olmadiginin/.test(s))
    return g(
      ['Borçlu olmadığınızı hangi sebeple iddia ettiğinizi yazın.', 'Takip varsa ihtiyati tedbir / teminat değerlendirin.', 'Asliye hukukta menfi tespit davası açın.', 'Kayıtsız ödediyseniz istirdat yolunu sorun.', 'Kararı icra dairesine verin.'],
      ['takip evrakı', 'ödeme', 'dilekçe'],
      'İki zaman',
      'Ödemeden önce menfi tespit, ödedikten sonra istirdat gündeme gelir. Kayıtsız ödeme istirdadı zorlaştırır.'
    );
  if (/istihkak/.test(s))
    return g(
      ['Haczedilen malın size ait olduğunu belgelendirin.', 'İstihkak iddiasını süresinde icra dairesine bildirin.', 'Alacaklı itiraz ederse istihkak davası açın.', 'Malın teslimini durduracak tedbiri isteyin.', 'Davayı kaybederseniz tazminat riskini bilin.'],
      ['fatura / tapu', 'istihkak dilekçesi', 'tutanak'],
      'Süre',
      'Üçüncü kişinin malı haczedilmişse istihkak yolu vardır. Süre kaçınca mal satılır. Aile içi ‘benim’ iddiası ispat ister.'
    );
  if (/icra-taahudu|tazyik-hapsi/.test(s))
    return g(
      ['Taahhüt tutanağındaki tarih ve tutarı okuyun.', 'Ödeyemezseniz süresinde bildirim yapın.', 'İhlalde tazyik şikâyetini bekleyin veya savunun.', 'Ödeyince hapsin kalkacağını bilin.', 'Yeni taahhüt öncesi gerçek ödeme gücünü yazın.'],
      ['taahhüt tutanağı', 'ödeme', 'şikâyet'],
      'Özgürlük',
      'İcra taahhüdünü bozmak tazyik hapsi doğurabilir. Borç hapishanesi değildir; ödeyince infaz durur. İmzalamadan önce düşünün.'
    );
  if (/sira-cetveli/.test(s))
    return g(
      ['Satış bedeli ve alacaklı listesini alın.', 'Kanuni sıranızı (rehin, nafaka, işçilik, kamu, adi) kontrol edin.', 'Cetvele süresinde şikâyet edin.', 'Payınızı hesaplayın.', 'İhale feshinin payı nasıl etkilediğini izleyin.'],
      ['sıra cetveli', 'alacak belgesi', 'şikâyet'],
      'Sıra',
      'Para yetmezse sıra cetveli kimlerin önce alacağını keser. Şikâyet kısa sürelidir. Sessiz kalmak cetveli kesinleştirir.'
    );
  if (/aciz-vesikasi/.test(s))
    return g(
      ['Satış ve sıra cetveli sonrası aciz belgesi isteyin.', 'Belgenin zamanaşımını kestiğini / durdurduğunu bilin.', 'Yeni mal ortaya çıkınca tekrar haciz isteyin.', 'Belgeyi saklayın.', 'İflas / konkordato ile ilişkisini sorun.'],
      ['aciz belgesi', 'sıra cetveli'],
      'Ne işe yarar',
      'Aciz vesikası, tahsil edilemeyen alacağı belgeler. Zamanaşımı rejimini değiştirir. Borç silinmez.'
    );
  if (/kambiyo-senetlerine|bono-vade/.test(s))
    return g(
      ['Senet şekil şartlarını kontrol edin.', 'Vade ve ibraz süresini yazın.', 'Kambiyo takibi açın.', '5 günlük şikâyet / itiraz rejimini bilin.', 'Şekil eksiğinde adi takibe dönün.'],
      ['senet aslı', 'ibraz', 'takip'],
      'Şekil',
      'Bono ve çek kambiyo senetleridir. Eksik unsur seneti adi belgeye düşürür. Takip daha serttir.'
    );
  if (/ilamli-icra/.test(s))
    return g(
      ['Kesinleşmiş ilamı alın.', 'İlamlı takip açın; ödeme emri (icra emri) tebliğini izleyin.', 'İtirazın takibi durdurmadığını bilin.', 'Şikâyet ve süreleri yazın.', 'Haciz ve tahliyeye geçin.'],
      ['ilam', 'kesinleşme', 'icra emri'],
      'Fark',
      'İlamlı takipte borçlu ilamsızdaki gibi borca itirazla işi durduramaz. Yerine getirme süresi ayrıdır.'
    );
  if (/icra-sikayeti/.test(s))
    return g(
      ['Şikâyet sebebini (usulsüz işlem, süre, yetki) yazın.', 'Öğrenme tarihinden kısa süreyi hesaplayın.', 'İcra mahkemesine şikâyet edin.', 'Tedbir / durdurma isteyin.', 'Sonucu daireye bildirin.'],
      ['işlem tutanağı', 'şikâyet dilekçesi'],
      'Süre',
      'Şikâyet çoğu halde 7 gündür. Hak düşürücü sürelerdir. Dava değildir; icra işlemini denetler.'
    );
  if (/konkordato/.test(s))
    return g(
      ['Borçlunun konkordato ilanını ticaret sicili / ilandan izleyin.', 'Alacağınızı masaya kaydedin.', 'Mühletin haczi nasıl etkilediğini sorun.', 'Projeye oy verin veya itiraz edin.', 'Tasdik veya iflas sonucunu takip edin.'],
      ['alacak belgesi', 'ilan', 'kayıt'],
      'Mühlet',
      'Konkordato iflastan kaçınma yoludur. Mühlet birçok takibi durdurur. Alacağını kaydetmeyen sıra kaybeder.'
    );

  if (/kira-sozlesmesi-nasil/.test(s))
    return g(
      ['Taraflar, adres, bedel, süre ve depozitoyu yazın.', 'Konutta yazılı şekil ve zorunlu kayıtları kontrol edin.', 'e-Devlet kira sözleşmesi kaydı gerekip gerekmediğine bakın.', 'Teslim tutanağı tutun.', 'Birer nüshayı saklayın.'],
      ['sözleşme', 'kimlik', 'teslim tutanağı'],
      'Şekil',
      'Konut kirasında yazılı sözleşme ispat ve yasal sınırlar için şarttır. Sözlü kira geçersiz değildir ama ispatı zordur.'
    );
  if (/kiraci-haklari|kiraya-veren-haklari/.test(s))
    return g(
      ['Sözleşme ve TBK konut/işyeri ayrımını yapın.', 'Artış, tahliye ve ayıp haklarını listeleyin.', 'Yazılı bildirim kullanın.', 'Uyuşmazlıkta arabuluculuk şartını kontrol edin.', 'İhtarla hak kaybını önleyin.'],
      ['sözleşme', 'yazışma', 'ihtar'],
      'Denge',
      'Konut kiracısı kanunen daha korumalıdır. İşyeri kirası serbesttir ama tahliye yine sebebe bağlıdır.'
    );
  if (/konut-kirasi-artis|isyeri-kirasi-artis/.test(s))
    return g(
      ['Sözleşmedeki artış maddesini okuyun.', 'Konutta yasal tavanı kontrol edin.', 'İşyerinde sözleşme serbestisini bilin.', 'Yazılı bildirim yapın.', 'Anlaşmazlıkta tespit / arabuluculuk yolunu seçin.'],
      ['sözleşme', 'TÜFE', 'bildirim'],
      'Tavan',
      'Konut artışında yasal tavan sözleşmeyi ezer. İşyerinde tavan kural olarak yoktur; sözleşme esastır.'
    );
  if (/ihtiyac-nedeniyle-tahliye/.test(s))
    return g(
      ['Kendisi, eşi, altsoyu veya üstsoyunun konut ihtiyacını somutlaştırın.', 'Dönem sonunda dava / bildirim süresini yazın.', 'Arabuluculuğu tamamlayın.', 'Tahliyeden sonra 3 yıl yeniden kiralama yasağını bilin.', 'İhtiyacın samimi olduğunu delillendirin.'],
      ['sözleşme', 'ihtiyaç delili', 'dilekçe'],
      'Samimiyet',
      'İhtiyaç tahliyesi gerçek ve samimi olmalıdır. Tahliyeden sonra başkasına kiralamak tazminat doğurur.'
    );
  if (/kira-alacagi-icra/.test(s))
    return g(
      ['Kira sözleşmesi ve ödenmeyen dönemleri yazın.', 'İhtar çekin.', 'İlamsız icra veya tahliye icrası yolunu seçin.', 'Temerrüt tahliyesinde süreleri kaçırmayın.', 'Depozitoyu mahsup hesabına katın.'],
      ['sözleşme', 'döküm', 'ihtar', 'takip'],
      'Temerrüt',
      'Kira alacağı icrası ile tahliye icrası karışabilir. Temerrüt tahliyesi ayrı ihtar usulüne bağlıdır.'
    );
  if (/depozito-faizi|guvence-bedeli/.test(s))
    return g(
      ['Güvence tutarının 3 aylık sınırı aşıp aşmadığına bakın.', 'Banka hesabında nemalandırma şartını kontrol edin.', 'Teslimde hasar tutanağı tutun.', 'İade ve faiz hesabını yazın.', 'Kesintiyi belgelendirin.'],
      ['sözleşme', 'dekont', 'teslim tutanağı'],
      '3 ay',
      'Konutta güvence üç aylık kirayı aşamaz. Nemalandırma kuralı uygulanıyorsa faiz kiracıya aittir.'
    );

  if (/tapu-kaydi|e-devlet-tapu/.test(s))
    return g(
      ['e-Devlet / TAKBİS’ten tapu kaydını alın.', 'Şerh, ipotek ve haczi okuyun.', 'Ada/parsel ve bağımsız bölümü doğrulayın.', 'Resmî suret gerekirse müdürlüğe gidin.', 'Alım öncesi kaydı güncelleyin.'],
      ['e-Devlet çıktısı', 'kimlik'],
      'Şerh',
      'Kayıt, mülkiyet karinesidir. Şerhler satışa engel olabilir. Eski çıktı ile işlem yaptırmayın.'
    );
  if (/ipotek/.test(s))
    return g(
      ['İpotek türünü (tesisat, anapara) ve dereceyi yazın.', 'Tapu kaydından fek şartını okuyun.', 'Borç bitince fek için banka yazısı alın.', 'Fekin tapuya işlendiğini kontrol edin.', 'İkinci derece ipoteğin riskini bilin.'],
      ['ipotek sözleşmesi', 'tapu', 'fek yazısı'],
      'Rehin',
      'İpotek, taşınmazı borca bağlar. Ödeme tek başına yetmez; fek tescil edilmelidir.'
    );
  if (/on-alim|sufa/.test(s))
    return g(
      ['Paylı mülkiyette satışın size bildirilip bildirilmediğini bakın.', 'Önalım süresini (öğrenme / tescil) hesaplayın.', 'Bedeli depo ederek dava açın.', 'Muvazaa iddiasını ayrıca yazın.', 'Süre kaçınca hakkın düştüğünü bilin.'],
      ['tapu', 'satış bildirimi', 'dilekçe', 'bedel depo'],
      'Süre',
      'Önalım (şufa) kısa sürelidir. Bildirim yoksa süre tescilden işler. Bedeli mahkemeye yatırmak gerekir.'
    );
  if (/ecrimisil/.test(s))
    return g(
      ['Haksız işgal süresini ve ecrimisil (kira benzeri) talebini yazın.', 'Malik veya paydaş sıfatınızı belgelendirin.', 'Dava veya icra yolunu seçin.', 'Zamanaşımını kontrol edin.', 'Tahliye talebini ayırın.'],
      ['tapu', 'işgal delili', 'dilekçe'],
      'Haksız işgal',
      'Ecrimisil, rızasız kullananın ödediği bedeldir. İşgalci ‘ben bakıyordum’ diye kurtulamaz. Paydaşlar arası da istenebilir.'
    );
  if (/el-atmanin-onlenmesi/.test(s))
    return g(
      ['Mülkiyet veya zilyetliği belgelendirin.', 'Müdahalenin devam ettiğini gösterin.', 'Asliye hukukta el atmanın önlenmesi isteyin.', 'Yıkım / eski hale getirmeyi ekleyin.', 'Tedbir şerhi koyun.'],
      ['tapu', 'fotoğraf / keşif', 'dilekçe'],
      'Müdahale',
      'El atmanın önlenmesi, haksız müdahaleyi durdurur. Tazminat ayrı kalemdir. Kadastro / orman iddiası görevi değiştirebilir.'
    );
  if (/kat-irtifaki|kat-mulkiyeti-genel-kurul|yonetici-secimi|yonetim-plani|bagimsiz-bolum|arsa-payi/.test(s))
    return g(
      ['Yönetim planı ve tapu türünü (irtifak / mülkiyet) ayırın.', 'Genel kurul çağrı usulünü kontrol edin.', 'Karar nisabını yazın.', 'İptal davası süresini hesaplayın.', 'Aidat ve arsa payı etkisini izleyin.'],
      ['yönetim planı', 'tapu', 'çağrı / tutanak'],
      'Kat rejim',
      'Kat irtifakı inşaat hâli, kat mülkiyeti bitmiş bağımsız bölümdür. Genel kurul kararı süre içinde iptal edilmezse bağlar.'
    );

  if (/kvkk|cerez|unutulma-hakki|veri-ihlali/.test(s))
    return g(
      ['Veri sorumlusunu tespit edin.', 'Aydınlatma / açık rıza / ihlal bildirimi hangisiyse onu yazın.', 'Önce sorumluya başvurun.', '30 gün sonra Kurula şikâyet edin.', 'Zarar varsa tazminat değerlendirin.'],
      ['başvuru', 'politika / rıza metni', 'yazışma'],
      'KVKK',
      'Haklar KVKK m.11’dedir. Kurula gitmeden önce başvuru kuraldır. İhlal bildirimi veri sorumlusunun yükümlülüğüdür.'
    );

  if (/malpraktis/.test(s))
    return g(
      ['Tıbbi dosyayı (epikriz, onam, tetkik) isteyin.', 'Olay kronolojisini yazın.', 'Bağımsız tıbbi görüş alın.', 'Zamanaşımını (öğrenme) hesaplayın.', 'Tazminat ve varsa ceza şikâyetini ayırın.'],
      ['tıbbi dosya', 'onam', 'rapor', 'dilekçe'],
      'İspat',
      'Malpraktis, standart sapma ve zarar ister. Komplikasyon her zaman hata değildir. Bilirkişi neredeyse zorunludur.'
    );

  if (/kanun-maddesi|mevzuat-nasil|tbk-nedir|tmk-nedir|ttk-nedir|tck-nedir|hmk-nedir|iik-nedir|cmk-nedir|is-kanunu-nedir|tkhk-nedir|kvkk-kanunu|vuk-nedir|anayasa-maddesi|iyiniyet-nedir|durustluk/.test(s))
    return g(
      [`${t} metnini resmi kaynaktan açın.`, 'Yürürlük ve değişiklik tarihine bakın.', 'Fıkra ve atıf maddelerini okuyun.', 'İlgili şerh ve içtihat özetine geçin.', 'Somut olaya uygulamadan önce güncel metni teyit edin.'],
      ['resmî madde metni', 'yürürlük kaydı'],
      'Nasıl okunur',
      'Kanun adı, o alandaki temel metindir. Madde numarası olmadan ‘kanun böyle’ demeyin. Yönetmelik ve içtihat maddeyi tamamlar.'
    );
  if (/^tbk-madde-|^tmk-madde-|^tck-madde-|^hmk-madde-|^iik-madde-|^is-kanunu-madde-/.test(s))
    return g(
      ['Madde numarasını doğrulayın.', 'Resmî tam metni okuyun.', 'Fıkra ve istisnaları ayırın.', 'Portalda şerh sayfasına geçin.', 'Somut dosyada avukat / güncel içtihatla uygulayın.'],
      ['madde metni'],
      'Özet değil',
      'Bu sayfa vatandaş özetidir. Asıl metin mevzuat sayfasındadır. Fıkra atlamak yanlış sonuç verir.'
    );

  if (/veraset-ve-intikal|vek[aâ]let-ucreti-karsi|imar-bari[sş]i|kimlik-kart[ıi]|senet-nasil-yazilir|haciz-ihbarnamesi|icra-inkar-tazminati-orani|yap[ıi]-denetim|iflasin-ertelenmesi|icra-inkar-tazminati-sartlari|ihtiyati-haciz-itiraz|ortak-gider-nedir|muh[uü]r-sokme/.test(s))
    return g(
      [`${t} için dayanak belgeyi ve tarihi yazın.`, 'İlgili merci (vergi dairesi, icra, belediye, noter) evrakını alın.', 'Yasal süreyi tebliğden hesaplayın.', 'Yazılı başvurun veya şikâyet / dava açın.', 'Sonucu tescil, fek veya ceza dosyasından izleyin.'],
      ['dayanak belge', 'tebliğ', 'başvuru'],
      'Dikkat',
      `${t} ayrı bir usule bağlıdır. Süre kaçınca hak düşebilir. Mühür sökmek ayrı suçtur; senet şekil şartı katıdır.`
    );
  if (/ucretsiz-izin/.test(s))
    return g(
      ['Ücretsiz iznin yazılı rızaya dayanıp dayanmadığına bakın.', 'Tek taraflı ücretsiz izni fesih sayıp saymayacağınızı değerlendirin.', 'SGK gününün nasıl etkilendiğini sorun.', 'Dönüş tarihini yazın.', 'Rıza yoksa haklı fesih yolunu düşünün.'],
      ['izin yazısı', 'rıza', 'bordro'],
      'Rıza',
      'Ücretsiz izin kural olarak yazılı onaya bağlıdır. Zorla gönderilmek çoğu halde fesih etkisindedir.'
    );
  if (/haciz-islemleri|icra-satis|istirdat|icra-vekalet|icra-borcu-yapislandirma|odeme-emri-tebligi|banka-icra|icra-dosyasi-kapatma|icra-mahkemesi|ihale-feshi|satis-bedeli|disciplin-hapsi|rehinli-alacak|teminat-hesabi-icra|nafaka-alacaklisi|iscilik-alacagi-oncelik/.test(s))
    return g(
      [`${t} için dosya numarası ve işlemi UYAP / e-Devlet’ten açın.`, 'Tebliğ tarihini ve yasal süreyi yazın.', 'İcra dairesi veya icra mahkemesinden ilgili talebi yapın.', 'Ödeme, şikâyet veya sıra cetveli yolunu seçin.', 'Sonucu şerh / fek / kapanış ile teyit edin.'],
      ['dosya evrakı', 'tebligat', 'dekont'],
      'İcra',
      `${t} icra dosyasının bir evresidir. Süreler çoğu halde 7 gündür. Yanlış merci takibi durdurmaz.`
    );
  if (/kira-odeme-ihtari|isyeri-kirasi-tahliye|kira-uyusmazligi-arabuluculuk|alt-kira|kira-bedeli-odeme|kira-kontrat-e-devlet|kiralananin-ayibi|kira-sozlesmesi-bitisi|kira-tespit-5-yil|kiracinin-olumu|kiraya-verenin-degismesi|konut-kirasi-tahliye|yeniden-kiralama/.test(s))
    return g(
      [`${t} için sözleşmeyi ve dönemleri çıkarın.`, 'Yazılı ihtar veya bildirimi tebliğli gönderin.', 'Konut ise arabuluculuk şartını kontrol edin.', 'Tahliye, tespit veya alacak yolundan birini seçin.', 'Kararı icraya koyun; fiilî çıkarmayı karara bırakın.'],
      ['kira sözleşmesi', 'ihtar', 'dekont'],
      'Kira',
      `${t} TBK kira rejimine girer. Konut ve işyeri kuralları ayrıdır. Sözlü ‘çık’ tebligat yerine geçmez.`
    );
  if (/tuketici-kredisi|kredi-karti|kredi-borcu|garanti-belgesi|internet-alisveris|abonelik-taahhut|kredi-notu|ayip-bildirim|tuketici-mahkemesi|mesafeli-sozlesme|tuketici-arabuluculuk|tuketici-hakem-parasal|e-devlet-tuketici/.test(s))
    return g(
      [`${t} için sözleşme / fatura ve yazışmayı toplayın.`, 'Satıcı veya bankaya yazılı başvurun.', 'Parasal sınıra göre hakem heyeti veya tüketici mahkemesini seçin.', 'Arabuluculuk şartını kontrol edin.', 'Karara itiraz süresini yazın.'],
      ['sözleşme', 'fatura', 'yazışma'],
      'Tüketici',
      `${t} 6502 sayılı Kanun kapsamındadır. Önce satıcıya başvuru ispatı işe yarar. Parasal sınır her yıl değişir.`
    );
  if (/sigorta-tazminat|kasko-hasar|tss-tamamlayici/.test(s))
    return g(
      ['Poliçeyi ve teminat / istisna maddelerini okuyun.', 'Hasarı süresinde ihbar edin.', 'Eksper ve evrak listesini tamamlayın.', 'Red yazısına gerekçeli itiraz edin.', 'Tahkim veya dava yolunu seçin.'],
      ['poliçe', 'ihbar', 'eksper', 'red yazısı'],
      'Poliçe',
      `${t} poliçe ve genel şartlara bağlıdır. Geç ihbar red sebebidir. ZMMS / kasko / TSS teminatları karışmaz.`
    );
  if (/mirascilik-belgesi|tenkis-davasi|miras-ortakligi|muris-muvazaasi|olume-bagli|miras-paylasim|yasal-mirascilar|esin-miras|vasiyetname-iptali|miras-sebebiyle|e-devlet-miras/.test(s))
    return g(
      [`${t} için veraset ilamı ve mal listesini alın.`, 'Yasal pay, saklı pay ve tasarrufu ayırın.', 'Sulh veya asliye hukuk yolunu seçin.', 'Tapu ve banka işlemlerini belgeye bağlayın.', 'Red ve zamanaşımı sürelerini yazın.'],
      ['veraset ilamı', 'nüfus', 'tapu', 'vasiyet'],
      'Miras',
      `${t} TMK miras kitabına girer. Veraset ilamı payı gösterir, paylaşımı zorlamaz. Saklı pay ve muvazaa ayrı davalardır.`
    );
  if (/intifa-hakki|irtifak-hakki|zilyetlik-nedir|tapu-harci|kat-karsiligi|tapuda-satis|hisseli-tapu|tarla-tapu|tapu-vekaleten|sahte-vekaletname|rehin-nedir|satis-vaadi-icra|gecit-hakki|sinir-uyusmazligi|kadastro|orman-kadastro/.test(s))
    return g(
      [`${t} için tapu ve dayanak senetleri alın.`, 'Şerh ve hak sahibini doğrulayın.', 'Şekil şartını (noter, tapu, kadastro) kontrol edin.', 'Asliye hukuk veya tapu müdürlüğü yolunu seçin.', 'Tescil veya iptal kararını tapuya işletin.'],
      ['tapu', 'sözleşme', 'dilekçe'],
      'Eşya',
      `${t} ayni hak veya tescil rejimine bağlıdır. Şekil eksiği hakkı doğurmaz. Kadastro ve orman iddiaları görevi değiştirir.`
    );
  if (/sikayet-suresi-ceza|gozalti-suresi|tutuklama-nedir|adli-kontrol|hizli-yargilama|hakaret-sucu|tehdit-sucu|dolandiricilik|kisisel-verilerin-kaydedilmesi|trafik-guvenligini|sabika-kaydi|erisim-engeli|sosyal-medya-hakaret|suc-duyurusu-geri|mudafi-hakki|ifade-alma|sorusturma-gizliligi|e-devlet-ceza/.test(s))
    return g(
      [`${t} için olay ve delili tarihleyin.`, 'Şikâyet süresi veya koruma tedbiri süresini yazın.', 'Savcılık, sulh ceza veya e-şikâyet mercini seçin.', 'Müdafi / müşteki vekili hakkını kullanın.', 'KYOK, iddianame veya tedbir sonucunu izleyin.'],
      ['şikâyet', 'delil', 'karar'],
      'Ceza',
      `${t} CMK / TCK rejimine girer. Şikâyete bağlı suçlarda 6 ay kuralı sık kaçar. Tutuklama ve adli kontrol ayrı tedbirlerdir.`
    );
  if (/bekletici-mesele|dava-acilmasi-sartlari|yetkili-mahkeme|gorevli-mahkeme|delil-baslangici|kesin-delil|islah-nedir|belirsiz-alacak|davaya-mudahale|ihtiyati-tedbir-teminati|kesinlesme-senedi|vekalet-ucreti-karsi|whatsapp-yazismasi|uyap-vatandas|avukat-vekalet|arabulucu-nasil|dilekce-nasil|ihtarnama-nasil|sulh-nedir|feragat-nedir|kabul-nedir|gorevsizlik|yetkisizlik|kesif-nedir|yemin-delili|istinaf-dilekcesi|temyiz-siniri|e-devlet-dava|avukat-tutmak|adli-yardim|arabuluculuk-anlasma-icra|noter-vekalet|genel-vekaletname|hak-dusurucu|kesinti-durma|ispat-yuku|karine-nedir|tebligat-kanunu|usulsuz-tebligat-ogrenme|e-tebligat-acmamak|yargi-giderleri|delil-tespiti|ihtiyati-tedbir-itiraz|arabuluculuk-son-tutanak/.test(s))
    return g(
      [`${t} için dosya evresini (dava öncesi / yargılama / kanun yolu) tespit edin.`, 'HMK’daki süre ve şekli yazın.', 'Görevli-yetkili mahkeme ve harcı kontrol edin.', 'Yazılı dilekçe / tutanak kullanın.', 'Kaçırılan sürenin hak düşürücü olup olmadığına bakın.'],
      ['dilekçe', 'tebligat', 'harç'],
      'Usul',
      `${t} yargılama usulüne aittir. Yanlış mahkeme veya süre çoğu hakkı bitirir. Delil ve feragat geri alınamaz sonuç doğurabilir.`
    );
  if (/mtv-nedir|gelir-vergisi|kdv-nedir|fatura-iptali|e-fatura|vergi-incelemesi|vergi-ziyai|damga-vergisi|gecikme-zammi|stopaj-nedir|muhtasar|e-haciz-nedir/.test(s))
    return g(
      [`${t} için GİB / e-Devlet kaydını açın.`, 'Vade, tebliğ ve ceza türünü yazın.', 'Ödeme, uzlaşma veya dava yolunu karşılaştırın.', 'Yapılandırma penceresi açık mı bakın.', 'Dekont ve kapanış fişini saklayın.'],
      ['tahakkuk', 'beyan', 'dekont'],
      'Vergi',
      `${t} VUK ve ilgili vergi kanununa bağlıdır. Süreler tebliğle başlar ve kısadır. e-Haciz sürpriz olmasın diye dökümü izleyin.`
    );
  if (/imar-planina|yapi-tatil|imar-barisi|kentsel-donusum|riskli-yapi|belediye-imar-para|iskan-olmadan|yapi-denetim|imar-affi|kiyi-kenar|sit-alani|cevre-duzeni|emsal-nedir|taks-nedir|iskan-basvurusu|kacak-kat|muhur-sokme|cevre-izin|gida-isletme|is-yeri-acma/.test(s))
    return g(
      [`${t} için belediye / Çevre Şehircilik evrakını alın.`, 'Tebliğ ve askı süresini yazın.', 'Ruhsat, plan veya yıkım işlemine karşı idari itiraz / dava açın.', 'İskan ve kaçak yapı yaptırımlarını karıştırmayın.', 'Mühür sökmeyin; ayrı suçtur.'],
      ['tebliğ', 'imar evrakı', 'dilekçe'],
      'İmar',
      `${t} imar ve yapı denetim rejimine girer. Askı ve tebliğ süreleri kısadır. İmar affı dönemleri kapalıysa eski belge yeni imalatı korumaz.`
    );
  if (/iptal-davasi-nedir|tam-yargi|idari-islem-nedir|yurutmenin-durdurulmasi|memur-disiplin|kamu-ihalesi|dilekce-hakki|idari-basvuru|belediye-encumen|zabita-cezasi|kamulastirma-bedel|acele-kamulastirma|idari-para-cezasi/.test(s))
    return g(
      [`${t} için idari işlemi ve tebliğ tarihini yazın.`, 'Üst başvuru gerekip gerekmediğine bakın.', '60 günlük (veya özel) dava süresini hesaplayın.', 'İdare / vergi mahkemesinde iptal veya tam yargı açın.', 'Yürütmenin durdurulmasını ayrı isteyin.'],
      ['idari işlem', 'tebliğ', 'dilekçe'],
      'İdare',
      `${t} İYUK rejimindedir. Süre kaçınca esas incelenmez. Tam yargı zarar, iptal işlemin yokluğunu ister.`
    );
  if (/cek-nasil|limited-sirket|anonim-sirket|sirket-hisse|ticaret-sicili|haksiz-rekabet|marka-tescil|cek-karsiliksiz-ceza|ticari-defter|unvan-tescili|ticari-arabuluculuk|teminat-mektubu|cek-ibraz|sirket-borclarinda|anonim-sirket-yonetim|ticari-is-karinesi|fatura-itiraz-suresi|cari-hesap|franchise|acente-sozlesmesi|tasima-sozlesmesi/.test(s))
    return g(
      [`${t} için TTK ve ilgili senet / sözleşme şartlarını kontrol edin.`, 'Sicil, noter veya ticaret mahkemesi mercini seçin.', 'Süre (ibraz, itiraz, zamanaşımı) yazın.', 'Yazılı belge ve defter kaydını saklayın.', 'Ticari arabuluculuk dava şartını unutmayın.'],
      ['sözleşme / senet', 'sicil', 'yazışma'],
      'Ticaret',
      `${t} TTK rejimine girer. Ticari iş karinesi faizi ve ispatı değiştirir. Çek ve şirket işlemlerinde şekil katıdır.`
    );
  if (/bagkur|genel-saglik|rapor-parasi|olum-ayligi|e-devlet-sgk|sgk-tesvik|gecici-is-goremezlik|prim-iadesi|yurt-disi-borclanma|intibak-emeklilik|emekli-ikramiyesi|emekli-maasi|emeklilikte-yasa/.test(s))
    return g(
      [`${t} için e-Devlet SGK kaydını açın.`, 'Prim günü, statü ve talep şartını yazın.', 'Tahsis veya borçlanma başvurusunu yapın.', 'Ret yazısına itiraz / dava süresini hesaplayın.', 'Ödeme veya aylık hesabını kontrol edin.'],
      ['hizmet dökümü', 'başvuru', 'ret / tahsis yazısı'],
      'SGK',
      `${t} 5510 sayılı Kanun ve bağlı tebliğlere tabidir. Statü (4/a, 4/b, 4/c) sonucu değiştirir. Tahminî hesap bağlayıcı değildir.`
    );
  if (/kefil-olursam|yuklenici-temerrudu|kefilden-tahsilat|manevi-tazminat|maddi-tazminat|kusursuz-sorumluluk|rucu-davasi|hile-ile-sozlesme|gabin-nedir|sozlesmeden-donme|cezai-sart|temerrut-faizi|faiz-hesaplama|emanet-sozlesmesi|odunc-sozlesmesi|bagis-sozlesmesi|vekalet-sozlesmesi-tbk|eser-sozlesmesi|on-sozlesme|genel-islem-kosullari|sozlesmenin-yorumu|hukuki-islem|butlan-nedir|iptal-edilebilirlik|destek-payi/.test(s))
    return g(
      [`${t} için sözleşmeyi ve ifa / aykırılık tarihini yazın.`, 'TBK’daki şekil, zamanaşımı ve seçimlik hakları kontrol edin.', 'İhtar veya dönme beyanını yazılı gönderin.', 'Tazminat, faiz veya geçersizlik davasını seçin.', 'İspat yükünü belgelerle karşılayın.'],
      ['sözleşme', 'ihtar', 'ödeme / zarar belgesi'],
      'Borçlar',
      `${t} TBK genel hükümlerine bağlıdır. Şekil eksiği butlan, irade sakatlığı iptal doğurur. Cezai şart ve faiz ayrıca hesaplanır.`
    );
  if (/turk-vatandasligi|evlilikle-vatandaslik|oturma-izni-uzatma|uluslararasi-koruma|turist-ikamet|calisma-izni-muafiyeti/.test(s))
    return g(
      [`${t} için pasaport ve mevcut izin bitişini kontrol edin.`, 'e-ikamet / Göç İdaresi veya Nüfus yolunu seçin.', 'Harç ve evrak listesini tamamlayın.', 'Redde idari itiraz ve iptal davası süresini yazın.', 'İzinsiz kalmayı uzatmayın.'],
      ['pasaport', 'izin', 'harç'],
      'Yabancılar',
      `${t} YUKK rejimindedir. Süre aşımı sınır dışı ve giriş yasağı doğurur. Vatandaşlık evlilikle otomatik değildir.`
    );
  if (/engelli-maasi|evde-bakim/.test(s))
    return g(
      ['Engel oranı ve hane gelir şartını kontrol edin.', 'Sağlık kurulu raporunu güncelleyin.', 'Kaymakamlık / Aile Sosyal Hizmetler veya SGK’ya başvurun.', 'Ret gerekçesine itiraz edin.', 'Rapor süresi bitince yenileyin.'],
      ['engelli raporu', 'gelir belgesi', 'başvuru'],
      'Şart',
      `${t} gelir testi ve rapor oranına bağlıdır. Süreli rapor bitince ödeme durur.`
    );
  if (/kimlik-karti|dogum-belgesi|evlilik-basvurusu|ikametgah-belgesi|askerlik-durum|e-devlet-sifresi|soyadi-degisikligi|isim-degisikligi/.test(s))
    return g(
      [`${t} için e-Devlet veya nüfus müdürlüğünden işlemi seçin.`, 'Kimlik ve istenen ek belgeyi hazırlayın.', 'Randevu / başvuruyu tamamlayın.', 'Mahkeme kararı gereken değişiklikte aile / asliye hukuka gidin.', 'Yeni kimliği bağlı kurumlara bildirin.'],
      ['kimlik', 'e-Devlet', 'mahkeme kararı (gerekiyorsa)'],
      'Nüfus',
      `${t} nüfus hizmetleridir. Ad / soyadı değişikliği kural olarak mahkeme ister. Adres ve kimlik güncellemesi tebligatı etkiler.`
    );
  if (/eds-ceza|trafik-ceza-puani|alkollu-arac|kaza-tespit|kusur-orani-trafik|arac-muayene|plaka-devri|trafik-sigortasi-zorunlu|deger-kaybi|destekten-yoksun|trafik-cezasi-pesin|ehliyet-sinavlari|src-belgesi|psiko-teknik|trafik-kazasi-manevvi/.test(s))
    return g(
      [`${t} için e-Devlet / emniyet / sigorta kaydını açın.`, 'Tebliğ veya kaza tarihini yazın.', 'İtiraz, ihbar veya belge yenileme mercini seçin.', 'Süre (15 gün itiraz, poliçe ihbarı) kaçırmayın.', 'Ödeme indirimi ile itiraz hakkını birlikte tartın.'],
      ['tebliğ / tutanak', 'poliçe', 'e-Devlet'],
      'Trafik',
      `${t} KTK ve sigorta rejimine girer. Ceza puanı, el koyma ve tazminat ayrı usullerdir.`
    );
  if (/ogrenci-belgesi|ogrenim-ucreti|okul-kayit-ucreti|yuksekogretim-disiplin/.test(s))
    return g(
      [`${t} için okul / YÖK kaydını alın.`, 'Sözleşme veya yönetmelikteki iade / disiplin maddesini okuyun.', 'Yazılı başvuru yapın.', 'Redde idari itiraz veya tüketici yolunu seçin.', 'Disiplin cezasına karşı süreleri yazın.'],
      ['kayıt sözleşmesi', 'dekont', 'yönetmelik'],
      'Eğitim',
      `${t} özel okulda tüketici, devlet okulunda idare hukukuna kayabilir. Disiplin cezası öğrenci yönetmeliğine bağlıdır.`
    );
  if (/saglik-turizmi/.test(s))
    return g(
      ['Tedavi sözleşmesi ve onamı alın.', 'Fatura ve komplikasyon kaydını saklayın.', 'Ayıp / malpraktis yolunu ayırın.', 'Yabancı hasta ise yetki ve dil kaydını yazın.', 'Tazminat veya iade için mercie gidin.'],
      ['sözleşme', 'onam', 'fatura', 'epikriz'],
      'Sağlık',
      'Sağlık turizminde sözleşme ve onam esastır. Komplikasyon her zaman hata değildir; dosya ve bilirkişi gerekir.'
    );

  const cat = a.category;
  const docs = (
    {
      Aile: ['nüfus kayıt', 'dilekçe', 'gelir belgesi'],
      İş: ['sözleşme', 'bordro', 'fesih yazısı'],
      İcra: ['takip evrakı', 'tebligat', 'dekont'],
      Kira: ['kira sözleşmesi', 'ihtar', 'dekont'],
      Tüketici: ['fatura', 'yazışma', 'başvuru'],
      Miras: ['veraset ilamı', 'nüfus kayıt', 'vasiyet'],
      Eşya: ['tapu', 'sözleşme', 'dilekçe'],
      Usul: ['dilekçe', 'tebligat', 'harç'],
      İdare: ['idari işlem', 'tebliğ', 'başvuru'],
      Trafik: ['tutanak', 'poliçe', 'tebliğ'],
      Vergi: ['tahakkuk', 'dekont', 'beyan'],
      'Sosyal Güvenlik': ['hizmet dökümü', 'başvuru', 'rapor'],
      Ceza: ['şikâyet', 'delil', 'ifade'],
      Ticaret: ['belge / senet', 'sicil', 'yazışma'],
      İmar: ['ruhsat', 'tebliğ', 'proje'],
      Nüfus: ['kimlik', 'e-Devlet çıktısı'],
      Sigorta: ['poliçe', 'ihbar', 'eksper'],
      'Kişisel Veri': ['başvuru', 'yazışma'],
      Yabancılar: ['pasaport', 'izin belgesi'],
      Mevzuat: ['madde metni'],
    } as Record<string, string[]>
  )[cat] || ['ilgili belgeler', 'yazılı başvuru'];

  return g(
    [
      `${t} için olayı ve tarihi yazın.`,
      'Gerekli belgeleri toplayın; e-Devlet / ilgili kurum kaydını alın.',
      'Doğru mercie yazılı başvurun veya davayı açın.',
      'Tebliğ ve yasal süreyi takvime işleyin.',
      'Sonucu izleyin; rette itiraz veya kanun yolunu kullanın.',
    ],
    docs,
    'Kısa not',
    `${t} konusunda süre ve merci dosyaya göre değişir. Genel bilgidir; güncel metin esastır.`
  );
}
