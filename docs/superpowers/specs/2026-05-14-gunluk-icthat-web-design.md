# Tasarım: Next.js Sitesinde Günlük İçtihat & Mevzuat Bölümü

**Tarih:** 2026-05-14
**Kapsam:** `fethiguzel-portal` Next.js sitesinde, `gunluk-icthat-takip` skill'inin günlük çıktısını otomatik olarak yayımlayan iki yeni bölüm (ana sayfa öne çıkanlar + `/icthat` alt sayfa).

## Amaç

Avukatın günlük takip ettiği hukuki gelişmeleri (Resmî Gazete, Yargıtay, AYM, AİHM kararları, mevzuat değişiklikleri) her sabah otomatik olarak siteye yayınlamak. İki hedef kitle:
1. **Müvekkil / vatandaş** — ana sayfada sade dilde 4 öne çıkan başlık
2. **Meslektaş / akademisyen** — `/icthat` alt sayfasında tam künyeli, filtrelenebilir liste

Bu spec daha büyük bir vizyonun (sosyal medya + YouTube otomasyonu) **ilk alt-projesidir**. Sonraki adımlar (Twitter, Instagram) ayrı spec olarak ele alınacak.

## Kapsam Dışı

- Twitter/X paylaşımı (ayrı proje)
- Instagram paylaşımı (ayrı proje)
- WhatsApp durum (teknik olarak mümkün değil — resmî API yok)
- YouTube video üretimi (ayrı proje)
- Site içi arama
- E-posta bülten
- Lexpera/Jurix kaynakları

## Mevcut Durum

