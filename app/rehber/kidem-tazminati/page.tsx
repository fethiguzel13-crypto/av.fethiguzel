import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SITE_URL, PROFILE } from '@/lib/profile';

export const metadata: Metadata = {
    title: 'Kıdem Tazminatı Bilgilendirme | İş Kanunu',
    description:
        'Kıdem tazminatı hakkında genel bilgilendirme: koşullar, tavan ve hesaplama yaklaşımı. Bağlayıcı olmayan araç. Av. Fethi Güzel Hukuk Portalı.',
    alternates: { canonical: `${SITE_URL}/rehber/kidem-tazminati` },
};

export default function KidemRehberPage() {
    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-3xl mx-auto">
                <p className="text-accent text-xs font-bold tracking-widest uppercase mb-3">Rehber · bilgilendirme</p>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-6">
                    Kıdem tazminatı — genel çerçeve
                </h1>
                <p className="text-charcoal/65 leading-relaxed mb-6">
                    İş Kanunu kapsamında kıdem tazminatı, belirli koşulların varlığı hâlinde işçinin
                    kıdemi ve ücreti esas alınarak hesaplanır. Bu metin genel bilgilendirmedir; somut
                    iş sözleşmesi, fesih türü ve yargı kararları sonucu değiştirir. Sonuç vaadi yoktur.
                </p>
                <h2 className="text-xl font-heading font-bold text-charcoal mt-10 mb-3">Dikkat edilecekler</h2>
                <ul className="list-disc pl-5 text-charcoal/65 space-y-2 mb-6">
                    <li>Fesih sebebi ve ispat yükü</li>
                    <li>Giydirilmiş ücret ve tavan uygulaması</li>
                    <li>İhbar tazminatı ve diğer işçilik alacaklarıyla ilişki</li>
                    <li>Zamanaşımı ve arabuluculuk dava şartı (uygulanabilir hallerde)</li>
                </ul>
                <h2 className="text-xl font-heading font-bold text-charcoal mt-10 mb-3">Araçlar ve mevzuat</h2>
                <ul className="list-disc pl-5 text-charcoal/65 space-y-2 mb-8">
                    <li>
                        <Link href="/hesaplama#kidem" className="text-accent font-semibold hover:underline">
                            Kıdem & ihbar hesaplama
                        </Link>
                    </li>
                    <li>
                        <Link href="/kategori/is-kanunu" className="text-accent font-semibold hover:underline">
                            İş Kanunu maddeleri ve şerhler
                        </Link>
                    </li>
                </ul>
                <p className="text-sm text-charcoal/50 border-t border-charcoal/10 pt-6">
                    {PROFILE.name} · {PROFILE.office.locality}/{PROFILE.office.region} ·{' '}
                    <a href={`mailto:${PROFILE.email}`} className="text-accent font-semibold">
                        {PROFILE.email}
                    </a>
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
