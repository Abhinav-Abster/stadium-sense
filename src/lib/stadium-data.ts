/**
 * FIFA World Cup 2026 Stadium Data
 *
 * Interfaces, typed accessors, and prompt formatters for all 16 host venues.
 * Raw venue data is stored in `./data/stadiums.json` for maintainability.
 */

import rawStadiums from './data/stadiums.json';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

/** A physical entry/exit gate at the stadium. */
export interface Gate {
  /** Unique gate identifier (e.g. "metlife-gate-a"). */
  id: string;
  /** Human-readable gate name (e.g. "Gate A – West Entrance"). */
  name: string;
  /** Whether this gate has wheelchair-accessible entry. */
  accessible: boolean;
  /** Nearby facilities visitors can find at or near this gate. */
  nearbyFacilities: string[];
}

/** A seating or functional zone within the stadium. */
export interface Zone {
  /** Unique zone identifier. */
  id: string;
  /** Display name (e.g. "Lower Bowl – North"). */
  name: string;
  /** Approximate seating capacity of this zone. */
  capacity: number;
  /** Short description of the zone's location or purpose. */
  description: string;
}

/** An on-site facility or service point. */
export interface Facility {
  /** Category of the facility. */
  type:
    | 'nursing_room'
    | 'wheelchair_entrance'
    | 'quiet_zone'
    | 'first_aid'
    | 'restroom'
    | 'food_court';
  /** Facility name. */
  name: string;
  /** ID of the nearest gate. */
  nearGate: string;
  /** Short description of the facility. */
  description: string;
}

/** A transport link serving the stadium. */
export interface TransportOption {
  /** Mode of transport. */
  type: 'metro' | 'bus' | 'shuttle' | 'train' | 'parking';
  /** Name of the service or lot (e.g. "NJ Transit – Meadowlands Rail"). */
  name: string;
  /** ID of the nearest gate. */
  nearGate: string;
  /** Estimated walk time in minutes from the stop/lot to the gate. */
  estimatedWalkMinutes: number;
}

/** A FIFA World Cup 2026 host stadium. */
export interface Stadium {
  /** Unique stadium identifier (kebab-case). */
  id: string;
  /** Official stadium name. */
  name: string;
  /** Host city. */
  city: string;
  /** Host country. */
  country: string;
  /** Total stadium capacity. */
  capacity: number;
  /** Entry/exit gates. */
  gates: Gate[];
  /** Seating / functional zones. */
  zones: Zone[];
  /** On-site facilities. */
  facilities: Facility[];
  /** Transport options serving the venue. */
  transport: TransportOption[];
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

/** All 16 FIFA World Cup 2026 host stadiums. */
export const stadiums: Stadium[] = rawStadiums as Stadium[];

// ---------------------------------------------------------------------------
// Accessors
// ---------------------------------------------------------------------------

/**
 * Find a stadium by its unique ID.
 *
 * @param id - The kebab-case stadium identifier (e.g. `"metlife-stadium"`).
 * @returns The matching `Stadium` object, or `undefined` if not found.
 */
export function getStadiumById(id: string): Stadium | undefined {
  return stadiums.find((s) => s.id === id);
}

/**
 * Format stadium data into a readable context string for use in Gemini prompts.
 *
 * Produces a structured, human-readable text block summarising the stadium's
 * gates, zones, facilities, and transport options.
 *
 * @param stadium - The stadium to format.
 * @returns A multi-line plain-text summary of the stadium.
 */
export function getStadiumContextForPrompt(stadium: Stadium): string {
  const lines: string[] = [];

  lines.push(`=== ${stadium.name} ===`);
  lines.push(
    `Location: ${stadium.city}, ${stadium.country} | Capacity: ${stadium.capacity.toLocaleString()}`
  );
  lines.push('');

  lines.push('GATES:');
  for (const gate of stadium.gates) {
    const accessible = gate.accessible ? '\u267F Accessible' : 'Not wheelchair-accessible';
    lines.push(`  \u2022 ${gate.name} (${accessible})`);
    if (gate.nearbyFacilities.length > 0) {
      lines.push(`    Nearby: ${gate.nearbyFacilities.join(', ')}`);
    }
  }
  lines.push('');

  lines.push('ZONES:');
  for (const zone of stadium.zones) {
    lines.push(`  \u2022 ${zone.name} \u2014 Capacity: ${zone.capacity.toLocaleString()}`);
    lines.push(`    ${zone.description}`);
  }
  lines.push('');

  lines.push('FACILITIES:');
  for (const facility of stadium.facilities) {
    const typeLabel = facility.type.replace(/_/g, ' ').toUpperCase();
    lines.push(`  \u2022 [${typeLabel}] ${facility.name}`);
    lines.push(`    Near gate: ${facility.nearGate}`);
    lines.push(`    ${facility.description}`);
  }
  lines.push('');

  lines.push('TRANSPORT:');
  for (const option of stadium.transport) {
    const modeLabel = option.type.toUpperCase();
    lines.push(
      `  \u2022 [${modeLabel}] ${option.name} \u2014 ~${option.estimatedWalkMinutes} min walk to ${option.nearGate}`
    );
  }

  return lines.join('\n');
}
