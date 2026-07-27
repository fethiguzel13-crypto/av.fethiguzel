// generate-kanun-commentary-claude.mjs
// Tüm kanunlar için şerh üretimi (Anthropic Claude) — gece ana motor
// Kullanım: node generate-kanun-commentary-claude.mjs pending|cek|hmk [start] [end]

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dir = dirname(fileURLToPath(import.meta.url));
const CONTENT_BASE = join(__dir, 'content', 'mevzuat');
const LOG_DIR = join(__dir, 'logs');
const PROGRESS_PATH = join(LOG_DIR, 'serh-progress-claude.json');
const TODAY = new Date().toISOString().slice(0, 10);
const BATCH_COMMIT_SIZE = 10;
const DELAY_OK_MS = 800;
const DELAY_FAIL_BASE_MS = 10000;
const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';
let pendingCommitPaths = [];
let consecutiveFails = 0;

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY yok. Cikis.');
  process.exit(1);
}
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Öncelik: önce küçük/eksik, sonra yarıda kalan, en son TTK
const ONCELIK_SIRASI = [
  'cek', 'otv', 'kmk', 'jandarma', 'pvsk', 'aile-koruma', 'buyuksehir', 'cck',
  'dernekler', 'arabuluculuk', 'kamu-ihale-sozlesmeleri', 'katmulkiyeti',
  'imar', 'kamulastirma', 'tvk', 'nhk', 'tebligat', 'il-idaresi', 'vakiflar',
  'rkhk', 'belediye', 'devlet-ihale', 'yukk', 'tsk-ic-hizmet', 'spk', 'bk',
  'ktk', 'iik', 'dmk', 'kdvk', 'gvk', 'hmk', 'vuk', 'aatuhk', 'ttk',
  'tbk', 'tmk', 'tck', 'cmk', 'is-kanunu', 'isg', 'kvk', 'kvkk',
  'sendikalar', 'ssgssk', 'tkhk',
];

