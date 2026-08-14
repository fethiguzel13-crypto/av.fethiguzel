# Av. Fethi Güzel — Android Uygulaması

Play Store için Capacitor tabanlı uygulama. İçerik **https://www.avfethiguzel.com** üzerinden yüklenir (güncel mevzuat / şerh / hesaplama).

## Sürüm

| Alan | Değer |
|------|--------|
| Uygulama adı | Av. Fethi Güzel |
| Paket adı | `com.avfethiguzel.hukuk` |
| Sürüm | **1.2.0** (`versionCode` 3) |
| Site | https://www.avfethiguzel.com |

## 1.2 yenilikleri

- Native paylaşım (Share eklentisi + Web Share yedek)
- Harici bağlantılar sistem tarayıcısında (Browser eklentisi)
- Deep link dinleyicisi: uygulama açıkken `https://…` / `avfethiguzel://…`
- Uygulama içinde Play Store “indir” CTA gizlenir
- Release imza: `android/keystore.properties` (CI uyumlu)

## 1.1 yenilikleri

- Mobil alt menü (Ana · Ara · Rehber · Hesap · Güncel)
- Android geri tuşu: geçmiş / ana sayfa / çıkış
- Çevrimdışı uyarı şeridi
- Deep link intent filtreleri
- Güçlendirilmiş çevrimdışı kabuk (yeniden dene + kısayollar)
- Safe-area (çentik / alt bar)
- Network / Browser / Share eklentileri

## Yerel kurulum

```bash
cd mobile
npm install
npm run icons          # isteğe bağlı
npm run cap:sync
npx cap open android
```

Release AAB (Windows, JDK 17 + keystore gerekir):

```bash
npm run build:android
```

Çıktı: `android/app/build/outputs/bundle/release/app-release.aab`

## İmza (keystore)

```powershell
# mobile/scripts/create-upload-keystore.ps1
# veya:
keytool -genkeypair -v -keystore fethiguzel-upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias fethiguzel -dname "CN=Av Fethi Guzel, O=AvFethiGuzel, L=Ercis, ST=Van, C=TR"
```

`android/keystore.properties` örneği (git’e eklenmez):

```
storeFile=../upload.jks
storePassword=...
keyAlias=fethiguzel
keyPassword=...
```

App Links için `public/.well-known/assetlinks.json` içindeki SHA-256 parmak izini yükleme / Play App Signing sertifikasıyla değiştirin.

## Play Store

Ayrıntılı adımlar: [PLAY_STORE.md](./PLAY_STORE.md)

## Mimari not

Uygulama bir WebView sarmalayıcıdır; portal Next.js sitesidir. UI iyileştirmeleri (`MobileBottomNav`, `AppNativeChrome`, `shareContent`) sitede yaşar — `cap sync` sonrası AAB ile mağazaya gider, içerik ise anında siteden güncellenir.
