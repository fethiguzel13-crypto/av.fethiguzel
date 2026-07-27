import fs from 'fs';
import path from 'path';

// Check commentary content depth (not just status)
const kanunlar = ['is-kanunu', 'ssgssk', 'sendikalar', 'isg', 'tkhk'];
const baseDir = 'c:/Users/HUAWEI/Desktop/internet/fethiguzel-portal/content/mevzuat';

for (const kanun of kanunlar) {
  const dir = path.join(baseDir, kanun);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  let shallow = [];
  let empty = [];
  
  for (const f of files) {
    const content = fs.readFileSync(path.join(dir, f), 'utf-8');
    
    // Check for actual commentary content
    const splitRegex = /\n### (?:Bizim Yorumumuz|Akademik Yorum ve Analiz)\s*\n/;
    const parts = content.split(splitRegex);
    let commentaryText = parts.length > 1 ? parts[1].trim() : '';
    
    if (!commentaryText || commentaryText === 'Bu maddeye ait akademik yorum ve analiz yakında eklenecektir.') {
      empty.push(f);
    } else if (commentaryText.length < 500) {
      shallow.push(f + ' (' + commentaryText.length + ' chars)');
    }
  }
  
  console.log(kanun + ': ' + files.length + ' madde');
  if (empty.length > 0) {
    console.log('  BOŞ ŞERH: ' + empty.join(', '));
  }
  if (shallow.length > 0) {
    console.log('  SIĞ ŞERH (<500 char): ' + shallow.join(', '));
  }
  if (empty.length === 0 && shallow.length === 0) {
    console.log('  Tümü dolu ve derin. OK.');
  }
}
