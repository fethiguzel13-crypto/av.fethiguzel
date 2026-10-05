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
