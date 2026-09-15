import { createBotProtection } from '../src/lib/bot-protection.ts';
/* global Request, Response */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { createTelegramDelivery } from '../src/lib/telegram-delivery.ts';

const compiled = ts.transpileModule(readFileSync(new URL('../src/pages/api/contact.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function setup({ isBot = false, verificationFails = false, configured = true, reply = () => new Response('{"ok":true}') } = {}) {
  const protectSubmission = createBotProtection(async () => {
    if (verificationFails) throw new Error('verification unavailable');
    return { isBot, isHuman: !isBot, isVerifiedBot: false, bypassed: false };
  });
  const messages = [];
  const sendTelegramMessage = createTelegramDelivery({
    configure: () => configured ? { token: 'test-token', chatId: 'test-chat' } : {},
    transport: async (_url, options) => { messages.push(JSON.parse(options.body)); return reply(); },
  });
  const exports = {};
  new Function('exports', 'require', compiled)(exports, name => {
    if (name.endsWith('bot-protection')) return { protectSubmission };
    assert.ok(name.endsWith('telegram-delivery'));
    return { sendTelegramMessage };
  });
  const submit = async (fields = {}) => exports.POST({
    request: new Request('https://example.com/api/contact/', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '<Visitor>', email: 'visitor@example.com', context: 'A & B', ...fields }),
    }), clientAddress: '127.0.0.1',
  });
  return { submit, messages };
}

test('contact confirms accepted delivery and escapes visitor HTML', async () => {
  const { submit, messages } = setup();
  const response = await submit();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(messages[0].parse_mode, 'HTML');
  assert.match(messages[0].text, /&lt;Visitor&gt;/);
  assert.match(messages[0].text, /A &amp; B/);
});

for (const [label, options, status] of [
  ['missing configuration', { configured: false }, 503],
  ['HTTP failure', { reply: () => new Response('{}', { status: 500 }) }, 502],
  ['Telegram rejection', { reply: () => new Response('{"ok":false}') }, 502],
  ['malformed response', { reply: () => new Response('invalid') }, 502],
  ['network failure', { reply: () => { throw new Error('offline'); } }, 502],
]) {
  test(`contact never confirms ${label}`, async () => {
    const { submit } = setup(options);
    const response = await submit();
    assert.equal(response.status, status);
    assert.equal((await response.json()).ok, false);
  });
}

test('contact validation and honeypot do not deliver', async () => {
  const { submit, messages } = setup();
  assert.equal((await submit({ email: 'invalid' })).status, 400);
  assert.equal((await submit({ company: 'bot' })).status, 200);
  assert.equal(messages.length, 0);
});

for (const [options, status] of [[{ isBot: true }, 403], [{ verificationFails: true }, 503]]) {
  test(`contact blocks before delivery: ${status}`, async () => {
    const { submit, messages } = setup(options);
    assert.equal((await submit()).status, status);
    assert.equal(messages.length, 0);
  });
}
