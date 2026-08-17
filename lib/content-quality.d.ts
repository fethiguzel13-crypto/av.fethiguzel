export type QualityVerdict = 'ok' | 'template' | 'thin' | 'empty';

export type QualityReport = {
  verdict: QualityVerdict;
  /** Eşleşen kalıp parmak izi sayısı */
  hits: number;
  /** Hangi parmak izleri eşleşti — hata ayıklama ve rapor için */
  matched: string[];
  /** Yayına ve indekse uygun mu? */
  publishable: boolean;
  /** Kullanıcıya gösterilecek gerekçe (publishable=false iken dolu) */
  reason?: string;
};

export type GuideParts = {
  lead?: string;
  sections?: { paragraphs?: string[]; bullets?: string[] }[];
  faq?: { a: string }[];
};

export declare const TEMPLATE_FINGERPRINTS: string[];
export declare const GUIDE_FINGERPRINTS: string[];
export declare const LECTURE_FINGERPRINTS: string[];
export declare const CHEQUE_LAWS: Set<string>;
export declare const NO_CASELAW_MARKER: string;

export declare function fold(s: string): string;
export declare function auditCommentary(kanunId: string, commentary: string): QualityReport;
export declare function auditGuide(parts: GuideParts): QualityReport;
export declare function auditLectureNote(note: unknown): QualityReport;
export declare function hasRealCaseLaw(commentary: string): boolean;
export declare function isOfficialTextComplete(official: string): boolean;
