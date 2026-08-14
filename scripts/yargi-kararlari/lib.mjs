import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, "..", "..");
export const CONFIG_PATH = join(__dirname, "config.json");

export function loadConfig() {
  return JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
}

export function outPaths(cfg) {
  const base = join(ROOT, cfg.outputDir);
  return {
    base,
    decisions: join(base, "decisions"),
    state: join(base, "_state"),
    progress: join(base, "_state", "progress.json"),
    queue: join(base, "_state", "queue.jsonl"),
    daily: join(base, "_state", "daily.json"),
    harvestCursor: join(base, "_state", "harvest-cursor.json"),
    index: join(base, "index.jsonl"),
    byAlan: join(base, "by-alan"),
    byTier: join(base, "by-tier"),
    log: join(base, "_state", "run.log"),
    stats: join(base, "_state", "stats.json"),
  };
}

export function ensureDirs(paths) {
  for (const p of [
    paths.base,
    paths.decisions,
    paths.state,
    paths.byAlan,
    paths.byTier,
    join(paths.byAlan, "borclar"),
    join(paths.byAlan, "medeni"),
    join(paths.byAlan, "yibk"),
    join(paths.byAlan, "hgk"),
    join(paths.byAlan, "cgk"),
    join(paths.byAlan, "hdbk"),
    join(paths.byAlan, "is_sgk"),
    join(paths.byAlan, "icra"),
    join(paths.byAlan, "ceza"),
    join(paths.byTier, "yibk"),
    join(paths.byTier, "hgk"),
    join(paths.byTier, "cgk"),
    join(paths.byTier, "hdbk"),
    join(paths.byTier, "borclar-daire"),
    join(paths.byTier, "medeni-daire"),
    join(paths.byTier, "is-daire"),
    join(paths.byTier, "icra-daire"),
    join(paths.byTier, "ceza-daire"),
  ]) {
    mkdirSync(p, { recursive: true });
  }
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function randomBetween(min, max) {
  const a = Math.min(min, max);
  const b = Math.max(min, max);
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

export async function humanWait(minMs, maxMs, label = "", log = console.error) {
  let ms = randomBetween(minMs, maxMs);
  if (Math.random() < 0.25) ms = Math.floor(ms * (1 + Math.random() * 0.35));
  if (Math.random() < 0.05) ms += randomBetween(45_000, 120_000);
  log(`[wait] ${label} ${(ms / 1000).toFixed(1)}s`);
  await sleep(ms);
  return ms;
}

/** UTC calendar day YYYY-MM-DD — must match daily.json keys and budget waits. */
export function todayKey(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export function loadJson(path, fallback) {
  if (!existsSync(path)) return structuredClone(fallback);
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return structuredClone(fallback);
  }
}

export function saveJson(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2), "utf8");
}

export function appendLog(logPath, line) {
  const ts = new Date().toISOString();
  appendFileSync(logPath, `${ts} ${line}\n`, "utf8");
}

