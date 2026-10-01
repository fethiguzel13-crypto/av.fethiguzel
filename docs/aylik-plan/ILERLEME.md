# İlerleme günlüğü — Aylık Mükemmellik Planı

Her oturum sonuna bir blok ekler. En yeni en altta.

---

## 2026-09-30 — Kurulum (etkileşimli oturum)

- Push kilidi: `.git/hooks/pre-push` 2026-10-30'a kadar push'u reddediyor (deneme push'u reddedildi).
- Yerel başlangıç commit'leri: `ddf040d00` (hasat motoru v2), `1bf739421` (bekleyen ders notu dalgaları).
- Hasat motoru: captcha mandalı eklendi (captcha geldiği hızın %85'i, 24 saat tavan; yeniden
  başlatmada korunur). 4 günde 30 captcha görülmüştü (5,5–8/dk). Motor 4,7/dk tavanla yeniden başladı.
  Arşiv 101.920 karar; emsal ve benzersiz 32.394.
- Tarama bulguları: npm audit (site) 1 kritik + 7 yüksek; CSP başlığı yok; 11.623 ders notunun çoğu
  şablon katmanında; mobil audit temiz; anahtar deposu dosyaları `.gitignore`'da.
- Plan: `docs/aylik-plan/PLAN.md` (G01–G26). Otonom çalışma: `scripts/otonom/calis.ps1` +
  `FethiGuzel-OtonomCalisma` görevi.
- Sıradaki: G01 Kalite kapısı.

## 2026-09-30 17:10 — G01 Kalite kapısı (etkileşimli oturum) — TAMAM

- `npm run kalite:hizli` (tip + lint cırcırı + 9 test takımı): 466 test yeşil, 48 sn.
- `npm run kalite` (+ `next build`): yeşil, derleme 504 sn.
- Düzeltmeler: sosyal yazarlarda LLM bağımlılık enjeksiyonu (testler gerçek API çağırıyordu), galaxy
  testleri katalog v2 sözleşmesine; lint kapsamı derleme çıktısı/eski betikler dışında, 82 bilinen hata
  `scripts/lint-taban.json` tabanında (cırcır).
- Rapor: `raporlar/kalite-baslangic.md`. Commit: `26f10a3c4`.
- Sıradaki: G01b (lint borcu — önce 3 rules-of-hooks), sonra G02 (bağımlılık açıkları).

## 2026-10-01 10:40 — G02 + G03 (etkileşimli oturum) — TAMAM · ACİL BULGU

- **ACİL (G00):** Canlı site kapalı — avfethiguzel.com ve www'deki tüm adresler (robots.txt, sitemap,
  API) Vercel'den `402 Payment required / DEPLOYMENT_DISABLED` dönüyor. Ödeme ya da kullanım limiti;
  kullanıcı Vercel panelinden çözmeli. jsDelivr/GitHub içerik paketleri çalışıyor (mobil çevrimdışı içerik
  ayakta; üyelik ve sunucu API'leri kapalı).
- G02: next 16.2.5 → 16.3.8 (kritik açık), npm audit fix; adm-zip devDependencies 0.6.1. `npm audit`:
  1 kritik + 8 yüksek → **0**. Commit `9e567a3ec`.
- G03: `lib/guvenlik-basliklari.mjs` (CSP + başlıklar, 8 test), `lib/json-ld.ts` (`</script>` kaçışına
  karşı; 21 dosyada 34 kullanım). `scripts/csp-dogrula.mjs` derlenmiş siteyi Chromium'la gezdi:
  15 sayfada CSP ihlali yok. Commit `4ca4b3fde`.
- Yeni bulgu (G03b): `/ara?q=kira` derlenmiş sitede React #418 hydration hatası.
- Otonom çalıştırıcı: uykudan uyanınca ağı 5 dk bekliyor (09:18 oturumu ENOTFOUND ile düşmüştü). `7fde4307e`.
- Hasat: 103.062 karar; 09:55–10:19 yerel internet kesintisinde devre kesici doğru bekledi.
- Sıradaki: G01b (lint borcu), sonra G03b, G04.

## 2026-10-01 14:30 — G00 maliyet düzeltmeleri + G03b (etkileşimli oturum)

- **Önden yükleme fırtınası (G00):** madde sayfaları rota işleyicisi; next/link görünür madde bağlantılarına
  `?_rsc=` isteği atıyordu (CDN'i deler, fonksiyon çağrısı): /mevzuat/tbk 84, /ara 25, /mevzuat 10.
  `components/SiteLink` (madde yollarında düz `<a>`) 73 dosyada next/link'in yerine geçti → 8 sayfada 0.
  `5ffe31209`. Denetim: `scripts/dogrula-onyukleme.mjs`.
- **Tam metin indeksi (G00):** /mevzuat ve /ara her açılışta 8,9 MB indeks indiriyordu → yalnız arama yapılınca.
  `a33f0aa67`. Denetim: `scripts/dogrula-arama.mjs` (7/7).
- **G03b:** /ara hydration hatası (#418) giderildi (ilk çizim statik HTML ile aynı). `a33f0aa67`.
- Temizlik: kullanılmayan 9 bileşen silindi, 25 MB PNG `docs/gorsel-arsiv/`'e; lint 82 → 65. `3b8649ce7`.
- Raporlar: `raporlar/vercel-kullanim.md`, `raporlar/kullaniciya-sorular.md` (4 soru; biri erken yayın).
- Kalite: 476 test, CSP 15/15, derleme yeşil. Canlı site hâlâ 402.
- Sıradaki: G01b (kalan 65 lint hatası), G04 (API güvenlik).
