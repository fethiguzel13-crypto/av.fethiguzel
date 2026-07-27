import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PROFILE, SITE_URL, CREDENTIAL_BULLETS, SOCIAL_SAME_AS } from '@/lib/profile';
import { BookOpen, GraduationCap, Globe2, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Akademik Profil | Doktora, Kitap ve Özel Hukuk',
    description:
        'Av. Fethi Güzel akademik profil: özel hukuk alanında doktora çalışmaları, e-duruşma monografisi (Seçkin), medeni usul ve özel hukuk araştırması. Reklam yasağına uygun bilgilendirme.',
    alternates: { canonical: `${SITE_URL}/akademik-profil` },
    openGraph: {
        title: 'Akademik Profil — Av. Fethi Güzel',
        description: 'Özel hukuk doktora çalışmaları, yayımlanmış eser, İngilizce yeterlilik.',
        url: `${SITE_URL}/akademik-profil`,
    },
};

export default function AkademikProfilPage() {
    const personLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: PROFILE.name,
        jobTitle: PROFILE.jobTitle,
        url: `${SITE_URL}/akademik-profil`,
        image: `${SITE_URL}${PROFILE.photo}`,
        email: PROFILE.email,
        knowsLanguage: ['tr', 'en'],
        hasCredential: [
            {
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: 'doctoral studies',
                name: 'Özel hukuk alanında doktora çalışmaları',
                about: 'Private law / civil law doctoral research',
            },
        ],
        knowsAbout: [...PROFILE.academic.fields, 'e-duruşma', 'Medeni usul hukuku'],
        sameAs: [...SOCIAL_SAME_AS],
    };

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
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookLd) }} />

            <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-4xl mx-auto">
                <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">
                    Akademik & mesleki bilgilendirme
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-charcoal mb-6 leading-tight">
                    Akademik profil
                </h1>
                <p className="text-charcoal/65 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl">
                    Bu sayfa Avukatlık Kanunu ve TBB reklam yasağı kurallarına uygun olarak yalnızca{' '}
                    <strong className="text-charcoal">nesnel unvan, yayın ve dil bilgisi</strong> içerir.
                    Sonuç vaadi veya karşılaştırmalı iddia bulunmaz.
                </p>

                <div className="flex flex-col sm:flex-row gap-8 mb-14 items-start">
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border border-charcoal/10 shrink-0">
                        <Image
                            src={PROFILE.photo}
                            alt="Av. Fethi Güzel akademik profil"
                            width={160}
                            height={160}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl font-heading font-bold text-charcoal mb-2">{PROFILE.name}</h2>
                        <p className="text-charcoal/55 text-sm mb-4">
                            {PROFILE.jobTitle} · {PROFILE.office.locality} / {PROFILE.office.region}
                        </p>
                        <ul className="space-y-2 text-sm text-charcoal/70">
                            {CREDENTIAL_BULLETS.map((b) => (
                                <li key={b} className="leading-relaxed">
                                    · {b}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <section className="mb-12 surface-card p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <GraduationCap className="text-accent" size={22} />
                        <h2 className="text-xl font-heading font-bold text-charcoal">Doktora çalışmaları</h2>
                    </div>
                    <p className="text-charcoal/65 leading-relaxed mb-4">{PROFILE.academic.detail}</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-charcoal/40 mb-2">
                        Araştırma ekseni
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {PROFILE.academic.fields.map((f) => (
                            <span
                                key={f}
                                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-accent/10 text-accent"
                            >
                                {f}
                            </span>
                        ))}
                    </div>
                </section>

                <section className="mb-12 surface-card p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <BookOpen className="text-accent" size={22} />
                        <h2 className="text-xl font-heading font-bold text-charcoal">Yayımlanmış eser</h2>
                    </div>
                    <h3 className="font-heading font-bold text-charcoal text-lg mb-2">{PROFILE.book.title}</h3>
                    <p className="text-charcoal/55 text-sm mb-4">
                        Yazar: {PROFILE.name} · {PROFILE.book.publisher}
                    </p>
                    <p className="text-charcoal/65 leading-relaxed mb-6">{PROFILE.book.summary}</p>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href={PROFILE.book.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-charcoal text-cream px-5 py-3 rounded-full text-sm font-bold hover:bg-accent transition-colors"
                        >
                            Seçkin Yayıncılık <ExternalLink size={14} />
                        </a>
                        <Link
                            href="/eserlerim"
                            className="inline-flex items-center gap-2 border border-charcoal/15 px-5 py-3 rounded-full text-sm font-bold text-charcoal hover:border-accent"
                        >
                            Tüm eserler
                        </Link>
                    </div>
                </section>

                <section className="mb-12 surface-card p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Globe2 className="text-accent" size={22} />
                        <h2 className="text-xl font-heading font-bold text-charcoal">Dil yeterliliği</h2>
                    </div>
                    <ul className="space-y-3">
                        {PROFILE.languages.map((l) => (
                            <li key={l.code} className="flex justify-between gap-4 text-sm border-b border-charcoal/5 pb-3">
                                <span className="font-bold text-charcoal">{l.label}</span>
                                <span className="text-charcoal/55">{l.level}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-4 text-charcoal/60 text-sm leading-relaxed">
                        İngilizce bilen müvekkiller ve uluslararası belge içeren dosyalar için ayrı bilgilendirme:{' '}
                        <Link href="/english-speaking-lawyer" className="text-accent font-semibold hover:underline">
                            English-speaking lawyer
                        </Link>
                        .
                    </p>
                </section>

                <p className="text-center">
                    <Link href="/avukat-fethi-guzel" className="text-accent font-bold hover:underline">
                        Tam avukat profili →
                    </Link>
                </p>
            </main>
            <Footer />
        </div>
    );
}
