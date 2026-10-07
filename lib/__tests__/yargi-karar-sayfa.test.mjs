// G14 adım 4: karar sayfası sunucuda künye başlığı ve kararın başını taşır; tam metin yalnız üyeye istemcide gelir.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  kararKimligiGecerli,
  kararSayfaBilgisi,
  KARAR_SAYFASI_DIZINDE,
  ACIKLAMA_SINIRI,
} from '../yargi-karar-sayfa.mjs';

const kok = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const oku = (p) => readFileSync(join(kok, p), 'utf8');

const SATIR = {
  i: '1222561600',
  k: 'Yargıtay Hukuk Genel Kurulu, E. 2026/410, K. 2026/435, T. 01.07.2026',
  a: 'hgk',
  t: '01.07.2026',
  d: 'Hukuk Genel Kurulu',
  w: [],
  r: 'hgk',
  e: 'MAHKEMESİ :Asliye Hukuk Mahkemesi   SAYISI : 2024/32 E., 2024/115 K. Taraflar arasındaki tenkis davasından dolayı yapılan yargılama sonunda Ankara 41. Asliye Hukuk Mahkemesince verilen yukarıda tarih ve sayısı belirtilen…',
  s: '',
  y: '2026',
};

test('kimlik API ile aynı biçim kuralına uyar', () => {
  assert.equal(kararKimligiGecerli('1222561600'), true);
  assert.equal(kararKimligiGecerli('ab'), false);
  assert.equal(kararKimligiGecerli('../etc/passwd'), false);
  assert.equal(kararKimligiGecerli('a'.repeat(65)), false);
  assert.equal(kararKimligiGecerli(undefined), false);
});

test('başlık künyedir, konu varsa ve kısa kalıyorsa eklenir', () => {
  assert.equal(kararSayfaBilgisi(SATIR).baslik, SATIR.k);
  const konulu = kararSayfaBilgisi({ ...SATIR, j: ['Tenkis davası', 'Saklı pay'] });
  assert.equal(konulu.baslik, `${SATIR.k} · Tenkis davası`);
  assert.deepEqual(konulu.konu, ['Tenkis davası', 'Saklı pay']);
  const uzun = kararSayfaBilgisi({ ...SATIR, j: ['x'.repeat(60)] });
  assert.equal(uzun.baslik, SATIR.k);
});

test('kararın başı boşlukları sadeleşmiş olarak gelir', () => {
  const b = kararSayfaBilgisi(SATIR);
  assert.doesNotMatch(b.ozet, / {2,}/);
  assert.ok(b.ozet.startsWith('MAHKEMESİ :Asliye Hukuk Mahkemesi SAYISI'));
});

test('açıklama daire ve tarihle başlar, sınırı aşmaz, kesilince üç nokta alır', () => {
  const b = kararSayfaBilgisi(SATIR);
  assert.ok(b.aciklama.startsWith('Yargıtay Hukuk Genel Kurulu, 01.07.2026. '));
  assert.ok(b.aciklama.length <= ACIKLAMA_SINIRI, `açıklama ${b.aciklama.length} karakter`);
  assert.ok(b.aciklama.endsWith('…'));
  assert.doesNotMatch(b.aciklama, /\s…$/);
});

test('özeti olmayan kararda açıklama künyeye dayanır', () => {
  const b = kararSayfaBilgisi({ ...SATIR, e: '' });
  assert.equal(b.ozet, '');
  assert.ok(b.aciklama.includes(SATIR.k));
  assert.ok(b.aciklama.length <= ACIKLAMA_SINIRI);
});

test('daire adı zaten "Yargıtay" ile başlıyorsa tekrarlanmaz', () => {
  const b = kararSayfaBilgisi({ ...SATIR, d: 'Yargıtay 2. Hukuk Dairesi' });
  assert.ok(b.aciklama.startsWith('Yargıtay 2. Hukuk Dairesi, 01.07.2026. '));
});

test('karar sayfası dizine kapalıdır (soru 20 yanıtlanana kadar)', () => {
  assert.equal(KARAR_SAYFASI_DIZINDE, false);
});

test('sayfa: indekste olmayan kimliğe 404, tam metni sunucuda basmaz, indeksi derlemeye alır', () => {
  const sayfa = oku('app/yargi-kararlari/[id]/page.tsx');
  assert.match(sayfa, /notFound\(\)/);
  assert.match(sayfa, /generateMetadata/);
  assert.match(sayfa, /generateStaticParams\(\)\s*\{\s*return \[\];/);
  assert.match(sayfa, /KARAR_SAYFASI_DIZINDE/);
  assert.doesNotMatch(sayfa, /loadKararText|readKararText/, 'tam metin sunucu çiziminde okunmamalı');
  const yapi = oku('next.config.ts');
  const satir = yapi.split(/\r?\n/).find((s) => s.includes('"/yargi-kararlari/[id]"'));
  assert.ok(satir?.includes('./data/yayin/yargi-index.json.gz'), 'karar sayfası izleme satırı yok');
});
