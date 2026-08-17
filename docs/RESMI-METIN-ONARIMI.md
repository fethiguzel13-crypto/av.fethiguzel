# Resmî metin onarımı — 17.08.2026

Mevzuat uygulamasının tek vaadi şudur: gösterdiği madde metni Resmî
Gazete'dekiyle aynıdır. Bu belge, o vaadin nasıl doğrulanabilir hâle
getirildiğini anlatır.

## Ne bulunmuştu

İki ayrı kusur vardı ve ikisi de ölçülmüştü, tahmin edilmemişti.

**1. Özetlenmiş resmî metin — 23 madde.** `official` alanında kanun metni
yerine kanun metni HAKKINDA cümle duruyordu:

```
MADDE 14 – (1) İşveren;
*(Tüm alt bentler resmi madde metninde sırasıyla a ve b bentleri olarak
  verilmiştir. İş kazası/meslek hastalığı kayıtlarını … düzenler.)*
```

Kullanıcı maddeyi okuduğunu sanırken özet okuyordu. 22'si İSG'de, 1'i İş
Kanunu'ndaydı.

**2. Kirlenmiş resmî metin — külliyatın tamamına yakını.** Madde metinlerine
üç ayrı şey yapışmıştı:

- **Bölüm başlıkları:** `…saklıdır. ÜÇÜNCÜ BÖLÜM VAKIFLAR` (TMK m.100)
- **Dipnot gövdeleri:** TMK m.32'nin ortasında, cümlenin tam ortasında bir
  Anayasa Mahkemesi iptal dipnotu duruyordu.
- **OCR kelime bölünmeleri:** `kara r verir`, `re ddolunabilir`,
  `B ir ha kkın`, `iyini yet i ddiasında`. 1.027 maddede tespit edilmişti.

Üçüncüsü aramayı da bozuyordu: TMK m.606 "reddolunabilir" aramasında
bulunamıyordu.

## Ne yapıldı

Metin **kaynaktan yeniden alındı**. Elle düzeltme yapılmadı; düzeltme
yapılsaydı hangi karakterin resmî, hangisinin bizim olduğu bilinemezdi.

### Boru hattı

```bash
# 1. Resmî metni indir (TLS zinciri eksik olduğu için -k gerekiyor)
curl -sk -A "Mozilla/5.0" -o 4721.pdf \
  https://www.mevzuat.gov.tr/mevzuatmetin/1.5.4721.pdf

# 2. Düz metne çevir  (pdfjs-dist; depoya bağımlılık eklenmedi)
node <scratchpad>/pdftool/extract.mjs 4721.pdf 4721.txt

# 3. Öneri üret — HİÇBİR DOSYA DEĞİŞMEZ
node scripts/repair-official-text.mjs --kanun=tmk --kaynak=4721.txt \
     --kanunNo=4721 --tumu

# 4. data/official-repair/tmk.md dosyasını gözle oku

# 5. Uygula
node scripts/repair-official-text.mjs --kanun=tmk --kaynak=4721.txt \
     --kanunNo=4721 --tumu --apply

# 6. Paketleri üret ve DOĞRULA
node scripts/build-content-packs.mjs
node scripts/compare-official-text.mjs --kanun=tmk --kaynak=4721.txt
```

Altıncı adım şart. Doğrulama, onarımın yaptığı işi bağımsız olarak ölçer:
"birebir aynı" oranı %97'nin altındaysa onarımda bir şey ters gitmiştir.

### Tasarım kararları

**Öneri ve uygulama ayrıdır.** `--apply` verilmedikçe betik hiçbir dosyaya
dokunmaz. Bu depo daha önce, üretilmiş metnin sessizce yayılmasından
zarar gördü.

**Çıktı, girdinin satır alt dizisidir.** Dipnot ayıklama hiçbir satırı
DEĞİŞTİRMEZ, yalnız bütünüyle atar. Böylece elde kalan her karakterin
kaynaktan geldiği garanti altındadır. Tek bilinçli istisna aşağıda.

**Bilinçli tek istisna — bent harfi.** Resmî PDF'in yazı tipinde tek başına
duran küçük «l» harfi düz metne rakam «1» olarak düşüyor. Düzeltme yalnız
satırın kendisi ispat ediyorsa yapılır: önceki bent `k)`, sonraki bent `m)`
olmak zorunda. Türk alfabesinde k ile m arasında rakam bulunamaz;
dolayısıyla bu bir çıkarım değil, tespittir. Her düzeltme rapora yazılır.

**Çözülemeyen madde onarılmaz.** Dipnotun nerede bittiği kestirilemiyorsa
madde eski hâlinde bırakılır ve raporda ŞÜPHELİ olarak listelenir. Kirli
bırakmak, yanlış kesmekten yeğdir.

