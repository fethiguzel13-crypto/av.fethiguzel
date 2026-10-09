# G19 — Ders notları kalite dalgası 1

**Kapsam:** Kalite dalgasındaki on dersin dizine açık temsilci notu (`lib/ders-notlari/dizin-kanonik.json`, hepsi
`ankara/<ders>-yillik`). Ölçüt `docs/ders-notlari/KALITE-VE-ARASTIRMA.md` §4'ten türetilmiş yedi kalemdir
(`lib/ders-notlari/kanonik-kalite.mjs`, test `lib/__tests__/ders-kanonik-kalite.test.mjs`). Ölçüm komutu:
`node scripts/ders-kanonik-olc.mjs --ayrinti`.

## Ölçütler

| Ölçüt | Geçme koşulu |
|---|---|
| Paragraf | Öğretim bölümlerinde ham kanun başlığı artığı (`**…**`, `--- MADDE`) 0 ve her bölümde en az iki paragraf |
| Örnek olay | En az üç olay; iki olay arasında 8 sözcükten uzun ortak dizi yok; her olay kanun metninde doğrulanan bir dayanak taşır |
| İskelet | Sınav iskeleti en az dört adım |
| Tuzak | Tuzak defteri en az beş kalem, her kalem dayanaklı |
| Kaynak | En az bir adresli kaynak; nottaki bütün dayanakların ifadesi `content/mevzuat/<kanun>/madde-<n>.md` kanun metninde aynen geçer |
| Şema | Ders G18 şemalarından en az birini alır |
| Test | En az beş soru; dört şık birbirinden farklı, cevap geçerli, gerekçe ve dayanak var |

Değer sütunu: Paragrafta ham artıklı paragraf sayısı, örnek olay/iskelet/tuzak/testte kalem sayısı, kaynakta doğrulanan dayanak
sayısı, şemada şema sayısı.

## Başlangıç (2026-10-09 07:30, `775cbc258`)

| Ders | Paragraf | Örnek olay | İskelet | Tuzak | Kaynak | Şema | Test | Geçen |
|---|---|---|---|---|---|---|---|---|
| borclar-genel | ✗ 140 | ✗ 12 | ✗ 0 | ✗ 0 | ✗ 0 | ✓ 1 | ✗ 0 | 1/7 |
| medeni-usul | ✗ 105 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✓ 1 | ✗ 0 | 1/7 |
| ceza-genel | ✗ 94 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |
| icra-iflas | ✗ 111 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✓ 1 | ✗ 0 | 1/7 |
| miras-hukuku | ✗ 131 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✓ 1 | ✗ 0 | 1/7 |
| esya-hukuku | ✗ 133 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✓ 1 | ✗ 0 | 1/7 |
| is-hukuku | ✗ 71 | ✗ 6 | ✗ 0 | ✗ 0 | ✗ 0 | ✓ 1 | ✗ 0 | 1/7 |
| ticari-isletme | ✗ 97 | ✗ 7 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |
| ticaret-sirketler | ✗ 96 | ✗ 7 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |
| idare-hukuku | ✗ 94 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |

Bulgular:

