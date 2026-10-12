# G20 — Paylaşım görselleri (Open Graph)

**Tarih:** 2026-10-11 / 2026-10-12 · **Alt plan:** `gorevler/G20.md` · **Commit'ler:** `dba223c66`, `f31880c0d`, `d50fac255`, `9d5b2f08e`

## Sorun

Kök yerleşim paylaşım görseli tanımladığı hâlde sayfaların büyük kısmı paylaşıldığında görselsiz görünüyordu. Next 16 sayfanın
`openGraph` nesnesini kök yerleşiminkiyle birleştirmeyip bütünüyle değiştirmektedir (`resolve-metadata.js` `mergeMetadata`). Kendi
başlığını yazan her sayfada görsel, site adı ve dil bu yüzden düşüyordu. Kendi `openGraph`'ını hiç vermeyen sayfa ise kökün ana sayfa
adresini ve başlığını miras alıyor, paylaşım ana sayfaya gidiyordu.

## Önce ve sonra

Ölçüm `scripts/derleme-og-tara.mjs` ile derlenmiş HTML üzerinden yapılmıştır; betik sunucu gerektirmez, yalnız okur.

| Ölçü | Önce (`og-once.json`, 2026-10-09 derlemesi) | Sonra (`og-sonra.json`, 2026-10-12 12:07 tam kapı derlemesi) |
|---|---:|---:|
| Derlenmiş sayfa | 941 | 941 |
| Dizine açık sayfa | 827 | 826 |
| Paylaşım etiketi eksik sayfa | 746 | **0** |
| `og:image` yok | 745 | 0 |
| `twitter:card` küçük ya da `twitter:image` yok | 589 | 0 |
| `og:site_name` / `og:locale` yok | 190 / 146 | 0 / 0 |
| `og:url` yok ya da canonical'dan farklı | 17 (eşitlik o gün ölçülmüyordu) | 0 |
| Sayfaların gösterdiği ayrı görsel | 2 | 735 |
| Derlemede karşılığı olmayan görsel | 0 | 0 |

Dizine açık sayfa sayısındaki bir eksilme gerçek bir sayfa kaybı değildir. `/ingilizce-avukat` 308 ile `/english-speaking-lawyer`'a
yönlenmektedir ve tarama artık yönlendirmeleri derlemenin `.meta` dosyasındaki durumdan tanıyıp saymamaktadır.

## Yapılanlar

- **Tek kaynak:** `lib/paylasim.ts` `paylasimMeta()` her sayfanın `openGraph` ve `twitter` alanlarını üretir; görsel (1200×630, alt
  metinli), site adı, dil ve tür her zaman doludur. Kök yerleşim `paylasimKokMeta()` ile adres, başlık ve açıklama taşımaz; Next boş
  kalan başlığı sayfanın kendi `title` değerinden doldurur.
- **Kapalı görsel kümesi:** `app/og/[tur]/[anahtar]/route.tsx` görselleri `generateStaticParams` ve `dynamicParams = false` ile
  derlemede PNG olarak üretir. Bilinmeyen anahtar 404 verir, sorgu dizgisinden metin okunmaz. Böylece sitenin alan adı altında keyfî
  yazılı görsel üretilemez ve paylaşım başına sunucu fonksiyonu çağrılmaz (G00, Vercel kullanımı). Derlemede 846 kart üretilmektedir
  (`.next/server/app/og`, yaklaşık 29 MB).
- **Madde sayfaları:** Yaklaşık 7.600 madde adresini yazan rota işleyicisi kanun düzeyinde kart (`/og/kanun/<kanun>`) ve
  `summary_large_image` taşır. Karar sayfaları tür kartını kullanır.
- **Reklam yasağı (G07):** Kartta yalnız içerik başlığı, içerik türü, "Av. Fethi Güzel" ve alan adı vardır. Telefon, çağrı, "arabulucu"
  sıfatı ve "yer + avukat" kalıbı testle 0'dır. Bölge sayfaları (soru 10 açık) sayfa başına kart almaz, genel site kartını kullanır.
- **Kilitler:** `lib/__tests__/paylasim.test.mjs` sayfa ya da yerleşim zincirinde `paylasimMeta` çağırmayan, dizine açık her sayfayı
  kırmızı yapar ve `app` altında elle yazılmış `openGraph`/`twitter` nesnesini yasaklar. `lib/__tests__/paylasim-denetim.test.mjs`
  taramanın kurallarını sınar. Tarama `npm run kalite` içinde `derleme-tarama` adımında koşar.

