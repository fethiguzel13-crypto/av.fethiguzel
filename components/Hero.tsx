"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".hero-fade", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative h-[100dvh] w-full flex items-end overflow-hidden bg-charcoal"
    >
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2000" 
          alt="Dark forest"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-24 md:pb-32">
        <div className="max-w-4xl">
          <h2 className="hero-fade font-heading text-cream/60 text-lg md:text-xl font-medium tracking-widest uppercase mb-4">
            AV. FETHİ GÜZEL & DANIŞMANLIK
          </h2>
          <h1 className="hero-fade text-5xl md:text-8xl text-cream font-bold leading-[1.1] mb-8">
            <span className="block font-sans">Hukuk bir</span>
            <span className="block font-drama italic text-accent mt-2">Zanaattır.</span>
          </h1>
          <p className="hero-fade text-cream/70 text-lg md:text-xl max-w-xl mb-12 font-sans leading-relaxed">
            Özel hukuk alanında akademik derinlik ve stratejik yaklaşımla karmaşık hukuki süreçlerinizi 
            bir sanatçı titizliğiyle yönetiyoruz.
          </p>
          <div className="hero-fade flex flex-wrap gap-4">
            <button className="group relative flex items-center gap-4 bg-accent text-white px-8 py-4 rounded-full font-bold transition-all hover:pr-10 shadow-lg shadow-accent/20">
              STRATEJİNİZİ BELİRLEYİN
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-2" />
            </button>
            <Link href="/makaleler" className="group flex items-center gap-4 bg-cream/10 backdrop-blur-md text-white border border-cream/20 px-8 py-4 rounded-full font-bold transition-all hover:bg-cream/20">
              AKADEMİK ARŞİV
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
