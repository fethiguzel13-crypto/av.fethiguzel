/**
 * Yargıtay arşiv — ölçek: on binlerce karar
 * Öncelik: YİBK (Büyük Genel Kurulu) → HGK → HDBK → borçlar/medeni daireler
 * BAM / ilk derece aranmaz.
 *
 *   node scripts/yargi-kararlari/archive-yargitay.mjs
 *   node scripts/yargi-kararlari/archive-yargitay.mjs --max=50
 *   node scripts/yargi-kararlari/archive-yargitay.mjs --tier=yibk
 *   node scripts/yargi-kararlari/archive-yargitay.mjs --tier=hgk --max=40
 *   node scripts/yargi-kararlari/archive-yargitay.mjs --search-only
 *   node scripts/yargi-kararlari/archive-yargitay.mjs --download-only
 *   node scripts/yargi-kararlari/archive-yargitay.mjs --status
 *   node scripts/yargi-kararlari/archive-yargitay.mjs --dry-run
 */

import { appendFileSync, existsSync, readdirSync, renameSync, mkdirSync } from "fs";
import { join } from "path";
import {
  loadConfig,
  outPaths,
  ensureDirs,
  humanWait,
  loadJson,
  saveJson,
  appendLog,
  stripHtml,
  emptyProgress,
  emptyDaily,
  rollDaily,
  emptyHarvestCursor,
  decisionPath,
  yearFromTarih,
  tierPriority,
  loadQueueJsonl,
  saveQueueJsonl,
  buildYearWindows,
  isHarvestComplete,
  readHarvestSnapshot,
} from "./lib.mjs";

const BASE = "https://karararama.yargitay.gov.tr";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36";

function parseArgs() {
  const opts = {
    tier: null,
    max: null,
    dryRun: false,
    searchOnly: false,
    downloadOnly: false,
    status: false,
  };
  for (const a of process.argv.slice(2)) {
    if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--search-only") opts.searchOnly = true;
    else if (a === "--download-only") opts.downloadOnly = true;
    else if (a === "--status") opts.status = true;
    else if (a.startsWith("--tier=")) opts.tier = a.split("=")[1];
    else if (a.startsWith("--max=")) opts.max = parseInt(a.split("=")[1], 10);
  }
  return opts;
}

function makeLog(paths) {
  return (...args) => {
    const line = args.map(String).join(" ");
    console.error(line);
    appendLog(paths.log, line);
  };
}

