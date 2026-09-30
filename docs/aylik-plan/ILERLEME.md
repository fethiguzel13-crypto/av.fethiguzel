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
