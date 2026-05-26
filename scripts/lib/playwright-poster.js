import { chromium } from 'playwright';
import { homedir } from 'node:os';
import { join } from 'node:path';

const CHROME_PROFILE = join(homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'TwitterBot');
const TWEET_DELAY_MS = 30_000;
const COMPOSE_URL = 'https://x.com/compose/tweet';

export async function postTweets(tweets) {
  if (!tweets || tweets.length === 0) {
    console.warn('[playwright-poster] no tweets to post');
    return;
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
    });
  } catch (err) {
    console.error(`[playwright-poster] failed to open Chrome profile at ${CHROME_PROFILE}`);
    console.error('[playwright-poster] Run setup: New-Item -ItemType Directory -Force -Path "$env:LOCALAPPDATA\\Google\\Chrome\\User Data\\TwitterBot"');
    throw err;
  }

  const page = await context.newPage();

  try {
    for (let i = 0; i < tweets.length; i++) {
      const text = tweets[i];
      console.log(`[playwright-poster] posting tweet ${i + 1}/${tweets.length}`);

      await page.goto(COMPOSE_URL, { waitUntil: 'domcontentloaded' });

      const textarea = page.locator('[data-testid="tweetTextarea_0"]');
      await textarea.waitFor({ timeout: 20_000 });
      await textarea.click();
      await page.keyboard.type(text, { delay: 30 });
      await page.waitForTimeout(2_000);

      const postBtn = page.locator('[data-testid="tweetButtonInline"]:not([disabled])');
      await postBtn.waitFor({ timeout: 15_000 });
      await postBtn.click();
      await page.waitForTimeout(3_000);

      console.log(`[playwright-poster] ✓ tweet ${i + 1} posted`);

      if (i < tweets.length - 1) {
        console.log(`[playwright-poster] waiting ${TWEET_DELAY_MS / 1000}s before next tweet...`);
        await page.waitForTimeout(TWEET_DELAY_MS);
      }
    }
  } finally {
    await context?.close();
  }
}
