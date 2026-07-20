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
};

type IndexPayload = { count: number; items: IndexItem[] };

const packCache = new Map<string, Pack>();
let indexCache: IndexItem[] | null = null;

function siteBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  return 'https://avfethiguzel.com';
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

  // Build-time / local disk (relative paths only — no process.cwd() for Turbopack)
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
    // HTTP
  }

  const url = `${siteBaseUrl()}/content-packs/${encodeURIComponent(kanunId)}.json.gz`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`pack ${kanunId}: HTTP ${res.status}`);
  const pack = parsePackBuffer(Buffer.from(await res.arrayBuffer()));
  packCache.set(kanunId, pack);
  return pack;
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
  const pack = await loadPack(kanunId);
  const a = pack[id];
  if (!a) {
    throw new Error(`Madde bulunamadı: ${kanunId}/${id}`);
  }

  const officialHtml = await marked(a.official);
  const commentaryHtml = a.commentary ? await marked(a.commentary) : '';
  const contentHtml = a.commentary
    ? await marked(`${a.official}\n\n### Akademik Yorum ve Analiz\n\n${a.commentary}`)
    : officialHtml;

  return {
    id,
    kanunId,
    title: a.title,
    kanun: a.kanun,
    maddeNo: a.maddeNo,
    contentHtml,
    officialHtml,
    commentaryHtml,
  };
}
