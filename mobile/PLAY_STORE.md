# Google Play Store — Yükleme Rehberi

Bu uygulama hazır AAB ile Play Console’a yüklenir. **Play Console hesabı ve tek seferlik $25 kayıt ücreti sizin adınıza olmalıdır.**

## 1) Google Play Console

1. https://play.google.com/console adresine gidin  
2. Geliştirici hesabı açın (kimlik doğrulama + ücret)  
3. **Uygulama oluştur**  
   - Ad: `Av. Fethi Güzel`  
   - Varsayılan dil: Türkçe (Türkiye)  
   - Uygulama / oyun: **Uygulama**  
   - Ücretsiz / ücretli: **Ücretsiz**

## 2) Paket bilgileri

| Alan | Değer |
|------|--------|
| Paket adı | `com.avfethiguzel.hukuk` |
| Uygulama adı | Av. Fethi Güzel |
| Sürüm | 1.2.0 (`versionCode` 3) |
| Kategori | Kitaplar ve referans / Verimlilik |
| İçerik | 16+ (hukuki içerik; çocuklara özel değil) |
| Gizlilik politikası | `https://www.avfethiguzel.com/gizlilik` (**hazır**) |

## 3) AAB dosyası

### A) GitHub Actions (önerilen)

1. Repo secrets (bir kez):  
   - `ANDROID_KEYSTORE_BASE64`  
   - `ANDROID_KEYSTORE_PASSWORD`  
   - `ANDROID_KEY_ALIAS` (= `fethiguzel`)  
   - `ANDROID_KEY_PASSWORD`  
2. **Actions → Build Android AAB → Run workflow**  
3. Bitince **Artifacts → fethiguzel-android** indirin  
4. `app-release.aab` dosyasını Play Console → **Production** (veya dahili test) → **Yeni sürüm** ile yükleyin

### B) Yerel derleme

Android Studio + **JDK 17** + SDK gerekir. `README.md` içindeki komutlara bakın.

## 4) Mağaza girişi (metinler hazır)

### Kısa açıklama (80 karakter)

```
7800+ kanun maddesi, akademik şerh, içtihat ve hukuki hesaplama.
```

### Tam açıklama

```
Av. Fethi Güzel Hukuk Portalı — cep telefonunuzda.

• 7800+ kanun maddesi ve akademik şerhler
• TBK, TMK, TTK, TCK, HMK, İİK ve 40+ kanun
• Mevzuat arama
• Günlük içtihat takibi
• Kıdem, faiz, harç ve diğer hukuki hesaplama araçları
• Van · Erciş avukat ve arabulucu

İçerik çevrimiçi sunulur; uygulama her zaman sitedeki güncel metne bağlanır.

Yasal uyarı: Bu uygulama bilgilendirme amaçlıdır; resmi tavsiye veya vekâlet yerine geçmez.
```

### Grafikler

`assets/` klasörü:

- `play-icon-1024.png` — uygulama simgesi (512+ gerekir; 1024 önerilir)
- `play-feature-graphic.png` — özellik grafiği 1024×500

Ekran görüntüleri: telefondan siteden 2–8 adet PNG (telefon boyutu).

## 5) Gizlilik ve veri güvenliği

Uygulama WebView ile siteyi açar. Formlar sitede işlenir.

- Gizlilik URL: https://www.avfethiguzel.com/gizlilik  
- Veri toplama: sitedeki analitik/iletişim formlarına bağlıdır  

## 6) İmza (signing)

```bash
keytool -genkey -v -keystore fethiguzel-upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias fethiguzel
```

PowerShell: `mobile/scripts/create-upload-keystore.ps1`

Play App Signing önerilir (Google’ın imza yönetmesi).

### App Links (assetlinks.json)

`public/.well-known/assetlinks.json` içinde `REPLACE_WITH_UPLOAD_OR_APP_SIGNING_SHA256` yerine gerçek parmak izi olmalı:

```powershell
keytool -list -v -keystore fethiguzel-upload.jks -alias fethiguzel
# SHA256 satırını kopyalayın (iki nokta olmadan veya Play Console formatında)
```

Play App Signing açıksa Console → App signing → **App signing key certificate** SHA-256 kullanılır.

## 7) Yayın

1. Dahili test → kapalı test → üretim  
2. Ülkeler: Türkiye (+ isteğe bağlı)  
3. İnceleme 1–7 gün sürebilir  

## Destek iletişimi

Play Console’da e-posta ve web sitesi:

- Site: https://www.avfethiguzel.com  
- E-posta: fethiguzel@hotmail.com  
