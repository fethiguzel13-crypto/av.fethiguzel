/**
 * One-shot: re-queue IDs that were permanently burned by network/transient errors.
 *   node scripts/yargi-kararlari/recover-transient-fails.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const state = join(__dirname, "..", "..", "data", "yargi-kararlari", "_state");
const progressPath = join(state, "progress.json");
const queuePath = join(state, "queue.jsonl");

const progress = JSON.parse(readFileSync(progressPath, "utf8"));
const failed = progress.failedIds || {};
const downloaded = progress.downloadedIds || {};

let queue = [];
if (existsSync(queuePath)) {
  const raw = readFileSync(queuePath, "utf8").trim();
  if (raw) queue = raw.split(/\n+/).filter(Boolean).map((l) => JSON.parse(l));
}
const existing = new Set(queue.map((q) => String(q.id)));

const TRANSIENT =
  /fetch failed|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|network|HTTP 429|HTTP 502|HTTP 503|HTTP 504|empty-or-short|non-json-body/i;

let restored = 0;
let keptFailed = 0;
const newFailed = {};
const now = new Date().toISOString();

for (const [id, info] of Object.entries(failed)) {
  const err = String(info?.error || "");
  if (downloaded[id]) continue;
  if (TRANSIENT.test(err)) {
    if (!existing.has(id)) {
      queue.push({
        id: String(id),
        alan: "hgk",
        tierId: "hgk",
        priority: 1,
        keyword: "",
        daire: "",
        esas: "",
        karar: "",
        tarih: "",
        kunye: `Yargitay id=${id} (recovered-from-transient-fail)`,
        queuedAt: now,
        source: "yargitay-resmi",
        _recovered: true,
        _retry: 0,
      });
      existing.add(id);
      restored++;
    }
  } else {
    newFailed[id] = info;
    keptFailed++;
  }
}

queue.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

progress.failedIds = newFailed;
progress.stats = progress.stats || {};
progress.stats.failed = Object.keys(newFailed).length;

writeFileSync(progressPath, JSON.stringify(progress, null, 2), "utf8");
writeFileSync(
  queuePath,
  queue.map((q) => JSON.stringify(q)).join("\n") + (queue.length ? "\n" : ""),
  "utf8"
);

const dl = Object.keys(downloaded).length;
console.log(
  JSON.stringify(
    {
      restoredToQueue: restored,
      queueLen: queue.length,
      permanentFailedLeft: keptFailed,
      downloaded: dl,
      needFor3000: Math.max(0, 6818 - dl),
    },
    null,
    2
  )
);
