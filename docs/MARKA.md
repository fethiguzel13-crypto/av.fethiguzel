# Marka — «FG» mührü ve renk sistemi

Site ve mobil uygulama tek bir görsel kimliği paylaşır. Bu dosya o kimliğin
ne olduğunu, neden öyle olduğunu ve nereden geldiğini anlatır.

## İşaret

**«FG» mührü** — Av. Fethi Güzel'in baş harfleri, dolu bir disk üzerine
oyulmuş hâlde.

### Neden monogram

Terazi, tokmak, kitap gibi simgeler her hukuk uygulamasında bulunur ve
kimseyi işaret etmez. Marka, kişinin **adı** olmalı; baş harfler yalnız bir
kişiyi gösterir. Dolu disk + oyuk harf düzeni mühür geleneğine yaslanır —
hukuk metninin kendi görsel dili.

Bu karara üç deneme sonunda varıldı:

| Deneme | Neden elendi |
|---|---|
| `§` paragraf işareti | Küçük puntoda harf gibi değil, belirsiz bir kıvrım gibi okunuyordu |
| Terazi ikonu (Lucide `Scale`) | Stok simge; her hukuk uygulamasında var, kimseyi işaret etmiyor |
| Elle çizilmiş FG | Harf gövdeleri gerçek dış hat değil, kabaca yerleştirilmiş dikdörtgenlerdi |

### Neden bu düzen

Beş varyant üretilip **512, 96, 48 ve 28 piksel**te yan yana karşılaştırıldı:

| Varyant | 28 px sonucu |
|---|---|
| Çift halka mühür | Harfler halkaya değiyor, iç halka çamurlaşıyor |
| Tek kalın halka | Harfler taşıyor, sıkışık |
| **Dolu disk, oyuk harf** | **Okunur kalan tek varyant** |
| Kaideli mühür | Alt çizgi artefakt gibi duruyor |
| Yalın harfler | Kapsayıcı şekil yok; uygulama simgesi olamıyor |

Harf ölçeği de tarandı (0,72 · 0,78 · 0,84 · 0,90) ve **0,80** seçildi: 28
pikselde okunuyor, 512'de kenar boşluğu rahat.

### Neden yazı tipi değil, YOL

Harfler `d` içinde vektör yol olarak duruyor; hiçbir yazı tipine bağlı
değil.

Bu bir kez ölçülerek öğrenildi: `font-family="Cormorant Garamond"` yazan bir
SVG, o yazı tipi kurulu olmayan makinede **var olmayan bir fontla BİREBİR
aynı** çıktıyı veriyordu. Yani logo sessizce yedek yüze düşüyor ve marka
bozuluyordu. Android WebView'de, Linux CI'da, başka bir bilgisayarda aynı
riskin tamamı ortadan kalksın diye harfler dış hatta çevrildi.

**Kaynak:** Lora Italic (Google Fonts, SIL Open Font License 1.1). OFL, harf
dış hatlarından logo türetmeye açıkça izin verir. Lora uygulamada okuma
yüzeyinin serif yüzü olarak zaten paketli — logo ile metin aynı aileden.

### Neden maske

Harfler diskten **oyulur**, üstüne çizilmez. İşaret tek renkle tanımlanır ve
altındaki zemin harflerin içinden görünür. Bu, yalnız alfa kanalının
kullanıldığı yerlerde (Android bildirim çubuğu) da doğru çalışmasını sağlar.

### Tek kaynak

```
lib/marka-fg.mjs
```

Site (`components/BrandMark.tsx`), mobil uygulama
(`mobile/app-src/src/shell/MarkaIsareti.tsx`) ve simge üreteci
(`mobile/scripts/generate-icons.mjs`) **aynı dosyayı** okur. İki yüzey
ayrışamaz.

Yeniden üretim: `opentype.js` ile `font.charToGlyph('F'|'G').getPath(...)`,
300 birim gövde. `font.getPath()` kullanılmaz — OpenType özellik sorgularını
çalıştırır ve Lora'nın değişken yazı tipi GSUB tablosunda desteklenmeyen bir
ikame türüne çarpar.

## Renk

Site iki rolü ayırır; uygulama önce ayırmıyordu ve tek bir orman yeşiliyle
baştan sona boyandığı için cansız duruyordu.

| Rol | Değer | Nerede |
|---|---|---|
| **Kabuk** (`chrome` / `--cubuk`) | `#1A1A1A` | Üst çubuk, durum çubuğu, açılış ekranı, simge zemini |
| **Vurgu — düğme** (`accent` / `--brand`) | `#C24E28` | Dolu düğme zemini (üstünde beyaz yazı) |
| **Vurgu — metin** (`--vurgu`) | `#B8471F` | Açık zeminde turuncu metin: bağlantı, etiket, rakam |
| **Vurgu — koyu zemin** (`--vurgu-koyu`) | `#D96B45` | Kömür üstünde turuncu metin ve ikon |
| **Resmî metin** (`--resmi`) | `#2E4036` | Kanun metni bloğu |

### Neden üç turuncu

Sitenin ham turuncusu `#CC5833` üç bağlamın **üçünde de** erişilebilirlik
eşiğini geçmiyor:

```
beyaz yazıyla dolu düğme  → 4,19   (eşik 4,5 — kalır)
krem zeminde küçük metin  → 3,68   (kalır)
kömür zeminde küçük metin → 4,15   (kalır)
```

Aynı renk hissini korumak için üç ton tanımlandı. Farklar gözle ayırt
edilmeyecek kadar küçük, ölçüde ise eşiği geçiyor:

```
--brand      #C24E28  beyaz yazıyla   4,76 ✓
--vurgu      #B8471F  krem üstünde    4,65 ✓
--vurgu-koyu #D96B45  kömür üstünde   5,09 ✓
```

İşaretin kendisi `#CC5833` kalır — orası metin değil, dolu bir şekil; metin
kontrast eşiği uygulanmaz.

### Bölüm renkleri

Bölüm kimliği kayboldu sanılmasın: başlık çubuğunun altındaki ince şerit onu
taşımayı sürdürür (`BOLUM_SERIT`). Alt gezinmede etkin sekme ise **tek** bir
turuncuyla işaretlenir — dört ayrı renk «etkin» kavramını her sekmede yeniden
tanımlıyor ve hiçbiri marka rengi olmadığı için vurgu kimliksiz kalıyordu.

## Doğrulama

```bash
node mobile/scripts/design-audit.mjs   # kontrast, dokunma hedefi, taşma
node mobile/scripts/smoke-ui.mjs       # yazı tipleri gerçekten uygulanıyor mu
```

Denetim 19 ekranı gezer ve her metnin hesaplanan kontrastını ölçer; renk
sistemi değiştirildiğinde eşiği geçmeyen her öge orada görünür.
