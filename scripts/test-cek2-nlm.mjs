import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const content = readFileSync('content/mevzuat/cek/madde-2.md', 'utf8').replace(/\r\n/g, '\n');
const body = content.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
const titleMatch = body.match(/^\*\*(.+?)\*\*/);
const title = titleMatch ? titleMatch[1] : '';
const articleText = body
    .replace(/^\*\*.+?\*\*\n\n---\n\n/, '')
    .replace(/\n\n### (?:Bizim Yorumumuz|Akademik Yorum ve Analiz)[\s\S]*$/, '')
    .trim();

const prompt = `Sen Av. Fethi Güzel'sin; Çek Kanunu uzmanı Türk hukukçusun.
7 bölümlü akademik şerh yaz. Şu başlıklarla başla ve bitir:

### Akademik Yorum ve Analiz
#### 1. Maddenin Sistematiği ve Genel Açıklama
#### 2. Maddedeki Kavramların Analizi
#### 3. Sistematik İlişkiler
#### 4. Uygulama: Yargı İçtihadı
#### 5. Pratik Örnek Olaylar
#### 6. Pratik Uygulama Notları
#### 7. Eleştirel Değerlendirme
---
### Metodolojik Not

Kurallar: Karar UYDURMA. Yazar ismi YAZMA. [1] kullanma. (kurmaca senaryo). Soru sorma. En az 2500 karakter.

---
Aşağıdaki madde için eksiksiz akademik şerh yaz. ### Akademik Yorum ve Analiz başlığıyla başlat.

Çek Kanunu Madde 2 — ${title}

${articleText}`;

writeFileSync('logs/full-cek2-prompt.txt', prompt, 'utf8');
console.log('prompt_len', prompt.length);

const r = spawnSync(
    'python',
    ['scripts/nlm-ask.py', 'de987f9c-fd3a-4f9d-9e44-42d80b948318', 'logs/full-cek2-prompt.txt'],
    { encoding: 'utf8', timeout: 300000, maxBuffer: 12 * 1024 * 1024 }
);
console.log('status', r.status);
console.log('stderr', (r.stderr || '').slice(0, 400));
console.log('stdout_len', (r.stdout || '').length);
console.log((r.stdout || '').slice(0, 300));
