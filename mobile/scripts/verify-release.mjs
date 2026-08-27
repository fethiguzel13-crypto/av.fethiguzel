#!/usr/bin/env node
/**
 * Yayın öncesi doğrulama kapısı.
 *
 *   node scripts/verify-release.mjs            # aktif flavor
 *   node scripts/verify-release.mjs --all      # dördü birden
 *
 * Play'e yüklemeden önce mekanik olarak doğrulanabilecek her şeyi doğrular.
 * Bu projede daha önce yaşanmış somut hatalara karşı yazıldı:
 *
 *   · dört flavor tanımlıydı ama gradle hep aynı applicationId'yi üretiyordu
 *   · styles.xml tanımsız renk çağırıyordu, proje hiç derlenmemişti
 *   · server.url yüzünden uygulama saf WebView sarmalayıcıydı
 *   · assetlinks.json yer tutucu parmak izi taşıyordu
 *   · dört uygulamanın simgesi bayt bayt aynıydı
 *
 * Çıkış kodu 0 = yüklenebilir, 1 = engel var.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const portal = join(root, '..');
const catalog = JSON.parse(readFileSync(join(root, 'galaxy', 'catalog.json'), 'utf8'));

const all = process.argv.includes('--all');
const only = (process.argv.find((a) => a.startsWith('--app=')) || '').split('=')[1];

const problems = [];
const warnings = [];
const passed = [];

const fail = (m) => problems.push(m);
const warn = (m) => warnings.push(m);
const ok = (m) => passed.push(m);

// ─── 1. Android modülü ───────────────────────────────────────────────────────

function checkAndroidModule() {
  const app = join(root, 'android', 'app');
  if (!existsSync(app)) {
    fail('android/app yok — `npx cap add android` çalıştırılmamış');
    return;
  }

  // styles.xml'in çağırdığı her renk tanımlı mı?
  const values = join(app, 'src', 'main', 'res', 'values');
  const styles = readSafe(join(values, 'styles.xml'));
  const gradle = readSafe(join(app, 'build.gradle'));
  if (styles) {
    const wanted = [...styles.matchAll(/@color\/([A-Za-z_][\w]*)/g)].map((m) => m[1]);
    const defined = new Set();
    for (const f of readdirSync(values).filter((f) => f.endsWith('.xml'))) {
      const src = readSafe(join(values, f)) || '';
      for (const m of src.matchAll(/<color\s+name="([^"]+)"/g)) defined.add(m[1]);
    }
    // build.gradle resValue ile üretilenler de sayılır
    for (const m of gradle.matchAll(/resValue\s+"color",\s*"([^"]+)"/g)) defined.add(m[1]);

    const missing = [...new Set(wanted)].filter((c) => !defined.has(c));
    if (missing.length) fail(`styles.xml tanımsız renk çağırıyor: ${missing.join(', ')}`);
    else ok('tema renkleri tanımlı');
  }

  // strings.xml, build.gradle ile çakışmamalı
  const strings = readSafe(join(values, 'strings.xml')) || '';
  const resValueNames = [...gradle.matchAll(/resValue\s+"string",\s*"([^"]+)"/g)].map((m) => m[1]);
  const clash = resValueNames.filter((n) => strings.includes(`name="${n}"`));
  if (clash.length) fail(`çift kaynak tanımı (AAPT derlemeyi kırar): ${clash.join(', ')}`);
  else ok('kaynak çakışması yok');

  // API seviyesi
  const vars = readSafe(join(root, 'android', 'variables.gradle')) || '';
  const target = Number(/targetSdkVersion\s*=\s*(\d+)/.exec(vars)?.[1] ?? 0);
  if (target < 36) {
    fail(`targetSdk ${target} — Play 31.08.2026'dan itibaren 36 istiyor`);
  } else ok(`targetSdk ${target}`);

  // R8
  if (!/minifyEnabled\s+true/.test(gradle)) warn('release derlemesinde R8 kapalı');
  else ok('R8 açık');

  // İmza
  const ksProps = join(root, 'android', 'keystore.properties');
  if (!existsSync(ksProps)) {
    warn('android/keystore.properties yok — AAB imzasız çıkar (CI gizli anahtarla üretir)');
  } else {
    const p = readSafe(ksProps) || '';
    const storeFile = /storeFile\s*=\s*(.+)/.exec(p)?.[1]?.trim();
    /*
     * Göreli storeFile, android/app/build.gradle'daki Gradle `file()`
     * çağrısının kendisiyle AYNI temele göre çözülmeli — o çağrı app/
     * modülünün proje dizininden (android/app/) çalışır, keystore.properties
     * dosyasının bulunduğu android/'den değil. Burada android/'e göre
     * çözülüp Gradle'da android/app/'e göre çözülmesi, ikisinin FARKLI
     * dosyalara bakması ve Gradle'ın hatasızca sessizce imzasız derlemesi
     * demekti — tam olarak bu projede yaşanmış somut bir hataydı.
     */
    const resolved =
      storeFile && (isAbsolute(storeFile) ? storeFile : join(root, 'android', 'app', storeFile));
    if (!resolved || !existsSync(resolved)) {
      fail(`keystore.properties var ama storeFile bulunamıyor: ${storeFile}`);
    } else ok('release imza anahtarı yerinde');
  }
}

