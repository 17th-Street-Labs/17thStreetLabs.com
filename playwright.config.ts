import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "smoke.spec.ts",
  fullyParallel: true,
  // Multiple concurrent headless-Chromium contexts rendering the WebGL hero
  // crash the renderer process in this environment; keep tests serialized.
  workers: 1,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4322",
    browserName: "chromium",
    reducedMotion: "reduce",
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: "node scripts/preview-static.mjs --host 127.0.0.1 --port 4322",
    url: "http://127.0.0.1:4322",
    reuseExistingServer: false,
  },
});
