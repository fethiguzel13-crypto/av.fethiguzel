# Instagram Otomasyon — Tasarım Dokümanı

**Tarih:** 2026-05-26  
**Durum:** Onaylandı

## Özet

Günlük mahkeme kararlarından otomatik Instagram gönderisi üretir ve paylaşır. Bilgisayar açıldığında çalışır; kararları siteden çeker, her highlight için 1080×1080px görsel kart + caption üretir ve InstagramBot Chrome profili üzerinden Instagram web'e Playwright ile yükler.

---

## Mimari

```
Bilgisayar açılır
       ↓
startup-instagram.js
       ↓
.instagram-log.json → bugün paylaşıldı mı? (evet → çık)
       ↓
https://avfethiguzel.com/data/daily.json çek
       ↓
Her highlight için:
  instagram-card-writer.js → HTML kart → Playwright headless screenshot → [id].png
  instagram-caption-writer.js → Claude Sonnet → caption + hashtag metni
       ↓
instagram-poster.js → InstagramBot Chrome profili (non-headless)
  → görsel yükle → caption yaz → paylaş
       ↓
.instagram-log.json güncelle (bugünün highlight ID'leri)
```

---

## Dosya Yapısı

| Dosya | İşlem | Açıklama |
|---|---|---|
| `scripts/lib/instagram-card-writer.js` | Create | HTML şablon → Playwright headless screenshot → PNG |
| `scripts/lib/instagram-caption-writer.js` | Create | Claude Sonnet caption + hashtag üretici |
| `scripts/lib/instagram-poster.js` | Create | Playwright Instagram web poster |
| `scripts/startup-instagram.js` | Create | Orchestrator: log kontrol, fetch, kart+caption, post |
| `login-instagram.js` | Create | Tek seferlik Instagram login helper |
| `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\fethiguzel-instagram.cmd` | Create | Windows startup kaydı |

---

## Görsel Kart

**Format:** 1080×1080px PNG  
**Üretim:** Node.js'te HTML string oluşturulur → Playwright headless Chromium ile screenshot alınır → temp dosyasına yazılır

### Tasarım

```
┌─────────────────────────────────────┐  1080px
│  arka plan: #0f0f1a                 │
│                                     │
│  [badge: AYM]  accent: #c9a84c      │  üst sol
│                                     │
│  künyesi                            │  mono, #888
│  "AYM, B. No: 2024/28913"          │
│                                     │
│  ═══════════════════════════════    │  ayraç
│                                     │
│  Konu başlığı                       │  beyaz, bold, 2-3 satır
│  (konu || publicSummary ilk 120 kr) │
│                                     │
│                                     │
│  ─────────────────────────────────  │  alt ayraç
│  Av. Fethi Güzel  avfethiguzel.com  │  #888, küçük
└─────────────────────────────────────┘
```

### Parametreler
- Arka plan: `#0f0f1a`
- Beyaz metin: `#f5f5f5`
- Badge accent: `#c9a84c` (altın/amber — hukuki ciddiyet)
- Font: `system-ui` (OS font, kurulum gerektirmez)
- Konu metni: maksimum 120 karakter, fazlası `...` ile kesilir

---

## Caption Formatı

Claude Sonnet `claude-sonnet-4-6` üretir.

### Ton
Deneyimli avukatın Instagram'da paylaştığı kısa hukuki yorum. Twitter'dan uzun ve hikayeli, Instagram meraklı kitlesine hitap eder.

### Format
```
[2-3 cümle özet — sohbet dili, jargonsuz]

Kararın tam analizi için bağlantı profilde 🔗

#hukuk #içtihat #[mahkeme] #avukatlık #hukukmeraklıları
```

### Parametreler
- **Model:** `claude-sonnet-4-6`
- **Uzunluk:** 150-250 karakter (hashtag hariç)
- **Dil:** Türkçe, jargonsuz
- **Ton:** Merak uyandırıcı ama bilgili; "Bu kararla ilgilenenler için..." gibi girişler
- **Hashtag'ler:** Mahkemeye göre değişen sabit set

### Hashtag Seti
```js
const HASHTAGS = {
  AYM:     '#hukuk #içtihat #AYM #anayasaMahkemesi #avukatlık',
  Yargıtay:'#hukuk #içtihat #Yargıtay #avukatlık',
  YİBK:    '#hukuk #içtihat #Yargıtay #YİBK #avukatlık',
  AİHM:    '#hukuk #içtihat #AİHM #insan hakları #avukatlık',
  RG:      '#hukuk #mevzuat #resmiGazete #avukatlık',
};
```

---

## instagram-poster.js

Twitter poster ile aynı pattern. Farklar:
- Chrome profili: `InstagramBot` (Twitter'dan ayrı)
- Her post için: ana sayfaya git → "+" (yeni post) butonuna tıkla → dosya seç → görsel yükle → caption yaz → paylaş
- Görseli `page.setInputFiles()` ile file input'a ata
- Postlar arası: 60 saniye bekleme (Instagram rate limit)

```
Chrome profili: ~/AppData/Local/Google/Chrome/User Data/InstagramBot
Başlangıç URL:  https://www.instagram.com
```

---

## Log Dosyası

`.instagram-log.json` — Twitter log ile aynı yapı:

```json
{
  "2026-05-26": ["aym-2024-28913", "yargitay-2024-1234"]
}
```

---

## Startup Kaydı

`fethiguzel-instagram.cmd` içeriği:
```cmd
@echo off
timeout /t 90 /nobreak >nul
node "C:\Users\HUAWEI\Desktop\internet\fethiguzel-portal\scripts\startup-instagram.js"
```

Twitter agent'tan 90 saniye gecikmeli başlar (çakışma önleme, Chrome profilleri ayrı olsa da).

---

## Kapsam Dışı

- Reels veya Stories paylaşımı
- Carousel (çoklu görsel) post
- Instagram API (Graph API)
- Yorum yönetimi
- Analitik takibi
