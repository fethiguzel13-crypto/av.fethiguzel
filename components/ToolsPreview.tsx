"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const FEATURED_TOOLS = [
  {
    id: 'miras',
    icon: '🏛️',
    baslik: 'Miras Paylaşımı',
    aciklama: 'TMK zümre sistemine göre yasal mirasçı paylarını hesaplar.',
    etiket: 'Miras Hukuku',
  },
  {
    id: 'kidem',
    icon: '💼',
    baslik: 'Kıdem & İhbar Tazminatı',
    aciklama: 'Brüt ücret ve çalışma yılına göre net tazminat.',
    etiket: 'İş Hukuku',
  },
  {
    id: 'faiz',
    icon: '📊',
    baslik: 'Faiz Hesaplama',
    aciklama: 'Yasal, ticari ve avans faizi — tarihsel oranlarla.',
    etiket: 'Alacak',
  },
  {
    id: 'kira',
    icon: '🏠',
    baslik: 'Kira Artış Oranı',
    aciklama: 'Konut ve işyeri için TÜFE baz alınarak yeni kira bedeli.',
    etiket: 'Gayrimenkul',
  },
  {
    id: 'vekalet',
    icon: '⚖️',
    baslik: 'Nispi Vekalet Ücreti',
    aciklama: 'AAÜT basamaklarına göre karşı taraf vekalet ücreti.',
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
    aciklama: 'Yargıtay kriterlerine göre tahmini değer kaybı aralığı.',
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
  'Miras Hukuku': 'bg-indigo-50 text-indigo-700',
  'İş Hukuku':   'bg-blue-50 text-blue-700',
  'Alacak':      'bg-orange-50 text-orange-700',
  'Gayrimenkul': 'bg-green-50 text-green-700',
  'Dava Masrafı':'bg-purple-50 text-purple-700',
  'Usul':        'bg-amber-50 text-amber-700',
  'Sigorta':     'bg-red-50 text-red-700',
  'Aile Hukuku': 'bg-pink-50 text-pink-700',
};

export default function ToolsPreview() {
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-6 bg-cream">
      <div className="max-w-7xl mx-auto">

        {/* Başlık + buton */}
        <div className="flex flex-col gap-5 mb-10 sm:mb-14">
          <div>
            <p className="text-accent font-mono text-[10px] sm:text-[11px] tracking-widest uppercase mb-3">
              Hukuki Hesaplama Araçları
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal leading-tight">
              Doğru Hesap,{' '}
              <span className="font-drama italic text-accent">Güçlü Strateji.</span>
            </h2>
            <p className="mt-3 text-charcoal/55 text-sm sm:text-base max-w-xl leading-relaxed">
              Kıdem tazminatından faiz hesabına, dava masraflarından araç değer
              kaybına — güncel mevzuat esas alınarak.
            </p>
          </div>
          <Link
            href="/hesaplama"
            className="group self-start flex items-center gap-2 bg-charcoal text-cream px-6 py-3 rounded-full font-bold text-sm transition-all hover:bg-accent"
          >
            Tüm Araçlar (19)
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Kart grid — mobil 2 sütun, tablet 2, masaüstü 4 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {FEATURED_TOOLS.map(tool => (
            <Link
              key={tool.id}
              href={`/hesaplama#${tool.id}`}
              className="group bg-white border border-charcoal/6 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Etiket */}
              <span className={`self-start text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 sm:px-3 py-0.5 sm:py-1 rounded-full mb-3 sm:mb-4 ${ETIKET_RENK[tool.etiket] ?? 'bg-charcoal/5 text-charcoal/50'}`}>
                {tool.etiket}
              </span>

              {/* İkon */}
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{tool.icon}</div>

              {/* Başlık */}
              <h3 className="font-heading font-bold text-charcoal text-sm sm:text-base mb-1 sm:mb-2 group-hover:text-accent transition-colors leading-snug">
                {tool.baslik}
              </h3>

              {/* Açıklama — sadece sm+ */}
              <p className="hidden sm:block text-charcoal/50 text-xs leading-relaxed flex-1">
                {tool.aciklama}
              </p>

              {/* Ok */}
              <div className="mt-3 sm:mt-5 flex items-center gap-1 text-accent text-xs font-bold">
                <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>

        {/* Yasal uyarı */}
        <p className="mt-8 sm:mt-12 text-center text-charcoal/30 text-[10px] font-mono tracking-wider uppercase leading-relaxed px-2">
          Hesaplamalar bilgi amaçlıdır · Kesin değerler için danışmanlık alınız
        </p>
      </div>
    </section>
  );
}
