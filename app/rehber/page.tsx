import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/profile';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Hukuki Bilgilendirme Rehberleri',
    description:
        'Miras, kıdem, boşanma süreci ve arabuluculuk hakkında reklam yasağına uygun bilgilendirme rehberleri. Av. Fethi Güzel Hukuk Portalı.',
    alternates: { canonical: `${SITE_URL}/rehber` },
};

const REHBERLER = [
    {
        href: '/rehber/miras-paylasimi',
        ad: 'Miras paylaşımı — temel kavramlar',
        desc: 'Yasal mirasçılık, zümre sistemi ve saklı pay hakkında genel bilgilendirme; hesaplama aracına yönlendirme.',
    },
    {
        href: '/rehber/kidem-tazminati',
        ad: 'Kıdem tazminatı — genel çerçeve',
        desc: 'İş Kanunu çerçevesinde kıdem tazminatına dair bilgilendirme; bağlayıcı olmayan hesap aracı.',
    },
    {
        href: '/rehber/arabuluculuk',
        ad: 'Arabuluculuk nedir?',
        desc: 'Hukuk uyuşmazlıklarında arabuluculuk süreci, anlaşma belgesi ve dava şartı bilgilendirmesi.',
    },
    {
        href: '/kavram',
        ad: 'Hukuki kavram sözlüğü',
        desc: 'Satım, nafaka, faiz, icra ve daha fazlası — forum için kopyalanabilir mini cevaplar.',
    },
];

export default function RehberIndexPage() {
    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-3xl mx-auto">
                <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">
                    Bilgilendirme rehberleri
                </p>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-4">
                    Hukuki rehberler
                </h1>
                <p className="text-charcoal/60 text-sm sm:text-base leading-relaxed mb-10">
                    Bu metinler genel bilgilendirme amaçlıdır; somut dosyada avukata danışılmalıdır.
                    Sonuç vaadi veya reklam niteliğinde vaat içermez.
                </p>
                <ul className="space-y-4">
                    {REHBERLER.map((r) => (
                        <li key={r.href}>
                            <Link href={r.href} className="block surface-card-hover p-5 sm:p-6">
                                <div className="flex gap-3">
                                    <BookOpen className="text-accent shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <h2 className="font-heading font-bold text-charcoal mb-1">{r.ad}</h2>
                                        <p className="text-sm text-charcoal/55 leading-relaxed">{r.desc}</p>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </main>
            <Footer />
        </div>
    );
}