## Yolda bulunan kusurlar

- Kart tür etiketi CSS `textTransform: 'uppercase'` ile yazılıyordu. Satori yerel ayar almadığı için "Vatandaş rehberi" etiketi
  "REHBERI" çıkıyordu; etiket artık `toLocaleUpperCase('tr')` ile yazılmaktadır (`f31880c0d`).
- Temsilci ders notu kart anahtarı iki yerde elle kurulup `ankara-ankara-…` biçiminde çift önek taşıyordu; tek yardımcıya
  (`dersNotuKartAnahtari`) bağlanmıştır.
- Tarama ilk biçiminde `og:url`'ün yalnız varlığına bakıyordu. Canonical ile eşitlik kuralı eklenince 93 sayfa kırmızı çıkmış, bunların
  79'u kökün ana sayfa adresini miras alıyordu (`f31880c0d`). Kalan yedi sayfa `d50fac255` ile kapanmıştır: `bookmarklet` hiç meta
  vermiyor ve ana sayfanın başlığını taşıyordu, `eserlerim` ile `on-form` meta verisini yerleşim dosyasında tutuyordu. Üçü de yalnız
  sayfa dosyasına bakan kilitten geçmişti. `site-haritasi` ise kilitte yorum satırındaki "noindex" sözcüğü yüzünden istisna sayılıyordu.
- 11:33 tam kapısında derleme 749 sayfada kırılmış, ancak ekrana basılan son 25 satır ders notu dosya deseni uyarısından oluştuğu
  için hata iletisi kaybolmuştur. Aynı kodla 11:40 derlemesi geçmiş, sekiz fakülte sayfası 60 sn sınırını ilk denemede aşıp yeniden
  denenmiştir. Kırılmanın bu zaman aşımının üç denemede de tekrarlanması olduğu kuvvetle muhtemel olmakla birlikte kanıtlanamamıştır.
  Kapı artık kırık adımın tam çıktısını `logs/kalite-<adım>-kirik.log` dosyasına yazmaktadır (`9d5b2f08e`).

## Derleme süresi

11:40 derlemesinde statik üretilen 1.790 çıktının 846'sı karttır. G19 kapanışındaki tam kapılarda derleme 355-426 sn
sürmüştü. G20 kartlarıyla tam kapıdaki derleme adımı 521 sn (11 Ekim, boş bellek ~900 MB) ve 684 sn (12 Ekim 12:07, boş bellek ~850 MB)
sürmüştür. 11:40 derlemesinde derleme 2,8 dk, sayfa üretimi 6,4 dk tutmuştur.
Makine yükü ve boş bellek ölçümü belirgin biçimde oynattığından (G13) artış kabaca 2-4 dk olarak okunmalıdır. Kart başına maliyet
düşük olup süreyi asıl belirleyen, düşük bellekte yeniden denenen ders notu fakülte sayfalarıdır.

## Kabul

`npm run kalite` 12:07'de tek koşuda yeşildir: 881 test, derleme 684 sn, `derleme-tarama` (başlık eki, JSON-LD ve kırıntı, betik
bütçesi, paylaşım etiketi) geçmiştir. Alt plandaki kabul ölçütlerinin tamamı karşılanmıştır.

## Örnek kartlar

Görüntüler `raporlar/gorsel/` altındadır ve gözle denetlenmiştir. Türkçe ğ, ş, ı, İ, ü harfleri başlık ve etiket yazı tipinde doğru
çizilmekte, uzun başlık iki satıra kırılmakta ve taşma görülmemektedir.

- `g20-kart-kanun-tbk.png` — "MEVZUAT VE ŞERH · Türk Borçlar Kanunu · TBK · 649 madde"
- `g20-kart-rehber-genel.png` — "VATANDAŞ REHBERİ · Vatandaş bilgi rehberi"
- `g20-kart-ders-notu.png` — "DERS NOTU · AÜHF Aile Hukuku Yıllık (Konsolide Master)". Başlıktaki "Konsolide Master" iç üretim
  etiketidir ve sayfa başlığından gelmektedir; düzeltmesi G23'e not edilmiştir.

## Açık kalanlar

- Sayfa kartları yayın günü canlı adreste paylaşım önizleme araçlarıyla (Facebook, X, LinkedIn) denenmelidir; site 30 Ekim'e kadar
  yayında değildir ve TestSprite koşulmamıştır.
- Bölge sayfalarının kartı soru 10'a bağlıdır.
