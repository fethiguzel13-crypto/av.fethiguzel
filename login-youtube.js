/**
 * One-time YouTube Studio login for Playwright profile.
 * Usage: node login-youtube.js
 * Browser opens — log in to the channel Google account, then leave open or Ctrl+C after success.
 */
import { chromium } from 'playwright';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';

const CHROME_PROFILE = join(homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'YouTubeBot');
mkdirSync(CHROME_PROFILE, { recursive: true });

const ctx = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome',
    headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
        '--disable-blink-features=AutomationControlled',
        '--no-first-run',
        '--no-default-browser-check',
    ],
    viewport: { width: 1280, height: 900 },
});

const page = await ctx.newPage();
await page.goto('https://studio.youtube.com/', { waitUntil: 'domcontentloaded' });
console.log('YouTube Studio açıldı.');
console.log('Google hesabınızla giriş yapın (kanal hesabı).');
console.log('Studio ana sayfasını görünce bu pencerede 3 dk bekleyin veya Ctrl+C.');
await new Promise((r) => setTimeout(r, 180_000));
await ctx.close();
console.log('Profil kaydedildi:', CHROME_PROFILE);
