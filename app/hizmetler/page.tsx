import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PROFILE, SITE_URL } from '@/lib/profile';
import {
    Gavel,
    Users,
    Landmark,
    Home,
    Briefcase,
    Scale,
    FileText,
    Handshake,
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Hukuki Hizmet Alanları | Bilgilendirme',
    description:
        'Av. Fethi Güzel hukuki hizmet alanları bilgilendirmesi: ceza, aile, miras, gayrimenkul, iş, ticaret, icra, idare, arabuluculuk. Reklam yasağına uygun, sonuç vaadi yok.',
    alternates: { canonical: `${SITE_URL}/hizmetler` },
};

const ALANLAR = [
    {
        icon: Gavel,
        ad: 'Ceza hukuku',
        text: 'Soruşturma ve kovuşturma aşamalarında sanık veya mağdur vekilliği; asliye ve ağır ceza dosyalarında bilgilendirme ve temsil.',
    },
    {
        icon: Users,
        ad: 'Aile hukuku',
        text: 'Boşanma, velayet, nafaka, mal rejimi ve aile içi koruma tedbirleri hakkında bilgilendirme ve dava vekilliği.',
    },
    {
        icon: Landmark,
        ad: 'Miras hukuku',
        text: 'Veraset, tenkis, mirasçılık belgesi ve paylaşım uyuşmazlıkları; hesaplama araçlarıyla desteklenen ön bilgilendirme.',
    },
    {
        icon: Home,
        ad: 'Gayrimenkul hukuku',
        text: 'Tapu, izale-i şüyu, kira, kamulaştırma ve taşınmaz uyuşmazlıklarında dosya takibi.',
    },
    {
        icon: Briefcase,
        ad: 'İş hukuku',
        text: 'Kıdem, ihbar, işe iade ve iş kazası dosyaları; portal üzerindeki işçilik hesaplama araçlarıyla destek.',
    },
    {
        icon: Scale,
        ad: 'Borçlar ve ticaret',
        text: 'Sözleşme, alacak, şirket ve ticari uyuşmazlıklar; özel hukuk doktora araştırma ekseniyle uyumlu alanlar.',
    },
    {
        icon: FileText,
        ad: 'İcra ve iflas',
        text: 'İcra takibi, itirazın iptali, menfi tespit ve iflas süreçlerinde alacaklı/borçlu vekilliği.',
    },
    {
        icon: Handshake,
        ad: 'Arabuluculuk',
        text: 'Hukuk uyuşmazlıklarında arabuluculuk; anlaşma belgesi ve süreç bilgilendirmesi.',
    },
];

export default function HizmetlerPage() {
    return (
        <div className="bg-cream min-h-screen">
            <Navbar />
            <main id="main-content" className="pt-32 sm:pt-40 pb-20 px-5 sm:px-6 max-w-5xl mx-auto">
                <p className="text-accent font-mono text-[10px] tracking-[0.22em] uppercase mb-3">
                    Bilgilendirme · reklam yasağına uygun
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
                    Hukuki hizmet alanları
                </h1>
                <p className="text-charcoal/60 text-base sm:text-lg max-w-2xl leading-relaxed mb-4">
                    {PROFILE.name} — {PROFILE.jobTitle}. Aşağıdaki listeler sonuç vaadi veya karşılaştırmalı
                    iddia içermez; yalnızca faaliyet alanlarını açıklar.
                </p>
                <p className="text-sm text-charcoal/50 mb-10">
                    <Link href="/akademik-profil" className="text-accent font-semibold hover:underline">
                        Akademik profil
                    </Link>
                    {' · '}
                    <Link href="/hizmet-bolgeleri" className="text-accent font-semibold hover:underline">
                        Hizmet bölgeleri
                    </Link>
                    {' · '}
                    <Link href="/hesaplama" className="text-accent font-semibold hover:underline">
                        Hesaplama araçları
                    </Link>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
                    {ALANLAR.map((a) => {
                        const Icon = a.icon;
                        return (
                            <article key={a.ad} className="surface-card p-5 sm:p-6">
                                <div className="flex gap-3 items-start">
                                    <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                                        <Icon size={18} aria-hidden />
                                    </div>
                                    <div>
                                        <h2 className="font-heading font-bold text-charcoal mb-1.5">{a.ad}</h2>
                                        <p className="text-sm text-charcoal/60 leading-relaxed">{a.text}</p>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <section className="bg-charcoal rounded-2xl p-6 sm:p-8 text-center">
                    <h2 className="text-xl font-heading font-bold text-cream mb-3">İletişim</h2>
                    <p className="text-cream/55 text-sm mb-5 max-w-md mx-auto">
                        Somut dosyanız için e-posta ile ön değerlendirme talep edebilirsiniz. Ücret, Avukatlık
                        Asgari Ücret Tarifesi çerçevesinde netleştirilir.
                    </p>
                    <a
                        href={`mailto:${PROFILE.email}`}
                        className="inline-block bg-accent text-white px-6 py-3 rounded-full text-sm font-bold"
                    >
                        {PROFILE.email}
                    </a>
                </section>
            </main>
            <Footer />
        </div>
    );
}
