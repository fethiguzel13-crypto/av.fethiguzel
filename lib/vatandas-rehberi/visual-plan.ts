import type { VatandasArticle, VatandasTable } from './types';

/** Metindeki süre — sayı uydurulmaz, cümleden okunur. */
export type RehberClock = {
    amount: string;
    unit: string;
    days: number;
    context: string;
};

export type RehberFork = {
    title: string;
    leftTitle: string;
    left: string;
    rightTitle: string;
    right: string;
};

export type RehberMeasure = {
    kind: 'per-year' | 'percent' | 'phrase';
    kicker: string;
    value: string;
    note?: string;
};

export type RehberAftermath = {
    title: string;
    beats: string[];
};

export type VisualPlan = {
    clocks: RehberClock[];
    fork: RehberFork | null;
    conditions: { heading: string; items: string[]; sectionIndex: number }[];
    measures: RehberMeasure[];
    trap: string | null;
    table: VatandasTable | null;
    aftermath: RehberAftermath | null;
};

const TR_NUM: Record<string, number> = {
    bir: 1,
    iki: 2,
    üç: 3,
    dort: 4,
    dört: 4,
    beş: 5,
    alti: 6,
    altı: 6,
    yedi: 7,
    sekiz: 8,
    dokuz: 9,
    on: 10,
    'on beş': 15,
    'onbes': 15,
    otuz: 30,
    'kırk': 40,
    kirk: 40,
    elli: 50,
    altmış: 60,
    altmis: 60,
    yetmiş: 70,
    seksen: 80,
    doksan: 90,
    yüz: 100,
    yuz: 100,
};

const CLOCK_RE =
    /(?:^|[^\p{L}\p{N}])(on beş|onbes|altmış|altmis|kırk|bir|iki|üç|dört|beş|altı|yedi|sekiz|dokuz|on|otuz|elli|yetmiş|seksen|doksan|yüz|\d+)\s*(günlük|gün|aylık|ay|yıllık|yıl|haftalık|hafta)(?:dır|dir|dur|dür)?(?=$|[^\p{L}])/giu;

const FORMULA_HINT = /ücret|hesap|giydirilmiş|tavan|oranında|her (tam )?yıl/i;
const DEADLINE_HINT =
    /süre|zamanaşımı|hak düşür|itibaren|içinde|tebliğ|kaçır|en geç|en az|dolmadan|işlemeye|tanır|zorunlu/i;

