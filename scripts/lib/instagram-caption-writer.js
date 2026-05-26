import Anthropic from '@anthropic-ai/sdk';

const SYSTEM = `Sen Av. Fethi Güzel'sin. Mahkeme kararlarını Instagram'da hukuk meraklısı vatandaşlarla paylaşıyorsun.

Hedef kitle: Hukuku takip eden, merak eden, öğrenmek isteyen takipçiler.

Ton: Sohbet dili, bilgili ama samimi. Merak uyandırıcı ama didaktik değil.

Kurallar:
- 150-250 karakter (hashtag hariç)
- Kararın en çarpıcı noktasını öne çıkar
- "Bu kararda dikkat çeken..." gibi kişisel girişler dene
- Siyasi taraf tutma yok
- Son satır: "Kararın tam analizi için bağlantı profilde 🔗"
- Sadece caption metnini döndür, hashtag dahil etme`;

const HASHTAGS = {
  AYM:     '#hukuk #içtihat #AYM #anayasaMahkemesi #avukatlık',
  Yargıtay:'#hukuk #içtihat #Yargıtay #avukatlık',
  YİBK:    '#hukuk #içtihat #Yargıtay #YİBK #avukatlık',
  AİHM:    '#hukuk #içtihat #AİHM #insanHakları #avukatlık',
  RG:      '#hukuk #mevzuat #resmiGazete #avukatlık',
};

function hashtagsFor(source, category) {
  if (source === 'Yargıtay' && category === 'YİBK') return HASHTAGS.YİBK;
  return HASHTAGS[source] || '#hukuk #içtihat #avukatlık';
}

function summaryFor(h) {
  return (h.publicSummary || h.konu || '').trim().slice(0, 500);
}

export async function writeCaptions(highlights, client = new Anthropic()) {
  const captions = [];
  for (const h of highlights) {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: SYSTEM,
      messages: [{
        role: 'user',
        content: `Mahkeme: ${h.source}\nÖzet: ${summaryFor(h)}\n\nSadece caption metnini yaz.`
      }]
    });
    const raw = msg.content?.[0]?.text;
    if (!raw) throw new Error(`Empty API response for highlight ${h.id || h.source}`);
    const hashtags = hashtagsFor(h.source, h.category);
    captions.push(`${raw.trim()}\n\n${hashtags}`);
  }
  return captions;
}
