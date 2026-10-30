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
22. **Karar arşivi istatistiklerinde hukuk alanı ve emsal oranı (G17).** Plan, `/yargi-kararlari/istatistik` sayfasında hukuk
    alanına göre dağılım ile emsal ve benzer oranını da öngörmekteydi. Sayfadaki sayılar sitede yayımlanan web indeksinden
    (39.718 karar) alınmış olup bu indekste alan bilgisi bulunmamaktadır. Canlı hasat indeksi ise bugün 40.640 kararı süzgeçten
    geçirmekte olduğundan iki kaynak birleştirilirse sayfadaki toplamlar sitede yayımlanan sayıyla çelişir. *Varsayım:* sayfa
    yalnız yıl ve birim dağılımını gösterir. Alan dağılımı istenirse yayın üretimi (`data/yayin/`) alan sayımını da yazacak
    biçimde genişletilir, bu da bir sonraki yayın üretiminde iki kaynağı aynı anlık görüntüye bağlar.
23. **Anayasa hukuku ders notu ve İYUK metni (G19).** Plan, kalite dalgası 1'deki on ders arasında anayasa hukukunu da saymaktadır.
    Sitede anayasa hukukunun ders notu, ders grafı ve depoda Anayasa metni bulunmamaktadır. İdare hukuku notunun kanonik katmanı da
    depoda İdari Yargılama Usulü Kanunu metni olmadığından yalnız Kamulaştırma, Belediye ve İmar Kanunlarına dayanmaktadır.
    *Varsayım:* on ders, plandaki "ticari işletme/şirketler" kalemi iki ayrı not sayılarak tamamlanmıştır. Anayasa notu G23'te,
    önce Anayasa ve İYUK metni mevzuat.gov.tr'den depoya alınıp kanun metnine bağlanarak yazılır. Anayasa notu bu dalgaya
    alınmalıysa ya da hiç yazılmamalıysa bildirmeniz yeterlidir.
24. **Sürüm derlemesinde Android lint denetimi açılsın mı? (G21, G05/M5).** `lintRelease` 13 Ekim'de güvenlik kategorisinde
    bulgu vermemiştir. Yedi "Fatal" bulgunun hepsi yedekleme kurallarındadır: `backup_rules.xml` ve `data_extraction_rules.xml`
    WebView veritabanlarını dışlamakta, ne var ki bu yollar zaten hiçbir `<include>` altında bulunmadığından dışlama etkisizdir.
    WebView verisi bugün de yedeğe girmemektedir. `checkReleaseBuilds true` yapılırsa bu bulgular imzalı sürüm derlemesini
    durdurabilir. Etkisiz satırların silinmesi davranışı değiştirmez, ama aynı dosyalar soru 8'in konusudur.
    *Varsayım:* soru 8 yanıtlanana kadar `checkReleaseBuilds false` ve yedekleme dosyaları olduğu gibi kalır. Soru 8 yanıtlandığında
    dosyalar yeniden yazılır, etkisiz dışlamalar kaldırılır ve denetim açılır.
25. **Vekalet ücreti hesaplayıcısında iki yorum kararı (G22).** Hesaplayıcı 13 Ekim'de AAÜT (RG 04.11.2025/33067) metniyle
    karşılaştırılmış ve üç kuralı yanlış uyguladığı görülmüştür. Bunlar düzeltilmiştir: Hükmedilen ücret artık her mahkemede kabul ya
    da ret edilen miktarı geçmemektedir (m.13/2), icra mahkemesinde Üçüncü Kısım ücreti 18.000 TL'yi aşmamaktadır (m.11/3), tahliye
    takibinde ise miktardan bağımsız olarak 20.000 TL maktu ücret verilmektedir (m.11/5). İki nokta tarifenin lafzından kesin çıkmamaktadır.
    Birincisi, tahliye takibinde maktu ücretin kira alacağı tutarıyla sınırlı olup olmadığıdır. Hesaplayıcı tutarla sınırlamamaktadır,
    zira m.11/5 bir sınır öngörmemekte ve m.13/2 kabul ya da ret edilen miktara bağlanmaktadır. İkincisi, tarifede ayrı sırası olmayan
    aile mahkemesine asliye mahkemesi ücretinin (45.000 TL, İkinci Kısım İkinci Bölüm sıra 10) uygulanmasıdır.
    *Varsayım:* iki nokta da yukarıdaki biçimde kalır. Yerleşik uygulama farklıysa bildirmeniz yeterlidir.
26. **Makine prize takılabilir mi? (G23, G24).** 16 Ekim 10:00'dan bu yana makine pildedir ve 11:00'de şarj %4'e inmiştir. Otonom
    yordam pil %50'nin altındayken uzun işi başlatmadığından G23'ün kapanışı için gereken `npm run kalite` 15 Ekim akşamından beri koşulamamakta,
    G24 1. adımı da hızlı kapısız `wip:` commit'te beklemektedir.
    *Varsayım:* makine prize takılana kadar oturumlar yalnız kayıt ve kısa iş yapar.
    *Durum (16 Ekim 22:00):* makine prizdedir (%100). Hızlı ve tam kapı koşulmuş, G23 kapanmıştır. Soru kendiliğinden düşmüştür.
