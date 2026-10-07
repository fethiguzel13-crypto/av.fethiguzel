# Yargı kararları yayın hazırlığı (G14) — rapor

**Tarih:** 2026-10-07 · **Alt plan ve ayrıntı:** `docs/aylik-plan/gorevler/G14.md` · **Kullanıcı soruları:** 19 ve 20

## Özet

Web arama indeksi ve mobil uygulama arşivi artık yalnız emsal nitelikli ve benzersiz kararları taşımaktadır. 7 Ekim 12:00
derlemesinde arşivdeki 114.625 kararın 39.718'i yayına girmiş, 74.907'si süzülmüştür. Ücretli karar indeksi `public/` dışına
taşınmış olup doğrudan istenemez. Karar sayfası sunucuda künyeyi ve kararın başını basar, tam metin yalnız üyeye açılır. Aynı
derlemede mobil madde atıflarındaki bir eşleme hatası da giderilmiştir. `data/yargi-kararlari/` altında hiçbir dosya
değiştirilmemiştir, oraya yalnız hasat motoru yazar.

## Yayına giren küme

Kural `mobile/scripts/lib/yayin-suzgec.mjs` içindedir. Hasat motorunun emsal defterinde (`_state/benzerlik.jsonl`) yararlı
işaretli (`u = 1`) kararlar yayına girer. İçtihadı birleştirme kararları etiketten bağımsız olarak her zaman girer, zira
bağlayıcıdır. Defterde olmayan karar girmez. `--hepsi` bayrağı eski davranışı geri getirir.

| Kademe | Yayında | Arşivde | Oran |
|---|---:|---:|---:|
| İçtihadı birleştirme | 40 | 40 | %100 |
| Hukuk Genel Kurulu | 16.309 | 30.865 | %53 |
| Ceza Genel Kurulu | 6.116 | 7.890 | %78 |
| Hukuk daireleri başkanlar kurulu | 1.797 | 15.643 | %11 |
| Ceza daireleri | 7.444 | 19.449 | %38 |
| Borçlar daireleri | 2.770 | 11.289 | %25 |
| Medeni daireler | 2.286 | 11.007 | %21 |
| İş daireleri | 2.258 | 10.082 | %22 |
| Hukuk daireleri (diğer) | 404 | 541 | %75 |
| İcra daireleri | 294 | 7.817 | %4 |
| Sınıflanmamış | 0 | 2 | — |
| **Toplam** | **39.718** | **114.625** | **%35** |

Süzülen 74.907 kararın büyük kısmı daha önce inen bir karara benzeyen kararlardır, kalanının emsal niteliği zayıftır
(7 Ekim sabahı sayımı: 54 bin benzer, 20 bin zayıf). Hasat sürdükçe sayılar değişir. Sayaç `public/data/yargi-stats.json`
dosyasından okunur, `lib/site-stats.ts` yedeği 39.718'dir.

## Çıktılar, önce ve sonra

Önce: 11 Eylül 2026 üretimi (süzgeçsiz, 70.249 karar). Sonra: 7 Ekim 2026 12:12 üretimi.

| Dosya | Önce | Sonra |
|---|---:|---:|
| Web indeksi `data/yayin/yargi-index.json.gz` (önceki yeri `public/data/`) | 70.249 satır · 2.410 KB | 39.718 satır · 1.904 KB |
| Mobil arşiv `mobile/data-src/icthat/archive.json.gz` | 70.249 satır · 2.408 KB | 39.718 satır · 2.445 KB |
| Mobil arama dizini `arama.txt.gz` | 2.075 KB | 1.802 KB |
| Tam metin parçaları (izlenmez, şifreli kasaya girer) | 128 MB | 80 parça · 148,9 MB · eksik metin 0 |
| Madde atıf dizini `mevzuat/atif.json.gz` | 21 KB | 36 KB |

Mobil arşivin satır sayısı azalmasına karşın boyutu artmıştır, zira satırlar artık konu başlığını ve madde atıflarını taşır.
Eski arşiv bu zenginleştirmeden önce üretilmişti. Konu başlığı alan satır 27.111'dir (%68), madde atıfı taşıyan satır 5.921'dir
(%15).

## Madde atıfı eşlemesi

