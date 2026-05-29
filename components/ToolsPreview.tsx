"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const FEATURED_TOOLS = [
  {
    id: 'kidem',
    icon: '💼',
    baslik: 'Kıdem & İhbar Tazminatı',
    aciklama: 'Brüt ücret ve çalışma yılına göre net tazminat hesabı.',
    etiket: 'İş Hukuku',
  },
  {
    id: 'faiz',
    icon: '📊',
    baslik: 'Faiz Hesaplama',
    aciklama: 'Yasal, ticari ve avans faizi — kademeli tarihsel oranlarla.',
    etiket: 'Alacak',
  },
  {
    id: 'kira',
    icon: '🏠',
    baslik: 'Kira Artış Oranı',
    aciklama: 'Konut ve işyeri için güncel TÜFE baz alınarak yeni kira bedeli.',
    etiket: 'Gayrimenkul',
  },
  {
    id: 'vekalet',
    icon: '⚖️',
    baslik: 'Nispi Vekalet Ücreti',
    aciklama: "AAÜT basamaklarına göre karşı taraf vekalet ücreti.",
    etiket: 'Dava Masrafı',
  },
  {
    id: 'tapu',
    icon: '📋',
    baslik: 'Tapu Harcı',
    aciklama: 'Alıcı–satıcı %2+%2 harç ve döner sermaye toplamı.',
    etiket: 'Gayrimenkul',
  },
  {
    id: 'zamanasimi',
    icon: '⏱️',
    baslik: 'Zamanaşımı Sihirbazı',
    aciklama: 'Uyuşmazlık türü ve tarihine göre interaktif hesaplama.',
    etiket: 'Usul',
  },
  {
    id: 'arac-deger-kaybi',
    icon: '🚗',
    baslik: 'Araç Değer Kaybı',
    aciklama: "Yargıtay kriterlerine göre tahmini araç değer kaybı aralığı.",
    etiket: 'Sigorta',
  },
  {
    id: 'nafaka',
    icon: '👨‍👩‍👧',
    baslik: 'Nafaka Artışı',
    aciklama: 'TÜFE oranına göre güncel nafaka artış hesabı.',
    etiket: 'Aile Hukuku',
  },
];

const ETIKET_RENK: Record<string, string> = {
  'İş Hukuku': 'bg-blue-50 text-blue-700',
  'Alacak': 'bg-orange-50 text-orange-700',
  'Gayrimenkul': 'bg-green-50 text-green-700',
  'Dava Masrafı': 'bg-purple-50 text-purple-700',
  'Usul': 'bg-amber-50 text-amber-700',
  'Sigorta': 'bg-red-50 text-red-700',
  'Aile Hukuku': 'bg-pink-50 text-pink-700',
};

export default function ToolsPreview() {
  return (
    <section className="py-28 px-6 bg-cream">
      <div className="max-w-7xl mx-auto">

        {/* Başlık */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-accent font-mono text-[11px] tracking-widest uppercase mb-3">
              Hukuki Hesaplama Araçları
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal">
              Doğru Hesap,{' '}
              <span className="font-drama italic text-accent">Güçlü Strateji.</span>
            </h2>
            <p className="mt-4 text-charcoal/55 text-base max-w-xl leading-relaxed">
              Kıdem tazminatından faiz hesabına, dava masraflarından araç değer kaybına —
              güncel mevzuat ve tarife esas alınarak hesaplanan araçlar.
            </p>
          </div>
          <Link
            href="/hesaplama"
            className="group flex items-center gap-3 bg-charcoal text-cream px-7 py-3.5 rounded-full font-bold text-sm shrink-0 transition-all hover:bg-accent"
          >
            Tüm Araçlar (17)
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED_TOOLS.map(tool => (
            <Link
              key={tool.id}
              href={`/hesaplama#${tool.id}`}
              className="group relative bg-white border border-charcoal/6 rounded-[2rem] p-7 hover:shadow-xl transition-all duration-400 hover:-translate-y-1 flex flex-col"
            >
              {/* Etiket */}
              <span className={`self-start text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5 ${ETIKET_RENK[tool.etiket] ?? 'bg-charcoal/5 text-charcoal/50'}`}>
                {tool.etiket}
              </span>

              {/* İkon */}
              <div className="text-4xl mb-4">{tool.icon}</div>

              {/* Başlık */}
              <h3 className="font-heading font-bold text-charcoal text-lg mb-2 group-hover:text-accent transition-colors leading-tight">
                {tool.baslik}
              </h3>

              {/* Açıklama */}
              <p className="text-charcoal/50 text-sm leading-relaxed flex-1">
                {tool.aciklama}
              </p>

              {/* Ok */}
              <div className="mt-6 flex items-center gap-2 text-accent text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Hesapla
                <ArrowRight size={13} />
              </div>
            </Link>
          ))}
        </div>

        {/* Alt mesaj */}
        <div className="mt-12 text-center">
          <p className="text-charcoal/35 text-xs font-mono tracking-widest uppercase">
            Hesaplamalar bilgi amaçlıdır · Güncel mevzuat esas alınmıştır · Kesin değerler için danışmanlık alınız
          </p>
        </div>
      </div>
    </section>
  );
}
