import { describe, it, expect } from 'vitest';
import { addImagesToPosts } from '$lib/server/bsky/threader';

describe('addImagesToPosts', () => {
	it('should add images to posts based on image titles', async () => {
		const posts = [{ text: 'Post with [image_1]' }, { text: 'Another post' }];
		const codeImages = [{ title: 'image_1', imagePath: 'path/to/image_1.png' }];
		const result = await addImagesToPosts(posts, codeImages);
		expect(result[0].images).toEqual([codeImages[0]]);
	});

	it('should throw an error if image title is not found in codeImages', async () => {
		const posts = [{ text: 'Post with [image_2]' }];
		const codeImages = [{ title: 'image_1', imagePath: 'path/to/image_1.png' }];
		await expect(addImagesToPosts(posts, codeImages)).rejects.toThrow(
			'Found matches for image title but no related images in codeImages. imageTitle: image_2'
		);
	});

	it('should distribute images across posts if a post has more than 4 images', async () => {
		const posts = [
			{ text: 'Post with [image_1] [image_2] [image_3] [image_4] [image_5]' },
			{ text: 'Another post' }
		];
		const codeImages = [
			{ title: 'image_1', imagePath: 'path/to/image_1.png' },
			{ title: 'image_2', imagePath: 'path/to/image_2.png' },
			{ title: 'image_3', imagePath: 'path/to/image_3.png' },
			{ title: 'image_4', imagePath: 'path/to/image_4.png' },
			{ title: 'image_5', imagePath: 'path/to/image_5.png' }
		];
		const result = await addImagesToPosts(posts, codeImages);
		expect(result[0].images).toHaveLength(4);
		expect(result[1].images).toHaveLength(1);
	});

	it('should handle a single post with 5 images by distributing the images', async () => {
		const posts = [{ text: 'Post with [image_1] [image_2] [image_3] [image_4] [image_5]' }];
		const codeImages = [
			{ title: 'image_1', imagePath: 'path/to/image_1.png' },
			{ title: 'image_2', imagePath: 'path/to/image_2.png' },
			{ title: 'image_3', imagePath: 'path/to/image_3.png' },
			{ title: 'image_4', imagePath: 'path/to/image_4.png' },
			{ title: 'image_5', imagePath: 'path/to/image_5.png' }
		];
		const result = await addImagesToPosts(posts, codeImages);
		expect(result).toHaveLength(2);
		expect(result[0].images).toHaveLength(4);
		expect(result[1].images).toHaveLength(1);
	});
});
