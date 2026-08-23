# Akıcılık — ölçülen değerler ve alınan kararlar

Bu dosya tahminle değil ölçümle yazıldı. Bütün sayılar **4× yavaşlatılmış
işlemcide** (`Emulation.setCPUThrottlingRate: 4`), 412×915 ekranda, gerçek
derleme çıktısı üzerinde alındı. Orta sınıf bir Android telefonda gerçek
değerler bunun kabaca dörtte biridir.

Ölçüm betiği kalıcı değildir; `scripts/smoke-ui.mjs` içindeki *«arama tuş
başına donmuyor»* ve *«liste kaydırdıkça uzuyor»* adımları, bozulmayı
yakalayacak eşikleri kalıcı olarak tutar.

## Önce ve sonra

| Ölçüt | Önce | Sonra |
|---|---:|---:|
| Arşiv aramasında tuş başına gecikme (en kötü) | 4.825 ms | 104 ms |
| Kaydırma sırasında ana iş parçacığı bloğu | 79 × 5.741 ms | 1 × 89 ms |
| Kaydırmada stil yeniden hesabı | 379 kez / 693 ms | 0 |
| Arşiv açılışında uzun görev | 1.661 ms | 955 ms |
| İlk aramada tek blok | 2.614 ms | boşta hazırlanır |
| Listede görülebilen karar sayısı | 120 | tamamı |
| Geri dönüşte kaydırma konumu | kaybolurdu | korunur |

## Dört kök neden

### 1. Katlama her tuş vuruşunda cihazda yapılıyordu

Arama, satırı Türkçe'ye duyarsız hâle getirip (`toLocaleLowerCase('tr-TR')`
ve yedi regex) içinde arıyordu. Yirmi üç binden fazla satır × her tuş = donma. Dar
sorgularda liste sonuna kadar tarandığı için gecikme sorgu uzadıkça
**büyüyordu** — 544 ms'den 4.825 ms'ye.

Katlama derleme zamanına alındı: `build-yargi-index.mjs` artık
`icthat/arama.txt.gz` üretir — arşivle AYNI satır sayısında, satır satır
hizalı (ölçüm sırasında 23.747 satır / 839 KB). Cihaz hazır metni
`indexOf` ile tarar. Dosya ayrıdır ve arşiv listesi açıldıktan sonraki ilk
boş anda indirilir; kullanıcı yazmaya başladığında dizin hazırdır.

Dizin düşerse arama **çalışmaya devam eder**, yalnız eski yavaş yola döner.
Sessiz bir bozulma olduğu için hem `verify-release.mjs` dosyanın varlığını,
hem duman testi tuş gecikmesini denetler.

### 2. Dipteki «yükleniyor» iskeleti sonsuz animasyon çalıştırıyordu

`.skeleton::after` kuralı `shimmer` animasyonunu sonsuz döndürür. Sonsuz
listede o çubuk hep ekranda kaldığı için kaydırma boyunca her kare boyama
istiyordu. Yerine düz metin kondu.

### 3. Kaydırma gözlemcisi arka arkaya sayfa ekliyordu

`IntersectionObserver` her eklemeden sonra yeniden kuruluyor, nişan hâlâ
görünür alandaysa anında yeniden ateşliyordu. Tek bir kaydırma jesti listeyi
birkaç yüz satır büyütüyor, her büyüme bütün listeyi yeniden uzlaştırıyordu.
`bekleyenRef` bir sonraki çizim tamamlanmadan ikinci eklemeyi keser.

### 4. Gzip açma saf JavaScript'teydi

`fflate` ana iş parçacığında çalışır; 1,1 MB'lık arşiv indeksi tek parça
1.250 ms'lik bir blok üretiyordu. Mümkün olan her yerde tarayıcının yerel
`DecompressionStream` çözücüsüne geçildi (`yargi.ts` → `acGzip`, `kasa.ts`).
Eski WebView'de `fflate`'e düşülür.

## Alınan kararlar

**`content-visibility: auto` KALDI.** 540 satırda hafifçe zararlı, 1.620
satırda net faydalı ölçüldü (1 × 89 ms yerine 8 × 480 ms uzun görev). Derin
kaydırma tam da bu özelliğin var olma sebebi olduğu için tutuldu. Sanal liste
kütüphanesi yerine bunun seçilmesi bilinçlidir: satırlar ekran okuyucuda ve
sayfa içi aramada bulunur kalır.

**Sanal liste (windowing) KULLANILMADI.** Ölçüm, darboğazın DOM büyüklüğü
değil betik ve stil işi olduğunu gösterdi; ikisi de yukarıdaki dört düzeltmeyle
gitti. Erişilebilirlik bedeli ödenmedi.

**120 sonuç sınırı KALDIRILDI.** Liste dibe yaklaştıkça 60'ar satır uzar.
Önceki sürümde yirmi binden fazla kararlık arşivin görünen yüzü 120 karardı ve daha
fazlasına ulaşmanın yolu yoktu.

