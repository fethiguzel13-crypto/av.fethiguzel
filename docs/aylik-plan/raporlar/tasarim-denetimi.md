# Tasarım sistemi denetimi (G15) — önce ölçümü

**Tarih:** 2026-10-07 12:34 · **Derleme:** `279d3c5c9` (`.next` 12:22) · **Betik:** `node scripts/tasarim-denetim.mjs --etiket=once`
· **Ham veri:** `raporlar/tasarim-denetim-once.json` · **Ekran görüntüleri:** `raporlar/gorsel/g15-<sayfa>-<masaustu|mobil>-once.jpg`

Ölçüm 14 sayfa türünde, masaüstü (1280 px) ve mobil (390 px) genişlikte, derlenmiş sitede (`next start`) yapılmıştır. axe-core
WCAG 2.0/2.1/2.2 A ve AA kurallarını koşar. Hedef boyutu WCAG 2.2 2.5.8'e göre aralık istisnasıyla, taşma ise belge genişliğiyle
ölçülür. Sayfalar: ana sayfa, makale, mevzuat dizini, TBK m.1, ders notu, yargı arşivi, karar sayfası, rehber, kıdem hesaplama,
içtihat, kavram, yazar profili, Van bölge sayfası, üyelik.

## Sağlık puanı

| # | Boyut | Puan | Ana bulgu |
|---|---|---|---|
| 1 | Erişilebilirlik | 2 | Kontrast: 14 sayfanın hepsinde, toplam 1.957 düğüm. Başka axe ihlali yalnız 2 düğüm. |
| 2 | Performans | 3 | G13'te ölçüldü: LCP 10 sayfada düştü, CLS 0. Yargı arşivinde mobil TBT ~1,5 sn (gerekçeli kabul). |
| 3 | Duyarlı tasarım | 3 | 390 px'te taşma yok. Hedef ihlali yalnız mevzuat dizininde (61) ve madde sayfasında (2). |
| 4 | Tema | 2 | Renk jetonları güçlü (2.168 jeton sınıfına karşı ~12 sabit renk), ama metin hiyerarşisi 20'den çok saydamlık değeriyle kurulmuş. Koyu tema yok. |
| 5 | Uygulama bütünlüğü | 3 | Dedektör 4 küçük kalıp buldu. Sistem tutarlı ve kimliğe özgü. |
| | **Toplam** | **13/20** | **Kabul edilebilir, ciddi iş gerekir** |

**Uygulama bütünlüğü kararı: geçer.** Palet (koyu yeşil, yanık turuncu, krem), dört yazı ailesinin görev ayrımı ve 48 bileşenin
ortak jetonlardan beslenmesi ürüne özgü, tutarlı bir dil kurar. Dedektör `components/` ve `app/` altında yalnız 4 bulgu verir: üç kalın tek
kenar çizgisi (`BolgeMakaleView.tsx:273`, `VatandasRehberArticle.tsx:174`, `app/mevzuat/[kanunId]/[id]/route.ts:242`) ve
`DersNotuView.tsx:1189`'da yuvarlak köşeli kutuda vurgu kenarı. Sorun dilde değil, metin tonlarının nasıl üretildiğindedir.

## Bulgular

### [P1] Saydamlıkla açılan ikincil metin AA kontrastını karşılamıyor

- **Yer:** Bütün sayfalar. En sık sınıflar: `text-charcoal/40` (74 kullanım), `/45` (59), `/50` (59), `/55` (47), `/60` (65), `/35`
  (24), `/30` (16). Ölçümde 10–11 px etiketlerle birlikte görülür (`font-mono text-[10px] text-charcoal/40 uppercase`).
- **Ölçüm:** Krem zeminde `/40` 2,46, `/50` 3,24, `/55` 3,76, `/60` 4,36. Beyazda `/45` 2,88. AA eşiği normal metinde 4,5'tir.
- **Etki:** Tarih, kaynak, sayaç ve bölüm etiketleri düşük görüşlü okurda ve güneş altında mobilde okunmaz. Sitenin akademik
  güvenilirliğini taşıyan künye ve kaynak satırları tam bu sınıftadır.
