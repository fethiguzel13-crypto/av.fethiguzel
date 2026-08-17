import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

/**
 * Ana sayfada kullanılmaz (reklam yasağı / keşif politikası).
 * Gerekirse /bilgi ve ders notlarına yumuşak köprü.
 */
export default function RegionsPreview() {
    return (
        <section className="py-16 sm:py-24 px-5 sm:px-6 bg-charcoal/[0.03] border-y border-charcoal/5">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                    <div>
                        <p className="section-label mb-3">Açık erişim arşivi</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-charcoal tracking-tight">
                            Bilgi{' '}
                            <span className="font-drama italic text-accent font-medium">rehberleri</span>
                        </h2>
                        <p className="mt-3 text-charcoal/55 text-sm sm:text-base max-w-xl leading-relaxed">
                            550+ vatandaş rehberi ve ücretsiz hukuk ders notları. Ana sayfada
                            listelenmeyen keşif yüzeyleri; reklam yasağına uygun genel bilgilendirme.
                        </p>
                    </div>
                    <Link
                        href="/bilgi"
                        className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline shrink-0"
                    >
                        Vatandaş rehberi <ArrowRight size={16} />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        { href: '/bilgi', ad: 'Vatandaş rehberi', desc: 'Kıdem, icra, kira, boşanma' },
                        { href: '/ders-notlari', ad: 'Ders notları', desc: '120 fakülte · ücretsiz' },
                        { href: '/mevzuat', ad: 'Mevzuat arşivi', desc: '7.800+ madde + şerh' },
                    ].map((b) => (
                        <Link
                            key={b.href}
                            href={b.href}
                            className="group flex items-start gap-3 bg-white border border-charcoal/[0.08] rounded-xl px-4 py-4 text-sm hover:border-accent/40 transition-colors"
                        >
                            <BookOpen size={16} className="text-accent shrink-0 mt-0.5" aria-hidden />
                            <span>
                                <span className="block font-bold text-charcoal group-hover:text-accent">
                                    {b.ad}
                                </span>
                                <span className="block text-xs text-charcoal/45 mt-0.5">{b.desc}</span>
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
