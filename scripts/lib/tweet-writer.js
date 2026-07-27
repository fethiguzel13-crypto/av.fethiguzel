import { completeText } from './llm-client.js';

/**
 * X/Twitter only — Instagram'dan ayrı üslup:
 * Sade, normal yazı; hukuki-felsefi; "olması gereken" (normatif) çizgi.
 * Siyaset yok.
 */
const SYSTEM = `Sen Av. Fethi Güzel adına X/Twitter için hukuki not yazıyorsun.

Üslup (Instagram'dan farklı):
- Normal, sakin yazı — canlı hikâye dili, sahne, "işçi kardeşimiz" yok.
- Profesör / kıdemli hukukçu: hukuki ve felsefi.
- Kararı özetle, sonra "olması gereken"i söyle: adalet, usul, hak arama, hürriyet açısından ne doğru olurdu / ne vazgeçilmezdir.
- "Şöyle olması gerekir", "Usul adaletin taşıyıcısı olmalıdır" gibi ölçülü, normatif cümleler kur.
- Siyaset, parti, ideoloji, kampanya dili YASAK.
- Sansasyon yok. Emir kipi ve tık tuzağı yok.

Biçim:
1) 2–3 tam cümle; biraz uzun ve akıcı olabilir.
2) Gövde yaklaşık 190–240 karakter (link/hashtag ayrıca eklenir); toplam 280'e sığmalı.
3) Hashtag ve URL yazma — sadece gövde.
4) "Devamı sitede", "link bio" YASAK.`;

const HASHTAGS = {
  AYM: '#hukuk #AYM #içtihat',
  Yargıtay: '#hukuk #Yargıtay #içtihat',
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
  return HASHTAGS[source] || '#hukuk #içtihat';
}

function summaryFor(h) {
  return (h.publicSummary || h.konu || h.title || '').trim().slice(0, 700);
}

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
      maxTokens: 400,
      minChars: 100,
      user: `Kaynak: ${h.source}
Künye: ${h.kunye || h.title || ''}
Özet: ${summary}

Normal hukuki-felsefi tweet gövdesi yaz (Instagram hikâye dili kullanma).
1) Kararın özü (kısa)
2) Olması gereken: usul/adalet/hak arama açısından ne doğru olurdu veya neden vazgeçilmez
2–3 cümle, yarım bırakma. Hashtag/URL yok.`,
    });
    let clean = body
      .replace(/^["«»]|["«»]$/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    clean = clean
      .replace(/\b(iktidar|muhalefet|parti|seçim kampanyası)\b/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    const hashtags = hashtagsFor(h.source, h.category);
    const link = softLink(h);
    const suffix = `\n\n${link}\n${hashtags}`;
    if ((clean + suffix).length <= 280) {
      tweets.push(clean + suffix);
    } else {
      // Prefer complete sentences: drop last incomplete clause if needed
      let budget = 280 - suffix.length;
      let cut = clean.slice(0, budget);
      const lastStop = Math.max(cut.lastIndexOf('.'), cut.lastIndexOf(';'));
      if (lastStop > 80) cut = cut.slice(0, lastStop + 1);
      else cut = cut.replace(/\s+\S*$/, '').trim() + '.';
      tweets.push(cut + suffix);
    }
  }
  return tweets;
}
