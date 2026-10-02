# G06 — SEO ve performans başlangıç ölçümü (2026-10-01)

Ölçüm yerel üretim derlemesi üzerinde yapılmıştır (`.next`, 2026-10-01 18:47; HEAD'den farkı yalnız üyelik API'si,
sayfa çıktısını etkilemez) ve `next start -p 3123` ile sunulmuştur. Canlı site Vercel 402 nedeniyle kapalıdır (G00).
Ham veri: `seo-baslangic.json` (tarama) ve `lighthouse-baslangic.json`. Betikler G25'te aynen yeniden koşar:

```
node scripts/seo-tara.mjs --ornek=25 --baglanti=600
node scripts/lighthouse-olc.mjs
```

Tarama robots.txt'deki site haritalarını okur, her içerik grubundan (ilk yol bölümü + derinlik) en çok 25 sayfayı
eşit aralıkla örnekler (308 sayfa) ve bu sayfaların 10.517 tekil iç bağlantısından 600'ünü dener. Örnekleme
deterministiktir; G25 aynı sayfaları ölçer.

## Sayılarla durum

| Ölçüt | Değer |
|---|---|
| Site haritalarındaki tekil adres | 15.558 (mevzuat madde 8.087, ders notu 6.552, rehber 556, diğer 363) |
| Taranan örnek | 308 sayfa: 307 × 200, 1 × 307 |
| Canonical başka adresi gösteren | **60 / 307** (41'i ana sayfayı, 19'u www'siz alan adını) |
| Aynı başlık ve açıklamayı taşıyan | **39 sayfa** (sitenin varsayılan başlık/açıklaması) |
| Başlık > 65 karakter | 125 / 307 |
| Açıklama > 165 / < 70 karakter | 84 / 17 |
| Başlık ya da açıklama eksik, noindex, JSON-LD'siz, h1'siz | 0 |
| Birden çok h1 | 2 |
| Geçersiz JSON-LD bloğu | 0 |
| Kırık iç bağlantı | **18 / 600 (%3)**: 15 × 404, 3 × 500 |
| HTML boyutu medyan / p90 | 108 KB / 396 KB (ders notu medyan 410 KB, en çok 849 KB) |
| Sunucu yanıtı medyan / p90 (yerel, 6 eşzamanlı) | 908 ms / 3,5 sn (ders notu medyan 3,0 sn) |

## Bulgular (öncelik sırasıyla)

### S1 — Canonical ana sayfayı gösteriyor (yüksek)

`app/layout.tsx:142` kök yerleşimde `alternates.canonical: siteUrl` tanımlıyor. Next.js metadata'sı miras
yoluyla aktarıldığından, kendi `alternates` alanı olmayan her sayfa ana sayfayı canonical olarak bildiriyor.
Google bu sayfaları ana sayfanın kopyası sayıp dizinden düşürebilir. Etkilenen örnekler `/makaleler`,
`/eserlerim`, `/icthat`, `/on-form` ve `/uyelik/sozlesme` sayfalarıdır. Örneklenen 25 `/kategori/*`
sayfasının 25'i ve site haritasındaki 11 `/makale-oku/*` sayfasının 11'i de etkilenmiştir. Site
haritasında bu yapıdaki adres sayısı yaklaşık 77'dir (kategori 61, makale 11, tekil 5).

### S2 — Varsayılan başlık ve açıklama tekrarı (yüksek)

S1'deki 41 sayfanın 39'u kök yerleşimin başlığını ("Av. Fethi Güzel | Mevzuat, Akademik Şerh &
Hukuki Hesaplama") ve açıklamasını taşıyor. Sorunun kaynağı S1 ile aynıdır: Sayfa kendi `metadata`'sını
üretmiyor. Kategori ve makale sayfaları arama sonucunda birbirinden ayırt edilemiyor.

### S3 — Canonical www'siz alan adını gösteriyor (orta)

`app/[category]/page.tsx:30`, `app/[category]/[slug]/page.tsx:68`, `app/gizlilik/page.tsx:10` ve
`app/yasal-uyari/page.tsx:10` canonical'ı `https://avfethiguzel.com/…` olarak yazıyor. Bu adres www'ye yönleniyor (robots.ts yorumu). Etkilenen sayfalar 19 adettir: `medeni-hukuk`,
`borclar-hukuku`, `ticaret-hukuku` ve alt sayfaları (17), `gizlilik`, `yasal-uyari`. Canonical'ın
yönlendiren bir adresi göstermesi Google'a çelişkili sinyal verir.

### S4 — `sitemap-index.xml` olmayan haritaları gösteriyor (orta)

`public/sitemap-index.xml`, `/sitemap/0.xml`–`/sitemap/2.xml` adreslerine işaret ediyor ve üçü de 404 dönüyor.
`app/sitemap.ts` yorumuna göre `generateSitemaps` Next 16'da kaldırılmış, ancak dizin dosyası güncellenmemiş.
robots.txt bu dosyayı listelemiyor. Search Console'a gönderilmişse orada hata olarak görünür. Dosya ya
silinmeli ya da robots.txt'deki beş haritayı gösterecek biçimde yeniden yazılmalıdır.

### S5 — Kırık iç bağlantılar (orta)

Denenen 600 bağlantının 18'i kırıktır (%3). Aynı oran 10.517 tekil iç bağlantıya yansıtılırsa sayı ~300 olur.

- 14 × 404: Üniversite ders notu sayfaları (`/ders-notlari/<üni>`) var olmayan notlara bağlanıyor. Örnek:
  `/ders-notlari/mef/hmk-yillik`, `/ders-notlari/asbu/anayasa-donem-2`. Liste ile üretilen sayfalar uyuşmuyor.
- 3 × 500: `/ders-notlari/<üni>/<ders>/pdf` sayfası bazı notlarda sunucu bileşeninde hata veriyor
  (`cukurova/insaat-hukuku-donem-1`, `izmir-katip-celebi/vergi-hukuku-yillik`, `selcuk/vergi-hukuku-yillik`).
- 1 × 404: `/site-haritasi` sayfası `/bilgi/muhür-sokme-sucu` adresine bağlanıyor; adreste Türkçe karakter
  kalmış.

### S6 — Ders notu sayfaları ağır ve yavaş (orta)

Site haritasındaki 6.552 ders notu sayfasının HTML medyanı 410 KB (en çok 849 KB), yerel sunucu yanıtı
medyanı 3,0 sn'dir. Mevzuat madde sayfaları 17 KB ve 557 ms ile ölçülmüştür. Ders notlarının çoğu şablon
katmanında olduğundan G11 (dizin mimarisi) bu sayfaların büyük kısmını dizin dışına alacaktır. Kalanlar
G13'te ele alınır.

### S7 — Uzun başlık ve açıklamalar (düşük)

Başlıkların 125'i (307'de) 65 karakteri aşıyor ve arama sonucunda kesiliyor. En çok etkilenen gruplar mevzuat
madde (25/25), `/bilgi` rehberleri (19/25), ders notu üniversite sayfaları (20/25) ve kanun sayfalarıdır (13/25).
Açıklamaların 84'ü 165 karakterden uzun, 17'si 70 karakterden kısadır. Düzeltme G10'a aittir.

### S8 — Site haritasında geçici yönlendirme (düşük)

`/ingilizce-avukat` site haritasında yer alıyor ancak 307 ile `/english-speaking-lawyer`'a yönleniyor. Adres
site haritasından çıkarılmalı, yönlendirme de kalıcı (308) yapılmalıdır.

### S9 — Makale adresleri ve başlık yapısı (düşük)

`/makale-oku/` adresleri Word dosya yolunu taşıyor: boşluk (`%20`), büyük harf ve `.docx` uzantısı içeriyorlar
(ör. `/makale-oku/ARABULUCULUK/arabuluculuk%20anla%C5%9Fma%20belgesi.docx`). İki makalede birden çok h1
bulunuyor. Okunur adres (slug) ve kalıcı yönlendirme G12'de değerlendirilir.

### S10 — Yapılandırılmış veri dağılımı (bilgi)

Sayfaların 282'sinde (307'de) aynı dört site geneli tür bulunuyor: Person, WebSite, LegalService,
SoftwareApplication. SoftwareApplication'ın her sayfada yer alması içerikle ilgisizdir. LegalService'in her
sayfada bulunması reklam yasağı açısından G07'de değerlendirilmelidir. FAQPage 75 sayfada var; G10 bunu
yalnız gerçek soru-cevap içeren sayfalarla sınırlayacaktır. HowTo 50 sayfada var; Google 2023'te HowTo zengin
sonucunu kaldırdığı için bu işaretlemenin getirisi yoktur. Geçersiz blok yoktur.

