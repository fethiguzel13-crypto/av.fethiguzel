import React from 'react';

/**
 * Boş durum ekranı.
 *
 * Boş liste yerine "ne yapmalıyım" söyleyen bir ekran, mağaza incelemesinde
 * "eksik/yarım uygulama" izlenimini önleyen en ucuz iyileştirmedir.
 */
export default function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
  icon = '§',
}: {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="page grid place-items-center min-h-[55dvh] text-center">
      <div className="max-w-[19rem]">
        <div
          className="w-14 h-14 rounded-2xl grid place-items-center mx-auto mb-4 text-[14px]l"
          style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}
          aria-hidden
        >
          {icon}
        </div>
        <h2 className="text-[15px] font-heading font-bold mb-1.5">{title}</h2>
        <p className="text-[13px] text-charcoal/55 leading-relaxed">{body}</p>
        {actionLabel && onAction && (
          <button type="button" className="btn-brand mt-5" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
