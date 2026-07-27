/**
 * Dense cast cinematic Shorts — Pembo universe characters, motion-heavy.
 * Usage: node scripts/youtube-cast-cinematic.js --date 2026-07-20 --index 1
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { findFfmpeg } from './lib/youtube-package.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');
const CAST_SCENES = join(ROOT, 'logs/youtube-cast/scenes');

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
    return `data:image/jpeg;base64,${buf.toString('base64')}`;
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

function buildHtml({ duration, frames, kunye }) {
    const framesJson = JSON.stringify(frames);
    return `<!DOCTYPE html>
<html lang="tr"><head><meta charset="utf-8">
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:#0a0500;font-family:Georgia,serif}
#stage{position:relative;width:1080px;height:1920px;overflow:hidden;background:#120800}

.layer{position:absolute;inset:0;opacity:0;z-index:1;will-change:transform,opacity}
.layer.on{opacity:1;z-index:3}
.layer img{width:100%;height:100%;object-fit:cover;display:block}

/* denser motion presets */
.layer.on.m-push{animation:push 8s ease-out forwards}
.layer.on.m-shake{animation:shake 0.55s ease-in-out 2, drift 7s linear forwards}
.layer.on.m-slam{animation:slam 0.45s cubic-bezier(.2,.9,.2,1) forwards, drift 7s linear forwards}
.layer.on.m-rise{animation:rise 0.7s ease-out forwards, drift 8s linear forwards}
.layer.on.m-win{animation:win 0.8s ease-out forwards, floaty 2.2s ease-in-out infinite}
.layer.on.m-end{animation:endIn 0.9s ease-out forwards}

@keyframes push{from{transform:scale(1.15) translate(2%,1%)}to{transform:scale(1.02) translate(0,0)}}
@keyframes shake{
  0%,100%{transform:translate(0,0) rotate(0)}
  20%{transform:translate(-18px,6px) rotate(-1.2deg)}
  40%{transform:translate(16px,-4px) rotate(1deg)}
  60%{transform:translate(-12px,4px) rotate(-0.8deg)}
  80%{transform:translate(10px,2px) rotate(0.5deg)}
}
@keyframes slam{from{transform:scale(1.25) translateY(-4%);filter:brightness(1.3)}to{transform:scale(1.05);filter:brightness(1)}}
@keyframes rise{from{transform:translateY(8%) scale(1.08);opacity:0}to{transform:translateY(0) scale(1.03);opacity:1}}
@keyframes win{from{transform:scale(0.92);filter:brightness(0.8)}to{transform:scale(1.04);filter:brightness(1.08)}}
@keyframes floaty{0%,100%{transform:translateY(0) scale(1.04)}50%{transform:translateY(-12px) scale(1.05)}}
@keyframes drift{from{transform:scale(1.05) translate(0,0)}to{transform:scale(1.12) translate(-2%,-1%)}}
@keyframes endIn{from{opacity:0;transform:scale(1.1)}to{opacity:1;transform:scale(1)}}

