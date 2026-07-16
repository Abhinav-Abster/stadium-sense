import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { apiRateLimiter, getClientIp } from '@/lib/rate-limiter';
import { validateInput } from '@/lib/validation';
import type { RateLimitResult } from '@/lib/rate-limiter';

/** Maximum allowed request body size in bytes (50 KB). */
const MAX_BODY_SIZE = 50 * 1024;

/** Successful guard result containing parsed data and rate-limit metadata. */
export interface GuardSuccess<T> {
  ok: true;
  data: T;
  rateLimit: RateLimitResult;
}

/** Failed guard result containing a ready-to-return error response. */
export interface GuardFailure {
  ok: false;
  response: NextResponse;
}

/**
 * Run the standard API guard sequence on an incoming request.
 *
 * Performs, in order:
 * 1. Payload-size check (413 if exceeded)
 * 2. IP-based rate limiting (429 if exceeded)
 * 3. JSON body parsing (400 if malformed)
 * 4. Zod schema validation (400 if invalid)
 *
 * @param request - The incoming Next.js request
 * @param schema  - A Zod schema to validate the parsed body against
 * @returns A discriminated union: `GuardSuccess<T>` on success, `GuardFailure` on error
 */
export async function runApiGuards<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<GuardSuccess<T> | GuardFailure> {
  // 1. Payload-size check (DoS prevention)
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Payload too large' }, { status: 413 }),
    };
  }

  // 2. Rate limiting
  const ip = getClientIp(request);
  const rateLimit = apiRateLimiter.check(ip);
  if (!rateLimit.allowed) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetInSeconds),
            'X-RateLimit-Remaining': '0',
          },
        }
      ),
    };
  }

  // 3. JSON body parsing
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }),
    };
  }

  // 4. Zod schema validation
  const validation = validateInput(schema, body);
  if (!validation.success) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      ),
    };
  }

  return { ok: true, data: validation.data, rateLimit };
}
