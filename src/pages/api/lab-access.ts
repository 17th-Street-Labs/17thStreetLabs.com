import { protectSubmission } from '../../lib/bot-protection';
import type { APIRoute } from 'astro';
import { COOKIE, MAX_AGE, createAccessToken, validAccessToken, validEmail } from '../../lib/lab-access';
import { labSecret } from '../../lib/lab-secret';
import { sendTelegramMessage } from '../../lib/telegram-delivery';
export const prerender = false;
const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: {'Content-Type': 'application/json', 'Cache-Control': 'no-store'} });
const attempts = new Map<string, { count: number; until: number }>();
export const GET: APIRoute = ({ cookies }) => response({ unlocked: validAccessToken(cookies.get(COOKIE)?.value, labSecret()) });
export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  const denied = await protectSubmission(request);
  if (denied) return denied;
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
  if (purpose === 'article-access' && !secret) return response({ error: 'Reader access is unavailable right now. Please try again later.' }, 503);
  const page = typeof data.page === 'string' ? data.page.slice(0, 300) : '';
  const registeredAt = new Date().toISOString();
  const lines = [
    purpose === 'newsletter' ? 'New From the Lab newsletter signup' : 'New From the Lab reader',
    `Email: ${email}`,
    `Purpose: ${purpose}`,
    ...(page ? [`Page: ${page}`] : []),
    `Registered at: ${registeredAt}`,
    purpose === 'newsletter'
      ? 'Consent: Agreed to receive the From the Lab newsletter by email. Version: from-the-lab-newsletter-v1.'
      : 'Article access only; no marketing subscription.',
  ];
  try {
    const delivery = await sendTelegramMessage({ text: lines.join('\n') });
    if (!delivery.delivered) {
      return response({ error: delivery.reason === 'unconfigured'
        ? 'Signup is unavailable right now. Please try again later.'
        : 'We couldn’t save your email. Please try again.' }, 503);
    }
    if (secret) cookies.set(COOKIE, createAccessToken(secret), { httpOnly: true, secure: new URL(request.url).protocol === 'https:', sameSite: 'lax', path: '/', maxAge: MAX_AGE });
    return response({ saved: true, unlocked: Boolean(secret) });
  } catch {
    return response({error: 'We couldn’t save your email. Please try again.'}, 503);
  }
};
