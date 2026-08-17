import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { KAVRAMLAR } from '@/lib/kavramlar';
import { SITE_URL } from '@/lib/profile';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Hukuki Kavramlar | Satım, Kıdem, Nafaka, Faiz…',
    description:
        'Satım, kıdem, nafaka, miras, icra, arabuluculuk ve diğer hukuki kavramlar — bilgilendirme, madde ve hesaplama linkleri. Av. Fethi Güzel.',
    alternates: { canonical: `${SITE_URL}/kavram` },
};

export default function KavramHubPage() {
    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-4xl mx-auto">
                <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">
                    Kavram sözlüğü
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
                    Hukuki kavramlar
                </h1>
                <p className="text-charcoal/60 text-sm sm:text-base leading-relaxed mb-10 max-w-2xl">
                    Forum, arama ve günlük sorular için kısa, reklam yasağına uygun bilgilendirme
                    sayfaları. Her kavramda kopyalanabilir mini cevap, ilgili madde ve hesaplama aracı
                    bulunur.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {KAVRAMLAR.map((k) => (
                        <li key={k.slug}>
                            <Link
                                href={`/kavram/${k.slug}`}
                                className="block h-full p-5 rounded-2xl bg-white border border-charcoal/[0.08] hover:border-accent/40 hover:shadow-md transition-all"
                            >
                                <div className="flex gap-3">
                                    <BookOpen className="text-accent shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <h2 className="font-heading font-bold text-charcoal mb-1">
                                            {k.baslik}
                                        </h2>
                                        <p className="text-xs text-charcoal/55 leading-relaxed line-clamp-2">
                                            {k.ozet}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
                <p className="mt-10 text-[11px] text-charcoal/40">
                    Bilgilendirme amaçlıdır · Sonuç vaadi yoktur ·{' '}
                    <Link href="/ara" className="text-accent font-semibold">
                        Mevzuatta ara
                    </Link>
                </p>
            </main>
            <Footer />
        </div>
    );
}
