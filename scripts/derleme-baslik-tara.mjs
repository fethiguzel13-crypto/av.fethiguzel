/**
 * Derleme çıktısındaki tüm önceden üretilmiş sayfaların `<title>`'ında çift marka ekini sayar (Aylık plan G10, S7).
 * Örneklemli taramanın (seo-tara) göremediği sınıfı tam sayar. Yalnız okur; dosya yazmaz.
 *   npm run build && node scripts/derleme-baslik-tara.mjs     # çift ek varsa çıkış kodu 1
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const KOK = '.next/server/app';
const MARKA = /Av\. Fethi Güzel/g;

if (!existsSync(KOK)) {
  console.error(`${KOK} yok; önce derleme gerekir (npm run build).`);
  process.exit(2);
}

let toplam = 0;
const gruplar = new Map();
(function gez(dizin) {
  for (const o of readdirSync(dizin, { withFileTypes: true })) {
    const yol = join(dizin, o.name);
    if (o.isDirectory()) gez(yol);
    else if (o.name.endsWith('.html')) {
      toplam++;
      const m = /<title>([^<]*)<\/title>/.exec(readFileSync(yol, 'utf8'));
      if (!m || (m[1].match(MARKA) || []).length < 2) continue;
      const parca = relative(KOK, yol).split(sep);
      const grup = parca.length > 1 ? parca.slice(0, Math.min(2, parca.length - 1)).join('/') : parca[0];
      const g = gruplar.get(grup) || { sayi: 0, ornek: m[1] };
      g.sayi++;
      gruplar.set(grup, g);
    }
  }
})(KOK);

const cift = [...gruplar.values()].reduce((t, g) => t + g.sayi, 0);
console.log(`Derlenmiş sayfa: ${toplam} · başlıkta çift marka eki: ${cift}`);
for (const [grup, g] of [...gruplar].sort((a, b) => b[1].sayi - a[1].sayi)) {
  console.log(`${String(g.sayi).padStart(6)}  ${grup}  |  ${g.ornek.slice(0, 100)}`);
}
process.exit(cift ? 1 : 0);
