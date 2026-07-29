/** Hukuk fakültesi ders notları — tip tanımları */

export type UniType = 'devlet' | 'vakif';
export type CalendarModel = 'donemlik' | 'yillik' | 'karma';
export type LangProfile = 'tr' | 'tr-en30' | 'en' | 'fr';
export type ClassYear = 1 | 2 | 3 | 4;

export type LawUniversity = {
  slug: string;
  name: string;
  shortName: string;
  city: string;
  type: UniType;
  calendar: CalendarModel;
  lang: LangProfile;
  /** SEO için alternatif arama adları */
  aliases: string[];
  /** Aktif eğitim varsayımı */
  active: boolean;
  /** Not üretim önceliği 1=yüksek */
  priority: 1 | 2 | 3;
  notes?: string;
};

export type CurriculumCourse = {
  code: string;
  title: string;
  year: ClassYear;
  semester?: 'guz' | 'bahar' | 'yillik';
  area: 'ozel' | 'kamu' | 'usul' | 'ticaret' | 'genel' | 'secmeli';
  keywords: string[];
  /** Çekirdek (tüm fakültelerde üretilir) */
  core: boolean;
};

export type NoteSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type NoteExample = {
  title: string;
  facts: string;
  analysis: string;
  takeaway: string;
};

export type NoteDiagram =
  | { kind: 'process'; title: string; steps: string[] }
  | { kind: 'compare'; title: string; headers: string[]; rows: string[][] }
  | { kind: 'fork'; title: string; left: string; right: string };

export type CourseNote = {
  uniSlug: string;
  courseCode: string;
  slug: string;
  title: string;
  description: string;
  h1: string;
  keywords: string[];
  lead: string;
  examBox: {
    calendar: CalendarModel;
    typicalWeights: string;
    format: string;
    tips: string[];
  };
  learningOutcomes: string[];
  sections: NoteSection[];
  examples: NoteExample[];
  diagrams: NoteDiagram[];
  faq: { q: string; a: string }[];
  checklist: string[];
  relatedCourses: string[];
  relatedBilgi: string[];
  updated: string;
  wordTarget: number;
};

export type UniHubContent = {
  uni: LawUniversity;
  title: string;
  description: string;
  h1: string;
  lead: string;
  courses: { code: string; title: string; year: ClassYear; href: string }[];
  seoParagraphs: string[];
  faq: { q: string; a: string }[];
  updated: string;
};
