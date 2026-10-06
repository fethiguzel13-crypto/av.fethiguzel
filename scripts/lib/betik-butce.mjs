/**
 * İlk yük betik bütçesi (Aylık plan G13 adım 6). Anahtar sayfaların derleme HTML'inde ilk yükte inen Next betiklerinin
 * toplam boyutu tabana (`scripts/betik-butce-taban.json`) bağlanır. Taban lint cırcırı gibi yalnız düşer: payı aşan artış
 * kapıyı kırar, düşüş tabanı indirir. Yalnız saf işlevler; dosya okuma `scripts/derleme-butce-tara.mjs`'te.
 */

/** Derleme HTML'indeki ilk yük betikleri: `/_next/` parçaları, tekrarsız; `noModule` dolgusu modern tarayıcıya inmez. */
export function ilkYukBetikleri(html) {
  const out = [];
  for (const m of html.matchAll(/<script\b([^>]*)>/gi)) {
    const nitelik = m[1];
    const src = nitelik.match(/\bsrc="([^"]+)"/i)?.[1];
    if (!src || !src.startsWith('/_next/') || /\bnomodule\b/i.test(nitelik)) continue;
    if (!out.includes(src)) out.push(src);
  }
  return out;
}

/**
 * Tabanla karşılaştırma. `pay` oransal hoşgörü (0,02 → %2): aynı kodun derlemeleri arasındaki küçük oynamayı kırmaz,
 * ama taban hiç yükselmediği için artışlar birikemez.
 *
 * @param {Record<string, number>} taban  sayfa → KB
 * @param {Record<string, number>} simdi  sayfa → KB
 * @param {number} pay
 */
export function butceKarsilastir(taban, simdi, pay) {
  const asan = [];
  const dusen = [];
  const eksik = [];
  const yeniTaban = { ...taban };
  for (const [sayfa, t] of Object.entries(taban)) {
    const s = simdi[sayfa];
    if (s === undefined) {
      eksik.push(sayfa);
      continue;
    }
    if (s > t * (1 + pay)) asan.push({ sayfa, taban: t, simdi: s });
    else if (s < t) {
      dusen.push({ sayfa, taban: t, simdi: s });
      yeniTaban[sayfa] = s;
    }
  }
  return { asan, dusen, eksik, yeniTaban };
}
