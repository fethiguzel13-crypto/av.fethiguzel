import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('https://www.avfethiguzel.com/ara?q=TBK%2013', {
  waitUntil: 'networkidle',
  timeout: 90000,
});
await page.waitForTimeout(4000);
const text = await page.locator('main').innerText();
console.log('MAIN TEXT START:\n', text.slice(0, 2000));
const links = await page.locator('a[href*="madde-13"]').all();
console.log('madde-13 link count', links.length);
for (const a of links.slice(0, 5)) {
  console.log(' link', await a.getAttribute('href'), await a.innerText());
}
// first result card
const first = page.locator('a[href*="/mevzuat/"]').first();
if (await first.count()) {
  console.log('first mevzuat result', await first.getAttribute('href'), (await first.innerText()).slice(0, 80));
}
await browser.close();
