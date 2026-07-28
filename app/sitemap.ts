import { MetadataRoute } from 'next';
import { lawCategories } from '@/lib/laws';
import fs from 'fs';
import path from 'path';

const baseUrl = 'https://www.avfethiguzel.com';

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
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/mevzuat`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/ara`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/icthat`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/hesaplama`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/makaleler`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/eserlerim`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/e-durusma`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/akademik-profil`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/english-speaking-lawyer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/ingilizce-avukat`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/ar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/hizmet-bolgeleri`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/hizmetler`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/rehber`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/rehber/miras-paylasimi`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/rehber/kidem-tazminati`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/rehber/arabuluculuk`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/bilgi`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.92 },
    { url: `${baseUrl}/tarife-guncellemeleri`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/on-form`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
    { url: `${baseUrl}/bookmarklet`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/icthat/haftalik`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/kavram`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/site-haritasi`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/gizlilik`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/yasal-uyari`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Hesaplama araç sayfaları (SEO)
  const { getAllAracIds } = await import('@/lib/hesaplama-meta');
  const hesaplamaRoutes: MetadataRoute.Sitemap = getAllAracIds().map((id) => ({
    url: `${baseUrl}/hesaplama/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Kavram sayfaları
  const { getAllKavramSlugs } = await import('@/lib/kavramlar');
  const kavramRoutes: MetadataRoute.Sitemap = getAllKavramSlugs().map((slug) => ({
    url: `${baseUrl}/kavram/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.82,
  }));

  // Vatandaş SEO rehberleri — pillar yüksek, spoke düşük, bridge (madde özeti) en düşük
  const { VATANDAS_ARTICLES } = await import('@/lib/vatandas-rehberi');
  const bilgiRoutes: MetadataRoute.Sitemap = VATANDAS_ARTICLES.map((a) => ({
    url: `${baseUrl}/bilgi/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: (a.role === 'pillar' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
    priority: a.sitemapPriority ?? (a.role === 'pillar' ? 0.95 : a.role === 'spoke' ? 0.62 : a.role === 'bridge' ? 0.45 : 0.85),
  }));

  // 1b. İlçe/İl Avukat Sayfaları (yerel SEO — Türkiye haritası kökleri)
  const ilceSlugs = [
    'ercis-avukat',
    'van-avukat',
    'muradiye-avukat',
    'agri-avukat',
    'patnos-avukat',
    'caldiran-avukat',
    'ozalp-avukat',
    'tatvan-avukat',
    'bitlis-avukat',
    'adilcevaz-avukat',
    'ahlat-avukat',
    'ankara-avukat',
    'avukat-fethi-guzel',
  ];
  const ilceRoutes: MetadataRoute.Sitemap = ilceSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: slug === 'avukat-fethi-guzel' || slug === 'ankara-avukat' || slug === 'van-avukat' || slug === 'ercis-avukat' ? 0.95 : 0.9,
  }));

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

  // 4. Pretty category madde URLs kaldırıldı — 308 ile /mevzuat/{kanun}/{id}'e gider;
  //    sitemap'te yalnızca canonical /mevzuat yolları (aşağıda §6) yer alır.

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

  // 6. Tüm mevzuat madde sayfaları (/mevzuat/{kanunId}/{id}) — packs
  const { getAllArticles } = await import('@/lib/api');
  const allMevzuat = await getAllArticles();
  // Madde sayfaları: kanun maddesi aramada kral URL (bilgi bridge’lerinden yüksek)
  const mevzuatRoutes: MetadataRoute.Sitemap = allMevzuat.map((article) => ({
    url: `${baseUrl}/mevzuat/${article.kanunId}/${article.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.86,
  }));

  // 7. Kategori arşiv sayfaları (/kategori/{slug})
  const { categories } = await import('@/lib/categories');
  const kategoriRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/kategori/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...hesaplamaRoutes,
    ...kavramRoutes,
    ...bilgiRoutes,
    ...ilceRoutes,
    ...categoryRoutes,
    ...subCategoryRoutes,
    ...mevzuatRoutes,
    ...kategoriRoutes,
    ...personalArticleRoutes,
  ];
}
