'use client';

import { ACTIVE_LOCALES, LOCALE_LABELS, type LocaleCode } from '@/lib/galaxy/catalog';
import { useGalaxy } from '@/lib/galaxy/useGalaxy';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale, t } = useGalaxy();

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-charcoal/10 bg-white/80 p-0.5 ${className}`}
      role="group"
      aria-label={t('common.language')}
    >
      {ACTIVE_LOCALES.map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code as LocaleCode)}
            className={`min-w-[2.5rem] rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide transition-colors ${
              active
                ? 'bg-charcoal text-cream'
                : 'text-charcoal/50 hover:text-charcoal/80'
            }`}
            aria-pressed={active}
            lang={code}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
      <span className="sr-only">{LOCALE_LABELS[locale]}</span>
    </div>
  );
}
