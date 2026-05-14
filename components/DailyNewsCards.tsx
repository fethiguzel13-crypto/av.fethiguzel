"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollText, Scale, Landmark, Flag, BookOpen, ArrowUpRight } from 'lucide-react';
import type { DailyItem } from '@/lib/daily';
import { itemTitle, formatTrDate } from '@/lib/daily';

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  'scroll-text': ScrollText,
  'scale': Scale,
  'landmark': Landmark,
  'flag': Flag,
  'book': BookOpen
};

function ItemIcon({ name }: { name: string }) {
  const Icon = ICONS[name] || Scale;
  return <Icon size={20} />;
}

export default function DailyNewsCards({ highlights }: { highlights: DailyItem[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.daily-card', {
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {highlights.map((item) => (
        <article
          key={item.id}
          className="daily-card group p-10 bg-white border border-charcoal/5 rounded-[2.5rem] hover:shadow-2xl transition-all duration-500 flex flex-col"
        >
          <div className="flex justify-between items-start mb-8">
            <div className="w-10 h-10 bg-accent/5 rounded-full flex items-center justify-center text-accent">
              <ItemIcon name={item.icon} />
            </div>
            <span className="text-[10px] font-mono font-bold text-charcoal/30 uppercase tracking-widest">
              {item.sourceLabel}
            </span>
          </div>
          <h4 className="text-xl font-heading font-bold text-charcoal mb-4 group-hover:text-accent transition-colors line-clamp-3">
            {itemTitle(item)}
          </h4>
          <p className="text-charcoal/60 text-sm leading-relaxed mb-8 line-clamp-3 flex-1">
            {item.publicSummary || item.konu.slice(0, 200)}
          </p>
          <div className="flex items-center justify-between pt-6 border-t border-charcoal/5">
            <span className="text-charcoal/40 text-xs font-mono uppercase tracking-widest">
              {formatTrDate(item.date)}
            </span>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] font-bold text-accent tracking-[0.2em] uppercase"
              >
                DETAY
                <ArrowUpRight size={12} />
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
