import fs from 'fs';
import path from 'path';
import { gunzipSync } from 'zlib';
import { marked } from 'marked';
import { getCategoryBySlug } from './categories';

/**
 * Content packs live in content-packs/ (build + local) and are also copied to
 * public/content-packs/ so Vercel can serve them as static assets and SSR can
 * fetch them when the serverless FS trace is incomplete.
 */
const packsDirectory = path.join(/*turbopackIgnore: true*/ process.cwd(), 'content-packs');
const publicPacksDirectory = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'content-packs');

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

const packCache = new Map<string, Pack>();

function siteBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`;
  return 'https://avfethiguzel.com';
}

function parsePackBuffer(buf: Buffer): Pack {
  return JSON.parse(gunzipSync(buf).toString('utf8')) as Pack;
}

function readPackFromDisk(kanunId: string): Pack | null {
  for (const dir of [packsDirectory, publicPacksDirectory]) {
    const gzPath = path.join(dir, `${kanunId}.json.gz`);
    if (fs.existsSync(gzPath)) {
      return parsePackBuffer(fs.readFileSync(gzPath));
    }
  }
  return null;
}

async function loadPack(kanunId: string): Promise<Pack> {
  if (packCache.has(kanunId)) return packCache.get(kanunId)!;

  const fromDisk = readPackFromDisk(kanunId);
  if (fromDisk) {
    packCache.set(kanunId, fromDisk);
    return fromDisk;
  }

  // Vercel fallback: static public asset via HTTP (CDN), not serverless FS.
  const url = `${siteBaseUrl()}/content-packs/${kanunId}.json.gz`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) {
    throw new Error(`content-packs/${kanunId}.json.gz yok (disk+fetch ${res.status})`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const pack = parsePackBuffer(buf);
  packCache.set(kanunId, pack);
  return pack;
}

function listKanunIdsFromDisk(): string[] {
  for (const dir of [packsDirectory, publicPacksDirectory]) {
    if (!fs.existsSync(dir)) continue;
    const ids = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.json.gz'))
      .map((f) => f.replace(/\.json\.gz$/, ''))
      .sort();
    if (ids.length) return ids;
  }
  return [];
}

export function getAllKanunDirs(): string[] {
  return listKanunIdsFromDisk();
}

export async function getArticlesByKanun(kanunId: string): Promise<ArticleMeta[]> {
  try {
    const pack = await loadPack(kanunId);
    return Object.entries(pack)
      .map(([id, a]) => ({
        id,
        kanunId,
        title: a.title,
        kanun: a.kanun,
        maddeNo: a.maddeNo,
      }))
      .sort((a, b) => a.maddeNo - b.maddeNo);
  } catch {
    return [];
  }
}

export async function getAllArticles(): Promise<ArticleMeta[]> {
  const allArticles: ArticleMeta[] = [];
  for (const kanunId of getAllKanunDirs()) {
    allArticles.push(...(await getArticlesByKanun(kanunId)));
  }
  return allArticles.sort((a, b) => a.maddeNo - b.maddeNo);
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
