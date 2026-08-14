# Hukuk Galaxy — mobil çoklu uygulama

## Kilit kararlar

| | |
|--|--|
| Model | Galaxy (4 uygulama, ortak içerik beyni) |
| Dil sırası | TR → **EN** → DE → FR → AR |
| Aktif UI dilleri | TR + EN (DE/FR/AR katalog + locale dosyası hazır) |
| Play | Şimdilik APK; hesap sonra |

## Uygulamalar (dalga 1)

| id | package | path |
|----|---------|------|
| portal | com.avfethiguzel.hukuk | / |
| hesap | com.avfethiguzel.hesap | /hesaplama |
| icthat | com.avfethiguzel.icthat | /icthat |
| rehber | com.avfethiguzel.rehber | /bilgi |

## Flavor üret

```bash
cd mobile
node scripts/build-flavor.mjs --app=all --lang=tr
node scripts/build-flavor.mjs --app=hesap --lang=en
npx cap sync android
```

Çıktı: `flavors/<id>/` (www, capacitor.config.json, android-app.gradle, meta.json)

## Portal tarafı

- `lib/galaxy/*` — katalog, i18n, hook
- `locales/*.json` — UI dizgileri
- `GalaxyChrome` — dil seçici (TR/EN)
- `GalaxySisterApps` — uygulamalar arası geçiş
- `?app=hesap&lang=en` query ile mod
