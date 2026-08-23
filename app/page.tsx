import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import CredentialsStrip from '@/components/CredentialsStrip';
import LibraryStrip from '@/components/LibraryStrip';
import ToolsPreview from '@/components/ToolsPreview';
import YargiPreview from '@/components/YargiPreview';
import About from '@/components/About';
import DailyNews from '@/components/DailyNews';
import Articles from '@/components/Articles';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';
import StickyMobileCta from '@/components/StickyMobileCta';
import { siteSayilari, tr, yaklasik } from '@/lib/site-stats';

export const metadata: Metadata = {
  title: {
    absolute: 'Av. Fethi Güzel | Kanun, Şerh, Yargıtay Arşivi',
  },
  description:
    'Türk hukuku araştırma kütüphanesi: 47 kanun, 8.000+ madde metni, 25.900+ Yargıtay kararı, akademik şerh, günlük içtihat ve vatandaş rehberi. Av. Fethi Güzel.',
  keywords: [
    'kanun maddesi',
    'kanun maddesi arama',
    'TBK 13',
    'mevzuat arama',
    'Avukat Fethi Güzel',
    'akademik şerh',
    'vatandaş rehberi',
    'hukuki hesaplama',
  ],
  alternates: { canonical: 'https://www.avfethiguzel.com' },
  openGraph: {
    title: 'Av. Fethi Güzel | Kanun, Şerh ve Yargıtay Arşivi',
    description:
      'Kanun maddesi, akademik şerh, Yargıtay arşivi (üyelik) ve günlük içtihat.',
    url: 'https://www.avfethiguzel.com',
  },
};

export default function Home() {
  /*
    Külliyat sayıları üretimin çıktısından okunur.

    Elle yazıldıkları sürece kaçınılmaz olarak kayıyorlardı: burada
    «19.000+ Yargıtay kararı» yazarken arşiv sayfası 25.902 diyordu.
    Yuvarlama daima aşağı yapılır — sahip olunmayan içerik hiçbir yerde
    varmış gibi görünmez.
  */
  const n = siteSayilari();
  const sayilar = {
    kanun: tr(n.kanun),
    madde: yaklasik(n.madde, 100),
    karar: yaklasik(n.karar, 100),
    rehber: yaklasik(n.rehber, 10),
  };

  return (
    <main id="main-content" className="relative w-full bg-cream overflow-hidden pb-20 lg:pb-0">
      <Navbar />
      <Hero sayilar={sayilar} />
      <TrustBar sayilar={sayilar} />
      {/* Google + kullanıcı: taranabilir sık aranan madde linkleri (JS yok) */}
      <section className="py-8 sm:py-10 px-5 sm:px-6 border-b border-charcoal/5 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-mono tracking-widest uppercase text-accent mb-3">
            Sık aranan kanun maddeleri
          </p>
          <h2 className="text-lg sm:text-xl font-heading font-bold text-charcoal mb-4">
            TBK, TMK, TCK madde metni + şerh
          </h2>
          <ul className="flex flex-wrap gap-2">
            {[
              ['TBK 1', '/mevzuat/tbk/madde-1'],
              ['TBK 13', '/mevzuat/tbk/madde-13'],
              ['TBK 49', '/mevzuat/tbk/madde-49'],
              ['TBK 112', '/mevzuat/tbk/madde-112'],
              ['TBK 125', '/mevzuat/tbk/madde-125'],
              ['TMK 166', '/mevzuat/tmk/madde-166'],
              ['TCK 86', '/mevzuat/tck/madde-86'],
              ['HMK 119', '/mevzuat/hmk/madde-119'],
              ['İİK 62', '/mevzuat/iik/madde-62'],
              ['Tüm TBK maddeleri', '/mevzuat/tbk'],
              ['Yargıtay arşivi', '/yargi-kararlari'],
              ['Vatandaş rehberi', '/bilgi'],
              ['Kıdem rehberi', '/bilgi/kidem-tazminati-nasil-alinir'],
            ].map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  className="inline-block text-sm px-3 py-1.5 rounded-full bg-cream border border-charcoal/10 font-semibold text-charcoal hover:border-accent hover:text-accent transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CredentialsStrip />
      <LibraryStrip sayilar={sayilar} />
      <YargiPreview />
      <DailyNews />
      <About />
      <ToolsPreview />
      <Articles />
      <section className="py-12 sm:py-16 px-5 sm:px-6 border-t border-charcoal/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="section-label mb-2">Bilgilendirme</p>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal">
              554 vatandaş rehberi + süreç kılavuzları
            </h2>
            <p className="text-charcoal/55 text-sm mt-2 max-w-lg">
              Kıdem, nafaka, icra, kira, boşanma ve 50+ ana rehber — reklam yasağına uygun genel
              bilgilendirme. Arama motorları için tam dizin: /bilgi
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="/bilgi"
              className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-accent/90 transition-colors"
            >
              Vatandaş rehberi
            </a>
            <a
              href="/rehber"
              className="inline-flex items-center gap-2 bg-charcoal text-cream px-6 py-3 rounded-full text-sm font-bold hover:bg-accent transition-colors"
            >
              Süreç kılavuzları
            </a>
          </div>
        </div>
      </section>
      <FaqSection />
      <Footer />
      <StickyMobileCta />
    </main>
  );
}
