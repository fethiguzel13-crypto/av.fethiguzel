import type { Metadata } from 'next';
import HesaplamaHub from '@/components/hesaplama/HesaplamaTools';
import { SITE_URL } from '@/lib/profile';
import { HESAPLAMA_ARACLAR } from '@/lib/hesaplama-meta';

export const metadata: Metadata = {
  title: 'Hukuki Hesaplama Araçları | Kıdem, Faiz, Miras, Harç',
  description: `${HESAPLAMA_ARACLAR.length} ücretsiz hukuki hesaplama aracı: kıdem, faiz, miras, vekalet, icra, nafaka, harç. Sonuç kopyala/yazdır, favoriler, akıllı arama. Bilgilendirme amaçlı · Av. Fethi Güzel.`,
  alternates: { canonical: `${SITE_URL}/hesaplama` },
  openGraph: {
    title: 'Hukuki Hesaplama Araçları',
    description: 'Kıdem, faiz, miras, harç — hesapla, kopyala, yazdır. Açık erişim.',
    url: `${SITE_URL}/hesaplama`,
  },
};

export default function HesaplamaPage() {
  return <HesaplamaHub />;
}
