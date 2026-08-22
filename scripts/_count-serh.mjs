import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import { auditCommentary } from '../lib/content-quality.mjs';

const root = 'content/mevzuat';
const kanunlar = readdirSync(root).filter((d) => {
    const p = join(root, d);
    return existsSync(p) && statSync(p).isDirectory();
});

let tot = 0;
let empty = 0;
let template = 0;
let ok = 0;
let thin = 0;
const byKanun = [];
const pending = [];

function serhOf(s) {
    for (const b of ['### Akademik Yorum', '### Bizim Yorumumuz', '### Akademik Şerh']) {
        const i = s.indexOf(b);
        if (i >= 0) return s.slice(i);
    }
    return '';
}

for (const k of kanunlar.sort()) {
    const files = readdirSync(join(root, k)).filter((f) => /^madde-\d+\.md$/.test(f));
    let ke = 0;
    let kt = 0;
    let ko = 0;
    let kn = 0;
    for (const f of files) {
        tot += 1;
        const s = readFileSync(join(root, k, f), 'utf8');
        const serh = serhOf(s);
        const r = auditCommentary(k, serh);
        const yer = /yak[ıi]nda eklenecek|hen[üu]z yaz/i.test(serh);
        if (!serh.trim() || yer || r.verdict === 'empty') {
            empty += 1;
            ke += 1;
            pending.push(`${k}/${f.replace('.md', '')}`);
            continue;
        }
        if (r.verdict === 'template' || !r.publishable) {
            template += 1;
            kt += 1;
            pending.push(`${k}/${f.replace('.md', '')}`);
            continue;
        }
        if (serh.split(/\s+/).length < 400) {
            thin += 1;
            kn += 1;
            pending.push(`${k}/${f.replace('.md', '')}`);
            continue;
        }
        ok += 1;
        ko += 1;
    }
    byKanun.push({ k, n: files.length, ok: ko, empty: ke, template: kt, thin: kn, bad: ke + kt + kn });
}

byKanun.sort((a, b) => b.bad - a.bad);
console.log(JSON.stringify({ tot, ok, empty, template, thin, pending: pending.length }, null, 2));
console.log('--- kanun ---');
for (const x of byKanun) {
    if (x.bad === 0) continue;
    console.log(`${x.k}\tn=${x.n}\tok=${x.ok}\tempty=${x.empty}\ttemplate=${x.template}\tthin=${x.thin}`);
}
console.log('--- pending sample ---');
console.log(pending.slice(0, 30).join('\n'));
