#!/usr/bin/env node
/**
 * Yazar ajan RAG deposunu doldurur. Öğrenci sohbeti yok.
 *
 *   node scripts/rag-ingest.mjs
 *   node scripts/rag-ingest.mjs --yargi=cited
 *   node scripts/rag-ingest.mjs --db path.sqlite
 *
 * Mevzuat: yalnız grafların statuteRefs maddeleri (FSEK m. 31 resmi lafız).
 * Yargı: atıf indeksindeki ve yerelde dosyası olan kararlar (künye + kısa gövde).
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import { embed, hashEmbed } from '../lib/ders-notlari/rag/embed.mjs';
import { defaultDbPath, openStore } from '../lib/ders-notlari/rag/store.mjs';
import { isRealKunye } from '../lib/ders-notlari/rag/retrieve.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const dbPath = args.find((a) => a.startsWith('--db='))?.slice(5) || defaultDbPath(ROOT);
const yargiMode = args.find((a) => a.startsWith('--yargi='))?.slice(7) || 'cited';
const limitArg = args.find((a) => a.startsWith('--limit='));
const yargiLimit = limitArg ? Number(limitArg.slice(8)) : 0;
const hashOnly = args.includes('--hash') || process.env.RAG_EMBED !== 'gemini';

function clip(s, n) {
    const t = String(s || '').replace(/\s+/g, ' ').trim();
    if (t.length <= n) return t;
    const cut = t.slice(0, n);
    const sp = cut.lastIndexOf(' ');
    return (sp > 40 ? cut.slice(0, sp) : cut).trim();
}

function officialOf(kanunId, maddeNo) {
    const p = join(ROOT, 'content', 'mevzuat', kanunId, `madde-${maddeNo}.md`);
    if (!existsSync(p)) return '';
    const raw = readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
    const body = raw.replace(/^---[\s\S]*?---\n/, '');
    const parts = body.split(/\n### (?:Akademik Yorum ve Analiz|Bizim Yorumumuz)\s*\n/);
    return clip(
        (parts[0] || '')
            .replace(/^\*\*[\s\S]*?\*\*\s*\n+---\s*\n+/, '')
            .replace(/\n---\s*$/, ''),
        1800,
    );
}

function loadJson(p) {
    return JSON.parse(readFileSync(p, 'utf8'));
}

function decisionIndex() {
    const map = new Map();
    const root = join(ROOT, 'data/yargi-kararlari/decisions');
    if (!existsSync(root)) return map;
    for (const year of readdirSync(root)) {
        const dir = join(root, year);
        if (!statSync(dir).isDirectory()) continue;
        for (const f of readdirSync(dir)) {
            if (!f.endsWith('.json')) continue;
            map.set(f.replace(/\.json$/, ''), join(dir, f));
        }
    }
    return map;
}

async function embedText(text) {
    if (hashOnly) return hashEmbed(text);
    return embed(text);
}

async function main() {
    const store = openStore(dbPath);
    let n = 0;
    const bump = () => {
        n += 1;
        if (n % 200 === 0) console.log(`[ingest] ${n}`);
    };

    const graphsDir = join(ROOT, 'lib/ders-notlari/graphs');
    const maddeSet = new Map();
    for (const f of readdirSync(graphsDir).filter((x) => x.endsWith('.json'))) {
        const g = loadJson(join(graphsDir, f));
        const course = g.courseCode;
        for (const inst of g.institutions || []) {
            const text = [
                inst.title,
                inst.definition,
                (inst.elements || []).join('; '),
                (inst.organicLinks || []).join(' '),
                (inst.doctrineSplit || []).join(' '),
            ].join('\n');
            store.upsert({
                id: `graph:${course}:${inst.id}`,
                corpus: 'graph',
                kanun_id: inst.statuteRefs?.[0]?.kanunId || g.kanunId || null,
                madde_no: inst.statuteRefs?.[0]?.maddeNo || null,
                karar_id: null,
                course_code: course,
                kunye: null,
                text: clip(text, 2000),
                source_uri: `graph://${course}/${inst.id}`,
                embedding: await embedText(text),
            });
            bump();
            for (const ref of inst.statuteRefs || []) {
                maddeSet.set(`${ref.kanunId}/${ref.maddeNo}`, ref);
            }
        }
    }

    const ovDir = join(ROOT, 'lib/ders-notlari/overlays');
    for (const f of readdirSync(ovDir).filter((x) => x.endsWith('.json'))) {
        const o = loadJson(join(ovDir, f));
        const text = [
            o.campus,
            o.cityHook,
            o.mehaz,
            (o.schoolNotes || []).join(' '),
            (o.examBox?.tips || []).join(' '),
            (o.syllabusOrder || []).join(', '),
        ].join('\n');
        store.upsert({
            id: `overlay:${o.uniSlug}`,
            corpus: 'overlay',
            kanun_id: null,
            madde_no: null,
            karar_id: null,
            course_code: null,
            kunye: null,
            text: clip(text, 1600),
            source_uri: (o.sources || [])[0]?.url || `overlay://${o.uniSlug}`,
            embedding: await embedText(text),
        });
        bump();
    }

    for (const ref of maddeSet.values()) {
        const official = officialOf(ref.kanunId, ref.maddeNo);
        if (official.length < 40) continue;
        store.upsert({
            id: `mevzuat:${ref.kanunId}/${ref.maddeNo}`,
            corpus: 'mevzuat',
            kanun_id: ref.kanunId,
            madde_no: String(ref.maddeNo),
            karar_id: null,
            course_code: null,
            kunye: null,
            text: official,
            source_uri: `mevzuat://${ref.kanunId}/madde-${ref.maddeNo}`,
            embedding: await embedText(official),
        });
        bump();
    }

    const doctrineDirs = [
        join(ROOT, 'lib/ders-notlari/rag/doctrine'),
        join(process.env.USERPROFILE || '', '.claude/skills/kanun-maddesi-yorumla/references'),
    ];
    for (const dir of doctrineDirs) {
        if (!existsSync(dir)) continue;
        for (const f of readdirSync(dir).filter((x) => /^doctrine-.+\.md$/.test(x))) {
            const raw = readFileSync(join(dir, f), 'utf8');
            const names = [...raw.matchAll(/^- (.+)$/gm)].map((m) => m[1]).filter((s) => !/ASLA|Sayfa|Baskı/i.test(s));
            if (!names.length) continue;
            const kanunHint = f.replace(/^doctrine-/, '').replace(/\.md$/, '');
            const text = `Atıf yapılabilir öğreti (${kanunHint}): ${names.join(' · ')}. Sayfa ve baskı yılı yazılmaz.`;
            store.upsert({
                id: `doctrine:${f}`,
                corpus: 'doctrine',
                kanun_id: kanunHint === 'tbk' || kanunHint === 'tmk' || kanunHint === 'ttk' || kanunHint === 'tck' ? kanunHint : null,
                madde_no: null,
                karar_id: null,
                course_code: null,
                kunye: null,
                text: clip(text, 2000),
                source_uri: `doctrine://${f}`,
                embedding: await embedText(text),
            });
            bump();
        }
        break;
    }

    const atifPath = join(ROOT, 'mobile/data-src/mevzuat/atif.json.gz');
    if (existsSync(atifPath) && yargiMode !== 'none') {
        const atif = JSON.parse(gunzipSync(readFileSync(atifPath)).toString('utf8'));
        const files = decisionIndex();
        let yargiN = 0;
        for (const [key, rec] of Object.entries(atif)) {
            const slash = key.indexOf('/');
            if (slash < 0) continue;
            const kanunId = key.slice(0, slash);
            const maddeNo = key.slice(slash + 1);
            const ids = rec?.ids || [];
            for (const id of ids) {
                store.addAtif(kanunId, maddeNo, id);
                if (yargiMode === 'atif-only') continue;
                if (yargiLimit && yargiN >= yargiLimit) continue;
                if (store.hasKarar(id)) continue;
                const p = files.get(String(id));
                if (!p) continue;
                let doc;
                try {
                    doc = loadJson(p);
                } catch {
                    continue;
                }
                if (!doc.kunye || !isRealKunye(doc.kunye) || !doc.text) continue;
                const body = clip(String(doc.text).replace(/\s+/g, ' '), 1400);
                store.upsert({
                    id: `yargi:${id}`,
                    corpus: 'yargi',
                    kanun_id: kanunId,
                    madde_no: String(maddeNo),
                    karar_id: String(id),
                    course_code: null,
                    kunye: doc.kunye,
                    text: `${doc.kunye}. ${body}`,
                    source_uri: doc.documentUrl || `yargi://${id}`,
                    embedding: await embedText(`${doc.kunye} ${body}`),
                });
                yargiN += 1;
                bump();
            }
        }
        console.log(`[ingest] yargi chunks=${yargiN} filesIndexed=${files.size}`);
    }

    store.setMeta('ingestedAt', new Date().toISOString());
    store.setMeta('embed', hashOnly ? 'hash' : process.env.RAG_EMBED || 'hash');
    console.log(
        JSON.stringify(
            {
                db: dbPath,
                total: store.count(),
                mevzuat: store.count('mevzuat'),
                graph: store.count('graph'),
                overlay: store.count('overlay'),
                yargi: store.count('yargi'),
                doctrine: store.count('doctrine'),
            },
            null,
            2,
        ),
    );
    store.close();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
