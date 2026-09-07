# Yargıtay arşivi üyeliği

Sekme: `/yargi-kararlari` — yalnızca aktif üyeye açık.
Bedel: **500 TL / 30 gün** (`lib/uyelik/config.ts`).
Kararlar sitede okunur; PDF/JSON indirme ve resmî `getDokuman` bağlantısı yok.

Bu tutar avukatlık ücreti değildir.

## Ödeme: kredi / banka kartı

Varsayılan ve tek yöntem karttır. Tahsilat iyzico'nun 3D Secure altyapısı
üzerinden alınır; kart numarası siteye hiç uğramaz, burada saklanmaz.
IBAN/havale yolu **varsayılan olarak kapalıdır** — kart açıkken ödeme
sayfasında IBAN görünmez.

### Kurulum — tek komut

```bash
npm run uyelik:kart -- --api-key=XXXX --secret-key=YYYY
```

Komut anahtarları `.env.local` dosyasına yazar (git'e girmez), iyzico'ya
gerçek bir checkout isteği atarak çalıştığını kanıtlar ve Vercel'e taşımak
için hazır komutları basar. Anahtar olmadan çalıştırılırsa nereden
alınacağını söyler.

Anahtarlar:

- **Canlı:** <https://merchant.iyzipay.com> → Ayarlar → API Anahtarları
- **Sandbox (kayıt anında, evrak yok):** <https://sandbox-merchant.iyzipay.com>

`sandbox-` ile başlayan anahtar otomatik olarak sandbox ucuna yönlenir;
`IYZICO_MODE` yazmaya gerek kalmaz. Sandbox'ta ödeme sayfasında turuncu bir
**test modu** uyarısı çıkar, canlı anahtar girilince kendiliğinden kalkar.

### Sandbox test kartı

`5528790000000008` · son kullanma `12/30` · CVC `123` · 3D şifresi `283126`

## Ortam değişkenleri

| Değişken | Ne işe yarar |
|----------|----------------|
| `UYELIK_SESSION_SECRET` | Çerez imzası (prod'da zorunlu, ≥16 karakter) |
| `UYELIK_ADMIN_SECRET` | Manuel üyelik açma sayfası `/uyelik/yonetim` |
| `IYZICO_API_KEY` / `IYZICO_SECRET_KEY` | **Kart ödemesi — bu ikisi girilince açılır** |
| `IYZICO_MODE` | `live` / `sandbox`; boş bırakılırsa anahtardan anlaşılır |
| `UYELIK_KART` | `0` → kart ödemesini acilen kapatır |
| `UYELIK_HAVALE` | `1` → IBAN'ı kartla birlikte gösterir; `0` → tümüyle kapatır |
| `UYELIK_IBAN` | Havale IBAN (boşluksuz) — yalnız havale açıkken kullanılır |
| `UYELIK_HESAP_ADI` | Havale alıcı adı |
| `UYELIK_BANKA` | Banka adı (isteğe bağlı) |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Vercel'de kalıcı üye deposu |

Yerelde yönetim anahtarı yoksa `dev-admin` geçerlidir.

### Ödeme yöntemi kararı

`lib/uyelik/config.ts` şu sırayla karar verir:

1. `IYZICO_API_KEY` + `IYZICO_SECRET_KEY` varsa **kart açık** (`UYELIK_KART=0` değilse).
2. Kart açıkken havale **kapalı** — `UYELIK_HAVALE=1` demedikçe.
3. Kart hiç kurulu değilse ve `UYELIK_IBAN` doluysa havale yedeğe düşer.
4. İkisi de yoksa ödeme sayfası "geçici olarak kapalı" der, e-posta yolunu gösterir.

### Vercel'de zorunlu kurulum

Kayıt/giriş `503` + «Oturum anahtarı tanımlı değil» (veya `MISSING_SESSION_SECRET`)
dönerse Production'da `UYELIK_SESSION_SECRET` yoktur.

1. [Vercel Dashboard](https://vercel.com) → proje → **Settings** → **Environment Variables**
2. `UYELIK_SESSION_SECRET` = en az 16 karakter rastgele (ör. `openssl rand -base64 32`)
3. `UYELIK_ADMIN_SECRET` = ayrı bir rastgele anahtar (yönetim paneli)
4. `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (yoksa üye kaydı instance
   belleklerinde kaybolur)
5. `IYZICO_API_KEY` + `IYZICO_SECRET_KEY` (kart ödemesi)
6. Environment: **Production** (ve istersen Preview) → **Save** → **Deployments** →
   son production deploy'da **Redeploy** (env değişince yeniden deploy şart)

Yerel şablon (git'e girmez): `.env.uyelik.production`

## Ödeme doğrulaması

Geri dönüşte `status: success` tek başına yeterli sayılmaz. `lib/uyelik/iyzico.ts`
içindeki `paymentOk()` şunları ayrı ayrı denetler: `paymentStatus === SUCCESS`,
para birimi `TRY`, tahsil edilen tutar plan bedelinden düşük değil, `fraudStatus`
reddedilmemiş. Üye kimliği `basketId` üzerinden çözülür; `conversationId` yedektir.

## Manuel açma

Havale ya da istisnai bir durumda: `/uyelik/yonetim` → yönetim anahtarı →
e-posta → **30 gün aç**.

## Testler

```bash
npm run test:uyelik
```

Testler `lib/uyelik/__tests__/ts-register.mjs` çözümleyicisi ile **gerçek
TypeScript kaynağını** yükler; kopya mantık ölçülmez.

## Tam metin

Yerel dosyalar `data/yargi-kararlari/decisions/YYYY/{id}.json` içindedir (git'te yok, Vercel'e gitmez). Üye sunucusu bu klasörü görüyorsa tam metin sitede açılır.