function plain(s: string): string {
    return String(s || '')
        .replace(/\*\*/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function sentencesOf(text: string): string[] {
    return plain(text)
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 18);
}

function articleText(article: VatandasArticle): string {
    const parts = [
        article.lead,
        article.keyInsight,
        ...(article.sections || []).flatMap((s) => [s.heading, ...(s.paragraphs || []), ...(s.bullets || [])]),
        ...(article.faq || []).flatMap((f) => [f.q, f.a]),
    ];
    return parts.filter(Boolean).join('\n');
}

function toAmount(raw: string): { amount: string; n: number } | null {
    const key = raw.toLocaleLowerCase('tr-TR').replace(/ı/g, 'i');
    if (/^\d+$/.test(raw)) return { amount: raw, n: Number(raw) };
    const mapped = TR_NUM[raw.toLocaleLowerCase('tr-TR')] ?? TR_NUM[key];
    if (mapped) return { amount: String(mapped), n: mapped };
    return null;
}

function unitDays(unit: string, n: number): number {
    const u = unit.toLocaleLowerCase('tr-TR');
    if (u.startsWith('gün')) return n;
    if (u.startsWith('hafta')) return n * 7;
    if (u.startsWith('ay')) return n * 30;
    if (u.startsWith('yıl')) return n * 365;
    return n;
}

function displayUnit(unit: string): string {
    const u = unit.toLocaleLowerCase('tr-TR');
    if (u.startsWith('gün')) return 'gün';
    if (u.startsWith('hafta')) return 'hafta';
    if (u.startsWith('ay')) return 'ay';
    if (u.startsWith('yıl')) return 'yıl';
    return u;
}

function clip(s: string, max = 110): string {
    const t = plain(s);
    if (t.length <= max) return t.replace(/[.,;:]+$/, '');
    return t.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

function extractClocks(article: VatandasArticle): RehberClock[] {
    const pool = [
        article.lead,
        article.keyInsight,
        ...(article.sections || []).flatMap((s) => s.paragraphs || []),
        ...(article.faq || []).map((f) => f.a),
    ]
        .filter((x): x is string => typeof x === 'string')
        .map(plain)
        .filter(Boolean);

    const found: RehberClock[] = [];
    const seen = new Set<string>();

    for (const block of pool) {
        for (const sentence of sentencesOf(block)) {
            if (FORMULA_HINT.test(sentence) && !DEADLINE_HINT.test(sentence)) continue;
            CLOCK_RE.lastIndex = 0;
            let m: RegExpExecArray | null;
            while ((m = CLOCK_RE.exec(sentence))) {
                const parsed = toAmount(m[1]);
                if (!parsed || parsed.n < 1 || parsed.n > 100) continue;
                const unit = displayUnit(m[2]);
                if (/günlük/.test(m[2]) && /ücret/.test(sentence)) continue;
                if (parsed.n === 1 && unit === 'gün' && /bile/.test(sentence)) continue;
                const key = `${parsed.n}-${unit}`;
                if (seen.has(key)) continue;
                seen.add(key);
                found.push({
                    amount: parsed.amount,
                    unit,
                    days: unitDays(unit, parsed.n),
                    context: clip(sentence),
                });
            }
        }
    }

    found.sort((a, b) => a.days - b.days);
    return found.slice(0, 4);
}

const FORK_PAIRS: { a: RegExp; b: RegExp; leftTitle: string; rightTitle: string }[] = [
    { a: /anlaşmalı/i, b: /çekişmeli/i, leftTitle: 'Anlaşmalı', rightTitle: 'Çekişmeli' },
    { a: /ilamlı/i, b: /ilamsız/i, leftTitle: 'İlamlı takip', rightTitle: 'İlamsız takip' },
    { a: /\bnoter/i, b: /sulh hukuk|mahkeme/i, leftTitle: 'Noter', rightTitle: 'Sulh hukuk' },
    { a: /veri sorumlusu/i, b: /\bkurul/i, leftTitle: 'Veri sorumlusu', rightTitle: 'Kurul' },
    { a: /icra dairesi/i, b: /mahkeme/i, leftTitle: 'İcra dairesi', rightTitle: 'Mahkeme' },
    { a: /haklı nedenle|haklı fesih|haklı sebep/i, b: /istifa/i, leftTitle: 'Haklı ayrılık', rightTitle: 'Sıradan istifa' },
];

function sentenceWith(sents: string[], re: RegExp): string | undefined {
    return sents.find((s) => re.test(s) && s.length > 28);
}

function contrastFromText(blocks: string[]): RehberFork | null {
    const sents = blocks.flatMap(sentencesOf);
    for (const pair of FORK_PAIRS) {
        const same = sents.find((s) => pair.a.test(s) && pair.b.test(s));
        if (same) {
            const parts = same.split(/\b(veya|ya da|ile)\b/i).map((p) => p.trim()).filter((p) => p.length > 12);
            const leftPart = parts.find((p) => pair.a.test(p)) || same;
            const rightPart = parts.find((p) => pair.b.test(p) && p !== leftPart) || same;
            if (leftPart !== rightPart) {
                return {
                    title: 'Hangi kapı',
                    leftTitle: pair.leftTitle,
                    left: clip(leftPart, 140),
                    rightTitle: pair.rightTitle,
                    right: clip(rightPart, 140),
                };
            }
        }
        const left = sentenceWith(sents, pair.a);
        const right = sentenceWith(sents, pair.b);
        if (left && right && left !== right) {
            return {
                title: 'Hangi kapı',
                leftTitle: pair.leftTitle,
                left: clip(left, 140),
                rightTitle: pair.rightTitle,
                right: clip(right, 140),
            };
        }
    }
    return null;
}

function forkFromColonBullets(sections: VatandasArticle['sections']): RehberFork | null {
    const colonBullets = (sections || [])
        .flatMap((s) => s.bullets || [])
        .map(plain)
        .filter((b) => /[:—–]/.test(b) && b.length < 90);
    if (colonBullets.length < 2 || colonBullets.length > 4) return null;
    const split = (x: string) => {
        const parts = x.split(/[:—–]/).map((p) => p.trim());
        return { k: parts[0], v: parts.slice(1).join(': ') };
    };
    const A = split(colonBullets[0]);
    const B = split(colonBullets[1]);
    if (!A.v || !B.v) return null;
    return {
        title: 'Hangi kapı',
        leftTitle: clip(A.v, 28),
        left: A.k,
        rightTitle: clip(B.v, 28),
        right: B.k,
    };
}

function extractFork(article: VatandasArticle): RehberFork | null {
    const sections = article.sections || [];
    const fromBullets = forkFromColonBullets(sections);
    if (fromBullets) return fromBullets;

    const headed = sections.find((s) =>
        /iki|yoksa|hangi kapı|fark|anlaşmalı|çekişmeli|ilaml|noter|mahkeme|nereye|yol hangis|ayrım/i.test(
            s.heading
        )
    );
    if (headed) {
        const contrast = contrastFromText(headed.paragraphs || []);
        if (contrast) {
            return { ...contrast, title: plain(headed.heading).replace(/\?$/, '') };
        }
    }

    const fromAll = contrastFromText([
        article.lead || '',
        ...(sections.flatMap((s) => s.paragraphs || [])),
    ]);
    if (fromAll) return fromAll;

    const leadSents = sentencesOf(article.lead || '');
    const kural = leadSents.find((s) => /kural olarak/i.test(s));
    const ancak = leadSents.find((s) => /ancak|ne var ki|öte yandan/i.test(s) && s !== kural);
    if (kural && ancak) {
        return {
            title: 'Asıl ayrım',
            leftTitle: 'Kural',
            left: clip(kural, 140),
            rightTitle: 'İstisna',
            right: clip(ancak, 140),
        };
    }

    return null;
}

function extractConditions(article: VatandasArticle): VisualPlan['conditions'] {
    const out: VisualPlan['conditions'] = [];
    (article.sections || []).forEach((s, i) => {
        const items = (s.bullets || [])
            .map(plain)
            .filter((b) => b.length >= 8 && b.length <= 90);
        if (items.length >= 3 && items.length <= 8) {
            out.push({ heading: plain(s.heading), items, sectionIndex: i });
        }
    });
    return out.slice(0, 2);
}

function extractMeasures(article: VatandasArticle): RehberMeasure[] {
    const text = articleText(article);
    const out: RehberMeasure[] = [];

    if (/her (tam )?yıl/i.test(text) && /(30|otuz)\s*günlük/i.test(text) && /ücret/i.test(text)) {
        const note = /tavan/i.test(text) ? 'Yıllık tutar kanundaki tavanı aşamaz.' : undefined;
        out.push({
            kind: 'per-year',
            kicker: 'Hesabın omurgası',
            value: 'Her tam yıl için 30 günlük giydirilmiş ücret',
            note,
        });
    }

    const pctRe = /yüzde\s+(on|yirmi|otuz|elli|\d+)|%\s*(\d+)/gi;
    let m: RegExpExecArray | null;
    const seenPct = new Set<string>();
    while ((m = pctRe.exec(text))) {
        const raw = m[1] || m[2];
        const parsed = toAmount(raw);
        if (!parsed) continue;
        const key = String(parsed.n);
        if (seenPct.has(key)) continue;
        seenPct.add(key);
        const around = clip(text.slice(Math.max(0, m.index - 40), m.index + 80), 100);
        out.push({
            kind: 'percent',
            kicker: 'Kanundaki oran',
            value: `%${parsed.n}`,
            note: around,
        });
        if (out.length >= 3) break;
    }

    return out.slice(0, 2);
}

function extractTrap(article: VatandasArticle): string | null {
    const insight = plain(article.keyInsight || '');
    if (insight.length > 40) return insight;
    for (const s of (article.sections || []).flatMap((sec) => sec.paragraphs || [])) {
        const hit = sentencesOf(s).find((x) => /tuzak|kaçır|geçersiz|asla /i.test(x));
        if (hit) return clip(hit, 180);
    }
    return null;
}

function extractTable(article: VatandasArticle): VatandasTable | null {
    if (article.table?.headers?.length && article.table.rows?.length) return article.table;
    return null;
}

function extractAftermath(article: VatandasArticle): RehberAftermath | null {
    const sections = article.sections || [];
    const hit = sections.find((s) =>
        /sonra|ne olur|yön değiştir|sizi ne bekler|kesinleş|itiraz edince/i.test(s.heading)
    );
    if (!hit) return null;
    const beats = sentencesOf((hit.paragraphs || []).join(' ')).slice(0, 3);
    if (beats.length < 2) return null;
    if (beats.every((b) => b.length < 24)) return null;
    return { title: plain(hit.heading).replace(/\?$/, ''), beats: beats.map((b) => clip(b, 120)) };
}

export function buildVisualPlan(article: VatandasArticle): VisualPlan {
    const fork = extractFork(article);
    const conditions = extractConditions(article);
    return {
        clocks: extractClocks(article),
        fork,
        conditions,
        measures: extractMeasures(article),
        trap: extractTrap(article),
        table: extractTable(article),
        aftermath: extractAftermath(article),
    };
}

export function primaryStamp(clocks: RehberClock[], article: VatandasArticle): string {
    const week = clocks.find((c) => c.days <= 21);
    if (week) return `${week.amount} ${week.unit}`;
    const insight = plain(article.keyInsight || '').toLocaleLowerCase('tr-TR');
    const token = (t: string) =>
        new RegExp(`(?:^|[^\\p{L}\\p{N}])${t}(?:$|[^\\p{L}])`, 'iu').test(insight);
    const inInsight = clocks.find((c) => {
        const word = Object.entries(TR_NUM).find(([, n]) => String(n) === c.amount)?.[0];
        const hasAmount = token(c.amount) || (word ? token(word) : false);
        return hasAmount && token(c.unit);
    });
    if (inInsight) return `${inInsight.amount} ${inInsight.unit}`;
    const za = clocks.find((c) => /zamanaşımı|hak düşür/i.test(c.context));
    if (za) return `${za.amount} ${za.unit}`;
    if (clocks[0]) return `${clocks[0].amount} ${clocks[0].unit}`;
    return article.category;
}

export function visualSlotCount(article: VatandasArticle, plan = buildVisualPlan(article)): number {
    let n = 3; // hero + process + documents
    if (plan.clocks.length) n += 1;
    if (plan.fork) n += 1;
    if (plan.trap) n += 1;
    n += Math.min(plan.conditions.length, 2);
    if (plan.measures.length) n += 1;
    if (plan.table) n += 1;
    if (plan.aftermath) n += 1;
    return Math.min(n, 10);
}
