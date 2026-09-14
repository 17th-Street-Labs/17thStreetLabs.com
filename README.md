# 17th Street Labs

The 17th Street Labs consultancy website, imported with its original Git history
from [Sites](https://seventeenth-street-labs-concepts.justsml.chatgpt.site).

## Local development

Requires Node.js 22.13 or newer and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Edit `app/page.tsx` for content and
interactions, `app/globals.css` for styling, and `app/layout.tsx` for metadata.
The contact forms open an email draft in the visitor's mail application.

```sh
npm run build
npm test
```

The project uses React, Vinext, Vite, and Tailwind. Production builds emit a
Cloudflare Worker and client assets in `dist/`; this is not a GitHub Pages
static export. The original Linux-specific helper scripts remain in `scripts/`
for reference; the npm commands use the tools directly to support macOS too.

## GitHub

The original source remote is named `sites`. Add your GitHub repository as
`origin`, then push the branch:

```sh
git remote add origin https://github.com/OWNER/REPOSITORY.git
git push -u origin main
```

The Sites project association is retained in `.openai/hosting.json`. This import
does not redeploy the site. Dependencies, build output, local runtime state, and
`.env` files are ignored. No source-repository credentials are stored in Git.

## Import validation

The locked dependency install and production build passed on macOS with Node
24.14.1. The inherited test suite has three passing tests and two failing starter
assertions: a removed `codex-preview` metadata tag and unused scrollbar utility
CSS. These assertions have been preserved for follow-up; `npm test` currently
exits with a failure.
