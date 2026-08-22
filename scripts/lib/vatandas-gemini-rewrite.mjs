/**
 * Vatandaş rehberi — Gemini anlatı yeniden yazımı.
 *
 * Kalıp iskelet (60 saniyede omurga, yasal dayanak, SEO atölyesi) yok.
 * Resmî madde metni varsa ona dayanır; yoksa süre/madde uydurmaz.
 */
import { gunzipSync } from 'node:zlib';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { auditGuide } from '../../lib/content-quality.mjs';

export const BANNED_HEADING =
    /60\s*saniye|omurga|yasal dayanak|arama niyeti|pratik karşılaştırma|zaman çizelgesi|kanun maddesi,\s*şerh|i[cç] link|canonical|niyet ipuc|\bpillar\b|\bspoke\b|\bseo\b|yamyam|hub[–-]spoke|kimler muhataptır\? şartlar|somut kontrol listesi|mini senaryo|workshop/i;

export const BANNED_BODY =
    /60\s*saniyede omurga|arama motoru|niyet ipuc|yamyam|hub[–-]spoke|canonical url|ranking sinyal|slug ve niyet|pillar hem spoke|bu rehber bağlayıcı değildir|üç şey: doğru merci/i;

const STOP = new Set([
    'nasil',
    'nedir',
    'alinir',
    'yapilir',
    'edilir',
    'olur',
    'icin',
    'ile',
    'veya',
    've',
    'bir',
    'bu',
    'mi',
    'mu',
    'ne',
    'hangi',
    'kim',
    'dava',
    'rehber',
]);

export const CAT_PACKS = {
    İş: ['is-kanunu', 'is-kanunu-1475', 'ssgssk', 'arabuluculuk', 'isg', 'sendikalar'],
    İcra: ['iik', 'tebligat', 'cek'],
    Kira: ['tbk', 'arabuluculuk'],
    Aile: ['tmk', 'aile-koruma', 'cck'],
    Miras: ['tmk'],
    Eşya: ['tmk', 'katmulkiyeti'],
    Tüketici: ['tkhk', 'tbk'],
    Usul: ['hmk', 'tebligat', 'arabuluculuk'],
    İdare: ['imar', 'kamulastirma', 'belediye', 'dmk', 'il-idaresi'],
    Trafik: ['ktk'],
    Vergi: ['vuk', 'aatuhk', 'gvk', 'kdvk', 'otv'],
    'Sosyal Güvenlik': ['ssgssk'],
    Ceza: ['tck', 'cmk'],
    Nüfus: ['nhk'],
    'Engelli Hakları': ['otv', 'ssgssk'],
    Borçlar: ['tbk'],
    Yabancılar: ['yukk'],
    'Kişisel Veri': ['kvkk'],
    Sigorta: ['ktk', 'tbk'],
    Ticaret: ['ttk', 'cek', 'spk'],
    Sağlık: ['ssgssk'],
    Eğitim: [],
    Mevzuat: ['hmk', 'tbk', 'tmk'],
    İmar: ['imar', 'belediye', 'katmulkiyeti', 'kamulastirma'],
};

const packCache = new Map();

export function foldTr(s) {
    return String(s || '')
        .toLocaleLowerCase('tr-TR')
        .replace(/ı/g, 'i')
        .replace(/ş/g, 's')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c');
}

export function loadDotenv(root) {
    for (const name of ['.env.local', '.env']) {
        const p = join(root, name);
        if (!existsSync(p)) continue;
        for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
            const t = line.trim();
            if (!t || t.startsWith('#')) continue;
            const i = t.indexOf('=');
            if (i < 1) continue;
            const k = t.slice(0, i).trim();
            let v = t.slice(i + 1).trim();
            if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
                v = v.slice(1, -1);
            }
            if (!process.env[k]) process.env[k] = v;
        }
    }
}

export function loadPack(root, kanunId) {
    if (packCache.has(kanunId)) return packCache.get(kanunId);
    const dir = existsSync(join(root, 'content-packs'))
        ? join(root, 'content-packs')
        : join(root, 'public', 'content-packs');
    const p = join(dir, `${kanunId}.json.gz`);
    let pack = null;
    if (existsSync(p)) {
        try {
            pack = JSON.parse(gunzipSync(readFileSync(p)));
        } catch {
            pack = null;
        }
    }
    packCache.set(kanunId, pack);
    return pack;
}

