# G21 — Mobil uygulama cilası

**Tarih:** 2026-10-12 / 2026-10-13 · **Alt plan:** `gorevler/G21.md` · **Commit'ler:** `67e22aacf`, `458b503cc`, `6ea7e66df`

Kapsam yayındaki `asistan` uygulamasıdır (`com.avfethiguzel.hesap`). Mağaza yüklemesi ve imzalı derleme yapılmamıştır, yalnız
hata ayıklama APK'sı derlenmiştir.

## Tasarım denetimi, önce ve sonra

Ölçüm `mobile/scripts/design-audit.mjs` ile 412×915 görünümde, hesaplanmış stil değerleri üzerinden yapılmıştır. Önce ölçümü
mevcut altı kuralın dördüyle 19 ekranda 0 bulgu vermiştir. Gözle görülen başlık sorunu bu kurallara yakalanmadığından denetime iki
kural eklenmiş (karar `mobile/scripts/lib/tasarim-olcut.mjs`, 4 test, önce kırmızı) ve listeye `/takip` ekranı alınmıştır.

| Kural | Önce (eski derleme, yeni kurallarla) | Sonra (20 ekran) |
|---|---:|---:|
| Kontrast altı metin | 0 | 0 |
| 24 px altı dokunma hedefi | 0 | 0 |
| 12 px altı punto | 0 | 0 |
| Yatay taşma | 0 | 0 |
| 20 px altı metinde -0,01em'den sıkı harf aralığı | 5 (beş sekme kökünde üst çubuk başlığı) | 0 |
| Anahtar rayında 3:1 altı metin dışı kontrast (WCAG 1.4.11) | 1 (Takip, kapalı ray 1,46:1, 48×28) | 0 |

Ham çıktılar `tasarim-denetim-g21-once.txt` ve `tasarim-denetim-g21-sonra.txt` dosyalarındadır, görüntüler
`gorsel/g21-mobil-baslik-{once,sonra}.png` ve `gorsel/g21-mobil-takip-{once,sonra}.png` altındadır.

## Yapılanlar

- **Üst çubuk başlığı:** Sekme köklerinde 16 px kalın Outfit'e uygulanan `tracking-tight` kaldırılmıştır. "Av." ile "Fethi" artık
  ayrı okunmaktadır.
- **Ortak anahtar:** Ayarlar ekranındaki düzeltilmiş anahtar (56×44, kapalı ray `--ink-4`) `shell/Anahtar.tsx` bileşenine taşınmış,
  Takip ekranının günlük hatırlatma anahtarı da bu bileşeni kullanmaktadır.
- **Takip alan etiketleri:** İlgi alanı düğmeleri ham kod (`hgk · 16309`) yerine arşiv süzgecindeki gibi etiket ve binlik ayraçlı
  sayı yazmaktadır («Hukuk Genel Kurulu · 16.309»).
- **Düğme tutarlılığı:** Uygulamanın düğme dizisi (`.btn-brand`, `.btn-kiremit`, `.btn-ghost`, 22 kullanım) sitedeki `.btn-primary`
  gölge formülünü izlemektedir. Değişiklik gerekmemiştir.

## Çevrimdışı paketler

Tam `build-app.mjs --app=asistan` derlemesi makinenin üç kez uykuya geçmesi yüzünden yarıda kalmış, 13 Ekim 13:04'te başlatılan
dördüncü deneme 16 dakikada bitmiştir.

| Ölçü | 7 Ekim (G14) | 13 Ekim (G21) |
|---|---:|---:|
| Arşivdeki karar | 114.625 | 121.937 |
| Yayın süzgecinden geçen karar | 39.718 | 43.764 |
| Karar atfı bulunan madde | 1.521 | 1.547 |
| Bağlanan madde atfı | 17.637 | 19.609 |
| Uygulamadaki rehber | — | 556 (24 konu) |
| Kütüphane eseri | — | 11 (50.171 kelime) |

`smoke-ui` 23 adımın tamamında yeşildir. Tek tarayıcı hatası, `localhost` kökeninden `daily.json` isteğinin CORS ile reddedilmesidir
ve ölçüm ortamına özgüdür. İstatistik sayfasının dağılım dosyası (`public/data/yargi-dagilim.json`) aynı anlık görüntüden yeniden
üretilmiş, `lib/site-stats.ts` yedek karar sayısı 43.764 yapılmıştır.

## Sürüm ve derleme

- Katalogda `asistan` 1.2.3 (9) → 1.3.0 (10) yapılmış, `build-flavor.mjs --app=asistan` sürümü `flavor.properties` ve
  `flavors/asistan/meta.json`'a yazmıştır. `galaxy.test.mjs`'e eklenen test `meta.json` sürümünü katalogla kilitlemektedir (önce
  kırmızı).
- `npx cap sync android` ve `gradlew assembleDebug --no-daemon` 8 dk 53 sn'de geçmiştir. `aapt2 dump badging`:
  `com.avfethiguzel.hesap.debug`, sürüm kodu 10, `1.3.0-debug`, hedef SDK 36, en düşük SDK 24. APK git dışındadır.

## M5: sürüm derlemesinde lint

`gradlew :app:lintRelease` (3 dk 55 sn) güvenlik kategorisinde bulgu vermemiştir.

| Önem | Bulgu | Sayı | Not |
|---|---|---:|---|
| Fatal | FullBackupContent | 7 | Yedekleme dosyalarındaki WebView dışlamaları hiçbir `<include>` altında değildir, yani etkisizdir. WebView verisi yine de yedeğe girmemektedir. |
| Error | PropertyEscape | 1 | Git dışındaki `local.properties`'te `D:` iki noktası kaçışsızdır, derlemeye etkisi yoktur. |
| Warning | Simge (Icon*) | 22 | Uyarlanabilir simge biçimi ve yinelenen yoğunluklar. |
| Warning | IntentFilterUniqueDataAttributes | 16 | Bağlantı süzgeçleri `build-flavor.mjs` üretimidir. |
| Warning | UnusedResources, GradleDependency, diğer | 21 | — |

`checkReleaseBuilds true` yapılırsa yedi Fatal bulgu imzalı sürüm derlemesini durdurabilir. Bu dosyalar kullanıcı sorusu 8'in
(M4) konusu olduğundan ayar `false` bırakılmış ve karar soru 24 olarak kullanıcıya yazılmıştır.

## Doğrulama

- `kalite:hizli` 886 testte yeşildir. İlk koşu `yargi-dagilim` testinde kırılmış, dağılım dosyası yeniden üretilince geçmiştir.
- Tam `npm run kalite` 13 Ekim 13:57'de geçmiştir: 886 test, Next derlemesi 509 sn, derleme taraması yeşil.
- TestSprite: değişiklik yayında değildir (yayın 30 Ekim), koşulmamıştır.
