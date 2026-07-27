/**
 * Hesaplama hub arama — başlık + etiket + anahtar kelime + Türkçe sadeleştirme.
 */

export function normalizeTr(s: string): string {
    return s
        .toLocaleLowerCase('tr-TR')
        .replace(/ı/g, 'i')
        .replace(/İ/g, 'i')
        .replace(/ş/g, 's')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .trim();
}

/** Sık aranan eş anlamlılar / yazım varyantları → araç id'leri */
export const HESAPLAMA_ALIAS: Record<string, string[]> = {
    kidem: ['kidem', 'kidem-ise-iade'],
    ihbar: ['kidem'],
    'ise iade': ['ise-iade', 'kidem-ise-iade'],
    iseiade: ['ise-iade'],
    mesai: ['fazla-mesai'],
    'fazla mesai': ['fazla-mesai'],
    izin: ['yillik-izin'],
    'yillik izin': ['yillik-izin'],
    maas: ['net-brut-maas'],
    bordro: ['net-brut-maas'],
    brut: ['net-brut-maas'],
    net: ['net-brut-maas'],
    issizlik: ['issizlik-maasi'],
    nafaka: ['nafaka'],
    bosanma: ['nafaka', 'mal-rejimi', 'iddet'],
    miras: ['miras', 'sakli-pay'],
    'sakli pay': ['sakli-pay'],
    faiz: ['faiz', 'gecikme-zammi'],
    icra: ['icra-kapak', 'inkar-tazminati'],
    inkar: ['inkar-tazminati'],
    kira: ['kira', 'kira-tespit'],
    tespit: ['kira-tespit'],
    tapu: ['tapu'],
    vekalet: ['vekalet'],
    aaut: ['vekalet'],
    harc: ['dava-harci', 'istinaf-temyiz', 'icra-kapak'],
    arabuluculuk: ['arabuluculuk'],
    sure: ['sure', 'istinaf-temyiz'],
    teblig: ['sure'],
    istinaf: ['istinaf-temyiz', 'sure'],
    temyiz: ['istinaf-temyiz', 'sure'],
    zamanasimi: ['zamanasimi', 'ceza-zamanasimi'],
    infaz: ['infaz'],
    yatar: ['infaz'],
    kdv: ['kdv'],
    damga: ['damga-vergisi'],
    smm: ['smm'],
    kaza: ['is-kazasi', 'arac-deger-kaybi'],
    deger: ['arac-deger-kaybi'],
    risk: ['risk'],
    mal: ['mal-rejimi'],
    iddet: ['iddet'],
};

export type SearchableTool = {
    id: string;
    baslik: string;
    tag: string;
    keywords?: string[];
    aciklama?: string;
};

export function matchHesaplamaTool(tool: SearchableTool, query: string): boolean {
    const q = normalizeTr(query);
    if (!q) return true;
    const tokens = q.split(/\s+/).filter(Boolean);
    const hay = normalizeTr(
        [tool.baslik, tool.tag, tool.id, tool.aciklama || '', ...(tool.keywords || [])].join(' ')
    );

    // Alias: sorgu veya token bir alias anahtarına denk geliyorsa id eşleşsin
    for (const [alias, ids] of Object.entries(HESAPLAMA_ALIAS)) {
        if (q.includes(normalizeTr(alias)) || normalizeTr(alias).includes(q)) {
            if (ids.includes(tool.id)) return true;
        }
    }

    return tokens.every((t) => hay.includes(t) || tool.id.includes(t));
}
