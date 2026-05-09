import { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/api';
import { lawCategories, getAllSubCategories } from '@/lib/laws';
import fs from 'fs';
import path from 'path';

const baseUrl = 'https://avfethiguzel.com';

// Map new sub-category slugs to old category slugs for data lookup
function getOldSlug(parentSlug: string, subSlug: string): string | null {
  const mapping: Record<string, Record<string, string>> = {
    'medeni-hukuk': {
      'baslangic-hukumleri': 'tmk-baslangic',
      'kisiler-hukuku': 'kisiler-hukuku',
      'aile-hukuku': 'aile-hukuku',
      'miras-hukuku': 'miras-hukuku',
      'esya-hukuku': 'esya-hukuku',
    },
    'borclar-hukuku': {
      'genel-hukumler': 'borclar-genel',
      'ozel-hukumler': 'borclar-ozel',
    },
    'ticaret-hukuku': {
      'ticari-isletme-hukuku': 'ticari-isletme',
      'sirketler-hukuku': 'ticari-sirketler',
      'kiymetli-evrak-hukuku': 'kiymetli-evrak',
      'sigorta-hukuku': 'sigorta-hukuku',
    },
  };
  return mapping[parentSlug]?.[subSlug] ?? null;
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Statik Rotalar
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // 2. Ana Kategori Sayfaları (/medeni-hukuk, /borclar-hukuku, /ticaret-hukuku)
  const categoryRoutes: MetadataRoute.Sitemap = lawCategories.map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // 3. Alt Kategori Sayfaları (/medeni-hukuk/aile-hukuku)
  const subCategoryRoutes: MetadataRoute.Sitemap = [];
  for (const cat of lawCategories) {
    for (const sub of cat.subCategories) {
      subCategoryRoutes.push({
        url: `${baseUrl}/${cat.slug}/${sub.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // 4. Madde Detay Sayfaları (/medeni-hukuk/aile-hukuku/madde-166)
  const articleRoutes: MetadataRoute.Sitemap = [];
  for (const cat of lawCategories) {
    for (const sub of cat.subCategories) {
      const oldSlug = getOldSlug(cat.slug, sub.slug);
      if (!oldSlug) continue;
      
      // Import getArticlesByCategory dynamically
      const { getArticlesByCategory } = await import('@/lib/api');
      const articles = getArticlesByCategory(oldSlug);
      
      for (const article of articles) {
        articleRoutes.push({
          url: `${baseUrl}/${cat.slug}/${sub.slug}/${article.id}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    }
  }

  // 5. Kişisel Makaleler (PDF/DOCX)
  const makalelerDir = path.join(process.cwd(), 'public', 'makaleler');
  let personalArticleRoutes: MetadataRoute.Sitemap = [];
  
  if (fs.existsSync(makalelerDir)) {
    const files = getAllFiles(makalelerDir);
    personalArticleRoutes = files
      .filter(file => /\.(pdf|docx|udf)$/i.test(file))
      .map((file) => {
        const relativePath = path.relative(makalelerDir, file);
        const normalizedPath = relativePath.split(path.sep).join('/');
        const slug = normalizedPath.split('/').map(s => encodeURIComponent(s)).join('/');
        
        return {
          url: `${baseUrl}/makale-oku/${slug}`,
          lastModified: fs.statSync(file).mtime,
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        };
      });
  }

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...subCategoryRoutes,
    ...articleRoutes,
    ...personalArticleRoutes,
  ];
}