- **Standart:** WCAG 2.1 1.4.3 (AA).
- **Öneri:** Saydamlık yerine düz metin tonu jetonu. `ink-muted #636360` bütün açık zeminlerde (krem, beyaz, `#EEECE5`,
  `#F0E7DE`, `#F9F8F4`) en az 4,94:1 verir ve bugünkü `charcoal/65` görünümüne denktir. Süs öğesi (ayraç noktası, ikon)
  `aria-hidden` ile ayrılır, açık tonda kalabilir.
- **Komut:** `/impeccable typeset`, ardından `/impeccable polish`.

### [P1] Vurgu turuncusu metin rengi olarak yetersiz

- **Yer:** `text-accent`, örneklenen kontrast düğümlerinde en sık sınıftır (253 / 1.049). Bölüm başlıkları, "Kaynak" bağlantıları, "SON MADDELER"
  açılırları ve ders notu numaraları bu sınıftadır.
- **Ölçüm:** `#CC5833` krem zeminde 3,67, `#EEECE5` zeminde 3,54, beyazda 4,19, kömür zeminde 4,15. Vurgu zeminde beyaz yazı
  4,19'dur (54 düğüm, düğmeler).
- **Standart:** WCAG 2.1 1.4.3 (AA). 18,66 px üzeri kalın ve 24 px üzeri metin 3:1 ile geçer, sorun küçük etiketlerdedir.
- **Öneri:** Aynı tonda koyu metin jetonu `accent-ink #A7482A`. Açık zeminlerin hepsinde en az 4,76:1, düğme zemini olarak
  beyaz yazıyla 5,81:1 verir. Dolgu ve süs olarak `accent #CC5833` korunur, yani palet değişmez. Koyu zeminde metin için
  vurgunun açık tonu ya da krem kullanılır.
- **Komut:** `/impeccable colorize` (yalnız ton ayrımı), `/impeccable polish`.

### [P1] Koyu zeminli alt bilgide krem metin

- **Yer:** `components/Footer.tsx` sütun başlıkları ve alt satır (`text-cream/40 text-[10px]`, `text-cream/30`, `/35`, `/45`),
  13 sayfada aynı.
- **Ölçüm:** `#70706D` / `#1A1A1A` 3,50. axe çıktısından sayfa başına en çok 40 düğüm örneklenmiştir, 1.049 örneğin 295'i bu
  çifttir ve en sık çift budur. Koyu yeşil zeminde `cream/55` ve altı da 4,5'in altındadır.
- **Öneri:** Kömür zeminde `cream/65` (7,07:1). Koyu yeşil zeminde `cream/70` ve üstü. Tek bileşen olduğundan bütün sayfaların sayısını birlikte düşürür.

### [P2] Mevzuat dizininde "SON MADDELER" açılırları dokunma hedefi ihlali

- **Yer:** `/mevzuat`, her kanun kartındaki `summary` (276×16 px, alt alta). Mobilde 61, masaüstünde 57 ihlal.
- **Standart:** WCAG 2.2 2.5.8 (AA). 16 px yüksek hedefler arasında 24 px aralık yoktur.
- **Öneri:** `summary` öğesine `py-2` ya da `min-h-[44px]` ile dikey alan. Görünüm aynı kalır, yalnız dokunma alanı büyür.
- **Komut:** `/impeccable adapt`.

### [P2] Madde sayfasında mobilde iki bağlantı birbirine yakın

- **Yer:** `/mevzuat/tbk/madde-1`, "← Tüm mevzuat" (101×20) ve "Benzer maddelerde ara" (147×20).
- **Öneri:** Satır yüksekliği ya da aralık ile 24 px'e çıkarılır.

### [P2] Kaydırılabilir `pre` bloğu klavyeyle odaklanamıyor

- **Yer:** Hesaplama ve kavram sayfalarında `pre.whitespace-pre-wrap … bg-cream/80` (2 düğüm, axe `scrollable-region-focusable`).
- **Standart:** WCAG 2.1 2.1.1.
- **Öneri:** `tabIndex={0}` ve `role="region"` ile erişilebilir ad.

### [P3] Koyu sistem temasında tarayıcı çubuğu kömür, sayfa krem

