/**
 * YouTube Shorts package helpers: titles, descriptions, file exports.
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const SITE = 'avfethiguzel.com';

function stripSiteSpam(text) {
    return String(text || '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

/** Shorts title ≤100 chars, no hashtag stuffing */
export function buildYoutubeTitle(item) {
    const t = item.topic || {};
    const source = t.source || 'Hukuk';
    const base =
        item.youtubeTitle ||
        item.cardHeadline ||
        t.title ||
        'Güncel hukuk notu';
    let title = String(base).replace(/\s+/g, ' ').trim();
    if (!title.endsWith('.') && !title.endsWith('?') && !title.endsWith('!')) {
        // keep as is for headlines that already have period
    }
    // Prefer short source tag
    if (!new RegExp(source, 'i').test(title) && title.length < 80) {
        title = `${title} | ${source}`;
    }
    if (title.length > 100) title = title.slice(0, 97) + '…';
    return title;
}

export function buildYoutubeDescription(item) {
    const t = item.topic || {};
    const script = stripSiteSpam(item.youtubeScript || '');
    const kunye = t.kunye || '';
    const url = (t.url || `https://${SITE}`).replace(/^https?:\/\//, '');
    return [
        script,
        '',
        kunye ? `Kaynak: ${kunye}` : null,
        `Detay: ${url}`,
        '',
        '#hukuk #içtihat #shorts #avukat #AnayasaMahkemesi #Yargıtay',
        '',
        'Genel bilgilendirmedir; somut dosya için ayrı değerlendirme gerekir.',
    ]
        .filter((x) => x !== null)
        .join('\n');
}

export function buildYoutubeTags(item) {
    const t = item.topic || {};
    const tags = ['hukuk', 'içtihat', 'shorts', 'avukat', 'avfethiguzel'];
    if (/AYM/i.test(t.source || '')) tags.push('AnayasaMahkemesi', 'AYM');
    if (/Yargıtay|Yargitay/i.test(t.source || '')) tags.push('Yargıtay');
    if (/iş|isci|işçi/i.test(`${t.title} ${item.youtubeScript || ''}`)) tags.push('işhukuku');
    return [...new Set(tags)];
}

function run(cmd, args, opts = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, args, {
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: false,
            ...opts,
        });
        let out = '';
        let err = '';
        child.stdout?.on('data', (d) => (out += d));
        child.stderr?.on('data', (d) => (err += d));
        child.on('error', reject);
        child.on('close', (code) => {
            if (code === 0) resolve({ out, err });
            else reject(new Error(`${cmd} exit ${code}: ${err.slice(-400) || out.slice(-200)}`));
        });
    });
}

export async function findFfmpeg() {
    const candidates = [
        process.env.FFMPEG_PATH,
        'ffmpeg',
        join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Links', 'ffmpeg.exe'),
        'C:\\ffmpeg\\bin\\ffmpeg.exe',
    ].filter(Boolean);

    // winget Gyan.FFmpeg path pattern
    const wingetRoot = join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages');
    if (existsSync(wingetRoot)) {
        try {
            const { readdirSync, statSync } = await import('node:fs');
            const walk = (dir, depth = 0) => {
                if (depth > 4) return null;
                for (const name of readdirSync(dir)) {
                    const p = join(dir, name);
                    try {
                        if (name.toLowerCase() === 'ffmpeg.exe') return p;
                        if (statSync(p).isDirectory() && !name.startsWith('.')) {
                            const found = walk(p, depth + 1);
                            if (found) return found;
                        }
                    } catch {
                        /* skip */
                    }
                }
                return null;
            };
            const found = walk(wingetRoot);
            if (found) candidates.unshift(found);
        } catch {
            /* ignore */
        }
    }

    for (const c of candidates) {
        try {
            await run(c, ['-version']);
            return c;
        } catch {
            /* next */
        }
    }
    return null;
}

/**
 * TTS ses seçenekleri (edge-tts):
 * - en-US-BrianMultilingualNeural  → samimi, az resmi (varsayılan; Ahmet/Andrew'dan az robotik)
 * - en-US-AndrewMultilingualNeural → daha tok, sunucu tonu
 * - fr-FR-RemyMultilingualNeural   → alternatif erkek
 * - tr-TR-EmelNeural               → kadın, saf TR
 * - tr-TR-AhmetNeural              → robotik; önermiyoruz
 *
 * Env: YOUTUBE_TTS_VOICE, YOUTUBE_TTS_RATE, YOUTUBE_TTS_PITCH, YOUTUBE_TTS_PAUSE_MS
 */
export function resolveTtsOptions() {
    return {
        voice: process.env.YOUTUBE_TTS_VOICE || 'en-US-BrianMultilingualNeural',
        rate: process.env.YOUTUBE_TTS_RATE || '-8%',
        pitch: process.env.YOUTUBE_TTS_PITCH || '-2Hz',
        pauseMs: Number(process.env.YOUTUBE_TTS_PAUSE_MS || 280),
    };
}

/**
 * Cümle cümle TTS + araya kısa sessizlik → tekdüze “sürekli okuma” azalır.
 * Rate cümleden cümleye hafif değişir (ritim).
 */
