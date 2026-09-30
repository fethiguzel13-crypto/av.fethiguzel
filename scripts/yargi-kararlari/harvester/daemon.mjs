/**
 * Yargıtay hasat motoru v2 — tek süreç, kesintisiz, uyarlamalı hız, emsal odaklı seçim.
 *
 * Eski yığın (izleyici görev → watchdog → until-done → 350'lik partiler) yerine
 * tek bir uzun ömürlü süreç:
 *   - N işçi, hepsi tek bir validen (governor) slot alır → siteye giden toplam hız sabit.
 *   - Kuyruk `lowWater` altına inince sıradaki pencere envanterlenir (künye araması);
 *     envanter bitince seçim (secim.mjs) kurul + emsal işaretli + örneklenmiş kararları
 *     kuyruğa koyar. Kuyruk yıl sırasıyla (önce en yeni yıl) boşaltılır.
 *   - İnen her karar emsal defterinde (emsal.mjs) puanlanır ve benzerlik denetiminden
 *     geçer; "yararlı" = emsal nitelikli ve benzersiz. Politika hedefi (ör. 600.000)
 *     dolunca yalnız içinde bulunulan yıl güncel tutulur.
 *   - Tek kopya kilidi (_state/harvester.lock + kalp atışı); eski arşivleyici
 *     bu kilidi görünce kendiliğinden çıkar (çift hız = ban riski).
 *   - _state/harvester.stop dosyası ya da SIGINT/SIGTERM → işteki istekler
 *     bitirilir, durum yazılır, çıkılır.
 */

import {
  appendFileSync,
  existsSync,
  readFileSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { execFileSync } from "child_process";
import {
  ensureDirs,
  harvesterActive,
  loadConfig as loadLegacyConfig,
  outPaths,
  rollDaily,
  yearFromTarih,
} from "../lib.mjs";
import { Governor, StopError } from "./governor.mjs";
import { YargitayClient, internetReachable } from "./http.mjs";
import { Store, atomicWriteFileSync, makeDaireClassifier } from "./store.mjs";
import { EmsalBook } from "./emsal.mjs";
import { selectFill, selectWindow } from "./secim.mjs";
import {
  applySearchFailure,
  applySearchResult,
  createPlan,
  extendPlanToNow,
  markSelected,
  migratePlan,
  nextSearchJob,
  planProgress,
  trYear,
  universeSize,
  unitYear,
  yearAllSelected,
  yearUnits,
} from "./plan.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const HARVESTER_CONFIG_PATH = join(__dirname, "..", "harvester.json");
export const VERSION = "2.1.0";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const tick = () => new Promise((r) => setImmediate(r));

export function loadHarvesterConfig(path = HARVESTER_CONFIG_PATH) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function statePaths(cfg) {
  const paths = outPaths(cfg);
  return {
    ...paths,
    lock: join(paths.state, "harvester.lock"),
    status: join(paths.state, "harvester-status.json"),
    stopFile: join(paths.state, "harvester.stop"),
    log: join(paths.state, "harvester.log"),
    emsalBook: join(paths.state, "benzerlik.jsonl"),
  };
}

function makeLogger(path, { maxBytes = 20 * 1024 * 1024, echo = true } = {}) {
  let size = existsSync(path) ? statSync(path).size : 0;
  return (line) => {
    const s = `${new Date().toISOString()} ${line}\n`;
    if (echo) process.stderr.write(s);
    try {
      if (size + s.length > maxBytes) {
        for (const [a, b] of [[".2", ".3"], [".1", ".2"], ["", ".1"]]) {
          try {
            renameSync(path + a, path + b);
          } catch {
            /* yoksa geç */
          }
        }
        size = 0;
      }
      appendFileSync(path, s, "utf8");
      size += Buffer.byteLength(s);
    } catch {
      /* log yazılamadı — motoru durdurmaz */
    }
  };
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

function readLines(path) {
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8").split("\n").filter(Boolean);
}

function isPidAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return e.code === "EPERM";
  }
}

function writeLock(paths) {
  writeFileSync(
    paths.lock,
    JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString(), version: VERSION }),
    { encoding: "utf8", flag: "wx" }
  );
}

/**
 * Kilit sahibi süreç yaşıyor ama kalp atışı bayatsa (dizüstü uykudan yeni döndü,
 * zamanlayıcıları henüz işlemedi) hemen devralma: `graceMs` bekle, yeniden bak.
 */
