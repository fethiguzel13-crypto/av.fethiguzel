/**
 * Grafik bileşenleri (Aylık plan G17 adım 3): yatay çubuk, yıllara göre sütun ve tablo görünümü.
 * Bileşenler sunucuda çizilir; testler gerçek kaynaktan statik HTML üretip ölçer.
 *   node --test lib/__tests__/grafik-bilesen.test.mjs
 */
import { register } from "node:module";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

register("../uyelik/__tests__/ts-hooks.mjs", import.meta.url);
register("./tsx-hooks.mjs", import.meta.url);

const KOK = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const yukle = (yol) => import(pathToFileURL(join(KOK, yol)).href);

async function ciz(dosya, props) {
  const { createElement } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { default: Bilesen } = await yukle(`components/grafik/${dosya}.tsx`);
  return renderToStaticMarkup(createElement(Bilesen, props));
}

const BIRIMLER = [
  { anahtar: "hgk", ad: "Hukuk Genel Kurulu", sayi: 16309 },
  { anahtar: "ceza-daire", ad: "Ceza daireleri", sayi: 7444 },
  { anahtar: "diger", ad: "Diğer", sayi: 738 },
];
const YILLAR = [
  { yil: 2013, sayi: 5676 },
  { yil: 2014, sayi: 1145 },
  { yil: 2015, sayi: 295 },
  { yil: 2016, sayi: 1136 },
];
const isaretler = (html) => [...html.matchAll(/data-ipucu-ad="([^"]*)"[^>]*data-ipucu-deger="([^"]*)"/g)];

