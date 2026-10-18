# G25 — Son regresyon raporu (TASLAK)

Taslak 2026-10-18 21:40'ta başsız oturumda yazılmıştır. Alt plan `gorevler/G25.md`'dedir. 1-5. adım ile 8. adım bitmiştir, 6. adımın
ölçümleri (SEO taraması, Lighthouse, tasarım denetimi) ve 7. adımın TBT profili makine prizdeyken koşulacaktır. Ölçüm gelmeden doldurulamayan
hücreler "6. adım" diye bırakılmış olup tahminle doldurulmamıştır.

## Ölçüm tablosu

| Ölçüt | Başlangıç (G06) | Hedef | Final (G25) |
|---|---|---|---|
| npm audit kritik/yüksek | 1 / 7 | 0 / 0 | Üretimde 0 / 0, geliştirme araçlarında 0 / 7 (gerekçe aşağıda) |
| Lighthouse mobil performans (ort.) | 47 (10/12 sayfa) | ≥ 90 | 6. adım |
| Lighthouse SEO (ort.) | 99 | 100 | 6. adım |
| Dizine açık ince/şablon sayfa | ~11.600 | 0 | 6. adım |
| Test sayısı (tüm takımlar) | 466 | ≥ 699 | 971 (kapıda 1015, farkın kaynağı aşağıda) |
| Emsal ve benzersiz Yargıtay kararı | 32.394 | artış | 49.088 (18 Ekim 15:10, `yargi:hasat-durum`) |
| Canonical başka adresi gösteren (örnek) | 60 / 307 | 0 | 6. adım |
| Kırık iç bağlantı (600 örnek) | 18 | 0 | 6. adım |

Test sayısı için not: 18 Ekim 15:34 tam kapısı 1015 testte yeşildir (`logs/g25-tam-1534.log`). Bunların 44'ü `test:karar-arama` adımına aittir,
bu adım ise başka bir oturumun henüz commit'lenmemiş yerel karar arama aracından (`scripts/karar-arama/`, `scripts/kalite.mjs` ve
`package.json`'daki commit'siz satırlar) gelmektedir. Depodaki kodun test sayısı bu yüzden 971 olarak yazılmış olup o araç commit'lenince 1015 olur.

## Kalite kapısı (5. adım)

İlk tam kapı 15:04-15:27 arasında 1011 testin 1009'unda yeşil kalmıştır. Kırılan iki uçtan uca test, 3. adımda denetim listesine giren
`/eserlerim` sayfasını derlenmiş sitede ilk kez ölçmüş ve iki bulgu vermiştir. Kitap kapağındaki kısa ad `h4` olup `h1`'den sonra düzey
atlatmakta, sabit genişlikli kapak da 320 px ekranda sayfayı 336 px'e taşırmaktaydı. İki bulgu `00afbb0ab` ile kapanmış, ikinci tam kapı
15:34-16:01 arasında 1015 testte yeşil kalmıştır, uçtan uca adım 44/44'tür.

Aynı görevde kapanan diğer işler şunlardır: Alt bilgideki iki uyum beyanı G16 kararıyla kaldırılmış ve testle kilitlenmiştir (`7829c6d6f`).
Yönlendirme dışında kalan üç eski alan sayfası ile on dört alt alan sayfası `/mevzuat/<kanun>`'a 308 ile gitmekte olup site haritasından
çıkarılmıştır (`70cbc763b`, soru 28).

## Güvenlik yeniden taraması (8. adım)

**Bağımlılıklar** (18 Ekim 21:35, `npm audit`):

| Kapsam | Kritik | Yüksek | Orta | Düşük |
|---|---|---|---|---|
| Site, üretim (`--omit=dev`) | 0 | 0 | 5 | 2 |
| Site, tamamı | 0 | 7 | 8 | 2 |
| Mobil, üretim (`--omit=dev`) | 0 | 0 | 0 | 0 |
| Mobil, tamamı | 0 | 6 | 3 | 0 |

Üretimdeki kritik ve yüksek açık 18 Ekim 15:20'de kapatılmıştır (`d47d6602c`): Sitede `source-map-js` 1.2.2'ye, mobilde `@capacitor/android`,
`core` ve `cli` 7.6.9'a geçmiştir (GHSA-rvm3-566m-v7fv, kritik). Hiçbirinde `--force` kullanılmamıştır.

