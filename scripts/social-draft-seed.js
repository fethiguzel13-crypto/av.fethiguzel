/**
 * High-quality seed drafts without LLM (when API quotas fail).
 * Priority: yargı kararı + halk dili.
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
            id: 'aym-2021-61490',
            source: 'AYM',
            category: 'Bireysel Başvuru',
            title: 'İşçi alacağı davasında talep artırım dilekçesi',
            kunye: 'AYM, B. No: 2021/61490, 06.05.2026',
            url: 'https://avfethiguzel.com/icthat',
            publicSummary:
                'İşçi alacağı davasında talep artırım dilekçesinin dikkate alınmaması; mahkemeye erişim hakkı ihlali.',
        },
        tweet:
            'İşçi dava açtı, sonra “daha fazla alacağım var” diye ek dilekçe verdi. Mahkeme bunu yok saymış. AYM: mahkemeye erişim hakkı ihlal edilmiştir.\n\navfethiguzel.com/icthat\n#hukuk #AYM #işhukuku',
        cardHeadline: 'İşçi ek talep yazdı; mahkeme yok sayarsa erişim hakkı zedelenir.',
        instagramCaption: `İşçi, ücret ve benzeri alacakları için dava açmış. Süreç içinde “aslında daha fazla alacağım var” diyerek talebini artırmak istemiş.

Mahkeme bu ek dilekçeyi dikkate almamış. Anayasa Mahkemesi ise şunu demiş: Mahkemeye erişim hakkı ihlal edilmiştir. Yani dosyaya yazdığınız ek istem de dosyanın parçasıdır; görmezden gelinemez.

Bu, herkes için basit bir mesaj: Dilekçe dosyadaysa mahkeme onu okumak ve değerlendirmek zorundadır. Genel bilgilendirmedir; her dosya kendi deliline göre çözülür.

avfethiguzel.com/icthat

#hukuk #içtihat #AYM #AnayasaMahkemesi #işhukuku`,
        youtubeScript: `Kısa bir mahkeme notu.

Bir işçi alacakları için dava açıyor. Sonra diyor ki: “Hesabım arttı, talebimi yükseltmek istiyorum.” Ek dilekçe veriyor. Mahkeme bu dilekçeyi yok sayıyor.

Anayasa Mahkemesi buraya müdahale ediyor: Mahkemeye erişim hakkı ihlal edilmiştir. Dosyaya giren istem, sessizce kenara atılamaz.

Sizin için pratik anlamı şu: Mahkemeye yazdığınız her ek talep, dosyanın parçasıdır. Tabii somut olayda süre, usul ve delil ayrı bakılır. Bu genel bir çerçevedir.

avfethiguzel.com`,
    },
    {
        topic: {
            id: 'aym-2023-107440',
            source: 'AYM',
            category: 'Bireysel Başvuru',
            title: 'Fazladan hapis süresi ve savcılık mütalaasının tebliği',
            kunye: 'AYM, B. No: 2023/107440, 04.03.2026',
            url: 'https://avfethiguzel.com/icthat',
            publicSummary:
                'Hatalı süre hesabı nedeniyle fazladan hapis; savcılık görüşünün tebliğ edilmemesi — kişi hürriyeti ve adil yargılanma.',
        },
        tweet:
            'Ceza hesabı yanlış yapılmış; kişi olması gerekenden fazla hapiste kalmış. Savcılık görüşü de zamanında bildirilmemiş. AYM: kişi hürriyeti ve adil yargılanma hakları ihlal.\n\navfethiguzel.com/icthat\n#hukuk #AYM',
        cardHeadline: 'Süre hesabı yanlışsa fazla yatan gün de hak ihlali sayılabilir.',
        instagramCaption: `Bir kişi, ceza süresinin yanlış hesaplanması yüzünden olması gerekenden daha fazla hapiste kalmış. Üstelik savcılığın görüşü kendisine zamanında bildirilmemiş.

Anayasa Mahkemesi iki noktaya dikkat çekiyor: Kişi hürriyeti ve güvenliği hakkı ile adil yargılanma hakkı. Süre hesabı “kağıt işi” değildir; günler, hayatın kendisidir. Karşı tarafın görüşünü bilmek de savunmanın parçasıdır.

Mesaj sade: Devletin hesabı doğru olmalı, süreç şeffaf olmalı. Bu genel bilgilendirmedir; her dosyanın rakamları ve belgeleri ayrıdır.

avfethiguzel.com/icthat

#hukuk #içtihat #AYM #AnayasaMahkemesi`,
        youtubeScript: `Bugün basit bir soru: Fazladan hapiste kalmak mümkün mü?

Bir dosyada süre hesabı hatalı yapılmış. Kişi, yatması gerekenden daha uzun süre cezaevinde kalmış. Bir de savcılığın görüşü kendisine usulünce bildirilmemiş.

Anayasa Mahkemesi bu tabloyu ciddiye alıyor: Kişi hürriyeti ve adil yargılanma hakları devreye girer. Çünkü her gün, her bildirim, somut bir haktır.

Pratik not: Süre ve tebligat işleri formalite gibi görünse de hayatı değiştirir. Somut dosyada rakamlar ve belgeler ayrı incelenir. Genel bilgilendirmedir.

avfethiguzel.com`,
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
                {
                    id: it.topic.id,
                    ...it.topic,
                    cardText: it.cardHeadline,
                },
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
        source: 'seed-court-plain',
        policy: {
            prefer: 'yargi-karari',
            tone: 'halk-dili',
        },
        items,
    };

    const jsonPath = join(OUT_DIR, `${date}.json`);
    const mdPath = join(OUT_DIR, `${date}.md`);
    await writeFile(jsonPath, JSON.stringify(draft, null, 2), 'utf-8');

    let md = `# Sosyal medya taslakları — ${date}\n\n`;
    md += `Kaynak: yargı kararı + halk dili (API kotası nedeniyle elle yazıldı)\n`;
    md += `Durum: **ONAY BEKLİYOR** — henüz hiçbir platforma gönderilmedi\n\n`;
    items.forEach((item, i) => {
        md += `---\n\n## ${i + 1}. ${item.topic.title}\n\n`;
        md += `Künye: ${item.topic.kunye}\n`;
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
    for (const it of items) {
        if (it.cardPath) console.log('card', it.cardPath);
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
