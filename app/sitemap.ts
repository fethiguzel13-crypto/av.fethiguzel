import { MetadataRoute } from 'next';
import { lawCategories } from '@/lib/laws';
import fs from 'fs';
import path from 'path';

const baseUrl = 'https://www.avfethiguzel.com';

/**
 * Single sitemap (Google 50k limit; we are ~9k).
 * generateSitemaps index was 500 on Next 16 — keep one reliable /sitemap.xml.
 * Order: high-value surfaces first (bilgi, core hubs, TBK head, then rest).
 */
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  for (const file of fs.readdirSync(dirPath)) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) getAllFiles(fullPath, arrayOfFiles);
    else arrayOfFiles.push(fullPath);
  }
  return arrayOfFiles;
}

const CORE_KANUN = new Set(['tbk', 'tmk', 'tck', 'hmk', 'iik', 'cmk', 'ttk', 'is-kanunu']);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/mevzuat`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.98 },
    { url: `${baseUrl}/ara`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.98 },
    { url: `${baseUrl}/bilgi`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.96 },
    { url: `${baseUrl}/icthat`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/hesaplama`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/makaleler`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/eserlerim`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/e-durusma`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/akademik-profil`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/english-speaking-lawyer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/ingilizce-avukat`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/ar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/hizmet-bolgeleri`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/ders-notlari`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.88 },
    { url: `${baseUrl}/hizmetler`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/rehber`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/rehber/miras-paylasimi`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/rehber/kidem-tazminati`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/rehber/arabuluculuk`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/tarife-guncellemeleri`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/on-form`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
    { url: `${baseUrl}/icthat/haftalik`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/kavram`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/site-haritasi`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.55 },
    { url: `${baseUrl}/gizlilik`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/yasal-uyari`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const { getAllAracIds } = await import('@/lib/hesaplama-meta');
  const hesaplamaRoutes: MetadataRoute.Sitemap = getAllAracIds().map((hid) => ({
    url: `${baseUrl}/hesaplama/${hid}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const { getAllKavramSlugs } = await import('@/lib/kavramlar');
  const kavramRoutes: MetadataRoute.Sitemap = getAllKavramSlugs().map((slug) => ({
    url: `${baseUrl}/kavram/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.82,
  }));

  // Vatandaş rehberi — Google discovery priority (early in file)
  const { VATANDAS_ARTICLES, getVatandasCategories } = await import('@/lib/vatandas-rehberi');
  const bilgiRoutes: MetadataRoute.Sitemap = VATANDAS_ARTICLES.map((a) => ({
    url: `${baseUrl}/bilgi/${a.slug}`,
    lastModified: new Date(a.updated || '2026-07-29'),
    changeFrequency: (a.role === 'pillar' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
    priority:
      a.sitemapPriority ??
      (a.role === 'pillar' ? 0.95 : a.role === 'spoke' ? 0.72 : a.role === 'bridge' ? 0.55 : 0.85),
  }));
  const bilgiKategoriRoutes: MetadataRoute.Sitemap = getVatandasCategories().map((cat) => ({
    url: `${baseUrl}/bilgi/kategori/${encodeURIComponent(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

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
  // Bölgesel bilgilendirme: index'e açık ama ana sayfa kadar öncelikli değil
  const ilceRoutes: MetadataRoute.Sitemap = ilceSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: slug === 'avukat-fethi-guzel' ? 0.9 : 0.55,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = lawCategories.map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

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

  const { categories } = await import('@/lib/categories');
  const kategoriRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/kategori/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const { getAllKanunDirs, getAllArticles } = await import('@/lib/api');
  const kanunHubs: MetadataRoute.Sitemap = (await getAllKanunDirs()).map((kid) => ({
    url: `${baseUrl}/mevzuat/${kid}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: CORE_KANUN.has(kid) ? 0.94 : 0.85,
  }));

  const allMevzuat = await getAllArticles();
  // Core first (TBK/TMK/…), then others — better crawl budget for «TBK 13»
  const sorted = [...allMevzuat].sort((a, b) => {
    const ac = CORE_KANUN.has(a.kanunId) ? 0 : 1;
    const bc = CORE_KANUN.has(b.kanunId) ? 0 : 1;
    if (ac !== bc) return ac - bc;
    if (a.kanunId !== b.kanunId) return a.kanunId.localeCompare(b.kanunId);
    return a.maddeNo - b.maddeNo;
  });
  const mevzuatRoutes: MetadataRoute.Sitemap = sorted.map((article) => {
    const isCore = CORE_KANUN.has(article.kanunId);
    const head = isCore && article.maddeNo <= 100;
    return {
      url: `${baseUrl}/mevzuat/${article.kanunId}/${article.id}`,
      lastModified: new Date(),
      changeFrequency: (isCore ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: head ? 0.93 : isCore ? 0.88 : 0.78,
    };
  });

  const makalelerDir = path.join(process.cwd(), 'public', 'makaleler');
  let personalArticleRoutes: MetadataRoute.Sitemap = [];
  if (fs.existsSync(makalelerDir)) {
    personalArticleRoutes = getAllFiles(makalelerDir)
      .filter((file) => /\.(pdf|docx|udf)$/i.test(file))
      .map((file) => {
        const relativePath = path.relative(makalelerDir, file);
        const slug = relativePath
          .split(path.sep)
          .map((s) => encodeURIComponent(s))
          .join('/');
        return {
          url: `${baseUrl}/makale-oku/${slug}`,
          lastModified: fs.statSync(file).mtime,
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        };
      });
  }

  // High-value first for crawlers that read only the start of large sitemaps
  return [
    ...staticRoutes,
    ...kanunHubs,
    ...bilgiRoutes,
    ...bilgiKategoriRoutes,
    ...hesaplamaRoutes,
    ...kavramRoutes,
    ...ilceRoutes,
    ...categoryRoutes,
    ...subCategoryRoutes,
    ...kategoriRoutes,
    ...mevzuatRoutes,
    ...personalArticleRoutes,
  ];
}
