"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Users, Scale, ShieldAlert, Baby, Info, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FamilyLaw() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".family-fade", {
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
    <section id="aile-hukuku" className="py-32 px-6 bg-cream border-t border-charcoal/5" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row-reverse gap-20 items-start">
          
          {/* Main Editorial Content */}
          <div className="w-full lg:w-2/3 space-y-12">
            <header className="space-y-6">
              <h2 className="family-fade text-accent font-heading text-sm tracking-[0.4em] uppercase">Haklarınız ve Sorumluluklarınız</h2>
              <h1 className="family-fade text-4xl md:text-6xl text-charcoal font-bold leading-tight font-sans">
                Aile Hukuku: <br />
                <span className="font-drama italic text-accent">Hukuki Güvence Altında Gelecek.</span>
              </h1>
              <p className="family-fade text-charcoal/70 text-lg md:text-xl font-sans leading-relaxed">
                Aile, toplumun en temel yapı taşıdır. Ancak hayatın doğal akışı içinde aile birliği içerisinde uyuşmazlıklar yaşanabilir. Aile Hukuku, bu süreçlerin hem bireyler hem de çocuklar için en az hasarla ve kanuni bir çerçevede yürütülmesini sağlar.
              </p>
            </header>

            <div className="space-y-10">
              <h3 className="family-fade text-2xl font-bold text-charcoal flex items-center gap-3">
                <Info className="text-accent" /> Aile Hukuku Neleri Kapsar?
              </h3>
              
              <div className="editorial-fade grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Nişanlılık ve Evlenme", desc: "Nişanın bozulması sonucu doğan haklar ve evlilik akdinin kurulması." },
                  { title: "Boşanma Davaları", desc: "Anlaşmalı veya çekişmeli boşanma süreçlerinin yönetimi." },
                  { title: "Velayet ve Kişisel İlişki", desc: "Çocukların geleceğinin, eğitiminin ve yaşam alanının belirlenmesi." },
                  { title: "Nafaka Talepleri", desc: "Tedbir, yoksulluk ve iştirak nafakası gibi maddi düzenlemeler." },
                  { title: "Mal Rejimi Tasfiyesi", desc: "Evlilik birliği içinde edinilen varlıkların hakkaniyete uygun paylaşımı." },
                  { title: "Soybağı ve Evlat Edinme", desc: "Nesebin reddi, tanıma ve evlat edinme işlemleri." },
                  { title: "Aile İçi Şiddet ve Koruma", desc: "6284 sayılı kanun kapsamında uzaklaştırma ve koruma kararları." }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-white border border-charcoal/5 rounded-[2rem] hover:shadow-xl transition-all duration-500">
                    <h4 className="text-charcoal font-bold mb-2 flex items-center gap-2">
                      <ShieldCheck className="text-accent" size={16} /> {item.title}
                    </h4>
                    <p className="text-charcoal/50 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-10 pt-10 border-t border-charcoal/5">
              <h3 className="family-fade text-2xl font-bold text-charcoal">Dikkat Edilmesi Gereken Önemli Hususlar</h3>
              
              <div className="family-fade space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-accent/5 rounded-full flex items-center justify-center text-accent shrink-0">
                    <Baby size={24} />
                  </div>
                  <div>
                    <h4 className="text-charcoal font-bold text-lg mb-2">Çocuğun Üstün Yararı</h4>
                    <p className="text-charcoal/60 text-sm leading-relaxed">
                      Velayet uyuşmazlıklarında asıl olan anne veya babanın isteği değil, çocuğun bedensel, ruhsal ve sosyal gelişimi için en uygun olan kararın verilmesidir.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-accent/5 rounded-full flex items-center justify-center text-accent shrink-0">
                    <Scale size={24} />
                  </div>
                  <div>
                    <h4 className="text-charcoal font-bold text-lg mb-2">Delil Toplama ve Süreçler</h4>
                    <p className="text-charcoal/60 text-sm leading-relaxed">
                      İddia edilen kusurların (sadakatsizlik, şiddet vb.) hukuka uygun delillerle ispatlanması davanın seyrini değiştirir. Ayrıca maddi/manevi tazminat taleplerinde kanuni sürelere uyulması şarttır.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-accent/5 rounded-full flex items-center justify-center text-accent shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="text-charcoal font-bold text-lg mb-2">Anlaşmalı Boşanma Kolaylığı</h4>
                    <p className="text-charcoal/60 text-sm leading-relaxed">
                      Tarafların ortak bir paydada buluşması, sürecin çok daha hızlı ve psikolojik olarak daha az yıpratıcı tamamlanmasını sağlar. Hazırlanan protokol haklarınızı eksiksiz korumalıdır.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="family-fade p-8 bg-charcoal rounded-[2rem] text-cream">
               <p className="italic text-sm leading-relaxed opacity-80">
                 "Unutmayın: Aile hukukuna ilişkin her mesele, kişiye özeldir. Kendi durumunuza uygun hukuki bir yol haritası çizmek en sağlıklı sonuçları verecektir."
               </p>
            </div>
          </div>

          {/* Sidebar with Image */}
          <div className="w-full lg:w-1/3 sticky top-40">
            <div className="family-fade relative group">
              <div className="absolute -inset-4 bg-accent/20 rounded-[3rem] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
              <div className="relative rounded-[3rem] overflow-hidden border border-charcoal/5 shadow-2xl">
                <img 
                  src="/aile.png" 
                  alt="Aile Hukuku"
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
