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
