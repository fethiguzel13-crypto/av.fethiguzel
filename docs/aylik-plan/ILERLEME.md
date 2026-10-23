# İlerleme günlüğü — Aylık Mükemmellik Planı

Her oturum sonuna bir blok ekler. En yeni en altta.

---

## 2026-09-30 — Kurulum (etkileşimli oturum)

- Push kilidi: `.git/hooks/pre-push` 2026-10-30'a kadar push'u reddediyor (deneme push'u reddedildi).
- Yerel başlangıç commit'leri: `ddf040d00` (hasat motoru v2), `1bf739421` (bekleyen ders notu dalgaları).
- Hasat motoru: captcha mandalı eklendi (captcha geldiği hızın %85'i, 24 saat tavan; yeniden
  başlatmada korunur). 4 günde 30 captcha görülmüştü (5,5–8/dk). Motor 4,7/dk tavanla yeniden başladı.
  Arşiv 101.920 karar; emsal ve benzersiz 32.394.
- Tarama bulguları: npm audit (site) 1 kritik + 7 yüksek; CSP başlığı yok; 11.623 ders notunun çoğu
  şablon katmanında; mobil audit temiz; anahtar deposu dosyaları `.gitignore`'da.
- Plan: `docs/aylik-plan/PLAN.md` (G01–G26). Otonom çalışma: `scripts/otonom/calis.ps1` +
  `FethiGuzel-OtonomCalisma` görevi.
- Sıradaki: G01 Kalite kapısı.

## 2026-09-30 17:10 — G01 Kalite kapısı (etkileşimli oturum) — TAMAM

- `npm run kalite:hizli` (tip + lint cırcırı + 9 test takımı): 466 test yeşil, 48 sn.
- `npm run kalite` (+ `next build`): yeşil, derleme 504 sn.
- Düzeltmeler: sosyal yazarlarda LLM bağımlılık enjeksiyonu (testler gerçek API çağırıyordu), galaxy
  testleri katalog v2 sözleşmesine; lint kapsamı derleme çıktısı/eski betikler dışında, 82 bilinen hata
  `scripts/lint-taban.json` tabanında (cırcır).
- Rapor: `raporlar/kalite-baslangic.md`. Commit: `26f10a3c4`.
- Sıradaki: G01b (lint borcu — önce 3 rules-of-hooks), sonra G02 (bağımlılık açıkları).

## 2026-10-01 10:40 — G02 + G03 (etkileşimli oturum) — TAMAM · ACİL BULGU

- **ACİL (G00):** Canlı site kapalı — avfethiguzel.com ve www'deki tüm adresler (robots.txt, sitemap,
  API) Vercel'den `402 Payment required / DEPLOYMENT_DISABLED` dönüyor. Ödeme ya da kullanım limiti;
  kullanıcı Vercel panelinden çözmeli. jsDelivr/GitHub içerik paketleri çalışıyor (mobil çevrimdışı içerik
  ayakta; üyelik ve sunucu API'leri kapalı).
- G02: next 16.2.5 → 16.3.8 (kritik açık), npm audit fix; adm-zip devDependencies 0.6.1. `npm audit`:
  1 kritik + 8 yüksek → **0**. Commit `9e567a3ec`.
- G03: `lib/guvenlik-basliklari.mjs` (CSP + başlıklar, 8 test), `lib/json-ld.ts` (`</script>` kaçışına
  karşı; 21 dosyada 34 kullanım). `scripts/csp-dogrula.mjs` derlenmiş siteyi Chromium'la gezdi:
  15 sayfada CSP ihlali yok. Commit `4ca4b3fde`.
- Yeni bulgu (G03b): `/ara?q=kira` derlenmiş sitede React #418 hydration hatası.
- Otonom çalıştırıcı: uykudan uyanınca ağı 5 dk bekliyor (09:18 oturumu ENOTFOUND ile düşmüştü). `7fde4307e`.
- Hasat: 103.062 karar; 09:55–10:19 yerel internet kesintisinde devre kesici doğru bekledi.
- Sıradaki: G01b (lint borcu), sonra G03b, G04.

## 2026-10-01 14:30 — G00 maliyet düzeltmeleri + G03b (etkileşimli oturum)

- **Önden yükleme fırtınası (G00):** madde sayfaları rota işleyicisi; next/link görünür madde bağlantılarına
  `?_rsc=` isteği atıyordu (CDN'i deler, fonksiyon çağrısı): /mevzuat/tbk 84, /ara 25, /mevzuat 10.
  `components/SiteLink` (madde yollarında düz `<a>`) 73 dosyada next/link'in yerine geçti → 8 sayfada 0.
  `5ffe31209`. Denetim: `scripts/dogrula-onyukleme.mjs`.
- **Tam metin indeksi (G00):** /mevzuat ve /ara her açılışta 8,9 MB indeks indiriyordu → yalnız arama yapılınca.
  `a33f0aa67`. Denetim: `scripts/dogrula-arama.mjs` (7/7).
- **G03b:** /ara hydration hatası (#418) giderildi (ilk çizim statik HTML ile aynı). `a33f0aa67`.
- Temizlik: kullanılmayan 9 bileşen silindi, 25 MB PNG `docs/gorsel-arsiv/`'e; lint 82 → 65. `3b8649ce7`.
- Raporlar: `raporlar/vercel-kullanim.md`, `raporlar/kullaniciya-sorular.md` (4 soru; biri erken yayın).
- Kalite: 476 test, CSP 15/15, derleme yeşil. Canlı site hâlâ 402.
- Sıradaki: G01b (kalan 65 lint hatası), G04 (API güvenlik).

## 2026-10-01 12:14–18:59 — G01b + G00 ISR + G04 (kayıt sonradan eklendi)

Bu blok 23:00 oturumunda commit'lerden yeniden kuruldu; önceki oturumlar ILERLEME'ye yazmadan bitmişti
(G04 oturumunun PLAN.md işaretlemesi commit'lenmemiş duruyordu, bu oturum commit'ledi).

- **G01b — TAMAM:** lint 82 → 15 (`b030477ff`) → 8 (`3018624b6`; `lib/tarayici.ts` useSyncExternalStore).
  Kalan 8 `set-state-in-effect` gerekçeli (PLAN.md G01b).
- **G00 (ajan payı):** karar sayfaları ISR, madde 404/308 yanıtları CDN önbelleğinde (`752eb05ee`).
  Otonom çalıştırıcı saatlik tetik + limit yenilenince tek seferlik oturum (`fbc9fd669`).
- **G04 — TAMAM:** 10 bulgu kapandı (ödeme dönüşü tekrarı, sır eksikken sahte çerez, girdi sınırları,
  yönetici çerezi HMAC, köken denetimi, çok örnekli depo, iç hata sızıntısı/edge, pack-health,
  content-pack Host, arşiv deneme sınırı). `test:uyelik` 27 → 61; toplam 510 test; `npm run kalite`
  yeşil. Commit `8a625ea35`. Rapor `raporlar/guvenlik-api.md`; kullanıcı soruları 5–6.
- Sıradaki: G05 (mobil uygulama güvenliği).

## 2026-10-01 23:00 — G05 Mobil uygulama güvenliği (başsız oturum) — TAMAM

- Önce önceki oturumların eksik kaydı yazıldı ve G04'ün commit'lenmemiş PLAN.md işareti commit'lendi (`8df9aaec3`).
- **M1 (orta):** Play inceleme kodu `uyelik.ts`'de düz metindi; GitHub deposu herkese açık (API 200) ve kod
  `origin/main`'de → kodu okuyan herkes ücretli arşivin tam metnini açabiliyordu. Pakete artık yalnız tuzlu
  SHA-256 özeti giriyor (`lib/inceleme.mjs`); kod git dışı `mobile/inceleme-kodu.local.txt`'de (yeni, 80 bit).
- **M2 (düşük):** FileProvider tüm ortak depolama → uygulamanın Pictures klasörü.
- M3 (sunucu tarafı abonelik doğrulaması yok), M4 (yedekleme kuralları Android sürümüne göre farklı), M5 (sürümde
  lint kapalı) raporda; kullanıcı soruları 7–9. G26'ya Play inceleme metni notu.
- Testler: `mobile/scripts/__tests__/guvenlik.test.mjs` 16 test (önce kırmızı). `kalite:hizli` 526 test yeşil.
  Arayüz derlemesinde özet var, düz kod yok; `smoke-ui` inceleme kodu adımı geçti.
- Ayrı bulgu (G14'e not): `mobile/data-src/icthat/archive.json.gz` konu zenginleştirmesi olmadan üretilmiş;
  `smoke-ui` arşiv konu başlığı ve arama hızı adımlarında kırmızı (G05 ile ilgisiz). Kalite kapısı
  `public/priority-sitemap.xml`'i yalnız satır sonu farkıyla yeniden yazıyor; geri alındı.
- Commit `96947f660`. Rapor `raporlar/guvenlik-mobil.md`.
- Sıradaki: G06 (SEO ve performans başlangıç ölçümü).

## 2026-10-01 23:30 – 2026-10-02 06:40 — G06 TAMAM, G06b DEVAM EDİYOR (aynı başsız oturum)

Not: Derleme sırasında makine uykuya geçti (derleme adımı 23.332 sn göründü); etkin çalışma süresi ~2 saattir.
110 dakika kuralı gereği uyanıştan sonra yeni iş başlatılmadı, yalnız süren doğrulama bitirildi.

- **G06 — TAMAM** (`fde44e067`): `scripts/seo-tara.mjs` (robots → site haritaları → grup başına 25 örnek, 308 sayfa;
  600 iç bağlantı) ve `scripts/lighthouse-olc.mjs` (12 anahtar sayfa, mobil). Saf işlevler `scripts/lib/seo-analiz.mjs`
  (10 test). Rapor `raporlar/seo-baslangic.md` + JSON. Bulgular: canonical 60/307 yanlış (41'i ana sayfa: kök
  `alternates` mirası; 19'u www'siz), 39 sayfada varsayılan başlık, `sitemap-index.xml` 404 haritaları gösteriyor,
  kırık iç bağlantı %3, ders notu HTML medyanı 410 KB. Lighthouse (10 sayfa) P 47 · E 94 · İ 100 · S 99; iki ders
  notu sayfası 240 sn'de ölçülemedi. Ölçüm tablosunun başlangıç sütunu dolduruldu.
- **G06b — DEVAM EDİYOR** (`b1417987f`): kök canonical kaldırıldı, 7 rotaya metadata, 4 dosyada www'siz canonical,
  `sitemap-index.xml`, `/ingilizce-avukat` 308. 6 test (önce 5 kırmızı). Yeni derlemede `seo-tara`: canonical uyumsuz
  60 → 0, başlık tekrarı 39 → 0, haritada 200 dışı 0.
- Kalite: `npm run kalite` (derleme dahil) 542 test yeşil. Derlemenin yeniden ürettiği zaman damgalı 5 dosya geri alındı.
- Sıradaki: G06b adım 5 — `/ders-notlari/<üni>/<ders>/pdf` 500 (3 örnek, `gorevler/G06b.md`) için sistematik hata
  ayıklama ve `/site-haritasi` Türkçe karakterli bağlantı; sonra G07 (reklam yasağı uyumu).

## 2026-10-02 07:00–07:35 — G06b TAMAM (başsız oturum)

- **`/pdf` 500:** Rota `generateStaticParams` ile çalışma anında statik üretiliyor, `searchParams` okuyordu →
  `DYNAMIC_SERVER_USAGE`; tüm PDF adresleri (var olmayan notlar dahil) 500. `?print=1` istemciye taşındı.
- **`/site-haritasi` bağlantısı:** sınıf sorunu çıktı. Türkçe karakterli slug'lı 8 rehber derlemede 404 üretiliyordu
  (Next segmenti kodlu iletiyor, `/bilgi/[slug]` çözmüyordu). Kategori sayfasının düzeni: çöz + canonical/og ve üç
  harita üreticisinde kodla. Adresler değişmedi.
- Testler +4 (önce kırmızı); derleme yeşil; `kalite:hizli` 546 test yeşil; `seo-tara` 307/307 sayfa 200, canonical
  uyumsuz 0, kırık bağlantı 14/600 (hepsi ders notu hub'ı → G11). Commit `60e2f5d7f`.
- Yan bulgular PLAN.md'ye not edildi: başlıkta çift "| Av. Fethi Güzel" eki 63/307 (G10); `yapı-ruhsati-nedir`
  dizine açık ama haritada yok (G11).
- Not: TaskStop Windows'ta `next start` alt sürecini kapatmıyor; port sahibini `Get-NetTCPConnection` ile bul.
- Sıradaki: G07 (avukatlık reklam yasağı uyum denetimi).

## 2026-10-02 07:35–07:45 — G07 TAMAM (aynı başsız oturum)

- Ölçüt metinleri mevzuat.gov.tr'den okundu: Avukatlık Kanunu m.55, m.135/2-a (7571 s.K., 24/12/2025); TBB Reklam
  Yasağı Yönetmeliği m.6, m.7/1-c/d/e, m.11, m.12/A (RG 9/8/2024 ve 2/5/2026 değişiklikleri). m.7/1-e arama motorunda
  üst sıraya yönelik anahtar sözcük ve **sayfa adresini** yasaklıyor; sitenin asıl riski yapısal.
- Düzeltildi: 5 "yer + avukat" anahtar sözcüğü, 4 mağaza imzası, LegalService `priceRange`, SSS'de "dünyanın en iyi"
  cümlesi. Kilit testi `lib/__tests__/reklam-uyum.test.mjs` (3, önce kırmızı). `kalite:hizli` 549 test yeşil.
- Kullanıcıya (soru 10–13, G26'ya bağlı): 12 `*-avukat` bölge sayfası + `english-speaking-lawyer` adresleri, her
  sayfadaki LegalService (`areaServed`, `OfferCatalog`), "Avukat & Arabulucu" sıfatı, içerik sayfalarındaki ön form
  çağrısı. Yanıta kadar dokunulmadı (30 Ekim'e kadar yayın yok). PLAN.md genel kurallarına SEO sınırı eklendi.
- Commit `d475546f1`. Rapor `raporlar/reklam-uyum.md`.
- Sıradaki: G08 (bu haftanın hasat bakımı henüz yapılmadı), ardından G09.

## 2026-10-02 07:50 — G08 hasat bakımı (Hafta 1)

- `yargi:hasat-durum`: motor çalışıyor (22,5 sa), son 1 saatte 429/ağ hatası 0, hız tavanda 4,7/dk, son captcha 11,7 sa
  önce, kalıcı hata 160. Emsal ve benzersiz 34.894 (G06: 32.394). Disk C 45 GB boş. Düzeltme gerekmedi.
- Satır `raporlar/hasat-haftalik.md`'ye yazıldı (dosya bu hafta açıldı). Sıradaki: G09 (yazar/avukat kimliği).

## 2026-10-02 16:11–16:55 — G09 TAMAM (başsız oturum)

- Devralma: 07:00 oturumu G09 alt planını, testi ve `lib/yazar.ts`'i 07:47'de yazıp kullanım sınırına (429) takılmıştı;
  dosyalar commit'siz, ILERLEME kaydı yoktu. Döküm sonu doğrulanıp iş sürdürüldü. 07:27'den kalan sahipsiz
  `next start -p 3123` durduruldu. OTONOM.md teknik tuzaklarına iki madde eklendi (erken "DEVAM EDİYOR" işareti, CRLF).
- **Person tek kaynak** (`f623394e0`): kök düğüm `yazarPersonDugumu()`, 16 kopya `yazarRef()` (`@id` = `/#person`);
  `[category]` sayfalarının yeniden yazdığı unvan ve adres kalktı. Test 3 (önce kırmızı).
- **Yazar kutusu** (`a077e5265`): `components/YazarKutusu.tsx` makale, rehber, ders notu, karar analizi, kavram; madde
  sayfası `yazarKutusuHtml()` (yalnız şerh varken, kaynak mevzuat.gov.tr). Kaynakları kendi bölümünde gösteren
  türlerde liste tekrarlanmadı. Bileşen testi gerçek `.tsx`'i çizer (`lib/__tests__/tsx-hooks.mjs`). Test 13 (önce kırmızı).
- Kalite: `npm run kalite` (derleme dahil) 564 test yeşil; son `kalite:hizli` 565. Yerel sunucu ölçümü: 9 sayfa türünde
  tüm Person düğümleri `@id`'li, kutu 5 türde görünür. Karar analizi (`/icthat/[id]`) yerelde ölçülemedi: analiz
  verisi yalnız uzak dalda üretiliyor; yerleşim testle sabit. Ekran görüntüleri `raporlar/gorsel/g09-*.png`.
  Derlemenin zaman damgalı 4 dosyası geri alındı. TestSprite: değişiklik yayında değil (30 Ekim), doğrulanmadı.
- Kullanıcıya soru 14: baro/sicil, başlama yılı, doktora üniversitesi, ORCID vb. sitede yok, uydurulmadı.
- G10'a not: yazar sayfası ve `english-speaking-lawyer` kişiyi ayrıca `Attorney` olarak basıyor; `/icthat/[id]`
  JSON-LD'siz ve başlıkta çift ek; `/makale-oku/*` Article şemasız.
- Sıradaki: G10 (yapılandırılmış veri; G06 ve G09 bitti).

## 2026-10-02 16:55 — G10 DEVAM EDİYOR (başladı 16:55, aynı başsız oturum)

- Alt plan `gorevler/G10.md`; adım 1 (çift marka eki, 402/915 derlenmiş sayfa) üzerinde çalışılıyor.
- 22:00 devralma: 16:55 oturumu 17:16'da kullanım sınırıyla (429) kesildi (döküm sonu doğrulandı); adım 1–2 ve adım 3'ün
  `/icthat/[id]` kısmı commit'li (`2d877704d`, `fb2363934`, `de73c9356`). Sürdürülüyor: adım 3 `/makale-oku/*`.
- 2026-10-03 05:55 devralma: 22:00 oturumu adım 3–5'i commit'ledi (`a0ecb92b5`, `a0a0f5e6c`, `db8a9a970`), kabul için
  başlattığı `npm run kalite` derleme adımında kesildi (döküm 22:16'da bitiyor). Sürdürülüyor: tam kalite + kabul ölçümü.

## 2026-10-03 05:55–06:30 — G10 TAMAM (başsız oturum)

- 22:00 oturumunun işleri (adım 3 `/makale-oku/*` ScholarlyArticle + yol geçişi, adım 4 madde JSON-LD kaçışı,
  adım 5 FAQPage görünürlüğü) commit'liydi; kesilen kabul ölçümü tamamlandı.
- `npm run kalite` (derleme dahil) yeşil: 591 test, derleme 898 sn. Derleme taraması: 915 sayfa, başlıkta çift marka
  eki 0 (G06b'de 402); 4.547 JSON-LD bloğu, alan ve FAQPage görünürlük ihlali 0. Zaman damgalı 4 dosya geri alındı.
- Soru 15 (makale başlık ve künyeleri) `raporlar/kullaniciya-sorular.md`'de. TestSprite: değişiklik yayında değil
  (30 Ekim), doğrulanmadı.
- Sıradaki: G11 (ders notları dizin mimarisi; G06 bitti).

## 2026-10-03 06:27 — G11 DEVAM EDİYOR (başladı 06:27, aynı başsız oturum)

- Alt plan `gorevler/G11.md`; adım 1 (dizin karar işlevi) üzerinde çalışılıyor.
- 2026-10-05 11:00 devralma: 06:27 oturumu adım 1–5'i commit'ledi (`cfd604a9a`, `da8479261`), adım 6'yı (rehber seçimi
  tek kural, `lib/vatandas-rehberi/sec.mjs`) yazıp test 13/13 yeşil gördü; başlattığı `npm run kalite` derleme adımında
  06:48'de kesildi (makine kapandı; hasat günlüğü de aynı dakikada duruyor). Sürdürülüyor: adım 6 commit + adım 7.

## 2026-10-05 11:00 — G08 hasat bakımı (pazartesi) + G11 TAMAM (başsız oturum)

- **G08:** motor çalışıyor (10:23'te yeniden başladı), son 1 saatte 160 karar, 429 ve ağ hatası 0, hız 3,5/dk (mesai
  tavanı), 10:42'de bir captcha (526 sn mola, kendiliğinden toparladı). Emsal ve benzersiz 36.159 (geçen hafta
  34.894), disk C 43 GB boş. 3 Ekim 06:48 – 5 Ekim 10:23 arası makine kapalıydı: ne hasat ne otonom oturum çalıştı.
  Düzeltme gerekmedi; satır `raporlar/hasat-haftalik.md`'de.
- **G11 adım 6** (`2ead32620`): devralınan rehber seçimi tek kuralı sayfanın yedek yolunu kapsamıyordu; kalıp metni
  parmak izi eşiğinin altında kalan 3 rehber dizinde ama haritada yoktu. Sayfa robots kararını yalnız
  `getGuidePageState()`'ten alıyor. Gerçek veride 579 rehber: 556 dizinde ve haritada, 23 noindex, ayrışan 0. Test +3
  (önce kırmızı).
- **Kabul:** `npm run kalite` (derleme dahil) yeşil, 616 test, derleme 771 sn. `next start`'ta 13 örnek adres doğru robots
  ve kendi canonical'ı; ders notu haritası 28, rehber haritası 557 adres; elle yazılan 33 rehber dizinde ve elle yazılan
  sürümle. Önce/sonra tablosu `gorevler/G11.md`'de. Zaman damgalı 3 dosya geri alındı. TestSprite: değişiklik yayında
  değil (30 Ekim), doğrulanmadı.
- OTONOM.md teknik tuzaklarına iki madde (derleme sürerken büyük klasör listeleme; makine kapanınca kesinti).
  PLAN.md G12'ye not: rehberin "ilgili rehberler" bloğu yayından düşen 23 rehbere de bağlanıyor.
- Sıradaki: G12 (iç bağlantı ağı; G11 bitti). G13 (performans) da bağımlılığı bitmiş durumda.

## 2026-10-05 11:37 — G12 DEVAM EDİYOR (başladı 11:37, aynı başsız oturum)

- Alt plan `gorevler/G12.md`; adım 1 (kırıntı işlevi ve bileşeni) üzerinde çalışılıyor.
- 16:00 devralma: 11:37 oturumu adım 1–4, 6 ve adım 3'ün devamını commit'ledi (`6d8f4f98a` … `afae83e1c`), son derlemesi
  (12:27, `afae83e1c` sonrası) ve iki taraması geçti (915 sayfa, çift marka eki 0, 4.856 JSON-LD bloğu); 12:30'da oturum
  sınırıyla kesildi (döküm sonu doğrulandı), `G12.md` ilerleme notu commit'siz kaldı. 13:00, 14:00 ve 15:00 oturumları
  açılır açılmaz `rate_limit` ile bitti. Sürdürülüyor: kalan sayfalar, adım 5 (tarama kuralı), adım 7–8.
- 21:00 devralma: 16:00 oturumu adım 3 kalanı + adım 5, 6 devamı, 7, 8 ve bağlantı düzeltmelerini commit'ledi
  (`538757742` … `f798703a0`); arka planda başlattığı tam `npm run kalite` 16:46'da oturum sınırıyla süreç öldürülünce
  her adımda 0 sn KIRIK kaldı (gerçek hata değil). 17:00–20:00 oturumları `rate_limit` ile açılır açılmaz bitti. Sürdürülüyor:
  adım 9 (tam kalite, derleme taraması, `next start` örnekleri, rapor).
- 22:00 devralma: 21:00 oturumu iki düzeltmeyi commit'ledi (`c12a42420`, `6607ebc25`; `kalite:hizli` 707 test yeşil) ve
  21:33'te tam `npm run kalite`'yi arka planda başlatıp turu bitirdi; başsız süreç kapanınca kapı öldü (`logs/kalite-son.json`
  tip sonrası her adım 0 sn, çıkış kodu 3221225794). Sürdürülüyor: adım 9 (tam kalite yeniden, tarama, örnekler, rapor).

## 2026-10-05 22:00 — G12 TAMAM (başsız oturum)

- Tam `npm run kalite` yeniden: yeşil, 707 test, derleme 366 sn. Derleme ölçümünde (dizine açık 800 sayfa, 68.899 iç
  bağlantı) `/site-haritasi`'nın noindex AYBÜ ve Marmara fakülte sayfalarına bağlandığı çıktı; `747afd489` listeyi
  `hubDizinde`'den türetir (test önce kırmızı). Sonra tam kapı yine yeşil: 708 test, derleme 453 sn, 799 sayfada kırıntı kuralı.
- `next start`'ta 12 örnek adres: tek BreadcrumbList, görünür kırıntıyla aynı basamak; madde, rehber, hesaplama ve temsilci
  notta ilgili içerik bloğu; büyük harfli madde adresi sayfalarda ve `sitemap.xml`'de 0.
- Rapor `gorevler/G12.md` sonunda (önce/sonra tablosu). Kalan 208 kapalı hedef iki ders notu gezinme listesinden; G11
  gereği okunur sayfalar, bilinçli istisna, soru 17. Ana sayfadaki örnek karar bağlantısı (noindex) ve madde ↔ karar
  bağlantısı PLAN.md G14'e not. Zaman damgalı 4 dosya geri alındı. TestSprite: değişiklik yayında değil (30 Ekim), doğrulanmadı.
- OTONOM.md: sahte KIRIK tuzağına neden eklendi (başsız oturum arka plan işini bekletmeden turu bitirince iş ölür).
- Sıradaki: G13 (performans; G06 bitti). G14 (bağımlı G04) da açık.

## 2026-10-05 22:48 — G13 DEVAM EDİYOR (başladı 22:48, aynı başsız oturum)

- Alt plan `gorevler/G13.md`; adım 1–2 (bugünkü ölçüm, kök neden profili) üzerinde çalışılıyor.
- 2026-10-06 06:00 devralma: 22:00 oturumu adım 2 profilini (ana sayfa ve rehber; uzun görev, ağ, rAF) çıkarıp Footer harita
  ertelemesini TDD ile yazdı (`components/ErtelenmisHarita.tsx`, `lib/__tests__/performans.test.mjs` 2/2 yeşil), "önce" ekran
  görüntüsünü alırken 22:44'te kesildi (hasat günlüğü 22:44 → 05:44 boş; makine kapalı, `rate_limit` yok). Adım 1 ölçümü
  (`lighthouse-g13-once.json`) alınmamış. Sürdürülüyor: önce ölçümü eski derlemeyle, harita commit, adım 3 kalanı.
- 11:00 devralma: 06:00 oturumu adım 1 ölçümünü (`lighthouse-g13-once.json`, ortalama P 63) ve adım 2 kök neden tablosunu çıkardı,
  adım 3'ün altı düzeltmesini TDD ile yazdı (`performans.test.mjs` 9 test), tam `npm run kalite`'yi 06:37'de yeşil bitirdi
  (717 test, derleme 549 sn) ve "sonra" ekran görüntülerini aldı; 06:40'ta `rate_limit` ile commit'siz kesildi (döküm sonu
  doğrulandı). 07:00–10:00 oturumları açılır açılmaz `rate_limit` ile bitti. 11:00: `kalite:hizli` yeniden yeşil (717 test),
  düzeltmeler dört commit (`685264c91`, `f65bae38e`, `0f20de3ee`, `2510595c4`). Sürdürülüyor: adım 4–7.

## 2026-10-06 11:00 — G13 DEVAM EDİYOR (başsız oturum)

- Devralma: 06:00 oturumunun commit'siz bıraktığı adım 3 (06:37'de tam kalite yeşil) `kalite:hizli` ile yeniden doğrulandı
  (717 test) ve düzeltme başına dört commit'e ayrıldı (`685264c91`, `f65bae38e`, `0f20de3ee`, `2510595c4`; belgeler `c64f10aca`).
- Adım 4 `099271adf`: elle yazılan 25 rehber derlemede üretiliyor (579/579). Adım 5 `54fdeaf99`: `/images` ve `/bolge` bir gün
  önbellekte kalıyor. Adım 6 `4d8689077`: derleme taramasına ilk yük betik bütçesi eklendi (dokuz sayfa, taban yalnız düşer).
  Her adımda test önce kırmızı yazıldı.
- Adım 7: sonra ölçümü ders notunda CLS gerilemesi (0 → 0,137) buldu. Kaynak Plex Mono'nun önden yüklenmemesiydi.
  `4efec57b0` ile CLS 0,0003'e indi. Tam `npm run kalite` iki kez yeşil (725 test, derleme 469 ve 372 sn). Lighthouse ortalama
  P 63 → 77, aktarım her Next sayfasında düştü. Ancak TBT makine yükü altında tek koşuda çok oynak (ders notu 774–3.175 ms).
  Yargı arşivi ve ders notu için "gerileme yok" kabulü gösterilemediğinden G13 kapatılmadı. Rapor ve tablo `gorevler/G13.md`
  sonunda (`755d64cf7`).
- 06:38'den kalan `next start` 3123'ü tutup eski derlemeyi sunuyordu. Durduruldu ve OTONOM.md'ye tuzak olarak eklendi.
  Kendi sunucum kapatıldı. Zaman damgalı dosyalar geri alındı. TestSprite: değişiklik yayında değil (30 Ekim), doğrulanmadı.
- Sıradaki: `lighthouse-olc.mjs`'e `--tekrar=3` (ortanca) eklenecek, önce ve sonra aynı yöntemle yeniden ölçülecek. Ardından
  Next sayfalarındaki 4–5 sn'lik LCP evresi çözümlenecek. G13 bitince PLAN.md'ye ölçüm tablosu yazılacak.

## 2026-10-06 13:00 — G13 DEVAM EDİYOR (başsız oturum)

- `1de6478d4`: `lighthouse-olc.mjs --tekrar=N` (sayfa başına ortanca). Sonra ölçümü 11:47 derlemesiyle başladı; önce derlemesi
  (`d077adb85` kaynakları) ana ağaçta geçici olarak kurulacak. Kesilirse: `git status`ta değişen app/components/lib dosyaları
  önce derlemesi içindir, `git checkout HEAD -- <yol>` ile geri alınır.
- 13:00–14:45 devam: sonra derlemesi `--tekrar=3` ile ölçüldü (`lighthouse-g13-sonra-ortanca.json`). Makine yükü yüzünden ardışık önce/sonra
  karşılaştırılamadı (değişmeyen madde sayfası TBT 425 ↔ 194 ms). `3cce9237e` dönüşümlü ölçümü (`--karsi`, `OLCUM_DIST_DIR`) ekledi.
  Önce derlemesi geçici geri alınan 13 kaynak dosyayla kuruldu (`app/bilgi/[slug]/page.tsx`, `app/globals.css`, `app/layout.tsx`,
  `components/{About,Articles,DailyNewsCards,Footer,Hero,MobileBottomNav}.tsx`, `lib/guvenlik-basliklari.mjs`,
  `lib/vatandas-rehberi/{published.ts,sec.mjs}`, `next.config.ts`). Kaynaklar HEAD'e döndü, önce derlemesi silindi, `.next` yine 11:47 derlemesi.
- Dönüşümlü sonuç (4 sayfa, 3+3 koşu): aralık ölçütüne göre gerileme yok. FCP, hız indeksi ve aktarım dördünde iyileşti. TBT ortancası
  üç Next sayfasında yükseldi, FCP kazancıyla aynı yönde (pencere kayması varsayımı, kanıtlanmadı). Tablo `gorevler/G13.md` sonunda.
- `kalite:hizli` iki kez yeşil (728, sonra 731 test). Tam kapı bugün 11:49'da yeşildi. Kendi sunucularım (3123, 3124) kapatıldı.
  Zaman damgalı `priority-sitemap.xml` geri alındı. TestSprite: değişiklik yayında değil (30 Ekim), doğrulanmadı.
- Sıradaki: `anaIsMs` ile dönüşümlü ölçüm (adımlar G13.md sonunda), sonra kabul kararı. G13 DEVAM EDİYOR.

## 2026-10-06 16:00 — G13 DEVAM EDİYOR (başsız oturum, başladı 16:00)

- Devralma: 13:00 oturumu 14:34'te, 15:00 oturumu açılışta `rate_limit` ile kesildi (döküm sonları doğrulandı). Commit'siz
  kalan G13 belgeleri `812b37aec`, `anaIsMs` aralığı ve gerileme denetimi `414992c13` (test önce kırmızı, `kalite:hizli` 732 test).
- Önce derlemesi `.next-once` klasörüne kuruluyor: 13 kaynak dosya geçici olarak `d077adb85` sürümünde (`next.config.ts` ona ek
  `OLCUM_DIST_DIR` satırıyla). Kesilirse: `git checkout HEAD -- app components lib next.config.ts tsconfig.json` ve `.next-once` silinir;
  `.next` 11:47 sonra derlemesidir, dokunulmaz.
- 16:26: önce derlemesi kuruldu (`.next-once`, 918 sayfa), kaynaklar ve `tsconfig.json` HEAD'e döndü. Sunucular: 3124 önce
  (`OLCUM_DIST_DIR=.next-once`, görsel `max-age=0`), 3123 sonra (görsel `max-age=86400`). Dönüşümlü ölçüm başladı
  (`lighthouse-g13-donusumlu-anais.json`). Kesilirse iki portu tutan `next start` süreçleri durdurulur, `.next-once` silinir.
- Sonuç (4 sayfa, 3+3 koşu, tablo `gorevler/G13.md` sonunda): ana sayfada toplam ana iş parçacığı süresi 8,0 → 5,3 sn düştü.
  Yargı arşivinde 4,0 → 5,9 sn arttı ve aralıklar ayrıştı, dolayısıyla pencere kayması varsayımı bu sayfa için çürüdü. Ders notunda
  TBT aralıkları ayrıştı. Kontrol sayfası da sahte gerileme verdi; iki sunucu aynı HTML'i döndürüyordu ve roller ters çevrilince
  fark kayboldu (192 ↔ 189 ms). Yargı arşivi dökümünde artış React çatı parçası ve stil/yerleşimdeydi. Harita elendi (sonrada Google isteği yok).
- Sunucular (3123, 3124) kapatıldı, `.next-once` silindi, `tsconfig.json` geri alındı. `kalite:hizli` 732 test yeşil. TestSprite: değişiklik
  yayında değil (30 Ekim), doğrulanmadı. OTONOM.md'ye kesme işareti tuzağı eklendi.
- Sıradaki: yargı arşivi gerilemesini ikiye bölme (yazı tipi / Footer haritası / alt menü ön getirmesi; adımlar G13.md sonunda). G13 DEVAM EDİYOR.
- 17:00 ikiye bölme (a) başladı: `app/layout.tsx`'te süs ailesinin `preload: false` satırı geçici olarak kaldırıldı, ara derleme
  `.next-ara`. Kesilirse: `git checkout HEAD -- app/layout.tsx tsconfig.json`, `.next-ara` silinir, 3123/3124 süreçleri durdurulur.
- 17:20 (a) sonucu: süs yazı tipi önden yüklendiğinde yargı arşivinin ana iş parçacığı süresi değişmedi (6.250 ↔ 5.838 ms, aralıklar
  örtüşüyor), bu aday elendi (`lighthouse-g13-bolme-a.json`). Kaynak HEAD'e döndü, `.next-ara` silindi, sunucular kapatıldı.
- Sıradaki: ikiye bölme (d) Source Serif 4 Google Fonts stil dosyasını geri ekleyen ara derleme (`f65bae38e` ile kaldırıldı;
  aile yalnız kullanılmayan `.madde-prose` sınıfındaydı), sonra (b) Footer haritası, (c) alt menü ön getirmesi.
  Her aday ~20 dk sürer (derleme 12 dk, 3+3 ölçüm 7 dk). G13 DEVAM EDİYOR.

## 2026-10-06 18:00 — G13 DEVAM EDİYOR (başsız oturum, başladı 18:00)

- 18:03 ikiye bölme (d) başladı: `app/layout.tsx`'e Source Serif 4 stil dosyası ve iki `preconnect` satırı geçici olarak geri
  eklendi, ara derleme `.next-ara`. Kesilirse: `git checkout HEAD -- app/layout.tsx tsconfig.json`, `.next-ara` silinir,
  3123/3124 süreçleri durdurulur.
- 18:19 ara derleme kuruldu, `app/layout.tsx` ve `tsconfig.json` HEAD'e döndü. 3123 sonra (`.next`, 11:47), 3124 ara (`.next-ara`,
  HTML'de Source Serif 4 bağlantısı doğrulandı). Dönüşümlü ölçüm başladı (`lighthouse-g13-bolme-d.json`).
- 18:35 (d) sonucu: stil dosyası geri gelince yargı arşivinde TBT 1.589 → 777 ms indi ve aralıklar ayrıştı, ders notunda fark yok.
  Ayrıntı G13.md sonunda. 3124 kapatıldı, `.next-ara` silindi.
- 18:37 (b)+(c) birlikte başladı: `components/Footer.tsx` ve `components/MobileBottomNav.tsx` geçici olarak `d077adb85` sürümünde
  (dizine de eklendi), ara derleme `.next-ara`. Kesilirse: `git checkout HEAD -- components/Footer.tsx components/MobileBottomNav.tsx
  tsconfig.json`, `.next-ara` silinir, 3123/3124 süreçleri durdurulur.
- 19:09 (b)+(c) sonucu: harita iframe'i ve alt menü ön getirmesi geri gelince yargı arşivinde fark çıkmadı, aralıklar örtüşüyor
  (`lighthouse-g13-bolme-bc.json`). Derleme düşük boş bellekte 26 dk sürdü (OTONOM.md'ye tuzak olarak eklendi).
- Karar: kök neden Google Fonts stil dosyasının kaldırılmasıdır (`f65bae38e`). İlk boyama öne geldiği için TBT penceresi genişledi.
  Değişiklik korundu ve gerekçeli kabul yazıldı (G13.md). Kullanıcıya soru 18 eklendi, PLAN.md G14'e profil notu düşüldü.
- Kaynaklar ve `tsconfig.json` HEAD'e döndü, `.next-ara` silindi, iki sunucu kapatıldı. `kalite:hizli` 732 test yeşil.
  Bu oturumda yalnız belgeler ve ölçüm kayıtları değişti (`d5f34d12a`), zaman damgalı `priority-sitemap.xml` geri alındı. TestSprite: değişiklik yayında değil (30 Ekim), doğrulanmadı.
- Sıradaki: G13 kapanışı. Kalan sekiz sayfa önce derlemesiyle (`.next-once`, `d077adb85` kaynakları) dönüşümlü ölçülür, tablo
  PLAN.md'ye yazılır, tam `npm run kalite` çalıştırılır. G13 DEVAM EDİYOR.

## 2026-10-06 20:00 — G13 DEVAM EDİYOR (başsız oturum, başladı 20:00)

- Sıra: tam `npm run kalite` (HEAD'den yeni `.next`), sonra önce derlemesi `.next-once`, sonra kalan sekiz sayfanın dönüşümlü ölçümü.
- 20:20 tam `npm run kalite` yeşil (732 test, derleme 385 sn); `.next` artık HEAD sonra derlemesidir. Önce derlemesi `.next-once`
  kuruluyor, 13 kaynak dosya geçici olarak `d077adb85` sürümünde. Kesilirse: `git checkout HEAD -- app components lib next.config.ts
  tsconfig.json`, `.next-once` silinir, 3123/3124 süreçleri durdurulur.
- 21:09 önce derlemesi kuruldu (düşük boş bellekte 40 dk), kaynaklar HEAD'e döndü. 3123 sonra (`.next`), 3124 önce (`.next-once`;
  HTML'de harita iframe'i ve Google Fonts, görsel `max-age=0`). 21:13 dönüşümlü ölçüm başladı, üç sayfalık gruplar hâlinde
  (`lighthouse-g13-donusumlu-kalan.json`, `--sadece` ile birikir).
- 21:25 ilk grup (makale, mevzuat madde, şerhli madde) kaydedildi. 21:26'da altı sayfalık ikinci grup sürerken oturum uyarısız
  kesildi (döküm araç sonucu olmadan bitiyor, sunucular sabah ayakta değildi).

## 2026-10-07 07:00 — G13 DEVAM EDİYOR (başsız oturum, başladı 07:00)

- Devralma: `.next` (20:08, HEAD) ve `.next-once` (21:07, `d077adb85`) sağlam, port 3123/3124 boş. Kalan altı sayfa (rehber, ders notu
  hub, hesaplama, kavram, bölge, yazar) aynı yöntemle ölçülüyor. Kesilirse 3123/3124 süreçleri durdurulur, `.next-once` silinir.
- 07:30 ölçüm bitti (tablo `gorevler/G13.md` adım 8). Ölçüt rehberde TBT ve ana iş parçacığı için gerileme işaretledi. Bölge ve yazarda
  TBT ortancası örtüşen aralıkla yükseldi. Bu üç sayfa kontrolle birlikte roller ters çevrilerek yeniden ölçüldü
  (`lighthouse-g13-donusumlu-ters.json`) ve farklar tekrar etmedi. Tekrar eden tek sonuç LCP iyileşmesidir.
- Mobil LCP hedefi (< 2,5 sn) için altı sayfada LCP öğesi ve evreleri çıkarıldı (geçici betik silindi). Gözlenen LCP, FCP ile aynı
  anda gerçekleşmektedir. Benzetimli LCP'deki 3–4 sn'lik gecikme, ilk boyamadan önce istenen betik parçalarından doğmaktadır.
  Neden ve izleme yolu G13.md ile PLAN.md'ye yazıldı.
- 07:51 tam `npm run kalite` yeşil (732 test, derleme 305 sn, bütçe taraması geçti). Sunucular (3123, 3124) kapatıldı, `.next-once`
  silindi. Zaman damgalı dört dosya geri alındı. Bu oturumda yalnız belgeler ve ölçüm kayıtları değişti (`8c7f83309`). TestSprite: kod değişmedi,
  koşulmadı.
- **G13 tamamlandı** (PLAN.md'de `[x]`). Sıradaki: G14 (yargı kararları yayın hazırlığı, bağımlılığı G04 `[x]`).
- G14 DEVAM EDİYOR (başladı 07:53). Alt plan `gorevler/G14.md` yazıldı: `yararli` etiketi dizinde yalnız yeni kararlarda var, tam
  kaynak emsal defteri `_state/benzerlik.jsonl` (39.254 yararlı / 113.822).
- G14 adım 1: `mobile/scripts/lib/yayin-suzgec.mjs` (test önce kırmızı, 5/5 yeşil), `build-icthat-data.mjs` defterle süzer, `--hepsi`
  eski davranış, `--cikti=<klasör>` geçici çıktı (`740104114`, `0f56bb41f`). Duman geçici klasörde: 39.278 / 113.844
  karar yayında, web indeksi 1.894 KB (mevcut 70.249 satır, 2.410 KB). Gerçek `public/` ve `mobile/data-src` dokunulmadı.
  Kullanıcıya soru 19 (ücretli arşivde de yalnız süzülmüş küme mi) eklendi.
- `kalite:hizli` iki kez yeşil (737 test). Belgelerde tahminle yazılmış iki saat commit zamanlarına göre düzeltildi.
  TestSprite: değişiklik yayında değil (30 Ekim) ve yalnız derleme betiği, koşulmadı.
- G14 adım 3: ücretli indeks `git mv` ile `data/yayin/yargi-index.json.gz`'ye taşındı, okuyan ve yazan dört dosya ile üç izleme satırı
  güncellendi (test önce 3/3 kırmızı). 08:14 tam `npm run kalite` yeşil (740 test, derleme 326 sn). Derlenmiş sitede eski adres ve
  `/api/yargi/index` üyeliksiz 401 verdi, izleme dosyası yeni yolu taşıyor. Üyeli okuma sır gerektirdiği için yerelde sınanmadı
  (yayın günü denenecek). Sunucu kapatıldı, zaman damgalı dört dosya geri alındı (`1b38b3b30`).
- Oturum 08:17'de bitirildi. Adım 4 yeni tasarım kararı gerektirir: Karar sayfası G00'da Vercel kullanımı için kabuğa çevrilmişti,
  sunucuda künye başlığı eklemek bu kararla tartılmalıdır. Bu yüzden kalan sürede başlatılmadı.
- Sıradaki: G14 adım 4 (karar sayfası başlığı ve özeti), sonra adım 5 (mobil arşiv ve `smoke-ui`). G14 DEVAM EDİYOR.

## 2026-10-07 09:00 — G14 DEVAM EDİYOR (başsız oturum, başladı 09:00)

- Devralma: çalışma ağacı temiz, `DURAKLAT` yok, son commit `1f468bb9e`. Adım 4 başlıyor (karar sayfası başlığı ve özeti).
- G14 adım 4: Karar sayfası ISR kabuğu olarak kaldı. Sunucu, yayın indeksinden künye, kademe, tarih, konu ve kararın başını basıyor,
  tam metin yalnız üyeye istemcide geliyor. İndekste olmayan kimlik 404 dönüyor, kırıntı yolu eklendi. `lib/yargi-karar-sayfa.mjs`
  testi önce kırmızı, sonra 8/8 yeşil. Sayfalar dizine kapalı kaldı, kullanıcıya soru 20 eklendi.
- Doğrulama: tam `npm run kalite` iki kez yeşil (748 test; derleme 344 sn, görsel düzeltmeden sonra 217 sn). Derlenmiş sitede karar
  sayfası 200, başlık künye, `noindex, follow`, ISR önbelleği HIT. Geçersiz ve indeks dışı kimlik 404, üyeliksiz API 401 döndü.
  İlk ekran görüntüsünde görülen iki kusur (tekrarlanan daire satırı, küçük harfle başlayan üyelik kartı) düzeltildi, görüntüler
  `raporlar/gorsel/g14-karar-sayfasi-sonra-*.png`. Sunucu kapatıldı, zaman damgalı dosyalar geri alındı (`59cbf5c58`).
  TestSprite: değişiklik yayında değil (30 Ekim), koşulmadı.
- Adım 6 (madde ↔ karar bağlantısı) soru 20'ye bağlı kaldı, zira G11 kuralı bağlantıyı yalnız dizine açık sayfaya verir.
- Adım 5 için tam mobil derlemenin yan etkileri salt okunur incelendi. Derleme yedi betikle izlenen birçok veri dosyasını yeniden
  yazdığından kesilme riskine karşı başlatılmadı. Döküm ve geri alma yordamı `gorevler/G14.md` adım 5 hazırlığında.
- Oturum 09:52'de bitirildi, port 3123 boş, ağaç temiz.
- Sıradaki: G14 adım 5, tam süreli bir oturumun başında (mobil tam derleme, `smoke-ui`), sonra adım 7 (rapor). G14 DEVAM EDİYOR.

## 2026-10-07 10:00 — G14 DEVAM EDİYOR (başsız oturum, başladı 10:00)

- Devralma: çalışma ağacı temiz, `DURAKLAT` yok, son commit `c850487a4`, port 3123/3124 boş, boş bellek ~1.000 MB. Adım 5 başlıyor
  (mobil tam derleme). Kesilirse `git checkout -- mobile/data-src public/data data/yayin` ile izlenen çıktılar geri alınır.
- Kayıt bu oturumda yazılamamıştır. Aşağıdaki maddeler 12:00 oturumunun döküm (`0781d38e…jsonl`) üzerinden yaptığı
  özettir. İlk tam derleme bellek yetersizliğiyle düşmüştür, zira `build-icthat-data.mjs` 39 bin kararın tam metnini 80 parçalık
  tek nesnede toplamaktaydı. Parçaları sırayla okuyup yazan `mobile/scripts/lib/parca-yaz.mjs` testle yazılmış (3/3), ikinci
  derleme 10:13'te geçmiştir: 39.460 karar arşivde, 80 parça, eksik metin 0. `smoke-ui` 23 adımın tamamında yeşildir.
  Eski örnek karar `16851400` defterde `u=0` olduğu için arşivden çıkmış, `smoke-ui` ile `design-audit` örneği YİBK kararı
  `752428200` yapılmıştır. `lib/site-stats.ts` yedek sayacı 39.460'a çekilmiş, tam `npm run kalite` 10:24'te yeşildir (751 test).
- Aynı derlemede süzgeçten bağımsız bir gerileme görülmüştür: Mobil madde atıflarında Ceza Muhakemesi Kanunu ve Türk Medeni
  Kanunu eşlemeden düşmüştür (önce 1.322 ve 961 atıf). 2026 kararları atfı «5271 sayılı Kanun’un» diye yazdığından en sık ad
  «Kanun’un» çıkmaktadır. Bu adı sayımdan ayıran `mobile/scripts/lib/atif-ad.mjs` testle yazılmış (2/2) ve
  `build-yargi-index.mjs`'e bağlanmıştır. Üçüncü derleme başlatıldıktan hemen sonra oturum 10:25'te kullanım sınırıyla
  kesilmiştir. 11:00 oturumu da açılışta aynı sınıra takılmıştır.

## 2026-10-07 12:00 — G14 DEVAM EDİYOR (başsız oturum, başladı 12:00)

- Devralma: `DURAKLAT` yok, son commit `c850487a4`. Ağaçtaki değişiklikler G14 adım 5'indir, kesinti dökümde
  `"error":"rate_limit"` ile doğrulanmıştır. Üçüncü derlemenin günlüğü «tohum» satırında kalmıştır, ağaçtaki veri ikinci
  derlemenindir. Boş bellek 394 MB'tır (toplam 7,9 GB), hasat motoru çalışmaktadır ve portlar boştur. Atıf düzeltmesiyle tam
  mobil derleme yeniden koşulmaktadır.
- Mobil tam derleme 12:02–12:12 arasında çıkış 0 ile tamamlanmıştır: 114.625 kararın 39.718'i yayında, 80 parça, eksik metin 0.
  Kanun eşlemesi 24/46'dan 31/46'ya, bağlanan atıf 5.803'ten 17.637'ye, atfı bulunan madde 649'dan 1.521'e çıkmıştır (11 Eylül:
  1.044). HMK, TBK, 5510, 4735 ve 6458 ilk kez bağlanmış, TTK, Vakıflar ve Belediye paketleri yürürlükteki numaraya geçmiştir.
- Derlemenin yeniden ürettiği rehber, kütüphane ve tohum dosyaları içerik olarak da değişmiştir. G14 dışında kaldıkları için
  geri alınmış, uygulama `--sadece-arayuz` ile yeniden derlenmiş, `smoke-ui` 23/23 yeşil çıkmıştır. `site-stats` yedeği 39.718'dir.
- 12:24 tam `npm run kalite` yeşildir (753 test, derleme 388 sn). Zaman damgalı dosyalar geri alınmıştır (`279d3c5c9`).
  TestSprite: değişiklik yayında değil (30 Ekim), koşulmamıştır.
- Adım 7 raporu `raporlar/yargi-yayin.md` dosyasına yazılmıştır. Adım 6 soru 20'ye bağlı olarak ertelenmiştir.
- **G14 tamamlandı** (PLAN.md'de `[x]`). Arşiv sayfasının TBT notu G15'e devredilmiştir. Sıradaki: G15 (tasarım sistemi
  denetimi, bağımlılığı G06 `[x]`). Hafta 2'nin kalan görevleri bitmiştir.
- G15 DEVAM EDİYOR (başladı 12:27). Alt plan `gorevler/G15.md` yazıldı.
- G15 adım 1–2: `scripts/tasarim-denetim.mjs` (Playwright + axe-core, 14 sayfa × 1280/390 px, WCAG 2.2 hedef boyutu aralık
  istisnasıyla) ve `lib/tasarim-denetim.mjs` (test 4/4) yazılmıştır. Önce ölçümü: kontrast 1.957 düğüm (14/14 sayfa), hedef ihlali 120,
  taşma 0. Rapor `raporlar/tasarim-denetimi.md` 13/20'dir. Koyu tema kullanıcıya soru 21 olarak yazılmıştır (`19627aa2c`).
- G15 adım 3–5 ilk dalga: Renk jetonları `lib/tasarim-jetonlari.mjs`'e taşınmış, palet değişmemiş, metin için `ink-muted`, `accent-ink`
  ve `accent-light` eklenmiştir (test 5/5, cırcırlı). 341 saydam ikincil metin, 238 küçük punto ya da bağlantı vurgusu, kömür
  zemindeki krem tonları ve madde rotası CSS'i çevrilmiştir. Mevzuat açılırları 44 px'e çıkarılmış, `pre` odağı ve `themeColor`
  düzeltilmiştir. Sonra ölçümü: kontrast 1.957 → 84, hedef 120 → 4, diğer axe 2 → 0. Tam `npm run kalite` yeşildir (762 test,
  derleme 263 sn), commit `66df4c355`. Ekran görüntüleri `raporlar/gorsel/g15-*-{once,sonra}.jpg`.
- Kalan 84 düğümün 77'si vurgu zeminli beyaz yazılı düğmedir. Düzeltme sitenin en görünür turuncusuna dokunduğu için görsel
  karşılaştırmayla ayrı adımda yapılacaktır. Koyu yeşil zeminli eski `app/[category]` sayfaları dönüşümden çıkarılmıştır.
- TestSprite: değişiklik yayında değil (30 Ekim), koşulmamıştır. Sunucu kapatılmış, port 3123 boştur, zaman damgalı dosyalar geri
  alınmıştır.
- 13:22–13:31: Mobil alt gezinmedeki etkin sekme ve TrustBar `font-drama` satırı düzeltilmiştir. Tam `npm run kalite` yeşil
  (762 test), yenilenen ölçümde kontrast 77 düğümdür ve tamamı vurgu zeminli düğmedir (`94aa8ee83`).
- Oturum 13:35'te bitirilmiştir. Port 3123 boş, ağaç temiz, hasat motoru çalışmaya devam etmektedir.
- Sıradaki: G15 düğme kontrastı ve kalan küçük bulgular (`gorevler/G15.md` "Sıradaki"). G15 DEVAM EDİYOR.

## 2026-10-07 14:00 — G15 DEVAM EDİYOR (başsız oturum, başladı 14:00)

- Devralma: `DURAKLAT` yok, ağaç temiz, son commit `0c8f2a8f6`. Çarşamba olduğundan G08 yapılmamıştır. Sıradaki adım vurgu zeminli
  düğmelerin kontrastıdır.
- Kayıt bu oturumda yazılamamıştır, oturum 14:06'da kullanım sınırıyla kesilmiştir (döküm `2b7e477f…jsonl`, `"error":"rate_limit"`).
  Aşağıdaki özet 2026-10-08 06:11 oturumunun dökümden çıkardığıdır. Dört seçenek (`a` bugünkü `#CC5833`, `b` `#C15330`, `c` `#A7482A`,
  `d` 18,67 px yazı) ana sayfa ve üyelik sayfasında CSS enjeksiyonuyla karşılaştırılmış, görüntüler `raporlar/gorsel/g15-dugme-*.jpg`
  dosyalarına yazılmıştır. Seçilen `b`, `accent-solid` jetonu olarak eklenmiş, beyaz yazıyla 4,62:1 vermektedir. Düz `bg-accent` dolgusu
  37 dosyada `bg-accent-solid`'e, üzerine gelmede açılan `bg-accent/90` `accent-ink`'e çevrilmiş ve iki cırcır testi yazılmıştır.

## 2026-10-08 06:11 — G15 DEVAM EDİYOR (başsız oturum, başladı 06:11)

- Devralma: `DURAKLAT` yok, son commit `0c8f2a8f6`. Ağaçtaki 40 değişiklik ve geçici `g15-dugme-gecici.mjs` 14:00 oturumunundur,
  jeton testi 7/7 yeşildir. `RehberFigures` çatal kartının iç paragrafları turuncu dolguda krem kalmıştı (4,05), beyaza çevrilmiştir.
  Perşembe olduğundan G08 yapılmamıştır. Sıradaki: kalite kapısı, sonra ölçümü, commit.
- 14:00 oturumundan kalan `next start` (PID 6008) 3123'ü tutmaktaydı, durdurulmuştur. Tam `npm run kalite` yeşildir (764 test, derleme
  601 sn, boş bellek ~800 MB). Sonra ölçümünde kontrast 77 → 0 düğüme inmiştir, commit `ca9ee5784`.
- Kalan küçük bulgular kapatılmıştır. Dokuz girdi odak çerçevesini `outline-none` ile kaldırmakta, üst çubuk araması odağı hiç
  göstermemekteydi. `field-focus` ve `field-focus-within` sınıfları ile cırcır testi yazılmıştır (önce kırmızı). Alt bilgideki üç
  bağlantı 24 px'e çıkmış, dört kalın tek kenar çizgisi ince tam kenara dönmüş ve cırcıra bağlanmıştır. Tam `npm run kalite` yeşildir
  (766 test, derleme 444 sn). Kapanış ölçümünde 28 ölçümün hepsinde kontrast, küçük hedef, diğer axe ve taşma 0'dır. Odaklanan girdinin
  kenarı derlenmiş sitede vurgu rengine dönmektedir (Playwright ile sınanmıştır). Commit `58e5a4665`.
- Rapor `raporlar/tasarim-denetimi.md` "İkinci dalga ve kapanış ölçümü" bölümünde, puan 13/20 → 18/20'dir. **G15 tamamlanmıştır**
  (PLAN.md'de `[x]`). Düğme ölçü birleştirmesi G16'ya, yargı arşivi TBT'si ile `app/[category]` denetimi G25'e not edilmiştir.
- TestSprite: değişiklik yayında değil (30 Ekim), koşulmamıştır. Sunucu kapatılmış, port 3123 boştur, zaman damgalı dosyalar geri
  alınmıştır.
- G16 DEVAM EDİYOR (başladı 06:54). Alt plan `gorevler/G16.md` yazıldı (`c083d9545`).
- G16 adım 1: Ana sayfa ve üç yazar sayfası iki genişlikte çekilmiş, impeccable detektörü 0 bulgu vermiştir. Değerlendirme tek bağlamda
  yapılmıştır, zira başsız oturumda alt ajan açılmamaktadır. Rapor `raporlar/g16-anasayfa-yazar.md`, commit `69aabde3d`. Ana bulgu,
  külliyat sayılarının altı yerde çelişen değerlerle yazılması ile yazar bilgisinin ve uyum beyanlarının tekrarıdır.
- G16 adım 2: Elle yazılmış sayılar ve `PROFILE.stats` kaldırılmış, sayılar `siteSayilari()`'ndan gelmektedir. Uyum beyanları ve okura
  dönük SEO notu silinmiş, cırcır testi yazılmıştır (önce kırmızı, 3/3). Raporun ilk sürümü şerh ve rehber sayısını `site-stats`
  yedeğinden (5.143, 579) okumuştu. Üretim sayaçları 8.088 ve 556 olduğundan rapor düzeltilmiştir. Tam `npm run kalite` yeşildir
  (769 test), commit `d4d92766e`.
- G16 adım 3'ün ilk dilimi: Alt bilgi başlığı "Büro ve iletişim." olmuş, günlük içtihat verisi vurgusuzken ana sayfada `/icthat`
  bağlantılı satır çizilmektedir. Tam `npm run kalite` yeşildir (769 test, derleme 441 sn). Ana sayfa denetimi iki genişlikte 0'dır.
  Commit `aa277ba7b`.
- TestSprite: değişiklik yayında değil (30 Ekim), koşulmamıştır. Oturum 07:33'te bitirilmiştir. Port 3123 boş, ağaç temiz, zaman
  damgalı dosyalar geri alınmıştır.
- Sıradaki: G16 adım 3'ün kalanı (TrustBar ile CredentialsStrip birleşmesi, mobilde hesaplama kartı sınırı), sonra adım 4 ve 5
  (`gorevler/G16.md` "Sıradaki"). G16 DEVAM EDİYOR.

## 2026-10-08 08:00 — G16 DEVAM EDİYOR (başsız oturum, başladı 08:00)

- Kayıt bu oturumda yazılamamıştır, oturum 09:37'de kullanım sınırıyla kesilmiştir (döküm `064f15ab…jsonl`, `"error":"rate_limit"`).
  10:00 ve 11:00 oturumları da sınıra takılıp iş yapmadan kapanmıştır. Aşağıdaki özet 12:00 oturumunun dökümden çıkardığıdır.
  Adım 3 tamamlanıp commit edilmiştir (`3a9f11b78`). Adım 4 için `lib/__tests__/yazar-sayfalari.test.mjs` yazılmış, önce
  kırmızıdır (0/5). CredentialsStrip silinmiş, üç sayfa künyeyi `YAZAR`'dan almaya başlamış, `/eserlerim` sunucu bileşenine dönmüş
  ve "Sitedeki yayınlar" bölümü eklenmiştir. Kesinti anında test 3/5 yeşildir.

## 2026-10-08 12:00 — G16 DEVAM EDİYOR (başsız oturum, başladı 12:00)

- Devralma: `DURAKLAT` yok, son commit `3a9f11b78`. Ağaçtaki dokuz değişiklik 08:00 oturumunun adım 4 işidir. Port 3123 boştur.
  Perşembe olduğundan G08 yapılmamıştır.
- Yazar sayfasında kalan iki elle yazılmış ad (Twitter başlığı, kırıntı) `YAZAR.ad`'a bağlanmış, yorumdaki eski bileşen adı
  çıkarılmıştır. `yazar-sayfalari` testi 5/5 yeşildir.
- Adım 4: Tam `npm run kalite` yeşildir (780 test, derleme 401 sn, boş bellek ~280 MB). Commit `3d557a0a8`.
- Adım 5 ilk ölçüm iki bulgu vermiştir. `/eserlerim` alt başlığı açık zeminde `text-accent` ile 3,67:1'di, `text-accent-ink`'e
  çevrilmiştir. Ana sayfanın mobil aktarımı 811 KB'tı (G13 sonrası 758 KB). İstek dökümüne göre artış ön getirmedendir: Sayı
  rozetleri kalkınca külliyat şeridi ve Hero'nun iki ikincil düğmesi mobil ilk ekrana girmiştir. Bu bağlantılarda `prefetch={false}`
  kullanılmış (G13 alt çubuk emsali), cırcır testi önce kırmızıdır. Tam kapı iki kez yeşildir (781 test). Kapanış ölçümünde dört
  sayfa iki genişlikte kontrast, hedef ve taşma bakımından 0'dır. Ana sayfa mobil ortancası LCP 4.938 ms ve aktarım 716 KB'tır,
  detektör 0 bulgu vermiştir. Commit `f5091f063`.
- G15 notundaki düğme birleştirmesi: Açık zemindeki 14 satır içi düğme `.btn-primary`, `.btn-dark`, `.btn-secondary`, `.btn-chip`
  sınıflarına toplanmıştır, Hero'nun koyu zemindeki kademeli düğmeleri değişmemiştir. Cırcır testi önce kırmızıdır (14). Tam kapı
  yeşildir (782 test, derleme 277 sn). Denetim yine 0, aktarım 716 KB, LCP 4.903 ms'dir. Commit `9d11f11ba`.
- **G16 tamamlanmıştır** (PLAN.md'de `[x]`). Alt bilgideki iki uyum beyanı ile `/akademik-profil` ve `/eserlerim`'in denetim
  listesine eklenmesi G25'e devredilmiştir. Soru 10–14'e bağlı öğeler değiştirilmemiştir.
- OTONOM.md teknik tuzaklarına Git Bash yol dönüşümü eklenmiştir (`/` argümanı `C:/Program Files/Git/` oldu; `MSYS_NO_PATHCONV=1`).
- TestSprite: değişiklik yayında değil (30 Ekim), koşulmamıştır. Sunucu kapatılmış, port 3123 boştur, zaman damgalı dosyalar geri
  alınmıştır. Kapının düşürdüğü betik bütçe tabanı (`/` 530,2 → 529,8 KB) bu kayıtla commit edilmiştir.
- Sıradaki: G17 (grafikler, beceri dataviz). Bağımlılığı G15 `[x]`'tir.
- G17 DEVAM EDİYOR (başladı 13:03). Alt plan `gorevler/G17.md` yazıldı: kütüphanesiz sunucu SVG'si, yayımlanabilir kararların
  dağılımı `/yargi-kararlari/istatistik` sayfasında, hesaplama dökümü kıdem ve faizde. dataviz becerisi yüklenmiştir.
- G17 adım 1 (`0499a26d6`): Dağılım verisi `public/data/yargi-dagilim.json`. Canlı hasat indeksi bugün 40.640 kararı süzgeçten
  geçirmekte, sitede ise 39.718 karar yayındadır; veri bu yüzden yayımlanan web indeksinden ve aynı üretimin `yargi-stats.json`'ından
  sayılır, çelişkide üretici hata verir. Defter tabanlı ilk tasarım bırakılmış, `mobile/` betiklerine yapılan geçici değişiklik
  geri alınmıştır. Test önce kırmızı, 7/7.
- G17 adım 2 (`e18c7ae41`): `lib/grafik-palet.mjs`. Kategorik palet `#CC5833, #2a78d6, #1baf7a` dataviz doğrulayıcısından iki
  zeminde geçmiştir (üçüncü renk 2,79:1, etiket ve tablo zorunlu). Rapor `raporlar/g17-grafikler.md`. Test 3/3.
- G17 adım 3'ün ilk dilimi (`849dc80f8`): `lib/grafik-olcek.mjs` (tikler, sütun yolu), test 4/4. `kalite:hizli` yeşildir (796 test).
- TestSprite: değişiklik yayında değil (30 Ekim), koşulmamıştır. Port 3123 boştur, ağaç temizdir. Oturum 13:20'de, yeni iş
  başlatmadan kapatılmıştır (bileşenler derleme ve görsel doğrulama ister).
- Sıradaki: G17 adım 3'ün kalanı (`components/grafik/`, dataviz `marks-and-anatomy.md` ve `interaction.md`), sonra adım 4
  (`gorevler/G17.md` "Sıradaki"). G17 DEVAM EDİYOR.

## 2026-10-08 17:00 — G17 DEVAM EDİYOR (başsız oturum, başladı 17:00)

- Devralma: 14:00 oturumu 14:27'de sınıra takılmıştır (döküm `29eced20`, `"error":"rate_limit"`), 15:00 ve 16:00 oturumları iş
  yapmadan kapanmıştır. 14:24'te başlatılan `next start` 3123'ü tutmaktaydı, durdurulmuştur.
- Kesintide yarım kalan bağlama testi `node -e` ile yazılmış ve heredoc kaçış tuzağına düşmüştü (`\b` geri silme karakterine, `\/`
  ile `\(` çıplak karaktere dönmüştü). Test Edit ile yeniden yazılmış, değişen dosyalarda denetim karakteri taraması 0 vermiştir.
- G17 adım 5: Kıdem aracına net kıdem, net ihbar ve vergi kesintilerinden oluşan, faiz aracına ise anapara ve faizden oluşan
  yığılmış çubuk dökümü eklenmiştir. Sonuç satırları ve faizin dönem çizelgesi korunmuştur. Test 25/25 (önce kırmızı).
  Tam `npm run kalite` yeşildir (817 test, derleme 1018 sn, boş bellek ~350 MB). Adım 4 `2a8ae6a66`, adım 5 `d7ae0c56c`.
- G17 adım 6: Tasarım denetimi istatistik sayfasında `link-in-text-block` bulmuştur (cümle içi bağlantı yalnız renkle ayrılıyordu,
  1,03:1). Kalıcı alt çizgi eklenmiş, sayfa testine kural yazılmıştır (önce kırmızı). Yeniden derlemeden sonra kapı yeşildir
  (818 test, derleme 380 sn). Denetim yeni sayfada ve `/hesaplama/kidem`'de iki genişlikte 0'dır. Lighthouse mobil ortancası
  hesaplamada performans 77 ve LCP 4,8 sn, arşivde 77 ve 4,7 sn'dir. G13'e göre aktarım ~36-39 KB artmış, betik bütçesi ise
  değişmemiştir (`raporlar/g17-grafikler.md`).
- **G17 tamamlanmıştır** (PLAN.md'de `[x]`). Hukuk alanı dağılımı ile emsal oranı, yayımlanan indekste alan bilgisi bulunmadığından
  çizilmemiş ve soru 22'ye yazılmıştır.
- TestSprite: değişiklik yayında değil (30 Ekim), koşulmamıştır. Sunucu kapatılmış, port 3123 boştur, zaman damgalı dosyalar geri
  alınmıştır.
- G18 DEVAM EDİYOR (başladı 17:49). Alt plan `gorevler/G18.md` yazıldı: kanun metnine testle bağlanan şema verisi, sunucu SVG
  bileşeni `AkisSemasi`, ders taban koduna göre bağlama.

## 2026-10-08 22:00 — G18 DEVAM EDİYOR (başsız oturum, başladı 22:00)

- Devralma: 17:00 oturumu adım 3'ün testini yazdıktan sonra kesilmiştir (test commit'siz kalmıştır). 20:00 ve 21:00 oturumları
  açılışta `rate_limit` ile iş yapmadan kapanmıştır. Port 3123 boştur.
- G18 adım 3 (`5b4fb471c`): `DersNotuView` şemaları ders koduna göre ilk öğretim bölümünden sonra çizmektedir. Test önce kırmızı,
  12/12. `kalite:hizli` yeşildir (830 test).
- G18 adım 4: Denetim listesine akış şemalı `ankara/medeni-usul-donem-1` ve dal şemalı `ankara/esya-hukuku-yillik` eklenmiştir
  (`3b46f13e0`, test önce kırmızı). İlk ölçüm 360 px'te şema yazısını 11,3 px bulmuştur, zira figürde çizime 278 px kalmaktadır.
  Yazı 14 birime çıkarılmış, en büyük çizim 366 px'e indirilmiştir (`26f71edc5`); etkin yazı 360 px'te 12,2 px, 1280 px'te 16 px'tir.
  Üç ders notu iki genişlikte denetimde 0 vermiş, sekiz şemada metin `viewBox` içinde kalmıştır (en çok 232/320).
  Tam `npm run kalite` iki kez yeşildir (831 test, derleme 1001 ve 800 sn, boş bellek 280-420 MB). Rapor `raporlar/g18-semalar.md`.
- Hata ve geri alma: "önce" görüntülerini yeniden adlandırırken adım 2'nin izlenen `g18-akis|dal|miras-*.jpg` dosyaları da
  `-once` ekini almıştı; git'ten geri yüklenmiştir. Ölçüm betiği ilk koşuda yazı boyunu sabit 13 almıştı, düzeltilip yeniden
  koşulmuştur. Geçici betikler `tmp/` altındadır (git dışı).
- **G18 tamamlanmıştır** (PLAN.md'de `[x]`). G18 için kullanıcıya soru yoktur.
- TestSprite: değişiklik yayında değil (30 Ekim), koşulmamıştır. Sunucu kapatılmış, port 3123 boştur, zaman damgalı dosyalar geri
  alınmıştır.
- Sıradaki: G19 (ders notları kalite dalgası 1, beceri hukuki-halusinasyon-onleme). Bağımlılıkları G11 ve G18 `[x]`'tir.

## 2026-10-09 07:00 — G19 DEVAM EDİYOR (başsız oturum, başladı 07:00)

- G19 DEVAM EDİYOR (başladı 07:10). Alt plan `gorevler/G19.md` yazıldı: elle yazılan, kanun metnine testle bağlanan kanonik katman
  yalnız 10 temsilci nota uygulanır.
- Ara kayıt 07:45: Adım 1 (`8de11d662`), adım 2-3 (`11d6c9a11`, `37eb6e01f`), adım 4-7 (`df2d61e61`). Beş ders 6/7'dedir; paragraf
  ölçütü adım 13'e kalmıştır. Tam kapı yeşildir (851 test, derleme 426 sn).
- Devralma: Ağaç temizdi, port 3123 boştu. Pazartesi olmadığından G08 yapılmamıştır.
- G19 adım 8-12 (`cbe933148`): Eşya, iş, ticari işletme, şirketler ve idare katmanları ile üç yeni şema. İdare katmanı, depoda İYUK
  ve Anayasa metni bulunmadığından Kamulaştırma, Belediye ve İmar Kanunlarına dayanmaktadır. Kaynak gösterilen dokuz mevzuat.gov.tr
  PDF adresi tek tek denenmiş, hepsi yanıt vermiştir.
- G19 adım 13 (`b4887ae7c`): Temsilci notta kanun alıntısının ham başlık artığı temizlenmiş, alıntı yineleyen kalıp paragraflar
  düşürülmüştür (5.682 → 3.666 paragraf). On ders 7/7'dir.
- G19 adım 14: 235 dayanağın tamamı kanun metninde, 190 düzyazı göndermesinin tamamı var olan maddede doğrulanmıştır
  (`raporlar/g19-dayanak-denetimi.md`). Tasarım denetimi ilk turda olay altındaki madde bağlantılarında dört küçük dokunma hedefi
  bulmuş, bağlantılar 24 px'lik etiketlere çevrilmiştir. Yeniden derlemeden sonra denetim 0'dır. Tam `npm run kalite` üç kez
  yeşildir (son tur 853 test, derleme 355 sn, boş bellek ~1 GB).
- Hata ve geri alma: Desen içeren bir düzeltme `node - <<'EOF'` ile yazılmaya çalışılmış, ters bölü kaçışı yüzünden eşleşme bulunamamış
  ve betik değişiklik yapmadan durmuştur; düzeltme Edit aracıyla yapılmıştır (OTONOM tuzağı, zarar yok).
- **G19 tamamlanmıştır** (PLAN.md'de `[x]`). Soru 23 (anayasa notu ve İYUK metni) eklenmiştir.
- TestSprite: değişiklik yayında değil (30 Ekim), koşulmamıştır. Sunucu kapatılmış, port 3123 boştur, zaman damgalı dosyalar geri
  alınmıştır. `git stash` listesindeki `wip-side2` bu oturuma ait değildir, dokunulmamıştır.
- Sıradaki: G20 (paylaşım görselleri, bağımlılığı G09 `[x]`).

## 2026-10-11 22:00 — G20 DEVAM EDİYOR (başsız oturum, başladı 22:00)

- G20 DEVAM EDİYOR (başladı 22:05). Alt plan `gorevler/G20.md` yazıldı: statik, kapalı `/og/<tür>/<anahtar>` görsel kümesi,
  merkezi `lib/paylasim.ts`, ölçüm betiği `scripts/derleme-og-tara.mjs`.
- Ara kayıt 22:30: Adım 1-4 `dba223c66` (ölçüm betiği, yardımcı, kart, 38 sayfa, madde şablonu). Önce ölçümü: dizine açık 827 sayfanın
  745'inde og:image yok (`raporlar/og-once.json`). `kalite:hizli` yeşil (873 test). Sıradaki: tam derleme ve sonra ölçümü.

## 2026-10-12 08:04 — G20 DEVAM EDİYOR (başsız oturum, başladı 08:04)

- G20 DEVAM EDİYOR (başladı 08:50, adım 5'ten). Devralma: `DURAKLAT` yok; ağaçta yalnız G20'nin kaydı, `gorevler/G20.md` ve zaman
  damgalı dosyalar vardı. Port 3123 boştur, boş bellek 923 MB'dir. `wip-side2` saklaması bu oturuma ait değildir.
- **G08 (pazartesi):** Motor çalışmaktadır, düzeltme gerekmemiştir (`c14d1a537`, `raporlar/hasat-haftalik.md`). Arşiv 120.940,
  emsal 43.271 (geçen hafta 36.159), captcha 7-11 Ekim arası toplam 6, disk C'de 46 GB boş alan vardır. Günlükteki uzun boşluklar
  otonom oturumların da açılmadığı aralıklardadır, yani makine kapalı ya da uykudaydı.
- G20 adım 5, ilk tam kapı (`dba223c66` + kart düzeltmesi): Yeşildir (874 test, derleme 521 sn, boş bellek ~900 MB). Sonra ölçümü
  dizine açık 827 sayfada eksik 0, ayrı görsel 732, kırık görsel 0 vermiş, derlemede 846 kart üretilmiştir (`.next/server/app/og`, 29 MB).
- Kod gözden geçirmesinde üç kusur bulunmuş, üçü de önce kırmızı testle düzeltilmiştir (`f31880c0d`):
  - Kart tür etiketi `textTransform: 'uppercase'` ile yazılıyordu; Satori yerel ayar verilmezse sunucunun varsayılanını kullandığından
    "Vatandaş rehberi" Vercel'de "REHBERI" çıkardı. Etiket artık `toLocaleUpperCase('tr')` ile yazılır, görüntüde "REHBERİ" doğrulanmıştır
    (`raporlar/gorsel/g20-kart-*.png`).
  - Temsilci ders notu kart anahtarı iki yerde elle kuruluyor ve `ankara-ankara-…` biçiminde çift önek taşıyordu; tek yardımcıya
    (`dersNotuKartAnahtari`) bağlanmıştır.
  - Ölçüm `og:url`'ün canonical ile aynı olup olmadığına bakmıyordu. Kural eklenince 93 dizine açık sayfa kırmızı çıkmıştır. Kendi
    `openGraph`'ını vermeyen 79 sayfa kökün ana sayfa adresini ve başlığını miras alıyor, 14 madde özeti ise canonical'ı madde
    sayfasına verirken `og:url`'de kendini gösteriyordu. Kök artık adres, başlık ve açıklama taşımaz (`paylasimKokMeta`; Next
    başlığı sayfanın `title` değerinden doldurur). 14 sayfa yardımcıya bağlanmış, madde özetinde `og:url` canonical'a eşitlenmiştir.
    Meta veren ve noindex olmayan sayfanın yardımcıyı atlaması testle kilitlenmiştir.
- İkinci tam kapı: 879 test ve derleme geçmiştir. Derleme 6.128 sn sürmüştür, zira makine 09:15-10:13 ve 10:13-10:42 arasında uykuya
  geçmiş, boş bellek 272 MB'ye düşmüştür. `derleme-tarama` **kırıktır**: 93 → 7 sayfada yalnız `og:url` eksiktir, yanlış adres kalmamıştır.
  Eksik sayfalar `bookmarklet`, `eserlerim`, `ingilizce-avukat`, `on-form`, `site-haritasi`, `uyelik`, `uyelik/sozlesme`'dir.
  `og-sonra.json` bu ara durumu taşır.
- Hata: Testteki kilit `uyelik` ve `uyelik/sozlesme`'yi "çalışma anında üretilen sayfa" diye istisna saymıştır, ne var ki ikisi de
  derlemede üretilip dizine açılmaktadır. Sonraki oturum istisnadan çıkarıp bağlamalıdır.
- Süre: 110 dakika sınırı makinenin uykusu yüzünden aşılmış, yeni iş başlatılmamıştır. Sunucu başlatılmamıştır, port 3123 boştur.
  TestSprite: değişiklik yayında değildir (30 Ekim), koşulmamıştır.
- **G20 DEVAM EDİYOR.** Sıradaki adım: Yedi sayfayı `paylasimMeta`'ya bağla (`eserlerim` ve `on-form` dosyalarında meta yoktur, yerleşim
  dosyalarına bak), kilitteki iki `uyelik` istisnasını kaldır, tam kapı ve `og-sonra.json`'ı yeniden üret. Ardından rapor
  `raporlar/g20-paylasim-gorselleri.md` (önce 745 → sonra 0, derleme süresi farkı, örnek kartlar) yazılır ve PLAN'da `[x]` yapılır.

## 2026-10-12 11:00 — G20 DEVAM EDİYOR (başsız oturum, başladı 11:00)

- G20 DEVAM EDİYOR (başladı 11:02, yedi sayfanın `og:url` eksiği). Devralma: `DURAKLAT` yok, ağaç temiz, son commit `134ef581e`.
- `d50fac255`: Altı sayfa yardımcıya bağlanmıştır (`bookmarklet` için yeni yerleşim dosyası). Kaynak kilidi artık yerleşim zincirine
  bakmakta, yorumdaki "noindex" sözcüğünü istisna saymamaktadır. Tarama 308 dönen `/ingilizce-avukat`'ı `.meta` durumundan tanıyıp
  atlamaktadır. Kilit önce altı sayfada kırmızıydı. `kalite:hizli` yeşildir (880 test).
- 11:33 tam kapı: Testler yeşil, ne var ki derleme 1.090 sn sonra 749 sayfayla (beklenen 941) kırık çıkmıştır. Kapı yalnız son 25
  satırı tuttuğundan hata iletisi uyarıların altında kalmıştır. 11:40'ta derleme tam günlükle yeniden başlatılmıştır
  (`logs/g20-build-1140.log`).
- 11:40 derlemesi aynı kodla geçmiştir (1.790 çıktı). Sekiz fakülte sayfası 60 sn sınırını ilk denemede aşıp yeniden denenmiştir;
  ilk kırılmanın bu zaman aşımının üç denemede tekrarlanması olduğu muhtemeldir, ne var ki kanıt kaybolduğundan doğrulanamamıştır.
  Kapı artık kırık adımın tam çıktısını `logs/kalite-<adım>-kirik.log` dosyasına yazmaktadır (`9d5b2f08e`, test önce kırmızı).
- 12:07 tam `npm run kalite` tek koşuda yeşildir: 881 test, derleme 684 sn (başlangıçta boş bellek 846 MB), dört derleme taraması geçmiştir.
  Paylaşım ölçümü: Dizine açık 826 sayfada eksik 0, ayrı görsel 735, kırık görsel 0 (`og-sonra.json`). Rapor
  `raporlar/g20-paylasim-gorselleri.md` yazılmıştır (önce 745 → sonra 0, derleme süresi, örnek kartlar). Aile hukuku notu başlığındaki
  "Konsolide Master" iç etiketi PLAN.md G23'e not edilmiştir.
- Zaman damgalı dosyalar geri alınmıştır. Sunucu başlatılmamıştır, port 3123 boştur. TestSprite: değişiklik yayında değildir (30 Ekim),
  koşulmamıştır.
- **G20 tamamlanmıştır** (PLAN.md'de `[x]`). Sıradaki: G21 (mobil uygulama cilası, bağımlılıkları G05 ve G15 `[x]`).
- G21 DEVAM EDİYOR (başladı 12:08). Alt plan `gorevler/G21.md` yazılmıştır: Kapsam `asistan` (1.2.3, kod 9), son Gradle derlemesi
  27 Ağustos'tur. Kalan süre tam mobil derlemeye yetmediğinden uygulamaya geçilmemiştir; ağaç temizdir.
- Sıradaki: G21 adım 1 (`build-app.mjs` kaynağını okuyup yazdığı yolları belirle, sonra `design-audit` önce ölçümü). Çevrimdışı paket
  derlemesi (adım 3) tam süreli bir oturumun başında başlatılmalıdır.
- 12:14 adım 1 başladı: `build-app.mjs --app=asistan --sadece-arayuz` (veri betiklerini atlar, izlenen `mobile/app-src/public`'i
  `data-src`'den yeniden kopyalar). Kesilirse `git checkout -- mobile/app-src/public` yeterlidir.
- 12:17 adım 1 bitmiştir: `design-audit` 19 ekranda 0 bulgu vermiştir (`raporlar/tasarim-denetim-g21-once.txt`). Derlemenin değiştirdiği
  tek izlenen dosya (`icthat/seed.json`) geri alınmıştır. Gözle bulunan başlık harf aralığı sorunu `gorevler/G21.md`'ye yazılmıştır.
- Oturum 12:20'de bitirilmiştir, ağaç temizdir, sunucu başlatılmamıştır. TestSprite: G21'de kod değişmemiştir.
- **G21 DEVAM EDİYOR.** Sıradaki: Adım 2 (başlık harf aralığı, `.btn-*` tutarlılığı), ardından tam süreli bir oturumun başında adım 3
  (çevrimdışı paketler).

## 2026-10-12 14:22 — G21 DEVAM EDİYOR (başsız oturum, başladı 14:22)

- G21 DEVAM EDİYOR (başladı 14:22). Devralma: `DURAKLAT` yok, ağaç temiz, son commit `94dbf45ba`, port 3123 boş, boş bellek 792 MB.
  G08 bugün 08:04 oturumunda yapılmıştır.
- `67e22aacf` adım 2: `design-audit` iki kural kazanmıştır (küçük puntoda dar harf aralığı, anahtar rayında 3:1 altı kontrast),
  karar testlidir ve önce kırmızıdır. Üst çubuk başlığındaki `tracking-tight` kaldırılmış, Takip ekranının anahtarı Ayarlar'la ortak
  `Anahtar` bileşenine taşınmış, ilgi alanı düğmeleri ham kod yerine etiket ve binlik ayraçlı sayı yazmaktadır. Denetim önce 6 bulgu,
  sonra 20 ekranda 0 bulgu vermiştir. `kalite:hizli` yeşildir (885 test). Ayrıntı `gorevler/G21.md`.
- 14:50 adım 3 başladı: Tam `build-app.mjs --app=asistan` (boş bellek 889 MB, günlük `logs/g21-mobil-tam-1450.log`). Kesilirse
  `git checkout -- mobile/data-src public/data data/yayin mobile/app-src/public` yeterlidir.

## 2026-10-12 15:00 — G21 DEVAM EDİYOR (başsız oturum, başladı 15:00)

- G21 DEVAM EDİYOR (başladı 15:05, adım 3 yeniden). Devralma: `DURAKLAT` yok. 14:22 oturumu derlemenin bitişini beklerken kesilmiştir,
  zira makine 14:58:36'da yeniden başlatılmıştır (Sistem günlüğü 6006/109, açılış 14:58:51). `calis.log`'da 14:22 oturumunun bitiş
  satırı yoktur, döküm 14:50'de araç çağrısının ortasında kalmıştır. Derleme `icthat` adımında, `fulltext/` yazılırken (14:58:09)
  ölmüştür. Ağaçta kalan yarım `archive.json.gz` geri alınmıştır.
- 15:05 tam `build-app.mjs --app=asistan` yeniden başlatılmıştır (boş bellek ~1.000 MB, günlük `logs/g21-mobil-tam-1505.log`).
  Kesilirse `git checkout -- mobile/data-src public/data data/yayin mobile/app-src/public` yeterlidir.

## 2026-10-13 00:00 — G21 DEVAM EDİYOR (başsız oturum, başladı 00:00)

- G21 DEVAM EDİYOR (başladı 00:02, adım 3 üçüncü deneme). Devralma: `DURAKLAT` yok. 15:05 derlemesi `yargi` taramasında
  (72.500/121.591 dosya, günlüğün son yazımı 15:20) kesilmiştir, zira makine 15:22:45'te uykuya geçmiş (Kernel-Power 42) ve
  23:07'de uyanmıştır. 15:00 oturumunun `calis.log`'da bitiş satırı yoktur, derleme süreci de artık yaşamamaktadır.
- Yarım derleme çıktıları geri alınmıştır. 15:00 oturumunun adım 4 için bıraktığı iki değişiklik korunmuştur: Katalogda `asistan`
  1.2.3 (9) → 1.3.0 (10) ve `galaxy.test.mjs`'e eklenen `meta.json` sürüm testi (önce kırmızı, `build-flavor` ile yeşile dönecek).
- 00:04 tam `build-app.mjs --app=asistan` yeniden başlatılmıştır (boş bellek 586 MB, hasat çalışıyor; günlük
  `logs/g21-mobil-tam-0004.log`). Kesilirse `git checkout -- mobile/data-src public/data data/yayin mobile/app-src/public` yeterlidir.

## 2026-10-13 13:00 — G21 DEVAM EDİYOR (başsız oturum, başladı 13:00)

- G21 DEVAM EDİYOR (başladı 13:03, adım 3 dördüncü deneme). Devralma: `DURAKLAT` yok. 00:04 derlemesi `icthat` tohum satırından sonra
  kesilmiştir, zira makine 00:04:10'da uykuya geçmiş (Kernel-Power 42, neden «Application API») ve 11:54'te uyanmıştır. 00:00
  oturumunun dökümü boştur, bitiş satırı yoktur. Önceki iki uykunun nedeni «Battery»dir (15:22:45 ve 23:07:59). Bekleme zaman aşımı
  AC ve pilde 0'dır, yani boşta uyku kapalıdır. Bu yüzden uyku kilidi eklemek kesintiyi önlemezdi, eklenmemiştir. Şu an makine
  prizdedir (%97). İzlenen ağaçta yarım çıktı yoktur, adım 4'ün iki değişikliği korunmuştur. 12:05 oturumu ağ gelmediği için atlanmıştır.
- 13:04 tam `build-app.mjs --app=asistan` yeniden başlatılmıştır (boş bellek 816 MB, hasat çalışıyor, port 3123 boş; günlük
  `logs/g21-mobil-tam-1304.log`). Kesilirse `git checkout -- mobile/data-src public/data data/yayin mobile/app-src/public` yeterlidir.
- 13:19 adım 3 bitmiştir (16 dk, çıkış 0). Arşiv 121.937 karardır, yayın süzgecinden 43.764 karar geçmektedir (önce 39.718).
  Madde atfı 1.521 maddeden 1.547 maddeye çıkmıştır. `smoke-ui` 23/23 yeşildir. İlk `kalite:hizli` bir testte kırılmıştır, zira
  `yargi-dagilim.json` eski anlık görüntüde kalmıştır. Dosya `yargi-dagilim-uret.mjs` ile yeniden üretilmiş, `lib/site-stats.ts` yedeği
  43.764 yapılmış ve kapı 886 testte geçmiştir. Commit `458b503cc`.
- 13:26 adım 4: `build-flavor.mjs --app=asistan` sürümü `flavor.properties` ve `meta.json`'a yazmış, `galaxy.test` yeşile dönmüştür.
  Yalnız satır sonu değişen dört üretilmiş dosya geri alınmıştır. Commit `6ea7e66df`.
- 13:29 adım 5 başladı: `npx cap sync android`, ardından `gradlew assembleDebug --no-daemon` (boş bellek 1.404 MB, günlük
  `logs/g21-gradle-debug-1329.log`).
- 13:38 adım 5 bitmiştir: `assembleDebug` 8 dk 53 sn'de geçmiştir. APK `com.avfethiguzel.hesap.debug`, kod 10, `1.3.0-debug`'dır
  (`aapt2 dump badging`). İlk iki deneme `gradlew.bat`'ı tam yolsuz çağırdığı için başlamamıştır. `cap sync`'in yalnız satır sonunu
  değiştirdiği `capacitor.build.gradle` geri alınmıştır. M5 için `lintRelease` güvenlik bulgusu vermemiştir. Yedi Fatal bulgunun hepsi
  yedekleme dosyalarındaki etkisiz WebView dışlamalarıdır ve bu dosyalar soru 8'e bağlıdır. Bu yüzden `checkReleaseBuilds false`
  bırakılmış, soru 24 yazılmıştır.
- 13:57 adım 6: Tam `npm run kalite` geçmiştir (886 test, derleme 509 sn, derleme taraması yeşil). Zaman damgalı dosyalar geri
  alınmıştır. Rapor `raporlar/g21-mobil-cila.md`'dir. OTONOM.md uyku tuzağına uyku nedenleri ve uzun işten önce priz denetimi
  eklenmiştir. Sunucu başlatılmamıştır. TestSprite: değişiklik yayında değildir (30 Ekim), koşulmamıştır.
- **G21 tamamlanmıştır** (PLAN.md'de `[x]`). Commit'ler `458b503cc`, `6ea7e66df` ve bu kaydı taşıyan belge commit'idir.
  Sıradaki: G22 (uçtan uca testler, bağımlılığı G01 `[x]`), önce alt plan `gorevler/G22.md`.
- G22 DEVAM EDİYOR (başladı 13:59). Alt plan `gorevler/G22.md` yazılmıştır (`bf152a1b5`).
- 14:16 adım 1 (`57db59796`): `npm run test:e2e` koşucusu 3123'ü kendisi açıp kapatmaktadır, port doluysa hiçbir sürece dokunmadan
  durur. Arama akışı 3/3 yeşildir. `test:e2e` tam kapıya derlemeden sonra girmiştir, hızlı kapı 892 testte yeşildir.
- 14:19 adım 2 (`9a49885bb`): Mevzuat madde akışı 4/4 yeşildir (metin, kırıntı, canonical, 404, 308). Port 3123 test sonrasında boştur.
- Oturum 14:22'de bitirilmiştir, ağaç temizdir. Tam kapı bu oturumda 13:57'de yeşil koşmuştur; `test:e2e` adımı tam kapıda henüz
  koşmamıştır, bir sonraki tam kapıda koşacaktır. TestSprite: değişiklik yayında değildir, koşulmamıştır.
- **G22 DEVAM EDİYOR.** Sıradaki: Adım 3 (hesaplama sabitlerinin birincil kaynakla doğrulanması, ardından arayüz testi).

## 2026-10-13 15:00 — G22 DEVAM EDİYOR (başsız oturum, başladı 15:00)

- G22 DEVAM EDİYOR (başladı 15:01, adım 3). Devralma: `DURAKLAT` yok, ağaç temiz, makine prizde (%96), boş bellek 872 MB, port 3123 boş.
- Oturum 15:17'de kullanım sınırıyla kesilmiştir (döküm `c8b74769…`, `"error":"rate_limit"`). 16:09 oturumu da aynı sınıra takılmış,
  iş yapmamıştır. Geride commit'siz `e2e/hesaplama.e2e.mjs` kalmıştır.

## 2026-10-13 18:26 — G22 DEVAM EDİYOR (başsız oturum, başladı 18:26)

- G22 DEVAM EDİYOR (başladı 18:28, adım 3). Devralma: `DURAKLAT` yok, izlenmeyen dosya 15:00 oturumunundur. Makine pilde (%75),
  boş bellek 1.494 MB, port 3123 boş.
- (14 Ekim 03:02 oturumunun eki) Bu oturum adım 3'ün kodunu, testini ve raporunu yazmış, 18:45'te tam kapıyı başlatmıştır. Kapının
  derleme adımı 736 sn sonra kırılmış, `/og/[tur]/[anahtar]` sayfaları 60 sn sınırını iki kez aşmıştır. Oturum 19:08'de ağ kesintisiyle
  (ENOTFOUND) commit'siz bitmiştir. 20:00-23:00 arasındaki dört oturum kullanım sınırına takılmış, 00:00-02:00 arasında döküm yoktur.

## 2026-10-14 03:02 — G22 DEVAM EDİYOR (başsız oturum, başladı 03:02)

- G22 DEVAM EDİYOR (başladı 03:05, adım 3 doğrulaması). Devralma: `DURAKLAT` yok, değişiklikler 18:26 oturumunundur. Makine prizdedir
  (%100), boş bellek 180-250 MB'tır (MRT ve tarayıcılar açık), port 3123 boştur.
- 03:20 adım 3 (`ca0c3c96c`): Düşük bellekte derleme denenmemiş, test `next dev -p 3124`'e karşı `E2E_TABAN` ile koşulmuştur. İki kıdem
  testi hidrasyon yarışıyla kırılmış, `aracAc()` hidrasyonu bekleyecek biçimde düzeltilmiştir. Hesaplama 9/9, `tsc` temiz, hızlı kapı
  892 testte yeşildir. Geliştirme sunucusu kapatılmış, 3124 boştur. Zaman damgalı dosyalar geri alınmıştır.
- 03:29 adım 4 (`39a86d884`): `e2e/uyelik.e2e.mjs` 6/6. 03:50 adım 5-6 (`7d0ad4d00`): `e2e/yargi.e2e.mjs` 3/3, `e2e/ders-notlari.e2e.mjs`
  4/4. Hepsi `next dev` üzerinde koşulmuştur. Açık bulgu: Kopya nottan fakülteye istemci içinde geçişte başta iki canonical kalmaktadır.
- 03:56 adım 7: Tam `npm run kalite` başlatılmıştır (boş bellek 458 MB, prizde; günlük `logs/g22-kalite-0356.log`). 18:45 kapısı
  `/ders-notlari/bogazici` sayfası üç denemede 60 sn'yi aştığı için kırılmıştı.
- (14 Ekim 06:17 oturumunun eki) Kapının dokuz test adımı yeşil geçmiş, döküm 03:58'de derleme beklenirken kayıtsız kesilmiştir. Sistem
  günlüğüne göre 04:04'te oturum kilidi açılmış, 04:42'de Windows Update (`MoUsoCoreWorker`) makineyi yeniden başlatmıştır. Derleme
  adımı sonuçsuzdur. `calis.log`'da 03:02 oturumunun bitiş satırı yoktur, 04:00 ve 05:00 oturumları başlamamıştır.

## 2026-10-14 06:17 — G22 DEVAM EDİYOR (başsız oturum, başladı 06:17)

- G22 DEVAM EDİYOR (başladı 06:21, adım 7). Devralma: `DURAKLAT` yok, değişiklikler 03:02 oturumunundur, zaman damgalı dosyalar geri
  alınmıştır. Makine pildedir (%100), boş bellek 1.198 MB'tır, 3123 ve 3124 boştur. Yalnız hasat süreci çalışmaktadır.
- 06:23 tam kapı (`logs/g22-kalite-0623.log`): Dokuz test adımı yeşildir (892 test). Derleme 1.041 sn sonra kırılmış, 11 işçiyle
  `/og/rehber/*` sayfaları ve `/ders-notlari/ankara-hacibayram` 60 sn sınırını aşmış, sonuncusu üç denemede de geçememiştir. Tarama ve
  e2e adımları derleme olmadığı için kırılmıştır. Bu, üst üste üçüncü derleme kırığıdır ve kod hatası görülmemiştir.
- 06:49: `scripts/kalite.mjs` derleme adımına `DERLEME_ISCI` (işçi başına ~250 MB boş bellek, en az 2, en çok çekirdek - 1) geçirir,
  `next.config.ts` bu değişken varsa `experimental.cpus`'a yazar. Yayın derlemesinde değişken tanımsızdır. Önce kırmızı iki test
  yazılmış, kalite testi 9/9, `tsc` temizdir. Tam kapı yeniden başlatılmıştır (`logs/g22-kalite-0650.log`, boş bellek 1.226 MB, pil %81).
- 07:11 adım 7 (`4df60d030`): Tam `npm run kalite` geçmiştir. Toplam 923 test, derleme 4 işçiyle 904 sn, `derleme-tarama` 36 sn,
  `test:e2e` 29/29 (`next start`, 91 sn). Koşucu sunucusunu kapatmış, 3123 boş kalmıştır.
- 07:13: Çift canonical bulgusu `next start -p 3123`'te iki kez yoklanmıştır. Kopya nottan fakülteye geçişte her anda tek canonical ve
  tek robots vardır, yani bulgu geliştirme sunucusuna özgüdür. Sunucu süreç ağacıyla kapatılmış, 3123 boştur. Rapor kapatılmış, TestSprite
  planları G26 notuna eklenmiştir (site yayında değildir, CLI koşulmamıştır). OTONOM.md derleme tuzağına `DERLEME_ISCI` eklenmiştir.
  Zaman damgalı dosyalar geri alınmıştır.
- **G22 tamamlanmıştır** (PLAN.md'de `[x]`). Commit'ler `4df60d030` ve bu kaydı taşıyan belge commit'idir. Sıradaki: G23 (ders
  notları kalite dalgası 2, bağımlılığı G19 `[x]`), önce alt plan `gorevler/G23.md`.
- G23 DEVAM EDİYOR (başladı 07:25). Alt plan `gorevler/G23.md` yazılmıştır (`4b1ca79fd`), on ders seçilmiştir.
- 07:35 adım 1 (`1cd58c2f7`): Ölçüm betiği `--dalga=2` almaktadır, başlangıçta on not 0-1/7'dir. Hızlı kapı 896 testte yeşildir,
  ancak 07:36'da başlayıp 08:16'da bitmiştir. Adımların toplamı ~6 dk'dır. Sistem günlüğüne göre kapak 07:17'de kapanmış, makine
  pilde modern beklemede yavaş çalışmış, kapak 08:06'da açılmıştır. Zaman damgalı dosyalar geri alınmıştır.
- Oturum 08:17'de bitirilmiştir, ağaç temizdir, 3123 ve 3124 boştur. TestSprite: değişiklik yayında değildir, koşulmamıştır.
- **G23 DEVAM EDİYOR.** Sıradaki: Adım 2, aile hukuku katmanı (`lib/ders-notlari/kanonik/aile-hukuku.mjs`, TMK).

## 2026-10-14 08:07 — çakışan oturum; G23'e dokunulmadı (başsız oturum, başladı 08:07)

- Devralmada `DURAKLAT` yoktur, makine pildedir (%65) ve boş bellek 536 MB'tır. 06:17 başsız oturumu (claude pid 4308) hâlâ
  çalışmakta olup 08:09'da `4b1ca79fd` commit'ini atmış ve G23 adım 1 dosyalarını yazmaktadır. Sistem günlüğüne göre makine
  07:17'de kapak kapanınca bekleme konumuna girmiş, 08:04'te uyanmıştır. Bu arada 06:17 çalıştırıcısı (pid 5312) ölmüş, claude
  alt süreci ise yaşamıştır. Kilit yalnız çalıştırıcı PID'ine baktığından 08:04 tetiği ikinci bir oturum açmıştır.
- Karar (en güvenli): Bu oturum G23 dosyalarına ve kapıya dokunmamıştır, zira aynı ağaçta iki oturum birbirinin testini ve
  commit'ini bozar ve 536 MB bellekle ikinci bir derleme kaldırılamaz. `scripts/otonom/calis.ps1` kilit denetiminden sonra komut
  satırında `-p` ve `OTONOM.md` taşıyan canlı `claude.exe` arar, bulursa "başsız oturum sürüyor" yazıp atlar. Süzgeç o an 4308 ve
  10064'ü bulmuş, IDE süreçlerini dışarıda bırakmıştır. BOM ve CRLF korunmuş, `ParseFile` 0 hata vermiştir.
- Sıradaki: G23, 06:17 oturumunun kaydından devam edilir.

## 2026-10-14 12:27 — G23 DEVAM EDİYOR (başsız oturum, başladı 12:27)

- G23 DEVAM EDİYOR (başladı 12:27, adım 2: aile hukuku). Devralma: `DURAKLAT` yok, ağaç temiz, başka başsız oturum yoktur (yalnız IDE
  oturumu açıktır). Makine prizdedir (%56), boş bellek 786 MB'tır, 3123 ve 3124 boştur.
- 13:01 adım 2: aile hukuku (`f19a3a51b`), borçlar özel (`258244281`) ve medeni başlangıç (`e4e85f767`) katmanları ve birer şeması
  yazılmıştır, üçü de 7/7'dir. Her commit'ten önce hızlı kapı 897 testte yeşildir. Sıradaki: kıymetli evrak (TTK).
- 13:09: Kıymetli evrak katmanı ve çekte ibraz şeması commit edilmiştir (`61771322c`). Oturum 13:11'de sigorta katmanını yazarken
  kullanım sınırıyla kesilmiştir (döküm `05b8c195…jsonl`, `"error":"rate_limit"`). Katman dosyası izlenmeyen, test listesi ve bu kayıt
  commit'siz kalmıştır.

## 2026-10-14 22:05 — G23 DEVAM EDİYOR (başsız oturum, başladı 22:05)

- G23 DEVAM EDİYOR (başladı 22:05, adım 2: sigorta hukuku). Devralma: `DURAKLAT` yok, başka başsız oturum yoktur (IDE oturumu ve
  claude-mem gözlemcisi açıktır). Ağaçtaki üç değişiklik 13:11'de kesilen G23 oturumuna aittir ve sürdürülmektedir. Makine pildedir
  (%62), boş bellek 415 MB'tır, 3123 ve 3124 boştur. Bu bellekle tam kapı kaldırılamayacağından yalnız hızlı kapı koşulur.
- 22:25 adım 2 (`f76aea6b4`): Sigorta katmanının bütün önermeleri TTK m.1420-1490 metniyle tek tek karşılaştırılmış, m.1421 ile
  m.1430-1431 arasında çelişki görülmemiştir. Katman kaydedilmiş (önce kırmızı test), `rizikodan-tazminata` şeması (TTK m.1446, 1427,
  1472, 1420) eklenmiştir. Temsilci not 7/7'dir, dalga 2'de beş ders tamamdır. Hızlı kapı 897 testte yeşildir, ancak pilde ve düşük
  bellekte ~22 dk sürmüştür (`logs/g23-hizli-2210.log`). Zaman damgalı `priority-sitemap.xml` geri alınmıştır.
- 22:35: Ceza özel katmanı ve hırsızlıkta inceleme sırası şeması commit edilmiştir (`27e24859f`). Ceza muhakemesi katmanı yazılıp
  kaydedilmiş, hızlı kapı lint adımındayken makine 22:38'de uykuya geçmiştir (Kernel-Power 42, «Application API»). Katman dosyası
  izlenmeyen, kayıt, test listesi ve bu kayıt commit'siz kalmıştır.

## 2026-10-15 09:43 — G23 DEVAM EDİYOR (başsız oturum, başladı 09:43)

- G23 DEVAM EDİYOR (başladı 09:43, adım 2: ceza muhakemesi). Devralma: `DURAKLAT` yok, başka başsız oturum yoktur (IDE oturumu ve
  claude-mem gözlemcisi açıktır). Ağaçtaki dört değişiklik 22:38'de kesilen G23 oturumuna aittir ve sürdürülmektedir. Makine 09:36'da
  uyanmıştır, pildedir (%38) ve boş bellek 558 MB'tır, 3123 ve 3124 boştur. Pil %50'nin altında olduğundan tam kapı başlatılmaz.
- 10:06 adım 2 (`053693254`): Ceza muhakemesi katmanının 22 dayanağı ve metindeki fıkra-bent göndermeleri CMK metniyle tek tek
  karşılaştırılmıştır. Uzlaştırma olayındaki "komşunun bahçesinden bisiklet" kurgusu TCK m.142/2-h kapsamında nitelikli hırsızlık
  sayılabileceğinden ve bu hâlde uzlaştırma dışında kalacağından olay, ödünç bisikletin satılması biçiminde yeniden yazılmıştır. Sonuç
  artık hırsızlık ve güveni kötüye kullanma nitelendirmelerinin ikisinde de aynıdır (CMK m.253/1-b-6, 7, TCK m.155/1). Temsilci not 7/7,
  hızlı kapı 897 testte yeşildir (`logs/g23-hizli-0950.log`, pilde ~15 dk). Zaman damgalı `priority-sitemap.xml` geri alınmıştır.
- 10:09 adım 2: Tüketici hukuku katmanı yazılmış ve kaydedilmiştir (önce kırmızı test). Dört olay ayıplı malda altı aylık karine ve
  değiştirme hakkını, mesafeli sözleşmede bildirilmeyen cayma hakkını, tüketici kredisinde muacceliyet koşullarını ve hakem heyeti
  sınırının üzerindeki uyuşmazlıkta dava şartı arabuluculuğu işler. 30 dayanak TKHK ve 6325 sayılı Kanun m.18/A metninde aynen
  geçmektedir. Her yıl yeniden değerlenen hakem heyeti sınırı tutar olarak yazılmamıştır (TKHK m.68/4). Temsilci not 7/7'dir.
  Aynı kapıya ceza muhakemesi ve ceza özel katmanlarındaki üç hikâye kipi düzeltmesi (YAZIM-DILI §12.2) de girmiştir. Hızlı kapı
  pil %26'dayken başlatılmıştır (`logs/g23-hizli-1013.log`).
- 10:17 (`e36310de6`, `da66a015d`): Hızlı kapı 897 testte yeşildir ve bu kez ~6 dk sürmüştür (pil %26 → %20). Tüketici katmanı ile
  hikâye kipi düzeltmesi ayrı commit edilmiştir. Kapı sürerken başsız olmayan bir oturum 10:14'te `80f2774d2` (büro telefonu: `lib/profile.ts`,
  `components/Footer.tsx`, `app/layout.tsx`, `app/avukat-fethi-guzel/page.tsx`) commit'ini atmıştır. Bu dosyalara dokunulmamıştır.
  G23 commit'leri yalnız kendi dosyalarını içerir.
- 10:17 adım 2: Arabuluculuk katmanı yazılmış ve kaydedilmiştir (önce kırmızı test). Dört olay kira uyuşmazlığında ilk toplantıya
  gelmemenin gider sonucunu, ortaklığın giderilmesinde zorunlu şerh ve dava yasağını, arabuluculuktaki kabulün delil olamamasını ve
  aile içi şiddet iddiasında elverişsizliği işler. 29 dayanak 6325 sayılı Kanun metninde aynen geçmektedir, ücret tarifesi tutarları
  yazılmamıştır. Temsilci not 7/7'dir. Hızlı kapı pil %19'dayken başlatılmıştır (`logs/g23-hizli-1021.log`).
- 10:26 (`21eb9c00a`): Hızlı kapı 897 testte yeşildir (6,5 dk). Dalga 2'de dokuz ders 7/7'dir, yalnız vergi hukuku 0/7'dir.
  OTONOM.md'ye pildeki kapı süresi ve aynı ağaçta commit atan etkileşimli oturum için iki tuzak satırı eklenmiştir.
- Oturum 10:27'de bitirilmiştir. Pil %15'e indiğinden vergi katmanı ve tam kapı başlatılmamıştır, bugün tam kapı (`npm run kalite`)
  koşulmamıştır. Ağaç temizdir, 3123 ve 3124 boştur, bu oturum sunucu başlatmamıştır. TestSprite: değişiklik yayında değildir, koşulmamıştır.
- **G23 DEVAM EDİYOR.** Sıradaki: Adım 2-3, vergi hukuku katmanı (VUK madde dosyaları okunmadan dayanak yazılmaz) ve yeni şema. Ardından
  adım 4 (aile hukuku notunun "Konsolide Master" başlığı), 5, 7. Makine prizdeyse önce `npm run kalite` koşulur.

## 2026-10-15 15:00 — G23 DEVAM EDİYOR (başsız oturum, başladı 15:00)

- G23 DEVAM EDİYOR (başladı 15:00, adım 2: vergi hukuku). Devralma: `DURAKLAT` yok, ağaç temizdir, son commit `c8f44209a`'dır.
  Makine prizdedir (%100), boş bellek 584 MB'tır, 3123 boştur. 3124'ü bu oturuma ait olmayan bir `next start` tutmaktadır
  (11:00'de `D:/yayin-tam` klasöründen başlatılmıştır, o klasörün dalı `yayin/tam-2026-10-15`'tir). Sunucuya ve klasöre dokunulmamıştır.
- 15:03-15:16 tam kapı (`logs/g23-tam-1503.log`): Tip, lint ve dokuz test takımı 897 testte geçmiş, derleme 602 sn sonra 40 hatayla
  kırılmıştır. Bütün hatalar `next/font/google` yazı tipi dosyasının çözülememesidir (`Can't resolve '@vercel/turbopack-next/internal/
  font/google/font'`, `next/font/google queries have exactly one entry`). Derleme sırasında boş bellek 143 MB'a düşmüş, derleme 2 işçiyle
  koşmuştur. Son commit'lerde yazı tipi ya da yapılandırma değişikliği yoktur ve ağ 15:17'de Google Fonts'a 200 dönmektedir. Kırık
  derleme kod hatası değil, yazı tipi indirmesinin geçici başarısızlığı sayılmış, kapı aşağıda yeniden koşulmuştur.
- 15:21 adım 2-3 (`a26685f1d`): Vergi hukuku katmanı yazılmış ve kaydedilmiştir (önce kırmızı test: dalga 2'nin tamamı kayıtlı olmalı).
  Dört olay kesilmeyen kira stopajında vergi sorumlusu ve vergi dairesini bağlamayan özel sözleşmeyi, sicilden silinen limited şirkette
  kanuni temsilci, ortak ve tasfiye memurunun sorumluluğunu, takdir komisyonuna sevkte tarh zamanaşımının durmasını ve pişmanlık ile
  ceza indirimi arasındaki farkı işler. 33 dayanak VUK ve GVK metninde aynen geçmektedir. Her yıl değerlenen parasal sınırlar ve uzlaşma
  hükümleri katmana alınmamıştır, zira depodaki `vuk/madde-376.md` dosyası ek madde metnini de taşımaktadır. `vergilendirme-sureci`
  şeması (VUK m.19-23) eklenmiştir. Şemasız ders örneği olarak vergi hukukunu kullanan birim testi adli tıpa taşınmıştır. Dalga 2'de on
  ders 7/7'dir. Hızlı kapı 897 testte yeşildir (`logs/g23-hizli-1520.log`, prizde ~1,5 dk).
- 15:26 adım 4-5 (`c74889b89`): Yirmi altı temsilci notun tamamı üreticinin "Yıllık (Konsolide Master)" etiketini taşımaktadır.
  Etiket, katman uygulanan notta başlık, açıklama, anahtar sözcük, bölüm başlığı ve paragraflardan düşmektedir (`etiketTemizle`, önce
  kırmızı test). Sayfa başlığı ve paylaşım kartı `getNote(...).h1`'den beslendiğinden kart başlığı "AÜHF Aile Hukuku Yıllık" olmuştur.
  Katmanlı 20 notta dayanaksız 316 üretilmiş konu sorusu bulunmuş olup 158'i kalıp şıklıdır ("Hocanın slaytını ezberden aktarmak").
  Bu sorular katmanlı notta çizilmemekte, kartlar korunmaktadır. Yayınlanabilirlik denetimi konu sorularına bakmadığından sayfa durumu
  değişmemiştir. Katmansız altı temsilci not ile 84 fakülte sayfasındaki 974 liste satırı etiketi taşımaya devam etmektedir. Bu kalan iş
  G25'e bırakılmıştır. Hızlı kapı 899 testte yeşildir (`logs/g23-hizli-1524.log`).

## 2026-10-15 20:32 — G23 DEVAM EDİYOR (başsız oturum, başladı 20:32)

- G23 DEVAM EDİYOR (başladı 20:32, adım 7: kapanış). Devralma: `DURAKLAT` yok, son commit `c74889b89`'dur. 15:00 oturumu kaydını,
  rapor güncellemesini ve `raporlar/g23-dayanak-denetimi.md` dosyasını commit'siz bırakarak kesilmiştir. Değişiklikler G23'e ait
  olduğundan devralınmıştır. Makine pildedir (%96), boş bellek 755 MB'tır, 3123 ve 3124 boştur.
- 20:37-21:03 adım 7 (22:00 oturumunun döküm ve günlük okumasından yazılmıştır): Aile hukuku temsilci notunda tasarım denetimi 1280 ve
  390 px'te 0'dır (`raporlar/tasarim-denetim-g23.json`). 15:40 derlemesi üzerinde uçtan uca testler 29'da 27 geçmiş, düşük bellekte
  zaman aşımına uğrayan iki dosya yeniden koşulmuş ve 10/10 geçmiştir (`logs/g23-e2e-2037.log`, `logs/g23-e2e-2105.log`). Hızlı kapı 899
  testte yeşildir (`logs/g23-hizli-2115.log`). 21:04'te tam kapı başlatılmış, oturum ise 21:17'de ağ kesintisiyle (`ENOTFOUND`, döküm
  `4914c489…jsonl`) sonlanmıştır. Süreç ağacı kapanınca derleme 497. saniyede iletisiz ölmüş, kapı "KIRIK" yazmıştır
  (`logs/g23-tam-2104.log`). Kırık kod hatası değildir. Bu kayıt ve rapor commit'siz kalmıştır.

## 2026-10-15 22:00 — G23 DEVAM EDİYOR (başsız oturum, başladı 22:00)

- G23 DEVAM EDİYOR (başladı 22:00, adım 7: kapanış). Devralma: `DURAKLAT` yok, son commit `c74889b89`'dur, ağaçtaki değişiklikler
  20:32 oturumuna aittir ve devralınmıştır. Makine pildedir (%47, şarj olmuyor), boş bellek 365 MB'tır, 3123 ve 3124 boştur, çalışan
  `node` süreci yoktur. Pil %50'nin altında olduğundan tam kapı başlatılmamıştır (OTONOM.md, uyku tuzağı).
- 22:05: 20:32 oturumunun kaydı ve raporu tamamlanmış, derlemenin yeniden ürettiği üç harita ile iki veri dosyası geri alınmış, G23 belgeleri
  commit edilmiştir (`e253dcc9e`). Kod değişikliği olmadığından hızlı kapı koşulmamıştır.
- 22:15: Kısa iş olarak G24 (erişilebilirlik) alt planı `gorevler/G24.md`'ye yazılmıştır, görev başlatılmamıştır. Ön bulguya göre
  atlama bağlantısının hedefi (`#main-content`) ortak yerleşimde değil sayfa dosyalarındadır, ders notu sayfaları, `/ara` ve
  `/gizlilik` için karşılık bulunamamıştır. Bu durum G24'ün 3. adımında tarayıcıda doğrulanacaktır.
- **G23 DEVAM EDİYOR.** Kabul ölçütünden yalnız `npm run kalite`'nin yeşil sonucu eksiktir. Sıradaki oturum makine prizdeyse ya da pil
  %50'nin üzerindeyse önce boş belleği denetler, sonra tam kapıyı ön planda bitişini bekleyerek koşar. Kapı yeşilse PLAN.md'de G23 `[x]`
  yapılır ve G24'e geçilir.

## 2026-10-16 10:02 — G23 DEVAM EDİYOR, G24 1. adım (başsız oturum, başladı 10:02)

- G23 DEVAM EDİYOR, G24 DEVAM EDİYOR (başladı 10:05, kısa iş: 1. adım). Devralma: `DURAKLAT` yok, ağaç temizdir. Son iki commit
  (`aa6e15c00`, `b83d1c34e`) ile `76ba645f9` birleştirmesi etkileşimli oturuma aittir. Makine pildedir (%20, şarj olmuyor), boş bellek
  833 MB'tır, 3123 ve 3124 boştur, yalnız hasat motoru ve MCP süreçleri çalışmaktadır. Pil %50'nin altında olduğundan tam kapı
  başlatılmamıştır.
- 10:05-10:13 G24 1. adım: `lib/erisilebilirlik.mjs` (başlık sırası, işaret bölgeleri, odak görünürlüğü) ve dokuz birim testi
  `lib/__tests__/erisilebilirlik.test.mjs`'e yazılmıştır. Testler önce kırmızı (modül yok), sonra 9/9 yeşildir. İki dosyada ESLint
  temizdir, `test:quality` takımı 398 testte yeşildir (`logs/g24-quality-1011.log`). Modülü henüz hiçbir sayfa ya da betik
  çağırmamaktadır.
- Pil 10:04'te %20, 10:09'da %17'dir (5 dk'da %3). Hızlı kapı pilde 6-15 dk sürdüğünden kapı ortasında uyku riski görülmüş ve kapı
  koşulmamıştır. Bu yüzden commit `wip:` önekiyle atılmıştır (`e1a52d631`). Sıradaki oturum hızlı kapıyı koşar ve kayda yazar.
- **G23 DEVAM EDİYOR** (yalnız `npm run kalite` eksik), **G24 DEVAM EDİYOR** (1. adım bitti, sıradaki 2. adım). Sıradaki oturum makine
  prizdeyse ya da pil %50'nin üzerindeyse önce tam kapıyı ön planda koşar. Kapı yeşilse G23 `[x]` yapılır ve G24 2. adıma geçilir.

## 2026-10-16 11:00 — G23 ve G24 DEVAM EDİYOR, iş yapılmadı (başsız oturum, başladı 11:00)

- Devralma: `DURAKLAT` yok, ağaç temizdir, son commit `e2fb36fbb`'dir. 3123 ve 3124 boştur, boş bellek 834 MB'tır. Makine pildedir
  (`BatteryStatus` 1) ve şarj %4'tür, yani 10:09'daki %17'den bu yana düşüş sürmüştür. Kapanma her an gerçekleşebileceğinden ne tam kapı
  ne hızlı kapı ne de G24 2. adımı başlatılmış, oturum yalnız bu kaydı commit ederek kapanmıştır.
- Kullanıcıya not: Makine 10:00'dan beri prize takılı değildir ve otonom oturumlar pil yüzünden iki saattir kapı koşamamaktadır
  (`raporlar/kullaniciya-sorular.md`).
- **G23 DEVAM EDİYOR** (yalnız `npm run kalite` eksik), **G24 DEVAM EDİYOR** (1. adım `wip:` commit'tedir, hızlı kapısı eksik). Sıradaki
  oturum makine prizdeyse önce hızlı kapıyı, sonra tam kapıyı ön planda koşar.

## 2026-10-16 22:00 — G23 ve G24 DEVAM EDİYOR (başsız oturum, başladı 22:00)

- G23 DEVAM EDİYOR, G24 DEVAM EDİYOR (başladı 22:00, önce hızlı kapı, sonra tam kapı).
- Devralma: `DURAKLAT` yok, ağaç temizdir, son commit `fd001bf7a`'dır. Makine prizdedir (`BatteryStatus` 2, %100), boş bellek 462 MB'tır,
  3123 ve 3124 boştur, yalnız hasat motoru ve MCP süreçleri çalışmaktadır.
- 22:02-22:06: G24 1. adımın (`e1a52d631`) hızlı kapısı 909 testte yeşildir (`logs/g24-hizli-2202.log`).
- 22:07-22:24: Tam kapı 938 testte yeşildir. Derleme iki işçiyle 840 sn, uçtan uca adımı 29/29'dur (`logs/g23-tam-2207.log`). G23 PLAN.md'de
  `[x]` yapılmış, rapora kapanış satırı eklenmiş, soru 26 düşmüştür. Derlemenin yeniden ürettiği beş dosya geri alınmıştır. Commit `c1cc4d8bc`.
- 22:25-22:36 G24 2. adım: `yapiDenetimi` ve `yapiOzeti` beş yeni testle (önce kırmızı) `lib/erisilebilirlik.mjs`'e,
  `--yapi` seçeneği `scripts/tasarim-denetim.mjs`'e eklenmiştir. G23 derlemesinde 17 sayfa × 2 genişlikte axe ihlali 0'dır. Yapı
  taraması atlama hedefi eksikliği (6 tür), başlık düzeyi atlaması (ana sayfa, kavram, madde), `header-yok` (12 tür) ve `footer-yok`
  (madde) bulmuştur (`raporlar/erisilebilirlik-g24-once.json`). Commit `789f4c562`.
- 22:30-22:36 düzeltme: 17 dosyadaki 18 `<main>`'e `id="main-content"` verilmiş, statik test önce 18 konumla kırmızı, sonra yeşildir. Commit
  `47fdc3fd8`. Bu sırada başlatılan bir hızlı kapı, yeni kırmızı testi okuyacağından durdurulmuş ve düzeltmeden sonra yeniden koşulmuştur
  (916 test yeşil).
- 22:38-22:47 düzeltme: ana sayfa kartları ve güncel kartları `h3`, kavram sayfasındaki cevap kutusu `h2` olmuştur (`ShareableAnswer`'a
  `duzey` özelliği). `next dev -p 3124` üzerinde altı sayfada atlama ve düzey bulgusu kalmamıştır. Hızlı kapının ilk koşusu tip adımında
  kırılmıştır: Kapatılan geliştirme sunucusunun yarım bıraktığı `.next/dev/types/validator.ts` silinince 918 testte yeşildir
  (tuzak OTONOM.md'ye eklendi). Commit `ba3e99fb3`.
- 22:48-22:54 G24 3. adım: `e2e/erisilebilirlik.e2e.mjs` (beş test). Menü testi önce kırmızıdır, `Navbar`'a `Escape` dinleyicisi,
  `aria-expanded`, `aria-controls` eklenince beşi yeşildir. Odak halkaları CSS ile kapatılınca ölçüm `false` döner. Hızlı kapı 918 testte
  yeşildir. Commit `3b3a592df`.
- 22:55-23:06 tam kapı 952 testte yeşildir. Derleme beş işçiyle 466 sn, uçtan uca adımı 34/34'tür (`logs/g24-tam-2255.log`). Araya giren
  commit yoktur, 3123 ve 3124 boştur.
- **G23 tamamlandı.** **G24 DEVAM EDİYOR** (1-3. adım bitti, sıradaki 4. adım: etkileşim sonrası axe). Açık bulgular `gorevler/G24.md`'dedir:
  madde sayfası (bağımsız HTML, alt bilgi ve atlama bağlantısı yok, şerh başlıkları `h2`'den `h4`'e atlar), `header-yok` kararı ve içtihat
  sayfasında 390 px'teki küçük hedef. Bunlar 6. adımda ele alınır.

## 2026-10-17 00:00 — G24 DEVAM EDİYOR (başsız oturum, başladı 00:00)

- G24 DEVAM EDİYOR (başladı 00:00, 4. adım: etkileşim sonrası axe).
- Devralma: `DURAKLAT` yok, ağaç temizdir, son commit `c54c50f29`'dur. Makine prizdedir (%100), boş bellek 985 MB'tır, 3123 ve 3124 boştur.
- 00:05-00:20 G24 4. adım: `e2e/erisilebilirlik.e2e.mjs`'e beş test eklenmiştir (mobil menü açık, mevzuat açılır menüsü açık, arama
  sonucu, kıdem aracında ters tarih, aile hukuku notunun kısa testi). `next dev -p 3124` üzerinde beşi de önce kırmızıdır. Bulgular üç ciddi
  axe ihlalidir (mobil menüde üyelik bağlantısı ve arama sonucundaki "Şerh hazır" etiketinde kontrast, açılır menü bağlantılarında 24 px
  hedef ölçüsü). Bunlara axe'nin görmediği iki sorun eklenmiştir: Kıdem aracındaki ileti duyurulmamakta, kısa testte seçim ve sonuç
  yalnız renkle verilmektedir. Düzeltmeler üç ayrı commit'tir (`65cce1fd3`, `d24ef44d7`, `6a3b9e856`), testler ve görüntüler
  `4466747dc`'dedir. Düzeltmelerden sonra beşi de yeşildir. Ayrıntı ve tablo `gorevler/G24.md`'dedir.
- 00:22-00:27 hızlı kapı 962 testte yeşildir (`logs/g24-hizli-0022.log`, kapatılan geliştirme sunucusunun `validator.ts`'i önceden silinmiştir).
- 00:29-00:48 tam kapı 1001 testte yeşildir. Derleme dört işçiyle 848 sn, uçtan uca adımı 39/39'dur (`logs/g24-tam-0029.log`). Makine
  kapı başlarken pile geçmiştir (%91). Derlemenin yeniden ürettiği beş dosya yalnız zaman damgası taşıdığından geri alınmıştır.
- Başka oturum: Ağaçta bu oturuma ait olmayan değişiklikler vardır (`.gitignore`, `package.json`, `scripts/kalite.mjs`,
  izlenmeyen `scripts/karar-arama/`, çalışan `scripts/karar-arama/sunucu.mjs`). Kapı yeni `test:karar-arama` adımını da koşmuş ve
  44/44 yeşil bulmuştur. Bu dosyalara dokunulmamış, commit'lere eklenmemiştir. Araya giren commit yoktur.
- **G24 DEVAM EDİYOR** (1-4. adım bitti, sıradaki 5. adım: 320 px yeniden akış ve azaltılmış hareket). 6. adıma devredilen yeni bulgu:
  1280 px'te mevzuat açılır menüsü sağ kenardan taşmaktadır. Kayıt commit'i `dff3ad96d`.
- 00:50-01:00 G24 5. adım: `genislikSec` (test önce kırmızı) ve `tasarim-denetim --genislik=320` eklenmiştir (`ba9835234`). 17 sayfanın
  320 px taramasında axe ihlali ve küçük hedef 0, taşan tek sayfa madde (350 px) çıkmıştır. Nedeni şerhteki boşluksuz yazar dizisidir,
  `main`'e `overflow-wrap:anywhere` verilmiştir (`bb823d00b`). Mevzuat açılır menüsü `nav`'a göre ortalanmış, düğmeye `aria-controls`
  verilmiştir (`57433374d`). Uçtan uca dosyasına 320 px yeniden akış ve azaltılmış hareket testleri eklenmiş, masaüstü menü testi panel
  sınırını da iddia etmektedir (`f5d709218`). Yeniden akış ve menü testleri geliştirme sunucusunda önce kırmızı, sonra yeşildir.
  Hareket testi, CSS kuralı önceden bulunduğundan ilk koşuda yeşildir. Ayrıntı `gorevler/G24.md`'dedir.
- 01:00-01:01 hızlı kapı 963 testte yeşildir (`logs/g24-hizli-0100.log`).
- 01:03-01:21 tam kapı 1004 testte yeşildir. Derleme dört işçiyle 763 sn, uçtan uca adımı 41/41'dir (`logs/g24-tam-0103.log`). Derlemenin
  yeniden ürettiği dosyalar geri alınmıştır. `public/priority-sitemap.xml` bir kez de derlemesiz, içeriği aynı kalıp yalnız satır sonu
  değişmiş olarak görülmüş ve geri alınmıştır. Makine pildedir (01:21'de %70). Başka oturumun dosyaları yine dokunulmadan bırakılmıştır,
  araya giren commit yoktur, 3123 ve 3124 boştur.
- **G24 DEVAM EDİYOR** (1-5. adım bitti, sıradaki 6. adım). Açık bulgular: madde sayfasının bağımsız HTML'i (`duzey-atlama`,
  `footer-yok`, atlama bağlantısı yok), `header-yok` kararı (WCAG şartı değildir) ve fareyle tıklamanın açılır menüyü `mouseenter`
  sonrası kapatması. Ardından 7. adım (kapanış raporu `raporlar/g24-erisilebilirlik.md`) gelir.

## 2026-10-17 02:00 — G24 DEVAM EDİYOR (başsız oturum, başladı 02:00)

- G24 DEVAM EDİYOR (başladı 02:00, 6. adım: madde sayfası, `header-yok`, açılır menü tıklaması).
- Devralma: `DURAKLAT` yok, son commit `fa5b4d8c7`'dir. Ağaçta yalnız başka oturumun dosyaları vardır (`.gitignore`, `package.json`,
  `scripts/kalite.mjs`, izlenmeyen `scripts/karar-arama/`); bunlara dokunulmamıştır. Makine pildedir (%62), boş bellek 813 MB'tır,
  3123 ve 3124 boştur.
- 02:02-02:25 G24 6. adım: Yapı toplayıcısı `lib/erisilebilirlik.mjs`'e `yapiTopla` olarak taşınmış, `header` ve `footer` yalnız
  `banner` ve `contentinfo` olduklarında sayılmakta, atlama bağlantısı olmayan sayfa `atlama-yok` bulgusu vermektedir. Yeni sayımla
  `header-yok` 16 sayfada, ana sayfada ayrıca `footer-yok` çıkmıştır, zira ana sayfada `Navbar` ve `Footer` `main`'in içindeydi ve
  atlama bağlantısı gezinmeyi atlamıyordu. Uçtan uca dosyasına üç test eklenmiş (yapı bulgusuz, madde atlama bağlantısı, fareyle
  tıklanan menü açık kalır), üçü de `next dev -p 3124` üzerinde önce kırmızıdır. Düzeltmeler: `Navbar` kökü `<header>` içindedir, ana
  sayfada `Navbar` ve `Footer` `main` dışındadır, madde sayfasında şerh başlıkları `baslikDuzeyleriniDuzle` ile h3'ten başlar, sayfaya
  atlama bağlantısı, `main#main-content` ve `<footer>` eklenmiştir, fareyle açılan mevzuat menüsünü aynı ziyaretteki tıklama kapatmaz.
  Sonra erişilebilirlik dosyası 15/15, mevzuat dosyası 4/4 yeşildir. Önce/sonra görüntüleri `raporlar/gorsel/g24-yapi-*.jpg`'dir, ana
  sayfa yüksekliği değişmemiştir. Commit'ler `0134702cd` (kurallar ve testler), `8c0ca0c5f` (madde), `2316da152` (gezinme ve ana sayfa).
- 02:19-02:27 hızlı kapı 967 testte yeşildir (`logs/g24-hizli-0219.log`). Geliştirme sunucusu kapatılmış, `validator.ts` silinmiştir.
  Derlemesiz değişmiş görünen `public/priority-sitemap.xml` (yalnız satır sonu) geri alınmıştır. Araya giren commit yoktur.
- **G24 DEVAM EDİYOR** (1-6. adım bitti, sıradaki 7. adım: kapanış taraması, tam kapı, rapor `raporlar/g24-erisilebilirlik.md`).
  Tam kapı makine %51 pildeyken bu oturumda denenmektedir, sonucu aşağıdaki satırdadır.
- 02:29-02:48 tam kapı 1011 testte yeşildir. Derleme dört işçiyle 812 sn, uçtan uca adımı 44/44'tür (`logs/g24-tam-0229.log`). Derlenmiş
  sitede yeni yapı testi on yedi sayfada bulgusuzdur, yani geliştirme sunucusunda bir kez görülen `ders-notu` `footer-yok` bulgusu
  tekrarlanmamıştır. Derlemenin yeniden ürettiği beş dosya yalnız zaman damgası taşıdığından geri alınmıştır. Başka oturumun dosyaları
  dokunulmadan bırakılmıştır, araya giren commit yoktur, 3123 ve 3124 boştur.
- **G24 DEVAM EDİYOR** (1-6. adım bitti, sıradaki 7. adım). Kapı bittiğinde makine %42 pildeydi. `next start` ile iki genişlikte kapanış
  taraması (`node scripts/tasarim-denetim.mjs --etiket=g24 --yapi`) uzun iş sayıldığından başlatılmamıştır. Sonraki oturum prizdeyken
  taramayı koşar ve `raporlar/g24-erisilebilirlik.md` raporunu yazar. Önce/sonra tablosunun dayanakları `gorevler/G24.md`'dedir.

## 2026-10-17 03:00 — G24 DEVAM EDİYOR (başsız oturum, başladı 03:00)

- G24 DEVAM EDİYOR (başladı 03:01, 7. adım: kapanış taraması ve rapor).
- Devralma: `DURAKLAT` yok, son commit `c8f0ad234`'tür. Ağaçta yalnız başka oturumun dosyaları vardır (`.gitignore`, `package.json`,
  `scripts/kalite.mjs`, izlenmeyen `scripts/karar-arama/`); bunlara dokunulmamıştır. Bu değişiklikler kapıya `test:karar-arama` adımını
  eklemektedir. Makine pildedir (%40), boş bellek 880 MB'tır, 3123 ve 3124 boştur. Tam kapı 02:29'da bugünkü kodla yeşil geçtiğinden
  yeniden koşulmamış, `.next` derlemesi (02:36) kapanış taramasına kullanılmıştır. Tarama 153 sn sürdüğünden kısa iş sayılmıştır.
- 03:02-03:05 kapanış taraması (`node scripts/tasarim-denetim.mjs --etiket=g24 --yapi`, `next start -p 3123`): 17 sayfa × 2 genişlikte
  axe ihlali 0, yapı bulgusu 0, taşma yoktur. İçtihat sayfasında 390 px'te "Kaynak" bağlantısı 73×16 px ölçülmüştür, sayfa günlük veriyle
  değiştiğinden bulgu 00:52 taramasında görülmemişti. Statik test önce kırmızı (0/2), kart altındaki iki bağlantıya `inline-flex` ve
  `min-h-6` verilince yeşildir (`b8d5403b6`). Derleme pilde uzun iş olduğundan doğrulama `next dev -p 3124` üzerinde yapılmıştır: küçük
  hedef 0, on "Kaynak" bağlantısının hepsi 73×24 px. Sunucular kapatılmış, `validator.ts` silinmiştir.
- 03:10-03:14 hızlı kapı 969 testte yeşildir (`logs/g24-hizli-0315.log`). Derlemesiz değişmiş görünen `public/priority-sitemap.xml`
  (yalnız satır sonu) geri alınmıştır. Araya giren commit yoktur.
- **G24 BİTTİ** (`PLAN.md` `[x]`). Kapanış raporu `raporlar/g24-erisilebilirlik.md`'dedir. Kabul ölçütünün beşi de karşılanmıştır, düzeltilen
  hedefin derlenmiş sitede yeniden ölçümü G25'e not edilmiştir. Sıradaki görev G25'tir (son regresyon, bağımlı: hepsi). Bağımlılıkları
  sonraki oturum `PLAN.md`'de denetler. Tam kapı ve Lighthouse içerdiğinden makine prizdeyken başlatılır.

## 2026-10-17 04:00 — G25 DEVAM EDİYOR (başsız oturum, başladı 04:00)

- G25 DEVAM EDİYOR (başladı 04:05, alt plan `gorevler/G25.md`).
- Devralma: `DURAKLAT` yok, son commit `142051bb6`'dır. Ağaçta yalnız başka oturumun dosyaları vardır (`.gitignore`, `package.json`,
  `scripts/kalite.mjs`, izlenmeyen `scripts/karar-arama/`); bunlara dokunulmamıştır. Makine pildedir (%25), boş bellek 826 MB'tır,
  3123 ve 3124 boştur. G00 ve G08 ajanın kapatabileceği iş olmadığından G25'in önünde engel sayılmamış, karar soru 27'ye yazılmıştır.
- 04:03-04:08 2. ve 3. adım: Alt bilgideki iki uyum beyanı ("Reklam Yasağına Uygundur.", "Reklam yasağına uygundur; sonuç vaadi
  içermez.") G16 kararıyla kaldırılmıştır. `anasayfa-sayilar.test.mjs` artık `components/Footer.tsx`'i de taramakta olup önce kırmızıdır
  (üç eşleşme), sonra yeşildir. `DENETIM_SAYFALARI`'na `akademik-profil` ve `eserlerim` eklenmiş, sayfa sayısı 19'a çıkmıştır. İki
  sayfa derlenmiş sitede ilk kez sonraki tam kapının uçtan uca erişilebilirlik adımında ölçülecektir.
- 04:10 4. adım (yalnız kaynak okuması): `app/[category]` altındaki üç alan ve on dört alt alan sayfası yönlendirme dışındadır,
  `sitemap.xml`'de durmaktadır ve hiçbir denetim listesinde yoktur. Alan sayfasında `h1`'den `h3`'e atlama ve düşük karşıtlık
  görülmüştür. Düzeltme ile `/mevzuat`'a 308 yönlendirme arasındaki seçim SEO taramasına bırakılmıştır (`gorevler/G25.md`).
- 04:09-04:12 hızlı kapı 969 testte yeşildir (`logs/g25-hizli-0412.log`). Derlemesiz değişmiş görünen `public/priority-sitemap.xml`
  geri alınmıştır. Commit `7829c6d6f`'dir, araya giren commit yoktur. Başka oturumun dosyalarına dokunulmamıştır.
- **G25 DEVAM EDİYOR** (1-3. adım bitti, 4. adımın kararı bekliyor). Pil %20 olduğundan tam kapı başlatılmamıştır. Sıradaki oturum
  prizdeyken 5. adımla (`npm run kalite`) başlar, sonra aynı derlemeyle 6. adımın dört ölçümünü koşar.

## 2026-10-18 15:00 — G25 DEVAM EDİYOR (başsız oturum, başladı 15:00)

- G25 DEVAM EDİYOR (başladı 15:03, 5. adım: tam kapı).
- Devralma: `DURAKLAT` yok, son commit `7829c6d6f`'dir. Önceki oturumun 04:12 kaydı (`ILERLEME.md`, `gorevler/G25.md`) commit'lenmemişti,
  bu oturumun commit'ine katılır. Başka oturumun dosyalarına (`.gitignore`, `package.json`, `scripts/kalite.mjs`, `scripts/karar-arama/`)
  dokunulmamıştır, `npm audit fix` kök `package.json`'u değiştirmemiştir. Makine pildedir (%81), boş bellek 1,1 GB'tır, 3123 ve 3124 boştur.
- 15:04-15:27 ilk tam kapı 1009/1011'dir (`logs/g25-tam-1504.log`). Kırık iki uçtan uca test, listeye 3. adımda giren `/eserlerim`'de başlık
  düzeyi atlaması ve 320 px'te 336 px taşma bulmuştur. Düzeltme, 4. adımın 308 yönlendirmesi (soru 28) ve iki `npm audit fix`
  (site `source-map-js`, mobil `@capacitor/android` kritik açığı) ayrıntısıyla `gorevler/G25.md`'dedir. 15:34'te ikinci tam kapı başlatılmıştır.
- 15:34-16:01 ikinci tam kapı 1015 testte yeşildir, uçtan uca 44/44'tür (`logs/g25-tam-1534.log`). Derlenmiş sitede eski alan adresleri 308
  ile kanun sayfasına gitmekte, ücretli indeks üyeliksiz 401 dönmekte, güvenlik başlıkları yerinde durmaktadır. Derlemenin değiştirdiği
  site haritaları ve iki veri dosyası geri alınmıştır. Commit'ler `d47d6602c`, `00afbb0ab`, `70cbc763b`'dir, araya giren commit yoktur.
  Hasat motoru çalışmaktadır (130.860 karar, emsal ve benzersiz 49.088).
- **G25 DEVAM EDİYOR** (1-5. adım bitti, 8. adımın bağımlılık ve başlık kısmı yapıldı). Pil %47'ye indiğinden 6. adımın ölçümleri
  başlatılmamıştır. Sıradaki oturum prizdeyken bugünkü derlemeyle 6. adımdan başlar, komutlar `gorevler/G25.md`'nin son maddesindedir.

## 2026-10-18 21:26 — G25 DEVAM EDİYOR (başsız oturum, başladı 21:26)

- G25 DEVAM EDİYOR (başladı 21:30, 8. adımın kaynak denetimi ve 9. adımın rapor taslağı).
- Devralma: `DURAKLAT` yok, son commit `dbb748e99`'dur. Ağaçta yalnız başka oturumun dosyaları vardır (`.gitignore`, `package.json`,
  `scripts/kalite.mjs`, izlenmeyen `scripts/karar-arama/`), bunlara dokunulmamıştır. Makine pildedir (%35), boş bellek 689 MB'tır, 3123 ve 3124
  boştur. Pil %50'nin altında olduğundan 6. adımın ölçümleri başlatılmamış, pilde yapılabilen 8. adım ile rapor taslağı seçilmiştir.
- 21:30-21:45 **8. adım bitti.** G04 (`8a625ea35`) ve G05 (`96947f660`) kapanışlarından bu yana güvenlikle ilgili kaynakta yalnız G14'ün indeks
  yolu ve mobilde bir etiket değişmiştir. On G04 bulgusunu `test:uyelik` 61/61, G05 değişmezlerini `test:mobil` 67/67 kilitlemektedir (15:34 kapısı).
  Yüzde kodlu adres sorusu, indeks `public/` dışında olduğundan konusuz kalmıştır. Tam `npm audit`: site üretimde 0/0, tamamında 7 yüksek;
  mobil üretimde 0, tamamında 6 yüksek. Hepsi geliştirme aracıdır (`braces` GHSA-vfj7-8cjw-p6xm zinciri ve `sharp`), ana sürüm ister ve
  gerekçesi rapordadır. Başka oturumun yerel karar arama sunucusu yalnız `127.0.0.1`'e bağlanmaktadır.
- Test sayısı düzeltmesi: 15:34 kapısının 1015 testinin 44'ü başka oturumun commit'siz `test:karar-arama` adımındandır, depodaki kodun test
  sayısı 971'dir (hedef ≥ 699).
- 9. adımın taslağı `raporlar/final.md`'dedir. Ölçüm hücreleri "6. adım" diye bırakılmış olup tahminle doldurulmamıştır. Değişiklik yalnız
  belgede olduğundan hızlı kapı koşulmamıştır (testler plan belgelerini yalnız yorumda anar). Commit `1237701ba`'dır, araya giren commit yoktur.
- **G25 DEVAM EDİYOR** (1-5. ve 8. adım bitti, 9. adımın taslağı yazıldı). Sıradaki oturum prizdeyken ya da pil %80'in üstündeyken 6. adımdan
  başlar. 16:01 derlemesinden sonra yalnız belge commit'leri atıldığından `.next` HEAD koduyla aynıdır, kapı yeniden koşulmaz.

## 2026-10-18 22:00 — G25 DEVAM EDİYOR (başsız oturum, iş başlatılmadı)

- Devralma: `DURAKLAT` yok, son commit `b43f0aef5`'tir. Ağaçta yalnız başka oturumun dosyaları vardır (`.gitignore`, `package.json`,
  `scripts/kalite.mjs`, izlenmeyen `scripts/karar-arama/`), bunlara dokunulmamıştır. `.next/BUILD_ID` 15:47 tarihli olup HEAD koduyla aynıdır.
- Makine pildedir (%19), boş bellek 221 MB'tır, 3123 ve 3124 boştur. G25'in kalan işleri (6. adımın ölçümleri, 7. adımın Lighthouse izi)
  uzun iştir ve kural gereği pilde başlatılmamıştır. 9. adımın taslağı ölçüm sonuçlarını beklemektedir. G26, G25'e bağımlı olduğundan
  seçilememiştir. Bu nedenle oturum yalnız bu kaydı yazmıştır, kod ve test değişikliği yoktur.
- **G25 DEVAM EDİYOR.** Sıradaki oturum prizdeyken ya da pil %80'in üstündeyken 6. adımdan başlar (komutlar `gorevler/G25.md`'nin
  16:02 maddesindedir).

## 2026-10-19 06:10 — G08 (pazartesi) + G25 DEVAM EDİYOR (başsız oturum, başladı 06:10)

- G25 DEVAM EDİYOR (başladı 06:15, 6. adımın ölçümleri). Makine prizdedir (`BatteryStatus` 2, %19), boş bellek 924 MB'tır.
- G26 DEVAM EDİYOR (başladı 07:00).
- Devralma: `DURAKLAT` yok, son commit `fe07a14a0`'dır. Ağaçta yalnız başka oturumun dosyaları vardır (`.gitignore`, `package.json`,
  `scripts/kalite.mjs`, izlenmeyen `scripts/karar-arama/`), bunlara dokunulmamıştır. 3123 ve 3124 boştu. Araya giren commit olmamıştır.
- **G08 (pazartesi):** Motor çalışmaktadır, düzeltme gerekmemiştir (`32fcb7507`, `raporlar/hasat-haftalik.md`). Arşiv 131.215 (haftada
  10.275), emsal ve benzersiz 49.366 (geçen hafta 43.271), captcha 12-18 Ekim arası toplam 10, disk C'de 43 GB boş alan vardır. 18 Ekim
  21:25'ten beri `getDokuman` Adalet Bakanlığı bakım sayfası dönmekte, motor 1800 sn tavanlı molalarla beklemektedir (07:12'de sürüyordu).
- 06:15-06:41 **G25 6. ve 7. adım** (16:01 derlemesi, `next start -p 3123`, sonra kapatıldı): SEO taraması 267/267 sayfa 200, canonical
  uyumsuzluğu 0, kırık iç bağlantı 0/600. Lighthouse ortalama P 79 (G06'da 47), SEO 97 (tek düşük sayfa bilinçli `noindex` kopya not).
  Tasarım denetimi 19 tür × 2 genişlikte 0 bulgu, içtihat sayfasında küçük hedef 0. `/yargi-kararlari` TBT 316-391 ms (G13'te 1.549), kalan
  uzun görevler React çatı parçasının hidrasyonudur ve yayın sonrası işe yazılmıştır. 06:44-06:58 günün tam kapısı 1015 testte yeşildir
  (`logs/g25-tam-0644.log`). Derlemenin değiştirdiği site haritaları ve iki veri dosyası geri alınmıştır. **G25 TAMAM** (`1db213607`), PLAN
  ölçüm tablosu ve `raporlar/final.md` doldurulmuştur. Lighthouse ≥ 90 hedefi tutmamış, gerekçesi rapordadır.
- 07:00-07:10 **G26 ajan payı:** `git fetch` sonrasında yerel dal 47 commit önde, uzak dal 3 günlük içtihat commit'i öndedir. `git merge-tree`
  denemesi çakışmasızdır, birleştirme yapılmamıştır. `docs/aylik-plan/PUSH-KONTROL-LISTESI.md` (kararlar, birleştirme, Vercel ortam
  değişkenleri, yayın sırası, mobil, geri alma, yayın sonrası) yazılmış, `lib/__tests__/yayin-kontrol.test.mjs` koddaki 25 ortam değişkeni
  adının listede geçtiğini ve listenin değer taşımadığını denetlemektedir (önce kırmızı, sonra 3/3). Hızlı kapı 974 testte yeşildir
  (`logs/g26-hizli-0725.log`). Yeni karar soru 29'dur. Commit `39e99d8eb`'dir.
- **G26 DEVAM EDİYOR (kullanıcı payı).** Ajanın yapabileceği iş bitmiştir. Kalan adımlar (soru 1 ve 10-13'ün yanıtı, soru 29, birleştirme,
  push, canlı doğrulama, mobil yükleme) kullanıcıyla `PUSH-KONTROL-LISTESI.md` sırasıyla yapılır. Sıradaki başsız oturumlar G08'i
  pazartesi yapar, hasat ve kapı durumunu izler; açık görev olmadığından yeni kod işi başlatılmaz.

## 2026-10-19 08:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `e651d5914`'tür ve araya giren commit olmamıştır. Ağaçta yalnız başka oturumun dosyaları vardır
  (`.gitignore`, `package.json`, `scripts/kalite.mjs`, izlenmeyen `scripts/karar-arama/`), bunlara dokunulmamıştır.
- Görev seçimi: G00 ve G26'nın kalan adımları kullanıcı eylemidir, G08 bu sabah 06:10 oturumunda yapılmıştır. Bağımlılığı bitmiş başka
  `[ ]` görev bulunmadığından kod ve test değişikliği yapılmamıştır. Günün tam kapısı 06:44'te yeşil geçtiği ve HEAD'den sonra kod
  değişmediği için kapı yeniden koşulmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 08:01): motor pid 9468 ile çalışmakta olup `getDokuman` bakım sayfası nedeniyle moladadır. Arşiv
  131.215, kuyruk 813, kalıcı hata 161, son bir saatte 429 ve ağ hatası 0'dır. Hız 6.5/dk hedefinde kalmış, ayar değiştirilmemiştir.
- Sıradaki başsız oturumlar aynı izlemeyi yapar. Tam metin servisi açıldığında motor kendiliğinden devam eder; servis 20 Ekim akşamına
  kadar kapalı kalırsa durum `raporlar/hasat-haftalik.md`'ye tek satırla yazılır.

## 2026-10-19 09:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `159ef79ac`'dir ve araya giren commit olmamıştır. Ağaçta yalnız başka oturumun dosyaları vardır
  (`.gitignore`, `package.json`, `scripts/kalite.mjs`, izlenmeyen `scripts/karar-arama/`), bunlara dokunulmamıştır. 3123 ve 3124 boştur.
- Görev seçimi 08:00 oturumuyla aynıdır: G00 ve G26'nın kalan adımları kullanıcı eylemi olup G08 bu sabah yapılmıştır. Bağımlılığı bitmiş
  başka `[ ]` görev bulunmadığından kod ve test değişikliği yapılmamış, HEAD'den sonra kod değişmediği için kapı yeniden koşulmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 09:01): motor pid 9468 ile çalışmakta olup tam metin servisi kapalı olduğu için moladadır. Arşiv
  131.215, kuyruk 813, kalıcı hata 161, son bir saatte 429 ve ağ hatası 0'dır. Son `endpoint-down` hatası 11 dk öncedir, hız ayarı
  değiştirilmemiştir.
- Sıradaki başsız oturumlar aynı izlemeyi yapar; servis 20 Ekim akşamına kadar kapalı kalırsa durum `raporlar/hasat-haftalik.md`'ye yazılır.

## 2026-10-19 10:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `c69200ef2`'dir ve araya giren commit olmamıştır. Ağaçta yalnız başka oturumun dosyaları vardır
  (`.gitignore`, `package.json`, `scripts/kalite.mjs`, izlenmeyen `scripts/karar-arama/`), bunlara dokunulmamıştır. 3123 ve 3124 boştur,
  makine prizdedir (%100) ve boş bellek 1.343 MB'tır.
- Görev seçimi önceki iki oturumla aynıdır: G00 ve G26'nın kalan adımları kullanıcı eylemi olup G08 bu sabah yapılmıştır. Bağımlılığı
  bitmiş başka `[ ]` görev bulunmadığından kod ve test değişikliği yapılmamış, HEAD'den sonra kod değişmediği için kapı koşulmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 10:01): motor pid 9468 ile çalışmakta olup tam metin servisi kapalı olduğu için moladadır. Arşiv
  131.215, kuyruk 813, kalıcı hata 161, son bir saatte 429 ve ağ hatası 0'dır. Son `endpoint-down` hatası yine 11 dk öncedir. `_state/harvester.log`
  motorun servisi 1800 sn'lik molalarla yokladığını göstermektedir (son deneme 09:50). Hız ayarı değiştirilmemiştir.
- Sıradaki başsız oturumlar aynı izlemeyi yapar; servis 20 Ekim akşamına kadar kapalı kalırsa durum `raporlar/hasat-haftalik.md`'ye yazılır.

## 2026-10-19 11:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `c5bcc4a8b`'dir ve araya giren commit olmamıştır. Ağaçta yalnız başka oturumun dosyaları vardır,
  bunlara dokunulmamıştır. 3123 ve 3124 boştur, makine prizdedir (%100) ve boş bellek 951 MB'tır.
- Görev seçimi 08:00'den beri değişmemiştir. Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiş, kapı da koşulmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 11:01): motor pid 9468 ile çalışmakta olup tam metin servisi kapalı olduğu için moladadır. Arşiv
  131.215, kuyruk 813, kalıcı hata 161 olup sayaçlar 10:00 kaydıyla aynıdır. Son yoklama 10:50'de `endpoint-down` ile dönmüş, hız ayarı
  değiştirilmemiştir.
- Dört oturumdur aynı içerikte kayıt ve commit üretildiğinden boşta kalma kuralı soru 30 olarak kullanıcıya yazılmıştır. Yanıt gelene kadar
  yordam değişmez, sıradaki oturumlar aynı izlemeyi kısa blokla sürdürür.

## 2026-10-19 12:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `c0c71bbbd`'dir ve araya giren commit olmamıştır. Başka oturumun dosyalarının değişiklik zamanı
  17 Ekim 00:13'te kalmış olup bunlara dokunulmamıştır. 3123 ve 3124 boştur, makine prizdedir (%100) ve boş bellek 748 MB'tır.
- Soru 30 yanıtlanmadığı için yordam aynen uygulanmıştır. Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiş, kapı da koşulmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 12:02): motor pid 9468 ile moladadır. Arşiv 131.215, kuyruk 813 ve kalıcı hata 161 olup sayaçlar
  11:00 kaydıyla aynıdır. Son yoklama 11:50'de `endpoint-down` ile dönmüş, hız ayarı değiştirilmemiştir.

## 2026-10-19 13:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `6614521bd`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlindedir, bunlara dokunulmamıştır. 3123 ve 3124 boştur, boş bellek 751 MB'tır.
- Önceki kayıttan tek fark güç durumudur: `Win32_Battery` `BatteryStatus` 1 döndürmüş olup makine pildedir (%94). Uzun iş planlanmadığı
  için bu durum bu oturumu etkilememiştir, sıradaki oturumlar pil %50'nin altına inerse yordamdaki kısa iş kuralını uygular.
- Soru 29 ve 30 yanıtlanmadığı için yordam aynen uygulanmıştır. Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiş, kapı da
  koşulmamıştır. Beceri gözlem günlüğünün gözden geçirmesi (son tarih 2 Ekim) gözlem 202'deki gerekçeyle ertelenmiştir.
- Hasat (`npm run yargi:hasat-durum`, 13:02): motor pid 9468 ile moladadır. Arşiv 131.215, kuyruk 813 ve kalıcı hata 161 olup sayaçlar
  12:00 kaydıyla aynıdır. Son yoklama 12:50'de `endpoint-down` ile dönmüş, hız ayarı değiştirilmemiştir.

## 2026-10-19 14:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `59a13fabd`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlindedir, bunlara dokunulmamıştır. 3123 ve 3124 boştur, boş bellek 767 MB'tır.
- Makine hâlâ pildedir (`BatteryStatus` 1) ve şarj bir saatte %94'ten %76'ya inmiştir. Bu hızla %50 eşiği 15:30 dolayında aşılır, pil de
  18:00 civarında tükenir. Makine pil nedeniyle uykuya geçerse oturumlar ve hasat motoru uyarısız durur, devralmada kesinti anı hasat
  günlüğünün son satırından okunur.
- Soru 29 ve 30 yanıtlanmadığı için yordam aynen uygulanmıştır. Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiş, kapı da
  koşulmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 14:01): motor pid 9468 ile moladadır. Arşiv 131.215, kuyruk 813 ve kalıcı hata 161 olup sayaçlar
  13:00 kaydıyla aynıdır. Son yoklama 13:50'de `endpoint-down` ile dönmüş, hız ayarı değiştirilmemiştir.

## 2026-10-19 15:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `e6c49a536`'dır ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlindedir, bunlara dokunulmamıştır. 3123 ve 3124 boştur.
- Makine pildedir (`BatteryStatus` 1) ve şarj bir saatte %76'dan %55'e inmiştir. Bu hızla %50 eşiği 15:15 dolayında aşılır, pil de 17:30
  civarında tükenir. Boş bellek 767 MB'tan 115 MB'a düşmüştür. Bunun nedeni 14:59-15:01 arasında açılan ve toplam yaklaşık 3 GB tutan
  Opera süreçleri olup makinede etkileşimli kullanım başladığını göstermektedir. Bu bellekle derleme ve tam kapı koşulamaz, sıradaki
  oturumlar uzun iş planlamadan önce belleği ve pili yeniden denetler.
- Soru 29 ve 30 yanıtlanmadığı için yordam aynen uygulanmıştır. Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiş, kapı da
  koşulmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 15:01): motor pid 9468 ile moladadır. Arşiv 131.215, kuyruk 813 ve kalıcı hata 161 olup sayaçlar
  14:00 kaydıyla aynıdır. Son yoklama 14:50'de `endpoint-down` ile dönmüş, hız ayarı değiştirilmemiştir.

## 2026-10-19 16:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `637ecfff2`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlindedir, bunlara dokunulmamıştır. 3123 ve 3124 boştur.
- Makine pildedir (`BatteryStatus` 1), şarj ise 15:00'teki %55'ten %57'ye çıkmış olup makinenin arada kısa süre prize takıldığını
  göstermektedir. Boş bellek 115 MB'tan 680 MB'a yükselmiştir. Pil %80'in, bellek de yaklaşık 1 GB'lık derleme eşiğinin altında
  kaldığından uzun iş başlatılamaz, ancak bekleyen bir ajan görevi de yoktur.
- Soru 29 ve 30 yanıtlanmadığı için yordam aynen uygulanmıştır. Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiş, kapı da
  koşulmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 16:01): motor pid 9468 ile moladadır. Arşiv 131.215, kuyruk 813 ve kalıcı hata 161 olup sayaçlar
  15:00 kaydıyla aynıdır. Son yoklama 15:50'de `endpoint-down` ile dönmüş, hız ayarı değiştirilmemiştir.

## 2026-10-19 17:00 — izleme (başsız oturum, açık ajan görevi yok, hasat yeniden çalışıyor)

- Devralma: `DURAKLAT` yok, son commit `071d4c158`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlindedir, bunlara dokunulmamıştır. 3123 ve 3124 boştur.
- Makine prizdedir (`BatteryStatus` 2) ve şarj %57'den %78'e çıkmıştır. Boş bellek 555 MB olup derleme eşiğinin altında kalmaktadır,
  ancak bekleyen bir ajan görevi bulunmadığından bu durum oturumu etkilememiştir.
- Önceki kayıttan asıl fark hasattadır. Bakanlığın tam metin servisi yeniden açılmış olup motor 16:50:25'teki yoklamada kuyruğun başına
  dönen iki kararı (Yargıtay 8. Hukuk Dairesi, E. 2025/1493 ve E. 2025/3328) indirmiş, ardından olağan taramaya geçmiştir.
  `npm run yargi:hasat-durum` (17:01) motoru pid 9468 ile çalışır, devreyi kapalı göstermektedir. Arşiv 131.274'e çıkmış, kuyruk 801'e
  inmiş, kalıcı hata 161'de kalmıştır. Son bir saatte 59 karar indirilmiş olup hız dakikada 7'dir (hedef ve tavan 7), 429 ve ağ hatası
  yoktur. Hız ayarına dokunulmamıştır, tarama 2025 yılının 82/383. penceresindedir.
- Soru 29 ve 30 yanıtlanmadığı için yordam aynen uygulanmıştır. Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiş, kapı da
  koşulmamıştır. Hasadın yeniden başlaması, soru 30'da önerilen boşta kalma kuralında da kayıt gerektiren bir değişiklik sayılmaktadır.

## 2026-10-19 21:51 — izleme (başsız oturum, açık ajan görevi yok, 17:20-21:50 arası bekleme kesintisi)

- Devralma: `DURAKLAT` yok, son commit `e8b1fef2e`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlindedir, bunlara dokunulmamıştır. 3123 ve 3124 boştur.
- 18:00, 19:00, 20:00 ve 21:00 oturumları başlamamış olup `calis.log`'da bu saatlere ait satır yoktur. Kesintinin nedeni Sistem
  günlüğündeki Kernel-Power kayıtlarından okunmuştur: Makine 17:20:01'de kapak kapanınca modern beklemeye girmiş (olay 506), 21:50:56'da
  kapak açılınca uyanmıştır (olay 507). Zamanlanmış görev uyanışta bu oturumu başlatmış olup sıradaki saatlik tetik 22:00'dedir.
- Makine prizdedir (`BatteryStatus` 2), şarj %100 ve boş bellek 835 MB'tır. Günün tam kapısı 06:44'te G25 kapsamında geçmiş, o saatten
  beri kod değişmediği için kapı yeniden koşulmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 21:53): Motor pid 9468 ile çalışmakta, devre kapalı görünmektedir. Bekleme öncesinde 17:19:09'da
  bir captcha gelmiş, motorun kendi denetleyicisi 411 sn mola vermiş ve hızı dakikada 7'den 3,5'e indirip iki saatlik tavan koymuştur.
  Bir dakika sonra makine beklemeye girdiği için motor 21:50:59'a kadar çalışmamış, uyanışta taramaya kendiliğinden dönmüştür. Arşiv
  131.382'ye çıkmış, kuyruk 802 ve kalıcı hata 161 olup 429 ve ağ hatası yoktur. Hız dakikada 3,5'tir (hedef 3,5, tavan 6), tarama 2024
  yılının 89/390. penceresindedir. Hız ayarına dokunulmamıştır.
- Soru 29 ve 30 yanıtlanmadığı için yordam aynen uygulanmıştır. Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiştir. Beceri
  gözlem günlüğünün gözden geçirmesi (son tarih 2 Ekim) gözlem 202'deki gerekçeyle yine ertelenmiştir.
- `OTONOM.md`'nin teknik tuzaklar bölümüne, kapak kapanınca gelen modern beklemenin Kernel-Power 42 değil 506/507 olaylarıyla
  izlendiğini belirten bir not eklenmiştir. Bu kayıt ilk commit'te (`90f8780cb`) yer almış, not ve bu madde ikinci commit'le girmiştir.

## 2026-10-19 22:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `f16311769`'dur ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. Makine prizdedir (`BatteryStatus` 2), şarj %100 ve boş bellek 724 MB'tır.
- Hasat (`npm run yargi:hasat-durum`, 22:01): Motor pid 9468 ile çalışmakta, devre kapalı görünmektedir. Arşiv 131.401'e çıkmış, kuyruk
  798 ve kalıcı hata 161 olup son bir saatte 429 ve ağ hatası yoktur. Hız captcha sonrası tavanla dakikada 3,5'te kalmış, tarama 2024
  yılının 90/392. penceresine ilerlemiştir. Hız ayarına dokunulmamıştır.
- Soru 29 ve 30 yanıtlanmadığı için yordam aynen uygulanmış olup seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiş, kapı da
  koşulmamıştır. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir.

## 2026-10-20 07:00 — izleme ve günün tam kapısı (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `85fa3b96d`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları (`.gitignore`,
  `package.json`, `scripts/kalite.mjs`, `scripts/karar-arama/`) 17 Ekim 00:13'teki hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124
  boştur.
- 23:00-06:00 oturumları başlamamış olup `calis.log`'da 22:02'deki bitişten sonraki ilk satır bu oturumun 07:00:03'teki başlangıcıdır.
  Makine 22:24:05'te uykuya geçmiş (Kernel-Power 42, neden «Application API»), 06:11:38'de uyanmıştır (olay 506/507).
- Hasat: Eski motor (pid 9468) son satırını uykudan hemen önce, 22:23:51'de yazmıştır. Hasat servisi uyanışta motoru 06:11:55'te ve
  06:13:15'te iki kez başlatmış, ilk süreç (pid 19960) motor günlüğüne satır yazmadan kapanmış, ikincisi (pid 28308) günlükteki 106 olayı
  yeniden oynatıp taramaya dönmüştür. 06:52:51'de gelen captcha üzerine motorun denetleyicisi 352 sn mola vermiş ve hızı dakikada 3'e
  indirip iki saatlik tavan koymuştur. `npm run yargi:hasat-durum` (07:27) arşivi 131.734, kuyruğu 812 ve kalıcı hatayı 161 olarak
  göstermekte olup son bir saatte 429 ve ağ hatası yoktur. Tarama 2024 yılının 113/407. penceresindedir, hız ayarına dokunulmamıştır.
- Günün ilk oturumu olduğundan PLAN'daki "günde en az bir kez tam kapı" kuralı uygulanmıştır. Makine pildeydi (`BatteryStatus` 1), şarj
  %85 ve boş bellek 958 MB olduğundan uzun iş eşiği engel oluşturmamıştır. `npm run kalite` 07:03:54-07:26:26 arasında 6 işçiyle koşmuş
  ve 1018 testte geçmiştir (`logs/izleme-tam-0703.log`), derleme 807 sn, e2e 215 sn sürmüştür. Test sayısı G25 kapısındaki 1015'ten,
  G26'nın `test:quality` takımına eklediği üç testle 1018'e çıkmıştır. Kapı süresince şarj %85'ten %74'e inmiştir. Derlemenin yeniden
  ürettiği beş zaman damgası dosyası (`public/*sitemap*.xml`, `publishable.json`, `site-search-index.json`) geri alınmıştır.
- Soru 29 ve 30 yanıtlanmadığı için yordam aynen uygulanmış olup seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiştir. Gözlem
  günlüğünün gözden geçirmesi (son tarih 2 Ekim, 86 açık gözlem) gözlem 202'deki gerekçeyle ertelenmiştir. Bugünkü sonraki oturumlar
  izleme yapar, kod değişmedikçe kapı yeniden koşulmaz.

## 2026-10-20 08:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `a5dbb4b62`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. Makine pildedir (`BatteryStatus` 1), şarj %66 ve boş bellek 845 MB olup
  06:11'deki uyanıştan sonra yeni bir Kernel-Power olayı görülmemiştir.
- Hasat (`npm run yargi:hasat-durum`, 08:02): Motor uyanışta başlatılan pid 28308 ile çalışmakta, devre kapalı görünmektedir. Arşiv
  131.822'ye çıkmış, kuyruk 802 ve kalıcı hata 161 olup son bir saatte 144 karar inmiş, 429 ve ağ hatası görülmemiştir. Hız 06:52'deki
  captcha sonrası tavanla dakikada 3'te kalmış, tarama 2024 yılının 118/412. penceresine ilerlemiştir. Hız ayarına dokunulmamıştır.
- Soru 29 ve 30 yanıtlanmadığı için yordam aynen uygulanmış olup seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiş, kapı
  07:00 oturumunda koşulduğu için yinelenmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir.

## 2026-10-20 09:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `63dfd38b8`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. Makine pildedir (`BatteryStatus` 1), şarj %95 ve boş bellek 763 MB'tır.
  08:10 ve 08:58'deki iki Kernel-Power 105 olayı güç kaynağı değişimini gösterdiğinden makine bu arada prizde şarj olmuş, uykuya geçmemiştir.
- Hasat (`npm run yargi:hasat-durum`, 09:03): Motor pid 28308 ile çalışmakta, devre kapalı görünmektedir. Arşiv 131.967'ye çıkmış, kuyruk
  810 ve kalıcı hata 161 olup son bir saatte 147 karar inmiş, 429 ve ağ hatası görülmemiştir. Captcha sonrası iki saatlik tavan kalktığı
  için hız dakikada 3,5'e dönmüş, tarama 2024 yılının 127/418. penceresine ilerlemiştir. Hız ayarına dokunulmamıştır.
- Soru 29 ve 30 yanıtlanmadığı için yordam aynen uygulanmış olup seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiş, kapı
  07:00 oturumunda koşulduğu için yinelenmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir.

## 2026-10-20 10:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `898d36d2d`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. Makine 08:58'deki Kernel-Power 105 olayından beri yeniden pildedir
  (`BatteryStatus` 1), şarj %84 ve boş bellek 380 MB olup uyku olayı görülmemiştir. Boş bellek derleme eşiğinin altında kaldığından bu
  oturumda uzun iş başlatılmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 10:02): Motor pid 28308 ile çalışmakta, devre kapalı görünmektedir. Arşiv 132.142'ye çıkmış, kuyruk
  799 ve kalıcı hata 161 olup son bir saatte 174 karar inmiş, 429 ve ağ hatası görülmemiştir. Denetleyici hızı 09:36'ya kadar dakikada 5,1'e
  çıkarmış, 09:50'de gelen captcha üzerine 464 sn mola vermiş ve hızı dakikada 2,6'ya indirip iki saatlik tavan koymuştur. Tarama 2023
  yılının 01-07.12.2023 penceresine geçmiş olup seçilen pencere sayısı 140/428'dir. Hız ayarına dokunulmamıştır.
- Soru 29 ve 30 yanıtlanmadığı için yordam aynen uygulanmış olup seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiş, kapı
  07:00 oturumunda koşulduğu için yinelenmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir.

## 2026-10-20 11:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `2af271877`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. Makine pildedir (`BatteryStatus` 1), şarj %73 ve boş bellek 410 MB olup son
  bir buçuk saatte Kernel-Power olayı görülmemiştir. Boş bellek derleme eşiğinin altında kaldığından uzun iş başlatılmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 11:01): Motor pid 28308 ile çalışmakta, devre kapalı görünmektedir. Arşiv 132.263'e çıkmış, kuyruk
  807 ve kalıcı hata 161 olup son bir saatte 121 karar inmiş, 429 ve ağ hatası görülmemiştir. Hız, 09:50'deki captcha üzerine konan iki
  saatlik tavanla dakikada 2,6'da kalmıştır. Tarama 2023 yılının 16-19.10.2023 penceresine ilerlemiş olup seçilen pencere sayısı
  148/435'tir. Hız ayarına dokunulmamıştır.
- Soru 29 ve 30 yanıtlanmadığı için yordam aynen uygulanmış olup seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiş, kapı
  07:00 oturumunda koşulduğu için yinelenmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir.

## 2026-10-20 12:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `7c0bcdad6`'dır ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. Makine pildedir (`BatteryStatus` 1), şarj %62 ve boş bellek 429 MB olup son
  bir buçuk saatte Kernel-Power olayı görülmemiştir. Boş bellek derleme eşiğinin altında kaldığından uzun iş başlatılmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 12:01): Motor 06:13:15'te başlayan pid 28308 ile çalışmakta, devre kapalı görünmektedir. Arşiv
  132.386'ya çıkmış, kuyruk 800 ve kalıcı hata 161 olup son bir saatte 125 karar inmiş, 429 ve ağ hatası görülmemiştir. Son captcha
  2,2 saat önce gelmiş olmakla birlikte hedef hız dakikada 2,6'da kalmıştır. Tarama 2023 yılının 01-07.07.2023 penceresine ilerlemiş olup
  seçilen pencere sayısı 157/440'tır. Hız ayarına dokunulmamıştır.