// ─── 2. Flavor kimliği ───────────────────────────────────────────────────────

function checkFlavor(app) {
  const label = `[${app.id}]`;
  const dir = join(root, 'flavors', app.id);

  const cfgPath = join(dir, 'capacitor.config.json');
  if (!existsSync(cfgPath)) {
    fail(`${label} capacitor.config.json yok — build-flavor çalıştırılmamış`);
    return;
  }
  const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));

  // ★ En kritik denetim: uzak URL yüklemek Play'de saf WebView sayılıyor
  if (cfg.server?.url) {
    fail(`${label} capacitor.config server.url taşıyor (${cfg.server.url}) — saf WebView sarmalayıcı`);
  } else ok(`${label} yerel arayüz (server.url yok)`);

  if (cfg.appId !== app.packageId) {
    fail(`${label} capacitor appId (${cfg.appId}) katalogla uyuşmuyor (${app.packageId})`);
  }

  // Derlenmiş arayüz
  const www = join(dir, 'www');
  if (!existsSync(join(www, 'index.html'))) {
    fail(`${label} arayüz derlenmemiş — node scripts/build-app.mjs --app=${app.id}`);
    return;
  }
  const size = dirSize(www);
  ok(`${label} arayüz ${(size / 1048576).toFixed(2)} MB`);

  // Çevrimdışı içerik: uygulama ağsız açıldığında ne gösterecek?
  const assets = expectedAssets(app.id);
  for (const a of assets) {
    if (!existsSync(join(www, a))) {
      fail(`${label} çevrimdışı içerik eksik: www/${a}`);
    }
  }
  if (assets.length) ok(`${label} çevrimdışı içerik yerinde (${assets.join(', ')})`);

  // Pakete GIRMEMESI gereken dosyalar.
  //
  // Karar tam metinleri ücretli; pakete şifreli kasa olarak girer. Şifresiz
  // kopya ya da anahtar dosyası pakete sızarsa üyelik kapısı anlamsızlaşır ve
  // bunu kimse fark etmez — sürüm sessizce açık çıkar. Bu yüzden denetim
  // olumsuz da çalışır: var olması gerekenler kadar OLMAMASI gerekenler de
  // kontrol edilir.
  for (const y of YASAK_VARLIKLAR) {
    if (existsSync(join(www, y))) {
      fail(`${label} pakete girmemesi gereken dosya var: www/${y}`);
    }
  }
  ok(`${label} şifresiz karar metni ve kasa anahtarı pakette değil`);

  /*
    Hiçbir varlık `.gz` ile bitmemeli.

    Android'in paketleme aracı (aapt2), `assets/` altında `.gz` ile biten her
    dosyayı AAB oluştururken AÇAR ve uzantıyı siler: `packs/tbk.json.gz`
    pakete `packs/tbk.json` olarak girer. Uygulama `.gz` adresini istediği
    için mevzuat, rehber, atıf haritası ve arşiv «yüklenemedi» veriyordu.

    Kusur YALNIZ gerçek cihazda görünür — tarayıcıda dosyalar `www`'den
    olduğu gibi sunulduğu için her ekran çalışır. Bir sürüm bu hatayla
    dahili teste çıktı; bu denetim onun tekrarını engeller.

    Doğru uzantı `.gzc` (bkz. app-src/src/lib/varlik.ts → GZ).
  */
  const gzKalanlar = [];
  const tara = (dizin, onek = '') => {
    for (const oge of readdirSync(dizin, { withFileTypes: true })) {
      const goreli = onek ? `${onek}/${oge.name}` : oge.name;
      if (oge.isDirectory()) tara(join(dizin, oge.name), goreli);
      else if (oge.name.endsWith('.gz')) gzKalanlar.push(goreli);
    }
  };
  tara(www);
  if (gzKalanlar.length) {
    fail(
      `${label} ${gzKalanlar.length} varlık .gz uzantısı taşıyor — aapt2 bunları ` +
        `açıp uzantıyı siler, uygulama dosyayı bulamaz. Örnek: ${gzKalanlar[0]}`
    );
  } else {
    ok(`${label} sıkıştırılmış varlıklar aapt2-güvenli uzantıda (.gz yok)`);
  }

  // Sürüm
  const meta = existsSync(join(dir, 'meta.json'))
    ? JSON.parse(readFileSync(join(dir, 'meta.json'), 'utf8'))
    : null;
  if (!meta) fail(`${label} meta.json yok`);
  else if (meta.versionCode !== app.versionCode) {
    fail(`${label} meta versionCode (${meta.versionCode}) ≠ katalog (${app.versionCode})`);
  }
}

