// scripts/lib/instagram-poster.js
import { chromium } from 'playwright';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME_PROFILE = join(homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'InstagramBot');
const INSTAGRAM_URL = 'https://www.instagram.com';
const POST_DELAY_MS = Number(process.env.SOCIAL_IG_DELAY_MS || 60_000);

async function clickFirstVisible(page, selectors, label, timeoutEach = 2500) {
  for (const sel of selectors) {
    try {
      const el = page.locator(sel).first();
      await el.waitFor({ state: 'visible', timeout: timeoutEach });
      await el.click({ force: true });
      console.log(`[instagram-poster] ${label}: ${sel}`);
      return true;
    } catch {
      /* next */
    }
  }
  return false;
}

async function ensureLoggedIn(page) {
  // Profile switcher / saved session
  await clickFirstVisible(
    page,
    [
      '[aria-label*="Devam"]',
      'button:has-text("Devam")',
      '[role="button"]:has-text("Devam")',
      'div[role="button"]:has-text("Devam")',
      'button:has-text("Continue")',
      '[role="button"]:has-text("Continue as")',
    ],
    'resume session',
    2000
  );
  await page.waitForTimeout(5_000);

  // Dismiss cookie if any
  await clickFirstVisible(
    page,
    [
      'button:has-text("Allow all cookies")',
      'button:has-text("Tüm çerezlere izin ver")',
      'button:has-text("Accept")',
      'button:has-text("Kabul Et")',
    ],
    'cookies',
    1500
  );

  // Wait for feed chrome
  const homeOk = await clickFirstVisible(
    page,
    [
      // just detect, don't need to click home if already there — use wait
    ],
    'noop',
    1
  );
  void homeOk;

  for (const sel of [
    '[aria-label="Ana Sayfa"]',
    '[aria-label="Home"]',
    'svg[aria-label="Home"]',
    'svg[aria-label="Ana Sayfa"]',
    '[aria-label="Yeni gönderi"]',
    '[aria-label="New post"]',
    'a[href="/"]',
  ]) {
    try {
      await page.locator(sel).first().waitFor({ state: 'visible', timeout: 6_000 });
      console.log(`[instagram-poster] home ready: ${sel}`);
      return true;
    } catch {
      /* next */
    }
  }

  const url = page.url();
  if (/accounts\/login|challenge/i.test(url)) {
    throw new Error(
      '[instagram-poster] Oturum yok / challenge. Manuel: node login-instagram.js — tarayıcıda giriş yapıp kapatın.'
    );
  }
  // soft continue — might still work
  console.warn('[instagram-poster] home selectors missing; continuing with URL', url);
  return false;
}

