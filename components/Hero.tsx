"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ArrowRight, Calculator, BookOpen, Scale } from 'lucide-react';

const STAT_ITEMS = [
  { num: '50+', label: 'Kanun' },
  { num: '8000+', label: 'Madde' },
  { num: '17', label: 'Araç' },
];

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-fade', {
        y: 36,
        opacity: 0,
        stagger: 0.12,
        duration: 1.1,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-[100dvh] w-full flex items-end overflow-hidden bg-charcoal"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2000"
          alt="Hukuk kütüphanesi"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20 md:pb-28">
        <div className="max-w-5xl">

          {/* Badge */}
          <div className="hero-fade flex items-center gap-3 mb-7">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="font-mono text-accent text-[11px] tracking-[0.25em] uppercase">
              Türk Hukuku · Akademik Portal
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-fade text-5xl md:text-7xl lg:text-8xl text-cream font-bold leading-[1.05] mb-6">
            <span className="block font-sans">Kanunlar, İçtihatlar</span>
            <span className="block font-drama italic text-accent mt-1">
              ve Hesaplama Araçları.
            </span>
          </h1>

          {/* Sub */}
          <p className="hero-fade text-cream/65 text-lg md:text-xl max-w-2xl mb-10 font-sans leading-relaxed">
            50'den fazla kanunun madde metinleri, Yargıtay içtihatları ve hukuki hesaplama araçları
            tek platformda. Mevzuata hızlı erişin, maliyetlerinizi hesaplayın.
          </p>

          {/* Stats */}
          <div className="hero-fade flex items-center gap-8 mb-12">
            {STAT_ITEMS.map(s => (
              <div key={s.label} className="text-center">
                <span className="block text-2xl font-bold text-accent font-heading">{s.num}</span>
                <span className="block text-[10px] font-mono text-cream/40 uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="hero-fade flex flex-wrap gap-4">
            <Link
              href="/hesaplama"
              className="group flex items-center gap-3 bg-accent text-white px-7 py-4 rounded-full font-bold text-sm transition-all hover:pr-9 shadow-lg shadow-accent/20"
            >
              <Calculator size={18} />
              HESAPLAMA ARAÇLARI
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
            </Link>
            <Link
              href="/mevzuat"
              className="group flex items-center gap-3 bg-cream/10 backdrop-blur-md text-cream border border-cream/20 px-7 py-4 rounded-full font-bold text-sm transition-all hover:bg-cream/20"
            >
              <BookOpen size={18} />
              MEVZUAT ARŞİVİ
            </Link>
            <Link
              href="/#iletisim"
              className="group flex items-center gap-3 bg-transparent text-cream/60 border border-cream/10 px-7 py-4 rounded-full font-bold text-sm transition-all hover:text-cream hover:border-cream/30"
            >
              <Scale size={18} />
              DANIŞMANLIK
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