describe("<CubukGrafik>", () => {
  it("grafik görsel rolü ve veriyi özetleyen erişilebilir adı taşır", async () => {
    const html = await ciz("CubukGrafik", { baslik: "Birimlere göre karar sayısı", veri: BIRIMLER });
    assert.match(html, /role="img"/);
    assert.match(html, /aria-label="Birimlere göre karar sayısı: Hukuk Genel Kurulu 16\.309, Ceza daireleri 7\.444, Diğer 738"/);
  });

  it("her kategori için bir çubuk çizer, uzunluk en büyük değere orantılıdır", async () => {
    const html = await ciz("CubukGrafik", { baslik: "B", veri: BIRIMLER });
    assert.deepEqual(
      isaretler(html).map((m) => [m[1], m[2]]),
      [["Hukuk Genel Kurulu", "16.309"], ["Ceza daireleri", "7.444"], ["Diğer", "738"]],
    );
    const genislik = [...html.matchAll(/data-ipucu-ad[^>]*style="[^"]*width:([\d.]+)%/g)].map((m) => +m[1]);
    assert.deepEqual(genislik, [100, 45.64, 4.53]);
  });

  it("değer çubuğun ucuna metin rengiyle yazılır, seri rengi metne verilmez", async () => {
    const html = await ciz("CubukGrafik", { baslik: "B", veri: BIRIMLER });
    assert.match(html, />16\.309</);
    assert.doesNotMatch(html, /(?<![\w-])color:#CC5833/i);
    assert.match(html, /background-color:#CC5833/i);
  });
});

describe("<ZamanGrafik>", () => {
  it("her yıl için bir sütun çizer, yükseklik en üst tike orantılıdır", async () => {
    const html = await ciz("ZamanGrafik", { baslik: "Yıllara göre karar sayısı", veri: YILLAR });
    assert.deepEqual(isaretler(html).map((m) => m[1]), ["2013", "2014", "2015", "2016"]);
    // tikler(5676) = 0…6000 → 5676 / 6000 = %94,6
    const yukseklik = [...html.matchAll(/data-ipucu-ad[^>]*style="[^"]*height:([\d.]+)%/g)].map((m) => +m[1]);
    assert.deepEqual(yukseklik, [94.6, 19.08, 4.92, 18.93]);
  });

  it("yuvarlak tikleri binlik ayraçla yazar ve özette en yüksek yılı verir", async () => {
    const html = await ciz("ZamanGrafik", { baslik: "Yıllara göre karar sayısı", veri: YILLAR });
    for (const t of ["0", "2.000", "4.000", "6.000"]) assert.match(html, new RegExp(`>${t.replace(".", "\\.")}<`));
    assert.match(html, /role="img"/);
    assert.match(html, /aria-label="Yıllara göre karar sayısı: 2013–2016 arası 4 yıl, en yüksek 2013 \(5\.676\)"/);
  });

  it("dar ekranda yalnız ilk, son ve uçlardan uzak beşe bölünen yılın etiketi görünür, gizlenen yer tutar", async () => {
    const html = await ciz("ZamanGrafik", { baslik: "Y", veri: YILLAR });
    const etiket = (yil) => html.match(new RegExp(`<span class="([^"]*)"[^>]*>${yil}</span>`))?.[1] ?? "";
    assert.doesNotMatch(etiket(2013), /invisible/);
    assert.match(etiket(2014), /invisible sm:visible/);
    assert.match(etiket(2015), /invisible sm:visible/);
    assert.doesNotMatch(etiket(2016), /invisible/);
    // Etiket yuvayı genişletmez: `flex-1` yuvada metin genişliği satırı taşırmıştı (390 px'te 197 px yatay kaydırma).
    assert.equal([...html.matchAll(/<div class="relative h-4 min-w-0 flex-1"><span class="absolute left-1\/2 -translate-x-1\/2/g)].length, 4);
  });
});

describe("<YiginCubuk>", () => {
  const KESIMLER = [
    { ad: "Net kıdem tazminatı", deger: 992.41, metin: "992,41 TL" },
    { ad: "Net ihbar tazminatı", deger: 336.96, metin: "336,96 TL" },
    { ad: "Vergi kesintileri", deger: 70.63, metin: "70,63 TL" },
  ];
  const props = { baslik: "Brüt toplamın dağılımı", toplamMetin: "1.400,00 TL", kesimler: KESIMLER };

  it("kesimler sabit kategorik sırayla boyanır, genişlikler toplamın tamamını kaplar", async () => {
    const { KATEGORIK } = await yukle("lib/grafik-palet.mjs");
    const html = await ciz("YiginCubuk", props);
    const kesim = [...html.matchAll(/data-ipucu-ad="([^"]*)"[^>]*style="width:([\d.]+)%;background-color:(#[0-9a-f]{6})"/gi)];
    assert.deepEqual(kesim.map((m) => m[1]), KESIMLER.map((k) => k.ad));
    assert.deepEqual(kesim.map((m) => m[3].toLowerCase()), KATEGORIK.map((r) => r.toLowerCase()));
    const toplam = kesim.reduce((a, m) => a + +m[2], 0);
    assert.ok(Math.abs(toplam - 100) < 0.05, `toplam genişlik ${toplam}`);
  });

  it("lejant her kesimi adı, tutarı ve oranıyla metin rengiyle yazar; özet erişilebilir addadır", async () => {
    const html = await ciz("YiginCubuk", props);
    assert.match(html, /role="img"/);
    assert.match(html, /aria-label="Brüt toplamın dağılımı, toplam 1\.400,00 TL: Net kıdem tazminatı 992,41 TL \(%70,9\), Net ihbar tazminatı 336,96 TL \(%24,1\), Vergi kesintileri 70,63 TL \(%5\)"/);
    assert.equal([...html.matchAll(/<li/g)].length, 3);
    assert.match(html, />992,41 TL · %70,9</);
    assert.doesNotMatch(html, /(?<![\w-])color:#/i);
  });

  it("kategorik paletten çok kesim verilirse renk döndürmez, hata verir", async () => {
    const fazla = [...KESIMLER, { ad: "Dördüncü", deger: 1, metin: "1 TL" }];
    await assert.rejects(() => ciz("YiginCubuk", { ...props, kesimler: fazla }), /en çok 3/);
  });
});

describe("<GrafikTablo>", () => {
  it("tablo görünümü açılır kapanır, satır sayısı veriyle eşittir", async () => {
    const html = await ciz("GrafikTablo", {
      baslik: "Birimlere göre karar sayısı",
      sutunlar: ["Birim", "Karar sayısı"],
      satirlar: BIRIMLER.map((b) => [b.ad, b.sayi]),
    });
    assert.match(html, /^<details/);
    assert.match(html, /<summary[^>]*>Tablo görünümü<\/summary>/);
    assert.match(html, /<caption[^>]*>Birimlere göre karar sayısı<\/caption>/);
    assert.equal([...html.matchAll(/<th scope="row"/g)].length, 3);
    assert.match(html, /<td[^>]*>16\.309<\/td>/);
  });
});
