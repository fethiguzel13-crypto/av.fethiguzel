# Vatandaş rehberi — yayın kapısı ve iki düzeltilmiş kusur

Rehberler üç kovadan gelir. Hangisinin kalite kapısından geçtiği ve hangisinin
öncelikli olduğu bir dönem yanlıştı; ikisi de bu belgede anlatılıyor.

## Üç kova

| Kova | Nereden | Kalite kapısı |
|---|---|---|
| `authored` | `lib/vatandas-rehberi/authored/` — ELLE yazılmış | Muaf (insan yazısı) |
| `rewritten` | `lib/vatandas-rehberi/rewritten/` — makine yeniden yazımı | **Uygulanır** |
| `generated` | `lib/vatandas-rehberi/data.ts` — toplu üretim | Uygulanır |

Öncelik: **authored > rewritten > generated.** Aynı slug birden çok kovada
varsa yukarıdaki kazanır.

## Kusur 1 — makine çıktısı kapıdan muaftı

`rewritten` kovası «elle yazılmış gibi» güvenilir sayılıyor ve denetimden
geçirilmiyordu. Oysa o kova `scripts/rewrite-vatandas-gemini.mjs` çıktısıdır,
yani makine üretimi.

Ölçüldü: 579 yeniden yazılmış rehberin **23'ü** projenin kendi kapısından
geçmiyordu — hepsi `thin`, yani «yeterli derinlikte değil». O 23 rehber yine
de canlıda yayınlanıyor ve sayaçlara dâhil ediliyordu.

Bu, projenin 2 numaralı ilkesiyle çelişiyordu: *doğrulanmamış içerik
yayınlanmaz*. Sayaç etkisi de vardı — site ve mağaza metni «570+ rehber»
derken 23'ü eşiğin altındaydı. Google'ın uygulamayı Yanıltıcı İddialar
Politikası'ndan işaretlemesinden hemen sonra bu tür bir fazla beyan taşımak
ayrıca risklidir.

**Düzeltme:** makine çıktısının üç kovası da aynı kapıdan geçer. Elenen
rehber SİLİNMEZ; yalnız yayından ve sayaçtan düşer, derinleştirilince
kendiliğinden geri gelir.

Sonuç: 579 → **556**.

## Kusur 2 — elle yazılmış rehberlerin hepsi eziliyordu

`readPublished()` önce `rewritten` alıyor, sonra `authored` içinden aynı
slug'a sahip olanları **eliyordu**. Yani sıralama tersti.

Sonuç: elle yazılmış **33 rehberin tamamı** makine sürümüyle eziliyordu —
kıdem tazminatı, boşanma davası, işe iade, miras paylaşımı, nafaka türleri
gibi sitenin en çok okunan başlıkları dâhil.

Depodaki `scripts/__tests__/authored-guides.test.mjs` bu kusuru zaten
yakalıyordu ve kırmızı duruyordu:

```
✖ elle yazılan rehber, aynı slug'lı üretilmiş sürümü değiştiriyor
  aidat-borcu-ve-gecikme-tazminati: üretilmiş sürüm kazanmış
  + '2026-08-22'   (makine)
  - '2026-08-16'   (elle yazılmış)
```

**Düzeltme:** öncelik sırası düzeltildi — insanın yazdığı metin her zaman
kazanır, makine sürümü yalnız insan yazmadığı yerde devreye girer.

## Doğrulama

```bash
npm run test:quality          # 26/26 — authored-guides testi dâhil
npm run audit:content         # kalıp metin taraması
node scripts/build-publishable-manifest.mjs
```

Manifest çıktısı artık şunu yazar:

```
[publishable] mevzuat 8088 · rehber 556 (33 elle yazılan) · ders notu 6552
```

Parantezdeki sayı sıfırdan büyük olmalıdır. Sıfıra düşerse elle yazılmış
rehberler yeniden eziliyor demektir.

## Kalan açık

Denetim ders notlarında hâlâ büyük bir boşluk gösteriyor: 11.623 belgenin
5.071'i kalıp metin (%44). Bu küme şu an sitede tümüyle geri çekilmiş
durumda; yeniden yazım yapılmadan yayına alınmamalıdır.
