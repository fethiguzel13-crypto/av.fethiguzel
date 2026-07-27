/**
 * Premium cinematic Shorts: multi-shot story animation synced to human voice.
 * Same character across scenes, film-like transitions, motion layers.
 *
 * Usage:
 *   node scripts/youtube-cinematic-render.js --date 2026-07-20 --index 1
 */
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { findFfmpeg } from './lib/youtube-package.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');
const SESSION_IMG =
    'C:\\Users\\HUAWEI\\.grok\\sessions\\c%3A%5CUsers%5CHUAWEI%5CDesktop%5Cinternet\\019f7ec0-f85f-7e31-8b14-d2ed8296b683\\images';

function arg(name, fallback = null) {
    const i = process.argv.indexOf(name);
    if (i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')) {
        return process.argv[i + 1];
    }
    return fallback;
}

function run(cmd, args) {
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
        let err = '';
        child.stderr.on('data', (d) => (err += d));
        child.on('error', reject);
        child.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(err.slice(-900) || `exit ${code}`));
        });
    });
}

async function toDataUri(path) {
    const buf = await readFile(path);
    const ext = path.toLowerCase().endsWith('.png') ? 'png' : 'jpeg';
    return `data:image/${ext};base64,${buf.toString('base64')}`;
}

function probeDuration(file) {
    return new Promise((resolve) => {
        const child = spawn(
            'ffprobe',
            ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file],
            { stdio: ['ignore', 'pipe', 'pipe'] }
        );
        let out = '';
        child.stdout.on('data', (d) => (out += d));
        child.on('error', () => resolve(49.2));
        child.on('close', () => {
            const n = parseFloat(out.trim());
            resolve(n > 0 ? n : 49.2);
        });
    });
}

/**
 * Story beats aligned to voice script (worker / petition / AYM).
 * Times as fractions of total duration.
 */
function buildShots(duration) {
    // fractions of full length
    const plan = [
        { id: 'office', start: 0.0, end: 0.14, label: 'Alacak…' },
        { id: 'courthouse', start: 0.14, end: 0.3, label: 'Mahkeme yolu' },
        { id: 'ignored', start: 0.3, end: 0.52, label: 'Dilekçe yok sayıldı' },
        { id: 'aym', start: 0.52, end: 0.78, label: 'Anayasa Mahkemesi' },
        { id: 'free', start: 0.78, end: 0.94, label: 'Hak korundu' },
        { id: 'end', start: 0.94, end: 1.0, label: 'avfethiguzel.com' },
    ];
    return plan.map((s) => ({
        ...s,
        t0: s.start * duration,
        t1: s.end * duration,
    }));
}

