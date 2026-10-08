import { jsonLdHtml } from "@/lib/json-ld";
import Link from "@/components/SiteLink";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Kirinti from '@/components/Kirinti';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { YAZAR, yazarRef } from '@/lib/yazar';
import { siteSayilari, tr, yaklasik } from '@/lib/site-stats';

export default function EserlerimPage() {
  const books = [
    {
      title: YAZAR.eser.ad,
      subtitle: `${YAZAR.ad} · ${YAZAR.eser.yayinevi}`,
      author: YAZAR.ad,
      desc: YAZAR.eser.ozet,
      links: [
        { name: YAZAR.eser.yayinevi, url: YAZAR.eser.url },
        { name: "Pelikan Kitabevi", url: "https://www.pelikankitabevi.com.tr" },
        { name: "Filiz Kitabevi", url: "https://www.filizkitabevi.com" },
        { name: "Legal Kitabevi", url: "https://www.legalkitabevi.com" }
      ]
    }
  ];

  const bookLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: books[0].title,
    author: yazarRef(),
    publisher: { '@type': 'Organization', name: YAZAR.eser.yayinevi },
    url: YAZAR.eser.url,
    inLanguage: 'tr',
  };

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(bookLd) }} />

      <main id="main-content" className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <Kirinti
            ogeler={[
                { ad: 'Eserlerim', yol: '/eserlerim' },
            ]}
        />
        <header className="mb-16 sm:mb-24 text-center">
          <h2 className="text-accent-ink font-heading text-sm tracking-widest uppercase mb-4">Akademik Yayınlar</h2>
          <h1 className="text-4xl md:text-6xl text-charcoal font-bold mb-6">
            Eserlerim & <span className="font-drama italic text-accent">Yayınlar</span>
          </h1>
          <p className="text-ink-muted max-w-2xl mx-auto text-lg">
            Kitap, şerh ve makaleler. Doktora çalışmaları ve dil bilgisi için{' '}
            <Link href="/akademik-profil" className="text-accent-ink font-semibold hover:underline">
              akademik profil
            </Link>
            , yazar ve büro bilgisi için{' '}
            <Link href="/avukat-fethi-guzel" className="text-accent-ink font-semibold hover:underline">
              yazar sayfası
            </Link>
            .
          </p>
        </header>

        {books.map((book, index) => (
          <section key={index} className="flex flex-col lg:flex-row gap-20 items-center mb-32">
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative group">
                {/* Book Shadow/Glow */}
                <div className="absolute -inset-4 bg-accent/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {/* Book Mockup */}
                <div className="relative w-[320px] aspect-[2/3] bg-charcoal rounded-r-2xl shadow-[20px_20px_60px_rgba(0,0,0,0.3)] overflow-hidden border-y border-r border-cream/10">
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/40 z-10"></div>
                  <div className="absolute inset-0 p-12 flex flex-col justify-between text-center">
                    <div className="space-y-4">
                      <div className="w-12 h-1 bg-accent-solid mx-auto"></div>
                      <h4 className="text-accent font-heading text-4xl font-bold">{YAZAR.eser.kisaAd}</h4>
                    </div>
                    <p className="text-cream/55 text-[10px] font-mono leading-relaxed uppercase tracking-widest">
                      {YAZAR.eser.ad.replace(/ Yoluyla.*$/, '')}
                    </p>
                    <div className="text-cream/80 font-heading text-sm border-t border-cream/10 pt-4">
                      {YAZAR.ad.toLocaleUpperCase('tr-TR')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <h3 className="text-3xl md:text-5xl font-heading font-bold text-charcoal mb-6 leading-tight">
                {book.title}
              </h3>
              <p className="text-accent font-heading text-xl mb-8">{book.subtitle}</p>
              <p className="text-ink-muted text-lg leading-relaxed mb-12 font-sans">
                {book.desc}
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <ShoppingCart className="text-accent" />
                  <h4 className="text-charcoal font-bold uppercase tracking-widest text-sm">Satın Alma Kanalları</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {book.links.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-4 bg-white border border-charcoal/5 rounded-2xl hover:border-accent hover:shadow-xl transition-all"
                    >
                      <span className="text-charcoal font-bold text-sm">{link.name}</span>
                      <ArrowRight size={16} className="text-accent transition-transform group-hover:translate-x-1" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/*
          Sitedeki yayınlar (G16): Sayfa yalnız kitabı gösteriyordu; yazarın sitedeki asıl külliyatı olan şerhler ve
          makaleler buradan bağlanmıyordu. Bölüm yalnız var olan içeriğe bağlanır, yeni künye yazılmaz.
        */}
        <section aria-labelledby="site-yayinlari" className="border-t border-charcoal/10 pt-14 sm:pt-16">
          <h2 id="site-yayinlari" className="text-2xl sm:text-3xl font-heading font-bold text-charcoal mb-6">
            Sitedeki yayınlar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/mevzuat" className="block surface-card-hover p-6">
              <span className="block font-heading font-bold text-charcoal text-lg">Kanun şerhleri</span>
              <span className="block text-ink-muted text-sm mt-2 leading-relaxed">
                {yaklasik(siteSayilari().serh, 100)} maddede akademik şerh, {tr(siteSayilari().kanun)} kanunun resmî metniyle.
              </span>
            </Link>
            <Link href="/makaleler" className="block surface-card-hover p-6">
              <span className="block font-heading font-bold text-charcoal text-lg">Makaleler</span>
              <span className="block text-ink-muted text-sm mt-2 leading-relaxed">
                Akademik makaleler, tebliğler ve hukuki değerlendirmeler.
              </span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
