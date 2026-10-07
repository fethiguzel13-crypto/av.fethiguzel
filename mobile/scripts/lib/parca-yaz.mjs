/**
 * Tam metin parçalarını tek tek yazar (G14).
 *
 * `build-icthat-data.mjs` eskiden bütün kararların tam metnini 80 parçalık bir nesnede toplayıp en sonda yazıyordu.
 * Süzgeçle bile 39 bin kararın metni 2 GB yığını aştı (2026-10-07, bellek yetersizliğiyle düştü). Artık ana döngü yalnız
 * kimlik ile dosya yolunu parçasına göre toplar, metinler burada parça parça okunur ve parça yazılınca bellekten çıkar.
 * Tepe bellek bir parçanın metni kadardır.
 *
 * @param {object} o
 * @param {Array<Array<[string, string]>>} o.gruplar  parça başına `[kimlik, dosya]` listesi
 * @param {string} o.klasor                          parçaların yazılacağı klasör (var olmalı)
 * @param {(n: number) => string} o.adlandir         parça numarasından dosya adı
 * @param {(dosya: string) => string} o.metniOku     dosyadan tam metin; okunamazsa boş dizgi
 * @returns {{ dosya: number, karar: number, bayt: number }}
 */
import { writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

export function parcalariYaz({ gruplar, klasor, adlandir, metniOku }) {
  let dosya = 0;
  let karar = 0;
  let bayt = 0;
  gruplar.forEach((grup, n) => {
    const torba = {};
    let dolu = 0;
    for (const [kimlik, yol] of grup) {
      const metin = metniOku(yol);
      if (!metin) continue;
      torba[kimlik] = metin;
      dolu += 1;
    }
    if (!dolu) return;
    const gz = gzipSync(Buffer.from(JSON.stringify(torba), 'utf8'), { level: 9 });
    writeFileSync(join(klasor, adlandir(n)), gz);
    dosya += 1;
    karar += dolu;
    bayt += gz.length;
  });
  return { dosya, karar, bayt };
}
