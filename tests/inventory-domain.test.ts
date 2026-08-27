import assert from 'node:assert/strict';
import test from 'node:test';
import { canTransitionInventoryStatus } from '../server/domain/inventory';

test('inventory lifecycle permits reservation, release, and sale transitions', () => {
  assert.equal(canTransitionInventoryStatus('available', 'reserved'), true);
  assert.equal(canTransitionInventoryStatus('reserved', 'available'), true);
  assert.equal(canTransitionInventoryStatus('available', 'sold'), true);
  assert.equal(canTransitionInventoryStatus('reserved', 'sold'), true);
});

test('sold and retired inventory are terminal states', () => {
  assert.equal(canTransitionInventoryStatus('sold', 'available'), false);
  assert.equal(canTransitionInventoryStatus('sold', 'reserved'), false);
  assert.equal(canTransitionInventoryStatus('retired', 'available'), false);
});
