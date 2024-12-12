import { describe, it, expect } from 'vitest';
import { createEmbed } from '$lib/server/bsky/posts';

describe('createEmbed', () => {
	const images = [
		/* mock images */
	];
	const blobs = [
		/* mock blobs */
	];

	it('should create embed with images and blobs', () => {
		const result = createEmbed(images, blobs);
		expect(result).toBeDefined();
		expect(result.images).toEqual(images);
		expect(result.blobs).toEqual(blobs);
	});
});
