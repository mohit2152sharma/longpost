import { describe, it, expect, vi, beforeEach } from 'vitest';
import { onlyOneParam, retryFetch } from '$lib/lib-utils';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('onlyOneParam', () => {
  it('should throw an error if more than one parameter is truthy', () => {
    expect(() => onlyOneParam(1, true, 'test')).toThrow('Only one param allowed');
  });

  it('should not throw an error if only one parameter is truthy', () => {
    expect(() => onlyOneParam(1, null, undefined)).not.toThrow();
  });

  it('should throw an error if all parameters are falsy', () => {
    expect(() => onlyOneParam(null, undefined, false)).toThrow("Need to provide atleast one param");
  });
});

describe('retryFetch', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should return a successful response without retries', async () => {
    const successResponse = new Response(null, { status: 200 });
    mockFetch.mockResolvedValue(successResponse);

    const response = await retryFetch('https://example.com', 'GET', {}, null, false);
    expect(response).toBe(successResponse);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should retry the specified number of times on failure', async () => {
    const failureResponse = new Response(null, { status: 500 });
    mockFetch.mockResolvedValue(failureResponse);

    const response = await retryFetch('https://example.com', 'GET', {}, null, true, 3);
    expect(response).toBe(failureResponse);
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('should return the last response after retries', async () => {
    const failureResponse = new Response(null, { status: 500 });
    mockFetch.mockResolvedValue(failureResponse);

    const response = await retryFetch('https://example.com', 'GET', {}, null, true, 2);
    expect(response).toBe(failureResponse);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