### S11 — Karar sayfaları site haritasında yok (bilgi)

`/yargi-kararlari/<id>` ve `/icthat/<id>` sayfaları hiçbir site haritasında yer almıyor. Hangi kararların
dizine açılacağı G14'te `yararli` süzgeciyle belirlenecektir.

## Lighthouse (mobil, 12 anahtar sayfa)

Lighthouse 12.8.2, varsayılan mobil öykünme ve benzetimli kısıtlama, Playwright Chromium. Ölçüm, hasat motoru
ve yerel sunucu aynı makinede çalışırken yapılmıştır. Bu nedenle TBT değerleri canlı ortama göre şişkin olabilir;
G13 ve G25 aynı makinede aynı koşullarla karşılaştırır.

| Sayfa | Adres | Perf. | Erişil. | En iyi uyg. | SEO | LCP | TBT | CLS | Aktarım |
|---|---|---|---|---|---|---|---|---|---|
| ana sayfa | `/` | 28 | 94 | 100 | 100 | 8,7 sn | 47.729 ms | 0 | 1.067 KB |
| makale | `/makale-oku/ARABULUCULUK/arabuluculuk an` | 37 | 94 | 100 | 92 | 5,9 sn | 8.794 ms | 0 | 809 KB |
| mevzuat madde | `/mevzuat/tck/madde-81` | 87 | 91 | 100 | 100 | 1,3 sn | 500 ms | 0 | 41 KB |
| şerhli madde | `/mevzuat/tbk/madde-49` | 64 | 91 | 100 | 100 | 2,5 sn | 1.631 ms | 0 | 57 KB |
| rehber | `/rehber/kidem-tazminati` | 25 | 96 | 100 | 100 | 18,4 sn | 34.027 ms | 0,012 | 1.235 KB |
| ders notu hub | `/ders-notlari` | ölçülemedi (240 sn zaman aşımı) | | | | | | | |
| ders notu | `/ders-notlari/afyon/borclar-genel-donem-` | ölçülemedi (240 sn zaman aşımı) | | | | | | | |
| hesaplama | `/hesaplama/kidem` | 43 | 96 | 100 | 100 | 5,8 sn | 5.683 ms | 0 | 767 KB |
| yargı arşivi | `/yargi-kararlari` | 31 | 96 | 100 | 100 | 5,8 sn | 7.922 ms | 0,011 | 1.261 KB |
| kavram | `/kavram/kidem-tazminati` | 59 | 94 | 100 | 100 | 5,2 sn | 816 ms | 0 | 1.251 KB |
| bölge | `/ercis-avukat` | 58 | 96 | 100 | 100 | 5,3 sn | 937 ms | 0 | 789 KB |
| yazar | `/avukat-fethi-guzel` | 36 | 96 | 100 | 100 | 7,2 sn | 3.220 ms | 0 | 1.289 KB |
| **Ortalama (10 sayfa)** | | **47** | **94** | **100** | **99** | | | | |

