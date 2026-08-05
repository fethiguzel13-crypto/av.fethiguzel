/**
 * Stable kanun processing order for Google discovery quality passes.
 * Core first (plan AC1), then remaining packs alphabetically.
 */
export const CORE_KANUN_ORDER = [
  'tbk',
  'tmk',
  'tck',
  'hmk',
  'iik',
  'ttk',
  'cmk',
  'is-kanunu',
];

/** Remaining packs after core — stable alphabetical */
export const REST_KANUN_ORDER = [
  'aatuhk',
  'aile-koruma',
  'arabuluculuk',
  'belediye',
  'bk',
  'buyuksehir',
  'cck',
  'cek',
  'dernekler',
  'devlet-ihale',
  'dmk',
  'gvk',
  'il-idaresi',
  'imar',
  'isg',
  'jandarma',
  'kamu-ihale-sozlesmeleri',
  'kamulastirma',
  'katmulkiyeti',
  'kdvk',
  'kmk',
  'ktk',
  'kvk',
  'kvkk',
  'nhk',
  'otv',
  'pvsk',
  'rkhk',
  'sendikalar',
  'spk',
  'ssgssk',
  'tebligat',
  'tkhk',
  'tsk-ic-hizmet',
  'tvk',
  'vakiflar',
  'vuk',
  'yukk',
];

export const KANUN_SEO_ORDER = [...CORE_KANUN_ORDER, ...REST_KANUN_ORDER];

/**
 * High-intent madde numbers per kanun for priority-sitemap + live probes.
 * Only numbers that typically exist as madde-N in packs.
 */
export const PRIORITY_MADDE_BY_KANUN = {
  tbk: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 112, 125, 179, 207, 227, 299, 314,
    323, 344, 369, 470, 490, 502, 609,
  ],
  tmk: [1, 2, 3, 6, 8, 9, 19, 23, 24, 25, 166, 185, 202, 335, 499, 599, 639, 682, 704],
  tck: [1, 2, 20, 21, 22, 25, 37, 38, 39, 53, 61, 81, 82, 86, 87, 89, 106, 125, 141, 142, 148, 155, 157, 163, 204, 220, 250, 257, 280],
  hmk: [1, 2, 6, 10, 12, 24, 27, 33, 114, 119, 140, 188, 194, 297, 341, 352, 353, 355, 361, 389],
  iik: [1, 42, 58, 62, 67, 68, 72, 78, 82, 85, 88, 89, 94, 100, 106, 134, 150, 168, 179, 257, 277, 280],
  ttk: [1, 11, 12, 18, 124, 125, 152, 153, 329, 335, 338, 358, 391, 421, 480, 553, 644, 671],
  cmk: [1, 2, 90, 91, 100, 101, 102, 109, 116, 119, 134, 135, 140, 147, 170, 172, 223, 231, 250, 267, 280],
  'is-kanunu': [1, 2, 5, 8, 17, 18, 19, 20, 21, 22, 24, 25, 32, 41, 46, 53, 57, 59, 63],
};

/** Representative probe set: m.1 + mid + high-intent (for live quality gate) */
export function representativeMaddeIds(kanunId) {
  const list = PRIORITY_MADDE_BY_KANUN[kanunId];
  if (list && list.length) {
    const picks = new Set([list[0], list[Math.min(12, list.length - 1)], list[list.length - 1]]);
    // Always try 13 for tbk
    if (kanunId === 'tbk') picks.add(13);
    if (kanunId === 'tck') picks.add(86);
    if (kanunId === 'tmk') picks.add(166);
    return [...picks].map((n) => `madde-${n}`);
  }
  return ['madde-1', 'madde-2', 'madde-5'];
}

export function kanunOrderIndex(id) {
  return KANUN_SEO_ORDER.indexOf(id);
}

export function assertCoreFirstOrder(order = KANUN_SEO_ORDER) {
  for (let i = 0; i < CORE_KANUN_ORDER.length; i++) {
    if (order[i] !== CORE_KANUN_ORDER[i]) {
      throw new Error(
        `Core order broken at ${i}: expected ${CORE_KANUN_ORDER[i]}, got ${order[i]}`
      );
    }
  }
  return true;
}
