# G17 — Grafikler

**Tarih:** 2026-10-08 · **Alt plan:** `gorevler/G17.md` · **Beceri:** dataviz

## Veri (adım 1)

`/yargi-kararlari/istatistik` sayfasının verisi `public/data/yargi-dagilim.json` dosyasıdır (`scripts/yargi-dagilim-uret.mjs`,
`lib/yargi-dagilim.mjs`). Dağılım sitede yayımlanan web indeksinden (`data/yayin/yargi-index.json.gz`) sayılır. Arşiv ve süzülen
toplamı aynı üretimin `public/data/yargi-stats.json` dosyasından gelir, ikisi çelişirse üretici hata verir.

Canlı hasat indeksi bilerek kullanılmamıştır. Bugün 116.395 kararın 40.640'ı yayın süzgecini geçmektedir; sitede ise 7 Ekim
üretiminin 39.718 kararı yayındadır. Canlı indeksten çizilen grafik, sitede bulunmayan 922 kararı da sayardı. İki dosya web indeksi
yenilenirken (`mobile/scripts/build-icthat-data.mjs`) birlikte üretilir; tutarlılık testi aradaki kopmayı yakalar.

| Ölçü | Değer |
|---|---:|
| Arşiv | 114.625 |
| Yayında (emsal nitelikli ve benzersiz, İBK dahil) | 39.718 |
| Süzülen | 74.907 |
| Karar yılı okunamayan | 4.293 |

Birim dağılımı en çok sekiz çubukla çizilir. Diğer hukuk daireleri (404), icra-iflas odaklı hukuk daireleri (294) ve içtihadı
birleştirme kararları (40) "Diğer" (738) çubuğunda toplanır, tablo görünümünde ayrı ayrı yazılır. Birim adları hasat
yapılandırmasındaki etiketten (`config.json` `tiers[].label`) parantezli iç not atılarak türetilir. Yapılandırmada etiketi olmayan
`hukuk-daire` "Diğer hukuk daireleri" adını alır.

Yıl dağılımı hasadın kapsamını yansıtır, Yargıtay'ın yıllık karar sayısını göstermez (2013'te 5.676, 2026'da 11.277 karar). Sayfa
bu ayrımı grafiğin altında yazar.

## Palet (adım 2)

Biçim seçimi: Birim ve yıl dağılımı tek serili grafiktir. Adlandırılmış kategoriler değerine göre boyanmaz, bütün çubuklar tek
renktir (`#CC5833`, sitenin vurgu rengi; krem zeminde 3,68:1, `#FFFEFA` zeminde 4,15:1, işaret için ≥ 3:1). Lejant kutusu yoktur, başlık
seriyi adlandırır.

Kategorik palet yalnız hesaplama dökümündeki yığılmış çubukta kullanılır. Sıra: sitenin vurgu rengi, ardından dataviz varsayılan
paletinin mavi ve su yeşili slotları. Doğrulayıcı çıktısı (`validate_palette.js "#CC5833,#2a78d6,#1baf7a" --mode light`):

| Denetim | `#FFFEFA` zemin | `#F2F0E9` zemin |
|---|---|---|
| Açıklık bandı (L 0,43–0,77) | PASS | PASS |
| Renk doygunluğu tabanı (C ≥ 0,10) | PASS | PASS |
| Renk körlüğünde ayrım (komşu) | PASS, en kötü ΔE 23,1 (protan) | PASS, en kötü ΔE 23,1 |
| Normal görüş tabanı (≥ 15) | PASS, ΔE 24,0 | PASS, ΔE 24,0 |
| Zemine karşı kontrast | WARN, `#1baf7a` 2,79:1 | WARN, `#1baf7a` 2,47:1 |

Kontrast uyarısı üçüncü rengi kullanan grafikte görünür değer etiketi ve tablo görünümü zorunluluğu doğurur. Dördüncü aday sarı
(`#eda100`, 2,15:1) bu yüzden palete alınmamıştır. Elenen aday: Sitenin koyu yeşili (`#2E4036`) ve gri (`#636360`) açıklık bandının
ve doygunluk tabanının altında kalmış, normal görüş tabanını da geçememiştir (ΔE 14,9). Eksen ve ızgara renkleri (`#C9C6BD`,
`#E4E1D8`) seri rengi değildir, krem tonlarından türetilmiş geri planda kalan çizgilerdir. Sitede karanlık kip yoktur; kömür zeminde
grafik çizilirse palet `--mode dark` ile ayrıca doğrulanır.

