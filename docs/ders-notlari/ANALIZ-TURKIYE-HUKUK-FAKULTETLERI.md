# Türkiye Hukuk Fakülteleri ve Sınav Sistemleri — Derin Analiz

**Tarih:** 2026-07-29  
**Amaç:** Ücretsiz, üniversite bazlı hukuk ders notları projesinin veri zemini  
**Kaynak notu:** Sayılar YÖK Atlas / ÖSYM / açık raporlara dayanır; kesin kontenjan için o yılın kılavuzu esas alınmalıdır.

---

## 1. Yönetici özeti

| Soru | Kısa cevap (2024–2025 bandı) |
|------|------------------------------|
| Türkiye’de aktif hukuk fakültesi kaç? | Kabaca **80–85** aktif (devlet ~45 + vakıf ~38); kaynaklar **83–84** bandında |
| Toplam “hukuk programı” (burslu/ücretli satırlar) | Tercih kılavuzunda **100+** satır (aynı fakültenin farklı kontenjan kodları) |
| KKTC + yurt dışı satırlar | ~9–11 ek program (bu projede **öncelik TR kampüsleri**) |
| Eğitim süresi | **4 yıl** lisans (240 AKTS hedefi, Bologna) |
| Sınav sistemi | Fakülte bazında **dönemlik** (çoğunluk) veya **yıllık**; ara sınav + final + bütünleme |
| Proje kapsamı (ideal) | ~80 fakülte × ~28–36 ders = **~2.200–2.900** not paketi |
| Gerçekçi üretim | **30 gün** dalgalar halinde; önce çekirdek dersler + SEO hub’lar |

**Kritik dürüstlük notu:** “Her üniversitede o an görev yapan her hocanın birebir slayt kopyası” hem hukuken (telif) hem fiilen imkânsızdır. Hedef: **müfredat + sınav formatı + o fakültenin kamu müfredatına uyumlu, akademik seviyede orijinal ders notu**; hoca isimleri yalnızca kamuya açık müfredat/duyuru ile doğrulanabildiğinde eklenir.

---

## 2. Sayısal envanter (kaynak sentezi)

### 2.1 Fakülte sayısı

| Kaynak tipi | TR sayısı (yaklaşık) | Not |
|-------------|----------------------|-----|
| 2024 tercih / Türkiye Hukuk derlemesi | **83** TR (+ KKTC/diğer) | 45 devlet + 38 vakıf |
| 2025 YKS yerleştirme yorumları | **84** fakülteye yerleşim | Genel kontenjan ~9.291 öğrenci (bir yorum) |
| 2026 tercih kılavuzu ön bilgi | Program satırı sayısı yüksek | Burslu/%50/ücretli ayrımı şişirir |
| Toplum.org.tr rapor (2026) | Kuruluş dalgası 2001–2026’da yoğun | Yeni fakülteler + pasifler |

**Çalışma varsayımı (bu repo):**  
`TR_ACTIVE_LAW_FACULTIES ≈ 82` (aktif eğitim veren, SEO hedefi yüksek olanlar listede).

### 2.2 Devlet / vakıf

- **Devlet:** klasik kamusal müfredat, Türkçe ağırlıklı, büyük sınıflar, klasik yazılı sınav kültürü.  
- **Vakıf:** daha sık **%30 İngilizce**, daha küçük kontenjan, ara sınav ağırlığı ve sunum/ödev bileşeni sık.  
- **Galatasaray / Fransızca izlenceler:** dil + mehaz (Fransız) odaklı fark.  
- **İngilizce ağırlıklı (Bilkent, Koç, Özyeğin vb.):** case / comparative / İngilizce kaynak okuma.

### 2.3 Öğrenci ve baraj

- Başarı sırası barajı yıllara göre değişir (ör. tartışmalarda **125 bin** bandı anılır); güncel YÖK duyurusu esas.  
- Kontenjan daralması 2025’te bazı devlet fakültelerinde gündem oldu (kamuya açık yorumlar).  
- Proje SEO’su: “X Üniversitesi hukuk ders notları” long-tail’i **yerleşik marka aramalarından** beslenir (AYBÜ, Marmara, İstanbul, Ankara…).

