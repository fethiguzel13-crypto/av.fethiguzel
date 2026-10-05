/**
 * İç bağlantı dizininin kaynakları (Aylık plan G12 adım 7): yayındaki rehberler (sayfayla aynı seçim), kavramlar,
 * hesaplama araçları, dizine açık temsilci ders notları (G11 `dizin-kanonik.json`) ve dizine açık maddeler. Üretici betik ve tazelik testi aynı işlevi kullanır.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readPublished } from './read-guides.mjs';
import { dizinKur, dizinSikistir, metinGondermeleri } from '../../lib/ic-baglanti/dizin.mjs';

export const DIZIN_YOLU = join('lib', 'ic-baglanti', 'dizin.json');

/** @param {string} root depo kökü */
export async function dizinHesapla(root) {
  const { KAVRAMLAR } = await import(pathToFileURL(join(root, 'lib', 'kavramlar.ts')).href);
  const { HESAPLAMA_ARACLAR } = await import(pathToFileURL(join(root, 'lib', 'hesaplama-meta.ts')).href);
  const { published } = readPublished(root);
  const acik = new Set(JSON.parse(readFileSync(join(root, 'public', 'data', 'publishable.json'), 'utf8')).mevzuat);
  const temsilciler = Object.values(JSON.parse(readFileSync(join(root, 'lib', 'ders-notlari', 'dizin-kanonik.json'), 'utf8')).dersler);
  const notlar = temsilciler.map(({ uni, ders }) => {
    const metin = readFileSync(join(root, 'lib', 'ders-notlari', 'generated', 'notes', `${uni}__${ders}.json`), 'utf8');
    return { tur: 'ders-notu', ad: JSON.parse(metin).h1, yol: `/ders-notlari/${uni}/${ders}`, baglantilar: metinGondermeleri(metin) };
  });
  const icerikler = [
    ...published.map((r) => ({ tur: 'rehber', ad: r.h1, yol: `/bilgi/${r.slug}`, baglantilar: r.links })),
    ...KAVRAMLAR.map((k) => ({ tur: 'kavram', ad: k.baslik, yol: `/kavram/${k.slug}`, baglantilar: k.mevzuat })),
    ...HESAPLAMA_ARACLAR.map((h) => ({ tur: 'hesaplama', ad: h.baslik, yol: `/hesaplama/${h.id}`, baglantilar: h.mevzuat })),
    ...notlar,
  ];
  return dizinKur(icerikler, acik);
}

/** Dosyaya yazılan biçim (`dizinSikistir`): satır başına bir içerik ve bir madde (fark okunur kalsın). */
export function dizinMetni(dizin) {
  const { icerik, maddeler } = dizinSikistir(dizin);
  const ic = icerik.map((o) => `    ${JSON.stringify(o)}`).join(',\n');
  const md = Object.entries(maddeler).map(([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(',\n');
  return `{\n  "icerik": [\n${ic}\n  ],\n  "maddeler": {\n${md}\n  }\n}\n`;
}
