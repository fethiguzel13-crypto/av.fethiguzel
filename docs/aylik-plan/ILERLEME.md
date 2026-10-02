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
