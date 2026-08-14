export const FEATURED_SLUGS = [
  'kidem-tazminati-nasil-alinir',
  'bosanma-davasi-nasil-acilir',
  'nafaka-davasi-nedir',
  'icra-takibi-nedir',
  'odeme-emrine-itiraz',
  'kira-artis-orani-nasil-hesaplanir',
  'kiraci-nasil-tahliye-edilir',
  'veraset-ilami-nasil-alinir',
  'trafik-cezasina-itiraz',
  'tuketici-hakem-heyeti',
  'arabuluculuk-nasil-yapilir',
  'tapu-devri-nasil-yapilir',
  'emlak-vergisi-nedir',
  'hukuk-davasi-nasil-acilir',
  'koruma-karari-6284',
  'issizlik-maasi-sartlari',
] as const;

export const CATEGORY_BLURB: Record<string, string> = {
  Aile: 'Boşanma, nafaka, velayet, 6284 koruma.',
  İş: 'Kıdem, ihbar, işe iade, fazla mesai.',
  İcra: 'Ödeme emri, itiraz, haciz.',
  Kira: 'Artış, tahliye, depozito.',
  Tüketici: 'Hakem heyeti, ayıplı mal, cayma.',
  Miras: 'Veraset ilamı, pay, saklı pay, ret.',
  Eşya: 'Tapu, aidat, izale-i şuyu.',
  Usul: 'Dava, arabuluculuk, istinaf, temyiz.',
  İdare: 'İptal davası, kamulaştırma.',
  Trafik: 'Ceza itirazı, ehliyet, kaza.',
  Vergi: 'Emlak vergisi, yapılandırma.',
  'Sosyal Güvenlik': 'Emeklilik, işsizlik, SGK dökümü.',
  Ceza: 'Suç duyurusu, şikâyet.',
  Nüfus: 'Nüfus kayıt, kimlik işlemleri.',
  'Engelli Hakları': 'Rapor, ÖTV, araç.',
};

export function firstSentence(text: string): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const part = cleaned.split(/(?<=[.!?])\s+/)[0] || cleaned;
  return part.length > 180 ? part.slice(0, 177) + '…' : part;
}
