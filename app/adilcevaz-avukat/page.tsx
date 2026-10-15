import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BolgeBilgiSayfasi from '@/components/BolgeBilgiSayfasi';
import { bolgeBilgiBySlug } from '@/lib/bolge-bilgi';
import { SITE_URL } from '@/lib/profile';
import { paylasimMeta } from '@/lib/paylasim';

const SLUG = 'adilcevaz-avukat';
const veri = bolgeBilgiBySlug(SLUG);

export const metadata: Metadata = veri
  ? {
      title: { absolute: veri.title },
      description: veri.description,
      alternates: { canonical: `${SITE_URL}/${SLUG}` },
      ...paylasimMeta({ baslik: veri.title, aciklama: veri.description, adres: `/${SLUG}`, tur: 'site', ogTuru: 'article' }),
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
