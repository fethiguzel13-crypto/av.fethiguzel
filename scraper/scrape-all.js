// Orchestrator — tüm scraper'ları sıralı çağır, JSON birleştir, sabah brifingi JSON'u üret
// Sıralı (paralel değil) — birden fazla browser instance Chromium'da kararsızlık yaratabilir
//
// Kullanım:
//   node scrape-all.js                     # default: günlük tarama
//   node scrape-all.js --yargitay-days=90 --aym-days=30 --hudoc-days=30 --rg-days=2
//   node scrape-all.js --skip=yargitay     # belirli scraper'ı atla
//   node scrape-all.js --debug

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    // Yargıtay ve AYM sistemleri kararları gecikmeli yayımlar → default 90 gün
    yargitayDays: 90,
    aymDays: 90,
    // HUDOC ve Resmî Gazete gerçek zamanlı → kısa pencere yeterli
    hudocDays: 30,
    rgDays: 2,
    skip: [],
    debug: false,
  };
  for (const a of args) {
    if (a === "--debug") opts.debug = true;
    else if (a.startsWith("--yargitay-days=")) opts.yargitayDays = parseInt(a.split("=")[1], 10);
    else if (a.startsWith("--aym-days=")) opts.aymDays = parseInt(a.split("=")[1], 10);
    else if (a.startsWith("--hudoc-days=")) opts.hudocDays = parseInt(a.split("=")[1], 10);
    else if (a.startsWith("--rg-days=")) opts.rgDays = parseInt(a.split("=")[1], 10);
    else if (a.startsWith("--skip=")) opts.skip = a.split("=")[1].split(",");
  }
  return opts;
}

function runScraper(script, args, log) {
  return new Promise((resolve) => {
    const fullArgs = [script, ...args];
    log(`▶ node ${fullArgs.join(" ")}`);
    const proc = spawn("node", fullArgs, {
      cwd: __dirname,
      env: process.env,
    });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => {
      stderr += d.toString();
      if (log.verbose) process.stderr.write(d);
    });
    proc.on("close", (code) => {
      let parsed = null;
      try {
        parsed = JSON.parse(stdout);
      } catch (e) {
        parsed = { ok: false, error: `Parse error: ${e.message}`, rawStdout: stdout.slice(0, 500) };
      }
      resolve({ script, exitCode: code, parsed, stderr });
    });
    proc.on("error", (err) => {
      resolve({ script, exitCode: -1, parsed: { ok: false, error: err.message }, stderr });
    });
  });
}

async function main() {
  const opts = parseArgs();
  const log = (...a) => console.error("[all]", ...a);
  log.verbose = opts.debug;
  if (!opts.debug) {
    // Sadece kritik mesajlar
  }

  const tasks = [
    {
      key: "resmigazete",
      script: "scrape-resmigazete.js",
      args: [`--days=${opts.rgDays}`],
    },
    {
      key: "hudoc",
      script: "scrape-hudoc.js",
      args: [`--days=${opts.hudocDays}`, "--max=50"],
    },
    {
      key: "aym",
      script: "scrape-aym.js",
      args: [`--days=${opts.aymDays}`, "--max=20"],
    },
    {
      key: "yargitay",
      script: "scrape-yargitay.js",
      args: [`--days=${opts.yargitayDays}`, "--max=30"],
    },
  ];

  const enabledTasks = tasks.filter((t) => !opts.skip.includes(t.key));
  log(`Çalıştırılacak scraper: ${enabledTasks.map((t) => t.key).join(", ")}`);
  log(`Atlanan: ${opts.skip.length ? opts.skip.join(", ") : "(yok)"}`);

  const results = {};
  const startTime = Date.now();

  for (const t of enabledTasks) {
    const tStart = Date.now();
    const res = await runScraper(t.script, t.args, log);
    const elapsed = ((Date.now() - tStart) / 1000).toFixed(1);
    results[t.key] = res.parsed;
    log(`✓ ${t.key} bitti (${elapsed}s, exit=${res.exitCode}, items=${res.parsed?.itemCount ?? "?"})`);
  }

  const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  const combined = {
    source: "all",
    fetchedAt: new Date().toISOString(),
    ok: true,
    elapsedSec: totalElapsed,
    sources: results,
    summary: {
      totalItems: Object.values(results).reduce((acc, r) => acc + (r?.itemCount || 0), 0),
      perSource: Object.fromEntries(
        Object.entries(results).map(([k, v]) => [
          k,
          { ok: v?.ok ?? false, itemCount: v?.itemCount ?? 0, error: v?.error || null },
        ])
      ),
    },
  };

  process.stdout.write(JSON.stringify(combined, null, 2) + "\n");
  log(`Toplam süre: ${totalElapsed}s | Toplam item: ${combined.summary.totalItems}`);
}

main().catch((e) => {
  console.error("[all] FATAL:", e);
  process.exit(1);
});
