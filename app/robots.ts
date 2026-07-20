import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const base = 'https://avfethiguzel.com';
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
        ],
        sitemap: [`${base}/sitemap.xml`, `${base}/images-sitemap.xml`],
        host: base,
    };
}
