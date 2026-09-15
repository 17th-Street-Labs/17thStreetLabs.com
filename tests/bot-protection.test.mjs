/* global Request */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { withBotId } from 'botid/next/config';
import { createBotProtection } from '../src/lib/bot-protection.ts';

test('Basic check receives request headers; runtime defaults fail closed', async () => {
  const protect = createBotProtection(async options => {
    assert.equal(options.advancedOptions.checkLevel, 'basic');
    assert.equal(options.advancedOptions.headers['x-is-human'], 'test-challenge');
    // Direct Node tests are not Astro dev, even if NODE_ENV is unset.
    assert.equal(options.developmentOptions.isDevelopment, false);
    return { isBot: false };
  });
  assert.equal(await protect(new Request('https://example.com/api/contact/', { headers: { 'x-is-human': 'test-challenge' } })), null);
});

for (const verdict of [{ isBot: true }, {}, null]) {
  test(`rejects an unapproved verdict: ${JSON.stringify(verdict)}`, async () => {
    const protect = createBotProtection(async () => verdict);
    const response = await protect(new Request('https://example.com/'));
    assert.ok([403, 503].includes(response.status));
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal((await response.json()).ok, false);
  });
}

test('provider errors fail closed without exposing details', async () => {
  const protect = createBotProtection(async () => { throw new Error('private provider details'); });
  const response = await protect(new Request('https://example.com/'));
  assert.equal(response.status, 503);
  assert.ok(!(await response.text()).includes('private provider details'));
});

test('Vercel rewrites and headers track the installed BotID SDK', async () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  const expected = withBotId({});
  assert.deepEqual(config.rewrites, await expected.rewrites());
  for (const header of await expected.headers()) assert.ok(config.headers.some(value => JSON.stringify(value) === JSON.stringify(header)));
});
