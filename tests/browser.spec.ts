import { expect, test } from "@playwright/test";

test("navigation uses real routes and supports browser history and direct visits", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "services", exact: true }).click();
  await expect(page).toHaveURL(/\/services\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Senior leverage");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "about", exact: true }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.getByRole("heading", { name: "Marina Levy" })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/services\/$/);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Senior leverage");
  await page.goto("/contact/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("hard problem");
  await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "contact", exact: true })).toHaveAttribute("aria-current", "page");
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
  await nav.getByRole("link", { name: "contact", exact: true }).click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("every home conversation CTA opens an accessible dialog and restores focus", async ({ page }) => {
  await page.goto("/");
  const triggers = page.locator("[data-contact-dialog]");
  expect(await triggers.count()).toBe(3);
  const dialog = page.getByRole("dialog", { name: "What hard problem are you carrying?" });
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
  await page.goto("/contact/");
  const form = page.locator("main form");
  const name = form.getByRole("textbox", { name: "Name", exact: true });
  const email = form.getByRole("textbox", { name: "Work email" });
  const context = form.getByRole("textbox", { name: "What is at stake?" });
  await form.getByRole("button", { name: "Open project brief" }).click();
  await expect(name).toBeFocused();
  await name.fill("Test Person");
  await email.fill("invalid-email");
  await context.fill("Evaluate our agent's permission boundaries.");
  await form.getByRole("button", { name: "Open project brief" }).click();
  await expect(email).toBeFocused();
  expect(await email.evaluate((input: HTMLInputElement) => input.validity.typeMismatch)).toBe(true);
  await email.fill("test@example.com");
  expect(await form.evaluate((element: HTMLFormElement) => element.checkValidity())).toBe(true);
  await expect(form).toContainText("Opens your email app with a draft for you to send.");
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
    await nav.getByRole("link", { name: "services", exact: true }).click();
    await expect(page).toHaveURL(/\/services\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Senior leverage");
    await nav.getByRole("link", { name: "home", exact: true }).click();
    await page.getByRole("link", { name: "Bring us the hard problem" }).click();
    await expect(page).toHaveURL(/\/contact\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("hard problem");
    await expect(page.getByRole("link", { name: "dan@danlevy.net", exact: true })).toBeVisible();
  } finally {
    await context.close();
  }
});

test("missing routes return a branded 404 and a usable home link", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/This page is\s*off the map\./);
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "home", exact: true }).click();
  await expect(page).toHaveURL("http://127.0.0.1:4322/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Engineering intelligence");
});
