'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Calculator, FileText } from 'lucide-react';

/**
 * Mobile sticky CTA bar — conversion pattern from top law firm sites (Clio scorecard).
 * Hidden near top of page and when footer contact is in view.
 */
export default function StickyMobileCta() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const pastHero = window.scrollY > 420;
            const contact = document.getElementById('iletisim');
            let nearContact = false;
            if (contact) {
                const rect = contact.getBoundingClientRect();
                nearContact = rect.top < window.innerHeight * 0.85;
            }
            setVisible(pastHero && !nearContact);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div
            className={`fixed bottom-0 inset-x-0 z-[850] lg:hidden transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'
                }`}
            role="navigation"
            aria-label="Hızlı erişim"
        >
            <div className="mx-3 mb-3 mb-[max(0.75rem,env(safe-area-inset-bottom))] rounded-2xl bg-charcoal/95 backdrop-blur-xl border border-cream/10 shadow-lift px-2 py-2 flex items-stretch gap-1">
                <Link
                    href="/ara"
                    className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-xl text-cream hover:bg-cream/10 transition-colors"
                >
                    <BookOpen size={16} aria-hidden />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Ara</span>
                </Link>
                <Link
                    href="/hesaplama"
                    className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-xl text-cream hover:bg-cream/10 transition-colors"
                >
                    <Calculator size={16} aria-hidden />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Hesap</span>
                </Link>
                <Link
                    href="/on-form"
                    className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-xl bg-accent text-white font-bold"
                >
                    <FileText size={16} aria-hidden />
                    <span className="text-[10px] uppercase tracking-wider">Form</span>
                </Link>
            </div>
        </div>
    );
}
