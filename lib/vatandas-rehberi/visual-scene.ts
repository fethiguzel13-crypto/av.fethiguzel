export type SceneLayout = 'desk-left' | 'desk-right' | 'seal-center' | 'dossier' | 'horizon' | 'diptych';

export type SceneMotif =
    | 'rings'
    | 'wage'
    | 'envelope'
    | 'key'
    | 'receipt'
    | 'tree'
    | 'plot'
    | 'petition'
    | 'column'
    | 'road'
    | 'ledger'
    | 'card'
    | 'id'
    | 'ramp'
    | 'gavel'
    | 'passport'
    | 'lock'
    | 'policy'
    | 'book'
    | 'contract'
    | 'clinic'
    | 'diploma';

export type VisualScene = {
    seed: number;
    layout: SceneLayout;
    motif: SceneMotif;
    paperHue: number;
    inkShift: number;
    sealX: number;
    sealY: number;
    paperA: { x: number; y: number; r: number; w: number; h: number };
    paperB: { x: number; y: number; r: number; w: number; h: number };
    paperC: { x: number; y: number; r: number; w: number; h: number };
    lightX: number;
    lightY: number;
    stamp: string;
    tab: string;
};

const LAYOUTS: SceneLayout[] = ['desk-left', 'desk-right', 'seal-center', 'dossier', 'horizon', 'diptych'];

const CAT_MOTIF: Record<string, SceneMotif> = {
    Aile: 'rings',
    İş: 'wage',
    İcra: 'envelope',
    Kira: 'key',
    Tüketici: 'receipt',
    Miras: 'tree',
    Eşya: 'plot',
    Usul: 'petition',
    İdare: 'column',
    Trafik: 'road',
    Vergi: 'ledger',
    'Sosyal Güvenlik': 'card',
    Ceza: 'petition',
    Nüfus: 'id',
    'Engelli Hakları': 'ramp',
    Ticaret: 'contract',
    Mevzuat: 'book',
    Borçlar: 'contract',
    İmar: 'plot',
    Yabancılar: 'passport',
    'Kişisel Veri': 'lock',
    Sigorta: 'policy',
    Sağlık: 'clinic',
    Eğitim: 'diploma',
};

export function hashSlug(slug: string): number {
    let h = 2166136261;
    for (let i = 0; i < slug.length; i++) {
        h ^= slug.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function rng(seed: number) {
    let s = seed || 1;
    return () => {
        s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
        return s / 4294967296;
    };
}

function pick<T>(rand: () => number, arr: readonly T[]): T {
    return arr[Math.floor(rand() * arr.length) % arr.length];
}

export const PAPER_SRC = '/rehber/materials/paper.jpg';
export const FOLDER_SRC = '/rehber/materials/folder.jpg';
export const OBJECT_SRCS = [
    '/rehber/materials/seal.jpg',
    '/rehber/materials/stamp.jpg',
    '/rehber/materials/obj-a.jpg',
    '/rehber/materials/obj-b.jpg',
    '/rehber/materials/obj-c.jpg',
    '/rehber/materials/obj-d.jpg',
    '/rehber/materials/obj-e.jpg',
] as const;

export function cropPosition(seed: number): string {
    const x = 8 + (seed % 84);
    const y = 12 + (Math.floor(seed / 17) % 68);
    return `${x}% ${y}%`;
}

export function pickObjects(seed: number): { a: string; b: string } {
    const i = seed % OBJECT_SRCS.length;
    let j = (Math.floor(seed / 9) + 3) % OBJECT_SRCS.length;
    if (j === i) j = (i + 1) % OBJECT_SRCS.length;
    return { a: OBJECT_SRCS[i], b: OBJECT_SRCS[j] };
}

export function buildVisualScene(
    slug: string,
    category: string,
    stamp: string,
    tab: string
): VisualScene {
    const seed = hashSlug(slug);
    const rand = rng(seed);
    const layout = LAYOUTS[seed % LAYOUTS.length];
    const paper = (baseX: number, baseY: number) => ({
        x: baseX + (rand() - 0.5) * 36,
        y: baseY + (rand() - 0.5) * 18,
        r: (rand() - 0.5) * 14,
        w: 210 + rand() * 70,
        h: 150 + rand() * 50,
    });

    const layouts: Record<SceneLayout, { a: [number, number]; b: [number, number]; c: [number, number] }> = {
        'desk-left': { a: [40, 48], b: [88, 62], c: [520, 70] },
        'desk-right': { a: [420, 44], b: [470, 70], c: [48, 80] },
        'seal-center': { a: [120, 40], b: [310, 55], c: [500, 42] },
        dossier: { a: [90, 36], b: [130, 58], c: [170, 80] },
        horizon: { a: [60, 90], b: [280, 70], c: [520, 95] },
        diptych: { a: [40, 50], b: [410, 50], c: [240, 120] },
    };
    const L = layouts[layout];

    return {
        seed,
        layout,
        motif: CAT_MOTIF[category] || pick(rand, Object.values(CAT_MOTIF)),
        paperHue: 32 + rand() * 16,
        inkShift: rand(),
        sealX: 18 + rand() * 62,
        sealY: 22 + rand() * 48,
        paperA: paper(L.a[0], L.a[1]),
        paperB: paper(L.b[0], L.b[1]),
        paperC: paper(L.c[0], L.c[1]),
        lightX: 20 + rand() * 60,
        lightY: 0 + rand() * 30,
        stamp: (stamp || tab || category).slice(0, 18),
        tab: (tab || category).slice(0, 22),
    };
}
