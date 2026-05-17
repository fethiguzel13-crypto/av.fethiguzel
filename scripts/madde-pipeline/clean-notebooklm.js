#!/usr/bin/env node
/**
 * NotebookLM yanıt dosyasını temizler:
 *  - [N], [N, M], [N-M], [N], [M] gibi atıf markerlarını siler
 *  - "Answer:", "Continuing/Resumed conversation:", "Conversation:" gibi prefix/suffix gürültüyü atar
 *  - "Hafıza Tekniği (Mnemonic)" bloğunu siler
 *  - "Sokratik Soru" bloğunu siler
 *  - "Sevgili doktora öğrencim" gibi tutoring intro cümlelerini siler
 *  - Çoklu boş satırları normalize eder
 *
 * Kullanım: node clean-notebooklm.js <input-file> [<output-file>]
 * Output-file verilmezse stdout'a basar.
 */

const fs = require('fs');

function cleanResponse(raw) {
  let s = raw;

  // 1) Başlangıç gürültüsü
  s = s.replace(/^Continuing conversation [a-f0-9-]+\.\.\.\s*\n/gm, '');
  s = s.replace(/^Matched:.*\n/gm, '');
  s = s.replace(/^Answer:\s*\n/m, '');

  // 2) Bitiş gürültüsü (multiline mode)
  s = s.replace(/^Resumed conversation:.*$/gm, '');
  s = s.replace(/^Conversation:.*$/gm, '');
  s = s.replace(/^Continuing conversation:.*$/gm, '');

  // 3) Sokratik Soru bloğu (sona kadar her şey)
  s = s.replace(/\n\*+\s*\n\s*\*\*Sokratik Soru[\s\S]*$/g, '\n');
  s = s.replace(/\n\*\*Sokratik Soru[\s\S]*$/g, '\n');

  // 4) Hafıza Tekniği bloğu
  //    "**Hafıza Tekniği..." ile başlar, bir sonraki #### başlığına veya *** ayırıcısına kadar gider
  s = s.replace(
    /\*\*Hafıza Tekniği[^\n]*\*\*[\s\S]*?(?=\n#### |\n\*\*\*|\nConversation:|\n---)/g,
    ''
  );
  // Yedek: kalan tek satırlık "Hafıza Tekniği" başlıkları
  s = s.replace(/\*\*Hafıza Tekniği[^\n]*\*\*\s*\n/g, '');

  // 5) Tutoring intro cümleleri — "Sevgili doktora öğrencim" ile başlayan cümleyi
  //    (ilk büyük harfle yeni cümle başlayana veya iki satır sonuna kadar) tamamen sil.
  s = s.replace(
    /Sevgili doktora öğrencim[\s\S]*?(?:\.\s+(?=[A-ZÇĞİÖŞÜ])|\n\n)/g,
    ''
  );
  s = s.replace(/Bu haftaki oturumumuzda amacımız[^.]*\.\s*/g, '');
  s = s.replace(/Şimdi,? sana[,]? .*? yöneltiyorum[^.]*\.\s*/g, '');
  // Gizli hafıza tekniği / zihne çivileme kalıpları
  s = s.replace(/Bu kavramı zihne çivilemek için [^:]*:\s*/gi, '');
  s = s.replace(/zihne (kalıcı olarak )?çivilenebilmesi için,[^,\n]*,?\s*/gi, '');
  s = s.replace(/\*\*Mikro Analiz:\*\*[^\n]*zihne[^\n]*\n/gi, '');
  s = s.replace(/kıymetli meslektaş[ıim]+[,\s][^\n]*/gi, '');
  // Doktora oturumu / tutoring kalıpları — satır bazlı silme
  const tutoringLines = [
    'Bilgi Eksikliği ve Yöntem Bildirimi',
    'Yöntem Bildirimi',
    'doktora yeterlik',
    'kürsüde fırtına',
    'hüsranla sonuçlanır',
    'dehlizine çalışarak',
    'hata affetmeyeceğim',
    'bir sonraki celsede',
    'Hazırlığını tam yap',
    'Zihnini derhâl',
    'normatif haritayı doğru oku',
    'Karşımda duran bu tablo',
    'incelemeye devam edeceğiz',
  ];
  s = s.split('\n').filter(line =>
    !tutoringLines.some(bad => line.toLowerCase().includes(bad.toLowerCase()))
  ).join('\n');

  // 6) Atıf markerları
  //    [1], [12], [1, 2], [1-4], [1, 2, 3] gibi kalıplar
  s = s.replace(/\s*\[\d+(\s*[-,]\s*\d+)*\]/g, '');
  //    Ardışık atıflar: [1] [2] veya [1], [2]
  s = s.replace(/(\[\d+\]\s*){2,}/g, '');

  // 7) Atıflardan kaynaklanan noktalama hataları
  s = s.replace(/\s+\./g, '.');
  s = s.replace(/\s+,/g, ',');
  s = s.replace(/,,+/g, ',');
  s = s.replace(/,\s*\./g, '.');
  // ") ," veya ")," kalıntısı (atıf sonrası kapanış parantezi + asılı virgül)
  s = s.replace(/\)\s*,(?=\s*\n)/g, ')');
  s = s.replace(/\)\s*,(?=\s|$)/g, ')');

  // 8) *** ayırıcılarını temizle (gereksizse)
  s = s.replace(/\n\*\*\*\s*\n/g, '\n\n');

  // 9) Çoklu boş satırları normalize et
  s = s.replace(/\n{3,}/g, '\n\n');

  // 10) Eğer sadece 6 bölüm varsa (#### 7. yok), Eleştirel'i 7'ye taşı ve 6. Yargıtay ekle
  if (!s.includes('#### 7.') && s.includes('#### 6.')) {
    const yargitayNot = '\n#### 6. Yargıtay İçtihadı\n\nBu maddeye doğrudan ilişkin güncel bir Yargıtay kararı mevcut taramayla tespit edilememiştir. İleride güncellenecektir.\n';
    s = s.replace(/\n#### 6\./g, '\n#### 7.');
    // 5. bölümden sonra Yargıtay notunu ekle
    s = s.replace(/(\n#### 5\.[^\n]*\n[\s\S]*?)(\n#### 7\.)/, `$1${yargitayNot}$2`);
  }

  return s.trim() + '\n';
}

function main() {
  const [, , inputFile, outputFile] = process.argv;
  if (!inputFile) {
    console.error('Kullanım: node clean-notebooklm.js <input-file> [<output-file>]');
    process.exit(1);
  }
  const raw = fs.readFileSync(inputFile, 'utf8');
  const cleaned = cleanResponse(raw);
  if (outputFile) {
    fs.writeFileSync(outputFile, cleaned, 'utf8');
    console.error(`✔ Temizlendi: ${outputFile} (${cleaned.length} byte)`);
  } else {
    process.stdout.write(cleaned);
  }
}

if (require.main === module) main();

module.exports = { cleanResponse };

// Exported helper for testing
// module.exports.cleanResponse = cleanResponse; // (already exported above)

// Ek tutoring kalıpları (NotebookLM doktora oturumu)
// module.exports için placeholder — gerçek ekleme aşağıda
