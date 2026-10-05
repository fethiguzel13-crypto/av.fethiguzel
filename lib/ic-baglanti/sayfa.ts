import sikisik from './dizin.json';
import { dizinAc, ilgiliIcerik } from './dizin.mjs';

const DIZIN = dizinAc(sikisik);

/**
 * İçerik sayfasının "aynı maddelere değinen içerik" listesi (Aylık plan G12 adım 8). `haric`: sayfanın kendi
 * listelerinde zaten gösterdiği adresler.
 */
export function sayfaIlgiliIcerik(yol: string, haric: string[] = []) {
  return ilgiliIcerik(yol, DIZIN, { haric });
}
