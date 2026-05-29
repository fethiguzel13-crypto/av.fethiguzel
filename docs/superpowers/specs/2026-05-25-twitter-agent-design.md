# Twitter Ajan Tasarımı — Startup Tweet Otomasyonu

**Tarih:** 2026-05-25  
**Durum:** Onaylandı  

## Özet

Twitter API kullanmadan, kullanıcının mevcut Chrome oturumu üzerinden günlük hukuki içtihat tweetleri atan lokal bir Windows startup ajanı. GitHub Actions scraper'ı olduğu gibi çalışmaya devam eder; sadece tweet gönderme kısmı yerel makineye taşınır.

---

## Mimari

```
Bilgisayar açılır
       ↓
Task Scheduler → scripts/startup-tweet.js
       ↓
scripts/.tweet-log.json kontrol → bugün atıldıysa çık
       ↓
avfethiguzel.com/data/daily.json fetch (Vercel'den canlı veri)
       ↓
scripts/lib/tweet-writer.js → Claude Haiku API → 4 tweet metni üret
       ↓
Playwright → Chrome User Data profili → twitter.com/compose/tweet
       ↓
4 tweeti sırayla at (aralarında 30sn bekleme)
       ↓
.tweet-log.json güncelle → browser kapat
```

---

## Dosya Yapısı

| Dosya | Açıklama |
|---|---|
| `scripts/startup-tweet.js` | Ana orkestratör |
| `scripts/lib/tweet-writer.js` | Claude Haiku ile tweet metni üretimi |
| `scripts/.tweet-log.json` | Tekrar atma koruması — gitignore'da |
| `setup-startup.ps1` | Task Scheduler kaydı için tek seferlik kurulum |
| `logs/startup-tweet.log` | Çalışma logları — gitignore'da |

---

## Tweet Üretimi

**Model:** Claude Haiku (hızlı, düşük maliyet — 4 tweet ≈ birkaç sent/gün)

**Girdi (her highlight için):**
- Mahkeme adı (AYM, Yargıtay, Danıştay vb.)
- `publicSummary` metni
- `avfethiguzel.com/icthat` site linki

**Çıktı kuralları:**
- 280 karakter altı, Türkçe
- İnsansı, sohbet tonu — resmi/bot dili yok
- Siyasi olarak tamamen nötr — taraf tutmaz, yorum yapmaz
- Her tweet farklı formatta (soru, anlatı, dikkat çekici cümle)
- 1-2 hashtag maksimum (`#hukuk`, `#AYM`, `#içtihat` gibi)
- Sonunda site linki

**Örnek çıktı:**
> Terör suçlamasıyla işten çıkarılan biri, mahkeme kararı olmadan meslekten men edildi. AYM: Bu özel hayata müdahaledir.  
> avfethiguzel.com/icthat #hukuk

---

## Playwright / Chrome Entegrasyonu

- Playwright, kullanıcının mevcut Chrome profilini kullanır
- Profil yolu: `C:\Users\HUAWEI\AppData\Local\Google\Chrome\User Data`
- Twitter'a ayrıca login gerekmez — oturum zaten açık
- Headless değil: kısa süre (5-10sn) pencere görünür, sonra kapanır
- Her tweet arası 30 saniye bekleme

---

## Tekrar Koruma

`scripts/.tweet-log.json`:
```json
{ "lastPostedDate": "2026-05-25" }
```

Script başlarken bugünün tarihini karşılaştırır. Eşleşirse hiçbir şey yapmadan çıkar. Bilgisayar günde birden fazla açılsa da güvenli.

---

## Windows Startup Kurulumu

`setup-startup.ps1` tek seferlik çalıştırılır:
- Task Scheduler'a "kullanıcı oturumu açınca" tetiklenen görev ekler
- Node.js ile `scripts/startup-tweet.js` çalıştırır
- Çıktıyı `logs/startup-tweet.log` dosyasına yazar

---

## Değişmeyen Şeyler

- GitHub Actions `daily-icthat.yml` scraper aynen çalışmaya devam eder
- `public/data/daily.json` Vercel üzerinden erişilir
- `twitter-queue.json` ve `tweet-poster.yml` artık kullanılmaz (devre dışı bırakılabilir)
- Twitter API secrets GitHub'dan silinebilir

---

## Kapsam Dışı

- Mobil / farklı cihazdan paylaşım
- Onay mekanizması (tam yetki verildi)
- Instagram, LinkedIn gibi ek platformlar
- Playwright dışı headless çözümler
