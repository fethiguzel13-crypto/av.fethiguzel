/**
 * Lighthouse tekrarlı ölçüm (Aylık plan G13 adım 7). Tek koşuda TBT, aynı makinede hasat motoru çalışırken 4 kata kadar
 * oynadı (ders notu 774–3.175 ms); sayfa başına birkaç koşu alınır ve her ölçü ayrı ayrı ortancayla özetlenir.
 * Yalnız saf işlevler; Lighthouse çağrısı `scripts/lighthouse-olc.mjs`'te.
 */

const MS_OLCULERI = ['lcpMs', 'fcpMs', 'tbtMs', 'siMs', 'aktarimKb'];

export function ortanca(dizi) {
  const s = [...dizi].sort((a, b) => a - b);
  const o = Math.floor(s.length / 2);
  return s.length % 2 ? s[o] : (s[o - 1] + s[o]) / 2;
}

/**
 * Başarılı koşuları tek kayda indirir: puanlar ve ölçüler ayrı ayrı ortanca; TBT'nin en düşük ve en yüksek değeri
 * oynaklığı göstermek için saklanır. Başarısız denetim listeleri performans puanı ortancaya en yakın koşudan alınır.
 */
export function kosulariOzetle(kosular) {
  const puanOrt = ortanca(kosular.map((k) => k.puan.performance));
  const temsilci = kosular.reduce((en, k) =>
    Math.abs(k.puan.performance - puanOrt) < Math.abs(en.puan.performance - puanOrt) ? k : en
  );
  const tbt = kosular.map((k) => k.tbtMs);
  return {
    ...temsilci,
    puan: Object.fromEntries(Object.keys(temsilci.puan).map((p) => [p, Math.round(ortanca(kosular.map((k) => k.puan[p])))])),
    ...Object.fromEntries(MS_OLCULERI.map((m) => [m, Math.round(ortanca(kosular.map((k) => k[m])))])),
    cls: ortanca(kosular.map((k) => k.cls)),
    tbtAralik: [Math.min(...tbt), Math.max(...tbt)],
    kosu: kosular.length,
  };
}

/** `tekrar` başarılı koşu toplanana ya da `azamiDeneme` dolana dek `olc()` çağrılır; hatalı koşular ayrıca döner. */
export function kosulariTopla(olc, tekrar, azamiDeneme) {
  const basarili = [];
  const hatalar = [];
  for (let d = 0; d < azamiDeneme && basarili.length < tekrar; d++) {
    const r = olc();
    if (r.puan) basarili.push(r);
    else hatalar.push(r.hata);
  }
  return { basarili, hatalar };
}
