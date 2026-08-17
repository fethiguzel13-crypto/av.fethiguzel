/**
 * Continuous Yargıtay harvest until all configured tiers done + queue empty.
 * On daily full-text budget exhaust: wait until next calendar day, then resume.
 *
 *   node scripts/yargi-kararlari/until-done.mjs
 *   node scripts/yargi-kararlari/until-done.mjs --max-per-batch=45
 *   node scripts/yargi-kararlari/until-done.mjs --budget-wait-ms=60000   # test short wait
 *   node scripts/yargi-kararlari/until-done.mjs --once                  # single batch then exit
 */

import { spawn } from "child_process";
import { appendFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadConfig, readHarvestSnapshot, msUntilNextBudgetDay, sleep } from "./lib.mjs";
import { pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARCHIVE = join(__dirname, "archive-yargitay.mjs");

function parseArgs() {
  const opts = {
    maxPerBatch: null,
    budgetWaitMs: null,
    endpointDownWaitMs: null,
    once: false,
    logFile: null,
    errorBackoffMs: 60_000,
  };
  for (const a of process.argv.slice(2)) {
    if (a === "--once") opts.once = true;
    else if (a.startsWith("--max-per-batch=")) opts.maxPerBatch = parseInt(a.split("=")[1], 10);
    else if (a.startsWith("--budget-wait-ms=")) opts.budgetWaitMs = parseInt(a.split("=")[1], 10);
    else if (a.startsWith("--endpoint-down-wait-ms="))
      opts.endpointDownWaitMs = parseInt(a.split("=")[1], 10);
    else if (a.startsWith("--log=")) opts.logFile = a.slice("--log=".length);
    else if (a.startsWith("--error-backoff-ms="))
      opts.errorBackoffMs = parseInt(a.split("=")[1], 10);
  }
  return opts;
}

function log(line, logFile) {
  const s = `[until-done ${new Date().toISOString()}] ${line}`;
  console.error(s);
  if (logFile) {
    try {
      mkdirSync(dirname(logFile), { recursive: true });
      appendFileSync(logFile, s + "\n", "utf8");
    } catch {
      /* ignore */
    }
  }
}

function runArchive(args, logFile) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [ARCHIVE, ...args], {
      cwd: join(__dirname, "..", ".."),
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    });
    let out = "";
    const onData = (buf) => {
      const t = buf.toString();
      out += t;
      process.stderr.write(t);
      if (logFile) {
        try {
          appendFileSync(logFile, t, "utf8");
        } catch {
          /* ignore */
        }
      }
    };
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.on("close", (code) => resolve({ code: code ?? 1, out }));
    child.on("error", (err) => resolve({ code: 1, out: String(err) }));
  });
}

function snapshotLine(cfg) {
  const snap = readHarvestSnapshot(cfg);
  const downloaded = Object.keys(snap.progress.downloadedIds || {}).length;
  const queueByTier = {};
  for (const q of snap.queue || []) {
    const k = q.tierId || q.alan || "unknown";
    queueByTier[k] = (queueByTier[k] || 0) + 1;
  }
  const tiers = (cfg.tiers || []).map((t) => ({
    id: t.id,
    priority: t.priority ?? 99,
    done: !!snap.cursor.tiers?.[t.id]?.done,
  }));
  // High-priority (YİBK/HGK/CGK) unfinished tiers need a minimum queue floor
  // so CGK is not starved while HGK already has thousands queued.
  const HIGH_SEED_FLOOR = 400;
  const needsHighPrioritySeed = tiers.some(
    (t) => !t.done && t.priority <= 1 && (queueByTier[t.id] || 0) < HIGH_SEED_FLOOR
  );
  return {
    complete: snap.status.complete,
    reason: snap.status.reason,
    queueLen: snap.queue.length,
    queueByTier,
    needsHighPrioritySeed,
    downloaded,
    daily: snap.daily,
    budget: snap.budget,
    tiers,
    status: snap.status,
  };
}

