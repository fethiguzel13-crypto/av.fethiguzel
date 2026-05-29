// generate-tck-commentary-nlm.mjs
// NotebookLM üzerinden TCK şerh üretimi (Anthropic API yerine)
// Usage: node generate-tck-commentary-nlm.mjs [startMadde] [endMadde]

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync, spawnSync } from 'node:child_process';

const __dir = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dir, 'content', 'mevzuat', 'tck');
const TODAY = new Date().toISOString().slice(0, 10);
const NLM_NOTEBOOK = '22d9340f-2fd4-4d1d-9b08-a45bf50bdc9d';

const startMadde = parseInt(process.argv[2] || '69', 10);
const endMadde   = parseInt(process.argv[3] || '345', 10);

const SYSTEM_PROMPT = `Sen Av. Fethi Güzel'sin. Türk Ceza Hukuku uzmanı bir avukat ve akademisyensin.
5237 sayılı Türk Ceza Kanunu maddelerini akademik kalitede şerh ediyorsun.

ZORUNLU KURALLAR:
- Yargıtay kararı UYDURMA. Gerçek karar yoksa: "Bu maddeye doğrudan ilişkin son dönemde Yargıtay kararı tespit edilemedi." yaz.
- Sadece şu yazarlardan atıf yap: Özbek/Kanbur/Doğan/Bacaksız/Tepe, Koca/Üzülmez, Özgenç, Centel/Zafer/Çakmut, Demirbaş, Hakeri, Toroslu/Toroslu, Hafızoğulları/Özen
- Sayfa numarası, baskı yılı YAZMA
- Pratik olaylar "(kurmaca senaryo)" ibaresiyle işaretle
- Akademik Türkçe, net cümleler

Şerh şu 7 bölümden oluşur:
### Akademik Yorum ve Analiz

#### 1. Maddenin Sistematiği ve Genel Açıklama
#### 2. Maddedeki Kavramların Analizi
#### 3. Sistematik İlişkiler
#### 4. Uygulama: Yargıtay İçtihadı
#### 5. Pratik Örnek Olaylar
#### 6. Pratik Uygulama Notları
#### 7. Eleştirel Değerlendirme

---

### Metodolojik Not`;

function parseFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  const body = content.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
  const titleMatch = body.match(/^\*\*(.+?)\*\*/);
  const title = titleMatch ? titleMatch[1] : '';
  const articleText = body.replace(/^\*\*.+?\*\*\n\n---\n\n/, '').trim();
  return { title, articleText };
}

function buildNewFile(maddeNo, title, articleText, commentary) {
  const wordCount = commentary.split(/\s+/).length;
  const fm = [
    '---',
    `title: "TCK Madde ${maddeNo}"`,
    `kanun: "Türk Ceza Kanunu"`,
    `maddeNo: ${maddeNo}`,
    `commentaryStatus: "completed"`,
    `lastReviewed: "${TODAY}"`,
    `wordCount: ${wordCount}`,
    '---',
  ].join('\n');
  const titleBlock = title ? `**${title}**\n\n---\n\n` : '';
  return `${fm}\n\n${titleBlock}${articleText}\n\n${commentary}\n`;
}

function askNotebookLM(prompt) {
  // Use spawnSync to pass prompt as a single argument — avoids shell quoting issues
  const result = spawnSync('notebooklm', ['ask', prompt, '--notebook', NLM_NOTEBOOK], {
    cwd: __dir,
    timeout: 120000,
    maxBuffer: 1024 * 1024 * 5,
    encoding: 'utf-8'
  });

  if (result.error) throw new Error(`spawn error: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`exit ${result.status}: ${result.stderr?.slice(0, 200)}`);

  const output = result.stdout || '';
  // Strip CLI metadata lines
  const lines = output.split('\n');
  const answerStart = lines.findIndex(l => l.trim() === 'Answer:');
  const resumedIdx = lines.findLastIndex(l => l.startsWith('Resumed conversation:') || l.startsWith('New conversation:'));
  const contentLines = lines.slice(
    answerStart >= 0 ? answerStart + 1 : 0,
    resumedIdx > 0 ? resumedIdx : undefined
  );
  return contentLines.join('\n').trim();
}

async function processArticle(maddeNo) {
  const filePath = join(CONTENT_DIR, `madde-${maddeNo}.md`);
  if (!existsSync(filePath)) {
    console.log(`[skip] madde-${maddeNo}.md not found`);
    return false;
  }

  const existing = readFileSync(filePath, 'utf-8');
  if (existing.includes('commentaryStatus: "completed"')) {
    console.log(`[skip] madde-${maddeNo} already completed`);
    return false;
  }

  const { title, articleText } = parseFile(filePath);
  if (!articleText || articleText.length < 10) {
    console.log(`[skip] madde-${maddeNo} no article text`);
    return false;
  }

  console.log(`[process] TCK Madde ${maddeNo}: ${title || '(başlıksız)'}`);

  const prompt = `${SYSTEM_PROMPT}

---
Aşağıdaki TCK maddesi için eksiksiz akademik şerh yaz. Şerhi doğrudan ### Akademik Yorum ve Analiz başlığıyla başlat.

TCK Madde ${maddeNo} — ${title || ''}
${articleText}`;

  try {
    const commentary = askNotebookLM(prompt);

    if (!commentary || commentary.length < 200) {
      console.error(`[error] madde-${maddeNo}: yanıt çok kısa (${commentary?.length || 0} karakter)`);
      return false;
    }

    const newContent = buildNewFile(maddeNo, title, articleText, commentary);
    writeFileSync(filePath, newContent, 'utf-8');
    console.log(`[wrote] madde-${maddeNo} (${commentary.split(/\s+/).length} words)`);

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
  console.log(`TCK şerh üretimi (NotebookLM) — Madde ${startMadde}-${endMadde}`);
  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = startMadde; i <= endMadde; i++) {
    const ok = await processArticle(i);
    if (ok) {
      processed++;
      // Small delay between articles
      await new Promise(r => setTimeout(r, 3000));
    } else {
      skipped++;
    }
  }

  // Push all at the end
  try {
    execSync('git push origin main', { cwd: __dir });
    console.log('[push] done');
  } catch (e) {
    console.error(`[push error] ${e.message}`);
  }

  console.log(`\nTamamlandı: ${processed} işlendi, ${skipped} atlandı`);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
