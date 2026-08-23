# Görünüm turu — 23.08.2026

Site ve mobil uygulamada yapılan tasarım geçişi. Her madde ölçülmüş ya da
ekranda görülmüş bir kusura karşılık gelir; hiçbiri "daha iyi olur" tahmini
değildir.

## Önce kırık olan: /yargi-kararlari her yenilemede 500 veriyordu

Dört sayfa (`yargi-kararlari`, `yargi-kararlari/[id]`, `uyelik`,
`uyelik/odeme/tamam`) render sırasında `setSessionCookie(user)` çağırıyordu.
Next.js Server Component içinde çerez yazmayı yasaklar:

> Cookies can only be modified in a Server Action or Route Handler.

Kusur **yalnız oturum açmış üyede** görünüyordu — anonim ziyaretçide `user`
boş olduğu için satır hiç çalışmıyordu. Yani ödeme yapmış kullanıcı, parasını
verdiği sayfayı her yenilediğinde hata alıyordu; siteyi çıkışta test eden
kimse bunu göremezdi.

Ölçüm: anonim istek `200`, üye isteği `500`. Düzeltmeden sonra üç ardışık
yenileme de `200`.

Tazeleme, buna izin verilen tek yere taşındı: `/api/uyelik/ben` route
handler'ı. `lib/uyelik/__tests__/render-cerez.test.mjs` kuralı mekanik olarak
tutar — `app/` altındaki hiçbir `page.tsx` çerez yazamaz.

## Gezinme çubuğu 1440 pikselde kırılıyordu

Dokuz üst düzey bağlantı sığmıyor, «Ders notları» ve «Üye ol» iki satıra
düşüyordu: tek çubukta üç ayrı taban çizgisi. Ölçümde o iki öge 52 piksel,
kardeşleri 34 pikseldi.

- «Ders notları» üst menüden alındı (alt bilgide iki yerde duruyor). Sayfanın
  kendisi zaten «yayından kaldırıldı, yeniden yazılıyor» durumunda.
- Bütün ögelere `whitespace-nowrap` verildi.
- Masaüstü menü eşiği `lg` (1024) yerine `xl` (1280); arama kutusu `2xl`
  (1536). 1024–1280 arası artık kırık bir çubuk yerine mobil menü gösterir.

Doğrulama: 1024 · 1280 · 1440 · 1600 · 1920 — hiçbirinde sarma ya da taşma yok.

## Sayılar birbirini tutmuyordu

Ana sayfa «19.000+ Yargıtay kararı» derken arşiv sayfası aynı anda 25.902
diyordu; kanun sayısı 46 yazıyordu, külliyatta 47 kanun vardı. Değerler altı
ayrı bileşene elle yazılmıştı.

`lib/site-stats.ts` tek kaynak oldu: değerler üretimin kendi çıktısından
okunur (`app-packs/manifest.json`, `yargi-stats.json`, `publishable.json`).
Yuvarlama daima **aşağı** yapılır — sahip olunmayan içerik hiçbir yerde varmış
gibi görünmez.

Sayfa gövdesindeki sayaç modül yüklenirken bir kez okunuyordu ve süreç ömrü
boyunca donuyordu; arşiv büyüdükçe metin ile süzgeç çipi çelişiyordu
(«25.902 karar» / «Tümü (27.147)»). Artık her istekte okunur.

## Ücretli arşiv, mobil uygulamanın gerisinde kalmıştı

Aynı veriden iki farklı kalite çıkıyordu.

| | Önce | Sonra |
|---|---|---|
| Satır başlığı | künye duvarı | uyuşmazlık konusu |
| Künye | daire ve tarih üç kez | yalnız esas/karar no |
| Özet | usul başlığı artığı | kararın anlatısı |
| Görülebilen karar | ilk 80 | tamamı |

Konu başlıkları mobil derlemesinde zaten çıkarılıyordu; kimlikler birebir
eşleştiği için site indeksine bağlandı (`build-yargi-index.mjs` sonunda,
konu çıkarımından **sonra** — sıra zorunlu). 17.877/27.159 satır (%66) konu
başlığı aldı.

Özetlerin 10.395'inden usul başlığı atıldı. Karar metinleri
«…KARARI VEREN YARGITAY DAİRESİ : 6. Ceza Dairesi MAHKEMESİ :Ceza Dairesi
SAYISI : 41-1463» gibi bir alan listesiyle başlıyor ve iki satırlık özetin
tamamını yiyordu. Kaçmamış HTML varlıkları da çözüldü (`&ldquo;`, `&acirc;`
ve benzerleri ekranda ham görünüyordu) — kalan: 0.

## Dil rozeti gezinme çubuğunun altında kalıyordu

`GalaxyChrome` `fixed top-0 z-[55]`, gezinme çubuğu `fixed top-6 z-[900]`.
Aynı bandı paylaşıyorlardı; çubuk üstte olduğu için rozet ana sayfa dışındaki
her sayfada kırpık bir dilim olarak görünüyordu. Rozetteki uygulama adı da
çubuktaki markanın tekrarıydı.

Dil seçici gezinme çubuğuna taşındı. `GalaxyChrome` yalnız ekran okuyucuya
okunan yasal notu taşımayı sürdürür.

## Günlük içtihatta aynı kayıt iki kez

`daily.json` aynı Resmî Gazete kaydını iki kez taşıyordu (26 kayıttan 3'ü
çift). Ekranda aynı kart art arda çıkıyor, React de yinelenen anahtar uyarısı
basıyordu. Süzgeç okuma tarafına kondu: 26 → 23 kart, konsol temiz.

## Çizmediğimiz yüzeyler

Seçim rengi ve odak halkası temalıydı; gerisi varsayılandaydı. Onay kutuları
Chrome'un mavisiyle çiziliyordu, künye rakamları hizalanmıyordu.

```
accent-color  : auto → var(--accent)
color-scheme  : normal → light
scrollbar     : auto → temaya uygun
tabular-nums  : normal → .font-mono, time
```

## Başlık üstü etiketi ve alıntı kutusu

- «Türk Hukuku · Akademik Portal» rozeti kaldırıldı: hemen altındaki başlık
  aynı şeyi söylüyordu, yanıp sönen noktası da sayfanın tek kurgulanmış
  hareketiyle yarışıyordu. Aynı temizlik mobil uygulamada da yapılmıştı.
- Şerh alıntı bloğu 3 piksel turuncu kenar + renkli zemin + yuvarlatılmış
  köşeyle bir «uyarı kartı» gibi duruyordu. Buradaki alıntı bir uyarı değil,
  karardan yapılan iktibastır; basılı hukuk dergilerindeki gibi ince çizgi
  ve içeri çekilmiş blok oldu.

## Doğrulama

```
8 sayfa × 2 ölçü (1440 / 390)  →  16/16 · 200 · 0 taşma · 0 konsol hatası
tsc --noEmit                    →  temiz (ilgisiz bir test dosyası hariç)
impeccable detect               →  0 bulgu
lib/uyelik testleri             →  7/7
```

Mobil uygulama tarafı `docs/AKICILIK.md` içinde ayrıca belgelidir.