const KANUN_META = {
  tbk: { ad: 'Türk Borçlar Kanunu', alan: 'borclar' },
  tmk: { ad: 'Türk Medeni Kanunu', alan: 'medeni' },
  ttk: { ad: 'Türk Ticaret Kanunu', alan: 'ticaret' },
  tck: { ad: 'Türk Ceza Kanunu', alan: 'ceza' },
  cmk: { ad: 'Ceza Muhakemesi Kanunu', alan: 'ceza-muhakemesi' },
  kmk: { ad: 'Kaçakçılıkla Mücadele Kanunu', alan: 'kacakcilik' },
  cck: { ad: 'Çocuk Koruma Kanunu', alan: 'cocuk' },
  hmk: { ad: 'Hukuk Muhakemeleri Kanunu', alan: 'medeni-usul' },
  iik: { ad: 'İcra ve İflas Kanunu', alan: 'icra-iflas' },
  tebligat: { ad: 'Tebligat Kanunu', alan: 'medeni-usul' },
  arabuluculuk: { ad: 'Hukuk Uyuşmazlıklarında Arabuluculuk Kanunu', alan: 'arabuluculuk' },
  vuk: { ad: 'Vergi Usul Kanunu', alan: 'vergi' },
  gvk: { ad: 'Gelir Vergisi Kanunu', alan: 'vergi' },
  kvk: { ad: 'Kurumlar Vergisi Kanunu', alan: 'vergi' },
  kdvk: { ad: 'Katma Değer Vergisi Kanunu', alan: 'vergi' },
  aatuhk: { ad: 'Amme Alacaklarının Tahsil Usulü Hakkında Kanun', alan: 'vergi' },
  otv: { ad: 'Özel Tüketim Vergisi Kanunu', alan: 'vergi' },
  dmk: { ad: 'Devlet Memurları Kanunu', alan: 'idare' },
  imar: { ad: 'İmar Kanunu', alan: 'imar' },
  belediye: { ad: 'Belediye Kanunu', alan: 'yerel-yonetim' },
  buyuksehir: { ad: 'Büyükşehir Belediyesi Kanunu', alan: 'yerel-yonetim' },
  'il-idaresi': { ad: 'İl İdaresi Kanunu', alan: 'idare' },
  'devlet-ihale': { ad: 'Devlet İhale Kanunu', alan: 'ihale' },
  'kamu-ihale-sozlesmeleri': { ad: 'Kamu İhale Sözleşmeleri Kanunu', alan: 'ihale' },
  kamulastirma: { ad: 'Kamulaştırma Kanunu', alan: 'kamulastirma' },
  'is-kanunu': { ad: 'İş Kanunu', alan: 'is-hukuku' },
  ssgssk: { ad: 'Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu', alan: 'sosyal-guvenlik' },
  sendikalar: { ad: 'Sendikalar ve Toplu İş Sözleşmesi Kanunu', alan: 'toplu-is' },
  isg: { ad: 'İş Sağlığı ve Güvenliği Kanunu', alan: 'isg' },
  tkhk: { ad: 'Tüketicinin Korunması Hakkında Kanun', alan: 'tuketici' },
  kvkk: { ad: 'Kişisel Verilerin Korunması Kanunu', alan: 'kvkk' },
  bk: { ad: 'Bankacılık Kanunu', alan: 'bankacilik' },
  spk: { ad: 'Sermaye Piyasası Kanunu', alan: 'sermaye-piyasasi' },
  rkhk: { ad: 'Rekabetin Korunması Hakkında Kanun', alan: 'rekabet' },
  cek: { ad: 'Çek Kanunu', alan: 'ticaret' },
  'aile-koruma': { ad: 'Ailenin Korunması ve Kadına Karşı Şiddetin Önlenmesine Dair Kanun', alan: 'aile-siddet' },
  katmulkiyeti: { ad: 'Kat Mülkiyeti Kanunu', alan: 'kat-mulkiyeti' },
  tvk: { ad: 'Türk Vatandaşlığı Kanunu', alan: 'vatandaslik' },
  nhk: { ad: 'Nüfus Hizmetleri Kanunu', alan: 'nufus' },
  yukk: { ad: 'Yabancılar ve Uluslararası Koruma Kanunu', alan: 'yabancilar' },
  dernekler: { ad: 'Dernekler Kanunu', alan: 'dernek' },
  vakiflar: { ad: 'Vakıflar Kanunu', alan: 'vakif' },
  pvsk: { ad: 'Polis Vazife ve Salahiyet Kanunu', alan: 'guvenlik' },
  jandarma: { ad: 'Jandarma Teşkilat, Görev ve Yetkileri Kanunu', alan: 'guvenlik' },
  'tsk-ic-hizmet': { ad: 'Türk Silahlı Kuvvetleri İç Hizmet Kanunu', alan: 'guvenlik' },
  ktk: { ad: 'Karayolları Trafik Kanunu', alan: 'trafik' },
};

