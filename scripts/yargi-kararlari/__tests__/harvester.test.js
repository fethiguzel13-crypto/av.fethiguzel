/**
 * Hasat motoru v2 birim testleri (ağ yok, sahte saat).
 *   node --test scripts/yargi-kararlari/__tests__/harvester.test.js
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { Governor, trClock } from "../harvester/governor.mjs";
import {
  YargitayClient,
  classifyDocumentResponse,
  classifySearchResponse,
  parseRetryAfter,
} from "../harvester/http.mjs";
import {
  applySearchFailure,
  applySearchResult,
  createPlan,
  extendPlanToNow,
  markSelected,
  migratePlan,
  monthWindows,
  nextSearchJob,
} from "../harvester/plan.mjs";
import { Store, atomicWriteFileSync, makeDaireClassifier } from "../harvester/store.mjs";
import { pickSpreadAcrossDays, selectFill, selectWindow, spreadPick } from "../harvester/secim.mjs";
import {
  EmsalBook,
  SimilarityIndex,
  YieldStats,
  hamming64,
  isMarked,
  markerRegex,
  simhash64,
} from "../harvester/emsal.mjs";
import { harvesterActive } from "../lib.mjs";
import { acquireLock } from "../harvester/daemon.mjs";

// Pazar 27.09.2026 01:00 TR (mesai dışı)
const SAT_NIGHT = Date.UTC(2026, 8, 26, 22, 0, 0);
// Pazartesi 28.09.2026 10:00 TR (mesai)
const MON_10 = Date.UTC(2026, 8, 28, 7, 0, 0);

function fakeClock(start = SAT_NIGHT) {
  let t = start;
  return {
    now: () => t,
    sleep: async (ms) => {
      t += ms;
    },
    advance: (ms) => {
      t += ms;
    },
  };
}

function gov(rate = {}, clock = fakeClock()) {
  const g = new Governor(
    { jitter: [1, 1], cooldown429Ms: [60_000, 60_000], ...rate },
    { now: clock.now, sleep: clock.sleep, random: () => 0.5 }
  );
  return { g, clock };
}

describe("Governor", () => {
  it("slotları hız kadar aralıkla verir", async () => {
    const { g, clock } = gov({ startPerMin: 6 });
    const t0 = clock.now();
    await g.acquire();
    await g.acquire();
    await g.acquire();
    assert.equal(clock.now() - t0, 20_000);
  });

  it("temiz akışta hızı adım adım artırır ama tavanı aşmaz", () => {
    const { g } = gov({ startPerMin: 6, maxPerMin: 7, increaseEvery: 3, increaseQuietMs: 0, increaseStepPerMin: 0.5 });
    for (let i = 0; i < 3; i++) g.report("ok");
    assert.equal(g.rate, 6.5);
    for (let i = 0; i < 9; i++) g.report("ok");
    assert.equal(g.rate, 7);
  });

  it("429'da hızı düşürür ve Retry-After kadar bekletir", async () => {
    const { g, clock } = gov({ startPerMin: 8 });
    g.report("throttled", { retryAfterMs: 120_000 });
    assert.ok(Math.abs(g.rate - 5.6) < 1e-9);
    const t0 = clock.now();
    await g.acquire();
    assert.equal(clock.now() - t0, 120_000);
  });

  it("429 yağmurunda uzun mola ve geçici tavan koyar", () => {
    const { g, clock } = gov({ startPerMin: 9 });
    g.report("throttled");
    clock.advance(1000);
    g.report("throttled");
    clock.advance(1000);
    g.report("throttled");
    assert.ok(g.pausedUntil - clock.now() >= 10 * 60_000 - 1);
    assert.ok(g.ceiling() <= g.rate + 1e-9);
  });

  it("art arda ağ hatasında devreyi açar, sondayla kapatır", async () => {
    const { g, clock } = gov({ startPerMin: 6 });
    g.report("network", { error: "ECONNRESET" });
    g.report("network", { error: "ECONNRESET" });
    assert.equal(g.circuit.state, "closed");
    g.report("network", { error: "ECONNRESET" });
    assert.equal(g.circuit.state, "open");
    const t0 = clock.now();
    const slot = await g.acquire();
    assert.equal(slot.probe, true);
    assert.ok(clock.now() - t0 >= 48_000, "en az ~1 dk geri çekilme");
    assert.equal(g.circuit.probeInFlight, true);
    g.report("ok");
    assert.equal(g.circuit.state, "closed");
    const next = await g.acquire();
    assert.equal(next.probe, false);
  });

  it("sonda da düşerse geri çekilme süresi ikiye katlanır", async () => {
    const { g, clock } = gov({ startPerMin: 6 });
    for (let i = 0; i < 3; i++) g.report("network");
    const first = g.pausedUntil - clock.now();
    await g.acquire(); // sonda
    g.report("network");
    assert.equal(g.circuit.level, 2);
    const second = g.pausedUntil - clock.now();
    assert.ok(second > first * 1.5);
  });

  it("captcha: hız yarıya, 5–10 dk mola, geçici tavan; aynı patlamadaki ikinci yanıt sayılmaz; 30 dk içinde tekrar → uzun mola", () => {
    const { g, clock } = gov({ startPerMin: 8 });
    g.report("captcha");
    assert.equal(g.rate, 4);
    const p1 = g.pausedUntil - clock.now();
    assert.ok(p1 >= 5 * 60_000 && p1 <= 10 * 60_000);
    assert.ok(g.ceiling() <= 4);
    clock.advance(3_000);
    g.report("captcha"); // işteki ikinci istek, aynı patlama
    assert.equal(g.rate, 4);
    clock.advance(15 * 60_000);
    g.report("captcha");
    assert.equal(g.rate, 2);
    assert.ok(g.pausedUntil - clock.now() >= 30 * 60_000);
  });

  it("captcha hızı mandallanır: tavan geldiği hızın %85'i, 24 saat, yeniden başlatmada korunur", () => {
    const { g, clock } = gov({ startPerMin: 8 });
    g.report("captcha");
    assert.equal(g.learnedState().perMin, 6.8);
    clock.advance(3 * 3_600_000); // 2 saatlik kısa tavan bitti, mandal sürüyor
    assert.equal(g.ceiling(), 6.8);
    const { g: g2 } = gov({ startPerMin: 8 }, clock);
    g2.restoreLearned(g.learnedState());
    assert.equal(g2.ceiling(), 6.8);
    clock.advance(22 * 3_600_000);
    assert.equal(g2.ceiling(), 8, "24 saat sonra mandal kalkar");
  });

  it("belgeye özgü hata motoru yavaşlatmaz", () => {
    const { g } = gov({ startPerMin: 6 });
    g.report("doc-error");
    assert.equal(g.rate, 6);
    assert.equal(g.pausedUntil, 0);
  });

  it("yerel internet yoksa seviyeyi artırmadan bekler", () => {
    const { g } = gov();
    g.report("offline");
    assert.equal(g.circuit.state, "open");
    assert.equal(g.circuit.level, 0);
  });

  it("mesai saatinde düşük tavan uygular (TR saati)", () => {
    const { g } = gov({ maxPerMin: 10, peak: { enabled: true, days: [1, 2, 3, 4, 5], fromHour: 9, toHour: 18, maxPerMin: 8 } });
    assert.equal(trClock(MON_10).hour, 10);
    assert.equal(g.ceiling(MON_10), 8);
    assert.equal(g.ceiling(SAT_NIGHT), 10);
  });
});

describe("yanıt sınıflama", () => {
  const docJson = (html) => ({ status: 200, text: JSON.stringify({ data: html }) });

  it("tam metin: normal, kalıcı, 429, bakanlık sayfası, boş, captcha, ağ", () => {
    assert.equal(classifyDocumentResponse(docJson("<p>" + "karar metni ".repeat(20) + "</p>")).kind, "ok");
    assert.equal(classifyDocumentResponse({ status: 401, text: "" }).kind, "permanent");
    const t = classifyDocumentResponse({ status: 429, text: "", retryAfterMs: 30_000 });
    assert.equal(t.kind, "throttled");
    assert.equal(t.retryAfterMs, 30_000);
    assert.equal(
      classifyDocumentResponse({ status: 200, text: "<!doctype html><title>Adalet Bakanlığı Bilgi İşlem</title>" }).kind,
      "endpoint-down"
    );
    assert.equal(classifyDocumentResponse({ status: 200, text: "" }).kind, "empty");
    assert.equal(classifyDocumentResponse(docJson("<p>kısa</p>")).kind, "empty");
    assert.equal(
      classifyDocumentResponse({ status: 200, text: JSON.stringify({ status: "EXCEPTION", detailMessage: "DisplayCaptcha" }) }).kind,
      "captcha"
    );
    const meta = (fmte) =>
      JSON.stringify({ data: null, metadata: { FMTY: "ERROR", FMC: "ADALET_RUNTIME_EXCEPTION", FMTE: `Runtime exception:{0}:${fmte}` } });
    assert.equal(classifyDocumentResponse({ status: 200, text: meta("DisplayCaptcha") }).kind, "captcha", "2026-09-26'da görülen biçim");
    const de = classifyDocumentResponse({ status: 200, text: meta("Belge alma isleminde hata olustu. pid:null") });
    assert.equal(de.kind, "doc-error");
    assert.match(de.error, /^Belge alma/);
    assert.equal(
      classifyDocumentResponse({ status: 200, text: "<html>The requested URL was rejected. Your support ID is: 123</html>" }).kind,
      "blocked"
    );
    assert.equal(classifyDocumentResponse({ status: 0, error: "ECONNRESET" }).kind, "network");
  });

  it("arama: sonuç, captcha, html", () => {
    const ok = classifySearchResponse({
      status: 200,
      text: JSON.stringify({
        data: {
          recordsTotal: 2,
          data: [{ id: 11, daire: "3. Hukuk Dairesi", esasNo: "2025/1", kararNo: "2025/2", kararTarihi: "01.09.2025" }],
        },
      }),
    });
    assert.equal(ok.kind, "ok");
    assert.equal(ok.total, 2);
    assert.equal(ok.items[0].id, "11");
    assert.match(ok.items[0].kunye, /Yargıtay 3\. Hukuk Dairesi, E\. 2025\/1/);
    assert.equal(
      classifySearchResponse({ status: 200, text: JSON.stringify({ status: "EXCEPTION", detailMessage: "reCaptchaTimeout" }) }).kind,
      "captcha"
    );
    assert.equal(classifySearchResponse({ status: 200, text: "<html>bakım</html>" }).kind, "server");
  });

  it("normal ana sayfa (reCAPTCHA betiği, isDisplayCaptcha=false) engel sayılmaz; true ise sayılır", async () => {
    const page = (flag) =>
      `<html><script src='https://www.google.com/recaptcha/api.js'></script><p id="isDisplayCaptcha" class="d-none">${flag}</p>` +
      `<script>if(isDisplayCaptcha()){ grecaptcha.reset(); }</script></html>`;
    const client = (flag) => new YargitayClient({}, { fetch: async () => new Response(page(flag), { status: 200 }) });
    assert.equal((await client("false").openSession()).kind, "ok");
    assert.equal((await client("true").openSession()).kind, "captcha");
  });

  it("Retry-After saniye ve tarih biçimi", () => {
    assert.equal(parseRetryAfter("30"), 30_000);
    assert.equal(parseRetryAfter(new Date(Date.now() + 60_000).toUTCString()) > 50_000, true);
    assert.equal(parseRetryAfter(null), 0);
  });

  it("çerezleri saklayıp sonraki istekte geri gönderir", async () => {
    const seen = [];
    const fakeFetch = async (url, init) => {
      seen.push(init.headers.Cookie || null);
      return new Response("<html>ok</html>", {
        status: 200,
        headers: { "set-cookie": "TS01f02b04=abc123; Path=/; HttpOnly" },
      });
    };
    const c = new YargitayClient({}, { fetch: fakeFetch });
    const s = await c.openSession();
    assert.equal(s.kind, "ok");
    await c.document("1");
    assert.equal(seen[0], null);
    assert.equal(seen[1], "TS01f02b04=abc123");
  });
});

describe("plan", () => {
  const cfg = {
    sweep: { yearFrom: 2025, pageSize: 100, splitAbove: 9000, refresh: { recentMonths: 12, everyDays: 14 } },
    politika: { hedefliKelimeler: ["ilke", "yerleşik"], hedefliEnFazlaOran: 0.35 },
  };
  const NOW = SAT_NIGHT;
  const censusAll = (plan) => {
    for (let y = 2026; y >= 2025; y--) plan.census[y] = { total: 1, at: new Date(NOW).toISOString() };
  };

  it("en yeni aydan geriye aylık pencere", () => {
    const w = monthWindows(2025, NOW);
    assert.deepEqual(w[0], { from: "01.09.2026", to: "27.09.2026" });
    assert.deepEqual(w[1], { from: "01.08.2026", to: "31.08.2026" });
    assert.deepEqual(w.at(-1), { from: "01.01.2025", to: "31.01.2025" });
    assert.equal(w.length, 21);
  });

  const items = (k, prefix = "") => Array.from({ length: k }, (_, i) => ({ id: `${prefix}${i}`, daire: "3. Hukuk Dairesi" }));

  it("önce yıllık sayım, sonra ilk pencerenin ölçümü", () => {
    const plan = createPlan(cfg.sweep, NOW);
    assert.equal(nextSearchJob(plan, cfg, NOW).type, "census");
    censusAll(plan);
    const j = nextSearchJob(plan, cfg, NOW);
    assert.equal(j.type, "olcum");
    assert.equal(j.unitId, "01.09.2026..27.09.2026");
    assert.equal(j.params.pageSize, 1);
  });

  it("ölçümde büyük pencere ikiye bölünür, yeni yarı önce", () => {
    const plan = createPlan(cfg.sweep, NOW);
    censusAll(plan);
    const j = nextSearchJob(plan, cfg, NOW);
    applySearchResult(plan, j, { kind: "ok", total: 20_000, items: [] }, cfg, NOW);
    const next = nextSearchJob(plan, cfg, NOW);
    assert.equal(next.type, "olcum");
    assert.equal(next.unitId, "14.09.2026..27.09.2026");
    assert.equal(plan.units.find((u) => u.id === "01.09.2026..13.09.2026").status, "pending");
  });

  it("ölçüm → işaretli arama → envanter → seçim hazır", () => {
    const plan = createPlan(cfg.sweep, NOW);
    censusAll(plan);
    let j = nextSearchJob(plan, cfg, NOW);
    applySearchResult(plan, j, { kind: "ok", total: 150, items: [] }, cfg, NOW);
    j = nextSearchJob(plan, cfg, NOW);
    assert.equal(j.type, "kw");
    assert.equal(j.params.keyword, "ilke yerleşik");
    let r = applySearchResult(plan, j, { kind: "ok", total: 20, items: items(20, "m") }, cfg, NOW);
    assert.equal(r.marked, true);
    assert.equal(r.items.length, 20);
    j = nextSearchJob(plan, cfg, NOW);
    assert.equal(j.type, "inv");
    assert.equal(j.params.pageNumber, 1);
    assert.equal(j.params.keyword, undefined);
    r = applySearchResult(plan, j, { kind: "ok", total: 150, items: items(100) }, cfg, NOW);
    assert.equal(r.ready, false);
    j = nextSearchJob(plan, cfg, NOW);
    assert.equal(j.params.pageNumber, 2);
    r = applySearchResult(plan, j, { kind: "ok", total: 150, items: items(50, "x") }, cfg, NOW);
    assert.equal(r.ready, true);
    assert.equal(plan.units[0].status, "secim");
    markSelected(plan, plan.units[0].id, 170, NOW);
    assert.equal(plan.units[0].status, "secildi");
    assert.equal(plan.units[0].selectedUpTo, 170);
    assert.equal(nextSearchJob(plan, cfg, NOW).unitId, "01.08.2026..31.08.2026");
  });

  it("işaret kelimeleri pencerenin çoğunda geçiyorsa işaretli arama atlanır", () => {
    const plan = createPlan(cfg.sweep, NOW);
    censusAll(plan);
    applySearchResult(plan, nextSearchJob(plan, cfg, NOW), { kind: "ok", total: 1000, items: [] }, cfg, NOW);
    const r = applySearchResult(plan, nextSearchJob(plan, cfg, NOW), { kind: "ok", total: 600, items: items(100) }, cfg, NOW);
    assert.equal(r.items.length, 0);
    assert.equal(plan.units[0].kwSkipped, true);
    assert.equal(nextSearchJob(plan, cfg, NOW).type, "inv");
  });

  it("seçilmiş yakın tarihli pencere 14 gün sonra yoklanır; toplam arttıysa yeniden envanterlenir", () => {
    const plan = createPlan(cfg.sweep, NOW);
    censusAll(plan);
    for (const u of plan.units) {
      u.status = "secildi";
      u.total = 500;
      u.checkedAt = new Date(NOW).toISOString();
    }
    const later = NOW + 15 * 86_400_000;
    for (let y = 2026; y >= 2025; y--) plan.census[y].at = new Date(later).toISOString();
    const j = nextSearchJob(plan, cfg, later);
    assert.equal(j.type, "check");
    applySearchResult(plan, j, { kind: "ok", total: 540, items: [] }, cfg, later);
    const u = plan.units.find((x) => x.id === j.unitId);
    assert.equal(u.status, "kw");
    assert.equal(u.page, 1);
  });

  it("hedef dolunca eski yıllara geçilmez", () => {
    const plan = createPlan(cfg.sweep, NOW);
    censusAll(plan);
    for (const u of plan.units) if (u.from.endsWith("2026")) u.status = "secildi";
    plan.hedefTamam = true;
    assert.equal(nextSearchJob({ ...plan, units: plan.units }, { ...cfg, sweep: { ...cfg.sweep, refresh: {} } }, NOW), null);
  });

  it("v1 planından geçişte yıllık sayım korunur", () => {
    const old = { version: 1, strategy: "newest-first-all-units", census: { 2026: { total: 5, at: "x" } }, units: [] };
    const p = migratePlan(old, cfg.sweep, NOW, { hedefYararliKarar: 600000 });
    assert.equal(p.version, 2);
    assert.equal(p.census["2026"].total, 5);
    assert.equal(p.politika.hedefYararliKarar, 600000);
    assert.equal(p.units[0].status, "pending");
  });

  it("üst üste sunucu hatasında tek günlük pencerede envanter sayfası atlanır", () => {
    const plan = { units: [{ id: "05.01.2025..05.01.2025", from: "05.01.2025", to: "05.01.2025", status: "inv", page: 3, total: 900 }], census: {} };
    const job = { type: "inv", unitId: plan.units[0].id, params: { pageSize: 100 } };
    for (let i = 0; i < 4; i++) applySearchFailure(plan, job, { kind: "server" });
    assert.equal(plan.units[0].page, 3);
    applySearchFailure(plan, job, { kind: "server" });
    assert.equal(plan.units[0].page, 4);
    assert.deepEqual(plan.units[0].skippedPages, [3]);
    applySearchFailure(plan, job, { kind: "throttled" });
    assert.equal(plan.units[0].fails, 0);
  });

  it("takvim ilerleyince başa yeni pencereler eklenir", () => {
    const plan = createPlan(cfg.sweep, NOW);
    const later = Date.UTC(2026, 9, 10, 9, 0, 0);
    assert.equal(extendPlanToNow(plan, later), 2);
    assert.equal(plan.units[0].id, "01.10.2026..10.10.2026");
    assert.equal(plan.units[1].id, "28.09.2026..30.09.2026");
    assert.equal(extendPlanToNow(plan, later), 0);
  });
});

describe("seçim (emsal politikası)", () => {
  const pol = { ornekleme: { verimCarpani: 1, enAzOran: 0.1, daireEnFazlaPay: 1 }, doldurma: { esik: 0.55, enAzAnaliz: 20 } };
  const mk = (n, daire, t = "15.07.2026", extra = {}) =>
    Array.from({ length: n }, (_, i) => ({ i: `${daire}-${t}-${i}`, d: daire, e: `2026/${i}`, k: `2026/${1000 + i}`, t, m: 0, ...extra }));

  it("eşit aralıklı seçim", () => {
    assert.deepEqual(spreadPick(10, 2), [2, 7]);
    assert.deepEqual(spreadPick(3, 5), [0, 1, 2]);
  });

  it("hak gün sayısından azsa günlere yayılır, her günden biri", () => {
    const items = [...mk(50, "9. Hukuk Dairesi", "10.07.2026"), ...mk(50, "9. Hukuk Dairesi", "11.07.2026"), ...mk(50, "9. Hukuk Dairesi", "12.07.2026")];
    const p = pickSpreadAcrossDays(items, 2);
    assert.equal(p.length, 2);
    assert.notEqual(p[0].t, p[1].t);
  });

  it("kurul ve emsal işaretli kararların hepsi; işaretsizler verime göre örneklenir", () => {
    const items = [
      ...mk(10, "Hukuk Genel Kurulu"),
      ...mk(30, "3. Hukuk Dairesi", "15.07.2026", { m: 1 }),
      ...mk(200, "12. Hukuk Dairesi"),
      ...mk(100, "1. Hukuk Dairesi"),
    ];
    const known = new Set(["1. Hukuk Dairesi-15.07.2026-0"]);
    const sel = selectWindow(items, {
      known: (id) => known.has(id),
      estimate: (d) => (d.startsWith("12.") ? 0.05 : 0.9),
      policy: pol,
    });
    const by = (k) => sel.filter((s) => s.kanal === k);
    assert.equal(by("kurul").length, 10);
    assert.equal(by("hedefli").length, 30);
    const s12 = by("ornek").filter((s) => s.d === "12. Hukuk Dairesi").length;
    const s1 = by("ornek").filter((s) => s.d === "1. Hukuk Dairesi").length;
    assert.equal(s12, 20, "verimi düşük birim: en az oran %10");
    assert.equal(s1, 89, "verimli birim: %90 − zaten bilinen 1");
    assert.ok(!sel.some((s) => known.has(s.i)), "bilinen karar yeniden seçilmez");
  });

  it("tek birim pencerenin payını aşamaz", () => {
    const items = [...mk(900, "9. Hukuk Dairesi"), ...mk(100, "2. Hukuk Dairesi")];
    const sel = selectWindow(items, {
      known: () => false,
      estimate: () => 1,
      policy: { ...pol, ornekleme: { ...pol.ornekleme, daireEnFazlaPay: 0.25 } },
    });
    assert.equal(sel.filter((s) => s.d === "9. Hukuk Dairesi").length, 250);
    assert.equal(sel.filter((s) => s.d === "2. Hukuk Dairesi").length, 100);
  });

  it("doldurma yalnız verimi eşik üstündeki ve yeterince ölçülmüş birimlere", () => {
    const items = [...mk(300, "4. Hukuk Dairesi"), ...mk(300, "6. Ceza Dairesi"), ...mk(300, "7. Hukuk Dairesi")];
    const got = new Set(items.filter((_, i) => i % 10 === 0).map((x) => x.i)); // her birimden 30 inmiş
    const sel = selectFill(items, {
      known: (id) => got.has(id),
      yearCounts: (d) => (d.startsWith("4.") ? { n: 30, u: 24 } : d.startsWith("6.") ? { n: 30, u: 3 } : { n: 10, u: 10 }),
      policy: pol,
    });
    assert.ok(sel.length > 0 && sel.every((s) => s.d === "4. Hukuk Dairesi" && s.kanal === "doldurma"));
    assert.equal(sel.length, 30, "yaklaşık ikiye katlama");
  });
});

describe("emsal defteri ve benzerlik", () => {
  const base =
    "Taraflar arasındaki alacak davasının yapılan yargılaması sonunda mahkemece davanın kabulüne karar verilmiş hüküm davalı vekilince temyiz edilmiştir ";
  const gerekce =
    "kira sözleşmesinin feshi halinde kiracının tahliye yükümlülüğü ile kiralananın geri verilmesi borcu ve ödenmeyen kira bedelleri için temerrüt faizi hesaplanmasında dikkate alınacak ilkeler açıklanmış olup ";
  const other =
    "iş sözleşmesinin haklı nedenle feshinde kıdem tazminatı ihbar tazminatı fazla çalışma ücreti ve yıllık izin alacaklarının belirlenmesinde tanık beyanları ile işyeri kayıtlarının değerlendirilmesi gerekmektedir ";

  it("aynı kalıp metin yakın kopya, farklı konu değil", () => {
    const idx = new SimilarityIndex(8);
    const a = simhash64(base + gerekce.repeat(3) + "Ahmet Yılmaz");
    const b = simhash64(base + gerekce.repeat(3) + "Mehmet Demir");
    const c = simhash64(base + other.repeat(3));
    idx.add("3. hukuk dairesi", "A", a[0], a[1]);
    assert.ok(idx.findNear("3. hukuk dairesi", b[0], b[1]), "isim farkı → benzer");
    assert.equal(idx.findNear("3. hukuk dairesi", c[0], c[1]), null, "başka konu → benzersiz");
    assert.equal(idx.findNear("9. hukuk dairesi", b[0], b[1]), null, "başka birimle karşılaştırılmaz");
    assert.ok(hamming64(a[0], a[1], c[0], c[1]) > 8);
  });

  it("işaret kelimesi kelime başında ve Türkçe büyük harfle de yakalanır", () => {
    const re = markerRegex(["ilke", "öğreti"]);
    assert.equal(isMarked("Dairemizin İLKE kararı", re), true);
    assert.equal(isMarked("Öğretide kabul edilen", re), true);
    assert.equal(isMarked("silkelemek", re), false);
  });

  it("verim tahmini önselden başlar, yıl verisiyle güncellenir; işaretliler ayrı", () => {
    const st = new YieldStats();
    assert.equal(st.estimate("3. Hukuk Dairesi", 2026), 0.5);
    for (let i = 0; i < 40; i++) st.record("3. Hukuk Dairesi", 2026, { useful: i < 4 }, false);
    for (let i = 0; i < 40; i++) st.record("3. Hukuk Dairesi", 2026, { useful: true }, true);
    assert.ok(st.estimate("3. Hukuk Dairesi", 2026) < 0.15);
    assert.ok(st.estimate("3. Hukuk Dairesi", 2026, true) > 0.9);
    assert.ok(st.estimate("3. Hukuk Dairesi", 2010) === 0.5, "uzak yıl → yalnız önsel");
    assert.equal(st.totals.useful, 44);
  });

  it("defter satırları yeniden yüklenince indeks ve sayaçlar aynı kurulur", () => {
    const lines = [];
    const io = { readLines: () => lines, appendLine: (_, l) => lines.push(l) };
    const book = new EmsalBook("x", { hedefliKelimeler: ["ilke"] }, io).load();
    const long = base + gerekce.repeat(8);
    const r1 = book.analyze({ id: "1", daire: "3. Hukuk Dairesi", tarih: "01.07.2026", text: long + " Ali" }, "2026");
    const r2 = book.analyze({ id: "2", daire: "3. Hukuk Dairesi", tarih: "02.07.2026", text: long + " Veli" }, "2026");
    assert.equal(r1.dupOf, null);
    assert.equal(r2.dupOf, "1");
    assert.equal(r1.marked, true);
    const again = new EmsalBook("x", { hedefliKelimeler: ["ilke"] }, io).load();
    assert.equal(again.analyzed.size, 2);
    assert.equal(again.stats.totals.dup, 1);
    assert.equal(again.index.size, 1);
  });
});

describe("depo", () => {
  function tmpPaths() {
    const base = mkdtempSync(join(tmpdir(), "hasat-test-"));
    const state = join(base, "_state");
    mkdirSync(state, { recursive: true });
    return {
      base,
      decisions: join(base, "decisions"),
      state,
      progress: join(state, "progress.json"),
      queue: join(state, "queue.jsonl"),
      daily: join(state, "daily.json"),
      index: join(base, "index.jsonl"),
      byAlan: join(base, "by-alan"),
      byTier: join(base, "by-tier"),
    };
  }
  const rec = (id, tarih = "03.02.2025") => ({
    id,
    tarih,
    kunye: `Yargıtay 3. Hukuk Dairesi, E. x, K. y, T. ${tarih}`,
    alan: "borclar",
    tierId: "borclar-daire",
    daire: "3. Hukuk Dairesi",
    text: "metin",
    downloadedAt: new Date().toISOString(),
  });

  it("atomik yazım dosyayı değiştirir", () => {
    const p = tmpPaths();
    const f = join(p.state, "x.json");
    atomicWriteFileSync(f, "1");
    atomicWriteFileSync(f, "2");
    assert.equal(readFileSync(f, "utf8"), "2");
    rmSync(p.base, { recursive: true, force: true });
  });

  it("karar kaydı eski düzenle aynı yerlere yazılır; günlük yeniden oynatılır", () => {
    const p = tmpPaths();
    writeFileSync(p.queue, JSON.stringify({ id: "A" }) + "\n" + JSON.stringify({ id: "B" }) + "\n");
    const s = new Store(p).load();
    assert.equal(s.queue.length, 2);
    s.recordDownload(rec("A"));
    assert.ok(existsSync(join(p.decisions, "2025", "A.json")));
    assert.ok(existsSync(join(p.byAlan, "borclar", "A.json")));
    assert.ok(existsSync(join(p.byTier, "borclar-daire", "A.json")));
    const idx = readFileSync(p.index, "utf8").trim().split("\n").map((l) => JSON.parse(l));
    assert.equal(idx[0].file, "decisions/2025/A.json");
    // çökme simülasyonu: progress.json hiç yazılmadan yeniden aç
    const s2 = new Store(p).load();
    assert.equal(s2.downloadedCount, 1);
    assert.deepEqual(s2.queue.map((q) => q.id), ["B"], "inmiş öğe kuyruktan düşer");
    s2.checkpoint({ full: true });
    assert.equal(readFileSync(join(p.state, "journal.jsonl"), "utf8"), "");
    const s3 = new Store(p).load();
    assert.equal(s3.downloadedCount, 1);
    rmSync(p.base, { recursive: true, force: true });
  });

  it("progress.json bozuksa diskteki kararlardan yeniden kurar", () => {
    const p = tmpPaths();
    mkdirSync(join(p.decisions, "2024"), { recursive: true });
    writeFileSync(join(p.decisions, "2024", "X.json"), "{}");
    writeFileSync(join(p.decisions, "2024", "Y.json"), "{}");
    writeFileSync(p.progress, '{"downloadedIds": {"X": ');
    const s = new Store(p).load();
    assert.equal(s.downloadedCount, 2);
    assert.equal(s.byYear["2024"], 2);
    rmSync(p.base, { recursive: true, force: true });
  });

  it("daire sınıflaması eski katmanlarla uyumlu", () => {
    const classify = makeDaireClassifier([
      { id: "borclar-daire", mode: "unit-keyword", alan: "borclar", daireler: ["3. Hukuk Dairesi"] },
    ]);
    assert.equal(classify("Hukuk Genel Kurulu").tierId, "hgk");
    assert.equal(classify("Ceza Genel Kurulu").tierId, "cgk");
    assert.equal(classify("Büyük Genel Kurulu").tierId, "yibk");
    assert.equal(classify("Ceza Daireleri Başkanlar Kurulu").tierId, "cdbk");
    assert.equal(classify("3. Hukuk Dairesi").tierId, "borclar-daire");
    assert.equal(classify("7. Hukuk Dairesi").alan, "hukuk");
    assert.equal(classify("2. Ceza Dairesi").tierId, "ceza-daire");
    assert.ok(classify("Hukuk Genel Kurulu").priority < classify("7. Hukuk Dairesi").priority);
  });
});

describe("kilit devralma (uykudan dönüş)", () => {
  const mk = () => {
    const state = mkdtempSync(join(tmpdir(), "hasat-grace-"));
    return { state, lock: join(state, "harvester.lock"), status: join(state, "harvester-status.json") };
  };
  const old = () => new Date(Date.now() - 10 * 60_000).toISOString();

  it("sahip yaşıyor ve bekleme içinde kalbi atarsa devralmaz", async () => {
    const paths = mk();
    const owner = process.ppid; // yaşayan, bize ait olmayan süreç
    writeFileSync(paths.lock, JSON.stringify({ pid: owner, startedAt: old() }));
    writeFileSync(paths.status, JSON.stringify({ pid: owner, heartbeatAt: old() }));
    setTimeout(() => writeFileSync(paths.status, JSON.stringify({ pid: owner, heartbeatAt: new Date().toISOString() })), 100);
    assert.equal(await acquireLock(paths, () => {}, 400), false);
    assert.equal(JSON.parse(readFileSync(paths.lock, "utf8")).pid, owner);
    rmSync(paths.state, { recursive: true, force: true });
  });

  it("sahip yaşıyor ama bekleme boyunca sessizse (asılı) devralır", async () => {
    const paths = mk();
    writeFileSync(paths.lock, JSON.stringify({ pid: process.ppid, startedAt: old() }));
    writeFileSync(paths.status, JSON.stringify({ pid: process.ppid, heartbeatAt: old() }));
    assert.equal(await acquireLock(paths, () => {}, 200), true);
    assert.equal(JSON.parse(readFileSync(paths.lock, "utf8")).pid, process.pid);
    rmSync(paths.state, { recursive: true, force: true });
  });
});

describe("tek kopya kilidi", () => {
  it("canlı pid + taze kalp atışı → aktif; ölü pid ya da bayat kalp → pasif", () => {
    const base = mkdtempSync(join(tmpdir(), "hasat-lock-"));
    const paths = { state: base };
    writeFileSync(join(base, "harvester.lock"), JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }));
    assert.equal(harvesterActive(paths), true);
    writeFileSync(join(base, "harvester.lock"), JSON.stringify({ pid: 2_147_000_000, startedAt: new Date().toISOString() }));
    assert.equal(harvesterActive(paths), false);
    const old = new Date(Date.now() - 10 * 60_000).toISOString();
    writeFileSync(join(base, "harvester.lock"), JSON.stringify({ pid: process.pid, startedAt: old }));
    writeFileSync(join(base, "harvester-status.json"), JSON.stringify({ pid: process.pid, heartbeatAt: old }));
    assert.equal(harvesterActive(paths), false);
    rmSync(base, { recursive: true, force: true });
  });
});
