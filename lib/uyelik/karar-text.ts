import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';

export type KararRow = {
  i: string;
  k: string;
  a: string;
  t: string;
  d: string;
  w: string[];
  r: string;
  e: string;
  s: string;
  y: string;
};

let indexCache: KararRow[] | null = null;

function indexPath(): string {
  return join(process.cwd(), 'public', 'data', 'yargi-index.json.gz');
}

export function loadKararIndex(): KararRow[] {
  if (indexCache) return indexCache;
  const p = indexPath();
  if (!existsSync(p)) return [];
  try {
    indexCache = JSON.parse(gunzipSync(readFileSync(p)).toString('utf8')) as KararRow[];
    return indexCache;
  } catch {
    return [];
  }
}

export function findKararRow(id: string): KararRow | undefined {
  const rows = loadKararIndex();
  return rows.find((r) => r.i === id || r.s === id);
}

function yearCandidates(row?: KararRow): string[] {
  const out = new Set<string>();
  if (row?.y) out.add(row.y);
  const m = String(row?.t || '').match(/(\d{4})/);
  if (m) out.add(m[1]);
  out.add('unknown');
  return [...out];
}

function stripHtml(html: string): string {
  return String(html || '')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#305;/g, 'ı')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function readKararText(id: string, row?: KararRow): string {
  const root = join(process.cwd(), 'data', 'yargi-kararlari');
  const years = yearCandidates(row);
  const names = [`${id}.json`];
  for (const y of years) {
    for (const name of names) {
      const p = join(root, 'decisions', y, name);
      if (!existsSync(p)) continue;
      try {
        const doc = JSON.parse(readFileSync(p, 'utf8')) as { text?: string };
        if (doc.text && doc.text.trim()) return doc.text.trim();
      } catch {
        /* skip */
      }
    }
  }
  const fallbacks = [
    join(root, 'by-alan', row?.a || '', `${id}.json`),
    join(root, 'by-tier', row?.r || '', `${id}.json`),
  ];
  for (const p of fallbacks) {
    if (!existsSync(p)) continue;
    try {
      const doc = JSON.parse(readFileSync(p, 'utf8')) as { text?: string };
      if (doc.text && doc.text.trim()) return doc.text.trim();
    } catch {
      /* skip */
    }
  }
  return '';
}

export async function loadKararText(id: string, row?: KararRow): Promise<string> {
  const local = readKararText(id, row);
  if (local) return local;
  if (process.env.YARGI_LIVE_FETCH === '0') return '';
  try {
    const res = await fetch(`https://karararama.yargitay.gov.tr/getDokuman?id=${encodeURIComponent(id)}`, {
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        Referer: 'https://karararama.yargitay.gov.tr/',
      },
      cache: 'no-store',
    });
    if (!res.ok) return '';
    const json = (await res.json()) as { data?: string };
    return stripHtml(json?.data || '');
  } catch {
    return '';
  }
}

export { paragraphs } from './karar-format';
