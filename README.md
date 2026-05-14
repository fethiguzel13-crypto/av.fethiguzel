This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Günlük İçtihat Otomasyonu

Site, her sabah otomatik olarak güncel hukuki gelişmeleri (Yargıtay, AYM, AİHM, Resmî Gazete) yayınlar.

**Pipeline:** `.github/workflows/daily-icthat.yml` her gün 06:00 UTC (09:00 TR) tetiklenir:

1. `scraper/scrape-all.js` → ham JSON (Yargıtay, AYM, AİHM, Resmî Gazete)
2. `scripts/build-daily.js` → normalize + Claude Haiku ile vatandaş özetleri → `public/data/daily.json`
3. Değişiklik varsa commit + push → Vercel rebuild

**Görünür çıktı:**
- Ana sayfada "Güncel Hukuki Gelişmeler" bölümü (4 öne çıkan kart) — `components/DailyNews.tsx`
- `/icthat` sayfası — filtrelenebilir tam künyeli liste

**Secret gereksinimi:** Repo Settings → Secrets → `ANTHROPIC_API_KEY` (Claude Haiku ile vatandaş özeti üretimi için).

### Lokal geliştirme

```bash
npm install
cd scraper && npm install && npx playwright install chromium && cd ..
node scraper/scrape-all.js > /tmp/raw.json
node scripts/build-daily.js /tmp/raw.json public/data/
npm run dev
```

### Script testleri

```bash
npm run test:scripts
```

### Spec ve Plan

- [Spec](docs/superpowers/specs/2026-05-14-gunluk-icthat-web-design.md)
- [Implementation Plan](docs/superpowers/plans/2026-05-14-gunluk-icthat-web.md)

## Twitter/X Otomasyonu

Günlük içtihat verisinin 4 öne çıkan öğesi otomatik olarak Twitter/X'e paylaşılır.

**Pipeline:**
1. Sabah daily workflow `scripts/generate-tweets.js`'i çağırır → `public/data/twitter-queue.json` üretir (4 tweet, scheduledFor: 06/10/14/17 UTC)
2. `.github/workflows/tweet-poster.yml` her 30 dakikada çalışır
3. `scripts/post-due-tweets.js` queue'yu okur, vakti gelen tweetleri Twitter API ile post eder (OAuth 1.0a)
4. Slotlar (TR): 09:00, 13:00, 17:00, 20:00

**Secret gereksinimi:**
- `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_TOKEN_SECRET` (X Developer Portal — Read+Write app permissions)
- `SITE_DOMAIN` (opsiyonel, varsayılan `avfethiguzel.com`)

**Spec ve Plan:**
- [Spec](docs/superpowers/specs/2026-05-14-twitter-otomasyon-design.md)
- [Implementation Plan](docs/superpowers/plans/2026-05-14-twitter-otomasyon.md)
