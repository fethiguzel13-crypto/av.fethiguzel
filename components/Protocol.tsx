"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { FileText, FileBadge } from "lucide-react";

export default function Protocol({ makaleler }: { makaleler: any[] }) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const cards = gsap.utils.toArray<HTMLElement>(".stack-card");
    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        
        gsap.to(card, {
          scale: 0.9,
          opacity: 0.5,
          filter: "blur(10px)",
          scrollTrigger: {
            trigger: card,
            start: "top top",
            end: "bottom top",
            scrub: true,
            pin: true,
            pinSpacing: false,
          }
        });
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="makaleler" className="relative w-full bg-primary py-20">
      
      {/* Card 1: Makalelerim */}
      <div className="stack-card h-screen w-full sticky top-0 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl h-[85vh] bg-primary border border-white/10 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row gap-8 shadow-2xl overflow-hidden relative">
          <div className="flex-1 z-10 flex flex-col">
            <span className="font-data text-accent text-sm md:text-lg mb-2 block">01 / ARŞİV</span>
            <h2 className="font-sans font-bold text-3xl md:text-5xl text-light mb-4">Makalelerim</h2>
            <p className="text-light/60 font-sans text-sm md:text-lg max-w-md mb-6">Özel hukuk alanındaki güncel akademik çalışmalarım ve pratik hukuki analizlerim.</p>
            
            {/* Real Makaleler List */}
            <div className="flex-1 overflow-y-auto pr-4 space-y-6 custom-scrollbar">
              {makaleler.map((kategori, index) => (
                <div key={index}>
                  <h4 className="text-accent font-sans font-semibold mb-3 border-b border-white/10 pb-2">{kategori.name}</h4>
                  <ul className="space-y-2">
                    {kategori.files.map((file: any, fIndex: number) => (
                      <li key={fIndex}>
                        <Link href={file.path} className="group flex items-start gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-transparent hover:border-white/10">
                          {file.ext === '.pdf' ? (
                            <FileText className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                          ) : (
                            <FileBadge className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                          )}
                          <span className="font-sans text-light/80 text-sm group-hover:text-light transition-colors">{file.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 relative hidden md:flex items-center justify-center pointer-events-none">
             <svg className="w-full h-full max-w-[300px] opacity-10 animate-[spin_40s_linear_infinite]" viewBox="0 0 100 100" fill="none" stroke="var(--accent)">
               <circle cx="50" cy="50" r="40" strokeWidth="0.5" strokeDasharray="4 4" />
               <circle cx="50" cy="50" r="30" strokeWidth="0.5" />
               <circle cx="50" cy="50" r="20" strokeWidth="1" strokeDasharray="1 4" />
               <path d="M50 10 L50 90 M10 50 L90 50" strokeWidth="0.5" opacity="0.5" />
               <path d="M22 22 L78 78 M22 78 L78 22" strokeWidth="0.5" opacity="0.5" />
             </svg>
          </div>
        </div>
      </div>

      {/* Card 2: Yayınlar */}
      <div className="stack-card h-screen w-full sticky top-0 flex items-center justify-center p-6">
        <div id="yayinlar" className="w-full max-w-5xl h-[85vh] bg-[#12121A] border border-white/10 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row gap-12 shadow-2xl overflow-hidden relative">
          <div className="flex-1 z-10 flex flex-col justify-center">
            <span className="font-data text-accent text-sm md:text-lg mb-4 block">02 / YAYINLAR</span>
            <h2 className="font-sans font-bold text-4xl md:text-5xl text-light mb-6">e-duruşma Kitabı</h2>
            <p className="text-light/60 font-sans text-lg max-w-md mb-8">"Medeni Usul Hukukunda Ses ve Görüntünün Nakledilmesi Yoluyla Duruşma İcrası" başlıklı eserim.</p>
            <div className="flex flex-wrap gap-4">
              <a href="https://www.seckin.com.tr/kitap/614840900" target="_blank" rel="noreferrer" className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm font-sans hover:border-accent hover:text-accent transition-colors">Seçkin Yayıncılık</a>
              <a href="https://www.pelikankitabevi.com.tr" target="_blank" rel="noreferrer" className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm font-sans hover:border-accent hover:text-accent transition-colors">Pelikan Kitabevi</a>
            </div>
          </div>
          <div className="flex-1 relative hidden md:flex items-center justify-center pointer-events-none">
             <div className="w-full h-full max-w-[300px] border border-white/10 rounded-xl relative overflow-hidden bg-black/20 flex flex-wrap gap-2 p-4 content-start">
                {Array.from({length: 48}).map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-white/5 rounded-sm"></div>
                ))}
                <div className="absolute top-0 left-0 w-full h-1 bg-accent/80 shadow-[0_0_15px_var(--accent)] animate-[scan_3s_ease-in-out_infinite_alternate]"></div>
             </div>
          </div>
        </div>
      </div>

      {/* Card 3: Hukuk Portalı */}
      <div className="stack-card h-screen w-full sticky top-0 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl h-[85vh] bg-primary border border-accent/30 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row gap-12 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-accent/5 z-0"></div>
          <div className="flex-1 z-10 flex flex-col justify-center">
            <span className="font-data text-accent text-sm md:text-lg mb-4 block">03 / PORTAL</span>
            <h2 className="font-sans font-bold text-4xl md:text-5xl text-light mb-6">Hukuk Portalı</h2>
            <p className="text-light/60 font-sans text-lg max-w-md mb-8">Medeni Hukuk, Borçlar Hukuku ve Ticaret Hukuku alanlarında kanun maddeleri, Yargıtay kararları ve akademik analizlere erişin.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/medeni-hukuk" className="magnetic-btn px-6 py-3 bg-accent text-primary rounded-full font-bold tracking-wide shadow-[0_0_15px_rgba(201,168,76,0.3)] hover:scale-105 transition-transform text-sm">
                <span className="relative z-10">Medeni Hukuk</span>
              </Link>
              <Link href="/borclar-hukuku" className="magnetic-btn px-6 py-3 bg-white/5 border border-white/10 text-light rounded-full font-semibold tracking-wide hover:border-accent hover:text-accent transition-all text-sm">
                <span className="relative z-10">Borçlar Hukuku</span>
              </Link>
              <Link href="/ticaret-hukuku" className="magnetic-btn px-6 py-3 bg-white/5 border border-white/10 text-light rounded-full font-semibold tracking-wide hover:border-accent hover:text-accent transition-all text-sm">
                <span className="relative z-10">Ticaret Hukuku</span>
              </Link>
            </div>
          </div>
          <div className="flex-1 relative hidden md:flex items-center justify-center z-10 pointer-events-none">
             <svg className="w-full max-w-[400px] h-32" viewBox="0 0 400 100" fill="none" stroke="var(--accent)" strokeWidth="2">
                <path className="animate-[dash_3s_linear_infinite]" d="M0 50 H100 L120 20 L150 90 L180 10 L210 80 L230 50 H400" strokeDasharray="800" strokeDashoffset="800" />
             </svg>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(1000%); }
        }
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(201, 168, 76, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(201, 168, 76, 0.6);
        }
      `}} />
    </section>
  );
}