## Hesaplama dökümü (adım 5)

Kıdem aracında brüt kıdem ile brüt ihbarın toplamı net kıdem, net ihbar ve vergi kesintileri olarak üç kesimli tek çubukta
gösterilir. Faiz aracında "Anapara + Faiz" toplamı anapara ve toplam faiz olarak ikiye ayrılır. Varsayılan girdilerle ölçülen
erişilebilir ad şöyledir: Kıdemde toplam 818.520,55 TL olup net kıdem %85,7, net ihbar %11,5, vergi kesintileri %2,8'dir, faizde
ise toplam 166.476,71 TL'nin %60,1'i anapara, %39,9'u faizdir. Görüntüler `gorsel/g17-dokum-{kidem,faiz}-{masaustu,mobil}.jpg`
dosyalarındadır, iki genişlikte de yatay taşma ve konsol hatası yoktur.

## dataviz anti-pattern gözden geçirmesi (adım 6)

Çift eksen, renk döngüsü, sıralamaya göre boyama, her işarette sayı, kenarlıkla ayrılan işaret, kesik etiket ve yalnız ipucuyla
okunan değer bulunmamaktadır. Yıl ve birim grafiği tek seri olup tek renkle çizilir, her birinin tablo görünümü vardır. Yığılmış
çubukta lejant her kesimin tutarını ve payını metin rengiyle yazar, bu liste aynı zamanda tablo görünümü işlevi görür.

Tartışmaya açık tek nokta faiz dökümüdür. İki kesimli tek çubuk, listedeki "2 dilimli pasta" maddesine yakındır. Çubuk yine de
korunmuştur, zira faizin anaparaya oranı aracın verdiği asıl bilgidir ve uzunluk karşılaştırması ortak tabanda yapılır. Tutarlar
lejantta metin olarak da yer alır. Kullanıcı bunu fazlalık sayarsa yerine sayı kutusu konulabilir. Dönemsel modda dilimler renge
bölünmemiştir, zira dilim sayısı üç renklik paleti aşabilir ve dilim tutarları aracın dönem çizelgesinde zaten yazılıdır.

## Ölçüm (adım 6)

Tasarım denetimi (`tasarim-denetim-g17.json`) ilk koşuda istatistik sayfasında bir `link-in-text-block` ihlali bulmuştur. Kapanış
cümlesindeki arşiv bağlantısı çevre metinden yalnız renkle ayrılmakta olup iki renk arasındaki kontrast 1,03:1'dir. Bağlantıya
kalıcı alt çizgi verilmiş ve sayfa testine bu kural eklenmiştir (önce kırmızı). Yeniden derlemeden sonra `/yargi-kararlari/istatistik`
ve `/hesaplama/kidem` 1280 ve 390 px genişlikte ihlal, kontrast, küçük hedef ve taşma bakımından 0 vermiştir.

Lighthouse mobil ölçümü sayfa başına üç koşunun ortancasıyla yapılmıştır (`lighthouse-g17.json`, G13 kapanışı
`lighthouse-g13-sonra-ortanca.json`):

| Sayfa | Performans | Erişilebilirlik | LCP | TBT | Aktarım |
|---|---|---|---|---|---|
| `/hesaplama/kidem` | 57 → 77 | 96 → 100 | 4.701 → 4.800 ms | 1.216 → 271 ms | 603 → 639 KB |
| `/yargi-kararlari` | 61 → 77 | 96 → 100 | 4.695 → 4.700 ms | 877 → 254 ms | 628 → 667 KB |

LCP aynı düzeydedir. Aktarım iki sayfada da yaklaşık 36-39 KB artmıştır. Artış betikten gelmemektedir, zira derleme taramasındaki
ilk yük betik bütçesi (`scripts/betik-butce-taban.json`) değişmeden geçmiştir. Arşiv sayfasına G17'de yalnız bir bağlantı
eklendiğinden farkın G15 ve G16'nın ortak değişikliklerinden geldiği düşünülmekte olup kaynağın ayrıştırılması G25'teki
karşılaştırmalı ölçüme bırakılmıştır.
`npm run kalite` iki kez yeşildir (817 ve 818 test).
