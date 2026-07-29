import { NextResponse } from 'next/server'

/** Image sitemap — helps Google Images index portrait and brand photos */
export function GET() {
    const base = 'https://avfethiguzel.com'
    const images = [
        {
            loc: `${base}/avukat-fethi-guzel`,
            image: `${base}/images/av-fethi-guzel-van-ercis-avukat.jpg`,
            title: 'Av. Fethi Güzel portresi',
            caption: 'Avukat Fethi Güzel — özel hukuk, e-duruşma yazarı',
        },
        {
            loc: `${base}/`,
            image: `${base}/images/av-fethi-guzel-og.jpg`,
            title: 'Av. Fethi Güzel Hukuk Portalı',
            caption: 'Av. Fethi Güzel — mevzuat ve akademik şerh',
        },
        {
            loc: `${base}/akademik-profil`,
            image: `${base}/images/av-fethi-guzel-square.jpg`,
            title: 'Av. Fethi Güzel akademik profil',
            caption: 'Özel hukuk doktora çalışmaları ve yayınlar',
        },
    ]

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images
            .map(
                (i) => `  <url>
    <loc>${i.loc}</loc>
    <image:image>
      <image:loc>${i.image}</image:loc>
      <image:title>${escapeXml(i.title)}</image:title>
      <image:caption>${escapeXml(i.caption)}</image:caption>
    </image:image>
  </url>`
            )
            .join('\n')}
</urlset>`

    return new NextResponse(body, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
        },
    })
}

function escapeXml(s: string) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}
