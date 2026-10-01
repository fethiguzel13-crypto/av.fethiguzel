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
