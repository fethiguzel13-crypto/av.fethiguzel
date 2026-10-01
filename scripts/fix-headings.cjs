/**
 * Başlık Kaydırma Düzeltme Scripti
 * 
 * Sorun: PDF parse sırasında, bir sonraki maddeye ait olan konu başlıkları
 * (A., B., I., II., 1., 2., a., b. vb.) mevcut maddenin sonuna yapışmış durumda.
 * 
 * Çözüm: Her maddenin metin kısmının sonundaki başlık ibarelerini tespit edip
 * bir sonraki maddenin başlığı olarak taşı.
 * 
 * Kullanım: node scripts/fix-headings.js
 */

const fs = require('fs');
const path = require('path');

const CONTENT_BASE = path.join(__dirname, '..', 'content', 'mevzuat');

/**
 * Türk mevzuat hiyerarşisindeki başlık kalıpları
 * Bu kalıplar bir maddenin sonunda tespit edildiğinde, bir sonraki maddeye taşınır.
 * 
 * Örnekler:
 * - "B. Hukukî ilişkilerin kapsamı"
 * - "I. Dürüst davranma" 
 * - "II. İyiniyet"
 * - "1. Genel olarak"
 * - "a. Hazır olanlar arasında"
 * - "A) Ticari İşletme"
 * - "B)   Tacir  I   -   Gerçek   kişiler  1.   Genel   olarak"
 * - Büyük harf ile başlayan yapısal başlıklar
 */

// TMK/TTK: Satır içi başlıklar (tek satırda birleşik)
// "B. Hukukî ilişkilerin kapsamı  I. Dürüst davranma"
// "B)   Tacir  I   -   Gerçek   kişiler  1.   Genel   olarak"

// TBK: Her biri ayrı satırda
// "II. Öneri ve kabul"
// "1. Süreli öneri"

/**
 * Metindeki trailing başlıkları tespit et ve ayır.
 * 
 * Strateji:
 * 1. Metni satırlara böl
 * 2. Son satır(lar)dan trailing heading pattern'i bul
 * 3. TMK/TTK için tek satırdaki birleşik başlıkları da tespit et
 */
function detectAndSplitTrailingHeadings(text) {
  if (!text || text.trim().length === 0) return { cleanText: text, headings: [] };
  
  const trimmed = text.trim();
  
  // TMK/TTK satır-içi pattern: metin sonunda başlık kalıpları var
  // Örn: "...korumaz.  II. İyiniyet"
  // Örn: "...belirlenir.  B)   Tacir  I   -   Gerçek   kişiler  1.   Genel   olarak"
  
  // Çok satırlı mı tek satırlı mı kontrol et
  const lines = trimmed.split('\n');
  
  let cleanLines = [];
  let headingLines = [];
  let foundHeadingStart = false;
  
  // Sondan başa doğru tara
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line.length === 0) {
      if (foundHeadingStart) {
        headingLines.unshift('');
      } else {
        cleanLines.unshift(lines[i]);
      }
      continue;
    }
    
    if (!foundHeadingStart && isStandaloneHeadingLine(line)) {
      foundHeadingStart = true;
      headingLines.unshift(line);
    } else if (foundHeadingStart && isStandaloneHeadingLine(line)) {
      headingLines.unshift(line);
    } else {
      // Bu satır normal metin - ama sonunda inline heading olabilir
      const inlineResult = extractInlineHeadings(line);
      if (inlineResult.headings.length > 0) {
        cleanLines.unshift(inlineResult.cleanText);
        headingLines = [...inlineResult.headings, ...headingLines];
        foundHeadingStart = true;
      } else {
        cleanLines.unshift(lines[i]);
      }
      // Daha yukarıya bakmayı bırak
      for (let j = i - 1; j >= 0; j--) {
        cleanLines.unshift(lines[j]);
      }
      break;
    }
  }
  
  // Eğer tüm satırlar heading ise, bir şey yapma (bu maddenin kendisi)
  if (cleanLines.length === 0 && headingLines.length > 0) {
    return { cleanText: trimmed, headings: [] };
  }
  
  return {
    cleanText: cleanLines.join('\n').trim(),
    headings: headingLines.filter(h => h.trim().length > 0),
  };
}

