/**
 * LLM helper: Gemini preferred by default (Anthropic often out of credits).
 * Override: SOCIAL_LLM=anthropic|gemini
 */
import Anthropic from '@anthropic-ai/sdk';

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

async function callGemini({ system, user, maxTokens }) {
    const key = process.env.GEMINI_API_KEY;
    const models = [
        process.env.SOCIAL_GEMINI_MODEL || 'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
    ];
    let lastErr;
    for (const model of models) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: system }] },
                    contents: [{ role: 'user', parts: [{ text: user }] }],
                    generationConfig: { maxOutputTokens: maxTokens, temperature: 0.55 },
                }),
            });
            if (!res.ok) {
                const t = await res.text();
                lastErr = new Error(`Gemini ${model} HTTP ${res.status}: ${t.slice(0, 160)}`);
                continue;
            }
            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('').trim();
            if (text) return text;
            lastErr = new Error(`Gemini ${model} empty`);
        } catch (e) {
            lastErr = e;
        }
    }
    throw lastErr || new Error('Gemini failed');
}

export async function completeText({ system, user, maxTokens = 400 }) {
    const prefer = (process.env.SOCIAL_LLM || 'gemini').toLowerCase();
    const order = prefer === 'anthropic' ? ['anthropic', 'gemini'] : ['gemini', 'anthropic'];
    const errors = [];

    for (const provider of order) {
        try {
            if (provider === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
                return await callAnthropic({ system, user, maxTokens });
            }
            if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
                return await callGemini({ system, user, maxTokens });
            }
        } catch (err) {
            console.warn(`[llm] ${provider} failed:`, err.message);
            errors.push(`${provider}: ${err.message}`);
        }
    }
    throw new Error(`LLM yok/başarısız. ${errors.join(' | ')}`);
}
