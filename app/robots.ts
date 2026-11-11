import type { MetadataRoute } from 'next';

/**
 * Tarama politikası: yalnız arama motorları ve paylaşım önizleme botları.
 *
 * 2026-11: Vercel Hobby kullanım sınırı, site kullanılmadığı halde birkaç saatte doluyordu. Önceki politika
 * GPTBot, ClaudeBot, Bytespider, CCBot gibi yapay zekâ tarayıcılarını bütün siteye davet ediyordu; binlerce
 * madde sayfasının her biri ilk ziyarette sunucu fonksiyonu çalıştırdığı için bu tarama kullanım süresini
 * tüketiyordu. Arama motorları dışındaki herkes kapalıdır (robots.txt'e uymayan botlar için Vercel
 * panelindeki güvenlik duvarı "AI Bots" kuralı ayrıca açılmalıdır).
 */
const ARAMA_MOTORLARI = ['Googlebot', 'Googlebot-Image', 'Bingbot', 'YandexBot', 'DuckDuckBot', 'Applebot'];
// Paylaşılan bağlantının önizleme kartını çeker; yalnız biri bağlantı paylaşınca gelir.
const ONIZLEME = ['facebookexternalhit', 'Twitterbot', 'LinkedInBot', 'WhatsApp', 'TelegramBot', 'Slackbot'];

export default function robots(): MetadataRoute.Robots {
    const base = 'https://www.avfethiguzel.com';
    return {
        rules: [
            { userAgent: ARAMA_MOTORLARI, allow: '/', disallow: ['/api/', '/_next/', '/og/'] },
            { userAgent: ONIZLEME, allow: '/' },
            { userAgent: '*', disallow: '/' },
        ],
        sitemap: [
            `${base}/priority-sitemap.xml`,
            `${base}/bilgi-sitemap.xml`,
            `${base}/sitemap.xml`,
            `${base}/images-sitemap.xml`,
        ],
        host: base,
    };
}
