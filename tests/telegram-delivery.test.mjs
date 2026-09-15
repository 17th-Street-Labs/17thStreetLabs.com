/* global Response */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createTelegramDelivery } from '../src/lib/telegram-delivery.ts';

const configure = () => ({ token: 'test-token', chatId: 'test-chat' });

for (const format of [undefined, 'HTML']) {
  test(`delivery preserves ${format || 'plain text'} and requires acceptance`, async () => {
    const send = createTelegramDelivery({ configure, transport: async (url, options) => {
      assert.equal(url, 'https://api.telegram.org/bottest-token/sendMessage');
      assert.equal(options.method, 'POST');
      assert.equal(options.headers['Content-Type'], 'application/json');
      assert.deepEqual(JSON.parse(options.body), {
        chat_id: 'test-chat', text: '<b>Brief</b>', disable_web_page_preview: true,
        ...(format ? { parse_mode: format } : {}),
      });
      return new Response('{"ok":true}');
    } });
    assert.deepEqual(await send({ text: '<b>Brief</b>', format }), { delivered: true });
  });
}

for (const [label, response, reason] of [
  ['HTTP rejection', () => new Response('{"ok":true}', { status: 500 }), 'rejected'],
  ['Telegram rejection', () => new Response('{"ok":false}'), 'rejected'],
  ['missing acceptance', () => new Response('{}'), 'rejected'],
  ['truthy acceptance', () => new Response('{"ok":"true"}'), 'rejected'],
  ['null body', () => new Response('null'), 'rejected'],
  ['malformed body', () => new Response('not JSON'), 'unavailable'],
  ['network failure', () => { throw new Error('URL with secret'); }, 'unavailable'],
]) {
  test(label, async () => {
    const send = createTelegramDelivery({ configure, transport: async () => response() });
    assert.deepEqual(await send({ text: 'brief' }), { delivered: false, reason });
  });
}

test('missing configuration never sends', async () => {
  for (const config of [{}, { token: 'token' }, { chatId: 'chat' }]) {
    const send = createTelegramDelivery({ configure: () => config, transport: async () => assert.fail('must not send') });
    assert.deepEqual(await send({ text: 'brief' }), { delivered: false, reason: 'unconfigured' });
  }
});

test('configuration is resolved for each delivery', async () => {
  let config = {};
  const send = createTelegramDelivery({ configure: () => config, transport: async () => new Response('{"ok":true}') });
  assert.equal((await send({ text: 'brief' })).delivered, false);
  config = configure();
  assert.equal((await send({ text: 'brief' })).delivered, true);
});

test('the eight-second deadline reaches the transport and fails safely', async t => {
  const signal = AbortSignal.abort(new Error('deadline'));
  t.mock.method(AbortSignal, 'timeout', milliseconds => {
    assert.equal(milliseconds, 8000);
    return signal;
  });
  const send = createTelegramDelivery({ configure, transport: async (_url, options) => {
    assert.equal(options.signal, signal);
    options.signal.throwIfAborted();
  } });
  assert.deepEqual(await send({ text: 'brief' }), { delivered: false, reason: 'unavailable' });
});
