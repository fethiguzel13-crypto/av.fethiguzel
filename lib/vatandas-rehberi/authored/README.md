# Elle yazılan rehberler

Bu klasördeki metinler **elle yazılır** ve hiçbir üreticinin çıktısı değildir.
`../data.ts` otomatik üretilir ve `generate-vatandas-rehberi.mjs` her
çalıştığında üzerine yazılır; buradaki dosyalara dokunulmaz.

## Kural

Her cümle bir kaynağa dayanır. Madde numarası, süre, oran ve merci
yazılmadan önce resmî metinden doğrulanır:

```bash
node scripts/madde.mjs tmk 605-618
node scripts/madde.mjs --ara "kira bedeli" --kanun=tbk
```

Doğrulanmamış hiçbir sayı yazılmaz. "Yasal süre vardır" gibi kaçamak
ifadeler de yazılmaz — süre biliniyorsa söylenir, bilinmiyorsa konu
yazılmaz.

## Yargıtay kararları

Depodaki `data/yargi-kararlari/index.jsonl` yalnız **künye** taşır; karar
metni yoktur ve anahtar kelime alanı 3.819 kaydın 3.817'sinde boştur.
Dolayısıyla bir kararın ne dediğini buradan öğrenmek mümkün değildir ve
okumadığımız bir karara görüş atfetmeyiz.

Karar göndermesi gereken yerlere `TODO_ICTIHAT` işareti bırakılır; künye
Lexpera veya Jurix'ten doğrulanıp eklenir. İşaret kalmışsa kalite kapısı
uyarır.

## Üslup

`C:/Users/HUAWEI/Desktop/makale/YAZIM-DILI.md` geçerlidir. Özetle:
parantez içi yabancı karşılık yok, art arda kısa cümle yok, `olup` ve
`zira` gibi bağlaçlarla akıcı doktrin nesri.

## Yeni rehber ekleme

1. `<slug>.ts` dosyasını yaz (tip: `VatandasArticle`)
2. `index.ts` içine ekle
3. `node scripts/authored-to-json.mjs`
4. `npm run test:quality` ve `npx tsc --noEmit`
5. `node scripts/build-publishable-manifest.mjs && node scripts/build-bilgi-sitemap.mjs`
6. `cd mobile && node scripts/build-app.mjs --app=rehber`

## Bağımsız doğrulama — NotebookLM

Rehberler yazıldıktan sonra, iddiaların kaynakta gerçekten karşılığı olup
olmadığı ikinci bir okuyucuyla sınanır. NotebookLM burada **metin üretmek
için kullanılmaz** — bu deponun geçmişinde üretilmiş metnin ne kadar zarar
verdiği ölçülmüştür. Yalnız kaynağa bağlı soru sorma yeteneği kullanılır.

```bash
# 1. Rehberlerin atıf yaptığı maddelerin resmî metnini çıkar
node scripts/export-cited-articles.mjs        # → data/rehber-kaynaklar.md

# 2. Defter oluştur ve kaynağı yükle
notebooklm create "Rehber dogrulama - mevzuat" --json
notebooklm source add "data/rehber-kaynaklar.md" --notebook <id> --json
notebooklm source wait <source_id> -n <id>

# 3. İddiaları sına
notebooklm ask "Yalnızca kaynaktaki madde metinlerine dayan. Her madde için
DOĞRU veya YANLIŞ yaz; yanlışsa doğrusunu tek cümleyle belirt. …" --notebook <id>
```

**Soru yazarken dikkat:** İddiayı rehberdeki hâliyle, kısaltmadan sorun.
16.08.2026 denetiminde işaretlenen dört maddenin dördü de sorunun eksik
yazılmasından kaynaklandı; rehber metinleri doğruydu. Kısaltılmış soru,
yanlış alarm üretir.

`export-cited-articles.mjs` ayrıca ölü atıf denetimi yapar: Bir rehber
külliyatta bulunmayan bir maddeye gönderiyorsa betik hata verir.
