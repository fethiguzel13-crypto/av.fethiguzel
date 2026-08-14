# Av. Fethi Güzel — Hukuk Uygulama Ekosistemi (Strateji & Beyin Fırtınası)

**Durum:** Play Store kaydı yok → şimdilik uygulama üretimi / mimari / içerik.  
**İlke:** Her uygulama tek başına bütün; hepsi birlikte bir platform.  
**Hedef dil:** Tüm uygulamalarda çok dilli (i18n-first).  
**Tarih:** 2026-08-14

### Kilit kararlar (2026-08-14 — onaylandı)

| Konu | Karar | Gerekçe |
|------|--------|---------|
| Model | **Hukuk Galaxy** (çok uygulama) | Clio ailesi / Workspace modeli; mağaza + zihin yükü |
| Teknik | **Tek içerik beyni (portal) + flavor kabuklar** | Bakım patlamaz; UYAP/Lexis de “tek kaynak” |
| İlk dalga | Portal · Hesap · İçtihat · Rehber | Viral + Pro + vatandaş üçgeni |
| Dil sırası | **TR → EN → DE → FR → AR** | Kullanıcı kararı; global App Store EN önce |
| SSO / kimlik | Fethi ID (sonraki sprint) | Singapur/Baltık tek kimlik dersi |
| Para | Freemium + Pro + randevu lead | Rocket Lawyer + yerel ofis |
| Play | Şimdilik APK üret; hesap sonra | Kullanıcı kararı |

Kod omurgası: `mobile/galaxy/` + `lib/galaxy/` + `locales/`.

---


## 1) Dünyadan ne öğreniyoruz?

### ABD / Anglo-Sakson (para + ölçek)

| Oyuncu | Ne satıyor? | Ders |
|--------|-------------|------|
| **Clio** | Büro yönetimi (dosya, süre, tahsilat) + mobil | Avukatın cebindeki “ofis OS”i |
| **Clio + vLex (~$1B)** | Yönetim + küresel araştırma birleşti | Araştırma ile yönetim birleşince kategori değişir |
| **Lexis+ / Thomson Reuters** | İçtihat + AI asistan (Protégé vb.) | Güven = kaynak + atıf; “uydurma madde” = ölüm |
| **Rocket Lawyer** | Tüketici belge + insan avukata erişim | Freemium + “gerçek avukat” yedek katmanı |
| **DoNotPay** | Tüketici robot avukat iddiası | **FTC cezası:** “avukatın yerine geçer” iddiası riskli |

**Alınacak:** Platform düşüncesi, mobil-first avukat araçları, AI + insan yedek.  
**Alınmayacak:** “Robot avukat / dava kazanırsınız” vaadi.

### Almanya / AB (erişim + regülasyon)

| Model | Ders |
|-------|------|
| **service.justiz.de** (dava yardımı, icra, miras belgesi vb.) | Vatandaş akışları adım adım, resmi dilde sade |
| **Legal Tech** (Flightright tipi mass claim, AB hukuku) | Dar niyet + ölçeklenebilir form + avukat ağı |
| Dijital “Rechtsantragsstelle” vizyonu | Mahkeme öncesi netleştirme + belge toplama |

**Alınacak:** Vatandaş yol haritası (hangi merci, hangi belge, hangi süre).  
**Alınmayacak:** Resmi UYAP’ın kopyası; tamamlayıcı ol.

### Singapur / Baltık / Estonya (devlet dijitali)

- Tek kimlik, tek dosya, uçtan uca dijital hizmet.  
- **Alınacak:** SSO + “bir hesap, tüm uygulamalar”.  
- Türkiye’de devlet kapısı UYAP/e-Devlet; biz **vatandaş + avukat + öğrenci** katmanında oynarız.

### Türkiye (boşluk haritası)

| Var olan | Zayıf nokta |
|----------|-------------|
| **UYAP Mevzuat** (ücretsiz, resmi) | UX, mobil zevk, rehberlik, hesaplama, dil |
| **mevzuat.ai / Apilex / LawChat** | Avukat AI; vatandaş dili zayıf veya ücretli |
| **Kamu siteleri** (mevzuat.gov, Yargıtay) | Parçalı, mobil-dostu değil |
| **Genel ChatGPT** | Halüsinasyon; Türk hukuku atıf riski |

**Boşluk:**  
1) Vatandaş dilinde “ne yapmalıyım?”  
2) Avukat için hızlı hesap + şablon + süre takibi  
3) Öğrenci / stajyer için not + soru  
4) Bölgesel (Van–Erciş) güven + randevu  
5) **Uygulamalar arası** tek hesap / tek favori / tek arama  
6) **Çok dil** (TR + EN + AR + KU + RU + DE — göç, turizm, yatırım)