---

## 3. Sınav ve ölçme-değerlendirme sistemleri (detay)

### 3.1 Takvim modelleri

| Model | Yapı | Kimlerde sık? | Not üretimi |
|-------|------|---------------|-------------|
| **Dönemlik (semestrial)** | Güz + bahar; her dönem ayrı ders kodu | Çoğu fakülte | Not: `guz` / `bahar` paketleri |
| **Yıllık** | Tüm yıl tek ders, tek final ağırlığı | Bazı klasik programlar / eski usul kalıntılar | Not: `yillik` paket; ara sınav yine olabilir |
| **Karma** | 1–2. sınıf yıllık, üst sınıflar dönemlik | Nadir | Müfredat dosyasında bayrak |

### 3.2 Not bileşenleri (tipik aralıklar)

| Bileşen | Tipik ağırlık | Açıklama |
|---------|---------------|----------|
| Ara sınav (vize) | %20–40 | Çoktan seçmeli / klasik / karma |
| Final | %40–60 | Klasik uzun cevap hâkim |
| Bütünleme | Final yerine / onarımı | Takvim fakülte yönetmeliği |
| Ödev / sunum / katılım | %0–20 | Vakıf + seminer derslerinde |
| Pratik / dilekçe | %0–30 | Usul, icra, arabuluculuk |

**Not yazım standardımız:** Her notta “Bu fakültede tipik ölçme” kutusu: vize/final oranı, klasik vs test, sözlü ihtimali, staj bağlantısı.

### 3.3 Bologna / AKTS

- Lisans: genelde **240 AKTS**.  
- Ders yükü: dönem başına ~30 AKTS.  
- Seçmeli havuz: 3–4. sınıfta genişler (insan hakları, bilişim, enerji, spor hukuku…).  
- **Çekirdek (zorunlu) ders seti** hemen her fakültede ortaktır; **sıra ve birleştirme** fakülteye göre değişir  
  (ör. “Medeni Hukuk I–II” vs “Kişiler + Aile ayrı”).

### 3.4 Fakülte tipleri (içerik tonu)

1. **Klasik dogmatik (Ankara, İstanbul, Marmara, DEÜ…):** madde + şerh + Yargıtay.  
2. **Karşılaştırmalı / dil ağırlıklı (GSÜ, Bilkent, Koç…):** mehaz + İngilizce/Fransızca.  
3. **Uygulama / klinik vurgusu:** dilekçe, simülasyon, staj defteri.  
4. **Yeni kurulmuş fakülteler:** YÖK çekirdek + hoca havuzuna göre dalgalı müfredat.

---

## 4. Çekirdek hukuk müfredatı haritası (not üretilecek dersler)

Aşağıdaki liste “Türkiye’de hukuk fakültelerinde okutulan temel dersler” çekirdeğidir.  
Seçmeliler dalga 3’te.

### 4.1 1. sınıf (genel olarak)

| Kod | Ders | SEO örnek sorgu |
|-----|------|-----------------|
| giris-hukuk | Hukuka Giriş / Hukukun Temel Kavramları | `ankara hukuk hukuka giriş ders notu` |
| anayasa-1 | Anayasa Hukuku I (genel esaslar) | `yıldırım beyazıt anayasa ders notları` |
| roma | Roma Hukuku | `marmara roma hukuku notları` |
| medeni-baslangic | Medeni Hukuka Giriş / Başlangıç Hükümleri | `istanbul üniversitesi medeni hukuk not` |
| iktisat | İktisat (hukukçular için) | |
| sosyoloji | Sosyoloji / Hukuk Sosyolojisi | |
| ati | Atatürk İlkeleri ve İnkılap Tarihi | |
| yabanci-dil | Yabancı Dil / Hukuk İngilizcesi | |

### 4.2 2. sınıf

