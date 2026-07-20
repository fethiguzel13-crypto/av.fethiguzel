import fs from 'fs';
import path from 'path';
import { gunzipSync } from 'zlib';
import { marked } from 'marked';
import { getCategoryBySlug } from './categories';

/**
 * Content is served from gzip packs (content-packs/*.json.gz), not raw markdown.
 * Raw content/mevzuat is ~380MB and exceeds Vercel serverless tracing limits.
 */
const packsDirectory = path.join(process.cwd(), 'content-packs');

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

function loadPack(kanunId: string): Pack {
  if (packCache.has(kanunId)) return packCache.get(kanunId)!;

  const gzPath = path.join(packsDirectory, `${kanunId}.json.gz`);
  if (!fs.existsSync(gzPath)) {
    throw new Error(
      `content-packs/${kanunId}.json.gz bulunamadı. Çalıştırın: npm run build:packs`
    );
  }

  const gz = fs.readFileSync(gzPath);
  const json = gunzipSync(gz).toString('utf8');
  const pack = JSON.parse(json) as Pack;
  packCache.set(kanunId, pack);
  return pack;
}

export function getAllKanunDirs(): string[] {
  if (!fs.existsSync(packsDirectory)) return [];
  return fs
    .readdirSync(packsDirectory)
    .filter((f) => f.endsWith('.json.gz'))
    .map((f) => f.replace(/\.json\.gz$/, ''))
    .sort();
}

export function getArticlesByKanun(kanunId: string): ArticleMeta[] {
  try {
    const pack = loadPack(kanunId);
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

export function getAllArticles(): ArticleMeta[] {
  const allArticles: ArticleMeta[] = [];
  for (const kanunId of getAllKanunDirs()) {
    allArticles.push(...getArticlesByKanun(kanunId));
  }
  return allArticles.sort((a, b) => a.maddeNo - b.maddeNo);
}

export function getArticlesByCategory(categorySlug: string): ArticleMeta[] {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return [];
  return getArticlesByKanun(category.kanunId).filter(
    (article) =>
      article.maddeNo >= category.startMadde &&
      article.maddeNo <= category.endMadde
  );
}

export function getNavigationInfo(kanunId: string, currentMaddeNo: number) {
  const articles = getArticlesByKanun(kanunId);
  const prev = articles.find((a) => a.maddeNo === currentMaddeNo - 1);
  const next = articles.find((a) => a.maddeNo === currentMaddeNo + 1);
  return { prev, next };
}

export async function getArticleData(kanunId: string, id: string): Promise<ArticleData> {
  const pack = loadPack(kanunId);
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