---

## 2) Büyük fikir: “Hukuk Super App” değil — **Hukuk Galaxy**

Tek dev uygulama şişer, mağaza algoritması ve zihin yorar.  
**Galaxy modeli** (Apple Health / Google Workspace / Clio ailesi):

```
                    ┌─────────────────────┐
                    │  Fethi ID (SSO)      │
                    │  Ortak favoriler     │
                    │  Ortak arama API     │
                    │  Ortak i18n / KVKK   │
                    └──────────┬──────────┘
           ┌───────────────────┼───────────────────┐
           ▼                   ▼                   ▼
    [Portal App]         [Hesaplama]          [İçtihat]
     hub / hub            calculator           case-law
           │                   │                   │
           ▼                   ▼                   ▼
    [Vatandaş]            [Dilekçe]            [Arabulucu]
     guide-flow            petition             mediation
           │                   │                   │
           ▼                   ▼                   ▼
    [Öğrenci]             [Büro]               [Bölge]
     study                 practice             local
```

**Her uygulama:**
- Tek başına App Store kalitesinde (onboarding, boş durum, hata, çevrimdışı, erişilebilirlik)
- Deep link ile diğerine “devam et”
- Aynı marka dili, aynı yasal uyarı şablonu
- Tüm dillerde aynı özellik seti (çeviri sonradan eklenmez — i18n-first)

---

## 3) Milyon dolarlık uygulamalar (öneri kataloğu)

> “Milyon dolar” = yüksek LTV + düşük CAC + tekrar kullanım + B2C + B2B karışımı.  
> Hepsi **bilgilendirme**; vekâlet/resmi tavsiye iddiası yok.

### A) Çekirdek (Phase 0–1) — zaten içerik var

| # | Uygulama (çalışma adı) | Paket önerisi | Kim için? | Para | Etkileşim |
|---|------------------------|---------------|-----------|------|-----------|
| 1 | **Hukuk Portalı** (mevcut) | `com.avfethiguzel.hukuk` | Herkes | Freemium / marka | Hub: herkese deep link |
| 2 | **Hukuki Hesap** | `…hesap` | Avukat, vatandaş | Pro abonelik | Sonucu → Dilekçe’ye aktar |
| 3 | **Günlük İçtihat** | `…icthat` | Avukat, öğrenci | Push + Pro | Karar → Mevzuat maddesine atla |
| 4 | **Vatandaş Rehberi** | `…rehber` | Vatandaş | Ücretsiz + lead | “Hesapla” / “Dilekçe taslağı” |

### B) Yüksek değer (Phase 2)

| # | Uygulama | Fikir | Dünya eşi | Para |
|---|----------|-------|-----------|------|
| 5 | **Süre & Tebligat Takip** | Dava/tebligat tarihleri, hatırlatma, HMK süre hesap | Clio calendar + Alman “Fristen” | B2B abonelik |
| 6 | **Dilekçe Atölyesi** | UDF/PDF şablon, alan doldur, risk uyarısı | Rocket Lawyer (TR şablon) | Belge başı / Pro |
| 7 | **Arabuluculuk Asistanı** | Tutanak iskeleti, süre, anlaşma kontrol listesi | Niche TR (zorunlu arabuluculuk) | Avukat Pro |
| 8 | **İşçi–İşveren Hesap Paketi** | Kıdem, ihbar, fazla mesai, AGİ, işe iade | Alman Lohnrechner + TR iş hukuku | Viral B2C |
| 9 | **Tüketici Koruma** | Cayma, ayıp, banka/e-ticaret şikâyet akışı | DoNotPay *ama yasal uyumlu* | Lead + Pro |
| 10 | **Kira & Kat Mülkiyeti** | Kira artışı, tahliye, aidat, KMK | AB tenant tools | B2C freemium |

### C) Platform / marka (Phase 3)

| # | Uygulama | Fikir | Para |
|---|----------|-------|------|
| 11 | **Öğrenci Hukuk** | Ders notu, flashcard, yeterlik sorusu | Uni abonelik / reklam |
| 12 | **Büro Cep** | Müvekkil kartı, randevu, not, tahsilat linki | SaaS |
| 13 | **Van–Erciş Hukuk** | Ofis, randevu, yerel rehber, harita | Lead generation |
| 14 | **Çeviri & Yabancı** | TR belge özeti EN/AR; yabancılar için | Turizm / yatırım |
| 15 | **KVKK & Şirket Mini Uyum** | Aydınlatma metni, envanter checklist | KOBİ abonelik |