export async function acquireLock(paths, log, graceMs = 30_000) {
  if (existsSync(paths.lock)) {
    if (harvesterActive(paths)) return false;
    const lock = readJson(paths.lock);
    if (lock?.pid && lock.pid !== process.pid && isPidAlive(lock.pid) && graceMs > 0) {
      log(`[motor] kilit sahibi pid ${lock.pid} yaşıyor ama kalp atışı bayat — ${graceMs / 1000} sn bekleniyor`);
      await sleep(graceMs);
      if (harvesterActive(paths)) return false;
    }
    try {
      unlinkSync(paths.lock);
    } catch {
      /* yarış — aşağıda wx karar verir */
    }
  }
  try {
    writeLock(paths);
    return true;
  } catch (e) {
    if (e.code === "EEXIST") return false;
    throw e;
  }
}

function releaseLock(paths) {
  const l = readJson(paths.lock);
  if (l?.pid === process.pid) {
    try {
      unlinkSync(paths.lock);
    } catch {
      /* yoksay */
    }
  }
}

/** Eski arşivleyici (archive-yargitay / until-done) süreçleri. */
export function legacyProcesses() {
  try {
    let out = "";
    if (process.platform === "win32") {
      out = execFileSync(
        "powershell.exe",
        [
          "-NoProfile",
          "-NonInteractive",
          "-Command",
          "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | ForEach-Object { \"$($_.ProcessId)`t$($_.CommandLine)\" }",
        ],
        { encoding: "utf8", timeout: 60_000, windowsHide: true }
      );
    } else {
      out = execFileSync("ps", ["-eo", "pid=,args="], { encoding: "utf8" }).replace(/^\s*(\d+)\s+/gm, "$1\t");
    }
    return out
      .split(/\r?\n/)
      .filter((l) => /archive-yargitay\.mjs|until-done\.mjs/.test(l))
      .map((l) => {
        const [pid, ...rest] = l.split("\t");
        return { pid: Number(pid), cmd: rest.join("\t").trim() };
      })
      .filter((x) => x.pid && x.pid !== process.pid);
  } catch {
    return [];
  }
}

const KANAL_PRIORITY = { hedefli: 3, ornek: 5, doldurma: 6 };

function itemYear(q) {
  return Number(yearFromTarih(q.tarih)) || 0;
}