Sitedeki yedi yüksek bulgunun hepsi tek bir duyurudan doğmaktadır. `braces` paketinin derin iç içe desende yığın tüketmesi
(GHSA-vfj7-8cjw-p6xm) `micromatch`, `fast-glob` ve `chokidar` üzerinden `tailwindcss` 3.4.19 ile `eslint-config-next` 16.3.8'e ulaşmaktadır.
İki paket de yalnız derleme ve lint sırasında depodaki sabit desenlerle çalışır, yayındaki siteye girmez. npm'in önerdiği giderim ana sürüm
değişikliğidir (`tailwindcss` 4'e geçiş, `eslint-config-next` için sürüm düşürme). Yayından on iki gün önce stil katmanının tamamını
etkileyen bir geçiş regresyon riski doğuracağından bulgu gerekçeli kabul edilmiştir. Mobildeki altı yüksek bulgu aynı `braces` zinciri ile
yalnız ikon üretiminde kullanılan `sharp`'ın (libvips, libheif, librsvg) duyurularıdır. `sharp` geliştirme bağımlılığı olup yalnız depodaki
kendi görsellerimizi işlemektedir, uygulama paketine girmez.

**G04 bulguları (B1-B10).** G04'ün kapanış commit'inden (`8a625ea35`, 1 Ekim) bu yana `app/api` ve `lib/uyelik` altında yalnız bir değişiklik
vardır: G14 ücretli karar indeksini `public/data/`'dan `data/yayin/`'a taşımış, iki dosyada yalnız okuma yolu değişmiştir. Yeni API ucu
eklenmemiştir. On bulgunun hepsini kilitleyen `test:uyelik` takımı 61/61 yeşildir. G04'ün açık bıraktığı tek madde, yüzde kodlu adres
varyantlarının `beforeFiles` yeniden yazmasını atlayıp atlamadığıydı. Dosya artık `public/` altında bulunmadığından ve depoda izlenmediğinden
(`git ls-files public` içinde `yargi-index` 0) statik sunucu onu hiçbir adres biçiminde veremez, risk konusuz kalmıştır. Derlenmiş sitede
`/api/yargi/index` ve `/data/yargi-index.json.gz` üyeliksiz 401 dönmektedir (18 Ekim 16:02).

**G05 bulguları (M1-M5).** G05'in kapanış commit'inden (`96947f660`) bu yana Android manifesti, `res/xml` yapılandırmaları, Capacitor
yapılandırmaları, `build.gradle` ve üyelik/ödeme modülleri değişmemiştir. Değişen tek kaynak `mobile/app-src/src/lib/yargi.ts`'tir ve yalnız bir
etiket eklemektedir. `test:mobil` 67/67 yeşildir. M3, M4 ve M5 kullanıcı kararındadır (soru 7, 8, 24).

**Güvenlik başlıkları (G03).** Derlenmiş sitede CSP, HSTS, COOP, `X-Frame-Options` ve `Permissions-Policy` yerindedir (18 Ekim 16:02, `curl -I`).

**Commit'siz yerel araç.** Başka oturumun `scripts/karar-arama/sunucu.mjs` aracı yalnız `127.0.0.1`'e bağlanmakta ve `Host` başlığını
`127.0.0.1`/`localhost` ile sınırlamaktadır, yani ağdan erişilemez. Araç bu görevin kapsamında olmadığından ayrıca incelenmemiştir.

## Bekleyen adımlar

- **6. adım:** `next start -p 3123` ile 18 Ekim 16:01 derlemesine karşı SEO taraması, Lighthouse (üç tekrar) ve tasarım denetimi. İçtihat
  kartındaki küçük hedef sayısı derlenmiş sitede 0 olmalıdır (G24 devri).
- **7. adım:** `/yargi-kararlari` mobil TBT profili (G13 devri).
- Tablo tamamlanınca bu dosyanın başlığındaki "TASLAK" kaldırılır ve `PLAN.md` ölçüm tablosu doldurulur.

## Kullanıcıya sorular

Soru 27 (G00 ve G08'in G25'in önünde engel sayılmaması) ile soru 28 (eski alan sayfalarının yönlendirilmesi) bu görevde açılmıştır.
