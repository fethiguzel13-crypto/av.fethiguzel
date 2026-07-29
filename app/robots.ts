import type { MetadataRoute } from 'next';

/**
 * Crawl policy optimized for Google + AI answer engines (GEO).
 * Allow major LLM bots to read public legal library content; block API only.
 */
export default function robots(): MetadataRoute.Robots {
    // Production redirects bare domain → www; keep host + sitemap on www.
    const base = 'https://www.avfethiguzel.com';
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/'],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/api/'],
            },
            // Generative Engine Optimization — surface library in AI answers
            {
                userAgent: 'GPTBot',
                allow: '/',
                disallow: ['/api/'],
            },
            {
                userAgent: 'ChatGPT-User',
                allow: '/',
                disallow: ['/api/'],
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
                disallow: ['/api/'],
            },
            {
                userAgent: 'anthropic-ai',
                allow: '/',
                disallow: ['/api/'],
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
                disallow: ['/api/'],
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
                disallow: ['/api/'],
            },
            {
                userAgent: 'Applebot-Extended',
                allow: '/',
                disallow: ['/api/'],
            },
            {
                userAgent: 'Bytespider',
                allow: '/',
                disallow: ['/api/'],
            },
            {
                userAgent: 'CCBot',
                allow: '/',
                disallow: ['/api/'],
            },
        ],
        sitemap: [`${base}/sitemap.xml`, `${base}/images-sitemap.xml`],
        host: base,
    };
}