/**
 * Bağımsız başlık satırı mı kontrol et
 * Örn: "II. Öneri ve kabul", "1. Süreli öneri", "a. Hazır olanlar arasında"
 */
function isStandaloneHeadingLine(line) {
  const trimmed = line.trim();
  
  // Boş satır değilse ve çok kısa metin değilse
  if (trimmed.length === 0) return false;
  
  // Büyük harf + nokta/parantez kalıbı: "A.", "B.", "C)", "A)"
  if (/^[A-Z]\)\s+/.test(trimmed)) return true;
  if (/^[A-ZÇĞIÖŞÜ]\.\s+/.test(trimmed) && trimmed.length < 100) return true;
  
  // Roma rakamı: "I.", "II.", "III.", "IV.", "V.", "VI.", "VII.", "VIII.", "IX.", "X."
  // Ayrıca "I -", "II -" gibi TTK formatları
  if (/^(X{0,3})(IX|IV|V?I{0,3})\s*[\.\-–]\s+/i.test(trimmed) && trimmed.length < 100) {
    // "İ" ile başlayan Türkçe kelimeleri filtrele
    if (/^İ[a-zçğıöşü]/.test(trimmed)) return false;
    return true;
  }
  
  // Küçük harf + nokta/parantez: "a.", "b.", "c)"
  if (/^[a-z]\)\s+/.test(trimmed) && trimmed.length < 100) return true;
  if (/^[a-zçğıöşü]\.\s+/.test(trimmed) && trimmed.length < 80) return true;
  
  // Rakam + nokta: "1.", "2.", "3." (TBK formatı)
  if (/^\d+\.\s+/.test(trimmed) && trimmed.length < 100) return true;
  
  // TTK tarzı birleşik: "B)   Tacir  I   -   Gerçek..."
  if (/^[A-Z]\)\s{2,}/.test(trimmed) && trimmed.length < 150) return true;
  
  return false;
}

/**
 * Satır sonundaki inline başlıkları çıkar
 * Örn: "...korumaz.  II. İyiniyet" → cleanText: "...korumaz.", headings: ["II. İyiniyet"]
 * Örn: "...yararlanır.  B. Hukukî ilişkilerin kapsamı  I. Dürüst davranma"
 */
function extractInlineHeadings(line) {
  const trimmed = line.trim();
  
  // Patterns to match at end of line (after sentence ending punctuation)
  // TMK pattern: "...metin.  B. Başlık  I. Alt başlık"
  // TBK pattern: "...metin.  2. İkinci derecedeki noktalar"
  // TTK pattern: "...metin.  B)   Tacir  I   -   Gerçek   kişiler"
  
  // Cümle sonu + ardından gelen heading pattern
  // Nokta/soru/ünlem + 2+ boşluk + heading kalıbı
  const patterns = [
    // Büyük harf roman: "  I.", "  II.", "  III.", "  IV.", "  V."
    /(\.\s{2,})((?:X{0,3}(?:IX|IV|V?I{0,3}))\s*[\.\-–]\s+.+)$/i,
    // Büyük harf + nokta: "  B. Hukukî..."
    /(\.\s{2,})([A-ZÇĞIÖŞÜ]\.\s+.+)$/,
    // Büyük harf + parantez: "  B)   Tacir..."
    /(\.\s{2,})([A-Z]\)\s+.+)$/,
    // Rakam + nokta: "  2. İkinci..."
    /(\.\s{2,})(\d+\.\s+.+)$/,
    // Küçük harf + nokta/parantez
    /(\.\s{2,})([a-zçğıöşü][\.\)]\s+.+)$/,
  ];
  
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) {
      const cleanText = trimmed.substring(0, match.index + 1); // include the period
      const headingPart = match[2].trim();
      
      // Heading kısmını alt başlıklara ayır
      const subHeadings = splitCombinedHeadings(headingPart);
      
      return {
        cleanText: cleanText,
        headings: subHeadings,
      };
    }
  }
  
  return { cleanText: trimmed, headings: [] };
}

