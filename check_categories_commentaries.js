import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content', 'mevzuat');

const categories = [
  {
    id: 'ticari-isletme',
    name: 'Ticari İşletme Hukuku',
    startMadde: 1,
    endMadde: 123
  },
  {
    id: 'ticari-sirketler',
    name: 'Ticaret Şirketleri',
    startMadde: 124,
    endMadde: 644
  },
  {
    id: 'kiymetli-evrak',
    name: 'Kıymetli Evrak Hukuku',
    startMadde: 645,
    endMadde: 849
  },
  {
    id: 'sigorta-hukuku',
    name: 'Sigorta Hukuku',
    startMadde: 1401,
    endMadde: 1520
  }
];

function checkCategories() {
  const kanunDir = path.join(contentDirectory, 'ttk');
  if (!fs.existsSync(kanunDir)) {
    console.log("ttk directory does not exist!");
    return;
  }

  const fileNames = fs.readdirSync(kanunDir);
  const articles = fileNames.filter(f => f.endsWith('.md')).map(fileName => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(kanunDir, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const rawContent = matterResult.content;

    const splitRegex = /\n### (?:Bizim Yorumumuz|Akademik Yorum ve Analiz)\s*\n/;
    const parts = rawContent.split(splitRegex);
    let commentaryText = parts.length > 1 ? parts[1].trim() : "";
    if (commentaryText === "Bu maddeye ait akademik yorum ve analiz yakında eklenecektir.") {
      commentaryText = "";
    }

    return {
      maddeNo: matterResult.data.maddeNo,
      hasCommentary: commentaryText !== ""
    };
  });

  categories.forEach(cat => {
    const catArticles = articles.filter(a => a.maddeNo >= cat.startMadde && a.maddeNo <= cat.endMadde);
    const withComm = catArticles.filter(a => a.hasCommentary);
    console.log(`Category: ${cat.name}`);
    console.log(`  Total articles on disk: ${catArticles.length}`);
    console.log(`  With commentaries: ${withComm.length}`);
    console.log(`  Without commentaries: ${catArticles.length - withComm.length}`);
  });
}

checkCategories();
