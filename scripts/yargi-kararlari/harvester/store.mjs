/**
 * Durum deposu — eski arşivleyiciyle birebir aynı disk düzeni:
 *   decisions/{yıl}/{id}.json, by-alan/, by-tier/, index.jsonl,
 *   _state/progress.json, _state/queue.jsonl, _state/daily.json
 *
 * Farklar:
 *  - Her yazım atomik (geçici dosya + rename); yarıda kesilen süreç dosyayı bozmaz.
 *  - progress.json (10+ MB) artık HER kararda değil, saatte bir yazılır; arada
 *    her olay _state/journal.jsonl'e tek satır eklenir. Açılışta: anlık görüntü
 *    + günlük yeniden oynatılır (idempotent).
 *  - progress.json bozuksa .bak'a, o da yoksa diskteki karar dosyalarına döner.
 */

import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
  copyFileSync,
} from "fs";
import { dirname, join } from "path";
import { emptyDaily, emptyProgress, rollDaily, yearFromTarih } from "../lib.mjs";

const sleepSync = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

/** Windows'ta hedef dosya o an okunuyorsa rename EPERM/EBUSY verebilir → kısa bekle, tekrar dene. */
export function atomicWriteFileSync(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  const tmp = `${path}.tmp-${process.pid}`;
  writeFileSync(tmp, data, "utf8");
  for (let i = 0; ; i++) {
    try {
      renameSync(tmp, path);
      return;
    } catch (e) {
      if (i >= 40 || !["EPERM", "EBUSY", "EACCES"].includes(e.code)) {
        try {
          unlinkSync(tmp);
        } catch {
          /* yoksay */
        }
        throw e;
      }
      sleepSync(50 + i * 25);
    }
  }
}