// İsimler metne YAZILMAZ; sadece yanlışlıkla geçmesi engellenir
const ALAN_YAZARLAR = {
  'borclar': 'Eren, Oğuzman, Öz, Nomer, Tekinay, Kocayusufpaşaoğlu, Hatemi, Serozan, Zevkliler, Yavuz',
  'medeni': 'Dural, Öğüz, Öztan, Akıntürk, Kılıçoğlu, Oğuzman, Seliçi, Oktay, Akyol',
  'ticaret': 'Arkan, Pulaşlı, Tekinalp, Bahtiyar, Poroy, Çamoğlu, Kendigelen, Kırca',
  'ceza': 'Artuk, Gökcen, Yenidünya, Koca, Üzülmez, Özbek, Centel, Zafer, Hakeri',
  'ceza-muhakemesi': 'Öztürk, Tezcan, Erdem, Centel, Zafer, Yenisey, Nuhoğlu, Yurtcan, Ünver, Hakeri',
  'medeni-usul': 'Kuru, Pekcanıtez, Atalay, Özekes, Yılmaz, Sungurtekin, Budak, Karaaslan',
  'icra-iflas': 'Kuru, Pekcanıtez, Atalay, Yılmaz, Uyar, Sungurtekin',
  'vergi': 'Öncel, Kumrulu, Çağan, Kaneti, Yavaşlar, Yaltı, Tosuner, Demir, Erginay',
  'idare': 'Günday, Özay, Tan, Yayla, Gözübüyük',
  'kacakcilik': 'Özbek, Kanbur, Doğan, Bacaksız, Tepe, Hakeri, Koca, Üzülmez',
  'arabuluculuk': 'Özbek, Kuru, Pekcanıtez, Yılmaz',
  'is-hukuku': 'Süzek, Çelik, Caniklioğlu, Canbolat, Mollamahmutoğlu, Astarlı, Baysal, Sümer',
  'sosyal-guvenlik': 'Güzel, Okur, Sandal, Tuncay, Ekmekçi, Arıcı',
  'toplu-is': 'Süzek, Sur, Çelik, Şahlanan',
  'isg': 'Süzek, Çelik, Sümer',
  'tuketici': 'Aslan, Yılmaz, Zevkliler, Gökyayla',
  'kvkk': 'Küzeci, Dülger, Kaya',
  'bankacilik': 'Reisoğlu, Tekinalp, Poroy',
  'sermaye-piyasasi': 'Tekinalp, Poroy, Kendigelen',
  'rekabet': 'Aslan, Sanlı, Gürzumar',
  'imar': 'Günday, Kalabalık, Yıldırım',
  'yerel-yonetim': 'Günday, Özay, Tan',
  'ihale': 'Günday, Gözübüyük, Tan',
  'kamulastirma': 'Günday, Kalabalık',
  'aile-siddet': 'Akıntürk, Dural, Kılıçoğlu',
  'kat-mulkiyeti': 'Oğuzman, Seliçi, Oktay, Akipek',
  'vatandaslik': 'Çelikel, Nomer, Güngör',
  'nufus': 'Dural, Öğüz',
  'yabancilar': 'Çelikel, Nomer, Güngör, Ekşi',
  'dernek': 'Dural, Öğüz, Akyol',
  'vakif': 'Dural, Öğüz, Akyol',
  'guvenlik': 'Gözübüyük, Günday, Centel',
  'trafik': 'Kılıçoğlu, Eren, Nomer',
  'cocuk': 'Centel, Akıntürk, Dural',
};

