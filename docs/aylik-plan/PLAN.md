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
kilidiyle 2026-10-30'a kadar engellidir. Otonom oturumlar saatte bir `FethiGuzel-OtonomCalisma`
zamanlanmış göreviyle başlar (`scripts/otonom/calis.ps1`); kullanım sınırı dolduysa oturum kısa sürede
biter; çalıştırıcı limit mesajındaki yenilenme saatini okuyup 3 dk sonrasına tek seferlik
`FethiGuzel-OtonomYenileme` görevi kurar (okunamazsa saatlik tetik yakalar).

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
  **G07 (2026-10-02):** TBB Reklam Yasağı Yönetmeliği m.7/1-e (RG 9/8/2024) arama motorunda üst sıraya yönelik
  anahtar sözcük ve sayfa adresini yasaklar. SEO yalnız içerik sorgularını (madde, şerh, karar, hesaplama, rehber)
  hedefler; "yer + avukat" türü anahtar sözcük, adres, başlık ya da dosya adı eklenmez (`lib/__tests__/reklam-uyum.test.mjs`).
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

- [x] **G04 — API ve üyelik güvenlik denetimi** · bağımlı: G01 · beceri: security-review · 2026-10-01: 10 bulgu kapandı
  - Sonuç (`raporlar/guvenlik-api.md`): ödeme dönüşü tekrarı (tek ödemeyle sınırsız üyelik) ve sır eksikken sahte
    üye çerezi kapandı; girdi sınırları, yönetici çerezi HMAC + deneme sınırı, köken (CSRF) denetimi, çok örnekli
    depoda kayıt kaybı, rotalarda iç hata sızıntısı/edge, pack-health/content-pack, arşiv deneme sınırı. +34 test.
  - `app/api/uyelik/[...path]`, `app/api/yargi/[...path]`, `app/api/content-pack/[kanunId]`,
    `app/api/pack-health`, `lib/uyelik/*`: kimlik doğrulama, oturum çerezi bayrakları, CSRF, hız sınırı,
    girdi doğrulama, iyzico geri çağrı HMAC doğrulaması, yönetici uçlarında yetki, ücretli arşive
    üyeliksiz erişim, `kanunId` ile yol geçişi.
  - Her bulgu için önce kırmızı test, sonra düzeltme. Rapor: `raporlar/guvenlik-api.md`.
  - Ön bulgular (2026-10-01, G00 incelemesi sırasında): `app/api/uyelik/[...path]/route.ts` 500 yanıtında iç
    hata metnini (`e.message`) istemciye döndürüyor (bilgi sızıntısı); aynı rota `runtime = 'edge'` kullanıyor
    (Next 16'da kullanımdan kalktı) — `nodejs`'e geçişte `lib/uyelik/http` Web Crypto bağımlılığını ölç.

- [x] **G05 — Mobil uygulama güvenliği** · bağımlı: G01 · 2026-10-01: 2 bulgu kapandı, 3'ü raporda
  - Sonuç (`raporlar/guvenlik-mobil.md`): herkese açık depoda düz duran Play inceleme kodu (ücretli arşivi
    herkese açıyordu) → pakete yalnız özeti girer, yeni kod git dışında; FileProvider ortak depolama kökü →
    uygulama klasörü. Abonelik sunucu doğrulaması ve yedekleme tutarsızlığı kullanıcı kararına (soru 7–8).
    +16 test (`mobile/scripts/__tests__/guvenlik.test.mjs`).
  - `mobile/capacitor.config.*`, Android manifest ve ağ güvenliği: allowBackup, cleartext, debuggable,
    WebView gezinme kısıtı, pakete gömülü anahtar/sır taraması, abonelik doğrulamasının sunucu tarafında
    yapılıp yapılmadığı. `mobile/keystore-password-SIL-SONRA.txt` gibi düz metin sırlar için kullanıcıya
    not (silme yok). Rapor: `raporlar/guvenlik-mobil.md`.

- [x] **G06 — SEO ve performans başlangıç ölçümü** · bağımlı: G01 · 2026-10-02: rapor + tekrar koşulabilir betikler
  - Yerel derleme + `next start` + tarayıcı betiği: durum kodları, canonical, başlık/açıklama tekrarları,
    noindex, site haritası kapsamı, kırık bağlantı, JSON-LD geçerliliği, sayfa ağırlığı.
  - Lighthouse (mobil) 12 anahtar sayfa: ana sayfa, makale, mevzuat madde, şerh, rehber, ders notu hub +
    not, hesaplama, yargı arşivi, kavram, bölge sayfası, yazar sayfası.
  - Rapor: `raporlar/seo-baslangic.md` (sayılarla); sonraki görevler buna göre önceliklendirilir.

- [x] **G06b — Canonical, meta ve site haritası düzeltmeleri** · bağımlı: G06 · kaynak: `raporlar/seo-baslangic.md` S1–S5, S8 · 2026-10-02: canonical uyumsuz 60 → 0, 500 → 0, derlemede 404 rehber 8 → 0
  - S1/S2: `app/layout.tsx:142` kök `alternates.canonical` tüm alt sayfalara miras kalıyor → kendi metadata'sı olmayan
    sayfalar ana sayfayı canonical gösteriyor ve varsayılan başlığı taşıyor (`/makaleler`, `/eserlerim`, `/icthat`,
    `/on-form`, `/uyelik/sozlesme`, `/kategori/*` 61, `/makale-oku/*` 11). Kökten kaldır; bu sayfalara başlık, açıklama,
    kendi canonical'ı.
  - S3: www'siz canonical yazan 4 dosya (`[category]/page.tsx:30`, `[category]/[slug]/page.tsx:68`, `gizlilik`, `yasal-uyari`).
  - S4: `public/sitemap-index.xml` 404 haritaları gösteriyor → robots.txt'deki beş haritaya göre yeniden yaz ya da sil.
  - S5/S8: `/ders-notlari/<üni>/<ders>/pdf` bazı notlarda 500; `/site-haritasi`'nda Türkçe karakterli kırık bağlantı;
    `/ingilizce-avukat` 307 → 308 ve site haritasından çık.
  - Test: metadata üreticilerine birim testi; derleme sonrası `node scripts/seo-tara.mjs` canonical uyumsuz 0,
    varsayılan başlık tekrarı 0, 500 yok.

- [x] **G07 — Avukatlık reklam yasağı uyum denetimi** · bağımlı: — · beceri: hukuki-halusinasyon-onleme · 2026-10-02: 6 düzeltme, 4 yapısal karar kullanıcıda (soru 10–13)
  - Tüm arayüz metinleri, bölge sayfaları (`*-avukat`), hizmetler, ana sayfa, mobil mağaza metinleri.
  - Mevzuat metinlerini birincil kaynaktan doğrula (mevzuat.gov.tr, barobirlik.org.tr); uydurma atıf yok.
  - Riskli ifadeleri düzelt; rapor: `raporlar/reklam-uyum.md` (ifade → sorun → yeni metin).

- [ ] **G08 — Hasat motoru haftalık bakımı** (her hafta tekrarlanır; işaret kutusu yerine ILERLEME.md'ye yazılır)
  - `npm run yargi:hasat-durum`: captcha sıklığı, öğrenilmiş tavan, hata sınıfları, disk, emsal sayacı.
  - Sorun varsa düzelt (hız yükseltmeden); `raporlar/hasat-haftalik.md`'ye tek satır özet.

## Hafta 2 (8–14 Ekim) — Yazar kimliği, içerik mimarisi, SEO

- [x] **G09 — Yazar/avukat kimliği sistemi** · bağımlı: G07 · 2026-10-02: Person tek kaynak (17 → 1), yazar kutusu 6 türde, soru 14
  - Tek kaynak `lib/yazar.ts`: ad, unvan, baro, akademik bilgi, eserler, sameAs bağlantıları — yalnız
    sitede zaten var olan ve doğrulanabilen bilgilerden (akademik-profil, eserlerim, avukat-fethi-guzel).
    Yeni kimlik bilgisi uydurulmaz; eksik alanlar `raporlar/kullaniciya-sorular.md`'ye yazılır.
  - `<YazarKutusu>`: her içerik türünde (makale, şerh, rehber, ders notu, karar özeti, kavram)
    yazar satırı, son güncelleme, kaynaklar, yazar sayfasına bağlantı. Reklam dili yok.
  - Kabul: bileşen testleri; 6 içerik türünde görünür; Person JSON-LD tek kaynaktan.

- [x] **G10 — Yapılandırılmış veri** · bağımlı: G09, G06 · 2026-10-03: çift marka eki 402/915 → 0; 4.547 JSON-LD bloğu denetimli
  - G06b notu (S7): örnek sayfaların 63/307'sinde başlık "| Av. Fethi Güzel" ekini iki kez taşıyor (kök
    `template` + başlıkta hazır ek; mevzuat kanun listesi, `/bilgi`, kategori). Uzun başlıkların ana kaynağı; önce bu.
  - Person, Article/ScholarlyArticle, BreadcrumbList, Legislation (mevzuat), yalnız gerçek soru-cevapta
    FAQPage. Otomatik doğrulama testi (zorunlu alanlar, tek @id şeması).
  - G09 notu: Person artık `lib/yazar.ts`'ten (`yazarRef()` / `yazarPersonDugumu()`); yazar sayfası ve
    `english-speaking-lawyer` kişiyi ayrıca `@type: Attorney` (LocalBusiness alt türü, `@id`'siz) olarak basıyor →
    ProfilePage + `mainEntity: yazarRef()` (soru 11 yanıtıyla birlikte). `/icthat/[id]` karar analizinde JSON-LD yok ve
    başlığı "| Av. Fethi Güzel"i iki kez taşıyor; `/makale-oku/*` sayfalarında Article/ScholarlyArticle yok.

- [x] **G11 — Ders notları dizin mimarisi (ince içerik riski)** · bağımlı: G06 · 2026-10-05: dizine açık not 6.552 → 26, fakülte sayfası 84 → 1, harita 6.637 → 28; rehber sayfa ↔ harita ayrışması 0; soru 16
  - 11.623 notun çoğu `template` katmanında (şehir adı değiştirilmiş şablon). Bu sayfalar Google'ın
    yararlı içerik değerlendirmesinde siteyi aşağı çekebilir.
  - `template` → noindex + ilgili dersin en iyi notuna canonical; `curated` → dizine; site haritası
    yalnız dizine alınabilir sayfalar. Başlık/açıklama tekrarlarını gider.
  - Kabul: sitemap'te template yok; test ile doğrulanır; önce/sonra sayıları raporda.
  - G06b notu: `yapı-ruhsati-nedir` dizine açık ama hiçbir haritada yok (harita üreticisi ile sayfanın yayın ölçütü
    farklı). Harita kapsamını sayfanın `robots` kararıyla tek kaynaktan eşitle; ders notu hub'larındaki 14 kırık bağlantı da burada.

- [x] **G12 — İç bağlantı ağı** · bağımlı: G11 · 2026-10-05: BreadcrumbList 543/804 → 799/799 (tarama kuralı), tek kaynak; madde sayfasında 1.961 ilgili içerik bağlantısı; kapalı/yönlenen hedefe bağlantı 0 (ders notu gezinme listeleri hariç, soru 17)
  - Mevzuat maddesi ↔ şerh ↔ ders notu ↔ Yargıtay kararı (yalnız "yararlı" etiketliler) ↔ rehber ↔
    hesaplama arası "ilgili içerik" blokları; kırıntı yolu (breadcrumb) her sayfada.
  - G11 notu: bağlantı yalnız dizine açık sayfaya verilir. Rehber sayfasındaki "ilgili rehberler"
    (`getRelatedArticles`) yayından düşen 23 rehbere de bağlanıyor (`isPublished` ile süz); ders notlarında
    dizine açık hedef 26 temsilci not ve Ankara fakülte sayfası (`lib/ders-notlari/dizin.mjs`).

- [x] **G13 — Performans (Core Web Vitals)** · bağımlı: G06 · 2026-10-07: LCP 10 sayfada düştü, aktarım %21–56 azaldı, CLS 0; tek gösterilebilen gerileme (yargı arşivi TBT) gerekçeli kabul
  - Görsel biçim/boyut, font yükleme, JS paket boyutu analizi, GSAP yalnız gerektiği yerde, veri
    dosyalarında önbellek başlıkları. Hedef (mobil Lighthouse): LCP < 2,5 sn, CLS < 0,1, INP < 200 ms
    anahtar sayfalarda.
  - Ölçüm (önce `d077adb85` → sonra HEAD, iki sunucuda dönüşümlü 3+3 koşu, ortanca; ayrıntı ve aralıklar `gorevler/G13.md` adım 7–8):

| Sayfa | LCP (ms) | TBT (ms) | Aktarım (KB) |
|---|---|---|---|
| ana sayfa | 6.606 → 5.316 | 811 → 866 | 1.066 → 758 |
| makale | 5.004 → 4.236 | 129 → 139 | 810 → 568 |
| mevzuat madde | 939 → 927 | 121 → 63 | 43 → 43 |
| şerhli madde | 998 → 926 | 123 → 62 | 59 → 59 |
| rehber | 4.605 → 4.292 | 252 → 466 (ters turda 294 → 328) | 1.229 → 610 |
| ders notu hub | 4.764 → 4.187 | 100 → 215 | 844 → 604 |
| ders notu | 9.838 → 7.692 | 2.524 → 4.686 (ara turda 2.909 ↔ 2.878) | 1.100 → 859 |
| hesaplama | 5.236 → 4.724 | 70 → 111 | 770 → 605 |
| yargı arşivi | 5.184 → 5.037 | 658 → 1.549 (gerekçeli kabul) | 1.251 → 628 |
| kavram | 4.635 → 4.378 | 202 → 189 | 1.242 → 545 |
| bölge | 4.827 → 4.264 | 66 → 558 (ters turda 182 → 89) | 789 → 548 |
| yazar | 4.899 → 4.621 | 54 → 339 (ters turda 150 → 112) | 1.280 → 583 |

  - Mobil LCP hedefi tutmadı: Kısılmamış izde LCP, FCP ile aynı anda (0,5–1,5 sn) gerçekleşmekte, benzetimli LCP'nin 3–4 sn'lik
    farkı ilk boyamadan önce istenen Next.js betik parçalarının LCP yoluna katılmasından doğmaktadır. Yol ilk yük betiğini azaltmaktır
    (bütçe cırcırı `scripts/derleme-butce-tara.mjs`); gerçek kullanıcı değeri yayından sonra Search Console'dan okunur.

- [x] **G14 — Yargı kararları yayın hazırlığı** · bağımlı: G04 · 2026-10-07: 114.625 kararın 39.718'i yayında; ücretli indeks `public/` dışında (401); karar sayfası künye + kararın başı, indeks dışı 404; `smoke-ui` 23/23; madde atfı 649 → 1.521 madde; rapor `raporlar/yargi-yayin.md`, soru 19–20
  - Kapanış (`279d3c5c9`): Adım 6 (madde ↔ karar bağlantısı) soru 20'nin yanıtına bağlı olarak ertelendi. Yanıt olumluysa
    `KARAR_SAYFASI_DIZINDE` açılır ve bağlantı `mevzuat/atif.json.gz` eşlemesinden kurulur. Aşağıdaki G13 notu (arşiv sayfası
    TBT'si) bu görevde ele alınmadı, zira yalnız karar sayfası düzenlendi. Not G15'e devredilir. Yayın günü yapılacaklar: üye
    hesabıyla indeks okuması bir kez denenir, mobil tam derleme rehber, kütüphane ve tohum verisini de yeniler.
  - `mobile/scripts/build-icthat-data.mjs`: `yararli` alanıyla süzme (yalnız emsal ve benzersiz kararlar
    yayına), karar sayfası başlığı/özeti, üyelik duvarının doğruluğu, index boyutu.
  - G04 notu: ücretli `yargi-index.json.gz` `public/` altında; yalnız `next.config.ts` beforeFiles yeniden yazması
    koruyor. Dosyayı `public/` dışına taşı (mobil `build-yargi-index.mjs`, `karar-text.ts`, outputFileTracingIncludes).
  - G05 notu (mobil): `mobile/data-src/icthat/archive.json.gz` (70.249 karar, 2026-09-11) konu/atıf zenginleştirmesi
    olmadan üretilmiş (`j,h,c` alanları yok; commit'li sahne kopyası 30.077 kararla zengin). Arayüz derlemesinde
    `smoke-ui` iki adımda kırmızı: arşivde konu başlığı yok, arama tuş başına ~430 ms. Tam mobil derleme
    (`build-icthat-data` → `build-yargi-index` sırası) ile yeniden üret ve duman testini yeşile çek.
  - G13 notu: `/yargi-kararlari` mobil TBT'si yaklaşık 1,5 sn. Google Fonts stil dosyası kalkıp ilk boyama öne gelince
    hidrasyon TBT penceresine girdi ve ek stil/yerleşim geçişleri doğdu (gerekçeli kabul, `gorevler/G13.md`). Sayfa
    yeniden düzenlenirken React çatı parçasındaki uzun görevler ve yazı tipi değişiminin yerleşim maliyeti profillenir.
  - Kabul: süzme testi; yayına girecek karar sayısı raporda.
  - G12 notu: ana sayfadaki karar önizlemesi (`components/YargiPreview.tsx`) noindex üyelik sayfasına
    (`/yargi-kararlari/[id]`) bağlanıyor; madde ↔ karar ilgili içerik bağlantısı (yalnız `yararli`) yayındaki karar
    sayfasıyla birlikte burada kurulur (`lib/ic-baglanti/dizin.json`, `components/IlgiliIcerik.tsx`).

## Hafta 3 (15–21 Ekim) — Görsel tasarım, grafikler, ders notları

- [ ] **G15 — Tasarım sistemi denetimi** · bağımlı: G06 · beceri: impeccable
  - Renk/tipografi/boşluk jetonları, WCAG AA kontrast, koyu tema, bileşen tutarlılığı; ana sayfa,
    makale, mevzuat, ders notu, yargı arşivi sayfalarında en önemli sorunlar. Önce/sonra ekran görüntüsü
    `raporlar/gorsel/`.
  - DEVAM EDİYOR (2026-10-07): Denetim betiği ve rapor hazır (13/20 → 16/20). Kontrast düğümü 1.957 → 84, hedef ihlali 120 → 4
    (`66df4c355`). Kalan: vurgu zeminli düğmeler (77), küçük bulgular, bileşen tutarlılığı (`gorevler/G15.md`).
  - G14'ten devir (G13 notu): `/yargi-kararlari` mobil TBT'si yaklaşık 1,5 sn. Arşiv sayfası düzenlenirken React çatı
    parçasındaki uzun görevler ve yazı tipi değişiminin yerleşim maliyeti profillenir (`gorevler/G13.md`).

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
  - G07 notu: reklam yasağı soruları 10–13 (bölge sayfası adresleri, LegalService, arabulucu sıfatı, ön form çağrısı)
    yanıtlanmadan push yapılmaz; yanıta göre değişiklik tarifi `raporlar/reklam-uyum.md` R1–R4'te.
  - G05 notu: Play Console → Uygulama erişimi talimatındaki inceleme kodu `mobile/inceleme-kodu.local.txt`
    ile güncellenir (eski kod açık depodaydı); CI derlemesi varsa `INCELEME_KODU` gizli değişkeni eklenir.

---

## Ölçüm tablosu (G06 ve G25 doldurur)

| Ölçüt | Başlangıç (G06) | Hedef | Final (G25) |
|---|---|---|---|
| npm audit kritik/yüksek | 1 / 7 | 0 / 0 | |
| Lighthouse mobil performans (ort.) | 47 (10/12 sayfa; ders notu ikisi ölçülemedi) | ≥ 90 | |
| Lighthouse SEO (ort.) | 99 | 100 | |
| Dizine açık ince/şablon sayfa | ~11.600 | 0 | |
| Test sayısı (tüm takımlar) | 466 (G01, 2026-09-30) | +%50 (≥ 699) | |
| Emsal ve benzersiz Yargıtay kararı | 32.394 | artış | |
| Canonical başka adresi gösteren (örnek) | 60 / 307 | 0 | |
| Kırık iç bağlantı (600 örnek) | 18 | 0 | |