function readJsonSafe(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

export function readJsonl(path) {
  if (!existsSync(path)) return [];
  const out = [];
  for (const line of readFileSync(path, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try {
      out.push(JSON.parse(line));
    } catch {
      /* yarım satır (çökme) — atla */
    }
  }
  return out;
}

export function toJsonl(items) {
  return items.map((x) => JSON.stringify(x)).join("\n") + (items.length ? "\n" : "");
}

/**
 * Daire adından katman (tier) ve alan. Eski config'teki daire listeleri korunur
 * ki by-tier/by-alan ve site sınıflaması tutarlı kalsın.
 */
export function makeDaireClassifier(legacyTiers = []) {
  const hukukMap = new Map();
  for (const t of legacyTiers) {
    if (t.mode !== "unit-keyword") continue;
    for (const d of t.daireler || []) hukukMap.set(d, { tierId: t.id, alan: t.alan });
  }
  return function classify(daire) {
    const d = String(daire || "");
    const l = d.toLocaleLowerCase("tr-TR");
    if (l.includes("büyük genel kurul")) return { tierId: "yibk", alan: "yibk", priority: 0 };
    if (l.includes("hukuk genel kurulu")) return { tierId: "hgk", alan: "hgk", priority: 1 };
    if (l.includes("ceza genel kurulu")) return { tierId: "cgk", alan: "cgk", priority: 1 };
    if (l.includes("hukuk daireleri başkanlar kurulu")) return { tierId: "hdbk", alan: "hdbk", priority: 2 };
    if (l.includes("ceza daireleri başkanlar kurulu")) return { tierId: "cdbk", alan: "cdbk", priority: 2 };
    if (hukukMap.has(d)) return { ...hukukMap.get(d), priority: 5 };
    if (l.includes("hukuk dairesi")) return { tierId: "hukuk-daire", alan: "hukuk", priority: 5 };
    if (l.includes("ceza dairesi")) return { tierId: "ceza-daire", alan: "ceza", priority: 5 };
    return { tierId: "diger", alan: "diger", priority: 6 };
  };
}

export class Store {
  constructor(paths, log = () => {}) {
    this.paths = paths;
    this.log = log;
    this.journalPath = join(paths.state, "journal.jsonl");
    this.parkedPath = join(paths.state, "parked.jsonl");
    this.planPath = join(paths.state, "harvester-plan.json");
    this.progress = null;
    this.queue = [];
    this.parked = [];
    this.daily = null;
    this.plan = null;
    this.byYear = {};
    this.dirtyProgress = false;
  }

  /** Diskteki karar dosyalarından downloadedIds'i yeniden kurar (son çare). */
  rebuildFromDisk() {
    const ids = {};
    if (!existsSync(this.paths.decisions)) return ids;
    for (const ent of readdirSync(this.paths.decisions, { withFileTypes: true })) {
      if (!ent.isDirectory()) continue;
      const dir = join(this.paths.decisions, ent.name);
      for (const f of readdirSync(dir)) {
        if (!f.endsWith(".json")) continue;
        const id = f.slice(0, -5);
        let at = null;
        try {
          at = statSync(join(dir, f)).mtime.toISOString();
        } catch {
          /* yoksay */
        }
        ids[id] = { at, tierId: null, year: ent.name };
      }
    }
    return ids;
  }

  loadProgress() {
    let p = readJsonSafe(this.paths.progress);
    if (!p?.downloadedIds) {
      const bak = readJsonSafe(`${this.paths.progress}.bak`);
      if (bak?.downloadedIds) {
        this.log(`[depo] progress.json okunamadı → .bak kullanılıyor (${Object.keys(bak.downloadedIds).length})`);
        p = bak;
      } else if (existsSync(this.paths.progress) || existsSync(this.paths.decisions)) {
        const ids = this.rebuildFromDisk();
        this.log(`[depo] progress.json yok/bozuk → diskten yeniden kuruldu (${Object.keys(ids).length})`);
        p = { ...emptyProgress(), downloadedIds: ids };
        this.dirtyProgress = true;
      } else {
        p = emptyProgress();
      }
    }
    if (p.seenIds) delete p.seenIds;
    p.failedIds ??= {};
    p.stats ??= { searched: 0, queued: 0, downloaded: 0, failed: 0, pages: 0 };
    // Günlüğü oynat (anlık görüntüden sonraki olaylar)
    let replayed = 0;
    for (const ev of readJsonl(this.journalPath)) {
      replayed++;
      if (ev.t === "dl") {
        if (!p.downloadedIds[ev.id]) {
          p.downloadedIds[ev.id] = { at: ev.at, tierId: ev.tierId, year: ev.year };
          p.stats.downloaded++;
        }
        delete p.failedIds[ev.id];
      } else if (ev.t === "fail") {
        if (!p.failedIds[ev.id]) p.stats.failed++;
        p.failedIds[ev.id] = { at: ev.at, error: ev.error };
      }
    }
    if (replayed) {
      this.log(`[depo] günlükten ${replayed} olay yeniden oynatıldı`);
      this.dirtyProgress = true;
    }
    this.progress = p;
    this.byYear = {};
    for (const v of Object.values(p.downloadedIds)) {
      const y = v?.year || "unknown";
      this.byYear[y] = (this.byYear[y] || 0) + 1;
    }
  }

  load() {
    this.loadProgress();
    const p = this.progress;
    const seen = new Set();
    this.queue = [];
    for (const q of readJsonl(this.paths.queue)) {
      if (!q?.id || seen.has(q.id) || p.downloadedIds[q.id] || p.failedIds[q.id]) continue;
      seen.add(q.id);
      this.queue.push(q);
    }
    this.parked = readJsonl(this.parkedPath).filter((q) => q?.id && !p.downloadedIds[q.id]);
    this.daily = rollDaily(readJsonSafe(this.paths.daily) || emptyDaily());
    this.plan = readJsonSafe(this.planPath);
    return this;
  }

  get downloadedCount() {
    return Object.keys(this.progress.downloadedIds).length;
  }

  isKnown(id) {
    return !!(this.progress.downloadedIds[id] || this.progress.failedIds[id]);
  }

  appendJournal(ev) {
    appendFileSync(this.journalPath, JSON.stringify(ev) + "\n", "utf8");
  }

  /** Karar dosyası → günlük → index/pointer (bu sıra çökmede çift satırı önler). */
  recordDownload(record) {
    const year = yearFromTarih(record.tarih);
    const rel = `decisions/${year}/${record.id}.json`;
    atomicWriteFileSync(join(this.paths.base, rel), JSON.stringify(record, null, 2));
    const at = record.downloadedAt;
    this.appendJournal({ t: "dl", id: record.id, at, tierId: record.tierId, year });
    const pointer = {
      id: record.id,
      file: rel,
      kunye: record.kunye,
      alan: record.alan,
      tierId: record.tierId,
      tarih: record.tarih,
      daire: record.daire,
      keywords: record.keywords || [],
    };
    // Emsal etiketleri (hasat motoru v2): yayın hattı yalnız yararlı kararları seçebilsin.
    for (const k of ["yararli", "emsal", "benzerOf", "emsalSkoru", "hukukAlani"]) {
      if (record[k] !== undefined) pointer[k] = record[k];
    }
    const line = JSON.stringify(pointer);
    for (const dir of [join(this.paths.byAlan, record.alan || "diger"), join(this.paths.byTier, record.tierId || "diger")]) {
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, `${record.id}.json`), JSON.stringify(pointer, null, 2), "utf8");
    }
    appendFileSync(this.paths.index, line + "\n", "utf8");
    const p = this.progress;
    p.downloadedIds[record.id] = { at, tierId: record.tierId, year };
    delete p.failedIds[record.id];
    p.stats.downloaded++;
    this.byYear[year] = (this.byYear[year] || 0) + 1;
    this.daily.fullText++;
    this.dirtyProgress = true;
  }

  recordFailure(id, error) {
    const at = new Date().toISOString();
    this.appendJournal({ t: "fail", id, at, error });
    const p = this.progress;
    if (!p.failedIds[id]) p.stats.failed++;
    p.failedIds[id] = { at, error };
    this.dirtyProgress = true;
  }

  savePlan() {
    if (this.plan) atomicWriteFileSync(this.planPath, JSON.stringify(this.plan, null, 1));
  }

  /** Pencere envanteri: _state/envanter/<pencere>.jsonl — {i,d,e,k,t,m} satırları. */
  inventoryPath(unitId) {
    return join(this.paths.state, "envanter", `${String(unitId).replace(/[^0-9A-Za-z]+/g, "_")}.jsonl`);
  }

  loadInventory(unitId) {
    return readJsonl(this.inventoryPath(unitId));
  }

  /** Yeni künyeleri ekler (seen: pencerede zaten olan id'ler). Eklenen sayıyı döndürür. */
  appendInventory(unitId, items, marked, seen) {
    const lines = [];
    for (const it of items) {
      const id = String(it.id);
      if (seen.has(id)) continue;
      seen.add(id);
      lines.push(JSON.stringify({ i: id, d: it.daire, e: it.esas, k: it.karar, t: it.tarih, m: marked ? 1 : 0 }));
    }
    if (lines.length) {
      const p = this.inventoryPath(unitId);
      mkdirSync(dirname(p), { recursive: true });
      appendFileSync(p, lines.join("\n") + "\n", "utf8");
    }
    return lines.length;
  }

  /** Küçük dosyalar her seferinde; progress.json yalnız full=true iken. */
  checkpoint({ full = false } = {}) {
    atomicWriteFileSync(this.paths.queue, toJsonl(this.queue));
    atomicWriteFileSync(this.parkedPath, toJsonl(this.parked));
    atomicWriteFileSync(this.paths.daily, JSON.stringify(this.daily, null, 2));
    this.savePlan();
    if (full && this.dirtyProgress) {
      this.progress.lastRunAt = new Date().toISOString();
      if (existsSync(this.paths.progress)) {
        try {
          copyFileSync(this.paths.progress, `${this.paths.progress}.bak`);
        } catch {
          /* yedek alınamadı — yine de yaz */
        }
      }
      atomicWriteFileSync(this.paths.progress, JSON.stringify(this.progress, null, 2));
      // Anlık görüntü günlükteki her şeyi içeriyor → günlüğü sıfırla (tek yazar).
      writeFileSync(this.journalPath, "", "utf8");
      this.dirtyProgress = false;
    }
  }
}
