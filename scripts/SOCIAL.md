# Sosyal medya ajanları (X · Instagram · YouTube)

## Ne bozuktu?

1. `daily.json` içinde `highlights: []` — ajan “bugün içerik yok” deyip çıkıyordu  
2. Twitter API kuyruğu **402 CreditsDepleted** (eski API yolu)  
3. Anthropic bakiyesi tükenmiş; taslak üretimi çöküyordu  
4. Tweet/IG arası **3 saat** bekleme — pratikte takılıyordu  
5. Sadece Windows Startup’a bağlıydı; PC kapalıysa çalışmıyordu  
6. Instagram caption’da “devamı profilde” tipi zayıf CTA  

## Yeni akış (kalite önce)

```
node scripts/social-draft.js          # veya social-draft-seed.js (API yoksa)
→ logs/social-drafts/YYYY-MM-DD.md    # siz okursunuz
→ status: "approved"                  # JSON'da
→ node scripts/social-publish.js --date YYYY-MM-DD
```

**Varsayılan: otomatik paylaşım YOK.**  
`SOCIAL_AUTO_POST=1` olmadan hiçbir şey X/IG’ye gitmez.

## Kurulum

```powershell
# 1) Chrome profilleri (bir kez)
node login-twitter.js
node login-instagram.js

# 2) Günlük taslak saati 10:00
powershell -ExecutionPolicy Bypass -File scripts\setup-social-scheduler.ps1
```

## YouTube

Taslaklar `youtubeScript` alanında. Video yükleme API’si ayrı OAuth ister; şimdilik metin onaylanır, Shorts kaydı sizin kanalınızdan veya sonra API ile.

## Ortam

| Değişken | Anlam |
|----------|--------|
| `GEMINI_API_KEY` / `ANTHROPIC_API_KEY` | Metin üretimi |
| `SOCIAL_LLM=gemini` | Varsayılan öncelik |
| `SOCIAL_PREFER_MEVZUAT=1` | İçtihat zayıfsa mevzuat konuları |
| `SOCIAL_AUTO_POST=1` | Taslak sonrası otomatik yayın (önermiyoruz) |
