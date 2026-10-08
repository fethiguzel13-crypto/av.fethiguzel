import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { kidemIhbarDokumu, faizDokumu } from '../hesaplama-dokum.mjs';

/*
  G17 adım 5: Hesaplama dökümü. Kıdem ve ihbar aracının brüt toplamı üç bileşene ayrılır: net kıdem, net ihbar ve vergi
  kesintileri. Döküm aracın kendi sonuç satırlarından türetilir; yeni oran, tavan ya da vergi hesabı yapılmaz.
*/
const sonuc = { brutKidem: 1000, damgaKidem: 7.59, netKidem: 992.41, brutIhbar: 400, gvIhbar: 60, damgaIhbar: 3.04, netIhbar: 336.96 };

test('üç bileşen sabit sırayla gelir ve toplamı brüt kıdem ile brüt ihbarın toplamıdır', () => {
  const d = kidemIhbarDokumu(sonuc);
  assert.deepEqual(d.kesimler.map((k) => k.ad), ['Net kıdem tazminatı', 'Net ihbar tazminatı', 'Vergi kesintileri']);
  assert.equal(d.toplam, 1400);
  assert.ok(Math.abs(d.kesimler.reduce((a, k) => a + k.deger, 0) - d.toplam) < 1e-9);
  assert.ok(Math.abs(d.kesimler[2].deger - (7.59 + 60 + 3.04)) < 1e-9);
});

test('gelir vergisi sıfırken kesinti yalnız damga vergisidir, sıfır bileşen sırasını korur', () => {
  const d = kidemIhbarDokumu({ ...sonuc, gvIhbar: 0, netIhbar: 396.96, brutKidem: 0, damgaKidem: 0, netKidem: 0 });
  assert.equal(d.kesimler.length, 3);
  assert.equal(d.kesimler[0].deger, 0);
  assert.ok(Math.abs(d.kesimler[2].deger - 3.04) < 1e-9);
  assert.equal(d.toplam, 400);
});

test('kıdem ve ihbar aracı dökümü sonuç satırlarının altında yığılmış çubukla gösterir', () => {
  const kaynak = readFileSync(new URL('../../components/hesaplama/HesaplamaTools.tsx', import.meta.url), 'utf8');
  assert.match(kaynak, /import YiginCubuk from "@\/components\/grafik\/YiginCubuk"/);
  assert.match(kaynak, /import \{[^}]*\bkidemIhbarDokumu\b[^}]*\} from "@\/lib\/hesaplama-dokum\.mjs"/);
  const arac = kaynak.slice(kaynak.indexOf('function KidemIhbarTazminati'), kaynak.indexOf('// ─── 2. İHBAR TAZMİNATI'));
  assert.match(arac, /kidemIhbarDokumu\(result\)/);
  assert.match(arac, /<YiginCubuk\b/);
  // Satırlar kalır: döküm sonuç listesinin yerine geçmez.
  assert.match(arac, /\["Net Kıdem Tazminatı"/);
  assert.match(arac, /\["Net İhbar Tazminatı"/);
});

test('faiz dökümü anapara ile toplam faizi ayırır, toplamı aracın "Anapara + Faiz" sonucudur', () => {
  const d = faizDokumu({ faizMiktari: 23934.25, toplam: 123934.25 });
  assert.deepEqual(d.kesimler.map((k) => k.ad), ['Anapara', 'Toplam faiz']);
  assert.ok(Math.abs(d.kesimler[0].deger - 100000) < 1e-6);
  assert.equal(d.kesimler[1].deger, 23934.25);
  assert.equal(d.toplam, 123934.25);
});

test('faiz aracı dökümü dönem çizelgesini ve sonuç satırlarını koruyarak yığılmış çubukla gösterir', () => {
  const kaynak = readFileSync(new URL('../../components/hesaplama/HesaplamaTools.tsx', import.meta.url), 'utf8');
  assert.match(kaynak, /import \{[^}]*\bfaizDokumu\b[^}]*\} from "@\/lib\/hesaplama-dokum\.mjs"/);
  const arac = kaynak.slice(kaynak.indexOf('function FaizHesaplama'), kaynak.indexOf('// ─── 9. KİRA ARTIŞ ORANI'));
  assert.match(arac, /faizDokumu\(result\)/);
  assert.match(arac, /<YiginCubuk\b/);
  assert.match(arac, /result\.dilimler\.map/);
  assert.match(arac, /\["Anapara \+ Faiz"/);
});
