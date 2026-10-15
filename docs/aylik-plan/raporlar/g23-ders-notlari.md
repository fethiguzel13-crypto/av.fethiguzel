# G23 — Ders notları kalite dalgası 2 · rapor

Bu rapor G23 adımları ilerledikçe doldurulmaktadır. Son güncelleme: 2026-10-15 (adım 2-7).

Ölçütler ve yöntem G19 ile aynıdır (`raporlar/g19-ders-notlari.md`). Ölçüm komutu `node scripts/ders-kanonik-olc.mjs --dalga=2`'dir,
ders listesi `lib/ders-notlari/kalite-dalgalari.mjs`'tedir.

## Başlangıç (2026-10-14 07:35)

Değer sütunu: Paragrafta ham artıklı paragraf sayısı, örnek olay/iskelet/tuzak/testte kalem sayısı, kaynakta doğrulanan dayanak
sayısı, şemada ders şeması sayısıdır.

| Ders | Paragraf | Örnek olay | İskelet | Tuzak | Kaynak | Şema | Test | Geçen |
|---|---|---|---|---|---|---|---|---|
| aile-hukuku | ✗ 119 | ✗ 7 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |
| borclar-ozel | ✗ 146 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |
| medeni-baslangic | ✗ 116 | ✗ 10 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |
| kiymetli-evrak | ✗ 95 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |
| sigorta-hukuku | ✗ 98 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |
| ceza-ozel | ✗ 81 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |
| ceza-muhakemesi | ✗ 80 | ✗ 6 | ✗ 0 | ✗ 0 | ✗ 0 | ✓ 1 | ✗ 0 | 1/7 |
| tuketici-hukuku | ✗ 82 | ✗ 7 | ✗ 0 | ✗ 0 | ✗ 0 | ✓ 1 | ✗ 0 | 1/7 |
| arabuluculuk | ✗ 95 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✓ 1 | ✗ 0 | 1/7 |
| vergi-hukuku | ✗ 92 | ✗ 8 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | ✗ 0 | 0/7 |

Örnek olay sütunu G19 başlangıcındaki gibi kalıp olayları sayar; ölçüt, olayların birbirinden farklı ve dayanaklı olmasını
aradığından hiçbiri geçmemektedir. Dalga 1'in on notu aynı ölçümde 7/7'de kalmaktadır.

## Bitiş (2026-10-15, `c74889b89`)

| Ders | Paragraf | Örnek olay | İskelet | Tuzak | Kaynak | Şema | Test | Geçen |
|---|---|---|---|---|---|---|---|---|
| aile-hukuku | ✓ 0 | ✓ 4 | ✓ 6 | ✓ 7 | ✓ 34 | ✓ 1 | ✓ 6 | 7/7 |
| borclar-ozel | ✓ 0 | ✓ 4 | ✓ 6 | ✓ 7 | ✓ 26 | ✓ 1 | ✓ 6 | 7/7 |
| medeni-baslangic | ✓ 0 | ✓ 4 | ✓ 6 | ✓ 7 | ✓ 29 | ✓ 1 | ✓ 6 | 7/7 |
| kiymetli-evrak | ✓ 0 | ✓ 4 | ✓ 6 | ✓ 6 | ✓ 28 | ✓ 1 | ✓ 6 | 7/7 |
| sigorta-hukuku | ✓ 0 | ✓ 4 | ✓ 6 | ✓ 6 | ✓ 24 | ✓ 1 | ✓ 6 | 7/7 |
| ceza-ozel | ✓ 0 | ✓ 4 | ✓ 6 | ✓ 7 | ✓ 25 | ✓ 1 | ✓ 6 | 7/7 |
| ceza-muhakemesi | ✓ 0 | ✓ 4 | ✓ 6 | ✓ 6 | ✓ 29 | ✓ 1 | ✓ 6 | 7/7 |
| tuketici-hukuku | ✓ 0 | ✓ 4 | ✓ 6 | ✓ 7 | ✓ 30 | ✓ 1 | ✓ 6 | 7/7 |
| arabuluculuk | ✓ 0 | ✓ 4 | ✓ 6 | ✓ 6 | ✓ 29 | ✓ 1 | ✓ 6 | 7/7 |
| vergi-hukuku | ✓ 0 | ✓ 4 | ✓ 5 | ✓ 7 | ✓ 33 | ✓ 1 | ✓ 6 | 7/7 |

