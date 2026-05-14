# Tasarım: `kanun-maddesi-yorumla` Skill — Akademik Şerh Üretimi

**Tarih:** 2026-05-14
**Kapsam:** Türk Borçlar Kanunu, Türk Medeni Kanunu ve Türk Ticaret Kanunu maddeleri için profesyonel akademik şerh üreten bir Claude Code skill ve 3 pilot madde içeriği.

## Amaç

`fethiguzel-portal` Next.js sitesinde her madde altında bulunan "AKADEMİK YORUM VE ANALİZ" ve "Metodolojik Not" bölümlerini, bir hukuk profesörünün şerh kitabında yazacağı düzeyde derinlikli içerikle doldurmak. Hedef kitle:
- Hukuk lisans öğrencileri (ders çalışma kaynağı)
- Lisansüstü öğrenciler (akademik araştırma)
- Avukatlar (uygulamada hızlı referans)
- Meslekten olmayanlar (genel hukuki bilgi)

Site **Türkiye'nin en kapsamlı açık hukuk şerhi kaynağı** olmayı hedefler.

## Kapsam Dışı

- Vergi hukuku, ceza hukuku, idare hukuku maddeleri (yalnızca özel hukuk: TBK/TMK/TTK)
- Kanun gerekçeleri, hazırlık çalışmaları (eski madde metinleri) yorumu — ayrı proje
- AİHS metinleri için aynı yapı (paralel proje olabilir)
- Bulk içerik üretimi (~3200 madde) — bu spec sadece skill ve pilot 3 madde içindir. Bulk üretim ayrı alt-projedir.

## Mevcut Durum

- **Çalışma dizini**: `C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal`
- **Repo**: `github.com/fethiguzel13-crypto/av.fethiguzel`, Vercel'de yayında
- **İçerik yapısı**:
  - `content/mevzuat/tbk/madde-N.md` (~649 madde)
  - `content/mevzuat/tmk/madde-N.md` (~1030 madde)
  - `content/mevzuat/ttk/madde-N.md` (~1535 madde)
  - Toplam: ~3214 madde
- **Mevcut madde dosyası formatı**:
  ```markdown
  ---
  title: "TBK Madde 1"
  kanun: "Türk Borçlar Kanunu"
  maddeNo: 1
  ---

  **1. Genel olarak**

  ---

  Madde 1 - [Resmi metin]

  ---

  ### Bizim Yorumumuz

  Bu maddeye ait akademik yorum ve analiz yakında eklenecektir.
  ```
