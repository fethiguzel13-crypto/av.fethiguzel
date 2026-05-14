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
      gsap.from(".article-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="makaleler" className="py-32 px-6 bg-cream" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-accent font-heading text-sm tracking-widest uppercase mb-4">Akademik Arşiv</h2>
            <p className="text-4xl md:text-5xl text-charcoal font-bold font-sans">
              Makaleler & <span className="font-drama italic text-accent">Hukuki Analizler.</span>
            </p>
          </div>
          <Link href="/makaleler" className="flex items-center gap-2 text-charcoal font-bold text-sm tracking-widest uppercase group border-b-2 border-accent pb-2">
            TÜM ARŞİVİ GÖR <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((item, index) => (
            <div key={index} className="article-card group p-10 bg-white border border-charcoal/5 rounded-[2.5rem] hover:shadow-2xl transition-all duration-500">
              <div className="flex justify-between items-start mb-8">
                <div className="w-10 h-10 bg-accent/5 rounded-full flex items-center justify-center text-accent">
                  <FileText size={20} />
                </div>
                <span className="text-[10px] font-mono font-bold text-charcoal/30 uppercase tracking-widest">Akademik // 2024</span>
              </div>
              <h4 className="text-xl font-heading font-bold text-charcoal mb-4 group-hover:text-accent transition-colors">{item.title}</h4>
              <p className="text-charcoal/60 text-sm leading-relaxed mb-8">
                {item.desc}
              </p>
              <button className="text-[10px] font-bold text-accent tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                TAMAMINI OKU
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
