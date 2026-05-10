"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Home, FileSearch, PenTool, Landmark, Users, ShieldCheck, AlertTriangle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function PropertyLaw() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".property-fade", {
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
    <section id="tapu-hukuku" className="py-32 px-6 bg-cream border-t border-charcoal/5" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row-reverse gap-20 items-start">
          
          {/* Main Editorial Content */}
          <div className="w-full lg:w-2/3 space-y-12">
            <header className="space-y-6">
              <h2 className="property-fade text-accent font-heading text-sm tracking-[0.4em] uppercase">Taşınmaz Rehberi</h2>
              <h1 className="property-fade text-4xl md:text-6xl text-charcoal font-bold leading-tight font-sans">
                Tapu Hukuku: <br />
                <span className="font-drama italic text-accent">Mülkiyetin Güvenli Limanı.</span>
              </h1>
              <p className="property-fade text-charcoal/70 text-lg md:text-xl font-sans leading-relaxed">
                Taşınmaz (gayrimenkul) hukuku, hayatımızın en önemli maddi değerlerini oluşturan ev, arsa, dükkan gibi varlıkların haklarını düzenler. Tapu kayıtlarına olan güven, hukuk sistemimizin temel taşlarından biridir. Ancak, tapu işlemleri sırasında yapılacak küçük bir hata, telafisi güç zararlara yol açabilmektedir.
              </p>
            </header>

            <div className="space-y-10">
              <h3 className="property-fade text-2xl font-bold text-charcoal flex items-center gap-3">
                <FileSearch className="text-accent" /> Kritik İşlem Hususları
              </h3>
              
              <div className="property-fade grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Resmi Şekil Şartı", icon: <PenTool size={18} />, desc: "Mülkiyet devri sadece Tapu Müdürlükleri önünde yapılan resmi senetle mümkündür." },
                  { title: "Kayıtların İncelenmesi", icon: <FileSearch size={18} />, desc: "Haciz, ipotek, intifa veya aile konutu şerhi olup olmadığı mutlaka kontrol edilmelidir." },
                  { title: "Gerçek Satış Bedeli", icon: <Landmark size={18} />, desc: "Satış bedelinin düşük gösterilmesi hem vergi cezası hem de yasal risk doğurur." },
                  { title: "Vekaletname Kontrolü", icon: <Users size={18} />, desc: "Vekaletnamelerin 'taşınmaz satışı' konusunda özel yetki içermesi şarttır." },
                  { title: "Miras & İntikal", icon: <Home size={18} />, desc: "Mirasçılık belgesi ile tapu müdürlüğüne başvurulması süreç için elzemdir." }
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

            <div className="property-fade p-10 bg-accent/5 rounded-[3rem] border border-accent/10 space-y-6">
               <h4 className="text-charcoal font-bold text-xl flex items-center gap-3">
                 <AlertTriangle className="text-accent" /> Neden Hukuki Destek Almalısınız?
               </h4>
               <p className="text-charcoal/60 text-sm leading-relaxed font-sans">
                 Tapu sicili devletin sorumluluğu altındadır. Hatalı bir işlem sonucunda mülkiyet hakkınızı kaybetmemek, yolsuz tescillerle karşılaşmamak ve uzun sürecek tapu iptal davalarıyla uğraşmamak için sürecin en başından itibaren uzman bir görüş almak en güvenli yoldur.
               </p>
            </div>

            <div className="property-fade p-8 bg-charcoal rounded-[2rem] text-cream">
               <p className="italic text-sm leading-relaxed opacity-80">
                 "Unutmayın: Mülk sahibi olmak sadece bir anahtar teslimi değil, doğru ve eksiksiz bir tescil sürecidir."
               </p>
            </div>
          </div>

          {/* Sidebar with Image */}
          <div className="w-full lg:w-1/3 sticky top-40">
            <div className="property-fade relative group">
              <div className="absolute -inset-4 bg-accent/20 rounded-[3rem] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
              <div className="relative rounded-[3rem] overflow-hidden border border-charcoal/5 shadow-2xl">
                <img 
                  src="/tapu.png" 
                  alt="Tapu Hukuku"
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