**Kaydırma konumu HATIRLANIR.** Her gezinme sayfayı tepeye alıyordu, geri
dönüş dâhil. Artık `navigate()` bir bayrak bırakır: ileri gezinmede tepeden
başlanır, geri dönüşte bırakılan yere dönülür (`router.ts`). Liste sayfaları
kademeli çizildiği için tek başına yetmez; `IcthatApp` sayfa sayısını modül
düzeyinde tutar ve satırlar geri geldiğinde konumu yeniden uygular.

## Aynı kusurun mevzuat tarafı

`PortalApp` madde süzgeci de her tuşta bütün maddeleri yeniden katlıyordu
(TMK'da 1030 madde). Katlama artık pakete bağlıdır ve sorgu
`useDeferredValue` ile ertelenir.

## Ölçüm nasıl tekrarlanır

```
node scripts/build-app.mjs --app=asistan
node mobile/scripts/smoke-ui.mjs      # eşikli denetimler
node mobile/scripts/design-audit.mjs  # kontrast, dokunma hedefi, taşma
```

Serbest ölçüm için Playwright oturumunda `Emulation.setCPUThrottlingRate: 4`
ve `Input.synthesizeScrollGesture` kullanın. `window.scrollBy` döngüsüyle
ölçmeyin: o yöntem kaydırmayı değil ölçüm döngüsünün kendisini ölçer ve
yanıltıcı sonuç verir — bu dosyadaki ilk ölçümler o yüzden bir kez elden
geçirildi.

---

# Görsel — bulunan ve düzeltilen kusurlar

## Marka yazı tipleri hiç uygulanmıyordu

En görünmez kusur buydu. `main.tsx` yalnız `latin-ext` alt kümelerini
yüklüyordu; gerekçe doğruydu (Türkçe İ/ğ/Ş temel Latin kümesinde yok), ne var
ki `latin-ext`in `latin`i kapsadığı varsayımı yanlıştı. İkisi ayrık kümedir:
`latin-ext` yalnız U+0100 sonrasını taşır.

Ölçüm: «Hukuk» kelimesi Plus Jakarta Sans ile de düz serif ile de **108,9 px**
geliyordu — marka fontu temel Latin harflerinde hiç çizmiyordu. Yalnız «Şşğİ»
doğru yüzdendi (82,9 px / sistemde 71,1 px). Türkçe metinde aksanlı harf her
kelimede bulunduğu için ekrandaki her satır **iki ayrı yazı tipinin
karışımıydı**; tek boşluklu etiketlerde harf genişlikleri tutmadığı için
«ÜYELİKLE» gibi başlıklarda aralık da bozuluyordu.

Düzeltme: her ailenin her ağırlığı için `latin` ve `latin-ext` birlikte
yüklenir. Ayrıca `IBM Plex Mono 700` eklendi — rozetler `font-mono font-bold`
kullandığı hâlde o yüz yüklenmiyor, tarayıcı sahte kalın üretiyordu.

Duman testine kalıcı denetim kondu (*«marka yazı tipleri gerçekten
uygulanıyor»*): on üç yüzün her biri için aynı kelime yedek yüzden farklı
genişlikte gelmeli.

## Aynı bilgi ekranda üç kez

Arşiv satırı üstte «CEZA GENEL KURULU» rozetini, yanında «10.06.2026»
damgasını, altında da «Yargıtay Ceza Genel Kurulu, E. 2025/525, K. 2026/350,
T. 10.06.2026» künyesini basıyordu. `kunyeKisa()` rozetle çakışan daire adını
ve tarihi künyeden atar; geriye ayırt edici olan kalır: esas ve karar numarası.

## Başlık çubuğu sayfanın başlığını tekrar ediyordu

Çubukta «Mevzuat», hemen altında yine «Mevzuat». Sekme köklerinde çubuk artık
uygulamanın adını yazar; içeri girildiğinde bağlama döner (bir maddedeyken
kanunun adı, bir kararda arşiv). Aynı düzeltmeyle sekme köklerindeki geri oku
da kaldırıldı — oraya sekmeye basarak gelinir, geri gidilecek yer yoktur.

## Ücretsiz önizleme kararın hiçbir cümlesini göstermiyordu

Yargıtay metinleri künye satırı, büyük harfli konu başlıkları ve atıf yapılan
maddelerin listesiyle başlar; 420 karakterlik önizlemenin tamamını bu blok
yiyordu. `kararGovdesi()` `"İçtihat Metni"` damgasına kadar olan kısmı atar
(örneklemde 337/337 kararda bulundu) ve kesimi cümle sonuna denk getirir.
Aynı blok tam metin görünümünden de düşürüldü: künye, konu ve maddeler zaten
sayfanın tepesinde duruyor.

## Sonuç sayacı süzgeçsizken yanıltıyordu

Başlıkta «25.902 karar» yazarken hemen altında «60+ sonuç» görünüyordu. Sayaç
artık yalnız arama ya da süzgeç varken çıkar.