27. **G25 "bağımlı: hepsi" G00'ı da kapsar mı? (G25).** `PLAN.md`'de G00 (canlı sitenin Vercel 402 ile kapalı olması) ve G08 (haftalık
    hasat bakımı) `[ ]` durmaktadır. G00'ı yalnız siz Vercel panelinden çözebilirsiniz, G08 ise her hafta tekrarlanan ve işaret kutusu
    taşımayan bir bakımdır. Bu iki madde ajanın kapatabileceği iş olmadığından G25 (son regresyon) 17 Ekim 04:00'te başlatılmıştır.
    *Varsayım:* G25 yerel derleme üzerinde yürür. G00 30 Ekim yayınından önce sizin eyleminizi bekler, G26'nın push adımı da buna bağlıdır.
28. **Eski alan sayfaları `/mevzuat`'a yönlendirildi (G25 adım 4).** `/medeni-hukuk`, `/borclar-hukuku`, `/ticaret-hukuku` ve on dört alt
    alan adresi (`/medeni-hukuk/aile-hukuku` gibi) sitenin içinden bağlantı almıyordu, buna karşılık `sitemap.xml`'de 0,9 ve 0,8 önceliğiyle
    duruyor ve eski tasarımı taşıyordu (`h1`'den `h3`'e atlama, 2,63:1 karşıtlık). Aynı madde listesi `/mevzuat/tmk`, `/mevzuat/tbk` ve
    `/mevzuat/ttk`'da güncel tasarımla bulunduğundan on yedi adres 18 Ekim'de ilgili kanun sayfasına kalıcı (308) yönlendirilmiş ve site
    haritasından çıkarılmıştır. Arama motorundaki eski adresler böylece kaybolmaz, değerini kanun sayfasına aktarır. Sayfa dosyaları
    (`app/[category]/`) silinmemiş, yalnız erişilmez hâle gelmiştir.
    *Varsayım:* yönlendirme kalır. Alan sayfalarını ayrı açılış sayfası olarak korumak isterseniz yönlendirme `next.config.ts`'ten
    kaldırılır ve sayfalar yeni tasarıma taşınır.

## 2026-10-19

29. **Yerel karar arama aracı yayına girsin mi? (G26).** Başka bir oturumun yazdığı araç (`scripts/karar-arama/`, `package.json`'daki üç
    satır, `scripts/kalite.mjs` ve `.gitignore` değişikliği) 18 Ekim'den beri commit'sizdir. Kalite kapısı onun 44 testini de koşmaktadır,
    araç yalnız `127.0.0.1`'e bağlanır. Başsız oturumlar bu dosyalara dokunmamıştır.
    *Varsayım:* araç commit'lenmeden bekler, kontrol listesinin (`PUSH-KONTROL-LISTESI.md` A bölümü) ilk adımı bu kararı ister. Push'a
    girecekse önce commit'lenir, girmeyecekse `git stash -u` ile ayrılır.
30. **Açık ajan görevi yokken saatlik kayıt sürsün mü? (OTONOM yordamı).** G26'nın ajan payı 19 Ekim 07:11'de bitmiştir. O saatten beri
    her başsız oturum `ILERLEME.md`'ye aynı içerikte bir izleme bloğu ekleyip yerel commit atmaktadır (08:00, 09:00, 10:00 ve 11:00).
    Bu biçim yayın gününe kadar yaklaşık 250 içeriksiz commit üretir ve push öncesinde gözden geçirilecek geçmişi kalabalıklaştırır.
    *Varsayım:* yordam değiştirilmemiş olup kayıt ve commit sürmektedir, bloklar kısa tutulur. İsterseniz `OTONOM.md`'ye boşta kalma kuralı
    eklenir: Durum (son commit, çalışma ağacı, hasat sayaçları) önceki kayıtla aynıysa kayıt ve commit atlanır, yalnız bir değişiklik
    (hasat servisinin açılması, yeni commit, bir sorunun yanıtlanması) olduğunda blok yazılır.

## 2026-10-21

