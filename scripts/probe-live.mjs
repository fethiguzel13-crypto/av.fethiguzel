import https from 'https';

function get(url) {
    return new Promise((resolve, reject) => {
        https
            .get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (r) => {
                if ([301, 302, 307, 308].includes(r.statusCode) && r.headers.location) {
                    const n = r.headers.location.startsWith('http')
                        ? r.headers.location
                        : new URL(r.headers.location, url).href;
                    r.resume();
                    return resolve(get(n));
                }
                const d = [];
                r.on('data', (c) => d.push(c));
                r.on('end', () =>
                    resolve({
                        s: r.statusCode,
                        t: Buffer.concat(d).toString(),
                        m: r.headers['x-matched-path'],
                    })
                );
            })
            .on('error', reject);
    });
}

const urls = [
    'https://www.avfethiguzel.com/deploy-check',
    'https://www.avfethiguzel.com/mevzuat/tbk/madde-1',
    'https://www.avfethiguzel.com/mevzuat-viewer-v3.html',
    'https://www.avfethiguzel.com/mevzuat-viewer.html',
];

for (const u of urls) {
    const r = await get(u);
    console.log('\n', u);
    console.log(' status', r.s, 'matched', r.m, 'len', r.t.length);
    console.log(' next_error', /__next_error__|couldn.t load/i.test(r.t));
    console.log(
        ' flags',
        'prose=' + r.t.includes('madde-prose'),
        'jsd=' + r.t.includes('jsdelivr'),
        'serif=' + r.t.includes('Source Serif'),
        'marker=' + r.t.includes('prebuild-noop')
    );
}
