import { gunzipSync } from 'zlib';
import { marked } from 'marked';
import { getCategoryBySlug } from './categories';

/**
 * Listings use public/data/mevzuat-index.json (light).
 * Full article bodies load from public/content-packs/{kanun}.json.gz (CDN).
 * No process.cwd()/fs path patterns — avoids Turbopack over-tracing on Vercel.
 */

export interface ArticleData {
  id: string;
  kanunId: string;
  title: string;
  kanun: string;
  maddeNo: number;
  contentHtml: string;
  officialHtml: string;
  commentaryHtml: string;
}

export interface ArticleMeta {
  id: string;
  kanunId: string;
  title: string;
  kanun: string;
  maddeNo: number;
}

type PackArticle = {
  title: string;
  kanun: string;
  maddeNo: number;
  official: string;
  commentary: string;
};

type Pack = Record<string, PackArticle>;

type IndexItem = {
  kanunId: string;
  id: string;
  title: string;
  kanun: string;
  maddeNo: number;
  snippet?: string;
  body?: string;
  status?: string;
  href?: string;
};

type IndexPayload = { count: number; items: IndexItem[] };

const packCache = new Map<string, Pack>();
let indexCache: IndexItem[] | null = null;

/** Canonical public origin (www — production redirects bare domain → www). */
export const SITE_ORIGIN = 'https://www.avfethiguzel.com';

/**
 * Normalize route id: "13" | "Madde-13" | "madde-13" → "madde-13"
 * Keeps composite ids (madde-13-a) when already prefixed.
 */
export function normalizeMaddeId(id: string): string {
  const raw = decodeURIComponent(String(id || '')).trim();
  if (!raw) return raw;
  const lower = raw.toLowerCase();
  if (/^madde[-_]/.test(lower)) {
    return lower.replace(/_/g, '-');
  }
  // bare number: 13, 13a, 100
  if (/^\d+[a-z]?$/i.test(raw)) {
    return `madde-${lower}`;
  }
  // "Madde 13" / "madde 13"
  const spaced = lower.match(/^madde\s+(\d+[a-z]?)$/i);
  if (spaced) return `madde-${spaced[1]}`;
  return lower.replace(/_/g, '-');
}

function siteBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  // On Vercel, prefer the deployment host for same-deploy static assets.
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;
  }
  return SITE_ORIGIN;
}

function parsePackBuffer(buf: Buffer): Pack {
  if (buf.length >= 2 && buf[0] === 0x1f && buf[1] === 0x8b) {
    return JSON.parse(gunzipSync(buf).toString('utf8')) as Pack;
  }
  return JSON.parse(buf.toString('utf8')) as Pack;
}

async function loadIndex(): Promise<IndexItem[]> {
  if (indexCache) return indexCache;

  // Build-time / local: prefer reading public file without dynamic path join patterns.
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs') as typeof import('fs');
    const candidates = [
      'public/data/mevzuat-index.json',
      './public/data/mevzuat-index.json',
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        const data = JSON.parse(fs.readFileSync(p, 'utf8')) as IndexPayload;
        indexCache = data.items || [];
        return indexCache;
      }
    }
  } catch {
    // fetch
  }

  const res = await fetch(`${siteBaseUrl()}/data/mevzuat-index.json`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as IndexPayload;
  indexCache = data.items || [];
  return indexCache;
}

