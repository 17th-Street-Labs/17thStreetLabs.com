import type { APIRoute } from 'astro';
import { appendFile, mkdir } from 'node:fs/promises';
import { COOKIE, MAX_AGE, createAccessToken, validAccessToken, validEmail } from '../../lib/lab-access';
import { labSecret } from '../../lib/lab-secret';
export const prerender = false;
const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: {'Content-Type': 'application/json', 'Cache-Control': 'no-store'} });
const attempts = new Map<string, { count: number; until: number }>();
export const GET: APIRoute = ({ cookies }) => response({ unlocked: validAccessToken(cookies.get(COOKIE)?.value, labSecret()) });
export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  if (request.headers.get('origin') !== new URL(request.url).origin) return response({ error: 'Please submit from this website.' }, 403);
  const key = clientAddress || 'unknown';
  const now = Date.now();
  for (const [ip, item] of attempts) if (item.until < now) attempts.delete(ip);
  const rate = attempts.get(key) ?? { count: 0, until: now + 600_000 };
  rate.count++; attempts.set(key, rate);
  if (rate.count > 10) return response({error: 'Please wait a few minutes before trying again.'}, 429);
  let data;
  try {
    const raw = await request.text();
    if (raw.length > 2048) return response({ error: 'Please use a shorter email address.' }, 400);
    data = JSON.parse(raw);
  } catch { return response({ error: 'Please check your email and try again.' }, 400); }
  const email = typeof data?.email === 'string' ? data.email.trim() : '';
  if (!validEmail(email) || data.company) return response({ error: 'Please enter a valid email address.' }, 400);
  const purpose = data.purpose ?? 'article-access';
  if (!['article-access', 'newsletter'].includes(purpose)) return response({error: 'Please choose a valid signup.'}, 400);
  const secret = labSecret();
  if (!secret) return response({ error: 'Reader access is unavailable right now. Please try again later.' }, 503);
  try {
    if (import.meta.env.DEV) {
      await mkdir('.local', { recursive: true, mode: 0o700 });
      await appendFile('.local/lab-readers.jsonl', JSON.stringify({ email, purpose, consentVersion: purpose === 'newsletter' ? 'from-the-lab-newsletter-v1' : undefined, registeredAt: new Date().toISOString() })+'\n', { mode: 0o600 });
    } else {
      const token = import.meta.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
      const chatId = import.meta.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
      if (!token || !chatId) return response({error: 'Reader access is unavailable right now. Please try again later.'}, 503);
      const delivery = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({chat_id: chatId, text: `New From the Lab reader\nEmail: ${email}\nPurpose: ${purpose === 'newsletter' ? 'Explicit From the Lab newsletter signup (consent v1).' : 'Article access only; no marketing subscription.'}`, disable_web_page_preview: true}),
        signal: AbortSignal.timeout(8000),
      });
      if (!delivery.ok || !(await delivery.json()).ok) throw new Error('registration delivery failed');
    }
    cookies.set(COOKIE, createAccessToken(secret), { httpOnly: true, secure: new URL(request.url).protocol === 'https:', sameSite: 'lax', path: '/', maxAge: MAX_AGE });
    return response({ unlocked: true });
  } catch {
    return response({error: 'We couldn’t save your email. Please try again.'}, 503);
  }
};
