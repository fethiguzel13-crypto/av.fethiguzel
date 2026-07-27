/**
 * Upload a Short / video via YouTube Studio (Playwright + Chrome profile YouTubeBot).
 */
import { chromium } from 'playwright';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

const CHROME_PROFILE = join(homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'YouTubeBot');
const STUDIO = 'https://studio.youtube.com';

async function clickFirst(page, selectors, label, timeoutEach = 4000) {
    for (const sel of selectors) {
        try {
            const el = page.locator(sel).first();
            await el.waitFor({ state: 'visible', timeout: timeoutEach });
            await el.click({ force: true });
            console.log(`[youtube-poster] ${label}: ${sel}`);
            return true;
        } catch {
            /* next */
        }
    }
    return false;
}

/**
 * @param {{ videoPath: string, title: string, description?: string, madeForKids?: boolean }} opts
 */
export async function uploadYoutubeVideo(opts) {
    const {
        videoPath,
        title,
        description = '',
        madeForKids = false,
    } = opts;

    if (!existsSync(videoPath)) throw new Error(`Video yok: ${videoPath}`);
    if (!existsSync(CHROME_PROFILE)) {
        throw new Error(
            `YouTube profili yok. Önce: node login-youtube.js\nBeklenen: ${CHROME_PROFILE}`
        );
    }

    let context;
    try {
        context = await chromium.launchPersistentContext(CHROME_PROFILE, {
            channel: 'chrome',
            headless: false,
            ignoreDefaultArgs: ['--enable-automation'],
            args: [
                '--disable-blink-features=AutomationControlled',
                '--no-first-run',
                '--no-default-browser-check',
            ],
            viewport: { width: 1360, height: 900 },
        });
    } catch (e) {
        throw new Error(`Chrome YouTubeBot açılamadı: ${e.message}`);
    }

    const page = await context.newPage();
    try {
        console.log('[youtube-poster] Studio…');
        await page.goto(STUDIO, { waitUntil: 'domcontentloaded', timeout: 90_000 });
        await page.waitForTimeout(4000);

        // Login wall?
        if (/accounts\.google|ServiceLogin/i.test(page.url())) {
            throw new Error('YouTube oturumu yok. Çalıştırın: node login-youtube.js');
        }

        // CREATE button
        const created = await clickFirst(
            page,
            [
                '#create-icon',
                'ytcp-button#create-icon',
                '[id="create-icon"]',
                'button[aria-label*="Oluştur"]',
                'button[aria-label*="Create"]',
                '#create-icon-button',
                'ytcp-button#create-icon-button',
            ],
            'create',
            5000
        );
        if (!created) {
            // direct upload URL sometimes works when channel id known
            await page.goto(`${STUDIO}/channel/`, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(2000);
            const again = await clickFirst(
                page,
                ['#create-icon', 'ytcp-button#create-icon', 'button[aria-label*="Oluştur"]'],
                'create-retry',
                5000
            );
            if (!again) throw new Error('Oluştur butonu bulunamadı — Studio dil/UI değişmiş olabilir');
        }
        await page.waitForTimeout(1000);

        // Upload videos menu item
        const uploadMenu = await clickFirst(
            page,
            [
                'tp-yt-paper-item#text-item-0',
                'tp-yt-paper-item:has-text("Videoları yükle")',
                'tp-yt-paper-item:has-text("Upload videos")',
                'yt-formatted-string:has-text("Videoları yükle")',
                'yt-formatted-string:has-text("Upload videos")',
                '#text-item-0',
            ],
            'upload-menu',
            4000
        );
        if (!uploadMenu) {
            // some UIs open file dialog from create directly
            console.warn('[youtube-poster] upload menu text not found — trying file input');
        }
        await page.waitForTimeout(2000);

        // File input
        const fileInput = page.locator('input[type="file"]').first();
        await fileInput.waitFor({ state: 'attached', timeout: 20_000 });
        await fileInput.setInputFiles(videoPath);
        console.log('[youtube-poster] file set');
        await page.waitForTimeout(6000);

        // Title — YouTube uses contenteditable textbox
        const titleBox = page
            .locator(
                '#textbox[aria-label*="title" i], #textbox[aria-label*="Başlık" i], #title-textarea #textbox, div#textbox'
            )
            .first();
        await titleBox.waitFor({ state: 'visible', timeout: 60_000 });
        await titleBox.click({ force: true });
        await page.keyboard.press('Control+A');
        await page.keyboard.type(title.slice(0, 100), { delay: 15 });
        console.log('[youtube-poster] title set');

        // Description
        if (description) {
            const desc = page
                .locator(
                    '#description-textarea #textbox, #textbox[aria-label*="description" i], #textbox[aria-label*="Açıklama" i]'
                )
                .first();
            try {
                await desc.waitFor({ state: 'visible', timeout: 8000 });
                await desc.click({ force: true });
                await page.keyboard.type(description.slice(0, 4500), { delay: 5 });
                console.log('[youtube-poster] description set');
            } catch {
                console.warn('[youtube-poster] description field skip');
            }
        }

        // Not made for kids
        await clickFirst(
            page,
            [
                'tp-yt-paper-radio-button[name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]',
                '#radioLabel:has-text("Hayır")',
                'tp-yt-paper-radio-button:has-text("Hayır")',
                'tp-yt-paper-radio-button:has-text("No")',
            ],
            'not-for-kids',
            3000
        );
        if (madeForKids) {
            await clickFirst(
                page,
                ['tp-yt-paper-radio-button[name="VIDEO_MADE_FOR_KIDS_MFK"]'],
                'for-kids',
                2000
            );
        }

        // Next through checks / visibility (usually 3 nexts)
        for (let step = 0; step < 3; step++) {
            await page.waitForTimeout(1500);
            const next = await clickFirst(
                page,
                [
                    '#next-button:not([disabled])',
                    'ytcp-button#next-button',
                    'button:has-text("İleri")',
                    'button:has-text("Next")',
                ],
                `next-${step + 1}`,
                8000
            );
            if (!next) break;
        }

        // Public visibility
        await page.waitForTimeout(2000);
        await clickFirst(
            page,
            [
                'tp-yt-paper-radio-button[name="PUBLIC"]',
                '#privacy-radios tp-yt-paper-radio-button[name="PUBLIC"]',
                'tp-yt-paper-radio-button:has-text("Herkese açık")',
                'tp-yt-paper-radio-button:has-text("Public")',
            ],
            'public',
            5000
        );

        // Wait for upload processing enough to enable publish
        console.log('[youtube-poster] waiting for publish button…');
        let published = false;
        for (let i = 0; i < 40; i++) {
            const done = await clickFirst(
                page,
                [
                    '#done-button:not([disabled])',
                    'ytcp-button#done-button',
                    'button:has-text("Yayınla")',
                    'button:has-text("Publish")',
                    'button:has-text("Kaydet")',
                    'button:has-text("Save")',
                ],
                'publish',
                3000
            );
            if (done) {
                published = true;
                break;
            }
            await page.waitForTimeout(3000);
        }

        if (!published) {
            throw new Error(
                'Yayınla butonu aktif olmadı (yükleme uzun sürebilir). Studio penceresinde manuel tamamlayın.'
            );
        }

        await page.waitForTimeout(5000);
        console.log('[youtube-poster] publish clicked — check Studio for final URL');
        // Try capture share URL
        let url = null;
        try {
            const link = page.locator('a.ytcp-video-info, a[href*="youtu.be"], a[href*="youtube.com/shorts"]').first();
            await link.waitFor({ timeout: 15_000 });
            url = await link.getAttribute('href');
        } catch {
            /* optional */
        }
        return { ok: true, url };
    } finally {
        // keep browser open briefly so user sees result, then close
        await page.waitForTimeout(8000);
        await context?.close();
    }
}
