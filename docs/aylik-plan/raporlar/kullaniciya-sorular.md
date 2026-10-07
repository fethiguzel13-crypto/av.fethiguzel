# Kullanıcıya sorular / kararlar

Ajan bu maddelerde kendi başına karar vermez; en güvenli varsayımla devam eder.

## 2026-10-01

1. **Canlı site kapalı (Vercel 402 DEPLOYMENT_DISABLED).** Vercel panelinde Usage'da hangi limit
   aşıldı? Pro plan mı, dönem sıfırlanması mı? Ayrıntı: `raporlar/vercel-kullanim.md`.
   *Varsayım:* ajan kullanım sürücülerini azaltmaya devam eder, push yapmaz.
2. **Yapay zekâ tarayıcıları (robots.ts).** Şu an hepsi açık (GPTBot, ClaudeBot, PerplexityBot,
   Bytespider, CCBot…). Öneri: yapay zekâ *cevaplarında* görünürlük sağlayanlar açık kalsın (OAI-SearchBot,
   ChatGPT-User, PerplexityBot, Claude-SearchBot, Applebot), yalnız toplu eğitim verisi toplayıp trafik
   getirmeyen Bytespider ve CCBot kapatılsın. *Varsayım:* onay gelene kadar dokunulmaz.
3. **Anahtar deposu şifresi** `mobile/keystore-password-SIL-SONRA.txt` düz metin duruyor (git dışında).
   Bir şifre yöneticisine taşınması önerilir. *Varsayım:* ajan dokunmaz.
4. **Erken yayın?** Sitenin kapanmasına büyük ihtimalle yol açan iki sorun düzeltildi (madde önden yükleme
   fırtınası `5ffe31209`, tam metin indeksinin her açılışta inmesi `a33f0aa67`). Vercel limiti sıfırlanıp site
   açıldığında bu düzeltmeler yayında değilse limit yeniden dolabilir. Yalnız bu iki düzeltmenin 30 Ekim'i
   beklemeden yayına alınmasını ister misiniz? *Varsayım:* push yok (talimat gereği).
5. **Üyelik ortam değişkenleri (G04).** Vercel üretim ortamında `UYELIK_SESSION_SECRET` (≥ 16 karakter) ve
   `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` tanımlı mı? Sır yoksa üyelik artık tamamen kapanır
   (önceden sahte çerez kabul ediliyordu). Upstash yoksa üyeler yalnız sunucu belleğinde tutulur ve her soğuk
   başlangıçta silinir. Ayrıntı: `raporlar/guvenlik-api.md`.
   *Varsayım:* ikisinin de tanımlı olduğu varsayılır; yayın günü (G26) Vercel panelinden doğrulanır.
6. **Yönetici çerezi (G04, bilgi).** Yönetim paneli çerezine artık sırrın kendisi değil, ondan türetilmiş
   değer yazılıyor. Yayından sonra panel bir kez sır ister; başka bir değişiklik yok.
7. **Mobil abonelik sunucu doğrulaması (G05/M3).** Play satın almaları şu an yalnız cihazda doğrulanıyor.
   Sunucu doğrulaması için Google Cloud hizmet hesabı (Play Developer API) gerekir. Tam metin ve çözme anahtarı
   cihazda olduğundan kazanç sınırlıdır. Kurulmasını ister misiniz? Ayrıntı: `raporlar/guvenlik-mobil.md`.
   *Varsayım:* mimari korunur; ödeme sahteciliği gözlenirse yeniden değerlendirilir.
8. **Mobil yedekleme (G05/M4).** Android 7–11'de favoriler ve notlar Google yedeğine girmiyor, Android 12+'da
   giriyor. İkisi eşitlensin mi (notlar her sürümde yedeklensin mi), yoksa notlar hiç yedeklenmesin mi?
   *Varsayım:* onay gelene kadar mevcut kurallar korunur.
9. **Play inceleme kodu yenilendi (G05/M1, yayın günü eylemi).** Eski kod herkese açık depoda yazılı olduğu için
   ücretli arşivi herkese açıyordu. Yeni kod yalnız git dışındaki `mobile/inceleme-kodu.local.txt` dosyasında.
   Yayın günü Play Console → Uygulama erişimi talimatı bu kodla güncellenmeli; talimata "uygulama yeniden
   başlatılırsa kodu tekrar girin" notu eklenmeli. *Varsayım:* G26 kontrol listesine eklendi.