- **Yer:** `app/layout.tsx:46-47` `themeColor` iki girdisi. Site `color-scheme: light` bildirir ve koyu tema taşımaz.
- **Öneri:** Tek `#F2F0E9` girdisi. Koyu tema kararı kullanıcıya sorulmuştur (soru 21).

### [P3] Dedektör kalıpları

Üç kalın tek kenar çizgisi ve bir yuvarlak köşeli vurgu kenarı (yukarıda). Düzeltme, bileşen ayrı bir görsel iş için
açıldığında yapılır.

## Sistemik kalıplar

- **Metin tonu jeton değil, saydamlıkla üretilmiştir.** `text-charcoal` için 15, `text-cream` için 13 farklı saydamlık değeri
  vardır. Aynı görev (ikincil metin) sayfadan sayfaya `/40` ile `/65` arasında değişir. Kontrast sorununun kökü budur. İki üç
  düz ton jetonu hem kontrastı hem tutarlılığı çözer.
- **Küçük büyük harfli etiket kalıbı** (`text-[10px]`/`text-[11px]`, `uppercase`, `tracking-widest`, düşük saydamlık) en düşük
  oranları üretir. Punto küçüldükçe ton koyulmalıdır, burada tersine açılmaktadır.

## Olumlu bulgular

- 14 sayfanın hiçbirinde 390 px'te yatay taşma yoktur.
- Kontrast dışında axe yalnız 2 düğümde ihlal bulur: Bağlantı adları, görsel alt metinleri, form etiketleri ve sayfa dili
  düzgündür.
- "İçeriğe atla" bağlantısı ölçülen sayfalarda vardır ve odakta görünür.
- Mobil menü düğmesi (22×22) küçük, ama aralık istisnasıyla geçer.
- Renk jetonlarına bağlılık yüksektir: 2.168 jeton sınıfına karşı yaklaşık 12 sabit renk, gri ölçek hiç yoktur.

## Önerilen sıra

1. **[P1] `/impeccable typeset` + `colorize`:** `ink-muted` ve `accent-ink` jetonları (kontrast testiyle), alt bilgi tonları,
   ardından en sık sınıfların dönüşümü. Cırcır testi saydam ikincil metnin yeniden artmasını engeller.
2. **[P2] `/impeccable adapt`:** mevzuat açılırları ve madde bağlantıları, `pre` odak.
3. **[P3] `/impeccable polish`:** `themeColor`, dedektör kalıpları. Sonra ölçüm `--etiket=sonra` ile tekrarlanır.

## Sonra ölçümü (2026-10-07 13:18, ilk düzeltme dalgası)

**Ham veri:** `raporlar/tasarim-denetim-sonra.json` · **Ekran görüntüleri:** `raporlar/gorsel/g15-<sayfa>-<masaustu|mobil>-sonra.jpg`

Yapılanlar:

- Renk jetonları tek kaynağa (`lib/tasarim-jetonlari.mjs`) taşınmıştır. Marka paleti değişmemiş, metin için üç düz ton
  eklenmiştir: `ink-muted #636360`, `accent-ink #A7482A`, `accent-light #D47354`. Test, paletin değişmediğini, yedi açık ve dört
  koyu zeminde AA'yı ve cırcırı sınar.
- Öneksiz `text-charcoal/30–60` (341 kullanım) `text-ink-muted` olmuştur. Küçük punto vurgu metni (148), gövde metnindeki vurgu
  bağlantıları ve ders notu numaraları (90), `.section-label`, şerh başlıkları ve `prose-legal` bağlantıları `accent-ink` olmuştur.
  Kömür zeminde kalan vurgu metni `accent-light`, `cream/30–45` ise `cream/55` olmuştur (alt bilgi, Hakkımda, yargı önizlemesi ve
  ödeme kartı, ders notu kartı).
- Madde rotasının kendi CSS'indeki saydam gri ve `#C45A38` tonları jeton değerlerine çekilmiştir. Alt bağlantı satırı dikey dolgu
  almıştır.
- Mevzuat dizinindeki "SON MADDELER" açılırları en az 44 px yüksekliğe çıkarılmıştır. Paylaşılabilir yanıttaki kaydırılabilir
  `pre` bloğu klavyeyle odaklanır (`tabIndex`, `role="region"`, ad). `themeColor` tek krem girdiye indirilmiştir.
