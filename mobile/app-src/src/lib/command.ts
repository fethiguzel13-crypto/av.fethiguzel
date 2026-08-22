import { HESAPLAMA_ARACLAR } from '@/lib/hesaplama-meta';
import { parseMaddeQuery } from './packs';
import { foldTr, type ArchiveRow } from './yargi';

export type CommandKind = 'madde' | 'karar' | 'rehber' | 'hesap' | 'kanun';

export type CommandHit = {
  kind: CommandKind;
  path: string;
  title: string;
  subtitle: string;
  score: number;
};

export type GuideLite = {
  slug: string;
  h1: string;
  category: string;
  lead: string;
  keywords?: string[];
};

export const QUICK_LAWS: { id: string; label: string; name: string }[] = [
  { id: 'tmk', label: 'TMK', name: 'Türk Medeni Kanunu' },
  { id: 'tbk', label: 'TBK', name: 'Türk Borçlar Kanunu' },
  { id: 'tck', label: 'TCK', name: 'Türk Ceza Kanunu' },
  { id: 'hmk', label: 'HMK', name: 'Hukuk Muhakemeleri Kanunu' },
  { id: 'iik', label: 'İİK', name: 'İcra ve İflas Kanunu' },
  { id: 'ttk', label: 'TTK', name: 'Türk Ticaret Kanunu' },
  { id: 'cmk', label: 'CMK', name: 'Ceza Muhakemesi Kanunu' },
  { id: 'is-kanunu', label: 'İş K.', name: 'İş Kanunu' },
];

const KANUN_IDS = [
  ...QUICK_LAWS.map((l) => l.id),
  'vuk',
  'kvkk',
  'tkhk',
  'gvk',
  'kvk',
  'spk',
  'cek',
];

export function runCommand(opts: {
  query: string;
  archive: ArchiveRow[];
  guides: GuideLite[];
}): CommandHit[] {
  const q = opts.query.trim();
  if (q.length < 2) return [];

  const hits: CommandHit[] = [];
  const tokens = foldTr(q).split(/\s+/).filter(Boolean);

  const direct = parseMaddeQuery(q, KANUN_IDS);
  if (direct?.kanunId && direct.maddeNo) {
    hits.push({
      kind: 'madde',
      path: `/mevzuat/${direct.kanunId}/madde-${direct.maddeNo}`,
      title: `${direct.kanunId.toUpperCase()} m. ${direct.maddeNo}`,
      subtitle: 'Kanun maddesi',
      score: 100,
    });
  }

  for (const law of QUICK_LAWS) {
    const hay = foldTr(`${law.id} ${law.label} ${law.name}`);
    if (tokens.every((t) => hay.includes(t))) {
      hits.push({
        kind: 'kanun',
        path: `/mevzuat/${law.id}`,
        title: law.name,
        subtitle: `${law.label} — resmî metin`,
        score: 40,
      });
    }
  }

  for (const tool of HESAPLAMA_ARACLAR) {
    const hay = foldTr(`${tool.baslik} ${tool.tag} ${tool.keywords.join(' ')}`);
    if (!tokens.every((t) => hay.includes(t))) continue;
    hits.push({
      kind: 'hesap',
      path: `/arac/${tool.id}`,
      title: tool.baslik,
      subtitle: `Hesaplama · ${tool.tag}`,
      score: 20,
    });
  }

  for (const g of opts.guides) {
    const hay = foldTr(`${g.h1} ${g.category} ${g.lead} ${(g.keywords || []).join(' ')}`);
    if (!tokens.every((t) => hay.includes(t))) continue;
    hits.push({
      kind: 'rehber',
      path: `/rehber/${g.slug}`,
      title: g.h1,
      subtitle: `Rehber · ${g.category}`,
      score: 28,
    });
  }

  for (const r of opts.archive) {
    const hay = foldTr([r.k, r.d, r.a, r.e, r.r, ...(r.w || [])].join(' '));
    if (!tokens.every((t) => hay.includes(t))) continue;
    hits.push({
      kind: 'karar',
      path: `/karar/${r.i}`,
      title: r.k || r.d || 'Karar',
      subtitle: [r.d, r.t].filter(Boolean).join(' · '),
      score: 24,
    });
    if (hits.filter((h) => h.kind === 'karar').length >= 8) break;
  }

  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, 16);
}

export const KIND_LABEL: Record<CommandKind, string> = {
  madde: 'Madde',
  kanun: 'Kanun',
  karar: 'Yargı',
  rehber: 'Rehber',
  hesap: 'Hesap',
};
