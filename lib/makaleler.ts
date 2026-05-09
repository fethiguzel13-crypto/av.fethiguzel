import fs from 'fs';
import path from 'path';

export interface MakaleCategory {
  name: string;
  files: {
    name: string;
    path: string;
    ext: string;
  }[];
}

export function getMakaleler(): MakaleCategory[] {
  const makalelerDir = path.join(process.cwd(), 'public', 'makaleler');
  if (!fs.existsSync(makalelerDir)) {
    return [];
  }

  const result: MakaleCategory[] = [];
  const entries = fs.readdirSync(makalelerDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const categoryPath = path.join(makalelerDir, entry.name);
      const files = fs.readdirSync(categoryPath)
        .filter(f => f.endsWith('.pdf') || f.endsWith('.docx') || f.endsWith('.udf'))
        .map(file => ({
          name: file.replace(/\.(pdf|docx|udf)$/i, ''),
          path: `/makale-oku/${encodeURIComponent(entry.name)}/${encodeURIComponent(file)}`,
          ext: path.extname(file).toLowerCase()
        }));

      if (files.length > 0) {
        result.push({
          name: entry.name,
          files
        });
      }
    }
  }

  // Handle root files if any
  const rootFiles = entries
    .filter(e => e.isFile() && (e.name.endsWith('.pdf') || e.name.endsWith('.docx') || e.name.endsWith('.udf')))
    .map(e => ({
      name: e.name.replace(/\.(pdf|docx|udf)$/i, ''),
      path: `/makale-oku/${encodeURIComponent(e.name)}`,
      ext: path.extname(e.name).toLowerCase()
    }));

  if (rootFiles.length > 0) {
    result.push({
      name: 'Diğer Makaleler',
      files: rootFiles
    });
  }

  return result;
}
