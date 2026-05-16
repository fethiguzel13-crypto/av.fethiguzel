#!/usr/bin/env node
/**
 * Madde dosyasında kalite ihlallerini tarar.
 *
 * Hatalar:
 *  - [N] atıf markerı kalıntısı
 *  - "Hafıza Tekniği", "Sokratik Soru", "Sevgili doktora" intro kalıntısı
 *  - Doktrin listesi DIŞI yazar adı (TMK için)
 *  - Sayfa numarası ("s. 234", "sf. 123" gibi)
 *  - Eksik bölüm (1-7 + Metodolojik Not bulunamadı)
 *
 * Çıktı: stdout'a uyarılar, exit code 0 (temiz) veya 1 (hata var).
 *
 * Kullanım: node lint-madde.js <madde-dosyası>
 */

const fs = require('fs');

// İzinli yazar adları — bunlar dışındaki yazar atıfı şüphelidir.
// (doctrine-tbk.md / doctrine-tmk.md / doctrine-ttk.md listelerinin birleşimi)
const ALLOWED_AUTHORS = [
  // TBK
  'Eren', 'Oğuzman', 'Nomer', 'Tekinay', 'Akman', 'Burcuoğlu', 'Altop',
  // TMK
  'Dural', 'Öğüz', 'Akyol', 'Özsunay', 'Öztan', 'Akıntürk', 'Ateş Karaman',
  'Karaman', 'Sulhi Tekinay', 'Kılıçoğlu', 'Gümüş', 'Sirmen', 'Esin',
  'Seliçi', 'Oktay-Özdemir', 'Öz',
  // TTK
  'Arkan', 'Pulaşlı', 'Tekinalp', 'Bahtiyar', 'Poroy', 'Çamoğlu',
];

// Yasaklı / şüpheli yazar isimleri (geçmişte hatalı sızanlar)
const SUSPECT_AUTHORS = [
  'Antalya', 'Atamer', 'Oğuzman/Öz', 'Yenice', 'Şahiner', 'Çakırca',
  'Hatemi', 'Helvacı',  // doktrin listelerimizde yoklar
  'Reisoğlu', 'Becker', 'Schwenzer',
];

function lintFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const warnings = [];

  // 1) Atıf markerları
  const cites = text.match(/\[\d+(\s*[-,]\s*\d+)*\]/g);
  if (cites && cites.length > 0) {
    issues.push(`Atıf markerı kalıntısı (${cites.length} adet): ${cites.slice(0, 5).join(', ')}`);
  }

  // 2) AI tutoring kalıntıları
  if (/Hafıza Tekniği|Sokratik Soru|Sevgili doktora/i.test(text)) {
    issues.push('"Hafıza Tekniği" / "Sokratik Soru" / "Sevgili doktora" kalıntısı');
  }
  if (/Bu haftaki oturumumuz/i.test(text)) {
    issues.push('"Bu haftaki oturumumuz" tutoring intro kalıntısı');
  }
  // NotebookLM conversation marker'ları
  if (/^Resumed conversation:|^Continuing conversation|^Conversation:\s+[a-f0-9-]/m.test(text)) {
    issues.push('NotebookLM "conversation" marker kalıntısı');
  }
  if (/^Answer:\s*$/m.test(text)) {
    issues.push('"Answer:" prefix kalıntısı');
  }

  // 3) Sayfa numarası
  if (/\bs\.\s*\d+/i.test(text) || /\bsf\.\s*\d+/i.test(text)) {
    issues.push('Sayfa numarası kalıntısı (s. N veya sf. N)');
  }

  // 4) Şüpheli yazar — sadece "yazar atıfı kalıbı" durumunda uyar
  //    Yazar atıfı kalıpları: "Yazar, *Eser*", "Yazar/Yazar2", "Yazar'ın", "Yazar'a göre"
  for (const sus of SUSPECT_AUTHORS) {
    const patterns = [
      new RegExp(`\\b${sus}\\s*,\\s*\\*`),       // "Antalya, *Eser*"
      new RegExp(`\\b${sus}\\s*/\\s*[A-ZÇĞİÖŞÜ]`), // "Antalya/Diğer"
      new RegExp(`\\b${sus}'?ın\\s+(eserinde|görüşüne|sistematiğinde)`),
      new RegExp(`\\b${sus}'?ye?\\s+göre`),
      new RegExp(`\\bdoktrinde\\s+${sus}\\b`, 'i'),
    ];
    if (patterns.some((p) => p.test(text))) {
      issues.push(`Şüpheli/liste-dışı yazar atfı: "${sus}"`);
    }
  }

  // 5) Bölüm bütünlüğü (eksik bölüm → ISSUE, sadece uyarı değil)
  const expected = ['#### 1.', '#### 2.', '#### 3.', '#### 4.', '#### 5.', '#### 6.', '#### 7.'];
  for (const e of expected) {
    if (!text.includes(e)) {
      issues.push(`Bölüm eksik: ${e}`);
    }
  }
  if (!/### Metodolojik Not/.test(text)) {
    issues.push('### Metodolojik Not bölümü eksik');
  }

  // 5b) Minimum gövde uzunluğu (NotebookLM yanıtının yarıda kesilip kesilmediği kontrolü)
  // Yorum bölümü en az 2000 karakter olmalı
  const yorumStart = text.search(/### Akademik Yorum ve Analiz/);
  const metodolojikStart = text.search(/### Metodolojik Not/);
  if (yorumStart >= 0 && metodolojikStart > yorumStart) {
    const yorumBody = text.slice(yorumStart, metodolojikStart);
    if (yorumBody.length < 2000) {
      issues.push(`Yorum gövdesi çok kısa (${yorumBody.length} karakter) — NotebookLM yanıtı yarıda kesilmiş olabilir`);
    }
  }

  // 6) Frontmatter
  if (!/commentaryStatus:\s*"completed"/.test(text)) {
    issues.push('commentaryStatus="completed" yok');
  }
  if (!/lastReviewed:/.test(text)) {
    issues.push('lastReviewed yok');
  }

  // 7) Resmi metin korundu mu (Madde N - ...)
  if (!/^Madde \d+\s*-/m.test(text)) {
    warnings.push('Resmi madde metni ("Madde N -") bulunamadı — kontrol et');
  }

  return { issues, warnings };
}

function main() {
  const [, , filePath] = process.argv;
  if (!filePath) {
    console.error('Kullanım: node lint-madde.js <madde-dosyası>');
    process.exit(1);
  }
  const { issues, warnings } = lintFile(filePath);
  if (issues.length === 0 && warnings.length === 0) {
    console.log('✔ TEMİZ:', filePath);
    process.exit(0);
  }
  console.log('--- LINT RAPORU:', filePath, '---');
  for (const w of warnings) console.log('⚠  ', w);
  for (const i of issues) console.log('✘  ', i);
  process.exit(issues.length > 0 ? 1 : 0);
}

if (require.main === module) main();

module.exports = { lintFile };
