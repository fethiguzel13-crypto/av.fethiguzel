/**
 * İndirme öncesi seçim — kullanıcı politikası (2026-09-26):
 *   "Hep aynı türde kararlar inmesin, emsal olacak kararlar insin; önce 2026, sonra yıl yıl geri."
 *
 * Bir pencerenin envanteri (arama sonuçları: id, daire, esas, karar, tarih, işaret) tamamlanınca:
 *   1) Kurul kararları (YİBK, HGK, CGK, başkanlar kurulları) → hepsi.
 *   2) Hedefli kanal: emsal işaret kelimelerinden biri geçen (API "veya" araması) → hepsi.
 *   3) Örnek kanalı: kalan daire kararları, birimin ölçülen verimine göre oranlanır
 *      (p = verim × çarpan, [enAzOran, 1]); tek bir birim pencerenin `daireEnFazlaPay`
 *      kadarını aşamaz. Seçim günlere ve karar numaralarına eşit aralıkla yayılır;
 *      aynı gün art arda verilen seri kararlar tek tek değil seyrek örneklenir.
 * Yıl tamamlanınca verimi yüksek birimler için doldurma turları eklenir (selectFill).
 */

import { daireKey } from "./emsal.mjs";

const KURUL_RE = /kurul/i;

export function isKurul(daire) {
  return KURUL_RE.test(String(daire || ""));
}

function kararNo(k) {
  const m = /(\d+)\s*$/.exec(String(k || ""));
  return m ? Number(m[1]) : 0;
}

function tarihKey(t) {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(t || ""));
  return m ? `${m[3]}${m[2]}${m[1]}` : "0";
}

/** n öğeden q tanesini eşit aralıkla seçer (indeksler). */
export function spreadPick(n, q) {
  if (q >= n) return Array.from({ length: n }, (_, i) => i);
  const out = [];
  for (let i = 0; i < q; i++) out.push(Math.min(n - 1, Math.floor(((i + 0.5) * n) / q)));
  return [...new Set(out)];
}

/**
 * q hakkını günlere dağıtır (en büyük kalan yöntemi); hak gün sayısından azsa
 * günler eşit aralıkla seçilir. Gün içinde karar numarasına göre yayar.
 */
export function pickSpreadAcrossDays(items, q) {
  if (q <= 0 || !items.length) return [];
  if (q >= items.length) return items.slice();
  const byDay = new Map();
  for (const it of items) {
    const k = tarihKey(it.t);
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k).push(it);
  }
  const days = [...byDay.keys()].sort().reverse();
  for (const d of days) byDay.get(d).sort((a, b) => kararNo(a.k) - kararNo(b.k));
  const picked = [];
  if (q < days.length) {
    for (const di of spreadPick(days.length, q)) {
      const g = byDay.get(days[di]);
      picked.push(g[Math.floor(g.length / 2)]);
    }
    return picked;
  }
  const n = items.length;
  const alloc = days.map((d) => {
    const size = byDay.get(d).length;
    const exact = (q * size) / n;
    return { d, size, take: Math.max(1, Math.floor(exact)), rem: exact - Math.floor(exact) };
  });
  let used = alloc.reduce((s, a) => s + a.take, 0);
  for (const a of [...alloc].sort((x, y) => y.rem - x.rem)) {
    if (used >= q) break;
    if (a.take < a.size) {
      a.take++;
      used++;
    }
  }
  while (used > q) {
    const a = alloc.filter((x) => x.take > 1).sort((x, y) => y.take - x.take)[0];
    if (!a) break;
    a.take--;
    used--;
  }
  for (const a of alloc) {
    const g = byDay.get(a.d);
    for (const i of spreadPick(g.length, Math.min(a.take, g.length))) picked.push(g[i]);
  }
  return picked;
}

function clamp(x, lo, hi) {
  return Math.max(lo, Math.min(hi, x));
}

/**
 * Pencere seçimi (1. tur). items: [{i,d,e,k,t,m}], ctx: { known(id), estimate(daire, marked), policy }
 * Dönüş: [{ ...item, kanal }]
 */
export function selectWindow(items, ctx) {
  const pol = ctx.policy.ornekleme || {};
  const carpan = pol.verimCarpani ?? 1.2;
  const enAz = pol.enAzOran ?? 0.08;
  const pay = pol.daireEnFazlaPay ?? 0.25;
  const out = [];
  const perDaire = new Map();
  const kurullarHepsi = ctx.policy.kurullarHepsi !== false;
  for (const it of items) {
    if (kurullarHepsi && isKurul(it.d)) {
      if (!ctx.known(it.i)) out.push({ ...it, kanal: "kurul" });
      continue;
    }
    if (it.m) {
      if (!ctx.known(it.i)) out.push({ ...it, kanal: "hedefli" });
      continue;
    }
    const k = daireKey(it.d);
    if (!perDaire.has(k)) perDaire.set(k, { daire: it.d, all: [], known: 0 });
    const e = perDaire.get(k);
    if (ctx.known(it.i)) e.known++;
    else e.all.push(it);
  }
  const total = items.length;
  for (const e of perDaire.values()) {
    const n = e.all.length + e.known;
    if (!n) continue;
    const p = clamp(ctx.estimate(e.daire, false) * carpan, enAz, 1);
    let q = Math.max(1, Math.round(p * n));
    q = Math.min(q, Math.max(1, Math.ceil(pay * total)));
    q = Math.max(0, q - e.known);
    for (const it of pickSpreadAcrossDays(e.all, q)) out.push({ ...it, kanal: "ornek" });
  }
  return out;
}

/**
 * Yıl doldurma turu: verimi eşik üstündeki birimlerden seçilmemiş işaretsiz
 * kararların bir kısmı daha (yaklaşık ikiye katlama). ctx.yearCounts(daire) → {n,u}
 */
export function selectFill(items, ctx) {
  const pol = ctx.policy.doldurma || {};
  const esik = pol.esik ?? 0.55;
  const enAzAnaliz = pol.enAzAnaliz ?? 20;
  const perDaire = new Map();
  for (const it of items) {
    if (isKurul(it.d) || it.m) continue;
    const k = daireKey(it.d);
    if (!perDaire.has(k)) perDaire.set(k, { daire: it.d, rest: [], known: 0 });
    const e = perDaire.get(k);
    if (ctx.known(it.i)) e.known++;
    else e.rest.push(it);
  }
  const out = [];
  for (const e of perDaire.values()) {
    if (!e.rest.length) continue;
    const c = ctx.yearCounts(e.daire);
    if (c.n < enAzAnaliz || c.u / c.n < esik) continue;
    const q = Math.min(e.rest.length, Math.max(25, e.known));
    for (const it of pickSpreadAcrossDays(e.rest, q)) out.push({ ...it, kanal: "doldurma" });
  }
  return out;
}
