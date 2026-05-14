export type DailySource = 'RG' | 'Yargıtay' | 'AYM' | 'AİHM' | 'Mevzuat';

export interface DailyItem {
  id: string;
  source: DailySource;
  sourceLabel: string;
  icon: string;
  category?: string;
  title?: string;
  kunye?: string;
  caseName?: string;
  appNo?: string;
  basvuruNo?: string;
  daire?: string;
  esas?: string;
  karar?: string;
  konu: string;
  publicSummary: string;
  date: string;
  url: string;
  importance?: string;
}

export interface DailyData {
  generatedAt: string;
  dateLabel: string;
  highlights: DailyItem[];
  items: {
    resmigazete: DailyItem[];
    yargitay: DailyItem[];
    aym: DailyItem[];
    hudoc: DailyItem[];
    mevzuat: DailyItem[];
  };
  stats: {
    totalItems: number;
    perSource: Record<string, number>;
  };
  errors: Array<{ source: string; message: string }>;
}

export function itemTitle(item: DailyItem): string {
  return item.title || item.caseName || item.kunye || '(başlık yok)';
}

const TR_MONTHS_SHORT = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];

export function formatTrDate(iso: string): string {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${parseInt(m[3], 10)} ${TR_MONTHS_SHORT[parseInt(m[2], 10) - 1]} ${m[1]}`;
}
