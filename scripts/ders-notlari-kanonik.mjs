/**
 * Ders notu temsilci listesi — lib/ders-notlari/dizin-kanonik.json (Aylık plan G11).
 *
 *   node scripts/ders-notlari-kanonik.mjs                 # listeyi yazar
 *   node scripts/ders-notlari-kanonik.mjs --cikti <yol>   # başka yola yazar (deneme)
 *
 * Her ders kökü için dizine açık tek not seçilir (ölçüt: lib/ders-notlari/dizin.mjs → temsilcileriBelirle).
 * Not dosyaları değiştirilmez. Bir not elle yeniden yazılıp kanonik yapılacaksa (G19) bu dosyadaki girdi
 * elle değiştirilir; betik yeniden koşulursa ölçüte göre yeniden seçer.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { notOzeti, temsilcileriBelirle } from '../lib/ders-notlari/dizin.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const gen = join(root, 'lib', 'ders-notlari', 'generated');
const i = process.argv.indexOf('--cikti');
const cikti = i > 0 ? resolve(process.argv[i + 1]) : join(root, 'lib', 'ders-notlari', 'dizin-kanonik.json');

const idx = JSON.parse(readFileSync(join(gen, 'index.json'), 'utf8'));
const notlarDizini = join(gen, 'notes');
const ozetler = [];
for (const f of readdirSync(notlarDizini)) {
  if (!f.endsWith('.json')) continue;
  ozetler.push(notOzeti(JSON.parse(readFileSync(join(notlarDizini, f), 'utf8'))));
}

const dersler = temsilcileriBelirle(ozetler, idx.universities);
const kanonik = {
  aciklama:
    'Her ders kökü için dizine açık tek not (G11). Diğer notlar noindex; fakülte sayfası yalnız temsilci barındırıyorsa dizinde.',
  olcut: 'yayınlanabilir yıllık sürüm; adresli kaynak sayısı > üniversite önceliği > slug',
  sayim: {
    notDosyasi: ozetler.length,
    yayinlanabilir: ozetler.filter((o) => o.publishable).length,
    temsilci: Object.keys(dersler).length,
  },
  dersler,
};
writeFileSync(cikti, `${JSON.stringify(kanonik, null, 2)}\n`, 'utf8');
console.log(`[ders-notlari-kanonik] ${kanonik.sayim.temsilci} temsilci / ${kanonik.sayim.yayinlanabilir} yayınlanabilir not → ${cikti}`);
