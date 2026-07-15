import { NextRequest, NextResponse } from 'next/server';
import { CrowdStatusInputSchema, validateInput } from '@/lib/validation';
import { apiRateLimiter, getClientIp } from '@/lib/rate-limiter';
import { generateResponse, crowdStatusResponseSchema } from '@/lib/gemini';
import { getCrowdStatusSystemPrompt, formatZoneDataForPrompt } from '@/lib/prompts';
import { getStadiumById } from '@/lib/stadium-data';
import { generateOccupancy } from '@/lib/generate-data';

/** Maximum allowed request body size in bytes (50KB). */
const MAX_BODY_SIZE = 50 * 1024;

/** Crowd status response type from Gemini. */
interface CrowdStatusResponse {
  summary: string;
  recommendation: string;
  alertLevel: 'low' | 'medium' | 'high';
}

/**
 * POST /api/crowd-status
 *
 * Crowd & operations insight endpoint.
 * Takes a stadium ID, generates simulated occupancy data, and asks Gemini
 * to produce a plain-language status summary with actionable recommendations.
 *
 * Covers: crowd management, operational intelligence, real-time decision support.
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

  const validation = validateInput(CrowdStatusInputSchema, body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.errors },
      { status: 400 }
    );
  }

  const { stadiumId } = validation.data;

  // 4. Look up stadium
  const stadium = getStadiumById(stadiumId);
  if (!stadium) {
    return NextResponse.json({ error: 'Stadium not found' }, { status: 404 });
  }

  // 5. Generate simulated occupancy data
  // Uses a random scenario to simulate real-time variation
  const scenarios = ['normal', 'halftime-rush', 'post-match'] as const;
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  const allData = generateOccupancy(scenario);
  const stadiumData = allData.find((s) => s.stadiumId === stadiumId);

  if (!stadiumData) {
    // Fallback: generate generic zone data from the stadium's zones
    const fallbackZones = stadium.zones.map((z) => ({
      name: z.name,
      currentOccupancy: Math.round(z.capacity * (0.5 + Math.random() * 0.4)),
      capacity: z.capacity,
    }));
    const zoneText = formatZoneDataForPrompt(fallbackZones);
    const systemPrompt = getCrowdStatusSystemPrompt();
    const result = await generateResponse<CrowdStatusResponse>(
      systemPrompt,
      `Stadium: ${stadium.name}\nCurrent zone occupancy:\n${zoneText}`,
      crowdStatusResponseSchema
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to generate crowd analysis.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ...result,
      zones: fallbackZones,
      scenario: 'dynamic',
      timestamp: new Date().toISOString(),
    });
  }

  // 6. Format zone data and call Gemini
  const zoneText = formatZoneDataForPrompt(
    stadiumData.zones.map((z) => ({
      name: z.zoneName,
      currentOccupancy: z.currentOccupancy,
      capacity: z.capacity,
    }))
  );

  const systemPrompt = getCrowdStatusSystemPrompt();
  const result = await generateResponse<CrowdStatusResponse>(
    systemPrompt,
    `Stadium: ${stadium.name}\nScenario: ${scenario}\nCurrent zone occupancy:\n${zoneText}`,
    crowdStatusResponseSchema
  );

  if (!result) {
    return NextResponse.json(
      { error: 'Failed to generate crowd analysis.' },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      ...result,
      zones: stadiumData.zones,
      scenario,
      timestamp: stadiumData.timestamp,
    },
    {
      status: 200,
      headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
    }
  );
}
