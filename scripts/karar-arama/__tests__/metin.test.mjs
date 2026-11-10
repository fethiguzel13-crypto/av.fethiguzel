/**
 * Karar arama — metin işlevleri (katlama, sorgu çözme, vurgulama).
 *   node --test scripts/karar-arama/__tests__/
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { katla, sorguCoz, ftsIfadesi, vurgula, temizMetin, numaraAyir, kararTuru } from "../metin.mjs";

describe("katla", () => {
  it("Türkçe harfleri ve büyük harfi katlar, uzunluğu korur", () => {
    const s = "İŞÇİ Işık ÇĞÖÜ âîû ışıl";
    assert.equal(katla(s), "isci isik cgou aiu isil");
    assert.equal(katla(s).length, s.length);
  });
  it("ASCII olmayan diğer harfleri bozmaz", () => {
    assert.equal(katla("Café 6098/1 §"), "café 6098/1 §");
  });
});

describe("sorguCoz", () => {
  it("esas/karar numarasını, türüyle birlikte ayırır", () => {
    assert.deepEqual(sorguCoz("2024/1234").numaralar, [{ yil: 2024, no: 1234, tur: null }]);
    assert.deepEqual(sorguCoz("E. 2024/1234").numaralar, [{ yil: 2024, no: 1234, tur: "E" }]);
    assert.deepEqual(sorguCoz("2023/55 K.").numaralar, [{ yil: 2023, no: 55, tur: "K" }]);
    assert.deepEqual(sorguCoz("2024/1234").kelimeler, []);
    assert.deepEqual(sorguCoz("2010/11-312 E.").numaralar, [{ yil: 2010, no: 312, tur: "E" }]);
    assert.deepEqual(sorguCoz("2010/11-312 E.").kelimeler, []);
  });
  it("tırnaklı ifadeyi (düz ve kıvrık tırnak) ve kalan kelimeleri ayırır", () => {
    const c = sorguCoz('işçilik  "kira bedelinin tespiti" “fazla mesai”');
    assert.deepEqual(c.ifadeler, [["kira", "bedelinin", "tespiti"], ["fazla", "mesai"]]);
    assert.deepEqual(c.kelimeler, [["iscilik"]]);
  });
  it("noktalı ya da eğik çizgili kelimeyi tek ifade sayar", () => {
    assert.deepEqual(sorguCoz("T.B.K. 6098/1").kelimeler, [["t", "b", "k"], ["6098", "1"]]);
  });
  it("boş ve yalnız noktalama içeren sorgu boştur", () => {
    const c = sorguCoz('  " ; ');
    assert.equal(c.bos, true);
  });
});

describe("ftsIfadesi", () => {
  it("tek kelimeyi önek, ifadeyi birebir arar; hepsi VE ile bağlanır", () => {
    assert.equal(ftsIfadesi(sorguCoz('işçi "kıdem tazminatı"')), '"isci"* AND "kidem tazminati"');
  });
  it("çok parçalı kelime ifade olarak, numara metinde ifade olarak aranmaz", () => {
    assert.equal(ftsIfadesi(sorguCoz("T.B.K. 2024/5")), '"t b k"');
  });
  it("numara metin içi arama için ayrıca ifadeye çevrilebilir", () => {
    assert.equal(ftsIfadesi(sorguCoz("2024/5"), { numaralarMetinde: true }), '"2024 5"');
  });
  it("içinde tırnak bulunan kelime sorguyu bozmaz", () => {
    assert.equal(ftsIfadesi(sorguCoz('ab"c')), '"ab"* AND "c"*');
  });
});

describe("vurgula", () => {
  const metin = "Davacı İşçinin fazla mesai alacağı… Mahkemece FAZLA MESAİ talebi reddedilmiştir. İşçi kıdem istemiştir.";
  it("önekli kelimeyi ve ifadeyi özgün yazımıyla işaretler", () => {
    const p = vurgula(metin, sorguCoz('işçi "fazla mesai"'), { pencere: 0 });
    const isaretli = p.filter((x) => x.v).map((x) => x.t);
    assert.deepEqual(isaretli, ["İşçinin", "fazla mesai", "FAZLA MESAİ", "İşçi"]);
    assert.equal(p.map((x) => x.t).join(""), metin);
  });
  it("pencere verilince ilk eşleşmenin çevresini keser ve üç nokta koyar", () => {
    const uzun = "a ".repeat(400) + "kira bedeli " + "b ".repeat(400);
    const p = vurgula(uzun, sorguCoz('"kira bedeli"'), { pencere: 60 });
    const duz = p.map((x) => x.t).join("");
    assert.ok(duz.startsWith("…") && duz.endsWith("…"));
    assert.ok(duz.length < 200);
    assert.deepEqual(p.filter((x) => x.v).map((x) => x.t), ["kira bedeli"]);
  });
  it("eşleşme yoksa metnin başını verir", () => {
    const p = vurgula("Karar metni burada başlar ve uzar.", sorguCoz("yok"), { pencere: 10 });
    assert.ok(p[0].t.startsWith("Karar"));
  });
  it("numarayı metin içinde de işaretler", () => {
    const p = vurgula("Bozma kararı 2024/1234 E. sayılı dosyada", sorguCoz("2024/1234"), { pencere: 0 });
    assert.deepEqual(p.filter((x) => x.v).map((x) => x.t), ["2024/1234"]);
  });
});

describe("yardımcılar", () => {
  it("temizMetin HTML karakter kodlarını çözer", () => {
    assert.equal(temizMetin("&ldquo;alacak&rdquo; davası &amp; Kurul&rsquo;un &#39;x&#39; &#x15F; &nbsp;son"), "“alacak” davası & Kurul’un 'x' ş son");
  });
  it("temizMetin satır sonlarını ve boş satır yığınlarını düzeltir", () => {
    assert.equal(temizMetin("A \r\n \r\n \r\n\r\nB  C\t\n"), "A\n\nB C");
  });
  it("numaraAyir esas biçimlerini çözer", () => {
    assert.deepEqual(numaraAyir("2025/9261"), { yil: 2025, no: 9261 });
    assert.deepEqual(numaraAyir("2010/8-17"), { yil: 2010, no: 17 });
    assert.equal(numaraAyir(""), null);
  });
  it("basliktanBilgi künyesiz kararın ilk satırından daire, esas, karar ve sondaki tarihi çıkarır", async () => {
    const { basliktanBilgi } = await import("../metin.mjs");
    assert.deepEqual(
      basliktanBilgi("Hukuk Genel Kurulu 2010/16-301 E., 2010/312 K. \r\n \r\nMetin… BOZULMASINA, 9.6.2010 gününde, oybirliği ile karar verildi."),
      { daire: "Hukuk Genel Kurulu", esas: "2010/16-301", karar: "2010/312", tarih: "09.06.2010" },
    );
    assert.deepEqual(
      basliktanBilgi("Ceza Genel Kurulu         2013/589 E.  ,  2014/275 K. \n\nGünü : 30.03.2010\n… 13.05.2014 günü birinci müzakere, 20.05.2014 günü yapılan ikinci müzakerede karar verildi."),
      { daire: "Ceza Genel Kurulu", esas: "2013/589", karar: "2014/275", tarih: "20.05.2014" },
    );
    assert.equal(basliktanBilgi("başlıksız metin"), null);
  });
  it("kararTuru daire adından türetilir", () => {
    assert.equal(kararTuru("Hukuk Genel Kurulu"), "hgk");
    assert.equal(kararTuru("Ceza Genel Kurulu"), "cgk");
    assert.equal(kararTuru("Yargıtay Büyük Genel Kurulu (İçtihadı Birleştirme)"), "ibk");
    assert.equal(kararTuru("İçtihatları Birleştirme Büyük Genel Kurulu"), "ibk");
    assert.equal(kararTuru("5. Ceza Dairesi"), "ceza");
    assert.equal(kararTuru("Ceza Daireleri Başkanlar Kurulu"), "ceza");
    assert.equal(kararTuru("4. Hukuk Dairesi"), "hukuk");
  });
});
