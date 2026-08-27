/**
 * Ders notu FSEK kapısı — kopya / spinning / uydurma künye.
 *
 * Kanun ve yargı kararı metni (FSEK m. 31) n-gram karşılaştırmasından düşülür.
 * Hoca slaytı, fotokopi not, izlence gövdesi düşülmez.
 */
import { fold } from '../content-quality.mjs';

export const NGRAM_N = 8;
export const LONG_PHRASE_N = 12;
/** Üretilen 8-gramların kaynak gövdesiyle kesişme tavanı (statute/case hariç). */
export const OVERLAP_MAX = 0.05;

const KUNYE_RE =
    /Yargıtay [^,()]{3,80}?,\s*E\.\s*\d{4}\/\d+,\s*K\.\s*\d{4}\/\d+,\s*T\.\s*\d{2}\.\d{2}\.\d{4}/g;

const FREE_KINDS = new Set(['statute', 'case', 'kanun', 'yargi']);

export function tokenize(text) {
    return fold(text)
        .split(/[^\p{L}\p{N}]+/u)
        .map((w) => w.trim())
        .filter((w) => w.length > 1);
}

export function ngrams(text, n = NGRAM_N) {
    const words = tokenize(text);
    const out = [];
    if (words.length < n) return out;
    for (let i = 0; i <= words.length - n; i += 1) {
        out.push(words.slice(i, i + n).join(' '));
    }
    return out;
}

export function overlapRatio(generated, source, n = NGRAM_N) {
    const a = ngrams(generated, n);
    const b = new Set(ngrams(source, n));
    if (!a.length || !b.size) return 0;
    let hit = 0;
    for (const g of a) if (b.has(g)) hit += 1;
    return hit / a.length;
}

export function longestCopiedPhrase(generated, source, n = LONG_PHRASE_N) {
    const src = new Set(ngrams(source, n));
    if (!src.size) return '';
    for (const g of ngrams(generated, n)) {
        if (src.has(g)) return g;
    }
    return '';
}

export function extractKunye(text) {
    return [...String(text || '').matchAll(KUNYE_RE)].map((m) => m[0].replace(/\s+/g, ' ').trim());
}

/**
 * @param {{ generated: string, sources?: { id?: string, kind?: string, text: string }[], allowedKunye?: string[] }} input
 */
export function auditFsek({ generated, sources = [], allowedKunye = [] } = {}) {
    const body = String(generated || '');
    if (!body.trim()) {
        return { ok: false, verdict: 'empty', reason: 'Üretim metni boş.', overlap: 0, copied: '', fakeKunye: [] };
    }

    const restricted = sources.filter((s) => !FREE_KINDS.has(String(s.kind || '').toLowerCase()));
    let maxOverlap = 0;
    let copied = '';
    for (const s of restricted) {
        const r = overlapRatio(body, s.text);
        if (r > maxOverlap) maxOverlap = r;
        if (!copied) copied = longestCopiedPhrase(body, s.text);
    }

    const allowed = new Set(allowedKunye.map((k) => k.replace(/\s+/g, ' ').trim()));
    const fakeKunye = extractKunye(body).filter((k) => allowed.size && !allowed.has(k));

    if (copied) {
        return {
            ok: false,
            verdict: 'copy',
            reason: `Kaynak gövdesinden ${LONG_PHRASE_N}+ kelimelik dizi kopyalandı.`,
            overlap: maxOverlap,
            copied,
            fakeKunye,
        };
    }
    if (maxOverlap > OVERLAP_MAX) {
        return {
            ok: false,
            verdict: 'spin',
            reason: `Kaynakla 8-gram örtüşmesi ${(maxOverlap * 100).toFixed(1)}% (tavan %${OVERLAP_MAX * 100}).`,
            overlap: maxOverlap,
            copied: '',
            fakeKunye,
        };
    }
    if (fakeKunye.length) {
        return {
            ok: false,
            verdict: 'fake-kunye',
            reason: 'Yerel arşivde olmayan künye üretildi.',
            overlap: maxOverlap,
            copied: '',
            fakeKunye,
        };
    }

    return { ok: true, verdict: 'ok', reason: '', overlap: maxOverlap, copied: '', fakeKunye: [] };
}
