# `.gz` varlıkları ve aapt2 — cihazda çöken, tarayıcıda çalışan hata

Bu dosya bir kez yaşanmış, dahili teste kadar gitmiş bir hatayı ve onu
engelleyen korumaları anlatır.

## Belirti

Uygulama telefonda açılıyor, kabuk ve gezinme çalışıyor; ne var ki:

- Mevzuat → bir kanuna dokununca **«kanun yüklenemedi»**
- Yargı → **«sonuç yok»** (arşiv boş)
- Kitaplık → Vatandaş rehberi → **«rehber yüklenemedi»**
- Üyelik ekranı hiç açılmıyor

Tarayıcıda (`npx serve flavors/asistan/www`) **her şey sorunsuz çalışıyor**.

## Sebep

Android'in paketleme aracı **aapt2**, `assets/` altında `.gz` ile biten her
dosyayı AAB oluştururken **açar ve uzantıyı siler**:

| Kaynakta (`www`) | AAB içinde |
|---|---|
| `packs/tbk.json.gz` (2,9 MB) | `packs/tbk.json` (10,3 MB, açılmış) |
| `rehber/guides.json.gz` | `rehber/guides.json` |
| `icthat/archive.json.gz` | `icthat/archive.json` |
| `icthat/arama.txt.gz` | `icthat/arama.txt` |
| `mevzuat/atif.json.gz` | `mevzuat/atif.json` |

Uygulama `./packs/tbk.json.gz` adresini istiyor, o adla dosya bulunmuyor →
404 → «yüklenemedi». Toplam 52 varlık etkilenmişti.

Şifreli kasa parçaları (`icthat/kasa/*.bin`) hiç etkilenmedi — sorunun `.gz`
uzantısına özgü olduğunun kanıtı budur.

AGP'de bu davranışı kapatan bir ayar **yoktur**. `androidResources.noCompress`
sıkıştırmayı ilgilendirir, uzantı silmeyi değil.

## Çözüm

Sıkıştırılmış varlıklar aapt2'nin tanımadığı bir uzantıyla paketlenir:
**`.gzc`**. İçerik yine gzip'tir; yalnız ad değişir, açma kodu aynı kalır.

Üç yerde tanımlı:

1. `app-src/src/lib/varlik.ts` → `export const GZ = '.gzc'` — uygulamanın
   istediği uzantı, tek kaynak.
2. `scripts/build-app.mjs` → `gzUzantisiniDegistir()` — sahneleme sonunda
   `app-src/public` altındaki tüm `.gz` dosyalarını `.gzc` yapar.
3. `scripts/verify-release.mjs` → sentinel adları `.gzc`, ayrıca aşağıdaki
   koruma.

## Neden tarayıcı testi yakalamadı

Hatanın tamamı **paketleme aşamasında** oluşuyor. Geliştirme sunucusu `www`
klasörünü olduğu gibi sunar; dosyalar orada hâlâ `.gz` adıyla ve gzip
içeriğiyle durur. Yani:

- `smoke-ui.mjs` → geçer
- `design-audit.mjs` → geçer
- Tarayıcıda elle gezme → geçer
- **Yalnız gerçek cihaz** → çöker

Bu yüzden koruma tarayıcı testine değil, **paket çıktısına** bakmalıdır.

## Kalıcı koruma

`verify-release.mjs` içinde: derlenen `www` altında `.gz` ile biten tek bir
dosya kalırsa sürüm kapısı **düşer**.

```
✓ [asistan] sıkıştırılmış varlıklar aapt2-güvenli uzantıda (.gz yok)
```

Yeni bir veri türü eklerken `.gz` uzantısı kullanılırsa bu denetim onu
paketlemeden önce yakalar.

## Sürüm geçmişi

| Sürüm | Durum |
|---|---|
| `1.1.0 (3)` | Hatalı — dahili teste yüklendi, mevzuat/rehber/arşiv çalışmıyor |
| `1.1.1 (4)` | Düzeltilmiş |

## Doğrulama

Paketten sonra AAB'nin içine bakmak, tarayıcı testinden daha güvenilirdir:

```bash
AAB=android/app/build/outputs/bundle/release/app-release.aab

# Varlık adları doğru mu (.gzc olmalı, .json olmamalı)
unzip -l "$AAB" | grep -E "packs/tbk|rehber/guides|icthat/archive"

# Kaynakla birebir aynı mı, gzip hâlâ açılıyor mu
unzip -o "$AAB" "base/assets/public/rehber/guides.json.gzc" -d /tmp/chk
node -e "const{gunzipSync}=require('zlib');const{readFileSync}=require('fs');
console.log(JSON.parse(gunzipSync(readFileSync('/tmp/chk/base/assets/public/rehber/guides.json.gzc'))).length)"
```
