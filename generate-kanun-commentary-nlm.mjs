// generate-kanun-commentary-nlm.mjs
// Universal kanun şerh üretimi via NotebookLM
// Usage: node generate-kanun-commentary-nlm.mjs [kanunId] [startMadde] [endMadde]
//   e.g. node generate-kanun-commentary-nlm.mjs hmk 1 100
//        node generate-kanun-commentary-nlm.mjs all   (processes all kanunlar)

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync, spawnSync } from 'node:child_process';

const __dir = dirname(fileURLToPath(import.meta.url));
const CONTENT_BASE = join(__dir, 'content', 'mevzuat');
const NLM_NOTEBOOK = 'de987f9c-fd3a-4f9d-9e44-42d80b948318';
const TODAY = new Date().toISOString().slice(0, 10);

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

function parseFile(filePath) {
  const content = readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n');
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

function askNotebookLM(prompt) {
  // --json: kirilgan "Answer:" metin ayristirmasi yerine guvenilir yapisal cikti.
  const result = spawnSync('notebooklm', ['ask', prompt, '--notebook', NLM_NOTEBOOK, '--json'], {
    cwd: __dir,
    timeout: 120000,
    maxBuffer: 1024 * 1024 * 5,
    encoding: 'utf-8',
  });
  if (result.error) throw new Error(`spawn: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`exit ${result.status}: ${result.stderr?.slice(0, 200)}`);
  let parsed;
  try {
    parsed = JSON.parse(result.stdout);
  } catch {
    throw new Error(`json parse hatasi: ${(result.stdout || '').slice(0, 200)}`);
  }
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
function yazarIsimGeciyorMu(commentary, kanunId) {
  const meta = KANUN_META[kanunId];
  const yazarlar = ALAN_YAZARLAR[meta.alan];
  const isimler = yazarlar.split(/[,/]/).map(s => s.trim()).filter(Boolean);
  for (const isim of isimler) {
    // Turkce iyelik/hal ekleri (Kuru'ya, Kuru'nun vb.) de yakalansin diye kok+kesme isareti kontrolu
    const re = new RegExp(`\\b${isim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(['’]|\\b)`, 'i');
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

  const MAX_ARTICLE_LENGTH = 25000;
  const safeArticleText = articleText.length > MAX_ARTICLE_LENGTH
    ? articleText.substring(0, MAX_ARTICLE_LENGTH) + '\n\n[...METİN ÇOK UZUN OLDUĞU İÇİN KESİLDİ...]'
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
      console.warn(`[retry] ${kanunId}/madde-${maddeId}: ${kontrol.sebep} — guclendirilmis istekle tekrar deneniyor`);
      const retryPrompt = `${basePrompt}\n\nUYARI: Onceki yanitin gecersizdi (${kontrol.sebep}). Hicbir yazarin ismini ANMA (ne italik eser ismiyle ne "X'e gore" seklinde), koseli parantez referans numarasi kullanma, soru sormadan dogrudan 7 bolumlu tam serhi sadece "ogretide genel kabul goren gorus" tarzi atifsiz ifadelerle ### Akademik Yorum ve Analiz basligiyla yaz.`;
      commentary = askNotebookLM(retryPrompt);
      kontrol = gecerliMi(commentary, kanunId);
    }
    if (!kontrol.ok) {
      console.error(`[error] ${kanunId}/madde-${maddeId}: gecersiz yanit (retry sonrasi da) — ${kontrol.sebep}`);
      return false;
    }
    const newContent = buildNewFile(kanunId, maddeId, title, articleText, commentary);
    writeFileSync(filePath, newContent, 'utf-8');
    console.log(`[wrote] ${kanunId}/madde-${maddeId} (${commentary.split(/\s+/).length} words)`);
    execSync(`git add content/mevzuat/${kanunId}/madde-${maddeId}.md`, { cwd: __dir });
    execSync(`git commit -m "content(${kanunId}-${maddeId}): akademik serh tamamlandi"`, { cwd: __dir });
    console.log(`[commit] ${kanunId}-${maddeId}`);
    return true;
  } catch (err) {
    console.error(`[error] ${kanunId}/madde-${maddeId}: ${err.message}`);
    // Rate limit koruması: hata sonrası 15 saniye bekle
    await new Promise(r => setTimeout(r, 15000));
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
      await new Promise(r => setTimeout(r, 3000));
    } else {
      skipped++;
    }
  }

  // Push after each kanun
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

  console.log(`Kanun şerh üretimi — ${targets.join(', ')} (${startNo}-${endNo})`);

  for (const kanunId of targets) {
    if (!KANUN_META[kanunId]) { console.error(`Bilinmeyen kanun: ${kanunId}`); continue; }
    await processKanun(kanunId, startNo, endNo);
  }

  console.log('\nTüm işlemler tamamlandı.');
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
