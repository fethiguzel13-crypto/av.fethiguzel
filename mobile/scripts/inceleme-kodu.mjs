#!/usr/bin/env node
/**
 * Mağaza inceleme erişim kodu üretir (G05).
 *
 *   node scripts/inceleme-kodu.mjs            # dosya yoksa yeni kod yazar
 *   node scripts/inceleme-kodu.mjs --yenile   # var olan kodu değiştirir
 *
 * Kod git dışı `mobile/inceleme-kodu.local.txt` dosyasına yazılır; ekrana ve
 * loga basılmaz. build-app.mjs pakete yalnız özetini gömer. Kod değişince
 * Play Console → Uygulama erişimi metni de aynı kodla güncellenmelidir.
 */

import { existsSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { yeniIncelemeKodu } from '../app-src/src/lib/inceleme.mjs';

const yol = join(dirname(fileURLToPath(import.meta.url)), '..', 'inceleme-kodu.local.txt');

if (existsSync(yol) && !process.argv.includes('--yenile')) {
  console.log(`[inceleme] kod zaten var: ${yol} (değiştirmek için --yenile)`);
} else {
  writeFileSync(yol, `${yeniIncelemeKodu()}\n`, 'utf8');
  console.log(`[inceleme] yeni kod yazıldı: ${yol}`);
  console.log('[inceleme] Play Console → Uygulama erişimi metnini bu kodla güncelleyin.');
}
