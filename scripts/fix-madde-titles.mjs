/**
 * Align frontmatter title + maddeNo with filename madde-N.
 * Light-normalize double spaces in official body before commentary split.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'mevzuat');
let checked = 0;
let fixed = 0;
const samples = [];

function walk(dir) {
    for (const ent of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, ent.name);
        if (ent.isDirectory()) {
            walk(p);
            continue;
        }
        if (!ent.name.endsWith('.md') || !ent.name.startsWith('madde-')) continue;
        checked++;
        const n = parseInt(ent.name.replace(/^madde-|\.md$/g, ''), 10);
        if (!n) continue;

        let raw = readFileSync(p, 'utf8');
        const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
        if (!fmMatch) continue;

        let fm = fmMatch[1];
        let changed = false;

        const titleM = fm.match(/^title:\s*["']?(.+?)["']?\s*$/m);
        const title = titleM ? titleM[1] : '';
        const tn = title.match(/Madde\s*(\d+)/i);
        if (tn && parseInt(tn[1], 10) !== n) {
            const newTitle = title.replace(/Madde\s*\d+/i, `Madde ${n}`);
            fm = fm.replace(/^title:\s*.+$/m, `title: "${newTitle.replace(/"/g, '\\"')}"`);
            changed = true;
            if (samples.length < 12) samples.push({ file: p, from: title, to: newTitle });
        }

        const maddeM = fm.match(/^maddeNo:\s*(\d+)/m);
        if (maddeM && parseInt(maddeM[1], 10) !== n) {
            fm = fm.replace(/^maddeNo:\s*\d+/m, `maddeNo: ${n}`);
            changed = true;
        } else if (!maddeM) {
            fm = `maddeNo: ${n}\n` + fm;
            changed = true;
        }

        // Collapse accidental multi-spaces in official block only
        const split = raw.slice(fmMatch[0].length).split(/\n### (?:Bizim Yorumumuz|Akademik Yorum ve Analiz)\s*\n/);
        if (split[0]) {
            const cleaned = split[0].replace(/[ \t]{2,}/g, ' ');
            if (cleaned !== split[0]) {
                const rest = split.length > 1 ? '\n### Akademik Yorum ve Analiz\n' + split.slice(1).join('\n### Akademik Yorum ve Analiz\n') : '';
                raw = '---\n' + fm + '\n---\n' + cleaned + rest;
                changed = true;
                writeFileSync(p, raw);
                fixed++;
                continue;
            }
        }

        if (changed) {
            raw = raw.replace(fmMatch[0], `---\n${fm}\n---\n`);
            writeFileSync(p, raw);
            fixed++;
        }
    }
}

if (statSync(root).isDirectory()) walk(root);
console.log(JSON.stringify({ checked, fixed, samples }, null, 2));
