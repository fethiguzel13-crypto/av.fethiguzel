/**
 * Yargıtay hasat motoru v2 — komut satırı.
 *
 *   node scripts/yargi-kararlari/hasat.mjs              # motoru çalıştır (ön planda)
 *   node scripts/yargi-kararlari/hasat.mjs --durum      # durum raporu (--status)
 *   node scripts/yargi-kararlari/hasat.mjs --dur        # çalışan motoru nazikçe durdur (--stop)
 *   node scripts/yargi-kararlari/hasat.mjs --plan       # tarama planı (ağ kullanmaz)
 *   node scripts/yargi-kararlari/hasat.mjs --max=50     # 50 karar indirip çık (deneme)
 *   node scripts/yargi-kararlari/hasat.mjs --canli      # çalışıyorsa çıkış 0, değilse 1 (--alive)
 *
 * Arka planda sürekli çalıştırma: scripts/yargi-kararlari/hasat-servis.ps1 -Kur
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { harvesterActive } from "./lib.mjs";
import { loadHarvesterConfig, runDaemon, statePaths } from "./harvester/daemon.mjs";
import { planProgress } from "./harvester/plan.mjs";

const args = process.argv.slice(2);
const has = (...names) => args.some((a) => names.includes(a));
const val = (name) => {
  const a = args.find((x) => x.startsWith(`${name}=`));
  return a ? a.slice(name.length + 1) : null;
};

const nf = new Intl.NumberFormat("tr-TR");
const n = (x) => (x == null ? "—" : nf.format(x));

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

function ago(iso) {
  if (!iso) return "—";
  const s = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 1000));
  if (s < 90) return `${s} sn önce`;
  if (s < 5400) return `${Math.round(s / 60)} dk önce`;
  return `${(s / 3600).toFixed(1)} sa önce`;
}

function printStatus() {
  const cfg = loadHarvesterConfig();
  const paths = statePaths(cfg);
  const st = readJson(paths.status);
  const alive = harvesterActive(paths);
  console.log("=== Yargıtay hasat motoru v2 ===");
  if (!st) {
    console.log("Motor henüz hiç çalışmamış (harvester-status.json yok).");
    return;
  }
  const state = alive ? (st.state === "paused" ? "çalışıyor (molada)" : "çalışıyor") : "DURMUŞ";
  console.log(`Durum      : ${state} | pid ${st.pid} | başlangıç ${ago(st.startedAt)} | kalp atışı ${ago(st.heartbeatAt)}`);
  console.log(
    `Arşiv      : ${n(st.downloaded)} karar indirildi | kuyruk ${n(st.queue)} | park ${n(st.parked)} | kalıcı hata ${n(st.failed)}`
  );
  if (st.today) {
    console.log(
      `Bugün (UTC): ${n(st.today.fullText)} tam metin / ${n(st.budget?.maxFullTextPerDay)} · ${n(st.today.searchCalls)} arama`
    );
  }
  const g = st.governor || {};
  const lh = st.lastHour || {};
  console.log(
    `Son 1 saat : ${n(st.throughput?.lastHourDocs)} karar` +
      (st.throughput?.perDayEstimate ? ` (≈ ${n(st.throughput.perDayEstimate)}/gün)` : "") +
      ` · 429: ${n((lh.throttled || 0) + (lh["search:throttled"] || 0))}` +
      ` · ağ hatası: ${n((lh.network || 0) + (lh["search:network"] || 0))}` +
      ` · boş: ${n(lh.empty || 0)}`
  );
  console.log(
    `Hız        : ${g.ratePerMin}/dk (hedef ${g.targetPerMin}, tavan ${g.ceilingPerMin}${g.peak ? ", mesai saati" : ""}) · devre ${g.circuit}` +
      (g.pausedUntil ? ` · molada: ${g.pauseReason}` : "")
  );
  const em = st.emsal;
  if (em) {
    const yuzde = em.hedef ? ` (%${((100 * em.yararli) / em.hedef).toFixed(1)})` : "";
    console.log(
      `Emsal hedef: ${n(em.yararli)} / ${n(em.hedef)} yararlı karar${yuzde}` +
        (em.hedefTamam ? " — HEDEF TAMAM, yalnız bu yıl güncel tutuluyor" : "") +
        (em.tahminiGun ? ` · bu hızla ~${n(Math.round(em.tahminiGun))} gün` : "")
    );
    console.log(
      `Etiketler  : ${n(em.analiz)} karar analiz edildi · yararlı ${n(em.yararli)} · benzer ${n(em.benzer)} · emsal niteliği zayıf ${n(em.zayif)}` +
        (em.defterIsleniyor ? ` · eski arşivden işlenecek ${n(em.defterIsleniyor)}` : "")
    );
    if (st.throughput?.usefulPerDayEstimate) {
      console.log(`Verim      : günde ≈ ${n(st.throughput.usefulPerDayEstimate)} yararlı karar`);
    }
  }
  const sw = st.sweep || {};
  const adim = { pending: "sırada", kw: "emsal işaretli arama", inv: "envanter", secim: "seçim" }[sw.activeStatus] || sw.activeStatus || "—";
  console.log(
    `Tarama     : ${sw.activeYear ?? "—"} yılı · pencere ${sw.activeUnit || "—"} (${adim}${sw.page ? ` s.${sw.page}` : ""})${sw.unitTotal != null ? ` · ${n(sw.unitTotal)} karar` : ""} · ${n(sw.unitsDone)}/${n(sw.unitsTotal)} pencere seçildi`
  );
  const yil = Object.entries(sw.years || {})
    .filter(([y, p]) => p !== "tarama" || Number(y) === sw.activeYear)
    .sort((a, b) => b[0] - a[0]);
  if (yil.length) {
    const ad = { tarama: "taranıyor", doldurma: "doldurma turunda", tamam: "tamam" };
    console.log(`Yıllar     : ${yil.map(([y, p]) => `${y} ${ad[p] || p}`).join(" · ")}`);
  }
  if (sw.universe) {
    console.log(`Evren      : ${sw.yearFrom}–bugün Yargıtay'da ${n(sw.universe)} karar (${sw.censusYears} yıl sayıldı)`);
  }
  if (st.lastError) {
    console.log(`Son hata   : ${ago(st.lastError.at)} ${st.lastError.kind} ${st.lastError.error || ""} (${st.lastError.where})`);
  }
  if (has("--detay", "--detail")) {
    const plan = readJson(paths.state + "/harvester-plan.json");
    if (plan?.census) {
      console.log("\nYıllık sayım (Yargıtay toplamı / elde):");
      for (const y of Object.keys(plan.census).sort().reverse()) {
        console.log(`  ${y}: ${n(plan.census[y].total).padStart(9)} / ${n(st.byYear?.[y] || 0)}`);
      }
    }
  }
}

function printPlan() {
  const cfg = loadHarvesterConfig();
  const paths = statePaths(cfg);
  const plan = readJson(paths.state + "/harvester-plan.json");
  if (!plan) {
    console.log("Plan henüz oluşturulmadı; motor ilk açılışta oluşturur.");
    return;
  }
  const p = planProgress(plan);
  console.log(`Strateji: ${plan.strategy} | ${p.unitsDone}/${p.unitsTotal} pencere seçildi${plan.hedefTamam ? " | HEDEF TAMAM" : ""}`);
  if (plan.politika?.kullaniciTalimati) console.log(`Politika: ${plan.politika.kullaniciTalimati}`);
  const head = plan.units.filter((u) => u.status !== "split" && u.status !== "secildi").slice(0, Number(val("--kac")) || 12);
  for (const u of head) {
    const pg = u.status === "kw" ? `işaretli s.${u.kwPage}` : u.status === "inv" ? `envanter s.${u.page}` : u.status;
    console.log(`  ${u.id}  ${pg}${u.total != null ? `  toplam ${n(u.total)}` : ""}${u.kwTotal != null ? `  işaretli ${n(u.kwTotal)}` : ""}`);
  }
}

async function stopRunning() {
  const cfg = loadHarvesterConfig();
  const paths = statePaths(cfg);
  if (!harvesterActive(paths)) {
    console.log("Çalışan motor yok.");
    return 0;
  }
  writeFileSync(paths.stopFile, new Date().toISOString(), "utf8");
  console.log("Durdurma isteği bırakıldı; işteki istekler bitince motor çıkacak…");
  for (let i = 0; i < 90; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    if (!harvesterActive(paths) || !existsSync(paths.lock)) {
      console.log("Motor durdu.");
      return 0;
    }
  }
  console.log("Motor 90 sn içinde durmadı (uzun bir istek bekliyor olabilir); birazdan tekrar bakın.");
  return 1;
}

async function main() {
  if (has("--durum", "--status")) return printStatus();
  if (has("--plan")) return printPlan();
  if (has("--dur", "--stop")) process.exit(await stopRunning());
  if (has("--canli", "--alive")) {
    const cfg = loadHarvesterConfig();
    process.exit(harvesterActive(statePaths(cfg)) ? 0 : 1);
  }
  const max = val("--max");
  const code = await runDaemon({
    max: max ? Number(max) : undefined,
    downloadOnly: has("--sadece-indir", "--download-only"),
    quiet: has("--sessiz", "--quiet"),
  });
  process.exit(code);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
