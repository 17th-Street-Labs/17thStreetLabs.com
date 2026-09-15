# Local preview and newsletter signup

Build with `pnpm build`, then run:

```sh
node scripts/preview-static.mjs --host 127.0.0.1 --port 4324 --signup-origin https://www.17thstreetlabs.com
```

The optional `--signup-origin` setting forwards only `/api/lab-access/` to the existing deployed signup service. Valid signups from this preview therefore reach the real configured Telegram account. Other API routes continue to use the local Astro backend. No production bot credentials are copied into local files.

Without the flag, signup uses local Astro and requires locally configured `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. The Vercel project currently configures these for preview and production deployments, not local development.

Do not serve this site with a static-only file server when testing forms. It cannot execute the API routes.

Automated form tests mock delivery. Validate the actual proxy with invalid input only, unless a real signup or test message is explicitly intended.
