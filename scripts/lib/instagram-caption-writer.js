import { completeText } from './llm-client.js';

const SYSTEM = `Sen Av. Fethi Güzel adına Instagram için hukuki içerik yazıyorsun.

Kimlik: Ciddi, ölçülü, akademik-pratik denge. Influencer dili yok.
Kitle: Hukukçu ve bilinçli vatandaş.

Kurallar:
1) 400–700 karakter (hashtag hariç). Paragraflı, okunaklı.
2) Konunun hukuki özünü doğru ver; sansasyon yok.
3) "Devamı profilde", "link bio", "hikâyede", "kaydetmeyi unutma" YASAK.
4) Site referansı en fazla bir kez ve sade: satır olarak avfethiguzel.com veya ilgili madde yolu.
5) Siyaset yok.
6) Emoji en fazla 1 adet veya hiç.
7) Sadece caption gövdesini yaz; hashtag listesini ekleme.`;

const HASHTAGS = {
  AYM: '#hukuk #içtihat #AYM #anayasahukuku',
  Yargıtay: '#hukuk #içtihat #Yargıtay',
  YİBK: '#hukuk #Yargıtay #YİBK',
  AİHM: '#hukuk #AİHM #insanHakları',
  TBK: '#hukuk #TBK #borçlarhukuku',
  TMK: '#hukuk #TMK #medeniHukuk',
  İşK: '#hukuk #işhukuku',
  HMK: '#hukuk #HMK #usul',
  İİK: '#hukuk #İİK #icra',
  TCK: '#hukuk #TCK #cezahukuku',
  RG: '#hukuk #mevzuat',
};

function hashtagsFor(source, category) {
  if (source === 'Yargıtay' && category === 'YİBK') return HASHTAGS.YİBK;
  return HASHTAGS[source] || '#hukuk #içtihat #avukatlık';
}

function summaryFor(h) {
  return (h.publicSummary || h.konu || '').trim().slice(0, 700);
}

const HEADLINE_SYSTEM = `Instagram kartı için tek cümlelik başlık yazıyorsun (hukuk editörü).

Kurallar:
- Tam cümle, nokta ile bitsin
- En fazla 110 karakter
- Sansasyon yok ("şok", "bomba" yok)
- Teknik isabetli, sade Türkçe
- Sadece cümleyi yaz`;

export async function generateCardHeadlines(highlights) {
  const headlines = [];
  for (const h of highlights) {
    const raw = await completeText({
      system: HEADLINE_SYSTEM,
      maxTokens: 80,
      user: `Kaynak: ${h.source}\nKünye: ${h.kunye || ''}\nÖzet: ${summaryFor(h)}\n\nTek cümle.`,
    });
    headlines.push(raw.replace(/^["']|["']$/g, '').trim());
  }
  return headlines;
}

export async function writeCaptions(highlights) {
  const captions = [];
  for (const h of highlights) {
    const raw = await completeText({
      system: SYSTEM,
      maxTokens: 500,
      user: `Kaynak: ${h.source}
Künye: ${h.kunye || h.title || ''}
Özet: ${summaryFor(h)}
İlgili sayfa (istersen satır olarak kullan): ${(h.url || 'avfethiguzel.com').replace(/^https?:\/\//, '')}

Caption gövdesi yaz (hashtag yok).`,
    });
    const hashtags = hashtagsFor(h.source, h.category);
    const body = raw.trim();
    // Ensure soft site line if model omitted it
    const hasSite = /avfethiguzel\.com/i.test(body);
    const withSite = hasSite
      ? body
      : `${body}\n\n${(h.url || 'https://avfethiguzel.com').replace(/^https?:\/\//, '')}`;
    captions.push(`${withSite}\n\n${hashtags}`);
  }
  return captions;
}