function cleanOfficial(md) {
    return String(md || '')
        .replace(/\r/g, '')
        .replace(/^\*\*(.+?)\*\*\s*\n+---\s*\n+/, '$1\n\n')
        .replace(/\*\*/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function tokensFrom(article) {
    const raw = `${article.slug} ${article.h1} ${(article.keywords || []).join(' ')}`;
    return foldTr(raw)
        .split(/[^a-z0-9]+/)
        .filter((t) => t.length >= 4 && !STOP.has(t));
}

function maddeFromHref(href) {
    const m = /^\/mevzuat\/([a-z0-9-]+)\/(madde-[\w]+)$/i.exec(href || '');
    return m ? { kanunId: m[1], key: m[2] } : null;
}

function packFromHref(href) {
    const m = /^\/(?:mevzuat|kategori)\/([a-z0-9-]+)/i.exec(href || '');
    return m ? m[1] : null;
}

function takeArticle(pack, kanunId, key) {
    const art = pack?.[key];
    if (!art) return null;
    const official = cleanOfficial(art.official).slice(0, 2200);
    if (!official) return null;
    return {
        kanunId,
        key,
        maddeNo: art.maddeNo ?? key.replace(/^madde-/, ''),
        title: art.title || '',
        official,
    };
}

function searchPack(pack, kanunId, tokens, limit) {
    if (!pack) return [];
    const scored = [];
    for (const [key, art] of Object.entries(pack)) {
        const hay = foldTr(`${art.title || ''} ${art.official || ''}`);
        let s = 0;
        for (const t of tokens) {
            if (hay.includes(t)) s += t.length >= 6 ? 2 : 1;
        }
        if (s >= 2) scored.push({ s, key, art });
    }
    scored.sort((a, b) => b.s - a.s);
    const out = [];
    for (const row of scored.slice(0, limit)) {
        const item = takeArticle(pack, kanunId, row.key);
        if (item) out.push(item);
    }
    return out;
}

/**
 * Rehbere bağlanacak resmî madde metinleri.
 * Önce links'teki somut maddeler, sonra kategori paketlerinde başlık araması.
 */
export function collectSources(root, article, extra = {}) {
    const found = [];
    const seen = new Set();
    const add = (item) => {
        if (!item) return;
        const id = `${item.kanunId}/${item.key}`;
        if (seen.has(id)) return;
        seen.add(id);
        found.push(item);
    };

    for (const l of article.links || []) {
        const ref = maddeFromHref(l.href);
        if (!ref) continue;
        add(takeArticle(loadPack(root, ref.kanunId), ref.kanunId, ref.key));
    }

    const tokens = tokensFrom(article);
    const packs = new Set(CAT_PACKS[article.category] || []);
    for (const l of article.links || []) {
        const id = packFromHref(l.href);
        if (id) packs.add(id);
    }
    const perPack = found.length >= 3 ? 1 : 3;
    for (const kanunId of packs) {
        if (found.length >= 8) break;
        for (const item of searchPack(loadPack(root, kanunId), kanunId, tokens, perPack)) {
            add(item);
            if (found.length >= 8) break;
        }
    }

    return {
        articles: found,
        authoredText: extra.authoredText || '',
        skeleton: extra.skeleton || null,
    };
}

export function formatKaynak(sources) {
    const parts = [];
    if (sources.authoredText) {
        parts.push('### DOĞRULANMIŞ METİN (elle yazılmış, hukuki iddia kaynağı)\n' + sources.authoredText);
    }
    if (sources.articles.length) {
        parts.push(
            '### RESMÎ MADDE METİNLERİ\n' +
            sources.articles
                .map(
                    (a) =>
                        `#### ${a.kanunId.toUpperCase()} m.${a.maddeNo} — ${a.title}\n${a.official}`
                )
                .join('\n\n')
        );
    }
    if (sources.skeleton) {
        const sk = sources.skeleton;
        parts.push(
            '### İSKELET NOTLAR (ipucu, resmî metinle çelişirse resmî metin üstündür)\n' +
            JSON.stringify(
                {
                    steps: sk.steps,
                    docs: sk.docs,
                    notes: sk.notes,
                },
                null,
                2
            )
        );
    }
    return parts.join('\n\n').slice(0, 14000);
}

export const SYSTEM_PROMPT = `Sen Av. Fethi Güzel'in vatandaş rehberini yazıyorsun. Okur hukukçu değil; telaşlı bir insan. Görevin konuyu güzel, sade ve somut anlatmak.

YASAK:
- "60 saniyede omurga", "yasal dayanak", "arama niyeti", "pratik karşılaştırma", "örnek zaman çizelgesi", "kanun maddesi, şerh", "SEO", pillar/spoke, "yamyam", atölye iç konuşması.
- Art arda 4-8 kelimelik kuru cümle dizisi.
- Parantez içinde yabancı karşılık.
- Yargıtay/Danıştay/AYM künyesi uydurmak. Karar yoksa karar yazma.
- Kaynakta olmayan madde numarası, gün sayısı, oran, tavan, harç, parasal sınır.
- "Bu rehber bağlayıcı değildir", "üç şey: merci · süre · belge" kalıpları.
- Kelime doldurmak. Uzun olsun diye tekrar etme.

ÜSLUP:
- Anlatı: sahne kur, sonra kuralı söyle. "İşten çıktınız. Asıl soru ne kadar çalıştığınız değil, sözleşmenin nasıl bittiğidir."
- Hitap: siz.
- Önemli bir süre, şart veya yasağı **çift yıldız** içine al — paragrafta en fazla iki vurgu.
- Başlıklar insan cümlesi olsun: "Ne zaman hak doğar?", "Süreyi kaçırınca ne olur?", "Yanınızda ne dursun?"
- 4–7 bölüm. Her bölüm 2–4 paragraf. Toplam kabaca 550–900 kelime; daha fazlası istenmez.

ÇIKTI: Yalnız JSON. Şema:
{
  "lead": "2-3 cümlelik kısa cevap",
  "keyInsight": "tek cümle, asıl tuzak veya kilit şart",
  "sections": [{"heading":"...","paragraphs":["..."],"bullets":["..."]}],
  "steps": ["somut emir kipi adım", "..."],
  "documents": ["belge", "..."],
  "faq": [{"q":"...","a":"..."}]
}

steps 4-6, documents 3-6, faq 3-5, sections 4-7. bullets isteğe bağlı, kısa.`;

export function buildUserPrompt({ article, kaynak, isAuthored }) {
    const lock = isAuthored
        ? 'DOĞRULANMIŞ METİN hukuki iddiaların kilididir. Üslubu değiştir; madde, süre, oran, merci ekleme veya değiştirme. Sadece anlatımı güzelleştir ve **vurgu** ekle.'
        : kaynak.includes('RESMÎ MADDE')
            ? 'Yalnız resmî madde metnindeki sayı, süre ve şartları kullan. Metinde yoksa "kanun X gün der" yazma; süreci anlat.'
            : 'Resmî madde metni yok. Madde numarası, gün sayısı, oran YAZMA. e-Devlet/başvuru adımlarını genel anlat; uydurma kanun cümlesi kurma.';

    return `Konu: ${article.h1}
Kategori: ${article.category}
Slug: ${article.slug}
Anahtarlar: ${(article.keywords || []).slice(0, 6).join(', ')}

${lock}

${kaynak || '(Kaynak yok — genel süreç anlat.)'}

JSON üret. Başka bir şey yazma.`;
}

export function extractJson(text) {
    const raw = String(text || '').trim();
    const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    const body = fence ? fence[1] : raw;
    const start = body.indexOf('{');
    const end = body.lastIndexOf('}');
    if (start < 0 || end <= start) throw new Error('JSON yok');
    let json = body.slice(start, end + 1);
    json = json.replace(/,(\s*[}\]])/g, '$1');
    try {
        return JSON.parse(json);
    } catch (e) {
        throw new Error(`JSON ayrıştırılamadı: ${e.message}`);
    }
}