/**
 * Hiçbir sürümde pakete girmemesi gereken dosyalar.
 *
 * `build-app.mjs` içindeki PAKETE_GIRMEZ süzgeci bunları zaten eler; burası
 * süzgecin çalıştığını KANITLAYAN ikinci kapıdır. Tek kapıya güvenmenin
 * bedeli, süzgeç bir gün bozulduğunda 111 MB şifresiz kararın mağazaya
 * gitmesidir.
 */
const YASAK_VARLIKLAR = [
  'icthat/fulltext',
  'icthat/fulltext/manifest.json',
  'icthat/kasa-anahtar.json',
];

/**
 * Bir varlık kümesinin varlığını KANITLAYAN dosyalar.
 *
 * Hangi uygulamanın hangi kümeyi taşıdığı katalogdaki `assets` alanından
 * gelir — build-app.mjs de aynı alandan okur. Burada ayrı bir uygulama
 * listesi tutulmuyordu ve `asistan` eklendiğinde `expectedAssets` onu
 * tanımadığı için çevrimdışı içerik denetimi SESSİZCE atlandı; içeriği
 * eksik bir sürüm kapıdan geçebilirdi.
 */
const ASSET_SENTINELS = {
  packs: ['packs/manifest.json'],
  // arama.txt.gz eksikse arama YİNE çalışır, yalnız katlamayı cihazda yapar
  // ve tek tuş saniyelere çıkar. Sessiz bozulma olduğu için denetlenir.
  icthat: [
    'icthat/seed.json',
    'icthat/archive.json.gzc',
    'icthat/arama.txt.gzc',
    'icthat/kasa/manifest.json',
  ],
  rehber: ['rehber/guides.json.gzc'],
  // Madde → karar ters indeksi. Eksikse mevzuat açılır ama «bu maddeye atıf
  // yapan kararlar» hiç görünmez; kullanıcıya hiçbir hata çıkmaz.
  mevzuat: ['mevzuat/atif.json.gzc'],
  // Akademik eserlerin tam metni
  kutuphane: ['kutuphane/eserler.json.gzc'],
};

function expectedAssets(id) {
  const app = catalog.apps.find((a) => a.id === id);
  if (!app) return [];
  if (!Array.isArray(app.assets)) {
    warn(`${id}: katalogda 'assets' alanı yok — çevrimdışı içerik denetlenemiyor`);
    return [];
  }
  return app.assets.flatMap((name) => {
    const files = ASSET_SENTINELS[name];
    if (!files) {
      warn(`${id}: bilinmeyen varlık kümesi '${name}' — verify-release tanımıyor`);
      return [];
    }
    return files;
  });
}

// ─── 3. Aktif flavor Android'e yazılmış mı? ──────────────────────────────────

function checkActiveIdentity() {
  const props = readSafe(join(root, 'android', 'app', 'flavor.properties'));
  if (!props) {
    fail('android/app/flavor.properties yok — build-flavor ile bir flavor etkinleştirin');
    return null;
  }
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
  if (!app) {
    fail(`flavor.properties tanımadığım bir applicationId taşıyor: ${map.applicationId}`);
    return null;
  }

  const rootCfgPath = join(root, 'capacitor.config.json');
  if (existsSync(rootCfgPath)) {
    const rootCfg = JSON.parse(readFileSync(rootCfgPath, 'utf8'));
    if (rootCfg.appId !== map.applicationId) {
      fail(
        `kök capacitor.config appId (${rootCfg.appId}) ile flavor.properties (${map.applicationId}) ayrışmış`
      );
    }
  }

  // www gerçekten aktif flavor'ın mı?
  const activeWww = join(root, 'www', 'index.html');
  if (!existsSync(activeWww)) fail('mobile/www boş — cap sync yanlış içerik paketler');

  ok(`aktif flavor: ${app.id} (${map.applicationId} v${map.versionName}/${map.versionCode})`);
  return app;
}

