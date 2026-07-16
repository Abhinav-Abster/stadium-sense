import { NextRequest, NextResponse } from 'next/server';
import { TransportTipInputSchema } from '@/lib/validation';
import { runApiGuards } from '@/lib/api-guard';
import { generateResponse } from '@/lib/gemini';
import { TransportTipResponseSchema, transportTipGeminiSchema } from '@/lib/schemas';
import { getTransportTipSystemPrompt, formatTransportPromptContent } from '@/lib/prompts';
import { getStadiumById, getStadiumContextForPrompt } from '@/lib/stadium-data';

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
  const guard = await runApiGuards(request, TransportTipInputSchema);
  if (!guard.ok) return guard.response;

  const { origin, stadiumId } = guard.data;

  // Look up stadium
  const stadium = getStadiumById(stadiumId);
  if (!stadium) {
    return NextResponse.json({ error: 'Stadium not found' }, { status: 404 });
  }

  // Build prompt and call Gemini
  const stadiumContext = getStadiumContextForPrompt(stadium);
  const systemPrompt = getTransportTipSystemPrompt();
  const userContent = formatTransportPromptContent(origin, stadiumContext);

  const result = await generateResponse(
    systemPrompt,
    userContent,
    transportTipGeminiSchema,
    TransportTipResponseSchema
  );

  if (!result) {
    return NextResponse.json({ error: 'Failed to generate transport tip.' }, { status: 502 });
  }

  return NextResponse.json(
    {
      suggestion: result.suggestion,
      estimatedCO2Saving: result.estimatedCO2Saving,
      stadiumName: stadium.name,
    },
    { status: 200, headers: { 'X-RateLimit-Remaining': String(guard.rateLimit.remaining) } }
  );
}
