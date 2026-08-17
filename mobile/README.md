# Hukuk Galaxy — dört Android uygulaması

Tek kaynak ağacından dört ayrı Play uygulaması. Hepsi **çevrimdışı çalışır**;
hiçbiri uzak bir siteyi WebView'da açmaz.

| Uygulama | Paket | İçerik | Ağ gerekir mi |
|----------|-------|--------|----------------|
| **Mevzuat** | `com.avfethiguzel.hukuk` | 46 kanun · 8.087 madde · 95 şerh | Hayır |
| **Hukuki Hesap** | `com.avfethiguzel.hesap` | 33 hesaplama aracı | Hayır |
| **İçtihat Günü** | `com.avfethiguzel.icthat` | Günlük özet + 3.818 kararlık arşiv | Tazeleme için |
| **Vatandaş Hukuku** | `com.avfethiguzel.rehber` | 67 denetimden geçmiş rehber | Hayır |

## Mimari

```
mobile/
  app-src/          Vite + React kaynak — dört uygulamanın ortak kabuğu
    src/apps/       uygulama kökleri (PortalApp, HesapApp, IcthatApp, RehberApp)
    src/shell/      ortak kabuk (AppShell, BottomNav, Settings, More)
    src/lib/        router, storage, packs, notify, deeplink
    src/shims/      next/link · next/image · Navbar · Footer karşılıkları
  data-src/         ham varlıklar (packs, icthat, rehber) — uygulamaya göre seçilir
  flavors/<id>/     üretilmiş: capacitor.config.json · meta.json · www/
  android/          tek Capacitor modülü; kimlik app/flavor.properties'ten gelir
  assets/icons/     uygulama başına simge, splash, öne çıkan grafik
  store-listing/    uygulama başına mağaza metinleri
```

Portal bileşenleri **yeniden yazılmaz, doğrudan kullanılır**: 33 hesaplama
aracının 3.700 satırlık matematiği `components/hesaplama/HesaplamaTools.tsx`
dosyasından olduğu gibi içe aktarılır. Next.js'e özgü üç modül
(`next/link`, `Navbar`, `Footer`) `app-src/src/shims/` altındaki mobil
karşılıklarıyla değiştirilir.

## Kurulum ve derleme

```bash
cd mobile
npm install

npm run build              # dördünün arayüzünü derle
npm run icons              # uygulama başına simge üret
npm run flavor:hesap       # hesap flavor'ını etkinleştir (Android kimliği + simgeler)
npm run sync               # npx cap sync android
npm run verify             # yayın kapısı
```

Tek uygulama: `npm run build:hesap`

## AAB üretimi

Yerel derleme **JDK 21 + Android SDK** ister:

```bash
npm run aab -- --app=hesap     # tek uygulama
npm run aab -- --app=all       # dördü birden → mobile/dist/
```

Bunlar yoksa GitHub Actions kullanın: **Actions → Build Android AAB →
Run workflow**. İş akışı dört uygulamayı matris olarak üretir, her birinde
`verify-release` kapısından geçirir ve `aab-<id>` adıyla artefakt bırakır.

## Yayın kapısı

`npm run verify:all` yüklemeden önce mekanik olarak doğrulanabilecek her şeyi
denetler. Bu projede yaşanmış somut hatalara karşı yazıldı:

- dört flavor tanımlıydı ama gradle hep aynı `applicationId`'yi üretiyordu
- `styles.xml` tanımsız renk çağırıyordu; proje hiç derlenmemişti
- `server.url` yüzünden uygulama saf WebView sarmalayıcıydı
- `assetlinks.json` yer tutucu parmak izi taşıyordu
- dört uygulamanın simgesi bayt bayt aynıydı

Kapı, `gradle bundleRelease`'ten **önce** çalışır; on dakikalık derlemeyi
baştan harcamamak için.

## İçerik kalitesi

Uygulamalara giren her metin `lib/content-quality.mjs` denetiminden geçer.
14.08.2026 denetiminde sitedeki şerhlerin %98,8'inin kalıptan üretildiği ve
büyük kısmının başka bir kanuna (çek) ait olduğu ölçüldü. Uygulamalar bu
metinleri **taşımaz**:

- Mevzuat: 8.087 maddenin resmî metni + denetimden geçen 95 şerh
- Vatandaş Hukuku: 554 rehberin denetimden geçen 67'si

Şerh ve rehber yeniden yazıldıkça denetimden kendiliğinden geçer ve bir
sonraki sürüme girer; güncellenecek bir liste yoktur.

Ayrıntı: [`docs/PLAY-STORE.md`](./docs/PLAY-STORE.md)

## İmza

```powershell
# mobile/scripts/create-upload-keystore.ps1
keytool -genkeypair -v -keystore upload.jks -keyalg RSA -keysize 2048 `
  -validity 10000 -alias fethiguzel `
  -dname "CN=Av Fethi Guzel, O=AvFethiGuzel, L=Ercis, ST=Van, C=TR"
```

`android/keystore.properties` (git'e girmez):

```
storeFile=../upload.jks
storePassword=…
keyAlias=fethiguzel
keyPassword=…
```

CI için aynı dosya `ANDROID_KEYSTORE_BASE64` gizli anahtarından üretilir.

**Dört uygulama aynı yükleme anahtarını paylaşabilir.** Play App Signing açık
olduğunda Google her uygulama için ayrı bir imzalama anahtarı üretir;
`assetlinks.json` parmak izleri oradan alınır.
