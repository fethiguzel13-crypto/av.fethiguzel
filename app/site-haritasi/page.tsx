import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BOLGELER, SITE_URL, PROFILE } from '@/lib/profile';
import { categories } from '@/lib/categories';

export const metadata: Metadata = {
    title: 'Site Haritası | Av. Fethi Güzel Hukuk Portalı',
    description:
        'Av. Fethi Güzel Hukuk Portalı HTML site haritası: mevzuat, hesaplama, içtihat, hizmet bölgeleri, akademik profil.',
    alternates: { canonical: `${SITE_URL}/site-haritasi` },
    robots: { index: true, follow: true },
};

const CORE = [
    { href: '/', ad: 'Ana sayfa' },
    { href: '/ara', ad: 'Mevzuat ara' },
    { href: '/mevzuat', ad: 'Mevzuat arşivi' },
    { href: '/icthat', ad: 'Günlük içtihat' },
    { href: '/hesaplama', ad: 'Hesaplama araçları' },
    { href: '/makaleler', ad: 'Makaleler' },
    { href: '/eserlerim', ad: 'Eserler / kitap' },
    { href: '/avukat-fethi-guzel', ad: 'Avukat profili' },
    { href: '/akademik-profil', ad: 'Akademik profil' },
    { href: '/english-speaking-lawyer', ad: 'English-speaking lawyer' },
    { href: '/hizmet-bolgeleri', ad: 'Hizmet bölgeleri' },
    { href: '/gizlilik', ad: 'Gizlilik / KVKK' },
    { href: '/yasal-uyari', ad: 'Yasal uyarı' },
];

export default function SiteHaritasiPage() {
    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-5xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-3">Site haritası</h1>
                <p className="text-charcoal/55 text-sm mb-10 max-w-2xl">
                    {PROFILE.name} Hukuk Portalı — kullanıcı dostu HTML harita. Makine okunur XML:{' '}
                    <a href="/sitemap.xml" className="text-accent font-semibold hover:underline">
                        /sitemap.xml
                    </a>
                </p>

                <section className="mb-12">
                    <h2 className="text-lg font-heading font-bold text-charcoal mb-4">Ana sayfalar</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {CORE.map((l) => (
                            <li key={l.href}>
                                <Link href={l.href} className="text-sm text-charcoal/70 hover:text-accent">
                                    {l.ad}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-lg font-heading font-bold text-charcoal mb-4">Hizmet bölgeleri (yerel SEO)</h2>
                    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {BOLGELER.map((b) => (
                            <li key={b.slug}>
                                <Link href={`/${b.slug}`} className="text-sm text-charcoal/70 hover:text-accent">
                                    {b.ad}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-lg font-heading font-bold text-charcoal mb-4">
                        Mevzuat kategorileri ({categories.length})
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[28rem] overflow-y-auto pr-2">
                        {categories.map((c) => (
                            <li key={c.slug}>
                                <Link href={`/kategori/${c.slug}`} className="text-sm text-charcoal/70 hover:text-accent">
                                    {c.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
            <Footer />
        </div>
    );
}
