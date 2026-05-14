# Tasarım: Günlük İçtihat Twitter/X Otomasyonu

**Tarih:** 2026-05-14
**Kapsam:** `fethiguzel-portal` repo'sundaki günlük içtihat verisinden 4 tweet üretip günlük zamanlı olarak Twitter/X'e otomatik paylaşım.

## Amaç

İlk alt-proje (web yayını) tamamlandı. Bu, sosyal medya genişlemesinin **ikinci alt-projesi**: günde 4 öne çıkan içtihat/mevzuat gelişmesini Twitter/X üzerinden ulaşılabilir kılmak. Hedef:
- Avukatın profilinin görünürlüğünü artırmak
- Web sitesine trafik çekmek (her tweet `/icthat` linki içerir)
- Vatandaşın hukuki gelişmeleri kolayca takip etmesini sağlamak

## Kapsam Dışı

- Instagram (sonraki alt-proje)
- WhatsApp durum (resmi API yok, terk edildi)
- YouTube video (ayrı alt-proje)
- Retweet, beğeni, takip etme otomasyonu
- Diğer kullanıcılarla etkileşim, cevap verme
- Görsel (resim/kart) üretimi — sade metin + link yeterli

## Mevcut Durum

- Web alt-projesi tamam, `public/data/daily.json` her sabah otomatik üretiliyor (içinde `highlights[]` 4 öne çıkan öğe)
- Kullanıcının X developer hesabı zaten var (onay süreci atlanır)
- Repo: `github.com/fethiguzel13-crypto/av.fethiguzel`
- Çalışma dizini: `C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal`
- Mevcut workflow: `.github/workflows/daily-icthat.yml` her sabah 06:00 UTC scrape eder + daily.json üretir

## Mimari

### Üst-seviye veri akışı

```
Sabah 06:00 UTC (mevcut workflow uzatılır):
  ├─ scrape-all.js → ham JSON
  ├─ build-daily.js → public/data/daily.json (mevcut)
  └─ generate-tweets.js (YENİ) → public/data/twitter-queue.json
      ├─ daily.json'daki 4 highlight'tan 4 tweet üretir
      └─ scheduledFor: 06:00, 10:00, 14:00, 17:00 UTC (09/13/17/20 TR)

Her 30 dakikada bir (YENİ workflow tweet-poster.yml):
  ├─ public/data/twitter-queue.json'u okur
  ├─ Vakti gelmiş + posted=false tweetleri bulur
  ├─ Twitter API ile POST /2/tweets
  ├─ Sonucu queue'ya yazar (posted=true, tweetId, postedAt)
  └─ Queue'yu commit'ler (değişiklik varsa)
```

İki workflow bağımsız:
- **Generator**: Günde 1 kez (sabah). Her yeni gün için yeni queue üretir.
- **Poster**: Her 30 dakikada. Vakti gelen tweetleri post eder.

### Veri akışında bağımsızlık ilkesi

- `generate-tweets.js` Twitter API'yi bilmez — sadece queue JSON üretir
- `post-due-tweets.js` highlight'ları bilmez — sadece queue JSON tüketir + Twitter API'ye yazar
- Queue şeması, iki betik arasındaki tek sözleşme

## Queue Şeması

`public/data/twitter-queue.json` (canonical):

```json
{
  "generatedAt": "2026-05-15T06:00:00Z",
  "dateLabel": "15 Mayıs 2026",
  "tweets": [
    {
      "id": "2026-05-15-1",
      "highlightId": "aym-2022-41459",
      "text": "AYM: Cezaevindeki disiplin cezasına itirazda adil savunma hakkı engellendi.\n\nKünye ve detay: avfethiguzel.com/icthat\n\n#hukuk #içtihat #AYM",
      "scheduledFor": "2026-05-15T06:00:00Z",
      "posted": false,
      "postedAt": null,
      "tweetId": null,
      "error": null
    }
  ]
}
```

**Zorunlu alanlar:** `id`, `highlightId`, `text`, `scheduledFor`, `posted`.
**Optional/runtime fields:** `postedAt`, `tweetId`, `error`.

