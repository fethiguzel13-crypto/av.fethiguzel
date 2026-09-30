/**
 * Hasat motoru uçtan uca: sahte karararama sunucusuna karşı gerçek runDaemon.
 * Ağ kullanmaz; çıktı gitignore'daki _state/_hasat-e2e-* klasörüne yazılır ve silinir.
 *   node --test scripts/yargi-kararlari/__tests__/harvester-daemon.test.js
 */

import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { ROOT } from "../lib.mjs";
import { runDaemon } from "../harvester/daemon.mjs";

const rel = `data/yargi-kararlari/_state/_hasat-e2e-${process.pid}`;
const base = join(ROOT, rel);
const cfgDir = mkdtempSync(join(tmpdir(), "hasat-e2e-cfg-"));
const configPath = join(cfgDir, "harvester.json");

writeFileSync(
  configPath,
  JSON.stringify({
    politika: {
      hedefYararliKarar: 10,
      hedefliKelimeler: ["ilke"],
      hedefliEnFazlaOran: 0.35,
      ornekleme: { verimCarpani: 1.2, enAzOran: 0.08, daireEnFazlaPay: 0.5 },
      emsal: { kaliteEsigi: 0.45, kurulKaliteEsigi: 0.25, hammingEsigi: 8 },
    },
    outputDir: rel,
    baseUrl: "https://karararama.test",
    concurrency: 2,
    cookieJar: true,
    requestTimeoutMs: 5000,
    rate: {
      startPerMin: 6000,
      maxPerMin: 6000,
      minPerMin: 600,
      jitter: [1, 1],
      peak: { enabled: false },
      cooldown429Ms: [50, 50],
      captcha: { factor: 0.5, pauseMs: [50, 50], capHoldMs: 1000, windowMs: 1000, escalateCount: 99 },
    },
    budget: { maxFullTextPerDay: 1000, maxSearchCallsPerDay: 200 },
    queue: { lowWater: 30 },
    sweep: { yearFrom: 2025, pageSize: 100, splitAbove: 9000, refresh: { recentMonths: 12, everyDays: 14 } },
    retry: { maxAttempts: 3, parkDays: 3, maxParks: 3 },
    checkpoint: { stateEveryMs: 1000, progressEveryMs: 3_600_000, policyEveryMs: 500 },
  })
);

// Pencere başına 150 karar: sıra%10==0 → HGK, 1–4 → 3. HD, 5–9 → 2. CD; ilk 20'si "ilke" içerir.
const N = 150;
const daireOf = (i) => (i % 10 === 0 ? "Hukuk Genel Kurulu" : i % 10 < 5 ? "3. Hukuk Dairesi" : "2. Ceza Dairesi");
const idOf = (to, i) => `${to.replace(/\./g, "")}${String(i).padStart(3, "0")}`;
const WORDS = (
  "kira eser vekalet kefalet temerrüt tapu miras nafaka velayet haciz ihale ortaklık sigorta taşıma çek bono marka patent rekabet kamulaştırma " +
  "zilyetlik irtifak rehin ipotek tenkis vasiyet tereke mirasçı boşanma katkı payı edinilmiş mal kıdem ihbar fazla mesai işe iade sendika grev " +
  "tüketici ayıplı konut kredi faiz komisyon acente franchise leasing faktoring konkordato iflas sıra cetveli menfi tespit istirdat tahliye"
).split(" ");
function uniqueText(id, ilke) {
  let s = Number(id.slice(-6)) * 7919 + 17;
  const pick = () => WORDS[(s = (s * 1103515245 + 12345) % 2147483648) % WORDS.length];
  const parts = [];
  for (let j = 0; j < 120; j++) parts.push(`${pick()} ${pick()} ${pick()} ${pick()} ${pick()}`);
  const principle = ilke ? " Dairemizin yerleşik içtihadı ve ilke olarak kabul edilen görüşe göre istikrar kazanmış uygulama benimsenmiştir." : "";
  return `<p>${parts.join(". ")}.${principle} Karar ${id}.</p>`;
}
const FORMUL = "<p>Dosyadaki yazılara, kararın dayandığı delillerle gerektirici sebeplere göre usul ve yasaya uygun olduğundan temyiz itirazlarının reddiyle hükmün onanmasına karar verildi.</p>";

const seen = { cookies: [], docs: 0, keywordQueries: 0 };
const fakeFetch = async (url, init = {}) => {
  const u = new URL(url);
  seen.cookies.push(init.headers?.Cookie || null);
  if (u.pathname === "/") {
    return new Response("<html><p id=\"isDisplayCaptcha\">false</p></html>", { status: 200, headers: { "set-cookie": "TS01f02b04=e2e; Path=/" } });
  }
  if (u.pathname === "/aramadetaylist") {
    const d = JSON.parse(init.body).data;
    const all = Array.from({ length: N }, (_, i) => i);
    let pool = all;
    if (d.arananKelime) {
      seen.keywordQueries++;
      pool = all.filter((i) => i < 20);
    }
    // Yıllık sayım: 01.01'den başlayıp ay dışına taşan, tek satırlık sorgu (yıl içindeyse bitiş bugündür).
    const census =
      d.pageSize === 1 && d.baslangicTarihi.startsWith("01.01.") && d.bitisTarihi.slice(3) !== d.baslangicTarihi.slice(3);
    const total = census ? 1234 : pool.length;
    const start = (d.pageNumber - 1) * d.pageSize;
    const rows = census
      ? []
      : pool.slice(start, start + d.pageSize).map((i) => ({
          id: idOf(d.bitisTarihi, i),
          daire: daireOf(i),
          esasNo: `2026/${i}`,
          kararNo: `2026/${500 + i}`,
          kararTarihi: d.bitisTarihi,
        }));
    return Response.json({ data: { recordsTotal: total, data: rows } });
  }
  if (u.pathname === "/getDokuman") {
    const id = u.searchParams.get("id");
    seen.docs++;
    const i = Number(id.slice(-3));
    const appErr = (m) => Response.json({ data: null, metadata: { FMTY: "ERROR", FMC: "ADALET_RUNTIME_EXCEPTION", FMTE: `Runtime exception:{0}:${m}` } });
    if (i === 10 && !seen.captchaSent) {
      seen.captchaSent = id;
      return appErr("DisplayCaptcha");
    }
    if (i === 20) {
      seen.docErrorId = id;
      return appErr("Belge alma isleminde hata olustu. pid:null");
    }
    const useful = i < 20 || daireOf(i) === "Hukuk Genel Kurulu";
    return Response.json({ data: useful ? uniqueText(id, i < 20) : FORMUL });
  }
  return new Response("yok", { status: 404 });
};

