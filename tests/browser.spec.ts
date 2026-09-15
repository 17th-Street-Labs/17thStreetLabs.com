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
      const closing = page.locator('.blog-subscribe, .footer-reading').filter({ visible: true }).first();
      await closing.scrollIntoViewIfNeeded();
      await expect.poll(() => closing.evaluate(el => el.getAnimations().length)).toBe(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    await page.goto('/');
    await page.locator('#thinking').scrollIntoViewIfNeeded();
    await expect.poll(() => page.locator('#thinking .band-head').evaluate(el => el.getAnimations().length)).toBe(0);
    await page.screenshot({ path: testInfo.outputPath(`motion-${width}.png`) });
    expect(errors).toEqual([]);
  });
 }

for (const width of [320, 390, 768, 900, 1440]) {
  test(`editorial Blog preserves reading and signup at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/lab/');
    await expect(page.getByRole('heading', { name: 'Blog', exact: true })).toBeVisible();
    await expect(page.locator('.article-grid article')).toHaveCount(9);
    await expect(page.locator('.category-filters button')).toHaveCount(0);
    await expect(page.locator('.collection-heading').first()).toContainText('Featured category Security & Privacy');
    expect(await page.locator('.blog-card').evaluateAll(cards => cards.slice(0, 3).map(card => card.getAttribute('data-category')))).toEqual(['Security & Privacy', 'Security & Privacy', 'Security & Privacy']);
    await expect(page.locator('.blog-category', { hasText: 'Costs and Optimization' })).toHaveCount(2);
    await expect(page.locator('.blog-category', { hasText: 'Testing & Evaluation' })).toHaveCount(2);

    for (const headline of await page.locator('.blog-card h2').all()) {
      const size = await headline.evaluate(el => ({ height: el.getBoundingClientRect().height, line: parseFloat(getComputedStyle(el).lineHeight) }));
      expect(size.height).toBeLessThanOrEqual(size.line * 2 + 1);
    }
    await expect(page.getByRole('heading', { name: 'What Is Your Agent Actually Doing?', exact: true })).toBeVisible();
    await page.getByRole('searchbox', { name: 'Search articles' }).fill('GPU');
    await expect(page.locator('.blog-card:visible')).toHaveCount(1);
    await page.getByRole('searchbox', { name: 'Search articles' }).fill('nothing-matches-this-query');
    await expect(page.getByRole('status')).toHaveText('0 articles found.');
    await page.getByRole('searchbox', { name: 'Search articles' }).fill('');
    await expect(page.locator('.blog-card:visible')).toHaveCount(9);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.getByRole('button', { name: 'Subscribe', exact: true }).click();
    await expect(page.locator('.lab-dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Subscribe', exact: true })).toBeFocused();
    await page.getByRole('heading', { name: 'Small Models. Serious Work.', exact: true }).getByRole('link').click();
    await expect(page).toHaveURL(/\/lab\/small-local-models\/$/);
    await page.getByRole('link', { name: '← Blog', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Blog', exact: true })).toBeVisible();
  });
}


test('newsletter handles invalid responses and permits retry without losing the email', async ({ page }) => {
  // Exercise the real BotID interceptor without requiring Vercel's challenge server locally.
  await page.route('**/a-4-a/c.js?*', route => route.fulfill({
    contentType: 'application/javascript',
    body: 'window.V_C.push({ b: 1, v: "test", e: "test", d: 0 });',
  }));
  let attempts = 0;
  await page.route('**/api/lab-access/', async route => {
    if (route.request().method() === 'GET') return route.fulfill({ json: { unlocked: false } });
    expect(route.request().headers()['x-is-human']).toBeTruthy();
    expect(route.request().headers()['x-path']).toBe('/api/lab-access/');
    attempts++;
    if (attempts === 1) return route.fulfill({ status: 501, contentType: 'text/html', body: '<html>Unsupported method</html>' });
    if (attempts === 2) return route.abort('failed');
    return route.fulfill({ json: { saved: true, unlocked: false } });
  });
  await page.goto('/lab/');
  await page.getByRole('button', { name: 'Subscribe', exact: true }).click();
  await page.getByLabel('Email address').fill('reader@example.com');
  const submit = page.getByRole('button', { name: 'Send me the good stuff' });
  await submit.click();
  await expect(page.locator('.lab-signup-status')).toHaveText('We couldn’t save your signup right now. Please try again in a moment.');
  await expect(page.getByLabel('Email address')).toHaveValue('reader@example.com');
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(page.locator('.lab-signup-status')).toContainText('Please check your connection');
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(page.getByRole('heading', { name: 'You’re on the list.' })).toBeVisible();
  expect(attempts).toBe(3);
});

for (const width of [390, 1280]) {
  test(`article prompts rotate at the prose midpoint and dismiss at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 850 });
    const paths = ['small-local-models', 'local-ai-data-privacy', 'agents-that-see-the-ui'];
    for (const [index, slug] of paths.entries()) {
      await page.goto(`/lab/${slug}/`);
      const prompt = page.locator('[data-reading-prompt]');
      await expect(page.locator('[data-reading-midpoint]')).toHaveCount(1);
      await expect(prompt).toBeHidden();
      await expect(page.locator('.lab-dialog')).not.toBeVisible();
      await page.locator('[data-reading-midpoint]').scrollIntoViewIfNeeded();
      await expect(prompt).toBeVisible();
      await expect(prompt).toHaveAttribute('data-variant', ['side', 'inline', 'slide'][index]);
      const geometry = await prompt.evaluate(el => {
        const r = el.getBoundingClientRect();
        return { left: r.left, right: r.right, viewport: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth };
      });
      expect(geometry.left).toBeGreaterThanOrEqual(0);
      expect(geometry.right).toBeLessThanOrEqual(geometry.viewport);
      expect(geometry.overflow).toBe(false);
      await prompt.scrollIntoViewIfNeeded();
      await page.screenshot({ path: testInfo.outputPath(`prompt-${index}.png`) });
      await prompt.getByRole('button', { name: 'Keep reading' }).click();
      await expect(prompt).toBeHidden();
      await page.locator('[data-reading-midpoint]').scrollIntoViewIfNeeded();
      await expect(prompt).toBeHidden();
    }
  });
}

