import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/*
  G16 adım 3: Ana sayfa otorite sırasıyla kurulur (kimlik ve arama → külliyat → yazar ve eserler → güncel içtihat →
  araçlar → makaleler → SSS). Külliyat sayıları tek şeritte, yazar bilgisi tek bölümde verilir.
  Önceki kurguda sayılar ilk ekranda iki kez (cümle ve rozet), TrustBar'da ve LibraryStrip'te yineleniyordu.
  Doktora, monografi ve İngilizce bilgisi TrustBar'da, CredentialsStrip'te ve Hakkımda bölümünde üç kez yazılıydı.
*/
const kok = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const oku = (d) => readFileSync(join(kok, d), 'utf8');

test('ana sayfa bölümleri otorite sırasıyla dizilir, tekrar eden şeritler çizilmez', () => {
  const s = oku('app/page.tsx');
  const sira = ['<Hero', '<TrustBar', '<YargiPreview', '<About', '<DailyNews', '<ToolsPreview', '<Articles', '<FaqSection'];
  const konum = sira.map((b) => s.indexOf(b));
  assert.ok(konum.every((k) => k > 0), `eksik bölüm: ${sira.filter((_, i) => konum[i] < 0).join(', ')}`);
  assert.deepEqual([...konum].sort((a, b) => a - b), konum, 'bölüm sırası');
  assert.doesNotMatch(s, /<CredentialsStrip|<LibraryStrip/);
});

test('külliyat sayıları ilk ekranda bir kez yazılır, rozet satırı yoktur', () => {
  const s = oku('components/Hero.tsx');
  for (const k of ['kanun', 'madde', 'karar']) {
    const adet = s.match(new RegExp(`sayilar\\.${k}\\b`, 'g'))?.length ?? 0;
    assert.ok(adet <= 1, `Hero sayilar.${k} ${adet} kez`);
  }
  assert.doesNotMatch(s, /STAT_ITEMS/);
});

test('külliyat şeridi kaynaklara bağlanır, yazar bilgisi taşımaz', () => {
  const s = oku('components/TrustBar.tsx');
  for (const href of ['/mevzuat', '/yargi-kararlari', '/bilgi', '/icthat']) {
    assert.match(s, new RegExp(`href: '${href}'`), href);
  }
  assert.match(s, /sayilar\.rehber/);
  assert.doesNotMatch(s, /[Dd]oktora|monografi|Seçkin|Ücretsiz/);
  assert.doesNotMatch(oku('app/page.tsx'), /[Dd]oktora|monografi|Seçkin/);
});

test('külliyat şeridi ilk ekranda ön getirme yapmaz', () => {
  // Kutucuklar mobilde ilk ekrandadır; varsayılan ön getirme /bilgi ve /mevzuat yükünü (~61 KB) her açılışta indiriyordu.
  assert.match(oku('components/TrustBar.tsx'), /<Link href=\{s\.href\} prefetch=\{false\}/);
  // Sayı rozetleri kalkınca Hero'nun ikincil düğmeleri mobilde ilk ekrana girdi (/bilgi 36 KB, /mevzuat/tbk 18 KB).
  const hero = oku('components/Hero.tsx');
  for (const href of ['/bilgi', '/mevzuat/tbk']) {
    assert.match(hero, new RegExp(`href="${href}"\\s+prefetch=\\{false\\}`), `Hero ${href}`);
  }
});

test('Hakkımda bölümü yazar ve eserleri bir kez, bağlantılı olarak verir', () => {
  const s = oku('components/About.tsx');
  for (const href of ['/akademik-profil', '/eserlerim', '/mevzuat']) {
    const adet = s.match(new RegExp(`['"]${href}['"]`, 'g'))?.length ?? 0;
    assert.equal(adet, 1, `${href} ${adet} kez`);
  }
  assert.equal(s.match(/monografi|Seçkin/g)?.length ?? 0, 0, 'eser künyesi prop olarak gelir');
  assert.match(oku('app/page.tsx'), /<About[^>]*kitap=/);
});

test('hesaplama önizlemesi mobilde ilk dört kartı gösterir', () => {
  const s = oku('components/ToolsPreview.tsx');
  assert.match(s, /i < MOBIL_KART \? 'flex' : 'hidden sm:flex'/);
  assert.match(s, /const MOBIL_KART = 4;/);
});

test('kullanılmayan LibraryStrip bileşeni kaldırılmıştır', () => {
  assert.equal(existsSync(join(kok, 'components/LibraryStrip.tsx')), false);
});
