# Yargıtay karar arşivi (yerel, ölçekli)

Kaynak: **karararama.yargitay.gov.tr** (resmi). Lexpera zorunlu değil.  
BAM ve ilk derece aranmaz. On binlerce karara göre tasarlandı.

## Öncelik sırası

| Sıra | Tier | Ne |
|------|------|-----|
| 0 | `yibk` | İçtihadı Birleştirme — API birimi: **Büyük Genel Kurulu** |
| 1 | `hgk` | Hukuk Genel Kurulu (tam birim, yıl pencereleri) |
| 1 | `cgk` | Ceza Genel Kurulu (aynı öncelik; ince kuyruk önce tohumlanır) |
| 2 | `hdbk` | Hukuk Daireleri Başkanlar Kurulu |
| 3 | `borclar-daire` / `medeni-daire` / `is-daire` / `icra-daire` | Hukuk daireleri + ilke anahtar kelime |
| 3 | `ceza-daire` | Ceza daireleri (`birimYrgCezaDaire` + ilke kelime) |

İndirme kuyruğu her zaman bu önceliğe göre sıralanır.

## Tempo (ban yemeden ölçek)

`config.json` → `rateLimit` (güncel hedefler, 2026-08 yükseltmesi):

- **Günde ~3000** tam metin (önceki 1500; `maxFullTextPerDay`)
- Koşu başı **~150** tam metin
- Kararlar arası **4.5–12 sn** rastgele
- Her **50** kararda **45–100 sn** uzun mola
- Arama: günde **1200** çağrı; sayfalar **100’lük** pagination

Kaynak yalnızca **resmi Yargıtay API** (`karararama.yargitay.gov.tr`). Lexpera zorunlu değil.

### Kabaca süre (3000/gün)

| Hedef | Süre (yaklaşık) |
|-------|-----------------|
| 5.000 | ~2 gün |
| 10.000 | ~4 gün |
| 20.000 | ~1 hafta |

HGK tek başına binlerce kayıt bandında; daireler + anahtar kelime ile on binlerceye çıkar.  
`until-done` günlük bütçe dolunca **UTC gece yarısına** kadar bekler, ertesi gün otomatik devam eder.

## Depolama

```
data/yargi-kararlari/
  decisions/YYYY/{id}.json   # yıl shard (10k+ dosya için)
  by-tier/{yibk|hgk|...}/
  by-alan/{borclar|medeni|yibk|hgk}/
  _state/
    progress.json            # downloadedIds
    queue.jsonl              # öncelikli kuyruk
    harvest-cursor.json      # hangi yıl/sayfa/daire
    daily.json               # günlük bütçe
  index.jsonl
  index.html
```

- HTML gövde varsayılan **saklanmaz** (disk); sadece düz metin (`storeHtml: false`).
- Ağır klasörler `.gitignore`’da — Vercel’e gitmez.

## Komutlar

```bash
# Durum (COMPLETE / IN PROGRESS)
npm run yargi:status

# Bitene kadar sürekli (günlük bütçe dolunca yarına bekler, devam eder)
npm run yargi:until-done

# Sıradaki iş planı (indirmez)
npm run yargi:dry

# Tek batch
npm run yargi:run

# Sadece YİBK / HGK
npm run yargi:yibk
npm run yargi:hgk

# Birim testleri
npm run yargi:test

# Yerel HTML
npm run yargi:index

# Çekirdek 100k emsal seçimi (skor + uniqueness + kota)
npm run yargi:core-select
npm run yargi:core-report
```

### Çekirdek 100.000 emsal kütüphanesi

Metodoloji, kota planı ve skor motoru:

- `scripts/yargi-kararlari/core-100k/CORE-100K.md`
- `scripts/yargi-kararlari/core-100k/quota-plan.json`
- Çıktı: `data/yargi-kararlari/core-100k/catalog.jsonl` (+ CSV, rapor)

Hasat genişletme (CGK, ceza, icra, …) için ayrı config taslağı:  
`scripts/yargi-kararlari/core-100k/config-core-100k.json` (mevcut HGK state’ini bozmaz).

`until-done` kuyruk ≥120 iken önce `--download-only` ile boşaltır; bütçe (180 tam metin/gün) dolunca bir sonraki takvim gününe kadar bekler, sonra sürdürür.

## Vercel sonrası

`decisions/` → `public/data/yargi-kararlari/` paket paket; `/yargi-kararlari` zaten iskelet.
