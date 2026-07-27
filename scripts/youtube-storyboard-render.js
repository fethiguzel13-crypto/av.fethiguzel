/**
 * Storyboard Shorts: scene images + Ken Burns + xfade + human voice.
 * Usage:
 *   node scripts/youtube-storyboard-render.js --date 2026-07-20 --index 1
 */
import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { findFfmpeg } from './lib/youtube-package.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');

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
            else reject(new Error(err.slice(-800) || `exit ${code}`));
        });
    });
}

function probeDuration(ffmpeg, file) {
    const probe = process.env.FFPROBE_PATH || 'ffprobe';
    return new Promise((resolve) => {
        const child = spawn(
            probe,
            ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file],
            { stdio: ['ignore', 'pipe', 'pipe'] }
        );
        let out = '';
        child.stdout.on('data', (d) => (out += d));
        child.on('close', () => {
            const n = parseFloat(out.trim());
            resolve(n > 0 ? n : 49.2);
        });
        child.on('error', () => resolve(49.2));
    });
}

async function main() {
    const date = arg('--date', new Date().toISOString().slice(0, 10));
    const index = Number(arg('--index', '1'));
    const ytDir = join(ROOT, 'logs/social-drafts', date, 'youtube', `shorts-${index}`);
    const board = join(ytDir, 'storyboard');
    const audio =
        [join(ytDir, 'voice-clean.wav'), join(ytDir, 'voice-clean.mp3')].find((p) => existsSync(p)) ||
        null;
    if (!audio) throw new Error('voice-clean yok');
    if (!existsSync(board)) throw new Error(`storyboard yok: ${board}`);

    const scenes = [
        join(board, '01-mahkeme-yolu.jpg'),
        join(board, '02-dilekce-yok.jpg'),
        join(board, '03-aym-salon.jpg'),
        join(board, '04-dilekce-koruma.jpg'),
        join(board, '05-kapanis.jpg'),
    ];
    for (const s of scenes) {
        if (!existsSync(s)) throw new Error(`Sahne yok: ${s}`);
    }

    const ffmpeg = await findFfmpeg();
    if (!ffmpeg) throw new Error('ffmpeg yok');

    const duration = await probeDuration(ffmpeg, audio);
    // Weights match narrative length (story-heavy middle)
    const weights = [0.16, 0.28, 0.28, 0.16, 0.12];
    const durs = weights.map((w) => Math.max(2.5, duration * w));
    // normalize sum to duration
    const sum = durs.reduce((a, b) => a + b, 0);
    const norm = durs.map((d) => (d / sum) * duration);
    const xfade = 0.55;

    console.log(`[storyboard] audio=${duration.toFixed(2)}s scenes=${norm.map((d) => d.toFixed(1)).join(', ')}`);

    const work = join(ytDir, 'story-work');
    await mkdir(work, { recursive: true });

    // Scale each still to 1080x1920 cover
    const scaled = [];
    for (let i = 0; i < scenes.length; i++) {
        const out = join(work, `s${i}.png`);
        await run(ffmpeg, [
            '-y',
            '-i',
            scenes[i],
            '-vf',
            'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,format=yuv420p',
            out,
        ]);
        scaled.push(out);
    }

    // Ken Burns clip per scene (slightly longer than display to allow xfade)
    const clips = [];
    for (let i = 0; i < scaled.length; i++) {
        const d = norm[i] + (i < scaled.length - 1 ? xfade : 0.05);
        const frames = Math.max(2, Math.ceil(d * 30));
        const out = join(work, `c${i}.mp4`);
        // alternate zoom direction
        const z =
            i % 2 === 0
                ? `'min(zoom+0.0009,1.18)'`
                : `'if(eq(on,1),1.15,max(zoom-0.0009,1.0))'`;
        const zp = `scale=8000:-1,zoompan=z=${z}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=30,format=yuv420p`;
        console.log(`[storyboard] clip ${i + 1}/${scaled.length} ${d.toFixed(1)}s`);
        await run(ffmpeg, [
            '-y',
            '-loop',
            '1',
            '-i',
            scaled[i],
            '-vf',
            zp,
            '-t',
            d.toFixed(3),
            '-c:v',
            'libx264',
            '-pix_fmt',
            'yuv420p',
            '-an',
            out,
        ]);
        clips.push(out);
    }

    // Chain xfade
    // [0][1]xfade -> [v01]; [v01][2]xfade -> ...
    let filter = '';
    let last = '[0:v]';
    const inputs = [];
    for (const c of clips) {
        inputs.push('-i', c);
    }
    if (clips.length === 1) {
        filter = '[0:v]format=yuv420p[vout]';
    } else {
        let offset = norm[0] - xfade;
        for (let i = 1; i < clips.length; i++) {
            const outLabel = i === clips.length - 1 ? '[vout]' : `[v${i}]`;
            const left = i === 1 ? '[0:v]' : `[v${i - 1}]`;
            const right = `[${i}:v]`;
            filter += `${left}${right}xfade=transition=fade:duration=${xfade}:offset=${Math.max(0.1, offset).toFixed(3)}${outLabel};`;
            if (i < clips.length - 1) {
                offset += norm[i] - xfade;
            }
        }
    }

    const silentVideo = join(work, 'visual.mp4');
    console.log('[storyboard] xfade assemble…');
    await run(ffmpeg, [
        '-y',
        ...inputs,
        '-filter_complex',
        filter.replace(/;$/, ''),
        '-map',
        '[vout]',
        '-c:v',
        'libx264',
        '-pix_fmt',
        'yuv420p',
        silentVideo,
    ]);

    const outPath = join(ytDir, 'shorts-story.mp4');
    console.log('[storyboard] mux voice…');
    await run(ffmpeg, [
        '-y',
        '-i',
        silentVideo,
        '-i',
        audio,
        '-c:v',
        'copy',
        '-c:a',
        'aac',
        '-b:a',
        '192k',
        '-shortest',
        '-movflags',
        '+faststart',
        outPath,
    ]);

    // captions sidecar for Studio
    await writeFile(
        join(ytDir, 'storyboard-scenes.txt'),
        [
            '1. Çalışan mahkeme yolunda (alacak için başvuru)',
            '2. Dilekçe / hesap / yok sayılma',
            '3. Anayasa Mahkemesi salonu / adalet',
            '4. Dilekçe korunur, dinlenmelidir',
            '5. Kapanış — avfethiguzel.com',
            '',
            `Çıktı: ${outPath}`,
        ].join('\n'),
        'utf8'
    );

    console.log('[storyboard] done →', outPath);
}

main().catch((e) => {
    console.error('[storyboard] fatal:', e.message);
    process.exit(1);
});
