import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import CredentialsStrip from '@/components/CredentialsStrip';
import LibraryStrip from '@/components/LibraryStrip';
import ToolsPreview from '@/components/ToolsPreview';
import About from '@/components/About';
import DailyNews from '@/components/DailyNews';
import Articles from '@/components/Articles';
import FaqSection from '@/components/FaqSection';
import RegionsPreview from '@/components/RegionsPreview';
import Footer from '@/components/Footer';
import StickyMobileCta from '@/components/StickyMobileCta';

export const metadata: Metadata = {
  title: 'Av. Fethi Güzel | Kanun Maddesi Arama, Şerh, İçtihat & Hesaplama',
  description:
    'Kanun maddesi arama: 7.800+ madde + akademik şerh, günlük içtihat, 30 hesaplama aracı. TBK, TMK, TCK, HMK, İİK. Av. Fethi Güzel · Van · Erciş · açık erişim hukuk kütüphanesi.',
  keywords: [
    'kanun maddesi',
    'kanun maddesi arama',
    'mevzuat arama',
    'Avukat Fethi Güzel',
    'Van avukat',
    'Erciş avukat',
    'akademik şerh',
  ],
  alternates: { canonical: 'https://www.avfethiguzel.com' },
  openGraph: {
    title: 'Av. Fethi Güzel | Kanun Maddesi, Şerh & Hesaplama',
    description:
      'Kanun maddesi arama, akademik şerh, günlük içtihat ve hukuki hesaplama. Açık erişim dijital hukuk arşivi · Van Erciş.',
    url: 'https://www.avfethiguzel.com',
  },
};

export default function Home() {
  return (
    <main id="main-content" className="relative w-full bg-cream overflow-hidden pb-20 lg:pb-0">
      <Navbar />
      <Hero />
      <TrustBar />
      <CredentialsStrip />
      <LibraryStrip />
      <ToolsPreview />
      <About />
      <RegionsPreview />
      <DailyNews />
      <Articles />
      <section className="py-12 sm:py-16 px-5 sm:px-6 border-t border-charcoal/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="section-label mb-2">Bilgilendirme</p>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal">
              Hukuki rehberler
            </h2>
            <p className="text-charcoal/55 text-sm mt-2 max-w-lg">
              Miras, kıdem ve arabuluculuk — reklam yasağına uygun genel bilgilendirme.
            </p>
          </div>
          <a
            href="/rehber"
            className="inline-flex self-start sm:self-auto items-center gap-2 bg-charcoal text-cream px-6 py-3 rounded-full text-sm font-bold hover:bg-accent transition-colors"
          >
            Rehberlere git
          </a>
        </div>
      </section>
      <FaqSection />
      <Footer />
      <StickyMobileCta />
    </main>
  );
}
