"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Book, ShoppingCart, ArrowRight } from 'lucide-react';

export default function EserlerimPage() {
  const books = [
    {
      title: "Medeni Usul Hukukunda Ses ve Görüntünün Nakledilmesi Yoluyla Duruşma İcrası (e-duruşma)",
      subtitle: "Medeni Usul Hukukunda Teknoloji Entegrasyonu",
      author: "Av. Fethi Güzel",
      desc: "Teknolojinin gelişmesiyle birlikte yargılama hukukumuza giren 'e-duruşma' kurumunu tüm boyutlarıyla ele alan, teorik ve pratik sorunlara çözümler sunan kapsamlı bir eser. Akademik derinliği ve uygulama tecrübesini birleştiren bu çalışma, modern usul hukukunun temel referans noktalarından biridir.",
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800", // Placeholder for actual book cover
      links: [
        { name: "Seçkin Yayıncılık", url: "https://www.seckin.com.tr/kitap/614840900" },
        { name: "Pelikan Kitabevi", url: "https://www.pelikankitabevi.com.tr" },
        { name: "Filiz Kitabevi", url: "https://www.filizkitabevi.com" },
        { name: "Legal Kitabevi", url: "https://www.legalkitabevi.com" }
      ]
    }
  ];

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      
      <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-24 text-center">
          <h2 className="text-accent font-heading text-sm tracking-widest uppercase mb-4">Akademik Yayınlar</h2>
          <h1 className="text-4xl md:text-6xl text-charcoal font-bold mb-6">
            Eserlerim & <span className="font-drama italic text-accent">Yayınlar</span>
          </h1>
          <p className="text-charcoal/60 max-w-2xl mx-auto text-lg">
            Hukuk biliminin gelişimine katkı sunmak amacıyla hazırlanan, teori ve pratiği birleştiren akademik çalışmalarımız.
          </p>
        </header>

        {books.map((book, index) => (
          <section key={index} className="flex flex-col lg:flex-row gap-20 items-center mb-32">
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative group">
                {/* Book Shadow/Glow */}
                <div className="absolute -inset-4 bg-accent/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Book Mockup */}
                <div className="relative w-[320px] aspect-[2/3] bg-charcoal rounded-r-2xl shadow-[20px_20px_60px_rgba(0,0,0,0.3)] overflow-hidden border-y border-r border-cream/10">
                   <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/40 z-10"></div>
                   <div className="absolute inset-0 p-12 flex flex-col justify-between text-center">
                      <div className="space-y-4">
                        <div className="w-12 h-1 bg-accent mx-auto"></div>
                        <h4 className="text-accent font-heading text-4xl font-bold">e-duruşma</h4>
                      </div>
                      <p className="text-cream/40 text-[10px] font-mono leading-relaxed uppercase tracking-widest">
                        Medeni Usul Hukukunda Ses ve Görüntünün Nakledilmesi
                      </p>
                      <div className="text-cream/80 font-heading text-sm border-t border-cream/10 pt-4">
                        AV. FETHİ GÜZEL
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <h3 className="text-3xl md:text-5xl font-heading font-bold text-charcoal mb-6 leading-tight">
                {book.title}
              </h3>
              <p className="text-accent font-heading text-xl mb-8">{book.subtitle}</p>
              <p className="text-charcoal/60 text-lg leading-relaxed mb-12 font-sans">
                {book.desc}
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <ShoppingCart className="text-accent" />
                  <h4 className="text-charcoal font-bold uppercase tracking-widest text-sm">Satın Alma Kanalları</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {book.links.map((link) => (
                    <a 
                      key={link.name} 
                      href={link.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-4 bg-white border border-charcoal/5 rounded-2xl hover:border-accent hover:shadow-xl transition-all"
                    >
                      <span className="text-charcoal font-bold text-sm">{link.name}</span>
                      <ArrowRight size={16} className="text-accent transition-transform group-hover:translate-x-1" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
}
