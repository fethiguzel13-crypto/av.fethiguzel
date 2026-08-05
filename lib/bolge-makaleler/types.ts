/** Bölgesel deneme / tarih–mekân makaleleri — “X avukat” SEO değil */

export type MakaleFoto = {
  /** public/ altı yol veya mutlak URL */
  src: string;
  alt: string;
  caption: string;
  credit?: string;
};

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
  /** Bölüm içi foto (opsiyonel) */
  photo?: MakaleFoto;
};

export type MakaleFaq = { q: string; a: string };

export type BolgeMakale = {
  slug: string;
  yerlesim: string;
  il: string;
  kategori: 'tarih' | 'nufus' | 'tasinmaz' | 'olay' | 'miras' | 'ticaret' | 'genel' | 'kultur';
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  eyebrow: string;
  lead: string;
  keyInsight: string;
  okumaDk: number;
  updated: string;
  sections: MakaleBolum[];
  graphics: MakaleGrafik[];
  faq: MakaleFaq[];
  related: { label: string; href: string }[];
  theme: 'lake' | 'mountain' | 'plain' | 'historic' | 'trade';
  /** Kapak fotoğrafı */
  heroPhoto: MakaleFoto;
  /** Ek fotoğraflar (galeri / araya serpiştirme) */
  photos?: MakaleFoto[];
};
