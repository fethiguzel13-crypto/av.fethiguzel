/**
 * Emsal analizi — her inen kararı iki soruyla etiketler:
 *   1) Emsal niteliği var mı?  → core-100k/score.mjs kalite puanı (gerekçe uzunluğu,
 *      ilke ifadeleri, atıf yoğunluğu, formül cümlesi cezası). Kurul kararları için eşik düşük.
 *   2) Daha önce inen bir karara benziyor mu? → 64 bit SimHash (kelime üçlüleri) ve
 *      aynı birim içinde Hamming uzaklığı. 9 bloklu güvercin yuvası indeksi, eşik ≤ 8
 *      bitte her benzer çifti garanti bulur (≈ Jaccard 0,85; core-100k eşiğiyle aynı).
 *
 * "Yararlı" karar = emsal nitelikli VE benzeri yok. Hedef sayacı (ör. 600.000) bunu sayar;
 * birim bazında yararlı oranı (verim) indirme öncesi seçimde örnekleme oranını belirler.
 */

import { scoreDecision } from "../core-100k/score.mjs";

const BLOCKS = [
  [0, 7], [7, 7], [14, 7], [21, 7], [28, 7], [35, 7], [42, 7], [49, 7], [56, 8],
];

function fnv1a(str, seed) {
  let h = seed >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function popcount32(x) {
  x -= (x >>> 1) & 0x55555555;
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
  x = (x + (x >>> 4)) & 0x0f0f0f0f;
  return Math.imul(x, 0x01010101) >>> 24;
}

export function hamming64(aHi, aLo, bHi, bLo) {
  return popcount32((aHi ^ bHi) >>> 0) + popcount32((aLo ^ bLo) >>> 0);
}

function blockOf(hi, lo, start, len) {
  const mask = (1 << len) - 1;
  if (start + len <= 32) return (lo >>> start) & mask;
  if (start >= 32) return (hi >>> (start - 32)) & mask;
  return ((lo >>> start) | (hi << (32 - start))) & mask;
}

export function tokenize(text, maxTokens = 6000) {
  const out = [];
  const re = /[a-zçğıöşüâîû]+/g;
  const s = String(text || "").toLocaleLowerCase("tr-TR");
  let m;
  while ((m = re.exec(s)) && out.length < maxTokens) {
    if (m[0].length >= 2) out.push(m[0]);
  }
  return out;
}

/** 64 bit SimHash → [hi, lo] (ikisi de uint32). Kelime üçlüleri küme olarak sayılır. */
export function simhash64(text) {
  const toks = tokenize(text);
  const v = new Int32Array(64);
  const seen = new Set();
  for (let i = 0; i + 2 < toks.length; i++) {
    const sh = `${toks[i]} ${toks[i + 1]} ${toks[i + 2]}`;
    if (seen.has(sh)) continue;
    seen.add(sh);
    const lo = fnv1a(sh, 0x811c9dc5);
    const hi = fnv1a(sh, 0x5bd1e995);
    for (let b = 0; b < 32; b++) {
      v[b] += (lo >>> b) & 1 ? 1 : -1;
      v[32 + b] += (hi >>> b) & 1 ? 1 : -1;
    }
  }
  let lo = 0;
  let hi = 0;
  for (let b = 0; b < 32; b++) {
    if (v[b] > 0) lo |= 1 << b;
    if (v[32 + b] > 0) hi |= 1 << b;
  }
  return [hi >>> 0, lo >>> 0, seen.size];
}

/** Birim adını benzerlik grubuna indirger (kurullar kendi grubunda). */
export function daireKey(daire) {
  return String(daire || "?").toLocaleLowerCase("tr-TR").replace(/\s+/g, " ").trim();
}

/** Birim içi yakın-kopya indeksi (yalnız benzersiz kararlar eklenir). */
export class SimilarityIndex {
  constructor(threshold = 8) {
    this.threshold = threshold;
    this.ids = [];
    this.hi = [];
    this.lo = [];
    this.tables = new Map();
    this.stamp = new Int32Array(1024);
    this.gen = 0;
  }

  get size() {
    return this.ids.length;
  }

  add(key, id, hi, lo) {
    const idx = this.ids.length;
    this.ids.push(id);
    this.hi.push(hi);
    this.lo.push(lo);
    for (let b = 0; b < BLOCKS.length; b++) {
      const k = `${key}|${b}|${blockOf(hi, lo, BLOCKS[b][0], BLOCKS[b][1])}`;
      let arr = this.tables.get(k);
      if (!arr) this.tables.set(k, (arr = []));
      arr.push(idx);
    }
  }

  /** Eşik içindeki en yakın kaydı döndürür (yoksa null). */
  findNear(key, hi, lo) {
    if (this.stamp.length < this.ids.length) {
      const next = new Int32Array(Math.max(this.ids.length * 2, 1024));
      next.set(this.stamp);
      this.stamp = next;
    }
    const g = ++this.gen;
    let best = null;
    for (let b = 0; b < BLOCKS.length; b++) {
      const arr = this.tables.get(`${key}|${b}|${blockOf(hi, lo, BLOCKS[b][0], BLOCKS[b][1])}`);
      if (!arr) continue;
      for (const idx of arr) {
        if (this.stamp[idx] === g) continue;
        this.stamp[idx] = g;
        const d = hamming64(hi, lo, this.hi[idx], this.lo[idx]);
        if (d <= this.threshold && (!best || d < best.dist)) {
          best = { id: this.ids[idx], dist: d };
          if (d === 0) return best;
        }
      }
    }
    return best;
  }
}

export const EMSAL_DEFAULTS = { kaliteEsigi: 0.45, kurulKaliteEsigi: 0.25, hammingEsigi: 8 };

/**
 * Kararı puanlar ve (benzersizse) indekse ekler.
 * Dönüş: { hi, lo, dupOf, dist, quality, emsal, useful, domain, group, kurul }
 */
export function analyzeDecision(rec, index, opts = {}) {
  const o = { ...EMSAL_DEFAULTS, ...opts };
  const s = scoreDecision(rec, {});
  const kurul = /yibk|hgk|cgk|kurul/.test(s.group);
  const emsal = kurul
    ? s.qualityScore >= o.kurulKaliteEsigi
    : s.qualityScore >= o.kaliteEsigi && !s.signals.shortFormula;
  const [hi, lo, shingles] = simhash64(rec.text || "");
  const key = daireKey(rec.daire);
  // Çok kısa metinde parmak izi güvenilmez; yalnız birebir aynı izi kopya say.
  const near = shingles >= 8 ? index.findNear(key, hi, lo) : null;
  const dupOf = near && (shingles >= 30 || near.dist === 0) ? near.id : null;
  if (!dupOf) index.add(key, String(rec.id), hi, lo);
  return {
    hi,
    lo,
    dupOf,
    dist: dupOf ? near.dist : null,
    quality: s.qualityScore,
    emsal,
    useful: emsal && !dupOf,
    domain: s.domain,
    group: s.group,
    kurul,
  };
}

/** Emsal işaret kelimeleri metinde (kelime başı olarak) geçiyor mu? API "veya" aramasının yerel karşılığı. */
export function markerRegex(words = []) {
  if (!words.length) return null;
  const esc = words.map((w) => w.toLocaleLowerCase("tr-TR").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(`(^|[^a-zçğıöşüâîû])(${esc.join("|")})`, "u");
}

export function isMarked(text, re) {
  return !!re && re.test(String(text || "").toLocaleLowerCase("tr-TR"));
}

/**
 * Birim × yıl verim istatistiği (yararlı / analiz edilen), işaretli ve işaretsiz
 * kararlar ayrı tutulur (örnekleme işaretsizlerin verimine bakar).
 * Daire görev alanları yıllar içinde değiştiğinden (2021 yeniden yapılanması) yalnız
 * yakın yıllar sayılır; önsel ortalama 0,5.
 */
export class YieldStats {
  constructor() {
    this.d = {};
    this.totals = { n: 0, useful: 0, dup: 0, weak: 0 };
  }

  record(daire, year, a, marked = false) {
    const k = daireKey(daire) + (marked ? "|m" : "");
    const e = (this.d[k] ||= { n: 0, u: 0, y: {} });
    const y = (e.y[year] ||= { n: 0, u: 0 });
    e.n++;
    y.n++;
    if (a.useful) {
      e.u++;
      y.u++;
    }
    this.totals.n++;
    if (a.useful) this.totals.useful++;
    else if (a.dupOf) this.totals.dup++;
    else this.totals.weak++;
  }

  estimate(daire, year, marked = false, prior = { u: 1.5, n: 3 }) {
    const e = this.d[daireKey(daire) + (marked ? "|m" : "")];
    let n = prior.n;
    let u = prior.u;
    if (e) {
      for (const [dy, wt] of [[0, 1], [1, 0.7], [-1, 0.7], [2, 0.4], [-2, 0.4]]) {
        const c = e.y[Number(year) + dy];
        if (c) {
          n += c.n * wt;
          u += c.u * wt;
        }
      }
    }
    return u / n;
  }

  yearCounts(daire, year, marked = false) {
    return this.d[daireKey(daire) + (marked ? "|m" : "")]?.y?.[year] || { n: 0, u: 0 };
  }
}

/**
 * Emsal defteri: benzerlik indeksi + verim istatistiği + kalıcı kayıt
 * (_state/benzerlik.jsonl, karar başına bir satır). Açılışta satırlardan yeniden kurulur.
 */
export class EmsalBook {
  constructor(path, opts = {}, io = {}) {
    this.path = path;
    this.opts = { ...EMSAL_DEFAULTS, ...opts };
    this.io = io; // { readLines(path) → string[], appendLine(path, line) }
    this.index = new SimilarityIndex(this.opts.hammingEsigi);
    this.stats = new YieldStats();
    this.analyzed = new Set();
    this.markRe = markerRegex(opts.hedefliKelimeler || []);
  }

  load() {
    for (const line of this.io.readLines(this.path)) {
      let r;
      try {
        r = JSON.parse(line);
      } catch {
        continue;
      }
      if (!r?.i || this.analyzed.has(r.i)) continue;
      this.analyzed.add(r.i);
      if (!r.dp) this.index.add(daireKey(r.d), r.i, r.h >>> 0, r.l >>> 0);
      this.stats.record(r.d, r.y, { useful: !!r.u, dupOf: r.dp || null }, !!r.m);
    }
    return this;
  }

  /** Kararı analiz eder, deftere yazar; sonuç alanları kayda eklenecek biçimde döner. */
  analyze(rec, year) {
    const id = String(rec.id);
    const a = analyzeDecision(rec, this.index, this.opts);
    const marked = isMarked(rec.text, this.markRe);
    if (!this.analyzed.has(id)) {
      this.analyzed.add(id);
      this.stats.record(rec.daire, year, a, marked);
      this.io.appendLine(
        this.path,
        JSON.stringify({
          i: id,
          d: rec.daire,
          y: Number(year) || null,
          h: a.hi,
          l: a.lo,
          q: a.quality,
          e: a.emsal ? 1 : 0,
          u: a.useful ? 1 : 0,
          dp: a.dupOf,
          m: marked ? 1 : 0,
          dm: a.domain,
        })
      );
    }
    return { ...a, marked };
  }
}
