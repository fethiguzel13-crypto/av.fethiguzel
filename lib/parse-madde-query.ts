/**
 * "TBK 13", "tbk m.13", "TBK madde 13", "tmk-166" → kanun + madde no
 * Site araması ve /ara yönlendirmesi için.
 */

const CODE_TO_KANUN: Record<string, string> = {
  tbk: 'tbk',
  tmk: 'tmk',
  ttk: 'ttk',
  tck: 'tck',
  hmk: 'hmk',
  iik: 'iik',
  cmk: 'cmk',
  vuk: 'vuk',
  gvk: 'gvk',
  kvk: 'kvk',
  kdvk: 'kdvk',
  kvkk: 'kvkk',
  is: 'is-kanunu',
  iskanunu: 'is-kanunu',
  'is-kanunu': 'is-kanunu',
  isg: 'isg',
  ssgssk: 'ssgssk',
  tkhk: 'tkhk',
  ktk: 'ktk',
  aatuhk: 'aatuhk',
  arabuluculuk: 'arabuluculuk',
  tebligat: 'tebligat',
  imar: 'imar',
  dmk: 'dmk',
};

export type ParsedMaddeQuery = {
  kanunId: string;
  code: string;
  maddeNo: number;
  href: string;
};

/**
 * Tam madde sorgusu mu? (kanun kodu + numara)
 * true → doğrudan /mevzuat/{kanun}/madde-{n} sayfasına yönlendir.
 */
export function parseMaddeQuery(raw: string | null | undefined): ParsedMaddeQuery | null {
  if (!raw) return null;
  const q = String(raw)
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[–—]/g, '-');

  // TBK 13 | TBK m.13 | TBK m 13 | TBK madde 13 | tbk-13 | TBK.13
  const m =
    q.match(
      /^([a-zA-ZçğıöşüÇĞİÖŞÜ]{2,12})\s*(?:madde|m\.?|md\.?)?\s*[-.]?\s*(\d{1,4}[a-zA-Z]?)\s*$/i
    ) ||
    q.match(
      /^([a-zA-ZçğıöşüÇĞİÖŞÜ]{2,12})[-_/](\d{1,4}[a-zA-Z]?)\s*$/i
    );

  if (!m) return null;

  const codeRaw = m[1]
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9-]/g, '');

  const kanunId = CODE_TO_KANUN[codeRaw];
  if (!kanunId) return null;

  const numPart = m[2].toLowerCase();
  const maddeNo = parseInt(numPart, 10);
  if (!Number.isFinite(maddeNo) || maddeNo < 1) return null;

  const id = `madde-${numPart}`;
  const code = kanunId === 'is-kanunu' ? 'İş Kanunu' : kanunId.toUpperCase();

  return {
    kanunId,
    code: codeRaw.toUpperCase(),
    maddeNo,
    href: `/mevzuat/${kanunId}/${id}`,
  };
}