test('article prompt retries failed delivery and remembers only confirmed newsletter signup', async ({ page }) => {
  await page.route('**/a-4-a/c.js?*', route => route.fulfill({ contentType: 'application/javascript', body: 'window.V_C.push({ b: 1, v: "test", e: "test", d: 0 });' }));
  let attempts = 0;
  await page.route('**/api/lab-access/', route => {
    if (route.request().method() === 'GET') return route.fulfill({ json: { unlocked: true } });
    const data = route.request().postDataJSON();
    expect(data.purpose).toBe('newsletter');
    expect(data.page).toBe('/lab/small-local-models/');
    expect(data.email).toBe('reader@example.com');
    attempts++;
    return attempts === 1
      ? route.fulfill({ status: 503, contentType: 'text/html', body: 'Unavailable' })
      : route.fulfill({ json: { saved: true, unlocked: true } });
  });
  await page.goto('/lab/small-local-models/');
  await page.locator('[data-reading-midpoint]').scrollIntoViewIfNeeded();
  const prompt = page.locator('[data-reading-prompt]');
  await prompt.getByLabel('Email for new articles').fill('reader@example.com');
  await prompt.getByRole('button', { name: 'Send me more reads' }).click();
  await expect(prompt.getByRole('status')).toContainText('Please try again');
  await expect(prompt.getByLabel('Email for new articles')).toHaveValue('reader@example.com');
  expect(await page.evaluate(() => localStorage.getItem('lab-newsletter-subscribed'))).toBeNull();
  await prompt.getByRole('button', { name: 'Send me more reads' }).click();
  await expect(prompt.getByRole('status')).toContainText('You’re on the list');
  await page.goto('/lab/local-ai-data-privacy/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator('[data-reading-prompt]')).toBeHidden();
  expect(attempts).toBe(2);
});

test('every published article supports a midpoint prompt with blocked storage', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('Storage blocked'); };
    Storage.prototype.setItem = () => { throw new Error('Storage blocked'); };
  });
  const slugs = ['small-local-models', 'cost-per-completed-task', 'renting-vs-buying-gpus', 'one-harness-does-not-fit-every-model', 'continuous-security-testing', 'eval-driven-agent-development', 'agents-that-see-the-ui', 'local-ai-data-privacy', 'security-copilot-that-explains'];
  for (const slug of slugs) {
    await page.goto(`/lab/${slug}/`);
    await page.locator('[data-reading-midpoint]').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-reading-prompt]')).toBeVisible();
    expect(await page.locator('[data-reading-prompt]').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('[data-reading-prompt] input[type=email]').focus();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-reading-prompt]')).toBeHidden();
    await expect(page.locator('[data-lab-article]')).toBeFocused();
  }
});

test('contact verification recovery keeps the draft through reload and retries safely', async ({ page }) => {
  await page.route('**/a-4-a/c.js?*', route => route.fulfill({ contentType: 'application/javascript', body: 'window.V_C.push({ b: 1, v: "test", e: "test", d: 0 });' }));
  let attempts = 0;
  await page.route('**/api/contact/', route => {
    attempts++;
    expect(route.request().headers()['x-is-human']).toBeTruthy();
    return route.fulfill(attempts === 1 ? { status: 403, json: { ok: false, error: 'Verification failed' } } : { json: { ok: true } });
  });
  await page.goto('/?contact');
  const form = page.locator('[data-project-brief]');
  await form.getByLabel('Name', { exact: true }).fill('Browser Test');
  await form.getByLabel('Work email').fill('test@example.com');
  await form.getByLabel('What are you working on?').fill('Keep this draft intact.');
  await form.getByRole('button', { name: 'Send message' }).click();
  await expect(form.getByRole('status')).toContainText('Browser verification failed');
  await form.getByRole('button', { name: 'Reload and keep my message' }).click();
  await expect(form.getByRole('status')).toContainText('Your message is still here');
  await expect(form.getByLabel('Name', { exact: true })).toHaveValue('Browser Test');
  await expect(form.getByLabel('Work email')).toHaveValue('test@example.com');
  await expect(form.getByLabel('What are you working on?')).toHaveValue('Keep this draft intact.');
  expect(await page.evaluate(() => sessionStorage.getItem('contact-verification-recovery'))).toBeNull();
  expect(attempts).toBe(1);
  await form.getByRole('button', { name: 'Send message' }).click();
  await expect(form.getByRole('status')).toContainText('Received.');
  expect(attempts).toBe(2);
});
