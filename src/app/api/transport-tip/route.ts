import { NextRequest, NextResponse } from 'next/server';
import { TransportTipInputSchema, validateInput } from '@/lib/validation';
import { apiRateLimiter, getClientIp } from '@/lib/rate-limiter';
import { generateResponse, transportTipResponseSchema } from '@/lib/gemini';
import { getTransportTipSystemPrompt, formatTransportPromptContent } from '@/lib/prompts';
import { getStadiumById, getStadiumContextForPrompt } from '@/lib/stadium-data';

/** Maximum allowed request body size in bytes (50KB). */
const MAX_BODY_SIZE = 50 * 1024;

/** Transport tip response type from Gemini. */
interface TransportTipResponse {
  suggestion: string;
  estimatedCO2Saving: string;
}

/**
 * POST /api/transport-tip
 *
 * Sustainability transport tip endpoint.
 * Given a fan's starting location and a stadium, returns a sustainable travel
 * suggestion (public transit/shuttle) with an estimated CO2 saving.
 *
 * Covers: sustainability, transportation.
 */
export async function POST(request: NextRequest) {
  // 1. Check payload size
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
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
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const validation = validateInput(TransportTipInputSchema, body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.errors },
      { status: 400 }
    );
  }

  const { origin, stadiumId } = validation.data;

  // 4. Look up stadium
  const stadium = getStadiumById(stadiumId);
  if (!stadium) {
    return NextResponse.json({ error: 'Stadium not found' }, { status: 404 });
  }

  // 5. Build prompt and call Gemini
  const stadiumContext = getStadiumContextForPrompt(stadium);
  const systemPrompt = getTransportTipSystemPrompt();
  const userContent = formatTransportPromptContent(origin, stadiumContext);

  const result = await generateResponse<TransportTipResponse>(
    systemPrompt,
    userContent,
    transportTipResponseSchema
  );

  if (!result) {
    return NextResponse.json(
      { error: 'Failed to generate transport tip.' },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      suggestion: result.suggestion,
      estimatedCO2Saving: result.estimatedCO2Saving,
      stadiumName: stadium.name,
    },
    {
      status: 200,
      headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
    }
  );
}
