"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Briefcase, FileSignature, TrendingUp, AlertTriangle, Scale, Landmark } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function CommercialLaw() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".commercial-fade", {
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
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="ticaret-hukuku" className="py-32 px-6 bg-cream border-t border-charcoal/5" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          
          {/* Main Editorial Content */}
          <div className="w-full lg:w-2/3 space-y-12">
            <header className="space-y-6">
              <h2 className="commercial-fade text-accent font-heading text-sm tracking-[0.4em] uppercase">Şirketler & Ticaret Rehberi</h2>
              <h1 className="commercial-fade text-4xl md:text-6xl text-charcoal font-bold leading-tight font-sans">
                Ticaret Hukuku: <br />
                <span className="font-drama italic text-accent">Ticari Güvenliğin Temel Taşı.</span>
              </h1>
              <p className="commercial-fade text-charcoal/70 text-lg md:text-xl font-sans leading-relaxed">
                Ticaret hukuku, işletmelerin ve tacirlerin ticari faaliyetlerini, ortaklık yapılarını ve borç ilişkilerini düzenleyen son derece kapsamlı ve dinamik bir hukuk dalıdır. Şirketlerin kuruluşu, birleşmeleri, kıymetli evrak ve sözleşme süreçlerinin doğru yönetimi ticari güvenliğin temel direğidir.
              </p>
            </header>

            <div className="space-y-10">
              <h3 className="commercial-fade text-2xl font-bold text-charcoal flex items-center gap-3">
                <Briefcase className="text-accent" /> Kritik İşlem Hususları
              </h3>
              
              <div className="commercial-fade grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Şirketler Hukuku", icon: <Landmark size={18} />, desc: "Anonim ve limited şirket kurulumu, genel kurul yönetimi ve pay devir işlemlerinin mevzuata uygunluğu." },
                  { title: "Kıymetli Evrak Yönetimi", icon: <FileSignature size={18} />, desc: "Çek, bono ve poliçelerin kanuni şekil şartları ve kambiyo hukukundan kaynaklanan alacak takipleri." },
                  { title: "Ticari İşletme Hukuku", icon: <TrendingUp size={18} />, desc: "Ticari unvan, marka tescilleri, haksız rekabet davaları ve cari hesap mutabakatları." },
                  { title: "Sözleşmeler ve Risk Analizi", icon: <ShieldCheck size={18} />, desc: "Ticari alım-satım, acentelik, bayilik ve lojistik sözleşmelerinin hazırlanması ve denetlenmesi." }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-white border border-charcoal/5 rounded-[2rem] hover:shadow-xl transition-all duration-500">
                    <h4 className="text-charcoal font-bold mb-2 flex items-center gap-2 text-sm">
                      <div className="text-accent">{item.icon}</div> {item.title}
                    </h4>
                    <p className="text-charcoal/50 text-[10px] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="commercial-fade p-10 bg-accent/5 rounded-[3rem] border border-accent/10 space-y-6">
               <h4 className="text-charcoal font-bold text-xl flex items-center gap-3">
                 <AlertTriangle className="text-accent" /> Basiretli Tacir Sorumluluğu
               </h4>
               <p className="text-charcoal/60 text-sm leading-relaxed font-sans">
                 Türk Ticaret Kanunu uyarınca, her tacir kendi ticari faaliyetlerinde basiretli bir iş adamı gibi hareket etmek zorundadır. Ticari sözleşmelerdeki ağır cezai şartlar, hak kayıpları veya gecikmeler sonradan telafi edilemez sonuçlar doğurabileceğinden, süreçlerin başından itibaren profesyonel hukuki destek almak işinizi güvende tutar.
               </p>
            </div>

            <div className="commercial-fade p-8 bg-charcoal rounded-[2rem] text-cream">
               <p className="italic text-sm leading-relaxed opacity-80">
                 "Unutmayın: Ticari hayattaki riskler, basiretli adımlar ve hukuka uygun sözleşmelerle yönetilebilir."
               </p>
            </div>
          </div>

          {/* Sidebar with Image */}
          <div className="w-full lg:w-1/3 sticky top-40">
            <div className="commercial-fade relative group">
              <div className="absolute -inset-4 bg-accent/20 rounded-[3rem] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
              <div className="relative rounded-[3rem] overflow-hidden border border-charcoal/5 shadow-2xl">
                <img 
                  src="/ticaret.png" 
                  alt="Ticaret Hukuku"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
