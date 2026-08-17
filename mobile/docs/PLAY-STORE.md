# Play Console — dört uygulamayı yayınlama

Uygulamalar birbirinden **işlevsel olarak ayrıdır** ve bu ayrım mağaza
girişinde açıkça görünmelidir. Google'ın Repetitive Content politikası, aynı
hesaptan çıkan birbirinin kopyası uygulamaları hedefler; buradaki dört
uygulama farklı içerik, farklı simge, farklı renk ve farklı sekme yapısı
taşır.

## 0) Yükleme sırası

Dördünü aynı gün yüklemeyin. Önerilen sıra:

1. **Hukuki Hesap** — en sağlam ve en kolay değerlendirilen uygulama
2. **Mevzuat** — bir hafta sonra
3. **Vatandaş Hukuku**
4. **İçtihat Günü** — bildirim izni istediği için en son

İlk uygulama sorunsuz yayınlandıktan sonra devam etmek, hesap düzeyinde bir
sorun çıkarsa zararı tek uygulamayla sınırlar.

## 1) Uygulama oluşturma

Her uygulama için ayrı giriş:

| Alan | Mevzuat | Hukuki Hesap | İçtihat Günü | Vatandaş Hukuku |
|------|---------|--------------|--------------|------------------|
| Paket | `com.avfethiguzel.hukuk` | `com.avfethiguzel.hesap` | `com.avfethiguzel.icthat` | `com.avfethiguzel.rehber` |
| Sürüm | 2.0.0 (4) | 1.0.0 (1) | 1.0.0 (1) | 1.0.0 (1) |
| Kategori | Kitaplar ve referans | Verimlilik | Haber ve dergiler | Kitaplar ve referans |
| İçerik derecesi | 3+ | 3+ | 3+ | 3+ |

Varsayılan dil: Türkçe (Türkiye). Ücretsiz. Reklam yok. Uygulama içi satın
alma yok.

## 2) Mağaza girişi

Metinler hazır: `mobile/store-listing/<uygulama>/tr-short.txt` ve
`tr-full.txt`. Grafikler: `mobile/assets/icons/`

| Varlık | Dosya | Boyut |
|--------|-------|-------|
| Uygulama simgesi | `<id>-1024.png` | 512×512 (1024 önerilir) |
| Öne çıkan grafik | `<id>-feature.png` | 1024×500 |
| Telefon ekran görüntüsü | elle çekilir | en az 2, en fazla 8 |

**Ekran görüntüsü çekimi:** uygulamayı bir cihaza kurun, **uçak modunu
açın** ve öyle çekin. Uçak modunda dolu görünen ekranlar, incelemecinin
"bu gerçekten çevrimdışı çalışıyor" sorusunu daha ilk bakışta cevaplar.

Önerilen kareler:
- Mevzuat: kanun listesi · TMK madde 166 · arama sonucu («dürüstlük»)
- Hesap: araç listesi · kıdem tazminatı sonucu · faiz hesabı
- İçtihat: günün özeti · arşiv araması · takip ekranı
- Rehber: konu başlıkları · bir rehberin adım adım bölümü

## 3) Veri güvenliği formu

Dördü için de aynı cevap seti geçerlidir:

| Soru | Cevap |
|------|-------|
| Veri topluyor musunuz? | **Hayır** |
| Veri paylaşıyor musunuz? | **Hayır** |
| Veriler aktarımda şifreleniyor mu? | Evet (HTTPS) |
| Kullanıcı veri silmeyi talep edebilir mi? | Uygulama içinden: Ayarlar → Tüm yerel verileri sil |

Gerekçe: favoriler, kayıtlar, hesap geçmişi ve tercihler yalnız cihazda
tutulur (Capacitor Preferences → Android SharedPreferences). Uygulama hesap
açtırmaz, analitik SDK içermez, konum veya kişi listesi istemez. Ağ yalnız
şu üç iş için kullanılır:

- İçtihat Günü'nün günlük özeti çekmesi (`/data/daily.json`)
- «Sitede aç» bağlantıları (sistem tarayıcısında)
- Paylaşım

## 4) İzinler

| İzin | Hangi uygulama | Gerekçe |
|------|----------------|---------|
| `INTERNET` | dördü | tazeleme ve harici bağlantı |
| `ACCESS_NETWORK_STATE` | dördü | çevrimdışı şeridi |
| `POST_NOTIFICATIONS` | İçtihat Günü | günlük hatırlatma (kullanıcı açarsa) |
| `RECEIVE_BOOT_COMPLETED` | İçtihat Günü | yeniden başlatmadan sonra hatırlatmanın sürmesi |

Bildirim izni **kullanıcı açıkça açana kadar istenmez**; Takip ekranındaki
anahtar kapalı gelir.

## 5) AAB üretimi

```
Actions → Build Android AAB → Run workflow
```

İş akışı dört uygulamayı ayrı ayrı üretir ve her birini `verify-release`
kapısından geçirir. Artefaktlar: `aab-portal`, `aab-hesap`, `aab-icthat`,
`aab-rehber`.

Gerekli repo gizli anahtarları (bir kez):

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

`mapping.txt` de artefakta konur — Play Console'a yükleyin, çökme raporları
okunabilir olsun.

## 6) İlk yüklemeden SONRA: App Links

Play App Signing sertifikası ancak ilk AAB yüklendikten sonra oluşur.
Sonra her uygulama için:

```
Play Console → Uygulama bütünlüğü → Uygulama imzalama
→ «Uygulama imzalama anahtarı sertifikası» SHA-256 parmak izini kopyalayın
```

Bu değerleri `public/.well-known/assetlinks.json` içindeki dört yer tutucuya
yazın ve siteyi yeniden yayınlayın. Doğrulama:

```
https://www.avfethiguzel.com/.well-known/assetlinks.json
```

Her uygulama yalnız kendi yol önekini sahiplenir; aynı bağlantı için
kullanıcıya "hangi uygulama?" diye sorulmaz:

| Uygulama | Sahiplendiği yollar |
|----------|---------------------|
| Mevzuat | `/mevzuat`, `/ara`, `/kavram` |
| Hukuki Hesap | `/hesaplama` |
| İçtihat Günü | `/icthat`, `/yargi-kararlari` |
| Vatandaş Hukuku | `/bilgi`, `/rehber` |

## 7) İnceleme için hazır cevaplar

İncelemeci soru sorarsa:

**«Uygulama web sitesinin kopyası mı?»**
Hayır. Uygulamalar içeriklerini cihazda taşır ve internet olmadan çalışır.
Mevzuat uygulamasında 8.087 madde metni ve arama indeksi uygulamayla birlikte
kurulur; Hukuki Hesap'ta 33 hesaplama tamamen cihazda yapılır ve girilen
veriler hiçbir sunucuya gönderilmez.

**«Dört uygulamanız neden benzer?»**
Farklı kullanıcı ihtiyaçlarına karşılık gelirler: mevzuat metni okuma,
hesaplama, güncel karar takibi, vatandaş rehberi. İçerikleri, sekme yapıları,
simgeleri ve renkleri ayrıdır; birbirinin yerine geçmezler.

**«Hukuki tavsiye veriyor musunuz?»**
Hayır. Her ekranda ve mağaza metninde bilgilendirme amacı ve avukata danışma
uyarısı yer alır.