**`id` format:** `YYYY-MM-DD-N` (N = 1..4, sıralama)
**`scheduledFor`:** ISO 8601 UTC, sabit slotlar 06:00 / 10:00 / 14:00 / 17:00 UTC
**`text`:** Twitter 280 karakter sınırını aşmaz (ekstra `…` ile kesilmiş)

## Tweet Metin Üretimi (`scripts/generate-tweets.js`)

Her highlight için:

1. Prefix belirle:
   - source=`AYM` → `AYM:`
   - source=`Yargıtay` → eğer category=YİBK ise `YİBK:`, yoksa `Yargıtay:`
   - source=`AİHM` → `AİHM:`
   - source=`RG` → `Resmî Gazete:`

2. Gövde: `publicSummary` (mevcut Haiku özet, max 30 kelime)
   - Eğer publicSummary boş → `konu`'nun ilk 150 karakteri
   - Eğer ikisi de boş → `title || kunye || caseName` (highlight olduğu için en az biri olmalı)

3. Site linki: `avfethiguzel.com/icthat`
   - Not: Vercel domain'i tam olarak `avfethiguzel.com`'sa onu kullan; değilse `<vercel-domain>/icthat`

4. Hashtag seti (kaynağa göre):

| Kaynak | Hashtagler |
|---|---|
| AYM | `#hukuk #içtihat #AYM` |
| Yargıtay | `#hukuk #içtihat #yargıtay` |
| Yargıtay (YİBK) | `#hukuk #YİBK #içtihat` |
| AİHM | `#hukuk #içtihat #AİHM` |
| RG | `#hukuk #mevzuat #resmigazete` |

5. Birleştirme:
   ```
   {prefix} {body}
   
   Künye ve detay: avfethiguzel.com/icthat
   
   {hashtags}
   ```

6. 280 karakter sınırı:
   - Hashtagler + link + iki blank satır = ~80 karakter sabit
   - Prefix ~12 karakter
   - body için kalan ~188 karakter
   - Eğer body uzunsa son tam kelime sınırında kesilip `…` eklenir

`scripts/generate-tweets.js` mevcut workflow'a eklenir:
```yaml
- name: Generate tweets
  run: node scripts/generate-tweets.js public/data/daily.json public/data/twitter-queue.json
```

## Posting Workflow

`.github/workflows/tweet-poster.yml`:

```yaml
name: Tweet Poster

on:
  schedule:
    - cron: '*/30 * * * *'   # her 30 dakika
  workflow_dispatch:

jobs:
  post:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with: { node-version: '20' }
      - run: npm ci
      - name: Post due tweets
        env:
          TWITTER_API_KEY: ${{ secrets.TWITTER_API_KEY }}
          TWITTER_API_SECRET: ${{ secrets.TWITTER_API_SECRET }}
          TWITTER_ACCESS_TOKEN: ${{ secrets.TWITTER_ACCESS_TOKEN }}
          TWITTER_ACCESS_TOKEN_SECRET: ${{ secrets.TWITTER_ACCESS_TOKEN_SECRET }}
        run: node scripts/post-due-tweets.js public/data/twitter-queue.json
      - name: Commit queue if changed
        run: |
          git config user.name "icthat-bot"
          git config user.email "bot@fethiguzel.com"
          git add public/data/twitter-queue.json
          git diff --staged --quiet || (git commit -m "chore: tweets posted $(date -u +%Y-%m-%dT%H:%M)" && git push)
```

### `post-due-tweets.js` mantığı

1. queue.json oku — yoksa exit 0 (henüz queue yok)
2. `now = new Date()`
3. `due = tweets.filter(t => !t.posted && !t.error && new Date(t.scheduledFor) <= now)`
4. Her `due` için sıralı (paralel değil):
   - OAuth 1.0a imzalı POST `https://api.x.com/2/tweets`
   - body: `{ "text": tweet.text }`
   - Başarılı (201): `tweet.posted=true, postedAt=now, tweetId=response.data.id`
   - 401: tüm geri kalan tweet'leri durdur (auth bozuk), `tweet.error="auth"`
   - 403 duplicate: `tweet.posted=true, error="duplicate"`
   - 429 rate limit: bu run'ı bırak, exit 0 (sonraki cron tekrar dener)
   - Diğer: `tweet.error="HTTP {status}"`, retry için `posted=false` kalır
