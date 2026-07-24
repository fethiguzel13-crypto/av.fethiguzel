"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Search, Scale, Newspaper } from "lucide-react";

const LINKS = [
    {
        href: "/ara",
        icon: Search,
        title: "Mevzuat Ara",
        desc: "7800+ madde ve şerh içinde anında arama",
    },
    {
        href: "/mevzuat",
        icon: BookOpen,
        title: "Kanun Arşivi",
        desc: "45+ kanun, akademik şerhli madde bankası",
    },
    {
        href: "/icthat",
        icon: Newspaper,
        title: "Günlük İçtihat",
        desc: "Yargıtay, AYM ve Resmî Gazete taraması",
    },
    {
        href: "/hesaplama",
        icon: Scale,
        title: "Hesaplama Araçları",
        desc: "Kıdem, faiz, miras, nafaka ve daha fazlası",
    },
];

export default function LibraryStrip() {
    return (
        <section className="py-16 sm:py-24 px-5 sm:px-6 bg-cream">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 sm:mb-16">
                    <p className="text-accent font-heading text-xs tracking-widest uppercase mb-3">
                        Dijital Hukuk Kütüphanesi
                    </p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal tracking-tight">
                        Tek platformda <span className="font-drama italic text-accent font-medium">her şey</span>
                    </h2>
                    <p className="mt-4 text-charcoal/55 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                        En iyi hukuk siteleri yalnızca ofisi anlatmaz; ziyaretçiye araç verir.
                        Mevzuat arayın, şerh okuyun, içtihatı takip edin, hesabınızı yapın.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {LINKS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group p-7 sm:p-8 surface-card-hover"
                            >
                                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                    <Icon size={22} />
                                </div>
                                <h3 className="text-xl font-heading font-bold text-charcoal mb-2 group-hover:text-accent transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-charcoal/55 leading-relaxed">{item.desc}</p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
