import fs from 'fs';
import path from 'path';

const baseDir = './content/mevzuat';
const categories = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());

for (const cat of categories) {
  const dir = path.join(baseDir, cat);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  const incomplete = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    if (!content.includes('commentaryStatus: "completed"')) {
      incomplete.push(file);
    }
  }
  if (incomplete.length > 0) {
    console.log(`Kanun: ${cat} - Incomplete files count: ${incomplete.length}`);
    console.log(`First few: ${incomplete.slice(0, 10).join(', ')}`);
  }
}
