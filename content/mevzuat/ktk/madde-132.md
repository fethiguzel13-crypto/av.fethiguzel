---
title: "Karayolları Trafik Kanunu Madde 132"
kanun: "Karayolları Trafik Kanunu"
maddeNo: 132
commentaryStatus: "completed"
lastReviewed: "2026-06-02"
wordCount: 1100
keywords: ["Bilgi İşlem Merkezi", "Pol-Net Sistemi", "Sürücü Sicili", "Araç Tescil Sicili", "KVKK Entegrasyonu", "Veri Güvenliği", "İstatistiki Veri Üretimi"]
---

**Bilgi işlem merkezinin faaliyeti**

---

Madde 132 – Araçların, sürücülerin ve trafik suçu işleyenlerin sicilleri, bunlara ait
hukuki ve teknik değişiklikler ile diğer gerekli ve istatistiki bilgilere ait kayıtlar ve hizmetler
Emniyet Genel Müdürlüğü bünyesindeki Bilgi İşlem Merkezi tarafından tutulur ve yürütülür.

### Akademik Yorum ve Analiz

#### 1. Trafik Sicil Veritabanının Hukuki Altyapısı: POL-NET ve EGM Tekel Yetkisi
Karayolları Trafik Kanunu’nun 132. maddesi, Türkiye genelinde trafiğe çıkan tüm araçların, tüm ehliyetli sürücülerin ve trafik suçu/kabahati işleyen kişilerin sicil kayıtlarının tek bir merkezde toplanmasını emreden **kamu veri tabanı hukuku** normudur.
*   **Münhasır Yetkili (EGM Bilgi İşlem):** Kanun koyucu, bu hassas ve stratejik verilerin saklanması, işlenmesi ve yönetilmesi görevini **Emniyet Genel Müdürlüğü (EGM) Bilgi İşlem Dairesi Başkanlığı'na (POL-NET)** vermiştir.
*   **Sicil Kayıtlarının Türleri:** Bu veri tabanında üç ana sicil tutulur:
    1.  **Araç Tescil Sicili:** Aracın şasi numarası, teknik özellikleri, üzerinde kurulu haciz, rehin veya hak mahrumiyeti şerhleri.
    2.  **Sürücü Sicili:** Ehliyet sınıfları, kazanılmış haklar, sağlık raporu yenileme süreleri.
    3.  **Trafik İhlal ve Ceza Sicili:** Sürücülerin geçmişe dönük ceza puanları, alkol/drift vb. nedenlerle geçici el koyma geçmişleri, kesinleşen idari para cezaları.

#### 2. KVKK (Kişisel Verilerin Korunması Kanunu) ve Veri Güvenliği Boyutu
EGM Bilgi İşlem Merkezi'nin tuttuğu bu kayıtlar, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında **"özel nitelikli kişisel veri"** ve genel kişisel veri niteliğindedir.
*   **İstisnalar ve Veri Paylaşımı (KVKK m. 28):** KVKK'nın 28. maddesi uyarınca, milli güvenlik, kamu düzeni ve suç işlenmesinin önlenmesi amacıyla devletin yürüttüğü bu kayıt faaliyetleri KVKK'nın mutlak denetiminden kısmen istisna tutulmuştur. Ancak bu durum, verilerin keyfi paylaşımına izin vermez.
*   **Entegrasyon Sınırları:** EGM veritabanı, adli makamlarla (savcılıklar, mahkemeler), e-Devlet kapısıyla, Gelir İdaresi Başkanlığı (ceza tahsilatları için) ve sigorta şirketleri (SBM - Sigorta Bilgi ve Gözetim Merkezi üzerinden risk analizi ve poliçe prim tespiti için) ile son derece sıkı güvenlik ve şifreleme protokolleri (API entegrasyonları) altında paylaşılır.

#### 3. Pratik Örnek Olay ve Hukuki Analiz
**Olay:**
Özel bir sigorta şirketi, yeni bir kasko poliçesi düzenleyeceği müşteri (P)'nin risk profilini belirlemek amacıyla, (P)'nin geçmişe dönük tüm trafik kazaları, alkollü sürüş cezaları ve hız sınırı ihlali sicil dökümünü doğrudan EGM Bilgi İşlem Merkezi'nden çekmek istemiştir. EGM, (P)'nin açık rızası olmaksızın bu detaylı ihlal sicilinin üçüncü taraflarla doğrudan paylaşılmasının hukuka aykırı olduğunu belirterek talebi reddetmiştir. Sigorta şirketi avukatı, KTK m. 132 uyarınca bu kayıtların sigorta analizi için paylaşılmasının yasal bir kamu hizmeti olduğunu iddia ederek idari işlemin iptali davası açmıştır.

**Hukuki Analiz:**
1.  **Veri Sahipliği ve KVKK Uyumu:** KTK m. 132 EGM'ye bu verileri tutma yetkisi verir ancak bu verileri üçüncü kişilere serbestçe dağıtma hakkı tanımaz. Sürücü ve ihlal sicili verileri (P)'ye ait kişisel verilerdir.
2.  **Yasal Paylaşım Sınırları:** Sigorta Bilgi ve Gözetim Merkezi (SBM) üzerinden yapılan yasal ve sınırlı sorgulamalar haricinde, bir vatandaşın tüm ihlal geçmişinin detaylı dökümünün açık rıza olmaksızın ticari şirketlerle doğrudan paylaşılması KVKK'nın "amaçla sınırlılık" ve "veri güvenliği" ilkelerine açıkça aykırıdır.
3.  **Karar:** Mahkeme, Emniyet Genel Müdürlüğü'nün (P)'nin rızası dışındaki veri paylaşımı talebini reddetme işleminin KTK m. 132 ve KVKK hükümlerine tamamen uygun olduğuna karar vererek sigorta şirketinin iptal davasını **kesin olarak reddedecektir**.

---

### Metodolojik Not
Bu akademik yorum ve analiz; trafik sicil kayıtlarının POL-NET bünyesinde tutulmasının yasal temellerini, bu veri tabanındaki kişisel verilerin 6698 sayılı KVKK ve anayasal veri gizliliği hakları çerçevesindeki koruma kalkanlarını, adli ve mali entegrasyonların sınırlarını **Av. Fethi Güzel**'in bilişim hukuku, veri koruma hukuku, idare hukuku ve kamu veri tabanları kuramı alanındaki derin akademik uzmanlığıyla analiz etmektedir.