- Koyu yeşil zeminli eski `app/[category]` sayfalarına dokunulmamıştır, zira `accent` orada 2,63 verir ve hiçbir vurgu tonu o zeminde
  4,5'e ulaşmaz. Bu sayfalar ayrı bir bulgudur (aşağıda).

| Sayfa | Kontrast, masaüstü | Kontrast, mobil | Hedef ihlali (iki genişlik) |
|---|---:|---:|---:|
| Ana sayfa | 90 → 6 | 81 → 6 | 0 → 0 |
| Makale | 31 → 2 | 34 → 1 | 0 → 0 |
| Mevzuat dizini | 218 → 3 | 221 → 3 | 118 → 4 |
| Madde (TBK m.1) | 25 → 0 | 25 → 0 | 2 → 0 |
| Ders notu | 144 → 11 | 147 → 10 | 0 → 0 |
| Yargı arşivi | 37 → 3 | 40 → 3 | 0 → 0 |
| Karar sayfası | 36 → 3 | 39 → 3 | 0 → 0 |
| Rehber | 39 → 2 | 42 → 2 | 0 → 0 |
| Hesaplama | 81 → 2 | 84 → 2 | 0 → 0 |
| İçtihat | 93 → 3 | 96 → 3 | 0 → 0 |
| Kavram | 42 → 2 | 45 → 1 | 0 → 0 |
| Yazar profili | 56 → 3 | 59 → 2 | 0 → 0 |
| Bölge (Van) | 43 → 2 | 46 → 1 | 0 → 0 |
| Üyelik | 30 → 3 | 33 → 2 | 0 → 0 |
| **Toplam** | **1.957 → 84** (iki genişlik) | | **120 → 4** |

Diğer axe ihlalleri 2 → 0, yatay taşma 0 → 0.

**13:31 ek düzeltme:** Mobil alt gezinmede etkin sekme `accent-ink`, TrustBar'daki `font-drama` satırı mobilde `accent-ink`
(masaüstünde 24 px büyük metin olduğundan `accent`) olmuştur. Yenilenen ölçümde (`tasarim-denetim-sonra.json` ve `-sonra.jpg`
dosyaları bu koşudandır) kontrast **77 düğümdür ve tamamı vurgu zeminli beyaz yazılı düğmelerdir.** Yukarıdaki tablo 13:18
koşusunu gösterir.

### Kalanlar (13:31 itibarıyla; ikinci dalgada kapananlar aşağıda)

- ~~[P1] Vurgu zeminli beyaz yazılı düğmeler (77 düğüm, 4,19:1).~~ 2026-10-08'de `accent-solid` ile giderilmiştir.
- ~~[P2] Mobil alt gezinmede etkin sekme etiketi (6 düğüm) ve ana sayfada bir `font-drama` vurgu satırı.~~ 13:31'de giderilmiştir.
- ~~[P2] Mevzuat dizininde alt bilgi bağlantıları (4 hedef).~~ 2026-10-08'de giderilmiştir.
- **[P2] `app/[category]` eski sayfaları.** Koyu yeşil zeminde `text-accent` ve tanımsız `text-light` sınıfı kullanılır. Sayfaların
  hâlâ yönlendirme dışı kalıp kalmadığı G25 regresyonunda denetlenecektir.

## İkinci dalga ve kapanış ölçümü (2026-10-08 06:50)

**Ham veri:** `raporlar/tasarim-denetim-sonra.json` (bu koşu) · **Ekran görüntüleri:** `raporlar/gorsel/g15-*-sonra.jpg`,
düğme seçenekleri `raporlar/gorsel/g15-dugme-{anasayfa,uyelik}-{a,b,c,d}.jpg`

