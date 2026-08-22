# Yargıtay arşivi üyeliği

Sekme: `/yargi-kararlari` — yalnızca aktif üyeye açık.
Bedel: **500 TL / 30 gün** (`lib/uyelik/config.ts`).
Kararlar sitede okunur; PDF/JSON indirme ve resmî `getDokuman` bağlantısı yok.

Bu tutar avukatlık ücreti değildir.

## Ortam değişkenleri

| Değişken | Ne işe yarar |
|----------|----------------|
| `UYELIK_SESSION_SECRET` | Çerez imzası (prod’da zorunlu, ≥16 karakter) |
| `UYELIK_ADMIN_SECRET` | Havale onay sayfası `/uyelik/yonetim` |
| `UYELIK_IBAN` | Havale IBAN (boşluksuz) |
| `UYELIK_HESAP_ADI` | Havale alıcı adı |
| `UYELIK_BANKA` | Banka adı (isteğe bağlı) |
| `IYZICO_API_KEY` / `IYZICO_SECRET_KEY` | Kart ödemesi |
| `IYZICO_MODE` | `sandbox` (varsayılan) veya `live` |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Vercel’de kalıcı üye deposu |

Yerelde yönetim anahtarı yoksa `dev-admin` geçerlidir.

## Havale onayı

1. Üye `/uyelik/odeme` üzerinden referans alır (`FG…`).
2. Siz `/uyelik/yonetim` → anahtar → e-posta → **30 gün aç**.

## Tam metin

Yerel dosyalar `data/yargi-kararlari/decisions/YYYY/{id}.json` içindedir (git’te yok, Vercel’e gitmez). Üye sunucusu bu klasörü görüyorsa tam metin sitede açılır.
