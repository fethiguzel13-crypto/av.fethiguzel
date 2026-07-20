// generate-kanun-commentary-nlm.mjs
// Universal kanun şerh üretimi via NotebookLM
// Usage: node generate-kanun-commentary-nlm.mjs [kanunId] [startMadde] [endMadde]
//   e.g. node generate-kanun-commentary-nlm.mjs hmk 1 100
//        node generate-kanun-commentary-nlm.mjs all   (processes all kanunlar)

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync, spawnSync } from 'node:child_process';

const __dir = dirname(fileURLToPath(import.meta.url));
const CONTENT_BASE = join(__dir, 'content', 'mevzuat');
const LOG_DIR = join(__dir, 'logs');
const PROGRESS_PATH = join(LOG_DIR, 'serh-progress.json');
const NLM_NOTEBOOK = 'de987f9c-fd3a-4f9d-9e44-42d80b948318';
const TODAY = new Date().toISOString().slice(0, 10);
const BATCH_COMMIT_SIZE = 10;
const DELAY_OK_MS = 2500;
const DELAY_FAIL_BASE_MS = 15000;
let pendingCommitPaths = [];
let consecutiveFails = 0;

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
  // Kisa prompt: NotebookLM uzun sistem metninde bazen bos cevap donuyor
  return `Sen Av. Fethi Güzel'sin; ${meta.ad} uzmanı Türk hukukçusun.
7 bölümlü akademik şerh yaz. Şu başlıklarla başla ve bitir:

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

Kurallar: Karar UYDURMA (yoksa "emsal karar tespit edilemedi" yaz). Yazar/eser ismi YAZMA; "öğretide genel kabul" de. [1] kullanma. Olaylara "(kurmaca senaryo)" de. Soru sorma. En az 2500 karakter.`;
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

function askNotebookLM(prompt) {
  // Windows CLI arg limitini asmamak icin prompt dosyaya yazilir; Python API cagrilir.
  if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });
  const promptPath = join(LOG_DIR, `nlm-prompt-${process.pid}.txt`);
  writeFileSync(promptPath, prompt, 'utf-8');
  const helper = join(__dir, 'scripts', 'nlm-ask.py');
  const result = spawnSync('python', [helper, NLM_NOTEBOOK, promptPath], {
    cwd: __dir,
    timeout: 360000,
    maxBuffer: 1024 * 1024 * 12,
    encoding: 'utf-8',
  });
  if (result.error) throw new Error(`spawn: ${result.error.message}`);
  const stdout = (result.stdout || '').trim();
  const stderr = (result.stderr || '').trim();
  if (result.status !== 0) {
    // Auth hatasi ise CLI login dene (kullanici yetki verdi), bir kez daha dene
    const combo = `${stdout}\n${stderr}`.toLowerCase();
    const authish = /auth|cookie|unauthor|401|403|login|session|expired|csrf/.test(combo);
    if (authish) {
      console.warn('[auth] NotebookLM oturumu dusmus olabilir, auth refresh + login deneniyor...');
      spawnSync('notebooklm', ['auth', 'refresh', '--quiet'], { cwd: __dir, timeout: 120000, encoding: 'utf-8' });
      // headless login mumkun degilse refresh yeterli olmali; degilse kullanici tarayicida zaten acik
      const retry = spawnSync('python', [helper, NLM_NOTEBOOK, promptPath], {
        cwd: __dir,
        timeout: 360000,
        maxBuffer: 1024 * 1024 * 12,
        encoding: 'utf-8',
      });
      if (retry.error) throw new Error(`spawn retry: ${retry.error.message}`);
      if (retry.status !== 0) {
        throw new Error(`exit ${retry.status} (auth retry): ${(retry.stderr || retry.stdout || '').slice(0, 500)}`);
      }
      const parsedRetry = JSON.parse((retry.stdout || '').trim());
      if (parsedRetry.error) throw new Error(parsedRetry.error);
      return (parsedRetry.answer || '').trim();
    }
    throw new Error(`exit ${result.status}: ${(stderr || stdout).slice(0, 500)}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    throw new Error(`json parse hatasi: ${stdout.slice(0, 200)}`);
  }
  if (parsed.error) throw new Error(parsed.error);
  return (parsed.answer || '').trim();
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
  if (!commentary || commentary.length < 1200) return { ok: false, sebep: `cok kisa (${commentary?.length ?? 0} karakter)` };
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
  // Uzak main geride/ileride olabilir; gece isini bozmamak icin push opsiyonel
  if (process.env.SERH_NO_PUSH === '1') {
    console.log('[push] atlandi (SERH_NO_PUSH=1)');
    return;
  }
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

  // NotebookLM tam uzun metinde bazen bos cevap donuyor; ~1500-2000 guvenli
  const MAX_ARTICLE_LENGTH = 1800;
  const safeArticleText = articleText.length > MAX_ARTICLE_LENGTH
    ? articleText.substring(0, MAX_ARTICLE_LENGTH) + '\n\n[...METİN KESİLDİ...]'
    : articleText;

  const systemPrompt = getSystemPrompt(kanunId);
  const basePrompt = `${systemPrompt}

---
Aşağıdaki madde için eksiksiz akademik şerh yaz. ### Akademik Yorum ve Analiz başlığıyla başlat.

${meta.ad} Madde ${maddeId} — ${title || ''}
${safeArticleText}`;

  try {
    let commentary = askNotebookLM(basePrompt);
    let kontrol = gecerliMi(commentary, kanunId);
    if (!kontrol.ok) {
      console.warn(`[yeniden] ${kanunId}/madde-${maddeId}: ${kontrol.sebep}`);
      const retryPrompt = `${basePrompt}\n\nUYARI: Onceki yanitin gecersizdi (${kontrol.sebep}). Hicbir yazar ismi ANMA, koseli parantez referans kullanma, soru sorma. Dogrudan 7 bolumlu tam serhi ### Akademik Yorum ve Analiz basligiyla yaz.`;
      commentary = askNotebookLM(retryPrompt);
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

  console.log(`Kanun serh uretimi — ${targets.length} kanun hedef (${startNo}-${endNo})`);
  console.log(`Notebook: ${NLM_NOTEBOOK}`);
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
