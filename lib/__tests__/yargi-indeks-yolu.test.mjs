// G14: ücretli karar indeksi `public/` altında durursa statik dosya olarak sunulabilir; yalnız yeniden yazma kuralı
// koruyordu (G04 notu). İndeks `data/yayin/` altındadır, okuyan ve yazan her yer aynı yolu kullanır.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const kok = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const oku = (p) => readFileSync(join(kok, p), 'utf8');

const KULLANANLAR = [
  'lib/uyelik/karar-text.ts',
  'app/api/yargi/[...path]/route.ts',
  'mobile/scripts/build-icthat-data.mjs',
  'mobile/scripts/build-yargi-index.mjs',
];

test('indeks public/ altında değil, data/yayin/ altında', () => {
  assert.equal(existsSync(join(kok, 'public', 'data', 'yargi-index.json.gz')), false);
  assert.equal(existsSync(join(kok, 'data', 'yayin', 'yargi-index.json.gz')), true);
});

test('okuyan ve yazan her dosya data/yayin yolunu kullanır, public yolunu anmaz', () => {
  for (const dosya of KULLANANLAR) {
    const kaynak = oku(dosya);
    assert.match(kaynak, /'data',\s*'yayin',\s*'yargi-index\.json\.gz'/, `${dosya} data/yayin yolunu kullanmıyor`);
    assert.doesNotMatch(kaynak, /'public',\s*'data',\s*'yargi-index/, `${dosya} hâlâ public/data yolunu kullanıyor`);
  }
});

test('next.config: derleme izleme listesi yeni yolu taşır, eski adres üyelik API’sine yönlenir', () => {
  const yapi = oku('next.config.ts');
  assert.doesNotMatch(yapi, /\.\/public\/data\/yargi-index/);
  for (const rota of ['/api/yargi/[...path]', '/api/yargi/index', '/api/yargi/karar/[id]']) {
    const satir = yapi.split(/\r?\n/).find((s) => s.includes(`"${rota}"`));
    assert.ok(satir?.includes('./data/yayin/yargi-index.json.gz'), `${rota} izleme satırı yeni yolu taşımıyor`);
  }
  assert.match(yapi, /source: '\/data\/yargi-index\.json\.gz', destination: '\/api\/yargi\/index'/);
});
