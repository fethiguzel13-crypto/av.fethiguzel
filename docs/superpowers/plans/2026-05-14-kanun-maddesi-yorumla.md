# `kanun-maddesi-yorumla` Skill — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** TBK/TMK/TTK maddeleri için profesör düzeyinde akademik şerh üreten Claude Code skill'i yaz ve 3 pilot madde ile kalitesini doğrula.

**Architecture:** Skill `~/.claude/skills/kanun-maddesi-yorumla/SKILL.md` olarak yaşar. Aktivasyonu `Skill` tool ile gerçekleşir. İçinde halüsinasyon önleme kuralları, sabit yazar/eser referans listesi, çalışma akışı (madde oku → scraper çağır → kullanıcı yapıştırma sor → yorum yaz → dosya güncelle → commit) tanımlı. Yorum üretimi sırasında mevcut scraper altyapısı (`scraper/scrape-*.js`) ve `hukuki-halusinasyon-onleme` skill'i ile birlikte çalışır.

**Tech Stack:** Markdown (SKILL.md), Node.js scraperlar (mevcut), `gray-matter` (frontmatter — Next.js'in zaten kullandığı paket), TBK/TMK/TTK markdown dosyaları (mevcut).

**Spec:** [../specs/2026-05-14-kanun-maddesi-yorumla-design.md](../specs/2026-05-14-kanun-maddesi-yorumla-design.md)

**Working Directory:** `C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal`

**Skill Lokasyonu:** `C:\Users\HUAWEI\.claude\skills\kanun-maddesi-yorumla\`

---

## Dosya Yapısı

| Dosya | Tür | Sorumluluk |
|---|---|---|
| `~/.claude/skills/kanun-maddesi-yorumla/SKILL.md` | Yeni | Skill ana dosyası — Claude'a verilen talimatlar |
| `~/.claude/skills/kanun-maddesi-yorumla/references/doctrine-tbk.md` | Yeni | TBK doktrin yazar/eser listesi |
| `~/.claude/skills/kanun-maddesi-yorumla/references/doctrine-tmk.md` | Yeni | TMK doktrin yazar/eser listesi |
| `~/.claude/skills/kanun-maddesi-yorumla/references/doctrine-ttk.md` | Yeni | TTK doktrin yazar/eser listesi |
| `~/.claude/skills/kanun-maddesi-yorumla/references/template.md` | Yeni | Çıktı şablonu (7 bölüm + Metodolojik Not) |
| `~/.claude/skills/kanun-maddesi-yorumla/references/halusinasyon-kurallari.md` | Yeni | Sert halüsinasyon önleme kuralları |
| `content/mevzuat/tbk/madde-1.md` | Modify | Pilot 1 — TBK Madde 1 yorumlanır |
| `content/mevzuat/tmk/madde-1.md` | Modify | Pilot 2 — TMK Madde 1 yorumlanır |
| `content/mevzuat/ttk/madde-18.md` | Modify | Pilot 3 — TTK Madde 18 yorumlanır |
| `app/mevzuat/[kanunId]/[id]/page.tsx` | Modify (opsiyonel) | "Metodolojik Not" statik metin yerine markdown'dan render — pilot test sonrası karar |

Skill bölünmüş referans dosyaları: SKILL.md ana akışı yönetir, ayrıntılı listeler ayrı dosyalarda — bakım kolaylığı.

---

## Faz 1: Skill Yapısı

### Task 1: Skill dizini ve referans dosyaları

**Files:**
- Create: `C:\Users\HUAWEI\.claude\skills\kanun-maddesi-yorumla\` (klasör)
- Create: 5 referans dosyası (doctrine-tbk.md, doctrine-tmk.md, doctrine-ttk.md, template.md, halusinasyon-kurallari.md)

- [ ] **Step 1: Skill dizinini oluştur**

```bash
mkdir -p "/c/Users/HUAWEI/.claude/skills/kanun-maddesi-yorumla/references"
ls "/c/Users/HUAWEI/.claude/skills/kanun-maddesi-yorumla/"
```

Expected: `references/` klasörü görünür.

- [ ] **Step 2: `references/doctrine-tbk.md` yaz**

`C:\Users\HUAWEI\.claude\skills\kanun-maddesi-yorumla\references\doctrine-tbk.md`:

```markdown
# Borçlar Hukuku — Atıf Yapılabilir Yazarlar ve Eserler

**Önemli:** SKILL ASLA bu listenin dışındaki bir yazarı atıflayamaz. Liste dışı isim/eser çıktıda yer alırsa halüsinasyon kuralı ihlali sayılır.

## Genel Hükümler

- Fikret Eren, *Borçlar Hukuku Genel Hükümler*
- Selahattin Sulhi Tekinay / Sermet Akman / Halûk Burcuoğlu / Atilla Altop, *Borçlar Hukuku Genel Hükümleri*
- Mustafa Reşit Karahasan, *Türk Borçlar Hukuku — Genel Hükümler*
- Vedat Buz, *Borçlar Hukuku — Genel Hükümler*
- Necip Kocayusufpaşaoğlu / Hüseyin Hatemi / Rona Serozan / Abdülkadir Arpacı, *Borçlar Hukuku Genel Bölüm*
- Safa Reisoğlu, *Türk Borçlar Hukuku Genel Hükümler*
- Halûk Nomer, *Borçlar Hukuku Genel Hükümler*
- Aydın Zevkliler / Çiğdem Gökyayla, *Borçlar Hukuku*

## Özel Hükümler

- Aydın Zevkliler / K. Emre Gökyayla, *Borçlar Hukuku Özel Borç İlişkileri*
- Cevdet Yavuz / Faruk Acar / Burak Özen, *Türk Borçlar Hukuku Özel Hükümler*
- Hüseyin Hatemi / Emre Gökyayla, *Borçlar Hukuku Özel Hükümler*
- Murat Aydoğdu / Nalan Kahveci, *Türk Borçlar Hukuku Özel Borç İlişkileri*

## Atıf formatı

Skill çıktısında kabul edilen format örnekleri:

- "Eren'e göre, *Borçlar Hukuku Genel Hükümler* eserinde belirtildiği üzere, sözleşme..."
- "Tekinay/Akman/Burcuoğlu/Altop, *Borçlar Hukuku Genel Hükümleri* eserinde [...] görüşünü savunur."
- "Doktrinde Kocayusufpaşaoğlu/Hatemi/Serozan/Arpacı tarafından [...] yaklaşımı geliştirilmiştir."

**ASLA**:
- Sayfa numarası: "Eren, s. 245" → YASAK
- Baskı yılı: "Eren, 2024" → YASAK (yazılı doğrulanamaz)
- Yıldız yazar: Yukarıdaki listede olmayan kimse → YASAK
```

- [ ] **Step 3: `references/doctrine-tmk.md` yaz**

`C:\Users\HUAWEI\.claude\skills\kanun-maddesi-yorumla\references\doctrine-tmk.md`:

```markdown
# Medeni Hukuk — Atıf Yapılabilir Yazarlar ve Eserler

**Önemli:** SKILL ASLA bu listenin dışındaki bir yazarı atıflayamaz.

## Başlangıç Hükümleri / Kişiler Hukuku

- Mustafa Dural / Tufan Öğüz, *Türk Özel Hukuku Cilt I — Temel Kavramlar ve Medeni Kanunun Başlangıç Hükümleri*
- Mustafa Dural / Tufan Öğüz, *Türk Özel Hukuku Cilt II — Kişiler Hukuku*
- Şener Akyol, *Medeni Hukuk — Şahsın Hukuku*
- Andreas Bertan Özsunay, *Medeni Hukukumuzda Tüzel Kişiler*
- Bilge Öztan, *Şahsın Hukuku Hakiki Şahıslar*

## Aile Hukuku

- Bilge Öztan, *Aile Hukuku*
- Turgut Akıntürk / Derya Ateş Karaman, *Türk Medeni Hukuku — Aile Hukuku*
- Selahattin Sulhi Tekinay, *Türk Aile Hukuku*
- Ahmet M. Kılıçoğlu, *Aile Hukuku*

## Miras Hukuku

- Bilge Öztan, *Miras Hukuku*
- Mustafa Dural / Turgut Öz, *Türk Özel Hukuku Cilt IV — Miras Hukuku*
- Ahmet M. Kılıçoğlu, *Miras Hukuku*

## Eşya Hukuku

- Kemal Oğuzman / Özer Seliçi / Saibe Oktay-Özdemir, *Eşya Hukuku*
- Lale Sirmen, *Eşya Hukuku*
- Şener Akyol, *Tapu Sicili*
- Yasemin Esin, *Türk Hukukunda Taşınmaz Mülkiyeti*

## Atıf formatı

(doctrine-tbk.md ile aynı kurallar)
```

- [ ] **Step 4: `references/doctrine-ttk.md` yaz**

`C:\Users\HUAWEI\.claude\skills\kanun-maddesi-yorumla\references\doctrine-ttk.md`:

```markdown
# Ticaret Hukuku — Atıf Yapılabilir Yazarlar ve Eserler

**Önemli:** SKILL ASLA bu listenin dışındaki bir yazarı atıflayamaz.

## Ticari İşletme Hukuku

- Sabih Arkan, *Ticari İşletme Hukuku*
- Hüseyin Ülgen / Mehmet Helvacı / Arslan Kaya / Necla Akdağ Güney, *Ticari İşletme Hukuku*
- Reha Poroy / Hamdi Yasaman, *Ticari İşletme Hukuku*
- Fatih Karayalçın, *Ticari İşletme Hukuku*

## Şirketler Hukuku

- Reha Poroy / Ünal Tekinalp / Ersin Çamoğlu, *Ortaklıklar Hukuku*
- Hasan Pulaşlı, *Şirketler Hukuku*
- Mehmet Bahtiyar, *Ortaklıklar Hukuku*
- Sabih Arkan, *Şirketler Hukuku Genel Esasları*

## Kıymetli Evrak Hukuku

- Fırat Öztan, *Kıymetli Evrak Hukuku*
- Abuzer Kendigelen, *Kıymetli Evrak Hukuku*
- Sabih Arkan, *Kıymetli Evrak Hukuku — Çek*

## Sigorta Hukuku

- Samim Ünan, *Türk Sigorta Hukuku*
- Mertol Can, *Sigorta Hukuku Dersleri*

## Atıf formatı

(doctrine-tbk.md ile aynı kurallar)
```

- [ ] **Step 5: `references/halusinasyon-kurallari.md` yaz**

`C:\Users\HUAWEI\.claude\skills\kanun-maddesi-yorumla\references\halusinasyon-kurallari.md`:

```markdown
# Halüsinasyon Önleme — Sert Kurallar

Bu skill çalışırken aşağıdaki kurallar **istisnasız** uygulanır. Herhangi birinin ihlali, üretilen yorumun kullanılamaz olmasına yol açar.

## 1. Yargıtay/AYM/AİHM Karar Künyesi

**ZORUNLU:** Her zikredilen karar künyesi (Daire/Esas/Karar/Tarih) şu kaynaklardan birinden gelmelidir:

a) `scraper/scrape-yargitay.js`, `scrape-aym.js`, `scrape-hudoc.js` JSON çıktısı
b) Kullanıcının yapıştırdığı doğrulanabilir metin (Lexpera/Jurix kopyala-yapıştır, PDF içeriği)
c) İçinde bulunulan oturumda kullanıcının açıkça onayladığı bir kaynak