.fx-flash{position:absolute;inset:0;z-index:20;background:#fff;opacity:0;pointer-events:none}
.fx-flash.go{animation:flash 0.35s ease-out}
@keyframes flash{0%{opacity:0.75}100%{opacity:0}}

.vignette{position:absolute;inset:0;z-index:15;pointer-events:none;
  background:radial-gradient(ellipse at center,transparent 35%,rgba(0,0,0,.6) 100%)}
.grain{position:absolute;inset:0;z-index:16;opacity:.07;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation:g 0.35s steps(2) infinite}
@keyframes g{to{transform:translate(-1%,1%)}}

.lb-t,.lb-b{position:absolute;left:0;right:0;height:64px;background:#000;z-index:18}
.lb-t{top:0}.lb-b{bottom:0}

.lower{position:absolute;left:48px;right:48px;bottom:100px;z-index:30;
  opacity:0;transform:translateY(30px);transition:opacity .35s,transform .35s}
.lower.show{opacity:1;transform:translateY(0)}
.lower .who{font-size:18px;color:#c9a84c;letter-spacing:2px;margin-bottom:8px;text-transform:uppercase}
.lower .box{padding:16px 22px;background:linear-gradient(90deg,rgba(15,8,0,.88),rgba(40,22,5,.7));
  border-left:5px solid #c9a84c;color:#f8eec8;font-size:32px;line-height:1.35;
  text-shadow:0 2px 10px rgba(0,0,0,.65)}

.cast-chip{position:absolute;top:88px;left:48px;z-index:30;display:flex;gap:10px;flex-wrap:wrap}
.cast-chip span{background:rgba(0,0,0,.55);color:#f5e090;border:1px solid #8a5c08;
  padding:6px 12px;border-radius:20px;font-size:16px}

.end{position:absolute;inset:0;z-index:40;display:flex;flex-direction:column;align-items:center;justify-content:center;
  background:radial-gradient(ellipse at center,#3a1e00,#0a0500 70%);opacity:0;transition:opacity .7s}
.end.show{opacity:1}
.end .big{font-size:110px;margin-bottom:16px}
.end .name{font-size:38px;color:#f5e090;font-style:italic;letter-spacing:3px}
.end .site{font-size:34px;color:#ffe9a8;font-weight:bold;margin-top:10px}
.end .k{font-size:20px;color:#c9a84c;margin-top:22px;text-align:center;padding:0 40px}

.bar{position:absolute;left:0;right:0;bottom:0;height:6px;z-index:50;background:rgba(255,255,255,.08)}
.bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#8a5c08,#f5e090)}
</style></head>
<body>
<div id="stage">
  ${frames
            .map(
                (f, i) =>
                    `<div class="layer" id="L${i}" data-motion="${f.motion}"><img src="${f.src}" alt=""></div>`
            )
            .join('\n')}
  <div class="fx-flash" id="flash"></div>
  <div class="vignette"></div>
  <div class="grain"></div>
  <div class="lb-t"></div><div class="lb-b"></div>
  <div class="cast-chip" id="chip"></div>
  <div class="lower" id="lower"><div class="who" id="who"></div><div class="box" id="cap"></div></div>
  <div class="end" id="end">
    <div class="big">⚖️</div>
    <div class="name">Av. Fethi Güzel</div>
    <div class="site">avfethiguzel.com</div>
    <div class="k">${kunye || 'Pembo · Yargıç Hulki · Coşkun · Nuri · Av. Fethi'}</div>
  </div>
  <div class="bar"><i id="bar"></i></div>
</div>
<script>
const D=${duration};
const F=${framesJson};
let last=-1;
const flash=document.getElementById('flash');
const lower=document.getElementById('lower');
const who=document.getElementById('who');
const cap=document.getElementById('cap');
const chip=document.getElementById('chip');
const end=document.getElementById('end');
const bar=document.getElementById('bar');

function show(i){
  document.querySelectorAll('.layer').forEach(el=>{
    el.className='layer';
  });
  const isEnd = i>=F.length;
  end.classList.toggle('show', isEnd);
  if(isEnd){ lower.classList.remove('show'); chip.innerHTML=''; return; }
  const f=F[i];
  const el=document.getElementById('L'+i);
  el.className='layer on m-'+f.motion;
  who.textContent=f.who;
  cap.textContent=f.caption;
  lower.classList.add('show');
  chip.innerHTML=(f.cast||[]).map(c=>'<span>'+c+'</span>').join('');
  if(f.flash){
    flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');
  }
  last=i;
}

window.__setTime=function(t){
  const tt=Math.max(0,Math.min(D,t));
  bar.style.width=(tt/D*100)+'%';
  if(tt>=D*0.94){ if(last!==99){ last=99; show(99);} return; }
  let idx=0;
  for(let i=0;i<F.length;i++){ if(tt>=F[i].t0 && tt<F[i].t1) idx=i; }
  if(idx!==last) show(idx);
};
show(0);
const t0=performance.now();
(function loop(now){
  window.__setTime((now-t0)/1000);
  if((now-t0)/1000 < D+0.5) requestAnimationFrame(loop);
})(t0);
</script>
</body></html>`;
}

async function main() {
    const date = arg('--date', '2026-07-20');
    const index = Number(arg('--index', '1'));
    const ytDir = join(ROOT, 'logs/social-drafts', date, 'youtube', `shorts-${index}`);
    const audio = [join(ytDir, 'voice-clean.wav'), join(ytDir, 'voice-clean.mp3')].find((p) =>
        existsSync(p)
    );
    if (!audio) throw new Error('voice-clean yok');

    const sceneFiles = [
        's01-ofis-baski.jpg',
        's02-mahkeme-yolu.jpg',
        's03-dilekce-yok.jpg',
        's04-avukat-savunma.jpg',
        's05-yargic-dinliyor.jpg',
        's06-karar-tokmak.jpg',
        's07-zafer.jpg',
    ].map((n) => join(CAST_SCENES, n));

    for (const p of sceneFiles) {
        if (!existsSync(p)) throw new Error('Sahne eksik: ' + p);
    }

    const duration = await probeDuration(audio);
    // denser: 7 story beats before end card
    const weights = [0.12, 0.12, 0.16, 0.14, 0.12, 0.16, 0.12];
    const storyDur = duration * 0.93;
    let acc = 0;
    const meta = [
        {
            who: 'Pembo × Coşkun',
            cast: ['Pembo', 'Coşkun'],
            caption: 'Bir çalışan… alacak peşinde. Coşkun baskı yapar.',
            motion: 'push',
            flash: false,
        },
        {
            who: 'Pembo × Nuri',
            cast: ['Pembo', 'Nuri'],
            caption: 'Mahkeme yolu. Nuri yol kesmeye çalışır.',
            motion: 'rise',
            flash: false,
        },
        {
            who: 'Pembo × Coşkun',
            cast: ['Pembo', 'Coşkun'],
            caption: 'Islah dilekçesi yok sayılır!',
            motion: 'shake',
            flash: true,
        },
        {
            who: 'Av. Fethi × Pembo',
            cast: ['Av. Fethi', 'Pembo'],
            caption: 'İyi avukat devreye girer: hak aranır.',
            motion: 'rise',
            flash: false,
        },
        {
            who: 'Yargıç Hulki',
            cast: ['Yargıç Hulki'],
            caption: 'Yargıç Hulki dosyayı dinler.',
            motion: 'push',
            flash: false,
        },
        {
            who: 'Yargıç Hulki',
            cast: ['Yargıç Hulki', 'Pembo', 'Coşkun'],
            caption: 'Karar: dilekçe yok sayılamaz!',
            motion: 'slam',
            flash: true,
        },
        {
            who: 'Pembo × Av. Fethi',
            cast: ['Pembo', 'Av. Fethi'],
            caption: 'Hak korundu. Pembo yürür.',
            motion: 'win',
            flash: false,
        },
    ];

    const frames = [];
    for (let i = 0; i < sceneFiles.length; i++) {
        const t0 = acc;
        const t1 = acc + weights[i] * storyDur;
        acc = t1;
        frames.push({
            src: await toDataUri(sceneFiles[i]),
            t0,
            t1,
            ...meta[i],
        });
    }

    let kunye = '';
    try {
        const draft = JSON.parse(await readFile(join(ROOT, 'logs/social-drafts', `${date}.json`), 'utf8'));
        kunye = draft.items?.[index - 1]?.topic?.kunye || '';
    } catch {
        /* */
    }

    const html = buildHtml({ duration, frames, kunye });
    const work = join(ytDir, 'cast-cine-work');
    await mkdir(work, { recursive: true });
    await writeFile(join(work, 'film.html'), html, 'utf8');

    const ffmpeg = await findFfmpeg();
    if (!ffmpeg) throw new Error('ffmpeg yok');

    console.log(`[cast-cine] ${duration.toFixed(1)}s · ${frames.length} dense shots · recording…`);
    const browser = await chromium.launch({ headless: true });
    let videoPath = null;
    try {
        const context = await browser.newContext({
            viewport: { width: 1080, height: 1920 },
            recordVideo: { dir: work, size: { width: 1080, height: 1920 } },
        });
        const page = await context.newPage();
        await page.setContent(html, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(Math.ceil(duration * 1000) + 1500);
        const vid = page.video();
        await page.close();
        await context.close();
        if (vid) videoPath = await vid.path();
    } finally {
        await browser.close();
    }

    if (!videoPath || !existsSync(videoPath)) throw new Error('video kaydı yok');

    const outPath = join(ytDir, 'shorts-cast.mp4');
    console.log('[cast-cine] mux voice…');
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
        '17',
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

    console.log('[cast-cine] DONE →', outPath);
}

main().catch((e) => {
    console.error('[cast-cine] fatal:', e.message);
    process.exit(1);
});
