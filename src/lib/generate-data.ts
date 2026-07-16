/**
 * Simulated stadium occupancy data generator (library version).
 *
 * This module exports the same generation logic as scripts/generate-data.ts
 * but without the CLI entry point, for use in API routes and tests.
 *
 * Uses a seeded PRNG for deterministic, reproducible output.
 */

/** Simple seeded PRNG (mulberry32) for deterministic output. */
function seededRandom(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Simulated occupancy for a single zone. */
export interface ZoneOccupancy {
  zoneId: string;
  zoneName: string;
  currentOccupancy: number;
  capacity: number;
  percentFull: number;
}

/** Simulated occupancy for an entire stadium. */
export interface StadiumOccupancy {
  stadiumId: string;
  stadiumName: string;
  timestamp: string;
  scenario: string;
  zones: ZoneOccupancy[];
}

/** Supported simulation scenarios. */
export type Scenario = 'normal' | 'halftime-rush' | 'post-match';

/** Base zone data for key stadiums. */
const stadiumZones: Record<string, { id: string; name: string; capacity: number }[]> = {
  'metlife-stadium': [
    { id: 'north', name: 'North Stand', capacity: 20000 },
    { id: 'south', name: 'South Stand', capacity: 20000 },
    { id: 'east', name: 'East Stand', capacity: 18000 },
    { id: 'west', name: 'West Stand', capacity: 18000 },
    { id: 'vip', name: 'VIP Suites', capacity: 6000 },
    { id: 'general', name: 'General Concourse', capacity: 5000 },
  ],
  'sofi-stadium': [
    { id: 'north', name: 'North End', capacity: 18000 },
    { id: 'south', name: 'South End', capacity: 18000 },
    { id: 'east', name: 'East Upper', capacity: 15000 },
    { id: 'west', name: 'West Upper', capacity: 15000 },
    { id: 'club', name: 'Club Level', capacity: 8000 },
    { id: 'field', name: 'Field Level', capacity: 6000 },
  ],
  'estadio-azteca': [
    { id: 'norte', name: 'Tribuna Norte', capacity: 22000 },
    { id: 'sur', name: 'Tribuna Sur', capacity: 22000 },
    { id: 'oriente', name: 'Tribuna Oriente', capacity: 20000 },
    { id: 'poniente', name: 'Tribuna Poniente', capacity: 20000 },
    { id: 'palcos', name: 'Palcos VIP', capacity: 3000 },
  ],
  'hard-rock-stadium': [
    { id: 'north', name: 'North Terrace', capacity: 17000 },
    { id: 'south', name: 'South Terrace', capacity: 17000 },
    { id: 'east', name: 'East Club', capacity: 14000 },
    { id: 'west', name: 'West Club', capacity: 14000 },
    { id: 'vip', name: 'VIP Deck', capacity: 5000 },
    { id: 'concourse', name: 'Main Concourse', capacity: 4000 },
  ],
  'bc-place': [
    { id: 'north', name: 'North Bowl', capacity: 14000 },
    { id: 'south', name: 'South Bowl', capacity: 14000 },
    { id: 'east', name: 'East Wing', capacity: 12000 },
    { id: 'west', name: 'West Wing', capacity: 12000 },
    { id: 'club', name: 'Club Seats', capacity: 3000 },
  ],
};

/**
 * Generate simulated occupancy data for all tracked stadiums.
 *
 * @param scenario - The simulation scenario to run
 * @param seed - Random seed for deterministic output (default: 42)
 * @returns Array of stadium occupancy data
 */
export function generateOccupancy(scenario: Scenario, seed: number = 42): StadiumOccupancy[] {
  const rand = seededRandom(seed);
  const results: StadiumOccupancy[] = [];

  const stadiumNames: Record<string, string> = {
    'metlife-stadium': 'MetLife Stadium',
    'sofi-stadium': 'SoFi Stadium',
    'estadio-azteca': 'Estadio Azteca',
    'hard-rock-stadium': 'Hard Rock Stadium',
    'bc-place': 'BC Place',
  };

  for (const [stadiumId, zones] of Object.entries(stadiumZones)) {
    const zoneData: ZoneOccupancy[] = zones.map((zone) => {
      let occupancyRate: number;

      switch (scenario) {
        case 'normal':
          occupancyRate = 0.5 + rand() * 0.25; // 50-75%
          break;
        case 'halftime-rush':
          if (
            zone.id.includes('concourse') ||
            zone.id.includes('general') ||
            zone.id.includes('club')
          ) {
            occupancyRate = 0.8 + rand() * 0.15; // 80-95%
          } else {
            occupancyRate = 0.4 + rand() * 0.2; // 40-60%
          }
          break;
        case 'post-match':
          if (
            zone.id.includes('south') ||
            zone.id.includes('concourse') ||
            zone.id.includes('sur')
          ) {
            occupancyRate = 0.85 + rand() * 0.12; // 85-97%
          } else {
            occupancyRate = 0.15 + rand() * 0.25; // 15-40%
          }
          break;
      }

      const currentOccupancy = Math.round(zone.capacity * occupancyRate);
      return {
        zoneId: zone.id,
        zoneName: zone.name,
        currentOccupancy,
        capacity: zone.capacity,
        percentFull: Math.round(occupancyRate * 100),
      };
    });

    results.push({
      stadiumId,
      stadiumName: stadiumNames[stadiumId],
      timestamp: new Date('2026-07-12T18:00:00Z').toISOString(),
      scenario,
      zones: zoneData,
    });
  }

  return results;
}
