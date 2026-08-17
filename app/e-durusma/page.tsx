import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PROFILE, SITE_URL } from '@/lib/profile';
import { BookOpen, ExternalLink, Scale } from 'lucide-react';

export const metadata: Metadata = {
    title: 'e-Duruşma | Ses ve Görüntünün Nakli Yoluyla Duruşma',
    description:
        'Medeni usul hukukunda e-duruşma: monografi, ilgili HMK çerçevesi ve bilgilendirme. Av. Fethi Güzel — Seçkin Yayıncılık.',
    alternates: { canonical: `${SITE_URL}/e-durusma` },
    openGraph: {
        title: 'e-Duruşma hub — Av. Fethi Güzel',
        description: 'Monografi, akademik bağlam ve ilgili mevzuat bağlantıları.',
        url: `${SITE_URL}/e-durusma`,
    },
};

export default function EDurusmaHubPage() {
    const bookLd = {
        '@context': 'https://schema.org',
        '@type': 'Book',
        name: PROFILE.book.title,
        author: { '@type': 'Person', name: PROFILE.name },
        publisher: { '@type': 'Organization', name: PROFILE.book.publisher },
        url: PROFILE.book.url,
        inLanguage: 'tr',
    };

    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookLd) }} />
            <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-3xl mx-auto">
                <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">
                    Akademik hub
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4 leading-tight">
                    e-Duruşma
                </h1>
                <p className="text-charcoal/60 text-base leading-relaxed mb-10">
                    Medeni usul hukukunda ses ve görüntünün nakledilmesi yoluyla duruşma icrası
                    (e-duruşma) hakkında nesnel bilgilendirme ve yayımlanmış monografiye erişim.
                </p>

                <section className="bg-white border border-charcoal/[0.08] rounded-2xl p-6 sm:p-8 mb-8">
                    <div className="flex gap-3 mb-4">
                        <BookOpen className="text-accent shrink-0" size={22} />
                        <div>
                            <h2 className="font-heading font-bold text-charcoal text-lg leading-snug">
                                {PROFILE.book.title}
                            </h2>
                            <p className="text-sm text-charcoal/50 mt-1">
                                {PROFILE.name} · {PROFILE.book.publisher}
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-charcoal/65 leading-relaxed mb-5">{PROFILE.book.summary}</p>
                    <a
                        href={PROFILE.book.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-accent/90"
                    >
                        Seçkin Yayıncılık <ExternalLink size={14} />
                    </a>
                </section>

                <section className="mb-10">
                    <h2 className="font-heading font-bold text-charcoal mb-3 flex items-center gap-2">
                        <Scale size={18} className="text-accent" /> İlgili portal bağlantıları
                    </h2>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/mevzuat/hmk/madde-1" className="text-accent font-semibold hover:underline">
                                HMK — mevzuat ve şerh
                            </Link>
                        </li>
                        <li>
                            <Link href="/akademik-profil" className="text-accent font-semibold hover:underline">
                                Akademik profil
                            </Link>
                        </li>
                        <li>
                            <Link href="/eserlerim" className="text-accent font-semibold hover:underline">
                                Eserlerim
                            </Link>
                        </li>
                        <li>
                            <Link href="/hesaplama/sure" className="text-accent font-semibold hover:underline">
                                Süre hesabı aracı
                            </Link>
                        </li>
                    </ul>
                </section>

                <p className="text-[11px] text-charcoal/40 leading-relaxed">
                    Bu sayfa tanıtım ve akademik erişim amaçlıdır; yargılama sonucuna ilişkin vaat
                    içermez. Reklam yasağına uygundur.
                </p>
            </main>
            <Footer />
        </div>
    );
}
