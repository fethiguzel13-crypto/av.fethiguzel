# Play Console — yayına alma

Bu dosya eskiden dört ayrı uygulamayı anlatıyordu (Mevzuat, Hukuki Hesap,
İçtihat Günü, Vatandaş Hukuku). Dördü tek uygulamada birleştirildiği için
(bkz. `galaxy/catalog.json` → `asistan`) kılavuz o birleşmeye göre baştan
yazıldı. **Kayıt yeni açılmıyor**: `com.avfethiguzel.hesap` paketi Play
Console'da zaten var — eski "Hukuki Hesap" adıyla açılmıştı, dahili test
kanalına `versionCode 1` yüklenmişti. Bu yüzden aşağıdaki adımlar *yeni
uygulama oluşturma* değil, *var olan kaydı güncelleyip üretime çıkarma*
sırasıdır.

## Şu an nerede durduğumuz

| | Durum |
|---|---|
| Play Console kaydı | **var** — `com.avfethiguzel.hesap`, dahili testte |
| İmzalama anahtarı | yerelde hazır ve doğrulandı (`android/keystore.properties`) |
| Sürüm | `versionCode 7`, `versionName 1.2.1` |
| `verify-release.mjs` | engelsiz geçiyor (1 uyarı: assetlinks — ilk üretim yüklemesinden sonra tamamlanır) |
| Uygulama simgesi / öne çıkan grafik | hazır — «FG» mührü (bkz. `docs/MARKA.md`) |
| Gizlilik politikası | canlı: `https://www.avfethiguzel.com/gizlilik` |
| Mağaza metni | `store-listing/asistan/` — güncel, sınırlar içinde |
| Telefon ekran görüntüleri | hazır — `assets/icons/play-ekran-goruntuleri/` (5 adet, 1080×1920) |
| Veri güvenliği formu | **dolduruldu** |
| Abonelik ürünü (`yargi_arsivi_aylik`) | oluşturuldu; **cihazda satın alma henüz doğrulanmadı** |
| AAB dosyası | **üretiliyor** — Android SDK `D:/android-sdk`, yerel Gradle ile |
| İçerik derecelendirmesi | **eksik** |
| Hedef kitle ve içerik | **eksik** |
| Reklamlar beyanı | **eksik** |
| Uygulama erişimi | **eksik** — ücretli bölüm var, incelemeciye erişim tarif edilmeli |

## Üretime çıkmadan önce tamamlanması ZORUNLU formlar

Hepsi tek yerde: **Politika ve Programlar → Uygulama içeriği**

| Form | Neden zorunlu |
|---|---|
| Gizlilik politikası | ✅ tanımlı |
| **Reklamlar** | Uygulamada reklam yok — «Hayır» denmeli, boş bırakılamaz |
| **Uygulama erişimi** | Yargıtay arşivi ÜCRETLİ; incelemeci ödemeden göremez. Erişimin nasıl sağlanacağı yazılmalı (lisans testi hesabı ya da `uyelikElleAc`) |
| **İçerik derecelendirmesi** | IARC anketi. Ceza kararları ve suç tanımları taşındığı için şiddet/suç sorularına gerçekçi cevap gerekir |
| **Hedef kitle ve içerik** | Yaş grubu beyanı. Uygulama yetişkin/meslek kitlesine yönelik; çocuklara yönelik DEĞİL |
| Veri güvenliği | ✅ dolduruldu |

Bunlardan biri eksikken «Üretim» sürümü yayımlanamaz — Play sürümü engeller.

## 0) Önce bir soru senin

**Bar'a ticaret yasağı sorusu.** Uygulama senin adını taşıyor ve aylık 500 TL
abonelik satıyor. Avukatlık Kanunu'nun ticaret ve reklam yasağı hükümleri
karşısında bunu baroya sorman yerinde olur — mağazada yayına almadan önce.
Teknik taraf hazır; bu değerlendirme meslek mevzuatına ait ve benim
yapabileceğim bir şey değil.

## 1) Abonelik ürününü Play Console'da oluştur

Uygulama `cordova-plugin-purchase` ile Play Billing'e bağlanıyor
(`lib/uyelik.ts` → `URUN_ID = 'yargi_arsivi_aylik'`). Bu ürün Play
Console'da **ilan edilmeden** satın alma ekranı boş fiyat gösterir ve satın
alma başlamaz.

