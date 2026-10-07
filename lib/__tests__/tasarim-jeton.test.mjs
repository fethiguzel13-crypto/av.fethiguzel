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
