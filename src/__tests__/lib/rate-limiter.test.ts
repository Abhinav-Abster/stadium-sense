import { RateLimiter } from '@/lib/rate-limiter';

describe('RateLimiter', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    // 5 requests max, 2 seconds window for testing
    limiter = new RateLimiter(5, 2);
  });

  it('should allow requests within limit', () => {
    const ip = '192.168.1.1';
    for (let i = 0; i < 5; i++) {
      const res = limiter.check(ip);
      expect(res.allowed).toBe(true);
      expect(res.remaining).toBe(4 - i);
    }
  });

  it('should block requests exceeding limit', () => {
    const ip = '192.168.1.2';
    // Exhaust the 5 allowed requests
    for (let i = 0; i < 5; i++) {
      limiter.check(ip);
    }

    // 6th request should be blocked
    const blockedRes = limiter.check(ip);
    expect(blockedRes.allowed).toBe(false);
    expect(blockedRes.remaining).toBe(0);
    expect(blockedRes.resetInSeconds).toBeGreaterThan(0);
  });

  it('should reset limits after window expires', async () => {
    const ip = '192.168.1.3';

    // Exhaust requests
    for (let i = 0; i < 5; i++) {
      limiter.check(ip);
    }

    expect(limiter.check(ip).allowed).toBe(false);

    // Wait 2.1 seconds for window to clear
    await new Promise((resolve) => setTimeout(resolve, 2100));

    // Should be allowed again
    const res = limiter.check(ip);
    expect(res.allowed).toBe(true);
    expect(res.remaining).toBe(4);
  });

  it('should maintain independent limits per IP', () => {
    const ip1 = '192.168.1.4';
    const ip2 = '192.168.1.5';

    for (let i = 0; i < 5; i++) {
      limiter.check(ip1);
    }

    expect(limiter.check(ip1).allowed).toBe(false);
    expect(limiter.check(ip2).allowed).toBe(true); // ip2 remains unaffected
  });
});
