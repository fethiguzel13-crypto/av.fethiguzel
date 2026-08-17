export declare function foldTr(s: string): string;
export declare function tighten(s: string): string;
export declare function scoreArticle(title: string, body: string, tokens: string[]): number;
export declare function tokenize(query: string): string[];
export declare function parseMaddeQuery(
  q: string,
  known?: string[]
): { kanunId?: string; maddeNo?: number } | null;