- Soru 29 ve 30 yanıtlanmadığı için yordam aynen uygulanmış olup seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiş, kapı
  07:00 oturumunda koşulduğu için yinelenmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir.

## 2026-10-20 13:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `e47866932`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. Makine 12:04 ve 12:41'deki iki Kernel-Power 105 olayıyla prize girip
  yeniden pile geçmiştir (`BatteryStatus` 1). Şarj %85 ve boş bellek 721 MB olup uyku olayı görülmemiştir. Boş bellek derleme eşiğinin
  altında kaldığından uzun iş başlatılmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 13:01): Motor pid 28308 ile 6,8 saattir çalışmakta, devre kapalı görünmektedir. Arşiv 132.568'e
  çıkmış, kuyruk 799 ve kalıcı hata 161 olup son bir saatte 181 karar inmiş, 429 ve ağ hatası görülmemiştir. 09:50'deki captcha üzerine
  konan iki saatlik tavan kalkmış, denetleyici hızı mesai saati sınırı olan dakikada 4,3'e çıkarmıştır. Tarama 2023 yılının
  16-23.03.2023 penceresine ilerlemiş olup seçilen pencere sayısı 169/449'dur. Hız ayarına dokunulmamıştır.
- Soru 29 ve 30 yanıtlanmadığı için yordam aynen uygulanmış olup seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiş, kapı
  07:00 oturumunda koşulduğu için yinelenmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir.