### D) “Ayırıcı silah” fikirler (farklılaşma)

1. **Karar Atlası:** Bir Yargıtay kararını haritada “hangi maddeler, hangi ilkeler, lehe/aleyhe” grafiği — Lexis hissi, TR verisi.  
2. **Dosya Hikâyesi:** Kullanıcı 5 soruya cevap verir → zaman çizelgesi + merci + belge listesi (Alman service.justiz sadeleştirme).  
3. **Çift dilli duruşma cepleri:** Mahkemede sık kullanılan cümleler TR↔EN/AR (yabancı taraf).  
4. **Avukat marketplace (dikkatli):** Randevu + alan seçimi; **asla** “garanti sonuç”.  
5. **Offline kanun paketi:** TBK/TMK/TCK paket indir; uçakta / köyde çalışır.  
6. **Sesli soru (TR):** “Kıdem nasıl hesaplanır?” → hesap uygulamasına deep link (Lexis voice AI trendi, ama iddiasız).  
7. **Aile / velayet / nafaka simülatörü:** Duygusal niyet yüksek, paylaşım yüksek.  
8. **İcra mini:** Takip yolu şeması + harç hesabı (TR’de acı nokta).

---

## 4) Uygulamalar arası etkileşim (zorunlu tasarım)

### Ortak omurga (bir kez yaz, her uygulamada kullan)

| Katman | Ne? |
|--------|-----|
| **Fethi ID** | Google / e-posta / misafir; JWT; tüm uygulamalarda SSO |
| **Content API** | Mevzuat, şerh, kavram, içtihat özeti, hesap motoru |
| **Deep Links** | `https://www.avfethiguzel.com/...` + `avfethiguzel://app/…` + App Links |
| **Cross-app intents** | `avfethiguzel://hesap/kidem?ucret=…` → Hesap uygulaması |
| **Paylaşım kartı** | Ortak OG + “şundan aç” butonları |
| **Favoriler & Geçmiş** | Tek bulut senkron |
| **i18n** | `next-intl` / JSON katalog; dil tercihi hesaba yazılır |
| **Yasal şablon** | Her ekranda aynı disclaimer bileşeni |
| **Analitik** | Ortak olay isimleri (`open_article`, `calc_run`, `export_udf`) |

### Örnek kullanıcı yolculuğu (ekosistem büyüsü)

1. **Vatandaş Rehberi:** “İşten çıkarıldım”  
2. → **Hesap:** kıdem / ihbar  
3. → **Dilekçe:** arabuluculuk başvurusu taslağı  
4. → **İçtihat:** benzer Yargıtay özetleri  
5. → **Portal / Bölge:** “Erciş’te randevu”  
Tek hesap, tek favori listesi, her adımda “diğer uygulamada aç”.

---

## 5) Her uygulama “mükemmel” checklist (Play öncesi üretim standardı)

Bir uygulama “hazır” sayılmaz, ta ki:

- [ ] 30 sn’de ilk değer (aha moment)  
- [ ] Boş / hata / çevrimdışı durumlar  
- [ ] Safe-area, geri tuşu, deep link  
- [ ] TR + EN en az (sonra AR, KU, DE, RU)  
- [ ] Erişilebilirlik (font scale, contrast, screen reader etiketleri)  
- [ ] Yasal uyarı + gizlilik linki  
- [ ] Performans: soğuk açılış &lt; 2 sn hissi (kabuk + cache)  
- [ ] Mağaza varlıkları: ikon, feature graphic, 6 ekran görüntüsü (çok dil)  
- [ ] Otomatik test: en az smoke (hesap doğru mu, link kırık mı)  
- [ ] Diğer galaxy uygulamalarına en az 2 deep link  

---

## 6) Çok dil stratejisi (tüm uygulamalar)

| Öncelik | Dil | Neden |
|---------|-----|--------|
| P0 | Türkçe | Ana pazar |
| P0 | İngilizce | Yatırımcı, yabancılar, App Store global |
| P1 | Arapça | Bölge + sığınmacı / ticaret |
| P1 | Kürtçe (Kurmanci) | Van–Erciş gerçekliği, erişim adaleti |
| P2 | Almanca / Rusça | Yatırım, turizm, ikili evlilik |

