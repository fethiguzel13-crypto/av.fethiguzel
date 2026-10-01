# G05 — Mobil uygulama güvenliği (2026-10-01)

Denetlenen: Android projesi (`mobile/android`, manifest, ağ/yedekleme/FileProvider yapılandırması, Gradle, R8),
Capacitor yapılandırması (kök + 5 flavor), uygulama kaynağında üyelik, ödeme, kasa, derin bağlantı ve dış
bağlantı modülleri, izlenen dosyalarda sır taraması, mobil bağımlılıklar. Alt plan: `gorevler/G05.md`.

Yeni test takımı `mobile/scripts/__tests__/guvenlik.test.mjs` (16 test; kalite kapısında `test:mobil`).
Düzeltilen iki bulgu önce kırmızı testle sabitlendi; geri kalan testler bugün sağlanan değişmezleri
kilitler, böylece ileride bir flavor üretimi ya da Capacitor güncellemesi onları sessizce bozamaz.

## Bulgular ve durum

| # | Bulgu | Önem | Durum |
|---|---|---|---|
| M1 | Mağaza inceleme kodu kaynakta düz metindi; depo herkese açık | Orta | Düzeltildi (yayın günü Play metni güncellenecek) |
| M2 | FileProvider tüm ortak depolamayı kapsıyordu | Düşük | Düzeltildi |
| M3 | Abonelik doğrulaması tamamen cihazda | Bilgi (mimari) | Kullanıcı kararı (soru 7) |
| M4 | Yedekleme kuralları Android sürümüne göre farklı | Düşük (işlev) | Kullanıcı kararı (soru 8) |
| M5 | Sürüm derlemesinde Android lint kapalı | Bilgi | G21'e not |

### M1 — Mağaza inceleme kodu herkese açıktı (orta)

Ayarlar ekranındaki inceleme kodu, Google Play incelemecisinin ücretli bölümü görebilmesi için üyeliği
30 gün açar. Kod `app-src/src/lib/uyelik.ts` içinde düz metin olarak yazılıydı ve aynı değer duman testinde
de geçiyordu. GitHub deposu herkese açık olduğundan (API isteği kimlik doğrulamasız 200 döndü) ve kod
`origin/main`'de bulunduğundan, kaynağı okuyan herkes Yargıtay arşivinin tam metnini ödeme yapmadan
açabiliyordu. Önceki gerekçe, içeriğin zaten pakette şifreli olarak bulunduğu ve anahtarın da pakette
taşındığı yönündeydi. Bu gerekçe tersine mühendisliği kapsar; ancak herkese açık bir dosyayı okumak tersine
mühendislik sayılmaz ve bu yol en düşük eşiği oluşturuyordu.

Düzeltme:

- `app-src/src/lib/inceleme.mjs`: tuzlu SHA-256 özeti, doğrulama ve 80 bit rastgelelikli kod üretimi
  (`FG-XXXX-XXXX-XXXX-XXXX`, karışan harfler çıkarılmış alfabe). Özet tanımsızsa özellik kapalıdır.
- `uyelik.ts` artık kodu değil, derlemenin gömdüğü `__INCELEME_OZET__` değerini karşılaştırır.
- `build-app.mjs` kodu `INCELEME_KODU` ortam değişkeninden (CI) ya da git dışı
  `mobile/inceleme-kodu.local.txt` dosyasından okur; Vite'a yalnız özeti geçirir.
- `scripts/inceleme-kodu.mjs` yeni kod üretir; kod ekrana ve loga basılmaz. Bu oturumda yeni kod üretildi
  ve yalnız yerel dosyaya yazıldı.
- `smoke-ui.mjs` kodu aynı yerden okur; kod tanımsızsa adım başarısız olur, böylece inceleme kodu
  kapalı bir sürümün mağazaya gitmesi önlenir.
- Test: eski kodun izlenen hiçbir mobil dosyada kalmadığı ve yerel kodun ne izlenen dosyalara ne de
  derlenmiş JavaScript paketine sızdığı denetlenir.

