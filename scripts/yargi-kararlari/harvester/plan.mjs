/**
 * Hasat planı v2 — "emsal odaklı, yıl yıl, yeniden eskiye" (kullanıcı talimatı 2026-09-26).
 *
 * Pencereler (aylık, gerekirse ikiye bölünmüş) en yeni aydan geriye sıralıdır; yıl sırası
 * böylece kendiliğinden korunur (önce 2026, sonra 2025 …). Her pencerenin yaşam döngüsü:
 *   pending → (olcum: toplam sayısı; 9.000'i aşarsa böl)
 *           → kw  (emsal işaret kelimeleri "veya" aramasıyla işaretli kararlar)
 *           → inv (pencerenin tüm kararlarının künye envanteri)
 *           → secim (daemon seçimi çalıştırır) → secildi
 * Seçilmiş, yakın tarihli pencerelerin toplamı periyodik yoklanır; Yargıtay geç
 * yayımladıkça artan pencere yeniden taranır, seçim yalnız yeni kararlara uygulanır.
 * Hedef (ör. 600.000 yararlı karar) dolunca yalnız içinde bulunulan yıl güncel tutulur.
 */

const DAY = 86_400_000;

export function parseTr(tr) {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(tr || ""));
  if (!m) return NaN;
  return Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
}

export function fmtTrUtc(ms) {
  const d = new Date(ms);
  return `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${d.getUTCFullYear()}`;
}

/** TR takvim günü (UTC+3) — "bugün" hesabı için. */
export function trToday(now) {
  const d = new Date(now + 3 * 3_600_000);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export function trYear(now = Date.now()) {
  return new Date(trToday(now)).getUTCFullYear();
}

export function daysInclusive(fromTr, toTr) {
  return Math.round((parseTr(toTr) - parseTr(fromTr)) / DAY) + 1;
}

export function unitYear(u) {
  return Number(String(u.from).slice(-4));
}

function unitId(from, to) {
  return `${from}..${to}`;
}

function newUnit(from, to, extra = {}) {
  return { id: unitId(from, to), from, to, status: "pending", page: 1, kwPage: 1, total: null, ...extra };
}

/** Bu aydan `yearFrom` Ocak'ına kadar aylık pencereler, en yeni önce. */
export function monthWindows(yearFrom, now = Date.now()) {
  const today = trToday(now);
  const t = new Date(today);
  let y = t.getUTCFullYear();
  let m = t.getUTCMonth();
  const out = [];
  while (y > yearFrom || (y === yearFrom && m >= 0)) {
    const start = Date.UTC(y, m, 1);
    const end = Math.min(Date.UTC(y, m + 1, 0), today);
    out.push({ from: fmtTrUtc(start), to: fmtTrUtc(end) });
    m--;
    if (m < 0) {
      m = 11;
      y--;
    }
  }
  return out;
}

export function createPlan(sweepCfg, now = Date.now(), politika = null) {
  return {
    version: 2,
    strategy: "emsal-yil-yil",
    createdAt: new Date(now).toISOString(),
    politika: politika ? { ...politika, plandaKayitli: new Date(now).toISOString() } : null,
    units: monthWindows(sweepCfg.yearFrom, now).map((w) => newUnit(w.from, w.to)),
    census: {},
    years: {},
    hedefTamam: false,
  };
}

/** v1 planından (tek geçişli tarama) v2'ye: yıllık sayım korunur, pencereler baştan envanterlenir. */
export function migratePlan(old, sweepCfg, now = Date.now(), politika = null) {
  const p = createPlan(sweepCfg, now, politika);
  if (old?.census) p.census = old.census;
  p.migratedFrom = { version: old?.version ?? 1, strategy: old?.strategy ?? null, at: new Date(now).toISOString() };
  return p;
}

/**
 * Takvim ilerledikçe kapsanmayan günler için başa yeni pencere(ler) ekler.
 * Yargıtay aylar gecikmeyle yayımladığından en az `minDays` birikince eklenir.
 */
export function extendPlanToNow(plan, now = Date.now(), minDays = 7) {
  const today = trToday(now);
  const maxTo = Math.max(...plan.units.map((u) => parseTr(u.to)));
  if (!Number.isFinite(maxTo) || today - maxTo < minDays * DAY) return 0;
  const chunks = [];
  let start = maxTo + DAY;
  while (start <= today) {
    const d = new Date(start);
    const end = Math.min(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0), today);
    chunks.push({ from: fmtTrUtc(start), to: fmtTrUtc(end) });
    start = end + DAY;
  }
  chunks.reverse();
  plan.units.unshift(...chunks.map((w) => newUnit(w.from, w.to)));
  return chunks.length;
}

function isLeaf(u) {
  return u.status !== "split";
}

export function planProgress(plan) {
  const leaves = plan.units.filter(isLeaf);
  const done = leaves.filter((u) => u.status === "secildi").length;
  const active = leaves.find((u) => u.status !== "secildi") || null;
  return { unitsDone: done, unitsTotal: leaves.length, active };
}

