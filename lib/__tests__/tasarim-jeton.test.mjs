import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { RENKLER, ACIK_ZEMINLER, KOYU_ZEMINLER, kontrastOrani } from '../tasarim-jetonlari.mjs';

const AA = 4.5;

test('kontrastOrani: WCAG bağıl parlaklık formülü (siyah/beyaz 21, aynı renk 1)', () => {
  assert.equal(Number(kontrastOrani('#000000', '#FFFFFF').toFixed(2)), 21);
  assert.equal(kontrastOrani('#CC5833', '#CC5833'), 1);
  assert.equal(Number(kontrastOrani('#CC5833', '#F2F0E9').toFixed(2)), 3.68);
});

test('marka paleti değişmez (PRODUCT.md, Brand Commitments)', () => {
  assert.equal(RENKLER.primary, '#2E4036');
  assert.equal(RENKLER.accent.DEFAULT, '#CC5833');
  assert.equal(RENKLER.cream, '#F2F0E9');
  assert.equal(RENKLER.charcoal, '#1A1A1A');
  assert.equal(RENKLER.surface, '#FFFEFA');
});

test('metin tonu jetonları bütün açık zeminlerde AA (4,5) verir', () => {
  for (const zemin of ACIK_ZEMINLER) {
    for (const [ad, renk] of [['ink-muted', RENKLER.ink.muted], ['accent-ink', RENKLER.accent.ink], ['charcoal', RENKLER.charcoal]]) {
      const o = kontrastOrani(renk, zemin);
      assert.ok(o >= AA, `${ad} ${renk} / ${zemin}: ${o.toFixed(2)}`);
    }
  }
});

test('koyu zeminde vurgu metni (accent-light) ve vurgu-mürekkep zeminde beyaz yazı AA verir', () => {
  for (const zemin of KOYU_ZEMINLER) {
    const o = kontrastOrani(RENKLER.accent.light, zemin);
    assert.ok(o >= AA, `accent-light / ${zemin}: ${o.toFixed(2)}`);
  }
  assert.ok(kontrastOrani('#FFFFFF', RENKLER.accent.ink) >= AA);
});

// Krem yazı bu dolguda 4,05 verir. Dolgunun üstündeki yazı bu yüzden beyazdır (aşağıdaki cırcır `text-cream` eşleşmesini yakalar).
test('düğme dolgusu (accent-solid) beyaz yazıyla AA verir, marka turuncusundan gözle ayrılmaz', () => {
  const o = kontrastOrani('#FFFFFF', RENKLER.accent.solid);
  assert.ok(o >= AA, `beyaz / accent-solid: ${o.toFixed(2)}`);
  // Kanal başına en çok 12 birim koyulaşma: Dolgu, marka rengi #CC5833 olarak algılanmaya devam eder.
  const kanal = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const fark = kanal(RENKLER.accent.DEFAULT).map((v, i) => v - kanal(RENKLER.accent.solid)[i]);
  assert.ok(fark.every((d) => d >= 0 && d <= 12), `kanal farkı: ${fark}`);
});

