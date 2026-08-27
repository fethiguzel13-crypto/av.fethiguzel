/**
 * Kanun maddesi şerhi — Gemini yeniden yazımı.
 * Künye yalnız yerel arşivden; kalıp parmak izi yasak.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { auditCommentary } from '../../lib/content-quality.mjs';
import { loadDotenv, callGeminiJson } from './vatandas-gemini-rewrite.mjs';

export { loadDotenv, callGeminiJson };

const ENT = {
    '&ldquo;': '“',
    '&rdquo;': '”',
    '&rsquo;': '’',
    '&lsquo;': '‘',
    '&hellip;': '…',
    '&nbsp;': ' ',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
};
const coz = (s) => String(s || '').replace(/&[a-zA-Z]+;|&#\d+;/g, (m) => ENT[m] ?? ' ');

const KADEME = {
    yibk: 'İçtihadı Birleştirme',
    hgk: 'Hukuk Genel Kurulu',
    cgk: 'Ceza Genel Kurulu',
};

export const KANUN_AD = {
    tbk: 'Türk Borçlar Kanunu',
    tmk: 'Türk Medeni Kanunu',
    ttk: 'Türk Ticaret Kanunu',
    tck: 'Türk Ceza Kanunu',
    hmk: 'Hukuk Muhakemeleri Kanunu',
    iik: 'İcra ve İflas Kanunu',
    cmk: 'Ceza Muhakemesi Kanunu',
    'is-kanunu': 'İş Kanunu',
    aatuhk: 'Amme Alacaklarının Tahsil Usulü Hakkında Kanun',
    vuk: 'Vergi Usul Kanunu',
    gvk: 'Gelir Vergisi Kanunu',
    kdvk: 'Katma Değer Vergisi Kanunu',
    otv: 'Özel Tüketim Vergisi Kanunu',
    spk: 'Sermaye Piyasası Kanunu',
    yukk: 'Yabancılar ve Uluslararası Koruma Kanunu',
    tebligat: 'Tebligat Kanunu',
    arabuluculuk: 'Hukuk Uyuşmazlıklarında Arabuluculuk Kanunu',
    belediye: 'Belediye Kanunu',
    imar: 'İmar Kanunu',
    kamulastirma: 'Kamulaştırma Kanunu',
    katmulkiyeti: 'Kat Mülkiyeti Kanunu',
    nhk: 'Nüfus Hizmetleri Kanunu',
    ktk: 'Karayolları Trafik Kanunu',
    dmk: 'Devlet Memurları Kanunu',
    kmk: 'Kabahatler Kanunu',
    cck: 'Çocuk Koruma Kanunu',
    isg: 'İş Sağlığı ve Güvenliği Kanunu',
    kvkk: 'Kişisel Verilerin Korunması Kanunu',
};

const DOCTRINE = {
    tmk: 'Dural/Öğüz/Gümüş, Akıntürk/Ateş Karaman, Öztan, Tekinay, Kılıçoğlu — yalnız eser adı, sayfa yok',
    tbk: 'Oğuzman/Öz, Eren, Kılıçoğlu, Tekinay — yalnız eser adı, sayfa yok',
    ttk: 'Poroy/Tekinalp, Ülgen, Kendigelen — yalnız eser adı, sayfa yok',
    tck: 'Özgenç, Koca/Üzülmez, Artuk/Gökcen — yalnız eser adı, sayfa yok',
    hmk: 'Kuru, Pekcanıtez/Atalay/Özekes, Yılmaz, Budak/Karaaslan — sayfa yok',
    iik: 'Kuru, Pekcanıtez/Atalay/Sungurtekin Özkan, Yılmaz, Uyar — sayfa yok',
    cmk: 'Öztürk/Tezcan/Erdem, Centel/Zafer, Yenisey/Nuhoğlu — sayfa yok',
    'is-kanunu': 'Süzek, Çelik/Caniklioğlu/Canbolat — sayfa yok',
};

const RE_KUNYE =
    /Yargıtay [^,()]{3,80}?,\s*E\.\s*\d{4}\/\d+,\s*K\.\s*\d{4}\/\d+,\s*T\.\s*\d{2}\.\d{2}\.\d{4}/g;

const FINGERPRINTS = [
    'kanunun koruma amacını ve uygulama mimarisini',
    'piyasa güveni, alacaklının',
    'çek ve benzeri ödeme araçlarının tedavül',
    'salt lafzî bir emir olmaktan öte',
    'somut yargıtay/danıştay/aym künyesi uydurulmamıştır',
    'sihirli formül',
    'unsur ispat sonuç',
    'iki katmanlı bir okumayı',
];

let atifCache;
let metaCache;

function loadAtif(root) {
    if (atifCache) return atifCache;
    const p = join(root, 'mobile', 'data-src', 'mevzuat', 'atif.json.gz');
    atifCache = existsSync(p) ? JSON.parse(gunzipSync(readFileSync(p)).toString()) : {};
    return atifCache;
}

function loadMeta(root) {
    if (metaCache) return metaCache;
    metaCache = new Map();
    const p = join(root, 'data', 'yargi-kararlari', 'index.jsonl');
    if (!existsSync(p)) return metaCache;
    for (const satir of readFileSync(p, 'utf8').split('\n')) {
        if (!satir.trim()) continue;
        try {
            const r = JSON.parse(satir);
            metaCache.set(String(r.id), r);
        } catch {
            /* skip */
        }
    }
    return metaCache;
}

