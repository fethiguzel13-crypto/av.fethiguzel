# Ders Notları — Kalite, Kapsam ve Araştırma Disiplini

**Güncelleme:** 2026-08-05  
**Durum:** Liste temizliği yapıldı; içerik kalitesi dalga dalga yükseltiliyor.

---

## 1. Ne yanlıştı?

1. **“Her şehir” hatası:** Ağrı, Hakkâri, Artvin, Van YYÜ (plan aşaması) gibi **hukuk fakültesi olmayan** veya **öğrenci almayan** birimlere not üretildi.  
2. **Ruhsuz şablon:** Aynı metin, yalnızca üniversite adıyla değiştirildi (`AİÇÜ` ↔ `AYBÜ`). SEO dolgusu gibi duruyordu.  
3. **Araştırma yoktu:** Fakülte siteleri, açık ders arşivleri, müfredat PDF’leri taranmadan toplu üretim yapıldı.

---

## 2. Kapsam kuralı (sert)

| Dahil | Hariç |
|--------|--------|
| YÖK Atlas / ÖSYM’de **Hukuk** programı görünen TR kampüsleri | Hukuk fakültesi olmayan üniversiteler |
| Fiilen öğrenci alan aktif programlar | Sadece “kuruldu” haberleri (Van YYÜ planı, Ege planı vb. → `active:false`) |
| Devlet + vakıf TR | KKTC / yurt dışı (ayrı dalga; şimdilik yok) |

**Liste kaynağı:** 2025–2026 yerleştirme derlemesi (YÖK Atlas sentezi).  
**Aktif sayı (2026-08-05):** ~**84** fakülte.  
**Temizlik:** Sahte/pasif üni not dosyalarından **~7.670** silindi; kalan ~**7.930** şablon not **yeniden yazılacak**.

---

## 3. Telif ve etik

- Hoca slaytı, fotokopi not, NotPazarı metni **kopyalanmaz**.  
- Kamuya açık **müfredat iskeleti**, ders adı, AKTS, dönem programı **özetlenerek** kullanılabilir.  
- Açık ders (ör. `acikders.ankara.edu.tr`) → **yapı + konu başlıkları** ilham; cümle cümle aktarım yok.  
- Her curated notta `sources[]` alanı: URL + ne alındı (müfredat / açık ders / hub sayfası).

---

## 4. Kalite katmanları

| Tier | Anlam | Yayın |
|------|--------|--------|
| `template` | Eski motor üretimi; isim değiştirilmiş | Geçici; “taslak” uyarı bandı |
| `research-draft` | Araştırma var, metin henüz yarı | Hub’da “geliştiriliyor” |
| `curated` | İnsan eliyle / derin yazım; fakülteye özgü | Vitrin |
| `premium` | Eski etiket — artık `curated` ile değiştirilir | — |

**Hedef (curated):**

- Gerçek paragraf anlatımı (sadece madde listesi değil)  
- Fakülteye özgü: dil (TR / FR / EN), yıllık-dönemlik, sınav kültürü, açık kaynak varsa atıf  
- ≥ 3 işlenmiş örnek olay  
- Sınav iskeleti + tuzak defteri  
- Kaynakça / sources  
- Ruh: avukatın masasında anlatır gibi; “AI özet” kokusu yok

---

## 5. Web araştırma disiplini (ban yememek)

1. **Günde sınırlı istek:** fakülte başına 3–8 sayfa; peş peşe 20 istek yok.  
2. **Önce arama, sonra fetch:** Google/YÖK/site içi → sonra tek sayfa.  
3. **Bekleme:** istekler arasında en az 8–15 sn (manuel veya script).  
4. **Öncelik sırası:**  
   - Dalga A: AYBÜ, AÜHF, İÜHF, Marmara, DEÜ, Hacettepe, GSÜ, Bilkent, Koç  
   - Dalga B: diğer öncelik-2  
   - Dalga C: öncelik-3  
5. **Her fakülte için research dosyası:**  
   `docs/ders-notlari/research/{slug}.md` + isteğe bağlı `lib/ders-notlari/research/{slug}.json`

---

## 6. Üretim rotası (devam)

1. Research dosyasını doldur (müfredat URL, açık ders, notlar var mı).  
2. O fakülte için **1 çekirdek ders** curated yaz (tercihen borçlar-genel veya medeni).  
3. Index/hub `ready` bayraklarını koru.  
4. Eski template notlara UI’da “taslak — güncelleniyor” bandı.  
5. Toplu `generate-ders-notlari.mjs --wave=all` **artık varsayılan yol değil**.

---

## 7. Hızlı envanter komutları

```bash
# Sahte üni not temizliği + index
node scripts/cleanup-ders-notlari-fake-unis.mjs

# Sitemap (index sonrası)
node scripts/build-ders-notlari-sitemap.mjs
```
