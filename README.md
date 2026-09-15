# 17th Street Labs

[![Build, lint & tests](https://github.com/17th-Street-Labs/17thStreetLabs.com/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/17th-Street-Labs/17thStreetLabs.com/actions/workflows/ci.yml?query=branch%3Amain)
[![Vercel deployments](https://img.shields.io/badge/Deployments-Vercel-black?logo=vercel)](https://vercel.com/dan-levys-projects/17th-street-labs-com/deployments)

The 17th Street Labs consultancy website, built with Astro 7 and native CSS.
Astro generates static HTML for the home, services, about, and contact pages,
with browser scripts for interactive controls.

## Local development

Requires Node.js 24.x and npm. Run `nvm use` if you use nvm; `.nvmrc` selects
the same Node major version as CI and `package.json`.

```sh
npm ci
npm run dev
```

Open the local URL printed by Astro. Pages live in `src/pages/`, shared
layouts in `src/layouts/`, components in `src/components/`, and styling in
`src/styles/`. The routes are `/`, `/services/`, `/about/`, and `/contact/`.

Contact forms POST to `/api/contact/`, which forwards the brief to a Telegram
bot. No email address is published anywhere on the site.

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

Select Node.js 24.x in Vercel. Connect the production domain in the Vercel project
after reviewing its preview deployment. Trailing-slash redirects match Astro's
generated route URLs. Responses include `X-Content-Type-Options: nosniff` and
`Referrer-Policy: strict-origin-when-cross-origin`.

This static site requires no Vercel runtime adapter, Cloudflare Worker, or
server-side environment variables. See the official
[Astro deployment guide](https://docs.astro.build/en/guides/deploy/vercel/) and
[Vercel Astro documentation](https://vercel.com/docs/frameworks/frontend/astro).
Committing this configuration does not deploy the site or change DNS.

Review [Deployment Protection](https://vercel.com/docs/deployment-protection)
in the Vercel project settings to control access to previews. Vercel adds
[`X-Robots-Tag: noindex`](https://vercel.com/docs/headers/response-headers)
to preview deployments by default; this controls indexing, not access.

## Continuous integration

The GitHub Actions workflow runs on pushes and pull requests using Node.js 24.
It installs locked dependencies, checks types and lint, builds and tests the
generated HTML, then runs Chromium browser tests. Actions are pinned to commit
SHAs and the workflow has read-only repository permissions.

This workflow does not automatically gate Vercel production deployments.
Configure [Vercel Deployment Checks](https://vercel.com/docs/deployment-checks)
for the CI result in project settings if production promotion must wait for CI,
and require the check in GitHub branch protection to gate merges.

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

## Contact form → Telegram

The contact CTAs (header button, hero/footer buttons, and `/contact/`) all open
the same project-brief form, which POSTs JSON to `/api/contact/`
(`src/pages/api/contact.ts`). That endpoint validates the submission and pushes
it to Telegram via `sendMessage`. Without JavaScript the form posts directly to
the same endpoint.

Required environment variables (see `.env.example`):

| Variable | How to get it |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | Message [@BotFather](https://t.me/BotFather), `/newbot`, copy the token. |
| `TELEGRAM_CHAT_ID` | Add the bot to a private channel or group (as admin for channels), post one message, then `curl "https://api.telegram.org/bot<TOKEN>/getUpdates"` and read `result[].message.chat.id`. Channel ids look like `-1001234567890`. |

Set both in Vercel project settings for Preview and Production. Without them the
endpoint returns `503` and the form shows an error.

The form endpoints are server-rendered; every page stays prerendered.
Abuse controls are a hidden honeypot field and a per-instance in-memory rate
limit (5 submissions per IP per 10 minutes) — best effort, since serverless
instances do not share memory.

## Newsletter signups → existing Telegram chat

Every footer and article-end newsletter button opens `LabSignup`, which POSTs to
`/api/lab-access/`. Signups use the same `TELEGRAM_BOT_TOKEN` and
`TELEGRAM_CHAT_ID` as the contact form in development and production. There is
no Mailchimp or email delivery service involved and no local-file fallback.
Each Telegram message includes the email, purpose, signup page, UTC timestamp,
and newsletter consent version. Article-access requests remain labeled separately.
The form confirms success only after Telegram accepts the message; failed
submissions show a retry message. `LAB_ACCESS_SECRET` is required for remembering
reader access in production, but newsletter collection works without it.

## Vercel BotID

Contact, reader registration, and newsletter submissions use
[Vercel BotID](https://vercel.com/docs/botid/get-started) in **Basic** mode.
The browser initializes protection before the form handlers, and both POST routes
verify requests before validation, Telegram delivery, or reader-cookie changes.
Bots receive HTTP 403; verification errors receive HTTP 503. Public pages and
reader recognition GET requests are unaffected. JavaScript is required to submit.

Client and server explicitly select `basic`, keeping the check level consistent
and avoiding paid Deep Analysis. `vercel.json` includes the package's challenge
and proxy rewrites, plus its framing restrictions. Tests compare these rules
against the installed BotID package so upgrades cannot silently drift.

### Deployment

Deploy to Vercel with **OIDC enabled** in the project settings. BotID uses Vercel's
request context and OIDC token; no CAPTCHA secret, Redis store, or separate BotID
API key is required. This checkout is not linked to a Vercel project, so the
project setting and live classification still need verification when deployed.
Do not enable Deep Analysis unless you intend to use its paid checks.

### Testing

`pnpm test` covers allowed, blocked, and failed verification through the submission
routes, with BotID verdicts and Telegram transport mocked. `pnpm exec playwright
test --config playwright.botid.config.ts` checks browser initialization, protected
request headers, and success/error form behavior with a mocked provider challenge and no Telegram messages.
Astro dev mirrors the SDK proxy rewrites because it does not read `vercel.json`.

In `astro dev`, the SDK's explicit development bypass permits requests. Production
builds disable that bypass. Passing local tests does **not** establish production
bot detection: verify a real browser submission and blocked automated request on
a Vercel deployment, then inspect BotID events in the project's Firewall tab.
