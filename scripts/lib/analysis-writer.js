// scripts/lib/analysis-writer.js
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM = `Sen Av. Fethi Güzel'sin. Mahkeme kararlarını hukuk meraklısı vatandaşlar için analiz ediyorsun.

Ton: Deneyimli bir avukatın sohbet diliyle yazdığı kişisel analiz — bilgili ama jargonsuz. "Bu kararda dikkatimi çeken..." gibi kişisel gözlemler ekle.

Uzunluk: Her bölüm 80-120 kelime. Toplam 400-600 kelime.

Yanıtı SADECE aşağıdaki JSON formatında ver, başka hiçbir şey ekleme:
{
  "davaSozeti": "Ne oldu? Kim, neden mahkemeye gitti? (sade dil)",
  "mahkemeninKarari": "Ne karar verildi, hukuki gerekçe ne?",
  "benimGozlemim": "Av. Fethi Güzel'in kişisel değerlendirmesi. Karar standart mı, istisnai mi? Neden önemli?",
  "pratikEtki": "Bu karar hangi durumlarda emsal oluşturur? Benzer durumda olan biri için ne anlam taşır?"
}`;

function parseResponse(text, id) {
  const trimmed = text.trim();
  const cleaned = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`JSON parse failed for ${id}: ${e.message}\n---\n${cleaned}`);
  }
}

export async function writeAnalysis(highlight, client = new Anthropic()) {
  const content = [
    `Mahkeme: ${highlight.source}`,
    highlight.kunye ? `Künyesi: ${highlight.kunye}` : null,
    `Konu: ${highlight.konu || ''}`,
    `Özet: ${(highlight.publicSummary || highlight.konu || '').slice(0, 600)}`,
    highlight.date ? `Tarih: ${highlight.date}` : null,
  ].filter(Boolean).join('\n');

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: SYSTEM,
    messages: [{ role: 'user', content }]
  });

  const raw = msg.content?.[0]?.text;
  if (!raw) throw new Error(`Empty API response for highlight ${highlight.id}`);

  const sections = parseResponse(raw, highlight.id);

  const required = ['davaSozeti', 'mahkemeninKarari', 'benimGozlemim', 'pratikEtki'];
  for (const key of required) {
    if (typeof sections[key] !== 'string') {
      throw new Error(`Missing section '${key}' in response for ${highlight.id}`);
    }
  }

  return {
    id: highlight.id,
    generatedAt: new Date().toISOString(),
    sections,
    highlight: {
      source: highlight.source,
      kunye: highlight.kunye || null,
      konu: highlight.konu || null,
      date: highlight.date || null,
      url: highlight.url || null
    }
  };
}