after(() => {
  rmSync(base, { recursive: true, force: true });
  rmSync(cfgDir, { recursive: true, force: true });
});

describe("runDaemon uçtan uca (sahte sunucu, emsal politikası)", () => {
  it("sayar, işaretli + genel envanter çıkarır, seçer, kurulları öne alır, etiketler, hedefi izler", async () => {
    const realFetch = globalThis.fetch;
    globalThis.fetch = fakeFetch;
    let code;
    try {
      code = await runDaemon({ configPath, max: 45, quiet: true, skipLegacyCheck: true });
    } finally {
      globalThis.fetch = realFetch;
    }
    assert.equal(code, 0);
    const st = join(base, "_state");

    // Envanter: ilk pencerenin 150 künyesi, 20'si işaretli
    const invDir = join(st, "envanter");
    const invFile = readdirSync(invDir).sort().reverse()[0];
    const inv = readFileSync(join(invDir, invFile), "utf8").trim().split("\n").map((l) => JSON.parse(l));
    assert.equal(inv.length, N);
    assert.equal(inv.filter((x) => x.m === 1).length, 20);
    assert.ok(seen.keywordQueries >= 1);

    const plan = JSON.parse(readFileSync(join(st, "harvester-plan.json"), "utf8"));
    assert.equal(plan.version, 2);
    assert.equal(plan.census["2026"].total, 1234);
    const first = plan.units[0];
    assert.equal(first.status, "secildi");
    assert.equal(first.selectedUpTo, N);
    assert.equal(plan.politika.hedefYararliKarar, 10);

    // İndirilenler: 45; önce 15 kurul, sonra işaretliler; etiket alanları dolu
    const progress = JSON.parse(readFileSync(join(st, "progress.json"), "utf8"));
    assert.equal(Object.keys(progress.downloadedIds).length, 45);
    const index = readFileSync(join(base, "index.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
    assert.equal(index.length, 45);
    assert.ok(index.slice(0, 14).every((p) => p.tierId === "hgk"), "kurul kararları önce");
    assert.ok(index.some((p) => p.id === seen.captchaSent), "captcha alan karar kuyruğa dönüp iner");
    assert.ok(!index.some((p) => p.id === seen.docErrorId), "sitede olmayan belge inmez");
    const queue = readFileSync(join(st, "queue.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
    const de = queue.find((q) => q.id === seen.docErrorId);
    assert.equal(de?.docErrors, 1, "belge hatası ertelendi, motor durmadı");
    assert.ok(index.every((p) => typeof p.yararli === "boolean" && "benzerOf" in p));
    const yararli = index.filter((p) => p.yararli).length;
    const benzer = index.filter((p) => p.benzerOf).length;
    const gerekceli = index.filter((p) => Number(p.id.slice(-3)) < 20 || p.tierId === "hgk");
    assert.ok(gerekceli.length >= 30);
    assert.ok(gerekceli.every((p) => p.emsal === true), "gerekçeli kararlar emsal nitelikli sayılır");
    assert.ok(yararli >= gerekceli.length - 2, `gerekçeli kararların neredeyse hepsi yararlı (${yararli}/${gerekceli.length})`);
    assert.ok(index.filter((p) => !gerekceli.includes(p)).every((p) => !p.yararli), "formül kararlar yararlı sayılmaz");
    assert.ok(benzer >= 1, "aynı kalıp formül kararları benzer işaretlenir");
    const rec = JSON.parse(readFileSync(join(base, index[0].file), "utf8"));
    assert.equal(rec.kanal, "kurul");

    // Emsal defteri ve hedef
    const book = readFileSync(join(st, "benzerlik.jsonl"), "utf8").trim().split("\n");
    assert.equal(book.length, 45);
    const status = JSON.parse(readFileSync(join(st, "harvester-status.json"), "utf8"));
    assert.equal(status.state, "stopped");
    assert.equal(status.lastHour.captcha, 1);
    assert.equal(status.emsal.analiz, 45);
    assert.equal(status.emsal.yararli, yararli);
    assert.equal(status.emsal.hedefTamam, true, "hedef (10) aşıldı");
    assert.equal(plan.hedefTamam, true);

    assert.equal(existsSync(join(st, "harvester.lock")), false, "kilit bırakıldı");
    assert.equal(seen.cookies[0], null);
    assert.ok(seen.cookies.slice(1).every((c) => c === "TS01f02b04=e2e"), "oturum çerezi geri gönderilir");
  });
});
