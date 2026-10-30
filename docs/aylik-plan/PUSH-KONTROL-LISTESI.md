# Yayın günü kontrol listesi (G26)

Hazırlandı: 2026-10-19 (başsız oturum, `gorevler/G26.md`). **Push ve birleştirme kullanıcıyla birlikte yapılır.** Bu belge yalnız adları ve
komutları içerir; hiçbir anahtar, şifre ya da değer yazılmaz (`lib/__tests__/yayin-kontrol.test.mjs` bunu ve ad listesini denetler).

`.git/hooks/pre-push` kilidi 2026-10-30'dan itibaren kendiliğinden açılır. O tarihten önce push yalnız kullanıcı kararıyla
`PUSH_IZNI=evet` önekiyle yapılabilir.

## A. Push öncesi kullanıcı kararları

Ayrıntı ve ajanın uyguladığı varsayımlar `raporlar/kullaniciya-sorular.md`'dedir. 2026-10-19 itibarıyla hiçbirinde kullanıcı yanıtı kaydı yoktur.

| Soru | Konu | Push'u engeller mi? |
|---|---|---|
| 1 (G00) | Canlı site Vercel 402 `DEPLOYMENT_DISABLED` ile kapalı; ödeme veya plan kararı | Evet, dağıtım açılmadan yayın görünmez |
| 10-13 (G07) | Bölge sayfaları, her sayfadaki LegalService şeması, "Avukat & Arabulucu" sıfatı, ön form çağrısı (reklam yasağı) | Evet (PLAN G26 notu); değişiklik tarifi `raporlar/reklam-uyum.md` R1-R4 |
| 5 (G04) | Vercel'de üyelik sırları ve Upstash tanımlı mı | Evet, aşağıda C bölümü |
| 9 (G05/M1) | Play inceleme kodunun yenilenmesi | Mobil yayını engeller, siteyi engellemez |
| 7, 8, 24 (G05) | Mobil abonelik sunucu doğrulaması, yedekleme, sürüm lint denetimi | Hayır, varsayımla yayına çıkılabilir |
| 14-23, 25, 27, 28 | İçerik ve tasarım kararları | Hayır, ajanın varsayımı yayındadır |
| 26 | Makinenin prizde tutulması | Hayır, 16 Ekim'de konusuz kalmıştır |
| 29 (G26) | Commit'siz yerel karar arama aracının push'a girmesi | Evet, `git status` temiz olmadan birleştirme başlamaz |

Ek karar (soru 29): Başka bir oturumun yerel karar arama aracı (`scripts/karar-arama/`, `package.json`'daki `test:karar-arama`, `karar-arama`,
`karar-arama:kur` satırları, `scripts/kalite.mjs` ve `.gitignore` değişiklikleri) 2026-10-19'da commit'siz durmaktadır. Push'a girecekse önce
commit'lenir, girmeyecekse `git stash -u` ile ayrılır. Commit'lenirse depodaki test sayısı 971'den 1015'e çıkar.

## B. Uzak dalla birleştirme

Uzak `main`'e günlük içtihat iş akışı (`.github/workflows/daily-icthat.yml`) her gün commit atar. 2026-10-19'daki durum: yerel dal 47 commit
önde, uzak dal 3 commit önde (`8caaeeb5e`, `110b17f8d`, `72e645abd`). Uzaktaki commit'ler yalnız `public/data/daily.json` ve
`public/data/archive/<tarih>.json`'u değiştirir, yerel dal birleştirme tabanından (`aa6e15c00`) bu yana bu dosyalara dokunmamıştır.
`git merge-tree` ön denemesi çakışmasız çıkmıştır.

2026-10-30 11:07'de yinelenen ön denemede yerel dal 153 commit, uzak dal 14 commit öndedir (`8caaeeb5e` … `1af3692d1`, 16-29 Ekim günlük
içtihat commit'leri). Uzak commit'ler yine yalnız `public/data/daily.json` ile on dört `public/data/archive/<tarih>.json` dosyasını
değiştirmekte olup yerel dal birleştirme tabanından bu yana bu dosyalara dokunmamıştır. `git merge-tree` tek ağaç kimliği vermiş, çakışma
çıkmamıştır. İş akışı 30 Ekim commit'ini öğle saatlerinde attığından birleştirmeden hemen önce `git fetch origin` yinelenir.

30 Ekim commit'i (`ebd55cfb4`) 15:20'de uzak dala düşmüş, 16:01'deki `git fetch origin` bunu indirmiştir. Bu durumda yerel dal 163
commit, uzak dal 15 commit öndedir. Uzak commit'ler yalnız `public/data/daily.json` ile on beş `public/data/archive/<tarih>.json`
dosyasını değiştirmekte olup yerel dal bu dosyalara dokunmamıştır. Yinelenen `git merge-tree` ön denemesi 0 koduyla tek ağaç kimliği
vermiş, çakışma çıkmamıştır.

