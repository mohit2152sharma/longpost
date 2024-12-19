import { describe, it, expect } from 'vitest';
import { createThread } from '$lib/server/bsky/threader';
import { type CodeImage } from '$lib/server/bsky/code-images';
// import { extractCode, renderCodeSnippet } from '$lib/server/bsky/code-images';

// Mocking the module before importing any functions
// vi.mock('$lib/server/bsky/code-images', () => ({
//   extractCode: vi.fn(),
//   renderCodeSnippet: vi.fn()
// }));

// Extract mocked functions correctly
// const mockExtractCode = extractCode as vi.MockedFunction<typeof extractCode>;
// const mockRenderCodeSnippet = renderCodeSnippet as vi.MockedFunction<typeof renderCodeSnippet>;

// beforeEach(() => {
//   // Reset mocks before each test
//   mockExtractCode.mockReset();
//   mockRenderCodeSnippet.mockReset();
// });

describe('createThread', () => {
	it('should create a thread with posts and images', async () => {
		// Mock return values for extractCode and renderCodeSnippet
		// mockExtractCode.mockResolvedValueOnce([
		//   {
		//     language: 'javascript',
		//     code: 'console.log("Hello World")\n',
		//     codeSnippet: '```javascript\nconsole.log("Hello World")\n```',
		//     codeSnippetStartingIndex: 0,
		//     codeSnippetEndingIndex: 39,
		//   },
		// ]);
		// mockRenderCodeSnippet.mockResolvedValueOnce({
		//   title: 'image_1',
		//   imageProperties: { outputPath: 'output_1.png', width: 100, height: 100 },
		//   index: 0,
		//   code: 'console.log("Hello World")\n',
		// });

		const text = '```javascript\nconsole.log("Hello World")\n```';
		const result = await createThread(text, false, 300);

		// Assertions
		expect(result.posts).toHaveLength(1);
		expect(result.posts![0].text).toBe('[image_1] (1/1)');

		const images = result.posts![0].images as Array<CodeImage>;
		expect(images[0].imageProperties).toHaveProperty('outputPath');
		expect(images[0].imageProperties.outputPath.endsWith('output_1.png')).toBe(true);
		expect(images[0].imageProperties.height).toEqual(145);
		expect(images[0].imageProperties.width).toEqual(640);
	});

	it('should return an error if a word exceeds the character limit', async () => {
		// mockExtractCode.mockResolvedValueOnce([]);
		const text = 'A'.repeat(301);
		const result = await createThread(text, false, 300);

		// Assertions
		expect(result.error).toBe(true);
		expect(result.message).toBe('Characters in word are greater than character limit');
	});
});
