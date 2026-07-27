/**
 * Dönemsel tarife / parametre hatırlatıcısı.
 * Her Ocak & Temmuz (ve izleme listesindeki aylar) uyarı dosyası üretir.
 *
 * Usage: node scripts/check-tarifeler.js
 * Exit 0 always (scheduler-friendly); writes logs/maintenance/tarife-YYYY-MM.md
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const changelogPath = join(ROOT, 'public/data/tarife-changelog.json');
const outDir = join(ROOT, 'logs/maintenance');

function main() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const iso = now.toISOString();

    mkdirSync(outDir, { recursive: true });

    let data = { watch: [], items: [], updatedAt: '' };
    if (existsSync(changelogPath)) {
        data = JSON.parse(readFileSync(changelogPath, 'utf8'));
    }

    const due = (data.watch || []).filter((w) => (w.months || []).includes(month));
    const alwaysNote = [
        '# Tarife kontrol raporu',
        '',
        `- Zaman: ${iso}`,
        `- Ay: ${month} / ${year}`,
        `- Changelog son güncelleme: ${data.updatedAt || '—'}`,
        '',
    ];

    if (!due.length) {
        const path = join(outDir, `tarife-${year}-${String(month).padStart(2, '0')}.md`);
        writeFileSync(
            path,
            alwaysNote.join('\n') +
            'Bu ay zorunlu izleme kalemi yok (yine de Resmî Gazete taranmalı).\n\n' +
            'İzleme listesi:\n' +
            (data.watch || []).map((w) => `- ${w.label}: ${w.hint}`).join('\n') +
            '\n',
            'utf8'
        );
        console.log(`[check-tarifeler] no due items for month ${month} → ${path}`);
        return;
    }

    const lines = [
        ...alwaysNote,
        '## Bu ay kontrol edilmesi gerekenler',
        '',
        ...due.map(
            (w) =>
                `### ${w.label}\n- Anahtar: \`${w.key}\`\n- ${w.hint}\n- Aksiyon: \`public/data/tarife-changelog.json\` + ilgili hesaplama aracı parametrelerini güncelleyin.\n`
        ),
        '',
        '## Kontrol listesi',
        '',
        '- [ ] Resmî Gazete / tebliğ okundu',
        '- [ ] `components/hesaplama/HesaplamaTools.tsx` sabitleri güncellendi',
        '- [ ] `public/data/tarife-changelog.json` yeni kayıt eklendi',
        '- [ ] Deploy',
        '',
        'Otomatik e-posta yok; bu dosya ve Windows görev zamanlayıcısı hatırlatır.',
        '',
    ];

    const path = join(outDir, `tarife-${year}-${String(month).padStart(2, '0')}.md`);
    writeFileSync(path, lines.join('\n'), 'utf8');

    // Sticky "ACTION REQUIRED" flag for month
    writeFileSync(
        join(outDir, 'TARIFE-ACTION-REQUIRED.txt'),
        `Tarife kontrolü gerekli: ${year}-${month}\nDetay: ${path}\n`,
        'utf8'
    );

    console.log(`[check-tarifeler] DUE ${due.length} items → ${path}`);
    console.log('[check-tarifeler] FLAG logs/maintenance/TARIFE-ACTION-REQUIRED.txt');
}

main();
