# Aylık Mükemmellik Planı — 1–30 Ekim 2026

> **Otonom oturumlar için:** Önce `docs/aylik-plan/OTONOM.md` dosyasını oku. Görevler sırayla,
> bağımlılıkları bitmiş ilk `[ ]` görevden başlanarak yapılır. Her görev başında ayrıntılı alt plan
> `docs/aylik-plan/gorevler/Gxx.md` dosyasına yazılır (superpowers:writing-plans ilkeleriyle).

**Kullanıcı talimatı (2026-09-30, Av. Fethi Güzel):** "Bir ay içinde yapacağın hiçbir değişikliği push
etmeyeceksin. Siteyi ve uygulamayı görsel ve içerik olarak mükemmel hale getireceksin. Yargı kararlarını
indirmeye devam et. Ders notlarını mükemmelleştir. Görsel ekle, grafik ekle, test ekle. Site ve mobil
uygulamanın açıklarını kapat. Tokenler bittiğinde ve süre sıfırlandığında ben demeden çalışmaya başla ve
devam ettir. Bir ay sonra push ettiğimizde ortaya aşırı kaliteli bir iş çıksın. Tüm Türkiye'de ön
sıralarda çıksın sitem. Avukat kimliğimi, yazar kimliğimi, reklam yapmadan reklam yap."

**Hedef:** 30 Ekim'de tek seferde yayına alınacak; güvenli, hızlı, testli, arama motorlarında hukuk
sorgularında üst sıralara çıkacak nitelikte bir site + mobil uygulama.

**Yöntem:** Yerel `main` dalında çalışılır, her görev yerel commit ile kapanır. Push `.git/hooks/pre-push`
kilidiyle 2026-10-30'a kadar engellidir. Otonom oturumlar 3 saatte bir `FethiGuzel-OtonomCalisma`
zamanlanmış göreviyle başlar (`scripts/otonom/calis.ps1`); kullanım sınırı dolduysa oturum kısa sürede
biter, bir sonraki pencerede yeniden dener.

## Genel kurallar (her görev için geçerli)

- **Push / yayın yok:** `git push`, `vercel`, `npm publish`, Play Console yüklemesi, sosyal medya
  paylaşımı yapılmaz. Kilit dosyası ya da hook devre dışı bırakılmaz.
- **Kırma yok:** Her commit'ten önce `npm run kalite:hizli` geçer; günde en az bir kez `npm run kalite`
  (tam derleme dahil) çalışır. Kırmızı test bırakılmaz; bırakılacaksa görev "devam ediyor" kalır.
- **Hukuki doğruluk:** Kanun maddesi, karar künyesi, yazar atfı yazmadan önce `hukuki-halusinasyon-onleme`
  becerisi uygulanır; doğrulanamayan künye yazılmaz. Akademik hukuk metninde
  `C:/Users/HUAWEI/Desktop/makale/YAZIM-DILI.md` kuralları geçerlidir.
- **Reklam yasağı uyumu:** Avukatlık Kanunu m.55, TBB Meslek Kuralları ve Reklam Yasağı Yönetmeliği.
  Üstünlük iddiası ("en iyi", "lider", "kazanma oranı"), müvekkil yorumu, ücret ilanı, "hemen arayın"
  türü çağrı, karşılaştırma yok. Otorite; yayın, şerh, karar arşivi, hesaplama araçları ve bilgi
  içeriğiyle kurulur.
- **Veri güvenliği:** `data/yargi-kararlari/`, `data/uyelik/`, `.env*`, anahtar deposu dosyaları
  silinmez, taşınmaz; üretim sırları okunup loglanmaz.
- **Hasat motoru:** Çalışmaya devam eder; hız ayarları yükseltilmez (captcha görülen hızın altı).
- **Başka oturumlarla çakışma:** Görev başında `git status` temiz değilse önceki oturumun yarım işi
  `ILERLEME.md`'den anlaşılır ve tamamlanır; tanınmayan değişiklik silinmez.

---

## Hafta 1 (1–7 Ekim) — Temel, güvenlik, ölçüm

