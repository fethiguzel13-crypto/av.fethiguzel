import { chromium } from 'playwright';
import { homedir } from 'node:os';
import { join } from 'node:path';

const p = join(homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'InstagramBot');
const ctx = await chromium.launchPersistentContext(p, {
  channel: 'chrome',
  headless: true,
  ignoreDefaultArgs: ['--enable-automation'],
  args: ['--disable-blink-features=AutomationControlled']
});
const page = await ctx.newPage();
await page.goto('https://www.instagram.com', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);
const labels = await page.evaluate(() =>
  [...document.querySelectorAll('[aria-label]')]
    .map(el => el.getAttribute('aria-label'))
    .filter(Boolean)
);
console.log(JSON.stringify([...new Set(labels)], null, 2));
await ctx.close();
