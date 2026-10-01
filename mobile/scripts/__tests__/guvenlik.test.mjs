import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  incelemeOzeti,
  incelemeKoduGecerli,
  yeniIncelemeKodu,
} from '../../app-src/src/lib/inceleme.mjs';

/*
  Mobil uygulama güvenliği (Aylık plan G05).

  Android yapılandırması derleme olmadan da okunabilen düz dosyalardır; burada
  sürüm derlemesine girmeden önce bozulmaması gereken değişmezler kilitlenir.
  Rapor: docs/aylik-plan/raporlar/guvenlik-mobil.md
*/

const mobile = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const repo = join(mobile, '..');
const androidMain = join(mobile, 'android', 'app', 'src', 'main');
const xml = (ad) => readFileSync(join(androidMain, 'res', 'xml', ad), 'utf8');
const yorumsuz = (s) => s.replace(/<!--[\s\S]*?-->/g, '');

function git(...args) {
  return spawnSync('git', args, { cwd: repo, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

/** Depoda izlenen mobil metin dosyaları (büyük veri dosyaları hariç). */
function izlenenMetinDosyalari() {
  const UZANTI = new Set(['.ts', '.tsx', '.mjs', '.js', '.cjs', '.json', '.xml', '.gradle', '.properties', '.md', '.txt', '.ps1', '.html']);
  return git('ls-files', '-z', 'mobile')
    .stdout.split('\0')
    .filter((f) => f && UZANTI.has(extname(f)))
    .filter((f) => {
      const yol = join(repo, f);
      return existsSync(yol) && statSync(yol).size < 1024 * 1024;
    });
}

// ─── M1: mağaza inceleme kodu ────────────────────────────────────────────────

test('inceleme kodu: doğru kod, büyük/küçük harf ve boşluk farkına rağmen kabul edilir', async () => {
  const ozet = await incelemeOzeti('FG-7K2M-Q9RT-4WXZ-HB3N');
  assert.equal(await incelemeKoduGecerli('  fg-7k2m-q9rt-4wxz-hb3n ', ozet), true);
});

test('inceleme kodu: yanlış kod reddedilir', async () => {
  const ozet = await incelemeOzeti('FG-7K2M-Q9RT-4WXZ-HB3N');
  assert.equal(await incelemeKoduGecerli('FG-7K2M-Q9RT-4WXZ-HB3M', ozet), false);
  assert.equal(await incelemeKoduGecerli('', ozet), false);
});

test('inceleme kodu: derlemede özet yoksa özellik kapalıdır', async () => {
  assert.equal(await incelemeKoduGecerli('FG-7K2M-Q9RT-4WXZ-HB3N', ''), false);
  assert.equal(await incelemeKoduGecerli('', ''), false);
  assert.equal(await incelemeKoduGecerli('x', 'özet-değil'), false);
});

test('inceleme kodu: özet düz kodu içermez ve 64 haneli onaltılıktır', async () => {
  const ozet = await incelemeOzeti('FG-7K2M-Q9RT-4WXZ-HB3N');
  assert.match(ozet, /^[0-9a-f]{64}$/);
  assert.ok(!ozet.toUpperCase().includes('7K2M'));
});

test('inceleme kodu: üretilen kod 80 bit rastgelelik taşır ve okunaklıdır', () => {
  const kodlar = new Set(Array.from({ length: 50 }, () => yeniIncelemeKodu()));
  assert.equal(kodlar.size, 50);
  for (const k of kodlar) assert.match(k, /^FG(-[0-9ABCDEFGHJKMNPQRSTVWXYZ]{4}){4}$/);
});

test('inceleme kodu: eski düz kod kaynakta ve izlenen hiçbir mobil dosyada yok', () => {
  // Desen parçalı kurulur; yoksa bu dosyanın kendisi eşleşirdi.
  const eski = new RegExp('FG-' + 'REVIEW-\\d{4}');
  const bulunan = izlenenMetinDosyalari().filter((f) => eski.test(readFileSync(join(repo, f), 'utf8')));
  assert.deepEqual(bulunan, []);
});

test('inceleme kodu: yerel kod dosyası varsa kod izlenen dosyalara ve derlenmiş pakete sızmamış', () => {
  const yerel = join(mobile, 'inceleme-kodu.local.txt');
  if (!existsSync(yerel)) return;
  const kod = readFileSync(yerel, 'utf8').trim().toUpperCase();
  assert.ok(kod.length >= 16, 'yerel kod dosyası boş ya da kısa');

  const sizan = izlenenMetinDosyalari().filter((f) =>
    readFileSync(join(repo, f), 'utf8').toUpperCase().includes(kod)
  );
  assert.deepEqual(sizan, []);

  const flavors = join(mobile, 'flavors');
  for (const app of readdirSync(flavors)) {
    const assets = join(flavors, app, 'www', 'assets');
    if (!existsSync(assets)) continue;
    for (const f of readdirSync(assets).filter((x) => x.endsWith('.js'))) {
      const icerik = readFileSync(join(assets, f), 'utf8').toUpperCase();
      assert.ok(!icerik.includes(kod), `${app}/www/assets/${f} düz kodu içeriyor`);
    }
  }
});

// ─── M2: FileProvider kapsamı ────────────────────────────────────────────────

test('FileProvider ortak depolamanın kökünü paylaşmaz', () => {
  const yollar = yorumsuz(xml('file_paths.xml'));
  assert.doesNotMatch(yollar, /<(external-path|root-path)\b/);
  // Capacitor dosya seçicisinin kamera geçici dosyası: getExternalFilesDir(Pictures)
  assert.match(yollar, /<external-files-path\b[^>]*path="Pictures\/"/);
});

// ─── Manifest ve ağ ─────────────────────────────────────────────────────────

test('manifest: düz metin trafik kapalı, hata ayıklanabilir değil, ağ yapılandırması bağlı', () => {
  const m = yorumsuz(readFileSync(join(androidMain, 'AndroidManifest.xml'), 'utf8'));
  assert.match(m, /android:usesCleartextTraffic="false"/);
  assert.doesNotMatch(m, /android:debuggable="true"/);
  assert.match(m, /android:networkSecurityConfig="@xml\/network_security_config"/);
});

test('manifest: dışa açık tek bileşen ana etkinliktir; FileProvider dışa kapalı', () => {
  const m = yorumsuz(readFileSync(join(androidMain, 'AndroidManifest.xml'), 'utf8'));
  const disaAcik = [...m.matchAll(/<(activity|service|receiver|provider)\b[^>]*android:exported="true"[^>]*>/g)];
  assert.equal(disaAcik.length, 1);
  assert.match(disaAcik[0][0], /android:name="\.MainActivity"/);
  assert.match(m, /<provider[^>]*androidx\.core\.content\.FileProvider[^>]*android:exported="false"/);
});

test('manifest: yalnız gerekli izinler', () => {
  const m = yorumsuz(readFileSync(join(androidMain, 'AndroidManifest.xml'), 'utf8'));
  const izinler = [...m.matchAll(/<uses-permission android:name="([^"]+)"/g)].map((x) => x[1]).sort();
  assert.deepEqual(izinler, [
    'android.permission.ACCESS_NETWORK_STATE',
    'android.permission.INTERNET',
    'android.permission.POST_NOTIFICATIONS',
    'android.permission.RECEIVE_BOOT_COMPLETED',
  ]);
});

test('ağ güvenliği: düz metin yasak, kullanıcı sertifikalarına güvenilmez', () => {
  const n = yorumsuz(xml('network_security_config.xml'));
  assert.match(n, /<base-config cleartextTrafficPermitted="false">/);
  assert.doesNotMatch(n, /cleartextTrafficPermitted="true"/);
  assert.doesNotMatch(n, /src="user"/);
  assert.doesNotMatch(n, /<debug-overrides>/);
});

test('yedekleme: WebView çerezleri ve oturum verisi hiçbir yedeğe girmez', () => {
  const eski = yorumsuz(xml('backup_rules.xml'));
  assert.match(eski, /<exclude domain="file" path="app_webview\/" \/>/);
  assert.match(eski, /<exclude domain="database" path="webviewCookiesChromium.db" \/>/);

  const yeni = yorumsuz(xml('data_extraction_rules.xml'));
  for (const bolum of ['cloud-backup', 'device-transfer']) {
    const govde = new RegExp(`<${bolum}>([\\s\\S]*?)</${bolum}>`).exec(yeni)?.[1] ?? '';
    assert.match(govde, /<exclude domain="file" path="app_webview\/" \/>/, bolum);
    assert.doesNotMatch(govde, /<include domain="(root|database)"/, bolum);
  }
});

// ─── Capacitor yapılandırması (kök + her flavor) ────────────────────────────

test('Capacitor: her yapılandırmada hata ayıklama ve karışık içerik kapalı, gezinme yalnız kendi alan adı', () => {
  const dosyalar = [join(mobile, 'capacitor.config.json')];
  for (const app of readdirSync(join(mobile, 'flavors'))) {
    const f = join(mobile, 'flavors', app, 'capacitor.config.json');
    if (existsSync(f)) dosyalar.push(f);
  }
  assert.ok(dosyalar.length >= 5);
  const IZINLI = new Set(['avfethiguzel.com', '*.avfethiguzel.com', 'play.google.com']);

  for (const f of dosyalar) {
    const c = JSON.parse(readFileSync(f, 'utf8'));
    assert.equal(c.android?.webContentsDebuggingEnabled, false, f);
    assert.equal(c.android?.allowMixedContent, false, f);
    assert.equal(c.server?.url, undefined, `${f}: canlı yeniden yükleme adresi sürüme girmemeli`);
    assert.notEqual(c.server?.cleartext, true, f);
    for (const h of c.android?.allowNavigation ?? []) assert.ok(IZINLI.has(h), `${f}: ${h}`);
  }
});

// ─── Sırlar ─────────────────────────────────────────────────────────────────

test('sırlar: anahtar deposu, şifre, kasa anahtarı ve inceleme kodu dosyaları izlenmez ve yok sayılır', () => {
  const HASSAS = [
    'mobile/fethiguzel-upload.jks',
    'mobile/keystore-password-SIL-SONRA.txt',
    'mobile/keystore-base64-github-secret.txt',
    'mobile/android/keystore.properties',
    'mobile/data-src/icthat/kasa-anahtar.json',
    'mobile/inceleme-kodu.local.txt',
  ];
  const izlenen = git('ls-files', '--', ...HASSAS).stdout.trim();
  assert.equal(izlenen, '');
  for (const f of HASSAS) {
    assert.equal(git('check-ignore', '-q', '--no-index', f).status, 0, `${f} .gitignore kapsamında değil`);
  }
});

test('sırlar: izlenen mobil dosyalarda özel anahtar ya da erişim belirteci deseni yok', () => {
  const DESENLER = [
    /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
    /AKIA[0-9A-Z]{16}/,
    /AIza[0-9A-Za-z_-]{35}/,
    /\bsk-(ant-)?[A-Za-z0-9_-]{20,}/,
    /\bgh[pousr]_[A-Za-z0-9]{36}/,
    /\bxox[abpr]-[A-Za-z0-9-]{10,}/,
  ];
  const bulunan = [];
  for (const f of izlenenMetinDosyalari()) {
    const icerik = readFileSync(join(repo, f), 'utf8');
    for (const d of DESENLER) if (d.test(icerik)) bulunan.push(`${f} ~ ${d.source}`);
  }
  assert.deepEqual(bulunan, []);
});
