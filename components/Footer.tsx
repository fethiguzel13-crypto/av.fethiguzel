"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, Mail, Phone, Scale, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal pt-32 pb-12 px-6 rounded-t-[4rem] overflow-hidden" id="iletisim">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
          <div>
            <h2 className="text-accent font-heading text-sm tracking-widest uppercase mb-8">İletişim & Ofis</h2>
            <h3 className="text-4xl md:text-6xl text-cream font-bold mb-12">
              Çözüm için <span className="font-drama italic text-accent">Buradayız.</span>
            </h3>
            
            <div className="space-y-12">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-cream/5 rounded-full flex items-center justify-center text-accent shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-cream/40 text-[10px] uppercase tracking-widest mb-2 font-bold">Ofis Adresi</h4>
                  <p className="text-cream text-lg leading-relaxed">
                    Van Yolu Mah. Karayusuf Bey Bulvarı<br />
                    EYC İş Merkezi A Blok Kat 4 Daire 37<br />
                    Erciş / VAN
                  </p>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=Van+Yolu+Mah.+Karayusuf+Bey+Bulvar%C4%B1+EYC+I%C5%9F+Merkezi+Erci%C5%9F+Van" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-accent text-xs font-bold uppercase tracking-widest hover:underline"
                  >
                    Google Haritalar'da Aç →
                  </a>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-cream/5 rounded-full flex items-center justify-center text-accent shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-cream/40 text-[10px] uppercase tracking-widest mb-2 font-bold">E-Posta</h4>
                  <p className="text-cream text-lg">av.fethiguzel@hotmail.com</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-cream/5 rounded-full flex items-center justify-center text-accent shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-cream/40 text-[10px] uppercase tracking-widest mb-2 font-bold">WhatsApp</h4>
                  <a href="https://wa.me/905454095442" target="_blank" rel="noopener noreferrer" className="text-cream text-lg hover:text-accent transition-colors">
                    +90 545 409 54 42
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[400px] md:h-full min-h-[400px] rounded-[3rem] overflow-hidden border border-cream/10 grayscale hover:grayscale-0 transition-all duration-700 relative group">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3089.4754512457813!2d43.35!3d39.02!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDAxJzEyLjAiTiA0M8KwMjEnMDAuMCJF!5e0!3m2!1str!2str!4v1715340000000!5m2!1str!2str&q=Van+Yolu+Mah.+Karayusuf+Bey+Bulvar%C4%B1+EYC+I%C5%9F+Merkezi+Erci%C5%9F+Van" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              className="opacity-60 group-hover:opacity-100 transition-opacity duration-700"
            ></iframe>
          </div>
        </div>

        <div className="pt-20 border-t border-cream/5 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-cream">
                <Scale size={12} />
              </div>
              <span className="text-cream font-bold font-heading tracking-tight">AV. FETHİ GÜZEL</span>
            </Link>
            <p className="text-cream/30 text-xs font-sans">
              © {new Date().getFullYear()} Tüm Hakları Saklıdır. Reklam Yasağına Uygundur.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-cream/5 px-6 py-3 rounded-full border border-cream/10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-mono text-[10px] text-cream/60 tracking-widest uppercase">
              Sistem Operasyonel // Mevzuat Güncel
            </span>
          </div>

          <div className="flex gap-8 text-[10px] font-bold text-cream/40 tracking-widest uppercase">
            <Link href="#" className="hover:text-accent transition-colors">Baro Bilgileri</Link>
            <Link href="#" className="hover:text-accent transition-colors">KVKK</Link>
            <Link href="#" className="hover:text-accent transition-colors">Yasal Uyarı</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
