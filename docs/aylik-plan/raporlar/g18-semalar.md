# G18 — Ders notlarına şemalar

**Tarih:** 2026-10-08 · **Alt plan:** `gorevler/G18.md` · **Beceriler:** test-driven-development, hukuki-halusinasyon-onleme, dataviz

## Veri (adım 1)

Şemalar `lib/ders-notlari/semalar.mjs` dosyasındadır. Sekiz şema, 40 adım ve on ders bulunmaktadır:

| Şema | Tür | Adım | Dersler (taban kod) | Dayanak |
| --- | --- | --- | --- | --- |
| Yazılı yargılama usulünde davanın evreleri | akış | 6 | `medeni-usul` | HMK m.118, 136, 137, 143, 186, 294 |
| İlamsız icra takibinin akışı | akış | 7 | `icra-iflas`, `icra` | İİK m.58, 60, 62, 66, 78, 106, 138 |
| Ceza muhakemesinin evreleri | akış | 6 | `ceza-muhakemesi` | CMK m.160, 170, 174, 175, 188, 223 |
| Yasal mirasçılar ve sağ kalan eşin payı | akış | 4 | `miras-hukuku` | TMK m.495, 496, 497, 499 |
| Borç ilişkisinin kaynakları | dal | 3 | `borclar-genel` | TBK m.1, 49, 77 |
| Dava şartı olarak arabuluculuk | akış | 5 | `arabuluculuk`, `tuketici-hukuku` | TKHK m.73/A, 6325 s. Kanun m.18/A |
| Geçerli sebeple fesih ve işe iade | akış | 5 | `is-hukuku` | İş Kanunu m.18, 19, 20, 21 |
| Taşınmaz mülkiyetinin kazanılması ve tescil | dal | 4 | `esya-hukuku` | TMK m.705, 1022 |

Her adımın `dayanak.ifade` alanı, `content/mevzuat/<kanun>/madde-<n>.md` dosyasının `### Akademik Yorum` başlığından önceki kanun
metninde aynen geçmektedir; test bunu her adım için denetler (`lib/__tests__/ders-semalari.test.mjs`). Açıklamalar yalnız aynı
madde metninden kurulmuştur, doktrin görüşü ve içtihat yazılmamıştır. Doğrulanamayan aday adım çıkmadığından
`kullaniciya-sorular.md`'ye G18 için soru eklenmemiştir. Alt plandaki bağlamadan iki sapma vardır: Yasal mirasçılar şeması
`aile-hukuku` dersine bağlanmamış, arabuluculuk şeması iş hukuku yerine tüketici hukukuna bağlanmış ve iş hukuku için ayrı bir işe
iade şeması yazılmıştır.

## Bileşen (adım 2)

`components/ders-notlari/AkisSemasi.tsx` sunucu bileşenidir, istemci betiği ve yeni bağımlılık eklemez. `<figure>` içinde
`role="img"` SVG başlık ve özetle adlandırılır. Altındaki `<details>` listesi her adımı açıklamasıyla ve
`/mevzuat/<kanun>/madde-<n>` bağlantısıyla metin olarak verir. `viewBox` genişliği 320 birim olup çizim geniş ekranda 400 px'te
durur. Akış türünde numaralı daire ve ok, dal türünde ortak gövdeden ayrılan çizgi kullanılır; renk anlam taşımaz.

## Nota bağlama (adım 3)

`DersNotuView` şemaları `dersSemalari(note.courseCode)` ile bulur ve öğretim bölümleri sıralandıktan sonra ilk bölümün ardından
çizer. Ders kodunun `-donem-1`, `-donem-2` ve `-yillik` eki atıldığından tek kayıt dersin bütün fakülte ve sürümlerine
gitmektedir. `generated/index.json` sayımına göre 11.042 notun 2.673'ü, 84 fakültenin tamamında, en az bir şema almaktadır.

## Ölçüm (adım 4)

Ölçüm üretim derlemesinde (`next start -p 3123`) yapılmıştır. Denetim listesine akış şemalı medenî usul
(`/ders-notlari/ankara/medeni-usul-donem-1`) ve dal şemalı eşya hukuku (`/ders-notlari/ankara/esya-hukuku-yillik`) notları
eklenmiş, bunu bir test güvenceye almıştır. Şemasız `ders-notu` sayfası karşılaştırma için listede kalmıştır.

İlk ölçüm (`g18-sema-olcum-once.json`) alt planın yazı ölçütünü karşılamamıştır. 360 px ekranda ders notu figürünün içinde çizime
278 px kalmakta olup 13 birimlik yazı 11,3 px'e inmekteydi; bileşen yorumu kalan genişliği ~300 px varsaymıştı. Yazı 14 birime,
satır aralığı 18 birime çıkarılmış, geniş ekrandaki en büyük çizim genişliği 400 px'ten 366 px'e indirilmiştir. Böylece etkin yazı
360 px'te 12,2 px, 390 px'te 13,5 px ve 1280 px'te 16 px olmaktadır (`g18-sema-olcum.json`). Bileşen testi kuralı ölçülen 278 px
üzerinden denetler (önce kırmızı).

| Ölçüt | Sonuç |
| --- | --- |
| Tasarım denetimi, üç ders notu × 1280 ve 390 px (`tasarim-denetim-g18-sonra.json`) | ihlal 0, kontrast 0, küçük hedef 0, taşma yok |
| Düzeltmeden önceki derlemede aynı denetim (`tasarim-denetim-g18-once.json`) | 0 |
| Sekiz şemanın tamamında, 360 px'te metnin sağ ucu | en çok 232 / 320 birim, `viewBox` dışına taşma yok |
| Şemanın yeri | iki notta da ilk öğretim bölümünden sonra (`Görev`, `Zilyetlik`) |
| Metin karşılığı | liste öğesi sayısı adım sayısına eşit (6 ve 4) |
| `npm run kalite` | yeşil, 831 test, derleme 800 sn, derleme taraması ve betik bütçesi geçti |

Görüntüler `gorsel/g18-usul-*.jpg` ve `gorsel/g18-esya-*.jpg` dosyalarıdır (`-once` ekli olanlar 13 birimlik ilk hâli,
`-metin` ekli olanlar açılmış metin karşılığını gösterir). Denetimin ilk ekran görüntüleri `gorsel/g15-ders-notu-*-g18-sonra.jpg`
adını taşır. Bileşen sunucuda çizildiğinden istemci betiği ve yeni bağımlılık eklenmemiştir.

## Kabul

Her şema adımı test edilmiş kanun metnine bağlıdır. Şemalar on derse ve 2.673 nota gitmektedir; metin karşılığı ve SVG adı
erişilebilirdir. İstemci betiği ve bağımlılık eklenmemiş, denetim 0 ihlal vermiş, `npm run kalite` yeşil kalmıştır.
TestSprite koşulmamıştır, zira değişiklik yayında değildir (yayın 30 Ekim).
