import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PROFILE, SITE_URL } from '@/lib/profile';
import { Mail, BookOpen, Scale } from 'lucide-react';

export const metadata: Metadata = {
    title: 'English-Speaking Lawyer Turkey | Av. Fethi Güzel',
    description:
        'English-speaking lawyer in Turkey (Van / Erciş): Av. Fethi Güzel — private-law doctoral research, published e-hearing monograph, civil & commercial matters. Informational only; no outcome guarantees.',
    alternates: { canonical: `${SITE_URL}/english-speaking-lawyer` },
    openGraph: {
        title: 'English-Speaking Lawyer | Av. Fethi Güzel',
        description: 'Turkish attorney with professional English — Van/Erciş office, remote consultation available.',
        url: `${SITE_URL}/english-speaking-lawyer`,
        locale: 'en_US',
    },
};

export default function EnglishLawyerPage() {
    const ld = {
        '@context': 'https://schema.org',
        '@type': 'Attorney',
        name: PROFILE.name,
        knowsLanguage: ['Turkish', 'English'],
        url: `${SITE_URL}/english-speaking-lawyer`,
        image: `${SITE_URL}${PROFILE.photo}`,
        email: PROFILE.email,
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Erciş',
            addressRegion: 'Van',
            addressCountry: 'TR',
        },
        description:
            'Turkish lawyer with professional working English; private-law doctoral studies; author of e-hearing monograph.',
    };

    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

            <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-3xl mx-auto">
                <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">
                    English · Professional information
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-charcoal mb-6 leading-tight">
                    English-speaking lawyer in Turkey
                </h1>
                <p className="text-charcoal/65 text-lg leading-relaxed mb-8">
                    <strong className="text-charcoal">{PROFILE.name}</strong> is a Turkish attorney and mediator based in
                    Erciş / Van. He conducts doctoral research in private law, is the author of a published monograph on
                    e-hearings in civil procedure, and communicates in English at a professional working level.
                </p>

                <div className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden border border-charcoal/10 mb-10">
                    <Image
                        src={PROFILE.photo}
                        alt="Av. Fethi Güzel — English-speaking lawyer Turkey"
                        fill
                        className="object-cover"
                        sizes="320px"
                    />
                </div>

                <section className="space-y-6 mb-12">
                    <div className="surface-card p-5 flex gap-4">
                        <Scale className="text-accent shrink-0" size={22} />
                        <div>
                            <h2 className="font-heading font-bold text-charcoal mb-1">Practice focus</h2>
                            <p className="text-sm text-charcoal/60 leading-relaxed">
                                Civil and commercial matters, family and inheritance, employment, enforcement, and criminal
                                defence — subject to a formal retainer. Office in Erciş; remote video/email intake available
                                for clients in Ankara and elsewhere in Turkey.
                            </p>
                        </div>
                    </div>
                    <div className="surface-card p-5 flex gap-4">
                        <BookOpen className="text-accent shrink-0" size={22} />
                        <div>
                            <h2 className="font-heading font-bold text-charcoal mb-1">Publication & research</h2>
                            <p className="text-sm text-charcoal/60 leading-relaxed">
                                Author of <em>{PROFILE.book.shortTitle}</em> ({PROFILE.book.publisher}). Doctoral work in private
                                law. Open-access digital library with 7,800+ statutory articles and commentaries.
                            </p>
                        </div>
                    </div>
                </section>

                <p className="text-sm text-charcoal/50 mb-8 leading-relaxed">
                    This page is informational under Turkish bar advertising rules. It does not guarantee outcomes or
                    rank the lawyer against others.
                </p>

                <a
                    href={`mailto:${PROFILE.email}?subject=Legal%20inquiry%20(English)`}
                    className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-accent/90"
                >
                    <Mail size={16} /> Email in English
                </a>
                <p className="mt-6 text-sm">
                    <Link href="/avukat-fethi-guzel" className="text-accent font-semibold hover:underline">
                        Turkish profile →
                    </Link>
                </p>
            </main>
            <Footer />
        </div>
    );
}
