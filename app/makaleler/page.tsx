import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, Folder, ArrowRight, Download } from 'lucide-react';

function getMakaleler(dir: string, baseDir: string = ''): any[] {
  const absolutePath = path.join(process.cwd(), 'public', 'makaleler', dir);
  if (!fs.existsSync(absolutePath)) return [];
  
  const items = fs.readdirSync(absolutePath);
  let files: any[] = [];

  items.forEach(item => {
    const fullPath = path.join(absolutePath, item);
    const relativePath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      files = [...files, ...getMakaleler(relativePath, dir)];
    } else if (item.endsWith('.docx') || item.endsWith('.pdf')) {
      files.push({
        name: item.replace(/\.(docx|pdf)$/i, ''),
        path: relativePath.replace(/\\/g, '/'),
        category: dir || 'Genel',
        ext: path.extname(item).toLowerCase()
      });
    }
  });

  return files;
}

export default function MakalelerPage() {
  const articles = getMakaleler('');

  // Group by category
  const grouped = articles.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {});

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      
      <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <h2 className="text-accent font-heading text-sm tracking-widest uppercase mb-4">Akademik Yayınlar</h2>
          <h1 className="text-4xl md:text-6xl text-charcoal font-bold mb-6">
            Makaleler & <span className="font-drama italic text-accent">İncelemeler</span>
          </h1>
          <p className="text-charcoal/60 max-w-2xl mx-auto text-lg">
            Özel hukuk alanında kaleme alınmış akademik makaleler, sempozyum tebliğleri ve hukuki değerlendirmeler.
          </p>
        </header>

        <div className="space-y-24">
          {Object.entries(grouped).map(([category, items]: [string, any]) => (
            <section key={category} className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-charcoal/10"></div>
                <h3 className="text-accent font-heading font-bold text-sm tracking-[0.3em] uppercase px-4">
                  {category.replace(/\\/g, ' / ')}
                </h3>
                <div className="h-[1px] flex-1 bg-charcoal/10"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((article: any) => (
                  <div key={article.path} className="group bg-white border border-charcoal/5 rounded-[2.5rem] p-8 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-8">
                        <div className="w-10 h-10 bg-accent/5 rounded-full flex items-center justify-center text-accent">
                          <FileText size={20} />
                        </div>
                        <span className="font-mono text-[9px] text-charcoal/20 uppercase tracking-widest">
                          {article.ext === '.docx' ? 'DOCX' : 'PDF'}
                        </span>
                      </div>
                      <h4 className="text-xl font-heading font-bold text-charcoal mb-4 group-hover:text-accent transition-colors leading-tight">
                        {article.name}
                      </h4>
                    </div>

                    <div className="pt-8 border-t border-charcoal/5 mt-8 flex items-center justify-between">
                      <Link 
                        href={`/makale-oku/${article.path}`}
                        className="text-[10px] font-bold text-charcoal tracking-widest uppercase hover:text-accent flex items-center gap-2"
                      >
                        OKU <ArrowRight size={14} />
                      </Link>
                      <a 
                        href={`/makaleler/${article.path}`} 
                        download 
                        className="text-charcoal/20 hover:text-accent transition-colors"
                      >
                        <Download size={18} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
