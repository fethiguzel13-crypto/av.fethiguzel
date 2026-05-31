// generate-is-hukuku-commentary.mjs
// Batch Labor Law (İş Hukuku) commentary generator — runs in background, writes + commits each article
// Usage: node generate-is-hukuku-commentary.mjs [kanunId] [limit]
//   e.g. node generate-is-hukuku-commentary.mjs is-kanunu 5

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dir = dirname(fileURLToPath(import.meta.url));
const TODAY = new Date().toISOString().slice(0, 10);

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const kanunId = process.argv[2];
const limit = parseInt(process.argv[3] || '1', 10);

const KANUN_META = {
  'is-kanunu':  { ad: 'İş Kanunu',                                         alan: 'is-hukuku' },
  'ssgssk':     { ad: 'Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu', alan: 'sosyal-guvenlik' },
  'sendikalar': { ad: 'Sendikalar ve Toplu İş Sözleşmesi Kanunu',          alan: 'toplu-is-hukuku' },
  'isg':        { ad: 'İş Sağlığı ve Güvenliği Kanunu',                    alan: 'isg-hukuku' }
};

const ALAN_YAZARLAR = {
  'is-hukuku':        'Sarper Süzek (İş Hukuku), Nuri Çelik / Nurşen Caniklioğlu / Talat Canbolat (İş Hukuku Dersleri), Hamdi Mollamahmutoğlu / Muhittin Astarlı / Ulaş Baysal (İş Hukuku), Haluk Hadi Sümer (İş Hukuku Dersleri), Devrim Ulucan (İş Hukuku)',
  'sosyal-guvenlik':  'Ali Güzel / A. Rıza Okur / Ali Rıza Sandal (Sosyal Güvenlik Hukuku), A. Can Tuncay / Ömer Ekmekçi (Sosyal Güvenlik Hukuku Dersleri), Kadir Arıcı (Sosyal Güvenlik Hukuku)',
  'toplu-is-hukuku':  'Sarper Süzek (İş Hukuku), Melda Sur (Toplu İş Hukuku), Nuri Çelik / Nurşen Caniklioğlu / Talat Canbolat (İş Hukuku Dersleri), Fevzi Şahlanan (İş Hukuku)',
  'isg-hukuku':       'Sarper Süzek (İş Hukuku), Nuri Çelik / Nurşen Caniklioğlu / Talat Canbolat (İş Hukuku Dersleri), Haluk Hadi Sümer (İş Hukuku Dersleri)'
};

if (!kanunId || !KANUN_META[kanunId]) {
  console.error(`Lütfen geçerli bir kanunId belirtin: ${Object.keys(KANUN_META).join(', ')}`);
  console.error(`Örnek kullanım: node generate-is-hukuku-commentary.mjs is-kanunu 5`);
  process.exit(1);
}

const meta = KANUN_META[kanunId];
const CONTENT_DIR = join(__dir, 'content', 'mevzuat', kanunId);
const yazarlar = ALAN_YAZARLAR[meta.alan];

const SYSTEM = `Sen Av. Fethi Güzel'sin. Türk İş Hukuku ve Sosyal Güvenlik Hukuku alanında uzman, dünya çapında kıdemli bir akademisyen ve avukatsın.
${meta.ad} maddelerini profesör düzeyinde akademik kalitede ve derinlikli şekilde şerh ediyorsun.

Ürettiğin her şerh şu bölümleri içermek zorundadır:
### Akademik Yorum ve Analiz

#### 1. Maddenin Sistematiği ve Genel Açıklama
- Maddenin kanun içindeki konumu (Kitap/Kısım/Bölüm/Ayrım)
- Düzenleme amacı (ratio legis) ve korunan hukuki yarar
- Tarihsel arka plan ve kaynak kanun/uluslararası sözleşmeler (özellikle ILO sözleşmeleri, Avrupa Birliği direktifleri vb. paralellikleri)

#### 2. Maddedeki Kavramların Analizi
- Madde metnindeki her kilit kavram için ayrı alt-başlık (örn. ##### 2.1., ##### 2.2.) açarak derinlemesine tanım, hukuki nitelik ve sınırlar.

#### 3. Sistematik İlişkiler
- Maddenin birlikte okunması gereken diğer kanun hükümleriyle (diğer İş Hukuku mevzuatları, Türk Borçlar Kanunu, Türk Medeni Kanunu vb.) ilişkisi ve atıflar.

#### 4. Uygulama: Yargıtay İçtihadı
- Yargıtay 9. Hukuk Dairesi, 22. Hukuk Dairesi (mülga) veya Hukuk Genel Kurulu kararlarına atıflar (Sosyal güvenlik konuları için 10. Hukuk Dairesi veya 21. Hukuk Dairesi (mülga) kararları).
- Emsal karar veya içtihat yoksa veya araştırılmadıysa şu kalıbı kullan: "Bu maddeye doğrudan ilişkin son 24 ayda Yargıtay/AYM kararı çekilemedi. Kullanıcı tarafından sağlanan ek karar yok."

#### 5. Pratik Örnek Olaylar
- Madde hükmünün uygulamasını gösteren en az 2 detaylı somut kurmaca olay senaryosu.
- Olay başlıklarını mutlaka "**Olay 1 (Kurmaca Senaryo):**" ve "**Olay 2 (Kurmaca Senaryo):**" şeklinde yaz. Altına "*Hukuki Analiz:*" ile çözümü ekle.

#### 6. Pratik Uygulama Notları
- İspat yükü, süreler, zamanaşımı, görevli ve yetkili mahkeme ve uygulamada sık yapılan hatalar.

#### 7. Eleştirel Değerlendirme
- Doktrindeki tartışmalar, aksayan yönler, reform önerileri ve modern çalışma modellerinin (örneğin uzaktan çalışma, platform/gig ekonomisi çalışanları, esnek çalışma saatleri gibi) bu maddeyle ilişkisi ve doğurduğu sorunlar.

---
### Metodolojik Not
- Yazar olarak Av. Fethi Güzel'in imzası, akademik dürüstlük bildirimi, kullanılan kaynaklar ve güncellik tarihi (31.05.2026).

ZORUNLU VE KATİ KURALLAR:
1. Yargıtay kararı uydurma. Künye formatı (Daire/Esas/Karar/Tarih) birebir gerçek olmalı, uydurulmamalıdır. Karar yoksa yukarıdaki kalıp metni yaz.
2. Sadece şu yazarlardan/eserlerden atıf yap:
   - ${yazarlar}
3. ASLA sayfa numarası veya baskı yılı yazma! (Örn: "Süzek, s. 245" veya "Çelik, 2024" YASAKTIR).
4. Pratik örnek olayları mutlaka "(Kurmaca Senaryo)" ibaresiyle işaretle.
5. Akademik, resmi, duru ve elit bir Türkçe kullan.
6. Şerhin tamamının uzunluğu 350-700 satır arasında derinlikli olmalıdır. Sığ içerik üretme.`;

