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
