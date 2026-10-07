/**
 * Yayın süzgeci (G14): web indeksine ve mobil arşive yalnız emsal nitelikli ve benzersiz kararlar girer.
 *
 * Etiketin kaynağı hasat motorunun emsal defteridir (`data/yargi-kararlari/_state/benzerlik.jsonl`,
 * `EmsalBook`): `u` yararlı (emsal ve hiçbir karara benzemez), `e` emsal, `dp` benzediği karar.
 * `index.jsonl` satırlarındaki `yararli` alanı yalnız motor v2'nin indirdiği kararlarda vardır, bu yüzden kullanılmaz.
 * İçtihadı birleştirme kararları bağlayıcı olduğundan etiketten bağımsız girer.
 */

/** Defter satırlarını kimliğe göre eşler; bozuk ve kimliksiz satır atlanır, ilk kayıt geçerlidir (EmsalBook.load ile aynı). */
export function defteriOku(satirlar) {
  const defter = new Map();
  for (const satir of satirlar) {
    if (!satir) continue;
    let r;
    try {
      r = JSON.parse(satir);
    } catch {
      continue;
    }
    if (r?.i === undefined || r.i === null) continue;
    const id = String(r.i);
    if (defter.has(id)) continue;
    defter.set(id, { u: !!r.u, e: !!r.e, dp: r.dp ? String(r.dp) : null });
  }
  return defter;
}

function ibkMi(satir) {
  if (satir.tierId) return String(satir.tierId) === 'yibk';
  return `${satir.daire || ''} ${satir.kunye || ''}`.toLocaleLowerCase('tr-TR').includes('büyük genel');
}

/** `index.jsonl` satırı yayına girer mi? */
export function yayinaGirer(satir, defter) {
  if (ibkMi(satir)) return true;
  return defter.get(String(satir.id))?.u === true;
}
