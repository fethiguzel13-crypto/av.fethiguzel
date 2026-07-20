import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const content = readFileSync('content/mevzuat/cek/madde-2.md', 'utf8').replace(/\r\n/g, '\n');
const body = content.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
const titleMatch = body.match(/^\*\*(.+?)\*\*/);
const title = titleMatch ? titleMatch[1] : '';
let articleText = body
    .replace(/^\*\*.+?\*\*\n\n---\n\n/, '')
    .replace(/\n\n### (?:Bizim Yorumumuz|Akademik Yorum ve Analiz)[\s\S]*$/, '')
    .trim();

// Sadece resmi metin (yorum placeholder'siz)
const offSplit = articleText.split(/\n\n### /);
articleText = offSplit[0].trim();

const base = `Sen Av. Fethi Güzel, Çek Kanunu uzmanısın. 7 bölümlü serh yaz.
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
Yazar ismi yazma, karar uydurma, soru sorma, [1] yok. En az 2500 karakter.
Çek Kanunu Madde 2 — ${title}
`;

const variants = [
    { name: 'short500', text: articleText.slice(0, 500) },
    { name: 'short1500', text: articleText.slice(0, 1500) },
    { name: 'full', text: articleText },
];

for (const v of variants) {
    const prompt = base + '\n' + v.text;
    const path = `logs/var-${v.name}.txt`;
    writeFileSync(path, prompt, 'utf8');
    console.log('\n===', v.name, 'prompt_len', prompt.length, 'art_len', v.text.length);
    const r = spawnSync(
        'python',
        ['scripts/nlm-ask.py', 'de987f9c-fd3a-4f9d-9e44-42d80b948318', path],
        { encoding: 'utf8', timeout: 300000, maxBuffer: 12 * 1024 * 1024 }
    );
    console.log('status', r.status, 'stderr', (r.stderr || '').slice(0, 120).replace(/\n/g, ' '));
    try {
        const j = JSON.parse((r.stdout || '').trim());
        console.log('answer_len', (j.answer || '').length);
    } catch {
        console.log('stdout', (r.stdout || '').slice(0, 150));
    }
    // rate limit nazikligi
    await new Promise(r => setTimeout(r, 5000));
}
