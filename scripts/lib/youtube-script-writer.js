import { completeText } from './llm-client.js';

const SYSTEM = `Sen Av. Fethi Güzel adına YouTube Shorts konuşma metni yazıyorsun.

ZORUNLU AÇILIŞ:
- Soyut soruyla başlama ("Hiç düşündünüz mü", "Bedeli nedir" YASAK veya en fazla 1 kısa cümle).
- Tercihen doğrudan insan hikâyesi: "Bir çalışan…", "Bir kişi…", "Bir işçi…"
- Dinleyiciyi sahnede bırak; sonra mahkeme.

RİTİM (tekdüze olmasın):
- Kısa cümle + uzun cümle karışımı.
- 1–2 yerde duraklama hissi: tek başına kısa cümle (ör. "Mahkeme buna sessiz kaldı.")
- Aynı kalıp cümleyi tekrarlama.

Biçim:
1) Açılış hikâye (2–3 cümle) — kim, ne istedi
2) Gerilim (1–2 cümle) — ne ters gitti
3) Karar (2–3 cümle) — mahkeme ne dedi, sade dil
4) Anlam (1–2 cümle) — sizin için ne
5) Kapanış — avfethiguzel.com (tek satır)

Kurallar:
- Canlı, halk dili; jargonu açıkla
- ~50–70 saniye (120–180 kelime)
- Siyaset yok, sansasyon yok
- Sadece konuşma metni; sahne yönergesi yok`;

export async function writeYoutubeScripts(topics) {
    const scripts = [];
    for (const h of topics) {
        const summary = (h.publicSummary || h.konu || '').trim().slice(0, 800);
        const text = await completeText({
            system: SYSTEM,
            maxTokens: 900,
            minChars: 280,
            user: `Konu: ${h.title || h.kunye || h.source}
Kaynak: ${h.source}
Özet: ${summary}
Sayfa: ${(h.url || 'avfethiguzel.com').replace(/^https?:\/\//, '')}

"Bir çalışan / Bir kişi …" ile başlayan, ritimli Shorts metni yaz.
Soyut hook ile başlama. Yarım bırakma.`,
        });
        scripts.push({
            id: h.id,
            title: h.title || h.kunye || h.source,
            source: h.source,
            url: h.url,
            script: text.trim(),
        });
    }
    return scripts;
}
