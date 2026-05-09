/**
 * Kanun Metni Parse ve Markdown Dosyası Oluşturma Scripti
 * 
 * Bu script, düz metin dosyalarından kanun maddelerini parse edip
 * content/mevzuat/ altında yapılandırılmış Markdown dosyaları oluşturur.
 * 
 * Kullanım: node scripts/parse-kanun.js
 */

const fs = require('fs');
const path = require('path');

// Kanun ID'sine göre hedef dizin
const OUTPUT_BASE = path.join(__dirname, '..', 'content', 'mevzuat');

// Kanun ID'sine göre kanun adları
const KANUN_NAMES = {
  tbk: 'Türk Borçlar Kanunu',
  tmk: 'Türk Medeni Kanunu',
  ttk: 'Türk Ticaret Kanunu',
};

/**
 * Metin içinden MADDE xxx- kalıbını bulup maddelere ayırır.
 * Her maddenin: no, başlık, metin alanları döner.
 */
function parseMaddeler(text, kanunId) {
  // Normalize whitespace
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // MADDE kalıbı: "MADDE  1-" veya "MADDE 1 -" veya "Madde 1 -" gibi varyasyonlar
  const maddeRegex = /MADDE\s+(\d+)\s*[-–—]/gi;
  
  const matches = [];
  let match;
  while ((match = maddeRegex.exec(normalized)) !== null) {
    matches.push({
      no: parseInt(match[1], 10),
      index: match.index,
      fullMatch: match[0],
    });
  }
  
  if (matches.length === 0) {
    console.log(`  ⚠ ${kanunId}: Hiç madde bulunamadı!`);
    return [];
  }
  
  console.log(`  ✓ ${kanunId}: ${matches.length} madde kalıbı bulundu`);
  
  const maddeler = [];
  
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const nextIndex = i + 1 < matches.length ? matches[i + 1].index : normalized.length;
    
    // Madde metnini al
    let maddeText = normalized.substring(current.index, nextIndex).trim();
    
    // İlk satırı kaldır (MADDE X - kısmı)
    const firstNewline = maddeText.indexOf('\n');
    let restOfText = firstNewline > -1 ? maddeText.substring(firstNewline + 1).trim() : '';
    
    // İlk satırdan da madde başlangıç bilgisini çıkar
    let firstLine = maddeText.substring(0, firstNewline > -1 ? firstNewline : maddeText.length);
    // "MADDE 1- Sözleşme, tarafların..." -> sonrası metin parçası
    const afterDash = firstLine.replace(/MADDE\s+\d+\s*[-–—]\s*/i, '').trim();
    if (afterDash) {
      restOfText = afterDash + '\n' + restOfText;
    }
    
    // Madde başlığını bulmaya çalış: maddeden önceki satırlara bak
    let baslik = `Madde ${current.no}`;
    
    // Önceki metinden başlık çıkar (madde'den önceki 5 satır)
    const beforeText = normalized.substring(
      i > 0 ? matches[i - 1].index + matches[i - 1].fullMatch.length : 0,
      current.index
    );
    const beforeLines = beforeText.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // Son anlamlı satırı başlık olarak al
    if (beforeLines.length > 0) {
      const lastLine = beforeLines[beforeLines.length - 1];
      // Bölüm, kısım, ayırım gibi yapısal başlıkları atla
      if (lastLine.length < 100 && 
          !lastLine.match(/^(BİRİNCİ|İKİNCİ|ÜÇÜNCÜ|DÖRDÜNCÜ|BEŞİNCİ|ALTINCI|YEDİNCİ|SEKİZİNCİ|DOKUZUNCU|ONUNCU)/i) &&
          !lastLine.match(/^(KISIM|BÖLÜM|AYIRIM|Genel|Özel)/i)) {
        baslik = lastLine;
      }
    }
    
    // Metni temizle
    restOfText = restOfText
      .split('\n')
      .map(line => line.trim())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    maddeler.push({
      no: current.no,
      baslik: baslik,
      metin: restOfText,
    });
  }
  
  // Duplicate madde numaralarını filtrele (sadece ilk geçeni al)
  const seen = new Set();
  const uniqueMaddeler = [];
  for (const m of maddeler) {
    if (!seen.has(m.no)) {
      seen.add(m.no);
      uniqueMaddeler.push(m);
    }
  }
  
  console.log(`  ✓ ${kanunId}: ${uniqueMaddeler.length} benzersiz madde`);
  return uniqueMaddeler;
}

/**
 * Maddeyi Markdown dosyasına yaz
 */
function writeMaddeFile(kanunId, madde) {
  const dir = path.join(OUTPUT_BASE, kanunId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const filename = `madde-${madde.no}.md`;
  const filepath = path.join(dir, filename);
  
  const kanunName = KANUN_NAMES[kanunId] || kanunId.toUpperCase();
  const idPrefix = kanunId.toUpperCase();
  
  const content = `---
title: "${idPrefix} Madde ${madde.no}"
kanun: "${kanunName}"
maddeNo: ${madde.no}
---

**${madde.baslik}**

---

Madde ${madde.no} - ${madde.metin}

---

### Bizim Yorumumuz

Bu maddeye ait akademik yorum ve analiz yakında eklenecektir.
`;

  fs.writeFileSync(filepath, content, 'utf8');
}

/**
 * PDF'den metin çıkar
 */
async function extractPdfText(pdfPath) {
  const pdfjsLib = await import('pdfjs-dist');
  const dataBuffer = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjsLib.getDocument({ data: dataBuffer }).promise;
  
  let fullText = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }
  return fullText;
}

