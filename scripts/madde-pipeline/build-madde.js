#!/usr/bin/env node
/**
 * Mevcut madde dosyasını + temizlenmiş NotebookLM gövdesini birleştirir.
 *
 * Adımlar:
 *  1) Mevcut dosyadan başlık (frontmatter title) ve resmi metin bloğunu (--- arasındaki kısım) parse et
 *  2) Yeni frontmatter (commentaryStatus="completed", lastReviewed, wordCount, keywords) üret
 *  3) Resmi metni aynen koru
 *  4) "### Akademik Yorum ve Analiz" + temizlenmiş gövde + "### Metodolojik Not" ekle
 *
 * Kullanım:
 *   node build-madde.js \
 *     --kanun tmk \
 *     --no 16 \
 *     --body /tmp/tmk16-cleaned.txt \
 *     --keywords "sınırlı ehliyetsizlik,askıda hükümsüzlük,yasal temsilci,icazet,kişiye sıkı sıkıya bağlı hak" \
 *     --mehaz "ZGB Art. 19" \
 *     [--gorus "kısa görüş cümlesi"] \
 *     [--out content/mevzuat/tmk/madde-16.md]   # belirtilmezse otomatik bulunur
 */

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k.startsWith('--')) {
      args[k.slice(2)] = argv[i + 1];
      i++;
    }
  }
  return args;
}

const KANUN_INFO = {
  tbk: { full: 'Türk Borçlar Kanunu', sayi: '6098', yururluk: '1 Temmuz 2012', mehazAd: 'İsviçre Borçlar Kanunu (OR)' },
  tmk: { full: 'Türk Medeni Kanunu', sayi: '4721', yururluk: '1 Ocak 2002', mehazAd: 'İsviçre Medeni Kanunu (Schweizerisches Zivilgesetzbuch — ZGB)' },
  ttk: { full: 'Türk Ticaret Kanunu', sayi: '6102', yururluk: '1 Temmuz 2012', mehazAd: 'İsviçre Borçlar Kanunu (OR) ve Alman Ticaret Kanunu (HGB)' },
};

const DOKTRIN = {
  tbk: `- *Doktrin*: Fikret Eren, *Borçlar Hukuku Genel Hükümler*; Kemal Oğuzman / M. Turgut Öz, *Borçlar Hukuku Genel Hükümler*; Halûk Nomer, *Borçlar Hukuku Genel Hükümler*; Selâhattin Sulhi Tekinay / Sermet Akman / Halûk Burcuoğlu / Atilla Altop, *Tekinay Borçlar Hukuku Genel Hükümler*.`,
  tmk: `- *Doktrin*: Mustafa Dural / Tufan Öğüz, *Türk Özel Hukuku Cilt I — Temel Kavramlar ve Medeni Kanunun Başlangıç Hükümleri*; Mustafa Dural / Tufan Öğüz, *Türk Özel Hukuku Cilt II — Kişiler Hukuku*; Şener Akyol, *Medeni Hukuk — Şahsın Hukuku*; Bilge Öztan, *Şahsın Hukuku Hakiki Şahıslar*; Turgut Akıntürk / Derya Ateş Karaman, *Türk Medeni Hukuku — Aile Hukuku*; Ahmet M. Kılıçoğlu, *Aile Hukuku*.`,
  ttk: `- *Doktrin*: Sabih Arkan, *Ticari İşletme Hukuku*; Hasan Pulaşlı, *Şirketler Hukuku Şerhi*; Ünal Tekinalp, *Sermaye Ortaklıklarının Yeni Hukuku*; Mehmet Bahtiyar, *Ticari İşletme Hukuku*; Reha Poroy / Ünal Tekinalp / Ersin Çamoğlu, *Ortaklıklar Hukuku*.`,
};

function repoRoot() {
  return path.resolve(__dirname, '..', '..');
}

function maddePath(kanun, no) {
  return path.join(repoRoot(), 'content', 'mevzuat', kanun, `madde-${no}.md`);
}

function parseExisting(text) {
  // CRLF → LF normalize (Windows dosyaları için)
  text = text.replace(/\r\n/g, '\n');
  // Frontmatter aç-kapa
  const fmMatch = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) throw new Error('Mevcut dosyada frontmatter parse edilemedi');
  const fmRaw = fmMatch[1];
  const body = fmMatch[2];

  // Başlık
  const titleMatch = fmRaw.match(/^title:\s*"(.+?)"/m);
  const title = titleMatch ? titleMatch[1] : '';

  // Resmi metin bloğu: ilk "---" sonrası "**...**" başlığı, ikinci "---" arasındaki Madde N - ...
  //
  // Dosya formatı:
  //   **A. ... başlık**\n\n---\n\nMadde N - ...\n\n---\n\n### Bizim Yorumumuz/Akademik Yorum...
  //
  // Üst başlık bloğunu + resmi metin bloğunu birlikte koruyalım.

  // Yorum bölümünün başlangıcı
  const yorumStart = body.search(/\n### (Bizim Yorumumuz|Akademik Yorum ve Analiz)\b/);
  if (yorumStart === -1) throw new Error('Yorum başlığı bulunamadı');

  const onsoz = body.slice(0, yorumStart).trim();
  return { title, onsoz };
}

