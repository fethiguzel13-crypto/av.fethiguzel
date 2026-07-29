import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BOLGELER, SITE_URL } from '@/lib/profile';
import { BookOpen, MapPin } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Bölgesel Hukuki Bilgilendirme | Av. Fethi Güzel',
    description:
        'Yerleşim bağlamlı genel hukuki bilgilendirme sayfaları: miras, taşınmaz, aile, icra ve idare. Reklam yasağına uygun; ana sayfada listelenmez.',
    alternates: { canonical: `${SITE_URL}/hizmet-bolgeleri` },
    openGraph: {
        title: 'Bölgesel hukuki bilgilendirme',
        description: 'Genel bilgilendirme rehberleri — sonuç vaadi içermez.',
        url: `${SITE_URL}/hizmet-bolgeleri`,
    },
    robots: {
        index: true,
        follow: true,
    },
};

/**
 * Eski “hizmet bölgeleri / X avukat” dizini.
 * Artık bölgesel bilgilendirme indeksi; ana navigasyonda yok.
 */
export default function HizmetBolgeleriPage() {
    const itemList = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Bölgesel hukuki bilgilendirme',
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
                    Bilgilendirme dizini
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
                    Bölgesel hukuki bilgilendirme
                </h1>
                <p className="text-charcoal/60 text-base sm:text-lg max-w-2xl leading-relaxed mb-4">
                    Aşağıdaki sayfalar yerleşim adıyla ilişkilendirilmiş <strong className="text-charcoal">genel hukuki rehberlerdir</strong>.
                    “X avukat” reklamı veya sonuç vaadi içermez. Ana sayfada yer almaz; arama motorları ve site haritası üzerinden keşfedilir.
                </p>
                <p className="text-charcoal/50 text-sm mb-10">
                    <Link href="/bilgi" className="text-accent font-semibold hover:underline">
                        Vatandaş bilgi rehberi
                    </Link>
                    {' · '}
                    <Link href="/avukat-fethi-guzel" className="text-accent font-semibold hover:underline">
                        Avukat profili
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
                                        {b.ilce}
                                    </h2>
                                    <p className="text-xs text-charcoal/45 mt-1">
                                        {b.il}
                                        {b.merkezOfis ? ' · Ofis' : ''}
                                        {b.uzaktan ? ' · Uzaktan bağlam' : ''}
                                    </p>
                                    <p className="text-xs text-charcoal/55 mt-2 leading-relaxed">
                                        {b.ad}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 flex items-start gap-3 rounded-2xl border border-charcoal/8 bg-white p-5 text-sm text-charcoal/60">
                    <BookOpen className="text-accent shrink-0 mt-0.5" size={18} />
                    <p>
                        Daha geniş konu seti için 550+ sayfalık{' '}
                        <Link href="/bilgi" className="text-accent font-semibold hover:underline">
                            vatandaş rehberi
                        </Link>{' '}
                        hub&apos;ını kullanın. Bu dizin yalnızca bölgesel bağlamlı bilgilendirme köprüleridir.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
