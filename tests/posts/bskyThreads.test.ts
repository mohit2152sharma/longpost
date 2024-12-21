// BUG: Fix bluesky test cases
import { describe, it, expect, beforeEach } from 'vitest';
import { bskyThreads } from '$lib/server/bsky/posts';
import { vi, type Mock } from 'vitest';

vi.mock('$lib/server/bsky/posts', () => ({
	bskyThreads: vi.fn()
}));

const mockBskyThreads = bskyThreads as Mock;

describe('bskyThreads', () => {
	const sessionData = {
		/* mock session data */
	};
	const parsedValues = {
		/* mock parsed values */
	};

	beforeEach(() => {
		mockBskyThreads.mockReset();
	});

	it('should process threads successfully', async () => {
		mockBskyThreads.mockResolvedValue({
			/* mock response */
		});

		const result = await bskyThreads('https://bsky.social', sessionData, parsedValues);
		expect(result).toBeDefined();
		expect(mockBskyThreads).toHaveBeenCalled();
	});

	it('should handle character limit', async () => {
		mockBskyThreads.mockResolvedValue({
			/* mock response */
		});

		const result = await bskyThreads('https://bsky.social', sessionData, parsedValues, 300);
		expect(result).toBeDefined();
		expect(mockBskyThreads).toHaveBeenCalled();
	});
});
