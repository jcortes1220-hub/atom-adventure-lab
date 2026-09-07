import { chromium } from 'file:///C:/Users/jeanC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  reducedMotion: 'reduce',
});
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page
  .getByRole('button', { name: 'Quick add Hydrogen', exact: true })
  .click();
await page
  .getByRole('button', { name: 'Quick add Hydrogen', exact: true })
  .click();
await page
  .getByRole('button', { name: 'Quick add Oxygen', exact: true })
  .click();
await page.getByRole('button', { name: 'What can this make?' }).click();
await page.getByRole('tab', { name: /Discovery Book/ }).click();
await page.getByRole('button', { name: /Water.*Explore discovery/ }).click();
await page.locator('[data-slot=sheet-content]').waitFor();
await page.screenshot({
  path: 'qa-sheet-viewport.png',
  animations: 'disabled',
});
const rect = await page.locator('[data-slot=sheet-content]').boundingBox();
assert.ok(rect.width <= 391);
assert.ok(rect.x >= -1);
await page.keyboard.press('Tab');
assert.ok(
  await page
    .locator('[data-slot=sheet-content]')
    .evaluate((el) => el.contains(document.activeElement)),
);
await page.keyboard.press('Escape');
await page.getByRole('tab', { name: 'Explore', exact: true }).click();
await page
  .getByRole('button', {
    name: 'Explore Oganesson (Og), atomic number 118',
    exact: true,
  })
  .click();
await page.getByRole('heading', { name: 'Oganesson', exact: true }).waitFor();
await page.keyboard.press('Escape');
await page.setViewportSize({ width: 768, height: 1024 });
await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
assert.ok(
  await page.evaluate(
    () => document.documentElement.scrollWidth <= innerWidth + 1,
  ),
);
console.log(
  'PASS: phone sheet bounds and focus trap, reduced-motion layout, element 118, 200% text sizing.',
);
await browser.close();
