#!/usr/bin/env node
/**
 * Karar tam metinlerini paket içinde şifreler.
 *
 *   node scripts/build-yargi-sifrele.mjs
 *
 * ─── Neden ──────────────────────────────────────────────────────────────────
 *
 * Yargıtay arşivinin tam metni ücretli bölümdür; ne var ki 112 MB'lık metin
 * uygulamanın içinde geliyor. Şifresiz bırakıldığında APK dosyasını açan
 * herkes `s00.json.gz` dosyalarını doğrudan okuyabilir ve üyeliğin hiçbir
 * anlamı kalmaz. Bu betik her parçayı AES-256-GCM ile şifreler.
 *
 * ─── Sınırı ─────────────────────────────────────────────────────────────────
 *
 * Bu, sunucu tarafı bir hak yönetimi DEĞİLDİR ve öyle sunulmamalıdır.
 * Uygulama çevrimdışı çalışmak zorunda olduğundan çözme anahtarı da
 * uygulamanın içindedir; JavaScript paketini tersine çeviren biri anahtarı
 * çıkarabilir. Sağladığı koruma şudur:
 *
 *   · APK'yı açıp metinleri doğrudan okumak imkânsız hâle gelir
 *   · Dosyalar tek tek çıkarılıp paylaşılamaz
 *   · `strings` benzeri araçlarla arşivde arama yapılamaz
 *
 * Yani sıradan kopyalamayı durdurur, kararlı bir tersine mühendisi
 * durdurmaz. Gerçek koruma isteniyorsa metinlerin sunucudan, oturum başına
 * anahtarla verilmesi gerekir; bu da çevrimdışı vaadinden vazgeçmek demektir.
 *
 * ─── Anahtar ────────────────────────────────────────────────────────────────
 *
 * Her derlemede yeni bir 32 baytlık anahtar üretilir, dört parçaya bölünür
 * ve her parça ayrı bir sabitle XOR'lanarak derleme değişkenlerine yazılır.
 * Böylece anahtar paket içinde bütün hâlde hiçbir yerde bulunmaz. Çalışma
 * anında parçalar birleştirilip PBKDF2 ile asıl anahtar türetilir.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { randomBytes, createCipheriv, pbkdf2Sync } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const mobile = join(here, '..');
const kaynak = join(mobile, 'data-src', 'icthat', 'fulltext');
const hedef = join(mobile, 'data-src', 'icthat', 'kasa');

if (!existsSync(kaynak)) {
  console.error('[kasa] kaynak yok:', kaynak);
  console.error('[kasa] önce: node scripts/build-icthat-data.mjs');
  process.exit(1);
}

/** Parçaları gizlemek için kullanılan sabitler — anahtarın kendisi değil. */
export const MASKE = [0x3b, 0x91, 0x5d, 0xc7];

/** PBKDF2 tuzu; anahtardan bağımsızdır, paket içinde açıkça durabilir. */
export const TUZ = 'avfethiguzel-yargi-kasa-v1';
export const TUR = 100000;

rmSync(hedef, { recursive: true, force: true });
mkdirSync(hedef, { recursive: true });

// ── Anahtar ─────────────────────────────────────────────────────────────────
const anaSir = randomBytes(32);
const anahtar = pbkdf2Sync(anaSir, TUZ, TUR, 32, 'sha256');

/** Dörde böl, her parçayı kendi maskesiyle XOR'la. */
const parcalar = [];
for (let i = 0; i < 4; i += 1) {
  const dilim = Buffer.from(anaSir.subarray(i * 8, (i + 1) * 8));
  for (let j = 0; j < dilim.length; j += 1) dilim[j] ^= MASKE[i];
  parcalar.push(dilim.toString('base64'));
}

// ── Şifreleme ───────────────────────────────────────────────────────────────
let dosya = 0;
let bayt = 0;
const t0 = Date.now();

for (const ad of readdirSync(kaynak)) {
  if (!ad.endsWith('.json.gz')) continue;
  const veri = readFileSync(join(kaynak, ad));

  const iv = randomBytes(12);
  const sifre = createCipheriv('aes-256-gcm', anahtar, iv);
  const govde = Buffer.concat([sifre.update(veri), sifre.final()]);
  const etiket = sifre.getAuthTag();

  // Biçim: [12 bayt IV][16 bayt doğrulama etiketi][şifreli gövde]
  const cikti = Buffer.concat([iv, etiket, govde]);
  writeFileSync(join(hedef, ad.replace('.json.gz', '.bin')), cikti);
  dosya += 1;
  bayt += cikti.length;
}

// manifest şifrelenmez; yalnız parça sayısını taşır
const manifestYolu = join(kaynak, 'manifest.json');
if (existsSync(manifestYolu)) {
  writeFileSync(join(hedef, 'manifest.json'), readFileSync(manifestYolu));
}

writeFileSync(
  join(mobile, 'data-src', 'icthat', 'kasa-anahtar.json'),
  JSON.stringify({ parcalar, tuz: TUZ, tur: TUR, uretim: new Date().toISOString() }, null, 2)
);

console.log(
  `[kasa] ${dosya} parça şifrelendi · ${(bayt / 1048576).toFixed(1)} MB · ` +
    `${((Date.now() - t0) / 1000).toFixed(0)} sn`
);
console.log('[kasa] anahtar parçaları: data-src/icthat/kasa-anahtar.json (pakete GÖMÜLMEZ)');

if (dosya === 0) {
  console.error('[kasa] hiçbir parça şifrelenmedi — arşiv okunamayacak');
  process.exit(1);
}