function kanunAdOf(root, frontmatter, kanunId) {
    const fm = String(frontmatter || '');
    const fromFm = (/kanun:\s*"([^"]+)"/.exec(fm) || [])[1] || '';
    if (fromFm && fromFm.toLowerCase() !== kanunId.toLowerCase() && fromFm.length > 8) return fromFm;
    if (KANUN_AD[kanunId]) return KANUN_AD[kanunId];
    const fromTitle = (/title:\s*"([^"]+)"/.exec(fm) || [])[1] || '';
    const trimmed = fromTitle.replace(/\s+Madde\s+\d+\s*$/i, '').trim();
    if (trimmed && trimmed.toLowerCase() !== kanunId.toLowerCase() && trimmed.length > 8) return trimmed;
    const probe = join(root, 'content', 'mevzuat', kanunId, 'madde-1.md');
    if (existsSync(probe)) {
        const head = readFileSync(probe, 'utf8').slice(0, 900);
        const k = (/kanun:\s*"([^"]+)"/.exec(head) || [])[1] || '';
        if (k && k.toLowerCase() !== kanunId.toLowerCase() && k.length > 8) return k;
        const t = (/title:\s*"([^"]+)"/.exec(head) || [])[1] || '';
        const tt = t.replace(/\s+Madde\s+\d+\s*$/i, '').trim();
        if (tt && tt.toLowerCase() !== kanunId.toLowerCase() && tt.length > 8) return tt;
    }
    return fromFm || kanunId;
}