- Performans asıl sorundur (ortalama 47, hedef ≥ 90). İçerik ağırlıklı sayfalarda (ana sayfa, rehber, yargı
  arşivi, makale) ana iş parçacığı uzun süre meşgul kalıyor; TBT 5–48 sn, aktarım 0,8–1,3 MB. Hafif sayfalar
  (madde 41 KB, P 87) hedefe yakındır. Kök neden analizi G13'e aittir (JS paketi, GSAP, istemci tarafı veri).
- Ders notu hub'ı ve ders notu sayfası 240 sn içinde ölçülemedi. Taramadaki 410 KB'lık HTML ve 3 sn'lik sunucu
  yanıtıyla birlikte değerlendirildiğinde bu sayfalar en ağır gruptur (G11, G13).
- Erişilebilirlik 91–96: Renk kontrastı 10 sayfanın 10'unda başarısız; başlık sırası 4, atlama bağlantısı 1,
  etiket-ad uyuşmazlığı 1 sayfada (G15, G24).
- SEO 92–100: Yalnız makale sayfasında `robots-txt` denetimi başarısız (o koşuda robots.txt okunamamış olabilir;
  diğer 9 sayfada geçti). Yerel ölçümde sayfa kökeni `localhost` olduğundan Lighthouse'un canonical denetimi
  canlı alan adına göre anlamlı sonuç vermez; S1 bu yüzden taramayla ölçülmüştür.

## Öncelik ve görev eşlemesi

| Bulgu | Görev |
|---|---|
| S1, S2, S3, S4, S8, S5'teki `/pdf` 500 ve site haritası bağlantısı | **G06b (yeni, hemen)**: küçük kapsamlı, etkisi yüksek |
| S5 ders notu kırık bağlantıları, S6 | G11 (dizin mimarisi) |
| S6 kalan, Lighthouse performansı | G13 |
| S7, S10 | G10 |
| S9 | G12 |
| S10 LegalService | G07 |
| S11 | G14 |

## G06b sonucu (2026-10-02)

Aynı betik yeni derlemede yeniden koşuldu (ham veri commit'lenmedi; `logs/g06b-seo-tara.json`).

| Ölçüt | G06 | G06b |
|---|---|---|
| Canonical başka adresi gösteren | 60 / 307 | **0 / 307** |
| Varsayılan başlık/açıklama tekrarı | 39 sayfa | **0** |
| Site haritasında 200 dışı yanıt | 1 (307) | **0** |
| `sitemap-index.xml` alt haritaları | 3 / 3 × 404 | **5 / 5 × 200** |
| Açıklama > 165 karakter | 84 | 46 |
| Başlık > 65 karakter | 125 | 148 (yeni kategori başlıkları; taramadan sonra kısaltıldı) |
| Kırık iç bağlantı (600) | 18 | 18 (S5, G06b adım 5 ve G11) |

Değişiklikler: Kök yerleşimden `alternates` kaldırıldı. Yedi rotaya başlık, açıklama ve kendi canonical'ı
eklendi; istemci bileşeni olan iki sayfa için `layout.tsx` açıldı. Dört dosyada www'siz canonical düzeltildi.
`sitemap-index.xml` robots.txt'deki beş haritaya göre yeniden yazıldı. `/ingilizce-avukat` kalıcı (308) yapıldı
ve site haritasından çıkarıldı. Kaynak düzeyindeki kilit testleri: `lib/__tests__/seo-metadata.test.mjs`.

