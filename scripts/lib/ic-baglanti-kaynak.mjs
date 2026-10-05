/**
 * İç bağlantı dizininin kaynakları (Aylık plan G12 adım 7): yayındaki rehberler (sayfayla aynı seçim), kavramlar,
 * hesaplama araçları ve dizine açık maddeler. Üretici betik ve tazelik testi aynı işlevi kullanır.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readPublished } from './read-guides.mjs';
import { dizinKur } from '../../lib/ic-baglanti/dizin.mjs';

export const DIZIN_YOLU = join('lib', 'ic-baglanti', 'dizin.json');

/** @param {string} root depo kökü */
export async function dizinHesapla(root) {
  const { KAVRAMLAR } = await import(pathToFileURL(join(root, 'lib', 'kavramlar.ts')).href);
  const { HESAPLAMA_ARACLAR } = await import(pathToFileURL(join(root, 'lib', 'hesaplama-meta.ts')).href);
  const { published } = readPublished(root);
  const acik = new Set(JSON.parse(readFileSync(join(root, 'public', 'data', 'publishable.json'), 'utf8')).mevzuat);
  const icerikler = [
    ...published.map((r) => ({ tur: 'rehber', ad: r.h1, yol: `/bilgi/${r.slug}`, baglantilar: r.links })),
    ...KAVRAMLAR.map((k) => ({ tur: 'kavram', ad: k.baslik, yol: `/kavram/${k.slug}`, baglantilar: k.mevzuat })),
    ...HESAPLAMA_ARACLAR.map((h) => ({ tur: 'hesaplama', ad: h.baslik, yol: `/hesaplama/${h.id}`, baglantilar: h.mevzuat })),
  ];
  return dizinKur(icerikler, acik);
}

/** Dosyaya yazılan biçim: satır başına bir madde (fark okunur kalsın). */
export function dizinMetni(dizin) {
  const satirlar = Object.entries(dizin).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`);
  return `{\n${satirlar.join(',\n')}\n}\n`;
}