- **Site**: `C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal` — Next.js 16, React 19, TypeScript, Tailwind CSS, App Router.
- **Repo**: `github.com/fethiguzel13-crypto/av.fethiguzel`, Vercel'e bağlı, main branch otomatik deploy.
- **Skill**: `~/.claude/skills/gunluk-icthat-takip/scraper/` — Node.js + Playwright scraper'lar, JSON üretir. Kaynaklar: Yargıtay, AYM, HUDOC, Resmî Gazete, Mevzuat.
- **Mevcut design language**: cream (#F2F0E9) zemin, charcoal (#1A1A1A) metin, accent (#CC5833) terracotta vurgu, primary (#2E4036) koyu yeşil. Fontlar: Plus Jakarta Sans (sans), Outfit (heading), Cormorant Garamond (drama italic), IBM Plex Mono (mono). Kart pattern: `bg-white border border-charcoal/5 rounded-[2.5rem]`. Animasyon: GSAP ScrollTrigger.

## Mimari

### Üst-seviye veri akışı

```
GitHub Action (her sabah 06:00 UTC = 09:00 TR)
  → scraper/scrape-all.js (ham JSON)
  → scripts/build-daily.js (normalize + Haiku özet)
  → public/data/daily.json (statik asset olarak da erişilebilir)
  → public/data/archive/YYYY-MM-DD.json
  → Değişiklik varsa commit + push
    → Vercel rebuild + deploy
      → Next.js build, public/data/daily.json fs ile okunur
      → DailyNews component (ana sayfa) + /icthat page render edilir
```

### Bileşenler

| Bileşen | Konum | Sorumluluğu | Tür |
|---|---|---|---|
| `scraper/` | repo root | Skill'den kopyalanan scraper'lar | Node.js scripts |
| `scripts/build-daily.js` | repo root | Ham scraper çıktısını site şemasına normalize, Haiku ile özet | Node.js ESM script |
| `scripts/lib/normalize.js` | repo root | Kaynak başına normalize fonksiyonları | Node.js ESM |
| `scripts/lib/highlights.js` | repo root | 4'lük highlight seçim | Node.js ESM |
| `scripts/lib/summarize.js` | repo root | Anthropic Haiku integration | Node.js ESM |
| `scripts/lib/__tests__/*.test.js` | repo root | Node.js native test runner | Tests |
| `scripts/fixtures/raw-sample.json` | repo root | Fixture | Test data |
| `public/data/daily.json` | repo (auto-commit) | Bugünkü site verisi | Static asset |
| `public/data/archive/*.json` | repo (auto-commit) | Geçmiş 30 gün | Static asset |
| `lib/daily.ts` | repo (yeni) | TypeScript types + fs reader | Next.js lib |
| `components/DailyNews.tsx` | repo (yeni) | Ana sayfa highlight grid | React server component (animasyon için child client) |
| `app/icthat/page.tsx` | repo (yeni) | Alt sayfa, server-side render | Next.js page |
| `components/IcthatFilters.tsx` | repo (yeni) | Filtre UI (kaynak değiştirme) | Client component |
| `.github/workflows/daily-icthat.yml` | repo (yeni) | Cron + manuel tetikleme | CI/CD |
| `components/Navbar.tsx` | repo (değişiklik) | "Güncel" menü öğesi eklenir | Existing modify |
| `app/page.tsx` | repo (değişiklik) | DailyNews bileşeni eklenir | Existing modify |

### Veri akışında bağımsızlık ilkesi

- **Scraper Next.js'i bilmez** — sadece JSON üretir. Skill'le aynı çıktı şeması.
- **build-daily.js scraper'ı bilmez** — sadece ham JSON tüketir.
- **Next.js sayfaları build-daily'i bilmez** — sadece `public/data/daily.json` şemasını okur (`lib/daily.ts` üzerinden type-safe).
- **Bu sınırlar arası geçişler version-stable şemalarla yapılır.**

### Next.js veri okuma stratejisi

`public/data/daily.json` hem statik asset olarak doğrudan fetch edilebilir hem `process.cwd()/public/data/daily.json` ile build-time fs okunabilir. Tercih: **build-time fs okuma**:

- DailyNews ve `/icthat` page **server components** olarak çalışır
- `lib/daily.ts` `loadDaily()` fonksiyonu `fs.readFileSync` ile JSON'u okur
- Next.js build sırasında bu çağrılar statik HTML'e dönüşür (varsayılan SSG)
- Her veri commit'i Vercel rebuild tetikler — her gün otomatik

Bu yaklaşımın faydası: hızlı sayfa yükleme, SEO için tam HTML, JS bağımsız çalışır.

İnteraktif kısımlar (icthat filtreleri, künye kopyala) **client component** olarak izole edilir.

## JSON Şeması

`public/data/daily.json` (canonical):

```json
{
  "generatedAt": "2026-05-14T06:00:00Z",
  "dateLabel": "14 Mayıs 2026",
  "highlights": [
    {
      "id": "rg-20260513-2",
      "source": "RG",
      "sourceLabel": "Resmî Gazete",
      "category": "Yönetmelik",
      "icon": "scroll-text",
      "title": "Konkordato Talebi Yönetmeliğinde Değişiklik",
      "publicSummary": "İflas erteleme süreci için yeni belge zorunlulukları getirildi.",
      "date": "2026-05-13",
      "url": "https://www.resmigazete.gov.tr/eskiler/2026/05/20260513-2.htm"
    }
  ],
  "items": {
    "resmigazete": [ /* normalized items */ ],
    "yargitay": [ /* with kunye, daire, esas, karar */ ],
    "aym": [ /* with kunye, basvuruNo */ ],
    "hudoc": [ /* with caseName, appNo, importance */ ],
    "mevzuat": []
  },
  "stats": {
    "totalItems": 23,
    "perSource": { "resmigazete": 4, "yargitay": 12, "aym": 3, "hudoc": 2, "mevzuat": 2 }
  },
  "errors": []
}
```

**`icon` alanı**: Lucide React ikon adına karşılık gelir (`scroll-text`, `scale`, `landmark`, `flag`, `book`).

**Zorunlu alanlar (her item):** `id`, `source`, `title` veya `kunye`, `date`, `url`, `publicSummary`.

## Ana Sayfa Bölümü (`components/DailyNews.tsx`)

Mevcut `Articles` component'inin pattern'ini takip eder.

**Section yapısı:**
- Eyebrow: "GÜNCEL" (text-accent, font-heading, tracking-widest, uppercase)
- Başlık: "Hukuki <span class='font-drama italic text-accent'>Gelişmeler.</span>" (text-4xl md:text-5xl, font-bold)
- Sağ üstte CTA: "TÜM İÇTİHATLARI GÖR →" (Link → /icthat, accent border-bottom)
- 4 kart grid: `grid grid-cols-1 md:grid-cols-2 gap-6` (Articles 3 sütun, biz 2 sütun çünkü 4 kart)
- Kart: `bg-white border border-charcoal/5 rounded-[2.5rem] p-10 hover:shadow-2xl`
- Kart içinde: ikon balon (accent/5 bg) + source meta + başlık (font-heading bold) + publicSummary (charcoal/60) + tarih + "Detay" linki

**Sıfır içerik durumu:** `highlights.length === 0` ise section render edilmez (`return null`).

**Animasyon:** Articles ile aynı pattern — GSAP ScrollTrigger ile alt kısımdan kayarak gelen kartlar. Bu bölüm için ayrı bir child client component (`DailyNewsCards`) yaratılır, animasyonu o yönetir; çevre layout server-side kalır.

## Alt Sayfa (`app/icthat/page.tsx`)

Server component. Mevcut `makaleler/page.tsx` pattern'ini takip eder.

**Layout:**
- Navbar + Footer (mevcut bileşenler)
- Header: eyebrow + drama italic başlık ("Güncel İçtihat & Mevzuat")
- Tarih damgası: `dateLabel`
- `IcthatFilters` client component (kaynak butonları)
- Kaynak başına `<section>`, her item için kart:
  - Künye (kopyalanabilir, `<code>` blok + copy button)
  - Konu/title
  - Kategori chip
  - Tarih + "Kaynak →" link

**Filtreleme:** `IcthatFilters` client component, URL hash state ile (`#yargitay`). Server'dan gelen tam veri seti üzerinde client-side filter. Filtre kaynak başına: Tümü, Yargıtay, AYM, AİHM, Resmî Gazete, Mevzuat.

**Sıfır içerik durumu:** Hiç item yoksa "Bugün için yeni gelişme yok" mesajı.

## Highlight Seçim Mantığı (`scripts/lib/highlights.js`)

Öncelik sırası:
1. YİBK kararı (Yargıtay items'da daire/kategori/künye "YİBK" geçen)
2. AYM pilot kararları veya ihlal kararları (tür/konu "ihlal" geçen)
3. HUDOC importance=1 (Key case) Türkiye kararları
4. Resmî Gazete'de izleme alanı eşleşmesi (TBK/TMK/TTK/İş K. keyword match)
5. Yargıtay HGK kararları
6. (Yetmezse) Diğer Yargıtay daire kararları

İlk 4 seçilir. Daha az varsa olduğu kadar.

## Claude Haiku ile Vatandaş Özeti

Her item için `publicSummary` üretilir. Prompt aşağıdaki gibidir:

```
Sen bir hukuk iletişim uzmanısın. Sıradan bir vatandaşın anlayabileceği,
jargon içermeyen, 1-2 cümlelik (max 30 kelime) açıklama yaz.

Başlık: {title veya kunye}
Hukuki konu: {konu}

Vatandaş için açıkla:
```

- Model: `claude-haiku-4-5-20251001`
- Max output tokens: 80
- Concurrency: 5
- API key: `ANTHROPIC_API_KEY` repo secret
- Tahmini günlük maliyet: <0.01 USD

## GitHub Actions

`.github/workflows/daily-icthat.yml`:

```yaml
name: Günlük İçtihat
on:
  schedule:
    - cron: '0 6 * * *'   # 06:00 UTC = 09:00 TR
  workflow_dispatch:
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: cd scraper && npm ci && npx playwright install --with-deps chromium
      - run: node scraper/scrape-all.js > /tmp/raw.json
      - env: { ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }} }
        run: node scripts/build-daily.js /tmp/raw.json public/data/
      - run: |
          git config user.name "icthat-bot"
          git config user.email "bot@fethiguzel.com"
          git add public/data/
          git diff --staged --quiet || (git commit -m "chore: günlük içtihat $(date -u +%Y-%m-%d)" && git push)
```

## Hata Yönetimi

| Senaryo | Davranış | Görünür mü? |
|---|---|---|
| Bir kaynak başarısız | `errors[]`a not, diğer kaynaklarla devam | Hayır |
| Tüm scraperlar başarısız | JSON yazılmaz, commit yapılmaz | Dünki veri devam |
| Haiku API hatası | `publicSummary` boş, fallback `konu` | Hayır |
| Item yok | section'lar gizlenir veya "yeni gelişme yok" | "Yeni yok" mesajı |
| Action timeout | Cancel, ertesi gün | Dünki veri |
| Vercel build hata | Önceki build ayakta | Hayır |

## Test Stratejisi

**build-daily.js + lib/ için (Node.js native test runner):**
- Normalize fonksiyonları her kaynak için fixture testleri
- Highlight seçim mantığı için case bazlı testler
- Summarize prompt builder + skip mantığı testleri

**Next.js için (manuel):**
- Lokal `npm run dev` ile DailyNews ve `/icthat` görsel kontrolü
- Mobile responsive (DevTools)
- Filtre interaktion
- Künye kopyala

**End-to-end (manuel):**
- `workflow_dispatch` ile elle tetikle → commit oldu mu → Vercel deploy → site güncel

## Açık Sorular

- Arşiv tutma süresi: **30 gün** (sonra otomatik silme — ayrı issue).

## Risk Değerlendirmesi

| Risk | Olasılık | Etki | Azaltma |
|---|---|---|---|
| Scraper kaynak sitesi DOM değişikliği | Yüksek (zamanla) | Orta | `errors[]` ile sessiz fallback |
| Anthropic API key sızıntısı | Düşük | Düşük | Repo secret |
| GitHub Actions quota | Çok düşük | Düşük | Hobby quota 2000 dk/ay |
| Highlight seçim hatası | Düşük | Düşük | `workflow_dispatch` ile manuel kontrol |
| Vercel build fail (yeni component) | Düşük | Orta | Lokal `npm run build` test |
