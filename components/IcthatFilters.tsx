"use client";

import React from 'react';

const FILTERS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'Tümü' },
  { value: 'yargitay', label: 'Yargıtay' },
  { value: 'aym', label: 'AYM' },
  { value: 'hudoc', label: 'AİHM' },
  { value: 'resmigazete', label: 'Resmî Gazete' }
];

export default function IcthatFilters({ active, onChange }: { active: string; onChange: (value: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`px-5 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-widest transition ${
            active === f.value
              ? 'bg-accent text-white'
              : 'bg-white text-charcoal/70 border border-charcoal/10 hover:border-accent/40'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