## 2026-10-02

Sorular 10–13, G07 reklam yasağı denetimindendir (`raporlar/reklam-uyum.md`). Ölçüt, TBB Reklam Yasağı Yönetmeliği'nin
9/8/2024 değişikliğiyle gelen m.7/1-e hükmüdür: İş elde etmeye yönelik olarak arama motorlarında üst sıraya
çıkmayı amaçlayan anahtar sözcük ve sayfa adresi kullanılamaz. 2/5/2026'da çevrimiçi ihlalleri izleyen bir takip
merkezi kurulmuştur (m.12/A). Bu dört soru yanıtlanmadan push yapılmamalıdır (G26).

10. **Bölge sayfaları (`van-avukat`, `ercis-avukat`, `ankara-avukat` … 12 sayfa ve `english-speaking-lawyer`).**
    Öneri: Erciş sayfası büro bilgisi olarak `/buro` adresine 308 ile taşınsın. Diğer 11 bölge sayfası ve İngilizce
    sayfa `noindex` alsın ve haritalardan çıksın; sayfalar ziyaretçiye açık kalsın. Profil fotoğrafının dosya adı
    (`av-fethi-guzel-van-ercis-avukat.jpg`) tarafsız bir adla değiştirilsin.
    *Varsayım:* yanıt gelene kadar dokunulmaz (30 Ekim'e kadar yayın yok, risk artmıyor).
11. **Her sayfadaki LegalService şeması.** Öneri: Şema yalnız profil sayfasında kalsın, ad, unvan, adres, telefon ve
    e-posta ile sınırlansın; 7 yerleşimli `areaServed` ile hizmet `OfferCatalog`'u çıkarılsın. `priceRange: '$$'`
    bu görevde kaldırılmıştır. *Varsayım:* yanıt gelene kadar dokunulmaz.
12. **"Avukat & Arabulucu" sıfatı.** Yönetmelik m.6/5, avukat ve akademik unvan dışında "bilirkişi … ve benzeri
    sıfatları" yasaklamaktadır. Arabuluculuğun bu kapsama girip girmediğine dair bir TBB ya da baro kararı bu
    oturumda doğrulanamamıştır. Öneri: Arabuluculuk adın yanında sıfat olarak değil, faaliyet alanı bilgisi olarak
    verilsin. Bu konuda bildiğiniz bir baro uygulaması var mı? *Varsayım:* mevcut kullanım korunur.
13. **İçerik sayfalarındaki ön form çağrısı.** Mobil yapışkan çubuktaki "Form" düğmesi her mevzuat, şerh ve rehber
    sayfasından müvekkil ön formuna götürmektedir. m.7/1-c genel bilgiyi iş elde etme amacıyla yayımlamayı
    yasakladığından öneri şudur: Çubukta yalnız "Ara" ve "Hesap" kalsın, ön forma yalnız profil ve iletişim
    sayfasından ulaşılsın. *Varsayım:* yanıt gelene kadar dokunulmaz.
14. **Yazar kimliğinde sitede bulunmayan bilgiler (G09).** Yazar kutusu ve Person şeması yalnız sitede zaten yazan
    bilgilerden üretildi: ad, akademik çalışma (özel hukuk doktora çalışmaları), "e-duruşma" monografisi, e-posta,
    büro adresi, sosyal hesaplar. Arama motorunun yazar varlığını tanımasını güçlendirecek şu bilgiler sitede yoktur
    ve uydurulmadı: kayıtlı olunan baro ve sicil numarası, avukatlığa başlama yılı, doktora programının yürütüldüğü
    üniversite, ORCID / Google Akademik / DergiPark yazar profili, monografi dışındaki yayınların künyeleri. Hangileri
    yayımlanabilir? Verilenler `lib/profile.ts`'e girer; şema ve yazar kutusu kendiliğinden güncellenir.
    *Varsayım:* yanıt gelene kadar yalnız mevcut bilgiler kullanılır.
15. **Makale başlıkları ve künyeleri (G10).** `/makale-oku` sayfalarının başlığı, h1'i ve ScholarlyArticle
    şemasındaki adı Word ya da PDF dosyasının adından gelmektedir. Üç dosyanın adı makalenin başlığı değildir:
    `MİRAS/Yeni Microsoft Word Belgesi.docx`, `kanun yolu/fethi güzel kanun yolu.docx`,
    `umut hakkı/Umut Hakkı (1).pdf`. `ARABULUCULUK/arabuluculuk anlaşma belgesi.docx` ile
    `GENEL İŞLEM ŞARTLARI/genel işlem koşulları.docx` ise küçük harfle yazılmıştır. Belgelerde başlık biçimli bir
    satır bulunmadığından (ilk satır "İÇİNDEKİLER") başlık belgeden de çıkarılamamıştır. Bu makalelerin yayımlanacak
    başlıkları nedir; dergide ya da kitapta yayımlananlar varsa künyeleri (dergi, cilt, sayı, yıl) nelerdir? Yanıt
    gelince adres değiştirilmeden bir başlık ve künye tablosu eklenir; okunur adres ve kalıcı yönlendirme G12'de ele
    alınır. *Varsayım:* başlık ve tarih uydurulmaz; dosya adı kalır, şemaya yayın tarihi yazılmaz.
16. **Ders notlarında dizine açık sayfalar (G11).** 6.552 ders notu, 26 dersin üç sürümünün (1. dönem, 2. dönem,
    yıllık) 84 fakülteye ad değiştirilerek çoğaltılmış hâlidir. Fakülte adı çıkarıldığında metinler büyük ölçüde
    aynıdır; farklı kalan kısım kalıp cümle çeşitlemesi ve "Cebeci geleneği", "Maslak / Ayazağa usulü" gibi
    üretilmiş yer ifadeleridir. Google bu yapıyı ölçeklenmiş içerik ve kapı sayfası sayabilir. Yalnız her dersin
    bir yıllık notu dizine açık bırakılmıştır (26 not, seçim kuralı: adresli kaynağı en çok olan fakülte; sonuç 26'sında
    da Ankara). 84 fakülte sayfasından yalnız Ankara'nınki dizindedir. Notlar silinmemiş, adresler değişmemiştir;
    öğrenci bütün notları okumaya devam eder. Bu daraltma kabul ediliyor mu, yoksa belirli fakülteler (ör. kendi
    fakülteniz) için ayrı dizin kararı mı istenir? Ankara notlarındaki "Cebeci geleneği" türü fakülte nitelendirmeleri
    doğrulanmış değildir; G19'da kanonik not yeniden yazılırken çıkarılması önerilir.
    *Varsayım:* yanıt gelene kadar 26 temsilci not ve tek fakülte sayfası dizinde kalır; liste
    `lib/ders-notlari/dizin-kanonik.json`'dan tek satırla değiştirilebilir.
17. **Ders notu gezinme listeleri dizine kapalı sayfalara bağlanıyor (G12).** İç bağlantı ağında kural, bağlantının
    yalnız dizine açık sayfaya verilmesidir. İki gezinme listesi bunun dışında kaldı: `/ders-notlari` 84 fakülte sayfasını
    (83'ü noindex), dizine açık tek fakülte sayfası `/ders-notlari/ankara` ise 125 kopya ya da dönemlik notu (noindex)
    listeler. Bu sayfalar soru 16'daki karar gereği okunur kalmaktadır (noindex, follow); bağlantılar kaldırılırsa öğrenciler
    notlara siteden ulaşamaz. Google'ın noindex, follow sayfaya iç bağlantıyı cezalandırdığına ilişkin bir kural yoktur;
    yalnız tarama bütçesi bu sayfalara da harcanır. Listeler böyle kalabilir mi, yoksa dizine kapalı fakülteler ana sayfada
    tek bir "diğer fakülteler" bölümünde mi toplanmalı? *Varsayım:* yanıt gelene kadar listeler olduğu gibi kalır.
18. **Yargı arşivinde TBT artışı (G13).** Google Fonts stil dosyası her sayfada ilk boyamayı engellediği için kaldırıldı
    (yüklediği Source Serif 4 hiçbir bileşende kullanılmıyordu). Bunun sonucunda yargı arşivinde içerik yaklaşık yarım saniye
    erken görünüyor, ne var ki mobil Lighthouse'un toplam engelleme süresi (TBT) yaklaşık 0,7 sn'den 1,5 sn'ye çıkıyor. Dört
    adayın ayrı ayrı sınandığı ölçümde artışı yalnız bu değişiklik açıkladı. Hızlı ilk görüntü ve dış alan adına bağımlılığın
    kalkması (ziyaretçi IP'si Google'a gitmez) tercih edildi. Stil dosyası geri eklensin mi? *Varsayım:* yanıt gelene kadar
    kaldırılmış kalır; ayrıntı ve ölçüm tabloları `gorevler/G13.md` sonunda.
19. **Yayına girecek karar kümesi (G14).** Plan, yalnız emsal nitelikli ve benzersiz kararların yayına girmesini öngörüyor. Hasat
    motorunun emsal defterine göre 7 Ekim sabahı 113.830 kararın 39.265'i bu ölçütü karşılıyor. Kalanların 54 bini daha önce inen
    bir karara benziyor, 20 bininin emsal niteliği zayıf. İçtihadı birleştirme kararları (40) etiketten bağımsız olarak dahil
    edildi. Süzgeç web arama indeksine ve mobil arşive birlikte uygulanıyor, bu yüzden sitedeki ve uygulamadaki karar sayacı
    yaklaşık 70 binden 39 bine inecek. Üyelere açık ücretli arşivde de yalnız bu küme mi kalsın, yoksa üyeler benzer kararları
    da görebilsin mi? *Varsayım:* yanıt gelene kadar plan uygulanır, iki çıktı da yalnız süzülmüş kümeyi taşır. Arşivdeki
    hiçbir karar silinmez, `--hepsi` bayrağı eski davranışı geri getirir.
20. **Karar sayfaları arama motoruna açılsın mı? (G14).** Her karar sayfası artık sunucuda künye, daire, tarih, konu ve
    kararın ilk ~240 karakterini taşımaktadır. Tam metin yalnız üyeye açıktır. Yayın indeksinde olmayan kimlik 404 döner.
    Sayfalar dizine açılırsa yaklaşık 39 bin yeni adres arama sonuçlarına girer ve künye sorgularında (ör. "HGK 2026/410")
    görünürlük doğar. Ne var ki her sayfanın herkese açık kısmı kısa olduğundan Google bunları ince içerik sayabilir. G11'de
    ders notlarında aynı gerekçeyle 6.552 sayfa dizinden çıkarılmıştı. Ücretli metnin arkasındaki sayfa dizine açılacaksa
    Google'ın ücretli içerik işaretlemesi (`isAccessibleForFree: false`) de eklenmelidir. Seçenekler: sayfalar kapalı kalır,
    yalnız içtihadı birleştirme ve genel kurul kararları açılır (yaklaşık 22 bin), ya da hepsi açılır. *Varsayım:* yanıt
    gelene kadar bütün karar sayfaları dizine kapalı kalır (`noindex, follow`). Değişiklik
    `lib/yargi-karar-sayfa.mjs` içindeki `KARAR_SAYFASI_DIZINDE` sabitiyle yapılır.
21. **Koyu tema eklensin mi? (G15).** Sitede koyu tema yoktur, sayfalar işletim sistemi koyu temada olsa da krem zeminde açılır.
    Koyu tema eklemek 2.168 renk kullanımının ikinci bir palete taşınmasını ve 30 Ekim öncesinde bütün sayfa türlerinin iki
    tema için ayrı ayrı denetlenmesini gerektirir. Bu, renk dilinin yeniden tasarımıdır. G15 bunun yerine açık temadaki
    kontrast sorunlarını gidermektedir (`raporlar/tasarim-denetimi.md`). *Varsayım:* yanıt gelene kadar site yalnız açık temada
    kalır. Koyu sistem temasında tarayıcı çubuğunun kömür rengi alması da krem yapılacaktır, böylece çubuk ile sayfa uyumlu olur.
