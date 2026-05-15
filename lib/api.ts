import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { getCategoryBySlug } from './categories';

const contentDirectory = path.join(process.cwd(), 'content', 'mevzuat');

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

export function getAllKanunDirs() {
  if (!fs.existsSync(contentDirectory)) return [];
  return fs.readdirSync(contentDirectory).filter(file => {
    return fs.statSync(path.join(contentDirectory, file)).isDirectory();
  });
}

export function getArticlesByKanun(kanunId: string) {
  const kanunDir = path.join(contentDirectory, kanunId);
  if (!fs.existsSync(kanunDir)) return [];
  
  const fileNames = fs.readdirSync(kanunDir);
  const allArticles = fileNames.filter(f => f.endsWith('.md')).map(fileName => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(kanunDir, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    
    return {
      id,
      kanunId,
      ...(matterResult.data as { title: string; kanun: string; maddeNo: number })
    };
  });
  
  return allArticles.sort((a, b) => a.maddeNo - b.maddeNo);
}

export function getAllArticles() {
  const kanunDirs = getAllKanunDirs();
  let allArticles: any[] = [];
  
  kanunDirs.forEach(kanunId => {
    const articles = getArticlesByKanun(kanunId);
    allArticles = [...allArticles, ...articles];
  });
  
  return allArticles.sort((a, b) => a.maddeNo - b.maddeNo);
}

export function getArticlesByCategory(categorySlug: string) {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return [];

  const articles = getArticlesByKanun(category.kanunId);
  return articles.filter(article => 
    article.maddeNo >= category.startMadde && 
    article.maddeNo <= category.endMadde
  );
}

export function getNavigationInfo(kanunId: string, currentMaddeNo: number) {
  const articles = getArticlesByKanun(kanunId);
  const prev = articles.find(a => a.maddeNo === currentMaddeNo - 1);
  const next = articles.find(a => a.maddeNo === currentMaddeNo + 1);
  return { prev, next };
}

export async function getArticleData(kanunId: string, id: string): Promise<ArticleData> {
  const fullPath = path.join(contentDirectory, kanunId, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  const matterResult = matter(fileContents);
  const rawContent = matterResult.content;
  
  // Split content by either old placeholder ("### Bizim Yorumumuz")
  // or new commentary marker ("### Akademik Yorum ve Analiz")
  const splitRegex = /\n### (?:Bizim Yorumumuz|Akademik Yorum ve Analiz)\s*\n/;
  const parts = rawContent.split(splitRegex);

  const officialText = (parts[0] || "").trim();
  let commentaryText = parts.length > 1 ? parts[1].trim() : "";

  // If the only commentary content is the legacy placeholder line, treat as empty
  if (commentaryText === "Bu maddeye ait akademik yorum ve analiz yakında eklenecektir.") {
    commentaryText = "";
  }
  
  // Fallback: If officialText is somehow empty but rawContent isn't, use rawContent
  const finalOfficialText = officialText || rawContent;
  
  const officialHtml = await marked(finalOfficialText);
  const commentaryHtml = commentaryText ? await marked(commentaryText) : "";
  
  return {
    id,
    kanunId,
    ...(matterResult.data as { title: string; kanun: string; maddeNo: number }),
    contentHtml: await marked(rawContent),
    officialHtml,
    commentaryHtml
  };
}
