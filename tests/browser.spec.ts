import { expect, test } from "@playwright/test";

test("navigation uses real routes and supports browser history and direct visits", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "What We Do", exact: true }).click();
  await expect(page).toHaveURL(/\/services\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("engineering around the intelligence");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.getByRole("heading", { name: "Marina Levy" })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/services\/$/);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("engineering around the intelligence");
  await page.goto("/contact/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Got an AI problem");
  await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Contact", exact: true })).toHaveAttribute("aria-current", "page");
});

test("mobile navigation toggles, dismisses with Escape, and reaches a page", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Toggle navigation" });
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(nav).toBeHidden();
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(nav).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(nav).toBeHidden();
  await expect(menu).toBeFocused();
  await menu.click();
  await nav.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("every home conversation CTA opens an accessible dialog and restores focus", async ({ page }) => {
  await page.goto("/");
  const triggers = page.locator("[data-contact-dialog]");
  expect(await triggers.count()).toBe(4);
  const dialog = page.getByRole("dialog", { name: "Tell us what you are building." });
  for (let index = 0; index < await triggers.count(); index++) {
    const trigger = triggers.nth(index);
    await trigger.click();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("textbox", { name: "Name", exact: true })).toBeVisible();
    await expect(dialog.getByRole("combobox", { name: "Focus" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  }
  await triggers.first().click();
  await dialog.getByRole("button", { name: "Close conversation form" }).click();
  await expect(dialog).toBeHidden();
  await expect(triggers.first()).toBeFocused();
});

test("services accordion exposes one step at a time and supports keyboard activation", async ({ page }) => {
  await page.goto("/services/");
  const steps = page.locator("details[name=engagement]");
  await expect(steps.nth(0)).toHaveAttribute("open", "");
  await expect(steps.nth(1).locator("[data-slot=accordion-content]")).toBeHidden();
  await steps.nth(1).locator("summary").click();
  await expect(steps.nth(1).locator("[data-slot=accordion-content]")).toBeVisible();
  await expect(steps.nth(0).locator("[data-slot=accordion-content]")).toBeHidden();
  await steps.nth(2).locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(steps.nth(2).locator("[data-slot=accordion-content]")).toBeVisible();
  await expect(steps.nth(1).locator("[data-slot=accordion-content]")).toBeHidden();
});

test("contact form validates required fields and email without opening an email app", async ({ page }) => {
  await page.route("**/api/contact/", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }),
  );
  await page.goto("/contact/");
  const form = page.locator("main form");
  const name = form.getByRole("textbox", { name: "Name", exact: true });
  const email = form.getByRole("textbox", { name: "Work email" });
  const context = form.getByRole("textbox", { name: "What are you building?" });
  const submit = form.getByRole("button", { name: "Send project brief" });
  await submit.click();
  await expect(name).toBeFocused();
  await name.fill("Test Person");
  await email.fill("invalid-email");
  await context.fill("Evaluate our agent's permission boundaries.");
  await submit.click();
  await expect(email).toBeFocused();
  expect(await email.evaluate((input: HTMLInputElement) => input.validity.typeMismatch)).toBe(true);
  await email.fill("test@example.com");
  expect(await form.evaluate((element: HTMLFormElement) => element.checkValidity())).toBe(true);
  await submit.click();
  await expect(form).toContainText("Received. We will reply within a business day.");
  await expect(page).toHaveURL(/\/contact\/$/);
});

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test(`all routes fit a ${viewport.width}px viewport`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of ["/", "/services/", "/about/", "/contact/"]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
      const filename = `${route.replaceAll("/", "") || "home"}-${viewport.width}.png`;
      await page.screenshot({ path: testInfo.outputPath(filename), fullPage: true });
    }
    expect(errors).toEqual([]);
  });
}

test("mobile navigation and conversation links work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    await page.goto("http://127.0.0.1:4322/");
    const nav = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(nav).toBeVisible();
    await nav.getByRole("link", { name: "What We Do", exact: true }).click();
    await expect(page).toHaveURL(/\/services\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("engineering around the intelligence");
    await nav.getByRole("link", { name: "Home", exact: true }).click();
    await page.getByRole("link", { name: "Start a conversation" }).first().click();
    await expect(page).toHaveURL(/\/contact\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Got an AI problem");
    await expect(page.getByRole("main").locator("form[data-project-brief]")).toHaveAttribute("action", "/api/contact/");
  } finally {
    await context.close();
  }
});

test("missing routes return a branded 404 and a usable home link", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/This page is\s*off the map\./);
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL("http://127.0.0.1:4322/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Send us the hard one");
});

 test('motion introduces section headings once and preserves keyboard targets', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const heading = page.locator('#thinking .band-head');
  await heading.scrollIntoViewIfNeeded();
  await expect.poll(() => heading.evaluate(el => el.getAnimations().length)).toBeGreaterThan(0);
  await expect.poll(() => heading.evaluate(el => el.getAnimations().length)).toBe(0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await heading.scrollIntoViewIfNeeded();
  expect(await heading.evaluate(el => el.getAnimations().length)).toBe(0);
  const cta = page.locator('.closing [data-contact-dialog]');
  await cta.focus();
  await expect(cta).toBeFocused();
  expect(await cta.locator('..').evaluate(el => el.getAnimations().length)).toBe(0);
  await page.keyboard.press('Enter');
  await expect(page.locator('.contact-dialog')).toBeVisible();
 });

 test('motion respects reduced motion including a preference change', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.locator('#thinking').scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => page.evaluate(() => document.getAnimations().length)).toBe(0);
  await page.locator('.footer-reading').scrollIntoViewIfNeeded();
  expect(await page.locator('.footer-reading').evaluate(el => getComputedStyle(el).opacity)).toBe('1');
  await page.getByRole('button', { name: 'Send me the good stuff' }).click();
  await expect(page.locator('.lab-dialog')).toBeVisible();
  expect(await page.locator('.lab-dialog').evaluate(el => el.getAnimations().length)).toBe(0);
 });

 test('motion leaves content visible without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/');
  for (const selector of ['.production-beat', '#thinking .band-head', '.closing', '.footer-reading']) {
    expect(await page.locator(selector).first().evaluate(el => getComputedStyle(el).opacity)).toBe('1');
  }
  await context.close();
 });

 for (const width of [1440, 390]) {
  test(`motion keeps page layouts stable at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const route of ['/', '/services/', '/proof/', '/about/', '/lab/', '/lab/small-local-models/']) {
      await page.goto(route);
      await page.locator('.footer-reading').scrollIntoViewIfNeeded();
      await expect.poll(() => page.locator('.footer-reading').evaluate(el => el.getAnimations().length)).toBe(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    await page.goto('/');
    await page.locator('#thinking').scrollIntoViewIfNeeded();
    await expect.poll(() => page.locator('#thinking .band-head').evaluate(el => el.getAnimations().length)).toBe(0);
    await page.screenshot({ path: testInfo.outputPath(`motion-${width}.png`) });
    expect(errors).toEqual([]);
  });
 }
