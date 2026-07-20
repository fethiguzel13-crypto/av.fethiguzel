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
| Kategori | Kitaplar ve referans / Verimlilik |
| İçerik | 16+ (hukuki içerik; çocuklara özel değil) |
| Gizlilik politikası | `https://avfethiguzel.com/gizlilik` (aşağıda sayfa eklenecek) |

## 3) AAB dosyası

### A) GitHub Actions (önerilen)

1. Repo’da **Actions → Build Android AAB → Run workflow**  
2. Bitince **Artifacts → app-release** indirin  
3. `app-release.aab` dosyasını Play Console → **Production** (veya dahili test) → **Yeni sürüm** ile yükleyin

### B) Yerel derleme

Android Studio + JDK 17 + SDK gerekir. `README.md` içindeki komutlara bakın.

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

- Veri toplama: sitedeki analitik/iletişim formlarına bağlıdır  
- Gizlilik URL’si zorunludur → sitede `/gizlilik` sayfası

## 6) İmza (signing)

CI veya siz bir yükleme anahtarı üretirsiniz. **keystore dosyasını asla public repoya koymayın.**

```bash
keytool -genkey -v -keystore fethiguzel-upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias fethiguzel
```

Play App Signing önerilir (Google’ın imza yönetmesi).

## 7) Yayın

1. Dahili test → kapalı test → üretim  
2. Ülkeler: Türkiye (+ isteğe bağlı)  
3. İnceleme 1–7 gün sürebilir  

## Destek iletişimi

Play Console’da e-posta ve web sitesi:

- Site: https://avfethiguzel.com  
- E-posta: (kendi iletişim e-postanız)
