import { describe, it, expect, vi } from 'vitest';
import { uploadImages } from '$lib/server/bsky/posts';

vi.mock('$lib/server/bsky/posts', () => ({
	uploadImages: vi.fn()
}));

const mockUploadImages = uploadImages as vi.Mock;

describe('uploadImages', () => {
	const sessionData = {
		/* mock session data */
	};
	const images = [
		/* mock images */
	];

	beforeEach(() => {
		mockUploadImages.mockReset();
	});

	it('should upload all images successfully', async () => {
		mockUploadImages.mockResolvedValue([
			/* mock blob data */
		]);

		const result = await uploadImages(images, sessionData, 'https://bsky.social');
		expect(result).toBeDefined();
		expect(mockUploadImages).toHaveBeenCalled();
	});

	it('should handle retry logic', async () => {
		mockUploadImages.mockResolvedValue([
			/* mock blob data */
		]);

		const result = await uploadImages(images, sessionData, 'https://bsky.social', true, 3);
		expect(result).toBeDefined();
		expect(mockUploadImages).toHaveBeenCalledTimes(1);
	});
});
