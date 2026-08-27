import fs from 'node:fs';
import path from 'node:path';
import type { CourseNote, UniHubContent, LawUniversity } from './types';
import { LAW_UNIVERSITIES, getActiveUniversities, getUniversityBySlug } from './universiteler';
import { CURRICULUM, getCoreCourses, getCourseByCode } from './mufredat';

export type {
  CourseNote,
  UniHubContent,
  LawUniversity,
  CurriculumCourse,
  NoteDiagram,
  NoteSection,
  NoteExample,
  NoteKart,
  NoteMcq,
  NoteFlashcard,
  NoteMermaid,
  NoteTopic,
  NoteExamBox,
  FsekMeta,
  CourseGraph,
  GraphInstitution,
  FacultyOverlay,
} from './types';
export { LAW_UNIVERSITIES, getActiveUniversities, getUniversityBySlug } from './universiteler';
export { CURRICULUM, getCoreCourses, getCourseByCode } from './mufredat';

type DersNotlariIndex = {
  generatedAt: string;
  wave: string;
  universityCount: number;
  hubCount: number;
  noteCount: number;
  universities: { slug: string; name: string; shortName: string; city: string; priority: number }[];
  notes: { uniSlug: string; courseCode: string; slug: string; title: string; href: string }[];
};

function generatedPath(file: string): string {
  return path.join(
    /* turbopackIgnore: true */ process.cwd(),
    'lib',
    'ders-notlari',
    'generated',
    file
  );
}

function readGenerated<T>(file: string): T {
  return JSON.parse(fs.readFileSync(generatedPath(file), 'utf8')) as T;
}

export const DERS_NOTLARI_INDEX: DersNotlariIndex = readGenerated('index.json');
export const DERS_NOTLARI_HUBS: UniHubContent[] = readGenerated('hubs.json');

/**
 * Monolit notes.json import edilmez.
 * path.join(process.cwd(), …, dynamic) NFT'ye tüm notları yazdırır; turbopackIgnore ile
 * otomatik izleme kapatılır. Runtime için next.config outputFileTracingIncludes notları
 * yalnız /ders-notlari rotalarına ekler (diğer lambdalar 250MB limitine takılmaz).
 */
const NOTES_DIR = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  'lib',
  'ders-notlari',
  'generated',
  'notes'
);

function sanitizeSlug(s: string): string {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}

function readNoteFile(uniSlug: string, courseCode: string): CourseNote | undefined {
  const safeUni = sanitizeSlug(uniSlug);
  const safeCourse = sanitizeSlug(courseCode);
  if (!safeUni || !safeCourse) return undefined;
  const file = path.join(NOTES_DIR, `${safeUni}__${safeCourse}.json`);
  if (!fs.existsSync(file)) return undefined;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as CourseNote;
  } catch {
    return undefined;
  }
}

/**
 * Hub bazen `sigorta-hukuku` listeler; dosya yalnızca `sigorta-hukuku-yillik` olabilir.
 * Eski/kısa kodları mevcut not dosyasına çözer.
 */
export function resolveNoteCourseCode(uniSlug: string, courseCode: string): string | null {
  const safeUni = sanitizeSlug(uniSlug);
  const code = sanitizeSlug(courseCode);
  if (!safeUni || !code) return null;

  const candidates = [
    code,
    `${code}-yillik`,
    `${code}-donem-1`,
    `${code}-donem-2`,
  ];

  // anayasa-1 → anayasa-donem-1 / anayasa-yillik
  if (/-\d+$/.test(code)) {
    const base = code.replace(/-\d+$/, '');
    candidates.push(`${base}-yillik`, `${base}-donem-1`, `${base}-donem-2`, base);
  }

  // medeni-usul → hmk-yillik (yaygın eşleme)
  if (code === 'medeni-usul') {
    candidates.push('hmk-yillik', 'hmk-donem-1', 'hmk');
  }
  if (code === 'icra-iflas') {
    candidates.push('icra-yillik', 'iflas-yillik', 'icra-donem-1');
  }
  if (code === 'ceza-muhakemesi') {
    candidates.push('cmk-yillik', 'cmk-donem-1');
  }
  if (code === 'ticaret-sirketler') {
    candidates.push('sirketler-yillik', 'sirketler-donem-1');
  }

  for (const c of candidates) {
    if (readNoteFile(safeUni, c)) return c;
  }
  return null;
}

export function getHub(uniSlug: string): UniHubContent | undefined {
  const slug = sanitizeSlug(uniSlug);
  const fromFile = DERS_NOTLARI_HUBS.find((h) => h.uni.slug === slug);
  if (fromFile) return fromFile;
  const uni = getUniversityBySlug(slug);
  if (!uni) return undefined;
  const notes = DERS_NOTLARI_INDEX.notes.filter((n) => n.uniSlug === slug);
  return {
    uni,
    title: `${uni.shortName} Hukuk Ders Notları (Ücretsiz PDF) | ${uni.city}`,
    description: `${uni.name} öğrencileri için kaynaklı hukuk ders notları.`,
    h1: `${uni.shortName} Hukuk Fakültesi Ders Notları`,
    lead: `${uni.name} (${uni.city}) öğrencileri için slayt kopyası olmayan, kanonik graf + fakülte örtüsünden üretilmiş notlar.`,
    courses: notes.map((n) => ({
      code: n.courseCode,
      title: n.title,
      year: 2,
      href: n.href,
      ready: true,
    })),
    seoParagraphs: [],
    faq: [],
    updated: new Date().toISOString().slice(0, 10),
  };
}

export function getNote(uniSlug: string, courseCode: string): CourseNote | undefined {
  const resolved = resolveNoteCourseCode(uniSlug, courseCode);
  if (!resolved) return undefined;
  return readNoteFile(uniSlug, resolved);
}

/** Hub listesinde tıklanabilir ders: mevcut nota çözülen href. */
export function resolveHubCourseHref(
  uniSlug: string,
  courseCode: string
): { code: string; href: string } | null {
  const code = resolveNoteCourseCode(uniSlug, courseCode);
  if (!code) return null;
  return { code, href: `/ders-notlari/${sanitizeSlug(uniSlug)}/${code}` };
}

export function getAllUniSlugs(): string[] {
  return getActiveUniversities().map((u) => u.slug);
}

export function getNotesForUni(uniSlug: string): CourseNote[] {
  return DERS_NOTLARI_INDEX.notes
    .filter((n) => n.uniSlug === uniSlug)
    .map((n) => getNote(n.uniSlug, n.courseCode))
    .filter((n): n is CourseNote => Boolean(n));
}

export function getAllNoteParams(): { uni: string; ders: string }[] {
  return DERS_NOTLARI_INDEX.notes.map((n) => ({ uni: n.uniSlug, ders: n.courseCode }));
}
