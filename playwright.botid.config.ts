import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: 'botid.browser.spec.ts',
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:4368', browserName: 'chromium' },
  webServer: {
    command: 'node scripts/botid-test-server.mjs',
    url: 'http://127.0.0.1:4368',
    reuseExistingServer: false,
  },
});
