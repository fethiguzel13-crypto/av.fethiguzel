// generate-kanun-commentary-gemini.mjs
// Gemini API kullanarak kanun şerh üretimi
// Usage: node generate-kanun-commentary-gemini.mjs [kanunId] [startMadde] [endMadde]
//   e.g. node generate-kanun-commentary-gemini.mjs hmk
//        node generate-kanun-commentary-gemini.mjs all

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __dir = dirname(fileURLToPath(import.meta.url));
const CONTENT_BASE = join(__dir, 'content', 'mevzuat');
const TODAY = new Date().toISOString().slice(0, 10);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) { console.error('GEMINI_API_KEY env değişkeni gerekli'); process.exit(1); }
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const KANUN_META = {
  hmk:    { ad: 'Hukuk Muhakemeleri Kanunu',               alan: 'medeni-usul' },
  iik:    { ad: 'İcra ve İflas Kanunu',                    alan: 'icra-iflas' },
  cmk:    { ad: 'Ceza Muhakemesi Kanunu',                  alan: 'ceza-muhakemesi' },
  vuk:    { ad: 'Vergi Usul Kanunu',                       alan: 'vergi' },
  gvk:    { ad: 'Gelir Vergisi Kanunu',                    alan: 'vergi' },
  kvk:    { ad: 'Kurumlar Vergisi Kanunu',                 alan: 'vergi' },
  kdvk:   { ad: 'Katma Değer Vergisi Kanunu',              alan: 'vergi' },
  aatuhk: { ad: 'Amme Alacaklarının Tahsil Usulü Hakkında Kanun', alan: 'vergi' },
  dmk:    { ad: 'Devlet Memurları Kanunu',                 alan: 'idare' },
  kmk:    { ad: 'Kaçakçılıkla Mücadele Kanunu',            alan: 'kaçakçılık' },
};

const ALAN_YAZARLAR = {
  'medeni-usul': 'Kuru, Pekcanıtez/Atalay/Özekes, Ejder Yılmaz, Sungurtekin Özkan, Budak/Karaaslan',
  'icra-iflas':  'Kuru, Pekcanıtez/Atalay/Sungurtekin Özkan, Ejder Yılmaz, Talih Uyar',
  'ceza-muhakemesi': 'Öztürk/Tezcan/Erdem/Sancakdar, Centel/Zafer, Yenisey/Nuhoğlu, Yurtcan, Ünver/Hakeri',
  'vergi':       'Öncel/Kumrulu/Çağan, Selim Kaneti, Başaran Yavaşlar, Yaltı Soydan, Tosuner/Demir, Erginay',
  'idare':       'Günday, İl Han Özay, Turgut Tan, Yıldızhan Yayla, Gözübüyük/Tan',
  'kaçakçılık':  'Özbek/Kanbur/Doğan/Bacaksız/Tepe, Hakeri, Koca/Üzülmez',
};

function getPrompt(kanunId, maddeId, title, articleText) {
  const meta = KANUN_META[kanunId];
  const yazarlar = ALAN_YAZARLAR[meta.alan];
  return `Sen Av. Fethi Güzel'sin. ${meta.ad} alanında uzman Türk hukukçusun.

Şerh şu 7 bölümden oluşur:
### Akademik Yorum ve Analiz
#### 1. Maddenin Sistematiği ve Genel Açıklama
#### 2. Maddedeki Kavramların Analizi
#### 3. Sistematik İlişkiler
#### 4. Uygulama: Yargı İçtihadı
#### 5. Pratik Örnek Olaylar
#### 6. Pratik Uygulama Notları
#### 7. Eleştirel Değerlendirme
---
### Metodolojik Not

ZORUNLU KURALLAR:
- Yargıtay/Danıştay/AYM kararı UYDURMA. Gerçek karar yoksa: "Bu maddeye ilişkin son dönemde emsal karar tespit edilemedi." yaz.
- Sadece şu yazarlardan atıf yap: ${yazarlar}
- Sayfa numarası, baskı yılı YAZMA
- Pratik olaylar "(kurmaca senaryo)" ibaresiyle işaretle
- Akademik Türkçe, net cümleler

---
Aşağıdaki madde için eksiksiz akademik şerh yaz. ### Akademik Yorum ve Analiz başlığıyla başlat.

${meta.ad} Madde ${maddeId} — ${title || ''}
${articleText}`;
}

function parseFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const body = content.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
  const titleMatch = body.match(/^\*\*(.+?)\*\*/);
  const title = titleMatch ? titleMatch[1] : '';
  const articleText = body
    .replace(/^\*\*.+?\*\*\n\n---\n\n/, '')
    .replace(/\n\n### Bizim Yorumumuz[\s\S]*$/, '')
    .trim();
  return { title, articleText };
}

