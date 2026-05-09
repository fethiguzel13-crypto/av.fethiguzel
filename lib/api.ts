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

export async function getArticleData(kanunId: string, id: string): Promise<ArticleData> {
  const fullPath = path.join(contentDirectory, kanunId, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  const matterResult = matter(fileContents);
  const contentHtml = await marked(matterResult.content);
  
  return {
    id,
    kanunId,
    ...(matterResult.data as { title: string; kanun: string; maddeNo: number }),
    contentHtml
  };
}
