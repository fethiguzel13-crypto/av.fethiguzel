/**
 * Rehber seçimi tek kaynak (Aylık plan G11; G06b notu): sayfa (`lib/vatandas-rehberi/published.ts`) ile site
 * haritası/arama (`scripts/lib/read-guides.mjs`) ayrı kural uyguluyordu. Sayfa makine çıktısını elle yazılan
 * rehberin önüne alıyor (33 rehberin 33'ü eziliyordu) ve denetlemiyordu (23 ince rehber dizine açık, haritada yok).
 *   node --test lib/__tests__/rehber-secimi.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rehberleriSec, rehberSayfaDurumu, ilgiliRehberler } from '../vatandas-rehberi/sec.mjs';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const denetle = (a) => !a.ince;
const r = (slug, kaynak, ek = {}) => ({ slug, kaynak, ...ek });

test('elle yazılan rehber aynı slugdaki makine çıktısının önüne geçer', () => {
  const s = rehberleriSec(
    { authored: [r('kidem', 'elle')], rewritten: [r('kidem', 'makine')], generated: [r('kidem', 'uretim')] },
    denetle
  );
  assert.deepEqual(s.published.map((a) => a.kaynak), ['elle']);
});

test('ince makine çıktısı yayından düşer, aynı slugdaki üretilmiş sürüm de devreye girmez', () => {
  const s = rehberleriSec(
    { authored: [], rewritten: [r('yapi', 'makine', { ince: true })], generated: [r('yapi', 'uretim')] },
    denetle
  );
  assert.deepEqual(s.published, []);
  assert.equal(s.withdrawn, 1);
});

test('üretilmiş rehber yalnız denetimden geçerse yayında; sıra elle > makine > üretim', () => {
  const s = rehberleriSec(
    {
      authored: [r('a', 'elle')],
      rewritten: [r('b', 'makine')],
      generated: [r('c', 'uretim'), r('d', 'uretim', { ince: true })],
    },
    denetle
  );
  assert.deepEqual(s.published.map((a) => a.slug), ['a', 'b', 'c']);
  assert.deepEqual(s.rewritten.map((a) => a.slug), ['b']);
  assert.equal(s.withdrawn, 1);
});

test('sayfa modülü ve betik seçimi aynı işlevden yapar', () => {
  const sayfa = readFileSync(join(KOK, 'lib', 'vatandas-rehberi', 'published.ts'), 'utf8');
  assert.match(sayfa, /rehberleriSec\(/);
  assert.doesNotMatch(sayfa, /AUTHORED_ARTICLES\.filter\(/);
  const betik = readFileSync(join(KOK, 'scripts', 'lib', 'read-guides.mjs'), 'utf8');
  assert.match(betik, /rehberleriSec\(/);
});

// 2026-10-05: sayfa yayında olmayan rehberde üretilmiş sürümü kendi başına denetliyordu; ince yeniden yazımın
// altındaki kalıp metin kapıdan geçince (fazla mesai, işsizlik maaşı, trafik kazası) sayfa dizine açık, haritada yoktu.
test('yayında olmayan rehberin sayfası, üretilmiş sürümü kapıdan geçse de dizine açılmaz', () => {
  const kovalar = { authored: [], rewritten: [r('mesai', 'makine', { ince: true })], generated: [r('mesai', 'uretim')] };
  const { published } = rehberleriSec(kovalar, denetle);
  const durum = rehberSayfaDurumu('mesai', published, kovalar, (a) => `gerekçe:${a.kaynak}`);
  assert.equal(durum.publishable, false);
  assert.equal(durum.article.kaynak, 'makine');
  assert.equal(durum.reason, 'gerekçe:makine');
});

test('yayındaki rehberin sayfası seçilen sürümü dizine açar; bilinmeyen slug null', () => {
  const kovalar = { authored: [r('kidem', 'elle')], rewritten: [r('kidem', 'makine')], generated: [] };
  const { published } = rehberleriSec(kovalar, denetle);
  const durum = rehberSayfaDurumu('kidem', published, kovalar, () => 'x');
  assert.equal(durum.publishable, true);
  assert.equal(durum.article.kaynak, 'elle');
  assert.equal(rehberSayfaDurumu('yok', published, kovalar, () => 'x'), null);
});

test('rehber sayfası robots kararını yalnız seçimden alır, kendi denetimini yapmaz', () => {
  const sayfa = readFileSync(join(KOK, 'app', 'bilgi', '[slug]', 'page.tsx'), 'utf8');
  assert.match(sayfa, /getGuidePageState\(/);
  assert.doesNotMatch(sayfa, /auditGuide/);
  assert.doesNotMatch(sayfa, /getVatandasBySlug\(/);
});

// G12 adım 6: "Bunlar da işinize yarar" üretilmiş veriden okunuyordu: 579 sayfada yayından düşen rehbere 134 bağlantı
// ve slug'ı üretilmiş veride olmayan 25 elle yazılan rehberde liste boştu (kendi `related` alanı okunmuyordu).
test('ilgili rehberler yalnız yayındaki hedeflerden; önce kaynağın kendi listesi, sonra aynı kategori', () => {
  const yayinda = [
    r('kaynak', 'elle', { category: 'İş', related: ['dusen', 'izin', 'kaynak'] }),
    r('izin', 'makine', { category: 'İş' }),
    r('ihbar', 'makine', { category: 'İş' }),
    r('kira', 'makine', { category: 'Kira' }),
  ];
  const ilgili = ilgiliRehberler(yayinda[0], yayinda, 5).map((a) => a.slug);
  assert.deepEqual(ilgili, ['izin', 'ihbar']);
});

test('ilgili rehber sayısı sınırı aşmaz', () => {
  const yayinda = ['a', 'b', 'c', 'd'].map((s) => r(s, 'makine', { category: 'İş', related: [] }));
  assert.equal(ilgiliRehberler(yayinda[0], yayinda, 2).length, 2);
});

test('rehber sayfası ilgili rehberleri yayın seçiminden alır', () => {
  const sayfa = readFileSync(join(KOK, 'app', 'bilgi', '[slug]', 'page.tsx'), 'utf8');
  assert.doesNotMatch(sayfa, /getRelatedArticles\(/);
  assert.match(sayfa, /getRelatedPublished\(/);
});