function buildFilmHtml({ shots, duration, images, kunye }) {
    const shotsJson = JSON.stringify(shots);
    return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1080px; height: 1920px; overflow: hidden; background: #000; font-family: Georgia, serif; }
  #stage { position: relative; width: 1080px; height: 1920px; overflow: hidden; background: #0a0500; }

  .shot {
    position: absolute; inset: 0;
    opacity: 0;
    transform: scale(1.08);
    transition: opacity 0.7s ease, transform 7s linear;
    will-change: opacity, transform;
  }
  .shot.active {
    opacity: 1;
    transform: scale(1.0);
    z-index: 2;
  }
  .shot.active.zoom-in { animation: kenIn 12s linear forwards; }
  .shot.active.zoom-out { animation: kenOut 12s linear forwards; }
  @keyframes kenIn {
    from { transform: scale(1.0) translate(0,0); }
    to { transform: scale(1.12) translate(-1.5%, -1%); }
  }
  @keyframes kenOut {
    from { transform: scale(1.12) translate(-1%, 0); }
    to { transform: scale(1.0) translate(0,0); }
  }

  .shot img {
    width: 100%; height: 100%; object-fit: cover;
    filter: contrast(1.05) saturate(0.95);
  }

  /* cinematic overlays */
  .vignette {
    position: absolute; inset: 0; z-index: 20; pointer-events: none;
    background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%);
  }
  .grain {
    position: absolute; inset: 0; z-index: 21; pointer-events: none; opacity: 0.08;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    animation: grain 0.4s steps(2) infinite;
  }
  @keyframes grain { 0% { transform: translate(0,0); } 100% { transform: translate(-2%, 1%); } }

  .letterbox-top, .letterbox-bot {
    position: absolute; left: 0; right: 0; height: 70px; z-index: 25;
    background: #000;
  }
  .letterbox-top { top: 0; }
  .letterbox-bot { bottom: 0; }

  /* floating document for ignored-petition beat */
  .prop-doc {
    position: absolute; z-index: 10; width: 280px; height: 360px;
    right: 120px; top: 38%;
    background: linear-gradient(160deg, #f5e6c8, #d4c4a0);
    border: 2px solid #8a6a30;
    box-shadow: 0 20px 50px rgba(0,0,0,0.55);
    opacity: 0;
    transform: rotate(-8deg) translateY(40px);
    transition: opacity 0.5s, transform 1.2s cubic-bezier(.2,.8,.2,1);
  }
  .prop-doc.show {
    opacity: 0.95;
    transform: rotate(-4deg) translateY(0);
  }
  .prop-doc.pushed {
    transform: rotate(12deg) translate(80px, 40px) scale(0.9);
    opacity: 0.35;
  }
  .prop-doc .lines {
    margin: 40px 28px;
    height: 8px; background: #b8a888; margin-bottom: 16px;
    box-shadow: 0 24px 0 #b8a888, 0 48px 0 #b8a888, 0 72px 0 #b8a888, 0 96px 0 #b8a888;
  }

  /* scales flash on AYM */
  .scales-burst {
    position: absolute; z-index: 12; left: 50%; top: 22%;
    transform: translateX(-50%) scale(0.6);
    font-size: 140px; opacity: 0;
    filter: drop-shadow(0 0 30px rgba(201,168,76,0.7));
    transition: opacity 0.6s, transform 1s;
  }
  .scales-burst.show {
    opacity: 0.9;
    transform: translateX(-50%) scale(1);
  }

  /* lower-third caption */
  .lower {
    position: absolute; left: 60px; right: 60px; bottom: 120px; z-index: 30;
    opacity: 0; transform: translateY(24px);
    transition: opacity 0.45s, transform 0.45s;
  }
  .lower.show { opacity: 1; transform: translateY(0); }
  .lower .box {
    display: inline-block;
    max-width: 100%;
    padding: 18px 26px;
    background: linear-gradient(90deg, rgba(20,10,0,0.82), rgba(40,22,5,0.72));
    border-left: 5px solid #c9a84c;
    color: #f8eec8;
    font-size: 34px;
    line-height: 1.35;
    text-shadow: 0 2px 8px rgba(0,0,0,0.6);
  }
  .lower .meta {
    margin-top: 10px;
    font-size: 20px;
    color: #d4b86a;
    letter-spacing: 1px;
  }

  .endcard {
    position: absolute; inset: 0; z-index: 40;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: radial-gradient(ellipse at center, #3a1e00 0%, #0a0500 70%);
    opacity: 0; transition: opacity 0.8s;
  }
  .endcard.show { opacity: 1; }
  .endcard .big { font-size: 120px; margin-bottom: 24px; }
  .endcard .name { font-size: 40px; color: #f5e090; font-style: italic; letter-spacing: 3px; }
  .endcard .site { font-size: 36px; color: #ffe9a8; font-weight: bold; margin-top: 12px; }
  .endcard .kunye { font-size: 22px; color: #c9a84c; margin-top: 28px; opacity: 0.85; text-align: center; padding: 0 40px; }

  .progress {
    position: absolute; left: 0; right: 0; bottom: 0; height: 5px; z-index: 50;
    background: rgba(255,255,255,0.08);
  }
  .progress i {
    display: block; height: 100%; width: 0%;
    background: linear-gradient(90deg, #8a5c08, #f5e090);
  }
</style>
</head>
<body>
<div id="stage">
  <div class="shot zoom-in" id="shot-office"><img src="${images.office}" alt=""></div>
  <div class="shot zoom-out" id="shot-courthouse"><img src="${images.courthouse}" alt=""></div>
  <div class="shot zoom-in" id="shot-ignored"><img src="${images.ignored}" alt=""></div>
  <div class="shot zoom-out" id="shot-aym"><img src="${images.aym}" alt=""></div>
  <div class="shot zoom-in" id="shot-free"><img src="${images.free}" alt=""></div>

  <div class="prop-doc" id="doc"><div class="lines"></div></div>
  <div class="scales-burst" id="scales">⚖️</div>

  <div class="vignette"></div>
  <div class="grain"></div>
  <div class="letterbox-top"></div>
  <div class="letterbox-bot"></div>

  <div class="lower" id="lower">
    <div class="box" id="caption"></div>
    <div class="meta" id="meta"></div>
  </div>

  <div class="endcard" id="endcard">
    <div class="big">⚖️</div>
    <div class="name">Av. Fethi Güzel</div>
    <div class="site">avfethiguzel.com</div>
    <div class="kunye">${kunye || ''}</div>
  </div>

  <div class="progress"><i id="bar"></i></div>
</div>
<script>
  const DURATION = ${duration};
  const SHOTS = ${shotsJson};
  const map = {
    office: document.getElementById('shot-office'),
    courthouse: document.getElementById('shot-courthouse'),
    ignored: document.getElementById('shot-ignored'),
    aym: document.getElementById('shot-aym'),
    free: document.getElementById('shot-free'),
    end: null,
  };
  const doc = document.getElementById('doc');
  const scales = document.getElementById('scales');
  const lower = document.getElementById('lower');
  const caption = document.getElementById('caption');
  const meta = document.getElementById('meta');
  const endcard = document.getElementById('endcard');
  const bar = document.getElementById('bar');
  let lastId = '';

  const CAPTIONS = {
    office: 'Bir çalışan… alacakları için hak arar',
    courthouse: 'Mahkemeye başvurur',
    ignored: 'Islah dilekçesi yok sayılır',
    aym: 'Anayasa Mahkemesi net konuşur',
    free: 'Dosyaya giren talep dinlenmelidir',
    end: 'avfethiguzel.com',
  };

  function activate(id) {
    Object.keys(map).forEach((k) => {
      if (map[k]) map[k].classList.remove('active');
    });
    if (map[id]) {
      // restart ken burns
      map[id].classList.remove('active');
      void map[id].offsetWidth;
      map[id].classList.add('active');
    }
    endcard.classList.toggle('show', id === 'end');

    // props
    doc.classList.remove('show', 'pushed');
    scales.classList.remove('show');
    if (id === 'ignored') {
      doc.classList.add('show');
      setTimeout(() => doc.classList.add('pushed'), 900);
    }
    if (id === 'aym') {
      scales.classList.add('show');
    }

    caption.textContent = CAPTIONS[id] || '';
    meta.textContent = id === 'end' ? '' : 'Görsel anlatım · genel bilgilendirme';
    lower.classList.toggle('show', id !== 'end' && !!CAPTIONS[id]);
    lastId = id;
  }

  window.__setTime = function (t) {
    const tt = Math.max(0, Math.min(DURATION, t));
    bar.style.width = (tt / DURATION * 100) + '%';
    let id = 'office';
    for (const s of SHOTS) {
      if (tt >= s.t0 && tt < s.t1) { id = s.id; break; }
    }
    if (tt >= SHOTS[SHOTS.length - 1].t0) id = SHOTS[SHOTS.length - 1].id;
    if (id !== lastId) activate(id);
  };

  activate('office');
  // realtime play for playwright record
  const t0 = performance.now();
  function loop(now) {
    window.__setTime((now - t0) / 1000);
    if ((now - t0) / 1000 < DURATION + 0.4) requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
</script>
</body>
</html>`;
}

async function main() {
    const date = arg('--date', '2026-07-20');
    const index = Number(arg('--index', '1'));
    const ytDir = join(ROOT, 'logs/social-drafts', date, 'youtube', `shorts-${index}`);
    const audio = [join(ytDir, 'voice-clean.wav'), join(ytDir, 'voice-clean.mp3')].find((p) =>
        existsSync(p)
    );
    if (!audio) throw new Error('voice-clean yok — önce ses makyajı');

    // Character-consistent scenes from image_edit (session images 19-23)
    // 19 office, 20 courthouse, 21 ignored, 22 aym, 23 free
    const paths = {
        office: join(SESSION_IMG, '19.jpg'),
        courthouse: join(SESSION_IMG, '20.jpg'),
        ignored: join(SESSION_IMG, '21.jpg'),
        aym: join(SESSION_IMG, '22.jpg'),
        free: join(SESSION_IMG, '23.jpg'),
    };
    for (const [k, p] of Object.entries(paths)) {
        if (!existsSync(p)) throw new Error(`Sahne görseli yok (${k}): ${p}`);
    }

    // Persist storyboard
    const board = join(ytDir, 'cinematic-stills');
    await mkdir(board, { recursive: true });
    await copyFile(paths.office, join(board, '01-office.jpg'));
    await copyFile(paths.courthouse, join(board, '02-courthouse.jpg'));
    await copyFile(paths.ignored, join(board, '03-ignored.jpg'));
    await copyFile(paths.aym, join(board, '04-aym.jpg'));
    await copyFile(paths.free, join(board, '05-free.jpg'));

    const duration = await probeDuration(audio);
    const shots = buildShots(duration);
    console.log(
        `[cinematic] ${duration.toFixed(1)}s shots:`,
        shots.map((s) => `${s.id} ${s.t0.toFixed(1)}-${s.t1.toFixed(1)}`).join(' | ')
    );

    const images = {
        office: await toDataUri(paths.office),
        courthouse: await toDataUri(paths.courthouse),
        ignored: await toDataUri(paths.ignored),
        aym: await toDataUri(paths.aym),
        free: await toDataUri(paths.free),
    };

    let kunye = '';
    try {
        const draft = JSON.parse(await readFile(join(ROOT, 'logs/social-drafts', `${date}.json`), 'utf8'));
        kunye = draft.items?.[index - 1]?.topic?.kunye || '';
    } catch {
        /* ignore */
    }

    const html = buildFilmHtml({ shots, duration, images, kunye });
    const work = join(ytDir, 'cinematic-work');
    await mkdir(work, { recursive: true });
    const htmlPath = join(work, 'film.html');
    await writeFile(htmlPath, html, 'utf8');

    const ffmpeg = await findFfmpeg();
    if (!ffmpeg) throw new Error('ffmpeg yok');

    // Real-time record of CSS film (premium motion)
    console.log('[cinematic] recording live film (wall-clock ~ duration)…');
    const browser = await chromium.launch({ headless: true });
    let videoPath = null;
    try {
        const context = await browser.newContext({
            viewport: { width: 1080, height: 1920 },
            recordVideo: { dir: work, size: { width: 1080, height: 1920 } },
        });
        const page = await context.newPage();
        await page.setContent(html, { waitUntil: 'domcontentloaded' });
        // record full duration + buffer
        await page.waitForTimeout(Math.ceil(duration * 1000) + 1200);
        const vid = page.video();
        await page.close();
        await context.close();
        if (vid) {
            videoPath = await vid.path();
            console.log('[cinematic] raw video', videoPath);
        }
    } finally {
        await browser.close();
    }

    if (!videoPath || !existsSync(videoPath)) {
        throw new Error('Playwright video kaydı oluşmadı');
    }

    const outPath = join(ytDir, 'shorts-cinematic.mp4');
    // Normalize to h264 + attach clean audio (replace page silence)
    console.log('[cinematic] mux voice + encode…');
    await run(ffmpeg, [
        '-y',
        '-i',
        videoPath,
        '-i',
        audio,
        '-map',
        '0:v:0',
        '-map',
        '1:a:0',
        '-c:v',
        'libx264',
        '-preset',
        'medium',
        '-crf',
        '18',
        '-pix_fmt',
        'yuv420p',
        '-c:a',
        'aac',
        '-b:a',
        '192k',
        '-shortest',
        '-movflags',
        '+faststart',
        outPath,
    ]);

    await writeFile(
        join(ytDir, 'cinematic-shotlist.txt'),
        [
            'PREMIUM SİNEMATİK SHOT LİSTESİ (ses ile senkron)',
            '',
            '1. OFFICE — Çalışan alacak evraklarıyla (hak arayışı başlar)',
            '2. COURTHOUSE — Mahkeme adımları, dosya elinde',
            '3. IGNORED — Dilekçe masada; yok sayılma (evrak animasyonu)',
            '4. AYM — Anayasa Mahkemesi salonu, adalet vurgusu',
            '5. FREE — Mahkemeden çıkış, hak korundu',
            '6. END — Av. Fethi Güzel / avfethiguzel.com',
            '',
            `Çıktı: ${outPath}`,
        ].join('\n'),
        'utf8'
    );

    console.log('[cinematic] DONE →', outPath);
}

main().catch((e) => {
    console.error('[cinematic] fatal:', e.message);
    process.exit(1);
});
