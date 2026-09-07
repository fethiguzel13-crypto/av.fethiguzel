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
  // turbopackIgnore: yargi-index HTTP ile de servis edilir; NFT'ye public/data basma
  return join(/* turbopackIgnore: true */ process.cwd(), 'public', 'data', 'yargi-index.json.gz');
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

/** Lokal disk okuma — tek göreli path + turbopackIgnore; NFT 50k+ kararı paketlemesin. */
function readLocalJsonText(relFromRoot: string): string {
  try {
    const p = join(/* turbopackIgnore: true */ process.cwd(), relFromRoot);
    if (!existsSync(p)) return '';
    const doc = JSON.parse(readFileSync(p, 'utf8')) as { text?: string };
    return doc.text && doc.text.trim() ? doc.text.trim() : '';
  } catch {
    return '';
  }
}

export function readKararText(id: string, row?: KararRow): string {
  // Vercel/CI: arşiv deploy edilmez; canlı fetch loadKararText'te.
  if (process.env.VERCEL || process.env.CI) return '';

  const safeId = String(id || '').replace(/[^a-zA-Z0-9._-]/g, '');
  if (!safeId) return '';

  for (const y of yearCandidates(row)) {
    const safeY = String(y || 'unknown').replace(/[^a-zA-Z0-9._-]/g, '') || 'unknown';
    const text = readLocalJsonText(`data/yargi-kararlari/decisions/${safeY}/${safeId}.json`);
    if (text) return text;
  }

  const alan = String(row?.a || '').replace(/[^a-zA-Z0-9._-]/g, '');
  const tier = String(row?.r || '').replace(/[^a-zA-Z0-9._-]/g, '');
  if (alan) {
    const text = readLocalJsonText(`data/yargi-kararlari/by-alan/${alan}/${safeId}.json`);
    if (text) return text;
  }
  if (tier) {
    const text = readLocalJsonText(`data/yargi-kararlari/by-tier/${tier}/${safeId}.json`);
    if (text) return text;
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