## 2026-10-20 14:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `0e6262aef`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. Makine pildedir (`BatteryStatus` 1), şarj %68 ve boş bellek 744 MB olup
  12:41'deki Kernel-Power 105 olayından sonra yeni güç olayı görülmemiştir. Boş bellek derleme eşiğinin altında kaldığından uzun iş
  başlatılmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 14:01): Motor pid 28308 ile 7,8 saattir çalışmakta, devre kapalı görünmektedir. Arşiv 132.775'e
  çıkmış, kuyruk 796 ve kalıcı hata 161 olup son bir saatte 210 karar inmiş, 429 ve ağ hatası görülmemiştir. Hız mesai saati sınırı olan
  dakikada 4,3'te kalmış, 24 dakika önceki son hata ise sistemde bulunamayan tek bir belgeye ilişkin `doc-error` kaydıdır. Tarama 2023
  yılından 2022 yılının 20-23.12.2022 penceresine geçmiş olup seçilen pencere sayısı 182/460'tır. Hız ayarına dokunulmamıştır.
- Soru 29 ve 30 yanıtlanmadığı için yordam aynen uygulanmış olup seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiş, kapı
  07:00 oturumunda koşulduğu için yinelenmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir.

## 2026-10-20 15:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `5171de43b`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. Makine 14:31'deki Kernel-Power 105 olayıyla prize girmiştir
  (`BatteryStatus` 2). Şarj %89 ve boş bellek 811 MB olup uyku olayı görülmemiştir. Boş bellek derleme eşiğinin altında kaldığından
  uzun iş başlatılmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 15:01): Motor pid 28308 ile 8,8 saattir çalışmakta olup ağ hatası nedeniyle moladadır. Son bir
  saatte yedi ağ hatası (kod 23) birikmiş, devre açılmış ve seviye 4 bekleme başlamıştır. En son hata 15:01'den beş dakika önce
  Yargıtay 12. Hukuk Dairesinin bir belgesinde görülmüştür. Aynı dakikada `karararama.yargitay.gov.tr` adresine yapılan tek `HEAD`
  isteği 2,4 saniyede 200 döndürdüğünden kesinti kalıcı görünmemekte, devrenin motor tarafından kapatılması beklenmektedir. Arşiv 132.918'e çıkmış,
  kuyruk 799 ve kalıcı hata 161 olup son bir saatte 143 karar inmiş, 429 görülmemiştir. Tarama 2022 yılının 01-07.11.2022 penceresine
  ilerlemiş olup seçilen pencere sayısı 192/467'dir. Hız ayarına ve motora dokunulmamış olup devrenin kapanıp kapanmadığı 16:00
  oturumunda denetlenmelidir.
