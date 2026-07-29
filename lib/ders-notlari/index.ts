import fs from 'node:fs';
import path from 'node:path';
import type { CourseNote, UniHubContent, LawUniversity } from './types';
import { LAW_UNIVERSITIES, getActiveUniversities, getUniversityBySlug } from './universiteler';
import { CURRICULUM, getCoreCourses, getCourseByCode } from './mufredat';
import hubsJson from './generated/hubs.json';
import indexJson from './generated/index.json';

export type { CourseNote, UniHubContent, LawUniversity, CurriculumCourse } from './types';
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

/** Monolit notes.json (20MB+) import edilmez — build/runtime şişmesini önler */
const NOTES_DIR = path.join(process.cwd(), 'lib', 'ders-notlari', 'generated', 'notes');

export function getHub(uniSlug: string): UniHubContent | undefined {
  return DERS_NOTLARI_HUBS.find((h) => h.uni.slug === uniSlug);
}

export function getNote(uniSlug: string, courseCode: string): CourseNote | undefined {
  const file = path.join(NOTES_DIR, `${uniSlug}__${courseCode}.json`);
  if (!fs.existsSync(file)) return undefined;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as CourseNote;
  } catch {
    return undefined;
  }
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
