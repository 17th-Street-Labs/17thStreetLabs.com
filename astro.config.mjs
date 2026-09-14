import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

export default defineConfig({
  site: "https://17thstreetlabs.com",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});