```
Play Console → Uygulamanız → Para kazanma → Ürünler → Abonelikler
→ Abonelik oluştur
```

| Alan | Değer |
|------|-------|
| Ürün kimliği | `yargi_arsivi_aylik` — **birebir**, kod bununla eşleşiyor |
| Ad | Yargıtay arşivi üyeliği |
| Temel plan | `aylik`, otomatik yenilemeli, P1M |
| Fiyat | 500,00 TL |
| Ülke | Türkiye |

Temel planı **etkinleştirmeyi unutma** — oluşturmak yetmez, "Etkinleştir"
ayrı bir adımdır. Etkin değilse uygulama yedek fiyatı (`YEDEK_FIYAT` =
"500,00 TL") gösterir ve satın alma denemesi hata verir.

Play, uygulama içi dijital içerik için Google Play Faturalandırma'yı
zorunlu kılar; bir başka ödeme yöntemi (havale, iyzico) kullanmak
uygulamanın kaldırılmasına yol açar. Bu yüzden `lib/uyelik.ts` ve
`lib/odeme.ts` yalnız Play Billing'e bağlanacak şekilde yazıldı.

## 2) Veri güvenliği formu — ABONELİK yüzünden eski cevaplar geçersiz

Önceki sürümde bu form "uygulama içi satın alma yok" varsayımıyla
dolduruluyordu. Artık öyle değil.

```
Play Console → İlkeler → Uygulama içeriği → Veri güvenliği
```

| Soru | Cevap | Gerekçe |
|------|-------|---------|
| Kişisel veri topluyor musunuz? | **Evet** | Play Billing satın alma işlemi hesap kimliğini işler |
| Finansal bilgi — satın alma geçmişi | **Evet, toplanır** | Abonelik durumu doğrulanıp cihazda saklanır |
| Üçüncü tarafla paylaşılıyor mu? | Hayır | İşlem Google Play'in kendi altyapısında kalır |
| Şifreleme | Evet (HTTPS + cihaz üstü AES-256-GCM) | Karar metinleri şifreli kasa olarak taşınır |
| Silme talebi | Uygulama içinden: Ayarlar → Tüm yerel verileri sil | Üyelik kaydı da yerel depodan silinir |

Mevzuat, kavram sözlüğü, rehber, hesaplama ve günlük içtihat hâlâ hiçbir
veri toplamaz — bu ayrım formun kendisinde de belirtilmeli (bkz.
`docs/UYELIK.md` → "Neyi kapatıyoruz").

## 3) Mağaza girişini güncelle

Metinler hazır ve doğrulanmış (`node --test "scripts/__tests__/galaxy.test.mjs"`
kısa/tam açıklama sınırlarını ve uydurma sayı geçmediğini denetler):

| Alan | Kaynak |
|------|--------|
| Kısa açıklama | `store-listing/asistan/tr-short.txt` |
| Tam açıklama | `store-listing/asistan/tr-full.txt` |
| Uygulama adı | Play Console'da elle: **Av. Fethi Güzel Hukuk Asistanı** |
| Kategori | Kitaplar ve referans |
| İçerik derecesi | IARC anketini doldur — hukuk metni ve karar arşivi içeriği "şiddet/suç tasviri" sorularına gerçekçi cevap gerektirir (örn. suç tanımları, ceza kararları) |
| Simge | `assets/icons/asistan-512.png` (512×512) |
| Öne çıkan grafik | `assets/icons/asistan-feature.png` (1024×500) |

### Ekran görüntüleri — eksik, elle çekilmeli

Play kuralı: en az 2, en fazla 8; her kenar 320–3840 px; **uzun kenar/kısa
kenar oranı 2:1'i aşamaz**. Cihazın kendi ekran görüntüsü (412×915, oran
~2,22:1) bu sınırı aşar — doğrudan yüklenemez, kırpılması gerekir.

Çekim için:

```
mobile'da: npx cap sync android && npx cap run android
Telefonda: UÇAK MODUNU AÇ, sonra ekran görüntüsü al
```

Uçak modunda dolu görünen ekranlar, incelemecinin "gerçekten çevrimdışı mı"
sorusunu ilk bakışta cevaplar. Önerilen kareler:

- Ana sayfa (İçindekiler) — külliyat sayıları görünsün
- Yargıtay arşivi listesi — konu başlıklı satırlar
- Bir madde metni (fıkra yapısı görünür)
- Üyelik ekranı — fiyat ve neyin ücretsiz kaldığı
- Kavram sözlüğü ya da hesaplama aracı

