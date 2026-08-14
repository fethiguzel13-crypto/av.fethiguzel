'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, BookOpen, Calculator, Newspaper } from 'lucide-react';

const TABS = [
  { href: '/', label: 'Ana', icon: Home, match: (p: string) => p === '/' },
  {
    href: '/ara',
    label: 'Ara',
    icon: Search,
    match: (p: string) => p.startsWith('/ara') || p.startsWith('/mevzuat'),
  },
  {
    href: '/bilgi',
    label: 'Rehber',
    icon: BookOpen,
    match: (p: string) => p.startsWith('/bilgi') || p.startsWith('/rehber'),
  },
  {
    href: '/hesaplama',
    label: 'Hesap',
    icon: Calculator,
    match: (p: string) => p.startsWith('/hesaplama'),
  },
  {
    href: '/icthat',
    label: 'Güncel',
    icon: Newspaper,
    match: (p: string) => p.startsWith('/icthat') || p.startsWith('/yargi'),
  },
] as const;

/**
 * Mobil alt menü — native uygulamada ve dar ekranda.
 * `app-native` sınıfı AppNativeChrome tarafından eklenir.
 */
export default function MobileBottomNav() {
  const pathname = usePathname() || '/';

  return (
    <nav
      aria-label="Mobil ana menü"
      className="app-bottom-nav fixed bottom-0 inset-x-0 z-[60] border-t border-charcoal/10 bg-cream/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1 pt-1">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold tracking-wide transition-colors ${
                  active ? 'text-accent' : 'text-charcoal/45 hover:text-charcoal/70'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} aria-hidden />
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
