/**
 * Animated YouTube Shorts (9:16): brand gold card + timed text scenes + voice.
 * Renders live CSS/JS animation via Playwright screenshots → ffmpeg + audio.
 */
import { mkdir, writeFile, rm, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { findFfmpeg } from './youtube-package.js';

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function run(cmd, args) {
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
        let err = '';
        child.stderr?.on('data', (d) => (err += d));
        child.on('error', reject);
        child.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`${cmd} exit ${code}: ${err.slice(-500)}`));
        });
    });
}

/**
 * Build timed scenes from plain script paragraphs.
 * @param {string} script
 * @param {number} durationSec
 */
export function buildScenes(script, durationSec) {
    const paras = String(script)
        .split(/\n+/)
        .map((p) => p.trim())
        .filter((p) => p && !/^SHORTS/i.test(p) && !/^Konu:/i.test(p) && !/^Kaynak:/i.test(p) && !/^Süre/i.test(p) && p !== '---');

    // Drop pure metadata lines already filtered; keep story lines
    const lines = paras.filter((p) => !/^avfethiguzel\.com/i.test(p) || p.length > 20);
    const site = paras.find((p) => /avfethiguzel\.com/i.test(p)) || 'avfethiguzel.com';

    // Prefer content paragraphs (not the teleprompter header junk)
    const body = lines.filter(
        (p) =>
            !/TELEPROMPTER/i.test(p) &&
            !/^---$/.test(p) &&
            p.length > 15
    );

    const chunks = body.length >= 3 ? body : body;
    // Reserve last 4s for end card
    const endDur = Math.min(4.2, durationSec * 0.1);
    const mainDur = Math.max(1, durationSec - endDur);
    const n = Math.max(1, chunks.length);
    const slice = mainDur / n;

    const scenes = chunks.map((text, i) => ({
        text,
        start: i * slice,
        end: (i + 1) * slice,
        kind: i === 0 ? 'hook' : i === n - 1 ? 'close' : 'body',
    }));

    scenes.push({
        text: site.replace(/^https?:\/\//, ''),
        start: mainDur,
        end: durationSec,
        kind: 'end',
    });

    return scenes;
}

export function buildAnimationHtml({ scenes, durationSec, kunye, title }) {
    const scenesJson = JSON.stringify(scenes);
    const kunyeSafe = escapeHtml(kunye || '');
    const titleSafe = escapeHtml(title || 'Hukuk notu');

    return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 1080px; height: 1920px; overflow: hidden;
    font-family: Georgia, 'Times New Roman', serif;
    background: #050200;
  }
  body {
    background: radial-gradient(ellipse at 50% 30%, #3a1e00 0%, #1a0c00 45%, #050200 100%);
  }

  .bg-glow {
    position: absolute; inset: -20%;
    background: radial-gradient(circle at 50% 40%, rgba(176,120,16,0.25), transparent 55%);
    animation: pulse 4s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.55; transform: scale(1); }
    50% { opacity: 0.95; transform: scale(1.06); }
  }

  .frame {
    position: absolute;
    top: 80px; left: 50px; right: 50px; bottom: 160px;
    border: 4px solid #4a2e04;
    box-shadow:
      inset 0 0 0 4px #8a6010,
      inset 0 0 0 9px #4a2e04,
      0 0 60px rgba(0,0,0,0.8);
    background: linear-gradient(145deg,
      #b07810 0%, #8a5c08 18%, #7a4e06 35%,
      #a86e0e 50%, #8a5a08 68%, #9c6a0c 85%, #b07010 100%);
    border-radius: 8px;
    overflow: hidden;
  }

  .inner {
    position: absolute;
    inset: 36px;
    border: 1.5px solid rgba(40,20,0,0.55);
  }

  .content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 70px 140px;
    text-align: center;
    z-index: 2;
  }

  .scales {
    font-size: 110px;
    line-height: 1;
    margin-bottom: 36px;
    filter: drop-shadow(0 6px 12px rgba(0,0,0,0.35));
    animation: float 3.2s ease-in-out infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-14px) scale(1.05); }
  }

  .kunye {
    font-size: 26px;
    font-weight: bold;
    color: #1e0f00;
    margin-bottom: 28px;
    letter-spacing: 0.5px;
    opacity: 0.9;
  }

  .scene-text {
    font-size: 42px;
    font-weight: bold;
    color: #0e0700;
    line-height: 1.45;
    text-shadow: 0 1px 0 rgba(200,140,40,0.25);
    max-width: 820px;
    min-height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .scene-text.enter {
    animation: textIn 0.55s ease-out both;
  }
  @keyframes textIn {
    from { opacity: 0; transform: translateY(28px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .scene-text.end-card {
    font-size: 48px;
    letter-spacing: 2px;
    color: #1a0c00;
  }

  .tag {
    margin-top: 32px;
    font-size: 24px;
    font-style: italic;
    color: #2a1500;
    opacity: 0.85;
  }

  .ribbon {
    position: absolute;
    left: 0; right: 0; bottom: 0;
    height: 120px;
    background: linear-gradient(180deg, rgba(80,40,5,0) 0%, rgba(55,28,3,0.95) 55%, rgba(35,18,2,0.98) 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 22px;
    gap: 6px;
    z-index: 3;
  }
  .ribbon-name {
    font-style: italic;
    font-size: 30px;
    letter-spacing: 3px;
    color: #f5e090;
  }
  .ribbon-site {
    font-size: 26px;
    font-weight: bold;
    color: #ffe9a8;
    letter-spacing: 1px;
  }

  .progress {
    position: absolute;
    left: 50px; right: 50px; bottom: 48px;
    height: 6px;
    background: rgba(255,230,150,0.15);
    border-radius: 4px;
    overflow: hidden;
    z-index: 5;
  }
  .progress > i {
    display: block;
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #c9a84c, #f5e090);
    border-radius: 4px;
  }

  .dust {
    position: absolute; inset: 0; pointer-events: none; z-index: 1; overflow: hidden;
  }
  .dust span {
    position: absolute;
    width: 4px; height: 4px;
    background: rgba(255, 220, 120, 0.35);
    border-radius: 50%;
    animation: drift linear infinite;
  }
  @keyframes drift {
    from { transform: translateY(100vh) scale(0.6); opacity: 0; }
    15% { opacity: 0.7; }
    to { transform: translateY(-10vh) scale(1); opacity: 0; }
  }
</style>
</head>
<body>
  <div class="bg-glow"></div>
  <div class="dust" id="dust"></div>

  <div class="frame">
    <div class="inner"></div>
    <div class="content">
      <div class="scales">⚖️</div>
      <div class="kunye" id="kunye">${kunyeSafe}</div>
      <div class="scene-text enter" id="text"></div>
      <div class="tag" id="tag">${titleSafe}</div>
    </div>
    <div class="ribbon">
      <div class="ribbon-name">Av. Fethi Güzel</div>
      <div class="ribbon-site" id="site">avfethiguzel.com</div>
    </div>
  </div>

  <div class="progress"><i id="bar"></i></div>

<script>
  const SCENES = ${scenesJson};
  const DURATION = ${Number(durationSec)};
  const textEl = document.getElementById('text');
  const bar = document.getElementById('bar');
  const siteEl = document.getElementById('site');
  let lastIdx = -1;
  const t0 = performance.now();

  // floating dust
  const dust = document.getElementById('dust');
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('span');
    s.style.left = (Math.random() * 100) + '%';
    s.style.animationDuration = (6 + Math.random() * 8) + 's';
    s.style.animationDelay = (Math.random() * 6) + 's';
    dust.appendChild(s);
  }

  function sceneAt(t) {
    for (let i = 0; i < SCENES.length; i++) {
      if (t >= SCENES[i].start && t < SCENES[i].end) return i;
    }
    return SCENES.length - 1;
  }

  function show(i) {
    const sc = SCENES[i];
    textEl.className = 'scene-text';
    void textEl.offsetWidth;
    if (sc.kind === 'end') {
      textEl.className = 'scene-text end-card enter';
      textEl.textContent = sc.text;
      siteEl.textContent = sc.text;
    } else {
      textEl.className = 'scene-text enter';
      textEl.textContent = sc.text;
    }
  }

  // allow external seek for frame export
  window.__setTime = function(t) {
    const tt = Math.max(0, Math.min(DURATION, t));
    bar.style.width = ((tt / DURATION) * 100) + '%';
    const i = sceneAt(tt);
    if (i !== lastIdx) {
      lastIdx = i;
      show(i);
    }
  };

  show(0);
  function tick(now) {
    const t = (now - t0) / 1000;
    window.__setTime(t);
    if (t < DURATION + 0.3) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
</script>
</body>
</html>`;
}

/**
 * @param {{
 *  audioPath: string,
 *  script: string,
 *  outPath: string,
 *  kunye?: string,
 *  title?: string,
 *  fps?: number,
 *  workDir?: string,
 * }} opts
 */
export async function renderAnimatedShort(opts) {
    const {
        audioPath,
        script,
        outPath,
        kunye = '',
        title = '',
        fps = 15,
    } = opts;

    if (!existsSync(audioPath)) throw new Error(`Ses yok: ${audioPath}`);
    const ffmpeg = await findFfmpeg();
    if (!ffmpeg) throw new Error('ffmpeg bulunamadı');

    // duration via ffprobe
    const dur = await new Promise((resolve, reject) => {
        const child = spawn(
            ffmpeg.replace(/ffmpeg(\.exe)?$/i, 'ffprobe$1'),
            ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', audioPath],
            { stdio: ['ignore', 'pipe', 'pipe'] }
        );
        let out = '';
        child.stdout.on('data', (d) => (out += d));
        child.on('close', (code) => {
            const n = parseFloat(out.trim());
            if (code === 0 && n > 0) resolve(n);
            else reject(new Error('ffprobe duration failed: ' + out));
        });
    }).catch(async () => {
        // fallback if ffprobe path rewrite fails
        return 49.2;
    });

    const durationSec = Math.max(3, dur);
    const scenes = buildScenes(script, durationSec);
    const html = buildAnimationHtml({ scenes, durationSec, kunye, title });

    const workDir =
        opts.workDir ||
        join(dirname(outPath), `anim-frames-${Date.now()}`);
    await mkdir(workDir, { recursive: true });
    const htmlPath = join(workDir, 'anim.html');
    await writeFile(htmlPath, html, 'utf8');

    console.log(`[youtube-animate] ${durationSec.toFixed(1)}s @ ${fps}fps, scenes=${scenes.length}`);

    const browser = await chromium.launch({ headless: true });
    try {
        const page = await browser.newPage({
            viewport: { width: 1080, height: 1920 },
            deviceScaleFactor: 1,
        });
        await page.setContent(html, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(200);

        const totalFrames = Math.ceil(durationSec * fps);
        for (let i = 0; i < totalFrames; i++) {
            const t = i / fps;
            await page.evaluate((tt) => window.__setTime(tt), t);
            // allow enter animation to paint on scene change
            if (i === 0 || Math.abs((t % 1) - 0) < 0.001) {
                await page.waitForTimeout(40);
            }
            const framePath = join(workDir, `f${String(i).padStart(5, '0')}.png`);
            await page.screenshot({ path: framePath, type: 'png' });
            if (i % 30 === 0) {
                console.log(`[youtube-animate] frame ${i}/${totalFrames}`);
            }
        }
    } finally {
        await browser.close();
    }

    const listPattern = join(workDir, 'f%05d.png');
    console.log('[youtube-animate] encoding…');
    await run(ffmpeg, [
        '-y',
        '-framerate',
        String(fps),
        '-i',
        listPattern,
        '-i',
        audioPath,
        '-c:v',
        'libx264',
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

    // cleanup frames (keep html for debug)
    try {
        const files = await readdir(workDir);
        await Promise.all(
            files
                .filter((f) => f.endsWith('.png'))
                .map((f) => rm(join(workDir, f), { force: true }))
        );
    } catch {
        /* ignore */
    }

    console.log('[youtube-animate] wrote', outPath);
    return { outPath, durationSec, scenes };
}
