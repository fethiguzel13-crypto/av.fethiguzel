import 'server-only';
import fs from 'fs';
import path from 'path';

export interface AnalysisSections {
  davaSozeti: string;
  mahkemeninKarari: string;
  benimGozlemim: string;
  pratikEtki: string;
}

export interface AnalysisData {
  id: string;
  generatedAt: string;
  sections: AnalysisSections;
  highlight: {
    source: string;
    kunye: string | null;
    konu: string | null;
    date: string | null;
    url: string | null;
  };
}

export function loadAnalysis(id: string): AnalysisData | null {
  const file = path.join(process.cwd(), 'public', 'data', 'analyses', `${id}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as AnalysisData;
  } catch (err) {
    console.error(`[loadAnalysis] parse failed for ${id}:`, err);
    return null;
  }
}

export function loadAvailableAnalysisIds(): string[] {
  const dir = path.join(process.cwd(), 'public', 'data', 'analyses');
  if (!fs.existsSync(dir)) return [];
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace(/\.json$/, ''));
  } catch {
    return [];
  }
}
