"use client";

import React from 'react';

export default function Publication() {
  return (
    <section className="py-24 px-6 md:px-20 bg-secondary" id="yayinlar">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-accent uppercase tracking-[3px] text-sm font-semibold mb-2 block">Eserler</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-light mb-4">Yayınlar & Kitaplar</h2>
          <div className="w-16 h-[3px] bg-accent"></div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-16 bg-primary p-8 md:p-16 rounded-2xl border border-white/5 shadow-2xl">
          <div className="flex-shrink-0 w-full lg:w-[320px]">
            {/* Book Cover Placeholder style from original index.html */}
            <div className="w-full aspect-[2/3] bg-gradient-to-br from-[#2c3e50] to-[#1a252f] rounded border-2 border-[#34495e] shadow-[15px_15px_30px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
               <div className="absolute left-[10px] top-0 bottom-0 w-[2px] bg-white/20"></div>
               <h4 className="text-accent font-heading font-bold text-3xl mb-4">e-duruşma</h4>
               <p className="text-[#bdc3c7] text-xs">Medeni Usul Hukukunda Ses ve Görüntünün Nakledilmesi Yoluyla Duruşma İcrası</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-2xl md:text-4xl font-heading font-bold text-light mb-4">Medeni Usul Hukukunda Ses ve Görüntünün Nakledilmesi Yoluyla Duruşma İcrası (e-duruşma)</h3>
            <p className="text-accent font-heading text-lg mb-6">Yazar: Av. Fethi Güzel</p>
            <p className="text-muted text-lg leading-relaxed mb-10">
              Teknolojinin gelişmesiyle birlikte yargılama hukukumuza giren "e-duruşma" kurumunu tüm boyutlarıyla ele alan, teorik ve pratik sorunlara çözümler sunan kapsamlı bir eser.
            </p>
            
            <h4 className="font-bold text-light mb-6">Satın Alma Bağlantıları:</h4>
            <div className="flex flex-wrap gap-3">
              <a href="https://www.seckin.com.tr/kitap/614840900" target="_blank" className="px-6 py-3 bg-white/5 border border-white/10 rounded text-sm hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300">Seçkin Yayıncılık</a>
              <a href="https://www.pelikankitabevi.com.tr" target="_blank" className="px-6 py-3 bg-white/5 border border-white/10 rounded text-sm hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300">Pelikan Kitabevi</a>
              <a href="https://www.filizkitabevi.com" target="_blank" className="px-6 py-3 bg-white/5 border border-white/10 rounded text-sm hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300">Filiz Kitabevi</a>
              <a href="https://www.legalkitabevi.com" target="_blank" className="px-6 py-3 bg-white/5 border border-white/10 rounded text-sm hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300">Legal Kitabevi</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