export function yearUnits(plan, year) {
  return plan.units.filter((u) => isLeaf(u) && unitYear(u) === Number(year));
}

/** Yılın tüm pencereleri seçimden geçti mi? */
export function yearAllSelected(plan, year) {
  const us = yearUnits(plan, year);
  return us.length > 0 && us.every((u) => u.status === "secildi");
}

function words(cfg) {
  return (cfg.politika?.hedefliKelimeler || []).filter(Boolean);
}

/**
 * Sıradaki arama işi:
 *  1) yıllık sayım (yıl başına 1 çağrı — evren büyüklüğü ve süre tahmini için)
 *  2) vadesi gelmiş yenileme yoklaması (yakın tarihli, seçilmiş pencere)
 *  3) sıradaki pencerenin sıradaki adımı (olcum → kw → inv)
 */
export function nextSearchJob(plan, cfg, now = Date.now()) {
  const sweep = cfg.sweep;
  const pageSize = sweep.pageSize || 100;
  const thisYear = trYear(now);

  const censusMaxAge = (sweep.censusEveryDays ?? 30) * DAY;
  for (let y = thisYear; y >= sweep.yearFrom; y--) {
    const c = plan.census?.[y];
    if (!c || now - Date.parse(c.at) > censusMaxAge) {
      const to = y === thisYear ? fmtTrUtc(trToday(now)) : `31.12.${y}`;
      return { type: "census", year: y, params: { from: `01.01.${y}`, to, pageSize: 1, pageNumber: 1 } };
    }
  }

  const refresh = sweep.refresh || {};
  if (refresh.everyDays) {
    const horizon = trToday(now) - (refresh.recentMonths ?? 12) * 31 * DAY;
    const dueAge = refresh.everyDays * DAY;
    for (const u of plan.units) {
      if (u.status !== "secildi" || parseTr(u.to) < horizon) continue;
      const last = Date.parse(u.checkedAt || u.doneAt || 0) || 0;
      if (now - last >= dueAge) {
        return { type: "check", unitId: u.id, params: { from: u.from, to: u.to, pageSize: 1, pageNumber: 1 } };
      }
    }
  }

  for (const u of plan.units) {
    if (!isLeaf(u) || u.status === "secildi" || u.status === "secim") continue;
    if (plan.hedefTamam && unitYear(u) < thisYear) return null;
    const base = { unitId: u.id, from: u.from, to: u.to };
    if (u.status === "pending") {
      return { ...base, type: "olcum", params: { from: u.from, to: u.to, pageSize: 1, pageNumber: 1 } };
    }
    if (u.status === "kw") {
      return {
        ...base,
        type: "kw",
        page: u.kwPage || 1,
        params: { from: u.from, to: u.to, keyword: words(cfg).join(" "), pageSize, pageNumber: u.kwPage || 1 },
      };
    }
    return { ...base, type: "inv", page: u.page || 1, params: { from: u.from, to: u.to, pageSize, pageNumber: u.page || 1 } };
  }
  return null;
}

function splitUnit(plan, idx) {
  const u = plan.units[idx];
  const a = parseTr(u.from);
  const days = daysInclusive(u.from, u.to);
  const half = Math.floor(days / 2);
  const newer = { from: fmtTrUtc(a + half * DAY), to: u.to };
  const older = { from: u.from, to: fmtTrUtc(a + (half - 1) * DAY) };
  u.status = "split";
  const kids = [newer, older].map((w) => newUnit(w.from, w.to, { parent: u.id }));
  plan.units.splice(idx + 1, 0, ...kids);
  return kids;
}

function isLastPage(res, page, pageSize) {
  return res.items.length < pageSize || page * pageSize >= res.total;
}

/**
 * Arama sonucunu plana işler. Dönüş:
 *   { note, items, marked, ready }  — items envantere eklenecek künyeler;
 *   ready: pencerenin envanteri tamamlandı (seçim çalıştırılmalı).
 * Hata sonuçlarında imleç ilerlemez (aynı sayfa tekrar denenir).
 */