On temsilci not yedi ölçütün tamamını geçmektedir ve bu durum `lib/__tests__/ders-kanonik-katman.test.mjs` ile her kalite kapısında
yeniden sınanmaktadır. Dalga 1'in on notu aynı ölçümde 7/7'de kalmaktadır, katmanlı temsilci not sayısı 20'dir.

## Yapılanlar

- **İçerik.** On ders için 40 işlenmiş örnek olay, 59 sınav iskeleti adımı, 66 tuzak ve 60 kısa test sorusu yazılmıştır. Her ders ayrı
  commit'tir (ayrıntı `ILERLEME.md`, 2026-10-14 ve 15). Olaylar kişi, tarih, tutar ve uyuşmazlık konusu taşır, süre ve tutar hesapları
  yalnız kanundaki oran ve sürelerle yapılmıştır. Her yıl yeniden değerlenen parasal sınırlar (tüketici hakem heyeti sınırı,
  arabuluculuk ücret tarifesi, vergi usulündeki ilan ve uzlaşma tutarları) tutar olarak yazılmamıştır.
- **Şemalar.** Şeması olmayan yedi derse kanun metnine bağlı birer şema eklenmiştir: edinilmiş mallara katılmanın tasfiyesi (TMK),
  satışta ayıp (TBK), kişilik hakkının korunması (TMK), çekte ibraz ve başvurma (TTK), rizikodan tazminata (TTK), hırsızlıkta inceleme
  sırası (TCK) ve vergilendirme süreci (VUK). Ceza muhakemesi, tüketici ve arabuluculuk derslerinin şeması önceden vardır. Toplam
  şema sayısı 12'den 19'a çıkmıştır.
- **Paragraf temizliği.** G19'un `bolumTemizle` kuralı dalga 2 notlarına da uygulanmış, on notta paragraf sayısı 5.262'den 3.536'ya
  inmiştir.
- **İç sürüm etiketi (adım 4, G20 devri).** Yirmi altı temsilci notun tamamı üreticinin "Yıllık (Konsolide Master)" etiketini
  başlıkta, açıklamada, anahtar sözcükte, bölüm başlığında ve paragraflarda taşımaktadır. Katman uygulanan 20 notta etiket
  `etiketTemizle` ile "Yıllık" biçimine indirilmiştir. Sayfa başlığı ve paylaşım kartı `getNote(...).h1`'den beslendiğinden aile hukuku
  notunun başlığı "AÜHF Aile Hukuku Yıllık Ders Notu", kart başlığı "AÜHF Aile Hukuku Yıllık" olmuştur.
- **Kalıp konu soruları (adım 5, G19 devri).** Katmanlı 20 notta dayanak taşımayan 316 üretilmiş konu sorusu (`topics[].mcq`) vardır,
  bunların 158'i kalıp şıklıdır ("Hocanın slaytını ezberden aktarmak", "İstinaf sebebini sıralamak"). Dalga 2'nin on notunda bu sayı
  156'dır. Sorular katmanlı notta çizilmemekte, yerlerini dayanaklı kısa test almaktadır. Bilgi kartları korunmuştur. Yayınlanabilirlik
  denetimi (`lib/content-quality.mjs`) konu sorularına bakmadığından sayfaların durumu değişmemiştir.

## Halüsinasyon denetimi

Ayrıntılı döküm `raporlar/g23-dayanak-denetimi.md` dosyasındadır.

- Dalga 2 katmanındaki 287 dayanağın tamamında aranan ifade depodaki kanun metninde aynen geçmektedir. İki dalganın toplamı 522
  dayanaktır ve tamamı doğrulanmıştır. Düzyazıdaki 200 madde göndermesinin tamamı var olan bir madde dosyasına gider.
- Katmanda içtihat künyesi, yüksek mahkeme adı ve doktrin yazarı yoktur, test bunları düzenli ifadeyle engeller.
- Bilinçli dışlamalar: Depodaki `vuk/madde-376.md` dosyası 376. maddenin ardından uzlaşmaya ilişkin ek maddelerin metnini de
  taşıdığından uzlaşma hükümleri dayanak yapılmamıştır. VUK m.104 ve m.118 dosyalarına Resmî Gazete dipnotu karışmıştır, bu
  fıkralar da dayanak ifadesi yapılmamıştır. Ceza muhakemesi katmanında uzlaştırma olayı, nitelikli hırsızlık sayılabilecek bir kurgudan
  güveni kötüye kullanma kurgusuna çevrilmiştir.
