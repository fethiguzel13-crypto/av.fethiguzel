# G25 — Son regresyon raporu

Taslak 2026-10-18 21:40'ta, ölçümler 2026-10-19 06:15-06:45 arasında başsız oturumda yazılmıştır. Alt plan `gorevler/G25.md`'dedir.
Ölçümlerin hepsi aynı derlemeye karşı koşulmuştur: 18 Ekim 16:01 tam kapısının `.next` çıktısı (HEAD `70cbc763b` koduyla aynı, sonraki
commit'ler yalnız belgedir), `next start -p 3123`, makine prizde.

## Ölçüm tablosu

| Ölçüt | Başlangıç (G06) | Hedef | Final (G25) |
|---|---|---|---|
| npm audit kritik/yüksek | 1 / 7 | 0 / 0 | Üretimde 0 / 0, geliştirme araçlarında 0 / 7 (gerekçe aşağıda) |
| Lighthouse mobil performans (ort.) | 47 (10/12 sayfa) | ≥ 90 | 79 (12/12 sayfa, üç koşu ortancası); hedefe ulaşılmamıştır, gerekçe aşağıda |
| Lighthouse SEO (ort.) | 99 | 100 | 97; on bir sayfada 100, ölçülen kopya ders notunda 66 (bilinçli `noindex`, aşağıda) |
| Dizine açık ince/şablon sayfa | ~11.600 | 0 | 0 (dizinde yalnız 26 temsilci not ve bir fakülte sayfası; G11) |
| Test sayısı (tüm takımlar) | 466 | ≥ 699 | 971 (kapıda 1015, farkın kaynağı aşağıda) |
| Emsal ve benzersiz Yargıtay kararı | 32.394 | artış | 49.366 (19 Ekim 06:12, `yargi:hasat-durum`) |
| Canonical başka adresi gösteren (örnek) | 60 / 307 | 0 | 0 / 267 |
| Kırık iç bağlantı (600 örnek) | 18 | 0 | 0 / 600 (yönlendirme 0) |

Test sayısı için not: 18 Ekim 15:34 tam kapısı 1015 testte yeşildir (`logs/g25-tam-1534.log`). Bunların 44'ü `test:karar-arama` adımına aittir,
bu adım ise başka bir oturumun henüz commit'lenmemiş yerel karar arama aracından (`scripts/karar-arama/`, `scripts/kalite.mjs` ve
`package.json`'daki commit'siz satırlar) gelmektedir. Depodaki kodun test sayısı bu yüzden 971 olarak yazılmış olup o araç commit'lenince 1015 olur.

## Kalite kapısı (5. adım)

İlk tam kapı 15:04-15:27 arasında 1011 testin 1009'unda yeşil kalmıştır. Kırılan iki uçtan uca test, 3. adımda denetim listesine giren
`/eserlerim` sayfasını derlenmiş sitede ilk kez ölçmüş ve iki bulgu vermiştir. Kitap kapağındaki kısa ad `h4` olup `h1`'den sonra düzey
atlatmakta, sabit genişlikli kapak da 320 px ekranda sayfayı 336 px'e taşırmaktaydı. İki bulgu `00afbb0ab` ile kapanmış, ikinci tam kapı
15:34-16:01 arasında 1015 testte yeşil kalmıştır, uçtan uca adım 44/44'tür. Ölçümlerden sonra 19 Ekim 06:44-06:58 arasında koşulan
günün tam kapısı da aynı kodda 1015 testte yeşildir (`logs/g25-tam-0644.log`, derleme 466 sn, uçtan uca 175 sn).

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

## SEO taraması (6. adım)

`node scripts/seo-tara.mjs --ornek=25 --baglanti=600` G06 ile aynı yöntemi kullanır, kayıt `raporlar/seo-final.json`'dadır.

| Ölçüt | G06 | Final |
|---|---|---|
| Haritalardaki tekil adres | 15.558 | 8.932 |
| Taranan örnek sayfa | 308 | 267 |
| Durum kodları | 307 × 200, 1 × 307 | 267 × 200 |
| Haritada 200 olmayan / `noindex` | 1 / 0 | 0 / 0 |
| Uzun başlık / uzun açıklama / kısa açıklama | 125 / 84 / 17 | 59 / 36 / 17 |
| Tekrar eden başlık / açıklama (sayfa) | 39 / 39 | 0 / 0 |
| Canonical eksik / uyumsuz | 0 / 60 | 0 / 0 |
| JSON-LD yok / geçersiz blok | 0 / 0 | 0 / 0 |
| `h1` yok / çoklu | 0 / 2 | 0 / 2 |
| HTML medyan / p90 (KB) | 108 / 396 | 107 / 522 |
| Yanıt süresi medyan / p90 (ms) | 908 / 3.502 | 333 / 1.359 |
| Kırık iç bağlantı (600 örnek) | 18 | 0 |

