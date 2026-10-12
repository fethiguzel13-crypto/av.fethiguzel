/**
 * Derleme çıktısındaki dizine açık bütün sayfaların paylaşım (Open Graph / Twitter) etiketlerini denetler (Aylık plan G20).
 * Sayfanın gösterdiği site içi görselin derlemede üretilip üretilmediğine de bakar. Yalnız okur; `--json <yol>` verilirse
 * özeti o dosyaya yazar.
 *   npm run build && node scripts/derleme-og-tara.mjs     # eksik ya da kırık görsel varsa çıkış kodu 1
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { dizinde, paylasimDenetle, siteIciYol, yonlendirmeMi } from '../lib/paylasim-denetim.mjs';

const KOK = '.next/server/app';

if (!existsSync(KOK)) {
  console.error(`${KOK} yok; önce derleme gerekir (npm run build).`);
  process.exit(2);
}

/** `/og/kanun/tbk` → derlemenin yazdığı gövde dosyası ya da `public/` altındaki statik dosya. */
function gorselVarMi(yol) {
  if (existsSync(join('public', yol))) return true;
  const temel = join(KOK, ...yol.split('/').filter(Boolean));
  return existsSync(`${temel}.body`) || existsSync(temel);
}

let toplam = 0;
let dizinAcik = 0;
const eksikSayisi = new Map();
const gruplar = new Map();
const gorselKumesi = new Map();
(function gez(dizin) {
  for (const o of readdirSync(dizin, { withFileTypes: true })) {
    const yol = join(dizin, o.name);
    if (o.isDirectory()) gez(yol);
    else if (o.name.endsWith('.html')) {
      toplam++;
      const html = readFileSync(yol, 'utf8');
      const meta = yol.replace(/\.html$/, '.meta');
      if (yonlendirmeMi(existsSync(meta) ? readFileSync(meta, 'utf8') : null)) continue;
      if (!dizinde(html) || /^_(not-found|global-error)/.test(relative(KOK, yol))) continue;
      dizinAcik++;
      const { eksik, gorseller } = paylasimDenetle(html);
      for (const g of gorseller) {
        const ic = siteIciYol(g);
        if (ic && !gorselKumesi.has(ic)) gorselKumesi.set(ic, gorselVarMi(ic));
        if (ic && !gorselKumesi.get(ic)) eksik.push(`kırık görsel ${ic}`);
      }
      if (!eksik.length) continue;
      for (const e of eksik) eksikSayisi.set(e.startsWith('kırık') ? 'kırık görsel' : e, (eksikSayisi.get(e.startsWith('kırık') ? 'kırık görsel' : e) || 0) + 1);
      const parca = relative(KOK, yol).split(sep);
      const grup = parca.length > 1 ? parca.slice(0, Math.min(2, parca.length - 1)).join('/') : parca[0];
      const g = gruplar.get(grup) || { sayi: 0, ornek: eksik.join(', ') };
      g.sayi++;
      gruplar.set(grup, g);
    }
  }
})(KOK);

const eksikli = [...gruplar.values()].reduce((t, g) => t + g.sayi, 0);
const ozet = {
  derlenmis: toplam,
  dizineAcik: dizinAcik,
  eksikli,
  ayriGorsel: gorselKumesi.size,
  kirikGorsel: [...gorselKumesi.values()].filter((v) => !v).length,
  eksikTurleri: Object.fromEntries([...eksikSayisi].sort((a, b) => b[1] - a[1])),
  gruplar: Object.fromEntries([...gruplar].sort((a, b) => b[1].sayi - a[1].sayi)),
};
console.log(
  `Derlenmiş sayfa: ${toplam} · dizine açık: ${dizinAcik} · paylaşım etiketi eksik: ${eksikli} · ayrı görsel: ${ozet.ayriGorsel} · kırık görsel: ${ozet.kirikGorsel}`,
);
for (const [ad, sayi] of Object.entries(ozet.eksikTurleri)) console.log(`${String(sayi).padStart(6)}  ${ad}`);
for (const [grup, g] of Object.entries(ozet.gruplar).slice(0, 15)) console.log(`${String(g.sayi).padStart(6)}  ${grup}  |  ${g.ornek.slice(0, 100)}`);
const jsonIdx = process.argv.indexOf('--json');
if (jsonIdx > 0 && process.argv[jsonIdx + 1]) writeFileSync(process.argv[jsonIdx + 1], JSON.stringify(ozet, null, 2) + '\n');
process.exit(eksikli ? 1 : 0);