- [ ] **G00 — ACİL: canlı site kapalı (Vercel 402 DEPLOYMENT_DISABLED)** · 2026-10-01 tespit · KULLANICI EYLEMİ
  - avfethiguzel.com ve www: tüm adresler (robots.txt, sitemap, API dahil) 402 "Payment required".
    Ödeme ya da kullanım limiti; yalnız kullanıcı Vercel panelinden (Usage / Billing) çözebilir.
  - Ajanın payı: kullanım sürücülerini azaltan değişiklikleri hazırla (her madde için çalışan Node
    route → statik/önbellekli; API yanıtlarına CDN önbellek başlıkları; görsel optimizasyon kullanımı)
    ve `raporlar/vercel-kullanim.md`'ye yaz. Kullanıcı panelden hangi limitin aşıldığını söyleyince öncelik buna göre.
  - Bu değişiklikler de 30 Ekim'e kadar push edilmez; kullanıcı erken yayın isterse karar onundur.

- [x] **G01 — Kalite kapısı** · bağımlı: —
  - `npm run kalite:hizli`: tsc --noEmit + eslint + tüm `node --test` takımları (quality, ders-notlari,
    scripts, uyelik, galaxy, yargi). `npm run kalite`: bunlar + `next build`.
  - Mevcut kırmızı testleri ve tip hatalarını düzelt; başlangıç sonucunu `raporlar/kalite-baslangic.md`'ye yaz.
  - Kabul: iki komut da yeşil; süreleri kayıtlı.

- [x] **G01b — Lint borcu** · bağımlı: G01 · 2026-10-01: 82 → 8 hata
  - `scripts/lint-taban.json`'daki 82 hata (34 dosya). Not: başlangıçtaki 3 `rules-of-hooks` hatası mobil derleme
    çıktısındaydı (kapsam dışı), gerçek hata değil. Önce `set-state-in-effect` (16), iç bağlantılarda `<a>` → `<Link>` (25), kalanlar.
  - Her düzeltme davranışı koruyan bir testle ya da ekran kontrolüyle; cırcır tabanı kendiliğinden düşer.
  - Kalan 8 hatanın tümü `set-state-in-effect`; gerekçe: HesaplamaTools:73 (paylaşılan `#araç` bağlantısında kartı
    açıp kaydırır, DOM'a bağlı), :3093 (açıklama şablonu; işleyiciye taşımak ilk değerin uygulanmasını değiştirir,
    G22 uçtan uca hesaplama testleriyle), :3770 (favori/son kullanılan localStorage'dan), useGalaxy:43 (dil tercihi kalıcı
    depodan), mobil IcthatApp:737 ve PortalApp:123/757/1018 (yükleme durumunu sıfırlayan veri effect'leri; mobil
    testler G05/G21'de yazılınca dönüştürülür). Hiçbiri hata üretmiyor; yalnız fazladan bir çizim turu.
  - Kabul: taban ≤ 10 hata; kalanların gerekçesi raporda.

- [x] **G02 — Bağımlılık açıkları** · bağımlı: G01
  - `npm audit --omit=dev` (2026-09-30): 1 kritik (next: App Router ara katman atlatma), 7 yüksek
    (postcss XSS, js-yaml, form-data, nanoid, adm-zip, @xmldom/xmldom), 1 orta.
  - Next.js'i aynı ana sürümün yamalı sürümüne yükselt; kalanları `npm audit fix` (—force yok) ile kapat.
  - Kabul: kritik/yüksek 0 (kalan varsa gerekçesi raporda); `npm run kalite` yeşil; mobil audit temiz.

- [x] **G03 — Güvenlik başlıkları ve CSP** · bağımlı: G01
  - `next.config.ts`'de CSP yok. Katı CSP (script-src 'self' + gerekli alanlar, frame-ancestors 'none',
    object-src 'none', base-uri 'self'), COOP/CORP ekle. iyzico ödeme betikleri ve GSAP için izinleri
    ölç, gereksiz alanı açma.
  - Başlıkları doğrulayan test (`next.config` → `headers()` çıktısı) yaz.
  - Kabul: yerel `next start`'ta tüm sayfalar CSP ihlali olmadan açılır (tarayıcı konsolu/curl ile ölç).

