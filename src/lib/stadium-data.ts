/**
 * FIFA World Cup 2026 Stadium Data
 *
 * Static venue data for all 16 host stadiums across the United States,
 * Mexico, and Canada. Includes gates, zones, facilities, and transport
 * options for each venue.
 */

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
    | "nursing_room"
    | "wheelchair_entrance"
    | "quiet_zone"
    | "first_aid"
    | "restroom"
    | "food_court";
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
  type: "metro" | "bus" | "shuttle" | "train" | "parking";
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
// Stadium Data
// ---------------------------------------------------------------------------

/** All 16 FIFA World Cup 2026 host stadiums. */
export const stadiums: Stadium[] = [
  // ==========================================================================
  // KEY STADIUM 1 – MetLife Stadium (Full Detail)
  // ==========================================================================
  {
    id: "metlife-stadium",
    name: "MetLife Stadium",
    city: "East Rutherford, NJ",
    country: "USA",
    capacity: 82500,
    gates: [
      {
        id: "metlife-gate-a",
        name: "Gate A – West Mezzanine",
        accessible: true,
        nearbyFacilities: ["First Aid Station", "Wheelchair Services"],
      },
      {
        id: "metlife-gate-b",
        name: "Gate B – East Mezzanine",
        accessible: true,
        nearbyFacilities: ["Restrooms", "Food Court"],
      },
      {
        id: "metlife-gate-c",
        name: "Gate C – North Club",
        accessible: false,
        nearbyFacilities: ["VIP Lounge", "Quiet Zone"],
      },
      {
        id: "metlife-gate-d",
        name: "Gate D – South Club",
        accessible: true,
        nearbyFacilities: ["Nursing Room", "Family Services"],
      },
      {
        id: "metlife-gate-e",
        name: "Gate E – Upper West",
        accessible: false,
        nearbyFacilities: ["Restrooms"],
      },
      {
        id: "metlife-gate-f",
        name: "Gate F – Upper East",
        accessible: true,
        nearbyFacilities: ["First Aid", "Restrooms", "Food Court"],
      },
    ],
    zones: [
      {
        id: "metlife-zone-lower-west",
        name: "Lower Bowl – West",
        capacity: 18000,
        description: "Lower-level seating along the west sideline.",
      },
      {
        id: "metlife-zone-lower-east",
        name: "Lower Bowl – East",
        capacity: 18000,
        description: "Lower-level seating along the east sideline.",
      },
      {
        id: "metlife-zone-mezzanine",
        name: "Mezzanine Level",
        capacity: 15000,
        description: "Mid-level wrap-around seating with premium sight lines.",
      },
      {
        id: "metlife-zone-upper",
        name: "Upper Deck",
        capacity: 22000,
        description: "Upper-tier seating circling the entire bowl.",
      },
      {
        id: "metlife-zone-club",
        name: "Club Level",
        capacity: 6500,
        description:
          "Climate-controlled club seating with exclusive concourse access.",
      },
      {
        id: "metlife-zone-suites",
        name: "Suite Level",
        capacity: 3000,
        description: "Private luxury suites with dedicated service.",
      },
    ],
    facilities: [
      {
        type: "first_aid",
        name: "West First Aid Station",
        nearGate: "metlife-gate-a",
        description:
          "Full first-aid station staffed by EMTs, located on the mezzanine concourse.",
      },
      {
        type: "nursing_room",
        name: "Family Nursing Suite",
        nearGate: "metlife-gate-d",
        description:
          "Private nursing room with changing tables and comfortable seating.",
      },
      {
        type: "wheelchair_entrance",
        name: "ADA Accessible Entry – West",
        nearGate: "metlife-gate-a",
        description:
          "Fully accessible entrance with ramp access and companion seating nearby.",
      },
      {
        type: "quiet_zone",
        name: "Sensory Room – North",
        nearGate: "metlife-gate-c",
        description:
          "Low-stimulation room for guests with sensory sensitivities.",
      },
      {
        type: "food_court",
        name: "MetLife Eats – East Concourse",
        nearGate: "metlife-gate-b",
        description:
          "Main food court featuring local NJ/NY vendors and halal, kosher, and vegan options.",
      },
    ],
    transport: [
      {
        type: "train",
        name: "NJ Transit – Meadowlands Rail Line",
        nearGate: "metlife-gate-a",
        estimatedWalkMinutes: 8,
      },
      {
        type: "bus",
        name: "NJ Transit Bus 160 (Port Authority – Meadowlands)",
        nearGate: "metlife-gate-b",
        estimatedWalkMinutes: 10,
      },
      {
        type: "shuttle",
        name: "FIFA Fan Shuttle – Secaucus Junction",
        nearGate: "metlife-gate-a",
        estimatedWalkMinutes: 3,
      },
      {
        type: "parking",
        name: "Meadowlands Parking Lots (K, L, G)",
        nearGate: "metlife-gate-e",
        estimatedWalkMinutes: 12,
      },
    ],
  },

  // ==========================================================================
  // KEY STADIUM 2 – SoFi Stadium (Full Detail)
  // ==========================================================================
  {
    id: "sofi-stadium",
    name: "SoFi Stadium",
    city: "Inglewood, CA",
    country: "USA",
    capacity: 70240,
    gates: [
      {
        id: "sofi-gate-a",
        name: "Gate A – West Plaza",
        accessible: true,
        nearbyFacilities: ["Wheelchair Services", "Restrooms"],
      },
      {
        id: "sofi-gate-b",
        name: "Gate B – East VIP",
        accessible: true,
        nearbyFacilities: ["VIP Lounge", "First Aid"],
      },
      {
        id: "sofi-gate-c",
        name: "Gate C – North End Zone",
        accessible: false,
        nearbyFacilities: ["Food Court", "Merchandise"],
      },
      {
        id: "sofi-gate-d",
        name: "Gate D – South Terrace",
        accessible: true,
        nearbyFacilities: ["Nursing Room", "Quiet Zone"],
      },
      {
        id: "sofi-gate-e",
        name: "Gate E – Hollywood Park Promenade",
        accessible: false,
        nearbyFacilities: ["Restrooms", "ATM"],
      },
      {
        id: "sofi-gate-f",
        name: "Gate F – Lake Park Entry",
        accessible: true,
        nearbyFacilities: ["Accessibility Desk", "Information Booth"],
      },
    ],
    zones: [
      {
        id: "sofi-zone-lower-bowl",
        name: "Lower Bowl",
        capacity: 17000,
        description: "Field-level seating surrounding the pitch.",
      },
      {
        id: "sofi-zone-club",
        name: "SoFi Club Level",
        capacity: 7500,
        description:
          "Premium mid-level seating with indoor/outdoor lounge access.",
      },
      {
        id: "sofi-zone-upper-c100",
        name: "C100 Upper Concourse",
        capacity: 12000,
        description: "Upper concourse seating with panoramic field views.",
      },
      {
        id: "sofi-zone-terrace",
        name: "Terrace Level",
        capacity: 15000,
        description: "Elevated terrace seating on the south side.",
      },
      {
        id: "sofi-zone-suites",
        name: "Luxury Suites",
        capacity: 3500,
        description:
          "260+ private suites with dedicated catering and A/V systems.",
      },
      {
        id: "sofi-zone-standing",
        name: "Standing Section – North",
        capacity: 5000,
        description: "Fan-zone standing area behind the north goal.",
      },
    ],
    facilities: [
      {
        type: "first_aid",
        name: "East Medical Station",
        nearGate: "sofi-gate-b",
        description:
          "Staffed medical station with AED equipment on the main concourse.",
      },
      {
        type: "nursing_room",
        name: "South Family Room",
        nearGate: "sofi-gate-d",
        description:
          "Private nursing and family care room with baby-changing stations.",
      },
      {
        type: "wheelchair_entrance",
        name: "ADA Entry – West Plaza",
        nearGate: "sofi-gate-a",
        description:
          "Level-grade accessible entry with elevator access to all tiers.",
      },
      {
        type: "quiet_zone",
        name: "Sensory Suite – South Terrace",
        nearGate: "sofi-gate-d",
        description:
          "Calming space with dimmable lights and noise-cancelling headphones available.",
      },
      {
        type: "food_court",
        name: "Hollywood Park Food Hall",
        nearGate: "sofi-gate-e",
        description:
          "Multi-vendor food hall with LA-inspired cuisine, vegan, and gluten-free options.",
      },
    ],
    transport: [
      {
        type: "metro",
        name: "LA Metro K Line – Downtown Inglewood Station",
        nearGate: "sofi-gate-a",
        estimatedWalkMinutes: 15,
      },
      {
        type: "shuttle",
        name: "FIFA Fan Shuttle – LAX / Union Station",
        nearGate: "sofi-gate-f",
        estimatedWalkMinutes: 4,
      },
      {
        type: "bus",
        name: "Metro Rapid 740 (Crenshaw Blvd)",
        nearGate: "sofi-gate-c",
        estimatedWalkMinutes: 12,
      },
      {
        type: "parking",
        name: "Hollywood Park Parking Structure (Pink Zone)",
        nearGate: "sofi-gate-e",
        estimatedWalkMinutes: 8,
      },
    ],
  },

  // ==========================================================================
  // KEY STADIUM 3 – Estadio Azteca (Full Detail)
  // ==========================================================================
  {
    id: "estadio-azteca",
    name: "Estadio Azteca",
    city: "Mexico City",
    country: "Mexico",
    capacity: 87523,
    gates: [
      {
        id: "azteca-gate-1",
        name: "Puerta 1 – Entrada Principal",
        accessible: true,
        nearbyFacilities: [
          "Wheelchair Ramp",
          "Information Booth",
          "First Aid",
        ],
      },
      {
        id: "azteca-gate-2",
        name: "Puerta 2 – Acceso Norte",
        accessible: false,
        nearbyFacilities: ["Restrooms", "Merchandise"],
      },
      {
        id: "azteca-gate-3",
        name: "Puerta 3 – Acceso Sur",
        accessible: true,
        nearbyFacilities: ["Nursing Room", "Restrooms"],
      },
      {
        id: "azteca-gate-4",
        name: "Puerta 4 – Tribuna Este",
        accessible: false,
        nearbyFacilities: ["Food Court"],
      },
      {
        id: "azteca-gate-5",
        name: "Puerta 5 – Zona VIP Oeste",
        accessible: true,
        nearbyFacilities: ["VIP Lounge", "Quiet Zone", "First Aid"],
      },
    ],
    zones: [
      {
        id: "azteca-zone-platea",
        name: "Platea (Lower Tier)",
        capacity: 28000,
        description:
          "Closest seating to the pitch, wrapping around the entire lower bowl.",
      },
      {
        id: "azteca-zone-preferente",
        name: "Preferente (Mid Tier)",
        capacity: 22000,
        description:
          "Mid-level seating with excellent central sight lines on the west side.",
      },
      {
        id: "azteca-zone-cabecera-norte",
        name: "Cabecera Norte",
        capacity: 12000,
        description: "North end zone seating behind the goal.",
      },
      {
        id: "azteca-zone-cabecera-sur",
        name: "Cabecera Sur",
        capacity: 12000,
        description: "South end zone seating behind the goal.",
      },
      {
        id: "azteca-zone-palcos",
        name: "Palcos (Luxury Boxes)",
        capacity: 4000,
        description: "Premium box suites along the west and east sidelines.",
      },
      {
        id: "azteca-zone-general",
        name: "General (Upper Tier)",
        capacity: 9523,
        description: "Uppermost seating with panoramic views of the pitch.",
      },
    ],
    facilities: [
      {
        type: "first_aid",
        name: "Cruz Roja Station – Main Entrance",
        nearGate: "azteca-gate-1",
        description:
          "Red Cross staffed medical station at the main concourse level.",
      },
      {
        type: "nursing_room",
        name: "Sala de Lactancia – Sur",
        nearGate: "azteca-gate-3",
        description:
          "Private nursing room located near the south access tunnel.",
      },
      {
        type: "wheelchair_entrance",
        name: "Acceso Inclusivo – Puerta 1",
        nearGate: "azteca-gate-1",
        description:
          "Main accessible entrance with ramps and dedicated companion seating areas.",
      },
      {
        type: "quiet_zone",
        name: "Zona de Calma – VIP Oeste",
        nearGate: "azteca-gate-5",
        description:
          "Low-stimulation area within the VIP west concourse for sensory-sensitive guests.",
      },
      {
        type: "food_court",
        name: "Plaza Gastronómica – Norte",
        nearGate: "azteca-gate-2",
        description:
          "Open-air food plaza featuring Mexican street food, international cuisine, and vegetarian options.",
      },
    ],
    transport: [
      {
        type: "metro",
        name: "Metro Línea 2 – Estación Azteca",
        nearGate: "azteca-gate-1",
        estimatedWalkMinutes: 10,
      },
      {
        type: "bus",
        name: "Metrobús Línea 1 – Estadio Azteca",
        nearGate: "azteca-gate-3",
        estimatedWalkMinutes: 7,
      },
      {
        type: "shuttle",
        name: "FIFA Fan Shuttle – Zócalo / Reforma",
        nearGate: "azteca-gate-1",
        estimatedWalkMinutes: 4,
      },
      {
        type: "parking",
        name: "Estacionamiento Azteca (Lotes A, B, C)",
        nearGate: "azteca-gate-4",
        estimatedWalkMinutes: 10,
      },
    ],
  },

  // ==========================================================================
  // KEY STADIUM 4 – Hard Rock Stadium (Full Detail)
  // ==========================================================================
  {
    id: "hard-rock-stadium",
    name: "Hard Rock Stadium",
    city: "Miami Gardens, FL",
    country: "USA",
    capacity: 64767,
    gates: [
      {
        id: "hardrock-gate-a",
        name: "Gate A – Northwest Entry",
        accessible: true,
        nearbyFacilities: ["Wheelchair Services", "First Aid"],
      },
      {
        id: "hardrock-gate-b",
        name: "Gate B – Northeast Entry",
        accessible: false,
        nearbyFacilities: ["Restrooms", "Merchandise"],
      },
      {
        id: "hardrock-gate-c",
        name: "Gate C – Southeast Entry",
        accessible: true,
        nearbyFacilities: ["Food Court", "ATM"],
      },
      {
        id: "hardrock-gate-d",
        name: "Gate D – Southwest Entry",
        accessible: true,
        nearbyFacilities: ["Nursing Room", "Family Zone"],
      },
      {
        id: "hardrock-gate-e",
        name: "Gate E – Club & Suite Entry",
        accessible: true,
        nearbyFacilities: ["VIP Lounge", "Quiet Zone"],
      },
    ],
    zones: [
      {
        id: "hardrock-zone-lower-100",
        name: "100 Level – Lower Bowl",
        capacity: 20000,
        description: "Lower seating closest to the field.",
      },
      {
        id: "hardrock-zone-club-200",
        name: "200 Level – Club Seating",
        capacity: 8000,
        description:
          "Premium climate-controlled club level with all-inclusive food and beverage.",
      },
      {
        id: "hardrock-zone-upper-300",
        name: "300 Level – Upper Deck",
        capacity: 18000,
        description: "Upper-tier seating with shade from the canopy roof.",
      },
      {
        id: "hardrock-zone-suites",
        name: "Suite Level",
        capacity: 4000,
        description:
          "Private suites with dedicated entrances and catering services.",
      },
      {
        id: "hardrock-zone-north-end",
        name: "North End Zone – Fan Deck",
        capacity: 8000,
        description:
          "Open-air fan deck behind the north goal with standing and seated sections.",
      },
      {
        id: "hardrock-zone-south-end",
        name: "South End Zone Terrace",
        capacity: 6767,
        description:
          "Terrace-style seating behind the south goal with food vendors.",
      },
    ],
    facilities: [
      {
        type: "first_aid",
        name: "Northwest Medical Station",
        nearGate: "hardrock-gate-a",
        description:
          "Fully equipped medical station with EMTs and AED devices on the main concourse.",
      },
      {
        type: "nursing_room",
        name: "Family Care Suite – Southwest",
        nearGate: "hardrock-gate-d",
        description:
          "Air-conditioned nursing room with changing tables and private seating.",
      },
      {
        type: "wheelchair_entrance",
        name: "ADA Entry – Northwest",
        nearGate: "hardrock-gate-a",
        description:
          "Primary accessible entry with ramp, elevator, and companion seating pathways.",
      },
      {
        type: "quiet_zone",
        name: "Sensory Room – Club Level",
        nearGate: "hardrock-gate-e",
        description:
          "Dedicated sensory room with low lighting and a live game feed.",
      },
      {
        type: "food_court",
        name: "Taste of Miami – Southeast Concourse",
        nearGate: "hardrock-gate-c",
        description:
          "Multi-vendor food area featuring Cuban, Caribbean, and Latin American cuisine.",
      },
    ],
    transport: [
      {
        type: "shuttle",
        name: "FIFA Fan Shuttle – Miami Beach / Brickell",
        nearGate: "hardrock-gate-a",
        estimatedWalkMinutes: 4,
      },
      {
        type: "bus",
        name: "Miami-Dade Transit Route 297 (Stadium Express)",
        nearGate: "hardrock-gate-b",
        estimatedWalkMinutes: 8,
      },
      {
        type: "train",
        name: "Tri-Rail / Brightline – Aventura Station + Shuttle",
        nearGate: "hardrock-gate-a",
        estimatedWalkMinutes: 20,
      },
      {
        type: "parking",
        name: "Hard Rock Parking Lots (Orange, Blue, Green)",
        nearGate: "hardrock-gate-c",
        estimatedWalkMinutes: 10,
      },
    ],
  },

  // ==========================================================================
  // KEY STADIUM 5 – BC Place (Full Detail)
  // ==========================================================================
  {
    id: "bc-place",
    name: "BC Place",
    city: "Vancouver",
    country: "Canada",
    capacity: 54500,
    gates: [
      {
        id: "bc-gate-a",
        name: "Gate A – Terry Fox Plaza",
        accessible: true,
        nearbyFacilities: ["Wheelchair Services", "Information Desk"],
      },
      {
        id: "bc-gate-b",
        name: "Gate B – Beatty Street",
        accessible: true,
        nearbyFacilities: ["First Aid", "Restrooms"],
      },
      {
        id: "bc-gate-c",
        name: "Gate C – Pacific Boulevard",
        accessible: false,
        nearbyFacilities: ["Food Court", "Merchandise"],
      },
      {
        id: "bc-gate-d",
        name: "Gate D – Robson Street",
        accessible: true,
        nearbyFacilities: ["Nursing Room", "Quiet Zone"],
      },
      {
        id: "bc-gate-e",
        name: "Gate E – Expo Boulevard",
        accessible: false,
        nearbyFacilities: ["Restrooms", "ATM"],
      },
    ],
    zones: [
      {
        id: "bc-zone-lower-bowl",
        name: "Lower Bowl",
        capacity: 18000,
        description:
          "Closest seating to the pitch, wrapping around the retractable-roof stadium.",
      },
      {
        id: "bc-zone-upper-bowl",
        name: "Upper Bowl",
        capacity: 20000,
        description: "Upper-tier seating with views of the Vancouver skyline.",
      },
      {
        id: "bc-zone-club",
        name: "West Club Seats",
        capacity: 5000,
        description:
          "Premium club seating with lounge access on the west sideline.",
      },
      {
        id: "bc-zone-suites",
        name: "Luxury Suites",
        capacity: 2500,
        description:
          "50+ private suites with catering and dedicated elevators.",
      },
      {
        id: "bc-zone-north-end",
        name: "North End Supporters Section",
        capacity: 5000,
        description:
          "General-admission standing section for the most passionate fans.",
      },
      {
        id: "bc-zone-south-terrace",
        name: "South Terrace",
        capacity: 4000,
        description:
          "Open terrace seating behind the south goal with drink rail.",
      },
    ],
    facilities: [
      {
        type: "first_aid",
        name: "Beatty Street Medical Station",
        nearGate: "bc-gate-b",
        description:
          "Full medical station staffed by BC Ambulance Service paramedics.",
      },
      {
        type: "nursing_room",
        name: "Robson Family Room",
        nearGate: "bc-gate-d",
        description:
          "Private nursing suite with change tables and comfortable seating.",
      },
      {
        type: "wheelchair_entrance",
        name: "ADA/AODA Accessible Entry – Terry Fox Plaza",
        nearGate: "bc-gate-a",
        description:
          "Level-entry accessible gate with elevator access to all levels.",
      },
      {
        type: "quiet_zone",
        name: "Sensory Room – Upper Concourse",
        nearGate: "bc-gate-d",
        description:
          "Calm space with adjustable lighting and live game audio feed.",
      },
      {
        type: "food_court",
        name: "Pacific Rim Food Hall",
        nearGate: "bc-gate-c",
        description:
          "Diverse food hall with Pacific Northwest cuisine, sushi, and plant-based options.",
      },
    ],
    transport: [
      {
        type: "train",
        name: "SkyTrain Expo/Canada Line – Stadium-Chinatown Station",
        nearGate: "bc-gate-a",
        estimatedWalkMinutes: 5,
      },
      {
        type: "bus",
        name: "TransLink Bus 15 (Cambie / Downtown)",
        nearGate: "bc-gate-c",
        estimatedWalkMinutes: 7,
      },
      {
        type: "shuttle",
        name: "FIFA Fan Shuttle – Canada Place / Waterfront",
        nearGate: "bc-gate-a",
        estimatedWalkMinutes: 3,
      },
      {
        type: "parking",
        name: "BC Place Parkade (Expo Blvd Entrance)",
        nearGate: "bc-gate-e",
        estimatedWalkMinutes: 5,
      },
    ],
  },

  // ==========================================================================
  // ABBREVIATED STADIUMS (11 remaining)
  // ==========================================================================

  // --- AT&T Stadium ---
  {
    id: "att-stadium",
    name: "AT&T Stadium",
    city: "Arlington, TX",
    country: "USA",
    capacity: 80000,
    gates: [
      {
        id: "att-gate-a",
        name: "Gate A – East Plaza",
        accessible: true,
        nearbyFacilities: ["Wheelchair Services", "First Aid"],
      },
      {
        id: "att-gate-b",
        name: "Gate B – West Entry",
        accessible: true,
        nearbyFacilities: ["Food Court", "Restrooms"],
      },
      {
        id: "att-gate-c",
        name: "Gate C – South End Zone",
        accessible: false,
        nearbyFacilities: ["Merchandise"],
      },
      {
        id: "att-gate-d",
        name: "Gate D – North VIP",
        accessible: true,
        nearbyFacilities: ["VIP Lounge", "Quiet Zone"],
      },
    ],
    zones: [
      {
        id: "att-zone-lower",
        name: "Lower Bowl",
        capacity: 25000,
        description: "Lower-tier field-level seating.",
      },
      {
        id: "att-zone-club",
        name: "Hall of Fame Level",
        capacity: 12000,
        description:
          "Premium mid-level seating with indoor club access.",
      },
      {
        id: "att-zone-upper",
        name: "Upper Concourse",
        capacity: 28000,
        description: "Upper-tier seating under the retractable roof.",
      },
      {
        id: "att-zone-party",
        name: "Party Pass Standing Deck",
        capacity: 15000,
        description: "Standing-room-only area in the end zones.",
      },
    ],
    facilities: [
      {
        type: "first_aid",
        name: "East Plaza Medical Station",
        nearGate: "att-gate-a",
        description: "Staffed medical station on the main concourse.",
      },
      {
        type: "wheelchair_entrance",
        name: "ADA Entry – East Plaza",
        nearGate: "att-gate-a",
        description: "Fully accessible entrance with elevator to all levels.",
      },
      {
        type: "food_court",
        name: "Legends Food Court – West",
        nearGate: "att-gate-b",
        description:
          "Multi-vendor food area with Tex-Mex and BBQ options.",
      },
    ],
    transport: [
      {
        type: "shuttle",
        name: "FIFA Fan Shuttle – Dallas / Fort Worth",
        nearGate: "att-gate-a",
        estimatedWalkMinutes: 5,
      },
      {
        type: "parking",
        name: "AT&T Stadium Lots (A–F)",
        nearGate: "att-gate-c",
        estimatedWalkMinutes: 10,
      },
      {
        type: "bus",
        name: "Arlington MAX (Entertainment District)",
        nearGate: "att-gate-b",
        estimatedWalkMinutes: 8,
      },
    ],
  },

  // --- NRG Stadium ---
  {
    id: "nrg-stadium",
    name: "NRG Stadium",
    city: "Houston, TX",
    country: "USA",
    capacity: 72220,
    gates: [
      {
        id: "nrg-gate-a",
        name: "Gate A – North Entry",
        accessible: true,
        nearbyFacilities: ["Wheelchair Services", "Information Booth"],
      },
      {
        id: "nrg-gate-b",
        name: "Gate B – South Entry",
        accessible: true,
        nearbyFacilities: ["First Aid", "Restrooms"],
      },
      {
        id: "nrg-gate-c",
        name: "Gate C – East Club",
        accessible: false,
        nearbyFacilities: ["VIP Lounge", "Food Court"],
      },
      {
        id: "nrg-gate-d",
        name: "Gate D – West General",
        accessible: true,
        nearbyFacilities: ["Restrooms", "Merchandise"],
      },
    ],
    zones: [
      {
        id: "nrg-zone-lower",
        name: "Lower Level (100s)",
        capacity: 22000,
        description: "Lower-bowl seating surrounding the field.",
      },
      {
        id: "nrg-zone-club",
        name: "Club Level (300s)",
        capacity: 10000,
        description: "Climate-controlled club seating with premium amenities.",
      },
      {
        id: "nrg-zone-upper",
        name: "Upper Level (500s)",
        capacity: 25000,
        description: "Upper-tier seating under the retractable roof.",
      },
      {
        id: "nrg-zone-suites",
        name: "Luxury Suites",
        capacity: 5000,
        description: "Private suites with full catering.",
      },
    ],
    facilities: [
      {
        type: "first_aid",
        name: "South Medical Station",
        nearGate: "nrg-gate-b",
        description: "EMT-staffed first aid on the main concourse.",
      },
      {
        type: "nursing_room",
        name: "Family Room – North",
        nearGate: "nrg-gate-a",
        description: "Nursing and family care room with changing stations.",
      },
      {
        type: "food_court",
        name: "Texans Grille – West Concourse",
        nearGate: "nrg-gate-d",
        description: "BBQ and Tex-Mex food vendors.",
      },
    ],
    transport: [
      {
        type: "metro",
        name: "METRORail Red Line – NRG Park / Fannin South",
        nearGate: "nrg-gate-a",
        estimatedWalkMinutes: 7,
      },
      {
        type: "shuttle",
        name: "FIFA Fan Shuttle – Downtown Houston",
        nearGate: "nrg-gate-a",
        estimatedWalkMinutes: 4,
      },
      {
        type: "parking",
        name: "NRG Park Lots (Blue, Teal, Yellow)",
        nearGate: "nrg-gate-d",
        estimatedWalkMinutes: 12,
      },
    ],
  },

  // --- Mercedes-Benz Stadium ---
  {
    id: "mercedes-benz-stadium",
    name: "Mercedes-Benz Stadium",
    city: "Atlanta, GA",
    country: "USA",
    capacity: 71000,
    gates: [
      {
        id: "mb-gate-a",
        name: "Gate A – Andrew Young International Blvd",
        accessible: true,
        nearbyFacilities: ["Wheelchair Services", "First Aid"],
      },
      {
        id: "mb-gate-b",
        name: "Gate B – Northside Drive",
        accessible: true,
        nearbyFacilities: ["Restrooms", "Food Court"],
      },
      {
        id: "mb-gate-c",
        name: "Gate C – Martin Luther King Jr. Dr",
        accessible: false,
        nearbyFacilities: ["Merchandise", "ATM"],
      },
      {
        id: "mb-gate-d",
        name: "Gate D – Centennial Olympic Park",
        accessible: true,
        nearbyFacilities: ["Nursing Room", "Information Booth"],
      },
    ],
    zones: [
      {
        id: "mb-zone-100",
        name: "100 Level – Lower Bowl",
        capacity: 21000,
        description: "Closest seating to the field on the lower level.",
      },
      {
        id: "mb-zone-200",
        name: "200 Level – Club",
        capacity: 13000,
        description: "Premium club seating with all-inclusive amenities.",
      },
      {
        id: "mb-zone-300",
        name: "300 Level – Upper",
        capacity: 24000,
        description: "Upper-tier seating under the retractable oculus roof.",
      },
      {
        id: "mb-zone-suites",
        name: "Suites & Loge Boxes",
        capacity: 5000,
        description: "190+ private suites and loge-level premium boxes.",
      },
    ],
    facilities: [
      {
        type: "first_aid",
        name: "AYI Blvd Medical Station",
        nearGate: "mb-gate-a",
        description: "Grady EMS-staffed station on the main concourse.",
      },
      {
        type: "wheelchair_entrance",
        name: "ADA Entry – Andrew Young Intl Blvd",
        nearGate: "mb-gate-a",
        description: "Primary accessible gate with elevator bank access.",
      },
      {
        type: "food_court",
        name: "Hometown Fare – Northside Concourse",
        nearGate: "mb-gate-b",
        description:
          "Affordable food options with Atlanta-inspired vendors and fan-friendly pricing.",
      },
    ],
    transport: [
      {
        type: "metro",
        name: "MARTA – Vine City Station",
        nearGate: "mb-gate-a",
        estimatedWalkMinutes: 10,
      },
      {
        type: "metro",
        name: "MARTA – GWCC / CNN Center Station",
        nearGate: "mb-gate-d",
        estimatedWalkMinutes: 8,
      },
      {
        type: "parking",
        name: "Marshalling Yards (Red, Blue Decks)",
        nearGate: "mb-gate-c",
        estimatedWalkMinutes: 12,
      },
    ],
  },

  // --- Lumen Field ---
  {
    id: "lumen-field",
    name: "Lumen Field",
    city: "Seattle, WA",
    country: "USA",
    capacity: 68740,
    gates: [
      {
        id: "lumen-gate-a",
        name: "Gate A – North Entry (Occidental Ave)",
        accessible: true,
        nearbyFacilities: ["First Aid", "Wheelchair Services"],
      },
      {
        id: "lumen-gate-b",
        name: "Gate B – South Entry (Royal Brougham Way)",
        accessible: true,
        nearbyFacilities: ["Restrooms", "Food Court"],
      },
      {
        id: "lumen-gate-c",
        name: "Gate C – East Hawke's Nest",
        accessible: false,
        nearbyFacilities: ["Merchandise"],
      },
    ],
    zones: [
      {
        id: "lumen-zone-lower",
        name: "Lower Level (100s)",
        capacity: 22000,
        description: "Lower-bowl seating with covered overhang on the west.",
      },
      {
        id: "lumen-zone-club",
        name: "Delta Sky360 Club",
        capacity: 8000,
        description: "Premium mid-level club with panoramic Puget Sound views.",
      },
      {
        id: "lumen-zone-upper",
        name: "Upper Level (300s)",
        capacity: 25000,
        description:
          "Upper seating known for generating the famous '12th Man' noise.",
      },
      {
        id: "lumen-zone-hawks-nest",
        name: "Hawks Nest",
        capacity: 7000,
        description: "Fan section behind the south end zone.",
      },
    ],
    facilities: [
      {
        type: "first_aid",
        name: "North First Aid Station",
        nearGate: "lumen-gate-a",
        description: "Staffed medical station near the north concourse.",
      },
      {
        type: "wheelchair_entrance",
        name: "ADA Entry – North",
        nearGate: "lumen-gate-a",
        description: "Accessible entrance with elevator access to all levels.",
      },
    ],
    transport: [
      {
        type: "train",
        name: "Link Light Rail – Stadium Station",
        nearGate: "lumen-gate-b",
        estimatedWalkMinutes: 5,
      },
      {
        type: "train",
        name: "Sounder Commuter Rail – King Street Station",
        nearGate: "lumen-gate-a",
        estimatedWalkMinutes: 8,
      },
      {
        type: "bus",
        name: "King County Metro – Routes 101, 150 (4th Ave S)",
        nearGate: "lumen-gate-a",
        estimatedWalkMinutes: 10,
      },
    ],
  },

  // --- Levi's Stadium ---
  {
    id: "levis-stadium",
    name: "Levi's Stadium",
    city: "Santa Clara, CA",
    country: "USA",
    capacity: 68500,
    gates: [
      {
        id: "levis-gate-a",
        name: "Gate A – Intel Lot Entry",
        accessible: true,
        nearbyFacilities: ["Wheelchair Ramp", "First Aid"],
      },
      {
        id: "levis-gate-b",
        name: "Gate B – Tasman Drive",
        accessible: true,
        nearbyFacilities: ["Restrooms", "Nursing Room"],
      },
      {
        id: "levis-gate-c",
        name: "Gate C – Great America Parkway",
        accessible: false,
        nearbyFacilities: ["Food Court", "Merchandise"],
      },
      {
        id: "levis-gate-d",
        name: "Gate D – VIP / Suite Entry",
        accessible: true,
        nearbyFacilities: ["VIP Lounge"],
      },
    ],
    zones: [
      {
        id: "levis-zone-lower",
        name: "Lower Bowl (100 Level)",
        capacity: 22000,
        description: "Field-level seating surrounding the pitch.",
      },
      {
        id: "levis-zone-club",
        name: "Levi's 75 Club",
        capacity: 9000,
        description: "Premium club seating with indoor lounges.",
      },
      {
        id: "levis-zone-upper",
        name: "Upper Deck (300 Level)",
        capacity: 26000,
        description: "Upper-level seating with Bay Area skyline views.",
      },
    ],
    facilities: [
      {
        type: "first_aid",
        name: "Intel Lot Medical Station",
        nearGate: "levis-gate-a",
        description: "First-aid station at the main entry concourse.",
      },
      {
        type: "nursing_room",
        name: "Family Suite – Tasman",
        nearGate: "levis-gate-b",
        description: "Private nursing room with baby-changing amenities.",
      },
      {
        type: "food_court",
        name: "Silicon Valley Eats",
        nearGate: "levis-gate-c",
        description:
          "Multi-vendor food area with farm-to-table and global cuisine options.",
      },
    ],
    transport: [
      {
        type: "train",
        name: "VTA Light Rail – Great America Station",
        nearGate: "levis-gate-c",
        estimatedWalkMinutes: 8,
      },
      {
        type: "shuttle",
        name: "FIFA Fan Shuttle – San Jose Diridon",
        nearGate: "levis-gate-a",
        estimatedWalkMinutes: 4,
      },
      {
        type: "parking",
        name: "Great America Parking (Red, Blue, Green Lots)",
        nearGate: "levis-gate-c",
        estimatedWalkMinutes: 10,
      },
    ],
  },

  // --- Lincoln Financial Field ---
  {
    id: "lincoln-financial-field",
    name: "Lincoln Financial Field",
    city: "Philadelphia, PA",
    country: "USA",
    capacity: 69328,
    gates: [
      {
        id: "linc-gate-a",
        name: "Gate A – West Entry (11th Street)",
        accessible: true,
        nearbyFacilities: ["First Aid", "Wheelchair Services"],
      },
      {
        id: "linc-gate-b",
        name: "Gate B – East Entry (Pattison Ave)",
        accessible: true,
        nearbyFacilities: ["Restrooms", "Food Court"],
      },
      {
        id: "linc-gate-c",
        name: "Gate C – South Entry",
        accessible: false,
        nearbyFacilities: ["Merchandise"],
      },
    ],
    zones: [
      {
        id: "linc-zone-lower",
        name: "Lower Level (100s)",
        capacity: 22000,
        description: "Lower-bowl seating wrapping the entire field.",
      },
      {
        id: "linc-zone-club",
        name: "Club Level",
        capacity: 10000,
        description: "Premium club seats with climate-controlled lounge.",
      },
      {
        id: "linc-zone-upper",
        name: "Upper Level (200s)",
        capacity: 26000,
        description: "Upper-tier seating with rooftop concourse access.",
      },
    ],
    facilities: [
      {
        type: "first_aid",
        name: "West Gate Medical Station",
        nearGate: "linc-gate-a",
        description: "EMT-staffed first aid near the west concourse.",
      },
      {
        type: "wheelchair_entrance",
        name: "ADA Entry – West",
        nearGate: "linc-gate-a",
        description:
          "Fully accessible entrance with ramp and elevator to all levels.",
      },
    ],
    transport: [
      {
        type: "metro",
        name: "SEPTA Broad Street Line – NRG Station",
        nearGate: "linc-gate-a",
        estimatedWalkMinutes: 5,
      },
      {
        type: "shuttle",
        name: "FIFA Fan Shuttle – 30th Street Station",
        nearGate: "linc-gate-a",
        estimatedWalkMinutes: 4,
      },
      {
        type: "parking",
        name: "Sports Complex Lots (M–Q)",
        nearGate: "linc-gate-c",
        estimatedWalkMinutes: 10,
      },
    ],
  },

  // --- Gillette Stadium ---
  {
    id: "gillette-stadium",
    name: "Gillette Stadium",
    city: "Foxborough, MA",
    country: "USA",
    capacity: 65878,
    gates: [
      {
        id: "gillette-gate-a",
        name: "Gate A – Patriot Place Entry",
        accessible: true,
        nearbyFacilities: ["First Aid", "Wheelchair Services"],
      },
      {
        id: "gillette-gate-b",
        name: "Gate B – East Entry",
        accessible: true,
        nearbyFacilities: ["Restrooms", "Food Court"],
      },
      {
        id: "gillette-gate-c",
        name: "Gate C – South Lot Entry",
        accessible: false,
        nearbyFacilities: ["Merchandise"],
      },
    ],
    zones: [
      {
        id: "gillette-zone-lower",
        name: "Lower Bowl (100s)",
        capacity: 21000,
        description: "Lower-level sideline and end zone seating.",
      },
      {
        id: "gillette-zone-club",
        name: "Putnam Club Level",
        capacity: 9000,
        description: "Premium club seating with all-inclusive food and drink.",
      },
      {
        id: "gillette-zone-upper",
        name: "Upper Level (300s)",
        capacity: 24000,
        description: "Upper-tier seating surrounding the entire stadium.",
      },
    ],
    facilities: [
      {
        type: "first_aid",
        name: "Patriot Place Medical Station",
        nearGate: "gillette-gate-a",
        description: "EMT-staffed first aid on the main concourse.",
      },
      {
        type: "food_court",
        name: "Patriot Place Food Hall",
        nearGate: "gillette-gate-a",
        description:
          "Adjacent retail/food complex with New England seafood and classic American fare.",
      },
    ],
    transport: [
      {
        type: "train",
        name: "MBTA Commuter Rail – Foxboro Station (Event Service)",
        nearGate: "gillette-gate-a",
        estimatedWalkMinutes: 7,
      },
      {
        type: "shuttle",
        name: "FIFA Fan Shuttle – Boston South Station",
        nearGate: "gillette-gate-a",
        estimatedWalkMinutes: 5,
      },
      {
        type: "parking",
        name: "Gillette Stadium Lots (P1–P15)",
        nearGate: "gillette-gate-c",
        estimatedWalkMinutes: 12,
      },
    ],
  },

  // --- Arrowhead Stadium ---
  {
    id: "arrowhead-stadium",
    name: "Arrowhead Stadium",
    city: "Kansas City, MO",
    country: "USA",
    capacity: 76416,
    gates: [
      {
        id: "arrowhead-gate-a",
        name: "Gate A – East Red Entrance",
        accessible: true,
        nearbyFacilities: ["First Aid", "Wheelchair Services"],
      },
      {
        id: "arrowhead-gate-b",
        name: "Gate B – West Gold Entrance",
        accessible: true,
        nearbyFacilities: ["Restrooms", "Food Court"],
      },
      {
        id: "arrowhead-gate-c",
        name: "Gate C – North Entry",
        accessible: false,
        nearbyFacilities: ["Merchandise"],
      },
      {
        id: "arrowhead-gate-d",
        name: "Gate D – South Entry",
        accessible: true,
        nearbyFacilities: ["Nursing Room", "Quiet Zone"],
      },
    ],
    zones: [
      {
        id: "arrowhead-zone-lower",
        name: "Lower Level (100s)",
        capacity: 23000,
        description: "Lower-bowl seating known for intense crowd atmosphere.",
      },
      {
        id: "arrowhead-zone-club",
        name: "Club Level",
        capacity: 8000,
        description: "Premium mid-level club with climate-controlled lounges.",
      },
      {
        id: "arrowhead-zone-upper",
        name: "Upper Level (300s)",
        capacity: 30000,
        description: "Upper-tier seats in one of the loudest stadiums in the world.",
      },
    ],
    facilities: [
      {
        type: "first_aid",
        name: "East Red Medical Station",
        nearGate: "arrowhead-gate-a",
        description: "Staffed medical station on the lower concourse.",
      },
      {
        type: "wheelchair_entrance",
        name: "ADA Entry – East Red",
        nearGate: "arrowhead-gate-a",
        description: "Accessible entrance with elevator to all seating levels.",
      },
      {
        type: "food_court",
        name: "KC BBQ Pavilion – West",
        nearGate: "arrowhead-gate-b",
        description: "Kansas City BBQ vendors and classic American concessions.",
      },
    ],
    transport: [
      {
        type: "shuttle",
        name: "FIFA Fan Shuttle – Union Station / Power & Light District",
        nearGate: "arrowhead-gate-a",
        estimatedWalkMinutes: 5,
      },
      {
        type: "bus",
        name: "KCATA Event Express – Truman Sports Complex",
        nearGate: "arrowhead-gate-b",
        estimatedWalkMinutes: 8,
      },
      {
        type: "parking",
        name: "Truman Sports Complex Lots (A–L)",
        nearGate: "arrowhead-gate-c",
        estimatedWalkMinutes: 10,
      },
    ],
  },

  // --- Estadio Akron ---
  {
    id: "estadio-akron",
    name: "Estadio Akron",
    city: "Guadalajara",
    country: "Mexico",
    capacity: 49850,
    gates: [
      {
        id: "akron-gate-1",
        name: "Puerta 1 – Entrada Principal",
        accessible: true,
        nearbyFacilities: ["Wheelchair Ramp", "Information Booth"],
      },
      {
        id: "akron-gate-2",
        name: "Puerta 2 – Acceso Norte",
        accessible: false,
        nearbyFacilities: ["Restrooms", "Food Court"],
      },
      {
        id: "akron-gate-3",
        name: "Puerta 3 – Acceso Sur",
        accessible: true,
        nearbyFacilities: ["First Aid", "Nursing Room"],
      },
    ],
    zones: [
      {
        id: "akron-zone-baja",
        name: "Zona Baja",
        capacity: 18000,
        description: "Lower-tier seating closest to the pitch.",
      },
      {
        id: "akron-zone-alta",
        name: "Zona Alta",
        capacity: 22000,
        description: "Upper-tier seating with volcano-shaped roof coverage.",
      },
      {
        id: "akron-zone-palcos",
        name: "Palcos (VIP Boxes)",
        capacity: 5000,
        description: "Premium box suites along the west sideline.",
      },
    ],
    facilities: [
      {
        type: "first_aid",
        name: "Estación Médica – Sur",
        nearGate: "akron-gate-3",
        description: "Red Cross first-aid station near the south entrance.",
      },
      {
        type: "wheelchair_entrance",
        name: "Acceso Inclusivo – Puerta 1",
        nearGate: "akron-gate-1",
        description: "Accessible entrance with ramp and companion seating.",
      },
    ],
    transport: [
      {
        type: "bus",
        name: "Macrobús Línea 1 – Estación Zapopan Centro",
        nearGate: "akron-gate-1",
        estimatedWalkMinutes: 15,
      },
      {
        type: "shuttle",
        name: "FIFA Fan Shuttle – Centro Histórico GDL",
        nearGate: "akron-gate-1",
        estimatedWalkMinutes: 5,
      },
      {
        type: "parking",
        name: "Estacionamiento Akron (Lotes 1–4)",
        nearGate: "akron-gate-2",
        estimatedWalkMinutes: 8,
      },
    ],
  },

  // --- Estadio BBVA ---
  {
    id: "estadio-bbva",
    name: "Estadio BBVA",
    city: "Monterrey",
    country: "Mexico",
    capacity: 53500,
    gates: [
      {
        id: "bbva-gate-1",
        name: "Puerta 1 – Acceso Principal Norte",
        accessible: true,
        nearbyFacilities: ["Wheelchair Services", "First Aid"],
      },
      {
        id: "bbva-gate-2",
        name: "Puerta 2 – Acceso Sur",
        accessible: true,
        nearbyFacilities: ["Restrooms", "Food Court"],
      },
      {
        id: "bbva-gate-3",
        name: "Puerta 3 – Acceso Oriente VIP",
        accessible: false,
        nearbyFacilities: ["VIP Lounge", "Merchandise"],
      },
    ],
    zones: [
      {
        id: "bbva-zone-lower",
        name: "Zona Baja",
        capacity: 20000,
        description:
          "Lower-tier seating with the iconic Cerro de la Silla mountain backdrop.",
      },
      {
        id: "bbva-zone-upper",
        name: "Zona Alta",
        capacity: 24000,
        description: "Upper-tier seating around the steel-clad bowl.",
      },
      {
        id: "bbva-zone-palcos",
        name: "Palcos Premium",
        capacity: 5000,
        description: "VIP box suites with premium catering.",
      },
    ],
    facilities: [
      {
        type: "first_aid",
        name: "Estación Médica – Norte",
        nearGate: "bbva-gate-1",
        description: "Staffed medical station at the north concourse.",
      },
      {
        type: "wheelchair_entrance",
        name: "Acceso Inclusivo – Puerta 1",
        nearGate: "bbva-gate-1",
        description: "Fully accessible entry with companion seating areas.",
      },
      {
        type: "food_court",
        name: "Sabores Regiomontanos",
        nearGate: "bbva-gate-2",
        description:
          "Local Monterrey cuisine featuring carne asada, cabrito, and more.",
      },
    ],
    transport: [
      {
        type: "metro",
        name: "Metrorrey Línea 1 – Estación General Anaya",
        nearGate: "bbva-gate-1",
        estimatedWalkMinutes: 20,
      },
      {
        type: "shuttle",
        name: "FIFA Fan Shuttle – Macroplaza / Fundidora",
        nearGate: "bbva-gate-1",
        estimatedWalkMinutes: 5,
      },
      {
        type: "parking",
        name: "Estacionamiento BBVA (Lotes A–C)",
        nearGate: "bbva-gate-3",
        estimatedWalkMinutes: 7,
      },
    ],
  },

  // --- BMO Field ---
  {
    id: "bmo-field",
    name: "BMO Field",
    city: "Toronto",
    country: "Canada",
    capacity: 45736,
    gates: [
      {
        id: "bmo-gate-a",
        name: "Gate A – Princes' Gates Entry",
        accessible: true,
        nearbyFacilities: ["First Aid", "Wheelchair Services"],
      },
      {
        id: "bmo-gate-b",
        name: "Gate B – BMO East Stand",
        accessible: true,
        nearbyFacilities: ["Restrooms", "Food Court"],
      },
      {
        id: "bmo-gate-c",
        name: "Gate C – South End",
        accessible: false,
        nearbyFacilities: ["Merchandise"],
      },
    ],
    zones: [
      {
        id: "bmo-zone-lower",
        name: "Lower Bowl",
        capacity: 15000,
        description:
          "Lower-tier seating with views of Lake Ontario and the CN Tower.",
      },
      {
        id: "bmo-zone-upper",
        name: "Upper Deck (Expansion)",
        capacity: 18000,
        description:
          "Expanded upper deck added for FIFA World Cup capacity requirements.",
      },
      {
        id: "bmo-zone-supporters",
        name: "South End Supporters Section",
        capacity: 4000,
        description: "Dedicated supporter standing and singing section.",
      },
    ],
    facilities: [
      {
        type: "first_aid",
        name: "Princes' Gate Medical Station",
        nearGate: "bmo-gate-a",
        description: "Staffed medical station near the main entrance.",
      },
      {
        type: "wheelchair_entrance",
        name: "AODA Accessible Entry – Princes' Gate",
        nearGate: "bmo-gate-a",
        description:
          "Fully accessible entrance compliant with Ontario AODA standards.",
      },
    ],
    transport: [
      {
        type: "train",
        name: "TTC Streetcar 509, 511 – Exhibition Loop",
        nearGate: "bmo-gate-a",
        estimatedWalkMinutes: 5,
      },
      {
        type: "train",
        name: "GO Transit – Exhibition Station",
        nearGate: "bmo-gate-a",
        estimatedWalkMinutes: 7,
      },
      {
        type: "parking",
        name: "Exhibition Place Lots (1–5)",
        nearGate: "bmo-gate-c",
        estimatedWalkMinutes: 8,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Utility Functions
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
 * gates, zones, facilities, and transport options. This string is designed to
 * be injected into a system prompt so that an LLM has full venue context.
 *
 * @param stadium - The stadium to format.
 * @returns A multi-line plain-text summary of the stadium.
 */
export function getStadiumContextForPrompt(stadium: Stadium): string {
  const lines: string[] = [];

  // Header
  lines.push(`=== ${stadium.name} ===`);
  lines.push(
    `Location: ${stadium.city}, ${stadium.country} | Capacity: ${stadium.capacity.toLocaleString()}`
  );
  lines.push("");

  // Gates
  lines.push("GATES:");
  for (const gate of stadium.gates) {
    const accessible = gate.accessible ? "♿ Accessible" : "Not wheelchair-accessible";
    lines.push(`  • ${gate.name} (${accessible})`);
    if (gate.nearbyFacilities.length > 0) {
      lines.push(`    Nearby: ${gate.nearbyFacilities.join(", ")}`);
    }
  }
  lines.push("");

  // Zones
  lines.push("ZONES:");
  for (const zone of stadium.zones) {
    lines.push(
      `  • ${zone.name} — Capacity: ${zone.capacity.toLocaleString()}`
    );
    lines.push(`    ${zone.description}`);
  }
  lines.push("");

  // Facilities
  lines.push("FACILITIES:");
  for (const facility of stadium.facilities) {
    const typeLabel = facility.type.replace(/_/g, " ").toUpperCase();
    lines.push(`  • [${typeLabel}] ${facility.name}`);
    lines.push(`    Near gate: ${facility.nearGate}`);
    lines.push(`    ${facility.description}`);
  }
  lines.push("");

  // Transport
  lines.push("TRANSPORT:");
  for (const option of stadium.transport) {
    const modeLabel = option.type.toUpperCase();
    lines.push(
      `  • [${modeLabel}] ${option.name} — ~${option.estimatedWalkMinutes} min walk to ${option.nearGate}`
    );
  }

  return lines.join("\n");
}
