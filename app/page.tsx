import { getMakaleler } from '@/lib/makaleler'

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import Publication from "@/components/Publication";
import Features from "@/components/Features";
import Protocol from "@/components/Protocol";
import Footer from "@/components/Footer";

export default function Home() {
  const makaleler = getMakaleler();

  return (
    <main className="relative w-full bg-primary overflow-hidden">
      <Navbar />
      <Hero />
      <Philosophy />
      <Publication />
      <Features />
      <Protocol makaleler={makaleler} />
      <Footer />
    </main>
  );
}