Tekil adres sayısındaki düşüşün tamamı ders notu haritasındandır (6.637 → 28). G11 her ders için tek temsilci notu dizinde bırakmış,
6.552 kopya ve şablon notu `noindex` yapmıştır. Derlenmiş sitede örneklenen iki kopya not `noindex, follow`, Ankara fakülte sayfası
`index, follow` dönmekte, haritada temsilci dışı not bulunmamaktadır. Eski alan sayfalarının haritadan çıkması (soru 28) on yedi adres eksiltmiştir.

HTML p90 artışı aynı sayfaların ağırlaşmasından gelmemektedir. Ders notu grubunda artık yalnız G19 ve G23'te kanonik katmanla
genişletilen temsilci notlar örneklenmekte (grup medyanı 267 → 571 KB), diğer grupların medyanı 0-4 KB oynamaktadır. En ağır iki sayfa
`/mevzuat/ttk` (1.464 KB) ile `/mevzuat/tmk`'dir (1.022 KB). İki kanunun bütün madde listesini tek sayfada taşıdıkları için bu ağırlık
yayından sonra sayfalamayla ele alınabilir. Kalan iki çoklu `h1` bulgusu, G06'daki iki `/makale-oku/*.docx` sayfasıdır (dönüştürülen
Word belgesinin kendi başlıkları).

## Lighthouse (6. adım)

`node scripts/lighthouse-olc.mjs --tekrar=3` mobil profille ölçer, her ölçü üç başarılı koşunun ortancasıdır. Kayıt
`raporlar/lighthouse-final.json`'dadır. G13'ün tespitine göre G06'daki 34-48 sn'lik TBT değerleri o günkü makine yüküyle şişmiştir, bu
yüzden TBT karşılaştırması yalnız yön gösterir.

| Sayfa | G06 P / LCP (sn) / TBT (ms) / aktarım (KB) | Final P / LCP (sn) / TBT (ms) / aktarım (KB) |
|---|---|---|
| Ana sayfa | 28 / 8,7 / 47.729 / 1.067 | 67 / 5,2 / 495 / 720 |
| Makale | 37 / 5,9 / 8.794 / 809 | 71 / 4,7 / 460 / 603 |
| Mevzuat madde | 87 / 1,3 / 500 / 41 | 99 / 1,0 / 149 / 44 |
| Şerhli madde | 64 / 2,5 / 1.631 / 57 | 96 / 1,0 / 227 / 60 |
| Rehber | 25 / 18,4 / 34.027 / 1.235 | 77 / 4,7 / 263 / 646 |
| Ders notu fakülte sayfası | ölçülemedi | 82 / 4,5 / 143 / 639 |
| Ders notu | ölçülemedi | 58 / 6,3 / 723 / 896 |
| Hesaplama | 43 / 5,8 / 5.683 / 767 | 64 / 5,3 / 681 / 643 |
| Yargı arşivi | 31 / 5,8 / 7.922 / 1.261 | 83 / 4,6 / 45 / 666 |
| Kavram | 59 / 5,2 / 816 / 1.251 | 84 / 4,4 / 42 / 580 |
| Bölge | 58 / 5,3 / 937 / 789 | 83 / 4,4 / 104 / 583 |
| Yazar | 36 / 7,2 / 3.220 / 1.289 | 82 / 4,7 / 49 / 619 |
| **Ortalama** | P 47, erişilebilirlik 94, en iyi uygulama 100, SEO 99 | P 79, erişilebilirlik 99, en iyi uygulama 99, SEO 97 |

