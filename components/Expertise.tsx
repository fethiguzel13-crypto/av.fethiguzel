"use client";

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Scale, FileText, Calendar, Activity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TypewriterCard = () => {
  const fullText = "Ağır Ceza Mahkemesi... Asliye Ceza Mahkemesi... Soruşturma Aşaması... Savunma Stratejisi Belirleniyor.";
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i = (i + 1) % (fullText.length + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-cream rounded-[2rem] p-8 border border-charcoal/10 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          <span className="font-mono text-[10px] text-accent tracking-widest uppercase">Etkin Savunma</span>
        </div>
        <h3 className="text-2xl font-heading font-bold text-charcoal mb-4">Ceza ve İnfaz Hukuku</h3>
        <p className="text-charcoal/60 text-sm font-sans mb-6">
          Ağır ceza, bilişim ve ekonomik suçlarda etkin savunma stratejileri geliştiriyoruz.
        </p>
      </div>
      <div className="bg-charcoal p-6 rounded-2xl font-mono text-cream/80 text-[11px] leading-relaxed">
        <span className="text-accent">$</span> {text}<span className="animate-blink">|</span>
      </div>
    </div>
  );
};

const ShufflerCard = () => {
  const clauses = [
    "Anlaşmalı Boşanma",
    "Çekişmeli Boşanma",
    "Mal Rejimi Tasfiyesi",
    "Vasiyetname İptali"
  ];
  const [items, setItems] = useState(clauses);

  useEffect(() => {
    const timer = setInterval(() => {
      setItems(prev => {
        const newItems = [...prev];
        const last = newItems.pop();
        if (last) newItems.unshift(last);
        return newItems;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-cream rounded-[2rem] p-8 border border-charcoal/10 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-heading font-bold text-charcoal mb-4">Aile ve Miras Hukuku</h3>
        <p className="text-charcoal/60 text-sm font-sans mb-6">
          Boşanma, mal rejimi ve miras ihtilaflarında hassas süreç yönetimi.
        </p>
      </div>
      <div className="relative h-40 flex items-center justify-center">
        {items.map((item, i) => (
          <div 
            key={item}
            className="absolute w-full p-4 glass rounded-xl text-xs font-bold text-charcoal shadow-sm transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{ 
              transform: `translateY(${(i - 1) * 20}px) scale(${1 - i * 0.05})`,
              opacity: 1 - i * 0.3,
              zIndex: 10 - i
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

const SchedulerCard = () => {
  const [activeDay, setActiveDay] = useState(2);
  
  return (
    <div className="bg-cream rounded-[2rem] p-8 border border-charcoal/10 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-heading font-bold text-charcoal mb-4">Gayrimenkul ve Eşya Hukuku</h3>
        <p className="text-charcoal/60 text-sm font-sans mb-6">
          Tapu iptal, izale-i şüyu ve kamulaştırma davalarında mülkiyet haklarınızı koruyoruz.
        </p>
      </div>
      <div className="bg-white/40 p-6 rounded-2xl">
        <div className="flex justify-between mb-4">
          {['P', 'S', 'Ç', 'P', 'C'].map((day, i) => (
            <div 
              key={i} 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                activeDay === i ? 'bg-accent text-white' : 'bg-charcoal/5 text-charcoal/40'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        <div className="h-2 w-full bg-charcoal/5 rounded-full overflow-hidden">
          <div className="h-full bg-accent w-2/3 animate-pulse"></div>
        </div>
        <p className="mt-4 text-[9px] font-mono text-charcoal/40 uppercase tracking-widest text-center">Keşif ve Bilirkişi Süreci Takip Ediliyor</p>
      </div>
    </div>
  );
};

export default function Expertise() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".expert-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="uzmanlik" className="py-32 px-6 bg-cream" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-accent font-heading text-sm tracking-widest uppercase mb-4">Çalışma Alanlarımız</h2>
          <p className="text-4xl md:text-5xl text-charcoal font-bold font-sans">Hukuki <span className="font-drama italic">Çözümler.</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="expert-card"><TypewriterCard /></div>
          <div className="expert-card"><ShufflerCard /></div>
          <div className="expert-card"><SchedulerCard /></div>
        </div>
      </div>
    </section>
  );
}
