# Erişilebilirlik (G24) — kapanış raporu

**Tarih:** 2026-10-17 03:05 · **Derleme:** `2316da152` (`.next` 02:36, 02:29 tam kapısının derlemesi) · **Betik:**
`node scripts/tasarim-denetim.mjs --etiket=g24 --yapi` · **Ham veri:** `raporlar/tasarim-denetim-g24.json`,
`raporlar/erisilebilirlik-g24.json` · **Önce ölçümü:** `raporlar/*-g24-once.json` (2026-10-16 22:31, G23 kapanış derlemesi),
`raporlar/*-g24-dar.json` (320 px, 2026-10-17 00:52) · **Alt plan:** `gorevler/G24.md`

Ölçüm on yedi sayfa türünde, 1280 ve 390 px genişlikte, derlenmiş sitede (`next start -p 3123`) yapılmıştır. axe-core `wcag2a`,
`wcag2aa`, `wcag21a`, `wcag21aa` ve `wcag22aa` etiketleriyle koşar. `--yapi` seçeneği her sayfada belge dilini, başlık sırasını,
işaret bölgelerini, alt metni olmayan görseli, adı olmayan grafiği ve atlama bağlantısını `lib/erisilebilirlik.mjs`'in kurallarıyla
değerlendirir. Klavye, odak, etkileşim sonrası axe, yeniden akış ve azaltılmış hareket ise `e2e/erisilebilirlik.e2e.mjs`'in on beş
testiyle her tam kapıda sınanmaktadır.

## Kabul ölçütü

| Ölçüt | Durum | Dayanak |
|---|---|---|
| On yedi sayfa türünde axe ciddi/kritik ihlal 0 | Karşılandı. Etki düzeyinden bağımsız toplam ihlal 34 ölçümde 0'dır | `tasarim-denetim-g24.json` |
| Dört etkileşim durumunda axe ciddi/kritik ihlal 0 | Karşılandı. Beş durum ölçülmüştür (mobil menü, mevzuat açılır menüsü, arama sonucu, kıdem hata iletisi, kısa test) | uçtan uca, 4. adım |
| Tek `h1`, tek `main`, `lang="tr"`, düzey atlamayan başlık sırası, adsız görsel yok | Karşılandı. Yapı bulgusu 34 ölçümde 0'dır | `erisilebilirlik-g24.json`, uçtan uca yapı testi |
| Atlama bağlantısı, menü kapanışı, odak görünürlüğü her tam kapıda sınanır | Karşılandı | `e2e/erisilebilirlik.e2e.mjs` |
| `npm run kalite` yeşil | Karşılandı. 02:29-02:48 kapısı 1011 testte yeşildir, uçtan uca adımı 44/44'tür | `logs/g24-tam-0229.log` |

## Önce ve sonra

| Ölçüm | Önce | Sonra |
|---|---|---|
| axe ihlali (17 sayfa × 2 genişlik) | 0 | 0 |
| axe ihlali, etkileşim sonrası (5 durum) | 3 ciddi (iki kontrast, bir hedef boyutu) | 0 |
| Durum iletisi duyurulmayan etkileşim | 2 (kıdem ters tarih, kısa test sonucu) | 0 |
| `atlama-hedefi-yok` | 12 ölçüm, 6 sayfa | 0 |
| `duzey-atlama` | 6 ölçüm, 3 sayfa (ana sayfa, kavram, madde) | 0 |
| `footer-yok` | 2 ölçüm (madde); yeni sayımla ana sayfa da | 0 |
| `header-yok` | 24 ölçüm, 12 sayfa; yeni sayımla 16 sayfa | 0 |
| `atlama-yok` (6. adımda eklenen kural) | madde | 0 |
| 320 px yatay taşma | madde, 350 px | 0 |
| 1280 px açılır menü taşması | sağ kenardan taşma | 0 |
| Küçük hedef (WCAG 2.5.8, betik ölçümü) | içtihat 390 px, 1 | 0 (geliştirme sunucusunda, aşağıya bakınız) |

Sonra sütunu kapanış taramasıdır, yalnız son satır bu oturumdaki düzeltmeden sonraki ölçümdür. `header-yok` ve `footer-yok` satırlarında
"yeni sayım", 6. adımda `header` ve `footer` öğelerinin yalnız `banner` ve `contentinfo` işaret bölgesi olduklarında sayılmaya başlanmasıdır.
Önceki sayım `main` içindeki sayfa başlığı kutusunu da üst bilgi saydığından bazı sayfalar bulgusuz görünüyordu.

## Düzeltmeler

