# Ders notu üretim hattı (FSEK-graf)

Plan: `PLAN-FSEK-GRAF.md`. Mimari **B**: kanonik graf + fakülte örtüsü.

## Kapılar

```bash
npm run test:ders-notlari
npm run test:quality
```

- `lib/ders-notlari/fsek-gate.mjs` — slayt/not kopyası, spinning örtüşmesi, uydurma künye. Kanun/içtihat (FSEK m. 31) n-gramdan düşülür.
- `scripts/lib/source-broker.mjs` — allowlist + robots.txt + kimlikli UA. Stealth / proxy / webdriver maskesi **yok**.

## Dizinler

| Yol | İçerik |
|-----|--------|
| `lib/ders-notlari/graphs/` | Ders grafı (PR 2+) |
| `lib/ders-notlari/overlays/` | Fakülte örtüsü (PR 3+) |
| `docs/ders-notlari/coverage/` | Denetçi manifesti |
| `docs/ders-notlari/research/` | Kamuya açık izlence başlıkları |

## Altın örnek (AÜHF × borçlar genel)

```bash
node scripts/compose-note-from-graph.mjs ankara borclar-genel
node scripts/audit-course-coverage.mjs borclar-genel ankara
```

Güz ~9k, Bahar ~13k, yıllık ~21k kelime. `qualityTier: curated`. Kapı + FSEK geçti.

## Dalga (84 örtü × 26 graf)

```bash
node scripts/lib/write-remaining-overlays.mjs
node scripts/lib/write-course-graphs.mjs
node scripts/compose-note-from-graph.mjs --wave --only-missing --no-index
node scripts/audit-course-coverage.mjs borclar-genel ankara
node scripts/build-publishable-manifest.mjs
npm run test:ders-notlari
```

Örtüsü olan fakülte × grafı olan ders üçlüsü üretilir (2026-08-27: **84 örtü × 26 graf**; yeni: idare, inşaat, SPK). Kelime tabanı güz/bahar 8k, yıllık 18k; kısa kanun lafzında komşu madde penceresi n+1…n+8 (mülga atlanır). `generate-ders-notlari.mjs --wave=all` hâlâ varsayılan yol değil. Pack’i olmayan ders (anayasa, idare, İYUK, MÖHUK, roma, hukuk tarihi/felsefe) üretilmez.

## RAG (yazar ajan, PR 7)

Öğrenci sohbeti **yok**. Depo yerel sqlite; Vercel’e gitmez.

```bash
npm run rag:ingest          # graflar + örtü + grafa bağlı maddeler + atıflı yargı
npm run rag:query -- --madde=tbk/1
npm run rag:query -- --q="icap kabul" --course=borclar-genel
```

Retriever önce `kanun_id/madde_no` ve `atif.json` künyesini okur, sonra gömme. Künye depoda yoksa «içtihat yok» yazar; E./K./T. uydurulmaz. Composer yapısal seçiciyi kullanır (`citeLine`).

`RAG_EMBED=gemini` + `GEMINI_API_KEY` üretim makinesinde 768-d `text-embedding-004`; varsayılan çevrimdışı hash.

## Ölçek kilidi

84 fakülteye kalıp çoğaltma yok. Yeni fakülte: önce `docs/ders-notlari/research/{slug}.md` + `overlays/{slug}.json`, sonra composer.