/**
 * Birleşik başlıkları alt alta ayır
 * "B. Hukukî ilişkilerin kapsamı  I. Dürüst davranma" → 
 *   ["B. Hukukî ilişkilerin kapsamı", "I. Dürüst davranma"]
 * "B)   Tacir  I   -   Gerçek   kişiler  1.   Genel   olarak" →
 *   ["B) Tacir", "I - Gerçek kişiler", "1. Genel olarak"]
 */
function splitCombinedHeadings(text) {
  // Fazla boşlukları normalleştir
  let normalized = text.replace(/\s{2,}/g, ' ').trim();
  
  const results = [];
  let remaining = normalized;
  
  // İteratif olarak başlık kalıplarını bul
  while (remaining.length > 0) {
    // Bir sonraki başlık kalıbını bul (ilk kalıp hariç)
    const nextPattern = findNextHeadingStart(remaining, 1);
    
    if (nextPattern === -1) {
      results.push(remaining.trim());
      break;
    } else {
      results.push(remaining.substring(0, nextPattern).trim());
      remaining = remaining.substring(nextPattern);
    }
  }
  
  return results.filter(r => r.length > 0);
}

/**
 * Metinde belirli bir ofset sonrasındaki ilk başlık kalıbının indeksini bul
 */
function findNextHeadingStart(text, startOffset) {
  const patterns = [
    /\s(?=[A-ZÇĞIÖŞÜ]\.\s)/g,          // "B. Hukukî..."
    /\s(?=[A-Z]\)\s)/g,                  // "B) Tacir..."
    /\s(?=(?:X{0,3}(?:IX|IV|V?I{0,3}))\s*[\.\-–]\s)/gi,  // "I.", "II -"
    /\s(?=\d+\.\s)/g,                    // "1. Genel..."
    /\s(?=[a-zçğıöşü][\.\)]\s)/g,       // "a. hazır..."
  ];
  
  let minIndex = -1;
  
  for (const pattern of patterns) {
    pattern.lastIndex = startOffset;
    const match = pattern.exec(text);
    if (match && (minIndex === -1 || match.index < minIndex)) {
      // "İ" ile başlayan Türkçe kelimeleri filtrele
      const afterMatch = text.substring(match.index + 1);
      if (/^İ[a-zçğıöşü]/.test(afterMatch)) continue;
      
      minIndex = match.index + 1; // +1 to skip the space
    }
  }
  
  return minIndex;
}

/**
 * Bir kanun dizinindeki tüm maddeleri düzelt
 */
