import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ToolsPreview from "@/components/ToolsPreview";
import DailyNews from "@/components/DailyNews";
import Articles from "@/components/Articles";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative w-full bg-cream overflow-hidden">
      <Navbar />
      <Hero />
      <ToolsPreview />
      <DailyNews />
      <Articles />
      <Footer />
    </main>
  );
}
