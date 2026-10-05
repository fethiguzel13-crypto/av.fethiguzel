import dizin from './dizin.json';
import { ilgiliIcerik } from './dizin.mjs';

/**
 * İçerik sayfasının "aynı maddelere değinen içerik" listesi (Aylık plan G12 adım 8). `haric`: sayfanın kendi
 * listelerinde zaten gösterdiği adresler.
 */
export function sayfaIlgiliIcerik(yol: string, haric: string[] = []) {
  return ilgiliIcerik(yol, dizin, { haric });
}
