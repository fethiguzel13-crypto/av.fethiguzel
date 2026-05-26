# İçtihat Analiz Sayfaları — Tasarım Dokümanı

**Tarih:** 2026-05-26  
**Durum:** Onaylandı

## Özet

Her mahkeme kararı için Av. Fethi Güzel perspektifinden Claude Sonnet tarafından üretilen kişisel analiz sayfaları. Günlük GitHub Actions pipeline'ına entegre edilir, bilgisayar açık olmadan her sabah 09:00'da otomatik üretilir ve Vercel'e deploy edilir.

---

## Mimari

```
GitHub Actions — her sabah 09:00
       ↓
scrape-all.js → kararlar çekilir (mevcut)
       ↓
build-daily.js → publicSummary (Haiku) üretilir (mevcut)
       ↓
build-analysis.js (YENİ) → her highlight için Sonnet analizi üretilir
       ↓
public/data/analyses/[id].json → ayrı analiz dosyaları (YENİ)
       ↓
Vercel'e commit → site güncellenir
       ↓
app/icthat/[id]/page.tsx (YENİ) → analiz sayfası render edilir
```

---

## Dosya Yapısı

| Dosya | İşlem | Açıklama |
|---|---|---|
| `scripts/build-analysis.js` | Create | Sonnet analizi üretir, `public/data/analyses/` altına yazar |
| `scripts/lib/analysis-writer.js` | Create | Claude Sonnet API çağrısı, analiz formatı |
| `public/data/analyses/[id].json` | Generated | Her karar için analiz dosyası |
| `app/icthat/[id]/page.tsx` | Create | Analiz sayfası (Next.js dynamic route) |
| `lib/analysis.ts` | Create | Analiz dosyası okuma yardımcı fonksiyonu |
| `components/IcthatList.tsx` | Modify | Her karta "Analizi Oku →" linki ekle — yalnızca analiz dosyası mevcutsa gösterilir |
| `.github/workflows/daily-icthat.yml` | Modify | `build-analysis.js` adımı ekle |

---

## Analiz İçeriği

Claude Sonnet her karar için 4 bölümlü analiz üretir:

### Format
```
## Dava Özeti
Ne oldu? Kim, neden mahkemeye gitti? (2-3 cümle, sade dil)

## Mahkemenin Kararı
Ne karar verildi, hukuki gerekçe ne? (2-3 cümle)

## Benim Gözlemim
"Bu kararda dikkatimi çeken..." — Av. Fethi Güzel sesi.
Karar standart mı, istisnai mi? Neden önemli?

## Pratik Etki
Bu karar hangi durumlarda emsal oluşturur?
Benzer durumda olan biri için ne anlam taşır?
```

### Parametreler
- **Model:** `claude-sonnet-4-6`
- **Uzunluk:** 400-600 kelime
- **Dil:** Türkçe, jargonsuz — hukuk meraklısına hitap eder
- **Ton:** Deneyimli avukatın kişisel yorumu, bilgili ama sade
- **Giriş:** Her bölüm için Anthropic SDK prompt cache kullanılır (maliyet optimizasyonu)

---

## Analiz JSON Yapısı

`public/data/analyses/[id].json`:

```json
{
  "id": "aym-2024-28913",
  "generatedAt": "2026-05-26T06:12:00.000Z",
  "sections": {
    "davaSozeti": "...",
    "mahkemeninKarari": "...",
    "benimGozlemim": "...",
    "pratikEtki": "..."
  },
  "highlight": {
    "source": "AYM",
    "kunye": "AYM, B. No: 2024/28913, ...",
    "konu": "...",
    "date": "2026-05-06",
    "url": "https://..."
  }
}
```

---

## Analiz Sayfası — `/icthat/[id]`

```
┌─────────────────────────────────────┐
│  Navbar                             │
├─────────────────────────────────────┤
│  ← Tüm Kararlar                     │
│                                     │
│  [AYM]  •  06 Mayıs 2026           │
│  AYM, B. No: 2024/28913            │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                     │
│  Dava Özeti                         │
│  [metin]                            │
│                                     │
│  Mahkemenin Kararı                  │
│  [metin]                            │
│                                     │
│  Benim Gözlemim                     │
│  [metin]                            │
│                                     │
│  Pratik Etki                        │
│  [metin]                            │
│                                     │
│  [Resmi Karar Metnine Git →]        │
│                                     │
│  ← Tüm Kararlar                     │
├─────────────────────────────────────┤
│  Footer                             │
└─────────────────────────────────────┘
```

### SEO
- `title`: `[Mahkeme] [KararNo] Analizi | Av. Fethi Güzel`
- `description`: Analizin ilk 155 karakteri
- `og:image`: Mevcut site OG görseli

---

## GitHub Actions Entegrasyonu

`.github/workflows/daily-icthat.yml`'a yeni adım eklenir (build-daily'den sonra):

```yaml
- name: Build analyses
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  run: node scripts/build-analysis.js public/data/daily.json public/data/analyses/
```

---

## Maliyet Tahmini

- Günlük 4 karar × ~800 token/analiz = ~3200 token/gün
- Sonnet 4.6 fiyatı: ~$0.003/analiz
- Aylık: ~$0.36

---

## Kapsam Dışı

- Eski kararların geriye dönük analizi
- Analiz düzenleme/güncelleme arayüzü
- Yorum/tartışma sistemi
- Analiz arşivi sayfası
