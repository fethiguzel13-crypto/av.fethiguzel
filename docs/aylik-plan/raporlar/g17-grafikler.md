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
