# Av. Fethi Güzel — Android Uygulaması

Play Store için Capacitor tabanlı uygulama. İçerik her zaman **https://avfethiguzel.com** üzerinden yüklenir (güncel mevzuat / şerh / hesaplama).

## Kimlik

| Alan | Değer |
|------|--------|
| Uygulama adı | Av. Fethi Güzel |
| Paket adı | `com.avfethiguzel.hukuk` |
| Site | https://avfethiguzel.com |

## Yerel kurulum

```bash
cd fethiguzel-app
npm install
npm run icons
npm run build:web
npx cap add android
npx cap sync android
```

Android Studio ile açma:

```bash
npx cap open android
```

Release AAB (imza gerekir):

```bash
cd android
./gradlew bundleRelease
```

Çıktı: `android/app/build/outputs/bundle/release/app-release.aab`

## Play Store

Ayrıntılı adımlar: [PLAY_STORE.md](./PLAY_STORE.md)

## GitHub Actions

`main` dalına push sonrası (veya workflow_dispatch) AAB artifact olarak üretilir.