/**
 * Ana fonksiyon
 */
async function main() {
  console.log('=== Kanun Metni Parse Scripti ===\n');
  
  const parentDir = path.join(__dirname, '..', '..');
  
  // 1. TBK - Metin dosyasından oku
  console.log('1. Türk Borçlar Kanunu (TBK)');
  const tbkTextPath = path.join(parentDir, 'türk borçlar kanunu_text.txt');
  if (fs.existsSync(tbkTextPath)) {
    const tbkText = fs.readFileSync(tbkTextPath, 'utf8');
    const tbkMaddeler = parseMaddeler(tbkText, 'tbk');
    
    // Mevcut dosyaları temizle
    const tbkDir = path.join(OUTPUT_BASE, 'tbk');
    if (fs.existsSync(tbkDir)) {
      const existingFiles = fs.readdirSync(tbkDir).filter(f => f.endsWith('.md'));
      existingFiles.forEach(f => fs.unlinkSync(path.join(tbkDir, f)));
      console.log(`  ✓ Mevcut ${existingFiles.length} dosya temizlendi`);
    }
    
    tbkMaddeler.forEach(m => writeMaddeFile('tbk', m));
    console.log(`  ✅ TBK: ${tbkMaddeler.length} madde dosyası oluşturuldu\n`);
  } else {
    console.log('  ⚠ TBK metin dosyası bulunamadı, PDF kullanılacak');
    const tbkPdfPath = path.join(parentDir, 'türk borçlar kanunu.pdf');
    if (fs.existsSync(tbkPdfPath)) {
      const tbkText = await extractPdfText(tbkPdfPath);
      const tbkMaddeler = parseMaddeler(tbkText, 'tbk');
      tbkMaddeler.forEach(m => writeMaddeFile('tbk', m));
      console.log(`  ✅ TBK: ${tbkMaddeler.length} madde dosyası oluşturuldu\n`);
    }
  }
  
  // 2. TMK - PDF'den çıkar
  console.log('2. Türk Medeni Kanunu (TMK)');
  const tmkPdfPath = path.join(parentDir, 'türk medeni kanunu.pdf');
  if (fs.existsSync(tmkPdfPath)) {
    const tmkText = await extractPdfText(tmkPdfPath);
    
    // Kaydet: debugging için
    fs.writeFileSync(path.join(parentDir, 'türk medeni kanunu_text.txt'), tmkText, 'utf8');
    console.log('  ✓ TMK metin dosyası kaydedildi');
    
    const tmkMaddeler = parseMaddeler(tmkText, 'tmk');
    
    // Mevcut dosyaları temizle
    const tmkDir = path.join(OUTPUT_BASE, 'tmk');
    if (fs.existsSync(tmkDir)) {
      const existingFiles = fs.readdirSync(tmkDir).filter(f => f.endsWith('.md'));
      existingFiles.forEach(f => fs.unlinkSync(path.join(tmkDir, f)));
    }
    
    tmkMaddeler.forEach(m => writeMaddeFile('tmk', m));
    console.log(`  ✅ TMK: ${tmkMaddeler.length} madde dosyası oluşturuldu\n`);
  } else {
    console.log('  ❌ TMK PDF bulunamadı!\n');
  }
  
  // 3. TTK - PDF'den çıkar
  console.log('3. Türk Ticaret Kanunu (TTK)');
  const ttkPdfPath = path.join(parentDir, 'türk ticart kanunu.pdf');
  if (fs.existsSync(ttkPdfPath)) {
    const ttkText = await extractPdfText(ttkPdfPath);
    
    // Kaydet
    fs.writeFileSync(path.join(parentDir, 'türk ticaret kanunu_text.txt'), ttkText, 'utf8');
    console.log('  ✓ TTK metin dosyası kaydedildi');
    
    const ttkMaddeler = parseMaddeler(ttkText, 'ttk');
    
    // TTK dizini oluştur
    const ttkDir = path.join(OUTPUT_BASE, 'ttk');
    if (!fs.existsSync(ttkDir)) {
      fs.mkdirSync(ttkDir, { recursive: true });
    }
    
    ttkMaddeler.forEach(m => writeMaddeFile('ttk', m));
    console.log(`  ✅ TTK: ${ttkMaddeler.length} madde dosyası oluşturuldu\n`);
  } else {
    console.log('  ❌ TTK PDF bulunamadı!\n');
  }
  
  // Özet
  console.log('=== ÖZET ===');
  ['tbk', 'tmk', 'ttk'].forEach(id => {
    const dir = path.join(OUTPUT_BASE, id);
    if (fs.existsSync(dir)) {
      const count = fs.readdirSync(dir).filter(f => f.endsWith('.md')).length;
      console.log(`  ${id.toUpperCase()}: ${count} madde`);
    } else {
      console.log(`  ${id.toUpperCase()}: dizin yok`);
    }
  });
}

main().catch(err => {
  console.error('Hata:', err);
  process.exit(1);
});
