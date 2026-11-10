/**
 * Karar arama — veritabanı (bellekte SQLite, örnek kararlar).
 *   node --test scripts/karar-arama/__tests__/*.test.mjs
 */
import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { ac, ekle, ara, getir, daireler, durum, varOlanlar } from "../veritabani.mjs";

const ornekler = [
  {
    id: "1", daire: "3. Hukuk Dairesi", esas: "2024/1234", karar: "2025/77", tarih: "10.02.2025",
    kunye: "Yargıtay 3. Hukuk Dairesi, E. 2024/1234, K. 2025/77, T. 10.02.2025",
    text: "3. Hukuk Dairesi 2024/1234 E. , 2025/77 K.\r\n \r\n Kira bedelinin tespiti davasında İşçinin değil kiracının talebi incelenmiştir.",
  },
  {
    id: "2", daire: "9. Hukuk Dairesi", esas: "2023/10", karar: "2024/1234", tarih: "05.06.2024",
    kunye: "Yargıtay 9. Hukuk Dairesi, E. 2023/10, K. 2024/1234, T. 05.06.2024",
    text: "Davacı işçinin fazla mesai alacağı ve kıdem tazminatı talebi kabul edilmiştir.",
  },
  {
    id: "3", daire: "Hukuk Genel Kurulu", esas: "2015/8-301", karar: "2016/12", tarih: "01.03.2016",
    kunye: "Yargıtay Hukuk Genel Kurulu, E. 2015/8-301, K. 2016/12, T. 01.03.2016",
    text: "Direnme kararı. Daire bozma kararında 2024/1234 E. sayılı dosyaya atıf yapılmıştır. Kira bedelinin tespiti.",
  },
  {
    id: "4", daire: "", esas: "", karar: "", tarih: "",
    kunye: "Yargitay id=4 (recovered-from-transient-fail)",
    text: "Ceza Genel Kurulu 2013/589 E., 2014/275 K. \n Yağma suçu… 20.05.2014 günü yapılan müzakerede oyçokluğuyla karar verildi.",
  },
];

let db;
before(() => {
  db = ac(":memory:");
  for (const k of ornekler) ekle(db, k);
});

const kimlikler = (s) => s.sonuclar.map((x) => x.id);

describe("ekle", () => {
  it("künyesiz kararı metnin başlığından tamamlar", () => {
    const k = getir(db, "4");
    assert.equal(k.daire, "Ceza Genel Kurulu");
    assert.equal(k.esas, "2013/589");
    assert.equal(k.tarih, "20.05.2014");
    assert.equal(k.tur, "cgk");
    assert.equal(k.kunye, "Yargıtay Ceza Genel Kurulu, E. 2013/589, K. 2014/275, T. 20.05.2014");
  });
  it("aynı kimlik ikinci kez eklenince satır güncellenir, çoğalmaz", () => {
    const d = ac(":memory:");
    ekle(d, ornekler[1]);
    ekle(d, { ...ornekler[1], text: "Yeni metin: hizmet tespiti." });
    assert.equal(durum(d).karar, 1);
    assert.deepEqual(kimlikler(ara(d, "hizmet")), ["2"]);
    assert.deepEqual(kimlikler(ara(d, "mesai")), []);
  });
  it("aynı künyeli ikinci kimlik kopya sayılır: listede çıkmaz, kimliğiyle açılır", () => {
    const d = ac(":memory:");
    ekle(d, ornekler[1]);
    ekle(d, { ...ornekler[1], id: "2b" });
    assert.deepEqual(kimlikler(ara(d, "mesai")), ["2"]);
    assert.equal(ara(d, "").toplam, 1);
    assert.equal(getir(d, "2b").id, "2b");
  });
  it("metni temizler (\\r ve boş satır yığını yok)", () => {
    assert.ok(!getir(db, "1").metin.includes("\r"));
  });
});

