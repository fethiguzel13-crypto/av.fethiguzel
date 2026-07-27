# Otomatik bakım ve dönemsel işler

Bu dosya **unutma riskini** azaltmak için yazıldı. Siz hatırlamasanız bile Windows Görev Zamanlayıcısı ve npm scriptleri çalışır.

## Kurulum (bir kez)

```powershell
cd fethiguzel-portal
powershell -ExecutionPolicy Bypass -File scripts\setup-maintenance-scheduler.ps1
# veya
npm run maintenance:setup
```

Sosyal taslaklar (ayrı):

```powershell
powershell -ExecutionPolicy Bypass -File scripts\setup-social-scheduler.ps1
```

## Zamanlanmış görevler

| Görev | Ne zaman | Ne yapar |
|-------|----------|----------|
| `FethiGuzel-Maintenance-Weekly` | Pazartesi 09:00 | tarife kontrol + haftalık içtihat + link check |
| `FethiGuzel-Maintenance-MonthlyProbe` | ~4 haftada bir | aynı bakım paketi |
| `FethiGuzel-TarifeCheck` | Salı 10:00 | tarife hatırlatma |
| `FethiGuzel-SocialDraft` | 10:00 + logon | sosyal medya taslağı (onaysız paylaşmaz) |

## Manuel komutlar

```bash
npm run maintenance              # hepsi (+ forum taslağı)
npm run maintenance:tarifeler    # Ocak/Temmuz uyarı dosyası
npm run maintenance:weekly       # /icthat/haftalik verisi
npm run forum:draft              # logs/forum-drafts/ (otomatik paylaşım yok)
npm run maintenance:links -- --base https://avfethiguzel.com
```

## Forum / grup taslakları

- Script: `npm run forum:draft`
- Çıktı: `logs/forum-drafts/YYYY-MM-DD.md`
- Zamanlayıcı: `FethiGuzel-ForumDraft` (Çarşamba 11:00) + haftalık maintenance
- Kavram sayfaları (kopyala-yapıştır mini cevap): `/kavram` ve `/kavram/satim` vb.
- **Asla otomatik forum bot’u yok** — siz okuyup elle yapıştırırsınız.

## Çıktılar (buraya bakın)

- `logs/maintenance/startup-maintenance.log`
- `logs/maintenance/tarife-YYYY-MM.md`
- `logs/maintenance/TARIFE-ACTION-REQUIRED.txt` ← tarife ayıysa oluşur
- `logs/maintenance/weekly-YYYY-Www.md`
- `public/data/weekly-digests/*.json`
- `public/data/tarife-changelog.json` ← site sayfası: `/tarife-guncellemeleri`

## Tarife güncelleme rutini (insan adımı)

1. Flag dosyası varsa Resmî Gazete / genelgeyi okuyun  
2. `components/hesaplama/HesaplamaTools.tsx` içindeki sabitleri güncelleyin  
3. `public/data/tarife-changelog.json` yeni kayıt ekleyin  
4. Deploy  

## WhatsApp

`lib/profile.ts` → `PROFILE.whatsapp` alanına ülke kodlu numara (ör. `905//...`) yazın; footer CTA otomatik açılır.

## Google Search Console

`public/google-search-console.md` adımlarını bir kez uygulayın; doğrulama kodunu `app/layout.tsx` metadata.verification içine koyun.
