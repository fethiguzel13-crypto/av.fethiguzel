import { generateCard } from './scripts/lib/instagram-card-writer.js';
import { generateCardHeadlines } from './scripts/lib/instagram-caption-writer.js';
import { copyFileSync } from 'node:fs';

const res = await fetch('https://avfethiguzel.com/data/daily.json');
const data = await res.json();
const h = data.highlights[0];
console.log('Using highlight:', h.id);

const [headline] = await generateCardHeadlines([h]);
console.log('Headline:', headline);

const imgPath = await generateCard({ ...h, cardText: headline });
copyFileSync(imgPath, 'C:\\Users\\HUAWEI\\Desktop\\ig-preview.png');
console.log('Preview: C:\\Users\\HUAWEI\\Desktop\\ig-preview.png');
