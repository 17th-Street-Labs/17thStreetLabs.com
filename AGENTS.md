# 17th Street Labs site

Astro site on Vercel: prerendered pages plus server API routes for visitor submissions.

## Layout

- `src/pages/` routes, `src/pages/api/` submission endpoints.
- `src/lib/` bot protection, reader access, Telegram delivery.
- `src/content/lab/` articles (also served under `/blog/`), `src/data/` page data.
- `src/images/` processed images, `public/` served verbatim.
- `scripts/` local preview and perf tooling, `tests/` Node + Playwright suites.

## Conventions

- **pnpm, never npm** — the lockfile and `packageManager` pin it, and README's `npm` examples are stale. Node 24.
- **Hand-written CSS, not Tailwind utilities.** Tailwind v4 is wired into Vite, but styling lives in `src/styles/globals.css`; extend it rather than adding utility classes to markup.
- PascalCase Astro components; kebab-case articles and `src/lib/` modules.
- ESLint covers JS/TS/Astro; no formatter — match surrounding style.
- Keep shared behavior in components or `src/lib/` rather than repeating it across routes.

Commands live in `package.json` scripts. `pnpm preview` runs `scripts/preview-static.mjs` (Astro's own preview cannot execute API routes). `pnpm test` runs the Node unit tests; `pnpm test:browser` runs the Playwright smoke suite, which serves `dist/`, so build first.

## Submissions

Read `CONTEXT.md` before changing submission or signup semantics — it defines brief, registration, signup, and delivery precisely.

- Configuration names come from `.env.example`; `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set in Vercel, not locally.
- Automated tests mock Telegram. Treat a mocked pass as delivery-logic coverage only; real delivery is verified separately and deliberately.
- `scripts/preview-static.mjs --signup-origin …` proxies `/api/lab-access/` to production, so signups from that preview reach the real chat. See `docs/local-preview.md`.

## Gotchas

- `trailingSlash: "always"` — internal links and test URLs need the trailing slash.
- Astro dev does not apply `vercel.json` rewrites; `astro.config.mjs` mirrors the BotID proxies for dev.
- Keep credentials, `.local/` registration data, and build artifacts out of commits.

## Tests

Name Node tests `*.test.mjs`, Playwright tests `*.spec.ts`. Cover changed API logic and browser interactions behaviorally; check responsive layouts for UI changes. CI runs check, lint, build/unit tests, and the Chromium suite. Install the browser once with `pnpm exec playwright install chromium`; BotID integration runs via `pnpm exec playwright test --config playwright.botid.config.ts`.

## Commits & PRs

Imperative subjects matching history ("Make blog cards fully clickable"); `fix:`/`feat:` prefixes also appear. PRs state the behavior change, list validation results, link issues, and attach desktop/mobile screenshots for visual changes. Report CI and Vercel deployment status separately.
