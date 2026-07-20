import { completeText } from './llm-client.js';

const SYSTEM = `Sen Av. Fethi Güzel adına X/Twitter için hukuki içerik yazıyorsun.

Kimlik: Tecrübeli, sakin, akademik üsluba yakın bir avukat. Popüler hukukçu pozları yok.
Kitle: Hukukçular, stajyerler, hukuk meraklısı okuyucular — ciddi ton.

Kurallar:
1) Metin hukuki olarak isabetli olsun; abartı, sansasyon, "şok karar" dili YOK.
2) Jargonu tamamen silme; teknik terimi kullanıyorsan bir cümlede anlaşılır kıl.
3) Maksimum 210 karakter (link ve hashtag ayrıca eklenecek).
4) "Devamı sitede", "link bio'da", "profildeki link", "tıkla oku" gibi tuzak cümleler YASAK.
5) Siyaset, parti, ideoloji yok.
6) Okuyucuya emir kipi verme; bilgilendir.
7) Karar/metin özünü tek net fikirle ver.
8) Sadece tweet gövdesini yaz; hashtag, URL, tırnak açıklaması ekleme.`;

const HASHTAGS = {
  AYM: '#hukuk #AYM',
  Yargıtay: '#hukuk #Yargıtay',
  YİBK: '#hukuk #YİBK',
  AİHM: '#hukuk #AİHM',
  TBK: '#hukuk #TBK',
  TMK: '#hukuk #TMK',
  İşK: '#hukuk #işhukuku',
  HMK: '#hukuk #HMK',
  İİK: '#hukuk #İİK',
  TCK: '#hukuk #TCK',
  RG: '#hukuk #mevzuat',
};

function hashtagsFor(source, category) {
  if (source === 'Yargıtay' && category === 'YİBK') return HASHTAGS.YİBK;
  return HASHTAGS[source] || '#hukuk';
}

function summaryFor(h) {
  return (h.publicSummary || h.konu || h.title || '').trim().slice(0, 600);
}

/** Soft site reference: bare domain only, no "continue on site" language */
function softLink(h) {
  if (h.url && h.url.includes('avfethiguzel.com')) {
    return h.url.replace(/^https?:\/\//, '');
  }
  return 'avfethiguzel.com';
}

export async function writeTweets(highlights) {
  const tweets = [];
  for (const h of highlights) {
    const summary = summaryFor(h);
    const body = await completeText({
      system: SYSTEM,
      maxTokens: 220,
      user: `Kaynak: ${h.source}
Künye: ${h.kunye || h.title || ''}
Özet: ${summary}

Tek tweet gövdesi yaz (hashtag ve link yok).`,
    });
    const clean = body
      .replace(/^["«»]|["«»]$/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    const hashtags = hashtagsFor(h.source, h.category);
    const link = softLink(h);
    // Link as plain reference at end — not "devamı için"
    const full = `${clean}\n\n${link}\n${hashtags}`;
    tweets.push(full.slice(0, 280));
  }
  return tweets;
}
