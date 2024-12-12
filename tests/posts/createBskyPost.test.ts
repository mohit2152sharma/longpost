import { describe, it, expect, vi } from 'vitest';
import { createBskyPost } from '$lib/server/bsky/posts';
import { BskyAgent } from '@atproto/api';

vi.mock('@atproto/api', () => ({
  BskyAgent: vi.fn()
}));

const mockBskyAgent = BskyAgent as vi.Mock;


describe('createBskyPost', () => {
  const sessionData = { /* mock session data */ };
  const post = { text: 'Test post', images: [ /* mock images */ ] };

  beforeEach(() => {
    mockBskyAgent.mockReset();
  });

  it('should create a post successfully', async () => {
    mockBskyAgent.mockResolvedValue({ /* mock response */ });

    const result = await createBskyPost(mockBskyAgent, 'https://bsky.social', sessionData, post);
    expect(result).toBeDefined();
    expect(mockBskyAgent).toHaveBeenCalled();
  });

  it('should handle replies', async () => {
    const reply = { /* mock reply */ };
    mockBskyAgent.mockResolvedValue({ /* mock response */ });

    const result = await createBskyPost(mockBskyAgent, 'https://bsky.social', sessionData, post, reply);
    expect(result).toBeDefined();
    expect(mockBskyAgent).toHaveBeenCalled();
  });
});
