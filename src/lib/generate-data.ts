/**
 * Simulated stadium occupancy data generator (library version).
 *
 * Derives its zone/capacity data directly from `stadium-data.ts` (the single
 * source of truth backed by `data/stadiums.json`) rather than maintaining a
 * separate hardcoded copy — so all 16 host stadiums get simulated occupancy,
 * not just a hardcoded subset.
 *
 * Uses a seeded PRNG for deterministic, reproducible output.
 */

import { stadiums } from './stadium-data';

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

/**
 * Generate simulated occupancy data for all 16 FIFA World Cup 2026 host stadiums.
 *
 * @param scenario - The simulation scenario to run
 * @param seed - Random seed for deterministic output (default: 42)
 * @returns Array of stadium occupancy data
 */
export function generateOccupancy(scenario: Scenario, seed: number = 42): StadiumOccupancy[] {
  const rand = seededRandom(seed);
  const results: StadiumOccupancy[] = [];

  for (const stadium of stadiums) {
    const zoneData: ZoneOccupancy[] = stadium.zones.map((zone) => {
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
      stadiumId: stadium.id,
      stadiumName: stadium.name,
      timestamp: new Date('2026-07-12T18:00:00Z').toISOString(),
      scenario,
      zones: zoneData,
    });
  }

  return results;
}