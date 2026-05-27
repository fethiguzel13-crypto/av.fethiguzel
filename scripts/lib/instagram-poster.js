// scripts/lib/instagram-poster.js
import { chromium } from 'playwright';
import { homedir } from 'node:os';
import { join } from 'node:path';

const CHROME_PROFILE = join(homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'InstagramBot');
const INSTAGRAM_URL = 'https://www.instagram.com';
const POST_DELAY_MS = 3 * 60 * 60 * 1000; // 3 saat — spam görünmesin

async function clickByText(page, texts, label) {
  const selectors = texts.flatMap(t => [
    `button:has-text("${t}")`,
    `[role="button"]:has-text("${t}")`,
    `div:text-is("${t}")`,
    `span:text-is("${t}")`,
  ]);
  for (const sel of selectors) {
    try {
      const el = page.locator(sel).first();
      await el.waitFor({ timeout: 3_000 });
      await el.click();
      console.log(`[instagram-poster] ${label} clicked with: ${sel}`);
      return;
    } catch { /* try next */ }
  }
  throw new Error(`[instagram-poster] ${label} button not found`);
}

async function postSingle(page, imagePath, caption) {
  console.log('[instagram-poster] navigating to home...');
  await page.goto(INSTAGRAM_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3_000);

  // Take debug screenshot so we can see what page looks like if selector fails
  const { tmpdir } = await import('node:os');
  const debugPath = join(tmpdir(), 'ig-debug.png');
  await page.screenshot({ path: debugPath, fullPage: false });
  console.log(`[instagram-poster] debug screenshot: ${debugPath}`);

  // Click the Create / New Post button — try multiple selector variants
  const createSelectors = [
    '[aria-label="Yeni Gönderi"]',
    '[aria-label="New post"]',
    '[aria-label="Yeni gönderi"]',
    '[aria-label="Create"]',
    '[aria-label="Oluştur"]',
    'svg[aria-label="New post"]',
    'a[href*="create"]',
  ];
  let createBtnClicked = false;
  for (const sel of createSelectors) {
    try {
      const el = page.locator(sel).first();
      await el.waitFor({ timeout: 3_000 });
      await el.click();
      createBtnClicked = true;
      console.log(`[instagram-poster] Create button found with selector: ${sel}`);
      break;
    } catch { /* try next */ }
  }
  if (!createBtnClicked) {
    throw new Error(`[instagram-poster] Create button not found. Check debug screenshot: ${debugPath}`);
  }
  await page.waitForTimeout(2_000);

  // Set image file on the hidden file input (Instagram hides it, so check attached not visible)
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.waitFor({ state: 'attached', timeout: 15_000 });
  await fileInput.setInputFiles(imagePath);
  await page.waitForTimeout(6_000);
  const afterUploadPath = join(tmpdir(), 'ig-after-upload.png');
  await page.screenshot({ path: afterUploadPath, fullPage: false });
  console.log(`[instagram-poster] after-upload screenshot: ${afterUploadPath}`);

  // Next → (crop screen)
  await clickByText(page, ['Next', 'İleri'], 'Next (crop)');
  await page.waitForTimeout(2_000);

  // Next → (filter screen)
  await clickByText(page, ['Next', 'İleri', 'Filtreler'], 'Next (filter)');
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
  await clickByText(page, ['Share', 'Paylaş'], 'Share');
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
