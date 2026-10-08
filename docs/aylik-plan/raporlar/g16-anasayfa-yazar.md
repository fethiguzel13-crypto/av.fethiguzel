# G16 — Ana sayfa ve yazar sayfaları değerlendirmesi

⚠️ Tek bağlamda yapılmıştır: Başsız oturumda alt ajan açılmadığından impeccable critique'in iki bağımsız değerlendirmesi (tasarım
incelemesi ve detektör) sırayla yürütülmüştür. Detektör çıktısı tasarım incelemesi yazıldıktan sonra okunmuştur.

**Tarih:** 2026-10-08 · **Derleme:** `7db889d91` · **Ekran görüntüleri:** `raporlar/gorsel/g16-{anasayfa,yazar,akademik,eserler}-{masaustu,mobil}-once.jpg`

## Ölçüler

| Sayfa | Masaüstü yükseklik | Mobil yükseklik | Bölüm |
|---|---:|---:|---:|
| Ana sayfa | 9.990 px | 13.653 px | 11 (günlük içtihat bölümü verisiz olduğu için gizli) |
| `/avukat-fethi-guzel` | 4.574 px | 6.682 px | 4 |
| `/akademik-profil` | 4.036 px | 5.198 px | 4 |
| `/eserlerim` | 3.635 px | 4.951 px | 2 |

Detektör (`detect.mjs`, 14 dosya): 0 bulgu. G15'in kontrast, hedef ve taşma ölçümü bu sayfalarda 0'dır.

## Bulgular

### [P1] Külliyat sayıları altı yerde ve birbiriyle çelişen değerlerle yazılmıştır

Ana sayfanın ilk ekranında 47 / 8.000+ / 39.700+ / 550+ sayıları yer alır. Aynı sayılar TrustBar'da, LibraryStrip'te, Yargıtay
önizlemesinin düğmesinde (39.718), Hakkımda bölümünde (7.800+) ve rehber çağrısında (554, 50+) yinelenir. Elle yazılmış değerler
üretimden okunan değerlerle uyuşmaz: Madde sayısı 8.000+ ile 7.800+, rehber sayısı 550+ ile 554 ve 579 arasında değişir. Alt bilgi
"45+ kanun · 7.800+ madde şerhi", SSS yanıtı "45+ mevzuat kaynağı; 7.800'ü aşkın madde metni ve akademik şerh" der.

"7.800+ madde şerhi" ifadesi ayrıca içerik bakımından yanlıştır. Kalite kapısından geçen, yayımlanabilir şerh sayısı 5.143'tür
(`siteSayilari().serh`). Geri kalan şerhler şablon olduğu için gizlenmekte ve dizine kapatılmaktadır (PRODUCT.md, ilke 2).

**Karar:** Sayılar yalnız `siteSayilari()`'ndan gelir ve sayfada tek bir şeritte gösterilir. İstemci bileşenleri (About, Footer,
LibraryStrip) sayıyı ya prop olarak alır ya da sayısız yazılır. Cırcır testi rakamla yazılmış külliyat sayısını engeller.

### [P1] Yazar bilgisi üç bölümde, uyum beyanı dört yerde tekrarlanır

Doktora çalışması, e-duruşma monografisi ve İngilizce bilgisi TrustBar'da, CredentialsStrip'te ve Hakkımda bölümünün sayı satırında
aynen yinelenir, alt bilgi aynı listeyi dördüncü kez verir. "Nesnel unvan ve yayın · reklam yasağına uygun · sonuç vaadi yok",
"Nesnel mesleki bilgiler · Reklam yasağına uygun bilgilendirme" ve "Reklam yasağına uygun, nesnel unvan ve yayın bilgisi esastır"
cümleleri uyumu kendisi ilan eder. Uyum beyanla değil içerikle sağlanır, beyan okur için bilgi de taşımaz. Otorite, külliyatın ve eserin kendisi
gösterildiğinde kurulur.

**Karar:** TrustBar ile CredentialsStrip tek "yazar ve eserler" bölümünde birleşir, Hakkımda bölümü yazarı ve eseri bir kez anlatır.
Uyum beyanı cümleleri kaldırılır, yerine hiçbir şey konmaz.

### [P2] Kullanıcıya dönük SEO notu ve tarafsız olmayan başlık

