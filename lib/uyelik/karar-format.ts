export function paragraphs(text: string): string[] {
    const raw = String(text || '')
        .replace(/\r\n/g, '\n')
        .replace(/\u00a0/g, ' ')
        .trim();
    if (!raw) return [];
    const parts = raw
        .split(/\n{2,}/)
        .map((p) => p.replace(/\n/g, ' ').replace(/[ \t]+/g, ' ').trim())
        .filter(Boolean);
    return parts.length ? parts : [raw];
}
