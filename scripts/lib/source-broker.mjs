/**
 * Kamuya açık müfredat / Bologna sayfası okuyucusu.
 *
 * Stealth yok: webdriver gizlenmez, yerleşim proxy yok, kimlikli User-Agent.
 * robots.txt Disallow edilirse sayfa alınmaz.
 */
const DEFAULT_UA =
    'AvFethiGuzelBot/1.0 (+https://www.avfethiguzel.com/ders-notlari; egitim arastirmasi; kimlikli tarayici)';

export const ALLOWLIST = [
    'yok.gov.tr',
    'atlas.yok.gov.tr',
    'osym.gov.tr',
    'mevzuat.gov.tr',
    'anayasa.gov.tr',
    'resmigazete.gov.tr',
    'ankara.edu.tr',
    'law.ankara.edu.tr',
    'acikders.ankara.edu.tr',
    'marmara.edu.tr',
    'istanbul.edu.tr',
    'deu.edu.tr',
    'hacettepe.edu.tr',
    'gsu.edu.tr',
    'bilkent.edu.tr',
    'ku.edu.tr',
    'aybu.edu.tr',
    'hacibayram.edu.tr',
    'hukuk.hacibayram.edu.tr',
    'ebs.istanbul.edu.tr',
    'hukuk.istanbul.edu.tr',
    'hukuk.marmara.edu.tr',
    'meobs.marmara.edu.tr',
    'hukuk.gsu.edu.tr',
    'ects.gsu.edu.tr',
    'hukuk.deu.edu.tr',
    'hukuk.hacettepe.edu.tr',
    'law.bilkent.edu.tr',
    'law.ku.edu.tr',
    'cdn.istanbul.edu.tr',
    'etu.edu.tr',
    'bogazici.edu.tr',
    'law.bogazici.edu.tr',
    'ozyegin.edu.tr',
    'yeditepe.edu.tr',
    'hukuk.yeditepe.edu.tr',
    'akdeniz.edu.tr',
    'selcuk.edu.tr',
    'erciyes.edu.tr',
    'uludag.edu.tr',
    'cu.edu.tr',
    'anadolu.edu.tr',
    'asbu.edu.tr',
    'medeniyet.edu.tr',
    'bau.edu.tr',
    'khas.edu.tr',
    'bilgi.edu.tr',
    'medipol.edu.tr',
    'altinbas.edu.tr',
    'maltepe.edu.tr',
    'dogus.edu.tr',
    'okan.edu.tr',
    'iku.edu.tr',
    'aydin.edu.tr',
    'beykent.edu.tr',
    'fsm.edu.tr',
    'atauni.edu.tr',
    'inonu.edu.tr',
    'dicle.edu.tr',
    'gantep.edu.tr',
    'sdu.edu.tr',
    'pau.edu.tr',
    'sakarya.edu.tr',
    'kocaeli.edu.tr',
    'balikesir.edu.tr',
    'aku.edu.tr',
    'ogu.edu.tr',
    'cumhuriyet.edu.tr',
    'omu.edu.tr',
    'ebyu.edu.tr',
    'kku.edu.tr',
    'erbakan.edu.tr',
    'atilim.edu.tr',
    'cankaya.edu.tr',
    'baskent.edu.tr',
    'yasar.edu.tr',
    'ieu.edu.tr',
    'antalya.edu.tr',
    'hku.edu.tr',
    'tau.edu.tr',
    'mef.edu.tr',
    'ihu.edu.tr',
    'gop.edu.tr',
    'bozok.edu.tr',
    'erdogan.edu.tr',
    'ibu.edu.tr',
    'karatekin.edu.tr',
    'nku.edu.tr',
    'klu.edu.tr',
    'trabzon.edu.tr',
    'yalova.edu.tr',
    'bakircay.edu.tr',
    'idu.edu.tr',
    'ikc.edu.tr',
    'ufuk.edu.tr',
    'ankarabilim.edu.tr',
    'ankaramedipol.edu.tr',
    'cag.edu.tr',
    '29mayis.edu.tr',
    'gedik.edu.tr',
    'izu.edu.tr',
    'ticaret.edu.tr',
    'yeniyuzyil.edu.tr',
    'karatay.edu.tr',
    'nny.edu.tr',
    'pirireis.edu.tr',
];

export const MIN_DELAY_MS = 8000;
export const MAX_DELAY_MS = 15000;

export function hostOf(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
    } catch {
        return '';
    }
}

export function isAllowlisted(url) {
    const host = hostOf(url);
    if (!host) return false;
    return ALLOWLIST.some((h) => host === h || host.endsWith(`.${h}`));
}

