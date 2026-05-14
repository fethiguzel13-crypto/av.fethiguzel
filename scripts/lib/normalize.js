function categoryFromRGSection(section) {
  if (!section) return 'Diğer';
  const s = section.toUpperCase();
  if (s.includes('YÖNETMELİK')) return 'Yönetmelik';
  if (s.includes('KANUN')) return 'Kanun';
  if (s.includes('TEBLİĞ')) return 'Tebliğ';
  if (s.includes('KARAR')) return 'Karar';
  if (s.includes('GENELGE')) return 'Genelge';
  return 'Diğer';
}

function slugifyId(prefix, ...parts) {
  return prefix + '-' + parts
    .filter(Boolean)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeResmiGazete(rawSource) {
  if (!rawSource || rawSource.ok === false || !Array.isArray(rawSource.items)) return [];
  return rawSource.items.map((it) => ({
    id: slugifyId('rg', (it.date || '').replace(/-/g, ''), (it.href || '').split('/').pop()?.replace(/\.htm.*$/, '')),
    source: 'RG',
    sourceLabel: 'Resmî Gazete',
    category: categoryFromRGSection(it.category),
    icon: 'scroll-text',
    title: it.title || '(başlık yok)',
    konu: it.title || '',
    publicSummary: '',
    date: it.date || '',
    url: it.href || ''
  }));
}

function ddmmyyyyToIso(s) {
  if (!s || typeof s !== 'string') return '';
  const m = s.match(/^(\d{2})[.\/](\d{2})[.\/](\d{4})$/);
  if (!m) return '';
  return `${m[3]}-${m[2]}-${m[1]}`;
}

export function normalizeYargitay(rawSource) {
  if (!rawSource || rawSource.ok === false || !Array.isArray(rawSource.items)) return [];
  return rawSource.items.map((it) => ({
    id: slugifyId('y', it.id || `${it.esas}-${it.karar}`.replace(/\//g, '-')),
    source: 'Yargıtay',
    sourceLabel: 'Yargıtay',
    kunye: it.kunye || '',
    daire: it.daire || '',
    esas: it.esas || '',
    karar: it.karar || '',
    category: it.category || (it.daire?.includes('Genel Kurulu') ? 'HGK' : 'Diğer'),
    icon: 'scale',
    konu: it.konu || '',
    publicSummary: '',
    date: ddmmyyyyToIso(it.tarih),
    url: `https://karararama.yargitay.gov.tr/`
  }));
}

export function normalizeAym(rawSource) {
  if (!rawSource || rawSource.ok === false || !Array.isArray(rawSource.items)) return [];
  return rawSource.items.map((it) => ({
    id: slugifyId('aym', (it.basvuruNo || '').replace(/\//g, '-')),
    source: 'AYM',
    sourceLabel: 'Anayasa Mahkemesi',
    kunye: it.kunye || '',
    basvuruNo: it.basvuruNo || '',
    basvuran: it.basvuran || '',
    birim: it.birim || '',
    tur: it.tur || '',
    category: 'Bireysel Başvuru',
    icon: 'landmark',
    konu: it.konu || '',
    publicSummary: '',
    date: ddmmyyyyToIso(it.kararTarihi),
    url: `https://kararlarbilgibankasi.anayasa.gov.tr/`
  }));
}

export function normalizeHudoc(rawSource) {
  if (!rawSource || rawSource.ok === false || !Array.isArray(rawSource.items)) return [];
  return rawSource.items.map((it) => ({
    id: slugifyId('hudoc', it.itemId),
    source: 'AİHM',
    sourceLabel: 'AİHM',
    caseName: it.caseName || '',
    appNo: it.appNo || '',
    importance: it.importance || '',
    category: 'Türkiye Kararı',
    icon: 'flag',
    konu: it.conclusion || '',
    publicSummary: '',
    date: (it.date || '').slice(0, 10),
    url: `https://hudoc.echr.coe.int/eng?i=${encodeURIComponent(it.itemId || '')}`
  }));
}
