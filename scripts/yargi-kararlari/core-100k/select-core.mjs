/**
 * Select core emsal library from local decision archive.
 *
 *   node scripts/yargi-kararlari/core-100k/select-core.mjs
 *   node scripts/yargi-kararlari/core-100k/select-core.mjs --limit=500
 *   node scripts/yargi-kararlari/core-100k/select-core.mjs --report-only
 *   node scripts/yargi-kararlari/core-100k/select-core.mjs --max-scan=5000
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  appendFileSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  scoreDecision,
  assignUniquenessWithinPool,
  recomputeComposite,
  yearOf,
} from "./score.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..", "..");
const PLAN_PATH = join(__dirname, "quota-plan.json");
const DEFAULT_DECISIONS = join(ROOT, "data", "yargi-kararlari", "decisions");
const OUT_DIR = join(ROOT, "data", "yargi-kararlari", "core-100k");

function parseArgs() {
  const opts = {
    limit: null,
    reportOnly: false,
    maxScan: null,
    decisionsDir: DEFAULT_DECISIONS,
    threshold: null,
  };
  for (const a of process.argv.slice(2)) {
    if (a === "--report-only") opts.reportOnly = true;
    else if (a.startsWith("--limit=")) opts.limit = parseInt(a.split("=")[1], 10);
    else if (a.startsWith("--max-scan=")) opts.maxScan = parseInt(a.split("=")[1], 10);
    else if (a.startsWith("--decisions=")) opts.decisionsDir = a.split("=")[1];
    else if (a.startsWith("--threshold=")) opts.threshold = parseFloat(a.split("=")[1]);
  }
  return opts;
}

function loadPlan() {
  return JSON.parse(readFileSync(PLAN_PATH, "utf8"));
}

function walkJsonFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) walkJsonFiles(p, acc);
    else if (name.name.endsWith(".json")) acc.push(p);
  }
  return acc;
}

function loadDecisions(dir, maxScan) {
  const files = walkJsonFiles(dir);
  const out = [];
  for (const f of files) {
    if (maxScan && out.length >= maxScan) break;
    try {
      const rec = JSON.parse(readFileSync(f, "utf8"));
      if (rec?.id && rec?.text) out.push(rec);
    } catch {
      /* skip */
    }
  }
  return out;
}

function fillQuotas(rows, plan) {
  const byGroup = new Map();
  for (const r of rows) {
    if (!byGroup.has(r.group)) byGroup.set(r.group, []);
    byGroup.get(r.group).push(r);
  }
  for (const [, list] of byGroup) {
    list.sort((a, b) => b.compositeScore - a.compositeScore || b.textLen - a.textLen);
  }

  const selected = [];
  const fill = {};
  const perDaire = new Map();

  for (const block of plan.blocks) {
    const pool = byGroup.get(block.id) || [];
    const want = block.quota;
    let took = 0;
    const cap = block.perDaireCap || Infinity;
    for (const row of pool) {
      if (took >= want) break;
      const dkey = `${block.id}::${row.daire || "?"}`;
      const n = perDaire.get(dkey) || 0;
      if (n >= cap) continue;
      selected.push(row);
      perDaire.set(dkey, n + 1);
      took++;
    }
    fill[block.id] = { want, have: took, pool: pool.length };
  }

  // Era soft rebalance: if we have excess in one era and deficit in another
  // within selected, leave as-is for seed; report only
  const eraCounts = { pre2010: 0, y2010_2019: 0, y2020plus: 0, unknown: 0 };
  for (const r of selected) eraCounts[r.era] = (eraCounts[r.era] || 0) + 1;

  const domainCounts = {};
  for (const r of selected) domainCounts[r.domain] = (domainCounts[r.domain] || 0) + 1;

  return { selected, fill, eraCounts, domainCounts };
}

function toPublic(row) {
  return {
    id: row.id,
    mahkeme: row.mahkeme,
    daire: row.daire,
    esas: row.esas,
    karar: row.karar,
    tarih: row.tarih,
    ratioOzeti: row.ratioOzeti,
    uniquenessScore: row.uniquenessScore,
    qualityScore: row.qualityScore,
    sourceScore: row.sourceScore,
    compositeScore: row.compositeScore,
    group: row.group,
    domain: row.domain,
    era: row.era,
  };
}

