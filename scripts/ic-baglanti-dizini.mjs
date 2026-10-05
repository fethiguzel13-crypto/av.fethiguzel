#!/usr/bin/env node
/**
 * İç bağlantı dizinini üretir (Aylık plan G12 adım 7) → lib/ic-baglanti/dizin.json. Rehber, kavram, hesaplama ya da
 * yayınlanabilir madde listesi değişince yeniden çalıştırılır; `lib/__tests__/ic-baglanti.test.mjs` dosyanın güncel
 * olduğunu denetler. Yalnız bu dosyayı yazar.
 *   node scripts/ic-baglanti-dizini.mjs
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DIZIN_YOLU, dizinHesapla, dizinMetni } from './lib/ic-baglanti-kaynak.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dizin = await dizinHesapla(root);
writeFileSync(join(root, DIZIN_YOLU), dizinMetni(dizin));
const icerik = new Set(Object.values(dizin).flat().map((o) => o.yol));
console.log(`[ic-baglanti] ${Object.keys(dizin).length} madde · ${icerik.size} içerik → ${DIZIN_YOLU}`);
