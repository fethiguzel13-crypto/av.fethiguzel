#!/usr/bin/env node
/**
 * Resmî metinlerdeki OCR kelime bölünmelerini ÖLÇER — düzeltmez.
 *
 *   data/ocr-report.json   (tanı raporu; hiçbir yerde uygulanmaz)
 *
 * ── Sorun ───────────────────────────────────────────────────────────────────
 * Kanun metinleri taranırken kelimeler ortadan bölünmüş: "re ddolunabilir",
 * "tar ihinde", "mirasb ırakanın". 8.087 maddenin 1.027'si etkilenmiş.
 *
 * ── Neden otomatik düzeltmiyoruz ────────────────────────────────────────────
 * İlk sürüm bu bölünmeleri birleştiriyordu. Çıktı gözden geçirilince, listenin
 * içinde gerçek OCR hatasıyla birlikte MEŞRU YAZIM VARYANTLARI olduğu görüldü:
 *
 *     "ay başında"   → "aybaşında"     ← ikisi de doğru, anlamları farklı
 *     "el koyma"     → "elkoyma"       ← ikisi de mevzuatta geçiyor
 *     "büyük şehir"  → "büyükşehir"    ← bağlama göre değişir
 *     "mal varlığı"  → "malvarlığı"    ← ikisi de kullanılıyor
 *
 * Bunları birleştirmek RESMÎ METNİ DEĞİŞTİRİR. Mevzuat uygulamasının tek
 * vaadi metnin Resmî Gazete'deki hâliyle aynı olmasıdır; okunabilirlik için
 * kanun metnine dokunmak, çözdüğü sorundan büyük bir sorun üretir.
 *
 * ── Bunun yerine ne yapıldı ─────────────────────────────────────────────────
 * Bölünmenin yarattığı asıl işlevsel zarar aramadaydı: "zamanaşımı" arayan
 * kullanıcı "zaman aşımı" yazılmış maddeyi bulamıyordu. Arama tarafında
 * boşluklar normalize edildi (app-src/src/lib/packs.ts → foldSearch), metin
 * ise olduğu gibi gösteriliyor.
 *
 * Kalıcı çözüm veri kaynağındadır: metinler mevzuat.gov.tr'den yeniden
 * alınmalıdır. Bu rapor o işin kapsamını gösterir.
 */
import { gunzipSync } from 'node:zlib';
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = existsSync(join(root, 'content-packs'))
  ? join(root, 'content-packs')
  : join(root, 'public', 'content-packs');

const MIN_JOINED = 20; // birleşik biçim en az bu kadar geçmeli
const MAX_FRAGMENT = 50; // parçalardan biri bundan az geçmeli

/**
 * Bölünmüş hâli de meşru olabilen çiftler — asla birleştirilmez.
 * Külliyatta gözle doğrulanmış istisnalar.
 */
const NEVER_JOIN = new Set([
  've ya',
  'bir kaç',
  'her hangi',
  'her kes',
  'bu gün',
  'o na',
  'bir çok',
  'ne den',
  'ne dir',
]);

const packFiles = readdirSync(dir).filter((x) => x.endsWith('.json.gz'));

/**
 * İki geçiş yapılır ve metinler bellekte TUTULMAZ.
 * Tüm resmî metni birden belleğe almak (~24 MB metin + sözlükler) bu makinede
 * sayfa dosyasını taşırıp süreci düşürüyordu.
 */
function eachOfficialText(fn) {
  for (const f of packFiles) {
    const pack = JSON.parse(gunzipSync(readFileSync(join(dir, f))));
    for (const a of Object.values(pack)) {
      const t = String(a.official || '');
      if (t) fn(t.replace(/\r/g, '').toLocaleLowerCase('tr-TR'));
    }
  }
}

