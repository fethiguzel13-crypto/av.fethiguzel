import fs from 'fs';
import path from 'path';

const kanunId = process.argv[2] || 'hmk';
const dir = path.join('./content/mevzuat', kanunId);

if (!fs.existsSync(dir)) {
  console.error(`Directory not found: ${dir}`);
  process.exit(1);
}

const files = fs.readdirSync(dir)
  .filter(f => f.startsWith('madde-') && f.endsWith('.md'))
  .filter(f => {
    const content = fs.readFileSync(path.join(dir, f), 'utf-8');
    return !content.includes('commentaryStatus: "completed"');
  })
  .map(f => {
    const num = parseInt(f.replace('madde-', '').replace('.md', ''), 10);
    return { name: f, num };
  })
  .sort((a, b) => a.num - b.num);

console.log(`Pending count for ${kanunId}: ${files.length}`);
console.log('First 20 pending maddeler:', files.slice(0, 20).map(f => f.num));
