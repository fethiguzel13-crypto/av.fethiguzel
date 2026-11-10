/**
 * Karar arama — yerel sunucu (bellekte veritabanı, rastgele kapı).
 *   node --test scripts/karar-arama/__tests__/*.test.mjs
 */
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { request } from "node:http";
import { ac, ekle } from "../veritabani.mjs";
import { sunucuOlustur } from "../sunucu.mjs";

let sunucu;
let kapi;

function iste(yol, { yontem = "GET", host } = {}) {
  return new Promise((coz, reddet) => {
    const r = request(
      { host: "127.0.0.1", port: kapi, path: yol, method: yontem, headers: { host: host ?? `127.0.0.1:${kapi}` } },
      (y) => {
        let govde = "";
        y.setEncoding("utf8");
        y.on("data", (p) => (govde += p));
        y.on("end", () => coz({ durum: y.statusCode, basliklar: y.headers, govde }));
      },
    );
    r.on("error", reddet);
    r.end();
  });
}

before(async () => {
  const db = ac(":memory:");
  ekle(db, {
    id: "10", daire: "2. Hukuk Dairesi", esas: "2025/100", karar: "2026/200", tarih: "01.02.2026",
    kunye: "Yargıtay 2. Hukuk Dairesi, E. 2025/100, K. 2026/200, T. 01.02.2026",
    text: "Boşanma davasında <script>alert(1)</script> nafaka talebi değerlendirilmiştir.",
  });
  sunucu = sunucuOlustur({ db });
  await new Promise((r) => sunucu.listen(0, "127.0.0.1", r));
  kapi = sunucu.address().port;
});

after(() => sunucu.close());

describe("yerel sunucu", () => {
  it("ana sayfa güvenlik başlıklarıyla gelir", async () => {
    const y = await iste("/");
    assert.equal(y.durum, 200);
    assert.match(y.basliklar["content-type"], /text\/html/);
    assert.match(y.basliklar["content-security-policy"], /default-src 'none'/);
    assert.match(y.govde, /Karar Arama/);
  });
  it("arama JSON döner; metin HTML olarak değil düz parça olarak gelir", async () => {
    const y = await iste(`/api/ara?q=${encodeURIComponent("nafaka")}`);
    assert.equal(y.durum, 200);
    const j = JSON.parse(y.govde);
    assert.equal(j.toplam, 1);
    assert.equal(j.sonuclar[0].id, "10");
    assert.ok(j.sonuclar[0].parca.some((p) => p.v && p.t === "nafaka"));
  });
  it("numarayla arama", async () => {
    const j = JSON.parse((await iste(`/api/ara?q=${encodeURIComponent("2026/200")}`)).govde);
    assert.equal(j.sonuclar[0].eslesme, "numara");
  });
  it("süzgeç parametreleri uygulanır", async () => {
    assert.equal(JSON.parse((await iste("/api/ara?q=&tur=ceza")).govde).toplam, 0);
    assert.equal(JSON.parse((await iste("/api/ara?q=&yil1=2026&yil2=2026")).govde).toplam, 1);
  });
  it("karar tam metni ve olmayan karar 404", async () => {
    const y = await iste("/api/karar?id=10&q=nafaka");
    assert.equal(JSON.parse(y.govde).kunye.startsWith("Yargıtay 2. Hukuk"), true);
    assert.equal((await iste("/api/karar?id=999")).durum, 404);
  });
  it("durum ve daireler", async () => {
    assert.equal(JSON.parse((await iste("/api/durum")).govde).karar, 1);
    assert.equal(JSON.parse((await iste("/api/daireler")).govde)[0].daire, "2. Hukuk Dairesi");
  });
  it("yabancı Host başlığı (DNS yeniden bağlama) reddedilir", async () => {
    assert.equal((await iste("/api/ara?q=x", { host: "kotu.example:80" })).durum, 403);
  });
  it("GET dışındaki yöntem ve bilinmeyen yol", async () => {
    assert.equal((await iste("/api/ara", { yontem: "POST" })).durum, 405);
    assert.equal((await iste("/yok")).durum, 404);
  });
});
