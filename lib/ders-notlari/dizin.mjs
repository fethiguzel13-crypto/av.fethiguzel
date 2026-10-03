/**
 * Ders notlarının dizin kararı — sayfa robots'u, fakülte sayfası ve site haritası için tek kaynak (Aylık plan G11).
 *
 * 2026-10-03 ölçümü: kalıp parmak izinden geçen 6.552 not, 26 ders kökünün 3 sürümünün (1. dönem, 2. dönem,
 * yıllık) 84 üniversiteye ad değiştirilerek çoğaltılmış hâlidir; üniversite adı çıkarıldıktan sonra da metin
 * büyük ölçüde aynıdır. Hepsi dizinde kalırsa Google'ın ölçeklenmiş içerik ölçütüne girer. Her kök için yalnız
 * temsilci not (yıllık sürüm) dizine açıktır; diğerleri okunur kalır ama noindex olur. Temsilciler
 * `dizin-kanonik.json`'da sabittir (üretici: scripts/ders-notlari-kanonik.mjs).
 */
import { auditLectureNote } from '../content-quality.mjs';

const SURUM_EKI = /-(yillik|donem-\d+)$/;

/** @param {{ courseCode: string, variantOf?: string }} note */
export function dersKoku(note) {
  return note.variantOf || String(note.courseCode).replace(SURUM_EKI, '');
}

/** Temsilci seçimi için notun küçük özeti (betik 11 bin notu bellekte tutmadan seçer). */
export function notOzeti(note) {
  return {
    uniSlug: note.uniSlug,
    courseCode: note.courseCode,
    kok: dersKoku(note),
    kaynak: (note.sources || []).filter((s) => /^https?:\/\//.test(s?.url || '')).length,
    publishable: auditLectureNote(note).publishable,
  };
}

/**
 * Kök başına temsilci: yayınlanabilir yıllık sürümler arasından (1) adresli kaynağı en çok olan,
 * (2) üniversite önceliği en yüksek (küçük sayı), (3) alfabetik ilk slug.
 *
 * @param {ReturnType<typeof notOzeti>[]} ozetler
 * @param {{ slug: string, priority?: number }[]} universiteler
 * @returns {Record<string, { uni: string, ders: string }>}
 */
export function temsilcileriBelirle(ozetler, universiteler) {
  const oncelik = new Map(universiteler.map((u) => [u.slug, u.priority ?? 99]));
  const sira = (a, b) =>
    b.kaynak - a.kaynak ||
    (oncelik.get(a.uniSlug) ?? 99) - (oncelik.get(b.uniSlug) ?? 99) ||
    a.uniSlug.localeCompare(b.uniSlug);
  const enIyi = new Map();
  for (const o of ozetler) {
    if (!o.publishable || o.courseCode !== `${o.kok}-yillik`) continue;
    const mevcut = enIyi.get(o.kok);
    if (!mevcut || sira(o, mevcut) < 0) enIyi.set(o.kok, o);
  }
  const sonuc = {};
  for (const kok of [...enIyi.keys()].sort()) {
    const o = enIyi.get(kok);
    sonuc[kok] = { uni: o.uniSlug, ders: o.courseCode };
  }
  return sonuc;
}

/**
 * @param {object} note
 * @param {{ dersler: Record<string, { uni: string, ders: string }> }} kanonik
 * @returns {{ index: boolean, neden: 'kalip' | 'kopya' | 'temsilci' }}
 */
export function notDizinKarari(note, kanonik) {
  if (!auditLectureNote(note).publishable) return { index: false, neden: 'kalip' };
  const t = kanonik.dersler[dersKoku(note)];
  if (t && t.uni === note.uniSlug && t.ders === note.courseCode) return { index: true, neden: 'temsilci' };
  return { index: false, neden: 'kopya' };
}

/** Fakülte sayfası yalnız temsilci not barındırıyorsa dizine açıktır (84 sayfa da ad değiştirmeli). */
export function hubDizinde(uniSlug, kanonik) {
  return Object.values(kanonik.dersler).some((t) => t.uni === uniSlug);
}