// ─── 4. Uygulamalar birbirinden ayrı mı? ─────────────────────────────────────

/**
 * Bu bölümün tamamı YALNIZ yayınlanan uygulamalar için anlamlıdır.
 *
 * Dört uygulama `asistan` içinde birleştirildikten sonra eskiler katalogda
 * `published:false` ile duruyor ve `asistan`, Play Console'da kaydı zaten
 * açılmış olan `com.avfethiguzel.hesap` paket adını devraldı. Katalogun
 * tamamı denetlenirse bu devir "yinelenen packageId" diye raporlanır —
 * oysa aynı anda yayında iki uygulama yok. Play'e giden ne ise denetlenen
 * de o olmalı.
 */
function publishedApps() {
  return catalog.apps.filter((a) => a.published === true);
}

function checkDistinctness() {
  const apps = publishedApps();

  if (!apps.length) {
    fail('katalogda yayınlanan uygulama yok (published:true bekleniyor)');
    return;
  }

  // Tek uygulama yayınlanıyorsa "birbirinden ayrı mı" sorusu düşer; Play'in
  // Repetitive Content değerlendirmesi zaten uygulamalar ARASINDA çalışır.
  if (apps.length === 1) {
    ok(`tek uygulama yayınlanıyor: ${apps[0].id} (${apps[0].packageId})`);
    const icon = join(root, 'assets', 'icons', `${apps[0].id}-512.png`);
    if (!existsSync(icon)) {
      warn(`${apps[0].id}: simge yok (assets/icons/${apps[0].id}-512.png) — npm run icons`);
    } else ok('uygulama simgesi yerinde');
    return;
  }

  const ids = new Set(apps.map((a) => a.packageId));
  if (ids.size !== apps.length) fail('yayınlanan uygulamalarda yinelenen packageId var');
  else ok('paket adları benzersiz');

  const accents = new Set(apps.map((a) => a.accent));
  if (accents.size !== apps.length) warn('iki uygulama aynı vurgu rengini kullanıyor');

  // Simge dosyaları farklı mı? (Play "Repetitive Content" için görünür kanıt)
  const hashes = new Map();
  for (const app of apps) {
    const icon = join(root, 'assets', 'icons', `${app.id}-512.png`);
    if (!existsSync(icon)) {
      warn(`${app.id}: özgün simge yok (assets/icons/${app.id}-512.png) — npm run icons`);
      continue;
    }
    const h = createHash('sha1').update(readFileSync(icon)).digest('hex');
    if (hashes.has(h)) {
      fail(`${app.id} ile ${hashes.get(h)} aynı simgeyi kullanıyor — Play tekrar eden içerik riski`);
    }
    hashes.set(h, app.id);
  }
  if (hashes.size === apps.length) ok('her uygulamanın simgesi farklı');

  // Arayüz gerçekten farklı mı?
  //
  // Ortak satıcı parçaları (react, lucide) her uygulamada birebir aynıdır
  // ve öyle olmalıdır; onları karşılaştırmak her seferinde yanlış alarm verir.
  // Ölçülen şey uygulamaya özgü kod: satıcı olmayan parçaların birleşimi.
  const VENDOR = /^(react|icons|vendor)-/;
  const bundleHashes = new Map();
  for (const app of apps) {
    const dir = join(root, 'flavors', app.id, 'www', 'assets');
    if (!existsSync(dir)) continue;
    const own = readdirSync(dir)
      .filter((f) => f.endsWith('.js') && !VENDOR.test(f))
      .sort();
    if (!own.length) continue;

    const h = createHash('sha1');
    for (const f of own) h.update(readFileSync(join(dir, f)));
    const digest = h.digest('hex');

    if (bundleHashes.has(digest)) {
      fail(`${app.id} ile ${bundleHashes.get(digest)} birebir aynı uygulama kodunu paketliyor`);
    }
    bundleHashes.set(digest, app.id);
  }
  if (bundleHashes.size === apps.length) {
    ok('yayınlanan uygulamaların kodu birbirinden farklı');
  }
}

// ─── 5. App Links ────────────────────────────────────────────────────────────

