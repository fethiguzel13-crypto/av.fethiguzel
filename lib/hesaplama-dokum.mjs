/**
 * Hesaplama araçlarının görsel dökümü (Aylık plan G17 adım 5). Döküm aracın kendi sonucundan türetilir; burada yeni oran,
 * tavan ya da vergi hesabı yapılmaz. Kesim sırası sabittir, zira renk kesimin kimliğini izler (dataviz): Sıfır tutarlı
 * kesim listeden çıkarılmaz, çizimde görünmez ama lejantta yerini korur.
 */

/**
 * Kıdem ve ihbar tazminatının brüt toplamı: net kıdem, net ihbar ve vergi kesintileri (damga ve ihbarın gelir vergisi).
 * @param {{ netKidem: number, damgaKidem: number, netIhbar: number, gvIhbar: number, damgaIhbar: number }} s
 */
export function kidemIhbarDokumu(s) {
  const kesimler = [
    { ad: 'Net kıdem tazminatı', deger: s.netKidem },
    { ad: 'Net ihbar tazminatı', deger: s.netIhbar },
    { ad: 'Vergi kesintileri', deger: s.damgaKidem + s.gvIhbar + s.damgaIhbar },
  ];
  return { toplam: kesimler.reduce((a, k) => a + k.deger, 0), kesimler };
}

/**
 * Faiz aracının "Anapara + Faiz" toplamı: anapara ve toplam faiz. Dönemsel modda dilimler renge bölünmez, zira dilim sayısı
 * kategorik paleti aşabilir; dilim tutarları aracın dönem çizelgesinde kalır.
 * @param {{ faizMiktari: number, toplam: number }} s
 */
export function faizDokumu(s) {
  const kesimler = [
    { ad: 'Anapara', deger: s.toplam - s.faizMiktari },
    { ad: 'Toplam faiz', deger: s.faizMiktari },
  ];
  return { toplam: s.toplam, kesimler };
}
