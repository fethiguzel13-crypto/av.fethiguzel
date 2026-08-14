'use client';

import { Suspense } from 'react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useGalaxy } from '@/lib/galaxy/useGalaxy';
import { localized } from '@/lib/galaxy/catalog';

function GalaxyBar() {
  const { app, locale, t, ready } = useGalaxy();
  if (!ready) return null;

  return (
    <div
      className="pointer-events-none fixed top-0 inset-x-0 z-[55] flex justify-end p-2 sm:p-3 md:p-4"
      style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}
    >
      <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-charcoal/10 bg-cream/90 px-2 py-1 shadow-sm backdrop-blur-md">
        <span
          className="hidden sm:inline max-w-[9rem] truncate text-[10px] font-bold uppercase tracking-wider text-charcoal/45 pl-1"
          title={localized(app.name, locale)}
        >
          {localized(app.name, locale)}
        </span>
        <LanguageSwitcher />
      </div>
      <span className="sr-only">{t('common.disclaimer')}</span>
    </div>
  );
}

/** Dil seçici + aktif galaxy uygulaması etiketi (Suspense: useSearchParams) */
export default function GalaxyChrome() {
  return (
    <Suspense fallback={null}>
      <GalaxyBar />
    </Suspense>
  );
}
