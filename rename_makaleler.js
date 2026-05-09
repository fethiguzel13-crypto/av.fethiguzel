const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const AdmZip = require('adm-zip');

const makalelerDir = path.join(__dirname, 'public', 'makaleler');

function sanitizeFilename(name) {
  // Remove invalid characters for filenames and trim
  let safe = name.replace(/[\/\\?%*:|"<>]/g, '-');
  safe = safe.replace(/\s+/g, ' ').trim();
  if (safe.length > 100) {
    safe = safe.substring(0, 100).trim() + '...';
  }
  return safe;
}

function extractFirstMeaningfulLine(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 3);
  for (let line of lines) {
    // Skip very generic lines that might just be headers
    if (line.toUpperCase().includes('T.C.') || line.toUpperCase().includes('YARGITAY') || line.toUpperCase().includes('BÖLGE ADLİYE MAHKEMESİ')) {
      continue;
    }
    return line;
  }
  return lines[0] || 'Adsız Makale';
}

async function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const dir = path.dirname(filePath);
  const oldFilename = path.basename(filePath);
  
  let text = '';
  
  try {
    if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    } else if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (ext === '.udf') {
      const zip = new AdmZip(filePath);
      const zipEntries = zip.getEntries();
      const contentEntry = zipEntries.find(entry => entry.entryName.endsWith('content.xml') || entry.entryName.endsWith('.xml'));
      if (contentEntry) {
        text = zip.readAsText(contentEntry);
        // strip basic XML tags
        text = text.replace(/<[^>]+>/g, '\n').replace(/&nbsp;/g, ' ');
      }
    } else {
      console.log(`Skipping unsupported file: ${oldFilename}`);
      return;
    }

    const title = extractFirstMeaningfulLine(text);
    if (title) {
      const safeTitle = sanitizeFilename(title);
      let newFilename = `${safeTitle}${ext}`;
      let newFilePath = path.join(dir, newFilename);
      
      // If same name exists, add random string
      if (fs.existsSync(newFilePath) && newFilePath !== filePath) {
        newFilename = `${safeTitle}-${Math.floor(Math.random() * 1000)}${ext}`;
        newFilePath = path.join(dir, newFilename);
      }
      
      if (newFilePath !== filePath) {
        fs.renameSync(filePath, newFilePath);
        console.log(`Renamed: '${oldFilename}' -> '${newFilename}'`);
      } else {
        console.log(`Kept: '${oldFilename}'`);
      }
    } else {
      console.log(`Could not find title for: ${oldFilename}`);
    }

  } catch (err) {
    console.error(`Error processing ${oldFilename}:`, err.message);
  }
}

async function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (let file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await walkDir(fullPath);
    } else {
      await processFile(fullPath);
    }
  }
}

async function run() {
  console.log('Starting rename process...');
  await walkDir(makalelerDir);
  console.log('Finished renaming.');
}

run();