- Soru 29 ve 30 yanıtlanmadığı için yordam aynen uygulanmış olup seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiş, kapı
  07:00 oturumunda koşulduğu için yinelenmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir.

## 2026-10-20 16:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `f48b76cc5`'tir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. Makine prizdedir (`BatteryStatus` 2), şarj %100 ve boş bellek 845 MB olup
  son 70 dakikada Kernel-Power olayı görülmemiştir. Boş bellek derleme eşiğinin altında kaldığından uzun iş başlatılmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 16:01): Motor pid 28308 ile 9,8 saattir çalışmakta olup 15:00 oturumunda açık bulunan devre motor
  tarafından kapatılmıştır. Son bir saatte 161 karar inmiş, 429 ve ağ hatası görülmemiştir. Hız mesai saati sınırı olan dakikada 4,3'te
  kalmıştır. Arşiv 133.079'a çıkmış, kuyruk 799 ve kalıcı hata 162 olup bir kalemlik artış 17 dakika önce sistemde bulunamayan bir
  Yargıtay 4. Hukuk Dairesi belgesinin `doc-error` kaydından doğmuştur. Tarama 2022 yılının 23-26.09.2022 penceresine ilerlemiş olup
  seçilen pencere sayısı 203/478'dir. Hız ayarına ve motora dokunulmamıştır.