function getSystemPrompt(kanunId) {
  const meta = KANUN_META[kanunId];
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

ZORUNLU KURALLAR (halüsinasyon önleme — kesinlikle uyulacak):
- Yargıtay/Danıştay/AYM kararı UYDURMA. Gerçek karar yoksa: "Bu maddeye ilişkin son dönemde emsal karar tespit edilemedi." yaz.
- Doktrin/öğreti bölümlerinde HİÇBİR YAZARIN İSMİNİ ANMA (ne "X, eserinde belirtmektedir" ne "X'e göre" ne italik eser adıyla). Gerçek bir yazara ait gerçek bir görüşü doğrulayabileceğin bir kaynağın yok; isim anman doğrudan UYDURMA ATIF olur. Bunun yerine SADECE isimsiz/atıfsız genel ifadeler kullan: "Öğretide genel kabul gören görüşe göre...", "Doktrinde bu husus şu şekilde değerlendirilmektedir...", "Öğretide yapılan eleştirilere göre..." gibi.
- Köşeli parantez içi referans numarası [1], [2] gibi KULLANMA — bunlar gerçek kaynağa dayanmayan sahte atıf izlenimi verir.
- Sayfa numarası, baskı yılı, yazar adı, eser adı YAZMA
- Pratik olaylar "(kurmaca senaryo)" ibaresiyle işaretle
- Akademik Türkçe, net cümleler
- SADECE şerhi yaz; soru sorma, izin isteme, ek araştırma teklif etme.`;
}

function loadProgress() {
  if (!existsSync(PROGRESS_PATH)) {
    return { startedAt: new Date().toISOString(), ok: [], fail: [], last: null };
  }
  try {
    return JSON.parse(readFileSync(PROGRESS_PATH, 'utf-8'));
  } catch {
    return { startedAt: new Date().toISOString(), ok: [], fail: [], last: null };
  }
}

function saveProgress(p) {
  if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });
  p.updatedAt = new Date().toISOString();
  writeFileSync(PROGRESS_PATH, JSON.stringify(p, null, 2), 'utf-8');
}

function parseFile(filePath) {
  const content = readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n');
  const body = content.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
  const titleMatch = body.match(/^\*\*(.+?)\*\*/);
  const title = titleMatch ? titleMatch[1] : '';
  const articleText = body
    .replace(/^\*\*.+?\*\*\n\n---\n\n/, '')
    .replace(/\n\n### (?:Bizim Yorumumuz|Akademik Yorum ve Analiz)[\s\S]*$/, '')
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

async function askClaude(systemPrompt, userPrompt) {
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });
  const text = msg.content?.filter(b => b.type === 'text').map(b => b.text).join('\n').trim() || '';
  return text;
}

const REDDETME_KALIPLARI = [
  /ister misiniz/i, /yapmam[iı] ister/i, /izin verir misiniz/i, /onayl[iı]yor musunuz/i,
  /ara[şs]t[iı]rma yapmam[iı]/i, /devam edeyim mi/i, /payla[şs]abilir misiniz/i,
  /dilerseniz/i, /isterseniz/i, /hazırlayabilirim/i, /haz[iı]r[iı]m/i, /yard[iı]mc[iı] olabilirim/i,
];
const GEREKLI_BASLIKLAR = [
  '### Akademik Yorum ve Analiz',
  '#### 7. Eleştirel Değerlendirme',
];
// Gercek kaynak yokken isme baglanmis spesifik atif = halusinasyon riski.
// "[1]" / "[2]" gibi referans numaralari veya "Yazar, *Eser*" kalibi tespit edilirse reddet.
const SAHTE_ATIF_KALIPLARI = [/\[\d+\]/, /\*[^*]{3,60}\*\s*(çalışmasında|eserinde|kitabında)/i];

// Onayli yazar listesindeki soyisimlerin METINDE HIC GECMEMESI gerekir (format ne olursa olsun) —
// guvenli kalip "oğretide genel kabul goren gorus" gibi atifsiz ifadedir, isim gecmesi
// regex-kacagi bir uydurma atif olabilir (orn. "Kuru'ya gore" — koseli parantez/italik yok ama yine atif).
// NOT: JS \b, Turkce harfleri (ı,ğ,ş,ç,ö,ü,İ) "kelime karakteri" saymaz — bu yuzden \bTan\b gibi bir
// kalip "TANım/tanı" icinde sahte eslesir. Bunun yerine Turkce harfleri de kapsayan elle kurulmus
// kelime-siniri kullanilir; iyelik eki icin apostrof+ek istisnasi taninir.
const TR_WORDCHAR = "A-Za-zÇĞİIÖŞÜçğıiöşü0-9";
function yazarIsimGeciyorMu(commentary, kanunId) {
  const meta = KANUN_META[kanunId];
  const yazarlar = ALAN_YAZARLAR[meta.alan] || '';
  const isimler = yazarlar.split(/[,/]/).map(s => s.trim()).filter(Boolean).filter(s => s.length >= 3);
  for (const isim of isimler) {
    const escaped = isim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?<![${TR_WORDCHAR}])${escaped}(?:['’][${TR_WORDCHAR}]*)?(?![${TR_WORDCHAR}])`, 'i');
    if (re.test(commentary)) return isim;
  }
  return null;
}

function gecerliMi(commentary, kanunId) {
  if (!commentary || commentary.length < 1500) return { ok: false, sebep: `cok kisa (${commentary?.length ?? 0} karakter)` };
  for (const kalip of REDDETME_KALIPLARI) {
    if (kalip.test(commentary)) return { ok: false, sebep: `reddetme/soru kalibi tespit edildi: ${kalip}` };
  }
  for (const baslik of GEREKLI_BASLIKLAR) {
    if (!commentary.includes(baslik)) return { ok: false, sebep: `gerekli baslik eksik: ${baslik}` };
  }
  for (const kalip of SAHTE_ATIF_KALIPLARI) {
    if (kalip.test(commentary)) return { ok: false, sebep: `olasi uydurma atif kalibi tespit edildi: ${kalip}` };
  }
  const isimBulundu = yazarIsimGeciyorMu(commentary, kanunId);
  if (isimBulundu) return { ok: false, sebep: `onayli yazar ismi metinde geciyor (uydurma atif riski): ${isimBulundu}` };
  return { ok: true };
}

