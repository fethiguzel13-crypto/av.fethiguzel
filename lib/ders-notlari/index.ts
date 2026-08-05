import fs from 'node:fs';
import path from 'node:path';
import type { CourseNote, UniHubContent, LawUniversity } from './types';
import { LAW_UNIVERSITIES, getActiveUniversities, getUniversityBySlug } from './universiteler';
import { CURRICULUM, getCoreCourses, getCourseByCode } from './mufredat';
import hubsJson from './generated/hubs.json';
import indexJson from './generated/index.json';

export type {
  CourseNote,
  UniHubContent,
  LawUniversity,
  CurriculumCourse,
  NoteDiagram,
  NoteSection,
  NoteExample,
  NoteKart,
} from './types';
export { LAW_UNIVERSITIES, getActiveUniversities, getUniversityBySlug } from './universiteler';
export { CURRICULUM, getCoreCourses, getCourseByCode } from './mufredat';

export const DERS_NOTLARI_INDEX = indexJson as {
  generatedAt: string;
  wave: string;
  universityCount: number;
  hubCount: number;
  noteCount: number;
  universities: { slug: string; name: string; shortName: string; city: string; priority: number }[];
  notes: { uniSlug: string; courseCode: string; slug: string; title: string; href: string }[];
};

export const DERS_NOTLARI_HUBS = hubsJson as UniHubContent[];

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
  return DERS_NOTLARI_HUBS.find((h) => h.uni.slug === uniSlug);
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
