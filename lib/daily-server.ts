import 'server-only';
import fs from 'fs';
import path from 'path';
import type { DailyData } from './daily';

export function loadDaily(): DailyData | null {
  const file = path.join(process.cwd(), 'public', 'data', 'daily.json');
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as DailyData;
  } catch (err) {
    console.error('[loadDaily] parse failed:', err);
    return null;
  }
}