- Sınır: Otomatik denetim maddenin varlığını ve aranan ifadenin metinde geçtiğini kanıtlar. Önermenin maddeyi doğru yorumladığı ise
  madde metni okunarak yazılmış olup hukukçu okumasına açıktır. Kaynak gösterilen mevzuat.gov.tr adresleri 2026-10-15'te bu
  makineden yanıt alınamadığından denetlenememiştir. Yayından önce resmî metinle karşılaştırma ve adres denetimi G25'te yinelenir.

## Adım 6: Anayasa notu (soru 23)

Soru 23 yanıtsızdır. Varsayım, Anayasa ve İdari Yargılama Usulü Kanunu metninin mevzuat.gov.tr'den depoya alınmasını ve madde
sayımının resmî metinle karşılaştırılmasını öngörmektedir. 2026-10-15'te mevzuat.gov.tr bu makineden 30 ve 60 sn'lik iki denemede
yanıt vermemiştir. Sitede anayasa hukukunun ders notu ve ders grafı da bulunmadığından katman yöntemi uygulanamamaktadır, zira katman
yalnız var olan temsilci nota eklenir. Bu nedenle Anayasa notu yazılmamış, adım kabul ölçütü gereği raporlanmıştır. Metnin depoya
alınması, yeni bir kanun klasörü ve yaklaşık 180 yeni madde sayfası doğuracağından G25 öncesinde ayrı bir görev olarak ele alınmalıdır.

## Adım 7: Kapanış denetimi

- **Tasarım denetimi.** Aile hukuku temsilci notunda (`/ders-notlari/ankara/aile-hukuku-yillik`) 1280 ve 390 px genişlikte axe
  ihlali, kontrast hatası ve küçük dokunma hedefi 0, yatay taşma yoktur (`node scripts/tasarim-denetim.mjs --etiket=g23
  --sadece=ders-notu`, çıktı `raporlar/tasarim-denetim-g23.json`, görüntüler `raporlar/gorsel/g15-ders-notu-*-g23.jpg`). Sunucunun
  verdiği sayfa başlığı "AÜHF Aile Hukuku Yıllık Ders Notu | Av. Fethi Güzel", paylaşım başlığı "AÜHF Aile Hukuku Yıllık" olup HTML'de
  "Konsolide Master" ifadesi geçmemektedir.
- **Uçtan uca testler.** 15:40 tam kapısında derleme 895 sn'de geçmiş, uçtan uca adımı ise süreç başlatılamadığından
  (`netstat` çıkış kodu 0xC0000142, tarayıcı açılamamıştır) 0/8 kırılmıştır. Aynı derleme üzerinde 20:37 koşusu 29 testin 27'sini
  geçmiş, düşen ikisi düşük bellekte zaman aşımıdır (ilk açılan temsilci olmayan not ve ödeme formu). Bu iki dosya 21:00'de yeniden
  koşulmuş ve 10/10 geçmiştir (`logs/g23-e2e-2037.log`, `logs/g23-e2e-2105.log`).
- **Kalite kapısı.** Hızlı kapı 899 testte yeşildir (`logs/g23-hizli-2115.log`). 21:04'te başlatılan tam kapıda tip, lint ve dokuz
  test takımı geçmiş, derleme ise 497. saniyede hata iletisi vermeden kesilmiştir (`logs/g23-tam-2104.log`). Oturum 21:17'de ağ
  kesintisiyle (`ENOTFOUND`) sonlanmış, süreç ağacı kapanınca derleme de ölmüştür. Bu kırık, kod hatası sayılmamıştır. Tam kapı, 22:00
  oturumunda makine pilde (%47) ve boş bellek 365 MB olduğundan yeniden başlatılmamış, prize bağlı ilk oturuma bırakılmıştır.

## Kalan işler ve devir

- Katmansız altı temsilci not (bilişim, deniz ticareti, hukuka giriş, inşaat, rekabet, sermaye piyasası) ve 84 fakülte sayfasındaki
  974 liste satırı "Yıllık (Konsolide Master)" etiketini taşımaya devam etmektedir. Etiketin üretici düzeyinde ya da hub listesinde
  temizlenmesi G25'e bırakılmıştır.
- Katmansız notlarda üretilmiş konu soruları yerinde durmaktadır.