export async function synthesizeVoice(text, outMp3, opts = {}) {
    const { voice, rate, pitch, pauseMs } = { ...resolveTtsOptions(), ...opts };
    const clean = stripSiteSpam(text)
        .replace(/#\w+/g, '')
        .replace(/avfethiguzel\.com[^\s]*/gi, 'avfethiguzel.com')
        .replace(/\s+/g, ' ')
        .trim();
    console.log(
        `[youtube] TTS voice=${voice} rate=${rate} pitch=${pitch} pauseMs=${pauseMs} (cümle ritimli)`
    );
    const scriptPath = join(dirname(fileURLToPath(import.meta.url)), 'tts_edge_rhythmic.py');
    await run('py', [scriptPath, clean, voice, rate, pitch, outMp3, String(pauseMs)]);
    return outMp3;
}

/**
 * Vertical Shorts: card image (1080x1080) centered on 1080x1920 dark bg + voiceover.
 */
export async function renderShortsVideo({
    ffmpeg,
    imagePath,
    audioPath,
    outPath,
}) {
    // scale card to width 1000, pad to 1080x1920, loop image for audio duration
    const vf =
        "scale=1000:-1:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0a0500,format=yuv420p";
    await run(ffmpeg, [
        '-y',
        '-loop',
        '1',
        '-i',
        imagePath,
        '-i',
        audioPath,
        '-c:v',
        'libx264',
        '-tune',
        'stillimage',
        '-c:a',
        'aac',
        '-b:a',
        '192k',
        '-pix_fmt',
        'yuv420p',
        '-shortest',
        '-vf',
        vf,
        '-movflags',
        '+faststart',
        outPath,
    ]);
    return outPath;
}

/**
 * Export full YouTube package for a draft day.
 * @returns {Promise<object[]>} package metadata per item
 */
export async function exportYoutubePackages(draft, outDir, { makeVideo = true } = {}) {
    await mkdir(outDir, { recursive: true });
    const ffmpeg = makeVideo ? await findFfmpeg() : null;
    if (makeVideo && !ffmpeg) {
        console.warn('[youtube] ffmpeg yok — sadece metin + ses paketi üretilecek');
    }

    const packages = [];
    for (let i = 0; i < (draft.items || []).length; i++) {
        const item = draft.items[i];
        const n = i + 1;
        const dir = join(outDir, `shorts-${n}`);
        await mkdir(dir, { recursive: true });

        const title = buildYoutubeTitle(item);
        const description = buildYoutubeDescription(item);
        const tags = buildYoutubeTags(item);
        const script = stripSiteSpam(item.youtubeScript || '');

        const scriptPath = join(dir, 'script.txt');
        const titlePath = join(dir, 'title.txt');
        const descPath = join(dir, 'description.txt');
        const tagsPath = join(dir, 'tags.txt');
        const metaPath = join(dir, 'meta.json');
        const audioPath = join(dir, 'voice.mp3');
        const videoPath = join(dir, 'shorts.mp4');

        await writeFile(scriptPath, script + '\n', 'utf8');
        await writeFile(titlePath, title + '\n', 'utf8');
        await writeFile(descPath, description + '\n', 'utf8');
        await writeFile(tagsPath, tags.join(', ') + '\n', 'utf8');

        let audio = null;
        let video = null;
        try {
            console.log(`[youtube] TTS ${n}/${draft.items.length}…`);
            await synthesizeVoice(script, audioPath);
            audio = audioPath;
        } catch (e) {
            console.warn(`[youtube] TTS fail ${n}:`, e.message);
        }

        if (audio && ffmpeg && item.cardPath && existsSync(item.cardPath)) {
            try {
                console.log(`[youtube] render video ${n}…`);
                await renderShortsVideo({
                    ffmpeg,
                    imagePath: item.cardPath,
                    audioPath: audio,
                    outPath: videoPath,
                });
                video = videoPath;
            } catch (e) {
                console.warn(`[youtube] video fail ${n}:`, e.message);
            }
        }

        const meta = {
            index: n,
            title,
            tags,
            scriptPath,
            descriptionPath: descPath,
            audioPath: audio,
            videoPath: video,
            cardPath: item.cardPath || null,
            topic: item.topic,
            status: video ? 'video_ready' : audio ? 'audio_ready' : 'text_only',
        };
        await writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf8');
        packages.push(meta);
    }

    const indexPath = join(outDir, 'INDEX.md');
    let md = `# YouTube Shorts paketi — ${draft.date}\n\n`;
    md += `Klasör: \`${outDir}\`\n\n`;
    md += `Her shorts-N içinde: script.txt, title.txt, description.txt, tags.txt, voice.mp3, (varsa) shorts.mp4\n\n`;
    packages.forEach((p) => {
        md += `## ${p.index}. ${p.title}\n\n`;
        md += `- Durum: **${p.status}**\n`;
        if (p.videoPath) md += `- Video: \`${p.videoPath}\`\n`;
        if (p.audioPath) md += `- Ses: \`${p.audioPath}\`\n`;
        md += `- Metin: \`shorts-${p.index}/script.txt\`\n\n`;
    });
    md += `## YouTube Studio\n\n`;
    md += `1. studio.youtube.com → Oluştur → Videoları yükle\n`;
    md += `2. shorts.mp4 seçin (yoksa voice.mp3 + card ile CapCut)\n`;
    md += `3. title.txt / description.txt yapıştırın\n`;
    md += `4. Shorts olarak işaretleyin (dikey 9:16)\n`;
    await writeFile(indexPath, md, 'utf8');

    return packages;
}
