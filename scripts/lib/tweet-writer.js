import Anthropic from '@anthropic-ai/sdk';

const SYSTEM = `Sen Av. Fethi Güzel adına Twitter'da hukuki içtihatları paylaşan bir asistansın.
Görevin: Verilen içtihat özetini doğal, insansı ve yaratıcı bir tweet'e dönüştürmek.

Bağlam: Tüm kararlar Türkiye'de yaşanan olaylarla ilgilidir. Türk vatandaşları, Türk mahkemeleri ve Türkiye'deki hukuki süreçler söz konusudur.

Kurallar:
- Maksimum 200 karakter yaz (link ve hashtag ayrıca eklenecek)
- Türkçe, sohbet tonu — resmi veya bot dili yok
- Siyasi olarak tamamen nötr: taraf tutma, eleştiri yapma, yorum ekleme
- Her tweet farklı bir giriş kullansın: bazen soru, bazen anlatı, bazen çarpıcı bir cümle
- "Mahkeme karar verdi" veya "Anayasa Mahkemesi'ne göre" gibi klişe başlangıçlardan kaçın
- İçeriği Türkiye'deki insanların günlük hayatıyla ilişkilendir — okuyucu kendini görebilsin
- Sadece tweet metnini döndür, tırnak işareti veya açıklama ekleme`;

const HASHTAGS = {
  AYM: '#hukuk #AYM',
  Yargıtay: '#hukuk #Yargıtay',
  YİBK: '#hukuk #YİBK',
  AİHM: '#hukuk #AİHM',
  RG: '#hukuk #mevzuat',
};

function hashtagsFor(source, category) {
  if (source === 'Yargıtay' && category === 'YİBK') return HASHTAGS.YİBK;
  return HASHTAGS[source] || '#hukuk #içtihat';
}

function summaryFor(h) {
  return (h.publicSummary || h.konu || h.title || '').trim().slice(0, 500);
}

export async function writeTweets(highlights, siteDomain = 'avfethiguzel.com', client = new Anthropic()) {
  const tweets = [];
  for (const h of highlights) {
    const summary = summaryFor(h);
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: SYSTEM,
      messages: [{
        role: 'user',
        content: `Mahkeme: ${h.source}\nÖzet: ${summary}\n\nSadece tweet metnini yaz.`
      }]
    });
    const raw = msg.content?.[0]?.text;
    if (!raw) throw new Error(`Empty API response for highlight ${h.id || h.source}`);
    const body = raw.trim();
    const hashtags = hashtagsFor(h.source, h.category);
    const link = `${siteDomain}/icthat`;
    const full = `${body}\n\n${link} ${hashtags}`;
    tweets.push(full.slice(0, 280));
  }
  return tweets;
}
