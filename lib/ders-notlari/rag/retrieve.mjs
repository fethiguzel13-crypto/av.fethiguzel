/**
 * Yazar ajan seçicisi. Öğrenci sohbeti yok.
 *
 * Sıra: yapısal madde/künye → gömme. Künye yalnız depoda varsa döner;
 * yoksa içtihat yok — E./K./T. uydurulmaz.
 */
import { existsSync } from 'node:fs';
import { embed } from './embed.mjs';
import { defaultDbPath, openStore } from './store.mjs';

const KUNYE_RE = /Yargıtay [^,()]{3,80}?,\s*E\.\s*\d{4}\/\d+,\s*K\.\s*\d{4}\/\d+/;

export function isRealKunye(s) {
    return KUNYE_RE.test(String(s || ''));
}

export function tryOpen(root, dbPath) {
    const p = dbPath || defaultDbPath(root);
    if (!existsSync(p)) return null;
    try {
        return openStore(p);
    } catch {
        return null;
    }
}

function asHit(row, { score = 1, via }) {
    const kunye = isRealKunye(row.kunye) ? row.kunye : null;
    return {
        id: row.id,
        corpus: row.corpus,
        kanun_id: row.kanun_id,
        madde_no: row.madde_no,
        karar_id: row.karar_id,
        course_code: row.course_code,
        kunye,
        text: row.text,
        source_uri: row.source_uri,
        score,
        via,
        cite: kunye || null,
    };
}

export function retrieveStructural(store, q = {}) {
    if (!store) return { hits: [], ictihat: 'yok', reason: 'depo yok' };
    const seen = new Set();
    const hits = [];
    const push = (row, via, score) => {
        if (!row || seen.has(row.id)) return;
        seen.add(row.id);
        hits.push(asHit(row, { score, via }));
    };
    if (q.kanunId && q.maddeNo) {
        for (const kararId of store.atifIds(q.kanunId, q.maddeNo)) {
            const row = store.byKarar(kararId);
            if (!row || !isRealKunye(row.kunye)) continue;
            push(row, 'structural-atif', 1);
        }
        for (const row of store.byMadde(q.kanunId, q.maddeNo)) {
            push(row, 'structural-madde', 0.9);
        }
    }
    const sliced = hits.slice(0, q.k || 6);
    const cites = sliced.filter((h) => h.cite);
    return {
        hits: sliced,
        ictihat: cites.length ? 'var' : 'yok',
        cites,
        reason: cites.length ? 'yerel arşiv' : 'künye yok; uydurulmadı',
    };
}

/**
 * @param {object} store
 * @param {{ query?: string, kanunId?: string, maddeNo?: string, courseCode?: string, k?: number }} q
 */
export async function retrieve(store, q = {}) {
    const base = retrieveStructural(store, q);
    if (!store || !q.query) return base;
    const k = q.k || 6;
    const seen = new Set(base.hits.map((h) => h.id));
    const hits = [...base.hits];
    const vec = await embed(q.query);
    for (const row of store.vectorSearch(vec, { courseCode: q.courseCode, k: k + 8 })) {
        if (row.score < 0.12 || seen.has(row.id)) continue;
        seen.add(row.id);
        hits.push(asHit(row, { score: row.score, via: 'embed' }));
    }
    const sliced = hits.slice(0, k);
    const cites = sliced.filter((h) => h.cite);
    return {
        hits: sliced,
        ictihat: cites.length ? 'var' : 'yok',
        cites,
        reason: cites.length ? 'yerel arşiv' : 'künye yok; uydurulmadı',
    };
}

export function citeLine(result) {
    if (!result || result.ictihat !== 'var' || !result.cites?.length) {
        return 'Bu başlık için yerel arşivde künye yoktur; E./K./T. yazılmaz.';
    }
    const c = result.cites[0];
    const snippet = String(c.text || '').replace(/\s+/g, ' ').trim().slice(0, 280);
    return `Yerel arşiv künyesi: ${c.cite}. ${snippet}${snippet.length >= 280 ? '…' : ''} Künye depodan okundu, uydurulmadı.`;
}
