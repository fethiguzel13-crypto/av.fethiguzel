/**
 * Yerel üretim RAG deposu (node:sqlite). Öğrenci sohbeti yok.
 */
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { blobToVec, cosine, vecToBlob } from './embed.mjs';

export const CORPORA = ['mevzuat', 'yargi', 'graph', 'overlay', 'doctrine'];

const DDL = `
CREATE TABLE IF NOT EXISTS rag_chunk (
  id TEXT PRIMARY KEY,
  corpus TEXT NOT NULL,
  kanun_id TEXT,
  madde_no TEXT,
  karar_id TEXT,
  course_code TEXT,
  kunye TEXT,
  text TEXT NOT NULL,
  source_uri TEXT NOT NULL,
  embedding BLOB NOT NULL
);
CREATE INDEX IF NOT EXISTS rag_chunk_corpus ON rag_chunk(corpus);
CREATE INDEX IF NOT EXISTS rag_chunk_madde ON rag_chunk(kanun_id, madde_no);
CREATE INDEX IF NOT EXISTS rag_chunk_karar ON rag_chunk(karar_id);
CREATE INDEX IF NOT EXISTS rag_chunk_course ON rag_chunk(course_code);
CREATE TABLE IF NOT EXISTS rag_atif (
  kanun_id TEXT NOT NULL,
  madde_no TEXT NOT NULL,
  karar_id TEXT NOT NULL,
  PRIMARY KEY (kanun_id, madde_no, karar_id)
);
CREATE INDEX IF NOT EXISTS rag_atif_madde ON rag_atif(kanun_id, madde_no);
CREATE TABLE IF NOT EXISTS rag_meta (
  k TEXT PRIMARY KEY,
  v TEXT NOT NULL
);
`;

export function openStore(dbPath) {
    mkdirSync(dirname(dbPath), { recursive: true });
    const db = new DatabaseSync(dbPath);
    db.exec(DDL);
    const upsertStmt = db.prepare(`
      INSERT INTO rag_chunk (id, corpus, kanun_id, madde_no, karar_id, course_code, kunye, text, source_uri, embedding)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        corpus=excluded.corpus, kanun_id=excluded.kanun_id, madde_no=excluded.madde_no,
        karar_id=excluded.karar_id, course_code=excluded.course_code, kunye=excluded.kunye,
        text=excluded.text, source_uri=excluded.source_uri, embedding=excluded.embedding
    `);
    const atifStmt = db.prepare(`
      INSERT INTO rag_atif (kanun_id, madde_no, karar_id) VALUES (?, ?, ?)
      ON CONFLICT DO NOTHING
    `);
    return {
        db,
        upsert(row) {
            upsertStmt.run(
                row.id,
                row.corpus,
                row.kanun_id || null,
                row.madde_no || null,
                row.karar_id || null,
                row.course_code || null,
                row.kunye || null,
                row.text,
                row.source_uri,
                vecToBlob(row.embedding),
            );
        },
        addAtif(kanunId, maddeNo, kararId) {
            atifStmt.run(String(kanunId), String(maddeNo), String(kararId));
        },
        setMeta(k, v) {
            db.prepare('INSERT INTO rag_meta(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v').run(k, String(v));
        },
        getMeta(k) {
            const r = db.prepare('SELECT v FROM rag_meta WHERE k=?').get(k);
            return r?.v ?? null;
        },
        count(corpus) {
            if (corpus) {
                return db.prepare('SELECT COUNT(*) AS n FROM rag_chunk WHERE corpus=?').get(corpus).n;
            }
            return db.prepare('SELECT COUNT(*) AS n FROM rag_chunk').get().n;
        },
        byMadde(kanunId, maddeNo) {
            return db
                .prepare('SELECT * FROM rag_chunk WHERE kanun_id=? AND madde_no=?')
                .all(String(kanunId), String(maddeNo))
                .map(rowFromDb);
        },
        byKarar(kararId) {
            const r = db.prepare('SELECT * FROM rag_chunk WHERE karar_id=? AND corpus=?').get(String(kararId), 'yargi');
            return r ? rowFromDb(r) : null;
        },
        atifIds(kanunId, maddeNo) {
            return db
                .prepare('SELECT karar_id FROM rag_atif WHERE kanun_id=? AND madde_no=?')
                .all(String(kanunId), String(maddeNo))
                .map((r) => r.karar_id);
        },
        hasKarar(kararId) {
            const r = db.prepare('SELECT 1 AS ok FROM rag_chunk WHERE karar_id=? AND corpus=? LIMIT 1').get(String(kararId), 'yargi');
            return Boolean(r);
        },
        vectorSearch(queryVec, { corpus, courseCode, k = 8, excludeId } = {}) {
            let sql = 'SELECT * FROM rag_chunk';
            const args = [];
            const where = [];
            if (corpus) {
                where.push('corpus=?');
                args.push(corpus);
            }
            if (courseCode) {
                where.push('(course_code IS NULL OR course_code=?)');
                args.push(courseCode);
            }
            if (where.length) sql += ` WHERE ${where.join(' AND ')}`;
            const rows = db.prepare(sql).all(...args);
            const scored = [];
            for (const raw of rows) {
                if (excludeId && raw.id === excludeId) continue;
                const vec = blobToVec(raw.embedding);
                scored.push({ ...rowFromDb(raw), score: cosine(queryVec, vec) });
            }
            scored.sort((a, b) => b.score - a.score);
            return scored.slice(0, k);
        },
        close() {
            db.close();
        },
    };
}

function rowFromDb(r) {
    return {
        id: r.id,
        corpus: r.corpus,
        kanun_id: r.kanun_id,
        madde_no: r.madde_no,
        karar_id: r.karar_id,
        course_code: r.course_code,
        kunye: r.kunye,
        text: r.text,
        source_uri: r.source_uri,
    };
}

export function defaultDbPath(root) {
    return join(root, 'data', 'ders-notlari', 'rag.sqlite');
}
