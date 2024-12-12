import { describe, it, expect } from 'vitest';
import { getThreadLength } from '$lib/server/bsky/threader';

describe('getThreadLength', () => {
	it('should return the correct thread length without shoutout', async () => {
		const posts = [{ text: 'Post 1' }, { text: 'Post 2' }];
		const result = await getThreadLength(posts, false);
		expect(result).toBe(2);
	});

	it('should return the correct thread length with shoutout', async () => {
		const posts = [{ text: 'Post 1' }, { text: 'Post 2' }];
		const result = await getThreadLength(posts, true);
		expect(result).toBe(3);
	});
});