function wordCount(s) {
    return String(s || '')
        .split(/\s+/)
        .filter(Boolean).length;
}

export function draftText(d) {
    return [
        d.lead,
        d.keyInsight,
        ...(d.sections || []).flatMap((s) => [s.heading, ...(s.paragraphs || []), ...(s.bullets || [])]),
        ...(d.steps || []),
        ...(d.documents || []),
        ...(d.faq || []).flatMap((f) => [f.q, f.a]),
    ]
        .filter(Boolean)
        .join('\n');
}

function citedMaddes(text) {
    const out = new Set();
    const re = /\bm+\.?\s*(\d{1,4})\b/gi;
    let m;
    while ((m = re.exec(text))) out.add(m[1]);
    return [...out];
}

function kaynakMaddes(kaynak) {
    const out = new Set();
    const re = /m\.(\d{1,4})|madde-(\d{1,4})/gi;
    let m;
    while ((m = re.exec(kaynak))) out.add(m[1] || m[2]);
    return out;
}

export function validateDraft(draft, { kaynak = '', requireSourceMaddes = false } = {}) {
    const errors = [];
    if (!draft || typeof draft !== 'object') return ['nesne değil'];
    if (wordCount(draft.lead) < 12) errors.push('lead kısa');
    if (!Array.isArray(draft.sections) || draft.sections.length < 4) errors.push('en az 4 bölüm');
    if (!Array.isArray(draft.steps) || draft.steps.length < 4) errors.push('en az 4 adım');
    if (!Array.isArray(draft.documents) || draft.documents.length < 3) errors.push('en az 3 belge');
    if (!Array.isArray(draft.faq) || draft.faq.length < 3) errors.push('en az 3 soru');

    for (const s of draft.sections || []) {
        if (BANNED_HEADING.test(s.heading || '')) errors.push(`yasak başlık: ${s.heading}`);
        if (!Array.isArray(s.paragraphs) || s.paragraphs.length < 1) errors.push(`boş bölüm: ${s.heading}`);
    }

    const blob = draftText(draft);
    if (BANNED_BODY.test(blob) || BANNED_HEADING.test(blob)) errors.push('yasak kalıp metin');
    if (wordCount(blob) < 220) errors.push('çok kısa');
    if (wordCount(blob) > 1400) errors.push('çok uzun / dolgu');
    if (/Yargıtay|Danıştay|AYM|HGK/i.test(blob) && /\bE\.\s*\d{4}\s*\//i.test(blob)) {
        errors.push('uydurma karar künyesi riski');
    }

    const hasOfficial = /RESMÎ MADDE/.test(kaynak);
    if (hasOfficial && requireSourceMaddes) {
        const allowed = kaynakMaddes(kaynak);
        const extra = citedMaddes(blob).filter((n) => !allowed.has(n));
        // küçük sayılar (1, 2, 3) madde olmayabilir; 10+ şüpheli
        const suspicious = extra.filter((n) => Number(n) >= 10);
        if (suspicious.length > 2) errors.push(`kaynakta olmayan madde: ${suspicious.slice(0, 6).join(', ')}`);
    }

    const fakeArticle = auditGuide({
        lead: draft.lead,
        sections: draft.sections,
        faq: draft.faq,
    });
    if (!fakeArticle.publishable && fakeArticle.verdict === 'template') {
        errors.push(`kalite kapısı: ${fakeArticle.reason}`);
    }

    return errors;
}

