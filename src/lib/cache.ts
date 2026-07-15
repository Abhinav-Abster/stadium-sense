import crypto from 'crypto';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/** In-memory cache with TTL (time-to-live) support. */
export class ResponseCache<T = string> {
  private cache: Map<string, CacheEntry<T>>;
  private ttlMs: number;

  /**
   * Create a new ResponseCache instance.
   *
   * @param ttlSeconds - Cache entry lifetime in seconds (default: 300 = 5 minutes).
   */
  constructor(ttlSeconds: number = 300) {
    this.cache = new Map();
    this.ttlMs = ttlSeconds * 1000;
  }

  /**
   * Generate a normalized cache key from a query string.
   * Lowercases, trims, collapses whitespace, then returns a truncated SHA-256 hex digest.
   *
   * @param input - The raw query string to hash.
   * @returns A 16-character hex string suitable for use as a cache key.
   */
  static generateKey(input: string): string {
    const normalized = input.toLowerCase().trim().replace(/\s+/g, ' ');
    return crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 16);
  }

  /**
   * Get a cached value. Returns null if not found or expired.
   *
   * @param key - The cache key to look up.
   * @returns The cached value, or `null` if the key is missing or expired.
   */
  get(key: string): T | null {
    this.cleanup();
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() >= entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  /**
   * Set a value in the cache.
   *
   * @param key - The cache key.
   * @param value - The value to store.
   */
  set(key: string, value: T): void {
    this.cleanup();
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  /** Remove expired entries to prevent memory leaks. */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (now >= entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /** Number of entries currently in the cache. */
  get size(): number {
    return this.cache.size;
  }

  /** Clear all cache entries. */
  clear(): void {
    this.cache.clear();
  }
}

/** Shared cache instance for chat responses (5-minute TTL). */
export const chatCache = new ResponseCache<string>(300);
