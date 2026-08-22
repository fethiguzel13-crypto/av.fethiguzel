'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, BookOpen, Calculator, Newspaper } from 'lucide-react';
import { Suspense } from 'react';
import { useGalaxy } from '@/lib/galaxy/useGalaxy';

type TabKey = 'home' | 'search' | 'guide' | 'calc' | 'cases';

const TAB_DEFS: Record<
  TabKey,
  {
    href: string;
    labelKey: string;
    icon: typeof Home;
    match: (p: string) => boolean;
  }
> = {
  home: {
    href: '/',
    labelKey: 'common.home',
    icon: Home,
    match: (p) => p === '/',
  },
  search: {
    href: '/ara',
    labelKey: 'common.search',
    icon: Search,
    match: (p) => p.startsWith('/ara') || p.startsWith('/mevzuat'),
  },
  guide: {
    href: '/bilgi',
    labelKey: 'common.guide',
    icon: BookOpen,
    match: (p) => p.startsWith('/bilgi') || p.startsWith('/rehber'),
  },
  calc: {
    href: '/hesaplama',
    labelKey: 'common.calc',
    icon: Calculator,
    match: (p) => p.startsWith('/hesaplama'),
  },
  cases: {
    href: '/icthat',
    labelKey: 'common.cases',
    icon: Newspaper,
    match: (p) => p.startsWith('/icthat') || p.startsWith('/yargi'),
  },
};

function NavInner() {
  const pathname = usePathname() || '/';
  const { t, app, locale } = useGalaxy();
  const order = app.tabs?.length ? app.tabs : (['home', 'search', 'cases', 'guide', 'calc'] as TabKey[]);
  const tabs = order.map((k) => TAB_DEFS[k as TabKey]).filter(Boolean);

  return (
    <nav
      aria-label={t('common.home')}
      className="app-bottom-nav fixed bottom-0 inset-x-0 z-[60] border-t border-charcoal/10 bg-cream/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1 pt-1">
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          const href =
            tab.href === '/'
              ? `/?app=${app.id}&lang=${locale}`
              : `${tab.href}?app=${app.id}&lang=${locale}`;
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold tracking-wide transition-colors ${
                  active ? 'text-accent' : 'text-charcoal/45 hover:text-charcoal/70'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} aria-hidden />
                <span>{t(tab.labelKey)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Mobil alt menü — galaxy app’e göre sekme sırası + i18n etiketler.
 */
export default function MobileBottomNav() {
  return (
    <Suspense fallback={null}>
      <NavInner />
    </Suspense>
  );
}
