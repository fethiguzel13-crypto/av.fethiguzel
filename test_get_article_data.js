// import { getArticleData } from './lib/api.ts';
// Oh wait, getArticleData is in TypeScript, so let's replicate the exact function in Javascript and print the returned values!
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const contentDirectory = path.join(process.cwd(), 'content', 'mevzuat');

async function testGetArticleData() {
  const fullPath = path.join(contentDirectory, 'ttk', 'madde-1.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  const matterResult = matter(fileContents);
  const rawContent = matterResult.content;
  
  const splitRegex = /\n### (?:Bizim Yorumumuz|Akademik Yorum ve Analiz)\s*\n/;
  const parts = rawContent.split(splitRegex);

  const officialText = (parts[0] || "").trim();
  let commentaryText = parts.length > 1 ? parts[1].trim() : "";

  if (commentaryText === "Bu maddeye ait akademik yorum ve analiz yakında eklenecektir.") {
    commentaryText = "";
  }
  
  const finalOfficialText = officialText || rawContent;
  
  const officialHtml = await marked(finalOfficialText);
  const commentaryHtml = commentaryText ? await marked(commentaryText) : "";
  
  console.log("Returned data properties:");
  console.log("  title:", matterResult.data.title);
  console.log("  kanun:", matterResult.data.kanun);
  console.log("  maddeNo:", matterResult.data.maddeNo);
  console.log("  officialHtml exists:", !!officialHtml);
  console.log("  commentaryHtml exists:", !!commentaryHtml);
  console.log("  commentaryHtml length:", commentaryHtml.length);
  console.log("  commentaryHtml preview:", commentaryHtml.substring(0, 300));
}

testGetArticleData();