31. **Hasat yöneticisinin captcha ayarı değiştirilsin mi? (G08).** Yönetici captcha gelince 5-10 dakika mola verip hızı yarıya
    indirmekte, 30 dakika içinde ikinci captcha gelirse 30-45 dakikalık uzun mola vermektedir (`scripts/yargi-kararlari/harvester/governor.mjs`,
    `captcha` ve `blockedPauseMs`). Hız dakikada 2 olan tabanın altına inmez (`minPerMin`). 21 Ekim'de captcha 16:30, 17:59, 18:38, 19:20,
    19:57, 20:35, 21:09, 21:44, 22:20, 22:55 ve 23:34'te olmak üzere on bir kez gelmiş olup 17:59'dan sonraki aralıklar 39, 42, 37, 37, 34, 35, 37, 35 ve 39 dakikadır. Seri 22 Ekim'de
    00:10, 00:46, 01:28, 02:07, 02:43, 03:19, 03:56 ve 04:31'deki sekiz captcha'yla 36, 37, 41, 39, 36, 37, 37 ve 35 dakikalık aralıklarla sürmüştür. Aralıklar 30 dakikalık
    pencereye yaklaşmakla birlikte hep üstünde kaldığından uzun mola hiç devreye girmemiş, motor her kısa moladan sonra tabandaki hızla sürmüştür. 04:31'deki captcha'dan sonra makine iki kez uykuya geçmiş olup dokuzuncu
    captcha 13:54'te, uyanık geçen ve molayı da içeren yaklaşık 87 dakikadan sonra gelmiş ve yönetici 321 sn mola vermiştir. Günlük sayı 11-19 Ekim
    arasında 1 ile 2 arasında kalmıştır. Devre kapalıdır ve 429 görülmemiştir. 22 Ekim 15:35 ve 22:07'deki iki `ENOTFOUND` ise makinenin
    bekleme sırasındaki kısa uyanışlarında gelmiş olup captcha serisiyle ilgisizdir. Onuncu captcha 23:42'de, 13:54'ten sonra uyanık geçen
    ve molayı da içeren yaklaşık 51 dakikadan sonra gelmiş, yönetici 506 sn mola vermiştir. 23 Ekim'in ilk captcha'sı 00:20'de 38
    dakikalık aralıkla gelmiş (571 sn mola), motor 00:55'te durmuş ve makine 11:42'ye kadar uyumuştur. İkinci captcha 12:45'te, motorun
    11:42'deki yeniden başlamasından sonra kapağın kapalı kaldığı 12:02-12:14 aralığı düşülünce uyanık geçen yaklaşık 51 dakikadan sonra
    gelmiş, yönetici 372 sn mola vermiştir. 12:14'teki `ENOTFOUND` kapağın açıldığı saniyede gelmiş olup karar 42 sn sonra inmiştir.
    Makine 13:15'ten sonra uyumamış, seri üçüncü, dördüncü ve beşinci captcha'yla 13:22'de (349 sn mola), 13:58'de (401 sn mola) ve
    14:32'de (525 sn mola) 37, 36 ve 34 dakikalık aralıklarla sürmüştür. Altıncı, yedinci ve sekizinci captcha 15:12'de (410 sn mola),
    15:47'de (537 sn mola) ve 16:26'da (483 sn mola) 40, 35 ve 39 dakikalık aralıklarla gelmiştir. Dokuzuncu ve onuncu captcha 17:03'te (371 sn mola) ve
    17:40'ta (527 sn mola) 37'şer dakikalık aralıkla gelmiştir. On birinci ve on ikinci captcha 18:19'da (453 sn mola) ve 18:57'de
    (355 sn mola) 39 ve 38 dakikalık aralıklarla gelmiştir. On üçüncü captcha 19:33'te 36 dakikalık aralıkla gelmiş, yönetici 591 sn
    mola vermiştir. 19:49'daki tek `network` hatası makine uyanıkken bir arama isteğinde görülmüş, aynı sayfa 45 sn sonra inmiştir. On dördüncü ve on beşinci captcha 20:13'te (440 sn mola) ve 20:49'da
    (341 sn mola) 40 ve 37 dakikalık aralıklarla gelmiştir. On altıncı ve on yedinci captcha 21:25'te (353 sn mola) ve 22:01'de
    (558 sn mola) 36'şar dakikalık aralıkla gelmiştir. On sekizinci captcha 22:39'da 38 dakikalık aralıkla gelmiş, yönetici 525 sn
    mola vermiştir. On dokuzuncu ve yirminci captcha 23:17'de (327 sn mola) ve 23:52'de (497 sn mola) 38 ve 35 dakikalık aralıklarla
    gelmiş, makine 23:58'de «Application API» nedeniyle uykuya geçip 24 Ekim 07:57'de uyanmıştır. Uyanık geçen her aralık yine 30 dakikanın üstünde kaldığından uzun mola devreye girmemiştir.
    Tam metin servisi 09:04'te açıldıktan sonra 24 Ekim'in ilk beş captcha'sı 10:05'te (590 sn mola), 10:45'te (592 sn mola), 11:25'te
    (536 sn mola), 12:03'te (476 sn mola) ve 12:42'de (312 sn mola) 40, 40, 38 ve 39 dakikalık aralıklarla gelmiş olup uzun mola yine
    devreye girmemiştir. Altıncı ve yedinci captcha 13:17'de (399 sn mola) ve 13:56'da (316 sn mola) 35 ve 39 dakikalık aralıklarla
    gelmiş, uzun mola bu kez de devreye girmemiştir. Sekizinci captcha 14:30'da (588 sn mola) 34 dakikalık aralıkla gelmiş olup uzun
    mola yine devreye girmemiştir.
    *Varsayım:* başsız oturumlar yönetici ayarına ve motora dokunmaz, konu 26 Ekim pazartesi günkü G08 bakımında ele alınır. İki seçenek
    vardır: tabanı dakikada 1'e indirmek ya da `captcha.windowMs`'i 60 dakikaya çıkarıp uzun molayı devreye sokmak. İkisi de ayar
    değişikliği ve `hasat-servis.ps1` ile motorun yeniden başlatılmasını gerektirir.
    *Uygulanan karar (2026-10-26 11:05, G08):* Seri 24 Ekim 15:09-17:53 arasında 36-53, 25 Ekim'de 36-39 dakikalık aralıklarla sürmüş,
    26 Ekim'de de 10:02 ve 11:03'te gelmiştir. 19-25 Ekim arasındaki toplam 63'tür. İki seçenek de yavaşlatmakla birlikte verimi daha az
    düşüren pencere ayarı seçilmiş olup `scripts/yargi-kararlari/harvester.json`'a `rate.captcha.windowMs: 3600000` eklenmiştir. Böylece 60 dakika içinde gelen
    ikinci captcha 30-45 dakikalık uzun molayı açar, hız tabanı (2/dk) ve tavan değişmez. Varsayımdaki yeniden başlatma gerekmemiştir,
    zira motor `harvester.json`'un `rate` bölümünü 5 dakikada bir yeniden okumakta olup ayarı 11:06:34'te yüklemiştir. Davranış
    `harvester.test.js`'teki yeni testle sabitlenmiştir. Geri almak için `captcha` satırının silinmesi yeterlidir. Tabanı dakikada 1'e
    indirmek isterseniz aynı dosyada `minPerMin` değiştirilir.
    *Doğrulama (2026-10-26 12:00):* Ayardan sonraki ilk captcha 11:03'te, ikincisi 39 dakikalık aralıkla 11:42'de gelmiş ve yönetici
    günlüğün başladığı 26 Eylül'den bu yana ilk kez 2582 sn (yaklaşık 43 dk) uzun mola vermiştir. 30 dakikalık pencereyle bu captcha yalnız 5-10 dakikalık kısa molaya yol açardı.
    *İzleme (2026-10-26 16:00):* Uzun moladan sonra captcha 12:54'te (583 sn kısa mola), 13:34'te (2357 sn uzun mola), 15:08'de (330 sn
    kısa mola) ve 15:43'te (2107 sn uzun mola) gelmiştir. Seri artık her ikinci captcha'da uzun molaya geçmekte olup motor her moladan sonra
    tabandaki hızla (2/dk) sürmüş, devre kapalı kalmış ve 429 görülmemiştir. Son bir saatte 47 karar inmiştir (12:00'de 49).
    *İzleme (2026-10-26 20:45):* Captcha 16:48'de 15:43'ten 65 dakika sonra gelip kısa molaya (349 sn), 17:23'te 35 dakika sonra gelip
    uzun molaya (2603 sn) yol açmıştır. 19:02'deki captcha 99 dakikalık aralıkla geldiğinden yalnız kısa mola (346 sn) verilmiştir. Kısa
    ve uzun molanın sırayla gelmesi 60 dakikalık pencerenin beklenen sonucudur. Makine 19:05-20:22 arasında büyük ölçüde beklemede
    kaldığından 19:02'den sonraki aralık ölçülememiştir. Son bir saatte 32 karar inmiş olup devre kapalıdır ve 429 görülmemiştir.
    *İzleme (2026-10-26 21:00):* Sonraki captcha 20:51'de, 19:02'den 109 dakika sonra gelmiştir. Bu sürenin yaklaşık 49 dakikası
    19:33-20:22 arasındaki kapak beklemesinde geçmiş olup aralık 60 dakikalık pencerenin dışında kaldığından yönetici yalnız kısa mola
    (460 sn) vermiştir. Motor 20:59'da tabandaki hızla (2/dk) sürmeye başlamıştır. Son bir saatte 48 karar inmiş olup devre kapalıdır ve
    429 ile ağ hatası görülmemiştir.
    *İzleme (2026-10-27 13:42):* Captcha 21:29'da, 20:51'den 38 dakika sonra gelip uzun molaya (1926 sn) yol açmıştır. 22:30'daki captcha
    61 dakikalık aralıkla geldiğinden yönetici yalnız kısa mola (314 sn) vermiş, 23:05'teki captcha ise 34 dakika sonra gelerek uzun
    molayı (2134 sn) yeniden açmıştır. Pencere bir önceki captcha'dan ölçüldüğü için uzun molanın süresi de aralığa girmekte olup 22:30'daki
    captcha motor moladan sonra yaklaşık 29 dakika çalıştığında gelmiştir. Makine 23:35'te «Application API» nedeniyle uykuya geçip 27 Ekim
    13:13'te uyanmış, servis motoru 13:13:49'da yeniden başlatmıştır. Uyanıştan sonraki 29 dakikada captcha gelmemiş, son bir saatte 43
    karar inmiştir. Devre kapalı olup 429 ile ağ hatası görülmemiştir.
    *İzleme (2026-10-27 14:01):* Uyanıştan sonraki ilk captcha 13:43'te, 23:05'tekinden yaklaşık 14,5 saat sonra gelmiştir. Aralık 60
    dakikalık pencerenin dışında kaldığından yönetici kısa mola (374 sn) vermiş, motor 13:49'da tabandaki hızla (2/dk) sürmeye başlamıştır.
    Son bir saatte 62 karar inmiş olup devre kapalıdır ve 429 ile ağ hatası görülmemiştir.
    *İzleme (2026-10-27 15:01):* Sonraki captcha 14:21'de, 13:43'ten 38 dakika sonra gelmiştir. Aralık 60 dakikalık pencerenin içinde
    kaldığından yönetici uzun mola (2366 sn) vermiş, motor 15:00'te tabandaki hızla (2/dk) sürmeye başlamıştır. Mola son saatin yaklaşık
    39 dakikasını kapladığından bu sürede 31 karar inmiştir. Devre kapalı olup 429 ile ağ hatası görülmemiştir.
    *İzleme (2026-10-27 18:41):* 15:00'ten sonra captcha 15:30, 16:05 ve 17:31'de gelmiştir. 15:30'daki captcha 14:21'den 69 dakika sonra
    geldiğinden yönetici kısa mola (375 sn), 35 dakika sonra gelen 16:05'teki captcha üzerine uzun mola (2221 sn) vermiş, motor 16:42'de
    tabandaki hızla sürmüştür. 17:31'deki captcha 86 dakikalık aralıkla pencerenin dışında kaldığından mola yine kısa (352 sn) olmuştur.
    Kapak 17:49-18:29 arasında kapalı kaldığından makine modern beklemeye geçmiş, bu sürede karar inmemiş ve motor uyanışta kendiliğinden
    sürmüştür. Devre kapalı olup 429 ile ağ hatası görülmemiştir.
    *İzleme (2026-10-27 21:45):* Makine 18:48'de prizden çıkarılmış, kapak 18:49-21:39 arasında kapalı kaldığından motor 18:49:07'deki
    karardan sonra 21:39:13'e kadar karar indirmemiştir. 17:31'den sonra captcha gelmemiş olup motorun bu aralıkta etkin çalıştığı süre
    (17:37-17:49, 18:29-18:49 ve 21:39-21:45) yaklaşık 38 dakikadır. Uyanışta ağ hatası düşmemiş, devre kapalı kalmış ve 429 görülmemiştir.
    *İzleme (2026-10-27 23:30):* Kapak 22:08-22:55 arasında yine kapalı kalmış, makine 22:23:13'te «Austerity Battery Drain Budget Exceeded»
    nedeniyle aynı saniyede uyanıp beklemeye dönmüştür. Bu uyanışta düşen `network ENOTFOUND` ile 22:55'teki uyanışta kuyruğun başına
    dönen 13. Ceza Dairesi kararı 22:56'da inmiş olup ağ arızası sayılmamıştır. Sonraki captcha 23:24'te gelmiştir. Motor 17:31'den bu yana
    yaklaşık 90 dakika etkin çalışmış, duvar saatiyle aralık 353 dakika olduğundan yönetici kısa mola (301 sn) vermiştir. Son bir saatte 42 karar
    inmiş, devre kapalı kalmış ve 429 görülmemiştir. Tarama 2017 Aralık pencerelerine geçmiş olup durum ekranı 2018'i henüz «tamam» saymamaktadır.
    *İzleme (2026-10-28 09:10):* Kapak 27 Ekim 23:31'de kapanmış, motor 23:31:33'teki karardan sonra 28 Ekim 08:36'ya kadar karar
    indirmemiştir. 00:25'teki kısa uyanışta ve 08:35'te kapak açıldığında birer `network ENOTFOUND` düşmüş, kuyruğun başına dönen 4. Ceza
    Dairesi kararı 08:36'da indiğinden bunlar ağ arızası sayılmamıştır. Makine 08:38'de yeniden başlatılmış, motor `YargiHasatMotoru`
    görevinin oturum açılış tetiğiyle 08:43'te kendiliğinden yeniden başlamıştır (pid 6852). 23:24'ten sonra captcha gelmemiştir. Son bir
    saatte 28 karar inmiş, devre kapalı kalmış ve 429 görülmemiştir. Arşiv 138.511, kuyruk 797, kalıcı hata 163, yararlı karar 53.329'dur.
    Tarama 2017 Aralık pencerelerinde olup seçilen pencere sayısı 621/838'dir.
    *İzleme (2026-10-28 10:05):* Captcha 09:12'de gelmiş, 23:24'ten bu yana aralık uzun olduğundan yönetici kısa mola (310 sn) vermiştir.
    09:47'deki ikinci captcha 35 dakika sonra, yani 60 dakikalık pencerenin içinde geldiğinden yönetici uzun mola (2317 sn) ve 3 saatlik
    düşük tavan uygulamıştır. Mola 10:26 dolayında biter. Son bir saatte 59 karar inmiş, devre kapalı kalmış, 429 ve ağ hatası görülmemiştir.
    Arşiv 138.569, kuyruk 797, kalıcı hata 163, yararlı karar 53.373'tür. Tarama 2017 Kasım pencerelerine geçmiş olup seçilen pencere sayısı
    627/843'tür.
    *İzleme (2026-10-28 11:05):* Uzun mola 10:25:57'de bitmiş, ne var ki motorun ilk isteği yerel ağ kesintisi nedeniyle `network ENOTFOUND`
    almıştır. Vali 10:28-10:50 arasında «yerel internet bağlantısı yok» molası vermiş, kablosuz bağlantı 10:51'de yeniden kurulunca devre
    kapanmıştır. 09:47'den sonra captcha gelmemiş olup 3 saatlik düşük tavan 12:47 dolayında biter. Son bir saatte 15 karar inmiş, 429
    görülmemiştir. Arşiv 138.584, kuyruk 798, kalıcı hata 163, yararlı karar 53.382'dir. Seçilen pencere sayısı 628/845'tir.
    *İzleme (2026-10-28 14:20):* Kablosuz bağlantı 11:37:47'de sürücü tarafından kesilmiş, erişim noktası görünmediğinden yeniden bağlanma
    kurulamamış ve bağlantı ancak 12:35:40'ta dönmüştür. Motor 11:38-12:36 arasında «yerel internet bağlantısı yok» molası vermiş, devre
    12:36'da kapanmıştır. Kapak bu arada 12:08-12:34 arasında kapalı kalmıştır. Sonraki captcha 13:31'de, 09:47'den yaklaşık 224 dakika sonra
    geldiğinden yönetici kısa mola (421 sn) vermiştir. Kapak 13:32-14:16 arasında yeniden kapandığından motor bu sürede karar indirmemiş,
    uyanışta kendiliğinden sürmüştür. Son bir saatte 23 karar inmiş, 429 görülmemiştir. Arşiv 138.684, kuyruk 791, kalıcı hata 163, yararlı
    karar 53.431'dir. Tarama 2017 Ekim sonu pencerelerine geçmiş olup seçilen pencere sayısı 635/852'dir.
    *İzleme (2026-10-28 15:03):* Sonraki captcha 14:46'da, 13:31'den 75 dakika sonra gelmiş, yönetici 577 saniyelik mola ve 2 saatlik tavan
    vermiştir. Kapak 14:16'dan beri açık kalmış olup motor bu arada kesintisiz çalışmıştır. Tek ağ hatası 15:00:31'deki arama isteğinde
    görülen `UND_ERR_CONNECT_TIMEOUT` olup sonraki karar 12 saniye sonra indiğinden geçici sayılmıştır. Son bir saatte 53 karar inmiş, 429
    görülmemiştir. Arşiv 138.734, kuyruk 796, kalıcı hata 163, yararlı karar 53.455'tir. Seçilen pencere sayısı 639/855'tir.
    *İzleme (2026-10-28 18:36):* 14:46'dan sonra dört captcha daha gelmiştir. 15:27'deki captcha 41 dakika sonra, yani 60 dakikalık pencerenin
    içinde geldiğinden yönetici uzun mola (2007 sn) ve 3 saatlik düşük tavan vermiştir. 16:31'deki captcha kısa mola (550 sn) ile
    geçiştirilmiş, 17:09'daki captcha 38 dakika sonra geldiğinden ikinci uzun mola (2201 sn) ve yeni 3 saatlik tavan uygulanmıştır. 18:16'daki
    captcha yine kısa mola (341 sn) almıştır. Dört saatte beş captcha, 27-28 Ekim gecesindeki 35-41 dakikalık seyirle örtüşmekte olup düşük
    tavan 20:09 dolayında biter. Son bir saatte 69 karar inmiş, devre kapalı kalmış, 429 ve ağ hatası görülmemiştir. Arşiv 138.934, kuyruk
    801, kalıcı hata 163, yararlı karar 53.543'tür. Tarama 2017 Eylül başı pencerelerine geçmiş olup seçilen pencere sayısı 654/867'dir.
    *İzleme (2026-10-28 19:02):* 18:51'deki captcha 18:16'dakinden 35 dakika sonra, yani 60 dakikalık pencerenin içinde geldiğinden yönetici
    üçüncü uzun molayı (2293 sn) ve yeni 3 saatlik düşük tavanı vermiştir. Mola 19:30 dolayında, tavan 21:51 dolayında biter. Son bir saatte
    68 karar inmiş, devre kapalı kalmış, 429 ve ağ hatası görülmemiştir. Arşiv 138.959, kuyruk 802, kalıcı hata 163, yararlı karar
    53.545'tir. Tarama 2017 Temmuz başı pencerelerine geçmiş olup seçilen pencere sayısı 657/868'dir.
    *İzleme (2026-10-28 20:02):* 19:58'deki captcha 18:51'dekinden 67 dakika sonra, yani 60 dakikalık pencerenin dışında geldiğinden
    yönetici yalnız kısa mola (458 sn) ve 2 saatlik tavan vermiştir. Mola 20:07 dolayında biter, 18:51'de verilen 3 saatlik düşük tavan
    21:51 dolayında sürmektedir. Son bir saatte 48 karar inmiş olup sayının düşüklüğü 19:30'a kadar süren uzun moladan doğmaktadır. Devre
    kapalı kalmış, 429 ve ağ hatası görülmemiştir. Arşiv 139.007, kuyruk 798, kalıcı hata 163, yararlı karar 53.548'dir. Seçilen pencere
    sayısı 660/871'dir.
    *İzleme (2026-10-28 21:22):* 19:58'den sonra captcha gelmemiş olup 18:51'de verilen 3 saatlik düşük tavan 21:51, 19:58'de verilen 2
    saatlik tavan 21:58 dolayında biter. Kablosuz bağlantı 20:20-20:29 arasında kesilmiş, motor bu sürede «yerel internet bağlantısı yok»
    molası vermiş ve devre 20:29'da kapanmıştır. WLAN AutoConfig 20:47:59'da sınırlı bağlantı algılayıp kablosuz sürücüyü yeniden başlatmış,
    devre 20:50'de yeniden kapanmıştır. 20:57'deki tek `UND_ERR_CONNECT_TIMEOUT` bir dakika içinde aşılmıştır. Kapak 20:59-21:16 arasında
    kapalı kaldığından motor bu sürede karar indirmemiş, uyanışta kendiliğinden sürmüştür. Son bir saatte 47 karar inmiş, 429 görülmemiş, yedi
    ağ hatasının tamamı bu üç kesintiden doğmuştur. Arşiv 139.072, kuyruk 802, kalıcı hata 163, yararlı karar 53.553'tür. Tarama 2017 Haziran
    ortası pencerelerine geçmiş olup seçilen pencere sayısı 666/878'dir.
    *İzleme (2026-10-28 23:38):* 21:17'den sonra üç captcha gelmiştir. 21:48'deki captcha 19:58'dekinden 110 dakika sonra geldiğinden
    yönetici kısa mola (364 sn) ve 2 saatlik tavan vermiştir. 22:24'teki captcha 36 dakika sonra, yani 60 dakikalık pencere içinde geldiğinden
    uzun mola (2025 sn) ve 01:24 dolayında biten 3 saatlik düşük tavan verilmiştir. 23:28'deki captcha 64 dakika sonra geldiğinden
    yönetici yeniden kısa mola (396 sn) ve 01:28 dolayına kadar 2 saatlik tavan vermiştir. 21:17'den bu yana 138 karar inmiş, 429 ve ağ hatası
    görülmemiştir. Bu kararların 106'sı zayıf, yalnız 4'ü yararlı etiketi almıştır, zira 17:52'den beri inen kararların tamamı örnek
    kanalındandır. Kuyruk önce karar yılına, sonra kanal önceliğine göre sıralandığından (`harvester/daemon.mjs:315`) 2018 pencerelerinden
    kalan örnekler 2017'nin emsal işaretli kararlarından önce inmektedir. 23:36'daki `queue.jsonl` kaydında başta 20 adet 2018 örneği kalmış
    olup ardından 2 kurul, 554 emsal işaretli ve 234 örnek 2017 kararı gelmektedir. Verim düşüşü bu yüzden geçici sayılmış, sıralamaya
    dokunulmamıştır. Arşiv 139.207, kuyruk 799, kalıcı hata 163, yararlı karar 53.557'dir. Seçilen pencere sayısı 676/887 olup tarama 2017
    Mayıs ortasındadır.
    *İzleme (2026-10-29 12:16):* Makine 23:38:21'de uykuya geçip 11:57:40'ta uyanmış olup motor bu sürede karar indirmemiştir. Eski
    süreç uyanışta bulunmadığından servis görevi 11:57:58'de yeni süreç başlatmış (pid 29152), yönetici öğrenilmiş 2/dk tavanını geri
    yüklemiştir. 12:10'da `2018 tamamlandı` satırı düşmüş, ardından iki Ceza Daireleri Başkanlar Kurulu kararı ile hedefli kanaldan 2017
    kararları gelmeye başlamıştır. Uyanıştan 12:16'ya kadar inen 25 kararın 4'ü yararlı olup dördü de bu satırdan sonra inen iki kurul ve iki
    hedefli kanal kararıdır. 23:38'deki "verim düşüşü geçicidir" değerlendirmesi böylece doğrulanmıştır. Uyanıştan sonra captcha, 429 ve ağ hatası
    görülmemiştir. Arşiv 139.236, kuyruk 807, kalıcı hata 163, yararlı karar 53.561'dir. Seçilen pencere sayısı 679/888 olup tarama 2017
    Mayıs başındadır.
    *İzleme (2026-10-29 17:10):* 12:16'dan sonra dört captcha gelmiştir. 12:29'daki captcha arama adımında gelmiş olup yönetici kısa mola
    (328 sn) ve 2 saatlik tavan vermiştir. 13:04'teki captcha 35 dakika sonra, yani 60 dakikalık pencere içinde geldiğinden uzun mola
    (2417 sn) ve 3 saatlik düşük tavan verilmiştir. 14:14'teki captcha 70 dakika sonra geldiğinden kısa mola (490 sn), 14:51'deki captcha ise
    37 dakika sonra geldiğinden uzun mola (2547 sn) ve 17:51 dolayında biten 3 saatlik düşük tavan almıştır. Kapak 15:55-16:14 ve 16:15-17:03
    arasında kapalı kaldığından motor bu sürelerde karar indirmemiş, uyanışta aynı süreçle (pid 29152) sürmüştür. 12:16'dan bu yana inen 197
    kararın tamamı hedefli kanaldan gelmiş olup 110'u yararlı etiketi almıştır. 429 ve ağ hatası görülmemiştir. Tarama 2017 Mart'ın ikinci
    yarısına inmiş, 17:05'teki yenileme 16-31 Mayıs 2026 penceresinde karar sayısını 4.840'tan 5.682'ye çıkarmıştır. Arşiv 139.432, kuyruk 798,
    kalıcı hata 163, yararlı karar 53.670'tir. Seçilen pencere sayısı 694/903'tür.
    *İzleme (2026-10-29 22:05):* 17:10'dan sonra altı captcha gelmiş olup yönetici bunları yine çiftler hâlinde karşılamıştır. 17:33'teki
    captcha 162 dakika sonra geldiğinden kısa mola (449 sn) ve 2 saatlik tavan, 18:10'daki captcha 37 dakika sonra geldiğinden uzun mola
    (2154 sn) ve 3 saatlik düşük tavan almıştır. 19:16 (66 dakika sonra, 324 sn) ile 20:59'daki (67 dakika sonra, 538 sn) captchalar kısa
    mola, 19:52 (36 dakika sonra, 2183 sn) ile 21:40'taki (41 dakika sonra, 2023 sn) captchalar uzun mola almıştır. Son uzun mola 22:14'te,
    son düşük tavan 00:40 dolayında biter. Durum ekranı hızı, hedefi ve tavanı 2/dk olarak gösterdiğinden 18:10'da verilen düşük tavan
    sürerken gelen üç captcha, düşük tavanın bu tabanda captcha aralığını uzatmadığına işaret etmektedir. Kapak 17:03'ten bu yana kapanmamış
    (Kernel-Power 506 kaydı yoktur), motor aynı süreçle (pid 29152) çalışmıştır. 17:06-21:40 arasında inen 233 kararın tamamı hedefli kanaldan
    gelmiş olup 91'i yararlı etiketi almıştır. 429 ve ağ hatası görülmemiştir. 17:06-17:21 arasındaki yenileme turunda 2026'nın dokuz
    penceresi büyümüş, en büyük artış 8-15 Mayıs 2026 penceresinde 6.524'ten 7.724'e olmuştur. 20:38-21:12 arasında yoklanan Aralık ve Kasım
    2025 pencereleri değişmemiştir. Tarama 2017 Şubat başına inmiştir. Arşiv 139.665, kuyruk 796, kalıcı hata 163, yararlı karar 53.761'dir.
    Seçilen pencere sayısı 716/922'dir.
    *İzleme (2026-10-30 11:05):* 22:05'ten sonra captcha gelmemiş, makine 22:19:27'de uykuya geçip 10:00:03'te uyanmıştır. Motor bu sürede
    karar indirmemiş, eski süreç uyanışta bulunmadığından servis görevi 10:00:20'de yeni süreç başlatmıştır (pid 24808). Uyanıştan sonraki
    ilk captcha 10:30'da, 21:40'takinden yaklaşık 13 saat sonra geldiğinden yönetici kısa mola (346 sn) ve 2 saatlik tavan vermiştir. 10:00'daki
    yenileme 23-30 Nisan 2026 penceresinde karar sayısını 7.051'den 7.703'e çıkarmıştır. Uyanıştan 11:04'e kadar inen 82 kararın tamamı
    hedefli kanaldan gelmiş olup 22'si yararlı etiketi almıştır. Devre kapalı kalmış, 429 ve ağ hatası görülmemiştir. Tarama 2017 Ocak'ın
    ikinci yarısına inmiştir. Arşiv 139.751, kuyruk 800, kalıcı hata 163, yararlı karar 53.784'tür. Seçilen pencere sayısı 724/930'dur.
    *İzleme (2026-10-30 12:03):* İkinci captcha 11:06:23'te, 10:30'daki kısa moladan 36 dakika sonra ve 2 saatlik tavan sürerken gelmiş
    olup yönetici bunu tekrar sayarak 2.337 sn'lik uzun mola ile 3 saatlik düşük tavan vermiştir. Mola 11:45'te bitmiş, düşük tavan 14:06
    dolayında sona ermektedir. 11:04-12:02 arasında inen 27 kararın tamamı hedefli kanaldan gelmiş olup 13'ü yararlı etiketi almıştır. Devre
    kapalı kalmış, 429 ve ağ hatası görülmemiştir. Arşiv 139.779, kuyruk 803, kalıcı hata 163, yararlı karar 53.799'dur. Seçilen pencere
    sayısı 727/934'tür.
