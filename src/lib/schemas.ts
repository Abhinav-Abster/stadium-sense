import { z } from 'zod';
import { Type } from '@google/genai';

// ---------------------------------------------------------------------------
// Zod Output Schemas — runtime validation for Gemini responses
// ---------------------------------------------------------------------------

/** Validated shape of a /api/chat Gemini response. */
export const ChatResponseSchema = z.object({
  reply: z.string(),
  language: z.string(),
});

/** Validated shape of a /api/crowd-status Gemini response. */
export const CrowdStatusResponseSchema = z.object({
  summary: z.string(),
  recommendation: z.string(),
  alertLevel: z.enum(['low', 'medium', 'high']),
});

/** Validated shape of a /api/transport-tip Gemini response. */
export const TransportTipResponseSchema = z.object({
  suggestion: z.string(),
  estimatedCO2Saving: z.string(),
});

/** Inferred TypeScript type for chat responses. */
export type ChatResponse = z.infer<typeof ChatResponseSchema>;

/** Inferred TypeScript type for crowd-status responses. */
export type CrowdStatusResponse = z.infer<typeof CrowdStatusResponseSchema>;

/** Inferred TypeScript type for transport-tip responses. */
export type TransportTipResponse = z.infer<typeof TransportTipResponseSchema>;

// ---------------------------------------------------------------------------
// Gemini Structured-Output Schema Definitions
// ---------------------------------------------------------------------------

/** Gemini structured output schema for the /api/chat endpoint. */
export const chatGeminiSchema = {
  type: Type.OBJECT,
  properties: {
    reply: {
      type: Type.STRING,
      description: 'The assistant reply in the same language as the user message',
    },
    language: {
      type: Type.STRING,
      description: 'ISO 639-1 language code of the reply (e.g., en, es, fr, pt)',
    },
  },
  required: ['reply', 'language'],
} as const;

/** Gemini structured output schema for the /api/crowd-status endpoint. */
export const crowdStatusGeminiSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: 'Plain-language summary of current crowd conditions',
    },
    recommendation: {
      type: Type.STRING,
      description: 'Actionable recommendation for staff',
    },
    alertLevel: {
      type: Type.STRING,
      description: 'Alert level: low, medium, or high',
    },
  },
  required: ['summary', 'recommendation', 'alertLevel'],
} as const;

/** Gemini structured output schema for the /api/transport-tip endpoint. */
export const transportTipGeminiSchema = {
  type: Type.OBJECT,
  properties: {
    suggestion: {
      type: Type.STRING,
      description: 'Transit/shuttle suggestion for the fan',
    },
    estimatedCO2Saving: {
      type: Type.STRING,
      description: 'Estimated CO2 saving vs. driving (e.g., "2.5 kg CO2")',
    },
  },
  required: ['suggestion', 'estimatedCO2Saving'],
} as const;