async function generateCommentary(maddeNo, articleText, title) {
  const prompt = `${meta.ad} Madde ${maddeNo} için akademik şerh yaz.

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
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  const body = content.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
  const titleMatch = body.match(/^\*\*(.+?)\*\*/);
  const title = titleMatch ? titleMatch[1] : '';
  const articleText = body.replace(/^\*\*.+?\*\*\n\n---\n\n/, '').trim();
  return { frontmatter: fmMatch ? fmMatch[0] : '', title, articleText, body };
}

function buildNewFile(maddeNo, title, articleText, commentary) {
  const keywords = extractKeywords(title, articleText);
  const wordCount = commentary.split(/\s+/).length;

  const fm = [
    '---',
    `title: "${meta.ad} Madde ${maddeNo}"`,
    `kanun: "${meta.ad}"`,
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
  return unique.length ? unique : ['iş hukuku', 'mevzuat', 'iş kanunu'];
}

async function processArticle(fileName) {
  const filePath = join(CONTENT_DIR, fileName);
  const existing = readFileSync(filePath, 'utf-8');
  
  const match = fileName.match(/madde-(\d+)\.md/);
  if (!match) return false;
  const maddeNo = parseInt(match[1], 10);
  
  const splitRegex = /\n### (?:Bizim Yorumumuz|Akademik Yorum ve Analiz)\s*\n/;
  const parts = existing.split(splitRegex);
  let commentaryText = parts.length > 1 ? parts[1].trim() : "";
  if (commentaryText === "Bu maddeye ait akademik yorum ve analiz yakında eklenecektir.") {
    commentaryText = "";
  }
  
  if (commentaryText !== "") {
    console.log(`[skip] ${fileName} zaten tamamlanmış.`);
    return false;
  }

  const { title, articleText } = parseFile(filePath);
  if (!articleText || articleText.length < 20) {
    console.log(`[skip] ${fileName} anlamlı bir madde metni içermiyor.`);
    return false;
  }

  console.log(`[process] ${meta.ad} Madde ${maddeNo}: ${title || '(başlıksız)'}`);

  try {
    const commentary = await generateCommentary(maddeNo, articleText, title);
    if (!commentary || commentary.length < 200) {
      console.error(`[error] ${fileName}: şerh çok kısa, atlanıyor.`);
      return false;
    }

    const newContent = buildNewFile(maddeNo, title, articleText, commentary);
    writeFileSync(filePath, newContent, 'utf-8');
    console.log(`[wrote] ${fileName} (${commentary.split(/\s+/).length} kelime)`);

    // Git commit
    execSync(`git add content/mevzuat/${kanunId}/${fileName}`, { cwd: __dir });
    execSync(`git commit -m "content(${kanunId}-${maddeNo}): akademik serh tamamlandi"`, { cwd: __dir });
    console.log(`[commit] ${kanunId}-${maddeNo}`);

    return true;
  } catch (err) {
    console.error(`[error] ${fileName}: ${err.message}`);
    return false;
  }
}

async function main() {
  if (!existsSync(CONTENT_DIR)) {
    console.error(`Klasör bulunamadı: ${CONTENT_DIR}`);
    process.exit(1);
  }

  const fileNames = readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.md'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/madde-(\d+)\.md/)[1], 10);
      const numB = parseInt(b.match(/madde-(\d+)\.md/)[1], 10);
      return numA - numB;
    });

  console.log(`${meta.ad} şerh üretimi başlatılıyor... Toplam dosya: ${fileNames.length}`);
  let processed = 0;
  let skipped = 0;

  for (const fileName of fileNames) {
    if (processed >= limit) {
      console.log(`Hedeflenen işlem limitine (${limit}) ulaşıldı. İşlem durduruluyor.`);
      break;
    }

    const ok = await processArticle(fileName);
    if (ok) {
      processed++;
      await new Promise(r => setTimeout(r, 2000));
    } else {
      skipped++;
    }
  }

  if (processed > 0) {
    try {
      console.log(`Uzak depoya (remote) gönderiliyor...`);
      execSync('git push origin main', { cwd: __dir });
      console.log(`[push] başarılı`);
    } catch (e) {
      console.error(`[push hatası] ${e.message}`);
    }
  }

  console.log(`\nÖzet: ${processed} başarıyla işlendi, ${skipped} atlandı/zaten tamamlanmış.`);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
