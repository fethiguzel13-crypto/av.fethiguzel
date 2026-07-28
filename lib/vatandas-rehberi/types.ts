export type VatandasSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type VatandasFaq = {
  q: string;
  a: string;
};

/** pillar = ana rehber; spoke = yan niyet; bridge = madde özeti (canonical mevzuat’a); standard = bağımsız */
export type VatandasRole = 'pillar' | 'spoke' | 'bridge' | 'standard';

/** Çalışılmış örnek / senaryo kutusu */
export type VatandasExample = {
  title: string;
  body: string;
  takeaway?: string;
};

/** «Ne olur?» senaryosu */
export type VatandasScenario = {
  title: string;
  facts: string;
  outcome: string;
};

/** Karşılaştırma / kontrol tablosu */
export type VatandasTable = {
  caption: string;
  headers: string[];
  rows: string[][];
};

/** Diyagram tipi — UI SVG seçer */
export type VatandasVisual =
  | 'process'
  | 'fork'
  | 'clock'
  | 'scale'
  | 'stack'
  | 'shield';

export type VatandasArticle = {
  slug: string;
  /** Google title (~55-60 chars ideal) */
  title: string;
  /** Meta description */
  description: string;
  /** H1 */
  h1: string;
  /** Primary search intents — spoke’larda pillar ile çakışmayan dar anahtarlar */
  keywords: string[];
  category: string;
  /** Related article slugs — spoke’ta ilk eleman pillar olmalı */
  related: string[];
  /** Internal mevzuat/tool links */
  links: { label: string; href: string }[];
  lead: string;
  sections: VatandasSection[];
  steps?: string[];
  faq: VatandasFaq[];
  updated: string;
  /** SEO rolü */
  role?: VatandasRole;
  /** Spoke ise ana rehber slug */
  pillar?: string;
  /** Spoke’un tek cümlelik niyeti (UI + iç link) */
  angle?: string;
  /**
   * Absolute path canonical override (ör. /mevzuat/tbk/madde-125).
   * Yoksa /bilgi/{slug} kullanılır.
   */
  canonicalPath?: string;
  /** Sitemap priority ipucu 0–1 */
  sitemapPriority?: number;
  /** Çalışılmış örnekler (görsel kart) */
  examples?: VatandasExample[];
  /** Senaryo kutuları */
  scenarios?: VatandasScenario[];
  /** Karşılaştırma tablosu */
  table?: VatandasTable;
  /** Kontrol listesi */
  checklist?: string[];
  /** Üst görsel diyagram tipi */
  visual?: VatandasVisual;
  /** Tek cümlelik «kilit nokta» şeridi */
  keyInsight?: string;
};
