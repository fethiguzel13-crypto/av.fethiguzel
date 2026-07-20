import { completeText } from './llm-client.js';

const SYSTEM = `Sen Av. Fethi Güzel adına YouTube Shorts / kısa video metni yazıyorsun.

Biçim:
1) Hook (1 cümle) — merak, abartısız
2) Hukuki öz (3–5 cümle) — doğru, sakin
3) Pratik not (1 cümle) — genel bilgilendirme; "hukuki tavsiye değildir" tonu
4) Kapanış (1 kısa cümle) — site adı sade: avfethiguzel.com (devamı orada deme)

Kurallar:
- Toplam konuşma süresi ~45–70 saniye (yaklaşık 110–160 kelime)
- Sansasyon, tık tuzağı, bağıran başlık yok
- Siyaset yok
- Sadece metni yaz; sahne numarası veya kamera yönergesi ekleme`;

export async function writeYoutubeScripts(topics) {
    const scripts = [];
    for (const h of topics) {
        const summary = (h.publicSummary || h.konu || '').trim().slice(0, 700);
        const text = await completeText({
            system: SYSTEM,
            maxTokens: 600,
            user: `Konu: ${h.title || h.kunye || h.source}
Kaynak: ${h.source}
Özet: ${summary}
Sayfa: ${(h.url || 'avfethiguzel.com').replace(/^https?:\/\//, '')}

YouTube kısa video konuşma metnini yaz.`,
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