- **Düğme dolgusu.** Dört seçenek ana sayfada ve üyelik sayfasında CSS enjeksiyonuyla yan yana çekilmiştir: `a` bugünkü `#CC5833`
  (4,19:1), `b` `#C15330` (4,62:1), `c` `accent-ink #A7482A` (5,81:1) ve `d` 18,67 px yazı. `c` turuncuyu belirgin biçimde
  kahverengiye çektiği, `d` ise üst çubuktaki "Danışmanlık" düğmesini çubuğun dışına taşırdığı için elenmiştir. `b`, kanal başına en çok 11 birim koyu olup
  görüntülerde `a`'dan ayırt edilememekte ve AA eşiğini geçmektedir. `accent-solid` jetonu olarak eklenmiş, düz `bg-accent` dolgusu
  37 dosyada bu jetona, açılan `hover:bg-accent/90` ise `hover:bg-accent-ink`'e çevrilmiştir. Turuncu dolgu üzerinde krem yazı 4,05:1
  verdiğinden yazı beyazdır. İki cırcır testi düz `bg-accent` dolgusunu ve krem yazı ile dolgu eşleşmesini yasaklar.
- **Odak göstergesi.** Dokuz metin girdisi genel `:focus-visible` çerçevesini `outline-none` ile kaldırmakta, yerine yalnız kenar
  rengi değişimi ya da beyaz zeminde 1,5:1 veren soluk bir halka koymaktaydı. Üst çubuk araması odağı hiç göstermemekteydi (WCAG
  2.4.7). `field-focus` (kenar `accent`, 4,19:1, ve halka) ile çerçevesiz girdinin kabı için `field-focus-within` tanımlanmış,
  girdilerin hepsi bu iki sınıfa bağlanmıştır. Derlenmiş sitede odaklanan girdinin kenarı `rgb(204, 88, 51)` olmaktadır. Cırcır
  testi `.tsx` dosyalarında `outline-none` kullanımını yasaklar.
- **Dokunma hedefi.** Alt bilgideki harita, Erciş ve e-posta bağlantıları `min-h-6` (24 px) ile WCAG 2.5.8 eşiğine çıkarılmıştır.
- **Dedektör kalıpları.** Üç bileşendeki ve madde rotası CSS'indeki kalın tek kenar vurgu çizgisi, ince tam kenar ile hafif vurgu
  zeminine dönüştürülmüştür. Cırcır testi kalıbın geri dönmesini engeller.
- **Bileşen tutarlılığı.** Dolgulu yuvarlak düğmeler 29 yerde 14 farklı dolgu ve punto birleşimiyle yazılmıştır. En sık iki
  birleşim (`px-6 py-3.5 text-sm`, `px-3 py-1.5 text-xs`) `.btn-primary` ve küçük etiket düğmesine karşılık gelir. Ölçümde sorun
  çıkmadığından toplu birleştirme yapılmamış, G16 ana sayfa düzenlemesine not olarak bırakılmıştır.

| Ölçüt (14 sayfa × 1280/390 px) | Önce (10-07 12:34) | İlk dalga (10-07 13:18) | Kapanış (10-08 06:50) |
|---|---:|---:|---:|
| axe `color-contrast` düğümü | 1.957 | 84 | **0** |
| Dokunma hedefi < 24 px | 120 | 4 | **0** |
| Diğer axe ihlali | 2 | 0 | **0** |
| 390 px'te yatay taşma | 0 | 0 | **0** |

Tam `npm run kalite` iki kez yeşildir (764 ve 766 test, derleme 601 ve 444 sn). Marka paleti değişmemiştir (test).

| # | Boyut | Önce | İlk dalga | Kapanış |
|---|---|---|---|---|
| 1 | Erişilebilirlik | 2 | 3 | 4 |
| 2 | Performans | 3 | 3 | 3 |
| 3 | Duyarlı tasarım | 3 | 4 | 4 |
| 4 | Tema | 2 | 3 | 3 |
| 5 | Uygulama bütünlüğü | 3 | 3 | 4 |
| | **Toplam** | **13/20** | **16/20** | **18/20 (iyi)** |

Tema puanı koyu tema kararına (soru 21), performans puanı G13'ün açık notuna (yargı arşivi TBT, G25'e devredildi) bağlıdır.

### İlk dalga sonundaki puan tablosu

| # | Boyut | Önce | Sonra |
|---|---|---|---|
| 1 | Erişilebilirlik | 2 | 3 |
| 2 | Performans | 3 | 3 |
| 3 | Duyarlı tasarım | 3 | 4 |
| 4 | Tema | 2 | 3 |
| 5 | Uygulama bütünlüğü | 3 | 3 |
| | **Toplam** | **13/20** | **16/20 (iyi)** |
