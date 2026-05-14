const PREFIXES = {
  AYM: 'AYM',
  Yargıtay: 'Yargıtay',
  AİHM: 'AİHM',
  RG: 'Resmî Gazete',
  Mevzuat: 'Mevzuat'
};

const HASHTAGS = {
  AYM: ['#hukuk', '#içtihat', '#AYM'],
  Yargıtay: ['#hukuk', '#içtihat', '#yargıtay'],
  YİBK: ['#hukuk', '#YİBK', '#içtihat'],
  AİHM: ['#hukuk', '#içtihat', '#AİHM'],
  RG: ['#hukuk', '#mevzuat', '#resmigazete'],
  Mevzuat: ['#hukuk', '#mevzuat']
};

function prefixFor(item) {
  if (item.source === 'Yargıtay' && item.category === 'YİBK') return 'YİBK';
  return PREFIXES[item.source] || item.source;
}

function hashtagsFor(item) {
  if (item.source === 'Yargıtay' && item.category === 'YİBK') return HASHTAGS.YİBK;
  return HASHTAGS[item.source] || HASHTAGS.Mevzuat;
}

function bodyFor(item) {
  if (item.publicSummary && item.publicSummary.trim()) return item.publicSummary.trim();
  if (item.konu && item.konu.trim()) return item.konu.trim().slice(0, 150);
  return item.title || item.kunye || item.caseName || '';
}

function truncateToTweet(text, max) {
  if (text.length <= max) return text;
  const slice = text.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice) + '…';
}

export function buildTweet(item, siteDomain) {
  const prefix = prefixFor(item);
  const link = `${siteDomain}/icthat`;
  const tags = hashtagsFor(item).join(' ');
  const linkAndTags = `\n\nKünye ve detay: ${link}\n\n${tags}`;
  const bodyMax = 280 - (prefix.length + 2) - linkAndTags.length;
  const body = truncateToTweet(bodyFor(item), bodyMax);
  return `${prefix}: ${body}${linkAndTags}`;
}
