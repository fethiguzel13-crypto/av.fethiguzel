"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ArrowRight, Calculator, BookOpen, Scale } from 'lucide-react';

const STAT_ITEMS = [
  { num: '45+', label: 'Kanun' },
  { num: '7800+', label: 'Madde + Şerh' },
  { num: '19', label: 'Hukuki Araç' },
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
      {/* Arka plan */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2000"
          alt="Hukuk kütüphanesi"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/20" />
      </div>

      {/* İçerik */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 pt-32 pb-14 sm:pb-20 md:pb-28">
        <div className="max-w-4xl">

          {/* Badge */}
          <div className="hero-fade flex items-center gap-2 mb-5 sm:mb-7">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse shrink-0" />
            <span className="font-mono text-accent text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase">
              Türk Hukuku · Akademik Portal
            </span>
          </div>

          {/* Başlık */}
          <h1 className="hero-fade text-[2.2rem] sm:text-5xl md:text-6xl lg:text-7xl text-cream font-bold leading-[1.08] mb-4 sm:mb-6">
            <span className="block font-sans">Kanunlar, İçtihatlar</span>
            <span className="block font-drama italic text-accent mt-1">
              ve Hesaplama Araçları.
            </span>
          </h1>

          {/* Açıklama */}
          <p className="hero-fade text-cream/65 text-base sm:text-lg max-w-xl mb-7 sm:mb-10 font-sans leading-relaxed">
            50&apos;den fazla kanunun madde metinleri, Yargıtay içtihatları ve
            hukuki hesaplama araçları tek platformda.
          </p>

          {/* İstatistikler */}
          <div className="hero-fade flex items-center gap-6 sm:gap-8 mb-8 sm:mb-12">
            {STAT_ITEMS.map(s => (
              <div key={s.label} className="text-center">
                <span className="block text-xl sm:text-2xl font-bold text-accent font-heading">{s.num}</span>
                <span className="block text-[9px] sm:text-[10px] font-mono text-cream/40 uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>

          {/* CTA butonları — mobilde dikey, geniş ekranda yatay */}
          <div className="hero-fade flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Link
              href="/hesaplama"
              className="group flex items-center justify-center gap-2 sm:gap-3 bg-accent text-white px-6 py-3.5 sm:py-4 rounded-full font-bold text-sm transition-all shadow-lg shadow-accent/20 hover:bg-accent/90"
            >
              <Calculator size={16} className="shrink-0" />
              <span>HESAPLAMA ARAÇLARI</span>
              <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/mevzuat"
              className="group flex items-center justify-center gap-2 sm:gap-3 bg-cream/10 backdrop-blur-md text-cream border border-cream/20 px-6 py-3.5 sm:py-4 rounded-full font-bold text-sm transition-all hover:bg-cream/20"
            >
              <BookOpen size={16} className="shrink-0" />
              <span>MEVZUAT ARŞİVİ</span>
            </Link>
            <Link
              href="/#iletisim"
              className="group flex items-center justify-center gap-2 sm:gap-3 bg-transparent text-cream/60 border border-cream/10 px-6 py-3.5 sm:py-4 rounded-full font-bold text-sm transition-all hover:text-cream hover:border-cream/30"
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
