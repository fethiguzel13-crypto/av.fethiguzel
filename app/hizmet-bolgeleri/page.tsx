import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BOLGELER, SITE_URL, PROFILE } from '@/lib/profile';
import { MapPin } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Hizmet Bölgeleri | Van, Bitlis, Ağrı, Ankara Avukat',
    description:
        'Av. Fethi Güzel hizmet bölgeleri: Erciş, Van, Çaldıran, Özalp, Muradiye, Patnos, Ağrı, Tatvan, Bitlis, Adilcevaz, Ahlat ve Ankara (uzaktan). Yerel SEO bilgilendirme sayfaları.',
    alternates: { canonical: `${SITE_URL}/hizmet-bolgeleri` },
    openGraph: {
        title: 'Hizmet Bölgeleri — Av. Fethi Güzel',
        description: 'Doğu Anadolu ve uzaktan erişim bölgelerinde hukuki bilgilendirme sayfaları.',
        url: `${SITE_URL}/hizmet-bolgeleri`,
    },
};

export default function HizmetBolgeleriPage() {
    const itemList = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Av. Fethi Güzel hizmet bölgeleri',
        numberOfItems: BOLGELER.length,
        itemListElement: BOLGELER.map((b, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: b.ad,
            url: `${SITE_URL}/${b.slug}`,
        })),
    };

    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

            <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-5xl mx-auto">
                <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">
                    Yerel erişim · Bilgilendirme
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
                    Hizmet bölgeleri
                </h1>
                <p className="text-charcoal/60 text-base sm:text-lg max-w-2xl leading-relaxed mb-4">
                    Merkez ofis <strong className="text-charcoal">{PROFILE.office.locality} / {PROFILE.office.region}</strong>.
                    Aşağıdaki sayfalar aynı büroya aittir; her biri ilgili yerleşim araması için özelleştirilmiş
                    bilgilendirme metni içerir. Reklam yasağına uygun, sonuç vaadi içermez.
                </p>
                <p className="text-charcoal/50 text-sm mb-10">
                    <Link href="/avukat-fethi-guzel" className="text-accent font-semibold hover:underline">
                        Avukat profili
                    </Link>
                    {' · '}
                    <Link href="/akademik-profil" className="text-accent font-semibold hover:underline">
                        Akademik profil
                    </Link>
                    {' · '}
                    <Link href="/site-haritasi" className="text-accent font-semibold hover:underline">
                        Site haritası
                    </Link>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {BOLGELER.map((b) => (
                        <Link
                            key={b.slug}
                            href={`/${b.slug}`}
                            className="group surface-card-hover p-5 sm:p-6"
                        >
                            <div className="flex items-start gap-3">
                                <MapPin className="text-accent shrink-0 mt-0.5" size={18} />
                                <div>
                                    <h2 className="font-heading font-bold text-charcoal group-hover:text-accent transition-colors">
                                        {b.ad}
                                    </h2>
                                    <p className="text-xs text-charcoal/45 mt-1">
                                        {b.ilce} · {b.il}
                                        {b.merkezOfis ? ' · Merkez ofis' : ''}
                                        {b.uzaktan ? ' · Uzaktan / seyahat' : ''}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
