import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const catalog = JSON.parse(readFileSync(join(root, 'galaxy', 'catalog.json'), 'utf8'));

const built = (id) => existsSync(join(root, 'flavors', id, 'www', 'index.html'));
const anyBuilt = catalog.apps.some((a) => built(a.id));

// ─── Katalog değişmezleri ───────────────────────────────────────────────────

test('katalogda dört uygulama var', () => {
  assert.equal(catalog.apps.length, 4);
});

test('paket adları benzersiz', () => {
  const ids = catalog.apps.map((a) => a.packageId);
  assert.equal(new Set(ids).size, ids.length, `yinelenen: ${ids.join(', ')}`);
});

test('her uygulamanın vurgu rengi farklı', () => {
  // Aynı renk, mağaza listesinde dört uygulamayı ayırt edilemez kılar.
  const accents = catalog.apps.map((a) => a.accent);
  assert.equal(new Set(accents).size, accents.length);
});

test('zorunlu alanlar dolu', () => {
  for (const a of catalog.apps) {
    assert.ok(a.id, 'id');
    assert.match(a.packageId, /^com\.avfethiguzel\.[a-z]+$/, `${a.id} packageId`);
    assert.match(a.versionName, /^\d+\.\d+\.\d+$/, `${a.id} versionName`);
    assert.ok(Number.isInteger(a.versionCode) && a.versionCode > 0, `${a.id} versionCode`);
    assert.match(a.accent, /^#[0-9A-Fa-f]{6}$/, `${a.id} accent`);
    assert.ok(a.name.tr && a.name.en, `${a.id} ad çevirileri`);
    assert.ok(a.short.tr && a.short.en, `${a.id} kısa açıklama`);
  }
});

// ─── Flavor çıktıları ───────────────────────────────────────────────────────

test('her flavor için capacitor yapılandırması üretilmiş', () => {
  for (const a of catalog.apps) {
    const p = join(root, 'flavors', a.id, 'capacitor.config.json');
    assert.ok(existsSync(p), `${a.id}: ${p} yok — build-flavor çalıştırın`);
    const cfg = JSON.parse(readFileSync(p, 'utf8'));
    assert.equal(cfg.appId, a.packageId);
  }
});

test('hiçbir flavor uzak URL yüklemiyor', () => {
  // Play'in asgari işlevsellik politikasında server.url ile uzak site
  // yükleyen Capacitor kabuğu saf WebView sarmalayıcı sayılıyor.
  for (const a of catalog.apps) {
    const cfg = JSON.parse(
      readFileSync(join(root, 'flavors', a.id, 'capacitor.config.json'), 'utf8')
    );
    assert.equal(
      cfg.server?.url,
      undefined,
      `${a.id} server.url taşıyor: ${cfg.server?.url}`
    );
  }
});

test('gezinme izni yalnız kendi alan adına açık', () => {
  for (const a of catalog.apps) {
    const cfg = JSON.parse(
      readFileSync(join(root, 'flavors', a.id, 'capacitor.config.json'), 'utf8')
    );
    const nav = cfg.android?.allowNavigation ?? [];
    const broad = nav.filter((h) => /^\*\.(google|com)\b/.test(h) || h === '*');
    assert.equal(broad.length, 0, `${a.id} fazla geniş izin: ${broad.join(', ')}`);
  }
});

// ─── Android kimliği ────────────────────────────────────────────────────────

test('flavor.properties tanınan bir uygulamayı işaret ediyor', { skip: !existsSync(join(root, 'android', 'app', 'flavor.properties')) }, () => {
  const props = readFileSync(join(root, 'android', 'app', 'flavor.properties'), 'utf8');
  const map = Object.fromEntries(
    props
      .split('\n')
      .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
      .map((l) => {
        const i = l.indexOf('=');
        return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
      })
  );
  const app = catalog.apps.find((a) => a.packageId === map.applicationId);
  assert.ok(app, `tanınmayan applicationId: ${map.applicationId}`);
  assert.equal(map.versionName, app.versionName);
  assert.equal(Number(map.versionCode), app.versionCode);
});

test('strings.xml, build.gradle resValue ile çakışmıyor', () => {
  const gradlePath = join(root, 'android', 'app', 'build.gradle');
  const stringsPath = join(root, 'android', 'app', 'src', 'main', 'res', 'values', 'strings.xml');
  if (!existsSync(gradlePath) || !existsSync(stringsPath)) return;

  const gradle = readFileSync(gradlePath, 'utf8');
  const strings = readFileSync(stringsPath, 'utf8');
  const names = [...gradle.matchAll(/resValue\s+"string",\s*"([^"]+)"/g)].map((m) => m[1]);

  for (const n of names) {
    assert.ok(
      !strings.includes(`name="${n}"`),
      `${n} hem gradle hem strings.xml içinde — AAPT "Duplicate resources" verir`
    );
  }
});

test('manifest derin bağlantı işaretleri yerinde', () => {
  const p = join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
  if (!existsSync(p)) return;
  const src = readFileSync(p, 'utf8');
  assert.ok(src.includes('<!-- GALAXY:DEEPLINKS:START -->'), 'START işareti yok');
  assert.ok(src.includes('<!-- GALAXY:DEEPLINKS:END -->'), 'END işareti yok');
  // Üretilen blok tek bir flavor'ın şemasını taşımalı
  const schemes = [...src.matchAll(/android:scheme="avfethiguzel-([a-z]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(schemes).size, 1, `birden çok flavor şeması: ${schemes.join(', ')}`);
});

// ─── Derlenmiş çıktı ────────────────────────────────────────────────────────

test('derlenmiş arayüzler var', { skip: !anyBuilt }, () => {
  for (const a of catalog.apps) {
    assert.ok(built(a.id), `${a.id} derlenmemiş`);
  }
});

test('çevrimdışı içerik paketlenmiş', { skip: !anyBuilt }, () => {
  const need = {
    portal: ['packs/manifest.json'],
    icthat: ['icthat/seed.json', 'icthat/archive.json.gz'],
    rehber: ['rehber/guides.json.gz'],
    hesap: [],
  };
  for (const [id, files] of Object.entries(need)) {
    for (const f of files) {
      assert.ok(
        existsSync(join(root, 'flavors', id, 'www', f)),
        `${id}: www/${f} eksik — uygulama çevrimdışı boş açılır`
      );
    }
  }
});

test('uygulamaya özgü kod dört uygulamada da farklı', { skip: !anyBuilt }, () => {
  // Ortak satıcı parçaları (react, lucide) kasıtlı olarak aynıdır.
  const VENDOR = /^(react|icons|vendor)-/;
  const seen = new Map();
  for (const a of catalog.apps) {
    const dir = join(root, 'flavors', a.id, 'www', 'assets');
    if (!existsSync(dir)) continue;
    const own = readdirSync(dir).filter((f) => f.endsWith('.js') && !VENDOR.test(f)).sort();
    assert.ok(own.length > 0, `${a.id}: uygulamaya özgü parça yok`);
    const h = createHash('sha1');
    for (const f of own) h.update(readFileSync(join(dir, f)));
    const digest = h.digest('hex');
    assert.ok(!seen.has(digest), `${a.id} ile ${seen.get(digest)} aynı kodu paketliyor`);
    seen.set(digest, a.id);
  }
});

test('hesap uygulaması gereksiz veri taşımıyor', { skip: !built('hesap') }, () => {
  // 33 hesaplama aracı tamamen koddadır; mevzuat paketi veya rehber verisi
  // buraya sızarsa indirme boyutu sebepsiz büyür.
  const www = join(root, 'flavors', 'hesap', 'www');
  assert.ok(!existsSync(join(www, 'packs')), 'hesap mevzuat paketi taşıyor');
  assert.ok(!existsSync(join(www, 'rehber')), 'hesap rehber verisi taşıyor');
  const size = dirSize(www);
  assert.ok(size < 2 * 1048576, `hesap arayüzü ${(size / 1048576).toFixed(1)} MB — 2 MB üstü`);
});

// ─── Simgeler ───────────────────────────────────────────────────────────────

test('her uygulamanın simgesi farklı', { skip: !existsSync(join(root, 'assets', 'icons')) }, () => {
  const seen = new Map();
  for (const a of catalog.apps) {
    const p = join(root, 'assets', 'icons', `${a.id}-512.png`);
    assert.ok(existsSync(p), `${a.id} simgesi yok — npm run icons`);
    const h = createHash('sha1').update(readFileSync(p)).digest('hex');
    assert.ok(!seen.has(h), `${a.id} ile ${seen.get(h)} aynı simge dosyası`);
    seen.set(h, a.id);
  }
});

// ─── Mağaza metinleri ───────────────────────────────────────────────────────

test('kısa açıklamalar Play sınırında', () => {
  for (const a of catalog.apps) {
    const p = join(root, 'store-listing', a.id, 'tr-short.txt');
    if (!existsSync(p)) continue;
    const len = readFileSync(p, 'utf8').trim().length;
    assert.ok(len <= 80, `${a.id} kısa açıklama ${len} karakter (sınır 80)`);
    assert.ok(len >= 20, `${a.id} kısa açıklama çok kısa (${len})`);
  }
});

test('tam açıklamalar Play sınırında', () => {
  for (const a of catalog.apps) {
    const p = join(root, 'store-listing', a.id, 'tr-full.txt');
    if (!existsSync(p)) continue;
    const len = readFileSync(p, 'utf8').trim().length;
    assert.ok(len <= 4000, `${a.id} tam açıklama ${len} karakter (sınır 4000)`);
  }
});

test('mağaza metinlerinde doğrulanmamış sayı iddiası yok', () => {
  // «7800+ akademik şerh» gibi karşılığı olmayan vaatler mağaza metninden
  // çıkarıldı; testi geri gelmesin diye bırakıyoruz.
  for (const a of catalog.apps) {
    const p = join(root, 'store-listing', a.id, 'tr-full.txt');
    if (!existsSync(p)) continue;
    const text = readFileSync(p, 'utf8');
    assert.ok(
      !/7[.\s]?800\+?\s*(kanun maddesi ve )?akademik şerh/i.test(text),
      `${a.id}: karşılığı olmayan şerh sayısı iddiası`
    );
  }
});

function dirSize(dir) {
  let total = 0;
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name);
    total += f.isDirectory() ? dirSize(p) : statSync(p).size;
  }
  return total;
}