- Rehber çağrısında "Arama motorları için tam dizin: /bilgi" cümlesi okura yazılmıştır. Kaldırılır.
- Alt bilgi başlığı "Çözüm için Buradayız." bir hizmet sloganıdır. Tarafsız bilgi diline en yakın biçim "İletişim ve büro"
  başlığıdır. Değişiklik yalnız metni nötrleştirdiği için kullanıcı yanıtı beklenmeden yapılır.

### [P2] Ana sayfa mobilde 13.653 px'tir

Mobilde on bir bölüm ve dokuz hesaplama kartı art arda gelir. Tekrar eden üç bölüm birleştiğinde sayfa kısalır. Hesaplama
kartları mobilde ilk dört kartla sınırlanır, "Tüm araçlar" bağlantısı korunur.

### [P3] Güncel içtihat bölümü verisiz kaldığında iz bırakmaz

`DailyNews`, `public/data/daily.json`'da vurgu yoksa hiç çizilmez. Yerel veri 11 Eylül tarihli ve vurgusuzdur. Uzak `main`'deki
günlük commit'ler yayın günü birleşince bölüm görünür (G26). Ana sayfanın "güncel içtihat" ayağı veri olmadığında `/icthat`
bağlantısını taşıyan kısa bir satırla korunur.

### [P1] Yazar sayfaları aynı sayı hatasını taşır, eserler sayfası yalnız monografiyi gösterir

- `/avukat-fethi-guzel` kimlik listesinde ve "Bilgilendirme yaklaşımı" kutusunda "7.800+ kanun maddesi ve akademik şerh" yazar.
  Dört kutucuk (doktora, kitap, İngilizce, açık erişim) ana sayfadaki CredentialsStrip'in aynısıdır ve hemen üstteki listeyi tekrarlar.
- "Bilgilendirme yaklaşımı" kutusu ve `/eserlerim` girişi ("Nesnel yayın bilgisi — reklam yasağına uygun") uyumu beyan eder.
- `/eserlerim` tek monografiyi ve satış kanallarını gösterir. Yazarın sitedeki asıl külliyatı olan yayımlanabilir şerhler
  ve makaleler bu sayfadan bağlanmaz. Yazar sayfasından eserlere, şerh külliyatına ve makalelere giden yol yoktur.

**Karar:** Sayılar `siteSayilari()`'ndan gelir. Tekrar eden kutucuk sırası kaldırılır. `/eserlerim` monografinin altında "sitedeki
yayınlar" bölümünü (şerhli madde sayısı ve `/mevzuat` bağlantısı, makaleler) taşır. Bu bölüm yalnız var olan içeriğe bağlanır,
yeni künye yazılmaz.

### Dokunulmayanlar (kullanıcı yanıtı bekleyen sorular)

- Yazar sayfasındaki "Bölgesel hukuki bilgilendirme" ızgarası (12 bölge sayfası) soru 10'a bağlıdır.

- TrustBar'daki "Van · Erciş — Yerel avukatlık ve arabuluculuk" kutucuğu ve profil fotoğrafının dosya adı soru 10'a bağlıdır.
- Üst çubuk ve ilk ekrandaki "Danışmanlık" düğmesi ile mobil çubuktaki "Form" düğmesi soru 13'e bağlıdır.
- "Avukat & Arabulucu" sıfatı soru 12'ye, sitede bulunmayan yazar bilgileri soru 14'e bağlıdır.

## Güçlü yanlar

- İlk ekran kimliği ve külliyatı birlikte verir, arama ilk eylemdir.
- Yargıtay önizlemesi gerçek künyelerle (İBK, HGK) arşivin niteliğini gösterir, ücret dijital içerik bedeli olarak yazılmıştır.
- Sık aranan madde bağlantıları JavaScript'siz ve taranabilirdir.

## Sezgisel puanlar (0–4)

| Sezgi | Puan | Not |
|---|---:|---|
| Sistem durumunun görünürlüğü | 3 | Sayılar canlı, ama çelişkili |
| Gerçek dünyayla uyum | 3 | Hukuk terimleri yerinde |
| Kullanıcı denetimi | 3 | |
| Tutarlılık | 2 | Aynı bilgi farklı değerlerle |
| Hata önleme | n/a | Ana sayfa form taşımaz |
| Hatırlamak yerine tanıma | 3 | |
| Esneklik | 3 | Arama, kısayol bağlantıları |
| Sade tasarım | 2 | Tekrar eden üç bölüm, uyum beyanları |
| Hatadan dönüş | n/a | |
| Yardım | 3 | SSS |
