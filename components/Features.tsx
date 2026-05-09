"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function Features() {
  return (
    <section id="uzmanlik" className="py-32 px-6 bg-primary/95 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="text-accent font-mono text-sm tracking-[0.2em] uppercase">Sistem Yetenekleri</span>
          <h2 className="text-4xl md:text-5xl font-sans font-bold text-light mt-4 mb-6">Uzmanlık Arayüzleri</h2>
          <div className="w-16 h-1 bg-accent"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ShufflerCard />
          <TypewriterCard />
          <SchedulerCard />
        </div>
      </div>
    </section>
  );
}

function ShufflerCard() {
  const [items, setItems] = useState([
    { id: 1, title: "Borçlar Hukuku", desc: "Sözleşmeler, Tazminat ve Haksız Fiil Analizi" },
    { id: 2, title: "Medeni Hukuk", desc: "Kişiler, Eşya ve Miras Hukuku Çözümleri" },
    { id: 3, title: "Ticaret Hukuku", desc: "Şirketler ve Kıymetli Evrak İhtilafları" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const newArray = [...prev];
        const last = newArray.pop();
        if (last) newArray.unshift(last);
        return newArray;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card-hover bg-primary border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden flex flex-col h-[400px]">
      <h3 className="font-sans font-bold text-2xl text-light mb-2">Hukuki Diagnostik</h3>
      <p className="text-light/60 font-sans text-sm mb-8">Doktrin ve güncel içtihat ışığında derinlemesine analiz.</p>
      
      <div className="relative flex-1 mt-4">
        {items.map((item, index) => {
          const isTop = index === 0;
          const isMiddle = index === 1;
          const isBottom = index === 2;
          
          return (
            <div
              key={item.id}
              className="absolute w-full left-0 rounded-2xl p-6 bg-[#1A1A24] border border-white/5 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                top: isTop ? '0' : isMiddle ? '1rem' : '2rem',
                transform: `scale(${isTop ? 1 : isMiddle ? 0.95 : 0.9})`,
                opacity: isTop ? 1 : isMiddle ? 0.7 : 0.4,
                zIndex: 3 - index,
              }}
            >
              <div className="font-data text-accent text-xs mb-2">MODÜL {item.id}</div>
              <div className="font-bold text-light font-sans">{item.title}</div>
              <div className="text-light/50 text-xs mt-1">{item.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TypewriterCard() {
  const messages = [
    "> Yargıtay Kararı Taranıyor...",
    "> Emsal İçtihat Bulundu.",
    "> 6098 s. TBK m. 112 Analizi:",
    "> Borca Aykırılık Tespit Edildi.",
    "> Bekleyen Veriler Yükleniyor...",
  ];
  
  const [text, setText] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (charIndex < messages[msgIndex].length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + messages[msgIndex][charIndex]);
        setCharIndex((c) => c + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setText("");
        setCharIndex(0);
        setMsgIndex((m) => (m + 1) % messages.length);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, msgIndex, messages]);

  return (
    <div className="card-hover bg-primary border border-white/10 rounded-[2rem] p-8 shadow-2xl flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-sans font-bold text-2xl text-light">İçtihat Telemetrisi</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          <span className="font-data text-accent text-xs">CANLI</span>
        </div>
      </div>
      <p className="text-light/60 font-sans text-sm mb-6">Sürekli güncellenen mevzuat ve Yargıtay veri akışı.</p>
      
      <div className="flex-1 bg-black/40 rounded-xl p-6 font-data text-sm text-light/80 border border-white/5 relative overflow-hidden">
        <div className="whitespace-pre-wrap">{text}<span className="inline-block w-2 h-4 bg-accent ml-1 animate-pulse"></span></div>
        <div className="absolute bottom-4 right-4 opacity-10">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
        </div>
      </div>
    </div>
  );
}

function SchedulerCard() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const [activeDay, setActiveDay] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      
      // Reset
      tl.set(cursorRef.current, { x: 0, y: 100, opacity: 0, scale: 1 });
      tl.call(() => setActiveDay(null));

      // Enter & move to cell
      tl.to(cursorRef.current, { opacity: 1, duration: 0.3 })
        .to(cursorRef.current, { x: 140, y: 35, duration: 1, ease: "power2.inOut" })
        
      // Click cell
      tl.to(cursorRef.current, { scale: 0.9, duration: 0.1 })
        .call(() => setActiveDay(3)) // Wednesday
        .to(cursorRef.current, { scale: 1, duration: 0.1 })
        
      // Move to Save button
      tl.to(cursorRef.current, { x: 180, y: 160, duration: 0.8, ease: "power2.inOut", delay: 0.3 })
      
      // Click button
      tl.to(cursorRef.current, { scale: 0.9, duration: 0.1 })
        .to(btnRef.current, { scale: 0.95, duration: 0.1 }, "<")
        .to(cursorRef.current, { scale: 1, duration: 0.1 })
        .to(btnRef.current, { scale: 1, duration: 0.1 }, "<")
        
      // Fade out
      tl.to(cursorRef.current, { opacity: 0, duration: 0.5, delay: 0.2 });
      
    });
    return () => ctx.revert();
  }, []);

  const days = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="card-hover bg-primary border border-white/10 rounded-[2rem] p-8 shadow-2xl flex flex-col h-[400px] relative">
      <h3 className="font-sans font-bold text-2xl text-light mb-2">E-Duruşma Protokolü</h3>
      <p className="text-light/60 font-sans text-sm mb-8">Medeni Usul süreçlerinin dijital yönetimi.</p>
      
      <div className="flex-1 bg-[#1A1A24] rounded-xl p-6 border border-white/5 relative overflow-hidden flex flex-col">
        <div className="grid grid-cols-7 gap-2 mb-8">
          {days.map((d, i) => (
            <div 
              key={i} 
              className={`aspect-square rounded-md flex items-center justify-center font-data text-xs transition-colors duration-300 ${activeDay === i ? 'bg-accent text-primary font-bold' : 'bg-black/30 text-light/40 border border-white/5'}`}
            >
              {d}
            </div>
          ))}
        </div>
        
        <div className="mt-auto flex justify-end">
          <div ref={btnRef} className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-xs font-sans text-light/80">
            Sisteme Kaydet
          </div>
        </div>

        {/* Animated Cursor */}
        <div 
          ref={cursorRef} 
          className="absolute top-0 left-0 z-10 drop-shadow-lg"
          style={{ width: 24, height: 24 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light fill-light/20">
            <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
            <path d="m13 13 6 6"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