describe("ara", () => {
  it("numara: önce esas/karar numarası eşleşenler, sonra metinde geçenler", () => {
    const s = ara(db, "2024/1234");
    assert.deepEqual(kimlikler(s), ["1", "2", "3"]);
    assert.deepEqual(s.sonuclar.map((x) => x.eslesme), ["numara", "numara", "metin"]);
    assert.equal(s.toplam, 3);
  });
  it("E./K. işareti numarayı esasa ya da karara sınırlar", () => {
    assert.deepEqual(kimlikler(ara(db, "E. 2024/1234")).slice(0, 1), ["1"]);
    assert.deepEqual(ara(db, "K. 2024/1234").sonuclar.filter((x) => x.eslesme === "numara").map((x) => x.id), ["2"]);
  });
  it("HGK'nin 2015/8-301 esası 2015/301 diye bulunur", () => {
    assert.deepEqual(ara(db, "E. 2015/301").sonuclar.filter((x) => x.eslesme === "numara").map((x) => x.id), ["3"]);
  });
  it("tırnaklı ifade birebir, Türkçe karaktersiz yazım da bulur", () => {
    assert.deepEqual(kimlikler(ara(db, '"kira bedelinin tespiti"')).sort(), ["1", "3"]);
    assert.deepEqual(kimlikler(ara(db, '"kidem tazminati"')), ["2"]);
    assert.deepEqual(kimlikler(ara(db, '"bedelinin kira"')), []);
  });
  it("kelime önek olarak aranır ve kelimelerin hepsi gerekir", () => {
    assert.deepEqual(kimlikler(ara(db, "işçi")).sort(), ["1", "2"]);
    assert.deepEqual(kimlikler(ara(db, "işçi mesai")), ["2"]);
  });
  it("tür, daire ve yıl süzgeçleri", () => {
    assert.deepEqual(kimlikler(ara(db, "kira", { tur: "hgk" })), ["3"]);
    assert.deepEqual(kimlikler(ara(db, "kira", { daire: "3. Hukuk Dairesi" })), ["1"]);
    assert.deepEqual(kimlikler(ara(db, "kira", { yil1: 2020 })), ["1"]);
    assert.deepEqual(kimlikler(ara(db, "", { tur: "cgk" })), ["4"]);
  });
  it("varsayılan sıralama en yeni karardan eskiye", () => {
    assert.deepEqual(kimlikler(ara(db, "")), ["1", "2", "3", "4"]);
  });
  it("sayfalama ve toplam", () => {
    const s = ara(db, "", { boyut: 2, sayfa: 2 });
    assert.equal(s.toplam, 4);
    assert.deepEqual(kimlikler(s), ["3", "4"]);
  });
  it("sonuç vurgulu kesit taşır", () => {
    const [ilk] = ara(db, "mesai").sonuclar;
    assert.deepEqual(ilk.parca.filter((p) => p.v).map((p) => p.t), ["mesai"]);
  });
  it("FTS sözdizimini bozabilecek girdi hata vermez", () => {
    for (const q of ['"', "AND OR NOT", "*", "a:b", "(x", "NEAR(a b)", "'"]) assert.doesNotThrow(() => ara(db, q), q);
  });
});

describe("yardımcılar", () => {
  it("daireler sayıyla, durum toplamla döner", () => {
    const d = daireler(db);
    assert.ok(d.some((x) => x.daire === "Hukuk Genel Kurulu" && x.sayi === 1));
    assert.equal(durum(db).karar, 4);
  });
  it("varOlanlar eklenmiş kimlikleri verir", () => {
    assert.deepEqual([...varOlanlar(db)].sort(), ["1", "2", "3", "4"]);
  });
  it("olmayan karar null", () => {
    assert.equal(getir(db, "yok"), null);
  });
});

describe("şema geçişi", () => {
  it("metni kararlar tablosunda tutan ilk sürüm dosyası boşaltılıp yeni düzenle kurulur", async () => {
    const { mkdtempSync, rmSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join } = await import("node:path");
    const { DatabaseSync } = await import("node:sqlite");
    const dizin = mkdtempSync(join(tmpdir(), "karar-arama-"));
    const yol = join(dizin, "eski.db");
    const eski = new DatabaseSync(yol);
    eski.exec("CREATE TABLE kararlar (rid INTEGER PRIMARY KEY, id TEXT, metin TEXT); INSERT INTO kararlar VALUES (1, 'x', 'eski');");
    eski.close();
    const d = ac(yol);
    assert.equal(durum(d).karar, 0);
    ekle(d, ornekler[0]);
    assert.deepEqual(kimlikler(ara(d, "kira")), ["1"]);
    d.close();
    rmSync(dizin, { recursive: true, force: true });
  });
});
