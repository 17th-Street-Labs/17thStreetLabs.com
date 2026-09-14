/* global Request, Response */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/pages/api/lab-access.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source.replaceAll('import.meta.env', 'env'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function setup({ secret = '', accepted = true, status = 200, configured = true, fail = false } = {}) {
  const messages = [];
  const cookies = [];
  const exports = {};
  const env = configured ? { TELEGRAM_BOT_TOKEN: 'test-token', TELEGRAM_CHAT_ID: 'test-chat' } : {};
  const require = name => name.endsWith('lab-secret')
    ? { labSecret: () => secret }
    : { COOKIE: 'reader', MAX_AGE: 60, validEmail: email => email === 'reader@example.com', createAccessToken: () => 'signed-test-token' };
  const fetch = async (url, options) => {
    messages.push({ url, body: JSON.parse(options.body) });
    if (fail) throw new Error('Network unavailable');
    return new Response(JSON.stringify({ ok: accepted }), { status });
  };
  // Execute the actual route with isolated configuration and Telegram transport.
  new Function('exports', 'require', 'env', 'process', 'fetch', compiled)(exports, require, env, { env: {} }, fetch);
  const submit = (purpose = 'newsletter') => exports.POST({
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
    const { submit, cookies } = setup(options);
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
  assert.match(messages[0].body.text, /no marketing subscription/);
  assert.ok(!messages[0].body.text.includes('from-the-lab-newsletter-v1'));
});