- Soru 29 ve 30 yanıtlanmadığı için yordam aynen uygulanmış olup seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiş, kapı
  07:00 oturumunda koşulduğu için yinelenmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir.

## 2026-10-20 17:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `6e58f2ead`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. Makine prizdedir (`BatteryStatus` 2), şarj %100 ve boş bellek 609 MB olup
  son 75 dakikada Kernel-Power olayı görülmemiştir. Boş bellek derleme eşiğinin altında kaldığından uzun iş başlatılmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 17:01): Motor pid 28308 ile 10,8 saattir çalışmakta, devre kapalıdır. Son bir saatte 151 karar
  inmiş, 429 ve ağ hatası görülmemiştir. 16:40'ta motor yeniden captcha istemiş olup hız tavanı dakikada 4,3'ten 2,2'ye inmiştir.
  Arşiv 133.232'ye çıkmış, kuyruk 804 ve kalıcı hata 163'tür. Tarama 2022 yılının 23-26.06.2022 penceresine ilerlemiş olup seçilen
  pencere sayısı 215/487'dir. Hız ayarına ve motora dokunulmamıştır.
- Soru 29 ve 30 yanıtlanmadığı için yordam aynen uygulanmış olup seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiş, kapı
  07:00 oturumunda koşulduğu için yinelenmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir.

