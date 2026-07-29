import type { CourseNote, UniHubContent, LawUniversity } from './types';
import { LAW_UNIVERSITIES, getActiveUniversities, getUniversityBySlug } from './universiteler';
import { CURRICULUM, getCoreCourses, getCourseByCode } from './mufredat';
import hubsJson from './generated/hubs.json';
import notesJson from './generated/notes.json';
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
export const DERS_NOTLARI_NOTES = notesJson as CourseNote[];

export function getHub(uniSlug: string): UniHubContent | undefined {
  return DERS_NOTLARI_HUBS.find((h) => h.uni.slug === uniSlug);
}

export function getNote(uniSlug: string, courseCode: string): CourseNote | undefined {
  return DERS_NOTLARI_NOTES.find((n) => n.uniSlug === uniSlug && n.courseCode === courseCode);
}

export function getAllUniSlugs(): string[] {
  return getActiveUniversities().map((u) => u.slug);
}

export function getNotesForUni(uniSlug: string): CourseNote[] {
  return DERS_NOTLARI_NOTES.filter((n) => n.uniSlug === uniSlug);
}

export function getAllNoteParams(): { uni: string; ders: string }[] {
  return DERS_NOTLARI_NOTES.map((n) => ({ uni: n.uniSlug, ders: n.courseCode }));
}
