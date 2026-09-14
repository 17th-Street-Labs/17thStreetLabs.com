import test from 'node:test';
import assert from 'node:assert/strict';
import { createAccessToken, validAccessToken, validEmail, MAX_AGE } from '../src/lib/lab-access.ts';
test('reader token rejects tampering, expiration and wrong secrets', () => {
  const token = createAccessToken('test-secret', 100000);
  assert.equal(validAccessToken(token, 'test-secret', 100000), true);
  assert.equal(validAccessToken(token, 'wrong-secret', 100000), false);
  assert.equal(validAccessToken(token + 'x', 'test-secret', 100000), false);
  assert.equal(validAccessToken('9999999999.' + token.split('.')[1], 'test-secret', 100000), false);
  assert.equal(validAccessToken(token, 'test-secret', 100000 + MAX_AGE * 1000), false);
  assert.equal(validAccessToken(undefined, 'test-secret'), false);
});
test('email validation rejects missing, malformed and oversized input', () => {
  for (const input of [null, {}, 'no-at-sign', 'a@b', 'x'.repeat(161)+'@example.com', 'a b@example.com']) assert.equal(validEmail(input), false);
  assert.equal(validEmail('reader+lab@example.com'), true);
});
