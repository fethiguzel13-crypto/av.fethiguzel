/**
 * Resmî metin yerine ÖZET konulduğunu gösteren desenler.
 *
 * Tek kaynak. `audit-official-text.mjs` bu desenlerle sorunu bulur,
 * `repair-official-text.mjs` aynı desenlerle onarılacak maddeyi seçer.
 * İkisi ayrı listelerle çalışırsa denetimin bulduğu madde onarımdan kaçar —
 * bu depoda aynı sapma rehber listelerinde bir kez yaşandı.
 *
 * Hepsi italik parantez içinde, üçüncü kişi ağzından yazılmış cümlelerdir:
 *   *(Tüm alt bentler resmi madde metninde sırasıyla … verilmiştir. …)*
 *   *(Metin yukarıda verilmiştir. …)*
 */
export const SUMMARY_MARKERS = [
  /resm[iî] madde metninde/i,
  /metin yukar[ıi]da verilmi[şs]tir/i,
  /\*\([^)]*d[üu]zenler\.\s*\)\*/i,
  /\*\([^)]*verilmi[şs]tir\.[^)]*\)\*/i,
  /ilgili f[ıi]kralar[ıi] [öo]zetlenmi[şs]/i,
];

/** Metinde resmî metin yerine özet bulunuyor mu? */
export const isSummarized = (text) =>
  typeof text === 'string' && SUMMARY_MARKERS.some((r) => r.test(text));