export function stripHtml(html) {
  return String(html || "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#305;/g, "ı")
    .replace(/&#287;/g, "ğ")
    .replace(/&#252;/g, "ü")
    .replace(/&#246;/g, "ö")
    .replace(/&#231;/g, "ç")
    .replace(/&#351;/g, "ş")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function fmtTr(date) {
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
}

export function emptyProgress() {
  return {
    version: 2,
    startedAt: new Date().toISOString(),
    lastRunAt: null,
    downloadedIds: {},
    failedIds: {},
    stats: { searched: 0, queued: 0, downloaded: 0, failed: 0, pages: 0 },
  };
}

export function emptyDaily(now = new Date()) {
  return { date: todayKey(now), fullText: 0, searchCalls: 0 };
}

export function rollDaily(daily, now = new Date()) {
  if (!daily || daily.date !== todayKey(now)) return emptyDaily(now);
  return daily;
}

export function emptyHarvestCursor() {
  return {
    version: 1,
    /** tierId → { windowIndex, page, keywordIndex, daireIndex, done } */
    tiers: {},
  };
}

export function decisionPath(paths, id, year) {
  const y = year || "unknown";
  const dir = join(paths.decisions, String(y));
  mkdirSync(dir, { recursive: true });
  return join(dir, `${id}.json`);
}

export function yearFromTarih(tarih) {
  const m = String(tarih || "").match(/(\d{4})/);
  return m ? m[1] : "unknown";
}

/** Priority: lower number first. yibk=0, hgk=1, ... */
export function tierPriority(tierId, cfg) {
  const t = (cfg.tiers || []).find((x) => x.id === tierId);
  return t?.priority ?? 99;
}

export function loadQueueJsonl(path) {
  if (!existsSync(path)) return [];
  const lines = readFileSync(path, "utf8").split("\n").filter(Boolean);
  const items = [];
  for (const line of lines) {
    try {
      items.push(JSON.parse(line));
    } catch {
      /* skip */
    }
  }
  return items;
}

export function saveQueueJsonl(path, items) {
  mkdirSync(dirname(path), { recursive: true });
  const body = items.map((x) => JSON.stringify(x)).join("\n") + (items.length ? "\n" : "");
  writeFileSync(path, body, "utf8");
}

export function buildYearWindows(yearFrom, yearTo, step) {
  const windows = [];
  let y = yearFrom;
  while (y <= yearTo) {
    const end = Math.min(y + step - 1, yearTo);
    windows.push({
      from: `01.01.${y}`,
      to: `31.12.${end}`,
      label: `${y}-${end}`,
    });
    y = end + 1;
  }
  return windows;
}

/**
 * Harvest complete when every configured tier is done AND queue is empty.
 * Pure: no I/O — pass already-loaded cursor + queue + config tiers.
 */
export function isHarvestComplete({ cfg, cursor, queue }) {
  const tiers = cfg?.tiers || [];
  if (!tiers.length) return false;
  const queueLen = Array.isArray(queue) ? queue.length : 0;
  if (queueLen > 0) {
    return {
      complete: false,
      reason: "queue-not-empty",
      queueLen,
      tiersDone: countTiersDone(tiers, cursor),
      tiersTotal: tiers.length,
    };
  }
  const unfinished = [];
  for (const t of tiers) {
    const st = cursor?.tiers?.[t.id];
    if (!st?.done) unfinished.push(t.id);
  }
  if (unfinished.length) {
    return {
      complete: false,
      reason: "tiers-unfinished",
      unfinished,
      queueLen: 0,
      tiersDone: tiers.length - unfinished.length,
      tiersTotal: tiers.length,
    };
  }
  return {
    complete: true,
    reason: "all-tiers-done-queue-empty",
    queueLen: 0,
    tiersDone: tiers.length,
    tiersTotal: tiers.length,
  };
}

function countTiersDone(tiers, cursor) {
  let n = 0;
  for (const t of tiers) {
    if (cursor?.tiers?.[t.id]?.done) n++;
  }
  return n;
}

/**
 * ms until the UTC day after todayKey(now) (+30s). Single source of truth with
 * todayKey/rollDaily/isDailyBudgetExhausted — all use UTC YYYY-MM-DD from toISOString.
 * Never local-midnight (no local Date mutators). Optional overrideMs for tests.
 */
export function msUntilNextBudgetDay(now = new Date(), overrideMs = null) {
  if (overrideMs != null && Number.isFinite(overrideMs)) return Math.max(0, overrideMs);
  // Parse the same UTC day string used by daily.json keys, then next UTC midnight.
  const [ys, ms, ds] = todayKey(now).split("-");
  const y = Number(ys);
  const m = Number(ms) - 1; // Date.UTC month is 0-based
  const d = Number(ds);
  const nextUtcMidnightPlus30s = Date.UTC(y, m, d + 1, 0, 0, 30, 0);
  return Math.max(1000, nextUtcMidnightPlus30s - now.getTime());
}

/**
 * True if UTC-today fullText hits config cap (same key as todayKey / daily.json).
 * Day boundary is UTC (toISOString date); pair waits with msUntilNextBudgetDay only.
 */
export function isDailyBudgetExhausted(daily, rateLimit, now = new Date()) {
  const today = todayKey(now);
  if (!daily || daily.date !== today) {
    return {
      exhausted: false,
      fullText: false,
      search: false,
      fullTextUsed: 0,
      searchUsed: 0,
      maxFt: rateLimit?.maxFullTextPerDay ?? Infinity,
      maxSc: rateLimit?.maxSearchCallsPerDay ?? Infinity,
      dayKey: today,
    };
  }
  const maxFt = rateLimit?.maxFullTextPerDay ?? Infinity;
  const maxSc = rateLimit?.maxSearchCallsPerDay ?? Infinity;
  const fullText = (daily.fullText || 0) >= maxFt;
  const search = (daily.searchCalls || 0) >= maxSc;
  // Full-text cap blocks downloads; search-only cap does not.
  return {
    exhausted: fullText,
    fullText,
    search,
    fullTextUsed: daily.fullText || 0,
    searchUsed: daily.searchCalls || 0,
    maxFt,
    maxSc,
    dayKey: today,
  };
}

/** Pure helper: after waiting until next budget day, daily should no longer be exhausted. */
export function budgetWouldResetAfterWait(daily, rateLimit, now, waitMs) {
  const after = new Date(now.getTime() + waitMs);
  const rolled = rollDaily(daily, after);
  return !isDailyBudgetExhausted(rolled, rateLimit, after).exhausted;
}

export function readHarvestSnapshot(cfg) {
  const paths = outPaths(cfg);
  ensureDirs(paths);
  const cursor = loadJson(paths.harvestCursor, emptyHarvestCursor());
  const queue = loadQueueJsonl(paths.queue);
  const daily = rollDaily(loadJson(paths.daily, emptyDaily()));
  const progress = loadJson(paths.progress, emptyProgress());
  const status = isHarvestComplete({ cfg, cursor, queue });
  const budget = isDailyBudgetExhausted(daily, cfg.rateLimit);
  return { paths, cursor, queue, daily, progress, status, budget };
}
