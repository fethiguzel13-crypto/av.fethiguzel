/**
 * Hukuk fakültesi ders notları üretici.
 *
 * Dalga 1: tüm aktif fakülte hub’ları + öncelik-1 fakültelerde çekirdek ders notları
 * (kalite eşiği: derin gövde; şablon spam yok).
 *
 * Run: node scripts/generate-ders-notlari.mjs
 *      node scripts/generate-ders-notlari.mjs --wave=1
 *      node scripts/generate-ders-notlari.mjs --wave=hubs-only
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPremiumNote, hash } from './lib/ders-note-quality.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const OUT_DIR = join(root, 'lib', 'ders-notlari', 'generated');
const UPDATED = '2026-07-29';

const wave = (process.argv.find((a) => a.startsWith('--wave=')) || '--wave=all').split('=')[1];

// —— Load university + curriculum by evaluating TS-like exports via regex/JSON extraction ——
// We maintain parallel JSON snapshots for the generator.
function loadTsArrayExport(filePath, exportName) {
  // For universiteler: export const LAW_UNIVERSITIES: LawUniversity[] = [ ... ];
  const src = readFileSync(filePath, 'utf8');
  const re = new RegExp(
    `export const ${exportName}(?::[^=]+)?=\\s*(\\[[\\s\\S]*?\\n\\]);`
  );
  const m = src.match(re);
  if (!m) throw new Error(`Cannot parse ${exportName} from ${filePath}`);
  // JS object literal (unquoted keys) — not strict JSON
  return new Function(`return (${m[1]});`)();
}

const LAW_UNIVERSITIES = loadTsArrayExport(
  join(root, 'lib/ders-notlari/universiteler.ts'),
  'LAW_UNIVERSITIES'
);
const CURRICULUM = loadTsArrayExport(
  join(root, 'lib/ders-notlari/mufredat.ts'),
  'CURRICULUM'
);

const activeUnis = LAW_UNIVERSITIES.filter((u) => u.active);
const coreCourses = CURRICULUM.filter((c) => c.core);

function pick(arr, seed, i = 0) {
  return arr[(seed + i * 17) % arr.length];
}

function buildHub(uni, availableCourseCodes = null) {
  const list = availableCourseCodes
    ? coreCourses.filter((c) => availableCourseCodes.has(`${uni.slug}::${c.code}`))
    : coreCourses;
  // Hub her zaman tüm çekirdek dersleri listeler; not yoksa “yakında” için de link (404 önleme: not üret)
  const courses = coreCourses.map((c) => ({
    code: c.code,
    title: c.title,
    year: c.year,
    href: `/ders-notlari/${uni.slug}/${c.code}`,
    ready: !availableCourseCodes || availableCourseCodes.has(`${uni.slug}::${c.code}`),
  }));

  return {
    uni,
    title: `${uni.shortName} Hukuk Ders Notları (Ücretsiz PDF) | ${uni.city}`,
    description: `${uni.name} öğrencileri için ücretsiz hukuk ders notları: medeni, borçlar, ceza, usul, icra… Şematik, örnekli, sınav odaklı. ${uni.city}.`,
    h1: `${uni.shortName} Hukuk Fakültesi Ders Notları`,
    lead: `${uni.name} (${uni.city}) öğrencileri için hazırlanan ücretsiz ders notu arşividir. Notlar ana sayfada listelenmez; arama motorları ve bu dizin üzerinden erişilir. Amaç: “${pick(uni.aliases, hash(uni.slug), 0) || uni.shortName + ' hukuk'} ders notları” arayan öğrenciye akademik, utandırmayacak kalitede destek vermek.`,
    courses,
    seoParagraphs: [
      `${uni.shortName}, ${uni.type === 'devlet' ? 'devlet' : 'vakıf'} üniversitesi hukuk fakültesi olarak ${uni.calendar === 'donemlik' ? 'dönemlik' : uni.calendar} eğitim takvimiyle çalışır. Dil profili: ${uni.lang}.`,
      `Bu sayfada ${courseCountLabel(courses.length)} çekirdek ders için not bağlantıları bulunur. İçerikler sürekli genişletilir; PDF indirilebilir sürümler ders sayfalarındadır.`,
      `Uyarı: Notlar resmi müfredatın ve sorumlu öğretim elemanının yerine geçmez. Telifli slayt/fotokopi yayınlanmaz.`,
    ],
    faq: [
      {
        q: `${uni.shortName} hukuk ders notları ücretli mi?`,
        a: 'Hayır, Av. Fethi Güzel Hukuk Portalı üzerinden ücretsizdir.',
      },
      {
        q: 'Hangi dersler var?',
        a: 'Çekirdek müfredat (medeni, borçlar, ceza, usul, icra, ticaret…) dalga dalga tamamlanır; bu hub güncel listeyi gösterir.',
      },
      {
        q: 'PDF var mı?',
        a: 'Ders sayfalarından yazdır / PDF olarak kaydet özelliği sunulur.',
      },
    ],
    updated: UPDATED,
  };
}

function courseCountLabel(n) {
  return String(n);
}

// —— Generate ——
mkdirSync(OUT_DIR, { recursive: true });

const notes = [];

if (wave !== 'hubs-only') {
  const targetUnis =
    wave === '1'
      ? activeUnis.filter((u) => u.priority === 1)
      : wave === '2'
        ? activeUnis.filter((u) => u.priority <= 2)
        : activeUnis;

  // Dalga 1: öncelik-1 fakültelerde tüm çekirdek dersler
  for (const uni of targetUnis) {
    for (const course of coreCourses) {
      notes.push(buildPremiumNote(uni, course, coreCourses));
    }
  }
}

// Tüm aktif fakülteler için en az 1 vitrin not (borçlar-genel) — SEO long-tail
const showcase = coreCourses.find((c) => c.code === 'borclar-genel');
if (showcase && wave !== 'hubs-only') {
  const have = new Set(notes.map((n) => `${n.uniSlug}::${n.courseCode}`));
  for (const uni of activeUnis) {
    const key = `${uni.slug}::${showcase.code}`;
    if (have.has(key)) continue;
    notes.push(buildPremiumNote(uni, showcase, coreCourses));
  }
}

const ready = new Set(notes.map((n) => `${n.uniSlug}::${n.courseCode}`));
const hubs = activeUnis.map((u) => buildHub(u, ready));

const index = {
  generatedAt: new Date().toISOString(),
  wave,
  universityCount: activeUnis.length,
  hubCount: hubs.length,
  noteCount: notes.length,
  universities: activeUnis.map((u) => ({
    slug: u.slug,
    name: u.name,
    shortName: u.shortName,
    city: u.city,
    priority: u.priority,
  })),
  notes: notes.map((n) => ({
    uniSlug: n.uniSlug,
    courseCode: n.courseCode,
    slug: n.slug,
    title: n.title,
    href: `/ders-notlari/${n.uniSlug}/${n.courseCode}`,
  })),
};

writeFileSync(join(OUT_DIR, 'index.json'), JSON.stringify(index, null, 2), 'utf8');
writeFileSync(join(OUT_DIR, 'hubs.json'), JSON.stringify(hubs, null, 2), 'utf8');
// Monolit notes.json yazılmaz (20MB+ bundle riski). Her not ayrı dosyada.

// Per-note files — runtime fs ile okunur
const notesDir = join(OUT_DIR, 'notes');
mkdirSync(notesDir, { recursive: true });
for (const n of notes) {
  writeFileSync(join(notesDir, `${n.slug}.json`), JSON.stringify(n), 'utf8');
}

console.log(
  `[ders-notlari] wave=${wave} hubs=${hubs.length} notes=${notes.length} unis=${activeUnis.length}`
);
console.log(`[ders-notlari] out=${OUT_DIR}`);
