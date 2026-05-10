"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, ShieldCheck, Scale, FileText } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function BusinessLaw() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".editorial-fade", {
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
    <section id="ticaret-hukuku" className="py-32 px-6 bg-cream overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          
          {/* Main Editorial Content */}
          <div className="w-full lg:w-2/3 space-y-12">
            <header className="space-y-6">
              <h2 className="editorial-fade text-accent font-heading text-sm tracking-[0.4em] uppercase">Uzmanlık Odak Noktası</h2>
              <h1 className="editorial-fade text-4xl md:text-6xl text-charcoal font-bold leading-tight font-sans">
                Ticaret ve Şirketler Hukuku: <br />
                <span className="font-drama italic text-accent">İş Dünyasında Hukuki Güvence.</span>
              </h1>
              <p className="editorial-fade text-charcoal/70 text-lg md:text-xl font-sans leading-relaxed">
                Ticaret Hukuku, modern iş dünyasının temel taşlarını oluşturan, şirketlerin kuruluşu, işleyişi, yönetimi ve sona ermesi süreçlerini düzenleyen kapsamlı bir hukuk dalıdır. Gerek ulusal gerekse uluslararası ölçekte faaliyet gösteren işletmeler için hukuki altyapının sağlamlığı, sürdürülebilir başarı ve ticari itibarın korunması açısından hayati önem taşır.
              </p>
            </header>

            <div className="editorial-fade grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-8 rounded-[2rem] border border-charcoal/5 shadow-sm">
                 <h4 className="text-charcoal font-bold mb-4 flex items-center gap-2">
                   <ShieldCheck className="text-accent" size={20} />
                   Hukuki Güvence
                 </h4>
                 <p className="text-charcoal/60 text-sm leading-relaxed">
                   Ticari ilişkilerin karmaşık yapısı, sözleşme serbestisi ile emredici hukuk kuralları arasındaki dengenin hassasiyetini beraberinde getirir.
                 </p>
               </div>
               <div className="bg-white p-8 rounded-[2rem] border border-charcoal/5 shadow-sm">
                 <h4 className="text-charcoal font-bold mb-4 flex items-center gap-2">
                   <Briefcase className="text-accent" size={20} />
                   Sürdürülebilir Başarı
                 </h4>
                 <p className="text-charcoal/60 text-sm leading-relaxed">
                   Hukuki altyapının sağlamlığı, ticari itibarın korunması ve uzun vadeli başarı için en temel gerekliliktir.
                 </p>
               </div>
            </div>

            <div className="space-y-10">
              <h3 className="editorial-fade text-2xl font-bold text-charcoal border-b border-charcoal/10 pb-4">
                Ticari İhtilaflarda Temel Hususlar
              </h3>
              
              <div className="editorial-fade space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-accent/5 rounded-full flex items-center justify-center text-accent shrink-0">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="text-charcoal font-bold text-lg mb-2">Sözleşmelerin Şeffaflığı ve Detaylandırılması</h4>
                    <p className="text-charcoal/60 text-sm leading-relaxed">
                      Muğlak ifadeler barındırmayan, tarafların hak ve yükümlülüklerini net bir şekilde tanımlayan, mücbir sebep ve uyuşmazlık çözüm mekanizmalarını içeren detaylı sözleşmeler, ileride doğabilecek pek çok sorunun önüne geçer.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-accent/5 rounded-full flex items-center justify-center text-accent shrink-0">
                    <Scale size={24} />
                  </div>
                  <div>
                    <h4 className="text-charcoal font-bold text-lg mb-2">Sürelere ve Usul Kurallarına Riayet</h4>
                    <p className="text-charcoal/60 text-sm leading-relaxed">
                      Ticaret hukukunda süreler ve usul işlemleri büyük önem taşır. Bu sürelerin kaçırılması veya usul hataları, haklıyken haksız duruma düşülmesine veya ciddi hak kayıplarına neden olabilir.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-accent/5 rounded-full flex items-center justify-center text-accent shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="text-charcoal font-bold text-lg mb-2">Hukuki İnceleme (Due Diligence) Süreçleri</h4>
                    <p className="text-charcoal/60 text-sm leading-relaxed">
                      Şirket birleşme ve devralmaları öncesinde, karşı tarafın mali ve hukuki durumunun kapsamlı bir şekilde incelenmesi, risklerin tespiti ve yönetimi açısından elzemdir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar with Image */}
          <div className="w-full lg:w-1/3 sticky top-40">
            <div className="editorial-fade relative group">
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
