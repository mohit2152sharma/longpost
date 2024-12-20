import { removeFile } from '../../src/lib/lib-utils'; // Adjust the import path as necessary
import fs from 'fs';
import path from 'path';
import { vi, expect, test, beforeAll, afterAll, describe } from 'vitest';

describe('removeFile', () => {
	const testFilePath = path.join(__dirname, 'test-file.txt');

	beforeAll(() => {
		// Create a test file to remove
		fs.writeFileSync(testFilePath, 'This is a test file.');
	});

	afterAll(() => {
		// Clean up: remove the test file if it exists
		if (fs.existsSync(testFilePath)) {
			fs.unlinkSync(testFilePath);
		}
	});

	test('should remove an existing file', async () => {
		await removeFile(testFilePath);
		expect(fs.existsSync(testFilePath)).toBe(false);
	});

	test('should handle removing a non-existent file', async () => {
		const nonExistentFilePath = path.join(__dirname, 'non-existent-file.txt');
		const result = await removeFile(nonExistentFilePath);
		expect(result).toBeUndefined();
	});

	test('it logs an error if file does not exist', async () => {
		const nonExistentFilePath = path.join(__dirname, 'non-existent-file.txt');
		const spy = vi.spyOn(console, 'error');
		await removeFile(nonExistentFilePath);
		expect(spy).toHaveBeenCalledOnce();
		expect(spy).toHaveBeenCalledWith(
			expect.stringContaining(`File ${nonExistentFilePath} does not exist`)
		);
		spy.mockRestore();
	});
});