## 4) AAB üretimi — bu ortamda YAPILAMAZ, GitHub Actions'tan üret

Bu geliştirme ortamında Android SDK kurulu değil (`ANDROID_HOME` boş,
`local.properties` yok) — imzalı AAB burada üretilemez. Depoda hazır bir iş
akışı var:

```
GitHub → Actions → Build Android AAB → Run workflow
  app: all  (katalogtan otomatik türetilir, tek uygulama olduğu için
             yalnız "asistan" derlenir)
```

Bu iş akışının çalışması için repo gizli anahtarlarının **tanımlı olduğunu
doğrula** (Settings → Secrets and variables → Actions):

- `ANDROID_KEYSTORE_BASE64` — `certutil -encode fethiguzel-upload.jks tmp.b64` (Windows) çıktısından baş/son satırları atarak
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS` — `fethiguzel` (bkz. `android/keystore.properties`)
- `ANDROID_KEY_PASSWORD`

İş akışı `verify-release.mjs` kapısından geçirir, `mapping.txt`'yi de
artefakta koyar (Play Console'a yükleyin — çökme raporları okunabilir olur).
Çıktı: `aab-asistan` artefaktı.

## 5) Yükleme — dahili testten üretime

Kayıt zaten dahili testte `versionCode 1` taşıyor. Yeni AAB (`versionCode 3`)
yüklenince:

```
Play Console → Test → Dahili test → Yeni sürüm oluştur
→ aab-asistan içindeki .aab dosyasını yükle
→ Yayımla
```

Dahili test kanalında sen (ya da eklediğin test hesapları) uygulamayı
gerçek Play altyapısından indirip **satın alma akışını da deneyebilir** —
üretime çıkmadan önce bunu mutlaka yap. Play Console → Test → Lisans testi
kısmına kendi Google hesabını eklersen ücretsiz test satın alması
yapabilirsin.

Sorunsuz denendikten sonra:

```
Play Console → Üretim → Yeni sürüm oluştur → aynı AAB'yi seç → Yayımla
```

İlk üretim sürümü Google'ın manuel incelemesinden geçer; bu genelde birkaç
saatten birkaç güne kadar sürebilir.

## 6) İlk üretim yüklemesinden SONRA: App Links

Play App Signing sertifikası ancak ilk AAB yüklendikten sonra oluşur.

```
Play Console → Uygulama bütünlüğü → Uygulama imzalama
→ «Uygulama imzalama anahtarı sertifikası» SHA-256 parmak izini kopyala
```

Bu değeri `public/.well-known/assetlinks.json` içindeki yer tutucuya yaz ve
siteyi yeniden yayımla. Doğrulama:

```
https://www.avfethiguzel.com/.well-known/assetlinks.json
```

`verify-release.mjs` bu adım tamamlanana kadar bir uyarı basar — engel
değildir, unutmamak için oradadır.

## 7) İnceleme için hazır cevaplar

**«Uygulama web sitesinin kopyası mı?»**
Hayır. İçerik cihazda taşınır ve internet olmadan çalışır: 8.088 madde
metni, 27.000'den fazla karar ve 33 hesaplama aracı kurulumla birlikte
gelir; hesaplamalar tamamen cihazda yapılır.

**«Uygulama içi satın alma neyi açıyor?»**
Yalnız Yargıtay arşivindeki kararların TAM METNİNİ. Mevzuatın tamamı,
kavram sözlüğü, vatandaş rehberi, akademik eserler, günlük içtihat ve 33
hesaplama aracı ücretsizdir ve öyle kalacaktır. Arşiv listesi de ücretsiz
görünür — künye, konu ve atıf yapılan maddeler herkese açık; kapalı olan
yalnız kararın gövdesidir.

**«Hukuki tavsiye veriyor musunuz?»**
Hayır. Her ekranda ve mağaza metninde bilgilendirme amacı ve avukata danışma
uyarısı yer alır. Bağlayıcı metin için mevzuat.gov.tr ve kararın aslı
esastır.

**«Abonelik fiyatı avukatlık ücreti mi?»**
Hayır. 500 TL/ay, kararların cihazda derlenmiş ve aranabilir hâlde
sunulması hizmetinin dijital içerik bedelidir; vekâlet ya da danışmanlık
ücreti değildir ve öyle sunulmaz.