**YASAK:**
- Künyenin herhangi bir parçasının (daire numarası, esas, karar, tarih) **tahmin edilmesi**, "yaklaşık olarak" verilmesi, **uydurulması**
- "Y. 11. HD'nin yerleşik içtihadına göre..." gibi atıfsız genel referanslar (karar veriyorsa künye, yoksa atıfsız "doktrinde tartışılan" gibi ifadeler)
- Çekilen kaynakta olmayan bir "ileri okuma" karar ekleme

**Aksiyon:** Yorumun "Yargıtay İçtihadı" bölümünde hiç karar yoksa, "Bu maddeye doğrudan ilişkin son 24 ayda Yargıtay/AYM kararı çekilemedi. Kullanıcı tarafından sağlanan ek karar yok." yazılır. Boş bırakılmaz, uydurulmaz.

## 2. Doktrin Atfı

**ZORUNLU:** Atıf yapılan her yazar/eser, `references/doctrine-{kanun}.md` dosyasında bulunmalıdır.

**YASAK:**
- Listede olmayan yazar/eser zikredilmesi
- Sayfa numarası verilmesi (bilinmiyor, doğrulanabilir değil)
- Spesifik baskı yılı/cilt verilmesi
- "Eren bu hususta üç farklı argüman geliştirmiştir" gibi kontrol edilemeyen yapısal iddialar — sadece doğrulanabilir genel ifadeler ("Eren, *Borçlar Hukuku Genel Hükümler* eserinde bu hususta açıklayıcı bir analiz sunmaktadır.")

