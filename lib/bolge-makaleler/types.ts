/** Bölgesel hukuki tarih / olay makaleleri — reklam yasağına uygun bilgilendirme */

export type MakaleGrafik =
  | {
      kind: 'timeline';
      title: string;
      items: { year: string; label: string; note?: string }[];
    }
  | {
      kind: 'bars';
      title: string;
      unit?: string;
      items: { label: string; value: number; hint?: string }[];
    }
  | {
      kind: 'flow';
      title: string;
      steps: string[];
    }
  | {
      kind: 'compare';
      title: string;
      headers: string[];
      rows: string[][];
    }
  | {
      kind: 'map-hint';
      title: string;
      places: { name: string; role: string }[];
    };

export type MakaleBolum = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: { title: string; body: string };
};

export type MakaleFaq = { q: string; a: string };

export type BolgeMakale = {
  slug: string;
  /** Yerleşim / havza etiketi */
  yerlesim: string;
  il: string;
  /** Konu kategorisi */
  kategori: 'tarih' | 'nufus' | 'tasinmaz' | 'olay' | 'miras' | 'ticaret' | 'genel';
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  eyebrow: string;
  lead: string;
  /** Üstte öne çıkan “kilit nokta” */
  keyInsight: string;
  /** Okuma süresi tahmini (dk) */
  okumaDk: number;
  updated: string;
  sections: MakaleBolum[];
  graphics: MakaleGrafik[];
  faq: MakaleFaq[];
  related: { label: string; href: string }[];
  /** Eski *-avukat bilgilendirme sayfası */
  bolgeHref?: string;
  /** Dekoratif gradient teması */
  theme: 'lake' | 'mountain' | 'plain' | 'historic' | 'trade';
};
