// generate-ttk-commentary.mjs
// Batch TTK commentary generator — runs in background, writes + commits each article
// Usage: node generate-ttk-commentary.mjs [limit]
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dir = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dir, 'content', 'mevzuat', 'ttk');
const TODAY = new Date().toISOString().slice(0, 10);

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const limit = parseInt(process.argv[2] || '1000', 10); // Default to process up to 1000 files

const SYSTEM = `Sen Av. Fethi Güzel'sin. Türk Ticaret Hukuku alanında uzman, dünya çapında kıdemli bir akademisyen ve avukatsın.
6102 sayılı Türk Ticaret Kanunu'nun maddelerini profesör düzeyinde akademik kalitede ve derinlikli şekilde şerh ediyorsun.

Ürettiğin her şerh şu bölümleri içermek zorundadır:
### Akademik Yorum ve Analiz

#### 1. Maddenin Sistematiği ve Genel Açıklama
- Maddenin kanun içindeki konumu (Kitap/Kısım/Bölüm/Ayrım)
- Düzenleme amacı (ratio legis) ve korunan hukuki yarar
- Tarihsel arka plan (varsa eski 6762 sayılı TTK karşılığı) ve kaynak kanun (İsviçre veya Alman hukuku paralellikleri)

#### 2. Maddedeki Kavramların Analizi
- Madde metnindeki her kilit kavram için ayrı alt-başlık (örn. ##### 2.1., ##### 2.2.) açarak derinlemesine tanım, hukuki nitelik ve sınırlar.

#### 3. Sistematik İlişkiler
- Maddenin birlikte okunması gereken diğer kanun hükümleriyle (TBK, TMK, TTK'nın diğer maddeleri veya İİK, MÖHUK vb.) ilişkisi ve atıflar.

#### 4. Uygulama: Yargıtay İçtihadı
- Yargıtay 11. Hukuk Dairesi, 12. Hukuk Dairesi veya Hukuk Genel Kurulu kararlarına atıflar.
- Emsal karar veya içtihat yoksa veya araştırılmadıysa şu kalıbı kullan: "Bu maddeye doğrudan ilişkin son 24 ayda Yargıtay/AYM kararı çekilemedi. Kullanıcı tarafından sağlanan ek karar yok."

#### 5. Pratik Örnek Olaylar
- Madde hükmünün uygulamasını gösteren en az 2 detaylı somut kurmaca olay senaryosu.
- Olay başlıklarını mutlaka "**Olay 1 (Kurmaca Senaryo):**" ve "**Olay 2 (Kurmaca Senaryo):**" şeklinde yaz. Altına "*Hukuki Analiz:*" ile çözümü ekle.

#### 6. Pratik Uygulama Notları
- İspat yükü, süreler, zamanaşımı, görevli ve yetkili mahkeme ve uygulamada sık yapılan hatalar.

#### 7. Eleştirel Değerlendirme
- Doktrindeki tartışmalar, aksayan yönler, reform önerileri ve modern ticari gereksinimler (özellikle lisanslı depoculuk, ELÜS, dijitalleşme ve e-ticaret entegrasyonu gibi alanlarda).

---
### Metodolojik Not
- Yazar olarak Av. Fethi Güzel'in imzası, akademik dürüstlük bildirimi, kullanılan kaynaklar ve güncellik tarihi (27.05.2026).

ZORUNLU VE KATİ KURALLAR:
1. Yargıtay kararı uydurma. Künye formatı (Daire/Esas/Karar/Tarih) birebir gerçek olmalı, uydurulmamalıdır. Karar yoksa yukarıdaki kalıp metni yaz.
2. Sadece şu yazarlardan/eserlerden atıf yap:
   - Sabih Arkan, *Ticari İşletme Hukuku*, *Şirketler Hukuku Genel Esasları*, *Kıymetli Evrak Hukuku — Çek*
   - Hüseyin Ülgen / Mehmet Helvacı / Arslan Kaya / Necla Akdağ Güney, *Ticari İşletme Hukuku*
   - Reha Poroy / Hamdi Yasaman, *Ticari İşletme Hukuku*
   - Reha Poroy / Ünal Tekinalp / Ersin Çamoğlu, *Ortaklıklar Hukuku*
   - Hasan Pulaşlı, *Şirketler Hukuku*
   - Mehmet Bahtiyar, *Ortaklıklar Hukuku*
   - Fırat Öztan, *Kıymetli Evrak Hukuku*
   - Abuzer Kendigelen, *Kıymetli Evrak Hukuku*, *Ticari İşletme Hukuku*
   - Samim Ünan, *Türk Sigorta Hukuku*
   - Mertol Can, *Sigorta Hukuku Dersleri*
3. ASLA sayfa numarası veya baskı yılı yazma! (Örn: "Arkan, s. 245" veya "Kendigelen, 2024" YASAKTIR).
4. Pratik örnek olayları mutlaka "(Kurmaca Senaryo)" ibaresiyle işaretle.
5. Akademik, resmi, duru ve elit bir Türkçe kullan.
6. Şerhin tamamının uzunluğu 350-700 satır arasında derinlikli olmalıdır. Sığ içerik üretme.`;

