import { describe, it, expect } from 'vitest';
import { addShoutout } from '$lib/server/bsky/threader';

describe('addShoutout', () => {
	it('should add a shoutout message if shoutout is true', async () => {
		const posts = [{ text: 'Post 1' }];
		const result = await addShoutout(posts, true);
		expect(result[result.length - 1].text).toBe(
			'This thread was created by Longpost. Try it out at: https:/www.longpost.in'
		);
	});

	it('should not add a shoutout message if shoutout is false', async () => {
		const posts = [{ text: 'Post 1' }];
		const result = await addShoutout(posts, false);
		expect(result).toEqual(posts);
	});
});
