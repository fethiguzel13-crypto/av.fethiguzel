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
    19:57, 20:35, 21:09 ve 21:44'te olmak üzere sekiz kez gelmiş olup 17:59'dan sonraki aralıklar 39, 42, 37, 37, 34 ve 35 dakikadır. Aralıklar 30 dakikalık
    pencereye yaklaşmakla birlikte hep üstünde kaldığından uzun mola hiç devreye girmemiş, motor her kısa moladan sonra tabandaki hızla sürmüştür. Günlük sayı 11-19 Ekim
    arasında 1 ile 2 arasında kalmıştır. Devre kapalıdır, 429 ve ağ hatası görülmemiştir.
    *Varsayım:* başsız oturumlar yönetici ayarına ve motora dokunmaz, konu 26 Ekim pazartesi günkü G08 bakımında ele alınır. İki seçenek
    vardır: tabanı dakikada 1'e indirmek ya da `captcha.windowMs`'i 60 dakikaya çıkarıp uzun molayı devreye sokmak. İkisi de ayar
    değişikliği ve `hasat-servis.ps1` ile motorun yeniden başlatılmasını gerektirir.