async function apiSearch({ kurul, hukuk, ceza, keyword, startTr, endTr, pageSize, pageNumber }) {
  const body = {
    data: {
      arananKelime: keyword || "",
      esasYil: "",
      esasIlkSiraNo: "",
      esasSonSiraNo: "",
      kararYil: "",
      kararIlkSiraNo: "",
      kararSonSiraNo: "",
      baslangicTarihi: startTr,
      bitisTarihi: endTr,
      siralama: "3",
      siralamaDirection: "desc",
      birimYrgKurulDaire: kurul || "",
      birimYrgHukukDaire: hukuk || "",
      birimYrgCezaDaire: ceza || "",
      hukuk: hukuk || "",
      pageSize,
      pageNumber,
    },
  };
  const resp = await fetch(`${BASE}/aramadetaylist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Accept: "application/json, text/javascript, */*; q=0.01",
      "X-Requested-With": "XMLHttpRequest",
      Origin: BASE,
      Referer: `${BASE}/`,
      "User-Agent": UA,
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) return { error: `HTTP ${resp.status}`, items: [], total: 0 };
  const json = await resp.json().catch(() => null);
  if (!json?.data?.data || !Array.isArray(json.data.data)) {
    return { error: "Invalid JSON", items: [], total: 0 };
  }
  const items = json.data.data.map((r) => ({
    id: String(r.id),
    daire: r.daire,
    esas: r.esasNo,
    karar: r.kararNo,
    tarih: r.kararTarihi,
    kunye: `Yargıtay ${r.daire}, E. ${r.esasNo}, K. ${r.kararNo}, T. ${r.kararTarihi}`,
  }));
  return { error: null, items, total: json.data.recordsTotal ?? items.length };
}

async function fetchFullText(id) {
  const resp = await fetch(`${BASE}/getDokuman?id=${id}`, {
    headers: {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "X-Requested-With": "XMLHttpRequest",
      Referer: `${BASE}/`,
      "User-Agent": UA,
    },
  });
  if (!resp.ok) return { error: `HTTP ${resp.status}` };
  const json = await resp.json().catch(() => null);
  const html = json?.data || "";
  const text = stripHtml(html);
  if (!text || text.length < 80) return { error: "empty-or-short", text };
  return { text, html };
}

function migrateLegacyFlatDecisions(paths, log) {
  if (!existsSync(paths.decisions)) return;
  const files = readdirSync(paths.decisions).filter((f) => f.endsWith(".json"));
  if (!files.length) return;
  let n = 0;
  for (const f of files) {
    try {
      const full = join(paths.decisions, f);
      const rec = loadJson(full, null);
      if (!rec?.id) continue;
      const year = yearFromTarih(rec.tarih);
      const destDir = join(paths.decisions, year);
      mkdirSync(destDir, { recursive: true });
      const dest = join(destDir, f);
      if (full !== dest) {
        renameSync(full, dest);
        n++;
      }
    } catch {
      /* skip */
    }
  }
  if (n) log(`Legacy kararlar yıl klasörüne taşındı: ${n}`);
}

function countDownloaded(paths) {
  if (!existsSync(paths.decisions)) return 0;
  let n = 0;
  for (const ent of readdirSync(paths.decisions, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      n += readdirSync(join(paths.decisions, ent.name)).filter((f) => f.endsWith(".json")).length;
    } else if (ent.name.endsWith(".json")) n++;
  }
  return n;
}

function ensureTierCursor(cursor, tier, cfg) {
  if (cursor.tiers[tier.id]) return cursor.tiers[tier.id];
  const yearFrom = tier.yearFrom ?? cfg.harvest.yearFrom;
  const yearTo = cfg.harvest.yearTo;
  const step = tier.yearsPerSearchWindow ?? cfg.harvest.yearsPerSearchWindow;
  const windows = buildYearWindows(yearFrom, yearTo, step);
  const st = {
    windowIndex: 0,
    page: 1,
    keywordIndex: 0,
    daireIndex: 0,
    windows: windows.map((w) => w.label),
    done: false,
  };
  cursor.tiers[tier.id] = st;
  return st;
}

function windowsForTier(tier, cfg) {
  const yearFrom = tier.yearFrom ?? cfg.harvest.yearFrom;
  const yearTo = cfg.harvest.yearTo;
  const step = tier.yearsPerSearchWindow ?? cfg.harvest.yearsPerSearchWindow;
  return buildYearWindows(yearFrom, yearTo, step);
}

function nextJobs(cfg, cursor, tierFilter, maxJobs, queue = []) {
  const queueCount = {};
  for (const q of queue || []) {
    const k = q.tierId || q.alan || "";
    if (k) queueCount[k] = (queueCount[k] || 0) + 1;
  }
  // Lower priority number first; within same priority, prefer tiers with thinner queue
  // so CGK/YİBK get seeded while HGK already has thousands queued.
  const tiers = (cfg.tiers || [])
    .filter((t) => !tierFilter || t.id === tierFilter)
    .slice()
    .sort((a, b) => {
      const pa = a.priority ?? 99;
      const pb = b.priority ?? 99;
      if (pa !== pb) return pa - pb;
      return (queueCount[a.id] || 0) - (queueCount[b.id] || 0);
    });

  const jobs = [];
  for (const tier of tiers) {
    if (jobs.length >= maxJobs) break;
    const st = ensureTierCursor(cursor, tier, cfg);
    if (st.done) continue;

    const windows = windowsForTier(tier, cfg);

    if (st.windowIndex >= windows.length) {
      // unit-keyword + ceza-keyword: daire × keyword × year windows
      if (tier.mode === "unit-keyword" || tier.mode === "ceza-keyword") {
        const daireler = tier.daireler || [];
        const keywords = tier.keywords || [""];
        st.windowIndex = 0;
        st.page = 1;
        st.daireIndex = (st.daireIndex || 0) + 1;
        if (st.daireIndex >= daireler.length) {
          st.daireIndex = 0;
          st.keywordIndex = (st.keywordIndex || 0) + 1;
          if (st.keywordIndex >= keywords.length) {
            st.done = true;
            continue;
          }
        }
      } else {
        st.done = true;
        continue;
      }
    }

    const win = windows[Math.min(st.windowIndex, windows.length - 1)];
    if (!win) {
      st.done = true;
      continue;
    }

    if (tier.mode === "full-unit") {
      jobs.push({
        tierId: tier.id,
        alan: tier.alan,
        priority: tier.priority,
        label: `${tier.label} | ${win.label} | p${st.page}`,
        kurul: tier.unit?.kurul || "",
        hukuk: tier.unit?.hukuk || "",
        ceza: tier.unit?.ceza || "",
        keyword: "",
        startTr: win.from,
        endTr: win.to,
        page: st.page,
        _cursorKey: tier.id,
      });
    } else if (tier.mode === "ceza-keyword") {
      const daire = (tier.daireler || [])[st.daireIndex];
      const keyword = (tier.keywords || [""])[st.keywordIndex] || "";
      if (!daire) {
        st.done = true;
        continue;
      }
      jobs.push({
        tierId: tier.id,
        alan: tier.alan,
        priority: tier.priority,
        label: `${tier.label} | ${daire} | "${keyword}" | ${win.label} | p${st.page}`,
        kurul: "",
        hukuk: "",
        ceza: daire,
        keyword,
        startTr: win.from,
        endTr: win.to,
        page: st.page,
        _cursorKey: tier.id,
      });
    } else {
      const daire = (tier.daireler || [])[st.daireIndex];
      const keyword = (tier.keywords || [""])[st.keywordIndex] || "";
      if (!daire) {
        st.done = true;
        continue;
      }
      jobs.push({
        tierId: tier.id,
        alan: tier.alan,
        priority: tier.priority,
        label: `${tier.label} | ${daire} | "${keyword}" | ${win.label} | p${st.page}`,
        kurul: "",
        hukuk: daire,
        ceza: "",
        keyword,
        startTr: win.from,
        endTr: win.to,
        page: st.page,
        _cursorKey: tier.id,
      });
    }
  }
  return jobs;
}

function advanceCursorAfterPage(cursor, job, pageSize, gotCount, total) {
  const st = cursor.tiers[job._cursorKey];
  if (!st) return;
  if (gotCount < pageSize || job.page * pageSize >= total) {
    // window bitti → sonraki pencere
    st.windowIndex++;
    st.page = 1;
  } else {
    st.page++;
  }
}

function enqueueItems(queue, items, meta, progress, cfg) {
  const existing = new Set(queue.map((q) => q.id));
  let added = 0;
  for (const it of items) {
    if (progress.downloadedIds[it.id]) continue;
    if (existing.has(it.id)) continue;
    queue.push({
      id: it.id,
      alan: meta.alan,
      tierId: meta.tierId,
      priority: meta.priority,
      keyword: meta.keyword || "",
      daire: it.daire,
      esas: it.esas,
      karar: it.karar,
      tarih: it.tarih,
      kunye: it.kunye,
      queuedAt: new Date().toISOString(),
      source: "yargitay-resmi",
    });
    existing.add(it.id);
    added++;
  }
  progress.stats.queued += added;
  // öncelik sırası: priority asc, sonra tarih desc kabaca
  queue.sort((a, b) => {
    const pa = a.priority ?? tierPriority(a.tierId, cfg);
    const pb = b.priority ?? tierPriority(b.tierId, cfg);
    if (pa !== pb) return pa - pb;
    return String(b.tarih || "").localeCompare(String(a.tarih || ""));
  });
  return added;
}

function writeDecision(paths, cfg, record) {
  const year = yearFromTarih(record.tarih);
  const file = decisionPath(paths, record.id, year);
  saveJson(file, record);

  const pointer = {
    id: record.id,
    file: `decisions/${year}/${record.id}.json`,
    kunye: record.kunye,
    alan: record.alan,
    tierId: record.tierId,
    tarih: record.tarih,
    daire: record.daire,
    keywords: record.keywords || [],
  };
  const alanDir = join(paths.byAlan, record.alan || "diger");
  mkdirSync(alanDir, { recursive: true });
  saveJson(join(alanDir, `${record.id}.json`), pointer);

  const tierDir = join(paths.byTier, record.tierId || "diger");
  mkdirSync(tierDir, { recursive: true });
  saveJson(join(tierDir, `${record.id}.json`), pointer);

  appendFileSync(paths.index, JSON.stringify(pointer) + "\n", "utf8");
}

function printStatus(paths, cfg, progress, queue, daily, cursor) {
  const downloaded = Object.keys(progress.downloadedIds).length || countDownloaded(paths);
  const complete = isHarvestComplete({ cfg, cursor, queue });
  console.log("=== Yargı arşiv durumu ===");
  console.log(
    `COMPLETE: ${complete.complete} (${complete.reason}) tiersDone=${complete.tiersDone}/${complete.tiersTotal}`
  );
  console.log(`İndirilen: ${downloaded}`);
  console.log(`Kuyruk: ${queue.length}`);
  console.log(
    `Bugün: fullText ${daily.fullText}/${cfg.rateLimit.maxFullTextPerDay}, search ${daily.searchCalls}/${cfg.rateLimit.maxSearchCallsPerDay}`
  );
  console.log(`Stats:`, progress.stats);
  console.log("Tier imleçleri:");
  for (const t of cfg.tiers) {
    const st = cursor.tiers[t.id];
    if (!st) {
      console.log(`  ${t.id}: (henüz başlamadı) priority=${t.priority}`);
      continue;
    }
    console.log(
      `  ${t.id}: win=${st.windowIndex}/${st.windows?.length ?? "?"} page=${st.page} daire=${st.daireIndex} kw=${st.keywordIndex} done=${st.done}`
    );
  }
  const byTier = {};
  for (const q of queue.slice(0, 5000)) {
    byTier[q.tierId || "?"] = (byTier[q.tierId || "?"] || 0) + 1;
  }
  console.log("Kuyruk (örnek tier dağılımı):", byTier);
  if (complete.complete) {
    console.log("HARVEST COMPLETE: all configured tiers done and queue empty.");
  } else {
    console.log(`IN PROGRESS: ${complete.reason}`);
  }
}

async function main() {
  const opts = parseArgs();
  const cfg = loadConfig();
  const paths = outPaths(cfg);
  ensureDirs(paths);
  const log = makeLog(paths);

  // Eski düz JSON kuyruğunu jsonl'e taşı
  const legacyQueuePath = join(paths.state, "queue.json");
  if (existsSync(legacyQueuePath) && !existsSync(paths.queue)) {
    const legacy = loadJson(legacyQueuePath, { items: [] });
    const items = Array.isArray(legacy.items) ? legacy.items : [];
    for (const it of items) {
      it.priority = it.priority ?? tierPriority(it.tierId || it.alan, cfg);
      it.tierId = it.tierId || (it.alan === "medeni" ? "medeni-daire" : "borclar-daire");
    }
    saveQueueJsonl(paths.queue, items);
    log(`Legacy queue.json → queue.jsonl (${items.length})`);
  }

  migrateLegacyFlatDecisions(paths, log);

  let progress = loadJson(paths.progress, emptyProgress());
  // v1 → v2: seenIds şişmesin, at
  if (progress.seenIds) {
    delete progress.seenIds;
    progress.version = 2;
  }
  if (!progress.downloadedIds) progress.downloadedIds = {};
  if (!progress.failedIds) progress.failedIds = {};
  if (!progress.stats) progress.stats = { searched: 0, queued: 0, downloaded: 0, failed: 0, pages: 0 };

  let queue = loadQueueJsonl(paths.queue);
  let daily = rollDaily(loadJson(paths.daily, emptyDaily()));
  let cursor = loadJson(paths.harvestCursor, emptyHarvestCursor());

  const rl = cfg.rateLimit;
  const pageSize = cfg.pagination?.pageSize || 100;
  const maxThisRun = opts.max ?? rl.maxFullTextPerRun;

  if (opts.status) {
    printStatus(paths, cfg, progress, queue, daily, cursor);
    return;
  }

  log("=== Yargıtay arşiv (ölçekli) ===");
  log(`Öncelik: YİBK → HGK/CGK → HDBK → hukuk/ceza/icra daire | BAM/ilk derece yok`);
  log(
    `Bütçe gün: full ${daily.fullText}/${rl.maxFullTextPerDay} | search ${daily.searchCalls}/${rl.maxSearchCallsPerDay}`
  );
  log(`Kuyruk: ${queue.length} | indirilmiş kayıt: ${Object.keys(progress.downloadedIds).length}`);
  log(`Bu koşu max tam metin: ${maxThisRun}${opts.tier ? ` | tier=${opts.tier}` : ""}`);

  if (opts.dryRun) {
    const jobs = nextJobs(cfg, structuredClone(cursor), opts.tier, 12, queue);
    log("[dry-run] sıradaki arama işleri:");
    for (const j of jobs) log(`  p${j.priority} ${j.label}`);
    printStatus(paths, cfg, progress, queue, daily, cursor);
    return;
  }

  // --- Arama / kuyruk doldurma ---
  if (!opts.downloadOnly && daily.searchCalls < rl.maxSearchCallsPerDay) {
    let pagesThisRun = 0;
    while (
      pagesThisRun < rl.maxSearchPagesPerRun &&
      daily.searchCalls < rl.maxSearchCallsPerDay
    ) {
      const jobs = nextJobs(cfg, cursor, opts.tier, 1, queue);
      if (!jobs.length) {
        log("Tüm tier imleçleri tamam (veya filtre boş).");
        break;
      }
      const job = jobs[0];
      log(`Arama: ${job.label}`);
      let emptyPage = false;
      try {
        const res = await apiSearch({
          kurul: job.kurul,
          hukuk: job.hukuk,
          ceza: job.ceza,
          keyword: job.keyword,
          startTr: job.startTr,
          endTr: job.endTr,
          pageSize,
          pageNumber: job.page,
        });
        daily.searchCalls++;
        progress.stats.searched++;
        progress.stats.pages++;
        pagesThisRun++;

        if (res.error) {
          log(`  Hata: ${res.error}`);
        } else {
          const added = enqueueItems(
            queue,
            res.items,
            {
              alan: job.alan,
              tierId: job.tierId,
              priority: job.priority,
              keyword: job.keyword,
            },
            progress,
            cfg
          );
          log(
            `  sayfa ${job.page}: ${res.items.length} sonuç (toplam~${res.total}) | yeni kuyruk: ${added} | kuyruk: ${queue.length}`
          );
          advanceCursorAfterPage(cursor, job, pageSize, res.items.length, res.total || 0);
          emptyPage = res.items.length === 0;
        }
      } catch (e) {
        log(`  Exception: ${e.message || e}`);
        daily.searchCalls++;
        pagesThisRun++;
      }

      saveJson(paths.progress, progress);
      saveQueueJsonl(paths.queue, queue);
      saveJson(paths.daily, daily);
      saveJson(paths.harvestCursor, cursor);

      if (emptyPage) {
        await humanWait(1500, 4000, "empty-window", log);
      } else {
        await humanWait(
          pagesThisRun % 5 === 0 ? rl.minDelayMsBetweenSearch : rl.minDelayMsBetweenPages,
          pagesThisRun % 5 === 0 ? rl.maxDelayMsBetweenSearch : rl.maxDelayMsBetweenPages,
          "search-page",
          log
        );
      }
    }
  }

  // --- Tam metin indirme ---
  if (!opts.searchOnly) {
    if (daily.fullText >= rl.maxFullTextPerDay) {
      log("Günlük tam metin bütçesi dolu.");
    } else {
      let downloadedThisRun = 0;
      // kuyruk zaten priority sıralı
      while (
        downloadedThisRun < maxThisRun &&
        daily.fullText < rl.maxFullTextPerDay &&
        queue.length > 0
      ) {
        // tier filtresi
        let idx = 0;
        if (opts.tier) {
          idx = queue.findIndex((q) => q.tierId === opts.tier);
          if (idx < 0) break;
        }
        const item = queue.splice(idx, 1)[0];
        if (progress.downloadedIds[item.id]) {
          saveQueueJsonl(paths.queue, queue);
          continue;
        }

        log(`Tam metin [p${item.priority ?? "?"}/${item.tierId}]: ${item.kunye}`);
        try {
          const doc = await fetchFullText(item.id);
          if (doc.error) {
            log(`  Hata: ${doc.error}`);
            progress.failedIds[item.id] = {
              at: new Date().toISOString(),
              error: doc.error,
            };
            progress.stats.failed++;
          } else {
            const record = {
              id: item.id,
              source: "yargitay-resmi",
              sourceUrl: BASE + "/",
              documentUrl: `${BASE}/getDokuman?id=${item.id}`,
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
              text: doc.text,
              charCount: doc.text.length,
              downloadedAt: new Date().toISOString(),
              publishReady: true,
            };
            if (cfg.storeHtml) record.html = doc.html;
            writeDecision(paths, cfg, record);
            progress.downloadedIds[item.id] = {
              at: record.downloadedAt,
              tierId: item.tierId,
              year: yearFromTarih(item.tarih),
            };
            progress.stats.downloaded++;
            downloadedThisRun++;
            daily.fullText++;
            log(
              `  OK ${doc.text.length} kr | bugün ${daily.fullText}/${rl.maxFullTextPerDay} | koşu ${downloadedThisRun}/${maxThisRun}`
            );
          }
        } catch (e) {
          log(`  Exception: ${e.message || e}`);
          progress.failedIds[item.id] = {
            at: new Date().toISOString(),
            error: String(e.message || e),
          };
          progress.stats.failed++;
        }

        progress.lastRunAt = new Date().toISOString();
        saveJson(paths.progress, progress);
        saveQueueJsonl(paths.queue, queue);
        saveJson(paths.daily, daily);

        if (downloadedThisRun > 0 && downloadedThisRun % rl.pauseEveryNFullText === 0) {
          await humanWait(rl.pauseMinMs, rl.pauseMaxMs, "long-pause", log);
        } else {
          await humanWait(
            rl.minDelayMsBetweenFullText,
            rl.maxDelayMsBetweenFullText,
            "fulltext-gap",
            log
          );
        }
      }
      log(`Koşu indirme bitti: +${downloadedThisRun} | kuyruk: ${queue.length}`);
    }
  }

  progress.lastRunAt = new Date().toISOString();
  saveJson(paths.progress, progress);
  saveQueueJsonl(paths.queue, queue);
  saveJson(paths.daily, daily);
  saveJson(paths.harvestCursor, cursor);
  saveJson(paths.stats, {
    at: new Date().toISOString(),
    downloaded: Object.keys(progress.downloadedIds).length,
    queue: queue.length,
    daily,
    stats: progress.stats,
  });
  log("Durum kaydedildi.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
