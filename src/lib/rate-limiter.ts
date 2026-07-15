interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/** Result of a rate limit check. */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

/**
 * In-memory rate limiter. Limits requests per IP address within a time window.
 * Note: In production, use Redis/Upstash for distributed rate limiting.
 */
export class RateLimiter {
  private limits: Map<string, RateLimitEntry>;
  private maxRequests: number;
  private windowMs: number;

  /**
   * @param maxRequests Maximum requests allowed per window (default: 10)
   * @param windowSeconds Window duration in seconds (default: 60)
   */
  constructor(maxRequests: number = 10, windowSeconds: number = 60) {
    this.limits = new Map();
    this.maxRequests = maxRequests;
    this.windowMs = windowSeconds * 1000;
  }

  /** Check if a request from the given IP is allowed. */
  check(ip: string): RateLimitResult {
    this.cleanup();
    const now = Date.now();
    const entry = this.limits.get(ip);

    if (!entry || now >= entry.resetAt) {
      this.limits.set(ip, { count: 1, resetAt: now + this.windowMs });
      return { allowed: true, remaining: this.maxRequests - 1, resetInSeconds: Math.ceil(this.windowMs / 1000) };
    }

    if (entry.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetInSeconds: Math.ceil((entry.resetAt - now) / 1000),
      };
    }

    entry.count++;
    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetInSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  /** Remove expired entries to prevent memory leaks. */
  private cleanup(): void {
    const now = Date.now();
    for (const [ip, entry] of this.limits) {
      if (now >= entry.resetAt) {
        this.limits.delete(ip);
      }
    }
  }

  /** Reset all rate limit entries. Used in testing. */
  reset(): void {
    this.limits.clear();
  }
}

/**
 * Extract the client IP address from a Next.js request.
 * Checks X-Forwarded-For header first (for proxied requests), falls back to 127.0.0.1.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return '127.0.0.1';
}

/** Shared rate limiter instance for all API routes (10 requests/minute per IP). */
export const apiRateLimiter = new RateLimiter(10, 60);
