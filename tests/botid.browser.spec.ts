import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Mock the provider challenge, while exercising the real SDK fetch interceptor.
  await page.route('**/a-4-a/c.js?*', route => route.fulfill({
    contentType: 'application/javascript',
    body: 'window.V_C.push({ b: 1, v: "test", e: "test", d: 0 });',
  }));
});

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test(`BotID protects contact requests and preserves retry at ${viewport.width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    const submissions: { headers: Record<string, string>; data: Record<string, string> }[] = [];
    await page.route('**/api/contact/', async route => {
      submissions.push({ headers: route.request().headers(), data: route.request().postDataJSON() });
      await route.fulfill({ status: 403, json: { ok: false, error: 'We couldn’t verify this request. Please reload the page and try again.' } });
    });
    await page.goto('/?contact');
    const dialog = page.locator('.contact-dialog');
    await expect(dialog).toBeVisible();
    await expect(page.locator('altcha-widget')).toHaveCount(0);
    await dialog.getByLabel('Name', { exact: true }).fill('Browser Test');
    await dialog.getByLabel('Work email').fill('browser@example.com');
    await dialog.getByLabel('What are you working on?').fill('Delivery is intercepted.');
    await dialog.getByRole('button', { name: 'Send message' }).click();
    await expect(dialog.locator('[data-form-status]')).toContainText('Browser verification failed');
    expect(submissions).toHaveLength(1);
    expect(submissions[0].headers['x-is-human']).toBeTruthy();
    expect(submissions[0].headers['x-path']).toBe('/api/contact/');
    expect(submissions[0].data.altcha).toBeUndefined();
    await expect(dialog.getByLabel('Name', { exact: true })).toHaveValue('Browser Test');
    await expect(dialog.getByRole('button', { name: 'Send message' })).toBeEnabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
    await page.screenshot({ path: testInfo.outputPath(`botid-${viewport.width}.png`), fullPage: true });
  });
}

test('BotID protects newsletter signup without a visible challenge', async ({ page }) => {
  let headers: Record<string, string> = {};
  await page.route('**/api/lab-access/', async route => {
    if (route.request().method() === 'GET') return route.fulfill({ json: { unlocked: false } });
    headers = route.request().headers();
    expect(route.request().postDataJSON().purpose).toBe('newsletter');
    await route.fulfill({ json: { saved: true, unlocked: false } });
  });
  await page.goto('/lab/');
  await page.locator('[data-newsletter-signup]').first().click();
  const dialog = page.locator('.lab-dialog');
  await dialog.getByLabel('Email address').fill('browser@example.com');
  await dialog.getByRole('button', { name: 'Send me the good stuff' }).click();
  await expect(dialog.getByRole('heading')).toHaveText('You’re on the list.');
  expect(headers['x-is-human']).toBeTruthy();
  expect(headers['x-path']).toBe('/api/lab-access/');
});

test('reader registration retains BotID protection', async ({ page }) => {
  let protectedRequest = false;
  await page.route('**/api/lab-access/', async route => {
    if (route.request().method() === 'GET') return route.fulfill({ json: { unlocked: false } });
    protectedRequest = Boolean(route.request().headers()['x-is-human']);
    expect(route.request().postDataJSON().purpose).toBe('article-access');
    await route.fulfill({ json: { saved: true, unlocked: true } });
  });
  await page.addInitScript(() => localStorage.setItem('lab-reading-history', JSON.stringify(['one', 'two', 'three'])));
  await page.goto('/lab/cost-per-completed-task/');
  const dialog = page.locator('.lab-dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByLabel('Email address').fill('browser@example.com');
  await dialog.getByRole('button', { name: 'Keep reading', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  expect(protectedRequest).toBe(true);
});
