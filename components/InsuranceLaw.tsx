"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, AlertCircle, Clock, Gavel, Camera, Bell } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function InsuranceLaw() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".insurance-fade", {
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
    <section id="sigorta-hukuku" className="py-32 px-6 bg-cream border-t border-charcoal/5" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          
          {/* Main Editorial Content */}
          <div className="w-full lg:w-2/3 space-y-12">
            <header className="space-y-6">
              <h2 className="insurance-fade text-accent font-heading text-sm tracking-[0.4em] uppercase">Güvence Rehberi</h2>
              <h1 className="insurance-fade text-4xl md:text-6xl text-charcoal font-bold leading-tight font-sans">
                Sigorta Hukuku: <br />
                <span className="font-drama italic text-accent">Haklarınızı Bilin, Güvende Kalın.</span>
              </h1>
              <p className="insurance-fade text-charcoal/70 text-lg md:text-xl font-sans leading-relaxed">
                Sigorta ilişkisi, temelinde bir güven sözleşmesidir. Bir tarafın ödediği belli bir ücret karşılığında, diğer tarafın olası bir zarar durumunda bu zararı gidermeyi üstlenmesini kapsar. Sürecin sorunsuz ilerlemesi için yasal sorumlulukların eksiksiz yerine getirilmesi gerekir.
              </p>
            </header>

            <div className="space-y-10">
              <h3 className="insurance-fade text-2xl font-bold text-charcoal border-b border-charcoal/10 pb-4">
                Sözleşme Aşamasında Dikkat Edilmesi Gerekenler
              </h3>
              
              <div className="insurance-fade grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Doğru Bilgi Verme", icon: <ShieldCheck size={20} />, desc: "Bilgilerin eksiksiz ve doğru olması tazminat hakkınız için elzemdir." },
                  { title: "Kapsam ve İstisnalar", icon: <AlertCircle size={20} />, desc: "Güvence dışında kalan durumları 'Genel ve Özel Şartlar'dan inceleyin." },
                  { title: "Ödeme Düzeni", icon: <Clock size={20} />, desc: "Prim ödemelerinin aksatılması korumanın sonlanmasına yol açabilir." }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-charcoal/5">
                    <div className="text-accent mb-4">{item.icon}</div>
                    <h4 className="text-charcoal font-bold text-sm mb-2">{item.title}</h4>
                    <p className="text-charcoal/40 text-[10px] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-10 pt-10 border-t border-charcoal/5">
              <h3 className="insurance-fade text-2xl font-bold text-charcoal">Hasar Anında İzlenecek Yol</h3>
              
              <div className="insurance-fade space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-accent/5 rounded-full flex items-center justify-center text-accent shrink-0">
                    <Bell size={24} />
                  </div>
                  <div>
                    <h4 className="text-charcoal font-bold text-lg mb-2">Hızlı Bildirim</h4>
                    <p className="text-charcoal/60 text-sm leading-relaxed">
                      Zarar meydana geldiğinde, yasada belirtilen süreler içinde (genellikle 5 iş günü) sigorta şirketine durum bildirilmelidir.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-accent/5 rounded-full flex items-center justify-center text-accent shrink-0">
                    <Camera size={24} />
                  </div>
                  <div>
                    <h4 className="text-charcoal font-bold text-lg mb-2">Delillerin Korunması</h4>
                    <p className="text-charcoal/60 text-sm leading-relaxed">
                      Olay yerindeki durumun fotoğraf çekilerek veya tutanak tutularak kayıt altına alınması, tazminat sürecini hızlandırır.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-accent/5 rounded-full flex items-center justify-center text-accent shrink-0">
                    <Gavel size={24} />
                  </div>
                  <div>
                    <h4 className="text-charcoal font-bold text-lg mb-2">Hak Arama ve Tahkim</h4>
                    <p className="text-charcoal/60 text-sm leading-relaxed">
                      Uyuşmazlıklarda Sigorta Tahkim Komisyonu veya Adli Yargı yoluna gidilebilir. Tazminat istemleri zararın öğrenilmesinden itibaren 2 yıl içinde zaman aşımına uğrar.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="insurance-fade p-8 bg-charcoal rounded-[2rem] text-cream">
               <p className="italic text-sm leading-relaxed opacity-80">
                 "Unutmayın: İyi yapılandırılmış bir sigorta sözleşmesi, en kötü gününüzde en büyük desteğinizdir. Hukuki destek almak süreci geciktirmemek adına hayatidir."
               </p>
            </div>
          </div>

          {/* Sidebar with Image */}
          <div className="w-full lg:w-1/3 sticky top-40">
            <div className="insurance-fade relative group">
              <div className="absolute -inset-4 bg-accent/20 rounded-[3rem] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
              <div className="relative rounded-[3rem] overflow-hidden border border-charcoal/5 shadow-2xl">
                <img 
                  src="/sigorta.png" 
                  alt="Sigorta Hukuku"
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
