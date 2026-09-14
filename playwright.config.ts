import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "browser.spec.ts",
  fullyParallel: true,
  use: {
    baseURL: "http://127.0.0.1:4322",
    browserName: "chromium",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4322 --ignore-lock",
    // Keep the preview process attached so Playwright owns its lifecycle,
    // including when Astro detects that tests were started by an agent.
    env: { ASTRO_PREVIEW_BACKGROUND: "1" },
    url: "http://127.0.0.1:4322",
    reuseExistingServer: false,
  },
});