Sıra:

1. `git status` temiz olmalıdır (A bölümündeki karar arama aracı kararı uygulanmış).
2. `git fetch origin`
3. `git tag yayin-oncesi-uzak origin/main` (geri alma için uzak dalın son hâli işaretlenir).
4. `git merge-tree --write-tree --name-only main origin/main`: Çıktı tek satır ağaç kimliğiyse çakışma yoktur. Çakışan dosya adı
   basılırsa beklenen yer `public/data/daily.json`'dur; uzak dalın içeriği alınır (`git checkout --theirs public/data/daily.json`), zira bu
   dosyayı yalnız iş akışı yazar.
5. `git merge --no-ff origin/main -m "merge: yayin oncesi uzak gunluk ictihat commit'leri"`
6. Yayın günü üretilen dosyalar (OTONOM.md 8. adım): `npm run kalite` derlemesi `public/*sitemap*.xml`, `public/data/publishable.json` ve
   `public/data/site-search-index.json`'u yeniden üretir. Aylık çalışmada bunlar her commit'te geri alınmıştır; yayın günü kapıdan sonra
   bir kez commit'lenir.
7. `npm run kalite` yeşil olmalıdır (2026-10-19 06:58'de 1015 testte yeşildir, `logs/g25-tam-0644.log`).
8. Push: 30 Ekim ve sonrasında `git push origin main`. Kilit hook'u ve `--no-verify` devre dışı bırakılmaz.

## C. Vercel ortam değişkenleri

Değerler Vercel panelinde (Project → Settings → Environment Variables, Production) girilir, bu belgeye yazılmaz. Yerel `.env*` dosyaları
depoya girmez.

**Üretimde tanımlı olması gerekenler**

| Ad | Ne işe yarar | Yoksa |
|---|---|---|
| `UYELIK_SESSION_SECRET` | Üyelik oturum çerezinin imzası, en az 16 karakter (soru 5) | Üyelik tamamen kapanır |
| `UPSTASH_REDIS_REST_URL` | Üye kayıtlarının kalıcı deposu (soru 5) | Üyeler sunucu belleğinde tutulur, her soğuk başlangıçta silinir |
| `UPSTASH_REDIS_REST_TOKEN` | Aynı deponun erişim belirteci | Aynı |
| `UYELIK_ADMIN_SECRET` | Yönetim paneli girişi | Üretimde yönetim ucu 503 döner |
| `IYZICO_API_KEY` | Kart ödemesi (iyzico) | Kart ödemesi kapanır, IBAN varsa havaleye düşer |
| `IYZICO_SECRET_KEY` | Aynı anahtar çiftinin gizli yarısı | Aynı |

**İsteğe bağlı ayarlar**

| Ad | Ne işe yarar | Tanımlı değilse |
|---|---|---|
| `IYZICO_MODE` | iyzico ortamını açıkça seçer (`live` / `sandbox`) | Anahtarın `sandbox-` önekine, o da yoksa `NODE_ENV`'e göre seçilir |
| `UYELIK_KART` | Kart ödemesini bilinçli kapatma bayrağı | Anahtar varsa kart açıktır |
| `UYELIK_HAVALE` | Havale/EFT'yi kartla birlikte açma bayrağı | Kart açıkken havale gösterilmez |
| `UYELIK_IBAN` | Havale için IBAN | Havale yolu kapanır |
| `UYELIK_HESAP_ADI` | Havale hesabının adı | Profildeki ad kullanılır |
| `UYELIK_BANKA` | Havale bankasının adı | Boş gösterilir |
| `UYELIK_SITE_URL` | Ödeme dönüş adresleri için site kökü | `NEXT_PUBLIC_SITE_URL`, sonra Vercel adresi kullanılır |
| `NEXT_PUBLIC_SITE_URL` | Sitenin mutlak kökü (`lib/api.ts`, `lib/uyelik/config.ts`) | Vercel'in dağıtım adresi, o da yoksa sabit site kökü kullanılır |
| `YARGI_LIVE_FETCH` | `0` verilirse karar tam metni Yargıtay'dan canlı çekilmez | Canlı çekme açıktır. Vercel'de yerel arşiv okunmadığından (`lib/uyelik/karar-text.ts`) tam metin bu yoldan gelir, bu yüzden `0` verilmez |

**Vercel ya da Node'un kendisinin verdiği, elle girilmeyenler:** `VERCEL`, `VERCEL_URL`, `VERCEL_PROJECT_PRODUCTION_URL`, `NODE_ENV`, `CI`.

**Yalnız yerelde ya da betiklerde kullanılanlar, Vercel'e girilmez:** `OLCUM_DIST_DIR` ve `DERLEME_ISCI` (ölçüm ve derleme ayarı,
`next.config.ts`), `GEMINI_API_KEY`, `RAG_EMBED` ve `RAG_EMBED_MODEL` (ders notu RAG dizinini üreten `scripts/rag-ingest.mjs`; sitenin çalışma
anı bu modülü yüklemez).