export async function runDaemon(opts = {}) {
  const configPath = opts.configPath || HARVESTER_CONFIG_PATH;
  let cfg = loadHarvesterConfig(configPath);
  const legacyCfg = loadLegacyConfig();
  const paths = statePaths(cfg);
  ensureDirs(paths);
  const log = makeLogger(paths.log, { echo: !opts.quiet });
  const prevStatus = readJson(paths.status); // öğrenilmiş hız tavanı buradan geri yüklenir

  if (!(await acquireLock(paths, log, opts.lockGraceMs ?? 30_000))) {
    log("[motor] başka bir hasat motoru zaten çalışıyor — bu kopya çıkıyor");
    return 0;
  }
  const startedAt = new Date().toISOString();
  const heartbeat = (extra) =>
    atomicWriteFileSync(
      paths.status,
      JSON.stringify({ version: VERSION, pid: process.pid, startedAt, heartbeatAt: new Date().toISOString(), ...extra }, null, 2)
    );

  let stopRequested = false;
  let governor = null;
  const requestStop = (why) => {
    if (stopRequested) return;
    stopRequested = true;
    log(`[motor] durdurma isteği: ${why} — işteki istekler bitirilip durum yazılacak`);
    governor?.stop();
  };
  for (const sig of ["SIGINT", "SIGTERM", "SIGBREAK", "SIGHUP"]) {
    try {
      process.on(sig, () => requestStop(sig));
    } catch {
      /* platformda yok */
    }
  }
  if (existsSync(paths.stopFile)) unlinkSync(paths.stopFile);

  // Eski arşivleyici hâlâ koşuyorsa bitmesini bekle (aynı IP'den çift hız olmasın).
  for (;;) {
    const legacy = opts.skipLegacyCheck ? [] : legacyProcesses();
    if (!legacy.length || stopRequested) break;
    log(`[motor] eski arşivleyici çalışıyor (pid ${legacy.map((x) => x.pid).join(", ")}) — bitmesi bekleniyor`);
    heartbeat({ state: "waiting-legacy", legacy });
    for (let i = 0; i < 30 && !stopRequested; i++) {
      await sleep(2_000);
      if (existsSync(paths.stopFile)) requestStop("durdurma dosyası");
    }
  }
  if (stopRequested) {
    releaseLock(paths);
    return 0;
  }

  const store = new Store(paths, log).load();
  const politika = cfg.politika || {};
  if (!store.plan) {
    store.plan = createPlan(cfg.sweep, Date.now(), politika);
    log(`[plan] yeni plan (emsal odaklı, yıl yıl): ${store.plan.units.length} aylık pencere, en yeni aydan ${cfg.sweep.yearFrom}'e`);
  } else if ((store.plan.version || 1) < 2) {
    try {
      renameSync(store.planPath, store.planPath.replace(/\.json$/, `.v1-${Date.now()}.json`));
    } catch {
      /* eski plan yedeklenemedi — yine de geç */
    }
    store.plan = migratePlan(store.plan, cfg.sweep, Date.now(), politika);
    log("[plan] v1 (tek geçişli tarama) → v2 (emsal odaklı, yıl yıl) geçişi yapıldı; yıllık sayım korundu");
  }
  const extended = extendPlanToNow(store.plan);
  if (extended) log(`[plan] takvim ilerledi → ${extended} yeni pencere eklendi`);

  const book = new EmsalBook(
    paths.emsalBook,
    { ...(politika.emsal || {}), hedefliKelimeler: politika.hedefliKelimeler || [] },
    { readLines, appendLine: (p, line) => appendFileSync(p, line + "\n", "utf8") }
  ).load();
  log(
    `[emsal] defter: ${book.analyzed.size} analiz | yararlı ${book.stats.totals.useful} | benzer ${book.stats.totals.dup} | zayıf ${book.stats.totals.weak}`
  );

  const classify = makeDaireClassifier(legacyCfg.tiers || []);
  governor = new Governor(cfg.rate, { log });
  const gov = governor;
  gov.restoreLearned(prevStatus?.governor?.learned);
  if (gov.learnedState()) log(`[vali] öğrenilmiş tavan geri yüklendi: ${gov.learnedState().perMin}/dk`);
  const client = new YargitayClient(cfg);
  const parkedIds = new Set(store.parked.map((q) => q.id));
  const invSeen = new Map(); // pencere → envanterdeki id kümesi (etkin pencereler)

  const inflight = new Set();
  let searchInFlight = false;
  let sessionReady = cfg.cookieJar === false;
  let sessionBusy = false;
  let sessionAttempts = 0;
  let downloadsThisRun = 0;
  let lastOkAt = null;
  let lastError = null;
  let catchUpLeft = 0;
  const maxThisRun = opts.max ?? Infinity;
  const events = []; // [ts, kind, type, useful]
  const note = (kind, type, useful = false) => events.push([Date.now(), kind, type, useful]);

  function sortQueue() {
    store.queue.sort((a, b) => itemYear(b) - itemYear(a) || (a.priority ?? 5) - (b.priority ?? 5));
  }
  sortQueue();
  store.checkpoint();

  log(
    `[motor] v${VERSION} başladı pid=${process.pid} | indirilmiş ${store.downloadedCount} | kuyruk ${store.queue.length} | park ${store.parked.length} | işçi ${cfg.concurrency} | hız ${gov.snapshot().ratePerMin}/dk (tavan ${gov.snapshot().ceilingPerMin}) | hedef ${politika.hedefYararliKarar || "—"} yararlı karar`
  );

  const inflightYear = new Map(); // id → yıl (yıl doldurma denetimi için)

  /** Seçim anındaki "zaten bilinen" kararlar: inmiş, kalıcı hatalı, kuyrukta, işte, parkta. */
  function makeKnown() {
    const qIds = new Set(store.queue.map((q) => q.id));
    return (id) => store.isKnown(id) || qIds.has(id) || inflight.has(id) || parkedIds.has(id);
  }

  function takeQueueItem(now) {
    for (let i = 0; i < store.queue.length; i++) {
      const q = store.queue[i];
      if (inflight.has(q.id)) continue;
      if (q.notBefore && Date.parse(q.notBefore) > now) continue;
      store.queue.splice(i, 1);
      return q;
    }
    return null;
  }

  function pickJob() {
    if (stopRequested) return null;
    const now = Date.now();
    store.daily = rollDaily(store.daily);
    if (!sessionReady) {
      if (sessionBusy) return null;
      sessionBusy = true;
      return { type: "session" };
    }
    const ftOk =
      store.daily.fullText < cfg.budget.maxFullTextPerDay && downloadsThisRun + inflight.size < maxThisRun;
    const scOk = !opts.downloadOnly && store.daily.searchCalls < cfg.budget.maxSearchCallsPerDay;
    if (scOk && !searchInFlight && store.queue.length < cfg.queue.lowWater) {
      const sj = nextSearchJob(store.plan, cfg, now);
      if (sj) {
        searchInFlight = true;
        return sj;
      }
    }
    if (ftOk) {
      const item = takeQueueItem(now);
      if (item) {
        inflight.add(item.id);
        inflightYear.set(item.id, itemYear(item));
        return { type: "doc", item };
      }
    }
    return null;
  }

  function releaseJob(job) {
    if (job.type === "doc") {
      inflight.delete(job.item.id);
      inflightYear.delete(job.item.id);
      store.queue.unshift(job.item);
    } else if (job.type === "session") sessionBusy = false;
    else searchInFlight = false;
  }

  function describeSearch(job) {
    if (job.type === "census") return `sayım ${job.year}`;
    if (job.type === "check") return `yenileme ${job.unitId}`;
    if (job.type === "olcum") return `ölçüm ${job.unitId}`;
    if (job.type === "kw") return `işaretli ${job.unitId} s.${job.page}`;
    return `envanter ${job.unitId} s.${job.page}`;
  }

  function seenFor(unitId) {
    if (!invSeen.has(unitId)) invSeen.set(unitId, new Set(store.loadInventory(unitId).map((x) => x.i)));
    return invSeen.get(unitId);
  }

  function toQueueItem(it, pencere) {
    const c = classify(it.d);
    const kanal = it.kanal;
    return {
      id: it.i,
      alan: c.alan,
      tierId: c.tierId,
      priority: kanal === "kurul" ? c.priority : KANAL_PRIORITY[kanal] ?? 5,
      keyword: "",
      daire: it.d,
      esas: it.e,
      karar: it.k,
      tarih: it.t,
      kunye: `Yargıtay ${it.d}, E. ${it.e}, K. ${it.k}, T. ${it.t}`,
      queuedAt: new Date().toISOString(),
      source: "yargitay-resmi",
      kanal,
      m: it.m ? 1 : 0,
      pencere,
    };
  }

  function enqueueSelected(sel, pencere) {
    for (const it of sel) store.queue.push(toQueueItem(it, pencere));
    store.progress.stats.queued += sel.length;
    sortQueue();
  }

  function countBy(sel) {
    const c = { kurul: 0, hedefli: 0, ornek: 0, doldurma: 0 };
    for (const s of sel) c[s.kanal] = (c[s.kanal] || 0) + 1;
    return c;
  }

  /** Pencerenin envanteri tamam: seçimi çalıştır, kuyruğa koy, pencereyi kapat. */
  function runSelection(unitIdValue) {
    const u = store.plan.units.find((x) => x.id === unitIdValue);
    if (!u) return;
    const inv = store.loadInventory(unitIdValue);
    const fresh = inv.slice(u.selectedUpTo || 0);
    const year = unitYear(u);
    // Henüz ölçülmemiş birim için önsel verim (2013 kalibrasyonu: daire kararlarının ~%12'si yararlı).
    const onsel = politika.ornekleme?.onselVerim ?? 0.3;
    const prior = { u: onsel * 3, n: 3 };
    const sel = selectWindow(fresh, {
      known: makeKnown(),
      estimate: (daire, marked) => book.stats.estimate(daire, year, marked, prior),
      policy: politika,
    });
    enqueueSelected(sel, unitIdValue);
    markSelected(store.plan, unitIdValue, inv.length);
    invSeen.delete(unitIdValue);
    const c = countBy(sel);
    log(
      `[seçim] ${unitIdValue}: envanter ${fresh.length} → ${sel.length} seçildi (kurul ${c.kurul}, emsal işaretli ${c.hedefli}, örnek ${c.ornek}) | kuyruk ${store.queue.length}`
    );
  }

  /** Yılı bitmiş (tüm pencereleri seçilmiş, kuyrukta kararı kalmamış) yıllar için doldurma turu. */
  function yearFillCheck() {
    const plan = store.plan;
    plan.years ||= {};
    const years = [...new Set(plan.units.filter((u) => u.status !== "split").map(unitYear))].sort((a, b) => b - a);
    const maxRounds = politika.doldurma?.enFazlaTur ?? 4;
    for (const Y of years) {
      if (plan.years[Y]?.phase === "tamam" || !yearAllSelected(plan, Y)) continue;
      const ys = (plan.years[Y] ||= { phase: "tarama", fillRound: 0 });
      const pending = store.queue.some((q) => itemYear(q) === Y) || [...inflightYear.values()].includes(Y);
      if (pending) continue;
      if (ys.fillRound >= maxRounds) {
        ys.phase = "tamam";
        ys.doneAt = new Date().toISOString();
        log(`[yıl] ${Y} tamamlandı (${ys.fillRound} doldurma turu)`);
        continue;
      }
      const items = [];
      for (const u of yearUnits(plan, Y)) items.push(...store.loadInventory(u.id));
      const sel = selectFill(items, {
        known: makeKnown(),
        yearCounts: (daire) => book.stats.yearCounts(daire, Y, false),
        policy: politika,
      });
      ys.fillRound++;
      if (!sel.length) {
        ys.phase = "tamam";
        ys.doneAt = new Date().toISOString();
        log(`[yıl] ${Y} tamamlandı — verimi eşik üstünde örneklenecek birim kalmadı`);
      } else {
        ys.phase = "doldurma";
        enqueueSelected(sel, `yil-${Y}-doldurma-${ys.fillRound}`);
        log(`[yıl] ${Y} doldurma turu ${ys.fillRound}: verimli birimlerden ${sel.length} karar daha`);
      }
    }
  }

  async function executeSession() {
    const r = await client.openSession();
    gov.report(r.kind, r);
    note(r.kind, "session");
    sessionBusy = false;
    sessionAttempts++;
    if (r.kind === "ok") {
      sessionReady = true;
      log(`[oturum] açıldı (${r.cookies} çerez, ${r.ms} ms)`);
    } else {
      log(`[oturum] açılamadı: ${r.kind} ${r.error || ""}`);
      if (sessionAttempts >= 3) {
        sessionReady = true;
        log("[oturum] çerezsiz devam ediliyor");
      }
    }
  }

  async function executeSearch(job) {
    const res = await client.search(job.params);
    searchInFlight = false;
    store.daily.searchCalls++;
    store.progress.stats.searched++;
    store.progress.stats.pages++;
    gov.report(res.kind, res);
    note(res.kind, "search");
    if (res.kind !== "ok") {
      lastError = { at: new Date().toISOString(), where: describeSearch(job), kind: res.kind, error: res.error || null };
      const f = applySearchFailure(store.plan, job, res);
      log(
        `[arama] ${describeSearch(job)} → ${res.kind} ${res.error || ""}${res.sample ? ` | ${res.sample}` : ""}${f.note ? ` | ${f.note}` : ""}`
      );
      if (f.ready) runSelection(job.unitId);
      return;
    }
    const r = applySearchResult(store.plan, job, res, cfg);
    let added = 0;
    if (r.items.length) added = store.appendInventory(job.unitId, r.items, r.marked, seenFor(job.unitId));
    const head = job.type === "kw" || job.type === "inv" ? `${res.items.length}/${res.total} | envantere +${added}` : "";
    log(`[arama] ${describeSearch(job)} → ${[head, r.note].filter(Boolean).join(" | ")} (${res.ms} ms)`);
    if (r.ready) runSelection(job.unitId);
  }

  async function executeDoc(item) {
    const res = await client.document(item.id);
    gov.report(res.kind, res);
    inflight.delete(item.id);
    inflightYear.delete(item.id);
    if (res.kind === "ok") {
      const record = {
        id: item.id,
        source: "yargitay-resmi",
        sourceUrl: `${client.base}/`,
        documentUrl: `${client.base}/getDokuman?id=${item.id}`,
        mahkeme: "Yargıtay",
        daire: item.daire,
        esas: item.esas,
        karar: item.karar,
        tarih: item.tarih,
        kunye: item.kunye,
        alan: item.alan,
        tierId: item.tierId,
        priority: item.priority,
        keywords: item.keyword ? [item.keyword] : [],
        text: res.text,
        charCount: res.text.length,
        downloadedAt: new Date().toISOString(),
        publishReady: true,
      };
      const a = book.analyze(record, yearFromTarih(item.tarih));
      Object.assign(record, {
        yararli: a.useful,
        emsal: a.emsal,
        benzerOf: a.dupOf,
        emsalSkoru: a.quality,
        hukukAlani: a.domain,
        kanal: item.kanal || "eski",
      });
      store.recordDownload(record);
      note("ok", "doc", a.useful);
      downloadsThisRun++;
      lastOkAt = new Date().toISOString();
      const etiket = a.useful ? "YARARLI" : a.dupOf ? `benzer(${a.dist})` : "zayıf";
      log(`OK ${item.kunye} | ${res.text.length} kr | ${res.ms} ms | ${etiket} [${item.kanal || "eski"}]`);
      return;
    }
    note(res.kind, "doc");
    lastError = { at: new Date().toISOString(), where: item.kunye, kind: res.kind, error: res.error || null };
    if (res.kind === "permanent") {
      store.recordFailure(item.id, res.error);
      log(`[belge] kalıcı hata ${res.error}: ${item.kunye}`);
      return;
    }
    // Sitenin belgeye özgü uygulama hatası ("Belge alma isleminde hata olustu"): motoru
    // durdurmaz; 30/60 dk arayla iki kez daha denenir, sonra kalıcı hata sayılır.
    if (res.kind === "doc-error") {
      item.docErrors = (item.docErrors || 0) + 1;
      if (item.docErrors >= 3) {
        store.recordFailure(item.id, `belge hatası: ${res.error}`);
        log(`[belge] 3 denemede alınamadı → kalıcı hata: ${item.kunye} [${res.error}]`);
        return;
      }
      item.notBefore = new Date(Date.now() + 30 * 60_000 * item.docErrors).toISOString();
      store.queue.push(item);
      log(`[belge] belge hatası (${item.docErrors}/3) → ${30 * item.docErrors} dk sonra: ${item.kunye} [${res.error}]`);
      return;
    }
    // Siteye ya da hatta ait sorunlar (429, ağ, engel, servis kapalı) belgenin suçu değil:
    // deneme sayılmaz, öğe kuyruğun başına döner; bekletmeyi vali yapar.
    if (!["empty", "server"].includes(res.kind)) {
      delete item._retry;
      store.queue.unshift(item);
      log(`[belge] ${res.kind} ${res.error || ""} → kuyruğun başına döndü: ${item.kunye}`);
      return;
    }
    item.attempts = (item.attempts ?? item._retry ?? 0) + 1;
    delete item._retry;
    if (item.attempts >= cfg.retry.maxAttempts) {
      item.parkedAt = new Date().toISOString();
      item.parks = (item.parks || 0) + 1;
      item.lastError = res.error || res.kind;
      if (item.parks > (cfg.retry.maxParks ?? 3)) {
        store.recordFailure(item.id, `vazgeçildi: ${item.lastError}`);
        log(`[belge] ${item.parks}. park sonrası vazgeçildi: ${item.kunye} [${item.lastError}]`);
        return;
      }
      store.parked.push(item);
      parkedIds.add(item.id);
      log(`[belge] ${item.attempts} denemede inmedi → ${cfg.retry.parkDays} gün park: ${item.kunye} [${item.lastError}]`);
      return;
    }
    const backoffMs = Math.min(6 * 3_600_000, 60_000 * 2 ** item.attempts);
    item.notBefore = new Date(Date.now() + backoffMs).toISOString();
    store.queue.push(item);
    log(
      `[belge] ${res.kind} ${res.error || ""} → ${Math.round(backoffMs / 60_000)} dk sonra tekrar (${item.attempts}/${cfg.retry.maxAttempts}): ${item.kunye}${res.sample ? ` | ${res.sample}` : ""}`
    );
  }

  function unpark() {
    const now = Date.now();
    const due = store.parked.filter((q) => now - Date.parse(q.parkedAt) >= cfg.retry.parkDays * 86_400_000);
    if (!due.length) return;
    store.parked = store.parked.filter((q) => !due.includes(q));
    for (const q of due) {
      parkedIds.delete(q.id);
      q.attempts = 0;
      delete q.notBefore;
      store.queue.push(q);
    }
    sortQueue();
    log(`[motor] ${due.length} park edilmiş karar yeniden kuyrukta`);
  }

  /** Önceden inmiş ama henüz emsal defterine girmemiş kararlar (ilk kurulumda ~95 bin): en yeni yıldan başlayarak. */
  async function catchUpAnalysis() {
    const pending = Object.entries(store.progress.downloadedIds)
      .filter(([id]) => !book.analyzed.has(id))
      .map(([id, v]) => [id, String(v?.year || "unknown")])
      .sort((a, b) => b[1].localeCompare(a[1]));
    catchUpLeft = pending.length;
    if (!pending.length) return;
    log(`[emsal] ${pending.length} eski karar deftere işlenecek (arka planda, en yeni yıldan)`);
    let done = 0;
    for (const [id, year] of pending) {
      if (stopRequested) break;
      try {
        const rec = JSON.parse(readFileSync(join(paths.decisions, year, `${id}.json`), "utf8"));
        book.analyze(rec, yearFromTarih(rec.tarih));
      } catch {
        /* dosya yok/bozuk — atla */
      }
      done++;
      catchUpLeft = pending.length - done;
      if (done % 20 === 0) await tick();
      if (done % 10_000 === 0) {
        const t = book.stats.totals;
        log(`[emsal] deftere işlenen ${done}/${pending.length} | yararlı ${t.useful} | benzer ${t.dup} | zayıf ${t.weak}`);
      }
    }
    const t = book.stats.totals;
    log(`[emsal] eski kararlar işlendi: yararlı ${t.useful} | benzer ${t.dup} | zayıf ${t.weak} (toplam ${t.n})`);
  }

  async function worker() {
    while (!stopRequested) {
      let job = null;
      try {
        job = pickJob();
      } catch (e) {
        log(`[motor] iş seçilemedi: ${e?.stack || e}`);
        await sleep(10_000);
        continue;
      }
      if (!job) {
        await sleep(2_000);
        continue;
      }
      let slot;
      try {
        slot = await gov.acquire();
      } catch (e) {
        releaseJob(job);
        if (e instanceof StopError) break;
        log(`[motor] slot alınamadı: ${e?.stack || e}`);
        await sleep(5_000);
        continue;
      }
      if (slot.probe) {
        if (!(await internetReachable())) {
          gov.report("offline");
          note("offline", job.type);
          releaseJob(job);
          continue;
        }
        log("[motor] sonda isteği (devre yarı açık)");
      }
      try {
        if (job.type === "session") await executeSession();
        else if (job.type === "doc") await executeDoc(job.item);
        else await executeSearch(job);
      } catch (e) {
        log(`[motor] beklenmeyen hata (${job.type}): ${e?.stack || e}`);
        lastError = { at: new Date().toISOString(), where: job.type, kind: "exception", error: String(e?.message || e) };
        releaseJob(job);
        await sleep(5_000);
      }
    }
  }

  function writeStatus(extra = {}) {
    const now = Date.now();
    while (events.length && events[0][0] < now - 3 * 3_600_000) events.shift();
    const lastHour = {};
    let ok1h = 0;
    let ok3h = 0;
    let useful3h = 0;
    for (const [t, kind, type, useful] of events) {
      if (type === "doc" && kind === "ok") {
        ok3h++;
        if (useful) useful3h++;
        if (t >= now - 3_600_000) ok1h++;
      }
      if (t < now - 3_600_000) continue;
      const k = type === "doc" ? kind : `${type}:${kind}`;
      lastHour[k] = (lastHour[k] || 0) + 1;
    }
    const runMs = now - Date.parse(startedAt);
    const windowMs = Math.min(3 * 3_600_000, runMs);
    const perDay = windowMs > 10 * 60_000 ? Math.round((ok3h / windowMs) * 86_400_000) : null;
    const usefulPerDay = windowMs > 10 * 60_000 ? Math.round((useful3h / windowMs) * 86_400_000) : null;
    const prog = planProgress(store.plan);
    const t = book.stats.totals;
    const hedef = politika.hedefYararliKarar || null;
    const kalan = hedef ? Math.max(0, hedef - t.useful) : null;
    const thisYear = trYear(now);
    const yearsView = {};
    for (const [y, v] of Object.entries(store.plan.years || {})) yearsView[y] = v.phase;
    heartbeat({
      state: stopRequested ? "stopping" : gov.pausedUntil > now ? "paused" : "running",
      downloaded: store.downloadedCount,
      queue: store.queue.length,
      inflight: inflight.size,
      parked: store.parked.length,
      failed: Object.keys(store.progress.failedIds).length,
      today: store.daily,
      budget: cfg.budget,
      thisRun: { downloads: downloadsThisRun },
      governor: gov.snapshot(now),
      throughput: { lastHourDocs: ok1h, perDayEstimate: perDay, usefulPerDayEstimate: usefulPerDay },
      lastHour,
      emsal: {
        hedef,
        yararli: t.useful,
        benzer: t.dup,
        zayif: t.weak,
        analiz: t.n,
        kalan,
        hedefTamam: !!store.plan.hedefTamam,
        tahminiGun: kalan != null && usefulPerDay ? Math.round((kalan / usefulPerDay) * 10) / 10 : null,
        defterIsleniyor: catchUpLeft,
      },
      sweep: {
        activeUnit: prog.active?.id || null,
        activeStatus: prog.active?.status || null,
        activeYear: prog.active ? unitYear(prog.active) : null,
        page: prog.active ? (prog.active.status === "kw" ? prog.active.kwPage : prog.active.page) : null,
        unitTotal: prog.active?.total ?? null,
        unitsDone: prog.unitsDone,
        unitsTotal: prog.unitsTotal,
        yearFrom: cfg.sweep.yearFrom,
        universe: universeSize(store.plan, cfg.sweep.yearFrom),
        censusYears: Object.keys(store.plan.census || {}).length,
        years: yearsView,
        thisYear,
      },
      byYear: store.byYear,
      lastOkAt,
      lastError,
      ...extra,
    });
  }

  function reloadConfig() {
    try {
      const next = loadHarvesterConfig(configPath);
      const changed = JSON.stringify(next.rate) !== JSON.stringify(cfg.rate);
      const polChanged = JSON.stringify(next.politika) !== JSON.stringify(cfg.politika);
      cfg = next;
      gov.updateConfig(cfg.rate);
      client.timeoutMs = cfg.requestTimeoutMs || client.timeoutMs;
      if (changed) log(`[motor] harvester.json yeniden yüklendi → tavan ${gov.snapshot().ceilingPerMin}/dk`);
      if (polChanged) {
        Object.assign(politika, cfg.politika || {});
        store.plan.politika = { ...(cfg.politika || {}), guncellendi: new Date().toISOString() };
        log("[motor] politika güncellendi (harvester.json → politika)");
      }
    } catch (e) {
      log(`[motor] harvester.json okunamadı, önceki ayarla devam: ${e.message}`);
    }
  }

  let exiting = false;
  async function housekeeping() {
    let lastCk = Date.now();
    let lastFull = Date.now();
    let lastStatus = 0;
    let lastCfg = Date.now();
    let lastUnpark = 0;
    let lastExtend = Date.now();
    let lastYear = 0;
    while (!exiting) {
      await sleep(2_000);
      const now = Date.now();
      try {
        if (existsSync(paths.stopFile)) {
          try {
            unlinkSync(paths.stopFile);
          } catch {
            /* yoksay */
          }
          requestStop("durdurma dosyası");
        }
        // Çitleme: kilit başka bir kopyaya geçtiyse (ör. uykudan dönüşte) hiçbir şey
        // yazmadan hemen çık — yeni kopyanın durum dosyalarını ezmeyelim.
        if (!stopRequested) {
          const l = readJson(paths.lock);
          if (!l && !existsSync(paths.lock)) {
            try {
              writeLock(paths);
            } catch {
              /* başka kopya aldıysa sonraki turda görülür */
            }
          } else if (l && l.pid !== process.pid) {
            log(`[motor] kilit pid ${l.pid} sürecine geçti — çift çalışma olmasın diye yazmadan çıkılıyor`);
            process.exit(0);
          }
        }
        if (downloadsThisRun >= maxThisRun && inflight.size === 0) requestStop(`--max=${maxThisRun} tamam`);
        if (now - lastYear >= (cfg.checkpoint.policyEveryMs ?? 30_000)) {
          yearFillCheck();
          const hedef = politika.hedefYararliKarar;
          if (hedef && !store.plan.hedefTamam && book.stats.totals.useful >= hedef) {
            store.plan.hedefTamam = true;
            log(`[hedef] ${hedef} yararlı karara ulaşıldı — bundan sonra yalnız ${trYear(now)} güncel tutulacak`);
          }
          lastYear = now;
        }
        if (now - lastStatus >= 15_000) {
          writeStatus();
          lastStatus = now;
        }
        if (now - lastCk >= cfg.checkpoint.stateEveryMs) {
          store.checkpoint();
          lastCk = now;
        }
        if (now - lastFull >= cfg.checkpoint.progressEveryMs) {
          store.checkpoint({ full: true });
          lastFull = now;
          log(`[depo] anlık görüntü yazıldı (indirilmiş ${store.downloadedCount})`);
        }
        if (now - lastCfg >= 5 * 60_000) {
          reloadConfig();
          lastCfg = now;
        }
        if (now - lastUnpark >= 6 * 3_600_000) {
          unpark();
          lastUnpark = now;
        }
        if (now - lastExtend >= 6 * 3_600_000) {
          const n = extendPlanToNow(store.plan);
          if (n) log(`[plan] takvim ilerledi → ${n} yeni pencere`);
          lastExtend = now;
        }
      } catch (e) {
        log(`[motor] bakım döngüsü hatası: ${e?.stack || e}`);
      }
    }
  }

  // Durdurma yarıda kalmış bir pencere seçimi bıraktıysa (çökme), şimdi tamamla.
  for (const u of store.plan.units) if (u.status === "secim") runSelection(u.id);

  const hk = housekeeping();
  const catchUp = catchUpAnalysis().catch((e) => log(`[emsal] defter işleme hatası: ${e?.stack || e}`));
  const workers = Array.from({ length: Math.max(1, cfg.concurrency || 1) }, () => worker());
  let exitCode = 0;
  try {
    await Promise.all(workers);
  } catch (e) {
    exitCode = 1;
    log(`[motor] işçi çöktü: ${e?.stack || e}`);
  }
  exiting = true;
  await hk;
  await catchUp;
  try {
    store.checkpoint({ full: true });
    writeStatus({ state: "stopped", stoppedAt: new Date().toISOString() });
  } catch (e) {
    exitCode = 1;
    log(`[motor] son durum yazılamadı: ${e?.stack || e}`);
  }
  releaseLock(paths);
  log(`[motor] durdu — bu koşuda ${downloadsThisRun} karar, toplam ${store.downloadedCount}`);
  return exitCode;
}
