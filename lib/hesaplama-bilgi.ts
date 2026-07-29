/**
 * Hesaplama aracı → /bilgi vatandaş rehberi çapraz linkleri.
 * SEO iç link grafiği: hesaplama niyetini derin rehbere bağlar.
 */

export type BilgiLink = { label: string; href: string };

/** Araç id → ilgili vatandaş rehberi sayfaları (max ~4 önerilir) */
export const HESAPLAMA_BILGI_MAP: Record<string, BilgiLink[]> = {
  miras: [
    { label: 'Miras payı nasıl hesaplanır?', href: '/bilgi/miras-payi-nasil-hesaplanir' },
    { label: 'Veraset ilamı nasıl alınır?', href: '/bilgi/veraset-ilami-nasil-alinir' },
    { label: 'e-Devlet veraset', href: '/bilgi/e-devlet-veraset' },
  ],
  'sakli-pay': [
    { label: 'Saklı pay nedir?', href: '/bilgi/sakli-pay-nedir' },
    { label: 'Miras payı rehberi', href: '/bilgi/miras-payi-nasil-hesaplanir' },
  ],
  kidem: [
    { label: 'Kıdem tazminatı nasıl alınır?', href: '/bilgi/kidem-tazminati-nasil-alinir' },
    { label: 'İhbar tazminatı nedir?', href: '/bilgi/ihbar-tazminati-nedir' },
    { label: 'İş sözleşmesi feshi', href: '/bilgi/is-sozlesmesi-feshi' },
  ],
  'ise-iade': [
    { label: 'İşe iade davası', href: '/bilgi/ise-iade-davasi' },
    { label: 'İşe iade tazminatı', href: '/bilgi/ise-iade-tazminati' },
    { label: 'İş sözleşmesi feshi', href: '/bilgi/is-sozlesmesi-feshi' },
  ],
  'kidem-ise-iade': [
    { label: 'Kıdem tazminatı rehberi', href: '/bilgi/kidem-tazminati-nasil-alinir' },
    { label: 'İşe iade davası', href: '/bilgi/ise-iade-davasi' },
    { label: 'Arabuluculuk (dava şartı)', href: '/bilgi/arabuluculuk-nasil-yapilir' },
  ],
  'fazla-mesai': [
    { label: 'Fazla mesai ücreti', href: '/bilgi/fazla-mesai-ucreti' },
    { label: 'Kıdem tazminatı rehberi', href: '/bilgi/kidem-tazminati-nasil-alinir' },
  ],
  'yillik-izin': [
    { label: 'Yıllık izin hakkı', href: '/bilgi/yillik-izin-hakki' },
    { label: 'İş sözleşmesi feshi', href: '/bilgi/is-sozlesmesi-feshi' },
  ],
  smm: [
    { label: 'KDV nedir?', href: '/bilgi/kdv-nedir' },
    { label: 'Noter işlemleri', href: '/bilgi/noter-islemleri' },
  ],
  'net-brut-maas': [
    { label: 'İşsizlik maaşı şartları', href: '/bilgi/issizlik-maasi-sartlari' },
    { label: 'Kıdem tazminatı rehberi', href: '/bilgi/kidem-tazminati-nasil-alinir' },
  ],
  'issizlik-maasi': [
    { label: 'İşsizlik maaşı şartları', href: '/bilgi/issizlik-maasi-sartlari' },
    { label: 'İşsizlik maaşı hesaplama', href: '/bilgi/issizlik-maasi-hesaplama' },
    { label: 'İş sözleşmesi feshi', href: '/bilgi/is-sozlesmesi-feshi' },
  ],
  nafaka: [
    { label: 'Nafaka davası nedir?', href: '/bilgi/nafaka-davasi-nedir' },
    { label: 'Boşanma davası nasıl açılır?', href: '/bilgi/bosanma-davasi-nasil-acilir' },
    { label: 'Yoksulluk nafakası', href: '/bilgi/yoksulluk-nafakasi-sartlari' },
  ],
  iddet: [
    { label: 'Boşanma davası nasıl açılır?', href: '/bilgi/bosanma-davasi-nasil-acilir' },
    { label: 'Nafaka davası', href: '/bilgi/nafaka-davasi-nedir' },
  ],
  'mal-rejimi': [
    { label: 'Mal rejimi tasfiyesi', href: '/bilgi/mal-rejimi-tasfiyesi' },
    { label: 'Boşanma davası', href: '/bilgi/bosanma-davasi-nasil-acilir' },
  ],
  faiz: [
    { label: 'Temerrüt faizi nedir?', href: '/bilgi/temerrut-faizi-nedir' },
    { label: 'Faiz hesaplama rehberi', href: '/bilgi/faiz-hesaplama-rehberi' },
    { label: 'İcra takibi nedir?', href: '/bilgi/icra-takibi-nedir' },
  ],
  'icra-kapak': [
    { label: 'İcra takibi nedir?', href: '/bilgi/icra-takibi-nedir' },
    { label: 'Ödeme emrine itiraz', href: '/bilgi/odeme-emrine-itiraz' },
    { label: 'İcra dosyası sorgulama', href: '/bilgi/icra-dosyasi-sorgulama' },
  ],
  'inkar-tazminati': [
    { label: 'İcra inkâr tazminatı', href: '/bilgi/icra-inkar-tazminati' },
    { label: 'Ödeme emrine itiraz', href: '/bilgi/odeme-emrine-itiraz' },
    { label: 'İcra takibi nedir?', href: '/bilgi/icra-takibi-nedir' },
  ],
  kira: [
    { label: 'Kira artış oranı nasıl hesaplanır?', href: '/bilgi/kira-artis-orani-nasil-hesaplanir' },
    { label: 'Kiracı nasıl tahliye edilir?', href: '/bilgi/kiraci-nasil-tahliye-edilir' },
    { label: 'Kira tespit davası', href: '/bilgi/kira-tespit-davasi' },
  ],
  'kira-tespit': [
    { label: 'Kira tespit davası', href: '/bilgi/kira-tespit-davasi' },
    { label: 'Kira artış oranı', href: '/bilgi/kira-artis-orani-nasil-hesaplanir' },
    { label: 'Arabuluculuk (kira)', href: '/bilgi/kira-uyusmazligi-arabuluculuk' },
  ],
  tapu: [
    { label: 'Tapu devri nasıl yapılır?', href: '/bilgi/tapu-devri-nasil-yapilir' },
    { label: 'Tapu harcı hesaplama', href: '/bilgi/tapu-harci-hesaplama' },
    { label: 'İskan belgesi nedir?', href: '/bilgi/iskan-belgesi-nedir' },
  ],
  'arac-deger-kaybi': [
    { label: 'Araç değer kaybı', href: '/bilgi/deger-kaybi-arac' },
    { label: 'Trafik kazası tazminatı', href: '/bilgi/trafik-kazasi-tazminati' },
    { label: 'Sigorta tazminat reddi', href: '/bilgi/sigorta-tazminat-reddi' },
  ],
  vekalet: [
    { label: 'Avukat vekalet ücreti', href: '/bilgi/avukat-vekalet-ucreti' },
    { label: 'Hukuk davası nasıl açılır?', href: '/bilgi/hukuk-davasi-nasil-acilir' },
    { label: 'Dava harcı nedir?', href: '/bilgi/dava-harci-nedir' },
  ],
  'dava-harci': [
    { label: 'Dava harcı nedir?', href: '/bilgi/dava-harci-nedir' },
    { label: 'Hukuk davası nasıl açılır?', href: '/bilgi/hukuk-davasi-nasil-acilir' },
    { label: 'Arabuluculuk (dava şartı)', href: '/bilgi/arabuluculuk-nasil-yapilir' },
  ],
  arabuluculuk: [
    { label: 'Arabuluculuk nasıl yapılır?', href: '/bilgi/arabuluculuk-nasil-yapilir' },
    { label: 'Arabuluculuk ücreti', href: '/bilgi/arabuluculuk-ucreti' },
    { label: 'Anlaşma belgesi', href: '/bilgi/arabuluculuk-anlasma-belgesi' },
  ],
  sure: [
    { label: 'Tebligat usulsüzlüğü', href: '/bilgi/tebligat-usulsuzlugu' },
    { label: 'İstinaf nedir?', href: '/bilgi/istinaf-nedir' },
    { label: 'Ödeme emrine itiraz (7 gün)', href: '/bilgi/odeme-emrine-itiraz' },
  ],
  zamanasimi: [
    { label: 'Zamanaşımı nedir?', href: '/bilgi/zamanaşimi-nedir' },
    { label: 'TBK m.125 özeti', href: '/bilgi/tbk-madde-125' },
    { label: 'İşçilik alacakları zamanaşımı', href: '/bilgi/iscilik-alacaklari-zamansimi' },
  ],
  'ceza-zamanasimi': [
    { label: 'Zamanaşımı nedir?', href: '/bilgi/zamanaşimi-nedir' },
    { label: 'Tutuklama nedir?', href: '/bilgi/tutuklama-nedir' },
    { label: 'Savcılığa suç duyurusu', href: '/bilgi/savcilik-suc-duyurusu' },
  ],
  'istinaf-temyiz': [
    { label: 'İstinaf nedir?', href: '/bilgi/istinaf-nedir' },
    { label: 'İstinaf dilekçesi', href: '/bilgi/istinaf-dilekcesi' },
    { label: 'Hukuk davası nasıl açılır?', href: '/bilgi/hukuk-davasi-nasil-acilir' },
  ],
  risk: [
    { label: 'Hukuk davası nasıl açılır?', href: '/bilgi/hukuk-davasi-nasil-acilir' },
    { label: 'Arabuluculuk (dava şartı)', href: '/bilgi/arabuluculuk-nasil-yapilir' },
    { label: 'Dava harcı nedir?', href: '/bilgi/dava-harci-nedir' },
  ],
  infaz: [
    { label: 'Tutuklama nedir?', href: '/bilgi/tutuklama-nedir' },
    { label: 'Savcılığa suç duyurusu', href: '/bilgi/savcilik-suc-duyurusu' },
  ],
  kdv: [
    { label: 'KDV nedir?', href: '/bilgi/kdv-nedir' },
    { label: 'Vergi borcu yapılandırma', href: '/bilgi/vergi-borcu-yapislandirma' },
  ],
  'gecikme-zammi': [
    { label: 'Vergi borcu yapılandırma', href: '/bilgi/vergi-borcu-yapislandirma' },
    { label: 'Temerrüt faizi', href: '/bilgi/temerrut-faizi-nedir' },
    { label: 'İcra takibi', href: '/bilgi/icra-takibi-nedir' },
  ],
  'damga-vergisi': [
    { label: 'Noter işlemleri', href: '/bilgi/noter-islemleri' },
    { label: 'Tapu devri', href: '/bilgi/tapu-devri-nasil-yapilir' },
    { label: 'KDV nedir?', href: '/bilgi/kdv-nedir' },
  ],
  'is-kazasi': [
    { label: 'İş kazası tazminatı', href: '/bilgi/is-kazasi-tazminati' },
    { label: 'İş kazası bildirimi', href: '/bilgi/is-kazasi-bildirimi' },
    { label: 'İş kazası sonrası haklar', href: '/bilgi/is-kazasi-sonrasi-haklar' },
  ],
};

export function bilgiLinksForArac(aracId: string): BilgiLink[] {
  return HESAPLAMA_BILGI_MAP[aracId] ?? [];
}

/** /bilgi/{slug} → ilgili hesaplama araçları (ters indeks) */
export function hesaplamaToolsForBilgiSlug(slug: string): { id: string; label: string; href: string }[] {
  const out: { id: string; label: string; href: string }[] = [];
  const target = `/bilgi/${slug}`;
  for (const [id, links] of Object.entries(HESAPLAMA_BILGI_MAP)) {
    if (links.some((l) => l.href === target)) {
      out.push({ id, label: `Hesaplama: ${id}`, href: `/hesaplama/${id}` });
    }
  }
  return out;
}

/** Kaç aracın en az bir /bilgi linki var (bakım metriği) */
export function hesaplamaBilgiCoverage(): { total: number; withLinks: number } {
  const ids = Object.keys(HESAPLAMA_BILGI_MAP);
  return { total: ids.length, withLinks: ids.filter((id) => (HESAPLAMA_BILGI_MAP[id]?.length ?? 0) > 0).length };
}
