import { describe, expect, it } from 'vitest';

describe('bootstrap', () => {
  it('usa quindici giornate per il viaggio', () => {
    expect(new Date('2026-08-23T00:00:00Z').getUTCDate() - new Date('2026-08-09T00:00:00Z').getUTCDate() + 1).toBe(15);
  });
});
