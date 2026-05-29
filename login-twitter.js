import { chromium } from 'playwright';
import { homedir } from 'os';
import { join } from 'path';

const p = join(homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'TwitterBot');
const ctx = await chromium.launchPersistentContext(p, {
  channel: 'chrome',
  headless: false,
  ignoreDefaultArgs: ['--enable-automation'],
  args: [
    '--disable-blink-features=AutomationControlled',
    '--no-first-run',
    '--no-default-browser-check',
  ],
});
const page = await ctx.newPage();
await page.goto('https://x.com/login');

console.log('Twitter açıldı. Giriş yap. Bittikten sonra bu terminale Ctrl+C bas.');

// 10 dakika bekle
await new Promise(r => setTimeout(r, 600_000));
await ctx.close();
