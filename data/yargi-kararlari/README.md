# Yargıtay karar arşivi (yerel, ölçekli)

## 2026-09-26'dan beri: hasat motoru v2 (`scripts/yargi-kararlari/hasat.mjs`)

Eski yığın (izleyici görev → watchdog → until-done → 350'lik partiler) devre dışı.
Yerine tek, uzun ömürlü bir süreç çalışıyor. Disk düzeni aynı olduğu için
site ve mobil yayın hattı (`mobile/scripts/build-icthat-data.mjs`) değişmeden çalışır.

| Konu | Eski | v2 |
|------|------|----|
| Hız | sabit 4–9 sn + her 25'te 45–90 sn mola (~3.300/gün) | uyarlamalı (AIMD): 429 gelene kadar yavaş artar, 429'da ×0,7 düşer; tavan 10/dk, hafta içi 09–18 TR 8,5/dk |
| Ağ kesintisi | ~7 sn'de bir yeniden dener (12–20 saatlik fırtınalar) | devre kesici: 1→2→4…30 dk geri çekilme, önce yerel interneti yoklar |
| Tarama | daire × anahtar kelime, 2012'den başlayarak | tüm birimler, en yeni aydan geriye; 9.000'i aşan pencere ikiye bölünür |
| Oturum | çerezsiz | tarayıcı gibi çerez (F5 TS* + JSESSIONID) |
| Durum yazımı | her kararda 10 MB progress.json | olay günlüğü + saatlik anlık görüntü, atomik yazım |

Neden: `_state/run.log` ölçümü — "yerleşik içtihat" anahtar kelimesi API'de her kararla
eşleşiyor (filtre fiilen yok, aynı sonuçlar 6–10 kez sayfalanacaktı); arşivin %48'i 2013
yılıydı; 429'lar dakikada ~9 isteğin üstünde başlıyor.

```powershell
npm run yargi:hasat-durum                       # durum + yıllık sayım tablosu
.\scripts\yargi-kararlari\hasat-servis.ps1 -Durdur   # görevi kapat + motoru durdur
.\scripts\yargi-kararlari\hasat-servis.ps1 -Devam    # yeniden aç
```

- Ayarlar: `scripts/yargi-kararlari/harvester.json` (5 dakikada bir yeniden okunur).
- Log: `_state/harvester.log` (20 MB'ta döner) · durum: `_state/harvester-status.json` · plan: `_state/harvester-plan.json`.
- Zamanlanmış görev `YargiHasatMotoru`: oturum açılışında + 10 dakikada bir "çalışmıyorsa başlat".
- Tek kopya kilidi `_state/harvester.lock`; eski `archive-yargitay.mjs` / `until-done.mjs` bu kilidi görünce kendiliğinden çıkar.
- Eski sisteme dönüş: `hasat-servis.ps1 -Kaldir` ve `Enable-ScheduledTask -TaskName YargiKararHarvestMonitor`. Geçiş öncesi durum yedeği `_state/yedek-20260926-220106/`.

### Kalıcı hasat politikası (kullanıcı talimatı, 2026-09-26)

> Önce 2026 tarihli kararlar insin, sonra yavaş yavaş her yıl geriye gidilsin; güncellik çok önemli.
> Hep aynı türde kararlar inmesin, emsal olacak kararlar insin. Birbirine benzemeyen kararlarla
> yaklaşık 600 bin ilk hedef; yeni tarihten eski tarihe doğru.

Politika `scripts/yargi-kararlari/harvester.json` → `politika` bölümünde durur ve plana
(`_state/harvester-plan.json` → `politika`) kopyalanır. Kullanıcıya sorulmadan gevşetilmez.

Nasıl uygulanıyor:

1. **Sıra:** aylık pencereler en yeni aydan geriye; kuyruk yıl sırasıyla boşalır (önce 2026).
2. **Envanter:** her pencerede önce toplam ölçülür (9.000'i aşarsa bölünür), sonra emsal işaret
   kelimeleri (`ilke yerleşik öğreti doktrin istikrar emsal`, API bunları "veya" ile arar) ile
   işaretli kararlar, sonra pencerenin tüm künyeleri `_state/envanter/*.jsonl` dosyasına yazılır.
3. **Seçim (indirmeden önce):** kurul kararlarının ve işaretli kararların hepsi; işaretsiz daire
   kararları birimin ölçülen verimine göre örneklenir (günlere ve karar numaralarına yayılarak,
   tek birim pencerenin %25'ini aşamaz). Yıl bitince verimi yüksek birimler için doldurma turları.
4. **Etiket (indirdikten sonra):** `emsal` = core-100k kalite puanı eşiği; `benzerOf` = aynı
   birimde 64 bit SimHash uzaklığı ≤ 8 olan önceki karar; **yararlı = emsal ve benzersiz.**
   Kayıt: `_state/benzerlik.jsonl` (karar başına bir satır) + karar dosyası ve `index.jsonl`
   satırında `yararli / emsal / benzerOf / emsalSkoru / hukukAlani`.
5. **Hedef:** 600.000 yararlı karar dolunca eski yıllara geçilmez, yalnız içinde bulunulan yıl
   güncel tutulur.

Kalibrasyon (eski arşivden, 2026-09-26): HGK kararlarının %64'ü, CGK %91'i yararlı; 2013 daire
kararlarında oran %3–16 (çoğu kısa formül ya da seri kalıp karar). İşaret kelimesi geçen daire
kararlarında yararlı oranı %60–93.

Güvenlik notu: 2026-09-26'da 8/dk hızda site üç istekte `DisplayCaptcha` istedi (yanıt
`metadata.FMTE` içinde gelir). Motor artık bunu tanır: hız yarıya iner, 5–10 dk mola; 30 dk içinde
tekrarlarsa 30–45 dk durur. Oturum değiştirip captcha atlatılmaz. Hız tavanı bu yüzden 8/dk
(mesaide 7).

Aşağıdaki bölümler eski sistemi (arşiv tarihi için) anlatır.

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