function gitCommitBatch(paths, message) {
  if (!paths.length) return;
  try {
    for (const p of paths) {
      execSync(`git add "${p}"`, { cwd: __dir, stdio: 'pipe' });
    }
    execSync(`git commit -m "${message}"`, { cwd: __dir, stdio: 'pipe' });
    console.log(`[commit] ${paths.length} dosya — ${message}`);
  } catch (e) {
    console.warn(`[commit uyarisi] ${(e.message || '').slice(0, 120)}`);
  }
}

function gitPush() {
  try {
    execSync('git push origin main', { cwd: __dir, stdio: 'pipe' });
    console.log('[push] origin main');
  } catch (e) {
    console.warn(`[push uyarisi] ${(e.message || '').slice(0, 160)}`);
  }
}

async function processArticle(kanunId, maddeId, progress) {
  const filePath = join(CONTENT_BASE, kanunId, `madde-${maddeId}.md`);
  if (!existsSync(filePath)) return 'missing';

  const existing = readFileSync(filePath, 'utf-8');
  if (existing.includes('commentaryStatus: "completed"')) return 'skip';

  const { title, articleText } = parseFile(filePath);
  if (!articleText || articleText.length < 10) {
    console.log(`[atla] ${kanunId}/madde-${maddeId}: metin yok`);
    return 'skip';
  }

  const meta = KANUN_META[kanunId];
  console.log(`[isleniyor] ${kanunId.toUpperCase()} Madde ${maddeId}: ${title || '(basliksiz)'}`);

  const MAX_ARTICLE_LENGTH = 25000;
  const safeArticleText = articleText.length > MAX_ARTICLE_LENGTH
    ? articleText.substring(0, MAX_ARTICLE_LENGTH) + '\n\n[...METİN KESİLDİ...]'
    : articleText;

  const systemPrompt = getSystemPrompt(kanunId);
  const userPrompt = `Aşağıdaki madde için eksiksiz akademik şerh yaz. ### Akademik Yorum ve Analiz başlığıyla başlat.

${meta.ad} Madde ${maddeId} — ${title || ''}

${safeArticleText}`;

  try {
    let commentary = await askClaude(systemPrompt, userPrompt);
    let kontrol = gecerliMi(commentary, kanunId);
    if (!kontrol.ok) {
      console.warn(`[yeniden] ${kanunId}/madde-${maddeId}: ${kontrol.sebep}`);
      commentary = await askClaude(
        systemPrompt,
        `${userPrompt}\n\nUYARI: Onceki yanit gecersizdi (${kontrol.sebep}). Yazar ismi ANMA, [1] referans kullanma, soru sorma. 7 bolumlu tam serhi ### Akademik Yorum ve Analiz basligiyla yaz.`
      );
      kontrol = gecerliMi(commentary, kanunId);
    }
    if (!kontrol.ok) {
      console.error(`[hata] ${kanunId}/madde-${maddeId}: ${kontrol.sebep}`);
      progress.fail.push({ kanunId, maddeId, sebep: kontrol.sebep, t: new Date().toISOString() });
      progress.last = { kanunId, maddeId, ok: false };
      saveProgress(progress);
      consecutiveFails++;
      return 'fail';
    }
    const newContent = buildNewFile(kanunId, maddeId, title, articleText, commentary);
    writeFileSync(filePath, newContent, 'utf-8');
    const words = commentary.split(/\s+/).length;
    console.log(`[yazildi] ${kanunId}/madde-${maddeId} (${words} kelime)`);

    const rel = `content/mevzuat/${kanunId}/madde-${maddeId}.md`;
    pendingCommitPaths.push(rel);
    if (pendingCommitPaths.length >= BATCH_COMMIT_SIZE) {
      gitCommitBatch(pendingCommitPaths, `content(serh): ${pendingCommitPaths.length} madde serhi tamamlandi`);
      pendingCommitPaths = [];
    }

    progress.ok.push({ kanunId, maddeId, words, t: new Date().toISOString() });
    progress.last = { kanunId, maddeId, ok: true };
    progress.fail = progress.fail.filter(f => !(f.kanunId === kanunId && f.maddeId === maddeId));
    saveProgress(progress);
    consecutiveFails = 0;
    return 'ok';
  } catch (err) {
    console.error(`[hata] ${kanunId}/madde-${maddeId}: ${err.message}`);
    progress.fail.push({ kanunId, maddeId, sebep: err.message, t: new Date().toISOString() });
    progress.last = { kanunId, maddeId, ok: false };
    saveProgress(progress);
    consecutiveFails++;
    const wait = Math.min(DELAY_FAIL_BASE_MS * Math.min(consecutiveFails, 8), 180000);
    console.log(`[bekle] hata sonrasi ${Math.round(wait / 1000)} sn`);
    await new Promise(r => setTimeout(r, wait));
    return 'fail';
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

function countPending(kanunId) {
  const dir = join(CONTENT_BASE, kanunId);
  if (!existsSync(dir)) return 0;
  let n = 0;
  for (const f of readdirSync(dir).filter(x => x.endsWith('.md'))) {
    const t = readFileSync(join(dir, f), 'utf-8');
    if (!t.includes('commentaryStatus: "completed"')) n++;
  }
  return n;
}

async function processKanun(kanunId, startNo = 1, endNo = 9999, progress) {
  if (!KANUN_META[kanunId]) {
    console.error(`[bilinmeyen] ${kanunId}`);
    return 0;
  }
  const pending = countPending(kanunId);
  console.log(`\n[kanun] ${kanunId.toUpperCase()} — bekleyen ~${pending}`);
  if (pending === 0) {
    console.log(`[atla] ${kanunId} tamamen tamam`);
    return 0;
  }

  const maddeler = getMaddeler(kanunId, startNo, endNo);
  let processed = 0, skipped = 0, failed = 0;

  for (const maddeId of maddeler) {
    if (consecutiveFails >= 5) {
      console.warn(`[atla-kanun] ${kanunId}: 5 ardisik hata, sonraki kanuna geciliyor`);
      consecutiveFails = 0;
      break;
    }
    const result = await processArticle(kanunId, maddeId, progress);
    if (result === 'ok') {
      processed++;
      await new Promise(r => setTimeout(r, DELAY_OK_MS));
    } else if (result === 'fail') {
      failed++;
    } else {
      skipped++;
    }
  }

  if (pendingCommitPaths.length) {
    gitCommitBatch(pendingCommitPaths, `content(serh): ${kanunId} batch`);
    pendingCommitPaths = [];
  }
  gitPush();
  console.log(`${kanunId}: ${processed} yazildi, ${skipped} atlandi, ${failed} hata`);
  return processed;
}

async function main() {
  const arg1 = process.argv[2] || 'pending';
  const startNo = parseInt(process.argv[3] || '1', 10);
  const endNo = parseInt(process.argv[4] || '9999', 10);

  const progress = loadProgress();
  if (!progress.ok) progress.ok = [];
  if (!progress.fail) progress.fail = [];

  let targets;
  if (arg1 === 'pending' || arg1 === 'all') {
    const onDisk = readdirSync(CONTENT_BASE, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
    const ordered = [];
    for (const id of ONCELIK_SIRASI) {
      if (onDisk.includes(id) && KANUN_META[id]) ordered.push(id);
    }
    for (const id of onDisk) {
      if (!ordered.includes(id) && KANUN_META[id]) ordered.push(id);
    }
    targets = ordered;
  } else {
    targets = [arg1];
  }

  console.log(`Kanun serh uretimi (Claude) — ${targets.length} kanun hedef (${startNo}-${endNo})`);
  console.log(`Model: ${MODEL}`);
  console.log(`Ilerleme: ${PROGRESS_PATH}`);

  let total = 0;
  for (const kanunId of targets) {
    total += await processKanun(kanunId, startNo, endNo, progress);
  }

  if (pendingCommitPaths.length) {
    gitCommitBatch(pendingCommitPaths, 'content(serh): kalan batch');
    pendingCommitPaths = [];
    gitPush();
  }

  console.log(`\nBitti. Bu kosuda yazilan: ${total}`);
  console.log(`Toplam ok kayit: ${progress.ok.length}, fail kayit: ${progress.fail.length}`);
}

main().catch(err => { console.error('Olumcul hata:', err.message); process.exit(1); });