Kalan sınır: Paketi açıp değiştiren biri denetimi atlayabilir. Kasa anahtarı da pakette olduğundan bu,
`mobile/docs/UYELIK.md` içindeki «Dürüst sınır» bölümüyle aynı bilinçli kabuldür. Mağazada yayımlanmış
sürümler eski kodu, kullanıcı güncelleme alana kadar kabul etmeye devam eder. Eski kod git geçmişinde de durur;
yeni sürümden itibaren geçersizdir.

Yan gözlem (işlev): Elle açılan erişim, Play'e ulaşılabildiği ilk denetimde (yeniden açılış ya da 6 saatlik
öne gelme tazelemesi) Play "abone değil" dediği için kapanır. Kod bu nedenle yalnız açık oturum boyunca
çalışır. Bu durum kötüye kullanımı sınırlar; ancak incelemeci uygulamayı yeniden başlatırsa kodu tekrar
girmesi gerekir. Play inceleme metninde bu belirtilmelidir (soru 9).

### M2 — FileProvider kapsamı (düşük)

`file_paths.xml`, Capacitor şablonundan gelen `<external-path path=".">` satırını taşıyordu. Bu satır,
FileProvider'ın paylaşabileceği alanı cihazın tüm ortak depolamasına genişletir. Sağlayıcı dışa kapalı olduğu
için doğrudan sömürülemez; uygulama bir URI izni verdiği anda ise kapsam fazla geniş kalır. Uygulama dosya
paylaşmıyor (`Share` yalnız metin ve adres gönderiyor). Capacitor'ın kendisinin kullandığı tek yol, dosya
seçicinin kamera geçici dosyasıdır (`getExternalFilesDir(Pictures)`, `BridgeWebChromeClient.createImageFile`).
Kapsam `<external-files-path path="Pictures/">` ile uygulamanın kendi klasörüne indirildi.

