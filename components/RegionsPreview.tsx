import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { BOLGELER } from '@/lib/profile';

export default function RegionsPreview() {
    return (
        <section className="py-16 sm:py-24 px-5 sm:px-6 bg-charcoal/3 border-y border-charcoal/5">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                    <div>
                        <p className="section-label mb-3">Yerel erişim</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-charcoal tracking-tight">
                            Hizmet{' '}
                            <span className="font-drama italic text-accent font-medium">bölgeleri</span>
                        </h2>
                        <p className="mt-3 text-charcoal/55 text-sm sm:text-base max-w-xl leading-relaxed">
                            Merkez ofis Erciş / Van. Aşağıdaki sayfalar bilgilendirme amaçlıdır; reklam
                            yasağına uygun, sonuç vaadi içermez.
                        </p>
                    </div>
                    <Link
                        href="/hizmet-bolgeleri"
                        className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline shrink-0"
                    >
                        Tüm bölgeler <ArrowRight size={16} />
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {BOLGELER.map((b) => (
                        <Link
                            key={b.slug}
                            href={`/${b.slug}`}
                            className="group flex items-center gap-2.5 bg-white border border-charcoal/8 rounded-xl px-4 py-3.5 text-sm font-bold text-charcoal hover:border-accent/40 hover:text-accent transition-colors"
                        >
                            <MapPin size={14} className="text-accent shrink-0" aria-hidden />
                            <span className="leading-tight">{b.ad}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
