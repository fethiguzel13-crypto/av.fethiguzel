import React from 'react';
import {
  Calculator,
  Star,
  Clock,
  BookOpen,
  LayoutGrid,
  Bookmark,
  CalendarDays,
  Archive,
  Bell,
  Search,
  Download,
  Grid2x2,
  Scale,
} from 'lucide-react';

import { APP_TABS, activeTabId, type Tab } from '../lib/nav';
import { useRoute, navigate } from '../lib/router';
import { tapFeedback } from '../lib/haptics';

const ICONS: Record<Tab['icon'], React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  calc: Calculator,
  star: Star,
  clock: Clock,
  book: BookOpen,
  grid: LayoutGrid,
  bookmark: Bookmark,
  today: CalendarDays,
  archive: Archive,
  bell: Bell,
  search: Search,
  download: Download,
  apps: Grid2x2,
  scale: Scale,
};

/**
 * Alt gezinme çubuğu.
 *
 * Play incelemesinde "tarayıcıdan farkı ne?" sorusuna verilen ilk cevap
 * kalıcı native gezinmedir; bu yüzden çubuk her ekranda görünür, dokunma
 * hedefleri 48dp'nin altına inmez ve seçili sekme renk dışında kalınlıkla
 * da ayrışır (renk körlüğü erişilebilirliği).
 */
export default function BottomNav() {
  const route = useRoute();
  const active = activeTabId(route.path);

  return (
    <nav
      aria-label="Ana gezinme"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-charcoal/10"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex">
        {APP_TABS.map((tab) => {
          const Icon = ICONS[tab.icon];
          const isActive = tab.id === active;
          return (
            <li key={tab.id} className="flex-1">
              <button
                type="button"
                aria-current={isActive ? 'page' : undefined}
                className="w-full h-[58px] flex flex-col items-center justify-center gap-0.5 tap"
                style={{ color: isActive ? 'var(--brand)' : 'rgba(26,26,26,0.42)' }}
                onClick={() => {
                  void tapFeedback();
                  navigate(tab.path);
                }}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className={`text-[12px] leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {tab.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
