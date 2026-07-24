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
  title: 'Av. Fethi Güzel | Mevzuat, Akademik Şerh, İçtihat & Hukuki Hesaplama',
  description:
    'Av. Fethi Güzel — özel hukuk doktora çalışmaları, e-duruşma kitabı, İngilizce. 7.800+ madde şerhi, günlük içtihat, 30 hesaplama aracı. Van · Erciş avukat · açık erişim hukuk kütüphanesi.',
  alternates: { canonical: 'https://avfethiguzel.com' },
  openGraph: {
    title: 'Av. Fethi Güzel Hukuk Portalı | Mevzuat, Şerh & Hesaplama',
    description:
      'Açık erişimli mevzuat bankası, akademik şerhler, günlük içtihat ve hukuki hesaplama. Özel hukuk araştırması · e-duruşma monografisi · Van Erciş.',
    url: 'https://avfethiguzel.com',
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
      <FaqSection />
      <Footer />
      <StickyMobileCta />
    </main>
  );
}