export function assembleArticle(base, draft, { today }) {
    const sections = (draft.sections || []).map((s) => ({
        heading: String(s.heading || '').replace(/\*\*/g, '').trim(),
        paragraphs: (s.paragraphs || []).map((p) => String(p).trim()).filter(Boolean),
        bullets: (s.bullets || []).map((b) => String(b).trim()).filter(Boolean),
    }));

    return {
        slug: base.slug,
        title: base.title,
        description: base.description,
        h1: base.h1,
        keywords: base.keywords || [],
        category: base.category,
        related: base.related || [],
        links: base.links || [],
        lead: String(draft.lead || '').trim(),
        keyInsight: String(draft.keyInsight || '').trim(),
        sections,
        steps: (draft.steps || []).map((x) => String(x).trim()).filter(Boolean).slice(0, 7),
        documents: (draft.documents || []).map((x) => String(x).trim()).filter(Boolean).slice(0, 8),
        faq: (draft.faq || [])
            .map((f) => ({ q: String(f.q || '').trim(), a: String(f.a || '').trim() }))
            .filter((f) => f.q && f.a)
            .slice(0, 6),
        updated: today,
        role: base.role,
        pillar: base.pillar,
        angle: base.angle,
        canonicalPath: base.canonicalPath,
        sitemapPriority: base.sitemapPriority,
        voice: 'narrative',
        source: 'gemini',
    };
}