**Kaynak künyesi doğrulanır.** `--kanunNo` verildiğinde betik, kaynağın
`Kanun Numarası` satırını denetler. Yanlış kanunun metnini yazmak en sessiz
hata olurdu: madde numaraları tuttuğu için hiçbir uyarı çıkmaz, yalnız
içerik başka kanuna ait olurdu.

### Yol boyunca yakalanan tuzaklar

Bunlar tek tek denendi ve düzeltildi; yeniden yazan biri aynı çukurlara
düşmesin:

| Tuzak | Belirti | Çözüm |
|---|---|---|
| `MADDE 25/A` harf eki yakalanmadı | 25 inci maddeye 25/A metni önerildi | Harf ayrı yakalanır, anahtarın parçasıdır |
| Tire zorunlu sanıldı | TBK m.428 (`MADDE 428 İşyerinin…`) hiç görülmedi | Tire isteğe bağlı |
| İİK harf ekini küçük yazıyor (`Madde 8/a`) | 80 madde "kaynakta yok" | Anahtar büyük harfe çekilir |
| Dipnot kalıbı madde metninde de var | HMK m.249 "19/3/1969 tarihli ve 1136 sayılı Avukatlık Kanunu…" silinecekti | Dipnot gövdesinden önce **tek başına numara satırı** aranır |
| Dipnot bitişi fiil kalıbıyla aranıyordu | "…eklenmiş ve mevcut fıkralar teselsül ettirilmiştir" kaçtı | **Sayfa sınırı** kullanılır: dipnotlar sayfanın altındadır |
| Sayfa numarası başlık sanıldı | `**28 / b) İtirazın kaldırılması:**` | Salt sayı satırı başlık sayılmaz, ama döngüyü de durdurmaz |
| İlk maddeye kanun künyesi yığıldı | TBK m.1 başlığı "Kanun Numarası : 6098…" ile açıldı | Künye satırları süzülür, başlık son 4 satırla sınırlanır |
| Ayraç hem silinip hem korundu | Dosyalarda çift `---` | İki ayrı indis: metin sonu ≠ yorum başı |
| Doğrulayıcı ile onarıcı ayrı kopyalar tutuyordu | İİK'da %98 sahte sapma | Ortak `scripts/lib/official-text.mjs` |

Son satır genel bir ilkedir: **doğrulayıcı, doğruladığı şeyle aynı
kurallardan beslenmelidir.** Aksi hâlde doğrulama, doğrulamanın kendi
hatasını ölçer.

## Sonuç

| Ölçüt | Önce | Sonra |
|---|---|---|
| Özetlenmiş resmî metin | 23 madde | **0** |
| Kaynaktan yeniden yazılan madde | — | **7.598 / 8.088** |
| Metne yapışık dipnot satırı | binlerce | **76** |
| Kaynakla birebir aynı (TBK) | %0 | **%100** |
| Kaynakla birebir aynı (TMK) | %6,4 | **%99,9** |
| Kaynakla birebir aynı (TTK) | — | **%99,9** |
| Uygulama paketi | 2,9 MB | 2,7 MB |

Onarılmayan maddeler `data/official-repair/<kanun>.md` dosyalarında ŞÜPHELİ
başlığıyla listelidir; eski metinlerini korurlar.

## Kaynağı indirilemeyenler

Üç kanunun resmî metni mevzuat.gov.tr'den alınamadı; bunlar eski hâllerinde
kaldı:

- `bk` — 818 sayılı mülga Borçlar Kanunu (hiçbir tertipte bulunamadı)
- `gvk` — 193 sayılı Gelir Vergisi Kanunu (indirilen dosya tek sayfa)
- `tsk-ic-hizmet` — 211 sayılı Kanun (indirilen dosya tek sayfa)

Ayrıca `is-kanunu-1475` boru hattına alınmadı: bu kanunun yalnız 14 üncü
maddesi yürürlüktedir ve metni ikincil kaynaktan alınıp dosyasına
`sourceNote` düşülmüştü. mevzuat.gov.tr'den doğrulanması gereken tek madde
odur.

## Bilinen artık

76 dipnot satırı metinde kalmıştır. Bunlar sayfa sınırını aşan, yani ilk
satırı bir sayfanın altında bitip devamı sonraki sayfanın başında süren
dipnotlardır. Sayfa sınırı kuralı ilk parçayı atar, devamı kalır. Sayı
8.088 madde içinde ihmal edilebilir olduğundan tahminle kesilmemiştir.

Bulmak için:

```bash
node scripts/repair-official-text.mjs --kanun=<id> --kaynak=<txt> --tumu
# raporda "Dipnot/sayfa numarası olarak atılan satırlar" bölümüne bakın
```