| Kod | Ders |
|-----|------|
| borclar-genel | Borçlar Hukuku Genel Hükümler |
| aile | Aile Hukuku |
| ceza-genel | Ceza Hukuku Genel Hükümler |
| idare-1 | İdare Hukuku |
| milletlerarasi-genel | Milletlerarası Hukuk |
| ticaret-giris | Ticaret Hukukuna Giriş / Ticari İşletme |
| kamu-maliyesi | Kamu Maliyesi / Vergi Giriş (fakülteye göre) |

### 4.3 3. sınıf

| Kod | Ders |
|-----|------|
| borclar-ozel | Borçlar Hukuku Özel Hükümler |
| esya | Eşya Hukuku |
| ceza-ozel | Ceza Hukuku Özel Hükümler |
| medeni-usul | Medeni Usul Hukuku |
| is-hukuku | İş ve Sosyal Güvenlik Hukuku |
| vergi | Vergi Hukuku |
| ceza-usul | Ceza Muhakemesi Hukuku |
| idari-yargi | İdari Yargılama Hukuku |

### 4.4 4. sınıf

| Kod | Ders |
|-----|------|
| miras | Miras Hukuku |
| ticaret-sirketler | Ticaret Şirketleri |
| kiymetli-evrak | Kıymetli Evrak |
| icra-iflas | İcra ve İflas Hukuku |
| ozel-hukuk-secmeli | Seçmeli özel hukuk paketi (şablon) |
| kamu-secmeli | Seçmeli kamu hukuku paketi |
| mezuniyet-seminer | Bitirme / seminer |

**Çekirdek ders sayısı (v1):** **28 zorunlu + 8 seçmeli şablon = 36 ders iskeleti.**

---

## 5. “Üniversiteye özel” ne demek? (kalite standardı)

Her not paketinde zorunlu bloklar:

1. **Fakülte kimliği:** resmi ad, şehir, devlet/vakıf, dil, dönemlik/yıllık.  
2. **Ders kimliği:** olası ders adları (fakültede “Borçlar I” vs “TBK Genel”).  
3. **Öğrenme çıktıları** (AKTS dili).  
4. **Kavram haritası** (SVG diyagram).  
5. **Madde omurgası** (TMK/TBK/TCK… numaraları).  
6. **İşlenmiş örnek olay** (≥3).  
7. **Şema / tablo / akış** (≥2 görsel).  
8. **Sınav tekniği:** klasik cevap iskeleti, sık hata, zaman yönetimi.  
9. **Yargıtay / Anayasa Mahkemesi** örnek başlıkları (doğrulanabilir).  
10. **PDF indirme** (aynı içerik, basılabilir CSS).  
11. **Yasal uyarı:** bilgilendirme / ders desteği; resmi müfredatın yerine geçmez.  
12. **Kaynakça disiplini:** ders kitabı türleri (genel eser) — hoca slaytı kopyalanmaz.

**Kalite eşiği (minimum):**  
- HTML not gövdesi ≥ **3.500 kelime** (çekirdek ders)  
- FAQ ≥ 8  
- Örnek olay ≥ 3  
- En az 1 süreç diyagramı + 1 karşılaştırma tablosu  
- PDF üretirken bozulmayan başlık hiyerarşisi  

**Rezil etmeme kuralı:** Otomatik şablon cümle yasağı (vatandaş rehberindeki spam filtreleri burada da geçerli); her ders motoru **ders bankası + fakülte parametreleri** ile çeşitlenir.

---

## 6. SEO mimarisi (ana sayfada YOK)

### 6.1 URL’ler

```
/ders-notlari                          → hub (dizin, ana menüde yok veya footer “öğrenci”)
/ders-notlari/{uni-slug}               → “Ankara Yıldırım Beyazıt hukuk ders notları”
/ders-notlari/{uni-slug}/{ders-kodu}   → “AYBÜ medeni hukuk ders notu”
/ders-notlari/{uni-slug}/{ders}/pdf    → indirilebilir PDF (print CSS veya sunucu PDF)
```

### 6.2 Title örnekleri

- `Ankara Yıldırım Beyazıt Hukuk Ders Notları (Ücretsiz) | Av. Fethi Güzel`  
- `AYBÜ Borçlar Hukuku Genel Hükümler Ders Notu — Örnekli & Şematik`  
- `Marmara Üniversitesi İcra İflas Ders Notları PDF`

