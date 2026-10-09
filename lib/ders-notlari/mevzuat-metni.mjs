/**
 * Depodaki kanun metni (G18 şemaları ve G19 kanonik katmanı için dayanak doğrulaması). Yalnız madde metni döner:
 * `content/mevzuat/<kanun>/madde-<madde>.md` dosyasında ön bilgi ve `### Akademik` başlığından sonraki yorum atılır.
 * Karşılaştırma için boşluklar teklenir ve Türkçe küçük harfe çevrilir. Dosya yoksa `null`.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export const kucuk = (s) => String(s).replace(/\s+/g, ' ').toLocaleLowerCase('tr');

/** @param {string} kanun @param {string} madde @returns {string | null} */
export function maddeMetni(kanun, madde) {
  if (!/^[a-z0-9-]+$/.test(kanun) || !/^[0-9]+[A-Z]?$/.test(madde)) return null;
  const dosya = join(KOK, 'content', 'mevzuat', kanun, `madde-${madde}.md`);
  if (!existsSync(dosya)) return null;
  const s = readFileSync(dosya, 'utf8').replace(/^---[\s\S]*?---/, '');
  const i = s.indexOf('### Akademik');
  return kucuk(i >= 0 ? s.slice(0, i) : s);
}
