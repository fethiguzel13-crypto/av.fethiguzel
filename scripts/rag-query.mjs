#!/usr/bin/env node
/**
 * Yazar ajan sorgusu — öğrenci sohbeti değil.
 *   node scripts/rag-query.mjs --madde tbk/1
 *   node scripts/rag-query.mjs --q "icap kabul" --course borclar-genel
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tryOpen, retrieve, citeLine } from '../lib/ders-notlari/rag/retrieve.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const q = args.find((a) => a.startsWith('--q='))?.slice(4) || '';
const madde = args.find((a) => a.startsWith('--madde='))?.slice(8);
const course = args.find((a) => a.startsWith('--course='))?.slice(9);
const k = Number(args.find((a) => a.startsWith('--k='))?.slice(4) || 6);
const dbPath = args.find((a) => a.startsWith('--db='))?.slice(5);

const store = tryOpen(ROOT, dbPath);
if (!store) {
    console.error('depo yok — önce: node scripts/rag-ingest.mjs');
    process.exit(1);
}
let kanunId;
let maddeNo;
if (madde) {
    const i = madde.indexOf('/');
    kanunId = i >= 0 ? madde.slice(0, i) : madde;
    maddeNo = i >= 0 ? madde.slice(i + 1) : undefined;
}
const result = await retrieve(store, { query: q, kanunId, maddeNo, courseCode: course, k });
store.close();
console.log(citeLine(result));
console.log(JSON.stringify(result.hits.map((h) => ({
    corpus: h.corpus,
    via: h.via,
    score: Number(h.score.toFixed(3)),
    kunye: h.cite,
    madde: h.kanun_id && h.madde_no ? `${h.kanun_id}/${h.madde_no}` : null,
    text: h.text.slice(0, 180),
})), null, 2));
