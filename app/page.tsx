import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LibraryStrip from "@/components/LibraryStrip";
import ToolsPreview from "@/components/ToolsPreview";
import DailyNews from "@/components/DailyNews";
import Articles from "@/components/Articles";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative w-full bg-cream overflow-hidden">
      <Navbar />
      <Hero />
      <LibraryStrip />
      <ToolsPreview />
      <DailyNews />
      <Articles />
      <Footer />
    </main>
  );
}