// 1. geçiş — kelime sıklığı
const freq = new Map();
eachOfficialText((low) => {
  for (const w of low.match(/[a-zçğıöşüâî]+/g) || []) {
    freq.set(w, (freq.get(w) || 0) + 1);
  }
});

// 2. geçiş — bölünme adayları
const candidates = new Map();
eachOfficialText((low) => {
  const re = /([a-zçğıöşüâî]{2,})\s+([a-zçğıöşüâî]{2,})/g;
  let m;
  while ((m = re.exec(low))) {
    const [, x, y] = m;
    const pair = `${x} ${y}`;
    if (NEVER_JOIN.has(pair)) continue;

    const joined = x + y;
    const fJ = freq.get(joined) || 0;
    if (fJ < MIN_JOINED) continue;

    const fx = freq.get(x) || 0;
    const fy = freq.get(y) || 0;
    if (Math.min(fx, fy) >= MAX_FRAGMENT) continue;

    const rec = candidates.get(pair) || { pair, joined, count: 0, fJoined: fJ, fx, fy };
    rec.count += 1;
    candidates.set(pair, rec);
  }
});

const repairs = [...candidates.values()].sort(
  (a, b) => b.count - a.count || a.pair.localeCompare(b.pair, 'tr')
);

// Kesin OCR hatası olanları, yazım varyantı olabileceklerden ayır.
// Ayraç: parçalardan biri külliyatta 15'ten az geçiyorsa tek başına Türkçe
// kelime değildir, kırıntıdır ("cak", "ırakanın", "dde"). 15 ve üstü ise
// gerçek bir kelime olabilir ve birleştirme yazımı değiştirir.
const CERTAIN = 15;
const certain = repairs.filter((r) => Math.min(r.fx, r.fy) < CERTAIN);
const ambiguous = repairs.filter((r) => Math.min(r.fx, r.fy) >= CERTAIN);

const outDir = join(root, 'data');
mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, 'ocr-report.json'),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      applied: false,
      note:
        'Tanı raporudur; hiçbir yerde uygulanmaz. Resmî metin değiştirilmez. ' +
        'Kalıcı çözüm metinlerin mevzuat.gov.tr’den yeniden alınmasıdır.',
      method: `birleşik ≥${MIN_JOINED} kez VE parçalardan biri <${MAX_FRAGMENT} kez`,
      certainThreshold: CERTAIN,
      counts: {
        patterns: repairs.length,
        occurrences: repairs.reduce((n, r) => n + r.count, 0),
        certainOcr: certain.length,
        ambiguousSpelling: ambiguous.length,
      },
      certainOcr: certain.map((r) => ({ from: r.pair, to: r.joined, n: r.count })),
      ambiguousSpelling: ambiguous.map((r) => ({
        from: r.pair,
        joined: r.joined,
        n: r.count,
        fragmentFreq: [r.fx, r.fy],
      })),
    },
    null,
    2
  )
);

console.log(
  `[ocr] ${repairs.length} desen · ${repairs.reduce((n, r) => n + r.count, 0)} örnek → data/ocr-report.json`
);
console.log(`[ocr]   kesin OCR hatası      : ${certain.length} desen`);
console.log(`[ocr]   yazım varyantı olabilir: ${ambiguous.length} desen (dokunulmaz)`);
console.log('\nkesin OCR hatalarından ilk 12:');
for (const r of certain.slice(0, 12)) {
  console.log(
    `  ${String(r.count).padStart(4)}×  "${r.pair}" → "${r.joined}"   (parçalar ${r.fx}/${r.fy})`
  );
}
console.log('\nyazım varyantı sayıldığı için DOKUNULMAYANLARDAN ilk 8:');
for (const r of ambiguous.slice(0, 8)) {
  console.log(`  ${String(r.count).padStart(4)}×  "${r.pair}" ≠ "${r.joined}"   (parçalar ${r.fx}/${r.fy})`);
}
console.log('\nMetin değiştirilmedi. Arama tarafı boşluk duyarsızdır.');
