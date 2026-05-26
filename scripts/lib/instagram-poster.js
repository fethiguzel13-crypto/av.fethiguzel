// scripts/lib/instagram-poster.js
import { chromium } from 'playwright';
import { homedir } from 'node:os';
import { join } from 'node:path';

const CHROME_PROFILE = join(homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'InstagramBot');
const INSTAGRAM_URL = 'https://www.instagram.com';
const POST_DELAY_MS = 60_000;

async function postSingle(page, imagePath, caption) {
  console.log('[instagram-poster] navigating to home...');
  await page.goto(INSTAGRAM_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3_000);

  // Click the Create / New Post button
  const createBtn = page.locator('[aria-label="New post"], [aria-label="Yeni gönderi"], [aria-label="Create"]').first();
  await createBtn.waitFor({ timeout: 20_000 });
  await createBtn.click();
  await page.waitForTimeout(2_000);

  // Set image file on the hidden file input
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.waitFor({ timeout: 15_000 });
  await fileInput.setInputFiles(imagePath);
  await page.waitForTimeout(3_000);

  // Next → (crop screen)
  const next1 = page.locator('button:has-text("Next"), button:has-text("İleri")').first();
  await next1.waitFor({ timeout: 15_000 });
  await next1.click();
  await page.waitForTimeout(2_000);

  // Next → (filter screen)
  const next2 = page.locator('button:has-text("Next"), button:has-text("İleri")').first();
  await next2.waitFor({ timeout: 15_000 });
  await next2.click();
  await page.waitForTimeout(2_000);

  // Type caption (contenteditable div on share screen)
  const captionArea = page.locator(
    'div[aria-label*="caption"], div[aria-label*="açıklama"], div[role="textbox"]'
  ).first();
  await captionArea.waitFor({ timeout: 15_000 });
  await captionArea.click();
  await page.waitForTimeout(500);
  await captionArea.pressSequentially(caption, { delay: 15 });
  await page.waitForTimeout(1_000);

  // Share
  const shareBtn = page.locator('button:has-text("Share"), button:has-text("Paylaş")').first();
  await shareBtn.waitFor({ timeout: 15_000 });
  await shareBtn.click({ force: true });
  await page.waitForTimeout(5_000);
}

export async function postInstagram(posts) {
  if (!posts || posts.length === 0) {
    console.warn('[instagram-poster] no posts to share');
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
    console.error(`[instagram-poster] Chrome profili açılamadı: ${CHROME_PROFILE}`);
    console.error('[instagram-poster] Önce login-instagram.js ile giriş yapın');
    throw err;
  }

  const page = await context.newPage();

  try {
    for (let i = 0; i < posts.length; i++) {
      const { imagePath, caption } = posts[i];
      console.log(`[instagram-poster] posting ${i + 1}/${posts.length}...`);
      await postSingle(page, imagePath, caption);
      console.log(`[instagram-poster] ✓ post ${i + 1} shared`);

      if (i < posts.length - 1) {
        console.log(`[instagram-poster] waiting ${POST_DELAY_MS / 1000}s before next post...`);
        await page.waitForTimeout(POST_DELAY_MS);
      }
    }
  } finally {
    await context?.close();
  }
}
