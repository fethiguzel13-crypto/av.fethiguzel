import Link from 'next/link';
import { BookOpen, GraduationCap, Globe2, Scale } from 'lucide-react';
import { PROFILE } from '@/lib/profile';

/**
 * Factual credentials strip — TBB-safe: education, publication, language, library.
 * No superlatives, no outcome guarantees.
 */
export default function CredentialsStrip({ compact = false }: { compact?: boolean }) {
    const items = [
        {
            icon: GraduationCap,
            title: 'Doktora çalışmaları',
            text: 'Özel hukuk alanında akademik araştırma',
            href: '/akademik-profil',
        },
        {
            icon: BookOpen,
            title: 'Yayımlanmış kitap',
            text: `${PROFILE.book.shortTitle} — ${PROFILE.book.publisher}`,
            href: '/eserlerim',
        },
        {
            icon: Globe2,
            title: 'İngilizce',
            text: 'İyi düzeyde iletişim ve yazışma',
            href: '/english-speaking-lawyer',
        },
        {
            icon: Scale,
            title: 'Açık erişim kütüphane',
            text: `${PROFILE.stats.madde} madde · akademik şerh`,
            href: '/mevzuat',
        },
    ];

    return (
        <section
            aria-label="Akademik ve mesleki bilgiler"
            className={compact ? 'py-8' : 'py-12 sm:py-16 px-5 sm:px-6'}
        >
            <div className={compact ? '' : 'max-w-7xl mx-auto'}>
                {!compact && (
                    <p className="section-label mb-6 text-center sm:text-left">
                        Nesnel mesleki bilgiler · Reklam yasağına uygun bilgilendirme
                    </p>
                )}
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {items.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.title}>
                                <Link
                                    href={item.href}
                                    className="flex gap-3 h-full surface-card-hover p-4 sm:p-5"
                                >
                                    <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                                        <Icon size={18} aria-hidden />
                                    </div>
                                    <div>
                                        <p className="font-heading font-bold text-charcoal text-sm">{item.title}</p>
                                        <p className="text-charcoal/55 text-xs mt-1 leading-snug">{item.text}</p>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
