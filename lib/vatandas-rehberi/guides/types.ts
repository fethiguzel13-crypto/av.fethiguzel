export type GuideNote = {
  heading: string;
  paragraphs: string[];
};

export type VatandasGuide = {
  steps: string[];
  docs: string[];
  notes: GuideNote[];
};

export type GuideMap = Record<string, VatandasGuide>;
