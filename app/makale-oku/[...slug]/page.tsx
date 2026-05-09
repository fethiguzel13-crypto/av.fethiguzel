import path from 'path';
import fs from 'fs';
import mammoth from 'mammoth';
import Link from 'next/link';

export default async function MakaleOku({ params }: { params: { slug: string[] } }) {
  const filePathParams = params.slug.map(s => decodeURIComponent(s));
  const fileName = filePathParams[filePathParams.length - 1];
  const publicPath = `/makaleler/${filePathParams.join('/')}`;
  const absolutePath = path.join(process.cwd(), 'public', 'makaleler', ...filePathParams);

  if (!fs.existsSync(absolutePath)) {
    return (
      <main className="container" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '100vh', textAlign: 'center' }}>
        <h2>Makale bulunamadı.</h2>
        <Link href="/#makaleler" className="btn btn-primary" style={{ marginTop: '2rem' }}>Geri Dön</Link>
      </main>
    );
  }

  const ext = path.extname(fileName).toLowerCase();
  let contentHtml = '';

  if (ext === '.docx') {
    try {
      const result = await mammoth.extractHtml({ path: absolutePath });
      contentHtml = result.value;
    } catch (error) {
      console.error("Error parsing docx:", error);
      contentHtml = '<p>Makale içeriği okunamadı. Lütfen dosyayı indirmeyi deneyin.</p>';
    }
  }

  return (
    <main className="container" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/#makaleler" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 'bold' }}>
          <i className="fa-solid fa-arrow-left" style={{ marginRight: '0.5rem' }}></i> Makalelere Dön
        </Link>
        <a href={publicPath} download className="btn btn-outline" style={{ borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' }}>
          <i className="fa-solid fa-download" style={{ marginRight: '0.5rem' }}></i> İndir
        </a>
      </div>

      <div className="section-header">
        <h2 className="section-title" style={{ fontSize: '1.8rem', textAlign: 'left' }}>{fileName.replace(/\.(pdf|docx|udf)$/i, '')}</h2>
        <div className="divider"></div>
      </div>

      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        padding: '2rem', 
        borderRadius: '12px', 
        border: '1px solid var(--border-color)',
        minHeight: '600px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        {ext === '.pdf' ? (
          <iframe 
            src={`${publicPath}#toolbar=0&navpanes=0`} 
            style={{ width: '100%', height: '80vh', border: 'none', borderRadius: '8px' }} 
            title={fileName}
          />
        ) : ext === '.docx' ? (
          <div 
            className="makale-content" 
            dangerouslySetInnerHTML={{ __html: contentHtml }} 
            style={{ 
              lineHeight: '1.8', 
              fontSize: '1.1rem', 
              color: 'var(--text-primary)',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <i className="fa-solid fa-file-circle-exclamation" style={{ fontSize: '4rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}></i>
            <h3>Bu dosya formatı tarayıcıda önizlenemiyor.</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Lütfen dosyayı indirerek cihazınızda açın.</p>
          </div>
        )}
      </div>
    </main>
  );
}