Doğrulama sınırı: Android derlemesi bu oturumda çalıştırılmadı (Gradle derlemesi G21'de). Değişiklik
yalnız FileProvider'ın çalışma anında okuduğu XML'e dokunur ve uygulama dosya seçici kullanmaz.

### M3 — Abonelik doğrulaması cihazda (bilgi, mimari)

`odeme.ts`, Play'in onayladığı işlemi sunucuda doğrulamadan cihazda `finish()` ile tamamlıyor. Üyelik
durumu `CapacitorStorage.xml` içinde tutuluyor ve ağ yoksa 14 gün geçerli sayılıyor. Kök erişimli bir
cihazda sahte Play yanıtı üreten araçlarla abonelik taklit edilebilir. Sunucu doğrulaması
(Google Play Developer API, `purchases.subscriptionsv2.get`) bir Google Cloud hizmet hesabı ve yeni bir
sunucu ucu gerektirir. Ne var ki tam metinler ve çözme anahtarı cihazda olduğu sürece sunucu doğrulaması
yalnız satın alma taklidini kapatır; kasayı çözen birini durdurmaz. Öneri, ödeme sahteciliği gözlenmedikçe
mimarinin korunmasıdır. Karar kullanıcıya bırakıldı (soru 7).

### M4 — Yedekleme kuralları tutarsız (düşük, işlev)

Android 11 ve öncesi için `backup_rules.xml`, `CapacitorStorage.xml` dosyasını yedekten dışlıyor. Android 12+
için `data_extraction_rules.xml` ise aynı dosyayı yedeğe dahil ediyor. Bu dosyada favoriler, notlar ve üyelik
kaydı birlikte duruyor. Dosyanın yorumu favori ve notların yedeklendiğini söylüyor; Android 7–11 kullanıcıları
cihaz değiştirdiğinde bunları kaybediyor. Üyelik kaydının yedeğe girmesi güvenlik açığı oluşturmaz: Yedek aynı
Google hesabına döner ve kayıt açılışta Play'e yeniden sorulur. Yedeğe giren veriyi genişletmek kullanıcı
verisinin buluta gitmesi anlamına geldiğinden değişiklik onaysız yapılmadı (soru 8). WebView çerezleri ve
oturum verisi her iki kural dosyasında da dışlanmış; bunu test kilitler.

### M5 — Sürüm derlemesinde lint kapalı (bilgi)

`app/build.gradle` içinde `lint { abortOnError false; checkReleaseBuilds false }` bulunuyor. Android lint'in
güvenlik denetimleri (ör. dışa açık bileşen, güvensiz WebView ayarı) sürüm derlemesinde çalışmıyor. Bu
oturumda doğrulanabilir bir Gradle derlemesi yapılmadığı için değiştirilmedi; G21'de derlemeyle birlikte
`checkReleaseBuilds true` denenecek.

## Sorun olmayanlar (test kilitli)

- `usesCleartextTraffic="false"`; ağ yapılandırması düz metni yasaklıyor, yalnız sistem sertifikalarına
  güveniyor, `debug-overrides` yok.
- Manifestte `debuggable` yok; tüm Capacitor yapılandırmalarında `webContentsDebuggingEnabled: false`,
  `allowMixedContent: false`, `server.url` yok; `allowNavigation` yalnız `avfethiguzel.com`,
  `*.avfethiguzel.com`, `play.google.com`.
- Dışa açık tek bileşen başlatıcı etkinlik; FileProvider `exported="false"`. İzinler: INTERNET,
  ACCESS_NETWORK_STATE, POST_NOTIFICATIONS, RECEIVE_BOOT_COMPLETED.
- Derin bağlantılar (`appUrlOpen`) yalnız hash yönlendiricisinde yol değiştirir; WebView'ı başka kökene
  götürmez. Yabancı alan adlı https bağlantısı `null` döner.
- Sürümde R8 küçültme açık, Vite kaynak haritası üretmiyor; ekran koruması (`FLAG_SECURE`) yalnız karar
  okuma ekranında.
- Sırlar: `*.jks`, `keystore.properties`, `keystore-password-SIL-SONRA.txt`,
  `keystore-base64-github-secret.txt`, `kasa-anahtar.json` ve yeni `inceleme-kodu.local.txt` izlenmiyor
  ve `.gitignore` kapsamında. İzlenen mobil dosyalarda özel anahtar, AWS, Google API, OpenAI/Anthropic,
  GitHub ya da Slack belirteci deseni yok.
- Mobil `npm audit --omit=dev`: 0 açık.

## Doğrulama

- `npm test --prefix mobile`: 52/52 (16'sı yeni). `npm run kalite:hizli`: 526 test, kapı geçti.
- `node scripts/build-app.mjs --app=asistan --sadece-arayuz` derlendi. Derlenmiş JavaScript'te özet bir
  dosyada bulunuyor, ne yeni kod ne eski kod geçiyor.
- `node mobile/scripts/smoke-ui.mjs`: "inceleme kodu ücretli bölümü açıyor" adımı yeni kodla geçti; kod
  özetle doğrulanıp şifreli kasa açıldı. Aynı koşuda iki adım kırmızı kaldı ve G05 ile ilgisizdir: arşiv
  satırlarında konu başlığı yok, arama tuş başına ~430 ms. Neden, `data-src/icthat/archive.json.gz`
  dosyasının (70.249 karar, 2026-09-11) konu zenginleştirmesi olmadan üretilmiş olmasıdır. Not G14'e
  eklendi. Tarayıcıdaki CORS hatası canlı sitenin 402 dönmesinden kaynaklanıyor (G00).
- Derlemenin sahneleme adımının değiştirdiği izlenen beş veri dosyası (`app-src/public/…`) geri alındı.

## Kullanıcı eylemleri

- **Yayın günü (G26):** Play Console → Uygulama içeriği → Uygulama erişimi talimatındaki kod,
  `mobile/inceleme-kodu.local.txt` dosyasındaki yeni kodla değiştirilmelidir. CI ile derleniyorsa aynı
  kod `INCELEME_KODU` gizli değişkenine konmalıdır.
- Soru 3 (anahtar deposu şifresinin düz metin dosyada durması) geçerliliğini koruyor.
