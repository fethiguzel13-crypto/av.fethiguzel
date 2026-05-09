const fs = require('fs');
const path = require('path');

const textPath = 'c:\\Users\\HUAWEI\\Desktop\\internet\\türk borçlar kanunu_text.txt';
const content = '\n' + fs.readFileSync(textPath, 'utf8');

// Match \nMADDE (\d+) - or \nMADDE (\d+)-
// We want to make sure it's strictly MADDE and not GEÇİCİ MADDE.
const regex = /\nMADDE\s+(\d+)\s*-\s*([\s\S]*?)(?=\nMADDE\s+\d+\s*-|\nGEÇİCİ MADDE|\nEK MADDE|$)/g;

const articles = {};

let match;
while ((match = regex.exec(content)) !== null) {
    const maddeNo = parseInt(match[1], 10);
    let maddeText = match[2];
    
    // Some basic cleanup
    maddeText = maddeText.trim();
    // Remove short heading lines at the end before the next match
    const lastPeriodIndex = maddeText.lastIndexOf('.');
    if (lastPeriodIndex !== -1 && lastPeriodIndex > maddeText.length - 150) {
        maddeText = maddeText.substring(0, lastPeriodIndex + 1);
    }
    
    // Don't overwrite if it already exists, unless we have to, but since we go in order, the last one might be an accident? No, with strict "\nMADDE", we avoid GEÇİCİ.
    articles[maddeNo] = maddeText;
}

const outputDir = 'c:\\Users\\HUAWEI\\Desktop\\internet\\fethiguzel-portal\\content\\mevzuat\\tbk';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

let updatedCount = 0;

for (let i = 1; i <= 649; i++) {
    if (!articles[i]) {
        console.log(`Madde ${i} bulunamadı!`);
        continue;
    }
    
    const filePath = path.join(outputDir, `madde-${i}.md`);
    
    let maddeIcerik = articles[i];
    maddeIcerik = maddeIcerik.replace(/\n(?!\n)/g, ' '); // Join lines that are not separated by empty lines
    maddeIcerik = maddeIcerik.replace(/\s{2,}/g, ' '); // Remove multiple spaces
    
    const mdContent = `---
title: "TBK Madde ${i}"
kanun: "Türk Borçlar Kanunu"
maddeNo: ${i}
---

${maddeIcerik}

### Bizim Yorumumuz

Buraya Yargıtay kararlarını ve hukuki analizlerinizi ekleyebilirsiniz.
`;
    fs.writeFileSync(filePath, mdContent, 'utf8');
    updatedCount++;
}

console.log(`Güncellenen/Oluşturulan dosya sayısı: ${updatedCount}`);
