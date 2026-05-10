"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
    <section id="manifesto" className="relative py-32 px-6 bg-charcoal overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
        
        {/* Prestigious Portrait Section */}
        <div className="w-full lg:w-1/2 relative group">
          <div className="absolute -inset-4 bg-accent/20 rounded-[3rem] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] border border-cream/10 shadow-2xl">
            <img 
              ref={imageRef}
              src="/fethi-guzel.jpg" 
              alt="Av. Fethi Güzel"
              className="w-full h-full object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-10">
              <span className="text-accent font-mono text-[10px] tracking-[0.3em] uppercase block mb-2">Kurucu</span>
              <h4 className="text-cream text-3xl font-heading font-bold">Av. Fethi Güzel</h4>
            </div>
          </div>
        </div>

        {/* Manifesto Content Section */}
        <div className="w-full lg:w-1/2 space-y-12">
          <div className="space-y-6">
            <h2 className="philo-text text-accent font-heading text-sm tracking-[0.4em] uppercase">Manifesto // Vizyon</h2>
            <p className="philo-text text-3xl md:text-5xl text-cream font-bold leading-tight font-sans">
              Hukuk, statik bir metin değil; <br />
              <span className="font-drama italic text-accent">Dinamik bir Tasarımdır.</span>
            </p>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="philo-text text-cream/60 text-lg md:text-xl font-sans leading-relaxed">
              Geleneksel hukuk, bürokrasinin gölgesinde kalır. Kağıtlar arasında kaybolan adaletin sesi kısılır. 
              Biz, hukuku akademik bir disiplin ve teknolojik bir inovasyon olarak görüyoruz.
            </p>
            <p className="philo-text text-cream/60 text-lg md:text-xl font-sans leading-relaxed">
              Her vaka, bir mimari titizliğiyle ele alınmalı; her savunma, bir sanat eseri derinliğinde kurgulanmalıdır. 
              Akademik derinlik ile hassas çözümler arasındaki köprüyü kuruyoruz.
            </p>
          </div>

          <div className="philo-text pt-8 border-t border-cream/10 flex items-center gap-8">
            <div>
              <span className="block text-accent font-bold text-2xl font-heading">15+</span>
              <span className="text-cream/40 text-[10px] uppercase tracking-widest font-bold">Yıllık Tecrübe</span>
            </div>
            <div className="w-[1px] h-12 bg-cream/10"></div>
            <div>
              <span className="block text-accent font-bold text-2xl font-heading">Akademik</span>
              <span className="text-cream/40 text-[10px] uppercase tracking-widest font-bold">Uzmanlık</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
