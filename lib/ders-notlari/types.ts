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

export type NoteKart = {
  baslik: string;
  govde: string;
};

export type NoteSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  /** Sarı “hap bilgi” kutusu */
  hapBilgi?: string;
  /** Kırmızı “sınav tuzağı” kutusu */
  uyari?: string;
  /** Küçük tanım kartları */
  kartlar?: NoteKart[];
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
  | {
      kind: 'fork';
      title: string;
      left: string;
      right: string;
      leftTitle?: string;
      rightTitle?: string;
    }
  | {
      kind: 'mindmap';
      title: string;
      center: string;
      branches: { label: string; items: string[] }[];
    }
  | { kind: 'cycle'; title: string; steps: string[] }
  | { kind: 'ladder'; title: string; levels: string[] };

export type CourseNote = {
  uniSlug: string;
  courseCode: string;
  slug: string;
  title: string;
  description: string;
  h1: string;
  keywords: string[];
  lead: string;
  /** Tek cümlelik “bu notun vaadi” */
  promise?: string;
  examBox: {
    calendar: CalendarModel;
    typicalWeights: string;
    format: string;
    tips: string[];
  };
  learningOutcomes: string[];
  /** Hızlı okuma: 60 saniyede omurga */
  sixtySecond?: string[];
  sections: NoteSection[];
  examples: NoteExample[];
  diagrams: NoteDiagram[];
  faq: { q: string; a: string }[];
  checklist: string[];
  relatedCourses: string[];
  relatedBilgi: string[];
  updated: string;
  wordTarget: number;
  qualityTier?: 'premium';
  /** Örn. borclar-genel */
  variantOf?: string;
  /** Örn. 1. Dönem (Güz) */
  variantLabel?: string;
};

export type UniHubContent = {
  uni: LawUniversity;
  title: string;
  description: string;
  h1: string;
  lead: string;
  courses: {
    code: string;
    title: string;
    year: ClassYear;
    href: string;
    ready?: boolean;
  }[];
  seoParagraphs: string[];
  faq: { q: string; a: string }[];
  updated: string;
};