## D. Yayın sırası ve doğrulama

1. Vercel 402 kapanmıştır (soru 1) ve Git bağlantısının `main`'e bağlı olduğu panelde görülmüştür.
2. C bölümündeki zorunlu altı değişken Production ortamında vardır.
3. B bölümü uygulanır, push yapılır, Vercel dağıtımının "Ready" olduğu beklenir.
4. Canlı sitede elle doğrulama:
   - `curl -I https://www.avfethiguzel.com/`: CSP, HSTS, COOP, `X-Frame-Options`, `Permissions-Policy` başlıkları (G03).
   - `curl -I https://www.avfethiguzel.com/medeni-hukuk`: 308, hedef `/mevzuat/tmk` (G25, soru 28).
   - `curl -s -o /dev/null -w "%{http_code}" https://www.avfethiguzel.com/api/yargi/index`: üyeliksiz 401 (G14).
   - `https://www.avfethiguzel.com/robots.txt` ve `/sitemap-index.xml` açılır; ders notu haritası 28 adrestir (G11).
   - Üyelik: kayıt, giriş ve çıkış denenir. Canlı ortamda ödeme denemesi yapılmaz, yalnız ödeme sayfasının açıldığı görülür.
5. TestSprite (G22 notu): `.testsprite/` altındaki beş canlı site planı (`home`, `search`, `mevzuatTbk1`, `mevzuatIndex`, `hesaplama`)
   `testsprite test run … --target-url https://www.avfethiguzel.com` ile koşulur. Planlar yalnız sayfanın açıldığını ve bağlantı görüldüğünü
   iddia eder.
6. Google Search Console'da site haritası yeniden gönderilir. Eski alan adreslerinin 308'i ve 6.552 kopya notun `noindex`'i dizinden düşmeyi
   birkaç hafta içinde gösterir.

## E. Mobil sürüm

Adımlar `mobile/docs/PLAY-STORE.md`'dedir. Özet:

1. Uygulama sürümü `1.3.0 (10)`'dur (`mobile/android/app/flavor.properties`, `scripts/build-flavor.mjs` üretir, elle düzenlenmez).
2. AAB bu makinede üretilmez; GitHub Actions `android-aab.yml` iş akışı push'tan sonra çalıştırılır, `aab-asistan` artefaktı indirilir.
3. Play Console: önce dahili test, sonra üretim. Veri güvenliği formu abonelik nedeniyle yeniden doldurulur (PLAY-STORE.md 2. bölüm).
4. G05 notu (soru 9): Uygulama erişimi talimatındaki inceleme kodu `mobile/inceleme-kodu.local.txt`'teki yeni kodla güncellenir. CI
   derlemesi bu kodu kullanıyorsa GitHub'da `INCELEME_KODU` gizli değişkeni eklenir.
5. İlk üretim yüklemesinden sonra App Links doğrulaması (PLAY-STORE.md 6. bölüm).

## F. Geri alma planı

- **Site:** Vercel panelinde önceki üretim dağıtımı yeniden üretime alınır (Instant Rollback). Bu kod değiştirmez, dakikalar içinde etki eder.
- **Kod:** Sorun belirli bir değişiklikteyse `git revert` ile geri alınır ve normal push yapılır. Birleştirmenin tamamı geri alınacaksa
  `git revert -m 1 <birleştirme commit'i>`. Uzak dalın yayın öncesi hâli `yayin-oncesi-uzak` etiketindedir. Uzak dala `--force` push yapılmaz,
  zira günlük içtihat iş akışının commit'leri kaybolur.
- **Mobil:** Play Console'da aşamalı dağıtım durdurulur. Yayınlanmış bir sürüm geri çekilemez; düzeltme daha yüksek `versionCode` ile çıkar.
- **Ortam değişkeni hatası:** Değer düzeltilir ve dağıtım yeniden başlatılır (Vercel değişkenleri yalnız yeni dağıtımda okunur).

## G. Yayından sonra

- `raporlar/final.md`'deki yayın sonrası işler: ortak istemci betiğinin küçültülmesi (Lighthouse ortalama P 79, hedef ≥ 90),
  `/mevzuat/ttk` ve `/mevzuat/tmk` madde listelerinin sayfalanması, geliştirme araçlarındaki `braces` zinciri için `tailwindcss` 4 geçişi.
- Hasat motoru yerelde çalışmaya devam eder (`raporlar/hasat-haftalik.md`); yayına giren karar kümesi G14 kararındadır (soru 19, 20).
