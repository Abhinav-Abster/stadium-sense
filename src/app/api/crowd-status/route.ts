import { runApiGuards } from '@/lib/api-guard';
import { generateResponse } from '@/lib/gemini';
import { generateOccupancy } from '@/lib/generate-data';
import { formatZoneDataForPrompt, getCrowdStatusSystemPrompt } from '@/lib/prompts';
import { CrowdStatusResponseSchema, crowdStatusGeminiSchema } from '@/lib/schemas';
import { getStadiumById } from '@/lib/stadium-data';
import { CrowdStatusInputSchema } from '@/lib/validation';
import { NextRequest, NextResponse } from 'next/server';

/** Normalised zone shape used by both simulated and fallback paths. */
interface NormalisedZone {
  zoneId: string;
  name: string;
  currentOccupancy: number;
  capacity: number;
}

function createZoneId(name: string, index: number): string {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`;
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
  const guard = await runApiGuards(request, CrowdStatusInputSchema);
  if (!guard.ok) return guard.response;

  const { stadiumId } = guard.data;

  // Look up stadium
  const stadium = getStadiumById(stadiumId);
  if (!stadium) {
    return NextResponse.json({ error: 'Stadium not found' }, { status: 404 });
  }

  // Generate simulated occupancy — pick a random scenario for realism
  const scenarios = ['normal', 'halftime-rush', 'post-match'] as const;
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  const allData = generateOccupancy(scenario);
  const stadiumData = allData.find((s) => s.stadiumId === stadiumId);

  // Normalise zones into a single shape regardless of data source
  const zones: NormalisedZone[] = stadiumData
    ? stadiumData.zones.map((z, index) => ({
        zoneId: createZoneId(z.zoneName, index),
        name: z.zoneName,
        currentOccupancy: z.currentOccupancy,
        capacity: z.capacity,
      }))
    : stadium.zones.map((z, index) => ({
        zoneId: createZoneId(z.name, index),
        name: z.name,
        currentOccupancy: Math.round(z.capacity * (0.5 + Math.random() * 0.4)),
        capacity: z.capacity,
      }));

  const activeScenario = stadiumData ? scenario : 'dynamic';
  const timestamp = stadiumData ? stadiumData.timestamp : new Date().toISOString();

  // Single Gemini call site — no duplication
  const zoneText = formatZoneDataForPrompt(zones);
  const systemPrompt = getCrowdStatusSystemPrompt();
  const result = await generateResponse(
    systemPrompt,
    `Stadium: ${stadium.name}\nScenario: ${activeScenario}\nCurrent zone occupancy:\n${zoneText}`,
    crowdStatusGeminiSchema,
    CrowdStatusResponseSchema
  );

  if (!result) {
    return NextResponse.json({ error: 'Failed to generate crowd analysis.' }, { status: 502 });
  }

  return NextResponse.json(
    { ...result, zones, scenario: activeScenario, timestamp },
    { status: 200, headers: { 'X-RateLimit-Remaining': String(guard.rateLimit.remaining) } }
  );
}