## 2026-10-20 19:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `f2ae2583b`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. Makine 17:46:51'de kapak kapanınca modern beklemeye girmiş (Kernel-Power
  506, `neden: Lid`), 19:02:41'de kapak açılınca çıkmıştır (507). 18:00 oturumu bu yüzden çalışmamış olup kayıt eksikliği bir hata
  değildir. Makine prizdedir (`BatteryStatus` 2), şarj %100 ve boş bellek 858 MB olup bellek derleme eşiğinin altında kaldığından
  uzun iş başlatılmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 19:03): Motor pid 28308 ile 12,9 saattir çalışmakta olup beklemeden sonra kalp atışı yeniden
  gelmiştir. Devre kapalıdır ve hız captcha tavanı olan dakikada 2,2'de kalmıştır. Son bir saatte bekleme nedeniyle yalnız 4 karar
  inmiş, 429 ve ağ hatası görülmemiştir. Arşiv 133.308'e çıkmış, kuyruk 799 ve kalıcı hata 163'tür. Tarama 2022 yılının
  01.05-31.05.2022 penceresine ilerlemiş olup seçilen pencere sayısı 221/490'dır. Hız ayarına ve motora dokunulmamıştır.
- Soru 29 ve 30 yanıtlanmadığı için yordam aynen uygulanmış olup seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiş, kapı
  07:00 oturumunda koşulduğu için yinelenmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir.

## 2026-10-20 20:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `1a7f2ec00`'dır ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. Makine prizdedir (`BatteryStatus` 2), şarj %100 ve boş bellek 722 MB olup
  19:02:41'deki kapak açılışından (507) sonra Kernel-Power olayı görülmemiştir. Boş bellek derleme eşiğinin altında kaldığından uzun
  iş başlatılmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 20:02): Motor pid 28308 ile 13,8 saattir çalışmakta, devre kapalıdır. Son captcha isteği 3,4 saat
  önce gelmiş olup hız tavanı oturumlar dokunmadan dakikada 2,2'den 3,7'ye çıkmıştır. Son bir saatte 130 karar inmiş, 429 ve ağ hatası
  görülmemiştir. Arşiv 133.434'e çıkmış, kuyruk 801 ve kalıcı hata 163'tür. Tarama 2022 yılının 01.04-15.04.2022 penceresine ilerlemiş
  olup seçilen pencere sayısı 230/498'dir. Hız ayarına ve motora dokunulmamıştır.
- Soru 29 ve 30 yanıtlanmamış olup soru dosyası 19 Ekim 11:02'den beri değişmemiştir. Yordam aynen uygulanmış, seçilebilir `[ ]` görev
  bulunmadığından kod değiştirilmemiş, kapı 07:00 oturumunda koşulduğu için yinelenmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem
  202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-20 21:44 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `6c419fb5c`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. Makine 20:29:10'da bir uygulamanın `SetSuspendState` çağrısıyla uykuya
  girmiş (Kernel-Power 187 ve 42, neden «Application API»), 21:38:45'te hazırda bekletmeden çıkmıştır (507). Power-Troubleshooter
  kaydı da aynı iki anı göstermektedir. 21:00 oturumu bu yüzden çalışmamış olup kayıt eksikliği bir hata değildir. Uyanışla birlikte
  makine prizden çıkmıştır (Kernel-Power 105, `AcOnline=false`). Şu an pildedir (`BatteryStatus` 1), şarj %95 ve boş bellek 921 MB
  olup bellek derleme eşiğinin altında kaldığından uzun iş başlatılmamıştır.
- Hasat: Motor pid 28308, uykudan 10 saniye önce 20:29:00'da `SIGHUP` alıp işteki istekleri bitirerek durmuştur. Zamanlanmış görev
  motoru uyanıştan sonra 21:38:58'de pid 9744 ile başlatmış, bu kopya `harvester.log`'a satır yazmadan sonlanmıştır. 21:44:54'te
  başlatılan pid 13720 günlükten 75 olayı yeniden oynatmış ve öğrenilmiş 3,7/dk tavanını geri yüklemiştir. Çalışan tek hasat
  kopyası budur, kilit dosyası da aynı pid'i göstermektedir. `npm run yargi:hasat-durum` (21:46) çıktısına göre devre kapalı, hız
  dakikada 3,7 olup son bir saatte uyku nedeniyle yalnız 3 karar inmiş, 429 ve ağ hatası görülmemiştir. Arşiv 133.514'e çıkmış,
  kuyruk 803 ve kalıcı hata 163'tür. Tarama 2022 yılının 01.03-15.03.2022 penceresine ilerlemiş olup seçilen pencere sayısı
  236/503'tür. Hız ayarına ve motora dokunulmamıştır.
- Soru 29 ve 30 yanıtlanmamış olup soru dosyası 19 Ekim 11:02'den beri değişmemiştir. Yordam aynen uygulanmış, seçilebilir `[ ]` görev
  bulunmadığından kod değiştirilmemiş, kapı 07:00 oturumunda koşulduğu için yinelenmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem
  202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-21 11:03 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `c9a5e3248`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur.
- 22:00-10:00 oturumları başlamamış olup `calis.log`'da 21:48'deki bitişten sonraki ilk satır bu oturumun 11:03:11'deki başlangıcıdır.
  Makine 21:49:16'da kapak kapanınca modern beklemeye girmiş (Kernel-Power 506, neden 15, `LidOpenState=false`), 23:48:43'te beklemeden
  çıkıp aynı saniyede yeniden girmiş (507/506, neden 55) ve 11:01:32'de kapak açılınca beklemeden çıkmıştır (507, neden 15).
- Hasat (`npm run yargi:hasat-durum`, 11:05): Motor pid 13720 ile 13,3 saattir çalışmakta olup bekleme boyunca kapanmamış, devre
  kapalı ve hız dakikada 3,7'dir. Uyanıştan hemen sonra bir `ENOTFOUND` ağ hatası görülmüş, 429 görülmemiştir. Arşiv 133.535'e çıkmış,
  kuyruk 797 ve kalıcı hata 163'tür. Tarama 2022 yılının 08.03-11.03.2022 penceresinde olup seçilen pencere sayısı 237/505'tir. Hız
  ayarına ve motora dokunulmamıştır.
- Günün ilk oturumu olmasına karşın tam kapı koşulmamıştır. Makine pildedir (`BatteryStatus` 1, şarj %86), boş bellek ise iki ölçümde
  605 ve 839 MB olup yaklaşık 1 GB'lık derleme eşiğinin altında kalmıştır. Dünkü 07:03 kapısından (1018 test, yeşil) bu yana yalnız
  `ILERLEME.md` değiştiğinden kapının sınayacağı kod o kapıdaki kodla aynıdır. Bugünkü oturumlardan boş belleği 1 GB'ı aşan ilki kapıyı
  koşar.
- Soru 29 ve 30 yanıtlanmamış olup soru dosyası 19 Ekim 11:02'den beri değişmemiştir. Seçilebilir `[ ]` görev bulunmadığından kod
  değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi (son tarih 2 Ekim, 89 açık gözlem) gözlem 202'deki gerekçeyle ertelenmiştir.
  Sıradaki adım, sorulardan biri yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-21 12:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `73a28c2cc`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 11:01:32'deki uyanıştan (Kernel-Power 507) sonra güç olayı görülmemiş,
  11:03 oturumu da 11:07:49'da 0 koduyla bitmiştir.
- Hasat (`npm run yargi:hasat-durum`, 12:03): Motor pid 13720 ile 14,3 saattir çalışmakta olup devre kapalı ve hız dakikada 3,7'dir.
  Son bir saatte 169 karar inmiş, 429 ve ağ hatası görülmemiştir. Arşiv 133.695'e çıkmış, kuyruk 803 ve kalıcı hata 163'tür. Tarama
  2021 yılının 16.12-23.12.2021 penceresine geçmiş olup seçilen pencere sayısı 250/515'tir. 2022 yılı «tarama» durumunda kalmıştır.
  Durum çıktısı etkin olmayan tarama yıllarını süzdüğünden (`hasat.mjs` 100. satır) 2022 «Yıllar» satırında görünmemektedir. Hız
  ayarına ve motora dokunulmamıştır.
- Tam kapı bu oturumda da koşulmamıştır. Makine pildedir (`BatteryStatus` 1, şarj %63), boş bellek ise iki ölçümde 845 ve 981 MB olup
  1 GB'lık eşiğin altında kalmıştır. Belleğin en büyük payını Opera süreçleri tutmakta olup ilk altı süreç yaklaşık 2,3 GB'tır. Son
  yeşil kapıdan (20 Ekim 07:03, 1018 test) bu yana yalnız `ILERLEME.md` değişmiştir.
