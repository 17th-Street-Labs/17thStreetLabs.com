import { expect, test, type Page } from "@playwright/test";
import { labEntries } from "../src/data/lab.ts";

// Smoke coverage only: every page loads and its primary interactions work.
// Copy, layout metrics, and animation details deliberately go unasserted — they
// change often and a failure there tells us nothing about whether the site works.

const pages = ["/", "/services/", "/proof/", "/about/", "/blog/"];
const article = `${labEntries[0].url}`;
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];

// The BotID SDK's fetch interceptor needs a challenge response; Vercel's
// challenge server is not available locally.
async function stubBotChallenge(page: Page) {
  await page.route("**/a-4-a/c.js?*", route => route.fulfill({
    contentType: "application/javascript",
    body: 'window.V_C.push({ b: 1, v: "test", e: "test", d: 0 });',
  }));
}

for (const viewport of viewports) {
  test(`every page renders without errors on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));

    for (const route of [...pages, article, "/404.html"]) {
      const response = await page.goto(route);
      expect(response?.ok(), `${route} responds`).toBe(true);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page).toHaveTitle(/17th Street Labs/);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        `${route} has no horizontal overflow`,
      ).toBe(true);
    }

    expect(errors).toEqual([]);
  });
}

test("primary navigation reaches each page", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  for (const route of ["/services/", "/about/", "/proof/", "/blog/"]) {
    await page.goto("/");
    await nav.locator(`a[href="${route}"]`).first().click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("mobile navigation opens and closes", async ({ page }) => {
  await page.setViewportSize(viewports[1]);
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Toggle navigation" });
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(nav).toBeHidden();
  await menu.click();
  await expect(nav).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(nav).toBeHidden();
});

test("an unknown route serves the 404 page", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("the contact dialog submits a brief", async ({ page }) => {
  await stubBotChallenge(page);
  let submitted: Record<string, string> | null = null;
  await page.route("**/api/contact/", route => {
    submitted = route.request().postDataJSON();
    return route.fulfill({ json: { ok: true } });
  });

  await page.goto("/");
  await page.locator("[data-contact-dialog]:visible").first().click();
  const form = page.locator("[data-project-brief]");
  await expect(form).toBeVisible();
  await form.getByLabel("Name", { exact: true }).fill("Smoke Test");
  await form.getByLabel("Work email").fill("smoke@example.com");
  await form.getByLabel("What are you working on?").fill("Checking the form still posts.");
  await form.getByRole("button", { name: "Send message" }).click();

  await expect(form.getByRole("status")).toContainText("Received");
  expect(submitted).toMatchObject({ email: "smoke@example.com" });
});

test("the newsletter dialog submits a signup", async ({ page }) => {
  await stubBotChallenge(page);
  let submitted: Record<string, string> | null = null;
  await page.route("**/api/lab-access/", route => {
    if (route.request().method() === "GET") return route.fulfill({ json: { unlocked: false } });
    submitted = route.request().postDataJSON();
    return route.fulfill({ json: { saved: true, unlocked: false } });
  });

  await page.goto("/blog/");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  const dialog = page.locator(".lab-dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Email address").fill("reader@example.com");
  await dialog.getByRole("button", { name: "Send me the good stuff" }).click();

  await expect(dialog).toContainText("You’re on the list");
  expect(submitted).toMatchObject({ email: "reader@example.com" });
});

test("the blog lists every published article and links into it", async ({ page }) => {
  await page.goto("/blog/");
  await expect(page.locator(".blog-card")).toHaveCount(labEntries.length);
  for (const entry of labEntries) {
    await expect(page.locator(`a[href="${entry.url}"]`).first()).toHaveCount(1);
  }
  await page.locator(".blog-card").first().click();
  await expect(page).toHaveURL(/\/blog\/[^/]+\/$/);
  await expect(page.locator("[data-lab-article]")).toBeVisible();
});

test("blog search filters articles", async ({ page }) => {
  await page.goto("/blog/");
  const search = page.getByRole("searchbox", { name: "Search articles" });
  await search.fill("nothing-matches-this-query");
  await expect(page.locator(".blog-card:visible")).toHaveCount(0);
  await search.fill("");
  await expect(page.locator(".blog-card:visible")).toHaveCount(labEntries.length);
});

test("draft articles are not published", async ({ page }) => {
  const response = await page.goto("/blog/lessons-from-ai-security-agents/");
  expect(response?.status()).toBe(404);
});

test("content is visible without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    for (const route of [...pages, article]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Start a conversation" }).first()).toHaveAttribute("href", "/contact/");
  } finally {
    await context.close();
  }
});