**Teknik:**  
- UI string’leri kodda değil, `locales/*.json`  
- Hukuki metin: resmi madde metni dilde sabit (TR kanun); **açıklama** çevrilir  
- RTL (Arapça) layout testi zorunlu  
- Sayı/tarih: `Intl` (tr-TR, en-GB, ar-IQ…)

---

## 7) Para modeli (dürüst)

| Katman | Ücretsiz | Ücretli |
|--------|----------|---------|
| İçerik | Mevzuat okuma, rehber, günlük 1 içtihat | Derin şerh, sınırsız içtihat, PDF |
| Araç | 3 hesaplama / gün | Sınırsız + geçmiş + export |
| Belge | Önizleme | UDF/PDF indir |
| Büro | 1 müvekkil | Çoklu + takvim + marka |
| Lead | — | “Avukata sor” randevu (Van–Erciş + ağ) |

**Yasak (marka koruma):** “Mahkemede kazanırsınız”, “resmi avukat yerine geçer”, uydurma madde.

---

## 8) Teknik üretim hattı (Play kaydı olmadan)

1. **Monorepo veya multi-package:** `apps/*` + `packages/shared`  
2. **Mevcut portal = content brain** (Next.js zaten var)  
3. **Her uygulama = ince Capacitor kabuk** VEYA tek kod tabanında product flavor  
4. **Öneri A (hız):** Tek codebase, birçok `applicationId` + flavor (hesap, icthat, rehber…)  
5. **Öneri B (mağaza netliği):** Ayrı paketler, paylaşılan npm paketleri  
6. **CI:** GitHub Actions AAB artifact (imzasız debug APK şimdilik)  
7. **Dahili test:** Firebase App Distribution / doğrudan APK — Play’siz  

**Şimdilik önerilen karar:**  
- **Flavor mimarisi** ile 4 uygulama iskeleti (Portal, Hesap, İçtihat, Rehber)  
- Ortak `packages/ui`, `packages/i18n`, `packages/api-client`  
- APK’ları yerelde üret; mağaza sonra  

---

## 9) Yol haritası (90 gün, mağazasız)

| Hafta | Çıktı |
|-------|--------|
| 1 | Ekosistem kararı + isimlendirme + paket adları + marka kit |
| 2 | Shared i18n + Fethi ID iskeleti + deep link sözleşmesi |
| 3–4 | **Hesap** uygulaması (mevcut motoru paketle) — TR/EN |
| 5–6 | **İçtihat** uygulaması (günlük + arama) |
| 7–8 | **Rehber** (vatandaş akışları, 20 niyet) |
| 9 | Cross-app deep link’ler + favori senkron |
| 10–12 | Dilekçe Atölyesi MVP + AR dil iskeleti |

---

## 10) İsim / marka ailesi (taslak)

| Ürün | TR adı | EN adı |
|------|--------|--------|
| Hub | Av. Fethi Güzel | Fethi Güzel Law |
| Hesap | Hukuki Hesap | Legal Calc TR |
| İçtihat | İçtihat Günü | Case Law Daily |
| Rehber | Vatandaş Hukuku | Citizen Law TR |
| Dilekçe | Dilekçe Atölyesi | Petition Studio |
| Süre | Süre Defteri | Deadline Book |
| Arabulucu | Arabulucu Defter | Mediation Desk |

Tek logo ailesi, farklı accent renk; mağazada “geliştirici: Av. Fethi Güzel / avfethiguzel.com”.

---

## 11) Riskler

| Risk | Önlem |
|------|--------|
| Halüsinasyon / yanlış madde | AI çıktıda zorunlu kaynak + “kontrol edin” |
| Avukatlık tekel / reklam kuralları | Bilgi + randevu; sonuç vaadi yok |
| UYAP rekabeti | Resmi kaynağı tamamla, UX ve rehberde yen |
| 15 uygulama bakımı | Shared core; özellik = config |
| Çok dil maliyeti | Önce UI; hukuki açıklama AI+editör |

---

## 12) Karar bekleyenler (kullanıcı)

1. Galaxy mı, tek super-app mı? → **Öneri: Galaxy**  
2. İlk 4 uygulama hangileri? → **Öneri: Portal, Hesap, İçtihat, Rehber**  
3. Flavor (tek proje) mı, ayrı repo paketleri mi? → **Öneri: monorepo + flavor**  
4. İlk ikinci dil EN mi AR mı? → **Öneri: EN**  
5. B2C mi B2B mi önce? → **Öneri: B2C viral hesap + B2B süre/defter**  

---

*Bu belge canlı stratejidir; uygulama iskeletleri onaydan sonra `apps/` altına üretilir.*
