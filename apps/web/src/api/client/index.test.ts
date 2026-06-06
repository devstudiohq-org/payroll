import { describe, expect, it } from 'vitest';

import { resolveApiBaseUrl } from './index';

describe('resolveApiBaseUrl', () => {
  it('falls back to the local api prefix when no env var is set', () => {
    expect(resolveApiBaseUrl()).toBe('/api');
  });
});