- [x] **G03b — Arama sayfası hydration hatası** · bağımlı: G03
  - `/ara?q=kira` derlenmiş sitede React #418 (sunucu HTML'i istemciyle uyuşmuyor). `node scripts/csp-dogrula.mjs` ile yeniden üretilir.
  - Kök nedeni bul (tarih/saat, searchParams, tarayıcıya özgü değer), testle sabitle.

- [ ] **G04 — API ve üyelik güvenlik denetimi** · bağımlı: G01 · beceri: security-review
  - `app/api/uyelik/[...path]`, `app/api/yargi/[...path]`, `app/api/content-pack/[kanunId]`,
    `app/api/pack-health`, `lib/uyelik/*`: kimlik doğrulama, oturum çerezi bayrakları, CSRF, hız sınırı,
    girdi doğrulama, iyzico geri çağrı HMAC doğrulaması, yönetici uçlarında yetki, ücretli arşive
    üyeliksiz erişim, `kanunId` ile yol geçişi.
  - Her bulgu için önce kırmızı test, sonra düzeltme. Rapor: `raporlar/guvenlik-api.md`.
  - Ön bulgular (2026-10-01, G00 incelemesi sırasında): `app/api/uyelik/[...path]/route.ts` 500 yanıtında iç
    hata metnini (`e.message`) istemciye döndürüyor (bilgi sızıntısı); aynı rota `runtime = 'edge'` kullanıyor
    (Next 16'da kullanımdan kalktı) — `nodejs`'e geçişte `lib/uyelik/http` Web Crypto bağımlılığını ölç.

- [ ] **G05 — Mobil uygulama güvenliği** · bağımlı: G01
  - `mobile/capacitor.config.*`, Android manifest ve ağ güvenliği: allowBackup, cleartext, debuggable,
    WebView gezinme kısıtı, pakete gömülü anahtar/sır taraması, abonelik doğrulamasının sunucu tarafında
    yapılıp yapılmadığı. `mobile/keystore-password-SIL-SONRA.txt` gibi düz metin sırlar için kullanıcıya
    not (silme yok). Rapor: `raporlar/guvenlik-mobil.md`.

- [ ] **G06 — SEO ve performans başlangıç ölçümü** · bağımlı: G01
  - Yerel derleme + `next start` + tarayıcı betiği: durum kodları, canonical, başlık/açıklama tekrarları,
    noindex, site haritası kapsamı, kırık bağlantı, JSON-LD geçerliliği, sayfa ağırlığı.
  - Lighthouse (mobil) 12 anahtar sayfa: ana sayfa, makale, mevzuat madde, şerh, rehber, ders notu hub +
    not, hesaplama, yargı arşivi, kavram, bölge sayfası, yazar sayfası.
  - Rapor: `raporlar/seo-baslangic.md` (sayılarla); sonraki görevler buna göre önceliklendirilir.

- [ ] **G07 — Avukatlık reklam yasağı uyum denetimi** · bağımlı: — · beceri: hukuki-halusinasyon-onleme
  - Tüm arayüz metinleri, bölge sayfaları (`*-avukat`), hizmetler, ana sayfa, mobil mağaza metinleri.
  - Mevzuat metinlerini birincil kaynaktan doğrula (mevzuat.gov.tr, barobirlik.org.tr); uydurma atıf yok.
  - Riskli ifadeleri düzelt; rapor: `raporlar/reklam-uyum.md` (ifade → sorun → yeni metin).

- [ ] **G08 — Hasat motoru haftalık bakımı** (her hafta tekrarlanır; işaret kutusu yerine ILERLEME.md'ye yazılır)
  - `npm run yargi:hasat-durum`: captcha sıklığı, öğrenilmiş tavan, hata sınıfları, disk, emsal sayacı.
  - Sorun varsa düzelt (hız yükseltmeden); `raporlar/hasat-haftalik.md`'ye tek satır özet.

## Hafta 2 (8–14 Ekim) — Yazar kimliği, içerik mimarisi, SEO

- [ ] **G09 — Yazar/avukat kimliği sistemi** · bağımlı: G07
  - Tek kaynak `lib/yazar.ts`: ad, unvan, baro, akademik bilgi, eserler, sameAs bağlantıları — yalnız
    sitede zaten var olan ve doğrulanabilen bilgilerden (akademik-profil, eserlerim, avukat-fethi-guzel).
    Yeni kimlik bilgisi uydurulmaz; eksik alanlar `raporlar/kullaniciya-sorular.md`'ye yazılır.
  - `<YazarKutusu>`: her içerik türünde (makale, şerh, rehber, ders notu, karar özeti, kavram)
    yazar satırı, son güncelleme, kaynaklar, yazar sayfasına bağlantı. Reklam dili yok.
  - Kabul: bileşen testleri; 6 içerik türünde görünür; Person JSON-LD tek kaynaktan.

- [ ] **G10 — Yapılandırılmış veri** · bağımlı: G09, G06
  - Person, Article/ScholarlyArticle, BreadcrumbList, Legislation (mevzuat), yalnız gerçek soru-cevapta
    FAQPage. Otomatik doğrulama testi (zorunlu alanlar, tek @id şeması).

- [ ] **G11 — Ders notları dizin mimarisi (ince içerik riski)** · bağımlı: G06
  - 11.623 notun çoğu `template` katmanında (şehir adı değiştirilmiş şablon). Bu sayfalar Google'ın
    yararlı içerik değerlendirmesinde siteyi aşağı çekebilir.
  - `template` → noindex + ilgili dersin en iyi notuna canonical; `curated` → dizine; site haritası
    yalnız dizine alınabilir sayfalar. Başlık/açıklama tekrarlarını gider.
  - Kabul: sitemap'te template yok; test ile doğrulanır; önce/sonra sayıları raporda.

- [ ] **G12 — İç bağlantı ağı** · bağımlı: G11
  - Mevzuat maddesi ↔ şerh ↔ ders notu ↔ Yargıtay kararı (yalnız "yararlı" etiketliler) ↔ rehber ↔
    hesaplama arası "ilgili içerik" blokları; kırıntı yolu (breadcrumb) her sayfada.

- [ ] **G13 — Performans (Core Web Vitals)** · bağımlı: G06
  - Görsel biçim/boyut, font yükleme, JS paket boyutu analizi, GSAP yalnız gerektiği yerde, veri
    dosyalarında önbellek başlıkları. Hedef (mobil Lighthouse): LCP < 2,5 sn, CLS < 0,1, INP < 200 ms
    anahtar sayfalarda.

- [ ] **G14 — Yargı kararları yayın hazırlığı** · bağımlı: G04
  - `mobile/scripts/build-icthat-data.mjs`: `yararli` alanıyla süzme (yalnız emsal ve benzersiz kararlar
    yayına), karar sayfası başlığı/özeti, üyelik duvarının doğruluğu, index boyutu.
  - Kabul: süzme testi; yayına girecek karar sayısı raporda.

## Hafta 3 (15–21 Ekim) — Görsel tasarım, grafikler, ders notları

- [ ] **G15 — Tasarım sistemi denetimi** · bağımlı: G06 · beceri: impeccable
  - Renk/tipografi/boşluk jetonları, WCAG AA kontrast, koyu tema, bileşen tutarlılığı; ana sayfa,
    makale, mevzuat, ders notu, yargı arşivi sayfalarında en önemli sorunlar. Önce/sonra ekran görüntüsü
    `raporlar/gorsel/`.

- [ ] **G16 — Ana sayfa ve yazar sayfaları** · bağımlı: G09, G15
  - Otorite öncelikli kurgu: yazar, eserler, şerh külliyatı, karar arşivi büyüklüğü, güncel içtihat.
    Satış/reklam dili yok.

- [ ] **G17 — Grafikler** · bağımlı: G15 · beceri: dataviz
  - "Yargıtay karar arşivi" istatistik sayfası: yıllara, birimlere, hukuk alanlarına göre dağılım,
    emsal/benzer oranları (veri: `_state/benzerlik.jsonl`, `index.jsonl`; derleme anında statik JSON).
  - Hesaplama araçlarına görsel döküm (tazminat bileşenleri, faiz zaman çizelgesi).

- [ ] **G18 — Ders notlarına şemalar** · bağımlı: G15
  - Veriyle beslenen SVG bileşeni `<AkisSemasi>`: dava süreci, icra takibi, ceza muhakemesi evreleri,
    borç ilişkisi, yasal miras payları. Erişilebilir alt metin; en az 10 derste kullanım.

- [ ] **G19 — Ders notları kalite dalgası 1** · bağımlı: G11, G18 · beceri: hukuki-halusinasyon-onleme
  - En çok aranan 10 ders (borçlar genel, medeni usul, ceza genel, anayasa, idare, iş, ticari işletme/
    şirketler, icra-iflas, miras, eşya): her biri için kanonik `curated` not — paragraf anlatım, ≥ 3 örnek
    olay, sınav iskeleti, tuzak defteri, doğrulanmış kaynaklar, şema, kısa test.
  - Kabul: `docs/ders-notlari/KALITE-VE-ARASTIRMA.md` §4 ölçütleri; halüsinasyon denetimi raporu.

- [ ] **G20 — Paylaşım görselleri (OG)** · bağımlı: G09
  - `next/og` ile içerik türüne göre dinamik görseller (başlık + yazar adı + tür); reklam unsuru yok.

## Hafta 4 (22–30 Ekim) — Mobil, testler, cila, yayın hazırlığı

- [ ] **G21 — Mobil uygulama cilası** · bağımlı: G05, G15
  - Görsel tutarlılık, erişilebilirlik, çevrimdışı paketlerin güncellenmesi (yeni kararlar, notlar),
    sürüm numarası artırımı; mağazaya yükleme YOK (yayın günü).

- [ ] **G22 — Uçtan uca testler** · bağımlı: G01
  - Playwright: arama, mevzuat madde, hesaplama (2026 değerleriyle doğruluk), üyelik giriş/ödeme (sandbox
    taklidi), yargı arşivi erişim kontrolü, ders notu gezinmesi.

- [ ] **G23 — Ders notları kalite dalgası 2** · bağımlı: G19
  - Sonraki 10 ders; aynı ölçütler.

- [ ] **G24 — Erişilebilirlik** · bağımlı: G15
  - axe-core ile anahtar sayfalar; ciddi/kritik ihlal 0.

- [ ] **G25 — Son regresyon** · bağımlı: hepsi
  - `npm run kalite`, Lighthouse, güvenlik yeniden taraması, SEO taraması (G06 başlangıcıyla
    karşılaştırmalı) → `raporlar/final.md`.

- [ ] **G26 — Yayın paketi** · bağımlı: G25
  - `PUSH-KONTROL-LISTESI.md`: `git fetch` + uzak `main`'deki günlük içtihat commit'leriyle birleştirme
    (çakışma beklenen dosyalar: `public/data/daily.json`, arşiv JSON'ları), Vercel ortam değişkenleri,
    mobil sürüm adımları, geri alma planı. **Push kullanıcıyla birlikte yapılır.**

---

## Ölçüm tablosu (G06 ve G25 doldurur)

| Ölçüt | Başlangıç (G06) | Hedef | Final (G25) |
|---|---|---|---|
| npm audit kritik/yüksek | 1 / 7 | 0 / 0 | |
| Lighthouse mobil performans (ort.) | | ≥ 90 | |
| Lighthouse SEO (ort.) | | 100 | |
| Dizine açık ince/şablon sayfa | ~11.600 | 0 | |
| Test sayısı (tüm takımlar) | | +%50 | |
| Emsal ve benzersiz Yargıtay kararı | 32.394 | artış | |
