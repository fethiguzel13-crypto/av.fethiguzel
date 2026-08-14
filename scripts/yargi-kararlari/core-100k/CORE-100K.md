# Çekirdek Emsal Kütüphanesi — 100.000 Karar

**Amaç:** Avukat ve hukuki AI için tekrarsız, yüksek emsal değerli çekirdek arşiv.  
**Kaynaklar:** Yargıtay (YİM/resmi arama, HGK/CGK/YİBK, hukuk–ceza–icra daireleri) + Danıştay (İDDK, VDDK, daireler).  
**İlke:** Maksimum hukuki çeşitlilik + yüksek emsal + düşük tekrarlilik.

---

## 1. Üç katmanlı boru hattı

| Katman | Ne yapar | Araç |
|--------|----------|------|
| **A — Hasat** | Öncelikli birimlerden geniş aday havuzu indirir (günde ~3k tam metin) | `config-core-100k.json` + mevcut `until-done` |
| **B — Skor** | Kaynak önceliği, kalite sinyalleri, formül ceza, alan/era | `score.mjs` |
| **C — Seçim** | Kota doldurma + n-gram uniqueness (sim>0.85 ele) + isteğe bağlı embedding | `select-core.mjs` |

Hedef **100.000 seçilmiş** karar; hasat havuzu bunun 2–4 katı olmalıdır (öneri: **250k–350k aday**).

---

## 2. Kota planı (toplam 100.000)

Ayrıntı: `quota-plan.json`. Özet:

| Blok | Kota | Not |
|------|------|-----|
| YİBK (Büyük Genel Kurulu / İB) | 1.200 | Neredeyse tamamı; eksikse en uzun/ilkesel |
| HGK | 12.000 | Direnme + ilke; formül onama düşük öncelik |
| CGK | 8.000 | Ceza emsal omurgası |
| Diğer kurullar (HDBK vb.) | 1.800 | |
| Hukuk daireleri (ilke örnekleme) | 32.000 | Daire başına tavan + alan kotası |
| Ceza daireleri | 16.000 | Genel + özel hüküm dengesi |
| İcra–İflas daireleri | 6.000 | |
| Danıştay İDDK | 4.000 | |
| Danıştay VDDK | 4.000 | |
| Danıştay diğer daire/kurul | 15.000 | |
| **Toplam** | **100.000** | |

### Era (yıl) zorunluluğu (tüm bloklar birlikte)

| Dönem | Pay |
|-------|-----|
| ≤2009 (yerleşik) | %18 |
| 2010–2019 | %42 |
| 2020+ | %40 |

### Alan çeşitliliği (hukuk + ceza + idari çapraz)

İş, borçlar, eşya, miras, aile, ticaret, icra, ceza genel/özel, idare, vergi, kamulaştırma, tapu, tüketici, sigorta, şirketler — her biri için minimum taban (bkz. `quota-plan.json` → `domainFloors`).

---

## 3. Öncelik sırası (kaynak)

1. **YİM / İçtihadı Birleştirme** ve resmi “emsal” işaretli kararlar  
2. **HGK + CGK**  
3. **YİBK** (zaten 1 ile örtüşebilir; çift sayılmaz)  
4. Daire kararları: ilke oluşturan / yol gösterici  
5. Danıştay kurul + önemli daireler (özellikle VDDK, İDDK)

---

## 4. Uniqueness

1. **Ratio özeti:** metinden taşıyıcı paragraf çıkarımı (`extractRatioSummary`).  
2. **N-gram Jaccard / cosine** (varsayılan eşik **0.85**): benzer kümede yalnızca en yüksek `compositeScore` kalır.  
3. İsteğe bağlı **embedding** aşaması (`--embeddings=path.jsonl`): aynı eşik, vektör cosine.  
4. Aynı hukuki sorunu aynı gerekçeyle çözenlerden: **kalite↑ + güncellik↑** kazanır.

---

## 5. Kalite sinyalleri (tercih)

- Uzun, ilke düzeyinde gerekçe  
- “emsal”, “yerleşik içtihat”, “ilke olarak kabul”, “HGK’ca benimsenen” vb.  
- Genel kurul onama/bozma bağlamı  
- Diğer karar atıfları (metin içi E./K. yoğunluğu)

### Dışlama / ceza

- Saf formül onama, usulî red, kısa bozma  
- Metin &lt; ~1.500 karakter (kurul istisnası esnek)  
- Tekrarlayan şablon cümle oranı yüksek

---

## 6. Çıktı formatı

`data/yargi-kararlari/core-100k/catalog.jsonl` satırı:

```json
{
  "id": "...",
  "mahkeme": "Yargıtay",
  "daire": "Hukuk Genel Kurulu",
  "esas": "2011/524",
  "karar": "2011/634",
  "tarih": "12.10.2011",
  "ratioOzeti": "…",
  "uniquenessScore": 0.91,
  "qualityScore": 0.84,
  "sourceScore": 0.95,
  "compositeScore": 0.89,
  "group": "hgk",
  "domain": "usul",
  "era": "2010-2019"
}
```

Ayrıca: `catalog.csv`, `quota-fill-report.json`, `rejected-similar.jsonl` (örnek).

---

## 7. Komutlar

```bash
# Mevcut arşivi skorla + kota/uniqueness ile seç (şimdilik eldeki N karar)
npm run yargi:core-select

# Üst 500 önizleme
npm run yargi:core-select -- --limit=500 --report-only

# Genişletilmiş hasat config ile (ayrı state; mevcut HGK koşusunu bozmaz)
npm run yargi:core-harvest-status
```

---

## 8. Gerçekçilik notu

- Resmi API hız limiti ~**3000 tam metin/gün** → 250k aday ≈ **3 ay** sürekli hasat.  
- 100k seçim, aday havuzu olgunlaştıkça **yeniden koşulur** (idempotent katalog).  
- Danıştay için ayrı client (`archive-danistay.mjs` / kararlar.danistay.gov.tr) gerekir; kota planı şimdiden ayrılmıştır.  
- Ceza birimleri: API `birimYrgCezaDaire` alanı; `config-core-100k.json` içinde tanımlı.

---

## 9. Mevcut durum (başlangıç)

- Yerel arşiv: çoğunlukla **HGK + az YİBK** (binler mertebesi, gece hasadı sürüyor).  
- İlk `yargi:core-select` koşusu: **seed katalog** üretir; 100k’ya kadar her gece hasat sonrası yeniden çalıştırılır.
