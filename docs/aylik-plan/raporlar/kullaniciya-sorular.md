# Kullanıcıya sorular / kararlar

Ajan bu maddelerde kendi başına karar vermez; en güvenli varsayımla devam eder.

## 2026-10-01

1. **Canlı site kapalı (Vercel 402 DEPLOYMENT_DISABLED).** Vercel panelinde Usage'da hangi limit
   aşıldı? Pro plan mı, dönem sıfırlanması mı? Ayrıntı: `raporlar/vercel-kullanim.md`.
   *Varsayım:* ajan kullanım sürücülerini azaltmaya devam eder, push yapmaz.
2. **Yapay zekâ tarayıcıları (robots.ts).** Şu an hepsi açık (GPTBot, ClaudeBot, PerplexityBot,
   Bytespider, CCBot…). Öneri: yapay zekâ *cevaplarında* görünürlük sağlayanlar açık kalsın (OAI-SearchBot,
   ChatGPT-User, PerplexityBot, Claude-SearchBot, Applebot), yalnız toplu eğitim verisi toplayıp trafik
   getirmeyen Bytespider ve CCBot kapatılsın. *Varsayım:* onay gelene kadar dokunulmaz.
3. **Anahtar deposu şifresi** `mobile/keystore-password-SIL-SONRA.txt` düz metin duruyor (git dışında).
   Bir şifre yöneticisine taşınması önerilir. *Varsayım:* ajan dokunmaz.
4. **Erken yayın?** Sitenin kapanmasına büyük ihtimalle yol açan iki sorun düzeltildi (madde önden yükleme
   fırtınası `5ffe31209`, tam metin indeksinin her açılışta inmesi `a33f0aa67`). Vercel limiti sıfırlanıp site
   açıldığında bu düzeltmeler yayında değilse limit yeniden dolabilir. Yalnız bu iki düzeltmenin 30 Ekim'i
   beklemeden yayına alınmasını ister misiniz? *Varsayım:* push yok (talimat gereği).
5. **Üyelik ortam değişkenleri (G04).** Vercel üretim ortamında `UYELIK_SESSION_SECRET` (≥ 16 karakter) ve
   `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` tanımlı mı? Sır yoksa üyelik artık tamamen kapanır
   (önceden sahte çerez kabul ediliyordu). Upstash yoksa üyeler yalnız sunucu belleğinde tutulur ve her soğuk
   başlangıçta silinir. Ayrıntı: `raporlar/guvenlik-api.md`.
   *Varsayım:* ikisinin de tanımlı olduğu varsayılır; yayın günü (G26) Vercel panelinden doğrulanır.
6. **Yönetici çerezi (G04, bilgi).** Yönetim paneli çerezine artık sırrın kendisi değil, ondan türetilmiş
   değer yazılıyor. Yayından sonra panel bir kez sır ister; başka bir değişiklik yok.
7. **Mobil abonelik sunucu doğrulaması (G05/M3).** Play satın almaları şu an yalnız cihazda doğrulanıyor.
   Sunucu doğrulaması için Google Cloud hizmet hesabı (Play Developer API) gerekir. Tam metin ve çözme anahtarı
   cihazda olduğundan kazanç sınırlıdır. Kurulmasını ister misiniz? Ayrıntı: `raporlar/guvenlik-mobil.md`.
   *Varsayım:* mimari korunur; ödeme sahteciliği gözlenirse yeniden değerlendirilir.
8. **Mobil yedekleme (G05/M4).** Android 7–11'de favoriler ve notlar Google yedeğine girmiyor, Android 12+'da
   giriyor. İkisi eşitlensin mi (notlar her sürümde yedeklensin mi), yoksa notlar hiç yedeklenmesin mi?
   *Varsayım:* onay gelene kadar mevcut kurallar korunur.
9. **Play inceleme kodu yenilendi (G05/M1, yayın günü eylemi).** Eski kod herkese açık depoda yazılı olduğu için
   ücretli arşivi herkese açıyordu. Yeni kod yalnız git dışındaki `mobile/inceleme-kodu.local.txt` dosyasında.
   Yayın günü Play Console → Uygulama erişimi talimatı bu kodla güncellenmeli; talimata "uygulama yeniden
   başlatılırsa kodu tekrar girin" notu eklenmeli. *Varsayım:* G26 kontrol listesine eklendi.
