import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const contentDirectory = path.join(process.cwd(), 'content', 'mevzuat');

async function checkAll() {
  const kanunDir = path.join(contentDirectory, 'ttk');
  if (!fs.existsSync(kanunDir)) {
    console.log("ttk directory does not exist!");
    return;
  }

  const fileNames = fs.readdirSync(kanunDir);
  console.log("Total TTK files:", fileNames.length);

  let emptyCount = 0;
  let nonEmptyCount = 0;
  let sampleNonEmpty = [];

  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md')) continue;
    const fullPath = path.join(kanunDir, fileName);
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

    if (commentaryText === "") {
      emptyCount++;
    } else {
      nonEmptyCount++;
      if (sampleNonEmpty.length < 5) {
        sampleNonEmpty.push({ fileName, text: commentaryText.substring(0, 100) });
      }
    }
  }

  console.log("Empty commentaries:", emptyCount);
  console.log("Non-empty commentaries:", nonEmptyCount);
  console.log("Sample non-empty:", sampleNonEmpty);
}

checkAll();