**Aksiyon:** Spesifik bir görüş için atıf yapılamıyorsa atıfsız genel ifade kullan: "Doktrinde hakim görüşe göre...", "Bir kısım yazara göre...", "Tartışmalı bir noktadır."

## 3. Madde Çapraz Referansı

**ZORUNLU:** "TBK m. X ile birlikte okunmalıdır" şeklindeki her atıf, gerçek bir sistematik ilişkiye dayanmalıdır.

**YASAK:**
- "TBK m. 247" yazıp, gerçekte 247'nin alakasız bir hüküm olduğu durum
- Madde numarasını tahmin etme
- Var olmayan madde numarası (örn. TBK'da m. 700 yok — m. 649'da biter)

**Aksiyon:** Çapraz referans yapacaksan, atıflanan maddenin gerçekten ilişkili olduğunu kısa bir gerekçeyle yaz. Emin değilsen atıflama.

## 4. Tarihsel Veri

**ZORUNLU:** "Eski 818 sayılı BK'nın eşdeğer maddesi 1'di" gibi tarihsel iddialar **doğrulanabilir** olmalı.

**YASAK:**
- "Kaynak hüküm İsviçre BK m. X'tir" — bilinmiyorsa söylenmez
- "1926 tarihli eski BK'da bu hüküm m. Y idi" — kontrol edilemiyorsa söylenmez

**Aksiyon:** Tarihsel arka plan için sadece kesinlikle bilinen bilgiler (örn: 6098 sayılı TBK 2012'de yürürlüğe girdi, kaynak temel olarak İsviçre BK'dır) zikredilir.

## 5. Olay Senaryosu

**ZORUNLU:** Pratik örnek olaylar **kurmaca** olduğu açıkça belirtilir.

**YASAK:**
- Gerçek bir olayı varmış gibi sunma
- Yargıtay'da görülmüş gerçek bir davayı "olay senaryosu" olarak sunma

**Aksiyon:** "Olay 1 (kurmaca senaryo)" gibi açık ibare kullan.

## 6. Genel İlke

**Şüphe varsa atıfsız genel ifade kullan**. Akademik kalitenin korunması, halüsinasyondan daha az önemlidir. Yanlış bir Yargıtay künyesi yazmaktansa, "bu konuda mevcut karar bulunamadı, kullanıcının ek paylaşımı bekleniyor" demek **daha iyidir**.

Skill, `hukuki-halusinasyon-onleme` skill'i ile **birlikte** çalışır. O skill aktifse onun kuralları da geçerlidir.
```

- [ ] **Step 6: `references/template.md` yaz**

`C:\Users\HUAWEI\.claude\skills\kanun-maddesi-yorumla\references\template.md`:

```markdown
# Akademik Yorum Çıktı Şablonu

Skill bu şablonu doldurur. Her bölüm hedef uzunluğu vardır; alt sınırın altına düşülmez, üst sınır esnektir.

## Genel İlkeler

- **Dil**: Akademik Türkçe, hukukçu okur kitlesine yönelik. Cümleler net, paragraflar 4-8 cümle.
- **Atıf**: `halusinasyon-kurallari.md` ve `doctrine-{kanun}.md` kurallarına sıkı uyum.
- **Format**: Markdown. Alt başlıklar `####`, alt-alt başlıklar `#####`.
- **Hedef toplam uzunluk per madde**: 300-700 satır. Kısa/teknik maddeler 200, çekirdek maddeler 800+.

## Şablon

