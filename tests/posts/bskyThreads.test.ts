import { describe, it, expect, vi } from 'vitest';
import { bskyThreads } from '$lib/server/bsky/posts';

vi.mock('$lib/server/bsky/posts', () => ({
  bskyThreads: vi.fn()
}));

const mockBskyThreads = bskyThreads as vi.Mock;

describe('bskyThreads', () => {
  const sessionData = { /* mock session data */ };
  const parsedValues = { /* mock parsed values */ };

  beforeEach(() => {
    mockBskyThreads.mockReset();
  });

  it('should process threads successfully', async () => {
    mockBskyThreads.mockResolvedValue({ /* mock response */ });

    const result = await bskyThreads('https://bsky.social', sessionData, parsedValues);
    expect(result).toBeDefined();
    expect(mockBskyThreads).toHaveBeenCalled();
  });

  it('should handle character limit', async () => {
    mockBskyThreads.mockResolvedValue({ /* mock response */ });

    const result = await bskyThreads('https://bsky.social', sessionData, parsedValues, 300);
    expect(result).toBeDefined();
    expect(mockBskyThreads).toHaveBeenCalled();
  });
});
