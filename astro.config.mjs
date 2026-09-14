import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://17thstreetlabs.com",
  output: "static",
  adapter: vercel(),
  trailingSlash: "always",
  integrations: [sitemap({ filter: (page) => !new URL(page).pathname.startsWith("/contact") })],
  vite: {
    plugins: [tailwindcss()],
  },
});