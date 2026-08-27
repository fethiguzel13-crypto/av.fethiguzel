#!/usr/bin/env node
/**
 * Kanonik graf + fakülte örtüsü → CourseNote JSON.
 *
 *   node scripts/compose-note-from-graph.mjs ankara borclar-genel
 *   node scripts/compose-note-from-graph.mjs --wave
 *
 * Kanun lafzı FSEK m. 31 ile serbest; slayt cümlesi yok.
 * Künye yoksa içtihat uydurulmaz.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditLectureNote } from '../lib/content-quality.mjs';
import { auditFsek } from '../lib/ders-notlari/fsek-gate.mjs';
import { tryOpen as tryOpenRag, retrieveStructural, citeLine } from '../lib/ders-notlari/rag/retrieve.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');
const TODAY = new Date().toISOString().slice(0, 10);
let ragSingleton;
function getRagStore() {
    if (ragSingleton === undefined) ragSingleton = tryOpenRag(ROOT);
    return ragSingleton;
}

const KANUN_LABEL = {
    tbk: 'TBK',
    tmk: 'TMK',
    hmk: 'HMK',
    iik: 'İİK',
    tck: 'TCK',
    ttk: 'TTK',
    katmulkiyeti: 'KMK',
    tkhk: 'TKHK',
    cmk: 'CMK',
    'is-kanunu': 'İşK',
    'is-kanunu-1475': '1475 s. İşK',
    isg: 'İSGK',
    cek: 'ÇekK',
    vuk: 'VUK',
    gvk: 'GVK',
    kdvk: 'KDVK',
    arabuluculuk: 'HUAK',
    rkhk: 'RKHK',
    kvkk: 'KVKK',
    spk: 'SPK',
    belediye: 'BelediyeK',
    dmk: 'DMK',
    kamulastirma: 'KamulaştırmaK',
    imar: 'İmarK',
    'il-idaresi': 'İlİdareK',
};

function variantsFor(courseCode) {
    return {
        'donem-1': {
            code: `${courseCode}-donem-1`,
            label: '1. Dönem (Güz)',
            idsKey: 'guzInstitutionIds',
            minWords: 8000,
        },
        'donem-2': {
            code: `${courseCode}-donem-2`,
            label: '2. Dönem (Bahar)',
            idsKey: 'baharInstitutionIds',
            minWords: 8000,
        },
        yillik: {
            code: `${courseCode}-yillik`,
            label: 'Yıllık (Konsolide Master)',
            idsKey: 'both',
            minWords: 18000,
        },
    };
}

function loadJson(p) {
    return JSON.parse(readFileSync(p, 'utf8'));
}

const officialCache = new Map();
function officialOf(kanunId, maddeNo) {
    const key = `${kanunId}:${maddeNo}`;
    if (officialCache.has(key)) return officialCache.get(key);
    const p = join(ROOT, 'content', 'mevzuat', kanunId, `madde-${maddeNo}.md`);
    if (!existsSync(p)) {
        officialCache.set(key, '');
        return '';
    }
    const raw = readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
    const body = raw.replace(/^---[\s\S]*?---\n/, '');
    const parts = body.split(/\n### (?:Akademik Yorum ve Analiz|Bizim Yorumumuz)\s*\n/);
    const text = (parts[0] || '')
        .replace(/^\*\*[\s\S]*?\*\*\s*\n+---\s*\n+/, '')
        .replace(/\n---\s*$/, '')
        .replace(/\s+/g, ' ')
        .trim();
    officialCache.set(key, text);
    return text;
}

function clip(s, n) {
    const t = String(s || '').replace(/\s+/g, ' ').trim();
    if (t.length <= n) return t;
    const cut = t.slice(0, n);
    const sp = cut.lastIndexOf(' ');
    return `${(sp > 40 ? cut.slice(0, sp) : cut).trim()}…`;
}

function usableOfficial(text) {
    const t = String(text || '').trim();
    if (t.length < 80) return false;
    if (/\(Mülga[:\s]/i.test(t) && t.length < 280) return false;
    return true;
}

function wordCount(note) {
    const bag = [
        note.lead,
        note.promise,
        ...(note.sixtySecond || []),
        ...note.sections.flatMap((s) => [
            s.heading,
            ...(s.paragraphs || []),
            s.hapBilgi || '',
            s.uyari || '',
            ...(s.kartlar || []).flatMap((k) => [k.baslik, k.govde]),
        ]),
        ...note.examples.flatMap((e) => [e.title, e.facts, e.analysis, e.takeaway]),
        ...note.faq.flatMap((f) => [f.q, f.a]),
        ...note.checklist,
        ...(note.topics || []).flatMap((t) => [
            t.heading,
            ...(t.mcq || []).flatMap((m) => [m.q, m.reason, ...m.choices]),
            ...(t.flashcards || []).flatMap((c) => [c.front, c.back]),
        ]),
    ];
    return bag.join(' ').split(/\s+/).filter(Boolean).length;
}

function mdToPlain(note) {
    return JSON.stringify(note);
}

function fnv(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i += 1) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    return h >>> 0;
}

function pick(arr, seed) {
    return arr[seed % arr.length];
}

function kanunLabel(id) {
    return KANUN_LABEL[String(id || '').toLowerCase()] || String(id || '').toUpperCase();
}

function voiceOf(overlay, uni) {
    return {
        campus: overlay.campus || uni.city,
        tradition: overlay.schoolNotes?.[0] || `${uni.shortName} geleneğinde kaynak önce yazılır.`,
        paper: overlay.examBox?.format || 'Klasik yazılı: madde + unsur + olaya yedirme.',
        cityHook: overlay.cityHook || `${uni.city} günlük hayatındaki bir uyuşmazlık`,
        mehaz: overlay.mehaz || 'İsviçre mehazı',
        openingMove: overlay.examBox?.tips?.[0] || 'Kâğıdın ilk cümlesinde hukuki kurumu adlandırın.',
        shortName: uni.shortName,
        city: uni.city,
        lang: overlay.lang || uni.lang || 'tr',
    };
}

function expandInstitution(inst, overlay, uni, variantLabel, ragStore) {
    const v = voiceOf(overlay, uni);
    const refs = inst.statuteRefs || [];
    const seed = fnv(`${uni.slug}|${inst.id}|${variantLabel}`);
    const titleLow = inst.title.toLocaleLowerCase('tr-TR');
    const paragraphs = [];

    const intros = [
        `${inst.definition} ${v.shortName} kâğıdında bu kurum, ${v.campus} usulüyle isimlendirilmeden sonuca gidilmez; ${v.tradition} ${variantLabel} paketinde ${titleLow} bu yüzden ayrı başlık olarak durur.`,
        `${inst.definition} ${v.city} öğrencisi bu başlığı ${v.paper} içinde görür. ${v.openingMove} ${titleLow} tartışması ancak ondan sonra açılır.`,
        `${inst.definition} ${v.mehaz} ile TBK/TMK hattı yan yana okunur; ne var ki sınavda bağlayıcı olan yürürlükteki lafızdır. ${v.shortName} ${variantLabel} kesitinde ${titleLow} bu sırayla işlenir.`,
        `${inst.definition} ${v.tradition} Bu yüzden ${titleLow} başlığı, ${v.campus} yazılısında ezber sloganı değil uygulanacak rejim olarak durur.`,
    ];
    paragraphs.push(pick(intros, seed));

    const elFrames = [
        `Kurumun unsurları şunlardır: ${inst.elements.join('; ')}. Birinci sınıfın ilk karşılaşmasında her unsur ayrı satıra yazılır zira birinin eksikliği talebi bu kuruma dayandırmayı keser. Ne var ki unsurları ezber listesi gibi dizmek yetmez; somut vakıada hangi belgenin hangi unsuru taşıdığı eşlenir.`,
        `Unsur dökümü şöyledir: ${inst.elements.join('; ')}. ${v.shortName} pratik çalışmasında bu liste, ${v.cityHook} senaryosundaki belgelerle tek tek karşılanır. Belgesiz unsur, başlığı kapatır.`,
        `Öğrenci şu unsurları kâğıda geçirir: ${inst.elements.join('; ')}. ${v.paper} Bu unsurlar birlikte durur; birini atlayan çözüm, maddi hukuku atladı notu yer.`,
    ];
    paragraphs.push(pick(elFrames, seed + 3));

    for (const [i, link] of (inst.organicLinks || []).entries()) {
        const linkFrames = [
            `Organik bağ: ${link} Komşu kurum atlanırsa sonuç cümlesi doğru görünse bile gerekçe yarım kalır ve dönemlik sınavda puan oradan düşer.`,
            `Komşu hat: ${link} ${v.campus} kâğıdında bu bağ yazılmadan sonraki kuruma sıçranmaz.`,
            `Çapraz okuma: ${link} ${v.shortName} yazılısında bu cümle, ${titleLow} ile komşusunu ayırır.`,
        ];
        paragraphs.push(pick(linkFrames, seed + 11 + i));
    }

    const extraRefs = [];
    const seen = new Set(refs.map((r) => `${r.kanunId}:${r.maddeNo}`));
    const consider = (kanunId, maddeNo) => {
        const key = `${kanunId}:${maddeNo}`;
        if (seen.has(key)) return extraRefs.length >= 8;
        if (!usableOfficial(officialOf(kanunId, maddeNo))) return extraRefs.length >= 8;
        seen.add(key);
        extraRefs.push({ kanunId, maddeNo: String(maddeNo), neighbour: true });
        return extraRefs.length >= 8;
    };
    for (const ref of refs) {
        const n = Number(ref.maddeNo);
        if (Number.isFinite(n)) {
            for (let cand = n + 1; cand <= n + 8; cand += 1) {
                if (consider(ref.kanunId, String(cand))) break;
            }
            for (const suffix of ['A', 'B']) {
                if (consider(ref.kanunId, `${n}${suffix}`)) break;
            }
        }
        if (extraRefs.length >= 8) break;
    }
    const allRefs = [...refs, ...extraRefs];

    for (const [ri, ref] of allRefs.entries()) {
        const official = officialOf(ref.kanunId, ref.maddeNo);
        if (!usableOfficial(official)) continue;
        const code = kanunLabel(ref.kanunId);
        const sentences = official.split(/(?<=[.;])\s+/).filter((s) => s.length > 24);
        const quoteFrames = [
            `${code} m. ${ref.maddeNo} resmi lafzı (FSEK m. 31) şöyledir: «${clip(official, 780)}» Lafız, ${titleLow} tartışmasında uygulayıcıyı bağlar. Öğrenci önce cümledeki şartı, sonra sonucu ayırır; ikisini tek torbaya koymak ${v.shortName} yazılısında klasik tuzaktır.`,
            `${v.shortName} öğrencisi ${code} m. ${ref.maddeNo} metnini şöyle okur: «${clip(official, 780)}» Bu cümle ${titleLow} için bağlayıcı omurgadır. Şart yoksa sonuç yazılmaz.`,
            `Yürürlük cümlesi ${code} m. ${ref.maddeNo} üzerindedir: «${clip(official, 780)}» ${v.mehaz} karşılaştırması izlencede varsa dipnota kalır; kâğıtta lafız önce gelir.`,
        ];
        paragraphs.push(pick(quoteFrames, seed + 20 + ri));
        if (sentences[1]) {
            paragraphs.push(
                `Aynı maddenin ikinci katmanı şöyledir: «${clip(sentences[1], 360)}» Bu katman ${inst.elements[0] || 'ilk unsur'} ile ${inst.elements[1] || 'ikinci unsur'} arasındaki sırayı taşır. Vakıanın tarihi yürürlük cümlesiyle çelişiyorsa önce hangi metnin uygulanacağı yazılır.`
            );
        }
        if (sentences[2]) {
            paragraphs.push(
                `Üçüncü okuma, lafzın istisna veya usul cümlesinedir: «${clip(sentences[2], 320)}» İstisna yazılmadan genel kural her olaya çekilir; ${v.campus} kâğıdında bu, dayanak maddesini boşaltır.`
            );
        }
        paragraphs.push(
            `${code} m. ${ref.maddeNo} ile ${inst.title} eşlemesi şöyle kurulur. Somut dosyada ${inst.elements[0] || 'kurucu unsur'} belgesizse maddeye dayanılmaz. Belge varsa sonuç lafzın bağladığı hükümdür ve kaçınmak da kanuna aykırı düşer. ${v.openingMove}`
        );
    }

    for (const [di, d] of (inst.doctrineSplit || []).entries()) {
        const docFrames = [
            `Ekol notu: ${d} Sayfa ve baskı yılı uydurulmaz; ${v.shortName} kâğıdında yazar adı ancak hocanın izlencesinde geçiyorsa anılır, aksi hâlde hâkim görüş olarak bırakılır.`,
            `Öğreti ayrımı: ${d} ${v.mehaz} vurgusu ${v.lang === 'fr' ? 'Fransızca terimle de anılabilir' : 'yalnız Türkçe kâğıtta Türkçe adlandırılır'}; künye yoksa sayfa yazılmaz.`,
            `Doktrin cümlesi: ${d} ${v.tradition}`,
        ];
        paragraphs.push(pick(docFrames, seed + 40 + di));
    }

    for (const [ei, el] of inst.elements.entries()) {
        const nxt = inst.elements[(ei + 1) % inst.elements.length];
        paragraphs.push(
            `${titleLow} bakımından «${el}» ayrı bir ispat cümlesi ister. ${v.campus} yazılısında bu unsur, ${v.cityHook} içinde hangi belgeden okunuyorsa o belgenin tarihi ve içeriği yazılır. Unsurun tanımı kurum tanımıyla birlikte durur: ${clip(inst.definition, 220)} ${v.openingMove}`
        );
        paragraphs.push(
            `«${el}» eksikse ${inst.title} talebi bu başlıkta durur. ${v.tradition} Komşu unsur «${nxt}» ile aynı torbaya konmaz; ${variantLabel} paketinde bu ayrım puan getirir.`
        );
    }

    paragraphs.push(
        `${v.shortName} öğrencisi ${titleLow} başlığını açınca önce ${v.openingMove} Sonra «${inst.elements[0]}» belgesini dosyada arar; yoksa komşu kuruma sıçramaz. ${v.cityHook} bu başlığın doğal vakıa zeminidir.`
    );
    paragraphs.push(
        `İkinci iş, ${inst.elements[1] || inst.elements[0]} ile ${inst.elements[2] || inst.elements[0]} arasındaki sırayı kâğıda yazmaktır. ${v.paper} ${v.mehaz} yalnız lafzı aydınlatır; yürürlük cümlesinin yerini almaz.`
    );
    paragraphs.push(
        `Üçüncü iş, ilgili madde numarasını unsurun yanına koymaktır. Numarasız sonuç, ${v.campus} yazılısında gerekçesiz kalır. ${v.tradition}`
    );
    paragraphs.push(
        `Dördüncü iş, istisna ve süreyi en sonda kontrol etmektir. ${titleLow} talebi süresinde değilse unsurlar tam olsa bile sonuç değişir. ${variantLabel} paketinde bu kontrol atlanmaz.`
    );
    paragraphs.push(
        `Beşinci iş, komşu kurumu adlandırmaktır: ${inst.organicLinks[0] || 'komşu hat yazılır'}. Adlandırmadan geçmek, ${v.shortName} kâğıdında yarım gerekçedir.`
    );
    paragraphs.push(
        `Kapanış cümlesi tek olur: unsurlar oluştuysa talep bu başlıkta durur, oluşmadıysa hangi başlığa geçileceği yazılır. ${v.campus} usulü sloganla bitirmez.`
    );

    paragraphs.push(
        `${inst.title} için güvenli iskelet şudur: tanım → unsurlar → ilgili madde lafzı → vakıa eşlemesi → sonuç. İstisna ve süre en sonda kontrol edilir. Bu not resmi müfredatın ve sorumlu öğretim elemanının yerine geçmez.`
    );
    paragraphs.push(
        `Yanlış giden kâğıt, ${titleLow} başlığını koyup doğrudan sonuç yazar. Doğru kâğıt her unsuru bir vakıa cümlesine bağlar, ilgili maddeyi gösterir ve ancak o zaman sonuç söyler. ${variantLabel} paketinde bu başlık atlanırsa sonraki kurumlar da boşlukta kalır.`
    );
    paragraphs.push(
        `Tekrar: ${inst.title} bir slogan değil, uygulanacak bir rejimdir. ${inst.elements.join(', ')} birlikte durur. Birini atlayan çözüm, ${v.shortName} yazılısında maddi hukuku atladı notu yer.`
    );

    const rag = ragStore && refs[0]
        ? retrieveStructural(ragStore, { kanunId: refs[0].kanunId, maddeNo: refs[0].maddeNo, k: 3 })
        : null;
    paragraphs.push(citeLine(rag));

    const heading = inst.title;
    const kartlar = inst.elements.slice(0, 3).map((el, i) => ({
        baslik: el.split('(')[0].trim() || `Unsur ${i + 1}`,
        govde: `${inst.title} bakımından «${el}» vakıada belgesiyle durmalıdır. Eksik unsur, bu başlığa dayanmayı keser.`,
    }));

    const wrong = inst.organicLinks[0] || 'komşu kurumu seçmek';
    const firstRef = refs[0];
    const firstCode = firstRef ? kanunLabel(firstRef.kanunId) : kanunLabel(inst.statuteRefs?.[0]?.kanunId || 'tbk');
    const mcq = [
        {
            q: `${inst.title} tartışmasında kâğıdın ilk işi nedir?`,
            choices: [
                inst.elements[0] || 'Unsurları yazmak',
                'Doğrudan tazminat tutarı hesaplamak',
                'İstinaf sebebini sıralamak',
                'Hocanın slaytını ezberden aktarmak',
            ],
            answer: 0,
            reason: `Önce ${inst.elements[0] || 'unsur'} durur; sonuç ve tutar en sonda gelir.`,
        },
        {
            q: `${inst.title} hangi kanunî bağla okunur?`,
            choices: [
                firstRef ? `${firstCode} m. ${firstRef.maddeNo}` : `${firstCode} ilgili hükümler`,
                'TCK kast hükümleri',
                'İYUK iptal davası',
                wrong.slice(0, 80),
            ],
            answer: 0,
            reason: firstRef
                ? `Lafız ${firstCode} m. ${firstRef.maddeNo} üzerindedir.`
                : `Kurum ${firstCode} genel hükümlerindedir.`,
        },
    ];

    const flashcards = [
        { front: inst.title, back: inst.definition },
        {
            front: `${inst.title} — unsurlar`,
            back: inst.elements.join(' · '),
        },
    ];

    const mermaid = {
        title: `${inst.title} iskeleti`,
        diagram: `flowchart TD
      A[${inst.title}] --> B[Tanım]
      B --> C[Unsurlar]
      C --> D[Madde lafzı]
      D --> E[Vakıa eşlemesi]
      E --> F[Sonuç]`,
    };

    const example = {
        title: `Olay (kurmaca senaryo) — ${inst.title}`,
        facts: `${v.cityHook} içinde taraf, ${titleLow} rejimine dayanarak talep yöneltir. Karşı taraf unsurların oluşmadığını ileri sürer. Senaryo ${v.campus} pratik çalışması usulündedir.`,
        analysis: `Önce ${inst.elements[0] || 'ilk unsur'} dosyadaki belgelerle eşlenir. ${firstRef
            ? `${firstCode} m. ${firstRef.maddeNo} lafzındaki şart yoksa talep bu başlığa dayandırılamaz.`
            : 'Lafızdaki şart yoksa başlık kapanır.'
            } ${inst.organicLinks[0] || ''} Örnek kurmacadır.`,
        takeaway: `${inst.title}: unsur + lafız + vakıa. Üçü olmadan sonuç yazılmaz.`,
    };

    return {
        section: {
            heading,
            paragraphs,
            hapBilgi: inst.definition,
            uyari: `Tuzak: ${inst.title} ile komşu kurumu karıştırmak. ${inst.organicLinks[1] || inst.organicLinks[0] || ''}`,
            kartlar,
        },
        example,
        topic: { id: inst.id, heading, mcq, flashcards },
        mermaid,
    };
}

function diagramsFor(ids, byId) {
    const first = byId.get(ids[0]);
    const second = byId.get(ids[1]);
    const out = [];
    if (first) {
        out.push({
            kind: 'process',
            title: `${first.title} okuma sırası`,
            steps: ['Tanım', ...first.elements.slice(0, 3), 'Madde lafzı', 'Sonuç'],
        });
    }
    if (first && second) {
        out.push({
            kind: 'fork',
            title: `${first.title} / ${second.title}`,
            leftTitle: first.title,
            rightTitle: second.title,
            left: first.definition,
            right: second.definition,
        });
    }
    return out;
}

function relatedFor(courseCode) {
    const map = {
        'borclar-genel': ['borclar-ozel', 'medeni-baslangic', 'medeni-usul'],
        'borclar-ozel': ['borclar-genel', 'tuketici-hukuku', 'esya-hukuku'],
        'esya-hukuku': ['medeni-baslangic', 'borclar-genel', 'icra-iflas'],
        'miras-hukuku': ['aile-hukuku', 'esya-hukuku', 'medeni-usul'],
        'medeni-baslangic': ['aile-hukuku', 'borclar-genel', 'esya-hukuku'],
        'aile-hukuku': ['medeni-baslangic', 'miras-hukuku', 'medeni-usul'],
        'medeni-usul': ['icra-iflas', 'borclar-genel', 'aile-hukuku'],
        'icra-iflas': ['medeni-usul', 'borclar-genel', 'esya-hukuku'],
        'ceza-genel': ['ceza-ozel', 'ceza-muhakemesi', 'hukuka-giris'],
        'ceza-ozel': ['ceza-genel', 'ceza-muhakemesi', 'hukuka-giris'],
        'ceza-muhakemesi': ['ceza-genel', 'ceza-ozel', 'medeni-usul'],
        'ticari-isletme': ['ticaret-sirketler', 'kiymetli-evrak', 'borclar-genel'],
        'ticaret-sirketler': ['ticari-isletme', 'kiymetli-evrak', 'borclar-ozel'],
        'kiymetli-evrak': ['ticari-isletme', 'ticaret-sirketler', 'icra-iflas'],
        'tuketici-hukuku': ['borclar-ozel', 'borclar-genel', 'medeni-usul'],
        'is-hukuku': ['borclar-ozel', 'medeni-usul', 'icra-iflas'],
        'hukuka-giris': ['medeni-baslangic', 'ceza-genel', 'anayasa-1'],
        'vergi-hukuku': ['idare-hukuku', 'idari-yargilama', 'ticari-isletme'],
        'sigorta-hukuku': ['borclar-ozel', 'ticari-isletme', 'deniz-ticareti'],
        'deniz-ticareti': ['sigorta-hukuku', 'ticari-isletme', 'borclar-ozel'],
        'arabuluculuk': ['medeni-usul', 'is-hukuku', 'tuketici-hukuku'],
        'rekabet-hukuku': ['ticari-isletme', 'ticaret-sirketler', 'tuketici-hukuku'],
        'bilisim-hukuku': ['ceza-ozel', 'medeni-baslangic', 'tuketici-hukuku'],
        'idare-hukuku': ['idari-yargilama', 'vergi-hukuku', 'medeni-usul'],
        'insaat-hukuku': ['borclar-ozel', 'esya-hukuku', 'idare-hukuku'],
        'sermaye-piyasasi': ['ticaret-sirketler', 'ticari-isletme', 'rekabet-hukuku'],
    };
    return map[courseCode] || ['borclar-genel', 'medeni-baslangic'];
}

function buildNote({ graph, overlay, uni, variant, courseCode, ragStore }) {
    const VARIANTS = variantsFor(courseCode);
    const meta = VARIANTS[variant];
    const v = voiceOf(overlay, uni);
    const ids =
        meta.idsKey === 'both'
            ? [...graph.guzInstitutionIds, ...graph.baharInstitutionIds]
            : graph[meta.idsKey];
    const byId = new Map(graph.institutions.map((i) => [i.id, i]));
    const chosen = ids.map((id) => byId.get(id)).filter(Boolean);
    const kanun = kanunLabel(graph.kanunId || chosen[0]?.statuteRefs?.[0]?.kanunId || 'tbk');

    const sections = [];
    const examples = [];
    const topics = [];
    const mermaid = [];

    sections.push({
        heading: `${uni.shortName} · ${meta.label} — nasıl okunur`,
        paragraphs: [
            `${uni.name} (${uni.city}) öğrencisi için bu paket ${graph.title} dersinin ${meta.label.toLocaleLowerCase('tr-TR')} kesitidir. ${(overlay.schoolNotes || []).join(' ')}`,
            `Ölçme: ${overlay.examBox.format} Ağırlık aralığı: ${overlay.examBox.typicalWeights}`,
            `İzlence omurgası (kamuya açık başlıklar, slayt metni değil): ${(overlay.syllabusOrder || []).join(' → ')}.`,
            `Bu metin ${kanun} resmi lafzına ve ${uni.shortName} yayımlanmış ders tanımına dayanır. Hoca slaytı kopyalanmaz. Resmi müfredatın yerine geçmez. Kampüs usulü: ${v.campus}.`,
        ],
        hapBilgi: overlay.examBox.tips[0],
    });

    for (const inst of chosen) {
        const exp = expandInstitution(inst, overlay, uni, meta.label, ragStore);
        sections.push(exp.section);
        examples.push(exp.example);
        topics.push(exp.topic);
        mermaid.push(exp.mermaid);
    }

    if (variant === 'yillik') {
        sections.push({
            heading: 'Güz ve bahar nasıl birleşir',
            paragraphs: [
                `Yıllık master, Güzdeki kuruluş hattını Bahardaki sonuç hattına bağlar. ${v.openingMove}`,
                `${v.shortName} kâğıdında tek soru çoğu kez iki dönemi birden taşır: önce kurum kurulmuş mudur, sonra edim veya sonuç neden doğmamıştır, en sonda hangi süre işlemiştir.`,
                'Konsolide okuma, dönem notlarının yerine geçmez; çapraz gönderir. Dönemlik vizeye Güz paketi, bütüne yıllık paket daha yakındır.',
            ],
        });
    }

    sections.push({
        heading: 'Sınav iskeleti ve kaynakça disiplini',
        paragraphs: [
            (overlay.examBox.tips || []).join(' '),
            'Künye yalnız yerel arşivde varsa yazılır. Bu pakette yapısal atıf listesi boş bırakılmıştır; uydurma E./K./T. yoktur.',
            'Doktrin adı, hocanın izlencesinde geçmiyorsa sayfa numarası olmadan hâkim görüş olarak anılır.',
        ],
        uyari: 'Geçme garantisi yoktur. OBS ve öğretim elemanı bağlayıcıdır.',
    });

    const note = {
        uniSlug: uni.slug,
        courseCode: meta.code,
        slug: `${uni.slug}__${meta.code}`,
        title: `${uni.shortName} ${graph.title} ${meta.label} Ders Notu`,
        description: `${uni.name} ${graph.title} ${meta.label} — tanım, unsur, ${kanun} lafzı, kurmaca olay, test ve kart. Ücretsiz.`,
        h1: `${uni.shortName} ${graph.title} ${meta.label}`,
        keywords: [
            `${uni.shortName} ${graph.title.toLocaleLowerCase('tr-TR')}`,
            `${kanun} ders notu`,
            meta.label,
            `${uni.city} hukuk fakültesi`,
        ],
        lead: `${uni.name} öğrencisi için ${graph.title} ${meta.label} paketi. ${v.campus} okuma: tanım, unsur, lafız, süre.`,
        promise: overlay.examBox.tips[0],
        examBox: overlay.examBox,
        learningOutcomes: chosen.map((c) => `${c.title} unsurlarını vakıaya yedirmek`),
        sixtySecond: chosen.slice(0, 6).map((c) => `${c.title}: ${c.elements[0]}`),
        sections,
        examples,
        diagrams: diagramsFor(ids, byId),
        mermaid,
        topics,
        faq: [
            {
                q: `${uni.shortName} ${graph.title.toLocaleLowerCase('tr-TR')} notu ücretli mi?`,
                a: 'Hayır. Av. Fethi Güzel Hukuk Portalı üzerinden ücretsizdir.',
            },
            {
                q: 'Hoca slaytının kopyası mı?',
                a: 'Değil. Kanun lafzı serbesttir; slayt ve fotokopi not kullanılmaz.',
            },
            {
                q: 'Güz ve yıllık farkı nedir?',
                a: 'Güz ilk hat, bahar sonuç ve sorumluluk, yıllık ikisinin konsolidesidir.',
            },
            {
                q: 'Sınavda bu not yeter mi?',
                a: 'Hayır. Bağlayıcı olan OBS, dönem duyurusu ve sorumlu öğretim elemanıdır.',
            },
        ],
        checklist: [
            v.openingMove,
            'Unsurları vakıaya eşle.',
            `İlgili ${kanun} maddesinin lafzını oku.`,
            'Süre ve def\'i en sonda kontrol et.',
        ],
        relatedCourses: relatedFor(courseCode),
        relatedBilgi: ['zamanasimi-sureleri'],
        updated: TODAY,
        wordTarget: meta.minWords,
        qualityTier: 'curated',
        sources: overlay.sources,
        variantOf: courseCode,
        variantLabel: meta.label,
        fsek: { similarityMax: 0, sourceIds: (overlay.sources || []).map((s) => s.url) },
    };

    return note;
}

function loadUni(slug) {
    const src = readFileSync(join(ROOT, 'lib/ders-notlari/universiteler.ts'), 'utf8');
    const re = /export const LAW_UNIVERSITIES(?::[^=]+)?=\s*(\[[\s\S]*?\n\]);/;
    const m = src.match(re);
    if (!m) throw new Error('universiteler parse');
    const list = new Function(`return (${m[1]});`)();
    const uni = list.find((u) => u.slug === slug);
    if (!uni) throw new Error(`üniversite yok: ${slug}`);
    return uni;
}

function updateIndex(notes, uniSlug, courseCode) {
    const indexPath = join(ROOT, 'lib/ders-notlari/generated/index.json');
    const index = loadJson(indexPath);
    const drop = new Set(notes.map((n) => n.courseCode));
    const kept = (index.notes || []).filter(
        (n) => !(n.uniSlug === uniSlug && (drop.has(n.courseCode) || n.courseCode === courseCode))
    );
    const added = notes.map((n) => ({
        uniSlug: n.uniSlug,
        courseCode: n.courseCode,
        slug: n.slug,
        title: n.title,
        href: `/ders-notlari/${n.uniSlug}/${n.courseCode}`,
        variantOf: n.variantOf,
        variantLabel: n.variantLabel,
    }));
    index.notes = [...kept, ...added];
    index.noteCount = index.notes.length;
    index.graphComposeAt = new Date().toISOString();
    writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8');
}

function updateHub(notes, uniSlug, courseCode) {
    const hubsPath = join(ROOT, 'lib/ders-notlari/generated/hubs.json');
    if (!existsSync(hubsPath)) return;
    const hubs = loadJson(hubsPath);
    const hub = hubs.find((h) => h.uni?.slug === uniSlug);
    if (!hub) return;
    const codes = new Set((hub.courses || []).map((c) => c.code));
    for (const n of notes) {
        if (codes.has(n.courseCode)) {
            const row = hub.courses.find((c) => c.code === n.courseCode);
            if (row) {
                row.ready = true;
                row.href = `/ders-notlari/${uniSlug}/${n.courseCode}`;
                row.title = n.variantLabel ? `${n.variantOf} · ${n.variantLabel}` : row.title;
            }
            continue;
        }
        hub.courses.push({
            code: n.courseCode,
            title: `${courseCode} · ${n.variantLabel}`,
            year: 2,
            href: `/ders-notlari/${uniSlug}/${n.courseCode}`,
            ready: true,
        });
        codes.add(n.courseCode);
    }
    writeFileSync(hubsPath, JSON.stringify(hubs), 'utf8');
}

function composeOne(uniSlug, courseCode, skipIndex = false) {
    const graphPath = join(ROOT, 'lib/ders-notlari/graphs', `${courseCode}.json`);
    const overlayPath = join(ROOT, 'lib/ders-notlari/overlays', `${uniSlug}.json`);
    if (!existsSync(graphPath)) throw new Error(`graf yok: ${courseCode}`);
    if (!existsSync(overlayPath)) throw new Error(`örtü yok: ${uniSlug}`);
    const graph = loadJson(graphPath);
    const overlay = loadJson(overlayPath);
    const uni = loadUni(uniSlug);
    const ragStore = getRagStore();
    const notesDir = join(ROOT, 'lib/ders-notlari/generated/notes');
    mkdirSync(notesDir, { recursive: true });

    const restrictedSources = (overlay.sources || []).map((s) => ({
        kind: 'syllabus',
        text: `${s.title} ${s.note || ''}`,
    }));

    const VARIANTS = variantsFor(courseCode);
    const written = [];
    for (const variant of Object.keys(VARIANTS)) {
        const note = buildNote({ graph, overlay, uni, variant, courseCode, ragStore });
        const wc = wordCount(note);
        note.wordTarget = wc;
        const lecture = auditLectureNote(note);
        const fsek = auditFsek({
            generated: mdToPlain(note),
            sources: restrictedSources,
            allowedKunye: [],
        });
        if (!lecture.publishable) {
            throw new Error(`${note.courseCode} lecture gate: ${lecture.verdict} ${lecture.reason || ''}`);
        }
        if (!fsek.ok) {
            throw new Error(`${note.courseCode} fsek: ${fsek.verdict} ${fsek.reason}`);
        }
        note.fsek.similarityMax = fsek.overlap;
        const minWords = VARIANTS[variant].minWords;
        if (wc < minWords) {
            throw new Error(`${note.slug} kelime ${wc} < ${minWords}`);
        }
        const dest = join(notesDir, `${note.slug}.json`);
        writeFileSync(dest, JSON.stringify(note), 'utf8');
        written.push(note);
        console.log(`[ok] ${note.slug} words=${wc} lecture=${lecture.verdict} fsek=${fsek.verdict}`);
    }

    if (!skipIndex) {
        updateIndex(written, uniSlug, courseCode);
        updateHub(written, uniSlug, courseCode);
    }
    console.log(`wrote ${written.length} notes for ${uniSlug}/${courseCode}`);
    return written;
}

function reindexGraphNotes() {
    const notesDir = join(ROOT, 'lib/ders-notlari/generated/notes');
    const unis = listJsonStems(join(ROOT, 'lib/ders-notlari/overlays'));
    const courses = listJsonStems(join(ROOT, 'lib/ders-notlari/graphs'));
    const variants = ['donem-1', 'donem-2', 'yillik'];
    const added = [];
    for (const uni of unis) {
        for (const course of courses) {
            for (const v of variants) {
                const slug = `${uni}__${course}-${v}`;
                const p = join(notesDir, `${slug}.json`);
                if (!existsSync(p)) continue;
                const n = loadJson(p);
                added.push({
                    uniSlug: n.uniSlug,
                    courseCode: n.courseCode,
                    slug: n.slug,
                    title: n.title,
                    href: `/ders-notlari/${n.uniSlug}/${n.courseCode}`,
                    variantOf: n.variantOf,
                    variantLabel: n.variantLabel,
                });
            }
        }
    }
    const indexPath = join(ROOT, 'lib/ders-notlari/generated/index.json');
    const index = loadJson(indexPath);
    const drop = new Set(added.map((n) => `${n.uniSlug}::${n.courseCode}`));
    const kept = (index.notes || []).filter((n) => !drop.has(`${n.uniSlug}::${n.courseCode}`));
    index.notes = [...kept, ...added];
    index.noteCount = index.notes.length;
    index.graphComposeAt = new Date().toISOString();
    writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8');
    console.log(`[reindex] graph notes=${added.length} total=${index.noteCount}`);
}

function listJsonStems(dir, suffix = '.json') {
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
        .filter((f) => f.endsWith(suffix))
        .map((f) => basename(f, suffix));
}

function hasCuratedTriple(uniSlug, courseCode) {
    const notesDir = join(ROOT, 'lib/ders-notlari/generated/notes');
    const p = join(notesDir, `${uniSlug}__${courseCode}-yillik.json`);
    if (!existsSync(p)) return false;
    try {
        const n = JSON.parse(readFileSync(p, 'utf8'));
        return n.qualityTier === 'curated' && Array.isArray(n.mermaid) && n.mermaid.length > 0;
    } catch {
        return false;
    }
}

const args = process.argv.slice(2);
const onlyMissing = args.includes('--only-missing');
const skipIndex = args.includes('--no-index');
const uniArg = args.find((a) => a.startsWith('--unis='))?.slice('--unis='.length);
const courseArg = args.find((a) => a.startsWith('--courses='))?.slice('--courses='.length);

if (args[0] === '--wave') {
    let unis = listJsonStems(join(ROOT, 'lib/ders-notlari/overlays'));
    let courses = listJsonStems(join(ROOT, 'lib/ders-notlari/graphs'));
    if (uniArg) unis = uniArg.split(',').map((s) => s.trim()).filter(Boolean);
    if (courseArg) courses = courseArg.split(',').map((s) => s.trim()).filter(Boolean);
    let n = 0;
    let skipped = 0;
    const fails = [];
    for (const uni of unis) {
        for (const course of courses) {
            if (onlyMissing && hasCuratedTriple(uni, course)) {
                skipped += 1;
                continue;
            }
            try {
                composeOne(uni, course, skipIndex);
                n += 1;
            } catch (err) {
                fails.push(`${uni}/${course}: ${err.message}`);
                console.error(`[fail] ${uni}/${course} ${err.message}`);
            }
        }
    }
    if (skipIndex || n > 0) reindexGraphNotes();
    console.log(`[wave] ok=${n} skip=${skipped} fail=${fails.length}`);
    if (fails.length) {
        console.error(fails.join('\n'));
        process.exitCode = 1;
    }
} else if (args[0] === '--reindex') {
    reindexGraphNotes();
} else {
    const uniSlug = args[0] || 'ankara';
    const courseCode = args[1] || 'borclar-genel';
    composeOne(uniSlug, courseCode);
}
