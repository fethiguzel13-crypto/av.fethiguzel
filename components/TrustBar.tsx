import Link from 'next/link';
import { BookOpen, Calculator, Gavel, MapPin, ShieldCheck, Scale } from 'lucide-react';

/**
 * World-class law sites lead with credibility signals above the fold.
 * Stats + differentiators build trust before the visitor scrolls.
 */
const SIGNALS = [
    {
        icon: BookOpen,
        value: '7.800+',
        label: 'Madde ve akademik şerh',
    },
    {
        icon: Scale,
        value: '45+',
        label: 'Kanun arşivi',
    },
    {
        icon: Calculator,
        value: '30',
        label: 'Hukuki hesaplama aracı',
    },
    {
        icon: Gavel,
        value: 'Günlük',
        label: 'İçtihat ve Resmî Gazete',
    },
    {
        icon: MapPin,
        value: 'Van · Erciş',
        label: 'Yerel avukatlık ve arabuluculuk',
    },
    {
        icon: ShieldCheck,
        value: 'Ücretsiz',
        label: 'Açık erişimli dijital kütüphane',
    },
];

export default function TrustBar() {
    return (
        <section
            aria-label="Portal güven ve kapsam göstergeleri"
            className="relative z-20 -mt-6 sm:-mt-10 px-5 sm:px-6"
        >
            <div className="max-w-7xl mx-auto">
                <div className="surface-card px-4 py-5 sm:px-8 sm:py-7 shadow-lift border-charcoal/8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-7">
                        <div>
                            <p className="section-label mb-1.5">Neden bu portal?</p>
                            <h2 className="text-xl sm:text-2xl font-heading font-bold text-charcoal tracking-tight">
                                Doktora araştırması, yayımlanmış eser ve{' '}
                                <span className="font-drama italic text-accent font-medium">
                                    açık erişimli şerh arşivi
                                </span>
                            </h2>
                            <p className="text-charcoal/50 text-xs sm:text-sm mt-2 max-w-xl">
                                Nesnel unvan ve yayın · reklam yasağına uygun · sonuç vaadi yok
                            </p>
                        </div>
                        <Link
                            href="/akademik-profil"
                            className="shrink-0 inline-flex items-center justify-center gap-2 bg-charcoal text-cream text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-full hover:bg-accent transition-colors"
                        >
                            Akademik profil
                        </Link>
                    </div>

                    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                        {SIGNALS.map((s) => {
                            const Icon = s.icon;
                            return (
                                <li
                                    key={s.label}
                                    className="rounded-2xl bg-cream/80 border border-charcoal/5 px-3.5 py-4 text-center sm:text-left"
                                >
                                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-accent/10 text-accent mb-3">
                                        <Icon size={18} aria-hidden />
                                    </div>
                                    <p className="text-lg sm:text-xl font-heading font-bold text-charcoal tracking-tight">
                                        {s.value}
                                    </p>
                                    <p className="text-[11px] sm:text-xs text-charcoal/55 leading-snug mt-1">
                                        {s.label}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </section>
    );
}