```markdown
### Akademik Yorum ve Analiz

#### 1. Maddenin Sistematiği ve Genel Açıklama

[Hedef: 30-80 satır]

- Maddenin kanun içindeki konumu (Kısım/Bölüm/Ayrım)
- Düzenleme amacı (ratio legis)
- Tarihsel arka plan (kaynak hüküm, eski 818 sayılı BK karşılığı varsa)
- Karşılaştırmalı hukuk perspektifi (sadece kesin bilinen referanslar)

#### 2. Maddedeki Kavramların Analizi

[Hedef: 80-150 satır]

Madde metnindeki her kilit kavram için ayrı alt-başlık:

##### 2.1. [Kavram 1 adı]
[Tanım, unsurlar, sınırlar, doktrin görüşleri, tartışmalı noktalar]

##### 2.2. [Kavram 2 adı]
[Aynı yapı]

[Devamı kavram sayısına göre]

#### 3. Sistematik İlişkiler

[Hedef: 30-50 satır]

Maddenin birlikte okunması gereken diğer hükümler. Her biri için kısa gerekçe:

- **[Kanun] m. X** — [İlişki açıklaması]
- [...]

#### 4. Uygulama: Yargıtay İçtihadı

[Hedef: 60-150 satır, 5-10 gerçek karar]

Scraper'dan veya kullanıcı yapıştırmasından gelen kararlar:

**[Künye birebir, daire/E./K./T.]**

> [Uzun, doğrudan alıntı veya özet — alıntı parantezsiz değil]

Bu karar, [...] göstermektedir / vurgulamaktadır.

[Birden çok karar varsa aynı format]

Eğer YİBK varsa **özel öncelik** ile, kalın başlıkla.
Eğer HGK varsa **özel öncelik** ile.

#### 5. Pratik Örnek Olaylar

[Hedef: 30-50 satır, 2 senaryo]

**Olay 1 (kurmaca senaryo):**
[Olay anlatımı]

*Hukuki analiz:* [Maddenin uygulanışı, sonuç]

**Olay 2 (kurmaca senaryo):**
[Aynı yapı]

#### 6. Pratik Uygulama Notları

[Hedef: 15-40 satır]

- **İspat yükü**: [...]
- **Şekil koşulu**: [...]
- **Süreler / zamanaşımı**: [...]
- **Görevli/yetkili mahkeme**: [...]
- **Yaygın uygulama hataları**: [...]

(Maddeye uygun olan başlıklar; alakasız olanlar boş bırakılmaz, kaldırılır.)

#### 7. Eleştirel Değerlendirme

[Hedef: 30-60 satır]

- Doktrindeki görüş ayrılıkları
- Uygulamada görünen sorunlar
- Reform önerileri (varsa)
- Yazarın değerlendirmesi

---

### Metodolojik Not

[Hedef: 15-30 satır]

Bu yorum, **Av. Fethi Güzel** tarafından akademik dürüstlük ilkeleri çerçevesinde hazırlanmıştır.

**Kullanılan kaynaklar:**
- *Doktrin*: [Bu yoruma kullanılan yazar+eser listesi — sadece referans dosyasındaki listeden]
- *Yargıtay kararları*: [karararama.yargitay.gov.tr üzerinden DD.MM.YYYY tarihinde çekilen, son N ay aralığındaki kararlar]
- *AYM kararları*: [Benzer açıklama]
- *Kullanıcının paylaştığı kaynaklar*: [Varsa]

**Yorumun kapsamı**: [Bu yorum hangi sayılı kanunun hangi tarihli versiyonuna dayanıyor]

**Görüş**: [Tartışmalı bir konuda hangi görüş benimsendi, gerekçesi]

**Güncellik**: DD.MM.YYYY tarihi itibariyle günceldir. Yeni Yargıtay HGK/YİBK kararları veya kanun değişiklikleri sonrası revize edilebilir.
```
```

- [ ] **Step 7: Commit referans dosyaları**

(Skill referansları repo dışında — `~/.claude/skills/`'de. Git'e girmez. Skill `~/.claude` üzerinde yaşar.)

Bu adımda commit yok; sadece dosyaların yazıldığı doğrulanır:

```bash
ls "/c/Users/HUAWEI/.claude/skills/kanun-maddesi-yorumla/references/"
```

Expected: 5 dosya (doctrine-tbk.md, doctrine-tmk.md, doctrine-ttk.md, template.md, halusinasyon-kurallari.md).

---

### Task 2: SKILL.md ana dosyası

**Files:**
- Create: `~/.claude/skills/kanun-maddesi-yorumla/SKILL.md`

- [ ] **Step 1: SKILL.md'yi yaz**

`C:\Users\HUAWEI\.claude\skills\kanun-maddesi-yorumla\SKILL.md`:

```markdown
---
name: kanun-maddesi-yorumla
description: Use when user asks to write an academic commentary for a Turkish private-law article (TBK/TMK/TTK), e.g. "TBK Madde 1 yorumla", "TMK Madde 5 için akademik şerh yaz", "TTK Madde 18'i şerh et", or generally requests a long, doctrinal commentary on a specific Turkish civil/commercial law article. Produces a multi-section commentary (300-700 lines markdown) with cited Yargıtay decisions and doctrinal references, then updates the corresponding content/mevzuat/*.md file in fethiguzel-portal.
---

# Kanun Maddesi Akademik Şerh Üretimi

Türk özel hukukunun temel kanunlarının (TBK, TMK, TTK) maddeleri için derinlikli, akademik kalitede bir şerh üretir. Üretim, halüsinasyon riskini sıfıra yakın tutan sert kurallarla çerçevelenmiştir.

## Aktivasyon

Kullanıcı "TBK Madde N yorumla", "TMK Madde N için akademik şerh", "TTK Madde N'yi şerh et", "TBK 1 için yorum yaz" veya benzeri net bir talepte bulunduğunda.

## Zorunlu Ön Okuma

Skill aktif olduğunda **önce** şu referans dosyalarını oku:

1. `~/.claude/skills/kanun-maddesi-yorumla/references/halusinasyon-kurallari.md` — uyulması zorunlu sert kurallar
2. `~/.claude/skills/kanun-maddesi-yorumla/references/template.md` — çıktı şablonu
3. `~/.claude/skills/kanun-maddesi-yorumla/references/doctrine-{kanun}.md` — ilgili kanunun doktrin yazar listesi (TBK için doctrine-tbk.md, TMK için doctrine-tmk.md, TTK için doctrine-ttk.md)

Bu dosyaların hiçbirinin içeriğini bypass etme. Tüm üretim onların kurallarına uyar.

## Çalışma Akışı

### 1. Madde Dosyasını Bul ve Oku

Kullanıcı talebine göre dosya yolunu belirle:

- TBK → `C:/Users/HUAWEI/Desktop/internet/fethiguzel-portal/content/mevzuat/tbk/madde-N.md`
- TMK → `C:/Users/HUAWEI/Desktop/internet/fethiguzel-portal/content/mevzuat/tmk/madde-N.md`
- TTK → `C:/Users/HUAWEI/Desktop/internet/fethiguzel-portal/content/mevzuat/ttk/madde-N.md`

`Read` tool ile dosyayı oku. Frontmatter ve madde metnini çıkar.

Dosya yoksa kullanıcıya bildir, devam etme.

Eğer frontmatter'da `commentaryStatus: "completed"` varsa kullanıcıya sor:
"Bu madde zaten yorumlanmış (lastReviewed: X). Üzerine yeniden mi yazayım?"
Cevap olumsuzsa dur.

### 2. Anahtar Kelimeleri Çıkar

Madde metninden ve başlığından 3-5 anahtar kelime belirle. Bunlar Yargıtay/AYM scraper sorgusu için kullanılacak.

Örnek (TBK Madde 1 için): "sözleşme", "irade açıklaması", "icap kabul"
Örnek (TBK Madde 247 — kira için): "kira sözleşmesi", "konut kirası"
Örnek (TMK Madde 1 için): "hâkim", "hukuk yaratma", "örf adet hukuku"

### 3. Scraper'ı Çağır

Bash tool ile çağır:

```bash
cd C:/Users/HUAWEI/Desktop/internet/fethiguzel-portal
node scraper/scrape-yargitay.js --keyword="ANAHTAR" --days=730 --max=30 > /tmp/yargitay-results.json
node scraper/scrape-aym.js --keyword="ANAHTAR" --days=730 --max=10 > /tmp/aym-results.json
```

Anahtar kelimeyi tek bir keyword olarak ilet (scraper birden çok keyword'ü AND yapar).

Eğer scraper başarısız olursa kullanıcıya bildir:
"Yargıtay scraper'ı zaman aşımına uğradı / hata verdi. AYM ve HUDOC'la devam edip kullanıcı yapıştırmasıyla mı tamamlayalım?"

Çıktıları `Read` ile oku. `items` arrayindeki kararları kullanılabilir formata getir.

### 4. Kullanıcı Yapıştırması Çağrısı

Kullanıcıya şu mesajı göster:

> Bu madde için scraper'dan {N} Yargıtay kararı + {M} AYM kararı çektim. Elinizde bu maddeye özel önemli bir karar (Yargıtay HGK, YİBK, Lexpera'da bulduğunuz spesifik bir karar, doktrin görüşü, AİHM kararı vb.) varsa şimdi yapıştırın. Yoksa "devam" deyin, mevcut materyalle ilerleyeceğim.

Kullanıcı yapıştırırsa içeriği analiz et, kararın gerçek olduğunu doğrula (künye formatı, içerik tutarlılığı). Geçerli görünüyorsa kullanım listesine ekle.

"devam" gelirse yorum yazımına geç.

### 5. Yorum Yazımını Üret

`template.md`'deki 7 bölüm + Metodolojik Not yapısını doldur:

1. Maddenin Sistematiği ve Genel Açıklama (30-80 satır)
2. Maddedeki Kavramların Analizi (80-150 satır)
3. Sistematik İlişkiler (30-50 satır)
4. Uygulama: Yargıtay İçtihadı (60-150 satır)
5. Pratik Örnek Olaylar (30-50 satır, açıkça "kurmaca senaryo")
6. Pratik Uygulama Notları (15-40 satır)
7. Eleştirel Değerlendirme (30-60 satır)
+ Metodolojik Not (15-30 satır)

Toplam hedef: 300-700 satır markdown.

`halusinasyon-kurallari.md`'deki tüm kuralları uygula:
- Yargıtay künyeleri birebir scraper/yapıştırma kaynağından
- Doktrin atıfları `doctrine-{kanun}.md` listesinden, sayfa numarası yok
- Madde çapraz referansları yalnızca gerçek sistematik ilişkilerde
- Şüphe varsa atıfsız genel ifade

### 6. Dosyayı Güncelle

`Edit` tool ile mevcut madde dosyasını güncelle. Yapılacak değişiklik:

**Frontmatter'a ekle:**
```yaml
commentaryStatus: "completed"
lastReviewed: "YYYY-MM-DD"  # bugünün tarihi
wordCount: <yorumun kelime sayısı>
keywords: ["k1", "k2", "k3"]
```

**Body'de**:
- `### Bizim Yorumumuz\n\nBu maddeye ait akademik yorum ve analiz yakında eklenecektir.\n` bloğunu kaldır
- Yerine: 7 bölüm + Metodolojik Not (template.md formatında)

**Resmî metin bloğuna dokunma** — değiştirme.

### 7. Kullanıcı Onayı + Commit

Yazımdan sonra kullanıcıya bildir:

> Yorum yazıldı (X satır, ~Y kelime). Lokal'de http://localhost:3000/mevzuat/{kanun}/madde-{N} üzerinden inceleyin. Onaylarsanız `commit` deyin.

`npm run dev` çalışmıyorsa kullanıcıya hatırlatın.

Kullanıcı onaylarsa:

```bash
cd C:/Users/HUAWEI/Desktop/internet/fethiguzel-portal
git add content/mevzuat/{kanun}/madde-{N}.md
git commit -m "content({kanun}-{N}): akademik şerh tamamlandı"
git push
```

Kullanıcı revizyon isterse, geri bildirimi al ve dosyayı tekrar düzenle.

## Hata Yönetimi

| Senaryo | Davranış |
|---|---|
| Madde dosyası yok | "Dosya bulunamadı, doğru kanun ve madde no mı?" — Devam etme |
| Madde commentaryStatus="completed" | Kullanıcıya sor: üzerine yazılsın mı? |
| Scraper Yargıtay timeout | "Yargıtay yanıt vermedi, AYM ve manuel yapıştırma ile devam edelim mi?" |
| Scraper hiç sonuç vermedi | "Bu konuda son 24 ayda ilgili karar yok. Kullanıcı yapıştırması olmadan devam edersek yorum 'Yargıtay İçtihadı' bölümü olmadan üretilir. OK mi?" |
| Listede olmayan yazar için spesifik atıf gerek | ASLA yapma. Atıfsız genel ifade kullan. |
| Madde numarası çapraz referansı belirsiz | Atıflama, kaldır |
| Frontmatter YAML parse hatası (skill çıktısı) | Dosyayı yazmadan önce kendi çıktını YAML olarak parse ederek doğrula. Başarısızsa kullanıcıya bildir |

## Etik Sınırlar

- Halüsinasyon = kalitesizlik. **Boş bırakmak, uydurmaktan iyidir**.
- Kullanıcının onayı olmadan dosyayı commit etme.
- Mevcut "Bizim Yorumumuz" placeholder'ı dışında repodaki yazılı içeriği silme.
- `hukuki-halusinasyon-onleme` skill aktifse, onun kurallarına da uy (kombine güvence).

## Sürdürülebilirlik Notu

Her madde yorumlandığında, `~/.claude/projects/c--Users-HUAWEI-Desktop-internet/memory/` altına bir log girdisi düşün — hangi madde, hangi tarih, hangi anahtar kelimeler kullanıldı, kaç karar çekildi. İleride bu log analiz edilerek hangi konularda az içerik üretildiği görülebilir.
```

- [ ] **Step 2: SKILL.md'nin frontmatter'ı geçerli mi kontrol et**

```bash
head -5 "/c/Users/HUAWEI/.claude/skills/kanun-maddesi-yorumla/SKILL.md"
```

Expected: `---` ile başlıyor, `name`, `description` alanları var, `---` ile bitiyor.

- [ ] **Step 3: Skill kayıtlı mı?**

Bu adımda code yok — Claude Code skill sistemini otomatik tarar. Skill listesinde görünürse OK. Test:

Bir sonraki Claude Code session açtığında veya `/clear` ile session yenilediğinde, `Skill` tool'un argument listesinde "kanun-maddesi-yorumla" görünmeli.

Bu adım, Pilot 1 (Task 3) sırasında bilinmeyenle test edilir.

---

## Faz 2: Pilot İçerik Üretimi

### Task 3: Pilot 1 — TBK Madde 1

**Files:**
- Modify: `content/mevzuat/tbk/madde-1.md`

- [ ] **Step 1: Lokal dev server'ı başlat (eğer halihazırda çalışmıyorsa)**

```bash
cd C:/Users/HUAWEI/Desktop/internet/fethiguzel-portal
npm run dev
```

Tarayıcıda `http://localhost:3000/mevzuat/tbk/madde-1` açık tut.

- [ ] **Step 2: Skill'i tetikle**

Yeni bir Claude session aç veya mevcut session'da:

> "TBK Madde 1 için akademik şerh yaz"

Skill aktif olmalı (görünmüyorsa: önce `Skill` tool ile manuel aktivasyon dene; eğer skill bulunamıyorsa skill dizininde yazım hatası vardır, kontrol et).

- [ ] **Step 3: Skill akışını takip et**

Skill sırasıyla şunları yapacak:
1. `content/mevzuat/tbk/madde-1.md`'i okur
2. Anahtar kelimeleri çıkarır (sözleşme, irade açıklaması)
3. `node scraper/scrape-yargitay.js --keyword="sözleşme irade" --days=730 --max=30` çağırır
4. AYM scraper'ı çağırır
5. Sana sorar: "Spesifik karar yapıştırmak ister misin?"

İlk pilot için **"devam"** de — sadece scraper çıktısı ile test edelim.

- [ ] **Step 4: Skill yorumu üretmeyi tamamlayana kadar bekle**

Bu adım 5-15 dakika sürebilir (uzun çıktı). Skill tamamlandığında dosyayı güncellemiş, sana onay isteyecektir.

- [ ] **Step 5: Tarayıcıda inceleme**

`http://localhost:3000/mevzuat/tbk/madde-1` sayfasını yenile. Yeni yorum render edilmeli:
- 7 alt başlık görünüyor mu? (Sistematiği, Kavramların Analizi, Sistematik İlişkiler, Yargıtay İçtihadı, Pratik Örnek Olaylar, Pratik Uygulama Notları, Eleştirel Değerlendirme)
- Yargıtay künyeleri var mı? Künyeler doğrulanabilir formatta mı?
- "Metodolojik Not" bölümü doluymuş mu?
- Doktrin yazarlarına atıf var mı (Eren, Tekinay vb.)?
- Sayfa numarası gibi spesifik atıflar **YOK** olmalı

- [ ] **Step 6: Kalite kontrolü — manuel inceleme**

Av. Fethi Güzel'in (kullanıcı) gözüyle yorum okunur. Şu kontrolleri yap:
- Akademik dil seviyesi uygun mu?
- Yargıtay alıntıları gerçek mi (rastgele bir künyeyi `karararama.yargitay.gov.tr` üzerinde test et)
- Doktrin atıfları doğru mu (listedeki yazarlar)
- "Sistematik İlişkiler" bölümünde atıflanan diğer maddeler gerçekten ilgili mi
- Pratik olaylar "kurmaca senaryo" olarak işaretlenmiş mi
- Uzunluk hedefe uygun mu (300-700 satır)

- [ ] **Step 7: Sorun varsa skill'i revize et**

Eğer çıktıda sorunlu bir nokta varsa (örn: yanlış karar künyesi, listede olmayan yazar atfı, gereksiz tekrarlar), `~/.claude/skills/kanun-maddesi-yorumla/SKILL.md` veya ilgili referans dosyasını revize et.

Düzeltme yapıldıktan sonra TBK Madde 1'i yeniden üretmek için: önce `commentaryStatus` alanını `"placeholder"` olarak güncelle, sonra skill'i tekrar tetikle.

- [ ] **Step 8: Sonuç tatmin ediciyse commit'le**

Skill kendi commit'liyor olabilir; eğer manuel commit gerekiyorsa:

```bash
cd C:/Users/HUAWEI/Desktop/internet/fethiguzel-portal
git add content/mevzuat/tbk/madde-1.md
git commit -m "content(tbk-1): akademik şerh — sözleşmenin kuruluşu"
git push
```

---

### Task 4: Pilot 2 — TMK Madde 1

**Files:**
- Modify: `content/mevzuat/tmk/madde-1.md`

- [ ] **Step 1: Skill'i tetikle**

> "TMK Madde 1 için akademik şerh yaz"

Bu madde Türk Medeni Kanununun başlangıç hükmü — "Hukukun uygulanması ve hâkimin hukuk yaratma yetkisi". Çok temel, derinlikli yorum gerektirir.

- [ ] **Step 2: Skill akışını takip et**

(Task 3 ile aynı akış.)

İlk pilot'tan farklı olarak bu sefer **manuel karar yapıştırma test et**: kullanıcı yapıştırma adımında, varsa kendi koleksiyonundan TMK m.1'le ilgili kritik bir karar yapıştır (örn: HGK kararı veya tanınmış bir doktrin alıntısı). Skill bu kaynağı entegre edip etmediğini gözlemle.

- [ ] **Step 3: Tarayıcıda incele**

`http://localhost:3000/mevzuat/tmk/madde-1`

Kontroller (Task 3 Step 5 ile aynı).

- [ ] **Step 4: Kalite kontrolü**

(Task 3 Step 6 ile aynı.)

Ek odak: medeni hukuk doktrin yazarları (Dural/Öğüz, Akıntürk/Karaman, Akyol) doğru atıflanmış mı?

- [ ] **Step 5: Commit (skill yapmadıysa manuel)**

```bash
git add content/mevzuat/tmk/madde-1.md
git commit -m "content(tmk-1): akademik şerh — hukukun uygulanması"
git push
```

---

### Task 5: Pilot 3 — TTK Madde 18

**Files:**
- Modify: `content/mevzuat/ttk/madde-18.md`

- [ ] **Step 1: Skill'i tetikle**

> "TTK Madde 18 için akademik şerh yaz"

TTK m.18 "Tacir" tanımıdır — ticaret hukukunun temel kavramı. Yorumlanması ticaret hukukuna özgü doktrin yazarlarını ve uygulamayı test eder.

- [ ] **Step 2: Skill akışını takip et**

Bu sefer scraper anahtar kelimeleri "tacir", "tacir sıfatı" olur. Yargıtay 11/12/13. HD kararları beklenir.

- [ ] **Step 3-5: Önceki pilotlarla aynı kontroller**

Ek odak:
- Arkan'ın *Ticari İşletme Hukuku*, Ülgen ve arkadaşlarının *Ticari İşletme Hukuku* eserlerine atıf var mı?
- Şirketler/Kıymetli evrak yazarları yanlışlıkla zikredilmemiş mi (bu madde için alakasız)?

```bash
git add content/mevzuat/ttk/madde-18.md
git commit -m "content(ttk-18): akademik şerh — tacir kavramı"
git push
```

---

## Faz 3: Sonuç Değerlendirmesi ve Memory

### Task 6: 3 Pilot için Kalite Kapısı

- [ ] **Step 1: Üç pilotu birlikte gözden geçir**

Üç sayfayı arka arkaya tarayıcıda aç:
- http://localhost:3000/mevzuat/tbk/madde-1
- http://localhost:3000/mevzuat/tmk/madde-1
- http://localhost:3000/mevzuat/ttk/madde-18

Kontroller:
- **Tutarlılık**: Üçü de aynı yapısal kaliteyi tutuyor mu? Bir tanesi diğerlerinden bariz şekilde sığ değil mi?
- **Doktrin uygunluğu**: Her kanun için kanuna uygun yazarlar zikredilmiş mi (TBK'da Arkan zikredilmiş gibi karışıklık yok mu)?
- **Halüsinasyon kontrolü**: 3 pilotta rastgele 1'er Yargıtay künyesi seç, `karararama.yargitay.gov.tr` veya Google'da arayarak gerçekten var olduklarını doğrula.
- **Format**: Üçü de aynı 7-bölüm + Metodolojik Not yapısında mı?

- [ ] **Step 2: Kullanıcı (Av. Fethi Güzel) onayı**

Bu üç pilot, **sitenin yeni standardı** olacak. Eğer Av. Fethi Güzel "evet, bu kalite seviyesini koruyabilirsek mükemmel" diyorsa Faz 3 tamamlanır. "Hayır, şuralarda eksik var" diyorsa skill revize edilir ve gerekirse pilotlar yeniden üretilir.

- [ ] **Step 3: Sorun varsa skill revize**

Çıkan sorunlara göre `SKILL.md` veya `references/*.md` güncellenir. Pilotlar yeniden üretilir (önce `commentaryStatus: "placeholder"` yapılır).

---

### Task 7: Memory + README Güncellemesi

- [ ] **Step 1: Memory girdisi**

`C:\Users\HUAWEI\.claude\projects\c--Users-HUAWEI-Desktop-internet\memory\kanun_serh_skill.md`:

```markdown
---
name: kanun-serh-skill
description: kanun-maddesi-yorumla skill kurulum bilgisi, halüsinasyon kuralları, pilot içerik durumu
type: project
---

Skill lokasyonu: ~/.claude/skills/kanun-maddesi-yorumla/
- SKILL.md (ana talimatlar)
- references/halusinasyon-kurallari.md (sert kurallar)
- references/template.md (çıktı şablonu)
- references/doctrine-tbk.md, doctrine-tmk.md, doctrine-ttk.md (atıf yapılabilir yazarlar)

Aktivasyon: "TBK/TMK/TTK Madde N yorumla" gibi taleplerle

Repo: github.com/fethiguzel13-crypto/av.fethiguzel
İçerik dizini: content/mevzuat/{tbk,tmk,ttk}/madde-N.md (~3214 toplam madde)

Frontmatter yeni alanlar: commentaryStatus ("placeholder"|"draft"|"completed"), lastReviewed, wordCount, keywords

Pilot 3 madde: TBK m.1, TMK m.1, TTK m.18 (tarih: 2026-05-14)

**Why:** Halüsinasyonsuz, profesör kalitesinde şerh üretimi. Akademik dürüstlük > içerik miktarı.
**How to apply:**
- Yeni madde yorumu için skill tetikle, sırayla akışı izle
- Doktrin listesinde olmayan yazar gerekirse listeyi GÜNCELLE, asla atıfta kaçak yazar kullanma
- Halüsinasyon kuralları sıkı — şüphe varsa atıfsız genel ifade
- Bulk üretim (~3200 madde) ayrı süreç; günde 5-10 sürdürülebilir tempo
```

`MEMORY.md`'ye satır ekle:

```markdown
- [Kanun Şerh Skill](kanun_serh_skill.md) — Akademik kanun yorumu üretim skill'i + pilot 3 madde
```

- [ ] **Step 2: README'ye akademik içerik bölümü ekle**

`C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal\README.md` sonuna ekle:

```markdown
## Akademik Şerh Üretimi (kanun-maddesi-yorumla)

Her TBK/TMK/TTK maddesi için akademik kalitede şerh üretimi için Claude Code skill kurulu: `~/.claude/skills/kanun-maddesi-yorumla/`.

**Kapsam:** ~3214 madde (TBK 649 + TMK 1030 + TTK 1535).

**Pilot durumu (2026-05-14):**
- TBK Madde 1 — Sözleşmenin kuruluşu ✓
- TMK Madde 1 — Hukukun uygulanması ✓
- TTK Madde 18 — Tacir kavramı ✓

**Bulk üretim:** Aylar/yıllar sürer. Sürdürülebilir tempo: günde 5-10 madde. Önceliklendirme: çekirdek maddeler (sözleşmeler, ayni haklar, evlilik, miras, ticari işletme) önce.

**Halüsinasyon kontrolü:**
- Yargıtay künyeleri: yalnız scraper çıktısı veya kullanıcı yapıştırması
- Doktrin: yalnız `references/doctrine-{kanun}.md` listesindeki yazarlar
- Sayfa numarası: ASLA
- Çapraz referans: yalnız gerçek sistematik ilişki

**Skill kullanımı:**
Yeni Claude Code session'da "TBK Madde 5 yorumla" gibi söyle. Skill otomatik tetiklenir, scraper çağırır, akademik şerh üretir, dosyayı günceller.
```

- [ ] **Step 3: Commit + push**

```bash
cd C:/Users/HUAWEI/Desktop/internet/fethiguzel-portal
git add README.md
git commit -m "docs: README — akademik şerh üretim sistemi ve pilot 3 madde"
git push
```

---

## Self-Review Checklist

**Spec coverage:**
- ✅ Skill yapısı (tek skill) — Task 2
- ✅ Çalışma akışı (madde oku → scraper → yapıştırma → yorum → dosya güncelle → commit) — Task 2 SKILL.md
- ✅ Halüsinasyon önleme kuralları — Task 1 Step 5 (references/halusinasyon-kurallari.md)
- ✅ Doktrin yazar/eser listesi — Task 1 Steps 2-4 (doctrine-{tbk,tmk,ttk}.md)
- ✅ Çıktı şablonu (7 bölüm + Metodolojik Not) — Task 1 Step 6 (template.md)
- ✅ Frontmatter genişletmesi (commentaryStatus, lastReviewed, wordCount, keywords) — Task 2 SKILL.md akış adım 6
- ✅ Pilot 3 madde (TBK m.1, TMK m.1, TTK m.18) — Task 3, 4, 5
- ✅ Test stratejisi (her pilotta kalite + halusinasyon kontrolleri) — Task 3-6
- ✅ Hata yönetimi (madde bulunamadı, scraper fail, vs.) — Task 2 SKILL.md "Hata Yönetimi"
- ✅ Memory + README — Task 7

**Type/method tutarlılığı:**
- `commentaryStatus` değerleri ("placeholder", "draft", "completed") tüm task'larda aynı ✓
- `lastReviewed`, `wordCount`, `keywords` frontmatter alanları tutarlı ✓
- Skill referans dosya yolları (`references/doctrine-{kanun}.md`) tüm task'larda aynı ✓

**Placeholder taraması:** "TBD/TODO" — yok ✓

**Açık nokta:** Bulk üretim (3200 madde) bu plan dışı — ayrı bir alt-proje. Bu plan sadece skill kurulumu + 3 pilot.