5. queue'yu yaz

**Twitter API auth detayı**: OAuth 1.0a user context (PIN-based veya OAuth flow ile alınmış access token). `oauth-1.0a` npm paketi + `crypto` ile imzalama. (Bearer token v2 tweet POST için yeterli değil — user context lazım.)

### Cron 30dk neden değil 1 saat?

Slotlar tam saatlerde (06/10/14/17 UTC). 30dk cron en geç 30 dakika gecikmeyle post atar. 1 saat cron 1 saate kadar gecikebilir. 30dk daha hassas, free tier'da problemsiz.

## Hata Yönetimi

| Senaryo | Davranış | Görünür mü? |
|---|---|---|
| Twitter API 401 (auth bozuk) | Kalan tweet'leri durdur, commit error | Commit mesajında bot raporu |
| Twitter API 429 (rate limit) | Bu run'ı atla, sonraki cron dener | Hayır (sessiz retry) |
| Twitter API 403 duplicate | posted=true işaretle, bir daha denemesin | Hayır |
| Twitter API 5xx | error kaydet, posted=false kalır → otomatik retry | Hayır |
| Network hatası | Aynı: retry | Hayır |
| daily.json boş veya yok | Queue oluşturulmaz, posting workflow no-op | Hayır |
| Highlight count < 4 | Sadece olan kadar tweet üretilir (örn 2 highlight → 2 tweet) | Hayır |
| Queue JSON parse hatası | Workflow fail, kullanıcı manuel müdahale | Actions log'da hata |

## Test Stratejisi

**generate-tweets.js için (Node test runner):**
- Fixture daily.json verilince doğru sayıda tweet üretir
- Her source için doğru hashtag set
- 280 karakter sınırı uygulanır (kesinti + `…`)
- scheduledFor slotları doğru hesaplanır (TR saatleri UTC'ye)
- 0 highlight → boş tweets array

**post-due-tweets.js için (Node test runner):**
- Mock Twitter client ile vakti gelmiş tweet filtrelemesi doğru
- Duplicate hata posted=true işaretler
- Rate limit hatası işlemi durdurur
- Network hatası posted=false bırakır

**End-to-end (manuel):**
- workflow_dispatch ile generate-tweets çalıştır → queue.json'u incele
- workflow_dispatch ile poster'ı bir test tweet için tetikle (manuel kontrol)
- İlk gerçek tweet atıldıktan sonra profil üzerinden doğrula

## Açık Sorular

- **Vercel domain'i tam olarak nedir?** Site `avfethiguzel.com` mu yoksa `*.vercel.app` mı? Tweet'lerdeki link bu domain'i kullanmalı. **Karar:** Implementation aşamasında kullanıcıdan teyit al; ya da `package.json` veya Vercel config'inden okumayı dene; bulunamazsa `process.env.SITE_URL` ile parametrize et.

## Risk Değerlendirmesi

| Risk | Olasılık | Etki | Azaltma |
|---|---|---|---|
| X API auth bozuk (key expire, secret yanlış) | Düşük | Yüksek (hiç tweet) | Manuel test + GitHub Actions secret kontrol |
| Twitter free tier limit aşımı (1500/ay) | Çok düşük | Yüksek (paywall) | Günde max 4 = 120/ay, %8 |
| Duplicate content cezası (aynı içtihat tekrar tweet) | Düşük | Orta | duplicate hatası graceful, posted=true işaretleniyor |
| Tweet metni 280 karakteri aşar | Düşük | Düşük | generate aşamasında zorla kesilir |
| Site link 404 (Vercel deploy gecikir) | Düşük | Düşük (kullanıcı deneyimi) | Generate-tweets daily.json çıktığında link mevcut olur, deploy ~1dk |
| Bot davranışı X tarafından spam algılanır | Düşük | Yüksek (askıya alma) | Günde 4 sabit zamanlı tweet, organik patern |
