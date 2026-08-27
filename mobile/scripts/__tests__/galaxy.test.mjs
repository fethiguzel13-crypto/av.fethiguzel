import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const catalog = JSON.parse(readFileSync(join(root, 'galaxy', 'catalog.json'), 'utf8'));

/**
 * Bu testlerin çoğu YALNIZ yayınlanan uygulamalar için anlamlıdır.
 *
 * 17.08.2026'da dört ayrı uygulama `asistan` içinde birleştirildi (gerekçe:
 * catalog.json → _yayinNotu). Eskiler katalogda `published:false` ile duruyor;
 * kodları ve derleme yolları çalışır ama Play'e gitmiyorlar. Benzersizlik ve
 * ayırt edilebilirlik kuralları Play'e giden kümeye uygulanır — katalogun
 * tamamına değil. Nitekim `asistan`, Play Console'da kaydı zaten açılmış olan
 * `com.avfethiguzel.hesap` paket adını devraldı; katalogun tamamı denetlenirse
 * bu devir "yinelenen packageId" diye yanlış raporlanır.
 */
const published = catalog.apps.filter((a) => a.published === true);

const built = (id) => existsSync(join(root, 'flavors', id, 'www', 'index.html'));
const anyBuilt = published.some((a) => built(a.id));

// ─── Katalog değişmezleri ───────────────────────────────────────────────────

test('katalogda yayınlanan en az bir uygulama var', () => {
  assert.ok(published.length >= 1, 'published:true olan uygulama yok');
});

test('her uygulamada published bayrağı açıkça yazılı', () => {
  // Eksik bayrak "yayınlanmıyor" sayılır; sessiz varsayım yerine açık yazım.
  for (const a of catalog.apps) {
    assert.equal(typeof a.published, 'boolean', `${a.id}: published alanı yok`);
  }
});

test('yayınlanan paket adları benzersiz', () => {
  const ids = published.map((a) => a.packageId);
  assert.equal(new Set(ids).size, ids.length, `yinelenen: ${ids.join(', ')}`);
});

test('yayınlanan uygulamaların vurgu rengi farklı', () => {
  // Aynı renk, mağaza listesinde uygulamaları ayırt edilemez kılar.
  const accents = published.map((a) => a.accent);
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
    assert.ok(Array.isArray(a.assets), `${a.id} assets dizisi yok`);
  }
});

test('aynı paket adını iki uygulama devralmışsa yalnız biri yayında', () => {
  // `asistan` eski `hesap` kaydını devraldı. Aynı packageId ile İKİ uygulamanın
  // birden yayında olması, Play'e hangi arayüzün gittiğini belirsizleştirirdi.
  const byPackage = new Map();
  for (const a of catalog.apps) {
    byPackage.set(a.packageId, [...(byPackage.get(a.packageId) ?? []), a]);
  }
  for (const [pkg, apps] of byPackage) {
    const live = apps.filter((a) => a.published === true);
    assert.ok(live.length <= 1, `${pkg}: ${live.map((a) => a.id).join(' + ')} ikisi de yayında`);
  }
});

test('Play uygulama adı 30 karakter sınırında', () => {
  // Play Store başlık sınırı 30; aşan ad mağazada reddedilir.
  for (const a of published) {
    assert.ok(
      a.name.tr.length <= 30,
      `${a.id}: "${a.name.tr}" ${a.name.tr.length} karakter (sınır 30)`
    );
  }
});

// ─── Flavor çıktıları ───────────────────────────────────────────────────────

test('her flavor için capacitor yapılandırması üretilmiş', () => {
  for (const a of published) {
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
    const p = join(root, 'flavors', a.id, 'capacitor.config.json');
    if (!existsSync(p)) continue;
    const cfg = JSON.parse(readFileSync(p, 'utf8'));
    assert.equal(cfg.server?.url, undefined, `${a.id} server.url taşıyor: ${cfg.server?.url}`);
  }
});

test('gezinme izni yalnız kendi alan adına açık', () => {
  for (const a of catalog.apps) {
    const p = join(root, 'flavors', a.id, 'capacitor.config.json');
    if (!existsSync(p)) continue;
    const cfg = JSON.parse(readFileSync(p, 'utf8'));
    const nav = cfg.android?.allowNavigation ?? [];
    const broad = nav.filter((h) => /^\*\.(google|com)\b/.test(h) || h === '*');
    assert.equal(broad.length, 0, `${a.id} fazla geniş izin: ${broad.join(', ')}`);
  }
});

// ─── Android kimliği ────────────────────────────────────────────────────────

