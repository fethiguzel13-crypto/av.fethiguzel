import { completeText } from './llm-client.js';

const SYSTEM = `Sen Av. Fethi Güzel adına Instagram için hukuki içerik yazıyorsun.

Kimlik: Canlı, sıcak, güvenilir avukat. Halk dili + azıcık daha zengin anlatım.
Kitle: Vatandaş; sıkıcı jargonsuz ama yavan da değil.

Kurallar:
1) 650–1000 karakter (hashtag hariç). 3–5 paragraf. Biraz daha zengin metin.
2) Akış: Ne oldu (canlı sahne) → Mahkeme ne dedi → Sizin hayatınıza dokunan anlam → kısa genel bilgilendirme notu.
3) Cümleler biraz daha uzun ve akıcı olsun; 4–5 kelimelik vuruş cümlelerden kaçın, düşünceyi nefes alarak tamamla.
4) Dil canlı olsun: “Mahkeme sessiz kaldı”, “dosyaya giren dilekçe yok sayılamaz” gibi; abartı/sansasyon yok.
5) Teknik terimi kullanırsan hemen sadeleştir.
6) "Devamı profilde", "link bio", "kaydet" YASAK.
7) Site en fazla bir kez, sade satır: avfethiguzel.com (veya ilgili yol).
8) Siyaset yok. Emoji en fazla 1 veya hiç.
9) Sadece caption gövdesi; hashtag ekleme.`;

const HASHTAGS = {
  AYM: '#hukuk #içtihat #AYM #AnayasaMahkemesi',
  Yargıtay: '#hukuk #içtihat #Yargıtay',
  YİBK: '#hukuk #Yargıtay #YİBK',
  AİHM: '#hukuk #AİHM #insanHakları',
  TBK: '#hukuk #TBK #borçlarhukuku',
  TMK: '#hukuk #TMK #medeniHukuk',
  İşK: '#hukuk #işhukuku',
  HMK: '#hukuk #HMK #usul',
  İİK: '#hukuk #İİK #icra',
  TCK: '#hukuk #TCK #cezahukuku',
  RG: '#hukuk #mevzuat',
};

function hashtagsFor(source, category) {
  if (source === 'Yargıtay' && category === 'YİBK') return HASHTAGS.YİBK;
  return HASHTAGS[source] || '#hukuk #içtihat #avukatlık';
}

function summaryFor(h) {
  return (h.publicSummary || h.konu || '').trim().slice(0, 800);
}

const HEADLINE_SYSTEM = `Instagram kartı için tek cümlelik başlık yazıyorsun.

Kurallar:
- Canlı, net, halk dili (ama sansasyon yok)
- Biraz daha uzun, akıcı tek cümle; nokta ile bitsin
- En fazla 140 karakter
- Kararın özü: ne korundu / ne hatırlatıldı
- Sadece cümleyi yaz`;

export async function generateCardHeadlines(highlights) {
  const headlines = [];
  for (const h of highlights) {
    const raw = await completeText({
      system: HEADLINE_SYSTEM,
      maxTokens: 140,
      minChars: 40,
      user: `Kaynak: ${h.source}\nKünye: ${h.kunye || ''}\nÖzet: ${summaryFor(h)}\n\nTek tam cümle, canlı ve net. Yarım bırakma.`,
    });
    headlines.push(raw.replace(/^["']|["']$/g, '').trim());
  }
  return headlines;
}

export async function writeCaptions(highlights) {
  const captions = [];
  for (const h of highlights) {
    const site = (h.url || 'https://avfethiguzel.com').replace(/^https?:\/\//, '');
    const raw = await completeText({
      system: SYSTEM,
      maxTokens: 900,
      minChars: 280,
      user: `Kaynak: ${h.source}
Künye: ${h.kunye || h.title || ''}
Özet: ${summaryFor(h)}
Site satırı (caption sonunda bir kez): ${site}

Canlı ve biraz daha zengin caption yaz (hashtag yok).
3–5 paragraf; hikâye + karar + anlam.
Cümleleri biraz daha uzun ve akıcı kur; yarım bırakma.`,
    });
    const hashtags = hashtagsFor(h.source, h.category);
    let body = raw.trim();
    if (!/avfethiguzel\.com/i.test(body)) {
      body = `${body}\n\n${site}`;
    }
    captions.push(`${body}\n\n${hashtags}`);
  }
  return captions;
}
