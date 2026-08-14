/**
 * Prove until-done: budget exhaust → wait → resume (not exit-as-finished).
 *   node scripts/yargi-kararlari/proof-budget-wait.mjs
 */

import { spawn } from "child_process";
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadConfig, outPaths, todayKey, saveJson, loadJson, emptyDaily } from "./lib.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const SCRATCH =
  process.env.YARGI_SCRATCH ||
  join(process.env.LOCALAPPDATA || "", "Temp", "grok-goal-d5dc1d99b226", "implementer");
const WAIT_MS = 5000;
const LOG = join(SCRATCH, "yargi-budget-wait-proof.log");
const SUMMARY = join(SCRATCH, "yargi-budget-wait-summary.txt");

mkdirSync(SCRATCH, { recursive: true });

const cfg = loadConfig();
const paths = outPaths(cfg);
const dailyPath = paths.daily;
const bak = join(SCRATCH, "daily-backup.json");

if (!existsSync(dailyPath)) {
  saveJson(dailyPath, emptyDaily());
}
copyFileSync(dailyPath, bak);

const maxFt = cfg.rateLimit.maxFullTextPerDay;
const forced = {
  date: todayKey(),
  fullText: maxFt,
  searchCalls: 0,
};
saveJson(dailyPath, forced);

// Verify exhausted before spawn
const check = loadJson(dailyPath, {});
if (check.fullText < maxFt || check.date !== todayKey()) {
  console.error("failed to force exhaust", check);
  process.exit(1);
}

if (existsSync(LOG)) writeFileSync(LOG, "", "utf8");

const child = spawn(
  process.execPath,
  [
    join(__dirname, "until-done.mjs"),
    `--budget-wait-ms=${WAIT_MS}`,
    "--max-per-batch=2",
    `--log=${LOG}`,
  ],
  { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] }
);

let logBuf = "";
const onData = (b) => {
  const t = b.toString();
  logBuf += t;
  process.stderr.write(t);
};
child.stdout.on("data", onData);
child.stderr.on("data", onData);

function logText() {
  try {
    return existsSync(LOG) ? readFileSync(LOG, "utf8") : logBuf;
  } catch {
    return logBuf;
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const t0 = Date.now();
let sawExhausted = false;
let restored = false;

// Poll: once we see exhausted+waiting, restore daily after half wait so resume can download
while (Date.now() - t0 < WAIT_MS + 40_000) {
  const txt = logText();
  if (/budget exhausted/i.test(txt)) sawExhausted = true;
  if (sawExhausted && !restored && Date.now() - t0 > WAIT_MS * 0.4) {
    copyFileSync(bak, dailyPath);
    restored = true;
    console.error("[proof] restored daily so post-wait resume can proceed");
  }
  if (/budget wait finished/i.test(txt) && /spawn archive-yargitay/i.test(txt)) {
    // ensure spawn appears after wait finished
    const waitIdx = txt.lastIndexOf("budget wait finished");
    const spawnAfter = txt.indexOf("spawn archive-yargitay", waitIdx);
    if (waitIdx >= 0 && spawnAfter > waitIdx) break;
  }
  await sleep(400);
}

// Stop child + descendants not needed — kill until-done
try {
  child.kill("SIGTERM");
} catch {
  /* ignore */
}
await sleep(500);
try {
  child.kill("SIGKILL");
} catch {
  /* ignore */
}

// Ensure daily restored
copyFileSync(bak, dailyPath);

const txt = logText();
const waitIdx = txt.lastIndexOf("budget wait finished");
const exhaustOk = /budget exhausted/i.test(txt);
const waitOk = /budget wait finished/i.test(txt);
const resumeOk = waitIdx >= 0 && txt.indexOf("spawn archive-yargitay", waitIdx) > waitIdx;
const noEarlyComplete = !/HARVEST COMPLETE/.test(txt);

const summary = [
  `saw_budget_exhausted=${exhaustOk}`,
  `saw_budget_wait_finished=${waitOk}`,
  `saw_spawn_after_resume=${resumeOk}`,
  `did_not_exit_as_finished=${noEarlyComplete}`,
  `restored_daily=${restored}`,
  `forced_day=${forced.date}`,
  `forced_fullText=${forced.fullText}`,
].join("\n");

writeFileSync(SUMMARY, summary + "\n", "utf8");
console.error(summary);

if (!exhaustOk || !waitOk || !resumeOk) {
  process.exit(1);
}
process.exit(0);
