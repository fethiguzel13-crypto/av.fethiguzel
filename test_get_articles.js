import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content', 'mevzuat');

const categories = [
  {
    id: 'ticari-isletme',
    slug: 'ticari-isletme',
    name: 'Ticari İşletme Hukuku',
    kanunId: 'ttk',
    startMadde: 1,
    endMadde: 123
  },
  {
    id: 'ticari-sirketler',
    slug: 'ticari-sirketler',
    name: 'Ticaret Şirketleri',
    kanunId: 'ttk',
    startMadde: 124,
    endMadde: 644
  },
  {
    id: 'kiymetli-evrak',
    slug: 'kiymetli-evrak',
    name: 'Kıymetli Evrak Hukuku',
    kanunId: 'ttk',
    startMadde: 645,
    endMadde: 849
  },
  {
    id: 'sigorta-hukuku',
    slug: 'sigorta-hukuku',
    name: 'Sigorta Hukuku',
    kanunId: 'ttk',
    startMadde: 1401,
    endMadde: 1520
  }
];

function getArticlesByKanun(kanunId) {
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
      ...(matterResult.data)
    };
  });
  
  return allArticles.sort((a, b) => a.maddeNo - b.maddeNo);
}

categories.forEach(category => {
  const articles = getArticlesByKanun(category.kanunId);
  const filtered = articles.filter(article => 
    article.maddeNo >= category.startMadde && 
    article.maddeNo <= category.endMadde
  );
  console.log(`Category: ${category.name} (${category.slug}) -> Total: ${articles.length}, Filtered: ${filtered.length}`);
  if (filtered.length > 0) {
    console.log(`  First article: ${filtered[0].title}, maddeNo: ${filtered[0].maddeNo}`);
  }
});