function buildNewFile(kanunId, maddeNo, title, articleText, commentary) {
  const meta = KANUN_META[kanunId];
  const wordCount = commentary.split(/\s+/).length;
  const fm = [
    '---',
    `title: "${meta.ad} Madde ${maddeNo}"`,
    `kanun: "${meta.ad}"`,
    `maddeNo: ${parseInt(maddeNo, 10) || 0}`,
    `commentaryStatus: "completed"`,
    `lastReviewed: "${TODAY}"`,
    `wordCount: ${wordCount}`,
    '---',
  ].join('\n');
  const titleBlock = title ? `**${title}**\n\n---\n\n` : '';
  return `${fm}\n\n${titleBlock}${articleText}\n\n${commentary}\n`;
}

async function askGemini(prompt) {
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  if (!text || text.length < 150) throw new Error('yanıt kısa');
  return text;
}

async function processArticle(kanunId, maddeId) {
  const filePath = join(CONTENT_BASE, kanunId, `madde-${maddeId}.md`);
  if (!existsSync(filePath)) return false;

  const existing = readFileSync(filePath, 'utf-8');
  if (existing.includes('commentaryStatus: "completed"')) return false;

  const { title, articleText } = parseFile(filePath);
  if (!articleText || articleText.length < 10) {
    console.log(`[skip] ${kanunId}/madde-${maddeId}: no text`);
    return false;
  }

  const meta = KANUN_META[kanunId];
  console.log(`[process] ${kanunId.toUpperCase()} Madde ${maddeId}: ${title || '(başlıksız)'}`);

  const prompt = getPrompt(kanunId, maddeId, title, articleText);

  try {
    const commentary = await askGemini(prompt);
    const newContent = buildNewFile(kanunId, maddeId, title, articleText, commentary);
    writeFileSync(filePath, newContent, 'utf-8');
    console.log(`[wrote] ${kanunId}/madde-${maddeId} (${commentary.split(/\s+/).length} words)`);
    execSync(`git add content/mevzuat/${kanunId}/madde-${maddeId}.md`, { cwd: __dir });
    execSync(`git commit -m "content(${kanunId}-${maddeId}): akademik serh tamamlandi"`, { cwd: __dir });
    console.log(`[commit] ${kanunId}-${maddeId}`);
    return true;
  } catch (err) {
    console.error(`[error] ${kanunId}/madde-${maddeId}: ${err.message}`);
    // Rate limit koruması
    if (err.message.includes('429') || err.message.includes('quota') || err.message.includes('rate')) {
      console.log('[wait] Rate limit, 30 saniye bekleniyor...');
      await new Promise(r => setTimeout(r, 30000));
    } else {
      await new Promise(r => setTimeout(r, 3000));
    }
    return false;
  }
}

function getMaddeler(kanunId, startNo, endNo) {
  const dir = join(CONTENT_BASE, kanunId);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.startsWith('madde-') && f.endsWith('.md'))
    .map(f => f.replace('madde-', '').replace('.md', ''))
    .filter(id => {
      const n = parseInt(id, 10);
      return n >= startNo && n <= endNo;
    })
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
}

async function processKanun(kanunId, startNo = 1, endNo = 9999) {
  const maddeler = getMaddeler(kanunId, startNo, endNo);
  console.log(`\n[kanun] ${kanunId.toUpperCase()} — ${maddeler.length} madde aralığında`);
  let processed = 0, skipped = 0;

  for (const maddeId of maddeler) {
    const ok = await processArticle(kanunId, maddeId);
    if (ok) {
      processed++;
      await new Promise(r => setTimeout(r, 2000));
    } else {
      skipped++;
    }
  }

  try {
    execSync('git push origin main', { cwd: __dir });
    console.log(`[push] ${kanunId} done`);
  } catch (e) {
    console.error(`[push error] ${e.message}`);
  }

  console.log(`${kanunId}: ${processed} işlendi, ${skipped} atlandı`);
  return processed;
}

async function main() {
  const arg1 = process.argv[2] || 'all';
  const startNo = parseInt(process.argv[3] || '1', 10);
  const endNo = parseInt(process.argv[4] || '9999', 10);

  const ALL_KANUNLAR = Object.keys(KANUN_META);
  const targets = arg1 === 'all' ? ALL_KANUNLAR : [arg1];

  console.log(`Gemini kanun şerh üretimi — ${targets.join(', ')} (${startNo}-${endNo})`);

  for (const kanunId of targets) {
    if (!KANUN_META[kanunId]) { console.error(`Bilinmeyen kanun: ${kanunId}`); continue; }
    await processKanun(kanunId, startNo, endNo);
  }

  console.log('\nTüm işlemler tamamlandı.');
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