async function openCreate(page) {
  const opened = await clickFirstVisible(
    page,
    [
      '[aria-label="Yeni gönderi"]',
      '[aria-label="Yeni Gönderi"]',
      '[aria-label="New post"]',
      '[aria-label="Create"]',
      '[aria-label="Oluştur"]',
      'svg[aria-label="New post"]',
      'svg[aria-label="Yeni gönderi"]',
      'svg[aria-label="Yeni Gönderi"]',
      'a[href*="/create"]',
      'span:text-is("Oluştur")',
      'span:text-is("Create")',
    ],
    'create',
    3000
  );
  if (opened) {
    await page.waitForTimeout(2_000);
    return;
  }
  // Only as last resort — can force re-login on some sessions
  await page.goto(`${INSTAGRAM_URL}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2_000);
  const again = await clickFirstVisible(
    page,
    [
      '[aria-label="Yeni gönderi"]',
      '[aria-label="New post"]',
      'svg[aria-label="New post"]',
      'svg[aria-label="Yeni gönderi"]',
    ],
    'create-retry',
    4000
  );
  if (!again) {
    throw new Error('[instagram-poster] Create button not found after login');
  }
  await page.waitForTimeout(2_000);
}

async function clickNext(page, stage) {
  const ok = await clickFirstVisible(
    page,
    [
      'div[role="button"]:has-text("İleri")',
      'button:has-text("İleri")',
      'div[role="button"]:has-text("Next")',
      'button:has-text("Next")',
      '[aria-label="İleri"]',
      '[aria-label="Next"]',
      // top-right text in dialog header
      'div[role="dialog"] div[role="button"]:has-text("İleri")',
      'div[role="dialog"] div[role="button"]:has-text("Next")',
      'div[role="dialog"] button:has-text("İleri")',
      'div[role="dialog"] button:has-text("Next")',
    ],
    `Next (${stage})`,
    4000
  );
  if (!ok) {
    // dump buttons for debug
    const dump = await page
      .evaluate(() =>
        [...document.querySelectorAll('button, [role="button"]')]
          .map((el) => (el.innerText || el.getAttribute('aria-label') || '').trim())
          .filter(Boolean)
          .slice(0, 40)
      )
      .catch(() => []);
    console.warn('[instagram-poster] Next candidates:', dump);
    throw new Error(`[instagram-poster] Next (${stage}) button not found`);
  }
  await page.waitForTimeout(2_500);
}

async function postSingle(page, imagePath, caption) {
  console.log('[instagram-poster] navigating to home...');
  await page.goto(INSTAGRAM_URL + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3_000);
  await ensureLoggedIn(page);
  await page.waitForTimeout(2_000);

  const debugPath = join(tmpdir(), 'ig-debug.png');
  await page.screenshot({ path: debugPath, fullPage: false });
  console.log(`[instagram-poster] debug screenshot: ${debugPath}`);

  await openCreate(page);

  // File input — may appear after Create
  let fileInput = page.locator('input[type="file"]').first();
  try {
    await fileInput.waitFor({ state: 'attached', timeout: 8_000 });
  } catch {
    // "Select from computer" / "Bilgisayardan seç"
    await clickFirstVisible(
      page,
      [
        'button:has-text("Select from computer")',
        'button:has-text("Bilgisayardan seç")',
        'button:has-text("Select From Computer")',
        'div[role="button"]:has-text("Bilgisayardan seç")',
        'div[role="button"]:has-text("Select from computer")',
      ],
      'select-from-computer',
      3000
    );
    fileInput = page.locator('input[type="file"]').first();
    await fileInput.waitFor({ state: 'attached', timeout: 10_000 });
  }

  await fileInput.setInputFiles(imagePath);
  console.log('[instagram-poster] file set');
  await page.waitForTimeout(7_000);

  const afterUploadPath = join(tmpdir(), 'ig-after-upload.png');
  await page.screenshot({ path: afterUploadPath, fullPage: false });
  console.log(`[instagram-poster] after-upload: ${afterUploadPath}`);

  // Crop → Filter → Caption (sometimes only one Next)
  await clickNext(page, 'crop');
  // second next optional (filters)
  try {
    await clickNext(page, 'filter');
  } catch {
    console.warn('[instagram-poster] filter Next skipped (may already be caption screen)');
  }

  const captionArea = page
    .locator(
      'div[aria-label*="caption" i], div[aria-label*="açıklama" i], div[aria-label*="Write a caption" i], div[role="textbox"]'
    )
    .first();
  await captionArea.waitFor({ timeout: 15_000 });
  await captionArea.click();
  await page.waitForTimeout(400);
  // clear then type
  await page.keyboard.press('Control+A');
  await captionArea.pressSequentially(caption, { delay: 12 });
  await page.waitForTimeout(1_000);

  const shared = await clickFirstVisible(
    page,
    [
      'div[role="button"]:has-text("Paylaş")',
      'button:has-text("Paylaş")',
      'div[role="button"]:has-text("Share")',
      'button:has-text("Share")',
      '[aria-label="Paylaş"]',
      '[aria-label="Share"]',
    ],
    'Share',
    4000
  );
  if (!shared) throw new Error('[instagram-poster] Share button not found');
  await page.waitForTimeout(8_000);
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
      viewport: { width: 1280, height: 900 },
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