function isThinkingModel(model) {
    return false;
}

const skipUntil = new Map();
let lastGoodModel = process.env.SERH_GEMINI_MODEL || process.env.VATANDAS_GEMINI_MODEL || '';

export async function callGeminiJson({ system, user, maxTokens = 8192, waitOnQuota = true }) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY yok');
    const models = [
        lastGoodModel,
        process.env.SERH_GEMINI_MODEL,
        process.env.VATANDAS_GEMINI_MODEL,
        'gemini-3.1-flash-lite',
        'gemini-2.5-flash-lite',
        'gemini-flash-lite-latest',
        'gemini-2.5-flash',
        'gemini-flash-latest',
        'gemini-3.5-flash-lite',
        'gemini-3.5-flash',
        'gemini-3.6-flash',
    ].filter(Boolean);
    const seen = new Set();
    const list = models.filter((m) => (seen.has(m) ? false : (seen.add(m), true)));

    let lastErr;
    for (let wave = 0; wave < 2; wave += 1) {
        for (const model of list) {
            if (Date.now() < (skipUntil.get(model) || 0)) continue;
            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
                    const generationConfig = {
                        maxOutputTokens: isThinkingModel(model) ? Math.max(maxTokens, 4096) : maxTokens,
                        temperature: 0.62,
                    };
                    if (attempt === 0) generationConfig.responseMimeType = 'application/json';
                    if (isThinkingModel(model)) generationConfig.thinkingConfig = { thinkingBudget: 0 };

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
                        const err = new Error(`Gemini ${model} HTTP ${res.status}: ${t.slice(0, 240)}`);
                        err.status = res.status;
                        throw err;
                    }
                    const data = await res.json();
                    const cand = data?.candidates?.[0];
                    const text = cand?.content?.parts?.map((p) => p.text).filter(Boolean).join('').trim();
                    if (!text) {
                        throw new Error(`Gemini ${model} empty (${cand?.finishReason || 'empty'})`);
                    }
                    lastGoodModel = model;
                    return extractJson(text);
                } catch (e) {
                    lastErr = e;
                    const msg = String(e.message || e);
                    if (e.status === 404) {
                        skipUntil.set(model, Date.now() + 36e5);
                        break;
                    }
                    if (e.status === 429) {
                        skipUntil.set(model, Date.now() + 9e4);
                        console.warn(`[gemini] 429 ${model} — soğutma, sonraki model`);
                        break;
                    }
                    if (e.status === 400 && attempt === 0) continue;
                    if (/fetch failed|ECONNRESET|UND_ERR|network|socket/i.test(msg)) {
                        await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
                        continue;
                    }
                    if (/JSON yok|JSON ayrıştır|empty/i.test(msg) && attempt < 2) {
                        await new Promise((r) => setTimeout(r, 600));
                        continue;
                    }
                    console.warn(`[gemini] ${model} deneme ${attempt + 1} kesildi: ${msg.slice(0, 160)}`);
                    break;
                }
            }
        }
        const waits = [...skipUntil.values()].filter((t) => t > Date.now());
        if (!waitOnQuota || !waits.length) break;
        const wait = Math.min(Math.min(...waits) - Date.now() + 2000, 180000);
        console.warn(`[gemini] tüm modeller soğuk, ${Math.round(wait / 1000)}s (dalga ${wave + 1})`);
        await new Promise((r) => setTimeout(r, wait));
    }
    throw lastErr || new Error('Gemini başarısız');
}

export function readSkeleton(root, slug) {
    const allPath = join(root, 'lib', 'vatandas-rehberi', 'guides', 'all.json');
    if (!existsSync(allPath)) return null;
    try {
        const all = JSON.parse(readFileSync(allPath, 'utf8'));
        return all[slug] || null;
    } catch {
        return null;
    }
}

export function listRewrittenSlugs(root) {
    const dir = join(root, 'lib', 'vatandas-rehberi', 'rewritten');
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
        .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
        .map((f) => f.replace(/\.json$/, ''));
}