function checkAssetLinks() {
  const file = join(portal, 'public', '.well-known', 'assetlinks.json');
  if (!existsSync(file)) {
    fail('public/.well-known/assetlinks.json yok — App Links doğrulanamaz');
    return;
  }
  let links;
  try {
    links = JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    fail('assetlinks.json geçerli JSON değil');
    return;
  }

  // Yalnız yayınlanan paketler zorunlu: yayında olmayan bir uygulamanın
  // App Links kaydını aramak, birleşmeden sonra kalıcı yanlış alarm üretirdi.
  const apps = publishedApps();
  const declared = new Set(links.map((l) => l?.target?.package_name).filter(Boolean));
  for (const app of apps) {
    if (!declared.has(app.packageId)) {
      fail(`assetlinks.json ${app.packageId} paketini tanımlamıyor`);
    }
  }

  const placeholders = links.filter((l) =>
    (l?.target?.sha256_cert_fingerprints ?? []).some((f) => /REPLACE|XX:XX|^$/.test(String(f)))
  );

  // Bilinçli olarak UYARI, engel değil: Play App Signing sertifikası ilk AAB
  // yüklenmeden üretilmiyor, dolayısıyla parmak izi ilk yüklemeden önce
  // bilinemez. App Links çalışmaz ama uygulama yayınlanabilir; ilk sürümden
  // sonra Play Console → Uygulama bütünlüğü'nden alınıp buraya yazılır.
  if (placeholders.length) {
    warn(
      `assetlinks.json ${placeholders.length} pakette yer tutucu parmak izi taşıyor — ` +
        'App Links ilk yüklemeden sonra Play Console → Uygulama bütünlüğü → ' +
        'Uygulama imzalama anahtarı sertifikası SHA-256 ile tamamlanmalı'
    );
  } else if (apps.every((a) => declared.has(a.packageId))) {
    ok('assetlinks.json yayınlanan paketleri gerçek parmak iziyle tanımlıyor');
  }
}

// ─── 6. Mağaza metinleri ─────────────────────────────────────────────────────

function checkStoreListing(app) {
  const dir = join(root, 'store-listing', app.id);
  if (!existsSync(dir)) {
    warn(`[${app.id}] mağaza metni yok (store-listing/${app.id}/)`);
    return;
  }
  const short = readSafe(join(dir, 'tr-short.txt'));
  const full = readSafe(join(dir, 'tr-full.txt'));
  if (!short) warn(`[${app.id}] kısa açıklama yok`);
  else if (short.trim().length > 80) {
    fail(`[${app.id}] kısa açıklama ${short.trim().length} karakter — Play sınırı 80`);
  }
  if (!full) warn(`[${app.id}] tam açıklama yok`);
  else if (full.trim().length > 4000) {
    fail(`[${app.id}] tam açıklama ${full.trim().length} karakter — Play sınırı 4000`);
  }
  if (short && full && short.trim().length <= 80) ok(`[${app.id}] mağaza metinleri sınırlar içinde`);
}

// ─── Çalıştır ────────────────────────────────────────────────────────────────

console.log('── Android modülü');
checkAndroidModule();

console.log('── flavor kimlikleri');
const active = checkActiveIdentity();

// `--all` yayınlanan uygulamaları gezer; yayınlanmayan bir eskiyi denetlemek
// istersen adıyla iste (`--app=portal`).
const scope = all
  ? publishedApps()
  : only
    ? catalog.apps.filter((a) => a.id === only)
    : active
      ? [active]
      : publishedApps();

for (const app of scope) {
  checkFlavor(app);
  checkStoreListing(app);
}

console.log('── ayırt edilebilirlik');
checkDistinctness();

console.log('── App Links');
checkAssetLinks();

// ─── Rapor ───────────────────────────────────────────────────────────────────

console.log('\n' + '═'.repeat(62));
for (const p of passed) console.log(`  ✓ ${p}`);
for (const w of warnings) console.log(`  ⚠ ${w}`);
for (const p of problems) console.log(`  ✗ ${p}`);
console.log('═'.repeat(62));

if (problems.length) {
  console.log(`\n${problems.length} engel var — yüklemeden önce giderilmeli.`);
  process.exit(1);
}
console.log(
  `\nEngel yok${warnings.length ? ` (${warnings.length} uyarı)` : ''}. AAB üretilebilir.`
);

function readSafe(p) {
  try {
    return readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

function dirSize(dir) {
  let total = 0;
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name);
    total += f.isDirectory() ? dirSize(p) : statSync(p).size;
  }
  return total;
}