### 6.3 Sitemap

- `public/ders-notlari-sitemap.xml` (ayrı; robots’a eklenir)  
- Ana sayfa Hero/Navbar’da **listelenmez** (SEO deep analysis: ana sayfa şişmesin).  
- İç link: `/akademik-profil`, `/mevzuat`, ilgili `/bilgi` sayfaları.

### 6.4 Risk (scaled content)

SEO deep analysis’teki uyarı geçerli:  
**82 uni × 36 ders** programatik üretilirse Google “scaled content” riski doğar.  
Bu yüzden:

- Önce **hub + fakülte sayfaları** (yüksek kalite)  
- Ders notları **dalga dalga**, her dalgada insan kalite kontrolü  
- Aynı gövdeyi 82 kez kopyalamak **yasak**; fakülte parametresi + örnek seti + sınav kutusu zorunlu varyasyon  

---

## 7. Otuz günlük üretim planı (bir aya yayılmış)

| Hafta | Çıktı | Hedef |
|-------|--------|--------|
| **Hafta 1** | Altyapı + analiz + 10 fakülte hub + 5 çekirdek ders × 3 fakülte | SEO iskelet canlı |
| **Hafta 2** | 25 fakülte hub + borçlar/medeni/ceza/usul derin notlar | ~40 derin not |
| **Hafta 3** | 50 fakülte hub + icra/ticaret/iş/vergi | ~80 derin not |
| **Hafta 4** | Kalan fakülte hub’ları + PDF pipeline + kalite gate | 82 hub + 120+ derin not |
| **Ay 2+** | Kalan dersler (seçmeli dahil), hoca doğrulama, güncelleme | tam kapsama |

**Günlük tempo (hedef):** 4–6 derin not **veya** 8–10 fakülte hub (hub daha hafif).  
**Kalite gate script:** kelime, diyagram, örnek, spam phrase, fakülte adı geçişi.

---

## 8. Telif, etik ve TBB reklam yasağı

- Ücretsiz eğitim materyali; **ticari vaat yok**.  
- Hoca slaytı / fotokopi PDF **yüklenmez**.  
- “Kesin geçme garantisi” **yok**.  
- Kaynak: kanun metni (mevzuat.gov.tr), açık erişim içtihat özetleri, genel doktrin bilinci.  
- Kişisel veri: öğrenci yorumları toplanmaz (en azından v1).

---

## 9. Teknik yığın (repo)

| Parça | Görev |
|-------|--------|
| `lib/ders-notlari/types.ts` | Tipler |
| `lib/ders-notlari/universiteler.ts` | 82 fakülte kaydı |
| `lib/ders-notlari/mufredat.ts` | 36 ders iskeleti |
| `scripts/generate-ders-notlari.mjs` | İçerik üretimi |
| `scripts/ders-notlari-quality-gate.mjs` | Kalite eşiği |
| `app/ders-notlari/**` | Sayfalar |
| `public/ders-notlari-sitemap.xml` | SEO |
| `public/ders-notlari-pdf/**` | PDF çıktıları (üretim sonrası) |

---

## 10. Sonuç

1. TR’de **~82–84 aktif hukuk fakültesi** bandı gerçekçi çalışma evrenidir.  
2. Sınav sistemleri **çoğunlukla dönemlik**; vize+final+bütünleme omurgası ortaktır; detay fakülte yönetmeliğine bağlanır.  
3. “Her hoca birebir” iddiası yerine **müfredat + sınav formatı + orijinal derin not** doğru hedeftir.  
4. 30 günde **tüm dersler × tüm fakülteler** tek seferde bitmez; biten kısım **hub + çekirdek ders dalgaları** ile utandırmayacak kalitede olmalı.  
5. SEO: ana sayfada yok; “{üniversite} hukuk ders notları” long-tail’i fakülte hub title’larında.

*Bu belge proje anayasasıdır; üretim ilerledikçe tarihçeye commit notu düşülür.*