- Soru 29 ve 30 yanıtlanmamış olup soru dosyası 19 Ekim 11:02'den beri değişmemiştir. Seçilebilir `[ ]` görev bulunmadığından kod
  değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri
  yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-21 13:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `c8d5ecd91`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 12:00 oturumu 12:05:46'da 0 koduyla bitmiş, makine 12:06:25'te kapak
  kapanınca modern beklemeye girmiş (Kernel-Power 506, neden 15) ve 12:12:16'da beklemeden çıkmıştır (507).
- Hasat (`npm run yargi:hasat-durum`, 13:03): Motor pid 13720 ile 15,3 saattir çalışmakta olup kısa bekleme boyunca kapanmamış, devre
  kapalı ve hız dakikada 3,7'dir. Son bir saatte 157 karar inmiş, 429 ve ağ hatası görülmemiştir. Arşiv 133.851'e çıkmış, kuyruk 802
  ve kalıcı hata 163'tür. Tarama 2021 yılının 01.11-07.11.2021 penceresinde olup seçilen pencere sayısı 261/524'tür. Hız ayarına ve
  motora dokunulmamıştır.
- Tam kapı koşulmamıştır. Makine pildedir (`BatteryStatus` 1) ve şarj %41'e inmiş olup yordamın %50 sınırının altındadır, boş bellek de
  396 MB'tır. Son yeşil kapıdan (20 Ekim 07:03, 1018 test) bu yana yalnız `ILERLEME.md` değişmiştir.
- Soru 29 ve 30 yanıtlanmamış olup soru dosyası 19 Ekim 11:02'den beri değişmemiştir. Seçilebilir `[ ]` görev bulunmadığından kod
  değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri
  yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-21 14:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `832b90992`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 13:00 oturumu 13:03:55'te 0 koduyla bitmiş, son bir buçuk saatte
  Kernel-Power olayı görülmemiştir.
- Hasat (`npm run yargi:hasat-durum`, 14:01): Motor pid 13720 ile 16,3 saattir çalışmakta olup devre kapalı ve hız dakikada 3,7'dir.
  Son bir saatte 167 karar inmiş, 429 ve ağ hatası görülmemiştir. Arşiv 134.014'e çıkmış, kuyruk 802 ve kalıcı hata 163'tür. Tarama
  2021 yılının 01.07-03.07.2021 penceresinde olup seçilen pencere sayısı 276/535'tir. Hız ayarına ve motora dokunulmamıştır.
- Tam kapı koşulmamıştır. Makine pildedir (`BatteryStatus` 1), şarj %24'e inmiş olup boş bellek 786 MB'tır. Şarj bir saatte %41'den
  %24'e düştüğünden makine prize takılmazsa yaklaşık bir saat içinde kritik düzeye inmesi ve uykuya geçmesi beklenmektedir. Bu durumda
  oturumlar ve hasat durmakta, motor uyanışta servis görevince yeniden başlatılmaktadır. Son yeşil kapıdan (20 Ekim 07:03, 1018 test)
  bu yana yalnız `ILERLEME.md` değişmiştir.
- Soru 29 ve 30 yanıtlanmamış olup soru dosyası 19 Ekim 11:02'den beri değişmemiştir. Seçilebilir `[ ]` görev bulunmadığından kod
  değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri
  yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-21 15:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `0676ff56b`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 14:00 oturumu 14:02:40'ta 0 koduyla bitmiştir. Makine 14:15:03'te kapak
  kapanınca modern beklemeye girmiş (Kernel-Power 506, neden 15), 14:15:39'da %20 şarjla prize takılmış (105) ve 14:25:10'da kapak
  açılınca beklemeden çıkmıştır (507). Priz 14:41:12'de %53 şarjla çekilmiştir.
- Hasat (`npm run yargi:hasat-durum`, 15:02): Motor pid 13720 ile 17,3 saattir çalışmakta olup bekleme boyunca kapanmamış, devre kapalı
  ve hız dakikada 3,7'dir. Son bir saatte 151 karar inmiş olup tek ağ hatası (`ENOTFOUND`, 14:15 dolayı) beklemeye giriş anına denk
  gelmektedir. Arşiv 134.169'a çıkmış, kuyruk 797 ve kalıcı hata 163'tür. Tarama 2021 yılının 01.06-03.06.2021 penceresinde olup
  seçilen pencere sayısı 287/545'tir. Hız ayarına ve motora dokunulmamıştır.
- Tam kapı koşulmamıştır. Makine yeniden pildedir (`BatteryStatus` 1), şarj %44 olup yordamın %50 sınırının altındadır, boş bellek de
  640 MB'tır. Son yeşil kapıdan (20 Ekim 07:03, 1018 test) bu yana yalnız `ILERLEME.md` değişmiştir.
- Soru 29 ve 30 yanıtlanmamış olup soru dosyası 19 Ekim 11:02'den beri değişmemiştir. Seçilebilir `[ ]` görev bulunmadığından kod
  değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri
  yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-21 16:00 — izleme ve günün tam kapısı (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `f4c3e5d03`'tür ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 15:00 oturumu 15:04:12'de 0 koduyla bitmiştir. Makine 15:35:45'te
  yaklaşık %30 şarjla prize takılmış (Kernel-Power 105, `AcOnline` true) olup sonrasında güç olayı görülmemiştir.
- Hasat (`npm run yargi:hasat-durum`, 16:02): Motor pid 13720 ile 18,3 saattir çalışmakta olup devre kapalı ve hız dakikada 3,7'dir.
  Son bir saatte 173 karar inmiş, 429 ve ağ hatası görülmemiştir. Arşiv 134.341'e çıkmış, kuyruk 797 ve kalıcı hata 163'tür. Tarama
  2021 yılının 10.04-11.04.2021 penceresinde olup seçilen pencere sayısı 298/556'dır. Yararlı karar sayısı 51.437'ye ulaşmıştır. Hız
  ayarına ve motora dokunulmamıştır.
- Günün tam kapısı bu oturumda koşulmuştur. Makine prizdeydi (`BatteryStatus` 2, şarj %57), boş bellek ise 891 MB'tı. 11:03 kaydındaki
  "1 GB'ı aşan ilk oturum kapıyı koşar" notu yordamda yer almayan bir eşik olup 20 Ekim kapısı 958 MB'ta, 6 Ekim derlemesi 777 MB'ta
  geçmiştir. `npm run kalite` derleme işçisini belleğe göre kendisi sınırladığından kapı başlatılmıştır. Kapı 16:03:05-16:19:40 arasında
  koşmuş ve 1018 testte geçmiştir (`logs/izleme-tam-1603.log`). Derleme 5 işçiyle 507 sn, e2e 186 sn sürmüş olup şarj aynı sürede %57'den
  %64'e çıkmıştır. Derlemenin yeniden ürettiği beş zaman damgası dosyası geri alınmıştır.
- Kapının yalnız bellek gerekçesiyle ertelenmesinin önüne geçmek için `OTONOM.md`'nin bellek notuna, bu gerekçeyle kapının
  ertelenmeyeceğini ve ölçülen değerin kayda yazılacağını belirten cümle eklenmiştir. Gözlem günlüğüne bu konuda gözlem 213 yazılmış
  olup gözden geçirme gözlem 202'deki gerekçeyle yine ertelenmiştir.
- Soru 29 ve 30 yanıtlanmamış olup soru dosyası 19 Ekim 11:02'den beri değişmemiştir. Seçilebilir `[ ]` görev bulunmadığından kod
  değiştirilmemiştir. Bugünkü sonraki oturumlar izleme yapar, kod değişmedikçe kapı yeniden koşulmaz. Sıradaki adım, sorulardan biri
  yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-21 17:29 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `9dbb22720`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 16:00 oturumu 16:22:35'te 0 koduyla bitmiştir. Makine 16:34:16'da kapak
  kapanınca modern beklemeye girmiş (Kernel-Power 506, neden Lid) ve 17:29:24'te kapak açılınca beklemeden çıkmıştır (507). 17:00
  oturumu bu yüzden çalışmamış olup bu oturum uyanıştan sonra 17:29:40'ta başlamıştır.
- Hasat (`npm run yargi:hasat-durum`, 17:31): Motor pid 13720 ile 19,8 saattir çalışmakta olup bekleme boyunca kapanmamış ve devre
  kapalıdır. 16:30:18'de Yargıtay 7. Hukuk Dairesinin bir kararının tam metni istenirken captcha gelmiş, yönetici de hızı 3,7'den
  dakikada 2'ye indirip iki saatlik tavan koymuş ve 431 sn mola vermiştir (`_state/harvester.log`). Öğrenilmiş tavan aynı anda 24 saat
  süreyle captcha hızının %85'ine çekilmektedir (`harvester/governor.mjs`). Son bir saatte bekleme nedeniyle yalnız 4 karar inmiş, 429
  ve ağ hatası görülmemiştir. Arşiv 134.422'ye çıkmış, kuyruk 807 ve kalıcı hata 163'tür. Tarama 2021 yılının 16.03-19.03.2021
  penceresinde olup seçilen pencere sayısı 306/562'dir. Hız ayarına ve motora dokunulmamıştır.
- Tam kapı koşulmamıştır. Günün kapısı 16:03'te 1018 testte geçmiş olup o zamandan bu yana yalnız `ILERLEME.md` ve `OTONOM.md`
  değişmiştir, kod değişmedikçe kapı yeniden koşulmaz. Makine prizdedir (`BatteryStatus` 2, şarj %100) ve boş bellek 660 MB'tır.
- Soru 29 ve 30 yanıtlanmamış olup soru dosyası 19 Ekim 11:02'den beri değişmemiştir. Seçilebilir `[ ]` görev bulunmadığından kod
  değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri
  yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-21 18:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `e3c0ccedf`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 17:29 oturumu 17:34:05'te 0 koduyla bitmiş, bu oturum da 18:00:03'te
  zamanında başlamıştır. 17:29:24'teki beklemeden çıkıştan (507) bu yana güç olayı görülmemiştir.
- Hasat (`npm run yargi:hasat-durum`, 18:01): Motor pid 13720 ile 20,3 saattir çalışmakta olup devre kapalıdır. 17:59:31'de Yargıtay
  1. Hukuk Dairesinin E. 2021/8685 sayılı kararının tam metni istenirken günün ikinci captcha'sı gelmiş, yönetici de 543 sn mola vermiş
  ve dakikada 2 olan hızı iki saatlik tavanla korumuştur (`_state/harvester.log`, mola 18:08:34'e kadar). İkinci captcha ilkinden 89
  dakika sonra ve indirilmiş hızda gelmiştir. Son bir saatte 47 karar inmiş, 429 ve ağ hatası görülmemiştir. Arşiv 134.465'e çıkmış,
  kuyruk 800 ve kalıcı hata 163'tür. Tarama 2021 yılının 08.03-09.03.2021 penceresinde olup seçilen pencere sayısı 309/565'tir. Yararlı
  karar sayısı 51.473'e ulaşmıştır. Hız ayarına ve motora dokunulmamıştır.
- Tam kapı koşulmamıştır. Günün kapısı 16:03'te 1018 testte geçmiş olup o zamandan bu yana yalnız `ILERLEME.md` ve `OTONOM.md`
  değişmiştir, kod değişmedikçe kapı yeniden koşulmaz. Makine prizdedir (`BatteryStatus` 2, şarj %100) ve boş bellek 242 MB'tır.
- Soru 29 ve 30 yanıtlanmamış olup soru dosyası 19 Ekim 11:02'den beri değişmemiştir. Seçilebilir `[ ]` görev bulunmadığından kod
  değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri
  yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-21 19:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `2cc6c5ee4`'tür ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 18:00 oturumu 18:02:45'te 0 koduyla bitmiş, bu oturum da 19:00:04'te
  zamanında başlamıştır. 17:29:24'teki beklemeden çıkıştan (507) bu yana güç olayı görülmemiştir.
- Hasat (`npm run yargi:hasat-durum`, 19:01): Motor pid 13720 ile 21,3 saattir çalışmakta olup devre kapalıdır. 18:38:44'te Yargıtay
  12. Hukuk Dairesinin E. 2021/7047 sayılı kararının tam metni istenirken günün üçüncü captcha'sı gelmiş, yönetici de 576 sn mola
  vermiş ve dakikada 2 olan hızı iki saatlik tavanla korumuştur (`_state/harvester.log`). Üçüncü captcha ikinciden 39 dakika sonra
  geldiği için yöneticinin 30 dakikalık tırmandırma penceresine girmemiş, uzun mola da verilmemiştir (`harvester/governor.mjs`,
  `captcha.windowMs`). Hız zaten yöneticinin taban değeri olan dakikada 2'dedir (`minPerMin`). Günlük captcha sayısı 11-19 Ekim
  arasında 1 ile 2 arasında kalmışken 20 ve 21 Ekim'de 3'e çıkmıştır. Taban hızı düşürmek yönetici ayarını değiştirip motoru yeniden
  başlatmayı gerektirdiğinden başsız oturumda yapılmamış, konu pazartesi günkü haftalık bakıma (G08) bırakılmıştır. Son bir saatte
  68 karar inmiş, 429 ve ağ hatası görülmemiştir. Arşiv 134.533'e çıkmış, kuyruk 805 ve kalıcı hata 163'tür. Tarama 2021 yılının
  22.02-24.02.2021 penceresinde olup seçilen pencere sayısı 313/569'dur. Yararlı karar sayısı 51.510'a ulaşmıştır. Hız ayarına ve
  motora dokunulmamıştır.
- Tam kapı koşulmamıştır. Günün kapısı 16:03'te 1018 testte geçmiş olup o zamandan bu yana yalnız `ILERLEME.md` ve `OTONOM.md`
  değişmiştir, kod değişmedikçe kapı yeniden koşulmaz. Makine prizdedir (`BatteryStatus` 2, şarj %100) ve boş bellek 774 MB'tır.
- Soru 29 ve 30 yanıtlanmamış olup soru dosyası 19 Ekim 11:02'den beri değişmemiştir. Seçilebilir `[ ]` görev bulunmadığından kod
  değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri
  yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-21 20:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `f3e17bf68`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 19:00 oturumu 19:04:25'te 0 koduyla bitmiş, bu oturum da 20:00:03'te
  zamanında başlamıştır. 17:29:24'teki beklemeden çıkıştan (507) bu yana güç olayı görülmemiştir.
- Hasat (`npm run yargi:hasat-durum`, 20:01): Motor pid 13720 ile 22,3 saattir çalışmakta olup devre kapalıdır. Günün dördüncü ve beşinci
  captcha'sı 19:20:30'da Yargıtay 5. Hukuk Dairesinin E. 2021/12858 sayılı, 19:57:33'te de 3. Hukuk Dairesinin E. 2021/6582 sayılı
  kararı istenirken gelmiş, yönetici 425 ve 507 sn mola vermiştir (`_state/harvester.log`). 17:59'dan sonraki aralıklar 39, 42 ve 37
  dakika olup her biri 30 dakikalık tırmandırma penceresinin hemen üstünde kaldığından uzun mola devreye girmemiştir. Eğilim soru 31
  olarak `raporlar/kullaniciya-sorular.md`'ye yazılmış, varsayım olarak ayar ve motor 26 Ekim'deki G08 bakımına bırakılmıştır. Son bir
  saatte 77 karar inmiş, 429 ve ağ hatası görülmemiştir. Arşiv 134.610'a çıkmış, kuyruk 800 ve kalıcı hata 163'tür. Tarama 2021 yılının
  08.02-10.02.2021 penceresinde olup seçilen pencere sayısı 318/573'tür. Yararlı karar sayısı 51.557'ye ulaşmıştır. Hız ayarına ve
  motora dokunulmamıştır.
- Tam kapı koşulmamıştır. Günün kapısı 16:03'te 1018 testte geçmiş olup o zamandan bu yana yalnız plan belgeleri değişmiştir, kod
  değişmedikçe kapı yeniden koşulmaz. Makine prizdedir (`BatteryStatus` 2, şarj %100) ve boş bellek 955 MB'tır.
- Soru 29 ve 30 yanıtlanmamıştır. Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi
  gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-21 21:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `105aecbdc`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 20:00 oturumu 20:03:44'te 0 koduyla bitmiş, bu oturum da 21:00:04'te
  zamanında başlamıştır. 20:10:04'te güç kaynağı değişikliği kaydı (Kernel-Power 105, `AcOnline` false) düşmüş olup makine o andan
  beri pildedir. Bekleme ya da uyku kaydı görülmemiştir.
- Hasat (`npm run yargi:hasat-durum`, 21:01): Motor pid 13720 ile 23,3 saattir çalışmakta olup devre kapalıdır. Günün altıncı captcha'sı
  20:35:00'te Yargıtay 4. Hukuk Dairesinin E. 2021/17985 sayılı kararı istenirken gelmiş, yönetici 401 sn mola vermiş ve hızı dakikada
  2'de tutmuştur (`_state/harvester.log`). 19:57'den sonraki aralık 37 dakika olup yine 30 dakikalık tırmandırma penceresinin hemen
  üstünde kalmıştır. Soru 31'deki saat ve aralık dökümü bu captcha'yla güncellenmiş, varsayım değişmemiştir. Son bir saatte 82 karar
  inmiş, 429 ve ağ hatası görülmemiştir. Arşiv 134.692'ye çıkmış, kuyruk 801 ve kalıcı hata 163'tür. Tarama 2021 yılının
  16.01-23.01.2021 penceresinde olup seçilen pencere sayısı 324/578'dir. Yararlı karar sayısı 51.608'e ulaşmıştır. Hız ayarına ve
  motora dokunulmamıştır.
- Tam kapı koşulmamıştır. Günün kapısı 16:03'te 1018 testte geçmiş olup o zamandan bu yana yalnız plan belgeleri değişmiştir, kod
  değişmedikçe kapı yeniden koşulmaz. Makine pildedir (`BatteryStatus` 1, şarj %88) ve boş bellek 811 MB'tır.
- Soru 29 ve 30 yanıtlanmamıştır. Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi
  gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-21 22:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `a3551adca`'dır ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 21:00 oturumu 21:03:47'de 0 koduyla bitmiş, bu oturum da 22:00:05'te
  zamanında başlamıştır. 20:10:04'teki güç kaynağı değişikliğinden (Kernel-Power 105) sonra güç olayı görülmemiş olup makine pilde
  çalışmayı sürdürmektedir.
- Hasat (`npm run yargi:hasat-durum`, 22:02): Motor pid 13720 ile 24,3 saattir çalışmakta olup devre kapalıdır. Günün yedinci ve sekizinci
  captcha'sı 21:09:14'te Yargıtay 11. Ceza Dairesinin E. 2018/6201 sayılı, 21:44:22'de de 1. Hukuk Dairesinin E. 2021/782 sayılı kararı
  istenirken gelmiş, yönetici 329 ve 390 sn mola vermiş ve hızı dakikada 2'de tutmuştur (`_state/harvester.log`). Aralıklar 34 ve 35
  dakika olup 30 dakikalık tırmandırma penceresine yaklaşmakla birlikte üstünde kalmıştır. Soru 31'deki döküm bu iki captcha'yla
  güncellenmiş, varsayım değişmemiştir. Son bir saatte 77 karar inmiş, 429 ve ağ hatası görülmemiştir. Arşiv 134.768'e çıkmış, kuyruk 808
  ve kalıcı hata 163'tür. 2021'in son penceresi (01.01-15.01.2021) 21:27'de, 2020'nin ilk penceresi (24.12-31.12.2020) 21:38'de seçilmiş
  olup tarama şu an 01.12-15.12.2020 penceresindedir ve seçilen pencere sayısı 330/582'dir. 2021'in `Yıllar` satırında görünmemesi arıza
  değildir, zira yılın kapanışı (`harvester/daemon.mjs`, `yearFillCheck`) kuyruktaki 2021 kararları bitince doldurma turuyla yapılmakta,
  durum ekranı (`hasat.mjs`) da etkin olmayan `tarama` evresindeki yılı listelememektedir. Yararlı karar sayısı 51.660'a ulaşmıştır. Hız
  ayarına ve motora dokunulmamıştır.
- Tam kapı koşulmamıştır. Günün kapısı 16:03'te 1018 testte geçmiş olup o zamandan bu yana yalnız plan belgeleri değişmiştir, kod
  değişmedikçe kapı yeniden koşulmaz. Makine pildedir (`BatteryStatus` 1, şarj %77) ve boş bellek 484 MB'tır. Pil 21:01'den bu yana
  saatte yaklaşık 11 puan azalmış olup bu hızla makine 04:00-05:00 arasında kritik düzeye inerek uykuya geçebilir ve hasat o saatte durur.
  Pil 00:30 dolayında %50'nin altına iner, o andan sonraki oturumlar uzun iş başlatmaz.
- Soru 29 ve 30 yanıtlanmamıştır. Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi
  gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-21 23:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `261318634`'tür ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 22:00 oturumu 22:06:15'te 0 koduyla bitmiş, bu oturum da 23:00:03'te
  zamanında başlamıştır. Son üç saatte tek güç olayı 20:10:04'teki güç kaynağı değişikliğidir (Kernel-Power 105), bekleme ya da uyku
  kaydı görülmemiştir.
- Hasat (`npm run yargi:hasat-durum`, 23:02): Motor pid 13720 ile 25,3 saattir çalışmakta olup devre kapalıdır. Günün dokuzuncu ve onuncu
  captcha'sı 22:20:56'da Yargıtay 12. Ceza Dairesinin E. 2020/381 sayılı, 22:55:35'te de 3. Hukuk Dairesinin E. 2021/961 sayılı kararı
  istenirken gelmiş, yönetici 378 ve 551 sn mola vermiş ve hızı dakikada 2'de tutmuştur (`_state/harvester.log`). 21:44'ten sonraki
  aralıklar 37 ve 35 dakika olup 30 dakikalık tırmandırma penceresinin üstünde kalmıştır. Soru 31'deki döküm bu iki captcha'yla
  güncellenmiş, varsayım değişmemiştir. Son bir saatte 75 karar inmiş, 429 ve ağ hatası görülmemiştir. Arşiv 134.844'e çıkmış, kuyruk 803
  ve kalıcı hata 163'tür. Tarama 2020 yılının 23.11-24.11.2020 penceresinde olup seçilen pencere sayısı 335/588'dir. Yararlı karar sayısı
  51.708'e ulaşmıştır. Hız ayarına ve motora dokunulmamıştır.
- Tam kapı koşulmamıştır. Günün kapısı 16:03'te 1018 testte geçmiş olup o zamandan bu yana yalnız plan belgeleri değişmiştir, kod
  değişmedikçe kapı yeniden koşulmaz. Makine pildedir (`BatteryStatus` 1, şarj %67) ve boş bellek 221 MB'tır. Pil 22:02'den bu yana
  saatte yaklaşık 10 puan azalmış olup bu hızla 00:45 dolayında %50'nin altına iner ve o andan sonraki oturumlar uzun iş başlatmaz. Aynı
  hızla pil 05:00 dolayında kritik düzeye inerek makineyi uykuya geçirebilir, bu durumda hasat da o saatte durur.
- Soru 29 ve 30 yanıtlanmamıştır. Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi
  gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-22 00:00 — izleme ve günün tam kapısı (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `89e9b851f`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 23:00 oturumu 23:05:28'de 0 koduyla bitmiş, bu oturum da 00:00:03'te
  zamanında başlamıştır. Son dört saatte tek güç olayı 20:10:04'teki güç kaynağı değişikliğidir (Kernel-Power 105), bekleme ya da uyku
  kaydı görülmemiştir.
- Hasat (`npm run yargi:hasat-durum`, 00:02): Motor pid 13720 ile 26,3 saattir çalışmakta olup devre kapalıdır. 21 Ekim'in on birinci
  captcha'sı 23:34:31'de Yargıtay 1. Ceza Dairesinin E. 2021/3674 sayılı kararı istenirken gelmiş, yönetici 454 sn mola vermiş ve hızı
  dakikada 2'de tutmuştur (`_state/harvester.log`, günlükteki UTC saat 20:34:31). 22:55'ten sonraki aralık 39 dakika olup 30 dakikalık
  tırmandırma penceresinin üstünde kalmıştır. Soru 31'deki döküm bu captcha'yla güncellenmiş, varsayım değişmemiştir. Son bir saatte
  84 karar inmiş, 429 ve ağ hatası görülmemiştir. Arşiv 134.928'e çıkmış, kuyruk 806 ve kalıcı hata 163'tür. Tarama 2020 yılının
  01.11-03.11.2020 penceresinde olup seçilen pencere sayısı 341/592'dir. Yararlı karar sayısı 51.763'e ulaşmıştır. Hız ayarına ve motora
  dokunulmamıştır.
- Tam kapı: Günün ilk oturumu olduğundan ve makine pilde %57 şarjla yordamın %50 sınırının üstünde bulunduğundan `npm run kalite`
  00:02:37'de başlatılmıştır. Boş bellek 239 MB olup yordam gereği tek başına erteleme gerekçesi sayılmamış, kapı da derleme işçisini
  2'ye indirmiştir. Kapı 00:32:37'de 1018 testte geçmiştir (`logs/izleme-tam-0000.log`). Derleme 1191 sn, e2e 233 sn sürmüş olup 21 Ekim
  16:03'teki 5 işçili kapıda bu süreler 507 ve 186 sn'dir. Derlemenin yeniden ürettiği beş zaman damgası dosyası geri alınmış, kapıdan
  sonra 3123 ve 3124'te dinleyen süreç kalmamıştır.
- Pil: Şarj kapı süresince 30 dakikada %57'den %46'ya inmiş olup bu, kapısız saatlerdeki saatte 10 puanlık hızın iki katıdır. %50 sınırı
  kapı sürerken aşıldığından sonraki oturumlar makine prize takılana kadar uzun iş başlatmaz. Kritik düzey %2'dir ve bu düzeyde makine
  hazırda bekletmeye geçer (`powercfg`, `BATLEVELCRIT` ve `BATACTIONCRIT`). Saatte 10 puanlık hız sürerse bu eşik 05:00 dolayında
  aşılır ve hasat o saatte durur. Kapının pil tüketimi `OTONOM.md`'deki %25-30 tahmininin altında kaldığından ölçülen değer oraya
  eklenmiştir.
- Soru 29 ve 30 yanıtlanmamıştır. Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi
  gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-22 01:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `58f4e953f`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 00:00 oturumu 00:35:21'de 0 koduyla bitmiş, bu oturum da 01:00:03'te
  zamanında başlamıştır. Son iki saatte güç olayı kaydı görülmemiştir.
- Hasat (`npm run yargi:hasat-durum`, 01:02): Motor pid 13720 ile 27,3 saattir çalışmakta olup devre kapalıdır. 22 Ekim'in ilk iki
  captcha'sı 00:10:06'da Yargıtay 19. Ceza Dairesinin E. 2019/9278 sayılı, 00:46:43'te de 5. Hukuk Dairesinin E. 2020/7446 sayılı kararı
  istenirken gelmiş, yönetici 340 ve 589 sn mola vermiş ve hızı dakikada 2'de tutmuştur (`_state/harvester.log`, günlükteki UTC saatler
  21:10:06 ve 21:46:43). 23:34'ten sonraki aralıklar 36 ve 37 dakika olup 30 dakikalık tırmandırma penceresinin üstünde kalmıştır. Soru
  31'deki döküm bu iki captcha'yla güncellenmiş, varsayım değişmemiştir. Son bir saatte 70 karar inmiş, 429 ve ağ hatası görülmemiştir.
  Arşiv 134.996'ya çıkmış, kuyruk 796 ve kalıcı hata 163'tür. Tarama 2020 yılının 14.10-15.10.2020 penceresinde olup seçilen pencere
  sayısı 345/598'dir. Yararlı karar sayısı 51.806'ya ulaşmıştır. Hız ayarına ve motora dokunulmamıştır.
- Tam kapı koşulmamıştır. Günün kapısı 00:32'de 1018 testte geçmiş olup o zamandan bu yana yalnız plan belgeleri değişmiştir. Makine
  pildedir (`BatteryStatus` 1, şarj %41) ve şarj yordamın %50 sınırının altında kaldığından uzun iş başlatılamaz. Şarj 00:32'den bu yana
  28 dakikada 5 puan azalmış olup saatte yaklaşık 10 puanlık hız sürerse %2'lik kritik düzey 05:00 dolayında aşılır. Boş bellek 502 MB'tır.
- Soru 29 ve 30 yanıtlanmamıştır. Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi
  gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-22 02:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `a6c7aeb85`'tir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 01:00 oturumu 01:05:24'te 0 koduyla bitmiş, bu oturum da 02:00:02'de
  zamanında başlamıştır. Son iki saatte Kernel-Power kaydı görülmemiştir.
- Hasat (`npm run yargi:hasat-durum`, 02:01): Motor pid 13720 ile 28,3 saattir çalışmakta olup devre kapalıdır. 22 Ekim'in üçüncü
  captcha'sı 01:27:57'de Yargıtay 19. Ceza Dairesinin E. 2020/3593 sayılı kararı istenirken gelmiş, yönetici 526 sn mola vermiş ve hızı
  dakikada 2'de tutmuştur (`_state/harvester.log`, günlükteki UTC saat 22:27:57). 00:46'dan sonraki aralık 41 dakika olup 30 dakikalık
  tırmandırma penceresinin üstünde kalmıştır. Soru 31'deki döküm bu captcha'yla güncellenmiş, varsayım değişmemiştir. Son bir saatte
  78 karar inmiş, 429 ve ağ hatası görülmemiştir. Arşiv 135.073'e çıkmış, kuyruk 798 ve kalıcı hata 163'tür. Tarama 2020 yılının
  01.09-30.09.2020 penceresinde olup seçilen pencere sayısı 351/600'dür. Yararlı karar sayısı 51.853'e ulaşmıştır. Hız ayarına ve motora
  dokunulmamıştır.
- Tam kapı koşulmamıştır. Günün kapısı 00:32'de 1018 testte geçmiş olup o zamandan bu yana yalnız plan belgeleri değişmiştir. Makine
  pildedir (`BatteryStatus` 1, şarj %31) ve şarj yordamın %50 sınırının altında kaldığından uzun iş başlatılamaz. Şarj 01:01'den bu yana
  bir saatte 10 puan azalmış olup bu hız sürerse %2'lik kritik düzey 05:00 dolayında aşılır. Windows'un anlık kalan süre tahmini 87 dk
  olup ölçülen eğilimden kısadır. Boş bellek 479 MB'tır.
- Soru 29 ve 30 yanıtlanmamıştır. Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi
  gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-22 03:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `59d22202a`'dır ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 02:00 oturumu 02:03:59'da 0 koduyla bitmiş, bu oturum da 03:00:04'te
  zamanında başlamıştır. Son iki saatte Kernel-Power kaydı görülmemiştir. Bugün perşembe olduğundan G08 bakımı sırası gelmemiştir.
- Hasat (`npm run yargi:hasat-durum`, 03:02): Motor pid 13720 ile 29,3 saattir çalışmakta olup devre kapalıdır. 22 Ekim'in dördüncü
  captcha'sı 02:07:26'da Yargıtay 19. Ceza Dairesinin E. 2020/2763 sayılı, beşincisi de 02:43:03'te 23. Hukuk Dairesinin E. 2018/2648
  sayılı kararı istenirken gelmiş, yönetici 337 ve 430 sn mola vermiş ve hızı dakikada 2'de tutmuştur (`_state/harvester.log`, günlükteki
  UTC saatler 23:07:26 ve 23:43:03). 01:28'den sonraki aralıklar 39 ve 36 dakika olup 30 dakikalık tırmandırma penceresinin üstünde
  kalmıştır. Soru 31'deki döküm bu iki captcha'yla güncellenmiş, varsayım değişmemiştir. Son bir saatte 71 karar inmiş, 429 ve ağ hatası
  görülmemiştir. Arşiv 135.144'e çıkmış, kuyruk 797 ve kalıcı hata 163'tür. Tarama 2020 yılının 12.09-15.09.2020 penceresinde olup seçilen
  pencere sayısı 357/608'dir. Yararlı karar sayısı 51.905'e ulaşmıştır. Hız ayarına ve motora dokunulmamıştır.
- Tam kapı koşulmamıştır. Günün kapısı 00:32'de 1018 testte geçmiş olup o zamandan bu yana yalnız plan belgeleri değişmiştir. Makine
  pildedir (`BatteryStatus` 1, şarj %21) ve şarj yordamın %50 sınırının altında kaldığından uzun iş başlatılamaz. Şarj 02:01'den bu yana
  bir saatte yine 10 puan azalmış olup bu hız sürerse %2'lik kritik düzey 04:55 dolayında aşılır ve makine uykuya geçebilir. Windows'un
  anlık kalan süre tahmini 60 dk'dır. Uyku hâlinde oturumlar ve hasat duracağından devralmada hasat günlüğünün son satır saati kesinti
  anını doğrulamak için okunur. Boş bellek 392 MB'tır.
- Soru 29 ve 30 yanıtlanmamıştır. Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi
  gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-22 04:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `65bf4d942`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 03:00 oturumu 03:04:35'te 0 koduyla bitmiş, bu oturum da 04:00:03'te
  zamanında başlamıştır. Son iki saatte Kernel-Power kaydı görülmemiştir.
- Hasat (`npm run yargi:hasat-durum`, 04:01): Motor pid 13720 ile 30,3 saattir çalışmakta olup devre kapalıdır. 22 Ekim'in altıncı
  captcha'sı 03:19:42'de 04.09-07.09.2020 penceresi aranırken, yedincisi de 03:56:27'de Yargıtay 6. Hukuk Dairesinin E. 2021/6173 sayılı
  kararı istenirken gelmiş, yönetici 344 ve 378 sn mola vermiş ve hızı dakikada 2'de tutmuştur (`_state/harvester.log`, günlükteki UTC
  saatler 00:19:42 ve 00:56:27). 02:43'ten sonraki aralıklar 37 ve 37 dakika olup 30 dakikalık tırmandırma penceresinin üstünde
  kalmıştır. Soru 31'deki döküm bu iki captcha'yla güncellenmiş, varsayım değişmemiştir. Son bir saatte 68 karar inmiş, 429 ve ağ hatası
  görülmemiştir. Arşiv 135.212'ye çıkmış, kuyruk 798 ve kalıcı hata 163'tür. Tarama 2020 yılının 01.07-15.07.2020 penceresinde olup
  seçilen pencere sayısı 365/612'dir. Yararlı karar sayısı 51.933'e ulaşmıştır. Hız ayarına ve motora dokunulmamıştır.
