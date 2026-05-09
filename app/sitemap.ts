import { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/api';
import { categories } from '@/lib/categories';
import fs from 'fs';
import path from 'path';

// DEĞİŞTİRİN: Sitenizin yayında olduğu asıl alan adını buraya yazın.
const baseUrl = 'https://avfethiguzel.com';

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
  // 1. Statik Rotalar (Ana sayfa, Mevzuat ana sayfası vb.)
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/mevzuat`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // 2. Kategori Rotaları
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/kategori/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 3. Mevzuat (İçtihat) Makaleleri
  const mevzuatArticles = getAllArticles();
  const mevzuatRoutes = mevzuatArticles.map((article) => ({
    url: `${baseUrl}/mevzuat/${article.kanunId}/${article.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // 4. Kişisel Makaleler (PDF/DOCX)
  const makalelerDir = path.join(process.cwd(), 'public', 'makaleler');
  let personalArticleRoutes: MetadataRoute.Sitemap = [];
  
  if (fs.existsSync(makalelerDir)) {
    const files = getAllFiles(makalelerDir);
    personalArticleRoutes = files
      .filter(file => /\.(pdf|docx|udf)$/i.test(file))
      .map((file) => {
        const relativePath = path.relative(makalelerDir, file);
        // Path sep normalize for URL
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
    ...mevzuatRoutes,
    ...personalArticleRoutes,
  ];
}
