// generate-tck-commentary.mjs
// Batch TCK commentary generator — runs overnight, writes + commits each article
// Usage: node generate-tck-commentary.mjs [startMadde] [endMadde]
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dir = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dir, 'content', 'mevzuat', 'tck');
const TODAY = new Date().toISOString().slice(0, 10);

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const startMadde = parseInt(process.argv[2] || '1', 10);
const endMadde   = parseInt(process.argv[3] || '75', 10);

const SYSTEM = `Sen Av. Fethi Güzel'sin. Türk Ceza Hukuku alanında uzman bir avukatsın.
5237 sayılı Türk Ceza Kanunu'nun maddelerini akademik kalitede, derinlikli şekilde yorumluyorsun.

Ürettiğin her şerh şu bölümleri içerir:
1. Maddenin Sistematiği ve Genel Açıklama
2. Maddedeki Kavramların Analizi
3. Sistematik İlişkiler
4. Uygulama: Yargıtay İçtihadı
5. Pratik Örnek Olaylar
6. Pratik Uygulama Notları
7. Eleştirel Değerlendirme

ZORUNLU KURALLAR:
- Yargıtay kararı uydurma. Gerçek karar yoksa: "Bu maddeye doğrudan ilişkin son 24 ayda Yargıtay kararı çekilemedi."
- Sadece şu yazarlardan atıf yap: Özbek/Kanbur/Doğan/Bacaksız/Tepe, Koca/Üzülmez, Özgenç, Centel/Zafer/Çakmut, Demirbaş, Hakeri, Toroslu/Toroslu, Hafızoğulları/Özen
- Sayfa numarası, baskı yılı yazma
- Pratik olaylar "(kurmaca senaryo)" ibaresiyle işaretle
- Çapraz referanslarda madde numarası doğru olmalı
- Akademik Türkçe, net cümleler
- Hedef: 300-600 satır markdown`;

async function generateCommentary(maddeNo, articleText, title) {
  const prompt = `TCK Madde ${maddeNo} için akademik şerh yaz.

Madde başlığı: ${title || '(başlıksız)'}

Madde metni:
${articleText}

Şerhi doğrudan ### Akademik Yorum ve Analiz başlığıyla başlat. Başka bir giriş ekleme.`;

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: SYSTEM,
    messages: [{ role: 'user', content: prompt }]
  });

  return msg.content?.[0]?.text?.trim() || '';
}

function parseFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  // Extract frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  const body = content.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
  // Extract title from body (bold line)
  const titleMatch = body.match(/^\*\*(.+?)\*\*/);
  const title = titleMatch ? titleMatch[1] : '';
  // Extract article text (after the bold title + divider)
  const articleText = body.replace(/^\*\*.+?\*\*\n\n---\n\n/, '').trim();
  return { frontmatter: fmMatch ? fmMatch[0] : '', title, articleText, body };
}

function buildNewFile(maddeNo, title, articleText, commentary) {
  const keywords = extractKeywords(title, articleText);
  const wordCount = commentary.split(/\s+/).length;

  const fm = [
    '---',
    `title: "TCK Madde ${maddeNo}"`,
    `kanun: "Türk Ceza Kanunu"`,
    `maddeNo: ${maddeNo}`,
    `commentaryStatus: "completed"`,
    `lastReviewed: "${TODAY}"`,
    `wordCount: ${wordCount}`,
    'keywords:',
    ...keywords.map(k => `  - "${k}"`),
    '---',
  ].join('\n');

  const titleBlock = title ? `**${title}**\n\n---\n\n` : '';

  return `${fm}\n\n${titleBlock}${articleText}\n\n${commentary}\n`;
}

function extractKeywords(title, text) {
  // Simple keyword extraction from title and first sentence
  const words = (title + ' ' + text.slice(0, 200))
    .toLowerCase()
    .replace(/[^a-zçğıöşüa-z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 4 && !['için', 'veya', 'olan', 'ile', 'bir', 'bu', 'her', 'olan', 'eder', 'hakkında'].includes(w));
  const unique = [...new Set(words)].slice(0, 5);
  return unique.length ? unique : ['ceza hukuku', 'türk ceza kanunu'];
}

async function processArticle(maddeNo) {
  const filePath = join(CONTENT_DIR, `madde-${maddeNo}.md`);
  if (!existsSync(filePath)) {
    console.log(`[skip] madde-${maddeNo}.md not found`);
    return false;
  }

  // Check if already completed
  const existing = readFileSync(filePath, 'utf-8');
  if (existing.includes('commentaryStatus: "completed"')) {
    console.log(`[skip] madde-${maddeNo} already completed`);
    return false;
  }

  const { title, articleText } = parseFile(filePath);
  if (!articleText || articleText.length < 20) {
    console.log(`[skip] madde-${maddeNo} has no meaningful article text`);
    return false;
  }

  console.log(`[process] TCK Madde ${maddeNo}: ${title || '(başlıksız)'}`);

  try {
    const commentary = await generateCommentary(maddeNo, articleText, title);
    if (!commentary || commentary.length < 200) {
      console.error(`[error] madde-${maddeNo}: commentary too short, skipping`);
      return false;
    }

    const newContent = buildNewFile(maddeNo, title, articleText, commentary);
    writeFileSync(filePath, newContent, 'utf-8');
    console.log(`[wrote] madde-${maddeNo} (${commentary.split(/\s+/).length} words)`);

    // Commit
    execSync(`git add content/mevzuat/tck/madde-${maddeNo}.md`, { cwd: __dir });
    execSync(`git commit -m "content(tck-${maddeNo}): akademik serh tamamlandi"`, { cwd: __dir });
    console.log(`[commit] tck-${maddeNo}`);

    return true;
  } catch (err) {
    console.error(`[error] madde-${maddeNo}: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log(`TCK şerh üretimi — Madde ${startMadde}-${endMadde}`);
  let processed = 0;
  let skipped = 0;

  for (let i = startMadde; i <= endMadde; i++) {
    const ok = await processArticle(i);
    if (ok) processed++;
    else skipped++;
    // Small delay to avoid rate limits
    if (ok) await new Promise(r => setTimeout(r, 2000));
  }

  // Push all at once at the end
  try {
    execSync('git push origin main', { cwd: __dir });
    console.log(`[push] done`);
  } catch (e) {
    console.error(`[push error] ${e.message}`);
  }

  console.log(`\nTamamlandı: ${processed} işlendi, ${skipped} atlandı`);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
