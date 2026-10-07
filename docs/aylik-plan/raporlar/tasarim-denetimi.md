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
