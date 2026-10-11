import type { Metadata } from 'next';
import { paylasimMeta } from '@/lib/paylasim';
import HesaplamaHub from '@/components/hesaplama/HesaplamaTools';
import Kirinti from '@/components/Kirinti';
import { SITE_URL } from '@/lib/profile';
import { HESAPLAMA_ARACLAR } from '@/lib/hesaplama-meta';

export const metadata: Metadata = {
  title: 'Hukuki Hesaplama Araçları | Kıdem, Faiz, Miras, Harç',
  description: `${HESAPLAMA_ARACLAR.length} ücretsiz hukuki hesaplama aracı: kıdem, faiz, miras, vekalet, icra, nafaka, harç. Sonuç kopyala/yazdır, favoriler, akıllı arama. Bilgilendirme amaçlı · Av. Fethi Güzel.`,
  alternates: { canonical: `${SITE_URL}/hesaplama` },
  ...paylasimMeta({
    baslik: 'Hukuki Hesaplama Araçları',
    aciklama: 'Kıdem, faiz, miras, harç — hesapla, kopyala, yazdır. Açık erişim.',
    adres: '/hesaplama',
    tur: 'bolum',
    anahtar: 'hesaplama',
  }),
};

export default function HesaplamaPage() {
  return <HesaplamaHub kirinti={<Kirinti ogeler={[{ ad: 'Hesaplama', yol: '/hesaplama' }]} />} />;
}