function fixKanun(kanunId) {
  const dir = path.join(CONTENT_BASE, kanunId);
  if (!fs.existsSync(dir)) {
    console.log(`  ❌ ${kanunId.toUpperCase()} dizini bulunamadı`);
    return;
  }
  
  // Tüm madde dosyalarını oku ve numaraya göre sırala
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') && f.startsWith('madde-'))
    .sort((a, b) => {
      const numA = parseInt(a.replace('madde-', '').replace('.md', ''), 10);
      const numB = parseInt(b.replace('madde-', '').replace('.md', ''), 10);
      return numA - numB;
    });
  
  console.log(`  📁 ${files.length} dosya okunuyor...`);
  
  // Tüm dosyaları oku
  const articles = files.map(f => {
    const filepath = path.join(dir, f);
    const content = fs.readFileSync(filepath, 'utf8');
    const maddeNo = parseInt(f.replace('madde-', '').replace('.md', ''), 10);
    return { filename: f, filepath, content, maddeNo };
  });
  
  let fixCount = 0;
  
  // Her maddeyi işle: sonundaki başlıkları tespit et, bir sonrakine taşı
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const content = article.content;
    
    // Markdown yapısını parse et:
    // ---\nfrontmatter\n---\n\n**Başlık**\n\n---\n\nMetin\n\n---\n\n### Bizim Yorumumuz...
    const parts = content.split('---');
    // parts[0] = "" (before first ---)
    // parts[1] = frontmatter
    // parts[2] = "\n\n**Başlık**\n\n" 
    // parts[3] = "\n\nMetin\n\n"
    // parts[4] = "\n\n### Bizim Yorumumuz..."
    
    if (parts.length < 4) continue;
    
    const frontmatter = parts[1];
    const headingSection = parts[2]; // **Başlık** bölümü
    const textSection = parts[3];    // Madde metni
    const restParts = parts.slice(4); // ### Bizim Yorumumuz vb.
    
    // Metin bölümünden trailing başlıkları çıkar
    const { cleanText, headings } = detectAndSplitTrailingHeadings(textSection.trim());
    
    if (headings.length > 0) {
      fixCount++;
      
      // Mevcut maddeyi temizle (trailing headings kaldır)
      const newContent = [
        '',
        `---`,
        frontmatter,
        `---`,
        headingSection,
        `---`,
        `\n${cleanText}\n`,
        `---`,
        ...restParts.map((p, idx) => idx < restParts.length - 1 ? p + '---' : p),
      ].join('');
      
      // Aslında daha temiz bir rebuild yapalım
      const rebuiltCurrent = rebuildFile(frontmatter, headingSection.trim(), cleanText);
      fs.writeFileSync(article.filepath, rebuiltCurrent, 'utf8');
      
      // Bir sonraki maddenin başlığını güncelle (eğer varsa)
      if (i + 1 < articles.length) {
        const nextArticle = articles[i + 1];
        const nextContent = nextArticle.content;
        const nextParts = nextContent.split('---');
        
        if (nextParts.length >= 4) {
          const nextFrontmatter = nextParts[1];
          const nextTextSection = nextParts[3];
          
          // Yeni başlığı birleştir: taşınan headings alt alta
          const newHeading = headings.join('\n');
          
          const rebuiltNext = rebuildFile(nextFrontmatter, newHeading, nextTextSection.trim());
          fs.writeFileSync(nextArticle.filepath, rebuiltNext, 'utf8');
          
          // Bellekteki içeriği de güncelle (zincir düzeltmeler için)
          articles[i + 1].content = rebuiltNext;
        }
      }
      
      if (fixCount <= 5) {
        console.log(`  ✏️  Madde ${article.maddeNo}: ${headings.length} başlık → Madde ${i + 1 < articles.length ? articles[i + 1].maddeNo : '?'}'e taşındı`);
        headings.forEach(h => console.log(`     └─ "${h}"`));
      }
    }
  }
  
  console.log(`  ✅ ${kanunId.toUpperCase()}: ${fixCount} madde düzeltildi\n`);
  return fixCount;
}

/**
 * Markdown dosyasını yeniden oluştur
 */
function rebuildFile(frontmatter, heading, text) {
  // Mevcut ** işaretlerini temizle (çift bold önleme)
  const cleanHeading = heading.replace(/^\*+|\*+$/gm, '').trim();
  
  return `---${frontmatter}---

**${cleanHeading}**

---

${text}

---

### Bizim Yorumumuz

Bu maddeye ait akademik yorum ve analiz yakında eklenecektir.
`;
}

// === ANA ÇALIŞTIRMA ===
console.log('=== Başlık Kaydırma Düzeltme Scripti ===\n');

let totalFixes = 0;
for (const kanunId of ['tbk', 'tmk', 'ttk']) {
  console.log(`📘 ${kanunId.toUpperCase()} işleniyor...`);
  totalFixes += fixKanun(kanunId) || 0;
}

console.log(`=== TOPLAM: ${totalFixes} madde düzeltildi ===`);
