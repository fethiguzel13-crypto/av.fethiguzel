"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const articles = [
  { category: "Ceza Hukuku", title: "Hükmün Açıklanmasının Geri Bırakılması (HAGB) ve Şartları", desc: "Ceza yargılamasında sanık lehine uygulanan HAGB kurumunun hukuki niteliği ve sonuçları." },
  { category: "Aile Hukuku", title: "Mal Rejimi Tasfiyesi", desc: "Çekişmeli ve anlaşmalı boşanma davalarında edinilmiş mallara katılma rejiminin güncel içtihatlarla analizi." },
  { category: "Miras Hukuku", title: "Saklı Pay ve Tenkis Davası", desc: "Mirasbırakanın tasarruf özgürlüğünün sınırları ve saklı paylı mirasçıların haklarının korunması." },
  { category: "Tazminat Hukuku", title: "Araç Değer Kaybı ve Tazminat", desc: "Trafik kazalarından kaynaklanan maddi/manevi tazminat ile araç değer kaybı taleplerinin hukuki zemini." },
  { category: "Gayrimenkul Hukuku", title: "İzale-i Şüyu Davası", desc: "Ortaklığın giderilmesi davasında usul, ihale aşaması ve paydaşların yasal hakları." },
  { category: "İş Hukuku", title: "Haklı Nedenle Fesih ve Kıdem", desc: "İşveren ve işçi uyuşmazlıklarında iş sözleşmesinin haklı nedenle feshi ve kıdem tazminatı şartları." }
];

export default function Articles() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Animasyon yalnızca masaüstünde; mobilde içerik her zaman görünür kalır
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.from(".article-card", {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          },
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out"
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="makaleler" className="py-16 sm:py-24 md:py-32 px-5 sm:px-6 bg-cream" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-16 md:mb-20 gap-5 sm:gap-8">
          <div className="max-w-2xl">
            <h2 className="text-accent font-heading text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4">Akademik Arşiv</h2>
            <p className="text-3xl sm:text-4xl md:text-5xl text-charcoal font-bold font-sans leading-tight">
              Makaleler & <span className="font-drama italic text-accent">Hukuki Analizler.</span>
            </p>
          </div>
          <Link href="/makaleler" className="flex items-center gap-2 text-charcoal font-bold text-xs sm:text-sm tracking-widest uppercase group border-b-2 border-accent pb-1 sm:pb-2 shrink-0">
            TÜM ARŞİVİ GÖR <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {articles.map((item, index) => (
            <Link href="/makaleler" key={index} className="article-card group p-5 sm:p-8 md:p-10 bg-white border border-charcoal/5 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] hover:shadow-xl transition-all duration-500 flex flex-col">
              <div className="flex justify-between items-start mb-4 sm:mb-6 md:mb-8">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-accent/5 rounded-full flex items-center justify-center text-accent shrink-0">
                  <FileText size={18} />
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold text-charcoal/30 uppercase tracking-widest">{item.category}</span>
              </div>
              <h4 className="text-base sm:text-lg md:text-xl font-heading font-bold text-charcoal mb-2 sm:mb-4 group-hover:text-accent transition-colors leading-snug">{item.title}</h4>
              <p className="text-charcoal/60 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-8 flex-1">
                {item.desc}
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent tracking-[0.2em] uppercase">
                ARŞİVİ İNCELE <ArrowUpRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