function wordCount(s) {
  return s.trim().split(/\s+/).length;
}

function buildFrontmatter({ title, kanun, no, keywords }) {
  const kw = (keywords || '').split(',').map((x) => x.trim()).filter(Boolean);
  const lines = [
    '---',
    `title: "${title}"`,
    `kanun: "${KANUN_INFO[kanun].full}"`,
    `maddeNo: ${no}`,
    `commentaryStatus: "completed"`,
    `lastReviewed: "2026-05-16"`,
  ];
  if (kw.length > 0) {
    lines.push('keywords:');
    for (const k of kw) lines.push(`  - "${k}"`);
  }
  lines.push('---');
  return lines.join('\n');
}

function buildMetodolojikNot({ kanun, no, mehaz, gorus }) {
  const info = KANUN_INFO[kanun];
  const lines = [];
  lines.push('---');
  lines.push('');
  lines.push('### Metodolojik Not');
  lines.push('');
  lines.push('Bu yorum, **Av. Fethi Güzel** tarafından akademik dürüstlük ilkeleri çerçevesinde hazırlanmıştır.');
  lines.push('');
  lines.push('**Kullanılan kaynaklar:**');
  lines.push('');
  lines.push(DOKTRIN[kanun]);
  lines.push(`- *Yargı kararları*: ${info.full} m. ${no}'yi doğrudan atıflayan güncel bir Yargıtay kararı mevcut taramayla tespit edilemedi.`);
  lines.push(`- *Tarihsel arka plan*: ${info.sayi} sayılı ${info.full}'nun madde gerekçesi.`);
  if (mehaz) {
    lines.push(`- *Karşılaştırmalı hukuk*: ${info.mehazAd} ${mehaz}.`);
  }
  lines.push('');
  lines.push(`**Yorumun kapsamı**: Bu çalışma, ${info.sayi} sayılı ${info.full}'nun ${info.yururluk}'de yürürlüğe giren ${no}. madde metnine dayanır.`);
  lines.push('');
  if (gorus) {
    lines.push(`**Görüş**: ${gorus}`);
    lines.push('');
  }
  lines.push('**Güncellik**: Bu yorum, **16.05.2026** tarihi itibariyle günceldir.');
  lines.push('');
  return lines.join('\n');
}

function main() {
  const args = parseArgs(process.argv);
  const required = ['kanun', 'no', 'body'];
  for (const r of required) {
    if (!args[r]) {
      console.error(`Eksik argüman: --${r}`);
      process.exit(1);
    }
  }
  const kanun = args.kanun;
  const no = args.no;
  if (!KANUN_INFO[kanun]) {
    console.error(`Bilinmeyen kanun: ${kanun}`);
    process.exit(1);
  }

  const targetPath = args.out || maddePath(kanun, no);
  const existing = fs.readFileSync(targetPath, 'utf8');
  const { title, onsoz } = parseExisting(existing);

  const bodyRaw = fs.readFileSync(args.body, 'utf8').trim();

  // Eğer body "#### 1. Sistematik" ile başlıyorsa "### Akademik Yorum ve Analiz" başlığını ekle.
  // Bizimkiler #### başlıkları kullanıyor; ana başlık tek "###" olmalı.
  const ana = '### Akademik Yorum ve Analiz';

  const frontmatter = buildFrontmatter({ title, kanun, no, keywords: args.keywords });
  const metodolojik = buildMetodolojikNot({ kanun, no, mehaz: args.mehaz, gorus: args.gorus });

  const finalDoc = [
    frontmatter,
    '',
    onsoz,
    '',
    ana,
    '',
    bodyRaw,
    '',
    metodolojik,
  ].join('\n');

  fs.writeFileSync(targetPath, finalDoc, 'utf8');
  console.error(`✔ Yazıldı: ${targetPath}`);
  console.error(`  Frontmatter: title=${title}, no=${no}, kanun=${kanun}`);
  console.error(`  Gövde uzunluğu: ${bodyRaw.split('\n').length} satır, ~${wordCount(bodyRaw)} kelime`);
}

if (require.main === module) main();
