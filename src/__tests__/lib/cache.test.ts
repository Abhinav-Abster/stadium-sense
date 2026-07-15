import { ResponseCache } from '@/lib/cache';

describe('ResponseCache', () => {
  let cache: ResponseCache<string>;

  beforeEach(() => {
    // 1 second TTL for testing
    cache = new ResponseCache<string>(1);
  });

  it('should store and retrieve values', () => {
    const key = ResponseCache.generateKey('Test Query');
    cache.set(key, 'Cached Value');
    expect(cache.get(key)).toBe('Cached Value');
  });

  it('should return null for non-existent keys', () => {
    expect(cache.get('random-key')).toBeNull();
  });

  it('should expire values after TTL', async () => {
    const key = ResponseCache.generateKey('Expired Query');
    cache.set(key, 'Old Value');
    expect(cache.get(key)).toBe('Old Value');

    // Wait 1.1s for TTL expiry
    await new Promise((resolve) => setTimeout(resolve, 1100));

    expect(cache.get(key)).toBeNull();
  });

  it('should normalize keys deterministically', () => {
    const key1 = ResponseCache.generateKey('  where is gate 12?  ');
    const key2 = ResponseCache.generateKey('WHERE IS GATE 12?');
    const key3 = ResponseCache.generateKey('where  is  gate  12?');

    expect(key1).toBe(key2);
    expect(key2).toBe(key3); // handles whitespaces and casing
  });

  it('should clean up expired entries automatically', async () => {
    cache.set(ResponseCache.generateKey('key1'), 'value1');
    
    // Wait for key1 to expire
    await new Promise((resolve) => setTimeout(resolve, 1100));
    
    cache.set(ResponseCache.generateKey('key2'), 'value2');
    
    // key1 should be auto-purged from memory during cleanup
    expect(cache.size).toBe(1);
  });
});
