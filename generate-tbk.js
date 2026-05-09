const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'content', 'mevzuat', 'tbk');

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Generating TBK files 1 to 206...');

for (let i = 1; i <= 206; i++) {
    // Skip 49 since we already created a detailed version of it
    if (i === 49) continue;

    const content = `---
title: "TBK Madde ${i}"
kanun: "Türk Borçlar Kanunu"
maddeNo: ${i}
---

Buraya TBK Madde ${i} metnini ekleyebilirsiniz.

### Bizim Yorumumuz

Buraya Yargıtay kararlarını ve hukuki analizlerinizi ekleyebilirsiniz.
`;

    const filePath = path.join(outputDir, `madde-${i}.md`);
    fs.writeFileSync(filePath, content, 'utf8');
}

console.log('Successfully generated TBK files.');
