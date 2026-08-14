/**
 * Yerel arşiv HTML index (yıl klasörleri dahil)
 *   node scripts/yargi-kararlari/build-local-index.mjs
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { loadConfig, outPaths, ensureDirs } from "./lib.mjs";

const cfg = loadConfig();
const paths = outPaths(cfg);
ensureDirs(paths);

function walkDecisions() {
  const rows = [];
  if (!existsSync(paths.decisions)) return rows;
  for (const ent of readdirSync(paths.decisions, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      for (const f of readdirSync(join(paths.decisions, ent.name)).filter((x) =>
        x.endsWith(".json")
      )) {
        try {
          rows.push(JSON.parse(readFileSync(join(paths.decisions, ent.name, f), "utf8")));
        } catch {
          /* skip */
        }
      }
    } else if (ent.name.endsWith(".json")) {
      try {
        rows.push(JSON.parse(readFileSync(join(paths.decisions, ent.name), "utf8")));
      } catch {
        /* skip */
      }
    }
  }
  return rows;
}

const rows = walkDecisions();
rows.sort((a, b) => {
  const pa = a.priority ?? 99;
  const pb = b.priority ?? 99;
  if (pa !== pb) return pa - pb;
  return String(b.tarih || "").localeCompare(String(a.tarih || ""));
});

const byTier = {};
for (const d of rows) {
  const t = d.tierId || d.alan || "?";
  byTier[t] = (byTier[t] || 0) + 1;
}

const escape = (s) =>
  String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const cards = rows
  .slice(0, 500)
  .map((d) => {
    const preview = escape((d.text || "").slice(0, 360));
    return `<article class="card" data-tier="${escape(d.tierId || d.alan)}">
  <h2>${escape(d.kunye)}</h2>
  <p class="meta"><span class="tag">${escape(d.tierId || d.alan)}</span> p${d.priority ?? "?"} · ${escape(d.daire)} · ${escape(d.tarih)}</p>
  <p class="preview">${preview}${(d.text || "").length > 360 ? "…" : ""}</p>
  <p class="file"><code>decisions/${escape(year(d))}/${escape(d.id)}.json</code> · ${d.charCount || 0} kr</p>
</article>`;
  })
  .join("\n");

function year(d) {
  const m = String(d.tarih || "").match(/(\d{4})/);
  return m ? m[1] : "unknown";
}

const tierStats = Object.entries(byTier)
  .map(([k, v]) => `<li><strong>${escape(k)}</strong>: ${v}</li>`)
  .join("");

const html = `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <title>Yargı Kararları — yerel arşiv (${rows.length})</title>
  <style>
    body { max-width: 960px; margin: 2rem auto; padding: 0 1rem; font-family: Segoe UI, system-ui, sans-serif; background:#f6f4ef; color:#1a1a1a; }
    h1 { font-size: 1.35rem; }
    .stats { background:#fff; border:1px solid #e5e1d8; border-radius:10px; padding:1rem 1.2rem; margin:1rem 0 1.5rem; }
    .card { background:#fff; border:1px solid #e4e0d8; border-radius:10px; padding:1rem 1.2rem; margin-bottom:.9rem; }
    .card h2 { font-size:.98rem; margin:0 0 .35rem; line-height:1.35; }
    .meta { font-size:.82rem; color:#666; }
    .tag { background:#eef2ff; color:#334; padding:.1rem .45rem; border-radius:4px; }
    .preview { font-size:.9rem; line-height:1.45; white-space:pre-wrap; }
    .file { font-size:.78rem; color:#888; }
    .note { color:#666; font-size:.9rem; }
  </style>
</head>
<body>
  <h1>Yargı kararları — yerel arşiv</h1>
  <p class="note">Öncelik: YİBK → HGK → daire. BAM/ilk derece yok. Vercel'e henüz yüklenmedi. İlk 500 kart listelenir.</p>
  <div class="stats">
    <p><strong>Toplam:</strong> ${rows.length} karar</p>
    <ul>${tierStats || "<li>boş</li>"}</ul>
  </div>
  <div id="list">${cards || "<p>Henüz karar yok.</p>"}</div>
</body>
</html>`;

writeFileSync(join(paths.base, "index.html"), html, "utf8");
console.error(`Yazıldı: index.html (${rows.length} karar, ${rows.slice(0, 500).length} kart)`);
