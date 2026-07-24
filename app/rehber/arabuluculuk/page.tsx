import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SITE_URL, PROFILE } from '@/lib/profile';

export const metadata: Metadata = {
    title: 'Arabuluculuk Bilgilendirme | Hukuk Uyuşmazlıkları',
    description:
        'Hukuk uyuşmazlıklarında arabuluculuk süreci, anlaşma belgesi ve dava şartı hakkında genel bilgilendirme. Av. Fethi Güzel — arabulucu.',
    alternates: { canonical: `${SITE_URL}/rehber/arabuluculuk` },
};

export default function ArabuluculukRehberPage() {
    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-3xl mx-auto">
                <p className="text-accent text-xs font-bold tracking-widest uppercase mb-3">Rehber · bilgilendirme</p>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-6">
                    Arabuluculuk nedir?
                </h1>
                <p className="text-charcoal/65 leading-relaxed mb-6">
                    Arabuluculuk, tarafların bir arabulucu eşliğinde uyuşmazlığı çözmeye çalıştığı gönüllü
                    (veya kanunda dava şartı olarak öngörülen hallerde zorunlu ön adım niteliğindeki)
                    bir süreçtir. {PROFILE.name}, avukatlık yanında arabuluculuk faaliyeti de yürütür.
                    Bu sayfa genel bilgilendirmedir.
                </p>
                <h2 className="text-xl font-heading font-bold text-charcoal mt-10 mb-3">Süreç özeti</h2>
                <ol className="list-decimal pl-5 text-charcoal/65 space-y-2 mb-6">
                    <li>Başvuru ve arabulucu seçimi / atanması</li>
                    <li>Toplantılar ve müzakere</li>
                    <li>Anlaşma belgesi veya anlaşamama son tutanağı</li>
                    <li>Anlaşmanın icrası veya dava yoluna geçiş</li>
                </ol>
                <p className="text-charcoal/65 leading-relaxed mb-8">
                    Mevzuat ve şerh için:{' '}
                    <Link href="/kategori/arabuluculuk" className="text-accent font-semibold hover:underline">
                        Arabuluculuk Kanunu kategorisi
                    </Link>
                    .
                </p>
                <p className="text-sm text-charcoal/50 border-t border-charcoal/10 pt-6">
                    İletişim:{' '}
                    <a href={`mailto:${PROFILE.email}`} className="text-accent font-semibold">
                        {PROFILE.email}
                    </a>{' '}
                    · Ofis: {PROFILE.office.locality} / {PROFILE.office.region}
                </p>
                <p className="mt-6">
                    <Link href="/rehber" className="text-accent font-bold hover:underline">
                        ← Tüm rehberler
                    </Link>
                </p>
            </main>
            <Footer />
        </div>
    );
}