export function applySearchResult(plan, job, res, cfg, now = Date.now()) {
  const iso = new Date(now).toISOString();
  const none = { note: "", items: [], marked: false, ready: false };
  if (res.kind !== "ok") return { ...none, note: "hata" };

  if (job.type === "census") {
    plan.census ||= {};
    plan.census[job.year] = { total: res.total, at: iso };
    return { ...none, note: `sayım ${job.year}: ${res.total}` };
  }

  const idx = plan.units.findIndex((x) => x.id === job.unitId);
  if (idx < 0) return { ...none, note: "pencere yok (plan değişti)" };
  const u = plan.units[idx];
  const pageSize = cfg.sweep.pageSize || 100;

  if (job.type === "check") {
    const before = u.total ?? 0;
    u.checkedAt = iso;
    if (res.total > before) {
      u.status = words(cfg).length ? "kw" : "inv";
      u.kwPage = 1;
      u.page = 1;
      u.total = res.total;
      u.resweeps = (u.resweeps || 0) + 1;
      return { ...none, note: `yenileme ${u.id}: ${before} → ${res.total}, yeni kararlar envanterlenecek` };
    }
    return { ...none, note: `yenileme ${u.id}: değişmedi (${res.total})` };
  }

  if (job.type === "olcum") {
    const splitAbove = cfg.sweep.splitAbove || 9000;
    if (res.total > splitAbove && daysInclusive(u.from, u.to) >= 2) {
      const kids = splitUnit(plan, idx);
      return { ...none, note: `böl ${u.id} (${res.total}) → ${kids.map((k) => k.id).join(" + ")}` };
    }
    u.total = res.total;
    u.fails = 0;
    if (!res.total) {
      u.status = "secildi";
      u.doneAt = iso;
      u.checkedAt = iso;
      return { ...none, note: `boş pencere ${u.id}` };
    }
    u.status = words(cfg).length ? "kw" : "inv";
    u.kwPage = 1;
    u.page = 1;
    return { ...none, note: `ölçüm ${u.id}: ${res.total} karar` };
  }

  if (job.type === "kw") {
    u.fails = 0;
    const page = u.kwPage || 1;
    if (page === 1) {
      u.kwTotal = res.total;
      const maxShare = cfg.politika?.hedefliEnFazlaOran ?? 0.35;
      if (u.total && res.total / u.total > maxShare) {
        u.kwSkipped = true;
        u.status = "inv";
        u.page = 1;
        return { ...none, note: `işaret kelimeleri ayırt edici değil (${res.total}/${u.total}) — atlandı` };
      }
    }
    if (isLastPage(res, page, pageSize)) {
      u.status = "inv";
      u.page = 1;
    } else u.kwPage = page + 1;
    return { note: "", items: res.items, marked: true, ready: false };
  }

  // inv
  u.fails = 0;
  const page = u.page || 1;
  u.total = Math.max(u.total || 0, res.total);
  if (isLastPage(res, page, pageSize)) {
    u.status = "secim";
    return { note: "", items: res.items, marked: false, ready: true };
  }
  u.page = page + 1;
  return { note: "", items: res.items, marked: false, ready: false };
}

/** Seçim bitti: pencere kapanır, envanterin kaçıncı satırına kadar seçildiği yazılır. */
export function markSelected(plan, unitIdValue, invLines, now = Date.now()) {
  const u = plan.units.find((x) => x.id === unitIdValue);
  if (!u) return;
  const iso = new Date(now).toISOString();
  u.status = "secildi";
  u.selectedUpTo = invLines;
  u.doneAt = iso;
  u.checkedAt = iso;
}

/**
 * Aynı sayfa sunucu hatasıyla (server) üst üste düşerse tarama orada takılmasın.
 * Sitenin genel sorunları (429, ağ, engel) sayılmaz — onları vali bekletir.
 */
export function applySearchFailure(plan, job, res, now = Date.now(), maxFails = 5) {
  if (res.kind !== "server") return { note: "" };
  const iso = new Date(now).toISOString();
  if (job.type === "census") {
    plan.censusFails ||= {};
    const n = (plan.censusFails[job.year] = (plan.censusFails[job.year] || 0) + 1);
    if (n >= 3) {
      plan.census ||= {};
      plan.census[job.year] = { total: null, at: iso, failed: true };
      delete plan.censusFails[job.year];
      return { note: `sayım ${job.year} ertelendi` };
    }
    return { note: "" };
  }
  const idx = plan.units.findIndex((x) => x.id === job.unitId);
  if (idx < 0) return { note: "" };
  const u = plan.units[idx];
  if (job.type === "check") {
    u.checkedAt = iso;
    return { note: "yenileme ertelendi" };
  }
  u.fails = (u.fails || 0) + 1;
  if (u.fails < maxFails) return { note: `hata ${u.fails}/${maxFails}` };
  u.fails = 0;
  if (job.type === "olcum" || (job.type === "inv" && (u.page || 1) === 1)) {
    if (daysInclusive(u.from, u.to) >= 2) {
      const kids = splitUnit(plan, idx);
      return { note: `üst üste hata → böl: ${kids.map((k) => k.id).join(" + ")}` };
    }
  }
  if (job.type === "olcum") {
    u.status = "inv";
    return { note: "ölçüm atlandı" };
  }
  if (job.type === "kw") {
    u.kwSkipped = true;
    u.status = "inv";
    u.page = 1;
    return { note: "işaretli arama atlandı" };
  }
  u.skippedPages = [...(u.skippedPages || []), u.page || 1];
  u.page = (u.page || 1) + 1;
  if (u.total != null && (u.page - 1) * (job.params.pageSize || 100) >= u.total) {
    u.status = "secim";
    return { note: `üst üste hata → s.${u.page - 1} atlandı; envanter kapandı`, ready: true };
  }
  return { note: `üst üste hata → s.${u.page - 1} atlandı` };
}

/** Evren (yıllık sayım toplamı) — durum raporu için. */
export function universeSize(plan, yearFrom) {
  let total = 0;
  for (const [y, c] of Object.entries(plan.census || {})) {
    if (Number(y) >= yearFrom) total += c.total || 0;
  }
  return total;
}
