import { describe, it, expect } from 'vitest';
import { addCounter } from '$lib/server/bsky/threader';

describe('addCounter', () => {
	it('should add a counter to each post', async () => {
		const posts = [{ text: 'Post 1' }, { text: 'Post 2' }];
		const result = await addCounter(posts, 2);
		expect(result).toEqual([{ text: 'Post 1 (1/2)' }, { text: 'Post 2 (2/2)' }]);
	});

	it('should not add a counter if it exceeds character limit', async () => {
		const posts = [{ text: 'A'.repeat(300) }];
		const result = await addCounter(posts, 1);
		expect(result).toEqual([{ text: 'A'.repeat(300) }]);
	});
});
