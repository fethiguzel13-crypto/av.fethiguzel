/**
 * 768-boyut gömme. Varsayılan: belirleyici sözcük karması (çevrimdışı, test).
 * GEMINI_API_KEY + RAG_EMBED=gemini → text-embedding-004 (üretim makinesi).
 */
export const EMBED_DIM = 768;

function fnv1a(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i += 1) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    return h >>> 0;
}

function tokens(text) {
    return String(text || '')
        .toLocaleLowerCase('tr-TR')
        .replace(/[^\p{L}\p{N}]+/gu, ' ')
        .split(/\s+/)
        .filter((t) => t.length > 1);
}

export function hashEmbed(text) {
    const vec = new Float32Array(EMBED_DIM);
    const toks = tokens(text);
    if (!toks.length) return vec;
    for (const t of toks) {
        const a = fnv1a(t) % EMBED_DIM;
        const b = fnv1a(`#${t}`) % EMBED_DIM;
        vec[a] += 1;
        vec[b] += 0.5;
    }
    let n = 0;
    for (let i = 0; i < EMBED_DIM; i += 1) n += vec[i] * vec[i];
    n = Math.sqrt(n) || 1;
    for (let i = 0; i < EMBED_DIM; i += 1) vec[i] /= n;
    return vec;
}

export function cosine(a, b) {
    if (!a || !b || a.length !== b.length) return 0;
    let dot = 0;
    let na = 0;
    let nb = 0;
    for (let i = 0; i < a.length; i += 1) {
        dot += a[i] * b[i];
        na += a[i] * a[i];
        nb += b[i] * b[i];
    }
    return dot / ((Math.sqrt(na) * Math.sqrt(nb)) || 1);
}

export function vecToBlob(vec) {
    return Buffer.from(vec.buffer, vec.byteOffset, vec.byteLength);
}

export function blobToVec(blob) {
    const u8 = blob instanceof Uint8Array ? blob : new Uint8Array(blob);
    const copy = u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);
    return new Float32Array(copy);
}

async function geminiEmbedOnce(text) {
    const key = process.env.GEMINI_API_KEY;
    const model = process.env.RAG_EMBED_MODEL || 'text-embedding-004';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${key}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: `models/${model}`,
            content: { parts: [{ text: String(text || '').slice(0, 8000) }] },
        }),
    });
    if (!res.ok) throw new Error(`embed HTTP ${res.status}: ${(await res.text()).slice(0, 180)}`);
    const data = await res.json();
    const values = data?.embedding?.values;
    if (!Array.isArray(values) || values.length < 64) throw new Error('embed empty');
    const vec = new Float32Array(EMBED_DIM);
    const n = Math.min(values.length, EMBED_DIM);
    for (let i = 0; i < n; i += 1) vec[i] = values[i];
    return vec;
}

export async function embed(text) {
    const mode = String(process.env.RAG_EMBED || 'hash').toLowerCase();
    if (mode === 'gemini' && process.env.GEMINI_API_KEY) {
        try {
            return await geminiEmbedOnce(text);
        } catch (err) {
            console.warn(`[rag] gemini embed düştü, hash: ${err.message}`);
        }
    }
    return hashEmbed(text);
}
