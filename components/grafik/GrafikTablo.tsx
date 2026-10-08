import { sayi } from '@/lib/grafik-olcek.mjs';

/**
 * Grafiğin tablo görünümü (Aylık plan G17, dataviz erişilebilirlik kuralı): Grafiğin her değeri üzerine gelmeden ve
 * renge bakmadan buradan okunur. Klavye ve ekran okuyucu kullanıcısının yolu budur; grafik yalnız görsel özettir.
 */
export default function GrafikTablo({
  baslik,
  sutunlar,
  satirlar,
}: {
  baslik: string;
  sutunlar: [string, string];
  satirlar: [string | number, number][];
}) {
  return (
    <details className="mt-4 text-sm text-charcoal">
      <summary className="inline-flex min-h-6 cursor-pointer items-center font-medium text-ink-muted hover:text-charcoal">Tablo görünümü</summary>
      <table className="mt-3 w-full max-w-md border-collapse">
        <caption className="sr-only">{baslik}</caption>
        <thead>
          <tr className="border-b border-charcoal/15 text-left text-ink-muted">
            <th scope="col" className="py-1.5 pr-4 font-medium">{sutunlar[0]}</th>
            <th scope="col" className="py-1.5 text-right font-medium">{sutunlar[1]}</th>
          </tr>
        </thead>
        <tbody>
          {satirlar.map(([ad, deger]) => (
            <tr key={ad} className="border-b border-charcoal/10">
              <th scope="row" className="py-1.5 pr-4 text-left font-normal">{ad}</th>
              <td className="py-1.5 text-right tabular-nums">{sayi(deger)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
