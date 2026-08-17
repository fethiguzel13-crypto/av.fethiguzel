'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { GALAXY_APPS, localized } from '@/lib/galaxy/catalog';
import { useGalaxy } from '@/lib/galaxy/useGalaxy';

type Props = {
  compact?: boolean;
  variant?: 'light' | 'dark';
};

function SisterInner({ compact = false, variant = 'light' }: Props) {
  const { appId, locale, t, setAppId } = useGalaxy();
  const dark = variant === 'dark';

  return (
    <section
      aria-label={t('common.sisterApps')}
      className={
        compact
          ? 'mt-4'
          : dark
            ? 'mt-8 rounded-2xl border border-cream/10 bg-cream/5 p-4 sm:p-5'
            : 'mt-8 rounded-2xl border border-charcoal/10 bg-white p-4 sm:p-5'
      }
    >
      {!compact && (
        <h2
          className={`text-xs font-bold uppercase tracking-widest mb-3 ${
            dark ? 'text-cream/40' : 'text-charcoal/45'
          }`}
        >
          {t('common.sisterApps')}
        </h2>
      )}
      <ul className={`grid gap-2 ${compact ? 'grid-cols-2' : 'sm:grid-cols-2'}`}>
        {GALAXY_APPS.filter((a) => a.id !== appId).map((a) => (
          <li key={a.id}>
            <Link
              href={`${a.path === '/' ? '/' : a.path}?app=${a.id}&lang=${locale}`}
              onClick={() => setAppId(a.id)}
              className={
                dark
                  ? 'flex flex-col gap-0.5 rounded-xl border border-cream/10 bg-cream/5 px-3 py-2.5 transition-colors hover:border-accent/50 hover:bg-accent/15'
                  : 'flex flex-col gap-0.5 rounded-xl border border-charcoal/[0.08] bg-cream/60 px-3 py-2.5 transition-colors hover:border-accent/40 hover:bg-accent/5'
              }
              style={{ borderLeftWidth: 3, borderLeftColor: a.accent }}
            >
              <span
                className={`text-sm font-heading font-bold ${dark ? 'text-cream' : 'text-charcoal'}`}
              >
                {localized(a.name, locale)}
              </span>
              <span
                className={`text-[11px] leading-snug ${dark ? 'text-cream/55' : 'text-charcoal/55'}`}
              >
                {localized(a.short, locale)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p
        className={`mt-3 text-[10px] leading-relaxed ${dark ? 'text-cream/35' : 'text-charcoal/40'}`}
      >
        {t('common.installHint')}
      </p>
    </section>
  );
}

/**
 * Galaxy uygulamaları arası geçiş — her uygulama içinde “kardeş” keşfi.
 * Play yokken web path + ?app= ile çalışır; sonra market deep link’e bağlanır.
 */
export default function GalaxySisterApps(props: Props) {
  return (
    <Suspense fallback={null}>
      <SisterInner {...props} />
    </Suspense>
  );
}
