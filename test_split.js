import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const contentDirectory = path.join(process.cwd(), 'content', 'mevzuat');

async function testSplit() {
  const fullPath = path.join(contentDirectory, 'ttk', 'madde-1.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  const matterResult = matter(fileContents);
  const rawContent = matterResult.content;
  const htmlContent = await marked(rawContent);
  
  console.log("HTML Content has '<h3':", htmlContent.includes('<h3'));
  
  const regex = /<h3[^>]*>.*?Yorum.*?<\/h3>/i;
  const match = htmlContent.match(regex);
  console.log("Match:", match ? match[0] : "null");
  
  const analysisSplit = htmlContent.split(regex);
  console.log("analysisSplit length:", analysisSplit.length);
  console.log("analysisText preview:", analysisSplit[1]?.substring(0, 200));
}

testSplit();
