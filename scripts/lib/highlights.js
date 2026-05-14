const RG_KEYWORDS = /tüketici|borçlar|borcl|ticaret|sözleşme|iş kanunu|sgk|sosyal güvenlik|miras|aile|tmk|tbk|ttk|kefalet|icra|iflas/i;
const AYM_KEYWORDS = /ihlal|pilot|mülkiyet|adil yargılanma/i;

function pickYIBK(yargitay) {
  return yargitay.filter((it) => /YİBK|içtihadı birleştirme/i.test(it.daire || '') || /YİBK/i.test(it.category || '') || /YİBK/i.test(it.kunye || ''));
}

function pickAymHighPriority(aym) {
  return aym.filter((it) => AYM_KEYWORDS.test(`${it.tur || ''} ${it.konu || ''}`));
}

function pickHudocKey(hudoc) {
  return hudoc.filter((it) => it.importance === '1');
}

function pickRgRelevant(resmigazete) {
  return resmigazete.filter((it) => RG_KEYWORDS.test(it.title || ''));
}

function pickHgk(yargitay) {
  return yargitay.filter((it) => /Genel Kurulu/i.test(it.daire || ''));
}

export function selectHighlights(items) {
  const buckets = [
    pickYIBK(items.yargitay || []),
    pickAymHighPriority(items.aym || []),
    pickHudocKey(items.hudoc || []),
    pickRgRelevant(items.resmigazete || []),
    pickHgk(items.yargitay || [])
  ];

  const seen = new Set();
  const result = [];
  for (const bucket of buckets) {
    for (const item of bucket) {
      if (result.length >= 4) break;
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      result.push(item);
    }
    if (result.length >= 4) break;
  }
  return result;
}
