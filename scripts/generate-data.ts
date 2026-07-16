/**
 * CLI wrapper around the shared occupancy simulator.
 *
 * Generates deterministic, reproducible occupancy data for FIFA World Cup 2026 venues.
 * The actual generation logic (seeded PRNG, zone data, scenario rules) lives in
 * `src/lib/generate-data.ts` — this file only handles CLI argument parsing and
 * stdout output, so there is a single source of truth for the simulation.
 *
 * Usage:
 *   npx ts-node scripts/generate-data.ts [scenario]
 *
 * Scenarios:
 *   normal        — Typical match-day flow (50-75% capacity)
 *   halftime-rush — Halftime concourse congestion (zones spike to 80-95%)
 *   post-match    — Post-match exit (high density near exits, low elsewhere)
 *
 * Output: JSON to stdout
 */

import { generateOccupancy, type Scenario } from '../src/lib/generate-data';

const scenario = (process.argv[2] as Scenario) || 'normal';
const validScenarios: Scenario[] = ['normal', 'halftime-rush', 'post-match'];

if (!validScenarios.includes(scenario)) {
  console.error(`Invalid scenario: ${scenario}. Valid: ${validScenarios.join(', ')}`);
  process.exit(1);
}

const data = generateOccupancy(scenario);
// eslint-disable-next-line no-console -- CLI script: stdout output is intentional
console.log(JSON.stringify(data, null, 2));