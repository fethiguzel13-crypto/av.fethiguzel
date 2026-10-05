/**
 * Derleme çıktısındaki tüm önceden üretilmiş sayfaların JSON-LD bloklarını denetler (Aylık plan G10 adım 2).
 * Kurallar `scripts/lib/jsonld-denetim.mjs`'te; FAQPage sorusu sayfanın görünür metninde de aranır (adım 5). Dizine açık
 * sayfada (ana sayfa hariç) tek BreadcrumbList ve aynı basamaklı görünür kırıntı aranır (G12 adım 5). Rota işleyicisinin
 * çalışma anında ürettiği madde sayfaları burada yoktur. Yalnız okur; dosya yazmaz.
 *   npm run build && node scripts/derleme-jsonld-tara.mjs     # sorun varsa çıkış kodu 1
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { dizineAcikSayfa, faqGorunurlukDenetle, jsonLdDenetle, kirintiDenetle } from './lib/jsonld-denetim.mjs';

const KOK = '.next/server/app';
if (!existsSync(KOK)) {
  console.error(`${KOK} yok; önce derleme gerekir (npm run build).`);
  process.exit(2);
}

const grupAdi = (yol) => {
  const p = relative(KOK, yol).split(sep);
  return p.length > 1 ? p.slice(0, Math.min(2, p.length - 1)).join('/') : p[0];
};

let sayfa = 0;
let blok = 0;
let acik = 0;
const ANA_SAYFA = join(KOK, 'index.html');
const kurallar = new Map(); // kural → { sayfa: Set, gruplar: Map<grup, ornek> }
const kaydet = (kural, yol, ornek) => {
  const k = kurallar.get(kural) || { sayfalar: new Set(), gruplar: new Map() };
  k.sayfalar.add(yol);
  if (!k.gruplar.has(grupAdi(yol))) k.gruplar.set(grupAdi(yol), ornek);
  kurallar.set(kural, k);
};

(function gez(dizin) {
  for (const o of readdirSync(dizin, { withFileTypes: true })) {
    const yol = join(dizin, o.name);
    if (o.isDirectory()) gez(yol);
    else if (o.name.endsWith('.html')) {
      sayfa++;
      const html = readFileSync(yol, 'utf8');
      for (const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
        blok++;
        let veri;
        try {
          veri = JSON.parse(m[1]);
        } catch {
          kaydet('json-gecersiz', yol, '');
          continue;
        }
        for (const s of jsonLdDenetle(veri)) kaydet(s.kural, yol, `${s.tur} @ ${s.yol || '(kök)'}`);
      }
      for (const soru of faqGorunurlukDenetle(html)) kaydet('faq-gorunmuyor', yol, soru);
      const metaYolu = yol.slice(0, -'.html'.length) + '.meta';
      const meta = existsSync(metaYolu) ? JSON.parse(readFileSync(metaYolu, 'utf8')) : null;
      if (yol !== ANA_SAYFA && dizineAcikSayfa(html, meta)) {
        acik++;
        for (const kural of kirintiDenetle(html)) kaydet(kural, yol, relative(KOK, yol));
      }
    }
  }
})(KOK);

console.log(`Derlenmiş sayfa: ${sayfa} · JSON-LD bloğu: ${blok} · kırıntısı denetlenen (dizine açık, ana sayfa hariç): ${acik}`);
for (const [kural, k] of [...kurallar].sort((a, b) => b[1].sayfalar.size - a[1].sayfalar.size)) {
  console.log(`\n${kural}: ${k.sayfalar.size} sayfa`);
  for (const [grup, ornek] of k.gruplar) console.log(`  ${grup}  —  ${ornek}`);
}
process.exit(kurallar.size ? 1 : 0);
