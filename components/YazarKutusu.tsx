import Link from "@/components/SiteLink";
import { yazarKutusuVerisi, type YazarKutusuGirdi } from '@/lib/yazar';

/**
 * İçerik sayfalarının sonundaki yazar satırı (Aylık plan G09): yazar sayfasına bağlantı, akademik kimlik, son
 * güncelleme ve kaynaklar. Veri `lib/yazar.ts`'ten; madde sayfaları aynı veriyi `yazarKutusuHtml()` ile basar.
 * Tarih yoksa ya da okunamıyorsa satır çizilmez; uydurma tarih yazılmaz.
 */
export default function YazarKutusu({ guncelleme, kaynaklar, className = '' }: YazarKutusuGirdi & { className?: string }) {
  const v = yazarKutusuVerisi({ guncelleme, kaynaklar });
  return (
    <aside
      aria-label="Yazar ve kaynak bilgisi"
      className={`rounded-2xl border border-charcoal/10 bg-white/60 px-5 py-4 text-sm text-charcoal/70 print:border-0 print:px-0 ${className}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40 mb-1.5">Yazar</p>
      <p>
        <Link href={v.sayfa} className="font-semibold text-charcoal hover:text-accent">{v.ad}</Link>
        <span className="text-charcoal/60"> · {v.kimlik}</span>
      </p>
      {v.guncelleme && (
        <p className="mt-1 text-xs text-charcoal/50">
          Son güncelleme: <time dateTime={v.guncelleme.iso}>{v.guncelleme.metin}</time>
        </p>
      )}
      {v.kaynaklar.length > 0 && (
        <>
          <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40 mt-4 mb-1.5">Kaynaklar</p>
          <ul className="list-disc pl-5 space-y-1 text-[13px]">
            {v.kaynaklar.map((k, i) => (
              <li key={`${k.ad}-${i}`}>
                {!k.url ? (
                  k.ad
                ) : k.url.startsWith('/') ? (
                  <Link href={k.url} className="text-accent hover:underline">{k.ad}</Link>
                ) : (
                  <a href={k.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    {k.ad}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
}
