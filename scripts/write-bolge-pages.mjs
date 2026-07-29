/**
 * Generates thin app/{slug}/page.tsx wrappers for regional bilgilendirme pages.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

// Keep in sync with lib/bolge-bilgi.ts slugs
const SLUGS = [
  'ercis-avukat',
  'van-avukat',
  'caldiran-avukat',
  'ozalp-avukat',
  'muradiye-avukat',
  'patnos-avukat',
  'agri-avukat',
  'tatvan-avukat',
  'bitlis-avukat',
  'adilcevaz-avukat',
  'ahlat-avukat',
  'ankara-avukat',
];

for (const slug of SLUGS) {
  const dir = path.join(root, 'app', slug);
  fs.mkdirSync(dir, { recursive: true });
  const content = `import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BolgeBilgiSayfasi from '@/components/BolgeBilgiSayfasi';
import { bolgeBilgiBySlug } from '@/lib/bolge-bilgi';
import { SITE_URL } from '@/lib/profile';

const SLUG = '${slug}';
const veri = bolgeBilgiBySlug(SLUG);

export const metadata: Metadata = veri
  ? {
      title: { absolute: veri.title },
      description: veri.description,
      keywords: veri.keywords,
      alternates: { canonical: \`\${SITE_URL}/\${SLUG}\` },
      openGraph: {
        title: veri.title,
        description: veri.description,
        url: \`\${SITE_URL}/\${SLUG}\`,
        type: 'article',
        locale: 'tr_TR',
      },
      robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
      },
    }
  : { title: 'Sayfa bulunamadı' };

export default function BolgePage() {
  if (!veri) notFound();
  return <BolgeBilgiSayfasi veri={veri} />;
}
`;
  fs.writeFileSync(path.join(dir, 'page.tsx'), content, 'utf8');
  console.log('wrote', slug);
}

console.log('done', SLUGS.length);
