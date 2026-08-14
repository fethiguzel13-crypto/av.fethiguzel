# Av. Fethi Güzel — Android Uygulaması

Play Store için Capacitor tabanlı uygulama. İçerik **https://www.avfethiguzel.com** üzerinden yüklenir (güncel mevzuat / şerh / hesaplama).

## Sürüm

| Alan | Değer |
|------|--------|
| Uygulama adı | Av. Fethi Güzel |
| Paket adı | `com.avfethiguzel.hukuk` |
| Sürüm | **1.1.0** (`versionCode` 2) |
| Site | https://www.avfethiguzel.com |

## 1.1 yenilikleri

- Mobil alt menü (Ana · Ara · Rehber · Hesap · Güncel)
- Android geri tuşu: geçmiş / ana sayfa / çıkış
- Çevrimdışı uyarı şeridi
- Deep link: `https://www.avfethiguzel.com/...` ve `avfethiguzel://`
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

Release AAB (Windows):

```bash
npm run build:android
```

Çıktı: `android/app/build/outputs/bundle/release/app-release.aab`

## Play Store

Ayrıntılı adımlar: [PLAY_STORE.md](./PLAY_STORE.md)

## Mimari not

Uygulama bir WebView sarmalayıcıdır; portal Next.js sitesidir. UI iyileştirmeleri (`MobileBottomNav`, `AppNativeChrome`) sitede yaşar — `cap sync` sonrası AAB ile mağazaya gider, içerik ise anında siteden güncellenir.
