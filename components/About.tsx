"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".philo-text", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out"
      });

      gsap.from(imageRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
        },
        scale: 1.1,
        opacity: 0,
        duration: 2,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="manifesto" className="relative py-20 sm:py-28 md:py-32 px-5 sm:px-6 bg-charcoal overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 sm:gap-16 lg:gap-20">

        <div className="w-full lg:w-1/2 relative group">
          <div className="absolute -inset-4 bg-accent/20 rounded-[3rem] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:rounded-[3rem] border border-cream/10 shadow-2xl">
            <img
              ref={imageRef}
              src="/images/av-fethi-guzel-van-ercis-avukat.jpg"
              alt="Av. Fethi Güzel — Van ve Erciş avukat, arabulucu, hukuk portalı kurucusu"
              width={800}
              height={1000}
              loading="lazy"
              className="w-full h-full object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
            <div className="absolute bottom-8 sm:bottom-10 left-6 sm:left-10">
              <span className="text-accent font-mono text-[10px] tracking-[0.3em] uppercase block mb-2">Kurucu</span>
              <h3 className="text-cream text-2xl sm:text-3xl font-heading font-bold">Av. Fethi Güzel</h3>
              <p className="text-cream/50 text-xs mt-1 tracking-wide">Avukat &amp; Arabulucu · Erciş / Van</p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 space-y-8 sm:space-y-10">
          <div className="space-y-5 sm:space-y-6">
            <h2 className="philo-text text-accent font-heading text-xs sm:text-sm tracking-[0.35em] uppercase">
              Hakkımda
            </h2>
            <p className="philo-text text-3xl sm:text-4xl md:text-5xl text-cream font-bold leading-tight font-sans">
              Hukuki temsil,{' '}
              <span className="font-drama italic text-accent font-medium">şerh ve danışmanlık.</span>
            </p>
          </div>

          <p className="philo-text text-cream/65 text-base sm:text-lg md:text-xl font-sans leading-relaxed">
            Avukatlık; mevzuata hâkimiyet, güncel içtihat takibi ve somut olayın çok yönlü incelenmesini gerektirir. Av. Fethi Güzel, özel hukuk alanında doktora çalışmaları yürüten bir avukat ve arabulucu olarak Van, Erciş ve çevre bölgelerde dava vekilliği ile önleyici danışmanlık sunar.
          </p>
          <p className="philo-text text-cream/65 text-base sm:text-lg md:text-xl font-sans leading-relaxed">
            Yayımlanmış e-duruşma monografisi (Seçkin Yayıncılık), iyi düzeyde İngilizce ve 7.800+ maddeyi kapsayan açık erişimli şerh arşivi; bilgilendirme odaklı dijital varlığın omurgasıdır. Reklam yasağına uygun, nesnel unvan ve yayın bilgisi esastır.
          </p>

          <div className="philo-text pt-6 sm:pt-8 border-t border-cream/10 flex flex-wrap items-center gap-6 sm:gap-8">
            <div>
              <span className="block text-accent font-bold text-2xl font-heading">Doktora</span>
              <span className="text-cream/40 text-[10px] uppercase tracking-widest font-bold">Özel hukuk</span>
            </div>
            <div className="w-px h-12 bg-cream/10 hidden sm:block" />
            <div>
              <span className="block text-accent font-bold text-2xl font-heading">Kitap</span>
              <span className="text-cream/40 text-[10px] uppercase tracking-widest font-bold">e-Duruşma</span>
            </div>
            <div className="w-px h-12 bg-cream/10 hidden sm:block" />
            <div>
              <span className="block text-accent font-bold text-2xl font-heading">EN</span>
              <span className="text-cream/40 text-[10px] uppercase tracking-widest font-bold">İngilizce</span>
            </div>
            <div className="w-px h-12 bg-cream/10 hidden sm:block" />
            <div>
              <span className="block text-accent font-bold text-2xl font-heading">7.800+</span>
              <span className="text-cream/40 text-[10px] uppercase tracking-widest font-bold">Madde + şerh</span>
            </div>
          </div>

          <div className="philo-text flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
            <Link
              href="/avukat-fethi-guzel"
              className="inline-flex items-center justify-center gap-2 bg-accent text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-accent/90 transition-colors"
            >
              Tam profil
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link
              href="/akademik-profil"
              className="inline-flex items-center justify-center gap-2 border border-cream/20 text-cream px-6 py-3.5 rounded-full font-bold text-sm hover:bg-cream/10 transition-colors"
            >
              Akademik profil
            </Link>
            <Link
              href="/eserlerim"
              className="inline-flex items-center justify-center gap-2 border border-cream/20 text-cream px-6 py-3.5 rounded-full font-bold text-sm hover:bg-cream/10 transition-colors"
            >
              Kitap
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
