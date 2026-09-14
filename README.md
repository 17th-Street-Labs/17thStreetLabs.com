# 17th Street Labs

The 17th Street Labs consultancy website, built with Astro 7 and native CSS.
Astro generates static HTML for the home, services, about, and contact pages,
with browser scripts for interactive controls.

## Local development

Requires Node.js 22.13 or newer and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Astro. Pages live in `src/pages/`, shared
layouts in `src/layouts/`, components in `src/components/`, and styling in
`src/styles/`. The routes are `/`, `/services/`, `/about/`, and `/contact/`.

Contact forms open an email draft in the visitor's mail application. The site
does not receive or store submissions, and it needs no email-service secrets.

```sh
npm run check
npm run lint
npm test
npm run build
npm run preview
```

`check` validates Astro and TypeScript sources. `test` checks the generated
site. `build` writes the deployable static site to `dist/`; `preview` serves
that build locally.

For browser validation, install Chromium on the first run, then test a fresh
production build:

```sh
npx playwright install chromium
npm run build
npm run test:browser
```

## Deploy to Vercel

Import this Git repository into Vercel and use the repository root as the
project root. The checked-in `vercel.json` selects these settings:

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |

Choose a Node.js version compatible with `package.json`. Connect the production
domain in the Vercel project after reviewing its preview deployment.

This static site requires no Vercel runtime adapter, Cloudflare Worker, or
server-side environment variables. See the official
[Astro deployment guide](https://docs.astro.build/en/guides/deploy/vercel/) and
[Vercel Astro documentation](https://vercel.com/docs/frameworks/frontend/astro).
Committing this configuration does not deploy the site or change DNS.

## Source provenance

The website was imported with its original Git history from
[Sites](https://seventeenth-street-labs-concepts.justsml.chatgpt.site). The original
source remote is named `sites`, and `.openai/hosting.json` retains the original
hosting association as historical metadata. The Astro build does not use the
Sites runtime or hosting association.

The Astro migration replaces Next.js/Vinext and removes the unused starter
component catalog, Cloudflare runtime, and database scaffolding. Their original
source remains available in Git history.

Dependencies, build output, local runtime state, and `.env` files are ignored.
No source-repository credentials are stored in Git.