- Örnek olayların tamamı aynı kalıptan üretilmiştir. On notta iki olay arasındaki en uzun ortak dizi 15-16 sözcüktür
  ("…'daki bir kira ve kefalet uyuşmazlığı içinde taraf, X rejimine dayanarak talep yöneltir. Karşı taraf unsurların oluşmadığını
  ileri sürer."); olayda kişi, tarih, tutar ve uyuşmazlık konusu yoktur.
- Notlardaki çoktan seçmeli sorular (`topics[].mcq`) biçimseldir ve yanlış şıkları konu dışıdır ("Hocanın slaytını ezberden aktarmak",
  "İYUK iptal davası"). Ölçüt yalnız yeni `kisaTest` alanını sayar.
- Öğretim bölümlerindeki paragrafların 71-140'ı kanun alıntısını ham başlık artığıyla taşır
  («**Sözleşmeden Doğan Borç İlişkileri A. …** --- MADDE 1- …»).
- Anayasa hukukunun temsilci notu, ders grafı ve yerel mevzuat dosyası bulunmadığından ölçüme girmemiştir (`gorevler/G19.md`).

## Bitiş (2026-10-09, `b4887ae7c`)

| Ders | Paragraf | Örnek olay | İskelet | Tuzak | Kaynak | Şema | Test | Geçen |
|---|---|---|---|---|---|---|---|---|
| borclar-genel | ✓ 0 | ✓ 4 | ✓ 6 | ✓ 8 | ✓ 28 | ✓ 1 | ✓ 6 | 7/7 |
| medeni-usul | ✓ 0 | ✓ 3 | ✓ 6 | ✓ 6 | ✓ 23 | ✓ 1 | ✓ 6 | 7/7 |
| ceza-genel | ✓ 0 | ✓ 3 | ✓ 6 | ✓ 7 | ✓ 21 | ✓ 1 | ✓ 6 | 7/7 |
| icra-iflas | ✓ 0 | ✓ 3 | ✓ 6 | ✓ 6 | ✓ 23 | ✓ 1 | ✓ 5 | 7/7 |
| miras-hukuku | ✓ 0 | ✓ 3 | ✓ 6 | ✓ 6 | ✓ 25 | ✓ 1 | ✓ 6 | 7/7 |
| esya-hukuku | ✓ 0 | ✓ 3 | ✓ 6 | ✓ 6 | ✓ 23 | ✓ 1 | ✓ 5 | 7/7 |
| is-hukuku | ✓ 0 | ✓ 3 | ✓ 6 | ✓ 6 | ✓ 23 | ✓ 1 | ✓ 5 | 7/7 |
| ticari-isletme | ✓ 0 | ✓ 3 | ✓ 5 | ✓ 6 | ✓ 22 | ✓ 1 | ✓ 5 | 7/7 |
| ticaret-sirketler | ✓ 0 | ✓ 3 | ✓ 6 | ✓ 6 | ✓ 21 | ✓ 1 | ✓ 5 | 7/7 |
| idare-hukuku | ✓ 0 | ✓ 3 | ✓ 6 | ✓ 6 | ✓ 26 | ✓ 1 | ✓ 6 | 7/7 |

On temsilci not yedi ölçütün tamamını geçmektedir ve bu durum `lib/__tests__/ders-kanonik-katman.test.mjs` ile her kalite kapısında
yeniden sınanmaktadır.

## Yapılanlar

- **Kanonik katman.** Elle yazılan içerik `lib/ders-notlari/kanonik/<ders>.mjs` dosyalarındadır ve `getNote` içinde
  `kanonikKatmanUygula` ile yalnız dersin temsilci notuna (`ankara/<ders>-yillik`) uygulanır. Üretilmiş 11.623 not dosyasına
  dokunulmamıştır. Ad değiştirmeli kopyalar ve dönem sürümleri olduğu gibi kalmaktadır (testle sınanır). Katmanın temsilci
  adresi `dizin-kanonik.json` ile testte eşitlenir.
- **İçerik.** On ders için 31 işlenmiş örnek olay, 59 sınav iskeleti adımı, 63 tuzak ve 55 kısa test sorusu yazılmıştır. Olaylar
  kişi, tarih, tutar ve uyuşmazlık konusu taşır, çözüm madde lafzına dayanarak adım adım kurulur. Hesap gerektiren olaylarda (miras
  payları, süre hesapları) sayılar yalnız kanundaki oranlarla bulunmuştur.
- **Görünüm.** `DersNotuView` katmanı olan notta "Sınav iskeleti", "Tuzak defteri" ve "Kısa test" bloklarını çizer. Örnek olayın
  altında dayanak maddeleri `/mevzuat/<kanun>/madde-<n>` bağlantısıyla gösterilir. Kısa test mevcut `McqBlock` istemci bileşenini
  kullanır, yeni istemci betiği eklenmemiştir.
- **Şemalar.** Şeması olmayan dört derse kanun metnine bağlı dört şema eklenmiştir (`lib/ders-notlari/semalar.mjs`):
  suçun inceleme sırası (TCK), tacir olmanın sonuçları (TTK), anonim şirketin kuruluşu ve organları (TTK), kamulaştırma süreci
  (2942 sayılı Kanun). Şema sayısı 8'den 12'ye çıkmıştır.
- **Paragraf temizliği.** Temsilci notta kanun alıntıları ham başlık artığından (`**…** --- MADDE n-`) arındırılmış, aynı bölümde
  daha önce geçen alıntıyı yineleyen kalıp paragraflar düşürülmüştür. Düşen paragraflar üreticinin "Aynı maddenin ikinci katmanı
  şöyledir" ve "Üçüncü okuma, lafzın istisna veya usul cümlesinedir" kalıplarıdır, ikincisi istisna içermeyen cümlelere de
  "istisna" demekteydi. On notta paragraf sayısı 5.682'den 3.666'ya inmiş, her öğretim bölümünde en az iki paragraf kalmıştır.

## Derlenmiş sitede ölçüm

Derleme sonrası `next start` üzerinde on temsilci not 390 ve 1280 px genişlikte açılmıştır (geçici betik `tmp/g19-goruntu.mjs`,
git dışı). "Önce" sütunu katman uygulanmayan ad değiştirmeli kopyadır (`ankara-bilim/<ders>-yillik`), içerik olarak temsilci notun
eski hâliyle aynıdır.

| Ölçü (on notun toplamı) | Önce | Sonra |
|---|---|---|
| İşlenmiş örnek olay | 80 (kalıp) | 31 |
| Sınav iskeleti, tuzak defteri, kısa test bloğu | 0 | 30 |
| Sayfa metninde `--- MADDE` artığı | 1.148 | 0 |
| Şema çizilen not (G19 öncesi; yeni şemalar dersin bütün sürümlerine gider) | 6 | 10 |
| Yatay taşma | 0 | 0 |

Kısa testte "Kontrol et" düğmesine basıldığında her sorunun gerekçesi görünmektedir. Tasarım denetimi (`node scripts/tasarim-denetim.mjs
--etiket=g19 --sadece=ders-notu-esya,ders-notu`) ilk turda katmanlı eşya notunda 390 px'te dört küçük dokunma hedefi bulmuştur:
Örnek olay altındaki yan yana madde bağlantıları 15 px yüksekliğindeydi. Bağlantılar 24 px'lik etiketlere çevrilmiş, aynı madde
tek bağlantıda birleştirilmiş, kural görünüm testine yazılmıştır. Yeniden derlemeden sonra iki sayfa iki genişlikte ihlal 0,
kontrast 0, küçük hedef 0'dır (`raporlar/tasarim-denetim-g19.json`).

Görüntüler `raporlar/gorsel/g19-borclar-genel-*.jpg` ve `g19-idare-hukuku-*.jpg` (olay önce/sonra, iskelet, tuzak, test).

## Halüsinasyon denetimi

Ayrıntılı döküm `raporlar/g19-dayanak-denetimi.md` dosyasındadır.

- Katmandaki 235 dayanağın tamamında aranan ifade depodaki kanun metninde aynen geçmektedir. Düzyazıdaki 190 madde göndermesinin
  tamamı var olan bir madde dosyasına gider.
- Katmanda içtihat künyesi, yüksek mahkeme adı ve doktrin yazarı yoktur; test bunları düzenli ifadeyle engeller.
- Bilinçli dışlamalar: HMK m.200'deki senetle ispat sınırı her yıl yeniden değerlendiğinden ve yerel metin yalnız ilk tutarı
  taşıdığından kullanılmamıştır. Kıdem tazminatı tavanı ve anonim şirket asgari sermayesi tutar olarak yazılmamıştır. Yerel TTK
  metninde dipnot sızıntısı bulunan fıkralar (m.3, m.5/2, m.371/2) dayanak ifadesi yapılmamıştır.
- Sınır: Otomatik denetim, maddenin varlığını ve aranan ifadenin metinde geçtiğini kanıtlar. Önermenin maddeyi doğru yorumladığı
  ise madde metni okunarak yazılmış, ayrıca hukukçu okumasına açıktır. Yerel mevzuat güncel görünmektedir (TCK m.32'de
  24/12/2025 tarihli 7571 sayılı Kanun değişikliği işlenmiştir), ne var ki yayından önce resmî metinle karşılaştırma G25'te
  tekrarlanmalıdır.

## Kalan işler ve devir

- Anayasa hukuku notu (soru 23) ve kalan 16 temsilci not G23'e devredilmiştir. Paragraf temizleyicisi (`bolumTemizle`) şimdilik
  yalnız katmanı olan notlara uygulanmaktadır.
- Üretilmiş notlardaki biçimsel `topics[].mcq` soruları yerinde durmaktadır. Temsilci notta yeni "Kısa test" bloğu bunlardan ayrı
  çizilir, kalıp sorular G23'te kaldırılabilir.
- Bazı kanun alıntılarında kaynak metindeki bozulma sürmektedir (örnek: TTK m.3'te "düzenl enen" ve alıntı içine karışmış dipnot).
  Bu, mevzuat dosyalarının kendisinden gelmektedir.