async function loadPack(kanunId: string): Promise<Pack> {
  if (packCache.has(kanunId)) return packCache.get(kanunId)!;

  // Prefer disk when available (local + Vercel build; packs may be absent in slim lambdas).
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs') as typeof import('fs');
    const candidates = [
      `content-packs/${kanunId}.json.gz`,
      `public/content-packs/${kanunId}.json.gz`,
      `./content-packs/${kanunId}.json.gz`,
      `./public/content-packs/${kanunId}.json.gz`,
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        const pack = parsePackBuffer(fs.readFileSync(p));
        packCache.set(kanunId, pack);
        return pack;
      }
    }
  } catch {
    // HTTP fallback
  }

  const kid = encodeURIComponent(kanunId);
  const urls = [
    // Same origin static first (CDN-backed on Vercel)
    `${SITE_ORIGIN}/content-packs/${kid}.json.gz`,
    `${siteBaseUrl()}/content-packs/${kid}.json.gz`,
    // External mirrors (used by client viewer; reliable for SSR cold starts)
    `https://cdn.jsdelivr.net/gh/fethiguzel13-crypto/av.fethiguzel@main/content-packs/${kid}.json.gz`,
    `https://raw.githubusercontent.com/fethiguzel13-crypto/av.fethiguzel/main/content-packs/${kid}.json.gz`,
  ];

  let lastErr: unknown;
  for (const url of urls) {
    try {
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (!res.ok) {
        lastErr = new Error(`pack ${kanunId}: HTTP ${res.status} from ${url}`);
        continue;
      }
      const ab = await res.arrayBuffer();
      if (ab.byteLength < 64) {
        lastErr = new Error(`pack ${kanunId}: empty body from ${url}`);
        continue;
      }
      const pack = parsePackBuffer(Buffer.from(ab));
      packCache.set(kanunId, pack);
      return pack;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(`pack ${kanunId} load failed`);
}

/** Lightweight meta from mevzuat-index (no pack download). */
export async function getIndexArticle(
  kanunId: string,
  id: string
): Promise<IndexItem | null> {
  const nid = normalizeMaddeId(id);
  const items = await loadIndex();
  return (
    items.find((i) => i.kanunId === kanunId && i.id === nid) ||
    items.find((i) => i.kanunId === kanunId && i.id === id) ||
    null
  );
}

/** Resolve pack key: try normalized id, raw id, bare number keys. */
export async function resolvePackArticle(
  kanunId: string,
  id: string
): Promise<{ key: string; article: PackArticle } | null> {
  const pack = await loadPack(kanunId);
  const candidates = Array.from(
    new Set([normalizeMaddeId(id), id, id.toLowerCase(), `madde-${id}`])
  );
  for (const key of candidates) {
    if (pack[key]) return { key, article: pack[key] };
  }
  // match by maddeNo when id is numeric
  const n = parseInt(String(id).replace(/^madde-/i, ''), 10);
  if (!Number.isNaN(n)) {
    for (const [key, article] of Object.entries(pack)) {
      if (article.maddeNo === n) return { key, article };
    }
  }
  return null;
}

export async function getAllKanunDirs(): Promise<string[]> {
  const items = await loadIndex();
  return Array.from(new Set(items.map((i) => i.kanunId))).sort();
}

export async function getArticlesByKanun(kanunId: string): Promise<ArticleMeta[]> {
  const items = await loadIndex();
  return items
    .filter((i) => i.kanunId === kanunId)
    .map((i) => ({
      id: i.id,
      kanunId: i.kanunId,
      title: i.title,
      kanun: i.kanun,
      maddeNo: i.maddeNo,
    }))
    .sort((a, b) => a.maddeNo - b.maddeNo);
}

export async function getAllArticles(): Promise<ArticleMeta[]> {
  const items = await loadIndex();
  return items
    .map((i) => ({
      id: i.id,
      kanunId: i.kanunId,
      title: i.title,
      kanun: i.kanun,
      maddeNo: i.maddeNo,
    }))
    .sort((a, b) => a.maddeNo - b.maddeNo);
}

export async function getArticlesByCategory(categorySlug: string): Promise<ArticleMeta[]> {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return [];
  return (await getArticlesByKanun(category.kanunId)).filter(
    (article) =>
      article.maddeNo >= category.startMadde &&
      article.maddeNo <= category.endMadde
  );
}

export async function getNavigationInfo(kanunId: string, currentMaddeNo: number) {
  const articles = await getArticlesByKanun(kanunId);
  const prev = articles.find((a) => a.maddeNo === currentMaddeNo - 1);
  const next = articles.find((a) => a.maddeNo === currentMaddeNo + 1);
  return { prev, next };
}

export async function getArticleData(kanunId: string, id: string): Promise<ArticleData> {
  const resolved = await resolvePackArticle(kanunId, id);
  if (!resolved) {
    throw new Error(`Madde bulunamadı: ${kanunId}/${id}`);
  }
  const { key, article: a } = resolved;

  const officialHtml = await marked(a.official);
  const commentaryHtml = a.commentary ? await marked(a.commentary) : '';
  const contentHtml = a.commentary
    ? await marked(`${a.official}\n\n### Akademik Yorum ve Analiz\n\n${a.commentary}`)
    : officialHtml;

  return {
    id: key,
    kanunId,
    title: a.title,
    kanun: a.kanun,
    maddeNo: a.maddeNo,
    contentHtml,
    officialHtml,
    commentaryHtml,
  };
}

/** Plain-text fields for SEO meta (no HTML). */
export async function getArticleSeoFields(
  kanunId: string,
  id: string
): Promise<{
  id: string;
  title: string;
  kanun: string;
  maddeNo: number;
  officialText: string;
  commentaryLead: string;
  headingHint: string;
} | null> {
  const indexHit = await getIndexArticle(kanunId, id);
  try {
    const resolved = await resolvePackArticle(kanunId, id);
    if (resolved) {
      const { key, article: a } = resolved;
      const officialText = String(a.official || '')
        .replace(/[*_#>`\[\]()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const commentaryLead = String(a.commentary || '')
        .replace(/[#>*_`]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 220);
      const headingHint =
        (indexHit?.snippet || '').trim() ||
        officialText.match(/^[^.…]{8,80}/)?.[0]?.trim() ||
        '';
      return {
        id: key,
        title: a.title,
        kanun: a.kanun,
        maddeNo: a.maddeNo,
        officialText,
        commentaryLead,
        headingHint,
      };
    }
  } catch {
    // fall through to index-only
  }
  if (!indexHit) return null;
  const body = String(indexHit.body || indexHit.snippet || '')
    .replace(/\s+/g, ' ')
    .trim();
  return {
    id: indexHit.id,
    title: indexHit.title,
    kanun: indexHit.kanun,
    maddeNo: indexHit.maddeNo,
    officialText: body.slice(0, 400),
    commentaryLead: body.slice(0, 220),
    headingHint: (indexHit.snippet || '').trim(),
  };
}