async function main() {
  const opts = parseArgs();
  let cfg = loadConfig();
  let maxBatch = opts.maxPerBatch ?? cfg.rateLimit?.maxFullTextPerRun ?? 45;
  let iteration = 0;
  let consecutiveErrors = 0;

  log(
    `start maxPerBatch=${maxBatch} once=${opts.once} budgetWaitMs=${opts.budgetWaitMs ?? "next-day"}`,
    opts.logFile
  );

  while (true) {
    iteration++;
    // Hot-reload config each loop so overnight rate ramp takes effect without restart
    if (opts.maxPerBatch == null) {
      try {
        cfg = loadConfig();
        const nextMax = cfg.rateLimit?.maxFullTextPerRun ?? maxBatch;
        if (nextMax !== maxBatch) {
          log(`rate ramp: maxFullTextPerRun ${maxBatch} → ${nextMax}`, opts.logFile);
          maxBatch = nextMax;
        }
      } catch {
        /* keep previous cfg */
      }
    }
    const before = snapshotLine(cfg);
    log(
      `iter=${iteration} complete=${before.complete} reason=${before.reason} queue=${before.queueLen} downloaded=${before.downloaded} fullText=${before.daily.fullText}/${cfg.rateLimit.maxFullTextPerDay}`,
      opts.logFile
    );

    if (before.complete) {
      log("HARVEST COMPLETE — all tiers done, queue empty. Exiting 0.", opts.logFile);
      process.exit(0);
    }

    // Budget exhausted: cannot download more today → wait until UTC day key flips
    if (before.budget.exhausted) {
      if (opts.once) {
        log("once=true and budget exhausted — exit 2 (resume later)", opts.logFile);
        process.exit(2);
      }
      // Loop until rollDaily would reset (UTC day key). One short override wait for proofs;
      // real runs re-check so a wrong local-midnight wait cannot strand ~24h.
      let guard = 0;
      while (guard < 8) {
        guard++;
        const snap = snapshotLine(cfg);
        if (!snap.budget.exhausted) break;
        const waitMs = msUntilNextBudgetDay(new Date(), opts.budgetWaitMs);
        log(
          `daily full-text budget exhausted (${snap.budget.fullTextUsed}/${snap.budget.maxFt} day=${snap.budget.dayKey || snap.daily.date}). waiting ${(waitMs / 1000).toFixed(0)}s for UTC budget rollover…`,
          opts.logFile
        );
        await sleep(waitMs);
        log(
          `budget wait finished; resuming harvest loop (UTC day=${new Date().toISOString().slice(0, 10)})`,
          opts.logFile
        );
        // Proof path: single forced wait then continue to spawn
        if (opts.budgetWaitMs != null) break;
      }
      continue;
    }

    // Drain large queues before more search (priority order preserved in queue).
    // Exception: seed unfinished p0–p1 tiers (e.g. CGK) that have zero queue items
    // so core-100k diversification does not wait until HGK fully drains.
    const args = [];
    const allTiersDone = before.tiers.every((t) => t.done);
    const drainOnly =
      allTiersDone || (before.queueLen >= 120 && !before.needsHighPrioritySeed);
    if (drainOnly) {
      args.push("--download-only");
    } else if (before.needsHighPrioritySeed) {
      log(
        `high-priority seed needed (queueByTier=${JSON.stringify(before.queueByTier)}) — allowing search`,
        opts.logFile
      );
    }
    args.push(`--max=${maxBatch}`);

    log(`spawn archive-yargitay.mjs ${args.join(" ")}`, opts.logFile);
    const result = await runArchive(args, opts.logFile);

    // Bakanlık getDokuman kapalıysa indirme turunu boşuna çevirme — kısa bekle, sonra tekrar dene
    // (uzun 5–30 dk molalar yok; ban koruması tam metinler arası random delay ile)
    if (
      result.out &&
      /endpoint-down|getDokuman API kapalı/i.test(result.out)
    ) {
      const waitMs =
        opts.endpointDownWaitMs ??
        opts.budgetWaitMs ??
        20_000; // default 20s; not multi-minute
      log(
        `getDokuman endpoint-down detected — waiting ${(waitMs / 1000).toFixed(0)}s before retry (search queue preserved)`,
        opts.logFile
      );
      if (opts.once) {
        log("once=true and endpoint-down — exit 3 (resume later)", opts.logFile);
        process.exit(3);
      }
      await sleep(waitMs);
      consecutiveErrors = 0;
      continue;
    }

    if (result.code !== 0) {
      consecutiveErrors++;
      const backoff = Math.min(
        opts.errorBackoffMs * Math.min(consecutiveErrors, 5),
        15 * 60_000
      );
      log(
        `archive exit ${result.code}; retry after ${(backoff / 1000).toFixed(0)}s (errors=${consecutiveErrors})`,
        opts.logFile
      );
      if (opts.once) process.exit(result.code || 1);
      await sleep(backoff);
      continue;
    }
    consecutiveErrors = 0;

    const after = snapshotLine(cfg);
    log(
      `after iter=${iteration} queue=${after.queueLen} downloaded=${after.downloaded} complete=${after.complete}`,
      opts.logFile
    );

    if (after.complete) {
      log("HARVEST COMPLETE after batch. Exiting 0.", opts.logFile);
      process.exit(0);
    }

    if (opts.once) {
      log("once=true — single batch done, exit 0 (not complete yet)", opts.logFile);
      process.exit(0);
    }

    // If no movement and budget not exhausted, brief pause then retry (API empty/errors)
    if (
      after.queueLen === before.queueLen &&
      after.downloaded === before.downloaded &&
      !after.budget.exhausted
    ) {
      log("no progress this batch; short pause 20–40s then continue", opts.logFile);
      await sleep(20_000 + Math.floor(Math.random() * 20_000));
    }
  }
}

const isMain =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

export { snapshotLine, parseArgs, runArchive, main };
