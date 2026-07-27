export type VatandasSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type VatandasFaq = {
  q: string;
  a: string;
};

export type VatandasArticle = {
  slug: string;
  /** Google title (~55-60 chars ideal) */
  title: string;
  /** Meta description */
  description: string;
  /** H1 */
  h1: string;
  /** Primary search intents */
  keywords: string[];
  category: string;
  /** Related article slugs */
  related: string[];
  /** Internal mevzuat/tool links */
  links: { label: string; href: string }[];
  lead: string;
  sections: VatandasSection[];
  steps?: string[];
  faq: VatandasFaq[];
  updated: string;
};
