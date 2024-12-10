import { describe, it, expect, vi } from 'vitest';
import { bskyUploadImage } from '$lib/server/bsky/posts';
import { retryFetch } from '$lib/lib-utils';
import fs from 'fs';

vi.mock('fs');
vi.mock('$lib/lib-utils', () => ({
  retryFetch: vi.fn()
}));

const mockReadFile = fs.promises.readFile as vi.Mock;
const mockRetryFetch = retryFetch as vi.Mock;

describe('bskyUploadImage', () => {
  const sessionData = { /* mock session data */ };
  const imagePath = 'path/to/image.png';
  const imageMimeType = 'image/png';

  beforeEach(() => {
    mockReadFile.mockReset();
    mockRetryFetch.mockReset();
  });

  it('should upload image successfully', async () => {
    mockReadFile.mockResolvedValue(Buffer.alloc(500000)); // Mock image size
    mockRetryFetch.mockResolvedValue({ ok: true });

    const result = await bskyUploadImage('https://bsky.social', imagePath, sessionData, imageMimeType);
    expect(result).toBeDefined();
    expect(mockRetryFetch).toHaveBeenCalled();
  });

  it('should throw an error if image size is too large', async () => {
    mockReadFile.mockResolvedValue(Buffer.alloc(2000000)); // Mock large image size

    await expect(bskyUploadImage('https://bsky.social', imagePath, sessionData, imageMimeType)).rejects.toThrow('Image size (2000000) is too large. Max size is 1000000 bytes.');
  });
});