Her sayfada puan ve LCP iyileşmiş olup gerileme yoktur. Aktarım ağır sayfalarda 124-671 KB düşmüş, iki madde sayfasında 3 KB artmıştır.
Ne var ki ≥ 90 hedefine yalnız rota işleyicisiyle sunulan iki hafif madde sayfası (44-60 KB) ulaşmaktadır. Kalan on sayfa 580-900 KB
aktarım taşımakta ve mobilde LCP'yi 4,4-6,3 sn'de tutmaktadır. Bu sayfaların ortak payı App Router düzeninin istemci betiğidir. Yargı
arşivinin profilinde (aşağıda) FCP sonrasındaki ana iş bu ortak React parçasında toplanmaktadır, diğer dokuz sayfa ayrıca profillenmemiştir.
Yayından on bir gün önce ortak düzeni değiştirmek bütün sayfa türlerinde regresyon riski doğuracağından hedef açık bırakılmış ve yayın
sonrası işe yazılmıştır.

SEO ortalamasını düşüren tek sayfa ölçüm listesindeki ders notudur (`/ders-notlari/afyon/borclar-genel-donem-1`). Başarısız tek denetim
`is-crawlable`'dır, zira bu not G11 kararıyla kopya olarak `noindex` yapılmıştır. Ölçüm listesi G06 karşılaştırması bozulmasın diye
değiştirilmemiştir. Dizine açık on bir sayfanın hepsi SEO 100'dür.

## Tasarım ve yapı denetimi (6. adım)

`node scripts/tasarim-denetim.mjs --etiket=final --yapi` on dokuz sayfa türünü 1280 ve 390 px genişlikte ölçmüştür. Otuz sekiz ölçümün hepsi
durum 200, axe ihlali 0, karşıtlık bulgusu 0, küçük hedef 0, taşma yok ve yapı bulgusu 0'dır. İçtihat sayfasındaki küçük hedef sayısı
derlenmiş sitede 0 olup G24 devri kapanmıştır. Kayıtlar `raporlar/tasarim-denetim-final.json` ve `raporlar/erisilebilirlik-final.json`'da,
ekran görüntüleri `raporlar/gorsel/g15-*-final.jpg`'dedir. Kabul ölçütündeki "on dokuz sayfa türünde iki genişlikte 0 bulgu" sağlanmıştır.

## Yargı arşivi TBT profili (7. adım)

`/yargi-kararlari` aynı derlemede, aynı Lighthouse ayarlarıyla üç kez tam çıktıyla ölçülmüştür (izler depo dışında, `%TEMP%/g25-tbt/`).

| Koşu | P | FCP (ms) | LCP (ms) | TBT (ms) | Ana iş parçacığı (ms) |
|---|---|---|---|---|---|
| 1 | 72 | 1.602 | 4.951 | 391 | 3.236 |
| 2 | 74 | 1.559 | 4.794 | 349 | 3.160 |
| 3 | 76 | 1.560 | 4.723 | 316 | 3.185 |

Toplu ölçümün ortancası 45 ms (36-529) olup tam izlerde 316-391 ms'ye çıkmıştır, yani bu sayfada TBT koşudan koşuya belirgin oynamaktadır.
İki ölçüm de G13'teki 1.549 ms'nin çok altındadır. FCP'den önceki uzun görevler (HTML ayrıştırma ve stil, 0,8-1,4 sn) TBT'ye girmez.
FCP'den sonra TBT'ye katılan görevlerin hemen tamamı React çatı parçasındadır (`0pti9u5wk_zr4.js`, 4,7-5,4 sn arasında 59-282 ms'lik üç-beş
görev, koşu başına 560-730 ms betik çalışması). Bu, sayfaya özgü bir döngü değil, hidrasyonun kendisidir. Küçük bir düzeltmeyle
giderilemeyeceğinden kod değiştirilmemiş, bulgu yayın sonrası işe yazılmıştır: Sayfadaki istemci bileşenlerinin küçültülmesi ya da
sunucu bileşenine çevrilmesi.

## Yayın sonrası işler

- Ortak istemci betiğinin küçültülmesi (Lighthouse ≥ 90 hedefi, yargı arşivi hidrasyonu).
- `/mevzuat/ttk` ve `/mevzuat/tmk` madde listelerinin sayfalanması.
- Geliştirme araçlarındaki `braces` zinciri için `tailwindcss` 4 geçişi.

## Kullanıcıya sorular

Soru 27 (G00 ve G08'in G25'in önünde engel sayılmaması) ile soru 28 (eski alan sayfalarının yönlendirilmesi) bu görevde açılmıştır.
