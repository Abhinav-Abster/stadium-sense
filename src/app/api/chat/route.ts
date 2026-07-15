import { NextRequest, NextResponse } from 'next/server';
import { ChatInputSchema, validateInput } from '@/lib/validation';
import { apiRateLimiter, getClientIp } from '@/lib/rate-limiter';
import { ResponseCache, chatCache } from '@/lib/cache';
import { generateResponse, chatResponseSchema } from '@/lib/gemini';
import { getChatSystemPrompt } from '@/lib/prompts';
import { getStadiumById, getStadiumContextForPrompt } from '@/lib/stadium-data';

/** Maximum allowed request body size in bytes (50KB). */
const MAX_BODY_SIZE = 50 * 1024;

/** Chat response type from Gemini. */
interface ChatResponse {
  reply: string;
  language: string;
}

/**
 * POST /api/chat
 *
 * Multilingual navigation & accessibility assistant.
 * Accepts a fan's question and returns an AI-generated answer in the same language.
 *
 * Security: Input validated via Zod, rate-limited per IP, system/user prompts separated,
 * payload size checked, no PII persisted.
 */
export async function POST(request: NextRequest) {
  // 1. Check payload size (DoS prevention)
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
    return NextResponse.json(
      { error: 'Payload too large' },
      { status: 413 }
    );
  }

  // 2. Rate limiting
  const ip = getClientIp(request);
  const rateLimit = apiRateLimiter.check(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.resetInSeconds),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  // 3. Parse and validate input
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const validation = validateInput(ChatInputSchema, body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.errors },
      { status: 400 }
    );
  }

  const { message, stadiumId } = validation.data;

  // 4. Look up stadium data
  const stadium = getStadiumById(stadiumId);
  if (!stadium) {
    return NextResponse.json(
      { error: 'Stadium not found' },
      { status: 404 }
    );
  }

  // 5. Check cache for repeated queries
  const cacheKey = ResponseCache.generateKey(`${stadiumId}:${message}`);
  const cached = chatCache.get(cacheKey);
  if (cached) {
    return NextResponse.json(
      { reply: cached, language: 'cached', cached: true },
      {
        status: 200,
        headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
      }
    );
  }

  // 6. Build prompt and call Gemini (system and user content kept separate)
  const stadiumContext = getStadiumContextForPrompt(stadium);
  const systemPrompt = getChatSystemPrompt(stadiumContext);

  const result = await generateResponse<ChatResponse>(
    systemPrompt,
    message,
    chatResponseSchema
  );

  if (!result) {
    return NextResponse.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 502 }
    );
  }

  // 7. Cache the response
  chatCache.set(cacheKey, result.reply);

  // 8. Return response (no PII logged or persisted)
  return NextResponse.json(
    { reply: result.reply, language: result.language, cached: false },
    {
      status: 200,
      headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
    }
  );
}
