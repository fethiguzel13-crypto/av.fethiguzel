#!/usr/bin/env node
/**
 * Uçtan uca testleri derlenmiş site üzerinde koşar (Aylık plan G22).
 *
 *   npm run build            (önce; koşucu derlemez)
 *   npm run test:e2e         [-- --sadece=arama,mevzuat]
 *
 * Port 3123 boşsa `next start -p 3123`'ü kendisi başlatır, `/` 200 dönünce `e2e/*.e2e.mjs` dosyalarını `node --test` ile koşar
 * ve sonunda sunucuyu süreç ağacıyla kapatır. Port doluysa hiçbir sürece dokunmadan durur (çıkış 2). Testler tabanı
 * `E2E_TABAN` ortam değişkeninden okur.
 */
import { spawn, spawnSync, execSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { portSahibi, portKarari, hazirBekle } from './lib/e2e-sunucu.mjs';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 3123;
const TABAN = `http://localhost:${PORT}`;
const sadece = (process.argv.find((a) => a.startsWith('--sadece=')) || '').slice('--sadece='.length).split(',').filter(Boolean);

const netstat = () => execSync('netstat -ano -p TCP', { encoding: 'utf8' }) + execSync('netstat -ano -p TCPv6', { encoding: 'utf8' });

function surecKomutu(pid) {
  const r = spawnSync(
    'powershell',
    ['-NoProfile', '-Command', `(Get-CimInstance Win32_Process -Filter "ProcessId=${pid}").CommandLine`],
    { encoding: 'utf8' }
  );
  return (r.stdout || '').trim();
}

const pid = portSahibi(netstat(), PORT);
const karar = portKarari(pid ? { pid, komut: surecKomutu(pid) } : null);
if (karar.eylem === 'dur') {
  console.error(karar.mesaj);
  process.exit(2);
}
if (!existsSync(join(KOK, '.next', 'BUILD_ID'))) {
  console.error('Derleme yok (.next/BUILD_ID). Önce: npm run build');
  process.exit(2);
}

const dosyalar = readdirSync(join(KOK, 'e2e'))
  .filter((d) => d.endsWith('.e2e.mjs'))
  .filter((d) => !sadece.length || sadece.includes(d.replace('.e2e.mjs', '')))
  .map((d) => join('e2e', d));

const sunucu = spawn(process.execPath, [join(KOK, 'node_modules', 'next', 'dist', 'bin', 'next'), 'start', '-p', String(PORT)], {
  cwd: KOK,
  stdio: ['ignore', 'ignore', 'inherit'],
  env: { ...process.env, NODE_ENV: 'production' },
});

let kod = 1;
try {
  await hazirBekle(`${TABAN}/`, { sureMs: 120_000 });
  const t = spawnSync(process.execPath, ['--test', '--test-concurrency=1', ...dosyalar], {
    cwd: KOK,
    stdio: 'inherit',
    env: { ...process.env, E2E_TABAN: TABAN },
  });
  kod = t.status ?? 1;
} catch (e) {
  console.error(String(e.message || e));
} finally {
  spawnSync('taskkill', ['/PID', String(sunucu.pid), '/T', '/F'], { stdio: 'ignore' });
  const kalan = portSahibi(netstat(), PORT);
  if (kalan) {
    console.error(`Uyarı: port ${PORT} hâlâ tutuluyor (pid ${kalan}).`);
    kod = kod || 1;
  }
}
process.exit(kod);
