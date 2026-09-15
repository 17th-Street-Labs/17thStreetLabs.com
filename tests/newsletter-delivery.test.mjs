import { createBotProtection } from '../src/lib/bot-protection.ts';
/* global Request, Response */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { createTelegramDelivery } from '../src/lib/telegram-delivery.ts';
import * as access from '../src/lib/lab-access.ts';

const source = readFileSync(new URL('../src/pages/api/lab-access.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function setup({ isBot = false, verificationFails = false, secret = '', accepted = true, status = 200, configured = true, fail = false } = {}) {
  const protectSubmission = createBotProtection(async () => {
    if (verificationFails) throw new Error('verification unavailable');
    return { isBot, isHuman: !isBot, isVerifiedBot: false, bypassed: false };
  });
  const messages = [];
  const cookies = [];
  const exports = {};
  const fetch = async (url, options) => {
    messages.push({ url, body: JSON.parse(options.body) });
    if (fail) throw new Error('Network unavailable');
    return new Response(JSON.stringify({ ok: accepted }), { status });
  };
  const sendTelegramMessage = createTelegramDelivery({
    configure: () => configured ? { token: 'test-token', chatId: 'test-chat' } : {},
    transport: fetch,
  });
  const require = name => {
    if (name.endsWith('bot-protection')) return { protectSubmission };
    if (name.endsWith('lab-secret')) return { labSecret: () => secret };
    if (name.endsWith('telegram-delivery')) return { sendTelegramMessage };
    if (name.endsWith('lab-access')) return access;
    throw new Error(`Unexpected import: ${name}`);
  };
  // Run the route with real delivery and token logic; only configuration and transport vary.
  new Function('exports', 'require', compiled)(exports, require);
  const submit = async (purpose = 'newsletter') => exports.POST({
    request: new Request('https://example.com/api/lab-access/', {
      method: 'POST', headers: { origin: 'https://example.com' },
      body: JSON.stringify({ email: 'reader@example.com', purpose, page: '/lab/example/' }),
    }),
    cookies: { set: (...args) => cookies.push(args) }, clientAddress: '127.0.0.1',
  });
  return { submit, messages, cookies };
}

test('newsletter reaches the existing Telegram chat without a reader secret', async () => {
  const { submit, messages, cookies } = setup();
  const res = await submit();
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { saved: true, unlocked: false });
  assert.equal(cookies.length, 0);
  assert.equal(messages[0].url, 'https://api.telegram.org/bottest-token/sendMessage');
  assert.equal(messages[0].body.chat_id, 'test-chat');
  for (const text of ['reader@example.com', 'newsletter', '/lab/example/', 'Registered at:', 'from-the-lab-newsletter-v1']) {
    assert.ok(messages[0].body.text.includes(text));
  }
});

for (const options of [{ accepted: false }, { status: 500 }, { fail: true }, { configured: false }]) {
  test(`newsletter never confirms a failed delivery: ${JSON.stringify(options)}`, async () => {
    const { submit, cookies } = setup({ ...options, secret: 'test-secret' });
    const res = await submit();
    assert.equal(res.status, 503);
    assert.ok((await res.json()).error);
    assert.equal(cookies.length, 0);
  });
}

test('reader access remains distinct from newsletter consent', async () => {
  const { submit, messages, cookies } = setup({ secret: 'test-secret' });
  assert.equal((await submit('article-access')).status, 200);
  assert.equal(cookies.length, 1);
  assert.equal(cookies[0][0], access.COOKIE);
  assert.equal(access.validAccessToken(cookies[0][1], 'test-secret'), true);
  assert.equal(cookies[0][2].httpOnly, true);
  assert.match(messages[0].body.text, /no marketing subscription/);
  assert.ok(!messages[0].body.text.includes('from-the-lab-newsletter-v1'));
});

for (const purpose of ['newsletter', 'article-access']) {
  for (const [options, status] of [[{ isBot: true }, 403], [{ verificationFails: true }, 503]]) {
    test(`${purpose} blocks before delivery or cookie: ${status}`, async () => {
      const { submit, messages, cookies } = setup({ ...options, secret: 'test-secret' });
      assert.equal((await submit(purpose)).status, status);
      assert.equal(messages.length, 0);
      assert.equal(cookies.length, 0);
    });
  }
}
