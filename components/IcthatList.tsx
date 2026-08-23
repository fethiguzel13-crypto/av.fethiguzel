"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ScrollText, Scale, Landmark, Flag, BookOpen, Copy, Check, ExternalLink } from 'lucide-react';
import type { DailyData, DailyItem } from '@/lib/daily';
import { itemTitle, formatTrDate } from '@/lib/daily';
import IcthatFilters from './IcthatFilters';

const SOURCE_ORDER: (keyof DailyData['items'])[] = ['resmigazete', 'yargitay', 'aym', 'hudoc', 'mevzuat'];

const SOURCE_HEADERS: Record<string, { label: string; icon: React.ComponentType<{ size?: number }> }> = {
  resmigazete: { label: 'Resmî Gazete', icon: ScrollText },
  yargitay: { label: 'Yargıtay', icon: Scale },
  aym: { label: 'Anayasa Mahkemesi', icon: Landmark },
  hudoc: { label: 'AİHM', icon: Flag },
  mevzuat: { label: 'Mevzuat', icon: BookOpen }
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="shrink-0 w-8 h-8 rounded-lg border border-charcoal/10 text-charcoal/60 hover:text-accent hover:border-accent/30 transition flex items-center justify-center"
      title="Künyeyi kopyala"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

function Item({ item, hasAnalysis }: { item: DailyItem; hasAnalysis: boolean }) {
  return (
    <article className="bg-white border border-charcoal/5 rounded-[1.5rem] p-6 hover:border-charcoal/20 transition">
      <div className="flex justify-between items-start gap-4 mb-3">
        <h3 className="text-base md:text-lg font-heading font-bold text-charcoal flex-1">{itemTitle(item)}</h3>
        {item.category && (
          <span className="shrink-0 bg-accent/10 text-accent text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded-md">
            {item.category}
          </span>
        )}
      </div>
      {item.kunye && (
        <div className="flex items-center gap-2 mb-3">
          <code className="flex-1 bg-charcoal/5 text-charcoal/80 text-xs font-mono px-3 py-2 rounded-lg overflow-x-auto">
            {item.kunye}
          </code>
          <CopyButton text={item.kunye} />
        </div>
      )}
      {item.konu && (
        <p className="text-charcoal/60 text-sm leading-relaxed mb-4">
          {item.publicSummary || item.konu}
        </p>
      )}
      <div className="flex items-center justify-between pt-3 border-t border-charcoal/5">
        <span className="text-charcoal/40 text-xs font-mono uppercase tracking-widest">{formatTrDate(item.date)}</span>
        <div className="flex items-center gap-4">
          {hasAnalysis && (
            <Link
              href={`/icthat/${item.id}`}
              className="text-xs text-accent font-bold tracking-widest uppercase hover:underline"
            >
              Analizi Oku →
            </Link>
          )}
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-accent font-bold tracking-widest uppercase">
              Kaynak <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Aynı kaydı iki kez göstermeyi engeller.
 *
 * Günlük tarama zaman zaman aynı Resmî Gazete kaydını iki kez üretiyor —
 * örneğin «T.C. Merkez Bankasınca Belirlenen Döviz Kurları» aynı kimlikle
 * iki kez giriyordu. Sonuç iki yönlüydü: ekranda aynı kart art arda iki kez
 * çıkıyor, React de yinelenen anahtar uyarısı basıyordu.
 *
 * Süzgeç okuma tarafında durur, çünkü kaynak taramanın ne üreteceğine
 * güvenilemez; aynı kimlik zaten aynı kayıt demektir.
 */
function tekille(items: DailyItem[]): DailyItem[] {
  const gorulen = new Set<string>();
  return items.filter((it) => {
    const k = String(it.id ?? '');
    if (!k) return true;
    if (gorulen.has(k)) return false;
    gorulen.add(k);
    return true;
  });
}

function Section({ sourceKey, items: ham, analysisIdSet }: { sourceKey: keyof DailyData['items']; items: DailyItem[]; analysisIdSet: Set<string> }) {
  const items = tekille(ham || []);
  if (items.length === 0) return null;
  const header = SOURCE_HEADERS[sourceKey];
  const HeaderIcon = header.icon;
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-accent/5 rounded-full flex items-center justify-center text-accent">
          <HeaderIcon size={18} />
        </div>
        <h2 className="text-charcoal font-heading text-2xl font-bold flex-1">{header.label}</h2>
        <span className="text-xs font-mono text-charcoal/40 uppercase tracking-widest">{items.length} kayıt</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((it) => <Item key={it.id} item={it} hasAnalysis={analysisIdSet.has(it.id)} />)}
      </div>
    </section>
  );
}

export default function IcthatList({ data, analysisIds = [] }: { data: DailyData; analysisIds?: string[] }) {
  const [filter, setFilter] = useState<string>('all');
  const analysisIdSet = new Set(analysisIds);

  const visibleKeys = filter === 'all' ? SOURCE_ORDER : [filter as keyof DailyData['items']];
  const visibleSections = visibleKeys.filter((key) => (data.items[key] || []).length > 0);

  return (
    <>
      <IcthatFilters active={filter} onChange={setFilter} />
      {visibleSections.length === 0 ? (
        <div className="text-center py-20 text-charcoal/50">
          <p>Bu filtre için sonuç yok.</p>
        </div>
      ) : (
        <div className="space-y-16">
          {visibleSections.map((key) => (
            <Section key={key} sourceKey={key} items={data.items[key]} analysisIdSet={analysisIdSet} />
          ))}
        </div>
      )}
    </>
  );
}
