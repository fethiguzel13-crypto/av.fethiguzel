"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ArrowRight, Calculator, BookOpen, Scale } from 'lucide-react';

const STAT_ITEMS = [
  { num: '45+', label: 'Kanun' },
  { num: '7800+', label: 'Madde + Şerh' },
  { num: '30', label: 'Hukuki Araç' },
];

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-fade', {
        y: 28,
        opacity: 0,
        stagger: 0.1,
        duration: 1.0,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] w-full flex items-end overflow-hidden bg-charcoal"
    >
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2000"
          alt="Hukuk kütüphanesi — Av. Fethi Güzel dijital arşiv"
          width={2000}
          height={1333}
          fetchPriority="high"
          className="w-full h-full object-cover opacity-[0.38] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/50 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 pt-32 pb-14 sm:pb-20 md:pb-28">
        <div className="max-w-4xl">
          <div className="hero-fade inline-flex items-center gap-2.5 mb-5 sm:mb-7 px-3.5 py-1.5 rounded-full bg-cream/8 border border-cream/12 backdrop-blur-md">
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shrink-0" />
            <span className="font-mono text-accent text-[10px] sm:text-[11px] tracking-[0.22em] uppercase">
              Türk Hukuku · Akademik Portal
            </span>
          </div>

          <h1 className="hero-fade text-[2.35rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] text-cream font-bold leading-[1.05] mb-5 sm:mb-6 tracking-tight text-balance">
            <span className="block font-heading">Kanun Maddesi, İçtihat</span>
            <span className="block font-drama italic text-accent mt-1 sm:mt-2 font-medium">
              ve Hesaplama Araçları.
            </span>
          </h1>

          <p className="hero-fade text-cream/70 text-base sm:text-lg max-w-xl mb-8 sm:mb-10 font-sans leading-relaxed">
            Kanun maddesi arama · akademik şerh · e-duruşma monografisi.
            45+ kanun, 7.800+ madde metni; günlük içtihat ve 30 hesaplama aracı.
            Van · Erciş avukat ve arabulucu.
          </p>

          <div className="hero-fade flex items-stretch gap-4 sm:gap-8 mb-9 sm:mb-12">
            {STAT_ITEMS.map((s) => (
              <div
                key={s.label}
                className="px-3 sm:px-5 py-3 rounded-2xl bg-cream/6 border border-cream/10 backdrop-blur-sm text-center min-w-[4.5rem]"
              >
                <span className="block text-xl sm:text-2xl font-bold text-accent font-heading tracking-tight">
                  {s.num}
                </span>
                <span className="block text-[9px] sm:text-[10px] font-mono text-cream/45 uppercase tracking-widest mt-0.5">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <div className="hero-fade flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-3.5 items-stretch sm:items-center">
            <Link
              href="/avukat-fethi-guzel"
              className="hidden sm:flex items-center gap-3 pr-4 pl-1.5 py-1.5 rounded-full bg-cream/10 border border-cream/15 backdrop-blur-md hover:bg-cream/15 transition-colors"
            >
              <img
                src="/images/av-fethi-guzel-square.jpg"
                alt="Av. Fethi Güzel — Van Erciş avukat"
                title="Avukat Fethi Güzel"
                width={44}
                height={44}
                className="w-11 h-11 rounded-full object-cover border border-cream/20"
              />
              <span className="text-left pr-1">
                <span className="block text-cream text-sm font-bold leading-tight">Av. Fethi Güzel</span>
                <span className="block text-cream/50 text-[10px] uppercase tracking-wider">Van · Erciş avukat</span>
              </span>
            </Link>
            <Link
              href="/ara"
              className="group flex items-center justify-center gap-2 sm:gap-3 bg-accent text-white px-6 py-3.5 sm:py-4 rounded-full font-bold text-sm transition-all shadow-lg shadow-accent/30 hover:bg-accent/90 hover:-translate-y-0.5"
            >
              <BookOpen size={16} className="shrink-0" />
              <span>KANUN MADDESİ ARA</span>
              <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/hesaplama"
              className="group flex items-center justify-center gap-2 sm:gap-3 bg-cream/12 backdrop-blur-md text-cream border border-cream/20 px-6 py-3.5 sm:py-4 rounded-full font-bold text-sm transition-all hover:bg-cream/20 hover:-translate-y-0.5"
            >
              <Calculator size={16} className="shrink-0" />
              <span>HESAPLAMA</span>
            </Link>
            <Link
              href="/mevzuat"
              className="group flex items-center justify-center gap-2 sm:gap-3 bg-transparent text-cream/75 border border-cream/15 px-6 py-3.5 sm:py-4 rounded-full font-bold text-sm transition-all hover:text-cream hover:border-cream/30"
            >
              <span>TÜM KANUNLAR</span>
            </Link>
            <Link
              href="/#iletisim"
              className="group flex items-center justify-center gap-2 sm:gap-3 text-cream/55 border border-cream/10 px-6 py-3.5 sm:py-4 rounded-full font-bold text-sm transition-all hover:text-cream hover:border-cream/25"
            >
              <Scale size={16} className="shrink-0" />
              <span>DANIŞMANLIK</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
