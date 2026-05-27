// generate-tck.js — TCK madde parser → content/mevzuat/tck/
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const INPUT  = 'C:\\Users\\HUAWEI\\Desktop\\internet\\tck.txt';
const OUTPUT = join(__dir, 'content', 'mevzuat', 'tck');

const HEADER_RE = /^(BİRİNCİ|İKİNCİ|ÜÇÜNCÜ|DÖRDÜNCÜ|BEŞİNCİ|ALTINCI|YEDİNCİ|SEKİZİNCİ|DOKUZUNCU|ONUNCU|KİTAP|KISIM|BÖLÜM|TÜRK CEZA)/i;
const MADDE_RE  = /^Madde\s+(\d+)-/;

const raw = readFileSync(INPUT, 'utf-8');
const lines = raw.split('\n').map(l => l.replace(/\r$/, ''));

// --- Pass 1: locate every Madde line and its title ---
// maddePositions[i] = { lineIndex, maddeNo, titleLine }
const maddePositions = [];
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].trim().match(MADDE_RE);
  if (!m) continue;
  const maddeNo = parseInt(m[1], 10);
  // title = last non-empty, non-header line strictly before this line
  let titleLine = '';
  for (let j = i - 1; j >= Math.max(0, i - 6); j--) {
    const t = lines[j].trim();
    if (!t) continue;
    if (HEADER_RE.test(t) || MADDE_RE.test(t) || /^\d+$/.test(t)) break;
    titleLine = t;
    break;
  }
  maddePositions.push({ lineIndex: i, maddeNo, titleLine });
}

console.log(`Found ${maddePositions.length} articles`);

// --- Pass 2: extract body for each article ---
// Body = lines from Madde header up to (but not including) the title line of the next article
const articles = [];
for (let idx = 0; idx < maddePositions.length; idx++) {
  const { lineIndex, maddeNo, titleLine } = maddePositions[idx];
  const nextPos = maddePositions[idx + 1];

  let endLine;
  if (!nextPos) {
    endLine = lines.length;
  } else {
    // Stop before the title line of the next article
    endLine = nextPos.lineIndex;
    if (nextPos.titleLine) {
      // Find the actual line index of the title
      for (let j = nextPos.lineIndex - 1; j >= lineIndex + 1; j--) {
        if (lines[j].trim() === nextPos.titleLine) {
          endLine = j;
          break;
        }
      }
    }
  }

  const bodyLines = lines.slice(lineIndex, endLine);
  // Remove trailing empty lines
  while (bodyLines.length && !bodyLines[bodyLines.length - 1].trim()) bodyLines.pop();
  // Remove footnote-only lines (lines that are just a number)
  const cleanBody = bodyLines
    .filter(l => !/^\s*\d+\s*$/.test(l))
    .join('\n')
    .trim();

  articles.push({ maddeNo, title: titleLine, body: cleanBody });
}

// --- Write markdown files ---
if (!existsSync(OUTPUT)) mkdirSync(OUTPUT, { recursive: true });

for (const { maddeNo, title, body } of articles) {
  const frontmatter = [
    '---',
    `title: "TCK Madde ${maddeNo}"`,
    `kanun: "Türk Ceza Kanunu"`,
    `maddeNo: ${maddeNo}`,
    `commentaryStatus: "pending"`,
    '---',
  ].join('\n');

  const titleBlock = title ? `**${title}**\n\n---\n\n` : '';
  const content = `${frontmatter}\n\n${titleBlock}${body}\n`;
  writeFileSync(join(OUTPUT, `madde-${maddeNo}.md`), content, 'utf-8');
}

console.log(`Written ${articles.length} files to ${OUTPUT}`);
