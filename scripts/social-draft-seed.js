/**
 * High-quality seed drafts without LLM (when API quotas fail).
 * Usage: node scripts/social-draft-seed.js
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateCard } from './lib/instagram-card-writer.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');
const OUT_DIR = join(ROOT, 'logs', 'social-drafts');

const date = new Date().toISOString().slice(0, 10);

const ITEMS = [
    {
        topic: {
            id: 'mevzuat-tbk-112',
            source: 'TBK',
            title: 'TBK m. 112 — Borçlunun temerrüdü',
            kunye: 'TBK m. 112',
            url: 'https://avfethiguzel.com/mevzuat/tbk/madde-112',
            publicSummary:
                'Borçlu, muaccel borcunu ifa etmezse temerrüde düşer; alacaklı ifa, zarar ve şartları varsa dönme yollarını değerlendirir.',
        },
        tweet:
            'TBK m. 112: Borç muaccel olduktan sonra ifa edilmezse temerrüt doğabilir. Alacaklı ifayı isteme, gecikme zararını talep etme ve şartları oluşmuşsa sözleşmeden dönme seçeneklerini birlikte düşünür.\n\navfethiguzel.com/mevzuat/tbk/madde-112\n#hukuk #TBK',
        cardHeadline: 'Borç vadesi geçtiğinde temerrüt ve alacaklının seçenekleri netleşir.',
        instagramCaption: `TBK m. 112, borçlunun temerrüdünü düzenler.

Borç muaccel olduktan sonra ifa edilmezse temerrüt gündeme gelebilir. Alacaklı bakımından tablo genelde üçlüdür: ifanın istenmesi, gecikmeden doğan zararın talep edilmesi ve —sözleşme ile kanunun aradığı şartlar oluşmuşsa— sözleşmeden dönme.

Uygulamada kritik olan, vadenin ve ihtarın (gerekiyorsa) doğru tesbitidir. Genel bilgilendirmedir; somut dosyada süre ve delil durumu ayrı değerlendirilir.

avfethiguzel.com/mevzuat/tbk/madde-112

#hukuk #TBK #borçlarhukuku`,
        youtubeScript: `Bugün kısa bir not: borçlu temerrüdü.

TBK’nın 112. maddesi, muaccel borcun ifa edilmemesi hâlinde temerrüdü konu alır. Alacaklı yalnızca “bekleyip durmak” zorunda değildir; ifayı talep edebilir, gecikme zararını gündeme getirebilir, şartları varsa sözleşmeden dönebilir.

Dikkat edilmesi gereken, vadenin ne zaman dolduğu ve kanun veya sözleşmenin ihtar arayıp aramadığıdır. Bu genel bir çerçevedir; her dosyanın delil ve süre hesabı ayrıdır.

Metin ve şerh: avfethiguzel.com`,
    },
    {
        topic: {
            id: 'mevzuat-is-17',
            source: 'İşK',
            title: 'İş Kanunu m. 17 — Bildirimli fesih',
            kunye: 'İşK m. 17',
            url: 'https://avfethiguzel.com/mevzuat/is-kanunu/madde-17',
            publicSummary:
                'Belirsiz süreli iş sözleşmesinde bildirim süreleri; süreye uyulmaması ihbar tazminatını doğurabilir.',
        },
        tweet:
            'İşK m. 17: Belirsiz süreli iş sözleşmesinde fesih, kural olarak bildirim sürelerine tabidir. Süreye uyulmaması ihbar tazminatını gündeme getirebilir; haklı nedenle derhal fesihten ayrı bir rejimdir.\n\navfethiguzel.com/mevzuat/is-kanunu/madde-17\n#hukuk #işhukuku',
        cardHeadline: 'Bildirimli fesih ile haklı nedenle derhal fesih aynı kapı değildir.',
        instagramCaption: `İş Kanunu m. 17, belirsiz süreli iş sözleşmelerinde bildirimli feshin çerçevesini çizer.

Kıdem süresine göre değişen bildirim süreleri vardır. İşveren veya işçi bu sürelere uymadan sözleşmeyi sona erdirirse, kural olarak ihbar tazminatı gündeme gelir.

Bu hüküm, haklı nedenle derhal fesih (m. 24–25) rejiminden ayrıdır. Hangi yolun seçildiği; ispat, süre ve sonuçlar bakımından belirleyicidir. Genel bilgilendirmedir.

avfethiguzel.com/mevzuat/is-kanunu/madde-17

#hukuk #işhukuku #İşKanunu`,
        youtubeScript: `İş sözleşmesi nasıl biter, kısaca netleştirelim.

İş Kanunu’nun 17. maddesi, belirsiz süreli sözleşmelerde bildirimli feshin sürelerini düzenler. Süreye uyulmazsa ihbar tazminatı gündeme gelebilir.

Ama her fesih bildirimli değildir. Haklı nedenle derhal fesih ayrı bir yoldur; ispat ve sonuçlar farklı işler. Somut olayda hangi hükmün uygulanacağı dosyaya göre değişir.

Madde metni ve şerh: avfethiguzel.com`,
    },
];

async function main() {
    await mkdir(join(OUT_DIR, date), { recursive: true });
    const items = [];
    for (let i = 0; i < ITEMS.length; i++) {
        const it = ITEMS[i];
        let cardPath = null;
        try {
            cardPath = await generateCard(
                { ...it.topic, cardText: it.cardHeadline },
                join(OUT_DIR, date, `card-${i + 1}.png`)
            );
        } catch (e) {
            console.warn('card fail', e.message);
        }
        items.push({
            topic: it.topic,
            tweet: it.tweet,
            instagramCaption: it.instagramCaption,
            cardHeadline: it.cardHeadline,
            cardPath,
            youtubeScript: it.youtubeScript,
        });
    }

    const draft = {
        date,
        generatedAt: new Date().toISOString(),
        status: 'pending_approval',
        source: 'seed-quality',
        items,
    };

    const jsonPath = join(OUT_DIR, `${date}.json`);
    const mdPath = join(OUT_DIR, `${date}.md`);
    await writeFile(jsonPath, JSON.stringify(draft, null, 2), 'utf-8');

    let md = `# Sosyal medya taslakları — ${date}\n\n`;
    md += `Kaynak: kalite tohumu (API kotası nedeniyle elle yazıldı)\n`;
    md += `Durum: **ONAY BEKLİYOR** — henüz hiçbir platforma gönderilmedi\n\n`;
    items.forEach((item, i) => {
        md += `---\n\n## ${i + 1}. ${item.topic.title}\n\n`;
        md += `Sayfa: ${item.topic.url}\n\n`;
        md += `### X / Twitter\n\n\`\`\`\n${item.tweet}\n\`\`\`\n\n`;
        md += `### Instagram\n\n\`\`\`\n${item.instagramCaption}\n\`\`\`\n\n`;
        md += `Kart başlığı: *${item.cardHeadline}*\n\n`;
        if (item.cardPath) md += `Kart dosyası: \`${item.cardPath}\`\n\n`;
        md += `### YouTube Shorts\n\n${item.youtubeScript}\n\n`;
    });
    md += `---\n\nOnaylarsanız: JSON içinde \`"status": "approved"\` yapın, sonra:\n\`node scripts/social-publish.js --date ${date}\`\n`;
    await writeFile(mdPath, md, 'utf-8');
    console.log('wrote', jsonPath);
    console.log('wrote', mdPath);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