| Bulgu | Düzeltme | Commit |
|---|---|---|
| Atlama bağlantısının hedefi 17 sayfa dosyasında yoktu | Her `<main>` `id="main-content"` taşır, statik test | `47fdc3fd8` |
| Ana sayfa kartları h2'den h4'e, kavram sayfası h1'den h3'e atlıyordu | Kartlar `h3`, cevap kutusu kavram sayfasında `h2` | `ba3e99fb3` |
| Mobil menü klavyeyle kapanmıyordu, `aria-expanded` yoktu | `Escape` dinleyicisi, odak düğmeye döner | `3b3a592df` |
| Mobil menüde üyelik bağlantısı ve arama sonucundaki "Şerh hazır" etiketi kontrastı, açılır menü bağlantıları 24 px altı | `text-accent-ink`, `text-emerald-800`, `py-0.5` ve aralık 0 | `65cce1fd3` |
| Kıdem aracında ters tarih iletisi duyurulmuyordu | Hep DOM'da duran `role="status"` bölgesi | `d24ef44d7` |
| Kısa testte seçim ve sonuç yalnız renkle veriliyordu | `aria-pressed`, "✓ Doğru cevap" ve "✗ Yanlış seçim" metni, durum bölgesi | `6a3b9e856` |
| Madde sayfası 320 px'te boşluksuz yazar dizisiyle taşıyordu | `main` `overflow-wrap:anywhere` | `bb823d00b` |
| Mevzuat açılır menüsü 1280 px'te sağdan taşıyordu | Panel `nav`'a göre ortalanır, düğme `aria-controls` taşır | `57433374d` |
| Madde sayfası bağımsız HTML'inde düzey atlaması, alt bilgi ve atlama bağlantısı eksikti | `baslikDuzeyleriniDuzle`, `<footer>`, `main#main-content` | `8c0ca0c5f` |
| Gezinme çubuğu `<header>` içinde değildi, ana sayfada `Navbar` ve `Footer` `main` içindeydi, fareyle tıklama açılır menüyü kapatıyordu | `Navbar` kökü `<header>`, ana sayfada ikisi `main` dışında, tıklama menüyü açık tutar | `2316da152` |
| İçtihat kartındaki "Kaynak" bağlantısı 73×16 px ölçülüyordu, "Analizi Oku" bağlantısıyla aralığı 16 px'tir | İki bağlantı `inline-flex` ve `min-h-6`; on bağlantının hepsi 73×24 px ölçülmüştür | `b8d5403b6` |

Ekran görüntüleri `raporlar/gorsel/` altındadır: `g24-*-sonra.jpg` (4. adım), `g24-mevzuat-menu-1280-{sonra,ortali}.jpg` (5. adım),
`g24-yapi-{anasayfa,madde}-{1280,390}-{once,sonra}.jpg` (6. adım), `g15-icthat-mobil-g24.jpg` ve `g15-icthat-mobil-g24-icthat-sonra.jpg`
(bu oturum). Ana sayfanın yüksekliği yapı düzeltmelerinden sonra iki genişlikte de değişmemiştir.

## Kalan bulgular ve gerekçesi

- **`moderate` ve `minor` ihlal yoktur.** Kapanış taramasında axe'in WCAG etiketli kurallarında etki düzeyinden bağımsız ihlal 0'dır.
  axe'in `best-practice` etiketli kuralları ölçüme alınmamıştır, zira kabul eşiği WCAG A/AA ile sınırlıdır. Bu kurallar G25 son
  regresyonunda bir kez raporlanabilir.
- **İçtihat sayfasındaki küçük hedef aralıklı görülmüştür.** 2026-10-16 22:31 ve 2026-10-17 03:04 taramalarında çıkmış, 00:52 taramasında
  çıkmamıştır. Sayfa günlük içtihat verisiyle değiştiğinden ölçüm, o gün kaynak bağlantısı taşıyan kaydın bulunmasına bağlıdır. Düzeltme
  pil nedeniyle derlenmiş sitede değil, geliştirme sunucusunda (`next dev -p 3124`) doğrulanmıştır. Bileşen düzeyindeki statik test
  (`lib/__tests__/hedef-boyutu-bilesen.test.mjs`) her hızlı kapıda koşar, derlenmiş sitede yeniden ölçüm G25'e bırakılmıştır.
- **Uçtan uca testler küçük hedefi ölçmez.** Hedef boyutu yalnız `tasarim-denetim.mjs` taramasında ölçülmektedir ve tarama kapıya bağlı
  değildir. Etkileşim sonrası axe ölçümü `target-size` kuralını taşıdığından açılır menü gibi durumlar kapıda sınanır.
- **Mobil uygulama kapsam dışıdır.** Ekran denetimi G21'de yapılmıştır (20 ekran, 0 bulgu).
