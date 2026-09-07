import { chromium } from 'file:///C:/Users/jeanC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser = await chromium.launch({ headless: true, channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1600, height: 1100 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
await page.addInitScript(() => {
  window.__tools = {};
  Object.defineProperty(document, 'modelContext', {
    value: {
      registerTool(tool) {
        window.__tools[tool.name] = tool;
      },
    },
  });
});
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Mute sound', exact: true }).click();
await page.screenshot({ path: 'qa-desktop.png', fullPage: true });
await page
  .getByRole('button', { name: 'Quick add Hydrogen', exact: true })
  .click();
await page
  .getByRole('button', { name: 'Quick add Oxygen', exact: true })
  .click();
await page.getByRole('button', { name: 'What can this make?' }).click();
await page
  .getByRole('status')
  .filter({ hasText: 'No discovery yet' })
  .waitFor();
await page
  .getByRole('button', { name: 'Quick add Hydrogen', exact: true })
  .click();
await page.getByRole('button', { name: 'What can this make?' }).click();
await page.getByRole('heading', { name: 'Water!', exact: true }).waitFor();
assert.equal(await page.locator('.model svg').count(), 1);
await page.getByRole('tab', { name: /Discovery Book/ }).click();
await page.getByRole('button', { name: /Water.*Explore discovery/ }).waitFor();
await page.reload({ waitUntil: 'networkidle' });
await page.getByRole('tab', { name: /Discovery Book/ }).click();
await page.getByRole('button', { name: /Water.*Explore discovery/ }).waitFor();
await page.getByRole('tab', { name: 'Element Lab', exact: true }).click();
await page.getByText('Advanced Builder', { exact: true }).click();
await page.getByLabel('Or enter a formula').fill('C6H12O6');
await page.getByRole('button', { name: 'Load atoms' }).click();
await page.getByRole('button', { name: 'What can this make?' }).click();
assert.equal(await page.locator('.candidate').count(), 3);
assert.equal(await page.locator('.success').count(), 0);
await page.locator('.candidate').filter({ hasText: 'Glucose' }).click();
await page.getByRole('heading', { name: 'Glucose!', exact: true }).waitFor();
await page.getByLabel('Or enter a formula').fill('Na2Cl2');
await page.getByRole('button', { name: 'Load atoms' }).click();
await page.getByRole('button', { name: 'What can this make?' }).click();
await page.getByText('2 formula units match your atoms').waitFor();
await page.getByRole('button', { name: 'Watch an electron move' }).click();
assert.equal(await page.locator('.transferred').count(), 1);
await page.getByRole('tab', { name: 'Explore', exact: true }).click();
assert.equal(await page.locator('.element').count(), 118);
await page
  .getByRole('button', {
    name: 'Explore Sodium (Na), atomic number 11',
    exact: true,
  })
  .click();
await page.getByRole('heading', { name: 'Sodium', exact: true }).waitFor();
await page.locator('summary').filter({ hasText: 'Tell me more!' }).click();
await page
  .getByText('Electron shells: 2 — 8 — 1', { exact: true })
  .last()
  .waitFor();
await page.keyboard.press('Escape');
await page.locator('[data-slot=sheet-content]').waitFor({ state: 'detached' });
await page.getByRole('tab', { name: 'Challenges', exact: true }).click();
await page.getByRole('button', { name: 'Clear lab' }).click();
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
assert.match(await page.locator('.score').innerText(), /3 stars/);
await page.getByRole('button', { name: 'What can this make?' }).click();
assert.match(await page.locator('.score').innerText(), /3 stars/);
const webmcp = await page.evaluate(async () => {
  const t = window.__tools.stage_lab_atoms;
  const valid = await t.execute({ counts: { H: 2, O: 1 } });
  let rejected = false;
  try {
    await t.execute({ counts: { Xx: 1 } });
  } catch {
    rejected = true;
  }
  return {
    name: t.name,
    valid,
    rejected,
    schema: t.inputSchema,
    annotations: t.annotations,
  };
});
assert.equal(webmcp.valid.total, 3);
assert.ok(webmcp.rejected);
await page.getByRole('button', { name: 'What can this make?' }).click();
await page.getByRole('heading', { name: 'Water!', exact: true }).waitFor();
await page.getByRole('button', { name: 'Clear lab' }).click();
await page
  .getByRole('button', {
    name: 'Add Hydrogen (H), atomic number 1',
    exact: true,
  })
  .dragTo(page.locator('.atom-zone'));
assert.equal(
  await page.getByLabel('Hydrogen atom count', { exact: true }).inputValue(),
  '1',
);
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: 'qa-phone.png', fullPage: true });
assert.ok(
  await page.evaluate(
    () => document.documentElement.scrollWidth <= innerWidth + 1,
  ),
);
await page.getByRole('tab', { name: /Discovery Book/ }).click();
await page.screenshot({ path: 'qa-book-phone.png', fullPage: true });
assert.ok(
  await page.evaluate(
    () => document.documentElement.scrollWidth <= innerWidth + 1,
  ),
);
await page.getByRole('button', { name: /Water.*Explore discovery/ }).click();
await page.getByRole('heading', { name: 'Water', exact: true }).waitFor();
await page.screenshot({ path: 'qa-detail-phone.png', fullPage: true });
await page.keyboard.press('Escape');
await page.setViewportSize({ width: 768, height: 1024 });
await page.getByRole('tab', { name: 'Element Lab', exact: true }).click();
await page.screenshot({ path: 'qa-tablet.png', fullPage: true });
assert.ok(
  await page.evaluate(
    () => document.documentElement.scrollWidth <= innerWidth + 1,
  ),
);
assert.deepEqual(errors, []);
fs.writeFileSync(
  'data/qa-results.json',
  JSON.stringify(
    { passed: true, viewportWidths: [390, 768, 1600], webmcp, errors },
    null,
    2,
  ),
);
console.log(
  'PASS browser: discoveries, no-match, isomers, multiple units, saved progress, sheet keyboard close, challenges, no repeat stars, drag/drop, phone/tablet layouts, WebMCP valid and invalid inputs.',
);
await browser.close();
