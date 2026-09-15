import { expect, test } from "@playwright/test";

test("navigation uses real routes and supports browser history and direct visits", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "What We Do", exact: true }).click();
  await expect(page).toHaveURL(/\/services\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Serious engineering.");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.getByRole("heading", { name: "Marina Levy" })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/services\/$/);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Serious engineering.");
  await page.goto("/?contact");
  await expect(page.getByRole("dialog", { name: "Tell us what you are building." })).toBeVisible();
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
  await nav.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("every home conversation CTA opens an accessible dialog and restores focus", async ({ page }) => {
  await page.goto("/");
  const triggers = page.locator("[data-contact-dialog]:visible");
  expect(await triggers.count()).toBe(2);
  const dialog = page.getByRole("dialog", { name: "Tell us what you are building." });
  for (let index = 0; index < await triggers.count(); index++) {
    const trigger = triggers.nth(index);
    await trigger.click();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("textbox", { name: "Name", exact: true })).toBeVisible();
    await expect(dialog.getByLabel("What are you working on?")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  }
  await triggers.first().click();
  await dialog.getByRole("button", { name: "Close conversation form" }).click();
  await expect(dialog).toBeHidden();
  await expect(triggers.first()).toBeFocused();
});

test("services expose five offerings and a conversation dialog", async ({ page }) => {
  await page.goto("/services/");
  await expect(page.locator(".edition-grid article")).toHaveCount(5);
  await expect(page.getByRole("heading", { name: "How we work" })).toBeVisible();
  await page.locator(".edition-contact a").click();
  await expect(page.getByRole("dialog", { name: "Tell us what you are building." })).toBeVisible();
});

test("contact form validates required fields and email without opening an email app", async ({ page }) => {
  await page.route('**/a-4-a/c.js?*', route => route.fulfill({
    contentType: 'application/javascript',
    body: 'window.V_C.push({ b: 1, v: "test", e: "test", d: 0 });',
  }));
  await page.route("**/api/contact/", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }),
  );
  await page.goto("/?contact");
  const form = page.locator(".contact-dialog form");
  const name = form.getByRole("textbox", { name: "Name", exact: true });
  const email = form.getByRole("textbox", { name: "Work email" });
  const context = form.getByRole("textbox", { name: "What are you working on?" });
  const submit = form.getByRole("button", { name: "Send message" });
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
  await expect(page).toHaveURL(/\/$/);
});

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test(`all routes fit a ${viewport.width}px viewport`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of ["/", "/services/", "/about/", "/proof/", "/lab/"]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
      const filename = `${route.replaceAll("/", "") || "home"}-${viewport.width}.png`;
      await page.screenshot({ path: testInfo.outputPath(filename), fullPage: true });
    }
    expect(errors).toEqual([]);
  });
}

test("mobile navigation works and conversation links retain their fallback without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(nav).toBeVisible();
    await nav.getByRole("link", { name: "What We Do", exact: true }).click();
    await expect(page).toHaveURL(/\/services\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Serious engineering.");
    await nav.getByRole("link", { name: "Home", exact: true }).click();
    await expect(page.getByRole("link", { name: "Start a conversation" }).first()).toHaveAttribute("href", "/contact/");
  } finally {
    await context.close();
  }
});

test("missing routes return a branded 404 and a usable home link", async ({ page, baseURL }) => {
  const response = await page.goto("/this-page-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/This page is\s*off the map\./);
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL(new URL("/", baseURL).href);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Send us the hard one");
});
