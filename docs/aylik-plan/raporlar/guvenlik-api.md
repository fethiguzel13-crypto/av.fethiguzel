# G04 — API ve üyelik güvenlik denetimi (2026-10-01)

Denetlenen: `app/api/uyelik/[...path]`, `app/api/yargi/[...path]`, `app/api/content-pack/[kanunId]`,
`app/api/pack-health`, `lib/uyelik/*`. Alt plan: `gorevler/G04.md`.

Her bulgu önce kırmızı bir testle sabitlendi, sonra düzeltildi. Yeni testler:
`lib/uyelik/__tests__/guvenlik.test.mjs` (22), `depo-kv.test.mjs` (4), `api-uclari.test.mjs` (8).
`test:uyelik` 27 → 61 test. Toplam 476 → 510 test. `npm run kalite` (derleme dahil) yeşil.

## Bulgular ve durum

| # | Bulgu | Önem | Durum |
|---|---|---|---|
| B1 | Ödeme dönüşü tekrar oynatılabiliyordu | Yüksek | Düzeltildi |
| B2 | Sır eksikken sahte üye çerezi kabul ediliyordu | Yüksek (yapılandırmaya bağlı) | Düzeltildi |
| B3 | Girdi uzunluğu sınırsızdı | Orta | Düzeltildi |
| B4 | Yönetici sırrı çerezde düz metindi | Orta | Düzeltildi |
| B5 | Köken denetimi yoktu (giriş CSRF'i) | Orta-düşük | Düzeltildi |
| B6 | Çok örnekli sunucuda üye ve ödeme kaydı kayboluyordu | Orta | Düzeltildi |
| B7 | 500 yanıtında iç hata metni; `edge` çalışma ortamı | Düşük | Düzeltildi |
| B8 | `pack-health` parametre süzgeci ve ortam sızıntısı | Düşük | Düzeltildi |
| B9 | `content-pack` Host başlığına güveniyordu | Düşük | Düzeltildi |
| B10 | Ücretli arşiv uçlarında deneme sınırı yoktu | Düşük | Düzeltildi |

### B1 — Ödeme dönüşü tekrar oynatılabiliyordu (yüksek)

`GET /api/uyelik/odeme/sonuc?token=…` her çağrıda iyzico'dan ödemeyi doğruluyor ve üyeliği 30 gün
uzatıyordu. Aynı token'ı tekrar çağıran üye, tek ödemeyle sınırsız üyelik elde edebiliyordu. Token
tarayıcı geçmişinde de kalıyordu.

Düzeltme: `activateMembership(user, kind, odemeKimligi)` işlenen ödeme kimliklerini (`paymentId`, yoksa
token) kayıtta tutar (`islenenOdemeler`, son 20). Denetim, yazma kuyruğundaki `mutateUser` içinde
deponun güncel kaydı üzerinde yapılır; çağıranın elindeki nesne bayat olsa da tekrar uzatma olmaz.
Yönetici elle etkinleştirmesi kimliksiz çalışır ve her seferinde uzatır.

### B2 — Sır eksikken sahte üye çerezi (yüksek, yapılandırmaya bağlı)

Üretimde `UYELIK_SESSION_SECRET` tanımlı değilse `sessionSecret()` kaynakta yazılı sabit bir metne
düşüyordu. Kayıt ve giriş bu durumda kapanıyordu, ama `readSession` o metinle imzalanmış çerezi kabul
ediyordu. Kaynağı okuyan biri `until` alanı ileri tarihli bir çerez üretip ücretli arşive girebilirdi.

Düzeltme: üretimde sır yokken `readSession` her çerezi reddeder.

### B3 — Girdi uzunluğu sınırsızdı (orta)

Bütün üyeler tek Upstash anahtarında tek JSON olarak tutuluyor. Megabaytlık ad alanlı kayıtlar bu anahtarı
şişirip üyelik sistemini kilitleyebilirdi. Uzun şifre, scrypt öncesi PBKDF2'yi yoruyordu.

Düzeltme: `lib/uyelik/guvenlik.ts` → `kayitGirdisiDenetle` (e-posta ≤ 254, ad 2–100, şifre 8–128) ve
`girisGirdisiDenetle` (sınır dışı girdi scrypt çalışmadan "hatalı" yanıtı alır). Eski kurallar ve hata
metinleri korundu.

### B4 — Yönetici sırrı çerezde düz metindi (orta)

`fg_arsiv_admin` çerezine `UYELIK_ADMIN_SECRET`'ın kendisi yazılıyordu. Karşılaştırma `===` ile
yapılıyordu ve yönetici ucunda deneme sınırı yoktu.

Düzeltme: çereze sırdan türetilmiş HMAC yazılır (`adminCerezDegeri`). Karşılaştırma sabit sürelidir
(`guvenliEsit`). IP başına 15 dakikada 10 başarısız denemeden sonra 429 döner; başarılı istekler
sayılmaz. **Yan etki:** eski yönetici çerezleri geçersizleşir. Yönetim paneli sırrı her istekte
gönderdiği için kullanım değişmez.

### B5 — Köken denetimi yoktu (orta-düşük)

`req.json()` gövdeyi içerik türüne bakmadan okuyor. Başka bir site `text/plain` form ile ziyaretçiyi
saldırganın hesabına giriş yaptırabiliyordu (giriş CSRF'i). Ziyaretçi bu hesapla ödeme yaparsa para
saldırganın üyeliğine gider. Oturum çerezinin SameSite=Lax olması bu yolu kapatmıyordu.

Düzeltme: durum değiştiren POST'larda `Sec-Fetch-Site: cross-site` ya da başka siteyi gösteren `Origin`
403 alır. İyzico dönüşü (`odeme/sonuc`) bu denetimin dışındadır, çünkü o yol token'ı iyzico'dan
doğrular. Origin göndermeyen istemciler (curl, sunucu) etkilenmez. www'li ve www'siz alan adı aynı site
sayılır. Mobil uygulama `/api/uyelik` kullanmıyor (denetlendi).

### B6 — Çok örnekli sunucuda kayıt kaybı (orta)

Depo her sunucu örneğinde bir kez okunup bellekte tutuluyordu. Vercel aynı anda birden çok örnek
çalıştırır, bu yüzden üç sorun doğuyordu:

- A örneği bayat kopyasıyla yazınca B'nin eklediği üye ya da ödeme siliniyordu.
- B'de kaydolan üye A'da giriş yapamıyordu.
- KV'ye ulaşılamayan soğuk başlangıçta boş depo yazılıp bütün üyeler silinebiliyordu.

Düzeltme: KV tanımlıyken her okuma taze yapılır; KV okunamazsa son bilinen hâl kullanılır. Yazmadan önce
KV'den taze okunur. KV okunamıyorsa ya da yazılamıyorsa yazı reddedilir. Ödeme dönüşü bu hatada üyeyi
bekletmez: dönem sonu çerezde taşınır ve olay `paymentId` ile loglanır. Yönetici kaydı elle
düzeltirken bu kimliği `odemeKimligi` alanıyla gönderir. Böylece aynı ödeme dönüşü sonradan tekrar
çağrılınca ikinci bir dönem eklenmez. Bu ek, güvenlik incelemesinin eşik altı notundan doğmuştur.

Maliyet: her üyelik/arşiv isteği bir Upstash GET demektir. Mevcut trafikte ücretsiz kota içinde kalır.
Gerekirse kısa süreli okuma önbelleği eklenebilir.

### B7 — İç hata metni ve `edge` çalışma ortamı (düşük)

500 yanıtı `e.message`'ı istemciye veriyordu. Bu metin depo ya da ödeme sağlayıcısı ayrıntısı
içerebiliyordu. Rota, Next 16'da kullanımdan kalkan `runtime = 'edge'` ayarındaydı.

Düzeltme: sabit mesaj döner, ayrıntı sunucu logunda kalır. Rota `nodejs` çalışma ortamına geçti.
`lib/uyelik` Node'da Web Crypto ve `node:crypto` ile çalışır.

### B8 — `pack-health` (düşük)

`kanun` parametresi süzülmüyordu (yalnız yol değişebiliyordu, alan adı sabit). Yanıt `VERCEL_URL` ve
`VERCEL_ENV` değerlerini veriyordu. Önizleme adresi koruma dışı bir giriş kapısı olabilir. Her çağrı
paketi baştan indirip açtığı için çağrılar sınırsız maliyet doğuruyordu.

Düzeltme: ortak süzgeç `lib/paket-kaynak.ts` → `kanunKimligi` kullanıldı, ortam bilgisi yanıttan
çıkarıldı ve IP başına saatte 20 istek sınırı kondu. Uç kod içinde hiçbir yerden çağrılmıyor; ileride
tamamen kaldırılabilir.

### B9 — `content-pack` Host başlığına güveniyordu (düşük)

Paket, isteğin `Host` başlığından türetilen kökenden de çekiliyor ve 5 dakika herkese açık önbelleğe
yazılıyordu. Vercel'de Host dağıtımın alan adlarından biri olmak zorunda olduğu için risk çok düşüktür.
Kendi kendine barındırmada ise bu durum SSRF'ye ve önbellek zehirlenmesine kapı açar.

Düzeltme: `paketAdresleri()`, isteğin kökenini yalnız sitenin alan adı, bu dağıtımın adresi ya da yerel
sunucuysa kullanır. Diğer kaynakların sırası korundu. 404 gövdesindeki iç hata metinleri loga taşındı.

### B10 — Ücretli arşiv uçlarında deneme sınırı (düşük)

Tek üyelikle bütün arşiv toplu çekilebiliyordu. Her karar isteği Yargıtay'a canlı bir istek de
doğurabiliyordu.

Düzeltme: üye başına 10 dakikada 300 karar ve 30 indeks isteği, aşılırsa 429 + `Retry-After` döner.
Sayaçlar her sunucu örneğinin belleğindedir, yani bu sınır kaba bir frendir. Kesin sınır için ileride
Upstash kullanılabilir.

## Bağımsız güvenlik incelemesi

`security-review` becerisiyle, yalnız bu oturumun dosyalarına daraltılmış ayrı bir inceleme yapıldı.
Güven puanı 7 ve üzerinde bulgu çıkmadı. Eşik altında iki not var. Birincisi depo kesintisinden sonra
çift dönem riskiydi (yukarıda B6 ekiyle kapatıldı). İkincisi ödeme dönüşü token'ının giriş yetkisi
taşımasıdır. Ödenmiş bir token'la `odeme/sonuc` çağıran, ödemeyi yapan hesabın oturumunu alır. Bu durum
önceden de vardı. Token yalnız iyzico yönlendirmesinde ve ödeme yapanın tarayıcısında görünür, bu
yüzden etkisi düşüktür. İleride token'ın tek kullanımlık oturum açması düşünülebilir.

## Sorun bulunmayanlar

- **Yol geçişi:** `kanunId` `[a-z0-9-]` dışını atıyor. Karar kimliği regex ile süzülüp indekste aranıyor.
  Disk yolları ayrıca süzülüyor (`karar-text.ts`).
- **Ücretli indeks:** `public/data/yargi-index.json.gz`, `next.config.ts` içindeki `beforeFiles`
  yeniden yazmasıyla üyelik denetimli `/api/yargi/index` ucuna gidiyor. Dosya `public/` altında durduğu
  için bu koruma tek bir yeniden yazma kuralına bağlı. Yüzde kodlu yol varyantlarının Vercel'de bu kuralı
  atlayıp atlamadığı canlıda denenmeli (G25 güvenlik taraması). Daha sağlam çözüm, dosyayı `public/`
  dışına taşımaktır; bunun için mobil derleme betikleri de değişeceğinden G14'e not düşüldü.
- **İyzico geri çağrısı:** Geri çağrı yalnız token taşır. Ödeme, sunucudan iyzico'ya kimlik doğrulamalı
  `retrieve` çağrısıyla ve tutar, para birimi, durum, fraud denetimiyle (`paymentOk`) doğrulanıyor.
  Ayrıca HMAC doğrulamasına gerek yok. Eksik olan tekrar koruması B1 ile kapandı.
- **Oturum çerezi:** httpOnly, üretimde secure ve SameSite=Lax. HMAC-SHA256 imzası sabit sürede
  karşılaştırılıyor, süre (`exp`) denetleniyor.
- **Şifre saklama:** scrypt (N=16384, r=8, p=1), 16 bayt tuz, sabit süreli karşılaştırma.

## Bilinçli bırakılanlar (düşük risk)

- **Kullanıcı numaralandırma:** Kayıt "bu e-posta ile kayıt var" diyor ve girişte olmayan kullanıcıda
  scrypt çalışmıyor (süre farkı). Deneme sınırı var. Zararsız bir çözüm için arayüz metni değişmeli,
  G22 uçtan uca testleriyle ele alınabilir.
- **Çıkışta oturum iptali:** Oturumlar durumsuz (180 gün). Çıkış yalnız çerezi siler; çalınan çerez süresi
  dolana kadar geçerli kalır. İptal listesi KV gerektirir.
- **Deneme sınırları:** Hepsi örnek belleğinde tutuluyor; dağıtık bir saldırıda kaba kalır.

## Kullanıcıdan teyit gerekenler

`raporlar/kullaniciya-sorular.md` 5. madde: Üretimde `UYELIK_SESSION_SECRET` ile
`UPSTASH_REDIS_REST_URL/TOKEN` tanımlı mı? Upstash yoksa üyeler yalnız sunucu belleğinde tutulur ve her
soğuk başlangıçta silinir.
