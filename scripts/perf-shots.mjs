// Screenshot the site at desktop and mobile widths, so visual regressions
// from perf work are caught by comparison rather than by hoping.
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const BASE = process.env.PERF_BASE ?? "http://127.0.0.1:4322";
const OUT = process.env.SHOT_DIR ?? "shots";
const PAGES = (process.env.PERF_PAGES ?? "/,/about/,/services/,/contact/").split(",");

const browser = await chromium.launch();
await mkdir(OUT, { recursive: true });

for (const [label, viewport] of [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }],
]) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: "load" });
    // Let fonts settle and the hero shader reach a steady state.
    await page.waitForTimeout(2500);
    const name = path.replace(/\//g, "_") || "_root_";
    await page.screenshot({ path: `${OUT}/${label}${name}.png`, fullPage: true });
  }
  await context.close();
}

await browser.close();
console.log(`shots written to ${OUT}/`);
