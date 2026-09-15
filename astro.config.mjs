import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";
import { withBotId } from "botid/next/config";

// Astro dev does not apply vercel.json rewrites. Mirror the SDK's proxies locally.
const botIdConfig = withBotId({});
const botIdProxy = Object.fromEntries((await botIdConfig.rewrites()).map(rule => {
  const source = rule.source.replace('/:path*', '');
  const destination = new URL(rule.destination.replace('/:path*', ''));
  return [source, {
    target: destination.origin,
    changeOrigin: true,
    rewrite: path => path.replace(source, destination.pathname),
  }];
}));

export default defineConfig({
  site: "https://17thstreetlabs.com",
  output: "static",
  adapter: vercel(),
  trailingSlash: "always",
  integrations: [sitemap({ filter: (page) => {
    const pathname = new URL(page).pathname;
    return !pathname.startsWith("/contact") && !pathname.startsWith("/lab");
  } })],
  vite: {
    plugins: [tailwindcss()],
    server: { proxy: botIdProxy },
  },
});