function writeCsv(path, rows) {
  const headers = [
    "id",
    "mahkeme",
    "daire",
    "esas",
    "karar",
    "tarih",
    "group",
    "domain",
    "era",
    "compositeScore",
    "uniquenessScore",
    "qualityScore",
    "sourceScore",
    "ratioOzeti",
  ];
  const esc = (v) => {
    const s = String(v ?? "").replace(/"/g, '""');
    return `"${s}"`;
  };
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(headers.map((h) => esc(r[h])).join(","));
  }
  writeFileSync(path, lines.join("\n"), "utf8");
}

function main() {
  const opts = parseArgs();
  const plan = loadPlan();
  const threshold = opts.threshold ?? plan.similarityThreshold ?? 0.85;

  console.error(`[core-select] decisions=${opts.decisionsDir}`);
  const raw = loadDecisions(opts.decisionsDir, opts.maxScan);
  console.error(`[core-select] loaded=${raw.length}`);

  if (!raw.length) {
    console.error("[core-select] no decisions — abort");
    process.exit(1);
  }

  const scored = raw.map((rec) => scoreDecision(rec, plan));
  console.error(`[core-select] scored=${scored.length}`);

  // Uniqueness within each group separately then merge (memory/speed)
  const byGroup = new Map();
  for (const r of scored) {
    if (!byGroup.has(r.group)) byGroup.set(r.group, []);
    byGroup.get(r.group).push(r);
  }

  let unique = [];
  let rejectedAll = [];
  for (const [g, list] of byGroup) {
    const { keepers, rejected } = assignUniquenessWithinPool(list, threshold);
    for (const k of keepers) recomputeComposite(k, plan);
    unique = unique.concat(keepers);
    rejectedAll = rejectedAll.concat(rejected);
    console.error(`[core-select] group=${g} in=${list.length} keep=${keepers.length} reject=${rejected.length}`);
  }

  unique.sort((a, b) => b.compositeScore - a.compositeScore);

  const { selected, fill, eraCounts, domainCounts } = fillQuotas(unique, plan);
  selected.sort((a, b) => b.compositeScore - a.compositeScore);

  let finalRows = selected.map(toPublic);
  if (opts.limit && opts.limit > 0) finalRows = finalRows.slice(0, opts.limit);

  const report = {
    at: new Date().toISOString(),
    scanned: raw.length,
    afterUniqueness: unique.length,
    rejectedSimilar: rejectedAll.length,
    selected: finalRows.length,
    targetTotal: plan.targetTotal,
    fillProgress: fill,
    eraCounts,
    domainCounts,
    similarityThreshold: threshold,
    topDomains: Object.entries(domainCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20),
    note:
      finalRows.length < plan.targetTotal
        ? `Seed only: ${finalRows.length}/${plan.targetTotal}. Continue harvest (HGK/CGK/daire/Danıştay) then re-run.`
        : "Target met.",
  };

  console.error(JSON.stringify(report, null, 2));

  if (opts.reportOnly) {
    process.stdout.write(JSON.stringify({ report, sample: finalRows.slice(0, 5) }, null, 2));
    return;
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const catalogPath = join(OUT_DIR, "catalog.jsonl");
  const csvPath = join(OUT_DIR, "catalog.csv");
  const reportPath = join(OUT_DIR, "quota-fill-report.json");
  const rejectedPath = join(OUT_DIR, "rejected-similar.jsonl");
  const previewPath = join(OUT_DIR, "preview-top200.json");

  writeFileSync(catalogPath, finalRows.map((r) => JSON.stringify(r)).join("\n") + (finalRows.length ? "\n" : ""), "utf8");
  writeCsv(csvPath, finalRows);
  writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");
  writeFileSync(
    rejectedPath,
    rejectedAll.slice(0, 5000).map((r) => JSON.stringify(r)).join("\n") + (rejectedAll.length ? "\n" : ""),
    "utf8"
  );
  writeFileSync(previewPath, JSON.stringify(finalRows.slice(0, 200), null, 2), "utf8");

  console.error(`[core-select] wrote ${OUT_DIR}`);
  console.error(`[core-select] catalog=${finalRows.length} lines`);
}

main();
