import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 80;
const CONCURRENCY = 5;

export function buildPrompt(item) {
  const label = item.title || item.caseName || item.kunye || '(başlık yok)';
  const konu = item.konu || '';
  return `Sen bir hukuk iletişim uzmanısın. Sıradan bir vatandaşın anlayabileceği, jargon içermeyen, 1-2 cümlelik (maksimum 30 kelime) düz Türkçe açıklama yaz. Hukuki kavramları gündelik dile çevir. Markdown başlık veya madde işareti KULLANMA — sadece düz cümle yaz.

Başlık: ${label}
Hukuki konu: ${konu}

Vatandaş için açıkla (sadece cümle, başlık yok):`;
}

export function shouldSummarize(item) {
  if (item.publicSummary && item.publicSummary.trim().length > 0) return false;
  const hasContent =
    (item.konu && item.konu.trim()) ||
    (item.title && item.title.trim()) ||
    (item.kunye && item.kunye.trim()) ||
    (item.caseName && item.caseName.trim());
  return Boolean(hasContent);
}

async function summarizeOne(client, item) {
  try {
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [{ role: 'user', content: buildPrompt(item) }]
    });
    return resp.content?.[0]?.text?.trim() || '';
  } catch (err) {
    console.error(`[summarize] failed for ${item.id}: ${err.message}`);
    return '';
  }
}

async function processInBatches(items, fn, concurrency) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const idx = cursor++;
      results[idx] = await fn(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

export async function summarizeAll(items, apiKey) {
  if (!apiKey) {
    console.warn('[summarize] ANTHROPIC_API_KEY missing — skipping summaries');
    return items;
  }
  const client = new Anthropic({ apiKey });
  const toSummarize = items.filter(shouldSummarize);
  if (toSummarize.length === 0) return items;
  const summaries = await processInBatches(toSummarize, (it) => summarizeOne(client, it), CONCURRENCY);
  const byId = new Map(toSummarize.map((it, i) => [it.id, summaries[i]]));
  return items.map((it) => byId.has(it.id) ? { ...it, publicSummary: byId.get(it.id) || '' } : it);
}
