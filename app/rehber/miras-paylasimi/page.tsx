import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SITE_URL, PROFILE } from '@/lib/profile';

export const metadata: Metadata = {
    title: 'Miras Paylaşımı Bilgilendirme | Yasal Mirasçılık',
    description:
        'TMK yasal mirasçılık, zümre sistemi ve saklı pay hakkında genel bilgilendirme. Hesaplama aracı ve akademik şerhlere yönlendirme. Av. Fethi Güzel Hukuk Portalı.',
    alternates: { canonical: `${SITE_URL}/rehber/miras-paylasimi` },
};

export default function MirasRehberPage() {
    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-3xl mx-auto prose-legal">
                <p className="text-accent text-xs font-bold tracking-widest uppercase mb-3">Rehber · bilgilendirme</p>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-6">
                    Miras paylaşımı — temel kavramlar
                </h1>
                <p className="text-charcoal/65 leading-relaxed mb-6">
                    Türk Medeni Kanunu, yasal mirasçılığı zümre esasına göre düzenler. Bu sayfa genel
                    bilgilendirme içindir; somut miras dosyasında pay oranları, vasiyet, tenkis ve ispat
                    durumu dosyaya göre değişir. Sonuç vaadi yoktur.
                </p>
                <h2 className="text-xl font-heading font-bold text-charcoal mt-10 mb-3">Yasal mirasçılar</h2>
                <p className="text-charcoal/65 leading-relaxed mb-4">
                    Altsoy, ana-baba ve bunların altsoyu ile sağ kalan eş yasal mirasçılık sisteminde
                    öne çıkar. Zümre sistemi, hangi grubun ne zaman mirasçı olacağını belirler. Ayrıntı
                    için TMK miras hükümleri ve{' '}
                    <Link href="/kategori/miras-hukuku" className="text-accent font-semibold hover:underline">
                        miras hukuku şerhleri
                    </Link>{' '}
                    incelenebilir.
                </p>
                <h2 className="text-xl font-heading font-bold text-charcoal mt-10 mb-3">Saklı pay</h2>
                <p className="text-charcoal/65 leading-relaxed mb-4">
                    Saklı pay, belirli mirasçıların vasiyetname ile tamamen mahrum bırakılamayacağı
                    kanuni korumadır. Oranlar ve tenkis davası şartları somut olaya bağlıdır.
                </p>
                <h2 className="text-xl font-heading font-bold text-charcoal mt-10 mb-3">Araçlar</h2>
                <ul className="list-disc pl-5 text-charcoal/65 space-y-2 mb-8">
                    <li>
                        <Link href="/hesaplama#miras" className="text-accent font-semibold hover:underline">
                            Miras paylaşımı hesaplama aracı
                        </Link>{' '}
                        (bilgilendirme amaçlı, bağlayıcı değil)
                    </li>
                    <li>
                        <Link href="/hesaplama#sakli-pay" className="text-accent font-semibold hover:underline">
                            Saklı pay aracı
                        </Link>
                    </li>
                </ul>
                <p className="text-sm text-charcoal/50 border-t border-charcoal/10 pt-6">
                    Yazar / portal: {PROFILE.name}. Ofis: {PROFILE.office.locality} / {PROFILE.office.region}.
                    İletişim:{' '}
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