`build-yargi-index.mjs` bir kanun numarasını uygulamadaki kanun paketine, o numarayla en sık anılan ada bakarak bağlar. 2026'da
inen kararlar atfı çoğunlukla «5271 sayılı Kanun'un 230. maddesi» biçiminde yazdığından, ilk süzgeçli derlemede 5271 ve 4721 için
en sık ad «Kanun'un» çıkmış, Ceza Muhakemesi Kanunu ile Türk Medeni Kanunu eşlemeden düşmüştür. `mobile/scripts/lib/atif-ad.mjs`
bu tür geri gönderme adlarını ad sayımından ayırır, atfın kendisi numarayla bağlanmaya devam eder.

| Ölçü | 11 Eylül | Düzeltmesiz (7 Ekim 10:13) | Düzeltmeli (7 Ekim 12:12) |
|---|---:|---:|---:|
| Bağlanan kanun | 26 / 46 | 24 / 46 | 31 / 46 |
| Bağlanan atıf | 7.027 | 5.803 | 17.637 |
| Atfı bulunan madde | 1.044 | 649 | 1.521 |

Düzeltmeyle Hukuk Muhakemeleri Kanunu (6100), Türk Borçlar Kanunu (6098), Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu
(5510), Kamu İhale Sözleşmeleri Kanunu (4735) ve Yabancılar ve Uluslararası Koruma Kanunu (6458) ilk kez bağlanmıştır. Üç paket
mülga kanundan yürürlükteki kanuna geçmiştir: Türk Ticaret Kanunu 6762'den 6102'ye, Vakıflar Kanunu 2762'den 5737'ye,
Belediye Kanunu 5272'den 5393'e. Seçim kuralı değişmemiştir (aynı pakete aday birden çok numara varsa «mülga» ifadesine en az
komşu olan kazanır). Değişen yalnız aday listesinin artık bu kanunları da içermesidir.

## Güvenlik ve erişim

- Ücretli indeks `data/yayin/yargi-index.json.gz` yolundadır. Next yalnız `public/` klasörünü statik sunduğundan dosya doğrudan
  istenemez. Eski adres üyelik API'sine yönlenir ve üye olmayana 401 döner (derlenmiş sitede sınanmıştır).
- Karar sayfası (`/yargi-kararlari/[id]`) sunucuda künye, daire, tarih, konu ve kararın ilk ~240 karakterini basar. Tam metin
  yalnız üyeye, istemcide `/api/yargi/karar/[id]` üzerinden gelir. İndekste olmayan kimlik 404 döner.
- Karar sayfaları `noindex, follow` olarak kalmıştır (soru 20).
- Mobil tam metin parçaları uygulamaya şifreli kasa olarak girer, anahtar parçaları pakete gömülmez.

## Doğrulama

- Birim testleri: `yayin-suzgec` 5/5, `yargi-indeks-yolu` 3/3, `yargi-karar-sayfa` 8/8, `parca-yaz` 3/3, `atif-ad` 2/2.
- Mobil duman testi (`smoke-ui`) 23 adımın tamamında yeşildir. Konu başlığı ve tuş başına arama adımları G14'ten önce kırmızıydı.
  Örnek karar, arşivden çıkan `16851400` yerine içtihadı birleştirme kararı `752428200` yapılmıştır.
- Tam kalite kapısı (`npm run kalite`, 12:12–12:24) yeşildir: 753 test, derleme 388 sn, derleme taraması geçmiştir.

## Açık konular

1. **Soru 19:** Üyelere açık arşivde de yalnız süzülmüş küme mi kalsın? Yanıt gelene kadar iki çıktı da süzülmüş kümeyi taşır.
2. **Soru 20:** Karar sayfaları dizine açılsın mı? Adım 6 (madde sayfasından karara bağlantı) bu yanıta bağlıdır, zira G11 kuralı
   iç bağlantıyı yalnız dizine açık sayfaya verir.
3. Üyeli istekte indeksin okunması yerelde sınanamamıştır (üretim sırrı gerekir). Yayın günü üye hesabıyla bir kez denenmelidir.
4. Mobil tam derleme rehber, kütüphane ve günlük tohum verisini de yeniden üretir. Bunlar G14'ün kapsamı dışında olduğundan
   commit'e alınmamıştır, yayın günündeki tam derlemede güncellenir.