async function generateCommentary(maddeNo, articleText, title) {
  const prompt = `Türk Ticaret Kanunu (TTK) Madde ${maddeNo} için akademik şerh yaz.

Madde başlığı: ${title || '(başlıksız)'}

Madde metni:
${articleText}

Şerhi doğrudan "### Akademik Yorum ve Analiz" başlığıyla başlat. Başka hiçbir giriş, açıklama veya selamlama cümlesi ekleme.`;

  const msg = await client.messages.create({
    model: 'claude-3-5-sonnet-latest',
    max_tokens: 4000,
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
    `title: "TTK Madde ${maddeNo}"`,
    `kanun: "Türk Ticaret Kanunu"`,
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
  const words = (title + ' ' + text.slice(0, 200))
    .toLowerCase()
    .replace(/[^a-zçğıöşü\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 4 && !['için', 'veya', 'olan', 'ile', 'bir', 'bu', 'her', 'olan', 'eder', 'hakkında', 'şekilde'].includes(w));
  const unique = [...new Set(words)].slice(0, 5);
  return unique.length ? unique : ['ticaret kanunu', 'türk ticaret kanunu'];
}

async function processArticle(fileName) {
  const filePath = join(CONTENT_DIR, fileName);
  const existing = readFileSync(filePath, 'utf-8');
  
  // Extract maddeNo from filename
  const match = fileName.match(/madde-(\d+)\.md/);
  if (!match) return false;
  const maddeNo = parseInt(match[1], 10);
  
  // Check if already completed
  const splitRegex = /\n### (?:Bizim Yorumumuz|Akademik Yorum ve Analiz)\s*\n/;
  const parts = existing.split(splitRegex);
  let commentaryText = parts.length > 1 ? parts[1].trim() : "";
  if (commentaryText === "Bu maddeye ait akademik yorum ve analiz yakında eklenecektir.") {
    commentaryText = "";
  }
  
  if (commentaryText !== "") {
    console.log(`[skip] ${fileName} already completed`);
    return false;
  }

  const { title, articleText } = parseFile(filePath);
  if (!articleText || articleText.length < 20) {
    console.log(`[skip] ${fileName} has no meaningful article text`);
    return false;
  }

  console.log(`[process] TTK Madde ${maddeNo}: ${title || '(başlıksız)'}`);

  try {
    const commentary = await generateCommentary(maddeNo, articleText, title);
    if (!commentary || commentary.length < 200) {
      console.error(`[error] ${fileName}: commentary too short, skipping`);
      return false;
    }

    const newContent = buildNewFile(maddeNo, title, articleText, commentary);
    writeFileSync(filePath, newContent, 'utf-8');
    console.log(`[wrote] ${fileName} (${commentary.split(/\s+/).length} words)`);

    // Commit immediately to prevent loss and keep track
    execSync(`git add content/mevzuat/ttk/${fileName}`, { cwd: __dir });
    execSync(`git commit -m "content(ttk-${maddeNo}): akademik serh tamamlandi"`, { cwd: __dir });
    console.log(`[commit] ttk-${maddeNo}`);

    return true;
  } catch (err) {
    console.error(`[error] ${fileName}: ${err.message}`);
    return false;
  }
}

async function main() {
  if (!existsSync(CONTENT_DIR)) {
    console.error(`Content directory ${CONTENT_DIR} not found.`);
    process.exit(1);
  }

  const fileNames = readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.md'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/madde-(\d+)\.md/)[1], 10);
      const numB = parseInt(b.match(/madde-(\d+)\.md/)[1], 10);
      return numA - numB;
    });

  console.log(`TTK şerh üretimi başlatılıyor... Toplam dosya: ${fileNames.length}`);
  let processed = 0;
  let skipped = 0;

  for (const fileName of fileNames) {
    if (processed >= limit) {
      console.log(`Reached processed limit of ${limit} files. Stopping batch.`);
      break;
    }

    const ok = await processArticle(fileName);
    if (ok) {
      processed++;
      // Wait to respect rate limits
      await new Promise(r => setTimeout(r, 3000));
    } else {
      skipped++;
    }
  }

  // Push all commits at the end
  if (processed > 0) {
    try {
      console.log(`Pushing all commits to remote...`);
      execSync('git push origin main', { cwd: __dir });
      console.log(`[push] successful`);
    } catch (e) {
      console.error(`[push error] ${e.message}`);
    }
  }

  console.log(`\nBatch tamamlandı: ${processed} dosya başarıyla işlendi, ${skipped} atlandı/zaten tamamlanmış.`);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
