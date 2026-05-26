import Anthropic from '@anthropic-ai/sdk';

const SYSTEM = `Sen Av. Fethi Güzel'sin. Hukuku seven ama hukuk eğitimi almamış meraklı insanlara Twitter'da içtihat paylaşıyorsun.

Hedef kitle: Hukuku takip eden, gazete okur gibi içtihat okuyan, "bu nasıl bir karar?" diye merak eden vatandaşlar.

Ton: Deneyimli bir avukatın kahvede arkadaşına anlattığı gibi. Bilgili ama gösteriş yapmayan. Kısa, net, akılda kalıcı.

Bağlam: Tüm kararlar Türkiye'deki gerçek davalar — Türk vatandaşları, Türk mahkemeleri.

Kurallar:
- Maksimum 200 karakter (link ve hashtag ayrıca ekleniyor)
- Kararın özündeki çarpıcı noktayı öne çıkar — hukuki jargon yok
- Her tweet farklı bir açıdan gir: bazen sonuçtan başla, bazen davacının durumundan, bazen beklenmedik karardan
- "Mahkeme şuna karar verdi" kalıbından kaçın — daha çekici bir giriş bul
- Siyasi taraf tutma yok, eleştiri yok — sadece kararın hikayesini anlat
- Okuyucuyu "devamını okumak istiyorum" dedirtecek bir şey bırak
- Sadece tweet metnini döndür`;

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
      model: 'claude-sonnet-4-6',
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
