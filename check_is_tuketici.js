import fs from 'fs';
import path from 'path';

const kanunlar = ['is-kanunu', 'ssgssk', 'sendikalar', 'isg', 'tkhk'];
const baseDir = 'c:/Users/HUAWEI/Desktop/internet/fethiguzel-portal/content/mevzuat';

for (const kanun of kanunlar) {
  const dir = path.join(baseDir, kanun);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  let completed = 0;
  let pending = [];
  
  for (const f of files) {
    const content = fs.readFileSync(path.join(dir, f), 'utf-8');
    const statusMatch = content.match(/commentaryStatus:\s*"([^"]+)"/);
    const status = statusMatch ? statusMatch[1] : 'unknown';
    if (status === 'completed') {
      completed++;
    } else {
      pending.push(f);
    }
  }
  
  console.log(kanun + ': ' + completed + '/' + files.length + ' tamamlandi, ' + pending.length + ' bekliyor');
  if (pending.length > 0 && pending.length <= 20) {
    console.log('  Bekleyen: ' + pending.join(', '));
  } else if (pending.length > 20) {
    console.log('  Bekleyen (ilk 20): ' + pending.slice(0, 20).join(', '));
  }
}
