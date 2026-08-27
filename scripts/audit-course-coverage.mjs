#!/usr/bin/env node
/**
 * Coverage YAML vs graf vs üretilmiş not.
 *   node scripts/audit-course-coverage.mjs borclar-genel ankara
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const course = process.argv[2] || 'borclar-genel';
const uni = process.argv[3] || 'ankara';

const yaml = readFileSync(join(ROOT, 'docs/ders-notlari/coverage', `${course}.yaml`), 'utf8');
const ids = [...yaml.matchAll(/^\s+-\s+id:\s+([a-z0-9çğıöşü-]+)/gmi)].map((m) => m[1]);
const graph = JSON.parse(readFileSync(join(ROOT, 'lib/ders-notlari/graphs', `${course}.json`), 'utf8'));
const gIds = new Set(graph.institutions.map((i) => i.id));

const missingInGraph = ids.filter((id) => !gIds.has(id));
const notePath = join(ROOT, 'lib/ders-notlari/generated/notes', `${uni}__${course}-yillik.json`);
let missingInNote = [];
if (existsSync(notePath)) {
    const note = JSON.parse(readFileSync(notePath, 'utf8'));
    const tIds = new Set((note.topics || []).map((t) => t.id));
    missingInNote = ids.filter((id) => !tIds.has(id));
} else {
    missingInNote = ids;
}

const report = { course, uni, missingInGraph, missingInNote, ok: !missingInGraph.length && !missingInNote.length };
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exitCode = 1;
