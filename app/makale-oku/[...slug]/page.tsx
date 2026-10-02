import type { Metadata } from 'next';
import path from 'path';
import mammoth from 'mammoth';
import Link from "@/components/SiteLink";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import YazarKutusu from '@/components/YazarKutusu';
import { jsonLdHtml } from '@/lib/json-ld';
import { makaleBasligi, makaleDosyaYolu, makaleOkuJsonLd } from '@/lib/makale-oku';
import { ArrowLeft, Download, FileText, Book } from 'lucide-react';

// Önceden metadata yoktu: sayfa kökün başlığını ve ana sayfa canonical'ını taşıyordu (G06b).
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const parcalar = (await params).slug.map((s) => decodeURIComponent(s));
  const baslik = makaleBasligi(parcalar[parcalar.length - 1]);
  return {
    title: baslik,
    description: `${baslik}: Av. Fethi Güzel'in özel hukuk alanındaki makalesinin tam metni.`,
    alternates: {
      canonical: `https://www.avfethiguzel.com/makale-oku/${parcalar.map(encodeURIComponent).join('/')}`,
    },
  };
}

export default async function MakaleOku({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const filePathParams = resolvedParams.slug.map(s => decodeURIComponent(s));
  const fileName = filePathParams[filePathParams.length - 1];
  const publicPath = `/makaleler/${filePathParams.join('/')}`;
  // Çözülmüş parça "../" taşıyabilir; yol yalnız makale klasöründeki dosyaya çıkıyorsa döner (G10).
  const absolutePath = makaleDosyaYolu(filePathParams);

  if (!absolutePath) {
    return (
      <div className="bg-cream min-h-screen">
        <Navbar />
        <main className="pt-40 pb-20 px-6 text-center max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Makale bulunamadı.</h2>
          <Link href="/makaleler" className="bg-accent text-white px-8 py-4 rounded-full font-bold">
            ARŞİVE DÖN
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const ext = path.extname(fileName).toLowerCase();
  let contentHtml = '';

  if (ext === '.docx') {
    try {
      const result = await mammoth.convertToHtml({ path: absolutePath });
      contentHtml = result.value;
    } catch (error) {
      console.error("Error parsing docx:", error);
      contentHtml = '<p>Makale içeriği okunamadı. Lütfen dosyayı indirmeyi deneyin.</p>';
    }
  }

  return (
    <div className="bg-cream min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(makaleOkuJsonLd(filePathParams)) }} />
      <Navbar />

      <main className="pt-40 pb-20 px-6 max-w-4xl mx-auto">
        <div className="mb-12 flex justify-between items-center">
          <Link 
            href="/makaleler" 
            className="group flex items-center gap-2 text-accent font-bold text-xs tracking-widest uppercase hover:translate-x-[-4px] transition-transform"
          >
            <ArrowLeft size={16} /> MAKALE ARŞİVİNE DÖN
          </Link>
          <a 
            href={publicPath} 
            download 
            className="flex items-center gap-2 bg-charcoal text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-accent transition-colors shadow-lg"
          >
            İNDİR <Download size={14} />
          </a>
        </div>

        <article className="bg-white border border-charcoal/5 rounded-[3rem] p-8 md:p-16 shadow-sm overflow-hidden">
          <header className="mb-16">
            <div className="flex items-center gap-3 text-accent font-mono text-[10px] tracking-[0.2em] uppercase mb-4">
              <FileText size={14} />
              <span>AKADEMİK İNCELEME</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-charcoal leading-[1.2]">
              {makaleBasligi(fileName)}
            </h1>
          </header>

          <div className="relative">
            {ext === '.pdf' ? (
              <div className="rounded-[2rem] overflow-hidden border border-charcoal/5 bg-charcoal/5 h-[80vh]">
                <iframe
                  src={`${publicPath}#toolbar=0&navpanes=0`}
                  className="w-full h-full border-none"
                  title={fileName}
                />
              </div>
            ) : ext === '.docx' ? (
              <div
                className="prose prose-lg prose-charcoal max-w-none 
                           prose-headings:font-heading prose-headings:text-charcoal
                           prose-p:text-charcoal/80 prose-p:leading-[1.8]
                           prose-strong:text-charcoal prose-strong:font-bold
                           prose-hr:border-charcoal/10"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            ) : (
              <div className="text-center py-24 bg-charcoal/5 rounded-[2rem]">
                <Book size={48} className="mx-auto text-charcoal/10 mb-6" />
                <h3 className="text-charcoal font-bold text-xl mb-4">Önizleme Desteklenmiyor</h3>
                <p className="text-charcoal/40 max-w-xs mx-auto">Bu dosya formatı tarayıcıda önizlenemiyor. Lütfen indirerek cihazınızda açın.</p>
              </div>
            )}
          </div>

          <div className="mt-20 pt-8 border-t border-charcoal/5 flex justify-between items-center text-[10px] font-mono text-charcoal/20">
             <span>DİJİTAL HUKUK KÜTÜPHANESİ // FETHİ GÜZEL</span>
             <span>DOSYA: {fileName}</span>
          </div>
        </article>

        <YazarKutusu className="mt-8" />
      </main>

      <Footer />
    </div>
  );
}
