/**
 * Hukuk fakültesi olmayan / pasif üni notlarını siler;
 * index + hubs'ı yalnızca active slug'lara göre yeniden yazar.
 *
 * Run: node scripts/cleanup-ders-notlari-fake-unis.mjs
 */
import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const OUT_DIR = join(root, 'lib', 'ders-notlari', 'generated');
const NOTES_DIR = join(OUT_DIR, 'notes');
const UPDATED = new Date().toISOString().slice(0, 10);

function loadTsArrayExport(filePath, exportName) {
  const src = readFileSync(filePath, 'utf8');
  const re = new RegExp(`export const ${exportName}(?::[^=]+)?=\\s*(\\[[\\s\\S]*?\\n\\]);`);
  const m = src.match(re);
  if (!m) throw new Error(`Cannot parse ${exportName}`);
  return new Function(`return (${m[1]});`)();
}

const LAW_UNIVERSITIES = loadTsArrayExport(
  join(root, 'lib/ders-notlari/universiteler.ts'),
  'LAW_UNIVERSITIES'
);
const CURRICULUM = loadTsArrayExport(join(root, 'lib/ders-notlari/mufredat.ts'), 'CURRICULUM');

const activeUnis = LAW_UNIVERSITIES.filter((u) => u.active);
const activeSlugs = new Set(activeUnis.map((u) => u.slug));
const coreCourses = CURRICULUM.filter((c) => c.core);

// —— 1) Delete note files for inactive / removed unis ——
let deleted = 0;
let kept = 0;
const noteFiles = existsSync(NOTES_DIR) ? readdirSync(NOTES_DIR).filter((f) => f.endsWith('.json')) : [];

for (const f of noteFiles) {
  // format: {uniSlug}__{courseCode}.json  (uniSlug may contain hyphens)
  const base = f.replace(/\.json$/, '');
  const sep = base.indexOf('__');
  if (sep < 0) {
    console.warn('skip weird file', f);
    continue;
  }
  const uniSlug = base.slice(0, sep);
  if (!activeSlugs.has(uniSlug)) {
    unlinkSync(join(NOTES_DIR, f));
    deleted++;
  } else {
    kept++;
  }
}

// —— 2) Rebuild index from remaining notes + hubs for all active unis ——
const remaining = existsSync(NOTES_DIR)
  ? readdirSync(NOTES_DIR).filter((f) => f.endsWith('.json'))
  : [];

const notesMeta = [];
for (const f of remaining) {
  const base = f.replace(/\.json$/, '');
  const sep = base.indexOf('__');
  const uniSlug = base.slice(0, sep);
  const courseCode = base.slice(sep + 2);
  let title = `${uniSlug} ${courseCode}`;
  try {
    const n = JSON.parse(readFileSync(join(NOTES_DIR, f), 'utf8'));
    title = n.title || title;
  } catch {
    /* ignore */
  }
  notesMeta.push({
    uniSlug,
    courseCode,
    slug: base,
    title,
    href: `/ders-notlari/${uniSlug}/${courseCode}`,
  });
}

const readyByUni = new Map();
for (const n of notesMeta) {
  if (!readyByUni.has(n.uniSlug)) readyByUni.set(n.uniSlug, new Set());
  readyByUni.get(n.uniSlug).add(n.courseCode);
}

function buildHub(uni) {
  const ready = readyByUni.get(uni.slug) || new Set();
  const courses = coreCourses.map((c) => ({
    code: c.code,
    title: c.title,
    year: c.year,
    href: `/ders-notlari/${uni.slug}/${c.code}`,
    ready: ready.has(c.code),
  }));
  const alias0 = (uni.aliases && uni.aliases[0]) || `${uni.shortName} hukuk`;
  return {
    uni,
    title: `${uni.shortName} Hukuk Ders Notları (Ücretsiz PDF) | ${uni.city}`,
    description: `${uni.name} öğrencileri için ücretsiz hukuk ders notları: medeni, borçlar, ceza, usul, icra… Şematik, örnekli, sınav odaklı. ${uni.city}.`,
    h1: `${uni.shortName} Hukuk Fakültesi Ders Notları`,
    lead: `${uni.name} (${uni.city}) öğrencileri için hazırlanan ücretsiz ders notu arşividir. Notlar ana sayfada listelenmez; arama motorları ve bu dizin üzerinden erişilir. Amaç: “${alias0} ders notları” arayan öğrenciye akademik, utandırmayacak kalitede destek vermek.`,
    courses,
    seoParagraphs: [
      `${uni.shortName}, ${uni.type === 'devlet' ? 'devlet' : 'vakıf'} üniversitesi hukuk fakültesi olarak ${uni.calendar === 'donemlik' ? 'dönemlik' : uni.calendar} eğitim takvimiyle çalışır. Dil profili: ${uni.lang}.`,
      `Bu sayfada ${courses.length} çekirdek ders için not bağlantıları bulunur. İçerikler sürekli genişletilir; PDF indirilebilir sürümler ders sayfalarındadır.`,
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

const hubs = activeUnis.map(buildHub);

const index = {
  generatedAt: new Date().toISOString(),
  wave: 'cleanup-active-only',
  universityCount: activeUnis.length,
  hubCount: hubs.length,
  noteCount: notesMeta.length,
  universities: activeUnis.map((u) => ({
    slug: u.slug,
    name: u.name,
    shortName: u.shortName,
    city: u.city,
    priority: u.priority,
  })),
  notes: notesMeta,
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'index.json'), JSON.stringify(index, null, 2), 'utf8');
writeFileSync(join(OUT_DIR, 'hubs.json'), JSON.stringify(hubs, null, 2), 'utf8');

// Manifest of removed for audit
writeFileSync(
  join(OUT_DIR, 'cleanup-report.json'),
  JSON.stringify(
    {
      at: index.generatedAt,
      deletedNoteFiles: deleted,
      keptNoteFiles: kept,
      activeUniversities: activeUnis.length,
      activeSlugs: [...activeSlugs].sort(),
      inactiveOrRemovedNote: 'deleted if present',
    },
    null,
    2
  ),
  'utf8'
);

console.log(
  `[cleanup] deleted=${deleted} kept=${kept} activeUnis=${activeUnis.length} hubs=${hubs.length} notes=${notesMeta.length}`
);
