/**
 * Lighthouse tekrarlı ölçüm (Aylık plan G13 adım 7). Tek koşuda TBT, aynı makinede hasat motoru çalışırken 4 kata kadar
 * oynadı (ders notu 774–3.175 ms); sayfa başına birkaç koşu alınır ve her ölçü ayrı ayrı ortancayla özetlenir.
 * Yalnız saf işlevler; Lighthouse çağrısı `scripts/lighthouse-olc.mjs`'te.
 */

const MS_OLCULERI = ['lcpMs', 'fcpMs', 'tbtMs', 'siMs', 'anaIsMs', 'aktarimKb'];

export function ortanca(dizi) {
  const s = [...dizi].sort((a, b) => a - b);
  const o = Math.floor(s.length / 2);
  return s.length % 2 ? s[o] : (s[o - 1] + s[o]) / 2;
}

/**
 * Başarılı koşuları tek kayda indirir: puanlar ve ölçüler ayrı ayrı ortanca; TBT'nin ve toplam ana iş parçacığı
 * süresinin en düşük ve en yüksek değeri oynaklığı göstermek için saklanır. Başarısız denetim listeleri performans
 * puanı ortancaya en yakın koşudan alınır.
 */
export function kosulariOzetle(kosular) {
  const puanOrt = ortanca(kosular.map((k) => k.puan.performance));
  const temsilci = kosular.reduce((en, k) =>
    Math.abs(k.puan.performance - puanOrt) < Math.abs(en.puan.performance - puanOrt) ? k : en
  );
  const tbt = kosular.map((k) => k.tbtMs);
  const anaIs = kosular.map((k) => k.anaIsMs);
  return {
    ...temsilci,
    puan: Object.fromEntries(Object.keys(temsilci.puan).map((p) => [p, Math.round(ortanca(kosular.map((k) => k.puan[p])))])),
    ...Object.fromEntries(MS_OLCULERI.map((m) => [m, Math.round(ortanca(kosular.map((k) => k[m])))])),
    cls: ortanca(kosular.map((k) => k.cls)),
    tbtAralik: [Math.min(...tbt), Math.max(...tbt)],
    anaIsAralik: [Math.min(...anaIs), Math.max(...anaIs)],
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

/**
 * İki sunucu (önce ve sonra derlemesi) aynı sayfada A, B, A, B sırasıyla ölçülür; makine yükündeki dalgalanma iki tarafa
 * eşit dağılır. Her taraf `tekrar` başarılı koşuya ya da `azamiDeneme`ye ulaşınca durur.
 */
export function donusumluTopla(olcA, olcB, tekrar, azamiDeneme) {
  const taraf = () => ({ basarili: [], hatalar: [], deneme: 0 });
  const a = taraf();
  const b = taraf();
  const surer = (t) => t.basarili.length < tekrar && t.deneme < azamiDeneme;
  const bir = (t, olc) => {
    t.deneme++;
    const r = olc();
    if (r.puan) t.basarili.push(r);
    else t.hatalar.push(r.hata);
  };
  while (surer(a) || surer(b)) {
    if (surer(a)) bir(a, olcA);
    if (surer(b)) bir(b, olcB);
  }
  return { a: { basarili: a.basarili, hatalar: a.hatalar }, b: { basarili: b.basarili, hatalar: b.hatalar } };
}

/** Küçük olan iyi bir ölçüde (TBT, LCP) gerileme: sonranın en iyi koşusu öncenin en kötü koşusundan da kötü. */
export function gerilemeVar(once, sonra) {
  return Math.min(...sonra) > Math.max(...once);
}
