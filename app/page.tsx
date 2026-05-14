import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Expertise from "@/components/Expertise";
import Protocol from "@/components/Protocol";
import FamilyLaw from "@/components/FamilyLaw";
import InsuranceLaw from "@/components/InsuranceLaw";
import PropertyLaw from "@/components/PropertyLaw";
import Articles from "@/components/Articles";
import DailyNews from "@/components/DailyNews";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative w-full bg-cream overflow-hidden">
      <Navbar />
      <Hero />
      <Expertise />
      <About />
      <Protocol />
      <FamilyLaw />
      <InsuranceLaw />
      <PropertyLaw />
      <DailyNews />
      <Articles />
      <Footer />
    </main>
  );
}