- **Render**: `app/mevzuat/[kanunId]/[id]/page.tsx` markdown → HTML, "AKADEMİK YORUM VE ANALİZ" başlığıyla gösterir. "Metodolojik Not" şu an sayfada sabit (her madde için aynı).
- **Mevcut destek altyapısı**:
  - `scraper/` (Yargıtay, AYM, AİHM, Resmî Gazete scraper'ları)
  - `~/.claude/skills/hukuki-halusinasyon-onleme/` (zaten kurulu)
  - `~/.claude/skills/ikincil-atif-yonetimi/` (zaten kurulu)
  - `~/.claude/skills/gunluk-icthat-takip/` (scraper'ları çağıran skill)

## Mimari

### Skill yapısı

Tek skill: `kanun-maddesi-yorumla` (`~/.claude/skills/kanun-maddesi-yorumla/SKILL.md`)

Skill içinde:
- TBK/TMK/TTK için ortak akademik şablon
- Her kanuna özgü doktrin yazar/eser referansları
- Halüsinasyon önleme kuralları (sert)
- Scraper entegrasyonu (anahtar kelime → karar çekme)
- Çıktı: markdown dosyası güncelleme

### Çalışma akışı (skill aktif olunca)

```
1. Kullanıcı: "TBK Madde 1 yorumla" (veya benzer)

2. Skill: Madde dosyasını oku
   → content/mevzuat/tbk/madde-1.md
   → Frontmatter ve madde metnini çıkar

3. Skill: İlgili kavramları/anahtar kelimeleri analiz et
   → Madde metninden 3-5 anahtar kelime
   → Madde başlığından kavramsal alan

4. Skill: Scraper'ı çağır
   → node scraper/scrape-yargitay.js --keyword="kefalet" --days=730 --max=30
   → node scraper/scrape-aym.js --keyword="kefalet" --days=730 --max=10
   → JSON çıktıları topla, kayıtları kullanılabilir formata getir

5. Skill: Kullanıcıya sor
   "Bu maddeye ilişkin yorumda yer almasını özellikle istediğiniz
    kararlar varsa (Yargıtay, AYM, AİHM, doktrin) şimdi yapıştırın.
    Yoksa 'devam' deyin, scraper'dan çekilenlerle ilerleyeceğim."

6. Kullanıcı: Karar yapıştırır VEYA "devam" der.

7. Skill: 7 bölüm + Metodolojik Not yazımı (uzun, kaliteli)

8. Skill: Madde dosyasını güncelle
   → "Bizim Yorumumuz" placeholder'ını kaldır
   → "### Akademik Yorum ve Analiz" altında 7 bölüm + Metodolojik Not yaz
   → Frontmatter'a yeni alanlar:
     - commentaryStatus: "completed"
     - lastReviewed: ISO date
     - wordCount: kelime sayısı

9. Skill: Kullanıcıya bildiri
   "Yorum yazıldı. Lokal'de http://localhost:3000/mevzuat/tbk/madde-1
    üzerinden inceleyebilirsiniz. Onaylarsanız 'commit et' deyin."

10. Kullanıcı onaylarsa:
    git add content/mevzuat/tbk/madde-1.md
    git commit -m "content(tbk-1): akademik şerh"
    git push
```

### Veri akışında bağımsızlık ilkesi

- Skill `scraper/` kodunu bilmek zorunda değil — sadece scrape-all.js veya scrape-X.js'i çağırır ve JSON çıktıyı tüketir
- Skill `app/mevzuat/...` Next.js render kodunu bilmez — sadece markdown dosyasını günceller; render Next.js'in işidir
- Skill, yazar/eser doktrin bilgisini içinde tutar (statik liste)
- Halüsinasyon önleme: skill içinde sert kurallar; ayrıca `hukuki-halusinasyon-onleme` skill'i ile birlikte çalışır

## İçerik Şablonu (Her Maddenin Çıktısı)

```markdown
---
title: "TBK Madde 1"
kanun: "Türk Borçlar Kanunu"
maddeNo: 1
commentaryStatus: "completed"
lastReviewed: "2026-05-14"
wordCount: 4250
---

**1. Genel olarak**

---

Madde 1 - [Resmi metin — değiştirilmez]

---

### Akademik Yorum ve Analiz

#### 1. Maddenin Sistematiği ve Genel Açıklama

Madde 1, Türk Borçlar Kanunu'nun *Birinci Kısım — Genel Hükümler* / *Birinci Bölüm — Borç İlişkisinin Kaynakları* / *Birinci Ayrım — Sözleşmeden Doğan Borç İlişkileri*'nin başlangıç hükmüdür. Düzenlemenin amacı (*ratio legis*), sözleşmenin kuruluş anını ve geçerlilik koşullarını belirlemektir.

Bu maddenin kaynak hükmü, İsviçre Borçlar Kanunu (Schweizerisches Obligationenrecht) Madde 1'dir; 818 sayılı eski Borçlar Kanunu'nun Madde 1'i de aynı düzenlemeyi içermekteydi. 6098 sayılı yeni TBK'da [...]

[Devam: 30-80 satır arası]

#### 2. Maddedeki Kavramların Analizi

##### 2.1. Sözleşme Kavramı

[Yazar atıflı analiz: "Eren, *Borçlar Hukuku Genel Hükümler* eserinde sözleşmeyi ...", "Tekinay/Akman/Burcuoğlu/Altop'a göre ..."]

##### 2.2. İrade Açıklaması

[Detaylı analiz]

##### 2.3. Karşılıklılık ve Birbirine Uygunluk

[Detaylı analiz]

##### 2.4. Açık ve Örtülü İrade Açıklaması

[Detaylı analiz]

[Toplam: 80-150 satır]

#### 3. Sistematik İlişkiler

Madde 1, aşağıdaki hükümlerle birlikte okunmalıdır:

- **TBK m. 2** — Sözleşmenin esaslı noktalarında uyuşma
- **TBK m. 4-5** — Öneri ve karşı öneri
- **TBK m. 19** — Sözleşmenin yorumlanması
- **TBK m. 27** — Geçersizlik
- **TMK m. 5** — TMK'nın Borçlar Hukuku ile bağlantısı

[Devam: her birinin nasıl ilişkilendiğine dair kısa açıklama]

[Toplam: 30-50 satır]

#### 4. Uygulama: Yargıtay İçtihadı

**Y. 13. Hukuk Dairesi, E. 2023/4521, K. 2024/789, T. 12.02.2024**

> [Uzun, künyeli alıntı — gerçek karardan]

Bu karar, [...] göstermektedir.

**Y. 11. Hukuk Dairesi, E. 2024/2147, K. 2024/3852, T. 03.06.2024**

> [Uzun alıntı]

[...]

**Hukuk Genel Kurulu Kararı — E. 2022/8-456, K. 2023/123, T. 15.03.2023** (Özel öncelik)

[...]

[Toplam: 60-150 satır, 5-10 gerçek karar]

#### 5. Pratik Örnek Olaylar

**Olay 1**: A, B'ye "bu daireyi 500.000 TL'ye satarım" diye mesaj atar. B "kabul, hemen geliyorum" diye cevap verir. A bir saat sonra "vazgeçtim" der.

*Hukuki analiz*: [Maddeye uygulanan analiz, sonuç]

**Olay 2**: [...]

[Toplam: 30-50 satır, 2 örnek olay]

#### 6. Pratik Uygulama Notları

- **İspat yükü**: Sözleşmenin varlığını iddia eden taraf, sözleşmenin kurulduğunu (HMK m. 190) ispatlamakla mükelleftir.
- **Şekil**: Madde 1, sözleşmenin geçerliliği için herhangi bir şekil aramaz. Şekil zorunluluğu istisnaidir (TBK m. 12 vd.).
- **Süreler**: Bu maddeden doğrudan kaynaklanan bir süre yoktur; ancak TBK m. 4-5 (öneriye bağlılık süreleri) ile birlikte okunmalıdır.
- **Yaygın hatalar**: Uygulamada en sık karşılaşılan hata, irade açıklamalarının "karşılıklı ve birbirine uygun" olup olmadığının yeterince incelenmemesidir.

[Toplam: 15-40 satır]

#### 7. Eleştirel Değerlendirme

[Doktrindeki görüş ayrılıkları, uygulamada görünen sorunlar, reform önerileri]

[Toplam: 30-60 satır]

---

### Metodolojik Not

Bu yorum, **Av. Fethi Güzel** tarafından akademik dürüstlük ilkeleri çerçevesinde hazırlanmıştır.

**Kullanılan kaynaklar:**
- *Doktrin*: Fikret Eren, *Borçlar Hukuku Genel Hükümler*; Selahattin Sulhi Tekinay/Sermet Akman/Halûk Burcuoğlu/Atilla Altop, *Borçlar Hukuku Genel Hükümleri*; Mustafa Reşit Karahasan, *Türk Borçlar Hukuku — Genel Hükümler*.
- *Yargıtay kararları*: karararama.yargitay.gov.tr üzerinden DD.MM.YYYY tarihinde çekilen, son 24 ay tarih aralığındaki kararlar.
- *AYM kararları*: kararlarbilgibankasi.anayasa.gov.tr üzerinden son 24 aya ait, ilgili anahtar kelimelerle eşleşen bireysel başvuru kararları.

**Yorumun kapsamı**: Bu çalışma, 6098 sayılı TBK'nın yürürlükteki metnine dayanır. Eski 818 sayılı Borçlar Kanunu'nun ilgili maddeleri, yalnızca karşılaştırmalı analiz amacıyla zikredilmiştir.

**Görüş**: Tartışmalı konularda [şu görüş] benimsenmiştir. Gerekçe: [...]

**Güncellik**: Yorum, **DD.MM.YYYY** tarihi itibariyle günceldir. Yeni Yargıtay HGK / YİBK kararları veya kanun değişiklikleri sonrası revize edilebilir.
```

**Hedef uzunluk per madde**: 300-700 satır markdown (kısa maddeler 200, çekirdek maddeler 800+).

## Halüsinasyon Önleme Kuralları (Skill İçinde Sert)

| Konu | Kural | Aksiyon |
|---|---|---|
| Yargıtay kararı künyesi | Sadece scraper JSON'dan veya kullanıcı yapıştırmasından alınır | Künye birebir kopyalanır, asla tahmin edilmez |
| Doktrin yazarı | Bilinen yazar listesi içinde olanlar zikredilebilir | Liste skill içinde sabit; dışı asla |
| Doktrin eseri | Genel olarak bilinen başlıca eserler kabul | Sayfa numarası ASLA verilmez |
| Madde numarası | Sadece skill tarafından kontrol edilen ilişkili maddeler | "TBK m. X" referansı verilmeden önce o maddenin gerçekten ilişkili olduğu mantıksal/sistematik gerekçeyle açıklanır |
| Tarihsel veri (eski madde no, kaynak hüküm) | Bilinmiyorsa söylenmez | "818 sayılı eski BK'da bu hüküm yer almıyordu" yerine "kaynak hüküm İsviçre BK m. 1'dir" gibi yalnızca doğrulanabilir bilgiler |
| Tartışmalı görüş | Atıfsız "doktrinde tartışmalıdır" denilir | Hangi yazarın hangi görüşte olduğu spesifik atıflanırsa yalnızca yazar+eser; sayfa yok |
| AİHM kararı | Sadece kullanıcının yapıştırdığı veya HUDOC scraper'dan gelen | Aynı kural |

Skill, mevcut `hukuki-halusinasyon-onleme` skill'i ile birlikte çalışır (kombine güvence).

## Doktrin Yazar/Eser Bilgi Bankası (Skill İçinde Sabit Liste)

Her kanun için skill içinde sabit bir referans listesi tutulur. Sadece bu listedeki yazarlar atıflanabilir.

**Borçlar Hukuku**:
- Fikret Eren, *Borçlar Hukuku Genel Hükümler*
- Selahattin Sulhi Tekinay / Sermet Akman / Halûk Burcuoğlu / Atilla Altop, *Borçlar Hukuku Genel Hükümleri*
- Mustafa Reşit Karahasan, *Türk Borçlar Hukuku — Genel Hükümler*
- Vedat Buz, *Borçlar Hukuku — Genel Hükümler*
- Necip Kocayusufpaşaoğlu / Hüseyin Hatemi / Rona Serozan / Abdülkadir Arpacı, *Borçlar Hukuku Genel Bölüm*
- Safa Reisoğlu, *Türk Borçlar Hukuku Genel Hükümler*

**Medeni Hukuk** (Genel + Aile + Eşya + Miras):
- Kemal Oğuzman / Özer Seliçi / Saibe Oktay-Özdemir, *Eşya Hukuku* (Eşya kısmı için)
- Bilge Öztan, *Aile Hukuku* (Aile kısmı için)
- Turgut Akıntürk / Derya Ateş Karaman, *Türk Medeni Hukuku — Aile Hukuku*
- Selahattin Sulhi Tekinay, *Türk Aile Hukuku*
- Mustafa Dural / Tufan Öğüz, *Türk Özel Hukuku Cilt I — Temel Kavramlar ve Medeni Kanunun Başlangıç Hükümleri*
- Şener Akyol, *Medeni Hukuk — Şahsın Hukuku*
- Bilge Öztan, *Miras Hukuku*; Mustafa Dural / Turgut Öz, *Türk Özel Hukuku Cilt IV — Miras Hukuku*

**Ticaret Hukuku**:
- Sabih Arkan, *Ticari İşletme Hukuku*
- Hüseyin Ülgen / Mehmet Helvacı / Arslan Kaya / Necla Akdağ Güney, *Ticari İşletme Hukuku*
- Reha Poroy / Hamdi Yasaman, *Ticari İşletme Hukuku*
- Reha Poroy / Ünal Tekinalp / Ersin Çamoğlu, *Ortaklıklar Hukuku*
- Hasan Pulaşlı, *Şirketler Hukuku*

Bu liste skill içinde sabit; **diğer yazarlar atıflanmaz** (halüsinasyon önleme).

## Frontmatter Genişletmesi

Mevcut frontmatter:
```yaml
title: "TBK Madde 1"
kanun: "Türk Borçlar Kanunu"
maddeNo: 1
```

Genişletilmiş:
```yaml
title: "TBK Madde 1"
kanun: "Türk Borçlar Kanunu"
maddeNo: 1
commentaryStatus: "completed" | "draft" | "placeholder"
lastReviewed: "2026-05-14"
wordCount: 4250
keywords: ["sözleşme", "irade açıklaması", "karşılıklılık"]
```

Site render tarafı bu yeni alanları opsiyonel kullanabilir (örn: completion progress bar ana sayfada gösterilebilir). Bu spec kapsamında sadece skill tarafında yazılır.

## Pilot Madde Seçimi (Bu Spec'in Hedefi)

Skill yazıldıktan sonra 3 madde yorumlanır:
1. **TBK Madde 1** — Sözleşmenin kuruluşu (Borçlar Hukuku temel)
2. **TMK Madde 1** — Hukukun uygulanması ve hâkimin hukuk yaratma yetkisi (Medeni Hukuk temel)
3. **TTK Madde 18** — Tacir tanımı ve tacir olmanın hükümleri (Ticaret Hukuku temel)

Bunlar sistematik olarak en önemli "anchor" maddeler. Üçü de uzun ve derinlikli yorum gerektirir — skill'in kapasitesini test eder.

## Test Stratejisi

**Skill'in çalıştığını doğrulayan testler:**
- Skill TBK Madde 1 için çağrıldığında: scraper çağrısı yapılır → sonuç JSON gelir → kullanıcıya soru sorulur → kullanıcı "devam" derse yorum yazımı tamamlanır → dosya güncellenir → frontmatter doğru yazılır
- Hata senaryoları:
  - Scraper başarısız: skill kullanıcıyı bilgilendirir, manuel karar yapıştırması ister
  - Madde dosyası yok: skill düzgün hata mesajı verir
  - Madde metni boş/eksik: skill yorum yazmaz, kullanıcıya bildirir

**Kalite testleri (insan):**
- 3 pilot madde için üretilen yorumu Av. Fethi Güzel okur, akademik kaliteyi doğrular
- Yargıtay kararı künyeleri doğrulanır (yanlış varsa skill düzeltilir)
- Doktrin atıfları gözden geçirilir

**Bulk öncesi kalite kapısı**: Pilot 3 madde onaylanmadan bulk üretime geçilmez.

## Hata Yönetimi

| Senaryo | Davranış |
|---|---|
| Madde dosyası bulunamadı | Skill: "content/mevzuat/{kanun}/madde-{N}.md bulunamadı, doğru kanun ve madde numarası mı?" |
| Scraper hata verdi (Yargıtay timeout) | Skill: "Yargıtay scraper'ı yanıt vermedi, AYM ve HUDOC ile devam edelim mi? Veya manuel kararlar yapıştırmak ister misin?" |
| Çekilen JSON'da hiç ilgili karar yok | Skill: "Bu konuda son 24 ayda yeni yargıtay kararı çıkmamış. Daha eski kararlardan veya kullanıcının yapıştırdıklarından yararlanılacak. Devam edelim mi?" |
| Yazar listesinde olmayan bir yazara atıf yapma ihtiyacı doğdu | Skill ASLA bunu yapmaz. "X konusunda spesifik atıf gerekiyor — listede X yok. Atıfsız genel ifade kullanılacak." |
| Madde numarası referansı belirsiz | Skill: "TBK m.X'in bu konuyla ilişkisi belirsiz, atıf yapmayacağım" |
| Markdown render bozulursa (frontmatter format) | Skill kendi çıktısını YAML parse ile doğrular; başarısız olursa kullanıcıyı uyarır, dosyayı bozmaz |

## Açık Sorular

- **Bulk üretim maliyeti**: ~3200 madde × 12K output token = 38M token. Sonnet ~$575, Opus ~$2900. Bu, bulk üretim alt-projesinde tartışılacak.
- **Pilot sonrası "draft" review akışı**: Site'de `commentaryStatus: "draft"` olan içerikler için özel görsel/uyarı eklensin mi? Bu spec kapsamı dışı, ayrı UI iyileştirmesi.
- **Versiyon/revizyon takibi**: Yeni Yargıtay kararı veya kanun değişikliği olduğunda eski yoruma müdahale gerekir. Bu spec'in dışı — `lastReviewed` alanı temel atıyor, ileride workflow yazılabilir.

## Risk Değerlendirmesi

| Risk | Olasılık | Etki | Azaltma |
|---|---|---|---|
| Skill uydurma Yargıtay künyesi üretir | Düşük (sert kurallar var) | Çok yüksek (avukat itibarı) | `hukuki-halusinasyon-onleme` skill kombinasyonu + her kararın scraper kaynaklı olması zorunlu |
| Yanlış yazara yanlış görüş atfı | Orta | Yüksek (akademik itibar) | Yazar+eser bazlı atıf, sayfa yok; tartışmalı konularda atıfsız genel ifade |
| Yorumlar tutarsız/farklı kaliteli olur | Orta | Orta (kullanıcı deneyimi) | Sabit şablon, sabit yazar listesi, sabit halüsinasyon kuralları skill içinde |
| Bulk üretimde token maliyeti fazla | Yüksek | Yüksek (parasal) | Pilot sonrası tartışılır; günde 5-10 madde temposunda yıllara yayılabilir |
| Yargıtay sitesi 2-3 ay gecikmeli → güncel karar yok | Yüksek (skill notunda var) | Orta | Skill kullanıcıyı uyarır, AYM/HUDOC + manuel yapıştırma fallback |
| Madde dosyalarında format bozulması | Düşük | Yüksek (render kırılır) | Skill YAML+markdown parser ile çıktı doğrular, başarısızsa yazmaz |
| Skill bulk üretimde tutarsız çıktı verir (1000. maddeyle 1. arası fark) | Orta | Orta | Pilot 3 madde + ilk 20 maddeden örnek inceleme; gerekirse skill parametre ayarı |