- Tam kapı koşulmamıştır. Günün kapısı 00:32'de 1018 testte geçmiş olup o zamandan bu yana yalnız plan belgeleri değişmiştir. Makine
  pildedir (`BatteryStatus` 1, şarj %12) ve şarj yordamın %50 sınırının altında kaldığından uzun iş başlatılamaz. Şarj 03:01'den bu yana
  bir saatte 9 puan azalmış olup bu hız sürerse %2'lik kritik düzey 05:05 dolayında aşılır. Windows'un anlık kalan süre tahmini 27 dk
  olduğundan 05:00 oturumu başlamadan makinenin uykuya geçmesi olasıdır. Bu nedenle oturum kısa tutulmuş, kayıt ve commit ilk dakikalarda
  yapılmıştır. Boş bellek 279 MB'tır.
- Soru 29 ve 30 yanıtlanmamıştır. Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi
  gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-22 05:00 (gerçek saat 12:05) — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `0209755a3`'tür ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 04:00 oturumu 04:04:52'de 0 koduyla bitmiş, bu oturum 05:00:03'te
  başlamıştır. Pil 05:00:46'da kritik düzeye inmiş, makine 05:00:48'de «Battery» nedeniyle hazırda beklemeye geçmiştir (Kernel-Power
  524 ve 42). Makine 12:01:22'de prize takılınca uyanmış (507 «Resume from Hibernate», 105 güç kaynağı değişikliği) ve oturum kaldığı
  yerden sürmüştür. Bu nedenle 06:00-12:00 oturumları çalışmamış, kayıt gerçek saatle yazılmıştır. 04:00 kaydında 05:05 dolayı için
  öngörülen kritik düzey 05:00:46'da gelmiştir.
- Hasat (`npm run yargi:hasat-durum`, 12:06): Motor pid 13720 hazırda beklemeden sağ çıkmış olup devre kapalıdır. Günlükte 02:00:45Z
  (05:00:45) ile 09:01:29Z (12:01:29) arasında satır bulunmamakta, motor uyanınca anlık görüntü yazıp kendiliğinden sürmektedir.
  22 Ekim'in sekizinci captcha'sı 04:31:45'te Yargıtay 3. Ceza Dairesinin E. 2021/3344 sayılı kararı istenirken gelmiş, yönetici 500 sn
  mola vermiş ve hızı dakikada 2'de tutmuştur (`_state/harvester.log`, günlükteki UTC saat 01:31:45). 03:56'dan sonraki aralık 35 dakika
  olup 30 dakikalık tırmandırma penceresinin üstünde kalmıştır. Soru 31'deki döküm bu captcha'yla güncellenmiş, varsayım değişmemiştir.
  Uyku nedeniyle son bir saatte yalnız 7 karar inmiş, 429 ve ağ hatası görülmemiştir. Arşiv 135.295'e çıkmış, kuyruk 797 ve kalıcı
  hata 163'tür. Tarama 2020 yılının 19.06-22.06.2020 penceresinde olup seçilen pencere sayısı 371/619'dur. Yararlı karar sayısı
  51.946'ya ulaşmıştır. Hız ayarına ve motora dokunulmamıştır.
- Tam kapı koşulmamıştır. Günün kapısı 00:32'de 1018 testte geçmiş olup o zamandan bu yana yalnız plan belgeleri değişmiştir. Makine
  prizdedir (`BatteryStatus` 2) ve şarj 12:05'te %3, 12:09'da %7'dir. Boş bellek 389-615 MB arasındadır. Pil kuralı prizde uzun işe
  izin vermekle birlikte seçilebilir görev ve değişen kod bulunmadığından uzun iş başlatılmamıştır.
- OTONOM'un uyku maddesine, kritik pil uykusunun oturumu öldürmeden dondurduğu ve istemdeki saatin gerçek saat sayılmayacağı
  eklenmiştir.
- Soru 29 ve 30 yanıtlanmamıştır. Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi
  gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-22 13:24 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `c49ca1d14`'tür ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 05:00 oturumu 12:10:22'de 0 koduyla bitmiştir. Kapak 12:29:40'ta kapanmış,
  12:31:54-12:32:05 arasında kısa bir süre açılmış ve makine 13:24:25'te kapak açılınca modern beklemeden çıkmıştır (Kernel-Power 506 ve
  507, neden «Lid»). Bu nedenle 13:00 oturumu çalışmamış, çalıştırıcı bu oturumu uyanıştan 28 sn sonra 13:24:53'te başlatmıştır. İstemdeki
  saat gerçek saatle örtüşmektedir.
- Hasat (`npm run yargi:hasat-durum`, 13:28): Motor pid 13720 ile 39,7 saattir çalışmakta olup devre kapalıdır. Günlükte 09:31:54Z
  (12:31:54) ile 10:24:28Z (13:24:28) arasında satır bulunmamakta, motor kapak kapalıyken durmuş ve uyanınca kendiliğinden sürmüştür.
  04:31'deki captcha'dan sonra yeni captcha gelmemiş olup motor bu arada uyanık geçen ve molayı da içeren yaklaşık 65 dakika çalışmıştır.
  Bu süre 22 Ekim'deki 35-41 dakikalık aralıkların üstünde kaldığından soru 31'e bir cümle eklenmiş, varsayım değişmemiştir. Uyku
  nedeniyle son bir saatte yalnız 8 karar inmiş, 429 ve ağ hatası görülmemiştir. Arşiv 135.340'a çıkmış, kuyruk 801 ve kalıcı hata
  163'tür. Tarama 2020 yılının 08.06-11.06.2020 penceresinde olup seçilen pencere sayısı 375/622'dir. Yararlı karar sayısı 51.951'e
  ulaşmıştır. Hız ayarına ve motora dokunulmamıştır.
- Tam kapı koşulmamıştır. Günün kapısı 00:32'de 1018 testte geçmiş olup o zamandan bu yana yalnız plan belgeleri değişmiştir. Makine
  pildedir (`BatteryStatus` 1) ve şarj 12:09'daki %7'den 13:27'de %88'e çıkmıştır. Boş bellek 1046 MB'tır. Pil kuralı uzun işe izin
  vermekle birlikte seçilebilir görev ve değişen kod bulunmadığından uzun iş başlatılmamıştır.
- Soru 29 ve 30 yanıtlanmamıştır. Bugün perşembe olduğundan G08 sırası gelmemiştir. Seçilebilir `[ ]` görev bulunmadığından kod
  değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri
  yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-22 14:00 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `069f8cc4c`'tür ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 13:24 oturumu 13:32:53'te 0 koduyla bitmiş, bu oturum 14:00:05'te
  başlamıştır. 13:24:25'ten sonra Kernel-Power olayı bulunmadığından makine uyumamış olup istemdeki saat gerçek saatle örtüşmektedir.
- Hasat (`npm run yargi:hasat-durum`, 14:02): Motor devre kapalı olarak sürmektedir. 22 Ekim'in dokuzuncu captcha'sı 13:54:18'de
  Yargıtay 12. Hukuk Dairesinin E. 2021/3660 sayılı kararı istenirken gelmiş, yönetici 321 sn mola vermiş ve hızı dakikada 2'de
  tutmuştur (`_state/harvester.log`, günlükteki UTC saat 10:54:18). 04:31'deki captcha'dan bu yana uyanık geçen süre, molayı da
  içerecek biçimde yaklaşık 87 dakikadır. Soru 31'deki döküm bu captcha'yla güncellenmiş, varsayım değişmemiştir. Son bir saatte 50
  karar inmiş, 429 ve ağ hatası görülmemiştir. Arşiv 135.384'e çıkmış, kuyruk 798 ve kalıcı hata 163'tür. Tarama 2020 yılının
  02.06-03.06.2020 penceresinde olup seçilen pencere sayısı 378/625'tir. Yararlı karar sayısı 51.958'e ulaşmıştır. Hız ayarına ve
  motora dokunulmamıştır.
- Tam kapı koşulmamıştır. Günün kapısı 00:32'de 1018 testte geçmiş olup o zamandan bu yana yalnız plan belgeleri değişmiştir. Makine
  pildedir (`BatteryStatus` 1) ve şarj 13:27'deki %88'den 14:03'te %73'e inmiştir. Bu hızla pil 15:00 dolayında yordamın %50 sınırının
  altına iner. Boş bellek 320-357 MB arasındadır. Seçilebilir görev ve değişen kod bulunmadığından uzun iş başlatılmamıştır.
- Soru 29 ve 30 yanıtlanmamıştır. Bugün perşembe olduğundan G08 sırası gelmemiştir. Seçilebilir `[ ]` görev bulunmadığından kod
  değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri
  yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-22 23:15 — izleme (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `6c53c359a`'dır ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 14:00 oturumu 14:04:19'da 0 koduyla bitmiştir. Kapak 14:15:32'de kapanmış
  ve makine modern beklemeye girmiştir (Kernel-Power 506, neden «Lid»). Bekleme 14:25:04-14:25:17 ve 22:07:34-22:07:46 arasındaki iki
  kısa kapak açılışıyla, 15:35:05'te de «Austerity Battery Drain Budget Exceeded» nedenli 507 ve 506 çiftiyle bölünmüş, 23:13:32'de kapak
  açılınca sona ermiştir. 15:00-22:00 oturumları bu nedenle çalışmamıştır. Zamanlanmış görev uyanış anında kaçan tetiği yakalamış,
  çalıştırıcı bu oturumu 23:15:35'te başlatmıştır. İstemdeki saat gerçek saatle örtüşmektedir.
- Hasat (`npm run yargi:hasat-durum`, 23:21): Motor pid 13720 ile 49,6 saattir çalışmakta olup devre kapalıdır. Günlükte 11:25:08Z
  (14:25:08) ile 20:13:34Z (23:13:34) arasında yalnız iki `network ENOTFOUND` satırı bulunmaktadır (15:35:11 ve 22:07:36). İkisi de bekleme
  sırasındaki kısa uyanışlarda, ağ hazır değilken gelmiş olup ilgili iki karar 23:13'teki uyanıştan sonra inmiştir. Bu durum `OTONOM.md`'nin
  tuzak listesine eklenmiştir. 13:54'teki captcha'dan sonra yeni captcha gelmemiştir. Uyanık geçen süre molayla birlikte yaklaşık 28
  dakika olup 35-41 dakikalık aralıkların altında kaldığından bir şey göstermemekte, soru 31'e yalnız ağ hatalarının açıklaması
  eklenmiştir. Arşiv 135.416'ya çıkmış, kuyruk 802 ve kalıcı hata 163'tür. Tarama 2020 yılının 01.03-31.03.2020 penceresinde olup seçilen
  pencere sayısı 382/625'tir. Yararlı karar sayısı 51.963'e ulaşmıştır. Hız ayarına ve motora dokunulmamıştır.
- Tam kapı koşulmamıştır. Günün kapısı 00:32'de 1018 testte geçmiş olup o zamandan bu yana yalnız plan belgeleri değişmiştir. Makine
  pildedir (`BatteryStatus` 1) ve şarj, bekleme süren dokuz saatte 14:03'teki %73'ten 23:18'de %61'e inmiştir. Boş bellek 852 MB'tır.
  Seçilebilir görev ve değişen kod bulunmadığından uzun iş başlatılmamıştır.
- Soru 29 ve 30 yanıtlanmamıştır. Bugün perşembe olduğundan G08 sırası gelmemiştir. Seçilebilir `[ ]` görev bulunmadığından kod
  değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri
  yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-23 00:00 — izleme, günün tam kapısı pil nedeniyle ertelendi (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `1dd2a15fc`'dir ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124 boştur. 23:15 oturumu 23:22:47'de 0 koduyla bitmiş, bu oturum da 00:00:07'de
  zamanında başlamıştır. 23:13:32'deki uyanıştan sonra Kernel-Power olayı bulunmadığından makine uyumamış olup istemdeki saat gerçek
  saatle örtüşmektedir.
- Hasat (`npm run yargi:hasat-durum`, 00:02): Motor pid 13720 ile 50,3 saattir çalışmakta olup devre kapalıdır. 22 Ekim'in onuncu
  captcha'sı 23:42:51'de 08.03-11.03.2020 penceresinin sayımı istenirken gelmiş, yönetici 506 sn mola vermiş ve hızı dakikada 2'de
  tutmuştur (`_state/harvester.log`, günlükteki UTC saat 20:42:51). 13:54'teki captcha'dan bu yana uyanık geçen süre, molayı da içerecek
  biçimde yaklaşık 51 dakikadır. Soru 31'deki döküm bu captcha'yla güncellenmiş, varsayım değişmemiştir. Son bir saatte 60 karar inmiş,
  429 ve ağ hatası görülmemiştir. Arşiv 135.468'e çıkmış, kuyruk 795 ve kalıcı hata 163'tür. Tarama 2020 yılının 04.03-07.03.2020
  penceresinde olup seçilen pencere sayısı 385/629'dur. Yararlı karar sayısı 51.970'e ulaşmıştır. Hız ayarına ve motora dokunulmamıştır.
- Tam kapı: Günün ilk oturumu olmasına karşın `npm run kalite` başlatılmamıştır. Makine pildedir (`BatteryStatus` 1) ve şarj 00:00:55'te
  %50, 00:02'de %49, 00:03'te %48 okunmuş olup yordamın %50 sınırının altına inmiştir. Şarj 23:18'deki %61'den 45 dakikada 13 puan
  düşmüştür. Saatte yaklaşık 17 puanlık bu hız sürerse kritik düzey (%2) 02:45 dolayında aşılır ve makine hazırda beklemeye geçer. 22
  Ekim'de 2 işçili kapı pili 30 dakikada 11 puan, yani kapısız hızın 6 puan üstünde düşürmüş olup aynı kapı bugün bu anı ve hasatın
  duruşunu yaklaşık 20 dakika öne çekerdi. Boş bellek 152-579 MB arasında okunmuştur. Son kapı 22 Ekim 00:32'de 1018 testte geçmiş, o zamandan bu yana yalnız plan
  belgeleri değişmiştir. Bu yüzden ertelemenin kod açısından bir sakıncası görülmemiş, günün kapısı makine prize takıldıktan sonraki
  ilk oturuma bırakılmıştır.
- Soru 29 ve 30 yanıtlanmamıştır. Bugün cuma olduğundan G08 sırası gelmemiştir (26 Ekim pazartesi). Seçilebilir `[ ]` görev
  bulunmadığından kod değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım,
  makine prize takılınca günün tam kapısını koşmak ve sorulardan biri yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-23 12:00 — izleme, makine prize takılı (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `2623f64ca`. Araya giren başka oturum commit'i yok. 17 Ekim 00:13'teki dosyalar (scripts/karar-arama/) dokunulmamış. Bugün cuma saat 12:00; makine AC'dedir (pil önceki saatlerde %50'nin altında kalmış).
- Değişiklikler: `.gitignore`, `package.json` (+3 komut), `scripts/kalite.mjs` (test) — karar-arama integrasyon değişiklikleri. Kaynağı bilinmiyor (diğer oturumların "seçilebilir görev yok" günlükleriyle çelişiyor). İntegrasyonu geçerli kabul edip kalite kontrol koşmuş.
- Düzeltme (13:00 oturumunca eklendi): Bu kayıt yarım kalmıştır. Oturum 12:00:28'de başlamış, 12:02-12:14 arasında kapak kapalı
  kalmış ve 12:15:52'de commit atmadan bitmiştir. Arka planda başlattığı `kalite:hizli` oturumla birlikte ölmüş olup çıktı dosyası
  boştur, yani "kalite kontrol koşmuş" ifadesi doğru değildir. Adı geçen `.gitignore`, `package.json` ve `scripts/kalite.mjs`
  değişiklikleri `scripts/karar-arama/` ile aynı anda, 17 Ekim 00:13'te yazılmış olup önceki bütün kayıtlarda başka oturumun dosyaları
  sayılmıştır. Commit'leri soru 29'la kullanıcıya bırakılmıştır, bu yüzden başsız oturumca eklenmez.

## 2026-10-23 13:00 — günün tam kapısı prizde geçti (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `2623f64ca`'dır ve araya giren commit olmamıştır. Başka oturumun dosyaları 17 Ekim 00:13'teki
  hâlinde olup bunlara dokunulmamıştır. 12:00 oturumunun yarım kaydı yukarıda düzeltilmiştir. 3123 ve 3124 boştur,
  `.next/dev/types/validator.ts` yoktur. Bu oturum 13:00:35'te zamanında başlamıştır.
- Güç olayları: 00:00 oturumundan sonra makine 00:55:17'de «Application API» nedeniyle uykuya geçmiş (Kernel-Power 42 ve 187), hasat
  motoru da 00:55:10'da SIGHUP ile düzenli biçimde durmuştur. Makine 11:42:06'da hazırda bekletmeden dönmüş ve `hasat-servis` motoru
  11:42:30'da pid 54468 ile yeniden başlatmıştır. Bu yüzden 01:00-11:00 oturumları çalışmamıştır. Kapak 12:02-12:14 arasında kapalı
  kalmış, 12:30:18'de güç kaynağı değişmiştir (Kernel-Power 105). Makine bu oturumda prizdedir (`BatteryStatus` 2, şarj 13:00'te %50,
  13:14'te %58).
- Tam kapı (`npm run kalite`, 13:02-13:18): 1018 testte geçmiştir. Boş bellek 801 MB olduğundan derleme 4 işçiyle 533 sn sürmüş, e2e
  adımı 189 sn'de 44/44 geçmiştir. Derlemenin yeniden ürettiği site haritaları, `publishable.json` ve `site-search-index.json` geri
  alınmıştır. 00:00 oturumunun pil nedeniyle ertelediği günün kapısı böylece koşulmuştur.
- Hasat (`npm run yargi:hasat-durum`, 13:18): Motor pid 54468 ile 1,6 saattir çalışmakta olup devre kapalıdır. 23 Ekim'in ilk captcha'sı
  00:20'de (571 sn mola), ikincisi 12:45'te (372 sn mola) gelmiştir. 12:14:52'deki `network ENOTFOUND` kapağın açıldığı saniyede
  gelmiş ve aynı karar 42 sn sonra inmiştir. Soru 31'deki döküm bu olaylarla güncellenmiş, varsayım değişmemiştir. Son bir saatte 87
  karar inmiş, 429 görülmemiştir. Arşiv 135.657'ye çıkmış, kuyruk 798 ve kalıcı hata 163'tür. Tarama 2020 yılının 16.01-31.01.2020
  penceresinde olup seçilen pencere sayısı 399/641'dir. Yararlı karar sayısı 52.033'e ulaşmıştır. Hız ayarına ve motora dokunulmamıştır.
- Soru 29 ve 30 yanıtlanmamıştır. Bugün cuma olduğundan G08 sırası gelmemiştir (26 Ekim pazartesi). Seçilebilir `[ ]` görev
  bulunmadığından kod değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiş, 12:00 oturumunun
  yanlış sınıflandırması gözlem 225 olarak yazılmıştır. Sıradaki adım, sorulardan biri yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-23 14:00 — izleme, makine prizde (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `4fb00d293` olup araya giren commit yoktur. Başka oturumun dosyaları (`.gitignore`,
  `package.json`, `scripts/kalite.mjs`, `scripts/karar-arama/`) 17 Ekim 00:13'teki hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124
  boştur. Oturum 14:00:47'de zamanında başlamıştır.
- Güç: 13:15'ten bu yana Kernel-Power olayı yoktur, yani makine uyumamış ve kapak kapanmamıştır. Makine prizdedir (`BatteryStatus` 2,
  şarj 14:00'te %92), boş bellek 546 MB'tır.
- Kapı: Günün tam kapısı 13:00 oturumunda 1018 testte geçmiş, o zamandan bu yana yalnız plan belgeleri değişmiştir. Bu yüzden yeni
  kapı koşulmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 14:02): Motor 11:42'den beri pid 54468 ile çalışmakta olup devre kapalıdır. 23 Ekim'in üçüncü
  captcha'sı 13:22'de (349 sn mola), dördüncüsü 13:58'de (401 sn mola) gelmiş, aralıklar 37 ve 36 dakika olmuştur. Soru 31'deki döküm
  bu iki olayla güncellenmiş, varsayım değişmemiştir. Son bir saatte 79 karar inmiş olup 429 ve ağ hatası görülmemiştir. Arşiv
  135.707'ye çıkmış, kuyruk 801 ve kalıcı hata 163'tür. Tarama 2020 yılının 01.01-15.01.2020 penceresinde olup seçilen pencere sayısı
  403/644'tür. Yararlı karar sayısı 52.056'ya ulaşmıştır. Hız ayarına ve motora dokunulmamıştır.
- Soru 29 ve 30 yanıtlanmamış, sorular dosyası 13:02'den beri kullanıcı tarafından değiştirilmemiştir. Bugün cuma olduğundan G08 sırası
  gelmemiştir (26 Ekim pazartesi). Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi
  gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-23 15:00 — izleme, makine prizde (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `c79cc02ef` olup araya giren commit yoktur. Başka oturumun dosyaları (`.gitignore`,
  `package.json`, `scripts/kalite.mjs`, `scripts/karar-arama/`) 17 Ekim 00:13'teki hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124
  boştur, `.next/dev/types/validator.ts` yoktur. Oturum 15:00:35'te zamanında başlamıştır.
- Güç: 13:15'ten bu yana Kernel-Power olayı yoktur, yani makine uyumamış ve kapak kapanmamıştır. Makine prizdedir (`BatteryStatus` 2,
  şarj 15:01'de %100), boş bellek 647 MB'tır.
- Kapı: Günün tam kapısı 13:00 oturumunda 1018 testte geçmiş, o zamandan bu yana yalnız plan belgeleri değişmiştir. Bu yüzden yeni
  kapı koşulmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 15:02): Motor 11:42'den beri pid 54468 ile çalışmakta olup devre kapalıdır. 23 Ekim'in beşinci
  captcha'sı 14:32'de 34 dakikalık aralıkla gelmiş, yönetici 525 sn mola vermiştir. Soru 31'deki döküm bu olayla güncellenmiş, varsayım
  değişmemiştir. Son bir saatte 76 karar inmiş olup 429 ve ağ hatası görülmemiştir. Arşiv 135.783'e çıkmış, kuyruk 810 ve kalıcı hata
  163'tür. 2020 yılının ilk geçişindeki pencereler 14:59'da bitmiş ve tarama 2019 yılının 16.12-19.12.2019 penceresine geçmiştir. Seçilen
  pencere sayısı 409/650'dir. 2020 planda hâlâ `tarama` aşamasında olup durum satırı etkin olmayan tarama yıllarını göstermediğinden
  «Yıllar» satırında yer almamaktadır, bu bir arıza sayılmamıştır. Yararlı karar sayısı 52.108'e ulaşmıştır. Hız ayarına ve motora
  dokunulmamıştır.
- Soru 29 ve 30 yanıtlanmamış, sorular dosyası 14:02'deki başsız güncellemeden beri değişmemiştir. Bugün cuma olduğundan G08 sırası
  gelmemiştir (26 Ekim pazartesi). Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiştir. Gözlem günlüğünün gözden geçirmesi
  gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri yanıtlanınca G26'nın kullanıcı payına eşlik etmektir.

## 2026-10-23 17:00 — izleme, makine prizde (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `fea643b9f` olup araya giren commit yoktur. 16:00 oturumu 16:01'de kullanım sınırına takılmış
  (son dökümde `"error":"rate_limit"`, «resets 5pm»), ağaçta iz ve kayıt bırakmamıştır. Başka oturumun dosyaları (`.gitignore`,
  `package.json`, `scripts/kalite.mjs`, `scripts/karar-arama/`) 17 Ekim 00:13'teki hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124
  boştur, `.next/dev/types/validator.ts` yoktur. Oturum 17:00:53'te zamanında başlamıştır.
- Güç: Son Kernel-Power olayı 12:30'daki güç kaynağı değişikliğidir (105), yani makine o saatten bu yana uyumamış ve kapak kapanmamıştır.
  Makine prizdedir (`BatteryStatus` 2, şarj 17:00'de %100), boş bellek 855 MB'tır.
- Kapı: Günün tam kapısı 13:00 oturumunda 1018 testte geçmiş, o zamandan bu yana yalnız plan belgeleri değişmiştir. Bu yüzden yeni
  kapı koşulmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 17:02): Motor 11:42'den beri pid 54468 ile çalışmakta olup devre kapalıdır. 23 Ekim'in altıncı,
  yedinci ve sekizinci captcha'sı 15:12'de (410 sn mola), 15:47'de (537 sn mola) ve 16:26'da (483 sn mola) 40, 35 ve 39 dakikalık
  aralıklarla gelmiştir. Soru 31'deki döküm bu üç olayla güncellenmiş, varsayım değişmemiştir. Son bir saatte 84 karar inmiş olup 429 ve
  ağ hatası görülmemiştir. Arşiv 135.940'a çıkmış, kuyruk 797 ve kalıcı hata 163'tür. Tarama 2019 yılının 14.11-15.11.2019 penceresinde
  olup seçilen pencere sayısı 419/661'dir. Yararlı karar sayısı 52.186'ya ulaşmıştır. Hız ayarına ve motora dokunulmamıştır.
- Soru 29 ve 30 yanıtlanmamış, sorular dosyası 15:03'teki başsız güncellemeden beri kullanıcı tarafından değiştirilmemiştir. Bugün cuma
  olduğundan G08 sırası gelmemiştir (26 Ekim pazartesi). Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiştir. Gözlem
  günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri yanıtlanınca G26'nın kullanıcı
  payına eşlik etmektir.

## 2026-10-23 18:00 — izleme, makine prizde (başsız oturum, açık ajan görevi yok)

- Devralma: `DURAKLAT` yok, son commit `c11797a57` olup araya giren commit yoktur. Başka oturumun dosyaları (`.gitignore`,
  `package.json`, `scripts/kalite.mjs`, `scripts/karar-arama/`) 17 Ekim 00:13'teki hâlinde olup bunlara dokunulmamıştır. 3123 ve 3124
  boştur, `.next/dev/types/validator.ts` yoktur. Oturum 18:00:47'de zamanında başlamıştır.
- Güç: Son Kernel-Power olayı 12:30'daki güç kaynağı değişikliğidir (105), yani makine o saatten bu yana uyumamış ve kapak kapanmamıştır.
  Makine prizdedir (`BatteryStatus` 2, şarj %100). Boş bellek 224 MB'a inmiş olup bu değer kapı koşulsaydı işçi sayısını 2'ye düşürecek
  düzeydedir.
- Kapı: Günün tam kapısı 13:00 oturumunda 1018 testte geçmiş (`logs/kalite-son.json` 13:18), o zamandan bu yana yalnız plan belgeleri
  değişmiştir. Bu yüzden yeni kapı koşulmamıştır.
- Hasat (`npm run yargi:hasat-durum`, 18:01): Motor 11:42'den beri çalışmakta olup devre kapalıdır. 23 Ekim'in dokuzuncu ve onuncu
  captcha'sı 17:03'te (371 sn mola) ve 17:40'ta (527 sn mola) 37'şer dakikalık aralıkla gelmiştir. Soru 31'deki döküm bu iki olayla
  güncellenmiş, varsayım değişmemiştir. Son bir saatte 71 karar inmiş olup 429 ve ağ hatası görülmemiştir. Arşiv 136.010'a çıkmış, kuyruk
  802 ve kalıcı hata 163'tür. Tarama 2019 yılının 01.11-03.11.2019 penceresinde olup seçilen pencere sayısı 424/663'tür. Yararlı karar
  sayısı 52.205'e ulaşmıştır. Hız ayarına ve motora dokunulmamıştır.
- Soru 29 ve 30 yanıtlanmamış, sorular dosyası 17:03'teki başsız güncellemeden beri kullanıcı tarafından değiştirilmemiştir. Bugün cuma
  olduğundan G08 sırası gelmemiştir (26 Ekim pazartesi). Seçilebilir `[ ]` görev bulunmadığından kod değiştirilmemiştir. Gözlem
  günlüğünün gözden geçirmesi gözlem 202'deki gerekçeyle ertelenmiştir. Sıradaki adım, sorulardan biri yanıtlanınca G26'nın kullanıcı
  payına eşlik etmektir.