test(
  'flavor.properties tanınan bir uygulamayı işaret ediyor',
  { skip: !existsSync(join(root, 'android', 'app', 'flavor.properties')) },
  () => {
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
    // Kimlik `id` ile aranır: paket adı devredildiği için packageId artık
    // tek başına bir uygulamayı işaret etmiyor.
    const app = catalog.apps.find((a) => a.id === map.id);
    assert.ok(app, `tanınmayan flavor id: ${map.id}`);
    assert.equal(map.applicationId, app.packageId);
    assert.equal(map.versionName, app.versionName);
    assert.equal(Number(map.versionCode), app.versionCode);
  }
);

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

test('yayınlanan arayüzler derlenmiş', { skip: !anyBuilt }, () => {
  for (const a of published) {
    assert.ok(built(a.id), `${a.id} derlenmemiş`);
  }
});

test('çevrimdışı içerik paketlenmiş', { skip: !anyBuilt }, () => {
  /*
   * Beklenen dosyalar katalogdaki `assets` alanından türetilir — hangi
   * uygulamanın neyi taşıdığını build-app.mjs de oradan okur. Bu liste
   * burada ayrıca yazılıydı ve birleşik uygulama eklendiğinde onu tanımadığı
   * için denetim sessizce atlanmıştı.
   */
  /*
   * Uzantı `.gzc`, `.gz` DEĞİL.
   *
   * Android'in paketleme aracı aapt2, `assets/` altında `.gz` ile biten her
   * dosyayı AAB üretirken açar ve uzantıyı siler; uygulama `.gz` adresini
   * istediği için mevzuat, rehber ve arşiv «yüklenemedi» veriyordu. Sıkıştırılmış
   * varlıklar bu yüzden aapt2'nin tanımadığı `.gzc` uzantısıyla paketlenir.
   * Ayrıntı: docs/AAPT-GZ-TUZAGI.md
   */
  const SENTINELS = {
    packs: ['packs/manifest.json'],
    icthat: ['icthat/seed.json', 'icthat/archive.json.gzc'],
    rehber: ['rehber/guides.json.gzc'],
    // Madde → karar ters indeksi. Eksikse mevzuat bölümü açılır ama
    // «bu maddeye atıf yapan kararlar» hiç görünmez — sessiz kayıp.
    mevzuat: ['mevzuat/atif.json.gzc'],
    // Akademik eserlerin tam metni
    kutuphane: ['kutuphane/eserler.json.gzc'],
  };
  for (const a of published) {
    for (const name of a.assets) {
      const files = SENTINELS[name];
      assert.ok(files, `${a.id}: bilinmeyen varlık kümesi '${name}'`);
      for (const f of files) {
        assert.ok(
          existsSync(join(root, 'flavors', a.id, 'www', f)),
          `${a.id}: www/${f} eksik — uygulama çevrimdışı boş açılır`
        );
      }
    }
  }
});

test('yayınlanan uygulamaların kodu birbirinden farklı', { skip: !anyBuilt }, () => {
  // Ortak satıcı parçaları (react, lucide) kasıtlı olarak aynıdır.
  const VENDOR = /^(react|icons|vendor)-/;
  const seen = new Map();
  for (const a of published) {
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

test('birleşik uygulama dört bölümü de ayrı parça olarak taşıyor', { skip: !built('asistan') }, () => {
  /*
   * Bölümler `lazy` ile bölünmezse açılışta 8.000 maddelik mevzuat bölümü de
   * ayrıştırılır ve ilk açılış yavaşlar. Her bölümün kendi parçası olmalı.
   */
  const dir = join(root, 'flavors', 'asistan', 'www', 'assets');
  const files = readdirSync(dir);
  for (const section of ['PortalApp', 'HesapApp', 'IcthatApp', 'RehberApp']) {
    assert.ok(
      files.some((f) => f.startsWith(`${section}-`) && f.endsWith('.js')),
      `${section} ayrı parça değil — giriş ekranı gereksiz yükleniyor`
    );
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

test('yayınlanan uygulamaların simgesi farklı', { skip: !existsSync(join(root, 'assets', 'icons')) }, () => {
  const seen = new Map();
  for (const a of published) {
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

test('yayınlanan uygulamanın mağaza metni var', () => {
  for (const a of published) {
    for (const f of ['tr-short.txt', 'tr-full.txt']) {
      assert.ok(
        existsSync(join(root, 'store-listing', a.id, f)),
        `${a.id}: store-listing/${a.id}/${f} yok`
      );
    }
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