export function parseRobots(robotsText, userAgent = '*') {
    const lines = String(robotsText || '')
        .split(/\r?\n/)
        .map((l) => l.replace(/#.*$/, '').trim())
        .filter(Boolean);
    const groups = [];
    let current = { agents: [], disallow: [], allow: [], crawlDelay: null };
    const flush = () => {
        if (current.agents.length) groups.push(current);
        current = { agents: [], disallow: [], allow: [], crawlDelay: null };
    };
    for (const line of lines) {
        const m = /^(user-agent|disallow|allow|crawl-delay)\s*:\s*(.*)$/i.exec(line);
        if (!m) continue;
        const key = m[1].toLowerCase();
        const val = m[2].trim();
        if (key === 'user-agent') {
            if (current.disallow.length || current.allow.length || current.crawlDelay != null) flush();
            current.agents.push(val.toLowerCase());
        } else if (key === 'disallow') current.disallow.push(val);
        else if (key === 'allow') current.allow.push(val);
        else if (key === 'crawl-delay') current.crawlDelay = Number(val) || null;
    }
    flush();
    const ua = userAgent.toLowerCase();
    const match =
        groups.find((g) => g.agents.some((a) => a !== '*' && ua.includes(a))) ||
        groups.find((g) => g.agents.includes('*')) ||
        { disallow: [], allow: [], crawlDelay: null };
    return match;
}

export function pathAllowed(pathname, rules) {
    const path = pathname || '/';
    const matches = (pattern) => {
        if (!pattern) return false;
        if (pattern === '/') return true;
        return path.startsWith(pattern);
    };
    const allowHit = (rules.allow || []).filter(Boolean).find(matches);
    const disallowHit = (rules.disallow || []).filter(Boolean).find(matches);
    if (allowHit && disallowHit) return allowHit.length >= disallowHit.length;
    if (disallowHit) return false;
    return true;
}

export function delayMsFor(rules) {
    const fromRobots = rules?.crawlDelay != null ? Math.max(rules.crawlDelay * 1000, MIN_DELAY_MS) : MIN_DELAY_MS;
    const span = Math.max(0, MAX_DELAY_MS - fromRobots);
    return fromRobots + Math.floor(Math.random() * (span + 1));
}

export function assertNoStealth(opts = {}) {
    const banned = ['stealth', 'webdriver', 'residential', 'proxyRotate', 'maskWebdriver'];
    for (const k of banned) {
        if (opts[k]) {
            const err = new Error(`source-broker stealth kapalı: ${k}`);
            err.code = 'STEALTH_FORBIDDEN';
            throw err;
        }
    }
}

/**
 * @param {string} url
 * @param {{ fetchImpl?: typeof fetch, robotsText?: string, userAgent?: string, now?: number, lastFetchAt?: Map<string, number>, sleep?: (ms:number)=>Promise<void> }} [opts]
 */
export async function fetchPublic(url, opts = {}) {
    assertNoStealth(opts);
    if (!isAllowlisted(url)) {
        const err = new Error(`host allowlist dışında: ${hostOf(url)}`);
        err.code = 'HOST_DENIED';
        throw err;
    }
    const ua = opts.userAgent || DEFAULT_UA;
    const parsed = new URL(url);
    const rules = parseRobots(opts.robotsText ?? '', ua);
    if (!pathAllowed(parsed.pathname, rules)) {
        const err = new Error(`robots.txt Disallow: ${parsed.pathname}`);
        err.code = 'ROBOTS_DISALLOW';
        throw err;
    }

    const host = hostOf(url);
    const lastMap = opts.lastFetchAt;
    if (lastMap) {
        const last = lastMap.get(host) || 0;
        const wait = delayMsFor(rules) - (Date.now() - last);
        if (wait > 0) await (opts.sleep || sleep)(wait);
    }

    const fetchImpl = opts.fetchImpl || fetch;
    const res = await fetchImpl(url, {
        headers: {
            'User-Agent': ua,
            Accept: 'text/html,application/pdf,text/plain;q=0.9,*/*;q=0.8',
        },
        redirect: 'follow',
    });
    if (lastMap) lastMap.set(host, Date.now());
    if (!res.ok) {
        const err = new Error(`HTTP ${res.status} ${url}`);
        err.code = 'HTTP_ERROR';
        err.status = res.status;
        throw err;
    }
    const contentType = res.headers?.get?.('content-type') || '';
    const text = await res.text();
    return { url, host, contentType, text, userAgent: ua };
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

export { DEFAULT_UA };
