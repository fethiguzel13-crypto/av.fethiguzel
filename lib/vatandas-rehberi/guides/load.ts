import { createRequire } from 'node:module';
import { inferGuide } from './infer';
import type { VatandasGuide } from './types';

const require = createRequire(import.meta.url);
const ALL = require('./all.json') as Record<string, VatandasGuide>;

export function getGuide(article: { slug: string; h1: string; category: string }): VatandasGuide {
  return ALL[article.slug] || inferGuide(article);
}

export function handGuideCount() {
  return Object.keys(ALL).length;
}