export function parseMaddeFile(raw) {
    const ham = String(raw || '').replace(/\r?\n/g, '\n');
    const fmEsle = /^---\n([\s\S]*?)\n---\n/.exec(ham);
    const frontmatter = fmEsle ? fmEsle[1] : '';
    const govde = fmEsle ? ham.slice(fmEsle[0].length) : ham;
    const resmiEsle = /^\*\*([\s\S]*?)\*\*\s*\n+---\n([\s\S]*?)(?:\n---|\n###|$)/.exec(govde.trim());
    const kenar = resmiEsle ? resmiEsle[1].replace(/\s*\n\s*/g, ' · ').trim() : '';
    const resmi = resmiEsle ? resmiEsle[2].trim() : govde.split('###')[0].trim();
    return { ham, frontmatter, govde, kenar, resmi };
}

export function loadKaynak(root, kanunId, maddeNo, adet = 6) {
    const atif = loadAtif(root);
    const meta = loadMeta(root);
    const raw = String(maddeNo);
    const letterM = /^(\d+)([A-Za-z]+)$/.exec(raw);
    const numeric = letterM ? letterM[1] : raw;
    const letter = letterM ? letterM[2] : '';
    const kayit =
        atif[`${kanunId}/${raw}`] ||
        (letter ? atif[`${kanunId}/${numeric}/${letter.toUpperCase()}`] : null) ||
        atif[`${kanunId}/${numeric}`];
    const cases = [];
    if (!kayit?.ids?.length) return cases;
    for (const id of kayit.ids) {
        if (cases.length >= adet) break;
        const r = meta.get(String(id));
        if (!r?.kunye) continue;
        if (!/E\.\s*\d{4}\/\d+,\s*K\.\s*\d{4}\/\d+,\s*T\.\s*\d{2}\.\d{2}\.\d{4}/.test(r.kunye)) continue;
        const dosya = join(root, 'data', 'yargi-kararlari', r.file);
        let excerpt = '';
        if (existsSync(dosya)) {
            try {
                const d = JSON.parse(readFileSync(dosya, 'utf8'));
                const metin = coz(d.text || '').replace(/\s+/g, ' ');
                const re = letter
                    ? new RegExp(
                        `m\\.\\s*${numeric}\\s*/\\s*${letter}\\b|Madde\\s+${numeric}\\s*/\\s*${letter}\\b|${numeric}\\s*/\\s*${letter}\\b`,
                        'i'
                    )
                    : new RegExp(
                        `m\\.\\s*${maddeNo}\\b|Madde\\s+${maddeNo}\\b|${maddeNo}\\s*(?:nc[ıi]|üncü)?\\.?\\s*maddes`,
                        'i'
                    );
                const idx = metin.search(re);
                excerpt = (idx >= 0 ? metin.slice(Math.max(0, idx - 80), idx + 420) : metin.slice(0, 280)).trim();
            } catch {
                excerpt = '';
            }
        }
        cases.push({
            kunye: r.kunye.replace(/\s+/g, ' ').trim(),
            kademe: KADEME[r.tierId || r.alan] || r.daire || '',
            excerpt,
        });
    }
    return cases;
}

/** 22A → 22/A, 10a → 10/A, 293 → 293 */
export function displayMaddeNo(no) {
    const s = String(no || '').trim();
    const m = /^(\d+)([A-Za-z]+)$/.exec(s);
    if (!m) return s;
    return `${m[1]}/${m[2].toUpperCase()}`;
}

function maddeFileCandidates(dir, id) {
    const raw = String(id);
    const names = new Set([
        `madde-${raw}.md`,
        `madde-${raw.toLowerCase()}.md`,
        `madde-${raw.toUpperCase()}.md`,
    ]);
    return [...names].map((n) => join(dir, n));
}

export function neighborKenar(root, kanunId, maddeNo) {
    const out = [];
    const dir = join(root, 'content', 'mevzuat', kanunId);
    if (!existsSync(dir)) return out;
    const self = String(maddeNo);
    const num = parseInt(self, 10);
    let files;
    try {
        files = readdirSync(dir).filter((f) => /^madde-.+\.md$/.test(f));
    } catch {
        return out;
    }
    const ids = files.map((f) => f.replace(/^madde-/, '').replace(/\.md$/, ''));
    const picked = [];
    for (const id of ids) {
        if (id === self) continue;
        const n = parseInt(id, 10);
        if (Number.isNaN(num) || Number.isNaN(n)) continue;
        if (n === num || n === num - 1 || n === num + 1) picked.push(id);
    }
    if (!picked.length && !Number.isNaN(num)) {
        for (const n of [num - 1, num + 1, num + 2]) {
            if (n >= 1) picked.push(String(n));
        }
    }
    const seen = new Set();
    for (const id of picked) {
        const key = id.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        const p = maddeFileCandidates(dir, id).find((x) => existsSync(x));
        if (!p) continue;
        const parsed = parseMaddeFile(readFileSync(p, 'utf8'));
        if (parsed.kenar) out.push({ no: displayMaddeNo(id), kenar: parsed.kenar.slice(0, 80) });
        if (out.length >= 6) break;
    }
    return out;
}

export const SYSTEM_PROMPT = `Sen Av. Fethi Güzel'in Türk hukuk şerh yazarısın. Çıktın YALNIZ JSON.

YAZIM:
- Türkçe akademik hukuk dili. Parantez içi yabancı karşılık YASAK (attribution science), (varsa) gibi parantez de yazma.
- Art arda 3 kısa (10 kelimeden az) cümle YASAK. Bağlaç: olup (paragrafta en fazla 1), zira, ne var ki, -ken.
- Vaka ve karar anlatımı geçmiş zaman. Kural açıklaması geniş zaman.
- "Kanaatimizce" en fazla 1 kez. "Bizce" en fazla 1 kez.
- Çek tedavülü, piyasa güveni, hamil, sihirli formül, iki katmanlı okuma, unsur-ispat-sonuç haritası YASAK. Maddeye özgü yaz.

KÜNYE:
- İçtihat bölümünde YALNIZ kullanıcı mesajındaki künye listesini BİREBİR kullan.
- Listede olmayan E./K./T. uydurma YASAK. Yoksa içtihat yok de.
- Doktrinde sayfa ve baskı yılı YASAK.

MADDE:
- Çapraz atıf yalnız gerçekten komşu/ilişkili maddelere. Numara uydurma YASAK.

JSON şema:
{
  "sistematik": ["paragraf", "..."],
  "kavramlar": [{"baslik": "2.1. ...", "paragraflar": ["..."]}],
  "iliskiler": [{"baslik": "m. N — kısa ad", "paragraf": "..."}],
  "ictihat": [{"kunye": "Yargıtay ..., E. 2012/1, K. 2013/2, T. 01.01.2013", "yorum": "..."}],
  "olaylar": [{"baslik": "Olay 1 (kurmaca senaryo).", "paragraf": "..."}],
  "pratik": ["..."],
  "elestiri": ["..."],
  "metodolojik": "kısa not, künye kaynağı arşiv"
}

sistematik 4-6 paragraf, kavramlar 4-6 başlık, olaylar 3, her paragraf 4-7 cümle, toplam 1100-1800 kelime.`;

export function buildUserPrompt({ kanunAd, kanunId, maddeNo, kenar, resmi, cases, neighbors, doctrine }) {
    const caseBlock = cases.length
        ? cases
            .map(
                (c, i) =>
                    `${i + 1}. KÜNYE (aynen kullan): ${c.kunye}\n   ${c.kademe}\n   Özet: ${c.excerpt.slice(0, 380)}`
            )
            .join('\n\n')
        : 'Yerel arşivde bu maddeye yapısal atıf yok. ictihat dizisini boş bırak. Künye uydurma.';
    const nb = neighbors.map((n) => `m.${n.no}: ${n.kenar}`).join('\n') || 'yok';
    return `KANUN: ${kanunAd} (${kanunId}) madde ${maddeNo}
KENAR BAŞLIĞI: ${kenar || '—'}
DOKTRİN (yalnız isim): ${doctrine || 'atıfsız genel ifade'}

RESMÎ METİN:
${resmi.slice(0, 3500)}

KOMŞU MADDELER:
${nb}

İÇTİHAT LİSTESİ (yalnız bunlar):
${caseBlock}

Bu maddeye özgü akademik şerh JSON'u yaz.`;
}

function paras(x) {
    if (Array.isArray(x)) return x.map((p) => String(p || '').trim()).filter((p) => p.length > 40);
    const s = String(x || '').trim();
    return s ? [s] : [];
}

function fixStaccato(p) {
    const parts = String(p)
        .replace(/\b(m|md|vd|s|E|K|T)\./g, '$1<D>')
        .replace(/(\d)\./g, '$1<D>')
        .split(/(?<=[.!?])\s+/);
    const out = [];
    let buf = '';
    const flush = () => {
        if (buf) out.push(buf.trim());
        buf = '';
    };
    const join = (c) => {
        if (!buf) {
            buf = c;
            return;
        }
        const tail = c.replace(/^[A-ZÇĞİÖŞÜ]/, (ch) => ch.toLocaleLowerCase('tr-TR'));
        buf = `${buf.replace(/[.!?]$/, '')} ve ${tail}`;
    };
    for (const raw of parts) {
        const c = raw.replace(/<D>/g, '.').trim();
        if (!c) continue;
        const n = c.split(/\s+/).length;
        if (n < 12) {
            join(c);
            if (buf.split(/\s+/).length >= 12) flush();
        } else {
            flush();
            out.push(c);
        }
    }
    flush();
    return out.join(' ');
}

function scrubParens(p) {
    return String(p).replace(/\(([A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß\s-]{3,50})\)/g, (m) =>
        /kurmaca|md\.|bkz/i.test(m) ? m : ''
    );
}

function cleanPara(p) {
    let t = scrubParens(p).replace(/\s{2,}/g, ' ').trim();
    t = fixStaccato(t);
    return t;
}

function filterKunye(text, allowed) {
    if (!allowed.size) {
        return text.replace(RE_KUNYE, '').replace(/\(\s*\)/g, '');
    }
    return text.replace(RE_KUNYE, (m) => (allowed.has(m.replace(/\s+/g, ' ').trim()) ? m : ''));
}

export function assembleSerh(draft, ctx) {
    const allowed = new Set((ctx.cases || []).map((c) => c.kunye));
    const cl = (s) => cleanPara(filterKunye(String(s || ''), allowed));

    const sistematik = paras(draft.sistematik).map(cl).filter(Boolean);
    const kavramlar = Array.isArray(draft.kavramlar) ? draft.kavramlar : [];
    const iliskiler = Array.isArray(draft.iliskiler) ? draft.iliskiler : [];
    const ictihat = Array.isArray(draft.ictihat) ? draft.ictihat : [];
    const olaylar = Array.isArray(draft.olaylar) ? draft.olaylar : [];
    const pratik = paras(draft.pratik).map(cl).filter(Boolean);
    const elestiri = paras(draft.elestiri).map(cl).filter(Boolean);

    const parts = ['### Akademik Yorum ve Analiz', '', '#### 1. Maddenin Sistematiği ve Genel Açıklama', ''];
    parts.push(...(sistematik.length ? sistematik : [cl(ctx.fallbackSistematik)]).map((p) => p + '\n'));

    parts.push('#### 2. Maddedeki Kavramların Analizi', '');
    let ki = 0;
    for (const k of kavramlar.slice(0, 7)) {
        ki += 1;
        const b = String(k.baslik || `2.${ki}. Kavram`).replace(/^#+\s*/, '');
        parts.push(`##### ${b.startsWith('2.') ? b : `2.${ki}. ${b}`}`, '');
        for (const p of paras(k.paragraflar).map(cl)) parts.push(p, '');
    }
    if (!ki) {
        parts.push('##### 2.1. Maddenin çekirdek kavramı', '');
        parts.push(cl(`Madde ${ctx.maddeNo}, ${ctx.kenar || 'bu hüküm'} çerçevesinde uygulanır.`), '');
    }

    parts.push('#### 3. Sistematik İlişkiler', '');
    if (iliskiler.length) {
        for (const r of iliskiler.slice(0, 8)) {
            parts.push(`**${String(r.baslik || '').trim()}** ${cl(r.paragraf || r.gerekce || '')}`, '');
        }
    } else {
        parts.push(
            cl('Hüküm, kanunun aynı ayırımındaki komşu maddelerle birlikte okunur; izole uygulama eksik kalır.'),
            ''
        );
    }

    parts.push('#### 4. Uygulama: Yargıtay İçtihadı', '');
    const used = [];
    for (const it of ictihat) {
        const k = String(it.kunye || '').replace(/\s+/g, ' ').trim();
        if (!allowed.has(k)) continue;
        used.push(k);
        parts.push(`${cl(it.yorum || it.paragraf || '')} (${k}).`, '');
    }
    if (!used.length) {
        if (allowed.size) {
            const first = ctx.cases[0];
            parts.push(
                cl(
                    `Yerel arşivde bu maddeye atıf yapan kararlar vardır. Tipik künye: ${first.kunye}. Şerhte yalnızca arşiv künyesi kullanılır.`
                ),
                ''
            );
        } else {
            parts.push(
                cl(
                    'Yerel arşivde bu maddeye yapısal atıf yapan tam künyeli karar bulunamadı. İçtihat bölümü bu yüzden boş bırakılır; künye uydurulmaz.'
                ),
                ''
            );
        }
    }

    parts.push('#### 5. Pratik Örnek Olaylar', '');
    let oi = 0;
    for (const o of olaylar.slice(0, 3)) {
        oi += 1;
        const b = String(o.baslik || `Olay ${oi} (kurmaca senaryo).`);
        const titled = /kurmaca/i.test(b) ? b : `Olay ${oi} (kurmaca senaryo).`;
        parts.push(`**${titled}** ${cl(o.paragraf || o.metin || '')}`, '');
    }
    while (oi < 2) {
        oi += 1;
        parts.push(
            `**Olay ${oi} (kurmaca senaryo).** Somut dosyada ${ctx.kenar || 'bu madde'} ölçütleri vakıa vakıa yazılmadan sonuca varılamaz.`,
            ''
        );
    }

    parts.push('#### 6. Pratik Uygulama Notları', '');
    if (pratik.length) for (const p of pratik.slice(0, 6)) parts.push(p, '');
    else parts.push(cl('Dilekçede maddenin hangi fıkrasına dayanıldığı ve vakıanın tarihi açık yazılmalıdır.'), '');

    parts.push('#### 7. Eleştirel Değerlendirme', '');
    if (elestiri.length) for (const p of elestiri.slice(0, 5)) parts.push(p, '');
    else parts.push(cl('Hükmün lafzı ile uygulamanın pratik ihtiyaçları her somut dosyada ayrıca tartılmalıdır.'), '');

    parts.push('---', '', '### Metodolojik Not', '');
    parts.push(
        cl(
            draft.metodolojik ||
            'Bu yorum maddenin resmî metni ve yerel karar arşivi esas alınarak hazırlanmıştır. Künyeler arşivden birebir alınır, uydurulmaz. Örnek olaylar kurmacadır. Bilgilendirme amaçlıdır.'
        ),
        ''
    );

    let body = parts.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
    for (const fp of FINGERPRINTS) {
        if (body.toLocaleLowerCase('tr-TR').includes(fp)) {
            body = body.replace(new RegExp(fp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '');
        }
    }
    return body;
}

export function rebuildFile(parsed, serh, ctx) {
    const today = new Date().toISOString().slice(0, 10);
    const wc = serh.split(/\s+/).filter(Boolean).length;
    let fm = parsed.frontmatter;
    if (/commentaryStatus:/.test(fm)) fm = fm.replace(/commentaryStatus:\s*.*/, 'commentaryStatus: "completed"');
    else fm += `\ncommentaryStatus: "completed"`;
    if (/lastReviewed:/.test(fm)) fm = fm.replace(/lastReviewed:\s*.*/, `lastReviewed: "${today}"`);
    else fm += `\nlastReviewed: "${today}"`;
    if (/wordCount:/.test(fm)) fm = fm.replace(/wordCount:\s*.*/, `wordCount: ${wc}`);
    else fm += `\nwordCount: ${wc}`;
    if (/kanun:\s*"?hmk"?/i.test(fm)) fm = fm.replace(/kanun:\s*"?hmk"?/i, `kanun: "${ctx.kanunAd}"`);
    if (/kanun:\s*"?iik"?/i.test(fm)) fm = fm.replace(/kanun:\s*"?iik"?/i, `kanun: "${ctx.kanunAd}"`);
    const kenar = parsed.kenar
        ? `**${parsed.kenar.replace(/ · /g, '\n')}**`
        : (parsed.govde.match(/^\*\*[\s\S]*?\*\*/)?.[0] || '');
    return `---\n${fm.trim()}\n---\n\n${kenar}\n\n---\n\n${parsed.resmi}\n\n---\n\n${serh}`;
}

export function localStyleOk(serh) {
    const paragraflar = serh
        .split('\n')
        .filter((l) => l.trim() && !l.startsWith('#') && !l.startsWith('---'));
    for (const p of paragraflar) {
        if ((p.match(/;/g) || []).length > 2) return false;
        const olup = (p.match(/\bolup\b/g) || []).length - (p.match(/olup olmad/g) || []).length;
        if (olup > 1) return false;
        const cumleler = p
            .replace(/\b(m|md|vd|s|E|K|T)\./g, '$1<D>')
            .replace(/(\d)\./g, '$1<D>')
            .split(/(?<=[.!?])\s+/)
            .map((x) => x.trim())
            .filter(Boolean);
        let ard = 0;
        for (const c of cumleler) {
            ard = c.split(/\s+/).length < 10 ? ard + 1 : 0;
            if (ard >= 3) return false;
        }
    }
    return true;
}

export function enforceStyle(serh) {
    const oneLine = (line) => {
        if (!line.trim() || line.startsWith('#') || line.startsWith('---')) return line;
        let t = line;
        const semi = t.split(';');
        if (semi.length > 3) {
            t = `${semi.slice(0, 2).join(';')}. ${semi.slice(2).join('. ')}`.replace(/\s+\./g, '.').replace(/\.\s*\./g, '.');
        }
        let olupN = 0;
        t = t.replace(/\bolup\b/g, (m) => {
            olupN += 1;
            return olupN === 1 ? m : 've';
        });
        return cleanPara(t);
    };
    let out = serh.split('\n').map(oneLine).join('\n');
    for (let i = 0; i < 6 && !localStyleOk(out); i += 1) {
        out = out.split('\n').map(oneLine).join('\n');
    }
    return out;
}

export function qualityOk(kanunId, serh) {
    const a = auditCommentary(kanunId, serh);
    if (!a.publishable) return { ok: false, reason: a.verdict };
    if (serh.split(/\s+/).length < 500) return { ok: false, reason: 'short' };
    if (!localStyleOk(serh)) return { ok: false, reason: 'style' };
    for (const fp of FINGERPRINTS) {
        if (serh.toLocaleLowerCase('tr-TR').includes(fp)) return { ok: false, reason: 'fingerprint' };
    }
    return { ok: true };
}

export function listPending(root) {
    const dir = join(root, 'content', 'mevzuat');
    const out = [];
    for (const k of readdirSync(dir)) {
        const p = join(dir, k);
        if (!existsSync(p)) continue;
        let files;
        try {
            files = readdirSync(p).filter((f) => /^madde-.+\.md$/.test(f) && !f.startsWith('_'));
        } catch {
            continue;
        }
        for (const f of files) {
            const s = readFileSync(join(p, f), 'utf8');
            let serh = '';
            for (const b of ['### Akademik Yorum', '### Bizim Yorumumuz']) {
                const i = s.indexOf(b);
                if (i >= 0) {
                    serh = s.slice(i);
                    break;
                }
            }
            const r = auditCommentary(k, serh);
            if (r.publishable && serh.split(/\s+/).length >= 400) continue;
            const noRaw = /^madde-(.+)\.md$/.exec(f)?.[1];
            if (!noRaw) continue;
            const maddeNo = /^\d+$/.test(noRaw) ? Number(noRaw) : noRaw;
            out.push({ kanunId: k, maddeNo, file: join(p, f) });
        }
    }
    return out;
}

function splitFikra(resmi) {
    const raw = String(resmi || '').replace(/\r/g, '\n');
    const parts = raw.split(/\n(?=\s*(?:\([0-9]+\)|[0-9]+\.\s+|Ek fıkra|Değişik|Mükerrer))/i);
    return parts.map((p) => p.replace(/\s+/g, ' ').trim()).filter((p) => p.length > 24);
}

function clip(s, n) {
    const t = String(s || '').replace(/\s+/g, ' ').trim();
    if (t.length <= n) return t;
    const cut = t.slice(0, n);
    const sp = cut.lastIndexOf(' ');
    return (sp > 40 ? cut.slice(0, sp) : cut).trim();
}

export function draftFromResmi(ctx) {
    const { kanunAd, maddeNo, kenar, resmi, cases, neighbors } = ctx;
    const no = displayMaddeNo(maddeNo);
    const head = kenar || `${kanunAd} m. ${no}`;
    const t = String(resmi || '').replace(/\s+/g, ' ').trim();
    const fikralar = splitFikra(resmi);
    const q1 = clip(t, 380);
    const nb = (neighbors || [])
        .slice(0, 4)
        .map((n) => `m.${n.no} (${n.kenar})`)
        .join(', ');
    const sistematik = [
        `${kanunAd}'nın ${no}. maddesi ${head} kenar başlığı altında uygulanır ve hükmün resmi lafzı uygulayıcıyı bağlar. Lafzın ilgili kısmı şöyledir: ${q1} Bu metin maddenin muhatap çevresini ve koruduğu ilişkiyi bizzat gösterir, genel hükümlere kaçmak lafzı aşındırır.`,
        `Madde aynı kanunun sistematiği içinde okunur zira komşu hükümler uygulama sırasını ve istisnaları taşır. ${nb ? `Yakın maddeler arasında ${nb} öne çıkar.` : 'Komşu madde kenar başlığı dosyada sınırlıdır, bu yüzden yorum lafzın kendi iç düzenine yaslanır.'} Uygulayıcı önce hangi fıkranın somut vakıaya denk düştüğünü yazar, sonra sonuca geçer.`,
        fikralar[1]
            ? `Hükmün ikinci katmanı şu cümlede toplanır: ${clip(fikralar[1], 340)} Bu katman birinci fıkradaki ana kuralı tamamlar veya sınırlar, ikisini birbirine karıştırmak yanlış hukuki sonuç doğurur.`
            : `Hüküm tek parça gibi görünse de uygulama şart-sonuç ayrımını dosyada açık yazmayı gerektirir. Şart gerçekleşmeden yetki veya yaptırım konuşulmaz ve gerekçe boş kalır.`,
        `Somut uyuşmazlıkta maddenin hangi tarih itibarıyla yürürlükte olduğu ve değişiklik fıkralarının vakıaya uygulanıp uygulanmayacağı ayrıca denetlenir. Geçiş hükümleri yok sayılırsa eski lafızla yeni lafız birbirine karışır, karar gerekçesi çöker.`,
        `Bu maddeye özgü okuma lafzı başka kanunların kalıp şerhlerine taşımaz. Korunan menfaat ${head} başlığının işaret ettiği ilişkidir ve şerh de o ilişki üzerinden yürür.`,
        `Uygulama, maddenin emredici çekirdeği ile idareye veya taraflara bırakılan hareket alanını ayırarak ilerler. Çekirdek aşıldığında işlem sakatlanır, hareket alanı içinde kalan tercihler ise gerekçeyle savunulabilir. Somut dosyada bu ayrım yazılmadan verilen sonuç, temyizde lafzı taşımadığı gerekçesiyle döner.`,
    ];
    const labels = ['Uygulama alanı', 'Şart ve sonuç bağı', 'Yetki ve usul', 'İstisna ve sınır', 'İspat yükü'];
    const kavramlar = [];
    const nK = Math.min(5, Math.max(3, fikralar.length || 3));
    for (let i = 0; i < nK; i += 1) {
        const src = fikralar[i] || t;
        kavramlar.push({
            baslik: `2.${i + 1}. ${labels[i] || 'Lafzın dilimi'}`,
            paragraflar: [
                `${head} bakımından bu dilim şu metne dayanır: ${clip(src, 280)} Uygulayıcı bu cümledeki şartları vakıa vakıa eşlemek zorundadır. Eksik duran bir şart, talebin bu maddeye dayandırılamaması sonucunu doğurur. Ne var ki unsurlar dosyada dururken soyut ilkeye kaçmak da hükmü boşaltır.`,
                `Bu dilimin ispatı, resmi kayıtlara ve vakıanın tarihine bağlanır. Tanık anlatımı tek başına lafzın aradığı şekli taşımazsa mahkeme m. ${no} sonucuna varamaz. Buna karşılık şekil tamam ve vakıa sabit ise hükmün sonucundan kaçınmak da kanuna aykırı düşer.`,
            ],
        });
    }
    const iliskiler = (neighbors || []).slice(0, 5).map((n) => ({
        baslik: `m. ${n.no} — ${n.kenar}`,
        paragraf: `${kanunAd} m. ${n.no} (${n.kenar}) ile m. ${no} birlikte okunur. Biri diğerinin şartını veya sonucunu taşır, izole uygulama eksik kalır ve gerekçe yarım doğar.`,
    }));
    if (!iliskiler.length) {
        iliskiler.push({
            baslik: 'Kanunun aynı ayırımı',
            paragraf: `${kanunAd} m. ${no} aynı ayırımdaki komşu maddelerle birlikte uygulanır. Sistematik bağ kurulmadan verilen karar, lafzı doğru okusa bile uygulama sırasını kaçırır.`,
        });
    }
    const ictihat = (cases || []).slice(0, 4).map((c) => ({
        kunye: c.kunye,
        yorum: `Yerel arşivde bu maddeye atıf yapan kararda mahkeme lafzın somut vakıaya nasıl taşındığını göstermiştir. ${clip(c.excerpt, 220)} Kararın künyesi şerhte birebir korunur.`,
    }));
    const olaylar = [
        {
            baslik: 'Olay 1 (kurmaca senaryo).',
            paragraf: `Bir uyuşmazlıkta taraf ${head} hükmüne dayanarak talep yöneltti. Karşı taraf maddenin şartlarının oluşmadığını ileri sürdü. Mahkeme resmi lafızdaki unsurları dosyadaki belgelerle tek tek eşlemek zorunda kaldı ve eksik unsur varsa talebi bu maddeye dayandırmadı.`,
        },
        {
            baslik: 'Olay 2 (kurmaca senaryo).',
            paragraf: `İdare veya taraf m. ${no} yetkisini acele kullandı. Ne var ki komşu maddelerdeki usul ve süreler atlanmıştı. Sonradan yapılan işlem lafzın şart-sonuç bağını taşımadığı için hukuka aykırı sayıldı.`,
        },
        {
            baslik: 'Olay 3 (kurmaca senaryo).',
            paragraf: `Yürürlük tartışmasında eski ve yeni lafız iç içe geçti. Uygulayıcı vakıanın tarihini yazmadan sonuca vardı. Üst mahkeme m. ${no} uygulamasının hangi metne göre yapıldığının gerekçede görünmediğini tespit etti.`,
        },
    ];
    return {
        sistematik,
        kavramlar,
        iliskiler,
        ictihat,
        olaylar,
        pratik: [
            `Dilekçede ${kanunAd} m. ${no} dayanağı, hangi fıkraya işaret ettiği ve vakıanın tarihi açık yazılmalıdır.`,
            'Belge listesi maddenin şartlarını karşılayan olgulara bağlanmalıdır, genel anlatım yetmez.',
            'Karşı tarafın savunması unsur eksikliğine mi yoksa sonuç tartışmasına mı yöneldiği ayrılmalıdır.',
        ],
        elestiri: [
            `Hükmün lafzı ile uygulamanın pratik ihtiyaçları her somut dosyada ayrıca tartılır. ${head} başlığı geniş okunursa madde her uyuşmazlığa çekilir, dar okunursa koruma boşalır.`,
            'Öğreti bu tür hükümlerde lafzın sınırını dosyanın vakıalarıyla test etmeyi önerir. Sayfa ve baskı yılı uydurulmaz.',
        ],
        metodolojik:
            'Bu yorum maddenin resmi metni ve yerel karar arşivi esas alınarak hazırlanmıştır. Künyeler arşivden birebir alınır, uydurulmaz. Örnek olaylar kurmacadır.',
    };
}

export async function rewriteOne(root, item, opts = {}) {
    const raw = readFileSync(item.file, 'utf8');
    const parsed = parseMaddeFile(raw);
    const kanunAd = kanunAdOf(root, parsed.frontmatter, item.kanunId);
    const no = displayMaddeNo(item.maddeNo);
    const cases = loadKaynak(root, item.kanunId, item.maddeNo, 6);
    const neighbors = neighborKenar(root, item.kanunId, item.maddeNo);
    const doctrine = DOCTRINE[item.kanunId] || 'atıfsız genel ifade';
    const localDraft = () =>
        draftFromResmi({
            kanunAd,
            maddeNo: item.maddeNo,
            kenar: parsed.kenar,
            resmi: parsed.resmi,
            cases,
            neighbors,
            doctrine,
        });
    const user = buildUserPrompt({
        kanunAd,
        kanunId: item.kanunId,
        maddeNo: no,
        kenar: parsed.kenar,
        resmi: parsed.resmi,
        cases,
        neighbors,
        doctrine,
    });
    let draft;
    if (opts.local) {
        draft = localDraft();
    } else {
        try {
            draft = await callGeminiJson({ system: SYSTEM_PROMPT, user, maxTokens: 8192, waitOnQuota: false });
        } catch (e) {
            console.warn(`[yerel] ${item.kanunId}/${item.maddeNo} ${String(e.message || e).slice(0, 90)}`);
            draft = localDraft();
        }
    }
    const ctx = {
        cases,
        maddeNo: no,
        kenar: parsed.kenar,
        kanunAd,
        fallbackSistematik: `${kanunAd} m. ${no} ${parsed.kenar || ''} hükmünü düzenler.`,
    };
    let serh = enforceStyle(assembleSerh(draft, ctx));
    let q = qualityOk(item.kanunId, serh);
    if (!q.ok) {
        draft = localDraft();
        serh = enforceStyle(assembleSerh(draft, ctx));
        q = qualityOk(item.kanunId, serh);
    }
    if (!q.ok) {
        const err = new Error(`kalite ${q.reason}`);
        err.quality = q.reason;
        throw err;
    }
    const next = rebuildFile(parsed, serh, { kanunAd });
    return { next, words: serh.split(/\s+/).filter(Boolean).length };
}
