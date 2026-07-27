/**
 * LLM helper: Gemini preferred by default (Anthropic often out of credits).
 * Override: SOCIAL_LLM=anthropic|gemini
 * Model: SOCIAL_GEMINI_MODEL (default gemini-flash-lite-latest)
 *
 * Note: gemini-flash-latest / 2.5+ "thinking" models eat maxOutputTokens
 * for internal thought — use flash-lite or raise maxOutputTokens a lot.
 */
import Anthropic from '@anthropic-ai/sdk';

/** Serial queue so parallel writers don't burn Gemini rate limit */
let chain = Promise.resolve();
function enqueue(fn) {
    const run = chain.then(fn, fn);
    chain = run.catch(() => { });
    return run;
}

async function callAnthropic({ system, user, maxTokens }) {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
        model: process.env.SOCIAL_CLAUDE_MODEL || 'claude-sonnet-4-6',
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: user }],
    });
    const text = msg.content?.[0]?.text?.trim();
    if (!text) throw new Error('Anthropic empty response');
    return text;
}

function isThinkingModel(model) {
    // flash-latest / pro-latest / 2.5+ may spend budget on hidden thinking
    return /flash-latest|pro-latest|2\.5|3\./i.test(model) && !/lite/i.test(model);
}

async function callGeminiOnce(model, { system, user, maxTokens }) {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    // Thinking models need a much larger budget or thinking disabled
    const outTokens = isThinkingModel(model)
        ? Math.max(maxTokens * 4, 2048)
        : Math.max(maxTokens, 256);

    const generationConfig = {
        maxOutputTokens: outTokens,
        temperature: 0.55,
    };
    // Prefer no internal thinking when API supports it
    if (isThinkingModel(model)) {
        generationConfig.thinkingConfig = { thinkingBudget: 0 };
    }

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents: [{ role: 'user', parts: [{ text: user }] }],
            generationConfig,
        }),
    });
    if (!res.ok) {
        const t = await res.text();
        const err = new Error(`Gemini ${model} HTTP ${res.status}: ${t.slice(0, 200)}`);
        err.status = res.status;
        throw err;
    }
    const data = await res.json();
    const cand = data?.candidates?.[0];
    const text = cand?.content?.parts?.map((p) => p.text).filter(Boolean).join('').trim();
    if (!text) {
        const reason = cand?.finishReason || data?.promptFeedback?.blockReason || 'empty';
        throw new Error(`Gemini ${model} empty (${reason})`);
    }
    return text;
}

async function callGemini({ system, user, maxTokens }) {
    const models = [
        process.env.SOCIAL_GEMINI_MODEL || 'gemini-flash-lite-latest',
        'gemini-flash-lite-latest',
        'gemini-2.0-flash-lite',
        'gemini-2.0-flash',
        'gemini-flash-latest',
        'gemini-pro-latest',
    ];
    const seen = new Set();
    const list = models.filter((m) => {
        if (!m || seen.has(m)) return false;
        seen.add(m);
        return true;
    });

    let lastErr;
    for (const model of list) {
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                return await callGeminiOnce(model, { system, user, maxTokens });
            } catch (e) {
                lastErr = e;
                if (e.status === 429) {
                    await new Promise((r) => setTimeout(r, 1800 * (attempt + 1)));
                    continue;
                }
                break;
            }
        }
    }
    throw lastErr || new Error('Gemini failed');
}

/**
 * @param {{ system: string, user: string, maxTokens?: number, minChars?: number }} opts
 */
export async function completeText({ system, user, maxTokens = 400, minChars = 40 }) {
    return enqueue(async () => {
        const prefer = (process.env.SOCIAL_LLM || 'gemini').toLowerCase();
        const order = prefer === 'anthropic' ? ['anthropic', 'gemini'] : ['gemini', 'anthropic'];
        const errors = [];
        let best = '';

        for (const provider of order) {
            for (let tryN = 0; tryN < 2; tryN++) {
                try {
                    let text = null;
                    if (provider === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
                        text = await callAnthropic({ system, user, maxTokens });
                    } else if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
                        text = await callGemini({
                            system,
                            user,
                            maxTokens: tryN === 0 ? maxTokens : Math.max(maxTokens, 800),
                        });
                    }
                    if (!text) continue;
                    text = text.trim();
                    if (text.length > best.length) best = text;
                    if (text.length >= minChars && !/^\(?Note\b/i.test(text)) {
                        return text;
                    }
                    console.warn(`[llm] ${provider} short/junk (${text.length} chars), retry…`);
                    await new Promise((r) => setTimeout(r, 600));
                } catch (err) {
                    console.warn(`[llm] ${provider} failed:`, err.message);
                    errors.push(`${provider}: ${err.message}`);
                    break;
                }
            }
        }
        if (best.length >= minChars) return best;
        throw new Error(`LLM yok/başarısız. ${errors.join(' | ') || `kısa cevap: ${best.slice(0, 40)}`}`);
    });
}
