import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BolgeBilgiSayfasi from '@/components/BolgeBilgiSayfasi';
import { bolgeBilgiBySlug } from '@/lib/bolge-bilgi';
import { SITE_URL } from '@/lib/profile';

const SLUG = 'adilcevaz-avukat';
const veri = bolgeBilgiBySlug(SLUG);

export const metadata: Metadata = veri
  ? {
      title: { absolute: veri.title },
      description: veri.description,
      keywords: veri.keywords,
      alternates: { canonical: `${SITE_URL}/${SLUG}` },
      openGraph: {
        title: veri.title,
        description: veri.description,
        url: `${SITE_URL}/${SLUG}`,
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
