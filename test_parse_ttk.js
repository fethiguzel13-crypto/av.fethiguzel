import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content', 'mevzuat');

async function testParse() {
  const fullPath = path.join(contentDirectory, 'ttk', 'madde-1.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  const matterResult = matter(fileContents);
  const rawContent = matterResult.content;
  
  const splitRegex = /\n### (?:Bizim Yorumumuz|Akademik Yorum ve Analiz)\s*\n/;
  const parts = rawContent.split(splitRegex);

  console.log("Parts length:", parts.length);
  console.log("Part 0 length:", parts[0]?.length);
  console.log("Part 1 length:", parts[1]?.length);
  console.log("Part 1 preview:", parts[1]?.substring(0, 200));
}

testParse();