// Beyaz yazılı dolgu `bg-accent` (4,19) yerine `bg-accent-solid`. Süs dolgusu da aynı jetondan gelir, böylece tek kural kalır.
// Üzerine gelince dolgu açılmaz (`/90` beyaz yazıyla 4,5'in altına iner), koyulaşır: `hover:bg-accent-ink`.
test('cırcır: düz bg-accent dolgusu ve açılan üzerine gelme dolgusu kullanılmaz', () => {
  const kok = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
  const bulunan = [];
  const gez = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      const p = join(d, e.name);
      if (e.isDirectory()) gez(p);
      else if (/\.(tsx|ts|css)$/.test(e.name)) {
        const s = readFileSync(p, 'utf8');
        for (const m of s.matchAll(/(?<![\w-])(?:[a-z-]+:)*bg-accent(?:\/(?:80|90))?(?![\w/-])/g)) {
          bulunan.push(`${p.slice(kok.length + 1)}: ${m[0]}`);
        }
        // Aynı sınıf dizgisinde dolgu ve krem yazı: Dolgu üzerine gelmeyle geliyorsa yazı da `hover:text-white` almalıdır.
        for (const m of s.matchAll(/(?:className=|@apply)[^"'`;]*["'`]?[^"'`;]*/g)) {
          const sinif = m[0];
          const dolgu = /(?<![\w:-])bg-accent-solid\b/.test(sinif);
          const uzerinde = /\bhover:bg-accent-solid\b/.test(sinif);
          const krem = /(?<![\w:-])text-(?:cream|surface)\b/.test(sinif);
          if (krem && (dolgu || (uzerinde && !/\bhover:text-white\b/.test(sinif)))) {
            bulunan.push(`${p.slice(kok.length + 1)}: krem yazı / accent-solid`);
          }
        }
      }
    }
  };
  gez(join(kok, 'app'));
  gez(join(kok, 'components'));
  assert.deepEqual(bulunan, []);
});

// Cırcır: saydamlıkla açılmış ikincil metin (krem zeminde 4,5 altı) yeniden artamaz. Dönüştürdükçe sınır düşürülür.
const SINIR = { charcoal: 12, cream: 0 };

test('cırcır: text-charcoal/10–59 ve text-cream/10–49 kullanımı sınırı aşmaz', () => {
  const kok = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
  let charcoal = 0;
  let cream = 0;
  const gez = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      const p = join(d, e.name);
      if (e.isDirectory()) gez(p);
      else if (e.name.endsWith('.tsx')) {
        const s = readFileSync(p, 'utf8');
        charcoal += (s.match(/\btext-charcoal\/[1-5]\d\b/g) || []).length;
        cream += (s.match(/\btext-cream\/[1-4]\d\b/g) || []).length;
      }
    }
  };
  gez(join(kok, 'app'));
  gez(join(kok, 'components'));
  assert.ok(charcoal <= SINIR.charcoal, `text-charcoal/10–59: ${charcoal} > ${SINIR.charcoal}; ink-muted kullanın`);
  assert.ok(cream <= SINIR.cream, `text-cream/10–49: ${cream} > ${SINIR.cream}`);
});

// Odak göstergesi tek kalıptır: Genel `:focus-visible` çerçevesini kaldıran sınıf yerine kenar ve halka koyan `field-focus` kullanılır.
// `outline-none` tek başına (ya da yalnız soluk halkayla) kalırsa klavye kullanıcısı odağı göremez (WCAG 2.4.7, 1.4.11).
// Çerçevesiz girdiyi saran kap (`field-focus-within`) odağı kendi kenarıyla gösterir.
test('cırcır: outline-none yalnız field-focus ve field-focus-within bileşen sınıflarında geçer', () => {
  const kok = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
  const bulunan = [];
  const gez = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      const p = join(d, e.name);
      if (e.isDirectory()) gez(p);
      else if (e.name.endsWith('.tsx') && /(^|[^\w-])outline-none/m.test(readFileSync(p, 'utf8'))) bulunan.push(p.slice(kok.length + 1));
    }
  };
  gez(join(kok, 'app'));
  gez(join(kok, 'components'));
  assert.deepEqual(bulunan, []);
  const css = readFileSync(join(kok, 'app', 'globals.css'), 'utf8');
  assert.match(css, /\.field-focus\s*\{\s*@apply[^;]*focus:border-accent[^;]*focus:ring-2/);
});

// Vurgu kutusu ince tam kenar ve hafif zeminle kurulur. Kalın tek kenar çizgisi (3 px ve üstü) dedektör kalıbıdır (impeccable).
test('cırcır: kalın tek kenar vurgu çizgisi kullanılmaz', () => {
  const kok = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
  const bulunan = [];
  const gez = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      const p = join(d, e.name);
      if (e.isDirectory()) gez(p);
      else if (/\.(tsx|ts)$/.test(e.name)) {
        const s = readFileSync(p, 'utf8');
        for (const m of s.matchAll(/\bborder-[lrtb]-(?:[48]|\[[3-9]px\])\b[^"'`]*\bborder-(?:[lrtb]-)?accent\b|border-(?:left|right|top|bottom):\s*[3-9]px solid #(?:C45A38|CC5833|A7482A)/g)) {
          bulunan.push(`${p.slice(kok.length + 1)}: ${m[0].slice(0, 40)}`);
        }
      }
    }
  };
  gez(join(kok, 'app'));
  gez(join(kok, 'components'));
  assert.deepEqual(bulunan, []);
});
