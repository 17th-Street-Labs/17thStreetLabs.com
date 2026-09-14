import { createHmac, timingSafeEqual } from 'node:crypto';
export const COOKIE = 'lab_access';
export const MAX_AGE = 60 * 60 * 24 * 180;
export function createAccessToken(secret: string, now = Date.now()) {
  const payload = String(Math.floor(now / 1000) + MAX_AGE);
  return `${payload}.${createHmac('sha256', secret).update(payload).digest('hex')}`;
}
export function validAccessToken(token: string | undefined, secret: string, now = Date.now()) {
  if (!token || !secret) return false;
  const [expires, signature, extra] = token.split('.');
  if (extra || !/^\d+$/.test(expires) || !/^[a-f0-9]{64}$/.test(signature ?? '')) return false;
  if (Number(expires) <= Math.floor(now / 1000)) return false;
  const expected = createHmac('sha256', secret).update(expires).digest();
  return timingSafeEqual(Buffer.from(signature, 'hex'), expected);
}
export function validEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 160 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}
